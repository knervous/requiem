import { OP_CODES } from './opcodes';

export class CPackedStruct {
  constructor (op_code) {
    this.buffer = new ArrayBuffer(0);
    this.view = new DataView(this.buffer);
    this.offset = 0;
    if (op_code !== undefined) {
      this.addUint16(op_code);
    }
  }

  resizeArrayBuffer (inc) {
    const buffer = new ArrayBuffer(inc);
    this.buffer = this.concatArrayBuffer(this.buffer, buffer);
  }

  addBool (value) {
    this.addBuffer(new Uint8Array([value ? 1 : 0]).buffer);
  }

  addStringWithLen (value) {
    value = `${value}`;
    const buffer = new TextEncoder().encode(value).buffer;
    this.buffer = this.concatArrayBuffer(this.buffer, buffer);
    this.offset += buffer.byteLength;
    this.addUint8(0);
  }

  addBuffer (buffer) {
    this.buffer = this.concatArrayBuffer(this.buffer, buffer);
    this.offset += buffer.byteLength;
  }

  addInt8 (value) {
    this.addBuffer(new Int8Array([value]).buffer);
  }

  addUint8 (value) {
    this.addBuffer(new Uint8Array([value]).buffer);
  }

  addInt16 (value) {
    this.addBuffer(new Int16Array([value]).buffer);
  }

  addUint16 (value) {
    this.addBuffer(new Uint16Array([value]).buffer);
  }

  addInt32 (value) {
    this.addBuffer(new Int32Array([value]).buffer);
  }

  addUint32 (value) {
    this.addBuffer(new Uint32Array([value]).buffer);
  }

  addFloat32 (value) {
    this.addBuffer(new Float32Array([value]).buffer);
  }

  addFloat64 (value) {
    this.addBuffer(new Float64Array([value]).buffer);
  }

  addBitField (value, bits) {
    const currentValue = value & ((1 << bits) - 1);
    const bitOffset = this.offset % 8;
    const byteOffset = Math.floor(this.offset / 8);
    const buffer = new ArrayBuffer(byteOffset + 1);
    const byte = this.buffer.slice(byteOffset, byteOffset + 1);
    this.view.setUint8(0, byte.getUint8(0) | (currentValue << bitOffset));
    if (bitOffset + bits > 8) {
      this.view.setUint8(1, currentValue >> (8 - bitOffset));
    }
    this.buffer = this.concatArrayBuffer(
      this.buffer.slice(0, byteOffset),
      buffer
    );
  }

  concatArrayBuffer (buffer1, buffer2) {
    const newBuffer = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    newBuffer.set(new Uint8Array(buffer1), 0);
    newBuffer.set(new Uint8Array(buffer2), buffer1.byteLength);
    return newBuffer.buffer;
  }

  getBuffer () {
    return this.buffer;
  }
}

export class EQPacket {
  /** @type {ArrayBuffer} */
  buffer = null;
  /** @type {DataView} */
  view = null;
  offset = 0;
  /**
   * @type {Set<string>}
   */
  attributes = new Set();
  /**
   * @param {ArrayBuffer | Array<any>} args
   */
  constructor (variables, args, defaultOpCode) {
    const isData = args?.[0] instanceof ArrayBuffer;
    const fullVariables =
      isData && args?.[1] === false
        ? variables
        : [['uint16', 'op_code'], ...variables];

    if (isData) {
      this.buffer = args[0];
      this.view = new DataView(this.buffer);
      this.defineVariables(fullVariables);
    } else {
      this.buffer = this.createBuffer(fullVariables, args, defaultOpCode);
    }
  }

  toObject () {
    return Array.from(this.attributes)
      .filter(a => !['op_code'].includes(a))
      .reduce((acc, val) => {
        let retVal = this[val];
        if (retVal instanceof EQPacket) {
          retVal = retVal.toObject();
        }
        if (Array.isArray(retVal)) {
          for (let i = 0; i < retVal.length; i++) {
            if (retVal[i] instanceof EQPacket) {
              retVal[i] = retVal[i].toObject();
            }
          }
        }
        return { ...acc, [val]: retVal };
      }, {});
  }

  getBuffer () {
    return this.buffer;
  }

  createBuffer (variables, array, defaultOpCode) {
    if (defaultOpCode !== undefined) {
      array.unshift(defaultOpCode);
    }
    const varLength = variables.filter(v => v[0] !== 'buffer').length;
    if (varLength !== array.length) {
      console.warn(this);
      throw new Error(
        `Unexpected variable length ${varLength} expected ${array.length}`
      );
    }
    const struct = new CPackedStruct();
    let buffMod = 0;
    for (let i = 0; i < variables.length; i++) {
      const [type, key] = variables[i];
      if (type === 'buffer') {
        ++buffMod;
      }
      const value = array[i - buffMod];

      const addType = (type, value) => {
        switch (type) {
          case 'int8':
            struct.addInt8(value);
            break;
          case 'uint8':
            struct.addUint8(value);
            break;
          case 'int16':
            struct.addInt16(value);
            break;
          case 'uint16':
            // sentinel value
            if (key === 'op_code' && value === -1) {
              break;
            }
            struct.addUint16(value);
            break;
          case 'int32':
            struct.addInt32(value);
            break;
          case 'uint32':
            struct.addUint32(value);
            break;
          case 'bool':
            struct.addBool(value);
            break;
          case 'float':
            struct.addFloat32(value);
            break;
          case 'char':
            struct.addStringWithLen(value);
            break;
          case 'buffer':
            struct.addBuffer(new ArrayBuffer(key));
            break;
          case 'fixed_char': {
            const [, length] = key;
            struct.addStringWithLen(value);
            struct.addBuffer(new ArrayBuffer(length - value.length - 1));
            break;
          }
          case 'fixed_chars': {
            const [, length] = key;
            let len = length;
            for (let v of value) {
              v = `${v}`;
              struct.addStringWithLen(v);
              len -= v.length + 1;
            }
            struct.addBuffer(new ArrayBuffer(len));
            break;
          }
          case 'struct': {
            const [, Struct] = key;
            const newStruct = new Struct(-1, ...value);
            struct.addBuffer(newStruct.buffer);
            break;
          }
          case 'fixed_array': {
            const [, objectType] = key;
            const arr = [];
            for (const v of value) {
              if (typeof objectType === 'string') {
                addType(objectType, v);
              } else {
                const newStruct = new objectType(-1, ...v);
                struct.addBuffer(newStruct.buffer);
                arr.push(newStruct);
              }
            }
            break;
          }
          default:
            break;
        }
      };

      addType(type, value);
    }
    return struct.getBuffer();
  }
  addArray (entry) {
    const arr = [];
    const [classKey, type, n, multiArr] = entry;
    for (let i = 0; i < n; i++) {
      this.addByType(type, classKey, (_key, value) => {
        arr.push(value);
      });
    }
    const key = Array.isArray(classKey) ? classKey.flat(Infinity)[0] : classKey;
    if (this[key] && Array.isArray(this[key])) {
      this[key].push(arr);
    } else if (multiArr) {
      this[key] = [arr];
    } else {
      this[key] = arr;
    }
    this.attributes.add(key);
  }

  defineVariables (variables) {
    const self = this;
    for (const [type, key] of variables) {
      this.addByType(type, key, (key, value) => {
        self[key] = value;
        self.attributes.add(key);
      });
    }
  }

  addByType (type, key, assignFn) {
    switch (type) {
      case 'int8':
        assignFn(key, this.view.getInt8(this.offset));
        this.offset += 1;
        break;
      case 'uint8':
        assignFn(key, this.view.getUint8(this.offset));
        this.offset += 1;
        break;
      case 'int16':
        assignFn(key, this.view.getInt16(this.offset));
        this.offset += 2;
        break;
      case 'uint16':
        assignFn(key, this.view.getUint16(this.offset, true));
        this.offset += 2;
        break;
      case 'int32':
        assignFn(key, this.view.getInt32(this.offset, true));
        this.offset += 4;
        break;
      case 'uint32':
        assignFn(key, this.view.getUint32(this.offset, true));
        this.offset += 4;
        break;
      case 'bool':
        assignFn(
          key,
          this.view.getUint8(this.offset, true) === 1 ? true : false
        );
        this.offset += 1;
        break;
      case 'float':
        assignFn(key, this.view.getFloat32(this.offset, true));
        this.offset += 4;
        break;
      case 'char':
        {
          const charStr = [];
          while (true) {
            try {
              const byte = this.view.getUint8(this.offset);
              if (byte === 0) {
                this.offset++;
                break;
              }
              charStr.push(byte);
              this.offset++;
            } catch {
              break;
            }
          }
          assignFn(
            key,
            new TextDecoder().decode(new Uint8Array(charStr).buffer)
          );
        }
        break;
      case 'fixed_char': {
        const [classKey, length] = key;
        const charStr = [];
        for (let i = 0; i < length; i++) {
          const byte = this.view.getUint8(this.offset);
          if (byte !== 0) {
            charStr.push(byte);
          }
          this.offset++;
        }
        assignFn(
          classKey,
          new TextDecoder().decode(new Uint8Array(charStr).buffer)
        );
        break;
      }
      case 'struct': {
        const [classKey, Struct] = key;
        const newStruct = new Struct(this.buffer.slice(this.offset), false);
        assignFn(classKey, newStruct);
        this.offset += newStruct.offset;
        delete newStruct.view;
        delete newStruct.buffer;
        break;
      }
      case 'array': {
        const [classKey, Struct] = key;
        const arr = [];
        while (this.offset !== this.view.byteLength) {
          const newStruct = new Struct(this.buffer.slice(this.offset), false);
          arr.push(newStruct);
          this.offset += newStruct.offset;
          delete newStruct.view;
          delete newStruct.buffer;
        }
        assignFn(classKey, arr);
        break;
      }
      case 'fixed_array': {
        this.addArray(key);
        break;
      }
      case 'bitmask': {
        const { totalBytes, entries } = key;
        let bitmask = Array.from(
          new Uint32Array(
            this.buffer.slice(this.offset, this.offset + totalBytes)
          )
        )
          .map(a => a.toString(2).padStart(32, '0'))
          .join('');
        
        for (const entry of entries) {
          const [key, type, len, convertFn] = entry;
          const partial = bitmask.slice(0, len);
          let val = parseInt(partial, 2);
          if (convertFn) {
            val = convertFn(val);
          }
          if (type === 'signed') {
            val = new Int16Array([val])[0];
          }
          
          assignFn(key, val);
          bitmask = bitmask.slice(len);
        }
        this.offset += totalBytes;
        break;
      }
      default:
        break;
    }
  }
}

export class PlayerLoginReply extends EQPacket {
  constructor (...args) {
    super(
      [
        ['bool', 'success'],
        ['int32', 'error_str_id'],
        ['char', 'str'],
        ['int8', 'unk1'],
        ['int8', 'unk2'],
        ['int32', 'lsid'],
        ['char', 'key'],
        ['int32', 'failed_attempts'],
        ['bool', 'show_player_count'],
        ['int32', 'offer_min_days'],
        ['int32', 'offer_min_views'],
        ['int32', 'offer_cooldown_minutes'],
        ['int32', 'web_offer_number'],
        ['int32', 'web_offer_min_days'],
        ['int32', 'web_offer_min_views'],
        ['int32', 'web_offer_cooldown_minutes'],
        ['char', 'username'],
        ['char', 'unknown']
      ],
      args
    );
  }
}

export class ListServerResponse extends EQPacket {
  constructor (...args) {
    super(
      [
        ['int32', 'sequence'],
        ['int8', 'unk1'],
        ['int8', 'unk2'],
        ['int32', 'unk3'],
        ['bool', 'success'],
        ['int32', 'error_str_id'],
        ['char', 'str'],
        ['int32', 'server_count'],
        ['array', ['server_list', ServerListReply]]
      ],
      args
    );
  }
}

export class ServerListReply extends EQPacket {
  constructor (...args) {
    super(
      [
        ['char', 'ip'],
        ['int32', 'server_type'],
        ['uint32', 'server_id'],
        ['char', 'server_name'],
        ['char', 'region'],
        ['char', 'locale'],
        ['int32', 'status'],
        ['uint32', 'players_online']
      ],
      args
    );
  }
}

export class LoginBaseMessage extends EQPacket {
  constructor (...args) {
    super(
      [
        ['int32', 'sequence'],
        ['bool', 'compressed'],
        ['int8', 'encrypt_type'],
        ['int32', 'unk3']
      ],
      args
    );
  }
}

export class LoginBaseResponse extends EQPacket {
  constructor (...args) {
    super(
      [
        ['bool', 'success'],
        ['int32', 'error_str_id'],
        ['char', 'str']
      ],
      args
    );
  }
}

export class PlayEverquestResponse extends EQPacket {
  constructor (...args) {
    super(
      [
        ['struct', ['base_reply', LoginBaseMessage]],
        ['struct', ['base_response', LoginBaseResponse]],
        ['uint32', 'server_id']
      ],
      args
    );
  }
}

export class CharacterSelect extends EQPacket {
  constructor (...args) {
    super([['array', ['characters', CharacterSelectEntry]]], args);
  }
}

export class Tint extends EQPacket {
  /**
   * @param { [blue: number, green: number, red: number, use_tint: number] | [data: ArrayBuffer]} args
   */
  constructor (...args) {
    super(
      [
        ['uint8', 'blue'],
        ['uint8', 'green'],
        ['uint8', 'red'],
        ['uint8', 'use_tint']
      ],
      args
    );
  }
}

export class Texture extends EQPacket {
  /**
   * @param { [material: number] | [data: ArrayBuffer]} args
   */
  constructor (...args) {
    super([['uint32', 'material']], args);
  }
}

export class CharacterSelectEntry extends EQPacket {
  constructor (...args) {
    super(
      [
        ['fixed_array', ['race', 'uint32', 10]],
        [
          'fixed_array',
          [[['cs_colors', Tint], 'struct', 9, true], 'fixed_array', 10]
        ],
        ['fixed_array', ['beard_color', 'uint8', 10]],
        ['fixed_array', ['hairstyle', 'uint8', 10]],
        [
          'fixed_array',
          [[['equip', Texture], 'struct', 9, true], 'fixed_array', 10]
        ],
        ['fixed_array', ['secondary_id_file', 'uint32', 10]],
        ['fixed_array', ['unk1', 'uint8', 12]],
        ['fixed_array', ['deity', 'uint32', 10]],
        ['fixed_array', ['go_home', 'bool', 10]],
        ['fixed_array', ['tutorial', 'bool', 10]],
        ['fixed_array', ['beard_type', 'uint8', 10]],
        ['fixed_array', ['unk2', 'uint8', 10]],
        ['fixed_array', ['primary_id_file', 'uint32', 10]],
        ['fixed_array', ['hair_color', 'uint8', 10]],
        ['fixed_array', ['unk2', 'uint8', 2]],
        ['fixed_array', ['zone', 'uint32', 10]],
        ['fixed_array', ['class', 'uint8', 10]],
        ['fixed_array', ['face', 'uint8', 10]],
        ['fixed_array', [['name', 64], 'fixed_char', 10]],
        ['fixed_array', ['gender', 'uint8', 10]],
        ['fixed_array', ['eye_color1', 'uint8', 10]],
        ['fixed_array', ['eye_color2', 'uint8', 10]],
        ['fixed_array', ['level', 'uint8', 10]]
      ],
      args
    );
  }
  get characters () {
    const charArray = [];
    for (let i = 0; i < 10; i++) {
      if (this.name?.[i] && this.name?.[i] !== '<none>') {
        const char = {};
        for (const attr of this.attributes) {
          char[attr] = this[attr][i];
        }
        charArray.push(char);
      }
    }
    return charArray;
  }
}

export class ZoneInfo extends EQPacket {
  /**
   * @param {[ip: string, port: number] | [data: ArrayBuffer]} args
   */
  constructor (...args) {
    super(
      [
        ['fixed_char', ['ip', 128]],
        ['uint16', 'port']
      ],
      args
    );
  }
}

export class Login extends EQPacket {
  /**
   * @param {[credentials: string] | [data: ArrayBuffer]} args
   */
  constructor (...args) {
    super([['char', 'credentials']], args, OP_CODES.OP_Login);
  }
}

export class LoginInfo extends EQPacket {
  /**
   * @param {[login_info: [lsid: string, key: string], zoning: boolean] | [data: ArrayBuffer]} args
   */
  constructor (...args) {
    super(
      [
        ['fixed_chars', ['login_info', 64]],
        ['buffer', 124],
        ['bool', 'zoning'],
        ['buffer', 275]
      ],
      args,
      OP_CODES.OP_SendLoginInfo
    );
  }
}

export class EnterWorld extends EQPacket {
  /**
   * @param {[name: string, bool: zoning, enterHome: bool] | [data: ArrayBuffer]} args
   */
  constructor (...args) {
    super(
      [
        ['fixed_char', ['name', 64]],
        ['uint32', 'tutorial'],
        ['uint32', 'enterHome']
      ],
      args,
      OP_CODES.OP_EnterWorld
    );
  }
}

export class ServerListRequest extends EQPacket {
  /**
   * @param {[sequence: number] | [data: ArrayBuffer]} args
   */
  constructor (...args) {
    super([['uint32', 'sequence']], args, OP_CODES.OP_ServerListRequest);
  }
}

export class PlayEverquest extends EQPacket {
  /**
   * @param {[loginArgs: [sequence: number, compressed: boolean, encrypt_type: number, unk3: number], serverId: number] | [data: ArrayBuffer]} args
   */
  constructor (...args) {
    super(
      [
        ['struct', ['login_base_message', LoginBaseMessage]],
        ['uint32', 'server_id']
      ],
      args,
      OP_CODES.OP_PlayEverquestRequest
    );
  }
}


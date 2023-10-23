import { EQPacket, Texture, Tint } from './EQPacket';
import { OP_CODES } from './opcodes';

const EQConvertFunctions = {
  eq10: n => n / 20,
  eq12: n => n / 4,
  eq13: n => n / 64,
  eq19: n => n / 8
};
  
const packedSpawn = [
  'bitmask',
  {
    totalBytes: 20,
    entries   : [
      // Padding is different from how this is laid out in packed struct
      // in c. Goes in reverse order
      ['padding', 'signed', 3],
      ['x', 'signed', 19, EQConvertFunctions.eq19],
      ['delta_heading', 'signed', 10, EQConvertFunctions.eq10],
  
      ['padding', 'signed', 3],
      ['animation', 'signed', 10],
      ['y', 'signed', 19, EQConvertFunctions.eq19],
  
      ['padding', 'signed', 3],
      ['delta_y', 'signed', 10, EQConvertFunctions.eq13],
      ['z', 'signed', 19, EQConvertFunctions.eq19],
  
      ['padding', 'signed', 7],
      ['heading', 'unsigned', 12, EQConvertFunctions.eq12],
      ['delta_x', 'signed', 13, EQConvertFunctions.eq13],
  
      ['delta_z', 'signed', 13, EQConvertFunctions.eq13],
      ['padding', 'signed', 19],
    ]
  }
];
  
export class Spawn extends EQPacket {
  /**
     * @param {[] | [data: ArrayBuffer]} args
     */
  constructor (...args) {
    super(
      [
        ['uint8', 'unk1'],
        ['bool', 'gm'],
        ['uint8', 'unk2'],
        ['uint8', 'aa_title'],
        ['uint8', 'unk3'],
        ['uint8', 'anon'],
        ['uint8', 'face'],
        ['fixed_char', ['name', 64]],
        ['uint16', 'deity'],
        ['uint16', 'unk4'],
        ['float', 'size'],
        ['uint32', 'unk'],
        ['uint8', 'type'],
        ['bool', 'invis'],
        ['uint8', 'hair_color'],
        ['uint8', 'current_hp'],
        ['uint8', 'max_hp'],
        ['bool', 'findable'],
        ['fixed_array', ['unk5', 'uint8', 5]],
        packedSpawn,
        ['uint8', 'eye_color'],
        ['fixed_array', ['unk5', 'uint8', 24]],
        ['bool', 'show_helm'],
        ['fixed_array', ['unk5', 'uint8', 4]],
        ['bool', 'is_npc'],
        ['uint8', 'hairstyle'],
        ['uint8', 'beard_color'],
        ['fixed_array', ['unk5', 'uint8', 4]],
        ['uint8', 'level'],
        ['uint32', 'player_state'],
        ['uint8', 'beard'],
        ['fixed_char', ['suffix', 32]],
        ['uint32', 'pet_owner_id'],
        ['uint8', 'guildrank'],
        ['fixed_array', ['unk5', 'uint8', 3]],
        ['fixed_array', [['equipment', Texture], 'struct', 9]],
        ['float', 'runspeed'],
        ['bool', 'afk'],
        ['uint32', 'guild_id'],
        ['fixed_char', ['title', 32]],
        ['uint8', 'unk5'],
        ['uint8', 'helm'],
        ['fixed_array', ['unk5', 'uint8', 8]],
        ['uint32', 'race'],
        ['uint32', 'unk5'],
        ['fixed_char', ['last_name', 32]],
        ['float', 'walkspeed'],
        ['uint8', 'unk5'],
        ['bool', 'is_pet'],
        ['uint8', 'light'],
        ['uint8', 'class'],
        ['uint8', 'eyecolor2'],
        ['uint8', 'flymode'],
        ['uint8', 'gender'],
        ['uint8', 'bodytype'],
        ['fixed_array', ['unk5', 'uint8', 3]],
        ['uint8', 'equip_chest'],
        ['uint32', 'spawn_id'],
        ['float', 'bounding_radius'],
        ['fixed_array', [['equipment_tint', Tint], 'struct', 9]],
        ['bool', 'lfg']
      ],
      args
    );
  }
}
  
export class ZoneSpawns extends EQPacket {
  constructor (...args) {
    super([['array', ['spawns', Spawn]]], args);
  }
}
  
  
export class SpawnPositionUpdate extends EQPacket {
  /**
     * @param {[] | [data: ArrayBuffer]} args
     */
  constructor (...args) {
    super([['uint16', 'spawn_id'], packedSpawn], args);
  }
}

export class SpawnDelete extends EQPacket {
  /**
       * @param {[] | [data: ArrayBuffer]} args
       */
  constructor (...args) {
    super([['uint32', 'spawn_id']], args);
  }
}
  

export class ZoneEntry extends EQPacket {
  /**
     * @param {[unk1: number, name: string] | [data: ArrayBuffer]} args
     */
  constructor (...args) {
    super(
      [
        ['uint32', 'unk1'],
        ['fixed_char', ['name', 64]]
      ],
      args,
      OP_CODES.OP_ZoneEntry
    );
  }
}
  
export class ZoneClientReady extends EQPacket {
  /**
     * @param {[] | [data: ArrayBuffer]} args
     */
  constructor (...args) {
    super([], args, OP_CODES.OP_ClientReady);
  }
}


export class ChannelMessage extends EQPacket {
  /**
       * @param {[] | [data: ArrayBuffer]} args
       */
  constructor (...args) {
    super([
      ['fixed_char', ['targetname', 64]],
      ['fixed_char', ['sender', 64]],
      ['uint32', 'language'],
      ['uint32', 'channel'],
      ['fixed_array', ['unknown', 'uint32', 2]],
      ['uint32', 'skill'],
      ['char', 'message']
    ], args);
  }
}

export class Animation extends EQPacket {
  /**
       * @param {[] | [data: ArrayBuffer]} args
       */
  constructor (...args) {
    super([
      ['uint16', 'id'],
      ['uint8', 'speed'],
      ['uint8', 'action'],
    ], args);
  }
}
  
  
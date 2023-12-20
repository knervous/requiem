import { EQMessage, getMessageType, valueOptionMap } from '../message';

function concatArrayBuffer(buffer1, buffer2) {
  const newBuffer = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  newBuffer.set(new Uint8Array(buffer1), 0);
  newBuffer.set(new Uint8Array(buffer2), buffer1.byteLength);
  return newBuffer;
}

/**
 * @param {number} opcode
 * @param {string} messageType
 * @param {object} payload
 * @returns {Uint8Array}
 */
function createPacket(opcode, payload) {
  const message = EQMessage.lookupType(getMessageType(opcode));
  const messagePayload = message.create(payload);
  const messageBuffer = message.encode(messagePayload).finish();
  const opcodeBuffer = new Uint16Array([opcode]).buffer;
  return concatArrayBuffer(opcodeBuffer, messageBuffer);
}


/**
* @type {import('../message/eq_interface').EQClientPacket & { SendOpCode: (opCode: number, payload: any) => Uint8Array}} 
 */
export const EQClientPacket = new Proxy({}, {
  get(_, path) {
    if (path === 'SendOpCode') {
      return (opCode, payload) => createPacket(opCode, payload);
    }
    const opCode = valueOptionMap[path];
    if (opCode === undefined) {
      throw new Error('Undefined op code in EQClientPacket', path);
    }
    return (payload) => createPacket(opCode, payload);
  }
});
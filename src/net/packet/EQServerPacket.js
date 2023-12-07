import { EQMessage, EQOpCodes } from '../message';

function concatArrayBuffer (buffer1, buffer2) {
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
function createPacket(opcode, messageType, payload) {
  const message = EQMessage.lookupType(messageType);
  const messagePayload = message.create(payload);
  const messageBuffer = message.encode(messagePayload).finish();
  const opcodeBuffer = new Uint16Array([opcode]).buffer;
  return concatArrayBuffer(opcodeBuffer, messageBuffer);
}

export class EQServerPacket {
  /**
  * @param  {import('../message/def/eq').LoginReply} login
  */
  static LoginReply(bytes) {
    return EQMessage.lookupType('eq.LoginReply').decode(bytes);
  }
}
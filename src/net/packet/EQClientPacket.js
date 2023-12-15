import { EQMessage, EQOpCodes, getMessageType } from '../message';

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
export class EQClientPacket {
  // LOGIN
  /**
  *  @param  {import('../message/def/eq').LoginMessage} payload
  * */
  static LoginMessage = (payload) => createPacket(EQOpCodes.OP_LoginWeb, payload);

  /**
  *  @param  {import('../message/def/eq').LoginRequest} payload
  * */
  static LoginRequest = (payload) => createPacket(EQOpCodes.OP_ServerListRequest, payload);

  /**
  *  @param  {import('../message/def/eq').PlayEverquest} payload
  * */
  static PlayEverquest = (payload) => createPacket(EQOpCodes.OP_PlayEverquestRequest, payload);

  // WORLD

  /**
  *  @param  {import('../message/def/eq').WebInitiateConnection} payload
  * */
  static WebInitiateConnection = (payload) => createPacket(EQOpCodes.OP_WebInitiateConnection, payload);

  // ZONE
  /**
  *  @param  {import('../message/def/eq').LoginInfo} payload
  * */
  static SendLoginInfo = (payload) => createPacket(EQOpCodes.OP_SendLoginInfo, payload);
}

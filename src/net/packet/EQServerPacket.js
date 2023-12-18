import { EQMessage, getMessageType } from '../message';

const decode = (bytes, opcode) => {
  const message = EQMessage.lookupType(getMessageType(opcode));
  return message.toObject(message.decode(bytes), { defaults: true });
};

export class EQServerPacket {
  /**
  * @return  {import('../message/def/eq').LoginReply}
  */
  static LoginReply(bytes, opcode) {
    return decode(bytes, opcode);
  }

  /**
  * @return  {import('../message/def/eq').LoginServerResponse}
  */
  static LoginServerResponse(bytes, opcode) {
    return decode(bytes, opcode);
  }

  /**
  * @return  {import('../message/def/eq').PlayEverquestResponse}
  */
  static PlayEverquestResponse(bytes, opcode) {
    return decode(bytes, opcode);
  }

  /**
  * @return  {import('../message/def/eq').CharacterSelect}
  */
  static CharacterSelect(bytes, opcode) {
    return decode(bytes, opcode);
  }

  /**
  * @return  {import('../message/def/eq').ZoneServerInfo}
  */
  static ZoneServerInfo(bytes, opcode) {
    return decode(bytes, opcode);
  }
}
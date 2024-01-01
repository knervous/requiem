import { EQMessage, getMessageType, valueOptionMap } from '../message';

export const decode = (bytes, opcode) => {
  const message = EQMessage.lookupType(getMessageType(opcode));
  return message.toObject(message.decode(bytes), { defaults: true });
};

/**
* @type {import('../message/eq_interface').EQServerPacket} 
 */
export const EQServerPacket = new Proxy({}, {
  get(_, path) {
    const opCode = valueOptionMap[path];
    if (opCode === undefined) {
      throw new Error('Undefined op code in EQClientPacket', path);
    }
    return (bytes) => decode(bytes, opCode);
  }
});
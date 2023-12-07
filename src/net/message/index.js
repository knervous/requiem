import protobuf from 'protobufjs';
import protoMessage from './EQMessage.proto?raw';

/**
 * @typedef {import('./def/eq').OpCodes} OpCodes
 */

/**
  * @type {import('protobufjs').Root }
  */
export const EQMessage = protobuf.parse(protoMessage).root;

/**
 * @type {{[key in OpCodes]: string}}
 */
export const EQOpCodes = EQMessage.get('eq').getEnum('OpCodes');

/**
 * 
 * @param {ArrayBuffer} buffer 
 * @returns {number}
 */
export const getOpCode = buffer => {
  const view = new DataView(buffer, 0);
  return view.getUint16(0, true);
};
  
/**
 * 
 * @param {ArrayBuffer} buffer 
 * @returns {string}
 */
export const getOpCodeDesc = buffer => {
  const view = new DataView(buffer, 0);
  const opCode = view.getUint16(0, true);
  for (const [entry, val] of Object.entries(EQOpCodes)) {
    if (val === opCode) {
      return entry;
    }
  }
  return EQOpCodes.OP_Unknown;
};
  
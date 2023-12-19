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
 * @type {{[key in OpCodes]: number}}
 */
export const EQOpCodes = EQMessage.get('eq').getEnum('OpCodes');

const opLookup = EQMessage.lookupEnum('OpCodes');

/**
 * 
 * @param {number} opCode 
 * @returns {string}
 */
export const getOpCodeDesc = opCode => opLookup.valuesById[opCode];

/**
 * @type {Record<string, number>}
 */
export const valueOptionMap = Object.entries(opLookup.valuesOptions).reduce((acc, [opKey, opValue]) => {
  const eqType = opValue['(messageType)'].replace('eq.', '');
  return {
    ...acc,
    [eqType]: opLookup.values[opKey]
  };
}, {});

/**
 * 
 * @param {number} opCode 
 * @returns {string}
 */
export const getMessageType = opCode => opLookup.valuesOptions[getOpCodeDesc(opCode)]['(messageType)'];


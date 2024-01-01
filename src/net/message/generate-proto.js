const path = require('path');
const fs = require('fs');
const protobuf = require('protobufjs');
const { generateProtocol } = require('@cldcvr/protobufjs-typescript-gen');

generateProtocol({
  protocolDir: __dirname,
  outDir     : path.join(__dirname, 'def'),
});

const protoMessage = fs.readFileSync(path.join(__dirname, './EQMessage.proto')).toString();

const EQMessage = protobuf.parse(protoMessage).root;
const opLookup = EQMessage.lookupEnum('OpCodes');

let clientPacketTypeDef = `import * as EQMessage from './def/eq';
export interface EQClientPacket {


`;

let types = [];
for (const [opKey, opValue] of Object.entries(opLookup.valuesOptions)) {
  if (!opKey.startsWith('OP_')) {
    continue;
  }
  const eqType = opValue['(messageType)'].replace('eq.', '').trim();
  if (types.includes(eqType)) {
    continue;
  }
  types.push(eqType);
  clientPacketTypeDef += `${eqType}: (payload: EQMessage.${eqType}) => Uint8Array,
  `;

}

clientPacketTypeDef += `
}

export interface EQServerPacket {


`;

types = [];
for (const [opKey, opValue] of Object.entries(opLookup.valuesOptions)) {
  if (!opKey.startsWith('OP_')) {
    continue;
  }
  const eqType = opValue['(messageType)'].replace('eq.', '').trim();
  if (types.includes(eqType)) {
    continue;
  }
  types.push(eqType);
  clientPacketTypeDef += `${eqType}: (bytes: Uint8Array) => EQMessage.${eqType},
  `;
}

clientPacketTypeDef += `

}
`;

fs.writeFileSync(path.join(__dirname, './eq_interface.d.ts'), clientPacketTypeDef);
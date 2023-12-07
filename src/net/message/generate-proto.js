// generate-protocol.js
const { generateProtocol } = require('@cldcvr/protobufjs-typescript-gen');

generateProtocol({
  protocolDir: '.',
  outDir     : './def',
});
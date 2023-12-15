const path = require('path');
const { generateProtocol } = require('@cldcvr/protobufjs-typescript-gen');

generateProtocol({
  protocolDir: __dirname,
  outDir     : path.join(__dirname, 'def'),
});
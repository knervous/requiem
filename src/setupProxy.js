const { createProxyMiddleware } = require('http-proxy-middleware');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

// const eqEmuIp = '192.168.2.102';

// const loginProxy = createProxyMiddleware('/net/login', {
//   ws         : true,
//   target     : `ws://${eqEmuIp}:7775`,
//   prependPath: false,
//   pathRewrite: {}
// });
// const worldProxy = createProxyMiddleware('/net/world', {
//   ws         : true,
//   target     : `ws://${eqEmuIp}:7777`,
//   prependPath: false,
//   pathRewrite: {}
// });
// const zoneProxies = Array.from(new Array(100), (_, i) =>
//   createProxyMiddleware('/net/zone', {
//     ws         : true,
//     target     : `ws://${eqEmuIp}:${7000 + i}`,
//     prependPath: false,
//     pathRewrite: {},
//     timeout    : 100000,
//     onError    : (e) => {
//       console.log('Had an error', e);
//     },
//   })
// );

/** @param {import('express').Application} app */
module.exports = function (app) {
  // app.use('/net/login', (req, res, next) => {
  //   loginProxy(req, res, next);
  // });

  // app.use('/net/world', (req, res, next) => {
  //   return worldProxy(req, res, next);
  // });

  // app.use('/net/zone/:port', (req, res, next) => {
  //   return zoneProxies[+req.params.port - 7000](req, res, next);
  // });
};

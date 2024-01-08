process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

/** @param {import('express').Application} app */
module.exports = function (app) {
  app.use('/api/hash', async (req, res) => {
    const port = req.query.port;
    const ip = req.query.ip;
    if (!port || !ip) {
      res.send('');
      return;
    }
    const hash = await fetch(`http://${ip}:${port}/hash`).then(r => r.text()).catch(_ => '');
    res.send(hash);
  });
};

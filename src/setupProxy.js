process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

/** @param {import('express').Application} app */
module.exports = function (app) {
  app.use('/api/hash', async (req, res) => {
    const port = req.query.port;
    if (!port) {
      res.send('');
      return;
    }
    const hash = await fetch(`http://${process.env.REACT_APP_EQ_SERVER}:${port}/hash`).then(r => r.text()).catch(_ => '');
    res.send(hash);
  });
};

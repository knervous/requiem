export const fetchCache = 'force-no-store';
export const revalidate = 0; // seconds
export const dynamic = 'force-dynamic';

export default async function handler(
  req,
  res,
) {
  const port = req.query.port;
  const ip = req.query.ip;

  if (!port || !ip) {
    res.send('');
    return;
  }
  const hash = await fetch(`http://${ip}:${port}/hash`).then(r => r.text()).catch(_ => '');
  res.send(hash);
}
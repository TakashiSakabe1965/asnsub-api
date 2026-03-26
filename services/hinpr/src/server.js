/**
 * HINPR server
 * - GET /hinpr?pn=...
 * - GET /api/hinpr?pn=...
 */
const express = require('express');
const { hinpr } = require('./hinpr');

const app = express();
function handler(req, res) {
  const pn = (req.query.pn ?? '').toString();
  const { ans, rc } = hinpr(pn);
  res.json({ ans, rc });
}
app.get('/hinpr', handler);
app.get('/api/hinpr', handler);
app.get(['/health','/hinpr/health'], (req,res)=>res.status(200).send('OK'));
const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, ()=>console.log(`HINPR listening on ${PORT}`));

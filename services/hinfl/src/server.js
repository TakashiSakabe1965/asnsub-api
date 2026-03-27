/**
 * HINFL server
 * - GET /api/hinfl?pn=...
 */
const express = require('express');
const hinfl = require('./hinfl');

const app = express();

function handler(req, res) {
  const pn = (req.query.pn ?? '').toString();
  const { ans, rc } = hinfl(pn);
  res.json({ ans, rc });
}

app.get('/hinfl', handler);
app.get('/api/hinfl', handler);

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => console.log(`HINFL listening on ${PORT}`));

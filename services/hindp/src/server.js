// asnsub-api/services/hindp/src/server.js
const express = require('express');
const { hindp } = require('./hindp');
const app = express();

function handler(req, res) {
  const pn = (req.query.pn ?? '').toString();
  const { ans, rc } = hindp(pn);
  res.json({ ans, rc });
}

app.get('/hindp', handler);
app.get('/api/hindp', handler);
app.get('/asnsub-api/hindp', handler);
app.get('/health', (req, res) => res.status(200).send('OK'));

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => console.log(`HINDP listening on ${PORT}`));

/// HINPR PAT tables loader
// src/tables.csv: kind,key,value
// kinds: NHPTN, OHPTN, NDPTN19, NDPTN11, SMPTN19, SIZAI20
// value may use ␠ (U+2420) to represent spaces.

const fs = require('fs');
const path = require('path');

function parseCsvLine(line) {
  const cols = [];
  let i = 0;

  while (i < line.length) {
    // skip whitespace
    while (i < line.length && (line[i] === ' ' || line[i] === '\t')) i++;
    if (i >= line.length) break;

    if (line[i] === '"') {
      i++;
      let buf = '';
      while (i < line.length) {
        if (line[i] === '"' && line[i + 1] === '"') { buf += '"'; i += 2; continue; }
        if (line[i] === '"') { i++; break; }
        buf += line[i++];
      }
      cols.push(buf);
      while (i < line.length && line[i] !== ',') i++;
      if (line[i] === ',') i++;
    } else {
      let j = line.indexOf(',', i);
      if (j === -1) j = line.length;
      cols.push(line.slice(i, j).trim());
      i = j + 1;
    }
  }

  return cols;
}

function loadRows() {
  const csvPath = path.join(__dirname, 'tables.csv');
  let txt = fs.readFileSync(csvPath, 'utf-8');

  // 改行正規化（正規表現を使わない：壊れない）
  if (txt.includes('\r\n')) txt = txt.replaceAll('\r\n', '\n');
  if (txt.includes('\r')) txt = txt.replaceAll('\r', '\n');

  const rows = [];
  for (const raw of txt.split('\n')) {
    const line = raw.trimEnd();
    if (!line || line.startsWith('#')) continue;

    const cols = parseCsvLine(line);
    if (cols.length < 3) continue;

    rows.push({
      kind: String(cols[0]).trim(),
      key: String(cols[1]).trim(),
      value: String(cols[2]).replace(/␠/g, ' '),
    });
  }
  return rows;
}

function loadPatterns() {
  const rows = loadRows();
  const PAT = Object.create(null);

  const nh = rows.find(r => r.kind === 'NHPTN');
  PAT.NHPTN = nh ? nh.value : '';

  PAT.OHPTN = rows
    .filter(r => r.kind === 'OHPTN')
    .sort((a, b) => Number(a.key) - Number(b.key))
    .map(r => r.value);

  PAT.NDPTN19 = Object.create(null);
  for (const r of rows.filter(r => r.kind === 'NDPTN19')) {
    PAT.NDPTN19[r.key] = r.value;
  }

  const nd11 = rows.find(r => r.kind === 'NDPTN11');
  PAT.NDPTN11 = nd11 ? nd11.value : '';

  PAT.SMPTN19 = Object.create(null);
  for (const r of rows.filter(r => r.kind === 'SMPTN19')) {
    PAT.SMPTN19[r.key] = r.value;
  }

  PAT.SIZAI20 = rows
    .filter(r => r.kind === 'SIZAI20')
    .sort((a, b) => Number(a.key) - Number(b.key))
    .map(r => r.value);

  return PAT;
}

const PAT = loadPatterns();
module.exports = { PAT, loadPatterns };

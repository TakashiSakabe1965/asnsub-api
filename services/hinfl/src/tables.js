// 処理概要:
// 1) src/tables.csv を読み込み
// 2) kind=HEAD_RULE / SHIROKI_OUTHEAD を辞書化して RULES として export する

const fs = require('fs');
const path = require('path');

function parseCsvLine(line) {
  const cols = [];
  let i = 0;

  while (i < line.length) {
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

function loadRules() {
  const csvPath = path.join(__dirname, 'tables.csv');
  let txt = fs.readFileSync(csvPath, 'utf-8');

  // 改行正規化（正規表現リテラルを使わない）
  if (txt.includes('\r\n')) txt = txt.replaceAll('\r\n', '\n');
  if (txt.includes('\r')) txt = txt.replaceAll('\r', '\n');

  const headRule = Object.create(null);
  const shirokiOutHead = Object.create(null);

  for (const raw of txt.split('\n')) {
    const line = raw.trimEnd();
    if (!line || line.startsWith('#')) continue;

    const cols = parseCsvLine(line);
    if (!cols || cols.length < 3) continue;

    const kind = cols[0];
    const key = cols[1];
    const value = cols[2];
    if (!kind || key === undefined || value === undefined) continue;

    const v = String(value).replace(/␠/g, ' ');
    if (kind === 'HEAD_RULE') headRule[String(key)] = v;
    if (kind === 'SHIROKI_OUTHEAD') shirokiOutHead[String(key)] = v;
  }

  return { headRule, shirokiOutHead };
}

const RULES = loadRules();

module.exports = { RULES, loadRules };
``
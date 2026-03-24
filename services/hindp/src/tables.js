// 処理概要:
// 1) src/tables.csv を読み込む
// 2) CSVを1行ずつパースして kind ごとに {pat, act} の配列へ変換する
// 3) pat は ␠ をスペースへ戻し、右パディングで8桁化して完全一致検索に使う
// 4) selectTable(kind) で kind に対応する配列を返す（無ければ null）

const fs = require('fs');
const path = require('path');

function padRight(s, n) {
  s = (s ?? '').toString();
  return s.length >= n ? s.slice(0, n) : s + ' '.repeat(n - s.length);
}

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

function loadTables() {
  const csvPath = path.join(__dirname, 'tables.csv');
  let txt = fs.readFileSync(csvPath, 'utf-8');

  // 改行の正規化（正規表現リテラルを使わない）
  if (txt.includes('\r\n')) txt = txt.replaceAll('\r\n', '\n');
  if (txt.includes('\r')) txt = txt.replaceAll('\r', '\n');

  const byKind = Object.create(null);

  for (const raw of txt.split('\n')) {
    const line = raw.trimEnd();
    if (!line || line.startsWith('#')) continue;

    const cols = parseCsvLine(line);
    if (cols.length < 3) continue;

    const kind = String(cols[0]).trim();
    const pat = padRight(String(cols[1]).replace(/␠/g, ' '), 8).slice(0, 8);
    const act = String(cols[2]).trim();

    if (!byKind[kind]) byKind[kind] = [];
    byKind[kind].push({ pat, act });
  }

  return byKind;
}

const TABLES = loadTables();

function selectTable(kind) {
  return TABLES[kind] || null;
}

module.exports = { selectTable, TABLES, loadTables };
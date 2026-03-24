
/**
 * HINDP core (legacy-faithful)
 * ----------------------------------------------
 * 目的:
 *   ファイル形式品番(20桁) → 表示形式品番(22桁)
 *
 * 正の根拠（提供ソース）:
 *   - XAHINDP : 0/1/6 と資材(SIZAI)のフロー、OH55/NHIN/OH73 と EDT101..311
 *   - XAGALDP : 7/8/9 の追加フロー（DENSO/試作/住電）、NDHN/SMHN と EDT402..406/501..502
 *   - XAGRPDP : 品区=3 の特殊（2桁目から19桁コピー）
 *
 * rc:
 *   - 1文字。**正規化しない**。
 *   - 正常: ' '（スペース1文字）
 *   - 資材成功: 'S'
 *   - エラー: '1'..'7'
 *
 * ans:
 *   - 常に22文字。未使用領域はスペース。
 */

const { selectTable } = require('./tables');
const BLK22 = ' '.repeat(22);
const RC_OK = ' ';
function mask11(xCount) { return 'X'.repeat(xCount) + ' '.repeat(11 - xCount); }


function padRight(s, n) {
  s = (s ?? '').toString();
  if (s.length >= n) return s.slice(0, n);
  return s + ' '.repeat(n - s.length);
}

function firstBlankIndex20(s20) {
  const i = s20.indexOf(' ');
  return i === -1 ? 20 : i;
}

function maskX(s20) {
  let out = '';
  for (let i = 0; i < s20.length; i++) out += (s20[i] === ' ' ? ' ' : 'X');
  return out;
}

function out22() { return Array.from(BLK22); }
function put(a, pos0, str) {
  for (let i = 0; i < str.length && (pos0 + i) < a.length; i++) a[pos0 + i] = str[i];
}

function errAnsSkip1(pn20) { const a = out22(); put(a,0,pn20.slice(1,20)); return a.join(''); }

// ER4: suffix pattern error → copy raw suffix(8) into ans[13..20]
function applyEr4(ansArr, pn20) {
  const tail8 = pn20.slice(12, 20);
  put(ansArr, 13, tail8);
  return ansArr.join('');
}

// ---- legacy pattern tables (8 chars patterns for tail8 mask) ----







// ---- EDT routines: write at current r9pos using input tail8 (pn20[12..]) ----
function edtWrite(ansArr, r9, tail8, id) {
  const t = tail8; // length 8
  const w = (pos, s) => put(ansArr, r9 + pos, s);
  const ch = (pos, c) => { ansArr[r9 + pos] = c; };

  switch (id) {
    case 'RETURN':
      return;
    // 101..111
    case 'EDT101': ch(0,'-'); w(1,t.slice(0,2)); ch(3,'-'); w(4,t.slice(2,4)); ch(6,'-'); w(7,t.slice(4,6)); return;
    case 'EDT102': ch(0,'-'); w(1,t.slice(0,2)); ch(3,'-'); w(4,t.slice(2,3)); ch(5,'-'); w(6,t.slice(4,6)); return;
    case 'EDT103': ch(0,'-'); w(1,t.slice(0,2)); ch(3,'-'); w(4,t.slice(2,4)); return;
    case 'EDT104': ch(0,'-'); w(1,t.slice(0,2)); ch(3,'-'); w(4,t.slice(2,3)); return;
    case 'EDT105': ch(0,'-'); w(1,t.slice(0,2)); ch(3,'-'); w(4,t.slice(4,6)); return;
    case 'EDT106': ch(0,'-'); w(1,t.slice(0,2)); return;
    case 'EDT107': ch(0,'-'); w(1,t.slice(2,4)); ch(3,'-'); w(4,t.slice(4,6)); return;
    case 'EDT108': ch(0,'-'); w(1,t.slice(2,3)); ch(2,'-'); w(3,t.slice(4,6)); return;
    case 'EDT109': ch(0,'-'); w(1,t.slice(2,4)); return;
    case 'EDT110': ch(0,'-'); w(1,t.slice(2,3)); return;
    case 'EDT111': ch(0,'-'); w(1,t.slice(4,6)); return;

    // 201..211
    case 'EDT201': ch(0,'-'); w(1,t.slice(0,2)); ch(3,'-'); w(4,t.slice(2,4)); ch(6,'-'); w(7,t.slice(4,7)); return;
    case 'EDT202': ch(0,'-'); w(1,t.slice(0,2)); ch(3,'-'); w(4,t.slice(2,3)); ch(5,'-'); w(6,t.slice(4,7)); return;
    case 'EDT203': ch(0,'-'); w(1,t.slice(0,2)); ch(3,'-'); w(4,t.slice(4,7)); return;
    case 'EDT204': ch(0,'-'); w(1,t.slice(0,2)); return;
    case 'EDT205': ch(0,'-'); w(1,t.slice(2,4)); ch(3,'-'); w(4,t.slice(4,7)); return;
    case 'EDT206': ch(0,'-'); w(1,t.slice(2,4)); return;
    case 'EDT207': ch(0,'-'); w(1,t.slice(2,3)); ch(2,'-'); w(3,t.slice(4,7)); return;
    case 'EDT208': ch(0,'-'); w(1,t.slice(2,3)); return;
    case 'EDT209': ch(0,'-'); w(1,t.slice(4,7)); return;
    case 'EDT210': ch(0,'-'); w(1,t.slice(0,2)); ch(3,'-'); w(4,t.slice(2,4)); return;
    case 'EDT211': ch(0,'-'); w(1,t.slice(0,2)); ch(3,'-'); w(4,t.slice(2,3)); return;

    // 301..311
    case 'EDT301': ch(0,'-'); w(1,t.slice(0,2)); ch(3,'-'); w(4,t.slice(2,4)); ch(6,'-'); w(7,t.slice(4,7)); return;
    case 'EDT302': ch(0,'-'); w(1,t.slice(0,2)); ch(3,'-'); w(4,t.slice(2,3)); ch(5,'-'); w(6,t.slice(4,7)); return;
    case 'EDT303': ch(0,'-'); w(1,t.slice(0,2)); ch(3,'-'); w(4,t.slice(2,4)); return;
    case 'EDT304': ch(0,'-'); w(1,t.slice(0,2)); ch(3,'-'); w(4,t.slice(2,3)); return;
    case 'EDT305': ch(0,'-'); w(1,t.slice(0,2)); return;
    case 'EDT306': ch(0,'-'); w(1,t.slice(2,4)); ch(3,'-'); w(4,t.slice(4,7)); return;
    case 'EDT307': ch(0,'-'); w(1,t.slice(2,3)); ch(2,'-'); w(3,t.slice(4,7)); return;
    case 'EDT308': ch(0,'-'); w(1,t.slice(2,4)); return;
    case 'EDT309': ch(0,'-'); w(1,t.slice(2,3)); return;
    case 'EDT310': ch(0,'-'); w(1,t.slice(4,7)); return;
    case 'EDT311': ch(0,'-'); w(1,t.slice(0,2)); ch(3,'-'); w(4,t.slice(4,7)); return;

    // 402..406 (DENSO)
    case 'EDT402': ch(0,'-'); w(1,t.slice(2,3)); return;
    case 'EDT403': ch(0,'-'); w(1,t.slice(2,4)); return;
    case 'EDT404': ch(0,'-'); w(1,t.slice(0,1)); return;
    case 'EDT405': ch(0,'-'); w(1,t.slice(2,3)); ch(2,'-'); w(3,t.slice(0,1)); return;
    case 'EDT406': ch(0,'-'); w(1,t.slice(2,4)); ch(3,'-'); w(4,t.slice(0,1)); return;

    // 501..502 (住電)
    case 'EDT501': ch(0,'-'); w(1,t.slice(2,3)); return;
    case 'EDT502': ch(0,'-'); w(1,t.slice(2,4)); return;

    default:
      // unknown edit id → treat as no-op
      return;
  }
}

function applyTailEdits(pn20, m20, ansArr, r9pos, tableKind) {
  const table = selectTable(tableKind);
  const tailMask8 = m20.slice(12, 20);
  const tail8 = pn20.slice(12, 20);

  // scan pattern table (exact match)
  const hit = table.find(e => e.pat === tailMask8);
  if (!hit) {
    return { ans: applyEr4(ansArr, pn20), rc: '4' };
  }

  if (hit.act === 'RETURN') {
    return { ans: ansArr.join(''), rc: RC_OK };
  }

  edtWrite(ansArr, r9pos, tail8, hit.act);
  return { ans: ansArr.join(''), rc: RC_OK };
}

// ---- base patterns for BH11 checks ----
const OHPTN = [
  mask11(10),
  mask11(9),
  mask11(8),
  mask11(7),
  mask11(6),
  mask11(5),
  mask11(4),
  mask11(3)
];
const NHPTN1 = 'XXXXXXXXXXX';
const NDPTN1 = 'XXXXXXXXXX ';
const SMPTN1 = 'X'.repeat(7) + ' '.repeat(4); // 7 X + 4 blanks (11 bytes compare)

function hindp(pn) {
  const pn20 = padRight((pn ?? '').toString().slice(0,20), 20);

  // ER1: input begins with blank
  if (firstBlankIndex20(pn20) === 0) {
    return { ans: BLK22, rc: '1' };
  }

  const m20 = maskX(pn20);
  const head = pn20[0];

  // 品区=3（シロキ）: 2桁目から19桁をans先頭へコピー
  if (head === '3') {
    const a = out22();
    put(a, 0, pn20.slice(1,20));
    return { ans: a.join(''), rc: RC_OK };
  }

  // SIZAI: A..Z excluding S/T; pattern scan on 20-byte mask
  if (head >= 'A' && head <= 'Z' && head !== 'S' && head !== 'T') {
    const patterns20 = ['XXXXXXX ', 'XXXXXXXX ', 'XXXXXXXXX ', 'XXXXXXXXXX '].map(p => padRight(p,20));
    if (!patterns20.includes(m20)) {
      return { ans: errAnsSkip1(pn20), rc: '2' };
    }
    const a = out22();
    put(a, 0, pn20.slice(0,20));
    return { ans: a.join(''), rc: 'S' };
  }

  // From here: heads 0/1/6 and GALDP 7/8/9
  const bh11 = m20.slice(1,12);
  let a = out22();
  let r9 = 0;
  let tableKind = null;

  if (head === '1') {
    // HINJB: choose by OHPTN1..8 and build base then use OH55 table
    if (bh11 === OHPTN[0]) { // HIN55
      put(a,0,pn20.slice(1,6)); a[5]='-'; put(a,6,pn20.slice(6,11)); r9=11;
    } else if (bh11 === OHPTN[1]) { // HIN54
      put(a,0,pn20.slice(1,6)); a[5]='-'; put(a,6,pn20.slice(6,10)); r9=10;
    } else if (bh11 === OHPTN[2]) { // HIN53
      put(a,0,pn20.slice(1,6)); a[5]='-'; put(a,6,pn20.slice(6,9)); r9=9;
    } else if (bh11 === OHPTN[3]) { // HIN52
      put(a,0,pn20.slice(1,6)); a[5]='-'; put(a,6,pn20.slice(6,8)); r9=8;
    } else if (bh11 === OHPTN[4]) { // HIN51
      put(a,0,pn20.slice(1,6)); a[5]='-'; put(a,6,pn20.slice(6,7)); r9=7;
    } else if (bh11 === OHPTN[5]) { // HIN50
      put(a,0,pn20.slice(1,6)); r9=5;
    } else if (bh11 === OHPTN[6]) { // HIN40
      put(a,0,pn20.slice(1,5)); r9=4;
    } else if (bh11 === OHPTN[7]) { // HIN30
      put(a,0,pn20.slice(1,4)); r9=3;
    } else {
      return { ans: errAnsSkip1(pn20), rc: '3' };
    }
    tableKind = 'OH55';
    return applyTailEdits(pn20, m20, a, r9, tableKind);
  }

  if (head === '0') {
    // HINNEW
    if (bh11 !== NHPTN1) return { ans: errAnsSkip1(pn20), rc: '3' };
    put(a,0,pn20.slice(1,7)); a[6]='-'; put(a,7,pn20.slice(7,12)); r9=12;
    tableKind = 'NHIN';
    return applyTailEdits(pn20, m20, a, r9, tableKind);
  }

  if (head === '6') {
    // HINKB
    if (bh11 === OHPTN[0]) {
      put(a,0,pn20.slice(1,8)); a[7]='-'; put(a,8,pn20.slice(8,11)); r9=11;
    } else if (bh11 === OHPTN[4]) {
      put(a,0,pn20.slice(1,7)); r9=6;
    } else {
      return { ans: errAnsSkip1(pn20), rc: '3' };
    }
    tableKind = 'OH73';
    return applyTailEdits(pn20, m20, a, r9, tableKind);
  }

  if (head === '7') {
    // HINND1
    if (bh11 !== NDPTN1) return { ans: errAnsSkip1(pn20), rc: '5' };
    put(a,0,pn20.slice(1,7)); a[6]='-'; put(a,7,pn20.slice(7,11)); r9=11;
    tableKind = 'NDHN';
    return applyTailEdits(pn20, m20, a, r9, tableKind);
  }

  if (head === '8') {
    // HINND2
    if (bh11 !== NDPTN1) return { ans: errAnsSkip1(pn20), rc: '6' };
    put(a,0,pn20.slice(1,2)); a[1]='-'; put(a,2,pn20.slice(2,8)); a[8]='-'; put(a,9,pn20.slice(8,11)); r9=12;
    tableKind = 'NDHN';
    return applyTailEdits(pn20, m20, a, r9, tableKind);
  }

  if (head === '9') {
    // HINSMI
    if (bh11 !== SMPTN1) return { ans: errAnsSkip1(pn20), rc: '7' };
    put(a,0,pn20.slice(1,4)); a[3]='-'; put(a,4,pn20.slice(4,8)); r9=8;
    tableKind = 'SMHN';
    return applyTailEdits(pn20, m20, a, r9, tableKind);
  }

  // category error
  return { ans: errAnsSkip1(pn20), rc: '2' };
}

module.exports = { hindp };

// 処理概要:
// 1) 入力(表示形式)を正規化し、ハイフン位置と桁数から対象（基本/ND/SM/シロキ/資材）を判定する
// 2) 基本部（BH）を復元して先頭品区を付与し、末尾部（8桁）の編集形式を逆変換してファイル形式(20桁)を生成する
// 3) rc は ' '（正常）/ 'S'（資材）/ '1'..'3'（入力・形式エラー）を返す

const { RULES } = require('./tables');

const BLK20 = ' '.repeat(20);

function padRight(s, n) {
  s = (s ?? '').toString();
  return s.length >= n ? s.slice(0, n) : s + ' '.repeat(n - s.length);
}

function out20() {
  return Array.from(BLK20);
}

function put(a, pos0, str) {
  for (let i = 0; i < str.length && pos0 + i < a.length; i++) a[pos0 + i] = str[i];
}

function isSizaiHead(ch) {
  return ch >= 'A' && ch <= 'Z' && ch !== 'S' && ch !== 'T';
}

function edtWrite(out, pos, tail8, id) {
  const t = tail8;
  const w = (p, s) => put(out, pos + p, s);
  const ch = (p, c) => { out[pos + p] = c; };
  switch (id) {
    case 'RETURN': return;
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

    case 'EDT402': ch(0,'-'); w(1,t.slice(2,3)); return;
    case 'EDT403': ch(0,'-'); w(1,t.slice(2,4)); return;
    case 'EDT404': ch(0,'-'); w(1,t.slice(0,1)); return;
    case 'EDT405': ch(0,'-'); w(1,t.slice(2,3)); ch(2,'-'); w(3,t.slice(0,1)); return;
    case 'EDT406': ch(0,'-'); w(1,t.slice(2,4)); ch(3,'-'); w(4,t.slice(0,1)); return;

    case 'EDT501': ch(0,'-'); w(1,t.slice(2,3)); return;
    case 'EDT502': ch(0,'-'); w(1,t.slice(2,4)); return;

    default: return;
  }
}

function invertEdt(rem, id) {
  // returns tail8 (8 chars) or null
  const s = rem; // keep as-is
  const t = Array(8).fill(' ');
  const need = (idx) => (idx < s.length ? s[idx] : undefined);

  const set = (pos, ch) => { if (ch === undefined) return false; t[pos] = ch; return true; };

  // verify hyphen literals and pick chars based on id definition
  switch (id) {
    case 'RETURN':
      return t.join('');
    case 'EDT101':
      if (need(0) !== '-' || need(3) !== '-' || need(6) !== '-') return null;
      if (!set(0, need(1)) || !set(1, need(2)) || !set(2, need(4)) || !set(3, need(5)) || !set(4, need(7)) || !set(5, need(8))) return null;
      return t.join('');
    case 'EDT102':
      if (need(0) !== '-' || need(3) !== '-' || need(5) !== '-') return null;
      if (!set(0, need(1)) || !set(1, need(2)) || !set(2, need(4)) || !set(4, need(6)) || !set(5, need(7))) return null;
      return t.join('');
    case 'EDT103':
      if (need(0) !== '-' || need(3) !== '-') return null;
      if (!set(0, need(1)) || !set(1, need(2)) || !set(2, need(4)) || !set(3, need(5))) return null;
      return t.join('');
    case 'EDT104':
      if (need(0) !== '-' || need(3) !== '-') return null;
      if (!set(0, need(1)) || !set(1, need(2)) || !set(2, need(4))) return null;
      return t.join('');
    case 'EDT105':
      if (need(0) !== '-' || need(3) !== '-') return null;
      if (!set(0, need(1)) || !set(1, need(2)) || !set(4, need(4)) || !set(5, need(5))) return null;
      return t.join('');
    case 'EDT106':
      if (need(0) !== '-') return null;
      if (!set(0, need(1)) || !set(1, need(2))) return null;
      return t.join('');
    case 'EDT107':
      if (need(0) !== '-' || need(3) !== '-') return null;
      if (!set(2, need(1)) || !set(3, need(2)) || !set(4, need(4)) || !set(5, need(5))) return null;
      return t.join('');
    case 'EDT108':
      if (need(0) !== '-' || need(2) !== '-') return null;
      if (!set(2, need(1)) || !set(4, need(3)) || !set(5, need(4))) return null;
      return t.join('');
    case 'EDT109':
      if (need(0) !== '-') return null;
      if (!set(2, need(1)) || !set(3, need(2))) return null;
      return t.join('');
    case 'EDT110':
      if (need(0) !== '-') return null;
      if (!set(2, need(1))) return null;
      return t.join('');
    case 'EDT111':
      if (need(0) !== '-') return null;
      if (!set(4, need(1)) || !set(5, need(2))) return null;
      return t.join('');

    case 'EDT201':
      if (need(0) !== '-' || need(3) !== '-' || need(6) !== '-') return null;
      if (!set(0, need(1)) || !set(1, need(2)) || !set(2, need(4)) || !set(3, need(5)) || !set(4, need(7)) || !set(5, need(8)) || !set(6, need(9))) return null;
      return t.join('');
    case 'EDT202':
      if (need(0) !== '-' || need(3) !== '-' || need(5) !== '-') return null;
      if (!set(0, need(1)) || !set(1, need(2)) || !set(2, need(4)) || !set(4, need(6)) || !set(5, need(7)) || !set(6, need(8))) return null;
      return t.join('');
    case 'EDT203':
      if (need(0) !== '-' || need(3) !== '-') return null;
      if (!set(0, need(1)) || !set(1, need(2)) || !set(4, need(4)) || !set(5, need(5)) || !set(6, need(6))) return null;
      return t.join('');
    case 'EDT204':
      if (need(0) !== '-') return null;
      if (!set(0, need(1)) || !set(1, need(2))) return null;
      return t.join('');
    case 'EDT205':
      if (need(0) !== '-' || need(3) !== '-') return null;
      if (!set(2, need(1)) || !set(3, need(2)) || !set(4, need(4)) || !set(5, need(5)) || !set(6, need(6))) return null;
      return t.join('');
    case 'EDT206':
      if (need(0) !== '-') return null;
      if (!set(2, need(1)) || !set(3, need(2))) return null;
      return t.join('');
    case 'EDT207':
      if (need(0) !== '-' || need(2) !== '-') return null;
      if (!set(2, need(1)) || !set(4, need(3)) || !set(5, need(4)) || !set(6, need(5))) return null;
      return t.join('');
    case 'EDT208':
      if (need(0) !== '-') return null;
      if (!set(2, need(1))) return null;
      return t.join('');
    case 'EDT209':
      if (need(0) !== '-') return null;
      if (!set(4, need(1)) || !set(5, need(2)) || !set(6, need(3))) return null;
      return t.join('');
    case 'EDT210':
      if (need(0) !== '-' || need(3) !== '-') return null;
      if (!set(0, need(1)) || !set(1, need(2)) || !set(2, need(4)) || !set(3, need(5))) return null;
      return t.join('');
    case 'EDT211':
      if (need(0) !== '-' || need(3) !== '-') return null;
      if (!set(0, need(1)) || !set(1, need(2)) || !set(2, need(4))) return null;
      return t.join('');

    case 'EDT301':
      return invertEdt(s, 'EDT201');
    case 'EDT302':
      return invertEdt(s, 'EDT202');
    case 'EDT303':
      return invertEdt(s, 'EDT210');
    case 'EDT304':
      return invertEdt(s, 'EDT211');
    case 'EDT305':
      return invertEdt(s, 'EDT204');
    case 'EDT306':
      return invertEdt(s, 'EDT205');
    case 'EDT307':
      return invertEdt(s, 'EDT207');
    case 'EDT308':
      return invertEdt(s, 'EDT206');
    case 'EDT309':
      return invertEdt(s, 'EDT208');
    case 'EDT310':
      return invertEdt(s, 'EDT209');
    case 'EDT311':
      if (need(0) !== '-' || need(3) !== '-') return null;
      if (!set(0, need(1)) || !set(1, need(2)) || !set(4, need(4)) || !set(5, need(5)) || !set(6, need(6))) return null;
      return t.join('');

    case 'EDT402':
      if (need(0) !== '-') return null;
      if (!set(2, need(1))) return null;
      return t.join('');
    case 'EDT403':
      if (need(0) !== '-') return null;
      if (!set(2, need(1)) || !set(3, need(2))) return null;
      return t.join('');
    case 'EDT404':
      if (need(0) !== '-') return null;
      if (!set(0, need(1))) return null;
      return t.join('');
    case 'EDT405':
      if (need(0) !== '-' || need(2) !== '-') return null;
      if (!set(2, need(1)) || !set(0, need(3))) return null;
      return t.join('');
    case 'EDT406':
      if (need(0) !== '-' || need(3) !== '-') return null;
      if (!set(2, need(1)) || !set(3, need(2)) || !set(0, need(4))) return null;
      return t.join('');

    case 'EDT501':
      return invertEdt(s, 'EDT402');
    case 'EDT502':
      return invertEdt(s, 'EDT403');

    default:
      return null;
  }
}

function trySuffix(tableKind, rem, r9pos) {
  // rem: display substring from r9pos to end (trimRight is applied)
  // Try all EDT ids for tableKind
  const ids = {
    OH55: ['RETURN','EDT101','EDT102','EDT103','EDT104','EDT105','EDT106','EDT107','EDT108','EDT109','EDT110','EDT111'],
    NHIN: ['RETURN','EDT201','EDT202','EDT203','EDT204','EDT205','EDT206','EDT207','EDT208','EDT209','EDT210','EDT211'],
    OH73: ['RETURN','EDT301','EDT302','EDT303','EDT304','EDT305','EDT306','EDT307','EDT308','EDT309','EDT310','EDT311'],
    NDHN: ['RETURN','EDT402','EDT403','EDT404','EDT405','EDT406'],
    SMHN: ['RETURN','EDT501','EDT502'],
  };

  const list = ids[tableKind] || ['RETURN'];
  const s = rem.trimEnd();

  for (const id of list) {
    const tail8 = invertEdt(s, id);
    if (tail8 == null) continue;

    // forward-check to avoid false positive
    const out = Array.from(' '.repeat(22));
    edtWrite(out, r9pos, tail8, id);
    const produced = out.slice(r9pos).join('').trimEnd();
    if (produced === s) {
      return { tail8, id };
    }
  }
  return null;
}

function detectAndBuild(pn22) {
  const s22 = padRight(pn22, 22).slice(0, 22);
  const t = s22.trimEnd();

  // shiroki: 19 chars no hyphen
  if (!t.includes('-') && t.length === 19) {
    const a = out20();
    a[0] = (RULES.shirokiOutHead['7'] || '3');
    put(a, 1, t.slice(0, 19));
    return { ans: a.join(''), rc: ' ' };
  }

  // sizai: begins with A..Z (S/T 제외), just copy first 20
  if (t && isSizaiHead(t[0])) {
    const out = padRight(t, 20).slice(0, 20);
    return { ans: out, rc: 'S' };
  }

  // Identify base patterns (produced by HINDP)
  const a = out20();

  function finish(head, bhinStr, r9pos, tableKind) {
    a[0] = head;
    put(a, 1, padRight(bhinStr, 11).slice(0, 11));

    const rem = s22.slice(r9pos).trimEnd();
    if (!rem) return { ans: a.join(''), rc: ' ' };

    const hit = trySuffix(tableKind, rem, r9pos);
    if (!hit) return { ans: a.join(''), rc: '2' };

    put(a, 12, hit.tail8);
    return { ans: a.join(''), rc: ' ' };
  }

  // head=0: 6-5 (pos 6 is '-')
  if (t.length >= 12 && t[6] === '-') {
    const left6 = t.slice(0, 6);
    const right5 = t.slice(7, 12);
    if (!right5.includes('-')) {
      // treat as head=0 (NHIN)
      return finish('0', left6 + right5, 12, 'NHIN');
    }
  }

  // head=1: 5-?(4/3/2/1 or none)
  if (t.length >= 6 && t[5] === '-') {
    const left5 = t.slice(0, 5);
    // right part ends before next '-' or end
    let j = 6;
    while (j < t.length && t[j] !== '-') j++;
    const right = t.slice(6, j);
    if (right.length >= 1 && right.length <= 5) {
      const bh = left5 + padRight(right, 5).slice(0, 5);
      return finish('1', bh, 5 + 1 + right.length, 'OH55');
    }
  }

  // head=6: either 7-3 or 6
  if (t.length >= 11 && t[7] === '-') {
    const left7 = t.slice(0, 7);
    const right3 = t.slice(8, 11);
    if (!right3.includes('-')) {
      return finish('6', left7 + right3 + ' ', 11, 'OH73');
    }
  }
  if (!t.includes('-') && t.length === 6) {
    return finish('6', t + ' '.repeat(5), 6, 'OH73');
  }

  // head=7: 6-4 (pos6 '-')
  if (t.length >= 11 && t[6] === '-') {
    const left6 = t.slice(0, 6);
    const right4 = t.slice(7, 11);
    if (!right4.includes('-')) {
      return finish('7', left6 + right4 + ' ', 11, 'NDHN');
    }
  }

  // head=8: 1-6-3 (pos1 and pos8 are '-')
  if (t.length >= 12 && t[1] === '-' && t[8] === '-') {
    const p1 = t.slice(0, 1);
    const p2 = t.slice(2, 8);
    const p3 = t.slice(9, 12);
    if (!p2.includes('-') && !p3.includes('-')) {
      return finish('8', p1 + p2 + p3 + ' ', 12, 'NDHN');
    }
  }

  // head=9: 3-4 (pos3 '-')
  if (t.length >= 8 && t[3] === '-') {
    const p1 = t.slice(0, 3);
    const p2 = t.slice(4, 8);
    if (!p1.includes('-') && !p2.includes('-')) {
      return finish('9', p1 + p2 + ' '.repeat(4), 8, 'SMHN');
    }
  }

  // fallback: invalid
  return { ans: BLK20, rc: '3' };
}

module.exports = function hinfl(pn) {
  if (typeof pn !== 'string' || pn.trim() === '') {
    return { ans: BLK20, rc: '1' };
  }
  return detectAndBuild(pn);
};

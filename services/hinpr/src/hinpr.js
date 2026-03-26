
/**
 * HINPR core (legacy-faithful)
 * ----------------------------------------------
 * 目的:
 *   ファイル形式品番(20桁) → プリント形式品番(22桁)
 *
 * 正の根拠:
 *   - XAHINPR : 0/1/6 と資材(SIZAI)のフロー
 *   - XAGALPR : 7/8/9 の追加フロー（DENSO/試作/住電）
 *   - XAGRPPR : 品区=3（シロキ）…2桁目から19桁をans先頭へコピー
 *
 * rc:
 *   - 1文字。**正規化しない**。
 *   - 正常時はスペース1文字(' ')。
 *   - 資材成功時は 'S'。
 *   - エラー時は '1'..'6'（分岐により異なる）。
 *
 * ans:
 *   - 常に22文字。未使用領域はスペース。
 */

const BLK22 = ' '.repeat(22);
const { PAT } = require('./tables');
const NHPTN = PAT.NHPTN;
const OHPTN = PAT.OHPTN;

const RC_OK = ' '; // legacy normal

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
  let out='';
  for (let i=0;i<s20.length;i++) out += (s20[i]===' ' ? ' ' : 'X');
  return out;
}

function out22(){ return Array.from(BLK22); }
function put(a,pos0,str){ for(let i=0;i<str.length && pos0+i<a.length;i++) a[pos0+i]=str[i]; }

function errAnsSkip1(pn20){ const a=out22(); put(a,0,pn20.slice(1,20)); return a.join(''); }
function errAnsFrom0(pn20){ const a=out22(); put(a,0,pn20.slice(0,19)); return a.join(''); }

function isSizaiHead(ch){ return ch>='A' && ch<='Z' && ch!=='S' && ch!=='T'; }
function matchSizaiMask(m20){
  return PAT.SIZAI20.includes(m20);
}
// ---- HINPR(0) ----
function doHNEW(pn20,m20){
  if (m20.slice(1,12)!==NHPTN) return {ans:errAnsSkip1(pn20), rc:'3'};
  const src=pn20.slice(1);
  const a=out22();
  put(a,0,src.slice(0,6)); a[6]='-'; put(a,7,src.slice(6,11));
  put(a,13,src.slice(11,13)); put(a,16,src.slice(13,15)); put(a,19,src.slice(15,18));
  if (src.slice(11,18)===' '.repeat(7)) return {ans:a.join(''), rc:RC_OK};
  a[12]='-';
  if (src.slice(13,18)===' '.repeat(5)) return {ans:a.join(''), rc:RC_OK};
  a[15]='-';
  if (src.slice(15,18)===' '.repeat(3)) return {ans:a.join(''), rc:RC_OK};
  a[18]='-';
  return {ans:a.join(''), rc:RC_OK};
}

// ---- HINPR(1) ----
function doHOLD1(pn20,m20){
  const key=m20.slice(1,12);
  if (!OHPTN.includes(key)) return {ans:errAnsSkip1(pn20), rc:'3'};
  const src=pn20.slice(1);
  const a=out22();
  put(a,0,src.slice(0,5)); put(a,6,src.slice(5,10));
  put(a,13,src.slice(11,13)); put(a,16,src.slice(13,15)); put(a,19,src.slice(15,17));
  if (src.slice(5,10)!==' '.repeat(5)) a[5]='-';
  if (src.slice(11,17)===' '.repeat(6)) return {ans:a.join(''), rc:RC_OK};
  a[12]='-';
  if (src.slice(13,17)===' '.repeat(4)) return {ans:a.join(''), rc:RC_OK};
  a[15]='-';
  if (src.slice(15,17)===' '.repeat(2)) return {ans:a.join(''), rc:RC_OK};
  a[18]='-';
  return {ans:a.join(''), rc:RC_OK};
}

// ---- HINPR(6) ----
function doHOLD6(pn20,m20){
  const key=m20.slice(1,12);
  if (!(key===OHPTN[0]||key===OHPTN[4])) return {ans:errAnsSkip1(pn20), rc:'3'};
  const src=pn20.slice(1);
  const a=out22();
  put(a,0,src.slice(0,7)); put(a,8,src.slice(7,10));
  put(a,13,src.slice(11,13)); put(a,16,src.slice(13,15)); put(a,19,src.slice(15,18));
  if (src.slice(7,10)!==' '.repeat(3)) a[7]='-';
  if (src.slice(11,18)===' '.repeat(7)) return {ans:a.join(''), rc:RC_OK};
  a[12]='-';
  if (src.slice(13,18)===' '.repeat(5)) return {ans:a.join(''), rc:RC_OK};
  a[15]='-';
  if (src.slice(15,18)===' '.repeat(3)) return {ans:a.join(''), rc:RC_OK};
  a[18]='-';
  return {ans:a.join(''), rc:RC_OK};
}

// ---- GALPR(7/8/9) ----
function doHND1(pn20,m20){
  const src=pn20.slice(1);
  const a=out22();
  put(a,0,src.slice(0,6)); a[6]='-'; put(a,7,src.slice(6,10));
  const key19=padRight(m20.slice(1),19);
  if (key19===PAT.NDPTN19.NDPTN) return {ans:a.join(''), rc:RC_OK};
  if (key19===PAT.NDPTN19.NDPTN1){ a[12]='-'; put(a,13,src.slice(13,14)); return {ans:a.join(''), rc:RC_OK}; }
  if (key19===PAT.NDPTN19.NDPTN2){ a[12]='-'; put(a,13,src.slice(13,15)); return {ans:a.join(''), rc:RC_OK}; }
  if (key19===PAT.NDPTN19.NDPTN3){ a[12]='-'; a[15]='-'; put(a,16,src.slice(11,12)); return {ans:a.join(''), rc:RC_OK}; }
  if (key19===PAT.NDPTN19.NDPTN4){ a[12]='-'; a[15]='-'; put(a,13,src.slice(13,14)); put(a,16,src.slice(11,12)); return {ans:a.join(''), rc:RC_OK}; }
  if (key19===PAT.NDPTN19.NDPTN5){ a[12]='-'; a[15]='-'; put(a,13,src.slice(13,15)); put(a,16,src.slice(11,12)); return {ans:a.join(''), rc:RC_OK}; }
  return {ans:errAnsSkip1(pn20), rc:'4'};
}

function doHND2(pn20,m20){
  const key11=padRight(m20.slice(1,12),11);
  if (key11!==PAT.NDPTN11) return {ans:errAnsSkip1(pn20), rc:'5'};
  const src=pn20.slice(1);
  const a=out22();
  put(a,0,src.slice(0,1)); a[1]='-'; put(a,2,src.slice(1,7)); a[8]='-'; put(a,9,src.slice(7,10));
  return {ans:a.join(''), rc:RC_OK};
}

function doHSMI(pn20,m20){
  const src=pn20.slice(1);
  const a=out22();
  put(a,0,src.slice(0,3)); a[3]='-'; put(a,4,src.slice(3,7));
  const key19=padRight(m20.slice(1),19);
  if (key19===PAT.SMPTN19.SMPTN) return {ans:a.join(''), rc:RC_OK};
  if (key19===PAT.SMPTN19.SMPTN1){ a[9]='-'; put(a,10,src.slice(13,15)); return {ans:a.join(''), rc:RC_OK}; }
  if (key19===PAT.SMPTN19.SMPTN2) return {ans:a.join(''), rc:RC_OK};
  return {ans:errAnsFrom0(pn20), rc:'6'};
}

/**
 * 品区=3（シロキ品番）
 * 仕様：2桁目から19桁（=入力20桁の先頭1桁を除く19バイト）を ans 先頭へコピーする。
 */
function doShiroki3(pn20){
  const a=out22();
  put(a,0,pn20.slice(1,20));
  return {ans:a.join(''), rc:RC_OK};
}

function hinpr(pn){
  const pn20 = padRight((pn ?? '').toString().slice(0,20), 20);
  if (firstBlankIndex20(pn20)===0) return {ans:BLK22, rc:'1'};

  const m20 = maskX(pn20);
  const head = pn20[0];

  if (head==='0') return doHNEW(pn20,m20);
  if (head==='1') return doHOLD1(pn20,m20);
  if (head==='6') return doHOLD6(pn20,m20);

  if (head==='7') return doHND1(pn20,m20);
  if (head==='8') return doHND2(pn20,m20);
  if (head==='9') return doHSMI(pn20,m20);

  // ★ シロキ（品区=3）
  if (head==='3') return doShiroki3(pn20);

  if (isSizaiHead(head)){
    if (!matchSizaiMask(m20)) return {ans:errAnsSkip1(pn20), rc:'2'};
    const a=out22();
    put(a,0,pn20.slice(0,20));
    return {ans:a.join(''), rc:'S'};
  }

  return {ans:errAnsSkip1(pn20), rc:'2'};
}

module.exports = { hinpr };

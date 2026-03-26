const { hinpr } = require('../src/hinpr');
const { PAT } = require('../src/tables');

function assertEq(name, got, exp) {
  if (got !== exp) {
    console.error('NG:', name);
    console.error(' got:', JSON.stringify(got));
    console.error(' exp:', JSON.stringify(exp));
    process.exit(1);
  } else {
    console.log('OK:', name);
  }
}
function assert(cond, name) {
  if (!cond) {
    console.error('NG:', name);
    process.exit(1);
  } else {
    console.log('OK:', name);
  }
}
function pnFromMask(head, mask19) {
  const a = Array(20).fill(' ');
  a[0] = head;
  const fill = '0123456789ABCDEFGHIJ';
  let k = 0;
  for (let i = 0; i < 19; i++) {
    a[i + 1] = (mask19[i] === 'X') ? fill[k++ % fill.length] : ' ';
  }
  return a.join('');
}
function is22(s) { return typeof s === 'string' && s.length === 22; }

// tables loaded
assert(typeof PAT.NHPTN === 'string' && PAT.NHPTN.length === 11, 'NHPTN loaded');
assert(Array.isArray(PAT.OHPTN) && PAT.OHPTN.length === 8, 'OHPTN loaded');
assert(PAT.NDPTN19 && PAT.NDPTN19.NDPTN, 'NDPTN19 loaded');
assert(typeof PAT.NDPTN11 === 'string' && PAT.NDPTN11.length === 11, 'NDPTN11 loaded');
assert(PAT.SMPTN19 && PAT.SMPTN19.SMPTN, 'SMPTN19 loaded');
assert(Array.isArray(PAT.SIZAI20) && PAT.SIZAI20.length > 0, 'SIZAI20 loaded');

// invariants
for (const pn of ['', '0ABCDEFGHIJKLMNOPQRST', '3' + 'X'.repeat(19), '7' + 'A'.repeat(19)]) {
  const r = hinpr(pn);
  assert(is22(r.ans), 'ans 22');
  assert(typeof r.rc === 'string' && r.rc.length === 1, 'rc 1');
}

// ER1
{
  const r = hinpr('');
  assertEq('ER1.rc', r.rc, '1');
  assertEq('ER1.ans', r.ans, ' '.repeat(22));
}

// GRPPR: 品区=3
{
  const pn = '3' + '1234567890123456789';
  const r = hinpr(pn);
  assertEq('H3.rc', r.rc, ' ');
  assertEq('H3.ans', r.ans.slice(0, 19), '1234567890123456789');
}

// SIZAI OK
{
  const mask20 = PAT.SIZAI20[0];
  const pn20 = pnFromMask('A', mask20.slice(1));
  const r = hinpr(pn20);
  assertEq('SIZAI.rc', r.rc, 'S');
  assertEq('SIZAI.ans20', r.ans.slice(0, 20), pn20);
}

console.log('ALL PASSED');

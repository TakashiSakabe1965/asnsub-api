const { hindp } = require('../src/hindp');

function assertEq(name, got, exp) {
  if (got !== exp) {
    console.error('NG:', name);
    console.error('  got:', JSON.stringify(got));
    console.error('  exp:', JSON.stringify(exp));
    process.exitCode = 1;
  } else {
    console.log('OK:', name);
  }
}

function buildPn20(head, bh11Mask, tail8Mask) {
  const a = Array(20).fill(' ');
  a[0] = head;

  for (let i = 0; i < 11; i++) {
    a[1 + i] = (bh11Mask[i] === 'X') ? String((i % 10)) : ' ';
  }

  const letters = 'ABCDEFGH';
  for (let i = 0; i < 8; i++) {
    a[12 + i] = (tail8Mask[i] === 'X') ? letters[i] : ' ';
  }

  return a.join('');
}

function expectSkip1(pn20) {
  return pn20.slice(1, 20) + ' '.repeat(3);
}

// ER1
{
  const { ans, rc } = hindp('');
  assertEq('ER1.rc', rc, '1');
  assertEq('ER1.ans', ans, ' '.repeat(22));
}

// GRPDP: 品区=3
{
  const pn = '3' + '1234567890123456789';
  const { ans, rc } = hindp(pn);
  assertEq('H3.rc', rc, ' ');
  assertEq('H3.ans', ans, pn.slice(1, 20) + ' '.repeat(3));
}

// SIZAI OK
{
  const pn = 'A' + '1234567' + ' '.repeat(12);
  const { ans, rc } = hindp(pn);
  assertEq('SIZAI.rc', rc, 'S');
  assertEq('SIZAI.ans', ans, pn.padEnd(20, ' ') + ' '.repeat(2));
}

// SIZAI NG
{
  const pn = 'B' + '1'.repeat(19);
  const { ans, rc } = hindp(pn);
  assertEq('SIZAI-ER2.rc', rc, '2');
  assertEq('SIZAI-ER2.ans', ans, expectSkip1(pn.padEnd(20, ' ')));
}

// HINDP head=0
{
  const bh11 = 'X'.repeat(11);
  const tail = 'X'.repeat(7) + ' ';
  const pn = buildPn20('0', bh11, tail);
  const { ans, rc } = hindp(pn);
  assertEq('H0.rc', rc, ' ');
  const exp = pn.slice(1, 7) + '-' + pn.slice(7, 12) + '-AB-CD-EFG';
  assertEq('H0.ans', ans, exp);
}

// HINDP head=1 HIN55
{
  const bh11 = 'X'.repeat(10) + ' ';
  const tail = 'X'.repeat(6) + '  ';
  const pn = buildPn20('1', bh11, tail);
  const { ans, rc } = hindp(pn);
  assertEq('H1-55.rc', rc, ' ');
  const exp = pn.slice(1, 6) + '-' + pn.slice(6, 11) + '-AB-CD-EF';
  assertEq('H1-55.ans', ans, exp);
}

// HINDP head=6 HIN73
{
  const bh11 = 'X'.repeat(10) + ' ';
  const tail = 'X'.repeat(7) + ' ';
  const pn = buildPn20('6', bh11, tail);
  const { ans, rc } = hindp(pn);
  assertEq('H6.rc', rc, ' ');
  const exp = pn.slice(1, 8) + '-' + pn.slice(8, 11) + '-AB-CD-EFG';
  assertEq('H6.ans', ans, exp);
}

// GALDP head=7 NDHN EDT402
{
  const bh11 = 'X'.repeat(10) + ' ';
  const tail = '  ' + 'X' + ' '.repeat(5);
  const pn = buildPn20('7', bh11, tail);
  const { ans, rc } = hindp(pn);
  assertEq('H7-402.rc', rc, ' ');
  const exp = pn.slice(1, 7) + '-' + pn.slice(7, 11) + '-C' + ' '.repeat(9);
  assertEq('H7-402.ans', ans, exp);
}

// GALDP head=8 NDHN EDT406
{
  const bh11 = 'X'.repeat(10) + ' ';
  const tail = 'X ' + 'XX' + ' '.repeat(4);
  const pn = buildPn20('8', bh11, tail);
  const { ans, rc } = hindp(pn);
  assertEq('H8-406.rc', rc, ' ');
  const base = pn.slice(1, 2) + '-' + pn.slice(2, 8) + '-' + pn.slice(8, 11);
  const exp = base + '-CD-A' + ' '.repeat(6);
  assertEq('H8-406.ans', ans, exp);
}

// GALDP head=9 SMHN EDT502
{
  const bh11 = 'X'.repeat(7) + ' '.repeat(4);
  const tail = '  ' + 'XX' + ' '.repeat(4);
  const pn = buildPn20('9', bh11, tail);
  const { ans, rc } = hindp(pn);
  assertEq('H9-502.rc', rc, ' ');
  const base = pn.slice(1, 4) + '-' + pn.slice(4, 8);
  const exp = base + '-CD' + ' '.repeat(14);
  assertEq('H9-502.ans', ans, exp);
}

// ER5/6/7
{
  const pn = buildPn20('7', 'X'.repeat(9) + '  ', 'X'.repeat(8));
  const { ans, rc } = hindp(pn);
  assertEq('ER5.rc', rc, '5');
  assertEq('ER5.ans', ans, expectSkip1(pn));
}
{
  const pn = buildPn20('8', 'X'.repeat(9) + '  ', 'X'.repeat(8));
  const { ans, rc } = hindp(pn);
  assertEq('ER6.rc', rc, '6');
  assertEq('ER6.ans', ans, expectSkip1(pn));
}
{
  const pn = buildPn20('9', 'X'.repeat(10) + ' ', 'X'.repeat(8));
  const { ans, rc } = hindp(pn);
  assertEq('ER7.rc', rc, '7');
  assertEq('ER7.ans', ans, expectSkip1(pn));
}

// ER4 tail not found
{
  const pn = buildPn20('0', 'X'.repeat(11), 'X'.repeat(8));
  const { ans, rc } = hindp(pn);
  assertEq('ER4.rc', rc, '4');
  const tail8 = pn.slice(12, 20);
  assertEq('ER4.tailCopied', ans.slice(13, 21), tail8);
}

if (process.exitCode) {
  console.error('FAILED');
  process.exit(1);
}

console.log('ALL PASSED');

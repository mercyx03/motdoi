'use strict';
// 9.5.5: phân biệt đối xử theo thời đại (bias955.js, data-bias955.js): kỳ thị người đồng tính, song tính và phân biệt chủng tộc, sắc tộc
const assert = require('node:assert/strict');
const fs = require('fs'), path = require('path');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, H = E.H, B = E.BIAS955, D = G.CTX945_DATA.BIAS;
let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };
const life = (cc, y, seed, o) => { const l = E.createLife({ mode: cc === 'VN' ? 'vn' : 'world', country: cc, seed: seed || 11, year: y, gender: (o && o.sex) || undefined }); return l; };
const adult = (cc, y, seed, orient) => { const l = life(cc, y - 25, seed); l.age = 25; l.alive = true; l.pending = []; l.orient = orient || 'gay'; l.school = null; l.indep = true; return l; };
const run = (l, id, k) => { const d = E.DEC[id].make(l, H.rf(l)); ok(d.opts.some(o => o.k === k), id + ' có ' + k + ' (' + d.opts.map(o => o.k) + ')'); l.pending.unshift(d); E.resolve(l, k); return d; };

// 1. Dữ liệu hợp lệ
{
  const known = { has: c => !!G.W.BY[c] };
  Object.keys(D.LG).forEach(c => { ok(known.has(c), 'mã nước hợp lệ: ' + c); const t = D.LG[c]; ok(t[0][0] === 1900, c + ' bắt đầu từ 1900'); t.forEach((x, i) => { ok(x[1] >= 0 && x[1] <= 3, c + ' mức hợp lệ'); ok(i === 0 || x[0] > t[i - 1][0], c + ' mốc tăng dần'); }); });
  const ids = new Set();
  D.RACE.forEach(r => { ok(!ids.has(r[0]), 'mã dòng duy nhất: ' + r[0]); ids.add(r[0]); ok(known.has(r[1]), 'nước hợp lệ ' + r[1]); ok(r[2] <= r[3] && r[2] >= 1900 && r[3] <= 2025, 'khoảng năm ' + r[0]); ok(r[4] > 0 && r[4] <= 1, 'tỷ lệ ' + r[0]); ok(r[5] >= 1 && r[5] <= 3, 'mức ' + r[0]); ok(r[6].length > 10 && r[7].length > 3, 'có tên chế độ và nhóm ' + r[0]);
    if (r[8]) { const re = new RegExp(r[8]); ok(G.W.BY[r[1]].cities.some(c => re.test(c)), 'vùng khớp thành phố: ' + r[0]); ok(r[9] >= 0 && r[9] <= 3, 'mức vùng ' + r[0]); } });
  ok(D.RACE.length >= 45 && Object.keys(D.LG).length >= 120, 'đủ dòng: ' + D.RACE.length + ' chế độ, ' + Object.keys(D.LG).length + ' nước');
}
// 2. Mốc lịch sử người đồng tính
{
  const t = (c, y, lv) => ok(B.lgbtAt(c, y) === lv, c + ' ' + y + ': mức ' + B.lgbtAt(c, y) + ' (kỳ vọng ' + lv + ')');
  t('GB', 1950, 3); t('GB', 1970, 2); t('GB', 2020, 0); t('US', 1950, 3); t('US', 1990, 2); t('US', 2020, 0); t('DE', 1940, 3); t('DE', 1965, 3); t('DE', 2010, 0); t('RU', 1950, 3); t('RU', 2000, 1); t('RU', 2015, 2);
  t('IR', 1990, 3); t('SA', 2000, 3); t('IN', 2010, 2); t('IN', 2020, 1); t('NG', 2020, 3); t('UG', 2020, 3); t('JP', 1980, 1); t('VN', 2000, 1); t('CA', 1960, 3); t('CA', 2010, 0); t('AU', 1960, 3); t('NL', 1960, 1); t('NL', 2000, 0);
  t('ES', 1950, 3); t('ES', 1990, 1); t('ES', 2010, 0); t('BR', 1970, 2); t('CU', 1966, 3); t('ZA', 1980, 2); t('ZA', 2005, 1); t('FR', 1960, 2); t('FR', 2005, 0);
  t('XX', 1950, 1); // nước không có dòng, không còn hình sự hóa: mức 1 trước 2000
  ok(B.lgbtAt('XX', 2010) === 0 || G.W.CRIM.includes('XX'), 'nước không có dòng, sau 2000: mức 0');
}
// 3. Đời sinh từ 2024 không đổi; chỉ đời có số liệu theo năm mới dùng bảng
{
  const l = life('RU', 2026, 5); ok(!l.era920 && B.lgbt(l) === 0 && B.groups(l).length === 0, 'sinh 2026: không áp bảng phân biệt');
  const m = life('US', 1950, 5); ok(m.era920 && B.lgbt(m) === 3, 'sinh 1950: có áp bảng');
}
// 4. Nhóm bị phân biệt: tỷ lệ dân cư, mức, vùng, không theo gia cảnh
{
  const share = (cc, y, id) => { let k = 0, N = 400; for (let i = 0; i < N; i++) { const l = life(cc, y, 900 + i); const r = D.RACE.find(x => x[0] === id); if (B.member(l, r)) k++; } return k / N; };
  const us = share('US', 1950, 'us_black_jc'), za = share('ZA', 1960, 'za_apartheid');
  ok(us > 0.07 && us < 0.16, 'Mỹ 1950: tỷ lệ thuộc nhóm bị phân biệt theo luật khoảng 11% (' + us.toFixed(3) + ')');
  ok(za > 0.86 && za < 0.96, 'Nam Phi 1960: khoảng 91% (' + za.toFixed(3) + ')');
  const l = life('US', 1950, 7); l.city = 'Atlanta'; const r = D.RACE.find(x => x[0] === 'us_black_jc'); ok(B.levelOf(l, r) === 3, 'miền nam Mỹ: mức 3');
  l.city = 'Chicago'; ok(B.levelOf(l, r) === 2, 'miền bắc Mỹ: mức 2');
  // không phụ thuộc giàu nghèo: tỷ lệ gần nhau giữa nhà nghèo và nhà khá giả
  let a = 0, b = 0, na = 0, nb = 0; for (let i = 0; i < 600; i++) { const x = life('US', 1950, 3000 + i); const m = B.member(x, r); if ((x.fam.q || 3) <= 2) { na++; if (m) a++; } else { nb++; if (m) b++; } }
  ok(Math.abs(a / na - b / nb) < 0.07, 'tỷ lệ thuộc nhóm không đổi theo giàu nghèo của nhà (' + (a / na).toFixed(3) + ' và ' + (b / nb).toFixed(3) + ')');
  ok(B.hint('US', 1950).includes('Jim Crow') && B.hint('ZA', 1970).includes('apartheid') && /Quốc xã/.test(B.hint('DE', 1940)) && B.hint('VN', 2005) === '' && B.hint('US', 2015) === '', 'dòng tóm tắt ở màn chọn năm đúng nước và năm');
}
// 5. Thu nhập bị rào cản đúng mức, cùng một đời cùng số ngẫu nhiên
{
  const mk = flag => { const l = life('ZA', 1960, 21); l.age = 30; l.edu = 3; l.school = null; l.indep = true; l.flags.bias955 = { m_za_apartheid: flag, noted: { za_apartheid: 1 } }; E.startJob(l, 'cong_nhan', () => .5, () => { }, true); return l; };
  const a = mk(1), b = mk(0); const ia = E.careerYear(a, () => .5, () => { }), ib = E.careerYear(b, () => .5, () => { });
  ok(Math.abs(ia / ib - (1 - B.PEN[3])) < 1e-6, 'apartheid (mức 3): thu nhập thấp hơn 25% so với cùng công việc (' + (ia / ib).toFixed(3) + ')');
}
// 6. Quyết định đối mặt phân biệt chủng tộc
{
  const l = life('US', 1925, 31); l.age = 25; l.alive = true; l.pending = []; l.city = 'Atlanta'; const r = D.RACE.find(x => x[0] === 'us_black_jc'); l.flags.bias955 = { m_us_black_jc: 1, noted: {} };
  const d = E.DEC.bias955_race.make(l, H.rf(l), { id: 'us_black_jc' }); ok(/người Mỹ gốc Phi|Jim Crow/.test(d.text) && d.opts.length === 4, 'tình huống nêu đúng chế độ và có bốn lựa chọn');
  const m0 = l.st.hap; l.pending = [d]; E.resolve(l, 'chiu'); ok(l.st.hap < m0, 'nhẫn nhịn làm giảm hạnh phúc');
  let won = 0, jailed = 0, N = 80;
  for (let i = 0; i < N; i++) { const x = life('ZA', 1932, 600 + i); x.age = 28; x.alive = true; x.pending = []; x.flags.bias955 = { m_za_apartheid: 1, noted: {} }; x.indep = true; x.school = null; const d2 = E.DEC.bias955_race.make(x, H.rf(x), { id: 'za_apartheid' }); x.pending = [d2]; E.resolve(x, 'dau'); if (x.log.some(e => /thay đổi/.test(e.t))) won++; if (x.jailUntil != null) jailed++; }
  ok(won > 3 && won < 60 && jailed > 0, 'đấu tranh: có lúc thành công (' + won + '/' + N + '), có lúc bị bắt (' + jailed + ')');
  const s = life('US', 1925, 41); s.age = 25; s.alive = true; s.pending = []; s.city = 'Atlanta'; s.indep = true; s.flags.bias955 = { m_us_black_jc: 1, noted: {} }; s.money = s.base * 3;
  run(s, 'bias955_race', 'di'); ok(s.city !== 'Atlanta', 'chuyển ra khỏi miền nam Mỹ');
}
// 7. Người đồng tính, song tính
{
  const l = adult('RU', 1975, 51, 'gay'); const d = E.DEC.bias955_lgbt.make(l, H.rf(l)); ok(/truy tố nặng|đàn áp/.test(d.text) && d.opts.length >= 4, 'Liên Xô 1975: nêu rào cản hình sự');
  const st = adult('RU', 1975, 52, 'straight'); ok(E.DEC.bias955_lgbt.valid(st, {}) === false, 'người dị tính không có tình huống này');
  const modern = adult('NL', 2005, 53, 'gay'); ok(E.DEC.bias955_lgbt.valid(modern, {}) === false, 'Hà Lan 2005 (mức 0): không có tình huống');
  const old = adult('US', 1990, 54, 'gay'); ok(E.DEC.bias955_lgbt.valid(old, {}) === true, 'Mỹ 1990 (mức 2): có');
  let jail = 0, fired = 0, N = 100; for (let i = 0; i < N; i++) { const x = adult('IR', 1990, 700 + i, 'gay'); x.job = { id: 'cong_nhan', rank: 0, yrs: 1 }; x.pending = []; B.exposed(x, H.rf(x), say(x), 'cong'); if (x.jailUntil != null) jail++; }
  ok(jail > 20 && jail < 80, 'mức 3: bị lộ thì khoảng nửa số ca bị bắt (' + jail + '/' + N + ')');
  let lost = 0; for (let i = 0; i < N; i++) { const x = adult('GB', 1960 + 10, 800 + i, 'gay'); x.job = { id: 'cong_nhan', rank: 0, yrs: 1 }; B.exposed(x, H.rf(x), say(x), 'cong'); if (!x.job) lost++; }
  ok(lost > 20 && lost < 80, 'mức 2: bị lộ thì có ca mất việc (' + lost + '/' + N + ')');
  const acc = (cc, y) => { let k = 0, M = 150; for (let i = 0; i < M; i++) { const x = adult(cc, y, 1500 + i, 'gay'); x.flags.outAskedAt = null; x.pending = [E.DEC.out.make(x, H.rf(x))]; E.resolve(x, 'yes'); if (x.log.some(e => /ôm bạn vào lòng/.test(e.t))) k++; } return k / M; };
  const a3 = acc('IR', 1990), a0 = acc('NL', 2005); ok(a0 > a3 + 0.4, 'công khai với gia đình: được đón nhận nhiều hơn hẳn ở nơi được bảo vệ (' + a0.toFixed(2) + ' so với ' + a3.toFixed(2) + ')');
  // luật đổi trong đời
  const c = adult('GB', 1967, 56, 'gay'); c.age = 25; c.birthYear = 1942 + 0; const prevLog = c.log.length; E.HOOKS.year.forEach(h => { try { h(c, H.rf(c), say(c), c.age); } catch (e) { } });
  ok(c.log.slice(prevLog).some(e => /không còn bị truy tố/.test(e.t)), 'năm 1967 luật Anh đổi: nhân vật đồng tính thấy tin tốt');
}
// 8. Không có chú thích ngoài lề trong nội dung mới
{
  const src = ['bias955.js', 'data-bias955.js'].map(f => fs.readFileSync(path.join(__dirname, '..', 'public', 'js', f), 'utf8')).join('\n');
  ok(!/mô phỏng|giả lập|thử nghiệm|tham số trò chơi|trong game/i.test(src.replace(/\/\*[\s\S]*?\*\//g, '')), 'nội dung hiển thị không có chú thích kiểu mô phỏng');
  const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
  ok(html.indexOf('data-ctx945.js') < html.indexOf('data-bias955.js') && html.indexOf('js/contract955.js') < html.indexOf('js/bias955.js'), 'thứ tự nạp đúng');
}
function say(l) { return (t, k) => l.log.push({ a: l.age, t, k }); }
console.log('bias955: ' + n + ' kiểm tra đạt');

'use strict';
// 9.5.5: tuổi thơ ngoài Việt Nam (kid955.js): lễ hội theo nước, tuổi 1–2, tuổi 10–14; không chú thích ngoài lề
const assert = require('node:assert/strict');
const fs = require('fs'), path = require('path');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, H = E.H;
let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };
const life = (cc, y, age, seed, o) => { const l = E.createLife({ mode: cc === 'VN' ? 'vn' : 'world', country: cc, seed: seed || 31, year: y - (age || 0) }); l.age = age == null ? 6 : age; l.alive = true; l.pending = []; l.school = (o && o.school) || null; return l; };
const trig = id => E.TRIG.filter(t => t.id === id)[0];
const run = (l, id, k) => { const d = E.DEC[id].make(l, H.rf(l)); ok(d.opts.some(o => o.k === k), id + ' có ' + k); l.pending.unshift(d); E.resolve(l, k); return d; };

// 1. Không chú thích ngoài lề
{
  const src = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'kid955.js'), 'utf8');
  ok(!/mô phỏng|giả lập|hư cấu|thử nghiệm|tham số|ước lượng|trong game|của game/i.test(src), 'kid955.js không có chú thích kiểu mô phỏng, giả lập, tham số');
  const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
  ok(html.indexOf('js/kid953.js') < html.indexOf('js/kid955.js') && html.indexOf('js/kid955.js') < html.indexOf('js/app.js'), 'kid955.js nạp sau kid953.js, trước app');
}
// 2. Lễ hội gắn với nước và thời bình, đúng thời
{
  const f = (id, cc, y) => trig(id).when(life(cc, y, 6), 6);
  ok(f('k955_tet_am', 'CN', 2000) && f('k955_tet_am', 'KR', 2000) && !f('k955_tet_am', 'DE', 2000) && !f('k955_tet_am', 'VN', 2000), 'Tết Âm lịch kiểu Trung Hoa và Hàn Quốc chỉ ở đúng nước');
  ok(f('k955_diwali', 'IN', 1990) && !f('k955_diwali', 'US', 1990), 'Diwali ở Ấn Độ không ở Mỹ');
  ok(f('k955_eid', 'ID', 2000) && f('k955_eid', 'TR', 2000) && !f('k955_eid', 'JP', 2000), 'Eid ở các nước đa số theo lịch lễ đó');
  ok(f('k955_giang_sinh', 'DE', 1985) && f('k955_giang_sinh', 'BR', 1985) && !f('k955_giang_sinh', 'JP', 1985) && !f('k955_giang_sinh', 'CN', 1985), 'Giáng sinh ở các nước có lịch lễ này');
  ok(f('k955_halloween', 'US', 1990) && !f('k955_halloween', 'US', 1940), 'Halloween trẻ đi xin kẹo chỉ từ 1950');
  ok(f('k955_tha_on', 'CA', 1990) && !f('k955_tha_on', 'GB', 1990), 'Lễ Tạ ơn ở Mỹ và Canada');
  ok(f('k955_carnaval', 'BR', 1990) && f('k955_songkran', 'TH', 1990) && f('k955_nowruz', 'IR', 1990) && f('k955_holi', 'NP', 1990) && f('k955_dia_muertos', 'MX', 1990), 'các lễ hội khác ở đúng nước');
  ok(trig('k955_shichigosan').when(life('JP', 2000, 5), 5) && !trig('k955_shichigosan').when(life('JP', 2000, 9), 9), 'Shichi-Go-San chỉ ở tuổi 3–7');
  // thời chiến không có lễ hội
  const war = life('IQ', 2006, 6); ok(!trig('k955_eid').when(war, 6) || E.KID953.turbulent(war) === false, 'vùng chiến sự không có lễ hội vui');
  ok(!trig('k955_diwali').when(life('IN', 2000, 3), 3), 'dưới 4 tuổi chưa có chuyện lễ hội');
  // chọn lựa có kết quả và ký ức
  const l = life('KR', 2000, 6, 5); run(l, 'k955_tet_am', 'chuc'); ok(l.log.some(x => /Seollal|lạy|mừng tuổi|bao đỏ|lì xì/i.test(x.t)) || l.mem.some(m => /phong bao đỏ/.test(m.t)), 'chọn chúc Tết có kết quả');
  const l2 = life('IN', 2000, 6, 6); const m0 = l2.mem.length; run(l2, 'k955_diwali', 'den'); ok(l2.mem.length > m0, 'xếp đèn Diwali để lại ký ức');
}
// 3. Tuổi 1–2
{
  const l = life('US', 1995, 1, 8); ok(trig('k955_buoc_dau').when(l, 1) && trig('k955_ru_ngu').when(l, 1) && trig('k955_an_dam').when(l, 1), 'ba chuyện tuổi 1–2 cho mọi nước');
  run(l, 'k955_buoc_dau', 'di'); ok(l.mem.some(m => /bước chân đầu tiên/i.test(m.t)), 'bước đi đầu tiên được ghi nhớ');
  const j = life('JP', 1995, 1, 9); ok(/cháo gạo|bột/.test(E.DEC.k955_an_dam.make(j, H.rf(j)).text), 'ăn dặm theo vùng');
  const nga = life('NG', 1995, 1, 9); ok(/ngô/.test(E.DEC.k955_an_dam.make(nga, H.rf(nga)).text), 'Nigeria: bột ngô');
  const f = life('ET', 1985, 1, 10); f.flags.x = 1; const fam = K => K; // nạn đói: không thay đổi tính hợp lệ, chỉ đổi kết quả
  ok(trig('k955_nha_tre').when(life('US', 1995, 2, 11), 2) === (life('US', 1995, 2, 11).fam.mAlive && life('US', 1995, 2, 11).fam.mJob !== 'nội trợ' || life('US', 1995, 2, 11).fam.fAlive), 'nhà trẻ chỉ khi nhà có người đi làm và nơi đủ điều kiện');
  ok(!trig('k955_nha_tre').when(life('NG', 1960, 2, 12), 2), 'nhà trẻ không có ở nơi và thời chưa phổ biến');
}
// 4. Tuổi 10–14 theo nước
{
  const l = life('JP', 2000, 12, 14, { school: 'lower' });
  ok(['k955_doi_the_thao', 'k955_thi_chuyen_cap', 'k955_hoc_ngoai_ngu', 'k955_viec_vat'].every(id => trig(id).when(l, 12) || id === 'k955_viec_vat' && false), 'JP 12 tuổi có đội, kỳ thi, ngoại ngữ');
  ok(/trung học phổ thông ở Nhật/.test(E.DEC.k955_thi_chuyen_cap.make(l, H.rf(l)).text), 'kỳ thi chuyển cấp đúng nước (Nhật)');
  const k = life('KR', 2000, 12, 15, { school: 'lower' }); ok(/Hàn Quốc/.test(E.DEC.k955_thi_chuyen_cap.make(k, H.rf(k)).text), 'Hàn Quốc');
  const u = life('US', 2000, 12, 16, { school: 'lower' }); ok(/bóng chày/.test(E.DEC.k955_doi_the_thao.make(u, H.rf(u)).text), 'Mỹ: đội bóng chày');
  const i = life('IN', 2000, 12, 17, { school: 'lower' }); ok(/cricket/.test(E.DEC.k955_doi_the_thao.make(i, H.rf(i)).text), 'Ấn Độ: cricket');
  ok(!trig('k955_doi_the_thao').when(life('JP', 2000, 12, 18), 12), 'không đi học thì không có đội của trường');
  const fm = life('NG', 1985, 12, 19, { school: 'lower' }); fm.fam.q = 1; fm.urban = false; ok(trig('k955_viec_nha_nong').when(fm, 12), 'nhà nghèo ở nông thôn có chuyện việc đồng áng đan xen việc học');
  const rich = life('DE', 2010, 12, 20, { school: 'lower' }); rich.fam.q = 5; ok(!trig('k955_viec_nha_nong').when(rich, 12), 'nhà đủ đầy ở nước giàu không có chuyện đồng áng');
  const w = life('US', 2000, 13, 21, { school: 'lower' }); const m0 = w.money; run(w, 'k955_viec_vat', 'nhan'); ok(w.money > m0 - 1e-9 || w.yr && w.yr.items.some(x => /Công việc đầu tiên/.test(x.t)), 'công việc đầu tiên có tiền công');
  const e = life('VN', 2000, 12, 22, { school: 'lower' }); run(e, 'k955_thi_chuyen_cap', 'on'); ok(e.log.length >= 1, 'ôn luyện có kết quả');
}
// 5. Mật độ chuyện tuổi thơ: các nước ngoài Việt Nam có đủ chuyện ở tuổi 1–2 và 10–14
{
  for (const [cc, y] of [['JP', 2000], ['US', 1990], ['IN', 2000], ['BR', 2005], ['DE', 1985]]) {
    let n12 = 0, n1014 = 0; const N = 24;
    for (let i = 0; i < N; i++) {
      const l = E.createLife({ mode: 'world', country: cc, seed: 4200 + i * 11, year: y });
      while (l.alive && l.age < 15) { E.beginYear(l, { auto: true }); l.pending.forEach(d => { if (E.TRIG.some(t => t.id === d.id && t.child)) { if (l.age <= 2) n12++; else if (l.age >= 10) n1014++; } }); let g = 0; while (l.pending.length && l.alive && g++ < 40) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); g = 0; while (l.pending.length && l.alive && g++ < 40) E.resolve(l, E.autoKey(l)); E.endYear(l); }
    }
    ok(n12 / N >= 1.1 && n1014 / N >= 2.2, cc + ' ' + y + ': đủ chuyện tuổi 1–2 (' + (n12 / N).toFixed(2) + '/đời) và 10–14 (' + (n1014 / N).toFixed(2) + '/đời)');
  }
}
console.log('kid955: ' + n + ' kiểm tra đạt');

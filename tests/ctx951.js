'use strict';
// 9.5.1: vùng trong nước (data-ctx951.js ZONE), chính sách xã hội lớn (SOC: ruộng đất, chiến dịch chính trị, di dời), sự kiện thuộc địa, lạm phát; liên kết với ctx945, hist920 và uni945.
const assert = require('node:assert/strict');
const crypto = require('crypto');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, U = G.U, H = E.H, C = E.CTX945, D = C.DATA;
let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };
const R = l => () => U.rand(l);
function life(cc, y, o) { o = o || {}; const l = E.createLife({ mode: o.mode || (cc === 'VN' ? 'vn' : 'world'), country: cc, seed: o.seed || 41, year: y, gender: o.sex || 'M' }); l.age = o.age == null ? 0 : o.age; l.alive = true; l.pending = []; l.sched = []; if (o.city) { l.city = o.city; l.place = o.city; } return l; }
function yearOf(l) { E.beginYear(l, { auto: true }); let k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); E.endYear(l); }

// 1. Dữ liệu hợp lệ
{
  const known = new Set(G.W.C.map(c => c.code)), groups = new Set(Object.keys(D.GRP));
  ok(D.ZONE.length >= 55 && D.SOC.length >= 54, 'có đủ dòng vùng (' + D.ZONE.length + ') và chính sách xã hội (' + D.SOC.length + ')');
  D.ZONE.forEach(r => { ok(known.has(r[0]) || groups.has(r[0]), 'mã nước hợp lệ: ' + r[0]); ok(r[1] <= r[2] && r[1] >= 1900 && r[2] <= 2025, 'khoảng năm hợp lệ: ' + r[0] + r[1]); ok(typeof r[3] === 'string' && new RegExp(r[3], 'i'), 'biểu thức thành phố hợp lệ'); ok(Object.keys(r[4]).every(k => ['war', 'fam', 'dis', 'school'].includes(k)), 'chỉ đổi chiến sự, đói, thiên tai và việc học'); ok(r[5] && r[5].length > 5, 'có nhãn'); });
  D.SOC.forEach(r => { ok(known.has(r[0]) || groups.has(r[0]), 'mã nước hợp lệ: ' + r[0]); ok(['land', 'purge', 'expel'].includes(r[3]) && r[4] >= 1 && r[4] <= 3 && r[5] > 0 && r[5] <= 1 && r[1] <= r[2], 'dòng chính sách hợp lệ: ' + r[0] + r[1]); });
  // thành phố nêu trong bảng vùng phải tồn tại trong dữ liệu thế giới (trừ Việt Nam dùng tỉnh)
  D.ZONE.filter(r => r[0] !== 'VN').forEach(r => { const B = G.W.BY[r[0]]; if (!B) return; const re = new RegExp(r[3], 'i'); ok(B.cities.some(c => re.test(c)), 'có thành phố khớp biểu thức: ' + r[0] + ' ' + r[3].slice(0, 30)); });
}

// 2. Cùng một năm, hai vùng khác nhau
{
  const o = (cc, y, city, mode) => C.of(life(cc, y, { city, mode }));
  const nam = o('VN', 1944, 'TP. Hồ Chí Minh', 'vn'), bac = o('VN', 1944, 'Nam Định', 'vn'); ok(bac.fam === 3 && nam.fam === 0, 'nạn đói 1945: miền Bắc đói nặng, Nam Kỳ không bị (' + bac.fam + ' so với ' + nam.fam + ')');
  const hn = o('VN', 1967, 'Hà Nội', 'vn'), sg = o('VN', 1967, 'TP. Hồ Chí Minh', 'vn'); ok(hn.war === 3 && sg.war < hn.war, 'Hà Nội 1967 bị ném bom nặng hơn Sài Gòn (' + hn.war + ' so với ' + sg.war + ')');
  ok(o('VN', 1970, 'Hà Nội', 'vn').war < hn.war, 'ngừng ném bom miền Bắc giai đoạn 1969–71');
  const lv = o('UA', 2023, 'Lviv'), kh = o('UA', 2023, 'Kharkiv'); ok(kh.war === 3 && lv.war === 2, 'Ukraina 2023: Kharkiv gần tiền tuyến hơn Lviv');
  const en = o('NG', 1968, 'Enugu'), la = o('NG', 1968, 'Lagos'); ok(en.fam === 3 && la.fam < 2 && en.war === 3 && la.war < en.war, 'Nigeria 1968: vùng Biafra bị đói và chiến sự, Lagos ngoài vùng');
  const ams = o('NL', 1944, 'Amsterdam'), eind = o('NL', 1944, 'Eindhoven'); ok(ams.fam === 3 && eind.fam < ams.fam, 'Mùa đông đói: Amsterdam đói hơn Eindhoven');
  ok(o('JP', 1945, 'Hiroshima').dis === 3 && o('JP', 1945, 'Sapporo').dis === 0, 'Hiroshima 1945 chịu thảm họa nguyên tử, Sapporo thì không');
  ok(o('RU', 1942, 'Saint Petersburg').fam === 3 && o('RU', 1942, 'Novosibirsk').fam < 3, 'Leningrad bị vây: đói nặng hơn hậu phương');
  ok(o('CN', 1960, 'Thành Đô').fam === 3 && o('CN', 1960, 'Thượng Hải').fam < 3, 'Đại nhảy vọt: vùng đói nặng so với thành phố lớn được ưu tiên');
  ok(o('GB', 1940, 'London').war === 2 && o('GB', 1940, 'London').level >= 2, 'London trong Blitz bị chiến sự mức hai');
  ok(o('DE', 1944, 'Dresden').war === 3, 'Dresden 1944 bị ném bom nặng');
  // vùng không khớp thì dùng mức quốc gia
  const base = C.at('UA', 2023); ok(o('UA', 2023, 'Kyiv').war === base.war, 'thành phố không có trong bảng vùng dùng mức quốc gia');
  // nhãn nêu tên vùng
  ok(/Sấm Rền/.test(hn.labels.war) || /ném bom/.test(hn.labels.war), 'nhật ký ghi tên hoàn cảnh của vùng');
  // tử vong theo vùng: hai đời cùng năm, vùng khác nhau
  const hz = (l, c) => C.hazard(l, c, 30).reduce((s, x) => s + x[0], 0);
  const a = life('NG', 1938, { city: 'Enugu', age: 30 }), b = life('NG', 1938, { city: 'Lagos', age: 30 }); ok(hz(a, C.of(a)) > 2 * hz(b, C.of(b)), 'cùng tuổi, cùng năm: vùng Biafra nguy hiểm hơn vùng ngoài (' + hz(a, C.of(a)).toFixed(4) + ' so với ' + hz(b, C.of(b)).toFixed(4) + ')');
}

// 3. Chính sách xã hội theo nước và năm
{
  const at = (cc, y) => C.at(cc, y);
  ok(at('VN', 1955).land === 3 && at('VN', 1955).soc.land.n === 'Cải cách ruộng đất ở miền Bắc', 'Cải cách ruộng đất 1953–56');
  ok(at('CN', 1951).land === 3 && at('CN', 1967).purge === 3 && at('CN', 1960).land === 3, 'Trung Quốc: cải cách ruộng đất 1951, Đại nhảy vọt 1960, Cách mạng Văn hóa 1967');
  ok(at('UA', 1937).purge === 3 && at('KZ', 1931).land === 3 && at('RU', 1937).purge === 3, 'Liên Xô: tập thể hóa 1931, Đại khủng bố 1937 (áp cho các nước kế thừa)');
  ok(at('IN', 1947).expel === 3 && at('PK', 1947).expel === 3 && at('IN', 1952).expel === 0, 'Chia cắt 1947 và hết sau đó');
  ok(at('GR', 1922).expel === 3 && at('TR', 1922).expel === 3, 'Hoán đổi dân cư 1922–23');
  ok(at('VN', 1990).land === 0 && at('VN', 1990).purge === 0 && at('US', 1970).expel === 0, 'không có chính sách ở nơi và năm không có');
  ok(at('DE', 1975).purge === 1, 'mức nhẹ cho theo dõi an ninh miền đông Đức');
}

// 4. Sự kiện xã hội xuất hiện, mọi lựa chọn chạy được không lỗi
{
  const kinds = ['col_tax', 'col_exam', 'col_levy', 'col_movement', 'land', 'purge', 'expel', 'hyp_savings'];
  ok(kinds.every(k => C.EV[k] && C.EV[k].soc && C.EV[k].w === 0), 'tám loại sự kiện mới, không lẫn vào bộ chọn sự kiện thường');
  ok(!C.kindsFor(life('VN', 1953, { age: 25 }), C.of(life('VN', 1953, { age: 25 }))).some(k => kinds.includes(k)), 'bộ chọn chung không rút ra sự kiện xã hội');
  const ctxFor = { col_tax: ['VN', 1925, 25, 'vn'], col_exam: ['VN', 1930, 12, 'vn'], col_levy: ['VN', 1900, 20, 'vn'], col_movement: ['DZ', 1935, 22, 'world'], land: ['CN', 1930, 21, 'world'], purge: ['CN', 1946, 21, 'world'], expel: ['IN', 1925, 22, 'world'], hyp_savings: ['DE', 1900, 22, 'world'] };
  kinds.forEach((k, ki) => {
    const [cc, by, age, mode] = ctxFor[k]; let tested = 0;
    for (let s = 0; s < 3; s++) {
      const base = life(cc, by, { age, mode, seed: 300 + ki * 7 + s }); base.money = base.base * 5; base.job = null;
      const c = C.of(base); const d = E.DEC.ctx945_event.make(base, R(base), { kind: k, y: by + age });
      ok(d && d.opts.length >= 2 && !/undefined|NaN|null/.test(d.title + d.text + JSON.stringify(d.opts)), 'tình huống sạch: ' + k);
      ok(d.opts.every(o => o.l && o.l.length > 3), 'mọi lựa chọn có nhãn: ' + k);
      d.opts.filter(o => o.k !== 'cancel').forEach(o => {
        for (let rep = 0; rep < 3; rep++) {
          const l = JSON.parse(JSON.stringify(base)); l.rs = (l.rs + rep * 7919) | 0; l.pending = [];
          try { const dd = E.DEC.ctx945_event.make(l, R(l), { kind: k, y: by + age }); l.pending.unshift(dd); E.resolve(l, dd.opts.find(x => x.l === o.l).k); let q = 0; while (l.pending.length && l.alive && q++ < 20) E.resolve(l, E.autoKey(l));
            ok(isFinite(l.money) && l.st.hap >= -50, 'chạy không lỗi: ' + k + '/' + o.k); if (l.alive) { yearOf(l); ok(isFinite(l.money), 'năm sau vẫn chạy: ' + k); } tested++; } catch (e) { throw new Error('Crash ' + k + '/' + o.k + ': ' + e.stack.split('\n').slice(0, 3).join(' | ')); }
        }
      });
    }
    ok(tested >= 6, 'đã thử các lựa chọn của ' + k + ' (' + tested + ')');
  });
}

// 5. Hậu quả phụ thuộc hoàn cảnh: hai gia đình khác điều kiện xử lý khác nhau trong cùng một chính sách ruộng đất
{
  const mk = q => { const l = life('CN', 1930, { age: 21, mode: 'world', seed: 77 }); l.fam.q = q; l.money = l.base * 4; return l; };
  const run = (q, key) => { const l = mk(q), m0 = l.money; l.pending = [E.DEC.ctx945_event.make(l, R(l), { kind: 'land', y: 1951 })]; const d = l.pending[0], o = d.opts.find(x => /^(Nhận|Khai đúng)/.test(x.l)); E.resolve(l, o.k); return (l.money - m0) / l.base; };
  const poor = run(1, 'comply'), rich = run(5, 'comply'), mid = run(3, 'comply');
  ok(poor > 0 && mid < 0 && rich < mid, 'ruộng đất: nhà ít của được chia thêm, nhà trung bình nộp một phần, nhà nhiều của mất nhiều hơn (' + poor.toFixed(2) + ' / ' + mid.toFixed(2) + ' / ' + rich.toFixed(2) + ')');
  // lựa chọn không đồng nhất: nhà nhiều của có "hide"
  const l = mk(5); const d = E.DEC.ctx945_event.make(l, R(l), { kind: 'land', y: 1951 }); ok(d.opts.some(o => /Giấu bớt/.test(o.l)) && d.opts.some(o => /Tham gia ban/.test(o.l)), 'có nhiều hướng xử lý, không chỉ cộng trừ chỉ số');
  // lương thực và thu nhập vẫn theo mức crisis của ctx945
  ok(C.incomeK(C.of(l)) <= 1, 'hệ số thu nhập hợp lệ');
}

// 6. Thuộc địa: dấu ấn của lựa chọn khi giành độc lập
{
  const l = life('ID', 1925, { age: 20, mode: 'world', seed: 91 }); l.flags.indep945 = 'fighter'; const s = l.flags.ctx945 = { noted: {} }; const logs = []; const y0 = C.at('ID', 1949), y1 = C.at('ID', 1950);
  ok(y0.colony && !y1.colony, 'Indonesia: thuộc địa đến 1949');
  // gọi trực tiếp qua vòng đời: đặt tuổi để năm thế giới = 1950
  l.age = 25; l.alive = true; const soc0 = l.st.soc; E.HOOKS.year.forEach(f => f(l, R(l), (t, k) => logs.push(t)));
  ok(logs.some(t => /chấm dứt ách Hà Lan/.test(t) && /ghi nhận/.test(t)) && l.st.soc > soc0 && l.flags.statusHero945, 'hết thời thuộc địa: người từng hoạt động được ghi nhận, có địa vị');
  const l2 = life('ID', 1925, { age: 25, mode: 'world', seed: 92 }); l2.flags.indep945 = 'informer'; const lg2 = []; E.HOOKS.year.forEach(f => f(l2, R(l2), (t) => lg2.push(t)));
  ok(lg2.some(t => /bị nhắc lại; bạn bị xa lánh/.test(t)), 'người từng báo tin cho chính quyền cũ bị xa lánh');
}

// 7. Di dời → tị nạn → đại học muộn (liên kết với uni945)
{
  let done = 0;
  for (let s = 0; s < 40 && !done; s++) {
    const l = life('SY', 1992, { age: 21, mode: 'world', seed: 500 + s }); l.money = l.base * 6; l.edu = 3; l.school = null; l.job = null; l.retired = false;
    const d = E.DEC.ctx945_event.make(l, R(l), { kind: 'expel', y: 2013 }); l.pending = [d]; const cross = d.opts.find(o => /sang nước khác/.test(o.l)); E.resolve(l, cross.k);
    if (l.abroad && l.flags.refugee945) { done++;
      ok(l.abroad.perm && l.flags.refugee945.to === l.abroad.code, 'qua biên giới: có nơi ở mới và hồ sơ tị nạn ghi nơi đến');
      ok(!E.UNI945.rights(l).ok && E.UNI945.rights(l).kind === 'pending', 'mới đến nên chưa được đăng ký đại học');
      l.age += 3; ok(E.UNI945.rights(l).ok && E.UNI945.rights(l).kind === 'refugee', 'sau hai năm được công nhận thì được đăng ký đại học');
      ok(l.log.some(e => /cư trú ở nước mới|nhận cư trú/.test(e.t)), 'nhật ký ghi quá trình xin cư trú'); }
  }
  ok(done >= 1, 'có ít nhất một đời qua được biên giới để kiểm chứng (' + done + ')');
  // nước đóng cửa: không đi được
  const cl = life('CN', 1948, { age: 21, mode: 'world', seed: 9 }); cl.money = cl.base * 6; ok(!C.emigAllowed(cl), 'Trung Quốc 1969 đóng cửa xuất cảnh');
  cl.pending = [E.DEC.ctx945_event.make(cl, R(cl), { kind: 'purge', y: 1969 })]; const lv = cl.pending[0].opts.find(o => /ra nước ngoài/.test(o.l)); E.resolve(cl, lv.k); ok(!cl.abroad, 'bị chặn xuất cảnh thì chỉ chuyển nơi ở trong nước');
}

// 8. Lạm phát phi mã: tiền để lâu mất giá, hướng xử lý khác nhau cho kết quả khác nhau
{
  const l0 = life('DE', 1900, { age: 23, mode: 'world', seed: 61 }); ok(C.of(l0).econKind === 'hyp' && C.of(l0).econ >= 3, 'Đức 1923: siêu lạm phát');
  const res = {}; ['Đổi tiền ra vàng', 'Mua ngoại tệ', 'Giữ tiền mặt', 'Tiêu và trữ'].forEach((p, i) => { const l = life('DE', 1900, { age: 23, mode: 'world', seed: 61 }); l.money = l.base * 4; const m0 = l.money; l.pending = [E.DEC.ctx945_event.make(l, R(l), { kind: 'hyp_savings', y: 1923 })]; const o = l.pending[0].opts.find(x => x.l.indexOf(p) === 0 || x.l.indexOf(p.split(' ')[0]) === 0); E.resolve(l, o.k); res[i] = (l.money - m0) / m0; });
  ok(res[2] < res[0] && res[2] < res[1] && res[2] < -0.5, 'giữ tiền mặt mất nhiều nhất, đổi vàng/ngoại tệ giữ được giá trị (' + [0, 1, 2, 3].map(i => res[i].toFixed(2)).join(' / ') + ')');
  const poor = life('DE', 1900, { age: 23, mode: 'world', seed: 61 }); poor.money = 0; ok(!C.socialKinds(poor, C.of(poor)).some(k => k[0] === 'hyp_savings'), 'không có tiền tiết kiệm thì không có sự kiện mất tiền tiết kiệm');
}

// 9. Chạy tự động qua nhiều bối cảnh: sự kiện xã hội xuất hiện đúng nơi và không lỗi; không xuất hiện ở nước yên bình
{
  const cases = [['VN', 1935, 'vn'], ['VN', 1945, 'vn'], ['IN', 1925, 'world'], ['DZ', 1940, 'world'], ['CN', 1945, 'world'], ['KH', 1955, 'world'], ['SU', 1912, 'world'], ['BA', 1975, 'world'], ['SY', 1995, 'world'], ['ID', 1935, 'world']];
  const seen = {}; let crash = 0;
  cases.forEach(([cc, y, mode], i) => { for (let s = 0; s < 4; s++) { const l = E.createLife({ mode, country: cc, seed: 1000 + i * 9 + s, year: y }); try { let g = 0; while (l.alive && l.age < 60 && g++ < 70) yearOf(l); } catch (e) { crash++; console.log(cc, y, e.stack.split('\n').slice(0, 3).join(' | ')); } Object.keys((l.flags.ctx945 || { noted: {} }).noted).forEach(k => { const b = k.split(':')[0]; if (/^(col_|land|purge|expel|hyp)/.test(b)) seen[b] = (seen[b] || 0) + 1; }); } });
  ok(crash === 0, 'chạy 40 đời không lỗi');
  ok(['col_tax', 'col_exam', 'land', 'purge', 'expel'].every(k => seen[k] >= 1), 'các loại sự kiện xã hội xuất hiện khi chơi tự động: ' + JSON.stringify(seen));
  const quiet = ['SE', 'CH', 'NZ'].map((cc, i) => { const l = E.createLife({ mode: 'world', country: cc, seed: 70 + i, year: 1960 }); let g = 0; while (l.alive && l.age < 60 && g++ < 70) yearOf(l); return Object.keys((l.flags.ctx945 || { noted: {} }).noted).filter(k => /^(col_|land|purge|expel|hyp)/.test(k)).length; });
  ok(quiet.every(x => x === 0), 'nước yên bình không có sự kiện xã hội');
}

// 10. Tương thích: bỏ data-ctx951 thì đời sinh 2026 giống hệt; có data-ctx951 cũng giống hệt (không có vùng nào áp ở Việt Nam, Nhật Bản, Hàn Quốc năm 2026)
{
  const hashes = e => [['vn', 'VN'], ['world', 'JP'], ['world', 'KR']].map(([mode, cc], i) => { const l = e.createLife({ mode, country: cc, seed: 6100 + i, year: 2026 }); e.runHeadless(l); return crypto.createHash('sha1').update(JSON.stringify({ log: l.log.map(x => [x.a, x.t]), money: Math.round(l.money * 100) })).digest('hex'); });
  const a = hashes(gameContext({ skip: ['js/data-ctx951.js'] }).E), b = hashes(gameContext().E); ok(a.every((h, i) => h === b[i]), 'đời sinh 2026 giống hệt khi có và không có dữ liệu vùng/chính sách');
}
console.log('PASS ctx951: ' + n + ' checks');

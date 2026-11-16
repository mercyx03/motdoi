'use strict';
// 9.5.2: vùng trong nước cho mọi cuộc chiến, nạn đói và thiên tai mức 2–3 (data-ctx952.js), mốc lịch sử theo thành phố và năm,
// và cơ chế sơ tán thật sự tới nơi yên hơn rồi về lại khi quê cũ đã yên (ctx945.js: refuge, relocateTo, refugeReturn).
const assert = require('node:assert/strict');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, U = G.U, H = E.H, C = E.CTX945, D = C.DATA;
let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };
const R = l => () => U.rand(l);
function life(cc, y, city, o) { o = o || {}; const l = E.createLife({ mode: cc === 'VN' ? 'vn' : 'world', country: cc, seed: o.seed || 41, year: y - (o.age || 0), gender: o.sex || 'M' }); l.age = o.age == null ? 0 : o.age; l.alive = true; l.pending = []; l.sched = []; if (city) { l.city = city; l.place = city; } return l; }
function yearOf(l) { E.beginYear(l, { auto: true }); let k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); E.endYear(l); }
const lev = (cc, y, city) => C.of(life(cc, y, city));

// 1. Dữ liệu hợp lệ
{
  const known = new Set(G.W.C.map(c => c.code)), groups = new Set(Object.keys(D.GRP));
  const Z2 = D.ZONE.slice(D.ZONE.length - 400 > 0 ? 0 : 0);
  ok(D.ZONE.length >= 480, 'bảng vùng có đủ dòng (' + D.ZONE.length + ')');
  D.ZONE.forEach(r => {
    ok(known.has(r[0]) || groups.has(r[0]), 'mã nước hợp lệ: ' + r[0]);
    ok(r[1] <= r[2] && r[1] >= 1900 && r[2] <= 2025, 'khoảng năm hợp lệ: ' + r[0] + ' ' + r[1] + '–' + r[2]);
    ok(typeof r[3] === 'string' && new RegExp(r[3], 'i'), 'biểu thức thành phố hợp lệ');
    const ks = Object.keys(r[4]); ok(ks.length >= 1 && ks.every(k => ['war', 'fam', 'dis'].includes(k)), 'chỉ đổi war/fam/dis');
    ks.forEach(k => { const v = r[4][k]; ok(typeof v === 'number' ? v !== 0 && Math.abs(v) <= 3 : /^=[0-3]$/.test(v), 'giá trị hợp lệ ' + r[0] + ' ' + JSON.stringify(r[4])); });
    ok(r[5] && r[5].length > 5, 'có nhãn: ' + r[0] + ' ' + r[1]);
    if (r[0] !== 'VN') { const B = G.W.BY[r[0]]; ok(B && B.cities.some(c => new RegExp(r[3], 'i').test(c)), 'có thành phố khớp: ' + r[0] + ' ' + r[3].slice(0, 30)); }
  });
  // thành phố của Việt Nam: mỗi dòng phải khớp ít nhất một tỉnh lỵ trong dữ liệu
  const vn = G.VN.P63.map(p => p.city);
  D.ZONE.filter(r => r[0] === 'VN').forEach(r => ok(vn.some(c => new RegExp(r[3], 'i').test(c)), 'khớp tỉnh lỵ Việt Nam: ' + r[3].slice(0, 30)));
  ok(Array.isArray(D.ZONE_NATIONAL) && D.ZONE_NATIONAL.length >= 40, 'có danh sách cửa sổ giữ đồng đều cả nước');
  D.ZONE_NATIONAL.forEach(r => { ok(known.has(r[0]), 'nước hợp lệ ' + r[0]); ok(r[1] <= r[2] && r[3] && r[3].length >= 15, 'có lý do rõ: ' + r[0] + ' ' + r[1]); });
}

// 2. Độ phủ: mọi sự kiện mức 2–3 của chiến tranh, nạn đói, thiên tai đều có vùng, hoặc có lý do giữ đồng đều
{
  const expand = cc => D.GRP[cc] ? D.GRP[cc] : [cc];
  const evs = [];
  D.WAR.forEach(r => expand(r[0]).forEach(cc => evs.push({ cc, a: r[1], b: r[2], lv: r[3], k: 'war', n: r[5] })));
  D.FAM.forEach(r => expand(r[0]).forEach(cc => evs.push({ cc, a: r[1], b: r[2], lv: r[3], k: 'fam', n: r[4] })));
  D.DIS.forEach(r => expand(r[0]).forEach(cc => evs.push({ cc, a: r[1], b: r[1], lv: r[2], k: 'dis', n: r[3] })));
  const big = evs.filter(e => e.lv >= 2 && G.W.BY[e.cc]);
  ok(big.length >= 370, 'đủ số sự kiện mức 2–3 để kiểm (' + big.length + ')');
  const missing = big.filter(e => !(C.ZONEX[e.cc] || []).some(z => z.a <= e.b && z.b >= e.a && z.d[e.k] !== undefined) && !D.ZONE_NATIONAL.some(r => r[0] === e.cc && r[1] <= e.b && r[2] >= e.a));
  ok(missing.length === 0, 'mọi sự kiện mức 2–3 đều có vùng hoặc lý do đồng đều; thiếu: ' + missing.slice(0, 6).map(e => e.cc + ' ' + e.a + '-' + e.b + ' ' + e.k + ' ' + e.n).join('; '));
  const zoned = big.filter(e => (C.ZONEX[e.cc] || []).some(z => z.a <= e.b && z.b >= e.a && z.d[e.k] !== undefined)).length;
  ok(zoned / big.length >= 0.8, 'phần lớn sự kiện có vùng riêng (' + zoned + '/' + big.length + ')');
}

// 3. Mốc lịch sử theo thành phố và năm: [nước, năm, thành phố, war, fam, dis] (null = không kiểm)
{
  const T = [
    // Việt Nam
    ['VN', 1957, 'Hà Nội', 1, null, null], ['VN', 1962, 'thành phố Cần Thơ', 2, null, null], ['VN', 1962, 'Hà Nội', 1, null, null], ['VN', 1966, 'Hà Nội', 3, null, null],
    ['VN', 1970, 'Hà Nội', 2, null, null], ['VN', 1950, 'thành phố Vinh', 2, null, null], ['VN', 1953, 'thành phố Quảng Ngãi', 3, null, null],
    ['VN', 1978, 'Hà Nội', 0, null, null], ['VN', 1978, 'thành phố Tây Ninh', 3, null, null], ['VN', 1979, 'thành phố Lạng Sơn', 3, null, null], ['VN', 1979, 'Hà Nội', 0, null, null],
    ['VN', 1984, 'thành phố Hà Giang', 3, null, null], ['VN', 1984, 'TP. Hồ Chí Minh', 0, null, null], ['VN', 2024, 'thành phố Yên Bái', null, null, 3], ['VN', 2024, 'TP. Hồ Chí Minh', null, null, 0], ['VN', 2024, 'Hà Nội', null, null, 2],
    // Trung Quốc, Nhật Bản
    ['CN', 1976, 'Thiên Tân', null, null, 3], ['CN', 1976, 'Bắc Kinh', null, null, 2], ['CN', 1976, 'Thượng Hải', null, null, 0], ['CN', 1931, 'Vũ Hán', null, null, 3], ['CN', 1931, 'Quảng Châu', null, null, 0],
    ['CN', 1929, 'Tây An', null, 3, null], ['CN', 1929, 'Quảng Châu', null, 0, null], ['CN', 1943, 'Thành Đô', null, 0, null],
    ['JP', 1923, 'Tokyo', null, null, 3], ['JP', 1923, 'Osaka', null, null, 0], ['JP', 2011, 'Sendai', null, null, 3], ['JP', 2011, 'Osaka', null, null, 0], ['JP', 2011, 'Tokyo', null, null, 1], ['JP', 1995, 'Kobe', null, null, 3],
    // Đông Nam Á, Nam Á
    ['ID', 1946, 'Surabaya', 3, null, null], ['ID', 1946, 'Denpasar', 1, null, null], ['ID', 1965, 'Denpasar', 3, null, null], ['ID', 1965, 'Makassar', 1, null, null], ['ID', 1990, 'Jakarta', 1, null, null],
    ['IN', 1947, 'Delhi', 3, null, null], ['IN', 1947, 'Chennai', 1, null, null], ['PK', 1947, 'Lahore', 3, null, null], ['PK', 1947, 'Peshawar', 1, null, null], ['PK', 2022, 'Quetta', null, null, 3],
    ['BD', 1974, 'Rangpur', null, 3, null], ['BD', 1974, 'Chittagong', null, 2, null], ['BD', 1970, 'Chittagong', null, null, 3], ['BD', 1970, 'Dhaka', null, null, 1],
    ['MM', 2025, 'Mandalay', null, null, 3], ['MM', 2025, 'Yangon', null, null, 1], ['PH', 2005, 'Manila', 1, null, null],
    // Mỹ Latinh
    ['MX', 1985, 'Mexico City', null, null, 2], ['MX', 1985, 'Guadalajara', null, null, 0], ['MX', 2010, 'Ciudad Juárez', 3, null, null], ['MX', 2010, 'Mérida', 0, null, null],
    ['CO', 1952, 'Bogotá', 3, null, null], ['CO', 1952, 'Cartagena', 1, null, null], ['AR', 1977, 'Tucumán', 3, null, null], ['AR', 1977, 'Mendoza', 2, null, null], ['AR', 1981, 'Buenos Aires', 1, null, null],
    ['CL', 1974, 'Santiago', 3, null, null], ['CL', 1985, 'Santiago', 1, null, null], ['CL', 1960, 'Concepción', null, null, 3], ['CL', 1960, 'Antofagasta', null, null, 0],
    ['HT', 2023, 'Port-au-Prince', 3, null, null], ['HT', 2023, 'Cap-Haïtien', 1, null, null], ['EC', 2024, 'Guayaquil', 3, null, null], ['EC', 2024, 'Quito', 1, null, null],
    // Liên Xô cũ và Châu Âu
    ['RU', 1921, 'Samara', null, 3, null], ['RU', 1921, 'Moscow', null, 2, null], ['RU', 1921, 'Novosibirsk', null, 2, null], ['UA', 1922, 'Odesa', null, 3, null], ['UA', 1922, 'Lviv', null, 0, null],
    ['UA', 2018, 'Kharkiv', 1, null, null], ['UA', 2023, 'Kharkiv', 3, null, null], ['UA', 2023, 'Lviv', 2, null, null], ['KZ', 1943, 'Almaty', 2, null, null], ['AM', 1990, 'Yerevan', 2, null, null], ['AZ', 2020, 'Ganja', 2, null, null], ['AZ', 2020, 'Baku', 1, null, null],
    ['DE', 1916, 'Berlin', 1, 2, null], ['DE', 1916, 'Munich', 1, 1, null], ['FR', 1916, 'Marseille', 2, null, null], ['FR', 1916, 'Lille', 3, null, null], ['FR', 1941, 'Lyon', 1, null, null], ['FR', 1941, 'Paris', 2, null, null],
    ['PL', 1915, 'Poznań', 1, null, null], ['PL', 1915, 'Warsaw', 3, null, null], ['NL', 1944, 'Eindhoven', 1, null, null], ['NL', 1944, 'Amsterdam', 3, 3, null], ['ES', 1945, 'Barcelona', null, 1, null], ['ES', 1945, 'Seville', null, 2, null],
    ['GR', 1920, 'Athens', 1, null, null], ['TR', 1921, 'İzmir', 3, null, null], ['TR', 1921, 'Istanbul', 2, null, null], ['TR', 1990, 'Diyarbakır', 3, null, null], ['TR', 1990, 'Istanbul', 1, null, null],
    ['TR', 2023, 'Gaziantep', null, null, 3], ['TR', 2023, 'Istanbul', null, null, 0], ['CY', 1974, 'Nicosia', 2, null, null], ['CY', 1974, 'Limassol', 1, null, null],
    // Trung Đông, Bắc Phi
    ['EG', 1941, 'Alexandria', 3, null, null], ['EG', 1941, 'Cairo', 1, null, null], ['LY', 1930, 'Benghazi', 3, null, null], ['IQ', 1984, 'Basra', 3, null, null], ['IQ', 1984, 'Mosul', 2, null, null],
    ['IR', 1985, 'Ahvaz', 3, null, null], ['IR', 1985, 'Shiraz', 2, null, null], ['LB', 2024, 'Tyre', 3, null, null], ['LB', 2024, 'Tripoli', 1, null, null], ['LB', 2020, 'Beirut', null, null, 3], ['LB', 2020, 'Tripoli', null, null, 0],
    ['IL', 2024, 'Beersheba', 3, null, null], ['PS', 2024, 'Gaza', 3, 3, null], ['PS', 2024, 'Ramallah', 2, 1, null], ['SY', 2023, 'Aleppo', null, null, 3], ['SY', 2023, 'Damascus', null, null, 0], ['MA', 2023, 'Marrakesh', null, null, 2], ['MA', 2023, 'Casablanca', null, null, 0],
    // Châu Phi
    ['SD', 1960, 'Khartoum', 1, null, null], ['SD', 2004, 'Nyala', 3, 3, null], ['SD', 2004, 'Khartoum', null, 0, null], ['SS', 1960, 'Juba', 3, null, null], ['SO', 1995, 'Hargeisa', 1, null, null], ['SO', 1995, 'Mogadishu', 3, null, null],
    ['CD', 1962, 'Kinshasa', 2, null, null], ['CD', 1962, 'Lubumbashi', 3, null, null], ['CD', 2013, 'Kinshasa', 1, null, null], ['CD', 2013, 'Goma', 3, null, null], ['RW', 1991, 'Musanze', 3, null, null], ['RW', 1991, 'Huye', 1, null, null],
    ['NG', 2012, 'Maiduguri', 3, null, null], ['NG', 2012, 'Lagos', 1, null, null], ['ET', 2024, 'Gondar', 3, null, null], ['ET', 2024, 'Addis Ababa', 1, null, null], ['MZ', 1985, 'Maputo', 2, null, null], ['MZ', 1985, 'Beira', 3, null, null],
    ['ML', 1971, 'Timbuktu', null, 3, null], ['ML', 1971, 'Bamako', null, 2, null], ['KE', 2008, 'Eldoret', 3, null, null], ['KE', 2008, 'Mombasa', 1, null, null],
    ['RU', 2024, 'Moscow', 1, null, null]
  ];
  T.forEach(([cc, y, city, w, f, d]) => { const o = lev(cc, y, city); if (w != null) ok(o.war === w, cc + ' ' + y + ' ' + city + ' chiến sự = ' + w + ', có ' + o.war); if (f != null) ok(o.fam === f, cc + ' ' + y + ' ' + city + ' nạn đói = ' + f + ', có ' + o.fam); if (d != null) ok(o.dis === d, cc + ' ' + y + ' ' + city + ' thiên tai = ' + d + ', có ' + o.dis); });
  ok(T.length >= 120, 'đủ số mốc lịch sử (' + T.length + ')');
}

// 4. Nhãn vùng đi vào nhật ký của đời sống ở đó, và nơi khác cùng nước không có nhãn đó
{
  const hit = life('VN', 1966, 'Hà Nội'), safe = life('VN', 1966, 'thành phố Cần Thơ');
  const read = l => { l.log = l.log || []; yearOf(l); return l.log.map(x => x.t).join(' | '); };
  const tH = read(hit), tS = read(safe);
  ok(/ném bom/i.test(tH), 'đời ở Hà Nội 1966 ghi nhớ cuộc ném bom: ' + tH.slice(0, 160));
  ok(!/ném bom miền Bắc/i.test(tS), 'đời ở Cần Thơ cùng năm không bị ghi nhận cuộc ném bom miền Bắc');
  const base = C.hazard(life('VN', 1957, 'Hà Nội'), lev('VN', 1957, 'Hà Nội'), 3).reduce((s, x) => s + x[0], 0), war = C.hazard(life('VN', 1966, 'Hà Nội'), lev('VN', 1966, 'Hà Nội'), 3).reduce((s, x) => s + x[0], 0);
  ok(war > base * 1.5, 'nguy cơ tử vong của trẻ ở Hà Nội 1966 cao hơn hẳn năm 1957 (' + war.toFixed(4) + ' so với ' + base.toFixed(4) + ')');
}

// 5. Sơ tán thật sự tới nơi yên hơn
{
  const surabaya = life('ID', 1946, 'Surabaya', { age: 0 });
  const here = C.hardness(C.levelAt('ID', 1946, 'Surabaya'));
  const dest = C.refuge(surabaya);
  ok(dest && dest !== 'Surabaya', 'tìm được nơi yên hơn cho người ở Surabaya 1946: ' + dest);
  ok(C.hardness(C.levelAt('ID', 1946, dest)) <= here - 2, 'nơi đến yên hơn rõ rệt');
  ok(C.refuge(surabaya) === dest, 'chọn nơi ổn định theo mã đời');
  ok(C.refuge(life('ID', 1946, 'Denpasar')) === null || C.hardness(C.levelAt('ID', 1946, C.refuge(life('ID', 1946, 'Denpasar')))) <= C.hardness(C.levelAt('ID', 1946, 'Denpasar')) - 2, 'không chuyển sang nơi kém yên hơn');
  ok(C.refuge(life('JP', 2005, 'Tokyo')) === null, 'thời bình không có nơi nào yên hơn rõ rệt nên không chuyển');
  const ab = life('ID', 1946, 'Surabaya'); ab.abroad = { code: 'US', name: 'Mỹ', perm: true }; ok(C.refuge(ab) === null, 'người đang ở nước ngoài không dùng bảng vùng của quê');

  // lựa chọn sơ tán đi qua sự kiện thật
  const l = life('ID', 1946, 'Surabaya', { age: 22 }); l.job = { t: 'Thợ' }; l.income = 3; l.flags.ctx945 = null;
  const d = E.DEC.ctx945_event.make(l, R(l), { kind: 'shelter', y: 1946 }); l.pending = [d];
  const flee = d.opts.find(o => /Sơ tán/.test(o.l)); ok(flee && /Chuyển tới /.test(flee.h), 'lựa chọn sơ tán nói rõ nơi sẽ chuyển tới: ' + (flee && flee.h));
  const dest22 = C.refuge(l), money0 = l.money; E.resolve(l, flee.k);
  ok(l.city !== 'Surabaya' && l.city === dest22, 'nhân vật thật sự chuyển tới nơi yên hơn: ' + l.city);
  ok(l.flags.ctx945.refuge && l.flags.ctx945.refuge.from === 'Surabaya' && l.flags.ctx945.refuge.to === l.city, 'ghi nhớ nơi đi và nơi đến');
  ok(!l.job && l.flags.needJob, 'việc làm cũ bị bỏ lại và phải tìm việc mới');
  ok(l.money < money0, 'tốn chi phí sơ tán');
  ok(l.log.some(x => /Cả nhà chuyển tới/.test(x.t)), 'nhật ký ghi nơi chuyển tới');

  // về lại khi quê cũ đã yên
  const home = l.flags.ctx945.refuge; l.alive = true; let back = null;
  for (let y = 1947; y <= 1955 && !home.back && !home.stay; y++) { l.age = y - l.birthYear; C.refugeReturn(l, C.of(l), (t, k) => l.log.push({ a: l.age, y, t, k })); }
  ok(home.back || home.stay, 'sau vài năm người sơ tán hoặc về quê khi đã yên, hoặc ổn định ở nơi mới');
  if (home.back) ok(l.city === 'Surabaya', 'đã về lại quê cũ');
  // quê cũ vẫn loạn thì không về, rồi ổn định sau bảy năm
  const l2 = life('LB', 1976, 'Beirut', { age: 20 }); l2.flags.ctx945 = null; l2.pending = [E.DEC.ctx945_event.make(l2, R(l2), { kind: 'shelter', y: 1976 })];
  const d2 = l2.pending[0], f2 = d2.opts.find(o => /Sơ tán/.test(o.l)); E.resolve(l2, f2.k); const rf2 = l2.flags.ctx945.refuge; ok(rf2 && rf2.from === 'Beirut' && l2.city !== 'Beirut', 'người ở Beirut 1976 sơ tán đi nơi khác: ' + l2.city);
  for (let y = 1977; y <= 1990; y++) { l2.age = y - l2.birthYear; C.refugeReturn(l2, C.of(l2), (t, k) => l2.log.push({ a: l2.age, y, t, k })); if (rf2.back) break; }
  ok(!rf2.back && rf2.stay, 'quê cũ còn chiến sự thì không về, và sau bảy năm ở nơi mới thì ổn định');

  // sơ tán lần hai: vẫn nhớ quê gốc, chỉ đổi nơi đang ở
  { const l3 = life('LB', 1982, 'Beirut', { age: 30 }); l3.flags.ctx945 = null; C.relocateTo(l3, C.of(l3), () => {}, 'Chạy loạn.'); const first = l3.flags.ctx945.refuge, c1 = l3.city; ok(first && first.from === 'Beirut' && first.to === c1, 'lần sơ tán đầu ghi quê gốc');
    l3.city = 'Tripoli'; l3.place = 'Tripoli'; first.to = 'Tripoli'; const l3b = C.refuge(l3); if (l3b) { C.relocateTo(l3, C.of(l3), () => {}, 'Chạy loạn lần nữa.'); ok(l3.flags.ctx945.refuge.from === 'Beirut' && l3.flags.ctx945.refuge.to === l3.city, 'sơ tán lần hai vẫn nhớ quê gốc Beirut'); } else ok(true, 'không có nơi nào yên hơn Tripoli lúc này'); }
  // nạn đói: rời quê tìm nơi có ăn cũng đi tới nơi khác
  const lf = life('CN', 1929, 'Tây An', { age: 25 }); lf.flags.ctx945 = null; lf.pending = [E.DEC.ctx945_event.make(lf, R(lf), { kind: 'hunger', y: 1929 })];
  const df = lf.pending[0], leave = df.opts.find(o => /Rời quê/.test(o.l)); lf.st.hap = 50; let q = 0; do { lf.alive = true; lf.flags.ctx945 = null; lf.city = 'Tây An'; lf.pending = [E.DEC.ctx945_event.make(lf, R(lf), { kind: 'hunger', y: 1929 })]; E.resolve(lf, lf.pending[0].opts.find(o => /Rời quê/.test(o.l)).k); } while (lf.city === 'Tây An' && lf.alive && q++ < 12);
  ok(!lf.alive || lf.city !== 'Tây An', 'nạn đói ở Tây An 1929: rời quê thì tới nơi có ăn hơn: ' + lf.city);

  // đời cũ (không có refuge) và người không có nơi nào yên hơn vẫn chạy bình thường
  const old = life('JP', 1960, 'Tokyo', { age: 30 }); old.flags.ctx945 = { noted: {} }; C.refugeReturn(old, C.of(old), () => {}); ok(old.city === 'Tokyo', 'bản lưu cũ không có refuge vẫn chạy bình thường');
  const calm = life('JP', 1944, 'Tokyo', { age: 30 }); calm.flags.ctx945 = null; calm.pending = [E.DEC.ctx945_event.make(calm, R(calm), { kind: 'shelter', y: 1944 })];
  const fc = calm.pending[0].opts.find(o => /Sơ tán/.test(o.l)); E.resolve(calm, fc.k); ok(calm.city !== undefined, 'sơ tán không để lại thành phố rỗng: ' + calm.city);
}

// 6. Việt Nam: sơ tán theo tỉnh lỵ, ưu tiên cùng vùng
{
  const l = life('VN', 1968, 'Hà Nội', { age: 21 }); l.flags.ctx945 = null; l.region = l.region || 'DBSH';
  const d = C.refuge(l); ok(d && d !== 'Hà Nội' && G.VN.P63.some(p => p.city === d), 'người ở Hà Nội 1968 sơ tán tới một tỉnh lỵ khác: ' + d);
  ok(C.hardness(C.levelAt('VN', 1968, d)) <= C.hardness(C.levelAt('VN', 1968, 'Hà Nội')) - 2, 'tỉnh lỵ đến yên hơn Hà Nội thời bị ném bom');
  l.pending = [E.DEC.ctx945_event.make(l, R(l), { kind: 'shelter', y: 1968 })]; const f = l.pending[0].opts.find(o => /Sơ tán/.test(o.l)); E.resolve(l, f.k);
  ok(l.city !== 'Hà Nội' && l.urban === true, 'nhân vật Việt Nam chuyển tỉnh lỵ: ' + l.city);
}

// 7. Tương tác với hệ thống khác: người tị nạn sang nước khác vẫn dùng nước sở tại, không dùng bảng vùng của quê
{
  const l = life('LB', 2024, 'Tyre', { age: 25 }); ok(C.of(l).war === 3, 'Tyre 2024 là vùng chiến sự');
  l.abroad = { code: 'FR', name: 'Pháp', perm: true }; l.city = 'Paris'; l.place = 'Paris';
  ok(C.of(l).war === 0, 'sang Pháp thì dùng bối cảnh của Pháp năm đó, không dùng chiến sự của Tyre');
  ok(C.socialKinds && typeof C.socialKinds === 'function', 'hệ thống xã hội ctx951 vẫn còn');
  ok(D.SOC.some(r => r[0] === 'SD' && r[1] === 2023) && D.SOC.some(r => r[0] === 'LB' && r[1] === 2024), 'có dòng di dời mới cho Sudan 2023 và Liban 2024');
  ok(D.WAR.some(r => r[0] === 'SS' && r[1] === 1955), 'đã thêm cuộc nội chiến Sudan lần thứ nhất cho miền nam (Nam Sudan)');
}

console.log('ctx952 OK: ' + n + ' kiểm tra');

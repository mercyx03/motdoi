/* Một Đời — 9.5 bối cảnh thời đại: chiến tranh, nạn đói, dịch bệnh, khủng hoảng, thiên tai và mức thiếu thốn theo NƯỚC và NĂM của nhân vật.
   Mở rộng era920 (số liệu quốc gia theo năm), era902 (chặn nội dung sai thời) và hist920 (biến cố có lựa chọn, hậu quả dang dở); không dựng hệ thống riêng.
   · E.CTX945.of(l): các thành phần (war, fam, epi, econ, dis) theo nước đang sống và năm thế giới, mức thiếu thốn nền (pov) suy ra từ mức phát triển tuyệt đối (E.devGdp), và mức tổng (level 0–3).
   · Tử vong cộng thêm: đời 1900–1949 dùng đủ mức; từ 1950 chỉ dùng 40% vì tuổi thọ và tử vong dưới 5 tuổi theo năm (era920, UN) đã gồm một phần các cuộc khủng hoảng.
   · Sinh ra giữa chiến tranh hoặc nạn đói: sức khỏe sơ sinh kém, bố mẹ dễ mất, không có lễ/đồ chơi như thời bình; nhà trường đóng cửa, thu nhập và lương thực xấu đi.
   · Phong tục và lựa chọn thời bình (thôi nôi bốc đồ, sinh nhật, mẫu giáo, học thêm, trường quốc tế) chỉ có khi hoàn cảnh cho phép; sự kiện xa xỉ giảm, sự kiện nguy hiểm tăng.
   · Mỗi năm ở hoàn cảnh khó có thể gặp "việc của thời loạn / đói / dịch" với nhiều cách xử lý và hậu quả.
   Mọi hệ số là tham số trò chơi. Không gán tính cách hay số phận theo giàu nghèo, tôn giáo, sắc tộc hay ngoại hình: rủi ro theo nước, năm, tuổi và hoàn cảnh nhà. */
(function (G) {
  'use strict';
  var E = G.E, H = E && E.H, U = G.U, X = E && E.UPDATE110, D = G.CTX945_DATA; if (!E || !H || !D) return;
  function expand(cc) { return D.GRP[cc] || [cc]; }
  var IDX = {}, GLOBAL = { epi: [], econ: [] };
  function put(cc, k, row) { (IDX[cc] = IDX[cc] || { war: [], fam: [], epi: [], econ: [], dis: [] })[k].push(row); }
  D.WAR.forEach(function (r) { expand(r[0]).forEach(function (c) { put(c, 'war', { a: r[1], b: r[2], s: r[3], k: r[4], n: r[5] }); }); });
  D.FAM.forEach(function (r) { expand(r[0]).forEach(function (c) { put(c, 'fam', { a: r[1], b: r[2], s: r[3], n: r[4] }); }); });
  D.EPI.forEach(function (r) { if (r[0] === '*') GLOBAL.epi.push({ a: r[1], b: r[2], s: r[3], n: r[4] }); else expand(r[0]).forEach(function (c) { put(c, 'epi', { a: r[1], b: r[2], s: r[3], n: r[4] }); }); });
  D.ECON.forEach(function (r) { if (r[0] === '*') GLOBAL.econ.push({ a: r[1], b: r[2], s: r[3], k: r[4], n: r[5] }); else expand(r[0]).forEach(function (c) { put(c, 'econ', { a: r[1], b: r[2], s: r[3], k: r[4], n: r[5] }); }); });
  D.DIS.forEach(function (r) { put(r[0], 'dis', { a: r[1], b: r[1], s: r[2], n: r[3] }); });
  var RES = {};
  (D.RESTRICT || []).forEach(function (r) { expand(r[0]).forEach(function (c) { (RES[c] = RES[c] || []).push({ a: r[1], b: r[2], s: r[3], n: r[4] }); }); });
  // thời thuộc địa suy ra từ bảng bối cảnh chính trị của era920-pol ("thuộc địa của X", "lãnh thổ bảo hộ của X"); trước 1950 coi như kéo dài nếu cửa sổ đầu tiên bắt đầu từ 1950
  var COL = {}; (D.COLONY || []).forEach(function (r) { if (r[3] !== 'không thuộc địa') (COL[r[0]] = COL[r[0]] || []).push(r); });
  function colonyAt(cc, y) {
    var cl = COL[cc]; if (cl) for (var j = 0; j < cl.length; j++) if (y >= cl[j][1] && y <= cl[j][2]) return cl[j][3];
    var P = E.ERA920 && E.ERA920.POL, S = P && P.STATUS && P.STATUS[cc]; if (!S) return null; var first = null;
    for (var i = 0; i < S.length; i++) { var m = /^(?:thuộc địa|lãnh thổ bảo hộ) của (.+)$/.exec(S[i][2]); if (!m) continue; if (first == null || S[i][0] < first.a) first = { a: S[i][0], ruler: m[1] }; if (y >= S[i][0] && y <= S[i][1]) return m[1]; }
    if (first && first.a <= 1950 && y < first.a && y >= 1900) return first.ruler; return null;
  }
  var cache = {};
  function best(list, y) { var b = null; for (var i = 0; i < list.length; i++) { var w = list[i]; if (y >= w.a && y <= w.b && (!b || w.s > b.s)) b = w; } return b; }
  // Các nước còn đang chịu ảnh hưởng của đại dịch cúm 1918 toàn cầu / Đại suy thoái được áp cho mọi nước; mức giảm nhẹ ở nước giàu tách biệt khỏi chiến sự.
  // mức tổng hợp từ các thành phần (dùng cho cả mức quốc gia và mức đã chỉnh theo vùng)
  function derive(o) {
    o.crisis = Math.max(o.war, o.fam, o.epi >= 2 ? o.epi : 0, o.dis, o.econ >= 3 ? 3 : o.econ >= 2 ? 2 : 0);
    var multi = (o.war >= 2 ? 1 : 0) + (o.fam >= 2 ? 1 : 0) + (o.epi >= 2 ? 1 : 0) + (o.dis >= 2 ? 1 : 0) + (o.econ >= 2 ? 1 : 0);
    o.level = Math.min(3, o.crisis + (multi >= 2 ? 1 : 0)); if (o.crisis === 0 && o.econ === 1) o.level = 0;
    o.hard = Math.max(o.war, o.fam, o.epi >= 2 ? o.epi : 0, o.dis, o.econ >= 3 ? 3 : 0); // mức dùng cho phong tục: kinh tế bao cấp hay suy thoái nhẹ không làm mất lễ thôi nôi
    return o;
  }
  // chính sách xã hội và chính trị lớn (ruộng đất, chiến dịch chính trị, di dời) theo nước và năm
  var SOCX = {};
  (D.SOC || []).forEach(function (r) { expand(r[0]).forEach(function (c) { ((SOCX[c] = SOCX[c] || {})[r[3]] = (SOCX[c][r[3]] || [])).push({ a: r[1], b: r[2], s: r[4], sh: r[5], n: r[6] }); }); });
  function socOf(cc, y, o) {
    var I = SOCX[cc]; o.land = o.purge = o.expel = 0; o.soc = {};
    if (!I) return o;
    ['land', 'purge', 'expel'].forEach(function (k) { var b = I[k] && best(I[k], y); if (b) { o[k] = b.s; o.soc[k] = { s: b.s, share: b.sh, n: b.n }; } });
    return o;
  }
  // vùng trong nước (thành phố hoặc tỉnh) chịu mức khác mức chung của nước
  var ZONEX = {};
  (D.ZONE || []).forEach(function (r) { (ZONEX[r[0]] = ZONEX[r[0]] || []).push({ a: r[1], b: r[2], re: new RegExp(r[3], 'i'), d: r[4], n: r[5] }); });
  function zoneRows(cc, y, city) { var Z = ZONEX[cc]; if (!Z || !city) return null; var out = null; for (var i = 0; i < Z.length; i++) { var z = Z[i]; if (y >= z.a && y <= z.b && z.re.test(city)) (out = out || []).push(z); } return out; }
  function zoned(c, rows) {
    var o = Object.assign({}, c); o.zone = []; o.labels = Object.assign({}, c.labels);
    rows.forEach(function (z) { ['war', 'fam', 'dis'].forEach(function (k) { var v = z.d[k]; if (v == null) return; o[k] = typeof v === 'string' ? +v.slice(1) : Math.max(0, Math.min(3, o[k] + v)); if (o[k] > 0 && (z.d[k] !== 0)) o.labels[k] = z.n; }); o.zone.push(z.n); });
    return derive(o);
  }
  function at(cc, y) {
    var key = cc + ':' + y; if (cache[key]) return cache[key];
    var I = IDX[cc] || { war: [], fam: [], epi: [], econ: [], dis: [] };
    var w = best(I.war, y), f = best(I.fam, y), e = best(I.epi.concat(GLOBAL.epi), y), c = best(I.econ.concat(GLOBAL.econ), y), d = best(I.dis, y);
    var o = { cc: cc, y: y, war: w ? w.s : 0, fam: f ? f.s : 0, epi: e ? e.s : 0, econ: c ? c.s : 0, dis: d ? d.s : 0, warKind: w && w.k, econKind: c && c.k, labels: { war: w && w.n, fam: f && f.n, epi: e && e.n, econ: c && c.n, dis: d && d.n } };
    var rs = best(RES[cc] || [], y); o.restrict = rs ? rs.s : 0; o.restrictLabel = rs && rs.n; o.colony = colonyAt(cc, y);
    socOf(cc, y, o); derive(o);
    return (cache[key] = o);
  }
  function wy(l) { return l.birthYear + (l.age || 0); }
  function resCc(l) { return H.resCode ? H.resCode(l) : l.country; }
  // mức thiếu thốn nền theo mức phát triển tuyệt đối của nước tại năm đó (nghìn đô la bình quân đầu người, đã có sẵn ở E.devGdp)
  function pov(l) {
    var y = wy(l), cc = resCc(l), B = G.W && G.W.BY && G.W.BY[cc], a = E.ERA920 && E.ERA920.at ? E.ERA920.at(cc, y) : null, d = B && a ? B.gdp * a.gdpRel * (y < 1950 ? Math.max(0.55, 1 - (1950 - y) * 0.008) : 1) : (E.devGdp ? E.devGdp(l) : l.gdp);
    if (!(d > 0)) return 0;
    var p = d < 1.2 ? 3 : d < 2.5 ? 2 : d < 6 ? 1 : 0; if (y < 1935 && p < 3 && d < 15) p++; return p;
  }
  function of(l) {
    var y = wy(l), cc0 = resCc(l), c = at(cc0, y), zr = zoneRows(cc0, y, l.city || l.place); if (zr) c = zoned(c, zr); var o = Object.create(c); o.pov = pov(l); o.lux = Math.max(c.level, o.pov >= 3 ? 2 : o.pov >= 2 ? 1 : 0); return o;
  }
  function st(l) { return l.flags.ctx945 || (l.flags.ctx945 = { noted: {} }); }
  function r2(l, tag) { var h = 2166136261, s = String(l.id) + ':' + tag; for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 15; h = Math.imul(h, 2246822507); h ^= h >>> 13; return (h >>> 0) / 4294967296; }
  // ------------------------------------------------------------------
  // 1. Tử vong cộng thêm theo tuổi, giới và hoàn cảnh
  // ------------------------------------------------------------------
  var WARP = [0, 0.0012, 0.005, 0.016], FAMP = { c: [0, 0.02, 0.06, 0.14], k: [0, 0.006, 0.02, 0.05], a: [0, 0.002, 0.008, 0.025], o: [0, 0.006, 0.02, 0.06] }, EPIP = [0, 0.001, 0.003, 0.008], DISP = [0, 0.001, 0.004, 0.015];
  function hazard(l, c, a) {
    var out = [], y = wy(l), k = y < 1950 ? 1 : 0.2, male = l.sex === 'M'; // từ 1950 chỉ 20%: tuổi thọ và tử vong dưới 5 tuổi theo năm (UN) đã gồm phần lớn chết vì chiến tranh và đói
    if (c.war) { var p = WARP[c.war] * (a < 5 ? 1.4 : a > 60 ? 1.3 : 1); if (male && a >= 15 && a <= 45 && c.war >= 2 && c.warKind !== 'terror') p *= 3; if (c.warKind === 'terror') p = Math.max(p, [0, 0.003, 0.012, 0.03][c.war]); out.push([p * k, c.labels.war, 'war']); }
    if (c.fam) { var g = a < 5 ? FAMP.c : a < 15 ? FAMP.k : a < 60 ? FAMP.a : FAMP.o; out.push([g[c.fam] * k, c.labels.fam, 'fam']); }
    if (c.epi) { var q = EPIP[c.epi]; if (c.epi >= 3 && a >= 20 && a <= 40) q *= 2.5; out.push([q * k, c.labels.epi, 'epi']); }
    if (c.dis) out.push([DISP[c.dis] * k, c.labels.dis, 'dis']);
    return out;
  }
  var DEATH_TXT = { war: 'chiến sự và bạo lực trong ', fam: 'đói và suy kiệt trong ', epi: 'dịch bệnh trong ', dis: 'thiên tai: ' };
  function deathCheck(l, c, r, log) {
    var hz = hazard(l, c, l.age), tot = 0; hz.forEach(function (x) { tot += x[0]; });
    if (!(tot > 0)) return false;
    if (r() >= Math.min(0.6, tot)) return false;
    var x = r() * tot, pick = hz[0]; for (var i = 0; i < hz.length; i++) { x -= hz[i][0]; if (x <= 0) { pick = hz[i]; break; } }
    H.kill(l, (DEATH_TXT[pick[2]] || '') + pick[1], log, false); return true;
  }
  // ------------------------------------------------------------------
  // 2. Gia đình: bố mẹ chết, thu nhập, lương thực
  // ------------------------------------------------------------------
  function parentLoss(l, c, r, log) {
    var f = l.fam; if (!f || l.age < 1 || l.age > 17) return;
    var sev = Math.max(c.war >= 2 ? c.war : 0, c.fam >= 2 ? c.fam : 0); if (!sev) return;
    var k = wy(l) < 1950 ? 1 : 0.4;
    if (f.fAlive && !f.noDad && f.fAge + l.age >= 18 && f.fAge + l.age <= 55) {
      var pf = [0, 0, 0.02, 0.06][sev] * (c.war >= 2 ? 1.6 : 1) * k;
      if (r() < pf) { f.fAlive = false; var why = c.war >= 2 ? (c.warKind === 'terror' ? 'bị bắt đi và không trở về' : 'đi lính / mất trong chiến sự') : 'kiệt sức vì đói'; log('Bố ' + why + ' ở tuổi ' + (f.fAge + l.age) + '. Cả nhà phải xoay xở khi thiếu một người trụ cột.', 'bad'); l.st.hap -= 14; H.mem(l, 'Năm ' + wy(l) + ', bố không còn nữa vì ' + (c.labels.war || c.labels.fam) + '.', 7); if (E.ERA920 && E.ERA920.HIST) E.ERA920.HIST.open(l, 'hardship', 2); }
    }
    if (f.mAlive && f.mAge + l.age >= 16 && f.mAge + l.age <= 55) {
      var pm = [0, 0, 0.012, 0.04][sev] * (c.fam >= 2 ? 1.4 : 1) * k;
      if (r() < pm) { f.mAlive = false; log('Mẹ mất ở tuổi ' + (f.mAge + l.age) + ' vì ' + (c.fam >= 2 ? 'đói và bệnh' : 'chiến sự') + '. Bạn phải nhờ họ hàng nuôi.', 'bad'); l.st.hap -= 14; H.mem(l, 'Năm ' + wy(l) + ', mẹ ra đi giữa ' + (c.labels.war || c.labels.fam) + '.', 7); if (E.ERA920 && E.ERA920.HIST) E.ERA920.HIST.open(l, 'hardship', 2); }
    }
  }
  function incomeK(c) { return Math.max(0.55, 1 - 0.08 * c.war - 0.1 * c.fam - 0.07 * (c.econ >= 2 ? c.econ : 0) - 0.04 * c.epi - 0.03 * c.dis); }
  function foodK(c) { return 1 + 0.18 * c.fam + 0.08 * c.war + (c.econ >= 2 && c.econKind === 'hyp' ? 0.1 * c.econ : 0.03 * c.econ); }
  var career = E.careerYear;
  E.careerYear = function (l) { var inc = career.apply(this, arguments); if (!(inc > 0)) return inc; var c = of(l); return c.level > 0 || c.econ >= 2 ? inc * incomeK(c) : inc; };
  // ------------------------------------------------------------------
  // 3. Phong tục và lựa chọn chỉ có khi hoàn cảnh cho phép
  // ------------------------------------------------------------------
  // minQ: nhà cần mức khá giả tối thiểu (l.fam.q 1–5) khi nước còn nghèo; maxLevel: mức biến cố tối đa; poor: mức nghèo nền tối đa; fromYear: năm sớm nhất có phong tục này như một lễ riêng
  var CUSTOMS = {
    thoi_noi: { maxLevel: 1, poor: 3, poorMinQ: 3, fromYear: 1900, early: { before: 1960, minQ: 3 }, note: 'lễ thôi nôi bốc đồ' },
    sinh_nhat: { maxLevel: 1, poor: 3, poorMinQ: 4, fromYear: 1960, note: 'tiệc sinh nhật' },
    mau_giao: { maxLevel: 1, poor: 3, poorMinQ: 3, fromYear: 1940, note: 'trường mẫu giáo' },
    do_choi: { maxLevel: 2, poor: 3, poorMinQ: 3, fromYear: 1900, note: 'đồ chơi mua sẵn' },
    hoc_chu_som: { maxLevel: 1, poor: 2, poorMinQ: 3, fromYear: 1950, note: 'học chữ sớm' },
    luyen_thi: { maxLevel: 2, poor: 3, poorMinQ: 3, fromYear: 1950, note: 'lò luyện thi' },
    ban_cuoi: { maxLevel: 2, poor: 3, poorMinQ: 1, fromYear: 1900, note: 'tiệc cưới linh đình' }
  };
  function customAllowed(l, id, c) {
    var R = CUSTOMS[id]; if (!R) return true; c = c || of(l); var q = (l.fam && l.fam.q) || 3, y = wy(l);
    if (y < R.fromYear) return false;
    if (c.hard > R.maxLevel) return false;
    if (R.early && y < R.early.before && q < R.early.minQ) return false;
    if (c.pov >= R.poor && q < R.poorMinQ) return false;
    return true;
  }
  E.TRIG.forEach(function (t) { var R = CUSTOMS[t.id]; if (!R) return; var w = t.when; t.when = function (l, a) { return w(l, a) && customAllowed(l, t.id); }; });
  Object.keys(CUSTOMS).forEach(function (id) { var d = E.DEC[id]; if (!d || !d.def) return; var v = d.def.valid; d.def.valid = function (l, dd) { return customAllowed(l, id) && (!v || v.apply(this, arguments)); }; });
  // Học thêm và trường quốc tế cho con: chỉ có khi nước và thời kỳ đã có (từ khoảng 1990), không ở vùng chiến sự hay nạn đói, nhà đủ điều kiện
  function schoolOptionOk(l, kind) { var c = of(l), y = wy(l), q = (l.fam && l.fam.q) || 3; if (c.hard >= 2) return false; if (kind === 'intl') return y >= 1990 && c.pov <= 2 && q >= 3; if (kind === 'extra') return y >= 1950 && c.pov <= 2 || q >= 4; return true; }
  // Xuất cảnh, du học, xuất khẩu lao động chỉ có khi nước cho phép: mức 3 gần như cấm, mức 2 chỉ khi nhà khá giả và có quan hệ (nhà thường vẫn bị từ chối)
  var EMIG = ['xkld', 'emig', 'du_hoc', 'abroad107', 'abroad107_country', 'abroad107_school', 'abroad107_field', 'abroad107_apply', 'migrate114', 'move114', 'abroadMove146', 'studyVisa900', 'studyAbroad919', 'visaFile900', 'passport918'];
  function emigAllowed(l) { var c = of(l); if (c.restrict >= 3) return false; if (c.restrict === 2) return ((l.fam && l.fam.q) || 3) >= 4; return true; }
  EMIG.forEach(function (id) { var d = E.DEC[id]; if (!d || !d.def) return; var v = d.def.valid; d.def.valid = function (l, dd) { return emigAllowed(l) && (!v || v.apply(this, arguments)); }; });
  E.TRIG.forEach(function (t) { if (EMIG.indexOf(t.id) < 0) return; var w = t.when; t.when = function (l, a) { return w(l, a) && emigAllowed(l); }; });
  var conHoc = E.DEC.con_hoc;
  if (conHoc && conHoc.def && conHoc.def.opts) conHoc.def.opts.forEach(function (o) { if (o.k !== 'intl' && o.k !== 'extra') return; var rq = o.req; o.req = function (l, d) { return schoolOptionOk(l, o.k) && (!rq || rq.apply(this, arguments)); }; });
  // ------------------------------------------------------------------
  // 4. Tần suất sự kiện theo hoàn cảnh (nhân vào xác suất trong engine)
  // ------------------------------------------------------------------
  var LUX = /^(concert|mua_sam|kpop|fan|tiktok|nap_game|gameshow|casting|album|phim|k6_karaoke|karaoke|hx_karaoke|bar_|ca_bao_ke_quan_bar|spa|du_lich|pv_du_lich|mt_|ghep_game|chon_game|sb_|es_|cr_|hdv_|k_truyen_tranh|k_tranh_tivi|dien_thoai_be|xin_dien_thoai|k_bong_da_dem|vape|k6_vape|dk_game|dk_nail|nail|toc_|tk_|dd_phim|np_|vn_xem_mat|dc_|nhat_vi|thu_cung|pet_|viec_online|net_coi|net_tre|show|clb_|elite_|hh_moi|fd_|tp_|bds_|vang_bien_dong|ct_)/;
  var DANGER = /^(bi_cuop|cuop_xe_om|khung_bo|bao_lu|chan_thuong|tram_cam|toi_|trom|an_va|quay_cop|ruot_thua|sot_xuat_huyet|di_ung|k_mat_dien|k_sau_rang|k_nuoi_tam|tram|bi_lac|k6_lac_cho|bat_nat|pet_om|nghi_hoc_ngheo|chu_no|vd_|dk_ve_chai|ve_chai|tien_an_sang|xkld_|k6_nga_cay|kn_duoi_nuoc)/;
  function eventK(T, l) {
    var id = T && T.id; if (!id) return 1; var c = of(l);
    if (!c.level && !c.pov) return 1;
    if (id === 'chien_tranh') return c.war >= 2 ? 1 + c.war : (c.level ? 0.4 : 1);
    var k = 1;
    if (LUX.test(id)) k *= Math.max(0.12, 1 - 0.28 * c.lux);
    if (DANGER.test(id)) k *= Math.min(2.2, 1 + 0.4 * c.level + (c.fam ? 0.2 * c.fam : 0));
    return k;
  }
  // ------------------------------------------------------------------
  // 5. Mỗi năm: ghi chú hoàn cảnh, tử vong, bố mẹ, nhà trường; việc của thời loạn/đói/dịch
  // ------------------------------------------------------------------
  var NOTE = { war: 'Chiến sự và bất ổn bao trùm: ', fam: 'Thiếu lương thực nghiêm trọng: ', epi: 'Dịch bệnh lan rộng: ', econ: 'Kinh tế sụp đổ hoặc khủng hoảng nặng: ', dis: 'Thiên tai nặng nề: ' };
  function labelOf(c) { return c.war >= c.fam && c.war >= 2 ? ['war', c.labels.war] : c.fam >= 2 ? ['fam', c.labels.fam] : c.dis >= 2 ? ['dis', c.labels.dis] : c.epi >= 2 ? ['epi', c.labels.epi] : c.econ >= 2 ? ['econ', c.labels.econ] : null; }
  function yearHook(l, r, log) {
    if (!l.alive) return;
    var c = of(l), s = st(l);
    if (l.age === 0 && !s.noted.birth && (c.level >= 1)) {
      s.noted.birth = 1; var lb = labelOf(c) || ['war', c.labels.war || c.labels.fam || c.labels.epi || c.labels.econ || c.labels.dis];
      log('Bạn chào đời giữa hoàn cảnh khó khăn của thời đại (' + lb[1] + '). ' + (c.fam >= 2 ? 'Lương thực thiếu thốn, mẹ ăn không đủ, bé sinh ra còn yếu.' : c.war >= 2 ? 'Tiếng bom đạn và cảnh chạy loạn là những thứ đầu tiên gia đình bạn nhớ về năm ấy.' : 'Cuộc sống chung của cả vùng đang chật vật.'), 'bad');
      if (c.fam >= 1 || c.war >= 2) { H.fx(l, { hea: -(3 + 2 * Math.max(c.fam, c.war >= 2 ? c.war - 1 : 0)) }); l.flags.lowBirth945 = true; }
      H.mem(l, 'Bạn chào đời năm ' + wy(l) + ' giữa ' + lb[1] + '.', 6);
    }
    if (l.age === 0 && !s.noted.colony && c.colony) { s.noted.colony = 1; log('Bạn chào đời khi đất nước còn là ' + (/^(Anh|Pháp|Hà Lan|Bồ Đào Nha|Tây Ban Nha|Ý|Đức|Bỉ|Nhật Bản|Mỹ)/.test(c.colony) ? 'thuộc địa của ' + c.colony : 'vùng đất thuộc ' + c.colony) + '; trường học, việc làm và quyền đi lại bị giới hạn theo luật của chính quyền cai trị.', 'neutral'); }
    if (!s.noted['res' + (c.restrict || 0)] && c.restrict >= 2 && l.age >= 16) { s.noted['res' + c.restrict] = 1; log(c.restrictLabel + ': ' + (c.restrict >= 3 ? 'ra nước ngoài gần như không thể.' : 'muốn ra nước ngoài phải xin phép và hiếm khi được duyệt.'), 'neutral'); }
    if (c.level >= 2) {
      var lab = labelOf(c), key = lab ? lab[0] + ':' + lab[1] : '';
      if (key && s.last !== key) { s.last = key; if (!(l.age === 0 && s.noted.birth)) log(NOTE[lab[0]] + lab[1] + '. Gia đình bạn phải sống chật vật hơn thường lệ.', 'bad'); }
    } else if (s.last && c.level === 0) { s.last = null; }
    if (l.age >= 1 && c.level >= 1 && customsLog(l, c, log)) { /* đã ghi */ }
    if (deathCheck(l, c, r, log)) return;
    parentLoss(l, c, r, log);
    // nhà trường bị gián đoạn
    if (l.age >= 6 && l.age <= 17 && l.school && (c.war >= 2 || c.fam >= 3 || c.epi >= 3 || c.dis >= 3)) {
      var kk = r2(l, 'school:' + wy(l));
      if (kk < 0.5) { l.st.kno = Math.max(0, l.st.kno - 2); l.st.hap -= 2; if (!s.noted['school' + wy(l)]) { s.noted['school' + wy(l)] = 1; log('Năm ' + wy(l) + ' trường học ' + (c.epi >= 3 ? 'đóng cửa vì dịch bệnh' : c.dis >= 3 ? 'bị phá hủy vì thiên tai' : c.fam >= 3 ? 'vắng học sinh vì đói' : 'thường xuyên đóng cửa vì chiến sự') + '; việc học bị gián đoạn nhiều tháng.', 'bad'); } }
    }
    // khủng hoảng kéo dài: chuyện của thời loạn
    if (c.level >= 1 && l.age >= 3 && !(l.pending || []).some(function (d) { return d.id === 'ctx945_event'; }) && r() < [0, 0.12, 0.3, 0.5][c.level]) {
      var kind = pickKind(l, c, r); if (kind) X.next(l, 'ctx945_event', r, { kind: kind, y: wy(l) }, { manual: false });
    }
    colonyEnd(l, c, log);
    socialTrigger(l, c, r);
  }
  function customsLog(l, c, log) {
    var s = st(l);
    if (l.age === 1 && !s.noted.thoinoi) {
      s.noted.thoinoi = 1; var R = CUSTOMS.thoi_noi;
      if (!customAllowed(l, 'thoi_noi', c)) { log(c.hard >= 2 ? 'Năm bạn tròn một tuổi nhà đang chạy ' + (c.fam >= 2 ? 'đói' : 'loạn') + ', không có lễ thôi nôi hay mâm đồ bốc; chỉ có bát cháo và lời chúc của người thân.' : 'Nhà còn túng thiếu nên không bày mâm bốc đồ khi bạn tròn một tuổi; chỉ có bữa cơm quây quần.', 'neutral'); return true; }
    }
    return false;
  }
  // ---- sự kiện của thời loạn / đói / dịch / khủng hoảng ----
  var EV = {
    shelter: { n: 'Chạy trốn bom đạn', when: function (c) { return c.war >= 2; }, w: 2, t: function (l) { return 'Chiến sự áp sát khu bạn ở. Máy bay và pháo kích có thể tới bất cứ lúc nào; mọi người phải quyết định ở lại hay sơ tán.'; }, o: function (l, c) { return [
      { k: 'hide', l: 'Ở lại, đào hầm trú ẩn gần nhà', h: 'Giữ nhà cửa và việc làm, rủi ro cao', run: function (l, r, log) { if (r() < [0, 0.01, 0.04, 0.09][c.war] * (l.age < 5 ? 1.5 : 1)) { H.kill(l, 'bom đạn trong ' + (c.labels.war || 'chiến sự'), log, false); return; } H.fx(l, { hap: -4, hea: -3 }); log('Bạn ở lại, nhiều đêm phải trốn xuống hầm khi báo động. Nhà cửa vẫn còn nhưng ai cũng thất thần.', 'bad'); } },
      { k: 'flee', l: 'Sơ tán về vùng yên hơn', h: 'Bỏ lại nhà cửa, mất việc, an toàn hơn', run: function (l, r, log) { H.fx(l, { hap: -5 }); H.cash(l, -0.15 * l.base, 'Chi phí sơ tán'); if (E.ERA920 && E.ERA920.HIST) E.ERA920.HIST.open(l, 'displaced', 2); log('Gia đình gói ghém ít đồ và rời nơi ở; những tháng sau sống nhờ họ hàng ở vùng yên hơn.', 'bad'); } },
      { k: 'split', l: 'Gửi trẻ nhỏ về quê, người lớn ở lại làm việc', h: 'Trẻ an toàn hơn nhưng xa cha mẹ', run: function (l, r, log) { if (l.age <= 14) { H.fx(l, { hap: -6, soc: -2 }); log('Bạn bị gửi về nhờ ông bà ở quê; xa bố mẹ cả mùa, nhớ nhà nhưng bớt hiểm nguy.', 'neutral'); } else { H.fx(l, { hap: -3 }); log('Bạn ở lại làm việc cùng người lớn, lo cho cả nhà.', 'neutral'); } } }]; } },
    ration: { n: 'Tem phiếu và thiếu hàng', when: function (c) { return c.war >= 1 || c.econ >= 2; }, w: 1.4, t: function () { return 'Hàng hóa khan hiếm, gạo và dầu phải xếp hàng hoặc mua theo tem phiếu; chợ đen thì giá gấp nhiều lần.'; }, o: function (l, c) { return [
      { k: 'queue', l: 'Xếp hàng theo tem phiếu, chịu đủ thứ thiếu', h: 'Rẻ nhưng mất nhiều thời gian và vẫn không đủ', run: function (l, r, log) { H.fx(l, { hap: -2, hea: -1 }); log('Cả nhà thay phiên xếp hàng từ rạng sáng; có hàng thì mua, hết là về tay không.', 'bad'); } },
      { k: 'black', l: 'Mua ở chợ đen với giá cao', h: 'Đủ ăn nhưng tốn tiền; có thể bị phạt', run: function (l, r, log) { H.cash(l, -0.12 * l.base, 'Mua hàng chợ đen'); if (r() < 0.12) { H.cash(l, -0.08 * l.base, 'Bị phạt buôn bán chợ đen'); log('Mua hàng chợ đen bị kiểm tra và phạt thêm.', 'bad'); } else log('Bạn mua ở chợ đen với giá cắt cổ nhưng bữa cơm gia đình đủ đầy hơn.', 'neutral'); } },
      { k: 'barter', l: 'Đổi đồ đạc lấy gạo, dầu', h: 'Mất tài sản nhỏ, ăn được vài tuần', run: function (l, r, log) { H.cash(l, -0.05 * l.base, 'Đổi đồ lấy lương thực'); H.fx(l, { hap: -1 }); log('Gia đình đổi chiếc đồng hồ, tấm vải lấy mấy yến gạo; qua được mấy tuần khó khăn.', 'neutral'); } }]; } },
    hunger: { n: 'Nạn đói', when: function (c) { return c.fam >= 1; }, w: 2.2, t: function (l, c) { return 'Mùa màng thất bát, giá lương thực tăng vọt; nhà bạn chỉ còn ' + (c.fam >= 3 ? 'vài bữa cháo loãng mỗi ngày' : 'ít gạo dự trữ') + '.'; }, o: function (l, c) { return [
      { k: 'wild', l: 'Đào củ, hái rau rừng, bắt cá để cầm hơi', h: 'Không tốn tiền, dễ ngộ độc, suy kiệt dần', run: function (l, r, log) { H.fx(l, { hea: -4 }); if (r() < 0.06 * c.fam) { H.kill(l, 'ngộ độc thức ăn dại trong ' + (c.labels.fam || 'nạn đói'), log, false); return; } log('Bạn cùng người nhà đào củ, hái rau dại quanh làng; đủ cầm hơi nhưng ai cũng gầy rộc.', 'bad'); } },
      { k: 'sell', l: 'Bán đồ đạc, ruộng vườn lấy lương thực', h: 'Qua cơn đói nhưng mất của cải', run: function (l, r, log) { H.cash(l, -0.2 * l.base, 'Bán của cải lấy lương thực'); H.fx(l, { hea: -2 }); if (E.ERA920 && E.ERA920.HIST) E.ERA920.HIST.open(l, 'hardship', 2); log('Gia đình bán bớt đồ và mảnh vườn để mua gạo; qua được mùa đói nhưng cơ nghiệp mỏng đi.', 'bad'); } },
      { k: 'leave', l: 'Rời quê đi tìm nơi có ăn', h: 'Bỏ nhà cửa, đường xa nguy hiểm', run: function (l, r, log) { H.fx(l, { hap: -4, hea: -3 }); if (E.ERA920 && E.ERA920.HIST) E.ERA920.HIST.open(l, 'displaced', 2); if (r() < 0.05 * c.fam && l.age < 10) { H.kill(l, 'kiệt sức trên đường tìm nơi có ăn', log, false); return; } log('Cả nhà đi bộ nhiều ngày tìm nơi còn lương thực; nhiều người ngã xuống dọc đường, bạn vượt qua được.', 'bad'); } }]; } },
    sickkid: { n: 'Em nhỏ ốm yếu', when: function (c) { return c.fam >= 1 || c.war >= 2 || c.epi >= 2; }, w: 1.2, t: function (l) { return 'Người nhỏ nhất trong nhà ốm yếu vì thiếu ăn và không có thuốc; trạm y tế gần nhất hết thuốc từ lâu.'; }, o: function (l, c) { return [
      { k: 'herb', l: 'Chữa bằng thuốc nam, cháo loãng', h: 'Rẻ, hiệu quả không chắc', run: function (l, r, log) { H.fx(l, { hap: -2 }); log('Bà đun thuốc nam, cả nhà nhường phần cháo đặc cho em; có đỡ nhưng em vẫn yếu.', 'neutral'); } },
      { k: 'doctor', l: 'Tìm thầy thuốc hoặc trạm xá xa · ' + 'tốn kém', h: 'Có cơ hội cứu nhưng tốn tiền và đường xa', run: function (l, r, log) { H.cash(l, -0.1 * l.base, 'Tiền thuốc và đi lại'); H.fx(l, { hap: -1 }); log('Bố mẹ cõng em đi nhiều cây số để xin thuốc; em qua được cơn bệnh.', 'good'); } }]; } },
    school: { n: 'Trường đóng cửa', when: function (c, l) { return l.age >= 6 && l.age <= 17 && (c.war >= 2 || c.epi >= 3 || c.fam >= 2); }, w: 1.2, t: function (l, c) { return 'Trường của bạn ' + (c.epi >= 3 ? 'đóng cửa vì dịch bệnh' : c.war >= 2 ? 'bị đóng hoặc dùng làm nơi trú ẩn' : 'vắng học sinh và hết cả sách vở') + '. Bạn có thể học lớp tạm hoặc nghỉ.'; }, o: function (l, c) { return [
      { k: 'temp', l: 'Học lớp tạm ở nhà dân, hầm trú', h: 'Vẫn học được một ít', run: function (l, r, log) { l.st.kno = Math.min(100, l.st.kno + 1); H.fx(l, { hap: -1 }); log('Bạn học chữ ở lớp tạm dưới hầm / nhà dân, sách vở chuyền tay nhau.', 'neutral'); } },
      { k: 'work', l: 'Nghỉ học đi làm phụ giúp gia đình', h: 'Có thêm tiền, bỏ dở việc học', run: function (l, r, log) { l.st.kno = Math.max(0, l.st.kno - 2); H.cash(l, 0.08 * l.base, 'Tiền làm thêm của con'); H.fx(l, { hap: -2 }); log('Bạn nghỉ học một thời gian đi làm giúp gia đình; chữ nghĩa mai một dần.', 'bad'); } }]; } },
    drafted: { n: 'Lệnh nhập ngũ và tuyển quân', when: function (c, l) { return c.war >= 2 && c.warKind !== 'terror' && l.sex === 'M' && l.age >= 16 && l.age <= 40; }, w: 1.6, t: function () { return 'Đợt tuyển quân đến tận làng. Thanh niên trong độ tuổi bị gọi, người trốn tránh bị truy lùng.'; }, o: function (l, c) { return [
      { k: 'go', l: 'Nhập ngũ theo lệnh', h: 'Được cấp lương thực, đối mặt nguy hiểm', run: function (l, r, log) { H.fx(l, { hap: -3 }); if (r() < [0, 0.02, 0.07, 0.15][c.war]) { H.kill(l, 'tử trận trong ' + (c.labels.war || 'chiến sự'), log, false); return; } if (r() < 0.25) { l.flags.chronic = Math.min(3, (l.flags.chronic || 0) + 1); H.fx(l, { hea: -10 }); log('Bạn nhập ngũ, bị thương trong một trận đánh nhưng sống sót trở về.', 'bad'); } else log('Bạn nhập ngũ, trải qua nhiều tháng khổ cực nhưng bình an.', 'neutral'); if (E.ERA920 && E.ERA920.HIST) E.ERA920.HIST.open(l, 'trauma', 2); } },
      { k: 'hide', l: 'Trốn lính, ẩn náu', h: 'Tránh được ra trận, bị truy lùng và liên lụy gia đình', run: function (l, r, log) { H.fx(l, { hap: -4, soc: -3 }); if (r() < 0.35) { H.cash(l, -0.15 * l.base, 'Bị phạt vì trốn lính'); log('Bạn bị phát hiện và gia đình phải đóng phạt; bạn bị bắt nhập ngũ muộn hơn.', 'bad'); } else log('Bạn trốn được qua đợt tuyển quân, sống thấp thỏm nhiều tháng.', 'neutral'); } },
      { k: 'leave', l: 'Rời nước tránh quân dịch · ' + 'tốn kém', h: 'Chi phí cao, bỏ lại tất cả', run: function (l, r, log) { H.cash(l, -0.4 * l.base, 'Chi phí rời nước'); H.fx(l, { hap: -5 }); if (E.ERA920 && E.ERA920.HIST) E.ERA920.HIST.open(l, 'displaced', 2); log('Gia đình gom tiền cho bạn đi tránh quân dịch; bạn phải bắt đầu lại ở nơi xa.', 'bad'); } }]; } },
    jobloss: { n: 'Mất việc, vật giá leo thang', when: function (c, l) { return c.econ >= 2 && l.age >= 16; }, w: 1.6, t: function (l, c) { return (c.econKind === 'hyp' ? 'Vật giá tăng từng ngày, lương không đuổi kịp.' : 'Cơ sở làm việc cắt giảm nhân sự và hàng loạt người mất việc.') + ' Bạn phải quyết định xoay xở ra sao.'; }, o: function (l, c) { return [
      { k: 'hold', l: 'Giữ việc, chịu giảm lương', h: 'Ổn định tương đối, thu nhập co lại', run: function (l, r, log) { H.cash(l, -0.06 * l.base, 'Thu nhập co lại vì khủng hoảng'); H.fx(l, { hap: -2 }); log('Bạn giữ được việc nhưng lương thực tế giảm; mọi khoản chi phải thắt lại.', 'neutral'); } },
      { k: 'side', l: 'Làm thêm nghề phụ, buôn bán nhỏ', h: 'Có thêm thu nhập, rất vất vả', run: function (l, r, log) { H.cash(l, 0.05 * l.base, 'Nghề phụ trong khủng hoảng'); H.fx(l, { hea: -2, hap: -1 }); log('Bạn chạy thêm nghề phụ buổi tối và cuối tuần; tiền vào ít nhưng đều.', 'neutral'); } },
      { k: 'move', l: 'Đi nơi khác tìm việc', h: 'Có thể khá hơn, tốn chi phí', run: function (l, r, log) { H.cash(l, -0.1 * l.base, 'Chi phí đi tìm việc'); if (r() < 0.55) { H.fx(l, { hap: 2 }); log('Bạn tìm được việc ở nơi khác, đỡ hơn trước.', 'good'); } else { H.fx(l, { hap: -3 }); log('Đi xa tốn kém nhưng không tìm được việc tốt hơn.', 'bad'); } } }]; } },
    epidemic: { n: 'Dịch bệnh', when: function (c) { return c.epi >= 2; }, w: 1.6, t: function (l, c) { return (c.labels.epi || 'Dịch bệnh') + ' lan trong vùng; người ốm và người chết ngày một nhiều.'; }, o: function (l, c) { return [
      { k: 'isolate', l: 'Đóng cửa tránh tiếp xúc', h: 'Giảm lây bệnh, mất thu nhập', run: function (l, r, log) { H.cash(l, -0.06 * l.base, 'Nghỉ làm vì dịch'); if (r() < [0, 0.01, 0.025, 0.06][c.epi] * 0.5) { H.kill(l, 'nhiễm bệnh trong ' + c.labels.epi, log, false); return; } log('Cả nhà ở trong nhà nhiều tuần, đủ ăn dè sẻn; không ai ốm nặng.', 'neutral'); } },
      { k: 'carry', l: 'Vẫn đi làm, đi chợ như thường', h: 'Giữ thu nhập, nguy cơ nhiễm bệnh cao', run: function (l, r, log) { if (r() < [0, 0.03, 0.07, 0.14][c.epi]) { H.fx(l, { hea: -14 }); if (r() < 0.25 * c.epi / 3) { H.kill(l, 'nhiễm bệnh trong ' + c.labels.epi, log, false); return; } log('Bạn nhiễm bệnh và ốm nặng nhiều tuần, may qua khỏi.', 'bad'); } else log('Bạn vẫn đi làm và may mắn không nhiễm bệnh.', 'good'); } }]; } },
    rebuild: { n: 'Sau thiên tai', when: function (c) { return c.dis >= 2; }, w: 1.3, t: function (l, c) { return (c.labels.dis || 'Thiên tai') + ' đã phá nhiều nhà cửa. Gia đình bạn phải quyết định xây lại thế nào.'; }, o: function (l, c) { return [
      { k: 'stay', l: 'Dựng lại nhà tại chỗ', h: 'Tốn công sức và tiền, giữ được nơi ở', run: function (l, r, log) { H.cash(l, -0.25 * l.base, 'Dựng lại nhà sau thiên tai'); H.fx(l, { hap: -2 }); log('Cả xóm cùng dựng lại nhà; gia đình bạn mất khá nhiều tiền và công sức.', 'neutral'); } },
      { k: 'aid', l: 'Nhờ cứu trợ và họ hàng, ở tạm', h: 'Ít tốn kém, cuộc sống tạm bợ', run: function (l, r, log) { H.fx(l, { hap: -3 }); if (E.ERA920 && E.ERA920.HIST) E.ERA920.HIST.open(l, 'hardship', 2); log('Gia đình sống tạm ở nơi cứu trợ và nhờ họ hàng một thời gian dài.', 'bad'); } },
      { k: 'move', l: 'Chuyển đi nơi khác', h: 'Bỏ lại tất cả', run: function (l, r, log) { H.cash(l, -0.12 * l.base, 'Chi phí chuyển đi'); if (E.ERA920 && E.ERA920.HIST) E.ERA920.HIST.open(l, 'displaced', 2); log('Gia đình rời nơi bị tàn phá để bắt đầu lại ở chỗ khác.', 'bad'); } }]; } },
    informer: { n: 'Bị theo dõi, tố giác', when: function (c) { return c.war >= 2 && c.warKind === 'terror'; }, w: 1.4, t: function () { return 'Người ta bắt đầu thì thầm về việc tố giác nhau; một lời nói bất cẩn cũng có thể gây họa cho cả nhà.'; }, o: function (l, c) { return [
      { k: 'quiet', l: 'Im lặng, sống kín tiếng', h: 'An toàn tương đối, nặng nề tinh thần', run: function (l, r, log) { H.fx(l, { hap: -3, soc: -2 }); log('Cả nhà sống thận trọng, không nói chuyện với ai về chuyện chung; ai cũng nơm nớp.', 'bad'); } },
      { k: 'flee', l: 'Tìm cách rời đi', h: 'Rủi ro cao, bỏ lại tất cả', run: function (l, r, log) { H.cash(l, -0.3 * l.base, 'Chi phí rời đi'); H.fx(l, { hap: -4 }); if (E.ERA920 && E.ERA920.HIST) E.ERA920.HIST.open(l, 'displaced', 3); log('Gia đình bỏ lại nhà cửa và lên đường trong đêm.', 'bad'); } }]; } }
  };

  // ---- 9.5.1: thời thuộc địa, ruộng đất, chiến dịch chính trị, di dời, lạm phát: sự kiện có nhiều bước và để lại dấu ấn ----
  function cls(l) { var q = (l.fam && l.fam.q) || 3; return q >= 4 ? 'propertied' : q <= 2 ? 'poor' : 'middle'; }
  function clsText(l) { var k = cls(l); return k === 'propertied' ? 'gia đình có của cải đáng kể' : k === 'poor' ? 'gia đình ít ruộng, ít của' : 'gia đình vừa đủ sống'; }
  var EXILE = { VN: ['US', 'AU', 'CA', 'FR'], IN: ['PK'], PK: ['IN'], BD: ['IN'], PL: ['DE'], CZ: ['DE'], DE: ['US', 'GB'], GR: ['TR'], TR: ['GR'], DZ: ['FR'], UG: ['GB'], BA: ['DE', 'AT', 'SE'], HR: ['DE', 'AT'], RW: ['TZ', 'BE'], SY: ['DE', 'TR', 'SE', 'LB'], UA: ['PL', 'DE', 'CZ'], AF: ['PK', 'IR', 'DE'], MM: ['BD'], CY: ['GB'], PS: ['JO', 'LB'], IL: ['US', 'FR'], KH: ['FR', 'US'], CN: ['US', 'HK'], SU: ['US', 'DE'], CU: ['US'], KP: ['KR'], ET: ['US', 'SD'], AR: ['ES', 'MX'], CL: ['AR', 'SE'], ID: ['NL'], TW: ['US'], PH: ['US'], ES: ['FR', 'MX'], RO: ['DE', 'US'], AL: ['IT'], IQ: ['SE', 'JO'], IR: ['US', 'GB', 'DE'], UG2: [] };
  function exile(l, r) {
    var cc = resCc(l), list = (EXILE[cc] || ['US', 'GB', 'DE', 'FR']).filter(function (c) { return G.W.BY[c] && c !== cc; }); if (!list.length || !H.emigrate) return false;
    var c = list[Math.floor(r() * list.length)], B = G.W.BY[c]; H.emigrate(l, [c, B.name, B.pool], r, function (t, k) { l.log.push({ a: l.age, y: wy(l), t: t, k: k || 'neutral' }); });
    l.flags.refugee945 = { to: c, y: wy(l) }; if (E.ERA920 && E.ERA920.HIST) E.ERA920.HIST.open(l, 'displaced', 2); return true;
  }
  function jailRisk(l, p, years, why, r, log) { if (r() < p && H.jail) { H.jail(l, years, why, log); return true; } return false; }
  function prom(l) { return (l.edu >= 5 ? 1 : 0) + (l.fam && l.fam.q >= 4 ? 1 : 0) + ((l.fame || 0) > 1e5 ? 1 : 0); }
  Object.assign(EV, {
    col_tax: { n: 'Thuế và sưu dưới chế độ thuộc địa', soc: true, when: function () { return false; }, w: 0, t: function (l, c) { return 'Chính quyền thuộc địa (' + (c.colony || 'chính quốc') + ') thu thuế đầu người, thuế muối rượu và bắt đi làm công ích; ' + clsText(l) + ', hạn nộp đã tới.'; }, o: function (l, c) { return [
      { k: 'pay', l: 'Nộp đủ thuế, thắt lưng buộc bụng', h: 'Tốn tiền, yên thân', run: function (l, r, log) { H.cash(l, -0.08 * l.base, 'Thuế thuộc địa'); H.fx(l, { hap: -2 }); log('Cả nhà dành phần lớn mùa thu hoạch để nộp thuế; năm đó ăn uống tằn tiện.', 'bad'); } },
      { k: 'labor', l: 'Đi làm phu thay tiền thuế', h: 'Không tốn tiền nhưng mất sức và thời gian', run: function (l, r, log) { H.fx(l, { hea: -4, hap: -3 }); if (l.age >= 16 && r() < 0.03) { H.kill(l, 'kiệt sức khi làm phu đường dưới thời thuộc địa', log, false); return; } log('Bạn đi làm phu đường nhiều tuần liền, sức khỏe hao mòn nhưng nhà không phải nộp tiền.', 'bad'); } },
      { k: 'evade', l: 'Khai thiếu, tìm cách né thuế', h: 'Giữ được tiền, có thể bị phạt hoặc bắt giam', run: function (l, r, log) { if (r() < 0.35) { H.cash(l, -0.15 * l.base, 'Bị phạt vì trốn thuế'); if (!jailRisk(l, 0.25, 1, 'trốn thuế', r, log)) log('Bạn bị lý trưởng phát hiện khai gian và bị phạt nặng.', 'bad'); } else { H.cash(l, 0.03 * l.base, 'Né được thuế'); log('Nhờ nhà ở xa và biết cách khai báo, gia đình né được phần thuế năm nay.', 'neutral'); } } },
      { k: 'move', l: 'Rời làng ra thành phố hoặc đồn điền kiếm sống', h: 'Bỏ ruộng vườn, có thể có việc làm công', run: function (l, r, log) { H.cash(l, -0.05 * l.base, 'Chi phí rời làng'); H.fx(l, { hap: -3 }); if (E.ERA920 && E.ERA920.HIST) E.ERA920.HIST.open(l, 'displaced', 1); log('Gia đình rời làng ra nơi có việc làm công ở thành phố / đồn điền; cuộc sống bấp bênh nhưng tránh được thuế đầu người ở quê.', 'neutral'); } }]; } },
    col_exam: { n: 'Kỳ thi vào trường thuộc địa', soc: true, when: function () { return false; }, w: 0, t: function (l, c) { return 'Trường dạy chữ của chính quyền thuộc địa (' + (c.colony || '') + ') chỉ nhận số ít học sinh; ' + clsText(l) + ', thầy đồ làng khuyên bạn thử thi.'; }, o: function (l, c) { return [
      { k: 'try', l: 'Dốc sức ôn thi vào trường', h: 'Cần học lực; đỗ thì mở đường làm thông ngôn, thư ký, thầy giáo', run: function (l, r, log) { var q = (l.fam && l.fam.q) || 3, p = Math.max(0.05, Math.min(0.9, 0.1 + (l.st.kno - 40) / 80 + (q - 3) * 0.06)); if (r() < p) { l.st.kno = Math.min(100, l.st.kno + 4); l.flags.colSchool945 = true; H.fx(l, { hap: 6, soc: 2 }); l.edu = Math.max(l.edu, 1); log('Bạn đỗ vào trường của chính quyền thuộc địa; được học chữ quốc ngữ và tiếng chính quốc, cả làng đến chúc mừng.', 'good'); H.mem(l, 'Ngày đọc tên mình trong danh sách đỗ vào trường thuộc địa.', 6); } else { H.fx(l, { hap: -3 }); log('Bạn trượt kỳ thi vì số chỗ quá ít; năm sau có thể thử lại hoặc ở nhà giúp việc.', 'neutral'); } } },
      { k: 'village', l: 'Học thầy đồ làng, giữ chữ nho', h: 'Rẻ, kiến thức vững nhưng khó vào công chức', run: function (l, r, log) { l.st.kno = Math.min(100, l.st.kno + 2); log('Bạn tiếp tục học chữ với thầy đồ làng; vốn chữ nghĩa vững nhưng cửa vào công chức thuộc địa hẹp.', 'neutral'); } },
      { k: 'work', l: 'Ở nhà phụ việc đồng áng', h: 'Có thêm tay làm, không đi học', run: function (l, r, log) { H.cash(l, 0.03 * l.base, 'Phụ việc đồng áng'); log('Bạn ở nhà giúp bố mẹ; ruộng nương không đợi ai.', 'neutral'); } }]; } },
    col_levy: { n: 'Tuyển lính và phu cho chính quốc', soc: true, when: function () { return false; }, w: 0, t: function (l, c) { return 'Chính quyền thuộc địa tuyển thanh niên làm lính, lính thợ và phu đưa sang tham chiến hoặc làm hậu cần cho ' + (c.colony || 'chính quốc') + '.'; }, o: function (l, c) { return [
      { k: 'go', l: 'Ghi tên nhập ngũ, theo đoàn đi xa', h: 'Có lương, đi nhiều năm, rủi ro tử trận hoặc bệnh', run: function (l, r, log) { l.flags.military = Math.max(l.flags.military || 0, l.age + 3); H.fx(l, { hap: -3 }); H.cash(l, 0.05 * l.base, 'Tiền ứng khi nhập ngũ'); if (r() < 0.1) { H.kill(l, 'tử trận hoặc bệnh khi phục vụ chính quốc', log, false); return; } l.flags.veteran945 = true; log('Bạn lên tàu đi xa ba năm làm lính / lính thợ cho chính quốc; thư nhà hiếm, bệnh tật và khí hậu lạ làm nhiều người gục ngã.', 'big'); H.mem(l, 'Con tàu rời bến, bạn đứng ở boong nhìn bờ quê khuất dần.', 8); } },
      { k: 'hide', l: 'Trốn vào rừng, nhờ làng che giấu', h: 'Tránh đi xa, bị truy tìm và liên lụy gia đình', run: function (l, r, log) { H.fx(l, { hap: -4, soc: -2 }); if (r() < 0.4) { H.cash(l, -0.1 * l.base, 'Bị phạt vì trốn tuyển'); jailRisk(l, 0.3, 1, 'trốn tuyển lính', r, log); log('Bạn bị lính tuần lùng ra, gia đình phải chịu phạt.', 'bad'); } else log('Bạn lánh trong rừng nhiều tháng, nhờ làng che chở mà qua được đợt tuyển.', 'neutral'); } },
      { k: 'bribe', l: 'Đút lót lý trưởng xin hoãn · tốn kém', h: 'Mất tiền, có thể thoát', run: function (l, r, log) { var cost = 0.25 * l.base; if (l.money < cost) { H.fx(l, { hap: -3 }); log('Không đủ tiền chạy chọt; tên bạn vẫn nằm trong danh sách.', 'bad'); return; } H.cash(l, -cost, 'Hối lộ để hoãn tuyển'); log('Món tiền lớn đủ để tên bạn được gạch khỏi danh sách năm nay.', 'neutral'); } }]; } },
    col_movement: { n: 'Phong trào đòi độc lập', soc: true, when: function () { return false; }, w: 0, t: function (l, c) { return 'Phong trào chống ách ' + (c.colony || 'thuộc địa') + ' lan tới vùng bạn sống: truyền đơn, họp kín, những vụ bắt bớ; ai cũng phải chọn một thái độ.'; }, o: function (l, c) { return [
      { k: 'join', l: 'Tham gia hoạt động, đi theo phong trào', h: 'Có thể được trọng dụng sau độc lập; rủi ro bị bắt hoặc chết', run: function (l, r, log) { l.flags.indep945 = 'fighter'; H.fx(l, { soc: 3, hap: -2 }); if (r() < [0, 0.04, 0.1, 0.18][Math.max(1, Math.min(3, c.war || 1))]) { H.kill(l, 'bị bắt và hy sinh trong phong trào đòi độc lập', log, false); return; } if (!jailRisk(l, 0.3, 2, 'hoạt động chống chính quyền thuộc địa', r, log)) log('Bạn đi theo phong trào, làm liên lạc và tải lương; mỗi ngày đều có thể bị bắt.', 'big'); } },
      { k: 'support', l: 'Âm thầm giúp đỡ: cơm gạo, chỗ ở, tin tức', h: 'Giữ được gia đình, rủi ro vừa', run: function (l, r, log) { l.flags.indep945 = l.flags.indep945 || 'supporter'; H.fx(l, { soc: 1, hap: -1 }); H.cash(l, -0.04 * l.base, 'Giúp đỡ phong trào'); if (r() < 0.12) { H.cash(l, -0.1 * l.base, 'Bị lục soát và tịch thu'); log('Nhà bạn bị lính lục soát vì nghi chứa chấp; mất một phần của cải.', 'bad'); } else log('Cả nhà lặng lẽ chia sẻ gạo và chỗ ngủ, giữ kín chuyện.', 'neutral'); } },
      { k: 'stay', l: 'Giữ im lặng, lo việc nhà', h: 'An toàn tương đối, không ai cảm kích', run: function (l, r, log) { H.fx(l, { hap: -1 }); log('Bạn không dính vào chuyện chính trị, lo sinh kế; người này nghĩ bạn khôn, người kia nghĩ bạn nhát.', 'neutral'); } },
      { k: 'inform', l: 'Báo cho chính quyền biết · nặng nề lương tâm', h: 'Được thưởng và bảo vệ, nhưng bị làng khinh', run: function (l, r, log) { l.flags.indep945 = 'informer'; H.cash(l, 0.1 * l.base, 'Tiền thưởng báo tin'); H.fx(l, { soc: -8, hap: -6 }); log('Bạn khai báo cho sở mật thám; bạn được thưởng, nhưng hàng xóm từ đó tránh mặt gia đình bạn.', 'bad'); } }]; } },
    land: { n: 'Cải cách ruộng đất, tập thể hóa, quốc hữu hóa', soc: true, when: function () { return false; }, w: 0, t: function (l, c) { return (c.soc.land ? c.soc.land.n : 'Chính sách ruộng đất mới') + ': tài sản được kê khai và phân loại lại; ' + clsText(l) + '.'; }, o: function (l, c) { var k = cls(l); return [
      { k: 'comply', l: k === 'poor' ? 'Nhận phần ruộng, phần nhà được chia' : 'Khai đúng và giao nộp theo quy định', h: k === 'poor' ? 'Có thêm tư liệu sản xuất' : 'Mất phần tài sản vượt mức quy định', run: function (l, r, log) { if (k === 'poor') { H.cash(l, 0.15 * l.base, 'Được chia ruộng vườn'); H.fx(l, { hap: 4 }); log('Gia đình bạn được chia một mảnh ruộng; lần đầu có đất riêng để cấy.', 'good'); } else if (k === 'middle') { H.cash(l, -0.1 * l.base, 'Giao nộp theo quy định'); H.fx(l, { hap: -2 }); log('Gia đình bị xếp vào diện phải giao nộp một phần ruộng và nông cụ.', 'bad'); } else { H.cash(l, -0.35 * l.base, 'Tịch thu và giao nộp tài sản'); H.fx(l, { hap: -6, soc: -3 }); if (E.ERA920 && E.ERA920.HIST) E.ERA920.HIST.open(l, 'hardship', 2); log('Phần lớn ruộng đất, nhà cửa của gia đình bị tịch thu hoặc giao nộp; cả nhà phải dọn ra ở nhờ.', 'bad'); } } },
      { k: 'hide', l: 'Giấu bớt của cải, khai nhỏ lại', h: 'Giữ được ít nhiều, nếu bị phát hiện bị xử nặng', run: function (l, r, log) { if (r() < 0.4) { H.cash(l, -0.3 * l.base, 'Bị phạt vì khai gian'); H.fx(l, { hap: -6, soc: -4 }); jailRisk(l, 0.35, 2, 'khai gian tài sản', r, log); log('Việc giấu của bị tố giác; gia đình bị phạt nặng và mang tiếng.', 'bad'); } else { H.cash(l, -0.08 * l.base, 'Giao nộp một phần'); log('Gia đình giấu được phần cốt lõi và chỉ nộp một phần; sống trong lo âu.', 'neutral'); } } },
      { k: 'join', l: 'Tham gia ban hay đội thi hành', h: 'Có chỗ đứng, gánh nặng lương tâm', run: function (l, r, log) { H.cash(l, 0.05 * l.base, 'Phụ cấp tham gia thi hành'); H.fx(l, { soc: 3, hap: -3 }); l.flags.landBoard945 = true; log('Bạn nhận việc trong ban thi hành; có chỗ đứng trong bộ máy, nhưng phải tận mắt chứng kiến nhiều cảnh nặng nề.', 'neutral'); } },
      { k: 'leave', l: 'Bỏ đi nơi khác, tìm đường ra nước ngoài · tốn kém', h: 'Bỏ lại tất cả', run: function (l, r, log) { H.cash(l, -0.3 * l.base, 'Chi phí bỏ đi'); H.fx(l, { hap: -5 }); if (!(E.CTX945.emigAllowed(l) && exile(l, r))) { if (E.ERA920 && E.ERA920.HIST) E.ERA920.HIST.open(l, 'displaced', 2); log('Gia đình bỏ làng đi nơi khác sống ẩn danh.', 'bad'); } } }]; } },
    purge: { n: 'Chiến dịch chính trị và tố giác', soc: true, when: function () { return false; }, w: 0, t: function (l, c) { return (c.soc.purge ? c.soc.purge.n : 'Một chiến dịch chính trị') + ' lan tới nơi bạn sống: kiểm điểm, đấu tố, bắt bớ; một câu nói hay một lý lịch cũng có thể thành tội.'; }, o: function (l, c) { return [
      { k: 'selfcrit', l: 'Làm bản kiểm điểm, theo đúng yêu cầu', h: 'An toàn tương đối, mất thể diện', run: function (l, r, log) { H.fx(l, { hap: -4, soc: -2 }); if (r() < 0.08 * Math.min(3, prom(l) + 1)) { jailRisk(l, 1, 1, 'bị quy vào diện nghi vấn', r, log); return; } log('Bạn viết bản kiểm điểm theo mẫu, đứng trước cuộc họp cho tới khi được cho qua.', 'bad'); } },
      { k: 'denounce', l: 'Tố giác người khác để tự bảo vệ · nặng nề lương tâm', h: 'Thoát nạn, mất bạn bè, day dứt', run: function (l, r, log) { l.flags.denounced945 = true; H.fx(l, { hap: -8, soc: -10 }); l.karma = (l.karma || 0) - 6; log('Bạn khai tên một người quen để tự cứu mình; nhiều năm sau bạn vẫn nhớ ánh mắt người ấy.', 'bad'); H.mem(l, 'Cái tên bạn đã nói trong buổi họp năm ấy.', 8); } },
      { k: 'resist', l: 'Từ chối kiểm điểm, giữ quan điểm', h: 'Giữ được lương tâm, rủi ro bị bắt nặng', run: function (l, r, log) { H.fx(l, { hap: -3, soc: 1 }); if (!jailRisk(l, 0.35 + 0.1 * c.purge, 3, 'chống chiến dịch chính trị', r, log)) { H.cash(l, -0.1 * l.base, 'Bị điều tra, tước phụ cấp'); log('Bạn từ chối kiểm điểm; công việc bị đình chỉ nhưng chưa bị bắt.', 'bad'); } } },
      { k: 'leave', l: 'Rời nơi ở, tìm cách ra nước ngoài · tốn kém', h: 'Bỏ lại tất cả', run: function (l, r, log) { H.cash(l, -0.3 * l.base, 'Chi phí rời đi'); H.fx(l, { hap: -4 }); if (!(E.CTX945.emigAllowed(l) && r() < 0.6 && exile(l, r))) { if (E.ERA920 && E.ERA920.HIST) E.ERA920.HIST.open(l, 'displaced', 2); H.fx(l, { hap: -2 }); log('Bạn bỏ đi về vùng khác, sống kín tiếng; chưa tìm được đường ra nước ngoài.', 'bad'); } } }]; } },
    expel: { n: 'Di dời và trục xuất', soc: true, when: function () { return false; }, w: 0, t: function (l, c) { return (c.soc.expel ? c.soc.expel.n : 'Một cuộc di dời lớn') + ': nhiều gia đình trong vùng phải rời nơi ở với rất ít thời gian chuẩn bị.'; }, o: function (l, c) { return [
      { k: 'go', l: 'Lên đường cùng đoàn người', h: 'Mang theo ít đồ, đường dài nguy hiểm', run: function (l, r, log) { H.fx(l, { hap: -6, hea: -3 }); H.cash(l, -0.2 * l.base, 'Mất nhà cửa khi di dời'); if (E.ERA920 && E.ERA920.HIST) E.ERA920.HIST.open(l, 'displaced', 3); if (r() < [0, 0.01, 0.03, 0.06][c.expel] * (l.age < 5 || l.age > 60 ? 2 : 1)) { H.kill(l, 'kiệt sức hoặc bạo lực trên đường di dời', log, false); return; } log('Gia đình bạn gom ít đồ đạc và đi cùng đoàn người rời quê; nhiều người không tới được nơi ở mới.', 'bad'); } },
      { k: 'cross', l: 'Tìm đường sang nước khác xin cư trú · tốn kém', h: 'Có thể được nhận, có thể bị từ chối', run: function (l, r, log) { H.cash(l, -0.25 * l.base, 'Chi phí đường đi'); if (E.CTX945.emigAllowed(l) && exile(l, r)) { H.fx(l, { hap: -4 }); log('Sau nhiều tháng chờ đợi giấy tờ ở trại và biên giới, gia đình được nhận cư trú ở nước mới; tình trạng ban đầu rất bấp bênh.', 'big'); } else { H.fx(l, { hap: -5 }); if (E.ERA920 && E.ERA920.HIST) E.ERA920.HIST.open(l, 'displaced', 2); log('Gia đình bị chặn ở biên giới và quay lại sống tạm ở vùng khác.', 'bad'); } } },
      { k: 'hide', l: 'Ở lại, nhờ người quen che giấu', h: 'Giữ nhà nếu may, rủi ro rất cao', run: function (l, r, log) { if (r() < [0, 0.04, 0.12, 0.25][c.expel]) { H.kill(l, 'bị phát hiện khi ở lại giữa cuộc di dời', log, false); return; } H.fx(l, { hap: -5, soc: -2 }); log('Gia đình bạn tìm được nơi ẩn ở nhà một người quen, sống nhiều tháng không dám ra ngoài.', 'bad'); } }]; } },
    hyp_savings: { n: 'Tiền mất giá, tiền tiết kiệm tan biến', soc: true, when: function () { return false; }, w: 0, t: function (l, c) { return 'Đồng tiền mất giá từng ngày' + (c.labels.econ ? ' (' + c.labels.econ + ')' : '') + '; tiền tiết kiệm đang bốc hơi nhanh hơn lương tăng.'; }, o: function (l, c) { return [
      { k: 'gold', l: 'Đổi tiền ra vàng, hàng hóa', h: 'Giữ được phần lớn giá trị, khó đổi lại', run: function (l, r, log) { var m = Math.max(0, l.money); H.cash(l, -0.12 * m, 'Hao hụt khi đổi tiền ra vàng và hàng'); log('Bạn kịp đổi phần lớn tiền ra vàng và hàng hóa trước khi giá nhảy tiếp.', 'neutral'); } },
      { k: 'dollar', l: 'Mua ngoại tệ, gửi qua người quen', h: 'Giữ giá trị khá tốt, có rủi ro pháp lý', run: function (l, r, log) { var m = Math.max(0, l.money); H.cash(l, -0.18 * m, 'Chênh lệch khi đổi ngoại tệ'); if (r() < 0.1) { H.cash(l, -0.1 * m, 'Bị tịch thu ngoại tệ'); log('Một phần ngoại tệ bị tịch thu khi kiểm tra.', 'bad'); } else log('Bạn đổi một phần tiền sang ngoại tệ thông qua người quen.', 'neutral'); } },
      { k: 'hold', l: 'Giữ tiền mặt, tin là sẽ ổn lại', h: 'Mất phần lớn giá trị', run: function (l, r, log) { var m = Math.max(0, l.money); H.cash(l, -(0.5 + 0.1 * c.econ) * m, 'Tiền mất giá'); H.fx(l, { hap: -5 }); log('Tiền để trong nhà mất gần hết sức mua chỉ sau vài tháng; nhiều năm tiết kiệm tan thành không.', 'bad'); } },
      { k: 'spend', l: 'Tiêu và trữ lương thực ngay', h: 'Không mất giá trị nhưng cạn tiền mặt', run: function (l, r, log) { var m = Math.max(0, l.money); H.cash(l, -0.6 * m, 'Mua trữ hàng thiết yếu'); H.fx(l, { hap: 1 }); log('Bạn dùng tiền mua gạo, dầu và vật dụng thiết yếu trữ cho cả năm; tiền mặt cạn nhưng nhà đủ ăn.', 'neutral'); } }]; } }
  });
  function socialKinds(l, c) {
    var s = st(l), y = wy(l), out = [];
    function once(k, tag, yrs) { var key = k + ':' + tag, last = s.noted[key]; if (last != null && y - last < (yrs || 99)) return false; return true; }
    function mark(k, tag) { s.noted[k + ':' + tag] = y; }
    var male = l.sex === 'M';
    if (c.colony && !c.soc.colony) {
      if (l.age >= 16 && l.age <= 60 && once('col_tax', 'a', 2) && r2(l, 'ctax:' + y) < 0.25) out.push(['col_tax', 'a', 0.9]);
      if (l.age >= 10 && l.age <= 15 && once('col_exam', 'a', 99) && r2(l, 'cexam:' + y) < 0.5) out.push(['col_exam', 'a', 1]);
      var world = (y >= 1914 && y <= 1918) || (y >= 1939 && y <= 1945);
      if (male && l.age >= 17 && l.age <= 45 && (world || c.war >= 2) && once('col_levy', 'a', 4) && r2(l, 'clev:' + y) < 0.3) out.push(['col_levy', 'a', 1]);
      if (l.age >= 16 && c.war >= 1 && once('col_movement', 'a', 3) && r2(l, 'cmov:' + y) < 0.3) out.push(['col_movement', 'a', 1]);
    }
    ['land', 'purge', 'expel'].forEach(function (k) {
      var sc = c.soc && c.soc[k]; if (!sc || l.age < (k === 'expel' ? 0 : 14)) return;
      var tag = sc.n; if (!once(k, tag, k === 'purge' ? 3 : 99)) return;
      var share = sc.share * (k === 'purge' ? 0.6 + 0.2 * prom(l) : 1); if (r2(l, 'expo:' + k + ':' + tag) >= Math.min(0.95, share)) return;
      if (r2(l, 'pick:' + k + ':' + y) < (k === 'expel' ? 0.7 : 0.45)) out.push([k, tag, 1]);
    });
    if (c.econ >= 3 && c.econKind === 'hyp' && l.age >= 18 && l.money > l.base * 0.3 && once('hyp_savings', c.labels.econ || 'h', 99) && r2(l, 'hyp:' + y) < 0.6) out.push(['hyp_savings', c.labels.econ || 'h', 1]);
    return out;
  }
  function socialTrigger(l, c, r) {
    if ((l.pending || []).some(function (d) { return d.id === 'ctx945_event'; })) return;
    var ks = socialKinds(l, c); if (!ks.length) return;
    var pick = ks[Math.floor(r() * ks.length)], s = st(l); s.noted[pick[0] + ':' + pick[1]] = wy(l);
    X.next(l, 'ctx945_event', r, { kind: pick[0], y: wy(l) }, { manual: false });
  }
  // Hết thời thuộc địa: dấu ấn của những lựa chọn trước đó
  function colonyEnd(l, c, log) {
    var s = st(l), y = wy(l); if (s.noted.colEnd || c.colony) return;
    var prev = at(resCc(l), y - 1); if (!prev.colony) return; s.noted.colEnd = y;
    var f = l.flags.indep945;
    log('Năm ' + y + ' đất nước chấm dứt ách ' + prev.colony + '. ' + (f === 'fighter' ? 'Những năm hoạt động của bạn được ghi nhận; bạn có chỗ đứng trong chính quyền mới.' : f === 'informer' ? 'Việc bạn từng báo tin cho chính quyền cũ bị nhắc lại; bạn bị xa lánh.' : f === 'supporter' ? 'Cả xóm biết nhà bạn từng giúp đỡ phong trào; bạn được trọng nể.' : 'Bạn vừa mừng vừa lo vì mọi thứ sắp thay đổi.'), f === 'informer' ? 'bad' : 'big');
    if (f === 'fighter') { H.fx(l, { soc: 6, hap: 4 }); l.flags.statusHero945 = true; } else if (f === 'informer') { H.fx(l, { soc: -8, hap: -4 }); } else if (f === 'supporter') H.fx(l, { soc: 3 });
    if (l.flags.colSchool945 && l.age >= 18) { H.fx(l, { soc: 2 }); log('Vốn chữ và tiếng chính quốc của bạn được cần đến khi cơ quan mới thiếu người biết chữ.', 'good'); }
  }
  function kindsFor(l, c) { return Object.keys(EV).filter(function (k) { return EV[k].when(c, l); }); }
  function pickKind(l, c, r) { var ks = kindsFor(l, c); if (!ks.length) return null; return U.wpick(r, ks, function (k) { return EV[k].w; }); }
  X.menu('ctx945_event', 'Việc của thời buổi khó khăn', function (l) { return X.reason(l, 3); }, function (l, d) { var a = d && d.arg || {}, c = of(l), e = EV[a.kind]; return e ? e.n + '. ' + e.t(l, c) + ' Hoàn cảnh chung: ' + (labelOf(c) ? labelOf(c)[1] : 'thời kỳ khó khăn') + '.' : 'Chuyện này không còn hiệu lực.'; }, function (l, arg) { var e = EV[arg && arg.kind], c = of(l); return e ? e.o(l, c).map(function (o) { return Object.assign({ why: true }, o); }) : []; }, 3);
  E.HOOKS.year.push(yearHook);
  // ------------------------------------------------------------------
  // 6. Bảng tra cứu và thử nghiệm
  // ------------------------------------------------------------------
  E.CTX945 = { socialKinds: socialKinds, exile: exile, cls: cls, derive: derive, zoneRows: zoneRows, ZONEX: ZONEX, SOCX: SOCX, emigAllowed: emigAllowed, EMIG: EMIG, colonyAt: colonyAt, of: of, at: at, pov: pov, hazard: hazard, eventK: eventK, customAllowed: customAllowed, CUSTOMS: CUSTOMS, EV: EV, incomeK: incomeK, foodK: foodK, IDX: IDX, GLOBAL: GLOBAL, labelOf: labelOf, kindsFor: kindsFor, schoolOptionOk: schoolOptionOk, DATA: D };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));

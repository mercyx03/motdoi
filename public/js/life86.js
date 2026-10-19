/* Một Đời — v6.8.0: khai thác sâu hơn Nemotron-Personas-Vietnam (NVIDIA & FPT, CC BY 4.0; xem data-personas-vn.js)
   · người quen kể kỹ năng nghề và điều họ đang mong muốn (theo nghề, theo vùng)
   · môn thể thao người cùng vùng, cùng tuổi hay chơi; nơi người cùng vùng hay đi du lịch; loại hình văn nghệ được ưa chuộng
   · thêm 30 thành tựu (thể thao, xê dịch, văn hóa, công dân, gia đình…) */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC;
  var PV = G.PERSONAS_VN || {}, P = PV.regions || {};
  function pick(r, a) { return U.pick(r, a); }
  function free(l) { return !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }
  function vn(l) { return H.isVN(l) && l.mode === 'vn' && !(l.abroad && (l.abroad.perm || l.abroad.trapped)); }
  function T(id, when, p, cd, max, rep) { E.TRIG.push({ id: id, when: function (l, a) { return free(l) && when(l, a); }, p: p, cd: cd || 4, max: max || 1, rep: !!rep }); }
  function low(s) { return s ? s.charAt(0).toLowerCase() + s.slice(1) : ''; }
  function band(a) { return a < 30 ? 'y' : a < 45 ? 'm' : a < 60 ? 'o' : 's'; }
  function wpick(r, list, skip) { var a = (list || []).filter(function (x) { return !skip || skip.indexOf(x[0]) < 0; }); if (!a.length) return null; var t = a.reduce(function (s, x) { return s + x[1]; }, 0), z = r() * t; for (var i = 0; i < a.length; i++) { z -= a[i][1]; if (z <= 0) return a[i][0]; } return a[a.length - 1][0]; }
  function group(l) { return E.PERSONA && E.PERSONA.group ? E.PERSONA.group(l) : null; }
  function regName(l) { var k = E.PERSONA && E.PERSONA.region(l); return k ? E.PERSONA.regionName(k) : ''; }

  // 1. người quen kể thêm kỹ năng nghề và điều đang mong muốn
  var NQ = E.DEC.pv_nguoi_quen;
  if (NQ) {
    var nqMake = NQ.make;
    NQ.make = function (l, r) {
      var d = nqMake.apply(this, arguments), x = d.data;
      if (!x || x.none || !x.job) return d;
      var sk = PV.skills && PV.skills[x.job], gl = PV.goalsByJob && PV.goalsByJob[x.job], g = group(l);
      if (!x.skill && sk && sk.length) x.skill = pick(r, sk.slice(0, 4));
      if (!x.goal) x.goal = gl && gl.length ? pick(r, gl) : (g && g.goal && g.goal.length ? wpick(r, g.goal.slice(0, 6)) : null);
      var dd = x.age - l.age, who = dd >= 18 ? (x.sex === 'F' ? 'cô ấy' : 'chú ấy') : dd >= 3 ? (x.sex === 'F' ? 'chị ấy' : 'anh ấy') : dd >= -3 ? 'bạn ấy' : 'em ấy';
      var extra = (x.skill ? ' Ai cũng khen ' + who + ' giỏi ' + low(x.skill) + '.' : '') + (x.goal ? ' Điều ' + who + ' đang mong nhất: ' + low(x.goal) + '.' : '');
      d.text = d.text + extra;
      return d;
    };
  }

  // 2. thể thao theo vùng, theo tuổi
  SC('pv_the_thao', {
    title: 'Rủ nhau rèn luyện',
    prep: function (l, r) { var g = group(l); if (!g || !g.sport) return { none: true }; var by = g.sportAge && g.sportAge[band(l.age)], src = (by && by.length >= 4 ? by : g.sport).filter(function (x) { return l.age <= 65 || !/gym|bóng đá|bóng rổ|leo núi|võ thuật/.test(x[0]); }), have = l.flags.sports || [], a = []; for (var i = 0; i < 3; i++) { var s = wpick(r, src, have.concat(a)); if (s) a.push(s); } return a.length >= 2 ? { list: a } : { none: true }; },
    valid: function (l, d) { return !d || !d.none; },
    text: function (l, d) { if (!d || d.none) return ''; return 'Ở ' + (regName(l) || 'chỗ bạn ở') + ', người tuổi bạn hay rủ nhau ' + d.list.map(low).join(', ') + '. Bạn muốn tham gia môn nào?'; },
    opts: [0, 1, 2].map(function (i) { return { k: 's' + i, l: function (l, d) { return d && d.list && d.list[i] ? 'Tham gia ' + low(d.list[i]) : ''; }, req: function (l, d) { return !!(d && d.list && d.list[i]); }, ai: { w: 1 }, run: function (l, r, log, d) { var s = d.list[i]; l.flags.sports = (l.flags.sports || []).concat([s]).slice(-3); log(pick(r, ['Bạn bắt đầu ' + low(s) + ' đều đặn mỗi tuần, người khỏe khoắn hẳn.', 'Nhóm ' + low(s) + ' ở gần nhà đón bạn rất nhiệt tình. Tập xong cả hội còn rủ nhau đi ăn.', 'Mấy buổi đầu ê ẩm cả người, nhưng rồi ' + low(s) + ' thành thói quen không bỏ được.']), 'good'); H.fx(l, { hea: 3, hap: 2, soc: 1 }); } }; }).concat([{ k: 'thoi', l: 'Thôi, mình ít vận động', run: function (l, r, log) { log('Bạn từ chối. Lâu lâu nghe nhóm bạn kể chuyện tập luyện cũng thấy vui lây.', 'neutral'); } }]) });
  T('pv_the_thao', function (l, a) { return vn(l) && a >= 15 && a <= 80 && (l.flags.sports || []).length < 3 && !!group(l); }, 0.05, 8, 3, true);
  E.HOOKS.year.unshift(function (l, r, log, a) { var s = l.flags && l.flags.sports; if (!s || !s.length || !l.alive || a < 15) return; if (r() < 0.08) { var sp = s[Math.floor(r() * s.length)]; if (a > 65 && /gym|bóng đá|bóng rổ|leo núi|võ thuật/.test(sp)) sp = 'đi bộ, tập dưỡng sinh'; H.fx(l, { hea: 1 }); log('Vẫn giữ đều ' + low(sp) + ' — năm nay khám sức khỏe bác sĩ khen.', 'neutral'); } });

  // 3. du lịch: nơi người cùng vùng hay đi
  var ABROAD = ['Thái Lan', 'Singapore', 'Hàn Quốc', 'Nhật Bản', 'Trung Quốc', 'Đài Loan', 'Malaysia', 'Campuchia', 'châu Âu', 'Úc', 'Bali'];
  SC('pv_du_lich', {
    title: 'Chuyến đi năm nay',
    prep: function (l, r) { var g = group(l); if (!g || !g.place) return { none: true }; var here = String(l.provLabel || '') + ' ' + String(l.movedTo || '') + ' ' + String(l.prov && l.prov.old || ''), been = (l.flags.places || []).concat(['Sài Gòn', 'Hà Nội', 'Huế', 'Đà Nẵng', 'Cần Thơ', 'Đà Lạt', 'Vũng Tàu', 'Nha Trang', 'Tây Ninh', 'Cà Mau', 'Bến Tre', 'Lạng Sơn', 'Cao Bằng', 'Hà Giang', 'Pleiku', 'Buôn Ma Thuột', 'Quy Nhơn', 'Phan Thiết', 'Châu Đốc'].filter(function (p) { return here.indexOf(p) >= 0 || (p === 'Sài Gòn' && /Hồ Chí Minh/.test(here)) || (p === 'Đà Lạt' && /Lâm Đồng/.test(here)); })), rich = l.money > l.base * 3, a = []; for (var i = 0; i < 3; i++) { var p = wpick(r, g.place.filter(function (x) { return rich || ABROAD.indexOf(x[0]) < 0; }), been.concat(a)); if (p) a.push(p); } return a.length >= 2 ? { list: a } : { none: true }; },
    valid: function (l, d) { return !d || !d.none; },
    text: function (l, d) { if (!d || d.none) return ''; return 'Có mấy ngày nghỉ, bạn tính đi chơi một chuyến. Người ở ' + (regName(l) || 'quê bạn') + ' hay rủ nhau đi ' + d.list.join(', ') + '.'; },
    opts: [0, 1, 2].map(function (i) { return { k: 'p' + i, l: function (l, d) { return d && d.list && d.list[i] ? 'Đi ' + d.list[i] : ''; }, h: function (l, d) { var p = d && d.list && d.list[i]; return p ? 'Khoảng ' + H.money(l, l.base * (ABROAD.indexOf(p) >= 0 ? 0.25 : 0.06)) : ''; }, req: function (l, d) { var p = d && d.list && d.list[i]; return !!p && l.money >= l.base * (ABROAD.indexOf(p) >= 0 ? 0.25 : 0.06); }, ai: { w: 1 }, run: function (l, r, log, d) { var p = d.list[i], far = ABROAD.indexOf(p) >= 0; H.cash(l, -l.base * (far ? 0.25 : 0.06), 'Du lịch ' + p); l.flags.places = (l.flags.places || []).concat([p]); log(pick(r, ['Chuyến đi ' + p + ' để lại bao nhiêu ảnh đẹp, về nhà ai cũng hỏi.', 'Đi ' + p + ' mấy ngày, ăn đủ món ngon, về nhà vẫn còn nhớ.', 'Lần đầu đến ' + p + ', bạn đứng ngẩn người ngắm cảnh, thấy chuyến đi thật đáng.']), 'good'); H.fx(l, { hap: 4 }); H.mem(l, 'Chuyến đi ' + p + '.', 2); } }; }).concat([{ k: 'nha', l: 'Ở nhà nghỉ ngơi cho đỡ tốn', run: function (l, r, log) { log('Bạn ở nhà ngủ bù, dọn dẹp nhà cửa. Cũng là một kiểu nghỉ ngơi.', 'neutral'); } }]) });
  T('pv_du_lich', function (l, a) { return vn(l) && a >= 18 && l.indep && l.money > l.base * 0.3 && !!group(l); }, 0.06, 4, 3, true);

  // 4. văn nghệ được ưa chuộng ở vùng bạn (chỉ tiết mục biểu diễn)
  var STAGE = ['nhiếp ảnh', 'phim Hàn Quốc', 'vẽ tranh', 'thư pháp', 'đan len, thêu thùa', 'làm gốm', 'karaoke', 'đọc thơ'];
  SC('pv_van_nghe', {
    title: 'Đêm văn nghệ',
    prep: function (l, r) { var g = group(l); if (!g || !g.art) return { none: true }; var have = l.flags.arts || [], a = []; for (var i = 0; i < 3; i++) { var s = wpick(r, g.art.filter(function (x) { return STAGE.indexOf(x[0]) < 0; }).slice(0, 18), have.concat(a)); if (s) a.push(s); } return a.length >= 2 ? { list: a } : { none: true }; },
    valid: function (l, d) { return !d || !d.none; },
    text: function (l, d) { if (!d || d.none) return ''; return 'Nhà văn hóa tổ chức đêm văn nghệ, có ' + d.list.join(', ') + '. Bạn hứng thú với tiết mục nào nhất?'; },
    opts: [0, 1, 2].map(function (i) { return { k: 'a' + i, l: function (l, d) { return d && d.list && d.list[i] ? U.cap(d.list[i]) : ''; }, req: function (l, d) { return !!(d && d.list && d.list[i]); }, ai: { w: 1 }, run: function (l, r, log, d) { var s = d.list[i]; l.flags.arts = (l.flags.arts || []).concat([s]).slice(-5); log(pick(r, ['Bạn say sưa với ' + s + ' suốt buổi tối, về nhà vẫn ngân nga mãi.', 'Tiết mục ' + s + ' làm cả hội trường vỗ tay không ngớt. Bạn quyết định tìm hiểu thêm.']), 'good'); H.fx(l, { hap: 3 }); } }; }) });
  T('pv_van_nghe', function (l, a) { return vn(l) && a >= 10 && (l.flags.arts || []).length < 5 && !!group(l); }, 0.04, 8, 3, true);


  // 6. mai mối, xem mắt, giục cưới — tập quán phổ biến; đối chiếu số liệu cho thấy game có quá nhiều người 30–44 tuổi chưa lập gia đình
  function single(l) { return !l.partner || l.partner.alive === false; }
  function parentsUrge(l) { return l.fam.mAlive ? 'mẹ' : l.fam.fAlive && !l.fam.noDad ? 'bố' : 'họ hàng'; }
  SC('vn_xem_mat', {
    title: 'Đi xem mắt',
    prep: function (l, r) { var sx = H.partnerSex(l, r), g = group(l), age = U.clamp(l.age + U.randint(r, -4, 4), 20, 60), job = g && wpick(r, g.job.filter(function (x) { return !/^(Nghỉ hưu|Học sinh|Đang tìm)/.test(x[0]); }).slice(0, 30)) || 'Nhân viên văn phòng'; return { n: H.stranger(l, r, sx), sex: sx, age: age, job: job }; },
    valid: function (l) { return single(l); },
    text: function (l, d) { if (!d || !d.n) return ''; var u = parentsUrge(l); return U.cap(u) + ' sốt ruột vì bạn ' + l.age + ' tuổi rồi mà chưa có ai, nhờ người quen giới thiệu ' + d.n + ', ' + d.age + ' tuổi, ' + low(d.job) + '. "Gặp một buổi cho biết, có mất gì đâu."'; },
    opts: [
      { k: 'gap', l: 'Đi gặp một buổi cho bố mẹ vui', ai: { soc: 1, w: 1.3 }, run: function (l, r, log, d) { if (r() < 0.6) { l.partner = { name: d.n, sex: d.sex, age: d.age, status: 'dating', since: l.age, alive: true }; log(pick(r, ['Buổi xem mắt ở quán cà phê bắt đầu ngượng ngùng, rồi hai người nói chuyện mãi không dứt. Hẹn gặp lại lần nữa.', 'Không ngờ hai người hợp nhau đến vậy. ' + U.cap(parentsUrge(l)) + ' mừng ra mặt.']), 'good'); H.fx(l, { hap: 4 }); H.mem(l, 'Buổi xem mắt gặp ' + d.n + '.', 4); } else { log(pick(r, ['Gặp một buổi, hai người lịch sự chào nhau rồi thôi. Không có duyên.', 'Nói chuyện được vài câu thì hết chuyện. Về nhà ' + parentsUrge(l) + ' thở dài.']), 'neutral'); } } },
      { k: 'tu_choi', l: 'Từ chối, muốn tự tìm người mình thương', ai: { w: 0.8 }, run: function (l, r, log) { log('Bạn từ chối. ' + U.cap(parentsUrge(l)) + ' buồn mấy hôm, rồi lại dặn: "Thôi thì tùy con, nhưng đừng để muộn quá."', 'neutral'); if (l.mind) l.mind.stress = U.clamp((l.mind.stress || 0) + 3, 0, 100); } }
    ] });
  T('vn_xem_mat', function (l, a) { return vn(l) && a >= 26 && a <= 42 && single(l) && l.orient !== 'gay' && (l.fam.mAlive || l.fam.fAlive || true); }, 0.22, 3, 4, true);
  SC('vn_giuc_cuoi', {
    title: 'Hai bên gia đình giục cưới',
    valid: function (l) { return !!(l.partner && l.partner.alive !== false && l.partner.status === 'dating'); },
    text: function (l) { return 'Bạn và ' + (l.partner ? l.partner.name : 'người ấy') + ' quen nhau đã lâu. Tết này hai bên gia đình gặp nhau, ai cũng hỏi: "Bao giờ cho bố mẹ ăn cỗ?"'; },
    opts: [
      { k: 'cuoi', l: 'Bàn chuyện cưới xin', ai: { w: 1.3 }, run: function (l, r, log) { log('Hai người ngồi bàn chuyện cưới. Hai bên gia đình mừng rỡ.', 'good'); var W = E.DEC.cuoi_to_chuc; if (W && (!W.valid || W.valid(l, {}))) l.pending.unshift(W.make(l, r)); else if (E.DEC.marry && E.DEC.marry.make) l.pending.unshift(E.DEC.marry.make(l, r)); } },
      { k: 'chua', l: 'Xin thêm thời gian, lo sự nghiệp trước', ai: { w: 0.8 }, run: function (l, r, log) { log('Bạn xin thêm thời gian. Người ấy gật đầu, nhưng ánh mắt có chút buồn.', 'neutral'); } }
    ] });
  T('vn_giuc_cuoi', function (l, a) { var p = l.partner; return vn(l) && a >= 23 && a <= 45 && !!p && p.alive !== false && p.status === 'dating' && a - (p.since || a) >= 2; }, 0.35, 2, 4, true);

  // 5. thêm thành tựu
  function lg(l, re) { return (l.log || []).some(function (e) { return e && re.test(e.t); }); }
  function dAge(l) { return l.death ? l.death.age : l.age; }
  var N = ['Hà Giang', 'Sa Pa', 'Hạ Long', 'Ninh Bình', 'Tràng An', 'Tam Cốc', 'Mộc Châu', 'Mai Châu', 'Cát Bà', 'Cao Bằng', 'Bản Giốc', 'Ba Bể', 'Lạng Sơn', 'Tam Đảo', 'Hà Nội', 'Chùa Hương', 'Yên Tử', 'Đền Hùng', 'Sầm Sơn'],
    M = ['Huế', 'Đà Nẵng', 'Hội An', 'Phong Nha', 'Lý Sơn', 'Quy Nhơn', 'Nha Trang', 'Đà Lạt', 'Buôn Ma Thuột', 'Pleiku', 'Măng Đen', 'Cửa Lò'],
    S = ['Phú Quốc', 'Cần Thơ', 'Châu Đốc', 'Bến Tre', 'Cà Mau', 'Vũng Tàu', 'Côn Đảo', 'Phan Thiết', 'Mũi Né', 'Tây Ninh', 'Sài Gòn'];
  function been(l, list) { return (l.flags.places || []).some(function (p) { return list.indexOf(p) >= 0; }); }
  function titles(l) { return [l.peakTitle || '', l.job ? E.jobTitle(l) : ''].concat((l.jobsHist || []).map(function (h) { try { return E.jobLabel(h.id); } catch (e) { return ''; } })).join(' | '); }
  if (E.addAchievements) E.addAchievements([
    ['khoe_tre', '🏃', 'Khỏe như thanh niên', 'Chơi từ 2 môn thể thao và sống tới 70 tuổi', function (l) { return (l.flags.sports || []).length >= 2 && dAge(l) >= 70; }],
    ['xe_dich', '🎒', 'Xê dịch', 'Đi du lịch từ 5 nơi', function (l) { return (l.flags.places || []).length >= 5; }],
    ['xuyen_viet', '🇻🇳', 'Xuyên Việt', 'Đặt chân tới cả ba miền Bắc, Trung, Nam', function (l) { return been(l, N) && been(l, M) && been(l, S); }],
    ['ra_the_gioi', '🌏', 'Ra thế giới', 'Đi du lịch nước ngoài', function (l) { return been(l, ABROAD); }],
    ['giu_hon_que', '🪕', 'Giữ hồn quê', 'Theo nghệ nhân học từ 2 di sản văn hóa', function (l) { return (l.flags.dsLearn || 0) >= 2; }],
    ['con_cua_di_san', '🏮', 'Người con của di sản', 'Tham dự từ 3 di sản văn hóa phi vật thể', function (l) { return Object.keys(l.flags.dsSeen || {}).length >= 3; }],
    ['cong_dan', '🗳️', 'Công dân gương mẫu', 'Đi bầu cử từ 3 lần', function (l) { return (l.flags.voted || 0) >= 3; }],
    ['me_su', '📜', 'Mê sử', 'Chăm chú học từ 2 bài lịch sử', function (l) { return (l.flags.lsGood || 0) >= 2; }],
    ['tam_hon_nghe_si', '🎭', 'Tâm hồn nghệ sĩ', 'Mê từ 3 loại hình văn nghệ', function (l) { return (l.flags.arts || []).length >= 3; }],
    ['song_cham', '🍃', 'Sống chậm', 'Có 4 thú vui riêng', function (l) { return (l.flags.hobbies || []).length >= 4; }],
    ['lang_gieng', '🏘️', 'Bán anh em xa, mua láng giềng gần', 'Quen từ 3 người hàng xóm', function (l) { return ((l.flags.scN || {}).pv_nguoi_quen || 0) >= 3; }],
    ['huong_vi_que', '🍲', 'Hương vị quê nhà', 'Sống xa quê vẫn tự nấu món quê', function (l) { return (l.flags.homeDish || 0) >= 1; }],
    ['giu_le_dan_toc', '🎎', 'Giữ lễ của dân tộc mình', 'Về dự lễ tết của dân tộc mình từ 2 lần', function (l) { return (l.flags.ethFest || 0) >= 2; }],
    ['uong_nuoc_nho_nguon', '🕯️', 'Uống nước nhớ nguồn', 'Tri ân các anh hùng liệt sĩ ngày 27/7', function (l) { return (l.flags.triAn || 0) >= 1; }],
    ['ve_den_hung', '⛩️', 'Về nguồn', 'Dâng hương ở Đền Hùng ngày Giỗ Tổ', function (l) { return !!l.flags.denHung; }],
    ['cay_ngay_le', '⏱️', 'Cày cả ngày lễ', 'Đi làm ngày lễ 30/4 – 1/5 từ 2 lần', function (l) { return (l.flags.tangCaLe || 0) >= 2; }],
    ['vuot_so_phan', '🌄', 'Vượt số phận', 'Sống lâu hơn tuổi thọ kỳ vọng 15 năm', function (l) { return !!(l.death && l.e0sex && l.death.age >= l.e0sex + 15); }],
    ['chat_dan', '🍼', 'Chắt đàn', 'Có từ 5 đứa chắt', function (l) { return (l.ggrand || 0) >= 5; }],
    ['vuon_thu', '🦜', 'Vườn thú tại gia', 'Nuôi từ 4 thú cưng trong đời', function (l) { return (l.pets || []).length >= 4; }],
    ['hoc_sinh_gioi', '🥇', 'Học sinh giỏi', 'Đoạt giải học sinh giỏi', function (l) { return lg(l, /giải (nhất|nhì|ba|khuyến khích)[^.]*(học sinh giỏi|HSG)|học sinh giỏi (cấp )?(tỉnh|thành|quốc gia)[^.]*giải/); }],
    ['thu_khoa', '🎖️', 'Thủ khoa', 'Đỗ thủ khoa', function (l) { return lg(l, /thủ khoa/i); }],
    ['tron_ven', '🌕', 'Một đời trọn vẹn', 'Sống tới 75, có con cháu, không nợ nần, bạn đời bên cạnh 40 năm', function (l) { var p = l.partner; return dAge(l) >= 75 && (l.kids || []).length >= 2 && (l.grand || 0) > 0 && E.netWorth(l) > 0 && !!(p && p.alive !== false && p.status !== 'dating' && p.since != null && dAge(l) - p.since >= 40); }],
    ['xe_hoi', '🚙', 'Xe hơi đầu tiên', 'Sở hữu ô tô', function (l) { return lg(l, /(mua|tậu|sắm)[^.]{0,30}(ô tô|xe hơi|chiếc xe [A-Z])/) || !!(l.veh && /ô tô|xe hơi|sedan|SUV|bán tải/i.test(JSON.stringify(l.veh))); }],
    ['ra_di_thanh_than', '🕊️', 'Ra đi thanh thản', 'Sống tới 80 tuổi và ra đi nhẹ nhàng vì tuổi già', function (l) { return !!(l.death && l.death.age >= 80 && /tuổi già|thanh thản/.test(l.death.cause || '')); }],
    ['ban_xu', '🏡', 'Một đời bên quê', 'Sống trọn đời ở quê nhà tới 70 tuổi', function (l) { return dAge(l) >= 70 && !l.movedTo && !l.abroad && !lg(l, /xuất khẩu lao động|định cư/); }],
    ['khong_nghi', '🛠️', 'Không chịu ngồi yên', 'Vẫn đi làm ở tuổi 70', function (l) { return dAge(l) >= 70 && !!l.job && !l.retired; }],
    ['tieu_thuong', '🧺', 'Buôn bán giỏi', 'Làm tiểu thương, chủ cửa hàng', function (l) { return /tiểu thương|bán hàng|chủ (cửa hàng|tiệm|sạp)|buôn/.test(titles(l)); }],
    ['tho_lanh_nghe', '🔧', 'Thợ lành nghề', 'Làm thợ, công nhân hơn 20 năm', function (l) { return /thợ|công nhân/.test(titles(l)) && (l.workYrs || 0) >= 20; }],
    ['dai_gia_dinh', '👪', 'Đại gia đình', 'Có từ 3 người con và 6 đứa cháu', function (l) { return (l.kids || []).length >= 3 && (l.grand || 0) >= 6; }],
    ['tinh_nguyen', '💗', 'Trái tim thiện nguyện', 'Sống tử tế và nhiều lần làm từ thiện', function (l) { return (l.karma || 0) >= 40 && (l.log || []).filter(function (e) { return /từ thiện|ủng hộ|quyên góp|thiện nguyện|công quả|phát cơm/.test(e.t); }).length >= 2; }]
  ]);
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));

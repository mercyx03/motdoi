/* Một Đời — v4.2 (góp ý của người chơi):
   · bạn thân đã mất thì không còn "đưa cho bạn thân xem"; dưới 18 tuổi không làm "chủ" được (trừ phụ giúp cơ nghiệp của bố mẹ)
   · con nhà có điều kiện đã nghe theo sắp xếp của gia đình thì không hỏi lại "ngã rẽ 18 tuổi", gia đình định hướng luôn
   · đại học: câu lạc bộ (gợi ý theo sở trường, sở thích), lễ khai giảng mời ca sĩ về diễn
   · bệnh tật hay gặp: đau ruột thừa phải mổ, sốt siêu vi, sốt xuất huyết, thủy đậu, tay chân miệng, sỏi thận, viêm dạ dày; dị ứng (tôm cua, cá, đậu phộng…)
   · con đường xấu: đàn em phản bội, bị cướp người yêu, bị thanh toán, truy nã, mẹ khóc khuyên… — cái giá phải trả
   · trong tù: cả cuộc sống chỉ xoay quanh trại giam (thăm nuôi, lao động cải tạo, học nghề, đặc xá…), việc làm trong trại; ra tù khó xin việc, dễ bị kéo lại đường cũ
   · chống "farm tiền": tài sản rất lớn chịu chi phí, thuế, phí quản lý và lợi suất giảm dần; thu nhập chủ tịch tập đoàn sát thực tế hơn
   · đổi tôn giáo; giới hạn tuổi: thi bằng lái đến 60 tuổi, tìm người yêu đến 55 tuổi */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function A(id, g, label, o) { var x = { id: id, g: g, l: label }; for (var k in o) x[k] = o[k]; E.ACT.push(x); }
  function fx(l, o) { H.fx(l, o); }
  function mo(l, v) { return H.money(l, v); }
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function inJail(l) { return l.jailUntil != null && l.age < l.jailUntil; }
  function free(l) { return !inJail(l) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }
  function vnd(l) { return isVN(l) && l.cur === 'vnd' && !(l.abroad && l.abroad.perm); }
  function V(l, tr) { return vnd(l) ? tr : tr / 90 * l.base; }
  function T(id, when, p, cd, max) { E.TRIG.push({ id: id, when: function (l, a) { return free(l) && when(l, a); }, p: p, cd: cd || 4, max: max || 1 }); }
  function RT(id, when, p) { E.TRIG.push({ id: id, when: function (l, a) { return free(l) && when(l, a); }, p: p, cd: 1, rep: true }); }
  function EV(c, p, run, cd) { E.EVENTS.push({ c: c, p: p, run: run, cd: cd }); }
  function job(l) { return l.job ? E.resolveJob(l.job.id) : null; }
  function stress(l, x) { if (l.mind) l.mind.stress = U.clamp(l.mind.stress + x, 0, 100); }
  function parent(l) { return l.fam.mAlive ? 'mẹ' : l.fam.fAlive ? 'bố' : null; }

  // ===================================================================
  // 1. GIỚI HẠN TUỔI
  // ===================================================================
  var MAXAGE = { bang_lai: 60, tim_nguoi_yeu: 55 };
  E.ACT.forEach(function (a) { if (MAXAGE[a.id] != null && (a.max == null || a.max > MAXAGE[a.id])) a.max = MAXAGE[a.id]; });
  E.LOVE_MAX = 55;

  // ===================================================================
  // 2. VIỆC LÀM: DƯỚI 18 TUỔI KHÔNG LÀM CHỦ; RA TÙ KHÓ XIN VIỆC
  // ===================================================================
  var FAMBIZ = { kd_tap_hoa: /tạp hóa|đại lý|buôn bán/, kd_quan: /quán/, chu_quan_an: /quán/, chu_nha_hang: /nhà hàng/, tiem_vang: /vàng/, chu_xuong: /xưởng|nhà máy/, cam_do: /cầm đồ/, tiem_dt: /điện thoại/ };
  function famBiz(l, id) { var re = FAMBIZ[id], f = l.fam; return !!(re && f && ((f.fAlive && re.test(f.fJob || '')) || (f.mAlive && re.test(f.mJob || '')))); }
  E.famBiz = famBiz;
  function ownerStart(l, id) { var c = E.CAR[E.resolveJob(id)]; if (!c) return false; var lb = E.offerLabel ? E.offerLabel(l, id) : c.t[0]; return /^(chủ|ông chủ|bà chủ|giám đốc|tổng giám đốc|chủ tịch)/.test(lb); }
  E.ownerStart = ownerStart;
  function okOwner(l, id) { if (!ownerStart(l, id) || famBiz(l, id)) return true; if (l.age < 18) return false; return l.age >= 22 || l.money >= l.base * 2; }
  function released(l) { return !!(l.record && l.flags.releasedAt != null && l.age - l.flags.releasedAt < 10); }
  function fill(l, r, o, need, f) {
    var cands = Object.keys(E.CAR).filter(function (id) { var c = E.CAR[id]; return o.indexOf(id) < 0 && E.jobEligible(l, c) && f(id, c); });
    while (o.length < need && cands.length) { var c = U.wpick(r, cands, function (id) { return E.CAR[id].w || 1; }); o.push(c); cands = cands.filter(function (x) { return x !== c; }); }
    return o;
  }
  var off0 = E.offers;
  E.offers = function (l, r) {
    var o = off0.apply(this, arguments), n = o.length;
    o = o.filter(function (id) { return okOwner(l, id); });
    if (released(l)) { // v4.2: tiền án — phần lớn nơi làm việc chính thức từ chối, việc chân tay hoặc việc phi pháp lại dễ tìm
      o = o.filter(function (id) { var c = E.CAR[E.resolveJob(id)]; return !(c && c.sec === 'formal') || ch(r, 0.2); });
      n = Math.min(n, 2);
      if (ch(r, 0.5)) { var cr = Object.keys(E.CAR).filter(function (id) { var c = E.CAR[id]; return c.sec === 'crime' && o.indexOf(id) < 0 && (c.edu || 0) <= Math.max(2, l.edu) && !/^(tham_nhung|rua_tien)$/.test(id); }); if (cr.length) o.unshift(U.wpick(r, cr, function (id) { return E.CAR[id].w || 1; })); }
    }
    return fill(l, r, o, Math.max(1, n), function (id, c) { return okOwner(l, id) && !(released(l) && c.sec === 'formal'); }).slice(0, Math.max(1, n));
  };
  var ol0 = E.offerLabel;
  if (ol0) E.offerLabel = function (l, id) { var s = ol0.apply(this, arguments); return l.age < 18 && famBiz(l, id) && /^chủ /.test(s) ? 'phụ giúp ' + s.replace(/^chủ /, '') + ' của gia đình' : s; };
  if (E.DEC.ra_tu) { var rt0 = E.DEC.ra_tu.apply; E.DEC.ra_tu.apply = function (l) { l.flags.releasedAt = l.age; return rt0.apply(this, arguments); }; }

  // ===================================================================
  // 3. CON NHÀ CÓ ĐIỀU KIỆN NGHE THEO GIA ĐÌNH: KHÔNG HỎI "NGÃ RẼ 18 TUỔI"
  // ===================================================================
  function follower(l) { return !!(l.fam && l.fam.elite && l.flags.eliteFollow && !l.flags.eliteCut); }
  E.eliteFollower = follower;
  var uv0 = E.DEC.uni.valid;
  E.DEC.uni.valid = function (l) { if (follower(l)) return false; if (l.fam && l.fam.elite && !l.flags.eliteChoice && l.pending.some(function (q) { return q.id === 'elite_dinh_huong'; })) { l.flags.eliteUniHeld = true; return false; } return uv0 ? uv0.apply(this, arguments) : true; };
  if (E.DEC.elite_dinh_huong) { var ed0 = E.DEC.elite_dinh_huong.apply; E.DEC.elite_dinh_huong.apply = function (l, d, k, r) { var x = ed0.apply(this, arguments); if (follower(l)) l.pending = l.pending.filter(function (q) { return !/^(uni|job)$/.test(q.id); }); else if (l.flags.eliteUniHeld && !l.school && l.edu >= 3) { l.flags.eliteUniHeld = false; l.pending.unshift(E.DEC.uni.make(l, r)); } return x; }; }
  // con đường gia đình được bàn từ năm 17 tuổi, trước kỳ thi đại học
  E.HOOKS.year.push(function (l, r, log, a) { if (a === 16 && l.fam && l.fam.elite && !l.flags.eliteChoice && !l.flags.eliteSched) { l.flags.eliteSched = true; H.sched(l, 'elite_dinh_huong', 1); } });
  function famCo(l) { var e = l.fam.elite; return e === 'ct' ? 'cơ quan' : e === 'nh' ? 'ngân hàng của gia đình' : 'tập đoàn của gia đình'; }
  SC('elite_thuc_tap', {
    title: 'Kỳ thực tập do bố sắp xếp', valid: function (l) { return follower(l); },
    text: function (l) { return l.fam.elite === 'ct' ? 'Hè này bố cho bạn theo chân chánh văn phòng đi dự họp, xuống cơ sở. "Phải biết dân cần gì trước rồi mới nói chuyện chính sách."' : 'Hè này bố cho bạn vào thực tập ở ' + famCo(l) + ', ngồi cùng phòng với các trưởng ban. Ai cũng gọi bạn là "cậu/cô chủ nhỏ".'; },
    opts: [
      { k: 'hoc', l: 'Học từ việc nhỏ nhất, không dựa hơi', ai: { w: 1.2, smart: 0.8 }, run: function (l, r, log) { log('Đến sớm về muộn, tự pha cà phê, tự làm báo cáo. Các cô chú trong ' + famCo(l) + ' bắt đầu nể bạn thật lòng.', 'good'); fx(l, { kno: 4, soc: 2 }); l.flags.eliteGood = (l.flags.eliteGood || 0) + 1; } },
      { k: 'choi', l: 'Đến cho có, chủ yếu đi chơi với hội bạn', ai: { w: 0.6 }, run: function (l, r, log) { log('Thực tập cho có. Bố biết chuyện, gọi vào phòng nói một câu: "Ghế của bố không tự nhiên mà có."', 'neutral'); fx(l, { hap: 2 }); } }
    ]
  });
  T('elite_thuc_tap', function (l, a) { return follower(l) && a >= 18 && a <= 23; }, 0.35, 4, 2);
  SC('elite_bai_hoc', {
    title: 'Bài học từ bố', valid: function (l) { return follower(l) && l.fam.fAlive; },
    prep: function (l, r) { return { t: l.fam.elite === 'ct' ? pick(r, ['Bố dẫn bạn đi thăm một xã nghèo vùng lũ: "Làm cán bộ mà quên những người này thì đừng làm."', 'Bố kể về một người bạn cũ bị kỷ luật vì nhận phong bì: "Một lần nhận là cả đời phải trả."']) : pick(r, ['Bố dẫn bạn đi gặp đối tác Nhật Bản, dặn: "Hợp đồng nghìn tỷ cũng bắt đầu từ cái bắt tay đúng hẹn."', 'Bố kể lần tập đoàn suýt phá sản năm 2008: "Lúc khó khăn nhất, giữ được người là giữ được tất cả."', 'Bố cho bạn ngồi dự một cuộc họp cắt giảm nhân sự: "Ra quyết định khó là việc của người đứng đầu."']) }; },
    text: function (l, d) { return d.t; },
    opts: [
      { k: 'nghe', l: 'Ghi nhớ từng lời', ai: { w: 1.2 }, run: function (l, r, log) { log('Ghi lời bố vào sổ tay. Về sau nhiều lần nhớ lại.', 'good'); fx(l, { kno: 3 }); H.mem(l, 'Một bài học của bố về cách làm người đứng đầu.', 4); } },
      { k: 'cai', l: 'Cãi lại: thời bây giờ khác rồi', ai: { w: 0.5, risk: 0.5 }, run: function (l, r, log) { log('Hai bố con tranh luận đến khuya. Bố không giận, chỉ bảo: "Được, con chứng minh đi."', 'neutral'); fx(l, { soc: 1 }); } }
    ]
  });
  T('elite_bai_hoc', function (l, a) { return follower(l) && a >= 17 && a <= 35 && l.fam.fAlive; }, 0.18, 5, 2);
  SC('elite_ap_luc', {
    title: 'Cái bóng của gia đình', valid: function (l) { return follower(l); },
    text: 'Đi đâu người ta cũng giới thiệu bạn là "con của ông ấy". Làm tốt thì "nhờ bố", làm hỏng thì "con nhà giàu ăn hại". Áp lực đè nặng.',
    opts: [
      { k: 'co', l: 'Cố gắng gấp đôi để chứng minh bản thân', ai: { w: 1.1, amb: 1 }, run: function (l, r, log) { stress(l, 8); fx(l, { kno: 2 }); log('Làm việc đến kiệt sức chỉ để người ta nhớ tên mình chứ không phải tên bố.', 'neutral'); } },
      { k: 'ke', l: 'Kệ, sống đúng là mình', ai: { w: 0.9 }, run: function (l, r, log) { fx(l, { hap: 3 }); log('Thôi bận tâm lời ra tiếng vào, làm tốt việc của mình.', 'good'); } },
      { k: 'tam_ly', l: 'Tìm gặp chuyên gia tâm lý', ai: { w: 0.4 }, run: function (l, r, log) { H.cash(l, -V(l, 6), 'Tư vấn tâm lý'); stress(l, -15); log('Đi gặp chuyên gia tâm lý vài tháng, nhẹ nhõm hơn nhiều.', 'good'); } }
    ]
  });
  T('elite_ap_luc', function (l, a) { return follower(l) && a >= 18 && a <= 40; }, 0.1, 6, 1);

  // ===================================================================
  // 4. ĐẠI HỌC: CÂU LẠC BỘ, LỄ KHAI GIẢNG
  // ===================================================================
  function inUni(l) { return (l.school === 'uni' || l.school === 'voc') && l.age >= 17 && !(l.abroad && !l.abroad.perm && !l.abroad.study); }
  var CLB = {
    am_nhac: ['CLB Guitar & Âm nhạc', ['đêm nhạc acoustic gây quỹ từ thiện', 'buổi biểu diễn chào tân sinh viên', 'cuộc thi "Tiếng hát sinh viên"']],
    bong_da: ['CLB Bóng đá', ['giải bóng đá sinh viên toàn trường', 'trận giao hữu với đội trường bạn', 'giải bóng đá sinh viên thành phố']],
    tinh_nguyen: ['Đội Thanh niên tình nguyện', ['chiến dịch Mùa hè xanh ở một xã vùng sâu', 'đợt hiến máu nhân đạo "Giọt hồng"', 'chương trình Xuân tình nguyện, gói bánh chưng tặng người nghèo']],
    tieng_anh: ['CLB Tiếng Anh', ['buổi English Speaking Club hằng tuần', 'cuộc thi hùng biện tiếng Anh cấp trường', 'chuyến dẫn tour miễn phí cho khách nước ngoài']],
    nhay: ['CLB Dance', ['màn nhảy flashmob chào tân sinh viên', 'cuộc thi nhảy cover giữa các trường', 'buổi biểu diễn ở ngày hội văn hóa']],
    nhiep_anh: ['CLB Nhiếp ảnh', ['chuyến đi chụp ảnh phố cổ', 'triển lãm ảnh sinh viên', 'buổi chụp kỷ yếu cho khóa trên']],
    khoi_nghiep: ['CLB Khởi nghiệp', ['cuộc thi ý tưởng khởi nghiệp sinh viên', 'buổi gặp gỡ nhà đầu tư thiên thần', 'gian hàng bán đồ handmade ở ngày hội']],
    hoc_thuat: ['CLB Học thuật – Nghiên cứu khoa học', ['đề tài nghiên cứu khoa học sinh viên', 'cuộc thi Olympic chuyên ngành', 'buổi hội thảo với giảng viên đầu ngành']],
    truyen_thong: ['CLB Truyền thông – MC', ['dẫn chương trình đêm hội trường', 'làm clip giới thiệu trường', 'phỏng vấn khách mời ở ngày hội việc làm']],
    ve: ['CLB Mỹ thuật', ['vẽ tranh tường cho một trường mầm non', 'triển lãm tranh sinh viên', 'vẽ minh họa cho tạp chí của trường']],
    kich: ['CLB Kịch', ['vở kịch ngắn diễn ở đêm văn nghệ', 'cuộc thi tiểu phẩm giữa các khoa', 'buổi diễn kịch gây quỹ']],
    game: ['CLB Esports', ['giải Liên Quân sinh viên', 'buổi giao lưu với tuyển thủ chuyên nghiệp', 'giải Valorant giữa các trường']],
    co: ['CLB Cờ', ['giải cờ vua sinh viên', 'buổi đấu cờ tướng với các thầy', 'giải cờ nhanh online']],
    vo: ['CLB Võ thuật', ['buổi thi lên đai', 'màn biểu diễn võ ở ngày hội', 'giải võ thuật sinh viên']],
    sach: ['CLB Sách', ['buổi đọc sách ngoài trời', 'chương trình quyên góp sách cho trẻ em vùng cao', 'buổi gặp gỡ một nhà văn']],
    bep: ['CLB Ẩm thực', ['gian hàng ẩm thực ở hội chợ', 'cuộc thi nấu ăn giữa các khoa', 'buổi nấu cơm cho bệnh nhân nghèo']]
  };
  var T2C = { 'thể thao': ['bong_da', 'vo'], 'âm nhạc': ['am_nhac'], 'hội họa': ['ve'], 'toán học': ['hoc_thuat'], 'ngoại ngữ': ['tieng_anh'], 'ăn nói': ['truyen_thong'], 'khéo tay': ['bep'], game: ['game'], 'cờ': ['co'], 'diễn xuất': ['kich'], 'làm đẹp': ['nhay'], 'kinh doanh': ['khoi_nghiep'] };
  var H2C = { rap: 'am_nhac', nhay: 'nhay', guitar: 'am_nhac', ve: 've', chupanh: 'nhiep_anh', nauan: 'bep', doc: 'sach', kpop: 'nhay', bongda: 'bong_da' };
  function suggest(l) { var s = [].concat(T2C[l.talent] || []); if (l.hobby && H2C[l.hobby] && s.indexOf(H2C[l.hobby]) < 0) s.push(H2C[l.hobby]); return s; }
  E.clubSuggest = suggest;
  SC('clb_chon', {
    title: 'Ngày hội câu lạc bộ', valid: function (l) { return inUni(l) && !l.flags.club; },
    prep: function (l, r) {
      var s = suggest(l).slice(0, 2), rest = Object.keys(CLB).filter(function (k) { return s.indexOf(k) < 0 && k !== 'tinh_nguyen'; });
      for (var i = rest.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = rest[i]; rest[i] = rest[j]; rest[j] = t; }
      var cs = s.concat(['tinh_nguyen']).concat(rest).slice(0, 5);
      return { cs: cs, sug: s };
    },
    text: function (l, d) { return 'Đầu năm học, sân trường kín gian hàng tuyển thành viên của các câu lạc bộ, đội nhóm. ' + (d.sug.length ? 'Với ' + (l.talent ? 'sở trường ' + l.talent : 'sở thích của mình') + ', bạn hợp với ' + d.sug.map(function (k) { return CLB[k][0]; }).join(', ') + '.' : 'Bạn đi một vòng xem có chỗ nào hợp với mình.'); },
    opts: [0, 1, 2, 3, 4].map(function (i) {
      return { k: 'c' + i, l: function (l, d) { var k = d.cs[i]; return k ? 'Vào ' + CLB[k][0] : ''; }, h: function (l, d) { var k = d.cs[i]; return k && d.sug.indexOf(k) >= 0 ? 'đúng sở trường, sở thích' : k === 'tinh_nguyen' ? 'đi tình nguyện, giúp đỡ cộng đồng' : ''; }, req: function (l, d) { return !!d.cs[i]; },
        ai: function (l, d) { var k = d && d.cs[i]; return k && d.sug.indexOf(k) >= 0 ? 2 : 0.6; },
        run: function (l, r, log, d) { var k = d.cs[i]; l.flags.club = k; l.flags.clubFit = d.sug.indexOf(k) >= 0; log('Đăng ký vào ' + CLB[k][0] + '. Buổi sinh hoạt đầu tiên làm quen được cả chục người bạn mới.', 'good'); fx(l, { soc: 4, hap: 3 }); } };
    }).concat([{ k: 'khong', l: 'Không tham gia, tập trung học và đi làm thêm', ai: 0.5, run: function (l, r, log) { l.flags.club = 'none'; log('Không vào câu lạc bộ nào, dành thời gian cho việc học và làm thêm.', 'neutral'); fx(l, { kno: 2 }); } }])
  });
  T('clb_chon', function (l) { return inUni(l) && !l.flags.club; }, 0.85, 1, 1);
  SC('clb_su_kien', {
    title: function (l) { return CLB[l.flags.club][0]; }, valid: function (l) { return inUni(l) && !!CLB[l.flags.club]; },
    prep: function (l, r) { var C = CLB[l.flags.club], u = (l.flags.clubUsed = l.flags.clubUsed || []); var ids = [0, 1, 2].filter(function (i) { return u.indexOf(i) < 0; }); if (!ids.length) { u.length = 0; ids = [0, 1, 2]; } var i = pick(r, ids); u.push(i); return { t: C[1][i], lead: !l.flags.clubLead && (l.flags.clubN || 0) >= 2 }; },
    text: function (l, d) { return 'Câu lạc bộ tổ chức ' + d.t + '.' + (d.lead ? ' Chủ nhiệm câu lạc bộ sắp ra trường, mọi người đề cử bạn lên thay.' : ''); },
    opts: [
      { k: 'het_minh', l: function (l, d) { return d.lead ? 'Nhận làm chủ nhiệm, dẫn dắt cả câu lạc bộ' : 'Tham gia hết mình'; }, ai: { w: 1.2, soc: 0.8 }, run: function (l, r, log, d) {
        l.flags.clubN = (l.flags.clubN || 0) + 1; fx(l, { soc: 3, hap: 3 });
        if (d.lead) { l.flags.clubLead = true; log('Trở thành chủ nhiệm ' + CLB[l.flags.club][0] + ' — học được cách tổ chức, lãnh đạo, xin tài trợ.', 'good'); fx(l, { kno: 2, soc: 3 }); H.mem(l, 'Năm làm chủ nhiệm ' + CLB[l.flags.club][0] + '.', 3); }
        else log(U.cap(d.t) + ' thành công tốt đẹp. ' + pick(r, ['Cả nhóm thức trắng mấy đêm chuẩn bị, xong việc ôm nhau cười.', 'Ảnh của câu lạc bộ được trường đăng lên fanpage.', 'Bạn được khen là thành viên nhiệt tình nhất.']), 'good');
        if (l.flags.clubFit) l.skill = Math.min(100, (l.skill || 20) + 2);
        if (l.flags.club === 'tinh_nguyen') fx(l, { karma: 3 });
        if (!l.partner && ch(r, 0.12) && E.DEC.love) { var lv = E.DEC.love.make(l, r, { where: 'trong câu lạc bộ' }); l.pending.unshift(lv); }
      } },
      { k: 'ban', l: 'Bận học, xin vắng lần này', ai: { w: 0.6, smart: 0.5 }, run: function (l, r, log) { log('Bận ôn thi nên xin vắng buổi của câu lạc bộ.', 'neutral'); fx(l, { kno: 1 }); } },
      { k: 'roi', l: 'Rời câu lạc bộ', ai: { w: 0.15 }, run: function (l, r, log) { log('Rời ' + CLB[l.flags.club][0] + ' vì không còn hứng thú.', 'neutral'); l.flags.club = 'none'; } }
    ]
  });
  RT('clb_su_kien', function (l) { return inUni(l) && !!CLB[l.flags.club]; }, 0.3);
  var SINGERS = ['Hòa Minzy', 'Đen Vâu', 'tlinh', 'HIEUTHUHAI', 'Bích Phương', 'Văn Mai Hương', 'Erik', 'Đức Phúc', 'MONO', 'Orange', 'Vũ.', 'Phương Mỹ Chi', 'Hà Anh Tuấn', 'Soobin', 'Tăng Duy Tân', 'Hoàng Thùy Linh'];
  SC('khai_giang', {
    title: 'Lễ khai giảng năm học mới', valid: function (l) { return inUni(l); },
    prep: function (l, r) { var u = (l.flags.kgSeen = l.flags.kgSeen || []); var s = SINGERS.filter(function (x) { return u.indexOf(x) < 0; }); var x = pick(r, s.length ? s : SINGERS); u.push(x); return { s: x, first: !l.flags.kgFirst }; },
    text: function (l, d) { return (d.first ? 'Lễ khai giảng đầu tiên của đời tân sinh viên. ' : 'Lễ khai giảng năm học mới. ') + 'Sau phần nghi lễ, trường mời ' + d.s + ' về biểu diễn. Vé miễn phí cho sinh viên, phát qua đoàn hội từng khoa.'; },
    opts: [
      { k: 'som', l: 'Đi từ sớm giành chỗ đứng sát sân khấu', ai: { w: 0.8 }, run: function (l, r, log, d) { l.flags.kgFirst = true; fx(l, { hap: 5, soc: 2 }); log(ch(r, 0.25) ? 'Đứng hàng đầu, được ' + d.s + ' bắt tay và chụp chung một tấm ảnh. Đăng lên mạng cả trường thả tim.' : 'Chen chúc từ chiều mới có chỗ gần sân khấu. ' + d.s + ' hát bài nào cả sân trường hát theo bài đó.', 'good'); if (ch(r, 0.25)) H.mem(l, 'Đêm khai giảng được chụp ảnh cùng ' + d.s + '.', 3); } },
      { k: 'di', l: 'Đi xem cùng nhóm bạn', ai: { w: 1.2, soc: 0.8 }, run: function (l, r, log, d) { l.flags.kgFirst = true; fx(l, { hap: 4, soc: 3 }); log('Cùng nhóm bạn đi xem ' + d.s + ' diễn ở lễ khai giảng, quẩy đến khản cổ.', 'good'); } },
      { k: 'khong', l: 'Không đi, ở nhà / đi làm thêm', ai: { w: 0.5 }, run: function (l, r, log, d) { l.flags.kgFirst = true; log('Không đi xem ' + d.s + ' ở lễ khai giảng, xem lại clip bạn bè đăng trên mạng.', 'neutral'); } }
    ]
  });
  RT('khai_giang', function (l, a) { return inUni(l) && isVN(l) && l.flags.kgAt !== a && !(l.abroad && l.abroad.study); }, 0.45);
  var kg0 = E.DEC.khai_giang.apply; E.DEC.khai_giang.apply = function (l) { l.flags.kgAt = l.age; return kg0.apply(this, arguments); };

  // ===================================================================
  // 5. BỆNH TẬT & DỊ ỨNG
  // ===================================================================
  function medPay(l, tr, why, log) {
    var x = V(l, tr);
    if (!l.indep && l.age < 18) { log((parent(l) ? U.cap(parent(l)) : 'Gia đình') + ' lo toàn bộ viện phí ' + mo(l, x) + '.', 'neutral'); return; }
    H.cash(l, -x, why);
    if (E.hasBHYT && E.hasBHYT(l)) { var b = x * (isVN(l) ? 0.7 : 0.75); H.cash(l, b, isVN(l) ? 'BHYT chi trả viện phí' : 'Bảo hiểm y tế chi trả'); }
  }
  function tropical(l) { return isVN(l) || /^(TH|ID|PH|MY|KH|LA|MM|IN|BD|LK|BR|MX|CO|PE|NG)$/.test(l.abroad && l.abroad.perm ? l.abroad.code : l.country); }
  SC('ruot_thua', {
    title: 'Cơn đau bụng dữ dội', text: 'Đang đêm, bụng đau quặn quanh rốn rồi lan xuống hố chậu phải, sốt nhẹ, buồn nôn. Ấn vào là đau điếng.',
    opts: [
      { k: 'vien', l: 'Vào viện cấp cứu ngay', ai: { w: 1.6, smart: 1 }, run: function (l, r, log) { log('Bác sĩ chẩn đoán viêm ruột thừa cấp, mổ nội soi ngay trong đêm. Ba ngày sau được xuất viện, còn ba vết sẹo nhỏ trên bụng.', 'neutral'); medPay(l, 12, 'Mổ ruột thừa', log); fx(l, { hea: -4 }); H.mem(l, 'Ca mổ ruột thừa cấp cứu năm ' + l.age + ' tuổi.', 2); } },
      { k: 'cho', l: 'Uống thuốc giảm đau, chờ sáng xem sao', ai: { w: 0.4, risk: 1 }, run: function (l, r, log) { if (ch(r, 0.55)) { log('Đến trưa hôm sau mới vào viện — ruột thừa đã vỡ, viêm phúc mạc. Phải mổ mở, nằm viện hơn hai tuần.', 'bad'); medPay(l, 35, 'Mổ viêm phúc mạc', log); fx(l, { hea: -14, hap: -5 }); if (ch(r, 0.02)) H.kill(l, 'viêm phúc mạc do vỡ ruột thừa', log); } else { log('Sáng ra vẫn đau, vào viện kịp lúc, mổ nội soi.', 'neutral'); medPay(l, 12, 'Mổ ruột thừa', log); fx(l, { hea: -5 }); } } }
    ]
  });
  T('ruot_thua', function (l, a) { return a >= 6 && a <= 60 && !l.flags.appendix; }, 0.0016, 4, 1);
  var rt1 = E.DEC.ruot_thua.apply; E.DEC.ruot_thua.apply = function (l) { l.flags.appendix = true; return rt1.apply(this, arguments); };
  SC('sot_xuat_huyet', {
    title: 'Sốt xuất huyết', text: function (l) { return 'Mùa mưa, khu ' + (l.urban ? 'trọ' : 'xóm') + ' có nhiều ca sốt xuất huyết. Bạn sốt cao 40 độ ba ngày liền, người mỏi rã, trên tay nổi chấm đỏ.'; },
    opts: [
      { k: 'vien', l: 'Nhập viện theo dõi', ai: { w: 1.5, smart: 1 }, run: function (l, r, log) { log('Nhập viện, tiểu cầu tụt còn 30.000, phải truyền dịch, theo dõi sát giai đoạn nguy hiểm. Một tuần sau mới ổn.', 'neutral'); medPay(l, 6, 'Điều trị sốt xuất huyết', log); fx(l, { hea: -6 }); } },
      { k: 'nha', l: 'Mua thuốc hạ sốt, tự truyền dịch ở nhà', ai: { w: 0.4, risk: 1 }, run: function (l, r, log) { if (ch(r, 0.3)) { log('Ngày thứ năm hết sốt nhưng lại lả đi, chảy máu chân răng — sốc sốt xuất huyết. Người nhà đưa đi cấp cứu, nằm hồi sức mấy ngày.', 'bad'); medPay(l, 20, 'Cấp cứu sốc sốt xuất huyết', log); fx(l, { hea: -15 }); if (ch(r, 0.03)) H.kill(l, 'sốc sốt xuất huyết', log); } else { log('May mắn qua khỏi, nhưng bác sĩ bảo truyền dịch ở nhà rất nguy hiểm.', 'neutral'); fx(l, { hea: -7 }); } } }
    ]
  });
  T('sot_xuat_huyet', function (l, a) { return a >= 3 && tropical(l); }, 0.008, 6, 2);
  EV(function (l, a) { return a >= 1 && a <= 12 && !l.flags.thuyDau; }, 0.025, function (l, a, r, log) { l.flags.thuyDau = true; log('Bị thủy đậu, nổi mụn nước khắp người, phải nghỉ học ở nhà hai tuần. ' + U.cap(parent(l) || 'bà') + ' dặn không được gãi kẻo để sẹo.', 'neutral'); H.fx(l, { hea: -2 }); });
  EV(function (l, a) { return a >= 1 && a <= 5 && tropical(l) && !l.flags.tcm; }, 0.03, function (l, a, r, log) { l.flags.tcm = true; log('Bị tay chân miệng, lở loét trong miệng, sốt mấy ngày, ăn gì cũng khóc.', 'neutral'); H.fx(l, { hea: -2 }); });
  EV(function (l, a) { return a >= 5; }, 0.02, function (l, a, r, log) { log(pick(r, ['Bị sốt siêu vi, sốt cao, đau nhức người gần một tuần.', 'Dính đợt sốt siêu vi đang lan rộng, nằm bẹp mấy ngày.', 'Sốt siêu vi mùa giao mùa, uống hạ sốt, ăn cháo cả tuần.']), 'neutral'); H.fx(l, { hea: -2 }); }, 4);
  EV(function (l, a) { return a >= 28 && a <= 65 && !l.flags.soiThan; }, 0.004, function (l, a, r, log) { l.flags.soiThan = true; log('Đau quặn thắt lưng lan xuống bụng dưới — sỏi thận. Phải tán sỏi bằng sóng xung kích, bác sĩ dặn uống nhiều nước.', 'bad'); medPay(l, 8, 'Tán sỏi thận', log); H.fx(l, { hea: -4 }); });
  EV(function (l, a) { return a >= 18 && a <= 60 && !l.flags.daDay && (l.mind && l.mind.stress > 50 || l.flags.party || l.job); }, 0.008, function (l, a, r, log) { l.flags.daDay = true; log('Ăn uống thất thường, căng thẳng kéo dài, bị viêm loét dạ dày. Nội soi xong, bác sĩ dặn bỏ cà phê lúc đói, ăn đúng bữa.', 'neutral'); medPay(l, 2, 'Nội soi, điều trị dạ dày', log); H.fx(l, { hea: -3 }); });
  // dị ứng
  var ALG = [['tôm, cua và hải sản có vỏ', 'hải sản', 3], ['cá', 'cá', 1], ['đậu phộng', 'đậu phộng', 1.2], ['sữa bò', 'sữa', 0.8], ['phấn hoa, bụi nhà', 'bụi', 1.5], ['thuốc kháng sinh nhóm penicillin', 'thuốc', 0.7], ['trứng', 'trứng', 0.6]];
  EV(function (l, a) { return a >= 2 && a <= 40 && !l.allergy && !l.flags.algNo; }, function (l) { return l.flags.algSeed == null ? (l.flags.algSeed = U.rand({ rs: l.rs ^ 0x51a7 }) < 0.1 ? 1 : 0) && 0.25 : l.flags.algSeed ? 0.25 : 0; }, function (l, a, r, log) {
    var x = U.wpick(r, ALG, function (x) { return x[2]; }); l.allergy = x[0];
    log(x[1] === 'thuốc' ? 'Uống kháng sinh xong thì nổi mẩn khắp người, khó thở — bác sĩ kết luận dị ứng ' + x[0] + '. Từ đó đi khám đâu cũng phải dặn trước.' : x[1] === 'bụi' ? 'Hắt hơi, ngứa mắt liên tục mỗi khi trời trở gió — đi khám mới biết bị dị ứng ' + x[0] + '.' : 'Ăn xong bữa cơm thì người nổi mề đay, môi sưng vù — bị dị ứng ' + x[0] + '. Từ đó phải kiêng hẳn.', 'bad');
    H.fx(l, { hea: -3 }); H.mem(l, 'Lần đầu biết mình bị dị ứng ' + x[0] + '.', 2);
  });
  E.allergyOf = function (l) { return l.allergy || null; };
  SC('di_ung_tai_phat', {
    title: 'Bữa tiệc có món lạ', valid: function (l) { return !!l.allergy && !/phấn hoa|penicillin/.test(l.allergy); },
    prep: function (l, r) { return { w: l.age < 18 ? pick(r, ['sinh nhật bạn', 'liên hoan lớp']) : pick(r, ['ăn cưới', 'liên hoan công ty', 'ăn giỗ bên họ hàng']) }; },
    text: function (l, d) { return 'Đi ' + d.w + ', mâm cỗ toàn món ngon nhưng có món nấu với ' + l.allergy.split(',')[0] + ' — thứ bạn bị dị ứng.'; },
    opts: [
      { k: 'kieng', l: 'Kiêng hẳn, chỉ ăn món khác', ai: { w: 1.6, smart: 1 }, run: function (l, r, log) { log('Kiêng món đó, ăn món khác. Bạn bè trêu "phí của giời", nhưng an toàn là trên hết.', 'neutral'); } },
      { k: 'thu', l: 'Ăn thử một ít, chắc không sao', ai: { w: 0.3, risk: 1.2 }, run: function (l, r, log) { if (ch(r, 0.7)) { log('Mười phút sau người nổi mẩn đỏ, khó thở, phải đi cấp cứu tiêm thuốc chống dị ứng.', 'bad'); medPay(l, 1.5, 'Cấp cứu dị ứng', log); fx(l, { hea: -6 }); if (ch(r, 0.01)) H.kill(l, 'sốc phản vệ', log); } else log('May mà lần này chỉ ngứa ngáy một chút.', 'neutral'); } }
    ]
  });
  T('di_ung_tai_phat', function (l, a) { return !!l.allergy && a >= 6; }, 0.06, 6, 2);

  // ===================================================================
  // 6. CON ĐƯỜNG XẤU: CÁI GIÁ PHẢI TRẢ
  // ===================================================================
  function crime(l) { return !!(E.isCrime && E.isCrime(l)); }
  function quitCrime(l, log, t) { l.lastJob = l.job; l.job = null; l.flags.needJob = true; l.flags.leftCrime = l.age; fx(l, { karma: 8 }); log(t || 'Rửa tay gác kiếm, bỏ hẳn con đường cũ.', 'big'); H.mem(l, 'Ngày quyết định bỏ con đường tội lỗi.', 6); }
  E.quitCrime = quitCrime;
  SC('toi_dan_em', {
    title: 'Đàn em trở mặt', prep: function (l, r) { return { n: H.stranger(l, r, 'M').split(' ').pop(), x: Math.round(30 + r() * 120), tip: ch(r, 0.4) }; },
    valid: function (l) { return crime(l); },
    text: function (l, d) { return d.tip ? 'Thằng ' + d.n + ' — đàn em thân tín nhất, ăn chung mâm bao năm — bị bắt rồi khai hết đường dây, chỉ đích danh bạn để được giảm án.' : 'Thằng ' + d.n + ' — đàn em thân tín nhất — ôm trọn ' + mo(l, V(l, d.x)) + ' tiền hàng bỏ trốn, khóa luôn số điện thoại.'; },
    opts: [
      { k: 'tra_thu', l: 'Cho người truy lùng, "dạy cho nó một bài học"', ai: { bad: 1.4, risk: 1 }, run: function (l, r, log, d) { fx(l, { karma: -8 }); if (ch(r, 0.45)) H.jail(l, U.randint(r, 3, 7), 'cố ý gây thương tích', log); else log('Tìm được ' + d.n + ', đánh nó một trận nhừ tử. Từ đó trong băng ai cũng sợ, nhưng không ai còn thật lòng.', 'bad'); if (d.tip && !inJail(l) && ch(r, 0.5)) H.jail(l, U.randint(r, 4, 9), 'tổ chức hoạt động phạm pháp', log); } },
      { k: 'chiu', l: d0('Ngậm đắng nuốt cay, coi như mất'), ai: { w: 1 }, run: function (l, r, log, d) { if (!d.tip) H.cash(l, -Math.min(V(l, d.x), Math.max(0, l.money)), 'Bị đàn em cuỗm tiền'); else if (ch(r, 0.55)) H.jail(l, U.randint(r, 3, 8), 'tổ chức hoạt động phạm pháp', log); fx(l, { hap: -8 }); log('Trong giới này, chẳng ai là anh em thật. Bài học đắt giá.', 'bad'); } },
      { k: 'bo', l: 'Bỏ hẳn, ra đầu thú khai báo thành khẩn', ai: { w: 0.6, smart: 1 }, run: function (l, r, log) { if (ch(r, 0.6)) H.jail(l, U.randint(r, 1, 3), 'tham gia hoạt động phạm pháp (đầu thú, được giảm nhẹ)', log); quitCrime(l, log, 'Ra đầu thú, khai báo thành khẩn. Cán bộ điều tra ghi nhận thái độ, đề nghị giảm nhẹ.'); } }
    ]
  });
  function d0(s) { return s; }
  T('toi_dan_em', function (l) { return crime(l); }, 0.18, 4, 2);
  SC('toi_cuop_nguoi_yeu', {
    title: 'Mất người thương vào tay kẻ khác', valid: function (l) { return crime(l) && !!l.partner; },
    prep: function (l, r) { return { n: pick(r, ['Hùng "sẹo"', 'Tâm "đen"', 'Long "rồng"', 'Quân "điên"', 'Phát "mập"']) }; },
    text: function (l, d) { return 'Những tháng bạn đi "công chuyện" biền biệt, ' + l.partner.name + ' một mình ở nhà. Giờ cả giới đồn ' + l.partner.name + ' đã theo ' + d.n + ' — đại ca băng đối thủ, giàu hơn, "chịu chơi" hơn.'; },
    opts: [
      { k: 'danh', l: 'Kéo người sang "nói chuyện" với ' + 'băng kia', ai: { bad: 1.2, risk: 1.2 }, run: function (l, r, log, d) { log('Hai băng hỗn chiến. ' + l.partner.name + ' vẫn bỏ đi, còn bạn mang thêm mấy vết chém.', 'bad'); H.endPartner(l, log, 'split'); l.exes++; fx(l, { hea: -15, hap: -10, karma: -6 }); if (ch(r, 0.4)) H.jail(l, U.randint(r, 2, 6), 'gây rối trật tự công cộng, cố ý gây thương tích', log); else if (ch(r, 0.05)) H.kill(l, 'bị chém trong một vụ hỗn chiến', log); } },
      { k: 'buong', l: 'Buông tay', ai: { w: 1 }, run: function (l, r, log) { log('Buông tay. Ngồi một mình trong quán nhậu, hiểu ra: sống bằng dao búa thì người thương cũng chẳng giữ nổi.', 'bad'); H.endPartner(l, log, 'split'); l.exes++; fx(l, { hap: -12 }); } },
      { k: 'giu', l: 'Hứa bỏ nghề để níu kéo', ai: { w: 0.6 }, run: function (l, r, log) { if (ch(r, 0.4)) { log(l.partner.name + ' khóc, cho bạn một cơ hội cuối.', 'good'); quitCrime(l, log); } else { log(l.partner.name + ' lắc đầu: "Anh hứa câu đó cả chục lần rồi."', 'bad'); H.endPartner(l, log, 'split'); l.exes++; fx(l, { hap: -10 }); } } }
    ]
  });
  T('toi_cuop_nguoi_yeu', function (l) { return crime(l) && !!l.partner; }, 0.1, 6, 1);
  SC('toi_tra_thu', {
    title: 'Bị trả thù', valid: function (l) { return crime(l); },
    text: 'Băng đối thủ cho người phục kích bạn trên đường về. Một chiếc xe máy áp sát, ánh dao loé lên trong đêm.',
    opts: [
      { k: 'chay', l: 'Bỏ chạy, sau đó trốn đi tỉnh khác', ai: { w: 1 }, run: function (l, r, log) { fx(l, { hea: -6, hap: -6 }); log('Thoát chết trong gang tấc, phải bỏ đi nơi khác lánh nạn mấy tháng.', 'bad'); stress(l, 15); } },
      { k: 'danh', l: 'Đánh trả', ai: { bad: 1, risk: 1.3 }, run: function (l, r, log) { if (ch(r, 0.06)) { H.kill(l, 'bị băng nhóm đối thủ thanh toán', log); return; } fx(l, { hea: -18 }); log('Đánh trả, bị chém mấy nhát, nằm viện cả tháng. ' + (parent(l) ? U.cap(parent(l)) + ' ngồi bên giường khóc suốt.' : ''), 'bad'); if (ch(r, 0.3)) H.jail(l, U.randint(r, 2, 5), 'cố ý gây thương tích', log); } },
      { k: 'khai', l: 'Đến công an trình báo, khai luôn đường dây', ai: { w: 0.5, smart: 1 }, run: function (l, r, log) { log('Đến công an trình báo. Băng đối thủ bị triệt phá, bạn được ghi nhận thành khẩn, hợp tác.', 'neutral'); if (ch(r, 0.4)) H.jail(l, U.randint(r, 1, 2), 'tham gia hoạt động phạm pháp (được giảm nhẹ vì tự thú)', log); quitCrime(l, log); } }
    ]
  });
  T('toi_tra_thu', function (l) { return crime(l); }, 0.1, 5, 2);
  SC('toi_me_khoc', {
    title: function (l) { return U.cap(parent(l)) + ' khóc'; }, valid: function (l) { return crime(l) && !!parent(l); },
    text: function (l) { return U.cap(parent(l)) + ' biết chuyện bạn làm, nắm tay bạn mà khóc: "' + (l.fam.q <= 2 ? 'Nhà mình nghèo nhưng chưa ai phải ngồi tù.' : 'Nhà mình chưa ai phải ngồi tù.') + ' Con bỏ đi, ' + parent(l) + ' xin con."'; },
    opts: [
      { k: 'bo', l: 'Hứa và bỏ thật', ai: { w: 0.9 }, run: function (l, r, log) { quitCrime(l, log, 'Nghe ' + parent(l) + ' khóc, bạn quyết định bỏ hẳn con đường cũ, đi làm lại từ đầu.'); fx(l, { hap: 4 }); } },
      { k: 'hua', l: 'Hứa cho ' + 'xong chuyện, vẫn làm tiếp', ai: { w: 1, bad: 0.5 }, run: function (l, r, log) { fx(l, { karma: -4, hap: -4 }); log('Hứa cho qua chuyện. Đêm đó ' + parent(l) + ' thức trắng.', 'bad'); } }
    ]
  });
  T('toi_me_khoc', function (l) { return crime(l) && !!parent(l); }, 0.12, 5, 2);
  SC('toi_con_xa_lanh', {
    title: 'Con bị bạn bè xa lánh', valid: function (l) { return crime(l) && (l.kids || []).some(function (k) { return k.alive && l.age - k.born >= 6 && l.age - k.born <= 17; }); },
    text: 'Con đi học về khóc: các bạn không chơi cùng, phụ huynh dặn con mình "tránh xa nó ra, bố nó là dân xã hội đen".',
    opts: [
      { k: 'bo', l: 'Vì con, bỏ nghề', ai: { w: 0.9 }, run: function (l, r, log) { quitCrime(l, log, 'Nhìn con khóc, bạn quyết định bỏ hẳn con đường cũ.'); } },
      { k: 'chuyen', l: 'Cho con chuyển trường', ai: { w: 1 }, run: function (l, r, log) { H.cash(l, -V(l, 10), 'Chuyển trường cho con'); log('Cho con chuyển trường. Nhưng tiếng xấu thì đi theo đến tận trường mới.', 'bad'); (l.kids || []).forEach(function (k) { if (k.alive) k.close = Math.max(0, (k.close || 50) - 6); }); fx(l, { hap: -5 }); } }
    ]
  });
  T('toi_con_xa_lanh', function (l) { return crime(l) && (l.kids || []).some(function (k) { return k.alive && l.age - k.born >= 6 && l.age - k.born <= 17; }); }, 0.15, 5, 1);
  SC('toi_truy_na', {
    title: 'Lệnh truy nã', valid: function (l) { return crime(l); },
    text: 'Đồng bọn bị bắt cả loạt. Công an phát lệnh truy nã, ảnh bạn dán ở trụ sở phường.',
    opts: [
      { k: 'dau_thu', l: 'Ra đầu thú', ai: { w: 0.8, smart: 1 }, run: function (l, r, log) { H.jail(l, U.randint(r, 2, 5), 'phạm tội (ra đầu thú, được giảm nhẹ)', log); quitCrime(l, log, 'Ra đầu thú. Bản án nhẹ hơn nhiều so với đồng bọn.'); } },
      { k: 'tron', l: 'Bỏ trốn', ai: { w: 1, risk: 1 }, run: function (l, r, log) { if (ch(r, 0.65)) { log('Trốn được nửa năm thì bị bắt ở một nhà nghỉ ven quốc lộ.', 'bad'); H.jail(l, U.randint(r, 6, 12), 'phạm tội, bỏ trốn khi bị truy nã', log); } else { log('Trốn chui trốn lủi khắp nơi, đêm nào cũng giật mình vì tiếng còi xe.', 'bad'); stress(l, 25); fx(l, { hap: -12, hea: -6 }); } } }
    ]
  });
  T('toi_truy_na', function (l) { return crime(l) && (l.job && l.job.yrs >= 2); }, 0.06, 5, 1);
  SC('toi_ma_tuy', {
    title: 'Thử "hàng"', valid: function (l) { return crime(l) && !(l.addict && l.addict.drugs); },
    text: 'Trong cuộc vui sau một phi vụ trót lọt, cả nhóm bày "hàng" ra bàn: "Thử đi, một lần cho biết."',
    opts: [
      { k: 'khong', l: 'Từ chối dứt khoát', ai: { w: 1.4, smart: 1 }, run: function (l, r, log) { log('Từ chối. Mấy đứa cười khẩy, nhưng bạn biết dính vào thứ này là hết đường quay lại.', 'good'); } },
      { k: 'thu', l: 'Thử một lần', ai: { w: 0.4, risk: 1.5 }, run: function (l, r, log) { if (ch(r, 0.6)) { (l.addict = l.addict || {}).drugs = true; log('Một lần thành trăm lần. Bạn nghiện lúc nào không hay.', 'bad'); fx(l, { hea: -10, hap: -6 }); } else log('Thử một lần, nôn thốc nôn tháo, sợ đến già.', 'neutral'); } }
    ]
  });
  T('toi_ma_tuy', function (l) { return crime(l); }, 0.08, 6, 1);
  // ra tù rồi vẫn bị kéo lại
  SC('tu_cu_ru', {
    title: 'Bạn tù cũ tìm đến', valid: function (l) { return !!l.record && !crime(l); },
    prep: function (l, r) { return { n: H.stranger(l, r, 'M').split(' ').pop(), x: Math.round(20 + r() * 60) }; },
    text: function (l, d) { return d.n + ' — bạn cùng buồng giam năm xưa — tìm đến: "Có phi vụ này ngon lắm, làm một lần được ' + mo(l, V(l, d.x)) + ', ai biết đâu mà sợ."'; },
    opts: [
      { k: 'khong', l: 'Từ chối, đã hứa làm lại cuộc đời', ai: { w: 1.4 }, run: function (l, r, log, d) { log('Từ chối thẳng. ' + d.n + ' bỏ về, buông một câu: "Rồi mày cũng quay lại thôi."', 'good'); fx(l, { karma: 4 }); } },
      { k: 'lam', l: 'Làm một lần thôi', ai: { bad: 1.2, risk: 1 }, run: function (l, r, log, d) { fx(l, { karma: -8 }); if (ch(r, 0.45)) H.jail(l, U.randint(r, 3, 8), 'tái phạm', log); else { H.cash(l, V(l, d.x), 'Tiền phi vụ'); log('Phi vụ trót lọt. Cầm tiền mà tay run.', 'bad'); } } }
    ]
  });
  T('tu_cu_ru', function (l) { return released(l) && !crime(l); }, 0.2, 3, 2);

  // ===================================================================
  // 7. TRONG TÙ: CUỘC SỐNG CHỈ XOAY QUANH TRẠI GIAM
  // ===================================================================
  function PJ(id, title, text, opts, valid) { SC(id, { title: title, text: text, valid: function (l) { return inJail(l) && (!valid || valid(l)); }, opts: opts.map(function (o) { return { k: o[0], l: o[1], ai: o[2], run: o[3], req: o[4] }; }) }); }
  function pts(l, x) { l.flags.jailPts = (l.flags.jailPts || 0) + x; }
  function cutYear(l, log, why) { if (l.jailUntil - l.age > 1) { l.jailUntil--; log(why + ' Được giảm một năm án.', 'good'); return true; } return false; }
  PJ('tg_tham_nuoi', 'Ngày thăm nuôi', function (l) { var w = l.partner ? l.partner.name : parent(l) || 'người nhà'; return 'Ngày thăm nuôi. ' + U.cap(w) + ' lặn lội đường xa, mang theo túi đồ ăn, mấy bộ quần áo. Hai bên nói chuyện qua tấm kính.'; }, [
    ['hua', 'Hứa sẽ cải tạo tốt để sớm về', { w: 1.3 }, function (l, r, log) { fx(l, { hap: 4 }); pts(l, 1); log('Nắm tay qua song sắt, hứa sẽ cải tạo tốt. Người nhà về rồi, bạn ngồi lặng cả buổi chiều.', 'good'); }],
    ['dung_len', 'Dặn đừng lên thăm nữa, tốn kém, xấu hổ', { w: 0.5 }, function (l, r, log) { fx(l, { hap: -4 }); log('Bảo người nhà đừng lên nữa. Lời nói ra mà lòng đau như cắt.', 'bad'); }]], function (l) { return !!(l.partner || parent(l)); });
  PJ('tg_dai_ca', 'Luật buồng giam', 'Một "đại ca" trong buồng giam bắt người mới phải nộp đồ thăm nuôi, giặt quần áo, nhường chỗ nằm.', [
    ['nop', 'Nhịn, nộp đồ cho yên', { w: 1 }, function (l, r, log) { fx(l, { hap: -5 }); log('Nhịn cho yên thân. Mỗi lần thăm nuôi, túi đồ chỉ còn một nửa.', 'neutral'); }],
    ['bao', 'Báo cán bộ quản giáo', { w: 0.9, smart: 1 }, function (l, r, log) { if (ch(r, 0.7)) { log('Cán bộ quản giáo chuyển "đại ca" sang buồng khác, kỷ luật. Buồng giam yên hẳn.', 'good'); pts(l, 1); } else { log('Báo cán bộ, nhưng bị cả nhóm kia trù dập suốt mấy tháng.', 'bad'); fx(l, { hea: -5, hap: -5 }); } }],
    ['danh', 'Đánh nhau để giữ "vị trí"', { risk: 1.2, w: 0.5 }, function (l, r, log) { fx(l, { hea: -8, karma: -4 }); if (ch(r, 0.4)) { l.jailUntil++; log('Đánh nhau trong buồng giam, bị kỷ luật, tăng thêm án một năm.', 'bad'); } else log('Đánh nhau một trận, từ đó không ai dám động vào bạn.', 'neutral'); }]]);
  PJ('tg_lao_dong', 'Lao động cải tạo', function (l) { return 'Phân trại tổ chức lao động: ' + ['đan lát mây tre xuất khẩu', 'may quần áo bảo hộ', 'trồng rau, chăn nuôi', 'làm hàng thủ công'][l.age % 4] + '. Ai đạt chỉ tiêu được tính điểm thi đua.'; }, [
    ['cham', 'Làm chăm chỉ, vượt chỉ tiêu', { w: 1.4 }, function (l, r, log) { pts(l, 2); fx(l, { hea: 1, karma: 3 }); if (l.flags.jailPts >= 4 && ch(r, 0.5)) { cutYear(l, log, 'Liên tục đạt loại "Tốt" trong thi đua cải tạo.') || log('Vượt chỉ tiêu lao động, được khen trước toàn phân trại.', 'good'); l.flags.jailPts -= 3; } else log('Vượt chỉ tiêu lao động, được ghi tên lên bảng thi đua.', 'good'); }],
    ['loi', 'Làm cầm chừng', { w: 0.5 }, function (l, r, log) { log('Làm cầm chừng, bị nhắc nhở. Xếp loại cải tạo "Trung bình".', 'neutral'); }]]);
  PJ('tg_hoc', 'Lớp học trong trại', 'Trại mở lớp xóa mù chữ, bổ túc văn hóa và dạy nghề (mộc, may, sửa xe máy, điện dân dụng) cho phạm nhân.', [
    ['nghe', 'Học nghề sửa xe máy / điện dân dụng', { w: 1.2, smart: 0.8 }, function (l, r, log) { l.flags.jailTrade = true; pts(l, 1); fx(l, { kno: 3 }); log('Học xong nghề, được cấp chứng chỉ — sau này ra tù có cái nghề kiếm sống.', 'good'); }],
    ['van_hoa', 'Học bổ túc văn hóa', { w: 0.8 }, function (l, r, log) { l.edu = Math.max(l.edu, Math.min(3, (l.edu || 0) + 1)); pts(l, 1); fx(l, { kno: 4 }); log('Đi học bổ túc văn hóa, lần đầu sau bao năm cầm lại cây bút.', 'good'); }],
    ['khong', 'Không học', { w: 0.4 }, function (l, r, log) { log('Không đi học, chỉ ngồi đếm ngày.', 'neutral'); }]]);
  PJ('tg_tron_trai', 'Rủ trốn trại', 'Mấy người cùng buồng bàn kế hoạch trốn trại trong đêm mưa, rủ bạn đi cùng.', [
    ['khong', 'Từ chối, báo cán bộ', { w: 1.2, smart: 1 }, function (l, r, log) { pts(l, 2); log('Báo cán bộ, kế hoạch trốn trại bị phát hiện. Bạn được ghi nhận thành tích.', 'good'); if (ch(r, 0.4)) cutYear(l, log, 'Lập công trong trại giam.'); }],
    ['im', 'Từ chối, im lặng', { w: 1 }, function (l, r, log) { log('Từ chối, không nói với ai. Mấy hôm sau cả nhóm bị bắt lại ngay ngoài hàng rào.', 'neutral'); }],
    ['di', 'Trốn cùng', { risk: 1.5, w: 0.2 }, function (l, r, log) { var n = U.randint(r, 2, 4); l.jailUntil += n; fx(l, { hea: -6, hap: -8 }); log('Trốn được hai ngày thì bị bắt lại trong rừng. Bị khởi tố thêm tội trốn khỏi nơi giam, tăng ' + n + ' năm.', 'bad'); }]]);
  PJ('tg_dac_xa', 'Xét đặc xá', function (l) { return isVN(l) ? 'Nhân dịp Quốc khánh 2/9, Chủ tịch nước quyết định đặc xá. Trại lập danh sách phạm nhân đủ điều kiện: chấp hành tốt, đã chấp hành ít nhất một phần ba thời hạn.' : 'Trại xét tha tù trước thời hạn có điều kiện cho phạm nhân cải tạo tốt.'; }, [
    ['don', 'Làm đơn xin đặc xá', { w: 1.5 }, function (l, r, log) { var p = 0.15 + Math.min(0.5, (l.flags.jailPts || 0) * 0.06); if (ch(r, p)) { l.jailUntil = l.age + 1; log('Có tên trong danh sách đặc xá! Cuối năm nay được về nhà.', 'big'); H.mem(l, 'Ngày nghe đọc tên mình trong danh sách đặc xá.', 6); } else log('Không có tên trong danh sách đặc xá lần này. Tiếp tục cải tạo.', 'neutral'); }]], function (l) { return l.jailUntil - l.age >= 2 && (l.flags.jailPts || 0) >= 2; });
  PJ('tg_tet', 'Tết trong trại', 'Tết đến, trại tổ chức gói bánh chưng, văn nghệ, cho phạm nhân gọi điện về nhà. Ngoài kia pháo hoa rực trời.', [
    ['goi', 'Gọi điện về chúc Tết gia đình', { w: 1.2 }, function (l, r, log) { log('Gọi về nhà ba phút. Đầu dây bên kia ' + (parent(l) || 'người nhà') + ' khóc, bạn cũng khóc.', 'neutral'); fx(l, { hap: 2 }); }],
    ['van_nghe', 'Lên hát trong đêm văn nghệ của trại', { w: 0.8, soc: 1 }, function (l, r, log) { pts(l, 1); log('Hát bài "Xuân này con không về" trong đêm văn nghệ, cả hội trường lặng đi.', 'neutral'); fx(l, { hap: 2, soc: 2 }); }]]);
  PJ('tg_om', 'Ốm trong trại', 'Mấy hôm nay sốt cao, ho liên tục. Buồng giam chật, ẩm thấp.', [
    ['bao', 'Báo cán bộ y tế trại', { w: 1.4 }, function (l, r, log) { log('Được đưa xuống bệnh xá trại, uống thuốc vài ngày thì đỡ.', 'neutral'); fx(l, { hea: -3 }); }],
    ['chiu', 'Cố chịu', { w: 0.4 }, function (l, r, log) { fx(l, { hea: -10 }); log('Cố chịu, bệnh nặng dần, cuối cùng vẫn phải đưa đi bệnh viện.', 'bad'); }]]);
  PJ('tg_ly_hon', 'Lá đơn ly hôn', function (l) { return l.partner.name + ' gửi vào trại một lá đơn ly hôn: "' + U.cap(E.xung(l).me) + ' không đợi được nữa."'; }, [
    ['ky', 'Ký đơn, chúc người ta hạnh phúc', { w: 1 }, function (l, r, log) { log('Ký đơn ly hôn. ' + l.partner.name + ' xứng đáng có cuộc sống khác.', 'bad'); H.endPartner(l, log, 'split'); l.exes++; fx(l, { hap: -10 }); }],
    ['xin', 'Viết thư xin được chờ', { w: 0.8 }, function (l, r, log) { if (ch(r, 0.4)) { log(l.partner.name + ' đọc thư, rút đơn: "' + U.cap(E.xung(l).me) + ' đợi ' + E.xung(l).you + ' về."', 'good'); fx(l, { hap: 6 }); } else { log(l.partner.name + ' vẫn quyết ly hôn.', 'bad'); H.endPartner(l, log, 'split'); l.exes++; fx(l, { hap: -12 }); } }]], function (l) { return !!(l.partner && l.partner.status !== 'dating'); });
  PJ('tg_ban_tu', 'Lời mời của bạn tù', 'Một bạn tù sắp mãn hạn thì thầm: "Ra ngoài tìm tao, có mối làm ăn, không phải lo đói."', [
    ['nho', 'Ghi nhớ số điện thoại', { bad: 1 }, function (l, r, log) { l.flags.jailContact = true; log('Ghi nhớ số điện thoại. Biết đâu sau này cần.', 'neutral'); }],
    ['khong', 'Lắc đầu, ra tù sẽ sống lương thiện', { w: 1.3 }, function (l, r, log) { pts(l, 1); fx(l, { karma: 3 }); log('Lắc đầu từ chối. Ra ngoài sẽ làm lại từ đầu.', 'good'); }]]);
  PJ('tg_thu_con', 'Thư của con', 'Con gửi vào trại một lá thư nắn nót, kèm bức tranh vẽ cả nhà: "Bố/mẹ ơi, bao giờ bố/mẹ về?"', [
    ['doc', 'Đọc đi đọc lại, hứa sẽ về sớm', { w: 1.3 }, function (l, r, log) { fx(l, { hap: 5 }); pts(l, 1); log('Đọc lá thư của con đến nhòe cả chữ. Đêm nào cũng gối đầu lên nó.', 'good'); H.mem(l, 'Lá thư con gửi vào trại giam.', 5); }]], function (l) { return (l.kids || []).some(function (k) { return k.alive && l.age - k.born >= 6; }); });
  PJ('tg_tu_hoc', 'Thư viện trại', 'Trại có một thư viện nhỏ. Lần đầu bạn có nhiều thời gian để đọc như vậy.', [
    ['doc', 'Đọc sách mỗi ngày', { w: 1, smart: 1 }, function (l, r, log) { fx(l, { kno: 4 }); log('Đọc hết cả kệ sách, từ truyện kiếm hiệp đến sách làm giàu, sách luật.', 'good'); }],
    ['ngu', 'Chỉ ngủ cho hết ngày', { w: 0.5 }, function (l, r, log) { log('Ngày nào cũng như ngày nào.', 'neutral'); }]]);
  var JPOOL = ['tg_tham_nuoi', 'tg_dai_ca', 'tg_lao_dong', 'tg_hoc', 'tg_tron_trai', 'tg_dac_xa', 'tg_tet', 'tg_om', 'tg_ly_hon', 'tg_ban_tu', 'tg_thu_con', 'tg_tu_hoc', 'trai_giam'];
  E.jailYear = function (l, r, a) {
    var seen = (l.flags.jailSeen = l.flags.jailSeen || {});
    var pool = JPOOL.filter(function (id) { return E.DEC[id] && !seen[id] && E.DEC[id].valid(l, {}); });
    if (pool.length < 2) { l.flags.jailSeen = seen = {}; pool = JPOOL.filter(function (id) { return E.DEC[id] && E.DEC[id].valid(l, {}); }); }
    for (var i = pool.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
    if (a === (l.flags.jailAt != null ? l.flags.jailAt : a) && !seen.tg_dai_ca && pool.indexOf('tg_dai_ca') > 0) { pool.splice(pool.indexOf('tg_dai_ca'), 1); pool.unshift('tg_dai_ca'); }
    return pool.slice(0, 2).map(function (id) { seen[id] = 1; return [id]; });
  };
  var j0 = H.jail; H.jail = function (l) { l.flags.jailAt = l.age + 1; l.flags.jailPts = 0; l.flags.jailSeen = {}; return j0.apply(this, arguments); };
  // việc làm được trong trại
  function JA(id, g, label, sc, opts) { SC(sc, { title: label, valid: function (l) { return inJail(l); }, text: opts.t, opts: opts.o }); A(id, g, label, { sc: sc, jail: true, avail: function (l) { return inJail(l) ? true : 'Không áp dụng'; } }); }
  JA('tg_act_thu', 'Gia đình & bạn bè', 'Viết thư về cho gia đình', 'tg_act_thu', { t: 'Mỗi tháng được gửi thư về nhà, qua kiểm duyệt của trại.', o: [
    { k: 'xin_loi', l: 'Viết thư xin lỗi gia đình', run: function (l, r, log) { fx(l, { hap: 3, karma: 2 }); log('Viết lá thư dài xin lỗi ' + (parent(l) || 'gia đình') + '. Lần thăm nuôi sau, người nhà bảo đã đọc đi đọc lại.', 'good'); } },
    { k: 'nho', l: 'Nhờ gia đình gửi tiền lưu ký mua đồ dùng', run: function (l, r, log) { log('Nhờ gia đình gửi tiền lưu ký để mua đồ dùng cá nhân ở căng tin trại.', 'neutral'); fx(l, { hap: 1 }); } }] });
  JA('tg_act_lao_dong', 'Công việc', 'Xung phong lao động, thi đua cải tạo', 'tg_act_lao_dong', { t: 'Xung phong nhận việc nặng ở tổ lao động để lấy điểm thi đua.', o: [
    { k: 'lam', l: 'Xung phong', run: function (l, r, log) { pts(l, 2); fx(l, { hea: -1, karma: 2 }); log('Xung phong làm thêm ở tổ lao động, được cán bộ ghi nhận.', 'good'); if (l.flags.jailPts >= 6 && ch(r, 0.3)) { if (cutYear(l, log, 'Thành tích thi đua cải tạo xuất sắc.')) l.flags.jailPts -= 4; } } }] });
  JA('tg_act_hoc', 'Học tập', 'Học văn hóa, học nghề, đọc sách trong trại', 'tg_act_hoc', { t: 'Trại có lớp học văn hóa, lớp nghề và thư viện nhỏ.', o: [
    { k: 'nghe', l: 'Học nghề', run: function (l, r, log) { l.flags.jailTrade = true; fx(l, { kno: 2 }); pts(l, 1); log('Chăm chỉ học nghề trong trại.', 'good'); } },
    { k: 'sach', l: 'Đọc sách ở thư viện trại', run: function (l, r, log) { fx(l, { kno: 3, hap: 1 }); log('Đọc sách ở thư viện trại, quên mất thời gian.', 'good'); } }] });
  JA('tg_act_the_duc', 'Sức khỏe & tâm hồn', 'Tập thể dục giờ sinh hoạt', 'tg_act_the_duc', { t: 'Giờ sinh hoạt ngoài trời, phạm nhân được chạy bộ, tập thể dục, đá bóng.', o: [
    { k: 'tap', l: 'Tập thể dục đều đặn', run: function (l, r, log) { fx(l, { hea: 3, hap: 1 }); stress(l, -5); log('Sáng nào cũng chạy bộ quanh sân trại, người khỏe ra.', 'good'); } },
    { k: 'bong', l: 'Đá bóng với bạn tù', run: function (l, r, log) { fx(l, { hea: 2, soc: 2 }); log('Đá bóng giao hữu giữa các đội, vui như hồi nhỏ.', 'good'); } }] });
  JA('tg_act_goi', 'Gia đình & bạn bè', 'Gọi điện về nhà (theo quy định trại)', 'tg_act_goi', { t: 'Phạm nhân được gọi điện về nhà theo lịch của trại, mỗi lần vài phút.', o: [
    { k: 'goi', l: 'Gọi về nhà', run: function (l, r, log) { fx(l, { hap: 2 }); log('Gọi về nhà năm phút. Nghe tiếng ' + (parent(l) || 'người nhà') + ' mà nghẹn lời.', 'neutral'); } }] });

  // ===================================================================
  // 8. CHỐNG "FARM TIỀN": TÀI SẢN CÀNG LỚN CÀNG NHIỀU CHI PHÍ, LỢI SUẤT GIẢM DẦN
  // ===================================================================
  [['tai_phiet', [200, 500, 1200, 2500]], ['ngan_hang_cao', [150, 300, 600, 1200]], ['chu_dau_tu', [40, 180, 700]]].forEach(function (x) { var c = E.CAR[x[0]]; if (c && c.vn && c.vn.length === x[1].length) c.vn = x[1]; });
  function holdings(l) {
    var A = l.assets || {}, s = 0, parts = [];
    ['save', 'gold', 'stock', 'land'].forEach(function (k) { if (A[k] > 0) { s += A[k]; parts.push([A, k]); } });
    [l.port, l.coins].forEach(function (P) { if (P) Object.keys(P).forEach(function (k) { if (P[k].v > 0) { s += P[k].v; parts.push([P[k], 'v']); } }); });
    return { s: s, parts: parts };
  }
  E.WEALTH_T = 250;
  E.wealthDrag = function (l) {
    var h = holdings(l), T0 = E.WEALTH_T * l.base; if (!(h.s > T0) || !(l.base > 0)) return 0;
    var f = Math.min(0.09, 0.025 + 0.025 * Math.log10(h.s / T0)), cut = (h.s - T0) * f;
    h.parts.forEach(function (p) { p[0][p[1]] -= p[0][p[1]] / h.s * cut; });
    if (l.basis) Object.keys(l.basis).forEach(function (k) { if (l.basis[k] > (l.assets || {})[k] && l.assets[k] >= 0) l.basis[k] = Math.max(l.assets[k], l.basis[k]); });
    if (l.money > T0) { var mc = (l.money - T0) * 0.015; l.money -= mc; cut += mc; }
    return cut;
  };
  E.HOOKS.year.push(function (l, r, log, a) {
    if (!l.alive) return;
    var cut = E.wealthDrag(l);
    if (cut > 0 && (l.flags.dragLog == null || a - l.flags.dragLog >= 6)) { l.flags.dragLog = a; log('Khối tài sản lớn kéo theo đủ thứ chi phí: thuế, phí quản lý quỹ, bảo trì nhà đất, nhân sự, an ninh… Mỗi năm hao đi khoảng ' + mo(l, cut) + '.', 'neutral'); }
  });

  // ===================================================================
  // 9. ĐỔI TÔN GIÁO
  // ===================================================================
  var REL_VN = ['Phật giáo', 'Công giáo', 'Tin Lành', 'Cao Đài', 'Phật giáo Hòa Hảo', 'Hồi giáo (Islam)', 'Không theo tôn giáo (thờ cúng tổ tiên)'];
  var REL_W = ['Kitô giáo', 'Hồi giáo', 'Phật giáo', 'Hindu giáo', 'Do Thái giáo', 'Không tôn giáo'];
  function relKey(s) { s = s || ''; return /Công giáo|Kitô|Chính Thống/.test(s) ? 'cg' : /Tin Lành/.test(s) ? 'tl' : /Hòa Hảo/.test(s) ? 'hh' : /Phật/.test(s) ? 'pg' : /Cao Đài/.test(s) ? 'cd' : /Hồi/.test(s) ? 'hoi' : /Hindu/.test(s) ? 'hin' : /Do Thái/.test(s) ? 'dt' : /Bà La Môn/.test(s) ? 'blm' : 'none'; }
  SC('doi_ton_giao', {
    title: 'Tìm hiểu một tôn giáo khác',
    prep: function (l) { var me = relKey(l.religion), L = (isVN(l) && !(l.abroad && l.abroad.perm) ? REL_VN : REL_W).filter(function (x) { return relKey(x) !== me; }); return { cs: L.slice(0, 6) }; },
    text: function (l) { return 'Bạn đang ' + (/Không|Tín ngưỡng/.test(l.religion || '') ? 'không theo tôn giáo nào (' + l.religion + ')' : 'theo ' + l.religion) + '. Gần đây bạn tìm hiểu một con đường tâm linh khác. Đổi tôn giáo là chuyện lớn: thay đổi nơi sinh hoạt, ngày lễ, nếp sống, và gia đình chưa chắc đã đồng ý.'; },
    opts: [0, 1, 2, 3, 4, 5].map(function (i) {
      return { k: 'r' + i, l: function (l, d) { var x = d.cs[i]; return x ? (/Không/.test(x) ? 'Thôi theo đạo, ' + x.toLowerCase() : 'Theo ' + x) : ''; }, req: function (l, d) { return !!d.cs[i]; },
        run: function (l, r, log, d) {
          var old = l.religion, x = d.cs[i]; l.religion = x; l.flags.relChanged = (l.flags.relChanged || 0) + 1;
          var how = { cg: 'Học giáo lý ở nhà thờ giáo xứ rồi chịu phép Rửa tội, nhận tên thánh.', tl: 'Tin nhận Chúa, chịu phép Báp-têm ở hội thánh.', pg: 'Làm lễ quy y Tam Bảo ở chùa, nhận pháp danh.', hh: 'Thờ đức Huỳnh Giáo chủ, tu tại gia theo đạo Hòa Hảo.', cd: 'Nhập môn đạo Cao Đài, mặc áo dài trắng đi cúng ở thánh thất.', hoi: 'Đọc lời tuyên xưng đức tin, theo đạo Hồi, học cầu nguyện mỗi ngày.', hin: 'Theo Hindu giáo, đến đền thờ mỗi tuần.', dt: 'Học giáo luật, theo Do Thái giáo.', none: 'Thôi sinh hoạt tôn giáo, chỉ giữ việc thờ cúng ông bà tổ tiên.' }[relKey(x)];
          log('Từ ' + old + ' chuyển sang ' + x + '. ' + how, 'big'); H.mem(l, 'Ngày bắt đầu theo ' + x + '.', 4);
          if (parent(l) && relKey(old) !== 'none' && ch(r, 0.5)) { log(U.cap(parent(l)) + ' buồn mất mấy tháng, rồi cũng bảo: "Con sống tốt là được."', 'neutral'); fx(l, { hap: -3 }); } else fx(l, { hap: 3 });
        } };
    }).concat([{ k: 'giu', l: 'Giữ niềm tin hiện tại', run: function (l, r, log) { log('Tìm hiểu cho biết, vẫn giữ niềm tin của mình.', 'neutral'); } }])
  });
  A('doi_ton_giao', 'Sức khỏe & tâm hồn', 'Tìm hiểu / đổi tôn giáo', { min: 16, sc: 'doi_ton_giao' });

  // ===================================================================
  // 10. GIÁ SKIN GIỚI HẠN SÁT THỰC TẾ; MỤC TÌNH CẢM; NHIỀU KIỂU HẸN HÒ HƠN
  // ===================================================================
  // skin giới hạn bậc SSS (Liên Quân): vài nghìn Quân Huy ≈ 2,4–3 triệu đồng, quay vòng may mắn có khi tốn hơn; skin thường bậc A/S vài trăm nghìn
  function skinPrice(g) { return /Liên Quân|Mobile Legends|Free Fire|PUBG/.test(g) ? 2.5 : 0.6; }
  E.skinPrice = skinPrice;
  if (E.DEC.nap_game) {
    var NG = E.DEC.nap_game.def;
    NG.text = function (l, d) { return d.g + ' vừa ra skin giới hạn, giá khoảng ' + mo(l, V(l, skinPrice(d.g))) + (/Liên Quân/.test(d.g) ? ' (vài nghìn Quân Huy, quay vòng may mắn có khi tốn hơn)' : '') + '. Cả nhóm bạn đều có, chỉ mình bạn chưa.'; };
    NG.opts.forEach(function (o) {
      if (o.k === 'beg') o.run = function (l, r, log, d) { var rich = l.fam && l.fam.q >= 4; if (rich && ch(r, 0.45)) { H.cash(l, -V(l, skinPrice(d.g)), 'Nạp game mua skin giới hạn'); log('Bố mẹ nạp cho, với điều kiện cuối kỳ phải học khá.', 'neutral'); fx(l, { hap: 3 }); } else { log(rich ? 'Bố mẹ nghe giá thì lắc đầu: "Mấy triệu cho một bộ quần áo trong game à?"' : 'Bị từ chối thẳng: "Tiền đâu mà nạp game!"', 'neutral'); fx(l, { hap: -1 }); } };
    });
    NG.opts.splice(2, 0, { k: 're', l: 'Mua skin thường rẻ hơn bằng tiền tiết kiệm', run: function (l, r, log) { H.cash(l, -V(l, 0.2), 'Mua skin thường'); log('Đập heo đất mua một skin thường vài trăm nghìn. Không giới hạn, nhưng cũng đẹp chán.', 'neutral'); fx(l, { hap: 2 }); } });
  }
  E.ACT.forEach(function (a) {
    if (a.id === 'tim_nguoi_yeu') a.avail = function (l) { return l.partner ? 'Không áp dụng' : true; };
    if (a.id === 'hen_ho') a.avail = function (l) { return l.partner ? true : 'Không áp dụng'; };
    if (a.id === 'show_hen_ho') { var sh0 = a.avail; a.avail = function (l) { return l.partner ? 'Không áp dụng' : sh0(l); }; }
  });
  var DATES2 = [
    ['concert_doi', 'Đi đu concert cùng người yêu', 2.5, 'Cùng nhau đu concert, hát theo từng bài, quay clip đến hết pin điện thoại.', { hap: 7 }],
    ['skinship', 'Ở bên nhau cả ngày: nắm tay, ôm nhau xem phim (skinship)', 0, 'Cả ngày chỉ nắm tay, ôm nhau xem phim, chẳng làm gì mà vẫn thấy hạnh phúc.', { hap: 5 }],
    ['photobooth', 'Chụp photobooth, studio ảnh Hàn Quốc', 0.15, 'Chụp mấy dải ảnh photobooth, làm đủ kiểu mặt xấu, về dán kín cửa tủ.', { hap: 4 }],
    ['cafe_meo', 'Đi cà phê mèo / cà phê chó', 0.15, 'Ngồi cà phê mèo, một bé mèo béo nằm ngủ trên đùi người ấy cả buổi.', { hap: 4 }],
    ['bien', 'Đi biển cuối tuần', 2, 'Hai ngày ở biển, sáng ngắm bình minh, tối ăn hải sản, nghe sóng vỗ.', { hap: 7, hea: 1 }],
    ['glamping', 'Cắm trại glamping, nướng BBQ', 1.2, 'Dựng lều, nướng BBQ, nằm đếm sao đến khuya.', { hap: 6 }],
    ['escape', 'Chơi escape room (phòng thoát hiểm)', 0.4, 'Giải đố thoát khỏi phòng kín, cãi nhau một trận rồi phá đảo trong phút cuối.', { hap: 5, kno: 1 }],
    ['vuon_hoa', 'Đi vườn hoa, chụp ảnh check-in', 0.1, 'Đi vườn hoa mùa nở rộ, chụp mấy trăm tấm ảnh chỉ để chọn một tấm.', { hap: 4 }],
    ['kem', 'Đi ăn kem, trà sữa, chè', 0.1, 'Ăn kem, uống trà sữa, chia nhau ly chè thập cẩm.', { hap: 3 }],
    ['xem_bong_da', 'Xem bóng đá cùng nhau ở quán', 0.2, 'Mặc áo đội tuyển, hò hét ở quán cà phê bóng đá.', { hap: 4, soc: 1 }],
    ['chua', 'Lên chùa / nhà thờ cầu bình an', 0, 'Cùng nhau đi lễ, cầu cho hai đứa bình an, sớm thành đôi.', { hap: 3, karma: 1 }],
    ['ve_que', 'Về quê người ấy ra mắt gia đình', 0.8, 'Về quê người ấy, được cả nhà đón như khách quý, bữa cơm quê đầy ắp.', { hap: 5, soc: 2 }]
  ];
  if (E.DEC.hen_ho) {
    var HH = E.DEC.hen_ho.def, PER = 8;
    DATES2.forEach(function (x) { HH.opts.splice(HH.opts.length - 3, 0, { k: x[0], l: x[1], h: function (l) { return x[2] ? '~' + mo(l, V(l, x[2])) : 'Không tốn tiền'; }, req: function (l, d) { return (!d.acts || d.acts.indexOf(x[0]) >= 0) && (x[0] !== 've_que' || !(l.partner && l.partner.status !== 'dating')); }, ai: { w: 1 },
      run: function (l, r, log) { var pw = l.partner ? l.partner.name : 'người ấy'; var t = x[2] ? (H.datePay ? H.datePay(l, r, V(l, x[2]) / l.base, 'Hẹn hò: ' + x[1].toLowerCase()) : (H.cash(l, -V(l, x[2]), 'Hẹn hò'), '')) : ''; log(x[3] + ' (cùng ' + pw + ')' + (t || ''), 'good'); fx(l, x[4]); if (l.partner) l.partner.close = Math.min(100, (l.partner.close || 60) + 2); if (ch(r, 0.15)) H.mem(l, x[3], 2); } }); });
    var hp0 = HH.prep;
    HH.prep = function (l, r, arg) {
      var d = hp0.apply(this, arguments) || {};
      var keys = HH.opts.filter(function (o) { return !/^(dinner|trip|talk|doi)$/.test(o.k); }).map(function (o) { return o.k; }).filter(function (k) { return vnd(l) || !/^(dookki|buffet_hs|pizza)$/.test(k); });
      for (var i = keys.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = keys[i]; keys[i] = keys[j]; keys[j] = t; }
      d.acts = keys.slice(0, PER); return d;
    };
    HH.opts.push({ k: 'doi', l: 'Nghĩ thêm chỗ khác ›', ai: { w: 0 }, run: function (l, r, log) { l.pending.unshift(E.DEC.hen_ho.make(l, r)); } });
  }
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));

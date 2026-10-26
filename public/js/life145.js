/* GĐ5: nhịp sự kiện tự nhiên — phân loại mức độ, điều tiết mật độ, chống lặp.
   Mở rộng vòng chọn tình huống ngẫu nhiên sẵn có của engine (beginYear) qua một điểm kiểm tra duy nhất;
   không chạm tới tình huống bắt buộc / đã hẹn (bệnh, học, việc làm, l.sched, chuỗi GĐ4, hành động người chơi).
   · Mức: daily (đời thường) · major (quyết định quan trọng, theo E.isMajor sẵn có) · shock (biến cố lớn).
   · Số ngẫu nhiên băm theo nhân vật/năm/tình huống, không rút RNG chung.
   · Lịch sử gọn trong l.flags.pace145.h (tối đa 24 dòng), không tăng vô hạn. */
(function (G) {
  'use strict';
  var E = G.E, U = G.U;
  var B = '(?<![\\p{L}\\p{N}])', A = '(?![\\p{L}\\p{N}])';
  function words(list) { return new RegExp(B + '(?:' + list.join('|') + ')' + A, 'iu'); }
  // Biến cố làm thay đổi mạnh cuộc sống: mất mát, tai nạn, pháp lý, sụp đổ tài chính, khủng hoảng sức khỏe / hôn nhân.
  var SHOCK = words(['tai nạn', 'mất việc', 'cắt giảm', 'sa thải', 'phá sản', 'vỡ nợ', 'đòi nợ', 'chủ nợ', 'tín dụng đen', 'vay nóng', 'bị bắt', 'khởi tố',
    'trại giam', 'ngồi tù', 'ly hôn', 'rạn nứt', 'ngoại tình', 'phản bội', 'qua đời', 'đột quỵ', 'ung thư', 'nhập viện', 'cấp cứu', 'phẫu thuật', 'ốm nặng', 'bệnh nặng',
    'chấn thương', 'hỏa hoạn', 'cháy nhà', 'lũ lụt', 'bão', 'thiên tai', 'động đất', 'lừa đảo', 'bị trộm', 'bị cướp', 'bạo lực', 'bê bối', 'scandal', 'khủng hoảng',
    'trầm cảm', 'kiệt sức', 'kiện', 'mất trắng', 'thua lỗ', 'phá thai', 'sảy thai', 'nghiện']);
  var SHOCK_ID = /^(treat|bi_bat|ra_tu|phau_thuat|divorce|chien_tranh|scandal|kh_den|cs_cat_giam|vp_sa_thai_ai|vd_vay_chua_benh|kd_vay_nong_xoay_von|chu_no|tram_cam|sau_mat_mat|uw_truy_sat)$/;
  function text(d) { return ((d && d.title) || '') + ' ' + ((d && d.text) || ''); }
  function tier(d) {
    if (!d) return 'daily';
    if (SHOCK_ID.test(d.id) || SHOCK.test(text(d))) return 'shock';
    return E.isMajor && E.isMajor(d) ? 'major' : 'daily';
  }
  // Dấu vân nội dung: các từ thường của tiêu đề, bỏ tên riêng (viết hoa giữa câu) và số — để nhận ra hai tình huống gần giống nhau.
  function sig(d) {
    var t = String((d && d.title) || '').replace(/[0-9]+([.,][0-9]+)?/g, ' ');
    // Tên người trong dữ liệu tình huống (d.data.n, name…) có thể đứng đầu tiêu đề: bỏ đi trước khi so.
    var data = d && d.data && typeof d.data === 'object' ? d.data : {};
    Object.keys(data).forEach(function (k) { var v = data[k]; if (typeof v === 'string' && v.length < 40 && /^\p{Lu}/u.test(v)) t = t.split(v).join(' '); });
    var parts = t.split(/[\s,.:;!?()"“”«»—–-]+/).filter(Boolean), out = [];
    parts.forEach(function (w, i) { if (i > 0 && /^\p{Lu}/u.test(w)) return; var k = w.toLowerCase(); if (k.length > 1 && out.indexOf(k) < 0) out.push(k); });
    return out.slice(0, 8).join(' ');
  }
  function similar(a, b) {
    if (!a || !b) return 0;
    var x = a.split(' '), y = b.split(' '), n = 0;
    x.forEach(function (w) { if (y.indexOf(w) >= 0) n++; });
    return n / (x.length + y.length - n);
  }
  E.PACE145 = { tier: tier, sig: sig, similar: similar };
  if (G.PACE145_MEASURE_ONLY) return; // công cụ đo trên mã cũ chỉ cần bộ phân loại

  var H = E.H, MAX_H = 24;
  // Nhóm chủ đề: các tình huống khác ID nhưng cùng một chuyện đời — cách nhau tối thiểu `gap` năm, mỗi năm một.
  var GROUPS = [
    { key: 'marriage130', gap: 3, re: /^marriage\w+130$/ },
    { key: 'relationPressure', gap: 4, re: /^(familyObjection130|status129)$/ }, // vn_giuc_cuoi giữ nhịp cũ: ghép chung làm giảm cưới hỏi, sinh con
    { key: 'casual', gap: 3, re: /^(map_mo101|casual101)$/ },
    { key: 'friendCall', gap: 2, re: /^(ban_than_hen|ban_than_kho|ban_khung_hoang)$/ },
    // GĐ6: không ghép 'đổi nghề' — gợi ý đổi nghề (nghe_chuyen_moi) chặn mất quyết định đổi nghề thật (chuyen_huong): 22–26 → 9–15 / 400 đời.
    { key: 'petFind', gap: 2, re: /^(meo_ket|meo_theo|thu_cung|nuoi_pet|k_cho_duoi)$/ }
  ];
  function group(id) { for (var i = 0; i < GROUPS.length; i++) if (GROUPS[i].re.test(id)) return GROUPS[i]; return null; }
  function hash(s) { var n = 2166136261; for (var i = 0; i < s.length; i++) n = Math.imul(n ^ s.charCodeAt(i), 16777619); return n >>> 0; }
  function chance(l, id, p) { return hash([l.rs, l.id, l.age, id].join(':')) / 4294967296 < p; }
  function valid(s) { return s && typeof s === 'object' && Array.isArray(s.h); }
  function state(l) { if (!valid(l.flags.pace145)) l.flags.pace145 = { v: 1, h: [] }; return l.flags.pace145; }
  function code(t) { return t === 'shock' ? 's' : t === 'major' ? 'm' : 'd'; }
  function shocksIn(s, from, to) { return s.h.filter(function (x) { return x[0] >= from && x[0] <= to && x[1] === 's'; }).length; }

  // Ghi nhận mọi tình huống đã hiện ra (kể cả bắt buộc) để đo mật độ và nhận diện lặp. Không đổi kết quả lựa chọn.
  function record(l, d) {
    if (!l || !l.flags || !d || d.rec145) return;
    d.rec145 = true;
    var s = state(l), g = group(d.id);
    // Một dòng cho mỗi tình huống mỗi năm: các bước của cùng một luồng (du lịch, đám cưới…) không đẩy trôi lịch sử.
    // Mọi chuyến đi đã bắt đầu trong năm (kể cả người chơi tự chọn) đều tính, để không có thêm lời rủ đi chơi cùng năm.
    if (/^(du_lich|travel50_step)$/.test(d.id)) s.trip = l.age;
    if (s.h.some(function (x) { return x[0] === l.age && x[4] === d.id; })) return;
    s.h.push([l.age, code(tier(d)), g ? g.key : '', sig(d), d.id]);
    if (s.h.length > MAX_H) s.h.splice(0, s.h.length - MAX_H);
  }
  // Chỉ ghi khi lựa chọn thật sự có tác dụng: lựa chọn không còn hợp lệ bị bỏ qua thì bản lưu không đổi (GĐ6).
  function mark(l) { var s = l.st || {}; return [l.age, (l.log || []).length, l.money, l.karma, s.hea, s.hap, s.kno, s.soc, (l.pending || []).length, (l.sched || []).length, l.job && l.job.id, l.partner && l.partner.status, l.school, l.edu, l.alive, (l.kids || []).length].join('|'); }
  Object.keys(E.DEC).forEach(function (id) {
    var D = E.DEC[id], apply = D.apply;
    if (typeof apply !== 'function') return;
    D.apply = function (l, d) { var m = l && l.flags ? mark(l) : null, res = apply.apply(this, arguments); if (m !== null && mark(l) !== m) record(l, d); return res; };
  });

  // Điểm kiểm tra duy nhất, engine gọi cho tình huống ngẫu nhiên (trigger) và hành động AI tự chọn.
  // Trả về false thì engine bỏ qua và thử tình huống khác; cooldown của tình huống bị bỏ qua không bị tính.
  function admit(l, d, q, src) {
    var s = state(l), a = l.age, t = tier(d), g = group(d.id);
    var queued = q.map(function (x) { return { t: tier(x), g: group(x.id) }; });
    // Hành động AI tự chọn chỉ thêm vào năm còn thưa, để chế độ tự động không dồn nhiều hộp lựa chọn.
    // Chỉ ở chế độ tự động; việc game tự chọn giúp người chơi bỏ trống năm trước (chế độ thủ công) giữ nguyên (GĐ6).
    if (src && src.ai && src.auto && q.length >= 2) return false;
    if (g) {
      if (queued.some(function (x) { return x.g === g; })) return false;
      if (s.h.some(function (x) { return x[2] === g.key && a - x[0] < g.gap; })) return false;
    }
    // Hai tình huống khác ID nhưng gần như cùng nội dung trong 3 năm: bỏ cái sau. Chuỗi đang diễn ra (rep) được giữ.
    if (!(src && src.rep)) {
      var me = sig(d);
      if (me && s.h.some(function (x) { return a - x[0] <= 3 && x[4] !== d.id && similar(x[3], me) >= 0.75; })) return false;
    }
    if (t === 'shock') {
      var now = queued.filter(function (x) { return x.t === 'shock'; }).length + shocksIn(s, a, a);
      if (now >= 2) return false; // không có năm ba biến cố lớn chỉ vì nhiều trigger cùng đủ điều kiện
      var recent = shocksIn(s, a - 2, a - 1);
      var p = now === 1 ? 0.35 : 1;
      if (recent + now >= 2) p *= 0.5; // vừa trải qua chuỗi biến cố: giảm, không cấm
      if (a < 15) p *= 0.6;
      if (p < 1 && !chance(l, d.id, p)) return false;
    }
    return true;
  }

  // Du lịch nhiều bước: lời rủ ngẫu nhiên (không phải người chơi tự chọn) tối đa một chuyến mỗi năm,
  // và không chen vào năm đã có biến cố lớn hoặc đã có nhiều lựa chọn.
  function tripOk(l) {
    var s = state(l), a = l.age;
    if (s.trip === a) return false;
    if (shocksIn(s, a, a) > 0) return false;
    return s.h.filter(function (x) { return x[0] === a; }).length + (l.pending || []).length < 3;
  }
  // Chặn ở điều kiện của sự kiện (không bọc ev.run) để mã nguồn sự kiện vẫn tra cứu được.
  E.EVENTS.forEach(function (ev) {
    if (!ev.travel50) return;
    var c = ev.c;
    ev.c = function (l) { return tripOk(l) && c.apply(this, arguments); };
  });
  (E.ACT || []).forEach(function (x) {
    if (x.id !== 'du_lich' || !x.ai) return;
    var ai = x.ai;
    x.ai = function (l) { if (!tripOk(l)) return 0; return typeof ai === 'function' ? ai.apply(this, arguments) : ai; };
  });

  // Nhật ký kể chuyện (không phải tiền, biến cố, cột mốc): bỏ câu giống hệt đã kể trong 6 năm gần nhất.
  function norm(t) { return String(t).replace(/[0-9][0-9.,]*/g, '#'); }
  function quietLog(l, log) {
    return function (t, k) {
      if (k !== 'money' && k !== 'big' && k !== 'bad' && k !== 'death' && typeof t === 'string') {
        var n = norm(t), list = l.log || [];
        for (var i = list.length - 1, seen = 0; i >= 0 && seen < 160; i--, seen++) { var e = list[i]; if (e.a < l.age - 6) break; if (norm(e.t) === n) return; }
      }
      return log(t, k);
    };
  }
  // Engine gọi quietLog trong vòng sự kiện kể chuyện (finishYear).

  var migrate = E.migrateExt;
  E.migrateExt = function (l) {
    if (migrate) migrate(l);
    var s = l.flags && l.flags.pace145;
    if (s == null) return;
    if (!valid(s)) { delete l.flags.pace145; return; }
    s.h = s.h.filter(function (x) { return Array.isArray(x) && Number.isFinite(x[0]); });
    if (s.h.length > MAX_H) s.h.splice(0, s.h.length - MAX_H);
  };

  E.PACE145.admit = admit;
  E.PACE145.group = group;
  E.PACE145.tripOk = tripOk;
  E.PACE145.quietLog = quietLog;
  E.PACE145.state = state;
})(globalThis.G);

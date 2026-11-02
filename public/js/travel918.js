/* Một Đời — C9 tiếp (8.10.20): hộ chiếu của người chơi, thể thức nhập cảnh khi du lịch và chuyến đi cùng con.
   Mở rộng hệ sẵn có: hồ sơ visa du lịch (abroad-depth: l.flags.abroadDepth900), gói du lịch (life62: travel50_step/du_lich,
   đã tính phí giấy tờ trong báo giá), phép xuất cảnh (E.MOBILITY122) và hộ chiếu của con (E.ERA917.kidRec).
   · Hộ chiếu là giấy tờ phải làm, có hạn; không tự có khi có quốc tịch. Bản lưu cũ từng ra nước ngoài được ghi nhận có hộ chiếu.
   · Miễn thị thực chỉ áp cho danh sách ASEAN của hộ chiếu Việt Nam (nguồn thứ cấp, chưa đối chiếu từng nước); nước khác cần visa.
   · Xét visa băm theo nhân vật + nước + năm: tải lại không đổi kết quả, đổi hãng bay không ảnh hưởng; bị từ chối mất lệ phí,
     nộp lại năm sau với hồ sơ tốt hơn. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, W = G.W, R = E.ERA917;
  if (!X) return;
  var VISA_FREE_VN = { TH: 30, SG: 30, MY: 30, PH: 21, KH: 30, LA: 30, MM: 14, BN: 14 }; // ngày lưu trú tối đa, nguồn thứ cấp
  var EVISA_VN = { IN: 'Ấn Độ', LK: 'Sri Lanka', KE: 'Kenya', AZ: 'Azerbaijan' }; // nộp trực tuyến, vẫn phải xét duyệt (nguồn thứ cấp, chưa xác minh)
  var BAL = { fee: 0.2, foreignFee: 0.015, visaFee: 0.02, evisaFee: 0.01, tripPerson: 0.12 };
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; h = Math.imul(h, 3266489909); h ^= h >>> 16; return h >>> 0; }
  function ledger(l, vnd) { return E.TAX909 ? E.TAX909.ledger(l, vnd) : vnd; }
  function name(cc) { return W && W.BY && W.BY[cc] ? W.BY[cc].name : cc; }
  function st(l) { var s = l.flags.travel918; if (!s || typeof s !== 'object') s = l.flags.travel918 = { passport: null, pending: null, visas: {}, denied: {}, trips: [] }; if (!s.visas) s.visas = {}; if (!s.denied) s.denied = {}; if (!Array.isArray(s.trips)) s.trips = []; return s; }
  function home(l) { return l.country; }
  function passport(l) { var p = st(l).passport; return p && p.until > l.age ? p : null; }
  function fee(l) { return home(l) === 'VN' ? ledger(l, BAL.fee) : l.base * BAL.foreignFee; }
  function entry(l, code) {
    if (code === home(l) || code === 'domestic') return { kind: 'home' };
    if (l.flags.citizen && l.flags.citizen.indexOf(code) >= 0) return { kind: 'home' };
    if (home(l) === 'VN' && VISA_FREE_VN[code]) return { kind: 'free', days: VISA_FREE_VN[code], note: 'Miễn thị thực cho hộ chiếu phổ thông Việt Nam tối đa ' + VISA_FREE_VN[code] + ' ngày (nguồn thứ cấp)' };
    if (home(l) === 'VN' && EVISA_VN[code]) return { kind: 'evisa', note: 'Nộp thị thực điện tử (e-visa) trực tuyến; vẫn được xét duyệt, không phải miễn thị thực (danh sách chưa xác minh)' };
    return { kind: 'visa', note: home(l) === 'VN' ? 'Cần thị thực trước chuyến đi; thể thức e-visa hay nộp tại lãnh sự chưa xác minh theo từng nước' : 'Chưa có dữ liệu thể thức cho hộ chiếu nước bạn; game coi là cần thị thực' };
  }
  function validVisa(l, code) { var v = st(l).visas[code], a = l.flags.abroadDepth900 && l.flags.abroadDepth900.visa; return (v && v.until >= l.age) || (a && a.code === code && a.until >= l.age) ? true : false; }
  function chance(l, code) {
    var s = st(l), past = s.trips.filter(function (t) { return t.ok; }).length;
    return U.clamp(0.45 + (l.job ? 0.15 : 0) + Math.min(0.15, Math.max(0, l.money) / Math.max(1, l.base) * 0.02) + Math.min(0.15, past * 0.04) - (l.record > 0 ? 0.35 : 0) - (s.denied[code] != null && l.age - s.denied[code] <= 1 ? 0.1 : 0), 0.05, 0.92);
  }
  function roll(l, code) { return hash(l.id + ':visa918:' + code + ':' + l.age) / 4294967296; }
  // Lý do chưa đi được (true nếu đi được). Không thu tiền.
  function why(l, code) {
    var e = entry(l, code); if (e.kind === 'home') return true;
    if (!passport(l)) return 'Cần hộ chiếu còn hạn (làm tại mục Hộ chiếu và đi lại)';
    if (E.MOBILITY122) { var b = E.MOBILITY122.barrier(l, code, false); if (b !== true) return b; }
    return true;
  }
  // Xét visa khi đặt chuyến tới nước cần thị thực: một lần mỗi năm cho mỗi nước, kết quả cố định theo năm.
  function decide(l, code, log) {
    var s = st(l), e = entry(l, code); if ((e.kind !== 'visa' && e.kind !== 'evisa') || validVisa(l, code)) return true;
    if (s.denied[code] === l.age) return 'Visa ' + name(code) + ' đã bị từ chối năm nay; có thể nộp lại năm sau';
    var ok = roll(l, code) < Math.min(0.95, chance(l, code) + (e.kind === 'evisa' ? 0.15 : 0));
    if (ok) { s.visas[code] = { at: l.age, until: l.age + 1 }; if (log) log('Được cấp visa du lịch ' + name(code) + '.', 'good'); return true; }
    s.denied[code] = l.age; H.cash(l, -l.base * (e.kind === 'evisa' ? BAL.evisaFee : BAL.visaFee), e.kind === 'evisa' ? 'Lệ phí e-visa (không hoàn)' : 'Lệ phí visa (không hoàn)');
    return 'Visa ' + name(code) + ' chưa được chấp thuận (hồ sơ tài chính/việc làm chưa đủ thuyết phục); lệ phí không hoàn, có thể nộp lại năm sau';
  }

  // ---------- hộ chiếu của người chơi ----------
  X.menu('passport918', 'Hộ chiếu và đi lại', function (l) { return X.reason(l, 14); }, function (l) {
    var s = st(l), p = passport(l);
    return 'Hộ chiếu: ' + (p ? 'còn hạn đến khi bạn ' + p.until + ' tuổi' + (p.inferred ? ' (ghi nhận từ các chuyến đi trước)' : '') : s.pending ? 'đang chờ cấp' : 'chưa có hoặc đã hết hạn') + '. ' +
      (home(l) === 'VN' ? 'Hộ chiếu phổ thông từ 14 tuổi có hạn 10 năm; lệ phí ' + H.money(l, fee(l)) + '. ' : '') +
      'Có hộ chiếu chưa có nghĩa được nhập cảnh: mỗi nước có thể thức riêng. Hộ chiếu Việt Nam được miễn thị thực ngắn ngày ở ' + Object.keys(VISA_FREE_VN).map(name).join(', ') + ' (danh sách theo nguồn thứ cấp, chưa đối chiếu từng nước); nước khác cần xin visa, có thể bị từ chối.' +
      (Object.keys(s.denied).length ? '\nVisa bị từ chối: ' + Object.keys(s.denied).map(function (c) { return name(c) + ' (' + s.denied[c] + ' tuổi)'; }).join(', ') + '.' : '') +
      (s.trips.length ? '\nChuyến đi gần đây: ' + s.trips.slice(-4).map(function (t) { return name(t.code) + ' (' + t.age + ' tuổi' + (t.kids ? ', cùng ' + t.kids + ' con' : '') + ')'; }).join(', ') + '.' : '');
  }, function (l) {
    var s = st(l), p = passport(l), out = [];
    out.push({ k: 'pp', l: (p ? 'Làm lại' : 'Làm') + ' hộ chiếu', h: 'Lệ phí ' + H.money(l, fee(l)) + ' · cấp trong năm sau', why: s.pending ? 'Đang chờ cấp' : p && p.until - l.age > 1 ? 'Hộ chiếu còn hạn' : l.money < fee(l) ? 'Chưa đủ tiền lệ phí' : true,
      run: function (l, r, log) { var q = st(l); if (q.pending || passport(l) && passport(l).until - l.age > 1 || l.money < fee(l)) return; H.cash(l, -fee(l), 'Lệ phí hộ chiếu'); q.pending = { at: l.age }; log('Nộp hồ sơ cấp hộ chiếu.', 'neutral'); } });
    Object.keys(VISA_FREE_VN).forEach(function (code) {
      if (home(l) !== 'VN') return;
      var kids = (l.kids || []).filter(function (k) { return k.alive !== false && l.age - k.born < 18 && !(k.custody === 'other' || k.custody === 'ex'); });
      var noPP = R ? kids.filter(function (k) { var c = R.kidRec(l, k); return !(c.passports || []).some(function (x) { return x.cc === 'VN' && x.until > l.age - k.born; }); }) : [];
      var n = 1 + kids.length + (l.partner && l.partner.alive !== false && l.partner.status !== 'dating' ? 1 : 0), cost = l.base * BAL.tripPerson * n;
      if (!kids.length) return;
      out.push({ k: 'fam:' + code, l: 'Du lịch ' + name(code) + ' cùng các con', h: 'Miễn thị thực · ' + n + ' người · ' + H.money(l, cost), why: l.abroad ? 'Đang ở nước ngoài' : why(l, code) !== true ? why(l, code) : noPP.length ? noPP.map(function (k) { return k.name; }).join(', ') + ' chưa có hộ chiếu còn hạn (làm ở mục Quốc tịch và hộ chiếu của con)' : s.famAt === l.age ? 'Đã đi năm nay' : l.money < cost ? 'Chưa đủ tiền' : true,
        run: function (l, r, log) { var q = st(l); if (q.famAt === l.age || l.money < cost || why(l, code) !== true) return; q.famAt = l.age; H.cash(l, -cost, 'Du lịch gia đình ' + name(code)); H.fx(l, { hap: 5 }); kids.forEach(function (k) { k.close = U.clamp((k.close || 60) + 3, 0, 100); }); q.trips.push({ code: code, age: l.age, ok: true, kids: kids.length }); q.trips = q.trips.slice(-20); H.mem(l, 'Chuyến du lịch ' + name(code) + ' cùng các con.', 3); log('Cả nhà đi du lịch ' + name(code) + ' vài ngày rồi về; các con mang hộ chiếu riêng.', 'good'); } });
    });
    return out;
  }, 14, 'Đời sống');

  // ---------- gói du lịch life62: kiểm hộ chiếu và xét visa trước khi thu tiền ----------
  var C = E.WORLD120;
  if (C && C.wrap) ['travel50_step', 'du_lich'].forEach(function (id) {
    if (!E.DEC[id]) return;
    C.wrap(id, function (old, l, d, k, r, log) {
      var trip = l.flags.trip50;
      if (trip && trip.stage === 'book' && k !== 'cancel' && trip.code && trip.code !== 'domestic' && trip.code !== (l.abroad ? l.abroad.code : l.country)) {
        var w = why(l, trip.code); if (w !== true) { log(w + '. Chưa thu tiền chuyến đi.', 'bad'); return; }
        var v = decide(l, trip.code, log); if (v !== true) { log(v + '.', 'bad'); return; }
        var res = old(l, d, k, r, log); var s = st(l); s.trips.push({ code: trip.code, age: l.age, ok: true }); s.trips = s.trips.slice(-20); return res;
      }
      return old(l, d, k, r, log);
    });
  });
  // ---------- hồ sơ visa du lịch abroad-depth: cần hộ chiếu còn hạn ----------
  E.travelWhy918 = why;

  // ---------- hook năm và bản lưu ----------
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive || !l.flags) return; var s = st(l);
    if (s.pending && s.pending.at < l.age) { s.pending = null; s.passport = { cc: home(l), issued: l.age, until: l.age + (l.age < 14 ? 5 : 10) }; log('Hộ chiếu của bạn đã được cấp, hạn ' + (l.age < 14 ? 5 : 10) + ' năm.', 'good'); }
  });
  var mig = E.migrateExt; E.migrateExt = function (l) {
    if (mig) mig(l); if (!l || !l.flags) return;
    if (l.flags.travel918 != null && typeof l.flags.travel918 !== 'object') delete l.flags.travel918;
    if (l.flags.travel918v == null) { // một lần: người đã từng ra nước ngoài trong bản lưu cũ được ghi nhận có hộ chiếu, không bắt làm lại
      l.flags.travel918v = 1; var a = l.flags.abroadDepth900, been = !!(l.abroad || a && (a.visa || (a.history || []).length) || l.flags.trip50 && l.flags.trip50.code && l.flags.trip50.code !== 'domestic' || (l.flags.citizen || []).length);
      if (been && l.age >= 14) st(l).passport = { cc: home(l), issued: l.age, until: l.age + 5, inferred: true };
    }
  };
  E.TRAVEL918 = { EVISA_VN: EVISA_VN, VISA_FREE_VN: VISA_FREE_VN, BAL: BAL, state: st, passport: passport, entry: entry, why: why, decide: decide, chance: chance, roll: roll, validVisa: validVisa };
})(globalThis.G);

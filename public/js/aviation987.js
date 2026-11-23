/* Một Đời — 9.8.7: con đường trở thành phi công không còn mở cho mọi người có bằng đại học.
   · Trước đây nghề "phi công" chỉ cần bằng đại học bất kỳ nên tốt nghiệp trường nào cũng có thể được nhận làm học viên phi công.
     Nay (ngoài Mỹ, nơi đã có lộ trình FAA riêng ở world836) phải qua tuyển chọn học viên phi công và hoàn thành khóa huấn luyện bay.
   · Tuyển chọn nhiều vòng: hồ sơ, tiếng Anh, toán–vật lý/năng khiếu, khám sức khỏe hạng 1, tâm lý và phỏng vấn. Kết quả phụ thuộc
     kiến thức, sức khỏe, tiếng Anh, tuổi và ngành học (sinh viên các ngành hàng không có lợi thế nhỏ, không được bảo đảm đỗ).
   · Hai cách học: hãng tài trợ (cam kết phục vụ, bỏ ngang phải bồi hoàn) hoặc tự túc học phí. Khóa học kéo dài hai năm trò chơi
     (lý thuyết rồi bay huấn luyện), có thể trượt một học phần và học lại; trượt hai lần hoặc sức khỏe không đạt thì dừng khóa.
   · Người đang làm phi công ở bản lưu cũ được giữ nguyên. Chi phí, tỷ lệ và thời gian là tham số trò chơi, không phải số liệu chính thức. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, SH = E.SHOW151;
  if (!E || !X || !SH) return;
  var seeded = SH.seeded, V = SH.V;
  var BAL = { minAge: 18, maxAge: 30, minEdu: 3, cost: 2400, extra: 350, bondYears: 10, health: 60, years: 2 };
  var VN_AIRLINES = ['Vietnam Airlines', 'Vietjet Air', 'Bamboo Airways', 'Vietravel Airlines'];
  function st(l) { return l.flags.pilot987 || (l.flags.pilot987 = { history: [] }); }
  function peek(l) { return l.flags.pilot987 || null; }
  function where(l) { return (l.abroad && l.abroad.code) || l.country; }
  function airlines(l) { var c = where(l), B = G.W && G.W.BY && G.W.BY[c]; return c === 'VN' ? VN_AIRLINES : ['Hãng hàng không quốc gia ' + (B ? B.name : ''), 'Hãng hàng không giá rẻ tại ' + (B ? B.name : 'nơi bạn sống')]; }
  function english(l) { var g = E.GLOBAL919 && E.GLOBAL919.instrLevel ? E.GLOBAL919.instrLevel(l, 'en') : (l.lang && l.lang.en) || 0; return Math.max(0, Math.min(4, g || 0)); }
  function aviationDegree(l) {
    var rx = /hàng không|hoạt động bay|khai thác bay|hàng không vũ trụ|aerospace|aviation/i;
    if (rx.test(String(l.majorName || '')) || rx.test(String(l.uniName || '')) && l.edu >= 5) return true;
    var rows = l.flags.study54 && l.flags.study54.graduated872; return Array.isArray(rows) && rows.some(function (x) { return rx.test(String(x.name || '')) || rx.test(String(x.school || '')); });
  }
  function studyingAviation(l) { return l.school === 'uni' && /hàng không|hoạt động bay|khai thác bay/i.test(String(l.majorName || '') + ' ' + String(l.uniName || '')); }
  function isPilot(l) { return !!(l.job && E.resolveJob && E.resolveJob(l.job.id) === 'phi_cong'); }
  function training(l) { var s = peek(l); return !!(s && (s.stage === 'ground' || s.stage === 'flight')); }
  function certified(l) { var s = peek(l); return !!(s && s.cert); }
  function free(l) { return X.reason(l, BAL.minAge); }
  function blocked(l) { return l.jailUntil != null && l.age < l.jailUntil ? 'Đang thụ án' : l.flags.military && l.age < l.flags.military ? 'Đang đi nghĩa vụ quân sự' : l.abroad && l.abroad.trapped ? 'Đang bị giữ ở trại lừa đảo' : null; }
  function menuWhy(l) { var w = free(l); if (w !== true) return w; if (where(l) === 'US') return 'Ở Mỹ dùng mục "Học bay và lộ trình phi công tại Mỹ"'; return true; }
  function applyWhy(l) {
    var s = peek(l) || {}, b = blocked(l); if (b) return b;
    if (isPilot(l)) return 'Bạn đang là phi công';
    if (training(l)) return 'Đang trong khóa huấn luyện bay';
    if (s.cert) return 'Đã có chứng chỉ phi công thương mại';
    if (s.offer && s.offer.at === l.age) return 'Đã có kết quả tuyển chọn năm nay';
    if (l.age > BAL.maxAge) return 'Chương trình học viên phi công nhận ứng viên tới ' + BAL.maxAge + ' tuổi';
    if ((l.edu || 0) < BAL.minEdu) return 'Cần tốt nghiệp trung học phổ thông';
    if (l.school && l.school !== 'uni') return 'Cần hoàn tất chương trình học hiện tại';
    if (l.record > 0) return 'Hồ sơ có tiền án không đạt vòng lý lịch';
    if (s.appliedAt != null && l.age - s.appliedAt < 1) return 'Mỗi năm chỉ nộp một hồ sơ';
    if ((s.rejected || 0) >= 3) return 'Đã trượt tuyển chọn ba lần';
    if (E.ERA902 && E.ERA902.jobBlocked && E.CAR && E.CAR.phi_cong && E.ERA902.jobBlocked(l, 'phi_cong', E.CAR.phi_cong)) return 'Chưa phù hợp với thời kỳ này';
    return true;
  }
  // Các vòng tuyển chọn: mỗi vòng có lý do đạt / chưa đạt theo hồ sơ thật của nhân vật.
  function rounds(l, rr) {
    var kno = (l.st && l.st.kno) || 50, hea = (l.st && l.st.hea) || 60, soc = (l.st && l.st.soc) || 50, en = english(l), deg = aviationDegree(l) || studyingAviation(l), out = [];
    var eye = rr() < 0.82; // thị lực/bệnh lý ẩn: không phụ thuộc chỉ số
    out.push({ n: 'Hồ sơ và lý lịch', ok: true, why: 'đủ tuổi, đủ bằng cấp' + (deg ? ', có nền tảng ngành hàng không' : '') });
    out.push({ n: 'Tiếng Anh', ok: en >= 2 || en >= 1 && rr() < 0.35, why: en >= 3 ? 'tiếng Anh tốt' : en >= 2 ? 'tiếng Anh đạt yêu cầu' : en >= 1 ? 'tiếng Anh ở mức cơ bản' : 'chưa có chứng chỉ tiếng Anh còn hạn' });
    out.push({ n: 'Toán, vật lý và năng khiếu bay', ok: rr() < U.clamp(0.25 + (kno - 50) / 70 + (deg ? 0.1 : 0), 0.05, 0.95), why: kno >= 70 ? 'tư duy không gian và tính toán nhanh' : kno >= 50 ? 'kết quả ở mức trung bình khá' : 'bài kiểm tra năng khiếu còn yếu' });
    out.push({ n: 'Khám sức khỏe hạng 1', ok: hea >= BAL.health && eye, why: hea < BAL.health ? 'thể lực chưa đạt chuẩn y tế hàng không' : !eye ? 'phát hiện vấn đề thị lực / tim mạch chưa đạt chuẩn' : 'đạt tiêu chuẩn sức khỏe' });
    out.push({ n: 'Tâm lý và phỏng vấn', ok: rr() < U.clamp(0.45 + (soc - 50) / 120 + ((l.mind && l.mind.stress) > 70 ? -0.15 : 0), 0.15, 0.92), why: soc >= 60 ? 'bình tĩnh, giao tiếp tốt' : 'còn lúng túng khi xử lý tình huống' });
    var cut = -1; out.forEach(function (x, i) { if (cut < 0 && !x.ok) cut = i; });
    return { rows: cut < 0 ? out : out.slice(0, cut + 1), pass: cut < 0, score: kno * 0.4 + hea * 0.2 + soc * 0.15 + en * 6 + (deg ? 6 : 0) };
  }
  function cost(l) { return V(l, BAL.cost); }
  function applyRun(l, r, log) {
    var s = st(l), rr = seeded(l.id + ':pilot987:' + l.age), al = airlines(l), airline = al[Math.floor(rr() * al.length)], res = rounds(l, rr);
    s.appliedAt = l.age;
    var text = res.rows.map(function (x) { return x.n + ': ' + (x.ok ? 'đạt' : 'chưa đạt') + ' — ' + x.why; }).join('\n');
    if (!res.pass) { s.rejected = (s.rejected || 0) + 1; s.note = 'Tuyển chọn học viên phi công ' + airline + ' năm ' + (l.birthYear + l.age) + ':\n' + text + '\nCó thể nộp lại vào năm sau.'; s.history.push({ age: l.age, airline: airline, result: 'trượt' }); log('Hồ sơ học viên phi công tại ' + airline + ' chưa đạt ở vòng ' + res.rows[res.rows.length - 1].n.toLowerCase() + '.', 'neutral'); H.fx(l, { hap: -3 }); return; }
    var sponsor = res.score >= 52 && rr() < U.clamp(0.25 + (res.score - 52) / 40, 0.2, 0.8);
    s.offer = { at: l.age, airline: airline, sponsor: sponsor, cost: cost(l) };
    s.note = 'Tuyển chọn học viên phi công ' + airline + ':\n' + text + '\nBạn trúng tuyển. ' + (sponsor ? 'Hãng đề nghị tài trợ học phí kèm cam kết phục vụ ' + BAL.bondYears + ' năm.' : 'Suất của bạn là học viên tự túc học phí.');
    s.history.push({ age: l.age, airline: airline, result: sponsor ? 'trúng tuyển, có tài trợ' : 'trúng tuyển, tự túc' });
    log('Trúng tuyển học viên phi công tại ' + airline + (sponsor ? ', được đề nghị tài trợ học phí.' : ' theo diện tự túc học phí.'), 'good');
  }
  function enrol(l, log, sponsored) {
    var s = st(l), o = s.offer; if (!o || training(l)) return;
    if (!sponsored) { if (l.money < o.cost) { log('Chưa đủ tiền học phí huấn luyện bay; suất học được giữ đến hết năm.', 'neutral'); return; } H.cash(l, -o.cost, 'Học phí huấn luyện phi công'); }
    if (l.school === 'uni') { log('Bạn thôi học đại học để vào khóa huấn luyện bay toàn thời gian.', 'neutral'); l.school = null; l.schoolEnd = null; }
    s.stage = 'ground'; s.airline = o.airline; s.sponsored = !!sponsored; s.paid = sponsored ? 0 : o.cost; s.costBase = o.cost; s.startAge = l.age; s.fails = 0; s.doneAt = null; delete s.offer;
    log('Nhập học khóa huấn luyện phi công thương mại của ' + s.airline + (sponsored ? ' theo diện hãng tài trợ (cam kết phục vụ ' + BAL.bondYears + ' năm sau khi bay chính thức).' : ' theo diện tự túc.') + ' Năm đầu học lý thuyết, năm sau bay huấn luyện.', 'big');
    H.mem(l, 'Ngày đầu khoác đồng phục học viên phi công.', 4);
  }
  function quit(l, log) {
    var s = st(l); if (!training(l)) return;
    var owe = s.sponsored ? s.costBase * (s.stage === 'ground' ? 0.4 : 0.8) : 0;
    if (owe) H.cash(l, -owe, 'Bồi hoàn chi phí đào tạo phi công');
    s.history.push({ age: l.age, airline: s.airline, result: 'dừng khóa giữa chừng' }); s.stage = 'stopped';
    log('Bạn xin dừng khóa huấn luyện bay' + (owe ? ' và bồi hoàn ' + H.money(l, owe) + ' chi phí hãng đã ứng.' : '.'), 'neutral');
  }
  function hire(l, r, log) {
    var s = st(l); if (!s.cert || isPilot(l)) return;
    var ok = s.sponsored || seeded(l.id + ':hire987:' + l.age)() < U.clamp(0.45 + english(l) * 0.08 + (((l.st && l.st.kno) || 50) - 50) / 200, 0.3, 0.9);
    s.hireAt = l.age;
    if (!ok) { log('Hồ sơ xin việc phi công chưa được hãng nhận năm nay; nhiều phi công mới tốt nghiệp đang chờ suất bay. Có thể thử lại năm sau.', 'neutral'); return; }
    var started = E.startJob(l, 'phi_cong', r, log, true);
    if (started === false) { log('Chưa nhận được vị trí phi công lúc này.', 'neutral'); return; }
    if (s.sponsored && !s.bond) s.bond = { until: l.age + BAL.bondYears, airline: s.airline, amount: s.costBase };
    log('Ký hợp đồng bay với ' + (s.airline || 'hãng hàng không') + ', bắt đầu làm học viên phi công trên tàu bay thương mại.', 'big');
  }
  X.menu('pilot987', 'Tuyển chọn và đào tạo học viên phi công', menuWhy, function (l) {
    var s = peek(l) || {}, o = s.offer;
    var head = 'Phi công thương mại phải qua tuyển chọn (tiếng Anh, năng khiếu, sức khỏe hạng 1, tâm lý) và khóa huấn luyện bay, không phải có bằng đại học là được nhận. Học phí tự túc khoảng ' + H.money(l, cost(l)) + ' (ước tính); hãng tài trợ thì cam kết phục vụ ' + BAL.bondYears + ' năm. Tiếng Anh hiện tại: mức ' + english(l) + '/4' + (aviationDegree(l) || studyingAviation(l) ? ' · có nền tảng ngành hàng không' : '') + '.';
    var now = training(l) ? '\nĐang học: ' + (s.stage === 'ground' ? 'giai đoạn lý thuyết' : 'giai đoạn bay huấn luyện') + ' tại ' + s.airline + (s.fails ? ' · đã phải học lại ' + s.fails + ' học phần' : '') + '.' : s.cert ? '\nĐã có chứng chỉ phi công thương mại (' + s.cert + ').' : o && o.at === l.age ? '\nĐang có suất trúng tuyển tại ' + o.airline + '.' : '';
    return head + now + (s.note ? '\n' + s.note : '');
  }, function (l) {
    var s = peek(l) || {}, o = s.offer, out = [];
    if (o && o.at === l.age && !training(l)) {
      if (o.sponsor) out.push({ k: 'sponsor', l: 'Nhận tài trợ của ' + o.airline + ', cam kết phục vụ ' + BAL.bondYears + ' năm', h: 'Không trả học phí; nghỉ trước hạn phải bồi hoàn', run: function (l, r, log) { enrol(l, log, true); } });
      out.push({ k: 'self', l: 'Tự túc học phí · ' + H.money(l, o.cost), why: l.money >= o.cost ? true : 'Chưa đủ tiền', h: 'Tự do chọn hãng sau khi tốt nghiệp', run: function (l, r, log) { enrol(l, log, false); } });
      out.push({ k: 'decline', l: 'Từ chối suất học viên phi công', run: function (l, r, log) { var s = st(l); delete s.offer; log('Bạn từ chối suất học viên phi công năm nay.', 'neutral'); } });
      return out;
    }
    if (training(l)) { out.push({ k: 'quit', l: 'Xin dừng khóa huấn luyện', h: s.sponsored ? 'Phải bồi hoàn một phần chi phí hãng đã ứng' : 'Học phí đã nộp không được hoàn', run: function (l, r, log) { quit(l, log); } }); return out; }
    if (s.cert && !isPilot(l)) { out.push({ k: 'hire', l: 'Nộp hồ sơ bay cho hãng hàng không', why: s.hireAt === l.age ? 'Đã nộp năm nay' : blocked(l) || true, run: function (l, r, log) { hire(l, r, log); } }); return out; }
    out.push({ k: 'apply', l: 'Nộp hồ sơ tuyển chọn học viên phi công', why: applyWhy(l), h: 'Tuyển chọn nhiều vòng; kết quả có ngay', run: function (l, r, log) { applyRun(l, r, log); var s = st(l); if (s.offer) X.next(l, 'pilot987', r, {}, { manual: true }); } });
    return out;
  }, 18, 'Nghề nghiệp');
  E.DEC.pilot987.auto = function (l, d, r) { var keys = d.data && d.data.keys || [], s = peek(l) || {}, o = s.offer, want = o && o.at === l.age ? (o.sponsor ? 'sponsor' : l.money >= o.cost * 2 ? 'self' : 'decline') : s.cert ? 'hire' : training(l) ? null : 'apply', i = want ? keys.indexOf(want) : -1; return i >= 0 && d.opts.some(function (x) { return x.k === String(i); }) ? String(i) : 'cancel'; };
  // Cơ hội tự đến: thông báo tuyển học viên phi công cho người trẻ phù hợp (để chế độ Tự động cũng có đường vào nghề).
  if (E.TRIG) E.TRIG.push({ id: 'pilot987', when: function (l) { return l.mode !== 'classic' && where(l) !== 'US' && applyWhy(l) === true && l.age <= 26 && ((l.st && l.st.kno) || 0) >= 55 && english(l) >= 1; }, p: function (l) { return aviationDegree(l) || studyingAviation(l) ? 0.18 : 0.03; }, cd: 3, max: 2 });

  // Diễn biến khóa học mỗi năm.
  function yearHook(l, r, log) {
    var s = peek(l); if (!s || !l.alive) return;
    if (s.yearAt === l.age) return; s.yearAt = l.age;
    if (s.bond && l.age < s.bond.until && !isPilot(l) && !s.bond.settled) {
      var left = Math.max(0, s.bond.until - l.age) / BAL.bondYears, owe = s.bond.amount * left;
      s.bond.settled = true; if (owe > 0) { H.cash(l, -owe, 'Bồi hoàn cam kết đào tạo phi công'); log('Rời ' + s.bond.airline + ' trước hạn cam kết; bồi hoàn ' + H.money(l, owe) + ' chi phí đào tạo còn lại.', 'bad'); }
    }
    if (!training(l)) return;
    if (l.age === s.startAge) return; // năm nhập học đã tính là học kỳ đầu
    if (blocked(l)) { s.history.push({ age: l.age, airline: s.airline, result: 'gián đoạn' }); s.stage = 'stopped'; log('Khóa huấn luyện bay bị dừng vì hoàn cảnh không cho phép tiếp tục.', 'bad'); return; }
    if (((l.st && l.st.hea) || 0) < 50) { s.stage = 'stopped'; s.history.push({ age: l.age, airline: s.airline, result: 'không đạt sức khỏe' }); log('Khám định kỳ không đạt chuẩn y tế hàng không; khóa huấn luyện bay phải dừng.', 'bad'); H.fx(l, { hap: -8 }); return; }
    var rr = seeded(l.id + ':pilotYear987:' + l.age), kno = (l.st && l.st.kno) || 50, p = U.clamp(0.62 + (kno - 50) / 120 + english(l) * 0.04 + (s.stage === 'flight' ? (((l.st && l.st.hea) || 60) - 60) / 200 : 0), 0.35, 0.95);
    var part = s.stage === 'ground' ? 'lý thuyết ATPL' : 'bay huấn luyện và kiểm tra CPL/IR';
    if (rr() < p) {
      if (s.stage === 'ground') { s.stage = 'flight'; H.fx(l, { kno: 2 }); log('Hoàn thành giai đoạn ' + part + '; chuyển sang bay huấn luyện.', 'good'); }
      else { s.stage = 'done'; s.cert = 'CPL · IR · ME, lý thuyết ATPL'; s.doneAt = l.age; s.history.push({ age: l.age, airline: s.airline, result: 'tốt nghiệp' }); log('Vượt qua bài kiểm tra bay cuối khóa, nhận chứng chỉ phi công thương mại.', 'big'); H.mem(l, 'Lần hạ cánh kiểm tra cuối khóa, giáo viên bay gật đầu.', 5); H.fx(l, { hap: 8 }); if (s.sponsored) hire(l, r, log); }
    } else {
      s.fails = (s.fails || 0) + 1;
      if (s.fails >= 2) { s.stage = 'stopped'; s.history.push({ age: l.age, airline: s.airline, result: 'bị dừng do trượt hai lần' }); log('Trượt học phần ' + part + ' lần thứ hai; học viện dừng khóa huấn luyện của bạn.', 'bad'); H.fx(l, { hap: -10 }); if (s.sponsored) { var owe2 = s.costBase * 0.3; H.cash(l, -owe2, 'Bồi hoàn một phần chi phí đào tạo phi công'); } return; }
      var extra = s.sponsored ? 0 : V(l, BAL.extra); if (extra) H.cash(l, -extra, 'Học lại học phần huấn luyện bay');
      log('Chưa đạt học phần ' + part + '; phải học lại một năm' + (extra ? ' (phí học lại ' + H.money(l, extra) + ')' : '') + '.', 'neutral');
    }
  }
  E.HOOKS.year.push(yearHook);

  // Cổng nghề phi công: ngoài Mỹ phải có chứng chỉ của khóa huấn luyện; người đang bay ở bản lưu cũ giữ nguyên.
  var us = E.pilotEligible836;
  E.pilotEligible836 = function (l) { if (where(l) === 'US') return us ? us.apply(this, arguments) : true; return isPilot(l) || certified(l); };
  if (E.profile) { var profile = E.profile; E.profile = function (l) { var p = profile.apply(this, arguments), s = peek(l); if (s && p && p.jobInfo) { if (training(l)) p.jobInfo.push('Học viên huấn luyện bay tại ' + s.airline + ' · ' + (s.stage === 'ground' ? 'lý thuyết' : 'bay huấn luyện')); else if (s.cert && !isPilot(l)) p.jobInfo.push('Có chứng chỉ phi công thương mại; chưa có hợp đồng bay'); if (s.bond && !s.bond.settled && isPilot(l)) p.jobInfo.push('Cam kết phục vụ ' + s.bond.airline + ' đến năm ' + (l.birthYear + s.bond.until)); } return p; }; }
  E.AVIATION987 = { year: yearHook, state: st, english: english, aviationDegree: aviationDegree, rounds: rounds, applyWhy: applyWhy, applyRun: applyRun, enrol: enrol, hire: hire, quit: quit, certified: certified, training: training, BAL: BAL };
})(globalThis.G);

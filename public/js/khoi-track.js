/* Khối thi THPT (Việt Nam) — bảo đảm người chơi luôn được chọn, xem và đổi khối trước kỳ thi tốt nghiệp.
   · Trước đây tình huống chon_khoi chỉ có một lần ở đúng tuổi 16 và phải tranh chỗ trong hàng đợi (tối đa 3 lựa chọn/năm);
     năm nào hàng đợi đầy thì không bao giờ được hỏi và gradUpper âm thầm gán khối theo năng khiếu hoặc ngẫu nhiên A00/D01.
   · Nay engine hỏi bắt buộc (E.KHOI912.due) ở mọi năm thuộc giai đoạn chọn khối cho tới khi có câu trả lời; chỉ một quyết định đang chờ.
   · Nguồn lựa chọn lưu ở l.flags.khoi912.src: manual (người chơi bấm), auto (chế độ tự động/AI), legacy (bản lưu cũ đã có khối),
     school (đến lúc thi vẫn chưa có khối — chỉ xảy ra với bản lưu cũ hoặc đời do máy chạy; luôn ghi nhật ký rõ).
   · Chỉ áp dụng khi đang học THPT ở Việt Nam; nước khác không có khối thi nên không gán khối. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U;
  var V = 1;
  // Hằng số cân bằng: số lần đổi khối tối đa và chi phí đổi ở năm cuối (điểm kiến thức, điểm căng thẳng).
  var BAL = { maxChanges: 2, lateKno: 3, lateStress: 8, earlyStress: 2 };
  // Giữ đúng ánh xạ năng khiếu → khối và phép thử RNG của gradUpper cũ (expansion.js) để đời do máy chạy không lệch.
  var KHOI_TALENT = { 'toán học': 'A00', 'ngoại ngữ': 'D01', 'hội họa': 'H00', 'ăn nói': 'C00', 'kinh doanh': 'A01', 'khéo tay': 'A00' };
  var SUBJ = (E.EDUCATION54 && E.EDUCATION54.subjects) || {};
  var EXTRA = { drawing: 'Hình họa', composition: 'Bố cục màu', acting: 'Năng khiếu diễn xuất', performance: 'Biểu diễn', music: 'Năng khiếu âm nhạc' };

  function state(l) {
    var s = l.flags.khoi912;
    if (!s || typeof s !== 'object') s = l.flags.khoi912 = { v: V, src: l.khoi ? 'legacy' : null, at: null, changes: 0, hist: [] };
    if (!Array.isArray(s.hist)) s.hist = [];
    if (!Number.isFinite(s.changes)) s.changes = 0;
    s.v = V;
    return s;
  }
  function peek(l) { return l && l.flags && l.flags.khoi912 || null; }
  function gdtx3(l) { var g = l.flags && l.flags.gdtx; return !!(g && g.lvl === 3 && Number.isFinite(g.until)); }
  function inUpper(l) { return l.school === 'upper' || l.school === 'priv'; }
  // Năm thi tốt nghiệp: tuổi mà cuối năm đó sẽ ra trường.
  function examAge(l) { if (inUpper(l)) return (l.schoolEnd != null ? l.schoolEnd : 18) - 1; if (gdtx3(l)) return l.flags.gdtx.until - 1; return null; }
  function studying(l) { return !!(l && l.alive && H.inVN(l) && (inUpper(l) || gdtx3(l)) && !(l.jailUntil != null && l.age < l.jailUntil)); }
  // Đã thi xong (có điểm) hoặc đã có bằng THPT: khối thuộc về lịch sử, không sửa.
  function locked(l) { return l.examScore != null || (l.edu || 0) >= 3 || !studying(l); }
  // Giai đoạn chọn khối: từ lớp 11 (hai năm trước năm thi) tới hết năm thi.
  function window_(l) { var x = examAge(l); return x != null && l.age >= x - 1 && l.age <= x; }
  function due(l) { return studying(l) && !l.khoi && !locked(l) && window_(l); }
  function lastYear(l) { return examAge(l) === l.age; }
  function subjects(k) { var b = E.EXAM127 && E.EXAM127.blocks[k]; return b ? b.map(function (s) { return SUBJ[s] || EXTRA[s] || s; }) : []; }
  function majors(k) { var K = E.KHOI[k]; return K ? K.m.map(function (m) { return String(E.MAJORS[m] || m).split(' – ')[0]; }) : []; }
  function describe(k) { var K = E.KHOI[k]; if (!K) return ''; var s = subjects(k); return 'Khối ' + k + ' (' + K.n + ')' + (s.length ? ' · thi ' + s.join(', ') : '') + ' · nhóm ngành ' + majors(k).join(', '); }
  function srcText(s) { return { manual: 'bạn tự chọn', auto: 'chọn ở chế độ tự động', legacy: 'từ bản lưu trước, chưa rõ nguồn', school: 'nhà trường xếp vì chưa chọn trước kỳ thi' }[s] || 'chưa rõ nguồn'; }

  function record(l, k, src, from) {
    var s = state(l);
    s.src = src; s.at = l.age;
    s.hist.push({ k: k, from: from || null, at: l.age, src: src });
    if (s.hist.length > 12) s.hist.splice(0, s.hist.length - 12);
  }

  // Tình huống gốc chon_khoi (expansion.js + life102.js): chấp nhận cả học viên bổ túc THPT, ghi nguồn lựa chọn.
  var CK = E.DEC.chon_khoi;
  if (CK && CK.def) {
    var valid0 = CK.def.valid;
    CK.def.valid = function (l, d) { return !l.khoi && (valid0.call(this, l, d) || (gdtx3(l) && H.inVN(l) && !locked(l))); };
    CK.def.text = function (l) {
      return (gdtx3(l) && !inUpper(l) ? 'Lớp bổ túc THPT yêu cầu đăng ký khối thi để ôn đúng môn.' : 'Lên lớp 11, cô chủ nhiệm yêu cầu cả lớp chọn khối thi để vào lớp ôn tương ứng.') +
        ' Chọn khối nào cũng là chọn sẵn một nhóm ngành cho tương lai.' + (lastYear(l) ? ' Đây là năm thi — cần chọn ngay để kịp ôn.' : ' Bạn vẫn có thể đổi khối trong mục Học tập trước kỳ thi.');
    };
    CK.def.opts.forEach(function (o) {
      var s = subjects(o.k), h0 = o.h;
      o.h = function (l, d) { return (typeof h0 === 'function' ? h0(l, d) : h0 || '') + (s.length ? ' · thi ' + s.join(', ') : ''); };
    });
    var apply0 = CK.apply;
    CK.apply = function (l, d, k) {
      var before = l.khoi, res = apply0.apply(this, arguments);
      if (!before && l.khoi) record(l, l.khoi, d && d.byHand912 ? 'manual' : 'auto');
      return res;
    };
  }

  // Trigger ngẫu nhiên cũ (đúng 16 tuổi) đi theo cùng giai đoạn học, để học sinh vào THPT muộn không bị hỏi từ lớp 10.
  E.TRIG.forEach(function (t) { if (t.id === 'chon_khoi') t.when = function (l) { return due(l); }; });

  // Xem / đổi khối trong mục Học tập. Đổi khối là một lượt hành động; năm thi đổi thì phải học bù.
  function canChange(l) {
    if (!H.inVN(l)) return 'Chỉ áp dụng cho học sinh THPT ở Việt Nam';
    if (!studying(l)) return 'Cần đang học THPT';
    if (locked(l)) return 'Đã thi tốt nghiệp — khối thi đã khóa';
    if (!l.khoi) return window_(l) ? true : 'Từ lớp 11 mới chọn khối';
    if (state(l).changes >= BAL.maxChanges) return 'Đã đổi khối ' + BAL.maxChanges + ' lần';
    return true;
  }
  E.SC('khoi912', {
    title: function (l) { return l.khoi ? 'Khối thi của bạn: ' + l.khoi : 'Chọn khối thi tốt nghiệp THPT'; },
    prep: function (l, r, arg) { return { at: l.age, from: l.khoi || null }; },
    valid: function (l, d) { return canChange(l) === true && (!d || d.at == null || d.at === l.age); },
    text: function (l) {
      var s = peek(l) || {}, left = BAL.maxChanges - (s.changes || 0);
      return (l.khoi ? 'Hiện tại: ' + describe(l.khoi) + ' — ' + srcText(s.src) + '. ' : 'Bạn chưa chọn khối. ') +
        'Mỗi khối thi 3 môn và xét vào nhóm ngành riêng; trường chỉ nhận hồ sơ đúng khối. ' +
        (l.khoi ? 'Còn ' + left + ' lần đổi. ' + (lastYear(l) ? 'Năm thi: đổi khối phải học bù (kiến thức −' + BAL.lateKno + ', căng thẳng tăng).' : 'Đổi trước năm thi chỉ tốn thời gian làm quen lớp mới.') : '') +
        ' Sau kỳ thi khối được khóa cùng điểm thi.';
    },
    opts: Object.keys(E.KHOI).map(function (k) {
      return { k: 'k_' + k, l: function () { return describe(k); },
        h: function (l) { return KHOI_TALENT[l.talent] === k ? 'Hợp năng khiếu của bạn' : ''; },
        req: function (l, d) { return l.khoi !== k; }, ai: { w: 0 },
        run: function (l, r, log, d) {
          if (canChange(l) !== true || l.khoi === k) return;
          var from = l.khoi || null, s = state(l);
          l.khoi = k;
          if (/^(H00|V00|S00|N00)$/.test(k)) l.flags.nkPrep = 1;
          if (from) {
            s.changes++;
            if (lastYear(l)) { l.st.kno -= BAL.lateKno; if (l.mind) l.mind.stress = (l.mind.stress || 0) + BAL.lateStress; log('Đổi từ khối ' + from + ' sang khối ' + k + ' ngay năm thi — phải học bù môn mới, áp lực hơn hẳn.', 'neutral'); }
            else { if (l.mind) l.mind.stress = (l.mind.stress || 0) + BAL.earlyStress; log('Đổi từ khối ' + from + ' sang khối ' + k + ', chuyển sang lớp ôn mới.', 'neutral'); }
          } else log('Chọn khối ' + k + ' (' + E.KHOI[k].n + '), vào lớp ôn chuyên sâu.', 'neutral');
          record(l, k, d && d.requested ? 'manual' : 'auto', from);
        } };
    }).concat([{ k: 'cancel', l: function (l) { return l.khoi ? 'Giữ khối ' + l.khoi : 'Để suy nghĩ thêm'; }, run: function () {} }])
  });
  E.ACT.push({ id: 'khoi912', g: 'Học tập', l: function (l) { return l.khoi ? 'Xem / đổi khối thi (' + l.khoi + ')' : 'Chọn khối thi THPT'; }, min: 15, max: 25, sc: 'khoi912',
    avail: canChange, ai: function () { return 0; } });

  // Đến kỳ thi vẫn chưa có khối (bản lưu cũ đang ở năm thi, đời do máy chạy): nhà trường xếp khối và ghi rõ, không im lặng.
  // Giữ đúng phép thử RNG của gradUpper cũ để kết quả các đời cũ không đổi.
  E.HOOKS.gradUpper.unshift(function (l, r, log) {
    if (!H.inVN(l) || l.khoi) return;
    var k = KHOI_TALENT[l.talent] || (r() < 0.5 ? 'A00' : 'D01');
    l.khoi = k; record(l, k, 'school');
    log('Đến kỳ thi bạn vẫn chưa đăng ký khối, nhà trường xếp bạn thi khối ' + k + ' (' + E.KHOI[k].n + ').', 'neutral');
  });

  // Bản lưu cũ: đã có khối thì giữ nguyên và đánh dấu legacy; không suy đoán, không xóa.
  var migrate = E.migrateExt;
  E.migrateExt = function (l) {
    if (migrate) migrate(l);
    if (!l || !l.flags) return;
    var s = l.flags.khoi912;
    if (s != null && typeof s !== 'object') delete l.flags.khoi912;
    if (l.khoi && !E.KHOI[l.khoi]) return; // khối lạ từ dữ liệu ngoài: giữ nguyên, không ghi đè
    if (l.khoi || l.flags.khoi912) state(l);
    // Chỉ một quyết định chọn khối trong hàng đợi.
    if (Array.isArray(l.pending)) { var seen = false; l.pending = l.pending.filter(function (d) { if (!d || d.id !== 'chon_khoi') return true; if (seen || l.khoi) return false; seen = true; return true; }); }
  };

  E.KHOI912 = { due: due, locked: locked, canChange: canChange, describe: describe, subjects: subjects, majors: majors, state: state, peek: peek, examAge: examAge, BAL: BAL, srcText: srcText };
})(globalThis.G);

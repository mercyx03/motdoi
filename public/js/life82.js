/* Một Đời — v6.4.0: ôn thi chuyên & đội tuyển theo đúng từng môn
   · mỗi môn một cách ôn: Toán (chuyên đề hình, bất đẳng thức, đề 150 phút), Tiếng Anh (nghe, từ vựng học thuật, viết luận),
     Ngữ văn (đọc tác phẩm, nghị luận xã hội), Tin học (thuật toán, chấm bài trực tuyến)… và lò luyện thi tốn tiền
   · lúc làm bài cũng theo dạng đề của từng môn
   · thi vào THPT chuyên: có bước ôn thi theo môn đã chọn rồi mới vào phòng thi */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H;
  function vnd(l) { return H.isVN(l) && l.cur === 'vnd' && !(l.abroad && l.abroad.perm); }
  function V(l, tr) { return vnd(l) ? tr : tr / 90 * l.base; }
  function mo(l, v) { return H.money(l, v); }
  // [ôn đều, luyện chuyên sâu, học nhóm, lò luyện thi] · [làm chắc, ưu tiên bài khó, kiểm tra] · dạng đề thi chuyên
  var SUB = {
    math: { prep: ['Ôn lại chuyên đề số học, đại số mỗi tối', 'Luyện chuyên đề hình học phẳng và bất đẳng thức', 'Học nhóm, trao đổi lời giải với bạn đội tuyển', 'Vào lò luyện chuyên Toán của thầy nổi tiếng'], exam: ['Làm chắc các câu đại số, phương trình', 'Dồn sức cho bài hình và bất đẳng thức cuối đề', 'Chia thời gian, soát lại từng bước biến đổi'], form: 'Đề chuyên Toán 150 phút, 5 bài: phương trình, số học, hình học phẳng, bất đẳng thức, tổ hợp.' },
    physics: { prep: ['Ôn chắc lý thuyết, hiểu bản chất hiện tượng', 'Luyện bài tập cơ học, điện học nâng cao', 'Làm thí nghiệm, học nhóm giải bài khó', 'Vào lò luyện chuyên Lý'], exam: ['Làm chắc phần cơ học, nhiệt học', 'Dồn sức cho bài điện học, quang học khó', 'Kiểm tra đơn vị, kết quả từng câu'], form: 'Đề chuyên Lý 150 phút: cơ học, nhiệt học, điện học, quang học, có câu thực nghiệm.' },
    chem: { prep: ['Học thuộc chuỗi phản ứng, cân bằng phương trình', 'Luyện bài toán hóa vô cơ, hữu cơ nâng cao', 'Học nhóm, làm thí nghiệm thực hành', 'Vào lò luyện chuyên Hóa'], exam: ['Làm chắc câu viết phương trình, nhận biết chất', 'Dồn sức cho bài toán hóa tính lượng chất', 'Soát lại hệ số cân bằng, đơn vị'], form: 'Đề chuyên Hóa 150 phút: chuỗi phản ứng, nhận biết, bài toán vô cơ và hữu cơ.' },
    bio: { prep: ['Vẽ sơ đồ tư duy di truyền, tế bào', 'Luyện bài tập di truyền, phả hệ, xác suất', 'Học nhóm, giải thích cho nhau từng cơ chế', 'Vào lò luyện chuyên Sinh'], exam: ['Làm chắc câu lý thuyết cơ chế', 'Dồn sức cho bài tập di truyền khó', 'Kiểm tra lại tỉ lệ kiểu gen, kiểu hình'], form: 'Đề chuyên Sinh 150 phút: tế bào, di truyền, phả hệ, sinh thái.' },
    it: { prep: ['Ôn lại cấu trúc dữ liệu, cú pháp ngôn ngữ', 'Cày thuật toán trên VNOI, Codeforces mỗi tối', 'Học nhóm, thi lập trình thử với bạn', 'Vào lớp luyện lập trình thi chuyên'], exam: ['Làm chắc subtask nhỏ của cả ba bài', 'Dồn sức giải trọn bài quy hoạch động khó', 'Tự sinh test, kiểm tra tràn số, thời gian chạy'], form: 'Đề chuyên Tin 150 phút: 3 bài lập trình chấm tự động, có subtask.' },
    lit: { prep: ['Đọc nhiều tác phẩm, ghi chép dẫn chứng', 'Mỗi ngày viết một bài nghị luận xã hội', 'Nhờ cô chấm, sửa từng đoạn văn', 'Vào lớp luyện chuyên Văn'], exam: ['Viết chắc bài nghị luận xã hội', 'Dồn sức cho bài nghị luận văn học, đào sâu lý luận', 'Lập dàn ý kỹ, phân bổ thời gian hai câu'], form: 'Đề chuyên Văn 150 phút: một câu nghị luận xã hội, một câu nghị luận văn học có lý luận.' },
    english: { prep: ['Nghe podcast, xem phim tiếng Anh không phụ đề', 'Học từ vựng học thuật, cụm từ cố định, viết lại câu', 'Luyện nói, viết essay với bạn rồi nhờ chữa', 'Vào lò luyện chuyên Anh'], exam: ['Làm chắc ngữ âm, từ vựng, ngữ pháp', 'Dồn sức cho đọc hiểu khó và bài viết luận', 'Chia thời gian, soát lỗi chính tả, ngữ pháp'], form: 'Đề chuyên Anh 150 phút: nghe hiểu, ngữ âm, từ vựng ngữ pháp, đọc hiểu, viết lại câu, viết luận.' },
    history: { prep: ['Lập bảng niên biểu các sự kiện', 'Luyện câu hỏi nhận định, so sánh, đánh giá', 'Học nhóm, kể lại sự kiện bằng sơ đồ', 'Vào lớp luyện chuyên Sử'], exam: ['Làm chắc câu trình bày sự kiện, mốc thời gian', 'Dồn sức cho câu nhận định, đánh giá', 'Kiểm tra mốc năm, tên nhân vật'], form: 'Đề chuyên Sử 150 phút: trình bày sự kiện, so sánh, nhận định lịch sử Việt Nam và thế giới.' },
    geo: { prep: ['Học thuộc Atlat Địa lý Việt Nam', 'Luyện vẽ và nhận xét biểu đồ, bảng số liệu', 'Học nhóm, phân tích số liệu kinh tế vùng', 'Vào lớp luyện chuyên Địa'], exam: ['Làm chắc câu khai thác Atlat', 'Dồn sức cho câu vẽ, nhận xét biểu đồ', 'Kiểm tra số liệu, đơn vị, chú giải'], form: 'Đề chuyên Địa 150 phút: khai thác Atlat, vẽ và nhận xét biểu đồ, địa lý tự nhiên và kinh tế vùng.' }
  };
  var NAME = { math: 'Toán', physics: 'Vật lý', chem: 'Hóa học', bio: 'Sinh học', it: 'Tin học', lit: 'Ngữ văn', english: 'Tiếng Anh', history: 'Lịch sử', geo: 'Địa lý' };
  E.SUBJECT_PREP = SUB;
  function st(l) { return l.flags.study54 || {}; }
  // 1. ôn đội tuyển & làm bài thi theo từng môn
  var C = E.DEC.study_contest54;
  if (C) {
    var cMake = C.make, cApply = C.apply;
    C.make = function (l) {
      var d = cMake.apply(this, arguments), s = st(l), S = SUB[s.subject]; if (!S) return d;
      if (s.stage === 'train') {
        var map = { steady: S.prep[0], intense: S.prep[1], group: S.prep[2] };
        d.opts.forEach(function (o) { if (map[o.k]) o.l = map[o.k]; if (o.k === 'intense') o.h = 'Tiến bộ nhanh hơn, dễ căng thẳng'; });
        var stop = d.opts.filter(function (o) { return o.k === 'stop'; })[0], rest = d.opts.filter(function (o) { return o.k !== 'stop'; });
        rest.push({ k: 'lo', l: S.prep[3], h: 'Khoảng ' + mo(l, V(l, 4)) + ' cả đợt · luyện đề sát dạng thi nhất' });
        d.opts = stop ? rest.concat([stop]) : rest;
        d.text = 'Ôn đội tuyển ' + NAME[s.subject] + '. Dạng bài thường gặp: ' + S.form.split(': ')[1] + ' Bạn ôn thế nào?';
      } else {
        var em = { careful: S.exam[0], hard: S.exam[1], check: S.exam[2] };
        d.opts.forEach(function (o) { if (em[o.k]) o.l = em[o.k]; });
      }
      return d;
    };
    C.apply = function (l, d, k, r, log) {
      if (k === 'lo') {
        var s = st(l); if (!(s.stage === 'train')) return;
        if (!l.indep && E.childExpense) { var b = E.childExpense(l, V(l, 4), 'Lò luyện thi ' + NAME[s.subject], false); log(b.note, 'neutral'); if (!b.ok) return cApply.call(this, l, d, 'intense', r, log); } else H.cash(l, -V(l, 4), 'Lò luyện thi ' + NAME[s.subject]);
        var x = cApply.call(this, l, d, 'intense', r, log); s.prep = (s.prep || 0) + 2; return x;
      }
      return cApply.apply(this, arguments);
    };
  }
  // 2. thi vào THPT chuyên: ôn theo môn trước khi thi
  var SP = E.DEC.study_special54;
  if (SP) {
    var spApply = SP.apply;
    SP.apply = function (l, d, k, r, log) {
      if (k === 'regular' || !SUB[k] || (l.flags.chuyenOn && l.flags.chuyenOn.done)) { if (l.flags.chuyenOn) l.flags.chuyenOn = null; return spApply.apply(this, arguments); }
      if (!this.valid(l, d.data)) return;
      l.flags.chuyenOn = { k: k, d: d, at: l.age };
      l.pending.unshift(E.DEC.chuyen_on.make(l, r));
    };
  }
  var PREP = [[7, 2, 0, 0], [9, 3, 8, 0], [7, 2, -2, 0], [10, 2, 4, 4]];
  E.SC('chuyen_on', {
    title: function (l) { var c = l.flags.chuyenOn; return 'Ôn thi chuyên ' + (c ? NAME[c.k] : ''); },
    valid: function (l) { var c = l.flags.chuyenOn; return !!c && c.at === l.age && !c.done; },
    text: function (l) { var c = l.flags.chuyenOn; return SUB[c.k].form + ' Còn ba tháng nữa là thi. Bạn ôn thế nào?'; },
    opts: [0, 1, 2, 3].map(function (i) {
      return { k: 'o' + i, l: function (l) { var c = l.flags.chuyenOn; return c ? SUB[c.k].prep[i] : ''; }, h: function (l) { return i === 3 ? 'Khoảng ' + mo(l, V(l, 4)) + ' · luyện đề sát dạng thi nhất' : i === 1 ? 'Tiến bộ nhanh, dễ căng thẳng' : ''; }, ai: { w: i === 0 ? 1.1 : 1 },
        run: function (l, r, log) {
          var c = l.flags.chuyenOn; if (!c || c.done) return; var v = PREP[i];
          if (i === 3) { if (!l.indep && E.childExpense) { var b = E.childExpense(l, V(l, 4), 'Lò luyện thi chuyên ' + NAME[c.k], false); log(b.note, 'neutral'); if (!b.ok) v = PREP[0]; } else H.cash(l, -V(l, 4), 'Lò luyện thi chuyên ' + NAME[c.k]); }
          H.fx(l, { kno: v[1] }); if (l.mind) l.mind.stress = U.clamp(l.mind.stress + v[2], 0, 100);
          log('Ôn thi chuyên ' + NAME[c.k] + ': ' + SUB[c.k].prep[i].charAt(0).toLowerCase() + SUB[c.k].prep[i].slice(1) + '.', 'neutral');
          c.done = true; var bonus = v[0] - 6; l.st.kno += bonus; try { E.DEC.study_special54.apply(l, c.d, c.k, r, log); } finally { l.st.kno -= bonus; l.flags.chuyenOn = null; }
        } };
    })
  });
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));

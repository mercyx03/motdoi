/* Một Đời — v6.2.0: ứng dụng hẹn hò hiện 5 hồ sơ để chọn
   · mỗi lần mở app (Tinder, Bumble, Hinge, Facebook Hẹn hò, Blued, HER…) hiện 5 hồ sơ ngẫu nhiên: tên, tuổi, nghề, giới thiệu, sở thích
   · bạn chọn nhắn tin với người mình muốn, lướt thêm 5 người khác, hoặc thoát app
   · đằng sau mỗi hồ sơ có thể là người tử tế, người "đào mỏ", người rủ đầu tư, ảnh ảo hay "Việt kiều gửi quà" — hồ sơ chỉ có vài dấu hiệu, không nói thẳng */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC;
  var TYPES = [['tot', 55], ['dao_mo', 15], ['dau_tu', 10], ['catfish', 12], ['qua_tang', 8]];
  var BIO = {
    tot: ['Thích nấu ăn, cuối tuần hay chạy bộ quanh hồ.', 'Mê đọc sách, đang tìm người cùng đi cà phê sách.', 'Hướng nội, nuôi hai bé mèo, thích đi biển.', 'Đi làm giờ hành chính, tối học thêm tiếng Anh.', 'Tìm người nghiêm túc, không thích nhắn tin cho vui.', 'Hay đi phượt, chụp ảnh phong cảnh.', 'Thích nhạc acoustic, biết chơi guitar vài bài.', 'Mê xem phim, cuối tuần hay đi xem rạp một mình.'],
    dao_mo: ['Thích du lịch sang, nhà hàng đẹp, đồ hiệu. Tìm người biết chiều.', 'Ảnh check-in toàn khách sạn 5 sao. "Không thích đàn ông keo kiệt."', 'Gu: người có điều kiện, chững chạc một chút.'],
    dau_tu: ['Tự do tài chính tuổi 25 nhờ đầu tư. Thích chia sẻ cách kiếm tiền.', 'Kinh doanh online, đầu tư vàng và tiền số. Tìm người cùng chí hướng.'],
    catfish: ['Chỉ có hai ảnh, ảnh nào cũng như chụp tạp chí.', 'Người mẫu ảnh, ít khi online, thích nhắn tin hơn gọi điện.'],
    qua_tang: ['Đang làm việc ở nước ngoài, sắp về Việt Nam, tìm người chân thành.', 'Kỹ sư làm việc trên giàn khoan ngoài biển, nói tiếng Việt chưa sõi.']
  };
  var LIKE = ['cà phê', 'du lịch', 'nấu ăn', 'gym', 'đọc sách', 'chơi game', 'xem phim', 'âm nhạc', 'thú cưng', 'chụp ảnh', 'đá bóng', 'cầu lông', 'leo núi', 'karaoke'];
  function wpick(r, A) { var t = 0; A.forEach(function (x) { t += x[1]; }); var y = r() * t; for (var i = 0; i < A.length; i++) { y -= A[i][1]; if (y <= 0) return A[i][0]; } return A[0][0]; }
  function profiles(l, r) {
    var out = [];
    for (var i = 0; i < 5; i++) {
      var s = H.partnerSex(l, r), t = wpick(r, TYPES), age = Math.max(18, l.age + U.randint(r, -5, 5)), q = { age: age, sex: s };
      if (H.partnerJob) H.partnerJob(l, q, r);
      var likes = []; while (likes.length < 2) { var x = U.pick(r, LIKE); if (likes.indexOf(x) < 0) likes.push(x); }
      out.push({ n: H.stranger(l, r, s), s: s, age: age, job: t === 'catfish' ? 'người mẫu ảnh' : t === 'qua_tang' ? (s === 'M' ? 'kỹ sư dầu khí ở nước ngoài' : 'bác sĩ ở nước ngoài') : q.job || 'nhân viên văn phòng', t: t, bio: U.pick(r, BIO[t]), likes: likes, km: U.randint(r, 1, t === 'qua_tang' ? 9000 : 25) });
    }
    return out;
  }
  function card(p) { return p.n + ' · ' + p.age + ' tuổi · ' + p.job + ' · cách ' + (p.km >= 1000 ? 'rất xa' : p.km + ' km') + ' — ' + p.bio + ' Thích: ' + p.likes.join(', ') + '.'; }
  SC('app_ho_so', {
    title: function (l, d) { return d.app + ' · ' + (d.page + 1 > 1 ? 'lướt thêm' : 'gợi ý hôm nay'); },
    prep: function (l, r, a) { var s = l.flags.appSwipe; if (!s || s.app !== (a && a.app) || (a && a.fresh)) s = l.flags.appSwipe = { app: (a && a.app) || 'Tinder', page: 0, at: l.age }; s.list = profiles(l, r); return { app: s.app, page: s.page, at: l.age }; },
    valid: function (l, d) { return !l.partner && l.age >= 18 && !!l.flags.appSwipe && (!d || d.at == null || d.at === l.age); },
    text: function (l, d) { var s = l.flags.appSwipe; return 'Năm hồ sơ hiện lên trên ' + d.app + ':\n' + s.list.map(function (p, i) { return (i + 1) + '. ' + card(p); }).join('\n') + '\nBạn muốn nhắn tin với ai?'; },
    opts: [0, 1, 2, 3, 4].map(function (i) {
      return { k: 'p' + i, l: function (l) { var p = l.flags.appSwipe && l.flags.appSwipe.list[i]; return p ? 'Nhắn tin với ' + p.n + ' (' + p.age + ' tuổi, ' + p.job + ')' : ''; }, req: function (l) { return !!(l.flags.appSwipe && l.flags.appSwipe.list[i]); }, ai: { w: 1 },
        run: function (l, r, log) {
          var s = l.flags.appSwipe, p = s && s.list[i]; if (!p) return; l.flags.appSwipe = null;
          if (r() < 0.2) { log('Bạn gửi lời chào ' + p.n + ' trên ' + s.app + ', nhưng ' + (p.s === 'M' ? 'anh ấy' : 'cô ấy') + ' chỉ "seen" rồi im lặng.', 'neutral'); return; }
          if ((E.HOOKUP_APP || /Tinder|Blued/).test(s.app) && l.age <= 45 && E.DEC.qua_dem && r() < 0.2) { l.pending.unshift(E.DEC.qua_dem.make(l, r, { app: s.app, name: p.n })); return; } // app quẹt nhanh: có người chỉ muốn gặp qua đêm
          l.pending.unshift(E.DEC.hen_online.make(l, r, { app: s.app, s: p.s, n: p.n, t: p.t, age: p.age, job: p.job }));
        } };
    }).concat([
      { k: 'luot', l: 'Lướt thêm 5 hồ sơ khác', req: function (l) { return !!l.flags.appSwipe && l.flags.appSwipe.page < 2; }, ai: { w: 0.4 }, run: function (l, r) { var s = l.flags.appSwipe; s.page++; l.pending.unshift(E.DEC.app_ho_so.make(l, r, { app: s.app })); } },
      { k: 'thoat', l: 'Không thấy ai hợp, thoát app', ai: { w: 0.4 }, run: function (l, r, log) { var s = l.flags.appSwipe; l.flags.appSwipe = null; log('Lướt ' + (s ? s.app : 'app') + ' một lúc mà không thấy ai hợp, bạn tắt máy đi ngủ.', 'neutral'); } }
    ])
  });
  // mở ứng dụng hẹn hò → hiện 5 hồ sơ (giữ nhóm kết bạn trung niên theo lối cũ)
  if (E.DEC.app_hen_ho) E.DEC.app_hen_ho.def.opts.forEach(function (o) {
    if (o.k === 'no' || o.k === 'trung_nien') return;
    o.run = function (l, r, log) { l.pending.unshift(E.DEC.app_ho_so.make(l, r, { app: typeof o.l === 'function' ? o.l(l) : o.l, fresh: true })); };
  });
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));

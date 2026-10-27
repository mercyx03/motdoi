/* Showbiz — Mốc 6: liên kết các hệ thống giải trí.
   · Thành tựu cho các cột mốc mới (dùng E.addAchievements sẵn có).
   · Làm tốt ở một gameshow kiến thức → được khán giả biết đến → lời mời sang một gameshow kiến thức khác (đủ điều kiện mới tham gia được).
   · Mọi chương trình đã tham gia, vai diễn, nhóm nhạc đã được ghi vào hồ sơ ở từng module (E.profile); ở đây chỉ nối các mạch. */
(function (G) {
  'use strict';
  var E = G.E, SH = E.SHOW151;
  function yr(l) { return l.birthYear + l.age; }
  function hist(l) { return (l.flags && l.flags.show151 && l.flags.show151.history) || []; }
  function genre(id) { var s = SH.SHOWS[id]; return s && s.genre; }
  if (E.addAchievements) E.addAchievements([
    ['sb_nnc', '⚡', 'Nhanh như chớp', 'Trả lời đúng 10 câu liên tiếp trong Nhanh Như Chớp', function (l) { return hist(l).some(function (h) { return h.id === 'nnc' && h.rank >= 10; }); }],
    ['sb_altp', '💰', 'Chinh phục câu hỏi số 15', 'Vượt qua cả 15 câu hỏi Ai Là Triệu Phú', function (l) { return hist(l).some(function (h) { return (h.id === 'altp' || h.id === 'millionaire') && /15 câu/.test(h.result); }); }],
    ['sb_olympia', '🏆', 'Vòng nguyệt quế năm', 'Vô địch Chung kết năm Đường Lên Đỉnh Olympia', function (l) { return !!l.flags.olympiaChampion151; }],
    ['sb_brain', '🧠', 'Biệt đội siêu trí tuệ', 'Vượt qua ba vòng Siêu Trí Tuệ Việt Nam', function (l) { return hist(l).some(function (h) { return h.id === 'stt' && /biệt đội/.test(h.result); }); }],
    ['sb_strategy', '♟️', 'Bậc thầy chiến thuật', 'Vô địch một gameshow chiến thuật', function (l) { return hist(l).some(function (h) { return genre(h.id) === 'strategy' && h.rank === 1; }); }],
    ['sb_music', '🎤', 'Quán quân', 'Vô địch một cuộc thi âm nhạc trên truyền hình', function (l) { return (l.flags.musicWin153 || []).length > 0; }],
    ['sb_couple', '💞', 'Thành đôi trên sóng', 'Cùng một người chọn nhau trong show hẹn hò', function (l) { return hist(l).some(function (h) { return genre(h.id) === 'dating' && /chọn nhau/.test(h.result); }); }],
    ['sb_award', '🎬', 'Giải thưởng điện ảnh', 'Đoạt một giải thưởng diễn xuất', function (l) { var s = l.flags.actor154; return !!(s && s.awards.some(function (a) { return a.won; })); }],
    ['sb_star', '🌟', 'Ngôi sao điện ảnh', 'Trở thành ngôi sao điện ảnh', function (l) { return !!(l.job && l.job.id === 'dien_vien' && l.job.rank >= 4); }],
    ['sb_debut', '✨', 'Ngày debut', 'Ra mắt cùng một nhóm nhạc thần tượng', function (l) { var s = l.flags.idol155; return !!(s && s.group); }],
    ['sb_survival', '🎟️', 'Tấm vé debut', 'Lọt vào đội hình debut của một chương trình sống còn', function (l) { return hist(l).some(function (h) { return genre(h.id) === 'idol' && /lọt vào đội hình/.test(h.result); }); }]
  ]);
  // Gameshow kiến thức: thành tích tốt mở lời mời sang chương trình kiến thức khác (một lần cho mỗi kết quả)
  E.HOOKS.year.push(function (l) {
    var s = l.flags && l.flags.show151; if (!s || !l.alive) return;
    s.history.forEach(function (h) {
      if (h.cross156 || genre(h.id) !== 'quiz' || h.role === 'celeb') return; h.cross156 = true;
      var good = h.prize > 0 || h.rank >= 7 || /vô địch|biệt đội/.test(h.result); if (!good) return;
      var next = Object.keys(SH.SHOWS).filter(function (id) { return id !== h.id && genre(id) === 'quiz' && SH.SHOWS[id].roles.contestant && SH.airing(l, SH.SHOWS[id]); })[0];
      if (next && !s.invites[next]) s.invites[next] = { until: yr(l) + 2, why: 'khán giả nhớ bạn từ ' + h.name };
    });
  });
  E.SHOWBIZ156 = { achievements: true };
})(globalThis.G);

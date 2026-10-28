/* Life context: extend existing childhood choices and family biographies. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, X = E.UPDATE110, L = E.LIFE138;
  var ART = /ca sĩ|diễn viên|nhạc sĩ|vũ công|đạo diễn|sản xuất âm nhạc|biên kịch|họa sĩ|nhiếp ảnh|thanh nhạc|giáo viên múa|nghệ nhân|nghệ sĩ|truyền hình/;
  function resources(l) {
    var f = l.fam || {}, base = Math.max(1, l.base), household = ((f.fAlive && !f.noDad ? f.fInc || 0 : 0) + (f.mAlive ? f.mInc || 0 : 0)) * 12;
    var ratio = l.age < 18 && !l.indep ? household / base : Math.max(0, l.money || 0) / base;
    return { household: household, ratio: ratio, band: ratio < .6 ? 0 : ratio < 1.5 ? 1 : ratio < 4 ? 2 : ratio < 15 ? 3 : 4 };
  }
  function art(l) { var f = l.fam || {}; return ['f', 'm'].filter(function (side) { return f[side + 'Alive'] && !(side === 'f' && f.noDad) && ART.test(f[side + 'Job'] || ''); }); }
  var infant = E.DEC.thoi_noi, d = infant.def;
  d.text = function (l) {
    var b = resources(l).band;
    var rc = H.resCode ? H.resCode(l) : (l.abroad && l.abroad.code) || l.country || 'VN';
    return ((H.inVN(l) || H.hasVNOrigin(l)) ? 'Sinh nhật đầu tiên, gia đình cân nhắc lễ thôi nôi.' : rc === 'KR' ? 'Sinh nhật đầu tiên, gia đình cân nhắc lễ Doljanchi (돌잔치) và nghi thức Doljabi.' : rc === 'JP' ? 'Sinh nhật 1 tuổi, gia đình cân nhắc nghi thức Erabitori chọn thẻ/đồ vật tượng trưng.' : (rc === 'CN' || rc === 'TW') ? 'Sinh nhật đầu tiên, gia đình cân nhắc lễ Chu tuế (抓周) tròn 1 tuổi.' : 'Sinh nhật đầu tiên, gia đình chọn cách kỷ niệm.') +
      [' Ngân sách rất eo hẹp: có thể dùng vài đồ chơi sẵn có, nhờ người thân cho mượn hoặc chỉ quây quần bên bé.', ' Gia đình chuẩn bị mâm nhỏ với đồ chơi sẵn có hoặc đồ mượn, vẫn có niềm vui bên nhau.', ' Gia đình có thể chuẩn bị mâm đồ chơi vừa phải tại nhà.', ' Gia đình có điều kiện chuẩn bị nhiều đồ chơi và mời người thân dự tiệc.', ' Gia đình có thể tổ chức tiệc lớn, thuê người chuẩn bị và lưu kỷ niệm.'][b] +
      ' Chỉ dùng đồ chơi lớn phù hợp trẻ một tuổi, có người lớn giám sát. Đồ vật gợi sở thích, không quyết định nghề nghiệp.';
  };
  var need = { but: 0, bong: 0, sach: 0, tien: 1, son: 1, gach: 1, cay: 1, mic: 2, ong: 2, nhac: 2, kinh: 2, may: 3 };
  var safe = { but: '✏️ Bút đồ chơi lớn, đầu tròn', tien: '💰 Tấm hình tờ tiền khổ lớn', bong: '⚽ Bóng vải mềm', mic: '🎤 Micro đồ chơi không pin rời', may: '🎮 Bảng nút bấm đồ chơi liền khối', ong: '🩺 Ống nghe đồ chơi liền khối', son: '🪮 Lược đồ chơi lớn, đầu tròn', cay: '🌱 Cây vải đồ chơi', kinh: '🔎 Kính lúp đồ chơi liền khối' };
  d.opts.forEach(function (o) {
    var req = o.req;
    o.req = function (l, data) { return (!req || req(l, data)) && resources(l).band >= (need[o.k] || 0); };
    if (safe[o.k]) o.l = safe[o.k];
    if (o.k === 'son') o.run = function (l, r, log) { H.fx(l, { hap: 2 }); H.mem(l, 'Ngày sinh nhật đầu tiên, bạn cầm chiếc lược đồ chơi, cả nhà vui cười.', 2); log('Bạn cầm chiếc lược đồ chơi đầu tròn, người lớn ở bên cùng chơi.', 'good'); };
  });
  [['simple', 'Cùng người chăm sóc hát mừng, không bày mâm', 0], ['borrow', 'Người thân cho mượn bộ đồ chơi an toàn', 0], ['homeParty', 'Tiệc nhỏ tại nhà và chụp ảnh kỷ niệm', 2], ['restaurant', 'Tiệc nhà hàng cùng người thân', 3], ['professional', 'Tiệc có người tổ chức và album gia đình', 4]].forEach(function (a) {
    d.opts.push({ k: a[0], l: a[1], req: function (l) { return resources(l).band >= a[2]; }, run: function (l, r, log) { var s = L.state(l); s.firstBirthday157 = { style: a[0], age: l.age, band: resources(l).band }; H.fx(l, { hap: 3, soc: 1 }); H.mem(l, 'Sinh nhật đầu tiên: ' + a[1].toLowerCase() + '.', 3); log(a[1] + '. Gia đình lưu lại một kỷ niệm ấm áp, không đặt sẵn tương lai của bé.', 'good'); } });
  });
  X.menu('artFamily157', 'Truyền thống nghệ thuật gia đình', function (l) { var w = X.reason(l, 5); return w !== true ? w : !art(l).length ? 'Chưa có người chăm sóc làm nghề nghệ thuật' : true; },
    'Có thể học cùng người thân hoặc chọn sở thích riêng. Nghề của bố mẹ mở cơ hội tiếp xúc, không bảo đảm tài năng hay thành công.', function (l) {
      var s = L.state(l);
      return [{ k: 'learn', l: 'Học một buổi nghệ thuật cùng người thân', why: l.age >= 18 ? 'Dành cho tuổi đang lớn' : s.artAt157 === l.age ? 'Đã sinh hoạt năm nay' : true, run: function (l, r, log) { s.artAt157 = l.age; var jobs = art(l).map(function (k) { return l.fam[k + 'Job']; }).join(' '), key = /múa|vũ công/.test(jobs) ? 'dance' : /diễn|đạo diễn|biên kịch/.test(jobs) ? 'acting' : /họa|nhiếp/.test(jobs) ? 'draw' : 'sing', sk = L.skill(l, key); sk.level = Math.min(100, sk.level + (sk.level < 60 ? 2 : 1)); s.artMentor157 = true; H.fx(l, { hap: 2 }); log('Người thân hướng dẫn bạn luyện nghệ thuật. Bạn có thêm kinh nghiệm; vẫn cần tự luyện và vượt qua tuyển chọn.', 'good'); } },
      { k: 'own', l: 'Nói với gia đình về con đường riêng', why: s.artAt157 === l.age ? 'Đã sinh hoạt năm nay' : true, run: function (l, r, log) { s.artAt157 = l.age; s.artChoice157 = 'own'; H.fx(l, { soc: 1, hap: 2 }); log('Bạn chia sẻ mong muốn theo đuổi sở thích riêng. Gia đình cùng bàn về kỳ vọng nối nghiệp.', 'neutral'); } }];
    }, 5, 'Học tập');
  E.LIFE157 = { resources: resources, art: art };
})(globalThis.G);

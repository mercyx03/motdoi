/* Một Đời — v2.9: nghề vận động viên chia theo từng môn: bóng đá, bóng rổ, bóng chuyền, bơi lội, điền kinh, cầu lông, bóng bàn,
   quần vợt, võ thuật, cử tạ, bắn cung, thể dục dụng cụ, đua xe đạp, bi-a, golf — mỗi môn có danh xưng, mức thu nhập,
   tuổi đỉnh cao / giải nghệ và sự kiện riêng (giải câu lạc bộ, AFF Cup, xuất ngoại, kỷ lục, tài trợ…). */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function T(id, when, p, cd) { E.TRIG.push({ id: id, when: when, p: p, cd: cd || 0 }); }
  function fx(l, o) { H.fx(l, o); }
  function cashB(l, x, why) { H.cash(l, x * l.base, why); }
  function mb(l, x) { return H.mb(l, x); }
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function free(l) { return !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped); }
  function yr(l) { return l.birthYear + l.age; }

  // t: danh xưng 4 bậc (năng khiếu → chuyên nghiệp → đội tuyển quốc gia → đỉnh cao) · pay: hệ số thu nhập theo bậc
  // peak: tuổi đỉnh cao · max: tuổi giải nghệ · team: môn đồng đội · sea/olympic: có thi ở SEA Games / Olympic
  var SPORTS = {
    'bóng đá': { team: 1, t: ['cầu thủ học viện bóng đá', 'cầu thủ hạng Nhất', 'cầu thủ V.League', 'tuyển thủ quốc gia'], pay: [1, 2, 4, 4], peak: 27, max: 35, club: ['Hà Nội FC', 'Công an Hà Nội', 'Thép Xanh Nam Định', 'Hoàng Anh Gia Lai', 'Becamex Bình Dương', 'Hải Phòng', 'Sông Lam Nghệ An', 'Thể Công Viettel'], abroad: ['J-League (Nhật Bản)', 'K-League (Hàn Quốc)', 'Thai League (Thái Lan)', 'một đội hạng Hai Bỉ', 'Liga 1 (Indonesia)'] },
    'bóng rổ': { team: 1, t: ['cầu thủ bóng rổ năng khiếu', 'cầu thủ bóng rổ chuyên nghiệp VBA', 'tuyển thủ bóng rổ quốc gia', 'ngôi sao bóng rổ'], pay: [1, 1.6, 1.8, 1.6], peak: 27, max: 34, club: ['Saigon Heat', 'Hanoi Buffaloes', 'Danang Dragons', 'Thang Long Warriors', 'Cantho Catfish'], abroad: ['giải bóng rổ Nhật Bản B.League', 'giải bóng rổ Philippines PBA'] },
    'bóng chuyền': { team: 1, t: ['vận động viên bóng chuyền trẻ', 'vận động viên bóng chuyền câu lạc bộ', 'tuyển thủ bóng chuyền quốc gia', 'ngôi sao bóng chuyền'], pay: [1, 1.2, 1.2, 1.2], peak: 26, max: 33, club: ['Biên Phòng', 'Thông tin LienVietPostBank', 'Ninh Bình', 'Sanest Khánh Hòa', 'Hóa chất Đức Giang'], abroad: ['giải bóng chuyền Thái Lan', 'giải bóng chuyền Nhật Bản V.League'] },
    'bơi lội': { t: ['vận động viên bơi năng khiếu', 'vận động viên bơi đội tuyển tỉnh', 'kình ngư đội tuyển quốc gia', 'kình ngư số một quốc gia'], pay: [1, 1, 1, 1.1], peak: 22, max: 28 },
    'điền kinh': { t: ['vận động viên điền kinh năng khiếu', 'vận động viên điền kinh đội tuyển tỉnh', 'vận động viên điền kinh quốc gia', 'nữ hoàng / ông hoàng tốc độ'], pay: [1, 1, 1, 1], peak: 25, max: 32 },
    'cầu lông': { t: ['tay vợt cầu lông năng khiếu', 'tay vợt cầu lông đội tuyển tỉnh', 'tay vợt cầu lông quốc gia', 'tay vợt cầu lông hàng đầu châu Á'], pay: [1, 1, 1.1, 1.5], peak: 25, max: 32 },
    'bóng bàn': { t: ['vận động viên bóng bàn năng khiếu', 'vận động viên bóng bàn đội tuyển tỉnh', 'tay vợt bóng bàn quốc gia', 'tay vợt bóng bàn số một'], pay: [1, 1, 1, 1], peak: 26, max: 35 },
    'quần vợt': { t: ['tay vợt quần vợt trẻ', 'tay vợt quần vợt chuyên nghiệp', 'tay vợt quần vợt số một quốc gia', 'tay vợt hệ thống ATP / WTA'], pay: [1, 1.3, 1.5, 3], peak: 26, max: 34 },
    'võ thuật': { t: ['võ sĩ năng khiếu', 'võ sĩ đội tuyển tỉnh', 'võ sĩ đội tuyển quốc gia', 'nhà vô địch võ thuật'], pay: [1, 1, 1, 1.2], peak: 25, max: 33, arts: ['karate', 'taekwondo', 'vovinam', 'pencak silat', 'boxing', 'judo'] },
    'cử tạ': { t: ['lực sĩ cử tạ năng khiếu', 'lực sĩ cử tạ đội tuyển tỉnh', 'lực sĩ cử tạ quốc gia', 'lực sĩ cử tạ hàng đầu thế giới'], pay: [1, 1, 1, 1.2], peak: 25, max: 32 },
    'bắn cung': { t: ['cung thủ năng khiếu', 'cung thủ đội tuyển tỉnh', 'cung thủ quốc gia', 'cung thủ hàng đầu'], pay: [1, 1, 1, 1], peak: 28, max: 42 },
    'thể dục dụng cụ': { t: ['vận động viên thể dục dụng cụ năng khiếu', 'vận động viên thể dục dụng cụ đội tuyển tỉnh', 'vận động viên thể dục dụng cụ quốc gia', 'ngôi sao thể dục dụng cụ'], pay: [1, 1, 1, 1.1], peak: 20, max: 27 },
    'đua xe đạp': { t: ['cua-rơ trẻ', 'cua-rơ câu lạc bộ', 'cua-rơ đội tuyển quốc gia', 'cua-rơ hàng đầu'], pay: [1, 1, 1.1, 1.2], peak: 27, max: 34 },
    'bi-a': { t: ['cơ thủ phong trào', 'cơ thủ chuyên nghiệp', 'cơ thủ đội tuyển quốc gia', 'cơ thủ hàng đầu thế giới'], pay: [1, 1.2, 1.5, 3], peak: 32, max: 48, olympic: false },
    'golf': { t: ['golfer nghiệp dư', 'golfer chuyên nghiệp', 'golfer số một quốc gia', 'golfer thi đấu hệ thống quốc tế'], pay: [1, 1.5, 2, 4], peak: 30, max: 45, sea: true }
  };
  Object.keys(SPORTS).forEach(function (k) { SPORTS[k].n = k; });
  function info(l) { return SPORTS[l.talentSub] || SPORTS['điền kinh']; }
  E.SPORTS = SPORTS;
  E.sportInfo = info;
  E.sportTitle = function (l, rk) {
    var S = info(l), t = S.t[Math.min(rk, 3)];
    if (S.arts && l.job && l.job.art) t += ' (' + l.job.art + ')';
    if (S.team && l.job && l.job.club && rk >= 1) t += ' · ' + l.job.club;
    return t;
  };
  E.sportPay = function (l, rk) { var S = info(l); return (S.pay[Math.min(rk, 3)] || 1) * (l.job && l.job.abroadUntil > l.age ? 2 : 1); };

  // ---------- mỗi năm: câu lạc bộ, chuyển nhượng, giải đấu riêng của từng môn ----------
  function sportYear(l, r, log, a) {
    if (!l.job || E.resolveJob(l.job.id) !== 'vdv') return;
    var S = info(l), rk = l.job.rank || 0, y = yr(l);
    if (S.arts && !l.job.art) l.job.art = pick(r, S.arts);
    if (S.team && rk >= 1 && !l.job.club && S.club) { l.job.club = pick(r, S.club); log('Ký hợp đồng chuyên nghiệp với câu lạc bộ ' + l.job.club + '.', 'good'); }
    if (l.job.abroadUntil && a >= l.job.abroadUntil) { l.job.abroadUntil = null; log('Hết hợp đồng thi đấu ở nước ngoài, trở về khoác áo câu lạc bộ trong nước.', 'neutral'); }
    if (S.n === 'bóng đá') {
      if (rk >= 2 && l.job.club && ch(r, 0.1)) { log(l.job.club + ' vô địch V.League! Bạn cùng đồng đội diễu hành trên xe buýt mui trần.', 'big'); cashB(l, 0.3, 'Thưởng vô địch V.League'); l.fame = (l.fame || 0) + 3e4; H.mem(l, 'Mùa giải vô địch V.League cùng ' + l.job.club + '.', 5); }
      if (rk >= 3 && isVN(l) && y % 2 === 0 && ch(r, 0.3 + (l.skill - 80) / 100)) { log('Đội tuyển Việt Nam vô địch ASEAN Cup ' + y + '! Cả nước xuống đường mừng chiến thắng, bạn được thưởng nóng.', 'big'); cashB(l, 2, 'Thưởng vô địch ASEAN Cup'); l.fame = (l.fame || 0) * 1.5 + 2e5; fx(l, { hap: 12 }); l.medals.push({ ev: 'ASEAN Cup ' + y, m: 'vàng', y: y }); H.mem(l, 'Đêm vô địch ASEAN Cup ' + y + ', biển cờ đỏ sao vàng trên khắp phố.', 8); }
      if (rk >= 3 && y % 4 === 1 && ch(r, 0.05)) { log('Đội tuyển lọt vào vòng loại cuối World Cup — thành tích lịch sử!', 'big'); fx(l, { hap: 8 }); l.fame = (l.fame || 0) + 1e5; }
    }
    if (S.n === 'quần vợt' && rk >= 2 && ch(r, 0.15 + (l.skill - 80) / 100)) { log('Vô địch một giải ATP Challenger, điểm xếp hạng thế giới tăng vọt.', 'big'); cashB(l, 0.6, 'Tiền thưởng giải quần vợt'); l.fame = (l.fame || 0) + 5e4; }
    if (S.n === 'bơi lội' && rk >= 2 && ch(r, 0.12 + (l.skill - 80) / 120)) { log('Phá kỷ lục quốc gia nội dung ' + pick(r, ['200 m tự do', '400 m hỗn hợp', '1.500 m tự do', '100 m bướm']) + '.', 'good'); fx(l, { hap: 6 }); H.mem(l, 'Nhìn lên bảng điện tử thấy chữ "KỶ LỤC" cạnh tên mình.', 4); }
    if (S.n === 'bi-a' && rk >= 2 && ch(r, 0.12 + (l.skill - 80) / 100)) { log('Vô địch một giải bi-a carom 3 băng World Cup, cả làng bi-a Việt Nam tự hào.', 'big'); cashB(l, 0.8, 'Tiền thưởng giải bi-a'); l.fame = (l.fame || 0) + 8e4; }
    if (S.n === 'golf' && rk >= 1 && ch(r, 0.15)) { log('Về nhất một giải golf chuyên nghiệp, nhận tấm séc tiền thưởng.', 'good'); cashB(l, 0.5, 'Tiền thưởng giải golf'); }
    if (S.n === 'võ thuật' && rk >= 2 && ch(r, 0.15)) { log('Giành đai vô địch ' + (l.job.art || 'võ thuật') + ' châu Á.', 'good'); fx(l, { hap: 6 }); }
    if (rk >= 3 && (l.fame || 0) >= 1e5 && ch(r, 0.2)) { var b = pick(r, ['một hãng đồ uống thể thao', 'một hãng giày', 'một ngân hàng', 'một hãng sữa']); log('Ký hợp đồng quảng cáo với ' + b + '.', 'good'); cashB(l, 1 + (l.fame || 0) / 1e6, 'Hợp đồng quảng cáo'); }
  }

  // ---------- trận đấu lớn ----------
  var BIG = {
    'bóng đá': ['Trận derby căng như dây đàn, đối thủ chơi rắn.', 'Chung kết Cúp Quốc gia, khán đài kín chỗ.', 'Trận cầu sinh tử trụ hạng cuối mùa.'],
    'bóng rổ': ['Trận chung kết VBA, tỉ số bám đuổi đến những giây cuối.'], 'bóng chuyền': ['Trận chung kết giải vô địch quốc gia, set thứ năm giằng co.'],
    'quần vợt': ['Trận bán kết dưới cái nắng 38 độ, đối thủ hạng cao hơn bạn 100 bậc.'], 'võ thuật': ['Trận chung kết gặp nhà vô địch châu Á.'],
    'bi-a': ['Trận chung kết kéo dài đến nửa đêm, chỉ còn một lượt cơ.'], 'golf': ['Lỗ cuối cùng của vòng chung kết, chỉ cần một cú putt.']
  };
  SC('tt_tran_lon', {
    title: 'Trận đấu quan trọng', prep: function (l, r) { var S = info(l); return { t: pick(r, BIG[S.n] || ['Chung kết giải vô địch quốc gia môn ' + S.n + '.']), n: S.n }; },
    valid: function (l) { return !!(l.job && E.resolveJob(l.job.id) === 'vdv' && l.job.rank >= 1); },
    text: function (l, d) { return d.t + (l.injured ? ' Chấn thương cũ vẫn còn âm ỉ.' : ''); },
    opts: [
      { k: 'all', l: 'Thi đấu hết mình', ai: { w: 1.4, amb: 1 }, run: function (l, r, log, d) {
        if (ch(r, 0.12)) { log('Dốc hết sức thì dính chấn thương, phải nghỉ thi đấu mấy tháng.', 'bad'); fx(l, { hea: -10 }); l.skill = Math.max(0, l.skill - 6); return; }
        if (ch(r, 0.4 + (l.skill - 60) / 100)) { log('Chiến thắng! Bạn là nhân tố quyết định của trận đấu.', 'big'); l.fame = (l.fame || 0) + 2e4; fx(l, { hap: 8 }); cashB(l, 0.1, 'Thưởng trận thắng'); H.mem(l, 'Khoảnh khắc ' + (d.n === 'bóng đá' ? 'ghi bàn quyết định' : 'giành điểm quyết định') + ' giữa tiếng hò reo.', 4); }
        else { log('Thua sát nút. Ngồi lặng trong phòng thay đồ rất lâu.', 'bad'); fx(l, { hap: -5 }); }
      } },
      { k: 'safe', l: 'Thi đấu chừng mực, tránh chấn thương', ai: { w: 0.8, smart: 0.5 }, run: function (l, r, log) { log(ch(r, 0.35) ? 'Thắng nhẹ nhàng nhờ đồng đội tỏa sáng.' : 'Thua trận, bị huấn luyện viên phê bình thiếu quyết tâm.', 'neutral'); } }
    ]
  });
  T('tt_tran_lon', function (l) { return !!(l.job && E.resolveJob(l.job.id) === 'vdv' && l.job.rank >= 1) && free(l); }, 0.3, 1);

  // ---------- lời mời thi đấu ở nước ngoài ----------
  SC('tt_xuat_ngoai', {
    title: 'Lời mời từ nước ngoài', prep: function (l, r) { var S = info(l); return { c: pick(r, S.abroad || ['một câu lạc bộ nước ngoài']), m: U.randint(r, 2, 3) }; },
    valid: function (l) { var S = info(l); return !!(l.job && E.resolveJob(l.job.id) === 'vdv' && S.abroad && l.job.rank >= 2 && !l.job.abroadUntil); },
    text: function (l, d) { return 'Một đội bóng ở ' + d.c + ' muốn mượn bạn ' + d.m + ' năm, lương gấp đôi. Ở đó cạnh tranh suất đá chính rất khốc liệt.'; },
    opts: [
      { k: 'go', l: 'Sang thử thách bản thân', ai: { amb: 1.2, risk: 0.6 }, run: function (l, r, log, d) { l.job.abroadUntil = l.age + d.m; H.visit(l, String(d.c).replace(/.*\((.*)\).*/, '$1')); if (ch(r, 0.45 + (l.skill - 75) / 80)) { log('Sang ' + d.c + ', giành được suất đá chính sau nửa mùa giải. Truyền thông trong nước theo dõi từng trận.', 'big'); l.skill = Math.min(100, l.skill + 6); l.fame = (l.fame || 0) + 1e5; H.mem(l, 'Mùa giải đầu tiên ở ' + d.c + '.', 5); } else { log('Sang ' + d.c + ' nhưng chủ yếu ngồi dự bị. Một bài học lớn.', 'neutral'); fx(l, { hap: -4 }); } } },
      { k: 'stay', l: 'Ở lại câu lạc bộ trong nước', ai: { w: 1 }, run: function (l, r, log) { log('Từ chối lời mời, ở lại làm trụ cột cho câu lạc bộ.', 'neutral'); } }
    ]
  });
  T('tt_xuat_ngoai', function (l) { var S = info(l); return !!(l.job && E.resolveJob(l.job.id) === 'vdv' && S.abroad && l.job.rank >= 2 && l.skill >= 72 && !l.job.abroadUntil) && free(l); }, 0.12, 4);

  E.HOOKS.year.push(sportYear);
  E.sports = { SPORTS: SPORTS, sportYear: sportYear };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));

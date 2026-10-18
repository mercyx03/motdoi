/* v4.5.4 — cùng danh mục game, lịch sử chơi và cửa hàng vật phẩm. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H;
  // Giá VNĐ là ngân sách mô phỏng, không phải báo giá trực tiếp của nhà phát hành.
  var cats = { fps: ['Counter-Strike 2', 'Valorant', 'Delta Force', 'Free Fire', 'Đột Kích (CrossFire)', 'PUBG Mobile'], moba: ['Liên Minh Huyền Thoại', 'Liên Quân Mobile', 'Mobile Legends: Bang Bang', 'Liên Minh: Tốc Chiến'], other: ['Minecraft', 'Roblox', 'Nghịch Thủy Hàn', 'Đấu Trường Chân Lý (TFT)'] };
  var names = { fps: 'FPS', moba: 'MOBA', other: 'Game khác' }, all = [].concat(cats.fps, cats.moba, cats.other);
  var aliases = { CS2: 'Counter-Strike 2', CF: 'Đột Kích (CrossFire)', 'Liên quân': 'Liên Quân Mobile', 'Liên Minh Tốc Chiến': 'Liên Minh: Tốc Chiến', 'Delta Force Mobile': 'Delta Force' };
  function norm(g) { return aliases[g] || g; }
  function free(l) { return l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }
  function played(l) { return (l.flags.homeGames || []).map(norm).filter(function (g, i, a) { return all.indexOf(g) >= 0 && a.indexOf(g) === i; }); }
  function cost(l, n) { return l.cur === 'vnd' ? n : n / 90 * l.base; }
  function queue(l, r, id, arg) { l.pending.unshift(E.DEC[id].make(l, r, arg)); }
  function opts(list, cb) { return list.map(function (x) { return { k: x, l: x, run: cb(x) }; }); }
  var back = { k: 'no', l: 'Để dịp khác', run: function () {} };
  E.HOME_GAMES = cats; E.playedGames = played;
  E.GAMES.fps.pc = cats.fps.slice(0, 3).concat([cats.fps[4]]); E.GAMES.fps.mobile = ['Free Fire', 'PUBG Mobile'];
  E.GAMES.moba.pc = [cats.moba[0]]; E.GAMES.moba.mobile = cats.moba.slice(1);
  E.SC('choi_game_nha', { title: 'Chơi game ở nhà', valid: free, text: 'Bạn muốn chơi thể loại nào?', opts: Object.keys(cats).map(function (c) { return { k: c, l: names[c], run: function (l, r) { queue(l, r, 'home_game_list', { cat: c }); } }; }).concat([back]) });
  E.SC('home_game_list', { title: function (l, d) { return names[d.cat]; }, valid: free, text: 'Chọn game bạn muốn chơi:', prep: function (l, r, a) { return { cat: a && cats[a.cat] ? a.cat : 'other' }; }, opts: opts(all, function (g) { return function (l, r, log, d) { if (cats[d.cat].indexOf(g) >= 0) queue(l, r, 'home_game_play', { g: g }); }; }).map(function (o) { o.req = function (l, d) { return cats[d.cat].indexOf(o.k) >= 0; }; return o; }).concat([back]) });
  function play(l, d, log, night) {
    if (!free(l) || all.indexOf(d.g) < 0) return;
    l.flags.homeGames = played(l); if (l.flags.homeGames.indexOf(d.g) < 0) l.flags.homeGames.push(d.g);
    l.flags.lastHomeGame = d.g;
    if (E.esportsPractice) E.esportsPractice(l, d.g, night);
    H.fx(l, night ? { hap: 3, hea: -2, kno: -1 } : { hap: 2 });
    if (night && l.talent === 'game' && norm(l.game) === d.g) l.skill = Math.min(100, (l.skill || 20) + 3);
    log('Chơi ' + d.g + (night ? ' xuyên đêm, sáng ra mệt mỏi.' : ' một lúc để thư giãn.'), 'neutral');
  }
  E.SC('home_game_play', { title: function (l, d) { return d.g || 'Chơi game'; }, valid: function (l, d) { return free(l) && !!d && all.indexOf(d.g) >= 0; }, text: 'Bạn muốn chơi thế nào?', opts: [
    { k: 'bit', l: 'Chơi một lúc rồi nghỉ', run: function (l, r, log, d) { play(l, d, log, false); } },
    { k: 'night', l: 'Cày xuyên đêm', run: function (l, r, log, d) { play(l, d, log, true); } }, back
  ] });
  // Bậc giá có căn cứ: Riot (875/1775 VP, 1350/1820 RP), Garena (399/599 QH).
  // Các game không công khai bảng giá ổn định dùng ngân sách, không bịa giá một skin cụ thể.
  var catalog = {
    'Valorant': [['Skin Select — 875 VP', 0.18], ['Skin Premium — 1.775 VP', 0.36]],
    'Liên Minh Huyền Thoại': [['Skin Sử thi — 1.350 RP', 0.25], ['Skin Huyền thoại — 1.820 RP', 0.34]],
    'Liên Quân Mobile': [['Trang phục cửa hàng — 399 Quân Huy', 0.20], ['Trang phục cửa hàng — 599 Quân Huy', 0.30]],
    'Counter-Strike 2': [['Ngân sách skin trên Steam Market', 0.10], ['Ngân sách skin trên Steam Market', 1]],
    'Minecraft': [['Battle & Beasts 2 Skin Pack — 310 Minecoins', 0.06]],
    'Roblox': [['Phụ kiện avatar — ngân sách Robux', 0.13]],
    'Liên Minh: Tốc Chiến': [['Trang phục trong cửa hàng — ngân sách Wild Cores', 0.25]],
    'Mobile Legends: Bang Bang': [['Trang phục cửa hàng — ngân sách kim cương', 0.25]],
    'Delta Force': [['Ngoại hình cửa hàng — ngân sách Delta Coins', 0.30]],
    'Free Fire': [['Trang phục cửa hàng — ngân sách kim cương', 0.20]],
    'Đột Kích (CrossFire)': [['Vật phẩm cửa hàng — ngân sách Vcoin', 0.30]],
    'PUBG Mobile': [['Trang phục bán trực tiếp — ngân sách UC', 0.30]],
    'Nghịch Thủy Hàn': [['Ngoại trang Nghịch Thủy Hàn', 1]],
    'Đấu Trường Chân Lý (TFT)': [['Linh thú tí nị', 2.5], ['Linh thú đột phá', 2.5], ['Linh thú hàng hiệu', 7]]
  };
  E.GAME_SHOP = catalog;
  function has(l, d) { return free(l) && played(l).indexOf(d.g) >= 0; }
  function own(l, d, label, log) { var a = l.flags.gameItems || (l.flags.gameItems = []); var item = label.replace('Ngân sách skin trên Steam Market', 'skin trên Steam Market').replace(/ — ngân sách.*$/, '').replace(' — ngân sách', ''); a.push({ game: d.g, item: item, age: l.age }); H.fx(l, { hap: 2 }); log(d.g + ': nhận ' + item + '.', 'good'); }
  E.SC('nap_game', { title: 'Vật phẩm cho game đã chơi', valid: function (l) { return free(l) && played(l).length > 0; }, prep: function (l, r, a) { var p = played(l); return { g: a && p.indexOf(a.g) >= 0 ? a.g : p.indexOf(l.flags.lastHomeGame) >= 0 ? l.flags.lastHomeGame : p[0] }; },
    text: function (l, d) { if (/Nghịch Thủy Hàn|Đấu Trường Chân Lý/.test(d.g)) return 'Chọn vật phẩm cho ' + d.g + '.'; return d.g ? 'Bạn đang xem vật phẩm của ' + d.g + '. Giá quy đổi VNĐ là ước tính, thay đổi theo máy chủ, gói nạp và khuyến mại. Ngân sách không phải báo giá một skin cụ thể.' + (d.g === 'Counter-Strike 2' ? ' Giá chợ còn phụ thuộc mẫu, độ mòn và người bán.' : '') : 'Hãy chọn và chơi một game ở nhà trước.'; },
    opts: [0, 1, 2].map(function (i) { return { k: 'buy' + i, l: function (l, d) { var x = (catalog[d.g] || [])[i]; return x ? x[0] + ' — ~' + H.money(l, cost(l, x[1])) : ''; }, req: function (l, d) { return has(l, d) && !!(catalog[d.g] || [])[i]; }, run: function (l, r, log, d) { if (!has(l, d)) return; var x = catalog[d.g][i], n = cost(l, x[1]); if (l.money < n) { log('Chưa đủ tiền tiết kiệm để mua vật phẩm ' + d.g + '.', 'neutral'); return; } H.cash(l, -n, 'Vật phẩm ' + d.g); own(l, d, x[0], log); } }; }).concat([
      { k: 'free', l: 'Dùng skin tự tạo / miễn phí', req: function (l, d) { return has(l, d) && /Minecraft|Roblox/.test(d.g); }, run: function (l, r, log, d) { if (has(l, d)) own(l, d, 'diện mạo miễn phí', log); } },
      { k: 'game', l: 'Chọn game đã chơi khác', req: function (l) { return played(l).length > 1; }, run: function (l, r) { queue(l, r, 'home_skin_games'); } },
      { k: 'no', l: 'Giữ đồ hiện tại, không nạp', run: function () {} }
    ]) });
  E.SC('home_skin_games', { title: 'Vật phẩm game', valid: function (l) { return free(l) && played(l).length > 0; }, text: 'Chỉ hiện những game bạn đã chơi ở nhà:', opts: opts(all, function (g) { return function (l, r) { queue(l, r, 'nap_game', { g: g }); }; }).map(function (o) { o.req = function (l) { return free(l) && played(l).indexOf(o.k) >= 0; }; return o; }).concat([back]) });
  E.ACT.push({ id: 'home_skin_games', g: E.ACT.filter(function (a) { return a.id === 'choi_game_nha'; })[0].g, l: 'Skin / vật phẩm game đã chơi', min: 6, avail: function (l) { return free(l) && played(l).length > 0 ? true : 'Chơi một game ở nhà trước'; }, ai: { w: 0.03 } });
  E.TRIG.filter(function (t) { return t.id === 'nap_game'; }).forEach(function (t) { var before = t.when; t.when = function (l, a) { return free(l) && played(l).length > 0 && before(l, a); }; });
  E.skinPrice = function (g) { return catalog[norm(g)] ? catalog[norm(g)][0][1] : 0; };
})(globalThis.G);

'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert');
const root = path.join(__dirname, '..', 'public'), html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const [, file] of html.matchAll(/<script src="(js\/[^?]+)\?v=[^"]+"><\/script>/g)) if (!['js/app.js', 'js/music.js', 'js/card.js'].includes(file)) vm.runInThisContext(fs.readFileSync(path.join(root, file), 'utf8'), { filename: file });
const E = G.E; let n = 0; const ok = (x, t) => { assert.ok(x, t); n++; };
const r = () => 0.1;
function life() { const l = E.createLife({ mode: 'vn', seed: 45401, gender: 'M' }); l.age = 12; l.pending = []; l.money = 10; l.game = 'Valorant'; return l; }
function run(l, id, k, arg) { const d = E.DEC[id].make(l, r, arg); E.DEC[id].apply(l, d, k, r, () => {}); return d; }
ok(G.VERSION === require('../package.json').version && html.includes('life50.js'), 'bản mới được tải');
for (const cat of Object.keys(E.HOME_GAMES)) for (const game of E.HOME_GAMES[cat]) {
  const l = life();
  ok(!E.DEC.nap_game.valid(l), 'chưa chơi thì không có sự kiện skin');
  run(l, 'choi_game_nha', cat); const list = l.pending.shift();
  ok(list.id === 'home_game_list' && list.opts.some(o => o.k === game), 'thể loại chứa game ' + game);
  run(l, list.id, game, list.data); const play = l.pending.shift();
  ok(play.id === 'home_game_play' && !E.DEC.nap_game.valid(l), 'chọn tên chưa tính đã chơi');
  run(l, play.id, 'bit', play.data);
  ok(E.playedGames(l).length === 1 && E.playedGames(l)[0] === game && l.game === 'Valorant', 'lưu lịch sử riêng, không đổi game năng khiếu');
  const shop = E.DEC.nap_game.make(l, r); ok(shop.data.g === game && shop.opts.some(o => o.k === 'buy0'), 'skin đúng game đã chơi');
  const cash = l.money; run(l, 'nap_game', 'buy0', shop.data);
  ok(l.money < cash && l.money >= 0 && l.flags.gameItems[0].game === game, 'trả tiền và nhận đúng vật phẩm');
  l.money = 0; run(l, 'nap_game', 'buy0', shop.data); ok(l.money === 0 && l.flags.gameItems.length === 1, 'không tiêu tiền âm');
  l.jailUntil = 14; const cash2 = l.money; run(l, 'nap_game', 'buy0', shop.data); ok(l.money === cash2 && !E.DEC.nap_game.valid(l), 'cảnh cũ bị chặn khi vào tù');
}
{
  const l = life(); run(l, 'home_game_play', 'no', { g: 'Minecraft' }); ok(E.playedGames(l).length === 0, 'thoát không tính đã chơi');
  run(l, 'home_game_play', 'bit', { g: 'Minecraft' }); run(l, 'home_game_play', 'bit', { g: 'Roblox' }); run(l, 'home_game_play', 'bit', { g: 'Minecraft' });
  ok(E.playedGames(l).length === 2, 'chơi nhiều lần không nhân đôi lịch sử');
  const list = E.DEC.home_skin_games.make(l, r); ok(list.opts.filter(o => o.k !== 'no').length === 2 && !list.opts.some(o => o.k === 'Valorant'), 'chỉ liệt kê game đã chơi, không lấy game năng khiếu ngẫu nhiên');
  const cash = l.money; run(l, 'nap_game', 'free', { g: 'Minecraft' }); ok(l.money === cash && l.flags.gameItems[0].game === 'Minecraft', 'Minecraft có diện mạo miễn phí');
  const saved = JSON.parse(JSON.stringify(l)); ok(E.playedGames(saved).length === 2, 'lịch sử giữ qua save/load');
  ok(E.GAMES.fps.mobile.includes('PUBG Mobile'), 'PUBG được thêm theo yêu cầu mới');
  const trigger = E.TRIG.find(t => t.id === 'nap_game'); const fresh = life(); ok(!trigger.when(fresh, 12), 'trigger không tự phát game chưa chơi');
  ok(E.GAME_SHOP.Valorant[1][0].includes('1.775 VP') && E.GAME_SHOP['Liên Minh Huyền Thoại'][0][0].includes('1.350 RP'), 'bậc giá tiền trong game');
}
console.log('PASS: ' + n + ' kiểm tra đồng bộ game / skin bản 4.5.4.');

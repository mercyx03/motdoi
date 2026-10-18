/* v4.5.2 — Mùa game show trong một năm. Trò chơi, khách mời, đội và kết quả
   là diễn biến mô phỏng; không tái hiện một tập phát sóng có thật. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U;
  var TITLES = { rm: 'Running Man Việt Nam', hai: '2 Ngày 1 Đêm' };
  var ROLES = { guest: { n:'khách mời', total:2, factor:.4 }, regular: { n:'thành viên cố định', total:6, factor:1.5 } };
  function roleName(v) { return (ROLES[v.role]||ROLES.regular).n; }
  function stages(v) { return v.compact ? [1,4] : v.role === 'guest' ? [0,1,4] : [0,1,2,3,4]; }
  function quote(fee,role) { return Math.max(0,Math.round((Number(fee)||0)*ROLES[role].factor)); }
  var LOCATIONS = ['Đà Lạt', 'Huế', 'Ninh Bình', 'Phú Yên', 'Quảng Bình', 'Cần Thơ', 'Nha Trang', 'Đà Nẵng'];
  var TASKS = {
    rm: ['Giải mật thư trong mê cung', 'Tiếp sức chuyền bóng', 'Truy tìm chiếc hộp bí mật', 'Đoán từ bằng hành động', 'Thử thách giữ thăng bằng', 'Ghép manh mối truy tìm huy hiệu', 'Vượt chướng ngại vật', 'Đối đáp phản xạ'],
    hai: ['Tiếp sức mang đặc sản', 'Đố vui về văn hóa địa phương', 'Đoán món ăn bằng gợi ý', 'Ghép bản đồ hành trình', 'Truy tìm vật phẩm trong làng', 'Phối hợp giữ bóng', 'Thử thách khéo tay', 'Ghi nhớ lời bài hát']
  };
  function year(l) { return l.birthYear + l.age; }
  function free(l) { return l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }
  function musicBusy(l) { var t = l.flags.tv; return !!(t && !t.done && !t.out && !t.no); }
  function season(l) { return l.flags.variety; }
  function busy(l) { var v = season(l); return !!(v && !v.done); }
  function invite(l) { var c = l.job && E.jobDef(l); return free(l) && H.isVN(l) && l.age >= 18 && l.age <= 55 && l.st.hea >= 45 && (l.fame || 0) >= 1e5 && c && /^(show|media|creator|sport)$/.test(c.cat) && !musicBusy(l) && !busy(l) && !(season(l) && season(l).year === year(l)); }
  function shuffle(r, a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  function pick(r, a) { return U.pick(r, a); }
  function valid(l, d) { var v = season(l); return free(l) && !!v && !v.done && v.year === year(l) && l.st.hea >= 25 && stages(v).indexOf(v.stage)>=0 && (!d || d.token == null || (d.token === v.token && d.ep === v.ep && d.stage === v.stage)); }
  function guests(l, r) {
    var all = [], seen = {};
    ['vn', 'rapvn'].forEach(function (cat) { E.CONCERT_CATS[cat].a.forEach(function (a) { if (year(l) - a.b >= 18 && year(l) - a.b <= 60 && a.n !== l.name && !seen[a.n]) { seen[a.n] = 1; all.push(a.n); } }); });
    var count=season(l).role==='guest'?1:2;
    all = shuffle(r, all).slice(0, count);
    for (var tries = 0; all.length < count && tries < 50; tries++) { var n = H.stranger(l, r, r() < 0.5 ? 'M' : 'F'); if (n !== l.name && all.indexOf(n) < 0) all.push(n); }
    return all;
  }
  function episode(l, r) {
    var v = season(l), cast = v.regulars.concat(guests(l, r)).filter(function (n, i, a) { return n !== l.name && a.indexOf(n) === i; });
    for (var tries = 0; cast.length < 7 && tries < 50; tries++) { var n = H.stranger(l, r, r() < 0.5 ? 'M' : 'F'); if (n !== l.name && cast.indexOf(n) < 0) cast.push(n); }
    cast = shuffle(r, cast).slice(0, 7);
    v.team = [l.name].concat(cast.slice(0, 3)); v.opponents = cast.slice(3);
    v.guests = (v.role==='guest'?[l.name]:[]).concat(cast.filter(function (n) { return v.regulars.indexOf(n) < 0; }));
    v.location = v.routes[v.ep]; v.task = v.tasks[v.ep]; v.score = 0; v.style = 0; v.stage = v.compact ? 1 : 0; v.clues = 0;
  }
  function finish(l, log, reason) {
    var v = season(l); if (!v || v.done) return;
    v.done = true; v.reason = reason || 'completed';
    var earned = Math.round(v.fee * v.completed / v.total);
    if (!v.paid) { v.paid = true; v.earned = earned; if (earned > 0) H.cash(l, earned, 'Cát-xê ' + TITLES[v.k] + ' (' + v.completed + '/' + v.total + ' tập)'); }
    log((reason ? 'Dừng lịch quay ' : 'Hoàn tất mùa mô phỏng ') + TITLES[v.k] + ' với vai trò '+roleName(v)+': đã quay ' + v.completed + '/' + v.total + ' tập, thắng ' + v.wins + ' tập. Khán giả quan tâm thêm: '+(v.audienceGain||0)+' người theo dõi. Cát-xê thực nhận ' + H.money(l, earned) + (reason ? '. Lý do: ' + reason + '.' : '.'), reason ? 'neutral' : 'big');
    l.pending = l.pending.filter(function (d) { return d.id !== 'vr_vong'; });
  }
  function queue(l, r, log) { if (!valid(l)) { finish(l, log, 'không thể tiếp tục lịch quay'); return; } var d = E.DEC.vr_vong.make(l, r); if (season(l).manual) d.manual = true; l.pending.unshift(d); }
  function start(l, r, log, d, k, role) {
    if (!invite(l) || !ROLES[role]) { log('Không thể nhận thêm lịch quay lúc này: lịch trùng hoặc chưa đáp ứng điều kiện.', 'neutral'); return; }
    var regulars = [], tries = 0;
    while (regulars.length < (role==='guest'?6:5) && tries++ < 60) { var n = H.stranger(l, r, r() < 0.5 ? 'M' : 'F'); if (n !== l.name && regulars.indexOf(n) < 0) regulars.push(n); }
    l.flags.varietySerial = (l.flags.varietySerial || 0) + 1;
    l.flags.variety = { compact: true, k: k, token: l.flags.varietySerial, year: year(l), age: l.age, role:role, manual:!!d.manual, ep: 0, total: ROLES[role].total, completed: 0, wins: 0, fee: quote(d.fee,role), audienceGain:0, paid: false, regulars: regulars, routes: shuffle(r, LOCATIONS).slice(0, ROLES[role].total), tasks: shuffle(r, TASKS[k]).slice(0, ROLES[role].total), history: [] };
    episode(l, r);
    log('Nhận lời tham gia ' + TITLES[k] + ' làm '+roleName(season(l))+': '+season(l).total+' tập mô phỏng trong năm '+year(l) + ', dự kiến cát-xê ' + H.money(l, season(l).fee) + '. Quyết toán theo số tập thực sự hoàn thành; mỗi tập phát sóng giúp bạn được khán giả biết đến hơn.', 'big');
    queue(l, r, log);
  }
  function offerValid(l,d) { var o=l.flags.varietyOffer;return invite(l)&&!!o&&o.year===year(l)&&(!d||d.token==null||(d.token===o.token&&d.k===o.k&&d.year===o.year)); }
  function selectShow(l,r,log,d,k) {
    if(!invite(l))return;
    var token=l.flags.varietyOfferSerial=(l.flags.varietyOfferSerial||0)+1;
    l.flags.varietyOffer={k:k,fee:Math.max(0,Number(d.fee)||0),year:year(l),token:token};
    l.pending.unshift(E.DEC.vr_vai_tro.make(l,r));
  }
  E.SC('vr_vai_tro',{
    title:function(l,d){return 'Vai trò trong '+(TITLES[d.k]||'game show');},valid:offerValid,
    prep:function(l){return Object.assign({},l.flags.varietyOffer||{});},
    text:function(l,d){return 'Bạn muốn tham gia '+(TITLES[d.k]||'chương trình')+' với vai trò nào? Khách mời quay 2 tập, mỗi tập 3 chặng lựa chọn. Thành viên cố định quay 6 tập mô phỏng trong năm, mỗi tập 5 chặng và gắn bó với dàn cast lâu hơn. Cả hai đều có khách mời, chia đội ngẫu nhiên và được khán giả quan tâm sau mỗi tập hoàn thành. Chưa quay thì chưa nhận cát-xê.';},
    opts:['guest','regular'].map(function(role){return{k:role,l:role==='guest'?'Làm khách mời · 2 tập':'Làm thành viên cố định · 6 tập',h:function(l,d){return (role==='guest'?'6':'30')+' lượt lựa chọn · cát-xê trọn lịch '+H.money(l,quote(d.fee,role))+' · quyết toán theo số tập hoàn thành';},ai:{w:role==='guest'?1:.8},run:function(l,r,log,d){if(!offerValid(l,d))return;var offer=l.flags.varietyOffer;delete l.flags.varietyOffer;start(l,r,log,offer,offer.k,role);}};}).concat([{k:'no',l:'Chưa nhận lịch quay',ai:{w:.15},run:function(l){delete l.flags.varietyOffer;}}])
  });
  var roleApply=E.DEC.vr_vai_tro.apply;
  E.DEC.vr_vai_tro.apply=function(l,d){if(!offerValid(l,d.data))return;return roleApply.apply(this,arguments);};
  E.DEC.gameshow.def.valid = invite;
  E.DEC.gameshow.def.text = function () { return 'Chọn chương trình để xem hai hình thức tham gia: khách mời 2 tập hoặc thành viên cố định 6 tập mô phỏng. Màn tiếp theo hiển thị số sự kiện và cát-xê của từng vai trò. Mỗi tập hoàn thành đều giúp tăng danh tiếng, dù thắng hay thua.'; };
  E.DEC.gameshow.def.opts.forEach(function (o) { if (TITLES[o.k]) o.run = function (l, r, log, d) { selectShow(l,r,log,d,o.k); }; else if (o.k === 'no') o.l = 'Từ chối, giữ lịch hiện tại'; });
  var invitationApply = E.DEC.gameshow.apply;
  E.DEC.gameshow.apply = function(l,d){var result=invitationApply.apply(this,arguments);if(l.pending[0]&&l.pending[0].id==='vr_vai_tro'){l.pending[0].manual=!!d.manual;if(l.flags.varietyOffer)l.flags.varietyOffer.manual=!!d.manual;}return result;};
  // Màn hậu trường cũ không còn chạy độc lập hoặc cộng danh tiếng vô hạn.
  E.DEC.gameshow_dong.def.valid = function () { return false; };
  E.ACT.push({ id: 'gameshow_moi', g: 'Công việc', l: 'Xem lời mời Running Man / 2 Ngày 1 Đêm', min: 18, max: 55, sc: 'gameshow', avail: function (l) { return invite(l) ? true : 'Cần danh tiếng, nghề phù hợp, sức khỏe và lịch quay trống'; } });

  function name(v) { return [v.role==='guest'?(v.ep===0?'Ra mắt cùng dàn thành viên cố định':'Trở lại giao lưu và chia đội'):(v.ep===0?'Ra mắt dàn thành viên cố định':'Họp dàn cố định, đón khách mời và chia đội'), v.task, v.k === 'hai' ? 'Trò chơi giành bữa tối' : 'Săn manh mối bí mật', v.k === 'hai' ? 'Thử thách giành chỗ ngủ' : 'Biến số đổi đội', v.k === 'hai' ? 'Nhiệm vụ buổi sáng' : 'Cuộc đua xé bảng tên'][v.stage]; }
  function describe(l) {
    var v = season(l);
    return U.cap(roleName(v))+' · Tập ' + (v.ep + 1) + '/' + v.total + ' tại ' + v.location + ', quay trong năm ' + v.year + '. Khách mời: ' + v.guests.join(', ') + '.\nĐội bạn: ' + v.team.join(', ') + '. Đội đối thủ: ' + v.opponents.join(', ') + '.\nĐiểm tập này: ' + v.score + '. ' +
      (v.stage === 0 ? 'Dàn thành viên và diễn biến trong game là mô phỏng. Bạn muốn bắt nhịp với đội và tạo dấu ấn với khán giả như thế nào?' : v.stage === 2 && v.k === 'hai' ? 'Thắng được chọn món đặc sản; thua vẫn có suất ăn cơ bản, không bị bỏ đói.' : v.stage === 3 && v.k === 'hai' ? 'Thắng được ngủ trong nhà; đội thua ngủ lều có ê-kíp hỗ trợ.' : v.stage === 3 ? 'Bốc thăm đổi một đồng đội với đội đối thủ, giữ nguyên điểm đã kiếm. Bạn muốn phối hợp thế nào với người mới?' : v.stage === 4 && v.k === 'rm' ? 'Manh mối từ những vòng trước giúp đội bạn trong cuộc đua cuối. Xé bảng tên là trò chơi có giám sát, không phải đánh nhau ngoài đời.' : 'Kết quả phụ thuộc sức khỏe, phối hợp, cách chơi và may mắn; không phải cứ chọn liều là thắng.');
  }
  function play(l, r, log, d, how) {
    if (!valid(l, d)) return; // chặn lựa chọn cũ sau khi đã sang vòng khác
    var v = season(l), stage = v.stage, title = v.compact && v.challengeName51 ? v.challengeName51 : name(v);
    if (how === 'quit') { finish(l, log, 'chủ động xin dừng'); return; }
    if (stage === 0) { v.style = how === 'team' ? 0.1 : how === 'mind' ? 0.05 : 0; log('Tập ' + (v.ep + 1) + ' ' + TITLES[v.k] + ': gặp ' + v.guests.join(', ') + ', vào đội cùng ' + v.team.slice(1).join(', ') + '.', 'neutral'); }
    else {
      var effort = how === 'hard', mental = how === 'mind';
      var p = U.clamp(0.25 + l.st.hea / 400 + l.st.soc / 700 + (mental ? l.st.kno / 500 : 0) + v.style + (effort ? 0.12 : 0.03) + (stage === 4 ? v.clues * 0.03 : 0), 0.15, 0.88);
      var won = r() < p, points = stage === 4 ? 3 : stage === 1 ? 2 : 1;
      if (won) { v.score += points; if (v.k === 'rm' && stage === 2) v.clues++; }
      H.fx(l, { hea: effort ? -3 : -1, hap: won ? 2 : -1, soc: how === 'team' ? 1 : 0 });
      if (effort && r() < 0.08) { v.injured = true; H.fx(l, { hea: -8 }); log('Tập ' + (v.ep + 1) + ' ' + TITLES[v.k] + ': bị căng cơ nhẹ, ê-kíp y tế yêu cầu ngừng các phần vận động mạnh.', 'bad'); }
      log('Tập ' + (v.ep + 1) + ' ' + TITLES[v.k] + ' · ' + title + ': ' + (won ? 'đội bạn vượt thử thách, cộng ' + points + ' điểm.' : 'đội đối thủ nhỉnh hơn, đội bạn không có thêm điểm.') + (v.k === 'hai' && stage === 2 ? (won ? ' Được thưởng bữa đặc sản.' : ' Ăn suất cơ bản do ê-kíp chuẩn bị.') : '') + (v.k === 'hai' && stage === 3 ? (won ? ' Đội được ngủ trong nhà.' : ' Đội ngủ lều có người hỗ trợ.') : ''), won ? 'good' : 'neutral');
    }
    if (v.k === 'rm' && stage === 2) {
      var a = Math.floor(r() * (v.team.length - 1)) + 1, b = Math.floor(r() * v.opponents.length), member = v.team[a];
      v.team[a] = v.opponents[b]; v.opponents[b] = member;
      log('Tập ' + (v.ep + 1) + ' ' + TITLES[v.k] + ' · Bốc thăm đổi đội: ' + member + ' sang đội đối thủ, ' + v.team[a] + ' về đội bạn; điểm được giữ nguyên.', 'neutral');
    }
    v.history.push({ ep: v.ep, stage: stage, task: title, team: v.team.slice(), opponents: v.opponents.slice(), score: v.score });
    if (stage === 4) {
      v.completed++; var victory = v.score >= (v.role==='guest'?3:4); if (victory) v.wins++;
      var followers = v.role==='guest'?(victory?18000:6000):(victory?24000:9000);
      l.fame = (l.fame || 0) + followers; v.audienceGain=(v.audienceGain||0)+followers;
      var audience=l.flags.tvAudience||(l.flags.tvAudience={episodes:0,followers:0}); audience.episodes++;audience.followers+=followers;
      var reaction=v.role==='guest'?['Khán giả chú ý màn ra mắt của khách mời, chia sẻ đoạn bạn phối hợp cùng dàn cast.','Kết thúc lịch khách mời, khán giả bình luận mong được gặp lại bạn.'][v.ep]:['Khán giả bắt đầu nhớ tên bạn trong dàn cố định.','Những màn phối hợp với đồng đội được cắt thành clip chia sẻ.','Khán giả nhớ nét riêng và cách bạn xử lý trò chơi.','Bạn dần có nhóm khán giả theo dõi các tập mới.','Khán giả bàn luận về tình đồng đội và những lần bạn vượt thử thách.','Khép lại lịch quay, khán giả nhắc đến hành trình của bạn cùng dàn cast.'][v.ep%6];
      log(TITLES[v.k]+' · Tập '+(v.ep+1)+' · Phản hồi khán giả: '+reaction+' Thêm '+followers+' người theo dõi, kể cả khi không thắng trò chơi.','good');
      log('Kết thúc tập ' + (v.ep + 1) + ' ' + TITLES[v.k] + ': ' + (victory ? 'đội bạn thắng' : 'đội đối thủ thắng') + ', tổng ' + v.score + ' điểm. Cả ê-kíp cùng chào khán giả.', victory ? 'good' : 'neutral');
      if (v.completed >= v.total) { finish(l, log); return; }
      v.ep++; episode(l, r);
    } else { var order=stages(v);v.stage=order[order.indexOf(stage)+1]; }
    queue(l, r, log);
  }
  function opt(k, label) { return { k: k, l: label, ai: { w: k === 'quit' ? 0.05 : 1 }, req: function (l, d) { return valid(l, d) && (k !== 'hard' || (!season(l).injured && l.st.hea >= 55 && season(l).stage > 0)); }, run: function (l, r, log, d) { play(l, r, log, d, k); } }; }
  E.SC('vr_vong', {
    title: function (l) { var v = season(l); return TITLES[v.k] + ' · '+U.cap(roleName(v))+' · Tập ' + (v.ep + 1) + ' · ' + name(v); },
    valid: valid,
    prep: function (l) { var v = season(l); return { token: v.token, ep: v.ep, stage: v.stage }; },
    text: describe,
    opts: [opt('team', 'Phối hợp đồng đội, chơi vừa sức'), opt('mind', 'Quan sát, giải đố và bàn chiến thuật'), opt('hard', 'Xung phong phần vận động khó'), opt('quit', 'Xin dừng quay để giữ sức')]
  });
  E.MAJOR.vr_vong = 1;

  // Không nhận hai mùa quay chồng nhau, không tiếp tục thi đấu khi đã bị giam.
  var musicValid = E.DEC.tv_moi.valid;
  E.DEC.tv_moi.valid = function (l) { return free(l) && !busy(l) && musicValid.apply(this, arguments); };
  var musicApply = E.DEC.tv_moi.apply;
  E.DEC.tv_moi.apply = function (l, d, k, r, log) { if (k === 'nhan' && (!free(l) || busy(l) || musicBusy(l))) { log('Không nhận lời vì lịch quay hoặc tình trạng hiện tại không cho phép.', 'neutral'); return; } return musicApply.apply(this, arguments); };
  ['tv_vong', 'tv_loai', 'tv_tap_nhay'].forEach(function (id) {
    var def = E.DEC[id], before = def.valid, make = def.make, apply = def.apply;
    def.valid = function (l, d) { return free(l) && !busy(l) && musicBusy(l) && (!d || d.round == null || d.round === l.flags.tv.i) && before.apply(this, arguments); };
    def.make = function (l) { var d = make.apply(this, arguments); d.data.round = l.flags.tv.i; return d; };
    def.apply = function (l, d) { if (!def.valid(l, d.data)) return; return apply.apply(this, arguments); };
  });
  function interrupt(l, log, reason) { if (busy(l)) finish(l, log, reason); if (musicBusy(l)) { l.flags.tv.done = true; l.flags.tv.out = true; l.flags.tv.res = 'interrupted'; log('Dừng hành trình ' + l.flags.tv.s + ' vì ' + reason + '.', 'neutral'); } }
  ['jail', 'kill'].forEach(function (key) { var before = H[key]; H[key] = function (l) { var log = arguments[key === 'jail' ? 3 : 2]; if (typeof log === 'function') interrupt(l, log, key === 'jail' ? 'không thể tiếp tục lịch quay khi chấp hành án' : 'hành trình cuộc đời kết thúc'); return before.apply(this, arguments); }; });
  function varietyYear(l, r, log) { var v = season(l); if (busy(l) && (v.year !== year(l) || !free(l) || l.st.hea < 25)) finish(l, log, 'lịch quay đã hết hạn hoặc sức khỏe không cho phép'); }
  E.HOOKS.year.push(varietyYear);
  E.VARIETY = { roles:ROLES, quote:quote, titles: TITLES, tasks: TASKS, canInvite: invite, valid: valid, year: varietyYear };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));

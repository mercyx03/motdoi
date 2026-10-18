/* v4.5.1 — danh mục concert bền vững; thế giới ngầm và hậu quả kéo dài.
   Các tỷ lệ dưới đây là cân bằng trò chơi, không phải số liệu thực tế. */
(function (G) {
  'use strict';
  var E = G.E, U = G.U, H = E.H;
  function free(l) { return l.alive && l.age >= 18 && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }
  function state(l) { return l.flags.underworld || (l.flags.underworld = { linked: false, heat: 0, hunted: false }); }
  function active(l) { var s = state(l); return free(l) && (s.linked || s.hunted || E.isCrime(l)); }
  function heat(l, n) { var s = state(l); s.heat = U.clamp((s.heat || 0) + n, 0, 100); }
  function cost(l, n) { return H.isVN(l) && l.cur === 'vnd' ? n : l.base * n / 90; }
  function pay(l, n, why) { H.cash(l, -Math.min(Math.max(0, l.money), cost(l, n)), why); }
  function leave(l, log) { state(l).linked = false; if (E.isCrime(l)) E.quitCrime(l, log); }
  function pursuit(l) { if (!(l.sched || []).some(function (s) { return s.id === 'uw_truy_sat'; })) H.sched(l, 'uw_truy_sat', 1); }
  function risk(l) { if (!active(l)) return 0; var s = state(l); return U.clamp(0.04 + (s.linked ? 0.06 : 0) + (s.hunted ? 0.20 : 0) + s.heat / 500 + (E.isCrime(l) ? (l.job.rank || 0) * 0.02 : 0), 0.04, 0.6); }
  function deathRisk(l, fight) { return U.clamp((fight ? 0.42 : 0.27) + (50 - l.st.hea) / 250 + (state(l).hunted ? 0.08 : 0), 0.12, 0.8); }
  E.underworldRisk = risk;
  E.underworldDeathRisk = deathRisk;
  function event(id, title, text, opts, condition) {
    E.SC(id, { title: title, text: text, valid: function (l) { return active(l) && (!condition || condition(l)); }, opts: opts });
  }
  function trigger(id, p, cd) { E.TRIG.push({ id: id, when: function (l) { return E.DEC[id].valid(l, {}); }, p: p, cd: cd || 3, rep: true }); }
  function option(k, l, run, req) { return { k: k, l: l, run: run, req: req, ai: { w: 1 } }; }

  // Giữ đủ 33 / 34 thành viên ngay trong dữ liệu chung dùng bởi mọi màn chọn.
  var cast = E.SHOWS.filter(function (s) { return s.k === 'atvncg24'; })[0];
  if (cast && cast.m.indexOf('Phan Đinh Tùng') < 0) cast.m.push('Phan Đinh Tùng');
  E.SC('concert_luu_tru', {
    title: 'Concert lưu trữ',
    prep: function (l, r, a) { return { name: a && typeof a.name === 'string' && a.name.trim() ? a.name : 'concert chương trình truyền hình' }; },
    text: function (l, d) { return d.name + ' đã diễn ra từ nhiều thập kỷ trước. Bạn có thể xem lại bản ghi đầy đủ; đây không phải concert trực tiếp của đội hình năm đó.'; },
    opts: [option('xem', 'Xem lại concert cùng cộng đồng người hâm mộ', function (l, r, log, d) { H.fx(l, { hap: 5 }); log('Xem lại bản ghi ' + d.name + (l.bias && l.bias.show === d.name ? ', cổ vũ phần trình diễn của ' + l.bias.n : '') + '.', 'good'); }), option('thoi', 'Để dịp khác', function () {})]
  });
  var concertMake = E.DEC.concert_di.make;
  E.DEC.concert_di.make = function (l, r, arg) {
    var d = concertMake.apply(this, arguments);
    var s = d.data.cat === 'show' && E.SHOWS.filter(function (x) { return x.n === d.data.name; })[0];
    if (s && l.birthYear + l.age - s.b > 65) return E.DEC.concert_luu_tru.make(l, r, { name: s.n });
    return d;
  };

  E.SC('uw_quan_he', {
    title: 'Làm ăn bất chính / quan hệ xã hội đen',
    valid: free,
    text: function (l) { var s = state(l); return (s.linked ? 'Bạn đang có quan hệ với một băng nhóm.' : 'Một người quen rủ bạn góp vốn vào việc làm ăn bất chính của băng nhóm.') + ' Tiền dễ đến nhưng có thể mất vốn, vướng án hoặc bị trả thù. Mức thù địch: ' + s.heat + '/100. ' + (s.hunted ? 'Bạn vẫn đang bị truy sát. ' : '') + 'Nguy cơ đánh úp ở lượt xét sự kiện năm nay: ' + Math.round(risk(l) * 100) + '%.'; },
    opts: [
      option('link', 'Nhận lời liên kết với băng nhóm', function (l, r, log) { state(l).linked = true; heat(l, 12); H.fx(l, { karma: -8 }); log('Nhận lời liên kết làm ăn với băng nhóm. Từ đây, tranh chấp của họ cũng có thể liên lụy đến bạn.', 'bad'); }, function (l) { return !state(l).linked; }),
      option('deal', 'Góp vốn một thương vụ rủi ro (chỉ một lần mỗi năm)', function (l, r, log) { var s = state(l), capital = cost(l, 200); s.dealAt = l.age; H.cash(l, -capital, 'Vốn thương vụ bất chính'); heat(l, 15); if (r() < 0.3) { log('Thương vụ đổ bể, mất toàn bộ vốn. Những người cùng góp tiền quay sang đổ lỗi cho nhau.', 'bad'); } else { var payout = capital * (1.5 + r() * 2); H.cash(l, payout, 'Thu hồi vốn và lãi thương vụ bất chính'); log('Thương vụ mang về ' + H.money(l, payout) + ' gồm cả vốn. Món tiền khiến bạn lún sâu thêm.', 'bad'); } }, function (l) { return state(l).linked && state(l).dealAt !== l.age && l.money >= cost(l, 200); }),
      option('leave', 'Cắt quan hệ, dừng làm ăn bất chính', function (l, r, log) { leave(l, log); heat(l, -10); log(state(l).hunted ? 'Đã dừng làm ăn, nhưng băng đối thủ chưa ngừng truy sát bạn.' : 'Cắt quan hệ làm ăn với băng nhóm. Những mâu thuẫn cũ vẫn có thể kéo dài.', 'neutral'); }, function (l) { return state(l).linked || E.isCrime(l); }),
      option('no', 'Đóng lại', function () {})
    ]
  });
  E.ACT.push({ id: 'uw_quan_he', g: 'Đường tối', l: 'Làm ăn bất chính / quan hệ xã hội đen', min: 18, sc: 'uw_quan_he' });

  function ambush(l, r, log, fight) {
    var s = state(l), p = deathRisk(l, fight);
    if (r() < p) { H.kill(l, fight ? 'chống trả không thành trong một vụ đánh úp của băng nhóm' : 'không chạy thoát trong một vụ đánh úp của băng nhóm', log); return; }
    s.hunted = true; s.attackedAt = l.age; heat(l, fight ? 25 : 15);
    H.fx(l, { hea: fight ? -25 : -14, hap: -15 });
    log(fight ? 'Chống trả rồi chạy thoát, may mắn sống sót nhưng bị thương nặng. Đối thủ tiếp tục truy sát bạn.' : 'Chạy thoát trong gang tấc, may mắn sống sót nhưng vẫn bị đối thủ truy sát.', 'bad');
    pursuit(l);
  }
  event('uw_can_len', 'Bị cắn lén — đánh úp', 'Một nhóm đối thủ bất ngờ chặn đường. Bạn chỉ có vài giây quyết định; cả chống trả lẫn bỏ chạy đều có nguy cơ tử vong. Sống sót cũng chưa có nghĩa là thoát khỏi việc bị truy sát.', [
    { k: 'fight', l: 'Chống trả rồi bỏ chạy', h: function (l) { return 'Nguy cơ tử vong: ' + Math.round(deathRisk(l, true) * 100) + '%'; }, ai: { w: 0.6, risk: 1 }, run: function (l, r, log) { ambush(l, r, log, true); } },
    { k: 'flee', l: 'Chạy trốn ngay', h: function (l) { return 'Nguy cơ không chạy thoát: ' + Math.round(deathRisk(l, false) * 100) + '%'; }, ai: { w: 1.4 }, run: function (l, r, log) { ambush(l, r, log, false); } }
  ]);
  trigger('uw_can_len', risk, 1);
  E.MAJOR.uw_can_len = 1;

  event('uw_truy_sat', 'Những ngày bị truy sát', 'Điện thoại nhận những lời đe dọa. Bạn không còn cảm thấy an toàn khi ra đường.', [
    option('help', 'Trình báo và xin được bảo vệ', function (l, r, log) { leave(l, log); if (r() < 0.7) { state(l).hunted = false; heat(l, -60); log('Thông tin giúp cơ quan chức năng ngăn nhóm đe dọa. Bạn thoát khỏi việc bị truy sát, nhưng vẫn phải chịu trách nhiệm nếu có hành vi phạm pháp.', 'good'); } else { log('Vụ việc đang được xác minh; mối đe dọa chưa chấm dứt.', 'bad'); pursuit(l); } }),
    option('hide', 'Tạm ngừng làm ăn, lánh nạn', function (l, r, log) { leave(l, log); pay(l, 40, 'Chi phí lánh nạn'); heat(l, -8); H.fx(l, { hap: -8 }); log('Lánh nạn một thời gian. Bạn vẫn bị truy sát, chưa thể coi như chuyện đã xong.', 'bad'); pursuit(l); }),
    option('back', 'Quay lại nhờ băng nhóm che chở', function (l, r, log) { state(l).linked = true; heat(l, 12); log('Băng nhóm nhận giúp, đổi lại bạn tiếp tục mắc nợ họ. Nguy cơ truy sát vẫn còn.', 'bad'); pursuit(l); })
  ], function (l) { return state(l).hunted; });
  E.MAJOR.uw_truy_sat = 1;

  event('uw_phan_boi', 'Người trong nhóm trở mặt', 'Người từng cùng làm ăn lấy mất phần tiền chung rồi tung tin bạn phản bội.', [
    option('loss', 'Chấp nhận mất phần tiền, không trả đũa', function (l, r, log) { pay(l, 100, 'Thiệt hại do đồng bọn phản bội'); heat(l, 8); log('Chấp nhận thiệt hại nhưng lời đồn vẫn khiến quan hệ trong nhóm rạn nứt.', 'bad'); }),
    option('clash', 'Đối chất gay gắt', function (l, r, log) { heat(l, 30); state(l).hunted = true; log('Cuộc đối chất biến thành xung đột. Người kia nhờ một băng khác truy sát bạn.', 'bad'); pursuit(l); })
  ]);
  event('uw_chia_phan', 'Tranh chấp chia phần', 'Sau một thương vụ, người cầm đầu đòi giữ phần lớn tiền lời.', [
    option('accept', 'Chấp nhận chịu thiệt lần này', function (l, r, log) { pay(l, 60, 'Bị giữ lại phần tiền'); heat(l, -3); log('Chịu thiệt để tránh xung đột. Bạn hiểu lời hứa trong nhóm chẳng có gì bảo đảm.', 'bad'); }),
    option('quit', 'Dừng hợp tác', function (l, r, log) { leave(l, log); heat(l, 10); log('Dừng hợp tác sau tranh chấp. Người cầm đầu tỏ ra không hài lòng.', 'neutral'); })
  ]);
  event('uw_tong_tien', 'Bị băng khác đe dọa', 'Một nhóm khác đòi bạn nộp tiền, nếu không sẽ gây chuyện.', [
    option('report', 'Trình báo lời đe dọa', function (l, r, log) { heat(l, 5); log('Trình báo và cung cấp các tin nhắn đe dọa. Vụ việc được tiếp nhận.', 'neutral'); }),
    option('pay', 'Chấp nhận mất tiền', function (l, r, log) { pay(l, 80, 'Thiệt hại bị đe dọa'); heat(l, 10); log('Mất tiền nhưng không có gì bảo đảm họ sẽ để bạn yên.', 'bad'); })
  ]);
  event('uw_dieu_tra', 'Đường dây bị điều tra', 'Những người từng làm ăn chung bị triệu tập. Bạn phải đối diện trách nhiệm về phần việc của mình.', [
    option('cooperate', 'Hợp tác khai báo', function (l, r, log) { var guilty = state(l).dealAt != null || E.isCrime(l); leave(l, log); if (guilty && r() < 0.6) H.jail(l, U.randint(r, 2, 5), 'tham gia đường dây làm ăn bất chính', log); else log('Hợp tác làm rõ vụ việc. Chưa có kết luận bạn phạm tội trong đợt điều tra này.', 'neutral'); }),
    option('refuse', 'Tìm luật sư, chờ kết luận điều tra', function (l, r, log) { pay(l, 50, 'Chi phí luật sư'); if ((state(l).dealAt != null || E.isCrime(l)) && r() < 0.45) { leave(l, log); H.jail(l, U.randint(r, 3, 7), 'tham gia đường dây làm ăn bất chính', log); } else log('Luật sư hỗ trợ làm việc; chưa có kết luận cuối cùng.', 'neutral'); })
  ]);
  event('uw_mat_von', 'Vốn góp biến mất', 'Người giữ tiền chung mất liên lạc. Không ai biết phần vốn đã đi đâu.', [
    option('stop', 'Chấp nhận mất vốn, dừng hợp tác', function (l, r, log) { pay(l, 120, 'Mất phần vốn góp'); leave(l, log); log('Chấp nhận thiệt hại, dừng hợp tác với nhóm.', 'bad'); }),
    option('wait', 'Tiếp tục chờ giải thích', function (l, r, log) { heat(l, 12); H.fx(l, { hap: -6 }); log('Chờ đợi trong lo lắng. Mâu thuẫn giữa những người góp vốn ngày càng lớn.', 'bad'); })
  ]);
  event('uw_gia_dinh', 'Người thân biết chuyện', 'Người thân lo sợ những mối quan hệ làm ăn của bạn sẽ kéo nguy hiểm về nhà.', [
    option('leave', 'Dừng làm ăn để bảo vệ gia đình', function (l, r, log) { leave(l, log); H.fx(l, { karma: 5 }); log('Dừng làm ăn bất chính. Người thân nhẹ lòng, dù những mối đe dọa cũ chưa chắc biến mất.', 'good'); }),
    option('keep', 'Vẫn tiếp tục', function (l, r, log) { heat(l, 10); H.fx(l, { hap: -8, soc: -5 }); log('Vẫn tiếp tục. Người thân sống trong bất an.', 'bad'); })
  ], function (l) { return l.fam.mAlive || l.fam.fAlive || (l.partner && l.partner.alive) || l.kids.some(function (k) { return k.alive; }); });
  event('uw_dan_em_gap_nan', 'Người cùng nhóm gặp nạn', 'Một người từng cùng làm ăn bị thương sau tranh chấp. Người nhà họ đến xin hỗ trợ viện phí.', [
    option('help', 'Hỗ trợ một phần viện phí', function (l, r, log) { pay(l, 30, 'Hỗ trợ viện phí'); log('Hỗ trợ viện phí. Cảnh bệnh viện khiến bạn nghĩ lại về con đường đang đi.', 'neutral'); }),
    option('no', 'Từ chối', function (l, r, log) { heat(l, 10); log('Từ chối hỗ trợ, thêm người oán trách bạn.', 'bad'); })
  ]);
  event('uw_duong_lui', 'Cơ hội làm lại', 'Một cơ sở làm ăn hợp pháp sẵn sàng cho bạn thử việc nếu bạn chấm dứt quan hệ bất chính.', [
    option('yes', 'Cắt quan hệ, tìm việc hợp pháp', function (l, r, log) { leave(l, log); heat(l, -15); l.flags.needJob = true; log('Chấm dứt làm ăn bất chính và bắt đầu tìm công việc hợp pháp. Thu nhập cũ không còn, việc bị truy sát nếu có vẫn cần giải quyết.', 'good'); }),
    option('no', 'Chưa muốn từ bỏ', function (l, r, log) { heat(l, 5); log('Bỏ qua cơ hội làm lại, tiếp tục những mối quan hệ cũ.', 'bad'); })
  ]);
  ['uw_phan_boi', 'uw_chia_phan', 'uw_tong_tien', 'uw_dieu_tra', 'uw_mat_von', 'uw_gia_dinh', 'uw_dan_em_gap_nan', 'uw_duong_lui'].forEach(function (id) { trigger(id, 0.16, 3); });
  E.HOOKS.year.push(function (l) { if (l.flags.underworld) heat(l, -2); });
  var quit = E.quitCrime;
  E.quitCrime = function (l) { state(l).linked = false; return quit.apply(this, arguments); };
  // Không dùng đồng thời hai cơ chế đánh úp độc lập, gây tăng rủi ro ngoài ý muốn.
  E.TRIG.forEach(function (t) { if (t.id === 'toi_tra_thu') t.when = function () { return false; }; });
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));

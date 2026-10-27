/* Optional media automation uses existing channels, staff, posting limits and offers. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, X = E.UPDATE110, S = E.SOCIAL131;
  function find(l, id) { return S.state(l).channels.find(function (c) { return c.id === id; }); }
  function config(c) { return c.auto160 || (c.auto160 = { enabled: false, post: true, live: false, ads: false, network: false, history: [] }); }
  function reason(l) { var w = X.reason(l, 18); return w !== true ? w : !l.indep ? 'Cần tự lập' : true; }
  X.menu('media160', 'Tự động quản lý truyền thông', reason,
    'Đội ngũ dựng video hiện có nhận thêm lịch truyền thông. Lương theo cấp nhân sự của kênh, không thu lương hai lần. Chỉ thực hiện việc được bật; hợp đồng quảng cáo và lời mời giao lưu cần bạn quyết định. Mỗi kênh tối đa bốn video/năm, livestream một lần/năm. Tắt chế độ không sa thải đội ngũ.', function (l) {
      return S.state(l).channels.map(function (c) { return { k: c.id, l: c.name + ' · ' + (config(c).enabled ? 'đang bật' : 'đang tắt'), run: function (l, r) { X.next(l, 'mediaChannel160', r, { id: c.id }); } }; });
    }, 18, 'Mạng xã hội');
  X.menu('mediaChannel160', 'Phạm vi ủy quyền truyền thông', reason, function (l, d) { var c = find(l, d.arg.id); if (!c) return 'Kênh không còn tồn tại.'; var a = config(c); return c.name + ' · đội ngũ cấp ' + c.staff + ' · lương ' + H.money(l, l.base * .18 * c.staff) + '/năm.\n' + (a.history.map(function (h) { return h.age + ' tuổi: ' + h.text; }).join('\n') || 'Chưa có báo cáo hoạt động.'); }, function (l, arg) {
      var c = find(l, arg.id); if (!c) return []; var a = config(c);
      return [['enabled', 'Tự động quản lý truyền thông'], ['post', 'Đăng video theo lịch'], ['live', 'Tổ chức livestream'], ['ads', 'Tìm lời mời quảng cáo (bạn duyệt hợp đồng)'], ['network', 'Đề xuất lịch giao lưu (bạn quyết định)']].map(function (p) {
        return { k: p[0], l: (a[p[0]] ? 'Tắt: ' : 'Bật: ') + p[1], why: p[0] === 'enabled' && !a.enabled && !c.staff ? 'Cần thuê nhân sự tại mục đầu tư kênh' : true, run: function (l, r, log) { a[p[0]] = !a[p[0]]; log('Đã ' + (a[p[0]] ? 'bật ' : 'tắt ') + p[1].toLowerCase() + ' cho ' + c.name + '.', 'neutral'); } };
      }).concat([{ k: 'staff', l: 'Tuyển, nâng cấp hoặc dừng đội ngũ', run: function (l, r) { X.next(l, 'investChannel131', r, arg); } }, { k: 'offers', l: 'Xem và duyệt lời mời quảng cáo', run: function (l, r) { X.next(l, 'creatorOffers132', r, arg); } }]);
    }, 18);
  function year(l, r, log) {
    if (reason(l) !== true) return;
    S.state(l).channels.forEach(function (c) {
      var a = c.auto160;
      if (!a || !a.enabled || c.autoAt160 === l.age) return;
      c.autoAt160 = l.age;
      var lines = [], note = function (t) { lines.push(t); };
      if (!c.staff || !S.apps().some(function (p) { return p.id === c.app && p.enabled; })) lines.push('Tạm dừng vì thiếu nhân sự được trả lương hoặc ứng dụng ngừng hoạt động.');
      else {
        var before = c.followers, count = c.postsAt === l.age ? c.posts || 0 : 0;
        if (a.post) {
          var quota = Math.min(4 - count, c.staff >= 2 ? 3 : 2);
          for (var i = 0; i < quota; i++) {
            if (r() < .14 / c.staff) { c.reputation = Math.max(0, c.reputation - 2); c.engagement = Math.max(0, c.engagement - 2); lines.push('Một nội dung bị hoãn vì chất lượng chưa đạt.'); continue; }
            S.publish(l, c, r, note, S.formats(c)[0]);
          }
        }
        if (a.live) {
          var d = E.DEC.socialIncome131.make(l, r, { id: c.id }), idx = d.data.keys.indexOf('live');
          if (d.opts.some(function (o) { return o.k === String(idx); })) E.DEC.socialIncome131.apply(l, d, String(idx), r, note);
        }
        if (a.ads) { S.makeOffers(l, c, r, note); lines.push('Lời mời quảng cáo được để lại trong mục hợp đồng để bạn duyệt.'); }
        if (a.network) lines.push('Đội ngũ đề xuất xem lịch giao lưu người sáng tạo; chưa tự nhận lời hay ký hợp tác.');
        lines.unshift('Người theo dõi: ' + before + ' → ' + c.followers + '.');
      }
      var text = lines.join(' '); a.history.push({ age: l.age, text: text }); a.history = a.history.slice(-12);
      log('Báo cáo truyền thông · ' + c.name + ': ' + text, 'neutral');
    });
  }
  E.HOOKS.year.push(year);
  E.MEDIA160 = { config: config, year: year };
})(globalThis.G);

/* Một Đời — v8.4.0: thừa kế tài sản hiện vật.
   Trước đây khi qua đời, di sản (nhà, đất, cơ sở kinh doanh…) bị quy hết ra tiền mặt. Giờ phân chia giống ngoài đời:
   · nhà đang ở, nhà / đất cho thuê, lô đất, cơ sở kinh doanh được sang tên cho người thừa kế, phần còn lại nhận bằng tiền;
   · nhà đang ở ưu tiên để lại cho vợ / chồng còn sống (người còn ở trong nhà); cơ sở kinh doanh giao cho người con đã trưởng thành;
   · ai nhận tài sản lớn hơn phần mình được hưởng thì bù tiền chênh lệch cho những người khác; nợ lớn hơn thì phải bán bớt tài sản;
   · "sống tiếp đời con": người con nhận đúng căn nhà, cửa hàng… của bố / mẹ (chưa đủ 18 tuổi thì người giám hộ giữ hộ).
   Giá trị phần hưởng của mỗi người không đổi so với trước — chỉ khác ở chỗ nhận bằng tài sản thay vì toàn tiền mặt. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U;
  function mo(l, v) { return H.money(l, v); }
  function homeDebt(l) { return (l.mortgage || 0) + (l.loans || []).filter(function (x) { return x.type === 'home'; }).reduce(function (s, x) { return s + (x.bal || 0); }, 0); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function kidAge(l, i) { var k = l.kids[i], at = l.death ? l.death.age : l.age; return k ? at - (k.born || 0) : 0; }

  // các tài sản có thể sang tên (giá trị theo tiền của đời đang xét)
  function itemsOf(l) {
    var a = [];
    // giá trị thật của căn nhà; nợ vay mua nhà đã nằm trong phần nợ chung của di sản (trả từ di sản trước khi chia)
    if (l.ownHouse && (l.houseVal || 0) > 0) a.push({ t: 'home', n: l.houseName || 'căn nhà đang ở', v: l.houseVal, debt: homeDebt(l), k: l.houseK || null, tier: l.houseTier || null });
    (l.props || []).forEach(function (p, i) { if ((p.v || 0) > 0) a.push({ t: 'prop', n: p.n, v: p.v, i: i, data: clone(p) }); });
    (l.ventures || []).forEach(function (x, i) { if ((x.cap || 0) > 0) a.push({ t: 'venture', n: x.n + (x.br > 1 ? ' (' + x.br + ' cơ sở)' : ''), v: x.cap, i: i, data: clone(x) }); });
    if (l.assets && l.assets.land > 0.5) a.push({ t: 'land', n: 'lô đất', v: l.assets.land });
    return a.filter(function (x) { return x.v > 0.5; });
  }
  // những người nhận (gộp phần theo di chúc và theo pháp luật)
  function heirsOf(l) {
    var W = E.WILL70; if (!W || !W.estate) return { net: 0, list: [] };
    var s = W.estate(l), m = {};
    s.list.concat(s.law).forEach(function (x) {
      var key = x.kid != null ? 'k' + x.kid : x.spouse ? 'p' : x.society ? 's' : 'o:' + x.name;
      if (!m[key]) m[key] = { key: key, name: x.name, kid: x.kid, spouse: !!x.spouse, society: !!x.society, amount: 0, items: [], cash: 0 };
      m[key].amount += x.amount;
    });
    return { net: s.net, list: Object.keys(m).map(function (k) { return m[k]; }).filter(function (x) { return x.amount > 0.5; }) };
  }
  // phân chia: ai nhận tài sản nào, bao nhiêu tiền mặt
  function allocate(l) {
    var hs = heirsOf(l), list = hs.list, items = itemsOf(l), sold = [];
    if (!list.length || hs.net <= 0.5) return { net: hs.net, list: list, sold: items, items: items };
    // nợ lớn: tổng tài sản sang tên không được vượt quá di sản ròng — bán bớt tài sản nhỏ trước
    items.sort(function (a, b) { return b.v - a.v; });
    var total = items.reduce(function (s, x) { return s + x.v; }, 0);
    while (items.length && total > hs.net + 1e-6) { var x = items.pop(); sold.push(x); total -= x.v; }
    var people = list.filter(function (p) { return !p.society; }); // quỹ xã hội nhận tiền
    function left(p) { return p.amount - p.items.reduce(function (s, x) { return s + x.v; }, 0); }
    function give(p, x) { p.items.push(x); x.to = p.key; }
    items.forEach(function (x) {
      var cands = people.slice();
      if (x.t === 'home') { var sp = people.filter(function (p) { return p.spouse; })[0]; if (sp) cands = [sp]; }
      if (x.t === 'venture') { var adults = people.filter(function (p) { return p.kid != null && kidAge(l, p.kid) >= 18; }); if (adults.length) cands = adults; }
      if (!cands.length) { sold.push(x); return; }
      cands.sort(function (a, b) { return left(b) - left(a); });
      var p = cands[0];
      // nhận được nếu phần còn lại đủ ít nhất 70% giá trị (phần thiếu tự bù tiền cho người khác); nhà cho vợ / chồng luôn giữ lại
      if (left(p) >= x.v * 0.7 || (x.t === 'home' && p.spouse && left(p) >= x.v * 0.4)) give(p, x); else sold.push(x);
    });
    list.forEach(function (p) { p.cash = left(p); });
    return { net: hs.net, list: list, sold: sold, items: items };
  }
  E.ESTATE84 = { items: itemsOf, allocate: allocate };

  function itemLine(l, x) { return (x.t === 'home' ? 'nhà đang ở: ' : x.t === 'venture' ? 'cơ sở kinh doanh: ' : x.t === 'land' ? '' : 'nhà cho thuê: ') + x.n + ' (' + mo(l, x.v) + (x.t === 'home' && x.debt > 0.5 ? ', khoản vay mua nhà được trả từ di sản' : '') + ')'; }
  // khúc cuối đời: ghi rõ ai nhận nhà, đất, cửa hàng nào
  var fin = E.finale;
  E.finale = function (l) {
    var st = fin.apply(this, arguments);
    if (l.alive || !l.death || l.death.age < 18) return st;
    var A = allocate(l), withItems = A.list.filter(function (p) { return p.items.length; });
    if (!withItems.length && !A.sold.length) return st;
    var lines = A.list.map(function (p) {
      var parts = p.items.map(function (x) { return itemLine(l, x); });
      if (p.cash > 0.5) parts.push(mo(l, p.cash) + ' tiền mặt');
      else if (p.cash < -0.5) parts.push('bù ' + mo(l, -p.cash) + ' chênh lệch cho những người thừa kế khác');
      return p.name + ' nhận ' + (parts.length ? parts.join(' · ') : mo(l, p.amount)) + '.';
    });
    if (A.sold.length && A.net > 0.5) lines.push('Bán ' + A.sold.map(function (x) { return x.n; }).join(', ') + ' để ' + (A.items.length ? 'chia tiền cho đủ phần' : 'trả nợ và chia bằng tiền') + '.');
    st.push({ h: 'Phân chia tài sản', x: 'Nhà cửa, đất đai, cơ sở kinh doanh được sang tên cho người thừa kế; phần còn lại chia bằng tiền.', list: lines });
    return st;
  };

  // "sống tiếp đời con": người con nhận đúng tài sản được chia
  var childOpts = E.childOpts;
  E.childOpts = function (l, k) {
    var o = childOpts.apply(this, arguments), h = o.parent && o.parent.heir;
    if (!h || !l.death) return o;
    var A = allocate(l), p = A.list.filter(function (x) { return x.kid === h.idx; })[0];
    if (!p || !p.items.length) return o;
    h.items = p.items.map(function (x) { return { t: x.t, n: x.n, v: x.v, k: x.k || null, tier: x.tier || null, data: x.data || null }; });
    h.amt = Math.max(0, p.cash); h.pay = Math.max(0, -p.cash);
    h.place = l.movedTo || l.city || l.place || '';
    return o;
  };
  var createLife = E.createLife;
  E.createLife = function (opts) {
    var life = createLife.apply(this, arguments), h = opts && opts.parent && opts.parent.heir, f = life.flags.heirOf;
    if (h && f && h.items && h.items.length) {
      var scale = h.cur === life.cur && h.ctx === (life.abroad && life.abroad.perm ? life.abroad.code : life.country) ? 1 : life.base / h.base;
      f.items = h.items.map(function (x) { var y = clone(x); y.v *= scale; if (y.data) { ['v', 'basis', 'cap', 'unit', 'R'].forEach(function (k) { if (typeof y.data[k] === 'number') y.data[k] *= scale; }); } return y; });
      f.pay = (h.pay || 0) * scale; f.place = h.place;
    }
    return life;
  };
  function P(f) { return f && f.sex === 'M' ? 'bố' : 'mẹ'; }
  function receive(l, f, items, log, a) {
    items.forEach(function (x) {
      if (x.t === 'home') {
        if (!l.ownHouse) {
          l.ownHouse = true; l.houseVal = x.v; l.houseName = x.n; if (x.k) l.houseK = x.k; if (x.tier) l.houseTier = x.tier; l.flags.ownedHome = true;
          log('Bạn được thừa kế ' + x.n + (f.place ? ' ở ' + f.place : '') + ' của ' + P(f) + ', trị giá ' + mo(l, x.v) + '. Từ nay bạn có nhà riêng.', 'big');
          H.mem(l, 'Ngày nhận chìa khóa ' + x.n + ' ' + P(f) + ' để lại — căn nhà đầy kỷ niệm.', 5);
        } else if (x.v > (l.houseVal || 0) * 1.2 && !(l.abroad && l.abroad.perm)) {
          // nhà được thừa kế rộng / giá trị hơn hẳn: dọn về ở, cho thuê căn đang ở
          var old = { n: l.houseName || 'căn nhà cũ', v: l.houseVal || 0 };
          if (old.v > 0.5) (l.props = l.props || []).push({ k: 'apt', n: old.n + ' (cho thuê)', v: old.v, basis: old.v, y: 0.04, since: a, empty: 0 });
          l.houseVal = x.v; l.houseName = x.n; if (x.k) l.houseK = x.k; if (x.tier) l.houseTier = x.tier;
          log('Bạn dọn về ở ' + x.n + ' ' + P(f) + ' để lại (' + mo(l, x.v) + '), còn ' + old.n + ' đem cho thuê.', 'big');
          H.mem(l, 'Ngày dọn về ' + x.n + ' của ' + P(f) + ' — mọi góc nhà vẫn còn hơi ấm ngày xưa.', 5);
        } else {
          (l.props = l.props || []).push({ k: 'apt', n: x.n + ' ' + P(f) + ' để lại', v: x.v, basis: x.v, y: 0.04, since: a, empty: 0 });
          log('Bạn đã có nhà riêng, nên ' + x.n + ' ' + P(f) + ' để lại (' + mo(l, x.v) + ') được cho thuê, có thêm tiền thuê nhà hằng tháng.', 'good');
        }
      } else if (x.t === 'prop' && x.data) {
        var p = x.data; p.since = a; p.basis = p.v; p.empty = 0; (l.props = l.props || []).push(p);
        log('Bạn được thừa kế ' + p.n + ' đang cho thuê (' + mo(l, p.v) + ').', 'good');
      } else if (x.t === 'venture' && x.data) {
        var v = x.data, same = (l.ventures || []).filter(function (y) { return y.k === v.k; })[0];
        v.yrs = 0; v.bad = 0; v.good = 0;
        if (same) { same.br = (same.br || 1) + (v.br || 1); same.cap += v.cap; log('Bạn tiếp quản ' + v.n + ' của ' + P(f) + ', gộp vào cơ sở cùng ngành của mình (' + mo(l, v.cap) + ').', 'big'); }
        else { (l.ventures = l.ventures || []).push(v); log('Bạn tiếp quản ' + v.n + (v.br > 1 ? ' (' + v.br + ' cơ sở)' : '') + ' — cơ ngơi ' + P(f) + ' gây dựng, trị giá ' + mo(l, v.cap) + '.', 'big'); }
        H.mem(l, 'Ngày đầu tiên ngồi vào bàn làm việc của ' + P(f) + ' ở ' + v.n + '.', 5);
      } else if (x.t === 'land') {
        E.migrateExt && E.migrateExt(l);
        l.assets.land = (l.assets.land || 0) + x.v; l.basis.land = (l.basis.land || 0) + x.v;
        log('Bạn được thừa kế lô đất của ' + P(f) + ' (' + mo(l, x.v) + ').', 'good');
      }
    });
  }
  // nhận tài sản đúng năm bố / mẹ ra đi (chạy sau phần tiền mặt của bản cũ); chưa đủ 18 tuổi thì người giám hộ giữ hộ
  E.HOOKS.year.push(function (l, r, log, a) {
    var f = l.flags.heirOf;
    if (l.flags.heirItemsTrust && a >= 18) { var t = l.flags.heirItemsTrust; l.flags.heirItemsTrust = null; log('Tròn 18 tuổi, người giám hộ bàn giao lại tài sản ' + P(t.f) + ' để lại cho bạn.', 'good'); receive(l, t.f, t.items, log, a); }
    if (!f || !f.items || f.itemsDone || a < f.at) return;
    f.itemsDone = true;
    if (f.pay > 0.5) { H.cash(l, -f.pay, 'Bù chênh lệch thừa kế cho người thân'); log('Phần tài sản bạn nhận lớn hơn suất được hưởng, nên bạn bù ' + mo(l, f.pay) + ' cho những người thừa kế khác.', 'neutral'); }
    if (a >= 18) receive(l, f, f.items, log, a);
    else { l.flags.heirItemsTrust = { f: { sex: f.sex, name: f.name }, items: f.items }; log('Bạn chưa đủ 18 tuổi, nên ' + f.items.map(function (x) { return x.n; }).join(', ') + ' do người giám hộ đứng tên giữ hộ đến khi bạn trưởng thành.', 'neutral'); }
  });
})(G);

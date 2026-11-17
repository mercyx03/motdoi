/* Corporate football ownership uses the existing company treasury and club catalogue. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, C = E.WORLD120;
  var B = E.BUSINESS123, R = E.BUSINESS133, T = E.TREASURY165, F = E.FOOTBALL, D = E.FOOTBALL_DATA;
  var plans = { balanced: 'Cân bằng', youth: 'Đầu tư học viện', commercial: 'Khai thác thương mại' };
  function year(l) { return l.birthYear + l.age; }
  function portfolio(c) { return c.football959 || (c.football959 = { clubs: [], deals: [] }); }
  function owned(c) { return c.football959 ? c.football959.clubs : []; }
  function occupied(l, id) {
    return B.companies(l).some(function (c) { return !c.merged && owned(c).some(function (a) { return a.id === id; }); });
  }
  function allowed(l, c) {
    return !!(c && !c.merged && c.share > 50 && year(l) >= 2000 && C.adult(l) === true &&
      !C.officer(l) && (l.retired || !E.isStableService(l)));
  }
  function price(l, club) { return E.usdToLocal(l, club.financeUSD * (club.tier === 1 ? 24 : 16)); }
  function reserve(l, c) { return Math.min(c.value * .03, l.base * 2); }
  function canBuy(l, c, club, amount) {
    return allowed(l, c) && club && !occupied(l, club.id) &&
      !owned(c).some(function (a) { return F.club(a.id).country === club.country; }) &&
      T.ensure(l, c).cash >= amount + reserve(l, c);
  }
  function propose(l, c, club, log) {
    var amount = price(l, club);
    if (!canBuy(l, c, club, amount)) return false;
    var p = portfolio(c);
    if (p.deals.some(function (d) { return d.id === club.id; })) return false;
    p.deals.push({ id: club.id, amount: amount, review: year(l) + 1 });
    log(c.name + ' nộp đề nghị mua quyền kiểm soát ' + club.name + '. Cổ đông CLB phản hồi vào năm sau.', 'neutral');
    return true;
  }
  function confirm(l, c, d, r, log) {
    var p = portfolio(c), club = F.club(d.id);
    if (p.deals.indexOf(d) < 0 || year(l) !== d.review || !canBuy(l, c, club, d.amount)) return false;
    p.deals.splice(p.deals.indexOf(d), 1);
    if (r() >= U.clamp(.68 + (c.governance || 0) * .04 - (club.tier === 1 ? .12 : 0), .5, .85)) {
      log('Cổ đông ' + club.name + ' từ chối đề nghị. Công ty giữ nguyên tiền mặt.', 'neutral');
      return false;
    }
    T.transaction(l, c, -d.amount, 'Mua quyền kiểm soát ' + club.name, 'investing');
    p.clubs.push({ id: club.id, book: d.amount, since: year(l), plan: 'balanced', academy: 0, fans: 50, history: [] });
    log(c.name + ' mua quyền kiểm soát ' + club.name + ' bằng ngân quỹ công ty.', 'big');
    return true;
  }
  function sell(l, c, a, log) {
    if (!allowed(l, c) || !owned(c).includes(a)) return false;
    var offer = a.book * (.78 + a.fans / 500 + a.academy / 1000), club = F.club(a.id);
    T.transaction(l, c, offer, 'Bán quyền kiểm soát ' + club.name, 'investing');
    c.value = Math.max(0, c.value + offer - a.book);
    owned(c).splice(owned(c).indexOf(a), 1);
    log('Công ty bán ' + club.name + ', thu về ' + H.money(l, offer) + ' vào ngân quỹ.', 'neutral');
    return true;
  }
  function book(c) { return owned(c).reduce(function (sum, a) { return sum + a.book; }, 0); }
  function runSeason(l, c, r, log) {
    var clubs = owned(c), p = c.football959, y = year(l);
    if (!p || !clubs.length || p.last === y) return;
    p.last = y;
    var network = p.network && new Set(clubs.map(function (a) { return F.club(a.id).country; })).size > 1;
    clubs.forEach(function (a) {
      if (a.since >= y) return;
      var club = F.club(a.id);
      var form = U.clamp(club.strength + (r() - .5) * 40 + a.academy * .16, 0, 100);
      var revenue = a.book * (.055 + a.fans * .00045 + form * .00065 + (network ? .009 : 0) + (a.plan === 'commercial' ? .017 : 0));
      var cost = a.book * (.127 + (a.plan === 'youth' ? .021 : a.plan === 'commercial' ? .008 : 0) + (network ? .004 : 0));
      var net = revenue - cost;
      a.fans = U.clamp(a.fans + (form - 55) * .12 + (a.plan === 'commercial' ? 2 : 0), 10, 100);
      a.academy = U.clamp(a.academy + (a.plan === 'youth' ? 7 : 2) + (network ? 2 : 0), 0, 100);
      a.history.push({ year: y, revenue: revenue, cost: cost, form: Math.round(form) });
      if (a.history.length > 8) a.history.shift();
      T.transaction(l, c, revenue, 'Vé, tài trợ và doanh thu ' + club.name, 'operating');
      T.transaction(l, c, -cost, 'Quỹ lương và vận hành ' + club.name, 'operating');
      // Treasury settlement includes posted operating profit in tax, but the cash is already posted.
      c.value += net;
      log(club.name + ' kết mùa ' + (net >= 0 ? 'lãi ' : 'lỗ ') + H.money(l, Math.abs(net)) + ' trước thuế.', net >= 0 ? 'good' : 'bad');
    });
  }
  X.menu('footballCompany959', 'Mua và điều hành các CLB bóng đá', C.adult, function (l, d) {
    var c = T.find(l, d.arg || {});
    if (!c) return 'Công ty đã ngừng hoạt động.';
    var clubs = owned(c), t = T.ensure(l, c);
    return c.name + ' · ngân quỹ ' + H.money(l, t.cash) + '. Mỗi giải quốc gia tối đa một CLB do công ty này kiểm soát. Có thể dùng chung tuyển trạch và học viện khi sở hữu ở nhiều quốc gia. Giá và kết quả hoạt động được tính trong trò chơi.\n' +
      clubs.map(function (a) {
        var last = a.history[a.history.length - 1];
        return F.club(a.id).name + ' · ' + plans[a.plan] + ' · học viện ' + a.academy + '/100' +
          (last ? ' · mùa ' + last.year + ': thu ' + H.money(l, last.revenue) + ', chi ' + H.money(l, last.cost) : '');
      }).join('\n');
  }, function (l, arg) {
    var c = T.find(l, arg);
    if (!allowed(l, c)) return [];
    var p = portfolio(c), out = [], y = year(l);
    p.deals.filter(function (d) { return d.review >= y; }).forEach(function (d) {
      var club = F.club(d.id);
      out.push({ k: 'confirm:' + d.id, l: 'Chốt mua ' + club.name + ' · ' + H.money(l, d.amount),
        why: y < d.review ? 'Đợi đến năm ' + d.review : canBuy(l, c, club, d.amount) ? true : 'Thiếu ngân quỹ hoặc CLB không còn phù hợp',
        run: function (l, r, log) { confirm(l, c, d, r, log); } });
    });
    var markets = new Set(p.clubs.map(function (a) { return F.club(a.id).country; }));
    if (markets.size > 1) out.push({ k: 'network', l: p.network ? 'Tách vận hành các CLB' : 'Vận hành mạng lưới tuyển trạch và học viện chung',
      run: function (l, r, log) { if (allowed(l, c)) { p.network = !p.network; log(p.network ? 'Công ty chia sẻ đội tuyển trạch và chương trình đào tạo giữa các CLB.' : 'Các CLB trở lại vận hành riêng.', 'neutral'); } } });
    p.clubs.forEach(function (a) {
      var name = F.club(a.id).name;
      Object.keys(plans).forEach(function (k) { if (k !== a.plan) out.push({ k: k + ':' + a.id, l: name + ' · ' + plans[k], run: function (l) { if (allowed(l, c) && owned(c).includes(a)) a.plan = k; } }); });
      out.push({ k: 'sell:' + a.id, l: 'Bán quyền kiểm soát ' + name, run: function (l, r, log) { sell(l, c, a, log); } });
    });
    if (!arg.market) {
      Object.keys(D.markets).forEach(function (cc) {
        if (!markets.has(cc)) out.push({ k: 'market:' + cc, l: 'Xem CLB tại ' + G.W.BY[cc].name, run: function (l, r) { X.next(l, 'footballCompany959', r, { cid: arg.cid, market: cc }); } });
      });
    } else {
      D.clubs.filter(function (club) { return club.country === arg.market && !occupied(l, club.id); }).forEach(function (club) {
        var amount = price(l, club);
        out.push({ k: 'buy:' + club.id, l: 'Đề nghị mua ' + club.name + ' · ' + H.money(l, amount),
          why: p.deals.some(function (d) { return d.id === club.id && d.review >= y; }) ? 'Đang có đề nghị' : canBuy(l, c, club, amount) ? true : 'Thiếu ngân quỹ hoặc trùng giải',
          run: function (l, r, log) { p.deals = p.deals.filter(function (d) { return d.review >= year(l); }); propose(l, c, club, log); } });
      });
      out.push({ k: 'back', l: 'Quay lại danh mục CLB', run: function (l, r) { X.next(l, 'footballCompany959', r, { cid: arg.cid }); } });
    }
    return out;
  }, 18);
  var rows = R.dealRows;
  R.dealRows = function (l, i) {
    var out = rows.apply(this, arguments), c = B.companies(l)[i];
    if (allowed(l, c)) out.push({ k: 'football959', l: 'Mua và điều hành CLB bóng đá', run: function (l, r) { X.next(l, 'footballCompany959', r, { cid: X.uid(l, c) }); } });
    return out;
  };
  var scale = T.scale;
  T.scale = function (c, factor) {
    scale(c, factor);
    if (!c.football959) return;
    c.football959.deals.forEach(function (d) { d.amount *= factor; });
    owned(c).forEach(function (a) { a.book *= factor; a.history.forEach(function (h) { h.revenue *= factor; h.cost *= factor; }); });
  };
  var merge = T.merge;
  T.merge = function (l, companies, target) {
    merge(l, companies, target);
    if (!companies.some(function (c) { return c.football959; })) return;
    var p = portfolio(target);
    companies.forEach(function (c) { if (c !== target) p.clubs = p.clubs.concat(owned(c)); });
    p.deals = [];
  };
  E.FOOTBALL_BUS959 = { book: book, season: runSeason, propose: propose, confirm: confirm, sell: sell, price: price };
})(globalThis.G);

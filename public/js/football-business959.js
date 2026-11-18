/* Corporate football ownership uses the existing company treasury and club catalogue. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, C = E.WORLD120;
  var B = E.BUSINESS123, R = E.BUSINESS133, T = E.TREASURY165, F = E.FOOTBALL, D = E.FOOTBALL_DATA;
  var plans = { balanced: 'Cân bằng', youth: 'Đầu tư học viện', commercial: 'Khai thác thương mại' };
  function year(l) { return l.birthYear + l.age; }
  function portfolio(c) { return c.football959 || (c.football959 = { clubs: [], deals: [] }); }
  function owned(c) { return c.football959 ? c.football959.clubs : []; }
  function loans(c) { var p = portfolio(c); return p.loans || (p.loans = []); }
  function clubAsset(c, id) { return owned(c).find(function (a) { return a.id === id; }); }
  function activeLoan(q) { return q.status === 'scheduled'; }
  function playingTime(from,to) {
    var competition=F.club(to.id).strength-F.club(from.id).strength;
    var minimum=Math.round(U.clamp(700-competition*14+(to.plan==='youth'?100:0),620,980));
    return [minimum,minimum+850];
  }
  function loanConflict(c,from,to) {
    return loans(c).some(function(q){return activeLoan(q)&&(q.from===from.id||q.to===to.id);});
  }
  function startYouthLoan(l, c, from, to, share, log) {
    var player = from && from.youth960, y = year(l);
    if (!allowed(l, c) || !portfolio(c).network || !owned(c).includes(from) || !owned(c).includes(to) || from === to ||
        !player || y + 1 - player.born > 21 || (share !== .25 && share !== .5 && share !== .75) ||
        F.club(to.id).strength > F.club(from.id).strength + 5 ||
        loanConflict(c,from,to)) return false;
    var wage = from.book * .004, report=review(c,from);
    if(trainingPending(report))return false;
    if(report&&report.loan.offer961){
      delete report.loan.offer961;
      log('Đề nghị chuyển nhượng cũ khép lại vì cầu thủ sẽ tiếp tục được cho mượn.','neutral');
    }
    loans(c).push({ name: player.name, born: player.born, from: from.id, to: to.id, year: y + 1, share: share, wage: wage, playing966:playingTime(from,to), status: 'scheduled' });
    log(player.name + ' sẽ thi đấu một mùa tại ' + F.club(to.id).name + '. Đội nhận chịu ' + Math.round(share * 100) + '% lương và cầu thủ trở về khi hết mùa.', 'neutral');
    return true;
  }
  function closeYouthLoans(l, c, r, log) {
    var y = year(l), adjustments = {};
    loans(c).forEach(function (q) {
      if (!activeLoan(q) || q.year > y) return;
      var from = clubAsset(c, q.from), to = clubAsset(c, q.to), youth = from && from.youth960;
      if (q.year !== y || !youth || youth.name !== q.name || (q.born != null && q.born !== youth.born) || !to) { q.status = 'cancelled'; return; }
      var range=q.playing966||[700,1550];
      q.minutes = Math.round(range[0]+r()*(range[1]-range[0]));
      q.rating = Math.round(U.clamp(45 + q.minutes / 40 + (r() - .5) * 20, 0, 100));
      q.hostWage = q.wage * q.share;
      q.parentWage = q.wage - q.hostWage;
      q.status = 'returned';
      youth.minutes = (youth.minutes || 0) + q.minutes;
      from.academy = Math.min(100, from.academy + 3);
      adjustments[q.from] = (adjustments[q.from] || 0) - q.hostWage;
      adjustments[q.to] = (adjustments[q.to] || 0) + q.hostWage;
      log(q.name + ' chơi ' + q.minutes + ' phút cho ' + F.club(q.to).name + ', rồi trở về ' + F.club(q.from).name + '.', 'good');
    });
    return adjustments;
  }
  function review(c, a) {
    var p = a.youth960;
    if (!p || loans(c).some(function (q) { return activeLoan(q) && q.from === a.id; })) return null;
    var q = loans(c).slice().reverse().find(function (q) {
      return q.from === a.id && q.name === p.name && q.status === 'returned' && (q.born == null || q.born === p.born);
    });
    if (!q || q.decision961) return null;
    return { loan: q, player: p, rating: q.rating == null ? Math.round(45 + q.minutes / 40) : q.rating };
  }
  function trainingCheck(l,c,a) {
    var report=review(c,a),y=year(l);
    return allowed(l,c)&&owned(c).includes(a)&&report&&y-report.loan.year<=1&&
      report.loan.minutes>=900&&report.rating<67&&!report.loan.training967&&!report.loan.offer961&&
      T.ensure(l,c).cash>=reserve(l,c)+a.book*.002;
  }
  function training(l,c,a,log) {
    if(!trainingCheck(l,c,a))return false;
    var report=review(c,a),cost=a.book*.002;
    T.transaction(l,c,-cost,'Huấn luyện sau mùa cho mượn của '+report.player.name,'operating');
    c.value=Math.max(0,c.value-cost);
    report.loan.training967={due:year(l)+1,status:'training'};
    log(report.player.name+' bắt đầu đợt rèn kỹ năng ở CLB chủ quản. HLV sẽ đánh giá vào mùa sau.','neutral');
    return true;
  }
  function trainingPending(report) { return report&&report.loan.training967?.status==='training'; }
  function trainingYear(l,c,r,log) {
    loans(c).forEach(function(q){
      var training=q.training967;
      if(!training||training.status!=='training'||training.due>year(l))return;
      var a=clubAsset(c,q.from),report=a&&review(c,a);
      if(!report||report.loan!==q||year(l)-q.year>2){
        training.status='cancelled';
        return;
      }
      var gain=4+Math.round(r()*4);
      q.rating=Math.min(100,report.rating+gain);
      training.status='completed';
      log(q.name+' hoàn thành đợt rèn kỹ năng, HLV đánh giá '+q.rating+'/100.','good');
    });
  }
  function firstTeamCheck(l, c, a) {
    if (!allowed(l, c) || !owned(c).includes(a)) return 'Cần quyền điều hành CLB';
    var report = review(c, a);
    if (!report || year(l) - report.loan.year > 2) return 'Cần báo cáo sau mùa cho mượn còn hiệu lực';
    if (a.first961 && a.first961.until > year(l)) return 'Đã dùng suất phát triển đội một';
    if (trainingPending(report)) return 'Chờ đánh giá sau đợt rèn kỹ năng vào mùa '+report.loan.training967.due;
    if (report.loan.minutes < 900 || report.rating < 67) return 'HLV cần ít nhất 900 phút thi đấu và đánh giá 67/100';
    if (T.ensure(l, c).cash < reserve(l, c) + a.book * .008) return 'Ngân quỹ chưa đủ lương mùa đầu và dự phòng';
    return true;
  }
  function nextStep(l, c, a, report) {
    var active=loans(c).find(function(q){return q.from===a.id&&activeLoan(q);});
    if(active)return 'Cầu thủ trở về sau mùa '+active.year+'.';
    if(!report)return '';
    if(trainingPending(report))return 'Đang rèn kỹ năng tại đội chủ quản, chờ HLV đánh giá mùa '+report.loan.training967.due+'.';
    var y=year(l),offer=report.loan.offer961,verdict=firstTeamCheck(l,c,a);
    if(y-report.loan.year>2)return 'Báo cáo cũ đã hết hiệu lực. Có thể cân nhắc một mùa cho mượn mới.';
    return (verdict===true?'Có thể ký hợp đồng đội một.':verdict+'.')+
      (offer&&offer.due>=y?' Đề nghị chuyển nhượng có thể chốt ở mùa '+offer.due+'.':' Có thể xem phương án cho mượn tiếp.');
  }
  function promote(l, c, a, log) {
    if (firstTeamCheck(l, c, a) !== true) return false;
    var report = review(c, a), y = year(l);
    a.first961 = { name: report.player.name, from: y + 1, until: y + 3, wage: a.book * .008, rating: report.rating };
    report.loan.decision961 = 'promoted';
    delete a.youth960;
    log(report.player.name + ' ký hợp đồng phát triển đội một hai mùa với ' + F.club(a.id).name + '.', 'good');
    return true;
  }
  function transferProspect(l, c, a, log) {
    if (!allowed(l, c) || !owned(c).includes(a)) return false;
    var r = review(c, a), y = year(l);
    if (trainingPending(r)) return false;
    if (!r || y - r.loan.year > 2 || (!r.loan.offer961 && y - r.loan.year >= 2)) return false;
    if (!r.loan.offer961) {
      r.loan.offer961 = { due: y + 1, fee: a.book * (.012 + r.rating * .00025) };
      log('Công ty nhận đề nghị chuyển nhượng ' + r.player.name + ', có thể chốt vào mùa sau.', 'neutral');
      return true;
    }
    if (y !== r.loan.offer961.due) return false;
    var fee = r.loan.offer961.fee;
    T.transaction(l, c, fee, 'Phí chuyển nhượng ' + r.player.name, 'investing');
    c.value += fee;
    r.loan.decision961 = 'sold';
    delete a.youth960;
    log('Hoàn tất chuyển nhượng ' + r.player.name + ', ngân quỹ CLB nhận ' + H.money(l, fee) + '.', 'good');
    return true;
  }
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
    return allowed(l, c) && F.available(l,club) && !occupied(l, club.id) &&
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
    loans(c).forEach(function (q) {
      if (activeLoan(q) && (q.from === a.id || q.to === a.id)) {
        q.status = 'cancelled';
        log('Hủy lịch mượn của ' + q.name + ' do CLB đổi chủ. Hồ sơ cầu thủ giữ ở đội chủ quản.', 'neutral');
      }
    });
    log('Công ty bán ' + club.name + ', thu về ' + H.money(l, offer) + ' vào ngân quỹ.', 'neutral');
    return true;
  }
  function book(c) { return owned(c).reduce(function (sum, a) { return sum + a.book; }, 0); }
  function runSeason(l, c, r, log) {
    var clubs = owned(c), p = c.football959, y = year(l);
    if (!p || !clubs.length || p.last === y) return;
    p.last = y;
    var wages = closeYouthLoans(l, c, r, log);
    trainingYear(l,c,r,log);
    var network = p.network && new Set(clubs.map(function (a) { return F.club(a.id).country; })).size > 1;
    clubs.forEach(function (a) {
      if (a.since >= y || a.history.some(function (h) { return h.year === y; })) return;
      var club = F.club(a.id);
      var first = a.first961 && a.first961.from <= y && y < a.first961.until ? a.first961 : null;
      var form = U.clamp(club.strength + (r() - .5) * 40 + a.academy * .16 + (first ? Math.max(1, (first.rating - 60) * .14) : 0), 0, 100);
      var revenue = a.book * (.055 + a.fans * .00045 + form * .00065 + (network ? .009 : 0) + (a.plan === 'commercial' ? .017 : 0));
      var cost = a.book * (.127 + (a.plan === 'youth' ? .021 : a.plan === 'commercial' ? .008 : 0) + (network ? .004 : 0)) + (wages[a.id] || 0) + (first ? first.wage : 0);
      var net = revenue - cost;
      a.fans = U.clamp(a.fans + (form - 55) * .12 + (a.plan === 'commercial' ? 2 : 0), 10, 100);
      a.academy = U.clamp(a.academy + (a.plan === 'youth' ? 7 : 2) + (network ? 2 : 0), 0, 100);
      var report = review(c, a);
      if (a.academy >= 12 && (!a.youth960 || (y - a.youth960.born > 21 && (!report || y - report.loan.year > 2)))) a.youth960 = { name: H.stranger(l, r, 'M'), born: y - 17, minutes: 0 };
      a.history.push({ year: y, revenue: revenue, cost: cost, form: Math.round(form), first: first ? first.name : null });
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
        var last = a.history[a.history.length - 1], report = review(c, a), first = a.first961, step=nextStep(l,c,a,report);
        return F.club(a.id).name + ' · ' + plans[a.plan] + ' · học viện ' + a.academy + '/100' +
          (report && year(l) - report.loan.year <= 2 ? '\nHLV: ' + report.player.name + ' · ' + report.loan.minutes + ' phút · ' + report.rating + '/100 sau khi trở về.' : '') +
          (step?'\n'+step:'') +
          (first && first.until > year(l) ? '\nĐội một: ' + first.name + ' · lương ' + H.money(l, first.wage) + '/mùa đến hết ' + (first.until - 1) + '.' : '') +
          (last ? ' · mùa ' + last.year + ': thu ' + H.money(l, last.revenue) + ', chi ' + H.money(l, last.cost) : '');
      }).join('\n') + '\n' + loans(c).slice(-6).map(function (q) {
        return q.name + ' · ' + F.club(q.from).name + ' → ' + F.club(q.to).name + ' · mùa ' + q.year +
          (q.status === 'returned' ? ' · về đội chủ quản sau ' + q.minutes + ' phút · đội nhận trả ' + H.money(l, q.hostWage) : q.status === 'cancelled' ? ' · đã hủy' : ' · đã hẹn');
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
      var name = F.club(a.id).name, report = review(c, a);
      if(trainingCheck(l,c,a))out.push({k:'training:'+a.id,l:'Rèn kỹ năng cho '+report.player.name+' tại đội chủ quản',
        h:H.money(l,a.book*.002)+' · đánh giá mùa '+(y+1),run:function(l,r,log){training(l,c,a,log);}});
      if (report && y - report.loan.year <= 2) {
        out.push({ k: 'promote:' + a.id, l: 'Đưa ' + report.player.name + ' lên đội một · ' + H.money(l, a.book * .008) + '/mùa',
          why: firstTeamCheck(l, c, a), run: function (l, r, log) { promote(l, c, a, log); } });
        var offer = report.loan.offer961;
        if ((!offer && y - report.loan.year < 2) || (offer && y <= offer.due)) out.push({ k: 'transfer:' + a.id, l: offer ? 'Chốt bán ' + report.player.name + ' · ' + H.money(l, offer.fee) : 'Tìm đề nghị chuyển nhượng cho ' + report.player.name,
          why: trainingPending(report)?'Đang rèn kỹ năng':offer && y < offer.due ? 'Chờ đến mùa ' + offer.due : true, run: function (l, r, log) { transferProspect(l, c, a, log); } });
      }
      if (p.network && a.youth960 && y + 1 - a.youth960.born <= 21) p.clubs.filter(function (target) {
        return target !== a && F.club(target.id).strength <= F.club(a.id).strength + 5;
      }).forEach(function (target) {
        [.25, .5, .75].forEach(function (share) {
          out.push({ k: 'loan:' + a.id + ':' + target.id + ':' + share, l: (report ? 'Cho mượn tiếp ' : 'Cho mượn ') + a.youth960.name + ' → ' + F.club(target.id).name + ' · chia lương ' + Math.round(share * 100) + '%',
            h:'Dự kiến '+playingTime(a,target).join('–')+' phút mùa '+(y+1)+(report&&report.loan.offer961?' · đề nghị chuyển nhượng đang có sẽ khép lại':''),
            why: trainingPending(report)?'Đang rèn kỹ năng':loanConflict(c,a,target) ? 'Đã có lịch mượn cho đội' : true,
            run: function (l, r, log) { startYouthLoan(l, c, a, target, share, log); } });
        });
      });
      Object.keys(plans).forEach(function (k) { if (k !== a.plan) out.push({ k: k + ':' + a.id, l: name + ' · ' + plans[k], run: function (l) { if (allowed(l, c) && owned(c).includes(a)) a.plan = k; } }); });
      out.push({ k: 'sell:' + a.id, l: 'Bán quyền kiểm soát ' + name, run: function (l, r, log) { sell(l, c, a, log); } });
    });
    if (!arg.market) {
      Object.keys(D.markets).forEach(function (cc) {
        if (!markets.has(cc) && (cc!=='SA'||year(l)>=1976)) out.push({ k: 'market:' + cc, l: 'Xem CLB tại ' + G.W.BY[cc].name, run: function (l, r) { X.next(l, 'footballCompany959', r, { cid: arg.cid, market: cc }); } });
      });
    } else {
      D.clubs.filter(function (club) { return club.country === arg.market && F.available(l,club) && !occupied(l, club.id); }).forEach(function (club) {
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
    owned(c).forEach(function (a) { a.book *= factor; if (a.first961) a.first961.wage *= factor; a.history.forEach(function (h) { h.revenue *= factor; h.cost *= factor; }); });
    loans(c).forEach(function (q) { if (q.offer961) q.offer961.fee *= factor; ['wage', 'parentWage', 'hostWage'].forEach(function (k) { if (Number.isFinite(q[k])) q[k] *= factor; }); });
  };
  var merge = T.merge;
  T.merge = function (l, companies, target) {
    merge(l, companies, target);
    if (!companies.some(function (c) { return c.football959; })) return;
    var p = portfolio(target);
    companies.forEach(function (c) {
      if (c === target || !c.football959) return;
      owned(c).forEach(function (a) { if (!clubAsset(target, a.id)) p.clubs.push(a); });
      p.loans = loans(target).concat(loans(c));
      c.football959.clubs = [];
      c.football959.loans = [];
      c.football959.deals = [];
    });
    p.deals = [];
  };
  var shift = T.shift;
  T.shift = function (c, delta) {
    shift(c, delta);
    // Kế nhiệm đổi tuổi nhân vật, còn năm hợp đồng và mùa giải là năm lịch.
    if (c.football959) c.football959.deals = [];
  };
  E.FOOTBALL_BUS959 = { book: book, season: runSeason, propose: propose, confirm: confirm, sell: sell, price: price, loan: startYouthLoan, promote: promote, transfer: transferProspect, training: training };
})(globalThis.G);

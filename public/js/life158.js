/* Derived social standing: money, control and reputation have separate sources. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, X = E.UPDATE110, B = E.BUSINESS123, C = E.ELITE148;
  function num(v) { return typeof v === 'number' && Number.isFinite(v); }
  function companies(l) { return B.companies(l).filter(function (c) { return !c.merged; }); }
  function standing(l) {
    var net = E.netWorth(l), base = l.base;
    if (!num(net) || !(base > 0)) return { tier: null, name: 'Chưa đủ dữ liệu', net: null };
    var household = E.LIFE157.resources(l).household, own = Math.max(0, num(l.lastIncome) ? l.lastIncome : 0);
    // Annual local living costs already include country, currency and economic era.
    var income = l.age < 18 && !l.indep ? household : own + (l.partner && l.partner.status === 'married' && num(l.partner.inc) ? Math.max(0, l.partner.inc) * 12 : 0);
    var tier = 0, wealth = net / base;
    C.TIERS.forEach(function (t, i) { if (wealth >= t.w) tier = i; });
    // Income can support affluent living, but cannot manufacture an ultra-rich estate.
    if (net >= 0 && income / base >= 4) tier = Math.max(tier, 1);
    if (net >= 0 && income / base >= 20) tier = Math.max(tier, 2);
    return { tier: tier, name: C.TIERS[tier].n, net: net, annualIncome: own, householdIncome: income, equity: B.equity(l), cash: l.money };
  }
  function power(l) {
    var cs = companies(l), controlled = cs.filter(function (c) { return c.share > 50; }), sectors = {};
    var capital = 0, owned = 0, roles = 0, employees = 0, knownEmployees = true;
    controlled.forEach(function (c) { capital += Math.max(0, c.value || 0); owned += Math.max(0, c.value || 0) * c.share / 100; sectors[c.sector || 'general'] = true;
      if (Object.keys(c.roles || {}).some(function (k) { return c.roles[k].kind === 'self'; })) roles++;
      if (num(c.employees)) employees += c.employees; else knownEmployees = false;
    });
    var score = l.base > 0 && capital > 0 ? Math.min(100, Math.round(Math.log10(1 + capital / l.base) * 12 + Math.min(15, controlled.length * 2) + Math.min(10, Object.keys(sectors).length * 2) + Math.min(10, roles * 3))) : 0;
    return { score: score, controlled: controlled.length, capital: capital, equity: owned, executiveRoles: roles, industries: Object.keys(sectors).length, employees: knownEmployees ? employees : null };
  }
  function reputations(l) {
    var career = l.flags.career109, channels = l.flags.social131 && l.flags.social131.channels || [], elite = l.flags.elite148;
    return { professional: career && num(career.reputation) ? career.reputation : null,
      online: { followers: Math.max(0, l.fame || 0), channels: channels.length, engagement: channels.length ? Math.round(channels.reduce(function (n, c) { return n + (c.engagement || 0); }, 0) / channels.length) : null },
      community: elite && num(elite.rep) ? elite.rep : null,
      publicTrust: channels.length ? Math.round(channels.reduce(function (n, c) { return n + (c.reputation || 0); }, 0) / channels.length) : null };
  }
  function relativeFacts(l, p, child) {
    var id = X.uid(l, p), s = E.LIFE138.sync(l), bio = s.people[id], a = child ? l.age - p.born : p.age;
    var out = [], unknown = 'Chưa có dữ liệu riêng';
    if (bio && bio.genes && num(a)) { var b = E.LIFE138.body(bio.genes, a, p.sex); out.push(['Chiều cao mô phỏng', b.height + ' cm'], ['Đặc điểm', 'Mặt ' + bio.genes.face + ', tóc ' + bio.genes.hair]); }
    if (a >= 18) {
      out.push(['Quan điểm, thói quen', (E.NPC.trait(l, id) || {}).label || unknown]);
      out.push(['Mong muốn hôn nhân, con cái', p.lifeGoals158 || 'Chưa được người này chia sẻ']);
    }
    var holdings = E.BUSINESS123.companies(l).filter(function (c) { return !c.merged; }).reduce(function (rows, c) {
      (c.holders137 || []).forEach(function (h) { if (E.NPC.same(l, h.id, id)) rows.push(c.name + ': ' + h.share + '% · ' + H.money(l, c.value * h.share / 100)); }); return rows;
    }, []);
    out.push(['Cổ phần riêng', holdings.length ? holdings.join('; ') : 'Chưa ghi nhận cổ phần được tặng hoặc thừa kế']);
    out.push(['Nợ cá nhân', num(p.debt158) ? H.money(l, p.debt158) : unknown]);
    out.push(['Chi phí cá nhân', num(p.expense158) ? H.money(l, p.expense158) : unknown]);
    if (!child) {
      var role = E.CHILD147.profile(l, p).career;
      if (role.kind === 'role') out.push(['Chức vụ điều hành', role.main + ' · ' + role.place], ['Thu nhập từ chức vụ', H.money(l, role.monthly) + '/tháng']);
      out.push(['Tiết kiệm riêng', num(p.savings158) ? H.money(l, p.savings158) : unknown]);
      out.push(['Học vấn, chứng chỉ', p.qualifications158 || unknown]);
    }
    return out;
  }
  C.TIERS.push({ n: 'Tinh hoa xã hội', w: 100000 });
  // Replace the old follower bonus at its source, so all existing elite menus agree.
  function reputationText(l) { var r = reputations(l); return 'Uy tín nghề nghiệp: ' + (r.professional == null ? 'chưa ghi nhận' : r.professional + '/100') + ' · Độ nổi tiếng mạng: ' + r.online.followers.toLocaleString('vi-VN') + ' người theo dõi · Uy tín trong mạng lưới giao lưu: ' + (r.community == null ? 'chưa ghi nhận' : r.community + '/100') + ' · Tín nhiệm nội dung công khai: ' + (r.publicTrust == null ? 'chưa có dữ liệu' : r.publicTrust + '/100') + '.'; }
  function rankingData(l) {
    var s = l.flags.ranking158;
    if (!s) {
      s = l.flags.ranking158 = { at: l.age, history: [], seeded: true };
      var initialCount=C.people(l).length, r = E.LIFE138.random(l.id + ':wealth-ranking158');
      for (var i = 0; i < Math.min(12, Math.max(0, 60 - initialCount)); i++) {
        var p = C.meet(l, r, { kind: i % 3 === 0 ? 'investor' : 'business', where: 'danh bạ kinh tế mô phỏng', tier: 2 + i % 3 });
        p.country = i % 3 ? ['US', 'KR', 'CN', 'JP'][i % 4] : l.country;
        p.industry = Object.keys(E.BUSINESS133.sectors)[i % Object.keys(E.BUSINESS133.sectors).length];
        p.netWorth158 = l.base * Math.pow(10, 2 + r() * 4);
        var share=p.kind==='business'?55+r()*40:10+r()*30; p.business158={share:share,value:p.netWorth158*.8/(share/100),companies:1+i%4,industries:1+i%3};p.cash158=p.netWorth158*.2;
        p.economicPower158=share>50?Math.min(100,Math.round(Math.log10(1+p.business158.value/l.base)*12+Math.min(15,p.business158.companies*2)+Math.min(10,p.business158.industries*2))):0;
        p.rankingFictional158 = true;
      }
    }
    return s;
  }
  function ranking(l, scope) {
    rankingData(l);
    var rows = [{ id: 'self', name: l.name, country: l.abroad && l.abroad.perm ? l.abroad.code : l.country, industry: 'Cá nhân', net: E.netWorth(l), cash:l.money, company:companies(l).reduce(function(n,c){return n+Math.max(0,c.value||0);},0), equity:B.equity(l), power: power(l).score }];
    // Only actual recorded estates qualify. A contact's lifestyle tier is not a valuation.
    (l.flags.elite148 && l.flags.elite148.people || []).forEach(function (p) { if (p.alive !== false && num(p.netWorth158)) rows.push({ id: p.uid110, name: p.name, country: p.country || null, industry: p.industry || p.kind || null, net: p.netWorth158, cash:p.cash158, company:p.business158&&p.business158.value, equity:p.business158?p.business158.value*p.business158.share/100:null, power: num(p.economicPower158) ? p.economicPower158 : null }); });
    if (scope === 'country') rows = rows.filter(function (p) { return p.country === (l.abroad && l.abroad.perm ? l.abroad.code : l.country); });
    if (scope === 'industry') rows = rows.filter(function (p) { return p.id === 'self' || companies(l).some(function (c) { return c.sector === p.industry; }); });
    rows.sort(function (a, b) { return scope === 'power' ? (b.power || 0) - (a.power || 0) || b.net - a.net : b.net - a.net || a.id.localeCompare(b.id); });
    return rows;
  }
  X.menu('standing158', 'Địa vị, quyền lực và bảng tài sản', function (l) { return X.reason(l, 0); }, function (l) { var s = standing(l), p = power(l); return 'Tầng lớp: ' + s.name + ' · Tài sản ròng ' + H.money(l, s.net || 0) + '. Quyền lực kinh tế ' + p.score + '/100: kiểm soát ' + p.controlled + ' công ty; vốn doanh nghiệp ' + H.money(l, p.capital) + ', giá trị cổ phần kiểm soát ' + H.money(l, p.equity) + '. Nhân viên: ' + (p.employees == null ? 'chưa đủ dữ liệu' : p.employees) + '. ' + reputationText(l); }, function (l) { return [['all', 'Tài sản trong phạm vi mô phỏng'], ['country', 'Tài sản theo quốc gia'], ['industry', 'Tài sản theo ngành đang đầu tư'], ['power', 'Quyền lực kinh tế']].map(function (a) { return { k: a[0], l: a[1], run: function (l, r) { X.next(l, 'ranking158', r, { scope: a[0] }); } }; }); }, 0, 'Tiền bạc');
  X.menu('ranking158', 'Bảng xếp hạng mô phỏng · nhân vật có số liệu', function (l) { return X.reason(l, 0); }, function (l, d) { var rows = ranking(l, d.arg.scope); return 'So sánh người chơi với các doanh nhân hư cấu có sổ tài sản mô phỏng, cập nhật mỗi năm; không phải toàn dân số hay thứ hạng thế giới thực. Hiện có ' + rows.length + ' hồ sơ đủ dữ liệu.\n' + rows.map(function (p, i) { return (i + 1) + '. ' + p.name + (p.id === 'self' ? ' (bạn)' : '') + ' · tài sản ròng ' + H.money(l, p.net) + ' · tiền mặt ' + (num(p.cash)?H.money(l,p.cash):'chưa rõ') + ' · vốn công ty ' + (num(p.company)?H.money(l,p.company):'chưa rõ') + ' · giá trị cổ phần ' + (num(p.equity)?H.money(l,p.equity):'chưa rõ') + ' · quyền lực ' + (p.power == null ? 'chưa rõ' : p.power + '/100'); }).join('\n') + '\nLịch sử vị trí của bạn: ' + (l.flags.ranking158.history.map(function (h) { return h.age + ' tuổi: ' + h.rank + '/' + h.count; }).join('; ') || 'chưa có năm đối chiếu'); }, function () { return []; }, 0);
  var profile = E.profile; E.profile = function (l) { var p = profile.apply(this, arguments), s = standing(l); p.jobInfo.push('Tầng lớp xã hội: ' + s.name + ' · Quyền lực kinh tế: ' + power(l).score + '/100'); p.jobInfo.push(reputationText(l)); return p; };
  E.HOOKS.year.push(function (l) {
    var s = l.flags.ranking158; if (!l.alive || !s || s.at === l.age) return;
    s.at = l.age;
    (l.flags.elite148 && l.flags.elite148.people || []).forEach(function (p) { if (p.rankingFictional158 && p.alive !== false) { var r = E.LIFE138.random(l.id + ':' + p.uid110 + ':wealth:' + (l.birthYear + l.age)); var f=.88+r()*.24;p.netWorth158*=f;if(num(p.cash158))p.cash158*=f;if(p.business158)p.business158.value*=f; } });
    var rows = ranking(l, 'all'); s.history.push({ age: l.age, rank: rows.findIndex(function (p) { return p.id === 'self'; }) + 1, count: rows.length }); s.history = s.history.slice(-20);
  });
  var convert = E.abroadConvert; E.abroadConvert = function (l, f) { var out = convert.apply(this, arguments); (l.flags.elite148 && l.flags.elite148.people || []).forEach(function (p) { if (num(p.netWorth158)) p.netWorth158 *= f;if(num(p.cash158))p.cash158*=f;if(p.business158)p.business158.value*=f; }); return out; };
  E.STANDING158 = { standing: standing, power: power, reputations: reputations, ranking: ranking, relativeFacts: relativeFacts };
})(globalThis.G);

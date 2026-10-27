/* Corporate control is not personal cash or ownership transfer. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, B = E.BUSINESS123, R = E.BUSINESS133, X = E.UPDATE110;
  function roles(l) {
    var cs = B.companies(l).filter(function (c) { return !c.merged; }), group = E.BUSINESS137.roleCompany(l, { group: true });
    if (group) cs.push(group);
    var out = [];
    cs.forEach(function (c) { Object.keys(c.roles || {}).forEach(function (id) { if (c.roles[id].kind === 'self' && R.roles[id]) out.push({ company: c, id: id, title: R.roles[id].n, since: c.roles[id].since }); }); });
    return out.sort(function (a, b) { return (a.since || 0) - (b.since || 0) || (a.company.name || '').localeCompare(b.company.name || ''); });
  }
  function title(l) { var rs = roles(l); return rs.length ? rs[0].title + ' · ' + rs[0].company.name : null; }
  function fee(l) {
    var cs = B.controlled(l), sectors = {};
    if (!cs.length) return 0;
    var capital = 0, profit = 0;
    cs.forEach(function (c) { capital += Math.max(0, c.value || 0); profit += Math.max(0, c.lastProfit || 0); sectors[c.sector || 'general'] = true; });
    return l.base * (.3 + .02 * Math.max(0, cs.length - 1) + .04 * Math.max(0, Object.keys(sectors).length - 1)) + capital * .00015 + profit * .002;
  }
  var jobTitle = E.jobTitleOf;
  E.jobTitleOf = function (l) { return !l.job && title(l) || jobTitle.apply(this, arguments); };
  var profile = E.profile;
  E.profile = function (l) { var p = profile.apply(this, arguments); roles(l).forEach(function (r, i) { p.jobInfo.push((!l.job && i === 0 ? 'Chức vụ chính: ' : 'Chức vụ kiêm nhiệm: ') + r.title + ' · ' + r.company.name + ' · tự điều hành, không nhận lương.'); }); return p; };
  // Assign an immutable ID immediately when a company is created, not only when opening a later form.
  ['companyCapital128', 'companyStake128'].forEach(function (id) { var d = E.DEC[id], apply = d.apply; d.apply = function (l) { var out = apply.apply(this, arguments); B.companies(l).forEach(function (c) { X.uid(l, c); }); return out; }; });
  E.CORPORATE159 = { roles: roles, title: title, fee: fee };
})(globalThis.G);

/* GĐ3: bounded, read-only context for existing triggers. No random draws or save fields. */
(function (G) {
  'use strict';
  var E = G.E;
  var groups = {
    pressure: 'doi_kem kd_vay_nong_xoay_von vd_vay_chua_benh vd_hoc_phi_con sv_vay',
    incomeOpportunity: 'sv_lam_them viec_online',
    careerChange: 'chuyen_huong cn_chuyen_nghe_tuoi_40',
    careerOpportunity: 'dev_offer_nuoc_ngoai sale_khach_lon bep_cuoc_thi nc_ket_qua_dot_pha ks_sang_che vc_bo_nhiem',
    jobRisk: 'vp_sa_thai_ai cs_cat_giam',
    fatigue: 'fl_burnout_lam_dem tai_xe_ngu_gat pc_met_moi yt_truc_dem_sai_sot chan_thuong',
    distress: 'tram_cam nhung_ngay_toi sau_mat_mat',
    partnerTime: 'marriageTime130',
    partnerMoney: 'marriageMoney130',
    partnerGift: 'marriageGift130',
    partnerConflict: 'marriageJealous130',
    childCost: 'con_hoc',
    childConflict: 'con_hu con_bo_be',
    parentCare: 'bo_me_can bo_me_mot_minh',
    familySupport: 'grandCare129',
    socialNew: 'ban_than_moi',
    socialBond: 'ban_than_hen ban_than_kho ban_khung_hoang bb_hop_lop',
    studyOpportunity: 'thi_hsg thuc_tap mc_hoc_bong phat_hien len_chuyen',
    studyTogether: 'k_nhom_hoc k_ngoai_khoa k_thich_mon',
    studyPressure: 'k6_diem_kem nghi_hoc_ngheo'
  };
  function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }
  function num(x) { return typeof x === 'number' && Number.isFinite(x); }
  function centered(x, mid, scale) { return num(x) ? clamp((x - mid) / scale, -1, 1) : 0; }
  function alive(p) { return p && p.alive !== false; }
  // Only ask GĐ2 about existing IDs and existing relation data: its legacy lookup can assign IDs.
  function rel(l, p) {
    if (!alive(p) || !p.uid110 || !E.NPC || !l.flags) return null;
    var people = l.flags.life138 && l.flags.life138.people;
    if (!p.family100 && !p.persona141 && !(people && people[p.uid110])) return null;
    return E.NPC.relation(l, p.uid110);
  }
  function friends(l) {
    var seen = {}, list = [l.bff].concat(l.friends || []), total = 0, n = 0;
    list.forEach(function (p) {
      if (!alive(p) || seen[p.uid110] && p.uid110) return;
      if (p.uid110) seen[p.uid110] = true;
      var q = rel(l, p), trust = q && q.trust;
      if (num(trust) || num(p.close)) { total += num(trust) ? centered(trust, 50, 50) : centered(p.close, 50, 50); n++; }
    });
    return n ? total / n : 0;
  }
  function pressure(l) {
    if (!num(l.base) || l.base <= 0) return 0;
    if (l.age < 18 && !l.indep && l.fam) {
      var f = l.fam, income = ((f.fAlive && !f.noDad ? f.fInc || 0 : 0) + (f.mAlive ? f.mInc || 0 : 0)) * 12;
      return clamp((l.base - income) / l.base * .35, -.25, .5);
    }
    var b = l.base, score = num(l.money) ? clamp((b - l.money) / (b * 3), -.35, .35) : 0;
    var debt = (l.loans || []).reduce(function (s, x) { return s + (x && num(x.bal) ? Math.max(0, x.bal) : 0); }, 0);
    score += Math.min(.2, debt / b * .08);
    if (!l.job && !(E.CORPORATE159 && E.CORPORATE159.title(l)) && !l.school && !l.retired && l.age >= 18) {
      score += .1;
      var u = l.flags && l.flags.career109 && l.flags.career109.unemployment;
      if (u && !u.closed && num(u.years)) score += Math.min(.15, Math.max(0, u.years) * .05);
    }
    if (num(l.lastIncome)) score += clamp((b - l.lastIncome) / b * .1, -.1, .1);
    if (score > 0) score += Math.min(.1, (l.kids || []).filter(function (k) { return alive(k) && num(k.born) && l.age >= k.born && l.age - k.born < 18; }).length * .04);
    // A house is a limited buffer, not cash available to pay a bill today.
    if (num(l.houseVal) && l.houseVal > 0) score -= Math.min(.1, l.houseVal / b * .01);
    return clamp(score, -.4, .7);
  }
  function fatigue(l) {
    var s = l.st || {}, f = l.flags || {};
    return .25 * centered(l.mind && l.mind.stress, 40, 60) - .15 * centered(s.hea, 70, 30) +
      (l.focus === 'work' ? .15 : l.focus === 'rest' ? -.15 : 0) + (l.ill ? .1 : 0) +
      (f.smoke ? .05 : 0) + (l.addict && l.addict.alcohol ? .05 : 0);
  }
  function competence(l) {
    var j = l.job || {}, s = l.st || {};
    return .2 * centered(l.skill, 50, 50) + .15 * centered(s.kno, 50, 50) +
      (num(j.yrs) ? clamp((j.yrs - 3) * .025, -.075, .15) : 0) +
      .1 * centered(l.flags && l.flags.career109 && l.flags.career109.reputation, 0, 100);
  }
  function partner(l) {
    var p = alive(l.partner) ? l.partner : null, q = p && rel(l, p);
    return { p: p, conflict: q ? -.25 * centered(q.trust, 60, 60) + .2 * centered(q.tension, 20, 80) : 0 };
  }
  function childConflict(l) {
    var sum = 0, n = 0;
    (l.kids || []).forEach(function (k) {
      if (!alive(k)) return;
      var q = rel(l, k);
      if (q && num(q.trust)) { sum -= centered(q.trust, 60, 60) * .3; n++; }
      else if (num(k.close)) { sum -= centered(k.close, 60, 60) * .3; n++; }
    });
    return n ? sum / n : 0;
  }
  function delta(tag, l) {
    var s = l.st || {}, f = l.flags || {}, p, c;
    switch (tag) {
      case 'pressure': return pressure(l);
      case 'incomeOpportunity': return Math.max(0, pressure(l)) * .45 + .1 * centered(s.kno, 50, 50);
      case 'careerChange': return fatigue(l) * .5 + (l.focus === 'study' ? .15 : 0);
      case 'careerOpportunity': return competence(l);
      case 'jobRisk': return -competence(l) * .6; // Even strong skills cannot prevent a company-wide layoff.
      case 'fatigue': return fatigue(l);
      case 'distress': return fatigue(l) - Math.max(0, friends(l)) * .15 + (f.therapy ? -.15 : 0);
      case 'partnerTime': return partner(l).conflict + (l.focus === 'work' ? .2 : 0);
      case 'partnerMoney': return partner(l).conflict + pressure(l) * .5;
      case 'partnerConflict': return partner(l).conflict; // Existing p already accounts for traits130; do not count twice.
      case 'partnerGift': p = partner(l); return -p.conflict * .5; // Small gifts remain possible when money is tight.
      case 'childCost': return pressure(l) * .6;
      case 'childConflict': return childConflict(l);
      case 'parentCare':
        c = l.fam || {}; p = [];
        if (c.mAlive && num(c.mAge) && num(l.age)) p.push(c.mAge + l.age);
        if (c.fAlive && !c.noDad && num(c.fAge) && num(l.age)) p.push(c.fAge + l.age);
        return p.length ? .3 * centered(Math.max.apply(null, p), 65, 25) : 0;
      case 'familySupport': return Math.max(0, pressure(l)) * .4;
      case 'socialNew': return .2 * centered(s.soc, 50, 50) + (l.focus === 'social' ? .15 : 0);
      case 'socialBond': return friends(l) * .25 + (l.focus === 'social' ? .1 : 0);
      case 'studyOpportunity': return Math.max(0, pressure(l)) * .12 + .25 * centered(s.kno, 50, 50) + (l.focus === 'study' ? .15 : 0) + .1 * centered(l.tr && l.tr.amb, 50, 50);
      case 'studyTogether': return .1 * centered(s.soc, 50, 50) + (l.focus === 'study' ? .2 : 0);
      case 'studyPressure': return Math.max(0, pressure(l)) * .3 + -.25 * centered(s.kno, 50, 50) + .15 * centered(l.mind && l.mind.stress, 40, 60) + (l.focus === 'study' ? -.1 : 0);
      default: return 0;
    }
  }
  function factor(t, l) {
    if (!l || l.alive === false) return 1;
    // Explicit 0 is supported for opt-in metadata only. Positive custom weights are bounded too.
    if (t.contextWeight != null) {
      var custom = typeof t.contextWeight === 'function' ? t.contextWeight(l, l.age) : t.contextWeight;
      if (custom === 0) return 0;
      return num(custom) ? clamp(custom, .5, 2) : 1;
    }
    var tags = Array.isArray(t.contextTags) ? t.contextTags : [], total = 0, used = {};
    tags.forEach(function (tag) { if (!used[tag]) { used[tag] = true; total += delta(tag, l); } });
    return clamp(1 + total, .5, 2);
  }
  function probability(t, l, base) {
    if (!t.contextTags && t.contextWeight == null) return base;
    if (!num(base)) return base === Infinity ? 1 : 0;
    return clamp(base * factor(t, l), 0, 1);
  }
  Object.keys(groups).forEach(function (tag) {
    groups[tag].split(' ').forEach(function (id) {
      E.TRIG.forEach(function (t) { if (t.id === id) t.contextTags = [tag]; });
    });
  });
  E.CONTEXT143 = { factor: factor, probability: probability, groups: groups };
})(globalThis.G);

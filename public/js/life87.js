/* Một Đời — v7.0.0: rà soát lỗi logic toàn hệ thống
   · tuổi kết hôn theo luật: Việt Nam nam từ đủ 20, nữ từ đủ 18 tuổi (Luật Hôn nhân và Gia đình 2014, Điều 8);
     các nước khác từ 18 tuổi. Chưa đủ tuổi thì không có lời cầu hôn / đám cưới; có thai sớm thì về chung sống,
     đợi đủ tuổi mới đăng ký kết hôn */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H;
  function vnLaw(l) { return H.isVN(l) && !(l.abroad && l.abroad.perm); }
  function marryAge(l, sex, cc) {
    if (!cc && H.resCode(l) === 'TH') cc = 'TH';
    if (cc ? cc === 'VN' : vnLaw(l)) return sex === 'M' ? 20 : 18;
    return E.MARRY_AGE874?.age(l, sex, cc) || 18;
  }
  function legalToMarry(l, cc, p) {
    p = p || l.partner; if (!p || p.alive === false) return false;
    var ageKnown = (cc || H.resCode(l)) !== 'TH' && p.age == null;
    return l.age >= marryAge(l, l.sex, cc) && (ageKnown || p.age >= marryAge(l, p.sex, cc));
  }
  E.marryAge = marryAge; E.legalToMarry = legalToMarry;
  function gate(id) { var D = E.DEC[id]; if (!D) return; var v = D.valid; D.valid = function (l, d) { return legalToMarry(l) && (!v || v.apply(this, arguments)); }; }
  gate('marry'); gate('cuoi_to_chuc'); gate('vn_giuc_cuoi');
  function thaiRule(l) { return E.MARRY_AGE874?.at(l, 'TH'); }
  function consentNeeded(l, p) {
    p = p || l.partner;
    var limit = thaiRule(l)?.consentUntil;
    return !!(p && limit && !p.thaiConsent983 && (l.age < limit || p.age < limit));
  }
  function thaiRegister(l, p) {
    p = p || l.partner;
    var rule = thaiRule(l);
    return !!(p && rule && legalToMarry(l, 'TH', p) && (p.sex !== l.sex || rule.sameSex) && !consentNeeded(l, p));
  }
  E.thaiRegister983 = thaiRegister;
  function canReview(l) {
    return H.resCode(l) === 'TH' && l.partner?.status === 'cohabit' && thaiRegister(l);
  }
  E.canReviewThaiMarriage = canReview;
  var marriage = E.DEC.marry, makeMarriage = marriage.make, applyMarriage = marriage.apply, autoMarriage = marriage.auto, validMarriage = marriage.valid;
  function sameThaiDecision(l, d) {
    return !d?.thai983 || H.resCode(l) === 'TH' && l.partner?.uid110 === d.thai983 && thaiRule(l)?.year === d.year983;
  }
  marriage.valid = function (l, d) {
    return sameThaiDecision(l, d) && (H.resCode(l) !== 'TH' || ['dating','cohabit'].includes(l.partner?.status)) && validMarriage(l, d);
  };
  marriage.make = function (l) {
    var d = makeMarriage.apply(this, arguments);
    if (H.resCode(l) !== 'TH' || !l.partner) return d;
    var p = l.partner, rule = thaiRule(l);
    if (!rule) return d;
    d.data = Object.assign({}, d.data, { thai983: E.UPDATE110.uid(l, p), year983: rule.year });
    d.text += ' ' + rule.text;
    if (!legalToMarry(l, 'TH')) return Object.assign(d, {opts: [{k:'wait',l:'Chờ đến khi cả hai đủ tuổi đăng ký'}]});
    if (p.status === 'cohabit') {
      d.title = 'Đăng ký kết hôn tại Thái Lan';
      d.opts = d.opts.filter(function (o) { return ['small','wait'].includes(o.k); });
    }
    if ((p.sex !== l.sex || rule.sameSex) && consentNeeded(l)) {
      d.opts = d.opts.filter(function (o) { return !['marry','small'].includes(o.k); });
      if (p.status === 'dating' && l.age >= 18 && p.age >= 18) d.opts.unshift({k:'cohabit',l:'Về chung sống trong lúc thu xếp giấy tờ'});
      if (p.thaiConsentAsked983 !== l.age) d.opts.unshift({k:'thai_consent',l:'Trao đổi với gia đình về giấy đồng ý'});
    }
    d.opts.forEach(function (o) {
      if (o.k === 'small') { o.l = 'Đăng ký kết hôn tại văn phòng huyện'; o.h = ''; }
      if (o.k === 'marry' && thaiRegister(l)) o.l = 'Đăng ký kết hôn và tổ chức đám cưới';
    });
    return d;
  };
  marriage.auto = function (l, d) {
    if (d.opts.some(function (o) { return o.k === 'thai_consent'; })) return 'thai_consent';
    if (l.partner?.status === 'cohabit' && canReview(l) && d.opts.some(function (o) { return o.k === 'small'; })) return 'small';
    return autoMarriage.apply(this, arguments);
  };
  marriage.apply = function (l, decision, key, r, log) {
    var p = l.partner, d = decision.data || {}, cc = H.resCode(l);
    if (!sameThaiDecision(l, d)) return;
    if (cc !== 'TH') return applyMarriage.apply(this, arguments);
    if (!legalToMarry(l, 'TH') || !p || !['dating','cohabit'].includes(p.status)) return;
    var rule = thaiRule(l), same = p.sex === l.sex, canRegisterSex = !same || rule?.sameSex;
    if (key === 'thai_consent') {
      if (!canRegisterSex || !consentNeeded(l) || p.thaiConsentAsked983 === l.age) return;
      p.thaiConsentAsked983 = l.age;
      var objection = p.familyObjection130;
      var refuses = objection && !objection.resolved && (objection.side === 'inlaws' ? p.age < 20 : l.age < 20);
      var family = l.fam && (l.fam.mAlive && !l.fam.noMom || l.fam.fAlive && !l.fam.noDad) || E.orphanCarer?.(l);
      if (refuses || l.age < 20 && !family) {
        log('Hai bạn chưa thu xếp đủ giấy đồng ý. Có thể trao đổi lại hoặc đợi đến khi cả hai đủ 20 tuổi.', 'neutral');
        return;
      }
      p.thaiConsent983 = true;
      log('Hai bạn đã thu xếp đủ giấy đồng ý. Giờ có thể đăng ký kết hôn.', 'good');
      l.pending.unshift(marriage.make(l, r));
      return;
    }
    if (key === 'small' && !thaiRegister(l) || key === 'marry' && canRegisterSex && !thaiRegister(l)) return;
    if (key === 'cohabit' && (p.status !== 'dating' || l.age < 18 || p.age < 18 || !consentNeeded(l))) return;
    // An older save may carry the old "live together" button under the key used for a wedding.
    if (key === 'marry' && same && canRegisterSex && !d.thai983 && !decision.opts?.some(function(o){return o.k==='small';})) {
      l.pending.unshift(marriage.make(l, r));
      return;
    }
    var from = p.status === 'cohabit' ? p.since : null;
    var out = applyMarriage.apply(this, arguments);
    if (from != null && p.status === 'married') p.cohabitedSince983 = from;
    return out;
  };
  var wedding = E.DEC.cuoi_to_chuc, makeWedding = wedding.make, weddingValid = wedding.valid;
  wedding.make = function (l) {
    var d = makeWedding.apply(this, arguments);
    if (H.resCode(l) === 'TH') {
      d.data.thai983 = E.UPDATE110.uid(l, l.partner);
      d.data.year983 = thaiRule(l)?.year;
      d.text += ' Hai bạn đăng ký tại văn phòng huyện trước khi cử hành lễ.';
    }
    return d;
  };
  wedding.valid = function (l, d) { return sameThaiDecision(l, d) && (H.resCode(l) !== 'TH' || thaiRegister(l)) && weddingValid(l, d); };
  E.ACT.push({id:'thaiMarriage983',onlyCountry:'TH',g:'Tình cảm & gia đình',l:'Bàn chuyện đăng ký kết hôn',min:17,sc:'marry',
    avail:function(l){return H.resCode(l)==='TH'&&marriage.valid(l,{})&&(l.partner.sex!==l.sex||thaiRule(l)?.sameSex);}});
  // giục cưới chỉ khi cả hai đã đủ tuổi
  E.TRIG.forEach(function (t) { if (t.id === 'vn_giuc_cuoi' || t.id === 'marry') { var w = t.when; t.when = function (l) { return legalToMarry(l) && w.apply(this, arguments); }; } });
  // đám cưới chạy bầu khi chưa đủ tuổi: về chung sống, đủ tuổi mới đăng ký
  var CB = E.DEC.co_bau_som;
  if (CB) {
    var cbAp = CB.apply, cbMake = CB.make;
    CB.make = function (l) {
      var d = cbMake.apply(this, arguments);
      if (H.resCode(l) === 'TH' && !thaiRegister(l)) {
        var wedding = d.opts.find(function(o){return o.k==='cuoi';});
        if (wedding) { wedding.l = 'Cùng nuôi con và thu xếp điều kiện đăng ký'; wedding.h = ''; }
      }
      return d;
    };
    CB.apply = function (l, d, k, r, log) {
      if (k === 'cuoi' && H.resCode(l) === 'TH' && l.partner && !thaiRegister(l)) {
        l.flags.marryWhenLegal = l.partner.name;
        log('Hai bạn chọn cùng chăm con trước. Việc đăng ký cần đợi đủ điều kiện theo luật Thái Lan.', 'neutral');
        return cbAp.call(this, l, d, 'cung_nuoi', r, log);
      }
      if (k === 'cuoi' && l.partner && !legalToMarry(l)) {
        var p = l.partner, need = Math.max(marryAge(l, l.sex) - l.age, p.age != null ? marryAge(l, p.sex) - p.age : 0);
        log((vnLaw(l) ? 'Theo Luật Hôn nhân và Gia đình, nam từ đủ 20, nữ từ đủ 18 tuổi mới được đăng ký kết hôn. ' : ('Chưa đủ tuổi kết hôn theo luật' + (E.MARRY_AGE874 && E.MARRY_AGE874.at(l) ? ' (' + E.MARRY_AGE874.at(l).text + ')' : '') + '. ')) + 'Hai gia đình cho hai bạn về ở cùng nhau, hẹn ' + need + ' năm nữa đủ tuổi sẽ làm đám cưới.', 'neutral');
        l.flags.marryWhenLegal = p.name;
        return cbAp.call(this, l, d, 'cung_nuoi', r, log);
      }
      return cbAp.apply(this, arguments);
    };
  }
  // đủ tuổi rồi thì tổ chức đám cưới đã hẹn
  E.HOOKS.year.unshift(function (l, r, log, a) {
    var n = l.flags.marryWhenLegal; if (!n || !l.partner || l.partner.name !== n || l.partner.status === 'married' || l.partner.alive === false) return;
    if (legalToMarry(l)) { l.flags.marryWhenLegal = null; var W = E.DEC.cuoi_to_chuc; if (W && W.valid(l, {})) l.pending.unshift(W.make(l, r)); else if (E.DEC.marry) l.pending.unshift(E.DEC.marry.make(l, r)); }
  });
  // lưới an toàn: không để hôn nhân dưới tuổi luật định xuất hiện từ bất kỳ đường nào
  E.HOOKS.year.unshift(function (l, r, log, a) {
    var p = l.partner; if (!p || p.status !== 'married' || p.alive === false) return;
    if (l.age < marryAge(l, l.sex) && (p.since == null || p.since >= l.age - 1)) { p.status = 'dating'; l.flags.marryWhenLegal = p.name; }
  });
  // nghỉ hưu trước tuổi (lực lượng vũ trang sau sắp xếp tổ chức): chỉ khi đã từ 48 tuổi và có từ 20 năm công tác — trước đây có người 38 tuổi đã nhận lương hưu
  E.TRIG.forEach(function (t) { if (t.id === 'qd_nghi_huu_som') { var w = t.when; t.when = function (l, a) { return l.age >= 48 && (l.workYrs || 0) >= 20 && w.apply(this, arguments); }; } });
  var NHS = E.DEC.qd_nghi_huu_som; if (NHS) { var nv = NHS.valid; NHS.valid = function (l) { return l.age >= 48 && (l.workYrs || 0) >= 20 && (!nv || nv.apply(this, arguments)); }; }
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));

/* Một Đời — v7.4.1: ở xa thì không còn chuyện "gặp nhau ăn cơm"
   · đã bảo lãnh bố mẹ sang nước ngoài sống cùng: không còn "gửi tiền về cho bố mẹ ở quê", "nhà bố mẹ ở quê bị dột", "ai nuôi bố mẹ",
     "bố mẹ ở một mình", Tết xa nhà một mình — Tết đón cùng bố mẹ ở xứ người
   · bạn thân nhớ nơi mình quen nhau: đang ở nước ngoài thì không hẹn bạn thân ở Việt Nam đi ăn, đi cà phê, chạy vào viện trong đêm…
     (vẫn nhắn tin, gọi video, cho vay qua chuyển khoản được); bạn mới quen ở nước ngoài thì gặp được ở nước ngoài
   · anh chị em ở quê: đang ở nước ngoài thì không "rủ cả nhà tụ họp ăn một bữa", chỉ gọi video
   · người LGBTQ+ ở nước ngoài nhận con nuôi: theo luật nước đang sống (không còn ghi "ở Việt Nam, một người đứng tên") */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, isVN = H.isVN;
  function locOf(l) { return l.abroad ? String(l.abroad.code || l.abroad.name || 'abroad') : 'HOME'; }
  E.locOf = locOf;
  function together(l) { return !!(l.flags.parentsAbroad && l.abroad && l.abroad.perm); }
  E.parentsWithYouAbroad = together;
  function gate(id, ok) {
    var D = E.DEC[id]; if (D) { var v = D.valid; D.valid = function (l, d) { return ok(l) && (!v || v.apply(this, arguments)); }; }
    E.TRIG.forEach(function (t) { if (t.id === id) { var w = t.when; t.when = function (l, a) { return ok(l) && w.apply(this, arguments); }; } });
  }
  // 1. bố mẹ đã sang sống cùng
  ['dc_gui_tien', 'gui_bo_me', 'fd_nuoi_bo_me', 'bo_me_mot_minh', 'dc_bao_lanh', 'dc_tet', 'fd_dat_huong_hoa'].forEach(function (id) { gate(id, function (l) { return !together(l); }); });
  var BMC = E.DEC.bo_me_can;
  if (BMC && BMC.def.prep) {
    var p0 = BMC.def.prep;
    BMC.def.prep = function (l, r) { var d = p0.apply(this, arguments); for (var i = 0; i < 10 && together(l) && /quê|mái nhà|dột|xây lại/.test(d.t + ' ' + d.w); i++) d = p0.apply(this, arguments); return d; };
    var v0 = BMC.valid; BMC.valid = function (l, d) { if (together(l) && d && /quê|mái nhà|dột|xây lại/.test((d.t || '') + ' ' + (d.w || ''))) return false; return !v0 || v0.apply(this, arguments); };
  }
  E.HOOKS.year.unshift(E.abroadYear95 = function (l, r, log, a) {
    if (!l.alive) return;
    if (together(l)) { l.flags.careDone = true; if (l.fam.mAlive || l.fam.fAlive) l.flags.caring = true; }
    // bạn thân quen ở đâu thì ở đó
    var here = locOf(l);
    [l.bff].concat(l.friends || []).forEach(function (f) { if (f && !f.loc) f.loc = f.since != null && f.since >= (l.flags.abroadSince != null ? l.flags.abroadSince : 999) ? here : 'HOME'; });
    if (l.abroad && l.flags.abroadSince == null) l.flags.abroadSince = a; if (!l.abroad) l.flags.abroadSince = null;
  });
  // bạn mới quen thì ở cùng nơi với bạn lúc quen
  var BM = E.DEC.ban_than_moi;
  if (BM) { var ap = BM.apply; BM.apply = function (l) { var n = (l.friends || []).length, out = ap.apply(this, arguments); (l.friends || []).slice(n).forEach(function (f) { f.loc = locOf(l); }); return out; }; }
  // chỉ hẹn gặp trực tiếp được bạn đang ở cùng nơi
  var fo = E.friendsOf;
  if (fo) E.friendsOf = function (l) { var here = locOf(l); return fo.apply(this, arguments).filter(function (f) { return (f.loc || 'HOME') === here; }); };
  E.friendsFar = function (l) { var here = locOf(l); return [l.bff].concat(l.friends || []).filter(function (f) { return f && f.alive !== false && (f.loc || 'HOME') !== here; }); };
  // bạn thân ở Việt Nam nhập viện: đang ở nước ngoài thì không "lao vào viện trong đêm"
  var BNV = E.DEC.ban_nam_vien;
  if (BNV) BNV.def.opts.forEach(function (o) { if (o.k !== 'visit') return; var rq = o.req; o.req = function (l, d) { return (l.bff && (l.bff.loc || 'HOME') === locOf(l)) && (!rq || rq.apply(this, arguments)); }; });
  // ở xa: nhắn tin, gọi video với bạn cũ
  E.EVENTS.push({ c: function (l, a) { return !!l.abroad && a >= 18 && E.friendsFar(l).length > 0; }, p: 0.12, cd: 3, run: function (l, a, r, log) {
    var f = U.pick(r, E.friendsFar(l));
    log(U.pick(r, ['Gọi video với ' + f.name + ' ở quê nhà, hai đứa cười mãi vì lệch múi giờ: bên này đã khuya, bên kia còn đang ăn trưa.', f.name + ' nhắn tin kể chuyện ở nhà, gửi kèm ảnh quán quen ngày xưa: "Bao giờ về thì đi ăn nhé."', 'Sinh nhật ' + f.name + ', bạn chỉ kịp gửi lời chúc và một món quà qua mạng.']), 'neutral');
    f.close = Math.min(100, (f.close || 50) + 2);
  } });
  // anh chị em ở quê: đang ở nước ngoài thì không "rủ cả nhà ăn một bữa"
  var SG = E.DEC.sib_gap;
  if (SG) {
    SG.def.opts.forEach(function (o) { if (o.k === 'meal' || o.k === 'trip') { var rq = o.req; o.req = function (l, d) { return !l.abroad && (!rq || rq.apply(this, arguments)); }; } });
    if (!SG.def.opts.some(function (o) { return o.k === 'video'; })) SG.def.opts.unshift({ k: 'video', l: 'Gọi video cho cả nhà ở quê', req: function (l) { return !!l.abroad; }, run: function (l, r, log, d) { var s = l.sibList && l.sibList[d.i]; if (s) s.close = Math.min(100, s.close + 4); log('Cả nhà ở quê gọi video sang, ' + (s && H.sibCall ? H.sibCall(l, s) : 'anh chị em') + ' giơ máy cho bạn xem mâm cơm, đứa cháu mới tập nói. Bạn cười mà cay cay sống mũi.', 'neutral'); H.fx(l, { hap: 2 }); } });
  }
  // 2. con nuôi của cặp đôi đồng giới theo luật nước đang sống
  var JOINT = /^(US|CA|GB|IE|FR|DE|NL|BE|LU|ES|PT|AT|CH|DK|SE|NO|FI|IS|MT|SI|EE|GR|AU|NZ|BR|AR|UY|CO|MX|ZA|TW|AD)$/;
  var LN = E.DEC.lg_nuoi_con;
  if (LN && typeof LN.def.text === 'function') {
    LN.def.text = function (l) {
      var abroad = l.abroad && l.abroad.perm, code = String(abroad ? l.abroad.code : l.country || '').toUpperCase(), name = abroad ? l.abroad.name : (isVN(l) ? 'Việt Nam' : l.countryName);
      var law = code === 'VN' || (!abroad && isVN(l)) ? ' (ở Việt Nam, một người đứng tên nhận con nuôi)' : JOINT.test(code) ? ' (ở ' + name + ', hai người được cùng đứng tên nhận con nuôi)' : ' (ở ' + name + ', luật chưa cho cặp đôi đồng giới cùng nhận con nuôi, một người đứng tên)';
      return 'Bạn và ' + l.partner.name + ' ' + Math.max(1, l.age - l.partner.since) + ' năm sống chung, căn nhà nhỏ bắt đầu thấy vắng. Hai người bàn chuyện nhận nuôi một đứa trẻ' + law + '.';
    };
  }
  // Tết ở nước ngoài
  E.EVENTS.push({ c: function (l, a) { return isVN(l) && together(l) && a >= 18; }, p: 0.12, cd: 3, run: function (l, a, r, log) {
    log(U.pick(r, ['Tết ở ' + l.abroad.name + ', cả nhà vẫn gói bánh chưng, ' + (l.fam.mAlive ? 'mẹ' : 'bố') + ' bày mâm ngũ quả y như ở quê.', 'Giao thừa nơi xứ người, có bố mẹ bên cạnh nên căn nhà ấm hẳn.']), 'good'); H.fx(l, { hap: 3 });
  } });
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));

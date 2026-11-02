/* Một Đời — MD4 D17 (8.10.22): khởi đầu trong cơ sở bảo trợ, nhận nuôi nhiều giai đoạn, tìm nguồn gốc và đoàn tụ.
   Mở rộng life88 (xuất thân mồ côi, mc_nhan_nuoi, mc_tim_bo_me) và family-origins (originsContact, originsFamily, E.ORIGINS);
   không tạo bộ cha mẹ tên tự do thứ hai.
   · Hồ sơ nguồn gốc tách: cha mẹ sinh học (chưa biết / đã mất đã xác minh / còn sống chưa rõ nơi / đã xác minh), cha mẹ pháp lý,
     người giám hộ, lịch sử chăm sóc. Lý do vào cơ sở: cha mẹ mất, không rõ thân nhân, thất lạc — không mặc định bị bỏ rơi.
   · Nhận nuôi: thẩm định gia đình → làm quen nhiều lần → ý kiến của trẻ theo tuổi → quyết định của cơ quan có thẩm quyền →
     theo dõi sau nhận nuôi. Gia đình nuôi có tính cách, tài chính, nơi sống riêng; có thể không phù hợp mà không phạt trẻ.
   · Người tự nhận thân nhân: đồng ý tìm hiểu → đối chiếu chứng cứ qua cơ quan → có thể không khớp. Khớp huyết thống không tự hủy
     nhận nuôi, không đổi họ, không đổi gen; người trưởng thành tự quyết liên hệ. Cha mẹ đã xác minh qua đời thì không "sống lại".
   Kết quả băm theo nhân vật + năm (không tiêu RNG của game). */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, L = E.LIFE138, W919 = G.W && G.W.BY || {};
  if (!X || !E.DEC.mc_nhan_nuoi || !E.ORIGINS) return;
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; return h >>> 0; }
  function u(seed) { return hash(seed) / 4294967296; }
  function O(l) { return l && l.fam && l.fam.orphan || null; }
  var RECV = ['US', 'FR', 'IT', 'ES', 'SE', 'NL', 'CA', 'AU', 'DK', 'BE']; // nước thường nhận con nuôi quốc tế (tham số trò chơi)
  var TRAITS = ['kiên nhẫn', 'nghiêm khắc nhưng ấm áp', 'vui vẻ', 'ít nói', 'hay lo lắng', 'cởi mở'];
  // Hồ sơ nguồn gốc: dựng một lần. Bản lưu cũ chỉ suy từ dữ kiện đã có, không thêm sự thật mới.
  function rec(l) {
    var o = O(l); if (!o) return null; if (o.rec919) return o.rec919;
    var legacy = l.age > 0, reason = o.cause ? 'deceased' : o.unknown ? (legacy ? 'unknown' : u(l.id + ':reason919') < 0.25 ? 'lost' : 'unknown') : 'deceased';
    var bio = reason === 'deceased' ? 'deceased-verified' : reason === 'lost' ? 'alive-unknown' : 'unknown';
    o.rec919 = { v: 1, reason: reason, legacy: legacy, bio: { m: bio, f: o.unknown || reason === 'deceased' ? bio : 'unknown' }, legal: [], care: [{ at: 0, type: o.kind === 'ong_ba' || o.kind === 'ho_hang' ? 'kinship' : o.foster ? 'foster' : 'institution', who: o.carer }], claims: [] };
    if (o.adopted != null) o.rec919.legal.push({ at: o.adopted, kind: 'adoptive', who: (l.fam.fName || '') + ' & ' + (l.fam.mName || ''), legacy: true });
    return o.rec919;
  }
  var REASON = { deceased: 'cha mẹ đã qua đời (đã xác minh)', unknown: 'chưa xác định được thân nhân', lost: 'thất lạc — cha mẹ có thể vẫn còn sống' };
  // ================= Nhận nuôi nhiều giai đoạn =================
  var def = E.DEC.mc_nhan_nuoi.def, theo = def.opts.find(function (o) { return o.k === 'theo'; }), accept0 = theo.run, valid0 = def.valid;
  def.valid = function (l, d) { var o = O(l); if (o && o.adopt919 && o.adopt919.stage === 'final') return o.adopted == null && l.age <= 17; if (o && o.adopt919 && o.adopt919.stage !== 'done' && o.adopt919.stage !== 'failed') return false; return valid0.apply(this, arguments); };
  theo.l = 'Đồng ý làm quen với gia đình này';
  theo.run = function (l, r, log, d) {
    var o = O(l); if (!o || o.adopted != null) return; var x = rec(l), seed = l.id + ':fam919:' + l.age;
    var here = H.resCode(l), recv = RECV.filter(function (c) { return W919[c] && c !== here; }), cc = o.kind === 'mai_am' && u(seed + ':intl') < 0.2 && recv.length ? recv[Math.floor(u(seed + ':cc') * recv.length)] : here;
    o.adopt919 = { stage: 'assess', at: l.age, cc: cc, d: { m: d.m, f: d.f, q: d.q }, fam: { trait: TRAITS[Math.floor(u(seed + ':t') * TRAITS.length)], kids: u(seed + ':k') < 0.3 ? 1 : 0, place: l.city || l.place, lang: E.ID919 ? E.ID919.langOf(H.resCode(l)) : null, fit: u(seed + ':fit') }, visits: 0, opinion: null };
    log('Gia đình ' + d.f + ' – ' + d.m + (cc !== here ? ' (đang sống ở ' + W919[cc].name + ', hồ sơ nhận nuôi quốc tế)' : '') + ' nộp hồ sơ nhận nuôi. Cơ quan bảo trợ sẽ thẩm định gia đình và cho hai bên làm quen nhiều lần trước khi quyết định; chưa có gì thay đổi ngay.', 'neutral');
  };
  // Ý kiến của trẻ: từ 7 tuổi được hỏi, từ 10 tuổi ý kiến được cân nhắc nặng hơn (tham số trò chơi theo nguyên tắc lợi ích của trẻ).
  X.menu('adopt919', 'Làm quen với gia đình muốn nhận nuôi', function (l) { var o = O(l); return o && o.adopt919 && (o.adopt919.stage === 'meet' || o.adopt919.stage === 'assess') ? true : 'Không có hồ sơ nhận nuôi đang xét'; }, function (l) {
    var a = O(l).adopt919, f = a.fam; return 'Gia đình ' + a.d.f + ' – ' + a.d.m + ': tính cách ' + f.trait + (f.kids ? ', đã có một con' : '') + ', sống ở ' + f.place + '. Giai đoạn: ' + (a.stage === 'assess' ? 'đang thẩm định gia đình' : 'làm quen (' + a.visits + ' lần gặp)') + '.' + (l.age >= 7 ? ' Bạn được hỏi ý kiến; nói "chưa sẵn sàng" không làm bạn bị đánh giá kém.' : ' Bạn còn nhỏ; người lớn sẽ quan sát cách hai bên gắn bó.') + ' Gia đình giàu hay nghèo không quyết định kết quả.';
  }, function (l) {
    var a = O(l).adopt919, out = [{ k: 'visit', l: 'Đi chơi cuối tuần với gia đình ấy', why: a.stage === 'meet' ? a.visitAt === l.age ? 'Đã gặp năm nay' : true : 'Chờ thẩm định xong', run: function (l, r, log) { a.visits++; a.visitAt = l.age; H.fx(l, { hap: a.fam.fit > 0.3 ? 3 : 0 }); log(a.fam.fit > 0.3 ? 'Một buổi đi chơi vui; bạn bắt đầu thấy quen với giọng nói của họ.' : 'Buổi gặp hơi gượng gạo; cả hai bên đều cần thêm thời gian.', 'neutral'); } }];
    if (l.age >= 7) [['yes', 'Nói rằng mình muốn về sống cùng họ'], ['wait', 'Nói rằng mình cần thêm thời gian'], ['no', 'Nói rằng mình không muốn']].forEach(function (x) { out.push({ k: x[0], l: (a.opinion === x[0] ? '✓ ' : '') + x[1], run: function (l, r, log) { a.opinion = x[0]; log('Ý kiến của bạn được ghi vào hồ sơ.', 'neutral'); } }); });
    return out;
  }, 0, 'Tình cảm & gia đình');
  function adoptYear(l, r, log) {
    var o = O(l), a = o && o.adopt919; if (!a || a.at >= l.age && a.stage === 'assess') return;
    if (a.stage === 'assess') { if (a.fam.fit < 0.12 || a.d.q < 2) { a.stage = 'failed'; a.why = 'gia đình chưa đáp ứng yêu cầu thẩm định'; log('Hồ sơ của gia đình ' + a.d.f + ' chưa đạt thẩm định; bạn tiếp tục ở nơi hiện tại. Đây không phải lỗi của bạn.', 'neutral'); return; } a.stage = 'meet'; a.meetFrom = l.age; if (!a.visits) a.visits = 1; log('Gia đình ' + a.d.f + ' – ' + a.d.m + ' qua thẩm định; hai bên bắt đầu giai đoạn làm quen.', 'neutral'); X.next(l, 'adopt919', r, {}, { manual: false }); return; }
    if (a.stage === 'meet' && l.age - a.meetFrom >= 1) {
      if (a.visits < 2 && a.visitAt !== l.age) { a.visits++; }
      var refuse = l.age >= 10 && a.opinion === 'no' || l.age >= 7 && a.opinion === 'no' && a.fam.fit < 0.6, wait = a.opinion === 'wait' && !a.waited;
      if (wait) { a.waited = true; a.meetFrom = l.age; log('Theo ý kiến của bạn, giai đoạn làm quen được kéo dài thêm.', 'neutral'); return; }
      if (refuse || a.fam.fit < 0.2) { a.stage = 'failed'; a.why = refuse ? 'trẻ không đồng ý' : 'hai bên chưa phù hợp'; log('Cơ quan bảo trợ quyết định chưa tiến hành nhận nuôi (' + a.why + '). Bạn vẫn ở lại và có thể có cơ hội khác.', 'neutral'); return; }
      if (a.visits < 2) { a.meetFrom = l.age; return; }
      if (a.cc && a.cc !== H.resCode(l) && a.hague == null) { a.hague = l.age; a.meetFrom = l.age; log('Hồ sơ nhận nuôi quốc tế được chuyển tới cơ quan có thẩm quyền của hai nước (theo Công ước La Hay về nuôi con nuôi quốc tế) để xác nhận; cần thêm khoảng một năm.', 'neutral'); return; }
      a.stage = 'final'; var o2 = O(l), intl = a.cc && a.cc !== H.resCode(l) && W919[a.cc];
      if (intl) { var b = W919[a.cc], pool = String(b.pool).split(',')[0].split(':')[0]; H.emigrate(l, [a.cc, b.name, pool], r, log); if (l.age < 18) delete l.flags.needJob; a.citPending = { cc: a.cc, due: l.age + 1 }; log('Bạn cùng gia đình mới chuyển sang ' + b.name + '. Quốc tịch gốc được giữ trong hồ sơ; quốc tịch theo cha mẹ nuôi xét theo luật nước nhận nuôi.', 'big'); }
      accept0.call(theo, l, r, log, a.d); if (o2.adopted == null) { a.stage = 'failed'; return; }
      a.stage = 'done'; a.done = l.age; a.follow = l.age + 2; var x = rec(l); x.legal.push({ at: l.age, kind: 'adoptive', who: a.d.f + ' & ' + a.d.m }); x.care.push({ at: l.age, type: 'adoptive', who: a.d.f + ' & ' + a.d.m });
      if (E.ID919 && l.age >= 1) X.next(l, 'adoptName919', r, {}, { manual: false });
      return;
    }
    if (a.stage === 'done' && a.citPending && E.FIN920 && E.FIN920.adoptCit(l, a, log)) return; // 8.10.24: quốc tịch theo luật từng nước (fix920)
    if (a.stage === 'done' && a.citPending && l.age >= a.citPending.due) { var cc = a.citPending.cc; a.citPending = null; l.flags.citizen = l.flags.citizen || []; if (l.flags.citizen.indexOf(cc) < 0) l.flags.citizen.push(cc); log('Quốc tịch ' + (W919[cc] ? W919[cc].name : cc) + ' theo cha mẹ nuôi đã được ghi nhận (quy tắc mô phỏng; điều kiện mỗi nước khác nhau). Quốc tịch gốc không tự mất trong trò chơi.', 'good'); }
    if (a.stage === 'done' && a.follow != null && l.age <= a.follow && a.followAt !== l.age) { a.followAt = l.age; log(l.age === a.follow ? 'Đợt theo dõi sau nhận nuôi kết thúc; cán bộ ghi nhận gia đình đã gắn bó. Những ký ức ở mái ấm vẫn là một phần của bạn.' : 'Cán bộ xã hội đến thăm định kỳ sau nhận nuôi, hỏi han việc học và cảm xúc của bạn.', 'neutral'); }
  }
  // Tên sau nhận nuôi: giữ hoặc đổi theo quyền, tuổi và mong muốn; tên lúc sinh, gen, quốc tịch không đổi.
  E.SC('adoptName919', { title: 'Tên của bạn sau khi được nhận nuôi', valid: function (l) { var o = O(l); return !!(o && o.adopt919 && o.adopt919.stage === 'done' && !o.adopt919.named); },
    text: function (l) { var a = O(l).adopt919; return 'Gia đình hỏi bạn muốn giữ tên hiện tại hay dùng họ của gia đình (' + (E.ID919 ? E.ID919.nameRec(l).family.join(' ') : '') + ' → họ của ' + a.d.f + ').' + (l.age >= 10 ? ' Ý kiến của bạn được tôn trọng.' : ' Bạn còn nhỏ, người lớn quyết định có tham khảo bạn.') + ' Tên lúc sinh vẫn được lưu; gen, giấy tờ cũ và quốc tịch không thay đổi vì đổi tên.'; },
    opts: [{ k: 'keep', l: 'Giữ nguyên họ tên', run: function (l, r, log) { O(l).adopt919.named = 'keep'; log('Bạn giữ nguyên họ tên.', 'neutral'); } },
      { k: 'sur', l: 'Dùng họ của gia đình nuôi', run: function (l, r, log) { var a = O(l).adopt919; a.named = 'sur'; var n = E.ID919.nameRec(l), cc = H.resCode(l), fam = String(a.d.f).trim().split(/\s+/), sur = /^(VN|CN|TW|HK|JP|KR)$/.test(cc) ? fam[0] : fam[fam.length - 1], given = n.legal.replace(n.family.join(' '), '').trim(), t = n.order === 'family-first' ? sur + ' ' + given : given + ' ' + sur; if (E.ID919.validName(t, cc) !== true) return; n.family = [sur]; l.sur = sur; E.ID919.setLegal(l, t, 'nhận nuôi'); log('Tên mới của bạn: ' + t + ' (tên lúc sinh vẫn được ghi trong hồ sơ).', 'neutral'); } }] });
  // ================= Người tự nhận thân nhân: xác minh qua cơ quan, có thể không khớp =================
  var oc = E.DEC.originsContact && E.DEC.originsContact.def;
  if (oc) { var ver = oc.opts.find(function (x) { return x.k === 'verify'; }), ready0 = oc.valid; ver.l = 'Đồng ý đối chiếu hồ sơ/ADN qua cơ quan trước khi gặp';
    ver.run = function (l, r, log) { var o = O(l), x = rec(l); if (!o || !x || x.claims.some(function (c) { return c.stage === 'checking'; })) return; var genuine = u(l.id + ':claim919:' + x.claims.length) < (x.reason === 'lost' ? 0.75 : 0.55); x.claims.push({ at: l.age, stage: 'checking', genuine: genuine }); var fee = l.indep ? l.base * 0.02 : 0; if (fee) H.cash(l, -fee, 'Xét nghiệm, đối chiếu hồ sơ thân nhân'); log('Bạn' + (l.age < 18 ? ' và người giám hộ' : '') + ' đồng ý đối chiếu. Cơ quan sẽ kiểm tra hồ sơ thất lạc, thời gian, nơi sinh và ADN; kết quả có vào năm sau. Giống ngoại hình hay tên không phải bằng chứng.', 'neutral'); };
    oc.valid = function (l) { var x = rec(l); if (x && (x.reason === 'deceased' || x.claims.length >= 2 || x.claims.some(function (c) { return c.stage === 'checking'; }))) return false; return ready0.apply(this, arguments); };
  }
  function claimYear(l, r, log) {
    var o = O(l), x = rec(l); if (!x) return; x.claims.forEach(function (c) {
      if (c.stage !== 'checking' || c.at >= l.age) return; c.stage = c.genuine ? 'match' : 'nomatch'; c.done = l.age;
      if (c.genuine && o.found == null) { E.ORIGINS.found(l, r, log); x.bio.m = x.bio.m === 'unknown' || x.bio.m === 'alive-unknown' ? 'verified' : x.bio.m; log('Việc xác minh huyết thống không thay đổi giám hộ, nhận nuôi hay họ tên của bạn; liên hệ thế nào do ' + (l.age >= 18 ? 'bạn' : 'bạn cùng người giám hộ') + ' quyết định.', 'neutral'); X.next(l, 'originsFamily', r, {}, { manual: false }); }
      else { o.contactAfter = l.age + 4; log('Kết quả đối chiếu: người tự nhận không phải thân nhân của bạn. Hồ sơ của bạn vẫn được lưu để đối chiếu nếu có người khác.', 'neutral'); H.fx(l, { hap: -2 }); }
    });
  }
  // Cha mẹ đã mất: manh mối có thể dẫn tới họ hàng và kỷ niệm, không hồi sinh.
  function kinYear(l, r, log) {
    var o = O(l), x = rec(l); if (!x || x.reason !== 'deceased' || x.kin || l.age < 16 || !(o.kind === 'mai_am' || o.kind === 'chua')) return;
    if (u(l.id + ':kin919:' + l.age) > 0.03) return; var name = H.name(l, r, 'F').full; x.kin = { at: l.age, name: name };
    if (L) { var p = L.person(l, 'birthKin919', name, 'F', l.birthYear - 20 - Math.floor(u(l.id + ':kage') * 20), 'người thân bên ngoại'); p.events.push('Tìm lại cháu năm ' + (l.birthYear + l.age)); }
    log('Một người tên ' + name + ' tự giới thiệu là em gái của mẹ bạn, mang theo vài tấm ảnh cũ của bố mẹ. Bạn có thể giữ liên lạc nếu muốn; tài sản thừa kế (nếu có) chỉ xét qua hồ sơ pháp lý.', 'big'); H.mem(l, 'Lần đầu thấy ảnh bố mẹ thời trẻ.', 6);
  }
  // Đang được nhận nuôi hợp pháp và chưa thành niên: tìm thấy cha mẹ sinh học không tự chuyển giám hộ.
  E.HOOKS.year.unshift(function (l, r, log) { var o = O(l); if (o && o.placementRequested != null && o.adopt919 && o.adopt919.stage === 'done' && l.age < 18) { delete o.placementRequested; log('Bạn đang được nhận nuôi hợp pháp: việc thay đổi người giám hộ cần quyết định của cơ quan có thẩm quyền vì lợi ích của bạn; bạn vẫn có thể gặp người thân ruột thịt.', 'neutral'); } });
  var profile0 = E.profile; E.profile = function (l) { var p = profile0.apply(this, arguments), x = O(l) && rec(l); if (p && p.jobInfo && x) p.jobInfo.push('Hồ sơ nguồn gốc: ' + REASON[x.reason] + (x.legal.length ? ' · cha mẹ pháp lý: ' + x.legal[x.legal.length - 1].who : '') + (x.claims.length ? ' · ' + x.claims.length + ' lần đối chiếu thân nhân' : '')); return p; };
  E.HOOKS.year.push(function (l, r, log) { if (!l.alive || !O(l)) return; rec(l); adoptYear(l, r, log); claimYear(l, r, log); kinYear(l, r, log); });
  var create0 = E.createLife; E.createLife = function (o) { var l = create0.apply(this, arguments); if (l && O(l)) rec(l); return l; };
  E.ORIGIN919 = { rec: rec, REASON: REASON, adoptYear: adoptYear, claimYear: claimYear, kinYear: kinYear, accept0: accept0 };
})(globalThis.G);

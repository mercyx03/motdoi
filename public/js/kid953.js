/* Một Đời — 9.5.3: tuổi thơ nhỏ (1–10 tuổi) đa dạng hơn và theo hoàn cảnh.
   · Hai tình huống cũ "lạc giữa chợ phiên" (bi_lac) và "Lạc mất mẹ" (k6_lac_cho) được hợp nhất: mỗi đời chỉ gặp một lần, hiếm hơn nhiều,
     nơi bị lạc (chợ, ngày hội, siêu thị, bến xe) đổi theo nước, năm, nông thôn/thành thị và nghề của bố mẹ; hậu quả đi tiếp qua chuỗi lost953 (E.CHAIN144).
   · Vùng chiến sự hoặc thiên tai nặng (E.CTX945): thay bằng cảnh thất lạc khi chạy loạn, kéo dài nhiều năm qua chuỗi sep953.
   · Thêm các chuyện tuổi thơ nhỏ trên cơ chế KID/TRIG sẵn có; mức tiếp cận y tế, số người trông trẻ, mùa, nơi ở quyết định kết quả.
   Không thêm hệ thống mới: dùng E.SC, E.TRIG, E.CHAIN144, E.HOOKS.year, E.medBill, E.CTX945.of. */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E && E.H, SC = E && E.SC, C = E && E.CHAIN144;
  if (!E || !H || !SC) return;

  // ---------- tiện ích ----------
  function wy(l) { return l.birthYear + l.age; }
  function hs(l, tag) { var h = 2166136261, s = String(l.rs) + ':953:' + tag; for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 15; h = Math.imul(h, 2246822507); h ^= h >>> 13; return (h >>> 0) / 4294967296; }
  function free(l) { return !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function fl(l) { return l.flags || (l.flags = {}); }
  var ZERO = { war: 0, fam: 0, epi: 0, dis: 0, econ: 0, level: 0, pov: 0, labels: {} };
  function cx(l) { var K = E.CTX945; try { return K && K.of ? K.of(l) : ZERO; } catch (e) { return ZERO; } }
  function dev(l) { try { return E.devGdp ? E.devGdp(l) : (l.gdp || 3); } catch (e) { return l.gdp || 3; } }
  function vnd(l) { return H.isVN(l) && l.cur === 'vnd' && !(l.abroad && l.abroad.perm); }
  function V(l, tr) { return vnd(l) ? tr : tr / 90 * l.base; }
  function bill(l, tr, why, log) { var v = V(l, tr); if (E.medBill) E.medBill(l, v, why, log, 1); else H.cash(l, -v, why); }
  function stress(l, n) { if (l.mind) l.mind.stress = U.clamp((l.mind.stress || 0) + n, 0, 100); }
  function carer(l) { var oc = E.orphanCarer && E.orphanCarer(l); if (oc) return oc; var f = l.fam || {}; return f.mAlive ? 'mẹ' : f.fAlive && !f.noDad ? 'bố' : 'bà'; }
  function turbulent(l) { var c = cx(l); return c.war >= 2 || c.dis >= 2; }
  // số người lớn / anh chị lớn có thể trông bạn
  function eyes(l) { var f = l.fam || {}, n = (f.mAlive ? 1 : 0) + (f.fAlive && !f.noDad ? 1 : 0) + (E.orphanCarer && E.orphanCarer(l) ? 1 : 0); if ((l.sibList || []).some(function (s) { return s.alive !== false && s.born < 0 && -s.born >= 5; })) n++; return Math.max(1, n); }
  // tiếp cận y tế gần nhà: 0 (rất xa / bị gián đoạn) … 4 (gần, đầy đủ); là điều kiện nơi ở và thời đại, không nói gì về tính cách gia đình
  function access(l) {
    var c = cx(l), g = dev(l), q = (l.fam && l.fam.q) || 3;
    var s = (l.urban ? 1 : 0) + (g >= 2.5 ? 1 : 0) + (g >= 8 ? 1 : 0) + (q >= 4 ? 1 : 0) - (c.war >= 2 ? 2 : c.war ? 1 : 0) - (c.dis >= 2 ? 1 : 0) - (c.fam >= 2 ? 1 : 0) - (c.epi >= 2 ? 1 : 0);
    if (wy(l) < 1950) s -= 1;
    return Math.max(0, Math.min(4, s));
  }
  function jobsText(l) { var f = l.fam || {}; return (f.mJob || '') + ' ' + (f.fJob || ''); }

  // Giai đoạn kế tiếp của chuỗi đến đúng năm cố định theo mã đời (không phụ thuộc mã ngẫu nhiên của bản lưu), nên đời cùng hạt giống diễn ra như nhau
  function timed(l, c, lo, hi, tag) { if (c) { c.next = l.age + lo + Math.floor(hs(l, 'nx:' + tag + ':' + c.stage) * (hi - lo + 1)); c.due = c.next + 1; } return c; }
  function startChain(l, kind, origin, extra, lo, hi) { if (!C || !C.start) return null; return timed(l, C.start(l, kind, origin, extra), lo, hi, kind); }

  // ---------- đăng ký tình huống tuổi thơ trên cơ chế sẵn có ----------
  function KID(id, a0, a1, def, when, cw, p) {
    SC(id, def);
    E.TRIG.push({ id: id, when: function (l, a) { return a >= a0 && a <= a1 && free(l) && (!when || when(l, a)); }, p: p || 0.07, cd: 99, child: true, cw: cw || 1, max: 1 });
  }

  // ===================================================================
  // 1. LẠC GIỮA ĐÁM ĐÔNG — hợp nhất bi_lac và k6_lac_cho
  // ===================================================================
  function crowd(l) {
    var y = wy(l), vn = H.isVN(l), u = !!l.urban, g = dev(l), who = carer(l), trader = /bán|buôn|chợ|tạp hóa|hàng rong|vé số|cửa hàng/i.test(jobsText(l)), P = [];
    var toy = ['hàng kẹo bông', 'sạp đồ chơi', 'chậu cá vàng', 'gánh hàng rong', 'quầy bóng bay'];
    var bit = toy[Math.floor(hs(l, 'toy') * toy.length)];
    P.push({ k: 'cho', w: (u ? 2 : 3) + (trader ? 2 : 0),
      title: vn && !u ? 'Lạc ' + who + ' giữa chợ phiên' : 'Lạc giữa chợ đông người',
      intro: (vn && !u ? 'Phiên chợ' : 'Khu chợ') + ' đông nghịt người. Bạn mải nhìn ' + bit + ', quay lại thì không thấy ' + who + ' đâu.',
      ask: vn ? 'Nhờ cô bán hàng gọi loa tìm ' + who : 'Nhờ người bán hàng gần đó giúp', askDo: 'Người bán hàng cho gọi loa tìm giúp, mấy phút sau ' + who + ' chạy tới. Ai cũng khen bạn khôn, còn cho bạn một món quà nhỏ.',
      where: 'ở chợ', who: 'người bán hàng', long: trader ? 0.05 : 0.12, fail: trader ? 0.15 : 0.3 });
    P.push({ k: 'hoi', w: 2, title: 'Lạc giữa ngày hội', intro: 'Ngày hội của vùng đông nghịt người, ' + ['tiếng trống rộn ràng', 'đoàn diễu hành đi qua', 'các gian hàng trò chơi chật kín'][Math.floor(hs(l, 'fest') * 3)] + '. Bàn tay đang nắm bỗng tuột mất, quanh bạn toàn người lạ.',
      ask: 'Nhờ chú bảo vệ hoặc người trong ban tổ chức', askDo: 'Người trong ban tổ chức cho gọi loa, vài phút sau ' + who + ' chạy tới. Ai cũng khen bạn biết nhờ giúp đúng chỗ.', where: 'ở ngày hội', who: 'người trong ban tổ chức', long: 0.1, fail: 0.28 });
    if (u && ((vn && y >= 1996) || (!vn && y >= 1960 && g >= 8)) && g >= 2.5) P.push({ k: 'mall', w: 3, title: 'Lạc trong siêu thị', intro: 'Cuối tuần, siêu thị đông khách. Bạn mải ngắm ' + (y >= 2000 ? 'tủ kem' : 'quầy đồ chơi') + ' rồi lạc lúc nào không hay.',
      ask: 'Nhờ nhân viên hoặc bảo vệ', askDo: 'Nhân viên đưa bạn tới quầy thông báo, loa vang tên bạn. Chưa đầy năm phút, ' + who + ' đã có mặt.', where: 'trong siêu thị', who: 'nhân viên siêu thị', long: 0.06, fail: 0.15 });
    if (u && y >= 1930) P.push({ k: 'ga', w: 1.5, title: vn ? 'Lạc ở bến xe' : 'Lạc ở nhà ga', intro: 'Bến xe cuối tuần người chen nhau lên chuyến, loa gọi chuyến vang liên hồi. Bạn buông tay ' + who + ' để nhặt chiếc bóng lăn đi, quay lại đã mất hút.',
      ask: 'Nhờ nhân viên nhà xe hoặc người trực', askDo: 'Nhân viên cho gọi loa, ' + who + ' chạy tới, mắt đỏ hoe. Từ đó bạn không bao giờ buông tay ở chỗ đông người.', where: 'ở bến xe', who: 'nhân viên nhà xe', long: 0.1, fail: 0.25 });
    var sum = 0, i; P.forEach(function (p) { sum += p.w; });
    var x = hs(l, 'place') * sum; for (i = 0; i < P.length; i++) { x -= P[i].w; if (x <= 0) return P[i]; }
    return P[0];
  }
  var KEYKIND = { bi_lac: { stay: 'stay', ask: 'ask', search: 'search' }, k6_lac_cho: { dung: 'stay', nho: 'ask', chay: 'search' } };
  function lostOk(l) { return !fl(l).lost953 && !turbulent(l); }
  function lostRun(kind) {
    return function (l, r, log) {
      var P = crowd(l), who = carer(l), fear = false, learned = false;
      if (kind === 'stay') {
        if (r() < P.long) { log('Đứng khóc mãi ' + P.where + ' mà chưa thấy ' + who + ' đâu; gần một tiếng sau ' + who + ' mới chạy tới, mặt tái đi.', 'bad'); H.fx(l, { hap: -3 }); fear = true; }
        else log('Đứng yên khóc thút thít, mười phút sau ' + who + ' hớt hải chạy tới, ôm chặt bạn vào lòng.', 'neutral');
        H.mem(l, 'Lần lạc ' + who + ' ' + P.where + ', vòng tay siết chặt khi gặp lại.', 3);
      } else if (kind === 'ask') {
        log(P.askDo, 'good'); H.fx(l, { kno: 1, soc: 1 }); learned = true;
        H.mem(l, 'Lần đầu biết nhờ ' + P.who + ' giúp khi lạc ' + who + '.', 2);
      } else {
        if (r() < P.fail) { log('Đi lạc xa hơn, đến tối mới được ' + P.who + ' đưa về.', 'bad'); H.fx(l, { hap: -4 }); fear = true; stress(l, 4); H.mem(l, 'Buổi chiều đi lạc ' + P.where + ', trời tối dần mà không thấy ' + who + '.', 4); }
        else log('Lang thang một lúc rồi cũng thấy ' + who + ' đang cuống cuồng gọi tên bạn.', 'neutral');
      }
      var s = fl(l); s.lost953 = l.age;
      startChain(l, 'lost953', { dec: 'lost953', k: kind }, { data: { fear: fear, learned: learned, place: P.k, who: who } }, 1, 3);
    };
  }
  function patchLost() {
    ['bi_lac', 'k6_lac_cho'].forEach(function (id) {
      var D = E.DEC[id]; if (!D || !D.def || D.def.v953) return; var def = D.def; def.v953 = true;
      def.title = function (l) { return crowd(l).title; };
      def.text = function (l) { return crowd(l).intro; };
      def.opts.forEach(function (o) {
        var kind = KEYKIND[id][o.k]; if (!kind) return;
        o.l = function (l) { var P = crowd(l); return kind === 'stay' ? 'Đứng yên tại chỗ chờ ' + carer(l) : kind === 'ask' ? P.ask : 'Tự đi tìm'; };
        o.run = lostRun(kind);
      });
    });
    E.TRIG.forEach(function (t) {
      if (t.id !== 'bi_lac' && t.id !== 'k6_lac_cho') return;
      if (t.v953) return; t.v953 = true;
      var w = t.when; t.when = function (l, a) { return w(l, a) && lostOk(l); };
      t.p = 0.006; t.cw = 0.22;
    });
  }
  patchLost();

  if (C && C.define) {
    C.define('lost953', {
      max: 1,
      cancel: function (l) { return l.age >= 15 ? { result: 'grown' } : null; },
      stages: [{
        dec: 'ch953_lost_after', after: [1, 3], p: 1, when: function (l) { return free(l) && l.age <= 12; },
        title: function (l, c) { return c.data.fear ? 'Nỗi sợ chỗ đông người' : 'Bài học sau lần đi lạc'; },
        text: function (l, c) {
          var n = l.age - c.origin.age, who = c.data.who || carer(l), t = n <= 0 ? 'Năm nay' : 'Từ lần lạc ' + n + ' năm trước';
          return c.data.fear
            ? t + ', mỗi lần đến nơi đông người bạn lại nắm chặt vạt áo ' + who + ', tim đập thình thịch. Có hôm bạn đòi ở nhà thay vì đi cùng.'
            : t + ', ' + who + ' cứ nhắc đi nhắc lại: nếu lạc thì phải làm gì, nhớ tên ai, nhớ nhà ở đâu.';
        },
        opts: [
          { k: 'tap', l: function (l) { return 'Cùng ' + carer(l) + ' tập dần: đến chỗ đông vào giờ vắng'; }, req: function (l, c) { return !!c.data.fear; }, ai: { w: 1.3 }, run: function (l, r, log, c) {
            if (r() < 0.7) { H.fx(l, { hap: 2 }); log('Mỗi lần tập một chút, từ chỗ vắng đến chỗ đông. Dần dần bạn không còn nắm chặt vạt áo nữa.', 'good'); H.mem(l, 'Dần hết sợ chỗ đông người nhờ được tập từng chút.', 3); C.close(l, c, 'eased'); }
            else { fl(l).crowdFear953 = true; log('Tập được mấy lần thì gặp một ngày hội quá đông, bạn lại sợ như cũ.', 'neutral'); C.close(l, c, 'fear'); }
          } },
          { k: 'ban', l: 'Nhờ bạn thân hoặc anh chị đi cùng', req: function (l, c) { return !!c.data.fear && (!!(l.bff && l.bff.alive) || (l.sibList || []).some(function (s) { return s.alive !== false; })); }, ai: { w: 1 }, run: function (l, r, log, c) {
            if (r() < 0.55) { H.fx(l, { hap: 2, soc: 1 }); log('Có người cùng tuổi bên cạnh, bạn thấy chỗ đông người bớt đáng sợ hơn nhiều.', 'good'); C.close(l, c, 'eased'); }
            else { fl(l).crowdFear953 = true; log('Có bạn đi cùng cũng đỡ, nhưng khi chỉ còn một mình bạn vẫn né chỗ đông.', 'neutral'); C.close(l, c, 'fear'); }
          } },
          { k: 'tranh', l: 'Tìm cớ tránh nơi đông người', req: function (l, c) { return !!c.data.fear; }, ai: { w: 0.6 }, run: function (l, r, log, c) {
            fl(l).crowdFear953 = true; H.fx(l, { soc: -1 }); log('Bạn tránh các buổi hội hè, chợ phiên. Yên tâm hơn, nhưng bỏ lỡ nhiều trò vui cùng bạn bè.', 'neutral'); C.close(l, c, 'avoid');
          } },
          { k: 'thuoc', l: 'Học thuộc tên bố mẹ, nơi ở và cách nhờ giúp đỡ', req: function (l, c) { return !c.data.fear; }, ai: { w: 1.2, smart: 1 }, run: function (l, r, log, c) {
            fl(l).knowsWay953 = true; H.fx(l, { kno: 1 }); log('Bạn đọc thuộc tên bố mẹ, địa chỉ và số điện thoại hoặc tên người thân gần nhà. Ai hỏi cũng trả lời được.', 'good'); H.mem(l, 'Học thuộc địa chỉ nhà sau lần đi lạc.', 2); C.close(l, c, 'learned');
          } },
          { k: 'quen', l: 'Nghe cho vui, không để tâm', req: function (l, c) { return !c.data.fear; }, ai: { w: 0.5 }, run: function (l, r, log, c) {
            log('Bạn nghe xong rồi quên bẵng, mải chơi chuyện khác.', 'neutral'); C.close(l, c, 'forgot');
          } }
        ]
      }]
    });
  }

  // sợ chỗ đông người làm bạn ít tham gia ngày hội, hòa nhạc và biểu diễn khi còn trẻ (xác định theo hàm băm, không đụng RNG chung)
  ['choi_le_hoi', 'concert', 'k6_thieu_nhi', 'k6_karaoke', 'k_cam_trai', 'k_tham_quan'].forEach(function (id) {
    E.TRIG.forEach(function (t) {
      if (t.id !== id || t.fear953) return; t.fear953 = true; var w = t.when;
      t.when = function (l, a) { return w(l, a) && !(l.flags && l.flags.crowdFear953 && a <= 24 && hs(l, 'cf:' + id + ':' + a) < 0.5); };
    });
  });
  // nhớ đường, nhớ nhà: tự đi xe buýt dễ dàng hơn
  E.TRIG.forEach(function (t) { if (t.id === 'k6_xe_buyt' && !t.way953) { t.way953 = true; var c0 = t.cw; t.cw = function (l, a) { return (typeof c0 === 'function' ? c0(l, a) : (c0 || 1)) * (l.flags && l.flags.knowsWay953 ? 1.6 : 1); }; } });
  // lớn lên, nỗi sợ nhẹ dần
  E.HOOKS.year.push(function (l, r, log) {
    var s = l.flags; if (!l.alive || !s) return;
    if (s.crowdFear953 && l.age >= 25) delete s.crowdFear953;
    else if (s.crowdFear953 && l.age === 16 && hs(l, 'eased') < 0.5) { delete s.crowdFear953; log('Lớn dần, bạn không còn thấy sợ chỗ đông người như hồi bé.', 'good'); }
    if (s.febrile953) { if (l.age >= 7) delete s.febrile953; else if (l.age >= 2 && hs(l, 'feb' + l.age) < 0.22) { log('Một đêm sốt cao nữa. Lần này người lớn đã biết cách: hạ sốt, giữ bạn nằm nghiêng và đưa đi khám sớm.', 'neutral'); stress(l, 2); } }
  });

  // ===================================================================
  // 2. THẤT LẠC KHI CHẠY LOẠN — vùng chiến sự hoặc thiên tai nặng
  // ===================================================================
  KID('k953_lac_so_tan', 2, 10, {
    title: 'Thất lạc trong lúc chạy loạn',
    text: function (l) {
      var c = cx(l), who = carer(l), war = c.war >= c.dis;
      return war
        ? 'Chiến sự lan tới vùng bạn sống' + (c.labels.war ? ' (' + c.labels.war + ')' : '') + '. Còi báo động rú lên, cả xóm ôm đồ chạy về nơi trú ẩn; trong dòng người chen chúc, bàn tay ' + who + ' đang nắm bỗng tuột mất.'
        : 'Giữa cảnh hỗn loạn của ' + (c.labels.dis || 'thiên tai') + ', mọi người chạy lên chỗ cao. Trong tiếng la hét, bạn mất dấu ' + who + '.';
    },
    opts: [
      { k: 'bam', l: 'Đứng lại chỗ cũ, gọi tên người thân', ai: { w: 1.2 }, run: function (l, r, log) { sepRun(l, r, log, 'bam', 0.5); } },
      { k: 'theo', l: 'Đi theo đoàn người lớn tốt bụng', ai: { w: 1 }, run: function (l, r, log) { sepRun(l, r, log, 'theo', 0.35); } },
      { k: 'tim', l: 'Chạy ngược dòng người đi tìm', ai: { w: 0.5, risk: 1 }, run: function (l, r, log) { sepRun(l, r, log, 'tim', 0.2); } }
    ]
  }, function (l) { return turbulent(l) && !fl(l).lost953; }, function (l) { var c = cx(l); return 0.35 + 0.25 * Math.max(c.war, c.dis); },
  function (l) { var c = cx(l); return 0.012 + 0.01 * Math.max(c.war, c.dis); });
  function sepRun(l, r, log, kind, base) {
    var c = cx(l), lv = Math.max(c.war, c.dis), who = carer(l), s = fl(l); s.lost953 = l.age;
    var p = Math.max(0.08, base - 0.1 * (lv - 2) + (eyes(l) >= 2 ? 0.1 : 0));
    H.fx(l, { hap: -4 }); stress(l, 5);
    if (r() < p) {
      log(kind === 'bam' ? 'Bạn đứng khóc ở chỗ cũ. Một lúc sau ' + who + ' quay lại tìm thấy, hai người ôm nhau giữa đám đông.' : kind === 'theo' ? 'Bạn đi theo đoàn người đến nơi trú ẩn. Tối đó ' + who + ' tìm được bạn qua lời nhắn từ người đi cùng.' : 'Chạy ngược dòng người thật nguy hiểm, nhưng may sao bạn va ngay vào ' + who + ' đang tìm bạn.', 'neutral');
      H.mem(l, 'Ngày chạy loạn bị lạc ' + who + ', tìm được nhau trong gang tấc.', 5);
    } else {
      log('Đến đêm vẫn chưa thấy ' + who + '. Bạn được một gia đình trên đường nhận tạm, đi cùng họ tới nơi an toàn hơn.', 'bad'); H.fx(l, { hap: -4 });
      H.mem(l, 'Ngày chạy loạn bị lạc ' + who + ', phải sống tạm với người xa lạ.', 7);
      startChain(l, 'sep953', { dec: 'k953_lac_so_tan', k: kind }, { data: { who: who, lv: lv, kind: kind, y: wy(l) } }, 1, 2);
    }
  }
  if (C && C.define) {
    C.define('sep953', {
      max: 1,
      cancel: function (l) { return l.age >= 18 ? { result: 'grown' } : null; },
      stages: [
        { dec: 'ch953_sep_tin', after: [1, 2], p: 1, when: function (l) { return free(l); },
          title: 'Tin tức về người thân',
          text: function (l, c) { var n = l.age - c.origin.age, who = c.data.who || carer(l); return (n <= 0 ? 'Năm nay' : 'Đã ' + n + ' năm') + ' kể từ ngày chạy loạn, bạn vẫn sống nhờ gia đình đã nhận tạm. Họ bảo hễ có tin về ' + who + ' sẽ cho bạn biết, nhưng chưa có ai báo gì.'; },
          opts: [
            { k: 'cuu', l: 'Nhờ ban tìm kiếm và tổ chức cứu trợ lần theo tin', ai: { w: 1.3 }, run: function (l, r, log, c) { sepFind(l, r, log, c, 0.5); } },
            { k: 'thu', l: 'Nhờ người lớn viết thư gửi về quê cũ', ai: { w: 1 }, run: function (l, r, log, c) { sepFind(l, r, log, c, 0.35); } },
            { k: 'cho', l: 'Ở lại chờ tin, không làm gì thêm', ai: { w: 0.5 }, run: function (l, r, log, c) { sepFind(l, r, log, c, 0.15); } }
          ] },
        { after: [1, 3], p: 1, when: function (l) { return free(l); },
          lapse: function (l, c) { C.close(l, c, 'lapsed'); },
          narrate: function (l, c, log) {
            var who = c.data.who || carer(l);
            if (c.data.found) { H.fx(l, { hap: 14 }); stress(l, -6); log('Cuối cùng cũng có tin: ' + who + ' còn sống và đã tìm được bạn qua danh sách người thất lạc. Ngày gặp lại, cả hai chỉ biết ôm nhau khóc.', 'good'); H.mem(l, 'Ngày đoàn tụ với ' + who + ' sau những năm thất lạc.', 9); C.close(l, c, 'reunited'); }
            else { fl(l).missingFam953 = true; H.fx(l, { hap: -3 }); log('Vẫn không có tin gì về ' + who + '. Bạn lớn lên trong gia đình đã nhận mình, vẫn nhớ ngày chạy loạn và chưa thôi hy vọng.', 'neutral'); H.mem(l, 'Nhiều năm không có tin về ' + who + ' sau ngày chạy loạn.', 6); C.close(l, c, 'unresolved'); }
          } }
      ]
    });
  }
  function sepFind(l, r, log, c, base) {
    var p = Math.max(0.05, base - 0.06 * ((c.data.lv || 2) - 2)); c.data.found = r() < p; c.data.how = c.data.found ? 1 : 0;
    log(c.data.found ? 'Có người báo đã thấy tên ' + (c.data.who || carer(l)) + ' trong danh sách người thất lạc ở nơi khác.' : 'Chưa nhận được tin chắc chắn nào, nhưng bạn vẫn giữ hy vọng.', c.data.found ? 'good' : 'neutral');
    C.advance(l, c); timed(l, c, 1, 3, 'sep');
  }

  // ===================================================================
  // 3. CÁC CHUYỆN TUỔI THƠ NHỎ, THEO HOÀN CẢNH
  // ===================================================================
  function hotThing(l) {
    var y = wy(l), u = !!l.urban, g = dev(l), L = [];
    if (y < 1990 || g < 2.5) L.push('ấm nước vừa sôi trên bếp', 'nồi cháo còn nghi ngút khói để dưới sàn bếp');
    if (y >= 1980 && u) L.push('chiếc phích nước sôi ở góc nhà');
    if (y >= 1995) L.push('nồi cơm điện đang xả hơi', 'ấm siêu tốc vừa sôi');
    if (!L.length) L.push('ấm nước vừa sôi');
    return L[Math.floor(hs(l, 'hot') * L.length)];
  }
  KID('k953_nong_bep', 2, 5, {
    title: 'Với tay lên bếp',
    text: function (l) { return 'Bạn vừa chập chững biết với tay. Trên bếp có ' + hotThing(l) + ', hơi nóng bốc lên làm bạn tò mò. ' + cap(carer(l)) + ' đang bận ở gian bên.'; },
    opts: [
      { k: 'rut', l: 'Rụt tay lại khi thấy hơi nóng, kêu to', ai: { w: 1.2 }, run: function (l, r, log) {
        if (r() < 0.8) { log('Bạn kêu thét lên, người lớn chạy tới bế bạn ra xa. Từ đó bạn biết sợ chỗ bếp nóng.', 'neutral'); H.mem(l, 'Lần đầu biết bếp nóng là gì.', 2); }
        else { log('Đầu ngón tay bị bỏng rát. Người lớn ngâm ngay vào nước mát, vài hôm sau là lành.', 'neutral'); H.fx(l, { hea: -1 }); }
      } },
      { k: 'voi', l: 'Cố với cho bằng được', ai: { w: 0.6, risk: 1 }, run: function (l, r, log) {
        if (r() < 0.3) { log('Suýt chạm vào thì bị ai đó kéo giật lại. Bạn bị mắng một trận, tim đập thình thịch cả buổi.', 'neutral'); return; }
        var a = access(l);
        if (a >= 2) { log('Bàn tay bị bỏng độ hai. Người nhà ngâm nước mát rồi đưa tới cơ sở y tế xử lý ngay; vài tuần sau lành, để lại một vệt sẹo mờ.', 'bad'); H.fx(l, { hea: -3 }); bill(l, 0.8, 'Điều trị bỏng', log); }
        else { log('Bàn tay bị bỏng nặng. Cơ sở y tế ở xa nên người nhà chữa tạm tại nhà, vết bỏng nhiễm trùng mấy tuần mới khỏi và để lại sẹo lớn.', 'bad'); H.fx(l, { hea: -5, hap: -2 }); stress(l, 3); }
        fl(l).scar953 = true; H.mem(l, 'Vết sẹo bỏng trên tay từ hồi bé.', 3);
      } },
      { k: 'tim', l: function (l) { return 'Chạy đi gọi ' + carer(l) + ' đến xem'; }, ai: { w: 1 }, run: function (l, r, log) { log(cap(carer(l)) + ' khen bạn ngoan rồi dời ấm nước lên chỗ cao. Chuyện nhỏ nhưng cả nhà chú ý hơn từ đó.', 'good'); H.fx(l, { hap: 1 }); } }
    ]
  }, null, 0.8);

  KID('k953_gan_nuoc', 3, 7, {
    title: 'Bờ nước sau nhà',
    text: function (l) {
      var w = l.coast && hs(l, 'w') < 0.6 ? 'bãi triều trước nhà' : ['ao cá sau nhà', 'con mương trước ngõ', 'bờ sông cuối xóm', 'khúc suối gần nhà'][Math.floor(hs(l, 'w2') * 4)];
      return 'Gần nhà có ' + w + '. Nước trong veo, đàn cá nhỏ bơi sát mép, ai cũng dặn bạn không được lại gần một mình.';
    },
    opts: [
      { k: 'xem', l: 'Ngồi xổm xem cá sát mép nước', ai: { w: 0.7, risk: 1 }, run: function (l, r, log) { waterRun(l, r, log, 0.14, true); } },
      { k: 'nghe', l: 'Nghe lời dặn, chỉ chơi ở sân', ai: { w: 1.2 }, run: function (l, r, log) {
        log('Bạn giữ lời. Chiều hôm đó ' + carer(l) + ' dắt bạn ra bờ nước, chỉ cho cách thả chiếc thuyền giấy mà không xuống gần mép.', 'good'); H.fx(l, { hap: 2 }); fl(l).waterRule953 = true;
      } },
      { k: 'ban', l: 'Rủ anh chị hoặc bạn cùng ra nghịch nước', ai: { w: 0.5, risk: 1 }, run: function (l, r, log) { waterRun(l, r, log, 0.1, false); } }
    ]
  }, function (l) { return !l.urban || !!l.coast; }, 0.9);
  function waterRun(l, r, log, slip, alone) {
    if (r() >= slip * (eyes(l) >= 2 ? 0.6 : 1)) { log(alone ? 'Ngồi ngắm cá một lúc rồi có người gọi vào. Chẳng có chuyện gì, nhưng bạn bị dặn lần nữa.' : 'Bọn trẻ nghịch nước một lúc, ướt từ đầu đến chân, về bị mắng nhưng vui lắm.', 'neutral'); H.fx(l, { hap: 2 }); return; }
    var ok = eyes(l) >= 2 || r() < 0.8;
    if (ok) { log('Bạn trượt chân xuống nước. May có người lớn thấy kịp, nhảy xuống vớt lên, người run lẩy bẩy, ho sặc sụa.', 'bad'); H.fx(l, { hea: -3, hap: -3 }); stress(l, 4); fl(l).waterFear953 = true; H.mem(l, 'Lần suýt đuối nước hồi bé.', 5); }
    else { log('Bạn trượt chân xuống nước. Một lúc lâu sau mới có người nghe thấy tiếng kêu, kịp vớt lên. Bạn nằm viện mấy ngày vì sặc nước.', 'bad'); H.fx(l, { hea: -7, hap: -4 }); stress(l, 6); fl(l).waterFear953 = true; bill(l, 1.2, 'Cấp cứu vì sặc nước', log); H.mem(l, 'Lần suýt đuối nước hồi bé, nằm viện mấy ngày.', 6); }
  }
  // biết sợ nước nhưng được tập bơi có người hướng dẫn sẽ dần bớt sợ
  (function () {
    var D = E.DEC.k_hoc_boi; if (!D || !D.def || D.def.v953) return; D.def.v953 = true;
    D.def.opts.forEach(function (o) {
      var run = o.run; o.run = function (l, r, log, d) {
        var res = run.apply(this, arguments);
        if (l.flags && l.flags.waterFear953 && o.k === 'hoc') { delete l.flags.waterFear953; H.fx(l, { hap: 1 }); log('Bạn còn nhớ lần suýt đuối nước, nhưng có người hướng dẫn bên cạnh nên dần bớt sợ.', 'good'); }
        return res;
      };
    });
  })();

  KID('k953_an_nham', 2, 4, {
    title: 'Nuốt nhầm thứ không phải đồ ăn',
    text: function (l) {
      var y = wy(l), f = /nông|trồng|chăn nuôi|ruộng|vườn|rẫy/i.test(jobsText(l)), t = f && hs(l, 'ch') < 0.5 ? 'bình thuốc bảo vệ cây trồng cất trong chái nhà' : y >= 2008 ? 'viên giặt nhiều màu trông như kẹo' : y >= 1990 ? 'chai nước tẩy rửa để thấp trong tủ' : 'chai dầu hỏa để cạnh bếp';
      return 'Bạn nhìn thấy ' + t + ' nằm ngay tầm tay, đưa lên miệng nếm thử trong lúc ' + carer(l) + ' quay đi một chút.';
    },
    opts: [
      { k: 'khoc', l: 'Khóc ầm lên, chỉ vào chai', ai: { w: 1.2 }, run: function (l, r, log) { ingestRun(l, r, log, true); } },
      { k: 'giau', l: 'Ngậm chặt miệng, lắc đầu', ai: { w: 0.5, risk: 1 }, run: function (l, r, log) { ingestRun(l, r, log, false); } },
      { k: 'non', l: 'Nôn thốc ngay tại chỗ', ai: { w: 0.8 }, run: function (l, r, log) { ingestRun(l, r, log, true); } }
    ]
  }, null, 0.7);
  function ingestRun(l, r, log, told) {
    var a = access(l), c = cx(l);
    if (told) {
      if (a >= 2) { log('Người nhà đưa bạn đi cấp cứu ngay. Bác sĩ theo dõi một đêm, hôm sau về nhà bình an.', 'neutral'); H.fx(l, { hea: -1 }); bill(l, 1, 'Cấp cứu ngộ độc', log); }
      else { log('Cơ sở y tế gần nhất cách mấy cây số, người nhà bế bạn chạy thục mạng' + (c.war >= 2 || c.dis >= 2 ? ' giữa lúc đường sá bị gián đoạn' : '') + '. Bạn mệt lả mấy ngày nhưng qua khỏi.', 'bad'); H.fx(l, { hea: -3, hap: -2 }); stress(l, 3); }
      H.mem(l, 'Lần nuốt nhầm đồ hồi bé, cả nhà thức trắng đêm.', 3);
    } else if (r() < 0.35) {
      log('Hai hôm sau bạn nôn liên tục, người nhà mới biết chuyện. Phải nằm viện mấy ngày mới khỏe lại.', 'bad'); H.fx(l, { hea: -6, hap: -3 }); bill(l, 1.5, 'Nằm viện vì ngộ độc', log);
      if (a < 2) stress(l, 3); H.mem(l, 'Lần nằm viện vì nuốt nhầm đồ hồi bé.', 4);
    } else log('Bạn nhăn mặt rồi nhổ ra ngay. Người lớn phát hiện, vội cất hết mọi thứ lên cao.', 'neutral');
  }

  KID('k953_sot_dem', 1, 6, {
    title: 'Cơn sốt giữa đêm',
    text: function (l) {
      var c = cx(l), who = carer(l);
      return 'Nửa đêm bạn nóng ran, khóc không ngừng. ' + cap(who) + ' sờ trán thấy nóng hầm hập' + (c.epi >= 1 ? '; mấy hôm nay nhiều trẻ trong vùng cũng sốt và ho' : '') + (access(l) < 2 ? '. Cơ sở y tế gần nhất khá xa, trời lại tối.' : '.');
    },
    opts: [
      { k: 'kham', l: 'Đưa đi khám ngay trong đêm', ai: { w: 1.2 }, run: function (l, r, log) {
        var a = access(l), c = cx(l);
        if (a >= 2) log('Bác sĩ khám, nói bạn bị virus, kê thuốc hạ sốt. Sáng hôm sau bạn đã chơi được.', 'neutral');
        else { log('Phải nhờ người chở đi quãng đường dài trong đêm. Tới nơi hơi muộn nhưng bác sĩ vẫn kịp hạ sốt cho bạn.', 'neutral'); H.fx(l, { hea: -1 }); stress(l, 2); }
        if (c.epi >= 2) { log('Phòng khám đông trẻ nhỏ, phải chờ lâu mới tới lượt.', 'neutral'); }
        bill(l, a >= 2 ? 0.5 : 0.8, 'Khám và thuốc khi sốt', log);
      } },
      { k: 'nha', l: 'Chườm mát, hạ sốt tại nhà chờ sáng', ai: { w: 0.8 }, run: function (l, r, log) { feverHome(l, r, log, 0.1); } },
      { k: 'hoi', l: 'Nhờ người lớn tuổi trong xóm sang xem', ai: { w: 0.6 }, run: function (l, r, log) { log('Người hàng xóm sang xem, chỉ cách lau mát và cho uống nhiều nước. Gần sáng bạn mới hạ sốt.', 'neutral'); feverHome(l, r, log, 0.12, true); } }
    ]
  }, null, function (l) { return 1 + 0.4 * cx(l).epi; });
  function feverHome(l, r, log, base, quiet) {
    var p = base * (access(l) < 2 ? 1.8 : 1) * (1 + 0.3 * cx(l).epi);
    if (r() < p) { log('Đến gần sáng bạn lên cơn co giật vì sốt cao. Cả nhà hoảng hốt đưa đi cấp cứu; bác sĩ nói đó là co giật do sốt, sau này lúc sốt cao có thể tái phát.', 'bad'); H.fx(l, { hea: -4, hap: -2 }); stress(l, 4); fl(l).febrile953 = true; bill(l, 1.2, 'Cấp cứu co giật do sốt', log); H.mem(l, 'Đêm lên cơn co giật vì sốt cao hồi bé.', 4); }
    else if (!quiet) log('Chườm mát, cho uống nước, gần sáng bạn hạ sốt. Cả nhà thở phào.', 'neutral');
  }

  KID('k953_sinh_em', 2, 7, {
    title: 'Nhà có thêm em bé',
    text: function (l) { var s = newSib(l); return 'Nhà vừa có thêm em' + (s && s.n ? ' ' + s.n.split(' ').pop() : ' bé') + '. ' + cap(carer(l)) + ' bận bịu cả ngày bên chiếc nôi, còn bạn thì thấy mình bị bỏ quên.'; },
    opts: [
      { k: 'tuhao', l: 'Tự hào, đòi bế em', ai: { w: 1.2 }, run: function (l, r, log) { var s = newSib(l); if (s) s.close = U.clamp((s.close || 60) + 6, 0, 100); H.fx(l, { hap: 3, soc: 1 }); log('Bạn ngồi ngoan, được đặt em vào lòng một lúc. Từ đó ai hỏi bạn cũng khoe "em của con".', 'good'); H.mem(l, 'Ngày nhà có thêm em bé.', 3); } },
      { k: 'doi', l: 'Dỗi, đòi được chú ý như trước', ai: { w: 0.7 }, run: function (l, r, log) { var s = newSib(l); if (s) s.close = U.clamp((s.close || 60) - 4, 0, 100); H.fx(l, { hap: -1 }); log(cap(carer(l)) + ' phải dỗ cả hai đứa cùng lúc. Bạn đòi bế, đòi ăn kẹo, rồi cũng nín.', 'neutral'); } },
      { k: 'nhin', l: 'Đứng xa nhìn, rụt rè', ai: { w: 0.8 }, run: function (l, r, log) { var s = newSib(l); if (s) s.close = U.clamp((s.close || 60) + 2, 0, 100); log('Bạn đứng nhìn một lúc lâu rồi lén chạm vào bàn tay bé xíu của em.', 'neutral'); } }
    ]
  }, function (l) { return !!newSib(l); });
  function newSib(l) { return (l.sibList || []).filter(function (s) { return s.alive !== false && s.born > 0 && l.age - s.born >= 0 && l.age - s.born <= 2; })[0] || null; }

  KID('k953_xem_hoi', 3, 9, {
    title: 'Đêm hội của vùng',
    text: function (l) {
      var vn = H.isVN(l), y = wy(l), what = vn ? ['đêm Trung thu rước đèn', 'đêm hội làng có múa lân', 'đêm giao thừa ở quảng trường'][Math.floor(hs(l, 'h') * 3)] : ['lễ hội mùa của vùng', 'đêm diễu hành đèn lồng', 'đêm hội ngoài quảng trường'][Math.floor(hs(l, 'h') * 3)];
      return cap(carer(l)) + ' dắt bạn đi xem ' + what + (y >= 1960 ? ', có pháo hoa và tiếng nhạc.' : ', có đèn và tiếng trống.') + ' Người đông nghịt, ai cũng ngẩng đầu nhìn lên.';
    },
    opts: [
      { k: 'vai', l: 'Ngồi trên vai người lớn xem', ai: { w: 1.2 }, run: function (l, r, log) { log('Ngồi cao hơn mọi người, bạn nhìn thấy cả bầu trời sáng rực. Đó là một trong những đêm vui nhất tuổi thơ.', 'good'); H.fx(l, { hap: 5, soc: 1 }); H.mem(l, 'Đêm ngồi trên vai ' + carer(l) + ' xem hội.', 3); } },
      { k: 'nep', l: function (l) { return l.flags && l.flags.crowdFear953 ? 'Đứng ở rìa, nắm chặt tay ' + carer(l) : 'Nép sau lưng, bịt tai vì tiếng nổ'; }, ai: { w: 0.8 }, run: function (l, r, log) {
        if (l.flags && l.flags.crowdFear953 && r() < 0.55) { delete l.flags.crowdFear953; log('Đứng ở rìa nắm chặt tay người lớn, bạn nhìn pháo hoa mà không bị chen. Bạn thấy chỗ đông người không còn đáng sợ như trước.', 'good'); H.fx(l, { hap: 3 }); H.mem(l, 'Lần đầu đứng giữa đám đông mà không sợ.', 3); }
        else { log('Bịt tai nhìn qua kẽ tay, hơi sợ nhưng vẫn muốn xem tiếp.', 'neutral'); H.fx(l, { hap: 1 }); }
      } },
      { k: 'chen', l: 'Chen lên hàng đầu cùng bạn bè', req: function (l) { return !(l.flags && l.flags.crowdFear953); }, ai: { w: 0.6, soc: 1, risk: 0.5 }, run: function (l, r, log) {
        if (hs(l, 'chen') < 0.15) { log('Chen lên mất dấu nhóm, đứng một mình ở hàng đầu vài phút mới được người quen kéo lại.', 'neutral'); H.fx(l, { hap: 1 }); }
        else { log('Cả nhóm chen lên hàng đầu, nhìn rõ từng chùm pháo bung nở. Về nhà vẫn còn nói chuyện đến khuya.', 'good'); H.fx(l, { hap: 4, soc: 3 }); }
      } }
    ]
  }, function (l) { return cx(l).level <= 1 && !turbulent(l); }, 1);

  // nghề của bố mẹ thành trò chơi của trẻ: bỏ các nghề không hợp để kể trong trò chơi trẻ con
  function playJob(l) {
    var f = l.fam || {}, L = [f.mJob, f.fJob].filter(function (j) { return j && !/đã mất|thất nghiệp|không rõ|băng nhóm|cờ bạc|ve chai/i.test(j); });
    if (!L.length) return 'làm việc nhà';
    var j = L[Math.floor(hs(l, 'pj') * L.length)];
    return /^(làm|bán|buôn|chăn|trồng|đánh|nuôi|nhặt|chạy|đan|sơ chế|dọn|lái|phục vụ|giúp)/.test(j) ? j : 'làm ' + j;
  }
  KID('k953_gia_vo', 2, 6, {
    title: 'Trò giả làm người lớn',
    text: function (l) {
      var j = playJob(l);
      return 'Bạn lấy khăn, nồi và hộp giấy làm đạo cụ, tự xưng đang "' + j + '" như người lớn trong nhà. Cả nhà ghé mắt nhìn.';
    },
    opts: [
      { k: 'khoe', l: 'Nghiêm túc "làm việc", bắt mọi người khen', ai: { w: 1 }, run: function (l, r, log) { log('Cả nhà bật cười, vỗ tay khen. Bạn nghiêm trang gật đầu như thật.', 'good'); H.fx(l, { hap: 3, soc: 1 }); fl(l).playJob953 = playJob(l); H.mem(l, 'Hồi nhỏ hay chơi trò "' + fl(l).playJob953 + '" như người lớn.', 2); } },
      { k: 'ban', l: 'Rủ bạn hàng xóm cùng chơi', ai: { soc: 1, w: 0.8 }, run: function (l, r, log) { log('Hai đứa chia vai ông chủ và khách hàng, chơi đến khi mẹ gọi về ăn cơm.', 'good'); H.fx(l, { hap: 3, soc: 2 }); } }
    ]
  }, null, 0.9);

  KID('k953_chuyen_xa', 4, 9, {
    title: 'Chuyến đi xa đầu tiên',
    text: function (l) {
      var y = wy(l), u = !!l.urban, v = (y < 1975 && !u) || (y < 1950) ? (l.coast || !u ? 'chuyến đò ngang' : 'chuyến tàu') : y >= 1995 && dev(l) >= 4 ? 'chuyến xe đường dài' : 'chuyến xe khách';
      return 'Lần đầu bạn đi xa nhà bằng ' + v + ' để thăm người thân. Cảnh vật bên ngoài cứ trôi vùn vụt.';
    },
    opts: [
      { k: 'nhin', l: 'Dán mắt nhìn ra cửa sổ cả chặng đường', ai: { w: 1.2 }, run: function (l, r, log) { if (hs(l, 'say') < 0.3) { log('Nhìn mãi rồi chóng mặt, bạn nôn một trận. Nhưng vẫn thích cảm giác được đi xa.', 'neutral'); H.fx(l, { hap: 1, kno: 1 }); } else { log('Bạn đếm cột điện, nhìn cánh đồng, đàn trâu bên đường. Về nhà kể mãi không hết chuyện.', 'good'); H.fx(l, { hap: 4, kno: 2 }); H.mem(l, 'Chuyến đi xa đầu tiên cùng ' + carer(l) + '.', 3); } } },
      { k: 'ngu', l: 'Ngủ gục ngay từ khi xe chạy', ai: { w: 0.8 }, run: function (l, r, log) { log('Tỉnh dậy đã thấy xe dừng ở bến quê ngoại, người lớn bế bạn xuống.', 'neutral'); H.fx(l, { hap: 1 }); } }
    ]
  }, null, 0.9);

  KID('k953_nhat_rau', 4, 8, {
    title: 'Phụ giúp một việc nhỏ',
    text: function (l) { var u = !!l.urban; return cap(carer(l)) + ' nhờ bạn ' + (u ? ['xếp giày dép ngay ngắn', 'bày bát đũa ra mâm', 'tưới mấy chậu cây ngoài ban công'][Math.floor(hs(l, 'ch1') * 3)] : ['nhặt rau cùng', 'cho gà ăn', 'quét sân giúp'][Math.floor(hs(l, 'ch2') * 3)]) + '.'; },
    opts: [
      { k: 'hang', l: 'Làm hăng say, đòi làm thêm', ai: { w: 1.2 }, run: function (l, r, log) { log('Bạn làm chăm chú, đòi làm thêm. ' + cap(carer(l)) + ' khen một câu mà bạn vui cả ngày.', 'good'); H.fx(l, { hap: 3, karma: 1, kno: 1 }); } },
      { k: 'lan', l: 'Làm cho có rồi chạy đi chơi', ai: { w: 0.7 }, run: function (l, r, log) { log('Làm qua loa rồi bỏ dở. ' + cap(carer(l)) + ' lắc đầu, tự làm nốt, nhưng cũng chẳng giận.', 'neutral'); } }
    ]
  }, null, 0.8);

  E.KID953 = { crowd: crowd, access: access, eyes: eyes, lostOk: lostOk, turbulent: turbulent, newSib: newSib, hs: hs, lostRun: lostRun, sepRun: sepRun, patchLost: patchLost };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));

/* Một Đời — khúc cuối đời (hồi tưởng, di nguyện, hôn mê, xuôi tay), chia sẻ cuộc đời qua đường link, lưu 10 đời gần nhất. */
(function (G) {
  'use strict';
  var U = G.U, E = G.E;

  function pickMemories(l, n) {
    var m = (l.mem || []).slice().filter(function (x) { return x && x.t; });
    // v2.3: những dòng người chơi đánh dấu ⭐ được ưu tiên trong hồi tưởng
    // v2.9: dòng đã có trong ký ức thì nâng lên thành khoảnh khắc ⭐ (trước đây bị bỏ qua)
    starred(l).forEach(function (e) {
      var t = e.t.replace(/\.$/, ''), same = m.filter(function (x) { return x.t === e.t || x.t === t; })[0];
      if (same) { var i = m.indexOf(same); m[i] = { a: same.a, t: same.t, w: 10, star: true }; } else m.push({ a: e.a, t: t, w: 10, star: true });
    });
    m.sort(function (a, b) { return b.w - a.w || a.a - b.a; });
    var top = m.slice(0, n);
    // luôn giữ một ký ức tuổi thơ để khúc hồi tưởng trọn vẹn
    if (n >= 3 && !top.some(function (x) { return x.a < 16; })) {
      var kid = m.filter(function (x) { return x.a < 16 && x.a > 0; })[0] || m.filter(function (x) { return x.a < 16; })[0];
      if (kid) { top = top.slice(0, n - 1); top.push(kid); }
    }
    // v4.4: hồi tưởng luôn có người bạn đời (còn sống hay đã mất)
    var sp = E.spousesOf ? E.spousesOf(l) : [];
    if (n >= 3 && sp.length && !top.some(function (x) { return sp.some(function (s) { return x.t.indexOf(s) >= 0; }); })) {
      var sm = m.filter(function (x) { return sp.some(function (s) { return x.t.indexOf(s) >= 0; }); })[0];
      if (sm) { var drop = top.filter(function (x) { return !(x.a < 16) && !x.star; }).sort(function (a, b) { return a.w - b.w; })[0] || top[top.length - 1]; top.splice(top.indexOf(drop), 1, sm); }
    }
    top.sort(function (a, b) { return a.a - b.a; });
    return top;
  }
  function selfWord(l) { return l.kids.some(function (k) { return k.alive; }) ? (l.sex === 'M' ? 'bố' : 'mẹ') : 'tôi'; }

  function wishes(l, r) {
    var me = selfWord(l), w = [];
    var kids = l.kids.filter(function (k) { return k.alive; });
    var lost = l.kids.filter(function (k) { return !k.alive; });
    if (kids.length > 1) w.push('Các con phải thương yêu, đùm bọc lấy nhau. Anh em trong nhà đừng vì đồng tiền mà xa nhau.');
    else if (kids.length === 1) w.push('Con ơi, sống cho thật vui, đừng gồng gánh một mình. ' + U.cap(me) + ' luôn tự hào về con.');
    if (l.partner && l.partner.status !== 'dating') w.push(kids.length ? 'Các con thay ' + me + ' chăm sóc ' + (l.partner.sex === 'F' ? 'mẹ' : 'bố') + ' nhé.' : 'Gửi ' + l.partner.name + ': cảm ơn vì đã đi cùng tôi đến tận cuối con đường.');
    if (l.grand) w.push('Dạy các cháu sống tử tế, học hành tới nơi tới chốn.');
    if (E.H.debtTotal(l) > 0.5 || l.money < 0) w.push('Khoản nợ ' + me + ' còn để lại, ' + (kids.length ? 'các con' : 'mọi người') + ' thu xếp trả giúp, đừng để người ta chê cười.');
    if (l.record || (l.addict && (l.addict.gamble || l.addict.drugs))) w.push('Đừng bao giờ đi vào con đường ' + me + ' từng đi. Cái giá phải trả đắt lắm.');
    if (l.flags.will === 'equal' && kids.length > 1) w.push('Tài sản chia đều cho các con. Đừng vì nó mà mất lòng nhau.');
    else if (l.flags.will && l.flags.will !== 'charity' && l.flags.will !== 'none' && kids.length === 1) w.push('Ngôi nhà này để lại cho con, giữ lấy hương hỏa tổ tiên.');
    if (l.flags.will === 'charity') w.push('Phần tài sản đã hứa, nhớ mang tặng ngôi trường trên bản cho ' + me + '.');
    if (l.movedTo || (l.abroad && l.abroad.perm)) w.push('Đưa ' + me + ' về quê, cho ' + me + ' nằm cạnh ông bà.');
    if (/Phật/.test(l.religion || '')) w.push('Làm lễ theo nghi thức nhà Phật, đừng làm linh đình tốn kém.');
    else if (/Công giáo|Tin Lành|Kitô|Chính Thống/.test(l.religion || '')) w.push('Cho ' + me + ' được an nghỉ trong nghĩa trang của giáo xứ.');
    if (l.bff && l.bff.alive) w.push('Nhắn với ' + l.bff.name + ': cảm ơn vì đã làm bạn với ' + me + ' suốt một đời.');
    if (lost.length) w.push('Kiếp sau, mong được gặp lại ' + lost[0].name + '.');
    if (l.ins && l.ins.type === 'protect' && (kids.length || l.partner)) w.push('Hợp đồng bảo hiểm ' + me + ' cất trong tủ, nhớ làm thủ tục nhận tiền mà lo cho gia đình.');
    if (l.assets && l.assets.land > 0.5) w.push('Lô đất ' + me + ' mua năm ấy, đừng bán vội.');
    var pts = E.H.pets ? E.H.pets(l) : [];
    if (pts.length) w.push('Nhờ ai đó nuôi giúp ' + pts[0].n + ', nó quen được ' + me + ' cho ăn mỗi chiều.');
    if (!kids.length && !l.partner) w.push('Đừng tổ chức tang lễ rình rang. Cứ để ' + me + ' đi nhẹ nhàng như một cơn gió.');
    if ((l.karma || 0) >= 30) w.push('Cứ sống tử tế, rồi đời sẽ thương mình.');
    if (!w.length) w.push('Sống vui lên, đừng tiếc nuối điều gì.');
    // trộn nhẹ & giới hạn 4
    for (var i = w.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = w[i]; w[i] = w[j]; w[j] = t; }
    return w.slice(0, 4);
  }

  function companions(l) {
    var c = [];
    if (l.partner && l.partner.status !== 'dating') c.push(E.H.partnerWord(l, l.partner) + ' ' + l.partner.name);
    var kids = l.kids.filter(function (k) { return k.alive; });
    if (kids.length) c.push(kids.length === 1 ? 'con ' + kids[0].name : 'các con');
    if (l.grand) c.push('đàn cháu');
    if (l.bff && l.bff.alive) c.push('người bạn thân ' + l.bff.name);
    var pts = E.H.pets ? E.H.pets(l) : [];
    if (pts.length && (pts[0].k === 'chó' || pts[0].k === 'mèo')) c.push((c.length ? 'cả ' : '') + 'chú ' + pts[0].k + ' ' + pts[0].n);
    return c;
  }

  function suddenText(l, cause) {
    if (/giao thông|xe|đua/.test(cause)) return 'Một tiếng phanh gấp. Ánh đèn pha chói lòa. Rồi tất cả tối sầm.';
    if (/đuối nước|lũ/.test(cause)) return 'Dòng nước cuộn xiết kéo bạn đi. Bạn cố vươn tay về phía bờ…';
    if (/Campuchia/.test(cause)) return 'Nơi đất khách, giữa những bức tường rào kẽm gai, bạn nhắm mắt khi vẫn còn nghĩ về nhà.';
    if (/chiến|pháo|súng|đạn|trận/.test(cause)) return 'Một tiếng nổ chát chúa. Mặt đất rung chuyển. Bầu trời bỗng lặng im.';
    if (/đâm|bắn|thanh toán|cướp|đánh/.test(cause)) return 'Một nhát dao trong đêm. Bạn ngã xuống mặt đường lạnh ngắt.';
    if (/cứu người/.test(cause)) return 'Bạn đã kịp đẩy người kia lên bờ. Còn bạn thì không kịp nữa.';
    if (/nhồi máu|đột quỵ/.test(cause)) return 'Một cơn đau thắt ngực ập đến không báo trước. Bạn khuỵu xuống.';
    return 'Mọi chuyện xảy ra quá nhanh, không ai kịp trở tay.';
  }

  function finale(l) {
    var d = l.death; if (!d) return [];
    var h = { rs: (l.rs ^ 0x5bd1e995) | 0 }, r = function () { return U.rand(h); };
    var a = d.age, name = l.name, st = [];
    var mems = pickMemories(l, a >= 40 ? 6 : 4);
    if (a < 6) {
      st.push({ h: 'Một sinh linh bé nhỏ', x: 'Bố mẹ ôm ' + name + ' vào lòng. Tiếng khóc ngày nào còn văng vẳng bên tai.' });
      st.push({ h: 'Ra đi', x: name + ' ra đi vì ' + d.cause + ' khi ' + (a === 0 ? 'chưa tròn một tuổi' : 'mới ' + a + ' tuổi') + '. Có những cuộc đời ngắn ngủi như một cánh chuồn chuồn.' });
      return st;
    }
    if (d.sudden) {
      st.push({ h: 'Khoảnh khắc ấy', x: suddenText(l, d.cause) });
      var last4 = mems.slice(-4), sp4 = E.spousesOf ? E.spousesOf(l) : [], spm = mems.filter(function (x) { return sp4.some(function (s) { return x.t.indexOf(s) >= 0; }); })[0];
      if (spm && last4.indexOf(spm) < 0) { last4[0] = spm; last4.sort(function (a, b) { return a.a - b.a; }); }
      if (mems.length) st.push({ h: 'Những hình ảnh cuối cùng lướt qua', list: last4.map(function (m) { return (m.a === 0 ? 'Lúc chào đời' : m.a + ' tuổi') + ' — ' + m.t; }) });
      st.push({ h: 'Lặng im', x: name + ' ra đi ở tuổi ' + a + (a < 50 ? ', khi còn quá nhiều điều dang dở.' : '.') + ' Không kịp nói lời từ biệt.' });
      return st;
    }
    var season = U.pick(r, ['Một sáng mùa đông', 'Một chiều cuối thu', 'Một đêm mưa phùn', 'Giữa mùa hè oi ả']);
    var where = l.gdp < 4 && l.money < l.base ? 'nằm ở nhà vì không đủ tiền viện phí' : U.pick(r, ['nhập viện', 'nằm điều trị ở bệnh viện tỉnh', 'được đưa về nhà theo ý nguyện']);
    var comp = companions(l);
    st.push({ h: 'Phát bệnh', x: season + ' năm ' + d.year + ', ' + name + ' trở bệnh nặng vì ' + d.cause + ', phải ' + where + '. ' +
      (comp.length ? U.cap(comp.join(', ')) + ' thay nhau túc trực bên giường.' : 'Bên giường bệnh chỉ có một cô y tá trực đêm.') });
    var late = l.flags && l.flags.lateSpouse && !(l.partner && l.partner.status !== 'dating') ? l.flags.lateSpouse : null;
    if (mems.length) st.push({ h: 'Hồi tưởng', x: 'Trong cơn mê, ký ức ùa về như một thước phim cũ' + (late ? ' — có lúc ' + name + ' khẽ gọi tên ' + late + ', như thể người ấy đang ngồi ngay bên giường' : '') + ':', list: mems.map(function (m) { return (m.a === 0 ? 'Lúc chào đời' : m.a + ' tuổi') + ' — ' + m.t; }) });
    st.push({ h: 'Di nguyện', x: 'Lúc còn tỉnh táo, ' + name + ' nắm tay ' + (comp[0] || 'người bên cạnh') + ', thều thào dặn dò:', list: wishes(l, r).map(function (w) { return '“' + w + '”'; }) });
    st.push({ h: 'Hôn mê', x: 'Những ngày cuối, ' + name + ' chìm vào trạng thái mê man. Tiếng ' + (l.kids.some(function (k) { return k.alive; }) ? 'con cháu gọi' : 'người thân gọi') + ' văng vẳng, xa dần, xa dần…' });
    var t = U.pick(r, ['Rạng sáng', 'Lúc gà gáy canh tư', 'Một buổi chiều lặng gió', 'Nửa đêm']);
    st.push({ h: 'Xuôi tay', x: t + ', ' + name + ' trút hơi thở cuối cùng, ' + (a >= 60 ? 'hưởng thọ ' : 'hưởng dương ') + a + ' tuổi. Gương mặt thanh thản như đang ngủ.' });
    return st;
  }

  // ---------- Chia sẻ qua đường link ----------
  function b64encode(str) {
    if (typeof TextEncoder !== 'undefined' && typeof btoa !== 'undefined') {
      var bytes = new TextEncoder().encode(str), bin = '';
      for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
      return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    return Buffer.from(str, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function b64decode(s) {
    s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '=';
    if (typeof TextDecoder !== 'undefined' && typeof atob !== 'undefined') {
      var bin = atob(s), bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return new TextDecoder().decode(bytes);
    }
    return Buffer.from(s, 'base64').toString('utf8');
  }
  function summary(l, words) {
    return {
      v: 1, id: l.id, n: l.name, s: l.nameSub || '', x: l.sex, w: E.isVN(l) ? (l.provLabel || l.prov.old) + ', Việt Nam' : l.countryName,
      y: l.birthYear + ' – ' + (l.death ? l.death.year : l.birthYear + l.age), a: l.death ? l.death.age : l.age, c: l.death ? l.death.cause : '',
      o: E.obituary(l), f: words || l.finalWords || '', e: Math.round(l.e0sex * 10) / 10, k: l.karma || 0,
      m: (l.yrs || []).map(function (y) { return Math.min(9, Math.max(0, Math.floor(y.hap / 10))); }).join(''),
      mem: pickMemories(l, 3).map(function (m) { return m.a + '|' + m.t; }),
      md: (l.medals || []).length, kd: l.kids.length, ed: E.EDU[l.edu],
      // v2.3: khoảnh khắc người chơi đánh dấu ⭐, nghề chính, tài sản cuối đời, thế hệ
      st: starred(l).slice(0, 3).map(function (e) { return e.a + '|' + String(e.t).slice(0, 140); }),
      jt: mainJob(l), nw: l.indep ? E.fmtMoney(l, E.netWorth(l)) : '', g: l.gen || 1
    };
  }
  function starred(l) { return (l.log || []).filter(function (e) { return e && e.star; }); }
  function mainJob(l) {
    if (l.peakTitle) return U.cap(l.peakTitle);
    if (l.job) return U.cap(E.jobTitle(l));
    var h = l.jobsHist || [];
    if (!h.length) return '';
    var main = h.map(function (x, i) { return { id: x.id, len: (h[i + 1] ? h[i + 1].from : l.age) - x.from }; }).sort(function (a, b) { return b.len - a.len; })[0];
    return U.cap(E.jobLabel(main.id));
  }
  function encode(sum) { return b64encode(JSON.stringify(sum)); }
  function decode(s) { try { var o = JSON.parse(b64decode(s)); return o && o.n ? o : null; } catch (e) { return null; } }
  function pushRecent(list, item, max) {
    list = (list || []).filter(function (x) { return x && x.id !== item.id; });
    list.unshift(item);
    return list.slice(0, max || 10);
  }

  E.finale = finale; E.wishes = function (l) { var h = { rs: 7 }; return wishes(l, function () { return U.rand(h); }); };
  E.starred = starred; E.mainJob = mainJob;
  E.pickMemories = pickMemories; E.share = { summary: summary, encode: encode, decode: decode, pushRecent: pushRecent };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));

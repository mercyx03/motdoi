/* Một Đời — v2.9: giải trí & đời sống tinh thần.
   - Concert chọn theo thể loại: nghệ sĩ Việt, concert các chương trình "Say Hi" / Anh tài, K-pop, Âu Mỹ, rap Việt, rapper Mỹ.
     Nghệ sĩ có năm sinh, già đi rồi giải nghệ; trẻ con phải xin bố mẹ đưa đi; đi nước ngoài tốn vé máy bay.
   - Sở thích từ nhỏ (rap, nhảy, guitar, vẽ, chụp ảnh, nấu ăn…): dồn sức thì có thể thành nghề (mê rap → đi casting rap → rapper).
   - Thêm việc giải trí (xem phim, karaoke, công viên, đá bóng, xem bóng đá, phượt, show rap…) và chăm sóc tâm hồn (thiền, đọc sách, leo núi, massage).
   - Đời sống tâm linh theo tôn giáo: đi lễ nhà thờ, đi chùa, thánh thất Cao Đài, thánh đường Hồi giáo… và các dịp lễ riêng. */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function T(id, when, p, cd) { E.TRIG.push({ id: id, when: when, p: p, cd: cd || 0 }); }
  function A(id, g, label, o) { var x = { id: id, g: g, l: label }; for (var k in o) x[k] = o[k]; E.ACT.push(x); }
  function EV(c, p, run, cd) { E.EVENTS.push({ c: c, p: p, run: run, cd: cd }); }
  function fx(l, o) { H.fx(l, o); }
  function cashB(l, x, why) { H.cash(l, x * l.base, why); }
  function mb(l, x) { return H.mb(l, x); }
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function free(l) { return !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped); }
  function yr(l) { return l.birthYear + l.age; }
  function parents(l) { return l.fam.mAlive || l.fam.fAlive; }
  function pw(l) { return l.fam.mAlive && l.fam.fAlive ? 'bố mẹ' : l.fam.mAlive ? 'mẹ' : l.fam.fAlive ? 'bố' : 'người nhà'; }
  var G5 = 'Giải trí', G6 = 'Sức khỏe & tâm hồn';

  // ===================================================================
  // 1. NGHỆ SĨ & CONCERT
  // năm sinh làm tròn (nhóm nhạc: năm sinh trung bình các thành viên)
  // ===================================================================
  function A_(n, b) { return { n: n, b: b }; }
  var CATS = {
    vn: { n: 'Nghệ sĩ Việt Nam', a: [A_('Sơn Tùng M-TP', 1994), A_('Jack - J97', 1997), A_('HIEUTHUHAI', 1999), A_('Quang Hùng MasterD', 1995), A_('Dương Domic', 2001), A_('Đen Vâu', 1989), A_('Mỹ Tâm', 1981), A_('Hà Anh Tuấn', 1984), A_('Hòa Minzy', 1995), A_('AMEE', 2000), A_('tlinh', 2000), A_('Bích Phương', 1989), A_('Hoàng Thùy Linh', 1988), A_('Tóc Tiên', 1989), A_('MONO', 2000), A_('Vũ.', 1995), A_('Wren Evans', 2001), A_('Phương Mỹ Chi', 2003), A_('Erik', 1997), A_('Đức Phúc', 1996), A_('Soobin Hoàng Sơn', 1992), A_('Tăng Duy Tân', 1996), A_('Orange', 1996), A_('Noo Phước Thịnh', 1988)] },
    show: { n: 'Concert chương trình "Say Hi" / Anh tài', shows: [
      { k: 'atsh1', n: 'Anh trai "Say Hi" mùa 1 (2024)', pre: 'anh trai', from: 2024, b: 1997, m: ['HIEUTHUHAI', 'Rhyder', 'Isaac', 'Đức Phúc', 'Quang Hùng MasterD', 'Anh Tú Atus', 'Erik', 'HURRYKNG', 'Dương Domic', 'Negav', 'Song Luân', 'Anh Tú', 'JSOL', 'Quân A.P', 'Pháp Kiều', 'Captain Boy', 'Quang Trung', 'Ali Hoàng Dương', 'WEAN', 'Hùng Huỳnh', 'Lou Hoàng', 'Gin Tuấn Kiệt', 'Vũ Thịnh', 'Hải Đăng Doo', 'Phạm Anh Duy', 'Phạm Đình Thái Ngân', 'Đỗ Phú Quí', 'Công Dương', 'Nicky', 'Tage'] },
      { k: 'atsh2', n: 'Anh trai "Say Hi" mùa 2 (2025)', pre: 'anh trai', from: 2025, b: 1998, m: ['Vũ Cát Tường', 'BigDaddy', 'TEZ', 'Jey B', 'Nhâm Phương Nam', 'CONGB', 'Sơn.K', 'LOHAN', 'Đỗ Nam Sơn', 'Dillan Hoàng Phan', 'Phúc Du', 'HUSTLANG Robber', 'OGENUS', 'Hải Nam', 'OTIS', 'Negav', 'Phạm Đình Thái Ngân', 'GILL', 'Jaysonlei', 'Mason Nguyễn', 'Karik', 'B Ray', 'Ryn Lee', 'Khôi Vũ', 'Bùi Duy Ngọc', 'Ngô Kiến Huy', 'buitruonglinh', 'Cody Nam Võ', 'Vương Bình', 'Rio'] },
      { k: 'exsh', n: 'Em xinh "Say Hi" (2025)', pre: 'em xinh', from: 2025, b: 1998, m: ['Bích Phương', 'Phương Ly', 'Tiên Tiên', 'Miu Lê', 'Bảo Anh', 'Phương Mỹ Chi', 'LyHan', 'Orange', 'Lamoon', 'Pháo', '52Hz', 'Châu Bùi', 'Quỳnh Anh Shyn', 'Lâm Bảo Ngọc', 'Saabirose', 'Maiquinn', 'Juky San', 'Vũ Thảo My', 'Mỹ Mỹ', 'Ngô Lan Hương', 'Han Sara', 'LyLy', 'Hoàng Duyên', 'Liu Grace', 'Ánh Sáng AZA', 'Yeolan', 'Muộii', 'Chi Xê', 'Danmy', 'Đào Tử A1J'] },
      { k: 'thsh', n: 'Tinh hà "Say Hi" (2026)', pre: 'anh trai', from: 2026, b: 1999, m: ['Quang Hùng MasterD', 'Wren Evans', 'Dương Domic', 'JSOL', 'buitruonglinh', 'HURRYKNG', 'Pháp Kiều', 'Song Luân', 'CONGB', 'Sơn.K', 'Captain Boy', 'WEAN', 'Ali Hoàng Dương', 'Vương Bình', 'Cody Nam Võ', 'Jaysonlei', 'Dillan Hoàng Phan', 'Đặng Hồng Hải', 'IVAN', 'Thể Thiên', 'HYO', 'CoolKid', 'KIMLONG', 'Xuân Định K.Y'] },
      { k: 'atvncg24', n: 'Anh trai vượt ngàn chông gai 2024', pre: 'anh tài', from: 2024, b: 1985, m: ['SOOBIN', 'Kay Trần', 'Jun Phạm', 'Cường Seven', 'Tự Long', 'Trọng Hiếu', 'S.T Sơn Thạch', 'BB Trần', 'Bùi Công Nam', 'Rhymastic', 'Binz', 'Quốc Thiên', 'Thanh Duy', 'Bằng Kiều', 'Tiến Luật', 'Đinh Tiến Đạt', 'Đỗ Hoàng Hiệp', 'Neko Lê', 'Liên Bỉnh Phát', 'Thiên Minh', 'Duy Khánh', 'HuyR', 'Tăng Phúc', 'Nguyễn Trần Duy Nhất', 'Thành Trung', 'Trương Thế Vinh', 'Hồng Sơn', 'Phạm Khánh Hưng', 'Đăng Khôi', 'Kiên Ứng', 'Tuấn Hưng', 'Hà Lê'] },
      { k: 'atvncg26', n: 'Anh trai vượt ngàn chông gai 2026', pre: 'anh tài', from: 2026, b: 1988, m: ['Đại Nghĩa', 'Dũng DT', 'Nguyễn Văn Chung', 'Thái VG', 'Tùng Mint', 'Thanh Duy', 'Thỏ (Da LAB)', 'Trịnh Thăng Bình', 'Hoàng Tôn', 'Thơm (Da LAB)', 'Jun Phạm', 'Đinh Mạnh Ninh', 'Vương Anh Tú', 'Will', 'Mew Amazing', 'Neko Lê', 'BB Trần', 'Hoàng Rob', 'Thuận Nguyễn', 'Huỳnh Lập', 'Đông Hùng', 'Toki Thành Thỏ', "It's Charles.", 'Duy Khánh', 'Cheng', 'K.O', 'Hoàng Dũng', 'Lê Xuân Tiền', 'Osad', '14 Casper', 'Hồ Đông Quan', 'Thái Lê Minh Hiếu', 'Hà An Huy', 'Phùng Minh Cương'] }] },
    kr: { n: 'K-pop Hàn Quốc', a: [A_('BTS', 1995), A_('BLACKPINK', 1996), A_('TWICE', 1997), A_('SEVENTEEN', 1997), A_('IVE', 2004), A_('aespa', 2001), A_('CORTIS', 2007), A_('NewJeans', 2005), A_('Stray Kids', 2000), A_('LE SSERAFIM', 2002), A_('ENHYPEN', 2003), A_('TOMORROW X TOGETHER', 2001), A_('(G)I-DLE', 1998), A_('ITZY', 2001), A_('ATEEZ', 1999), A_('NCT 127', 1997), A_('EXO', 1992), A_('RIIZE', 2002), A_('ZEROBASEONE', 2002), A_('BABYMONSTER', 2006), A_('ILLIT', 2006), A_('BIGBANG', 1988), A_('G-Dragon', 1988), A_('BOYNEXTDOOR', 2003)] },
    us: { n: 'Nghệ sĩ Âu Mỹ', a: [A_('Taylor Swift', 1989), A_('Dua Lipa', 1995), A_('Justin Bieber', 1994), A_('Olivia Rodrigo', 2003), A_('The Weeknd', 1990), A_('Billie Eilish', 2001), A_('Ariana Grande', 1993), A_('Bruno Mars', 1985), A_('Ed Sheeran', 1991), A_('Coldplay', 1977), A_('Sabrina Carpenter', 1999), A_('Lady Gaga', 1986), A_('Harry Styles', 1994), A_('Adele', 1988), A_('Maroon 5', 1979), A_('Charlie Puth', 1991)] },
    rapvn: { n: 'Rap Việt', a: [A_('Đen Vâu', 1989), A_('Binz', 1988), A_('Rhymastic', 1990), A_('Karik', 1989), A_('HIEUTHUHAI', 1999), A_('tlinh', 2000), A_('RPT MCK', 1999), A_('Low G', 1998), A_('Andree Right Hand', 1989), A_('Suboi', 1990), A_('Wxrdie', 1999), A_('Obito', 1998), A_('Double2T', 1998)], shows: ['đêm nhạc Rap Việt All-Star', 'đêm rap underground', 'giải đấu battle rap'] },
    rapus: { n: 'Rapper Mỹ', a: [A_('Drake', 1986), A_('Kendrick Lamar', 1987), A_('Travis Scott', 1991), A_('Eminem', 1972), A_('Post Malone', 1995), A_('Nicki Minaj', 1982), A_('Cardi B', 1992), A_('Doja Cat', 1995), A_('21 Savage', 1992)] }
  };
  var NEXTGEN = { vn: ['Minh Vy', 'Kai Phạm', 'Lam Anh', 'Rin Trần'], kr: ['nhóm nhạc NOVA', 'nhóm nhạc ORBIT', 'nhóm nhạc STELLAR'], us: ['Lyra', 'Kai Rivers', 'ARIA'], rapvn: ['rapper Zeno', 'rapper Bảo Khang'], rapus: ['rapper Sena'] };
  // ca sĩ / nhóm còn đang biểu diễn: tuổi 16–58 (nhóm nhạc lâu năm có thể tái hợp đến ~60)
  function active(a, y) { return y - a.b >= 16 && y - a.b <= 58; }
  function artistsOf(cat, l) {
    var y = yr(l), C = CATS[cat];
    if (cat === 'show') return C.shows.filter(function (s) { return y >= s.from; }).map(function (s) { return { n: s.n, b: s.b, show: s, archive: y - s.b > 65 }; });
    var a = C.a.filter(function (x) { return active(x, y); });
    if (a.length < 3 && NEXTGEN[cat]) a = a.concat(NEXTGEN[cat].map(function (n) { return { n: n, b: y - 24, next: true }; }));
    return a;
  }
  // tên hiển thị: thành viên chương trình gọi là "anh trai / em xinh / anh tài + tên"
  // v5.6.1: một số nghệ sĩ được gọi thẳng tên, không thêm "anh trai / anh tài / em xinh"
  var NOPRE = { 'Pháp Kiều': 1 };
  function memberName(pre, n) { return NOPRE[n] || !pre ? n : pre + ' ' + n; }
  E.memberName = memberName;
  function showMember(s, r) { return memberName(s.pre, pick(r, s.m)); }
  H.pickIdol = function (r, l) {
    var w = !isVN(l) ? { us: 4, kr: 3, rapus: 2 } : l.sex === 'F' ? { kr: 3.5, vn: 3, show: 2, us: 2, rapvn: 0.8 } : { vn: 3, rapvn: 2.5, show: 1.2, us: 2, kr: 1.2, rapus: 1.5 };
    if (l.hobby === 'rap') { w.rapvn = (w.rapvn || 0) + 4; w.rapus = (w.rapus || 0) + 2; }
    if (l.hobby === 'kpop') w.kr = (w.kr || 0) + 5;
    var cats = Object.keys(w).filter(function (c) { return artistsOf(c, l).some(function (a) { return !a.archive; }); });
    var cat = U.wpick(r, cats, function (c) { return w[c]; }) || 'vn';
    var a = pick(r, artistsOf(cat, l).filter(function (a) { return !a.archive; }));
    l.idolCat = cat; l.idolBorn = a.b;
    return a.show ? showMember(a.show, r) : a.n;
  };

  var VENUE = { vn: [['Hà Nội', 0.025, 1], ['TP. Hồ Chí Minh', 0.025, 1], ['Đà Nẵng', 0.02, 1]], show: [['Hà Nội', 0.03, 1], ['TP. Hồ Chí Minh', 0.03, 1]],
    kr: [['Hà Nội', 0.04, 1], ['Seoul', 0.06, 3], ['Bangkok', 0.05, 2.5], ['Singapore', 0.06, 3]], us: [['Singapore', 0.06, 3], ['Bangkok', 0.05, 2.5], ['Tokyo', 0.06, 3.2], ['Hà Nội', 0.05, 1]],
    rapvn: [['TP. Hồ Chí Minh', 0.01, 1], ['Hà Nội', 0.01, 1]], rapus: [['Singapore', 0.05, 3], ['Bangkok', 0.045, 2.5]] };
  function makeShow(l, r, cat, name) {
    var v = pick(r, VENUE[cat] || VENUE.vn), far = v[2] > 1.3;
    if (!isVN(l)) { v = [W_city(l), v[1], 1]; far = false; }
    var what = cat === 'show' ? 'concert ' + name : cat === 'rapvn' && /đêm|giải/.test(name) ? name : 'concert ' + name;
    return { cat: cat, name: name, city: v[0], price: v[1], trip: v[2], far: far, what: what };
  }
  function W_city(l) { var c = G.W && G.W.BY[l.country]; return c ? c.cities[0] : 'thành phố'; }
  function costOf(l, d) { return d.price * d.trip; }
  // ai trả tiền: dưới 16 tuổi phải có bố mẹ đưa đi; 16–17 tự đi trong nước (tiền riêng hoặc xin bố mẹ), ra nước ngoài phải có người lớn
  SC('concert_di', {
    title: function (l, d) { return d.cat === 'rapvn' ? 'Đêm nhạc rap' : 'Đêm nhạc của thần tượng'; },
    prep: function (l, r, arg) {
      var cat = (arg && arg.cat) || l.idolCat || 'vn', name = arg && arg.name;
      if (!name) { var list = artistsOf(cat, l); if (!list.length) { cat = 'vn'; list = artistsOf('vn', l); } var a = pick(r, list); name = a.show ? a.show.n : a.n; if (cat === 'rapvn' && ch(r, 0.4)) name = pick(r, CATS.rapvn.shows); }
      return makeShow(l, r, cat, name);
    },
    text: function (l, d) { return U.cap(d.what) + ' ở ' + d.city + '. Vé khoảng ' + mb(l, d.price) + (d.far ? ', chưa kể vé máy bay, khách sạn (tổng ~' + mb(l, costOf(l, d)) + ')' : '') + (d.cat === 'rapvn' ? '.' : ' — và hết sạch sau vài phút mở bán.') + (l.age < 16 ? ' Bạn còn nhỏ, muốn đi phải có người lớn đưa đi.' : ''); },
    opts: [
      { k: 'self', l: 'Tự canh vé, tự bỏ tiền đi', h: function (l, d) { return mb(l, costOf(l, d)); }, req: function (l, d) { return l.age >= 18 || (l.age >= 16 && !d.far); }, ai: { w: 1.2, cost: 0.05 }, run: function (l, r, log, d) { go(l, r, log, d, 'self'); } },
      { k: 'parents', l: function (l) { return 'Xin ' + pw(l) + ' ' + (l.age < 16 ? 'đưa đi' : 'cho tiền đi'); }, req: function (l) { return l.age < 18 && parents(l); }, ai: { w: 1.3 }, run: function (l, r, log, d) { go(l, r, log, d, 'parents'); } },
      { k: 'black', l: 'Mua vé "pass lại" trên mạng', h: 'Rẻ hơn… hoặc là lừa đảo', req: function (l) { return l.age >= 16; }, ai: { risk: 1 }, run: function (l, r, log, d) { go(l, r, log, d, 'black'); } },
      { k: 'stream', l: 'Xem livestream ở nhà', ai: { w: 0.8 }, run: function (l, r, log, d) { log('Ngồi xem livestream ' + d.what + ', hát theo một mình trong phòng.', 'neutral'); fx(l, { hap: 1 }); } }
    ]
  });
  function go(l, r, log, d, how) {
    var cost = costOf(l, d);
    if (how === 'parents') {
      var ok = l.fam.q >= (d.far ? 4 : 3) || (!d.far && d.cat === 'rapvn');
      if (!ok || ch(r, l.age < 13 ? 0.35 : 0.2)) { log(U.cap(pw(l)) + ' bảo ' + (d.far ? '"đi nước ngoài xem ca nhạc tốn kém lắm, đợi lớn đã".' : '"tập trung học đi con, năm sau tính".') + ' Bạn dỗi cả tuần.', 'neutral'); fx(l, { hap: -3 }); return; }
      if(E.childExpense){var bill=E.childExpense(l,cost*l.base,'Vé concert '+d.what,false);log(bill.note,'neutral');if(!bill.ok)return;}
      if (l.age < 16) log(U.cap(pw(l)) + ' đưa bạn đi xem ' + d.what + ' ở ' + d.city + '. ' + pick(r, ['Cả buổi bạn nắm chặt tay người lớn, mắt dán lên sân khấu.', 'Về nhà vẫn còn hát mãi những bài hôm ấy.']), 'good');
      else log('Được ' + pw(l) + ' cho tiền, rủ bạn đi xem ' + d.what + ' ở ' + d.city + '.', 'good');
      fx(l, { hap: 10, soc: 2 }); H.mem(l, 'Lần đầu đi xem ' + d.what + ', biển lightstick rực sáng.', 5); return;
    }
    if (how === 'black') {
      if (ch(r, 0.4)) { cashB(l, -d.price * 1.5, 'Bị lừa mua vé ca nhạc'); log('Chuyển khoản mua vé xong, người bán chặn liên lạc. Mất trắng ' + mb(l, d.price * 1.5) + '.', 'bad'); fx(l, { hap: -10 }); return; }
      cashB(l, -cost * 1.6, 'Vé ' + d.what); log('Mua lại vé giá cao nhưng vẫn kịp đi xem ' + d.what + '. Đáng từng đồng!', 'good'); fx(l, { hap: 10 }); H.mem(l, 'Đêm ' + d.what + ', nước mắt rơi khi bài hát quen thuộc vang lên.', 5); return;
    }
    if (ch(r, d.cat === 'rapvn' ? 0.9 : 0.6)) {
      cashB(l, -cost, 'Vé ' + d.what);
      log((d.cat === 'rapvn' ? 'Đi xem ' + d.what + ', cả khán phòng nhún theo từng câu flow.' : 'Săn được vé! Đêm ' + d.what + ' ở ' + d.city + ' — bạn hát theo đến khản cổ.') + (l.partner && l.partner.status === 'dating' && ch(r, 0.5) ? ' Đi cùng ' + l.partner.name + '.' : ''), 'good');
      fx(l, { hap: 12, soc: 3 }); if (d.far) H.visit(l, d.city === 'Seoul' ? 'Hàn Quốc' : d.city === 'Bangkok' ? 'Thái Lan' : d.city === 'Singapore' ? 'Singapore' : d.city === 'Tokyo' ? 'Nhật Bản' : d.city);
      H.mem(l, 'Đêm ' + d.what + ' ở ' + d.city + '.', 5);
    } else { log('Canh mỏi mắt vẫn không săn được vé ' + d.what + '.', 'bad'); fx(l, { hap: -4 }); }
  }
  // thần tượng tự tổ chức concert (sự kiện ngẫu nhiên) dùng cùng logic
  SC('concert', {
    title: 'Đêm nhạc của thần tượng', prep: function (l, r) { if (!l.idol || (l.idolBorn && yr(l) - l.idolBorn > 58)) l.idol = H.pickIdol(r, l); var cat = l.idolCat || 'vn'; var nm = /^(anh trai|em xinh|anh tài) /.test(l.idol) ? (CATS.show.shows.filter(function (s) { return s.m.some(function (m) { return l.idol.indexOf(m) >= 0; }); })[0] || { n: l.idol }).n : l.idol; return makeShow(l, r, /^(anh trai|em xinh|anh tài) /.test(l.idol) ? 'show' : cat, nm); },
    text: function (l, d) { return E.DEC.concert_di.def.text(l, d); }, opts: E.DEC.concert_di.def.opts
  });
  // chọn loại concert muốn đi (hành động chủ động)
  SC('concert_chon', {
    title: 'Đi xem ca nhạc', text: function (l) { return 'Bạn muốn đi xem concert của ai?' + (l.idol ? ' Thần tượng của bạn: ' + l.idol + '.' : ''); },
    opts: Object.keys(CATS).map(function (c) {
      return { k: c, l: function (l) { var a = artistsOf(c, l); return CATS[c].n; }, h: function (l) { return artistsOf(c, l).slice(0, 4).map(function (a) { return a.n; }).join(', ') + (artistsOf(c, l).length > 4 ? '…' : ''); },
        req: function (l) { return artistsOf(c, l).length > 0 && !(c === 'rapus' && l.age < 16); }, ai: function (l) { return c === l.idolCat ? 2 : 0.5; },
        run: function (l, r, log) { l.pending.unshift(E.DEC.concert_di.make(l, r, { cat: c })); } };
    }).concat([{ k: 'no', l: 'Thôi, để dịp khác', ai: { w: 0.3 }, run: function () { } }])
  });
  E.SHOWS = CATS.show.shows; E.showMember = showMember;
  E.ACT.forEach(function (a) { if (a.id === 'concert') { a.sc = 'concert_chon'; a.l = 'Đi xem ca nhạc, concert'; a.min = 10; a.max = 60; } });
  T('concert', function (l, a) { return a >= 13 && a <= 45 && l.idol && !(l.idolBorn && yr(l) - l.idolBorn > 58) && free(l); }, 0.1, 3);
  E.TRIG.forEach(function (t, i) { if (t.id === 'concert' && i < E.TRIG.length - 1) t.when = function () { return false; }; }); // bỏ trigger concert cũ (đã thay bằng cái trên)
  E.artistsOf = artistsOf; E.CONCERT_CATS = CATS;

  // ===================================================================
  // 2. SỞ THÍCH TỪ NHỎ → có thể thành nghề
  // ===================================================================
  var HOBBY = {
    rap: { n: 'nghe và viết rap', w: [2, 0.8], job: 'rapper', step: ['viết những câu rap đầu tiên vào vở', 'đăng bản rap tự thu lên mạng', 'lên sân khấu một đêm rap underground', 'thi một giải battle rap'] },
    nhay: { n: 'nhảy, cover vũ đạo', w: [0.6, 1.6], job: 'vu_cong', step: ['tập nhảy theo video trên mạng', 'lập nhóm nhảy cover với bạn', 'diễn ở hội trại trường', 'thi một cuộc thi nhảy đường phố'] },
    guitar: { n: 'chơi guitar', w: [1.2, 0.8], job: 'nhac_si', step: ['tập những hợp âm đầu tiên', 'đệm hát cho cả lớp nghe', 'lập ban nhạc ở trường', 'tự sáng tác một bài hát'] },
    ve: { n: 'vẽ tranh, vẽ truyện', w: [0.8, 1], talent: 'hội họa', job: 'thiet_ke', step: ['vẽ kín cả cuốn vở', 'đăng tranh vẽ lên mạng', 'nhận vẽ chân dung cho bạn bè', 'gửi tranh dự một cuộc thi'] },
    chupanh: { n: 'chụp ảnh', w: [0.7, 0.7], job: 'nhiep_anh', step: ['chụp ảnh bằng điện thoại', 'để dành tiền mua máy ảnh cũ', 'chụp ảnh kỷ yếu cho lớp', 'có ảnh được đăng báo'] },
    nauan: { n: 'nấu ăn', w: [0.5, 1.1], job: 'dau_bep', step: ['học nấu theo video', 'nấu cả mâm cơm cho gia đình', 'bán bánh tự làm cho bạn bè', 'thi một cuộc thi nấu ăn'] },
    doc: { n: 'đọc sách', w: [0.8, 1.1], step: ['đọc hết tủ sách ở nhà', 'làm thẻ thư viện', 'viết cảm nhận sách lên mạng', 'đoạt giải cuộc thi đại sứ văn hóa đọc'] },
    kpop: { n: 'đu idol K-pop', w: [0.3, 1.6], step: ['sưu tầm ảnh thẻ thần tượng', 'vào fanclub trên mạng', 'học tiếng Hàn để hiểu lời bài hát', 'đi xem fan meeting'] },
    bongda: { n: 'đá bóng', w: [2, 0.3], step: ['đá bóng ngoài bãi đất trống', 'vào đội bóng của trường', 'đá giải phong trào', 'được thầy thể dục để ý'] }
  };
  function hob(l) { return l.hobby ? HOBBY[l.hobby] : null; }
  EV(function (l, a) { return a >= 9 && a <= 15 && !l.hobby; }, 0.3, function (l, a, r, log) {
    var ks = Object.keys(HOBBY);
    var k = U.wpick(r, ks, function (k) { var h = HOBBY[k], w = h.w[l.sex === 'M' ? 0 : 1]; if (h.talent && l.talent === h.talent) w *= 3; if (k === 'bongda' && l.talent === 'thể thao') w *= 3; if (k === 'guitar' && l.talent === 'âm nhạc') w *= 3; return w; });
    l.hobby = k; l.hobbySk = 10;
    log('Bắt đầu mê ' + HOBBY[k].n + '.', 'good'); fx(l, { hap: 3 });
    if (k === 'rap' && !l.idol && !isVN(l)) { l.idol = H.pickIdol(r, l); }
  });
  SC('so_thich', {
    title: function (l) { return 'Niềm đam mê ' + hob(l).n; }, prep: function (l, r) { var h = hob(l); return { i: Math.min(h.step.length - 1, Math.floor((l.hobbySk || 10) / 18)) }; },
    valid: function (l) { return !!hob(l); },
    text: function (l, d) { return 'Dạo này bạn ' + hob(l).step[d.i] + '. ' + (l.school ? 'Bài vở trên lớp cũng đang nhiều.' : 'Công việc chiếm gần hết thời gian.'); },
    opts: [
      { k: 'deep', l: 'Dồn sức cho đam mê', h: 'Giỏi lên nhanh, có thể thành nghề', ai: { w: 1, amb: 0.6 }, run: function (l, r, log, d) { l.hobbySk = Math.min(100, (l.hobbySk || 10) + 14); var h = hob(l); log(U.cap(h.step[d.i]) + ' — ' + pick(r, ['càng làm càng mê.', 'bạn bè bắt đầu để ý.', 'thức khuya mà không thấy mệt.']), 'good'); fx(l, { hap: 4, kno: l.school ? -1 : 0 }); if (h.talent && !l.talent) l.talent = h.talent; } },
      { k: 'keep', l: 'Giữ làm thú vui lúc rảnh', ai: { w: 1.2 }, run: function (l, r, log) { l.hobbySk = Math.min(100, (l.hobbySk || 10) + 4); log('Vẫn ' + hob(l).n + ' lúc rảnh, cho đầu óc thư giãn.', 'neutral'); fx(l, { hap: 2 }); } },
      { k: 'drop', l: 'Bỏ bớt để tập trung việc chính', ai: { w: 0.4 }, run: function (l, r, log) { log('Cất ' + hob(l).n + ' sang một bên để lo việc chính.', 'neutral'); l.hobby = null; } }
    ]
  });
  T('so_thich', function (l, a) { return !!hob(l) && a >= 10 && a <= 40 && free(l); }, 0.22, 2);
  E.TRIG.forEach(function (t) { if (t.id === 'so_thich') { t.cd = 6; t.max = 2; } }); // v3.7: chuyện sở thích chỉ hỏi tối đa 2 lần trong đời
  // đi casting / theo nghề từ sở thích
  SC('so_thich_nghe', {
    title: function (l) { return l.hobby === 'rap' ? 'Casting chương trình rap' : 'Biến đam mê thành nghề?'; },
    valid: function (l) { var h = hob(l); return !!(h && h.job && (l.hobbySk || 0) >= 50 && !(l.job && E.resolveJob(l.job.id) === h.job)); },
    text: function (l) { var h = hob(l); return l.hobby === 'rap' ? 'Một chương trình truyền hình về rap mở vòng casting. Bạn đã có mấy bản rap tự thu được nhiều người nghe.' : 'Bạn ' + h.n + ' giỏi đến mức có người trả tiền. Có nên theo hẳn nghề ' + E.jobLabel(h.job) + '?'; },
    opts: [
      { k: 'go', l: function (l) { return l.hobby === 'rap' ? 'Đi casting' : 'Theo nghề ' + E.jobLabel(hob(l).job); }, ai: { w: 1, risk: 0.6, amb: 1 }, run: function (l, r, log) {
        var h = hob(l), p = U.clamp(0.3 + ((l.hobbySk || 0) - 50) / 80, 0.15, 0.85);
        if (l.hobby === 'rap' && !ch(r, p)) { log('Đi casting nhưng bị loại từ vòng gửi xe. "Flow chưa có màu riêng," giám khảo nói.', 'bad'); fx(l, { hap: -5 }); l.hobbySk -= 10; return; }
        if (l.hobby === 'rap') { log('Vượt qua vòng casting, được lên sóng truyền hình! Một bản rap của bạn viral sau tập phát sóng.', 'big'); H.mem(l, 'Lần đầu đứng trên sân khấu chương trình rap truyền hình.', 6); }
        E.startJob(l, h.job, r, log); if (E.CAR[h.job].fame) l.fame = Math.max(l.fame || 0, l.hobby === 'rap' ? 4e4 : 1e4);
      } },
      { k: 'no', l: 'Thôi, giữ làm sở thích', ai: { w: 1 }, run: function (l, r, log) { log('Giữ đam mê như một góc riêng của cuộc sống.', 'neutral'); l.hobbySk = Math.min(l.hobbySk, 49); } }
    ]
  });
  E.MAJOR.so_thich_nghe = 1;
  T('so_thich_nghe', function (l, a) { var h = hob(l); return !!(h && h.job && (l.hobbySk || 0) >= 50) && a >= 16 && a <= 35 && free(l); }, 0.4, 3);

  // ===================================================================
  // 3. THÊM VIỆC GIẢI TRÍ & CHĂM SÓC TÂM HỒN
  // ===================================================================
  function simple(id, g, label, o) {
    SC(id, { title: o.title, prep: o.prep, text: o.text, valid: o.valid, opts: o.opts });
    A(id, g, label, { min: o.min, max: o.max, avail: o.avail, ai: o.ai || { w: 0.15 } });
  }
  function paidBy(l, x, why, log) { if(E.childExpense){var bill=E.childExpense(l,x*l.base,why,false);if(log)log(bill.note,'neutral');return bill.ok;}if(l.money<x*l.base)return false;cashB(l,-x,why);return true; }
  simple('xem_phim', G5, 'Xem phim ở rạp', { min: 6, title: 'Đi xem phim',
    prep: function (l, r) { return { g: pick(r, l.age < 13 ? ['phim hoạt hình', 'phim siêu anh hùng'] : ['phim kinh dị', 'phim tình cảm', 'phim hành động', 'phim Việt đang gây sốt', 'phim hoạt hình']) }; },
    text: function (l, d) { return 'Rạp đang chiếu ' + d.g + ' mà ai cũng bàn tán.'; },
    opts: [
      { k: 'friends', l: function (l) { return l.age < 12 ? 'Xin ' + pw(l) + ' đưa đi' : 'Rủ bạn bè đi xem'; }, run: function (l, r, log, d) { if(!paidBy(l, 0.002, 'Vé xem phim', log))return; log(d.g === 'phim kinh dị' ? 'Xem phim kinh dị, cả nhóm hét ầm, về nhà không dám tắt đèn.' : 'Xem ' + d.g + ' cùng ' + (l.age < 12 ? pw(l) : 'bạn bè') + ', ăn hết cả xô bắp rang.', 'good'); fx(l, { hap: 4, soc: 2 }); } },
      { k: 'date', l: function (l) { return 'Đi cùng ' + (l.partner ? l.partner.name : 'người ấy'); }, req: function (l) { return !!l.partner; }, run: function (l, r, log) { var w = H.datePay ? H.datePay(l, r, 0.004, 'Xem phim') : ''; log('Hẹn ' + l.partner.name + ' đi xem phim, ngồi hàng ghế cuối.' + w, 'good'); fx(l, { hap: 5 }); } },
      { k: 'home', l: 'Đợi lên mạng rồi xem ở nhà', run: function (l, r, log) { log('Đợi phim lên mạng, nằm nhà xem.', 'neutral'); fx(l, { hap: 1 }); } }
    ] });
  simple('karaoke', G5, 'Đi hát karaoke', { min: 14, title: 'Karaoke', text: 'Cả nhóm rủ nhau đi hát karaoke.',
    opts: [
      { k: 'sing', l: 'Cầm mic hát hết mình', run: function (l, r, log) { if(!paidBy(l, 0.004, 'Hát karaoke', log))return; log(l.talent === 'âm nhạc' ? 'Hát một bài, cả phòng im phăng phắc rồi vỗ tay rần rần.' : pick(r, ['Hát lạc tông nhưng vui nhất hội.', 'Giành mic suốt buổi, khàn cả giọng.']), 'good'); fx(l, { hap: 5, soc: 3 }); } },
      { k: 'listen', l: 'Ngồi nghe, vỗ tay cổ vũ', run: function (l, r, log) { if(!paidBy(l, 0.004, 'Hát karaoke', log))return; log('Ngồi nghe bạn bè hát, cười nghiêng ngả.', 'good'); fx(l, { hap: 3, soc: 2 }); } }
    ] });
  simple('cong_vien', G5, 'Đi công viên, khu vui chơi', { min: 4, max: 15, title: 'Khu vui chơi', text: function (l) { return 'Cuối tuần, bạn muốn được đi khu vui chơi ' + (l.urban ? 'trong thành phố' : 'ở thị trấn') + '.'; },
    valid: function (l) { return parents(l); },
    opts: [
      { k: 'go', l: function (l) { return 'Xin ' + pw(l) + ' đưa đi'; }, run: function (l, r, log) { if (l.fam.q <= 1 && ch(r, 0.5)) { log(U.cap(pw(l)) + ' bận đi làm, hẹn tuần sau. Bạn ra đầu ngõ chơi với lũ trẻ.', 'neutral'); return; } log(pick(r, ['Chơi đu quay, tàu lượn, về nhà ngủ say không biết trời đất.', 'Được ăn kem, chơi nhà bóng cả buổi chiều.', 'Lần đầu ngồi tàu lượn, hét to nhất nhóm.']), 'good'); fx(l, { hap: 6 }); } },
      { k: 'home', l: 'Ở nhà chơi với bạn hàng xóm', run: function (l, r, log) { log('Chơi trốn tìm, nhảy dây với bọn trẻ hàng xóm.', 'good'); fx(l, { hap: 3, soc: 2 }); } }
    ] });
  simple('da_bong_ban', G5, 'Rủ bạn đá bóng, chơi thể thao', { min: 8, max: 55, title: 'Chơi thể thao', prep: function (l, r) { return { s: pick(r, l.age < 16 ? ['đá bóng', 'đánh cầu lông', 'đá cầu', 'bóng rổ'] : ['đá bóng sân cỏ nhân tạo', 'chơi pickleball', 'đánh cầu lông', 'chạy bộ cùng hội']) }; },
    text: function (l, d) { return 'Tụi bạn rủ đi ' + d.s + '.'; },
    opts: [
      { k: 'go', l: 'Đi ngay', run: function (l, r, log, d) { if (ch(r, 0.06)) { log('Đi ' + d.s + ' thì bị lật cổ chân, phải nghỉ mấy tuần.', 'bad'); fx(l, { hea: -4 }); return; } log('Đi ' + d.s + ' toát mồ hôi, người nhẹ hẳn.', 'good'); fx(l, { hea: 3, hap: 3, soc: 2 }); } },
      { k: 'no', l: 'Bận, để hôm khác', run: function (l, r, log) { log('Từ chối, ở nhà làm việc riêng.', 'neutral'); } }
    ] });
  simple('xem_bong_da', G5, 'Đi xem bóng đá ở sân', { min: 10, title: 'Trận cầu lớn', text: function (l) { return isVN(l) ? 'Đội tuyển Việt Nam đá trên sân Mỹ Đình, vé bán hết rất nhanh.' : 'Đội bóng thành phố đá trận quan trọng trên sân nhà.'; },
    opts: [
      { k: 'stadium', l: 'Ra sân cổ vũ', run: function (l, r, log) { if(!paidBy(l, 0.005, 'Vé bóng đá', log))return; log(ch(r, 0.55) ? 'Ra sân cổ vũ, đội nhà thắng! Cả đoàn đi bão đến khuya.' : 'Ra sân cổ vũ nhưng đội nhà thua. Về nhà vẫn mặc nguyên áo cờ đỏ.', 'good'); fx(l, { hap: 6, soc: 3 }); } },
      { k: 'cafe', l: 'Xem ở quán cà phê với hội bạn', run: function (l, r, log) { log('Xem bóng ở quán cà phê, hò hét cùng cả quán.', 'good'); fx(l, { hap: 3, soc: 2 }); } }
    ] });
  simple('phuot', G5, 'Đi phượt, cắm trại', { min: 17, title: 'Chuyến đi bụi', prep: function (l, r) { return { p: isVN(l) ? pick(r, ['Hà Giang', 'Tà Xùa', 'Mộc Châu', 'Đà Lạt', 'Măng Đen', 'Phú Yên', 'Côn Đảo']) : 'vùng núi gần thành phố' }; },
    text: function (l, d) { return 'Hội bạn rủ đi ' + d.p + ' cuối tuần.'; },
    opts: [
      { k: 'moto', l: 'Đi xe máy, cắm trại qua đêm', run: function (l, r, log, d) { cashB(l, -0.02, 'Đi phượt'); if (ch(r, 0.04)) { log('Trên đường tới ' + d.p + ', xe trượt bánh, bạn bị xây xát.', 'bad'); fx(l, { hea: -8 }); return; } log('Cắm trại ở ' + d.p + ', cùng đón bình minh.', 'good'); fx(l, { hap: 8, soc: 3 }); H.visit(l, d.p); if (ch(r, 0.3)) H.mem(l, 'Bình minh trên ' + d.p + '.', 3); } },
      { k: 'tour', l: 'Đi tour cho an toàn', run: function (l, r, log, d) { cashB(l, -0.04, 'Tour du lịch'); log('Đi tour ' + d.p + ', ăn ngon ngủ yên.', 'good'); fx(l, { hap: 5 }); } },
      { k: 'no', l: 'Không đi', run: function (l, r, log) { log('Ở nhà nghỉ ngơi.', 'neutral'); } }
    ] });
  simple('show_rap', G5, 'Đi xem show rap, battle rap', { min: 14, title: 'Đêm rap', text: 'Cuối tuần có ' + 'đêm rap underground ở một quán bar nhỏ, các rapper trẻ đấu battle.',
    opts: [
      { k: 'watch', l: 'Đi xem', run: function (l, r, log) { if(!paidBy(l, 0.003, 'Vé show rap', log))return; log('Đi xem battle rap, cả quán gào lên sau mỗi câu punchline.', 'good'); fx(l, { hap: 5 }); if (l.hobby === 'rap') l.hobbySk = Math.min(100, (l.hobbySk || 10) + 4); } },
      { k: 'battle', l: 'Đăng ký lên battle luôn', req: function (l) { return l.hobby === 'rap' && (l.hobbySk || 0) >= 25; }, run: function (l, r, log) { if (ch(r, 0.3 + ((l.hobbySk || 0) - 30) / 100)) { log('Thắng battle! Clip màn đối đáp của bạn được chia sẻ khắp hội mê rap.', 'big'); l.hobbySk = Math.min(100, l.hobbySk + 10); l.fame = (l.fame || 0) + 3000; fx(l, { hap: 8 }); } else { log('Thua battle, bị đối thủ "đè" tơi tả. Về viết lại cả quyển lyric.', 'neutral'); l.hobbySk += 4; } } },
      { k: 'no', l: 'Không đi', run: function (l, r, log) { log('Ở nhà nghe rap qua tai nghe.', 'neutral'); } }
    ], ai: function (l) { return l.hobby === 'rap' ? 0.4 : 0.04; } });
  simple('choi_game_nha', G5, 'Chơi game ở nhà', { min: 6, title: 'Chơi game', prep: function (l, r) { return { g: l.game || pick(r, ['Minecraft', 'Roblox', 'Liên Quân Mobile', 'Free Fire', 'Play Together', 'FC Online']) }; },
    text: function (l, d) { return 'Rảnh rỗi, bạn mở ' + d.g + ' lên chơi.'; },
    opts: [
      { k: 'bit', l: 'Chơi một lúc rồi thôi', run: function (l, r, log, d) { log('Chơi ' + d.g + ' một lúc cho đỡ căng thẳng.', 'neutral'); fx(l, { hap: 2 }); } },
      { k: 'night', l: 'Cày xuyên đêm', run: function (l, r, log, d) { log('Cày ' + d.g + ' xuyên đêm, sáng ra mắt thâm quầng.', 'neutral'); fx(l, { hap: 3, hea: -2, kno: -1 }); if (l.talent === 'game') l.skill = Math.min(100, (l.skill || 20) + 3); } }
    ] });
  simple('thien_yoga', G6, 'Thiền, tập yoga', { min: 12, title: 'Tĩnh tâm', text: 'Bạn muốn tìm lại sự bình yên trong đầu.',
    opts: [
      { k: 'thien', l: 'Ngồi thiền mỗi sáng', run: function (l, r, log) { log('Mỗi sáng ngồi thiền mười lăm phút, đầu óc nhẹ hẳn.', 'good'); fx(l, { hap: 3 }); if (l.mind) l.mind.stress -= 8; } },
      { k: 'yoga', l: 'Đăng ký lớp yoga', h: function(l){return 'Học phí '+mb(l,.01)+(l.age<18?' · xin gia đình chi trả':'');}, run: function (l, r, log) { if(!paidBy(l,.01,'Lớp yoga',log))return; log('Tập yoga ba buổi mỗi tuần, người dẻo hơn, ngủ ngon hơn.', 'good'); fx(l, { hea: 3, hap: 2 }); if (l.mind) l.mind.stress -= 6; } }
    ] });
  simple('doc_sach', G6, 'Đọc sách', { min: 7, title: 'Một cuốn sách hay', prep: function (l, r) { return { b: pick(r, l.age < 13 ? ['Dế Mèn phiêu lưu ký', 'Kính vạn hoa', 'Harry Potter', 'Doraemon'] : ['Đắc nhân tâm', 'Nhà giả kim', 'Tôi thấy hoa vàng trên cỏ xanh', 'Sapiens', 'Cho tôi xin một vé đi tuổi thơ', 'Hành trình về phương Đông']) }; },
    text: function (l, d) { return 'Bạn tìm được cuốn "' + d.b + '".'; },
    opts: [
      { k: 'read', l: 'Đọc một mạch hết luôn', run: function (l, r, log, d) { log('Đọc hết "' + d.b + '" trong một đêm.', 'good'); fx(l, { kno: 3, hap: 2 }); if (ch(r, 0.2)) H.mem(l, 'Đêm thức trắng đọc "' + d.b + '".', 2); } },
      { k: 'slow', l: 'Mỗi tối đọc vài trang', run: function (l, r, log, d) { log('Mỗi tối đọc vài trang "' + d.b + '" trước khi ngủ.', 'good'); fx(l, { kno: 2, hap: 1 }); if (l.mind) l.mind.stress -= 3; } }
    ] });
  simple('leo_nui', G6, 'Leo núi, dã ngoại', { min: 14, max: 70, title: 'Về với thiên nhiên', prep: function (l, r) { return { p: isVN(l) ? pick(r, ['núi Bà Đen', 'Fansipan', 'Tà Năng – Phan Dũng', 'núi Chứa Chan', 'vườn quốc gia Cúc Phương', 'vườn quốc gia Ba Vì']) : 'một cung đường leo núi gần nhà' }; },
    text: function (l, d) { return 'Bạn tính đi ' + d.p + ' để hít thở không khí trong lành.'; },
    opts: [
      { k: 'go', l: 'Đi bộ chinh phục đỉnh', run: function (l, r, log, d) { cashB(l, -0.01, 'Dã ngoại'); log('Chinh phục ' + d.p + ', đứng trên cao nhìn xuống thấy mọi muộn phiền nhỏ lại.', 'good'); fx(l, { hea: 4, hap: 5 }); if (l.mind) l.mind.stress -= 8; H.visit(l, d.p); } },
      { k: 'easy', l: 'Đi cáp treo / đi dạo nhẹ nhàng', run: function (l, r, log, d) { cashB(l, -0.02, 'Dã ngoại'); log('Đi ' + d.p + ' nhẹ nhàng, chụp được mấy tấm ảnh đẹp.', 'good'); fx(l, { hap: 3 }); } }
    ] });
  simple('massage', G6, 'Đi massage, xông hơi thư giãn', { min: 18, title: 'Thư giãn', text: 'Cả tuần làm việc căng thẳng, vai gáy mỏi nhừ.',
    opts: [
      { k: 'go', l: 'Đi massage, xông hơi', run: function (l, r, log) { cashB(l, -0.006, 'Massage'); log('Massage, xông hơi một buổi, về ngủ một mạch đến sáng.', 'good'); fx(l, { hea: 2, hap: 3 }); if (l.mind) l.mind.stress -= 5; } },
      { k: 'home', l: 'Ngâm chân nước muối ở nhà', run: function (l, r, log) { log('Ngâm chân nước nóng ở nhà, cũng đỡ mỏi.', 'neutral'); fx(l, { hap: 1 }); } }
    ] });

  // ===================================================================
  // 4. ĐỜI SỐNG TÂM LINH THEO TÔN GIÁO
  // ===================================================================
  function rel(l) {
    var s = l.religion || '';
    if (/Công giáo|Kitô|Chính Thống|Anh giáo/.test(s)) return 'cg'; if (/Tin Lành/.test(s)) return 'tl'; if (/Hòa Hảo/.test(s)) return 'hh'; if (/Phật/.test(s)) return 'pg';
    if (/Cao Đài/.test(s)) return 'cd'; if (/Hồi/.test(s)) return 'hoi'; if (/Bà La Môn/.test(s)) return 'blm';
    if (/Hindu/.test(s)) return 'hin'; if (/Sikh/.test(s)) return 'sik'; if (/Do Thái/.test(s)) return 'dt'; if (/Đạo giáo/.test(s)) return 'dao';
    return isVN(l) || /tổ tiên|truyền thống|dân gian/.test(s) ? 'none' : 'free';
  }
  var REL_ACT = { cg: 'Đi lễ nhà thờ', tl: 'Đi nhà thờ (Tin Lành)', pg: 'Đi chùa lễ Phật', hh: 'Tụng kinh, làm việc thiện (Hòa Hảo)', cd: 'Đến thánh thất Cao Đài', hoi: 'Đến thánh đường Hồi giáo', blm: 'Lên đền tháp Chăm', none: 'Thắp hương tổ tiên, tĩnh tâm', hin: 'Đến đền thờ Hindu', sik: 'Đến đền Gurdwara của đạo Sikh', dt: 'Đến giáo đường Do Thái', dao: 'Đến đền Đạo giáo', free: 'Tĩnh tâm, dạo bộ một mình' };
  E.ACT.forEach(function (a) { if (a.id === 'di_chua') a.l = function (l) { return REL_ACT[rel(l)]; }; });
  SC('di_chua', {
    title: function (l) { return REL_ACT[rel(l)]; },
    text: function (l) { return { cg: 'Chuông nhà thờ đổ dồn, giáo dân lục tục đi lễ.', tl: 'Sáng Chủ nhật, cả nhà đi nhóm ở nhà thờ Tin Lành.', pg: 'Ngày rằm, chùa đông người đi lễ, khói hương nghi ngút.', hh: 'Nhà bạn theo đạo Hòa Hảo, tu tại gia, sáng tối thắp hương trên bàn thờ Tam Bảo.', cd: 'Ngày vía, tín đồ Cao Đài áo dài trắng về thánh thất cúng tứ thời.', hoi: 'Thứ Sáu, người Chăm Islam về thánh đường cầu nguyện.', blm: 'Người Chăm Bà La Môn lên đền tháp dâng lễ vật.', none: 'Nhà không theo tôn giáo nào, nhưng bàn thờ tổ tiên lúc nào cũng nghi ngút khói hương.', hin: 'Ngày lễ, đền thờ Hindu ngập hoa và tiếng chuông.', sik: 'Đền Gurdwara mở bếp ăn chung langar cho tất cả mọi người.', dt: 'Tối thứ Sáu, ngày Sabát bắt đầu.', dao: 'Đền Đạo giáo nghi ngút khói nhang.', free: 'Bạn không theo tôn giáo nào, nhưng cũng cần những phút lặng.' }[rel(l)]; },
    opts: [
      { k: 'pray', l: function (l) { return { cg: 'Dự thánh lễ, cầu nguyện cho gia đình', tl: 'Nhóm thờ phượng, hát thánh ca', pg: 'Thắp hương, nghe sư thầy giảng pháp', hh: 'Tụng kinh, cúng hoa quả', cd: 'Dự cúng tứ thời', hoi: 'Cầu nguyện, đọc kinh Qur\'an', blm: 'Dâng lễ vật, cầu an', none: 'Thắp nén hương, kể chuyện với ông bà', hin: 'Dâng hoa, cầu nguyện', sik: 'Cầu nguyện, nghe đọc kinh', dt: 'Dự lễ Sabát cùng gia đình', dao: 'Thắp nhang cầu bình an', free: 'Ngồi yên lặng nghĩ về cuộc sống' }[rel(l)]; }, run: function (l, r, log) { log('Lòng thấy nhẹ nhõm, bình yên hơn.', 'good'); fx(l, { hap: 4, karma: 1 }); if (l.mind) l.mind.stress -= 4; } },
      { k: 'help', l: function (l) { return { cg: 'Tham gia ca đoàn / giúp việc nhà thờ', tl: 'Tham gia nhóm thanh niên của hội thánh', pg: 'Làm công quả ở chùa', hh: 'Phát cơm, nước miễn phí cho người nghèo', cd: 'Phụ giúp nấu cơm chay ở thánh thất', hoi: 'Góp zakat giúp người nghèo', blm: 'Phụ giúp lễ hội Katê', none: 'Đi thăm, quét dọn mộ ông bà', hin: 'Phụ giúp lễ hội ở đền', sik: 'Phụ bếp ăn chung langar', dt: 'Làm từ thiện cùng cộng đồng', dao: 'Góp công tu sửa đền', free: 'Đi làm tình nguyện cuối tuần' }[rel(l)]; }, run: function (l, r, log) { log('Bỏ công sức giúp mọi người, thấy mình có ích.', 'good'); fx(l, { karma: 4, soc: 3, hap: 2 }); } }
    ]
  });
  // các dịp lễ & nghi thức trong đời
  EV(function (l, a) { return rel(l) === 'cg' && a >= 8 && a <= 10 && !l.flags.ruocLe; }, 0.5, function (l, a, r, log) { l.flags.ruocLe = true; log('Rước lễ lần đầu ở nhà thờ giáo xứ, mặc áo trắng tinh, cả nhà đến dự.', 'good'); fx(l, { hap: 3 }); H.mem(l, 'Ngày rước lễ lần đầu, nến trắng trên tay.', 3); });
  EV(function (l, a) { return rel(l) === 'cg' && a >= 12 && a <= 15 && l.flags.ruocLe && !l.flags.themSuc; }, 0.4, function (l, a, r, log) { l.flags.themSuc = true; log('Lãnh bí tích Thêm sức, đức giám mục về giáo xứ làm lễ.', 'good'); fx(l, { hap: 2 }); });
  EV(function (l, a) { return (rel(l) === 'cg' || rel(l) === 'tl') && a >= 3; }, 0.14, function (l, a, r, log) { log(pick(r, isVN(l) && !l.abroad ? ['Đêm Giáng sinh đi lễ nửa đêm, cả xứ đạo rực rỡ đèn sao.', 'Cả nhà dựng hang đá Giáng sinh trước cửa, lũ trẻ tíu tít.', 'Tháng Năm kính Đức Mẹ, ' + (a < 18 ? 'bạn được chọn đi dâng hoa.' : 'cả xứ rước kiệu quanh nhà thờ.'), 'Lễ Phục sinh, cả nhà đi lễ sớm, về ăn bữa cơm sum họp.', 'Đi tĩnh tâm mùa Chay cùng giáo xứ.'] : ['Đêm Giáng sinh cả nhà đi lễ ở nhà thờ, về quây quần bên bữa tối ấm cúng.', 'Cả nhà trang trí cây thông Noel, trao quà cho nhau.', 'Lễ Phục sinh, đi nhà thờ rồi cùng lũ trẻ đi tìm trứng màu.', 'Mùa Chay khép lại bằng thánh lễ Phục sinh rộn rã tiếng chuông.', 'Phục sinh năm nay cả nhà nhuộm trứng, làm bánh, mời hàng xóm sang chung vui.', 'Chủ nhật đi lễ, ở lại uống cà phê với bà con trong giáo xứ.', 'Sáng Chủ nhật đi lễ sớm, chiều phụ giáo xứ chuẩn bị buổi quyên góp.', 'Tham gia ca đoàn nhà thờ vào các buổi lễ Chủ nhật.', 'Tham gia hội từ thiện của nhà thờ, nấu cơm cho người vô gia cư.']), 'good'); fx(l, { hap: 3, soc: 2 }); }, 5);
  EV(function (l, a) { return (rel(l) === 'pg' || rel(l) === 'hh') && a >= 4 && l.country === 'VN'; }, 0.18, function (l, a, r, log) { var vu = l.fam.mAlive ? 'hoa hồng đỏ trên áo — vì còn mẹ' : 'hoa hồng trắng trên áo — mẹ không còn nữa'; log(pick(r, ['Lễ Vu Lan, bạn được cài ' + vu + '.', 'Rằm tháng Giêng, cả nhà lên chùa cầu an đầu năm.', 'Mùng Một, ngày Rằm cả nhà ăn chay.']), a >= 4 && !l.fam.mAlive ? 'neutral' : 'good'); fx(l, { hap: 2 }); });
  SC('khoa_tu', {
    title: 'Khóa tu mùa hè', valid: function (l) { return rel(l) === 'pg' || rel(l) === 'hh'; }, text: 'Chùa mở khóa tu mùa hè cho thanh thiếu niên: ăn chay, ngủ sớm, học cách sống chậm.',
    opts: [
      { k: 'go', l: 'Đăng ký tham gia', run: function (l, r, log) { log('Một tuần ở chùa: dậy từ 4 giờ sáng, quét lá, ngồi thiền. Về nhà ngoan hẳn ra.', 'good'); fx(l, { hap: 4, karma: 4, soc: 2 }); H.mem(l, 'Tuần lễ khóa tu mùa hè ở chùa.', 3); } },
      { k: 'no', l: 'Thôi, hè ở nhà chơi', run: function (l, r, log) { log('Ở nhà chơi hè.', 'neutral'); } }
    ]
  });
  T('khoa_tu', function (l, a) { return (rel(l) === 'pg' || rel(l) === 'hh') && a >= 10 && a <= 17 && free(l); }, 0.12, 99);
  EV(function (l, a) { return rel(l) === 'hoi' && a >= 12; }, 0.16, function (l, a, r, log) { log(pick(r, ['Tháng Ramadan, nhịn ăn uống từ sáng đến tối, chiều về quây quần ăn bữa xả chay.', 'Những tối Ramadan, cả khu phố sáng đèn, nhà nhà mời nhau bữa iftar.', 'Ramadan năm nay bạn tập dậy sớm ăn suhoor cùng gia đình trước bình minh.', 'Lễ Eid al-Fitr khép lại tháng chay, cả nhà mặc áo mới đi thăm họ hàng.', 'Sáng Eid, cả nhà đến thánh đường cầu nguyện rồi đi chúc mừng hàng xóm.', 'Eid năm nay bạn mang quà bánh đi biếu những gia đình khó khăn trong khu.', 'Lễ Eid al-Adha, gia đình làm lễ hiến sinh, chia thịt cho hàng xóm nghèo.', 'Thứ Sáu đi lễ ở thánh đường, nghe giảng kinh rồi ở lại trò chuyện với bà con.', 'Tháng Ramadan năm nay rơi vào mùa nóng, nhịn khát cả ngày mệt rã rời mà lòng thấy thanh thản.']), 'neutral'); fx(l, { soc: 2, karma: 1 }); }, 5);
  EV(function (l, a) { return rel(l) === 'cd' && a >= 6; }, 0.12, function (l, a, r, log) { log('Đại lễ ở Tòa Thánh Tây Ninh, cả gia đình áo dài trắng đi dự.', 'good'); fx(l, { hap: 2 }); });
  EV(function (l, a) { return rel(l) === 'blm' && a >= 6; }, 0.15, function (l, a, r, log) { log('Lễ hội Katê ở đền tháp, tiếng trống Ginăng rộn ràng.', 'good'); fx(l, { hap: 2, soc: 2 }); });
  EV(function (l, a) { return rel(l) === 'none' && isVN(l) && a >= 5; }, 0.12, function (l, a, r, log) { log(pick(r, ['Tiết Thanh minh, cả nhà đi tảo mộ ông bà.', 'Ngày giỗ ông, họ hàng về đông đủ, mâm cỗ bày kín nhà.', 'Hai mươi ba tháng Chạp, cúng ông Công ông Táo, thả cá chép ra sông.']), 'good'); fx(l, { soc: 1, hap: 1 }); });

  E.leisure = { CATS: CATS, HOBBY: HOBBY, rel: rel, artistsOf: artistsOf };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));

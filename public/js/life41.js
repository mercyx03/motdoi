/* Một Đời — v4.0: show hẹn hò trên truyền hình (độc thân, học vấn / ngoại hình / danh tiếng tốt thì dễ được chọn)
   · Bạn muốn hẹn hò: ngồi sau hàng rào trái tim, giới thiệu bản thân, người thân góp ý, kéo màn trò chuyện 2 phút, rồi cùng bấm nút
   · Người ấy là ai: bạn là "nữ chính / nam chính", lần lượt loại ứng viên qua 3 vòng (clip giới thiệu – tài năng – trò chuyện riêng); cẩn thận người "đã có chủ"
   · Đảo thiên đường: 4 nam 5 nữ sống chung trên đảo Phú Quốc, thắng thử thách thì được đi hẹn hò ở khu nghỉ dưỡng, cuối cùng chọn người mình quan tâm nhất
   Mọi chương trình diễn ra trọn trong một năm. Nhân vật, tình huống đều hư cấu. */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function A(id, g, label, o) { var x = { id: id, g: g, l: label }; for (var k in o) x[k] = o[k]; E.ACT.push(x); }
  function fx(l, o) { H.fx(l, o); }
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function free(l) { return !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }
  function yr(l) { return l.birthYear + l.age; }
  function single(l) { return !l.partner; }
  // "profile" đẹp: học vấn, hiểu biết, giao tiếp, danh tiếng, có việc ổn định
  function appeal(l) { return U.clamp(0.15 + (l.edu >= 5 ? 0.15 : 0) + l.st.soc / 400 + l.st.kno / 600 + (l.job ? 0.08 : 0) + Math.min(0.15, Math.log10((l.fame || 0) + 10) / 40) + (l.money > l.base * 5 ? 0.05 : 0), 0.1, 0.85); }
  E.datingAppeal = appeal;
  function eligible(l) { return isVN(l) && !(l.abroad && !l.abroad.perm) && single(l) && l.age >= 20 && l.age <= 42 && (l.edu >= 5 || (l.fame || 0) > 2e4 || appeal(l) >= 0.4); }
  function word(s) { return s === 'M' ? 'chàng trai' : 'cô gái'; }
  // người yêu sau chương trình: dùng hồ sơ thật của người được ghép đôi
  function becomeCouple(l, r, log, d, where) {
    var lv = E.DEC.love.make(l, r, { where: where });
    lv.data.p.name = d.n; lv.data.p.sex = d.s; lv.data.p.age = d.age;
    lv.text = 'Sau ' + where + ', bạn và ' + d.n + ' (' + (d.s === 'M' ? 'nam' : 'nữ') + ', ' + d.age + ' tuổi) nhắn tin mỗi ngày. Hai người quyết định chính thức tìm hiểu nhau.';
    l.pending.unshift(lv);
  }
  function person(l, r) { var s = H.partnerSex(l, r); return { s: s, n: H.stranger(l, r, s), age: Math.max(20, l.age + U.randint(r, -4, 4)), job: pick(r, ['kỹ sư phần mềm', 'giáo viên', 'bác sĩ', 'nhân viên ngân hàng', 'kiến trúc sư', 'chủ quán cà phê', 'tiếp viên hàng không', 'nhân viên marketing', 'dược sĩ', 'kinh doanh tự do']) }; }

  // ---------- lời mời / đăng ký ----------
  var SHOWS = { bmhh: 'Bạn muốn hẹn hò', nali: 'Người ấy là ai', dtd: 'Đảo thiên đường' };
  SC('hh_moi', {
    title: 'Lên truyền hình tìm người yêu?', valid: function (l) { return eligible(l); },
    text: function (l) { return 'Bạn bè thấy bạn ' + (l.edu >= 5 ? 'học hành giỏi giang, ' : '') + (l.job ? 'công việc ổn định, ' : '') + 'mà vẫn lẻ bóng, liền "đẩy thuyền": đăng ký cho bạn tham gia một chương trình hẹn hò trên truyền hình.'; },
    opts: [
      { k: 'bmhh', l: 'Bạn muốn hẹn hò — bấm nút sau 2 phút trò chuyện', h: 'Gặp một người, nhẹ nhàng, nhanh gọn', ai: { w: 1.1 }, run: function (l, r, log) { l.pending.unshift(E.DEC.hh_bmhh.make(l, r)); } },
      { k: 'nali', l: function (l) { return l.sex === 'F' ? 'Người ấy là ai — làm nữ chính, chọn 1 trong 5 chàng trai' : 'Người ấy là ai — làm 1 trong 5 chàng trai, thuyết phục nữ chính'; }, h: function (l) { return l.sex === 'F' ? 'Coi chừng người đã có chủ hay người đồng tính trà trộn' : 'Ba vòng: giới thiệu, tài năng, thuyết phục'; }, req: function (l) { return l.orient !== 'gay'; }, ai: { w: 0.9 }, run: function (l, r, log) { if (l.sex === 'F') { var cs = [0, 1, 2, 3, 4].map(function (i) { return cand(l, r, i); }); for (var i = cs.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = cs[i]; cs[i] = cs[j]; cs[j] = t; } l.flags.nali = { cs: cs }; l.pending.unshift(E.DEC.hh_nali_f.make(l, r, { v: 1 })); } else { l.flags.nali = { lead: H.stranger(l, r, 'F'), leadAge: Math.max(20, l.age + U.randint(r, -5, 1)), leadJob: pick(r, ['tiếp viên hàng không', 'bác sĩ', 'giáo viên mầm non', 'chủ tiệm hoa', 'nhân viên ngân hàng', 'người mẫu ảnh']), score: 0, left: 5 }; l.pending.unshift(E.DEC.hh_nali_m.make(l, r, { v: 1 })); } } },
      { k: 'dtd', l: 'Đảo thiên đường — sống chung trên đảo với các bạn trẻ độc thân', h: 'Thử thách vận động, hẹn hò ở khu nghỉ dưỡng · lên sóng giờ vàng', req: function (l) { return l.age <= 35 && l.orient !== 'gay'; }, ai: { w: 0.8, risk: 0.4 }, run: function (l, r, log) { l.flags.dtd = { win: 0, picks: [person(l, r), person(l, r), person(l, r)] }; l.pending.unshift(E.DEC.hh_dtd.make(l, r, { v: 1 })); } },
      { k: 'khong', l: 'Thôi, ngại lên sóng lắm', ai: { w: 0.8 }, run: function (l, r, log) { log('Từ chối khéo, bạn bè tiếc hùi hụi.', 'neutral'); } }
    ]
  });
  E.TRIG.push({ id: 'hh_moi', when: function (l, a) { return free(l) && eligible(l); }, p: 0.04, cd: 5, max: 2 });
  A('show_hen_ho', 'Tình cảm', 'Đăng ký show hẹn hò trên truyền hình', { min: 20, max: 42, sc: 'hh_moi', avail: function (l) { return !isVN(l) ? 'Chỉ có ở Việt Nam' : l.partner ? 'Đang có người yêu' : eligible(l) ? true : 'Cần hồ sơ nổi bật hơn (học vấn, việc làm, giao tiếp)'; } });
  E.MAJOR && (E.MAJOR.hh_moi = 1);

  // ---------- Bạn muốn hẹn hò ----------
  SC('hh_bmhh', {
    title: 'Bạn muốn hẹn hò', prep: function (l, r) { return person(l, r); },
    text: function (l, d) { return 'Bạn ngồi sau hàng rào trái tim. Phía bên kia là một ' + word(d.s) + ' ' + d.age + ' tuổi, làm ' + d.job + '. Hai bạn giới thiệu bản thân, mẫu người lý tưởng; người thân của ' + (d.s === 'M' ? 'anh ấy' : 'cô ấy') + ' ở trường quay cũng góp vài câu. Rồi hàng rào mở ra, hai người có 2 phút trò chuyện trước khi quay lưng bấm nút.'; },
    opts: [
      { k: 'that', l: 'Trò chuyện thật lòng, kể về gia đình, ước mơ', ai: { w: 1.2 }, run: function (l, r, log, d) { press(l, r, log, d, 0.1); } },
      { k: 'hai', l: 'Pha trò cho cả trường quay cười', ai: { w: 1, soc: 0.8 }, run: function (l, r, log, d) { press(l, r, log, d, l.st.soc >= 60 ? 0.12 : -0.05); } },
      { k: 'khoe', l: 'Kể về thu nhập, nhà cửa, xe cộ', ai: { w: 0.4 }, run: function (l, r, log, d) { press(l, r, log, d, -0.15); } }
    ]
  });
  function press(l, r, log, d, b) {
    var they = ch(r, appeal(l) + b), you = true;
    l.fame = (l.fame || 0) + 3000;
    if (they) { log('Bạn muốn hẹn hò: đếm 3 tiếng, hai nửa trái tim cùng sáng! Cả trường quay vỡ òa, hai bạn nhận chuyến du lịch hẹn hò.', 'big'); fx(l, { hap: 10 }); H.mem(l, 'Khoảnh khắc hai nửa trái tim sáng lên trên sân khấu Bạn muốn hẹn hò.', 6); becomeCouple(l, r, log, d, 'chương trình Bạn muốn hẹn hò'); }
    else log('Bạn muốn hẹn hò: bạn bấm nút, nhưng ' + d.n + ' không bấm — ' + pick(r, ['"mình chưa thấy rung động".', '"mình không muốn yêu xa".', '"mình cần thêm thời gian".']) + ' Hai người vẫn vui vẻ làm bạn.', 'neutral');
  }

  // ---------- Người ấy là ai ----------
  // nữ: là "nữ chính", chọn 1 trong 5 chàng trai qua mini game; nam: là một trong 5 ứng viên, thuyết phục nữ chính chọn mình
  var STYLE = ['cao 1m80, vai rộng, phong cách lịch lãm với sơ mi trắng', 'da rám nắng, cơ bắp, mê thể thao', 'đeo kính, thư sinh, nói chuyện nhỏ nhẹ', 'tóc nhuộm, phong cách đường phố, đeo khuyên tai', 'mặc vest chỉn chu, giọng trầm ấm', 'cười rất duyên, má lúm đồng tiền', 'để râu nhẹ, phong cách bụi bặm, thích phượt'];
  var JOBS = ['kỹ sư phần mềm', 'bác sĩ nội trú', 'phi công', 'chủ chuỗi cà phê', 'giáo viên tiếng Anh', 'kiến trúc sư', 'huấn luyện viên thể hình', 'nhân viên ngân hàng', 'đầu bếp nhà hàng', 'nhiếp ảnh gia'];
  function cand(l, r, i) { return { n: H.stranger(l, r, 'M'), age: Math.max(21, l.age + U.randint(r, -2, 6)), st: STYLE[(i + Math.floor(r() * 7)) % STYLE.length], job: pick(r, JOBS), truth: ['single', 'single', 'taken', 'gay', 'single'][i], fit: r() }; }
  function truthText(c) { return c.truth === 'single' ? c.n + ' độc thân thật' : c.truth === 'taken' ? c.n + ' đã có người yêu — tham gia vì "thử thách" của chương trình' : c.n + ' là người đồng tính — tham gia để góp vui và chúc bạn tìm được người phù hợp'; }
  function hint(l, r, c) { var right = ch(r, 0.45 + l.st.kno / 250); var t = right ? c.truth : pick(r, ['single', 'taken', 'gay']); return t === 'single' ? 'cố vấn cho rằng ' + c.n + ' "nhìn ánh mắt là biết độc thân"' : t === 'taken' ? 'cố vấn nghi ' + c.n + ' "có vẻ đã có chủ"' : 'cố vấn đoán ' + c.n + ' "không hứng thú với con gái"'; }
  SC('hh_nali_f', {
    title: function (l, d) { return 'Người ấy là ai · ' + ['', 'Vòng 1: Ngoại hình & nghề nghiệp', 'Vòng 2: Tài năng', 'Vòng 3: Câu hỏi riêng', 'Chung cuộc: chọn người ấy'][d.v]; }, valid: function (l) { return !!l.flags.nali; },
    prep: function (l, r, a) { var N = l.flags.nali; return { v: (a && a.v) || 1, cs: N.cs, h: N.cs.map(function (c) { return hint(l, r, c); }) }; },
    text: function (l, d) {
      var intro = { 1: 'Bạn là "nữ chính". 5 chàng trai lần lượt bước ra — nhưng có người đã có người yêu, có người là người đồng tính trà trộn. Loại một người không phải "người ấy".', 2: 'Các chàng trai còn lại trình diễn tài năng: hát, nhảy, nấu ăn, chơi nhạc cụ. Ban cố vấn đưa ra nhận định. Loại thêm một người.', 3: 'Bạn được hỏi riêng mỗi người một câu. Loại thêm một người.', 4: 'Chỉ còn hai chàng trai. Chọn người ấy — rồi chương trình công bố sự thật.' }[d.v];
      return intro + ' ' + d.cs.map(function (c, i) { return c.n + ' (' + c.age + ' tuổi, ' + c.job + ', ' + c.st + ')' + (d.v >= 2 ? ' — ' + d.h[i] : ''); }).join('; ') + '.';
    },
    opts: [0, 1, 2, 3, 4].map(function (i) {
      return { k: 'c' + i, l: function (l, d) { var c = d.cs[i]; return c ? (d.v < 4 ? 'Loại ' : 'Chọn ') + c.n : ''; }, req: function (l, d) { return !!d.cs[i]; }, ai: { w: 1 },
        run: function (l, r, log, d) {
          var N = l.flags.nali, c = d.cs[i];
          if (d.v < 4) { N.cs = N.cs.filter(function (x) { return x !== c; }); log('Người ấy là ai, ' + ['', 'vòng 1', 'vòng 2', 'vòng 3'][d.v] + ': loại ' + c.n + '. Chương trình công bố: ' + truthText(c) + '.', c.truth === 'single' ? 'neutral' : 'good'); l.pending.unshift(E.DEC.hh_nali_f.make(l, r, { v: d.v + 1 })); return; }
          l.flags.nali = null; l.fame = (l.fame || 0) + 5000;
          log('Người ấy là ai — công bố sự thật: ' + truthText(c) + '.', c.truth === 'single' ? 'good' : 'bad');
          if (c.truth !== 'single') { fx(l, { hap: -4 }); log('Bạn chọn nhầm người, ra về tay trắng nhưng được khán giả khen "chơi đẹp".', 'neutral'); return; }
          if (c.fit + appeal(l) * 0.5 > 0.45) { log(c.n + ' bước ra tặng hoa: "Mình cũng chọn bạn." Hai bạn nắm tay rời sân khấu trong tiếng vỗ tay.', 'big'); fx(l, { hap: 10 }); H.mem(l, 'Đêm chọn đúng "người ấy" trên sân khấu truyền hình.', 6); becomeCouple(l, r, log, { n: c.n, s: 'M', age: c.age }, 'chương trình Người ấy là ai'); }
          else { log(c.n + ' độc thân thật, nhưng thẳng thắn nói hai người chưa hợp, chỉ muốn làm bạn.', 'neutral'); fx(l, { hap: -2 }); }
        } };
    })
  });
  SC('hh_nali_m', {
    title: function (l, d) { return 'Người ấy là ai · ' + ['', 'Vòng 1: Giới thiệu bản thân', 'Vòng 2: Tài năng', 'Vòng 3: Thuyết phục nữ chính', 'Chung cuộc'][d.v]; }, valid: function (l) { return !!l.flags.nali; },
    prep: function (l, r, a) { return { v: (a && a.v) || 1, n: l.flags.nali.lead }; },
    text: function (l, d) { var N = l.flags.nali; return { 1: 'Bạn là một trong 5 chàng trai. Nữ chính hôm nay là ' + d.n + ', ' + N.leadJob + '. Đoạn clip giới thiệu bạn sẽ thể hiện phong cách nào?', 2: 'Bạn còn trụ lại cùng ' + (N.left - 1) + ' chàng trai khác. Vòng tài năng: bạn sẽ trình diễn gì?', 3: 'Chỉ còn ' + N.left + ' người. Bạn có một phút nói chuyện riêng để thuyết phục ' + d.n + '.' }[d.v]; },
    opts: [
      { k: 'a', l: function (l, d) { return ['', 'Lịch lãm, chân thành: kể về công việc và gia đình', 'Trình diễn đúng sở trường của mình', 'Nói thật lòng: mình tìm một người để cùng xây tổ ấm'][d.v]; }, ai: { w: 1.2 }, run: function (l, r, log, d) { mstep(l, r, log, d, 0); } },
      { k: 'b', l: function (l, d) { return ['', 'Hài hước, tạo không khí vui cho trường quay', 'Hát một bản tình ca tặng nữ chính', 'Hứa hẹn: "Về với anh, em không phải lo gì cả"'][d.v]; }, ai: { w: 1 }, run: function (l, r, log, d) { mstep(l, r, log, d, 1); } },
      { k: 'c', l: function (l, d) { return ['', 'Khoe cơ bắp, phong cách "ngầu"', 'Nấu một món ăn ngay trên sân khấu', 'Hỏi ngược lại nữ chính về mẫu người lý tưởng'][d.v]; }, ai: { w: 0.8 }, run: function (l, r, log, d) { mstep(l, r, log, d, 2); } }
    ]
  });
  function mstep(l, r, log, d, k) {
    var N = l.flags.nali, b = [[0.15, 0.1, 0.02], [l.talent ? 0.2 : 0.05, (l.talent === 'âm nhạc' ? 0.2 : 0.04), (l.talent === 'khéo tay' || l.talent === 'kinh doanh' ? 0.15 : 0.07)], [0.18, -0.1, 0.12]][d.v - 1][k];
    N.score += b + appeal(l) * 0.3 + (r() - 0.5) * 0.3;
    var stay = N.score > 0.12 * d.v + 0.05;
    var txt = [['kể về công việc, gia đình — nữ chính gật gù', 'pha trò khiến cả trường quay cười nghiêng ngả', 'khoe cơ bắp, nữ chính cười nhưng có vẻ chưa ấn tượng'], ['trình diễn sở trường tự tin', 'hát bản tình ca, nữ chính đỏ mặt', 'nấu món ăn ngay trên sân khấu, thơm cả trường quay'], ['nói thật lòng về mong muốn có tổ ấm', 'hứa hẹn "không phải lo gì", nữ chính hơi chau mày', 'hỏi ngược lại khiến nữ chính bật cười, cuộc trò chuyện rất duyên']][d.v - 1][k];
    if (!stay) { l.flags.nali = null; l.fame = (l.fame || 0) + 3000; log('Người ấy là ai: bạn ' + txt + ', nhưng ' + d.n + ' quyết định dừng bạn ở vòng ' + d.v + '. Chương trình công bố: bạn độc thân thật — cả trường quay tiếc nuối.', 'neutral'); return; }
    log('Người ấy là ai, vòng ' + d.v + ': bạn ' + txt + ' — và được đi tiếp.', 'good');
    N.left = Math.max(2, N.left - 1);
    if (d.v < 3) { l.pending.unshift(E.DEC.hh_nali_m.make(l, r, { v: d.v + 1 })); return; }
    l.flags.nali = null; l.fame = (l.fame || 0) + 5000;
    if (N.score + r() * 0.3 > 0.55) { log('Chung cuộc: ' + d.n + ' chọn bạn! Chương trình công bố bạn độc thân thật — hai người nắm tay rời sân khấu.', 'big'); fx(l, { hap: 10 }); H.mem(l, 'Ngày được nữ chính chọn trên sân khấu Người ấy là ai.', 6); becomeCouple(l, r, log, { n: d.n, s: 'F', age: N.leadAge }, 'chương trình Người ấy là ai'); }
    else log('Chung cuộc: ' + d.n + ' chọn chàng trai còn lại. Bạn ôm hoa ra về, nhưng nhận về cả nghìn lời nhắn làm quen trên mạng.', 'neutral');
  }

  // ---------- Đảo thiên đường ----------
  SC('hh_dtd', {
    title: function (l, d) { return 'Đảo thiên đường · ' + ['', 'Ngày đầu trên đảo', 'Thử thách vận động', 'Hẹn hò ở "thiên đường"', 'Lựa chọn cuối cùng'][d.v]; }, valid: function (l) { return !!l.flags.dtd; },
    prep: function (l, r, a) { return { v: (a && a.v) || 1, ps: l.flags.dtd.picks }; },
    text: function (l, d) {
      var P = d.ps;
      return [, 'Bạn cùng 4 nam 5 nữ độc thân đặt chân lên một hòn đảo hoang sơ ở Phú Quốc. Không ai được tiết lộ nghề nghiệp, tuổi tác. Bạn chú ý ' + P[0].n + ' và ' + P[1].n + '.',
        'Thử thách vận động: chạy bộ, kéo co, bơi tiếp sức trên bãi biển. Người thắng được chọn một người để cùng sang khu nghỉ dưỡng "thiên đường" hẹn hò.',
        'Ở khu nghỉ dưỡng, hai người lần đầu được kể về công việc, gia đình của nhau. Ở lại đảo thì sống thiếu thốn, ra "thiên đường" thì có bữa tối sang trọng.',
        'Ngày cuối cùng: mỗi người chọn đối tượng mình quan tâm nhất. Chỉ khi cả hai chọn nhau, một cặp đôi mới thành hình.'][d.v];
    },
    opts: [
      { k: 'a', l: function (l, d) { return ['', 'Chủ động bắt chuyện với ' + d.ps[0].n, 'Dốc sức thắng thử thách', 'Kể thật về bản thân, kể cả những chuyện chưa hay', 'Chọn ' + d.ps[0].n][d.v]; }, ai: { w: 1.1 }, run: function (l, r, log, d) { step(l, r, log, d, 0); } },
      { k: 'b', l: function (l, d) { return ['', 'Để ý ' + d.ps[1].n + ' nhưng giữ khoảng cách', 'Thi cho vui, không cố', 'Giữ chút bí ẩn', 'Chọn ' + d.ps[1].n][d.v]; }, ai: { w: 0.9 }, run: function (l, r, log, d) { step(l, r, log, d, 1); } },
      { k: 'c', l: function (l, d) { return d.v === 4 ? 'Không chọn ai, ra về một mình' : 'Quan sát thêm'; }, ai: { w: 0.4 }, run: function (l, r, log, d) { step(l, r, log, d, 2); } }
    ]
  });
  function step(l, r, log, d, k) {
    var D = l.flags.dtd, P = D.picks;
    if (d.v === 1) { D.focus = k === 2 ? 0 : k; D.bond = k === 0 ? 0.2 : 0.1; log('Đảo thiên đường, ngày đầu: ' + (k === 0 ? 'bạn chủ động bắt chuyện với ' + P[0].n + ', hai người nói chuyện bên đống lửa đến khuya.' : 'bạn lặng lẽ quan sát mọi người, giữ năng lượng cho những ngày sau.'), 'neutral'); }
    else if (d.v === 2) { var w = ch(r, (k === 0 ? 0.45 : 0.15) + l.st.hea / 400); if (w) { D.win++; D.bond += 0.2; log('Thử thách trên bãi biển: bạn về nhất, chọn ' + P[D.focus].n + ' cùng sang khu nghỉ dưỡng hẹn hò.', 'good'); } else log('Thử thách: bạn thua, phải ở lại đảo ăn mì gói, nhìn người khác đi "thiên đường".', 'neutral'); }
    else if (d.v === 3) { D.bond += k === 0 ? 0.2 : 0.08; log(k === 0 ? 'Ở "thiên đường", bạn kể thật về gia đình, công việc. ' + P[D.focus].n + ' lặng nghe rồi bảo: "Mình thích sự thẳng thắn của bạn."' : 'Bạn giữ chút bí ẩn, buổi hẹn vui nhưng còn khoảng cách.', 'neutral'); }
    else {
      l.flags.dtd = null; l.fame = (l.fame || 0) + 4e4;
      if (k === 2) { log('Đảo thiên đường khép lại, bạn không chọn ai — ra về với một mùa hè đáng nhớ và nhiều người theo dõi trên mạng.', 'neutral'); return; }
      var c = P[k], match = ch(r, U.clamp((k === D.focus ? D.bond : 0.1) + appeal(l) * 0.5, 0.05, 0.9));
      if (match) { log('Lựa chọn cuối cùng trên Đảo thiên đường: bạn chọn ' + c.n + ' — và ' + (c.s === 'M' ? 'anh ấy' : 'cô ấy') + ' cũng chọn bạn! Một cặp đôi thành hình trước ống kính.', 'big'); fx(l, { hap: 12 }); H.mem(l, 'Ngày cuối trên Đảo thiên đường, hai người cùng chọn nhau.', 7); becomeCouple(l, r, log, c, 'chương trình Đảo thiên đường'); }
      else { log('Lựa chọn cuối cùng: bạn chọn ' + c.n + ', nhưng ' + (c.s === 'M' ? 'anh ấy' : 'cô ấy') + ' chọn người khác. Bạn mỉm cười chúc phúc, rời đảo một mình.', 'neutral'); fx(l, { hap: -5 }); }
      return;
    }
    l.pending.unshift(E.DEC.hh_dtd.make(l, r, { v: d.v + 1 }));
  }
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));

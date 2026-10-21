/* Một Đời — v6.6.0
   · xuất thân hoàng tộc ở các nước còn chế độ quân chủ: lễ nghi, báo chí soi mói, hôn nhân môn đăng hộ đối, công vụ hoàng gia,
     từ bỏ tước hiệu, kế vị ngai vàng
   · thêm nghề nghiên cứu, khoa học (kỹ sư R&D, kỹ sư hàng không vũ trụ, nghiên cứu y sinh, nông nghiệp công nghệ cao)
     và con đường nghiên cứu sinh, thạc sĩ, tiến sĩ, đề tài, hội thảo, công bố quốc tế
   · con đường chính trị: được quy hoạch, điều động, ứng cử đại biểu HĐND / Quốc hội (Việt Nam); tranh cử hội đồng thành phố (thế giới)
   · nhiều lựa chọn có thêm các kết quả khác nhau thay vì chỉ một câu cố định
   · thành tựu cuộc đời và gia phả nhiều thế hệ (dùng ở màn kết thúc) */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC;
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function free(l) { return !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped); }
  function vnMode(l) { return H.isVN(l) && l.mode === 'vn' && !(l.abroad && l.abroad.perm); }
  function jid(l) { return l.job ? E.resolveJob(l.job.id) : null; }
  function hashStr(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h | 0; }
  function setRank(l, rk) { l.job.rank = rk; l.job.rankTracked = rk; l.job.rankSince = l.age; }
  function T(id, when, p, cd, max, rep) { E.TRIG.push({ id: id, when: function (l, a) { return free(l) && when(l, a); }, p: p, cd: cd || 4, max: max || 1, rep: !!rep }); }

  // ===================================================================
  // 1. XUẤT THÂN HOÀNG TỘC
  // ===================================================================
  var MON = {
    GB: ['Quốc vương', 'Hoàng gia Anh', 1], JP: ['Thiên hoàng', 'Hoàng gia Nhật Bản', 0], TH: ['Quốc vương', 'Hoàng gia Thái Lan', 0], SA: ['Quốc vương', 'Hoàng gia Ả Rập Xê Út', 0],
    BN: ['Quốc vương', 'Hoàng gia Brunei', 0], MY: ['Quốc vương', 'Hoàng gia Malaysia', 0], ES: ['Quốc vương', 'Hoàng gia Tây Ban Nha', 1], NL: ['Quốc vương', 'Hoàng gia Hà Lan', 1],
    BE: ['Quốc vương', 'Hoàng gia Bỉ', 1], SE: ['Quốc vương', 'Hoàng gia Thụy Điển', 1], NO: ['Quốc vương', 'Hoàng gia Na Uy', 1], DK: ['Quốc vương', 'Hoàng gia Đan Mạch', 1],
    MA: ['Quốc vương', 'Hoàng gia Morocco', 0], JO: ['Quốc vương', 'Hoàng gia Jordan', 0], KW: ['Quốc vương', 'Hoàng gia Kuwait', 0], QA: ['Quốc vương', 'Hoàng gia Qatar', 0],
    AE: ['Quốc vương', 'Hoàng gia UAE', 0], OM: ['Quốc vương', 'Hoàng gia Oman', 0], BH: ['Quốc vương', 'Hoàng gia Bahrain', 0], BT: ['Quốc vương', 'Hoàng gia Bhutan', 0],
    KH: ['Quốc vương', 'Hoàng gia Campuchia', 0], LS: ['Quốc vương', 'Hoàng gia Lesotho', 0], SZ: ['Quốc vương', 'Hoàng gia Eswatini', 0], TO: ['Quốc vương', 'Hoàng gia Tonga', 0],
    MC: ['Thân vương', 'Vương thất Monaco', 0], LI: ['Thân vương', 'Vương thất Liechtenstein', 0], LU: ['Đại công tước', 'Đại công quốc Luxembourg', 1]
  }; // [tước hiệu người trị vì, tên hoàng tộc, phụ nữ được kế vị]
  E.MONARCHIES = MON;
  E.PARENT_PAY = E.PARENT_PAY || {};
  E.PARENT_PAY['quốc vương'] = 300; E.PARENT_PAY['thái tử'] = 150; E.PARENT_PAY['hoàng hậu'] = 150; E.PARENT_PAY['thái tử phi'] = 90; E.PARENT_PAY['hoàng thân'] = 70; E.PARENT_PAY['phu nhân hoàng thân'] = 40;
  function royal(l) { return l.flags && l.flags.royal || null; }
  function activeRoyal(l) { var x = royal(l); return x && !x.quit ? x : null; }
  function royalTitle(l) { var x = royal(l); if (!x) return ''; if (x.reign) return l.sex === 'F' ? 'Nữ hoàng' : (MON[x.c] ? MON[x.c][0] : 'Quốc vương'); if (x.quit) return 'cựu thành viên hoàng tộc'; return x.tier === 'direct' ? (l.sex === 'F' ? 'Công chúa' : 'Hoàng tử') : (l.sex === 'F' ? 'Quận chúa' : 'Thân vương'); }
  E.royalTitle = royalTitle;
  function setupRoyal(life, tier, fromParent) {
    var f = life.fam, m = MON[life.country];
    life.flags.royal = { tier: tier, c: life.country, house: m[1] };
    f.q = 5; f.vice = null; f.elite = null; f.home = tier === 'direct' ? 'cung điện' : 'dinh thự của gia tộc';
    if (!fromParent) {
      f.noDad = false; f.fAlive = true; f.mAlive = true;
      f.fJob = tier === 'direct' ? 'thái tử' : 'hoàng thân'; f.mJob = tier === 'direct' ? 'thái tử phi' : 'phu nhân hoàng thân';
      if (E.parentMonthly) { f.fInc = E.parentMonthly(life, f.fJob, null); f.mInc = E.parentMonthly(life, f.mJob, null); }
    }
    life.flags.famHardship = false; life.flags.famDebt = false;
  }
  var childOpts = E.childOpts;
  E.childOpts = function (l, k) {
    var o = childOpts.apply(this, arguments), x = royal(l);
    o.parent.pid = l.id;
    if (x && !x.quit) o.parent.royal = { tier: x.reign || x.tier === 'direct' ? 'direct' : 'branch', title: royalTitle(l) };
    return o;
  };
  var createLife = E.createLife;
  E.createLife = function (opts) {
    var life = createLife.apply(this, arguments), PA = opts && opts.parent;
    life.flags.birthQ = life.fam.q;
    if (PA && PA.pid) life.flags.parentLifeId = PA.pid;
    if (PA && PA.royal && MON[life.country]) {
      setupRoyal(life, PA.royal.tier, true);
      var side = PA.me && PA.me.sex === 'F' ? 'mJob' : 'fJob'; life.fam[side] = String(PA.royal.title || 'hoàng thân').toLowerCase();
    } else if (!PA && life.mode === 'world' && MON[life.country]) {
      var h = { rs: (life.rs ^ 0x51ab3e7) | 0 }, x = U.rand(h);
      if (x < 0.03) setupRoyal(life, U.rand(h) < 0.2 ? 'direct' : 'branch', false);
    }
    if (royal(life)) { life.flags.birthQ = 5; life.birthPlace = life.birthPlace; }
    return life;
  };
  E.HOOKS.year.unshift(function (l, r, log, a) {
    var x = royal(l); if (!x) return;
    if (a === 0) {
      log(x.tier === 'direct' ? 'Cả nước đón tin vui: ' + x.house + ' chào đón ' + royalTitle(l).toLowerCase() + ' mới. Tiếng chuông, tiếng pháo mừng vang trước cung điện, ảnh của bạn lên trang nhất mọi tờ báo.'
        : 'Bạn chào đời trong một nhánh của ' + x.house + '. Tên bạn được ghi vào gia phả hoàng tộc, nhưng chỉ đứng xa trong thứ tự kế vị.', 'big');
      H.mem(l, x.tier === 'direct' ? 'Ngày chào đời được cả nước chúc mừng.' : 'Được ghi tên vào gia phả hoàng tộc.', 3);
    }
    if (x.quit || a < 18) return;
    // ngân sách hoàng gia / quỹ gia tộc cho thành viên còn giữ tước hiệu
    var amt = l.base * (x.reign ? 12 : x.tier === 'direct' ? 5 : 1.2);
    H.cash(l, amt, x.reign ? 'Ngân sách hoàng gia' : 'Trợ cấp từ quỹ hoàng tộc');
    // kế vị: người trị vì qua đời, bạn là con trưởng trong nhánh chính
    var f = l.fam, ruler = /quốc vương|thiên hoàng|thân vương|đại công tước|nữ hoàng|thái tử/.test((f.fJob || '') + ' ' + (f.mJob || ''));
    if (x.tier === 'direct' && !x.reign && !x.passed && ruler && !f.fAlive && a >= 18) {
      var canF = MON[x.c] && MON[x.c][2];
      if ((E.hasOlderSib && E.hasOlderSib(l)) || (l.sex === 'F' && !canF)) { x.passed = true; log('Ngai vàng thuộc về ' + (l.sex === 'F' && !canF ? 'người anh em trai theo luật kế vị' : 'người anh chị trưởng') + '. Bạn đứng bên cạnh trong lễ đăng quang, giữ vai trò thành viên cao cấp của hoàng gia.', 'neutral'); }
      else { x.reign = true; x.reignAt = a; log('Lễ đăng quang. Bạn trở thành ' + royalTitle(l) + ' của ' + (MON[x.c] ? x.house.replace(/^Hoàng gia |^Vương thất |^Đại công quốc /, '') : 'đất nước') + '. Hàng vạn người đứng chật hai bên đường.', 'big'); H.mem(l, 'Ngày đăng quang, chiếc vương miện nặng hơn bạn tưởng.', 8); H.fx(l, { hap: 4 }); }
    }
  });
  SC('r_le_nghi', { title: 'Bài học lễ nghi cung đình', text: 'Mỗi sáng một giờ học lễ nghi: cách cúi chào, cách ngồi, cách vẫy tay trước đám đông, tên từng vị khách quốc tế.', opts: [
    { k: 'cham', l: 'Học nghiêm túc', ai: { w: 1.2 }, run: function (l, r, log) { log(pick(r, ['Bạn thuộc lòng mọi nghi thức. Lần đầu xuất hiện trước công chúng, bạn chào khách không sai một bước.', 'Thầy dạy lễ nghi khen bạn có phong thái bẩm sinh. Bạn tự hào mà cũng mệt nhoài.']), 'good'); H.fx(l, { soc: 2, kno: 1 }); } },
    { k: 'nghich', l: 'Lén trốn ra vườn chơi', ai: { risk: 1 }, run: function (l, r, log) { log(pick(r, ['Trốn ra vườn chơi với con chó săn của cung điện, bị bảo mẫu tìm thấy sau hai tiếng.', 'Trốn học, leo lên cây trong vườn thượng uyển. Ảnh bị đăng báo với tiêu đề "Tiểu hoàng tử nghịch ngợm".']), 'neutral'); H.fx(l, { hap: 3 }); } },
    { k: 'hoi', l: 'Hỏi vì sao phải sống khuôn phép như vậy', ai: { smart: 1 }, run: function (l, r, log) { log('Ông bà trả lời: "Vì người dân nhìn vào gia đình mình." Câu nói ấy theo bạn suốt đời.', 'neutral'); H.fx(l, { kno: 2 }); H.mem(l, '"Vì người dân nhìn vào gia đình mình."', 3); } }] });
  T('r_le_nghi', function (l, a) { return !!activeRoyal(l) && a >= 6 && a <= 12; }, 0.35);
  SC('r_bao_chi', { title: 'Ống kính săn ảnh', text: 'Ảnh bạn đi chơi với bạn bè bị chụp lén, lan khắp báo lá cải kèm những lời bình ác ý.', opts: [
    { k: 'im', l: 'Im lặng, để văn phòng hoàng gia xử lý', ai: { w: 1.2 }, run: function (l, r, log) { log(pick(r, ['Văn phòng hoàng gia ra thông cáo ngắn gọn. Tuần sau báo chí đã chuyển sang chuyện khác.', 'Bạn im lặng. Câu chuyện nguội dần, nhưng từ đó bạn ngại ra phố.']), 'neutral'); H.fx(l, { hap: -1 }); } },
    { k: 'len_tieng', l: 'Tự lên tiếng trên mạng xã hội', ai: { risk: 1 }, run: function (l, r, log) { if (ch(r, 0.5)) { log('Bài viết thẳng thắn về quyền riêng tư được hàng triệu người chia sẻ, nhiều người đứng về phía bạn.', 'good'); H.fx(l, { soc: 3, hap: 2 }); } else { log('Bài viết bị cắt xén, giật tít. Hoàng gia không hài lòng vì bạn phát ngôn tự ý.', 'bad'); H.fx(l, { hap: -3 }); } } },
    { k: 'tranh', l: 'Hạn chế ra ngoài', run: function (l, r, log) { log('Bạn ở trong cung nhiều hơn, đọc sách, học đàn. Cô đơn nhưng yên ổn.', 'neutral'); H.fx(l, { kno: 2, soc: -2 }); } }] });
  T('r_bao_chi', function (l, a) { return !!activeRoyal(l) && a >= 13 && a <= 30; }, 0.25, 6, 2);
  SC('r_hoc_van', { title: 'Con đường của người hoàng tộc', text: 'Tốt nghiệp trung học, gia đình bàn chuyện bạn sẽ đi tiếp con đường nào.', opts: [
    { k: 'quan_su', l: 'Vào học viện quân sự như truyền thống hoàng gia', ai: { w: 1 }, run: function (l, r, log) { log('Ba năm ở học viện quân sự: chạy bộ lúc 5 giờ sáng, ngủ doanh trại như mọi học viên khác. Bạn rắn rỏi và trầm tĩnh hơn hẳn.', 'good'); H.fx(l, { hea: 4, soc: 1 }); if (l.flags.royal) l.flags.royal.mil = true; } },
    { k: 'dai_hoc', l: 'Học đại học danh tiếng ở nước ngoài', ai: { smart: 1, w: 1 }, run: function (l, r, log) { log(pick(r, ['Bạn học ở một trường đại học cổ kính, có vệ sĩ đi theo nhưng vẫn được sống như một sinh viên bình thường.', 'Bạn học ngành lịch sử nghệ thuật, đêm đêm tranh luận cùng bạn bè quốc tế.']), 'good'); H.fx(l, { kno: 4 }); } },
    { k: 'thien_nguyen', l: 'Một năm làm tình nguyện ở vùng khó khăn', ai: { moral: 1 }, run: function (l, r, log) { log('Một năm dựng trường học, phát thuốc ở vùng xa. Lần đầu bạn thấy cuộc sống bên ngoài cung điện.', 'good'); H.fx(l, { karma: 5, hap: 2 }); H.mem(l, 'Năm tình nguyện ở vùng khó khăn, xa cung điện.', 4); } }] });
  T('r_hoc_van', function (l, a) { return !!activeRoyal(l) && a >= 17 && a <= 19; }, 0.9, 99);
  E.MAJOR.r_hoc_van = 1;
  SC('r_hon_nhan', { title: 'Hôn nhân của người hoàng tộc',
    prep: function (l, r) { var sx = H.partnerSex(l, r); return { n: H.stranger(l, r, sx), sex: sx, who: pick(r, ['con một gia đình quý tộc lâu đời', 'thành viên hoàng gia một nước láng giềng', 'con gái / con trai một gia tộc có thế lực']) }; },
    valid: function (l) { return !!activeRoyal(l) && !l.flags.royalMarry && !(l.partner && l.partner.status !== 'dating'); },
    text: function (l, d) { return 'Văn phòng hoàng gia giới thiệu ' + d.n + ' — ' + d.who + '. Mọi người đều nói đó là "mối lương duyên môn đăng hộ đối".' + (l.partner ? ' Nhưng bạn đang yêu ' + l.partner.name + ', một người bình thường.' : ''); },
    opts: [
      { k: 'yes', l: 'Đồng ý kết hôn theo sắp xếp', ai: { w: 1.1 }, run: function (l, r, log, d) { l.flags.royalMarry = true; if (l.partner) { log('Chia tay ' + l.partner.name + ' trong im lặng.', 'bad'); l.exes = (l.exes || 0) + 1; } l.partner = { name: d.n, sex: d.sex, age: l.age + U.randint(r, -2, 3), status: 'married', since: l.age, alive: true }; log('Hôn lễ hoàng gia được truyền hình trực tiếp, hàng triệu người theo dõi.', 'big'); H.mem(l, 'Hôn lễ hoàng gia với ' + d.n + '.', 6); } },
      { k: 'love', l: function (l) { return l.partner ? 'Xin được cưới người mình yêu' : 'Xin được tự tìm hiểu, tự yêu'; }, ai: { w: 0.9 }, run: function (l, r, log) { l.flags.royalMarry = true; if (ch(r, 0.55)) { log('Hoàng gia chấp thuận sau nhiều tháng cân nhắc. Báo chí gọi đó là "chuyện cổ tích thời hiện đại".', 'good'); H.fx(l, { hap: 4 }); if (l.partner) { l.partner.status = 'married'; l.partner.since = l.age; } } else { log('Hoàng gia không chấp thuận. Bạn phải chọn giữa tình yêu và tước hiệu — chuyện chưa có hồi kết.', 'bad'); H.fx(l, { hap: -4 }); l.flags.royalPressure = true; } } }
    ] });
  T('r_hon_nhan', function (l, a) { return !!activeRoyal(l) && a >= 22 && a <= 35 && !l.flags.royalMarry; }, 0.3, 4, 2);
  E.MAJOR.r_hon_nhan = 1;
  SC('r_cong_vu', { title: 'Công vụ hoàng gia', prep: function (l, r) { return { v: pick(r, ['khánh thành một bệnh viện nhi', 'thăm vùng vừa bị lũ lụt', 'đón tiếp một nguyên thủ nước ngoài', 'trao giải cho học sinh xuất sắc', 'bảo trợ một quỹ bảo tồn động vật hoang dã']) }; },
    text: function (l, d) { return 'Lịch công vụ tuần này: ' + d.v + '.'; },
    opts: [
      { k: 'tan_tam', l: 'Làm hết lòng, gặp gỡ từng người', ai: { moral: 1, w: 1.3 }, run: function (l, r, log, d) { log(pick(r, ['Bạn ở lại lâu hơn lịch trình, ngồi xuống trò chuyện với từng người. Hình ảnh ấy khiến nhiều người xúc động.', 'Một cụ bà nắm tay bạn không rời. Bạn hứa sẽ quay lại, và năm sau bạn quay lại thật.']), 'good'); H.fx(l, { karma: 3, hap: 2, soc: 1 }); } },
      { k: 'hinh_thuc', l: 'Làm đúng nghi thức rồi về', run: function (l, r, log) { log('Mọi việc diễn ra đúng kịch bản. Báo chí đưa tin ngắn gọn.', 'neutral'); } },
      { k: 'nho', l: 'Nhờ người khác đi thay', ai: { w: 0.5 }, run: function (l, r, log) { log('Bạn vắng mặt. Vài tờ báo bình luận thành viên hoàng gia "ngày càng xa dân".', 'bad'); H.fx(l, { hap: -1 }); } }] });
  T('r_cong_vu', function (l, a) { return !!activeRoyal(l) && a >= 22 && a <= 85; }, 0.3, 3, 1, true);
  SC('r_tu_bo', { title: 'Từ bỏ tước hiệu?', text: function (l) { return 'Áp lực báo chí, lịch công vụ dày đặc' + (l.flags.royalPressure ? ', chuyện tình cảm không được chấp thuận' : '') + '. Bạn tự hỏi có nên từ bỏ tước hiệu để sống như một người bình thường.'; }, opts: [
    { k: 'o_lai', l: 'Ở lại, gánh trách nhiệm của gia đình', ai: { w: 1.3 }, run: function (l, r, log) { log('Bạn chọn ở lại. Đêm ấy đứng trên ban công nhìn xuống quảng trường, bạn thấy mình đã trưởng thành.', 'neutral'); } },
    { k: 'tu_bo', l: 'Từ bỏ tước hiệu, tự lập', ai: { risk: 1, w: 0.4 }, run: function (l, r, log) { if (l.flags.royal) l.flags.royal.quit = true; log('Bạn tuyên bố từ bỏ tước hiệu, rời cung điện, tự đi làm kiếm sống. Báo chí xôn xao suốt mấy tháng.', 'big'); H.fx(l, { hap: 3 }); H.mem(l, 'Ngày từ bỏ tước hiệu để được sống là chính mình.', 7); if (l.flags.royalPressure && l.partner && l.partner.status === 'dating') { l.partner.status = 'married'; l.partner.since = l.age; log('Bạn cưới ' + l.partner.name + ' trong một lễ cưới nhỏ, chỉ vài người thân.', 'good'); } } }] });
  T('r_tu_bo', function (l, a) { var x = activeRoyal(l); return !!x && !x.reign && a >= 24 && a <= 45 && (l.flags.royalPressure || (l.mind && l.mind.stress > 50)); }, 0.35, 5, 1);
  E.MAJOR.r_tu_bo = 1;
  SC('r_tri_vi', { title: 'Việc của người trị vì', prep: function (l, r) { return { v: pick(r, ['bài phát biểu đầu năm gửi toàn dân', 'chuyến thăm cấp nhà nước tới một nước láng giềng', 'lễ kỷ niệm ngày quốc khánh', 'cuộc gặp thường kỳ với thủ tướng']) }; },
    valid: function (l) { var x = activeRoyal(l); return !!(x && x.reign); },
    text: function (l, d) { return 'Lịch của ' + royalTitle(l).toLowerCase() + ': ' + d.v + '. Mỗi lời nói của bạn đều được cả nước lắng nghe.'; },
    opts: [
      { k: 'doan_ket', l: 'Nói về đoàn kết, về những người khó khăn', ai: { moral: 1, w: 1.2 }, run: function (l, r, log) { log('Lời bạn nói được nhắc lại nhiều ngày sau. Uy tín của hoàng gia tăng lên.', 'good'); H.fx(l, { karma: 2, hap: 2 }); } },
      { k: 'truyen_thong', l: 'Giữ đúng truyền thống, nói ngắn gọn', run: function (l, r, log) { log('Mọi việc trang trọng và đúng nghi thức.', 'neutral'); } }] });
  T('r_tri_vi', function (l) { var x = activeRoyal(l); return !!(x && x.reign); }, 0.4, 2, 1, true);

  // ===================================================================
  // 2. NGHỀ NGHIÊN CỨU, KHOA HỌC
  // ===================================================================
  function addCar(id, t, vn, yrs, o) { if (E.CAR[id]) return; E.CAR[id] = { id: id, t: t, vn: vn, yrs: yrs, cat: o.cat || 'office', sec: o.sec || 'formal', edu: o.edu || 5, major: o.major, majors: o.majors, sigma: o.sigma || 0.12, fail: 0, w: o.w || 1, promo: o.promo, loss: o.loss, tag: o.tag }; }
  addCar('ky_su_rd', ['kỹ sư R&D', 'kỹ sư R&D cấp cao', 'trưởng nhóm R&D', 'giám đốc R&D'], [15, 26, 42, 80], [3, 4, 6], { major: 'it', w: 0.7 });
  addCar('ky_su_vu_tru', ['kỹ sư hàng không vũ trụ', 'kỹ sư vệ tinh chính', 'trưởng dự án vệ tinh'], [16, 30, 55], [4, 6], { edu: 6, major: 'it', w: 0.25 });
  addCar('nc_y_sinh', ['nghiên cứu viên y sinh', 'trưởng nhóm thử nghiệm lâm sàng', 'giám đốc trung tâm nghiên cứu y sinh'], [12, 24, 45], [4, 6], { edu: 6, major: 'med', w: 0.35 });
  addCar('nong_cnc', ['kỹ sư nông nghiệp công nghệ cao', 'chuyên gia giống cây trồng', 'viện trưởng viện nghiên cứu giống'], [10, 18, 32], [4, 6], { edu: 5, w: 0.4 });
  var SCI = /^(nghien_cuu|giang_vien|ky_su_rd|ky_su_vu_tru|nc_y_sinh|nong_cnc)$/;
  function scientist(l) { return !!l.job && SCI.test(jid(l)); }
  E.isScientist = scientist;
  SC('nc_moi', { title: 'Lời mời làm nghiên cứu', text: function (l) { return 'Thầy hướng dẫn khóa luận gọi bạn lại: "Em có tố chất làm khoa học. Ở lại phòng thí nghiệm làm trợ lý nghiên cứu, vừa làm vừa học thạc sĩ, rồi tiến sĩ nhé?" Lương không cao, đường dài.'; },
    valid: function (l) { return l.edu >= 5 && !scientist(l) && !l.flags.ncPath; },
    opts: [
      { k: 'nhan', l: 'Nhận lời, theo con đường nghiên cứu', ai: { smart: 1.2, w: 1 }, run: function (l, r, log) { l.flags.ncPath = { at: l.age }; E.startJob(l, 'nghien_cuu', r, log); log('Bạn bắt đầu những tháng ngày ở phòng thí nghiệm, đọc bài báo đến khuya.', 'good'); if (l.edu < 6) H.sched(l, 'nc_bao_ve', 2, { lv: 6 }); else if (l.edu < 7) H.sched(l, 'nc_bao_ve', 4, { lv: 7 }); } },
      { k: 'hoc_bong', l: 'Săn học bổng tiến sĩ ở nước ngoài', ai: { amb: 1, w: 0.7 }, run: function (l, r, log) { l.flags.ncPath = { at: l.age }; if (ch(r, Math.min(0.85, 0.25 + l.st.kno / 150))) { var dest = pick(r, [['JP','Nhật Bản','jp'],['DE','Đức','de'],['KR','Hàn Quốc','kr'],['AU','Úc','en'],['FR','Pháp','fr'],['US','Mỹ','en']]); log('Bạn giành được học bổng tiến sĩ toàn phần ở ' + dest[1] + '. Bốn năm học xa nhà bắt đầu.', 'big'); E.startResearchStudy(l, dest, r, log); H.mem(l, 'Ngày nhận thư báo học bổng tiến sĩ.', 5); } else { log('Hồ sơ trượt học bổng năm nay. Bạn quyết định đi làm trước, giữ giấc mơ nghiên cứu cho sau này.', 'neutral'); l.flags.ncPath = null; } } },
      { k: 'thoi', l: 'Cảm ơn thầy, đi làm doanh nghiệp', ai: { w: 1 }, run: function (l, r, log) { l.flags.ncPath = { no: true }; log('Bạn cảm ơn thầy, chọn đi làm để có thu nhập ổn định.', 'neutral'); } }] });
  T('nc_moi', function (l, a) { return a >= 21 && a <= 30 && l.edu >= 5 && l.st.kno >= 85 && !scientist(l) && !l.flags.ncPath && !l.school && !(l.flags.eliteFollow && !l.flags.eliteCut); }, 0.04, 4);
  E.MAJOR.nc_moi = 1;
  SC('nc_bao_ve', { title: function (l, d) { return d && d.lv === 7 ? 'Bảo vệ luận án tiến sĩ' : 'Bảo vệ luận văn thạc sĩ'; },
    valid: function (l, d) { return scientist(l) && !(d && d.lv && l.edu >= d.lv); },
    text: function (l, d) { return (d && d.lv === 7 ? 'Bốn năm nghiên cứu dồn vào một buổi sáng trước hội đồng chấm luận án.' : 'Hai năm vừa làm vừa học, giờ là buổi bảo vệ luận văn thạc sĩ.') + ' Bạn chuẩn bị thế nào?'; },
    opts: [
      { k: 'ky', l: 'Tập thuyết trình cả chục lần, chuẩn bị mọi câu hỏi', ai: { smart: 1, w: 1.2 }, run: function (l, r, log, d) { var lv = d && d.lv || 6; if (ch(r, 0.9)) { l.edu = Math.max(l.edu, lv); log(lv === 7 ? 'Hội đồng nhất trí thông qua. Từ hôm nay bạn là tiến sĩ. Bạn gọi điện cho bố mẹ, giọng run run.' : 'Bảo vệ thành công, nhận bằng thạc sĩ.', 'big'); H.mem(l, lv === 7 ? 'Ngày trở thành tiến sĩ.' : 'Ngày nhận bằng thạc sĩ.', lv === 7 ? 6 : 4); if (lv === 6) H.sched(l, 'nc_bao_ve', 4, { lv: 7 }); } else { log('Hội đồng yêu cầu sửa chữa lớn, hẹn bảo vệ lại năm sau.', 'bad'); H.sched(l, 'nc_bao_ve', 1, { lv: lv }); } } },
      { k: 'vua', l: 'Chuẩn bị vừa đủ, tin vào kết quả nghiên cứu', run: function (l, r, log, d) { var lv = d && d.lv || 6; if (ch(r, 0.7)) { l.edu = Math.max(l.edu, lv); log(lv === 7 ? 'Bạn trả lời được hầu hết câu hỏi phản biện, luận án được thông qua.' : 'Bảo vệ thành công dù có vài câu hỏi khó.', 'good'); if (lv === 6) H.sched(l, 'nc_bao_ve', 4, { lv: 7 }); } else { log('Một thành viên hội đồng chỉ ra lỗi trong phương pháp. Bạn phải làm lại một phần, bảo vệ lại năm sau.', 'bad'); H.sched(l, 'nc_bao_ve', 1, { lv: lv }); } } },
      { k: 'hoan', l: 'Xin lùi thêm một năm cho chắc', run: function (l, r, log, d) { log('Bạn xin lùi lịch bảo vệ thêm một năm.', 'neutral'); H.sched(l, 'nc_bao_ve', 1, d); } }] });
  E.MAJOR.nc_bao_ve = 1;
  SC('nc_de_tai', { title: 'Hồ sơ xin đề tài', text: function (l) { return 'Hạn nộp hồ sơ xin tài trợ từ ' + (vnMode(l) ? 'Quỹ Phát triển khoa học và công nghệ quốc gia (NAFOSTED)' : 'quỹ nghiên cứu quốc gia') + ' sắp hết. Một đề tài được duyệt có thể nuôi cả nhóm nghiên cứu ba năm.'; }, opts: [
    { k: 'thuc', l: 'Thức trắng hoàn thiện hồ sơ', ai: { amb: 1, w: 1.2 }, run: function (l, r, log) { if (ch(r, 0.35 + Math.min(0.35, l.st.kno / 300))) { var x = l.base * 0.6; H.cash(l, x, 'Thù lao chủ nhiệm đề tài'); log('Đề tài được duyệt! Bạn làm chủ nhiệm, có kinh phí mua thiết bị và nhận thêm hai nghiên cứu sinh.', 'good'); H.fx(l, { hap: 4 }); l.flags.ncPapers = (l.flags.ncPapers || 0) + 1; } else log(pick(r, ['Hồ sơ không được duyệt, nhận xét phản biện chỉ vỏn vẹn ba dòng. Bạn nộp lại vào đợt sau.', 'Đề tài trượt sát nút. Hội đồng khuyên mở rộng hợp tác quốc tế.']), 'neutral'); H.fx(l, { hea: -1 }); } },
    { k: 'hop_tac', l: 'Rủ nhóm nước ngoài cùng đứng tên', ai: { soc: 1 }, run: function (l, r, log) { if (ch(r, 0.55)) { log('Hợp tác quốc tế được đánh giá cao, đề tài được duyệt. Bạn có dịp sang lab đối tác làm việc ba tháng.', 'good'); H.fx(l, { kno: 3, soc: 2 }); l.flags.ncPapers = (l.flags.ncPapers || 0) + 1; } else log('Đối tác rút lui phút chót vì đổi hướng nghiên cứu. Hồ sơ không kịp nộp.', 'bad'); } },
    { k: 'bo', l: 'Năm nay không nộp', run: function (l, r, log) { log('Bạn tập trung viết bài cho đề tài đang làm.', 'neutral'); } }] });
  T('nc_de_tai', function (l) { return scientist(l); }, 0.3, 3, 1, true);
  SC('nc_bai_bao', { title: 'Phản biện số 2', text: 'Bài báo bạn gửi tạp chí quốc tế nhận về nhận xét dài bốn trang của "phản biện số 2", yêu cầu làm thêm cả loạt thí nghiệm.', opts: [
    { k: 'sua', l: 'Làm thêm thí nghiệm, sửa kỹ', ai: { smart: 1, w: 1.3 }, run: function (l, r, log) { if (ch(r, 0.7)) { log(pick(r, ['Ba tháng sau bài báo được chấp nhận đăng. Bạn in trang đầu ra dán lên tường phòng lab.', 'Bài được nhận đăng, còn được biên tập viên mời viết bài tổng quan.']), 'good'); l.flags.ncPapers = (l.flags.ncPapers || 0) + 1; H.fx(l, { hap: 3, kno: 2 }); } else log('Sửa xong vẫn bị từ chối. Bạn gửi sang tạp chí khác.', 'neutral'); } },
    { k: 'tap_chi_khac', l: 'Gửi sang tạp chí khác', run: function (l, r, log) { log(ch(r, 0.5) ? 'Tạp chí thứ hai nhận đăng sau một vòng sửa nhẹ.' : 'Tạp chí thứ hai cũng từ chối. Bài báo nằm trong ngăn kéo thêm một năm.', 'neutral'); } },
    { k: 'san_moi', l: 'Nộp phí đăng ở một "tạp chí" đăng nhanh không phản biện', ai: { bad: 1, w: 0.4 }, run: function (l, r, log) { H.cash(l, -l.base * 0.05, 'Phí đăng bài'); if (ch(r, 0.4)) { log('Tạp chí bị đưa vào danh sách "tạp chí săn mồi". Bài báo của bạn bị đồng nghiệp chỉ trích, hồ sơ xét chức danh bị trả lại.', 'bad'); H.fx(l, { karma: -3, hap: -3 }); } else log('Bài lên mạng sau một tuần. Không ai trích dẫn, bạn thấy hơi chột dạ.', 'neutral'); } }] });
  T('nc_bai_bao', function (l) { return scientist(l); }, 0.25, 3, 1, true);
  SC('nc_hoi_thao', { title: 'Hội thảo quốc tế', prep: function (l, r) { return { c: pick(r, ['Tokyo', 'Singapore', 'Berlin', 'Boston', 'Seoul', 'Paris', 'Sydney']) }; }, text: function (l, d) { return 'Bài của bạn được chọn trình bày ở hội thảo quốc tế tại ' + d.c + '.'; }, opts: [
    { k: 'di', l: 'Đi trình bày', ai: { soc: 1, w: 1.3 }, run: function (l, r, log, d) { log(pick(r, ['Trình bày bằng tiếng Anh trước ba trăm nhà khoa học, chân run nhưng giọng vững. Một giáo sư đầu ngành tới bắt tay bạn.', 'Bài trình bày được hỏi nhiều nhất phiên. Bạn quen được nhóm nghiên cứu ở ' + d.c + ', hẹn hợp tác.']), 'good'); H.fx(l, { soc: 3, kno: 2, hap: 2 }); H.mem(l, 'Trình bày ở hội thảo quốc tế tại ' + d.c + '.', 3); } },
    { k: 'online', l: 'Trình bày trực tuyến cho đỡ tốn', run: function (l, r, log) { log('Trình bày qua màn hình lúc 2 giờ sáng theo giờ địa phương. Mạng chập chờn nhưng xong việc.', 'neutral'); H.fx(l, { kno: 1 }); } }] });
  T('nc_hoi_thao', function (l) { return scientist(l); }, 0.2, 3, 1, true);
  SC('nc_moi_nuoc_ngoai', { title: 'Lời mời từ phòng thí nghiệm nước ngoài', text: 'Một phòng thí nghiệm danh tiếng mời bạn sang làm, lương gấp mấy lần, thiết bị hiện đại. Nhưng ở nhà còn nhóm nghiên cứu bạn gây dựng và những sinh viên đang theo bạn.', opts: [
    { k: 'o_lai', l: 'Ở lại, xây dựng nhóm trong nước', ai: { moral: 1, w: 1.1 }, run: function (l, r, log) { log('Bạn ở lại. Vài năm sau nhóm của bạn có những sinh viên đầu tiên đi bảo vệ tiến sĩ ở nước ngoài rồi trở về.', 'good'); H.fx(l, { karma: 3, hap: 1 }); } },
    { k: 'di_2_nam', l: 'Nhận lời hai năm rồi về', ai: { amb: 1 }, run: function (l, r, log) { H.cash(l, l.base * 1.5, 'Thu nhập làm nghiên cứu ở nước ngoài'); log('Hai năm làm việc ở nước ngoài, học được cách vận hành một phòng thí nghiệm lớn. Bạn về nước với nhiều ý tưởng mới.', 'good'); H.fx(l, { kno: 4 }); } }] });
  T('nc_moi_nuoc_ngoai', function (l, a) { return scientist(l) && vnMode(l) && a >= 30 && a <= 50 && (l.flags.ncPapers || 0) >= 2; }, 0.2, 6, 1);
  SC('nc_sinh_vien', { title: 'Sinh viên nghiên cứu khoa học', text: 'Nhóm sinh viên bạn hướng dẫn xin dự thi giải thưởng nghiên cứu khoa học. Các em nhiệt tình nhưng còn non tay.', opts: [
    { k: 'kem', l: 'Kèm từng buổi tối', ai: { moral: 1, w: 1.2 }, run: function (l, r, log) { if (ch(r, 0.45)) { log('Nhóm sinh viên đoạt giải nhất. Cô bé trưởng nhóm khóc khi nhận giải, nói lời cảm ơn bạn.', 'good'); H.fx(l, { hap: 4, karma: 2 }); H.mem(l, 'Nhìn học trò nhận giải nghiên cứu khoa học.', 3); } else log('Nhóm được giải khuyến khích. Các em hẹn năm sau làm tiếp.', 'good'); } },
    { k: 'tu_lam', l: 'Để các em tự làm', run: function (l, r, log) { log('Các em tự xoay xở, học được nhiều từ chính những lần sai.', 'neutral'); } }] });
  T('nc_sinh_vien', function (l) { return scientist(l) && /^(nghien_cuu|giang_vien)$/.test(jid(l)); }, 0.2, 4, 1, true);

  // ===================================================================
  // 3. CON ĐƯỜNG CHÍNH TRỊ
  // ===================================================================
  var STATE = /^(cong_chuc|vien_chuc|can_bo_xa|thue|hai_quan|kiem_toan|ngoai_giao|giao_vien|giang_vien|bac_si|cong_an|quan_doi|nghien_cuu)$/;
  SC('ct_quy_hoach', { title: 'Được quy hoạch cán bộ nguồn', text: 'Sau nhiều năm công tác, bạn được đưa vào diện quy hoạch, có thể được điều động sang khối Đảng, chính quyền cấp huyện / tỉnh. Việc nhiều, trách nhiệm lớn, ít thời gian cho gia đình.',
    valid: function (l) { return vnMode(l) && !!l.job && STATE.test(jid(l)) && !l.flags.ctPath; },
    opts: [
      { k: 'nhan', l: 'Nhận nhiệm vụ mới', ai: { amb: 1.2, w: 1 }, run: function (l, r, log) { l.flags.ctPath = { at: l.age }; var rk = l.job && l.job.rank >= 2 ? 1 : 0; E.startJob(l, 'chinh_tri', r, log); if (l.job) setRank(l, rk); log('Bạn nhận quyết định điều động: ' + E.jobTitle(l) + '. Học lớp lý luận chính trị cao cấp, đi cơ sở nhiều hơn ở nhà.', 'big'); H.mem(l, 'Ngày nhận quyết định điều động công tác.', 4); } },
      { k: 'chuyen_mon', l: 'Xin ở lại làm chuyên môn', ai: { w: 1 }, run: function (l, r, log) { l.flags.ctPath = { no: true }; log('Bạn xin ở lại với công việc chuyên môn mình yêu thích. Lãnh đạo tôn trọng nguyện vọng của bạn.', 'neutral'); } }] });
  T('ct_quy_hoach', function (l, a) { return vnMode(l) && a >= 32 && a <= 48 && !!l.job && STATE.test(jid(l)) && (l.job.rank || 0) >= 1 && l.edu >= 5 && (l.record || 0) === 0 && !l.flags.ctPath && !(l.flags.eliteFollow && !l.flags.eliteCut); }, 0.12, 5);
  E.MAJOR.ct_quy_hoach = 1;
  SC('ct_ung_cu', { title: function (l, d) { return d && d.qh ? 'Ứng cử đại biểu Quốc hội' : 'Ứng cử đại biểu Hội đồng nhân dân'; },
    prep: function (l) { return { qh: !!l.job && jid(l) === 'chinh_tri' && (l.job.rank || 0) >= 3 || !!l.flags.daiBieu }; },
    valid: function (l) { return vnMode(l) && !!l.job && !(l.flags.daiBieu && l.flags.daiBieu.until > l.age); },
    text: function (l, d) { return 'Cơ quan giới thiệu bạn ra ứng cử ' + (d.qh ? 'đại biểu Quốc hội' : 'đại biểu HĐND tỉnh') + '. Qua các vòng hiệp thương, bạn sẽ đi tiếp xúc cử tri, trình bày chương trình hành động.'; },
    opts: [
      { k: 'nhan', l: 'Nhận lời, chuẩn bị chương trình hành động thật kỹ', ai: { amb: 1, soc: 1, w: 1.1 }, run: function (l, r, log, d) { if (ch(r, 0.55 + Math.min(0.25, l.st.soc / 400))) { l.flags.daiBieu = { qh: d.qh, at: l.age, until: l.age + 5 }; log('Bạn trúng cử ' + (d.qh ? 'đại biểu Quốc hội' : 'đại biểu HĐND tỉnh') + ' nhiệm kỳ 5 năm. Cử tri quê nhà gửi gắm nhiều kiến nghị.', 'big'); H.mem(l, 'Ngày trúng cử ' + (d.qh ? 'đại biểu Quốc hội' : 'đại biểu HĐND') + '.', 5); H.fx(l, { hap: 3 }); } else log('Bạn không trúng cử lần này. Nhiều cử tri vẫn nhớ những gì bạn đã hứa.', 'neutral'); } },
      { k: 'tu_choi', l: 'Từ chối, tập trung công việc hiện tại', run: function (l, r, log) { log('Bạn cảm ơn và xin được tập trung cho công việc hiện tại.', 'neutral'); } }] });
  T('ct_ung_cu', function (l, a) { return vnMode(l) && a >= 35 && a <= 60 && !!l.job && (jid(l) === 'chinh_tri' || STATE.test(jid(l)) && (l.job.rank || 0) >= 2) && !(l.flags.daiBieu && l.flags.daiBieu.until > a) && (l.record || 0) === 0; }, 0.1, 5, 2);
  SC('ct_cu_tri', { title: 'Tiếp xúc cử tri', prep: function (l, r) { return { v: pick(r, ['đường vào xã mùa mưa lầy lội, xe cứu thương không vào được', 'giá điện, giá học phí tăng', 'trạm y tế xã thiếu bác sĩ', 'ô nhiễm từ một nhà máy gần khu dân cư', 'thủ tục đất đai kéo dài nhiều năm']) }; },
    valid: function (l) { return !!(l.flags.daiBieu && l.flags.daiBieu.until > l.age); },
    text: function (l, d) { return 'Buổi tiếp xúc cử tri, một cụ ông đứng lên nói về chuyện ' + d.v + '.'; },
    opts: [
      { k: 'theo', l: 'Ghi lại, theo đến cùng', ai: { moral: 1, w: 1.3 }, run: function (l, r, log) { if (ch(r, 0.55)) { log('Bạn chất vấn ở kỳ họp, kiến nghị được giải quyết. Lần sau về, cụ ông nắm tay bạn cảm ơn.', 'good'); H.fx(l, { karma: 4, hap: 3 }); } else log('Bạn gửi kiến nghị nhiều lần, việc vẫn chậm. Bạn tiếp tục đôn đốc.', 'neutral'); } },
      { k: 'chuyen', l: 'Chuyển kiến nghị đến cơ quan chức năng', run: function (l, r, log) { log('Kiến nghị được chuyển đi đúng quy trình.', 'neutral'); } }] });
  T('ct_cu_tri', function (l) { return !!(l.flags.daiBieu && l.flags.daiBieu.until > l.age); }, 0.4, 2, 1, true);
  SC('ct_tranh_cu', { title: 'Ra tranh cử', text: 'Bạn bè, hàng xóm khuyên bạn ra tranh cử ủy viên hội đồng thành phố. Phải tự gây quỹ, đi gõ cửa từng nhà, tranh luận trên truyền hình địa phương.', opts: [
    { k: 'ra', l: 'Ra tranh cử', ai: { amb: 1.2, soc: 1 }, run: function (l, r, log) { H.cash(l, -l.base * 0.3, 'Chi phí vận động tranh cử'); if (ch(r, 0.3 + Math.min(0.3, l.st.soc / 300))) { l.flags.ctPath = { at: l.age }; E.startJob(l, 'chinh_khach', r, log); if (l.job) setRank(l, 1); l.flags.reElect = l.age + 4; log('Bạn thắng cử! Từ nay là ' + E.jobTitle(l) + '.', 'big'); H.mem(l, 'Đêm kiểm phiếu, bạn thắng cử.', 6); } else { log(pick(r, ['Bạn thua sát nút. Nhưng tên bạn đã được nhiều người biết đến.', 'Chiến dịch không đủ tiền quảng bá, bạn thua cách biệt.']), 'neutral'); H.fx(l, { hap: -2 }); } } },
    { k: 'khong', l: 'Không, chính trị không hợp với mình', run: function (l, r, log) { log('Bạn quyết định đứng ngoài chính trường, chỉ đi bầu đầy đủ.', 'neutral'); l.flags.ctPath = { no: true }; } }] });
  T('ct_tranh_cu', function (l, a) { return !vnMode(l) && a >= 28 && a <= 58 && l.edu >= 5 && l.st.soc >= 55 && !l.flags.ctPath && !(l.job && jid(l) === 'chinh_khach'); }, 0.08, 6, 2);
  E.MAJOR.ct_tranh_cu = 1;
  E.HOOKS.year.unshift(function (l, r, log, a) {
    if (l.flags.reElect && a >= l.flags.reElect && l.job && jid(l) === 'chinh_khach') {
      if (ch(r, 0.65)) { l.flags.reElect = a + 4; log('Bạn tái đắc cử thêm một nhiệm kỳ.', 'good'); }
      else { l.flags.reElect = null; log('Bạn thất cử. Rời văn phòng với một thùng giấy tờ và nhiều kỷ niệm.', 'bad'); l.job = null; l.income = 0; l.flags.needJob = true; H.fx(l, { hap: -4 }); }
    }
  });

  // ===================================================================
  // 4. CÙNG MỘT LỰA CHỌN, NHIỀU KẾT QUẢ KHÁC NHAU
  // ===================================================================
  var VAR = {
    'Bạn chỉ kịp nhắn vài dòng hỏi han.': ['Bạn nhắn vội mấy dòng hỏi thăm, hứa khi nào rảnh sẽ gọi.', 'Bận quá, bạn chỉ gửi được tin nhắn động viên kèm cái sticker ôm.'],
    'Bảo con tự xoay xở, giữ lại tiền dưỡng già.': ['Bạn bảo con tự lo liệu, mình còn phải để dành tiền lúc ốm đau.', 'Bạn từ chối khéo: "Bố mẹ chỉ còn chút tiền dưỡng già, con cố tự xoay xở nhé."'],
    'Anh chị em mỗi người góp một phần lo cho bố mẹ.': ['Cả nhà họp mặt, chia nhau mỗi người một phần chăm lo cho bố mẹ.', 'Anh chị em lập một "quỹ bố mẹ", tháng nào cũng góp đều đặn.'],
    'Ôm quả bóng lăn khắp chiếu.': ['Ôm quả bóng lăn khắp chiếu — "Sau làm cầu thủ đây!"', 'Ôm chặt quả bóng không cho ai lấy, cả nhà cười ồ.'],
    'Cầm micro bi bô như đang hát.': ['Cầm micro bi bô, ông bà bảo sau thành ca sĩ.', 'Cầm micro gõ gõ vào miệng, rồi cười toe toét.'],
    'Tắt tivi đi học bài, sáng mai còn đi học sớm.': ['Tắt tivi, ôm cặp vào bàn học.', 'Xem nốt đoạn quảng cáo rồi tắt tivi, đi ngủ sớm.'],
    'Xóa đoạn chat, tập trung cho việc của mình.': ['Bạn xóa đoạn chat, tắt thông báo, quay lại việc đang làm.', 'Bạn không trả lời nữa. Mấy hôm sau thấy nhẹ lòng hẳn.'],
    'Lao vào làm việc từ sáng đến tối. Đến lúc dừng lại, nỗi buồn vẫn ở đó.': ['Bạn làm việc không nghỉ suốt mấy tháng. Đêm nào về nhà, nỗi nhớ vẫn đợi sẵn.', 'Công việc giúp bạn quên trong chốc lát, nhưng mỗi lần dừng tay, lòng lại trĩu nặng.'],
    'Đi gặp chuyên gia tâm lý vài buổi, học cách sống cùng nỗi nhớ.': ['Những buổi trò chuyện với chuyên gia tâm lý giúp bạn khóc được, rồi dần nhẹ lòng.', 'Bạn tham gia một nhóm hỗ trợ những người vừa mất người thân, thấy mình không đơn độc.'],
    'Nhận ra trò lừa "làm nhiệm vụ", chặn và cảnh báo bạn bè.': ['Đọc kỹ thì thấy ngay trò lừa "làm nhiệm vụ nhận hoa hồng". Bạn chặn và đăng bài cảnh báo.', 'Bạn chụp màn hình gửi nhóm lớp: "Lừa đảo đấy, đừng ai tin!"'],
    'Từ chối lời đề nghị, giữ tự chủ về tài chính và tình cảm.': ['Bạn từ chối, muốn tự đứng trên đôi chân mình.', 'Bạn cảm ơn nhưng từ chối. Tiền của mình thì tiêu mới thấy thoải mái.'],
    'Từ chối. Từ đó hai người ít liên lạc hẳn.': ['Bạn từ chối. Người kia im lặng, từ đó ít nhắn tin.', 'Bạn nói thật là không có tiền. Hai người vẫn chào nhau, nhưng không còn thân như trước.'],
    'Ngồi xem bóng, hò hét cùng cả xóm. Không cá độ đồng nào.': ['Cả xóm kéo ghế ra xem chung, hò hét đến khản cổ. Không cá độ đồng nào mà vui hơn ai hết.', 'Bạn xem bóng ở quán nước đầu ngõ, chỉ cược… một ly trà đá với ông bạn.'],
    'Kìm lòng, quyết định để dành.': ['Bạn bỏ món đồ khỏi giỏ hàng, chuyển số tiền đó vào sổ tiết kiệm.', 'Ngắm thêm mấy hôm rồi thôi. Hết tháng nhìn tài khoản, bạn mừng vì đã kìm lòng.'],
    'Từ chối chơi hụi.': ['Bạn từ chối chơi hụi, gửi ngân hàng cho chắc.', 'Bạn cười trừ: "Thôi em sợ vỡ hụi lắm chị ạ."'],
    'Mua bảo hiểm sức khỏe & tử kỳ. Mong là không bao giờ phải dùng đến.': ['Bạn ký hợp đồng bảo hiểm, đọc kỹ từng điều khoản loại trừ.', 'Mua bảo hiểm cho cả nhà, thấy yên tâm hơn mỗi lần đi xa.'],
    'Từ chối mua bảo hiểm, giữ mối quan hệ.': ['Bạn từ chối khéo, hẹn khi nào cần sẽ liên hệ.', 'Bạn mời người quen ly cà phê, nói thật là chưa có nhu cầu.'],
    'Anh chị em chia đều phần tài sản bố mẹ để lại, êm thấm.': ['Anh chị em ngồi lại chia đều, không ai to tiếng câu nào.', 'Mọi việc chia đều êm đẹp. Cả nhà giữ lại căn nhà cũ làm nơi thờ cúng bố mẹ.'],
    'Nhậu vui, gọi xe về an toàn. "Đã uống rượu bia, không lái xe."': ['Nhậu vui, để xe lại quán, gọi taxi về.', 'Uống vừa phải, nhờ người nhà ra đón. "Đã uống rượu bia, không lái xe."'],
    'Về nhà sớm ăn cơm cùng gia đình.': ['Bạn từ chối, về nhà kịp bữa cơm tối.', 'Bạn xin phép về sớm, tối ấy cả nhà xem phim cùng nhau.'],
    'Dừng lại chờ đèn đỏ. Muộn vài phút, nhưng an toàn.': ['Dừng đèn đỏ dù đường vắng. Muộn một chút, nhưng an toàn.', 'Bạn dừng lại, nhìn mấy xe vượt đèn mà lắc đầu.'],
    'Uống thuốc giảm đau cho qua.': ['Uống thuốc giảm đau, cắn răng chịu thêm mấy hôm.', 'Bạn súc nước muối, uống thuốc giảm đau, hẹn tháng sau đi nhổ.'],
    'Khóc suốt buổi sáng, đến trưa mới chịu ăn cơm.': ['Khóc suốt buổi sáng, cô giáo bế đi khắp sân mới nín.', 'Bám chặt cổng trường khóc gọi mẹ, đến chiều thấy mẹ đón mới cười.'],
    'Làm quen được người bạn đầu tiên ở lớp mẫu giáo.': ['Chia đồ chơi cho bạn ngồi cạnh, thế là có người bạn đầu tiên.', 'Về nhà kể tíu tít về "bạn thân" mới quen ở lớp.'],
    'Mách bố mẹ, cả hai cùng bị mắng.': ['Mách bố mẹ, rốt cuộc cả hai cùng bị phạt đứng góc nhà.', 'Mách bố mẹ, nhưng bố mẹ bảo cả hai đều có lỗi.'],
    'Gọi cấp cứu và hô hoán. Người bị nạn được cứu kịp.': ['Bạn gọi 115 và nhờ người xung quanh giúp. Xe cấp cứu đến kịp lúc.', 'Bạn hô hoán, mọi người xúm lại sơ cứu. Người bị nạn qua cơn nguy kịch.'],
    'Ở lại với nghề cũ.': ['Bạn ở lại với nghề cũ, chấp nhận chậm mà chắc.', 'Bạn thôi ý định chuyển nghề, tập trung làm tốt việc đang làm.'],
    'Ngày ba ca: trường, trung tâm, về nhà làm đề đến khuya.': ['Sáng ở trường, chiều ở trung tâm, tối làm đề đến 1 giờ sáng.', 'Lịch học kín mít, cuối tuần cũng đi học thêm.'],
    'Lập nhóm ôn thi với mấy đứa bạn thân, vừa học vừa cười.': ['Cả nhóm bạn thân hẹn nhau ôn thi ở thư viện, đứa giỏi môn nào giảng môn ấy.', 'Học nhóm qua video call mỗi tối, vừa học vừa trêu nhau.'],
    'Năm cuối cấp vẫn ung dung chơi bời.': ['Năm cuối cấp vẫn mải chơi game, đến gần thi mới cuống.', 'Bạn bảo "còn lâu mới thi", cả năm ung dung đi chơi với bạn.'],
    'Từ chối, chơi một mình leo rank chậm rì.': ['Bạn chơi một mình, leo rank chậm nhưng không phải nghe ai cằn nhằn.', 'Từ chối ghép đội, tối nào cũng leo rank một mình.'],
    'Ngồi dưới cổ vũ các bạn.': ['Bạn ngồi hàng đầu cổ vũ, vỗ tay đến đỏ cả tay.', 'Ngồi dưới quay video cho các bạn, đăng lên nhóm lớp.'],
    'Không nuôi. Thỉnh thoảng lại sang nhà hàng xóm nựng.': ['Không nuôi, nhưng hôm nào cũng ghé nhà hàng xóm chơi với chú chó.', 'Nhà không có điều kiện nuôi. Bạn dán ảnh chó mèo kín bàn học.'],
    'Gác năng khiếu lại, học đều các môn.': ['Bạn gác năng khiếu lại, chăm chỉ học đều các môn.', 'Bạn cất đồ nghề vào tủ, tự hứa sẽ quay lại khi có thời gian.'],
    'Cả hè ở quê với ông bà: tắm ao, câu cá, nướng khoai.': ['Cả hè ở quê: sáng theo ông ra đồng, chiều tắm ao, tối nằm võng nghe bà kể chuyện.', 'Một mùa hè đen nhẻm ở quê, học được cách bắt cua, câu cá.'],
    'Một mùa hè dán mắt vào màn hình.': ['Cả mùa hè xem hết mấy bộ phim, cày mấy tựa game.', 'Hè trôi qua bên màn hình điện thoại, đến khi nhập học mới tiếc.'],
    'Không đòi gì, chỉ ngoái nhìn món đồ chơi mãi.': ['Bạn không đòi, nhưng cứ ngoái lại nhìn món đồ chơi đến tận cổng chợ.', 'Bạn lặng lẽ nắm tay mẹ đi tiếp, mắt vẫn dán vào tủ kính.'],
    'Dứt khoát từ chối, chặn tin nhắn.': ['Bạn dứt khoát từ chối, chặn luôn số điện thoại.', 'Bạn trả lời thẳng: "Tôi đã có gia đình." Rồi chặn tin nhắn.'],
    'Ở lại thành phố gần con cháu. Thỉnh thoảng lại nhắc chuyện quê.': ['Ở lại thành phố trông cháu. Tối tối lại kể cho cháu nghe về quê nội.', 'Ở lại với con cháu, mỗi dịp giỗ chạp lại về quê một chuyến.'],
    'Không tham gia, cũng không bênh.': ['Bạn đứng ngoài, không hùa theo nhưng cũng không bênh.', 'Bạn lảng đi chỗ khác, trong lòng hơi áy náy.'],
    'Từ chối khéo, nhường dịp cho người khác.': ['Bạn từ chối khéo, nhường cơ hội cho đồng nghiệp.', 'Bạn bảo mình chưa sẵn sàng, để dịp khác.'],
    'Công việc kín lịch, việc học tiếng lại để sau.': ['Công việc bận rộn, lớp học tiếng lại hoãn thêm một khóa.', 'Bạn tải ứng dụng học tiếng, nhưng mới học được ba hôm.']
  };
  E.LOG_VARIANTS = VAR;
  Object.keys(E.DEC).forEach(function (id) {
    var D = E.DEC[id]; if (!D || !D.def || !D.apply) return;
    var ap = D.apply;
    D.apply = function (l, dec, k, r, log) {
      if (typeof log !== 'function' || typeof r !== 'function') return ap.apply(this, arguments);
      var wrapped = function (t, kind) { var v = typeof t === 'string' && VAR[t]; if (v) { var i = Math.floor(r() * (v.length + 1)); if (i > 0) t = v[i - 1]; } return log(t, kind); };
      return ap.call(this, l, dec, k, r, wrapped);
    };
  });

  // ===================================================================
  // 5. THÀNH TỰU CUỘC ĐỜI
  // ===================================================================
  function nw(l) { return E.netWorth(l) / (l.base || 1); }
  function titles(l) { return [l.peakTitle || '', l.job ? E.jobTitle(l) : ''].concat((l.jobsHist || []).map(function (h) { try { return E.jobLabel(h.id); } catch (e) { return ''; } })).join(' | '); }
  var ACH = [
    ['tho_100', '🎂', 'Bách niên giai lão', 'Sống tới 100 tuổi', function (l) { return l.death && l.death.age >= 100; }],
    ['tho_90', '🌳', 'Cửu tuần đại thọ', 'Sống tới 90 tuổi', function (l) { return l.death && l.death.age >= 90; }],
    ['ngheo_dai_gia', '🚀', 'Từ hai bàn tay trắng', 'Sinh ra trong nhà nghèo khó, cuối đời giàu có', function (l) { return (l.flags.birthQ || l.fam.q) <= 2 && nw(l) >= 150; }],
    ['dai_gia', '💰', 'Tiền nhiều để làm gì?', 'Tài sản cuối đời gấp 400 lần thu nhập năm bình thường', function (l) { return nw(l) >= 400; }],
    ['tien_si', '🎓', 'Tiến sĩ', 'Có học vị tiến sĩ', function (l) { return l.edu >= 7; }],
    ['giao_su', '📚', 'Giáo sư', 'Được phong giáo sư', function (l) { return titles(l).split(' | ').indexOf('giáo sư') >= 0; }],
    ['nha_khoa_hoc', '🔬', 'Kẻ khai phá tri thức', 'Có từ 5 công trình, đề tài nghiên cứu', function (l) { return (l.flags.ncPapers || 0) >= 5; }],
    ['dai_bieu', '🏛️', 'Đại biểu của dân', 'Trúng cử đại biểu Quốc hội / HĐND', function (l) { return !!l.flags.daiBieu; }],
    ['chinh_khach', '🗳️', 'Chính khách', 'Thắng một cuộc bầu cử', function (l) { return !!l.flags.reElect || /nghị sĩ|thị trưởng|bộ trưởng/.test(titles(l)); }],
    ['lanh_dao', '⭐', 'Một Bước Lên Quan', 'Giữ cương vị lãnh đạo cấp tỉnh / bộ trở lên', function (l) { return /bí thư tỉnh ủy|chủ tịch UBND tỉnh|ủy viên Trung ương|bộ trưởng|giám đốc sở|đại sứ/.test(titles(l)); }],
    ['hoang_toc', '👑', 'Sinh Ra Đã Ngậm Thìa Vàng', 'Sinh ra trong một gia đình hoàng tộc', function (l) { return !!royal(l); }],
    ['dang_quang', '🏰', 'Đăng quang', 'Lên ngôi trị vì', function (l) { return !!(royal(l) && royal(l).reign); }],
    ['tu_bo_tuoc', '🕊️', 'Sống là chính mình', 'Từ bỏ tước hiệu hoàng gia', function (l) { return !!(royal(l) && royal(l).quit); }],
    ['the_he_3', '🌱', 'Tam Đại Đồng Đường', 'Sống tới thế hệ thứ 3 của một gia đình', function (l) { return (l.gen || 1) >= 3; }],
    ['the_he_5', '🌲', 'Ngũ Đại Đồng Đường', 'Sống tới thế hệ thứ 5 của một gia đình', function (l) { return (l.gen || 1) >= 5; }],
    ['tu_dai', '👨‍👩‍👧‍👦', 'Tứ đại đồng đường', 'Có chắt khi còn sống', function (l) { return (l.ggrand || 0) > 0; }],
    ['dong_con', '🏡', 'Con Đàn Cháu Đống', 'Có từ 4 người con', function (l) { return (l.kids || []).length >= 4; }],
    ['chau_dan', '🧒', 'Phúc Lộc Đầy Nhà', 'Có từ 8 đứa cháu', function (l) { return (l.grand || 0) >= 8; }],
    ['ban_doi_50', '💍', 'Đám cưới vàng', 'Chung sống với người bạn đời 50 năm', function (l) { var p = l.partner; return !!(p && p.alive !== false && p.status !== 'dating' && p.since != null && (l.death ? l.death.age : l.age) - p.since >= 50); }],
    ['doc_than', '🌙', 'Một mình vẫn trọn vẹn', 'Không kết hôn mà vẫn sống tới 70 tuổi', function (l) { return !l.partner && !(l.exes > 0) && !(l.widowed > 0) && l.death && l.death.age >= 70; }],
    ['nguoi_tot', '😇', 'Tâm Sáng Giữa Đời', 'Sống tử tế, nhân cách rất cao', function (l) { return (l.karma || 0) >= 85; }],
    ['hoan_luong', '🌅', 'Quay Đầu Là Bờ', 'Từng vào tù, sau đó sống tử tế', function (l) { return (l.record || 0) > 0 && (l.karma || 0) >= 20; }],
    ['tu_thien', '🤲', 'Để lại cho đời', 'Di chúc để lại tài sản cho xã hội', function (l) { var w = l.flags.will70; return !!(w && (w.plan === 'charity' || w.shares && w.shares.s > 0)); }],
    ['xa_xu', '✈️', 'Xa xứ', 'Định cư ở nước ngoài', function (l) { return !!(l.abroad && l.abroad.perm); }],
    ['huy_chuong', '🏅', 'Nhà vô địch', 'Giành từ 3 huy chương', function (l) { return (l.medals || []).length >= 3; }],
    ['yeu_thu_cung', '🐾', 'Bạn của muôn loài', 'Nuôi từ 3 thú cưng trong đời', function (l) { return (l.pets || []).length >= 3; }],
    ['ban_be', '🤝', 'Không bao giờ cô đơn', 'Có từ 3 người bạn thân', function (l) { return (E.friendsOf ? E.friendsOf(l).length : 0) >= 3; }],
    ['vuot_kho', '💪', 'Vượt qua nghịch cảnh', 'Đời gặp vận đen mà vẫn sống tới 70 tuổi, không nợ nần', function (l) { return l.flags.hardLot === true && l.death && l.death.age >= 70 && E.netWorth(l) >= 0; }],
    ['song_tiep', '🔗', 'Tiếp nối', 'Sống tiếp cuộc đời của con mình', function (l) { return !!l.flags.parentLifeId || !!l.flags.heirFF; }],
    ['meo_nha', '🐈', 'Hoàng Thượng Không Rời Nửa Bước', 'Mang chú mèo trên cây về nuôi', function (l) { return !!l.flags.meoTheo; }]
  ];
  // thêm thành tựu (v6.6.0, đợt 2)
  function lg(l, re) { return (l.log || []).some(function (e) { return e && re.test(e.t); }); }
  function hist(l) { return l.jobsHist || []; }
  function avgHap(l) { var y = l.yrs || []; return y.length ? y.reduce(function (s, x) { return s + (x.hap || 0); }, 0) / y.length : 0; }
  function dAge(l) { return l.death ? l.death.age : l.age; }
  function married(l) { return !!(l.partner && l.partner.status !== 'dating') || (l.exes || 0) > 0 && lg(l, /đám cưới|kết hôn|Hôn lễ/) || (l.widowed || 0) > 0; }
  function kidsAlive(l) { return (l.kids || []).filter(function (k) { return k.alive !== false; }); }
  ACH.push(
    ['tho_80', '🍵', 'Thượng thọ', 'Sống tới 80 tuổi', function (l) { return dAge(l) >= 80; }],
    ['song_voi', '🕯️', 'Sống vội', 'Ra đi trước tuổi 30', function (l) { return l.death && l.death.age >= 6 && l.death.age < 30; }],
    ['ty_phu', '💎', 'Tỷ phú', 'Tài sản cuối đời gấp 2.000 lần thu nhập năm bình thường', function (l) { return nw(l) >= 2000; }],
    ['trang_tay', '🕳️', 'Nợ nần chồng chất', 'Ra đi khi tài sản ròng còn âm', function (l) { return dAge(l) >= 25 && E.netWorth(l) < 0; }],
    ['khong_no', '🧾', 'Không nợ ai đồng nào', 'Sống tới 60 tuổi, cuối đời không còn khoản vay nào', function (l) { return dAge(l) >= 60 && !(l.loans || []).some(function (x) { return x.bal > 0; }) && E.netWorth(l) > 0; }],
    ['an_cu', '🏠', 'An cư lạc nghiệp', 'Có nhà riêng, trả hết nợ mua nhà, sống tới 40 tuổi', function (l) { return !!l.ownHouse && !((l.mortgage || 0) > 0) && !(l.loans || []).some(function (x) { return x.type === 'home' && x.bal > 0; }) && dAge(l) >= 40; }],
    ['biet_thu', '🏯', 'Biệt thự', 'Sống trong biệt thự', function (l) { return /biệt thự/.test(l.houseType || ''); }],
    ['co_xe', '🚗', 'Có xe riêng', 'Sở hữu xe riêng', function (l) { return !!l.veh; }],
    ['nha_dau_tu', '📈', 'Tiền Đẻ Ra Tiền', 'Danh mục cổ phiếu gấp 20 lần thu nhập năm', function (l) { return (l.assets && l.assets.stock || 0) >= l.base * 20; }],
    ['tich_vang', '🪙', 'Tích vàng', 'Vàng tích trữ gấp 3 lần thu nhập năm', function (l) { return (l.assets && l.assets.gold || 0) >= l.base * 3; }],
    ['dia_chu', '🗺️', 'Địa chủ', 'Đất đai gấp 30 lần thu nhập năm', function (l) { return (l.assets && l.assets.land || 0) >= l.base * 30; }],
    ['trung_so', '🎰', 'Trúng số', 'Trúng giải xổ số lớn', function (l) { return !!l.flags.lottoWin; }],
    ['phu_ho', '🏦', 'Phá sản', 'Sinh ra trong nhà giàu nhất, cuối đời tay trắng', function (l) { return (l.flags.birthQ || 0) === 5 && dAge(l) >= 30 && nw(l) < 1; }],
    ['cu_nhan', '📜', 'Cử nhân', 'Tốt nghiệp đại học', function (l) { return l.edu >= 5; }],
    ['thac_si', '🎓', 'Thạc sĩ', 'Có học vị thạc sĩ', function (l) { return l.edu >= 6; }],
    ['vuot_kho_hoc', '📖', 'Có Công Mài Sắt', 'Sinh ra nhà nghèo khó mà tốt nghiệp đại học', function (l) { return (l.flags.birthQ || 5) <= 2 && l.edu >= 5; }],
    ['hoc_chuyen', '🧪', 'Con nhà người ta', 'Đỗ vào trường chuyên', function (l) { return !!(l.flags.study54 && l.flags.study54.special) || lg(l, /trúng tuyển (vào )?(trường|lớp) chuyên|đỗ (vào )?(trường|lớp) chuyên/i); }],
    ['uyen_bac', '🦉', 'Uyên bác', 'Học vị cao, kiến thức uyên thâm, có công trình nghiên cứu', function (l) { return l.edu >= 6 && (l.st && l.st.kno || 0) >= 99 && (l.flags.ncPapers || 0) >= 1; }],
    ['bo_hoc', '🎒', 'Trường đời', 'Không học hết cấp 2 mà vẫn sống tới 60', function (l) { return l.edu <= 1 && dAge(l) >= 60; }],
    ['bac_si', '🩺', 'Lương y', 'Làm bác sĩ', function (l) { return /bác sĩ/.test(titles(l)); }],
    ['phi_cong', '🛫', 'Chinh Phục Bầu Trời', 'Làm phi công', function (l) { return /phi công|cơ trưởng/.test(titles(l)); }],
    ['giao_vien', '🍎', 'Người lái đò', 'Làm thầy cô giáo', function (l) { return /giáo viên|giảng viên/.test(titles(l)); }],
    ['nguoi_linh', '🎖️', 'Người lính', 'Phục vụ trong quân đội hoặc công an', function (l) { return /quân đội|công an|sĩ quan|chiến sĩ|thiếu úy|đại úy|thiếu tá|đại tá|binh/.test(titles(l)) || !!(royal(l) && royal(l).mil); }],
    ['ceo', '🏢', 'Lãnh đạo thương trường', 'Làm tổng giám đốc / chủ tịch', function (l) { return /tổng giám đốc|chủ tịch tập đoàn|chủ tịch hội đồng quản trị/.test(titles(l)); }],
    ['ong_chu', '🧰', 'Ông chủ', 'Tự làm chủ cơ sở kinh doanh', function (l) { return /^chủ |chủ quán|chủ nhà hàng|chủ tiệm|chủ chuỗi|chủ xưởng|chủ doanh nghiệp/.test(titles(l)); }],
    ['nong_dan', '🌾', 'Một Nắng Hai Sương', 'Làm nông', function (l) { return /nông dân|làm nông|chủ trang trại|làm ruộng|làm nương|chăn nuôi/.test(titles(l)); }],
    ['nghe_si', '🎤', 'Người của công chúng', 'Trở nên nổi tiếng', function (l) { return (l.fame || 0) >= 100000; }],
    ['tuyen_thu', '🎮', 'Tuyển thủ', 'Thi đấu thể thao điện tử chuyên nghiệp', function (l) { return hist(l).some(function (h) { return /tuyen_thu_es/.test(h.id); }) || jid(l) === 'tuyen_thu_es'; }],
    ['nhieu_nghe', '🔄', 'Trăm nghề', 'Đổi nghề từ 6 lần', function (l) { return hist(l).length >= 6; }],
    ['mot_nghe', '🪵', 'Một đời một nghề', 'Làm một nghề duy nhất suốt hơn 30 năm', function (l) { return hist(l).length === 1 && (l.workYrs || 0) >= 30; }],
    ['luong_huu', '🧓', 'Tuổi Già An Nhàn', 'Nhận lương hưu', function (l) { return !!l.pensioned; }],
    ['dai_su', '🌐', 'Nhà ngoại giao', 'Làm đại sứ', function (l) { return /đại sứ/.test(titles(l)); }],
    ['nha_bao', '📰', 'Người cầm bút', 'Làm nhà báo, phóng viên', function (l) { return /phóng viên|nhà báo|biên tập/.test(titles(l)); }],
    ['ket_hon', '💒', 'Yên Bề Gia Thất', 'Kết hôn', function (l) { return married(l); }],
    ['tai_hon', '🌤️', 'Làm lại từ đầu', 'Chia tay rồi lại tìm được người bạn đời', function (l) { return (l.exes || 0) >= 1 && !!(l.partner && l.partner.status === 'married'); }],
    ['da_tinh', '💘', 'Đa tình', 'Trải qua từ 4 cuộc tình đã chia tay', function (l) { return (l.exes || 0) >= 4; }],
    ['thuong_nho', '🥀', 'Thương nhớ người xưa', 'Mất đi người bạn đời', function (l) { return (l.widowed || 0) > 0; }],
    ['con_mot', '👶', 'Con một', 'Chỉ có một người con', function (l) { return (l.kids || []).length === 1; }],
    ['tu_do', '🎈', 'Độc thân vui tính', 'Không có con, sống tới 60 tuổi', function (l) { return !(l.kids || []).length && dAge(l) >= 60; }],
    ['con_thanh_tai', '🏆', 'Con Hơn Cha, Nhà Có Phúc', 'Có người con tốt nghiệp đại học', function (l) { return (l.kids || []).some(function (k) { return (k.edu || 0) >= 5; }); }],
    ['nha_em_am', '🫶', 'Gia đình êm ấm', 'Mọi người con còn sống đều rất gần gũi với bạn', function (l) { var k = kidsAlive(l); return k.length >= 2 && k.every(function (x) { return (x.close || 0) >= 80; }); }],
    ['con_nuoi', '🤗', 'Nhận con nuôi', 'Nhận nuôi một đứa trẻ', function (l) { return (l.kids || []).some(function (k) { return k.adopted; }); }],
    ['ong_ba', '👵', 'Lên chức ông bà', 'Có cháu', function (l) { return (l.grand || 0) > 0; }],
    ['ban_tron_doi', '🫂', 'Tri Kỷ Một Đời', 'Giữ người bạn thân từ nhỏ đến năm 70 tuổi', function (l) { return !!(l.bff && l.bff.alive !== false && l.bff.since <= 12 && dAge(l) >= 70); }],
    ['hanh_phuc', '☀️', 'Một đời hạnh phúc', 'Hạnh phúc trung bình cả đời rất cao', function (l) { return dAge(l) >= 40 && avgHap(l) >= 72; }],
    ['cay_dang', '🌧️', 'Đời nhiều cay đắng', 'Hạnh phúc trung bình cả đời thấp', function (l) { return dAge(l) >= 40 && avgHap(l) < 50; }],
    ['tu_te', '🙂', 'Sống tử tế', 'Nhân cách tốt', function (l) { return (l.karma || 0) >= 40; }],
    ['phan_dien', '😈', 'Phản diện', 'Nhân cách rất tệ', function (l) { return (l.karma || 0) <= -40; }],
    ['tung_vao_tu', '⛓️', 'Ăn cơm nhà nước', 'Có tiền án', function (l) { return (l.record || 0) > 0; }],
    ['sa_nga', '🍾', 'Sa ngã', 'Từng nghiện rượu, cờ bạc hoặc ma túy', function (l) { var a = l.addict || {}; return !!(a.alcohol || a.gamble || a.drugs) || lg(l, /cai nghiện/); }],
    ['len_pho', '🌆', 'Lên phố lập nghiệp', 'Rời quê lên thành phố sống', function (l) { return !!l.movedTo; }],
    ['la_rung', '🍂', 'Lá rụng về cội', 'Về già trở về quê sống', function (l) { return lg(l, /Trở về quê, dựng lại căn nhà/); }],
    ['xkld', '🧳', 'Mưu sinh xứ người', 'Đi làm việc ở nước ngoài', function (l) { return lg(l, /xuất khẩu lao động/) || !!(l.abroad && !l.abroad.perm && !l.abroad.study); }],
    ['quoc_tich', '🛂', 'Công dân mới', 'Nhập quốc tịch nước khác', function (l) { return (l.flags.citizen || []).length > 0; }],
    ['fan_cung', '💖', 'Fan cứng', 'Có thần tượng để theo đuổi', function (l) { return !!l.idol; }],
    ['tien_tri_tien', '💵', 'Đúng lời tiên tri', 'Thôi nôi bốc tờ tiền, lớn lên giàu thật', function (l) { return lg(l, /Nắm chặt tờ tiền/) && nw(l) >= 100; }],
    ['tien_tri_ong_nghe', '🩻', 'Lời hứa với bà', 'Thôi nôi bốc ống nghe, lớn lên làm bác sĩ', function (l) { return lg(l, /Bốc ống nghe/) && /bác sĩ/.test(titles(l)); }],
    ['thu_20_nam', '✉️', 'Thư từ quá khứ', 'Đọc lại lá thư viết gửi chính mình 20 năm trước', function (l) { return lg(l, /lá thư (bạn viết|năm lớp|viết vội)/); }],
    ['nguoi_hung', '🦸', 'Người hùng thầm lặng', 'Cứu một người gặp nạn', function (l) { return lg(l, /Người bị nạn được cứu kịp|Xe cấp cứu đến kịp lúc|qua cơn nguy kịch/); }],
    ['chu_toan', '🖋️', 'Chu toàn', 'Viết di chúc trước khi ra đi', function (l) { return !!l.flags.will70; }],
    ['tu_tu', '🤝', 'Lá lành đùm lá rách', 'Ủng hộ, quyên góp từ thiện thời thơ ấu', function (l) { return lg(l, /Đập heo đất ủng hộ|Góp một nửa số tiền để dành|Gom cả thùng sách vở/); }],
    ['ca_si_nhi', '🎶', 'Ca sĩ nhí', 'Lên sân khấu hát khi còn nhỏ', function (l) { return lg(l, /Hát lạc tông nhưng cả hội trường/); }]
  );
  E.ACHIEVEMENTS = ACH.map(function (a) { return { id: a[0], icon: a[1], t: a[2], d: a[3] }; });
  E.addAchievements = function (list) { list.forEach(function (a) { if (ACH.some(function (x) { return x[0] === a[0]; })) return; ACH.push(a); E.ACHIEVEMENTS.push({ id: a[0], icon: a[1], t: a[2], d: a[3] }); }); };
  E.achievementsOf = function (l) { return ACH.filter(function (a) { try { return !!a[4](l); } catch (e) { return false; } }).map(function (a) { return { id: a[0], icon: a[1], t: a[2], d: a[3] }; }); };
  // ảnh thẻ / link chia sẻ có kèm thành tựu và danh hiệu
  if (E.share && E.share.summary) {
    var sum0 = E.share.summary;
    E.share.summary = function (l) { var s = sum0.apply(this, arguments); try { s.ach = E.achievementsOf(l).slice(0, 4).map(function (a) { return a.icon + ' ' + a.t; }); if (royal(l)) s.rt = royalTitle(l); } catch (e) { } return s; };
  }
  // gia phả: bản ghi gọn của một đời (app lưu trên thiết bị)
  E.treeRecord = function (l) {
    return { id: l.id, pid: l.flags.parentLifeId || null, n: l.name, x: l.sex, gen: l.gen || 1, y: l.birthYear + '–' + (l.death ? l.death.year : l.birthYear + l.age), a: l.death ? l.death.age : l.age,
      w: H.isVN(l) ? (l.provLabel || (l.prov && l.prov.old) || '') + ', Việt Nam' : l.countryName, j: (l.peakTitle || (l.job ? E.jobTitle(l) : '')), nw: l.indep ? E.fmtMoney(l, E.netWorth(l)) : '',
      rt: royal(l) ? royalTitle(l) : '', p: l.partner && l.partner.status !== 'dating' ? l.partner.name : '', k: (l.kids || []).map(function (k) { return { n: k.name, x: k.sex, alive: k.alive !== false }; }), at: Date.now() };
  };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));

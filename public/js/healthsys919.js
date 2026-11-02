/* Một Đời — MD4 D14 (8.10.22): hệ y tế và an sinh theo quốc gia, mở rộng E.medBill / E.bhytShare (life77) cho người sống ngoài
   Việt Nam. Người sống tại Việt Nam giữ nguyên quy tắc BHYT đã có (life77, welfare918).
   Luồng: giá gộp → phần chương trình chi trả → khấu trừ (deductible) → đồng chi trả → trần chi trả trong năm → người bệnh trả;
   kèm thời gian tiếp cận. Quyền lợi theo điều kiện cư trú/đóng góp/tuổi/thu nhập/visa, không theo quốc tịch đơn thuần; du khách
   không tự có quyền lợi của người thường trú. Bảo hiểm không làm tăng khả năng khỏi bệnh; tiền không mua miễn dịch.
   Số tiền là mức tham chiếu 2025 (nguồn thứ cấp, xem docs/MD4-SOURCES.md), quy đổi theo giá của game; các nước ngoài danh sách dùng
   nhóm thu nhập và ghi rõ "chưa đủ minh bạch". */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, W = G.W;
  if (!X || !E.medBill) return;
  function mo(l, v) { return H.money(l, v); }
  function usd(l, v) { return E.usdToLocal ? E.usdToLocal(l, v) : v / 4000 * l.base; }
  function res(l) { return H.resCode(l); }
  function vnHome(l) { return H.isVN(l) && !(l.abroad && l.abroad.perm) && res(l) === 'VN'; }
  function st(l) { var s = l.flags.health919; if (!s || typeof s !== 'object') s = l.flags.health919 = { v: 1, plan: null, y: null, paid: {} }; if (!s.paid || typeof s.paid !== 'object') s.paid = {}; return s; }
  // Tình trạng cư trú dùng để xét quyền lợi: công dân/thường trú · cư trú dài hạn có thẻ (học, lao động) · khách ngắn hạn.
  function status(l) { var c = res(l), cit = (E.GLOBAL919 ? E.GLOBAL919.citizenships(l) : [l.country]).indexOf(c) >= 0; if (cit || l.abroad && l.abroad.perm) return 'resident'; if (l.abroad && (l.abroad.visit907 || l.flags.homeVisit907)) return 'visitor'; if (l.abroad && (l.abroad.study || l.abroad.labor919 || l.job && l.job.id === 'xkld' || l.abroad.residence900)) return 'permit'; return l.abroad ? 'visitor' : 'resident'; }
  var NORDIC_CAP = { SE: 150, NO: 300, FI: 760, DK: 0 }; // trần tự trả ngoại trú/năm (USD, xấp xỉ); Đan Mạch: khám đa khoa, bệnh viện công không thu phí
  function policy(l) {
    var c = res(l), s = st(l), stt = status(l), age = l.age, inc = l.income || 0, low = inc < l.base * 0.6, plan = s.plan, b = W.BY[c], gdp = b ? b.gdp : 10;
    if (stt === 'visitor') return { name: 'Khách ngắn hạn — không thuộc hệ bảo hiểm nơi đến', share: 0, ded: 0, cap: null, wait: 'tùy cơ sở', note: 'Cấp cứu vẫn được xử trí nhưng tự trả (Anh thu 150% giá NHS với khách không đủ điều kiện).', ver: 'secondary' };
    switch (c) {
      case 'US': {
        if (age >= 65 && (l.workYrs || 0) >= 10 && stt === 'resident') return { name: 'Medicare (65+, đủ thời gian đóng thuế)', share: 0.8, ded: 260, cap: null, wait: 'vài ngày đến vài tuần', note: 'Medicare truyền thống: khấu trừ Part B rồi đồng chi trả 20%, không có trần; nhiều người mua thêm Medigap/Medicare Advantage.', ver: 'secondary' };
        if (low && stt === 'resident') return { name: 'Medicaid (thu nhập thấp, điều kiện theo bang)', share: 0.97, ded: 0, cap: 300, wait: 'tùy bang', note: 'Điều kiện thu nhập và người được hưởng khác nhau giữa các bang; không phải ai thu nhập thấp cũng tự đủ điều kiện.', ver: 'secondary' };
        if (l.job && l.job.id !== 'xkld' && !(E.isCrime && E.isCrime(l))) return { name: 'Bảo hiểm do chủ sử dụng lao động', share: 0.8, ded: 1800, cap: 9000, wait: 'vài ngày đến vài tuần', premium: 0.03, note: 'Khấu trừ và đồng chi trả theo gói; mạng lưới bệnh viện giới hạn.', ver: 'secondary' };
        if (plan === 'market') return { name: 'Gói bảo hiểm Marketplace (tự mua)', share: 0.7, ded: 3500, cap: 9200, wait: 'vài ngày đến vài tuần', premium: low ? 0.02 : 0.07, note: 'Phí có thể được trợ cấp theo thu nhập.', ver: 'secondary' };
        return { name: 'Chưa có bảo hiểm', share: 0, ded: 0, cap: null, wait: 'phòng cấp cứu không được từ chối bệnh nhân cấp cứu (EMTALA), nhưng hóa đơn tự trả', note: 'Có thể mua gói Marketplace.', ver: 'secondary' };
      }
      case 'GB': return { name: 'NHS (' + (stt === 'permit' ? 'đã đóng phụ phí y tế IHS khi xin visa' : 'cư trú thường xuyên') + ')', share: 1, ded: 0, cap: null, rx: 'Anh: thuốc kê đơn có phí cố định mỗi loại (Scotland, Wales, Bắc Ireland miễn); nha khoa theo mức, khám mắt có thu phí với người lớn', wait: plan === 'privateGB' ? 'vài tuần (bảo hiểm tư nhân)' : 'phẫu thuật không cấp cứu có thể chờ nhiều tháng', note: 'Quyền lợi theo cư trú, không theo quốc tịch.', ver: 'secondary' };
      case 'CA': return { name: 'Bảo hiểm y tế tỉnh bang', share: 1, ded: 0, cap: null, rx: 'Thuốc ngoại trú, nha khoa, mắt: một phần qua chương trình tỉnh/liên bang (ví dụ Canadian Dental Care Plan cho người đủ điều kiện), phần còn lại tự trả/bảo hiểm tư', wait: 'chuyên khoa/phẫu thuật chọn lọc thường chờ lâu; một số tỉnh có thời gian chờ đến 3 tháng mới có thẻ', note: stt === 'permit' ? 'Diện học/lao động: tùy tỉnh có hoặc không thuộc chương trình công.' : '', ver: 'secondary' };
      case 'AU': return { name: stt === 'resident' ? 'Medicare (công dân/thường trú)' : 'Bảo hiểm bắt buộc theo visa (OSHC/OVHC)', share: stt === 'resident' ? 0.85 : 0.75, ded: 0, cap: null, wait: plan === 'privateAU' ? 'ngắn hơn ở bệnh viện tư' : 'bệnh viện công miễn phí, phẫu thuật chọn lọc có danh sách chờ', premium: plan === 'privateAU' ? 0.025 : 0, note: 'Bác sĩ đa khoa có thể bulk-bill hoặc thu thêm; thuế Medicare 2%.', ver: 'secondary' };
      case 'CH': { var d = s.chDed || 300; return { name: 'Bảo hiểm y tế cơ bản bắt buộc (KVG), khấu trừ CHF ' + d, share: 0.9, ded: d * 1.1, cap: d * 1.1 + 770, wait: 'thường ngắn, không bảo đảm mọi ca', premium: (d >= 2500 ? 0.06 : d >= 1500 ? 0.075 : 0.09) * (low ? 0.5 : 1), note: 'Phí bảo hiểm tháng cao, có hỗ trợ phí cho người thu nhập thấp; đồng chi trả 10% tối đa CHF 700/năm.', ver: 'secondary' }; }
      case 'JP': { var cp = age < 6 ? 0.2 : age < 70 ? 0.3 : age < 75 ? 0.2 : 0.1; return { name: (l.job ? 'Bảo hiểm y tế nghề nghiệp' : 'Bảo hiểm y tế quốc dân (NHI)') + ' — bắt buộc với người cư trú trên 3 tháng', share: 1 - cp, ded: 0, cap: 1000, wait: 'thường ngắn; bệnh viện lớn đông', note: 'Tỷ lệ tự trả theo tuổi (người thu nhập cao trên 70 trả 30%); trần chi phí cao theo tháng.', ver: 'secondary' }; }
      case 'KR': return { name: 'Bảo hiểm Y tế Quốc gia (NHIS)' + (stt === 'permit' ? ' — người nước ngoài cư trú từ 6 tháng phải tham gia' : ''), share: 0.75, ded: 0, cap: 1500, wait: 'bệnh viện đại học lớn chờ lâu', note: 'Nội trú tự trả khoảng 20%; ngoại trú 30–60% tùy tuyến; khám sàng lọc định kỳ theo tuổi.', ver: 'secondary' };
      case 'CN': return { name: l.job ? 'Bảo hiểm y tế cơ bản cho người lao động đô thị' : 'Bảo hiểm y tế cơ bản cho cư dân', share: l.job ? 0.65 : 0.5, ded: 150, cap: null, wait: 'bệnh viện lớn quá tải', note: 'Trong danh mục mới được chi trả; khám ngoài nơi đăng ký cần đăng ký chuyển tuyến (备案), không thì mức hoàn thấp hơn. Mức hưởng tùy quỹ địa phương.', ver: 'secondary' };
      case 'SE': case 'NO': case 'FI': case 'DK': return { name: 'Hệ y tế công tài trợ bằng thuế', share: 0.95, ded: 0, cap: NORDIC_CAP[c], wait: 'chờ phẫu thuật chọn lọc theo bảo đảm của từng nước', note: 'Phí bệnh nhân và trần chi trả năm khác nhau giữa các nước Bắc Âu; không phải mọi dịch vụ đều miễn phí (nha khoa người lớn phần lớn tự trả).', ver: 'secondary' };
      case 'DE': case 'FR': case 'NL': case 'BE': case 'AT': return { name: 'Bảo hiểm y tế bắt buộc theo luật', share: 0.9, ded: c === 'NL' ? 420 : 0, cap: c === 'DE' ? 400 : null, wait: 'thường vừa phải', note: 'Đóng theo lương hoặc phí cố định; quy định chi tiết từng nước chưa đối chiếu nguyên văn.', ver: 'unverified' };
      case 'SG': return { name: stt === 'resident' ? 'MediSave/MediShield Life (công dân/thường trú)' : 'Bảo hiểm do chủ sử dụng/tự mua', share: stt === 'resident' ? 0.75 : 0.6, ded: stt === 'resident' ? 1500 : 500, cap: null, wait: 'ngắn ở bệnh viện tư, vừa ở bệnh viện công', note: 'Khấu trừ và đồng chi trả theo gói; trợ cấp chỉ cho công dân/thường trú.', ver: 'secondary' };
    }
    var share = gdp >= 30 ? 0.8 : gdp >= 10 ? 0.6 : gdp >= 4 ? 0.4 : 0.2;
    return { name: 'Bảo hiểm/chương trình y tế công (dữ liệu nước này chưa đủ minh bạch)', share: stt === 'permit' ? share * 0.8 : share, ded: 0, cap: null, wait: gdp >= 20 ? 'vừa phải' : 'có thể lâu, thiếu chuyên khoa', note: 'Tỷ lệ là tham số trò chơi theo mức thu nhập quốc gia.', ver: 'unverified' };
  }
  // Theo năm: số đã dùng vào khấu trừ và tổng tự trả để áp trần.
  function yr(l) { var s = st(l); if (!s.y || s.y.age !== l.age) s.y = { age: l.age, ded: 0, oop: 0, n: 0 }; return s.y; }
  function split(l, total) {
    var p = policy(l), y = yr(l), ded = usd(l, p.ded || 0), cap = p.cap == null ? null : usd(l, p.cap);
    var toDed = Math.min(total, Math.max(0, ded - y.ded)), rest = total - toDed, own = toDed + rest * (1 - p.share);
    if (cap != null) own = Math.min(own, Math.max(0, cap - y.oop));
    return { p: p, own: own, ins: total - own, toDed: toDed };
  }
  var share0 = E.bhytShare; E.bhytShare = function (l) { if (!l || !l.flags || vnHome(l) || !['vn', 'world'].includes(l.mode)) return share0.apply(this, arguments); return policy(l).share; };
  var bill0 = E.medBill;
  E.medBill = function (l, total, why, log, cover) {
    if (!l || !l.flags || vnHome(l) || !['vn', 'world'].includes(l.mode) || !(total > 0)) return bill0.apply(this, arguments);
    var c = cover == null ? 1 : cover, base = total * c, x = split(l, base), own = x.own + (total - base), y = yr(l);
    if (!l.indep && l.age < 18) { if (log) log('Gia đình lo viện phí ' + mo(l, total) + ' (' + x.p.name + ' chi trả ' + mo(l, x.ins) + ').', 'neutral'); y.ded += x.toDed; y.oop += x.own; return 0; }
    H.cash(l, -own, why); y.ded += x.toDed; y.oop += x.own; y.n++;
    if (log) log('Viện phí ' + mo(l, total) + ': ' + x.p.name + ' chi trả ' + mo(l, x.ins) + (x.toDed > 0 ? ', khấu trừ ' + mo(l, x.toDed) : '') + ', bạn trả ' + mo(l, own) + '. Thời gian tiếp cận: ' + x.p.wait + '.', 'neutral');
    return own;
  };
  var note0 = E.medNote; E.medNote = function (l, total, cover) { if (!l || vnHome(l) || !l.flags) return note0.apply(this, arguments); var x = split(l, total * (cover == null ? 1 : cover)); return ' · ' + x.p.name + ' trả ~' + mo(l, x.ins) + ', bạn trả ~' + mo(l, x.own + total * (1 - (cover == null ? 1 : cover))); };
  // Thiết bị, chăm sóc dài hạn, giảm nhẹ (care919): tỷ lệ chi trả theo nhóm dịch vụ.
  function cover(l, kind) {
    if (vnHome(l)) { var b = E.bhytShare ? share0(l) : 0; return kind === 'device' ? b * 0.5 : kind === 'ltc' ? 0 : kind === 'palliative' ? b : b; }
    var p = policy(l), c = res(l);
    if (kind === 'ltc') return /^(JP|SE|NO|FI|DK|NL|DE)$/.test(c) && p.share > 0 ? 0.6 : c === 'GB' ? 0.3 : 0.1;
    if (kind === 'palliative') return /^(GB|SE|NO|FI|DK|CA|AU)$/.test(c) ? 0.95 : c === 'US' && /Medicare|Medicaid/.test(p.name) ? 0.95 : p.share;
    if (kind === 'device') return c === 'GB' ? 0.9 : p.share * 0.7;
    return p.share;
  }
  // Phí bảo hiểm hằng năm (gói tự mua/được trợ cấp).
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive || !l.flags || vnHome(l) || !l.indep || !['vn', 'world'].includes(l.mode)) return; var s = st(l); if (s.premAt === l.age) return; s.premAt = l.age;
    var p = policy(l); if (p.premium > 0) H.cash(l, -l.base * p.premium, 'Phí bảo hiểm y tế: ' + p.name);
  });
  X.menu('health919', 'Bảo hiểm y tế nơi đang sống', function (l) { var r = X.reason(l, 16); if (r !== true) return r; return vnHome(l) ? 'Đang sống tại Việt Nam: xem mục BHYT' : true; }, function (l) {
    var p = policy(l), y = yr(l); return 'Nơi sống: ' + (W.BY[res(l)] ? W.BY[res(l)].name : res(l)) + ' · tình trạng: ' + { resident: 'công dân/thường trú', permit: 'cư trú có thẻ (học/lao động)', visitor: 'khách ngắn hạn' }[status(l)] + '.\nChương trình: ' + p.name + '. Chi trả ~' + Math.round(p.share * 100) + '%' + (p.ded ? ' sau khấu trừ ~' + mo(l, usd(l, p.ded)) + '/năm' : '') + (p.cap != null ? '; trần tự trả ~' + mo(l, usd(l, p.cap)) + '/năm' : '') + '. Tiếp cận: ' + p.wait + '.' + (p.rx ? '\n' + p.rx + '.' : '') + (p.note ? '\n' + p.note : '') +
      '\nNăm nay đã tự trả ' + mo(l, y.oop) + (p.ded ? ', đã dùng khấu trừ ' + mo(l, y.ded) : '') + '. Mức nguồn: ' + (p.ver === 'secondary' ? 'tham chiếu thứ cấp 2025' : 'chưa đủ minh bạch, tham số trò chơi') + '.';
  }, function (l) {
    var c = res(l), s = st(l), out = [];
    if (c === 'US') out.push({ k: 'market', l: (s.plan === 'market' ? '✓ ' : '') + 'Mua gói Marketplace', why: s.plan === 'market' ? 'Đang dùng' : true, run: function (l, r, log) { s.plan = 'market'; log('Đăng ký gói bảo hiểm Marketplace; phí đóng hằng năm.', 'neutral'); } });
    if (c === 'CH') [300, 1500, 2500].forEach(function (d) { out.push({ k: 'ded' + d, l: ((s.chDed || 300) === d ? '✓ ' : '') + 'Chọn khấu trừ CHF ' + d, h: d === 300 ? 'Phí tháng cao nhất' : 'Phí thấp hơn, tự trả nhiều hơn khi ốm', why: (s.chDed || 300) === d ? 'Đang dùng' : true, run: function () { s.chDed = d; } }); });
    if (c === 'AU' || c === 'GB') { var k = c === 'AU' ? 'privateAU' : 'privateGB'; out.push({ k: k, l: (s.plan === k ? 'Ngừng' : 'Mua') + ' bảo hiểm tư nhân bổ sung', h: 'Rút ngắn chờ đợi phẫu thuật chọn lọc; không thay đổi khả năng khỏi bệnh', run: function (l, r, log) { s.plan = s.plan === k ? null : k; log(s.plan ? 'Mua bảo hiểm tư nhân bổ sung.' : 'Ngừng bảo hiểm tư nhân.', 'neutral'); } }); }
    if (!out.length) out.push({ k: 'ok', l: 'Đã hiểu quyền lợi', run: function () { } });
    return out;
  }, 16, 'Sức khỏe');
  var mig = E.migrateExt; E.migrateExt = function (l) { if (mig) mig(l); if (l && l.flags && l.flags.health919 != null && typeof l.flags.health919 !== 'object') delete l.flags.health919; };
  E.HEALTH919 = { policy: policy, status: status, split: split, cover: cover, yr: yr, state: st };
})(globalThis.G);

/* Một Đời — 9.8.8: bối cảnh đời sống theo nước và năm, gắn với sự kiện có thật.
   Mở rộng các lớp bối cảnh sẵn có, không thay thế: era920 (số liệu theo năm), era920-pol (tình trạng chính trị), ctx945 (chiến tranh, nạn đói,
   dịch bệnh, thiên tai làm thay đổi sức khỏe, thu nhập, trường học) và hist920 (biến cố có lựa chọn). Lớp này lấp khoảng trống ở những năm
   "bình thường": thời kỳ phát triển của đất nước, nhịp sống thường ngày, và các sự kiện thật xảy ra trong năm.
   · G.BIRTH987.ERA[mã nước] = [[từ năm, đến năm, tên thời kỳ, đời sống thường ngày]]; EV[mã nước] = [[năm, sự kiện, mức 1|2, sắc thái]];
     WORLD = sự kiện thế giới lớn. Mức 2 là mốc nhiều người nhớ suốt đời. Sắc thái 'joy'/'grief' tác động nhẹ lên tâm trạng trong năm.
   · Lúc chào đời: một dòng kể đất nước đang ở thời kỳ nào và năm ấy có chuyện gì; được lưu vào ký ức và hồ sơ đời (flags.birth987).
   · Mỗi năm sau đó: sự kiện thật của nước đang sống được ghi vào nhật ký (trẻ dưới 5 tuổi chỉ nhận mốc lớn), đổi thời kỳ được báo một lần,
     mốc lớn khi đã đủ lớn để nhớ trở thành ký ức. Chuyển ra nước ngoài thì theo nước đang sống.
   · Không dùng rút ngẫu nhiên: cùng đời, cùng năm luôn ra cùng nội dung; không làm lệch các hệ thống khác.
   Nội dung là bối cảnh tham khảo từ nguồn thứ cấp (bách khoa và báo chí, đối chiếu 23/11/2026), không đánh giá đúng sai về phía nào. */
(function (G) {
  'use strict';
  var E = G.E, H = E && E.H; if (!E || !H || !E.HOOKS) return;
  var D = G.BIRTH987 || (G.BIRTH987 = { ERA: {}, EV: {}, WORLD: [] });
  function wy(l) { return l.birthYear + l.age; }
  function cc(l) { return (H.resCode ? H.resCode(l) : (l.abroad && l.abroad.code) || l.country) || l.country; }
  function name(code, y) { var P = E.ERA920 && E.ERA920.POL, n = P && P.nameAt ? P.nameAt(code, y) : null; return n || (G.W && G.W.BY[code] && G.W.BY[code].name) || code; }
  function eraAt(code, y) { var rows = D.ERA[code] || [], best = null; rows.forEach(function (r) { if (y >= r[0] && y <= r[1] && (!best || r[0] >= best[0])) best = r; }); return best; }
  function eventsAt(code, y) { return (D.EV[code] || []).filter(function (e) { return e[0] === y; }); }
  function worldAt(y, code) { var own = code ? eventsAt(code, y).map(function (e) { return e[1]; }).join(' | ') : ''; return (D.WORLD || []).filter(function (e) { return e[0] === y && !(own && e[3] && new RegExp(e[3], 'i').test(own)); }); }
  function st(l) { return l.flags.birth987 || null; }
  function phase(r) { var x = lower(r[2]); return /^(thời|giai đoạn|những|kỷ nguyên|cuối|buổi đầu)/i.test(x) ? 'đang ở ' + x : 'đang trong giai đoạn ' + x; }
  function lower(s) { return s; } // giữ nguyên chữ hoa: nhiều sự kiện, giai đoạn bắt đầu bằng tên riêng (Olympic, Hiệp định Paris, Mỹ…)
  function sentence(s) { s = String(s || '').trim(); return s && !/[.!?…]$/.test(s) ? s + '.' : s; }
  function eraKey(code, r) { return r ? code + ':' + r[0] + ':' + r[2] : code + ':none'; }
  function birthText(l) {
    var code = cc(l), y = l.birthYear, r = eraAt(code, y), ev = eventsAt(code, y).sort(function (a, b) { return (b[2] || 1) - (a[2] || 1); }).slice(0, 3), w = worldAt(y, code).filter(function (e) { return (e[2] || 1) >= 2; }).slice(0, 1);
    if (!r && !ev.length) return null;
    var P = E.ERA920 && E.ERA920.POL, pol = P && P.status ? P.status(code, y) : null, dupe = r && pol && /^(thuộc địa|lãnh thổ|.*(ủy trị|bảo hộ|thuộc Anh|thuộc Pháp|cai quản|quản lý))/i.test(r[2]); // tình trạng thuộc địa đã có dòng riêng
    var t = r && dupe ? 'Năm ' + y + ' ở ' + name(code, y) + ': ' + sentence(lower(r[3])) : 'Năm ' + y + ', ' + name(code, y) + (r ? ' ' + phase(r) + '. ' + sentence(r[3]) : '.');
    if (ev.length) t += ' Cũng trong năm bạn chào đời: ' + ev.map(function (e) { return lower(e[1]).replace(/\.$/, ''); }).join('; ') + '.';
    if (w.length) t += ' Trên thế giới: ' + lower(w[0][1]).replace(/\.$/, '') + '.';
    return { text: t, era: r, events: ev.map(function (e) { return e[1]; }), code: code };
  }
  function onBirth(l, log) {
    var b = birthText(l); l.flags.birth987 = { y: l.birthYear, cc: cc(l), era: b && b.era ? b.era[2] : null, key: eraKey(cc(l), b && b.era), events: b ? b.events : [], seen: {} };
    if (!b) return;
    log(b.text, 'info');
    H.mem(l, 'Năm bạn chào đời, ' + name(b.code, l.birthYear) + ' ' + (b.era ? phase(b.era) : 'đang qua nhiều đổi thay') + (b.events.length ? '; người lớn hay nhắc: ' + lower(b.events[0]).replace(/\.$/, '') : '') + '.', 2);
  }
  function yearly(l, r, log) {
    if (!l.alive || !['vn', 'world'].includes(l.mode)) return;
    var y = wy(l); if (y < 1900 || y > 2026) return;
    var s = st(l);
    if (!s) { if (l.age === 0) onBirth(l, log); else l.flags.birth987 = { y: l.birthYear, cc: cc(l), key: eraKey(cc(l), eraAt(cc(l), y)), events: [], seen: {}, late: true }; return; }
    if (s.at === l.age) return; s.at = l.age;
    var code = cc(l), r0 = eraAt(code, y), key = eraKey(code, r0);
    if (key !== s.key) {
      var moved = s.key.split(':')[0] !== code; s.key = key;
      if (r0) log(moved ? 'Nơi bạn đang sống, ' + name(code, y) + ', ' + phase(r0) + '. ' + sentence(r0[3]) : 'Năm ' + y + ', ' + name(code, y) + ' bước sang giai đoạn mới: ' + lower(r0[2]).replace(/^thời /, 'thời ') + '. ' + sentence(r0[3]), 'info');
    }
    var seen = s.seen || (s.seen = {}), mood = 0;
    eventsAt(code, y).concat(worldAt(y, code).map(function (e) { return [e[0], e[1], e[2], '', true]; })).forEach(function (e) {
      var id = (e[4] ? 'W' : code) + ':' + y + ':' + e[1].slice(0, 24), major = (e[2] || 1) >= 2;
      if (seen[id] || y === s.y && l.age === 0) return; // năm sinh đã kể trong dòng chào đời
      if (e[4] && !major) return;
      if (l.age < 5 && !major) return;
      seen[id] = 1;
      log((e[4] ? 'Thế giới năm ' : 'Năm ') + y + (e[4] ? ': ' : ' ở ' + name(code, y) + ': ') + sentence(e[1]) + (l.age < 5 ? ' Bạn còn quá nhỏ để nhớ, nhưng người lớn kể lại nhiều lần.' : ''), 'info');
      if (major && l.age >= 8) H.mem(l, 'Năm ' + y + (l.age < 18 ? ', khi bạn ' + l.age + ' tuổi' : '') + ': ' + lower(e[1]).replace(/\.$/, '') + '.', 2);
      if (l.age >= 6) mood += e[3] === 'joy' ? 1 : e[3] === 'grief' ? -1 : 0;
    });
    if (mood) H.fx(l, { hap: Math.max(-2, Math.min(2, mood)) });
  }
  E.HOOKS.year.push(yearly);
  E.BIRTH987 = { data: D, eraAt: eraAt, eventsAt: eventsAt, worldAt: worldAt, birthText: birthText, year: yearly, onBirth: onBirth };
})(globalThis.G);

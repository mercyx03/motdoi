/* Một Đời — 9.8.8/9.8.9: bối cảnh đời sống theo nước, vùng và năm, gắn với sự kiện có thật.
   Mở rộng các lớp bối cảnh sẵn có, không thay thế: era920 (số liệu theo năm), era920-pol (tình trạng chính trị), ctx945 (chiến tranh, nạn đói,
   dịch bệnh, thiên tai làm thay đổi sức khỏe, thu nhập, trường học) và hist920 (biến cố có lựa chọn). Lớp này lấp khoảng trống ở những năm
   "bình thường": thời kỳ phát triển của đất nước, nhịp sống thường ngày, và các sự kiện thật xảy ra trong năm.
   · G.BIRTH987.ERA[mã nước] = [[từ năm, đến năm, tên thời kỳ, đời sống thường ngày]]; EV[mã nước] = [[năm, sự kiện, mức 1|2, sắc thái]];
     WORLD = sự kiện thế giới lớn [năm, sự kiện, mức, từ khóa chống trùng]. Mức 2 là mốc nhiều người nhớ suốt đời. Sắc thái 'joy'/'grief' tác động nhẹ lên tâm trạng.
   · 9.8.9 theo vùng: REG[mã nước] = [[nơi, từ, đến, tên giai đoạn của vùng, đời sống]]; REV[mã nước] = [[năm, nơi, sự kiện, mức, sắc thái]].
     "Nơi" là danh sách tên thành phố trong game, tên tỉnh Việt Nam (cả tên cũ và tên sau sắp xếp) hoặc mã vùng Việt Nam dạng '@DBSCL'.
     Người chơi ở nơi nào thì nhận bối cảnh và sự kiện riêng của nơi đó, cộng với bối cảnh chung của cả nước.
   · 9.8.9 nhịp sống: năm 1990–2025 nào nước đang sống không có sự kiện, nhật ký ghi một chỉ số đời sống thật của năm đó (tuổi thọ, tử vong
     trẻ em, Internet, điện thoại di động, đô thị hóa) từ chuỗi số liệu Liên Hợp Quốc / Ngân hàng Thế giới sẵn có trong era920; ưu tiên các mốc
     vừa vượt ngưỡng (lần đầu quá nửa dân số dùng điện thoại...). Không bịa sự kiện cho nước nhỏ.
   · Lúc chào đời: một dòng kể đất nước và nơi sinh đang ở thời kỳ nào, năm ấy có chuyện gì; được lưu vào ký ức và hồ sơ đời (flags.birth987).
   · Mỗi năm sau đó: sự kiện thật của nước và vùng đang sống được ghi vào nhật ký (trẻ dưới 5 tuổi chỉ nhận mốc lớn), đổi thời kỳ được báo một lần,
     mốc lớn khi đã đủ lớn để nhớ trở thành ký ức. Chuyển nơi ở thì theo nơi mới.
   · Không dùng rút ngẫu nhiên: cùng đời, cùng năm luôn ra cùng nội dung; không làm lệch các hệ thống khác.
   Nội dung là bối cảnh tham khảo từ nguồn thứ cấp (bách khoa và báo chí, đối chiếu 23/11/2026), không đánh giá đúng sai về phía nào. */
(function (G) {
  'use strict';
  var E = G.E, H = E && E.H; if (!E || !H || !E.HOOKS) return;
  var D = G.BIRTH987 || (G.BIRTH987 = { ERA: {}, EV: {}, WORLD: [] }); D.REG = D.REG || {}; D.REV = D.REV || {};
  function wy(l) { return l.birthYear + l.age; }
  function cc(l) { return (H.resCode ? H.resCode(l) : (l.abroad && l.abroad.code) || l.country) || l.country; }
  function name(code, y) { var P = E.ERA920 && E.ERA920.POL, n = P && P.nameAt ? P.nameAt(code, y) : null; return n || (G.W && G.W.BY[code] && G.W.BY[code].name) || code; }
  function eraAt(code, y) { var rows = D.ERA[code] || [], best = null; rows.forEach(function (r) { if (y >= r[0] && y <= r[1] && (!best || r[0] >= best[0])) best = r; }); return best; }
  function eventsAt(code, y) { return (D.EV[code] || []).filter(function (e) { return e[0] === y; }); }
  // Nơi ở của nhân vật: thành phố, tỉnh (tên cũ/mới) và mã vùng Việt Nam.
  // y: năm đang xét. Tỉnh sau sắp xếp 2025 (p.neu) chỉ tính từ năm 2025; trước đó người chơi sống ở tỉnh cũ (Bà Rịa – Vũng Tàu chưa thuộc TP. Hồ Chí Minh).
  function places(l, code, y) {
    if (y == null) y = wy(l);
    var out = [], P = E.ERA920 && E.ERA920.POL, home = code === l.country && !(l.abroad && l.abroad.perm), p0 = l.prov, later = p0 && y < 2025 ? [p0.neu, p0.newName].filter(function (x) { return x && x !== p0.old && x !== p0.name; }) : [];
    var city = P && P.residentCity ? P.residentCity(l) : null; if (city) out.push(city);
    if (l.abroad && l.abroad.code === code && l.abroad.city) out.push(l.abroad.city);
    if (home) { [l.city, l.place, l.provLabel].forEach(function (x) { if (x) out.push(x); }); var p = l.prov; if (p) { [p.name, p.newName, p.old, p.neu, p.city].forEach(function (x) { if (x) out.push(x); }); if (p.region) out.push('@' + p.region); } }
    return out.filter(function (x, i) { return x && out.indexOf(x) === i && later.indexOf(x) < 0; });
  }
  function hit(keys, here) { return keys.some(function (k) { return here.indexOf(k) >= 0; }); }
  function where(keys, here) { var k = keys.find(function (k) { return here.indexOf(k) >= 0 && k.charAt(0) !== '@'; }); return k || null; }
  var VNREG = { DBSH: 'đồng bằng sông Hồng', MNPB: 'miền núi phía Bắc', BTB: 'Bắc Trung Bộ', NTB: 'Nam Trung Bộ', TN: 'Tây Nguyên', DNB: 'Đông Nam Bộ', DBSCL: 'đồng bằng sông Cửu Long' };
  function placeName(keys, here) { var k = where(keys, here); if (k) return k; var r = keys.find(function (k) { return k.charAt(0) === '@' && here.indexOf(k) >= 0; }); return r ? VNREG[r.slice(1)] || r.slice(1) : null; }
  // Ưu tiên dòng cụ thể nhất (ít nơi nhất), rồi dòng bắt đầu muộn nhất.
  function regAt(code, y, here) { var rows = (D.REG[code] || []).filter(function (r) { return y >= r[1] && y <= r[2] && hit(r[0], here); }); rows.sort(function (a, b) { return a[0].length - b[0].length || b[1] - a[1]; }); return rows[0] || null; }
  function regEventsAt(code, y, here) { return (D.REV[code] || []).filter(function (e) { return e[0] === y && hit(e[1], here); }); }
  // Bỏ phần sự kiện cả nước trùng với sự kiện vùng cùng năm (ví dụ "động đất Tứ Xuyên" khi đang sống ở Thành Đô).
  var STOP = { 'năm': 1, 'được': 1, 'trong': 1, 'những': 1, 'người': 1, 'thành': 1, 'trên': 1, 'nhiều': 1, 'cuộc': 1, 'của': 1, 'đầu': 1, 'tiên': 1, 'lớn': 1 };
  function words(t) { return String(t).toLowerCase().split(/[^\p{L}\d]+/u).filter(function (w) { return w.length >= 3 && !STOP[w]; }); }
  function trimNational(evs, regTexts) {
    if (!regTexts.length) return evs;
    var rw = regTexts.map(words);
    return evs.map(function (e) {
      var parts = String(e[1]).split(/;\s*/).filter(function (p) { var w = words(p); return !rw.some(function (r) { return w.filter(function (x) { return r.indexOf(x) >= 0; }).length >= 2; }); });
      return parts.length ? [e[0], parts.join('; '), e[2], e[3]] : null;
    }).filter(Boolean);
  }
  function worldAt(y, code, extra) { var own = code ? eventsAt(code, y).map(function (e) { return e[1]; }).concat(extra || []).join(' | ') : ''; return (D.WORLD || []).filter(function (e) { return e[0] === y && !(own && e[3] && new RegExp(e[3], 'i').test(own)); }); }
  function st(l) { return l.flags.birth987 || null; }
  function phase(r) { var x = lower(r[2]); return /^(thời|giai đoạn|những|kỷ nguyên|cuối|buổi đầu)/i.test(x) ? 'đang ở ' + x : 'đang trong giai đoạn ' + x; }
  function lower(s) { return s; } // giữ nguyên chữ hoa: nhiều sự kiện, giai đoạn bắt đầu bằng tên riêng (Olympic, Hiệp định Paris, Mỹ…)
  function sentence(s) { s = String(s || '').trim(); return s && !/[.!?…]$/.test(s) ? s + '.' : s; }
  function eraKey(code, r) { return r ? code + ':' + r[0] + ':' + r[2] : code + ':none'; }
  function regKey(code, r) { return r ? code + ':' + r[1] + ':' + r[3] : ''; }
  // ---- Nhịp sống theo số liệu thật (era920) ----
  function stat(code, y) { var X = E.ERA920; if (!X || !X.at || y < 1950) return null; var s = X.at(code, y); return s && s.year === y ? s : null; }
  function pct(v) { return Math.round(v) + '%'; }
  function snapshot(code, y) {
    var a = stat(code, y), b = stat(code, y - 1); if (!a) return null;
    var n = name(code, y), crossed = function (k, t) { return b && b[k] < t && a[k] >= t; };
    if (crossed('internet', 50)) return 'Năm ' + y + ', lần đầu hơn một nửa người dân ' + n + ' dùng Internet (khoảng ' + pct(a.internet) + ').';
    if (crossed('internet', 10)) return 'Năm ' + y + ', Internet bắt đầu phổ biến ở ' + n + ': khoảng ' + pct(a.internet) + ' người dân đã lên mạng.';
    if (crossed('mobile', 100)) return 'Năm ' + y + ', số thuê bao điện thoại di động ở ' + n + ' đã nhiều hơn số dân.';
    if (crossed('mobile', 50)) return 'Năm ' + y + ', cứ hai người dân ' + n + ' thì đã có khoảng một thuê bao điện thoại di động.';
    if (crossed('mobile', 10)) return 'Năm ' + y + ', điện thoại di động không còn là của hiếm ở ' + n + ': khoảng ' + Math.round(a.mobile) + ' thuê bao trên 100 dân.';
    if (crossed('urban', 50)) return 'Năm ' + y + ', lần đầu số người sống ở thành thị ' + n + ' vượt số người ở nông thôn.';
    var k = ((y % 5) + 5) % 5, e0 = a.e0, u5 = a.u5;
    if (k === 0 && Number.isFinite(e0)) return 'Năm ' + y + ' ở ' + n + ': tuổi thọ trung bình khoảng ' + Math.round(e0) + ' tuổi' + (b && Number.isFinite(b.e0) ? (e0 - b.e0 >= 0.3 ? ', tiếp tục tăng' : e0 - b.e0 <= -0.3 ? ', giảm so với năm trước' : ', gần như không đổi') : '') + '.';
    if (k === 1 && Number.isFinite(u5)) return 'Năm ' + y + ' ở ' + n + ': cứ 1.000 trẻ sinh ra có khoảng ' + Math.round(u5) + ' em không qua khỏi 5 tuổi' + (u5 < 10 ? ', thuộc nhóm thấp trên thế giới' : u5 > 100 ? ', vẫn ở mức rất cao' : '') + '.';
    if (k === 2 && Number.isFinite(a.internet)) return 'Năm ' + y + ' ở ' + n + ': ' + (a.internet < 1 ? 'Internet gần như chưa có ở đời sống thường ngày.' : 'khoảng ' + pct(a.internet) + ' người dân dùng Internet.');
    if (k === 3 && Number.isFinite(a.mobile)) return 'Năm ' + y + ' ở ' + n + ': ' + (a.mobile < 1 ? 'điện thoại di động còn rất hiếm, liên lạc chủ yếu qua điện thoại bàn, thư từ.' : 'khoảng ' + Math.round(a.mobile) + ' thuê bao di động trên 100 dân.');
    if (Number.isFinite(a.urban)) return 'Năm ' + y + ' ở ' + n + ': khoảng ' + pct(a.urban) + ' dân số sống ở thành thị.';
    return null;
  }
  function birthText(l) {
    var code = cc(l), y = l.birthYear, here = places(l, code, y), r = eraAt(code, y), rg = regAt(code, y, here), rev = regEventsAt(code, y, here);
    var ev = trimNational(eventsAt(code, y), rev.map(function (e) { return e[2]; })).sort(function (a, b) { return (b[2] || 1) - (a[2] || 1); }).slice(0, 3), w = worldAt(y, code, rev.map(function (e) { return e[2]; })).filter(function (e) { return (e[2] || 1) >= 2; }).slice(0, 1);
    if (!r && !ev.length && !rg) return null;
    var P = E.ERA920 && E.ERA920.POL, pol = P && P.status ? P.status(code, y) : null, dupe = r && pol && /^(thuộc địa|lãnh thổ|.*(ủy trị|bảo hộ|thuộc Anh|thuộc Pháp|cai quản|quản lý))/i.test(r[2]); // tình trạng thuộc địa đã có dòng riêng
    var t = r && dupe ? 'Năm ' + y + ' ở ' + name(code, y) + ': ' + sentence(lower(r[3])) : 'Năm ' + y + ', ' + name(code, y) + (r ? ' ' + phase(r) + '. ' + sentence(r[3]) : '.');
    if (rg) t += ' Riêng ở ' + placeName(rg[0], here) + ': ' + lower(rg[3]) + ' — ' + sentence(rg[4]);
    var all = rev.map(function (e) { return (placeName(e[1], here) ? 'ở ' + placeName(e[1], here) + ', ' : '') + e[2]; }).concat(ev.map(function (e) { return e[1]; })).slice(0, 4);
    if (all.length) t += ' Cũng trong năm bạn chào đời: ' + all.map(function (e) { return lower(e).replace(/\.$/, ''); }).join('; ') + '.';
    if (w.length) t += ' Trên thế giới: ' + lower(w[0][1]).replace(/\.$/, '') + '.';
    var s = stat(code, y); if (s && Number.isFinite(s.e0) && Number.isFinite(s.u5)) t += ' Thời ấy tuổi thọ trung bình ở đây khoảng ' + Math.round(s.e0) + ' tuổi, cứ 1.000 trẻ sinh ra có khoảng ' + Math.round(s.u5) + ' em mất trước 5 tuổi.';
    return { text: t, era: r, reg: rg, events: all, code: code };
  }
  function onBirth(l, log) {
    var code = cc(l), b = birthText(l), here = places(l, code, l.birthYear);
    l.flags.birth987 = { y: l.birthYear, cc: code, era: b && b.era ? b.era[2] : null, key: eraKey(code, b && b.era), rkey: regKey(code, b && b.reg), events: b ? b.events : [], seen: {} };
    if (!b) return;
    log(b.text, 'info');
    H.mem(l, 'Năm bạn chào đời, ' + name(b.code, l.birthYear) + ' ' + (b.era ? phase(b.era) : 'đang qua nhiều đổi thay') + (b.events.length ? '; người lớn hay nhắc: ' + lower(b.events[0]).replace(/\.$/, '') : '') + '.', 2);
  }
  function yearly(l, r, log) {
    if (!l.alive || !['vn', 'world'].includes(l.mode)) return;
    var y = wy(l); if (y < 1900 || y > 2026) return;
    var s = st(l);
    if (!s) { if (l.age === 0) onBirth(l, log); else { var c0 = cc(l); l.flags.birth987 = { y: l.birthYear, cc: c0, key: eraKey(c0, eraAt(c0, y)), rkey: regKey(c0, regAt(c0, y, places(l, c0, y))), events: [], seen: {}, late: true }; } return; }
    if (s.at === l.age) return; s.at = l.age;
    var code = cc(l), here = places(l, code, y), r0 = eraAt(code, y), key = eraKey(code, r0), rg = regAt(code, y, here), rk = regKey(code, rg), told = 0;
    if (key !== s.key) {
      var moved = s.key.split(':')[0] !== code; s.key = key;
      if (r0) { told++; log(moved ? 'Nơi bạn đang sống, ' + name(code, y) + ', ' + phase(r0) + '. ' + sentence(r0[3]) : 'Năm ' + y + ', ' + name(code, y) + ' bước sang giai đoạn mới: ' + lower(r0[2]) + '. ' + sentence(r0[3]), 'info'); }
    }
    if (rk !== (s.rkey || '')) { s.rkey = rk; if (rg) { told++; log('Năm ' + y + ', ở ' + placeName(rg[0], here) + ': ' + lower(rg[3]) + ' — ' + sentence(rg[4]), 'info'); } }
    var seen = s.seen || (s.seen = {}), mood = 0, rev = regEventsAt(code, y, here);
    var wl = worldAt(y, code, rev.map(function (e) { return e[2]; }));
    var list = rev.map(function (e) { return [e[0], e[2], e[3], e[4], false, placeName(e[1], here)]; }).concat(trimNational(eventsAt(code, y), rev.map(function (e) { return e[2]; }))).concat(wl.filter(function (e) { return (e[2] || 1) >= 2; }).map(function (e) { return [e[0], e[1], e[2], '', true]; }));
    list.forEach(function (e) {
      var id = (e[4] ? 'W' : code) + ':' + y + ':' + e[1].slice(0, 24), major = (e[2] || 1) >= 2;
      if (seen[id] || y === s.y && l.age === 0) return; // năm sinh đã kể trong dòng chào đời
      if (e[4] && !major) return;
      if (l.age < 5 && !major) return;
      var rec = s.rec9112 || (s.rec9112 = {}); // 9.11.2: mốc nhỏ lặp lại hằng năm (lễ hội, ngày lễ) không kể lại trong vòng 3 năm
      if (!major && rec[e[1]] != null && y - rec[e[1]] < 4) return;
      if (!major) rec[e[1]] = y;
      seen[id] = 1; told++;
      log((e[4] ? 'Thế giới năm ' : 'Năm ') + y + (e[4] ? ': ' : ' ở ' + (e[5] || name(code, y)) + ': ') + sentence(e[1]) + (l.age < 5 ? ' Bạn còn quá nhỏ để nhớ, nhưng người lớn kể lại nhiều lần.' : ''), 'info');
      if (major && l.age >= 8) H.mem(l, 'Năm ' + y + (l.age < 18 ? ', khi bạn ' + l.age + ' tuổi' : '') + ': ' + (e[5] ? 'ở ' + e[5] + ', ' : '') + lower(e[1]).replace(/\.$/, '') + '.', 2);
      if (l.age >= 6) mood += e[3] === 'joy' ? 1 : e[3] === 'grief' ? -1 : 0;
    });
    if (mood) H.fx(l, { hap: Math.max(-2, Math.min(2, mood)) });
    // Năm không có chuyện gì được kể (từ 5 tuổi, khi đã hiểu chuyện): mốc số liệu vừa vượt ngưỡng, rồi tin thế giới có thật của năm, rồi chỉ số đời sống của năm.
    if (!told && l.age >= 5) { var fb = fallback(code, y); if (fb) log(fb, 'info'); }
  }
  function fallback(code, y) {
    var sn = snapshot(code, y), milestone = sn && /lần đầu|bắt đầu phổ biến|nhiều hơn số dân|cứ hai người|không còn là của hiếm/.test(sn);
    if (milestone) return sn;
    var w = (D.WORLD || []).filter(function (e) { return e[0] === y; }).sort(function (a, b) { return (a[2] || 1) - (b[2] || 1); })[0];
    // Năm chẵn ưu tiên tin thế giới, năm lẻ ưu tiên chỉ số đời sống của chính nước đó (khi có số liệu 1950–2023).
    if (sn && y % 2) return sn;
    if (w) return 'Tin thế giới năm ' + y + ': ' + sentence(w[1]);
    return sn;
  }
  // Mọi năm 1900–2025 của mọi nước đều có ít nhất một dòng: sự kiện quốc gia, sự kiện vùng, tin thế giới hoặc chỉ số đời sống.
  function covered(code, y, here) { return eventsAt(code, y).length > 0 || (here ? regEventsAt(code, y, here).length > 0 : false) || !!fallback(code, y); }
  E.HOOKS.year.push(yearly);
  E.BIRTH987 = { data: D, eraAt: eraAt, eventsAt: eventsAt, worldAt: worldAt, regAt: regAt, regEventsAt: regEventsAt, places: places, snapshot: snapshot, fallback: fallback, covered: covered, trimNational: trimNational, birthText: birthText, year: yearly, onBirth: onBirth };
})(globalThis.G);

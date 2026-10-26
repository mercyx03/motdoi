/* Góp ý người chơi — Mốc C: đời sống theo tầng lớp, tiệc, thương vụ với NPC, mạng lưới NPC bền vững,
   người đứng đầu gia tộc, trải nghiệm thượng lưu và sưu tầm.
   · Mọi NPC trong mạng lưới có mã định danh cố định (X.uid), tính cách ẩn độc lập với giàu nghèo, già đi và có thể mất.
   · Tài sản sưu tầm nằm trong một sổ duy nhất (items) có chủ sở hữu; chỉ món của chính người chơi được tính vào tài sản ròng.
   · Thương vụ kéo dài nhiều năm, có thể lãi, lỗ, tranh chấp; lợi nhuận bị chặn, không sinh tiền vô hạn.
   · Quyền của người đứng đầu gia tộc gắn với tiền và cổ phần của chính mình; người thân có quyền từ chối. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110;
  function S(l) {
    var s = l.flags.elite148 || (l.flags.elite148 = {});
    if (!Array.isArray(s.people)) s.people = [];
    if (!Array.isArray(s.deals)) s.deals = [];
    if (!Array.isArray(s.items)) s.items = [];
    if (!s.benefits || typeof s.benefits !== 'object') s.benefits = {};
    if (!Array.isArray(s.conflicts)) s.conflicts = [];
    if (!Number.isFinite(s.rep)) s.rep = 50;
    if (!s.done || typeof s.done !== 'object') s.done = {};
    return s;
  }
  function yr(l) { return l.birthYear + l.age; }
  function vn(l) { return !(l.mode === 'world' || l.abroad && l.abroad.perm) && (l.country || 'VN') === 'VN'; }
  function mo(l, v) { return H.money(l, v); }
  function free(l) {
    var w = X.reason(l, 18); if (w !== true) return w;
    if (!l.indep) return 'Cần tự lập';
    if (l.jailUntil != null && l.age < l.jailUntil) return 'Đang trong trại giam';
    if (l.abroad && l.abroad.trapped) return 'Đang bị giữ trong trại lừa đảo';
    return true;
  }
  function doneThisYear(l, key) { return S(l).done[key] === l.age; }
  function mark(l, key) { S(l).done[key] = l.age; }
  function rep(l, d) { var s = S(l); s.rep = U.clamp(s.rep + d, 0, 100); return s.rep; }

  // ===================================================================
  // C1. Tầng lớp theo tài sản, danh tiếng, vị trí; có xét quốc gia (đơn vị l.base) và thời kỳ
  // ===================================================================
  var TIERS = [{ n: 'Bình dân', w: 0 }, { n: 'Khá giả', w: 20 }, { n: 'Giàu có', w: 100 }, { n: 'Thượng lưu', w: 1000 }, { n: 'Siêu giàu', w: 10000 }];
  function wealth(l) { return Math.max(0, E.netWorth(l)) / l.base; }
  function standing(l) {
    var b = 0, g = E.BUSINESS137 && E.BUSINESS137.roleCompany ? E.BUSINESS137.roleCompany(l, { group: true }) : null;
    if (g) b++;
    if ((l.fame || 0) >= 1e6) b++;
    return Math.min(1, b);
  }
  function tier(l) { var w = wealth(l), t = 0; TIERS.forEach(function (x, i) { if (w >= x.w) t = i; }); return t >= 1 ? Math.min(4, t + standing(l)) : t; }
  function tierName(l) { return TIERS[tier(l)].n; }

  // ===================================================================
  // C4. Mạng lưới NPC bền vững
  // ===================================================================
  var KINDS = {
    business: { n: 'doanh nhân', jobs: ['Chủ tịch tập đoàn', 'Giám đốc điều hành', 'Nhà sáng lập công ty', 'Chủ chuỗi nhà hàng'] },
    investor: { n: 'nhà đầu tư', jobs: ['Nhà đầu tư thiên thần', 'Giám đốc quỹ đầu tư', 'Nhà đầu tư bất động sản'] },
    artist: { n: 'nghệ sĩ', jobs: ['Ca sĩ', 'Diễn viên', 'Họa sĩ', 'Nhà thiết kế thời trang'] },
    pro: { n: 'chuyên gia', jobs: ['Luật sư', 'Bác sĩ', 'Kiến trúc sư', 'Giáo sư đại học'] },
    athlete: { n: 'vận động viên', jobs: ['Cựu tuyển thủ quốc gia', 'Tay golf chuyên nghiệp', 'Tay đua'] }
  };
  var COMPANY = ['Hưng Thịnh', 'Phú An', 'Đại Việt', 'Nam Long', 'Kim Sơn', 'Hòa Bình', 'Sao Mai', 'Trường Hải', 'Thái Bình Dương', 'Ngọc Lan'];
  var SECTORS = ['bất động sản', 'công nghệ', 'bán lẻ', 'du lịch - khách sạn', 'năng lượng', 'thực phẩm', 'giải trí', 'logistics'];
  function people(l) { return S(l).people; }
  function alive(p) { return p && p.alive !== false; }
  function find(l, id) { return people(l).find(function (p) { return p.uid110 === id; }) || null; }
  function pAge(l, p) { return yr(l) - p.birth; }
  function label(l, p) {
    var dup = people(l).some(function (q) { return q !== p && q.name === p.name; });
    return p.name + (dup ? ' (sinh ' + p.birth + ')' : '') + ' · ' + p.job + (p.company ? ' · ' + p.company : '');
  }
  function meet(l, r, o) {
    o = o || {};
    var kind = o.kind || U.pick(r, Object.keys(KINDS)), sex = r() < 0.5 ? 'M' : 'F', t = U.clamp(o.tier == null ? tier(l) : o.tier, 0, 4);
    var p = { name: H.stranger(l, r, sex), sex: sex, birth: yr(l) - Math.round(U.clamp((o.age || 30 + r() * 30), 22, 80)), kind: kind, tier: t,
      job: U.pick(r, KINDS[kind].jobs), company: kind === 'business' || kind === 'investor' ? (t >= 3 ? 'Tập đoàn ' : 'Công ty ') + U.pick(r, COMPANY) : null,
      celeb: !!o.celeb || kind === 'artist' && t >= 2 && r() < 0.5,
      // tính cách ẩn: không phụ thuộc giàu nghèo hay nghề nghiệp
      honesty: Math.round(15 + r() * 85), warmth: Math.round(10 + r() * 90), ambition: Math.round(10 + r() * 90),
      interests: [U.pick(r, SECTORS), U.pick(r, SECTORS)].filter(function (x, i, a) { return a.indexOf(x) === i; }),
      trust: Math.round(30 + r() * 20), met: [{ a: l.age, where: o.where || 'một buổi gặp gỡ' }], alive: true, fictional: true };
    X.uid(l, p);
    people(l).push(p);
    prune(l);
    return p;
  }
  function seen(l, p, where, dTrust) {
    p.met = (p.met || []).concat([{ a: l.age, where: where }]).slice(-8);
    if (dTrust) p.trust = U.clamp(p.trust + dTrust, 0, 100);
  }
  // Giữ dữ liệu có giới hạn: bỏ người đã mất lâu hoặc ít gắn bó trước.
  function prune(l) {
    var list = people(l); if (list.length <= 60) return;
    var busy = {}; S(l).deals.forEach(function (d) { if (d.stage !== 'closed') busy[d.pid] = 1; });
    list.sort(function (a, b) { return (alive(b) - alive(a)) || (b.trust - a.trust) || (b.met[b.met.length - 1].a - a.met[a.met.length - 1].a); });
    for (var i = list.length - 1; i >= 0 && list.length > 60; i--) if (!busy[list[i].uid110]) list.splice(i, 1);
  }
  function contacts(l, fn) { return people(l).filter(function (p) { return alive(p) && (!fn || fn(p)); }); }

  // ===================================================================
  // C6. Sổ tài sản sưu tầm / xa xỉ (một nguồn, có chủ sở hữu)
  // ===================================================================
  var CAT = {
    watch: { n: 'Đồng hồ', vol: 0.06, trend: 0.02, list: [['Đồng hồ cơ Thụy Sĩ cổ điển', 0.5], ['Đồng hồ lịch vạn niên giới hạn', 3], ['Đồng hồ đấu giá phiên bản hiếm', 20]] },
    painting: { n: 'Tranh', vol: 0.12, trend: 0.03, list: [['Tranh sơn dầu họa sĩ trẻ', 1], ['Tranh sơn mài danh họa thập niên 1960', 10], ['Kiệt tác hội họa đấu giá quốc tế', 80]] },
    vase: { n: 'Bình cổ', vol: 0.1, trend: 0.025, list: [['Bình gốm men lam thế kỷ 19', 0.5], ['Bình gốm hoa lam thời Lê', 5], ['Bình sứ cung đình hiếm', 40]] },
    car: { n: 'Xe cổ / siêu xe sưu tầm', vol: 0.08, trend: 0.01, list: [['Xe cổ thập niên 1960 đã phục chế', 5], ['Siêu xe phiên bản giới hạn', 30], ['Xe đua cổ điển có lịch sử thi đấu', 150]] },
    art: { n: 'Tác phẩm nghệ thuật', vol: 0.18, trend: 0.02, list: [['Tượng điêu khắc đương đại', 0.3], ['Tác phẩm sắp đặt của nghệ sĩ quốc tế', 4], ['Tác phẩm nghệ thuật đương đại đắt giá', 50]] },
    yacht: { n: 'Du thuyền', vol: 0.03, trend: -0.06, upkeep: 0.08, tier: 3, since: 2005, list: [['Du thuyền 25 mét', 200], ['Siêu du thuyền 60 mét', 800]] },
    jet: { n: 'Máy bay riêng', vol: 0.03, trend: -0.07, upkeep: 0.1, tier: 4, since: 2008, list: [['Máy bay phản lực hạng nhẹ', 2000], ['Máy bay thương gia tầm xa', 6000]] },
    island: { n: 'Đảo riêng', vol: 0.06, trend: 0.03, upkeep: 0.03, tier: 4, since: 2010, list: [['Đảo nhỏ có khu nghỉ', 3000], ['Đảo riêng có bến du thuyền', 20000]] }
  };
  function items(l) { return S(l).items; }
  function mine(l) { return items(l).filter(function (x) { return x.owner === 'me'; }); }
  function own(l, cat) { return mine(l).some(function (x) { return x.cat === cat; }); }
  function addItem(l, o) {
    var x = { cat: o.cat, name: o.name, buy: o.buy, value: o.value == null ? o.buy : o.value, owner: o.owner || 'me', ownerName: o.ownerName || null, at: l.age, from: o.from || 'mua' };
    X.uid(l, x); items(l).push(x); return x;
  }
  function itemValue(l) { return mine(l).reduce(function (s, x) { return s + (x.value || 0); }, 0); }
  // Đổi chủ: món đồ rời khỏi tài sản của bạn, không nhân đôi.
  function transfer(l, x, owner, name) { if (!x || x.owner !== 'me') return false; x.owner = owner; x.ownerName = name || null; x.givenAt = l.age; return true; }
  function liquid(l) { return Math.max(0, l.money); }
  function reserve(l) { return l.base * 0.5; }
  function since(l, c) { var y = c.since || 0; return vn(l) ? yr(l) >= y : yr(l) >= y - 25; }

  var net = E.netWorth, total = E.assetTotal;
  E.netWorth = function (l) { return net.apply(this, arguments) + (l.flags && l.flags.elite148 ? itemValue(l) : 0); };
  if (total) E.assetTotal = function (l) { return total.apply(this, arguments) + (l.flags && l.flags.elite148 ? itemValue(l) : 0); };
  var convert = E.abroadConvert;
  E.abroadConvert = function (l, f) {
    var out = convert.apply(this, arguments), s = l.flags && l.flags.elite148;
    if (s) { (s.items || []).forEach(function (x) { x.buy *= f; x.value *= f; }); (s.deals || []).forEach(function (d) { d.amt *= f; if (d.back) d.back *= f; }); Object.keys(s.benefits || {}).forEach(function (k) { (s.benefits[k] || []).forEach(function (b) { b.cost *= f; }); }); }
    return out;
  };
  if (E.profile) { var profile = E.profile; E.profile = function (l) { var p = profile.apply(this, arguments); if (l.flags && l.flags.elite148 && p && p.assets) mine(l).forEach(function (x) { p.assets.push([x.name, x.value]); }); return p; }; }

  // ===================================================================
  // Người thân (dùng chung danh tính với các hệ thống gia đình)
  // ===================================================================
  function relatives(l) {
    var out = [];
    function add(p, kind, a) { if (p && p.alive !== false) out.push({ id: X.uid(l, p), p: p, name: p.name || p.n, kind: kind, age: a }); }
    if (l.partner && l.partner.status === 'married') add(l.partner, 'vợ/chồng', l.partner.age);
    (l.kids || []).forEach(function (k) { if (l.age - k.born >= 18) add(k, 'con', l.age - k.born); });
    (l.sibList || []).forEach(function (s) { add(s, 'anh/chị/em', l.age - s.born); });
    return out;
  }
  function closeOf(x) { var c = x.p.close; return c == null ? 55 : c; }
  function adjustClose(x, d) { if (x.p.close == null) x.p.close = 55; x.p.close = U.clamp(x.p.close + d, 0, 100); }
  function abroadRel(x) { return !!(x.p.abroad || x.p.country108 && x.p.country108 !== 'VN'); }

  // ===================================================================
  // C2. Tổ chức tiệc
  // ===================================================================
  var PARTY = {
    birthday: { n: 'Tiệc sinh nhật', mood: 4 },
    housewarming: { n: 'Tiệc tân gia', mood: 3, need: function (l) { return l.ownHouse ? true : 'Cần có nhà riêng'; } },
    anniversary: { n: 'Tiệc kỷ niệm ngày cưới', mood: 4, need: function (l) { return l.partner && l.partner.status === 'married' ? true : 'Cần đang có gia đình'; } },
    business: { n: 'Tiệc gặp gỡ đối tác', mood: 1, net: 2 },
    gala: { n: 'Dạ tiệc gây quỹ từ thiện', mood: 2, net: 2, tier: 2, charity: 0.3 }
  };
  var SIZE = { small: { n: 'Thân mật (khoảng 15 khách)', heads: 15 }, mid: { n: 'Vừa (khoảng 60 khách)', heads: 60 }, big: { n: 'Lớn (khoảng 200 khách)', heads: 200, tier: 2 }, grand: { n: 'Đại tiệc (khoảng 500 khách)', heads: 500, tier: 3 } };
  var VENUE = {
    home: { n: 'tại nhà', per: 0.0015, max: 60, need: function (l) { return l.ownHouse || l.indep ? true : 'Cần có chỗ ở riêng'; } },
    garden: { n: 'ở sân vườn thuê riêng', per: 0.003, max: 200 },
    restaurant: { n: 'ở nhà hàng', per: 0.004, max: 300 },
    hotel: { n: 'ở khách sạn 5 sao', per: 0.012, max: 800, tier: 2 },
    yacht: { n: 'trên du thuyền', per: 0.03, max: 80, tier: 3, cat: 'yacht' },
    island: { n: 'trên đảo riêng', per: 0.05, max: 200, tier: 4, cat: 'island' }
  };
  function partyCost(l, type, size, venue) { var v = VENUE[venue], c = SIZE[size].heads * v.per * l.base * (type === 'gala' ? 1.4 : 1); if (v.cat && own(l, v.cat)) c *= 0.4; return c; }
  function venueWhy(l, size, venue) {
    var v = VENUE[venue], s = SIZE[size];
    if (s.heads > v.max) return 'Địa điểm không đủ chỗ cho quy mô này';
    if (v.need && v.need(l) !== true) return v.need(l);
    if (v.cat && !own(l, v.cat) && tier(l) < v.tier) return 'Cần sở hữu ' + CAT[v.cat].n.toLowerCase() + ' hoặc thuộc tầng ' + TIERS[v.tier].n;
    if (v.cat && !since(l, CAT[v.cat])) return 'Thời kỳ này chưa có dịch vụ này';
    if (!v.cat && v.tier && tier(l) < v.tier) return 'Cần thuộc tầng ' + TIERS[v.tier].n;
    return true;
  }
  X.menu('party148', 'Tổ chức tiệc', function (l) { var w = free(l); if (w !== true) return w; return S(l).partyCount === l.age && S(l).partyN >= 2 ? 'Đã tổ chức 2 bữa tiệc năm nay' : true; },
    function (l) { return 'Tầng lớp hiện tại: ' + tierName(l) + ' · uy tín xã hội ' + Math.round(S(l).rep) + '/100. Chọn loại tiệc, quy mô, địa điểm và khách mời. Khách có quyền nhận lời hay từ chối; tiệc vượt quá khả năng có thể bị bàn tán. Tối đa 2 bữa tiệc mỗi năm, mỗi loại một lần.'; },
    function (l) {
      return Object.keys(PARTY).map(function (k) {
        var p = PARTY[k], why = doneThisYear(l, 'party:' + k) ? 'Đã tổ chức loại tiệc này năm nay' : p.need ? p.need(l) : true;
        if (why === true && p.tier && tier(l) < p.tier) why = 'Cần thuộc tầng ' + TIERS[p.tier].n;
        return { k: k, l: p.n, why: why, run: function (l, r) { X.next(l, 'party148_plan', r, { type: k }); } };
      });
    }, 18, 'Tình cảm & gia đình');
  X.menu('party148_plan', 'Quy mô và địa điểm', function (l) { return free(l); },
    function (l, d) { var t = PARTY[d && d.arg && d.arg.type] || PARTY.birthday; return t.n + ': chọn quy mô và nơi tổ chức. Chi phí đã gồm ăn uống, trang trí; tiền mặt hiện có ' + mo(l, liquid(l)) + '.'; },
    function (l, arg) {
      if (!PARTY[arg.type]) return [];
      var rows = [];
      Object.keys(SIZE).forEach(function (s) {
        if (SIZE[s].tier && tier(l) < SIZE[s].tier) return;
        Object.keys(VENUE).forEach(function (v) {
          var why = venueWhy(l, s, v), cost = partyCost(l, arg.type, s, v);
          if (why === true && liquid(l) < cost + reserve(l)) why = 'Chưa đủ tiền mặt (cần giữ lại quỹ sinh hoạt)';
          if (why !== true && /không đủ chỗ|Thời kỳ/.test(why)) return;
          rows.push({ k: s + ':' + v, l: SIZE[s].n + ' ' + VENUE[v].n, h: mo(l, cost), why: why, run: function (l, r) { X.next(l, 'party148_guests', r, { type: arg.type, size: s, venue: v }); } });
        });
      });
      return rows;
    });
  var GUESTS = {
    family: { n: 'Chỉ gia đình, họ hàng' },
    friends: { n: 'Gia đình và bạn bè' },
    network: { n: 'Gia đình, bạn bè và người quen trong giới làm ăn', tier: 1 },
    star: { n: 'Mời thêm người nổi tiếng góp vui', tier: 2 }
  };
  X.menu('party148_guests', 'Danh sách khách mời', function (l) { return free(l); },
    function (l, d) { var a = d && d.arg || {}; return 'Khách mời quyết định có đến hay không tùy độ thân thiết, lịch bận, khoảng cách và vị thế của bạn. Người quen mới có thể trở thành đối tác hoặc bạn bè lâu dài.' + (a.type ? ' Chi phí dự kiến ' + mo(l, partyCost(l, a.type, a.size, a.venue)) + '.' : ''); },
    function (l, arg) {
      if (!PARTY[arg.type] || !SIZE[arg.size] || !VENUE[arg.venue]) return [];
      return Object.keys(GUESTS).map(function (g) {
        var why = GUESTS[g].tier && tier(l) < GUESTS[g].tier ? 'Cần thuộc tầng ' + TIERS[GUESTS[g].tier].n : true;
        if (arg.size === 'small' && (g === 'network' || g === 'star')) why = 'Tiệc thân mật không phù hợp mời rộng';
        return { k: g, l: GUESTS[g].n, why: why, run: function (l, r, log) { party(l, r, log, arg.type, arg.size, arg.venue, g); } };
      });
    });
  function party(l, r, log, type, size, venue, guests) {
    var s = S(l), P = PARTY[type], cost = partyCost(l, type, size, venue);
    if (doneThisYear(l, 'party:' + type) || venueWhy(l, size, venue) !== true || SIZE[size].tier && tier(l) < SIZE[size].tier || liquid(l) < cost + reserve(l)) { log('Bữa tiệc chưa thể tổ chức: điều kiện đã thay đổi.', 'neutral'); return null; }
    mark(l, 'party:' + type); s.partyN = s.partyCount === l.age ? (s.partyN || 0) + 1 : 1; s.partyCount = l.age;
    H.cash(l, -cost, P.n + ' ' + VENUE[venue].n);
    var came = [], declined = [], newPeople = [], t = tier(l);
    function invite(name, p, done) { if (r() < U.clamp(p, 0.03, 0.97)) { came.push(name); if (done) done(true); } else { declined.push(name); if (done) done(false); } }
    relatives(l).forEach(function (x) { invite(x.name, 0.45 + closeOf(x) / 200 - (abroadRel(x) ? 0.35 : 0) - openConflict(l, x.id) * 0.2, function (ok) { if (ok) adjustClose(x, 2); }); });
    if (l.fam) ['m', 'f'].forEach(function (x) { if (x === 'm' ? l.fam.mAlive && !l.fam.noMom : l.fam.fAlive && !l.fam.noDad) invite(x === 'm' ? 'mẹ' : 'bố', 0.8, function (ok) { if (ok && E.NPC) E.NPC.adjustTrust(l, 'parent:' + x, 1); }); });
    if (guests !== 'family') (l.friends || []).filter(function (f) { return f.alive !== false; }).slice(0, 8).concat(l.bff && l.bff.alive ? [l.bff] : []).forEach(function (f) { invite(f.name, 0.4 + (f.close || 50) / 200, function (ok) { if (ok) f.close = U.clamp((f.close || 50) + 2, 0, 100); }); });
    if (guests === 'network' || guests === 'star') {
      contacts(l, function (p) { return !p.celeb; }).sort(function (a, b) { return b.trust - a.trust; }).slice(0, 10).forEach(function (p) {
        invite(p.name, 0.25 + p.trust / 200 - Math.max(0, p.tier - t) * 0.15 + (P.net ? 0.1 : 0), function (ok) { if (ok) seen(l, p, P.n.toLowerCase() + ' của bạn', 3); });
      });
      var n = Math.min(3, 1 + Math.floor(SIZE[size].heads / 150));
      for (var i = 0; i < n; i++) if (r() < 0.55 + (P.net ? 0.2 : 0)) { var q = meet(l, r, { where: P.n.toLowerCase() + ' của bạn', tier: U.clamp(t + (r() < 0.3 ? 1 : 0) - (r() < 0.3 ? 1 : 0), 0, 4) }); newPeople.push(q); came.push(q.name); }
    }
    var fee = 0;
    if (guests === 'star') {
      var stars = contacts(l, function (p) { return p.celeb; });
      if (!stars.length || r() < 0.5) stars.push(meet(l, r, { kind: 'artist', celeb: true, where: P.n.toLowerCase() + ' của bạn', tier: Math.max(2, t) }));
      stars.slice(0, 2).forEach(function (p) {
        var friendly = p.trust >= 55;
        if (!friendly) fee += l.base * (0.3 + p.tier * 0.2);
        invite(p.name + ' (' + p.job.toLowerCase() + ')', (friendly ? 0.75 : 0.45) + ((l.fame || 0) > 1e5 ? 0.1 : 0), function (ok) { if (ok) seen(l, p, P.n.toLowerCase() + ' của bạn', 4); else fee -= friendly ? 0 : l.base * (0.3 + p.tier * 0.2); });
      });
      if (fee > 0) H.cash(l, -fee, 'Thù lao khách mời biểu diễn');
    }
    var attend = came.length / Math.max(1, came.length + declined.length), score = attend * 0.6 + (venue === 'home' ? 0.15 : 0.25) + r() * 0.3;
    var showy = cost > l.base * 0.3 && cost > Math.max(1, E.netWorth(l) + cost) * 0.015;
    var tail = '';
    if (P.charity) { var gift = cost * P.charity; H.cash(l, -gift, 'Quỹ từ thiện của dạ tiệc'); tail += ' Quỹ từ thiện nhận ' + mo(l, gift) + '.'; rep(l, 3); }
    if (showy) { rep(l, -4); tail += ' Chi phí quá lớn so với tài sản khiến không ít người bàn tán là phô trương.'; }
    else if (score >= 0.65) { rep(l, P.net ? 3 : 2); tail += ' Khách ra về vui vẻ, nhiều người nhắc mãi.'; }
    else if (score < 0.4) { rep(l, -2); tail += ' Khách đến thưa thớt, không khí khá gượng gạo.'; }
    if (SIZE[size].heads >= 200 && r() < 0.12) { rep(l, -2); tail += ' Một nhóm khách quá chén gây ồn ào, sáng hôm sau còn lan lên mạng.'; }
    H.fx(l, { hap: Math.round(P.mood * (0.5 + score)), soc: P.net || 1 });
    var names = function (a) { return a.slice(0, 6).join(', ') + (a.length > 6 ? ' và ' + (a.length - 6) + ' người khác' : ''); };
    log(P.n + ' ' + VENUE[venue].n + ' (' + mo(l, cost) + '). ' + (came.length ? 'Đến dự: ' + names(came) + '.' : 'Gần như không ai đến.') + (declined.length ? ' Không đến được: ' + names(declined) + '.' : '') + (newPeople.length ? ' Bạn làm quen ' + newPeople.map(function (p) { return label(l, p); }).join('; ') + '.' : '') + tail, score >= 0.5 && !showy ? 'good' : 'neutral');
    if (score >= 0.6) H.mem(l, P.n + ' ' + VENUE[venue].n + ' năm ' + l.age + ' tuổi.', 2);
    return { came: came, declined: declined, met: newPeople, cost: cost, score: score };
  }

  // ===================================================================
  // C3. Thương vụ với NPC: chấp nhận / từ chối, kéo dài nhiều năm, có rủi ro
  // ===================================================================
  var DEAL = {
    project: { n: 'Góp vốn dự án', years: 3, rate: 0.12, risk: 0.25 },
    distribution: { n: 'Hợp tác phân phối', years: 2, rate: 0.09, risk: 0.15, needCompany: true },
    realestate: { n: 'Liên doanh bất động sản', years: 4, rate: 0.1, risk: 0.2, minTier: 2 },
    startup: { n: 'Rót vốn công ty khởi nghiệp', years: 4, rate: 0.25, risk: 0.55 }
  };
  function hasCompany(l) { return !!(E.BUSINESS123 && (E.BUSINESS123.companies(l) || []).some(function (c) { return !c.merged && c.share > 50; })) || (l.ventures || []).length > 0; }
  function ability(l) { return U.clamp(((l.edu || 0) * 6 + (l.st && l.st.smart || 50) * 0.4) / 100, 0, 1); }
  function activeDeals(l) { return S(l).deals.filter(function (d) { return d.stage === 'active' || d.stage === 'dispute'; }); }
  function amounts(l) { var c = liquid(l) - reserve(l); return [0.05, 0.15, 0.3].map(function (f) { return Math.max(l.base * 0.5, c * f); }).filter(function (v, i, a) { return v <= c && a.indexOf(v) === i; }); }
  // Xác suất NPC nhận lời: tin cậy, uy tín, năng lực, tài chính, quan tâm, quy mô
  function dealChance(l, p, type, amt) {
    var D = DEAL[type], c = 0.15 + p.trust / 220 + (S(l).rep - 50) / 250 + ability(l) * 0.15;
    if (p.interests.indexOf(D.sector || '') >= 0) c += 0.1;
    if (amt > l.base * Math.pow(10, p.tier)) c -= 0.2;
    if (amt < l.base * Math.pow(10, p.tier - 2)) c -= 0.1;
    if (p.ambition > 70) c += 0.05;
    return U.clamp(c, 0.05, 0.85);
  }
  function dealWhy(l, p) {
    var w = free(l); if (w !== true) return w;
    if (!p || !alive(p)) return 'Người này không còn liên lạc được';
    if (p.trust < 35) return 'Chưa đủ tin cậy để bàn chuyện làm ăn (cần 35/100)';
    if (p.dealAt === l.age) return 'Đã bàn hợp tác với người này năm nay';
    if (activeDeals(l).length >= 3) return 'Đang có 3 thương vụ chưa kết thúc';
    if (!amounts(l).length) return 'Không đủ tiền nhàn rỗi để góp vốn';
    return true;
  }
  X.menu('deal148', 'Thương vụ hợp tác', function (l) { var w = free(l); if (w !== true) return w; return contacts(l, function (p) { return p.kind === 'business' || p.kind === 'investor'; }).length || activeDeals(l).length ? true : 'Chưa quen doanh nhân hay nhà đầu tư nào (gặp gỡ qua tiệc, sự kiện, trải nghiệm thượng lưu)'; },
    function (l) { var a = activeDeals(l); return 'Uy tín xã hội ' + Math.round(S(l).rep) + '/100. Lợi nhuận không được bảo đảm; đối tác có thể giỏi, kém hoặc thiếu trung thực, điều đó chỉ lộ ra theo thời gian.' + (a.length ? '\nĐang theo dõi: ' + a.map(function (d) { var p = find(l, d.pid); return DEAL[d.type].n + ' với ' + (p ? p.name : 'đối tác') + ' · ' + mo(l, d.amt) + ' · ' + (d.stage === 'dispute' ? 'đang tranh chấp' : 'còn ' + Math.max(0, d.end - l.age) + ' năm'); }).join('; ') : ''); },
    function (l) {
      var rows = activeDeals(l).map(function (d) { var p = find(l, d.pid); return { k: 'd:' + d.uid110, l: 'Theo dõi: ' + DEAL[d.type].n + ' với ' + (p ? p.name : 'đối tác'), run: function (l, r) { X.next(l, 'deal148_track', r, { id: d.uid110 }); } }; });
      contacts(l, function (p) { return p.kind === 'business' || p.kind === 'investor'; }).sort(function (a, b) { return b.trust - a.trust; }).slice(0, 12).forEach(function (p) {
        rows.push({ k: 'p:' + p.uid110, l: 'Bàn hợp tác với ' + label(l, p) + ' · tin cậy ' + Math.round(p.trust), why: dealWhy(l, p), run: function (l, r) { X.next(l, 'deal148_terms', r, { pid: p.uid110 }); } });
      });
      return rows;
    }, 18, 'Tiền bạc');
  X.menu('deal148_terms', 'Điều khoản hợp tác', function (l) { return free(l); },
    function (l, d) { var p = find(l, d && d.arg && d.arg.pid); return p ? label(l, p) + '. Quan tâm: ' + p.interests.join(', ') + '. Đề xuất quy mô vừa sức đối tác dễ được nhận lời hơn.' : 'Không tìm thấy đối tác.'; },
    function (l, arg) {
      var p = find(l, arg.pid); if (!p || dealWhy(l, p) !== true) return [];
      var rows = [];
      Object.keys(DEAL).forEach(function (k) {
        var D = DEAL[k], why = D.needCompany && !hasCompany(l) ? 'Cần có doanh nghiệp của riêng bạn' : D.minTier && tier(l) < D.minTier ? 'Cần thuộc tầng ' + TIERS[D.minTier].n : true;
        amounts(l).forEach(function (amt, i) { rows.push({ k: k + ':' + i, l: D.n + ' · ' + mo(l, amt) + ' · ' + D.years + ' năm', h: 'rủi ro ' + (D.risk >= 0.4 ? 'cao' : D.risk >= 0.2 ? 'vừa' : 'thấp'), why: why, run: function (l, r, log) { propose(l, r, log, p, k, amt); } }); });
      });
      return rows;
    });
  function propose(l, r, log, p, type, amt) {
    if (dealWhy(l, p) !== true || liquid(l) - reserve(l) < amt) return null;
    p.dealAt = l.age;
    var D = DEAL[type], ch = dealChance(l, p, type, amt);
    if (r() >= ch) {
      var why = p.trust < 50 ? 'muốn quen biết thêm trước khi góp tiền chung' : amt > l.base * Math.pow(10, p.tier) ? 'thấy quy mô vượt khả năng của mình' : S(l).rep < 45 ? 'e ngại uy tín của bạn trên thương trường' : 'đang ưu tiên kế hoạch khác';
      seen(l, p, 'buổi bàn hợp tác', -1);
      log(p.name + ' từ chối ' + D.n.toLowerCase() + ': ' + why + '. Có thể bàn lại vào năm sau.', 'neutral');
      return { ok: false, why: why };
    }
    H.cash(l, -amt, D.n + ' với ' + p.name);
    var d = { pid: p.uid110, type: type, amt: amt, start: l.age, end: l.age + D.years, stage: 'active', notes: [] };
    X.uid(l, d); S(l).deals.push(d);
    seen(l, p, 'ký thỏa thuận ' + D.n.toLowerCase(), 4);
    log('Bạn và ' + label(l, p) + ' ký thỏa thuận ' + D.n.toLowerCase() + ', góp ' + mo(l, amt) + ', dự kiến ' + D.years + ' năm. Kết quả còn tùy thị trường và cách đối tác điều hành.', 'neutral');
    return { ok: true, deal: d };
  }
  X.menu('deal148_track', 'Theo dõi thương vụ', function (l) { return free(l); },
    function (l, d) { var x = S(l).deals.find(function (y) { return y.uid110 === (d && d.arg && d.arg.id); }); if (!x) return 'Không tìm thấy thương vụ.'; var p = find(l, x.pid); return DEAL[x.type].n + ' với ' + (p ? label(l, p) : 'đối tác') + ' · vốn ' + mo(l, x.amt) + ' · từ ' + x.start + ' tuổi.' + (x.notes.length ? '\n' + x.notes.slice(-4).join('\n') : ''); },
    function (l, arg) {
      var d = S(l).deals.find(function (y) { return y.uid110 === arg.id; }); if (!d) return [];
      var p = find(l, d.pid), rows = [];
      if (d.stage === 'active') {
        rows.push({ k: 'audit', l: 'Thuê kiểm toán độc lập xem sổ sách', h: mo(l, l.base * 0.1), why: d.auditAt === l.age ? 'Đã kiểm toán năm nay' : liquid(l) < l.base * 0.1 ? 'Chưa đủ tiền' : true, run: function (l, r, log) { d.auditAt = l.age; H.cash(l, -l.base * 0.1, 'Kiểm toán thương vụ'); var t = p && p.honesty < 35 ? 'Kiểm toán phát hiện nhiều khoản chi khó giải thích.' : 'Sổ sách minh bạch, dòng tiền khớp với báo cáo.'; d.notes.push(l.age + ' tuổi: ' + t); d.audited = true; log(t, p && p.honesty < 35 ? 'bad' : 'good'); } });
        rows.push({ k: 'exit', l: 'Rút vốn trước hạn (mất một phần)', run: function (l, r, log) { var back = d.amt * (0.65 + r() * 0.2); H.cash(l, back, 'Rút vốn sớm'); d.stage = 'closed'; d.back = back; if (p) seen(l, p, 'rút vốn sớm', -6); log('Bạn rút vốn sớm, nhận lại ' + mo(l, back) + ' trên ' + mo(l, d.amt) + ' đã góp.', 'neutral'); } });
      } else if (d.stage === 'dispute') {
        rows.push({ k: 'sue', l: 'Khởi kiện đòi vốn', h: mo(l, l.base * 0.3), why: d.suit ? 'Vụ kiện đang được xử lý' : liquid(l) < l.base * 0.3 ? 'Chưa đủ tiền án phí, luật sư' : true, run: function (l, r, log) { H.cash(l, -l.base * 0.3, 'Chi phí khởi kiện'); d.suit = { at: l.age, until: l.age + 1 + Math.floor(r() * 2) }; d.notes.push(l.age + ' tuổi: nộp đơn khởi kiện.'); log('Bạn nộp đơn khởi kiện. Vụ án có thể kéo dài một đến hai năm.', 'neutral'); } });
        rows.push({ k: 'settle', l: 'Thương lượng nhận lại một phần', why: d.suit ? 'Đang chờ tòa xử' : true, run: function (l, r, log) { var back = d.left * (0.2 + r() * 0.3); H.cash(l, back, 'Thỏa thuận hòa giải'); d.stage = 'closed'; d.back = (d.back || 0) + back; log('Hai bên hòa giải, bạn nhận lại ' + mo(l, back) + '. Chuyện khép lại nhưng niềm tin thì không còn.', 'neutral'); } });
        rows.push({ k: 'drop', l: 'Chấp nhận mất, không theo đuổi', why: d.suit ? 'Đang chờ tòa xử' : true, run: function (l, r, log) { d.stage = 'closed'; log('Bạn quyết định khép lại thương vụ, coi như một bài học đắt giá.', 'bad'); H.fx(l, { hap: -3 }); } });
      }
      return rows;
    });
  function dealYear(l, r, log) {
    S(l).deals.forEach(function (d) {
      var p = find(l, d.pid), D = DEAL[d.type];
      if (d.stage === 'dispute' && d.suit && l.age >= d.suit.until) {
        var win = r() < 0.55 + (d.audited ? 0.15 : 0), back = win ? d.left * (0.4 + r() * 0.4) : 0;
        if (back) H.cash(l, back, 'Thi hành án thương vụ');
        d.back = (d.back || 0) + back; d.stage = 'closed'; d.suit = null;
        log(win ? 'Tòa tuyên bạn thắng kiện; thu hồi được ' + mo(l, back) + '.' : 'Tòa bác yêu cầu vì thiếu chứng cứ. Khoản vốn coi như mất.', win ? 'good' : 'bad');
        return;
      }
      if (d.stage !== 'active') return;
      if (!p || !alive(p)) {
        if (!d.orphan) { d.orphan = true; d.end = Math.max(d.end, l.age + 1); d.notes.push(l.age + ' tuổi: đối tác qua đời, gia đình họ tiếp quản thỏa thuận.'); log('Đối tác trong thương vụ ' + D.n.toLowerCase() + ' qua đời; người nhà tiếp quản, thương vụ chậm lại một năm.', 'neutral'); }
      }
      if (l.age < d.end) {
        if (p && alive(p) && l.age - d.start === 1 && r() < 0.35) { d.notes.push(l.age + ' tuổi: ' + (p.honesty >= 50 ? 'đối tác gửi báo cáo tiến độ đúng hẹn.' : 'đối tác trả lời qua loa khi được hỏi tiến độ.')); }
        return;
      }
      // Đáo hạn: kết quả theo năng lực, tính trung thực của đối tác, rủi ro và một phần may rủi
      var years = d.end - d.start, honest = p ? p.honesty : 60, fraud = honest < 30 && r() < 0.5, fail = !fraud && r() < D.risk * (1.2 - ability(l) * 0.4);
      if (fraud) { d.stage = 'dispute'; d.left = d.amt; if (p) { p.trust = Math.min(p.trust, 10); p.burned = true; } d.notes.push(l.age + ' tuổi: đối tác không hoàn vốn, có dấu hiệu chuyển tiền ra ngoài.'); log('Đến hạn, ' + (p ? p.name : 'đối tác') + ' không hoàn vốn ' + D.n.toLowerCase() + ' và tránh mặt. Bạn có thể khởi kiện, thương lượng hoặc bỏ qua trong mục Thương vụ hợp tác.', 'bad'); rep(l, -1); return; }
      var rate = fail ? -(0.3 + r() * 0.6) : D.rate * (0.4 + r() * 1.0) * (0.8 + ability(l) * 0.4);
      var back = Math.min(d.amt * 2.5, Math.max(0, d.amt * (1 + rate * (fail ? 1 : years))));
      H.cash(l, back, 'Kết thúc ' + D.n.toLowerCase());
      d.back = back; d.stage = 'closed';
      if (p) seen(l, p, 'kết thúc thương vụ', fail ? -5 : 6);
      rep(l, fail ? -1 : 2);
      log(D.n + ' với ' + (p ? p.name : 'đối tác') + ' kết thúc: ' + (fail ? 'dự án thua lỗ, chỉ thu về ' : 'thu về ') + mo(l, back) + ' trên vốn ' + mo(l, d.amt) + '.', fail ? 'bad' : 'good');
    });
    var list = S(l).deals; if (list.length > 30) S(l).deals = list.filter(function (d, i) { return d.stage !== 'closed' || i >= list.length - 20; });
  }

  // ===================================================================
  // C5. Người đứng đầu gia tộc
  // ===================================================================
  var BENEFIT = { home: { n: 'Hỗ trợ nhà ở', cost: 0.3 }, study: { n: 'Quỹ học tập cho con cháu', cost: 0.2 }, allowance: { n: 'Phụ cấp gia đình hằng năm', cost: 0.15 } };
  function controlled(l) { return E.BUSINESS123 ? (E.BUSINESS123.companies(l) || []).filter(function (c) { return !c.merged && c.share > 50; }) : []; }
  function headWhy(l) {
    var w = free(l); if (w !== true) return w;
    if (l.age < 35) return 'Cần từ 35 tuổi';
    var rel = relatives(l);
    if (!controlled(l).length && rel.filter(function (x) { return x.kind === 'con'; }).length < 2 && rel.length < 3) return 'Cần có doanh nghiệp gia đình hoặc ít nhất hai người con đã trưởng thành';
    return true;
  }
  function benefits(l, id) { var s = S(l); return s.benefits[id] || (s.benefits[id] = []); }
  function openConflict(l, id) { return S(l).conflicts.filter(function (c) { return !c.closed && (c.a === id || c.b === id); }).length; }
  function rel(l, id) { return relatives(l).find(function (x) { return x.id === id; }) || null; }
  X.menu('familyHead148', 'Người đứng đầu gia tộc', headWhy,
    function (l) {
      var c = controlled(l), open = S(l).conflicts.filter(function (x) { return !x.closed; });
      return 'Bạn điều hành ' + (c.length ? c.length + ' doanh nghiệp nắm quyền chi phối (' + c.map(function (x) { return x.name; }).slice(0, 3).join(', ') + ')' : 'tài chính gia đình bằng tiền của riêng mình') + '. Quyền của bạn chỉ trong phạm vi tài sản bạn sở hữu; tài sản riêng của người thân không thể bị lấy. Người thân có thể từ chối.' +
        (open.length ? '\nMâu thuẫn chưa giải quyết: ' + open.map(function (x) { return x.text + ' (mức ' + x.sev + ')'; }).join('; ') : '\nHiện không có mâu thuẫn lớn.');
    },
    function (l) {
      var rows = [{ k: 'meeting', l: 'Triệu tập họp gia đình', why: doneThisYear(l, 'meeting') ? 'Đã họp gia đình năm nay' : relatives(l).length < 2 ? 'Cần ít nhất hai người thân trưởng thành' : true, run: meeting }];
      if (E.DEC.companies123) rows.push({ k: 'roles', l: 'Bổ nhiệm / miễn nhiệm người thân trong doanh nghiệp', why: controlled(l).length ? true : 'Chỉ áp dụng với doanh nghiệp bạn nắm trên 50% cổ phần', run: function (l, r) { X.next(l, 'companies123', r); } });
      if (E.DEC.childrenSuccession139) rows.push({ k: 'heir', l: 'Chọn người kế nhiệm', run: function (l, r) { X.next(l, 'childrenSuccession139', r); } });
      if (E.DEC.will149) rows.push({ k: 'will', l: 'Điều chỉnh di chúc, phân chia thừa kế', run: function (l, r) { X.next(l, 'will149', r); } });
      relatives(l).slice(0, 10).forEach(function (x) { rows.push({ k: 'm:' + x.id, l: 'Quyền lợi, hỗ trợ cho ' + x.name + ' (' + x.kind + ')', run: function (l, r) { X.next(l, 'familyHead148_member', r, { id: x.id }); } }); });
      S(l).conflicts.filter(function (c) { return !c.closed; }).slice(0, 6).forEach(function (c) { rows.push({ k: 'c:' + c.uid110, l: 'Giải quyết: ' + c.text, why: c.at === l.age && c.tried ? 'Đã xử lý mâu thuẫn này năm nay' : true, run: function (l, r) { X.next(l, 'familyHead148_conflict', r, { id: c.uid110 }); } }); });
      return rows;
    }, 35, 'Tình cảm & gia đình');
  function meeting(l, r, log) {
    if (doneThisYear(l, 'meeting')) return;
    mark(l, 'meeting');
    var came = [], absent = [];
    relatives(l).forEach(function (x) { if (r() < U.clamp(0.5 + closeOf(x) / 180 - (abroadRel(x) ? 0.3 : 0) - openConflict(l, x.id) * 0.15, 0.05, 0.97)) { came.push(x); adjustClose(x, 1); } else absent.push(x); });
    var open = S(l).conflicts.filter(function (c) { return !c.closed; }), solved = null;
    if (open.length) {
      var c = open[0], a = rel(l, c.a), b = rel(l, c.b), both = a && b && came.indexOf(a) >= 0 && came.indexOf(b) >= 0;
      if (both && r() < 0.35 + ((closeOf(a) + closeOf(b)) / 2 - 50) / 120) { c.closed = true; c.result = 'hòa giải trong buổi họp'; solved = c; adjustClose(a, 4); adjustClose(b, 4); }
      else if (!both) c.sev = Math.min(5, c.sev + 0);
    }
    H.fx(l, { hap: came.length >= 2 ? 2 : -1 });
    log('Họp gia đình: ' + (came.length ? came.map(function (x) { return x.name; }).join(', ') + ' có mặt' : 'không ai đến') + (absent.length ? '; ' + absent.map(function (x) { return x.name; }).join(', ') + ' vắng mặt' : '') + '.' + (solved ? ' Mọi người nói thẳng với nhau và khép lại chuyện "' + solved.text + '".' : open.length ? ' Chuyện "' + open[0].text + '" vẫn chưa ngã ngũ.' : ' Cả nhà bàn kế hoạch chung cho năm tới.'), came.length >= 2 ? 'good' : 'neutral');
    return { came: came.map(function (x) { return x.id; }), solved: !!solved };
  }
  X.menu('familyHead148_member', 'Quyền lợi của người thân', headWhy,
    function (l, d) { var x = rel(l, d && d.arg && d.arg.id); if (!x) return 'Không tìm thấy người thân.'; var b = benefits(l, x.id); return x.name + ' · ' + x.kind + ' · ' + x.age + ' tuổi · thân thiết ' + Math.round(closeOf(x)) + '/100.' + (b.length ? ' Đang hưởng: ' + b.map(function (y) { return BENEFIT[y.k].n + ' ' + mo(l, y.cost) + '/năm'; }).join(', ') + '.' : ' Chưa hưởng quyền lợi nào.') + ' Quyền lợi chi từ tiền của bạn mỗi năm; thu hồi có thể gây tổn thương.'; },
    function (l, arg) {
      var x = rel(l, arg.id); if (!x) return [];
      var rows = [], b = benefits(l, x.id);
      Object.keys(BENEFIT).forEach(function (k) {
        var has = b.find(function (y) { return y.k === k; }), B = BENEFIT[k];
        if (has) rows.push({ k: 'revoke:' + k, l: 'Thu hồi: ' + B.n, run: function (l, r, log) { b.splice(b.indexOf(has), 1); adjustClose(x, -8); if (r() < 0.5) conflict(l, x, null, x.name + ' phản đối việc bị cắt ' + B.n.toLowerCase()); log('Bạn thu hồi ' + B.n.toLowerCase() + ' của ' + x.name + '. ' + x.name + ' tỏ ra không vui.', 'neutral'); } });
        else rows.push({ k: 'grant:' + k, l: 'Cấp: ' + B.n, h: mo(l, l.base * B.cost) + '/năm', why: k === 'study' && !(x.p.grandchildren129 || []).length && x.kind !== 'con' ? 'Người này chưa có con nhỏ đi học' : true, run: function (l, r, log) { grant(l, r, log, x, k); } });
      });
      rows.push({ k: 'gift', l: 'Hỗ trợ tài chính một lần', h: mo(l, l.base), why: liquid(l) < l.base + reserve(l) ? 'Chưa đủ tiền mặt' : x.p.helpAt148 === l.age ? 'Đã hỗ trợ năm nay' : true, run: function (l, r, log) {
        x.p.helpAt148 = l.age;
        if (x.p.inc && x.p.inc * 12 > l.base * 3 && r() < 0.6) { log(x.name + ' cảm ơn nhưng từ chối nhận tiền: "Con/em tự lo được, để dành cho người cần hơn."', 'neutral'); adjustClose(x, 2); return; }
        H.cash(l, -l.base, 'Hỗ trợ ' + x.name); adjustClose(x, 4); log('Bạn hỗ trợ ' + x.name + ' ' + mo(l, l.base) + '. Khoản tiền từ nay thuộc về ' + x.name + '.', 'good');
      } });
      return rows;
    });
  function grant(l, r, log, x, k) {
    var b = benefits(l, x.id), B = BENEFIT[k];
    if (b.some(function (y) { return y.k === k; })) return;
    var proud = x.p.inc && x.p.inc * 12 > l.base * 4;
    if (proud && r() < 0.5) { log(x.name + ' từ chối ' + B.n.toLowerCase() + ', muốn tự lập về tài chính.', 'neutral'); return; }
    b.push({ k: k, cost: l.base * B.cost, since: l.age }); adjustClose(x, 3);
    log('Bạn cấp ' + B.n.toLowerCase() + ' cho ' + x.name + ' (' + mo(l, l.base * B.cost) + '/năm). Những người thân khác sẽ để ý xem có công bằng không.', 'good');
  }
  function conflict(l, a, b, text) {
    var s = S(l); if (s.conflicts.some(function (c) { return !c.closed && c.text === text; })) return null;
    var c = { a: a.id, b: b ? b.id : null, text: text, sev: 1, at: l.age, closed: false }; X.uid(l, c); s.conflicts.push(c);
    if (s.conflicts.length > 20) s.conflicts = s.conflicts.filter(function (x, i) { return !x.closed || i >= s.conflicts.length - 10; });
    return c;
  }
  X.menu('familyHead148_conflict', 'Giải quyết mâu thuẫn gia đình', headWhy,
    function (l, d) { var c = S(l).conflicts.find(function (x) { return x.uid110 === (d && d.arg && d.arg.id); }); return c ? c.text + ' · mức căng thẳng ' + c.sev + '/5 · từ năm ' + c.at + ' tuổi. Mâu thuẫn để lâu sẽ tăng dần.' : 'Mâu thuẫn đã khép lại.'; },
    function (l, arg) {
      var c = S(l).conflicts.find(function (x) { return x.uid110 === arg.id; }); if (!c || c.closed) return [];
      var a = rel(l, c.a), b = c.b ? rel(l, c.b) : null, rows = [];
      function tried() { c.tried = true; c.at = l.age; }
      rows.push({ k: 'talk', l: 'Gặp riêng từng người, hòa giải', run: function (l, r, log) { tried(); var p = 0.3 + (a ? closeOf(a) : 50) / 250 + (b ? closeOf(b) : 50) / 250 - c.sev * 0.06; if (r() < p) { c.closed = true; c.result = 'hòa giải'; log('Sau nhiều lần nói chuyện, mâu thuẫn "' + c.text + '" được hóa giải.', 'good'); } else { log('Mọi người vẫn giữ quan điểm; chuyện "' + c.text + '" chưa xong.', 'neutral'); } } });
      if (a && b) {
        rows.push({ k: 'sideA', l: 'Đứng về phía ' + a.name, run: function (l, r, log) { tried(); c.closed = true; c.result = 'phân xử'; adjustClose(a, 4); adjustClose(b, -10); log('Bạn phân xử nghiêng về ' + a.name + '. ' + b.name + ' cảm thấy bị đối xử bất công.', 'neutral'); } });
        rows.push({ k: 'sideB', l: 'Đứng về phía ' + b.name, run: function (l, r, log) { tried(); c.closed = true; c.result = 'phân xử'; adjustClose(b, 4); adjustClose(a, -10); log('Bạn phân xử nghiêng về ' + b.name + '. ' + a.name + ' cảm thấy bị đối xử bất công.', 'neutral'); } });
      }
      rows.push({ k: 'pay', l: 'Bù đắp bằng một khoản tiền', h: mo(l, l.base * c.sev * 0.5), why: liquid(l) < l.base * c.sev * 0.5 + reserve(l) ? 'Chưa đủ tiền mặt' : true, run: function (l, r, log) { tried(); var v = l.base * c.sev * 0.5; H.cash(l, -v, 'Bù đắp mâu thuẫn gia đình'); if (r() < 0.65) { c.closed = true; c.result = 'bù đắp'; log('Khoản bù đắp giúp mọi người dịu lại.', 'good'); } else log('Tiền không giải quyết được hết; vẫn còn khúc mắc.', 'neutral'); } });
      return rows;
    });
  // Mâu thuẫn sinh ra từ hoàn cảnh thật: chức vụ, quyền lợi chênh lệch; để lâu thì leo thang.
  function familyYear(l, r, log) {
    var s = S(l), list = relatives(l);
    Object.keys(s.benefits).forEach(function (id) {
      var x = rel(l, id), b = s.benefits[id];
      if (!x) { delete s.benefits[id]; return; }
      b.slice().forEach(function (y) { if (liquid(l) >= y.cost) H.cash(l, -y.cost, BENEFIT[y.k].n + ' cho ' + x.name); else { b.splice(b.indexOf(y), 1); adjustClose(x, -4); log('Không đủ tiền chi ' + BENEFIT[y.k].n.toLowerCase() + ' cho ' + x.name + ', khoản hỗ trợ tạm dừng.', 'bad'); } });
    });
    var kids = list.filter(function (x) { return x.kind === 'con'; });
    if (kids.length >= 2 && r() < 0.25) {
      var withRole = kids.filter(function (x) { return x.p.role147; }), without = kids.filter(function (x) { return !x.p.role147; });
      var richer = kids.slice().sort(function (a, b) { return benefits(l, b.id).length - benefits(l, a.id).length; });
      if (withRole.length && without.length) conflict(l, without[0], withRole[0], without[0].name + ' không phục khi ' + withRole[0].name + ' giữ chức trong công ty gia đình');
      else if (benefits(l, richer[0].id).length - benefits(l, richer[richer.length - 1].id).length >= 2) conflict(l, richer[richer.length - 1], richer[0], richer[richer.length - 1].name + ' cho rằng bạn ưu ái ' + richer[0].name);
    }
    s.conflicts.forEach(function (c) {
      if (c.closed || c.at === l.age) return;
      c.sev = Math.min(5, c.sev + 1);
      [c.a, c.b].forEach(function (id) { var x = id && rel(l, id); if (x) adjustClose(x, -2); else if (id) { c.closed = true; c.result = 'không còn người liên quan'; } });
      if (c.sev === 5 && !c.peak) { c.peak = true; log('Mâu thuẫn "' + c.text + '" lên đến đỉnh điểm, họ hàng bắt đầu chia phe.', 'bad'); }
    });
  }

  // ===================================================================
  // C6. Trải nghiệm thượng lưu và sưu tầm
  // ===================================================================
  var EXP = {
    golf: { n: 'Giải golf giao hữu ở câu lạc bộ hạng sang', cost: 0.3, tier: 2, since: 1995, meet: 0.5, kind: 'business' },
    horse: { n: 'Khán đài VIP đua ngựa', cost: 0.6, tier: 3, since: 2000, meet: 0.4, kind: 'investor' },
    gala: { n: 'Dự dạ tiệc gala thời trang', cost: 0.8, tier: 3, since: 2000, meet: 0.6, kind: 'artist' },
    track: { n: 'Lái siêu xe trên trường đua', cost: 1, tier: 3, since: 2010, meet: 0.3, kind: 'athlete', risk: 0.04 },
    yacht: { n: 'Hải trình du thuyền cuối tuần', cost: 2, tier: 3, since: 2005, meet: 0.35, kind: 'business', cat: 'yacht' },
    jet: { n: 'Chuyến bay riêng nghỉ dưỡng nước ngoài', cost: 5, tier: 4, since: 2008, meet: 0.3, kind: 'investor', cat: 'jet' },
    island: { n: 'Kỳ nghỉ trên đảo riêng', cost: 6, tier: 4, since: 2010, meet: 0.2, kind: 'pro', cat: 'island' }
  };
  function expCost(l, k) { var x = EXP[k]; return l.base * x.cost * (x.cat && own(l, x.cat) ? 0.2 : 1); }
  X.menu('elite148', 'Trải nghiệm thượng lưu', function (l) { var w = free(l); if (w !== true) return w; return tier(l) >= 2 ? true : 'Cần thuộc tầng Giàu có trở lên (hiện: ' + tierName(l) + ')'; },
    function (l) { return 'Tầng lớp: ' + tierName(l) + '. Mỗi trải nghiệm một lần mỗi năm; chi phí trừ thật. Sở hữu du thuyền, máy bay, đảo riêng giúp giảm chi phí chuyến đi nhưng tốn phí duy trì hằng năm. Có thể quen người mới ở những nơi này.'; },
    function (l) {
      return Object.keys(EXP).map(function (k) {
        var x = EXP[k], c = expCost(l, k), why = !since(l, x) ? 'Thời kỳ này chưa có dịch vụ này' : doneThisYear(l, 'exp:' + k) ? 'Đã trải nghiệm năm nay' : tier(l) < x.tier && !(x.cat && own(l, x.cat)) ? 'Cần thuộc tầng ' + TIERS[x.tier].n : liquid(l) < c + reserve(l) ? 'Chưa đủ tiền mặt' : true;
        return { k: k, l: x.n, h: mo(l, c), why: why, run: function (l, r, log) { experience(l, r, log, k); } };
      });
    }, 18, 'Giải trí & trải nghiệm');
  function experience(l, r, log, k) {
    var x = EXP[k], c = expCost(l, k); if (doneThisYear(l, 'exp:' + k) || liquid(l) < c) return null;
    mark(l, 'exp:' + k); H.cash(l, -c, x.n);
    var fx = { hap: 4, soc: 1 }, extra = '';
    if (x.risk && r() < x.risk) { fx.hea = -8; extra = ' Một pha vào cua quá đà khiến bạn bị thương nhẹ.'; }
    H.fx(l, fx);
    var p = null;
    if (r() < x.meet) p = meet(l, r, { kind: x.kind, where: x.n.toLowerCase(), tier: U.clamp(tier(l) + (r() < 0.3 ? 1 : 0), 0, 4) });
    else { var old = contacts(l, function (q) { return q.kind === x.kind; })[0]; if (old && r() < 0.5) { seen(l, old, x.n.toLowerCase(), 3); extra += ' Bạn tình cờ gặp lại ' + label(l, old) + '.'; } }
    log(x.n + ' (' + mo(l, c) + ').' + (p ? ' Bạn làm quen ' + label(l, p) + '.' : '') + extra, 'good');
    return p;
  }
  X.menu('collect148', 'Sưu tầm và tài sản xa xỉ', function (l) { var w = free(l); if (w !== true) return w; return tier(l) >= 1 || mine(l).length ? true : 'Cần thuộc tầng Khá giả trở lên'; },
    function (l) { var m = mine(l); return 'Giá trị sưu tầm thay đổi theo thị trường, có món tăng, có món giảm. Bán qua đấu giá mất khoảng 10% phí. Món đã tặng thuộc về người nhận. ' + (m.length ? 'Đang sở hữu ' + m.length + ' món, ước tính ' + mo(l, itemValue(l)) + '.' : 'Chưa có món nào.'); },
    function (l) {
      var rows = mine(l).slice(0, 14).map(function (x) { return { k: 'own:' + x.uid110, l: x.name + ' · mua ' + mo(l, x.buy) + ' · hiện ' + mo(l, x.value), run: function (l, r) { X.next(l, 'collect148_item', r, { id: x.uid110 }); } }; });
      Object.keys(CAT).forEach(function (c) { var C = CAT[c]; rows.push({ k: 'buy:' + c, l: 'Mua ' + C.n.toLowerCase(), why: !since(l, C) ? 'Thời kỳ này chưa phổ biến' : C.tier && tier(l) < C.tier ? 'Cần thuộc tầng ' + TIERS[C.tier].n : true, run: function (l, r) { X.next(l, 'collect148_buy', r, { cat: c }); } }); });
      return rows;
    }, 18, 'Tiền bạc');
  X.menu('collect148_buy', 'Chọn món muốn mua', function (l) { return free(l); },
    function (l, d) { var C = CAT[d && d.arg && d.arg.cat]; return C ? C.n + ': giá tham khảo, đã gồm phí giám định. ' + (C.upkeep ? 'Phí duy trì khoảng ' + Math.round(C.upkeep * 100) + '% giá trị mỗi năm.' : '') : ''; },
    function (l, arg) {
      var C = CAT[arg.cat]; if (!C) return [];
      return C.list.map(function (it, i) { var price = it[1] * l.base; return { k: String(i), l: it[0], h: mo(l, price), why: liquid(l) < price + reserve(l) ? 'Chưa đủ tiền mặt' : true, run: function (l, r, log) { buy(l, r, log, arg.cat, i); } }; });
    });
  function buy(l, r, log, cat, i) {
    var C = CAT[cat], it = C.list[i], price = it[1] * l.base * (0.9 + r() * 0.2);
    if (liquid(l) < price) return null;
    H.cash(l, -price, 'Mua ' + it[0]);
    var x = addItem(l, { cat: cat, name: it[0], buy: price });
    log('Bạn mua ' + it[0] + ' với giá ' + mo(l, price) + '.', 'neutral');
    return x;
  }
  X.menu('collect148_item', 'Món trong bộ sưu tập', function (l) { return free(l); },
    function (l, d) { var x = items(l).find(function (y) { return y.uid110 === (d && d.arg && d.arg.id); }); return x ? x.name + ' · giá mua ' + mo(l, x.buy) + ' · định giá hiện tại ' + mo(l, x.value) + (x.from !== 'mua' ? ' · nguồn: ' + x.from : '') + '.' : 'Món này không còn thuộc về bạn.'; },
    function (l, arg) {
      var x = items(l).find(function (y) { return y.uid110 === arg.id && y.owner === 'me'; }); if (!x) return [];
      var rows = [{ k: 'sell', l: 'Bán đấu giá', h: '≈ ' + mo(l, x.value * 0.9), run: function (l, r, log) { sell(l, r, log, x); } }];
      relatives(l).concat((l.partner && l.partner.status === 'dating') ? [{ id: X.uid(l, l.partner), p: l.partner, name: l.partner.name, kind: 'người yêu' }] : []).slice(0, 8).forEach(function (y) {
        rows.push({ k: 'give:' + y.id, l: 'Tặng cho ' + y.name + ' (' + y.kind + ')', run: function (l, r, log) { if (transfer(l, x, y.id, y.name)) { adjustClose(y, Math.min(10, 2 + Math.round(x.value / l.base))); log('Bạn tặng ' + x.name + ' cho ' + y.name + '. Từ nay món này thuộc về ' + y.name + '.', 'good'); } } });
      });
      return rows;
    });
  function sell(l, r, log, x) {
    if (x.owner !== 'me') return 0;
    var price = x.value * (0.85 + r() * 0.1);
    H.cash(l, price, 'Bán ' + x.name);
    items(l).splice(items(l).indexOf(x), 1);
    log('Bạn bán ' + x.name + ' được ' + mo(l, price) + ' (giá mua ' + mo(l, x.buy) + ').', price >= x.buy ? 'good' : 'neutral');
    return price;
  }
  function itemsYear(l, r, log) {
    mine(l).slice().forEach(function (x) {
      var C = CAT[x.cat]; if (!C) return;
      x.value = Math.max(x.buy * 0.1, x.value * (1 + C.trend + C.vol * (r() * 2 - 1)));
      if (C.upkeep) {
        var fee = x.value * C.upkeep;
        if (liquid(l) >= fee) H.cash(l, -fee, 'Duy trì ' + x.name);
        else { var p = x.value * 0.8; H.cash(l, p, 'Bán gấp ' + x.name); items(l).splice(items(l).indexOf(x), 1); log('Không đủ tiền duy trì ' + x.name + ', bạn buộc phải bán gấp được ' + mo(l, p) + '.', 'bad'); }
      }
    });
    if (items(l).length > 80) S(l).items = items(l).filter(function (x, i) { return x.owner === 'me' || i >= items(l).length - 40; });
  }

  // ===================================================================
  // Vòng năm: NPC già đi / qua đời, thương vụ, gia tộc, giá trị tài sản
  // ===================================================================
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive || !l.flags.elite148) return;
    var s = S(l); if (s.yearAt === l.age) return; s.yearAt = l.age;
    people(l).forEach(function (p) { if (!alive(p)) return; var a = pAge(l, p); if (a >= 65 && r() < Math.min(0.5, Math.pow((a - 60) / 40, 3))) { p.alive = false; p.died = yr(l); if (p.trust >= 55) log('Bạn nhận tin ' + label(l, p) + ' qua đời. Bạn đến viếng và nhớ lại lần đầu gặp ở ' + p.met[0].where + '.', 'neutral'); } });
    dealYear(l, r, log); familyYear(l, r, log); itemsYear(l, r, log);
  });

  E.ELITE148 = { S: S, rep: rep, TIERS: TIERS, tier: tier, tierName: tierName, wealth: wealth, meet: meet, seen: seen, find: find, label: label, contacts: contacts, people: people, relatives: relatives,
    party: party, partyCost: partyCost, venueWhy: venueWhy, propose: propose, dealChance: dealChance, dealYear: dealYear, amounts: amounts,
    meeting: meeting, grant: grant, conflict: conflict, familyYear: familyYear, benefits: benefits,
    experience: experience, buy: buy, sell: sell, itemsYear: itemsYear, addItem: addItem, transfer: transfer, mine: mine, items: items, itemValue: itemValue, CAT: CAT, EXP: EXP, DEAL: DEAL };
})(globalThis.G);

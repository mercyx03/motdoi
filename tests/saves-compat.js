/* Tương thích bản lưu cũ — nạp các bản lưu "mkn.current" do engine của 10 phiên bản cũ tạo ra
   (tests/fixtures/saves, dựng bằng tools/make-save-fixtures.js), chạy E.migrate như app.js khi bấm "Tiếp tục sống",
   rồi kiểm tra không mất dữ liệu và đời vẫn chơi tiếp được 5 năm.
   Giới hạn: đây là bản lưu do máy tự chơi tạo ra, KHÔNG phải bản lưu thật của người chơi; app.js còn khôi phục
   nhánh đời cha/mẹ từ localStorage 'mkn.branch112' (cần trình duyệt) — phần đó không được kiểm ở đây.
   Chạy: node tests/saves-compat.js [tên ca …] */
'use strict';
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const { run, year, settle, badText, clone, ROOT } = require('./lib/quick');
const DIR = path.join(ROOT, 'tests', 'fixtures', 'saves');
const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter(f => f.endsWith('.json.gz')).sort((a, b) => ver(a) - ver(b)) : [];
function ver(f) { const m = f.match(/^(\d+)\.(\d+)\.(\d+)/); return m ? +m[1] * 1e6 + +m[2] * 1e3 + +m[3] : 0; }
function read(f) { return JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(DIR, f)))); }
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const sum = a => (a || []).reduce((s, x) => s + (Number(x.bal) || 0), 0);
const nm = o => o && (o.name || o.n) || null;
// liệt kê các đường dẫn khác nhau giữa hai object (để báo cáo, tối đa n mục)
function diffPaths(a, b, p, out, n) {
  if (out.length >= n || same(a, b)) return out;
  if (a && b && typeof a === 'object' && typeof b === 'object') { for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diffPaths(a[k], b[k], p + '.' + k, out, n); }
  else out.push(p);
  return out;
}

function checkSave(t, G, pack, item) {
  const E = G.E, tag = 'v' + pack.version + ' ' + item.scenario;
  const old = item.save.life, before = clone(old);
  let l;
  try { l = E.migrate(clone(old)); } catch (e) { t.ok(false, tag + ': E.migrate gây lỗi — ' + String(e && e.message || e).slice(0, 200)); return; }
  t.ok(l && typeof l === 'object', tag + ': migrate trả về cuộc đời');
  let raw; try { raw = JSON.stringify({ life: l, cohort: item.save.cohort || [], speed: 1, auto: false, at: 0 }); } catch (e) { raw = null; }
  t.ok(!!raw, tag + ': bản đã nâng cấp vẫn ghi được ra JSON (không vòng tham chiếu)');

  // Danh tính & nơi sinh
  ['name', 'age', 'sex', 'birthYear', 'mode', 'country', 'birthCity', 'eth', 'id', 'rs'].forEach(k => { if (before[k] !== undefined) t.ok(same(l[k], before[k]), tag + ': giữ ' + k + ' (' + JSON.stringify(before[k]) + ' → ' + JSON.stringify(l[k]) + ')'); });
  if (before.prov) t.ok(l.prov && l.prov.old === before.prov.old, tag + ': giữ tỉnh/thành nơi sinh ' + before.prov.old);
  t.ok(!badText(E.placeText(l)) && !badText(E.statusLine(l)), tag + ': nơi sống và dòng trạng thái hiển thị sạch');
  // Gia đình
  ['mName', 'fName', 'mAlive', 'fAlive', 'noDad', 'q'].forEach(k => { if (before.fam && before.fam[k] !== undefined) t.ok(same(l.fam[k], before.fam[k]), tag + ': giữ gia đình.' + k); });
  t.ok((l.kids || []).length === (before.kids || []).length, tag + ': giữ số con (' + (before.kids || []).length + ')');
  (before.kids || []).forEach((k, i) => { const n = l.kids[i] || {}; t.ok(n.name === k.name && n.born === k.born && n.alive === k.alive && n.sex === k.sex, tag + ': giữ hồ sơ con ' + k.name); });
  // NPC & quan hệ
  t.ok(nm(l.partner) === nm(before.partner) && (l.partner && l.partner.status) === (before.partner && before.partner.status), tag + ': giữ người yêu/bạn đời ' + (nm(before.partner) || '(không có)'));
  if (before.partner) ['age', 'alive', 'since', 'job'].forEach(k => { if (before.partner[k] !== undefined) t.ok(same(l.partner[k], before.partner[k]), tag + ': giữ bạn đời.' + k); });
  t.ok(nm(l.bff) === nm(before.bff), tag + ': giữ bạn thân');
  [['sibList', 'anh chị em'], ['friends', 'bạn bè'], ['exList', 'người cũ']].forEach(([k, label]) => { if (Array.isArray(before[k])) t.ok(same((l[k] || []).map(nm), before[k].map(nm)), tag + ': giữ danh sách ' + label + ' (' + before[k].length + ')'); });
  // định danh & hồ sơ quan hệ đã có không bị đổi
  // định danh đã có phải giữ nguyên; migrate được phép BỔ SUNG định danh còn thiếu (bản lưu cũ chưa có parentId…)
  const idOf = o => o ? { uid110: o.uid110, parentId: o.parentId, family100: o.family100 && o.family100.uid, persona141: o.persona141 && JSON.stringify(o.persona141.traits) } : {};
  let added = 0;
  const keepIds = (a, b, who) => { const x = idOf(a), y = idOf(b); Object.keys(x).forEach(k => { if (x[k] != null) t.ok(y[k] === x[k], tag + ': giữ ' + k + ' của ' + who + ' (' + x[k] + ' → ' + y[k] + ')'); else if (y[k] != null) added++; }); };
  if (before.partner) keepIds(before.partner, l.partner, 'bạn đời');
  (before.kids || []).forEach((k, i) => keepIds(k, l.kids[i], 'con ' + k.name));
  if (added) t.info(tag + ': migrate bổ sung ' + added + ' định danh còn thiếu (không ghi đè định danh cũ)');
  const ppl = x => x && x.flags && x.flags.life138 && x.flags.life138.people ? Object.keys(x.flags.life138.people) : [];
  t.ok(ppl(before).every(k => ppl(l).includes(k)), tag + ': giữ hồ sơ người quen (life138, ' + ppl(before).length + ' người)');
  // Nghề nghiệp
  if (before.job) { t.ok(l.job && l.job.id === (E.resolveJob ? E.resolveJob(before.job.id) : before.job.id), tag + ': giữ nghề ' + before.job.id + ' → ' + (l.job && l.job.id)); t.ok(l.job && l.job.rank === before.job.rank, tag + ': giữ bậc nghề'); t.ok(!!E.CAR[l.job.id], tag + ': nghề có trong danh mục hiện tại'); }
  else t.ok(!l.job, tag + ': không tự thêm việc làm');
  t.ok(!!l.retired === !!before.retired, tag + ': giữ trạng thái nghỉ hưu');
  // Tiền, tài sản, nợ
  t.ok(l.money === before.money, tag + ': giữ tiền mặt (' + before.money + ' → ' + l.money + ')');
  t.ok((l.houseVal || 0) === (before.houseVal || 0) && !!l.ownHouse === !!before.ownHouse, tag + ': giữ nhà');
  if (before.vehVal != null) t.ok(l.vehVal === before.vehVal, tag + ': giữ xe');
  t.ok((l.loans || []).length === (before.loans || []).length && Math.abs(sum(l.loans) - sum(before.loans)) < 1e-6, tag + ': giữ các khoản nợ (' + (before.loans || []).length + ')');
  if (before.mortgage != null) t.ok(l.mortgage === before.mortgage, tag + ': giữ nợ mua nhà');
  if (before.assets) ['save', 'gold', 'stock', 'land'].forEach(k => t.ok((l.assets[k] || 0) === (before.assets[k] || 0), tag + ': giữ tài sản ' + k));
  ['props', 'ventures', 'pets'].forEach(k => { if (Array.isArray(before[k])) t.ok((l[k] || []).length === before[k].length, tag + ': giữ ' + k + ' (' + before[k].length + ')'); });
  t.ok(Number.isFinite(E.netWorth(l)), tag + ': tài sản ròng tính được');
  // Nhật ký
  t.ok(l.log.length >= before.log.length && same(l.log.slice(0, before.log.length), before.log), tag + ': giữ nguyên ' + before.log.length + ' dòng nhật ký');
  t.ok((l.mem || []).length >= Math.min(50, (before.mem || []).length), tag + ': giữ ký ức');
  // Lựa chọn đang chờ
  const pend0 = (before.pending || []).map(d => d.id), pend1 = l.pending.map(d => d.id);
  const dropped = pend0.filter(id => !pend1.includes(id));
  dropped.forEach(id => { if (E.DEC[id]) t.ok(false, tag + ': migrate bỏ mất lựa chọn đang chờ "' + id + '" dù tình huống vẫn tồn tại'); else t.warn(tag + ': lựa chọn đang chờ "' + id + '" bị bỏ vì tình huống không còn trong phiên bản hiện tại'); });
  t.ok(l.pending.every(d => E.DEC[d.id] && Array.isArray(d.opts) && d.opts.length), tag + ': các lựa chọn đang chờ còn định nghĩa và phương án');
  // migrate lần hai không được làm đổi dữ liệu (tải lại nhiều lần)
  const again = E.migrate(clone(l));
  if (!same(again, l)) t.warn(tag + ': chạy migrate lần hai làm đổi: ' + diffPaths(l, again, 'life', [], 6).join(', '));

  // Chơi tiếp như app.js: giải quyết lựa chọn đang chờ, rồi 5 năm tự động
  const age0 = l.age, log0 = l.log.length;
  try {
    settle(E, l);
    if (l.alive && item.point === 'pending') { E.finishYear(l); settle(E, l); E.endYear(l); }
    for (let y = 0; y < 5 && l.alive; y++) year(E, l);
  } catch (e) { t.ok(false, tag + ': lỗi khi chơi tiếp sau khi tải — ' + String(e && e.stack || e).split('\n').slice(0, 3).join(' | ')); return; }
  t.ok(l.alive ? l.age > age0 : !!(l.death && Number.isFinite(l.death.age)), tag + ': chơi tiếp được (tuổi ' + age0 + ' → ' + l.age + (l.alive ? '' : ', qua đời có ghi nhận') + ')');
  t.ok(!l.log.slice(log0).some(e => badText(e.t)), tag + ': nhật ký mới không có chữ hỏng');
  ['hea', 'hap', 'kno', 'soc'].forEach(k => t.ok(Number.isFinite(l.st[k]) && l.st[k] >= 0 && l.st[k] <= 100, tag + ': chỉ số ' + k + ' hợp lệ sau 5 năm'));
  t.ok(Number.isFinite(l.money) && Number.isFinite(E.netWorth(l)), tag + ': tiền hữu hạn sau 5 năm');
  t.ok((l.kids || []).length >= (before.kids || []).length, tag + ': không mất con khi chơi tiếp');
  return { kb: Math.round(raw.length / 1024), pending: pend0.length, dropped: dropped.length };
}

const cases = files.map(f => ({ name: f.replace(/\.json\.gz$/, ''), timeoutMs: 120000, run(t, G) {
  const pack = read(f);
  t.ok(pack.format === 'motdoi-save-fixtures/1' && pack.saves.length > 0, 'fixture hợp lệ');
  let kb = 0, pend = 0, drop = 0;
  pack.saves.forEach(item => { const r = checkSave(t, G, pack, item); if (r) { kb = Math.max(kb, r.kb); pend += r.pending; drop += r.dropped; } });
  t.info('v' + pack.version + ' (' + pack.short + ', ' + pack.date + '): ' + pack.saves.length + ' bản lưu · ' + pend + ' lựa chọn đang chờ, ' + drop + ' bị bỏ · bản lớn nhất sau nâng cấp ' + kb + ' KB');
} }));
if (!cases.length) { console.log('Không có fixture trong tests/fixtures/saves — chạy: node tools/make-save-fixtures.js'); process.exitCode = 1; }
else run('Tương thích bản lưu cũ', cases, { footer: 'Bản lưu trong fixture do engine cũ tự chơi tạo ra, không phải bản lưu thật của người chơi.' });

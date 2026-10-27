/* Một Đời — lưu trữ cục bộ an toàn (không phụ thuộc giao diện, chạy được cả trong Node để kiểm thử).
   · ghi: đóng gói JSON có bắt lỗi, chặn bản quá lớn, phân loại lỗi (đầy bộ nhớ / bị chặn / không đóng gói được),
     đọc lại để chắc dữ liệu đã nằm trong bộ nhớ. localStorage.setItem thất bại thì bản cũ vẫn còn nguyên — không bao giờ xóa trước khi ghi.
   · đọc: phân biệt "không có", "đọc được", "hỏng JSON", "bị chặn". Bản hỏng được giữ lại ở khóa phụ `<khóa>.held` (tối đa 2 bản,
     chỉ chép khi chưa có) trước khi bất kỳ lần ghi nào có thể đè lên — để người chơi còn tải về được.
   · nạp cuộc đời đang chơi: kiểm tra cấu trúc (E.checkSave), chạy migrate trên BẢN SAO, lỗi thì không ghi đè gì.
   · nhật ký lỗi lưu: tối đa 20 dòng trong bộ nhớ + 10 dòng ngắn ở 'mkn.saveErrors'.
   Giữ nguyên mọi khóa lưu trữ cũ ('mkn.current', 'mkn.memorial'…). */
(function (G) {
  'use strict';
  var MAX_CHARS = 4500000;          // ~ giới hạn 5 triệu ký tự của localStorage ở đa số trình duyệt, chừa chỗ cho khóa khác
  var WARN_CHARS = 2000000;         // bản lưu lớn hơn mức này vẫn ghi nhưng được báo để theo dõi
  var CLOUD = { chars: 1450000, bytes: 1550000 }; // máy chủ: dữ liệu ≤ 1.500.000 ký tự, cả yêu cầu ≤ 1.600.000 byte UTF-8 (public/_worker.js)
  var ERR_KEY = 'mkn.saveErrors', HELD_MAX = 2;
  var mem = [];

  function storage(st) { if (st) return st; try { return typeof localStorage !== 'undefined' ? localStorage : null; } catch (e) { return null; } } // chỉ đọc biến localStorage cũng có thể ném SecurityError
  function now() { return Date.now(); }
  function kind(e) {
    if (!e) return 'WRITE';
    var n = e.name || '', c = e.code;
    if (n === 'QuotaExceededError' || n === 'NS_ERROR_DOM_QUOTA_REACHED' || c === 22 || c === 1014) return 'QUOTA';
    if (n === 'SecurityError' || c === 18) return 'BLOCKED';
    return 'WRITE';
  }
  function bytes(s) { if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(s).length; var n = 0; for (var i = 0; i < s.length; i++) { var c = s.charCodeAt(i); n += c < 0x80 ? 1 : c < 0x800 ? 2 : c >= 0xd800 && c < 0xdc00 ? (i++, 4) : 3; } return n; }

  function logError(where, code, detail, st) {
    var row = { at: now(), where: String(where).slice(0, 40), code: String(code).slice(0, 40), detail: String(detail || '').slice(0, 160) };
    mem.push(row); if (mem.length > 20) mem.shift();
    if (typeof console !== 'undefined' && console.warn) console.warn('[Một Đời] lưu thất bại', row);
    // ghi kèm vào bộ nhớ nếu còn chỗ; bản ghi nhỏ, tối đa 10 dòng, lỗi khi ghi thì bỏ qua (không đệ quy)
    var s = storage(st); if (!s) return row;
    try { var old = JSON.parse(s.getItem(ERR_KEY) || '[]'); if (!Array.isArray(old)) old = []; old.push(row); s.setItem(ERR_KEY, JSON.stringify(old.slice(-10))); } catch (e) { /* bộ nhớ đầy hoặc bị chặn */ }
    return row;
  }
  function errors(st) { var out = mem.slice(), s = storage(st); try { var x = s && JSON.parse(s.getItem(ERR_KEY) || '[]'); if (Array.isArray(x)) x.forEach(function (r) { if (!out.some(function (m) { return m.at === r.at && m.code === r.code; })) out.push(r); }); } catch (e) { } return out.sort(function (a, b) { return a.at - b.at; }); }

  function readRaw(key, st) {
    var s = storage(st); if (!s) return { status: 'blocked' };
    try { var raw = s.getItem(key); return raw == null ? { status: 'empty' } : { status: 'raw', raw: raw }; } catch (e) { return { status: 'blocked', error: e }; }
  }
  // Giữ một bản dữ liệu không đọc được ở `<khóa>.held` (không chép lại nếu đã giữ đúng bản đó; tối đa HELD_MAX bản).
  function hold(key, raw, reason, st) {
    var s = storage(st); if (!s || raw == null) return false;
    try {
      var list = JSON.parse(s.getItem(key + '.held') || '[]'); if (!Array.isArray(list)) list = [];
      if (list.some(function (x) { return x && x.raw === raw; })) return true;
      list.push({ at: now(), reason: reason, raw: raw });
      s.setItem(key + '.held', JSON.stringify(list.slice(-HELD_MAX)));
      return true;
    } catch (e) { logError('hold:' + key, kind(e), e && e.message, st); return false; }
  }
  function held(key, st) { var s = storage(st); try { var x = s && JSON.parse(s.getItem(key + '.held') || '[]'); return Array.isArray(x) ? x : []; } catch (e) { return []; } }
  // Đọc JSON. Bản hỏng được giữ lại (hold) và báo status 'corrupt' — người gọi tự quyết dùng giá trị mặc định.
  function read(key, st) {
    var r = readRaw(key, st);
    if (r.status !== 'raw') return r;
    try { return { status: 'ok', value: JSON.parse(r.raw), raw: r.raw }; }
    catch (e) { var kept = hold(key, r.raw, 'JSON hỏng', st); logError('read:' + key, 'CORRUPT', e && e.message, st); return { status: 'corrupt', raw: r.raw, held: kept, error: e }; }
  }
  // Ghi JSON. Thất bại thì giá trị cũ ở khóa này vẫn còn (localStorage không xóa khi setItem lỗi).
  function write(key, value, opt, st) {
    opt = opt || {};
    var s = storage(st), text;
    if (!s) return fail('BLOCKED', 'Trình duyệt không cho dùng bộ nhớ cục bộ');
    try { text = JSON.stringify(value); } catch (e) { return fail('SERIALIZE', e && e.message); }
    if (typeof text !== 'string') return fail('SERIALIZE', 'Không có dữ liệu để lưu');
    var max = opt.max || MAX_CHARS;
    if (text.length > max) return fail('TOO_LARGE', Math.round(text.length / 1024) + ' KB', text.length);
    try { s.setItem(key, text); } catch (e) { return fail(kind(e), e && (e.name + ': ' + e.message), text.length); }
    // một số trình duyệt (chế độ riêng tư cũ) nhận lệnh nhưng không lưu: đọc lại để chắc chắn
    var back; try { back = s.getItem(key); } catch (e) { back = null; }
    if (back !== text) return fail('VERIFY', 'Đọc lại không khớp dữ liệu vừa ghi', text.length);
    return { ok: true, chars: text.length, large: text.length > WARN_CHARS };
    function fail(code, detail, n) { if (!opt.quiet) logError('write:' + key, code, detail, st); return { ok: false, code: code, detail: detail, chars: n || 0 }; }
  }
  function remove(key, st) { var s = storage(st); try { if (s) s.removeItem(key); return true; } catch (e) { return false; } }

  // Kiểm tra bản "đang chơi dở" mà không ghi gì: { status: 'empty'|'ok'|'dead'|'corrupt'|'blocked'|'invalid'|'future'|'migrate', save, life, error }
  // migrate chạy trên bản sao, nên lỗi giữa chừng không làm hỏng dữ liệu gốc.
  function inspect(key, E, migrateFn, st) {
    var r = read(key, st);
    if (r.status !== 'ok') return r;
    var save = r.value;
    if (!save || typeof save !== 'object' || !save.life || typeof save.life !== 'object') { hold(key, r.raw, 'thiếu dữ liệu cuộc đời', st); return { status: 'invalid', raw: r.raw }; }
    var chk = E.checkSave ? E.checkSave(save.life) : { ok: true };
    if (!chk.ok) { if (chk.code !== 'FUTURE_SCHEMA') hold(key, r.raw, chk.code, st); return { status: chk.code === 'FUTURE_SCHEMA' ? 'future' : 'invalid', code: chk.code, sv: chk.sv, max: chk.max, raw: r.raw }; }
    if (!save.life.alive) return { status: 'dead', save: save, raw: r.raw };
    var life;
    try { life = (migrateFn || E.migrate)(JSON.parse(r.raw).life); }
    catch (e) { hold(key, r.raw, 'migrate: ' + (e && e.message), st); logError('migrate:' + key, e && e.code || 'MIGRATE', e && e.message, st); return { status: 'migrate', error: e, raw: r.raw }; }
    return { status: 'ok', save: save, life: life, raw: r.raw };
  }

  // Gói dữ liệu gửi lên tài khoản: đếm cả ký tự lẫn byte UTF-8; quá lớn thì bỏ cuộc đời đang chơi, vẫn quá thì báo lỗi, không gửi.
  function cloudPack(d, limits) {
    limits = limits || CLOUD;
    function size(x) { var t = JSON.stringify(x); return { chars: t.length, bytes: bytes(t) }; }
    var a = size(d);
    if (a.chars <= limits.chars && a.bytes <= limits.bytes) return { ok: true, data: d, droppedCur: false, chars: a.chars, bytes: a.bytes };
    if (d && d.cur) {
      var x = Object.assign({}, d, { cur: null }), b = size(x);
      if (b.chars <= limits.chars && b.bytes <= limits.bytes) return { ok: true, data: x, droppedCur: true, chars: b.chars, bytes: b.bytes, fullBytes: a.bytes };
      return { ok: false, code: 'SAVE_TOO_LARGE', chars: b.chars, bytes: b.bytes, fullBytes: a.bytes };
    }
    return { ok: false, code: 'SAVE_TOO_LARGE', chars: a.chars, bytes: a.bytes };
  }

  // Lời nhắn cho người chơi theo mã lỗi
  var MSG = {
    QUOTA: 'Bộ nhớ trình duyệt đã đầy nên tiến trình mới nhất CHƯA được lưu.',
    BLOCKED: 'Trình duyệt đang chặn lưu dữ liệu (chế độ ẩn danh hoặc cài đặt quyền riêng tư), tiến trình CHƯA được lưu.',
    SERIALIZE: 'Dữ liệu cuộc đời gặp lỗi khi đóng gói nên CHƯA được lưu.',
    TOO_LARGE: 'Bản lưu quá lớn so với bộ nhớ trình duyệt nên CHƯA được lưu.',
    VERIFY: 'Trình duyệt không giữ được dữ liệu vừa lưu.',
    WRITE: 'Không ghi được dữ liệu vào trình duyệt.',
    HELD: 'Còn một bản lưu cũ không mở được; game chưa ghi đè lên nó.'
  };
  function message(code) { return MSG[code] || MSG.WRITE; }

  G.SaveStore = { read: read, write: write, remove: remove, readRaw: readRaw, hold: hold, held: held, inspect: inspect, cloudPack: cloudPack, bytes: bytes,
    logError: logError, errors: errors, message: message, MAX_CHARS: MAX_CHARS, WARN_CHARS: WARN_CHARS, CLOUD: CLOUD };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));

/* Một Đời — v6.9.0: tài khoản & lưu tiến trình
   · đăng ký / đăng nhập chỉ bằng tên đăng nhập + mật khẩu (không cần email)
   · đồng bộ thành tựu, gia phả, đài tưởng niệm, các đời gần đây và cuộc đời đang chơi giữa các thiết bị
   · khi gộp dữ liệu hai nơi: thành tựu, gia phả, đài tưởng niệm được cộng dồn, không mất cái nào;
     cuộc đời đang chơi lấy bản mới hơn */
(function () {
  'use strict';
  if (typeof window === 'undefined' || typeof document === 'undefined') return; // chỉ chạy trong trình duyệt
  var KEY = 'mkn.account', K = { ach: 'mkn.ach', tree: 'mkn.tree', mem: 'mkn.memorial', recent: 'mkn.recent', cur: 'mkn.current' };
  function get(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function del(k) { try { localStorage.removeItem(k); } catch (e) { } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function acc() { var a = get(KEY, null); return a && /^[a-f0-9]{64}$/.test(a.t || '') ? a : null; }
  var MSG = { INVALID_DISPLAY_NAME: 'Tên hiển thị cần 2–32 ký tự, không dùng tên Admin.', DISPLAY_NAME_REQUIRED: 'Hãy đặt tên hiển thị trước khi bình luận.', INVALID_USERNAME: 'Tên đăng nhập 3–24 ký tự, chỉ gồm chữ thường không dấu, số, dấu chấm hoặc gạch dưới.', INVALID_PASSWORD: 'Mật khẩu từ 8 đến 128 ký tự.', USERNAME_TAKEN: 'Tên đăng nhập này đã có người dùng.', WRONG_LOGIN: 'Sai tên đăng nhập hoặc mật khẩu.', LOCKED: 'Đăng nhập sai nhiều lần, tài khoản tạm khóa 15 phút.', RATE_LIMIT: 'Bạn thao tác quá nhanh, hãy thử lại sau ít phút.', NOT_LOGGED_IN: 'Phiên đăng nhập đã hết hạn, hãy đăng nhập lại.', ACCOUNTS_NOT_CONFIGURED: 'Máy chủ chưa kết nối kho lưu trữ (REVIEWS_DB).', SAVE_TOO_LARGE: 'Dữ liệu quá lớn để lưu.', BODY_TOO_LARGE: 'Dữ liệu quá lớn để lưu.' };
  async function api(action, body, auth) {
    var h = { 'Content-Type': 'application/json' }, a = acc(); if (auth && a) h.Authorization = 'Bearer ' + a.t;
    var ctl = new AbortController(), tm = setTimeout(function () { ctl.abort(); }, 20000);
    try {
      var r = await fetch('/api/account', { method: 'POST', headers: h, body: JSON.stringify(Object.assign({ action: action }, body || {})), signal: ctl.signal, cache: 'no-store' }), v;
      try { v = await r.json(); } catch (e) { throw Error('Máy chủ chưa phản hồi đúng, hãy thử lại sau.'); }
      if (!r.ok || !v.ok) { var e = Error(MSG[v.code] || 'Chưa thực hiện được, hãy thử lại sau.'); e.code = v.code; e.rev = v.rev; throw e; }
      return v;
    } catch (e) { if (e.name === 'AbortError') throw Error('Máy chủ phản hồi chậm, hãy thử lại.'); if (e.name === 'TypeError') throw Error('Không kết nối được máy chủ.'); throw e; }
    finally { clearTimeout(tm); }
  }
  // ---------- gộp dữ liệu ----------
  function mergeAch(a, b) { var o = {}; [a || {}, b || {}].forEach(function (s) { Object.keys(s).forEach(function (k) { var x = s[k]; if (!x) return; if (!o[k] || (x.at && x.at < o[k].at)) o[k] = x; }); }); return o; }
  function mergeBy(a, b, key, newer, max) { var m = {}, order = []; (a || []).concat(b || []).forEach(function (x) { if (!x || x[key] == null) return; var k = String(x[key]); if (!m[k]) { order.push(k); m[k] = x; } else if ((x[newer] || 0) > (m[k][newer] || 0)) m[k] = Object.assign({}, m[k], x); else m[k] = Object.assign({}, x, m[k]); }); var out = order.map(function (k) { return m[k]; }); if (newer) out.sort(function (p, q) { return (p[newer] || 0) - (q[newer] || 0); }); return max ? out.slice(-max) : out; }
  function localData() { return { v: 1, ach: get(K.ach, {}), tree: get(K.tree, []), mem: get(K.mem, []), recent: get(K.recent, []), cur: get(K.cur, null) }; }
  function merge(remote, local) {
    remote = remote || {};
    var curR = remote.cur, curL = local.cur, cur = curL;
    if (curR && curR.life && (!curL || !curL.life || (curR.at || 0) > (curL.at || 0))) cur = curR;
    return { v: 1, ach: mergeAch(remote.ach, local.ach), tree: mergeBy(remote.tree, local.tree, 'id', 'at', 400), mem: mergeBy(remote.mem, local.mem, 'id', 'savedAt', 60), recent: mergeBy(local.recent, remote.recent, 'id', null, 10), cur: cur };
  }
  function applyLocal(d) {
    set(K.ach, d.ach); set(K.tree, d.tree); set(K.mem, d.mem); set(K.recent, d.recent);
    var app = window.G && window.G.App, playing = app && app.inLife && app.inLife();
    var changedCur = false;
    if (!playing && d.cur && d.cur.life) { var lc = get(K.cur, null); if (!lc || !lc.life || (d.cur.at || 0) > (lc.at || 0)) { set(K.cur, d.cur); changedCur = true; } }
    if (app && app.refresh) app.refresh();
    return changedCur;
  }
  function packed(d) { var s = JSON.stringify(d); if (s.length > 1400000 && d.cur) { var x = Object.assign({}, d, { cur: null }); return { data: x, droppedCur: true }; } return { data: d, droppedCur: false }; }
  var busy = null, lastSync = get('mkn.accountSync', 0);
  async function sync(why) {
    if (!acc()) return null; if (busy) return busy;
    busy = (async function () {
      for (var t = 0; t < 3; t++) {
        var remote = await api('load', null, true), merged = merge(remote.data, localData()), changed = applyLocal(merged), p = packed(merged);
        try { var r = await api('save', { data: p.data, rev: remote.rev }, true); lastSync = Date.now(); set('mkn.accountSync', lastSync); return { changedCur: changed, droppedCur: p.droppedCur, rev: r.rev }; }
        catch (e) { if (e.code !== 'CONFLICT') throw e; }
      }
      throw Error('Dữ liệu đang được lưu từ thiết bị khác, hãy thử lại.');
    })();
    try { return await busy; } finally { busy = null; }
  }
  // ---------- giao diện ----------
  function toast(m) { var t = document.createElement('div'); t.className = 'toast'; t.textContent = m; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2600); }
  function modal(html, bind) { var root = document.getElementById('modalRoot'); root.innerHTML = '<div class="overlay"><div class="card modal account-modal" role="dialog" aria-modal="true">' + html + '</div></div>'; bind(root.querySelector('.modal')); }
  function close() { document.getElementById('modalRoot').innerHTML = ''; }
  var unreadCount=0;
  function label() { var b = document.getElementById('accountBtn'), a = acc(); if (b) b.textContent = a ? '👤 ' + a.u + (unreadCount?' · 🔔 '+unreadCount:'') : '👤 Tài khoản'; }
  function counts() { var d = localData(); return Object.keys(d.ach || {}).length + ' thành tựu · ' + (d.tree || []).length + ' đời trong gia phả · ' + (d.mem || []).length + ' đời ở đài tưởng niệm'; }
  function open() {
    var a = acc();
    if (!a) {
      modal('<div class="agep">Tài khoản</div><h2>Lưu tiến trình lên tài khoản</h2><p class="small muted">Đăng nhập để giữ thành tựu, gia phả, đài tưởng niệm và cuộc đời đang chơi, rồi chơi tiếp trên máy khác. Không cần email. Hãy nhớ kỹ mật khẩu: game không thể khôi phục mật khẩu đã quên.</p>' +
        '<div class="go-row"><button class="btn gold sm" data-tab="login">Đăng nhập</button><button class="btn sm" data-tab="register">Tạo tài khoản</button></div>' +
        '<form id="accForm" class="family-form"><div id="accNameBox" hidden><label for="accName">Tên hiển thị khi bình luận</label><input id="accName" autocomplete="nickname" minlength="2" maxlength="32" placeholder="Tên mọi người sẽ nhìn thấy"></div><label for="accUser">Tên đăng nhập</label><input id="accUser" autocomplete="username" maxlength="24" required placeholder="Tên đăng nhập của bạn"><label for="accPass">Mật khẩu</label><input id="accPass" type="password" autocomplete="current-password" minlength="8" maxlength="128" required><div id="accPass2Box" hidden><label for="accPass2">Nhập lại mật khẩu</label><input id="accPass2" type="password" autocomplete="new-password" maxlength="128"></div><button class="btn primary" id="accSubmit" type="submit">Đăng nhập</button><p id="accStatus" role="status" aria-live="polite"></p></form>' +
        '<p class="small muted">Trên máy này đang có: ' + esc(counts()) + '. Khi đăng nhập, dữ liệu này được gộp vào tài khoản, không bị mất.</p><div class="go-row"><button class="btn ghost" id="accClose">Đóng</button></div>', function (box) {
        var mode = 'login';
        box.querySelectorAll('[data-tab]').forEach(function (b) { b.onclick = function () { mode = b.dataset.tab; box.querySelector('#accNameBox').hidden = mode !== 'register'; box.querySelector('#accName').required = mode === 'register'; box.querySelectorAll('[data-tab]').forEach(function (x) { x.classList.toggle('gold', x === b); }); box.querySelector('#accPass2Box').hidden = mode !== 'register'; box.querySelector('#accSubmit').textContent = mode === 'register' ? 'Tạo tài khoản' : 'Đăng nhập'; box.querySelector('#accPass').autocomplete = mode === 'register' ? 'new-password' : 'current-password'; }; });
        box.querySelector('#accClose').onclick = close;
        box.querySelector('#accForm').onsubmit = async function (e) {
          e.preventDefault(); var st = box.querySelector('#accStatus'), u = box.querySelector('#accUser').value.trim().toLowerCase(), p = box.querySelector('#accPass').value;
          if (mode === 'register' && p !== box.querySelector('#accPass2').value) { st.textContent = 'Hai lần nhập mật khẩu chưa khớp.'; return; }
          var btn = box.querySelector('#accSubmit'); btn.disabled = true; st.textContent = mode === 'register' ? 'Đang tạo tài khoản…' : 'Đang đăng nhập…';
          try { var r = await api(mode, { username: u, password: p, displayName: box.querySelector('#accName').value }); set(KEY, { u: r.username, t: r.token, displayName: r.displayName || '', role: r.role || 'member' }); label(); document.dispatchEvent(new Event('account-profile-changed')); st.textContent = 'Đang đồng bộ dữ liệu…'; var s = await sync('login'); close(); toast('Đã đăng nhập ' + r.username + ' và đồng bộ dữ liệu' + (s && s.changedCur ? ' · đã tải cuộc đời đang chơi' : '')); }
          catch (err) { st.textContent = err.message; } finally { btn.disabled = false; }
        };
      });
      return;
    }
    modal('<div class="agep">Tài khoản</div><h2>' + esc(a.u) + '</h2><form id="accProfile" class="family-form"><label for="accDisplayName">Tên hiển thị công khai</label><input id="accDisplayName" maxlength="32" minlength="2" value="'+esc(a.displayName||'')+'" required placeholder="Đặt tên để bình luận"><button class="btn" type="submit">Lưu tên hiển thị</button><p id="accProfileStatus" role="status"></p></form><p class="small muted">Đồng bộ lần cuối: ' + (lastSync ? new Date(lastSync).toLocaleString('vi-VN') : 'chưa') + '</p><p class="small">' + esc(counts()) + '</p>' +
      '<section aria-label="Thông báo"><h3>🔔 Thông báo <span id="accUnread"></span></h3><div id="accNotifications" role="status">Đang tải…</div><button class="btn" id="accReadNotifications">Đánh dấu đã đọc</button></section><div class="go-row"><button class="btn primary" id="accSync">Đồng bộ ngay</button><button class="btn" id="accOut">Đăng xuất</button><button class="btn ghost" id="accClose">Đóng</button></div><p id="accStatus" role="status" aria-live="polite"></p>' +
      '<details class="small" style="margin-top:12px"><summary>Xóa tài khoản</summary><p class="muted">Xóa vĩnh viễn tài khoản và bản lưu trên máy chủ. Dữ liệu trên máy này vẫn giữ nguyên.</p><input id="accDelPass" type="password" autocomplete="current-password" placeholder="Nhập mật khẩu để xác nhận"> <button class="btn sm" id="accDel">Xóa vĩnh viễn</button></details>', function (box) {
      var st = box.querySelector('#accStatus');
      inbox(box);
      box.querySelector('#accProfile').onsubmit = async function(e){e.preventDefault();var status=box.querySelector('#accProfileStatus'),button=this.querySelector('button');button.disabled=true;try{var r=await api('profile',{displayName:box.querySelector('#accDisplayName').value},true);var current=acc();if(current){current.displayName=r.displayName;current.role=r.role;set(KEY,current);}status.textContent='Đã lưu tên. Bạn có thể bình luận ở trang Cập nhật.';label();document.dispatchEvent(new Event('account-profile-changed'));}catch(err){status.textContent=err.message;}finally{button.disabled=false;}};
      api('me',null,true).then(function(r){var current=acc();if(current){current.displayName=r.displayName||'';current.role=r.role;set(KEY,current);box.querySelector('#accDisplayName').value=r.displayName||'';}}).catch(function(){});
      box.querySelector('#accClose').onclick = close;
      box.querySelector('#accSync').onclick = async function () { this.disabled = true; st.textContent = 'Đang đồng bộ…'; try { var s = await sync('manual'); st.textContent = 'Đã đồng bộ' + (s.changedCur ? ', đã tải cuộc đời đang chơi mới hơn' : '') + (s.droppedCur ? '. Cuộc đời đang chơi quá dài nên chưa lưu lên được, các dữ liệu khác đã lưu.' : '.'); } catch (e) { st.textContent = e.message; if (e.code === 'NOT_LOGGED_IN') { del(KEY); label(); document.dispatchEvent(new Event('account-profile-changed')); } } finally { this.disabled = false; } };
      box.querySelector('#accOut').onclick = async function () { try { await api('logout', null, true); } catch (e) { } del(KEY); label(); document.dispatchEvent(new Event('account-profile-changed')); close(); toast('Đã đăng xuất. Dữ liệu trên máy này vẫn còn.'); };
      box.querySelector('#accDel').onclick = async function () { var p = box.querySelector('#accDelPass').value; if (!p) { st.textContent = 'Hãy nhập mật khẩu để xác nhận.'; return; } if (!this.dataset.sure) { this.dataset.sure = '1'; this.textContent = 'Bấm lần nữa để xóa vĩnh viễn'; return; } try { await api('delete', { password: p }, true); del(KEY); label(); document.dispatchEvent(new Event('account-profile-changed')); close(); toast('Đã xóa tài khoản.'); } catch (e) { st.textContent = e.message; } };
    });
  }
    async function inbox(box){try{var owner=acc()&&acc().u;if(!owner){unreadCount=0;label();return;}var r=await api('notifications',{},true);if(!acc()||acc().u!==owner)return;unreadCount=r.count;label();if(!box)return;box.querySelector('#accUnread').textContent=r.count?'· '+r.count+' chưa đọc':'';var panel=box.querySelector('#accNotifications');panel.replaceChildren();if(!r.items.length)panel.textContent='Chưa có thông báo mới.';r.items.forEach(function(item){var row=document.createElement('p'),link=document.createElement('a');link.href='updates.html?thread='+item.threadId+'#comment-'+item.id;link.textContent=item.displayName+': '+item.body.slice(0,140);row.append(link);panel.append(row);});box.querySelector('#accReadNotifications').onclick=async function(){this.disabled=true;try{await api('notifications_read',{lastId:r.lastId},true);await inbox(box);}catch(e){panel.textContent=e.message;}finally{this.disabled=false;}};}catch(e){if(box)box.querySelector('#accNotifications').textContent='Chưa tải được thông báo. Mở lại tài khoản để thử lại.';}}
  document.addEventListener('account-profile-changed',function(){unreadCount=0;label();inbox();});
  setInterval(function(){if(!document.hidden&&acc())inbox();},45000);
  window.addEventListener('focus',function(){inbox();});
  var timer = null;
  function autoSync() { if (!acc()) return; clearTimeout(timer); timer = setTimeout(function () { sync('auto').catch(function (e) { if (e.code === 'NOT_LOGGED_IN') { del(KEY); label(); document.dispatchEvent(new Event('account-profile-changed')); } }); }, 1500); }
  window.G = window.G || {}; window.G.Account = { open: open, sync: sync, autoSync: autoSync, merge: merge, signedIn: function () { return !!acc(); }, profile: function(){var a=acc();return a?{displayName:a.displayName||'',username:a.u}:null;}, auth: function(action,body){return api(action,body,true);} };
  document.addEventListener('DOMContentLoaded', init); if (document.readyState !== 'loading') init();
  var inited = false;
  function init() { if (inited) return; inited = true; var b = document.getElementById('accountBtn'); if (b) b.onclick = open; label(); if (acc()) {autoSync();inbox();} }
})();

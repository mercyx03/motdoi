/* Một Đời — giao diện & vòng chơi */
(function () {
  'use strict';
  var U = G.U, E = G.E, VN = G.VN, W = G.W, esc = U.esc;
  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }

  // ---------- lưu trữ cục bộ (an toàn khi bị chặn) ----------
  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) { /* bỏ qua */ } }
  };
  // giữ nguyên khóa lưu trữ từ bản 1.0 để người chơi không mất dữ liệu
  var K = { settings: 'mkn.settings', cur: 'mkn.current', mem: 'mkn.memorial', theme: 'mkn.theme', last: 'mkn.lastEnd', recent: 'mkn.recent' };

  var DEF = { mode: 'vn', variant: '34', prov: '', eth: '', name: '', gender: 'random', lifeMin: 30 };
  var S = {
    set: Object.assign({}, DEF, LS.get(K.settings, {})),
    life: null, cohort: null, speed: 1, paused: false, auto: false, skipping: false,
    progress: 0, queue: [], phase: 'idle', yearRunning: false, last: 0, modalTimer: null
  };
  S.set.name = '';
  S.minorOnly = !!S.set.minorOnly;
  if (['random', 'M', 'F', 'lgbt', 'gay', 'lesbian', 'bi'].indexOf(S.set.gender) < 0) S.set.gender = 'random';

  function migrate(life) { return E.migrate(life); }

  // ---------- tiện ích giao diện ----------
  function show(id) {
    if (id !== 'life') { var dp = document.getElementById('decPill'); if (dp) dp.remove(); }
    $$('.screen').forEach(function (s) { s.classList.toggle('active', s.id === id); });
    window.scrollTo(0, 0);
    if (id === 'home') renderHome();
    if (id === 'memorial') renderMemorial();
  }
  function toast(msg) {
    var t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2400);
  }
  function copyText(txt, okMsg) {
    function fb() { var ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); toast(okMsg || 'Đã sao chép'); } catch (e) { toast('Không sao chép được'); } ta.remove(); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function () { toast(okMsg || 'Đã sao chép'); }, fb); else fb();
  }
  function shareLink(sum) {
    var url = location.origin + location.pathname + '#s=' + E.share.encode(sum);
    var text = '🕯 ' + sum.n + ' (' + sum.y + ', ' + sum.w + ')';
    if (navigator.share) navigator.share({ title: 'Một Đời — ' + sum.n, text: text, url: url }).catch(function () { copyText(url, 'Đã sao chép đường link chia sẻ'); });
    else copyText(url, 'Đã sao chép đường link chia sẻ');
  }
  function pct(x, d) { return U.fmtNum(x * 100, d == null ? 1 : d) + '%'; }
  function oneIn(x) { return x > 0 ? U.fmtNum(Math.max(1, Math.round(1 / x))) : '∞'; }
  function sexWord(l) { return l.sex === 'M' ? 'Nam' : 'Nữ'; }
  function ageStr(a) { return a + ' tuổi'; }
  function secPerYear(l) { return l.lifeMin * 60 / l.e0sex; }
  function stripVN(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D'); }
  function money(l, v, vnd) { return E.fmtMoney(l, v, vnd); }

  // ---------- giao diện sáng/tối ----------
  function applyTheme(t) { if (t) document.documentElement.setAttribute('data-theme', t); else document.documentElement.removeAttribute('data-theme'); }
  applyTheme(LS.get(K.theme, null));
  $('#themeBtn').addEventListener('click', function () {
    var dark = document.documentElement.getAttribute('data-theme') !== 'light'; // mặc định: giao diện đêm
    var next = dark ? 'light' : 'dark'; applyTheme(next); LS.set(K.theme, next);
  });

  // =====================================================================
  // TRANG CHỦ
  // =====================================================================
  var t0 = Date.now();
  setInterval(function () {
    var s = (Date.now() - t0) / 1000, y = 365.25 * 86400;
    $('#cntVN').textContent = U.fmtNum(Math.floor(s * VN.STATS.births / y));
    $('#cntW').textContent = U.fmtNum(Math.floor(s * 132e6 / y));
    $('#cntD').textContent = U.fmtNum(Math.floor(s * 62e6 / y));
  }, 250);
  $('#ver').textContent = 'v' + G.VERSION; $('#ver2').textContent = 'v' + G.VERSION;

  function saveSettings() { var s = Object.assign({}, S.set); delete s.name; LS.set(K.settings, s); }

  function provList() {
    var list = S.set.variant === '63' ? VN.P63 : VN.P34;
    return list.slice().sort(function (a, b) { return a.name.localeCompare(b.name, 'vi'); });
  }
  function fillSelects() {
    var ps = $('#provSel');
    ps.innerHTML = '<option value="">🎲 Ngẫu nhiên (theo dân số)</option>' + provList().map(function (p) {
      var extra = S.set.variant === '34' ? (p.kind === 'Thành phố' ? ' (thành phố)' : '') : '';
      return '<option value="' + p.id + '">' + esc(p.name + extra) + '</option>';
    }).join('');
    ps.value = S.set.prov;
    if (ps.value !== String(S.set.prov)) { S.set.prov = ''; ps.value = ''; }
    updateProvHint();
    var es = $('#ethSel');
    es.innerHTML = '<option value="">🎲 Ngẫu nhiên (Kinh 86%)</option>' + VN.ETH.map(function (e) {
      return '<option value="' + esc(e.name) + '">' + esc(e.name) + ' — ' + (e.share >= 0.001 ? pct(e.share, e.share < 0.01 ? 2 : 1) : '<0,1%') + '</option>';
    }).join('');
    es.value = S.set.eth;
  }
  function updateProvHint() {
    var h = 'Ngẫu nhiên: quay theo dân số thực tế của từng tỉnh.';
    if (S.set.prov !== '') {
      if (S.set.variant === '34') {
        var p = VN.P34[+S.set.prov];
        h = p.members.length > 1 ? 'Sáp nhập từ: ' + p.members.map(function (m) { return m.name; }).join(', ') + '.' : 'Giữ nguyên, không sáp nhập.';
        h += ' Dân số ~' + U.fmtNum(p.pop / 1000, 1) + ' triệu.';
      } else {
        var o = VN.P63[+S.set.prov];
        h = VN.REGIONS[o.region] + ' · dân số ~' + U.fmtNum(o.pop / 1000, 2) + ' triệu · từ 1/7/2025 thuộc ' + o.newName + '.';
      }
    }
    $('#provHint').textContent = h;
  }

  function syncSetupUI() {
    var vn = S.set.mode === 'vn';
    $$('.tab').forEach(function (t) { t.classList.toggle('on', t.dataset.mode === S.set.mode); });
    $('#vnOpts').classList.toggle('hidden', !vn);
    $('#worldOpts').classList.toggle('hidden', vn);
    $$('#variantChips .chip').forEach(function (c) { c.classList.toggle('on', c.dataset.variant === S.set.variant); });
    var g = S.set.gender, lg = ['lgbt', 'gay', 'lesbian', 'bi'].indexOf(g) >= 0;
    $$('#genderChips .chip').forEach(function (c) { c.classList.toggle('on', c.dataset.g === g || (c.dataset.g === 'lgbt' && lg)); });
    $('#lgbtChips').classList.toggle('hidden', !lg);
    $$('#lgbtChips .chip').forEach(function (c) { c.classList.toggle('on', c.dataset.g === g); });
    $$('#lenChips .chip').forEach(function (c) { c.classList.toggle('on', +c.dataset.len === +S.set.lifeMin); });
    $('#heroTitle').innerHTML = vn ? '1 trong <em>100 triệu</em>' : '1 trong <em>8 tỷ</em>';
    $('#heroLead').textContent = vn
      ? 'Cứ khoảng 23 giây lại có một em bé chào đời ở Việt Nam. Bạn sẽ trở thành một trong số đó và sống trọn một đời người — với những ngã rẽ, cám dỗ, mất mát và hạnh phúc. Sinh ra ở tỉnh nào, dân tộc nào, trong gia đình nào — bạn không được chọn. Cũng như ngoài đời.'
      : 'Mỗi giây có khoảng bốn em bé chào đời trên Trái Đất. Bạn sẽ trở thành một trong số đó và sống trọn một đời người. Sinh ra ở đâu, trong gia đình nào — bạn không được chọn. Cũng như ngoài đời.';
    renderOdds();
  }

  function renderOdds() {
    var rows, sub;
    if (S.set.mode === 'vn') {
      var list = S.set.variant === '63' ? VN.P63 : VN.P34;
      var tot = list.reduce(function (s, p) { return s + p.pop; }, 0);
      var sorted = list.slice().sort(function (a, b) { return b.pop - a.pop; });
      rows = sorted.slice(0, 9).map(function (p) { return [p.name, p.pop / tot]; });
      var rest = sorted.slice(9).reduce(function (s, p) { return s + p.pop; }, 0);
      rows.push([(list.length - 9) + ' tỉnh thành khác', rest / tot]);
      sub = 'Ước tính theo dân số ' + (S.set.variant === '63' ? '63 tỉnh thành (trước 1/7/2025)' : '34 tỉnh thành sau sáp nhập') + ', Niên giám Thống kê 2023.';
    } else {
      var t = W.BIRTHS_TOTAL, cs = W.C.slice().sort(function (a, b) { return b.births - a.births; });
      rows = cs.slice(0, 9).map(function (c) { return [c.name, c.births / t]; });
      rows.push([(W.C.length - 9) + ' quốc gia khác', cs.slice(9).reduce(function (s, c) { return s + c.births; }, 0) / t]);
      sub = 'Theo số trẻ sinh ra mỗi năm ở 195 quốc gia — UN World Population Prospects 2024 (làm tròn). Việt Nam: ' + pct(W.BY.VN.births / t, 2) + ', khoảng 1 trong ' + oneIn(W.BY.VN.births / t) + ' em bé.';
    }
    $('#oddsSub').textContent = sub;
    var max = Math.max.apply(null, rows.map(function (r) { return r[1]; }));
    $('#oddsBars').innerHTML = rows.map(function (r) {
      return '<div class="bar-row"><span>' + esc(r[0]) + '</span><div class="track"><div class="fill" style="width:' + (r[1] / max * 100).toFixed(1) + '%"></div></div><span class="pct">' + pct(r[1]) + '</span></div>';
    }).join('');
  }

  function memCard(m, i) {
    return '<div class="card mem" data-mem="' + i + '"><h3>' + esc(m.name) + '</h3><div class="yrs">' + esc(m.years + ' · ' + m.where) + '</div><p>' + esc(m.summary) + '</p></div>';
  }
  function recentCard(s, i) {
    return '<div class="card mem recent"><div data-recent="' + i + '"><h3>' + esc(s.n) + '</h3><div class="yrs">' + esc(s.y + ' · ' + s.w + ' · ' + s.a + ' tuổi') + '</div><p>' + esc(s.o) + '</p></div>' +
      '<div class="mem-actions"><button class="btn sm" data-view="' + i + '">Xem</button><button class="btn sm primary" data-share="' + i + '">Chia sẻ</button></div></div>';
  }
  // ---------- Hồ sơ xuất phát ngẫu nhiên (mỗi lần vào trang một hồ sơ khác) ----------
  // "Biến cố" là hoàn cảnh/thử thách có thật trong xuất phát điểm — không phải năng khiếu (năng khiếu có dòng riêng)
  var TEASERS = ['Chưa biết trước — đời còn dài', 'Những ngày tháng bình yên', 'Một tuổi thơ êm đềm', 'Mọi thứ tùy vào lựa chọn của bạn'];
  function eventTeaser(l) {
    var f = l.fam, vn = E.isVN(l);
    if (f.elite && E.jobs) return 'Sinh ra trong gia đình ' + E.jobs.ELITE[f.elite].n + ' — giàu sang nhưng phải sống theo khuôn phép';
    if (f.vice) return 'Bố ' + E.VICE[f.vice] + ', gia đình nhiều sóng gió';
    if (f.noDad) return 'Lớn lên thiếu vắng bóng bố';
    if (f.fJob === 'thất nghiệp' || f.mJob === 'thất nghiệp') return (f.fJob === 'thất nghiệp' ? 'Bố' : 'Mẹ') + ' đang thất nghiệp, nhà túng thiếu';
    if (f.q <= 1) return 'Tuổi thơ thiếu ăn, thiếu mặc';
    if (vn && l.region === 'MNPB' && !l.urban) return 'Đường đến trường xa, phải lội suối qua đèo';
    if (!l.urban && l.coast) return 'Lớn lên giữa những mùa mưa bão vùng biển';
    if (f.sibs >= 4) return 'Nhà đông con, anh chị em nhường nhau từng bát cơm';
    if (f.mAge <= 19) return 'Mẹ sinh bạn khi còn rất trẻ';
    if (f.mAge >= 40) return 'Bố mẹ có bạn khi đã lớn tuổi';
    if (f.q >= 5 && l.urban) return 'Áp lực học hành và kỳ vọng rất lớn của bố mẹ';
    if (f.q === 2 && l.urban) return 'Sống trong nhà thuê, chuyển trọ nhiều lần';
    if (!vn && l.gdp < 3) return 'Lớn lên ở nơi thiếu thốn điện, nước sạch, trường học';
    return TEASERS[Math.abs(l.rs) % TEASERS.length];
  }
  function profileOpts() { return { mode: S.set.mode, variant: S.set.variant, gender: 'random', lifeMin: S.set.lifeMin, seed: U.newSeed() }; }
  function renderProfile() {
    var o = S.preview || (S.preview = profileOpts()), l = E.createLife(o), f = l.fam;
    var where = E.isVN(l) ? l.provLabel + ' · Việt Nam' : l.city + ' · ' + l.countryName;
    var fam = (f.noDad ? '' : 'Bố ' + f.fJob + ' · ') + 'Mẹ ' + f.mJob;
    var inc = f.mInc + f.fInc;
    var teaser = eventTeaser(l);
    var talent = l.talent ? U.cap(E.talentText(l)) + (l.game ? ' · ' + l.game : '') : 'Chưa bộc lộ';
    var tags = [E.QUINT[f.q].replace('một trong những ', '').replace('một ', '').replace('gia đình', 'Gia đình'), l.urban ? 'Thành thị' : 'Nông thôn'];
    if (l.eth) tags.push(l.eth); if (l.chosenOrient || l.orient !== 'straight') tags.push('LGBTQ+');
    $('#heroProfile').innerHTML = '<div class="eyebrow">MỘT LƯỢT MÔ PHỎNG CÓ THỂ BẮT ĐẦU NHƯ SAU</div><h3>Hồ sơ xuất phát</h3>' +
      '<div class="idhead" style="margin:6px 0 10px">' + E.art.avatar(Object.assign({}, l, { age: 6, school: 'primary', job: null })) + '<div><b style="font-size:17px">' + esc(l.name) + '</b><div class="small muted">' + (l.sex === 'M' ? 'Bé trai' : 'Bé gái') + ' · ' + esc(where) + '</div></div></div>' +
      '<div class="prow"><span>Nơi sinh</span><span>' + esc(where) + '</span></div>' +
      '<div class="prow"><span>Gia đình</span><span>' + esc(U.cap(fam)) + '</span></div>' +
      '<div class="prow"><span>Thu nhập nhà</span><span>' + esc(money(l, inc, true)) + '/tháng' + (f.noDad ? '' : '<br><small class="muted">bố ' + esc(money(l, f.fInc)) + ' · mẹ ' + esc(money(l, f.mInc)) + '</small>') + '</span></div>' +
      '<div class="prow"><span>Biến cố</span><span>' + esc(teaser) + '</span></div>' +
      '<div class="prow"><span>Năng khiếu</span><span>' + esc(talent) + '</span></div>' +
      '<div class="ptags">' + tags.map(function (t) { return '<span class="ptag">' + esc(U.cap(t)) + '</span>'; }).join('') + '</div>' +
      '<div class="actions"><button class="btn" id="reroll">↻ Xuất phát điểm khác</button><button class="btn gold" id="liveThis">Sống đời này</button></div>';
    $('#reroll').onclick = function () { S.preview = profileOpts(); renderProfile(); };
    $('#liveThis').onclick = function () { bornWith(Object.assign({}, S.preview)); };
  }

  // ---------- Sổ tay nghề nghiệp & mức lương tham chiếu ----------
  var CAT_ORDER = ['state', 'uniform', 'edu', 'med', 'office', 'sale', 'biz', 'service', 'free', 'show', 'creator', 'media', 'beauty', 'worker', 'poor', 'farm', 'sport', 'esport', 'chess', 'other', 'crime'];
  function jobCount() { return Object.keys(E.CAR).filter(function (k) { return k !== 'scam_kh' && k !== 'phu_giup'; }).length; }
  function fmtTr(x) { return x >= 1000 ? U.fmtNum(x / 1000, 1) + ' tỷ' : U.fmtNum(x, x < 10 && x % 1 ? 1 : 0); }
  function openJobs() {
    var by = {};
    Object.keys(E.CAR).forEach(function (k) { var c = E.CAR[k]; if (k === 'scam_kh' || k === 'phu_giup') return; (by[c.cat] = by[c.cat] || []).push(c); });
    var html = '<div class="agep">Sổ tay nghề nghiệp</div><h2>' + jobCount() + ' nghề & mức lương tham chiếu</h2>' +
      '<p class="small muted">Thu nhập tham chiếu ở Việt Nam (triệu đồng/tháng) theo từng bậc. Trong game, thu nhập thật còn dao động theo học vấn, nơi sống, năng lực, chăm chỉ và may rủi; ở nước khác được quy đổi theo mức sống. ' +
      'Mốc so sánh: thu nhập bình quân người lao động năm 2025 khoảng 8,4 triệu/tháng (thành thị ~10, nông thôn ~7,3); lương công chức = hệ số × lương cơ sở 2,34 triệu + phụ cấp.</p>' +
      '<div class="jobcat">' + CAT_ORDER.filter(function (c) { return by[c]; }).map(function (cat) {
        return '<details' + (cat === 'state' ? ' open' : '') + '><summary>' + esc(E.CAT[cat] || cat) + ' <span class="muted small">· ' + by[cat].length + ' nghề</span></summary><ul class="joblist">' + by[cat].map(function (c) {
          var pay = c.fame ? 'theo danh tiếng: từ ~' + fmtTr(Math.max(c.vn[0], 1.5)) + ' đến hàng trăm triệu' :
            c.vn.length > 1 ? fmtTr(c.vn[0]) + ' → ' + fmtTr(c.vn[c.vn.length - 1]) : '~' + fmtTr(c.vn[0]);
          var tags = [];
          if (c.sigma >= 0.5) tags.push('bấp bênh'); if (c.haz) tags.push('nguy hiểm'); if (c.sec === 'crime') tags.push('phạm pháp'); if (c.hidden) tags.push('qua sự kiện');
          if (c.edu >= 5 && c.edu < 99) tags.push('cần đại học'); if (c.edu === 99) tags.push('qua trường công an / quân đội');
          return '<li><div class="jt">' + esc(c.t.map(U.cap).join(' → ')) + '</div><div class="jp"><b>' + esc(pay) + '</b>' + (c.fame ? '' : ' triệu/tháng') + (tags.length ? ' <span class="muted small">· ' + esc(tags.join(' · ')) + '</span>' : '') + '</div></li>';
        }).join('') + '</ul></details>';
      }).join('') + '</div>' +
      '<div class="go-row" style="margin-top:12px"><button class="btn primary" id="jobsClose">Đóng</button></div>';
    modal(html, function (box) { $('#jobsClose', box).onclick = closeModal; }, 'jobs');
  }
  $('#jobsBtn').onclick = openJobs;
  $('#statJobs').textContent = Math.floor(jobCount() / 10) * 10 + '+';

  function renderHome() {
    syncSetupUI(); fillSelects(); renderProfile();
    var cur = LS.get(K.cur, null);
    var rb = $('#resumeBox');
    if (cur && cur.life && cur.life.alive) {
      var l = migrate(cur.life);
      rb.innerHTML = '<div class="card resume"><div><b>Bạn đang sống dở cuộc đời của ' + esc(l.name) + '</b><div class="muted small">' + ageStr(l.age) + ' · ' + esc(E.placeText(l)) + '</div></div>' +
        '<div style="display:flex;gap:8px"><button class="btn primary" id="resumeBtn">Tiếp tục sống</button><button class="btn" id="dropBtn">Bỏ</button></div></div>';
      $('#resumeBtn').onclick = function () { resumeLife(cur); };
      $('#dropBtn').onclick = function () { if (confirm('Bỏ cuộc đời đang sống dở? Không thể hoàn tác.')) { LS.del(K.cur); renderHome(); } };
    } else rb.innerHTML = '';
    var rec = LS.get(K.recent, []);
    $('#recentSection').classList.toggle('hidden', !rec.length);
    $('#recentList').innerHTML = rec.map(recentCard).join('');
    var mem = LS.get(K.mem, []);
    $('#memSection').classList.toggle('hidden', !mem.length);
    $('#memPreview').innerHTML = mem.slice(-4).reverse().map(function (m) { return memCard(m, mem.indexOf(m)); }).join('');
  }

  // sự kiện trang chủ
  $$('.tab').forEach(function (t) { t.onclick = function () { S.set.mode = t.dataset.mode; saveSettings(); syncSetupUI(); }; });
  $$('#variantChips .chip').forEach(function (c) { c.onclick = function () { S.set.variant = c.dataset.variant; S.set.prov = ''; saveSettings(); syncSetupUI(); fillSelects(); }; });
  $('#provSel').onchange = function () { S.set.prov = this.value; saveSettings(); updateProvHint(); };
  $('#ethSel').onchange = function () { S.set.eth = this.value; saveSettings(); };
  $('#nameInp').oninput = function () { S.set.name = this.value; };
  $$('#genderChips .chip, #lgbtChips .chip').forEach(function (c) { c.onclick = function () { S.set.gender = c.dataset.g; saveSettings(); syncSetupUI(); }; });
  $$('#lenChips .chip').forEach(function (c) { c.onclick = function () { S.set.lifeMin = +c.dataset.len; saveSettings(); syncSetupUI(); }; });
  $$('[data-go]').forEach(function (b) { b.onclick = function () { show(b.dataset.go); }; });
  document.addEventListener('click', function (e) {
    var m = e.target.closest('[data-mem]'); if (m) { openMemorial(+m.dataset.mem); return; }
    var sh = e.target.closest('[data-share]'); if (sh) { var s = LS.get(K.recent, [])[+sh.dataset.share]; if (s) shareLink(s); return; }
    var v = e.target.closest('[data-view], [data-recent]'); if (v) { var s2 = LS.get(K.recent, [])[+(v.dataset.view || v.dataset.recent)]; if (s2) { renderShared(s2, true); show('shared'); } }
  });

  $('#bornBtn').onclick = function () {
    var g = S.set.gender;
    if (g === 'lgbt') g = ['gay', 'lesbian', 'bi'][Math.floor(Math.random() * 3)];
    var opts = { mode: S.set.mode, variant: S.set.variant, gender: g, lifeMin: S.set.lifeMin };
    if (S.set.mode === 'vn') { opts.prov = S.set.prov; opts.eth = S.set.eth; opts.name = ($('#nameInp').value || '').trim(); }
    bornWith(opts);
  };
  function bornWith(opts) {
    var life = E.createLife(opts);
    var cohort = E.makeCohort(life);
    S.life = life; S.cohort = cohort; S.speed = 1; S.auto = false; S.skipping = false; S.preview = null;
    persist();
    rollFate(life, function () { renderBirth(); show('birth'); });
  }

  // ---------- Quay số phận: các ô quay rồi dừng ở kết quả ----------
  function shuffled(arr, n) { var a = arr.slice(), out = []; while (out.length < n) { if (!a.length) a = arr.slice(); out.push(a.splice(Math.floor(Math.random() * a.length), 1)[0]); } return out; }
  function rollFate(l, done) {
    var vn = E.isVN(l) && l.mode === 'vn', reels;
    var famNames = ['Nghèo nhất', 'Khó khăn', 'Bình thường', 'Khá giả', 'Giàu nhất'];
    var sexTxt = l.sex === 'M' ? 'Bé trai' : 'Bé gái';
    if (vn) reels = [
      { lab: l.variant === '63' ? 'Tỉnh / thành (63)' : 'Tỉnh / thành (34)', pool: (l.variant === '63' ? VN.P63 : VN.P34).map(function (p) { return p.name; }), fin: l.provLabel },
      { lab: 'Dân tộc', pool: VN.ETH.map(function (e) { return e.name; }), fin: l.eth },
      { lab: 'Giới tính', pool: ['Bé trai', 'Bé gái'], fin: sexTxt },
      { lab: 'Gia cảnh', pool: famNames, fin: famNames[l.fam.q - 1] }
    ];
    else reels = [
      { lab: 'Quốc gia', pool: W.C.filter(function (c) { return c.births > 0; }).map(function (c) { return c.name; }), fin: l.countryName },
      { lab: 'Nơi sinh', pool: E.isVN(l) ? VN.P34.map(function (p) { return p.name; }) : W.BY[l.country].cities.concat(['nông thôn']), fin: E.isVN(l) ? l.provLabel : (l.urban ? l.city : 'Nông thôn') },
      { lab: 'Giới tính', pool: ['Bé trai', 'Bé gái'], fin: sexTxt },
      { lab: 'Gia cảnh', pool: famNames, fin: famNames[l.fam.q - 1] }
    ];
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var N = 28, H = 44, durs = reduce ? [300, 350, 400, 450] : [1700, 2300, 2800, 3300];
    modal('<div class="agep">Số phận đang được quay</div><h2>Bạn sẽ được sinh ra là ai?</h2><p class="muted small" style="margin:0">Không ai được chọn nơi mình sinh ra.</p>' +
      '<div class="reels">' + reels.map(function (r, i) {
        var items = shuffled(r.pool, N).concat([r.fin]);
        return '<div class="reel" id="reel' + i + '"><div class="lab">' + esc(r.lab) + '</div><div class="win"><ul style="transform:translateY(' + H + 'px)">' +
          items.map(function (x, j) { return '<li' + (j === N ? ' class="final"' : '') + '>' + esc(x) + '</li>'; }).join('') + '</ul></div></div>';
      }).join('') + '</div><div class="rollmsg" id="rollMsg"></div>' +
      '<div class="go-row" style="justify-content:center;margin-top:10px"><button class="btn ghost" id="rollSkip">Bỏ qua hiệu ứng</button></div>',
      function (box) {
        var finished = false;
        function finish() { if (finished) return; finished = true; S.phase = 'idle'; closeModal(); done(); }
        S.phase = 'roll';
        $('#rollSkip', box).onclick = finish;
        requestAnimationFrame(function () {
          reels.forEach(function (r, i) {
            var ul = $('#reel' + i + ' ul', box);
            ul.style.transition = 'transform ' + durs[i] + 'ms cubic-bezier(.12,.72,.08,1)';
            ul.style.transform = 'translateY(' + (H - N * H) + 'px)';
            setTimeout(function () { var el = $('#reel' + i, box); if (el) el.classList.add('done'); }, durs[i]);
          });
          setTimeout(function () { var m = $('#rollMsg', box); if (m) m.textContent = 'Oa oa… ' + l.name + ' chào đời!'; }, durs[3] + 150);
          setTimeout(finish, durs[3] + (reduce ? 400 : 1500));
        });
      }, 'roll');
  }

  // =====================================================================
  // GIẤY KHAI SINH
  // =====================================================================
  function fact(k, v) { return '<div class="fact"><div class="k">' + esc(k) + '</div><div class="v">' + v + '</div></div>'; }
  function qDots(q) { return '<span class="dots">' + '●'.repeat(q) + '○'.repeat(5 - q) + '</span> nhóm ' + q + '/5'; }
  function incomeLine(l) {
    if (E.isVN(l)) return U.fmtNum(VN.STATS.gdpNominal * 1000 * (l.wealthIdx || 1) * 25.4 / 1000, 0) + ' triệu đ/người/năm';
    return money(l, l.gdp * 1000, true) + '/người/năm';
  }
  function renderBirth() {
    var l = S.life, f = l.fam, vn = E.isVN(l);
    var certNo = (vn ? 'VNM' : l.country) + '-' + l.birthYear + '-' + String(Math.abs(l.rs) % 10000000).padStart(7, '0');
    var facts = fact('Giới tính', sexWord(l)) +
      (l.chosenOrient ? fact('Xu hướng tính dục', E.orientLabel(l)) : '') +
      fact('Quốc gia', esc(l.countryName)) +
      (vn ? fact(l.variant === '63' ? 'Tỉnh / thành (63)' : 'Tỉnh / thành (34)', esc(l.provLabel) + (l.provNote ? '<div class="small muted">' + esc(l.provNote) + '</div>' : '')) : '') +
      fact('Nơi sinh', esc(l.urban ? (vn ? 'Thành thị · ' : 'Thành phố · ') + l.place : U.cap(l.place))) +
      (vn ? fact('Dân tộc', esc(l.eth)) : '') +
      fact('Tôn giáo', esc(l.religion)) +
      fact('Thu nhập gia đình', qDots(f.q)) +
      fact('Tuổi bố mẹ', 'Mẹ ' + f.mAge + (f.noDad ? '' : ' · Bố ' + f.fAge)) +
      fact('Nghề của bố mẹ', 'Mẹ: ' + esc(f.mJob) + (f.noDad ? '' : '<br>Bố: ' + esc(f.fJob))) +
      fact('Thu nhập của mẹ', esc(money(l, f.mInc || 0)) + '/tháng') +
      (f.noDad ? '' : fact('Thu nhập của bố', esc(money(l, f.fInc || 0)) + '/tháng')) +
      fact('Thu nhập cả nhà', '<span style="color:var(--accent-2)">' + esc(money(l, (f.mInc || 0) + (f.fInc || 0), true)) + '/tháng</span>') +
      fact('Nhà ở', esc((l.houseType ? l.houseType + ', ' : '') + f.home)) +
      fact('Tuổi thọ kỳ vọng', U.fmtNum(l.e0sex, 1) + ' năm') +
      fact('Nguy cơ mất trước 5 tuổi', pct(l.p5)) +
      fact('GDP bình quân đầu người', incomeLine(l));
    var odds;
    if (vn) {
      var list = l.variant === '63' ? VN.P63 : VN.P34, tot = list.reduce(function (s, p) { return s + p.pop; }, 0);
      var pp = list.filter(function (p) { return p.name === l.provLabel; })[0];
      var share = pp ? pp.pop / tot : 0;
      var eth = VN.ethByName(l.eth), ethReal = eth.pop / VN.ETH.reduce(function (s, e) { return s + e.pop; }, 0);
      odds = 'Khoảng ' + pct(share) + ' trẻ sơ sinh Việt Nam chào đời ở ' + esc(l.provLabel) + ' — cứ ' + oneIn(share) + ' em thì có 1. ' +
        'Người ' + esc(l.eth) + ' chiếm ' + pct(ethReal, ethReal < 0.01 ? 3 : 1) + ' dân số Việt Nam' + (eth.id === 0 ? '.' : ' (Tổng điều tra 2019: ' + U.fmtNum(eth.pop) + ' người).') +
        ' Và ' + (l.urban ? 'bạn là một trong khoảng 38% người Việt sinh ra ở thành thị.' : 'như khoảng 62% người Việt, bạn sinh ra ở nông thôn.');
      if (l.mode === 'world') odds = 'Trong số trẻ sơ sinh toàn thế giới hôm nay, ' + pct(W.BY.VN.births / W.BIRTHS_TOTAL, 2) + ' chào đời ở Việt Nam — khoảng 1 trong ' + oneIn(W.BY.VN.births / W.BIRTHS_TOTAL) + '. ' + odds;
    } else {
      var c = W.BY[l.country], s2 = c.births / W.BIRTHS_TOTAL;
      var cur = G.CUR.CUR[l.country];
      odds = pct(s2, 2) + ' trẻ sơ sinh hôm nay chào đời ở ' + esc(l.countryName) + ' — khoảng 1 trong ' + oneIn(s2) + '. ' +
        (l.urban ? 'Bạn sinh ra ở thành phố, như ' + pct(c.urban, 0) + ' dân số nơi đây.' : 'Bạn sinh ra ở nông thôn, như ' + pct(1 - c.urban, 0) + ' dân số nơi đây.') +
        (cur ? ' Đồng tiền nơi đây: ' + esc(cur.name) + ' (' + cur.code + ').' : '');
    }
    var sec = secPerYear(l);
    $('#birthWrap').innerHTML =
      '<header class="top"><div class="brand" data-go2="home"><img class="logo" src="logo.svg?v=' + G.VERSION + '" alt="">Một Đời</div></header>' +
      '<div class="card cert"><div class="cert-head">Giấy khai sinh <small>Số: ' + esc(certNo) + '</small></div><div class="cert-body">' +
      '<div class="avatarbox">' + E.art.avatar(l) + '</div>' +
      '<div class="fact"><div class="k">Họ và tên</div></div><h1 class="name">' + esc(l.name) + '</h1>' + (l.nameSub ? '<div class="native">' + esc(l.nameSub) + '</div>' : '') +
      '<p>' + esc(l.log[0].t) + '</p>' +
      '<p class="small muted">Sống đến tuổi thọ kỳ vọng mất khoảng ' + l.lifeMin + ' phút (1 năm ≈ ' + Math.round(sec) + ' giây). Nếu bạn đóng trang, cuộc đời được lưu trên trình duyệt này và tiếp tục khi bạn quay lại.</p>' +
      '<div class="facts">' + facts + '</div>' +
      '<div class="odds">' + odds + '</div>' +
      '<h3 style="margin:22px 0 4px;font-size:18px">Cũng trong giây ấy, ở đâu đó…</h3>' +
      '<div class="cohort">' + S.cohort.map(function (c) {
        return '<div class="c"><b>' + esc(c.name) + '</b><span>' + esc(c.where) + ' · ' + (c.sex === 'M' ? 'Nam' : 'Nữ') + (c.eth && c.eth !== 'Kinh' ? ' · ' + esc(c.eth) : '') + ' · ' + esc(E.QUINT[c.q].replace('một trong những ', '').replace('một ', '')) + '</span></div>';
      }).join('') + '</div>' +
      '<p class="small muted">Cuộc đời họ cũng sẽ diễn ra theo cùng những con số ấy, song song bên cạnh bạn.</p>' +
      '<div class="go-row" style="margin-top:14px"><button class="btn primary big" id="beginBtn">Bắt đầu cuộc đời này</button>' +
      '<button class="btn" id="shareBirth">Sao chép giấy khai sinh</button><button class="btn ghost" id="backHome">Về trang chủ</button></div>' +
      '</div></div>';
    $('#beginBtn').onclick = function () { startLife(); };
    $('#backHome').onclick = function () { show('home'); };
    $('[data-go2]').onclick = function () { show('home'); };
    $('#shareBirth').onclick = function () {
      copyText('👶 ' + l.name + (l.nameSub ? ' (' + l.nameSub + ')' : '') + '\n' + l.log[0].t + '\nTuổi thọ kỳ vọng: ' + U.fmtNum(l.e0sex, 1) + ' năm.\n— Một Đời ' + location.href.split('#')[0]);
    };
  }

  // =====================================================================
  // CUỘC ĐỜI
  // =====================================================================
  var SPEEDS = [1, 2, 4, 8, 16];
  var FOCUS = [
    ['study', 'Học hành', 'Học hành & phát triển bản thân: kiến thức tăng nhanh hơn, nhưng mệt hơn một chút.', 'Học hành', 'Chăm học: kiến thức tăng, dễ đạt thành tích.'],
    ['health', 'Sức khỏe', 'Chăm sóc sức khỏe: ăn uống, tập luyện, khám định kỳ.', 'Vận động', 'Chạy nhảy, chơi thể thao: khỏe mạnh hơn.'],
    ['social', 'Gia đình & bạn bè', 'Dành thời gian cho người thân: gắn kết hơn, dễ gặp người thương.', 'Bạn bè & gia đình', 'Chơi với bạn, quây quần bên gia đình.'],
    ['work', 'Công việc', 'Làm việc & kiếm tiền: thu nhập, thăng tiến, danh tiếng & kỹ năng thi đấu tăng; sức khỏe và các mối quan hệ giảm.', null, null],
    ['rest', 'Nghỉ ngơi', 'Nghỉ ngơi & tận hưởng: vui hơn, nhưng tiêu tiền nhiều hơn và làm ít hơn.', 'Vui chơi', 'Vui chơi thỏa thích: hạnh phúc hơn, học ít hơn.'],
    ['balance', 'Cân bằng', 'Cân bằng công việc, sức khỏe, gia đình và trau dồi kỹ năng: mọi chỉ số tăng nhẹ, thăng tiến đều đặn mà không kiệt sức.', null, null, 21]
  ];

  function persist() { if (S.life) LS.set(K.cur, { life: S.life, cohort: S.cohort, speed: S.speed, auto: S.auto }); }

  function resumeLife(cur) {
    S.life = migrate(cur.life); S.cohort = cur.cohort || []; S.speed = cur.speed || 1; S.auto = !!cur.auto; S.skipping = false; S.paused = false;
    enterLife();
    toast('Tiếp tục cuộc đời của ' + S.life.name);
  }
  function startLife() { S.paused = false; enterLife(); }

  function enterLife() {
    show('life');
    $('#logList').innerHTML = '';
    S.life.log.slice(-400).reverse().forEach(function (e) { addLog(e, true, true); });
    renderSpeeds(); renderAll();
    S.phase = 'idle'; S.yearRunning = false; S.last = performance.now();
    startYear();
  }

  function yearMs() {
    if (S.skipping) return 160;
    return secPerYear(S.life) * 1000 / S.speed;
  }

  function startYear() {
    var l = S.life;
    if (!l.alive) return toFinale();
    var decs = E.beginYear(l, { auto: S.auto });
    if (decs.length) {
      // chế độ "chỉ ngã rẽ lớn": tua nhanh vẫn tiếp tục qua những lựa chọn thường ngày
      if (!(S.minorOnly && !S.auto && decs.every(function (d) { return !E.isMajor(d); }))) S.skipping = false;
      renderTopbar(); showDecision();
    }
    else runYear();
  }
  function runYear() {
    var l = S.life;
    var entries = E.finishYear(l);
    S.queue = entries.map(function (e, i) { return { e: e, t: (i + 1) / (entries.length + 1) }; });
    S.progress = 0; S.phase = 'running'; S.yearRunning = true; S.last = performance.now();
    renderAll();
  }
  function completeYear() {
    var l = S.life;
    S.queue.forEach(function (q) { addLog(q.e); }); S.queue = [];
    S.yearRunning = false;
    if (!l.alive) { S.phase = 'dead'; LS.del(K.cur); setTimeout(toFinale, 1400); renderAll(); return; }
    var reflect = E.endYear(l);
    persist(); renderAll();
    if (reflect && !S.auto) { S.skipping = false; renderTopbar(); showReflection(l.age); }
    else startYear();
  }

  function tick() {
    if (S.phase !== 'running' || !S.life) return;
    var now = performance.now(), dt = Math.min(1000, now - S.last); S.last = now;
    if (S.paused) return;
    S.progress += dt / yearMs();
    while (S.queue.length && S.queue[0].t <= S.progress) {
      var q = S.queue.shift(); addLog(q.e);
      if (q.e.k === 'death') { S.skipping = false; }
    }
    $('#yearProg').style.width = Math.min(100, S.progress * 100) + '%';
    if (S.progress >= 1) completeYear();
  }
  setInterval(tick, 50);

  function addLog(e, initial, bulk) {
    var li = document.createElement('li');
    li.className = (e.k || '') + (e.star ? ' starred' : '');
    li.innerHTML = '<span class="a">' + e.a + ' tuổi</span><span class="t">' + esc(e.t) + '</span>' +
      (e.k === 'money' ? '' : '<button class="star" title="Đánh dấu khoảnh khắc đáng nhớ" aria-label="Đánh dấu khoảnh khắc">' + (e.star ? '★' : '☆') + '</button>');
    li._e = e;
    var ul = $('#logList');
    ul.insertBefore(li, ul.firstChild);
    if (!initial) li.style.animation = 'fadein .35s ease';
    if (!bulk && ul.children.length > 600) ul.removeChild(ul.lastChild);
  }

  // ♪ nhạc nền lofi (tự sinh, không dùng file nhạc)
  var Mu = G.Music;
  function syncMusic() {
    var st = Mu ? Mu.state() : { want: false, vol: 0.35 };
    var b1 = $('#musicBtn'), b2 = $('#musicBtn2'), vr = $('#volRange');
    if (b1) { b1.classList.toggle('on', st.want); b1.textContent = st.want ? '♪ Lofi' : '♪'; b1.title = st.want ? 'Tắt nhạc nền' : 'Bật nhạc nền lofi'; }
    if (b2) { b2.classList.toggle('on', st.want); b2.textContent = st.want ? '♪ Lofi: bật' : '♪ Lofi'; }
    if (vr) { vr.value = Math.round(st.vol * 100); vr.classList.toggle('hidden', !st.want); }
  }
  if (Mu && Mu.supported()) {
    ['#musicBtn', '#musicBtn2'].forEach(function (id) { var b = $(id); if (b) b.onclick = function () { var on = Mu.toggle(); toast(on ? 'Đã bật nhạc lofi chill ♪' : 'Đã tắt nhạc nền'); syncMusic(); }; });
    $('#volRange').oninput = function () { Mu.setVol(this.value / 100); };
    Mu.onChange(syncMusic); Mu.resumeOnGesture(); syncMusic();
  } else ['#musicBtn', '#musicBtn2', '#volRange'].forEach(function (id) { var b = $(id); if (b) b.classList.add('hidden'); });

  // ⭐ đánh dấu khoảnh khắc: được ưu tiên trong hồi tưởng cuối đời, ảnh thẻ và link chia sẻ
  $('#logList').addEventListener('click', function (ev) {
    var b = ev.target.closest('.star'); if (!b) return;
    var li = b.closest('li'), e = li && li._e; if (!e || !S.life) return;
    e.star = !e.star;
    li.classList.toggle('starred', e.star); b.textContent = e.star ? '★' : '☆';
    if (e.star && !LS.get('mkn.starTip', false)) { LS.set('mkn.starTip', true); toast('Đã đánh dấu — khoảnh khắc này sẽ hiện lại khi nhân vật hồi tưởng cuối đời'); }
    persist();
  });

  // ---------- thanh trên ----------
  function renderSpeeds() {
    $('#speeds').innerHTML = SPEEDS.map(function (s) { return '<button data-sp="' + s + '" class="' + (s === S.speed ? 'on' : '') + '">' + s + '×</button>'; }).join('');
    $$('#speeds button').forEach(function (b) { b.onclick = function () { S.speed = +b.dataset.sp; S.skipping = false; renderSpeeds(); renderTopbar(); persist(); }; });
  }
  function renderTopbar() {
    var l = S.life;
    $('#lbAge').textContent = ageStr(l.age);
    $('#lbMeta').textContent = (l.birthYear + l.age) + ' · ' + l.name + ' · 1 năm ≈ ' + Math.round(secPerYear(l) / S.speed) + ' giây';
    $('#pauseBtn').textContent = S.paused ? '▶ Tiếp tục' : '❚❚ Tạm dừng';
    $('#autoBtn').classList.toggle('on', S.auto);
    $('#minorBtn').classList.toggle('on', !!S.minorOnly);
    $('#skipBtn').classList.toggle('toggle', true);
    $('#skipBtn').classList.toggle('on', S.skipping);
  }
  $('#pauseBtn').onclick = function () { S.paused = !S.paused; S.last = performance.now(); renderTopbar(); };
  $('#skipBtn').onclick = function () { S.skipping = !S.skipping; S.paused = false; renderTopbar(); };
  $('#minorBtn').onclick = function () {
    S.minorOnly = !S.minorOnly; S.set.minorOnly = S.minorOnly; saveSettings(); renderTopbar();
    toast(S.minorOnly ? 'Lựa chọn thường ngày để AI lo — chỉ dừng lại ở ngã rẽ quyết định' : 'Bạn tự chọn mọi lựa chọn');
  };
  $('#autoBtn').onclick = function () { S.auto = !S.auto; persist(); renderTopbar(); if (S.auto) toast('Chế độ tự động: AI quyết định theo tính cách nhân vật'); };
  $('#exitBtn').onclick = function () {
    var was = S.paused; S.paused = true; renderTopbar();
    modal('<div class="agep">Rời đi</div><h2>Rời khỏi cuộc đời này?</h2><p>Tiến trình đã được lưu trên trình duyệt. Bạn có thể quay lại sống tiếp bất cứ lúc nào.</p>' +
      '<div class="opts"><button class="opt" data-x="save"><b>Lưu & về trang chủ</b></button><button class="opt" data-x="stay"><b>Ở lại</b></button><button class="opt" data-x="drop"><b>Bỏ cuộc đời này</b><span>Xóa tiến trình, không thể hoàn tác</span></button></div>',
      function (box) {
        $$('[data-x]', box).forEach(function (b) {
          b.onclick = function () {
            var x = b.dataset.x; closeModal();
            if (x === 'stay') { S.paused = was; renderTopbar(); return; }
            if (x === 'save') persist(); else LS.del(K.cur);
            S.phase = 'idle'; S.life = null; show('home');
          };
        });
      });
  };
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && S.phase === 'decision') { e.preventDefault(); minimizeDecision(); return; }
    if (e.key === 'Escape' && S.phase === 'decmin') { e.preventDefault(); showDecision(); return; }
    if (e.code === 'Space' && S.phase === 'decmin' && !/INPUT|TEXTAREA|SELECT|BUTTON/.test(document.activeElement.tagName)) { e.preventDefault(); showDecision(); return; }
    if (e.code === 'Space' && $('#life').classList.contains('active') && !$('#modalRoot').firstChild && !/INPUT|TEXTAREA|SELECT|BUTTON/.test(document.activeElement.tagName)) {
      e.preventDefault(); $('#pauseBtn').click();
    }
  });

  // ---------- các ô thông tin ----------
  function renderScene() {
    var l = S.life;
    $('#scenePanel').innerHTML = E.art.scene(l) + '<div class="cap">' + esc(E.art.caption(l)) + '</div>';
  }
  function renderAll() { if (!S.life) return; renderTopbar(); renderScene(); renderId(); renderStats(); renderFin(); renderFam(); renderFocus(); renderActions(); renderCohort(); renderMap(); renderPlace(); }

  function currentPlace(l) {
    if (l.jailUntil != null && l.age < l.jailUntil) return 'Trại giam';
    if (l.abroad && l.abroad.trapped) return 'Một trại lừa đảo ở Campuchia';
    if (l.abroad && l.abroad.study) return l.abroad.name + ' (du học)';
    if (l.abroad && !l.abroad.perm) return l.abroad.name + ' (lao động có thời hạn)';
    if (l.abroad) return l.place + ', ' + l.abroad.name;
    if (l.cityStudent) return l.cityStudent.city + ' (sinh viên)';
    if (l.movedTo) return l.movedTo;
    return E.placeText(l).replace(/, Việt Nam$/, '');
  }
  function eduNow(l) {
    if (l.school) return 'Đang học ' + E.schoolName(l.school) + (l.major ? ' · ' + E.MAJORS[l.major] : '');
    if (l.age < 6) return 'Chưa đến tuổi đi học';
    return U.cap(E.EDU[l.edu]);
  }
  function karmaWord(k) { return k >= 40 ? 'Rất tử tế' : k >= 15 ? 'Tử tế' : k > -15 ? 'Bình thường' : k > -40 ? 'Nhiều vết đen' : 'Tội lỗi'; }
  function renderId() {
    var l = S.life;
    var mrz = 'I<' + (E.isVN(l) ? 'VNM' : l.country + '<') + stripVN(l.name).toUpperCase().replace(/[^A-Z]+/g, '<') + '<<<<<<<<<<<<';
    // v2.8: đang làm chủ cửa hàng / quán (mở bằng vốn riêng) thì hiện là chủ, không phải "thất nghiệp" hay nghề cũ
    var vens = (l.ventures || []).map(function (v) { return 'chủ ' + v.n + (v.br > 1 ? ' (' + v.br + ' cơ sở)' : ''); });
    var job = l.job ? U.cap(E.jobTitle(l)) + (vens.length ? ' · ' + vens.join(', ') : '') : vens.length ? U.cap(vens.join(', ')) : l.retired ? 'Đã nghỉ hưu' : l.flags.military ? 'Đang tại ngũ' : l.jailUntil != null && l.age < l.jailUntil ? 'Đang thụ án' : l.school ? 'Đang đi học' : l.age < 15 ? '—' : 'Thất nghiệp';
    var veh = l.veh ? (l.vehName || l.veh) + (l.veh === 'xe máy' && !l.lic.A1 ? ' (chưa có bằng)' : l.veh === 'ô tô' && !l.lic.B ? ' (chưa có bằng)' : '') : '';
    var med = l.medals && l.medals.length ? l.medals.map(function (m) { return m.m; }).reduce(function (a, m) { a[m] = (a[m] || 0) + 1; return a; }, {}) : null;
    $('#idCard').innerHTML = '<h3>Căn cước · ' + esc(E.isVN(l) ? 'Việt Nam' : l.countryName) + '</h3>' +
      '<div class="idhead">' + E.art.avatar(l) + '<div class="nm">' + esc(l.name) + (l.nameSub ? '<small>' + esc(l.nameSub) + '</small>' : '') + '</div></div>' +
      '<dl class="kv"><dt>Giới tính</dt><dd>' + sexWord(l) + (l.orient !== 'straight' && (l.realized || l.chosenOrient) ? ' · ' + E.orientLabel(l) : '') + '</dd>' +
      '<dt>Sinh</dt><dd>' + l.birthMonth + '/' + l.birthYear + '</dd>' +
      '<dt>Sống tại</dt><dd>' + esc(currentPlace(l)) + '</dd>' +
      (l.eth ? '<dt>Dân tộc</dt><dd>' + esc(l.eth) + '</dd>' : '') +
      '<dt>Tôn giáo</dt><dd>' + esc(l.religion) + '</dd>' +
      '<dt>Học vấn</dt><dd>' + esc(eduNow(l)) + '</dd>' +
      '<dt>Công việc</dt><dd>' + esc(job) + '</dd>' +
      (l.talent ? '<dt>Năng khiếu</dt><dd>' + esc(E.talentText(l)) + (l.game ? ' · ' + esc(l.game) : '') + '</dd>' : '') +
      (l.fame >= 1000 ? '<dt>Danh tiếng</dt><dd>' + esc(E.fmtFollowers(l.fame)) + ' người theo dõi</dd>' : '') +
      (med ? '<dt>Huy chương</dt><dd>' + Object.keys(med).map(function (k) { return med[k] + ' ' + k; }).join(' · ') + '</dd>' : '') +
      (l.titles && l.titles.length ? '<dt>Danh hiệu</dt><dd>' + esc(l.titles[l.titles.length - 1]) + '</dd>' : '') +
      (veh ? '<dt>Phương tiện</dt><dd>' + esc(veh) + '</dd>' : '') +
      (l.record ? '<dt>Tiền án</dt><dd style="color:var(--bad)">' + l.record + ' lần</dd>' : '') +
      (l.ill ? '<dt>Bệnh</dt><dd style="color:var(--bad)">' + esc(l.ill.n) + '</dd>' : '') +
      (!l.alive ? '<dt>Mất</dt><dd>' + esc(l.death.cause) + '</dd>' : '') +
      '</dl><div class="mrz">' + esc(mrz.slice(0, 44)) + '</div>';
  }
  function bar(label, v, color, txt) {
    return '<div class="stat"><div class="row"><span>' + label + '</span><b>' + (txt || Math.round(v)) + '</b></div><div class="track"><div class="fill" style="width:' + v + '%;background:' + color + '"></div></div></div>';
  }
  // v2.8: tài sản ròng = tiền mặt + tiết kiệm/đầu tư + nhà + bất động sản & cửa hàng + xe − nợ, ghi rõ từng khoản
  function wealthBreak(l) {
    var A = l.assets || {}, fin = (A.save || 0) + (A.gold || 0) + (A.stock || 0) + (A.land || 0);
    var biz = (l.props || []).reduce(function (s, p) { return s + p.v; }, 0) + (l.ventures || []).reduce(function (s, v) { return s + v.cap; }, 0);
    var debt = (l.loans || []).reduce(function (s, x) { return s + x.bal; }, 0) + (l.mortgage || 0);
    var rows = [];
    function r(k, v, cls, tip) { rows.push('<dt' + (tip ? ' title="' + esc(tip) + '"' : '') + '>' + esc(k) + '</dt><dd class="' + (cls || '') + '">' + esc(v) + '</dd>'); }
    if (!l.indep) { if (l.money > 0.05) r('Tiền riêng', money(l, l.money), '', 'Tiền lì xì, tiền bố mẹ cho, tiền làm thêm — để dành được'); return rows.length ? '<dl class="statlist wb">' + rows.join('') + '</dl>' : ''; }
    r('Tiền mặt / tài khoản', (l.money < 0 ? '−' : '') + money(l, Math.abs(l.money)), l.money < 0 ? 'neg' : '', 'Tiền tiêu được ngay. Âm nghĩa là đang tiêu lố, phải vay tạm người thân hoặc thấu chi.');
    if (fin > 0.5) r('Tiết kiệm & đầu tư', money(l, fin), '', 'Sổ tiết kiệm, vàng, cổ phiếu, đất — muốn tiêu phải bán / rút');
    if (l.ownHouse && l.houseVal > 0.5) r(U.cap(l.houseName && l.houseName !== 'nhà riêng' ? l.houseName : 'nhà ở'), money(l, l.houseVal), '', 'Giá trị căn nhà đang ở');
    if (biz > 0.5) r('Nhà cho thuê & cửa hàng', money(l, biz), '', 'Bất động sản cho thuê và vốn trong cơ sở kinh doanh');
    if (l.vehVal > 0.5) r(U.cap(l.vehName || l.veh || 'xe'), money(l, l.vehVal), '', 'Giá trị còn lại của xe (xe mất giá mỗi năm)');
    if (debt > 0.5) r('Các khoản nợ', '−' + money(l, debt), 'neg', 'Tổng dư nợ ngân hàng, trả góp, vay mượn');
    return '<dl class="statlist wb">' + rows.join('') + '</dl>' + (l.money < 0 ? '<div class="small" style="color:var(--bad);margin-top:4px">Tiền mặt đang âm: bạn tiêu nhiều hơn số tiền đang có.</div>' : '');
  }
  function renderStats() {
    var l = S.life, st = l.st, k = l.karma || 0;
    var nw = E.netWorth(l);
    $('#statsPanel').innerHTML = '<h3>Tình trạng · 0–100</h3>' +
      bar('Sức khỏe', st.hea, 'var(--good)') + bar('Hạnh phúc', st.hap, 'var(--gold)') + bar('Kiến thức', st.kno, '#3d7cc9') + bar('Các mối quan hệ', st.soc, 'var(--accent)') +
      (l.mind && l.age >= 12 ? bar('Căng thẳng', l.mind.stress, l.mind.stress >= 70 ? 'var(--bad)' : l.mind.stress >= 45 ? '#d08a3a' : '#6aa58a', Math.round(l.mind.stress) + (l.mind.stress >= 70 ? ' · quá tải' : '')) : '') +
      '<div class="stat"><div class="row"><span>Nhân cách</span><b>' + karmaWord(k) + '</b></div><div class="track karma"><div class="fill" style="left:' + (k < 0 ? 50 + k / 2 : 50) + '%;width:' + Math.abs(k) / 2 + '%;background:' + (k < 0 ? 'var(--bad)' : 'var(--good)') + '"></div></div></div>' +
      '<div style="margin-top:14px" class="small muted">Tài sản ròng <span title="Tất cả những gì bạn có trừ đi tất cả những gì bạn nợ">ⓘ</span></div>' +
      '<div class="money">' + (l.indep ? esc(money(l, nw)) : '—') + '</div>' + wealthBreak(l) +
      (l.indep && l.cur !== 'vnd' ? '<div class="small muted">≈ ' + esc(G.CUR.fmtVND(G.CUR.toVND(E.H.resCode(l) === l.country ? l.gdp : (W.BY[l.abroad.code] || { gdp: l.gdp }).gdp, nw))) + '</div>' : '') +
      '<div class="small muted" style="margin-top:4px">Gia đình gốc: ' + esc(E.QUINT[l.fam.q]) + '</div>';
  }
  function renderFin() {
    var l = S.life, F = l.fin, p = $('#finPanel');
    if (!l.indep || !F) { p.innerHTML = '<h3>Tiền bạc</h3><p class="muted small" style="margin:0">' + (l.age < 18 ? 'Còn sống cùng bố mẹ. Thỉnh thoảng được cho ít tiền tiêu vặt.' : 'Chưa tự lập về tài chính.') + '</p>' + loansHtml(l); return; }
    var rows = [];
    function row(k, v, cls) { rows.push('<dt>' + esc(k) + '</dt><dd class="' + (cls || '') + '">' + esc(v) + '</dd>'); }
    row(l.retired ? (l.pensioned ? 'Lương hưu / con biếu' : 'Trợ cấp / con biếu') : 'Thu nhập của bạn', money(l, F.inc / 12) + '/tháng', 'pos');
    if (F.partner) row((l.partner ? U.cap(E.H.partnerWord(l, l.partner)) : 'Bạn đời') + ' góp', money(l, F.partner / 12) + '/tháng', 'pos');
    row('Ăn uống & sinh hoạt', '−' + money(l, Math.max(0, F.food - (F.pets || 0))));
    if (F.pets) row('Nuôi thú cưng', '−' + money(l, F.pets));
    if (F.rent) row('Thuê nhà', '−' + money(l, F.rent));
    if (F.travel) row('Đi lại', '−' + money(l, F.travel));
    if (F.kids) row('Con cái', '−' + money(l, F.kids));
    if (F.parents) row('Gửi bố mẹ', '−' + money(l, F.parents));
    if (F.health) row('Thuốc men', '−' + money(l, F.health));
    if (F.debt) row('Trả nợ', '−' + money(l, F.debt));
    if (F.life) row('Mua sắm, giải trí', '−' + money(l, F.life));
    var items = (l.yr && l.yr.items || []).slice().sort(function (a, b) { return Math.abs(b.v) - Math.abs(a.v); }).slice(0, 5);
    var ev = items.map(function (x) { return '<li><span>' + esc(x.t) + '</span><b class="' + (x.v >= 0 ? 'pos' : 'neg') + '">' + (x.v >= 0 ? '+' : '−') + esc(money(l, Math.abs(x.v))) + '</b></li>'; }).join('');
    p.innerHTML = '<h3>Tài chính năm ' + (l.alive ? l.age - (S.yearRunning ? 0 : 1) >= 0 ? (l.birthYear + l.age - (S.yearRunning ? 0 : 1)) : '' : l.death.year) + '</h3>' +
      '<dl class="statlist fin">' + rows.join('') + '</dl>' +
      '<div class="finsave ' + (F.save >= 0 ? 'pos' : 'neg') + '">' + (F.save >= 0 ? 'Cả năm dư ra ' : 'Cả năm hụt ') + esc(money(l, Math.abs(F.save))) + '</div>' +
      '<div class="small muted">' + (F.save >= 0 ? 'Thu nhập trừ chi tiêu, đã cộng vào tiền mặt.' : 'Chi nhiều hơn thu, phần hụt bị trừ vào tiền mặt.') + ' Tiền mặt hiện có: <b class="' + (l.money < 0 ? 'neg' : '') + '">' + (l.money < 0 ? '−' : '') + esc(money(l, Math.abs(l.money))) + '</b></div>' +
      (ev ? '<div class="small muted" style="margin-top:10px">Khoản phát sinh</div><ul class="finev">' + ev + '</ul>' : '') +
      loansHtml(l) + assetsHtml(l) +
      '<div class="small muted" style="margin-top:8px">Cách chi tiêu: ' + { save: 'tằn tiện', normal: 'bình thường', lavish: 'thoải mái' }[l.spend] + (l.sendParents && (l.fam.mAlive || l.fam.fAlive) ? ' · có gửi tiền cho bố mẹ' : '') + '</div>';
  }
  // v2.3: danh mục đầu tư, hụi, bảo hiểm
  function assetsHtml(l) {
    var A = l.assets || {}, rows = [];
    Object.keys(E.ASSET_NAME || {}).forEach(function (k) {
      if (!(A[k] > 0.5)) return;
      var b = (l.basis && l.basis[k]) || A[k], g = A[k] / b - 1;
      rows.push('<li><span>' + esc(U.cap(E.ASSET_NAME[k])) + ' <small class="' + (g >= 0 ? 'pos' : 'neg') + '">' + (g >= 0 ? '+' : '−') + Math.abs(Math.round(g * 100)) + '%</small></span><b>' + esc(money(l, A[k])) + '</b></li>');
    });
    if (l.hui) rows.push('<li><span>Dây hụi (' + l.hui.y + '/' + l.hui.n + ' năm' + (l.hui.got ? ', đã hốt' : '') + ')</span><b>' + esc(money(l, l.hui.c)) + '/năm</b></li>');
    if (l.ins) rows.push('<li><span>' + esc(U.cap(l.ins.name)) + '</span><b>' + esc(money(l, l.ins.prem)) + '/năm</b></li>');
    // v2.4: nhà cho thuê, cơ sở kinh doanh
    (l.props || []).forEach(function (p) { var g = p.v / (p.basis || p.v) - 1; rows.push('<li><span>🏠 ' + esc(U.cap(p.n)) + ' <small class="' + (g >= 0 ? 'pos' : 'neg') + '">' + (g >= 0 ? '+' : '−') + Math.abs(Math.round(g * 100)) + '%</small></span><b>' + esc(money(l, p.v)) + '</b></li>'); });
    (l.ventures || []).forEach(function (v) { rows.push('<li><span>🏪 ' + esc(U.cap(v.n)) + (v.br > 1 ? ' · ' + v.br + ' chi nhánh' : '') + '</span><b>' + esc(money(l, v.cap)) + '</b></li>'); });
    if (!rows.length) return '';
    var M = l.mkt || {};
    return '<div class="small muted" style="margin-top:10px">Tài sản đầu tư · chứng khoán ' + esc(M.stock || '') + ' · đất ' + esc(M.land || '') + '</div><ul class="finev">' + rows.join('') + '</ul>';
  }
  function loansHtml(l) {
    var ls = (l.loans || []).filter(function (x) { return x.bal > 0.5; });
    var credit = l.credit && l.credit.bad ? '<div class="small" style="color:var(--bad);margin-top:6px">⚠ Nợ xấu (CIC) từ năm ' + (l.birthYear + l.credit.since) + ' · tự xóa sau 5 năm không trễ hạn</div>' : '';
    if (!ls.length) return credit;
    return '<div class="small muted" style="margin-top:10px">Các khoản nợ</div><ul class="finev">' + ls.map(function (x) {
      return '<li><span>' + esc(U.cap(x.name)) + (x.late ? ' · trễ hạn' : '') + '</span><b class="neg">' + esc(money(l, x.bal)) + '</b></li>';
    }).join('') + '</ul>' + credit;
  }
  function renderFam() {
    var l = S.life, f = l.fam, a = l.age, li = [];
    function row(txt, dead) { li.push('<li' + (dead ? ' class="dead"' : '') + '>' + txt + '</li>'); }
    // nghề & thu nhập hiện tại của bố mẹ (thay đổi theo năm: tăng lương, mất việc, nghỉ hưu)
    var pjob = function (job, ret, lost, alive) {
      if (!alive) return esc(job);
      if (ret) return 'đã nghỉ (trước là ' + esc(job) + ')';
      return esc(job) + (lost ? ' · đang mất việc' : '');
    };
    var pinc = function (v, v0, ret, alive) {
      if (!alive) return '';
      var s = ' · <b>' + esc(money(l, v || 0)) + '/tháng</b>' + (ret ? (v > 0 ? ' lương hưu / trợ cấp' : ' (không lương hưu)') : '');
      if (v0 > 0 && Math.abs(v - v0) / v0 > 0.15) s += ' <small class="muted">(lúc bạn chào đời: ' + esc(money(l, v0)) + ')</small>';
      return s;
    };
    row('Mẹ: ' + esc(f.mName) + ' · ' + (f.mAlive ? (f.mAge + a) + ' tuổi' : 'đã mất') + ' · ' + pjob(f.mJob, f.mRet, f.mLost, f.mAlive) + pinc(f.mInc, f.mInc0, f.mRet, f.mAlive), !f.mAlive);
    if (!f.noDad) row('Bố: ' + esc(f.fName) + ' · ' + (f.fAlive ? (f.fAge + a) + ' tuổi' : 'đã mất') + ' · ' + pjob(f.fJob, f.fRet, f.fLost, f.fAlive) + pinc(f.fInc, f.fInc0, f.fRet, f.fAlive), !f.fAlive);
    // v2.4: từng anh chị em ruột (tên, tuổi, nghề, độ thân thiết)
    if (l.sibList && l.sibList.length) l.sibList.slice().sort(function (x, y) { return x.born - y.born; }).forEach(function (s) {
      var sa = a - s.born, w = s.born < 0 ? (s.sex === 'M' ? 'Anh trai' : 'Chị gái') : (s.sex === 'M' ? 'Em trai' : 'Em gái');
      if (sa < 0) return;
      row(w + ': ' + esc(s.n) + ' · ' + (s.alive ? sa + ' tuổi' + (sa >= 18 ? ' · ' + esc(sa >= 65 ? 'đã nghỉ ngơi' : s.job) : '') + (sa >= 8 ? ' · ' + (s.close >= 70 ? '❤ thân thiết' : s.close >= 40 ? 'bình thường' : 'xa cách') : '') : 'đã mất'), !s.alive);
    });
    else if (f.sibs) row('Anh chị: ' + f.sibs);
    if (l.gen > 1) row('🌳 Thế hệ thứ ' + l.gen + ' · ' + esc((l.lineage || []).map(function (x) { return x.n; }).join(' → ')) + ' → bạn');
    if (l.partner) {
      var p = l.partner, w = p.status === 'dating' ? 'Người yêu' : p.status === 'cohabit' ? 'Bạn đời' : (p.sex === l.sex ? 'Bạn đời' : p.sex === 'M' ? 'Chồng' : 'Vợ');
      var pj = p.job ? ' · ' + esc(p.job) : '';
      var pi = p.job && p.job !== 'sinh viên' ? (E.H.partnerIncKnown && E.H.partnerIncKnown(l, p) ? ' · <b>' + esc(money(l, p.inc || 0)) + '/tháng</b>' : ' · <span class="muted">thu nhập: chưa rõ</span>') : '';
      row(w + ': ' + esc(p.name) + ' · ' + p.age + ' tuổi' + pj + pi);
    } else if (l.widowed) row('Góa bụa');
    l.kids.forEach(function (k) {
      var ka = a - k.born, info = '';
      if (k.alive) {
        if (k.jail && ka < k.jail) info = ' · đang thụ án';
        else if (k.job) info = ' · ' + esc(E.kidTitle(k)) + (k.inc ? ' · ' + esc(money(l, k.inc)) + '/tháng' : '');
        else if (k.uniUntil) info = ' · ' + (k.abroadStudy ? 'du học' : 'sinh viên đại học');
        else if (ka >= 6 && ka <= 17) info = ' · học ' + (k.study >= 70 ? 'giỏi' : k.study >= 45 ? 'khá' : 'yếu');
        if (k.vice) info += ' · <span style="color:var(--bad)">' + esc(k.vice === 'game' ? 'nghiện game' : k.vice) + '</span>';
        if (ka >= 10 && k.close != null) info += ' · ' + (k.close >= 70 ? '❤ thân thiết' : k.close >= 40 ? 'bình thường' : 'xa cách');
      }
      row((k.sex === 'M' ? 'Con trai' : 'Con gái') + ': ' + esc(k.name) + ' · ' + (k.alive ? ka + ' tuổi' : 'đã mất') + info, !k.alive);
    });
    if (l.grand) row('Cháu: ' + l.grand + (l.ggrand ? ' · Chắt: ' + l.ggrand : ''));
    if (l.bff) row('Bạn thân: ' + esc(l.bff.name) + (l.bff.alive ? ' · ' + (l.bff.close >= 70 ? 'thân thiết' : l.bff.close >= 40 ? 'vẫn giữ liên lạc' : 'đã xa cách') : ' · đã mất'), !l.bff.alive);
    if (l.idol) row('Thần tượng: ' + esc(l.idol));
    (l.pets || []).slice(-4).forEach(function (pt) { row('🐾 ' + esc(U.cap(E.H.petLabel(pt))) + ' ' + esc(pt.n) + ' · ' + (pt.alive ? Math.max(0, a - pt.since) + ' năm bên bạn' : pt.lost ? 'đã thất lạc' : 'đã mất'), !pt.alive); });
    var home = l.age < 18 && !l.indep ? 'Sống cùng bố mẹ trong ' + (l.houseType ? l.houseType + ' ' : '') + '(' + f.home + ')' : (l.ownHouse ? 'Sống trong ' + (l.houseName && l.houseName !== 'nhà riêng' ? l.houseName : 'nhà riêng') : l.urban ? 'Thuê nhà' : 'Sống ở quê');
    if (l.veh === 'ô tô' && l.vehName) home += ' · đi ' + l.vehName;
    $('#famPanel').innerHTML = '<h3>Gia đình & những người thân</h3><ul class="fam">' + li.join('') + '</ul><div class="small muted" style="margin-top:8px">' + esc(home) + '</div>';
  }
  function renderFocus() {
    var l = S.life, a = l.age, p = $('#focusPanel');
    if (!l.alive) { p.innerHTML = '<h3>Đã khép lại</h3><p class="muted" style="margin:0">' + esc(l.name) + ' đã ra đi ở tuổi ' + l.death.age + '.</p>'; return; }
    if (a < 6) {
      p.innerHTML = '<h3>Trọng tâm năm nay</h3><p style="margin:0">Còn bé, được bố mẹ nuôi nấng. Những năm đầu đời âm thầm định hình tính cách. Từ 6 tuổi bạn có thể chọn trọng tâm cho từng năm — có thể tua nhanh giai đoạn này.</p>';
      return;
    }
    var kid = a < 15;
    var cur = l.focus === 'baby' ? 'study' : l.focus;
    if (kid && cur === 'work') cur = 'study';
    if (cur === 'balance' && a < 21) cur = kid ? 'study' : 'social';
    var chips = FOCUS.filter(function (f) { return (!kid || f[3]) && !(f[5] && a < f[5]); }).map(function (f) {
      return '<button class="chip' + (f[0] === cur ? ' on' : '') + '" data-f="' + f[0] + '">' + (kid ? f[3] : f[1]) + '</button>';
    }).join('');
    var d = FOCUS.filter(function (f) { return f[0] === cur; })[0];
    p.innerHTML = '<h3>Trọng tâm năm nay · ' + (a) + ' tuổi</h3><div class="chips">' + chips + '</div><div class="desc">' + esc(kid ? d[4] : d[2]) + '</div>';
    $$('[data-f]', p).forEach(function (b) { b.onclick = function () { l.focus = b.dataset.f; renderFocus(); persist(); }; });
  }
  function renderActions() {
    var l = S.life, p = $('#actPanel');
    if (!l.alive || l.age < 8) { p.innerHTML = '<h3>Việc bạn muốn làm</h3><p class="muted small" style="margin:0">' + (l.alive ? 'Từ 8 tuổi, bạn có thể chủ động làm những việc mình muốn.' : '—') + '</p>'; return; }
    var acts = E.actions(l), groups = {};
    acts.forEach(function (x) { if (x.ok === true || !/^(Từ \d+ tuổi|Không áp dụng|Không còn phù hợp)/.test(x.ok)) (groups[x.g] = groups[x.g] || []).push(x); });
    // v2.7: gọn hơn — chỉ hiện hàng nhóm việc; bấm một nhóm mới mở danh sách việc của nhóm đó
    var lim = E.actsLimit(l), left = lim === Infinity ? null : Math.max(0, lim - (l.acts || 0));
    if (S.actG === undefined) S.actG = LS.get('mkn.actg', null);
    var sel = S.actG && groups[S.actG] ? S.actG : null;
    p.innerHTML = '<h3>Việc bạn muốn làm <span class="muted small" style="text-transform:none;letter-spacing:0">· ' + (left == null ? 'không giới hạn lượt' : 'còn ' + left + '/' + lim + ' lượt năm nay') + '</span></h3>' +
      '<div class="chips actgroups">' + Object.keys(groups).map(function (g) {
        var n = groups[g].filter(function (x) { return x.ok === true; }).length;
        return '<button class="chip sm' + (g === sel ? ' on' : '') + (n ? '' : ' off') + '" data-ag="' + esc(g) + '">' + esc(g) + (n ? ' <small>' + n + '</small>' : '') + '</button>';
      }).join('') + '</div>' +
      (sel ? '<div class="chips actlist">' + groups[sel].map(function (x) {
        return '<button class="chip act' + (x.ok === true ? '' : ' off') + '" data-act="' + x.id + '"' + (x.ok === true ? '' : ' title="' + esc(x.ok) + '" disabled') + '>' + esc(x.l) + '</button>';
      }).join('') + '</div>' : '<p class="muted small actnote">Bấm một nhóm để xem các việc có thể làm. Không chọn gì thì đôi khi game sẽ tự quyết thay bạn.</p>');
    $$('[data-ag]', p).forEach(function (b) { b.onclick = function () { S.actG = S.actG === b.dataset.ag ? null : b.dataset.ag; LS.set('mkn.actg', S.actG); renderActions(); }; });
    $$('[data-act]', p).forEach(function (b) { b.onclick = function () { doAction(b.dataset.act); }; });
  }
  function doAction(id) {
    var l = S.life;
    if (!l || !l.alive || S.phase === 'decision' || S.phase === 'decmin' || S.phase === 'reflect' || S.phase === 'dead') { if (S.phase === 'decmin') toast('Hãy chọn xong lựa chọn đang chờ trước đã'); return; }
    var d = E.act(l, id);
    if (!d) { toast('Chưa thể làm việc này lúc này'); return; }
    d.manual = true; // người chơi tự bấm thì người chơi tự chọn, kể cả khi bật chế độ tự động
    S.skipping = false; renderTopbar(); showDecision();
  }
  function renderCohort() {
    var a = S.life.age;
    $('#cohortLive').innerHTML = (S.cohort || []).map(function (c) {
      var gone = c.death && c.death.age < a;
      var st = gone ? 'đã mất ở tuổi ' + c.death.age + ' (' + c.death.cause + ')' : (c.tl[a] || c.tl[c.tl.length - 1] || '');
      return '<div class="c' + (gone ? ' gone' : '') + '"><b>' + esc(c.name) + '</b><span>' + esc(c.where) + ' · ' + (c.sex === 'M' ? 'Nam' : 'Nữ') + '</span><span>' + esc(st) + '</span></div>';
    }).join('') || '<span class="muted small">—</span>';
  }
  function renderMap(target, life, hapStr, e0) {
    var el = target || $('#lifeMap');
    var yrs = life ? life.yrs : hapStr ? hapStr.split('').map(function (c, i) { return { a: i, hap: +c * 10 + 5 }; }) : S.life.yrs;
    var exp = Math.round(life ? life.e0sex : e0 || (S.life && S.life.e0sex) || 75);
    var ageNow = life ? life.age : hapStr ? hapStr.length - 1 : S.life.age;
    var n = Math.min(120, Math.max(Math.ceil((Math.max(exp, ageNow) + 5) / 10) * 10, 60));
    var html = '';
    for (var i = 0; i < n; i++) {
      var y = yrs[i], cls = [], style = '';
      if (y) { cls.push('lived'); style = ' style="opacity:' + (0.18 + y.hap / 100 * 0.82).toFixed(2) + '"'; }
      if (i === exp) cls.push('exp');
      if (!target && i === S.life.age && S.life.alive) cls.push('now');
      html += '<i class="' + cls.join(' ') + '"' + style + ' title="' + i + ' tuổi' + (y ? ' · hạnh phúc ' + y.hap : '') + '"></i>';
    }
    el.innerHTML = html;
    if (!target) $('#mapNote').textContent = '1 ô = 1 năm · đậm hơn = hạnh phúc hơn · ô viền vàng = tuổi thọ kỳ vọng (' + U.fmtNum(S.life.e0sex, 1) + ' năm)';
  }
  function dl(rows) { return '<dl class="statlist">' + rows.map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('') + '</dl>'; }
  function renderPlace() {
    var l = S.life, html;
    if (E.isVN(l)) {
      var o = VN.byName[l.prov.old], n = VN.P34[l.prov.neuId];
      var ethE = VN.ethByName(l.eth);
      html = '<h3>' + esc(l.variant === '63' ? 'Tỉnh ' + o.name : n.kind + ' ' + n.name) + '</h3>' + dl([
        ['Vùng', VN.REGIONS[o.region]],
        ['Dân số', U.fmtNum((l.variant === '63' ? o.pop : n.pop) / 1000, 2) + ' triệu'],
        l.variant === '63' ? ['Từ 1/7/2025 thuộc', o.newName] : ['Gồm tỉnh cũ', n.members.map(function (m) { return m.name; }).join(', ')],
        ['Tỷ lệ đô thị (' + o.name + ')', pct(o.urban, 0)],
        ['Thu nhập so với TB cả nước', '×' + U.fmtNum(o.wealth, 2)],
        ['Dân tộc ' + l.eth, ethE.id === 0 ? '85,3% dân số' : U.fmtNum(ethE.pop) + ' người']
      ]) + '<h3 style="margin-top:14px">Việt Nam</h3>' + dl([
        ['Dân số', '~100,3 triệu'], ['Trẻ sinh mỗi năm', '~1,35 triệu'], ['Tuổi thọ nữ / nam', '77,4 / 72,2'],
        ['Tử vong dưới 5 tuổi', '~20‰'], ['GDP/người (PPP)', '~$14.300'], ['Tỷ lệ đô thị', '~38%'], ['Hôn nhân cùng giới', 'Chưa công nhận']
      ]);
    } else {
      var c = W.BY[l.country], cur = G.CUR.CUR[l.country];
      var ss = W.SSM.indexOf(c.code) >= 0 ? 'Hợp pháp' : W.CRIM.indexOf(c.code) >= 0 ? 'Bị hình sự hóa' : 'Chưa công nhận';
      html = '<h3>' + esc(c.name) + '</h3>' + dl([
        ['Trẻ sinh mỗi năm', c.births >= 1000 ? U.fmtNum(c.births / 1000, 2) + ' triệu' : U.fmtNum(c.births * 1000)],
        ['Tỷ lệ trên thế giới', pct(c.births / W.BIRTHS_TOTAL, 2)],
        ['Tuổi thọ trung bình', U.fmtNum(c.e0, 1) + ' năm'],
        ['Tử vong dưới 5 tuổi', U.fmtNum(c.u5) + '‰'],
        ['GDP/người (PPP)', '$' + U.fmtNum(c.gdp * 1000)],
        ['Đồng tiền', cur ? cur.name + ' (' + cur.code + ')' : '—'],
        ['Tỷ lệ đô thị', pct(c.urban, 0)],
        ['Quan hệ cùng giới', ss]
      ]);
    }
    html += '<p class="small muted" style="margin:10px 0 0">Số liệu làm tròn (GSO, UN WPP 2024, World Bank) — dùng để mô phỏng.</p>';
    $('#placePanel').innerHTML = html;
  }

  // ---------- hộp thoại ----------
  function modal(html, bind, cls) {
    var root = $('#modalRoot');
    root.innerHTML = '<div class="overlay"><div class="card modal ' + (cls || '') + '" role="dialog" aria-modal="true">' + html + '</div></div>';
    if (bind) bind($('.modal', root));
    var f = $('.modal button, .modal textarea', root); if (f) f.focus();
  }
  function closeModal() { $('#modalRoot').innerHTML = ''; if (S.modalTimer) { clearTimeout(S.modalTimer); S.modalTimer = null; } }

  // v2.5: thu nhỏ hộp lựa chọn để xem các bảng, đổi trọng tâm năm nay… rồi mở lại để chọn (đời tạm dừng trong lúc đó)
  function minimizeDecision() {
    var d = S.life && S.life.pending[0]; if (!d || S.phase !== 'decision') return;
    closeModal(); S.phase = 'decmin';
    var pill = $('#decPill') || document.body.appendChild(Object.assign(document.createElement('button'), { id: 'decPill', className: 'decpill' }));
    pill.innerHTML = '<span class="dot"></span>Đang chờ bạn chọn: <b>' + esc(d.title) + '</b><span class="go">Mở lại ›</span>';
    pill.onclick = function () { showDecision(); };
    renderAll();
  }
  function clearDecPill() { var p = $('#decPill'); if (p) p.remove(); }
  function showDecision() {
    clearDecPill();
    var l = S.life, d = l.pending[0];
    if (!d) { afterDecisions(); return; }
    S.phase = 'decision';
    var major = E.isMajor(d);
    var aiPick = !d.manual && (S.auto || (S.minorOnly && !major));
    modal('<div class="tier ' + (major ? 'major' : 'minor') + '">' + (major ? '⚡ Ngã rẽ quyết định' : 'Lựa chọn thường ngày') + '</div>' +
      '<div class="agep">' + ageStr(l.age) + ' · ' + (l.birthYear + l.age) + '</div><h2>' + esc(d.title) + '</h2><p>' + esc(d.text) + '</p>' +
      (major ? '<p class="tierwarn">Lựa chọn này có thể thay đổi cả cuộc đời ' + esc(l.name) + '. Hãy cân nhắc kỹ.</p>' : '') +
      '<div class="opts">' + d.opts.map(function (o) { return '<button class="opt" data-k="' + esc(o.k) + '"><b>' + esc(o.l) + '</b>' + (o.h ? '<span>' + esc(o.h) + '</span>' : '') + '</button>'; }).join('') + '</div>' +
      (aiPick ? '<div class="autonote">' + (S.auto ? 'Chế độ tự động' : 'Lựa chọn thường ngày') + ': AI đang cân nhắc theo tính cách của ' + esc(l.name) + '… (bấm một lựa chọn để tự quyết)</div>' : '') +
      '<div class="decmin-row"><button class="btn ghost sm" id="decMin" title="Phím Esc">⤓ Thu nhỏ — xem bảng, chỉnh trọng tâm rồi chọn sau</button></div>',
      function (box) {
        $$('[data-k]', box).forEach(function (b) { b.onclick = function () { choose(b.dataset.k, true); }; });
        $('#decMin', box).onclick = minimizeDecision;
        if (aiPick) {
          var k = E.autoKey(l), fast = !S.auto;
          S.modalTimer = setTimeout(function () {
            var b = $('[data-k="' + k + '"]', box); if (b) b.classList.add('picked');
            S.modalTimer = setTimeout(function () { choose(k); }, fast ? 450 : 650);
          }, fast ? 700 : 1100);
        }
      }, (d.tone === 'dark' ? 'dark-tone ' : '') + (major ? 'major' : 'minor'));
  }
  function choose(k, byHand) {
    closeModal();
    var cur = S.life.pending[0], wasManual = cur && cur.manual, rest = S.life.pending.length - 1;
    var pets0 = (S.life.pets || []).length;
    var entries = E.resolve(S.life, k);
    // v2.7: vừa nhận nuôi thú cưng bằng lựa chọn của chính mình → tự đặt tên
    var newPet = byHand && S.life.alive && (S.life.pets || []).length > pets0 ? S.life.pets[S.life.pets.length - 1] : null;
    if (newPet) { namePet(newPet, entries, function () { afterChoose(entries, wasManual, rest); }); return; }
    afterChoose(entries, wasManual, rest);
  }
  function namePet(pet, entries, done) {
    var old = pet.n;
    modal('<div class="agep">Thú cưng mới</div><h2>Đặt tên cho ' + esc(E.H.petLabel ? E.H.petLabel(pet) : pet.k) + '</h2>' +
      '<div class="field"><label for="petName">Tên</label><input id="petName" maxlength="24" value="' + esc(old) + '"></div>' +
      '<div class="go-row"><button class="btn primary" id="petOk">Đặt tên</button><button class="btn ghost" id="petKeep">Giữ tên "' + esc(old) + '"</button></div>',
      function (box) {
        var inp = $('#petName', box); inp.focus(); inp.select();
        function save(n) {
          n = (n || '').trim().slice(0, 24) || old;
          if (n !== old) {
            pet.n = n;
            var re = new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            (S.life.log || []).slice(-30).forEach(function (e) { if (e.t && e.a === S.life.age) e.t = e.t.replace(re, n); });
            (entries || []).forEach(function (e) { if (e.t) e.t = e.t.replace(re, n); });
            (S.life.mem || []).forEach(function (m) { if (m.a === S.life.age && m.t) m.t = m.t.replace(re, n); });
          }
          closeModal(); done();
        }
        $('#petOk', box).onclick = function () { save(inp.value); };
        $('#petKeep', box).onclick = function () { save(old); };
        inp.onkeydown = function (e) { if (e.key === 'Enter') save(inp.value); };
      }, 'petname');
  }
  function afterChoose(entries, wasManual, rest) {
    if (wasManual) { var added = S.life.pending.length - rest; for (var i = 0; i < added; i++) S.life.pending[i].manual = true; }
    entries.forEach(function (e) { e.k = e.k || 'decision'; addLog(e); });
    renderAll(); persist();
    if (!S.life.alive) {
      S.queue = []; S.yearRunning = false; S.phase = 'dead'; LS.del(K.cur);
      setTimeout(toFinale, 1200); return;
    }
    if (S.life.pending.length) showDecision(); else afterDecisions();
  }
  function afterDecisions() {
    if (S.yearRunning) { S.phase = 'running'; S.last = performance.now(); }
    else runYear();
  }

  var QUESTIONS = {
    5: 'Năm tuổi. Bạn còn nhớ điều gì về năm lên năm của chính mình?',
    15: 'Mười lăm tuổi. Nếu được nói một điều với người này lúc này, bạn sẽ nói gì?',
    30: 'Ba mươi tuổi. Cuộc đời này và cuộc đời bạn — điều gì giống nhau, điều gì khác nhau?',
    50: 'Năm mươi tuổi. Điều gì người này có mà bạn chưa có — và ngược lại?',
    70: 'Bảy mươi tuổi. Bạn mong người này nhớ lại điều gì nhất?'
  };
  function showReflection(age) {
    S.phase = 'reflect';
    modal('<div class="agep">Một quãng lặng · ' + ageStr(age) + '</div><h2>' + esc(QUESTIONS[age]) + '</h2>' +
      '<p class="muted small">Hãy nghĩ về cuộc đời của ' + esc(S.life.name) + ' và cuộc đời của chính bạn. Viết một dòng nếu muốn — chỉ lưu trên thiết bị này.</p>' +
      '<textarea id="reflTxt" maxlength="500" placeholder="Viết vài dòng…"></textarea>' +
      '<div class="go-row" style="margin-top:12px"><button class="btn primary" id="reflOk">Tiếp tục sống</button><button class="btn ghost" id="reflSkip">Bỏ qua</button></div>',
      function (box) {
        $('#reflOk', box).onclick = function () {
          var t = ($('#reflTxt', box).value || '').trim();
          if (t) { S.life.refl[age] = t; var e = { a: age, y: S.life.birthYear + age, t: '“' + t + '”', k: 'refl' }; S.life.log.push(e); addLog(e); E.H.mem(S.life, 'Bạn đã viết: “' + t + '”', 2, age); persist(); }
          closeModal(); startYear();
        };
        $('#reflSkip', box).onclick = function () { closeModal(); startYear(); };
      });
  }

  // =====================================================================
  // KHÚC CUỐI ĐỜI & KẾT THÚC
  // =====================================================================
  function toFinale() {
    var l = S.life; if (!l) return;
    closeModal();
    if (S.phase === 'finale') return;
    S.phase = 'finale';
    var stages = E.finale(l), i = 0;
    var sum = E.share.summary(l);
    sum.fin = stages;
    LS.set(K.recent, E.share.pushRecent(LS.get(K.recent, []), sum, 10));
    LS.set(K.last, { life: l, cohort: S.cohort });
    function step() {
      if (S.modalTimer) { clearTimeout(S.modalTimer); S.modalTimer = null; }
      if (i >= stages.length) { closeModal(); S.phase = 'idle'; renderEnd(l, S.cohort, stages); show('end'); return; }
      var s = stages[i];
      modal('<div class="agep">Khúc cuối · ' + (i + 1) + '/' + stages.length + '</div><h2>' + esc(s.h) + '</h2>' + (s.x ? '<p class="finale-x">' + esc(s.x) + '</p>' : '') +
        (s.list ? '<ul class="finale-list">' + s.list.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') +
        '<div class="go-row" style="margin-top:14px"><button class="btn primary" id="finNext">' + (i === stages.length - 1 ? 'Khép lại cuộc đời' : 'Tiếp') + '</button><button class="btn ghost" id="finSkip">Bỏ qua</button></div>',
        function (box) {
          $('#finNext', box).onclick = function () { i++; step(); };
          $('#finSkip', box).onclick = function () { i = stages.length; step(); };
          S.modalTimer = setTimeout(function () { i++; step(); }, (S.auto ? 3500 : 9000) + (s.list ? s.list.length * 1500 : 0));
        }, 'finale');
    }
    step();
  }
  function lifeYears(l) { return l.birthYear + ' – ' + l.death.year; }
  function memWhere(l) { return E.isVN(l) ? (l.provLabel || l.prov.old) + ', Việt Nam' : l.countryName; }
  function finaleHtml(stages) {
    return (stages || []).map(function (s) {
      return '<div class="fin-block"><h4>' + esc(s.h) + '</h4>' + (s.x ? '<p>' + esc(s.x) + '</p>' : '') + (s.list ? '<ul>' + s.list.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') + '</div>';
    }).join('');
  }
  function renderEnd(l, cohort, stages) {
    var kidsAlive = l.kids.filter(function (k) { return k.alive; }).length;
    var nw = E.netWorth(l);
    var refl = Object.keys(l.refl || {}).map(function (k) { return '<blockquote>' + k + ' tuổi — ' + esc(l.refl[k]) + '</blockquote>'; }).join('');
    var stars = E.starred(l), kidsLive = l.kids.filter(function (k) { return k.alive; });
    $('#endWrap').innerHTML =
      '<header class="top"><div class="brand" data-go3="home"><img class="logo" src="logo.svg?v=' + G.VERSION + '" alt="">Một Đời</div></header>' +
      '<div class="card pad"><div class="eyebrow">Một đời người</div><h1 style="font-size:clamp(32px,6vw,48px);margin:6px 0 2px">' + esc(l.name) + '</h1>' +
      (l.nameSub ? '<div class="muted">' + esc(l.nameSub) + '</div>' : '') +
      '<div class="years">' + esc(lifeYears(l) + ' · ' + memWhere(l) + ' · ' + l.death.age + ' tuổi') + '</div>' +
      '<p class="epitaph">' + esc(E.obituary(l)) + '</p>' +
      '<div class="endstats">' +
      '<div class="s"><b>' + l.death.age + '</b><span>tuổi (kỳ vọng ' + U.fmtNum(l.e0sex, 1) + ')</span></div>' +
      '<div class="s"><b>' + esc(U.cap(E.EDU[l.edu])) + '</b><span>học vấn</span></div>' +
      '<div class="s"><b>' + l.kids.length + (l.grand ? ' · ' + l.grand : '') + '</b><span>con' + (l.grand ? ' · cháu' : '') + (kidsAlive < l.kids.length ? ' (mất ' + (l.kids.length - kidsAlive) + ')' : '') + '</span></div>' +
      '<div class="s"><b>' + (l.indep ? esc(money(l, nw)) : '—') + '</b><span>tài sản cuối đời</span></div>' +
      '</div>' +
      '<div class="lifemap" id="endMap"></div><div class="small muted" style="margin-top:6px">1 ô = 1 năm · đậm hơn = hạnh phúc hơn · viền vàng = tuổi thọ kỳ vọng</div>' +
      '<h3 style="margin:22px 0 4px">Khúc cuối</h3><div class="fin-wrap">' + finaleHtml(stages) + '</div>' +
      (refl ? '<h3 style="margin:22px 0 4px">Những quãng lặng</h3><div class="refl-list">' + refl + '</div>' : '') +
      (stars.length ? '<h3 style="margin:22px 0 4px">⭐ Khoảnh khắc bạn đã đánh dấu</h3><ul class="finale-list">' + stars.map(function (e) { return '<li>' + e.a + ' tuổi — ' + esc(e.t) + '</li>'; }).join('') + '</ul>' : '') +
      (kidsLive.length ? '<div class="card pad heir"><div class="eyebrow">Đời người nối tiếp</div><p style="margin:6px 0 10px">' + esc(l.name) + ' để lại ' + (kidsLive.length === 1 ? 'một người con' : kidsLive.length + ' người con') + '. Bạn có thể sống lại cuộc đời của con từ lúc chào đời — trong gia đình do chính bạn gây dựng.</p><div class="go-row">' +
        kidsLive.map(function (k, i) { return '<button class="btn gold" data-heir="' + i + '">Sống tiếp đời ' + (k.sex === 'M' ? 'con trai' : 'con gái') + ' ' + esc(k.name) + '</button>'; }).join('') + '</div></div>' : '') +
      '<h3 style="margin:22px 0 4px">Những người sinh cùng giây</h3><div class="cohort">' + (cohort || []).map(function (c) {
        return '<div class="c"><b>' + esc(c.name) + '</b><span>' + esc(c.where) + (c.death ? ' · mất ở tuổi ' + c.death.age : '') + '</span><p class="small" style="margin:6px 0 0">' + esc(c.summary) + '</p></div>';
      }).join('') + '</div>' +
      '<div class="field" style="margin-top:22px"><label for="finalWords">Lời cuối gửi người này</label><textarea id="finalWords" maxlength="600" placeholder="Bạn muốn nói gì với ' + esc(l.name) + '?">' + esc(l.finalWords || '') + '</textarea></div>' +
      '<div class="go-row"><button class="btn primary" id="saveMem">Lưu vào đài tưởng niệm</button><button class="btn" id="shareEnd">Chia sẻ cuộc đời này</button><button class="btn" id="cardEnd">🖼 Ảnh thẻ cuộc đời</button><button class="btn" id="copyEnd">Sao chép dạng chữ</button><button class="btn" id="again">Sống một cuộc đời mới</button></div>' +
      '<div class="helpline">Nếu những điều trong trò chơi làm bạn buồn lòng, hãy chia sẻ với người thân hoặc bạn bè. Trẻ em và người chăm sóc trẻ có thể gọi Tổng đài quốc gia bảo vệ trẻ em <b>111</b> (miễn phí, 24/7).</div>' +
      '</div>';
    renderMap($('#endMap'), l);
    $('[data-go3]').onclick = function () { show('home'); };
    $('#again').onclick = function () { show('home'); };
    function words() { return ($('#finalWords').value || '').trim(); }
    function updRecent() { var s = E.share.summary(l, words()); s.fin = stages; LS.set(K.recent, E.share.pushRecent(LS.get(K.recent, []), s, 10)); return s; }
    $('#copyEnd').onclick = function () { copyText('🕯 ' + l.name + ' (' + lifeYears(l) + ', ' + memWhere(l) + ')\n' + E.obituary(l) + (words() ? '\n“' + words() + '”' : '') + '\n— Một Đời'); };
    $('#shareEnd').onclick = function () { l.finalWords = words(); shareLink(updRecent()); };
    $('#cardEnd').onclick = function () { l.finalWords = words(); cardImage(updRecent(), E.art.avatar(Object.assign({}, l, { alive: true, age: Math.max(0, l.death.age) })), this); };
    $$('[data-heir]').forEach(function (b) {
      b.onclick = function () {
        var k = kidsLive[+b.dataset.heir]; if (!k) return;
        l.finalWords = words(); updRecent();
        if (!confirm('Bắt đầu cuộc đời của ' + k.name + ' từ lúc chào đời, là con của ' + l.name + '?')) return;
        bornWith(E.childOpts(l, k));
      };
    });
    $('#saveMem').onclick = function () {
      l.finalWords = words(); updRecent();
      var mem = LS.get(K.mem, []);
      if (mem.some(function (m) { return m.id === l.id; })) mem = mem.filter(function (m) { return m.id !== l.id; });
      mem.push({ id: l.id, name: l.name, sub: l.nameSub, where: memWhere(l), years: lifeYears(l), age: l.death.age, cause: l.death.cause, summary: E.obituary(l), words: l.finalWords, refl: l.refl, yrs: l.yrs, e0sex: l.e0sex, age2: l.age, savedAt: Date.now(), fin: stages });
      if (mem.length > 60) mem = mem.slice(-60);
      if (LS.set(K.mem, mem)) { toast('Đã lưu vào đài tưởng niệm'); this.disabled = true; this.textContent = 'Đã lưu ✓'; }
      else toast('Không lưu được (bộ nhớ trình duyệt bị chặn hoặc đầy)');
    };
  }

  // ---------- Ảnh thẻ cuộc đời (xem trước rồi tải / chia sẻ) ----------
  function cardImage(sum, avatarSvg, btn) {
    if (!G.LifeCard) { toast('Trình duyệt không hỗ trợ tạo ảnh'); return; }
    var old = btn ? btn.textContent : ''; if (btn) { btn.disabled = true; btn.textContent = 'Đang vẽ ảnh…'; }
    G.LifeCard.draw(sum, avatarSvg).then(function (cv) {
      if (btn) { btn.disabled = false; btn.textContent = old; }
      modal('<div class="agep">Ảnh thẻ cuộc đời</div><h2>' + esc(sum.n) + '</h2><img class="cardprev" alt="Ảnh thẻ cuộc đời của ' + esc(sum.n) + '" src="' + cv.toDataURL('image/png') + '">' +
        '<p class="small muted">Ảnh 1080×1350, hợp để đăng Facebook, Instagram, Zalo, TikTok.</p>' +
        '<div class="go-row"><button class="btn primary" id="cardDl">Tải ảnh về</button>' + (navigator.share ? '<button class="btn" id="cardSh">Chia sẻ ảnh</button>' : '') + '<button class="btn ghost" id="cardX">Đóng</button></div>',
        function (box) {
          $('#cardDl', box).onclick = function () { G.LifeCard.download(sum, avatarSvg).then(function () { toast('Đã tải ảnh về máy'); }); };
          if ($('#cardSh', box)) $('#cardSh', box).onclick = function () { G.LifeCard.share(sum, avatarSvg); };
          $('#cardX', box).onclick = closeModal;
        }, 'cardmodal');
    }, function () { if (btn) { btn.disabled = false; btn.textContent = old; } toast('Không tạo được ảnh'); });
  }

  // ---------- Màn xem cuộc đời được chia sẻ ----------
  function renderShared(s, own) {
    var mems = (s.mem || []).map(function (x) { var p = String(x).split('|'); return '<li>' + esc(p[0]) + ' tuổi — ' + esc(p.slice(1).join('|')) + '</li>'; }).join('');
    $('#sharedWrap').innerHTML =
      '<header class="top"><div class="brand" data-go4="home"><img class="logo" src="logo.svg?v=' + G.VERSION + '" alt="">Một Đời</div></header>' +
      '<div class="card pad"><div class="eyebrow">' + (own ? 'Một cuộc đời bạn đã sống' : 'Một người bạn đã chia sẻ cuộc đời này') + '</div>' +
      '<h1 style="font-size:clamp(32px,6vw,48px);margin:6px 0 2px">' + esc(s.n) + '</h1>' + (s.s ? '<div class="muted">' + esc(s.s) + '</div>' : '') +
      '<div class="years">' + esc(s.y + ' · ' + s.w + ' · ' + s.a + ' tuổi') + '</div>' +
      '<p class="epitaph">' + esc(s.o) + '</p>' +
      (s.f ? '<blockquote class="words">“' + esc(s.f) + '”</blockquote>' : '') +
      '<div class="lifemap" id="sharedMap"></div><div class="small muted" style="margin-top:6px">1 ô = 1 năm · đậm hơn = hạnh phúc hơn</div>' +
      (s.st && s.st.length ? '<h3 style="margin:22px 0 4px">⭐ Khoảnh khắc đáng nhớ</h3><ul class="finale-list">' + s.st.map(function (x) { var p = String(x).split('|'); return '<li>' + esc(p[0]) + ' tuổi — ' + esc(p.slice(1).join('|')) + '</li>'; }).join('') + '</ul>' : '') +
      (s.fin ? '<h3 style="margin:22px 0 4px">Khúc cuối</h3><div class="fin-wrap">' + finaleHtml(s.fin) + '</div>' : mems ? '<h3 style="margin:22px 0 4px">Những ký ức đẹp nhất</h3><ul class="finale-list">' + mems + '</ul>' : '') +
      '<div class="go-row" style="margin-top:18px"><button class="btn primary big" id="sharedGo">Sống một đời của riêng bạn</button>' + (own ? '<button class="btn" id="sharedShare">Chia sẻ</button>' : '') + '<button class="btn" id="sharedCard">🖼 Ảnh thẻ cuộc đời</button></div></div>';
    renderMap($('#sharedMap'), null, s.m || '', s.e);
    $('[data-go4]').onclick = function () { location.hash = ''; show('home'); };
    $('#sharedGo').onclick = function () { history.replaceState(null, '', location.pathname); show('home'); };
    if (own) $('#sharedShare').onclick = function () { shareLink(s); };
    $('#sharedCard').onclick = function () { cardImage(s, null, this); };
  }

  // =====================================================================
  // ĐÀI TƯỞNG NIỆM
  // =====================================================================
  function renderMemorial() {
    var mem = LS.get(K.mem, []);
    $('#memAll').innerHTML = mem.length ? mem.slice().reverse().map(function (m) { return memCard(m, mem.indexOf(m)); }).join('') :
      '<p class="muted">Chưa có cuộc đời nào được lưu. Hãy sống trọn một đời và lưu lại ở trang kết thúc.</p>';
  }
  function openMemorial(i) {
    var mem = LS.get(K.mem, []), m = mem[i]; if (!m) return;
    var refl = Object.keys(m.refl || {}).map(function (k) { return '<blockquote>' + k + ' tuổi — ' + esc(m.refl[k]) + '</blockquote>'; }).join('');
    modal('<div class="agep">' + esc(m.years) + ' · ' + esc(m.where) + '</div><h2>' + esc(m.name) + '</h2>' + (m.sub ? '<div class="muted">' + esc(m.sub) + '</div>' : '') +
      '<p class="epitaph" style="font-family:var(--serif)">' + esc(m.summary) + '</p>' +
      (m.words ? '<blockquote class="words">“' + esc(m.words) + '”</blockquote>' : '') +
      (refl ? '<div class="refl-list" style="margin-top:10px">' + refl + '</div>' : '') +
      '<div class="go-row" style="margin-top:16px"><button class="btn primary" id="memClose">Đóng</button><button class="btn ghost" id="memDel">Xóa khỏi đài tưởng niệm</button></div>',
      function (box) {
        $('#memClose', box).onclick = closeModal;
        $('#memDel', box).onclick = function () {
          if (!confirm('Xóa ' + m.name + ' khỏi đài tưởng niệm?')) return;
          mem.splice(i, 1); LS.set(K.mem, mem); closeModal();
          if ($('#memorial').classList.contains('active')) renderMemorial(); else renderHome();
        };
      });
  }
  $('#modalRoot').addEventListener('click', function (e) {
    if (e.target.classList.contains('overlay') && S.phase !== 'decision' && S.phase !== 'reflect' && S.phase !== 'finale' && S.phase !== 'roll') {
      var ex = $('[data-x="stay"]'); if (ex) ex.click(); else closeModal();
    }
  });

  // ---------- khởi động ----------
  function route() {
    var m = /^#s=(.+)$/.exec(location.hash || '');
    if (m) { var s = E.share.decode(m[1]); if (s) { renderShared(s, false); show('shared'); return true; } toast('Đường link chia sẻ không hợp lệ'); }
    return false;
  }
  window.addEventListener('hashchange', route);
  if (!route()) renderHome();
})();

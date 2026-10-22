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
  var K = { settings: 'mkn.settings', cur: 'mkn.current', mem: 'mkn.memorial', theme: 'mkn.theme', last: 'mkn.lastEnd', recent: 'mkn.recent', ach: 'mkn.ach', tree: 'mkn.tree' };

  var DEF = { mode: 'vn', variant: '34', difficulty: 'normal', prov: '', eth: '', name: '', gender: 'random', lifeMin: 30 };
  var S = {
    set: Object.assign({}, DEF, LS.get(K.settings, {})),
    life: null, cohort: null, speed: 1, paused: false, auto: false, skipping: false,
    progress: 0, queue: [], phase: 'idle', yearRunning: false, last: 0, modalTimer: null
  };
  S.set.name = '';
  S.set.difficulty = S.set.difficulty === 'hardcore' ? 'hardcore' : 'normal';
  S.minorOnly = !!S.set.minorOnly;
  if (['random', 'M', 'F'].indexOf(S.set.gender) < 0) S.set.gender = 'random'; // v5.6.2: giới tính sinh học nam / nữ
  var LGBT_SUB = ['top', 'bot', 'les', 'bi'];
  if (['straight', 'lgbt'].concat(LGBT_SUB).indexOf(S.set.orient) < 0) S.set.orient = null; // xu hướng tính dục: không bắt buộc

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
  function sexWord(l) { return l.intersex ? 'Liên giới' : l.sex === 'M' ? 'Nam' : 'Nữ'; }
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
        h = p.kind + (p.kind === 'Thành phố' ? ' trực thuộc trung ương' : '') + ' ' + p.name + '. ' + h;
        h += ' Dân số ~' + U.fmtNum(p.pop / 1000, 1) + ' triệu (tổng số liệu 2023, dùng cho mô phỏng).';
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
    var g = S.set.gender;
    $$('#genderChips .chip').forEach(function (c) { c.classList.toggle('on', c.dataset.g === g); });
    var fam = S.set.orient === 'lgbt' || LGBT_SUB.indexOf(S.set.orient) >= 0;
    $$('#orientChips .chip').forEach(function (c) { c.classList.toggle('on', c.dataset.o === S.set.orient || (c.dataset.o === 'lgbt' && fam)); });
    $('#lgbtSub').classList.toggle('hidden', !fam);
    $$('#lgbtSub .chip').forEach(function (c) { c.classList.toggle('on', c.dataset.o === S.set.orient); });
    $$('#lenChips .chip').forEach(function (c) { c.classList.toggle('on', +c.dataset.len === +S.set.lifeMin); });
    $$('#difficultyChips .chip').forEach(function (c) { var on = c.dataset.difficulty === S.set.difficulty; c.classList.toggle('on', on); c.setAttribute('aria-pressed', String(on)); });
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
    if (E.birthContext) return E.birthContext(l).text;
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
  function profileOpts() { return { mode: S.set.mode, variant: S.set.variant, difficulty: S.set.difficulty, gender: 'random', lifeMin: S.set.lifeMin, seed: U.newSeed() }; }
  function renderProfile() {
    var o = S.preview || (S.preview = profileOpts()), l = E.createLife(o), f = l.fam;
    var where = E.isVN(l) ? l.provLabel + ' · Việt Nam' : l.city + ' · ' + l.countryName;
    var orph = f.orphan && f.orphan.adopted == null ? f.orphan : null; // v7.1: xuất thân mồ côi
    var fam = orph ? 'Mồ côi · ' + orph.carer + ' nuôi dưỡng' : (f.noDad ? '' : 'Bố ' + f.fJob + ' · ') + 'Mẹ ' + f.mJob;
    var inc = f.mInc + f.fInc;
    var teaser = eventTeaser(l);
    var talent = l.talent ? U.cap(E.talentText(l)) + (l.game && l.flags.gamePicked ? ' · ' + l.game : '') : 'Chưa bộc lộ';
    var tags = [E.QUINT[f.q].replace('một trong những ', '').replace('một ', '').replace('gia đình', 'Gia đình'), l.urban ? 'Thành thị' : 'Nông thôn'];
    if (l.eth) tags.push(l.eth); if (l.chosenOrient || l.orient !== 'straight') tags.push('LGBTQ+');
    if (l.difficulty === 'hardcore') tags.push('Hardcore');
    $('#heroProfile').innerHTML = '<div class="eyebrow">MỘT LƯỢT MÔ PHỎNG CÓ THỂ BẮT ĐẦU NHƯ SAU</div><h3>Hồ sơ xuất phát</h3>' +
      '<div class="idhead" style="margin:6px 0 10px">' + E.art.avatar(Object.assign({}, l, { age: 6, school: 'primary', job: null })) + '<div><b style="font-size:17px">' + esc(l.name) + '</b><div class="small muted">' + (l.sex === 'M' ? 'Bé trai' : 'Bé gái') + ' · ' + esc(where) + '</div></div></div>' +
      '<div class="prow"><span>Nơi sinh</span><span>' + esc(where) + '</span></div>' +
      '<div class="prow"><span>Gia đình</span><span>' + esc(U.cap(fam)) + '</span></div>' +
      '<div class="prow"><span>Thu nhập nhà</span><span>' + (orph ? 'Không có bố mẹ chu cấp' : esc(money(l, inc, true)) + '/tháng') + (f.noDad || orph ? '' : '<br><small class="muted">bố ' + esc(money(l, f.fInc)) + ' · mẹ ' + esc(money(l, f.mInc)) + '</small>') + '</span></div>' +
      '<div class="prow"><span>' + esc(E.birthContext ? E.birthContext(l).label : 'Bối cảnh gia đình') + '</span><span>' + esc(teaser) + '</span></div>' +
      '<div class="prow"><span>Năng khiếu</span><span>' + esc(talent) + '</span></div>' +
      '<div class="ptags">' + tags.map(function (t) { return '<span class="ptag">' + esc(U.cap(t)) + '</span>'; }).join('') + '</div>' +
      '<div class="actions"><button class="btn" id="reroll">↻ Xuất phát điểm khác</button><button class="btn gold" id="liveThis">Sống đời này</button></div>';
    $('#reroll').onclick = function () { S.preview = profileOpts(); renderProfile(); };
    $('#liveThis').onclick = function () { bornWith(Object.assign({}, S.preview)); };
  }

  // ---------- Sổ tay nghề nghiệp & mức lương tham chiếu ----------
  var CAT_ORDER = ['state', 'law', 'uniform', 'edu', 'med', 'office', 'sale', 'biz', 'service', 'free', 'show', 'creator', 'media', 'beauty', 'worker', 'poor', 'farm', 'sport', 'esport', 'chess', 'other', 'crime'];
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
          if (c.edu > 0 && c.edu < 99) tags.push('cần ' + E.EDU[Math.min(c.edu, E.EDU.length - 1)]); if (c.edu === 99) tags.push('qua trường công an / quân đội');
          var li = '<li><div class="jt">' + esc(c.t.map(U.cap).join(' → ')) + '</div><div class="jp"><b>' + esc(pay) + '</b>' + (c.fame ? '' : ' triệu/tháng') + (tags.length ? ' <span class="muted small">· ' + esc(tags.join(' · ')) + '</span>' : '') + '</div></li>';
          // v2.9: vận động viên — hiện chi tiết từng môn (danh xưng, thu nhập, tuổi giải nghệ)
          if (c.id === 'vdv' && E.SPORTS) li = '<li><div class="jt">Vận động viên — theo từng môn (' + Object.keys(E.SPORTS).length + ' môn):</div></li>' + Object.keys(E.SPORTS).map(function (k) {
            var S = E.SPORTS[k], lo = c.vn[0] * S.pay[0], hi = c.vn[3] * S.pay[3];
            return '<li class="sub"><div class="jt"><b>' + esc(U.cap(k)) + '</b>: ' + esc(S.t.map(U.cap).join(' → ')) + '</div><div class="jp"><b>' + esc(fmtTr(lo) + ' → ' + fmtTr(hi)) + '</b> triệu/tháng <span class="muted small">· đỉnh cao ~' + S.peak + ' tuổi · giải nghệ ~' + S.max + ' tuổi' + (S.team ? ' · môn đồng đội, có câu lạc bộ' : '') + '</span></div></li>';
          }).join('');
          return li;
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
      $('#dropBtn').onclick = function () { ask('Bỏ cuộc đời đang sống dở?', 'Tiến trình sẽ bị xóa, không thể hoàn tác.', 'Bỏ cuộc đời này', function () { LS.del(K.cur); renderHome(); }); };
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
  $$('#genderChips .chip').forEach(function (c) { c.onclick = function () { S.set.gender = c.dataset.g; if ((c.dataset.g === 'F' && /^(top|bot)$/.test(S.set.orient)) || (c.dataset.g === 'M' && S.set.orient === 'les')) S.set.orient = 'lgbt'; saveSettings(); syncSetupUI(); }; });
  $$('#orientChips .chip').forEach(function (c) { c.onclick = function () { var fam = S.set.orient === 'lgbt' || LGBT_SUB.indexOf(S.set.orient) >= 0; S.set.orient = c.dataset.o === 'lgbt' ? (fam ? null : 'lgbt') : (S.set.orient === c.dataset.o ? null : c.dataset.o); saveSettings(); syncSetupUI(); }; }); // bấm lần nữa để bỏ chọn
  // v5.6.2: tóp mỡ / bột tôm / bé Liên / bi — bấm lần nữa để bỏ chọn; chọn tóp mỡ, bột tôm thì là nam, bé Liên thì là nữ
  $$('#lgbtSub .chip').forEach(function (c) {
    c.onclick = function () { if (c.dataset.held) { delete c.dataset.held; return; } S.set.orient = S.set.orient === c.dataset.o ? 'lgbt' : c.dataset.o; if (/^(top|bot)$/.test(S.set.orient)) S.set.gender = 'M'; else if (S.set.orient === 'les') S.set.gender = 'F'; saveSettings(); syncSetupUI(); };
    // điện thoại: ấn giữ để xem chú thích (Top / Bot / Les / Bisexual)
    var t = null;
    c.addEventListener('touchstart', function () { t = setTimeout(function () { c.classList.add('tipshow'); c.dataset.held = '1'; }, 450); }, { passive: true });
    ['touchend', 'touchcancel', 'touchmove'].forEach(function (ev) { c.addEventListener(ev, function () { clearTimeout(t); setTimeout(function () { c.classList.remove('tipshow'); }, ev === 'touchend' ? 1200 : 0); }, { passive: true }); });
    c.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  });
  $$('#lenChips .chip').forEach(function (c) { c.onclick = function () { S.set.lifeMin = +c.dataset.len; saveSettings(); syncSetupUI(); }; });
  $$('#difficultyChips .chip').forEach(function (c) { c.onclick = function () { S.set.difficulty = c.dataset.difficulty; if (S.preview) S.preview.difficulty = S.set.difficulty; saveSettings(); syncSetupUI(); renderProfile(); }; });
  $$('[data-go]').forEach(function (b) { b.onclick = function () { show(b.dataset.go); }; });
  document.addEventListener('click', function (e) {
    var m = e.target.closest('[data-mem]'); if (m) { openMemorial(+m.dataset.mem); return; }
    var sh = e.target.closest('[data-share]'); if (sh) { var s = LS.get(K.recent, [])[+sh.dataset.share]; if (s) shareLink(s); return; }
    var v = e.target.closest('[data-view], [data-recent]'); if (v) { var s2 = LS.get(K.recent, [])[+(v.dataset.view || v.dataset.recent)]; if (s2) { renderShared(s2, true); show('shared'); } }
  });

  $('#bornBtn').onclick = function () {
    var opts = { mode: S.set.mode, variant: S.set.variant, difficulty: S.set.difficulty, gender: S.set.gender, orient: S.set.orient || null, lifeMin: S.set.lifeMin };
    if (S.set.mode === 'vn') { opts.prov = S.set.prov; opts.eth = S.set.eth; opts.name = ($('#nameInp').value || '').trim(); }
    bornWith(opts);
  };
  function bornWith(opts) {
    var life = E.createLife(opts);
    // v3.4: nhớ những chuyện đã gặp ở 3 đời gần nhất để đời mới ít trùng lặp
    var seen = LS.get('mkn.seen', []); if (Array.isArray(seen) && seen.length) { life.flags.prevSeen = {}; seen.forEach(function (ids) { (ids || []).forEach(function (id) { life.flags.prevSeen[id] = 1; }); }); }
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
    var birthHeritage=E.HOMETOWN&&E.HOMETOWN.own(l);
    var facts = fact('Giới tính', sexWord(l)) +
      (l.chosenOrient ? fact('Xu hướng tính dục', E.orientLabel(l)) : '') +
      fact('Quốc gia', esc(l.countryName)) +
      (vn ? fact(l.variant === '63' ? 'Tỉnh / thành (63)' : 'Tỉnh / thành (34)', esc(l.provLabel) + (l.provNote ? '<div class="small muted">' + esc(l.provNote) + '</div>' : '')) : '') +
      fact('Nơi sinh', esc(l.urban ? (vn ? 'Thành thị · ' : 'Thành phố · ') + l.place : U.cap(l.place))) +
      (birthHeritage ? fact('Dấu ấn quê hương (63 tỉnh/thành cũ)', esc(birthHeritage.places.join(' · '))+'<div class="small muted">'+esc(birthHeritage.foods.join(' · '))+'</div>') : '') +
      (vn ? fact('Dân tộc', esc(l.eth)) : '') +
      fact('Tôn giáo', esc(l.religion)) +
      (E.astroText ? fact('Giờ sinh · cung hoàng đạo', esc(E.astroText(l))) : '') +
      fact('Thu nhập gia đình', qDots(f.q)) +
      (f.orphan && f.orphan.adopted == null ? fact('Bố mẹ', f.orphan.unknown ? 'Không rõ tung tích' : 'Đã mất khi bạn còn đỏ hỏn') + fact('Người nuôi dưỡng', esc(U.cap(f.orphan.carer))) : // v7.1: xuất thân mồ côi
      fact('Tuổi bố mẹ', 'Mẹ ' + f.mAge + (f.noDad ? '' : ' · Bố ' + f.fAge)) +
      fact('Nghề của bố mẹ', 'Mẹ: ' + esc(f.mJob) + (f.noDad ? '' : '<br>Bố: ' + esc(f.fJob))) +
      (E.parentTraitText && f.mTrait ? fact('Tính cách bố mẹ', 'Mẹ: ' + esc(E.parentTraitText(l, 'm')) + (f.noDad ? '' : '<br>Bố: ' + esc(E.parentTraitText(l, 'f')))) : '') + // v7.2
      fact('Thu nhập của mẹ', esc(money(l, f.mInc || 0)) + '/tháng') +
      (f.noDad ? '' : fact('Thu nhập của bố', esc(money(l, f.fInc || 0)) + '/tháng')) +
      fact('Thu nhập cả nhà', '<span style="color:var(--accent-2)">' + esc(money(l, (f.mInc || 0) + (f.fInc || 0), true)) + '/tháng</span>')) +
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
      (l.difficulty === 'hardcore' ? '<p class="notice"><b>HARDCORE · SINH TỒN</b> · Biến cố riêng ngay từ đầu đời. Môi trường lớn lên để lại hệ quả về cảm xúc, stress và việc học. Thu nhập lao động còn 18%, lãi dương còn 12%; cơ hội vươn lên rất khó nhưng vẫn có.</p>' : '') +
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

  function persist() { if (S.life) LS.set(K.cur, { life: S.life, cohort: S.cohort, speed: S.speed, auto: S.auto, at: Date.now() }); }
  // v6.9: cho phần tài khoản biết người chơi đang ở giữa một đời (không ghi đè) và làm mới trang chủ sau khi đồng bộ
  window.G.App = { inLife: function () { var el = document.getElementById('life'); return !!(S.life && S.life.alive && el && el.classList.contains('active')); }, refresh: function () { var h = document.getElementById('home'); if (h && h.classList.contains('active')) renderHome(); } };

  function resumeLife(cur) {
    S.life = migrate(cur.life); S.cohort = cur.cohort || []; S.speed = cur.speed || 1; S.auto = !!cur.auto; S.skipping = false; S.paused = false;
    enterLife();
    toast('Tiếp tục cuộc đời của ' + S.life.name);
  }
  function startLife() { S.paused = false; enterLife(); }

  function enterLife() {
    show('life'); document.body.classList.add('inlife');
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
    var logCount = l.log.length;
    var reflect = E.endYear(l);
    l.log.slice(logCount).forEach(function (e) { addLog(e); });
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
    $('#lbMeta').textContent = (l.birthYear + l.age) + ' · ' + l.name + (l.difficulty === 'hardcore' ? ' · HARDCORE' : '') + ' · 1 năm ≈ ' + Math.round(secPerYear(l) / S.speed) + ' giây';
    $('#pauseBtn').textContent = S.paused ? '▶ Tiếp tục' : '❚❚ Tạm dừng';
    $('#autoBtn').classList.toggle('on', S.auto);
    $('#minorBtn').classList.toggle('on', !!S.minorOnly);
    $('#skipBtn').classList.toggle('toggle', true);
    $('#skipBtn').classList.toggle('on', S.skipping);
  }
  $('#pauseBtn').onclick = function () { S.paused = !S.paused; S.actPause = false; S.last = performance.now(); renderTopbar(); };
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
            S.phase = 'idle'; S.life = null; document.body.classList.remove('inlife'); show('home');
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
    var academic=l.flags.study54;
    if(l.school==='uni'&&l.uniName)return 'Đang học '+l.uniName+' · '+(l.majorName||E.MAJORS[l.major]||'');
    if((l.school==='upper'||l.school==='priv')&&academic&&academic.special)return academic.special.name+' · chuyên '+E.EDUCATION54.subjects[academic.special.subject];
    if (l.school) return 'Đang học ' + E.schoolName(l.school) + (l.major ? ' · ' + (l.majorName || E.MAJORS[l.major]) : '');
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
    $('#idCard').innerHTML = '<h3>Căn cước · ' + esc(E.isVN(l) ? 'Việt Nam' : l.countryName) + (l.difficulty === 'hardcore' ? ' · Hardcore' : '') + '</h3>' +
      '<div class="idhead">' + E.art.avatar(l) + '<div class="nm">' + esc(l.name) + (l.nameSub ? '<small>' + esc(l.nameSub) + '</small>' : '') + '</div></div>' +
      '<dl class="kv"><dt>Giới tính</dt><dd>' + sexWord(l) + (l.orient !== 'straight' && (l.realized || l.chosenOrient) ? ' · ' + E.orientLabel(l) : '') + '</dd>' +
      '<dt>Sinh</dt><dd>' + (l.birthDay ? l.birthDay + '/' : '') + l.birthMonth + '/' + l.birthYear + '</dd>' +
      (l.difficulty === 'hardcore' && E.hardcoreState ? (function () { var h = E.hardcoreState(l); return '<dt>Môi trường lớn lên</dt><dd>' + esc(h.style) + '</dd><dt>Cảm xúc · tổn thương</dt><dd>' + Math.round(h.emotion) + '/100 · ' + Math.round(h.trauma) + '/100</dd>' + (l.age < 18 ? '' : '<dt>Nền tảng phục hồi</dt><dd>Học kỹ năng ' + Math.round(h.training) + ' · chỗ dựa ' + Math.round(h.support) + '/6</dd>'); })() : '') +
      (E.astroText ? '<dt>Giờ sinh · cung</dt><dd>' + esc(E.astroText(l)) + '</dd>' : '') +
      '<dt>Sống tại</dt><dd>' + esc(currentPlace(l)) + '</dd>' +
      (l.eth ? '<dt>Dân tộc</dt><dd>' + esc(l.eth) + '</dd>' : '') +
      '<dt>Tôn giáo</dt><dd>' + esc(l.religion) + '</dd>' +
      (l.allergy ? '<dt>Dị ứng</dt><dd>' + esc(l.allergy) + '</dd>' : '') +
      '<dt>Học vấn</dt><dd>' + esc(eduNow(l)) + '</dd>' +
      '<dt>Công việc</dt><dd>' + esc(job) + '</dd>' +
      (function () { var P = E.promoProgress && E.promoProgress(l); if (!P) return ''; if (P.top) return '<dt>Thăng tiến</dt><dd>Đã ở vị trí cao nhất của nghề</dd>'; return '<dt>Thăng tiến</dt><dd>Lên ' + esc(P.next) + ': ' + P.done + '/' + P.need + ' năm' + (P.chance ? ' · cơ hội mỗi năm ~' + Math.round(P.chance * 100) + '%' : '') + '<div style="height:8px;margin:5px 0 4px;background:var(--surface-2);border-radius:6px;overflow:hidden"><div style="height:100%;width:' + P.pct + '%;background:var(--accent);border-radius:6px"></div></div><span class="small muted">' + esc(P.why.join(' · ')) + '</span></dd>'; })() +
      (l.talent ? '<dt>Năng khiếu</dt><dd>' + esc(E.talentText(l)) + (l.game && l.talent === 'game' && l.flags.gamePicked ? ' · ' + esc(l.game) : '') + (E.talentLevel ? ' · <b>cấp ' + E.talentLevel(l).lv + '</b> ' + esc(E.talentLevel(l).name) : '') + '</dd>' : '') +
      (l.fame >= 1000 ? '<dt>Danh tiếng</dt><dd>' + esc(E.fmtFollowers(l.fame)) + ' người theo dõi</dd>' : '') +
      (l.flags.tvAudience && l.flags.tvAudience.episodes > 0 ? '<dt>Xuất hiện trên game show</dt><dd>' + esc(l.flags.tvAudience.episodes) + ' tập hoàn thành · thu hút ' + esc(E.fmtFollowers(l.flags.tvAudience.followers)) + ' người theo dõi</dd>' : '') +
      (med ? '<dt>Huy chương</dt><dd>' + Object.keys(med).map(function (k) { return med[k] + ' ' + k; }).join(' · ') + '</dd>' : '') +
      (l.titles && l.titles.length ? '<dt>Danh hiệu</dt><dd>' + esc(l.titles[l.titles.length - 1]) + '</dd>' : '') +
      (veh ? '<dt>Phương tiện</dt><dd>' + esc(veh) + '</dd>' : '') +
      (l.record ? '<dt>Tiền án</dt><dd style="color:var(--bad)">' + l.record + ' lần</dd>' : '') +
      (l.ill ? '<dt>Bệnh</dt><dd style="color:var(--bad)">' + esc(l.ill.n) + '</dd>' : '') +
      (!l.alive ? '<dt>Mất</dt><dd>' + esc(l.death.cause) + '</dd>' : '') +
      '</dl><div class="mrz">' + esc(mrz.slice(0, 44)) + '</div>' +
      (E.profile ? '<button class="btn sm profmore" data-prof="1">Xem hồ sơ chi tiết ›</button>' : '');
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
    if (!l.indep) { if (l.money > 0.05) r('Tiền riêng (để dành)', money(l, l.money), '', 'Tiền lì xì, tiền tiêu vặt, tiền làm thêm bạn để dành được'); return rows.length ? '<dl class="statlist wb">' + rows.join('') + '</dl><div class="small muted">Tiền riêng là tiền lì xì, tiền tiêu vặt, tiền làm thêm bạn tự để dành. Các khoản ăn ở, học hành và hoạt động được ghi theo người thực sự chi trả.</div>' : ''; }
    r('Tiền mặt / tài khoản', (l.money < 0 ? '−' : '') + money(l, Math.abs(l.money)), l.money < 0 ? 'neg' : '', 'Tiền tiêu được ngay. Âm nghĩa là đang tiêu lố, phải vay tạm người thân hoặc thấu chi.');
    if (fin > 0.5) r('Tiết kiệm & đầu tư', money(l, fin), '', 'Sổ tiết kiệm, vàng, cổ phiếu, đất — muốn tiêu phải bán / rút');
    if (l.ownHouse && l.houseVal > 0.5) r(U.cap(l.houseName && l.houseName !== 'nhà riêng' ? l.houseName : 'nhà ở'), money(l, l.houseVal), '', 'Giá trị căn nhà đang ở');
    if (E.MARKET && E.MARKET.value(l) > 0) r('Vàng & cổ phiếu theo số lượng', money(l, E.MARKET.value(l)), '', 'Giá bán được theo nguồn và thời điểm trong bảng giao dịch');
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
      (l.mind && l.age >= 12 ? bar('Căng thẳng', l.mind.stress, l.mind.stress >= 70 ? 'var(--bad)' : l.mind.stress >= 50 ? '#d08a3a' : '#6aa58a', Math.round(l.mind.stress) + '/100 · ' + (E.stressLabel ? E.stressLabel(l.mind.stress) : '')) + '<div class="stresslbl">0–29 thư thái · 30–49 bình thường · 50–69 căng thẳng · 70–84 quá tải · 85+ báo động</div>' : '') +
      '<div class="stat"><div class="row"><span>Nhân cách</span><b>' + karmaWord(k) + '</b></div><div class="track karma"><div class="fill" style="left:' + (k < 0 ? 50 + k / 2 : 50) + '%;width:' + Math.abs(k) / 2 + '%;background:' + (k < 0 ? 'var(--bad)' : 'var(--good)') + '"></div></div></div>' +
      '<div style="margin-top:14px" class="small muted">Tài sản ròng <span title="Tất cả những gì bạn có trừ đi tất cả những gì bạn nợ">ⓘ</span></div>' +
      '<div class="money">' + (l.indep ? esc(money(l, nw)) : '—') + '</div>' + wealthBreak(l) +
      (l.indep && l.cur !== 'vnd' ? '<div class="small muted">≈ ' + esc(G.CUR.fmtVND(G.CUR.toVND(E.H.resCode(l) === l.country ? l.gdp : (W.BY[l.abroad.code] || { gdp: l.gdp }).gdp, nw))) + '</div>' : '') +
      '<div class="small muted" style="margin-top:4px">Gia đình gốc: ' + esc(E.QUINT[l.fam.q]) + '</div>';
  }
  function renderFin() {
    var l = S.life, F = l.fin, p = $('#finPanel');
    if (!l.indep || !F) { var familyBill=l.flags.familyVehicleBill,hasParent=l.fam&&(l.fam.mAlive||l.fam.fAlive&&!l.fam.noDad);p.innerHTML = '<h3>Tiền bạc</h3><p class="muted small" style="margin:0">' + (l.age < 18 && hasParent ? 'Chưa tự lập. Các khoản gia đình chi trả được ghi rõ trong nhật ký.' : 'Chưa tự lập về tài chính.') + '</p>'+(familyBill&&familyBill.year>=l.birthYear+l.age-1?'<p class="small muted">Chi phí xe năm '+familyBill.year+': '+esc(money(l,familyBill.total))+'. '+esc(familyBill.note)+'</p>':'')+loansHtml(l); return; }
    var rows = [];
    function row(k, v, cls) { rows.push('<dt>' + esc(k) + '</dt><dd class="' + (cls || '') + '">' + esc(v) + '</dd>'); }
    var Y = l.yr || {};
    if (Y.si > 0) { row('Lương (trước bảo hiểm)', money(l, Y.gross / 12) + '/tháng', 'pos'); row('Đóng ' + (E.siLabel ? E.siLabel(l) : 'bảo hiểm'), '−' + money(l, Y.si / 12) + '/tháng'); row('Lương thực nhận', money(l, F.inc / 12) + '/tháng', 'pos'); }
    else row(l.retired ? (l.pensioned ? 'Lương hưu / con biếu' : 'Trợ cấp / con biếu') : 'Thu nhập của bạn', money(l, F.inc / 12) + '/tháng', 'pos');
    if (F.partner) row((l.partner ? U.cap(E.H.partnerWord(l, l.partner)) : 'Bạn đời') + ' góp', money(l, F.partner / 12) + '/tháng', 'pos');
    row('Ăn uống & sinh hoạt', '−' + money(l, Math.max(0, F.food - (F.pets || 0))));
    if (F.pets) row('Nuôi thú cưng', '−' + money(l, F.pets));
    if (F.rent) row('Thuê nhà', '−' + money(l, F.rent));
    if (F.travel) row('Đi lại / nuôi xe cả năm', '−' + money(l, F.travel));
    if (F.vehicle) {
      [['fuel', l.veh || l.rentVeh ? 'Trong đó: xăng / sạc' : 'Trong đó: vé xe công cộng'], ['maintenance','Trong đó: bảo dưỡng xe'], ['insurance','Trong đó: bảo hiểm xe'], ['parking','Trong đó: gửi xe'], ['road','Trong đó: phí đường bộ'], ['rent','Trong đó: thuê xe']].forEach(function(x){if(F.vehicle[x[0]])row(x[1],money(l,F.vehicle[x[0]]));});
    }
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
      otherIncome(l) +
      (ev ? '<div class="small muted" style="margin-top:10px">Khoản phát sinh</div><ul class="finev">' + ev + '</ul>' : '') +
      loansHtml(l) + assetsHtml(l) +
      '<div class="small muted" style="margin-top:8px">Cách chi tiêu: ' + { save: 'tằn tiện', normal: 'bình thường', lavish: 'thoải mái' }[l.spend] + (E.lifestyleFactor ? ' · mức dịch vụ ×'+E.lifestyleFactor(l) : '') + (l.sendParents && (l.fam.mAlive || l.fam.fAlive) ? ' · có gửi tiền cho bố mẹ' : '') + '</div>';
  }
  // v3.0: các nguồn thu ngoài lương trong năm (kinh doanh, cho thuê, lãi tiền gửi, thưởng…)
  function otherIncome(l) {
    var ps = E.incomeParts ? E.incomeParts(l).filter(function (x) { return !/^(Lương \/|Đóng |Bạn đời|Thu nhập$|Lương hưu|Trợ cấp &)/.test(x.k); }) : [];
    if (!ps.length) return '';
    return '<div class="small muted" style="margin-top:10px">Nguồn thu khác trong năm</div><ul class="finev">' + ps.map(function (x) { return '<li><span>' + esc(x.k) + '</span><b class="' + (x.v >= 0 ? 'pos' : 'neg') + '">' + (x.v >= 0 ? '+' : '−') + esc(money(l, Math.abs(x.v))) + '</b></li>'; }).join('') + '</ul>';
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
    E.FAMILY53.init(l);
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
    if (f.orphan && f.orphan.adopted == null) row((f.orphan.unknown ? 'Bố mẹ ruột: không rõ tung tích' + (f.orphan.found != null ? ' (đã tìm lại được năm ' + f.orphan.found + ' tuổi)' : '') : 'Bố mẹ: đã mất khi bạn còn đỏ hỏn') + ' · người nuôi dưỡng: ' + esc(f.orphan.carer), true); // v7.1
    else row('Mẹ: ' + esc(f.mName) + ' · ' + (f.mAlive ? (f.mAge + a) + ' tuổi' : 'đã mất') + ' · ' + pjob(f.mJob, f.mRet, f.mLost, f.mAlive) + pinc(f.mInc, f.mInc0, f.mRet, f.mAlive) + (f.mAlive && f.mTrait && E.PARENT_TRAITS ? ' · <small class="muted">' + esc(E.PARENT_TRAITS[f.mTrait].n) + '</small>' : '') + (f.mAlive && E.parentWhere ? ' · ' + esc(E.parentWhere(l)) : ''), !f.mAlive);
    if (!f.noDad && !(f.orphan && f.orphan.adopted == null)) row('Bố: ' + esc(f.fName) + ' · ' + (f.fAlive ? (f.fAge + a) + ' tuổi' : 'đã mất') + ' · ' + pjob(f.fJob, f.fRet, f.fLost, f.fAlive) + pinc(f.fInc, f.fInc0, f.fRet, f.fAlive) + (f.fAlive && f.fTrait && E.PARENT_TRAITS ? ' · <small class="muted">' + esc(E.PARENT_TRAITS[f.fTrait].n) + '</small>' : '') + (f.fAlive && E.parentWhere ? ' · ' + esc(E.parentWhere(l)) : ''), !f.fAlive);
    if(E.FAMILY100&&l.flags.family100&&l.flags.family100.parents)['m','f'].forEach(function(side){var q=l.flags.family100.parents[side];if(q&&q.family100&&f[side+'Alive']&&!(side==='f'&&f.noDad))row('Quan hệ với '+(side==='m'?'mẹ':'bố')+': '+esc(E.FAMILY100.summary(l,'parent',side)));});
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
      var partnerHome=E.HOMETOWN&&E.HOMETOWN.partner(l,p);
      var hometown=partnerHome?' · quê '+esc(partnerHome.name)+' <small class="muted">(địa giới cũ)</small>':'';
      if(p.alive!==false&&p.family100&&E.FAMILY100)pj+=' · '+esc(E.FAMILY100.summary(l,'partner',0));
      row(w + ': ' + esc(p.name) + ' · ' + p.age + ' tuổi' + hometown + pj + pi + ' <button class="btn sm family-open" data-family-partner>Hồ sơ</button>');
    } else if (l.widowed) row('Góa bụa');
    l.kids.forEach(function (k) {
      var ka = a - k.born, info = '';
      if (k.alive) {
        if (k.jail && ka < k.jail) info = ' · đang thụ án';
        else if (k.job) info = ' · ' + esc(E.kidTitle(k)) + (k.inc ? ' · ' + esc(money(l, k.inc)) + '/tháng' : '');
        else if (k.uniUntil) info = ' · ' + (k.abroadStudy ? 'du học' : 'sinh viên đại học');
        else if (ka >= 6 && ka <= 17) info = ' · học ' + (k.study >= 70 ? 'giỏi' : k.study >= 45 ? 'khá' : 'yếu');
        if (k.vice) info += ' · <span style="color:var(--bad)">' + esc(k.vice === 'game' ? 'nghiện game' : k.vice) + '</span>';
        if (k.upbringing && k.upbringing.stress >= 65) info += ' · cần được lắng nghe thêm';
        if (ka >= 10 && k.close != null) info += ' · ' + (k.close >= 70 ? '❤ thân thiết' : k.close >= 40 ? 'bình thường' : 'xa cách');
        if(k.family100&&E.FAMILY100)info+=' · '+esc(E.FAMILY100.summary(l,'child',l.kids.indexOf(k)));
        if (E.kidWhere) info += ' · ' + esc(E.kidWhere(l, k)); // v7.5: con đang ở đâu
      }
      row((k.sex === 'M' ? 'Con trai' : 'Con gái') + ': ' + esc(k.name) + ' · ' + (k.alive ? ka + ' tuổi' : 'đã mất') + info + ' <button class="btn sm family-open" data-family-child="' + esc(k.parentId) + '">Hồ sơ</button>', !k.alive);
    });
    if (l.grand) row('Cháu: ' + l.grand + (l.ggrand ? ' · Chắt: ' + l.ggrand : ''));
    if (l.bff) row('Bạn thân: ' + esc(l.bff.name) + (l.bff.alive ? ' · ' + (l.bff.close >= 70 ? 'thân thiết' : l.bff.close >= 40 ? 'vẫn giữ liên lạc' : 'đã xa cách') : ' · đã mất'), !l.bff.alive);
    (l.friends || []).forEach(function (f) { row('Bạn thân: ' + esc(f.name) + (f.from ? ' (quen ở ' + esc(f.from) + ')' : '') + (f.alive === false ? ' · đã mất' : f.lover ? ' · người yêu' : ' · ' + (f.close >= 70 ? 'thân thiết' : f.close >= 40 ? 'vẫn giữ liên lạc' : 'đã xa cách')), f.alive === false); });
    if (l.idol) row('Thần tượng: ' + esc(l.idol));
    (l.pets || []).slice(-4).forEach(function (pt) { row('🐾 ' + esc(U.cap(E.H.petLabel(pt))) + ' ' + esc(pt.n) + ' · ' + (pt.alive ? Math.max(0, a - pt.since) + ' năm bên bạn' : pt.lost ? 'đã thất lạc' : 'đã mất'), !pt.alive); });
    var home = E.whereNow ? E.whereNow(l) : l.age < 18 && !l.indep ? 'Sống cùng bố mẹ trong ' + (l.houseType ? l.houseType + ' ' : '') + '(' + f.home + ')' : (l.ownHouse ? 'Sống trong ' + (l.houseName && l.houseName !== 'nhà riêng' ? l.houseName : 'nhà riêng') : l.urban ? 'Thuê nhà' : 'Sống ở quê');
    if (l.veh === 'ô tô' && l.vehName) home += ' · đi ' + l.vehName;
    $('#famPanel').innerHTML = '<h3>Gia đình & những người thân</h3><ul class="fam">' + li.join('') + '</ul><div class="small muted" style="margin-top:8px">' + esc(home) + '</div>';
    $$('[data-family-child]', $('#famPanel')).forEach(function(b){b.onclick=function(){familyProfile(b.dataset.familyChild);};});
    var partnerButton=$('[data-family-partner]', $('#famPanel'));if(partnerButton)partnerButton.onclick=function(){familyProfile('partner');};
  }
  function familyProfile(id, resumePause) {
    if(S.phase==='decision')minimizeDecision();
    var l=S.life,F=E.FAMILY53,k=id==='partner'?l.partner:F.find(l,id);if(!k)return;
    var was=resumePause==null?S.paused:resumePause;S.paused=true;renderTopbar();
    var child=id!=='partner',a=child?F.age(l,k):k.age,at=l.age,s=child?k.family53:null;
    var model={name:k.name,sex:k.sex,age:a,alive:k.alive!==false,birthYear:l.birthYear+l.age-a,birthMonth:1,pool:l.pool,school:child&&a>=6&&a<18&&k.vice!=='bỏ học'?'school':null};
    if(child&&k.alive===false&&Number.isFinite(k.died))model.age=k.died-k.born;
    var title=child?(k.sex==='M'?'Con trai':'Con gái'):k.status==='dating'?'Người yêu':k.sex==='M'?'Chồng / bạn đời':'Vợ / bạn đời';
    function fact(label,value){return '<li><span>'+esc(label)+'</span><b>'+esc(value)+'</b></li>';}
    var facts=fact('Năm sinh',l.birthYear+l.age-a)+fact('Tình trạng',k.alive===false?'Đã mất'+(Number.isFinite(k.died)?' · '+(k.died-k.born)+' tuổi':''):a+' tuổi')+fact('Gắn kết',Math.round(k.close==null?50:k.close)+'/100');
    if(child){facts+=fact('Học vấn',k.vice==='bỏ học'?'Đã nghỉ học':k.alive===false?'Hồ sơ lưu niệm':F.stage(l,k))+fact('Trường',k.alive!==false&&a>=3&&a<18&&k.vice!=='bỏ học'?F.schools[s.school].name:'—')+fact('Năng khiếu bẩm sinh',model.age<6?'Chưa bộc lộ':F.talents[s.innate]||'Đang khám phá')+fact(k.alive===false?'Hoạt động đã theo':'Đang rèn luyện',F.talents[s.activity]||'Chưa chọn hoạt động');
      if(s.nickname)facts+=fact('Tên gọi ở nhà',s.nickname);
      Object.keys(s.skills).forEach(function(t){facts+=fact(F.talents[t]||t,Math.round(s.skills[t])+'/100');});
      if(k.job)facts+=fact('Công việc',E.kidTitle(k));
    }else{var home=E.HOMETOWN&&E.HOMETOWN.partner(l,k);facts+=fact('Quê quán',home?home.name:'Chưa rõ')+fact('Công việc',a<18&&/sinh viên/.test(k.job||'')?'Chưa đến tuổi đại học':k.job||'Chưa rõ');
      if(E.H.partnerIncKnown&&E.H.partnerIncKnown(l,k))facts+=fact('Thu nhập',money(l,k.inc||0)+'/tháng');
    }
    var controls='',can=child&&F.free(l)&&F.care(l,k);
    if(can&&a<18)controls+='<form id="familyNameForm" class="family-form"><label for="familyName">'+(a<=2?'Đặt tên cho bé':'Tên gọi ở nhà')+'</label><input id="familyName" maxlength="60" value="'+esc(a<=2?k.name:s.nickname||'')+'" autocomplete="off"><button class="btn" type="submit">Lưu tên</button></form>';
    if(can&&F.schoolOK(l,k))controls+='<form id="familySchoolForm" class="family-form"><label for="familySchool">Chọn trường · học phí bổ sung mỗi năm</label><select id="familySchool">'+Object.keys(F.schools).map(function(t){return '<option value="'+t+'"'+(s.school===t?' selected':'')+'>'+esc(F.schools[t].name+' · '+money(l,F.quote(l,'school',t))+'/năm')+'</option>';}).join('')+'</select><button class="btn" type="submit">Chọn trường / đóng học phí</button></form>';
    if(can&&a>=4&&a<18)controls+='<form id="familyTalentForm" class="family-form"><label for="familyTalent">Khám phá và bồi dưỡng năng khiếu</label><select id="familyTalent">'+Object.keys(F.talents).map(function(t){return '<option value="'+t+'"'+((s.activity||s.interest)===t?' selected':'')+'>'+esc(F.talents[t]+(t===s.interest?' · con yêu thích':''))+'</option>';}).join('')+'</select><label for="familyCourse">Cách học</label><select id="familyCourse">'+Object.keys(F.courses).map(function(t){return '<option value="'+t+'"'+(s.course===t?' selected':'')+'>'+esc(F.courses[t].name+' · '+money(l,F.quote(l,'course',t))+'/năm')+'</option>';}).join('')+'</select><button class="btn" type="submit">Đăng ký hoạt động</button></form>';
    if(controls)controls+='<p class="small muted">Các gói học đã đăng ký được đóng lại mỗi năm. Đổi sang gói rẻ hơn không hoàn học phí; thiếu tiền sẽ chuyển sang lựa chọn miễn phí. Trẻ lớn tự quyết con đường của mình.</p>';
    modal('<div class="prof-top">'+E.art.avatar(model)+'<div><div class="eyebrow">THẺ GIA ĐÌNH · '+esc(title)+'</div><h2>'+esc(k.name)+'</h2></div></div><ul class="finev family-facts">'+facts+'</ul>'+controls+'<p id="familyMessage" role="status"></p><button class="btn" id="familyClose">Đóng hồ sơ</button>',function(box){
      function logger(t,kind){var entry={a:l.age,y:l.birthYear+l.age,t:t,k:kind||'good'};l.log.push(entry);addLog(entry);}
      function done(result){persist();renderAll();if(result.ok){familyProfile(id,was);$('#familyMessage').textContent=result.message;}else $('#familyMessage',box).textContent=result.message;}
      var nf=$('#familyNameForm',box);if(nf)nf.onsubmit=function(e){e.preventDefault();done(F.name(l,id,$('#familyName',box).value,at,logger));};
      var sf=$('#familySchoolForm',box);if(sf)sf.onsubmit=function(e){e.preventDefault();done(F.school(l,id,$('#familySchool',box).value,at,logger));};
      var tf=$('#familyTalentForm',box);if(tf)tf.onsubmit=function(e){e.preventDefault();done(F.train(l,id,$('#familyTalent',box).value,$('#familyCourse',box).value,at,logger));};
      $('#familyClose',box).onclick=function(){closeModal();S.paused=was;S.last=performance.now();renderTopbar();};
    },'profile family-profile');
  }

  function openReviews(){
    if(S.life){if(S.phase==='decision')minimizeDecision();S.paused=true;persist();renderTopbar();}
    window.open('reviews.html','_blank','noopener');
  }
  if ($('#legacyBtn')) $('#legacyBtn').onclick = openLegacy;
  // v7.3: bấm "Giới thiệu" mở bảng giới thiệu ngắn gọn về trò chơi
  function openAbout() {
    var nAch = (E.ACHIEVEMENTS || []).length, nJobs = Object.keys(E.CAR || {}).filter(function (k) { return !E.CAR[k].hidden; }).length;
    modal('<button class="about-x" data-close aria-label="Đóng">✕</button><h2 class="about-title">Một Đời</h2>' +
      '<p>Một Đời là trò chơi mô phỏng cuộc sống dành cho cộng đồng. Mỗi nhân vật bắt đầu với một hoàn cảnh khác nhau: quê quán, gia cảnh, tính cách bố mẹ, có khi mồ côi từ thuở lọt lòng. Từ đó bạn tự xây dựng hành trình qua học tập, nghề nghiệp, tình cảm, vận may và những biến cố đời thường.</p>' +
      '<p>Phiên bản ' + esc(G.VERSION) + ' có 195 quốc gia, chế độ Việt Nam với 63 tỉnh/thành lịch sử hoặc 34 tỉnh/thành hiện hành, 54 dân tộc, ' + nJobs + ' nghề có thang bậc và mức lương riêng, cùng muôn vàn chuyện đời: drama gia đình, công sở, hàng xóm, mạng xã hội. Bạn có thể tự chọn hướng đi hoặc bật chế độ tự động; khi nhân vật qua đời, có thể sống tiếp đời con.</p>' +
      '<p>Cuộc đời đang chơi được lưu ngay trong trình duyệt. Tạo <b>tài khoản</b> (chỉ cần tên đăng nhập và mật khẩu, không cần email) để đồng bộ ' + nAch + ' thành tựu, gia phả, đài tưởng niệm và cuộc đời đang chơi giữa các thiết bị. Mật khẩu được mã hóa một chiều, không ai xem lại được, nên bạn nhớ ghi lại nhé.</p>' +
      '<p>Đây là trò chơi mô phỏng hư cấu phục vụ giải trí. Các mức thu nhập, xác suất và kết quả sự kiện không phải dự báo hay dữ liệu thực tế của từng cá nhân. Một phần dữ liệu nhân vật tham khảo bộ Nemotron-Personas-Vietnam (CC BY 4.0, xem mục Nguồn dữ liệu). Một Đời sẽ tiếp tục được cập nhật để mở rộng nội dung và trải nghiệm người chơi.</p>',
      function (box) { $('[data-close]', box).onclick = closeModal; $('.overlay').onclick = function (e) { if (e.target === this) closeModal(); }; }, 'about-modal');
  }
  $$('a[href="#about"]').forEach(function (a) { a.onclick = function (e) { e.preventDefault(); openAbout(); }; });
  $('#reviewsBtn').onclick=openReviews;$('#reviewsLifeBtn').onclick=openReviews;

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
    // v3.6: mục "Chi tiêu" gom mọi việc tiêu tiền + chi tiêu định kỳ tự động mỗi năm
    var SPEND = '💰 Chi tiêu', spendIds = E.SPEND_ACTS || [];
    if (E.recurList && l.age >= 16) groups[SPEND] = spendIds.map(function (id) { return acts.filter(function (x) { return x.id === id; })[0]; }).filter(function (x) { return x && (x.ok === true || !/^(Từ \d+ tuổi|Không áp dụng|Không còn phù hợp)/.test(x.ok)); });
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
      (sel === SPEND ? recurHtml(l) + '<div class="recur-h">Chi tiêu một lần</div>' : '') +
      (sel ? '<div class="chips actlist">' + groups[sel].map(function (x) {
        return '<button class="chip act' + (x.ok === true ? '' : ' off') + '" data-act="' + x.id + '"' + (x.ok === true ? '' : ' title="' + esc(x.ok) + '" disabled') + '>' + esc(x.l) + '</button>';
      }).join('') + '</div>' : '<p class="muted small actnote">Bấm một nhóm để xem các việc có thể làm. Không chọn gì thì đôi khi game sẽ tự quyết thay bạn.</p>');
    $$('[data-ag]', p).forEach(function (b) { b.onclick = function () { S.actG = S.actG === b.dataset.ag ? null : b.dataset.ag; LS.set('mkn.actg', S.actG); if (S.actG && !S.paused && S.phase !== 'dead') { S.paused = true; S.actPause = true; renderTopbar(); toast('Đã tạm dừng để bạn chọn việc — bấm Tiếp tục khi xong'); } else if (!S.actG && S.actPause) { S.actPause = false; S.paused = false; S.last = performance.now(); renderTopbar(); } renderActions(); }; });
    $$('[data-act]', p).forEach(function (b) { b.onclick = function () { doAction(b.dataset.act); }; });
    $$('[data-recur]', p).forEach(function (b) { b.onclick = function () { var on = E.recurToggle(S.life, b.dataset.recur); toast(on ? 'Đã bật — từ năm nay sẽ tự động chi mỗi kỳ' : 'Đã tắt khoản chi định kỳ này'); persist(); renderActions(); }; });
  }
  function recurHtml(l) {
    var L = E.recurList(l);
    return '<div class="recur-h">Chi tiêu định kỳ <span class="muted small">· tự động mỗi kỳ, không tốn lượt; bấm để bật / tắt</span></div><div class="chips recur">' + L.map(function (x) {
      var off = x.ok !== true;
      return '<button class="chip act recur-c' + (x.on ? ' on' : '') + (off && !x.on ? ' off' : '') + '" data-recur="' + x.id + '"' + (off && !x.on ? ' disabled title="' + esc(x.ok) + '"' : '') + '>' + (x.on ? '✓ ' : '') + esc(x.l) + ' <small>' + esc(x.per) + ' · ~' + esc(x.cost) + '</small></button>';
    }).join('') + '</div>';
  }
  function doAction(id) {
    var l = S.life;
    if (!l || !l.alive || S.phase === 'decision' || S.phase === 'reflect' || S.phase === 'dead') return;
    var waiting = S.phase === 'decmin';
    var d = E.act(l, id);
    if (!d) { toast('Chưa thể làm việc này lúc này'); return; }
    if (waiting) { clearDecPill(); toast('Làm xong việc này sẽ quay lại lựa chọn đang chờ'); }
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
    var home=E.HOMETOWN&&E.HOMETOWN.own(l);
    if(home)html+='<h3 style="margin-top:14px">Dấu ấn quê hương · '+esc(home.name)+'</h3>'+dl([['Địa danh',home.places.join(' · ')],['Ẩm thực / sản vật',home.foods.join(' · ')]]);
    html += '<p class="small muted" style="margin:10px 0 0">Số liệu làm tròn (GSO, UN WPP 2024, World Bank) — dùng để mô phỏng.</p>';
    $('#placePanel').innerHTML = html;
  }

  // v3.0: hồ sơ chi tiết — công việc, mức lương, tài sản, sở thích, bằng cấp, chứng chỉ, học vấn, thành tựu
  function lvHtml(t) {
    if (!t || !t.lv) return '';
    return ' · cấp ' + t.lv.lv + ' "' + esc(t.lv.name) + '"<div class="lvbar" title="EXP ' + t.lv.exp + '/100"><i style="width:' + t.lv.exp + '%"></i></div>' +
      '<span class="small muted">EXP ' + t.lv.exp + '/100' + (t.lv.next ? ' tới "' + esc(t.lv.next) + '"' : '') + '</span>';
  }
  function openProfile() {
    var l = S.life; if (!l || !E.profile) return;
    if (S.phase === 'decision') minimizeDecision();
    var P = E.profile(l), wasPaused = S.paused; S.paused = true; renderTopbar();
    function li(k, v, cls) { return '<li><span>' + k + '</span>' + (v != null ? '<b class="' + (cls || '') + '">' + v + '</b>' : '') + '</li>'; }
    function sec(t, body, wide) { return '<div class="prof-sec' + (wide ? ' wide' : '') + '"><h4>' + t + '</h4>' + body + '</div>'; }
    function ul(a) { return a.length ? '<ul>' + a.join('') + '</ul>' : '<p class="muted small" style="margin:0">—</p>'; }
    var job = [li(esc(P.job))].concat(P.jobInfo.map(function (x) { return li('<span class="muted small">' + esc(x) + '</span>'); }));
    if (P.salary) {
      job.push(li('Lương / thu nhập', esc(money(l, P.salary.gross)) + '/tháng', 'pos'));
      if (P.salary.net < P.salary.gross - 1e-6) job.push(li('Thực nhận sau bảo hiểm', esc(money(l, P.salary.net)) + '/tháng'));
    }
    if (P.si) job.push(li('Đã đóng ' + esc(E.siLabel(l)), P.si.yrs + ' năm' + (P.si.yrs < 15 && !l.pensioned ? ' (cần 15 năm để có lương hưu)' : '')));
    if (l.pensionInc) job.push(li('Lương hưu', esc(money(l, l.pensionInc / 12)) + '/tháng' + (l.pensionRate ? ' (' + Math.round(l.pensionRate * 100) + '% lương bình quân)' : ''), 'pos'));
    var inc = P.income.map(function (x) { return li(esc(x.k), (x.v < 0 ? '−' : '+') + esc(money(l, Math.abs(x.v))), x.v < 0 ? 'neg' : 'pos'); });
    var as = P.assets.map(function (x) { return li(esc(x[0]), (x[1] < 0 ? '−' : '') + esc(money(l, Math.abs(x[1]))), x[1] < 0 ? 'neg' : ''); });
    if (l.indep) as.push(li('<b>Tài sản ròng</b>', esc(money(l, P.net)), P.net < 0 ? 'neg' : 'pos'));
    var hob = (P.talent ? [li('Năng khiếu: ' + esc(P.talent.n) + lvHtml(P.talent))] : []).concat(P.hobbies.map(function (h) { return li('Sở thích: ' + esc(h.n) + lvHtml(h)); }));
    if (P.stress) hob.push(li('Mức căng thẳng', P.stress.v + '/100 · ' + esc(P.stress.label), P.stress.v >= 70 ? 'neg' : ''));
    var ed = [li('Trình độ học vấn', esc(P.eduLevel))].concat(P.edu.map(function (x) { return li(esc(x)); }));
    var ct = P.certs.map(function (x) { return li(esc(x)); });
    var ach = P.ach.slice().reverse().map(function (x) { return li(esc(x.t), x.y ? '<span class="yr">' + x.y + (x.a != null ? ' · ' + x.a + ' tuổi' : '') + '</span>' : null); });
    modal('<div class="prof-top">' + E.art.avatar(l) + '<div><div class="agep">Hồ sơ chi tiết · ' + l.age + ' tuổi · năm ' + (l.birthYear + l.age) + '</div>' +
      '<h2 style="margin:2px 0 0">' + esc(l.name) + '</h2><div class="small muted">' + esc(sexWord(l)) + ' · ' + esc(currentPlace(l)) + '</div></div></div>' +
      '<div class="prof-grid">' + sec('Công việc & mức lương', ul(job)) + sec('Thu nhập năm vừa qua', ul(inc)) + sec('Tài sản', ul(as)) + sec('Năng khiếu & sở thích', ul(hob)) +
      sec('Học vấn & bằng cấp', ul(ed)) + sec('Chứng chỉ & bằng lái', ul(ct)) + ((P.workStats && P.workStats.length) || P.medSpec ? sec('Số liệu nghề nghiệp', ul((P.medSpec ? [li('Chuyên khoa: ' + esc(P.medSpec))] : []).concat((P.workStats || []).map(function (x) { return li(esc(x)); })))) : '') + sec('Thành tựu trong đời', ul(ach), true) + '</div>' +
      '<div class="opts" style="margin-top:14px"><button class="opt" data-x="close"><b>Đóng hồ sơ</b></button></div>',
      function (box) {
        $('[data-x="close"]', box).onclick = function () {
          closeModal(); S.paused = wasPaused; S.last = performance.now(); renderTopbar();
          if (S.phase === 'decmin') toast('Lựa chọn đang chờ — bấm "Mở lại" để chọn');
        };
      }, 'profile');
  }
  $('#profBtn').onclick = openProfile;
  // v3.2: điện thoại — nút "⋯" mở các nút phụ, thanh điều hướng dưới cùng cuộn tới từng bảng
  $('#moreBtn').onclick = function () { var bar = $('#life .lifebar'), o = !bar.classList.contains('open'); bar.classList.toggle('open', o); this.setAttribute('aria-expanded', String(o)); this.textContent = o ? '✕' : '⋯'; };
  $$('#mnav [data-to]').forEach(function (b) { b.onclick = function () {
    var to = b.dataset.to; if (to === 'prof') { openProfile(); return; }
    var el = document.getElementById(to); if (!el) return;
    if (to === 'logCard' && $('#logCard').classList.contains('collapsed')) $('#logToggle').click();
    var top = el.getBoundingClientRect().top + window.scrollY - ($('#life .lifebar').offsetHeight + 8);
    window.scrollTo({ top: top, behavior: 'smooth' });
  }; });
  $('#idCard').addEventListener('click', function (ev) { if (ev.target.closest('[data-prof]')) openProfile(); });
  // v3.0: nhật ký thu gọn / mở — không còn phải kéo hết đoạn nhật ký mới xem được hồ sơ
  function setLogCollapsed(c) {
    var card = $('#logCard'), b = $('#logToggle'); if (!card || !b) return;
    card.classList.toggle('collapsed', c); b.textContent = c ? 'Mở ▾' : 'Thu gọn ▴'; b.setAttribute('aria-expanded', String(!c));
  }
  setLogCollapsed(!!LS.get('mkn.logc', false));
  if ($('#logToggle')) $('#logToggle').onclick = function () { var c = !$('#logCard').classList.contains('collapsed'); LS.set('mkn.logc', c); setLogCollapsed(c); };

  // ---------- hộp thoại ----------
  function modal(html, bind, cls) {
    var root = $('#modalRoot');
    root.innerHTML = '<div class="overlay"><div class="card modal ' + (cls || '') + '" role="dialog" aria-modal="true">' + html + '</div></div>';
    if (bind) bind($('.modal', root));
    var f = $('.modal button, .modal textarea', root); if (f) f.focus();
  }
  // v6.3.0: hộp xác nhận riêng của game thay cho confirm() — confirm() bị chặn trong trình duyệt tích hợp (Facebook, Zalo, Messenger…) khiến bấm nút không có tác dụng
  function ask(title, text, yes, onYes, no) {
    modal('<h2>' + esc(title) + '</h2><p>' + esc(text) + '</p><div class="opts"><button class="opt" data-ask="y"><b>' + esc(yes) + '</b></button><button class="opt" data-ask="n"><b>' + esc(no || 'Thôi') + '</b></button></div>', function (box) {
      $$('[data-ask]', box).forEach(function (b) { b.onclick = function () { closeModal(); if (b.dataset.ask === 'y') onYes(); }; });
    });
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
  function marketForm(l, d) {
    if (!E.MARKET || !/^(market_|co_phieu$)/.test(d.id)) return '';
    var html = '<div class="market-controls"><button class="btn sm" id="marketRefresh" type="button">↻ Kiểm tra giá ngoài đời</button><p id="marketStatus" class="small muted" aria-live="polite">Giá thật làm mốc; sau mỗi năm game, giá tăng / giảm ngẫu nhiên.</p>';
    if (d.id === 'market_trade' && d.data.symbol) {
      var q = E.MARKET.quote(l, d.data.symbol), gold = q.kind === 'gold';
      html += '<div class="field"><label for="marketQty">Số lượng ' + esc(q.name) + '</label><input id="marketQty" type="text" inputmode="decimal" maxlength="24" autocomplete="off" value="' + esc(d.data.quantity) + '"></div>' +
        (gold ? '<div class="field"><label for="marketUnit">Đơn vị vàng</label><select id="marketUnit"><option value="base"' + (d.data.unit !== 'luong' ? ' selected' : '') + '>Chỉ</option><option value="luong"' + (d.data.unit === 'luong' ? ' selected' : '') + '>Lượng (10 chỉ)</option></select></div>' : '<p class="small muted">Đơn vị: ' + esc(q.unit) + ' · nhập số nguyên, gồm cả lô lẻ.</p>') +
        '<button class="btn sm" id="marketMax" type="button">' + (d.data.side === 'sell' ? 'Bán tất cả số đang giữ' : 'Điền số lượng tối đa mua được') + '</button><p id="marketTotal" aria-live="polite"></p><p class="small muted">Nguồn: <a href="' + esc(q.url) + '" target="_blank" rel="noopener noreferrer">' + esc(q.source) + '</a></p>';
    }
    return html + '</div>';
  }
  function bindMarket(box, l, d) {
    var refresh = $('#marketRefresh', box); if (!refresh) return;
    var input = $('#marketQty', box), unit = $('#marketUnit', box);
    function current() { return S.life === l && l.pending[0] === d && box.isConnected; }
    function manual() { d.manual = true; if (S.modalTimer) { clearTimeout(S.modalTimer); S.modalTimer = null; } }
    function update() {
      if (!input || !current()) return;
      d.data.quantity = input.value; d.data.unit = unit ? unit.value : 'base';
      $('#marketTotal', box).textContent = E.MARKET.summary(l, d.data);
      $('[data-k="confirm"]', box).disabled = !E.MARKET.evaluate(l, d.data).ok;
    }
    if (input) {
      input.oninput = function () { manual(); update(); persist(); };
      input.onfocus = manual;
      if (unit) unit.onchange = function () { manual(); update(); persist(); };
      $('#marketMax', box).onclick = function () { manual(); input.value = String(E.MARKET.max(l, d.data.symbol, d.data.side) / (unit && unit.value === 'luong' ? 10 : 1)); update(); persist(); };
      update();
    }
    refresh.onclick = async function () {
      manual(); refresh.disabled = true;
      $('#marketStatus', box).textContent = 'Đang kiểm tra giá từ nguồn…';
      var confirm = $('[data-k="confirm"]', box); if (confirm) confirm.disabled = true;
      try {
        var message = await E.MARKET.refresh(l, null, current);
        if (!current()) return;
        var next = E.DEC[d.id].make(l, function () { return U.rand(l); }, d.data); next.manual = true;
        l.pending[0] = next; persist(); renderAll(); showDecision();
        var status = $('#marketStatus'); if (status) status.textContent = message;
      } catch (error) {
        if (!current()) return;
        $('#marketStatus', box).textContent = 'Chưa tải được giá mới; đang dùng bảng giá đã lưu với thời điểm ghi rõ. Bạn có thể thử lại.';
        refresh.disabled = false; update();
      }
    };
    if (d.id !== 'market_trade' && d.manual && (!S.marketChecked || Date.now() - S.marketChecked > 300000)) { S.marketChecked = Date.now(); refresh.click(); }
  }
  function willForm(l,d){
    if(d.id!=='di_chuc'||!E.WILL70)return '';
    var W=E.WILL70,sh=d.data.shares||{},rs=W.recipients?W.recipients(l):[],causes=W.causes||{};
    var custom='<div id="willCustom"'+(d.data.plan==='custom'?'':' hidden')+'><p class="small muted" style="margin:4px 0">Ghi phần trăm cho từng người. Phần còn lại (nếu có) chia theo pháp luật cho các con và bạn đời.</p>'+rs.map(function(x){return '<label style="display:flex;gap:8px;align-items:center;justify-content:space-between"><span>'+esc(x.name)+' <span class="small muted">· '+esc(x.note)+'</span></span><span><input type="number" min="0" max="100" step="1" inputmode="numeric" style="width:72px" data-share="'+esc(x.key)+'" value="'+(+sh[x.key]||0)+'"> %</span></label>';}).join('')+
      '<label for="willOther">Tên người khác (nếu có)</label><input id="willOther" maxlength="60" placeholder="Ví dụ: cô hàng xóm đã chăm sóc bạn" value="'+esc(d.data.otherName||'')+'"><p id="willSum" class="small"></p></div>';
    var cause='<div id="willCauseBox"'+(d.data.plan==='custom'||d.data.plan==='charity'?'':' hidden')+'><label for="willCause">Quỹ / tổ chức xã hội nhận</label><select id="willCause">'+Object.keys(causes).map(function(k){return '<option value="'+k+'"'+(d.data.cause===k?' selected':'')+'>'+esc(causes[k])+'</option>';}).join('')+'</select></div>';
    return '<div class="family-form"><label for="willPlan">Để lại tài sản</label><select id="willPlan">'+W.choices(l).map(function(o){return '<option value="'+o.k+'"'+(d.data.plan===o.k?' selected':'')+'>'+esc(o.l)+'</option>';}).join('')+'</select>'+custom+cause+'<label for="willNote">Lời nhắn của bạn</label><textarea id="willNote" maxlength="1000" rows="6" placeholder="Viết điều bạn muốn gửi lại…">'+esc(d.data.note||'')+'</textarea><p id="willError" role="status"></p></div>';
  }
  function bindWill(box,l,d){
    if(d.id!=='di_chuc'||!E.WILL70)return;
    function draft(){d.data.note=$('#willNote',box).value;d.data.plan=$('#willPlan',box).value;var sh={};$$('[data-share]',box).forEach(function(i){var v=Math.round(+i.value);if(!isFinite(v)||v<0)v=0;if(v>100)v=100;if(v>0)sh[i.dataset.share]=v;});d.data.shares=sh;if($('#willOther',box))d.data.otherName=$('#willOther',box).value;if($('#willCause',box))d.data.cause=$('#willCause',box).value;
      var c=$('#willCustom',box),cb=$('#willCauseBox',box);if(c)c.hidden=d.data.plan!=='custom';if(cb)cb.hidden=!(d.data.plan==='custom'||d.data.plan==='charity');
      var sum=Object.keys(sh).reduce(function(t,k){return t+sh[k];},0),out=$('#willSum',box);if(out){out.textContent='Đã chia '+sum+'% · '+(sum>100?'vượt quá 100%':'còn '+(100-sum)+'% chia theo pháp luật');out.style.color=sum>100?'var(--bad)':'';}persist();}
    $('#willNote',box).oninput=draft;$('#willPlan',box).onchange=draft;$$('[data-share]',box).forEach(function(i){i.oninput=draft;});if($('#willOther',box))$('#willOther',box).oninput=draft;if($('#willCause',box))$('#willCause',box).onchange=draft;draft();
  }
  function showDecision() {
    if (S.modalTimer) { clearTimeout(S.modalTimer); S.modalTimer = null; }
    clearDecPill();
    var l = S.life, d = l.pending[0];
    if (!d) { afterDecisions(); return; }
    if (E.refreshActingWarning) E.refreshActingWarning(l, d);
    S.phase = 'decision';
    var major = E.isMajor(d);
    var aiPick = !d.manual && (S.auto || (S.minorOnly && !major));
    // v3.1: lựa chọn nào tốn tiền mà chưa ghi giá thì ghi luôn chi phí ước tính
    var costs = !aiPick && E.optCosts && d.id !== 'market_trade' ? E.optCosts(l, d) : {};
    modal('<div class="tier ' + (major ? 'major' : 'minor') + '">' + (major ? '⚡ Ngã rẽ quyết định' : 'Lựa chọn thường ngày') + '</div>' +
      '<div class="agep">' + ageStr(l.age) + ' · ' + (l.birthYear + l.age) + '</div><h2>' + esc(d.title) + '</h2><p>' + esc(d.text) + '</p>' +
      (major ? '<p class="tierwarn">Lựa chọn này có thể thay đổi cả cuộc đời ' + esc(l.name) + '. Hãy cân nhắc kỹ.</p>' : '') +
      willForm(l, d) + marketForm(l, d) + '<div class="opts">' + d.opts.map(function (o) { var h = [o.h, costs[o.k]].filter(Boolean).join(' · '); return '<button class="opt" data-k="' + esc(o.k) + '"><b>' + esc(o.l) + '</b>' + (h ? '<span>' + esc(h) + '</span>' : '') + '</button>'; }).join('') + '</div>' +
      (aiPick ? '<div class="autonote">' + (S.auto ? 'Chế độ tự động' : 'Lựa chọn thường ngày') + ': AI đang cân nhắc theo tính cách của ' + esc(l.name) + '… (bấm một lựa chọn để tự quyết)</div>' : '') +
      '<div class="decmin-row"><button class="btn ghost sm" id="decMin" title="Phím Esc">⤓ Thu nhỏ — xem bảng, chỉnh trọng tâm rồi chọn sau</button></div>',
      function (box) {
        $$('[data-k]', box).forEach(function (b) { b.onclick = function () { choose(b.dataset.k, true); }; });
        $('#decMin', box).onclick = minimizeDecision;
        bindMarket(box, l, d);
        bindWill(box,l,d);
        if (aiPick) {
          var k = E.autoKey(l), fast = !S.auto;
          S.modalTimer = setTimeout(function () {
            if (!S.life || S.life.pending[0] !== d || S.phase !== 'decision') return;
            var b = $('[data-k="' + k + '"]', box); if (b) b.classList.add('picked');
            S.modalTimer = setTimeout(function () { if (S.life && S.life.pending[0] === d && S.phase === 'decision') choose(k); }, fast ? 450 : 650);
          }, fast ? 700 : 1100);
        }
      }, (d.tone === 'dark' ? 'dark-tone ' : '') + (major ? 'major' : 'minor'));
  }
  function choose(k, byHand) {
    var trade = S.life && S.life.pending[0];
    if (byHand && k === 'confirm' && trade && trade.id === 'market_trade' && !E.MARKET.evaluate(S.life, trade.data).ok) { toast(E.MARKET.evaluate(S.life, trade.data).message); return; }
    if(byHand&&trade&&trade.id==='di_chuc'&&k==='save'&&E.WILL70){var problem=E.WILL70.check(S.life,trade.data);if(problem){$('#willError').textContent=problem;return;}}
    closeModal();
    var cur = S.life.pending[0], wasManual = cur && cur.manual, rest = S.life.pending.length - 1;
    var pets0 = (S.life.pets || []).length, kids0 = S.life.kids.length;
    var entries = E.resolve(S.life, k);
    if(byHand&&S.life.alive&&S.life.kids.length>kids0){
      E.FAMILY53.init(S.life);var baby=S.life.kids[S.life.kids.length-1],birthAge=S.life.age;persist();
      modal('<div class="eyebrow">Chào đón thành viên mới</div><h2>Đặt tên cho bé</h2><form id="babyNameForm" class="family-form"><label for="babyName">Tên của con</label><input id="babyName" maxlength="60" required value="'+esc(baby.name)+'"><button class="btn gold" type="submit">Chọn tên này</button></form><p id="babyNameStatus" role="status"></p><button class="btn" id="babyNameKeep">Giữ tên hiện tại</button>',function(box){
        function finish(){closeModal();afterChoose(entries,wasManual,rest);}
        $('#babyNameForm',box).onsubmit=function(e){e.preventDefault();var result=E.FAMILY53.name(S.life,baby.parentId,$('#babyName',box).value,birthAge,function(t,kind){var item={a:S.life.age,y:S.life.birthYear+S.life.age,t:t,k:kind};S.life.log.push(item);entries.push(item);});if(result.ok)finish();else $('#babyNameStatus',box).textContent=result.message;};
        $('#babyNameKeep',box).onclick=finish;
      },'profile family-profile');return;
    }
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
    if (!l.flags.seenSaved) { l.flags.seenSaved = true; var seen = LS.get('mkn.seen', []); if (!Array.isArray(seen)) seen = []; seen.push(Object.keys(l.flags.scN || {})); LS.set('mkn.seen', seen.slice(-3)); }
    var stages = E.finale(l), i = 0;
    var sum = E.share.summary(l);
    sum.fin = stages;
    LS.set(K.recent, E.share.pushRecent(LS.get(K.recent, []), sum, 10));
    LS.set(K.last, { life: l, cohort: S.cohort });
    saveLegacy(l);
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
  // v6.6: thành tựu và gia phả lưu trên thiết bị
  function saveLegacy(l) {
    try {
      if (E.achievementsOf) { var got = E.achievementsOf(l), store = LS.get(K.ach, {}); if (!store || typeof store !== 'object' || Array.isArray(store)) store = {}; S.newAch = [];
        got.forEach(function (a) { if (!store[a.id]) { store[a.id] = { at: Date.now(), n: l.name }; S.newAch.push(a.id); } }); LS.set(K.ach, store); S.lifeAch = got; }
      if (E.treeRecord) { var tree = LS.get(K.tree, []); if (!Array.isArray(tree)) tree = []; var rec = E.treeRecord(l); tree = tree.filter(function (x) { return x && x.id !== rec.id; }); tree.push(rec);
        if (rec.pid) tree.forEach(function (x) { if (x.id === rec.pid) x.cont = rec.n; }); if (tree.length > 400) tree = tree.slice(-400); LS.set(K.tree, tree); }
      if (G.Account) G.Account.autoSync();
    } catch (e) { if (window.console) console.error(e); }
  }
  function lineage(id) { var tree = LS.get(K.tree, []); if (!Array.isArray(tree)) return []; var by = {}; tree.forEach(function (x) { if (x && x.id) by[x.id] = x; }); var out = [], cur = by[id], guard = 0; while (cur && guard++ < 50) { out.unshift(cur); cur = cur.pid ? by[cur.pid] : null; } return out; }
  function treeHtml(chain) {
    if (!chain.length) return '';
    return '<div class="tree">' + chain.map(function (x, i) {
      var next = chain[i + 1], kids = (x.k || []).map(function (k) { var on = next ? k.n === next.n : x.cont === k.n; return '<span class="tree-kid' + (on ? ' on' : '') + (k.alive ? '' : ' gone') + '">' + esc(k.n) + (on ? ' ➜' : '') + '</span>'; }).join('');
      return '<div class="tree-node"><div class="tree-gen">Thế hệ ' + (x.gen || i + 1) + '</div><b>' + esc(x.n) + '</b>' + (x.rt ? ' <span class="tree-rt">' + esc(x.rt) + '</span>' : '') + '<div class="small muted">' + esc(x.y + ' · ' + x.a + ' tuổi · ' + x.w) + '</div>' +
        (x.j || x.nw ? '<div class="small">' + esc([x.j ? U.cap(x.j) : '', x.nw ? 'Tài sản cuối đời ' + x.nw : ''].filter(Boolean).join(' · ')) + '</div>' : '') + (x.p ? '<div class="small muted">Bạn đời: ' + esc(x.p) + '</div>' : '') +
        (kids ? '<div class="tree-kids">Các con: ' + kids + '</div>' : '') + '</div>' + (next ? '<div class="tree-link" aria-hidden="true">│</div>' : '');
    }).join('') + '</div>';
  }
  function achHtml(list, fresh) { return '<div class="ach-grid">' + list.map(function (a) { var nw = fresh && fresh.indexOf(a.id) >= 0; return '<div class="ach on" title="' + esc(a.d) + '"><span class="ach-i">' + a.icon + '</span><b>' + esc(a.t) + '</b>' + (nw ? '<em>Mới</em>' : '') + '<small>' + esc(a.d) + '</small></div>'; }).join('') + '</div>'; }
  function openLegacy() {
    var store = LS.get(K.ach, {}) || {}, all = E.ACHIEVEMENTS || [], n = all.filter(function (a) { return store[a.id]; }).length;
    var tree = LS.get(K.tree, []); if (!Array.isArray(tree)) tree = [];
    var ids = {}; tree.forEach(function (x) { if (x && x.pid) ids[x.pid] = 1; });
    var leaves = tree.filter(function (x) { return x && !ids[x.id] && x.pid; }).slice(-8).reverse();
    modal('<div class="agep">Thành tựu & gia phả</div><h2>Đã mở ' + n + ' / ' + all.length + ' thành tựu</h2>' +
      '<div class="ach-grid">' + all.map(function (a) { var g = store[a.id]; return '<div class="ach' + (g ? ' on' : '') + '" title="' + esc(a.d) + '"><span class="ach-i">' + (g ? a.icon : '🔒') + '</span><b>' + esc(a.t) + '</b><small>' + esc(a.d) + (g && g.n ? ' · ' + g.n : '') + '</small></div>'; }).join('') + '</div>' +
      '<h3 style="margin:18px 0 6px">Gia phả các dòng họ bạn đã sống</h3>' + (leaves.length ? leaves.map(function (x) { return treeHtml(lineage(x.id)); }).join('<hr class="tree-sep">') : '<p class="muted small">Chưa có gia đình nhiều thế hệ. Khi một đời khép lại, hãy chọn "Sống tiếp đời con" để viết tiếp gia phả.</p>') +
      '<div class="go-row" style="margin-top:14px"><button class="btn ghost" id="legX">Đóng</button></div>', function (box) { $('#legX', box).onclick = closeModal; }, 'legacy');
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
      (S.lifeAch && S.lifeAch.length ? '<h3 style="margin:22px 0 4px">🏆 Thành tựu của đời này</h3>' + achHtml(S.lifeAch, S.newAch) : '') +
      (function () { var ch = lineage(l.id); return ch.length > 1 ? '<h3 style="margin:22px 0 4px">🌳 Gia phả</h3>' + treeHtml(ch) : ''; })() +
      (refl ? '<h3 style="margin:22px 0 4px">Những quãng lặng</h3><div class="refl-list">' + refl + '</div>' : '') +
      (stars.length ? '<h3 style="margin:22px 0 4px">⭐ Khoảnh khắc bạn đã đánh dấu</h3><ul class="finale-list">' + stars.map(function (e) { return '<li>' + e.a + ' tuổi — ' + esc(e.t) + '</li>'; }).join('') + '</ul>' : '') +
      (kidsLive.length ? '<div class="card pad heir"><div class="eyebrow">Đời người nối tiếp</div><p style="margin:6px 0 10px">' + esc(l.name) + ' để lại ' + (kidsLive.length === 1 ? 'một người con' : kidsLive.length + ' người con') + '. Chọn một người con để sống tiếp: bắt đầu lại từ lúc chào đời trong gia đình do chính bạn gây dựng, hoặc tiếp tục ngay ở tuổi hiện tại của con và nhận phần thừa kế.</p><div class="go-row">' +
        kidsLive.map(function (k, i) { var ka = l.death.age - k.born; return '<button class="btn gold" data-heir="' + i + '">Sống tiếp đời ' + (k.sex === 'M' ? 'con trai' : 'con gái') + ' ' + esc(k.name) + ' (' + ka + ' tuổi)</button>'; }).join('') + '</div></div>' : '') +
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
        var ka = l.death.age - k.born, share = E.heirShare ? E.heirShare(l, k) : 0, P = l.sex === 'M' ? 'bố' : 'mẹ';
        // v8.4.0: ghi rõ nhà, đất, cơ sở kinh doanh người con được sang tên, phần còn lại là tiền mặt
        var mine = E.ESTATE84 ? E.ESTATE84.allocate(l).list.filter(function (x) { return x.kid === l.kids.indexOf(k); })[0] : null;
        var what = mine && mine.items.length ? ' — gồm ' + mine.items.map(function (x) { return x.n + ' (' + money(l, x.v) + ')'; }).join(', ') + (mine.cash > 0.5 ? ' và ' + money(l, mine.cash) + ' tiền mặt' : mine.cash < -0.5 ? '; phải bù ' + money(l, -mine.cash) + ' chênh lệch cho anh chị em' : '') : '';
        var inh = share > 0 ? 'Phần thừa kế của ' + k.name + ': ' + money(l, share) + what + '.' : E.netWorth(l) < 0 ? l.name + ' để lại nợ; theo luật con không phải trả quá phần di sản được hưởng.' : 'Theo di chúc, ' + k.name + ' không nhận phần tài sản nào.';
        modal('<h2>Sống tiếp đời ' + esc(k.name) + '</h2><p>' + esc(inh) + '</p><div class="opts">' +
          (ka > 0 ? '<button class="opt" data-hm="now"><b>Tiếp tục ở tuổi hiện tại (' + ka + ' tuổi) — tiếp quản cơ ngơi</b><span>' + esc('Giữ nguyên nghề nghiệp, học vấn của ' + k.name + ' như hồ sơ đời trước; bắt đầu từ năm ' + P + ' mất và nhận thừa kế.') + '</span></button>' : '') +
          '<button class="opt" data-hm="birth"><b>Từ lúc chào đời</b><span>' + esc('Sinh ra trong gia cảnh lúc ' + l.name + ' ' + k.born + ' tuổi. ' + U.cap(P) + ' sẽ ra đi khi con ' + ka + ' tuổi và để lại đúng phần thừa kế này.') + '</span></button>' +
          '<button class="opt" data-hm="no"><b>Thôi</b></button></div>', function (box) {
            $$('[data-hm]', box).forEach(function (bt) { bt.onclick = function () {
              var mode = bt.dataset.hm; if (mode === 'no') { closeModal(); return; }
              if (mode === 'birth') { closeModal(); try { bornWith(E.childOpts(l, k)); } catch (e) { toast('Chưa bắt đầu được đời con, hãy thử lại'); if (window.console) console.error(e); } return; }
              box.querySelector('.opts').innerHTML = '<p class="muted">Đang dựng lại ' + ka + ' năm cuộc đời của ' + esc(k.name) + '…</p>';
              setTimeout(function () { var life = null; try { life = E.heirAtAge(l, k); } catch (e) { if (window.console) console.error(e); } closeModal();
                if (!life) { toast('Chưa dựng lại được đời con, hãy thử bắt đầu từ lúc chào đời'); return; }
                var seen = LS.get('mkn.seen', []); if (Array.isArray(seen) && seen.length) { life.flags.prevSeen = {}; seen.forEach(function (ids) { (ids || []).forEach(function (id) { life.flags.prevSeen[id] = 1; }); }); }
                S.life = life; S.cohort = E.makeCohort(life); S.speed = 1; S.auto = false; S.skipping = false; S.preview = null; persist(); enterLife(); toast('Tiếp tục cuộc đời của ' + life.name + ' ở tuổi ' + life.age);
              }, 30);
            }; });
          });
      };
    });
    $('#saveMem').onclick = function () {
      l.finalWords = words(); updRecent();
      var mem = LS.get(K.mem, []);
      if (mem.some(function (m) { return m.id === l.id; })) mem = mem.filter(function (m) { return m.id !== l.id; });
      mem.push({ id: l.id, name: l.name, sub: l.nameSub, where: memWhere(l), years: lifeYears(l), age: l.death.age, cause: l.death.cause, summary: E.obituary(l), words: l.finalWords, refl: l.refl, yrs: l.yrs, e0sex: l.e0sex, age2: l.age, savedAt: Date.now(), fin: stages });
      if (mem.length > 60) mem = mem.slice(-60);
      if (LS.set(K.mem, mem)) { toast('Đã lưu vào đài tưởng niệm'); this.disabled = true; this.textContent = 'Đã lưu ✓'; if (G.Account) G.Account.autoSync(); }
      else toast('Không lưu được (bộ nhớ trình duyệt bị chặn hoặc đầy)');
    };
  }

  // ---------- Ảnh thẻ cuộc đời (xem trước rồi tải / chia sẻ) ----------
  function cardImage(sum, avatarSvg, btn, fmt) {
    if (!G.LifeCard) { toast('Trình duyệt không hỗ trợ tạo ảnh'); return; }
    var old = btn ? btn.textContent : ''; if (btn) { btn.disabled = true; btn.textContent = 'Đang vẽ ảnh…'; }
    G.LifeCard.draw(sum, avatarSvg, fmt).then(function (cv) {
      if (btn) { btn.disabled = false; btn.textContent = old; }
      modal('<div class="agep">Ảnh thẻ cuộc đời</div><h2>' + esc(sum.n) + '</h2><img class="cardprev" alt="Ảnh thẻ cuộc đời của ' + esc(sum.n) + '" src="' + cv.toDataURL('image/png') + '">' +
        '<p class="small muted">' + (fmt === 'story' ? 'Ảnh dọc 1080×1920, hợp để đăng TikTok, Story Facebook / Instagram, Zalo.' : 'Ảnh 1080×1350, hợp để đăng bài Facebook, Instagram, Zalo.') + '</p>' +
        '<div class="go-row"><button class="btn ' + (fmt === 'story' ? '' : 'gold') + ' sm" id="cardFeed">Khổ 4:5 (bài đăng)</button><button class="btn ' + (fmt === 'story' ? 'gold' : '') + ' sm" id="cardStory">Khổ dọc 9:16 (TikTok, Story)</button></div>' +
        '<div class="go-row"><button class="btn primary" id="cardDl">Tải ảnh về</button>' + (navigator.share ? '<button class="btn" id="cardSh">Chia sẻ ảnh</button>' : '') + '<button class="btn ghost" id="cardX">Đóng</button></div>',
        function (box) {
          $('#cardFeed', box).onclick = function () { if (fmt === 'story') cardImage(sum, avatarSvg, null, 'feed'); };
          $('#cardStory', box).onclick = function () { if (fmt !== 'story') cardImage(sum, avatarSvg, null, 'story'); };
          $('#cardDl', box).onclick = function () { G.LifeCard.download(sum, avatarSvg, fmt).then(function () { toast('Đã tải ảnh về máy'); }); };
          if ($('#cardSh', box)) $('#cardSh', box).onclick = function () { G.LifeCard.share(sum, avatarSvg, fmt); };
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
          ask('Xóa khỏi đài tưởng niệm?', 'Xóa ' + m.name + ' khỏi đài tưởng niệm?', 'Xóa', function () {
            mem.splice(i, 1); LS.set(K.mem, mem);
            if ($('#memorial').classList.contains('active')) renderMemorial(); else renderHome();
          });
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

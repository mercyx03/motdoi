/* Một Đời — ảnh "thẻ cuộc đời" 1080×1350 để đăng Facebook/TikTok/Zalo: chân dung pixel, các mốc chính, văn bia,
   bản đồ đời người theo mức hạnh phúc và những khoảnh khắc đáng nhớ. Vẽ bằng canvas, không gửi dữ liệu đi đâu. */
(function () {
  'use strict';
  var W = 1080, H = 1350;
  var C = { bg1: '#0a1520', bg2: '#13283b', gold: '#d9b26a', gold2: '#f0cf8e', text: '#f3ede2', muted: '#9fb0c2', line: 'rgba(217,178,106,.35)', tile: 'rgba(255,255,255,.05)' };
  var FD = '"Playfair Display", Lora, "Noto Serif", "Times New Roman", serif', FB = '"Be Vietnam Pro", system-ui, sans-serif', FL = 'Lora, "Noto Serif", "Times New Roman", serif';

  function wrap(ctx, text, maxW, maxLines) {
    var words = String(text || '').split(/\s+/), lines = [], cur = '';
    words.forEach(function (w) { var t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; });
    if (cur) lines.push(cur);
    if (maxLines && lines.length > maxLines) { lines = lines.slice(0, maxLines); var last = lines[maxLines - 1]; while (ctx.measureText(last + '…').width > maxW && last.length) last = last.slice(0, -1); lines[maxLines - 1] = last.replace(/[\s,.;:]+$/, '') + '…'; }
    return lines;
  }
  function round(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function img(svg) {
    return new Promise(function (ok) {
      if (!svg) return ok(null);
      var im = new Image(); im.onload = function () { ok(im); }; im.onerror = function () { ok(null); };
      im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
  }
  function fit(ctx, text, font, size, maxW, min) { var s = size; do { ctx.font = font.replace('%', s); s -= 2; } while (ctx.measureText(text).width > maxW && s > min); }

  // sum: tóm tắt cuộc đời (E.share.summary) · avatarSvg: chân dung pixel (tùy chọn)
  function draw(sum, avatarSvg) {
    var cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    var ctx = cv.getContext('2d');
    // font web chỉ tải phần ký tự tiếng Việt khi được dùng — tải trước đúng đoạn chữ sẽ vẽ để không vỡ dấu
    var all = [sum.n, sum.y, sum.w, sum.c, sum.o, sum.jt, sum.nw, (sum.st || []).join(' '), (sum.mem || []).join(' '), 'MỘT ĐỜI KHOẢNH KHẮC ĐÁNG NHỚ tuổi người con tài sản cuối đời nghề chính kỳ vọng Mất ở vì'].join(' ');
    var loads = document.fonts && document.fonts.load ? ['italic 500 29px Lora', '800 76px "Playfair Display"', '700 40px "Playfair Display"', '500 26px "Be Vietnam Pro"', '700 26px "Be Vietnam Pro"', '600 20px "Be Vietnam Pro"'].map(function (f) { return document.fonts.load(f, all).catch(function () { }); }) : [];
    var ready = Promise.all(loads).then(function () { return document.fonts && document.fonts.ready; });
    return ready.then(function () { return img(avatarSvg); }).then(function (av) {
      var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, C.bg1); g.addColorStop(1, C.bg2);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // khung viền vàng
      ctx.strokeStyle = C.line; ctx.lineWidth = 2; round(ctx, 36, 36, W - 72, H - 72, 28); ctx.stroke();
      // đầu thẻ
      ctx.fillStyle = C.gold; ctx.font = '700 26px ' + FB; ctx.textAlign = 'center';
      ctx.fillText('M Ộ T   Đ Ờ I', W / 2, 100);
      // mặt trời trên đường chân trời (logo)
      ctx.strokeStyle = C.gold; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(W / 2, 150, 34, Math.PI, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W / 2 - 60, 150); ctx.lineTo(W / 2 + 60, 150); ctx.stroke();
      ctx.fillStyle = C.gold2; ctx.beginPath(); ctx.arc(W / 2 + 22, 126, 7, 0, Math.PI * 2); ctx.fill();
      var y = 180;
      if (av) {
        var s = 160; ctx.fillStyle = 'rgba(255,255,255,.06)'; round(ctx, W / 2 - s / 2 - 12, y, s + 24, s + 24, 20); ctx.fill();
        ctx.imageSmoothingEnabled = true; ctx.drawImage(av, W / 2 - s / 2, y + 12, s, s); y += s + 50;
      } else y += 30;
      // tên
      ctx.fillStyle = C.text; fit(ctx, sum.n, '800 %px ' + FD, 76, W - 160, 40); ctx.fillText(sum.n, W / 2, y + 40); y += 70;
      ctx.fillStyle = C.muted; ctx.font = '500 30px ' + FB;
      fit(ctx, sum.y + ' · ' + sum.w, '500 %px ' + FB, 30, W - 160, 20); ctx.fillText(sum.y + ' · ' + sum.w, W / 2, y + 20); y += 50;
      if (sum.c) { ctx.font = '500 26px ' + FB; ctx.fillStyle = C.muted; var cl = 'Mất ở tuổi ' + sum.a + ' vì ' + sum.c; fit(ctx, cl, '500 %px ' + FB, 26, W - 160, 18); ctx.fillText(cl, W / 2, y + 14); y += 44; }
      // văn bia
      ctx.fillStyle = C.gold2; ctx.font = 'italic 500 32px ' + FL;
      ctx.font = 'italic 500 29px ' + FL; wrap(ctx, sum.o, W - 200, 3).forEach(function (ln) { ctx.fillText(ln, W / 2, y + 28); y += 40; });
      y += 24;
      // các ô số liệu
      var tiles = [[String(sum.a), 'tuổi' + (sum.e ? ' (kỳ vọng ' + String(sum.e).replace('.', ',') + ')' : '')], [sum.jt || '—', 'nghề chính'], [String(sum.kd || 0), 'người con'], [sum.nw || '—', 'tài sản cuối đời']];
      var tw = (W - 160 - 3 * 20) / 4;
      tiles.forEach(function (t, i) {
        var x = 80 + i * (tw + 20);
        ctx.fillStyle = C.tile; round(ctx, x, y, tw, 120, 16); ctx.fill();
        ctx.fillStyle = C.gold;
        ctx.font = '700 40px ' + FD;
        if (ctx.measureText(t[0]).width > tw - 24) { // tên nghề dài: xuống hai dòng
          ctx.font = '700 22px ' + FD; var tl = wrap(ctx, t[0], tw - 20, 2);
          tl.forEach(function (ln, j) { ctx.fillText(ln, x + tw / 2, y + (tl.length > 1 ? 40 + j * 26 : 58)); });
        } else ctx.fillText(t[0], x + tw / 2, y + 58);
        ctx.fillStyle = C.muted; fit(ctx, t[1], '500 %px ' + FB, 20, tw - 20, 14); ctx.fillText(t[1], x + tw / 2, y + 94);
      });
      y += 150;
      // bản đồ đời người: mỗi ô một năm, đậm = hạnh phúc
      var m = String(sum.m || ''), per = 25, cs = 28, gap = 5, rows = Math.max(1, Math.ceil(m.length / per));
      var gx = (W - (per * cs + (per - 1) * gap)) / 2;
      ctx.textAlign = 'left'; ctx.fillStyle = C.muted; ctx.font = '600 20px ' + FB; ctx.fillText('MỖI Ô LÀ MỘT NĂM — ĐẬM HƠN LÀ HẠNH PHÚC HƠN', gx, y); y += 16;
      for (var i = 0; i < m.length; i++) {
        var r = Math.floor(i / per), c = i % per, h = +m[i];
        ctx.fillStyle = 'rgba(217,178,106,' + (0.12 + h / 9 * 0.88).toFixed(2) + ')';
        round(ctx, gx + c * (cs + gap), y + r * (cs + gap), cs, cs, 6); ctx.fill();
      }
      y += rows * (cs + gap) + 30;
      // khoảnh khắc đáng nhớ (ưu tiên những dòng người chơi đánh dấu ⭐)
      var moments = (sum.st && sum.st.length ? sum.st : sum.mem || []).slice(0, 3);
      if (moments.length && y < H - 230) {
        ctx.fillStyle = C.gold; ctx.font = '700 22px ' + FB; ctx.fillText((sum.st && sum.st.length ? '⭐ ' : '') + 'KHOẢNH KHẮC ĐÁNG NHỚ', gx, y); y += 40;
        moments.forEach(function (x) {
          var p = String(x).split('|'), age = p.length > 1 ? p[0] + ' tuổi — ' : '', t = p.length > 1 ? p.slice(1).join('|') : p[0];
          ctx.font = '500 25px ' + FB; ctx.fillStyle = C.text;
          wrap(ctx, age + t, W - 2 * gx, 2).forEach(function (ln) { if (y < H - 115) { ctx.fillText(ln, gx, y); y += 34; } });
          y += 8;
        });
      }
      // chân thẻ
      ctx.textAlign = 'center'; ctx.fillStyle = C.muted; ctx.font = '500 22px ' + FB;
      var host = (typeof location !== 'undefined' && location.host && !/^localhost|127\./.test(location.host)) ? location.host : 'Một Đời';
      ctx.fillText(host + ' · Bạn sẽ sống một đời như thế nào?', W / 2, H - 70);
      return cv;
    });
  }
  function fileName(sum) { return 'mot-doi-' + String(sum.n || 'cuoc-doi').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() + '.png'; }
  function toBlob(cv) { return new Promise(function (ok) { cv.toBlob(function (b) { ok(b); }, 'image/png'); }); }
  function download(sum, avatarSvg) {
    return draw(sum, avatarSvg).then(toBlob).then(function (b) {
      var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = fileName(sum);
      document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
      return true;
    });
  }
  // chia sẻ trực tiếp ảnh (điện thoại); không hỗ trợ thì tải về
  function share(sum, avatarSvg) {
    return draw(sum, avatarSvg).then(toBlob).then(function (b) {
      var f = typeof File !== 'undefined' ? new File([b], fileName(sum), { type: 'image/png' }) : null;
      if (f && navigator.canShare && navigator.canShare({ files: [f] })) return navigator.share({ files: [f], title: 'Một Đời — ' + sum.n }).then(function () { return true; }, function () { return false; });
      return download(sum, avatarSvg);
    });
  }
  window.G = window.G || {}; window.G.LifeCard = { draw: draw, download: download, share: share, fileName: fileName };
})();

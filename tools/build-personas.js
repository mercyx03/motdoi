/* Một Đời — tổng hợp dữ liệu từ Nemotron-Personas-Vietnam (NVIDIA & FPT, CC BY 4.0) (v6.7.0)
   Lấy mẫu đều trên toàn bộ 1.000.000 persona qua API công khai của Hugging Face (datasets-server),
   đếm tần suất nghề nghiệp, sở thích, món ăn, lễ hội theo 6 vùng kinh tế – xã hội và thành thị / nông thôn,
   rồi ghi ra public/js/data-personas-vn.js (chỉ số liệu tổng hợp, không chép nguyên văn persona).
   Chạy: node tools/build-personas.js [số trang 100 dòng, mặc định 80] */
'use strict';
const fs = require('fs'), path = require('path');
const DS = 'nvidia/Nemotron-Personas-Vietnam', API = 'https://datasets-server.huggingface.co';
const PAGES = +process.argv[2] || 80, TOTAL = 1000000;
const REG = { 'Đồng bằng sông Hồng': 'DBSH', 'Trung du và miền núi phía Bắc': 'MNPB', 'Bắc Trung Bộ và Duyên hải miền Trung': 'BTB', 'Tây Nguyên': 'TN', 'Đông Nam Bộ': 'DNB', 'Đồng bằng sông Cửu Long': 'DBSCL' };
// từ điển món ăn và lễ hội để đếm trong phần mô tả ẩm thực / văn hóa (chỉ giữ tên, không giữ câu chữ)
const DISHES = ['phở', 'bún chả', 'bún riêu', 'bún ốc', 'bún bò Huế', 'bún bò', 'bún đậu mắm tôm', 'bún thịt nướng', 'bún cá', 'bún mắm', 'bún nước lèo', 'bánh cuốn', 'bánh mì', 'bánh xèo', 'bánh khọt', 'bánh canh', 'bánh bèo', 'bánh nậm', 'bánh lọc', 'bánh căn', 'bánh tráng', 'bánh chưng', 'bánh tét', 'bánh giầy', 'bánh đa cua', 'bánh ướt', 'bánh hỏi', 'bánh pía', 'bánh cống', 'bánh tằm', 'bánh bột lọc',
  'cơm tấm', 'cơm gà', 'cơm lam', 'cơm niêu', 'cơm hến', 'xôi', 'xôi ngũ sắc', 'cháo lòng', 'cháo vịt', 'hủ tiếu', 'mì Quảng', 'cao lầu', 'chả cá', 'chả giò', 'nem rán', 'nem chua', 'nem nướng', 'gỏi cuốn', 'gỏi cá', 'canh chua', 'cá kho tộ', 'cá kho', 'thịt kho', 'thịt kho tàu', 'lẩu mắm', 'lẩu cá linh', 'lẩu thắng cố', 'thắng cố', 'thịt trâu gác bếp', 'lợn cắp nách', 'gà đồi', 'cá suối', 'măng rừng', 'rau rừng', 'canh cua', 'cà pháo', 'dưa cải', 'chè', 'chè đậu', 'cà phê', 'trà', 'rượu cần', 'rượu ngô', 'mắm', 'mắm tôm', 'mắm cá linh', 'mắm ruốc', 'nước mắm', 'hải sản', 'cua đồng', 'ốc', 'lươn', 'ếch', 'vịt', 'bò kho', 'bò bía', 'bột chiên', 'hủ tiếu Nam Vang', 'bánh căn', 'gà nướng', 'heo quay', 'cháo', 'bún', 'bánh'];
const FESTS = ['Tết Nguyên Đán', 'Tết Trung Thu', 'Giỗ Tổ Hùng Vương', 'Rằm tháng Giêng', 'Thanh Minh', 'Vu Lan', 'Tết Đoan Ngọ', 'Ông Công Ông Táo', 'Quốc khánh', 'Ngày Thống nhất', 'Chol Chnam Thmay', 'Chôl Chnăm Thmây', 'Ok Om Bok', 'Sene Dolta', 'Katê', 'Lồng tồng', 'Gầu tào', 'cồng chiêng', 'lễ hội đền', 'hội làng', 'lễ hội chùa', 'Nghinh Ông', 'cầu ngư', 'Bà Chúa Xứ', 'đua ghe ngo', 'quan họ', 'chèo', 'cải lương', 'đờn ca tài tử', 'bài chòi', 'hát Xoan', 'ca trù', 'Then', 'xòe', 'hò', 'lễ cúng cơm mới', 'mừng lúa mới', 'đâm trâu', 'Tết Hàn thực', 'Tết Thanh minh', 'Lễ Phục Sinh', 'Giáng sinh', 'Phật đản'];
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function page(offset) {
  for (let t = 0; t < 4; t++) {
    try { const r = await fetch(API + '/rows?dataset=' + encodeURIComponent(DS) + '&config=default&split=train&offset=' + offset + '&length=100', { signal: AbortSignal.timeout(60000) }); if (r.ok) return (await r.json()).rows.map(x => x.row); }
    catch (e) { }
    await sleep(1500 * (t + 1));
  }
  return [];
}
function inc(o, k, n) { o[k] = (o[k] || 0) + (n || 1); }
function top(o, n, min) { return Object.keys(o).filter(k => o[k] >= (min || 1)).sort((a, b) => o[b] - o[a]).slice(0, n).map(k => [k, o[k]]); }
function band(a) { return a < 30 ? 'y' : a < 45 ? 'm' : a < 60 ? 'o' : 's'; }
function list(s) { try { const v = JSON.parse(s); return Array.isArray(v) ? v.map(x => String(x).trim()).filter(Boolean) : []; } catch (e) { return []; } }
function norm(h) { return h.replace(/\s+/g, ' ').replace(/^./, c => c.toUpperCase()); }
(async () => {
  const agg = {}; let n = 0;
  for (let i = 0; i < PAGES; i++) {
    const off = Math.min(TOTAL - 100, Math.floor(i * TOTAL / PAGES) + (i * 7919) % 2000);
    const rows = await page(off);
    rows.forEach(x => {
      const R = REG[x.region]; if (!R) return; n++;
      const z = /Đô Thị/i.test(x.zone) ? 'u' : 'r', key = R + '_' + z, a = agg[key] || (agg[key] = { n: 0, job: {}, hob: {}, dish: {}, fest: {}, hobAge: { y: {}, m: {}, o: {}, s: {} } });
      a.n++; inc(a.job, x.occupation);
      list(x.hobbies_and_interests_list).forEach(h => { h = norm(h); if (h.length > 40) return; inc(a.hob, h); inc(a.hobAge[band(x.age)], h); });
      const food = String(x.culinary_persona || '').toLowerCase(); DISHES.forEach(d => { if (food.includes(d.toLowerCase())) inc(a.dish, d); });
      const cul = String(x.cultural_background || '') + ' ' + String(x.arts_persona || ''); FESTS.forEach(f => { if (cul.toLowerCase().includes(f.toLowerCase())) inc(a.fest, f); });
    });
    process.stdout.write('\rĐã lấy ' + (i + 1) + '/' + PAGES + ' trang · ' + n + ' persona');
    await sleep(250);
  }
  console.log();
  const out = { source: 'Nemotron-Personas-Vietnam (NVIDIA & FPT, CC BY 4.0) — huggingface.co/datasets/' + DS, sampled: n, builtAt: new Date().toISOString().slice(0, 10), regions: {} };
  Object.keys(agg).sort().forEach(k => {
    const a = agg[k];
    // bỏ món chung chung khi đã có món cụ thể
    ['bún', 'bánh', 'cháo', 'mắm'].forEach(g => { delete a.dish[g]; });
    out.regions[k] = { n: a.n, job: top(a.job, 40, 2), hob: top(a.hob, 50, 2), dish: top(a.dish, 30, 2), fest: top(a.fest, 25, 2), hobAge: { y: top(a.hobAge.y, 20, 2), m: top(a.hobAge.m, 20, 2), o: top(a.hobAge.o, 20, 2), s: top(a.hobAge.s, 20, 2) } };
  });
  const js = '/* Dữ liệu được chọn lọc, chuyển đổi và điều chỉnh từ Nemotron-Personas-Vietnam (NVIDIA Corporation cùng FPT Smart Cloud và Viện Quantum AI & Cyber Security, FPT Corporation), giấy phép CC BY 4.0: https://creativecommons.org/licenses/by/4.0/\n   NVIDIA và các đơn vị phát triển dữ liệu không tài trợ, bảo trợ hoặc xác nhận trò chơi Một Đời.\n   Số liệu tổng hợp từ ' + out.source + '\n   Lấy mẫu ' + n + ' persona (' + out.builtAt + '), tạo bằng tools/build-personas.js. Chỉ gồm tần suất, không chép nội dung persona. */\n' +
    '(function (G) { G.PERSONAS_VN = ' + JSON.stringify(out) + '; })(typeof window !== \'undefined\' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));\n';
  fs.writeFileSync(path.join(__dirname, '..', 'public', 'js', 'data-personas-vn.js'), js);
  console.log('Đã ghi public/js/data-personas-vn.js (' + (js.length / 1024).toFixed(0) + ' KB, ' + Object.keys(out.regions).length + ' nhóm vùng)');
})().catch(e => { console.error(e); process.exit(1); });

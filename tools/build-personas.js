/* Một Đời — tổng hợp dữ liệu từ Nemotron-Personas-Vietnam (NVIDIA & FPT, CC BY 4.0) (v6.7.0)
   Lấy mẫu đều trên toàn bộ 1.000.000 persona (mặc định 500 trang × 100 = 50.000 persona; có bộ nhớ đệm .cache/personas) qua API công khai của Hugging Face (datasets-server),
   đếm tần suất nghề nghiệp, sở thích, món ăn, lễ hội theo 6 vùng kinh tế – xã hội và thành thị / nông thôn,
   rồi ghi ra public/js/data-personas-vn.js (chỉ số liệu tổng hợp, không chép nguyên văn persona).
   Chạy: node tools/build-personas.js [số trang 100 dòng, mặc định 80] */
'use strict';
const fs = require('fs'), path = require('path');
const DS = 'nvidia/Nemotron-Personas-Vietnam', API = 'https://datasets-server.huggingface.co';
const PAGES = +process.argv[2] || 500, TOTAL = 1000000;
const REG = { 'Đồng bằng sông Hồng': 'DBSH', 'Trung du và miền núi phía Bắc': 'MNPB', 'Bắc Trung Bộ và Duyên hải miền Trung': 'BTB', 'Tây Nguyên': 'TN', 'Đông Nam Bộ': 'DNB', 'Đồng bằng sông Cửu Long': 'DBSCL' };
// từ điển món ăn và lễ hội để đếm trong phần mô tả ẩm thực / văn hóa (chỉ giữ tên, không giữ câu chữ)
const DISHES = ['phở', 'bún chả', 'bún riêu', 'bún ốc', 'bún bò Huế', 'bún bò', 'bún đậu mắm tôm', 'bún thịt nướng', 'bún cá', 'bún mắm', 'bún nước lèo', 'bánh cuốn', 'bánh mì', 'bánh xèo', 'bánh khọt', 'bánh canh', 'bánh bèo', 'bánh nậm', 'bánh lọc', 'bánh căn', 'bánh tráng', 'bánh chưng', 'bánh tét', 'bánh giầy', 'bánh đa cua', 'bánh ướt', 'bánh hỏi', 'bánh pía', 'bánh cống', 'bánh tằm', 'bánh bột lọc',
  'cơm tấm', 'cơm gà', 'cơm lam', 'cơm niêu', 'cơm hến', 'xôi', 'xôi ngũ sắc', 'cháo lòng', 'cháo vịt', 'hủ tiếu', 'mì Quảng', 'cao lầu', 'chả cá', 'chả giò', 'nem rán', 'nem chua', 'nem nướng', 'gỏi cuốn', 'gỏi cá', 'canh chua', 'cá kho tộ', 'cá kho', 'thịt kho', 'thịt kho tàu', 'lẩu mắm', 'lẩu cá linh', 'lẩu thắng cố', 'thắng cố', 'thịt trâu gác bếp', 'lợn cắp nách', 'gà đồi', 'cá suối', 'măng rừng', 'rau rừng', 'canh cua', 'cà pháo', 'dưa cải', 'chè', 'chè đậu', 'cà phê', 'trà', 'rượu cần', 'rượu ngô', 'mắm', 'mắm tôm', 'mắm cá linh', 'mắm ruốc', 'nước mắm', 'hải sản', 'cua đồng', 'ốc', 'lươn', 'ếch', 'vịt', 'bò kho', 'bò bía', 'bột chiên', 'hủ tiếu Nam Vang', 'bánh căn', 'gà nướng', 'heo quay', 'cháo', 'bún', 'bánh'];
const FESTS = ['Tết Nguyên Đán', 'Tết Trung Thu', 'Giỗ Tổ Hùng Vương', 'Rằm tháng Giêng', 'Thanh Minh', 'Vu Lan', 'Tết Đoan Ngọ', 'Ông Công Ông Táo', 'Quốc khánh', 'Ngày Thống nhất', 'Chol Chnam Thmay', 'Chôl Chnăm Thmây', 'Ok Om Bok', 'Sene Dolta', 'Katê', 'Lồng tồng', 'Gầu tào', 'cồng chiêng', 'lễ hội đền', 'hội làng', 'lễ hội chùa', 'Nghinh Ông', 'cầu ngư', 'Bà Chúa Xứ', 'đua ghe ngo', 'quan họ', 'chèo', 'cải lương', 'đờn ca tài tử', 'bài chòi', 'hát Xoan', 'ca trù', 'Then', 'xòe', 'hò', 'lễ cúng cơm mới', 'mừng lúa mới', 'đâm trâu', 'Tết Hàn thực', 'Tết Thanh minh', 'Lễ Phục Sinh', 'Giáng sinh', 'Phật đản'];
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function page(offset) {
  for (let t = 0; t < 8; t++) {
    try { const r = await fetch(API + '/rows?dataset=' + encodeURIComponent(DS) + '&config=default&split=train&offset=' + offset + '&length=100', { signal: AbortSignal.timeout(60000) }); if (r.ok) return (await r.json()).rows.map(x => x.row); if (r.status === 429) { await sleep(30000 * (t + 1)); continue; } }
    catch (e) { }
    await sleep(3000 * (t + 1));
  }
  return [];
}
function inc(o, k, n) { o[k] = (o[k] || 0) + (n || 1); }
function top(o, n, min) { return Object.keys(o).filter(k => o[k] >= (min || 1)).sort((a, b) => o[b] - o[a]).slice(0, n).map(k => [k, o[k]]); }
function band(a) { return a < 30 ? 'y' : a < 45 ? 'm' : a < 60 ? 'o' : 's'; }
function list(s) { try { const v = JSON.parse(s); return Array.isArray(v) ? v.map(x => String(x).trim()).filter(Boolean) : []; } catch (e) { return []; } }
function norm(h) { return h.replace(/\s+/g, ' ').replace(/^./, c => c.toUpperCase()); }
// v6.8: thêm thể thao, du lịch, nghệ thuật, kỹ năng theo nghề, mục tiêu nghề nghiệp, học vấn & hôn nhân theo tuổi
const SPORTS = [['bóng đá', /bóng đá|đá bóng|đá banh/], ['cầu lông', /cầu lông/], ['bóng chuyền hơi', /bóng chuyền hơi/], ['bóng chuyền', /bóng chuyền(?! hơi)/], ['bóng bàn', /bóng bàn/], ['pickleball', /pickleball/], ['tennis', /tennis|quần vợt/], ['chạy bộ', /chạy bộ|marathon/], ['đi bộ', /đi bộ/], ['đạp xe', /đạp xe/], ['bơi lội', /bơi/], ['yoga', /yoga/], ['tập gym', /\bgym\b|thể hình/], ['dưỡng sinh', /dưỡng sinh/], ['thái cực quyền', /thái cực quyền/], ['võ thuật', /võ thuật|vovinam|karate|taekwondo|võ cổ truyền/], ['bi-a', /bi-a|bida/], ['cờ tướng', /cờ tướng/], ['đá cầu', /đá cầu/], ['cầu mây', /cầu mây/], ['golf', /golf/], ['leo núi', /leo núi|trekking/], ['nhảy dân vũ', /dân vũ|khiêu vũ|aerobic|zumba/], ['bóng rổ', /bóng rổ/], ['câu cá', /câu cá/], ['đua thuyền', /đua thuyền|đua ghe/]];
const PLACES = ['Hạ Long', 'Sa Pa', 'Hà Giang', 'Ninh Bình', 'Tràng An', 'Tam Cốc', 'Mộc Châu', 'Mai Châu', 'Cát Bà', 'Sầm Sơn', 'Cửa Lò', 'Phong Nha', 'Huế', 'Đà Nẵng', 'Hội An', 'Lý Sơn', 'Quy Nhơn', 'Nha Trang', 'Đà Lạt', 'Buôn Ma Thuột', 'Pleiku', 'Măng Đen', 'Phan Thiết', 'Mũi Né', 'Vũng Tàu', 'Côn Đảo', 'Phú Quốc', 'Cần Thơ', 'Châu Đốc', 'Bến Tre', 'Cà Mau', 'Tây Ninh', 'Cao Bằng', 'Bản Giốc', 'Ba Bể', 'Lạng Sơn', 'Tam Đảo', 'Chùa Hương', 'Yên Tử', 'Đền Hùng', 'Hà Nội', 'Sài Gòn', 'Thái Lan', 'Singapore', 'Hàn Quốc', 'Nhật Bản', 'Trung Quốc', 'Đài Loan', 'Malaysia', 'Campuchia', 'châu Âu', 'Úc', 'Bali'];
const ARTS = [['chèo', /\bchèo\b/], ['tuồng', /\btuồng\b/], ['cải lương', /cải lương/], ['quan họ', /quan họ/], ['ca trù', /ca trù/], ['đờn ca tài tử', /đờn ca tài tử/], ['bài chòi', /bài chòi/], ['hát xoan', /hát xoan/], ['ví giặm', /ví giặm|ví dặm/], ['hò', /\bhò\b/], ['múa rối nước', /múa rối/], ['nhạc Trịnh', /nhạc trịnh/], ['bolero', /bolero|nhạc vàng/], ['nhạc cách mạng', /nhạc cách mạng|nhạc đỏ/], ['V-pop', /v-pop|nhạc trẻ/], ['K-pop', /k-pop/], ['rap', /\brap\b|hip hop|hiphop/], ['nhạc cổ điển', /nhạc cổ điển/], ['đàn guitar', /guitar|ghi-ta/], ['đàn piano', /piano/], ['đàn tranh', /đàn tranh/], ['đàn bầu', /đàn bầu/], ['sáo trúc', /sáo trúc|thổi sáo/], ['vẽ tranh', /vẽ tranh|hội họa|màu nước|sơn dầu/], ['thư pháp', /thư pháp/], ['nhiếp ảnh', /nhiếp ảnh|chụp ảnh/], ['phim Hàn Quốc', /phim hàn/], ['kịch nói', /kịch nói|sân khấu kịch/], ['đọc thơ', /\bthơ\b/], ['karaoke', /karaoke/], ['cồng chiêng', /cồng chiêng/], ['khèn', /\bkhèn\b/], ['đan len, thêu thùa', /thêu|đan len|móc len/], ['làm gốm', /làm gốm|nặn gốm/]];
const GOALS = [['mở cửa hàng, cơ sở riêng', /mở (một |thêm )?(cửa hàng|quán|tiệm|xưởng|cơ sở|doanh nghiệp|công ty|tiệm)/], ['thăng tiến lên vị trí quản lý', /thăng (chức|tiến)|vị trí quản lý|trưởng (phòng|nhóm|bộ phận)/], ['nâng cao tay nghề, học thêm', /nâng cao (tay nghề|trình độ|kỹ năng|chuyên môn)|học thêm|chứng chỉ/], ['ổn định thu nhập cho gia đình', /ổn định (thu nhập|công việc|cuộc sống)/], ['lo cho con ăn học đến nơi đến chốn', /cho (các )?con (ăn học|học|đi học)|con cái (ăn học|học hành)/], ['có nhà riêng', /mua nhà|xây nhà|căn hộ riêng|nhà riêng/], ['nghỉ hưu an nhàn, giữ sức khỏe', /nghỉ hưu|an nhàn|tuổi già/], ['mở rộng việc làm ăn, bán hàng online', /mở rộng|kinh doanh online|bán hàng online|thương hiệu riêng/], ['đi làm việc hoặc học ở nước ngoài', /nước ngoài|xuất khẩu lao động|du học/], ['truyền nghề cho thế hệ sau', /truyền (nghề|lại kinh nghiệm|kinh nghiệm)|thế hệ (sau|trẻ)/], ['làm nông nghiệp sạch, hữu cơ', /hữu cơ|nông nghiệp sạch|vietgap|nông nghiệp công nghệ cao/], ['tìm được công việc ổn định', /tìm (được |kiếm )?(việc làm|công việc)/], ['có khoản tiết kiệm dự phòng', /tiết kiệm|dự phòng/]];
function hits(text, dict) { const t = String(text || '').toLowerCase(); return dict.filter(d => d[1].test(t)).map(d => d[0]); }
function placeHits(text) { const t = String(text || ''); return PLACES.filter(p => t.includes(p)); }
async function pool(n, conc, fn) { let i = 0; const run = async () => { while (i < n) { const k = i++; await fn(k); } }; await Promise.all(Array.from({ length: conc }, run)); }
(async () => {
  const agg = {}, skills = {}, goalsJob = {}, edu = {}, mar = {}, CACHE = path.join(__dirname, '..', '.cache', 'personas'); let n = 0, done = 0;
  fs.mkdirSync(CACHE, { recursive: true });
  function add(x) {
    const R = REG[x.region]; if (!R) return; n++;
    const z = /Đô Thị/i.test(x.zone) ? 'u' : 'r', key = R + '_' + z, b = band(x.age);
    const a = agg[key] || (agg[key] = { n: 0, job: {}, hob: {}, dish: {}, fest: {}, sport: {}, place: {}, art: {}, goal: {}, hobAge: { y: {}, m: {}, o: {}, s: {} }, sportAge: { y: {}, m: {}, o: {}, s: {} }, jobAge: { y: {}, m: {}, o: {}, s: {} } });
    a.n++; inc(a.job, x.occupation); inc(a.jobAge[b], x.occupation);
    list(x.hobbies_and_interests_list).forEach(h => { h = norm(h); if (h.length > 40) return; inc(a.hob, h); inc(a.hobAge[b], h); });
    const food = String(x.culinary_persona || '').toLowerCase(); DISHES.forEach(d => { if (food.includes(d.toLowerCase())) inc(a.dish, d); });
    const cul = String(x.cultural_background || '') + ' ' + String(x.arts_persona || ''); FESTS.forEach(f => { if (cul.toLowerCase().includes(f.toLowerCase())) inc(a.fest, f); });
    hits(x.sports_persona, SPORTS).forEach(s => { inc(a.sport, s); inc(a.sportAge[b], s); });
    placeHits(x.travel_persona).forEach(p => inc(a.place, p));
    hits(String(x.arts_persona || '') + ' ' + String(x.hobbies_and_interests || ''), ARTS).forEach(s => inc(a.art, s));
    const gl = hits(x.career_goals_and_ambitions, GOALS); gl.forEach(g => { inc(a.goal, g); const o = goalsJob[x.occupation] || (goalsJob[x.occupation] = {}); inc(o, g); });
    const sk = skills[x.occupation] || (skills[x.occupation] = {}); list(x.skills_and_expertise_list).forEach(s => { s = norm(s); if (s.length <= 45) inc(sk, s); });
    const ek = R + '_' + b, ed = edu[ek] || (edu[ek] = {}); inc(ed, x.education_level);
    const mk = z + '_' + b, mr = mar[mk] || (mar[mk] = {}); inc(mr, x.marital_status);
  }
  // ưu tiên dữ liệu đọc từ file parquet (tools/personas-from-parquet.py); không có thì lấy mẫu qua API
  const local = fs.existsSync(CACHE) ? fs.readdirSync(CACHE).filter(f => /^rows-.*\.jsonl$/.test(f)) : [];
  if (local.length) { for (const f of local) { const lines = fs.readFileSync(path.join(CACHE, f), 'utf8').split('\n'); for (const ln of lines) if (ln.trim()) add(JSON.parse(ln)); console.log('Đọc ' + f + ' · ' + n + ' persona'); } }
  else await pool(PAGES, +process.env.CONC || 1, async i => {
    const file = path.join(CACHE, 'p' + i + '.json'); let rows;
    if (fs.existsSync(file)) rows = JSON.parse(fs.readFileSync(file, 'utf8'));
    else { const off = Math.min(TOTAL - 100, Math.floor(i * TOTAL / PAGES) + (i * 7919) % Math.max(1, Math.floor(TOTAL / PAGES) - 100)); rows = await page(off); if (rows.length) fs.writeFileSync(file, JSON.stringify(rows)); await sleep(+process.env.DELAY || 2500); }
    rows.forEach(add); done++;
    if (done % 10 === 0 || done === PAGES) process.stdout.write('Đã lấy ' + done + '/' + PAGES + ' trang · ' + n + ' persona\n');
  });
  const out = { source: 'Nemotron-Personas-Vietnam (NVIDIA & FPT, CC BY 4.0) — huggingface.co/datasets/' + DS, sampled: n, builtAt: new Date().toISOString().slice(0, 10), regions: {}, skills: {}, goalsByJob: {}, edu: {}, marital: {} };
  Object.keys(agg).sort().forEach(k => {
    const a = agg[k]; ['bún', 'bánh', 'cháo', 'mắm'].forEach(g => { delete a.dish[g]; });
    const ages = o => ({ y: top(o.y, 20, 2), m: top(o.m, 20, 2), o: top(o.o, 20, 2), s: top(o.s, 20, 2) });
    out.regions[k] = { n: a.n, job: top(a.job, 60, 2), hob: top(a.hob, 60, 2), dish: top(a.dish, 35, 2), fest: top(a.fest, 25, 2), sport: top(a.sport, 25, 2), place: top(a.place, 35, 2), art: top(a.art, 30, 2), goal: top(a.goal, 13, 2), hobAge: ages(a.hobAge), sportAge: ages(a.sportAge), jobAge: { y: top(a.jobAge.y, 30, 2), m: top(a.jobAge.m, 30, 2), o: top(a.jobAge.o, 30, 2), s: top(a.jobAge.s, 30, 2) } };
  });
  Object.keys(skills).sort().forEach(j => { const t = top(skills[j], 6, 2); if (t.length) out.skills[j] = t.map(x => x[0]); });
  Object.keys(goalsJob).sort().forEach(j => { const t = top(goalsJob[j], 3, 3); if (t.length) out.goalsByJob[j] = t.map(x => x[0]); });
  Object.keys(edu).sort().forEach(k => { out.edu[k] = edu[k]; }); Object.keys(mar).sort().forEach(k => { out.marital[k] = mar[k]; });
  const js = '/* Dữ liệu được chọn lọc, chuyển đổi và điều chỉnh từ Nemotron-Personas-Vietnam (NVIDIA Corporation cùng FPT Smart Cloud và Viện Quantum AI & Cyber Security, FPT Corporation), giấy phép CC BY 4.0: https://creativecommons.org/licenses/by/4.0/\n   NVIDIA và các đơn vị phát triển dữ liệu không tài trợ, bảo trợ hoặc xác nhận trò chơi Một Đời.\n   Số liệu tổng hợp từ ' + out.source + '\n   Lấy mẫu ' + n + ' persona (' + out.builtAt + '), tạo bằng tools/build-personas.js. Chỉ gồm tần suất, không chép nội dung persona. */\n' +
    '(function (G) { G.PERSONAS_VN = ' + JSON.stringify(out) + '; })(typeof window !== \'undefined\' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));\n';
  fs.writeFileSync(path.join(__dirname, '..', 'public', 'js', 'data-personas-vn.js'), js);
  console.log('Đã ghi public/js/data-personas-vn.js (' + (js.length / 1024).toFixed(0) + ' KB, ' + Object.keys(out.regions).length + ' nhóm vùng)');
})().catch(e => { console.error(e); process.exit(1); });

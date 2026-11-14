'use strict';
// 9.0: nâng độ sâu học tại nhà British Columbia và Queensland (study-home890.js) trên study-home857/education863-data.
const assert=require('node:assert/strict');
const {E}=require('./hardcore-isolation').gameContext(),S=E.STUDY857;
let n=0;const ok=(c,m)=>{assert.ok(c,m);n++;},copy=x=>JSON.parse(JSON.stringify(x)),noop=()=>{};
function pupil(country,region,age=12){const l=E.createLife({mode:'world',country,seed:890,year:2026-age});Object.assign(l,{country,age,educationRegion:region,school:age<11?'primary':age<16?'lower':'upper',schoolEnd:18,money:100000,pending:[],sched:[]});delete l.flags.educationVersion863;l.st.kno=80;l.st.hea=80;return l;}
const bc=S.RULES['CA:BC'],qld=S.RULES['AU:QLD'];
ok(bc.depth890&&qld.depth890&&/gov\.bc\.ca/.test(bc.source)&&/qed\.qld\.gov\.au/.test(qld.source),'hai vùng có nguồn đã đọc');
ok(bc.checkedAt==='2026-11-14'&&qld.checkedAt==='2026-11-14','ngày đối chiếu');
ok(/30\/9/.test(bc.withdrawal)&&/không cần giáo viên/.test(bc.teacher)&&/Dogwood/.test(bc.credentialNote),'BC: hạn 30/9, người dạy, văn bằng');
ok(/\$250/.test(bc.aidNote)&&bc.aid===null,'BC: tài trợ trả cho trường, game không chi tiền mặt');
ok(qld.ages[0]===6&&qld.ages[1]===16&&/28 ngày/.test(qld.assessment)&&/2–3 tháng/.test(qld.assessment),'Queensland: tuổi, báo cáo thường niên, đổi địa chỉ');
ok(qld.aid===null&&/chưa xác minh/.test(qld.aidNote),'Queensland: không gán số tiền chưa xác minh');
// tương thích bản lưu: mã báo cáo và lộ trình cũ còn nguyên
ok(bc.reports.includes('đăng ký năm')&&qld.reports.includes('annual report'),'giữ mã báo cáo cũ');
ok(bc.routes[0].id==='family'&&qld.routes[0].id==='family','giữ mã lộ trình cũ');
// quy tắc nơi cư trú: đúng vùng được áp, vùng khác không bị ảnh hưởng
{const a=S.rule(pupil('CA','BC')),b=S.rule(pupil('AU','QLD')),c=S.rule(pupil('CA','AB')),d=S.rule(pupil('AU','NSW'));
 ok(a.key==='CA:BC'&&a.depth890,'BC được áp');ok(b.key==='AU:QLD'&&b.depth890,'QLD được áp');ok(c.key==='CA:AB'&&!c.depth890&&d.key==='AU:NSW'&&!d.depth890,'vùng khác không đổi');}
// trước mốc snapshot không áp quy tắc
{const l=pupil('AU','QLD',12);l.birthYear=1950;ok(S.rule(l).mode==='unknown','năm trước 2026 giữ unknown');}
// luồng thật: Queensland dưới 6 tuổi không mở, đủ tuổi mở và nộp đơn
{const l=pupil('AU','QLD',5);ok(!S.request(l,'family'),'dưới tuổi tối thiểu không mở hồ sơ');
 const m=pupil('AU','QLD',12);ok(S.request(m,'family','nhịp học'),'12 tuổi mở được hồ sơ');const s=S.home(m);s.documents=s.plan=s.consulted=s.credential=true;ok(S.submit(m),'nộp hồ sơ');
 ok(typeof S.report(m)==='string'&&S.report(m).includes('AU:QLD'),'báo cáo hiển thị mã vùng');}
{const l=pupil('CA','BC',12);ok(S.request(l,'independent','nhịp học')&&S.home(l).route==='independent','BC: chọn lộ trình trường tư/trực tuyến');
 const s=S.home(l);s.documents=s.plan=s.consulted=s.credential=true;ok(S.submit(l),'nộp hồ sơ BC');
 const l2=pupil('CA','BC',12);ok(S.request(l2,'family','nhịp học'),'BC: lộ trình cũ "family" còn dùng được');}
// bản lưu: hồ sơ giữ qua JSON
{const l=pupil('CA','BC',12);S.request(l,'family','x');const o=JSON.parse(JSON.stringify(l));ok(S.home(o)&&S.home(o).key==='CA:BC','hồ sơ giữ qua bản lưu');}
// 76 vùng vẫn đủ, khóa unknown không bị phá
{let have=0,tot=0;for(const c of Object.keys(S.REGIONS))for(const r of S.REGIONS[c]){tot++;if(S.RULES[c+':'+r.id])have++;}ok(tot===76&&have===76,'76/76 vùng có quy tắc');}
{const l=pupil('VN','unknown');l.city='Unknown town';ok(!S.request(l,'family'),'Việt Nam vẫn không có lộ trình giả');}
console.log('PASS study-home890: '+n+' checks');

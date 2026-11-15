/* 9.4.5: khởi nghiệp theo vốn. Mở rộng cơ sở kinh doanh có sẵn (E.wealth.BIZ, l.ventures, wealth.investYear), vay (H.addLoan), công ty (BUSINESS123/128/133), không dựng sổ sách riêng.
   Quy trình nhiều giai đoạn: chọn mô hình theo vốn → chọn cách huy động vốn (tự có, vay người thân, vay ngân hàng, hoặc chuẩn bị thêm) → khai trương →
   đánh giá cuối năm thứ nhất, thứ hai → sự kiện kinh doanh hằng năm (giải tỏa vỉa hè, kiểm tra vệ sinh, đối thủ, hàng tồn…) → đóng cửa, bán, mở rộng.
   Mọi số liệu (vốn, doanh thu, chi phí, rủi ro) là tham số trò chơi ở mức hợp lý, không phải dự báo tài chính. Không gán tính cách hay khả năng theo giàu nghèo, tôn giáo hay ngoại hình. */
(function(G){'use strict';var E=G.E,H=E.H,U=G.U,X=E.UPDATE110,W=E.wealth;if(!E||!H||!X||!W||!W.BIZ)return;
var GROUP='Tiền bạc';
// Đơn vị: triệu đồng ở Việt Nam, quy theo mức sống ở nước khác (W.bizV). rev: doanh thu mỗi tháng khi đã ổn định; vc: giá vốn / doanh thu; mg: lãi ròng / doanh thu khi ổn định (đã gồm công sức của chủ);
// ramp: tỷ lệ khách năm 1, năm 2; hz: xác suất đóng cửa mỗi năm ngoài thua lỗ; labor 'full': chủ đứng quầy cả ngày.
var TIERS={micro:{n:'Vốn nhỏ',max:100},small:{n:'Vốn vừa',max:600},mid:{n:'Vốn lớn',max:6000}};
var EXP={food:/dau_bep|phuc_vu|barista|bartender|chu_quan_an|chu_nha_hang/,retail:/sale_|thu_ngan|kd_tap_hoa|kd_online|telesale|tiem_dt|tiem_vang/,service:/tho_|giup_viec|nail|spa|barber|makeup|tho_toc|giat/,online:/kd_online|fl_|marketing|dev|shipper|sale_|telesale/,craft:/tho_|cong_nhan|ky_thuat|nong|ky_su/};
var CAT=[
 {k:'banh_mi',n:'xe bánh mì / ăn sáng',tier:'micro',fam:'food',cap:18,rev:33,vc:.55,mg:.22,sd:.15,ramp:[.74,.95],hz:.04,labor:'full',food:1,renew:.04,cost:'nguyên liệu, gas, thuê chỗ bán, dậy từ 4 giờ sáng',street:1},
 {k:'vien_chien',n:'xe cá viên chiên',tier:'micro',fam:'food',cap:22,rev:42,vc:.56,mg:.18,sd:.22,ramp:[.72,.95],hz:.06,labor:'full',food:1,renew:.04,cost:'cá viên, dầu ăn, gas, nước chấm, thuê chỗ đứng',street:1},
 {k:'tra_sua',n:'quầy trà sữa mang đi',tier:'micro',fam:'food',cap:55,rev:60,vc:.38,mg:.13,sd:.24,ramp:[.7,.94],hz:.07,labor:'full',food:1,renew:.045,cost:'nguyên liệu, ly và nắp, thuê quầy, điện nước',street:1},
 {k:'shop_online',n:'shop thời trang online',tier:'micro',fam:'online',cap:25,rev:36,vc:.66,mg:.1,sd:.35,ramp:[.55,.85],hz:.09,labor:'part',renew:.05,cost:'nhập hàng, chụp ảnh, quảng cáo, phí sàn, đóng gói và vận chuyển'},
 {k:'quan_ao_cho',n:'sạp quần áo ở chợ',tier:'micro',fam:'retail',cap:60,rev:52,vc:.68,mg:.09,sd:.22,ramp:[.7,.93],hz:.05,labor:'full',renew:.04,cost:'hàng nhập, thuê sạp, hàng tồn mùa trái vụ'},
 {k:'tap_hoa',n:'tiệm tạp hóa',tier:'small',fam:'retail',cap:180,rev:100,vc:.86,mg:.07,sd:.1,ramp:[.82,.96],hz:.03,labor:'part',renew:.03,cost:'nhập hàng, thuê nhà, điện, hao hụt'},
 {k:'giat_ui',n:'tiệm giặt ủi',tier:'small',fam:'service',cap:220,rev:45,vc:.2,mg:.22,sd:.12,ramp:[.7,.92],hz:.03,labor:'part',renew:.04,cost:'máy giặt, máy sấy, xà phòng, điện nước, thuê mặt bằng'},
 {k:'nail',n:'tiệm nail / làm tóc',tier:'small',fam:'service',cap:200,rev:55,vc:.22,mg:.17,sd:.2,ramp:[.68,.92],hz:.05,labor:'full',renew:.04,cost:'dụng cụ, hóa chất, thuê mặt bằng, thợ phụ'},
 {k:'quan_ao_shop',n:'cửa hàng quần áo',tier:'small',fam:'retail',cap:250,rev:80,vc:.6,mg:.09,sd:.2,ramp:[.7,.93],hz:.05,labor:'part',renew:.04,cost:'hàng nhập, thuê mặt bằng, nhân viên bán hàng, hàng tồn'},
 {k:'quan_com',n:'quán cơm / quán ăn nhỏ',tier:'small',fam:'food',cap:300,rev:95,vc:.46,mg:.11,sd:.18,ramp:[.72,.94],hz:.06,labor:'full',food:1,renew:.04,cost:'thực phẩm, thuê mặt bằng, nhân viên, gas và điện'},
 {k:'tiem_banh',n:'tiệm bánh',tier:'small',fam:'food',cap:350,rev:90,vc:.4,mg:.13,sd:.2,ramp:[.7,.93],hz:.05,labor:'full',food:1,renew:.04,cost:'nguyên liệu, lò nướng, thuê mặt bằng, thợ phụ'},
 {k:'nhuong_quyen',n:'cửa hàng nhượng quyền trà sữa / cà phê',tier:'mid',fam:'food',cap:900,rev:140,vc:.48,mg:.12,sd:.12,ramp:[.85,.97],hz:.035,labor:'part',food:1,renew:.035,cost:'phí nhượng quyền và nguyên liệu bắt buộc, mặt bằng, nhân viên, điện nước'},
 {k:'xuong_nho',n:'xưởng sản xuất nhỏ',tier:'mid',fam:'craft',cap:1800,rev:260,vc:.62,mg:.12,sd:.14,ramp:[.75,.94],hz:.03,labor:'part',renew:.035,cost:'nguyên vật liệu, công nhân, máy móc, điện, thuê xưởng'},
 {k:'trai_trong',n:'trang trại rau / nuôi trồng',tier:'mid',fam:'farm',cap:1200,rev:120,vc:.5,mg:.15,sd:.3,ramp:[.7,.93],hz:.05,labor:'part',renew:.04,cost:'giống, phân thuốc, nước, nhân công mùa vụ, rủi ro thời tiết và dịch bệnh'}
];
CAT.forEach(function(b){b.k='s944_'+b.k;b.mu=b.mg*b.rev*12/b.cap;b.s944=true;W.BIZ.push(b);});
function byKey(k){return CAT.filter(function(b){return b.k===k;})[0]||null;}
function cap(l,b){return W.bizV(l,b.cap);}
function monthlyFixed(l,b){return W.bizV(l,b.rev)*(1-b.vc-b.mg);}
function reserve(l,b){return Math.max(l.base*.08,3*monthlyFixed(l,b));}
// Dự kiến theo mô hình (không có biến động ngẫu nhiên): lãi/lỗ năm 1, 2, ổn định, số năm hoàn vốn.
function econ(l,b,busy){var c=cap(l,b),R=W.bizV(l,b.rev)*12,ramp=b.ramp||[.76,.93],fix=R*(1-b.vc-b.mg),ren=c*(b.renew||.03),mul=busy&&b.labor==='full'?.62:1,mgr=busy?R*(b.labor==='full'?.1:.03):0;
 function prof(d){var rev=R*d*mul;return rev-(rev*b.vc+fix+ren+rev*(busy?(b.labor==='full'?.1:.03):0));}
 var p=[prof(ramp[0]),prof(ramp[1]),prof(1)],cum=0,years=null;for(var y=1;y<=15;y++){var v=y===1?p[0]:y===2?p[1]:p[2];if(cum+v>=c&&years==null){years=y-1+(c-cum)/Math.max(1e-9,v);}cum+=v;}
 return{cap:c,y1:p[0],y2:p[1],steady:p[2],payback:years,fixedMonthly:fix/12,breakEven:(fix+ren)/Math.max(1e-9,R*(1-b.vc))};}
function state(l){return l.flags.startup944||(l.flags.startup944={});}
function liquid(l){return Math.max(0,l.money);}
function mine(l){return (l.ventures||[]).filter(function(v){return v.s944;});}
function experience(l,b){var t=String(l.job&&l.job.id||'')+' '+String(l.lastJob&&(l.lastJob.id||l.lastJob)||'');return !!(EXP[b.fam]&&EXP[b.fam].test(t));}
function jobBusy(l){return !!l.job;}
function fmt(l,v){return H.money(l,v);}
function fitRank(l,b){var c=cap(l,b),L=liquid(l);return Math.abs(Math.log((c+reserve(l,b))/Math.max(1,L*.55)));}
function grantable(l,want){var cur=(l.loans||[]).filter(function(x){return x.type!=='home'&&x.type!=='car';}).reduce(function(s,x){return s+x.bal;},0);return Math.max(0,Math.min(want,l.base*5-cur));}
function famCapacity(l,b){var alive=(l.fam&&(l.fam.mAlive||l.fam.fAlive))||(l.partner&&l.partner.alive&&l.partner.status==='married');if(!alive)return 0;var q=(l.fam&&l.fam.q)||3;return cap(l,b)*(q>=4?.6:q>=3?.45:.3);}
function bankAmount(l,b){return H.canBankLoan&&H.canBankLoan(l)&&l.indep?cap(l,b)*.7:0;}
function reasonOpen(l,b){if(mine(l).some(function(v){return v.k===b.k;}))return 'Bạn đã có cơ sở này';if(mine(l).length>=3)return 'Đã có 3 cơ sở khởi nghiệp, hãy ổn định trước khi mở thêm';if(l.age<18)return 'Cần đủ 18 tuổi';return true;}
// ---------- bước 1: chọn mô hình theo vốn ----------
function rowsStart(l){var rows=[];var list=CAT.slice().sort(function(a,b){return fitRank(l,a)-fitRank(l,b);});
 list.forEach(function(b){var e=econ(l,b,jobBusy(l)),own=cap(l,b)+reserve(l,b),loan=Math.max(famCapacity(l,b),bankAmount(l,b)),ok=reasonOpen(l,b),need=own-liquid(l);
  var why=ok!==true?ok:(need<=1e-9||(loan>0&&need<=loan*1.0&&liquid(l)>=reserve(l,b)+cap(l,b)*.25))?true:'Thiếu vốn: cần '+fmt(l,Math.max(0,need))+' nữa (tự có hoặc vay)';
  var label=TIERS[b.tier].n+' · '+b.n[0].toUpperCase()+b.n.slice(1)+' · '+fmt(l,cap(l,b));
  var hint='Doanh thu ổn định ~'+fmt(l,W.bizV(l,b.rev))+'/tháng · năm 1 '+(e.y1>=0?'lãi ':'lỗ ')+fmt(l,Math.abs(e.y1))+', năm 2 '+(e.y2>=0?'lãi ':'lỗ ')+fmt(l,Math.abs(e.y2))+', ổn định '+(e.steady>=0?'lãi ':'lỗ ')+fmt(l,Math.abs(e.steady))+'/năm'+(e.payback?' · hoàn vốn ~'+(Math.round(e.payback*10)/10)+' năm':' · khó hoàn vốn')+' · giữ dự phòng '+fmt(l,reserve(l,b))+(b.labor==='full'?(jobBusy(l)?' · bạn còn đi làm nên chỉ bán được một phần thời gian':' · chủ làm cả ngày'):'')+' · rủi ro đóng cửa ~'+Math.round((b.hz||.03)*100)+'%/năm';
  rows.push({k:b.k,l:label,h:hint,why:why,run:function(l,r,log){var s=state(l);s.plan={k:b.k,at:l.age};s.prep=s.prep&&s.prep.k===b.k?s.prep:null;X.next(l,'startupFund944',r,{k:b.k},{manual:true});log('Bạn tính toán mở '+b.n+': vốn '+fmt(l,cap(l,b))+', cần giữ '+fmt(l,reserve(l,b))+' dự phòng. Bước tiếp theo là chọn cách huy động vốn.','neutral');}});});
 if(E.DEC.companySector133&&E.BUSINESS128&&E.BUSINESS128.why(l)===true)rows.push({k:'company',l:'Vốn lớn · Thành lập công ty (chọn ngành và quy mô vốn)',h:'Dùng hệ thống công ty có sẵn: ngành, ban điều hành và lương theo quy mô công ty',why:true,run:function(l,r,log){X.next(l,'companySector133',r,{},{manual:true});}});
 rows.push({k:'angel',l:'Vốn lớn · Góp vốn startup (đầu tư mạo hiểm)',h:'Phần lớn startup thất bại; một số ít sinh lời rất lớn. Kết quả thường rõ sau 3–7 năm',why:liquid(l)>=l.base*6?true:'Cần ít nhất '+fmt(l,l.base*6)+' tiền mặt',run:function(l,r,log){X.next(l,'angel944',r,{},{manual:true});}});
 return rows;}
X.menu('startup944','Khởi nghiệp theo vốn',function(l){return X.reason(l,18);},function(l){var n=mine(l).length;return 'Chọn mô hình kinh doanh theo số vốn bạn có. Năm đầu thường chưa đông khách nên dễ lỗ; cần quỹ dự phòng để trụ qua giai đoạn đầu. '+(n?'Bạn đang có '+n+' cơ sở khởi nghiệp. ':'')+'Tiền mặt hiện có '+fmt(l,l.money)+'. Số liệu là ước tính trong game, không phải dự báo.';},function(l){return rowsStart(l);},18,GROUP);
// ---------- bước 2: huy động vốn ----------
function fundRows(l,arg){var b=byKey(arg&&arg.k);if(!b)return [];var c=cap(l,b),rs=reserve(l,b),rows=[];
 var fam=Math.min(famCapacity(l,b),grantable(l,famCapacity(l,b))),bank=Math.min(bankAmount(l,b),grantable(l,bankAmount(l,b)));
 rows.push({k:'own',l:'Dùng tiền tự có · '+fmt(l,c),h:'Giữ lại '+fmt(l,rs)+' dự phòng; không phải trả nợ',why:liquid(l)>=c+rs?true:'Cần '+fmt(l,c+rs)+' (hiện có '+fmt(l,liquid(l))+')',run:function(l,r,log){open(l,b,r,log,'own',0);}});
 rows.push({k:'family',l:'Vay người thân · '+fmt(l,fam),h:'Không lãi nhưng phải trả dần; không trả được sẽ ảnh hưởng quan hệ',why:fam<=0?'Không có người thân có thể cho vay hoặc đã vay quá nhiều':liquid(l)+fam>=c+rs?true:'Vay xong vẫn thiếu vốn',run:function(l,r,log){open(l,b,r,log,'family',fam);}});
 rows.push({k:'bank',l:'Vay ngân hàng · '+fmt(l,bank),h:'Lãi khoảng 9%/năm, trả định kỳ; chủ doanh nghiệp nhỏ vay không cần thế chấp bằng nhà trong game',why:bank<=0?'Chưa đủ điều kiện vay (tuổi, nợ xấu hoặc nợ hiện tại)':liquid(l)+bank>=c+rs?true:'Vay xong vẫn thiếu vốn',run:function(l,r,log){open(l,b,r,log,'bank',bank);}});
 rows.push({k:'prep',l:'Chuẩn bị thêm: học nghề, khảo sát khách, chưa chi tiền',h:'Mất một năm nhưng chủ vững tay nghề hơn khi khai trương',why:true,run:function(l,r,log){var s=state(l);s.prep={k:b.k,at:l.age};H.fx(l,{kno:1,soc:1});log('Bạn dành thời gian khảo sát khách, học hỏi người trong nghề và tính lại chi phí cho '+b.n+'. Chưa chi tiền; kế hoạch giữ trong hai năm.','neutral');}});
 return rows;}
X.menu('startupFund944','Huy động vốn mở cơ sở',function(l){return X.reason(l,18);},function(l,d){var b=byKey(d&&d.arg&&d.arg.k);if(!b)return 'Kế hoạch không còn hiệu lực.';var e=econ(l,b,jobBusy(l));return 'Mở '+b.n+' cần vốn '+fmt(l,cap(l,b))+' và quỹ dự phòng '+fmt(l,reserve(l,b))+'. Điểm hòa vốn khi đạt khoảng '+Math.round(e.breakEven*100)+'% lượng khách bình thường. Chi phí chính: '+b.cost+'. Vay là nợ thật: lỗ vẫn phải trả.';},function(l,arg){return fundRows(l,arg);},18);
function qOf(l,b,r,prep){var talent=(l.talent==='kinh doanh'||l.talent==='ăn nói')?.08:0,ex=experience(l,b)?.1:0;return U.clamp(Math.exp(U.normal(r)*.2+talent+(l.st.kno-50)/450+ex+(prep?.05:0)-(l.age<22?.04:0)),.5,1.45);}
function open(l,b,r,log,how,loan){var c=cap(l,b),rs=reserve(l,b);if(reasonOpen(l,b)!==true)return;
 var want=loan>0?grantable(l,loan):0;if(l.money+want<c+rs*.5){log('Chưa đủ tiền để khai trương '+b.n+'; bạn hoãn kế hoạch.','neutral');return;}
 var before=(l.loans||[]).length;if(want>0){H.addLoan(l,how==='family'?'family':'bank',want);}
 var granted=(l.loans||[]).length>before?l.loans[l.loans.length-1].bal:0;
 if(l.money<c){log('Chưa đủ tiền để khai trương '+b.n+'; bạn hoãn kế hoạch (khoản vay đã nhận vẫn phải trả).','bad');return;}
 var s=state(l),prep=s.prep&&s.prep.k===b.k&&l.age-s.prep.at<=2;H.cash(l,-c,'Vốn mở '+b.n);
 var v={k:b.k,n:b.n,cap:c,unit:c,br:1,mu:b.mu,sd:b.sd,yrs:0,bad:0,good:0,R:W.bizV(l,b.rev)*12,q:qOf(l,b,r,prep),s944:{at:l.age,how:how,loan:granted,prep:!!prep,rep:50,reviewAt:null,eventAt:null,events:0}};
 (l.ventures=l.ventures||[]).push(v);s.plan=null;s.prep=null;s.opened=(s.opened||0)+1;
 log('Khai trương '+b.n+' bằng '+(how==='own'?'tiền tự có':how==='family'?'khoản vay người thân '+fmt(l,granted):'khoản vay ngân hàng '+fmt(l,granted))+'. '+(experience(l,b)?'Kinh nghiệm làm việc trước đây giúp bạn vững tay hơn. ':'')+(prep?'Một năm chuẩn bị giúp bạn đỡ bỡ ngỡ. ':'')+(b.labor==='full'&&jobBusy(l)?'Bạn vẫn đi làm nên chỉ mở được một phần thời gian. ':'')+'Năm đầu khách còn thưa, hãy theo dõi dòng tiền.','big');
 H.fx(l,{hap:5,soc:1});H.mem(l,'Ngày khai trương '+b.n+', chiếc bảng hiệu mới treo lên.',4);}
// ---------- bước 3: đánh giá cuối năm ----------
function venOf(l,k){return mine(l).filter(function(v){return v.k===k;})[0]||null;}
function findIdx(l,v){return (l.ventures||[]).indexOf(v);}
function liquidate(l,v,k,log,how){var i=findIdx(l,v);if(i<0)return;var got=v.cap*k;H.cash(l,got,how+' '+v.n);l.ventures.splice(i,1);log(how+' '+v.n+', thu về '+fmt(l,got)+(v.s944&&v.s944.loan?'. Khoản vay vẫn phải trả dần như nợ cá nhân.':'.'),'bad');}
function reviewRows(l,arg){var v=venOf(l,arg&&arg.k);if(!v)return [];var b=byKey(v.k),c=v.cap,last=v.last||{},rows=[];
 rows.push({k:'keep',l:'Giữ nguyên cách làm',h:'Không tốn thêm; kết quả tùy khách và thị trường',why:true,run:function(l,r,log){log('Bạn giữ nguyên cách làm ở '+v.n+'.','neutral');}});
 rows.push({k:'promote',l:'Đầu tư quảng bá và nâng chất lượng · '+fmt(l,c*.08),h:'Tăng chất lượng và tên tuổi; hiệu quả không chắc chắn',why:l.money>=c*.08+(b?reserve(l,b)*.3:0)?true:'Chưa đủ tiền dự phòng',run:function(l,r,log){H.cash(l,-c*.08,'Quảng bá, nâng chất lượng '+v.n);var d=.04+r()*.08;v.q=U.clamp(v.q*(1+d),.45,1.45);v.s944.rep=U.clamp((v.s944.rep||50)+4,0,100);log('Chi '+fmt(l,c*.08)+' quảng bá và cải thiện '+v.n+'; khách quen tăng dần (hiệu quả thực tế thấy rõ sau vài tháng).','good');}});
 rows.push({k:'cut',l:'Cắt chi phí cố định (đổi chỗ rẻ hơn, bớt giờ làm)',h:'Giảm chi phí nhưng mất bớt khách',why:true,run:function(l,r,log){v.R=v.R*.96;v.q=U.clamp(v.q*.97,.45,1.45);v.cutFix944=(v.cutFix944||0)+1;log('Bạn bớt giờ mở cửa và chuyển sang chỗ rẻ hơn ở '+v.n+'; chi phí cố định giảm nhưng khách cũng thưa đi một chút.','neutral');}});
 rows.push({k:'pivot',l:'Đổi mặt hàng / cách bán · '+fmt(l,c*.1),h:'Thử hướng mới; một phần khách cũ có thể mất, thành công hay không còn tùy tay nghề',why:l.money>=c*.1?true:'Chưa đủ tiền',run:function(l,r,log){H.cash(l,-c*.1,'Đổi mặt hàng '+v.n);var gain=U.normal(r)*.18;v.q=U.clamp(v.q*(1+gain),.45,1.45);v.yrs=Math.max(1,v.yrs-1);v.bad=0;log('Bạn đổi mặt hàng và cách bán ở '+v.n+' với '+fmt(l,c*.1)+'. '+(gain>=0?'Khách phản ứng khá tốt.':'Khách chưa quen, cần thêm thời gian.'),gain>=0?'good':'neutral');}});
 if(jobBusy(l)&&b&&b.labor==='full')rows.push({k:'hire',l:'Thuê người đứng quầy · ~'+fmt(l,c*.1)+'/năm',h:'Bạn giữ việc làm; mất bớt lãi nhưng cơ sở mở cả ngày',why:true,run:function(l,r,log){v.hired944=true;v.s944.hired=true;log('Bạn thuê người đứng quầy ở '+v.n+', cơ sở mở đủ giờ hơn nhưng phải trả lương.','neutral');}});
 rows.push({k:'sell',l:'Sang nhượng / thanh lý',h:'Thu về khoảng 25–50% vốn tùy uy tín và chất lượng',why:true,run:function(l,r,log){var k=U.clamp(.25+(v.q-.8)*.35+(v.s944.rep-50)/400,.2,.5);liquidate(l,v,k,log,'Sang nhượng');}});
 return rows;}
X.menu('startupReview944','Đánh giá cuối năm của cơ sở',function(l){return mine(l).length?X.reason(l,18):'Chưa có cơ sở khởi nghiệp';},function(l,d){var v=venOf(l,d&&d.arg&&d.arg.k);if(!v)return 'Cơ sở không còn hoạt động.';var x=v.last||{};return U.cap(v.n)+' sau '+v.yrs+' năm: doanh thu '+fmt(l,x.rev||0)+', chi phí '+fmt(l,x.cost||0)+', '+((x.prof||0)>=0?'lãi ':'lỗ ')+fmt(l,Math.abs(x.prof||0))+' cả năm. '+(v.yrs<=2?'Giai đoạn đầu thường chưa đông khách; điều quan trọng là dòng tiền còn đủ trụ. ':'')+(v.s944&&v.s944.loan?'Còn nợ vay mở cơ sở. ':'')+'Chọn cách làm cho năm tới.';},function(l,arg){return reviewRows(l,arg);},18);
// ---------- sự kiện kinh doanh hằng năm ----------
var EVENTS={
 inspect:{fam:['food'],w:1,n:'Kiểm tra vệ sinh an toàn thực phẩm',t:function(v){return 'Đoàn kiểm tra đến '+v.n+'. Họ yêu cầu giấy tờ, khu chế biến và nguồn nguyên liệu.';},o:function(v,l){return[
  {k:'fix',l:'Sửa ngay theo yêu cầu · '+fmt(l,v.cap*.03),h:'Tốn chi phí nhưng yên tâm; uy tín tốt lên',run:function(l,r,log){H.cash(l,-v.cap*.03,'Sửa theo kiểm tra '+v.n);v.s944.rep=U.clamp(v.s944.rep+5,0,100);log('Bạn sửa khu chế biến và bổ sung giấy tờ ở '+v.n+'; đoàn kiểm tra ghi nhận đạt.','good');}},
  {k:'pause',l:'Tạm đóng cửa vài ngày để chỉnh đốn',h:'Mất doanh thu vài ngày, ít tốn chi phí',run:function(l,r,log){v.last&&(v.last.rev*=.97);v.q=U.clamp(v.q*.98,.45,1.45);log('Bạn nghỉ bán vài ngày để chỉnh đốn '+v.n+'; mất một ít doanh thu nhưng không bị xử phạt.','neutral');}},
  {k:'ignore',l:'Chỉ đối phó cho qua',h:'Rủi ro bị phạt và mất uy tín nếu bị kiểm tra lại',run:function(l,r,log){if(r()<.5){H.cash(l,-v.cap*.05,'Bị phạt vệ sinh '+v.n);v.s944.rep=U.clamp(v.s944.rep-10,0,100);v.q=U.clamp(v.q*.94,.45,1.45);log('Bị lập biên bản và phạt '+fmt(l,v.cap*.05)+'; khách biết chuyện nên vắng đi ở '+v.n+'.','bad');}else log('Lần này đoàn kiểm tra bỏ qua, nhưng rủi ro vẫn còn đó.','neutral');}}];}},
 sidewalk:{fam:['food','retail'],street:1,w:.8,n:'Giải tỏa vỉa hè',t:function(v){return 'Địa phương siết lấn chiếm vỉa hè; chỗ bán của '+v.n+' có thể bị yêu cầu dọn.';},o:function(v,l){return[
  {k:'move',l:'Chuyển vào hẻm / thuê mặt bằng nhỏ · '+fmt(l,v.cap*.15),h:'Tốn vốn nhưng chỗ bán ổn định hơn',run:function(l,r,log){H.cash(l,-v.cap*.15,'Dời chỗ '+v.n);v.R=v.R*1.04;v.q=U.clamp(v.q*.96,.45,1.45);v.dropHz944=true;log('Bạn dời '+v.n+' vào chỗ cố định; khách cũ mất một ít nhưng không còn lo bị dẹp.','neutral');}},
  {k:'pause',l:'Nghỉ vài tuần chờ rồi bán lại',h:'Không tốn tiền, mất doanh thu và khách quen',run:function(l,r,log){v.q=U.clamp(v.q*.9,.45,1.45);log('Bạn nghỉ bán mấy tuần; khi mở lại nhiều khách quen đã đổi chỗ khác.','bad');}},
  {k:'stop',l:'Thôi, sang lại dụng cụ',h:'Thu về khoảng một phần ba vốn',run:function(l,r,log){liquidate(l,v,.33,log,'Sang lại');}}];}},
 rival:{fam:['food','retail','service','online'],w:1.2,n:'Đối thủ mở ngay bên cạnh',t:function(v){return 'Một cơ sở cùng loại với '+v.n+' mở ngay gần đó và chạy khuyến mãi mạnh.';},o:function(v,l){return[
  {k:'quality',l:'Nâng chất lượng, giữ giá · '+fmt(l,v.cap*.04),h:'Giữ khách trung thành, khó tăng khách mới',run:function(l,r,log){H.cash(l,-v.cap*.04,'Nâng chất lượng '+v.n);v.q=U.clamp(v.q*(1+.03+r()*.04),.45,1.45);log('Bạn nâng chất lượng thay vì giảm giá ở '+v.n+'; khách quen ở lại.','good');}},
  {k:'price',l:'Giảm giá cạnh tranh',h:'Giữ được khách nhưng lãi mỏng đi',run:function(l,r,log){v.R=v.R*.97;v.market=U.clamp((v.market==null?1:v.market)+.04,.55,1.2);log('Bạn giảm giá ở '+v.n+'; khách ở lại nhưng lãi trên mỗi đơn mỏng đi.','neutral');}},
  {k:'hold',l:'Giữ nguyên, chờ xem',h:'Không tốn tiền; có thể mất khách',run:function(l,r,log){v.market=U.clamp((v.market==null?1:v.market)-.06,.55,1.2);log('Bạn giữ nguyên ở '+v.n+'; một phần khách chuyển sang quán mới.','bad');}}];}},
 bulk:{fam:['food','retail','craft','online'],w:.8,n:'Đơn hàng lớn dịp lễ',t:function(v){return v.n[0].toUpperCase()+v.n.slice(1)+' nhận lời đặt số lượng lớn nhân dịp lễ, Tết.';},o:function(v,l){return[
  {k:'all',l:'Nhận hết, thuê thêm người · '+fmt(l,v.cap*.05),h:'Lời nhiều nhưng dễ quá tải và sai sót',run:function(l,r,log){H.cash(l,-v.cap*.05,'Thuê thêm người dịp lễ '+v.n);if(r()<.65){var g=v.R*(.05+r()*.05);H.cash(l,g,'Doanh thu đơn lớn '+v.n);log('Đơn lớn hoàn tất, thu thêm '+fmt(l,g)+' ở '+v.n+'.','good');}else{v.s944.rep=U.clamp(v.s944.rep-6,0,100);log('Quá tải nên giao trễ và sai sót ở '+v.n+'; khách phàn nàn, uy tín giảm.','bad');}}},
  {k:'part',l:'Nhận vừa sức',h:'Lời ít hơn nhưng chắc chắn',run:function(l,r,log){var g=v.R*.025;H.cash(l,g,'Doanh thu đơn vừa '+v.n);log('Bạn nhận phần vừa sức, thu thêm '+fmt(l,g)+' và giữ được chất lượng ở '+v.n+'.','good');}},
  {k:'no',l:'Từ chối, giữ khách thường ngày',h:'Không rủi ro, bỏ lỡ một khoản',run:function(l,r,log){log('Bạn từ chối đơn lớn để giữ khách thường ngày của '+v.n+'.','neutral');}}];}},
 stock:{fam:['retail','online'],w:1,n:'Hàng tồn ế mùa trái vụ',t:function(v){return v.n[0].toUpperCase()+v.n.slice(1)+' còn nhiều hàng tồn không bán được khi sang mùa.';},o:function(v,l){return[
  {k:'sale',l:'Xả hàng giảm giá',h:'Thu hồi vốn một phần, mất lãi',run:function(l,r,log){H.cash(l,-v.cap*.04,'Xả hàng tồn '+v.n);log('Bạn xả hàng tồn ở '+v.n+', lỗ khoảng '+fmt(l,v.cap*.04)+' nhưng giải phóng được vốn.','neutral');}},
  {k:'keep',l:'Giữ lại chờ mùa sau',h:'Không lỗ ngay, hàng có thể lỗi mốt',run:function(l,r,log){if(r()<.5){H.cash(l,-v.cap*.08,'Hàng lỗi mốt '+v.n);log('Qua mùa, hàng giữ lại lỗi mốt, phải bỏ giá thấp ở '+v.n+'.','bad');}else log('Mùa sau hàng tồn bán được ở '+v.n+'.','good');}}];}},
 staff:{fam:['food','service','craft'],w:.9,n:'Nhân viên chính nghỉ việc',t:function(v){return 'Người làm chính ở '+v.n+' xin nghỉ vì được nơi khác trả cao hơn.';},o:function(v,l){return[
  {k:'raise',l:'Tăng lương giữ lại · '+fmt(l,v.cap*.04)+'/năm',h:'Giữ được tay nghề, tăng chi phí',run:function(l,r,log){v.R=v.R*.985;log('Bạn tăng lương để giữ người làm chính ở '+v.n+'.','neutral');}},
  {k:'hire',l:'Tuyển người mới',h:'Mất thời gian đào tạo, chất lượng dao động',run:function(l,r,log){v.q=U.clamp(v.q*(1-.04+U.normal(r)*.03),.45,1.45);log('Bạn tuyển người mới ở '+v.n+'; vài tháng đầu chất lượng chưa ổn định.','neutral');}}];}},
 sick:{fam:['food','service','retail'],labor:1,w:.7,n:'Chủ ốm',t:function(v){return 'Bạn mệt và sút sức sau nhiều tháng làm việc không nghỉ ở '+v.n+'.';},o:function(v,l){return[
  {k:'rest',l:'Nghỉ ngơi, nhờ người trông giúp',h:'Mất doanh thu mấy tuần, hồi phục tốt',run:function(l,r,log){H.fx(l,{hea:3});v.q=U.clamp(v.q*.97,.45,1.45);log('Bạn nghỉ ngơi để lấy lại sức; '+v.n+' hoạt động cầm chừng mấy tuần.','neutral');}},
  {k:'push',l:'Gắng gượng làm tiếp',h:'Giữ doanh thu nhưng hại sức khỏe',run:function(l,r,log){H.fx(l,{hea:-6,hap:-3});if(l.mind)l.mind.stress=Math.min(100,l.mind.stress+8);log('Bạn gắng gượng làm tiếp ở '+v.n+'; sức khỏe giảm và căng thẳng tăng.','bad');}}];}},
 viral:{fam:['online','food'],w:.6,n:'Được nhiều người nhắc đến trên mạng',t:function(v){return v.n[0].toUpperCase()+v.n.slice(1)+' bất ngờ được nhiều người chia sẻ trên mạng xã hội.';},o:function(v,l){return[
  {k:'scale',l:'Nhập thêm hàng, tăng ca · '+fmt(l,v.cap*.06),h:'Tận dụng đà nhưng có thể thừa hàng khi hết sốt',run:function(l,r,log){H.cash(l,-v.cap*.06,'Tăng nhập hàng '+v.n);if(r()<.6){var g=v.R*(.06+r()*.06);H.cash(l,g,'Doanh thu từ đà quảng bá '+v.n);v.s944.rep=U.clamp(v.s944.rep+6,0,100);log('Đà quảng bá kéo khách đông: thu thêm '+fmt(l,g)+' ở '+v.n+'.','good');}else log('Cơn sốt qua nhanh, hàng nhập thêm ở '+v.n+' còn tồn.','bad');}},
  {k:'steady',l:'Giữ nhịp bình thường',h:'Không rủi ro, một phần khách mới ở lại',run:function(l,r,log){v.q=U.clamp(v.q*1.02,.45,1.45);log('Bạn giữ nhịp bình thường; một phần khách mới ở lại với '+v.n+'.','good');}}];}}
};
function famOf(v){var b=byKey(v.k);return b?b.fam:null;}
function pickEvent(l,v,r){var b=byKey(v.k);if(!b)return null;var ids=Object.keys(EVENTS).filter(function(id){var e=EVENTS[id];return e.fam.indexOf(b.fam)>=0&&(!e.street||b.street)&&(!e.labor||b.labor==='full');});if(!ids.length)return null;return U.wpick(r,ids,function(id){return EVENTS[id].w;});}
X.menu('startupEvent944','Việc kinh doanh trong năm',function(l){return mine(l).length?X.reason(l,18):'Chưa có cơ sở khởi nghiệp';},function(l,d){var a=d&&d.arg||{},v=venOf(l,a.vk),e=EVENTS[a.kind];return v&&e?e.n+'. '+e.t(v)+' Quyết định của bạn ảnh hưởng đến tiền, khách và uy tín.':'Việc này không còn hiệu lực.';},function(l,arg){var v=venOf(l,arg&&arg.vk),e=EVENTS[arg&&arg.kind];return v&&e?e.o(v,l).map(function(o){return Object.assign({why:true},o);}):[];},18);
// ---------- góp vốn startup (vốn lớn) ----------
var ANGEL={noDD:[.62,.25,.1,.03],dd:[.5,.3,.15,.05],range:[[0,0],[.4,1.6],[2,6],[8,25]]};
function angelRows(l){var rows=[],L=liquid(l),res=l.base*2;[.1,.25,.4].forEach(function(p){var amt=Math.round(L*p*100)/100;if(amt<l.base*2)return;[false,true].forEach(function(dd){var fee=dd?amt*.03:0;rows.push({k:'a'+Math.round(p*100)+(dd?'d':'n'),l:'Góp '+fmt(l,amt)+(dd?' · thẩm định kỹ (+'+fmt(l,fee)+')':' · không thẩm định'),h:dd?'Giảm khoảng 12 điểm phần trăm khả năng mất trắng':'Nhanh gọn nhưng dễ chọn nhầm',why:L>=amt+fee+res?true:'Cần giữ '+fmt(l,res)+' sinh hoạt',run:function(l,r,log){H.cash(l,-(amt+fee),'Góp vốn startup');var s=state(l);(s.angel=s.angel||[]).push({amt:amt,at:l.age,exit:l.age+3+Math.floor(r()*5),dd:dd,done:false});log('Bạn góp '+fmt(l,amt)+' vào một startup'+(dd?' sau khi thẩm định kỹ':' mà không thẩm định')+'. Kết quả thường chỉ rõ sau 3–7 năm; nhiều khả năng bạn mất một phần hoặc toàn bộ.','big');H.mem(l,'Lần đầu bạn góp vốn vào một startup.',3);}});});});
 rows.push({k:'none',l:'Chưa góp vốn',h:'',why:true,run:function(){}});return rows;}
X.menu('angel944','Góp vốn startup',function(l){return X.reason(l,22);},function(l){var n=((state(l).angel||[]).filter(function(a){return !a.done;})).length;return 'Góp vốn vào một startup không có doanh thu ổn định: phần lớn thất bại, vài trường hợp sinh lời rất lớn. Bạn đang có '+n+' khoản chưa có kết quả. Tiền mặt '+fmt(l,l.money)+'.';},function(l){return angelRows(l);},22);
function angelYear(l,r,log){var s=l.flags.startup944;if(!s||!s.angel)return;s.angel.forEach(function(a){if(a.done||l.age<a.exit)return;a.done=true;var w=a.dd?ANGEL.dd:ANGEL.noDD,x=r(),i=0,acc=w[0];while(x>acc&&i<3){i++;acc+=w[i];}var R=ANGEL.range[i],m=R[0]+(R[1]-R[0])*r(),got=a.amt*m;
 if(got>0)H.cash(l,got,'Thu hồi vốn startup');
 log(i===0?'Startup bạn góp vốn '+fmt(l,a.amt)+' đã đóng cửa; bạn mất toàn bộ khoản đầu tư.':i===1?'Startup được một công ty khác mua lại: bạn thu về '+fmt(l,got)+' trên '+fmt(l,a.amt)+' đã góp.':'Startup phát triển tốt: bạn thu về '+fmt(l,got)+' (khoảng '+(Math.round(m*10)/10)+' lần vốn góp).',i===0?'bad':'good');
 if(i===0)H.fx(l,{hap:-5});else if(i>=2)H.fx(l,{hap:6});});}
// ---------- vòng đời hằng năm ----------
E.HOOKS.year.push(function(l,r,log){if(!l.alive)return;var s=l.flags.startup944;
 // gỡ kế hoạch quá hạn
 if(s&&s.plan&&l.age-s.plan.at>2)s.plan=null;if(s&&s.prep&&l.age-s.prep.at>2)s.prep=null;
 angelYear(l,r,log);
 mine(l).forEach(function(v){var m=v.s944;if(!m)return;
  // khoản vay mở cơ sở: nếu cơ sở đóng cửa thì khoản vay vẫn là nợ cá nhân (đã nằm trong l.loans)
  if(v.hired944&&v.s944.hired){H.cash(l,-v.cap*.1,'Lương người đứng quầy '+v.n);}
  if(v.dropHz944&&m.dropHz!==true){m.dropHz=true;}
  if(m.reviewAt!==l.age&&v.last&&(v.yrs===1||v.yrs===2||(v.last.prof<0&&v.bad>=1&&(m.reviewAt==null||l.age-m.reviewAt>=3)))&&!(l.pending||[]).some(function(d){return d.id==='startupReview944';})){m.reviewAt=l.age;X.next(l,'startupReview944',r,{k:v.k},{manual:false});}
  else if(m.eventAt!==l.age&&v.yrs>=1&&r()<.3&&!(l.pending||[]).some(function(d){return d.id==='startupEvent944'||d.id==='startupReview944';})){var kind=pickEvent(l,v,r);if(kind){m.eventAt=l.age;m.events=(m.events||0)+1;X.next(l,'startupEvent944',r,{vk:v.k,kind:kind},{manual:false});}}});
 // người chơi do máy điều khiển, hoặc đang thất nghiệp có vốn: thỉnh thoảng nghĩ đến chuyện khởi nghiệp
 if(l.indep&&l.age>=20&&l.age<=58&&!mine(l).length&&!(l.pending||[]).some(function(d){return d.id==='startup944'||d.id==='startupFund944';})&&liquid(l)>=l.base*.6&&r()<(l.flags.needJob?.05:.012)&&X.reason(l,18)===true){X.next(l,'startup944',r,{},{manual:false});}
});
// cơ sở nằm ngoài danh sách đầu tư gốc: sinh nhật ký lãi lỗ theo cùng sổ sách của wealth.investYear nên không cần xử lý thêm ở đây
E.STARTUP944={CAT:CAT,TIERS:TIERS,econ:econ,reserve:reserve,cap:cap,byKey:byKey,mine:mine,EVENTS:EVENTS,ANGEL:ANGEL,qOf:qOf,open:open,rowsStart:rowsStart,fundRows:fundRows,reviewRows:reviewRows,angelRows:angelRows,angelYear:angelYear,pickEvent:pickEvent,liquidate:liquidate};
})(typeof window!=='undefined'?(window.G=window.G||{}):(globalThis.G=globalThis.G||{}));

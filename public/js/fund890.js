/* 9.0: xin hoặc mượn bố mẹ tiền du học, và nói rõ hồ sơ du học đang thiếu gì.
   Trước đây "Nộp hồ sơ tự túc" biến mất khi tiền riêng của nhân vật ít hơn học phí cả khóa (kể cả nhà rất giàu) và bước xin visa chỉ ghi "cần phí và quỹ" không nêu số tiền.
   Nay: (1) cảnh nộp hồ sơ có thêm "Xin bố mẹ hỗ trợ" và "Mượn bố mẹ" khi còn thiếu tiền, rồi nộp hồ sơ tự túc luôn nếu đủ; (2) mục thư nhận học/visa có dòng "Xin / mượn bố mẹ" và liệt kê từng điều kiện còn thiếu kèm số tiền.
   Khả năng của bố mẹ theo thu nhập hiện tại và tiền tiết kiệm ước tính của nhóm kinh tế gia đình, chia cho số anh chị em; cho không nhận ít hơn cho mượn, một lần xin tốn thêm niềm tin. Xác suất bố mẹ đồng ý theo năng lực học tập và số lần đã xin trong năm, không theo giàu nghèo.
   Tiền cho không là quà (không thành nợ); mượn thành khoản "vay người thân" lãi 0% của hệ vay có sẵn. Mức và tỷ lệ là tham số trò chơi. */
(function(G){'use strict';var E=G.E,H=E.H,U=G.U,X=E.UPDATE110,A=E.ABROAD_DEPTH900,G9=E.GLOBAL919;
if(!E.DEC.abroad107_apply||!E.DEC.studyVisa900||!A||!X)return;
var SAVE=[0,.1,.3,.8,2.5,10],SHARE=[0,.25,.25,.3,.35,.5];
function state(l){return l.flags.fund890||(l.flags.fund890={asks:[]});}
function alive(l){var f=l.fam||{};return !!(f.mAlive||f.fAlive&&!f.noDad);}
function annual(l){var f=l.fam||{};return 12*((f.mAlive?f.mInc||0:0)+(f.fAlive&&!f.noDad?f.fInc||0:0));}
// Số tiền tối đa bố mẹ có thể đưa ra một lần: một phần thu nhập năm và tiền tiết kiệm ước tính, chia cho số con.
function capacity(l,mode){
 if(!alive(l))return 0;var q=Math.max(1,Math.min(5,(l.fam&&l.fam.q)||3)),sibs=Math.min(4,(l.fam&&l.fam.sibs)||0);
 return (annual(l)+l.base*SAVE[q])*SHARE[q]/(1+.15*sibs)*(mode==='loan'?1.3:1);
}
function askedThisYear(l){return state(l).asks.filter(function(x){return x.age===l.age;}).length;}
function chance(l,mode){return U.clamp(.6+((l.st&&l.st.kno)||50)/250-.2+(mode==='loan'?.15:0)-.2*askedThisYear(l),.15,.92);}
function fee(l){return l.base*.02;}
function tuition(l,d){return G9?G9.tuitionTotal(l,d):l.base*(d.lv===6?2:4);}
function tuitionShortfall(l,d){return Math.max(0,tuition(l,d)+fee(l)-l.money);}
function visaNeed(l,o){return (o.unpaid919||0)+l.base*.52;}
function visaShortfall(l,o){return Math.max(0,visaNeed(l,o)-l.money);}
// Một lần xin: trả về {given,mode,why}. Không đổi trạng thái khi bố mẹ không còn hoặc đã hết lượt.
function ask(l,r,log,need,mode,purpose){
 var s=state(l);
 if(!(need>0))return {given:0,mode:mode,why:'noneed'};
 if(!alive(l)){log('Bố mẹ không còn để xin hỗ trợ.','neutral');return {given:0,mode:mode,why:'noparents'};}
 if(askedThisYear(l)>=2){log('Năm nay bạn đã xin bố mẹ hai lần; lần này bố mẹ nói đợi sang năm.','neutral');return {given:0,mode:mode,why:'limit'};}
 var cap=capacity(l,mode),p=chance(l,mode),want=Math.min(need*1.05,cap),roll=r(),given=0,why;
 if(cap<=0)why='nomoney';else if(roll<p){given=want;why='full';}else if(roll<p+.2){given=want*.5;why='half';}else why='refused';
 s.asks.push({age:l.age,mode:mode,need:need,given:given,purpose:purpose});s.asks=s.asks.slice(-12);
 var parent=(l.fam&&l.fam.mAlive&&l.fam.fAlive&&!l.fam.noDad)?'Bố mẹ':l.fam&&l.fam.mAlive?'Mẹ':'Bố';
 if(given>0){
  if(mode==='loan'){H.addLoan(l,'family',given);}else H.cash(l,given,'Bố mẹ hỗ trợ tiền du học');
  log(parent+(why==='full'?(given<need?' đưa hết khả năng':' đồng ý')+': ':' chỉ giúp được một nửa: ')+H.money(l,given)+(mode==='loan'?' cho mượn, không lãi, trả dần khi bạn có thu nhập.':' hỗ trợ, không cần hoàn lại.')+(given<need?' Vẫn còn thiếu '+H.money(l,need-given)+'.':''),'good');
  H.mem(l,'Ngày '+parent.toLowerCase()+' đưa tiền cho bạn đi du học.',3);
 }else log(({nomoney:parent+' không còn khoản dư để lo cho bạn lúc này.',refused:parent+' chưa đồng ý: "Con tự cố gắng thêm đi, hoặc cân nhắc học trong nước."',limit:''})[why]||parent+' chưa giúp được.','neutral');
 return {given:given,mode:mode,why:why,cap:cap};
}
function needLine(l,label,have,need){return (have>=need?'✓ ':'✗ ')+label;}
// --- cảnh nộp hồ sơ: thêm lựa chọn xin / mượn bố mẹ và dòng giải thích thiếu tiền ---
var AP=E.DEC.abroad107_apply,def=AP.def,self=def.opts.find(function(o){return o.k==='self';});
function proceed(l,r,log,d){
 var o=def.opts.find(function(x){return x.k==='self';}),s=self?self:o;
 if(l.money>=tuition(l,d)+fee(l)&&s&&s.run){log('Có đủ tiền, bạn nộp hồ sơ tự túc.','neutral');s.run(l,r,log,d);return;}
 var nd=E.DEC.abroad107_apply.make(l,r,{at:l.age,lv:d.lv,country:d.country,school:d.school,field:d.field,done:false});nd.manual=true;l.pending.unshift(nd);
}
function parentRow(mode){return {k:mode==='loan'?'ploan':'pgift',
 l:function(l,d){return (mode==='loan'?'Mượn bố mẹ tiền học phí':'Xin bố mẹ hỗ trợ học phí')+' · còn thiếu '+H.money(l,tuitionShortfall(l,d));},
 h:function(l,d){return alive(l)?'Bố mẹ có thể đưa tối đa khoảng '+H.money(l,capacity(l,mode))+'; xác suất đồng ý ~'+Math.round(chance(l,mode)*100)+'%':'';},
 req:function(l,d){return alive(l)&&tuitionShortfall(l,d)>0&&askedThisYear(l)<2;},
 ai:{w:.5},
 run:function(l,r,log,d){if(!d||d.done||d.at!==l.age)return;ask(l,r,log,tuitionShortfall(l,d),mode,'tuition');proceed(l,r,log,d);}};}
var cancelAt=def.opts.findIndex(function(o){return o.k==='cancel';});
if(!def.opts.some(function(o){return o.k==='pgift';}))def.opts.splice(cancelAt<0?def.opts.length:cancelAt,0,parentRow('gift'),parentRow('loan'));
var text0=def.text;def.text=function(l,d){
 var t=typeof text0==='function'?text0.apply(this,arguments):text0||'',short=tuitionShortfall(l,d);
 if(short>0&&t.indexOf('Tiền của bạn hiện chưa đủ')<0)t+=' Tiền của bạn hiện chưa đủ học phí tự túc: cần '+H.money(l,tuition(l,d)+fee(l))+' (gồm phí hồ sơ), đang có '+H.money(l,l.money)+', thiếu '+H.money(l,short)+'.'+(alive(l)?' Bạn có thể xin hoặc mượn bố mẹ, hoặc nộp hồ sơ học bổng.':'');
 return t;};
// --- thư nhận học và visa: liệt kê từng điều kiện và số tiền còn thiếu ---
var SV=E.DEC.studyVisa900,svText=SV.def.text;
SV.def.text=function(l,d){
 var t=typeof svText==='function'?svText.apply(this,arguments):svText||'',o=l.flags.studyVisa900;
 if(!o||t.indexOf('Điều kiện xin visa:')>=0)return t;
 var f=A.file(l,o.country),lang=A.language(l,o.country),need=visaNeed(l,o),lines=[];
 lines.push(needLine(l,'Học phí còn lại: '+(o.unpaid919>0?'thiếu '+H.money(l,o.unpaid919):'đã dự trù đủ'),o.unpaid919>0?0:1,1));
 lines.push(needLine(l,'Giấy tờ '+f.documents+'/3 (cần ít nhất 1)',f.documents,1));
 lines.push(needLine(l,'Kế hoạch học '+f.plan+'/3 (cần ít nhất 1)',f.plan,1));
 lines.push(needLine(l,'Ngoại ngữ cấp '+lang+' (cần cấp 2)',lang,2));
 lines.push(needLine(l,'Quỹ sinh hoạt: cần '+H.money(l,need)+', đang có '+H.money(l,l.money)+(l.money<need?' (thiếu '+H.money(l,need-l.money)+')':''),l.money,need));
 return t+'\nĐiều kiện xin visa:\n'+lines.join('\n')+(o.attempt===l.age?'\nBạn đã xin visa năm nay; có thể xin lại sang năm.':'')+(alive(l)&&l.money<need?'\nBạn có thể xin hoặc mượn bố mẹ để đủ quỹ.':'');
};
function visaAsk(l,r,log,mode){var o=l.flags.studyVisa900;if(!o)return;ask(l,r,log,visaShortfall(l,o),mode,'visa');X.next(l,'studyVisa900',r);}
E.FUND890={state:state,capacity:capacity,chance:chance,ask:ask,alive:alive,annual:annual,tuitionShortfall:tuitionShortfall,visaShortfall:visaShortfall,visaNeed:visaNeed,visaAsk:visaAsk,askedThisYear:askedThisYear};
})(globalThis.G);

/* Appearance (player, partner, children), social fame at work, looks care and extra health services. */
(function(G){'use strict';
var E=G.E,H=E.H,U=G.U,X=E.UPDATE110;
function real(l){return !!l&&['vn','world'].includes(l.mode);}
function hash(s){var n=2166136261;s=String(s);for(var i=0;i<s.length;i++)n=Math.imul(n^s.charCodeAt(i),16777619);return n>>>0;}
function roll(seed){var a=hash(seed+':a')/4294967296,b=hash(seed+':b')/4294967296,c=hash(seed+':c')/4294967296;return Math.round(U.clamp(52+(a+b+c-1.5)*30,15,95));}
function state(l){return l.flags.looks134||(l.flags.looks134={});}
// Player, partner and children each keep their own score; old saves get a stable score on first read.
function looks(l){if(l.looks134==null)l.looks134=roll((l.id||'')+':'+l.name+':'+l.birthYear);return l.looks134;}
function partnerLooks(l,p){if(!p)return null;if(p.looks134==null)p.looks134=roll((p.name||'')+':'+(p.since==null?'':p.since)+':'+(p.age==null?'':p.age));return p.looks134;}
function kidLooks(l,k){if(!k)return null;if(k.looks134==null){var other=l.partner&&k.coParent108&&l.partner.relation108===k.coParent108.id?partnerLooks(l,l.partner):52,base=(k.adopted||k.adopt)?roll(k.name+':adopt'):(looks(l)+other)/2;k.looks134=Math.round(U.clamp(base+(hash(k.name+':'+k.born)/4294967296-.5)*20,15,95));}return k.looks134;}
function label(v,sex){v=Math.round(v);return v<40?'Kém hấp dẫn':v<60?'Bình thường':v<80?'Ưa nhìn':v>=90?'Cực phẩm':sex==='M'?'Đẹp trai, hấp dẫn':sex==='F'?'Xinh đẹp, hấp dẫn':'Rất đẹp, hấp dẫn';}
function text(v,sex){return 'ngoại hình '+Math.round(v)+'/100 · '+label(v,sex);}
function add(o,key,n){o[key]=Math.round(U.clamp((o[key]==null?52:o[key])+n,0,100));}
function gainLeft(holder,key,cap){var s=holder.looksGain134||(holder.looksGain134={});if(s.at!==key)holder.looksGain134=s={at:key,n:0};return cap-s.n;}
// Activities add +3/+5 a year but cannot stack beyond a yearly cap.
function improve(l,holder,n,cap){var left=gainLeft(holder,l.age,cap),v=Math.max(0,Math.min(n,left));if(v>0){holder.looksGain134.n+=v;add(holder,'looks134',v);}return v;}
function loveBonus(l){return (looks(l)-50)/400;}
function followerFactor(l){return .8+looks(l)/250;}
var IMAGE=/diễn viên|ca sĩ|người mẫu|mc|dẫn chương trình|idol|thần tượng|kol|influencer|tiếp viên|streamer|youtuber|tiktoker|sáng tạo nội dung|hoa hậu|vũ công|lễ tân|quảng cáo|biên tập viên truyền hình|phát thanh viên|bán hàng/i;
function imageJob(l){if(!l.job)return false;var t='';try{t=E.jobTitle(l)||'';}catch(e){}return IMAGE.test(t+' '+(l.job.id||''));}
function social(l){var s=l.flags.social131,ch=s&&s.channels||[],followers=ch.reduce(function(a,c){return a+(c.followers||0);},0),rep=ch.length?ch.reduce(function(a,c){return a+(c.reputation||50);},0)/ch.length:50;return {channels:ch,followers:followers,rep:rep,fame:followers>=10000?Math.min(1,Math.log10(followers/10000+1)/2):0};}
function owner(l){return !!(E.BUSINESS123&&E.BUSINESS123.equity&&E.BUSINESS123.equity(l)>0)||!!(l.job&&/^kd_/.test(l.job.id||''))||!!l.flags.selfRun;}
function year(l,r,log,a){if(!real(l)||!l.alive)return;var s=state(l);if(s.year===a)return;s.year=a;
 // Natural ageing of looks; good health slows it.
 [[l,l.age],[l.partner,l.partner&&l.partner.age]].forEach(function(x){var o=x[0],age=x[1];if(!o||o.alive===false||age==null)return;if(o===l)looks(l);else partnerLooks(l,o);if(age>=45&&r()<(l.st.hea>=70&&o===l?.3:.5))add(o,'looks134',-1);if(age>=65&&r()<.5)add(o,'looks134',-1);});
 if(l.st.hea<35)add(l,'looks134',-1);
 (l.kids||[]).forEach(function(k){if(k.alive!==false)kidLooks(l,k);});
 var inc=Number.isFinite(l.income)?l.income:0,v=looks(l);
 if(l.age>=18&&inc>0&&imageJob(l)){var k=v>=60?(v-55)/300:v<40?-(40-v)/400:0;if(k){var amount=inc*k;if(amount<0)amount=-Math.min(l.money>0?l.money:0,-amount);if(amount){H.cash(l,amount,k>0?'Ưu ái nhờ ngoại hình trong công việc':'Ít cơ hội hơn ở công việc cần hình ảnh');log(k>0?'Ngoại hình '+label(v,l.sex).toLowerCase()+' giúp bạn được ưu ái hơn trong công việc cần hình ảnh: thêm '+H.money(l,amount)+'.':'Công việc cần hình ảnh ít giao vai, ít hợp đồng cho bạn hơn năm nay ('+H.money(l,-amount)+').',k>0?'good':'neutral');}}}
 // Social fame spills into the current job or business, both ways.
 var f=social(l);if(l.age<18||!f.fame||!(l.job||owner(l)))return;
 var scandal=r()<.04+(f.rep<40?.12:0);
 if(scandal){H.fx(l,{hap:-6});if(l.mind)l.mind.stress=U.clamp(l.mind.stress+8,0,100);f.channels.forEach(function(c){c.reputation=U.clamp((c.reputation||50)-8,0,100);c.followers=Math.floor((c.followers||0)*.9);});
  if(owner(l)){var loss=Math.min(Math.max(0,l.money),l.base*f.fame);if(loss>0)H.cash(l,-loss,'Khách hàng quay lưng sau ồn ào trên mạng');log('Một ồn ào trên mạng xã hội khiến một phần khách hàng quay lưng; việc kinh doanh hụt '+H.money(l,loss)+' và kênh mất bớt người theo dõi.','bad');}
  else log('Một phát ngôn trên mạng xã hội gây tranh cãi. Cấp trên nhắc nhở, đồng nghiệp bàn tán và kênh mất bớt người theo dõi.','bad');return;}
 var bonus=owner(l)?l.base*f.fame*(.5+f.rep/100)*1.5:inc*.08*f.fame*(imageJob(l)?2:1);if(bonus<=0)return;
 H.cash(l,bonus,owner(l)?'Doanh thu tăng nhờ người theo dõi trên mạng xã hội':'Hợp đồng quảng bá nhờ mạng xã hội');H.fx(l,{soc:1});
 log('Nhờ '+f.followers.toLocaleString('vi-VN')+' người theo dõi trên mạng xã hội, '+(owner(l)?'việc kinh doanh có thêm khách và đơn hàng':'bạn nhận thêm hợp đồng quảng bá, được chú ý hơn ở nơi làm việc')+': thêm '+H.money(l,bonus)+'.','good');}
E.HOOKS.year.push(year);

function free(l){return X.reason(l,12);}
function adult(l){return X.reason(l,18);}
function cost(l,k){return l.base*k;}
function annual(l,key){var s=state(l);return (s.done||(s.done={}))[key]!==l.age;}
function mark(l,key){(state(l).done||(state(l).done={}))[key]=l.age;}
function pay(l,k,why){var c=cost(l,k);if(l.money<c)return false;H.cash(l,-c,why);return true;}
function row(l,key,label,k,ok,run,menu){var c=cost(l,k);return{k:key,l:label+(k?' · '+H.money(l,c):''),why:!annual(l,key)?'Đã làm năm nay':ok!==true?ok:k&&l.money<c?'Chưa đủ tiền':true,run:function(l,r,log){if(!annual(l,key)||k&&!pay(l,k,label))return;mark(l,key);run(l,r,log);X.next(l,menu,r);}};}
function gained(l,holder,n,who,how,log){var v=improve(l,holder,n,10);log(v?how+'; '+who+' ngoại hình +'+v+' (hiện '+Math.round(holder.looks134)+'/100).':how+'; năm nay '+who+' đã chăm chút đủ, ngoại hình chưa đổi thêm.','good');}
X.menu('looks134','Chăm sóc ngoại hình',free,function(l){return 'Bạn: '+text(looks(l),l.sex)+'. Mỗi hoạt động một lần/năm; tổng cộng tăng tối đa +10 điểm/năm cho mỗi người. Ngoại hình ảnh hưởng chuyện tình cảm, lượng người theo dõi và công việc cần hình ảnh.';},function(l){var me=[
 row(l,'diet','Ăn kiêng, ăn healthy',.02,true,function(l,r,log){H.fx(l,{hea:2});gained(l,l,3,'bạn','Bạn giữ thực đơn lành mạnh cả năm',log);},'looks134'),
 row(l,'gym','Tập thể dục, yoga',.01,true,function(l,r,log){H.fx(l,{hea:3,hap:1});if(l.mind)l.mind.stress=Math.max(0,l.mind.stress-3);gained(l,l,3,'bạn','Bạn tập đều đặn mỗi tuần',log);},'looks134'),
 row(l,'pt','Thuê PT riêng',.12,adult(l),function(l,r,log){H.fx(l,{hea:3});gained(l,l,5,'bạn','Huấn luyện viên riêng lên lịch tập và ăn uống cho bạn',log);},'looks134'),
 row(l,'spa','Đi spa, chăm sóc da',.05,adult(l),function(l,r,log){H.fx(l,{hap:2});gained(l,l,3,'bạn','Bạn chăm sóc da và tóc định kỳ',log);},'looks134'),
 row(l,'surgery','Phẫu thuật thẩm mỹ',.8,adult(l),function(l,r,log){if(r()<.08){H.fx(l,{hea:-8,hap:-5});add(l,'looks134',-3);log('Ca phẫu thuật thẩm mỹ gặp biến chứng, phải điều trị thêm nhiều tháng. Ngoại hình -3.','bad');}else gained(l,l,5,'bạn','Ca phẫu thuật thẩm mỹ thành công sau thời gian hồi phục',log);},'looks134')];
 var p=l.partner;if(p&&p.alive!==false&&p.age>=18){partnerLooks(l,p);me.push(row(l,'p_gym','Rủ '+p.name+' cùng tập thể dục ('+Math.round(p.looks134)+'/100)',0,true,function(l,r,log){if(r()<.7){p.close=U.clamp((p.close==null?60:p.close)+2,0,100);gained(l,p,3,p.name,p.name+' đồng ý tập cùng bạn',log);}else log(p.name+' chưa muốn tập lúc này.','neutral');},'looks134'),row(l,'p_pt','Thuê PT riêng cho '+p.name,.12,true,function(l,r,log){gained(l,p,5,p.name,p.name+' tập với huấn luyện viên riêng',log);},'looks134'));}
 (l.kids||[]).forEach(function(k){var a=l.age-k.born;if(k.alive===false||a<12||!E.FAMILY100||!E.FAMILY100.localChild(l,k))return;kidLooks(l,k);me.push(row(l,'k_gym_'+k.parentId,'Khuyên '+k.name+' tập thể dục ('+Math.round(k.looks134)+'/100)',0,true,function(l,r,log){if(r()<.65){gained(l,k,3,k.name,k.name+' chịu khó vận động hơn',log);}else{k.close=U.clamp((k.close||50)-1,0,100);log(k.name+' chưa nghe lời khuyên lần này.','neutral');}},'looks134'),row(l,'k_pt_'+k.parentId,'Thuê PT riêng cho '+k.name,.1,true,function(l,r,log){gained(l,k,5,k.name,k.name+' tập với huấn luyện viên riêng',log);},'looks134'));});
 return me;},12,'Sức khỏe & ngoại hình');

function ill(l){return l.ill&&l.ill.n?l.ill:null;}
X.menu('health134','Nha sĩ, tái khám và điều trị',free,function(l){var x=ill(l);return 'Sức khỏe '+Math.round(l.st.hea)+'/100'+(x?'. Đang mắc '+x.n+(x.treated?' (đã điều trị: '+({best:'điều trị tốt nhất',basic:'điều trị cơ bản'}[x.treated]||'chưa điều trị')+')':'')+'.':'. Hiện không có bệnh cần điều trị.')+' Mỗi dịch vụ một lần/năm; chi phí trừ thật.';},function(l){var x=ill(l);return [
 row(l,'dentist','Đi nha sĩ, khám răng',.015,true,function(l,r,log){H.fx(l,{hea:1});improve(l,l,1,10);log('Bạn cạo vôi, khám răng định kỳ. Răng chắc khỏe, nụ cười tự tin hơn.','good');},'health134'),
 row(l,'recheck','Tái khám theo lịch',.03,x&&x.treated&&x.treated!=='none'?true:'Cần đang điều trị một bệnh',function(l,r,log){x.cure=Math.min(.95,x.cure*1.15);x.mult=Math.max(1,1+(x.mult-1)*.9);H.fx(l,{hea:1});log('Bạn tái khám đúng hẹn; bác sĩ điều chỉnh thuốc cho '+x.n+'.','good');},'health134'),
 row(l,'hospital','Nhập viện điều trị',.25,x?true:'Chỉ khi đang mắc bệnh',function(l,r,log){x.cure=Math.min(.95,x.cure*1.3);x.mult=Math.max(1,1+(x.mult-1)*.7);H.fx(l,{hea:4,hap:-2});log('Bạn nhập viện điều trị '+x.n+' vài tuần dưới sự theo dõi của bác sĩ.','good');},'health134'),
 row(l,'surgery','Phẫu thuật và phục hồi chức năng',.6,x||l.st.hea<45?true:'Chỉ khi có bệnh hoặc sức khỏe yếu',function(l,r,log){if(r()<.8){if(x){x.cure=Math.min(.95,x.cure+.2);x.mult=Math.max(1,1+(x.mult-1)*.5);}H.fx(l,{hea:8});log('Ca phẫu thuật thành công. Sau những tuần tập phục hồi chức năng, bạn đi lại và sinh hoạt tốt hơn.','good');}else{H.fx(l,{hea:-5,hap:-3});log('Ca phẫu thuật không đạt như kỳ vọng; bạn cần thêm thời gian phục hồi.','bad');}},'health134')];},12,'Sức khỏe & ngoại hình');

E.LOOKS134={looks:looks,partnerLooks:partnerLooks,kidLooks:kidLooks,label:label,text:text,improve:improve,loveBonus:loveBonus,followerFactor:followerFactor,imageJob:imageJob,social:social,year:year};
})(globalThis.G);

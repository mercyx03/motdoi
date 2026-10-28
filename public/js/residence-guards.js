/* Explicit residence rules: institutions are local; heritage and remote contact are not. */
(function(G){'use strict';var E=G.E,H=E.H,U=G.U;
function here(l){return H.resCode(l);}
function local(l){return here(l)==='VN';}
var rules={};
function scope(id,policy,stamp){var d=E.DEC[id];if(!d)return;rules[id]=policy;var valid=d.valid,make=d.make,apply=d.apply;
 d.make=function(l){var out=make.apply(this,arguments);if(stamp&&out){out.data=out.data||{};out.data.residence897=here(l);}return out;};
 d.valid=function(l,data){return policy(l,data)&&(!stamp||!data||!data.residence897||data.residence897===here(l))&&(!valid||valid.apply(this,arguments));};
 d.apply=function(l,dec,k,r,log){if(!d.valid(l,dec.data||{})){log('Nơi cư trú hoặc điều kiện tham gia đã thay đổi. Chưa thực hiện và chưa thu tiền; hãy mở lại việc phù hợp nơi đang sống.','neutral');return;}return apply.apply(this,arguments);};
 E.TRIG.filter(function(t){return t.id===id;}).forEach(function(t){var w=t.when;t.when=function(l){return policy(l)&&w.apply(this,arguments);};});
 E.ACT.filter(function(a){return (a.sc||a.id)===id;}).forEach(function(a){var av=a.avail;a.avail=function(l){return policy(l)?av?av.apply(this,arguments):true:'Cần đúng nơi cư trú và đủ điều kiện của cơ quan / chương trình';};});
}
['doi_tuyen54','study_team54','study_contest54','study_special54','study_wishes54','thi_hsg','contests111','direct111','officer111','stateEmployer123','posting122','bau_cu'].forEach(function(id){scope(id,local,true);});
Object.keys(E.DEC).filter(function(id){return /^(civic106_|civic118|civicWork118|state174_|stateCareer174|stateWork174|stateTransfer174|stateParty174)/.test(id);}).forEach(function(id){scope(id,local,true);});
['service107_rescue','service107_campaign','service107_review','service107_post'].forEach(function(id){scope(id,function(l){var m=l.flags.world120&&l.flags.world120.mission;return local(l)||['service107_review','service107_post'].includes(id)&&!!(m&&m.until>=l.age&&E.WORLD120.officer(l));},true);});
scope('election122',function(l){return here(l)===l.country;},true);scope('law122',function(){return true;},true);
Object.keys(E.DEC).filter(function(id){return /^qg_/.test(id);}).forEach(function(id){scope(id,function(){return true;},true);});
['bo_tuc','bo_tuc_xong'].forEach(function(id){scope(id,function(){return true;},true);});
scope('viec_remote',function(l){return E.UPDATE110.free(l,18)&&!!l.abroad&&l.abroad.perm;},false);
// The artist's nationality does not teleport the listener. Watching remotely
// remains possible; attendance requires the actual destination and travel budget.
var concert=E.DEC.concert_di;if(concert){var prep=concert.def.prep,text=concert.def.text,oldApply=concert.apply;
 concert.def.prep=function(l,r,arg){var d=prep.apply(this,arguments),from=here(l),vn=['vn','rapvn','show'].includes(d.cat),cityCode=null;
  Object.keys(G.W.BY).some(function(code){if(G.W.BY[code].cities.includes(d.city)){cityCode=code;return true;}return false;});
  if(vn){if(cityCode!=='VN')d.city=G.W.BY.VN.cities[0];cityCode='VN';}else if(l.abroad&&l.country!=='VN'){cityCode=from;d.city=G.W.BY[from].cities[0];}
  d.destination897=cityCode||from;d.residence897=from;d.far=d.destination897!==from;
  if(d.far)d.trip=Math.max(d.trip,1+.2/Math.max(.001,d.price));else d.trip=1;
  return d;
 };
 concert.def.text=function(l,d){return text(l,d)+(d.destination897!==here(l)?' Điểm đến '+(G.W.BY[d.destination897]||{}).name+'; dự toán đã gồm đi lại và lưu trú khứ hồi. Xem trực tuyến không cần chuyến đi.':'');};
 concert.def.opts.forEach(function(o){if(o.k==='stream')return;var req=o.req;o.req=function(l,d){if(req&&!req(l,d))return false;if(d.far&&l.age<18&&o.k!=='parents')return false;if(o.k==='parents'&&l.abroad&&!E.parentsWithYouAbroad(l))return false;return !d.far||E.MOBILITY122.barrier(l,d.destination897,false)===true;};});
 concert.valid=function(l,d){return !!d&&d.residence897===here(l);};
 concert.apply=function(l,d,k,r,log){if(!concert.valid(l,d.data)){log('Bạn đã đổi nơi ở; hãy mở lại kế hoạch concert để xem chi phí từ nơi mới. Chưa thu tiền.','neutral');return;}if(k!=='stream'&&d.data.far&&E.MOBILITY122.barrier(l,d.data.destination897,false)!==true){log('Chưa thể đi theo điều kiện xuất nhập cảnh hiện tại; bạn vẫn có thể xem trực tuyến. Chưa thu tiền.','neutral');return;}return oldApply.apply(this,arguments);};
}
// Adult school is available locally abroad, but an old in-person enrolment
// cannot keep charging or award a degree after moving to another country.
var gdtx=E.GDTX84&&E.GDTX84.yearHook;if(gdtx){var i=E.HOOKS.year.indexOf(gdtx);if(i>=0)E.HOOKS.year[i]=function(l,r,log,a){var g=l.flags.gdtx;if(g&&g.country897&&g.country897!==here(l)){g.paused897=true;if(g.pauseAt897!==a){g.pauseAt897=a;g.until++;g.pauseYears897=(g.pauseYears897||0)+1;}log('Chương trình phổ thông buổi tối tại '+(G.W.BY[g.country897]||{}).name+' được bảo lưu khi bạn chuyển quốc gia; không thu học phí hay tự cấp bằng.','neutral');return;}if(g)g.paused897=false;return gdtx.apply(this,arguments);};}
var adultSchool=E.DEC.bo_tuc;if(adultSchool){adultSchool.def.opts.forEach(function(o){if(o.k==='no')return;var label=o.l,hint=o.h;o.l=function(l,d){return local(l)?typeof label==='function'?label(l,d):label:({thcs:'Học bậc trung học cơ sở tại nơi cư trú',lien:'Hoàn thiện phổ thông tại nơi cư trú',thpt:'Học bậc trung học phổ thông tại nơi cư trú'})[o.k]||'Học phổ thông tại nơi cư trú';};o.h=function(l,d){return local(l)?typeof hint==='function'?hint(l,d):hint:'Thời gian và kết quả theo mô hình chương trình tại nơi đang sống; không tự cấp chứng chỉ Việt Nam.';};});}
E.UPDATE110.menu('adultSchoolTransfer897','Chương trình phổ thông đang bảo lưu',function(l){var g=l.flags.gdtx;return E.UPDATE110.free(l,16)&&g&&g.country897!==here(l)?true:'Không có chương trình cần thu xếp sau khi chuyển nước';},'Bạn có thể giữ chỗ học ở nước cũ, hoặc dừng chương trình đó để tìm chương trình tại nơi đang sống. Kết quả đã đạt được giữ, thời gian bảo lưu không tự tính là đã học xong.',function(l){return [{k:'leave',l:'Dừng chương trình cũ và tìm lớp tại nơi cư trú',run:function(l,r,log){var g=l.flags.gdtx;(l.flags.pausedSchoolHistory897||(l.flags.pausedSchoolHistory897=[])).push(Object.assign({},g,{closed:l.age}));delete l.flags.gdtx;log('Đã giữ hồ sơ học cũ. Bạn xem lớp ở nơi mới trước khi đóng học phí.','neutral');E.UPDATE110.next(l,'bo_tuc',r);}},{k:'keep',l:'Tiếp tục bảo lưu, chưa đóng học phí nơi mới',run:function(){}}];},16,'Học tập');
var migrate=E.migrateExt;E.migrateExt=function(l){if(migrate)migrate(l);var p=l.flags.world120;if(p&&p.policy&&!p.policy.country897)p.policy.country897=l.country;var g=l.flags.gdtx;if(g&&!g.country897)g.country897=l.country;};
E.RESIDENCE897={here:here,rules:rules};
})(globalThis.G);

/* Shared guarded menus for the long-life expansion. */
(function(G){'use strict';var E=G.E,H=E.H;
function s(l){return l.flags.expansion110||(l.flags.expansion110={});}
function p(l){return l.flags.expansion110||{};}
function free(l,min){return l&&l.alive&&['vn','world'].includes(l.mode)&&l.age>=(min==null?18:min)&&E.FAMILY53.free(l);}
function uid(l,o){if(!o.uid110)o.uid110=l.id+':110:'+(s(l).serial=(s(l).serial||0)+1);return o.uid110;}
function log(l,t,k){l.log.push({a:l.age,y:l.birthYear+l.age,t:t,k:k||'neutral'});}
function next(l,id,r,arg,o){var d=E.DEC[id].make(l,r,arg);d.manual=o&&o.manual!=null?!!o.manual:true;l.pending.unshift(d);} // GĐ6: {manual:false} cho chuyện hệ thống tự đưa tới, để chế độ Tự động không đứng chờ
function menu(id,title,why,text,choices,min,group){
 function valid(l,d){return why(l)===true&&(!d||d.data&&d.data.requested&&d.data.actionYear850===l.age||d.at==null||d.at===l.age&&!d.done);}
 function rows(l,d){return choices(l,d&&d.arg||d&&d.data&&d.data.arg||{}).slice(0,54);}
 E.SC(id,{title:title,prep:function(l,r,arg){var d={at:l.age,arg:arg||{},done:false};d.keys=rows(l,d).map(function(c){return c.k;});return d;},valid:valid,text:text,opts:Array.from({length:54},function(_,i){function c(l,d){return d&&d.keys?rows(l,d).find(function(c){return c.k===d.keys[i];}):null;}return {k:String(i),req:function(l,d){var x=c(l,d);return valid(l,d)&&!!x&&(!x.why||x.why===true);},l:function(l,d){var x=c(l,d);return x?x.l:'';},h:function(l,d){var x=c(l,d);return x&&x.h||'';},run:function(l,r,lg,d){var x=c(l,d);if(!valid(l,d)||!x||x.why&&x.why!==true)return;d.done=true;if(l.flags.actAt)delete l.flags.actAt[id];x.run(l,r,lg,d.arg);}};}).concat([{k:'cancel',l:'Để dịp khác',run:function(l,r,lg,d){if(d)d.done=true;if(l.flags.actAt)delete l.flags.actAt[id];}}])});
 E.DEC[id].auto=function(l,d,r){var x=rows(l,d).find(function(c){return !c.why||c.why===true;});return x&&d.data&&d.data.keys?String(d.data.keys.indexOf(x.k)):'cancel';};
 E.DEC[id].menu110=true;
 if(group)E.ACT.push({id:id,g:group,l:title,min:min==null?18:min,sc:id,avail:why,ai:function(){return 0;}});
}
function reason(l,min){return !l||!l.alive?'Cuộc đời đã kết thúc':l.age<min?'Cần đủ '+min+' tuổi':!E.FAMILY53.free(l)?'Cần được tự do đi lại':true;}
E.UPDATE110={state:s,peek:p,free:free,uid:uid,log:log,next:next,menu:menu,reason:reason};
})(globalThis.G);

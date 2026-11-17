'use strict';
const assert=require('node:assert/strict'),{gameContext}=require('./hardcore-isolation');
const G=gameContext(),E=G.E;
function life(country,year,age){
 const l=E.createLife({mode:'world',country,year:year-age,seed:963,noOrphan:true});
 Object.assign(l,{age,birthYear:year-age,alive:true,pending:[],school:null,abroad:null,urban:true,acts:0});
 l.money=l.base*20;
 Object.assign(l.fam,{mAlive:true,fAlive:true,noMom:false,noDad:false});
 delete l.flags.royal;
 return l;
}
const r=()=>.2;
for(const cc of ['VN','JP','GB','US','KR','FR','NG']){
 const l=life(cc,1966,16);
 assert.equal(l.birthYear,1950);
 assert.equal(E.H.pickIdol(r,l),null);
 if(E.CTX945.of(l).war>=3){assert(!E.act(l,'concert'));continue;}
 const d=E.act(l,'concert');
 assert(d&&d.opts.some(o=>o.k==='local'));
 assert(!d.opts.some(o=>['vn','us','kr','show','rapvn','rapus'].includes(o.k)));
 E.resolve(l,'local');
 const local=l.pending[0];
 assert(local.id==='musicLocal963'&&local.data.cc===cc&&local.data.year===1966);
 assert(!/idol|concert|livestream/i.test(local.text));
 const cash=l.money;
 E.resolve(l,'go');
 assert(l.money<cash);
 assert(!E.act(l,'fanmeeting'));
}
let l=life('JP',1966,16);
let d=E.DEC.musicLocal963.make(l,r);d.manual=true;l.pending=[d];
l.abroad={code:'US',perm:true};const cash=l.money;E.resolve(l,'go');assert.equal(l.money,cash);
for(const [name,year] of [['BIGBANG',2006],['BTS',2013],['BLACKPINK',2016],['BABYMONSTER',2024],['CORTIS',2025]]){
 const active=(y)=>E.artistsOf('kr',life('KR',y,20)).some(a=>a.n===name);
 assert(!active(year-1)&&active(year),name);
}
l=life('JP',1985,25);
assert(!E.ERA902.idBlocked('karaoke',l));
l.abroad={code:'VN',perm:true};
assert(E.ERA902.idBlocked('karaoke',l)&&!E.act(l,'karaoke'));
l=life('JP',1979,9);
d=E.DEC.giup_nha.make(l,r);assert.equal(d.title,'Nhà không ai nấu cơm');
l.flags.royal={c:'JP',tier:'direct'};
d.manual=true;d.data={};l.pending=[d];l=E.migrate(l);
assert.equal(l.pending[0].title,'Một ngày mẹ nghỉ dưỡng');
assert.match(l.pending[0].text,/Gia nhân lo bữa tối/);
E.resolve(l,'cook');
assert(l.log.some(x=>x.t.includes('Gia nhân chuẩn bị')));
assert(!l.log.some(x=>x.t.includes('cơm khê')));
assert.match(E.DEC.nau_com.make(l,r).text,/Đầu bếp đã thu xếp/);
l.flags.royal.quit=true;
assert.equal(E.DEC.nau_com.make(l,r).title,'Lần đầu vào bếp');
assert.equal(E.lifeNarrative('Nhà Grimaldi (nhân vật hư cấu). Đây là gia tộc hư cấu trong game.'),'Nhà Grimaldi.');
l.focus='work';assert.equal(E.currentFocus(l),'study');l.age=25;
assert(E.focusAllowed(l,'work'));l.jailUntil=27;assert.equal(E.currentFocus(l),'social');l.jailUntil=null;l.retired=true;assert(!E.focusAllowed(l,'work'));
console.log('PASS 9.6.3 country/year activities, music debut boundaries, royal childhood, old saves and focus');

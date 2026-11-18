'use strict';
const assert=require('node:assert/strict'),{gameContext}=require('./hardcore-isolation');
const G=gameContext(),E=G.E,C=E.CTX945,P=E.ERA920.POL;
let checks=0,locations=0;
function same(a,b,message){assert.equal(a,b,message);checks++;}
function life(cc,y,extra){return E.createLife(Object.assign({mode:cc==='VN'?'vn':'world',country:cc,year:y,seed:968,noOrphan:true},extra));}
// Every available country's settlement list and every Vietnamese region must resolve
// stable context in old/new periods, including names persisted in historical saves.
const years=[1900,1918,1939,1945,1950,1970,1990,2010,2023,2026];
for(const country of G.W.C.filter(c=>c.births>0)){
 const cities=country.code==='VN'?G.VN.P63.map(p=>p.city):country.cities;
 for(const city of cities){locations++;
  for(const y of years){
   const canonical=C.levelAt(country.code,y,city),label=P.rename({birthYear:y,age:0},city);
   const old=C.levelAt(country.code,y,label);
   for(const k of ['war','fam','epi','econ','dis','level']){
    assert(Number.isFinite(canonical[k])&&canonical[k]>=0&&canonical[k]<=3,country.code+' '+city+' '+y+' '+k);
    same(old[k],canonical[k],country.code+' '+label+' '+y+' '+k);
   }
  }
 }
 same(!!E.ERA920.at(country.code,1950),true,'historical indicators '+country.code);
}
for(const [city,samples] of [
 ['Saint Petersburg',[[1900,'Saint Petersburg'],[1913,'Saint Petersburg'],[1914,'Petrograd'],[1923,'Petrograd'],[1924,'Leningrad'],[1990,'Leningrad'],[1991,'Saint Petersburg']]],
 ['Volgograd',[[1900,'Tsaritsyn'],[1924,'Tsaritsyn'],[1925,'Stalingrad'],[1960,'Stalingrad'],[1961,'Volgograd']]],
 ['Astana',[[1900,'Akmolinsk'],[1960,'Akmolinsk'],[1961,'Tselinograd'],[1991,'Tselinograd'],[1992,'Akmola'],[1997,'Akmola'],[1998,'Astana'],[2020,'Nur-Sultan'],[2023,'Astana']]],
 ['Bishkek',[[1900,'Pishpek'],[1925,'Pishpek'],[1926,'Frunze'],[1990,'Frunze'],[1991,'Bishkek']]],
 ['Almaty',[[1900,'Verny'],[1920,'Verny'],[1921,'Alma-Ata'],[1993,'Almaty']]],
 ['Dushanbe',[[1900,'Dyushambe'],[1928,'Dyushambe'],[1929,'Stalinabad'],[1961,'Dushanbe']]],
 ['Huambo',[[1900,'Huambo'],[1927,'Huambo'],[1928,'Nova Lisboa'],[1975,'Huambo']]]
])for(const [y,name] of samples)same(P.rename({birthYear:y,age:0},city),name,city+' '+y);
const merged=G.VN.P34.find(p=>p.members.length>1&&p.members.every(m=>m.id!==p.id));
for(const [cc,city,y,label] of [['RU','Saint Petersburg',1950,'Leningrad'],['CD','Kinshasa',1980,'Zaire']]){
 const baby=life(cc,y,{city,urban:true});
 assert(baby.birthPlace.includes(label));assert(baby.log[0].t.includes(label),'first birth narrative uses historical place');
 baby.age=2026-y;same(baby.birthPlace.includes(label),true,'birthplace remains dated when current names change');
 assert(!E.placeText(baby).includes(label));
}
assert(merged);
for(const seed of [1,7,968]){
 const l=life('VN',1950,{variant:'34',prov:String(merged.id),seed});
 same(l.variant,'63');assert(merged.members.some(p=>p.name===l.prov.old),'province index must use selected source map');
 const world=life('VN',1950,{mode:'world',seed});same(world.variant,'63');
}
for(const cc of ['VN','US','JP','IN','NG','BR','FR']){
 const l=life(cc,1900,{urban:true});
 for(let q=1;q<=5;q++){
  // Actual generation across several family qualities/seeds, not just text removal.
  for(let seed=0;seed<20;seed++){
   const baby=life(cc,1900,{urban:true,seed:968+q*20+seed});
   for(const key of ['mJob','fJob'])assert(E.ERA902.parentJobAllowed(baby,baby.fam[key]),cc+' '+baby.fam[key]);
  }
 }
 for(const title of ['shipper','kỹ sư phần mềm','tài xế công nghệ','bán hàng online','người làm truyền hình'])same(E.ERA902.parentJobAllowed(l,title),false,title+' 1900');
 Object.assign(l,{age:20,school:null});
 Object.assign(l.fam,{elite:null,mAlive:true,mAge:30,mRet:false,mJob:'thất nghiệp',mInc:0});
 E.parentYear(l,()=>0,()=>{},'m');
 assert(E.ERA902.parentJobAllowed(l,l.fam.mJob),'new parent job must also follow current year');
 const saved=E.migrate(JSON.parse(JSON.stringify(l)));
 same(saved.birthYear,l.birthYear);same(saved.country,l.country);same(saved.fam.mJob,l.fam.mJob);
}
const hook=E.HOOKS.year.find(fn=>fn.toString().includes('m.polCC'));
assert(hook);
const emigrant=life('GB',1950);emigrant.age=9;emigrant.abroad={code:'CN',perm:false};
const logs=[];hook(emigrant,()=>.5,t=>logs.push(t));
same(emigrant.era920.polCC,'CN');assert(logs.some(t=>t.includes('nạn đói')));
delete emigrant.abroad;hook(emigrant,()=>.5,t=>logs.push(t));same(emigrant.era920.polCC,'GB');
// A queued wartime choice cannot apply its consequences after moving to safety.
const displaced=life('JP',1930);displaced.age=15;displaced.city='Tokyo';displaced.pending=[];
const event=E.DEC.ctx945_event.make(displaced,()=>.5,{kind:'shelter',y:1945,cc:'JP',city:'Tokyo'});
assert(E.DEC.ctx945_event.valid(displaced,event.data));
displaced.abroad={code:'US',perm:true};displaced.city='New York';
same(E.DEC.ctx945_event.valid(displaced,event.data),false);
const health=displaced.st.hea,cash=displaced.money;
E.DEC.ctx945_event.apply(displaced,event,event.opts[0].k,()=>0,()=>{});
same(displaced.st.hea,health);same(displaced.money,cash);same(displaced.alive,true);
console.log('PASS birth-era968: '+G.W.C.filter(c=>c.births>0).length+' countries, '+locations+' locations, '+checks+' context checks; province identity, parent careers, historical names, residence and saves');

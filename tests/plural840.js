'use strict';
const assert=require('node:assert/strict');
const E=require('./hardcore-isolation').gameContext().E, H=E.H, quiet=()=>{};
function life(c='SA',sex='M',city){
  const l=E.createLife({mode:'world',country:c,city,seed:840});
  Object.assign(l,{age:34,sex,orient:'straight',religion:'Hồi giáo',indep:true,alive:true,pending:[],jailUntil:null,money:l.base*10,abroad:null});
  l.partner={sex:sex==='M'?'F':'M',name:'An',age:32,status:'married',alive:true,since:28,close:80};
  return l;
}
function offered(l,id,k,arg){
  const d=E.DEC[id].make(l,()=>.2,arg),key=d.data.keys?String(d.data.keys.indexOf(k)):k;
  return d.opts.some(o=>o.k===key);
}
function choose(l,id,k,arg,r=()=>.2){
  const d=E.DEC[id].make(l,r,arg),key=d.data.keys?String(d.data.keys.indexOf(k)):k;
  assert(d.opts.some(o=>o.k===key),id+':'+k);E.DEC[id].apply(l,d,key,r,quiet);
}
const U='pluralUnion840',Home='pluralHome840',s=l=>l.flags.kin920.plural840;
function setup(l,form){
  choose(l,U,form);choose(l,U,'fair');
  if(form==='tribal'){l.age++;choose(l,U,'proof');choose(l,U,'fair');}
}
function propose(l){
  if(offered(l,U,'grounds'))choose(l,U,'grounds');
  choose(l,U,'meet');const p=s(l).intro;assert(p);choose(l,U,'ask:'+p.relation108);assert(s(l).proposal);return p;
}
{
  const old=H.stranger;
  try{
    H.stranger=(l,r,sex)=>sex==='M'?'Tên nam':'Tên nữ';
    for(const sex of ['M','F']){
      const l=life('VN',sex);l.flags.dating108={lo:24,hi:36,country:'local'};
      const expected=sex==='F'?'M':'F';
      choose(l,'network108','new');const p=l.flags.network108[0];assert.equal(p.sex,expected);assert.equal(p.name,expected==='M'?'Tên nam':'Tên nữ');
      l.flags.dating108.sex='M';const r=()=>.9,d=E.DEC.affair107.make(l,r);
      assert.equal(d.data.sex,'M');E.DEC.affair107.apply(l,d,'start',r,quiet);
      assert.equal(l.flags.affair107.person108.sex,'M');assert.equal(l.flags.affair107.name,'Tên nam');
    }
  }finally{H.stranger=old;}
}
for(const c of ['SA','AE','QA','KW','OM','BH','YE','JO','EG','ID','MY','PK','BD','DZ','IQ'])assert(E.PLURAL840.choices(life(c)).includes('muslim'),c);
for(const c of ['ZA','KE','UG','TZ','SN','ML','NE','TD','CM'])assert(E.PLURAL840.choices(life(c)).includes('custom'),c);
assert(!E.PLURAL840.choices(life('NG','M','Lagos')).includes('muslim'));assert(E.PLURAL840.choices(life('NG','M','Kano')).includes('muslim'));
assert(!E.PLURAL840.choices(life('IN','M','Dehradun')).includes('muslim'));assert(E.PLURAL840.choices(life('IN','F','Reckong Peo')).includes('tribal'));
assert.equal(E.PLURAL840.choices(life('NP')).length,0);assert.equal(E.PLURAL840.choices(life('CN','F','Lhasa'))[0],'social');
{
  const l=life('BT','F');setup(l,'social');propose(l);l.age++;choose(l,U,'finish');
  assert.equal(s(l).extra[0].union840.registered,false);
}
{
  let l=life();setup(l,'muslim');const p=propose(l);assert(!offered(l,U,'finish'));
  l=E.migrate(JSON.parse(JSON.stringify(l)));l.age++;choose(l,U,'finish');
  assert.equal(l.partner.name,'An');assert.equal(s(l).extra[0].relation108,p.relation108);
  assert.equal(E.PLURAL840.people(l).length,2);assert(!offered(l,U,'finish'));
  let ledger=s(l),pair=E.PLURAL840.pairs(l,ledger)[0],key=pair.f.ids.join(':');
  choose(l,Home,'time',{person:p.relation108});choose(l,Home,'talk',{pair:key});assert(!offered(l,Home,'talk',{pair:key}));
  assert(E.profile(l).jobInfo.some(t=>t.includes(p.name)&&t.includes('tin cậy')));
  const hook=E.HOOKS.year.find(f=>String(f).includes('planYear=plan')),balance=l.money;
  hook(l,()=>.99,quiet);assert(l.money<balance);const spent=l.money;hook(l,()=>.99,quiet);assert.equal(l.money,spent);
  assert.equal(Object.values(ledger.members).reduce((n,m)=>n+m.days,0),7);
  l.age++;choose(l,Home,'confirm',{leave:p.relation108});assert.equal(ledger.extra.length,0);assert.equal(ledger.history.length,1);
}
{
  const l=life('BD');setup(l,'muslim');propose(l);l.money=0;l.age++;choose(l,U,'finish');assert.equal(s(l).extra.length,0);
  const m=life('MY');m.partner.faith830={wedding:'civil'};assert(!offered(m,U,'muslim'));
}
console.log('PASS plural840: gender/name consistency, personal and regional law, consent, court review, cultural status, budgets, pair profiles, save round trip and exit');
{
  const l=life('SA');setup(l,'muslim');
  for(let i=0;i<3;i++){const applicant=propose(l);l.age++;choose(l,U,'finish');assert.equal(s(l).extra[i].relation108,applicant.relation108);}
  assert.equal(E.PLURAL840.people(l).length,4);l.age++;choose(l,U,'meet');assert(!offered(l,U,'ask:'+s(l).intro.relation108));
  const active=E.PLURAL840.people(l),pairs=E.PLURAL840.pairs(l,s(l));assert.equal(pairs.length,6);
  const [a,b]=active;const key=pairs[0].f.ids;
  l.kids=[{born:l.age-4,alive:true,coParent108:{id:a.relation108}},{born:l.age-6,alive:true,coParent108:{id:b.relation108}}];
  s(l).event={ids:key,kind:'kids',title:'Bất đồng về con',at:l.age};
  choose(l,'pluralEvent840','agree');assert(!s(l).event);assert.equal(s(l).rules.duties,'luân phiên');
  l.partner=null;E.beginYear(l);assert.equal(l.partner.relation108,b.relation108);assert.equal(E.PLURAL840.people(l).length,3);
}
{
  const l=life('ID');setup(l,'muslim');choose(l,U,'grounds');assert(!s(l).record.grounds);
  l.flags.medical839=E.RELATIONS108.person(l,l.partner);l.age++;choose(l,U,'grounds');assert(s(l).record.grounds);
  choose(l,U,'meet');const p=s(l).intro;
  let turns=0;choose(l,U,'ask:'+p.relation108,null,()=>turns++===0?0:.9999);assert(!s(l).proposal,'missing consent stops Indonesian route');
}
{
  const l=life('EG');setup(l,'muslim');choose(l,U,'meet');let turns=0;choose(l,U,'ask:'+s(l).intro.relation108,null,()=>turns++===0?0:.9999);
  assert(s(l).proposal&&!s(l).proposal.opinions[0].yes);l.age++;assert(!offered(l,U,'finish'));choose(l,U,'hearing');l.age++;choose(l,U,'finish');assert.equal(s(l).extra.length,1);
}
{
  const l=life('BT','F');setup(l,'social');const p=propose(l);l.age++;l.abroad={code:'CN',name:'Trung Quốc',perm:true};assert(!offered(l,U,'finish'));assert.equal(s(l).extra.length,0);
  delete l.abroad;l.flags.ambiguous101={n:'Dorji',sex:'M',age:29,at:l.age-1};l.flags.mapMo='Dorji';l.flags.dating108={sex:'F'};
  const d=E.DEC.map_mo101.make(l,()=>.99);assert.equal(d.data.sex,'M');assert.equal(d.data.n,'Dorji');assert.equal(d.data.age,30);
}
console.log('PASS four-spouse cap, pair independence, custody event, primary succession, objections, statutory evidence and saved dating identity');

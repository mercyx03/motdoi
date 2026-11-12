'use strict';
const assert=require('assert'),{gameContext}=require('./hardcore-isolation'),G=gameContext(),E=G.E,T=E.SPAIN862,S=E.ROYAL858;
let n=0;function ok(v,m){assert(v,m);n++;}
function fixture(){const l=E.createLife({mode:'world',country:'ES',seed:87105,year:1970});Object.assign(l,{birthYear:1970,age:30,royalDate858:'2000-02-06',pending:[],sched:[]});const m=(id,sex,by)=>({id,name:id,sex,by,alive:true,titles:[]});const mother=m('player','F',1970),father=m('father','M',1968),a=m('a','F',1990),b=m('b','M',1995),half=m('half','F',1996);mother.player=true;a.parent=b.parent=half.parent='player';a.es862={parents:['player','father']};b.es862={parents:['father','player']};half.es862={parents:['player','someoneElse']};const h={cc:'ES',seat:'father',members:[mother,father,a,b,half]};l.flags.royal920={houses:{ES:h},met:{},ledger:[],rel:{}};for(const v of h.members)T.setNames(l,h,v,{given:[v.name],firstSurname:v===mother?'García':'Borbón',secondSurname:'Silva'});return {l,h,a,b,half};}
{
 const {l,h,a,b,half}=fixture();const id=l.id;let found=false;
 for(let i=0;i<50&&!found;i++){l.id=id+':'+i;h.es862.surnameCases871={};T.surnameCase871(l,h,a,'open');T.surnameCase871(l,h,a,'consent');let c=h.es862.surnameCases871['father|player'];if(c.status!=='hearing')continue;for(const v of [a,b])T.surnameCase871(l,h,a,'hear',v.id);found=Object.values(c.heard).every(v=>v.opinion==='đồng ý');}
 ok(found,'deterministic consenting fixture');const order=E.ROYAL920.order(l,h).map(v=>v.id).join(),halfName=T.names(l,h,half).legalSurname;
 ok(T.surnameCase871(l,h,a,'submit'),'all hearings permit submission');ok(!T.surnameCase871(l,h,a,'decision'),'not instant approval');ok(T.names(l,h,a).firstSurname==='Borbón','submission does not change legal name');
 l.age++;l.royalDate858='2001-02-06';const restored=JSON.parse(JSON.stringify(l));ok(T.surnameCase871(restored,restored.flags.royal920.houses.ES,restored.flags.royal920.houses.ES.members.find(v=>v.id==='a'),'decision'),'pending case survives save');ok(T.surnameCase871(l,h,a,'decision'),'explicit later decision');for(const v of [a,b])ok(T.names(l,h,v).firstSurname==='García'&&S.state(v).namesHistory.length>=2,'full siblings updated with history');ok(T.names(l,h,half).legalSurname===halfName,'half sibling untouched');ok(E.ROYAL920.order(l,h).map(v=>v.id).join()===order,'surname does not alter succession');const count=S.state(a).namesHistory.length;ok(!T.surnameCase871(l,h,a,'decision')&&S.state(a).namesHistory.length===count,'approval idempotent');
}
{
 const {l,h,a}=fixture();l.royalDate858='2000-02-05';ok(!T.surnameCase871(l,h,a,'open'),'before effective date blocked');l.royalDate858='2000-02-06';T.surnameCase871(l,h,a,'open');ok(!T.surnameCase871(l,h,a,'submit'),'no submission without consent and hearings');delete a.es862.parents;ok(!T.siblingGroup871(l,h,a),'missing filiation not invented');
}
{
 const {l,h,a}=fixture();const adult={id:'adult',name:'adult',sex:'M',by:1978,alive:true,titles:[],es862:{parents:['father','player']}};h.members.push(adult);T.setNames(l,h,adult,{given:['Adult'],firstSurname:'Borbón',secondSurname:'García'});const group=T.siblingGroup871(l,h,a);ok(group&&group.kids.length===2,'adult sibling does not block minors procedure');ok(!T.siblingGroup871(l,h,adult),'adult must use own surname procedure');
}
console.log('PASS spain-surname871: '+n+' checks');

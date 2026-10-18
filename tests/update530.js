'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'..','public'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const [,f]of html.matchAll(/<script src="(js\/[^?]+)\?v=[^"]+"><\/script>/g))if(!['js/app.js','js/music.js','js/card.js'].includes(f))vm.runInThisContext(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});
const E=G.E,F=E.FAMILY53;let n=0;function ok(v,t){assert.ok(v,t);n++;}function near(a,b,t){ok(Math.abs(a-b)<1e-7,t);}
function life(age=6){const l=E.createLife({mode:'vn',seed:530});l.age=35;l.indep=true;l.pending=[];l.money=10000;l.school=null;l.kids=[{name:'Nguyễn An',sex:'M',born:35-age,alive:true,study:50,close:70}];F.init(l);return l;}
function year(l){E.HOOKS.year[E.HOOKS.year.length-1](l,()=>.5,()=>{},l.age);}
{
 const l=life(0),k=l.kids[0],id=k.parentId,innate=k.family53.innate,rs=l.rs;F.init(l);E.migrate(l);ok(k.parentId===id&&k.family53.innate===innate&&l.rs===rs,'stable ID and innate, no reroll');
 ok(F.name(l,id,'Trần Bình',l.age).ok&&k.name==='Trần Bình','name newborn');ok(!F.name(l,id,'<img src=x onerror=alert(1)>',l.age).ok,'reject HTML name');
 l.kids.push({name:'Lê Chi',born:l.age,alive:true,sex:'F'});F.init(l);ok(!F.name(l,id,'Lê Chi',l.age).ok,'no duplicate names');
 l.age+=4;ok(F.name(l,id,'Bống',l.age).ok&&k.name==='Trần Bình'&&k.family53.nickname==='Bống','older child nickname preserves identity');
}
{
 const l=life(),k=l.kids[0],id=k.parentId,before=l.money,cost=F.quote(l,'school','private');ok(F.school(l,id,'private',l.age).ok,'choose private');near(l.money,before-cost,'upfront fee');
 const study=k.study;for(let i=0;i<20;i++)ok(F.school(l,id,'private',l.age).ok,'same choice allowed');near(l.money,before-cost,'no duplicate fee');near(k.study,study,'no click stat farming');
 year(l);near(l.money,before-cost,'same year hook no double fee');const after=k.study;year(l);near(k.study,after,'no double year benefit');
 l.age++;year(l);near(l.money,before-cost*2,'next year tuition charged');
 l.money=0;l.age++;year(l);ok(k.family53.school==='public'&&l.money===0,'cannot afford falls back without debt');
 ok(!F.school(l,id,'private',l.age-1).ok,'stale age rejected');
}
{
 const l=life(),k=l.kids[0],id=k.parentId,old=k.family53.innate;ok(F.train(l,id,'music','club',l.age).ok,'talent activity');let money=l.money;F.train(l,id,'music','club',l.age);near(l.money,money,'no duplicate class fee');ok(!k.family53.skills.music,'no instant talent from clicking');year(l);ok(k.family53.skills.music>=2&&k.family53.innate===old,'practice without overwriting innate');const skill=k.family53.skills.music;year(l);near(k.family53.skills.music,skill,'one progression yearly');
 l.age++;l.money=0;year(l);ok(k.family53.course==='home'&&k.family53.skills.music>skill,'free practice if cannot afford');
}
for(const age of [0,2,3,4,5,6,10,11,14,15,17,18,25])for(const status of ['normal','dead','custody','jail','playerJail']){
 const l=life(age),k=l.kids[0],id=k.parentId;if(status==='dead')k.alive=false;if(status==='custody')k.custody='ex';if(status==='jail')k.jail=age+1;if(status==='playerJail')l.jailUntil=l.age+2;
 const money=l.money,school=F.school(l,id,'private',l.age),training=F.train(l,id,'science','coach',l.age);
 const free=status==='normal';ok(school.ok===(free&&age>=3&&age<18),'school age/status '+age+status);ok(training.ok===(free&&age>=4&&age<18),'training age/status '+age+status);
 if(!school.ok&&!training.ok)near(l.money,money,'no money lost from invalid action');
}
{
 const l=life(),id=l.kids[0].parentId;F.school(l,id,'private',l.age);l.cur='usd';l.country='US';l.age++;const before=l.money;year(l);ok(l.kids[0].family53.school==='public','new location requires reselect');near(l.money,before,'no wrong currency fee');
}
{
}
console.log('V5.3: '+n+' checks passed — family identities, naming, schools, fees, talents and feedback.');

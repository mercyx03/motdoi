'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.join(__dirname,'..','public'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const [,f]of html.matchAll(/<script src="(js\/[^"?]+)\?v=[^"]+"[^>]*><\/script>/g))if(!['js/app.js','js/music.js','js/card.js','js/account.js'].includes(f))vm.runInThisContext(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});
const E=G.E;let n=0;function ok(v,t){assert.ok(v,t);n++;}
function life(spend){let l=E.createLife({mode:'vn',seed:541});l.age=28;l.school=null;l.indep=true;l.money=10000;l.pending=[];l.spend=spend;l.partner={name:'Nguyễn An',age:27,sex:'F',status:'dating',alive:true,close:80};return l;}
for(const spend of ['normal','save','lavish']){
 let l=life(spend),money=l.money;const d=E.DEC.hen_ho.make(l,()=>.5);ok(d.opts.some(x=>x.k==='doi'),'reroll available '+spend);ok(l.money===money&&l.pending.length===0,'price preview no real effect '+spend);
 E.DEC.hen_ho.apply(l,d,'doi',()=>.5,()=>{});ok(l.money===money&&l.pending[0].id==='hen_ho','reroll no recursion/no charge '+spend);
 const follow=l.pending.shift();ok(spend==='normal'||follow.data._service50,'rerolled menu retains pricing '+spend);
 E.DEC.hen_ho.apply(l,follow,'talk',()=>.5,()=>{});ok(l.money===money&&l.partner,'free romantic conversation '+spend);
 l=life(spend);const acted=E.act(l,'hen_ho');ok(acted&&acted.id==='hen_ho','actual activity opens '+spend);
}
ok(html.includes('id="feedbackBtn"')&&html.includes('id="feedbackLifeBtn"'),'feedback home and life restored');
ok(G.FEEDBACK&&typeof G.FEEDBACK.send==='function','direct feedback module restored');
for(const file of ['index.html','js/app.js','js/feedback.js','css/style.css'])ok(!fs.readFileSync(path.join(root,file),'utf8').includes(['blueflower1803','gmail.com'].join('@')),'recipient hidden '+file);
ok(!fs.readFileSync(path.join(root,'js/life59.js'),'utf8').includes('Tổ chức và tình huống đều hư cấu'),'removed repetitive disclaimer');
console.log('V5.4.1: '+n+' checks passed');

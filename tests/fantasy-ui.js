'use strict';
// UI controller tests using an inert document. No browser automation or network.
const fs=require('fs'),vm=require('vm'),assert=require('assert'),{gameContext}=require('./hardcore-isolation');
const G=gameContext(),store=new Map([['mkn.current','existing real-world life']]),elements={},screens=[];let checks=0;
function ok(x,s){checks++;assert(x,s);}
function element(id){return elements[id]||(elements[id]={id,innerHTML:'',hidden:false,handlers:{},classList:{values:new Set(),add(x){this.values.add(x);},remove(x){this.values.delete(x);}},addEventListener(k,f){this.handlers[k]=f;},focus(){},setSelectionRange(){}});}
const home=element('home');screens.push(home);const doc={createElement(){return element('fantasy-root');},body:{appendChild(x){screens.push(x);}},getElementById:element,querySelectorAll(){return screens;}};
const context={G,document:doc,localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},window:{scrollTo(){},confirm(){return true;}},console,Blob,URL:{createObjectURL(){return 'blob:test';},revokeObjectURL(){}},setTimeout:f=>f()};
vm.runInNewContext(fs.readFileSync('public/js/fantasy-ui.js','utf8'),context);
const root=elements['fantasy-root'],entry=elements.fantasyMode;
function click(fx,id){root.handlers.click({target:{closest(){return{dataset:{fx,id},disabled:false};}}});ok(!/undefined|NaN|\[object/.test(root.innerHTML),'clean rendered text for '+fx);}
entry.handlers.click();ok(/Fantasy gia tộc/.test(root.innerHTML)&&/Chào đời/.test(root.innerHTML),'independent birth setup renders');
elements.fxName={value:'<img src=x> Nhân vật thử'};elements.fxOrigin={value:'quytoc'};elements.fxGender={value:'F'};click('born');
ok(/&lt;img/.test(root.innerHTML)&&!root.innerHTML.includes('<img src=x>'),'player text escaped');
ok(root.innerHTML.includes('0 tuổi')&&root.innerHTML.includes('chưa đủ tuổi tự quyết'),'newborn perspective rendered');
for(let i=0;i<3;i++)click('advance');let l=JSON.parse(store.get('motdoi.fantasy.current.v1'));ok(l.age===3&&l.pending,'first child decision at age three');click('choose','0');
l=JSON.parse(store.get('motdoi.fantasy.current.v1'));l.age=20;l.ap=10;l.pending=null;l.level=31;l.points=100;l.gold=1000;l.location='lang';l.family.pressure=40;Object.keys(l.paths).forEach(k=>l.paths[k]=70);store.set('motdoi.fantasy.current.v1',JSON.stringify(l));entry.handlers.click();
for(const panel of ['map','train','bag','quest','clan','library']){click('tab',panel);ok(root.innerHTML.length>1500,'full '+panel+' panel renders');}
click('tab','train');click('train','kiem:basic');l=JSON.parse(store.get('motdoi.fantasy.current.v1'));ok(l.training.n===1&&l.paths.kiem>70,'training control reaches real engine');
click('tab','quest');click('join','vebinh');l=JSON.parse(store.get('motdoi.fantasy.current.v1'));ok(l.guild.id==='vebinh','guild control reaches real engine');
click('tab','map');click('travel','dong_co');click('hunt');ok(root.innerHTML.includes('Đối thủ phản công')&&root.innerHTML.includes('Tìm đường rút'),'battle controls render');
click('fight','guard');ok(store.has('motdoi.fantasy.current.v1'),'battle updates saved independently');
ok(store.get('mkn.current')==='existing real-world life','real-world saved life never overwritten');
click('home');ok(home.classList.values.has('active')&&!root.classList.values.has('active'),'return to original home');
console.log('PASS: '+checks+' Fantasy UI controller and save-isolation checks (no visual browser claim).');

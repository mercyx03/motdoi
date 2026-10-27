'use strict';
const assert=require('assert'),path=require('path'),{launch,page,sleep}=require('./lib/cdp');
const url=process.env.MOTDOI_URL||'http://localhost:8080/';
function seed(id){
 const E=G.E,l=E.createLife({mode:'vn',seed:1612});Object.assign(l,{age:30,alive:true,school:null,indep:true,money:l.base*100,edu:5,record:0,job:null,pending:[],yr:{items:[]}});l.flags.military=0;l.fam.mAlive=true;let arg={};
 if(id==='mediaStaff161'){E.SOCIAL131.state(l).channels.push({id:'youtube',app:'youtube',name:'Kênh kiểm thử',topic:'Học tập',followers:20000,reputation:60,engagement:40,equipment:1,staff:0,studio:0,totalRevenue:0});arg.id='youtube';}
 if(id==='traineeContract162'){l.age=15;l.school='THPT';l.indep=false;E.LIFE138.state(l).agency={name:'Aurora Entertainment (hư cấu)',code:'KR',status:'junior155',years:1,started:14};l.flags.idol155={stage:'junior',company:{name:'Aurora'},peers:[{uid110:'peer-test',name:'Bạn học',skill:50}],evals:[],debt:10,months:3};}
 if(id==='celebration129'||id==='familyTrip114')l.money=-l.base;
 const d=E.DEC[id].make(l,()=>.1,arg);d.manual=true;l.pending=[d];localStorage.setItem('mkn.current',JSON.stringify({life:l,cohort:[],auto:false,speed:1}));return true;
}
(async()=>{const chrome=await launch();let count=0;const errors=[];try{
 for(const width of [390,1280]){const p=await page(chrome,url,{width,height:950});await p.eval(async()=>{await MotDoiBoot.load();return true;});
  for(const [id,label] of [['mediaStaff161','Thuê Social Media Manager · 3 năm'],['traineeContract162','Tạm nghỉ vì học tập'],['celebration129','Đón Tết cùng gia đình · cùng chuẩn bị'],['familyTrip114','Đi dạo và nghỉ tại nhà']]){
   await p.eval(seed,id);await p.reload();await p.eval(async()=>{await MotDoiBoot.load();const b=document.querySelector('#resumeBtn');if(b)b.click();return true;});await sleep(400);
   assert(await p.eval(()=>document.documentElement.scrollWidth<=innerWidth+1),id+' overflow');
   assert(await p.eval(text=>{const b=[...document.querySelectorAll('.opt')].find(b=>b.innerText.includes(text));if(!b)return false;b.click();return true;},label),id+' button');await sleep(400);
   const state=await p.eval(()=>JSON.parse(localStorage.getItem('mkn.current')).life);
   if(id==='mediaStaff161')assert(state.flags.social131.channels[0].team161.some(p=>p.role==='social'&&p.status==='active'),'hired contract persisted');
   if(id==='traineeContract162')assert(state.flags.life138.agency.status==='paused162','pause persisted');
   if(id==='celebration129')assert(state.flags.family129.tet===state.age&&state.money===-state.base,'free celebration persisted');
   if(id==='familyTrip114')assert(state.flags.life114.tripAt===state.age&&state.money===-state.base,'free family time persisted');
   await p.screenshot(path.join(__dirname,'../.cache/contracts-'+id+'-'+width+'.png'));count++;
  }errors.push(...p.errors);p.close();
 }
}finally{await chrome.close();}assert.deepStrictEqual(errors,[]);console.log('PASS browser-contracts: '+count+' real UI actions, saved results, 390/1280px, no JS errors or horizontal overflow');})().catch(e=>{console.error(e);process.exit(1);});

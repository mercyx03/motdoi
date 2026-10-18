const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const out=path.resolve('promo/events-18-v2');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const page=await browser.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://localhost:8080');
 console.log(await page.evaluate(()=>G.E.SHOWS.map(s=>({k:s.k,n:s.n}))));
 const scenes=[['01-tinh-ha-say-hi','show',0],['02-anh-tai-vuot-ngan-chong-gai','show',1],['03-nguoi-ay-la-ai','dating'],['04-gia-nhap-doi-esports','esports'],['05-nang-khieu-fps','fps'],['06-ha-noi-cung-ban-gai','home','Hà Nội'],['07-hue-cung-gia-dinh','home','Thừa Thiên Huế'],['08-da-nang-di-dau-cung-ban-gai','place','Đà Nẵng'],['09-kien-giang-di-dau-cung-bo-me','place','Kiên Giang'],['10-truong-chuyen','school'],['11-dat-ten-cho-con','baby'],['12-chang-xam-hinh-va-ba-lao','job','tho_xam'],['13-nguoi-giao-hang','job','shipper'],['14-gia-tri-cong-nhan','job','cong_nhan'],['15-dac-san-hue-cung-ban-gai','food','Thừa Thiên Huế'],['16-dac-san-ha-noi-cung-bo-me','food','Hà Nội'],['17-dac-san-da-nang-cung-ban-gai','food','Đà Nẵng'],['18-dac-san-kien-giang-cung-bo-me','food','Kiên Giang']];
 const people=[['Trần Ngọc Hân','F','Hải Phòng',22],['Lê Hoàng Yến','F','Bình Định',26],['Phạm Tuấn Kiệt','M','TP. Hồ Chí Minh',25],['Đặng Đức Anh','M','Bắc Ninh',20],['Võ Gia Bảo','M','Đồng Nai',12],['Nguyễn Hữu Phúc','M','Hà Nội',23],['Hoàng Thùy Linh','F','Thừa Thiên Huế',27],['Trần Minh Khôi','M','Đà Nẵng',24],['Dương Bảo Ngọc','F','Kiên Giang',29],['Bùi Khánh Chi','F','Nam Định',15],['Đỗ Thanh Hà','F','Quảng Ninh',30],['Lý Quốc Huy','M','Lạng Sơn',28],['Phan Thành Đạt','M','Nghệ An',32],['Mai Văn Sơn','M','Bình Dương',35],['Ngô Nhật Minh','M','Thừa Thiên Huế',26],['Đinh Ngọc Mai','F','Hà Nội',31],['Hồ Anh Khoa','M','Đà Nẵng',22],['Lâm Phương Thảo','F','Kiên Giang',28]];
 const manifest=[];
 for(const [index,[name,type,arg]] of scenes.entries()){
 await page.evaluate(({type,arg,index,person})=>{
  localStorage.clear();const E=G.E,r=()=>.5;
  const l=E.createLife({mode:'vn',variant:'63',oldProv:person[2],name:person[0],gender:person[1]==='M'?'male':'female',orient:'straight',eth:'Kinh',seed:7300+index*137});
  l.sex=person[1];l.name=person[0];l.nameSub='';l.sur=l.name.split(' ')[0];l.age=person[3];l.alive=true;l.school=null;l.edu=3;l.indep=true;l.money=80+index*13;l.pending=[];l.kids=[];l.partner=null;l.yr={items:[]};l.job=null;
  const tourism=['home','place','food'].includes(type),party=[5,7,14,16].includes(index)?'partner':'parents';
  if(tourism){l.fam.mAlive=true;l.fam.fAlive=true;l.fam.noDad=false;if(party==='partner'){l.partner={name:['Nguyễn Mai Anh','Lê Thanh Trúc','Trần Nhã Uyên','Võ Ngọc Ánh'][[5,7,14,16].indexOf(index)],sex:'F',age:l.age-1,alive:true,status:'dating',since:l.age-2,close:85,job:'nhân viên văn phòng',inc:12};E.HOMETOWN.partner(l,l.partner);}else l.fam.noDad=false;}
  let d;
  if(type==='show'){const s=arg===1?E.SHOWS.find(x=>x.k==='atvncg24'):E.SHOWS.find(x=>/tinh|tình/i.test(x.k+' '+x.n))||E.SHOWS[3];d=E.DEC.bias_chon.make(l,r,{k:s.k,p:0});}
  if(type==='dating'){l.flags.nali={lead:'Nguyễn Khánh An',leadAge:24,leadJob:'giáo viên',score:0,left:5};d=E.DEC.hh_nali_m.make(l,r,{v:1});}
  if(type==='esports'){l.age=20;l.game='Liên Minh Huyền Thoại';l.skill=90;E.startJob(l,'tuyen_thu_es',r,()=>{});l.flags.esports.season={at:l.age,token:'promo',index:0,results:{}};d=E.DEC.es_recruit.make(l,r,{at:l.age,token:'promo'});}
  if(type==='fps'){l.age=12;l.indep=false;l.school='lower';l.talent='game';l.talentSub='FPS';l.flags.gamePicked=false;d=E.DEC.chon_game.make(l,r);}
  if(type==='home')d=E.DEC.que_doc.make(l,r);
  if(type==='place'||type==='food'){const start=E.DEC.que_doc.make(l,r);E.DEC.que_doc.apply(l,start,party,r,()=>{});d=l.pending[0];if(!d||d.id!=='que_di51')throw Error('Tour not started');if(type==='food'){E.DEC.que_di51.apply(l,d,'switch',r,()=>{});d=l.pending[0];}}
  if(type==='school'){l.age=15;l.indep=false;l.edu=2;l.school='lower';l.schoolEnd=15;l.st.kno=92;const hs=E.DEC.hs.make(l,r);E.DEC.hs.apply(l,hs,'special54',r,()=>{});d=l.pending[0];}
  if(type==='baby'){l.partner={name:'Trần Đức Long',sex:'M',age:32,alive:true,status:'married',since:27,close:90,job:'giáo viên',inc:12};d=E.DEC.kid.make(l,r);}
  if(type==='job'){l.age=28;E.startJob(l,arg,r,()=>{});l.job.yrs=4;d=E.DEC[{tho_xam:'dk_xam',shipper:'dk_ship',cong_nhan:'dk_cong_nhan'}[arg]].make(l,r);}
  if(!d)throw Error('Missing scene '+type);d.manual=true;l.pending=[d];
  localStorage.setItem('mkn.current',JSON.stringify({life:l,cohort:[],auto:false,speed:1}));
 },{type,arg,index,person:people[index]});
 await page.reload();await page.locator('#resumeBtn').click();await page.locator('[role=dialog]').waitFor();
 if(type==='baby'){await page.locator('[data-k=yes]').click();await page.locator('#babyName').waitFor();await page.locator('#babyName').fill('Trần Tuệ An');}
 await page.waitForTimeout(2700);
 const dialog=page.locator('[role=dialog]');const text=await dialog.innerText();
 const box=await dialog.boundingBox();if(box.y<0||box.y+box.height>1351)throw Error('Clipped '+name+' '+JSON.stringify(box));
 await page.screenshot({path:path.join(out,name+'.png')});
 manifest.push({file:name+'.png',person:people[index][0],seed:7300+index*137,text});console.log(name+' OK');
 }
 fs.writeFileSync(path.join(out,'scenes.json'),JSON.stringify(manifest,null,2));
 await browser.close();if(errors.length)throw Error(errors.join('\n'));console.log('18 screenshots complete.');
})().catch(e=>{console.error(e);process.exit(1);});

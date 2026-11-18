'use strict';
const assert=require('node:assert/strict'),{spawn}=require('node:child_process');
const expectedUpdates=require('../public/data/updates.json').entries,expectedBirth=expectedUpdates.find(e=>e.id==='birthplace-and-year-context-96800');
const {launch,page,sleep}=require('./lib/cdp');
const port=+process.env.PORT||8801,url='http://127.0.0.1:'+port+'/';
(async()=>{
 const server=spawn(process.execPath,['tools/serve.js'],{env:{...process.env,PORT:String(port),MOTDOI_ROOT:process.env.MOTDOI_ROOT||'dist'},stdio:'ignore',windowsHide:true});
 let browser;
 try{
  for(let i=0;i<80;i++){try{if((await fetch(url)).ok)break;}catch{}await sleep(100);}
  browser=await launch();
  for(const width of [390,1366]){
   const p=await page(browser,url,{width,height:950});
   try{
    await p.eval(()=>{localStorage.clear();});await p.reload();
    await p.eval(async()=>{await MotDoiBoot.load();});
    const vn=await p.eval(()=>{
     function choose(id,value){const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('change',{bubbles:true}));}
     const merged=G.VN.P34.find(p=>p.name==='TP. Hồ Chí Minh');if(!merged)throw Error('province fixture');
     choose('provSel',String(merged.id));choose('yearSel','1970');
     const ethnic=G.VN.ETH[1].name;choose('ethSel',ethnic);
     const selected=G.VN.P63.find(p=>String(p.id)===document.querySelector('#provSel').value);
     return {count:document.querySelector('#provSel').options.length,disabled:document.querySelector('[data-variant="34"]').disabled,
      member:merged.members.some(p=>p.id===selected.id),ethnic,profile:document.querySelector('#heroProfile').innerText,hint:document.querySelector('#provHint').innerText};
    });
    assert.equal(vn.count,64);assert(vn.disabled&&vn.member);assert(vn.profile.includes('Sài Gòn'));assert(vn.profile.includes(vn.ethnic));assert(!vn.hint.includes('1/7/2025'));
    const setup=await p.eval(()=>{
     function choose(id,value){const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('change',{bubbles:true}));}
     choose('yearSel','1900');const early=document.querySelector('#yearHint').innerText;
     document.querySelector('[data-mode="world"]').click();choose('countrySel','');const random=document.querySelector('#yearHint').innerText;
     choose('yearSel','1960');choose('countrySel','BD');const bd=document.querySelector('#yearHint').innerText;
     choose('countrySel','MM');const mm=document.querySelector('#countrySel').selectedOptions[0].textContent;
     choose('yearSel','1990');choose('countrySel','CD');
     return {early,random,bd,mm,profile:document.querySelector('#heroProfile').innerText,overflow:document.documentElement.scrollWidth>innerWidth+1};
    });
    assert(setup.early.includes('ước tính'));assert(!setup.random.includes('Việt Nam'));assert(setup.random.includes('được chọn khi chào đời'));
    assert(setup.bd.includes('Đông Pakistan'));assert(setup.mm.includes('Miến Điện'));assert(setup.profile.includes('Zaire'));assert(!setup.overflow);
    const dates=await p.eval(()=>{
     function choose(id,value){const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('change',{bubbles:true}));}
     choose('yearSel','1900');choose('countrySel','PK');
     const pk=document.querySelector('#countrySel').selectedOptions[0].textContent;
     const pkProfile=document.querySelector('#heroProfile').innerText;
     choose('yearSel','2025');choose('countrySel','UA');
     return {pk,pkProfile,ukraine:document.querySelector('#yearHint').innerText};
    });
    assert.match(dates.pk,/Ấn Độ thuộc Anh · nay là Pakistan/);
    assert.match(dates.pkProfile,/Ấn Độ thuộc Anh/);
    assert.match(dates.ukraine,/tấn công toàn diện/);
    const authority=await p.eval(()=>{
     const choose=(id,value)=>{const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('change',{bubbles:true}));};
     const hint=()=>document.querySelector('#yearHint').innerText;
     choose('countrySel','SG');choose('yearSel','1943');const occupied=hint();
     choose('yearSel','1945');const transition=hint();
     choose('countrySel','CD');choose('yearSel','2024');const congo2024=hint();
     choose('countrySel','UA');choose('yearSel','2025');
     return {occupied,transition,congo2024};
    });
    assert.match(authority.occupied,/chiếm đóng của Nhật Bản/);
    assert.doesNotMatch(authority.occupied,/thuộc địa của Anh/);
    assert.match(authority.transition,/quân quản Anh/);
    assert.match(authority.congo2024,/giao tranh leo thang ở Bắc Kivu/);
    assert.doesNotMatch(authority.congo2024,/chiếm Goma|vào Bukavu/);
    const regional=await p.eval(()=>{
     const choose=(id,value)=>{const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('change',{bubbles:true}));};
     const hint=()=>document.querySelector('#yearHint').innerText;
     choose('yearSel','1958');choose('countrySel','MY');choose('worldCitySel','Kuching');const kuching=hint();
     choose('worldCitySel','Kota Kinabalu');const jesselton=document.querySelector('#worldCitySel').selectedOptions[0].textContent;
     choose('worldCitySel','Kuala Lumpur');const malaya=hint();
     choose('countrySel','DE');choose('yearSel','1965');choose('worldCitySel','Đông Berlin');const east=hint();
     choose('worldCitySel','Tây Berlin');const west=hint();
     choose('yearSel','1990');const united=document.querySelector('#worldCitySel').value;
     choose('yearSel','1965');choose('worldCitySel','Dresden');
     const profile=document.querySelector('#heroProfile').innerText;
     const original=G.E.makeCohort;G.E.makeCohort=()=>[];
     let birth, saved;
     try{document.querySelector('#bornBtn').click();document.querySelector('#rollSkip').click();birth=document.querySelector('#birthWrap').innerText;saved=G.SaveStore.read('mkn.current').value.life;}
     finally {G.E.makeCohort=original;}
     return {kuching,jesselton,malaya,east,west,united,profile,birth,city:saved.birthCity,year:saved.birthYear,overflow:document.documentElement.scrollWidth>innerWidth+1};
    });
    assert.match(regional.kuching,/Sarawak trở thành thuộc địa của Anh/);
    assert.doesNotMatch(regional.kuching,/khẩn cấp Malaya/);
    assert.match(regional.jesselton,/Jesselton.*Bắc Borneo/);
    assert.match(regional.malaya,/khẩn cấp Malaya.*Liên bang Malaya độc lập/);
    assert.match(regional.east,/Đông Berlin.*hạn chế ra nước ngoài/);
    assert.match(regional.west,/Tây Berlin do Mỹ, Anh và Pháp quản lý/);
    assert.doesNotMatch(regional.west,/hạn chế ra nước ngoài/);
    assert.equal(regional.united,'Berlin');assert.equal(regional.city,'Dresden');assert.equal(regional.year,1965);
    assert.match(regional.profile,/Dresden, Đông Đức/);assert.match(regional.birth,/Dresden, Đông Đức/);assert(!regional.overflow);
    await p.reload();await p.eval(async()=>{await MotDoiBoot.load();});
    await p.eval(()=>{for(const [id,value] of [['countrySel','UA'],['yearSel','2025']]){const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('change',{bubbles:true}));}});
    const odds=await p.eval(()=>{
     function choose(id,value){const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('change',{bubbles:true}));}
     choose('yearSel','1900');
     const early=document.querySelector('#oddsSub').innerText;
     const first=document.querySelector('#oddsBars').innerText;
     choose('yearSel','2025');
     return {early,first,recent:document.querySelector('#oddsSub').innerText,last:document.querySelector('#oddsBars').innerText,title:document.querySelector('#oddsTitle').innerText};
    });
    assert.match(odds.early,/Ước tính theo tỷ trọng năm 1950/);
    assert.match(odds.recent,/dự phóng trung bình năm 2025/);
    assert.match(odds.title,/2025/);assert.notEqual(odds.first,odds.last);
    const datedCities=await p.eval(()=>{
     const P=G.E.ERA920.POL;
     return [P.cities('PH',1900).includes('Quezon City'),P.cities('PH',1939).includes('Quezon City'),P.cityLabel('UA',1950,'Dnipro'),P.cityLabel('UA',2025,'Dnipropetrovsk')];
    });
    assert.deepEqual(datedCities,[false,true,'Dnipropetrovsk','Dnipro']);
    const certificate=await p.eval(()=>{
     const engine=G.E, original=engine.makeCohort;
     engine.makeCohort=()=>[];
     try {
      document.querySelector('#bornBtn').click();document.querySelector('#rollSkip').click();
      return document.querySelector('#birthWrap .odds').textContent;
     } finally { engine.makeCohort=original; }
    });
    assert.match(certificate,/năm 2025.*Ukraine.*dự phóng trung bình năm 2025/);
    await p.reload();await p.eval(async()=>{await MotDoiBoot.load();});
    const moved=await p.eval(()=>{
     const choose=(id,value)=>{const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('change',{bubbles:true}));};
     choose('countrySel','PH');choose('yearSel','1900');
     const original=G.E.makeCohort;G.E.makeCohort=()=>[];
     try {document.querySelector('#bornBtn').click();const reel=document.querySelector('#reel1').textContent;document.querySelector('#rollSkip').click();return reel;}
     finally {G.E.makeCohort=original;}
    });
    assert.doesNotMatch(moved,/Quezon City/);
    await p.eval(()=>{
     const E=G.E,l=E.createLife({mode:'world',country:'GB',year:1935,seed:980});
     l.age=25;E.H.emigrate(l,['JP','Nhật Bản',G.W.BY.JP.pool],()=>.4,()=>{});
     G.SaveStore.write('mkn.current',{life:l,cohort:[],speed:1,auto:false});
    });
    await p.reload();await p.eval(async()=>{await MotDoiBoot.load();});
    const panel=await p.eval(()=>{document.querySelector('#resumeBtn').click();return document.querySelector('#placePanel').textContent;});
    assert.match(panel,/Anh/);assert.match(panel,/Nơi đang sống.*Nhật Bản.*Mức sinh · 1960/);
    const education=await p.eval(()=>{
     const E=G.E,l=E.createLife({mode:'world',country:'AF',city:'Kabul',year:2009,gender:'F',seed:984});
     Object.assign(l,{age:15,school:'lower',edu:1,pending:[],sched:[],ill:null,job:null});
     E.beginYear(l,{auto:false});
     const option=l.pending.find(d=>d.id==='afghanStudy984');
     return {school:l.school,offer:option?.opts.some(o=>/Tự học qua tài liệu/.test(o.l)),canReturn:E.CTX945.safeReturn('PS',2026,'Ramallah','Gaza')};
    });
    assert.deepEqual(education,{school:null,offer:true,canReturn:false});
    await p.load(url+'updates.html');
    const newest=await p.eval(()=>{
     const data=JSON.parse(document.querySelector('#updateHistoryData').textContent).entries;
     const text=document.querySelector('#updateTimeline').innerText;
     return {id:data[0].id, status:data[0].releaseStatus, count:data.filter(e=>e.releaseStatus==='packaged').length,text};
    });
    assert.equal(newest.id,expectedUpdates[0].id);
    assert.equal(newest.status,expectedUpdates[0].releaseStatus);
    assert.equal(newest.count,expectedUpdates.filter(e=>e.releaseStatus==='packaged').length);
    assert(newest.text.includes(expectedUpdates[0].title));
    assert(newest.text.includes(newest.status==='released'?'Đã phát hành':'Bản chuẩn bị'));
    if (expectedUpdates[0].version === '9.8.3') {
     const labels=await p.eval(()=>Array.from(document.querySelectorAll('#updateTimeline article')).slice(0,3).map(article=>{
      const stamp=article.querySelector('.update-date');
      return {label:stamp.querySelector('p').textContent,version:stamp.querySelector('p:last-child').textContent,dated:!!stamp.querySelector('time')};
     }));
     assert.deepEqual(labels,['9.8.3','9.8.2','9.8.1'].map(version=>{
      const entry=expectedUpdates.find(note=>note.version===version);
      return {label:'Đã phát hành',version,dated:!!entry.releasedAt};
     }));
    }
    const update=await p.eval(()=>{
     const data=JSON.parse(document.querySelector('#updateHistoryData').textContent).entries,search=document.querySelector('#updateSearch');
     document.querySelector('#moreUpdates')?.click();
     search.value='noi sinh va nam sinh';search.dispatchEvent(new Event('input',{bubbles:true}));
     const note=data.find(e=>e.id==='birthplace-and-year-context-96800');
     return {version:note.version,status:note.releaseStatus,unreleased:data.filter(e=>e.releaseStatus==='packaged').length,text:document.querySelector('#updateTimeline').innerText,overflow:document.documentElement.scrollWidth>innerWidth+1};
    });
    assert.equal(update.version,'9.6.8');assert.equal(update.status,expectedBirth.releaseStatus);
    assert.equal(update.unreleased,expectedUpdates.filter(e=>e.releaseStatus==='packaged').length);
    assert(update.text.includes(update.status==='released'?'Đã phát hành':'Bản chuẩn bị'));
    assert(update.text.includes('nơi sinh và năm sinh'));assert(!update.overflow);
    assert.deepEqual(p.errors,[]);console.log('PASS birth-era968-browser: region/year choices, historical names, preview, updates and layout '+width);
   }catch(error){console.error(p.errors);throw error;}finally{p.close();}
  }
 }finally{if(browser)await browser.close();server.kill();}
})().catch(error=>{console.error(error);process.exit(1);});

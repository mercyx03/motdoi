/* Homepage first: load the game only when its controls are needed. */
(function () {
  'use strict';
  var ready=false, flight=null, next=0, pending=false;
  var files=window.MOTDOI_GAME_FILES || Array.from(document.querySelectorAll('[data-game]')).map(function(s){return s.getAttribute('src');});
  function read(key, fallback){try{return JSON.parse(localStorage.getItem(key))||fallback;}catch(e){return fallback;}}
  var theme=read('mkn.theme',null);
  if(theme)document.documentElement.dataset.theme=theme;
  var poolNode=document.getElementById('startingProfiles');
  if(poolNode){
    var options=read('mkn.settings',{}),mode=options.mode==='world'?'world':'vn',variant=options.variant==='63'?'63':'34',difficulty=options.difficulty==='hardcore'?'hardcore':'normal';
    var pool=JSON.parse(poolNode.textContent).filter(function(p){return p.opts.mode===mode&&p.opts.variant===(mode==='world'?'34':variant)&&p.opts.difficulty===difficulty;});
    var preview=pool[Math.floor(Math.random()*pool.length)];
    if(preview){window.MOTDOI_PREVIEW=Object.assign({},preview.opts,{lifeMin:options.lifeMin||30});document.getElementById('heroProfile').innerHTML=preview.html;}
  }
  var status=document.createElement('div');
  status.className='toast hidden';status.setAttribute('role','status');status.setAttribute('aria-live','polite');document.body.appendChild(status);
  function message(text){status.textContent=text;status.classList.remove('hidden');}
  function one(src){return new Promise(function(resolve,reject){
    var script=document.createElement('script'),failure=null;
    function onError(e){if(e.filename===script.src)failure=Error('Không khởi tạo được '+src);}
    window.addEventListener('error',onError);
    script.src=src;script.async=false;
    script.onload=function(){window.removeEventListener('error',onError);if(failure){reject(failure);return;}resolve();};
    script.onerror=function(){window.removeEventListener('error',onError);script.remove();reject(Error('Không tải được '+src));};
    document.head.appendChild(script);
  });}
  function load(){
    if(ready)return Promise.resolve();
    if(flight)return flight;
    message('Đang chuẩn bị trò chơi…');
    document.getElementById('setup').setAttribute('aria-busy','true');
    // Download in parallel; execute in dependency order with a task boundary per chunk.
    files.slice(next).forEach(function(src){var link=document.createElement('link');link.rel='preload';link.as='script';link.href=src;document.head.appendChild(link);});
    flight=(async function(){
      while(next<files.length){await one(files[next]);next++;await new Promise(function(r){setTimeout(r,0);});}
      if(!window.G || !window.G.App)throw Error('Trò chơi chưa khởi tạo xong.');
      ready=true;status.classList.add('hidden');document.getElementById('setup').removeAttribute('aria-busy');
      document.dispatchEvent(new Event('motdoi-ready'));
    })().catch(function(e){flight=null;document.getElementById('setup').removeAttribute('aria-busy');message('Chưa tải được trò chơi. Kiểm tra mạng rồi bấm lại để thử tiếp.');throw e;});
    return flight;
  }
  window.MotDoiBoot={load:load,isReady:function(){return ready;}};
  function start(){load().catch(function(){});}
  document.addEventListener('focusin',function(e){if(!ready&&e.target.closest('#setup'))start();});
  document.addEventListener('pointerover',function(e){if(!ready&&e.target.closest('#setup'))start();},{passive:true});
  document.addEventListener('click',function(e){
    if(ready)return;
    var el=e.target.closest('button, a, [data-go]');if(!el||el.disabled)return;
    if(el.id==='themeBtn'){
      e.preventDefault();e.stopImmediatePropagation();
      var t=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=t;
      try{localStorage.setItem('mkn.theme',JSON.stringify(t));}catch(err){}return;
    }
    if(el.tagName==='A'){
      var href=el.getAttribute('href');
      if(href==='#tryLife'){start();return;}
      if(href!=='#recentSection'&&href!=='#about')return;
    }
    if(el.dataset.go==='home')return;
    e.preventDefault();e.stopImmediatePropagation();
    if(pending)return;pending=true;
    var id=el.id,href=el.getAttribute('href');
    load().then(function(){
      pending=false;
      if(href==='#recentSection'){document.getElementById('recentSection').scrollIntoView();return;}
      var current=id?document.getElementById(id):el;
      if(current&&current.isConnected)current.click();
    }).catch(function(){pending=false;});
  },true);
  if('IntersectionObserver' in window){
    var observer=new IntersectionObserver(function(entries){if(entries.some(function(e){return e.isIntersecting;})){observer.disconnect();start();}},{rootMargin:'160px'});
    observer.observe(document.getElementById('setup'));
    if(!poolNode)observer.observe(document.getElementById('heroProfile'));
  }
  // Restore only an invitation here; migration and save parsing stay in the engine.
  var current=read('mkn.current',null);
  if(current&&current.life&&current.life.alive){
    var box=document.getElementById('resumeBox'),card=document.createElement('div'),label=document.createElement('b'),button=document.createElement('button');
    card.className='card resume';label.textContent='Bạn có một cuộc đời đang chơi dở';button.className='btn primary';button.id='resumeBtn';button.textContent='Tiếp tục sống';card.append(label,button);box.append(card);
  }
  if(/^#s=/.test(location.hash)||location.hash==='#tryLife'||location.hash==='#recentSection')start();
  window.addEventListener('hashchange',function(){if(/^#s=/.test(location.hash))start();});
})();

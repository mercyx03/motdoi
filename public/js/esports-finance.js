/* V5.6 — danh nghĩa USD -> đơn vị tiền nội bộ; lương theo hợp đồng, thưởng theo giải. */
(function(G){
 'use strict';var E=G.E,H=E.H,U=G.U;
 function state(l){return E.ESPORTS.managed(l)&&l.flags.esports;}
 function usd(l,n){return l.cur==='vnd'?n*G.CUR.VND/1e6:n/G.CUR.priceLevel(l.gdp);}
 function fx(code,n){var c=G.CUR.CUR[code];return n/(c?c.rate:1);}
 // Public league minima where available; the offered contract itself is a simulation.
 var rates={LCP:12000,LEC:fx('DE',60000),LCS:75000,LCK:65000,LPL:45000,CBLOL:12000,'VCT-Americas':50000,'VCT-EMEA':fx('DE',50000),'VCT-Pacific':fx('KR',67000000),'VCT-CN':24000,AOG:12000,RPL:18000,GCS:20000,ACS:2400};
 function contract(l,s){if(!s)return null;if(!s.contract)s.contract={baseUSD:s.game==='tft'?(s.sponsor?6000:0):rates[s.league]||6000,share:s.game==='tft'?(s.sponsor?.8:1):.12,house:s.game==='tft'?!!s.sponsor:s.league!=='ACS',quality:1};return s.contract;}
 function gross(l){var s=state(l);if(!s)return null;if(s.stage==='academy')return usd(l,3600);var c=contract(l,s),perf=E.sportPerformance(l);return usd(l,c.baseUSD*(c.quality||1)*perf.multiplier);}
 E.esportsIncome=function(l,old){var value=gross(l);return value==null?old:value;};
 var monthly=E.monthlyEst;E.monthlyEst=function(l,id){if(E.resolveJob(id)==='tuyen_thu_es'&&state(l))return gross(l)/12;return monthly.apply(this,arguments);};
 var pension=E.pensionPolicy;E.pensionPolicy=function(l,c){var s=state(l);if(s&&s.game==='tft'&&s.stage==='pro'&&!s.sponsor)return{covered:false,reason:'Thi đấu TFT tự do: không tự động đóng bảo hiểm hưu trí'};return pension.apply(this,arguments);};
 function house(l){var s=state(l);return !!(s&&s.stage==='pro'&&contract(l,s).house&&E.ESPORTS.free(l)&&l.age<s.retire);}
 E.esportsLiving=function(l,F,b,style,log){if(!house(l))return;var abroad=l.abroad&&!l.abroad.perm?1.5:1,personal=b*.45*style*abroad,p=l.partner&&l.partner.status!=='dating'&&l.partner.alive;
   F.gamingHouse=true;F.gamingHouseFood=Math.min(F.food,personal);F.food=Math.max(0,F.food-personal);
   // Gaming house covers the player, never silently covers their spouse/children's home.
   if(!p&&!l.kids.some(function(k){return k.alive&&l.age-k.born<22;})){F.gamingHouseRent=F.rent;F.rent=0;}
   if(log)log('Đội lo ăn ở tại gaming house. Bạn vẫn tự trả chi tiêu cá nhân và các khoản cho gia đình.','neutral');
 };
 var tables={
  fst:[250000,150000,125000,125000,100000,100000,75000,75000],
  msi:[500000,300000,240000,200000,160000,160000,110000,110000,90000,70000,60000],
  worlds:[1000000,800000,400000,400000,300000,300000,300000,300000,175000,175000,175000,125000,125000,125000,90000,90000,50000,40000,30000],
  masters:[350000,200000,125000,75000,50000,50000,35000,35000,25000,25000,15000,15000],
  champions:[1000000,400000,250000,130000,85000,85000,50000,50000,30000,30000,30000,30000,20000,20000,20000,20000],
  ewc:[600000,340000,220000,140000,90000,90000,90000,90000,55000,55000,55000,55000,30000,30000,30000,30000],
  apl:[200000,100000,70000,30000,20000,20000,14000,14000,2000,2000,2000,2000,2000,2000,2000,2000],
  crown:[150000,50000,25000,20000,17000,15000,13000,12000,11000,11000,10000,10000,9000,9000,8000,8000,7000,7000,6000,6000,5500,5500,5000,5000,4500,4500,4000,4000,3500,3500,3000,3000,2500,2500,2000,2000,1500,1500,1500,1500],
  pro:[3000,2000,1700,1500,1300,1200,1100,1000,800,800,800,800,700,700,700,700,600,600,600,600,500,500,500,500,400,400,400,400,300,300,300,300],
  lcp1:[26400,16000,11200,8000,5600,5600,4000,3200],lcp3:[26400,16000,12000,8000,5600,4800,4000,3200]
 };
 function prize(l,ev,place,r){var s=state(l),a=null,currency='USD',bounty=0;if(!s)return null;
   if(s.game==='lol'){a=tables[ev.id];if(ev.id.indexOf('split')===0){if(s.league==='LCP')a=ev.id==='split3'?tables.lcp3:tables.lcp1;else if(s.league!=='CBLOL')return{total:0,currency:'USD',bounty:0};}}
   if(s.game==='val'){a=/santiago|london/.test(ev.id)?tables.masters:tables[ev.id];if(ev.id==='kickoff'||ev.id==='stage1')return{total:0,currency:'USD',bounty:0};if(ev.id==='stage2')a=[100000,65000,40000,25000,10000,10000,0,0,0,0,0,0,0,0,0,0];}
   if(s.game==='aov'){
     if(ev.id==='apl')a=tables.apl;
     if(ev.id==='spring'||ev.id==='winter'){
       if(s.league==='AOG'){
         currency='VND';a=ev.id==='winter'?[1e9,5e8,2e8,15e7,6e7,6e7]:[1e9,5e8,15e7,5e7];
         var rounds=ev.id==='winter'?2:1,n=ev.id==='winter'?8:7;
         for(var round=0;round<rounds;round++)for(var i=0;i<n;i++){var won=r()<U.clamp(1-(place-1)/(ev.size-1),.08,.92),maps=Math.floor(r()*3),purse=round===1?[80,65,50]:[50,40,30],loser=round===1?[0,15,30]:[0,10,20];bounty+=(won?purse[maps]:loser[maps])*1e6;}
         if(ev.id==='spring'&&place<=6)bounty+=Math.max(0,6-place)*1e8;
       }else if(s.league==='GCS'){currency='TWD';a=[2500000,800000,550000];}
       else if(s.league==='RPL'){currency='THB';a=[6000000];}
       else if(s.league==='ACS'&&ev.id==='spring'){currency='IDR';a=[8000000,4000000,2000000];}
     }
   }
   if(s.game==='tft'){if(ev.id==='crown')a=tables.crown;else if(/^pro[123]$/.test(ev.id))a=tables.pro;else if(ev.id==='regional'&&s.league==='TFT-AMER')a=[14000,6500,5500,4500,3000];else if(ev.id==='regional'&&s.league==='TFT-EMEA'){currency='EUR';a=[12850,6000,5000,4000,3000,2000,1500];}}
   if(!a||a[place-1]==null&&!bounty)return null;
   var amount=(a[place-1]||0)+bounty,totalUSD=currency==='VND'?amount/G.CUR.VND:currency==='USD'?amount:fx({TWD:'TW',THB:'TH',IDR:'ID',EUR:'DE'}[currency],amount);
   return{total:amount,currency:currency,usd:totalUSD,bounty:bounty};
 }
 E.esportsAward=function(l,ev,place,r,log){var s=state(l),z=s.season,key=ev.id;if(z.paid&&z.paid[key])return;z.paid=z.paid||{};z.paid[key]=true;var p=prize(l,ev,place,r);if(!p){if(ev.intl||s.league==='CBLOL')log('Tiền thưởng '+ev.name+' chưa được chốt trong hợp đồng.','neutral');return;}if(!p.total)return;
   var c=contract(l,s),share=c.share,personal=usd(l,p.usd*share),withheld=0,net=personal;
   var label=p.currency==='VND'?G.CUR.fmtVND(p.total/1e6):U.fmtNum(p.total,0)+' '+p.currency;
   log((s.game==='tft'?'Giải thưởng':'Đội nhận thưởng')+' '+ev.name+': '+label+(p.bounty?' (gồm thưởng tỷ số vòng bảng)':'')+'.','good');
   H.cash(l,net,'Thưởng cá nhân '+ev.name);log('Theo hợp đồng, phần của bạn '+Math.round(share*100)+'%: '+H.money(l,personal)+'.','money');
   z.payouts=z.payouts||[];z.payouts.push({event:ev.name,total:p.total,currency:p.currency,share:share,personal:personal,withheld:withheld,net:net});
 };
 E.esportsContract=function(l,s,r){var c=contract(l,s);c.quality=1+r()*.4;c.house=s.game==='tft'?!!s.sponsor:s.league!=='ACS';return c;};
 var profile=E.profile;E.profile=function(l){var p=profile.apply(this,arguments),s=state(l);if(s&&s.stage==='pro'){var c=contract(l,s);p.jobInfo.push('Phần thưởng cá nhân: '+Math.round(c.share*100)+'%'+(house(l)?' · đội bao ăn ở tại gaming house':''));}return p;};
 E.ESPORTS.finance={usd:usd,prize:prize,house:house,gross:gross,contract:contract,tables:tables};
})(globalThis.G);

const assert=require('assert'),E=require('./hardcore-isolation').gameContext().E;let n=0;function ok(x,m){assert(x,m);n++;}
function life(money){let l=E.createLife({mode:'vn',seed:133});Object.assign(l,{age:35,edu:5,indep:true,school:null,money:money==null?50000:money,pending:[],job:null,record:0});l.flags.military=0;l.flags.dirty=0;delete l.flags.criminal;return l;}
function pick(l,id,key,arg,r){let d=E.DEC[id].make(l,r||(()=>0),arg),i=d.data.keys.indexOf(key);assert(i>=0,id+':'+key);d.manual=true;l.pending=[d];if(r){l.pending=[];return E.DEC[id].apply(l,d,String(i),r,()=>{});}return E.resolve(l,String(i));}
function rng(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
const B=E.BUSINESS133,cos=l=>E.BUSINESS123.companies(l),log=()=>{};
// 1. Chọn ngành trước khi chọn vốn; ngành vốn lớn cần đủ tiền.
let l=life();pick(l,'companies123','found');ok(l.pending.some(d=>d.id==='companySector133'),'found opens sector choice');
pick(l,'companySector133','tech');ok(l.pending[0]&&l.pending[0].id==='companyCapital128','sector queues capital');let d=l.pending[0],i=d.data.keys.indexOf('5000');assert(i>=0,'capital 5000 offered');E.resolve(l,String(i));
let c=cos(l)[0];ok(c&&c.sector==='tech'&&c.value===5000&&c.share===100,'company keeps chosen sector');
let poor=life(600);let sd=E.DEC.companySector133.make(poor,()=>0,{});const open=(d,k)=>d.opts.some(o=>o.k===String(d.data.keys.indexOf(k))&&(!o.req||o.req(poor,d.data)));ok(!open(sd,'finance')&&open(sd,'general'),'finance needs larger capital');
// 2. Lợi nhuận tương xứng vốn, có năm lỗ.
function simulate(sector,value,years,seed){let l=life(0),r=rng(seed);cos(l).push({name:'Công ty thử',value:value,share:100,created:35,governance:0,sector:sector});let got=0,losses=0;for(let y=0;y<years;y++){let m=l.money;E.companyYear133(l,r,log);got+=l.money-m;if(cos(l)[0].lastProfit<0)losses++;if(cos(l)[0].merged)break;l.age++;}return{avg:got/years,losses,c:cos(l)[0]};}
let big=simulate('general',10000,30,7);ok(big.avg>150&&big.avg<1500,'10 tỷ general dividends scale with capital: '+big.avg.toFixed(0));
let small=simulate('general',200,30,7);ok(small.avg<big.avg/20,'small capital earns proportionally less');
let lossYears=0;for(let s=1;s<=6;s++)lossYears+=simulate('tech',10000,20,s).losses;ok(lossYears>0,'volatile sector has loss years');
let stable=0,volatile=0;for(let s=1;s<=10;s++){stable+=simulate('health',10000,15,s).losses;volatile+=simulate('realestate',10000,15,s).losses;}ok(volatile>stable,'riskier sector loses more often');
ok(B.sectors.tech.g>B.sectors.energy.g&&B.sectors.realestate.m>B.sectors.retail.m,'sector profiles differ');
// 3. Bổ nhiệm ban điều hành.
l=life();cos(l).push({name:'Công ty A',value:50000,share:80,created:30,governance:0,sector:'manufacturing'});let before=B.effects(l,cos(l)[0]);
pick(l,'companyDeal123','role_ceo',{i:0});ok(l.pending[0]&&l.pending[0].id==='companyRole133','role menu queued');pick(l,'companyRole133','pro',{i:0,role:'ceo'},()=>.9);
let ceo=cos(l)[0].roles.ceo,after=B.effects(l,cos(l)[0]);ok(ceo&&ceo.kind==='pro'&&ceo.skill>=.6,'pro CEO appointed');ok(after.m>before.m&&after.cost>0,'CEO raises margin and costs salary');
pick(l,'companyRole133','pro',{i:0,role:'cfo'},()=>.9);ok(B.effects(l,cos(l)[0]).loss<1,'CFO reduces loss');
cos(l).push({name:'Đối tác B',value:5000,share:30,created:30,governance:0,sector:'retail'});let rd=E.DEC.companyRole133.make(l,()=>0,{i:1,role:'ceo'});ok(rd.opts.every(o=>o.k==='cancel'),'minority holder cannot appoint');
// 4. Phát hành thêm cổ phiếu.
let worth=E.netWorth(l),cash=l.money;pick(l,'companyIssue133','self25',{i:0});c=cos(l)[0];ok(Math.abs(c.share-84)<.11,'private issue raises stake to 84%');ok(l.money<cash&&c.value>50000,'cash moves into company');ok(Math.abs(E.netWorth(l)-worth)<worth*.01,'book-price issue roughly conserves net worth');
let dd=E.DEC.companyIssue133.make(l,()=>0,{i:0});ok(dd.opts.every(o=>o.k==='cancel'),'one issuance per year');
l.age++;let s0=c.share,v0=c.value;pick(l,'companyIssue133','investor10',{i:0});ok(c.share<s0&&c.value>v0,'investor issue dilutes you but adds capital');
l=life();cos(l).push({name:'Công ty C',value:10000,share:55,created:30,governance:0,sector:'food'});pick(l,'companyIssue133','self10',{i:0},()=>.99);ok(cos(l)[0].share===55,'below 65% shareholders can reject');
// 5. Tập đoàn: công việc mặc định là ghế chủ tịch.
l=life(100000);E.startJob(l,'van_phong',()=>0,log,true);for(let k=0;k<3;k++)cos(l).push({name:'Công ty '+k,value:5000,share:100,created:30,governance:0,sector:'general'});
pick(l,'companies123','group');ok(E.WORLD120.p(l).group&&E.resolveJob(l.job.id)===B.chair,'group makes chairman the job');ok(B.seated(l),'seated');
let msg=[];ok(E.startJob(l,'van_phong',()=>0,t=>msg.push(t))===false&&E.resolveJob(l.job.id)===B.chair&&msg.length,'other jobs blocked while seated');
let eq=E.BUSINESS123.equity(l);pick(l,'companies123','chairLeave');ok(!B.seated(l)&&!l.job&&E.BUSINESS123.equity(l)===eq,'leaving seat keeps shares');
E.startJob(l,'van_phong',()=>0,log,true);ok(l.job&&E.resolveJob(l.job.id)==='van_phong','other job allowed after leaving');
pick(l,'companies123','chairReturn');ok(B.seated(l)&&E.resolveJob(l.job.id)===B.chair,'can return to seat');
l.job=null;B.chairYear(l,rng(3),log);ok(l.job&&E.resolveJob(l.job.id)===B.chair,'seat restores chairman job');
// 6. Bản lưu cũ.
let old=life();E.startJob(old,'van_phong',()=>0,log,true);old.flags.world120={companies:[{name:'Cũ',value:3000,share:100,created:30,governance:0}],group:{since:30}};let saved=JSON.parse(JSON.stringify(old));E.migrate(saved);
ok(saved.flags.world120.companies[0].sector==='general'&&saved.flags.world120.chair133&&saved.flags.world120.chair133.active===false,'old save migrates without forcing job');ok(E.resolveJob(saved.job.id)==='van_phong','old job kept');
console.log('Business sectors, executives and shares: '+n+' checks passed.');

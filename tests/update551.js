const fs=require('fs'),vm=require('vm'),assert=require('assert');const html=fs.readFileSync('public/index.html','utf8');for(const [,f]of html.matchAll(/<script src="(js\/[^"?]+)\?v=[^"]+"[^>]*><\/script>/g))if(!['js/app.js','js/music.js','js/card.js','js/account.js'].includes(f))vm.runInThisContext(fs.readFileSync('public/'+f,'utf8'));
const E=G.E,W=E.WILL70;let n=0;function ok(x,t){assert.ok(x,t);n++;}function life(age=70){const l=E.createLife({mode:'vn',seed:551});l.age=age;l.school=null;l.indep=true;l.money=100;l.pending=[];l.kids=[];l.partner=null;return l;}
function save(l,plan,note='Lời nhắn cho gia đình'){const d=E.act(l,'di_chuc70');d.data.plan=plan;d.data.note=note;E.resolve(l,'save');return d;}
{
 let l=life(69);ok(!E.act(l,'di_chuc70'),'age gate');l.age=70;l.acts=999;l.flags.actAt={di_chuc70:70};l.jailUntil=80;ok(E.actions(l).find(x=>x.id==='di_chuc70').ok===true,'can write any time after 70 even action cap/jail');const money=l.money,karma=l.karma;save(l,'personal','Lời nhắn lần đầu');save(l,'personal','Lời nhắn sửa lại');ok(l.flags.will70.note==='Lời nhắn sửa lại'&&l.flags.will70.revision===2,'repeat same year updates');ok(l.acts===999&&l.money===money&&l.karma===karma,'no action/cash/karma farming');
 const current=E.act(l,'di_chuc70');current.data.note='';ok(!!W.check(l,current.data),'empty personal message rejected');E.resolve(l,'none');ok(l.flags.will70.note==='Lời nhắn sửa lại','cancel preserves');
 let d=E.act(l,'di_chuc70');d.data.plan='equal';ok(!!W.check(l,d.data),'no children no child inheritance');E.resolve(l,'none');
 const reload=E.migrate(JSON.parse(JSON.stringify(l)));ok(reload.flags.will70.note===l.flags.will70.note,'save reload retains');
 d=E.act(l,'di_chuc70');const stale=JSON.parse(JSON.stringify(d));E.resolve(l,'revoke');ok(!l.flags.will70&&!l.flags.will,'revocation');save(l,'personal','Bản mới');ok(!E.DEC.di_chuc.valid(l,stale.data),'stale editor after revocation rejected');
 l.alive=false;ok(!E.act(l,'di_chuc70'),'dead cannot edit');
}
{
 const l=life(75);l.kids=[{name:'An',alive:true,born:30},{name:'Bình',alive:true,born:32},{name:'Đã mất',alive:false,born:29}];save(l,'equal');const before=E.netWorth(l);l.alive=false;l.death={age:75,year:l.birthYear+75,cause:'tuổi già'};const s=W.settle(l);ok(s.list.length===2&&Math.abs(s.list.reduce((a,x)=>a+x.amount,0)-Math.max(before,0))<1e-6,'estate divided living children only');ok(E.finale(l).some(x=>x.h==='Di chúc để lại'),'final chapter includes will');ok(W.settle(l)===s&&E.netWorth(l)===before,'no double transfer or changed net worth');
 const partner=life(75);partner.partner={name:'Người cũ',sex:'F',age:70,status:'married',alive:true};save(partner,'spouse');partner.partner={name:'Người mới',sex:'F',age:68,status:'married',alive:true};partner.alive=false;const old=W.settle(partner);ok(old.list.length===0&&old.unassigned===Math.max(0,E.netWorth(partner)),'no inheritance for replacement partner');
 const poor=life();poor.money=-100;save(poor,'charity');poor.alive=false;ok(W.settle(poor).net>=0,'no negative inheritance');
}
console.log('V5.5.1: '+n+' will checks passed');

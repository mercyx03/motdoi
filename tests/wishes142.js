const assert=require('assert'),E=require('./hardcore-isolation').gameContext().E,D=E.DEC.study_wishes54;
function life(){const l=E.createLife({mode:'vn',seed:142});Object.assign(l,{age:18,edu:3,school:null,khoi:'A00',examScore:30,pending:[],lang:{},langExp:{}});E.DEC.uni.apply(l,E.DEC.uni.make(l),'wishes54',()=>.5,()=>{});l.pending=[];return l;}
function add(l,id){for(const key of ['region_'+E.EDUCATION54.schools.find(s=>s.id===id).region,'school_'+id]){const d=D.make(l);assert(d.opts.some(o=>o.k===key));D.apply(l,d,key,()=>.5,()=>{});l.pending=[];}const d=D.make(l),o=d.opts.find(o=>/^(major|program)_/.test(o.k));D.apply(l,d,o.k,()=>.5,()=>{});l.pending=[];}
function submit(l){const logs=[],d=D.make(l);assert(d.opts.some(o=>o.k==='submit'));D.apply(l,d,'submit',()=>.5,t=>logs.push(t));assert(l.flags.study54.submitted);assert(!l.pending.some(d=>d.id==='study_wishes54'));return logs;}
let l=life();['neu','ftu','uet','hust','hus'].forEach(id=>add(l,id));assert.equal(l.flags.study54.wishes.length,5);assert(D.make(l).text.includes('NV1:'));let logs=submit(l);assert.equal(l.flags.study54.admitted.school,'hust');assert.equal(l.school,'uni');assert(logs.some(t=>t.includes('không đủ điều kiện')));assert.equal(l.majorName,l.flags.study54.wishes[3].program);
const admitted=JSON.stringify(l.flags.study54.admitted);D.apply(l,D.make(l),'submit',()=>.5,()=>{});assert.equal(JSON.stringify(l.flags.study54.admitted),admitted);assert.equal(l.school,'uni','rejected replay leaves enrollment unchanged');
l=life();['neu','ftu','uet','uit'].forEach(id=>add(l,id));submit(l);assert(!l.flags.study54.admitted);assert(l.pending.some(d=>d.id==='uniFail'));
l=life();add(l,'neu');l.lang.en=2;submit(l);assert.equal(l.flags.study54.admitted.school,'neu');
l=life();add(l,'neu');add(l,'hust');l.lang.en=2;l.langExp.en=true;submit(l);assert.equal(l.flags.study54.admitted.school,'hust');
l=life();add(l,'hust');l.examScore=0;submit(l);assert(l.pending.some(d=>d.id==='uniFail'));
l=life();add(l,'hust');l=JSON.parse(JSON.stringify(l));E.migrate(l);submit(l);assert.equal(l.school,'uni');
l=life();add(l,'hust');const stale=D.make(l);l.age++;D.apply(l,stale,'submit',()=>.5,()=>{});assert(!l.flags.study54.submitted);
console.log('PASS wishes142: five preferences, per-school eligibility, all rejected, valid/expired certificates, low score, saved application, stale/repeated submission');

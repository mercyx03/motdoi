'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'..','public'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const [,f]of html.matchAll(/<script src="(js\/[^"?]+)\?v=[^"]+"[^>]*><\/script>/g))if(!['js/app.js','js/music.js','js/card.js','js/account.js'].includes(f))vm.runInThisContext(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});
const {E,VN}=G;let n=0;function ok(x,t){assert.ok(x,t);n++;}
ok(VN.P34.length===34&&VN.P63.length===63,'giữ số đơn vị hiện tại và lịch sử');
ok(VN.P34.filter(p=>p.kind==='Thành phố').length===9,'9 thành phố');
for(const [name,id] of [['Quảng Ninh',10],['Bắc Ninh',19],['Đồng Nai',28]]){
 const p=VN.P34[id];ok(p.name===name&&p.kind==='Thành phố','giữ ID và cập nhật loại '+name);
 for(const variant of ['34','63']){
  const l=E.createLife({mode:'vn',variant,oldProv:name,seed:465001});
  ok(l.prov.kind==='Thành phố'&&l.prov.neuId===id,'tạo nhân vật '+variant+' '+name);
  const old=l.prov.old,rs=l.rs;l.prov.kind='Tỉnh';E.migrate(l);
  ok(l.prov.kind==='Thành phố'&&l.prov.old===old&&l.rs===rs,'nâng bản lưu giữ quê và RNG');
  const snapshot=JSON.stringify(l);E.migrate(l);ok(JSON.stringify(l)===snapshot,'nâng lại không đổi dữ liệu');
 }
}
ok(VN.P34[19].members.some(p=>p.name==='Bắc Giang'),'giữ Bắc Giang trong Bắc Ninh');
ok(VN.P34[28].members.some(p=>p.name==='Bình Phước'),'giữ Bình Phước trong Đồng Nai');
console.log('4.6.5: '+n+' checks passed');

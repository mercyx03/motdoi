/* Đức tin gia đình và các lựa chọn trong năm đầu đời. */
(function(G){
  'use strict';
  var E=G.E,H=E.H,X=E.UPDATE110;
  var catholic='Công giáo',orthodox='Chính thống giáo Đông phương',anglican='Anh giáo',protestant='Tin Lành',none='Không tôn giáo';
  function hash(seed){var h=2166136261;for(var c of String(seed))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
  function specific(label,l,key){
    if(!label||/^(khác|không rõ)$/i.test(label))return 'Chưa khai tín ngưỡng';
    if(/^không tôn giáo|vô thần/i.test(label))return none;
    if(/chính thống/i.test(label))return orthodox;
    if(/^Tin Lành.*Luther/i.test(label))return 'Tin Lành Lutheran';
    if(/^Tin Lành/.test(label))return protestant;
    if(/^Công giáo/.test(label))return catholic;
    if(/^(kitô giáo|ki-tô giáo|cơ đốc giáo|thiên chúa giáo)$/i.test(label)){
      var choices=[catholic,protestant,orthodox,anglican];if(l.country==='GB')choices.push(anglican,anglican);if(['RU','GR'].includes(l.country))choices.push(orthodox,orthodox);
      return choices[hash(l.id+key)%choices.length];
    }return label;
  }
  function christian(f){return [catholic,orthodox,anglican,protestant].includes(f)||/^Tin Lành/.test(f||'');}
  function family(l){
    var f=l.flags.faith830;if(f)return f;
    var faith=specific(l.religion,l,'self');l.religion=faith;
    f=l.flags.faith830={mother:faith,father:faith,devotion:hash(l.id+'selfFaith')%101};
    if(hash(l.id+'mixed')%10===0)f[hash(l.id)%2?'mother':'father']=faith===none?catholic:none;
    if(l.fam.noDad)f.father='Chưa khai tín ngưỡng';
    if(l.age===0 && [f.mother,f.father].includes(catholic) && hash(l.id+'childfaith')%4)l.religion=catholic;
    return f;
  }
  function partner(l){
    var p=l.partner;if(!p)return null;
    if(!p.faith830){var key=X.uid(l,p);p.religion130=specific(p.religion130||p.religion||(hash(key+'match')%5?l.religion:[none,catholic,protestant,'Phật giáo','Hồi giáo'][hash(key)%5]),l,key);
      p.faith830={devotion:hash(key+'belief')%101,pressure:hash(key+'family')%101};
      if(p.religion130===protestant)p.faith830.tradition=['Baptist','Giám Lý','Luther'][hash(key+'church')%3];
      if(p.religion130===anglican)p.faith830.tradition=hash(key)%2?'High Church':'Low Church';
    }return p;
  }
  function marriage(f){if(f===catholic)return 'Cha xứ hướng dẫn xin phép hôn nhân hỗn hợp hoặc chuẩn khác đạo tùy tình trạng rửa tội. Người Công giáo cam kết cố gắng nuôi con trong đạo và thông báo cho bạn đời.';
    if(f===orthodox)return 'Khi muốn cử hành bí tích, hai người cần hỏi giáo xứ về phép rửa và việc nuôi con. Hai người cũng có thể chọn hôn nhân dân sự.';
    if(f===protestant||f===anglican)return 'Hỏi hội thánh địa phương về lễ chúc phúc, phép rửa hoặc dâng con. Quan điểm của từng hội thánh và gia đình có thể khác nhau.';
    if(f==='Hồi giáo')return 'Hai người trao đổi với gia đình về nghi lễ, thực hành đức tin và việc nuôi con.';return 'Hai người có thể giữ niềm tin riêng và thống nhất cách nuôi con.';}
  function eligible(l){return l.alive && !(l.jailUntil>l.age)?true:'Chưa thể tham dự';}
  X.menu('faithHome830','Đức tin và thỏa thuận gia đình',eligible,function(l){
    var f=family(l),p=partner(l);return 'Mẹ: '+f.mother+' · Cha: '+f.father+' · Bạn: '+l.religion+' (mức gắn bó '+f.devotion+'/100)'+'. '+(p?'Bạn đời: '+p.religion130+' · mức gắn bó '+p.faith830.devotion+'/100 '+(p.faith830.tradition||'')+'. '+marriage(p.religion130)+' '+(p.religion130!==l.religion?marriage(l.religion):''):'')+(p?.faith830.agreement?' Thỏa thuận cho con: '+p.faith830.agreement+'.':'');
  },function(l){var p=partner(l);if(!p||p.faith830.at===l.age)return [];
    var rows=Array.from(new Set([l.religion,p.religion130,'Để con tự quyết'])).map(function(choice){return {k:choice,l:'Trao đổi việc nuôi con: '+choice,run:function(l,r,log){var rel=p.faith830;rel.at=l.age;
      if(choice!==p.religion130 && p.religion130!==l.religion && rel.devotion+rel.pressure>135 && !rel.discussed){rel.discussed=true;p.close=Math.max(0,(p.close||50)-3);log(p.name+' mong bạn theo đạo vì kỳ vọng gia đình. Bạn giữ quyền lựa chọn; hai người hẹn bàn lại năm tới.','neutral');return;}
      rel.agreement=choice;p.close=Math.min(100,(p.close||50)+2);log('Hai người thống nhất: '+choice+'.','good');}};});
    var rel=p.faith830;
    if(p.status!=='married' && l.age>=18 && p.age>=18 && p.religion130!==l.religion){
      if(!rel.wedding)rows.push({k:'consult',l:'Gặp người phụ trách cộng đoàn để chuẩn bị lễ cưới',run:function(l,r,log){
        rel.wedding='preparing';rel.start=l.age;log(marriage(p.religion130)+' Hai người sẽ trở lại sau khi đã trao đổi với gia đình.','neutral');
      }});
      if(rel.wedding==='preparing' && l.age>rel.start)rows.push({k:'answer',l:'Trở lại cộng đoàn nhận hướng dẫn',run:function(l,r,log){
        var faiths=[p.religion130,l.religion],ortho=faiths.includes(orthodox)&&!faiths.every(christian), parish=hash(X.uid(l,p)+'parish')%100;
        rel.wedding=ortho?'civil':faiths.includes(catholic)&&!rel.agreement?'consultChild':faiths.includes(protestant)&&parish>70?'civil':'blessing';
        log(rel.wedding==='civil'?'Cộng đoàn chưa thể cử hành lễ tôn giáo. Hai người có thể chọn kết hôn dân sự.':rel.wedding==='consultChild'?'Cha xứ đề nghị hai người trao đổi rõ về việc nuôi con rồi tiếp tục hồ sơ.':'Cộng đoàn đồng ý cùng chuẩn bị nghi thức hoặc lễ chúc phúc.','neutral');
      }});
      if(rel.wedding==='consultChild'&&rel.agreement)rows.push({k:'promise',l:'Thông báo cam kết của người Công giáo cho bạn đời và hoàn thiện hồ sơ',run:function(l,r,log){rel.wedding='blessing';log('Hai người đã trao đổi về việc nuôi con và hoàn thiện hồ sơ nghi lễ với giáo xứ.','good');}});
      if(rel.wedding!=='civil')rows.push({k:'civil',l:'Thống nhất tổ chức hôn nhân dân sự',run:function(l,r,log){rel.wedding='civil';log('Hai người giữ niềm tin riêng và chọn con đường dân sự.','neutral');}});
      rows.push({k:'pause',l:'Hoãn cưới năm nay để giải quyết bất đồng',run:function(l,r,log){p.weddingHold130=l.age;rel.at=l.age;log('Hai người hoãn kế hoạch cưới trong năm để bàn lại với gia đình.','neutral');}});
    }
    return rows;
  },12,'Gia đình');
  function displayName(l,k,d){
    if(!d.saint)return k.name;
    if(H.resCode(l)==='VN')return d.saint+' '+k.name;
    var parts=String(k.name).trim().split(/\s+/),surname=parts.length>1?parts[parts.length-1]:'';
    var father=d.fatherName||'';
    var patron={Ivan:['Ivanovich','Ivanovna'],Aleksandr:['Aleksandrovich','Aleksandrovna'],Alexander:['Aleksandrovich','Aleksandrovna'],Nikolai:['Nikolaevich','Nikolaevna'],Mikhail:['Mikhailovich','Mikhailovna'],Sergei:['Sergeevich','Sergeevna'],Dmitry:['Dmitrievich','Dmitrievna']};
    var middle=H.resCode(l)==='RU'&&d.faith===orthodox?patron[String(father||'').split(' ')[0]]:null;
    return [d.saint,middle?middle[k.sex==='F'?1:0]:'',surname].filter(Boolean).join(' ');
  }
  var names={};
  names[catholic]=['Joseph Peter John Paul Francis Michael Anthony Matthew Thomas James','Maria Theresa Catherine Elizabeth Cecilia Agnes Clare Rose Lucy Mary'];
  names[orthodox]=['Aleksandr Nikolai Dmitry Mikhail Vladimir Sergei Andrei Konstantin Vasilii Alexei','Anastasia Ekaterina Elena Olga Sofiya Tatiana Nataliya Anna Maria Irina'];
  names[anglican]=['Arthur Charles William James Oliver Thomas George Edward Andrew John','Victoria Rose Charlotte Elizabeth Diana Mary Margaret Anne Catherine Grace Faith Hope Charity Joy'];
  function newborn(l){return (l.kids||[]).filter(k=>k.alive!==false && k.born===l.age);}
  function infant(l,k){if(k.faith830)return k.faith830;
    family(l);var p=partner(l),a=p?.faith830.agreement,f=a==='Để con tự quyết'?none:a || (christian(l.religion)?l.religion:christian(p?.religion130)?p.religion130:l.religion);
    return k.faith830={faith:f,stage:'choose',fatherName:l.sex==='M'?l.name:p?.sex==='M'?p.name:null,parentFaith:l.religion,otherFaith:p?.religion130||null,tradition:f===anglican?(p?.faith830.tradition||(hash(l.id)%2?'High Church':'Low Church')):null};}
  function rites(l,f,k){if(f===catholic||f===orthodox)return ['Bí tích Rửa Tội tại nhà thờ','Tiệc mừng gia đình'];
    if(f===anglican)return ['Rửa tội theo truyền thống giáo xứ Anh giáo','Chúc phúc và tiệc gia đình'];
    if(E.FAITH837&&/^Tin Lành/.test(f))return E.FAITH837.infantRites(l,k);
    if(f===protestant)return ['Lễ Dâng Con với mục sư và hội thánh','Tiệc mừng gia đình'];
    if(H.resCode(l)!=='VN'||!/Phật|Cao Đài|Không|Vô thần|dân gian|tổ tiên/i.test(f))return ['Tiệc mừng gia đình'];
    var sweets=k.sex==='F'?'chè trôi nước':'chè đậu trắng hoặc đậu đỏ';
    var mu='Đầy tháng cúng 12 Bà Mụ, Đức Ông và gia tiên · '+sweets+' · khai hoa bắt miếng';
    if(/Phật/.test(f))return [mu,'Cầu an tại chùa và làm việc thiện','Cầu an tại gia, kết hợp cúng Mụ','Làm việc thiện hoặc phóng sinh theo truyền thống gia đình'];
    if(/Cao Đài/.test(f))return ['Tắm Thánh tại Thánh thất với vị chức sắc và nước âm dương','Đầy tháng tạ ơn các Đấng và gia tiên'];
    return [mu,'Tiệc đầy tháng cùng người thân'];}
  X.menu('babyFaith830','Đầy tháng, nghi lễ và tên thánh',function(l){return eligible(l)===true&&newborn(l).length?true:'Dành cho gia đình có bé vừa chào đời';},function(l){return 'Chọn riêng cho từng bé trong năm sinh. Gia đình có thể đợi sức khỏe ổn định hoặc chỉ tổ chức tiệc mừng. Tên nghi lễ được lưu riêng trong hồ sơ con.';},function(l,arg){
    var babies=newborn(l),k=babies.find(k=>X.uid(l,k)===arg.id);
    if(!k)return babies.map(k=>({k:X.uid(l,k),l:k.name+' · '+infant(l,k).faith,run:(l,r)=>X.next(l,'babyFaith830',r,{id:X.uid(l,k)})}));
    var d=infant(l,k);if(d.stage==='done')return [];
    if(d.stage==='choose')return rites(l,d.faith,k).map((label,i)=>({k:String(i),l:label,run:function(l,r,log){d.rite=label;if(E.FAITH837)E.FAITH837.recordInfant(l,k,d,label);k.religion=d.faith;d.stage=names[d.faith] && i===0?'name':'done';log(k.name+': '+label+'.','good');H.mem(l,k.name+' — '+label,3);if(d.stage==='name')X.next(l,'babyFaith830',r,arg);}}));
    var pool=names[d.faith][k.sex==='F'?1:0].split(' ');if(d.faith===anglican&&d.tradition==='Low Church')pool=['Grace','Faith','Hope','Charity','Joy'].concat(pool);var list=Array.from(new Set(pool.concat([k.name,'Không chọn tên riêng'])));
    return list.map((name,i)=>({k:String(i),l:name,run:function(l,r,log){d.saint=name==='Không chọn tên riêng'?'':name;d.stage='done';d.display=displayName(l,k,d);log('Gia đình hoàn tất nghi lễ cho '+k.name+(d.saint?', tên nghi lễ '+d.saint:'')+'.','good');}}));
  },14,'Gia đình');
  X.menu('dossier830','Kê khai lý lịch gia đình',function(l){return eligible(l)===true && H.resCode(l)==='VN' && l.age>=18?true:'Dành cho hồ sơ tuyển dụng tại Việt Nam';},function(l){return 'Kê khai bản thân, cha mẹ và ông bà theo thông tin có trong hồ sơ gia đình. Đơn vị tiếp nhận có thể yêu cầu bổ sung cho từng vị trí. Tôn giáo: '+(l.religion===none?'Không':l.religion)+'.';},function(l){return [{k:'submit',l:'Nộp bản kê khai theo thông tin hiện có',run:function(l,r,log){l.flags.dossier830={age:l.age,faith:l.religion===none?'Không':l.religion,generations:['Bản thân: '+l.name,'Cha mẹ: '+[l.fam.mName,l.fam.fName].filter(Boolean).join(', '),'Ông bà: '+(family(l).grandparents?.join(', ')||'chưa có tên trong hồ sơ gia đình')]};log('Đã ghi hồ sơ thân nhân để đối chiếu khi xét vị trí công tác.','neutral');}}];},18,'Công việc');
  var exam=E.rollExamScore;if(exam)E.rollExamScore=function(l,r){var score=exam.apply(this,arguments),caseFile=E.WELFARE918?.state(l)?.dis?.self;return caseFile?.education && (caseFile.country||'VN')===H.resCode(l)?Math.min(30,score+.5):score;};
  var heir=E.heirAtAge;if(heir)E.heirAtAge=function(parent,k){var child=heir.apply(this,arguments);if(!child||!k.faith830)return child;
    child.religion=k.faith830.faith;var f=family(child);f[parent.sex==='F'?'mother':'father']=k.faith830.parentFaith||parent.religion;f[parent.sex==='F'?'father':'mother']=k.faith830.otherFaith||'Chưa khai tín ngưỡng';f.grandparents=[parent.fam.mName,parent.fam.noDad?null:parent.fam.fName].filter(Boolean);f.saint=k.faith830.saint||null;return child;
  };
  var migrate=E.migrateExt;E.migrateExt=function(l){if(migrate)migrate(l);if(l?.flags&&l.fam)family(l);};
  E.HOOKS.year.push(function(l){if(!l.alive)return;family(l);l.religion=specific(l.religion,l,'self');partner(l);newborn(l).forEach(k=>infant(l,k));});
  E.FAITH830={family:family,infant:infant,rites:rites,displayName:displayName};
})(globalThis.G);

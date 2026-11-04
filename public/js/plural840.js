/* Additional unions share the kin920 household and the same NPC identities as dating.
   Rule descriptions are scenarios for the game. Residence alone never registers a spouse. */
(function(G){
  'use strict';
  var E=G.E,H=E.H,X=E.UPDATE110,U=G.U;
  var islamic='SA AE QA KW OM BH YE JO EG ID MY PK BD DZ IQ IN NG'.split(' ');
  var customary='ZA KE UG TZ SN ML NE TD CM NG IN'.split(' ');
  var review={ID:'Tòa án Tôn giáo xét căn cứ, ý kiến vợ hiện tại và khả năng chu cấp',
    MY:'Tòa Syariah xét lý do, tài chính và công bằng theo hồ sơ của bang',
    PK:'Arbitration Council xét lý do và ý kiến các bên, cần phép bằng văn bản',
    BD:'Arbitration Council xét sự cần thiết và công bằng, cần phép bằng văn bản',
    DZ:'Tòa xét sự đồng thuận, lý do và khả năng đối xử công bằng',
    IQ:'Thẩm phán xét căn cứ, khả năng tài chính và quy định của khu vực',
    ZA:'Tòa xem xét phương án tài sản của gia đình theo hôn nhân tập quán',
    IN:'Đối chiếu luật nhân thân, địa bàn và chứng cứ công nhận tập quán'};
  function state(l){
    var kin=l.flags.kin920||(l.flags.kin920={});
    return kin.plural840||(kin.plural840={extra:[],pairs:{},history:[],rules:{},members:{}});
  }
  function peek(l){return l.flags.kin920?.plural840;}
  function id(l,p){return E.RELATIONS108.person(l,p);}
  function primary(l){var p=l.partner;return p&&p.age>=18&&p.alive!==false&&p.status==='married'?p:null;}
  function people(l){return (primary(l)?[l.partner]:[]).concat((peek(l)?.extra||[]).filter(p=>p.alive!==false));}
  function place(l){return String(l.movedTo||l.city||'');}
  function code(l){return H.resCode(l);}
  function choices(l){
    var c=code(l),town=place(l),out=[];
    if(c==='BT')out.push(l.sex==='M'?'bhutan':'social');
    if(c==='CN'&&town==='Lhasa'&&l.sex==='F')out.push('social');
    if(c==='IN'&&town==='Reckong Peo')out.push('tribal');
    if(islamic.includes(c)&&l.sex==='M'&&/Hồi giáo|Islam/i.test(l.religion||'')&&
        (c!=='NG'||/Kano|Kaduna|Maiduguri/.test(town))&&(c!=='IN'||town!=='Dehradun'))out.push('muslim');
    if(customary.includes(c)&&l.sex==='M'&&c!=='IN')out.push('custom');
    return out;
  }
  var labels={muslim:'Hôn nhân theo luật nhân thân Hồi giáo',custom:'Hôn nhân theo tập quán / chế độ tài sản đã đăng ký',
    tribal:'Tập quán bộ lạc đã được công nhận tại địa phương',bhutan:'Hôn nhân có chứng nhận tại Bhutan',
    social:'Gia đình theo tập quán xã hội, không cấp thêm giấy kết hôn',mono:'Hôn nhân độc phối'};
  function reason(l){return X.reason(l,18)!==true?X.reason(l,18):primary(l)||peek(l)?.extra.length?true:'Cần đang có người phối ngẫu';}
  function localRule(l,s){
    var p=primary(l),r=s.record;
    if(!p||p.sex===l.sex||!r||r.anchor!==id(l,p)||r.code!==code(l)||!choices(l).includes(r.form)||p.faith830?.wedding==='civil')return false;
    if(r.form==='tribal'&&!r.proof)return false;
    return true;
  }
  function compatible(l,p){return p&&p.age>=18&&p.alive!==false&&p.sex!==l.sex&&!p.secret108&&
    !['ended','married','private'].includes(p.status)&&(!l.flags.affair107?.person108||id(l,p)!==id(l,l.flags.affair107.person108))&&!people(l).some(q=>id(l,q)===id(l,p));}
  function funds(l,n){return l.base*.09*n;}
  function cap(s){return ['muslim','bhutan'].includes(s.record?.form)?4:8;} // household simulation limit
  function proposalOK(l,s){
    var d=s.proposal;
    if(d){var current=[s.intro].concat(l.flags.network108||[]).find(p=>p&&id(l,p)===d.person.relation108);
      if(!current)return false;d.person=current;}
    return !!(d&&localRule(l,s)&&d.code===code(l)&&d.region===place(l)&&d.anchor===id(l,l.partner)&&compatible(l,d.person)&&
      d.members===people(l).map(p=>id(l,p)).join('|')&&people(l).length<cap(s));
  }
  function vote(l,p,r){return r()<U.clamp(.38+(p.close??p.affection108??55)/160,.25,.94);}
  function application(l,s,p,r,log){
    if(!localRule(l,s)||review[code(l)]&&!s.record.grounds||s.proposal||s.applyAt===l.age||!compatible(l,p)||people(l).length>=cap(s))return;
    s.applyAt=l.age;
    if(!vote(l,p,r)){log(p.name+' muốn giữ quan hệ hiện tại, chưa đồng ý bàn chuyện kết hôn.','neutral');return;}
    var opinions=people(l).map(q=>({name:q.name,id:id(l,q),yes:vote(l,q,r)}));
    var c=code(l),consent=['BT','ID','DZ'].includes(c)||s.record.form==='social'||s.record.form==='tribal'||
      c==='IQ'&&/Erbil|Sulaymaniyah|Duhok/i.test(place(l));
    var objections=opinions.filter(x=>!x.yes);
    log('Đã thông báo cho từng người. '+opinions.map(x=>x.name+(x.yes?' đồng thuận':' đề nghị xem xét lại')).join(', ')+'.','neutral');
    if(consent&&objections.length){log('Thiếu sự đồng thuận cần thiết. Hồ sơ dừng tại đây.','neutral');return;}
    s.proposal={person:p,region:place(l),anchor:id(l,l.partner),code:c,at:l.age,opinions:opinions,members:people(l).map(q=>id(l,q)).join('|')};
    log((review[c]||'Gia đình chuẩn bị thủ tục, điều kiện chu cấp và quyền của từng người')+'. Có thể trở lại năm sau để nhận kết quả.','neutral');
  }
  function finish(l,s,r,log){
    if(!proposalOK(l,s)||l.age<=s.proposal.at)return;
    var d=s.proposal,p=d.person,n=people(l).length+1;delete s.proposal;
    if(Math.max(0,l.money)<funds(l,n)||!s.rules.fair||r()>(d.opinions.some(x=>!x.yes)?.55:.87)){
      log('Hồ sơ chưa được chấp thuận sau khi xét lý do, nguồn chu cấp và ý kiến từng người. Hôn nhân hiện tại vẫn tiếp tục.','neutral');return;
    }
    var social=s.record.form==='social';
    p.union840={at:l.age,code:d.code,form:s.record.form,registered:!social};p.status=social?'customary':'married';
    s.extra.push(p);if(s.intro&&id(l,s.intro)===id(l,p))delete s.intro;l.flags.network108=(l.flags.network108||[]).filter(q=>id(l,q)!==id(l,p));
    log(social?'Gia đình đón '+p.name+' theo tập quán. Hồ sơ ghi quan hệ xã hội.':'Hồ sơ được duyệt. '+p.name+' được ghi nhận là người phối ngẫu trong gia đình.','big');
  }
  function introduction(l,s,r,log){
    if(s.introAt===l.age||!localRule(l,s))return;
    s.introAt=l.age;var p=E.DEC.love.make(l,r,{where:'qua gia đình giới thiệu công khai'}).data.p;
    if(!compatible(l,p)){log('Lần giới thiệu này chưa có người phù hợp với gia đình và lựa chọn hẹn hò của bạn.','neutral');return;}
    p.status='introduced';id(l,p);s.intro=p;log('Gia đình làm quen với '+p.name+'. Người ấy biết về hôn nhân hiện tại và có quyền từ chối.','neutral');
  }
  function note(l,s){
    var c=code(l),r=s.record;
    if(!r||r.anchor!==id(l,l.partner))return 'Đối chiếu hình thức của hôn nhân hiện tại trước khi lập hồ sơ. '+(c==='NP'?'Hôn nhân hiện đại ở Nepal không mở đăng ký thêm. Tập quán lịch sử chỉ để tìm hiểu.':c==='CN'?'Ở Tây Tạng chỉ mô phỏng tập quán xã hội; không cấp thêm giấy hôn nhân dân sự.':c==='IN'?'Phụ thuộc luật nhân thân, bang và chứng cứ của cộng đồng.':'Tập quán của địa phương không mặc định áp dụng cho mọi gia đình.');
    return labels[r.form]+' · '+r.code+' · '+(review[c]||'Đối chiếu đăng ký, sự tự nguyện, tài sản và nghĩa vụ chu cấp')+'.'+(s.proposal?' Đang xét hồ sơ của '+s.proposal.person.name+'.':'');
  }
  X.menu('pluralUnion840','Hồ sơ kết hôn thêm và gia đình theo tập quán',reason,l=>note(l,state(l)),function(l){
    var s=state(l),rows=[],p=primary(l);
    if(!p)return s.extra.map(q=>({k:'end:'+id(l,q),l:'Kết thúc hộ theo tập quán với '+q.name,run:function(l,r,log){removeExtra(l,s,q,log,'kết thúc thỏa thuận sống chung');}}));
    var c=code(l),anchor=id(l,p);
    if(!s.record||s.record.anchor!==anchor){
      var forms=p.faith830?.wedding==='civil'?[]:choices(l);
      return forms.concat('mono').map(form=>({k:form,l:'Ghi nhận hồ sơ hiện tại: '+labels[form],run:function(l,r,log){
        s.record={anchor:anchor,code:c,form:form,at:l.age};
        log('Ghi vào hồ sơ gia đình: '+labels[form]+'.','neutral');
      }}));
    }
    if(s.record.form==='tribal'&&!s.record.proof&&choices(l).includes('tribal')&&s.record.code===c){
      rows.push({k:'proof',l:'Nộp chứng cứ về cộng đồng và quyết định công nhận tập quán',why:s.record.at>=l.age||s.record.reviewAt===l.age?'Chờ năm thẩm tra tiếp theo':true,run:function(l,r,log){
        s.record.reviewAt=l.age;s.record.proof=r()<.55;log(s.record.proof?'Hồ sơ mô phỏng xác nhận quy tắc áp dụng cho riêng cộng đồng này.':'Chứng cứ chưa đủ; không thể đăng ký thêm.','neutral');
      }});return rows;
    }
    if(!localRule(l,s))return [{k:'info',l:'Xem kết luận hồ sơ',run:(l,r,log)=>log('Hình thức hôn nhân hoặc địa bàn hiện tại không mở đăng ký thêm.','neutral')}];
    if(review[c]&&s.record.grounds==null)rows.push({k:'grounds',l:'Nộp căn cứ và phương án tài sản để thẩm tra',why:s.record.groundAt===l.age?'Cơ quan đã xem xét trong năm nay':true,run:function(l,r,log){
      s.record.groundAt=l.age;
      var evidence=c==='ID'?(l.flags.medical839===id(l,l.partner)||!!l.partner.ill):true;
      if(!evidence||r()>.8){log('Hồ sơ chưa chứng minh được căn cứ theo tuyến luật áp dụng.','neutral');return;}
      s.record.grounds={at:l.age,authority:review[c]};log('Cơ quan tiếp nhận căn cứ và phương án, vẫn phải xét hồ sơ của các bên.','neutral');
    }});
    if(!s.rules.fair)rows.push({k:'fair',l:'Cùng lập cam kết cấp dưỡng, tài sản riêng và lịch công bằng',run:function(l,r,log){s.rules.fair=true;log('Gia đình lập phương án về thời gian, chi tiêu và quyền tài sản để đưa vào hồ sơ.','neutral');}});
    if(s.proposal){
      var objections=s.proposal.opinions.filter(o=>!o.yes);
      if(['JO','EG'].includes(c)&&objections.length&&!s.proposal.heard)rows.push({k:'hearing',l:'Tiếp nhận yêu cầu giải quyết của '+objections.map(o=>o.name).join(', '),run:function(l,r,log){
        s.proposal.heard=true;s.proposal.at=l.age;
        var complainant=people(l).find(q=>objections.some(o=>o.id===id(l,q))&&(q.close??50)<40);
        if(complainant&&r()<.4){
          delete s.proposal;log(complainant.name+' yêu cầu chấm dứt hôn nhân sau khi quyền lợi bị ảnh hưởng.','bad');
          if(complainant===l.partner)H.endPartner(l,log,'div');else removeExtra(l,s,complainant,log,'yêu cầu ly hôn');return;
        }
        log('Đã ghi nhận ý kiến về quyền lợi và căn cứ yêu cầu ly hôn; hồ sơ chờ xem xét thêm một năm.','neutral');
      }});
      if(proposalOK(l,s))rows.push({k:'finish',l:'Nhận kết quả xét hồ sơ của '+s.proposal.person.name,why:objections.length&&['JO','EG'].includes(c)&&!s.proposal.heard?'Cần giải quyết khiếu nại':l.age<=s.proposal.at?'Đang thẩm tra':true,run:(l,r,log)=>finish(l,s,r,log)});
      rows.push({k:'withdraw',l:'Rút hồ sơ đang xét',run:function(){delete s.proposal;}});return rows;
    }
    rows.push({k:'meet',l:'Nhờ giới thiệu công khai một người trưởng thành',why:s.introAt===l.age?'Đã thu xếp một cuộc gặp năm nay':true,run:(l,r,log)=>introduction(l,s,r,log)});
    var options=[s.intro].concat(l.flags.network108||[]).filter(p=>compatible(l,p));
    options.forEach(p=>rows.push({k:'ask:'+id(l,p),l:'Hỏi ý kiến '+p.name+' và từng người phối ngẫu',why:review[c]&&!s.record.grounds?'Cần căn cứ được tiếp nhận':!s.rules.fair?'Cần cam kết tài sản và thời gian':s.applyAt===l.age?'Đã bàn một hồ sơ năm nay':people(l).length>=cap(s)?'Đã đạt giới hạn của tuyến gia đình':true,run:(l,r,log)=>application(l,s,p,r,log)}));
    return rows;
  },18,'Gia đình');
  function member(l,s,p){
    var k=id(l,p);
    return s.members[k]||(s.members[k]={privateFunds:0,yearsShort:0,days:0,share:0});
  }
  function pair(l,s,a,b){
    var ids=[id(l,a),id(l,b)].sort(),k=ids.join(':');
    if(!s.pairs[k]){
      var ta=E.FAMILY130.personality(l,a),tb=E.FAMILY130.personality(l,b);
      s.pairs[k]={ids:ids,trust:ta.some(x=>tb.includes(x))?60:48,tension:10,alliance:0,distance:0};
    }
    return s.pairs[k];
  }
  function label(f){
    if(f.distance>=55)return 'Xa cách';
    if(f.tension>=70)return 'Mâu thuẫn';
    if(f.alliance>=50&&f.trust>=50)return 'Liên minh';
    if(f.tension>=43)return 'Cạnh tranh';
    return f.trust>=77?'Thân thiết':f.trust>=55?'Hòa thuận':'Trung lập';
  }
  function adjust(f,trust,tension,alliance,distance){
    [[ 'trust',trust],['tension',tension],['alliance',alliance],['distance',distance]].forEach(([k,n])=>{f[k]=U.clamp(f[k]+n,0,100);});
  }
  function pairs(l,s){
    var ps=people(l),out=[];
    ps.forEach((a,i)=>ps.slice(i+1).forEach(b=>out.push({a,b,f:pair(l,s,a,b)})));return out;
  }
  function household(l){return X.reason(l,18)!==true?X.reason(l,18):people(l).length>=2?true:'Cần ít nhất hai người phối ngẫu trong gia đình';}
  function plan(l,s){
    var ps=people(l),n=ps.length,budget=Math.min(Math.max(0,l.money),funds(l,n)),common=budget*(s.rules.pool==='common'?.55:.30);
    return ps.map((p,i)=>{
      var k=id(l,p),time=s.rules.time,bias=ps.some(x=>id(l,x)===time),money=s.rules.priority,preferred=ps.some(x=>id(l,x)===money);
      var freeDays=bias?5:7;
      var days=Math.floor(freeDays/n)+((i+l.age)%n<freeDays%n?1:0)+(bias&&k===time?2:0);
      var weight=preferred&&k===money?2:1;
      return {p,k,days,share:(budget-common)*weight/(n+(preferred?1:0)),common,budget};
    });
  }
  function summary(l){
    var s=state(l),r=s.rules,ps=plan(l,s);
    return ps.map(x=>{var m=member(l,s,x.p);
      return x.p.name+' · '+(x.p.union840?.registered===false?'tập quán xã hội':'phối ngẫu')+' · '+x.days+' ngày/tuần · ngân sách cá nhân năm nay '+H.money(l,x.share)+' · quỹ riêng đã dành '+H.money(l,m.privateFunds)+' · phần việc '+(m.duty||'luân phiên')+' · '+(r.delegate===x.k?'đại diện bàn việc chung':'có tiếng nói trong gia đình');}).join('\n')+
      '\nNgân sách chung '+H.money(l,ps[0]?.common||0)+' · quyết định '+(r.voice||'cùng bàn')+' · việc nhà/chăm con '+(r.duties||'luân phiên')+' · riêng tư '+(r.privacy||'xin phép trước')+'.\n'+
      pairs(l,s).map(x=>x.a.name+' và '+x.b.name+': '+label(x.f)+' · tin cậy '+x.f.trust+'/100 · căng thẳng '+x.f.tension+'/100').join('\n');
  }
  var interactions=[
    ['talk','Tâm sự riêng',12,-8,0,-5],['cook','Cùng nấu ăn, mua sắm hoặc tổ chức sinh nhật',9,-4,3,-3],
    ['care','Giúp nhau chăm con',12,-7,5,-4],['gift','Tặng quà dịp lễ',10,-6,1,-2],
    ['defend','Bênh vực người bị đối xử bất công',8,-2,18,-2],['project','Cùng làm thiện nguyện hoặc việc kinh doanh gia đình',7,-3,12,-4],
    ['compare','So sánh quà tặng và tiền chu cấp',-9,16,0,5],['rumor','Nói xấu, từ chối hợp tác',-15,20,-8,15],
    ['petition','Cùng đề nghị chia lại thời gian và tiền',5,-6,22,-5],['space','Tôn trọng yêu cầu có không gian riêng',3,-9,0,15]
  ];
  function removeExtra(l,s,p,log,why){
    s.extra=s.extra.filter(x=>id(l,x)!==id(l,p));s.history.push({person:p,at:l.age,why:why});delete s.proposal;
    log(p.name+' '+why+'. Tài sản riêng và hồ sơ con cái vẫn được ghi theo từng người.','neutral');
  }
  X.menu('pluralHome840','Lịch, ngân sách và quan hệ giữa các phối ngẫu',household,summary,function(l,arg){
    var s=state(l),rules=s.rules,ps=people(l),rows=[];
    if(arg.pair){
      var x=pairs(l,s).find(x=>x.f.ids.join(':')===arg.pair);if(!x)return [];
      return interactions.map(([k,name,t,j,a,d])=>({k,l:name,why:x.f.at===l.age?'Hai người đã tương tác năm nay':k==='care'&&!(l.kids||[]).some(k=>k.alive!==false&&l.age-k.born<18)?'Chưa có con nhỏ':k==='gift'&&l.money<l.base*.012?'Chưa đủ tiền mua quà':true,
        run:function(l,r,log){x.f.at=l.age;if(k==='care'){childrenOf(l,x.a).concat(childrenOf(l,x.b)).forEach(child=>{child.close=U.clamp((child.close||50)+2,0,100);});}if(k==='gift')H.cash(l,-l.base*.012,'Quà trong gia đình');
          adjust(x.f,t,j,a,d);if(k==='petition'){delete rules.time;delete rules.priority;rules.voice='cùng bàn';}
          log(x.a.name+' và '+x.b.name+' · '+name+'. Hiện hai người '+label(x.f).toLowerCase()+'.','neutral');
        }}));
    }
    if(arg.person){
      var p=ps.find(p=>id(l,p)===arg.person);if(!p)return [];
      rows.push({k:'time',l:'Dành thêm hai ngày mỗi tuần cho '+p.name,run:function(){rules.time=id(l,p);}},
        {k:'priority',l:'Ưu tiên một phần ngân sách cá nhân cho '+p.name,run:function(){rules.priority=id(l,p);}});
      var m=member(l,s,p);
      rows.push({k:'delegate',l:'Giao '+p.name+' đại diện bàn việc chung năm nay',run:function(){rules.delegate=id(l,p);rules.delegateAt=l.age;rules.voice='đại diện luân phiên';}},
        {k:'chores',l:'Đổi phần việc của '+p.name,run:function(){m.duty=m.duty==='việc nhà'&&childrenOf(l,p).length?'chăm con':m.duty==='luân phiên'||!m.duty?'việc nhà':'luân phiên';}},
        {k:'private',l:'Dành quỹ riêng của '+p.name+' cho sở thích cá nhân',why:m.privateFunds<=0||m.spendAt===l.age?'Chưa có quỹ hoặc đã chi năm nay':true,run:function(l,r,log){var v=Math.min(m.privateFunds,l.base*.02);m.privateFunds-=v;m.spendAt=l.age;log(p.name+' tự quyết khoản chi '+H.money(l,v)+' từ quỹ riêng.','good');}});
      if(s.extra.includes(p)){
        if(p.sex!==l.sex&&p.union840.registered)rows.push({k:'baby',l:'Bàn kế hoạch có con với '+p.name,why:E.RELATIONS108.fertile(l,p)&&E.RELATIONS108.chance(l,p)>0?true:'Chưa đủ điều kiện cho thai kỳ',run:function(l,r,log){if(vote(l,p,r))E.RELATIONS108.conceive(l,p,r,log,'plural840',false);else log(p.name+' chưa muốn có con năm nay.','neutral');}});
        rows.push({k:'leave',l:'Trao đổi về chấm dứt quan hệ',run:(l,r)=>X.next(l,'pluralHome840',r,{leave:id(l,p)})});
      }
      return rows;
    }
    if(arg.leave){
      var p=s.extra.find(p=>id(l,p)===arg.leave);return p?[{k:'confirm',l:'Xác nhận chia tay '+p.name,run:(l,r,log)=>removeExtra(l,s,p,log,'rời quan hệ sau cuộc trao đổi')}]:[];
    }
    rows.push({k:'equal',l:'Luân phiên thời gian và chia đều tiền riêng',run:function(){delete rules.time;delete rules.priority;}},
      {k:'pool',l:'Thay đổi tỷ lệ quỹ chung: '+(rules.pool==='common'?'30%':'55%'),run:function(){rules.pool=rules.pool==='common'?'private':'common';}},
      {k:'voice',l:'Quyền quyết định: '+(rules.voice==='đại diện luân phiên'?'cùng bàn':'đại diện luân phiên'),run:function(){rules.voice=rules.voice==='đại diện luân phiên'?'cùng bàn':'đại diện luân phiên';}},
      {k:'duties',l:'Đổi cách chia việc nhà và chăm con',run:function(){rules.duties=rules.duties==='theo quỹ giờ'?'luân phiên':'theo quỹ giờ';}},
      {k:'privacy',l:'Đổi thỏa thuận riêng tư và ranh giới',run:function(){rules.privacy=rules.privacy==='không gian riêng'?'xin phép trước':'không gian riêng';}});
    ps.forEach(p=>rows.push({k:'member:'+id(l,p),l:p.name+' · phân bổ và trách nhiệm',run:(l,r)=>X.next(l,'pluralHome840',r,{person:id(l,p)})}));
    pairs(l,s).forEach(x=>rows.push({k:x.f.ids.join(':'),l:x.a.name+' và '+x.b.name+' · '+label(x.f),run:(l,r)=>X.next(l,'pluralHome840',r,{pair:x.f.ids.join(':')})}));
    if(s.event)rows.unshift({k:'event',l:'Bàn việc đang xảy ra: '+s.event.title,run:(l,r)=>X.next(l,'pluralEvent840',r)});
    return rows;
  },18,'Gia đình');
  var cases=[
    ['anniversary','Ngày kỷ niệm trùng lịch, một người thấy mình bị bỏ quên','Đổi lịch luân phiên'],
    ['ill','Một người bị bệnh, người kia phải lo việc nhà','Thu xếp chăm sóc và cho người mệt thời gian riêng'],
    ['manage','Hai người cùng muốn quản lý nhà cửa','Chia trách nhiệm và lấy ý kiến cả hai'],
    ['kids','Con của hai người bất đồng về cách chơi và kỷ luật','Lắng nghe từng con, thống nhất cách nuôi dạy'],
    ['bias','Sự thiên vị kéo dài, có người tính đến chuyện ra riêng','Xem lại tiền, lịch và quyền quyết định']
  ];
  function childrenOf(l,p){return (l.kids||[]).filter(k=>k.alive!==false&&k.coParent108?.id===id(l,p)&&l.age-k.born<18);}
  function incident(l,s,r){
    if(s.event||r()>.38)return;
    var x=U.pick(r,pairs(l,s)),possible=cases.filter(c=>c[0]!=='kids'||childrenOf(l,x.a).length&&childrenOf(l,x.b).length);
    if(x.f.tension<40)possible=possible.filter(c=>c[0]!=='bias');
    var ev=U.pick(r,possible);s.event={ids:x.f.ids.slice(),kind:ev[0],title:ev[1],at:l.age};
    E.WORLD120.queue(l,'pluralEvent840',r,undefined,{manual:false});
  }
  function eventPair(l){var s=peek(l);return s?.event&&pairs(l,s).find(x=>x.f.ids.join(':')===s.event.ids.join(':'));}
  X.menu('pluralEvent840','Việc cần bàn trong gia đình',l=>household(l)===true&&!!eventPair(l),
    function(l){var x=eventPair(l);return x?x.a.name+' và '+x.b.name+' · '+state(l).event.title:'';},function(l){
      var s=state(l),x=eventPair(l);if(!x)return [];
      var ev=cases.find(c=>c[0]===s.event.kind);
      return [['agree',ev[2]],['side','Bênh một phía, để bất đồng tiếp diễn'],['pause','Cho nhau khoảng cách, hẹn bàn tiếp năm sau']].map(([k,name])=>({k,l:name,
        why:k==='pause'&&s.event.paused===l.age?'Đã hẹn lại năm sau':true,run:function(l,r,log){
          if(k==='pause'){s.event.paused=l.age;adjust(x.f,-2,2,0,7);return;}
          if(k==='agree'){adjust(x.f,9,-15,5,-5);if(ev[0]==='bias'||ev[0]==='anniversary'){delete s.rules.time;delete s.rules.priority;}
            if(ev[0]==='manage'||ev[0]==='kids')s.rules.duties='luân phiên';if(ev[0]==='ill'){member(l,s,x.a).duty='nghỉ ngơi';member(l,s,x.b).duty='việc nhà';}}
          else adjust(x.f,-11,15,2,8);
          log(x.a.name+' và '+x.b.name+' · '+name+'. Quan hệ hiện '+label(x.f).toLowerCase()+'.','neutral');delete s.event;
        }}));
    },18);
  function reconcile(l,s){
    if(!l.partner){var next=s.extra.find(p=>p.alive!==false&&p.union840.registered);
      if(next){s.extra=s.extra.filter(p=>p!==next);l.partner=next;s.record={anchor:id(l,next),form:next.union840.form,code:next.union840.code,proof:true};}}
    if(s.proposal&&!proposalOK(l,s))delete s.proposal;
    if(s.event&&!eventPair(l))delete s.event;
  }
  E.HOOKS.year.push(function(l,r,log){
    var s=peek(l);if(!s||!l.alive||s.year===l.age)return;s.year=l.age;reconcile(l,s);
    if(s.intro&&s.intro.lastAge840!==l.age){s.intro.lastAge840=l.age;if(s.introAt<l.age)s.intro.age++;}
    if(!s.extra.length)return;
    s.extra.slice().forEach(p=>{
      p.age++;if(p.alive===false||r()<E.qBase(p.sex==='M'?l.mortM:l.mortF,p.age)){
        p.alive=false;p.died=l.age;removeExtra(l,s,p,log,'qua đời');if(E.personDied)E.personDied(l,p,l.age);
      }
    });
    if(people(l).length<2)return;
    if(s.rules.voice==='đại diện luân phiên'&&s.rules.delegateAt!==l.age){var seats=people(l);s.rules.delegate=id(l,seats[l.age%seats.length]);s.rules.delegateAt=l.age;}
    var planYear=plan(l,s),richest=Math.max(...planYear.map(x=>x.share)),longest=Math.max(...planYear.map(x=>x.days));
    H.cash(l,-planYear[0].budget,'Ngân sách chung và tiền riêng của các phối ngẫu');
    planYear.forEach(x=>{
      var m=member(l,s,x.p);m.days=x.days;m.share=x.share;m.privateFunds+=x.share;
      var short=x.days+1<longest||x.share<richest*.68||x.budget<funds(l,planYear.length)*.6;
      m.yearsShort=short?m.yearsShort+1:Math.max(0,m.yearsShort-1);
    });
    pairs(l,s).forEach(x=>{
      var neglect=Math.max(member(l,s,x.a).yearsShort,member(l,s,x.b).yearsShort);
      adjust(x.f,neglect?-3:2,neglect?6:-2,0,neglect?3:-1);
      if(x.f.tension>=60&&r()<.2){adjust(x.f,-2,5,0,9);log(x.a.name+' và '+x.b.name+' từ chối phối hợp sau tranh cãi, đề nghị bàn lại ranh giới.','bad');}
      if(s.rules.privacy==='không gian riêng')adjust(x.f,0,-1,0,1);
      if(s.rules.duties==='theo quỹ giờ'||s.rules.voice==='đại diện luân phiên')adjust(x.f,1,-1,1,0);
    });
    s.extra.slice().forEach(p=>{if(member(l,s,p).yearsShort>=3&&r()<.3)removeExtra(l,s,p,log,'chọn ra riêng sau nhiều năm thiếu thời gian hoặc chu cấp');});
    reconcile(l,s);if(people(l).length>=2){if(s.event&&s.event.paused!==l.age)E.WORLD120.queue(l,'pluralEvent840',r,undefined,{manual:false});else incident(l,s,r);}
  });
  var begin=E.beginYear;E.beginYear=function(l){var s=peek(l);if(s)reconcile(l,s);return begin.apply(this,arguments);};
  var profile=E.profile;E.profile=function(l){
    var out=profile.apply(this,arguments),s=peek(l);
    if(s&&people(l).length>=2)out.jobInfo.push('Gia đình nhiều phối ngẫu\n'+summary(l));
    return out;
  };
  E.PLURAL840={people:people,choices:choices,pairs:pairs,summary:summary,label:label};
})(globalThis.G);

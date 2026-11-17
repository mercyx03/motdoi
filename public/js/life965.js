/* Follow up on childhood activities through existing school, friendship and career systems. */
(function(G){
'use strict';
var E=G.E,H=E.H,U=G.U,X=E.UPDATE110,C=E.CHAIN144,L=E.LIFE138;
function country(l){return H.resCode(l);}
function year(l){return l.birthYear+l.age;}
function digital(l){return !E.ERA902.anachronism(l,'gọi video');}
function phone(l){
 var y=year(l),a=E.ERA920.at(country(l),y);
 return a&&!a.clamped?a.fixed>=.5:y>=1960;
}
function contact(l){return digital(l)?'gọi video':phone(l)?'gọi điện':'viết thư';}
function local(l){
 var code=country(l),y=year(l),place=l.urban,crisis=E.CTX945&&E.CTX945.of(l);
 if(crisis&&(crisis.war>=2||crisis.dis>=2))return {play:'Chơi trò bàn cùng người nhà',work:'Hỏi người quen về việc ở gần nơi đang ở'};
 if(code==='JP')return {play:place?'Đọc sách ở thư viện khu phố':'Chơi cùng bạn ở sân sinh hoạt cộng đồng',work:'Hỏi bảng tuyển người ở khu phố'};
 if(code==='VN')return {play:place?'Đọc sách hoặc chơi cờ cùng bạn':'Chơi ô ăn quan cùng bạn ngoài sân',work:place?'Hỏi các cửa hàng và xưởng quanh phố':'Nhờ người quen giới thiệu việc ở chợ hoặc xưởng gần nhà'};
 if(code==='US'||code==='GB')return {play:place?'Ghé thư viện khu phố':'Chơi thể thao ở sân cộng đồng',work:y<2000?'Đọc mục tuyển người trên báo địa phương':'Xem tin tuyển của cửa hàng và nơi làm việc trong khu vực'};
 return {play:place?'Đọc sách ở phòng đọc hoặc thư viện gần nhà':'Chơi cùng bạn ở chỗ sinh hoạt chung',work:'Hỏi nơi làm việc và người quen trong khu vực'};
}
function free(l){return X.reason(l,6)===true;}
function allFriends(l){return [l.bff].concat(l.friends||[]).filter(function(p){return p&&p.alive!==false&&!p.faded;});}
function peer(l,c){return allFriends(l).find(function(p){return p.uid110===c.data.friend;});}
function lesson(l,c){
 var skill=L.skill(l,c.data.skill);
 skill.level=Math.min(100,skill.level+5);
 skill.interest=true;
}
function invite(l,kind,label){
 if(!free(l)||l.age>17||C.active(l,'childPath965'))return;
 var school=L.school(l),p=school&&L.state(l).people[school.roster[0]],mentor=school&&L.state(l).people[school.homeroom];
 C.start(l,'childPath965',{dec:kind,k:'attend'}, {data:{from:country(l),label:label,skill:kind==='musicLocal963'?'sing':'draw',
   peer:p?{id:p.id,name:p.name,sex:p.sex}:null,mentor:mentor?{id:mentor.id,name:mentor.name}:null}});
}
function intro(l,c){
 if(c.data.from!==country(l)||!c.data.peer)return null;
 var p=c.data.peer,list=l.friends||(l.friends=[]);
 var existing=allFriends(l).find(function(f){return f.school965===p.id||f.name===p.name;});
 if(!existing&&list.filter(function(f){return f.alive!==false;}).length<4){
   existing={name:p.name,sex:p.sex,d:0,since:l.age,close:58,alive:true,from:'hoạt động ở trường',loc:E.locOf(l),school965:p.id};
   list.push(existing);
 }
 if(existing){existing.close=Math.min(100,(existing.close||50)+8);c.data.friend=X.uid(l,existing);}
 return existing;
}
C.define('childPath965',{max:2,stages:[
 {dec:'childMemory965',after:[1,3],p:1,when:free,valid:free,title:'Một kỷ niệm từ năm trước',
 text:function(l,c){return 'Bạn nhớ lại '+c.data.label+'. Bạn có muốn gặp lại người đã quen hay tiếp tục điều mình thích từ hôm đó?';},
 opts:[
  {k:'peer',l:'Hẹn lại bạn cùng lớp',req:function(l,c){return c.data.from===country(l)&&!!c.data.peer;},run:function(l,r,log,c){
    var f=intro(l,c);if(!f)return C.close(l,c,'no-contact',log,'Chưa thu xếp gặp lại bạn.');
    c.data.path='friend';H.mem(l,'Lần gặp lại '+f.name+' sau hoạt động ở trường.',4);
    log('Bạn và '+f.name+' giữ liên lạc sau lần gặp lại.','good');C.advance(l,c,[3,7]);
  }},
  {k:'skill',l:'Luyện tiếp điều mình thích',run:function(l,r,log,c){
    lesson(l,c);c.data.path='skill';log('Bạn dành thời gian luyện tiếp sở thích đã khám phá.','good');C.advance(l,c,[2,5]);
  }},
  {k:'mentor',l:'Hỏi giáo viên về hướng học và việc làm',req:function(l,c){return !!c.data.mentor;},run:function(l,r,log,c){
    c.data.path='mentor';log(c.data.mentor.name+' gợi ý bạn tiếp tục rèn kỹ năng và hẹn trao đổi khi chuẩn bị đi làm.','good');
    var wait=Math.max(2,16-l.age);C.advance(l,c,[wait,wait+10]);
  }},
  {k:'later',l:'Giữ làm kỷ niệm',run:function(l,r,log,c){C.close(l,c,'memory',log,'Bạn giữ lại kỷ niệm từ hôm đó.');}}
 ]},
 {dec:'childOpportunity965',after:[2,6],p:1,when:function(l,c){return free(l)&&(c.data.path!=='mentor'||!l.school);},
 valid:function(l,c){return free(l)&&(c.data.path!=='mentor'||!l.school);},title:'Gặp lại chuyện cũ',
 text:function(l,c){
   var f=peer(l,c);
   if(c.data.path==='friend')return f?f.name+' vẫn nhớ lần hai bạn gặp lại sau hoạt động ở trường.':'Người bạn cũ đã mất liên lạc.';
   if(c.data.path==='mentor')return c.data.mentor.name+' gửi lời hỏi thăm và gợi ý cách tìm một việc phù hợp.';
   return 'Bạn đã dành vài năm giữ sở thích bắt đầu từ '+c.data.label+'.';
 },
 opts:[
  {k:'friend',l:function(l,d){var c=C.chain(l,d.cid),f=c&&peer(l,c);return f&&(f.loc||'HOME')===E.locOf(l)?'Hẹn gặp bạn cũ':'Giữ liên lạc bằng cách '+contact(l);},
   req:function(l,c){return !!peer(l,c);},run:function(l,r,log,c){var f=peer(l,c);f.close=Math.min(100,(f.close||50)+12);H.mem(l,'Bạn vẫn giữ liên lạc với '+f.name+' từ thời đi học.',5);C.close(l,c,'friend',log,'Bạn nối lại liên lạc với '+f.name+'.','good');}},
  {k:'skill',l:'Hoàn thiện một tác phẩm từ sở thích đó',req:function(l,c){return c.data.path==='skill';},
   run:function(l,r,log,c){lesson(l,c);H.mem(l,'Tác phẩm đầu tay từ sở thích tuổi nhỏ.',4);C.close(l,c,'skill',log,'Bạn hoàn thiện một tác phẩm đầu tay và giữ nó làm kỷ niệm.','good');}},
  {k:'job',l:'Xem việc phù hợp tại nơi đang sống',req:function(l,c){return c.data.path==='mentor'&&!!E.DEC.job&&E.DEC.job.valid(l,{requested:true});},
   run:function(l,r,log,c){C.close(l,c,'referred',log,c.data.mentor.name+' giúp bạn biết nên hỏi việc ở đâu.');X.next(l,'job',r);}},
  {k:'later',l:'Nhớ lại và tiếp tục việc của mình',run:function(l,r,log,c){C.close(l,c,'memory',log,'Bạn mỉm cười khi nghĩ về những năm đi học.');}}
 ]}
]});
E.childActivity965=invite;
function contacts(l){return allFriends(l).filter(function(f){return (f.loc||'HOME')!==E.locOf(l);});}
X.menu('localLife965','Sinh hoạt ở nơi đang sống',free,function(l){return (G.W.BY[country(l)]?.name||country(l))+' · '+year(l);},function(l){
 var p=local(l),out=[];
 if(l.flags.play965!==l.age)out.push({k:'play',l:p.play,run:function(l,r,log){
   if(l.flags.play965===l.age)return;
   l.flags.play965=l.age;H.fx(l,{hap:3});log(p.play+'. Bạn có một buổi thư thả.','good');
   if(l.age<=17)invite(l,'localLife965','buổi sinh hoạt ở địa phương');
 }});
 contacts(l).slice(0,5).forEach(function(f){
   var id=X.uid(l,f),label=contact(l);
   out.push({k:id,l:U.cap(label)+' cho '+f.name,why:f.contact965===l.age?'Đã liên lạc năm nay':true,
    run:function(l,r,log){
      var target=contacts(l).find(function(x){return x.uid110===id;});
      if(!target||target.contact965===l.age)return;
      target.contact965=l.age;target.close=Math.min(100,(target.close||50)+5);
      log('Bạn '+label+' cho '+target.name+' và giữ liên lạc dù ở xa.','good');
    }});
 });
 var a=E.ACT.find(function(x){return x.id==='tim_viec';});
 if(a&&E.actAvail(l,a)===true&&l.flags.jobSearch965!==l.age){
   out.push({k:'jobs',l:p.work,run:function(l,r,log){
     if(E.actAvail(l,a)!==true||l.flags.jobSearch965===l.age)return;
     l.flags.jobSearch965=l.age;log('Bạn hỏi thăm các đầu mối tuyển dụng tại nơi đang sống.','neutral');
     X.next(l,'job',r);
   }});
 }
 return out;
},6,'Đời sống');
E.LOCAL965={contact:contact,local:local};
})(globalThis.G);

// 사용 안내 그림용 예시 데이터 (가짜 회원·모임). 실제 데이터 아님.
const now=Date.now(), H=3600e3;
const fa=t=>{const d=new Date(t),p=n=>String(n).padStart(2,"0");return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}.000`;};
const v=(name,ago,extra={})=>[encodeURIComponent(name),{name,status:"attend",at:fa(now-ago*H),...extra}];
const votes=a=>Object.fromEntries(a);
const info=(o)=>({createdAt:now-50*H,createdBy:"하늘",createdByUid:"u2",...o});
const base={
 meetings:{
  m101:{info:info({kind:"flash",flashType:"game",date:"2026-11-14",start:"08:00",end:"10:00",place:"항공대 에어코트",courtNo:"3",capacity:4,guestCap:0,surface:"하드",courtFee:24000,desc:"초보 환영! 끝나고 커피 한잔해요"}),
    votes:votes([v("하늘",40),v("동토리",30),v("민수",20)]),
    comments:{c1:{uid:"u3",name:"민수",text:"저 공 새로 가져갈게요",at:now-10*H},c2:{uid:"u2",name:"하늘",text:"@동토리 주차는 정문 쪽이 편해요",at:now-5*H,mentions:{u1:true}}}},
  m102:{info:info({kind:"flash",flashType:"training",date:"2026-11-11",start:"19:00",end:"21:00",place:"목동 테니스장",courtNo:"5",capacity:4,guestCap:0}),
    votes:votes([v("지수",60),v("유나",55),v("도윤",50),v("서준",45),v("하린",44)])},
  m103:{info:info({kind:"regular",date:"2026-11-15",start:"07:00",end:"10:00",place:"장충 테니스장",courtNo:"1, 2",capacity:12,guestCap:2,openAt:"2026-11-08T21:00",createdBy:"동토리",createdByUid:"u1"}),
    votes:votes([v("동토리",38),v("하늘",37),v("민수",36),v("지수",35),v("유나",34),v("도윤",33),v("서준",32),v("하린",31),v("예준",30)])},
  m104:{info:info({kind:"flash",flashType:"game",date:"2026-11-07",start:"08:00",end:"10:00",place:"마곡 레포츠센터",courtNo:"2",capacity:4}),
    votes:votes([v("동토리",100),v("하늘",99),v("지수",98),v("예준",97)])},
 },
 board:{
  p1:{uid:"u1",name:"동토리",anon:true,text:"백핸드 슬라이스 잘 되는 분, 연습 팁 좀 알려 주세요!",at:now-3*H,likes:{u2:true,u3:true,u4:true},
    comments:{c1:{uid:"u4",name:"지수",anon:true,text:"라켓면 살짝 열고 길게 밀어 보세요",at:now-2*H}}},
  p2:{uid:"u2",name:"하늘",text:"이번 주말 비 소식 있어요. 정기 모임 무산되면 알림 갈 거예요",at:now-20*H,likes:{u1:true}},
  p3:{uid:"u5",name:"유나",text:"마곡 근처 저녁 번개 자주 열어 주세요 🙏",at:now-30*H},
 }};


const M={u1:["동토리","김예시","2.5","2023-03","마곡"],u2:["하늘","김하늘","3.0","2021-05","목동"],u3:["민수","이민수","2.5","2024-01","당산"],u4:["지수","박지수","3.5","2019-09","신정"],u5:["유나","최유나","2.0","2025-02","마곡"],u6:["도윤","정도윤","3.0","2020-07","염창"],u7:["서준","한서준","2.5","2022-11","등촌"],u8:["하린","오하린","3.0","2021-01","화곡"],u9:["예준","윤예준","2.5","2023-08","가양"],u10:["새봄","강새봄","2.0","2025-09","발산"]};
const members={},approved={},nicknames={};
Object.entries(M).forEach(([u,[n,r,nt,ts,rg]],i)=>{ members[u]={nickname:n,realName:r,ntrp:nt,tennisStart:ts,region:rg,hand:i%3?"오른손":"왼손",email:u+"@ex.com",createdAt:now-864e5*(40-i),approvedAt:now-864e5*(39-i),mainGuild:i<4?"g1":""}; if(u!=="u10") approved[u]=true; nicknames[encodeURIComponent(n)]=u; });
// 투표 키를 uid로
const byNick=Object.fromEntries(Object.entries(M).map(([u,a])=>[encodeURIComponent(a[0]),u]));
const meetings=JSON.parse(JSON.stringify(base.meetings));
Object.values(meetings).forEach(m=>{ const v={}; Object.entries(m.votes||{}).forEach(([k,x])=>v[byNick[k]||k]=x); m.votes=v; });
meetings.m103.info.createdByUid="u1";
Object.assign(meetings.m101.info,{createdBy:"동토리",createdByUid:"u1"});
meetings.m105={info:{kind:"flash",flashType:"game",date:"2026-11-12",start:"20:00",end:"22:00",place:"마곡 레포츠센터",courtNo:"4",capacity:4,guestCap:0,guildIds:["g1"],guildId:"g1",createdBy:"하늘",createdByUid:"u2",createdAt:now-6*H},votes:{u2:{name:"하늘",status:"attend",at:"2026-11-10T09:00:00"}}};
// 오늘 새로 올라온 번개 · 비공개 번개 · 엠티(카풀) · 새 댓글
const vt=(u,ago)=>({name:M[u][0],status:"attend",at:fa(now-ago*H)});
meetings.m106={info:{kind:"flash",flashType:"game",date:"2026-11-18",start:"19:00",end:"21:00",place:"당산 테니스장",courtNo:"2",capacity:4,guestCap:0,createdBy:"민수",createdByUid:"u3",createdAt:now-1*H},votes:{u3:vt("u3",1)}};
meetings.m107={info:{kind:"flash",flashType:"game",date:"2026-11-17",start:"20:00",end:"22:00",place:"목동 테니스장",courtNo:"6",capacity:4,guestCap:0,invite:{u1:true,u3:true,u4:true},createdBy:"하늘",createdByUid:"u2",createdAt:now-30*H},votes:{u2:vt("u2",30),u4:vt("u4",20)}};
meetings.m108={info:{kind:"flash",flashType:"mt",date:"2026-11-21",toDate:"2026-11-22",start:"14:00",end:"12:00",place:"가평 테니스 펜션",courtNo:"1, 2",capacity:10,guestCap:0,desc:"1박 2일 테니스 엠티! 저녁은 바비큐",createdBy:"지수",createdByUid:"u4",createdAt:now-40*H},
  votes:{u4:vt("u4",40),u2:vt("u2",39),u1:vt("u1",38),u5:vt("u5",30)},
  carpool:{cars:{u2:{from:"마곡역",time:"12:30",seats:3,riders:{u1:true},at:now-30*H}},need:{u5:{from:"당산역",at:now-20*H}}}};
meetings.m103.comments={c1:{uid:"u4",name:"지수",text:"이번 주 정기 모임 공 제가 챙길게요",at:now-1*H}};
const board={}; Object.entries(base.board).forEach(([k,p])=>board[k]=p);
module.exports={club:{members,approved,admins:{u1:true},nicknames,meetings,board,
 notices:{n1:{title:"SSTC를 앱처럼 쓰는 방법",content:"홈 화면에 추가하면 앱처럼 쓸 수 있어요.\n오른쪽 위 ? 버튼 → 앱처럼 쓰기",important:true,at:now-20*H,by:"동토리",byUid:"u1"},n2:{title:"11월 정기 모임 안내",content:"11월은 매주 토요일 아침 7시 장충이에요.",at:now-60*H,by:"동토리",byUid:"u1"}},
 vip:{u2:true,u1:true},
 guilds:{g1:{name:"새벽조",abbr:"새벽",bg:"#0B1E5B",fg:"#D7F24A",intro:"주말 아침 6시에 치는 사람들",leader:"u2",members:{u2:now-30*864e5,u1:now-20*864e5,u3:now-10*864e5,u4:now-9*864e5},createdAt:now-30*864e5,requests:{u5:{at:now-2*H,name:"유나"}}},
         g2:{name:"불꽃",abbr:"불",bg:"#F97316",fg:"#ffffff",intro:"평일 저녁 랠리 좋아하는 모임",leader:"u4",members:{u4:now,u6:now,u7:now},createdAt:now-15*864e5,invites:{u1:{at:now-1*H,by:"지수"}}}},
 feed:{f1:{type:"attend",to:"u1",meetingId:"103",text:"하린님이 11.15 장충 테니스장 모임에 참석했어요",by:"하린",byUid:"u8",at:now-0.2*H},
       f2:{type:"mention",to:"u1",meetingId:"101",text:"하늘님이 댓글에서 불렀어요: 주차는 정문 쪽이 편해요",by:"하늘",byUid:"u2",at:now-5*H},
       f3:{type:"comment",to:"u1",postId:"p1",text:"내 글에 새 댓글이 달렸어요",at:now-2*H},
       f4:{type:"meeting",meetingId:"101",text:"하늘님이 11.14 번개 모임을 만들었어요",by:"하늘",byUid:"u2",at:now-50*H}},
}};

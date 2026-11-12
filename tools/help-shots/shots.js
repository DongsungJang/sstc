// 사용 안내(물음표) 그림을 다시 찍어요.
//   npm run build && node tools/help-shots/shots.js && npm run build
// - 빌드된 index.html을 Playwright로 열고, 파이어베이스 대신 가짜 저장소(mockfb.js)에 예시 데이터(seed.js)를 넣어 찍어요.
// - 화면을 잘라 help/<이름>.jpg로 저장하고, 노란 테두리 위치와 설명을 src/app.jsx의 HELP 자리에 써 넣어요.
// - React를 cdnjs에서 못 받는 환경이면 REACT_DIR=<react·react-dom UMD 파일이 있는 폴더>를 주세요.
const {chromium}=require('playwright');
const fs=require('fs'), path=require('path'), crypto=require('crypto');
const ROOT=path.join(__dirname,'..','..');
const W=402, VH=874;

// 화면 안 요소 찾기: [글자, 위로 올라갈 단계, 몇 번째, 태그] — 여러 개를 [[...],[...]]로 주면 합친 상자
const FIND=`(specs)=>specs.map(spec=>{ const parts=Array.isArray(spec[0])?spec:[spec]; let r=null;
  for(const [text,up=0,nth=0,tag] of parts){ const txt=e=>(e.textContent||'')+' '+(e.getAttribute('placeholder')||'')+' '+(e.getAttribute('aria-label')||'');
    const all=[...document.querySelectorAll(tag||'body *')].filter(e=>e.getClientRects().length>0&&txt(e).includes(text)&&!(tag?false:[...e.children].some(c=>txt(c).includes(text))));
    let e=all[nth]; if(!e) return null; for(let i=0;i<up;i++) e=e.parentElement; const b=e.getBoundingClientRect();
    r=r?{x:Math.min(r.x,b.x),y:Math.min(r.y,b.y),x2:Math.max(r.x2,b.right),y2:Math.max(r.y2,b.bottom)}:{x:b.x,y:b.y,x2:b.right,y2:b.bottom}; }
  return r; })`;

const tab=t=>async p=>{ await p.locator('div[style*="position: fixed"] button',{hasText:t}).last().click(); await p.waitForTimeout(700); await p.evaluate(()=>scrollTo(0,0)); await p.waitForTimeout(300); };
const scrollToText=(t,off=80)=>async p=>{ await p.evaluate(([t,off])=>{const e=[...document.querySelectorAll('body *')].find(e=>e.offsetParent!==null&&e.textContent.trim()===t);if(e)window.scrollTo(0,e.getBoundingClientRect().top+scrollY-off);},[t,off]); await p.waitForTimeout(400); };
const click=(t,o={})=>async p=>{ await p.getByText(t,o).first().click(); await p.waitForTimeout(700); };
const role=(r,name)=>async p=>{ await p.getByRole(r,{name}).first().click(); await p.waitForTimeout(700); };
const hideBar=async p=>{ await p.addStyleTag({content:'.sstc-hide-bar div[style*="bottom: 0px"][style*="position: fixed"]{display:none!important}'}); await p.evaluate(()=>document.body.classList.add('sstc-hide-bar')); };
const showBar=async p=>{ await p.evaluate(()=>document.body.classList.remove('sstc-hide-bar')); };
const steps=(...fs)=>async p=>{ for(const f of fs) await f(p); };

// 기능별 안내. blocks: 그림 하나 + 번호별 한 줄 설명 (img 없으면 설명만)
const HELP=[
 {id:"home",title:"홈 화면",icon:"home",sub:"앱을 열면 처음 보이는 화면",go:"home",tip:"인사말 옆 연필을 누르면 내 정보를 고칠 수 있어요",blocks:[
   {img:"home-1",prep:tab("홈"),crop:[["참석 예정 모임",3],[["참석 확정이에요"]]],marks:[["참석 예정 모임"],[["참석 중",0,0,"button"],["불참",0,0,"button"]],["참석 확정",1]],
    caps:["내가 갈 가장 가까운 모임","여기서 바로 참석 · 불참","참석 인원 / 정원"]},
   {img:"home-2",crop:[["다가오는 모임"],["목동 테니스장",2]],marks:[["목동 테니스장",2],["전체보기"]],
    caps:["옆으로 밀어서 다음 모임 보기","전체보기를 누르면 예약 탭으로"]},
   {img:"home-3",prep:scrollToText("이달의 참여 랭킹",30),crop:[["이달의 참여 랭킹"],["이달의 참여 랭킹",2]],cropPad:[14,4],marks:[["이달의 참여 랭킹",2]],
    caps:["이번 달 참석 순위와 내 순위 (끝난 모임만 세요)"]}]},
 {id:"booking",title:"모임 예약",icon:"calendar",sub:"모임 찾기와 새 모임 만들기",go:"booking",tip:"달력 점 색: 정기 파랑 · 번개 게임 주황 · 번개 훈련 초록",blocks:[
   {img:"booking-1",prep:tab("예약"),crop:[[60],["무산"]],marks:[["14",0,0,"button"],[["목록",0,0,"button"],["지도",0,0,"button"]]],
    caps:["점 찍힌 날을 누르면 그날 모임","목록 / 지도로 보기"]},
   {img:"booking-2",crop:[["번개 모임",1,0,"button"],["지난 모임"]],marks:[[["번개 모임",0,0,"button"],["정기 모임",0,0,"button"]],["대기 1",0,0,"span"],["새 모임",0,0,"button"]],
    caps:["번개 / 정기 바꾸기","꽉 차면 '대기 n'","+ 새 모임 만들기"]}]},
 {id:"detail",title:"모임 상세",icon:"list",sub:"참석, 공유, 댓글은 여기서",tip:"정기 모임은 이번 달 참석이 적은 회원이 먼저 확정돼요",blocks:[
   {img:"detail-1",prep:steps(tab("예약"),click("항공대 에어코트")),crop:[["모임 정보",0,0,"button"],["참석 확정 · 2번째"]],marks:[[["모임 정보",0,0,"button"],["대진표 · 스코어",0,0,"button"]],[["코트비"],["1인",0]],[["참석 중",0,0,"button"],["불참",0,0,"button"]]],
    caps:["모임 정보 / 대진표 탭","코트비 · 1인 금액은 자동","누르면 참석, 한 번 더 누르면 취소"]},
   {img:"detail-2",prep:scrollToText("늦게 오거나 일찍 가나요?",70),crop:[["늦게 오거나 일찍 가나요?",1],["카톡으로 공유",0,0,"button"]],marks:[["늦게 오거나 일찍 가나요?",1],["게스트 추가",0,0,"button"],["카톡으로 공유",0,0,"button"]],
    caps:["늦게 오거나 일찍 가면 체크","게스트 데려오기","단톡방에 공유"]},
   {img:"detail-3",prep:scrollToText("다른 회원 참석 등록",300),crop:[["댓글 2"],["무산 처리",0,0,"button"]],marks:[["주차는 정문",1],["회원 추가",0,0,"button"],["무산 처리",0,0,"button"]],
    caps:["@닉네임으로 부르면 알림","단톡에서 온다는 회원 대신 넣기","비 오면 무산 처리 (삭제 아님)"]}]},
 {id:"bracket",title:"대진표 · 스코어",icon:"ball",sub:"게임 편성과 점수 기록",tip:"6점 선승 · 5:5 무승부 · 참가자만 만들 수 있어요",blocks:[
   {img:"bracket-1",prep:steps(tab("예약"),role("tab",/정기 모임/),click("장충 테니스장"),role("button",/대진표/)),crop:[["대진표 · 스코어",0,0,"button"],["코트 수",1]],marks:[[["자동 편성",0,0,"button"],["직접 작성",0,0,"button"]],["게임당 시간",1],["코트 수",1]],
    caps:["자동 편성 / 직접 작성","게임당 시간 고르기","코트 수 → 아래 '대진표 만들기'"]}]},
 {id:"members",title:"회원",icon:"users",sub:"회원 찾기와 내 통계",go:"members",tip:"회원 사진을 누르면 크게 보여요",blocks:[
   {img:"members-1",prep:tab("회원"),crop:[[["회원 목록",0,0,"button"]],["6년 4개월차"]],cropPad:[50,16],marks:[[["회원 목록",0,0,"button"],["통계",0,0,"button"]],["닉네임, 본명",0,0,"input"],["정렬 기준",1],[["정도윤"],["6년 4개월차"],["3.0",0,0,"span"]]],
    caps:["회원 목록 / 길드 / 통계","닉네임 · 본명 · 동네로 찾기","정렬 바꾸기","누르면 자세히 (손 · 코트 · 갈 모임)"]},
   {img:"members-2",prep:role("tab","통계"),crop:[["누적 참석"],["월별 참석 횟수"]],cropPad:[56,120],marks:[["누적 참석",1],["월별 참석 횟수",1]],
    caps:["내 누적 참석과 최근 6개월","나와 평균 비교 · 아래에 랭킹, 코트별 통계"]}]},
 {id:"guild",title:"길드",icon:"shield",sub:"마음 맞는 회원끼리 작은 모임",go:"guild",tip:"길드는 우수회원이 만들 수 있어요. 여러 길드에 들어가도 돼요",blocks:[
   {img:"guild-1",prep:steps(role("tab","회원 목록"),role("tab","길드")),crop:[[60],["길드 만들기",0,0,"button"]],cropPad:[0,12],marks:[[["받은 길드 초대"],["수락",0,0,"button"],["님이 초대"]],[["새벽조",0,1],["길드 번개"]],["길드 만들기",0,0,"button"]],
    caps:["받은 초대 수락 · 거절 (아래 회원 탭 위에도 말풍선)","내 길드 · 누르면 길드원 · 모임 · 게시판","우수회원은 길드를 만들 수 있어요"]},
   {img:"guild-2",prep:steps(tab("홈")),crop:[["다가오는 모임"],["마곡 레포츠센터",2]],marks:[["길드 모임",1]],
    caps:["길드 모임은 그 길드원만 보고 참석해요"]}]},
 {id:"board",title:"소곤소곤",icon:"message",sub:"익명으로도 쓰는 게시판",go:"board",tip:"내 글은 고치거나 지울 수 있어요",blocks:[
   {img:"board-1",prep:tab("소곤소곤"),crop:[[60],["이번 주말 비 소식",3]],marks:[["새 글 쓰기",0,0,"button"],["글 내용으로 찾기",0,0,"input"],[["전체",0,0,"button"],["익명",0,0,"button"]],["백핸드 슬라이스",3]],
    caps:["새 글 쓰기 (익명으로도)","글 내용으로 찾기","전체 · 내 글 · 익명 골라 보기","익명 글은 알림에도 이름이 안 남아요"]}]},
 {id:"noti",title:"알림",icon:"bell",sub:"종 버튼에 모이는 소식",tip:"아래 탭의 빨간 +숫자는 그 탭에 새로 올라온 것이에요",blocks:[
   {img:"noti-1",prep:steps(tab("홈"),async p=>{await p.getByRole('button',{name:/^알림/}).first().click();await p.waitForTimeout(800);}),crop:[["알림",0,0,"p"],["모임을 만들었어요",2]],cropPad:[20,14],marks:[["참석했어요",2],["새 댓글",2],["불렀어요",2]],
    caps:["내 모임에 누가 참석했을 때","내 글에 댓글이 달렸을 때","댓글에서 @로 불렸을 때 · 누르면 그 모임 · 글로"]}]},
 {id:"me",title:"내 정보",icon:"user",sub:"사진, NTRP, 구력, 닉네임",tip:"닉네임은 한글 1~10자, 중복 확인 후 바꿀 수 있어요",blocks:[
   {img:"me-1",prep:steps(async p=>{await p.keyboard.press('Escape');await p.goto(p.url());await p.waitForTimeout(1500);const b=p.getByText('시작하기');if(await b.count())await b.first().click();await p.waitForTimeout(1200);await p.getByRole('button',{name:'내 정보 메뉴'}).click();await p.waitForTimeout(600);}),crop:[[0],["로그아웃",0,0,"button"]],cropPad:[0,14],marks:[["내 정보 수정",0,1,"button"],["로그아웃",0,0,"button"]],
    caps:["사진 · NTRP · 구력 · 동네 고치기","로그아웃"]}]},
 {id:"app",title:"앱처럼 쓰기",icon:"phone",sub:"홈 화면에 추가와 업데이트",tip:"'새 버전이 있어요'가 뜨면 업데이트를 누르고, 그래도 그대로면 앱을 완전히 껐다 켜 주세요",blocks:[],
  // 휴대폰·브라우저별 단계 (그림은 실제 휴대폰 캡처를 잘라 help/app-*.jpg로 둠, 찍지 않고 그대로 씀)
  tabs:[{"key":"ios-chrome","label":"크롬","blocks":[{"img":"app-chrome-1","w":600,"h":287,"marks":[[76.7,9.1,6.7,15.5]],"caps":["주소창 오른쪽 공유 버튼 누르기"]},{"img":"app-chrome-2","w":600,"h":554,"marks":[[74.1,63.3,17.4,25.5]],"caps":["'더 보기' 누르기"]},{"img":"app-chrome-3","w":600,"h":646,"marks":[[4.1,63.6,92.0,12.1]],"caps":["'홈 화면에 추가' 누르기"]},{"img":"app-chrome-4","w":600,"h":450,"marks":[[80.0,4.9,16.5,15.9]],"caps":["오른쪽 위 '추가' 누르면 끝"]}],"os":"ios"},{"key":"ios-safari","label":"사파리","blocks":[{"img":"app-safari-1","w":600,"h":404,"marks":[[22.4,71.3,12.2,15.2]],"caps":["주소창 왼쪽 ☰ 버튼 누르기"]},{"img":"app-safari-2","w":600,"h":372,"marks":[[26.1,29.5,52.2,17.0]],"caps":["'공유' 누르기"]},{"img":"app-safari-3","w":600,"h":404,"marks":[[4.1,76.6,92.0,19.4]],"caps":["'홈 화면에 추가' 누르기 (안 보이면 '더 보기')"]},{"img":"app-safari-4","w":600,"h":450,"marks":[[80.0,4.9,16.5,15.9]],"caps":["오른쪽 위 '추가' 누르면 끝"]}],"os":"ios"},{"key":"and-chrome","os":"android","label":"크롬","blocks":[{"caps":["오른쪽 위 ⋮ 누르기","'홈 화면에 추가' 누르기","'설치' 또는 '추가' 누르면 끝"]}]},{"key":"and-samsung","os":"android","label":"삼성 인터넷","blocks":[{"caps":["아래 ☰ 메뉴 누르기","'현재 페이지 추가' → '홈 화면' 누르기","'추가' 누르면 끝"]}]}]},
 {id:"admin",title:"관리자 기능",icon:"gear",sub:"관리자에게만 보여요",go:"admin",admin:true,tip:"홈의 '관리자 모드' 버튼으로 회원 화면을 확인할 수 있어요",blocks:[
   {img:"admin-1",prep:tab("관리"),crop:[[60],["길드 관리",2]],cropPad:[0,10],marks:[["승인 대기",2],["접속 팝업",2],["정회원 관리",2],["길드 관리",2]],
    caps:["새 가입자 승인","앱 열 때 뜨는 안내 창","정회원 · 우수회원 · 탈퇴 관리","길드 관리 (아래에 코트비 · 홈 배너)"]}]},
];

(async()=>{
  const seed=require('./seed.js');
  const mock=fs.readFileSync(path.join(__dirname,'mockfb.js'),'utf8');
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:W,height:VH},deviceScaleFactor:2});
  p.on('pageerror',e=>console.log('page error:',e.message));
  await p.route('**/firebase-config.js',r=>r.fulfill({body:'',contentType:'text/javascript'}));
  await p.route('**/firebase-app-compat.min.js',r=>r.fulfill({body:'window.__SEED='+JSON.stringify(seed)+';'+mock,contentType:'text/javascript'}));
  await p.route(/firebase-(database|auth)-compat\.min\.js/,r=>r.fulfill({body:'',contentType:'text/javascript'}));
  if(process.env.REACT_DIR){
    await p.route('**/react.production.min.js',r=>r.fulfill({path:path.join(process.env.REACT_DIR,'react.production.min.js')}));
    await p.route('**/react-dom.production.min.js',r=>r.fulfill({path:path.join(process.env.REACT_DIR,'react-dom.production.min.js')}));
  }
  await p.addInitScript(()=>{ try{ localStorage.setItem('sstc-admin-view','member'); }catch(e){} });
  await p.goto('file://'+path.join(ROOT,'index.html')); await p.waitForTimeout(2000);
  const st=p.getByText('시작하기'); if(await st.count()) await st.first().click(); await p.waitForTimeout(1500);
  const outDir=path.join(ROOT,'help'); fs.mkdirSync(outDir,{recursive:true});
  const hash=crypto.createHash('sha1');
  for(const h of HELP){
    if(h.admin){ await p.evaluate(()=>localStorage.setItem('sstc-admin-view','admin')); await p.addInitScript(()=>{ try{ localStorage.setItem('sstc-admin-view','admin'); }catch(e){} }); await p.goto(p.url()); await p.waitForTimeout(1500); const s2=p.getByText('시작하기'); if(await s2.count()) await s2.first().click(); await p.waitForTimeout(1500); }
    for(const bl of h.blocks){
      if(!bl.img) continue;
      if(bl.prep) await bl.prep(p);
      await p.waitForTimeout(400);
      const box=s=>typeof s[0]==="number"?{y:s[0],y2:s[0]}:null;
      const [cTop,cBot]=bl.crop;
      const found=await p.evaluate(`(${FIND})(${JSON.stringify([cTop,cBot].filter(s=>typeof s[0]!=="number"))})`);
      let k=0; const top=box(cTop)||found[k++], bot=box(cBot)||found[k++];
      if(!top||!bot){ console.log('못 찾음(자르기):',bl.img,cTop,cBot,found); continue; }
      const [pt,pb]=bl.cropPad||[12,12];
      const y0=Math.max(0,Math.round(top.y-pt)), y1=Math.min(VH,Math.round(bot.y2+pb));
      const marks=await p.evaluate(`(${FIND})(${JSON.stringify(bl.marks)})`);
      bl.w=W; bl.h=y1-y0;
      bl.m=marks.map((m,i)=>{ if(!m){ console.log('못 찾음(표시):',bl.img,JSON.stringify(bl.marks[i])); return null; }
        const pad=3, x=Math.max(1,m.x-pad), y=Math.max(1,m.y-pad-y0), x2=Math.min(W-1,m.x2+pad), yb=Math.min(bl.h-1,m.y2+pad-y0);
        const r=v=>Math.round(v*10)/10; return [r(x/W*100),r(y/bl.h*100),r((x2-x)/W*100),r((yb-y)/bl.h*100)]; });
      const file=path.join(outDir,bl.img+'.jpg');
      await hideBar(p); await p.waitForTimeout(150);
      await p.screenshot({path:file,type:'jpeg',quality:80,clip:{x:0,y:y0,width:W,height:bl.h}});
      await showBar(p);
      hash.update(fs.readFileSync(file));
      console.log('찍음',bl.img,`${W}x${bl.h}`,'표시',bl.m.filter(Boolean).length+'/'+bl.marks.length);
    }
    if(h.admin) await p.evaluate(()=>localStorage.setItem('sstc-admin-view','member'));
  }
  await b.close();
  const data=HELP.map(h=>({id:h.id,title:h.title,icon:h.icon,sub:h.sub,...(h.go?{go:h.go}:{}),...(h.admin?{admin:true}:{}),tip:h.tip,
    blocks:h.blocks.map(bl=>bl.img?{img:bl.img,w:bl.w,h:bl.h,marks:(bl.m||[]).filter(Boolean),caps:bl.caps}:{caps:bl.caps}),...(h.tabs?{tabs:h.tabs}:{})}));
  const ver=hash.digest('hex').slice(0,8);
  const appPath=path.join(ROOT,'src','app.jsx'); let src=fs.readFileSync(appPath,'utf8');
  src=src.replace(/\/\*HELP_DATA_START\*\/[\s\S]*?\/\*HELP_DATA_END\*\//,
    '/*HELP_DATA_START*/\nconst HELP_VER='+JSON.stringify(ver)+';\nconst HELP=[\n'+data.map(d=>'  '+JSON.stringify(d)).join(',\n')+'\n];\n/*HELP_DATA_END*/');
  fs.writeFileSync(appPath,src);
  console.log('src/app.jsx HELP 갱신, 그림 버전',ver);
})();

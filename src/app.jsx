import { useState, useRef, useEffect } from "react";

// ─── 테마 (파란색 기본) ──────────────────────────────────────────────────────
const BLUE = "#3B63F3";
const BLUE_DEEP = "#2F4FD8";
const BLUE_LIGHT = "#EEF2FF";
const GRAD = "linear-gradient(135deg,#5B8DEF 0%,#3B63F3 55%,#2F4FD8 100%)";
const SHADOW = "0 6px 24px rgba(40,70,180,0.08)";
const SHADOW_BTN = "0 8px 18px rgba(59,99,243,0.28)";
const FONT = "'Poppins','Noto Sans KR',-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo',sans-serif";

// ─── 아이콘 (선 아이콘) ─────────────────────────────────────────────────────
const ICON_PATHS = {
  home:["M3 10.5 12 3l9 7.5","M5 9.5V20h5v-6h4v6h5V9.5"],
  back:["M15 5l-7 7 7 7"],
  calendar:["M4 6h16v14H4z","M4 10h16","M8 3v4","M16 3v4"],
  chart:["M4 20V10","M10 20V4","M16 20v-7","M22 20H2"],
  bell:["M6 16V11a6 6 0 0 1 12 0v5l2 2H4z","M10 20a2 2 0 0 0 4 0"],
  user:["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z","M4 21a8 8 0 0 1 16 0"],
};
function Icon({name,size=22,color="currentColor",stroke=2}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICON_PATHS[name].map((d,i)=><path key={i} d={d}/>)}
    </svg>
  );
}

// ─── 상수 데이터 ──────────────────────────────────────────────────────────────
const REGIONS = [
  "서울시 강남구","서울시 강동구","서울시 강북구","서울시 강서구","서울시 관악구",
  "서울시 광진구","서울시 구로구","서울시 금천구","서울시 노원구","서울시 도봉구",
  "서울시 동대문구","서울시 동작구","서울시 마포구","서울시 서대문구","서울시 서초구",
  "서울시 성동구","서울시 성북구","서울시 송파구","서울시 양천구","서울시 영등포구",
  "서울시 용산구","서울시 은평구","서울시 종로구","서울시 중구","서울시 중랑구",
  "타지역",
];

const NTRP_LEVELS = [
  { score:"1.0", label:"입문",   desc:"테니스를 처음 배우기 시작하는 단계예요." },
  { score:"1.5", label:"초급-",  desc:"아직 테니스에 대한 경험이 부족하고 공을 넘기기에 급급한 단계예요." },
  { score:"2.0", label:"초급",   desc:"포핸드 스윙이 완벽하지 않고 방향 조절이 어려워요.\n백핸드는 치기를 기피하고 그립 잡는 데 문제가 생겨요.\n서브 동작이 불안정하고 더블 폴트를 자주 해요." },
  { score:"2.5", label:"초중급", desc:"포핸드 폼이 좋아지고 일반 속도 공에 대비가 갖춰져요.\n백핸드는 그립·준비자세에 문제가 있고 포핸드로 치는 경우가 많아요.\n느린 랠리는 유지되지만 커버 범위가 짧아요." },
  { score:"3.0", label:"중급-",  desc:"포핸드는 비교적 원하는 방향으로 보낼 수 있지만 깊이 조절이 부족해요.\n백핸드는 일반 속도 공을 어느 정도 꾸준히 칠 수 있어요.\n포핸드 발리는 안정적이지만 백발리 실수가 많아요." },
  { score:"3.5", label:"중급",   desc:"포핸드는 다양한 샷을 일관되게 원하는 방향으로 보낼 수 있고, 스핀을 넣기 시작해요.\n백핸드는 방향 조절을 시작했지만 강한 공은 어렵고 방어적으로 대처해요.\n복식에서 네트로 뛰어나갈 기회를 찾기 시작해요." },
  { score:"4.0", label:"중상급", desc:"포핸드는 신뢰할 만한 수준으로 깊이·방향을 컨트롤해요.\n백핸드는 방향·깊이를 조절하며 꾸준히 칠 수 있고 스핀을 넣기 시작해요.\n공격적으로 네트를 점령하고 위너를 노릴 수 있어요." },
  { score:"4.5", label:"상급",   desc:"포핸드는 매우 신뢰할 만한 수준으로 스피드·스핀·깊이를 효과적으로 사용해요.\n더블 폴트 거의 없이 공격적인 서브를 넣고 다양한 스타일의 게임을 펼쳐요." },
  { score:"5.0", label:"고급",   desc:"컨트롤·깊이·스핀을 조절해 강한 스트로크를 구사해요.\n상대에 따라 게임 운영을 바꾸는 확률 테니스를 구사해요." },
  { score:"5.0+",label:"5.0 이상",desc:"5.0을 초과하는 수준으로, 동호인 최상급 또는 전·현직 선수에 준하는 실력이에요." },
  { score:"선출", label:"선출",  desc:"중·고·대학교 테니스부 등 학교 선수 출신이에요." },
];

// 공지사항 (아직 작성 기능 없음)
const NOTICES = [];

// 회원 NTRP (투표에 같이 저장된 값으로 채움)
const MEMBER_NTRP = {};

// ─── 모임 목록 ────────────────────────────────────────────────────────────────
// 모임은 club/meetings/m<id>에 저장해요: info(날짜·시간·장소·정원·예약 오픈·설명), votes(<회원 키>: 참석 투표), bracket, scores.
// MEETINGS는 그 기록을 화면에서 쓰기 좋게 바꾼 목록이고, App이 실시간으로 다시 채워요.
let MEETINGS = [];
const WEEK = ["일","월","화","수","목","금","토"];
const pad0 = n => String(n).padStart(2,"0");
const ymd = d => `${d.getFullYear()}-${pad0(d.getMonth()+1)}-${pad0(d.getDate())}`;
const todayYmd = () => ymd(new Date());
// "2026-11-07" → "2026.11.07 (토)"
const fmtDate = iso => { if(!iso) return ""; const d=new Date(iso+"T00:00:00"); return `${iso.replace(/-/g,".")} (${WEEK[d.getDay()]})`; };
// "2026-10-31T00:00" → "2026.10.31 (토) 00:00"
const fmtOpen = at => at?`${fmtDate(at.slice(0,10))} ${at.slice(11,16)}`:"바로 열림";
// 투표 기록 → resolveVotes가 쓰는 줄 (참석만, 게스트는 초대한 회원 뒤에 따로)
function votesFromRec(rec){
  const out=[];
  Object.keys((rec&&rec.votes)||{}).forEach(key=>{
    const v=rec.votes[key];
    if(!v||v.status!=="attend"||!v.at) return;
    if(v.ntrp&&!MEMBER_NTRP[v.name]) MEMBER_NTRP[v.name]=v.ntrp;
    out.push({key,name:v.name,ntrp:v.ntrp||"",at:v.at});
    (v.guests||[]).forEach(g=>g&&g.name&&out.push({key,name:g.name,ntrp:"",at:g.at||v.at,guestOf:v.name}));
  });
  return out;
}
function toMeeting(id,rec){
  const info=rec.info, today=todayYmd();
  return { id, rec, info, date:fmtDate(info.date), iso:info.date, time:`${info.start} ~ ${info.end}`, place:info.place,
    capacity:+info.capacity||0, desc:info.desc||"", openAt:info.openAt||"", openDate:fmtOpen(info.openAt),
    status:info.date<today?"past":"upcoming", createdBy:info.createdBy||"", createdByUid:info.createdByUid||"",
    votes:votesFromRec(rec) };
}
// 다가오는 모임은 가까운 날짜부터, 지난 모임은 최근 것부터
function buildMeetings(all){
  const list=Object.keys(all||{}).filter(k=>/^m\d+$/.test(k)&&all[k]&&all[k].info&&all[k].info.date)
    .map(k=>toMeeting(+k.slice(1),all[k]));
  const up=list.filter(m=>m.status==="upcoming").sort((a,b)=>a.iso<b.iso?-1:a.iso>b.iso?1:0);
  const past=list.filter(m=>m.status==="past").sort((a,b)=>a.iso<b.iso?1:a.iso>b.iso?-1:0);
  MEETINGS=[...up,...past];
  refreshAttendance();
  return MEETINGS;
}
function refreshAttendance(){ MEETINGS.forEach(m=>{const r=resolveVotes(m,m.votes);m.attendees=r.confirmed;m.waitlist=r.waitlist;}); }
// 이미 열린(오늘 포함) 모임, 참석 횟수, 랭킹 — 홈·통계에서 씀 (게스트 제외)
const heldMeetings=()=>MEETINGS.filter(m=>m.iso<=todayYmd());
const myHeld=()=>heldMeetings().filter(m=>(m.attendees||[]).some(a=>a.isMe));
function rankingOf(list){
  const c={};
  list.forEach(m=>(m.attendees||[]).forEach(v=>{ if(!v.isGuest) c[v.name]=(c[v.name]||0)+1; }));
  return Object.keys(c).sort((a,b)=>c[b]-c[a]||a.localeCompare(b,"ko")).map(name=>{
    const rank=1+Object.keys(c).filter(n=>c[n]>c[name]).length;
    return {rank,name,count:c[name],ntrp:MEMBER_NTRP[name]||"-",badge:["","🥇","🥈","🥉"][rank]||"",isMe:name===ME};
  });
}
const dDay=iso=>{ const d=Math.round((new Date(iso+"T00:00:00")-new Date(todayYmd()+"T00:00:00"))/86400000); return d===0?"D-DAY":`D-${d}`; };
const isOpen=m=>!m.openAt||nowAt().slice(0,16)>=m.openAt;

// ─── 참석 투표 우선순위 ───────────────────────────────────────────────────────
// 참석 횟수는 달마다 새로 셈. 정원 안에서는 선착순이 기본이지만,
//  ① 게스트는 최우선
//  ② 이달 참석이 2회 이하인 회원 (이번이 1~2번째)
//  ③ 이달 이미 2회 참석해서 이번이 3번째 이상인 회원 (2회 초과자)
// 순서로 줄을 세우고, 같은 그룹 안에서는 투표 시각 순이에요. 정원 밖은 같은 순서로 대기.
let ME = "동토리";   // 로그인하면 그 회원의 닉네임으로 바뀜 (setMe)
const MONTHLY_PRIORITY_LIMIT = 2;
// 회원가입 때 맞게 넣어야 하는 가입 코드 (대소문자·앞뒤 공백 무시)
const JOIN_CODE = "SSTC2027";
const dayKey = m => m.date.slice(0,10);
const monthKey = m => m.date.slice(0,7);
const byTime = (a,b) => a.at<b.at?-1:a.at>b.at?1:0;
// 이 모임 전에 같은 달 모임에서 참석 확정된 횟수 (게스트 제외)
function monthCountsBefore(meeting) {
  const counts={};
  MEETINGS.filter(m=>monthKey(m)===monthKey(meeting)&&dayKey(m)<dayKey(meeting))
    .sort((a,b)=>dayKey(a)<dayKey(b)?-1:1)
    .forEach(m=>resolveVotes(m,m.votes).confirmed.forEach(v=>{ if(!v.isGuest) counts[v.name]=(counts[v.name]||0)+1; }));
  return counts;
}
function resolveVotes(meeting,votes) {
  const counts=monthCountsBefore(meeting);
  const ranked=votes.map(v=>{
    const isGuest=!!v.guestOf, count=isGuest?0:(counts[v.name]||0);
    return {...v,isGuest,isMe:v.name===ME&&!isGuest,count,tier:isGuest?0:count>=MONTHLY_PRIORITY_LIMIT?2:1};
  }).sort((a,b)=>a.tier-b.tier||byTime(a,b));
  const confirmed=ranked.slice(0,meeting.capacity), waitlist=ranked.slice(meeting.capacity);
  // 순수 선착순이었다면 정원 안에 들었을 대기자 = 우선순위 때문에 밀린 사람
  const fcfs=new Set(votes.slice().sort(byTime).slice(0,meeting.capacity).map(v=>v.name+"|"+(v.guestOf||"")));
  waitlist.forEach(v=>{v.bumped=fcfs.has(v.name+"|"+(v.guestOf||""));});
  return {confirmed,waitlist,counts};
}
const fmtAt = at => `${+at.slice(5,7)}/${+at.slice(8,10)} ${at.slice(11,19)}`;
const nowAt = () => { const d=new Date(),p=n=>String(n).padStart(2,"0");
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`; };


function calcCareer(startDate) {
  if (!startDate) return "";
  const start = new Date(startDate + "-01");
  const now = new Date();
  let months = (now.getFullYear()-start.getFullYear())*12+(now.getMonth()-start.getMonth());
  if (months < 0) return "";
  const y = Math.floor(months/12), m = months%12;
  if (y===0) return `${m}개월차`;
  if (m===0) return `${y}년차`;
  return `${y}년 ${m}개월차`;
}

// ─── 공통 UI ──────────────────────────────────────────────────────────────────
const inputStyle = {width:"100%",border:"1.5px solid #D6DEF7",borderRadius:999,padding:"11px 16px",fontSize:14,outline:"none",boxSizing:"border-box",background:"#fff",color:"#1B2559",fontFamily:"inherit"};
const btnPrimary = {width:"100%",padding:"13px 0",background:GRAD,color:"#fff",border:"none",borderRadius:999,fontSize:15,fontWeight:600,cursor:"pointer",boxShadow:SHADOW_BTN,letterSpacing:"0.02em"};
const btnSecondary = {flex:1,padding:"13px 0",background:"#fff",color:BLUE,border:"1.5px solid #D6DEF7",borderRadius:999,fontSize:15,fontWeight:600,cursor:"pointer"};
const btnSmall = {padding:"10px 14px",background:BLUE,color:"#fff",border:"none",borderRadius:999,fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"};

function FieldWrap({label,required,error,children}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:4}}>
      <div style={{fontSize:14,fontWeight:500,color:"#2B3674"}}>{label}{required&&<span style={{color:"#ef4444"}}> *</span>}</div>
      {children}
      {error&&<p style={{fontSize:12,color:"#ef4444",margin:0}}>{error}</p>}
    </div>
  );
}

function CheckGroup({options,selected,onChange,multi=true}) {
  const toggle = val => multi
    ? onChange(selected.includes(val)?selected.filter(v=>v!==val):[...selected,val])
    : onChange([val]);
  return (
    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
      {options.map(opt=>{const on=selected.includes(opt);return(
        <button key={opt} type="button" onClick={()=>toggle(opt)}
          style={{padding:"6px 14px",borderRadius:20,fontSize:13,cursor:"pointer",
            border:`1px solid ${on?BLUE:"#D6DEF7"}`,background:on?BLUE:"#fff",color:on?"#fff":"#4A5578"}}>{opt}</button>
      );})}
    </div>
  );
}

function Card({children,style={}}) {
  return <div style={{background:"#fff",borderRadius:22,padding:18,boxShadow:SHADOW,...style}}>{children}</div>;
}

function SectionTitle({children,action,onAction}) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <span style={{fontSize:15,fontWeight:700,color:"#1B2559"}}>{children}</span>
      {action&&<button type="button" onClick={onAction} style={{background:"none",border:"none",fontSize:12,color:BLUE,cursor:"pointer",fontWeight:600}}>{action} →</button>}
    </div>
  );
}

function StepIndicator({current}) {
  const steps = ["계정 정보","프로필","운동 정보"];
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginBottom:28}}>
      {steps.map((label,i)=>{
        const idx=i+1,done=idx<current,active=idx===current;
        return (
          <div key={i} style={{display:"flex",alignItems:"center"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:"bold",
                border:`2px solid ${done?"#5B8DEF":active?BLUE:"#D6DEF7"}`,
                background:done?"#5B8DEF":active?BLUE:"#fff",
                color:done||active?"#fff":"#A3AAC2"}}>{done?"✓":idx}</div>
              <span style={{fontSize:11,whiteSpace:"nowrap",color:active?BLUE:"#A3AAC2",fontWeight:active?600:400}}>{label}</span>
            </div>
            {i<steps.length-1&&<div style={{width:48,height:2,background:done?"#A9BCFF":"#E4E9F7",marginBottom:20,marginLeft:4,marginRight:4}}/>}
          </div>
        );
      })}
    </div>
  );
}

// ─── 로그인 ───────────────────────────────────────────────────────────────────
function LoginScreen({onSignup,onForgot,onLogin}) {
  const [email,setEmail]=useState("");
  const [pw,setPw]=useState("");
  const [vis,setVis]=useState(false);
  const [err,setErr]=useState("");

  const [busy,setBusy]=useState(false);
  const handle = () => {
    if (!FB) {   // 데모: 빈칸으로도 통과
      if (email==="" && pw==="") { onLogin(); return; }
      if (!email||!pw){setErr("이메일과 비밀번호를 입력해주세요");return;}
      onLogin(); return;
    }
    if (!email||!pw){setErr("이메일과 비밀번호를 입력해주세요");return;}
    setBusy(true);setErr("");
    FB.auth.signInWithEmailAndPassword(email.trim(),pw).catch(e=>{setErr(authMsg(e));setBusy(false);});
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <FieldWrap label="이메일">
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="example@email.com" style={inputStyle}/>
      </FieldWrap>
      <FieldWrap label="비밀번호">
        <div style={{position:"relative"}}>
          <input type={vis?"text":"password"} value={pw} onChange={e=>setPw(e.target.value)} placeholder="비밀번호 입력" style={{...inputStyle,paddingRight:50}}/>
          <button type="button" onClick={()=>setVis(v=>!v)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",fontSize:12,color:"#A3AAC2",cursor:"pointer"}}>{vis?"숨김":"보기"}</button>
        </div>
      </FieldWrap>
      {err&&<p style={{fontSize:13,color:"#ef4444",margin:0}}>{err}</p>}
      <button type="button" onClick={handle} disabled={busy} style={{...btnPrimary,marginTop:4,opacity:busy?0.6:1}}>{busy?"로그인 중…":"로그인"}</button>
      <div style={{display:"flex",justifyContent:"center",gap:16,marginTop:4}}>
        <button type="button" onClick={onSignup} style={{background:"none",border:"none",fontSize:13,color:BLUE,fontWeight:600,cursor:"pointer"}}>회원가입</button>
        <span style={{color:"#D6DEF7",fontSize:13}}>|</span>
        <button type="button" onClick={onForgot} style={{background:"none",border:"none",fontSize:13,color:"#6B7493",cursor:"pointer"}}>비밀번호 찾기</button>
      </div>
      {!FB&&<p style={{margin:0,fontSize:11,color:"#D6DEF7",textAlign:"center"}}>데모: 빈칸으로 로그인</p>}
    </div>
  );
}

// ─── 비밀번호 찾기 ────────────────────────────────────────────────────────────
function ForgotScreen({onBack}) {
  const [name,setName]=useState("");
  const [phone,setPhone]=useState("");
  const [sent,setSent]=useState(false);
  const [err,setErr]=useState("");
  const fmt=v=>{const d=v.replace(/\D/g,"").slice(0,11);if(d.length<=3)return d;if(d.length<=7)return`${d.slice(0,3)}-${d.slice(3)}`;return`${d.slice(0,3)}-${d.slice(3,7)}-${d.slice(7)}`;};
  const [email,setEmail]=useState("");
  const handle=()=>{
    if(FB){ if(!email){setErr("가입한 이메일을 입력해주세요");return;}
      FB.auth.sendPasswordResetEmail(email.trim()).then(()=>setSent(true)).catch(e=>setErr(authMsg(e))); return; }
    if(!name||!phone){setErr("모두 입력해주세요");return;}setSent(true);};
  if(FB&&!sent) return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <p style={{margin:0,fontSize:14,color:"#6B7493",lineHeight:1.6}}>가입한 이메일로 비밀번호를 다시 정하는 링크를 보내드려요.</p>
      <FieldWrap label="이메일" required><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="example@email.com" style={inputStyle}/></FieldWrap>
      {err&&<p style={{fontSize:13,color:"#ef4444",margin:0}}>{err}</p>}
      <button type="button" onClick={handle} style={{...btnPrimary,marginTop:4}}>재설정 링크 받기</button>
      <button type="button" onClick={onBack} style={{background:"none",border:"none",fontSize:13,color:"#6B7493",cursor:"pointer",textAlign:"center"}}>← 로그인으로 돌아가기</button>
    </div>
  );
  if(sent) return(
    <div style={{textAlign:"center",padding:"24px 0",display:"flex",flexDirection:"column",gap:16}}>
      <div style={{fontSize:48}}>📧</div>
      <h3 style={{margin:0,color:BLUE,fontSize:18}}>{FB?"재설정 메일을 보냈어요":"임시 비밀번호 발송 완료"}</h3>
      <p style={{margin:0,fontSize:14,color:"#6B7493",lineHeight:1.6}}>{FB?<>메일함(스팸함 포함)에서 링크를 눌러<br/>새 비밀번호를 정해 주세요.</>:<>가입 시 등록한 이메일로<br/>임시 비밀번호를 보내드렸어요.</>}</p>
      <button type="button" onClick={onBack} style={{...btnPrimary,marginTop:8}}>로그인으로 돌아가기</button>
    </div>
  );
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <p style={{margin:0,fontSize:14,color:"#6B7493",lineHeight:1.6}}>가입 시 입력한 이름과 연락처로 본인 확인 후<br/>등록된 이메일로 임시 비밀번호를 보내드려요.</p>
      <FieldWrap label="이름" required><input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="실명 입력" style={inputStyle}/></FieldWrap>
      <FieldWrap label="연락처" required><input type="tel" value={phone} onChange={e=>setPhone(fmt(e.target.value))} placeholder="010-0000-0000" style={inputStyle}/></FieldWrap>
      {err&&<p style={{fontSize:13,color:"#ef4444",margin:0}}>{err}</p>}
      <button type="button" onClick={handle} style={{...btnPrimary,marginTop:4}}>임시 비밀번호 받기</button>
      <button type="button" onClick={onBack} style={{background:"none",border:"none",fontSize:13,color:"#6B7493",cursor:"pointer",textAlign:"center"}}>← 로그인으로 돌아가기</button>
    </div>
  );
}

// ─── 회원가입 STEP 1 ──────────────────────────────────────────────────────────
function Step1({data,onChange,onNext,isAdmin}) {
  const [errors,setErrors]=useState({});
  const [vis,setVis]=useState(false);
  const [emailChecked,setEmailChecked]=useState(false);
  const [emailMsg,setEmailMsg]=useState("");

  const checkEmail=()=>{
    if(!data.email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)){setErrors(p=>({...p,email:"올바른 이메일을 먼저 입력해주세요"}));return;}
    setEmailChecked(true);setErrors(p=>({...p,email:undefined}));setEmailMsg(FB?"✓ 쓸 수 있는 형식이에요 (이미 가입된 이메일이면 가입 완료 때 알려드려요)":"✓ 사용 가능한 이메일이에요");
  };
  const validate=()=>{
    if(isAdmin) return true;
    const e={};
    if(!data.email) e.email="이메일을 입력해주세요";
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email="올바른 이메일 형식이 아니에요";
    else if(!emailChecked) e.email="이메일 중복 확인을 해주세요";
    if(!data.password) e.password="비밀번호를 입력해주세요";
    else if(data.password.length<8) e.password="8자 이상 입력해주세요";
    if(data.password!==data.passwordConfirm) e.passwordConfirm="비밀번호가 일치하지 않아요";
    if(!data.inviteCode) e.inviteCode="가입 코드를 입력해주세요";
    else if(data.inviteCode.trim().toUpperCase()!==JOIN_CODE) e.inviteCode="가입 코드가 맞지 않아요";
    setErrors(e);return Object.keys(e).length===0;
  };
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      {isAdmin&&<div style={{background:"#fef9c3",border:"1px solid #fde047",borderRadius:10,padding:"8px 14px",fontSize:12,color:"#a16207"}}>👑 관리자 모드 — 필수 입력값을 건너뛸 수 있어요</div>}
      <FieldWrap label="이메일" required={!isAdmin} error={errors.email}>
        <div style={{display:"flex",gap:8}}>
          <input type="email" value={data.email} style={inputStyle} onChange={e=>{onChange("email",e.target.value);setEmailChecked(false);setEmailMsg("");}} placeholder="example@email.com"/>
          <button type="button" onClick={checkEmail} style={btnSmall}>중복확인</button>
        </div>
        {emailMsg&&<p style={{fontSize:12,color:BLUE,fontWeight:600,margin:0}}>{emailMsg}</p>}
      </FieldWrap>
      <FieldWrap label="비밀번호" required={!isAdmin} error={errors.password}>
        <div style={{position:"relative"}}>
          <input type={vis?"text":"password"} value={data.password} onChange={e=>onChange("password",e.target.value)} placeholder="8자 이상" style={{...inputStyle,paddingRight:50}}/>
          <button type="button" onClick={()=>setVis(v=>!v)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",fontSize:12,color:"#A3AAC2",cursor:"pointer"}}>{vis?"숨김":"보기"}</button>
        </div>
      </FieldWrap>
      <FieldWrap label="비밀번호 확인" required={!isAdmin} error={errors.passwordConfirm}>
        <input type="password" value={data.passwordConfirm} style={inputStyle} onChange={e=>onChange("passwordConfirm",e.target.value)} placeholder="비밀번호를 다시 입력해주세요"/>
      </FieldWrap>
      <FieldWrap label="가입 코드" required={!isAdmin} error={errors.inviteCode}>
        <input type="text" value={data.inviteCode} style={inputStyle} onChange={e=>onChange("inviteCode",e.target.value)} placeholder="모임에서 발급받은 코드"/>
      </FieldWrap>
      <FieldWrap label="추천인">
        <input type="text" value={data.referrer} style={inputStyle} onChange={e=>onChange("referrer",e.target.value)} placeholder="추천인 닉네임 (선택)"/>
      </FieldWrap>
      <button type="button" onClick={()=>validate()&&onNext()} style={{...btnPrimary,marginTop:8}}>다음 →</button>
    </div>
  );
}

// ─── 회원가입 STEP 2 ──────────────────────────────────────────────────────────
function Step2({data,onChange,onNext,onBack,isAdmin}) {
  const [errors,setErrors]=useState({});
  const [nickChecked,setNickChecked]=useState(false);
  const [nickMsg,setNickMsg]=useState("");
  const fileRef=useRef();
  const [preview,setPreview]=useState(null);
  const handlePhoto=e=>{const f=e.target.files[0];if(!f)return;onChange("photo",f);setPreview(URL.createObjectURL(f));};
  const checkNick=async()=>{
    if(!data.nickname.trim()){setErrors(p=>({...p,nickname:"닉네임을 먼저 입력해주세요"}));return;}
    if(FB){ try{ if(await once(FB.club.child("nicknames/"+nickKey(data.nickname)))){setNickChecked(false);setNickMsg("");setErrors(p=>({...p,nickname:"이미 쓰는 닉네임이에요"}));return;} }
      catch(e){ setErrors(p=>({...p,nickname:authMsg(e)})); return; } }
    setNickChecked(true);setErrors(p=>({...p,nickname:undefined}));setNickMsg("✓ 사용 가능한 닉네임이에요");};
  const fmt=v=>{const d=v.replace(/\D/g,"").slice(0,11);if(d.length<=3)return d;if(d.length<=7)return`${d.slice(0,3)}-${d.slice(3)}`;return`${d.slice(0,3)}-${d.slice(3,7)}-${d.slice(7)}`;};
  const validate=()=>{
    if(isAdmin) return true;
    const e={};
    if(!data.nickname) e.nickname="닉네임을 입력해주세요";
    if(!data.birthdate) e.birthdate="생년월일을 입력해주세요";
    if(!data.phone) e.phone="연락처를 입력해주세요";
    else if(!/^010-\d{4}-\d{4}$/.test(data.phone)) e.phone="010-0000-0000 형식으로 입력해주세요";
    if(!data.region) e.region="지역을 선택해주세요";
    setErrors(e);return Object.keys(e).length===0;
  };
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      {isAdmin&&<div style={{background:"#fef9c3",border:"1px solid #fde047",borderRadius:10,padding:"8px 14px",fontSize:12,color:"#a16207"}}>👑 관리자 모드 — 필수 입력값을 건너뛸 수 있어요</div>}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
        <div onClick={()=>fileRef.current.click()} style={{width:88,height:88,borderRadius:"50%",border:"2px dashed #D6DEF7",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",background:"#F5F7FE"}}>
          {preview?<img src={preview} alt="프로필" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:32}}>📷</span>}
        </div>
        <p style={{fontSize:12,color:"#A3AAC2",margin:0}}>클릭해서 프로필 사진 추가 (선택)</p>
        <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handlePhoto}/>
      </div>
      <FieldWrap label="닉네임" required={!isAdmin} error={errors.nickname}>
        <div style={{display:"flex",gap:8}}>
          <input type="text" value={data.nickname} style={inputStyle} onChange={e=>{onChange("nickname",e.target.value);setNickChecked(false);setNickMsg("");}} placeholder="모임에서 쓸 이름"/>
          <button type="button" onClick={checkNick} style={btnSmall}>중복확인</button>
        </div>
        {nickMsg&&<p style={{fontSize:12,color:BLUE,fontWeight:600,margin:0}}>{nickMsg}</p>}
      </FieldWrap>
      <FieldWrap label="생년월일" required={!isAdmin} error={errors.birthdate}>
        <input type="date" value={data.birthdate} style={inputStyle} onChange={e=>onChange("birthdate",e.target.value)} max={new Date().toISOString().split("T")[0]}/>
      </FieldWrap>
      <FieldWrap label="연락처" required={!isAdmin} error={errors.phone}>
        <input type="tel" value={data.phone} style={inputStyle} onChange={e=>onChange("phone",fmt(e.target.value))} placeholder="010-0000-0000"/>
      </FieldWrap>
      <FieldWrap label="지역" required={!isAdmin} error={errors.region}>
        <select value={data.region==="타지역"||(data.region&&!REGIONS.includes(data.region))?"타지역":data.region}
          onChange={e=>{onChange("region",e.target.value);if(e.target.value!=="타지역")onChange("regionCustom","");}}
          style={{...inputStyle,background:"#fff"}}>
          <option value="">지역을 선택해주세요</option>
          {REGIONS.map(r=><option key={r} value={r}>{r}</option>)}
        </select>
        {data.region==="타지역"&&<input type="text" value={data.regionCustom||""} onChange={e=>onChange("regionCustom",e.target.value)} placeholder="예: 경기도 수원시" style={{...inputStyle,marginTop:6}}/>}
      </FieldWrap>
      <FieldWrap label="자주 가는 테니스 코트">
        <input type="text" value={data.court} style={inputStyle} onChange={e=>onChange("court",e.target.value)} placeholder="예: 올림픽공원 테니스장"/>
      </FieldWrap>
      <div style={{display:"flex",gap:12,marginTop:8}}>
        <button type="button" onClick={onBack} style={btnSecondary}>← 이전</button>
        <button type="button" onClick={()=>validate()&&onNext()} style={{...btnPrimary,flex:2}}>다음 →</button>
      </div>
    </div>
  );
}

// ─── 회원가입 STEP 3 ──────────────────────────────────────────────────────────
function Step3({data,onChange,onSubmit,onBack,isAdmin}) {
  const [errors,setErrors]=useState({});
  const [ntrpPopup,setNtrpPopup]=useState(null);
  const career=calcCareer(data.tennisStart);
  const HANDS=["오른손 (양손 백핸드)","오른손 (한손 백핸드)","왼손 (양손 백핸드)","왼손 (한손 백핸드)"];
  const tab=(active)=>({flex:1,padding:"10px 4px",borderRadius:16,lineHeight:1.3,fontSize:12,cursor:"pointer",border:`1px solid ${active?BLUE:"#D6DEF7"}`,background:active?BLUE:"#fff",color:active?"#fff":"#4A5578"});
  const popupItem=NTRP_LEVELS.find(n=>n.score===ntrpPopup);
  const validate=()=>{
    if(isAdmin) return true;
    const e={};
    if(!data.tennisStart) e.tennisStart="시작 일자를 선택해주세요";
    if(!data.hand||!data.hand.length) e.hand="사용 손을 선택해주세요";
    if(!data.ntrp) e.ntrp="NTRP 수준을 선택해주세요";
    setErrors(e);return Object.keys(e).length===0;
  };
  return(
    <div style={{display:"flex",flexDirection:"column",gap:22}}>
      {isAdmin&&<div style={{background:"#fef9c3",border:"1px solid #fde047",borderRadius:10,padding:"8px 14px",fontSize:12,color:"#a16207"}}>👑 관리자 모드 — 필수 입력값을 건너뛸 수 있어요</div>}
      {/* NTRP 팝업 */}
      {ntrpPopup&&popupItem&&(
        <div onClick={()=>setNtrpPopup(null)} style={{position:"fixed",inset:0,background:"rgba(27,37,89,0.45)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:24,padding:24,maxWidth:340,width:"100%",boxShadow:"0 8px 32px rgba(0,0,0,0.2)",maxHeight:"80vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div><span style={{fontSize:24,fontWeight:"bold",color:BLUE}}>{popupItem.score}</span><span style={{fontSize:16,fontWeight:600,color:"#2B3674",marginLeft:8}}>{popupItem.label}</span></div>
              <button onClick={()=>setNtrpPopup(null)} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#A3AAC2"}}>✕</button>
            </div>
            <p style={{fontSize:14,color:"#4A5578",lineHeight:1.75,margin:"0 0 20px",whiteSpace:"pre-line"}}>{popupItem.desc}</p>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setNtrpPopup(null)} style={{...btnSecondary,fontSize:13}}>다른 레벨 선택</button>
              <button onClick={()=>{onChange("ntrp",popupItem.score);setNtrpPopup(null);}} style={{...btnPrimary,flex:1,fontSize:13}}>이 레벨로 선택</button>
            </div>
          </div>
        </div>
      )}
      <FieldWrap label="테니스 시작 일자" required={!isAdmin} error={errors.tennisStart}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <input type="month" value={data.tennisStart} style={{...inputStyle,flex:1}} onChange={e=>onChange("tennisStart",e.target.value)} max={new Date().toISOString().slice(0,7)}/>
          {career&&<span style={{fontSize:13,fontWeight:600,color:BLUE,background:BLUE_LIGHT,padding:"6px 12px",borderRadius:999,whiteSpace:"nowrap"}}>{career}</span>}
        </div>
        <p style={{fontSize:12,color:"#A3AAC2",margin:0}}>매월 자동으로 경력이 업데이트돼요</p>
      </FieldWrap>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <div style={{fontSize:14,fontWeight:500,color:"#2B3674"}}>레슨 이력</div>
        <div style={{display:"flex",gap:8}}>{["현재 레슨 중","과거에 받은 적 있음","레슨 경험 없음"].map(o=><button key={o} type="button" onClick={()=>onChange("lessonStatus",o)} style={tab(data.lessonStatus===o)}>{o}</button>)}</div>
        {(data.lessonStatus==="현재 레슨 중"||data.lessonStatus==="과거에 받은 적 있음")&&<input type="text" value={data.lessonMemo} style={inputStyle} onChange={e=>onChange("lessonMemo",e.target.value)} placeholder="레슨 내용 간단히"/>}
      </div>
      <FieldWrap label="사용 손 / 백핸드 스타일" required={!isAdmin} error={errors.hand}>
        <CheckGroup options={HANDS} selected={data.hand||[]} onChange={v=>onChange("hand",v)} multi={false}/>
      </FieldWrap>
      <FieldWrap label="NTRP 수준" required={!isAdmin} error={errors.ntrp}>
        <p style={{fontSize:12,color:"#A3AAC2",margin:"0 0 8px"}}>? 버튼을 누르면 각 레벨 설명을 볼 수 있어요</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {NTRP_LEVELS.map(item=>{const sel=data.ntrp===item.score;return(
            <div key={item.score} style={{display:"flex",alignItems:"center",gap:3}}>
              <button type="button" onClick={()=>onChange("ntrp",item.score)}
                style={{padding:"7px 12px",borderRadius:20,fontSize:13,cursor:"pointer",border:`1px solid ${sel?BLUE:"#D6DEF7"}`,background:sel?BLUE:"#fff",color:sel?"#fff":"#4A5578",fontWeight:sel?600:400}}>
                {item.score}<span style={{fontSize:10,marginLeft:3,opacity:0.8}}>{item.label}</span>
              </button>
              <button type="button" onClick={()=>setNtrpPopup(item.score)}
                style={{width:18,height:18,borderRadius:"50%",border:"1px solid #D6DEF7",background:"#F5F7FE",color:"#6B7493",fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0,flexShrink:0,fontWeight:600}}>?</button>
            </div>
          );})}
        </div>
      </FieldWrap>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <div style={{fontSize:14,fontWeight:500,color:"#2B3674"}}>주 운동 횟수</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {["주 1회","주 2회","주 3회","주 4회","주 5회 이상"].map(o=>(
            <button key={o} type="button" onClick={()=>onChange("weeklyFreq",o)}
              style={{padding:"7px 16px",borderRadius:20,fontSize:13,cursor:"pointer",border:`1px solid ${data.weeklyFreq===o?BLUE:"#D6DEF7"}`,background:data.weeklyFreq===o?BLUE:"#fff",color:data.weeklyFreq===o?"#fff":"#4A5578"}}>{o}</button>
          ))}
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <div style={{fontSize:14,fontWeight:500,color:"#2B3674"}}>다른 테니스 클럽 참여 중</div>
        <div style={{display:"flex",gap:8}}>{["예","아니오"].map(o=><button key={o} type="button" onClick={()=>onChange("otherClub",o)} style={tab(data.otherClub===o)}>{o}</button>)}</div>
        {data.otherClub==="예"&&<input type="text" value={data.otherClubName||""} style={inputStyle} onChange={e=>onChange("otherClubName",e.target.value)} placeholder="클럽명 (예: 한강 테니스클럽)"/>}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <div style={{fontSize:14,fontWeight:500,color:"#2B3674"}}>입상 이력</div>
        <div style={{display:"flex",gap:8}}>{["있음","없음"].map(o=><button key={o} type="button" onClick={()=>onChange("award",o)} style={tab(data.award===o)}>{o}</button>)}</div>
        {data.award==="있음"&&(
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {(data.awardList||[""]).map((item,idx)=>(
              <div key={idx} style={{display:"flex",gap:6}}>
                <input type="text" value={item} onChange={e=>{const n=[...(data.awardList||[""])];n[idx]=e.target.value;onChange("awardList",n);}} placeholder="대회명 · 성적" style={{...inputStyle,flex:1}}/>
                {idx>0&&<button type="button" onClick={()=>onChange("awardList",(data.awardList||[""]).filter((_,i)=>i!==idx))} style={{padding:"0 10px",border:"1px solid #fca5a5",borderRadius:999,background:"#fff5f5",color:"#ef4444",cursor:"pointer",fontSize:16}}>✕</button>}
              </div>
            ))}
            <button type="button" onClick={()=>onChange("awardList",[...(data.awardList||[""]),""  ])} style={{padding:"8px 0",border:`1px dashed ${BLUE}`,borderRadius:999,background:BLUE_LIGHT,color:BLUE,fontSize:13,cursor:"pointer",fontWeight:500}}>+ 대회 이력 추가</button>
          </div>
        )}
      </div>
      <FieldWrap label="기타 특이사항">
        <textarea value={data.memo} onChange={e=>onChange("memo",e.target.value)} placeholder="부상 이력, 선호 포지션 등" rows={3} style={{...inputStyle,borderRadius:18,resize:"none"}}/>
      </FieldWrap>
      <div style={{display:"flex",gap:12,marginTop:8}}>
        <button type="button" onClick={onBack} style={btnSecondary}>← 이전</button>
        <button type="button" onClick={()=>validate()&&onSubmit()} style={{...btnPrimary,flex:2}}>가입 완료 🎾</button>
      </div>
    </div>
  );
}

// ─── 홈 탭 ────────────────────────────────────────────────────────────────────
function Empty({children,action,onAction}) {
  return(
    <div style={{padding:"18px 12px",background:"#F5F7FE",borderRadius:16,textAlign:"center"}}>
      <p style={{margin:0,fontSize:13,color:"#8A93B2",lineHeight:1.6}}>{children}</p>
      {action&&<button type="button" onClick={onAction} style={{marginTop:10,padding:"8px 16px",background:GRAD,color:"#fff",border:"none",borderRadius:999,fontSize:13,fontWeight:600,cursor:"pointer",boxShadow:SHADOW_BTN}}>{action}</button>}
    </div>
  );
}
function HomeTab({onGoBooking,onOpenMeeting,onCreate}) {
  const lastMeeting=myHeld()[0]||null;
  const lastRec=lastMeeting&&lastMeeting.rec;
  const mine=lastRec&&lastRec.bracket?myRecord(lastRec.bracket,lastRec.scores||{},ME):null;
  const [exp,setExp]=useState(null);
  const upcoming=MEETINGS.filter(m=>m.status==="upcoming");
  const next=upcoming[0], nextNext=upcoming[1];
  const monthRank=rankingOf(heldMeetings().filter(m=>m.iso.slice(0,7)===todayYmd().slice(0,7)));
  // 홈에서 바로 참석·불참 투표
  const myVote=next&&next.rec&&next.rec.votes&&next.rec.votes[myVoteKey()];
  const myStatus=myVote&&myVote.status;
  const vote=status=>saveMeetingPath("m"+next.id+"/votes/"+myVoteKey(),voteValue(status,myVote)).catch(e=>alert(authMsg(e)));
  const fill=next?Math.min(100,Math.round((next.attendees.length/Math.max(1,next.capacity))*100)):0;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16,paddingBottom:24}}>
      <Card>
        <SectionTitle action={next?"전체보기":null} onAction={onGoBooking}>다가오는 모임 📅</SectionTitle>
        {!next?<Empty action="+ 모임 만들기" onAction={onCreate}>아직 잡힌 모임이 없어요.</Empty>:(
        <div style={{background:BLUE_LIGHT,borderRadius:18,padding:16}}>
          <div onClick={()=>onOpenMeeting(next.id,"info")} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,cursor:"pointer"}}>
            <div>
              <p style={{margin:"0 0 3px",fontWeight:700,fontSize:15,color:"#1B2559"}}>{next.date}</p>
              <p style={{margin:"0 0 2px",fontSize:13,color:"#4A5578"}}>🕗 {next.time}</p>
              <p style={{margin:0,fontSize:13,color:"#4A5578"}}>📍 {next.place}</p>
            </div>
            <span style={{background:GRAD,color:"#fff",fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:20,boxShadow:SHADOW_BTN}}>{dDay(next.iso)}</span>
          </div>
          <div style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:12,color:"#6B7493"}}>참석 현황</span>
              <span style={{fontSize:12,fontWeight:600,color:BLUE}}>{next.attendees.length} / {next.capacity}명</span>
            </div>
            <div style={{height:6,background:"#DCE4FF",borderRadius:10}}><div style={{height:"100%",width:`${fill}%`,background:GRAD,borderRadius:10}}/></div>
          </div>
          {isOpen(next)?(
          <div style={{display:"flex",gap:8}}>
            <button type="button" onClick={()=>vote("attend")} style={{flex:1,padding:"9px 0",background:myStatus==="attend"?GRAD:"#fff",color:myStatus==="attend"?"#fff":BLUE,border:myStatus==="attend"?"none":`1.5px solid ${BLUE}`,borderRadius:999,fontSize:13,fontWeight:600,cursor:"pointer",boxShadow:myStatus==="attend"?SHADOW_BTN:"none"}}>{myStatus==="attend"?"참석 투표함 ✓":"참석하기 ✓"}</button>
            <button type="button" onClick={()=>vote("absent")} style={{flex:1,padding:"8px 0",background:myStatus==="absent"?"#fef2f2":"#fff",color:myStatus==="absent"?"#ef4444":"#6B7493",border:`1.5px solid ${myStatus==="absent"?"#ef4444":"#D6DEF7"}`,borderRadius:999,fontSize:13,fontWeight:myStatus==="absent"?600:400,cursor:"pointer"}}>불참</button>
          </div>
          ):<p style={{margin:0,fontSize:12,color:"#6B7493",textAlign:"center"}}>🗓️ 예약은 {next.openDate}에 열려요</p>}
        </div>)}
        {nextNext&&(
          <div onClick={()=>onOpenMeeting(nextNext.id,"info")} style={{marginTop:10,padding:"10px 12px",background:"#F5F7FE",borderRadius:10,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
            <div><p style={{margin:0,fontSize:13,fontWeight:600,color:"#2B3674"}}>{nextNext.date}</p><p style={{margin:0,fontSize:12,color:"#A3AAC2"}}>📍 {nextNext.place}</p></div>
            <span style={{fontSize:12,color:"#A3AAC2"}}>{nextNext.attendees.length}명 참석예정</span>
          </div>
        )}
      </Card>
      <Card>
        <SectionTitle action={lastMeeting?(mine?"대진·스코어":"결과 기록하기"):null} onAction={()=>lastMeeting&&onOpenMeeting(lastMeeting.id,"bracket")}>마지막 참석 모임 🎾</SectionTitle>
        {!lastMeeting?<Empty>아직 참석한 모임이 없어요.</Empty>:(
        <div style={{display:"flex",gap:8}}>
          {[{label:"날짜",value:lastMeeting.date},{label:"장소",value:lastMeeting.place},{label:"내 결과",value:mine?mine.result:"기록 없음"},{label:"자주 친 파트너",value:mine?mine.partner:"-"}].map(item=>(
            <div key={item.label} style={{flex:1,textAlign:"center",padding:"10px 4px",background:BLUE_LIGHT,borderRadius:10}}>
              <p style={{margin:"0 0 4px",fontSize:10,color:"#6B7493"}}>{item.label}</p>
              <p style={{margin:0,fontSize:11,fontWeight:700,color:"#1B2559",wordBreak:"keep-all"}}>{item.value}</p>
            </div>
          ))}
        </div>)}
      </Card>
      <Card>
        <SectionTitle>이달의 참여 랭킹 🏆</SectionTitle>
        {monthRank.length===0?<Empty>이번 달 참석 기록이 아직 없어요.</Empty>:(
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {monthRank.slice(0,7).map(r=>(
            <div key={r.name} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:10,background:r.isMe?BLUE_LIGHT:"#F5F7FE",border:r.isMe?`1.5px solid ${BLUE}`:"1px solid transparent"}}>
              <span style={{width:22,textAlign:"center",fontSize:r.badge?16:13,fontWeight:700,color:"#A3AAC2"}}>{r.badge||r.rank}</span>
              <span style={{flex:1,fontSize:14,fontWeight:r.isMe?700:500,color:r.isMe?BLUE:"#2B3674"}}>{r.name}{r.isMe&&<span style={{fontSize:11,background:BLUE,color:"#fff",padding:"1px 6px",borderRadius:10,marginLeft:6}}>나</span>}</span>
              <span style={{fontSize:11,color:"#A3AAC2",marginRight:4}}>NTRP {r.ntrp}</span>
              <span style={{fontSize:13,fontWeight:700,color:BLUE}}>{r.count}회</span>
            </div>
          ))}
        </div>)}
      </Card>
      <Card>
        <SectionTitle>공지사항 📢</SectionTitle>
        {NOTICES.length===0?<Empty>등록된 공지사항이 없어요.</Empty>:(
        <div style={{display:"flex",flexDirection:"column"}}>
          {NOTICES.map((n,i)=>(
            <div key={n.id}>
              <div onClick={()=>setExp(exp===n.id?null:n.id)} style={{display:"flex",alignItems:"center",gap:8,padding:"11px 0",borderBottom:i<NOTICES.length-1?"1px solid #EEF1FA":"none",cursor:"pointer"}}>
                {n.important&&<span style={{fontSize:10,background:"#fef2f2",color:"#ef4444",padding:"2px 6px",borderRadius:6,fontWeight:600,whiteSpace:"nowrap"}}>중요</span>}
                <span style={{flex:1,fontSize:14,color:"#1B2559",fontWeight:n.important?600:400}}>{n.title}</span>
                <span style={{fontSize:11,color:"#A3AAC2",whiteSpace:"nowrap"}}>{n.date}</span>
                <span style={{fontSize:11,color:"#A3AAC2",marginLeft:4}}>{exp===n.id?"▲":"▼"}</span>
              </div>
              {exp===n.id&&<div style={{padding:"10px 12px",fontSize:13,color:"#4A5578",lineHeight:1.65,background:BLUE_LIGHT,borderRadius:14,marginBottom:6}}>{n.content}</div>}
            </div>
          ))}
        </div>)}
      </Card>
    </div>
  );
}

// ─── 대진 편성 엔진 ───────────────────────────────────────────────────────────
// DongsungJang/tennis-tournament(대진표 페이지)의 편성 엔진을 그대로 가져와 감쌌어요.
// 코트 수·게임당 시간은 앱 설정값을 쓰도록 고정값(코트 2면·30분)만 풀었고, 실력 순위 합 균형 · 개인별 게임 수 · 3연속 회피 등 규칙이 같아요.
function createEngine() {
var SES = 6, SLOT = 8, START_MIN = 15 * 60, DUR = 30;   // 앱: 코트 수(SLOT = 코트 × 4)와 게임당 시간(DUR)을 설정에서 받음
var TIMES = [], ENDS = [];
function hhmm(m){ return Math.floor(m / 60) + ':' + ('0' + m % 60).slice(-2); }
var GMIN = 2, GMAX = 5;
// 참가자별 제외: 0 = 없음, 1 = 첫판 제외(늦게 옴), 2 = 마지막판 제외(일찍 감). 해당 세션은 무조건 휴식
function offAt(e, s){ return (e === 1 && s === 0) || (e === 2 && s === SES - 1); }
// 같은 세션에서 빠지는 사람이 휴식 자리(인원 - 8)보다 많으면 편성 불가
function exclIssue(n, ex){
  var c1 = 0, c2 = 0; (ex || []).slice(0, n).forEach(function(e){ if (e === 1) c1++; else if (e === 2) c2++; });
  return c1 > n - SLOT ? { which: '첫판', cnt: c1 } : c2 > n - SLOT ? { which: '마지막판', cnt: c2 } : null;
}
// 참가자별 게임 수(2~5) 합계 = 세션 수 × 8자리 (코트 2면). 합이 8의 배수이고, 누구도 칠 수 있는 세션 수(제외 판 빼고)보다 많이 칠 수 없어야 편성 가능
function sessionsForGames(games, ex){
  var t = games.reduce(function(a, b){ return a + b; }, 0), k = t / SLOT;
  if (t % SLOT || exclIssue(games.length, ex)) return 0;
  for (var i = 0; i < games.length; i++) if (games[i] > k - (ex && ex[i] ? 1 : 0)) return 0;
  return k;
}
// 인원별 기본 지정: 6세션(48자리) 이하에서 가능한 가장 긴 편성, 4게임은 위 순위부터
function defaultGames(n){
  var total = Math.min(6 * SLOT, Math.floor(4 * n / SLOT) * SLOT), k = total - 3 * n, g = [];
  for (var i = 0; i < n; i++) g.push(i < k ? 4 : 3);
  return g;
}
// 편성할 수 없는 지정이면 가장 가까운 편성 가능한 합계로 맞춘 제안
// (줄일 땐 아래 순위부터 가장 많은 게임을 1씩, 늘릴 땐 위 순위부터 가장 적은 게임을 1씩. 세션 수보다 많은 게임은 세션 수로)
function fitGames(games, keep, ex){
  var n = games.length, t0 = games.reduce(function(a, b){ return a + b; }, 0), best = null, bd = Infinity;
  for (var target = Math.ceil(GMIN * n / SLOT) * SLOT; target <= GMAX * n; target += SLOT){
    // 사람마다 상한 = min(5, 세션 수 - 제외 판)
    var cap = games.map(function(_, i){ return Math.min(GMAX, target / SLOT - (ex && ex[i] ? 1 : 0)); });
    if (Math.min.apply(null, cap) < GMIN || cap.reduce(function(a, b){ return a + b; }, 0) < target) continue;
    var d = Math.abs(target - t0); if (d > bd || (d === bd && target < t0)) continue;   // 같은 거리면 늘리는 쪽
    var g = games.map(function(x, i){ return Math.min(x, cap[i]); }), t = g.reduce(function(a, b){ return a + b; }, 0);
    // keep(방금 바꾼 사람)은 되도록 건드리지 않음
    for (var pass = 0; pass < 2 && t !== target; pass++){
      for (var v = GMAX; v > GMIN && t > target; v--)
        for (var i = n - 1; i >= 0 && t > target; i--) if (g[i] === v && (pass || i !== keep)){ g[i]--; t--; }
      for (v = GMIN; v < GMAX && t < target; v++)
        for (i = 0; i < n && t < target; i++) if (g[i] === v && v < cap[i] && (pass || i !== keep)){ g[i]++; t++; }
    }
    if (t !== target) continue;
    best = g; bd = d;
  }
  return best;
}
// lateStart: 첫 경기가 3세션 이후면 큰 벌점 (사실상 필수: 처음부터 1시간 기다리는 사람 없게)
// 참가자별 게임 수는 하드 제약 (초기 배치에서 맞추고, 휴식 총횟수를 바꾸지 않는 이동만 사용)
// 가중치: 페어 밸런스 최상 > 3연속 상 > 중복 만남 하 > 연속 휴식 소폭
// group: '꼭 한 번 같이 칠 4명'이 한 코트에 모인 판이 없으면 큰 벌점 (사실상 필수)
var W = { pair: 20, rest: 20, triple: 25, partner: 2, opp: 1, restRun: 0.5, lateStart: 200, group: 3000 };
// 꼭 같이 칠 4명(비트 마스크, 0 = 없음). 한 세션의 점수 = 출전한 멤버 수 + 한 코트에 모인 최다 멤버 수 (8이면 성공)
var GRP = 0;
function grpScore(p){
  var g = 0, c1 = 0, c2 = 0;
  for (var i = 0; i < 8; i++) if ((GRP >> p[i]) & 1){ g++; if (i < 4) c1++; else c2++; }
  return g + Math.max(c1, c2);
}
// 4명이 다 뛸 수 있는(아무도 제외되지 않은) 세션이 있어야 함
function groupOk(ids, ex){
  for (var s = 0; s < SES; s++) if (ids.every(function(i){ return !offAt(ex && ex[i], s); })) return true;
  return false;
}

function rng32(a){ return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// 상태: 세션마다 길이 N 순열. [0..7] = 코트1 A·B / C·D, 코트2 A·B / C·D, [8..] = 휴식
// 출전 패턴(세션 수 비트 마스크)별 3연속·연속휴식 벌점은 미리 표로 계산
// 제외 유형별로 따로: 제외된 판은 없는 셈 치고(그 앞뒤 휴식을 연속 휴식으로 세지 않음), 첫 경기도 참석 후 1~2세션 안
var RUN_TBL;
function setSessions(k){
  SES = k; TIMES = []; ENDS = [];
  for (var s = 0; s < SES; s++){ TIMES.push(hhmm(START_MIN + DUR * s)); ENDS.push(hhmm(START_MIN + DUR * (s + 1))); }
  RUN_TBL = [[0, SES], [1, SES], [0, SES - 1]].map(function(r){
    var lo = r[0], hi = r[1], tb = new Float64Array(1 << SES);
    for (var m = 0; m < (1 << SES); m++){
      var c = 0, run = 0, rr = 0;
      for (var s = lo; s <= hi; s++){
        var on = s < hi && (m >> s) & 1;
        if (on){ run++; if (rr >= 2) c += W.restRun * (rr - 1); rr = 0; }
        else { if (run >= 3) c += W.triple * (run - 2); run = 0; if (s < hi) rr++; else if (rr >= 2) c += W.restRun * (rr - 1); }
      }
      if (!((m >> lo) & 3)) c += W.lateStart;
      tb[m] = c;
    }
    return tb;
  });
}
// 지정한 게임 수로 3연속을 피할 수 없는 최소 인원: 세션별 휴식 자리 수를 상태로 한 전수 탐색
// (첫 경기 1~2세션 규칙 포함. 같은 게임 수끼리는 패턴 순서를 고정해 대칭을 없애고, 실패한 상태는 기억해 다시 보지 않음.
//  3연속 허용 인원 t를 0부터 늘려 가며 처음 가능한 t가 답)
function minTriples(games, ex){
  var S = SES, n = games.length, need = n - SLOT, pw = [], pats = {}, s, m;
  for (s = 0; s < S; s++) pw.push(Math.pow(need + 1, s));
  // 같은 (게임 수, 제외 유형)끼리 묶어 대칭 제거
  var g = games.map(function(x, i){ return x * 4 + (ex && ex[i] || 0); }).sort(function(a, b){ return b - a; });
  g.forEach(function(x){
    if (pats[x]) return;
    var a = [], e = x & 3, lo = e === 1 ? 1 : 0, off = e === 1 ? 1 : e === 2 ? 1 << (S - 1) : 0;
    for (m = 0; m < (1 << S); m++){
      if (popc(m) !== x >> 2 || !((m >> lo) & 3) || (m & off)) continue;
      var run = 0, mx = 0; for (s = 0; s < S; s++){ run = (m >> s) & 1 ? run + 1 : 0; if (run > mx) mx = run; }
      a.push({ m: m, tr: mx >= 3 ? 1 : 0 });
    }
    a.sort(function(p, q){ return p.tr - q.tr || p.m - q.m; });
    pats[x] = a;
  });
  var used = new Int8Array(S), fail = new Set();
  function dfs(i, from, t, key){
    if (i === n) return true;
    for (var s = 0; s < S; s++) if (need - used[s] > n - i) return false;   // 남은 사람으로 못 채우는 휴식 자리
    var P = pats[g[i]], start = i > 0 && g[i - 1] === g[i] ? from : 0;
    var fk = ((key * 16 + i) * 16 + t) * 128 + start;
    if (fail.has(fk)) return false;
    for (var q = start; q < P.length; q++){
      if (P[q].tr > t) continue;
      var mm = P[q].m, ok = true, k2 = key;
      for (s = 0; s < S; s++) if (!((mm >> s) & 1) && used[s] >= need){ ok = false; break; }
      if (!ok) continue;
      for (s = 0; s < S; s++) if (!((mm >> s) & 1)){ used[s]++; k2 += pw[s]; }
      var r = dfs(i + 1, q, t - P[q].tr, k2);
      for (s = 0; s < S; s++) if (!((mm >> s) & 1)) used[s]--;
      if (r) return true;
    }
    fail.add(fk);
    return false;
  }
  for (var t = 0; t <= n; t++) if (dfs(0, 0, t, 0)) return t;
  return -1;
}
function popc(m){ var c = 0; while (m){ c += m & 1; m >>= 1; } return c; }
function makeCost(N, ex){
  var mask = new Int32Array(N), pc = new Uint8Array(N * N), oc = new Uint8Array(N * N);
  var restPen = []; for (var q = 0; q < N; q++) restPen.push(RUN_TBL[ex[q] || 0]);
  function P(i, j){ return i < j ? i * N + j : j * N + i; }
  return function(st){
    var c = 0, s, k, i, x, key;
    mask.fill(0); pc.fill(0); oc.fill(0);
    for (s = 0; s < SES; s++){
      var p = st[s], bit = 1 << s;
      for (k = 0; k < SLOT; k += 4){
        var a1 = p[k], a2 = p[k+1], b1 = p[k+2], b2 = p[k+3];
        var d = (a1 + a2) - (b1 + b2);          // 순위 합 차 (0번=1위)
        c += W.pair * d * d;
        // 같은 편/상대 편 k회째 만남마다 (k-1)^2 증가분 = 2k-3 (k>=2)
        x = ++pc[key = P(a1, a2)]; if (x > 1) c += W.partner * (2 * x - 3);
        x = ++pc[key = P(b1, b2)]; if (x > 1) c += W.partner * (2 * x - 3);
        x = ++oc[P(a1, b1)]; if (x > 1) c += W.opp * (2 * x - 3);
        x = ++oc[P(a1, b2)]; if (x > 1) c += W.opp * (2 * x - 3);
        x = ++oc[P(a2, b1)]; if (x > 1) c += W.opp * (2 * x - 3);
        x = ++oc[P(a2, b2)]; if (x > 1) c += W.opp * (2 * x - 3);
      }
      for (i = 0; i < SLOT; i++) mask[p[i]] |= bit;
    }
    for (i = 0; i < N; i++) c += restPen[i][mask[i]];
    if (GRP){ var gb = 0; for (s = 0; s < SES; s++){ var g = grpScore(st[s]); if (g > gb) gb = g; } c += W.group * (8 - gb); }
    return c;
  };
}

// 출전 인원이 바뀐 세션은 슬롯 교환으로 순위 합 균형을 바로 복구 (복합 이동)
function balOf(p){ var c = 0; for (var k = 0; k < SLOT; k += 4){ var d = p[k] + p[k+1] - p[k+2] - p[k+3]; c += d * d; } return c + (GRP ? 1000 * (8 - grpScore(p)) : 0); }
function repair(p){
  for (var r = 0; r < 4; r++){
    var b0 = balOf(p); if (!b0) return;
    var bi = -1, bj = -1, bv = b0;
    for (var i = 0; i < SLOT; i++) for (var j = i + 1; j < SLOT; j++){
      if ((i >> 1) === (j >> 1)) continue;
      var t = p[i]; p[i] = p[j]; p[j] = t;
      var v = balOf(p); if (v < bv){ bv = v; bi = i; bj = j; }
      p[j] = p[i]; p[i] = t;
    }
    if (bi < 0) return;
    t = p[bi]; p[bi] = p[bj]; p[bj] = t;
  }
}

function solve(N, seed, opt){
  opt = opt || {};
  var games = opt.games || defaultGames(N), ex = opt.excl || [];
  GRP = 0; (opt.group || []).forEach(function(i){ GRP |= 1 << i; });
  var iters = opt.iters || 20000, R = opt.restarts || 5, T0 = 14, T1 = 0.02;
  var rnd = rng32(seed), cost = makeCost(N, ex), lnr = Math.log(T1 / T0), nr = N - SLOT;
  var best = null, bc = Infinity, ycand = new Int8Array(N), save1 = new Int8Array(N), save2 = new Int8Array(N);
  function sw(a, i, j){ var t = a[i]; a[i] = a[j]; a[j] = t; }
  function cp(src, dst){ for (var q = 0; q < N; q++) dst[q] = src[q]; }
  // 초기 배치: 세션마다 여유(남은 출전 가능 세션 - 남은 게임)가 가장 적은 사람부터 뛰게 해 개인별 게임 수를 정확히 맞춤.
  // 제외된 판에는 그 사람을 무조건 휴식 자리로. sg >= 0이면 그 세션에 '같이 칠 4명'을 한 코트로 넣음 (게임 수가 안 맞으면 null)
  function build(sg){
    var st = [], rem = games.slice();
    for (var s = 0; s < SES; s++){
      var a = [], slack = [], avl = []; for (var i = 0; i < N; i++){
        a.push(i);
        var av = 0; for (var u = s; u < SES; u++) if (!offAt(ex[i], u)) av++;
        slack.push(offAt(ex[i], s) || rem[i] <= 0 ? 1e9 : s === sg && (GRP >> i) & 1 ? -1 : av - rem[i]); avl.push(av);   // 게임을 다 채운 사람도 휴식
      }
      for (i = N - 1; i > 0; i--){ var j = rnd() * (i + 1) | 0; sw(a, i, j); }
      // 여유 많은 사람·제외된 사람이 뒤(휴식 자리)로. 여유가 같으면 뒤에 빠질 판이 있는 사람이 먼저 뜀
      a.sort(function(x, y){ return slack[x] - slack[y] || avl[x] - avl[y]; });
      for (i = 0; i < SLOT; i++){ if (slack[a[i]] >= 1e9) return null; rem[a[i]]--; }
      var pl = a.slice(0, SLOT);
      for (i = SLOT - 1; i > 0; i--){ j = rnd() * (i + 1) | 0; sw(pl, i, j); }
      if (s === sg){
        var gm = pl.filter(function(x){ return (GRP >> x) & 1; }), ot = pl.filter(function(x){ return !((GRP >> x) & 1); });
        if (gm.length < 4) return null;
        pl = rnd() < 0.5 ? gm.concat(ot) : ot.concat(gm);
      }
      st.push(pl.concat(a.slice(SLOT)));
      repair(st[s]);
    }
    for (i = 0; i < N; i++) if (rem[i]) return null;
    return st;
  }
  for (var r = 0; r < R; r++){
    var st = null;
    if (GRP){
      var order = []; for (var s0 = 0; s0 < SES; s0++) order.push(s0);
      for (s0 = SES - 1; s0 > 0; s0--){ var j0 = rnd() * (s0 + 1) | 0; sw(order, s0, j0); }
      for (s0 = 0; s0 < SES && !st; s0++) st = build(order[s0]);
    }
    for (var tries = 0; !st && tries < 50; tries++) st = build(-1);
    var cur = cost(st);
    if (cur < bc){ bc = cur; best = st.map(function(x){ return x.slice(); }); }
    for (var it = 0; it < iters; it++){
      var T = T0 * Math.exp(lnr * it / (iters - 1));
      var m = rnd(), s1 = rnd() * SES | 0, s2 = -1, i1, j1;
      cp(st[s1], save1);
      // (b) 한 세션 안의 출전↔휴식 교환은 개인별 게임 수를 바꾸므로 쓰지 않고, 같은 일을 두 세션에 걸쳐 하는 (c)만 사용
      if (m < 0.4){                                   // (a) 세션 안 슬롯 교환
        i1 = rnd() * SLOT | 0; j1 = rnd() * SLOT | 0;
        if ((i1 >> 1) === (j1 >> 1)) continue;
        sw(st[s1], i1, j1);
      } else {                                        // (c) 두 세션의 휴식 인원 맞교환
        if (SES < 2) continue;
        s2 = rnd() * (SES - 1) | 0; if (s2 >= s1) s2++;
        var A = st[s1], B = st[s2];
        i1 = SLOT + (rnd() * nr | 0);                    // x: s1에서 휴식
        var x = A[i1], i2 = B.indexOf(x);
        if (i2 >= SLOT || offAt(ex[x], s1)) continue;     // x는 s2에서 뛰어야 하고, s1에서 뛸 수 있어야 함
        var nc0 = 0;
        for (var q = SLOT; q < N; q++){ if (A.indexOf(B[q]) < SLOT && !offAt(ex[B[q]], s2)) ycand[nc0++] = q; }
        if (!nc0) continue;
        var j2 = ycand[rnd() * nc0 | 0];              // y: s2에서 휴식, s1에서 뛰는 사람
        j1 = A.indexOf(B[j2]);
        cp(B, save2);
        sw(A, i1, j1); sw(B, i2, j2);                 // s1: y 휴식, s2: x 휴식 (휴식 총횟수 유지)
        repair(A); repair(B);
      }
      var nc = cost(st), d = nc - cur;
      if (d <= 0 || rnd() < Math.exp(-d / T)){
        cur = nc;
        if (cur < bc - 1e-9){ bc = cur; best = st.map(function(x){ return x.slice(); }); }
      } else {
        cp(save1, st[s1]);
        if (s2 >= 0) cp(save2, st[s2]);
      }
    }
  }
  // 4명이 한 코트에 모인 판 (없으면 -1)
  var met = -1;
  if (GRP) for (var s3 = 0; s3 < SES && met < 0; s3++) if (grpScore(best[s3]) === 8) met = s3;
  return { st: best, cost: bc, groupAt: met };
}

function analyze(st, N, ex){
  ex = ex || [];
  var players = [], pc = [], oc = [], i, j, s;
  for (i = 0; i < N; i++){ pc.push(new Array(N).fill(0)); oc.push(new Array(N).fill(0)); players.push({ games: 0, rests: 0, maxRun: 0, triples: 0, pattern: '' }); }
  var diffs = [];
  for (s = 0; s < SES; s++){
    var p = st[s];
    for (var k = 0; k < SLOT; k += 4){
      var A = [p[k], p[k+1]], B = [p[k+2], p[k+3]];
      diffs.push(Math.abs((A[0] + A[1]) - (B[0] + B[1])));
      pc[A[0]][A[1]]++; pc[A[1]][A[0]]++; pc[B[0]][B[1]]++; pc[B[1]][B[0]]++;
      A.forEach(function(a){ B.forEach(function(b){ oc[a][b]++; oc[b][a]++; }); });
    }
  }
  for (i = 0; i < N; i++){
    var run = 0, pl = players[i]; pl.first = 0;
    for (s = 0; s < SES; s++){
      var on = st[s].indexOf(i) < SLOT;
      pl.pattern += on ? '●' : offAt(ex[i], s) ? '–' : '○';
      if (on && !pl.first) pl.first = s + 1;
      if (on){ pl.games++; run++; if (run > pl.maxRun) pl.maxRun = run; if (run === 3) pl.triples++; }
      else { pl.rests++; run = 0; }
    }
  }
  var rests = players.map(function(p){ return p.rests; });
  var mean = rests.reduce(function(a, b){ return a + b; }, 0) / N;
  var sd = Math.sqrt(rests.reduce(function(a, r){ return a + (r - mean) * (r - mean); }, 0) / N);
  var pDup = 0, oDup = 0, pairs2 = 0, maxP = 0, maxO = 0;
  for (i = 0; i < N; i++) for (j = i + 1; j < N; j++){
    if (pc[i][j] > 1) pDup += pc[i][j] - 1;
    if (oc[i][j] > 1) oDup += oc[i][j] - 1;
    if (pc[i][j] + oc[i][j] > 1) pairs2++;
    maxP = Math.max(maxP, pc[i][j]); maxO = Math.max(maxO, oc[i][j]);
  }
  var maxRests = Math.max.apply(null, rests), minRests = Math.min.apply(null, rests);
  var idealMin = Math.floor(SES * (N - SLOT) / N), idealMax = Math.ceil(SES * (N - SLOT) / N);
  return {
    players: players, pc: pc, oc: oc, diffs: diffs,
    restMean: mean, restSd: sd, restMin: minRests, restMax: maxRests, restIdeal: minRests >= idealMin && maxRests <= idealMax,
    lateStarters: players.filter(function(p, i){ return p.first > (ex[i] === 1 ? 3 : 2); }).length,
    triplePlayers: players.filter(function(p){ return p.maxRun >= 3; }).length,
    tripleRuns: players.reduce(function(a, p){ return a + p.triples; }, 0),
    diffSum: diffs.reduce(function(a, b){ return a + b; }, 0), diffMax: Math.max.apply(null, diffs),
    partnerDup: pDup, oppDup: oDup, pairsMet2: pairs2, maxPartner: maxP, maxOpp: maxO
  };
}
  return {
    setStart:m=>{START_MIN=m;},
    setLayout:(courts,dur)=>{SLOT=courts*4;DUR=dur;},
    setSessions, solve, analyze, defaultGames, fitGames, sessionsForGames, exclIssue,
    times:()=>TIMES.slice(), ends:()=>ENDS.slice(),
  };
}
const ENGINE = createEngine();

// ─── 스코어 규칙 (스코어보드와 동일) ─────────────────────────────────────────
// 6점 선승. 5:5에서 끝나면 무승부, 가위바위보 승자를 고르면 그 팀 승.
const isTie = g => g.a===g.b && g.a>=5;
function outcome(g) {
  if (!g) return null;
  if (isTie(g)) return g.rps==="a"||g.rps==="b" ? g.rps : "draw";
  if (g.a>=6) return "a";
  if (g.b>=6) return "b";
  return null;
}
const gameKey = (s,c) => `${s}_${c}`;
const sessionCourts = ses => ses.courts || [ses.c1,ses.c2];   // 예전 기록(코트 2면 고정)도 읽음

// 대진표의 모든 게임을 [{s,c,key,a:[이름,이름],b:[이름,이름],score,o}] 로 펼침
function flatGames(bracket, scores) {
  const out=[];
  if (!bracket) return out;
  bracket.sessions.forEach((ses,s)=>sessionCourts(ses).forEach((ct,c)=>{
    const key=gameKey(s,c), score=(scores||{})[key]||{a:0,b:0,rps:null};
    out.push({s,c,key,a:ct.a.map(i=>bracket.players[i]),b:ct.b.map(i=>bracket.players[i]),score,o:outcome(score)});
  }));
  return out;
}

// 개인 성적: 승·무·패, 득실
function standings(bracket, scores) {
  const t={};
  if (!bracket) return [];
  bracket.players.forEach((n,i)=>{t[n]={name:n,rank:i+1,w:0,d:0,l:0,pf:0,pa:0,played:0};});
  flatGames(bracket,scores).forEach(g=>{
    if (!g.o) return;
    const add=(team,my,opp,res)=>team.forEach(n=>{const r=t[n];r.played++;r.pf+=my;r.pa+=opp;r[res]++;});
    if (g.o==="draw"){ add(g.a,g.score.a,g.score.b,"d"); add(g.b,g.score.b,g.score.a,"d"); }
    else { add(g.a,g.score.a,g.score.b,g.o==="a"?"w":"l"); add(g.b,g.score.b,g.score.a,g.o==="b"?"w":"l"); }
  });
  return Object.values(t).sort((x,y)=>y.w-x.w||(y.pf-y.pa)-(x.pf-x.pa)||x.l-y.l||x.rank-y.rank);
}

// 한 사람의 결과 요약 (홈 '마지막 참석 모임'에 사용)
function myRecord(bracket, scores, me) {
  if (!bracket||!bracket.players.includes(me)) return null;
  let w=0,d=0,l=0; const partners={};
  flatGames(bracket,scores).forEach(g=>{
    const side=g.a.includes(me)?"a":g.b.includes(me)?"b":null;
    if (!side) return;
    const mate=g[side].find(n=>n!==me); partners[mate]=(partners[mate]||0)+1;
    if (!g.o) return;
    if (g.o==="draw") d++; else if (g.o===side) w++; else l++;
  });
  if (!w&&!d&&!l) return null;
  const partner=Object.keys(partners).sort((x,y)=>partners[y]-partners[x])[0]||"-";
  return {result:`${w}승 ${l}패${d?` ${d}무`:""}`,partner};
}

// ─── 저장소 ──────────────────────────────────────────────────────────────────
// ① 파이어베이스 Realtime Database (window.FIREBASE_CONFIG가 있을 때, GitHub Pages)
// ② 없으면 이 기기(localStorage)에 같은 모양으로 저장. 두 경우 모두 같은 doc(path) 모양으로 써요.
const FIREBASE_ROOT = "club";   // 스코어보드(results)와 섞이지 않게 club/ 아래에 저장
// 중첩 객체를 "a/b" 경로로 펼침 → RTDB update가 하위 값을 병합하게 함 (배열은 통째로)
function flatPaths(obj,prefix,out){
  Object.keys(obj).forEach(k=>{const v=obj[k],p=prefix+k;
    if(v&&typeof v==="object"&&!Array.isArray(v)&&Object.keys(v).length) flatPaths(v,p+"/",out); else out[p]=v===undefined?null:v;});
  return out;
}
function firebaseDb(){
  const cfg=window.FIREBASE_CONFIG;
  if(!window.firebase.apps.length) window.firebase.initializeApp(cfg);
  const root=window.firebase.database().ref(FIREBASE_ROOT);
  return { shared:true, doc:path=>{
    const ref=root.child(path);
    return {
      onSnapshot:(next,error)=>{const h=snap=>next({exists:snap.exists(),data:()=>snap.val()});ref.on("value",h,error);return ()=>ref.off("value",h);},
      set:v=>ref.set(v==null?null:JSON.parse(JSON.stringify(v))),
      update:v=>ref.update(flatPaths(JSON.parse(JSON.stringify(v)),"",{})),
      delete:()=>ref.remove(),
    };
  }};
}
// 파이어베이스가 없을 때: 이 기기에 club 트리 하나를 통째로 저장
const LOCAL_KEY="sstc-club-local-v2";
function localDb(){
  let tree; try{ tree=JSON.parse(localStorage.getItem(LOCAL_KEY)||"{}"); }catch(e){ tree={}; }
  const subs=new Set();
  const get=path=>path.split("/").reduce((o,k)=>o==null?undefined:o[k],tree);
  const put=(path,v)=>{
    const ks=path.split("/"); let o=tree;
    ks.slice(0,-1).forEach(k=>{ if(!o[k]||typeof o[k]!=="object") o[k]={}; o=o[k]; });
    if(v==null) delete o[ks[ks.length-1]]; else o[ks[ks.length-1]]=JSON.parse(JSON.stringify(v));
  };
  const commit=()=>{ try{ localStorage.setItem(LOCAL_KEY,JSON.stringify(tree)); }catch(e){} subs.forEach(f=>f()); return Promise.resolve(); };
  return { shared:false, doc:path=>({
    onSnapshot:next=>{ const f=()=>{const v=get(path);next({exists:v!==undefined,data:()=>v===undefined?null:JSON.parse(JSON.stringify(v))});}; subs.add(f); setTimeout(f,0); return ()=>subs.delete(f); },
    set:v=>{ put(path,v); return commit(); },
    update:v=>{ const f=flatPaths(v,"",{}); Object.keys(f).forEach(k=>put(path+"/"+k,f[k])); return commit(); },
    delete:()=>{ put(path,null); return commit(); },
  })};
}
const dbReady = (typeof window==="undefined") ? Promise.resolve(null)
  : Promise.resolve().then(()=>(window.firebase&&window.FIREBASE_CONFIG&&window.FIREBASE_CONFIG.databaseURL)?firebaseDb():localDb())
      .catch(()=>{ try{ return localDb(); }catch(e){ return null; } });
// club/meetings/<path>에 값 쓰기 (null이면 지움)
const saveMeetingPath=(path,value)=>dbReady.then(db=>{ if(!db) throw new Error("저장소가 없어요"); return db.doc("meetings/"+path).set(value); });
// 지금 로그인한 사람의 투표 키: 파이어베이스 계정이면 uid, 아니면 닉네임
const myVoteKey=()=>(FB&&FB.auth.currentUser)?FB.auth.currentUser.uid:nickKey(ME);
const voteValue=(status,prev)=>({name:ME,ntrp:MEMBER_NTRP[ME]||"",status,
  at:status==="attend"?((prev&&prev.status==="attend"&&prev.at)||nowAt()):null,
  guests:status==="attend"?((prev&&prev.guests)||[]):[]});

// 모든 모임 기록을 실시간으로 받아서 MEETINGS를 다시 만듦
// 파이어베이스 규칙이 로그인한 사람만 읽게 하므로, 로그인 상태가 바뀔 때마다 구독을 다시 걺
function useMeetingList(){
  const [state,setState]=useState({meetings:MEETINGS,ready:false,shared:false,error:null});
  const [uid,setUid]=useState(()=>FB&&FB.auth.currentUser?FB.auth.currentUser.uid:null);
  useEffect(()=>FB?FB.auth.onAuthStateChanged(u=>setUid(u?u.uid:null)):undefined,[]);
  useEffect(()=>{
    let alive=true, unsub=null;
    if(FB&&!uid){ setState(s=>({...s,ready:false,error:null})); return; }   // 로그인 전에는 안 읽음
    dbReady.then(db=>{
      if(!alive) return;
      if(!db){ setState({meetings:buildMeetings({}),ready:true,shared:false,error:null}); return; }
      unsub=db.doc("meetings").onSnapshot(
        snap=>alive&&setState({meetings:buildMeetings(snap.exists?snap.data():{}),ready:true,shared:db.shared,error:null}),
        e=>alive&&setState(s=>({...s,ready:true,error:/PERMISSION_DENIED|permission/i.test(String(e&&(e.code||e.message)))
          ?"읽기 권한이 없어요. 파이어베이스 규칙을 확인해 주세요":authMsg(e)})));
    });
    return ()=>{alive=false;if(unsub)unsub();};
  },[uid]);
  return state;
}

// 모임 하나의 투표·대진표·점수 쓰기. 읽기는 목록 구독(meeting.rec)에서 받고, 점수만 입력 중에 화면에 먼저 반영
function useMeetingRecord(meeting) {
  const id=meeting.id, base="m"+id;
  const [mode,setMode]=useState("local");   // "shared" | "local" | "readonly"
  const [pending,setPending]=useState({});  // 아직 안 보낸 점수
  const timers=useRef({});
  useEffect(()=>{ dbReady.then(db=>db&&setMode(db.shared?"shared":"local")); return ()=>Object.values(timers.current).forEach(clearTimeout); },[id]);
  const fail=e=>{ if(e&&(e.code==="invalid_argument"||/PERMISSION_DENIED|permission/i.test(String(e.code||e.message)))) setMode("readonly"); };
  const src=meeting.rec||{};
  const rec={...src,scores:{...(src.scores||{}),...pending}};
  const saveBracket=bracket=>{ setPending({}); Promise.all([saveMeetingPath(base+"/bracket",bracket),saveMeetingPath(base+"/scores",null)]).catch(fail); };
  const clearBracket=()=>saveBracket(null);
  const saveRsvp=v=>saveMeetingPath(base+"/votes/"+myVoteKey(),v).catch(fail);
  const saveScore=(key,val)=>{
    setPending(p=>({...p,[key]:val}));
    clearTimeout(timers.current[key]);
    timers.current[key]=setTimeout(()=>saveMeetingPath(base+"/scores/"+key,val)
      .then(()=>setPending(p=>{const n={...p};delete n[key];return n;})).catch(fail),600);
  };
  return {rec,mode,saveBracket,clearBracket,saveScore,saveRsvp};
}

// ─── 회원 계정 (파이어베이스 Authentication) ───────────────────────────────────
// firebase-config.js와 auth 라이브러리가 있으면 진짜 가입·로그인, 없으면(아티팩트 등) 예전처럼 데모 로그인.
// 데이터 위치: club/members/<uid> 프로필, club/nicknames/<닉네임> = uid, club/approved/<uid> = true (관리자가 승인),
//             club/admins/<uid> = true (파이어베이스 콘솔에서 직접 넣음)
const FB = (()=>{
  try{
    const cfg=typeof window!=="undefined"&&window.FIREBASE_CONFIG;
    if(!cfg||!cfg.databaseURL||!window.firebase||!window.firebase.auth) return null;
    if(!window.firebase.apps.length) window.firebase.initializeApp(cfg);
    const club=window.firebase.database().ref(FIREBASE_ROOT);
    return {auth:window.firebase.auth(),club};
  }catch(e){ return null; }
})();
// RTDB 키에 못 쓰는 문자(. # $ [ ] /)를 피해서 닉네임을 키로 씀
const nickKey = n => encodeURIComponent(n.trim()).replace(/\./g,"%2E");
const AUTH_ERRORS = {
  "auth/invalid-email":"이메일 형식이 올바르지 않아요",
  "auth/user-not-found":"이메일 또는 비밀번호가 맞지 않아요",
  "auth/wrong-password":"이메일 또는 비밀번호가 맞지 않아요",
  "auth/invalid-credential":"이메일 또는 비밀번호가 맞지 않아요",
  "auth/invalid-login-credentials":"이메일 또는 비밀번호가 맞지 않아요",
  "auth/email-already-in-use":"이미 가입된 이메일이에요. 로그인하거나 비밀번호 찾기를 해 주세요",
  "auth/weak-password":"비밀번호는 6자 이상이어야 해요",
  "auth/too-many-requests":"시도가 너무 많아요. 잠시 후 다시 해 주세요",
  "auth/network-request-failed":"인터넷 연결을 확인해 주세요",
  "auth/operation-not-allowed":"파이어베이스에서 이메일/비밀번호 로그인이 꺼져 있어요",
};
const authMsg = e => AUTH_ERRORS[e&&e.code] || (/PERMISSION_DENIED|permission/i.test(String(e&&(e.code||e.message)))
  ? "저장 권한이 없어요. 파이어베이스 규칙을 확인해 주세요" : "문제가 생겼어요: "+((e&&e.message)||e));
const once = ref => ref.once("value").then(s=>s.val());

// 로그인한 사람이 바뀌면 '나' 기준 표시(투표, 대진표, 홈)를 그 사람으로 맞춤
function setMe(profile){
  if(!profile||!profile.nickname) return;
  ME=profile.nickname;
  if(profile.ntrp) MEMBER_NTRP[ME]=profile.ntrp;
  refreshAttendance();
}

// 회원가입: 계정 생성 → 프로필·닉네임 저장. 승인은 관리자가 따로 함
async function signUpMember(form){
  const nick=form.nickname.trim();
  const taken=await once(FB.club.child("nicknames/"+nickKey(nick)));
  if(taken) throw {code:"nick-taken",message:"이미 쓰는 닉네임이에요. 다른 닉네임으로 바꿔 주세요"};
  const cred=await FB.auth.createUserWithEmailAndPassword(form.email.trim(),form.password);
  const uid=cred.user.uid;
  const {password,passwordConfirm,photo,...rest}=form;
  const profile={...JSON.parse(JSON.stringify(rest)),email:form.email.trim(),nickname:nick,
    region:form.region==="타지역"?(form.regionCustom||"타지역"):form.region,createdAt:Date.now()};
  await FB.club.child("members/"+uid).set(profile);
  await FB.club.child("nicknames/"+nickKey(nick)).set(uid);
  return {uid,profile};
}

// 승인 대기 화면
function PendingScreen({profile,onRefresh,onLogout}){
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14,textAlign:"center",padding:"12px 0"}}>
      <div style={{fontSize:44}}>⏳</div>
      <h2 style={{margin:0,fontSize:19,color:BLUE}}>가입 승인 대기 중이에요</h2>
      <p style={{margin:0,fontSize:14,color:"#6B7493",lineHeight:1.6}}>{profile&&profile.nickname?`${profile.nickname} 님, `:""}관리자가 승인하면<br/>모임 예약과 대진표를 쓸 수 있어요.</p>
      <button type="button" onClick={onRefresh} style={{...btnPrimary,marginTop:6}}>승인됐는지 다시 확인</button>
      <button type="button" onClick={onLogout} style={{background:"none",border:"none",fontSize:13,color:"#6B7493",cursor:"pointer"}}>로그아웃</button>
    </div>
  );
}

// 관리자 탭: 가입 승인, 회원 목록
function AdminTab(){
  const [members,setMembers]=useState(null);
  const [approved,setApproved]=useState({});
  const [admins,setAdmins]=useState({});
  const [err,setErr]=useState("");
  const [open,setOpen]=useState(null);
  useEffect(()=>{
    const refs=[["members",v=>setMembers(v||{})],["approved",v=>setApproved(v||{})],["admins",v=>setAdmins(v||{})]]
      .map(([p,fn])=>{const r=FB.club.child(p);const h=s=>fn(s.val());r.on("value",h,e=>setErr(authMsg(e)));return ()=>r.off("value",h);});
    return ()=>refs.forEach(f=>f());
  },[]);
  if(err) return <Card><p style={{margin:0,color:"#ef4444",fontSize:14}}>{err}</p></Card>;
  if(!members) return <Card><p style={{margin:0,color:"#6B7493",fontSize:14}}>회원 목록을 불러오는 중이에요…</p></Card>;
  const list=Object.entries(members).map(([uid,p])=>({uid,...p})).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
  const pending=list.filter(m=>!approved[m.uid]&&!admins[m.uid]);
  const active=list.filter(m=>approved[m.uid]||admins[m.uid]);
  const approve=uid=>FB.club.child("approved/"+uid).set(true).catch(e=>setErr(authMsg(e)));
  const revoke=uid=>FB.club.child("approved/"+uid).remove().catch(e=>setErr(authMsg(e)));
  const row=(m,act)=>(
    <div key={m.uid} style={{borderRadius:14,background:"#F5F7FE",padding:"10px 12px"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{flex:1,minWidth:0}} onClick={()=>setOpen(open===m.uid?null:m.uid)}>
          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
            <span style={{fontSize:14,fontWeight:600,color:"#1B2559"}}>{m.nickname||"(닉네임 없음)"}</span>
            {m.ntrp&&<span style={{fontSize:11,color:"#A3AAC2"}}>NTRP {m.ntrp}</span>}
            {admins[m.uid]&&<span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:999,background:GRAD,color:"#fff"}}>관리자</span>}
          </div>
          <span style={{fontSize:11,color:"#A3AAC2"}}>{m.email}{m.inviteCode?` · 가입 코드 ${m.inviteCode}`:""}</span>
        </div>
        {act}
      </div>
      {open===m.uid&&(
        <div style={{marginTop:8,fontSize:12,color:"#4A5578",lineHeight:1.7}}>
          {[["연락처",m.phone],["생년월일",m.birthdate],["지역",m.region],["자주 가는 코트",m.court],["테니스 시작",m.tennisStart&&`${m.tennisStart} (${calcCareer(m.tennisStart)})`],
            ["사용 손",(m.hand||[]).join(", ")],["레슨",m.lessonStatus],["주 운동",m.weeklyFreq],["추천인",m.referrer],["특이사항",m.memo]]
            .filter(([,v])=>v).map(([k,v])=><div key={k}><span style={{color:"#A3AAC2",display:"inline-block",width:84}}>{k}</span>{v}</div>)}
        </div>
      )}
    </div>
  );
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16,paddingBottom:24}}>
      <Card>
        <SectionTitle>가입 승인 대기 ({pending.length}명)</SectionTitle>
        {pending.length===0?<p style={{margin:0,fontSize:13,color:"#A3AAC2"}}>기다리는 사람이 없어요.</p>:(
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {pending.map(m=>row(m,<button type="button" onClick={()=>approve(m.uid)} style={{...btnSmall,background:GRAD}}>승인</button>))}
          </div>
        )}
      </Card>
      <Card>
        <SectionTitle>회원 ({active.length}명)</SectionTitle>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {active.map(m=>row(m,admins[m.uid]?null:<button type="button" onClick={()=>revoke(m.uid)} style={{...btnSmall,background:"#fff",color:"#6B7493",border:"1.5px solid #D6DEF7"}}>승인 취소</button>))}
        </div>
        <p style={{margin:"10px 0 0",fontSize:11,color:"#A3AAC2",lineHeight:1.6}}>이름을 누르면 가입 정보를 볼 수 있어요. 관리자 지정은 파이어베이스 콘솔의 club/admins에서 해요.</p>
      </Card>
    </div>
  );
}

// ─── 대진표 만들기 ───────────────────────────────────────────────────────────
const NTRP_NUM = v => { const x=parseFloat(v); return isNaN(x)?(v==="선출"?6:0):x; };
const toMin = t => { const m=/^(\d{1,2}):(\d{2})/.exec(t||""); return m?(+m[1])*60+(+m[2]):8*60; };
const pad2 = t => t.length<5?"0"+t:t;
const EXCL_LABEL=["전체","첫판✕","막판✕"];

// 개인별 기본 게임 수: 전체 자리(세션 × 코트 × 4)를 고르게 나누고, 남는 판은 위 순위부터
function evenGames(n,total,cap){
  const base=Math.floor(total/n), extra=total%n;
  return Array.from({length:n},(_,i)=>Math.min(cap,base+(i<extra?1:0)));
}
// 합계가 필요 자리 수와 다르면 맞춤 (repo의 fitGames와 같은 방식: 줄일 땐 아래 순위·많은 게임부터, 늘릴 땐 위 순위·적은 게임부터)
function fitTo(games,target,caps){
  const g=games.map((x,i)=>Math.max(1,Math.min(x,caps[i])));
  let t=g.reduce((a,b)=>a+b,0);
  if(caps.reduce((a,b)=>a+b,0)<target) return null;
  for(let guard=0;t!==target&&guard<1000;guard++){
    if(t>target){ const mx=Math.max(...g); for(let i=g.length-1;i>=0&&t>target;i--) if(g[i]===mx&&g[i]>1){g[i]--;t--;} }
    else { const mn=Math.min(...g.filter((x,i)=>x<caps[i])); for(let i=0;i<g.length&&t<target;i++) if(g[i]===mn&&g[i]<caps[i]){g[i]++;t++;} }
  }
  return t===target?g:null;
}
const DUR_OPTIONS=[15,20,25,30,40,45,50,60];

function NumStepper({value,onChange,min,max,unit}){
  return (
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      <button type="button" onClick={()=>onChange(Math.max(min,value-1))} disabled={value<=min} aria-label="줄이기" style={stepBtn(false,value<=min)}>−</button>
      <span style={{minWidth:44,textAlign:"center",fontSize:16,fontWeight:700,color:"#1B2559",fontVariantNumeric:"tabular-nums"}}>{value}{unit}</span>
      <button type="button" onClick={()=>onChange(Math.min(max,value+1))} disabled={value>=max} aria-label="늘리기" style={stepBtn(true,value>=max)}>+</button>
    </div>
  );
}

function BracketSetup({meeting,participants,onCreate}) {
  const [order,setOrder]=useState(()=>participants.slice().sort((x,y)=>NTRP_NUM(y.ntrp)-NTRP_NUM(x.ntrp)));
  const n=order.length;
  // 모임 시간에서 기본값: "08:00 ~ 12:00"
  const [start,setStart]=useState(()=>meeting.time.slice(0,5));
  const [end,setEnd]=useState(()=>(meeting.time.split("~")[1]||"").trim().slice(0,5)||"12:00");
  const [dur,setDur]=useState(30);
  const [courts,setCourts]=useState(()=>Math.max(1,Math.min(2,Math.floor(n/4))));
  const slot=courts*4;
  const span=toMin(end)-toMin(start);
  const k=Math.min(16,Math.max(0,Math.floor(span/dur)));
  const leftover=span>0?span-k*dur:0;
  const total=k*slot;
  const [games,setGames]=useState(()=>evenGames(n,total,k));
  const [excl,setExcl]=useState(()=>order.map(()=>0));
  // 시간·코트·인원이 바뀌면 게임 수를 다시 고르게 나눔
  const layoutKey=`${k}_${slot}_${n}`, lastKey=useRef(layoutKey);
  useEffect(()=>{ if(lastKey.current!==layoutKey){ lastKey.current=layoutKey; setGames(evenGames(n,total,k)); } },[layoutKey]);
  const caps=excl.map(e=>Math.max(0,k-(e?1:0)));
  const sum=games.reduce((a,b)=>a+b,0);
  const c1=excl.filter(e=>e===1).length, c2=excl.filter(e=>e===2).length;
  // 문제 하나만 안내 (위에서부터 우선)
  const problem = span<=0 ? "종료 시간이 시작 시간보다 늦어야 해요."
    : k<1 ? `게임당 ${dur}분이 들어갈 시간이 없어요. 시간을 늘리거나 게임당 시간을 줄여 주세요.`
    : n<slot ? `코트 ${courts}면에는 ${slot}명 이상이 필요해요. 지금 ${n}명이라 코트는 최대 ${Math.floor(n/4)}면이에요.`
    : c1>n-slot||c2>n-slot ? `${c1>n-slot?"첫판":"막판"}에서 빠지는 사람(${Math.max(c1,c2)}명)이 쉬는 자리(${n-slot}명)보다 많아요. 제외를 줄여 주세요.`
    : games.some((g,i)=>g>caps[i]) ? "칠 수 있는 세션 수보다 게임이 많은 사람이 있어요."
    : sum!==total ? `게임 수 합계가 ${sum}이에요. ${k}세션 × 코트 ${courts}면 × 4명 = ${total}자리에 맞아야 해요.`
    : null;
  const fixable=problem&&!(span<=0||k<1||n<slot||c1>n-slot||c2>n-slot);
  const fit=()=>{const f=fitTo(games,total,caps);if(f)setGames(f);};
  const move=(i,d)=>{const j=i+d;if(j<0||j>=n)return;
    const sw=a=>{const c=a.slice();[c[i],c[j]]=[c[j],c[i]];return c;};
    setOrder(sw(order));setGames(sw(games));setExcl(sw(excl));};
  const cycleGames=i=>setGames(g=>g.map((v,x)=>x===i?(v>=Math.max(1,k)?1:v+1):v));
  const cycleExcl=i=>setExcl(e=>e.map((v,x)=>x===i?(v+1)%3:v));
  const create=()=>{
    ENGINE.setLayout(courts,dur); ENGINE.setStart(toMin(start)); ENGINE.setSessions(k);
    const seed=(Date.now()%2147483647)|0;
    const res=ENGINE.solve(n,seed,{games,excl});
    const info=ENGINE.analyze(res.st,n,excl);
    onCreate({
      players:order.map(p=>p.name), ntrp:order.map(p=>p.ntrp||""), guests:order.map(p=>!!p.isGuest),
      games, excl, start, end, dur, courts, seed,
      times:ENGINE.times().map(pad2), ends:ENGINE.ends().map(pad2),
      sessions:res.st.map(p=>({courts:Array.from({length:courts},(_,c)=>({a:[p[c*4],p[c*4+1]],b:[p[c*4+2],p[c*4+3]]})),rest:p.slice(slot)})),
      summary:{diffSum:info.diffSum,restMin:info.restMin,restMax:info.restMax,triple:info.triplePlayers},
      createdAt:Date.now(),
    });
  };
  if(n<4) return (
    <Card style={{textAlign:"center",padding:"28px 18px"}}>
      <div style={{fontSize:36,marginBottom:8}}>🎾</div>
      <p style={{margin:"0 0 4px",fontWeight:700,color:"#1B2559"}}>참석자가 {n}명이에요</p>
      <p style={{margin:0,fontSize:13,color:"#6B7493",lineHeight:1.6}}>복식 대진은 4명 이상부터 만들 수 있어요.<br/>참석자나 게스트가 늘면 다시 와 주세요.</p>
    </Card>
  );
  const label={fontSize:14,fontWeight:600,color:"#2B3674"};
  const rowS={display:"flex",alignItems:"center",justifyContent:"space-between",gap:10};
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Card>
        <SectionTitle>시간 · 코트</SectionTitle>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={rowS}><span style={label}>시작 시간</span><input id="bk-start" type="time" value={start} onChange={e=>setStart(e.target.value)} style={{...inputStyle,width:132,padding:"8px 14px"}}/></div>
          <div style={rowS}><span style={label}>종료 시간</span><input id="bk-end" type="time" value={end} onChange={e=>setEnd(e.target.value)} style={{...inputStyle,width:132,padding:"8px 14px"}}/></div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <span style={label}>게임당 시간</span>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {DUR_OPTIONS.map(m=><button key={m} type="button" onClick={()=>setDur(m)} style={{padding:"6px 12px",borderRadius:999,fontSize:13,cursor:"pointer",fontWeight:dur===m?600:400,border:`1.5px solid ${dur===m?BLUE:"#D6DEF7"}`,background:dur===m?BLUE:"#fff",color:dur===m?"#fff":"#4A5578"}}>{m}분</button>)}
            </div>
          </div>
          <div style={rowS}><span style={label}>코트 수</span><NumStepper value={courts} onChange={setCourts} min={1} max={Math.max(1,Math.min(8,Math.floor(n/4)))} unit="면"/></div>
        </div>
        <div style={{marginTop:14,background:BLUE_LIGHT,borderRadius:16,padding:"12px 14px",fontSize:13,lineHeight:1.6,color:"#2B3674"}}>
          {k>0?(<>
            <b>{k}세션</b> · {start} ~ {pad2(hhmmApp(toMin(start)+k*dur))} · 한 세션에 {slot}명 출전, {Math.max(0,n-slot)}명 휴식
            {leftover>0&&<span style={{display:"block",fontSize:12,color:"#6B7493"}}>종료 전 {leftover}분은 남아요</span>}
          </>):<>세션을 만들 수 없어요</>}
        </div>
      </Card>
      <Card>
        <SectionTitle>참가자 · 게임 수</SectionTitle>
        <p style={{margin:"0 0 12px",fontSize:12,color:"#6B7493",lineHeight:1.6}}>
          위에서부터 실력 순서예요(NTRP 순으로 채워 뒀어요). 화살표로 순서를 고치고, 게임 수와 첫판·막판 제외를 눌러 바꿔요.
        </p>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {order.map((p,i)=>(
            <div key={p.name+i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px 6px 10px",borderRadius:14,background:p.isMe?BLUE_LIGHT:"#F5F7FE",border:p.isMe?`1.5px solid ${BLUE}`:"1.5px solid transparent"}}>
              <span style={{width:20,fontSize:12,fontWeight:700,color:BLUE,textAlign:"center",fontVariantNumeric:"tabular-nums"}}>{i+1}</span>
              <span style={{flex:1,minWidth:0,fontSize:14,fontWeight:p.isMe?700:500,color:"#1B2559",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                {p.name}<span style={{fontSize:11,color:"#A3AAC2",fontWeight:400,marginLeft:5}}>{p.isGuest?"게스트":p.ntrp}</span>
              </span>
              <button type="button" onClick={()=>cycleGames(i)} title="게임 수" style={{...chipBtn,background:"#fff",color:games[i]>caps[i]?"#ef4444":BLUE,border:`1.5px solid ${games[i]>caps[i]?"#ef4444":BLUE}`}}>{games[i]}게임</button>
              <button type="button" onClick={()=>cycleExcl(i)} title="첫판/막판 제외" style={{...chipBtn,width:54,background:excl[i]?"#FFF4E5":"#fff",color:excl[i]?"#C2610C":"#A3AAC2",border:`1.5px solid ${excl[i]?"#FBD38D":"#E4E9F7"}`}}>{EXCL_LABEL[excl[i]]}</button>
              <div style={{display:"flex",flexDirection:"column"}}>
                <button type="button" onClick={()=>move(i,-1)} disabled={i===0} aria-label="위로" style={arrowBtn(i===0)}>▲</button>
                <button type="button" onClick={()=>move(i,1)} disabled={i===n-1} aria-label="아래로" style={arrowBtn(i===n-1)}>▼</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop:14,background:problem?"#FFF4E5":BLUE_LIGHT,borderRadius:16,padding:"12px 14px",fontSize:13,lineHeight:1.6,color:problem?"#9A4A07":"#2B3674"}}>
          {problem||<>게임 수 합계 {sum} = {k}세션 × {slot}자리 ✓</>}
          {fixable&&<button type="button" onClick={fit} style={{...btnSmall,display:"block",marginTop:8,background:"#C2610C"}}>자동으로 맞추기</button>}
        </div>
        <button type="button" disabled={!!problem} onClick={create} style={{...btnPrimary,marginTop:14,opacity:problem?0.45:1,cursor:problem?"default":"pointer"}}>대진표 만들기</button>
      </Card>
    </div>
  );
}
const hhmmApp = m => Math.floor(m/60)+":"+("0"+m%60).slice(-2);

const chipBtn={padding:"5px 0",width:52,borderRadius:999,fontSize:11,fontWeight:600,cursor:"pointer",flexShrink:0};
const arrowBtn=dis=>({background:"none",border:"none",padding:"0 4px",fontSize:9,lineHeight:"13px",color:dis?"#D6DEF7":"#6B7493",cursor:dis?"default":"pointer"});

// ─── 게임 한 판 (스코어 입력) ─────────────────────────────────────────────────
function GameCard({game,court,onScore,me}) {
  const g=game.score, o=game.o;
  const [arm,setArm]=useState(false);
  useEffect(()=>{if(!arm)return;const t=setTimeout(()=>setArm(false),3000);return()=>clearTimeout(t);},[arm]);
  const set=(side,d)=>{
    const nv=Math.max(0,Math.min(6,g[side]+d));
    if(nv===g[side]) return;
    const other=side==="a"?"b":"a";
    if(nv===6&&g[other]===6) return;
    const next={...g,[side]:nv};
    if(!isTie(next)) next.rps=null;
    onScore(game.key,next);
  };
  const chip=o==="a"||o==="b"?{t:(o==="a"?"A팀 승":"B팀 승")+(isTie(g)?" (가위바위보)":""),bg:GRAD,c:"#fff"}
    :o==="draw"?{t:`${g.a}:${g.b} 무승부`,bg:"#FFF4E5",c:"#C2610C"}
    :g.a||g.b?{t:"진행 중",bg:BLUE_LIGHT,c:BLUE}:{t:"시작 전",bg:"#EEF1FA",c:"#A3AAC2"};
  const row=(side)=>{
    const win=o===side, names=game[side];
    return (
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 8px 8px 12px",borderRadius:14,background:win?BLUE_LIGHT:"#F5F7FE",border:win?`1.5px solid ${BLUE}`:"1.5px solid transparent"}}>
        <span style={{fontSize:10,fontWeight:700,color:side==="a"?BLUE:"#6B7493",width:14}}>{side==="a"?"A":"B"}</span>
        <span style={{flex:1,minWidth:0,fontSize:14,fontWeight:win?700:500,color:"#1B2559",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
          {names.map((nm,i)=><span key={i} style={nm===me?{color:BLUE,fontWeight:700}:null}>{i>0?" · ":""}{nm}</span>)}
        </span>
        <button type="button" onClick={()=>set(side,-1)} disabled={g[side]<=0} aria-label={`${side.toUpperCase()}팀 1점 빼기`} style={stepBtn(false,g[side]<=0)}>−</button>
        <span style={{width:22,textAlign:"center",fontSize:20,fontWeight:700,color:win?BLUE:"#1B2559",fontVariantNumeric:"tabular-nums"}}>{g[side]}</span>
        <button type="button" onClick={()=>set(side,1)} disabled={g[side]>=6} aria-label={`${side.toUpperCase()}팀 1점 더하기`} style={stepBtn(true,g[side]>=6)}>+</button>
      </div>
    );
  };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:12,fontWeight:600,color:"#6B7493"}}>코트 {court}</span>
        <span style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20,background:chip.bg,color:chip.c}}>{chip.t}</span>
      </div>
      {row("a")}{row("b")}
      {isTie(g)&&(
        <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#6B7493"}}>
          <span style={{flex:1}}>무승부 · 가위바위보 승자</span>
          {["a","b"].map(sd=><button key={sd} type="button" onClick={()=>onScore(game.key,{...g,rps:g.rps===sd?null:sd})}
            style={{padding:"5px 12px",borderRadius:999,fontSize:12,fontWeight:600,cursor:"pointer",border:`1.5px solid ${g.rps===sd?BLUE:"#D6DEF7"}`,background:g.rps===sd?BLUE:"#fff",color:g.rps===sd?"#fff":"#4A5578"}}>{sd.toUpperCase()}팀</button>)}
        </div>
      )}
      {(g.a>0||g.b>0)&&(
        <button type="button" onClick={()=>{if(arm){onScore(game.key,{a:0,b:0,rps:null});setArm(false);}else setArm(true);}}
          style={{alignSelf:"flex-end",background:"none",border:"none",fontSize:11,color:arm?"#ef4444":"#A3AAC2",cursor:"pointer",padding:"2px 0"}}>
          {arm?"한 번 더 누르면 0:0으로 돌아가요":"이 경기 초기화"}
        </button>
      )}
    </div>
  );
}
const stepBtn=(plus,dis)=>({width:32,height:32,borderRadius:"50%",border:plus?"none":`1.5px solid ${dis?"#E4E9F7":"#D6DEF7"}`,background:plus?(dis?"#DCE4FF":GRAD):"#fff",color:plus?"#fff":(dis?"#D6DEF7":BLUE),fontSize:18,fontWeight:600,lineHeight:1,cursor:dis?"default":"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",padding:0});

// ─── 대진표 + 스코어 + 개인 성적 ─────────────────────────────────────────────
function MeetingBracket({meeting,participants,store}) {
  const {rec,mode,saveBracket,clearBracket,saveScore}=store;
  const [confirm,setConfirm]=useState(false);
  const [show,setShow]=useState("games");
  const bracket=rec&&rec.bracket, scores=(rec&&rec.scores)||{};
  const modeNote={shared:"모임 멤버 모두에게 실시간으로 저장돼요",local:"이 기기에 저장돼요",readonly:"저장 권한이 없어 이 기기에서만 보여요"}[mode];
  const note=<p style={{margin:0,fontSize:11,color:"#A3AAC2",textAlign:"center"}}>{mode==="shared"?"☁️ ":"📱 "}{modeNote}</p>;
  if(!bracket) return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <BracketSetup meeting={meeting} participants={participants} onCreate={saveBracket}/>
      {note}
    </div>
  );
  const games=flatGames(bracket,scores);
  const done=games.filter(g=>g.o==="a"||g.o==="b"||(g.o==="draw")).length;
  const table=standings(bracket,scores);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Card style={{padding:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div>
            <p style={{margin:"0 0 2px",fontSize:15,fontWeight:700,color:"#1B2559"}}>{bracket.players.length}명 · {bracket.sessions.length}세션</p>
            <p style={{margin:0,fontSize:12,color:"#6B7493"}}>{bracket.times[0]} ~ {bracket.ends[bracket.ends.length-1]} · 코트 {bracket.courts||2}면 · 게임당 {bracket.dur||30}분</p>
          </div>
          <div style={{textAlign:"right"}}>
            <p style={{margin:"0 0 2px",fontSize:20,fontWeight:700,color:BLUE,fontVariantNumeric:"tabular-nums"}}>{done}<span style={{fontSize:13,color:"#A3AAC2"}}> / {games.length}</span></p>
            <p style={{margin:0,fontSize:11,color:"#A3AAC2"}}>끝난 게임</p>
          </div>
        </div>
        <div style={{height:6,background:"#E4E9F7",borderRadius:10,marginBottom:10}}><div style={{height:"100%",width:`${games.length?done/games.length*100:0}%`,background:GRAD,borderRadius:10}}/></div>
        <p style={{margin:0,fontSize:11,color:"#A3AAC2"}}>실력 균형(순위 합 차이) {bracket.summary.diffSum} · 휴식 {bracket.summary.restMin===bracket.summary.restMax?bracket.summary.restMin:`${bracket.summary.restMin}~${bracket.summary.restMax}`}회 · 3연속 {bracket.summary.triple}명</p>
      </Card>
      <div style={{display:"flex",background:"#E4E9F7",borderRadius:999,padding:4}}>
        {[["games","대진·스코어"],["table","개인 성적"]].map(([k,l])=>(
          <button key={k} type="button" onClick={()=>setShow(k)} style={{flex:1,padding:"8px 0",borderRadius:999,border:"none",fontSize:13,fontWeight:600,cursor:"pointer",background:show===k?"#fff":"transparent",color:show===k?BLUE:"#6B7493",boxShadow:show===k?"0 2px 8px rgba(40,70,180,0.12)":"none"}}>{l}</button>
        ))}
      </div>
      {show==="games"&&bracket.sessions.map((ses,s)=>(
        <Card key={s} style={{padding:16}}>
          <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:12}}>
            <span style={{fontSize:16,fontWeight:700,color:"#1B2559",fontVariantNumeric:"tabular-nums"}}>{bracket.times[s]}</span>
            <span style={{fontSize:12,color:"#A3AAC2"}}>~ {bracket.ends[s]} · {s+1}세션</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {games.filter(g=>g.s===s).map(g=><GameCard key={g.key} court={g.c+1} game={g} onScore={saveScore} me={ME}/>)}
          </div>
          {(ses.rest||[]).length>0&&<p style={{margin:"12px 0 0",fontSize:12,color:"#6B7493"}}>☕ 휴식 · {ses.rest.map(i=>bracket.players[i]).join(", ")}</p>}
        </Card>
      ))}
      {show==="table"&&(
        <Card>
          <SectionTitle>개인 성적</SectionTitle>
          <div style={{display:"flex",fontSize:11,color:"#A3AAC2",padding:"0 10px 6px",gap:6}}>
            <span style={{width:22}}>순위</span><span style={{flex:1}}>이름</span>
            <span style={{width:56,textAlign:"center"}}>승 무 패</span><span style={{width:34,textAlign:"right"}}>득실</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {table.map((r,i)=>{const me=r.name===ME,diff=r.pf-r.pa;return(
              <div key={r.name} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 10px",borderRadius:14,background:me?BLUE_LIGHT:"#F5F7FE",border:me?`1.5px solid ${BLUE}`:"1.5px solid transparent",fontVariantNumeric:"tabular-nums"}}>
                <span style={{width:22,fontSize:13,fontWeight:700,color:i<3&&r.played?BLUE:"#A3AAC2"}}>{i+1}</span>
                <span style={{flex:1,fontSize:14,fontWeight:me?700:500,color:me?BLUE:"#2B3674"}}>{r.name}</span>
                <span style={{width:56,textAlign:"center",fontSize:13,color:"#2B3674"}}><b style={{color:BLUE}}>{r.w}</b> {r.d} {r.l}</span>
                <span style={{width:34,textAlign:"right",fontSize:13,fontWeight:600,color:diff>0?BLUE:diff<0?"#ef4444":"#A3AAC2"}}>{diff>0?"+":""}{diff}</span>
              </div>
            );})}
          </div>
          <p style={{margin:"10px 0 0",fontSize:11,color:"#A3AAC2"}}>승 수 → 득실 순. 끝난 게임만 집계해요.</p>
        </Card>
      )}
      {confirm?(
        <div style={{background:"#FEF2F2",borderRadius:18,padding:14,display:"flex",flexDirection:"column",gap:10}}>
          <p style={{margin:0,fontSize:13,color:"#B91C1C",lineHeight:1.5}}>대진표와 입력한 점수가 모두 지워지고 설정 화면으로 돌아가요.</p>
          <div style={{display:"flex",gap:8}}>
            <button type="button" onClick={()=>setConfirm(false)} style={{...btnSecondary,padding:"10px 0",fontSize:13}}>취소</button>
            <button type="button" onClick={()=>{clearBracket();setConfirm(false);}} style={{...btnSecondary,padding:"10px 0",fontSize:13,background:"#ef4444",color:"#fff",border:"none"}}>지우고 다시 만들기</button>
          </div>
        </div>
      ):(
        <button type="button" onClick={()=>setConfirm(true)} style={{background:"none",border:"none",fontSize:13,color:"#6B7493",cursor:"pointer",textDecoration:"underline",textUnderlineOffset:3}}>대진표 다시 만들기</button>
      )}
      {note}
    </div>
  );
}

// ─── 예약 상세 ────────────────────────────────────────────────────────────────
// 참석자·대기자 한 줄: 순서, 이름, 투표 시각, 우선순위 표시
function VoteRow({v,idx,wait}) {
  const tag=v.isGuest?{t:`게스트 · ${v.guestOf} 초대`,bg:"#FFF4E5",c:"#C2610C"}
    :v.tier===2?{t:`이달 ${v.count+1}번째 · 후순위`,bg:"#EEF1FA",c:"#6B7493"}:null;
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:14,
      background:v.isMe?BLUE_LIGHT:wait?"#FFFBF2":"#F5F7FE",border:v.isMe?`1.5px solid ${BLUE}`:"1.5px solid transparent"}}>
      <span style={{width:20,textAlign:"center",fontSize:13,fontWeight:700,color:wait?"#C2610C":BLUE,fontVariantNumeric:"tabular-nums"}}>{idx}</span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
          <span style={{fontSize:14,fontWeight:v.isMe?700:500,color:v.isMe?BLUE:"#1B2559"}}>{v.name}</span>
          {!v.isGuest&&<span style={{fontSize:11,color:"#A3AAC2"}}>{v.ntrp}</span>}
          {tag&&<span style={{fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:999,background:tag.bg,color:tag.c}}>{tag.t}</span>}
          {v.bumped&&<span style={{fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:999,background:"#FEF2F2",color:"#ef4444"}}>우선순위로 밀림</span>}
        </div>
        <span style={{fontSize:11,color:"#A3AAC2",fontVariantNumeric:"tabular-nums"}}>{fmtAt(v.at)} 투표</span>
      </div>
    </div>
  );
}

function MeetingDetail({meeting,initialView="info",canManage,onEdit,onDeleted}) {
  const [view,setView]=useState(initialView);
  const store=useMeetingRecord(meeting);
  const [guestInput,setGuestInput]=useState("");
  const [showGuest,setShowGuest]=useState(false);
  const isPast=meeting.status==="past", open=isOpen(meeting);
  // 내 투표 (club/meetings/m<id>/votes/<내 키>)
  const mine=(meeting.rec&&meeting.rec.votes&&meeting.rec.votes[myVoteKey()])||null;
  const myStatus=mine&&mine.status, guests=(mine&&mine.guests)||[];
  const {confirmed,waitlist,counts}=resolveVotes(meeting,meeting.votes);
  const total=confirmed.length;
  const fill=Math.round((total/Math.max(1,meeting.capacity))*100);
  const setMyStatus=val=>store.saveRsvp(voteValue(val,mine));
  const addGuest=()=>{const n=guestInput.trim();if(!n)return;store.saveRsvp({...voteValue("attend",mine),guests:[...guests,{name:n,at:nowAt()}]});setGuestInput("");setShowGuest(false);};
  const removeGuest=i=>store.saveRsvp({...voteValue("attend",mine),guests:guests.filter((_,idx)=>idx!==i)});
  const remove=()=>{ if(!window.confirm(`${meeting.date} 모임을 지울까요? 투표·대진표·점수도 함께 지워져요.`)) return;
    saveMeetingPath("m"+meeting.id,null).then(onDeleted).catch(e=>alert(authMsg(e))); };
  const myCount=counts[ME]||0;
  const myConfirmIdx=confirmed.findIndex(v=>v.isMe), myWaitIdx=waitlist.findIndex(v=>v.isMe);
  const myMsg=myStatus==="attend"
    ?(myConfirmIdx>=0?`✅ 참석 확정 · ${myConfirmIdx+1}번째`:`⏳ 대기 ${myWaitIdx+1}번${myCount>=MONTHLY_PRIORITY_LIMIT?` · 이달 ${myCount}회 참석해서 후순위예요`:""}`)
    :myStatus==="absent"?"❌ 불참으로 등록되었어요":myStatus==="maybe"?"⏳ 미정으로 등록되었어요":"";
  // 대진표 참가자 = 참석 확정자
  const participants=confirmed.map(v=>({name:v.name,ntrp:v.ntrp,isGuest:v.isGuest,isMe:v.isMe}));
  const C={attend:{border:BLUE,bg:BLUE,color:"#fff"},maybe:{border:"#f59e0b",bg:"#fffbeb",color:"#d97706"},absent:{border:"#ef4444",bg:"#fef2f2",color:"#ef4444"}};
  const I={border:"#E4E9F7",bg:"#fff",color:"#6B7493"};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14,paddingBottom:24}}>
      <div style={{display:"flex",background:"#E4E9F7",borderRadius:999,padding:4}}>
        {[["info","모임 정보"],["bracket","대진표 · 스코어"]].map(([k,l])=>(
          <button key={k} type="button" onClick={()=>setView(k)} style={{flex:1,padding:"10px 0",borderRadius:999,border:"none",fontSize:14,fontWeight:600,cursor:"pointer",background:view===k?GRAD:"transparent",color:view===k?"#fff":"#6B7493",boxShadow:view===k?SHADOW_BTN:"none"}}>{l}</button>
        ))}
      </div>
      {view==="bracket"?<MeetingBracket meeting={meeting} participants={participants} store={store}/>:(<>
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <p style={{margin:0,fontSize:17,fontWeight:700,color:"#1B2559"}}>{meeting.date}</p>
          {isPast?<span style={{background:"#EEF1FA",color:"#A3AAC2",fontSize:12,fontWeight:600,padding:"4px 12px",borderRadius:20}}>종료된 모임</span>
            :<span style={{background:BLUE_LIGHT,color:BLUE,fontSize:12,fontWeight:600,padding:"4px 12px",borderRadius:20}}>예약 진행 중</span>}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:14}}>
          {[{icon:"🕗",label:"시간",value:meeting.time},{icon:"📍",label:"장소",value:meeting.place},{icon:"👥",label:"제한 인원",value:`${meeting.capacity}명`},{icon:"🗓️",label:"예약 오픈",value:meeting.openDate}].map(r=>(
            <div key={r.label} style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:15,width:22,textAlign:"center"}}>{r.icon}</span>
              <span style={{fontSize:13,color:"#A3AAC2",width:64}}>{r.label}</span>
              <span style={{fontSize:13,fontWeight:500,color:"#1B2559"}}>{r.value}</span>
            </div>
          ))}
        </div>
        <div style={{marginBottom:isPast?0:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{fontSize:12,color:"#6B7493"}}>참석 현황</span>
            <span style={{fontSize:12,fontWeight:700,color:fill>=100?"#ef4444":BLUE}}>{total} / {meeting.capacity}명{fill>=100?" · 마감":""}</span>
          </div>
          <div style={{height:7,background:"#E4E9F7",borderRadius:10}}><div style={{height:"100%",width:`${Math.min(fill,100)}%`,background:fill>=100?"#ef4444":BLUE,borderRadius:10}}/></div>
        </div>
        {!isPast&&!open&&<p style={{margin:0,fontSize:13,textAlign:"center",color:"#6B7493",background:"#F5F7FE",borderRadius:12,padding:"10px 0"}}>🗓️ 예약은 {meeting.openDate}에 열려요</p>}
        {!isPast&&open&&(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"flex",gap:8}}>
              {[{label:"✓ 참석",val:"attend"},{label:"△ 미정",val:"maybe"},{label:"✕ 불참",val:"absent"}].map(btn=>{
                const active=myStatus===btn.val;const s=active?C[btn.val]:I;
                return <button key={btn.val} type="button" onClick={()=>setMyStatus(btn.val)} style={{flex:1,padding:"9px 0",borderRadius:999,fontSize:13,cursor:"pointer",fontWeight:600,border:`1.5px solid ${s.border}`,background:s.bg,color:s.color}}>{btn.label}</button>;
              })}
            </div>
            {myStatus&&<p style={{margin:0,fontSize:12,textAlign:"center",color:myStatus==="attend"&&myConfirmIdx<0?"#C2610C":"#6B7493"}}>{myMsg}</p>}
            <p style={{margin:0,fontSize:11,textAlign:"center",color:"#A3AAC2"}}>이번 달 참석 확정 {myCount}회 (이 모임 전까지)</p>
            {myStatus==="attend"&&(
              <div style={{background:"#F5F7FE",borderRadius:12,padding:12,border:"1px solid #E4E9F7"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:guests.length>0?10:0}}>
                  <span style={{fontSize:13,fontWeight:600,color:"#2B3674"}}>👥 게스트 초대</span>
                  <button type="button" onClick={()=>setShowGuest(v=>!v)} style={{background:BLUE_LIGHT,border:`1px solid ${BLUE}`,borderRadius:999,color:BLUE,fontSize:12,fontWeight:600,padding:"4px 10px",cursor:"pointer"}}>{showGuest?"취소":"+ 게스트 추가"}</button>
                </div>
                {guests.length>0&&<div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:showGuest?10:0}}>
                  {guests.map((g,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",background:"#fff",borderRadius:999,border:"1px solid #E4E9F7"}}>
                      <span style={{fontSize:16}}>🙋</span>
                      <span style={{flex:1,fontSize:13,color:"#2B3674",fontWeight:500}}>{g.name}</span>
                      <span style={{fontSize:11,background:"#E4E9F7",color:"#6B7493",padding:"2px 7px",borderRadius:10}}>게스트</span>
                      <button type="button" onClick={()=>removeGuest(i)} style={{background:"none",border:"none",color:"#A3AAC2",fontSize:16,cursor:"pointer",padding:0,lineHeight:1}}>✕</button>
                    </div>
                  ))}
                </div>}
                {showGuest&&<div style={{display:"flex",gap:8}}>
                  <input type="text" value={guestInput} onChange={e=>setGuestInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addGuest()} placeholder="게스트 이름 입력" style={{flex:1,border:"1px solid #D6DEF7",borderRadius:999,padding:"8px 12px",fontSize:13,outline:"none"}}/>
                  <button type="button" onClick={addGuest} style={{padding:"8px 14px",background:BLUE,color:"#fff",border:"none",borderRadius:999,fontSize:13,fontWeight:600,cursor:"pointer"}}>추가</button>
                </div>}
                {guests.length===0&&!showGuest&&<p style={{margin:"8px 0 0",fontSize:12,color:"#A3AAC2"}}>게스트를 함께 신청할 수 있어요</p>}
              </div>
            )}
          </div>
        )}
      </Card>
      {meeting.desc&&<Card><SectionTitle>모임 설명 📋</SectionTitle><p style={{margin:0,fontSize:14,color:"#4A5578",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{meeting.desc}</p></Card>}
      <Card>
        <SectionTitle>참석 확정 ({total}/{meeting.capacity}명)</SectionTitle>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
          {[["1","게스트",`최우선`],["2",`이달 ${MONTHLY_PRIORITY_LIMIT}회 이하`,"선착순"],["3",`${MONTHLY_PRIORITY_LIMIT}회 초과`,"후순위"]].map(([n,a,b])=>(
            <span key={n} style={{fontSize:11,padding:"4px 10px",borderRadius:999,background:BLUE_LIGHT,color:"#2B3674"}}><b style={{color:BLUE}}>{n}</b> {a} · {b}</span>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {confirmed.map((v,i)=><VoteRow key={v.name+i} v={v} idx={i+1}/>)}
          {confirmed.length===0&&<p style={{margin:0,fontSize:13,color:"#A3AAC2",textAlign:"center",padding:"8px 0"}}>아직 참석 투표가 없어요</p>}
        </div>
        <p style={{margin:"10px 0 0",fontSize:11,color:"#A3AAC2",lineHeight:1.6}}>참석 횟수는 달마다 새로 세요. 같은 순위 안에서는 투표 시각이 빠른 순이에요.</p>
      </Card>
      {waitlist.length>0&&(
        <Card>
          <SectionTitle>예약 대기 ({waitlist.length}명)</SectionTitle>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {waitlist.map((v,i)=><VoteRow key={v.name+i} v={v} idx={i+1} wait/>)}
          </div>
          <p style={{margin:"10px 0 0",fontSize:12,color:"#A3AAC2"}}>자리가 나면 대기 순서대로 참석 확정돼요.</p>
        </Card>
      )}
      {canManage&&(
        <div style={{display:"flex",gap:8}}>
          <button type="button" onClick={onEdit} style={{...btnSecondary,flex:1}}>모임 수정</button>
          <button type="button" onClick={remove} style={{...btnSecondary,flex:1,color:"#ef4444",borderColor:"#FBD5D5"}}>모임 삭제</button>
        </div>
      )}
      {meeting.createdBy&&<p style={{margin:0,fontSize:11,color:"#A3AAC2",textAlign:"center"}}>{meeting.createdBy} 님이 만든 모임</p>}
      </>)}
    </div>
  );
}

// ─── 예약 탭 ──────────────────────────────────────────────────────────────────
function BookingTab({open,onOpen,ready,canManage,onEdit,onDeleted,onCreate}) {
  const setSelId=id=>onOpen(id,"info");
  const sel=open&&MEETINGS.find(m=>m.id===open.id);
  if(sel) return <MeetingDetail key={sel.id+open.view} meeting={sel} initialView={open.view} canManage={canManage(sel)} onEdit={()=>onEdit(sel)} onDeleted={onDeleted}/>;
  if(open) return <Card><p style={{margin:0,fontSize:14,color:"#6B7493"}}>{ready?"모임을 찾을 수 없어요. 지워졌을 수 있어요.":"모임을 불러오는 중이에요…"}</p></Card>;
  const upcoming=MEETINGS.filter(m=>m.status==="upcoming");
  const past=MEETINGS.filter(m=>m.status==="past");
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20,paddingBottom:24}}>
      <div>
        <p style={{margin:"0 0 10px",fontSize:15,fontWeight:700,color:"#1B2559"}}>다가오는 모임</p>
        {upcoming.length===0&&<Empty action="+ 모임 만들기" onAction={onCreate}>{ready?"아직 잡힌 모임이 없어요.":"모임을 불러오는 중이에요…"}</Empty>}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {upcoming.map(m=>{
            const fill=Math.min(100,Math.round((m.attendees.length/Math.max(1,m.capacity))*100));
            const isAtt=m.attendees.some(a=>a.isMe);
            return(
              <div key={m.id} onClick={()=>setSelId(m.id)} style={{background:"#fff",borderRadius:22,padding:18,boxShadow:SHADOW,cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div>
                    <p style={{margin:"0 0 4px",fontWeight:700,fontSize:15,color:"#1B2559"}}>{m.date}</p>
                    <p style={{margin:"0 0 2px",fontSize:13,color:"#6B7493"}}>🕗 {m.time}</p>
                    <p style={{margin:0,fontSize:13,color:"#6B7493"}}>📍 {m.place}</p>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                    <span style={{background:BLUE_LIGHT,color:BLUE,fontSize:12,fontWeight:600,padding:"3px 10px",borderRadius:20}}>{m.attendees.length}/{m.capacity}명</span>
                    {isAtt&&<span style={{background:GRAD,color:"#fff",fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20}}>참석 예정</span>}
                  </div>
                </div>
                <div style={{height:5,background:"#E4E9F7",borderRadius:10}}><div style={{height:"100%",width:`${fill}%`,background:GRAD,borderRadius:10}}/></div>
                <p style={{margin:"8px 0 0",fontSize:12,color:"#A3AAC2",textAlign:"right"}}>탭해서 자세히 보기 →</p>
              </div>
            );
          })}
        </div>
      </div>
      {past.length>0&&(
        <div>
          <p style={{margin:"0 0 10px",fontSize:15,fontWeight:700,color:"#A3AAC2"}}>지난 모임</p>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {past.map(m=>(
              <div key={m.id} onClick={()=>setSelId(m.id)} style={{background:"#F5F7FE",borderRadius:20,padding:14,border:"1px solid #E4E9F7",cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <p style={{margin:"0 0 3px",fontWeight:600,fontSize:14,color:"#6B7493"}}>{m.date}</p>
                    <p style={{margin:0,fontSize:12,color:"#A3AAC2"}}>📍 {m.place} · {m.attendees.length}명 참석</p>
                  </div>
                  <span style={{background:"#E4E9F7",color:"#A3AAC2",fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20}}>종료</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 통계 탭 ──────────────────────────────────────────────────────────────────
function StatsTab() {
  const held=heldMeetings(), mineList=myHeld();
  const year=todayYmd().slice(0,4);
  // 연속 참석: 가장 최근 모임부터 거꾸로, 빠지지 않고 참석한 횟수
  let streak=0; for(const m of held){ if((m.attendees||[]).some(a=>a.isMe)) streak++; else break; }
  // 최근 6개월: 나 vs 참석한 회원 평균
  const now=new Date(), months=[];
  for(let i=5;i>=0;i--){ const d=new Date(now.getFullYear(),now.getMonth()-i,1); months.push({key:`${d.getFullYear()}.${pad0(d.getMonth()+1)}`,label:`${d.getMonth()+1}월`}); }
  const rows=months.map(mo=>{
    const list=held.filter(m=>m.date.slice(0,7)===mo.key);
    const r=rankingOf(list), me=r.find(x=>x.isMe);
    const avg=r.length?r.reduce((a,x)=>a+x.count,0)/r.length:0;
    return {...mo,me:me?me.count:0,avg:Math.round(avg*10)/10};
  });
  const maxVal=Math.max(1,...rows.map(r=>Math.max(r.me,r.avg)));
  const rank=rankingOf(held);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16,paddingBottom:24}}>
      <div style={{display:"flex",gap:10}}>
        {[{label:"총 누적 참석",value:`${mineList.length}회`},{label:"올해 참석",value:`${mineList.filter(m=>m.iso.slice(0,4)===year).length}회`},{label:"연속 참석",value:`${streak}회${streak>=3?" 🔥":""}`}].map(s=>(
          <Card key={s.label} style={{flex:1,textAlign:"center",padding:14}}>
            <p style={{margin:"0 0 6px",fontSize:11,color:"#A3AAC2"}}>{s.label}</p>
            <p style={{margin:0,fontSize:18,fontWeight:700,color:BLUE,fontVariantNumeric:"tabular-nums"}}>{s.value}</p>
          </Card>
        ))}
      </div>
      <Card>
        <SectionTitle>월별 참석 횟수</SectionTitle>
        <div style={{display:"flex",alignItems:"flex-end",gap:6,height:120,padding:"0 4px"}}>
          {rows.map(r=>(
            <div key={r.key} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <span style={{fontSize:10,color:BLUE,fontWeight:700}}>{r.me}</span>
              <div style={{width:"100%",display:"flex",gap:2,alignItems:"flex-end",height:80}}>
                <div style={{flex:1,background:"linear-gradient(180deg,#5B8DEF,#3B63F3)",borderRadius:"6px 6px 0 0",height:`${(r.me/maxVal)*100}%`,minHeight:4}}/>
                <div style={{flex:1,background:"#DCE4FF",borderRadius:"6px 6px 0 0",height:`${(r.avg/maxVal)*100}%`,minHeight:4}}/>
              </div>
              <span style={{fontSize:10,color:"#A3AAC2"}}>{r.label}</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:16,justifyContent:"center",marginTop:10}}>
          {[{bg:BLUE,label:"나"},{bg:"#DCE4FF",label:"참석 회원 평균"}].map(l=>(
            <div key={l.label} style={{display:"flex",alignItems:"center",gap:5}}>
              <div style={{width:10,height:10,background:l.bg,borderRadius:2}}/>
              <span style={{fontSize:11,color:"#6B7493"}}>{l.label}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <SectionTitle>전체 참여 랭킹</SectionTitle>
        {rank.length===0?<Empty>아직 참석 기록이 없어요.</Empty>:(
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {rank.map(r=>(
            <div key={r.name} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:10,background:r.isMe?BLUE_LIGHT:"#F5F7FE",border:r.isMe?`1.5px solid ${BLUE}`:"1px solid transparent"}}>
              <span style={{width:22,textAlign:"center",fontSize:r.badge?16:13,fontWeight:700,color:"#A3AAC2"}}>{r.badge||r.rank}</span>
              <span style={{flex:1,fontSize:14,fontWeight:r.isMe?700:500,color:r.isMe?BLUE:"#2B3674"}}>{r.name}{r.isMe&&<span style={{fontSize:11,background:BLUE,color:"#fff",padding:"1px 6px",borderRadius:10,marginLeft:6}}>나</span>}</span>
              <div style={{width:70,height:6,background:"#E4E9F7",borderRadius:10}}><div style={{height:"100%",width:`${(r.count/rank[0].count)*100}%`,background:r.isMe?BLUE:"#A9BCFF",borderRadius:10}}/></div>
              <span style={{fontSize:13,fontWeight:700,color:BLUE,width:28,textAlign:"right"}}>{r.count}</span>
            </div>
          ))}
        </div>)}
      </Card>
    </div>
  );
}

// ─── 모임 만들기·수정 ─────────────────────────────────────────────────────────
// 기본값: 다음 토요일 08:00~12:00, 정원 12명, 예약 오픈은 모임 7일 전 00:00
function nextSaturday(){ const d=new Date(); d.setDate(d.getDate()+((6-d.getDay()+7)%7||7)); return ymd(d); }
const weekBefore=iso=>{ const d=new Date(iso+"T00:00:00"); d.setDate(d.getDate()-7); return ymd(d)+"T00:00"; };
function MeetingForm({initial,onClose,onSaved}) {
  const editing=!!initial;
  const [f,setF]=useState(()=>initial?{...initial.info,capacity:String(initial.info.capacity),openAt:initial.info.openAt||""}
    :(()=>{const date=nextSaturday();return {date,start:"08:00",end:"12:00",place:"",capacity:"12",openAt:weekBefore(date),desc:""};})());
  const [errors,setErrors]=useState({});
  const [saving,setSaving]=useState(false);
  const [err,setErr]=useState("");
  const set=(k,v)=>setF(p=>{const n={...p,[k]:v}; if(k==="date"&&!editing&&v) n.openAt=weekBefore(v); return n;});
  const submit=()=>{
    const e={};
    if(!f.date) e.date="날짜를 골라 주세요";
    if(!f.start||!f.end) e.time="시작·종료 시간을 넣어 주세요"; else if(f.end<=f.start) e.time="종료 시간이 시작보다 늦어야 해요";
    if(!f.place.trim()) e.place="장소를 입력해 주세요";
    const cap=parseInt(f.capacity,10); if(!(cap>=2&&cap<=99)) e.capacity="정원은 2~99명이에요";
    if(f.openAt&&f.date&&f.openAt.slice(0,10)>f.date) e.openAt="예약 오픈은 모임 날짜보다 빨라야 해요";
    setErrors(e); if(Object.keys(e).length) return;
    const id=editing?initial.id:Date.now();
    const info={date:f.date,start:f.start,end:f.end,place:f.place.trim(),capacity:cap,openAt:f.openAt||"",desc:(f.desc||"").trim(),
      createdBy:editing?(initial.info.createdBy||""):ME,
      createdByUid:editing?(initial.info.createdByUid||""):((FB&&FB.auth.currentUser&&FB.auth.currentUser.uid)||""),
      createdAt:editing?(initial.info.createdAt||Date.now()):Date.now(),...(editing?{updatedAt:Date.now()}:{})};
    setSaving(true); setErr("");
    saveMeetingPath("m"+id+"/info",info).then(()=>onSaved(id)).catch(e=>{setSaving(false);setErr(authMsg(e));});
  };
  const row={display:"flex",gap:10};
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(16,24,64,0.45)",zIndex:60,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div role="dialog" aria-label={editing?"모임 수정":"모임 만들기"} onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:440,maxHeight:"92vh",overflowY:"auto",background:"#F3F5FB",borderRadius:"28px 28px 0 0",padding:"20px 18px calc(20px + env(safe-area-inset-bottom,0px))",boxSizing:"border-box",fontFamily:FONT}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <p style={{margin:0,fontSize:19,fontWeight:700,color:"#1B2559"}}>{editing?"모임 수정 ✏️":"모임 만들기 🎾"}</p>
          <button type="button" onClick={onClose} aria-label="닫기" style={{background:"#E4E9F7",border:"none",borderRadius:"50%",width:34,height:34,fontSize:16,color:"#6B7493",cursor:"pointer"}}>✕</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <FieldWrap label="날짜" required error={errors.date}>
            <input type="date" value={f.date} onChange={e=>set("date",e.target.value)} style={inputStyle}/>
          </FieldWrap>
          <FieldWrap label="시간" required error={errors.time}>
            <div style={row}>
              <input type="time" aria-label="시작 시간" value={f.start} onChange={e=>set("start",e.target.value)} style={{...inputStyle,flex:1}}/>
              <span style={{alignSelf:"center",color:"#A3AAC2"}}>~</span>
              <input type="time" aria-label="종료 시간" value={f.end} onChange={e=>set("end",e.target.value)} style={{...inputStyle,flex:1}}/>
            </div>
          </FieldWrap>
          <FieldWrap label="장소" required error={errors.place}>
            <input type="text" value={f.place} onChange={e=>set("place",e.target.value)} placeholder="예: 올림픽공원 테니스장" style={inputStyle}/>
          </FieldWrap>
          <FieldWrap label="정원" required error={errors.capacity}>
            <input type="number" inputMode="numeric" min={2} max={99} value={f.capacity} onChange={e=>set("capacity",e.target.value)} style={inputStyle}/>
          </FieldWrap>
          <FieldWrap label="예약 오픈" error={errors.openAt}>
            <input type="datetime-local" value={f.openAt} onChange={e=>set("openAt",e.target.value)} style={inputStyle}/>
            <p style={{margin:"6px 0 0",fontSize:11,color:"#A3AAC2"}}>이 시각부터 참석 투표를 받아요. 비우면 바로 열려요.</p>
          </FieldWrap>
          <FieldWrap label="모임 설명">
            <textarea value={f.desc} onChange={e=>set("desc",e.target.value)} rows={3} placeholder="진행 방식, 준비물 등" style={{...inputStyle,borderRadius:18,resize:"none"}}/>
          </FieldWrap>
          {err&&<p style={{margin:0,fontSize:13,color:"#ef4444"}}>{err}</p>}
          <button type="button" disabled={saving} onClick={submit} style={{...btnPrimary,opacity:saving?0.6:1}}>{saving?"저장 중…":editing?"수정 완료":"모임 만들기"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── 메인 앱 ──────────────────────────────────────────────────────────────────
const TABS=[{key:"home",label:"홈",icon:"home"},{key:"booking",label:"예약",icon:"calendar"},{key:"stats",label:"통계",icon:"chart"}];

// 폰트·포커스 링 등 인라인 스타일로 못 쓰는 전역 스타일
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Poppins:wght@400;500;600;700&display=swap');
body{margin:0;background:#E9EDFA;font-family:${FONT};color:#1B2559;-webkit-font-smoothing:antialiased}
button,input,select,textarea{font-family:inherit}
input:focus,select:focus,textarea:focus{border-color:${BLUE}!important;box-shadow:0 0 0 3px rgba(59,99,243,0.15)}
button:focus-visible{outline:2px solid ${BLUE};outline-offset:2px}
::placeholder{color:#A3AAC2}
`;

const iconBtn={width:38,height:38,borderRadius:"50%",border:"none",background:"rgba(255,255,255,0.18)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"};

// ── 스플래시 화면 (SSTC_app_assets/splash.html) ──
// 원본은 390×844 고정 크기라 비율 그대로 화면에 맞게 키우거나 줄여서 가운데 놓아요. 애니메이션 CSS는 src/splash.css.
const SPLASH_W=390, SPLASH_H=844;
function SplashScreen({onStart}) {
  const fit=()=>Math.min(window.innerWidth/SPLASH_W, window.innerHeight/SPLASH_H);
  const [scale,setScale]=useState(fit);
  useEffect(()=>{
    const onResize=()=>setScale(fit());
    window.addEventListener("resize",onResize);
    return ()=>window.removeEventListener("resize",onResize);
  },[]);
  return(
    <div style={{position:"fixed",inset:0,background:"#2152E6",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",zIndex:100}}>
      <div style={{width:SPLASH_W*scale,height:SPLASH_H*scale,flexShrink:0}}>
        <div style={{width:SPLASH_W,height:SPLASH_H,transform:`scale(${scale})`,transformOrigin:"0 0"}}>
      <div style={{width:"390px",height:"844px",position:"relative",overflow:"hidden",background:"#2152E6",fontFamily:"Fredoka, Jua, system-ui, sans-serif",display:"flex",flexDirection:"column",alignItems:"center",boxSizing:"border-box",padding:"112px 32px 48px"}}>
      <svg aria-hidden="true" width="390" height="844" viewBox="0 0 390 844" style={{position:"absolute",left:"0",top:"0"}}>
      <g stroke="rgba(255,255,255,0.2)" strokeWidth="3" fill="none">
      <rect x="30" y="64" width="330" height="715"/>
      <path d="M71 64 V779 M319 64 V779"/>
      <path d="M71 229 H319 M71 614 H319"/>
      <path d="M195 229 V614"/>
      <path d="M195 64 V76 M195 779 V767"/>
      </g>
      <path d="M18 421.5 H372" stroke="rgba(255,255,255,0.32)" strokeWidth="5" strokeDasharray="2 4"/>
      <path d="M18 421.5 H372" stroke="rgba(255,255,255,0.22)" strokeWidth="2"/>
      <circle cx="18" cy="421.5" r="4" fill="rgba(255,255,255,0.32)"/>
      <circle cx="372" cy="421.5" r="4" fill="rgba(255,255,255,0.32)"/>
      </svg>
      <div className="sp-title" style={{position:"relative",display:"flex",flexDirection:"column",alignItems:"center",gap:"10px"}}>
      <h1 style={{margin:"0",fontSize:"84px",fontWeight:"700",color:"#FFFFFF",letterSpacing:"5px",lineHeight:"1"}}>SSTC</h1>
      <p style={{margin:"0",padding:"6px 14px",borderRadius:"999px",background:"rgba(11,30,91,0.35)",color:"#DCE8FF",fontSize:"14px",fontWeight:"600",letterSpacing:"2px",whiteSpace:"nowrap"}}>SERVE &amp; SMASH TENNIS CLUB</p>
      </div>
      <div style={{position:"relative",width:"326px",height:"380px",marginTop:"28px",flexShrink:"0"}}>
      <svg className="sp-spark" aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" style={{position:"absolute",left:"14px",top:"40px"}}><path d="M12 2v6M12 16v6M2 12h6M16 12h6" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none"/></svg>
      <svg className="sp-spark b" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" style={{position:"absolute",right:"18px",top:"150px"}}><path d="M12 2v6M12 16v6M2 12h6M16 12h6" stroke="#D7F24A" strokeWidth="3" strokeLinecap="round" fill="none"/></svg>
      <svg className="sp-spark c" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" style={{position:"absolute",left:"120px",top:"8px"}}><path d="M12 2v6M12 16v6M2 12h6M16 12h6" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none"/></svg>
      <div style={{position:"absolute",left:"63px",bottom:"22px",width:"200px",display:"flex",flexDirection:"column",alignItems:"center",zIndex:"2"}}>
      <div className="sp-move" style={{position:"relative",width:"200px",height:"200px"}}>
      <div className="sp-bubble" style={{position:"absolute",left:"118px",top:"-48px",zIndex:"3"}}>
      <p style={{margin:"0",padding:"12px 18px",borderRadius:"20px",background:"#FFFFFF",color:"#0B1E5B",fontSize:"22px",fontWeight:"600",whiteSpace:"nowrap",boxShadow:"0 6px 0 rgba(11,30,91,0.25)",display:"grid"}}><span className="sp-sorry" style={{gridArea:"1 / 1"}}>Sorry…</span><span className="sp-smug" style={{gridArea:"1 / 1"}}>not sorry</span></p>
      <div aria-hidden="true" style={{position:"absolute",left:"22px",bottom:"-8px",width:"18px",height:"18px",background:"#FFFFFF",transform:"rotate(45deg)",borderRadius:"3px"}}></div>
      </div>
      <div className="sp-bounce" style={{width:"200px",height:"200px"}}>
      <svg role="img" aria-label="Tennis ball mascot hiding a smug grin behind its hand" width="200" height="200" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="56" fill="#D7F24A"/>
      <path d="M12 32 C 40 44, 40 76, 12 88" stroke="#FFFFFF" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M108 32 C 80 44, 80 76, 108 88" stroke="#FFFFFF" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <g className="sp-sorry" transform="rotate(4 60 60)">
      <path d="M33 47 Q 42 46 50 39" stroke="#0B1E5B" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M70 39 Q 78 46 87 47" stroke="#0B1E5B" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <ellipse cx="43" cy="60" rx="6.5" ry="7.5" fill="#0B1E5B"/>
      <circle cx="45.5" cy="57" r="2.6" fill="#FFFFFF"/>
      <circle cx="41" cy="63.5" r="1.3" fill="#FFFFFF"/>
      <ellipse cx="77" cy="60" rx="6.5" ry="7.5" fill="#0B1E5B"/>
      <circle cx="79.5" cy="57" r="2.6" fill="#FFFFFF"/>
      <circle cx="75" cy="63.5" r="1.3" fill="#FFFFFF"/>
      <path d="M94 38 Q 98 45 94 48 Q 90 45 94 38 Z" fill="#9CD3FF"/>
      </g>
      <g className="sp-smug" transform="rotate(-7 60 60)">
      <path d="M36 46 Q 44 43.5 52 46" stroke="#0B1E5B" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M68 43 Q 76 36 86 41" stroke="#0B1E5B" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <g className="sp-wink">
      <ellipse cx="44" cy="58" rx="8" ry="6" fill="#FFFFFF"/>
      <circle cx="48" cy="59.5" r="4.2" fill="#0B1E5B"/>
      <circle cx="49.5" cy="58" r="1.3" fill="#FFFFFF"/>
      <path d="M35 57 Q 44 48 53 57 Z" fill="#D7F24A"/>
      <path d="M35 57 Q 44 54.5 53 57" stroke="#0B1E5B" strokeWidth="3" fill="none" strokeLinecap="round"/>
      </g>
      <g className="sp-wink">
      <ellipse cx="76" cy="58" rx="8" ry="6" fill="#FFFFFF"/>
      <circle cx="80" cy="59.5" r="4.2" fill="#0B1E5B"/>
      <circle cx="81.5" cy="58" r="1.3" fill="#FFFFFF"/>
      <path d="M67 57 Q 76 48 85 57 Z" fill="#D7F24A"/>
      <path d="M67 57 Q 76 54.5 85 57" stroke="#0B1E5B" strokeWidth="3" fill="none" strokeLinecap="round"/>
      </g>
      <path d="M45 72 Q 62 87 77 70 Q 62 79 45 72 Z" fill="#FF4F8B" stroke="#0B1E5B" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M76 70.5 Q 80 69.5 80 66" stroke="#0B1E5B" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      </g>
      <ellipse cx="32" cy="71" rx="8" ry="4.5" fill="#FF8FB1" opacity="0.75"/>
      <ellipse cx="88" cy="71" rx="8" ry="4.5" fill="#FF8FB1" opacity="0.75"/>
      <g className="sp-hand">
      <path d="M60 99 V117" stroke="#0B1E5B" strokeWidth="7.5" strokeLinecap="round" fill="none"/>
      <path d="M60 105 V110" stroke="#FF8FB1" strokeWidth="7.5" fill="none"/>
      <path d="M54 91 L60 100 L66 91" stroke="#0B1E5B" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" fill="none"/>
      <ellipse cx="60" cy="78" rx="13" ry="15" fill="#FFFFFF" stroke="#0B1E5B" strokeWidth="3"/>
      <path d="M54 65 V91 M60 63.5 V92.5 M66 65 V91 M49 70 H71 M47 78 H73 M49 86 H71" stroke="#8FA2D9" strokeWidth="1.4" fill="none"/>
      </g>
      </svg>
      </div>
      </div>
      <div className="sp-shadow" aria-hidden="true" style={{width:"150px",height:"18px",borderRadius:"50%",background:"#0B1E5B",marginTop:"-6px"}}></div>
      </div>
      </div>
      <div style={{marginTop:"auto",width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:"22px",position:"relative"}}>
      <div aria-hidden="true" style={{display:"flex",gap:"10px"}}>
      <div className="sp-dot" style={{width:"10px",height:"10px",borderRadius:"50%",background:"#D7F24A"}}></div>
      <div className="sp-dot b" style={{width:"10px",height:"10px",borderRadius:"50%",background:"#D7F24A"}}></div>
      <div className="sp-dot c" style={{width:"10px",height:"10px",borderRadius:"50%",background:"#D7F24A"}}></div>
      </div>
      <button className="sp-cta" type="button" onClick={onStart} lang="ko" style={{width:"100%",height:"58px",border:"0",borderRadius:"18px",background:"#FFFFFF",color:"#0B1E5B",fontFamily:"Jua, Fredoka, system-ui, sans-serif",fontSize:"20px",cursor:"pointer",boxShadow:"0 6px 0 rgba(11,30,91,0.3)"}}>시작하기</button>
      </div>
      </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // screen: "login" | "forgot" | "signup" | "main"
  const [splash,setSplash]=useState(true);   // 앱을 열 때마다 스플래시부터
  const list=useMeetingList();               // 모든 모임 (실시간)
  const [mForm,setForm2]=useState(null);      // 모임 만들기·수정 창: {initial} | null
  const [screen,setScreen]=useState("login");
  const [step,setStep]=useState(1);
  const [signupDone,setSignupDone]=useState(false);
  const [tab,setTab]=useState("home");
  const [wink,setWink]=useState(false);   // 로고를 누르면 SSTC의 속뜻이 보여요
  const [openMeeting,setOpenMeeting]=useState(null); // {id, view, from}
  // 모임을 열면 주소에 #meeting-<id>를 붙여서 폰·브라우저 뒤로가기로도 닫히게 함
  const openM=(id,view,from)=>{
    setOpenMeeting({id,view,from});setTab("booking");
    try{ window.scrollTo(0,0); }catch(e){}
    try{ if(location.hash!=="#meeting-"+id) location.hash="meeting-"+id; }catch(e){}
  };
  const afterClose=m=>{ setOpenMeeting(null); if(m&&m.from==="home") setTab("home"); };
  const closeM=()=>{
    let viaHistory=false;
    try{ if(location.hash.indexOf("#meeting-")===0){ viaHistory=true; history.back(); } }catch(e){}
    if(!viaHistory) afterClose(openMeeting);
  };
  const openRef=useRef(openMeeting); openRef.current=openMeeting;
  useEffect(()=>{
    const onHash=()=>{ if(openRef.current&&location.hash.indexOf("#meeting-")!==0) afterClose(openRef.current); };
    window.addEventListener("hashchange",onHash);
    return ()=>window.removeEventListener("hashchange",onHash);
  },[]);
  const IS_ADMIN=!FB; // 데모(파이어베이스 없음)에서만 필수 입력 건너뛰기 허용

  // ── 회원 계정 ──
  const [account,setAccount]=useState(FB?{loading:true}:null); // {user, profile, admin, approved}
  const [signupErr,setSignupErr]=useState("");
  const [signupBusy,setSignupBusy]=useState(false);
  const signingUp=useRef(false);
  const loadAccount=async user=>{
    const [profile,admin,approved]=await Promise.all(["members/","admins/","approved/"].map(p=>once(FB.club.child(p+user.uid)).catch(()=>null)));
    setMe(profile);
    setAccount({user,profile:profile||null,admin:!!admin,approved:!!approved});
    return profile;
  };
  useEffect(()=>{
    if(!FB) return;
    return FB.auth.onAuthStateChanged(user=>{
      if(!user){ setAccount(null); setScreen(s=>s==="main"?"login":s); return; }
      if(signingUp.current) return;   // 가입 중에는 가입 완료 화면을 먼저 보여줌
      loadAccount(user).then(()=>setScreen("main"));
    });
  },[]);
  const logout=()=>{ if(FB) FB.auth.signOut(); setScreen("login"); setTab("home"); setOpenMeeting(null); };
  const submitSignup=async()=>{
    if(!FB){ setSignupDone(true); return; }
    setSignupErr(""); setSignupBusy(true); signingUp.current=true;
    try{
      const {profile}=await signUpMember(form);
      setMe(profile); setSignupDone(true);
    }catch(e){
      signingUp.current=false;
      setSignupErr(e&&e.code==="nick-taken"?e.message:authMsg(e));
      if(e&&e.code==="nick-taken") setStep(2);
      else if(e&&/email|password/.test(e.code||"")) setStep(1);
    }finally{ setSignupBusy(false); }
  };
  const finishSignup=()=>{
    signingUp.current=false; setSignupDone(false); setStep(1);
    if(FB&&FB.auth.currentUser) loadAccount(FB.auth.currentUser).then(()=>setScreen("main"));
    else setScreen("main");
  };

  const [form,setForm]=useState({
    email:"",password:"",passwordConfirm:"",inviteCode:"",referrer:"",
    photo:null,nickname:"",birthdate:"",phone:"",region:"",regionCustom:"",court:"",
    tennisStart:"",lessonStatus:"",lessonMemo:"",ntrp:"",
    hand:[],weeklyFreq:"",otherClub:"",otherClubName:"",
    award:"",awardList:[""],memo:"",
  });
  const onChange=(key,val)=>setForm(p=>({...p,[key]:val}));

  if(splash) return <SplashScreen onStart={()=>setSplash(false)}/>;

  // ── 로그인/회원가입 화면 (승인 대기·로딩도 같은 틀) ──
  const pending=FB&&screen==="main"&&account&&account.user&&!account.admin&&!account.approved;
  const loading=FB&&account&&account.loading;
  if(screen!=="main"||pending||loading) {
    const titles={login:"로그인",forgot:"비밀번호 찾기",signup:"회원가입"};
    return(
      <div style={{minHeight:"100vh",background:"#F3F5FB",maxWidth:440,margin:"0 auto",fontFamily:FONT}}>
        <style>{GLOBAL_CSS}</style>
        {/* 파란 히어로 */}
        <div style={{background:GRAD,borderRadius:"0 0 36px 36px",padding:`${screen==="login"?56:36}px 24px ${screen==="login"?88:72}px`,color:"#fff",textAlign:"center",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",width:220,height:220,borderRadius:"50%",border:"1.5px solid rgba(255,255,255,0.18)",top:-90,right:-70}}/>
          <div style={{position:"absolute",width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,0.07)",bottom:-50,left:-40}}/>
          <div style={{width:screen==="login"?92:68,height:screen==="login"?92:68,margin:"0 auto 14px",borderRadius:"50%",border:"2px solid rgba(255,255,255,0.85)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:screen==="login"?42:30,background:"rgba(255,255,255,0.12)",cursor:"pointer",userSelect:"none"}} onClick={()=>setWink(w=>!w)}>{wink?"😜":"🎾"}</div>
          <h1 style={{fontSize:30,fontWeight:700,margin:"0 0 2px",letterSpacing:"0.08em"}}>SSTC</h1>
          <p style={{fontSize:12,margin:"0 0 10px",opacity:0.8,letterSpacing:"0.04em"}}>{wink?"Sorry, not sorry":"Serve & Smash Tennis Club"}</p>
          <p style={{fontSize:14,margin:0,opacity:0.85}}>{loading?"불러오는 중":pending?"승인 대기":titles[screen]}</p>
        </div>
        <div style={{padding:"0 16px 48px",marginTop:-48,position:"relative"}}>
          <div style={{background:"#fff",borderRadius:28,boxShadow:"0 12px 40px rgba(40,70,180,0.12)",padding:"28px 22px"}}>
            {loading&&<p style={{margin:0,textAlign:"center",color:"#6B7493",fontSize:14}}>잠시만요…</p>}
            {!loading&&pending&&<PendingScreen profile={account.profile} onRefresh={()=>loadAccount(account.user)} onLogout={logout}/>}
            {!loading&&!pending&&screen==="login"&&<LoginScreen onSignup={()=>setScreen("signup")} onForgot={()=>setScreen("forgot")} onLogin={()=>setScreen("main")}/>}
            {!loading&&!pending&&screen==="forgot"&&<ForgotScreen onBack={()=>setScreen("login")}/>}
            {!loading&&!pending&&screen==="signup"&&(
              signupDone?(
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"40px 0",gap:16,textAlign:"center"}}>
                  <div style={{width:96,height:96,borderRadius:"50%",background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:46,boxShadow:SHADOW_BTN}}>🎾</div>
                  <h2 style={{fontSize:20,fontWeight:700,color:BLUE,margin:0}}>가입 완료!</h2>
                  <p style={{color:"#6B7493",fontSize:14,margin:0,lineHeight:1.6}}>모임에 오신 걸 환영해요.<br/>관리자 승인 후 이용 가능합니다.</p>
                  <button onClick={finishSignup} style={{...btnPrimary,width:"auto",padding:"13px 36px",marginTop:8}}>{FB?"확인":"홈으로 이동"}</button>
                </div>
              ):(
                <>
                  <StepIndicator current={step}/>
                  {signupErr&&<div style={{background:"#FEF2F2",color:"#B91C1C",borderRadius:14,padding:"10px 14px",fontSize:13,marginBottom:16,lineHeight:1.5}}>{signupErr}</div>}
                  {signupBusy&&<div style={{background:BLUE_LIGHT,color:BLUE,borderRadius:14,padding:"10px 14px",fontSize:13,marginBottom:16}}>가입하는 중이에요…</div>}
                  {step===1&&<Step1 data={form} onChange={onChange} onNext={()=>setStep(2)} isAdmin={IS_ADMIN}/>}
                  {step===2&&<Step2 data={form} onChange={onChange} onNext={()=>setStep(3)} onBack={()=>setStep(1)} isAdmin={IS_ADMIN}/>}
                  {step===3&&<Step3 data={form} onChange={onChange} onSubmit={submitSignup} onBack={()=>setStep(2)} isAdmin={IS_ADMIN}/>}
                </>
              )
            )}
          </div>
          {!loading&&!pending&&screen==="signup"&&!signupDone&&(
            <p style={{textAlign:"center",fontSize:13,color:"#6B7493",marginTop:18}}>
              이미 계정이 있으신가요?{" "}
              <button type="button" onClick={()=>setScreen("login")} style={{background:"none",border:"none",color:BLUE,fontWeight:700,fontSize:13,cursor:"pointer",textDecoration:"underline",textUnderlineOffset:3}}>로그인</button>
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── 메인 앱 화면 ──
  const tabTitles={home:"SSTC",booking:"정모 예약",stats:"통계",admin:"관리"};
  const tabs=account&&account.admin?[...TABS,{key:"admin",label:"관리",icon:"user"}]:TABS;
  const isHome=tab==="home";
  const curMeeting=tab==="booking"&&openMeeting?MEETINGS.find(m=>m.id===openMeeting.id):null;
  const isAdminUser=!!(account&&account.admin)||!FB;
  // 모임 수정·삭제: 관리자 또는 만든 사람
  const canManage=m=>isAdminUser||(!!m.createdByUid&&FB&&FB.auth.currentUser&&FB.auth.currentUser.uid===m.createdByUid);
  const openCreate=()=>setForm2({initial:null});
  const myCount=myHeld(), yearCount=myCount.filter(m=>m.iso.slice(0,4)===todayYmd().slice(0,4)).length;
  return(
    <div style={{maxWidth:440,margin:"0 auto",minHeight:"100vh",background:"#F3F5FB",display:"flex",flexDirection:"column",fontFamily:FONT}}>
      <style>{GLOBAL_CSS}</style>
      {/* 파란 헤더 */}
      <div style={{background:GRAD,color:"#fff",borderRadius:"0 0 32px 32px",padding:`18px 20px ${isHome?56:26}px`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",width:200,height:200,borderRadius:"50%",border:"1.5px solid rgba(255,255,255,0.15)",top:-80,right:-60}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",position:"relative"}}>
          {curMeeting
            ?<button type="button" onClick={closeM} style={{...iconBtn,width:"auto",padding:"0 14px 0 8px",borderRadius:999,gap:2,fontSize:13,fontWeight:600}} aria-label="뒤로가기"><Icon name="back" size={20} stroke={2.4}/>{openMeeting.from==="home"?"홈":"목록"}</button>
            :<span style={{fontSize:14,fontWeight:600,opacity:0.9}}>🎾 SSTC</span>}
          <div style={{display:"flex",gap:8}}>
            <button type="button" style={iconBtn} title="알림"><Icon name="bell" size={19}/></button>
            <button type="button" onClick={logout} style={iconBtn} title="로그아웃" aria-label="로그아웃"><Icon name="user" size={19}/></button>
          </div>
        </div>
        {isHome?(
          <div style={{position:"relative",marginTop:18}}>
            <p style={{margin:"0 0 2px",fontSize:13,opacity:0.85}}>안녕하세요 👋</p>
            <p style={{margin:0,fontSize:26,fontWeight:700,letterSpacing:"-0.01em"}}>{ME} 님{account&&account.admin&&<span style={{fontSize:11,fontWeight:700,marginLeft:8,padding:"3px 9px",borderRadius:999,background:"rgba(255,255,255,0.22)",verticalAlign:"middle"}}>관리자</span>}</p>
          </div>
        ):(
          curMeeting?(
            <div style={{position:"relative",marginTop:18}}>
              <p style={{margin:"0 0 2px",fontSize:13,opacity:0.85}}>📍 {curMeeting.place}</p>
              <p style={{margin:0,fontSize:24,fontWeight:700,letterSpacing:"-0.01em"}}>{curMeeting.date}</p>
            </div>
          ):<p style={{position:"relative",margin:"18px 0 0",fontSize:26,fontWeight:700,letterSpacing:"-0.01em"}}>{tabTitles[tab]}</p>
        )}
      </div>
      {/* 홈: 헤더에 걸친 내 정보 카드 */}
      {isHome&&(
        <div style={{margin:"-38px 16px 0",position:"relative",zIndex:2}}>
          <Card style={{padding:"16px 8px",display:"flex"}}>
            {[{label:"NTRP",value:(account&&account.profile&&account.profile.ntrp)||MEMBER_NTRP[ME]||"-"},
              {label:"구력",value:account&&account.profile?(calcCareer(account.profile.tennisStart)||"-"):"-"},{label:"올해(누적)",value:`${yearCount}회 (${myCount.length}회)`}].map((s,i)=>(
              <div key={s.label} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",borderLeft:i>0?"1px solid #EEF1FA":"none"}}>
                <p style={{margin:"0 0 4px",fontSize:11,color:"#A3AAC2",letterSpacing:"0.04em"}}>{s.label}</p>
                <p style={{margin:0,fontSize:15,fontWeight:700,color:BLUE}}>{s.value}</p>
              </div>
            ))}
          </Card>
        </div>
      )}
      <div style={{flex:1,padding:"16px 16px 96px"}}>
        {list.error&&<Card style={{marginBottom:12}}><p style={{margin:0,fontSize:13,color:"#ef4444"}}>모임을 불러오지 못했어요. {list.error}</p></Card>}
        {tab==="home"&&<HomeTab onGoBooking={()=>{setOpenMeeting(null);setTab("booking");}} onOpenMeeting={(id,view)=>openM(id,view,"home")} onCreate={openCreate}/>}
        {tab==="booking"&&<BookingTab open={openMeeting} onOpen={(id,view)=>openM(id,view,"booking")} ready={list.ready}
          canManage={canManage} onEdit={m=>setForm2({initial:m})} onDeleted={()=>closeM()} onCreate={openCreate}/>}
        {tab==="stats"&&<StatsTab/>}
        {tab==="admin"&&FB&&account&&account.admin&&<AdminTab/>}
      </div>
      {/* 모임 만들기 버튼: 탭바 바로 위 오른쪽 (모임 상세 화면에서는 숨김) */}
      {!curMeeting&&(
        <button type="button" onClick={openCreate} aria-label="모임 만들기" title="모임 만들기"
          style={{position:"fixed",right:"max(16px, calc(50% - 204px))",bottom:"calc(86px + env(safe-area-inset-bottom,0px))",width:58,height:58,borderRadius:"50%",border:"none",background:GRAD,color:"#fff",boxShadow:"0 8px 20px rgba(40,70,180,0.35)",cursor:"pointer",zIndex:25,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      )}
      {mForm&&<MeetingForm initial={mForm.initial} onClose={()=>setForm2(null)} onSaved={id=>{const editing=!!mForm.initial;setForm2(null);if(!editing)openM(id,"info","booking");}}/>}
      {/* 파란 하단 탭바 */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:440,background:GRAD,borderRadius:"24px 24px 0 0",boxShadow:"0 -6px 24px rgba(40,70,180,0.18)",display:"flex",zIndex:20,paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
        {tabs.map(t=>{const on=tab===t.key;return(
          <button key={t.key} type="button" onClick={()=>{if(openMeeting){try{if(location.hash)history.replaceState(null,"",location.pathname+location.search);}catch(e){}setOpenMeeting(null);}setTab(t.key);}} style={{flex:1,padding:"12px 0 10px",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,color:"#fff",opacity:on?1:0.6}}>
            <Icon name={t.icon} size={22} stroke={on?2.2:1.8}/>
            <span style={{fontSize:11,fontWeight:on?700:500}}>{t.label}</span>
            <div style={{width:18,height:3,background:on?"#fff":"transparent",borderRadius:10}}/>
          </button>
        );})}
      </div>
    </div>
  );
}

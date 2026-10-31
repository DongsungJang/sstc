# SSTC

**Serve & Smash Tennis Club** 모임 앱이에요. 휴대폰 브라우저에서 바로 열려요.

**주소:** https://dongsungjang.github.io/sstc/

## 기능
- 로그인 · 회원가입 (3단계: 계정, 프로필(본명 필수), 운동 정보), 비밀번호 재설정 메일, 관리자 가입 승인
- 로그인 화면: 아이디 저장, 로그인 상태 유지(마지막으로 연 날부터 30일, `KEEP_DAYS`). 유지를 끄면 브라우저를 닫을 때 로그아웃
- 오른쪽 위 사람 아이콘: 내 정보 보기(참석 횟수, 다가오는 모임 내 투표, 프로필, 정보 수정하기), 로그아웃
- 종 버튼 알림: 새 회원 가입, 새 모임, 새 공지, 내 가입 승인. 안 읽은 개수를 보여 주고, 누르면 그 모임·공지로 가요(`club/feed`, `club/inbox/<uid>`, 읽은 시각은 `members/<uid>/notiSeenAt`)
- 공지사항: 관리자가 홈의 "+ 공지 쓰기"로 올리고 지울 수 있어요(`club/notices`)
- 홈: 다가오는 모임, 마지막 참석 모임 결과, 참여 랭킹, 공지
- 모임 만들기: 모든 탭 오른쪽 아래 + 버튼으로 날짜·시간·장소·정원·예약 오픈·설명을 넣어 모임을 만들어요. 만든 사람과 관리자는 수정·삭제할 수 있어요.
- 정모 예약: 예약 오픈 시각부터 참석 투표와 게스트 초대, 우선순위 규칙에 따른 참석 확정·대기
- 대진표: 시작·종료 시간, 게임당 시간, 코트 수를 정하면 실력 균형에 맞춰 자동 편성
- 스코어: 6점 선승, 5:5는 무승부(가위바위보 승자 선택 가능), 개인 성적 집계
- 통계: 누적·올해·연속 참석, 최근 6개월 월별 참석, 전체 랭킹 (모두 실제 기록으로 계산)

### 참석 우선순위
- 정기 모임: 이 모임 전까지 그 달 정기 모임에 덜 참석한 회원이 항상 먼저이고, 같은 횟수면 투표가 빠른 순이에요. 번개 모임 참석은 세지 않아요.
- 번개 모임: 회원은 선착순이에요.
- 게스트: 회원 정원과 별도로 "정원 외 게스트" 인원까지 선착순. 회원 자리가 남으면 남은 게스트가 그 자리도 써요.

### 반복 모임
정기 모임을 매주 또는 격주로 반복할 수 있어요. 예약 오픈은 "모임 전 ○요일 시:분"으로 정해요(예: 토요일 모임, 전 일요일 21:00).
반복 설정은 `club/meetings/series/s<id>`에 저장되고, 앱을 연 승인 회원·관리자 기기가 다가오는 3회분을 `m<series id + 회차>`로 미리 만들어요.
한 회차를 지우면 그 날짜는 다시 만들지 않고, 모임 화면의 "반복 멈추기"로 반복을 끝낼 수 있어요. 규칙은 바꿀 필요 없어요.
참석 횟수는 달마다 새로 세요. "2회 초과"는 그 달에 이미 2번 참석 확정된 회원(이번이 3번째 이상)이에요.
기준 숫자는 `src/app.jsx`의 `MONTHLY_PRIORITY_LIMIT`로 바꿀 수 있어요.

## 스플래시·아이콘
- 앱을 열면 스플래시 화면(`SplashScreen`, 애니메이션 CSS는 `src/splash.css`)이 먼저 뜨고, "시작하기"를 누르면 로그인 화면으로 가요. 390×844 원본을 화면 크기에 맞춰 비율 그대로 키우거나 줄여요.
- 폰트는 `fonts/`의 Fredoka, Jua를 써요. Jua는 "시작하기" 글자만 남긴 작은 파일이라, 다른 한글에 쓰려면 원본 Jua.ttf로 바꿔 주세요.
- 아이콘은 `icons/`(favicon 32, apple-touch-icon 180, 홈 화면용 192·512)이고 `manifest.webmanifest`에 들어 있어요.

## 저장 (Firebase Realtime Database)
모임은 `firebase-config.js`의 프로젝트에 `club/meetings/m<모임 id>` 아래 이렇게 저장돼요.
- `info`: 날짜, 시작·종료 시간, 장소, 정원, 예약 오픈 시각, 설명, 만든 사람
- `votes/<회원 uid>`: 그 회원의 참석 투표(참석·미정·불참, 투표 시각, 게스트)
- `bracket`, `scores`: 대진표와 게임 점수

회원마다 자기 투표 칸에만 써서 여러 명이 동시에 투표해도 서로 덮어쓰지 않아요.
파이어베이스 설정이 없으면 같은 모양으로 그 기기(브라우저)에만 저장돼요.

## 회원 계정 (Firebase Authentication)
- 회원가입하면 파이어베이스 계정이 만들어지고 프로필이 `club/members/<uid>`에, 닉네임이 `club/nicknames`에 저장돼요.
- 가입하려면 가입 코드(`src/app.jsx`의 `JOIN_CODE`, 지금은 SSTC2027)를 맞게 넣어야 해요.
- 가입한 사람은 관리자가 승인해야(`club/approved/<uid>`) 예약·대진표를 쓸 수 있어요.
- 관리자는 `club/admins/<uid>: true`로 정해요. 앱에서는 못 바꾸고, 파이어베이스 콘솔에서 직접 넣어요.
  1. 앱에서 회원가입을 해요.
  2. 콘솔 → Authentication → 사용자 목록에서 내 **사용자 UID**를 복사해요.
  3. 콘솔 → Realtime Database → 데이터 → `club` 아래에 `admins`를 만들고, 키는 그 UID, 값은 `true`로 넣어요.
- 관리자에게는 하단에 **관리** 탭이 생겨서 가입 승인, 승인 취소, 회원 정보를 볼 수 있어요.
- 콘솔 → Authentication → 로그인 방법에서 **이메일/비밀번호**가 켜져 있어야 해요.

## 파이어베이스 규칙
콘솔 → Realtime Database → 규칙에 아래를 붙여넣고 게시해요. (스코어보드의 `results` 규칙도 같이 들어 있어요.)

```json
{
  "rules": {
    "results": {
      ".read": true,
      ".write": true,
      "$g": {
        ".validate": "newData.hasChildren(['b','w']) && newData.child('b').isNumber() && newData.child('w').isNumber() && newData.child('b').val()>=0 && newData.child('b').val()<=6 && newData.child('w').val()>=0 && newData.child('w').val()<=6"
      }
    },
    "club": {
      ".read": "auth != null",
      "members": {
        "$uid": { ".write": "auth != null && (auth.uid === $uid || root.child('club/admins/' + auth.uid).exists())" }
      },
      "nicknames": {
        ".read": true,
        "$nick": { ".write": "auth != null && (!data.exists() || data.val() === auth.uid)" }
      },
      "approved": {
        "$uid": { ".write": "auth != null && root.child('club/admins/' + auth.uid).exists()" }
      },
      "admins": { ".write": false },
      "feed": {
        "$id": { ".write": "auth != null && !data.exists()" }
      },
      "inbox": {
        "$uid": { ".write": "auth != null && root.child('club/admins/' + auth.uid).exists()" }
      },
      "notices": {
        ".write": "auth != null && root.child('club/admins/' + auth.uid).exists()"
      },
      "meetings": {
        ".write": "auth != null && (root.child('club/approved/' + auth.uid).exists() || root.child('club/admins/' + auth.uid).exists())"
      }
    }
  }
}
```

- 로그인한 사람만 읽을 수 있어요. 닉네임 목록은 가입 전 중복 확인 때문에 누구나 읽을 수 있어요.
- 자기 프로필은 본인과 관리자만, 승인은 관리자만, 모임 기록(투표·대진·점수)은 승인된 회원과 관리자만 써요.
- 관리자 목록은 앱에서 아무도 못 바꿔요(콘솔에서만).
- 알림(`feed`)은 로그인한 사람이 새로 쓰기만 하고 고치거나 지울 수 없어요. 개인 알림(`inbox`)과 공지(`notices`)는 관리자만 써요.

## 고치는 법
앱 코드는 `src/app.jsx` 한 파일이에요. 고친 뒤 아래 명령으로 `index.html`을 다시 만들어요.

```bash
npm install
npm run build
```

대진 편성 엔진은 [tennis-tournament](https://github.com/DongsungJang/tennis-tournament)의 엔진을 가져와 코트 수와 게임당 시간을 설정할 수 있게 바꾼 거예요.

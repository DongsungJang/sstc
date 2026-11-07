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

### 관리 탭
- 준회원(가입 후 승인 전), 정회원(승인됨, `club/approved/<uid>`), 탈퇴(`members/<uid>/withdrawn`, 로그인하면 바로 로그아웃). 탈퇴 회원은 "되돌리기"로 준회원으로 복구할 수 있어요. 계정 자체 삭제는 파이어베이스 콘솔 Authentication에서 해요.
- 마지막 접속: 회원마다 "3시간 전 접속"처럼 보여 주고, 이름을 누르면 정확한 날짜·시각이 나와요. 정회원 목록은 "최근 접속순"으로 바꿔 볼 수 있어요. 이 기능이 생기기 전 기록은 없어서, 업데이트 뒤 앱을 아직 안 연 회원은 "접속 기록 없음"으로 보여요(`club/lastSeen/<uid>`).
- 접속 팝업: 관리자가 제목·내용·기간을 써 두면 정회원이 앱을 열었을 때 화면 가운데 창으로 떠요(`club/popups/<id>`). 띄우는 방식은 **한 번만**(회원마다 처음 한 번), **하루 한 번**(기간 동안 매일 한 번), **열 때마다**(앱을 열 때마다, 회원이 "오늘은 그만 보기"로 그날은 끌 수 있음) 중에 골라요. 여러 개면 차례로 떠요. 몇 명이 확인했는지 보여 주고, "본 회원에게도 다시 띄우기"로 이미 본 사람에게 한 번 더 띄울 수 있어요. 본 기록은 `club/popupSeen/<uid>/<id>`에 남아요.
- (예전 "알림 보내기"는 없앴어요. 가입 승인·참석·댓글·@부르기 같은 자동 알림은 그대로예요.)

### 새 항목 표시 (+숫자 · NEW)
- 하단 탭에 그 탭을 마지막으로 연 뒤 새로 올라온 개수를 `+n`으로 보여 줘요. 예약은 새 모임, 회원은 새 정회원과 소곤소곤 새 글, 관리(관리자만)는 새 가입 신청이에요. 탭을 열면 사라져요.
- 목록의 항목에는 직접 열어 볼 때까지(최대 14일) NEW가 붙어요. 내가 만든 모임·글은 빼요.
- 확인 기록은 기기마다 저장돼요(`localStorage`의 `sstc-seen-<uid>`). 그래서 폰과 PC는 따로 세요. 새 정회원은 승인 시각(`members/<uid>/approvedAt`, 승인할 때 같이 저장)을 기준으로 해요.

### 새 버전 안내
- `npm run build` 할 때마다 소스·아이콘 내용으로 만든 버전 값(BUILD_ID)이 `index.html`과 `version.json`에 같이 들어가요.
- 앱을 열 때와 다시 화면으로 돌아올 때(1분에 한 번까지) `version.json`을 확인해서, 지금 열린 것과 다르면 위쪽에 "새 버전이 있어요 · 업데이트" 안내를 띄워요. 업데이트를 누르면 새로 받아서 다시 열어요.

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
  - 테니스장을 카카오 장소 검색으로 고르면 `address`와 좌표 `lat`, `lng`도 같이 저장돼요. 예약 탭 **지도**에 핀으로 나와요.
- `votes/<회원 uid>`: 그 회원의 참석 투표(참석·미정·불참, 투표 시각, 게스트)
- `bracket`, `scores`: 대진표와 게임 점수

소곤소곤 글은 `club/board/<글 id>` 아래 `{uid, name, text, at, editedAt, anon, mentions, likes/<uid>, comments/<댓글 id>}`로 저장돼요. 익명이면 `anon: true`, `name: "익명"`이에요.

회원마다 자기 투표 칸에만 써서 여러 명이 동시에 투표해도 서로 덮어쓰지 않아요.
파이어베이스 설정이 없으면 같은 모양으로 그 기기(브라우저)에만 저장돼요.

## 코트 지도 (카카오맵)
- 예약 탭 위쪽 **목록 / 지도** 전환. 지도에는 앞으로 열릴 모임(지난 모임·무산 모임 제외)이 있는 코트만 핀으로 나와요.
- 카카오 JavaScript 키는 `src/app.jsx`의 `KAKAO_JS_KEY`예요(웹 공개용 키). 카카오 개발자 콘솔에서 웹 도메인 `https://dongsungjang.github.io` 등록과 카카오맵 사용 설정이 돼 있어야 해요.
- 좌표가 없는 예전 모임은 코트 이름(안 되면 주소)으로 찾아서 그 기기에 저장해 둬요(`localStorage`의 `sstc-geo`). 못 찾은 모임은 지도 아래 "위치를 찾지 못한 모임"에 나와요.
- 파이어베이스 규칙은 바꿀 필요 없어요.

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
      "members": {
        ".read": "auth != null",
        "$uid": { ".write": "auth != null && (auth.uid === $uid || root.child('club/admins/' + auth.uid).exists())" }
      },
      "nicknames": {
        ".read": true,
        "$nick": { ".write": "auth != null && (!data.exists() || data.val() === auth.uid)" }
      },
      "approved": {
        ".read": "auth != null",
        "$uid": { ".write": "auth != null && root.child('club/admins/' + auth.uid).exists()" }
      },
      "admins": { ".read": "auth != null", ".write": false },
      "feed": {
        ".read": "auth != null",
        "$id": { ".write": "auth != null && !data.exists()" }
      },
      "inbox": {
        ".read": "auth != null",
        "$uid": { ".write": "auth != null && root.child('club/admins/' + auth.uid).exists()" }
      },
      "notices": {
        ".read": "auth != null",
        ".write": "auth != null && root.child('club/admins/' + auth.uid).exists()"
      },
      "popups": {
        ".read": "auth != null",
        ".write": "auth != null && root.child('club/admins/' + auth.uid).exists()"
      },
      "popupSeen": {
        ".read": "auth != null && root.child('club/admins/' + auth.uid).exists()",
        "$uid": {
          ".read": "auth != null && auth.uid === $uid",
          ".write": "auth != null && auth.uid === $uid"
        }
      },
      "ads": {
        ".read": "auth != null",
        ".write": "auth != null && root.child('club/admins/' + auth.uid).exists()"
      },
      "adStats": {
        ".read": "auth != null && root.child('club/admins/' + auth.uid).exists()",
        ".write": "auth != null && root.child('club/admins/' + auth.uid).exists()",
        "$ad": {
          "$day": {
            "$kind": {
              "$uid": {
                ".write": "auth != null && auth.uid === $uid && ($kind === 'views' || $kind === 'clicks')",
                ".validate": "newData.val() === true"
              }
            }
          }
        }
      },
      "meetings": {
        ".read": "auth != null",
        ".write": "auth != null && (root.child('club/approved/' + auth.uid).exists() || root.child('club/admins/' + auth.uid).exists())"
      },
      "board": {
        ".read": "auth != null && (root.child('club/approved/' + auth.uid).exists() || root.child('club/admins/' + auth.uid).exists())",
        "$pid": {
          ".write": "auth != null && ((root.child('club/admins/' + auth.uid).exists() && !newData.exists()) || ((root.child('club/approved/' + auth.uid).exists() || root.child('club/admins/' + auth.uid).exists()) && (!data.exists() || data.child('uid').val() === auth.uid) && (!newData.exists() || newData.child('uid').val() === auth.uid)))",
          ".validate": "newData.hasChildren(['uid', 'name', 'text', 'at']) && newData.child('text').isString() && newData.child('text').val().length <= 1000",
          "comments": {
            "$cid": {
              ".write": "auth != null && ((root.child('club/admins/' + auth.uid).exists() && !newData.exists()) || ((root.child('club/approved/' + auth.uid).exists() || root.child('club/admins/' + auth.uid).exists()) && (!data.exists() || data.child('uid').val() === auth.uid) && (!newData.exists() || newData.child('uid').val() === auth.uid)))"
            }
          },
          "likes": {
            "$uid": {
              ".write": "auth != null && auth.uid === $uid && (root.child('club/approved/' + auth.uid).exists() || root.child('club/admins/' + auth.uid).exists())"
            }
          }
        }
      },
      "vip": {
        ".read": "auth != null",
        "$uid": { ".write": "auth != null && root.child('club/admins/' + auth.uid).exists()", ".validate": "newData.val() === true" }
      },
      "guilds": {
        ".read": "auth != null",
        "$gid": {
          ".write": "auth != null && (root.child('club/admins/' + auth.uid).exists() || (data.exists() && data.child('leader').val() === auth.uid) || (!data.exists() && root.child('club/vip/' + auth.uid).exists() && newData.child('leader').val() === auth.uid && newData.child('members/' + auth.uid).val() === true))",
          ".validate": "newData.hasChildren(['name', 'leader']) && newData.child('name').isString() && newData.child('name').val().length >= 1 && newData.child('name').val().length <= 6",
          "photo": { ".validate": "newData.isString() && newData.val().length <= 40000" },
          "intro": { ".validate": "newData.isString() && newData.val().length <= 40" },
          "members": {
            "$uid": {
              ".write": "auth != null && auth.uid === $uid && (!newData.exists() || data.parent().parent().child('invites/' + $uid).exists())",
              ".validate": "newData.val() === true"
            }
          },
          "invites": {
            "$uid": { ".write": "auth != null && auth.uid === $uid && !newData.exists()" }
          }
        }
      },
      "lastSeen": {
        ".read": "auth != null && root.child('club/admins/' + auth.uid).exists()",
        "$uid": {
          ".write": "auth != null && auth.uid === $uid",
          ".validate": "newData.isNumber() && newData.val() <= now + 60000"
        }
      },
      "$other": { ".read": "auth != null" }
    }
  }
}
```

- 로그인한 사람만 읽을 수 있어요. (소곤소곤만 정회원·관리자 전용이라 `club` 전체가 아니라 칸마다 읽기 규칙을 따로 둬요. 위에서 읽기를 허락하면 아래에서 막을 수 없는 파이어베이스 규칙 특성 때문이에요.) 닉네임 목록은 가입 전 중복 확인 때문에 누구나 읽을 수 있어요.
- 자기 프로필은 본인과 관리자만, 승인은 관리자만, 모임 기록(투표·대진·점수)은 승인된 회원과 관리자만 써요.
- 관리자 목록은 앱에서 아무도 못 바꿔요(콘솔에서만).
- 알림(`feed`)은 로그인한 사람이 새로 쓰기만 하고 고치거나 지울 수 없어요. 개인 알림(`inbox`)과 공지(`notices`)는 관리자만 써요.
- 접속 팝업(`popups/<id>`)은 관리자만 쓰고 로그인한 사람이 읽어요. 본 기록(`popupSeen/<uid>`)은 본인만 읽고 쓰고, 관리자는 몇 명이 봤는지 세려고 읽어요.
- 광고 배너(`ads/<id>`)는 관리자만 쓰고, 로그인한 사람이 읽어요. 관리 탭에서 광고1·광고2… 로 여러 개 넣을 수 있고, 켜져 있고(`enabled: true`) 기간(`start`~`end`, 비우면 무제한) 안인 것만 홈에 보여요.
- 광고 노출·클릭(`adStats/<광고>/<날짜>/views|clicks/<uid>`)은 회원이 자기 칸에 `true`만 써요. 같은 회원·같은 날은 한 번으로 세요. 읽기와 지우기는 관리자만 해요.
- 마지막 접속(`lastSeen/<uid>`)은 앱을 열 때와 쓰는 동안 10분에 한 번까지 본인 칸에만 시각을 써요. 읽기는 관리자만 할 수 있어서 관리 탭 회원 목록에서만 보여요.
- 우수회원(`vip/<uid>`)은 관리자만 지정·해제해요. 정회원 위 등급이고, 우수회원만 길드를 만들 수 있어요.
- 길드(`guilds/<gid>`)는 로그인한 사람이 읽어요. 우수회원이 자기를 길드장·길드원으로 넣어서 새로 만들 수 있고, 그다음부터는 길드장과 관리자만 고치거나(엠블럼·이름·초대·내보내기·길드장 넘기기) 없앨 수 있어요. 회원은 받은 초대가 있을 때만 자기 칸(`members/<uid>`)에 들어가고, 언제든 나가거나 초대를 거절할 수 있어요. 길드 이름은 6자까지, 엠블럼 사진은 작게 줄여 저장해요.
- 길드 모임은 모임 정보(`info.guildId`)에 길드가 적혀 있고, 앱이 그 길드원·만든 사람·관리자에게만 보여 줘요. 모임 기록 전체를 읽는 규칙(`meetings`)은 그대로라서, 데이터베이스를 직접 들여다보면 볼 수 있어요.
- 소곤소곤(`board`, 회원 탭 게시판)은 정회원과 관리자만 읽고 글·댓글·좋아요를 써요. 익명 글·댓글도 실제 uid는 저장돼요(본인 수정·삭제용). 앱 화면에는 안 보이지만 데이터베이스를 직접 들여다보면 알 수 있어요. 글과 댓글은 쓴 사람만 고치고 지울 수 있고, 관리자는 남의 글·댓글을 지울 수만 있어요. 좋아요는 자기 칸(`likes/<uid>`)에만 눌러요. 글은 1000자까지예요.

## 고치는 법
앱 코드는 `src/app.jsx` 한 파일이에요. 고친 뒤 아래 명령으로 `index.html`을 다시 만들어요.

```bash
npm install
npm run build
```

대진 편성 엔진은 [tennis-tournament](https://github.com/DongsungJang/tennis-tournament)의 엔진을 가져와 코트 수와 게임당 시간을 설정할 수 있게 바꾼 거예요.

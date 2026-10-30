# SSTC

**Serve & Smash Tennis Club** 모임 앱이에요. 휴대폰 브라우저에서 바로 열려요.

**주소:** https://dongsungjang.github.io/sstc/

## 기능
- 로그인 · 회원가입 (3단계: 계정, 프로필, 운동 정보), 비밀번호 재설정 메일, 관리자 가입 승인
- 홈: 다가오는 모임, 마지막 참석 모임 결과, 참여 랭킹, 공지
- 정모 예약: 참석 투표와 게스트 초대, 우선순위 규칙에 따른 참석 확정·대기
- 대진표: 시작·종료 시간, 게임당 시간, 코트 수를 정하면 실력 균형에 맞춰 자동 편성
- 스코어: 6점 선승, 5:5는 무승부(가위바위보 승자 선택 가능), 개인 성적 집계
- 통계: 월별 참석, 전체 랭킹

### 참석 우선순위
게스트 → 이달 참석 2회 이하 회원 → 2회 초과 회원 순서이고, 같은 그룹 안에서는 투표가 빠른 순이에요.
참석 횟수는 달마다 새로 세요. "2회 초과"는 그 달에 이미 2번 참석 확정된 회원(이번이 3번째 이상)이에요.
기준 숫자는 `src/app.jsx`의 `MONTHLY_PRIORITY_LIMIT`로 바꿀 수 있어요.

## 저장 (Firebase Realtime Database)
참석 투표, 대진표, 점수는 `firebase-config.js`의 프로젝트에 `club/meetings/m<모임 id>` 경로로 저장돼요.
설정값이 없거나 연결이 안 되면 그 기기(브라우저)에만 저장돼요.

## 회원 계정 (Firebase Authentication)
- 회원가입하면 파이어베이스 계정이 만들어지고 프로필이 `club/members/<uid>`에, 닉네임이 `club/nicknames`에 저장돼요.
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

## 고치는 법
앱 코드는 `src/app.jsx` 한 파일이에요. 고친 뒤 아래 명령으로 `index.html`을 다시 만들어요.

```bash
npm install
npm run build
```

대진 편성 엔진은 [tennis-tournament](https://github.com/DongsungJang/tennis-tournament)의 엔진을 가져와 코트 수와 게임당 시간을 설정할 수 있게 바꾼 거예요.

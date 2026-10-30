# SSTC

**Serve & Smash Tennis Club** 모임 앱이에요. 휴대폰 브라우저에서 바로 열려요.

**주소:** https://dongsungjang.github.io/sstc/

## 기능
- 로그인 · 회원가입 (3단계: 계정, 프로필, 운동 정보)
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

파이어베이스 콘솔 → Realtime Database → 규칙에서 `club` 경로를 열어 주세요.
기존 규칙(예: 스코어보드의 `results`)은 지우지 말고 `club` 블록만 더하면 돼요.

```json
{
  "rules": {
    "club": {
      ".read": true,
      ".write": true
    }
  }
}
```

지금 로그인은 화면만 있는 상태라서, 위 규칙이면 주소를 아는 사람은 누구나 쓸 수 있어요.
실제 회원 로그인(Firebase Authentication)을 붙이면 `".write": "auth != null"`처럼 좁힐 수 있어요.

## 고치는 법
앱 코드는 `src/app.jsx` 한 파일이에요. 고친 뒤 아래 명령으로 `index.html`을 다시 만들어요.

```bash
npm install
npm run build
```

대진 편성 엔진은 [tennis-tournament](https://github.com/DongsungJang/tennis-tournament)의 엔진을 가져와 코트 수와 게임당 시간을 설정할 수 있게 바꾼 거예요.

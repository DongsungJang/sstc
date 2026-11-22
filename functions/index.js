// SSTC 푸시 알림 보내기 — 새 모임 · 참석 · 불참 세 가지만.
// 앱이 club/pushQueue/<id>에 {kind, to, meetingId, body, byUid}를 쓰면, 받는 사람 기기(club/pushTokens/<uid>)로 보내고 그 줄을 지워요.
//   kind: "meeting"(새 모임) | "attend"(참석) | "absent"(불참)
//   to:   "all"(정회원 전체) 또는 {uid: true}. 쓴 사람, 탈퇴 회원, 승인 안 된 회원은 빼요.
// 배포는 GitHub Actions(.github/workflows/deploy-functions.yml)가 main에 올라오면 해요.
const { onValueCreated } = require("firebase-functions/v2/database");
const logger = require("firebase-functions/logger");
const { initializeApp } = require("firebase-admin/app");
const { getDatabase } = require("firebase-admin/database");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();

const BASE = "https://dongsungjang.github.io/sstc/";
const TITLE = { meeting: "새 모임", attend: "참석", absent: "불참" };
const BAD_TOKEN = ["messaging/registration-token-not-registered", "messaging/invalid-registration-token", "messaging/invalid-argument"];

// 받는 사람 uid 목록 → [{uid, key, token}] (같은 기기가 여러 계정에 남아 있으면 가장 최근에 켠 계정 것만)
function pickTargets(q, { approved, admins, members, tokens }) {
  const active = u => !!(approved[u] || admins[u]) && !(members[u] && members[u].withdrawn);
  if (!TITLE[q.kind] || !q.byUid || !q.body || !active(q.byUid)) return [];
  const want = new Set((q.to === "all" ? Object.keys({ ...approved, ...admins }) : Object.keys(q.to || {}))
    .filter(u => u !== q.byUid && active(u)));
  const owner = {};
  Object.entries(tokens).forEach(([uid, list]) => Object.entries(list || {}).forEach(([key, v]) => {
    if (!v || typeof v.token !== "string") return;
    const o = owner[v.token];
    if (!o || (v.at || 0) > o.at) owner[v.token] = { uid, key, token: v.token, at: v.at || 0 };
  }));
  return Object.values(owner).filter(o => want.has(o.uid));
}

function buildMessage(q) {
  const id = String(q.meetingId || "");
  const link = BASE + (/^\d+$/.test(id) ? "#meeting-" + id : "");
  const title = "SSTC · " + TITLE[q.kind];
  const body = String(q.body).slice(0, 140);
  return {
    webpush: {
      notification: { title, body, icon: BASE + "icons/icon-192.png", badge: BASE + "icons/icon-192.png" },
      fcmOptions: { link },
    },
    data: { kind: q.kind, link },
  };
}

exports.sendPush = onValueCreated(
  { ref: "/club/pushQueue/{id}", instance: "tennis-score-board-93960-default-rtdb", region: "asia-southeast1" },
  async event => {
    const q = event.data.val() || {};
    const db = getDatabase();
    try {
      const [approved, admins, members, tokens] = await Promise.all(
        ["club/approved", "club/admins", "club/members", "club/pushTokens"].map(p => db.ref(p).get().then(s => s.val() || {})));
      const targets = pickTargets(q, { approved, admins, members, tokens });
      if (!targets.length) return;
      const msg = buildMessage(q);
      const drop = {};
      for (let i = 0; i < targets.length; i += 500) {
        const part = targets.slice(i, i + 500);
        const res = await getMessaging().sendEachForMulticast({ ...msg, tokens: part.map(t => t.token) });
        res.responses.forEach((r, j) => {
          if (!r.success && r.error && BAD_TOKEN.includes(r.error.code)) drop[`club/pushTokens/${part[j].uid}/${part[j].key}`] = null;
        });
        logger.info("push", { kind: q.kind, sent: res.successCount, failed: res.failureCount });
      }
      if (Object.keys(drop).length) await db.ref().update(drop);
    } catch (e) {
      logger.error("push failed", e);
    } finally {
      await event.data.ref.remove().catch(() => {});
    }
  });

exports._test = { pickTargets, buildMessage };

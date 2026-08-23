/**
 * @file audit.ts
 * @description 보안 이벤트 감사 로그 유틸 (개인정보 비기록)
 * @author Jungho
 * @since 2026-08-23
 */

import crypto from "node:crypto";
import { loadEnv } from "@assets/scripts/env";
loadEnv();

// 1. 주체 익명화 키 -------------------------------------------------------------------------------
// - user_id 는 이메일이라 원문은 물론 단순 해시도 사전 대조로 복원되므로 키 있는 HMAC 만 사용함
// - 키를 지정하지 않으면 프로세스 재시작마다 값이 바뀌어 장기 상관분석은 포기하고 기밀성만 지킴
const subjectKey: string = String(process.env.AUDIT_SUBJECT_KEY ?? ``).trim()
  || crypto.randomBytes(32).toString(`hex`);

// 2. 주체 지시자 ----------------------------------------------------------------------------------
// - 동일 계정 여부만 판별 가능한 고정 길이 지시자로 치환함
export const auditSubject = (user_id_param: unknown): string => {
  const subject: string = String(user_id_param ?? ``).trim();

  if (subject === ``) {
    return `anonymous`;
  }

  return crypto.createHmac(`sha256`, subjectKey).update(subject).digest(`hex`).slice(0, 16);
};

// 3. 감사 이벤트 기록 -----------------------------------------------------------------------------
// - 한 줄 JSON 으로 남겨 수집기가 추가 파싱 규칙 없이 그대로 적재할 수 있게 함
// - 이메일·비밀번호·토큰·요청 본문은 어떤 경우에도 담지 않음
export const auditLog = (
  event_param: string,
  outcome_param: string,
  detail_param: Record<string, string | number | boolean> = {},
): void => {
  console.log(JSON.stringify({
    kind: `audit`,
    ts: new Date().toISOString(),
    event: event_param,
    outcome: outcome_param,
    ...detail_param,
  }));
};

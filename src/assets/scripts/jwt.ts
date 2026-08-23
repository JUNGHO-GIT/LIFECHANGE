/**
 * @file jwt.ts
 * @description HS256 서명 액세스 토큰 발급·검증 (node:crypto 기반, 외부 JWT 의존성 없음)
 * @author Jungho
 * @since 2026-08-22
 */

import crypto from "node:crypto";
import { loadEnv } from "@assets/scripts/env";
loadEnv();

// 0. types ----------------------------------------------------------------------------------------
declare interface TokenPayload {
  sub: string;
  tv: string;
  iat: number;
  exp: number;
}

// 1. base64url 세그먼트 인코딩·디코딩 -------------------------------------------------------------
const encodeSeg = (value: string): string => Buffer.from(value, `utf8`).toString(`base64url`);
const decodeSeg = (value: string): string => Buffer.from(value, `base64url`).toString(`utf8`);

// 2. 서명 계산 ------------------------------------------------------------------------------------
// - 알고리즘을 HS256 으로 고정해 헤더 조작(alg=none 등) 경로를 원천 차단함
// - 비밀키 부재 시 예외로 실패시켜 무서명 토큰 발급을 막음
const signBody = (data: string): string => {
  const secret: string = String(process.env.JWT_SECRET ?? ``).trim();
  if (secret === ``) {
    throw new Error(`JWT_SECRET 미설정`);
  }
  return crypto.createHmac(`sha256`, secret).update(data).digest(`base64url`);
};

// 3. 토큼 발급 ------------------------------------------------------------------------------------
// - tv 는 계정의 현재 토큼 세대로, 검증 시 저장된 값과 대조해 서버 주도 폐기를 가능하게 함
export const createToken = (
  subject_param: string,
  version_param: string,
): string => {
  const ttlSec: number = Number(process.env.JWT_TTL_SEC ?? 60 * 60 * 24 * 30);
  const issuedAt: number = Math.floor(Date.now() / 1000);
  const header: string = encodeSeg(JSON.stringify({ alg: `HS256`, typ: `JWT` }));
  const payload: string = encodeSeg(JSON.stringify({
    sub: subject_param,
    tv: String(version_param ?? ``),
    iat: issuedAt,
    exp: issuedAt + (Number.isFinite(ttlSec) && ttlSec > 0 ? ttlSec : 60 * 60 * 24 * 30),
  }));
  const body: string = `${header}.${payload}`;

  return `${body}.${signBody(body)}`;
};

// 4. 토큰 검증 ------------------------------------------------------------------------------------
// - 형식 오류·서명 불일치·만료를 모두 null 로 수렴시켜 호출부에서 401 로 처리함
export const readToken = (token_param: string): TokenPayload | null => {
  const parts: string[] = String(token_param ?? ``).split(`.`);
  if (parts.length !== 3) {
    return null;
  }

  // 서명 대조 (길이 확인 후 timing-safe 비교)
  const body: string = `${parts[0]}.${parts[1]}`;
  let expected: string = ``;
  try {
    expected = signBody(body);
  }
  catch {
    return null;
  }
  const actualBuf: Buffer = Buffer.from(String(parts[2]), `utf8`);
  const expectedBuf: Buffer = Buffer.from(expected, `utf8`);
  if (actualBuf.length !== expectedBuf.length) {
    return null;
  }
  if (!crypto.timingSafeEqual(actualBuf, expectedBuf)) {
    return null;
  }

  // 페이로드 파싱 및 만료 확인
  try {
    const parsed: unknown = JSON.parse(decodeSeg(String(parts[1])));
    if (parsed === null || typeof parsed !== `object`) {
      return null;
    }
    const record: Record<string, unknown> = parsed as Record<string, unknown>;
    const sub: string = String(record.sub ?? ``).trim();
    const tv: string = String(record.tv ?? ``).trim();
    const exp: number = Number(record.exp ?? 0);
    const iat: number = Number(record.iat ?? 0);
    if (sub === `` || tv === `` || !Number.isFinite(exp) || exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }
    return {
      sub: sub,
      tv: tv,
      iat: iat,
      exp: exp,
    };
  }
  catch {
    return null;
  }
};

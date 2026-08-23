/**
 * @file token.test.ts
 * @description 액세스 토큰 발급·검증 회귀 테스트
 *              왕복 검증, 서명 위조 거부, 만료 거부, 형식 오류 거부, alg 조작 거부,
 *              토큰 세대(tv) 클레임 필수화를 DB 없이 헤르메틱하게 검증.
 * @author Jungho
 * @since 2026-08-22
 */

import { describe, expect, test } from "bun:test";
import crypto from "node:crypto";
import { createToken, readToken } from "@assets/scripts/token";

// 0. 테스트 보조 ------------------------------------------------------------------------------------
const TV: string = `tokenGeneration1`;
const encodeSeg = (value: string): string => Buffer.from(value, `utf8`).toString(`base64url`);

// 임의 페이로드에 정상 서명을 붙여 토큰을 조립 (만료·클레임 경계 검증용)
const forgeSigned = (payload: Record<string, unknown>): string => {
  const secret: string = String(process.env.JWT_SECRET ?? ``);
  const header: string = encodeSeg(JSON.stringify({ alg: `HS256`, typ: `JWT` }));
  const body: string = `${header}.${encodeSeg(JSON.stringify(payload))}`;
  const signature: string = crypto.createHmac(`sha256`, secret).update(body).digest(`base64url`);

  return `${body}.${signature}`;
};

// 1. 왕복 검증 --------------------------------------------------------------------------------------
describe(`createToken / readToken 왕복`, () => {
  // 1-1. 발급한 토큰은 동일 주체와 세대로 복원됨
  test(`발급 토큰은 주체·세대·만료를 그대로 복원한다`, () => {
    const token: string = createToken(`user@example.com`, TV);
    const payload = readToken(token);

    expect(payload).not.toBeNull();
    expect(payload?.sub).toBe(`user@example.com`);
    expect(payload?.tv).toBe(TV);
    expect(payload?.exp).toBeGreaterThan(payload?.iat ?? 0);
  });

  // 1-2. 매 발급은 서명 가능한 3세그먼트 형식
  test(`토큰은 3개 세그먼트 형식이다`, () => {
    expect(createToken(`a@b.c`, TV).split(`.`).length).toBe(3);
  });
});

// 2. 거부 경로 --------------------------------------------------------------------------------------
describe(`readToken 거부 조건`, () => {
  // 2-1. 서명 1글자 변조도 거부
  test(`서명 변조 토큰은 거부한다`, () => {
    const token: string = createToken(`user@example.com`, TV);
    const parts: string[] = token.split(`.`);
    const tampered: string = `${parts[0]}.${parts[1]}.${parts[2]}x`;

    expect(readToken(tampered)).toBeNull();
  });

  // 2-2. 페이로드 변조 시 서명 불일치로 거부 (다른 사용자로 위장 차단)
  test(`페이로드 변조 토큰은 거부한다`, () => {
    const token: string = createToken(`user@example.com`, TV);
    const parts: string[] = token.split(`.`);
    const swapped: string = `${parts[0]}.${encodeSeg(JSON.stringify({ sub: `attacker@example.com`, tv: TV, iat: 1, exp: 9_999_999_999 }))}.${parts[2]}`;

    expect(readToken(swapped)).toBeNull();
  });

  // 2-3. 만료 토큰 거부
  test(`만료된 토큰은 거부한다`, () => {
    const expired: string = forgeSigned({
      sub: `user@example.com`,
      tv: TV,
      iat: 1,
      exp: 2,
    });

    expect(readToken(expired)).toBeNull();
  });

  // 2-4. 주체 없는 토큰 거부
  test(`주체가 비어 있으면 거부한다`, () => {
    const empty: string = forgeSigned({
      sub: ``,
      tv: TV,
      iat: 1,
      exp: 9_999_999_999,
    });

    expect(readToken(empty)).toBeNull();
  });

  // 2-5. 세대 클레임 없는 토큰 거부 (세대 대조를 건너뛰는 구형 토큰 차단)
  test(`세대 클레임이 없으면 거부한다`, () => {
    const noVersion: string = forgeSigned({
      sub: `user@example.com`,
      iat: 1,
      exp: 9_999_999_999,
    });

    expect(readToken(noVersion)).toBeNull();
  });

  // 2-6. 형식 오류 거부
  test(`세그먼트 수가 맞지 않으면 거부한다`, () => {
    expect(readToken(``)).toBeNull();
    expect(readToken(`a.b`)).toBeNull();
    expect(readToken(`a.b.c.d`)).toBeNull();
  });

  // 2-7. alg 조작(none) 거부 — 서명은 항상 HS256 으로만 대조함
  test(`헤더 alg 를 none 으로 바꾼 토큰은 거부한다`, () => {
    const token: string = createToken(`user@example.com`, TV);
    const parts: string[] = token.split(`.`);
    const noneHeader: string = encodeSeg(JSON.stringify({ alg: `none`, typ: `JWT` }));

    expect(readToken(`${noneHeader}.${parts[1]}.${parts[2]}`)).toBeNull();
    expect(readToken(`${noneHeader}.${parts[1]}.`)).toBeNull();
  });
});

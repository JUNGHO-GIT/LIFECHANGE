/**
 * @file sanitize.ts
 * @description MongoDB 연산자 주입 방어용 키 정리 유틸
 * @author Jungho
 * @since 2026-08-23
 */

// 0. 프로토타입 오염 키 ---------------------------------------------------------------------------
// - JSON 본문은 __proto__ 를 자체 속성으로 만들 수 있어 병합·복사 경로에서 원형이 오염됨
const pollutionKeys: Set<string> = new Set([ `__proto__`, `constructor`, `prototype` ]);

// 1. 연산자 키 제거 -------------------------------------------------------------------------------
// - $ 로 시작하거나 . 을 포함한 키는 쿼리 연산자·경로 표현으로 해석되므로 제거함
// - 원형 오염 키는 값 형태와 무관하게 제거해 하위 순회 대상에서도 배제함
// - 순환·과대 중첩 방어용 깊이 상한을 두어 정리 자체가 공격 표면이 되지 않게 함
export const sanitizeMongoKeys = (value: unknown, depth: number = 0): void => {
  if (depth > 20 || value === null || typeof value !== `object`) {
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      sanitizeMongoKeys(item, depth + 1);
    }
    return;
  }

  const target = value as Record<string, unknown>;
  for (const key of Object.keys(target)) {
    if (key.startsWith(`$`) || key.includes(`.`) || pollutionKeys.has(key)) {
      delete target[key];
      continue;
    }
    sanitizeMongoKeys(target[key], depth + 1);
  }
};

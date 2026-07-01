/**
 * @file storage.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

const TITLE: string = import.meta.env.VITE_APP_TITLE ?? ``;

// 0. safe parse ----------------------------------------------------------------------------------
const safeParse = (raw: string | null): any => {
  try {
    return JSON.parse(raw ?? `{}`);
  }
  catch {
    return {};
  }
};

const isPlainObject = (v: any): boolean => {
  return !!v && typeof v === `object` && !Array.isArray(v);
};

// 0-1. root cache --------------------------------------------------------------------------------
// 동일 raw 문자열이면 재파싱 생략. 페이지 전환마다 useCommonValue 등 다수 컴포넌트가 전체 객체를
// 각각 JSON.parse 하던 비용을 제거한다(set 시점에만 캐시 갱신, 멀티탭 변경 시 raw 불일치로 재파싱).
let localRaw: string | null = null;
let localRoot: any = {};
let sessionRaw: string | null = null;
let sessionRoot: any = {};

// getLocalRoot ------------------------------------------------------------------------------------
export const getLocalRoot = (): any => {
  const raw: string | null = localStorage.getItem(TITLE);
  if (raw !== localRaw) {
    localRaw = raw;
    localRoot = safeParse(raw);
  }
  return localRoot;
};

// getSessionRoot ----------------------------------------------------------------------------------
export const getSessionRoot = (): any => {
  const raw: string | null = sessionStorage.getItem(TITLE);
  if (raw !== sessionRaw) {
    sessionRaw = raw;
    sessionRoot = safeParse(raw);
  }
  return sessionRoot;
};

// writeLocalRoot ----------------------------------------------------------------------------------
const writeLocalRoot = (next: any): void => {
  const str: string = JSON.stringify(next);
  localRoot = next;
  localRaw = str;
  localStorage.setItem(TITLE, str);
};

// writeSessionRoot ---------------------------------------------------------------------------------
const writeSessionRoot = (next: any): void => {
  const str: string = JSON.stringify(next);
  sessionRoot = next;
  sessionRaw = str;
  sessionStorage.setItem(TITLE, str);
};

// 1. getLocal -------------------------------------------------------------------------------------
export const getLocal = (key1: string, key2: string, key3: string) => {
  const localTitle: any = getLocalRoot();

  // 1. key1만 있는 경우
  if (key1 && !key2 && !key3) {
    return localTitle?.[key1];
  }

  // 2. key1, key2만 있는 경우
  if (key1 && key2 && !key3) {
    return localTitle?.[key1]?.[key2];
  }

  // 3. key1, key2, key3 모두 있는 경우
  if (key1 && key2 && key3) {
    return localTitle?.[key1]?.[key2]?.[key3];
  }
};

// 2. setLocal -------------------------------------------------------------------------------------
export const setLocal = (key1: string, key2: string, key3: string, value: any) => {
  const localTitle: any = getLocalRoot();

  // 1. key1만 있는 경우
  if (key1 && !key2 && !key3) {
    const prev1: any = localTitle?.[key1];
    const next1: any = isPlainObject(value) ? {
      ...(isPlainObject(prev1) ? prev1 : {}),
      ...value,
    } : value;

    writeLocalRoot({
      ...localTitle,
      [key1]: next1,
    });
  }

  // 2. key1, key2만 있는 경우
  else if (key1 && key2 && !key3) {
    const prev1: any = localTitle?.[key1];
    const prev2: any = localTitle?.[key1]?.[key2];
    const next2: any = isPlainObject(value) ? {
      ...(isPlainObject(prev2) ? prev2 : {}),
      ...value,
    } : value;

    writeLocalRoot({
      ...localTitle,
      [key1]: {
        ...(isPlainObject(prev1) ? prev1 : {}),
        [key2]: next2,
      },
    });
  }

  // 3. key1, key2, key3 모두 있는 경우
  else if (key1 && key2 && key3) {
    const prev1: any = localTitle?.[key1];
    const prev2: any = localTitle?.[key1]?.[key2];
    const prev3: any = localTitle?.[key1]?.[key2]?.[key3];
    const next3: any = isPlainObject(value) ? {
      ...(isPlainObject(prev3) ? prev3 : {}),
      ...value,
    } : value;

    writeLocalRoot({
      ...localTitle,
      [key1]: {
        ...(isPlainObject(prev1) ? prev1 : {}),
        [key2]: {
          ...(isPlainObject(prev2) ? prev2 : {}),
          [key3]: next3,
        },
      },
    });
  }
};

// 3. getSession -----------------------------------------------------------------------------------
export const getSession = (key1: string, key2: string, key3: string) => {
  const sessionTitle: any = getSessionRoot();

  // 1. key1만 있는 경우
  if (key1 && !key2 && !key3) {
    return sessionTitle?.[key1];
  }

  // 2. key1, key2만 있는 경우
  if (key1 && key2 && !key3) {
    return sessionTitle?.[key1]?.[key2];
  }

  // 3. key1, key2, key3 모두 있는 경우
  if (key1 && key2 && key3) {
    return sessionTitle?.[key1]?.[key2]?.[key3];
  }

  return {};
};

// 4. setSession -----------------------------------------------------------------------------------
export const setSession = (key1: string, key2: string, key3: string, value: any) => {
  const sessionTitle: any = getSessionRoot();

  // 1. key1만 있는 경우
  if (key1 && !key2 && !key3) {
    const prev1: any = sessionTitle?.[key1];
    const next1: any = isPlainObject(value) ? {
      ...(isPlainObject(prev1) ? prev1 : {}),
      ...value,
    } : value;

    writeSessionRoot({
      ...sessionTitle,
      [key1]: next1,
    });
  }

  // 2. key1, key2만 있는 경우
  else if (key1 && key2 && !key3) {
    const prev1: any = sessionTitle?.[key1];
    const prev2: any = sessionTitle?.[key1]?.[key2];
    const next2: any = isPlainObject(value) ? {
      ...(isPlainObject(prev2) ? prev2 : {}),
      ...value,
    } : value;

    writeSessionRoot({
      ...sessionTitle,
      [key1]: {
        ...(isPlainObject(prev1) ? prev1 : {}),
        [key2]: next2,
      },
    });
  }

  // 3. key1, key2, key3 모두 있는 경우
  else if (key1 && key2 && key3) {
    const prev1: any = sessionTitle?.[key1];
    const prev2: any = sessionTitle?.[key1]?.[key2];
    const prev3: any = sessionTitle?.[key1]?.[key2]?.[key3];
    const next3: any = isPlainObject(value) ? {
      ...(isPlainObject(prev3) ? prev3 : {}),
      ...value,
    } : value;

    writeSessionRoot({
      ...sessionTitle,
      [key1]: {
        ...(isPlainObject(prev1) ? prev1 : {}),
        [key2]: {
          ...(isPlainObject(prev2) ? prev2 : {}),
          [key3]: next3,
        },
      },
    });
  }
};

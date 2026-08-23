/**
 * @file interceptor.ts
 * @description foo
 * @author Jungho
 * @since 2026-06-06
 */

import axios from "axios";
import { getLocal, getSession, setLocal, setSession } from "@assets/scripts/storage";

// -------------------------------------------------------------------------------------------------
let registered: boolean = false;
const EXIST_CACHE_MS: number = 60_000;
const existCache: Map<string, { expiresAt: number; response: any }> = new Map();
const inFlight: Map<string, AbortController> = new Map();

const isExistRequest = (config: any): boolean => (
  config?.method?.toLowerCase() === `get`
  && typeof config.url === `string`
  && config.url.endsWith(`/exist`)
);

// 캐시 키는 파라미터 키 순서에 무관해야 하므로 정렬 후 직렬화한다
const stableStringify = (value: any): string => {
  if (value === null || typeof value !== `object`) {
    return JSON.stringify(value ?? null);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(`,`)}]`;
  }
  const keys: string[] = Object.keys(value).sort();

  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(`,`)}}`;
};

const getExistKey = (config: any): string => stableStringify([
  config.url,
  config.params ?? {},
]);

// 액세스 토큰 조회 (세션 우선, 없으면 자동로그인 보관값)
const readToken = (): string => {
  const sessionToken: any = getSession(`setting`, `id`, `token`);
  if (typeof sessionToken === `string` && sessionToken !== ``) {
    return sessionToken;
  }
  const localToken: any = getLocal(`setting`, `id`, `autoLoginToken`);

  return typeof localToken === `string` ? localToken : ``;
};

// 인증 만료 시 저장된 자격을 비우고 로그인 화면으로 유도한다
const clearAuth = (): void => {
  setLocal(`setting`, `id`, ``, {
    autoLogin: `false`,
    autoLoginId: ``,
    autoLoginToken: ``,
  });
  setSession(`setting`, `id`, ``, {
    sessionId: ``,
    admin: `false`,
    token: ``,
  });
};

// 동일 엔드포인트의 이전 GET 을 취소해 느린 응답이 최신 상태를 덮어쓰는 것을 막는다
const trackRequest = (config: any): void => {
  const key: string = String(config.url ?? ``);
  const prev: AbortController | undefined = inFlight.get(key);
  if (prev) {
    prev.abort();
  }
  const controller: AbortController = new AbortController();
  config.signal = controller.signal;
  inFlight.set(key, controller);
};

const releaseRequest = (config: any): void => {
  const key: string = String(config?.url ?? ``);
  inFlight.delete(key);
};

// 네트워크 오류 등으로 response 가 없는 axios error 를 안전한 형태로 보강
// 88곳의 catch 가 error.response.data.msg 에 접근해도 크래시하지 않도록 전역 1회만 등록
export const registerInterceptor = (): void => {
  if (registered) {
    return;
  }
  registered = true;

  axios.interceptors.request.use((config: any) => {
    // 액세스 토큰 첨부 (서버가 요청 주체를 토큰으로 확정함)
    const token: string = readToken();
    if (token !== ``) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config?.method?.toLowerCase() !== `get`) {
      existCache.clear();
      return config;
    }

    // exist 캐시 히트 시 네트워크를 타지 않고 보관 응답을 재생한다
    if (isExistRequest(config)) {
      const cacheKey: string = getExistKey(config);
      const cached = existCache.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) {
        // fromCache 표식으로 응답 인터셉터의 재저장(TTL 슬라이딩 연장)을 차단한다
        config.fromCache = true;
        config.adapter = () => Promise.resolve({
          ...cached.response,
          config: config,
        });
        return config;
      }
      cached && existCache.delete(cacheKey);
    }

    trackRequest(config);
    return config;
  });

  axios.interceptors.response.use(
    (response: any) => {
      releaseRequest(response.config);
      if (isExistRequest(response.config) && response.config?.fromCache !== true) {
        existCache.set(getExistKey(response.config), {
          expiresAt: Date.now() + EXIST_CACHE_MS,
          response,
        });
      }
      return response;
    },
    (error: any) => {
      releaseRequest(error?.config);

      // 취소된 요청은 사용자 오류가 아니므로 알림에서 걸러지는 전용 코드로 표시한다
      if (axios.isCancel(error) || error?.code === `ERR_CANCELED`) {
        const canceled: any = error ?? {};
        canceled.response = {
          status: 0,
          data: {
            status: `canceled`,
            msg: `requestCanceled`,
          },
        };
        return Promise.reject(canceled);
      }

      if (!error || !error.response) {
        const safeError: any = error ?? {};
        safeError.response = {
          status: 0,
          data: {
            status: `error`,
            msg: `networkError`,
          },
        };
        return Promise.reject(safeError);
      }

      // 인증 만료·위조 토큰은 저장된 자격을 비우고 로그인 화면으로 되돌린다
      if (error.response.status === 401 || error.response.status === 403) {
        clearAuth();
        if (!globalThis.location?.pathname?.includes(`/user/login`)) {
          const base: string = String(import.meta.env.BASE_URL ?? `/`).replace(/\/+$/, ``);
          globalThis.location.href = `${base}/user/login`;
        }
      }

      // response 는 있으나 data 가 비정상인 경우도 최소 형태를 보강
      const data: any = error.response.data;
      if (!data || typeof data !== `object`) {
        error.response.data = {
          status: `error`,
          msg: `networkError`,
        };
      } else if (data.msg === undefined || data.msg === null) {
        data.msg = `networkError`;
      }
      return Promise.reject(error);
    },
  );
};

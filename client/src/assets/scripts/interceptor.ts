/**
 * @file interceptor.ts
 * @description foo
 * @author Jungho
 * @since 2026-06-06
 */

import axios from "axios";

// -------------------------------------------------------------------------------------------------
let registered: boolean = false;
const EXIST_CACHE_MS: number = 60_000;
const existCache: Map<string, { expiresAt: number; response: any }> = new Map();

const isExistRequest = (config: any): boolean => (
  config?.method?.toLowerCase() === `get`
  && typeof config.url === `string`
  && config.url.endsWith(`/exist`)
);

const getExistKey = (config: any): string => JSON.stringify([
  config.url,
  config.params ?? {},
]);

// 네트워크 오류 등으로 response 가 없는 axios error 를 안전한 형태로 보강
// 88곳의 catch 가 error.response.data.msg 에 접근해도 크래시하지 않도록 전역 1회만 등록
export const registerInterceptor = (): void => {
  if (registered) {
    return;
  }
  registered = true;

  axios.interceptors.request.use((config: any) => {
    if (config?.method?.toLowerCase() !== `get`) {
      existCache.clear();
      return config;
    }
    if (!isExistRequest(config)) {
      return config;
    }

    const cacheKey: string = getExistKey(config);
    const cached = existCache.get(cacheKey);
    if (!cached || cached.expiresAt <= Date.now()) {
      cached && existCache.delete(cacheKey);
      return config;
    }

    config.adapter = () => Promise.resolve({
      ...cached.response,
      config,
    });
    return config;
  });

  axios.interceptors.response.use(
    (response: any) => {
      if (isExistRequest(response.config)) {
        existCache.set(getExistKey(response.config), {
          expiresAt: Date.now() + EXIST_CACHE_MS,
          response,
        });
      }
      return response;
    },
    (error: any) => {
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

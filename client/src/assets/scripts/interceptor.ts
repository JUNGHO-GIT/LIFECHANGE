/**
 * @file interceptor.ts
 * @description foo
 * @author Jungho
 * @since 2026-06-06
 */

import axios from "axios";

// ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
let registered: boolean = false;

// 네트워크 오류 등으로 response 가 없는 axios error 를 안전한 형태로 보강한다 ―――――――――――――――――――――――――――――――――
// 88곳의 catch 가 error.response.data.msg 에 접근해도 크래시하지 않도록 전역 1회만 등록한다.
export const registerInterceptor = (): void => {
  if (registered) {
    return;
  }
  registered = true;

  axios.interceptors.response.use(
    (response: any) => response,
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
      // response 는 있으나 data 가 비정상인 경우도 최소 형태를 보강한다 ―――――――――――――――――――――――――――――――――――――
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

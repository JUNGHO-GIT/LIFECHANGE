/**
 * @file useRoot.tsx
 * @description 세션이 없는 경우, 로그인 페이지로 리디렉션
 * @author Jungho
 * @since 2025-12-25
 */

import { useEffect } from "@exportReacts";
import type { CommonValueType } from "@exportTypes";

// -------------------------------------------------------------------------------------------------
export const useRoot = (
  PATH: string,
  navigate: CommonValueType["navigate"],
  sessionId: string,
) => {

  // 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    if (
      !PATH.includes(`user/login`) && !PATH.includes(`user/signup`) &&
      !PATH.includes(`user/resetPw`) && !PATH.includes(`user/delete`) &&
      !PATH.includes(`auth`) && !PATH.includes(`error`) &&
      PATH === `/`
    ) {
      !sessionId ? (() => {
        void navigate(`/user/login`);
      })() : (() => {
        void navigate(`/calendar/list`);
      })();
    }
  }, [ PATH, sessionId, navigate ]);
};

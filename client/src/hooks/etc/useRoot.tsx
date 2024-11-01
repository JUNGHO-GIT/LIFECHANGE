// useRoot.tsx

import { useEffect } from "@importReacts";
import { useCommonValue } from "@importHooks";

// -------------------------------------------------------------------------------------------------
export const useRoot = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { PATH, navigate, sessionId } = useCommonValue();

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    // 1. 리디렉트 처리
    if (
      !PATH.includes("user/login") && !PATH.includes("user/signup") &&
      !PATH.includes("user/resetPw") && !PATH.includes("user/delete") &&
      !PATH.includes("auth") && !PATH.includes("error")
    ) {
      // 세션이 없는 경우, 로그인 페이지로 리디렉션
      if (PATH === "/") {
        if (!sessionId) {
          navigate("/user/login");
        }
        else {
          navigate("/today/list");
        }
      }
    }
  }, [PATH, sessionId, navigate]);
};

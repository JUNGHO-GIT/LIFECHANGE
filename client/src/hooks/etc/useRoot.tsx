// useRoot.tsx

import { useEffect } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";

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
      !PATH.includes("auth")
    ) {
      if (PATH === "/") {
        if (!sessionId) {
          navigate("/user/login");
        }
        else {
          navigate("/today/list");
        }
      }
    }
  }, [navigate, sessionId]);
};
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
      !PATH.includes("user/resetPw") && !PATH.includes("user/delete") &&  !PATH.includes("auth")
    ) {

      // '/'경로로 진입했을때의 처리
      if (PATH === "/") {
        if (sessionId === null || sessionId === undefined || sessionId === "") {
          navigate("/user/login");
        }
        else {
          navigate("/today/list");
        }
      }

      // 기타 모든 경로에 대한 처리
      else {
        if (sessionId === null || sessionId === undefined || sessionId === "") {
          navigate("/user/login");
        }
      }
    }
  }, [navigate, sessionId]);

  useEffect(() => {
    console.log("===================================");
    console.log("sessionId", sessionId);
  }, []);
};
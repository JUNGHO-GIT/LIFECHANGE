// useRoot.tsx

import { useEffect } from "@imports/ImportReacts";
import { useCommon } from "@imports/ImportHooks";

// -------------------------------------------------------------------------------------------------
export const useRoot = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    navigate, location, sessionId
  } = useCommon();

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {

    // 1. 리다리렉트 처리
    if (
      location.pathname.indexOf("/user/login") === -1 &&
      location.pathname.indexOf("/user/signup") === -1 &&
      location.pathname.indexOf("/user/resetPw") === -1 &&
      location.pathname.indexOf("/auth") === -1
    ) {

      // '/'경로로 진입했을때의 처리
      if (location.pathname === '/') {
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
  }, [location, navigate, sessionId]);
};
// useRoot.jsx

import {useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";

// -------------------------------------------------------------------------------------------------
export const useRoot = () => {

  // 1. common -------------------------------------------------------------------------------------
  const navigate = useNavigate();
  const location = useLocation();
  const sessionId = sessionStorage.getItem('sessionId');

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {

    if (location.pathname !== "/user/login" && location.pathname !== "/user/signup") {

      // '/'경로로 진입했을때의 처리
      if (location.pathname === '/') {
        if (!sessionId) {
          navigate("/user/login");
        }
        else {
          navigate("/today/list");
        }
      }

      // 기타 다른 경로로 진입했을때의 처리
      else {
        if (!sessionId) {
          navigate("/user/login");
        }
      }
    }
  }, [location, navigate, sessionId]);

};
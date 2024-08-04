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
    // 로그인, 회원가입
    if (location.pathname !== "/user/login" && location.pathname !== "/user/signup") {
      if (location.pathname === '/' && !sessionId) {
        navigate("/user/login");
      }
      else if (location.pathname === '/' && sessionId) {
        navigate("/today/list");
      }
    }
  }, [location, navigate, sessionId]);
};
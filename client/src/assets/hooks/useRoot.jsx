// useRoot.jsx

import { useEffect, useNavigate, useLocation } from "../../import/ImportReacts.jsx";

export const useRoot = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionId = sessionStorage.getItem('sessionId');

  useEffect(() => {
    // 로그인 페이지와 회원가입 페이지 접근 시, 세션이 존재하면 기본 페이지로 리다이렉트
    if (sessionId && (
      location.pathname === "/user/login" ||
      location.pathname === "/user/signup"
    )) {
      navigate("/today/list");
      return;
    }

    // 로그인이 필요한 페이지에 세션이 없으면 로그인 페이지로 리다이렉트
    if (!sessionId &&(
      !location.pathname.startsWith("/user/login") &&
      !location.pathname.startsWith("/user/signup")
    )) {
      navigate("/user/login");
    }
  }, [location, navigate, sessionId]);
};

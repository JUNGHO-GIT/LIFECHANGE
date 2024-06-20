// useRoot.jsx

import {useEffect, useNavigate} from "../../import/ImportReacts.jsx";
import {useLocation} from "../../import/ImportReacts.jsx";

// -------------------------------------------------------------------------------------------------
export const useRoot = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionId = sessionStorage.getItem('sessionId');

  useEffect(() => {
    if (location.pathname !== "/user/login" && location.pathname !== "/user/signup") {
      if (location.pathname === '/' && !sessionId) {
        navigate("/user/login");
      }
      else if (location.pathname === '/' && sessionId) {
        navigate("/calendar/list");
      }
    }
  }, [location, navigate, sessionId]);
};
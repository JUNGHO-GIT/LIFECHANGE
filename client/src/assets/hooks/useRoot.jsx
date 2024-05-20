// useRoot.jsx

import {React, useEffect, useNavigate} from "../../import/ImportReacts.jsx";

// ------------------------------------------------------------------------------------------------>
export const useRoot = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = sessionStorage.getItem('sessionId');

    if (!sessionId) {
      navigate('/', { replace: true });
    }
  }, []);
}
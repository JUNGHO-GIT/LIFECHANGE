// useScrollTop.jsx

import {React, useEffect, useLocation, useNavigate} from "../../import/ImportReacts.jsx";

// -------------------------------------------------------------------------------------------------
export const useScrollTop = () => {

  // 1. common -------------------------------------------------------------------------------------
  const navigate = useNavigate();
  const location = useLocation();

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location, navigate]);
};

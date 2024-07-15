// useScrollTop.jsx

import {React, useEffect, useLocation} from "../../import/ImportReacts.jsx";
import {log} from "../../import/ImportUtils.jsx";

// -------------------------------------------------------------------------------------------------
export const useScrollTop = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {pathname} = useLocation();

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    window.scrollTo(0, 0);
    log("scroll-top activated", pathname);
  }, [pathname]);

};

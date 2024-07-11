// useScrollTop.jsx

import {React, useEffect, useLocation} from "../../import/ImportReacts.jsx";
import {log} from "../../import/ImportUtils.jsx";

// -------------------------------------------------------------------------------------------------
export const useScrollTop = () => {
  const {pathname} = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    log("scroll-top activated", pathname);
  }, [pathname]);
};

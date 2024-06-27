// useScrollTop.jsx

import {React, useEffect, useLocation} from "../../import/ImportReacts.jsx";

// -------------------------------------------------------------------------------------------------
export const useScrollTop = () => {
  const {pathname} = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log(JSON.stringify(`scroll-top activated : ${pathname}`, null, 2));
  }, [pathname]);
};

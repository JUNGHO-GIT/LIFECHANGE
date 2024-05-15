// useScrollTop.jsx

import {React, useEffect, useLocation} from "../../import/ImportReacts.jsx";

export const useScrollTop = () => {
  const {pathname} = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
};
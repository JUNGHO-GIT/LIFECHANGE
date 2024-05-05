// useDate.jsx
// list 사용금지

import React, {useEffect} from "react";

// ------------------------------------------------------------------------------------------------>
export const useDate = (
  location_startDt, location_endDt, DATE, setDATE
) => {

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (location_startDt && location_endDt) {
      setDATE((prev) => ({
        ...prev,
        startDt: location_startDt,
        endDt: location_endDt,
      }));
    }
  }, [location_startDt, location_endDt]);
};
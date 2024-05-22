// useDate.jsx
// 리스트 사용금지

import {React, useEffect, useLocation} from "../../import/ImportReacts.jsx";
import {moment} from "../../import/ImportLibs.jsx";

// ------------------------------------------------------------------------------------------------>
export const useDate = (
  DATE, setDATE
) => {

  // 1. common ------------------------------------------------------------------------------------>
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");
  const location = useLocation();
  const PATH = location?.pathname;
  const secondStr = PATH?.split("/")[2] || "";

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (secondStr === "plan") {
      if (DATE?.dateType === "day") {
        setDATE((prev) => ({
          ...prev,
          dateStart: moment(koreanDate).format("YYYY-MM-DD"),
          dateEnd: moment(koreanDate).format("YYYY-MM-DD"),
        }));
      }
      else if (DATE?.dateType === "week") {
        setDATE((prev) => ({
          ...prev,
          dateStart: moment(koreanDate).startOf("isoWeek").format("YYYY-MM-DD"),
          dateEnd: moment(koreanDate).endOf("isoWeek").format("YYYY-MM-DD")
        }));
      }
      else if (DATE?.dateType === "month") {
        setDATE((prev) => ({
          ...prev,
          dateStart: moment(koreanDate).startOf("month").format("YYYY-MM-DD"),
          dateEnd: moment(koreanDate).endOf("month").format("YYYY-MM-DD")
        }));
      }
      else if (DATE?.dateType === "year") {
        setDATE((prev) => ({
          ...prev,
          dateStart: moment(koreanDate).startOf("year").format("YYYY-MM-DD"),
          dateEnd: moment(koreanDate).endOf("year").format("YYYY-MM-DD")
        }));
      }
    }
  }, [DATE?.dateType]);
};

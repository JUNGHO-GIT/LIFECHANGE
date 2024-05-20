// useDate.jsx
// 리스트 사용금지

import {React, useEffect, useLocation} from "../../import/ImportReacts.jsx";
import {moment} from "../../import/ImportLibs.jsx";

// ------------------------------------------------------------------------------------------------>
export const useDate = (
  location_dateStart, location_dateEnd, DATE, setDATE, FILTER, setFILTER
) => {

  // 1. common ------------------------------------------------------------------------------------>
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");
  const location = useLocation();
  const PATH = location?.pathname?.trim()?.toString();
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (location_dateStart && location_dateEnd) {
      setDATE((prev) => ({
        ...prev,
        dateStart: location_dateStart,
        dateEnd: location_dateEnd,
      }));
    }
  }, [location_dateStart, location_dateEnd]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  /**

  useEffect(() => {
    if (secondStr !== "list" && thirdStr !== "list"){
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

  **/
};

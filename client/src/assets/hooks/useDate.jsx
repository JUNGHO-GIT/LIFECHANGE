// useDate.jsx
// list 사용금지

import {React, useEffect} from "../../import/ImportReacts.jsx";
import {moment} from "../../import/ImportLibs.jsx";

// ------------------------------------------------------------------------------------------------>
export const useDate = (
  location_date_start, location_date_end, DATE, setDATE, FILTER, setFILTER
) => {

  // 1. common ------------------------------------------------------------------------------------>
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (location_date_start && location_date_end) {
      setDATE((prev) => ({
        ...prev,
        date_start: location_date_start || moment().format("YYYY-MM-DD"),
        date_end: location_date_end || moment().format("YYYY-MM-DD"),
      }));
    }
  }, [location_date_start, location_date_end]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (FILTER?.type === "day") {
      setDATE((prev) => ({
        ...prev,
        date_start: moment(koreanDate).format("YYYY-MM-DD"),
        date_end: moment(koreanDate).format("YYYY-MM-DD"),
      }));
    }
    else if (FILTER?.type === "week") {
      setDATE((prev) => ({
        ...prev,
        date_start: moment(koreanDate).startOf("isoWeek").format("YYYY-MM-DD"),
        date_end: moment(koreanDate).endOf("isoWeek").format("YYYY-MM-DD")
      }));
    }
    else if (FILTER?.type === "month") {
      setDATE((prev) => ({
        ...prev,
        date_start: moment(koreanDate).startOf("month").format("YYYY-MM-DD"),
        date_end: moment(koreanDate).endOf("month").format("YYYY-MM-DD")
      }));
    }
    else if (FILTER?.type === "year") {
      setDATE((prev) => ({
        ...prev,
        date_start: moment(koreanDate).startOf("year").format("YYYY-MM-DD"),
        date_end: moment(koreanDate).endOf("year").format("YYYY-MM-DD")
      }));
    }
    else if (FILTER?.type === "select") {
      setDATE((prev) => ({
        ...prev,
        date_start: moment(koreanDate).format("YYYY-MM-DD"),
        date_end: moment(koreanDate).format("YYYY-MM-DD"),
      }));
    }
  }, [FILTER?.type]);
};
// useDate.jsx
// list 사용금지

import {useEffect} from "react";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const useDate = (
  location_startDt, location_endDt, DATE, setDATE, FILTER, setFILTER
) => {

  // 1. common ------------------------------------------------------------------------------------>
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");

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

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (FILTER?.type === "day") {
      setDATE((prev) => ({
        ...prev,
        startDt: moment(koreanDate).format("YYYY-MM-DD"),
        endDt: moment(koreanDate).format("YYYY-MM-DD"),
      }));
    }
    else if (FILTER?.type === "week") {
      setDATE((prev) => ({
        ...prev,
        startDt: moment(koreanDate).startOf("isoWeek").format("YYYY-MM-DD"),
        endDt: moment(koreanDate).endOf("isoWeek").format("YYYY-MM-DD")
      }));
    }
    else if (FILTER?.type === "month") {
      setDATE((prev) => ({
        ...prev,
        startDt: moment(koreanDate).startOf("month").format("YYYY-MM-DD"),
        endDt: moment(koreanDate).endOf("month").format("YYYY-MM-DD")
      }));
    }
    else if (FILTER?.type === "year") {
      setDATE((prev) => ({
        ...prev,
        startDt: moment(koreanDate).startOf("year").format("YYYY-MM-DD"),
        endDt: moment(koreanDate).endOf("year").format("YYYY-MM-DD")
      }));
    }
    else if (FILTER?.type === "select") {
      setDATE((prev) => ({
        ...prev,
        startDt: moment(koreanDate).format("YYYY-MM-DD"),
        endDt: moment(koreanDate).format("YYYY-MM-DD"),
      }));
    }
  }, [FILTER?.type]);
};
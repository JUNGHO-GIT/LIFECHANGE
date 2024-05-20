// useDate.jsx
// list 사용금지

import {React, useEffect} from "../../import/ImportReacts.jsx";
import {moment} from "../../import/ImportLibs.jsx";

// ------------------------------------------------------------------------------------------------>
export const useDate = (
  location_dateStart, location_dateEnd, DATE, setDATE, FILTER, setFILTER
) => {

  // 1. common ------------------------------------------------------------------------------------>
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (location_dateStart && location_dateEnd) {
      setDATE((prev) => ({
        ...prev,
        dateStart: location_dateStart || moment().format("YYYY-MM-DD"),
        dateEnd: location_dateEnd || moment().format("YYYY-MM-DD"),
      }));
    }
  }, [location_dateStart, location_dateEnd]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
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
  }, [DATE?.dateType]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (FILTER?.type === "day") {
      setDATE((prev) => ({
        ...prev,
        dateStart: moment(koreanDate).format("YYYY-MM-DD"),
        dateEnd: moment(koreanDate).format("YYYY-MM-DD"),
      }));
    }
    else if (FILTER?.type === "week") {
      setDATE((prev) => ({
        ...prev,
        dateStart: moment(koreanDate).startOf("isoWeek").format("YYYY-MM-DD"),
        dateEnd: moment(koreanDate).endOf("isoWeek").format("YYYY-MM-DD")
      }));
    }
    else if (FILTER?.type === "month") {
      setDATE((prev) => ({
        ...prev,
        dateStart: moment(koreanDate).startOf("month").format("YYYY-MM-DD"),
        dateEnd: moment(koreanDate).endOf("month").format("YYYY-MM-DD")
      }));
    }
    else if (FILTER?.type === "year") {
      setDATE((prev) => ({
        ...prev,
        dateStart: moment(koreanDate).startOf("year").format("YYYY-MM-DD"),
        dateEnd: moment(koreanDate).endOf("year").format("YYYY-MM-DD")
      }));
    }
    else if (FILTER?.type === "select") {
      setDATE((prev) => ({
        ...prev,
        dateStart: moment(koreanDate).format("YYYY-MM-DD"),
        dateEnd: moment(koreanDate).format("YYYY-MM-DD"),
      }));
    }
  }, [FILTER?.type]);
};
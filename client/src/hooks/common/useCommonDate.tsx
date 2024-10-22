// useCommonDate.tsx

import { useCommonValue } from "@imports/ImportHooks";
import { moment } from "@imports/ImportUtils";

// -------------------------------------------------------------------------------------------------
export const useCommonDate = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { localTimeZone } = useCommonValue();

  // 1. not fmt ------------------------------------------------------------------------------------
  const getMoment = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment();
    }
    return moment(params);
  }
  const getDayNotFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC");
    }
    return moment(params).tz(localTimeZone || "UTC");
  }
  const getDayStartNotFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").startOf("day");
    }
    return moment(params).tz(localTimeZone || "UTC").startOf("day");
  }
  const getDayEndNotFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").endOf("day");
    }
    return moment(params).tz(localTimeZone || "UTC").endOf("day");
  }
  const getPrevDayStartNotFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").subtract(1, "days").startOf("day");
    }
    return moment(params).tz(localTimeZone || "UTC").subtract(1, "days").startOf("day");
  }
  const getPrevDayEndNotFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").subtract(1, "days").endOf("day");
    }
    return moment(params).tz(localTimeZone || "UTC").subtract(1, "days").endOf("day");
  }
  const getNextDayStartNotFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").add(1, "days").startOf("day");
    }
    return moment(params).tz(localTimeZone || "UTC").add(1, "days").startOf("day");
  }
  const getNextDayEndNotFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").add(1, "days").endOf("day");
    }
    return moment(params).tz(localTimeZone || "UTC").add(1, "days").endOf("day");
  }
  const getWeekStartNotFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").startOf("isoWeek");
    }
    return moment(params).tz(localTimeZone || "UTC").startOf("isoWeek");
  }
  const getWeekEndNotFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").endOf("isoWeek");
    }
    return moment(params).tz(localTimeZone || "UTC").endOf("isoWeek");
  }
  const getPrevWeekStartNotFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").subtract(1, "weeks").startOf("isoWeek");
    }
    return moment(params).tz(localTimeZone || "UTC").subtract(1, "weeks").startOf("isoWeek");
  }
  const getPrevWeekEndNotFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").subtract(1, "weeks").endOf("isoWeek");
    }
    return moment(params).tz(localTimeZone || "UTC").subtract(1, "weeks").endOf("isoWeek");
  }
  const getNextWeekStartNotFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").add(1, "weeks").startOf("isoWeek");
    }
    return moment(params).tz(localTimeZone || "UTC").add(1, "weeks").startOf("isoWeek");
  }
  const getNextWeekEndNotFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").add(1, "weeks").endOf("isoWeek");
    }
    return moment(params).tz(localTimeZone || "UTC").add(1, "weeks").endOf("isoWeek");
  }
  const getMonthStartNotFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").startOf("month");
    }
    return moment(params).tz(localTimeZone || "UTC").startOf("month");
  }
  const getMonthEndNotFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").endOf("month");
    }
    return moment(params).tz(localTimeZone || "UTC").endOf("month");
  }
  const getPrevMonthStartNotFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").subtract(1, "months").startOf("month");
    }
    return moment(params).tz(localTimeZone || "UTC").subtract(1, "months").startOf("month");
  }
  const getPrevMonthEndNotFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").subtract(1, "months").endOf("month");
    }
    return moment(params).tz(localTimeZone || "UTC").subtract(1, "months").endOf("month");
  }
  const getNextMonthStartNotFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").add(1, "months").startOf("month");
    }
    return moment(params).tz(localTimeZone || "UTC").add(1, "months").startOf("month");
  }
  const getNextMonthEndNotFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").add(1, "months").endOf("month");
    }
    return moment(params).tz(localTimeZone || "UTC").add(1, "months").endOf("month");
  }
  const getYearStartNotFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").startOf("year");
    }
    return moment(params).tz(localTimeZone || "UTC").startOf("year");
  }
  const getYearEndNotFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").endOf("year");
    }
    return moment(params).tz(localTimeZone || "UTC").endOf("year");
  }
  const getPrevYearStartNotFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").subtract(1, "years").startOf("year");
    }
    return moment(params).tz(localTimeZone || "UTC").subtract(1, "years").startOf("year");
  }
  const getPrevYearEndNotFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").subtract(1, "years").endOf("year");
    }
    return moment(params).tz(localTimeZone || "UTC").subtract(1, "years").endOf("year");
  }
  const getNextYearStartNotFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").add(1, "years").startOf("year");
    }
    return moment(params).tz(localTimeZone || "UTC").add(1, "years").startOf("year");
  }
  const getNextYearEndNotFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").add(1, "years").endOf("year");
    }
    return moment(params).tz(localTimeZone || "UTC").add(1, "years").endOf("year");
  }

  // 2. fmt ----------------------------------------------------------------------------------------
  const getDayFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone || "UTC").format("YYYY-MM-DD");
  }
  const getDayStartFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").startOf("day").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone || "UTC").startOf("day").format("YYYY-MM-DD");
  }
  const getDayEndFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").endOf("day").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone || "UTC").endOf("day").format("YYYY-MM-DD");
  }
  const getPrevDayStartFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").subtract(1, "days").startOf("day").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone || "UTC").subtract(1, "days").startOf("day").format("YYYY-MM-DD");
  }
  const getPrevDayEndFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").subtract(1, "days").endOf("day").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone || "UTC").subtract(1, "days").endOf("day").format("YYYY-MM-DD");
  }
  const getNextDayStartFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").add(1, "days").startOf("day").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone || "UTC").add(1, "days").startOf("day").format("YYYY-MM-DD");
  }
  const getNextDayEndFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").add(1, "days").endOf("day").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone || "UTC").add(1, "days").endOf("day").format("YYYY-MM-DD");
  }
  const getWeekStartFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").startOf("isoWeek").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone || "UTC").startOf("isoWeek").format("YYYY-MM-DD");
  }
  const getWeekEndFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").endOf("isoWeek").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone || "UTC").endOf("isoWeek").format("YYYY-MM-DD");
  }
  const getPrevWeekStartFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").subtract(1, "weeks").startOf("isoWeek").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone || "UTC").subtract(1, "weeks").startOf("isoWeek").format("YYYY-MM-DD");
  }
  const getPrevWeekEndFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").subtract(1, "weeks").endOf("isoWeek").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone || "UTC").subtract(1, "weeks").endOf("isoWeek").format("YYYY-MM-DD");
  }
  const getNextWeekStartFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").add(1, "weeks").startOf("isoWeek").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone || "UTC").add(1, "weeks").startOf("isoWeek").format("YYYY-MM-DD");
  }
  const getNextWeekEndFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").add(1, "weeks").endOf("isoWeek").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone || "UTC").add(1, "weeks").endOf("isoWeek").format("YYYY-MM-DD");
  }
  const getMonthStartFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").startOf("month").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone || "UTC").startOf("month").format("YYYY-MM-DD");
  }
  const getMonthEndFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").endOf("month").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone || "UTC").endOf("month").format("YYYY-MM-DD");
  }
  const getPrevMonthStartFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").subtract(1, "months").startOf("month").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone || "UTC").subtract(1, "months").startOf("month").format("YYYY-MM-DD");
  }
  const getPrevMonthEndFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").subtract(1, "months").endOf("month").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone || "UTC").subtract(1, "months").endOf("month").format("YYYY-MM-DD");
  }
  const getNextMonthStartFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").add(1, "months").startOf("month").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone || "UTC").add(1, "months").startOf("month").format("YYYY-MM-DD");
  }
  const getNextMonthEndFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").add(1, "months").endOf("month").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone || "UTC").add(1, "months").endOf("month").format("YYYY-MM-DD");
  }
  const getYearStartFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").startOf("year").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone || "UTC").startOf("year").format("YYYY-MM-DD");
  }
  const getYearEndFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").endOf("year").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone || "UTC").endOf("year").format("YYYY-MM-DD");
  }
  const getPrevYearStartFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").subtract(1, "years").startOf("year").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone || "UTC").subtract(1, "years").startOf("year").format("YYYY-MM-DD");
  }
  const getPrevYearEndFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").subtract(1, "years").endOf("year").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone || "UTC").subtract(1, "years").endOf("year").format("YYYY-MM-DD");
  }
  const getNextYearStartFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").add(1, "years").startOf("year").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone || "UTC").add(1, "years").startOf("year").format("YYYY-MM-DD");
  }
  const getNextYearEndFmt = (params?: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone || "UTC").add(1, "years").endOf("year").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone || "UTC").add(1, "years").endOf("year").format("YYYY-MM-DD");
  }

  // -----------------------------------------------------------------------------------------------
  return {
    getMoment,
    getDayNotFmt,
    getDayFmt,
    getDayStartNotFmt,
    getDayStartFmt,
    getDayEndNotFmt,
    getDayEndFmt,
    getPrevDayStartNotFmt,
    getPrevDayStartFmt,
    getPrevDayEndNotFmt,
    getPrevDayEndFmt,
    getNextDayStartNotFmt,
    getNextDayStartFmt,
    getNextDayEndNotFmt,
    getNextDayEndFmt,
    getWeekStartNotFmt,
    getWeekStartFmt,
    getWeekEndNotFmt,
    getWeekEndFmt,
    getPrevWeekStartNotFmt,
    getPrevWeekStartFmt,
    getPrevWeekEndNotFmt,
    getPrevWeekEndFmt,
    getNextWeekStartNotFmt,
    getNextWeekStartFmt,
    getNextWeekEndNotFmt,
    getNextWeekEndFmt,
    getMonthStartNotFmt,
    getMonthStartFmt,
    getMonthEndNotFmt,
    getMonthEndFmt,
    getPrevMonthStartNotFmt,
    getPrevMonthStartFmt,
    getPrevMonthEndNotFmt,
    getPrevMonthEndFmt,
    getNextMonthStartNotFmt,
    getNextMonthStartFmt,
    getNextMonthEndNotFmt,
    getNextMonthEndFmt,
    getYearStartNotFmt,
    getYearStartFmt,
    getYearEndNotFmt,
    getYearEndFmt,
    getPrevYearStartNotFmt,
    getPrevYearStartFmt,
    getPrevYearEndNotFmt,
    getPrevYearEndFmt,
    getNextYearStartNotFmt,
    getNextYearStartFmt,
    getNextYearEndNotFmt,
    getNextYearEndFmt,
  };
};
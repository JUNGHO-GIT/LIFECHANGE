// useCommonDate.tsx

import { moment, Moment } from "@imports/ImportLibs";

// -------------------------------------------------------------------------------------------------
export const useCommonDate = () => {

  const TITLE: any = process.env.REACT_APP_TITLE || "";
  const sessionTimeZone: string = sessionStorage.getItem(`${TITLE}_timeZone`) || "Asia/Seoul";

  const dayNotFmt: Moment = moment().tz(sessionTimeZone);
  const dayFmt: string = moment().tz(sessionTimeZone).format("YYYY-MM-DD");
  const weekStartNotFmt: Moment = moment().tz(sessionTimeZone).startOf("isoWeek");
  const weekStartFmt: string = moment().tz(sessionTimeZone).startOf("isoWeek").format("YYYY-MM-DD");
  const weekEndNotFmt: Moment = moment().tz(sessionTimeZone).endOf("isoWeek");
  const weekEndFmt: string = moment().tz(sessionTimeZone).endOf("isoWeek").format("YYYY-MM-DD");
  const monthStartNotFmt: Moment = moment().tz(sessionTimeZone).startOf("month");
  const monthStartFmt: string = moment().tz(sessionTimeZone).startOf("month").format("YYYY-MM-DD");
  const monthEndNotFmt: Moment = moment().tz(sessionTimeZone).endOf("month");
  const monthEndFmt: string = moment().tz(sessionTimeZone).endOf("month").format("YYYY-MM-DD");
  const yearStartNotFmt: Moment = moment().tz(sessionTimeZone).startOf("year");
  const yearStartFmt: string = moment().tz(sessionTimeZone).startOf("year").format("YYYY-MM-DD");
  const yearEndNotFmt: Moment = moment().tz(sessionTimeZone).endOf("year");
  const yearEndFmt: string = moment().tz(sessionTimeZone).endOf("year").format("YYYY-MM-DD");

  // 1. day ----------------------------------------------------------------------------------------
  const getMoment = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment();
    }
    return moment(params);
  }
  const getDayNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone);
    }
    return moment(params).tz(sessionTimeZone);
  }
  const getDayFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).format("YYYY-MM-DD");
    }
    return moment(params).tz(sessionTimeZone).format("YYYY-MM-DD");
  }
  const getDayStartNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).startOf("day");
    }
    return moment(params).tz(sessionTimeZone).startOf("day");
  }
  const getDayStartFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).startOf("day").format("YYYY-MM-DD");
    }
    return moment(params).tz(sessionTimeZone).startOf("day").format("YYYY-MM-DD");
  }
  const getDayEndNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).endOf("day");
    }
    return moment(params).tz(sessionTimeZone).endOf("day");
  }
  const getDayEndFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).endOf("day").format("YYYY-MM-DD");
    }
    return moment(params).tz(sessionTimeZone).endOf("day").format("YYYY-MM-DD");
  }

  // 2. week ---------------------------------------------------------------------------------------
  const getWeekStartNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).startOf("isoWeek");
    }
    return moment(params).tz(sessionTimeZone).startOf("isoWeek");
  }
  const getWeekStartFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).startOf("isoWeek").format("YYYY-MM-DD");
    }
    return moment(params).tz(sessionTimeZone).startOf("isoWeek").format("YYYY-MM-DD");
  }
  const getWeekEndNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).endOf("isoWeek");
    }
    return moment(params).tz(sessionTimeZone).endOf("isoWeek");
  }
  const getWeekEndFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).endOf("isoWeek").format("YYYY-MM-DD");
    }
    return moment(params).tz(sessionTimeZone).endOf("isoWeek").format("YYYY-MM-DD");
  }
  const getPrevWeekStartNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).subtract(1, "weeks").startOf("isoWeek");
    }
    return moment(params).tz(sessionTimeZone).subtract(1, "weeks").startOf("isoWeek");
  }
  const getPrevWeekStartFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).subtract(1, "weeks").startOf("isoWeek").format("YYYY-MM-DD");
    }
    return moment(params).tz(sessionTimeZone).subtract(1, "weeks").startOf("isoWeek").format("YYYY-MM-DD");
  }
  const getPrevWeekEndNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).subtract(1, "weeks").endOf("isoWeek");
    }
    return moment(params).tz(sessionTimeZone).subtract(1, "weeks").endOf("isoWeek");
  }
  const getPrevWeekEndFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).subtract(1, "weeks").endOf("isoWeek").format("YYYY-MM-DD");
    }
    return moment(params).tz(sessionTimeZone).subtract(1, "weeks").endOf("isoWeek").format("YYYY-MM-DD");
  }
  const getNextWeekStartNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).add(1, "weeks").startOf("isoWeek");
    }
    return moment(params).tz(sessionTimeZone).add(1, "weeks").startOf("isoWeek");
  }
  const getNextWeekStartFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).add(1, "weeks").startOf("isoWeek").format("YYYY-MM-DD");
    }
    return moment(params).tz(sessionTimeZone).add(1, "weeks").startOf("isoWeek").format("YYYY-MM-DD");
  }
  const getNextWeekEndNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).add(1, "weeks").endOf("isoWeek");
    }
    return moment(params).tz(sessionTimeZone).add(1, "weeks").endOf("isoWeek");
  }
  const getNextWeekEndFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).add(1, "weeks").endOf("isoWeek").format("YYYY-MM-DD");
    }
    return moment(params).tz(sessionTimeZone).add(1, "weeks").endOf("isoWeek").format("YYYY-MM-DD");
  }

  // 3. month --------------------------------------------------------------------------------------
  const getMonthStartNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).startOf("month");
    }
    return moment(params).tz(sessionTimeZone).startOf("month");
  }
  const getMonthStartFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).startOf("month").format("YYYY-MM-DD");
    }
    return moment(params).tz(sessionTimeZone).startOf("month").format("YYYY-MM-DD");
  }
  const getMonthEndNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).endOf("month");
    }
    return moment(params).tz(sessionTimeZone).endOf("month");
  }
  const getMonthEndFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).endOf("month").format("YYYY-MM-DD");
    }
    return moment(params).tz(sessionTimeZone).endOf("month").format("YYYY-MM-DD");
  }
  const getPrevMonthStartNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).subtract(1, "months").startOf("month");
    }
    return moment(params).tz(sessionTimeZone).subtract(1, "months").startOf("month");
  }
  const getPrevMonthStartFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).subtract(1, "months").startOf("month").format("YYYY-MM-DD");
    }
    return moment(params).tz(sessionTimeZone).subtract(1, "months").startOf("month").format("YYYY-MM-DD");
  }
  const getPrevMonthEndNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).subtract(1, "months").endOf("month");
    }
    return moment(params).tz(sessionTimeZone).subtract(1, "months").endOf("month");
  }
  const getPrevMonthEndFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).subtract(1, "months").endOf("month").format("YYYY-MM-DD");
    }
    return moment(params).tz(sessionTimeZone).subtract(1, "months").endOf("month").format("YYYY-MM-DD");
  }
  const getNextMonthStartNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).add(1, "months").startOf("month");
    }
    return moment(params).tz(sessionTimeZone).add(1, "months").startOf("month");
  }
  const getNextMonthStartFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).add(1, "months").startOf("month").format("YYYY-MM-DD");
    }
    return moment(params).tz(sessionTimeZone).add(1, "months").startOf("month").format("YYYY-MM-DD");
  }
  const getNextMonthEndNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).add(1, "months").endOf("month");
    }
    return moment(params).tz(sessionTimeZone).add(1, "months").endOf("month");
  }
  const getNextMonthEndFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).add(1, "months").endOf("month").format("YYYY-MM-DD");
    }
    return moment(params).tz(sessionTimeZone).add(1, "months").endOf("month").format("YYYY-MM-DD");
  }

  // 4. year ---------------------------------------------------------------------------------------
  const getYearStartNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).startOf("year");
    }
    return moment(params).tz(sessionTimeZone).startOf("year");
  }
  const getYearStartFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).startOf("year").format("YYYY-MM-DD");
    }
    return moment(params).tz(sessionTimeZone).startOf("year").format("YYYY-MM-DD");
  }
  const getYearEndNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).endOf("year");
    }
    return moment(params).tz(sessionTimeZone).endOf("year");
  }
  const getYearEndFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).endOf("year").format("YYYY-MM-DD");
    }
    return moment(params).tz(sessionTimeZone).endOf("year").format("YYYY-MM-DD");
  }
  const getPrevYearStartNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).subtract(1, "years").startOf("year");
    }
    return moment(params).tz(sessionTimeZone).subtract(1, "years").startOf("year");
  }
  const getPrevYearStartFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).subtract(1, "years").startOf("year").format("YYYY-MM-DD");
    }
    return moment(params).tz(sessionTimeZone).subtract(1, "years").startOf("year").format("YYYY-MM-DD");
  }
  const getPrevYearEndNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).subtract(1, "years").endOf("year");
    }
    return moment(params).tz(sessionTimeZone).subtract(1, "years").endOf("year");
  }
  const getPrevYearEndFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).subtract(1, "years").endOf("year").format("YYYY-MM-DD");
    }
    return moment(params).tz(sessionTimeZone).subtract(1, "years").endOf("year").format("YYYY-MM-DD");
  }
  const getNextYearStartNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).add(1, "years").startOf("year");
    }
    return moment(params).tz(sessionTimeZone).add(1, "years").startOf("year");
  }
  const getNextYearStartFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).add(1, "years").startOf("year").format("YYYY-MM-DD");
    }
    return moment(params).tz(sessionTimeZone).add(1, "years").startOf("year").format("YYYY-MM-DD");
  }
  const getNextYearEndNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).add(1, "years").endOf("year");
    }
    return moment(params).tz(sessionTimeZone).add(1, "years").endOf("year");
  }
  const getNextYearEndFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(sessionTimeZone).add(1, "years").endOf("year").format("YYYY-MM-DD");
    }
    return moment(params).tz(sessionTimeZone).add(1, "years").endOf("year").format("YYYY-MM-DD");
  }

  // -----------------------------------------------------------------------------------------------
  return {
    dayNotFmt,
    dayFmt,
    weekStartNotFmt,
    weekStartFmt,
    weekEndNotFmt,
    weekEndFmt,
    monthStartNotFmt,
    monthStartFmt,
    monthEndNotFmt,
    monthEndFmt,
    yearStartNotFmt,
    yearStartFmt,
    yearEndNotFmt,
    yearEndFmt,
    getMoment,
    getDayNotFmt,
    getDayFmt,
    getDayStartNotFmt,
    getDayStartFmt,
    getDayEndNotFmt,
    getDayEndFmt,
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
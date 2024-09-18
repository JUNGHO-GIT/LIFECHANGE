// useCommonDate.tsx

import { moment, Moment } from "@imports/ImportLibs";

// -------------------------------------------------------------------------------------------------
export const useCommonDate = () => {

  const TITLE: any = process.env.REACT_APP_TITLE || "";
  const localTimeZone: string = sessionStorage.getItem(`${TITLE}_timeZone`) || "Asia/Seoul";

  const dayNotFmt: Moment = moment().tz(localTimeZone);
  const dayFmt: string = moment().tz(localTimeZone).format("YYYY-MM-DD");
  const weekStartNotFmt: Moment = moment().tz(localTimeZone).startOf("isoWeek");
  const weekStartFmt: string = moment().tz(localTimeZone).startOf("isoWeek").format("YYYY-MM-DD");
  const weekEndNotFmt: Moment = moment().tz(localTimeZone).endOf("isoWeek");
  const weekEndFmt: string = moment().tz(localTimeZone).endOf("isoWeek").format("YYYY-MM-DD");
  const monthStartNotFmt: Moment = moment().tz(localTimeZone).startOf("month");
  const monthStartFmt: string = moment().tz(localTimeZone).startOf("month").format("YYYY-MM-DD");
  const monthEndNotFmt: Moment = moment().tz(localTimeZone).endOf("month");
  const monthEndFmt: string = moment().tz(localTimeZone).endOf("month").format("YYYY-MM-DD");
  const yearStartNotFmt: Moment = moment().tz(localTimeZone).startOf("year");
  const yearStartFmt: string = moment().tz(localTimeZone).startOf("year").format("YYYY-MM-DD");
  const yearEndNotFmt: Moment = moment().tz(localTimeZone).endOf("year");
  const yearEndFmt: string = moment().tz(localTimeZone).endOf("year").format("YYYY-MM-DD");

  // 1. day ----------------------------------------------------------------------------------------
  const getMoment = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment();
    }
    return moment(params);
  }
  const getDayNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone);
    }
    return moment(params).tz(localTimeZone);
  }
  const getDayFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone).format("YYYY-MM-DD");
  }
  const getDayStartNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).startOf("day");
    }
    return moment(params).tz(localTimeZone).startOf("day");
  }
  const getDayStartFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).startOf("day").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone).startOf("day").format("YYYY-MM-DD");
  }
  const getDayEndNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).endOf("day");
    }
    return moment(params).tz(localTimeZone).endOf("day");
  }
  const getDayEndFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).endOf("day").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone).endOf("day").format("YYYY-MM-DD");
  }

  // 2. week ---------------------------------------------------------------------------------------
  const getWeekStartNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).startOf("isoWeek");
    }
    return moment(params).tz(localTimeZone).startOf("isoWeek");
  }
  const getWeekStartFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).startOf("isoWeek").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone).startOf("isoWeek").format("YYYY-MM-DD");
  }
  const getWeekEndNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).endOf("isoWeek");
    }
    return moment(params).tz(localTimeZone).endOf("isoWeek");
  }
  const getWeekEndFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).endOf("isoWeek").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone).endOf("isoWeek").format("YYYY-MM-DD");
  }
  const getPrevWeekStartNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).subtract(1, "weeks").startOf("isoWeek");
    }
    return moment(params).tz(localTimeZone).subtract(1, "weeks").startOf("isoWeek");
  }
  const getPrevWeekStartFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).subtract(1, "weeks").startOf("isoWeek").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone).subtract(1, "weeks").startOf("isoWeek").format("YYYY-MM-DD");
  }
  const getPrevWeekEndNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).subtract(1, "weeks").endOf("isoWeek");
    }
    return moment(params).tz(localTimeZone).subtract(1, "weeks").endOf("isoWeek");
  }
  const getPrevWeekEndFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).subtract(1, "weeks").endOf("isoWeek").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone).subtract(1, "weeks").endOf("isoWeek").format("YYYY-MM-DD");
  }
  const getNextWeekStartNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).add(1, "weeks").startOf("isoWeek");
    }
    return moment(params).tz(localTimeZone).add(1, "weeks").startOf("isoWeek");
  }
  const getNextWeekStartFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).add(1, "weeks").startOf("isoWeek").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone).add(1, "weeks").startOf("isoWeek").format("YYYY-MM-DD");
  }
  const getNextWeekEndNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).add(1, "weeks").endOf("isoWeek");
    }
    return moment(params).tz(localTimeZone).add(1, "weeks").endOf("isoWeek");
  }
  const getNextWeekEndFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).add(1, "weeks").endOf("isoWeek").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone).add(1, "weeks").endOf("isoWeek").format("YYYY-MM-DD");
  }

  // 3. month --------------------------------------------------------------------------------------
  const getMonthStartNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).startOf("month");
    }
    return moment(params).tz(localTimeZone).startOf("month");
  }
  const getMonthStartFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).startOf("month").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone).startOf("month").format("YYYY-MM-DD");
  }
  const getMonthEndNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).endOf("month");
    }
    return moment(params).tz(localTimeZone).endOf("month");
  }
  const getMonthEndFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).endOf("month").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone).endOf("month").format("YYYY-MM-DD");
  }
  const getPrevMonthStartNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).subtract(1, "months").startOf("month");
    }
    return moment(params).tz(localTimeZone).subtract(1, "months").startOf("month");
  }
  const getPrevMonthStartFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).subtract(1, "months").startOf("month").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone).subtract(1, "months").startOf("month").format("YYYY-MM-DD");
  }
  const getPrevMonthEndNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).subtract(1, "months").endOf("month");
    }
    return moment(params).tz(localTimeZone).subtract(1, "months").endOf("month");
  }
  const getPrevMonthEndFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).subtract(1, "months").endOf("month").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone).subtract(1, "months").endOf("month").format("YYYY-MM-DD");
  }
  const getNextMonthStartNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).add(1, "months").startOf("month");
    }
    return moment(params).tz(localTimeZone).add(1, "months").startOf("month");
  }
  const getNextMonthStartFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).add(1, "months").startOf("month").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone).add(1, "months").startOf("month").format("YYYY-MM-DD");
  }
  const getNextMonthEndNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).add(1, "months").endOf("month");
    }
    return moment(params).tz(localTimeZone).add(1, "months").endOf("month");
  }
  const getNextMonthEndFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).add(1, "months").endOf("month").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone).add(1, "months").endOf("month").format("YYYY-MM-DD");
  }

  // 4. year ---------------------------------------------------------------------------------------
  const getYearStartNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).startOf("year");
    }
    return moment(params).tz(localTimeZone).startOf("year");
  }
  const getYearStartFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).startOf("year").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone).startOf("year").format("YYYY-MM-DD");
  }
  const getYearEndNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).endOf("year");
    }
    return moment(params).tz(localTimeZone).endOf("year");
  }
  const getYearEndFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).endOf("year").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone).endOf("year").format("YYYY-MM-DD");
  }
  const getPrevYearStartNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).subtract(1, "years").startOf("year");
    }
    return moment(params).tz(localTimeZone).subtract(1, "years").startOf("year");
  }
  const getPrevYearStartFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).subtract(1, "years").startOf("year").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone).subtract(1, "years").startOf("year").format("YYYY-MM-DD");
  }
  const getPrevYearEndNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).subtract(1, "years").endOf("year");
    }
    return moment(params).tz(localTimeZone).subtract(1, "years").endOf("year");
  }
  const getPrevYearEndFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).subtract(1, "years").endOf("year").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone).subtract(1, "years").endOf("year").format("YYYY-MM-DD");
  }
  const getNextYearStartNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).add(1, "years").startOf("year");
    }
    return moment(params).tz(localTimeZone).add(1, "years").startOf("year");
  }
  const getNextYearStartFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).add(1, "years").startOf("year").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone).add(1, "years").startOf("year").format("YYYY-MM-DD");
  }
  const getNextYearEndNotFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).add(1, "years").endOf("year");
    }
    return moment(params).tz(localTimeZone).add(1, "years").endOf("year");
  }
  const getNextYearEndFmt = (params: any) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone).add(1, "years").endOf("year").format("YYYY-MM-DD");
    }
    return moment(params).tz(localTimeZone).add(1, "years").endOf("year").format("YYYY-MM-DD");
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
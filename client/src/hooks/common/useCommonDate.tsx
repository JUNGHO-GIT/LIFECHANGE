// useCommonDate.tsx

import { useCommonValue } from "@importHooks";
import { moment, type Moment } from "@importLibs";

// -------------------------------------------------------------------------------------------------
export const useCommonDate = () => {

	// -----------------------------------------------------------------------------------------------
	// 1. common
	// -----------------------------------------------------------------------------------------------
  const { localTimeZone } = useCommonValue();

	// -----------------------------------------------------------------------------------------------
  // 2. helper
	// -----------------------------------------------------------------------------------------------
	const getMoment = (params?: Moment | Date | string) => {
    if (!params || params === "0000-00-00") {
      return moment();
    }
    return moment(new Date(params as string));
	}
  const createMomentWithTimezone = (params?: Moment | Date | string) => {
    if (!params || params === "0000-00-00") {
      return moment().tz(localTimeZone);
    }
    return moment(new Date(params as string)).tz(localTimeZone);
  }
  const createDateFunction = (modifier?: (m: moment.Moment) => moment.Moment) => {
    return function(params?: Moment | Date | string) {
      const m = createMomentWithTimezone(params);
      return modifier ? modifier(m) : m;
    };
  }
  const createDateFunctionWithFormat = (modifier?: (m: moment.Moment) => moment.Moment) => {
    return (params?: Moment | Date | string) => {
      const m = createMomentWithTimezone(params);
      const result = modifier ? modifier(m) : m;
      return result.format("YYYY-MM-DD");
    };
  }

	// -----------------------------------------------------------------------------------------------
  // 3. not fmt
	// -----------------------------------------------------------------------------------------------
  const getDayNotFmt = createDateFunction();
  const getDayStartNotFmt = createDateFunction(m => m.startOf("day"));
  const getDayEndNotFmt = createDateFunction(m => m.endOf("day"));
  const getPrevDayStartNotFmt = createDateFunction(m => m.subtract(1, "days").startOf("day"));
  const getPrevDayEndNotFmt = createDateFunction(m => m.subtract(1, "days").endOf("day"));
  const getNextDayStartNotFmt = createDateFunction(m => m.add(1, "days").startOf("day"));
  const getNextDayEndNotFmt = createDateFunction(m => m.add(1, "days").endOf("day"));
  const getWeekStartNotFmt = createDateFunction(m => m.startOf("isoWeek"));
  const getWeekEndNotFmt = createDateFunction(m => m.endOf("isoWeek"));
  const getPrevWeekStartNotFmt = createDateFunction(m => m.subtract(1, "weeks").startOf("isoWeek"));
  const getPrevWeekEndNotFmt = createDateFunction(m => m.subtract(1, "weeks").endOf("isoWeek"));
  const getNextWeekStartNotFmt = createDateFunction(m => m.add(1, "weeks").startOf("isoWeek"));
  const getNextWeekEndNotFmt = createDateFunction(m => m.add(1, "weeks").endOf("isoWeek"));
  const getMonthStartNotFmt = createDateFunction(m => m.startOf("month"));
  const getMonthEndNotFmt = createDateFunction(m => m.endOf("month"));
  const getPrevMonthStartNotFmt = createDateFunction(m => m.subtract(1, "months").startOf("month"));
  const getPrevMonthEndNotFmt = createDateFunction(m => m.subtract(1, "months").endOf("month"));
  const getNextMonthStartNotFmt = createDateFunction(m => m.add(1, "months").startOf("month"));
  const getNextMonthEndNotFmt = createDateFunction(m => m.add(1, "months").endOf("month"));
  const getYearStartNotFmt = createDateFunction(m => m.startOf("year"));
  const getYearEndNotFmt = createDateFunction(m => m.endOf("year"));
  const getPrevYearStartNotFmt = createDateFunction(m => m.subtract(1, "years").startOf("year"));
  const getPrevYearEndNotFmt = createDateFunction(m => m.subtract(1, "years").endOf("year"));
  const getNextYearStartNotFmt = createDateFunction(m => m.add(1, "years").startOf("year"));
  const getNextYearEndNotFmt = createDateFunction(m => m.add(1, "years").endOf("year"));

	// -----------------------------------------------------------------------------------------------
  // 4. fmt
	// -----------------------------------------------------------------------------------------------
  const getDayFmt = createDateFunctionWithFormat();
  const getDayStartFmt = createDateFunctionWithFormat(m => m.startOf("day"));
  const getDayEndFmt = createDateFunctionWithFormat(m => m.endOf("day"));
  const getPrevDayStartFmt = createDateFunctionWithFormat(m => m.subtract(1, "days").startOf("day"));
  const getPrevDayEndFmt = createDateFunctionWithFormat(m => m.subtract(1, "days").endOf("day"));
  const getNextDayStartFmt = createDateFunctionWithFormat(m => m.add(1, "days").startOf("day"));
  const getNextDayEndFmt = createDateFunctionWithFormat(m => m.add(1, "days").endOf("day"));
  const getWeekStartFmt = createDateFunctionWithFormat(m => m.startOf("isoWeek"));
  const getWeekEndFmt = createDateFunctionWithFormat(m => m.endOf("isoWeek"));
  const getPrevWeekStartFmt = createDateFunctionWithFormat(m => m.subtract(1, "weeks").startOf("isoWeek"));
  const getPrevWeekEndFmt = createDateFunctionWithFormat(m => m.subtract(1, "weeks").endOf("isoWeek"));
  const getNextWeekStartFmt = createDateFunctionWithFormat(m => m.add(1, "weeks").startOf("isoWeek"));
  const getNextWeekEndFmt = createDateFunctionWithFormat(m => m.add(1, "weeks").endOf("isoWeek"));
  const getMonthStartFmt = createDateFunctionWithFormat(m => m.startOf("month"));
  const getMonthEndFmt = createDateFunctionWithFormat(m => m.endOf("month"));
  const getPrevMonthStartFmt = createDateFunctionWithFormat(m => m.subtract(1, "months").startOf("month"));
  const getPrevMonthEndFmt = createDateFunctionWithFormat(m => m.subtract(1, "months").endOf("month"));
  const getNextMonthStartFmt = createDateFunctionWithFormat(m => m.add(1, "months").startOf("month"));
  const getNextMonthEndFmt = createDateFunctionWithFormat(m => m.add(1, "months").endOf("month"));
  const getYearStartFmt = createDateFunctionWithFormat(m => m.startOf("year"));
  const getYearEndFmt = createDateFunctionWithFormat(m => m.endOf("year"));
  const getPrevYearStartFmt = createDateFunctionWithFormat(m => m.subtract(1, "years").startOf("year"));
  const getPrevYearEndFmt = createDateFunctionWithFormat(m => m.subtract(1, "years").endOf("year"));
  const getNextYearStartFmt = createDateFunctionWithFormat(m => m.add(1, "years").startOf("year"));
  const getNextYearEndFmt = createDateFunctionWithFormat(m => m.add(1, "years").endOf("year"));

	// -----------------------------------------------------------------------------------------------
	// 5. return
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
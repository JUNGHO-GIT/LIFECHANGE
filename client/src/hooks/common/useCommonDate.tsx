// useCommonDate.tsx

import { useCallback } from "@exportReacts";
import { useCommonValue } from "@exportHooks";
import { moment, type Moment } from "@exportLibs";

// -------------------------------------------------------------------------------------------------
export const useCommonDate = () => {

	// 1. common ------------------------------------------------------------------------------------
	const { localTimeZone } = useCommonValue();

	// 2. helper -------------------------------------------------------------------------------------
	const getMoment = useCallback((params?: Moment | Date | string) => {
		return (!params || params === "0000-00-00") ? moment() : moment(new Date(params as string));
	}, []);

	const createMomentWithTimezone = useCallback((params?: Moment | Date | string) => {
		return (!params || params === "0000-00-00") ?
			moment().tz(localTimeZone) :
			moment(new Date(params as string)).tz(localTimeZone);
	}, [localTimeZone]);

	const createDateFunction = useCallback((modifier?: (m: moment.Moment) => moment.Moment) => {
		return (params?: Moment | Date | string) => {
			const m = createMomentWithTimezone(params);
			return modifier ? modifier(m) : m;
		};
	}, [createMomentWithTimezone]);

	const createDateFunctionWithFormat = useCallback((modifier?: (m: moment.Moment) => moment.Moment) => {
		return (params?: Moment | Date | string) => {
			const m = createMomentWithTimezone(params);
			const result = modifier ? modifier(m) : m;
			return result.format("YYYY-MM-DD");
		};
	}, [createMomentWithTimezone]);

	// 10. return ----------------------------------------------------------------------------------
	return {

		// Base Functions
		getMoment,

		// Day Functions (Not Formatted)
		getDayNotFmt: createDateFunction(),
		getDayStartNotFmt: createDateFunction(m => m.startOf("day")),
		getDayEndNotFmt: createDateFunction(m => m.endOf("day")),
		getPrevDayStartNotFmt: createDateFunction(m => m.subtract(1, "days").startOf("day")),
		getPrevDayEndNotFmt: createDateFunction(m => m.subtract(1, "days").endOf("day")),
		getNextDayStartNotFmt: createDateFunction(m => m.add(1, "days").startOf("day")),
		getNextDayEndNotFmt: createDateFunction(m => m.add(1, "days").endOf("day")),

		// Day Functions (Formatted)
		getDayFmt: createDateFunctionWithFormat(),
		getDayStartFmt: createDateFunctionWithFormat(m => m.startOf("day")),
		getDayEndFmt: createDateFunctionWithFormat(m => m.endOf("day")),
		getPrevDayStartFmt: createDateFunctionWithFormat(m => m.subtract(1, "days").startOf("day")),
		getPrevDayEndFmt: createDateFunctionWithFormat(m => m.subtract(1, "days").endOf("day")),
		getNextDayStartFmt: createDateFunctionWithFormat(m => m.add(1, "days").startOf("day")),
		getNextDayEndFmt: createDateFunctionWithFormat(m => m.add(1, "days").endOf("day")),

		// Week Functions (Not Formatted)
		getWeekStartNotFmt: createDateFunction(m => m.startOf("isoWeek")),
		getWeekEndNotFmt: createDateFunction(m => m.endOf("isoWeek")),
		getPrevWeekStartNotFmt: createDateFunction(m => m.subtract(1, "weeks").startOf("isoWeek")),
		getPrevWeekEndNotFmt: createDateFunction(m => m.subtract(1, "weeks").endOf("isoWeek")),
		getNextWeekStartNotFmt: createDateFunction(m => m.add(1, "weeks").startOf("isoWeek")),
		getNextWeekEndNotFmt: createDateFunction(m => m.add(1, "weeks").endOf("isoWeek")),

		// Week Functions (Formatted)
		getWeekStartFmt: createDateFunctionWithFormat(m => m.startOf("isoWeek")),
		getWeekEndFmt: createDateFunctionWithFormat(m => m.endOf("isoWeek")),
		getPrevWeekStartFmt: createDateFunctionWithFormat(m => m.subtract(1, "weeks").startOf("isoWeek")),
		getPrevWeekEndFmt: createDateFunctionWithFormat(m => m.subtract(1, "weeks").endOf("isoWeek")),
		getNextWeekStartFmt: createDateFunctionWithFormat(m => m.add(1, "weeks").startOf("isoWeek")),
		getNextWeekEndFmt: createDateFunctionWithFormat(m => m.add(1, "weeks").endOf("isoWeek")),

		// Month Functions (Not Formatted)
		getMonthStartNotFmt: createDateFunction(m => m.startOf("month")),
		getMonthEndNotFmt: createDateFunction(m => m.endOf("month")),
		getPrevMonthStartNotFmt: createDateFunction(m => m.subtract(1, "months").startOf("month")),
		getPrevMonthEndNotFmt: createDateFunction(m => m.subtract(1, "months").endOf("month")),
		getNextMonthStartNotFmt: createDateFunction(m => m.add(1, "months").startOf("month")),
		getNextMonthEndNotFmt: createDateFunction(m => m.add(1, "months").endOf("month")),

		// Month Functions (Formatted)
		getMonthStartFmt: createDateFunctionWithFormat(m => m.startOf("month")),
		getMonthEndFmt: createDateFunctionWithFormat(m => m.endOf("month")),
		getPrevMonthStartFmt: createDateFunctionWithFormat(m => m.subtract(1, "months").startOf("month")),
		getPrevMonthEndFmt: createDateFunctionWithFormat(m => m.subtract(1, "months").endOf("month")),
		getNextMonthStartFmt: createDateFunctionWithFormat(m => m.add(1, "months").startOf("month")),
		getNextMonthEndFmt: createDateFunctionWithFormat(m => m.add(1, "months").endOf("month")),

		// Year Functions (Not Formatted)
		getYearStartNotFmt: createDateFunction(m => m.startOf("year")),
		getYearEndNotFmt: createDateFunction(m => m.endOf("year")),
		getPrevYearStartNotFmt: createDateFunction(m => m.subtract(1, "years").startOf("year")),
		getPrevYearEndNotFmt: createDateFunction(m => m.subtract(1, "years").endOf("year")),
		getNextYearStartNotFmt: createDateFunction(m => m.add(1, "years").startOf("year")),
		getNextYearEndNotFmt: createDateFunction(m => m.add(1, "years").endOf("year")),

		// Year Functions (Formatted)
		getYearStartFmt: createDateFunctionWithFormat(m => m.startOf("year")),
		getYearEndFmt: createDateFunctionWithFormat(m => m.endOf("year")),
		getPrevYearStartFmt: createDateFunctionWithFormat(m => m.subtract(1, "years").startOf("year")),
		getPrevYearEndFmt: createDateFunctionWithFormat(m => m.subtract(1, "years").endOf("year")),
		getNextYearStartFmt: createDateFunctionWithFormat(m => m.add(1, "years").startOf("year")),
		getNextYearEndFmt: createDateFunctionWithFormat(m => m.add(1, "years").endOf("year")),
	};
};
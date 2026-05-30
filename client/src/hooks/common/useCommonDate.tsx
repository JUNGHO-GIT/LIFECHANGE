/**
 * @file useCommonDate.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { useCommonValue as usCmmnVal } from "@exportHooks";
import { type Moment, moment } from "@exportLibs";
import { useCallback } from "@exportReacts";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const usCmmnDt = () => {
	// 1. common ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	const { localTimeZone: lclTmZn } = usCmmnVal();

	// 2. helper ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const getMoment = useCallback(
		(params?: Moment | Date | string) =>
			!params || params === `0000-00-00`
				? moment()
				: moment(new Date(params as string)),
		[],
	);

	const crtMmWtTm = useCallback(
		(params?: Moment | Date | string) =>
			!params || params === `0000-00-00`
				? moment().tz(lclTmZn)
				: moment(new Date(params as string)).tz(lclTmZn),
		[lclTmZn],
	);

	const crtDtFn = useCallback(
		(modifier?: (_m: moment.Moment) => moment.Moment) =>
			(params?: Moment | Date | string) => {
				const m = crtMmWtTm(params);
				return modifier ? modifier(m) : m;
			},
		[crtMmWtTm],
	);

	const crtDtFnWtFr = useCallback(
		(modifier?: (_m: moment.Moment) => moment.Moment) =>
			(params?: Moment | Date | string) => {
				const m = crtMmWtTm(params);
				const result = modifier ? modifier(m) : m;
				return result.format(`YYYY-MM-DD`);
			},
		[crtMmWtTm],
	);

	// 10. return ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	return {
		// Base Functions
		getMoment: getMoment,

		// Day Functions (Not Formatted)
		getDayNotFmt: crtDtFn(),
		getDayStartNotFmt: crtDtFn((m) => m.startOf(`day`)),
		getDayEndNotFmt: crtDtFn((m) => m.endOf(`day`)),
		getPrevDayStartNotFmt: crtDtFn((m) =>
			m.subtract(1, `days`).startOf(`day`),
		),
		getPrevDayEndNotFmt: crtDtFn((m) =>
			m.subtract(1, `days`).endOf(`day`),
		),
		getNextDayStartNotFmt: crtDtFn((m) =>
			m.add(1, `days`).startOf(`day`),
		),
		getNextDayEndNotFmt: crtDtFn((m) =>
			m.add(1, `days`).endOf(`day`),
		),

		// Day Functions (Formatted)
		getDayFmt: crtDtFnWtFr(),
		getDayStartFmt: crtDtFnWtFr((m) => m.startOf(`day`)),
		getDayEndFmt: crtDtFnWtFr((m) => m.endOf(`day`)),
		getPrevDayStartFmt: crtDtFnWtFr((m) =>
			m.subtract(1, `days`).startOf(`day`),
		),
		getPrevDayEndFmt: crtDtFnWtFr((m) =>
			m.subtract(1, `days`).endOf(`day`),
		),
		getNextDayStartFmt: crtDtFnWtFr((m) =>
			m.add(1, `days`).startOf(`day`),
		),
		getNextDayEndFmt: crtDtFnWtFr((m) =>
			m.add(1, `days`).endOf(`day`),
		),

		// Week Functions (Not Formatted)
		getWeekStartNotFmt: crtDtFn((m) => m.startOf(`isoWeek`)),
		getWeekEndNotFmt: crtDtFn((m) => m.endOf(`isoWeek`)),
		getPrevWeekStartNotFmt: crtDtFn((m) =>
			m.subtract(1, `weeks`).startOf(`isoWeek`),
		),
		getPrevWeekEndNotFmt: crtDtFn((m) =>
			m.subtract(1, `weeks`).endOf(`isoWeek`),
		),
		getNextWeekStartNotFmt: crtDtFn((m) =>
			m.add(1, `weeks`).startOf(`isoWeek`),
		),
		getNextWeekEndNotFmt: crtDtFn((m) =>
			m.add(1, `weeks`).endOf(`isoWeek`),
		),

		// Week Functions (Formatted)
		getWeekStartFmt: crtDtFnWtFr((m) => m.startOf(`isoWeek`)),
		getWeekEndFmt: crtDtFnWtFr((m) => m.endOf(`isoWeek`)),
		getPrevWeekStartFmt: crtDtFnWtFr((m) =>
			m.subtract(1, `weeks`).startOf(`isoWeek`),
		),
		getPrevWeekEndFmt: crtDtFnWtFr((m) =>
			m.subtract(1, `weeks`).endOf(`isoWeek`),
		),
		getNextWeekStartFmt: crtDtFnWtFr((m) =>
			m.add(1, `weeks`).startOf(`isoWeek`),
		),
		getNextWeekEndFmt: crtDtFnWtFr((m) =>
			m.add(1, `weeks`).endOf(`isoWeek`),
		),

		// Month Functions (Not Formatted)
		getMonthStartNotFmt: crtDtFn((m) => m.startOf(`month`)),
		getMonthEndNotFmt: crtDtFn((m) => m.endOf(`month`)),
		getPrevMonthStartNotFmt: crtDtFn((m) =>
			m.subtract(1, `months`).startOf(`month`),
		),
		getPrevMonthEndNotFmt: crtDtFn((m) =>
			m.subtract(1, `months`).endOf(`month`),
		),
		getNextMonthStartNotFmt: crtDtFn((m) =>
			m.add(1, `months`).startOf(`month`),
		),
		getNextMonthEndNotFmt: crtDtFn((m) =>
			m.add(1, `months`).endOf(`month`),
		),

		// Month Functions (Formatted)
		getMonthStartFmt: crtDtFnWtFr((m) => m.startOf(`month`)),
		getMonthEndFmt: crtDtFnWtFr((m) => m.endOf(`month`)),
		getPrevMonthStartFmt: crtDtFnWtFr((m) =>
			m.subtract(1, `months`).startOf(`month`),
		),
		getPrevMonthEndFmt: crtDtFnWtFr((m) =>
			m.subtract(1, `months`).endOf(`month`),
		),
		getNextMonthStartFmt: crtDtFnWtFr((m) =>
			m.add(1, `months`).startOf(`month`),
		),
		getNextMonthEndFmt: crtDtFnWtFr((m) =>
			m.add(1, `months`).endOf(`month`),
		),

		// Year Functions (Not Formatted)
		getYearStartNotFmt: crtDtFn((m) => m.startOf(`year`)),
		getYearEndNotFmt: crtDtFn((m) => m.endOf(`year`)),
		getPrevYearStartNotFmt: crtDtFn((m) =>
			m.subtract(1, `years`).startOf(`year`),
		),
		getPrevYearEndNotFmt: crtDtFn((m) =>
			m.subtract(1, `years`).endOf(`year`),
		),
		getNextYearStartNotFmt: crtDtFn((m) =>
			m.add(1, `years`).startOf(`year`),
		),
		getNextYearEndNotFmt: crtDtFn((m) =>
			m.add(1, `years`).endOf(`year`),
		),

		// Year Functions (Formatted)
		getYearStartFmt: crtDtFnWtFr((m) => m.startOf(`year`)),
		getYearEndFmt: crtDtFnWtFr((m) => m.endOf(`year`)),
		getPrevYearStartFmt: crtDtFnWtFr((m) =>
			m.subtract(1, `years`).startOf(`year`),
		),
		getPrevYearEndFmt: crtDtFnWtFr((m) =>
			m.subtract(1, `years`).endOf(`year`),
		),
		getNextYearStartFmt: crtDtFnWtFr((m) =>
			m.add(1, `years`).startOf(`year`),
		),
		getNextYearEndFmt: crtDtFnWtFr((m) =>
			m.add(1, `years`).endOf(`year`),
		),
	};
};

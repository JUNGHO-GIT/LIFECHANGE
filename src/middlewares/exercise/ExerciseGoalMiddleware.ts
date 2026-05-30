/**
 * @file ExerciseGoalMiddleware.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { differenceInMinutes as dffrInMnts } from "date-fns";

// 1. list ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const list = async (object: any) => {
	// 0. calcOverTenMillion ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const clcOvrTnMlln = (param: string) => {
		let finalResult: string = ``;

		if (
			!param ||
			param === `0` ||
			param === `00:00` ||
			String(param).includes(`:`)
		) {
			finalResult = param;
		}
		// 12300000 -> 1.23M / 10000000 -> 10M
		else if (Number(param) >= 10_000_000) {
			finalResult = `${Number.parseFloat((Number(param) / 1_000_000).toFixed(2)).toString()}M`;
		} else {
			finalResult = Number.parseFloat(Number(param).toFixed(2)).toString();
		}

		return finalResult;
	};

	// 0. calcNonValueColor ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	const clcNnValClr = (param: string) => {
		let finalResult: string = ``;

		if (!param) {
			finalResult = param;
		} else if (param === `0` || param === `00:00`) {
			finalResult = `grey`;
		} else {
			finalResult = `light-black`;
		}

		return finalResult;
	};

	// 1. compareValue ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const compareValue = (goalParam: string, recordParam: string) => {
		const goal: number = Number.parseFloat(goalParam);
		const record: number = Number.parseFloat(recordParam);
		let finalResult: string = ``;

		finalResult =
			goal > record
				? `-${Number.parseFloat(Math.abs(goal - record).toFixed(2)).toString()}`
				: `+${Number.parseFloat(Math.abs(record - goal).toFixed(2)).toString()}`;

		return finalResult;
	};

	// 2. compareTime ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	const compareTime = (goalParam: string, recordParam: string) => {
		const goal: string = goalParam;
		const record: string = recordParam;
		let finalResult: string = ``;

		const goalDate: Date = new Date(`1970-01-01T${goal}:00Z`);
		const recordDate: Date = new Date(`1970-01-01T${record}:00Z`);

		let diff: number = dffrInMnts(recordDate, goalDate);

		// 시간 차이가 음수인 경우 절대값 적용
		if (diff < 0) {
			diff = Math.abs(diff);
		}

		const hours: number = Math.floor(diff / 60);
		const minutes: number = diff % 60;

		finalResult =
			goalDate > recordDate
				? `-${hours.toString().padStart(2, `0`)}:${minutes.toString().padStart(2, `0`)}`
				: `+${hours.toString().padStart(2, `0`)}:${minutes.toString().padStart(2, `0`)}`;

		return finalResult;
	};

	// 4. calcDiffColor ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	const clcDffClr = (
		goalParam: string,
		recordParam: string,
		extra: string,
	) => {
		const goal: number = Number.parseFloat(goalParam);
		const record: number = Number.parseFloat(recordParam);
		let percent: number = 0;
		let finalResult: string = ``;

		// 1. count
		if (extra === `count`) {
			percent = Math.abs(((goal - record) / goal) * 100);

			// 1. - 1%
			if (percent > 0 && percent <= 1) {
				finalResult += ` firstScore`;
			}
			// 2. 1% - 10%
			else if (percent > 1 && percent <= 10) {
				finalResult += ` secondScore`;
			}
			// 3. 10% - 30%
			else if (percent > 10 && percent <= 30) {
				finalResult += ` thirdScore`;
			}
			// 4. 30% - 50%
			else if (percent > 30 && percent <= 50) {
				finalResult += ` fourthScore`;
			}
			// 5. 50% -
			else {
				finalResult += ` fifthScore`;
			}
		}

		// 2. volume
		else if (extra === `volume`) {
			percent = Math.abs(((goal - record) / goal) * 100);

			// 1. - 1%
			if (percent > 0 && percent <= 1) {
				finalResult += ` firstScore`;
			}
			// 2. 1% - 10%
			else if (percent > 1 && percent <= 10) {
				finalResult += ` secondScore`;
			}
			// 3. 10% - 30%
			else if (percent > 10 && percent <= 30) {
				finalResult += ` thirdScore`;
			}
			// 4. 30% - 50%
			else if (percent > 30 && percent <= 50) {
				finalResult += ` fourthScore`;
			}
			// 5. 50% -
			else {
				finalResult += ` fifthScore`;
			}
		}

		// 3. cardio
		else if (extra === `cardio`) {
			const hoursGoal: number = Number.parseFloat(goalParam?.split(`:`)[0]);
			const hoursRecord: number = Number.parseFloat(recordParam?.split(`:`)[0]);
			const hours: number = Math.abs(hoursGoal - hoursRecord);
			const minutesGoal: number = Number.parseFloat(goalParam?.split(`:`)[1]);
			const mntsRec: number = Number.parseFloat(
				recordParam?.split(`:`)[1],
			);
			const minutes: number = Math.abs(minutesGoal - mntsRec);
			const diffVal: number = hours * 60 + minutes;

			// 1. - 10분
			if (0 <= diffVal && diffVal <= 10) {
				finalResult += ` firstScore`;
			}
			// 2. 10분 - 20분
			else if (10 < diffVal && diffVal <= 20) {
				finalResult += ` secondScore`;
			}
			// 3. 20분 - 40분
			else if (20 < diffVal && diffVal <= 40) {
				finalResult += ` thirdScore`;
			}
			// 4. 40분 - 60분
			else if (40 < diffVal && diffVal <= 60) {
				finalResult += ` fourthScore`;
			}
			// 5. 60분 -
			else {
				finalResult += ` fifthScore`;
			}
		}

		// 4. scale
		else if (extra === `scale`) {
			percent = Math.abs(((goal - record) / goal) * 100);

			// 1. - 1%
			if (percent > 0 && percent <= 1) {
				finalResult += ` firstScore`;
			}
			// 2. 1% - 10%
			else if (percent > 1 && percent <= 10) {
				finalResult += ` secondScore`;
			}
			// 3. 10% - 30%
			else if (percent > 10 && percent <= 30) {
				finalResult += ` thirdScore`;
			}
			// 4. 30% - 50%
			else if (percent > 30 && percent <= 50) {
				finalResult += ` fourthScore`;
			}
			// 5. 50% -
			else {
				finalResult += ` fifthScore`;
			}
		}

		return finalResult;
	};

	// 10. result ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	object?.result?.forEach((item: any) => {
		item.exercise_record_total_count = clcOvrTnMlln(
			item?.exercise_record_total_count,
		);
		item.exercise_record_total_volume = clcOvrTnMlln(
			item?.exercise_record_total_volume,
		);
		item.exercise_record_total_cardio = clcOvrTnMlln(
			item?.exercise_record_total_cardio,
		);
		item.exercise_record_total_scale = clcOvrTnMlln(
			item?.exercise_record_total_scale,
		);

		item.exercise_goal_count = clcOvrTnMlln(item?.exercise_goal_count);
		item.exercise_goal_volume = clcOvrTnMlln(item?.exercise_goal_volume);
		item.exercise_goal_cardio = clcOvrTnMlln(item?.exercise_goal_cardio);
		item.exercise_goal_scale = clcOvrTnMlln(item?.exercise_goal_scale);

		item.exercise_record_total_count_color = clcNnValClr(
			item?.exercise_record_total_count,
		);
		item.exercise_record_total_volume_color = clcNnValClr(
			item?.exercise_record_total_volume,
		);
		item.exercise_record_total_cardio_color = clcNnValClr(
			item?.exercise_record_total_cardio,
		);
		item.exercise_record_total_scale_color = clcNnValClr(
			item?.exercise_record_total_scale,
		);

		item.exercise_goal_count_color = clcNnValClr(
			item?.exercise_goal_count,
		);
		item.exercise_goal_volume_color = clcNnValClr(
			item?.exercise_goal_volume,
		);
		item.exercise_goal_cardio_color = clcNnValClr(
			item?.exercise_goal_cardio,
		);
		item.exercise_goal_scale_color = clcNnValClr(
			item?.exercise_goal_scale,
		);

		item.exercise_record_diff_count = clcOvrTnMlln(
			compareValue(
				item?.exercise_goal_count,
				item?.exercise_record_total_count,
			),
		);
		item.exercise_record_diff_volume = clcOvrTnMlln(
			compareValue(
				item?.exercise_goal_volume,
				item?.exercise_record_total_volume,
			),
		);
		item.exercise_record_diff_cardio = clcOvrTnMlln(
			compareTime(
				item?.exercise_goal_cardio,
				item?.exercise_record_total_cardio,
			),
		);
		item.exercise_record_diff_scale = clcOvrTnMlln(
			compareValue(
				item?.exercise_goal_scale,
				item?.exercise_record_total_scale,
			),
		);

		item.exercise_record_diff_count_color = clcDffClr(
			item?.exercise_goal_count,
			item?.exercise_record_total_count,
			`count`,
		);
		item.exercise_record_diff_volume_color = clcDffClr(
			item?.exercise_goal_volume,
			item?.exercise_record_total_volume,
			`volume`,
		);
		item.exercise_record_diff_cardio_color = clcDffClr(
			item?.exercise_goal_cardio,
			item?.exercise_record_total_cardio,
			`cardio`,
		);
		item.exercise_record_diff_scale_color = clcDffClr(
			item?.exercise_goal_scale,
			item?.exercise_record_total_scale,
			`scale`,
		);
	});

	return object;
};

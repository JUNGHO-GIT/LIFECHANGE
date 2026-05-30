/**
 * @file SleepGoalMiddleware.ts
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

	// 1. compareTime ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	const compareTime = (
		goalParam: string,
		recordParam: string,
		extra: string,
	) => {
		const goal: string = goalParam;
		const record: string = recordParam;
		let diffVal: number = 0;
		let finalResult: string = ``;

		// 1. bedTime, wakeTime
		if (extra === `bedTime` || extra === `wakeTime`) {
			const goalDate = new Date(`1970-01-01T${goal}:00Z`);
			const recordDate = new Date(`1970-01-01T${record}:00Z`);

			diffVal = dffrInMnts(recordDate, goalDate);

			// 차이가 음수인 경우, 절대값을 사용하여 계산
			if (diffVal < 0) {
				diffVal = Math.abs(diffVal);
			}

			// HH:mm 형식으로 결과 반환
			const hours = Math.floor(diffVal / 60);
			const minutes = diffVal % 60;

			finalResult =
				goalDate > recordDate
					? `-${hours.toString().padStart(2, `0`)}:${minutes.toString().padStart(2, `0`)}`
					: `+${hours.toString().padStart(2, `0`)}:${minutes.toString().padStart(2, `0`)}`;
		}
		// 2. sleepTime
		else if (extra === `sleepTime`) {
			const goalDate = new Date(`1970-01-01T${goal}:00Z`);
			const recordDate = new Date(`1970-01-01T${record}:00Z`);

			diffVal = dffrInMnts(recordDate, goalDate);

			// 시간 차이가 음수인 경우 절대값 적용
			if (diffVal < 0) {
				diffVal = Math.abs(diffVal);
			}

			const hours = Math.floor(diffVal / 60);
			const minutes = diffVal % 60;

			finalResult =
				goalDate > recordDate
					? `-${hours.toString().padStart(2, `0`)}:${minutes.toString().padStart(2, `0`)}`
					: `+${hours.toString().padStart(2, `0`)}:${minutes.toString().padStart(2, `0`)}`;
		}

		return finalResult;
	};

	// 4. calcDiffColor ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	const clcDffClr = (
		goalParam: string,
		recordParam: string,
		extra: string,
	) => {
		const goal: string = goalParam;
		const record: string = recordParam;
		let diffVal: number = 0;
		let finalResult: string = ``;

		// 1. bedTime, wakeTime
		if (extra === `bedTime` || extra === `wakeTime`) {
			const goalDate = new Date(`1970-01-01T${goal}:00Z`);
			const recordDate = new Date(`1970-01-01T${record}:00Z`);

			diffVal =
				recordDate < goalDate
					? goalDate.getTime() - recordDate.getTime()
					: recordDate.getTime() - goalDate.getTime();

			// 1. - 10분
			if (0 <= diffVal && diffVal <= 600_000) {
				finalResult += ` firstScore`;
			}
			// 2. 10분 - 20분
			else if (600_000 < diffVal && diffVal <= 1_200_000) {
				finalResult += ` secondScore`;
			}
			// 3. 20분 - 40분
			else if (1_200_000 < diffVal && diffVal <= 2_400_000) {
				finalResult += ` thirdScore`;
			}
			// 4. 40분 - 60분
			else if (2_400_000 < diffVal && diffVal <= 3_600_000) {
				finalResult += ` fourthScore`;
			}
			// 5. 60분 -
			else {
				finalResult += ` fifthScore`;
			}
		}
		// 2. sleepTime
		else if (extra === `sleepTime`) {
			const hoursGoal = Number.parseFloat(goalParam?.split(`:`)[0]);
			const hoursRecord = Number.parseFloat(recordParam?.split(`:`)[0]);
			const hours = Math.abs(hoursGoal - hoursRecord);
			const minutesGoal = Number.parseFloat(goalParam?.split(`:`)[1]);
			const mntsRec = Number.parseFloat(recordParam?.split(`:`)[1]);
			const minutes = Math.abs(minutesGoal - mntsRec);

			diffVal = hours * 60 + minutes;

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

		return finalResult;
	};

	// 10. return ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	object?.result?.forEach((item: any) => {
		item.sleep_record_bedTime = clcOvrTnMlln(item?.sleep_record_bedTime);
		item.sleep_record_wakeTime = clcOvrTnMlln(
			item?.sleep_record_wakeTime,
		);
		item.sleep_record_sleepTime = clcOvrTnMlln(
			item?.sleep_record_sleepTime,
		);

		item.sleep_goal_bedTime = clcOvrTnMlln(item?.sleep_goal_bedTime);
		item.sleep_goal_wakeTime = clcOvrTnMlln(item?.sleep_goal_wakeTime);
		item.sleep_goal_sleepTime = clcOvrTnMlln(item?.sleep_goal_sleepTime);

		item.sleep_record_bedTime_color = clcNnValClr(
			item?.sleep_record_bedTime,
		);
		item.sleep_record_wakeTime_color = clcNnValClr(
			item?.sleep_record_wakeTime,
		);
		item.sleep_record_sleepTime_color = clcNnValClr(
			item?.sleep_record_sleepTime,
		);

		item.sleep_goal_bedTime_color = clcNnValClr(item?.sleep_goal_bedTime);
		item.sleep_goal_wakeTime_color = clcNnValClr(
			item?.sleep_goal_wakeTime,
		);
		item.sleep_goal_sleepTime_color = clcNnValClr(
			item?.sleep_goal_sleepTime,
		);

		item.sleep_record_diff_bedTime = clcOvrTnMlln(
			compareTime(
				item?.sleep_goal_bedTime,
				item?.sleep_record_bedTime,
				`bedTime`,
			),
		);
		item.sleep_record_diff_wakeTime = clcOvrTnMlln(
			compareTime(
				item?.sleep_goal_wakeTime,
				item?.sleep_record_wakeTime,
				`wakeTime`,
			),
		);
		item.sleep_record_diff_sleepTime = clcOvrTnMlln(
			compareTime(
				item?.sleep_goal_sleepTime,
				item?.sleep_record_sleepTime,
				`sleepTime`,
			),
		);

		item.sleep_record_diff_bedTime_color = clcDffClr(
			item?.sleep_goal_bedTime,
			item?.sleep_record_bedTime,
			`bedTime`,
		);
		item.sleep_record_diff_wakeTime_color = clcDffClr(
			item?.sleep_goal_wakeTime,
			item?.sleep_record_wakeTime,
			`wakeTime`,
		);
		item.sleep_record_diff_sleepTime_color = clcDffClr(
			item?.sleep_goal_sleepTime,
			item?.sleep_record_sleepTime,
			`sleepTime`,
		);
	});

	return object;
};

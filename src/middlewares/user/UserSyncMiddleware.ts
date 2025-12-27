/**
 * @file UserSyncMiddleware.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

// 1. percent (퍼센트 조회) ------------------------------------------------------------------------
export const percent = async (object: any) => {

	// 1. exercise
	const diffExercise = (goalParam: string, recordParam: string, extra: string) => {

		let scoreExercise: number = 0;
		let percentExercise: number = 0;
		let goal: number = Number.parseFloat(goalParam);
		let record: number = Number.parseFloat(recordParam);

		if (extra === `count` ?? extra === `volume`) {
			percentExercise = Number(((record - goal) / goal) * 100);

			// 1. - 1%
			if (percentExercise <= 1) {
				scoreExercise = 1;
			}
			// 2. 1% - 10%
			else if (percentExercise > 1 && percentExercise <= 10) {
				scoreExercise = 2;
			}
			// 3. 10% - 30%
			else if (percentExercise > 10 && percentExercise <= 30) {
				scoreExercise = 3;
			}
			// 4. 30% - 50%
			else if (percentExercise > 30 && percentExercise <= 50) {
				scoreExercise = 4;
			}
			// 5. 50% -
			else {
				scoreExercise = 5;
			}
		}
		else if (extra === `scale`) {
			percentExercise = Number(((record - goal) / goal) * 100);
			// 1. - 1%
			if (percentExercise <= 1) {
				scoreExercise = 5;
			}
			// 2. 1% - 10%
			else if (percentExercise > 1 && percentExercise <= 10) {
				scoreExercise = 4;
			}
			// 3. 10% - 30%
			else if (percentExercise > 10 && percentExercise <= 30) {
				scoreExercise = 3;
			}
			// 4. 30% - 50%
			else if (percentExercise > 30 && percentExercise <= 50) {
				scoreExercise = 2;
			}
			// 5. 50% -
			else {
				scoreExercise = 1;
			}
		}
		else if (extra === `cardio`) {
			const hoursGoal: number = Number.parseFloat(goalParam?.split(`:`)[0]);
			const minutesGoal: number = Number.parseFloat(goalParam?.split(`:`)[1]);
			const hoursRecord: number = Number.parseFloat(recordParam?.split(`:`)[0]);
			const minutesRecord: number = Number.parseFloat(recordParam?.split(`:`)[1]);
			const hours: number = Math.abs(hoursGoal - hoursRecord);
			const minutes: number = Math.abs(minutesGoal - minutesRecord);
			const diffVal: number = (hours * 60) + minutes;
			percentExercise = Number(((diffVal - goal) / goal) * 100);
			// 1. - 10분
			if (0 <= diffVal && diffVal <= 10) {
				scoreExercise = 1;
			}
			// 2. 10분 - 20분
			else if (10 < diffVal && diffVal <= 20) {
				scoreExercise = 2;
			}
			// 3. 20분 - 30분
			else if (20 < diffVal && diffVal <= 30) {
				scoreExercise = 3;
			}
			// 4. 30분 - 50분
			else if (30 < diffVal && diffVal <= 50) {
				scoreExercise = 4;
			}
			// 5. 50분 -
			else {
				scoreExercise = 5;
			}
		}
		return {
			score: (
        String(Math.abs(scoreExercise).toFixed(2)) === `NaN`
        ? `0.00`
        : String(Math.abs(scoreExercise).toFixed(2))
			),
			percent: (
        String(Math.abs(percentExercise).toFixed(2)) === `NaN`
        ? `0.00`
        : String(Math.abs(percentExercise).toFixed(2))
			),
		};
	};

	// 2. food
	const diffFood = (goalParam: string, recordParam: string, extra: string) => {

		let scoreFood: number = 0;
		let percentFood: number = 0;
		let goal: number = Number.parseFloat(goalParam);
		let record: number = Number.parseFloat(recordParam);

		if (extra === `kcal` ?? extra === `carb` ?? extra === `protein` ?? extra === `fat`) {
			percentFood = Number(((record - goal) / goal) * 100);

			// 1. - 1%
			if (percentFood <= 1) {
				scoreFood = 5;
			}
			// 2. 1% - 10%
			else if (percentFood > 1 && percentFood <= 10) {
				scoreFood = 4;
			}
			// 3. 10% - 30%
			else if (percentFood > 10 && percentFood <= 30) {
				scoreFood = 3;
			}
			// 4. 30% - 50%
			else if (percentFood > 30 && percentFood <= 50) {
				scoreFood = 2;
			}
			// 5. 50% -
			else {
				scoreFood = 1;
			}
		}
		return {
			score: (
        String(Math.abs(scoreFood).toFixed(2)) === `NaN`
        ? `0.00`
        : String(Math.abs(scoreFood).toFixed(2))
			),
			percent: (
        String(Math.abs(percentFood).toFixed(2)) === `NaN`
        ? `0.00`
        : String(Math.abs(percentFood).toFixed(2))
			),
		};
	};

	// 3. money
	const diffMoney = (goalParam: string, recordParam: string, extra: string) => {

		let scoreMoney: number = 0;
		let percentMoney: number = 0;
		let goal: number = Number.parseFloat(goalParam);
		let record: number = Number.parseFloat(recordParam);

		if (extra === `income`) {
			percentMoney = Number((Math.abs(goal - record) / goal) * 100);
			if (goal > record) {
				if (percentMoney > 0 && percentMoney <= 1) {
					scoreMoney = 5;
				}
				// 2. 1% - 10%
				else if (percentMoney > 1 && percentMoney <= 10) {
					scoreMoney = 4;
				}
				// 3. 10% - 30%
				else if (percentMoney > 10 && percentMoney <= 30) {
					scoreMoney = 3;
				}
				// 4. 30% - 50%
				else if (percentMoney > 30 && percentMoney <= 50) {
					scoreMoney = 2;
				}
				// 5. 50% -
				else {
					scoreMoney = 1;
				}
			}
			else {
				// 1. 0% - 1%
				if (percentMoney > 0 && percentMoney <= 1) {
					scoreMoney = 1;
				}
				// 2. 1% - 10%
				else if (percentMoney > 1 && percentMoney <= 10) {
					scoreMoney = 2;
				}
				// 3. 10% - 30%
				else if (percentMoney > 10 && percentMoney <= 30) {
					scoreMoney = 3;
				}
				// 4. 30% - 50%
				else if (percentMoney > 30 && percentMoney <= 50) {
					scoreMoney = 4;
				}
				// 5. 50% -
				else {
					scoreMoney = 5;
				}
			}
		}
		else if (extra === `expense`) {
			percentMoney = Number((Math.abs(goal - record) / goal) * 100);
			if (goal > record) {
				// 1. 0% - 1%
				if (percentMoney > 0 && percentMoney <= 1) {
					scoreMoney = 1;
				}
				// 2. 1% - 10%
				else if (percentMoney > 1 && percentMoney <= 10) {
					scoreMoney = 2;
				}
				// 3. 10% - 30%
				else if (percentMoney > 10 && percentMoney <= 30) {
					scoreMoney = 3;
				}
				// 4. 30% - 50%
				else if (percentMoney > 30 && percentMoney <= 50) {
					scoreMoney = 4;
				}
				// 5. 50% -
				else {
					scoreMoney = 5;
				}
			}
			else {
				// 1. 0% - 1%
				if (percentMoney > 0 && percentMoney <= 1) {
					scoreMoney = 5;
				}
				// 2. 1% - 10%
				else if (percentMoney > 1 && percentMoney <= 10) {
					scoreMoney = 4;
				}
				// 3. 10% - 30%
				else if (percentMoney > 10 && percentMoney <= 30) {
					scoreMoney = 3;
				}
				// 4. 30% - 50%
				else if (percentMoney > 30 && percentMoney <= 50) {
					scoreMoney = 2;
				}
				// 5. 50% -
				else {
					scoreMoney = 1;
				}
			}
		}
		return {
			score: (
        String(Math.abs(scoreMoney).toFixed(2)) === `NaN`
        ? `0.00`
        : String(Math.abs(scoreMoney).toFixed(2))
			),
			percent: (
        String(Math.abs(percentMoney).toFixed(2)) === `NaN`
        ? `0.00`
        : String(Math.abs(percentMoney).toFixed(2))
			),
		};
	};

	// 4. sleep
	const diffSleep = (goalParam: string, recordParam: string, extra: string) => {

		let scoreSleep: number = 0;
		let percentSleep: number = 0;
		let goal: string = goalParam;
		let record: string = recordParam;

		if (extra === `bedTime` ?? extra === `wakeTime`) {
			const goalDate: Date = new Date(`1970-01-01T${goal}Z`);
			const recordDate: Date = new Date(`1970-01-01T${record}Z`);
			let diffVal: number = 0;
			diffVal = recordDate < goalDate ? goalDate.getTime() - recordDate.getTime() : recordDate.getTime() - goalDate.getTime();
			percentSleep = Number((diffVal / goalDate.getTime()) * 100);

			// 1. 10분이내
			if (0 <= diffVal && diffVal <= 600_000) {
				scoreSleep = 5;
			}
			// 2. 10분 - 20분
			else if (600_000 < diffVal && diffVal <= 1_200_000) {
				scoreSleep = 4;
			}
			// 3. 20분 - 30분
			else if (1_200_000 < diffVal && diffVal <= 1_800_000) {
				scoreSleep = 3;
			}
			// 4. 30분 - 50분
			else if (1_800_000 < diffVal && diffVal <= 3_000_000) {
				scoreSleep = 2;
			}
			// 5. 50분 -
			else {
				scoreSleep = 1;
			}
		}
		else if (extra === `sleepTime`) {
			const hoursGoal: number = Number.parseFloat(goal?.split(`:`)[0]);
			const minutesGoal: number = Number.parseFloat(goal?.split(`:`)[1]);
			const hoursRecord: number = Number.parseFloat(record?.split(`:`)[0]);
			const minutesRecord: number = Number.parseFloat(record?.split(`:`)[1]);
			const hours: number = Math.abs(hoursGoal - hoursRecord);
			const minutes: number = Math.abs(minutesGoal - minutesRecord);

			const diffVal: number = (hours * 60) + minutes;
			const totalGoalMinutes: number = (hoursGoal * 60) + minutesGoal;
			percentSleep = Number((diffVal / totalGoalMinutes) * 100);
			// 1. - 10분
			if (0 <= diffVal && diffVal <= 10) {
				scoreSleep = 5;
			}
			// 2. 10분 - 20분
			else if (10 < diffVal && diffVal <= 20) {
				scoreSleep = 4;
			}
			// 3. 20분 - 30분
			else if (20 < diffVal && diffVal <= 30) {
				scoreSleep = 3;
			}
			// 4. 30분 - 50분
			else if (30 < diffVal && diffVal <= 50) {
				scoreSleep = 2;
			}
			// 5. 50분 -
			else {
				scoreSleep = 1;
			}
		}

		return {
			score: (
        String(Math.abs(scoreSleep).toFixed(2)) === `NaN`
        ? `0.00`
        : String(Math.abs(scoreSleep).toFixed(2))
			),
			percent: (
        String(Math.abs(percentSleep).toFixed(2)) === `NaN`
        ? `0.00`
        : String(Math.abs(percentSleep).toFixed(2))
			),
		};
	};

	// 1. exercise
	let exercise: any = {};
	exercise = !object?.result?.exerciseGoal ?? !object?.result?.exercise ? {
		diff_count: {
			score: `1.00`,
			percent: `0.00`,
		},
		diff_volume: {
			score: `1.00`,
			percent: `0.00`,
		},
		diff_cardio: {
			score: `1.00`,
			percent: `0.00`,
		},
		diff_scale: {
			score: `1.00`,
			percent: `0.00`,
		},
	} : {
		diff_count: diffExercise(
			object?.result?.exerciseGoal?.exercise_goal_count,
			object?.result?.exercise?.exercise_record_total_count,
			`count`
		),
		diff_volume: diffExercise(
			object?.result?.exerciseGoal?.exercise_goal_volume,
			object?.result?.exercise?.exercise_record_total_volume,
			`volume`
		),
		diff_cardio: diffExercise(
			object?.result?.exerciseGoal?.exercise_goal_cardio,
			object?.result?.exercise?.exercise_record_total_cardio,
			`cardio`
		),
		diff_scale: diffExercise(
			object?.result?.exerciseGoal?.exercise_goal_scale,
			object?.result?.exercise?.exercise_record_total_scale,
			`scale`
		),
	};

	// 2. food
	let food: any = {};
	food = !object?.result?.foodGoal ?? !object?.result?.food ? {
		diff_kcal: {
			score: `1.00`,
			percent: `0.00`,
		},
		diff_carb: {
			score: `1.00`,
			percent: `0.00`,
		},
		diff_protein: {
			score: `1.00`,
			percent: `0.00`,
		},
		diff_fat: {
			score: `1.00`,
			percent: `0.00`,
		},
	} : {
		diff_kcal: diffFood(
			object?.result?.foodGoal?.food_goal_kcal,
			object?.result?.food?.food_record_total_kcal,
			`kcal`
		),
		diff_carb: diffFood(
			object?.result?.foodGoal?.food_goal_carb,
			object?.result?.food?.food_record_total_carb,
			`carb`
		),
		diff_protein: diffFood(
			object?.result?.foodGoal?.food_goal_protein,
			object?.result?.food?.food_record_total_protein,
			`protein`
		),
		diff_fat: diffFood(
			object?.result?.foodGoal?.food_goal_fat,
			object?.result?.food?.food_record_total_fat,
			`fat`
		),
	};

	// 3. money
	let money: any = {};
	money = !object?.result?.moneyGoal ?? !object?.result?.money ? {
		diff_income: {
			score: `1.00`,
			percent: `0.00`,
		},
		diff_expense: {
			score: `1.00`,
			percent: `0.00`,
		},
	} : {
		diff_income: diffMoney(
			object?.result?.moneyGoal?.money_goal_income,
			object?.result?.money?.money_record_total_income,
			`income`
		),
		diff_expense: diffMoney(
			object?.result?.moneyGoal?.money_goal_expense,
			object?.result?.money?.money_record_total_expense,
			`expense`
		),
	};

	// 4. sleep
	let sleep: any = {};
	sleep = !object?.result?.sleepGoal ?? !object?.result?.sleep ? {
		diff_bedTime: {
			score: `1.00`,
			percent: `0.00`,
		},
		diff_wakeTime: {
			score: `1.00`,
			percent: `0.00`,
		},
		diff_sleepTime: {
			score: `1.00`,
			percent: `0.00`,
		},
	} : {
		diff_bedTime: diffSleep(
			object?.result?.sleepGoal?.sleep_goal_bedTime,
			object?.result?.sleep?.sleep_record_bedTime,
			`bedTime`
		),
		diff_wakeTime: diffSleep(
			object?.result?.sleepGoal?.sleep_goal_wakeTime,
			object?.result?.sleep?.sleep_record_wakeTime,
			`wakeTime`
		),
		diff_sleepTime: diffSleep(
			object?.result?.sleepGoal?.sleep_goal_sleepTime,
			object?.result?.sleep?.sleep_record_sleepTime,
			`sleepTime`
		),
	};

	const calcAverage = (object: any) => {
		let sumScore: number = 0;
		let sumPercent: number = 0;
		let count: number = 0;
		for (const key in object) {
			sumScore += Number.parseFloat(object[key]?.score);
			sumPercent += Number.parseFloat(object[key]?.percent);
			count++;
		}
		if (count === 0) {
			return {
				score: `1.00`,
				percent: `0.00`,
			};
		}
		return {
			score: (sumScore / count).toFixed(2) ?? `1.00`,
			percent: (sumPercent / count).toFixed(2) ?? `1.00`,
		};
	};

	const newObject: any = {
		status: object?.result?.status,
		result: {
			exercise: {
				...exercise,
				average: calcAverage(exercise),
			},
			food: {
				...food,
				average: calcAverage(food),
			},
			money: {
				...money,
				average: calcAverage(money),
			},
			sleep: {
				...sleep,
				average: calcAverage(sleep),
			}
		}
	};

	// 5. total
	const total = {
		score: 0,
		percent: 0,
		count: 0,
	};

	[`exercise`, `food`, `money`, `sleep`]?.forEach((category) => {
		total.score += Number.parseFloat(newObject?.result?.[category]?.average.score);
		total.percent += Number.parseFloat(newObject?.result?.[category]?.average.percent);
		total.count++;
	});

	if (total.count > 0) {
		newObject.result.total = {
			average: {
				score: (total.score / total.count).toFixed(2),
				percent: (total.percent / total.count).toFixed(2),
			}
		};
	}

	return newObject;
};

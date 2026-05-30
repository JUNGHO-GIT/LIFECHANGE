/**
 * @file UserSyncRepository.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { ExerciseGoal } from "@schemas/exercise/ExerciseGoal";
import { ExerciseRecord as ExerRec2 } from "@schemas/exercise/ExerciseRecord";
import { FoodGoal } from "@schemas/food/FoodGoal";
import { FoodRecord } from "@schemas/food/FoodRecord";
import { MoneyGoal } from "@schemas/money/MoneyGoal";
import { MoneyRecord } from "@schemas/money/MoneyRecord";
import { SleepGoal } from "@schemas/sleep/SleepGoal";
import { SleepRecord } from "@schemas/sleep/SleepRecord";
import { User } from "@schemas/user/User";

// 0. category (카테고리 조회) ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const listCategory = async (usrIdPrm: string) => {
	const finalResult: any = await User.aggregate([
		{
			$match: {
				user_id: usrIdPrm,
			},
		},
		{
			$project: {
				_id: 0,
				exercise: `$user_dataCategory.exercise`,
				food: `$user_dataCategory.food`,
				money: `$user_dataCategory.money`,
				sleep: `$user_dataCategory.sleep`,
			},
		},
	]);

	return finalResult[0];
};

// 1. percent (퍼센트 조회) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const percent = {
	// 1-1. exercise (goal)
	listExerciseGoal: async (
		usrIdPrm: string,
		dtStrtPrm: string,
		dtEndPrm: string,
	) => {
		const finalResult: any = await ExerciseGoal.aggregate([
			{
				$match: {
					user_id: usrIdPrm,
					exercise_goal_dateStart: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
					exercise_goal_dateEnd: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
				},
			},
			{
				$project: {
					_id: 0,
					exercise_goal_count: 1,
					exercise_goal_volume: 1,
					exercise_goal_cardio: 1,
					exercise_goal_scale: 1,
				},
			},
		]);

		return finalResult;
	},

	// 1-2. exercise (record)
	listExercise: async (
		usrIdPrm: string,
		dtStrtPrm: string,
		dtEndPrm: string,
	) => {
		const finalResult: any = await ExerRec2.aggregate([
			{
				$match: {
					user_id: usrIdPrm,
					exercise_record_dateStart: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
					exercise_record_dateEnd: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
				},
			},
			{
				$project: {
					_id: 0,
					exercise_record_total_volume: 1,
					exercise_record_total_cardio: 1,
					exercise_record_total_scale: 1,
					exercise_record_total_count: {
						$cond: {
							if: {
								$and: [
									{
										$lte: [`$exercise_record_total_volume`, 1],
									},
									{
										$eq: [`$exercise_record_total_cardio`, `00:00`],
									},
								],
							},
							then: ``,
							else: `1`,
						},
					},
				},
			},
		]);

		return finalResult;
	},

	// 2-1. food (goal)
	listFoodGoal: async (
		usrIdPrm: string,
		dtStrtPrm: string,
		dtEndPrm: string,
	) => {
		const finalResult: any = await FoodGoal.aggregate([
			{
				$match: {
					user_id: usrIdPrm,
					food_goal_dateStart: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
					food_goal_dateEnd: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
				},
			},
			{
				$project: {
					_id: 0,
					food_goal_kcal: 1,
					food_goal_carb: 1,
					food_goal_protein: 1,
					food_goal_fat: 1,
				},
			},
		]);

		return finalResult;
	},

	// 2-2. food (record)
	listFood: async (
		usrIdPrm: string,
		dtStrtPrm: string,
		dtEndPrm: string,
	) => {
		const finalResult: any = await FoodRecord.aggregate([
			{
				$match: {
					user_id: usrIdPrm,
					food_record_dateStart: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
					food_record_dateEnd: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
				},
			},
			{
				$project: {
					_id: 0,
					food_record_total_kcal: 1,
					food_record_total_carb: 1,
					food_record_total_protein: 1,
					food_record_total_fat: 1,
				},
			},
		]);

		return finalResult;
	},

	// 3-1. money (goal)
	listMoneyGoal: async (
		usrIdPrm: string,
		dtStrtPrm: string,
		dtEndPrm: string,
	) => {
		const finalResult: any = await MoneyGoal.aggregate([
			{
				$match: {
					user_id: usrIdPrm,
					money_goal_dateStart: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
					money_goal_dateEnd: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
				},
			},
			{
				$project: {
					_id: 0,
					money_goal_income: 1,
					money_goal_expense: 1,
				},
			},
		]);

		return finalResult;
	},

	// 3-2. money (record)
	listMoney: async (
		usrIdPrm: string,
		dtStrtPrm: string,
		dtEndPrm: string,
	) => {
		const finalResult: any = await MoneyRecord.aggregate([
			{
				$match: {
					user_id: usrIdPrm,
					money_record_dateStart: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
					money_record_dateEnd: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
				},
			},
			{
				$project: {
					_id: 0,
					money_record_total_income: 1,
					money_record_total_expense: 1,
				},
			},
		]);

		return finalResult;
	},

	// 4-1. sleep (goal)
	listSleepGoal: async (
		usrIdPrm: string,
		dtStrtPrm: string,
		dtEndPrm: string,
	) => {
		const finalResult: any = await SleepGoal.aggregate([
			{
				$match: {
					user_id: usrIdPrm,
					sleep_goal_dateStart: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
					sleep_goal_dateEnd: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
				},
			},
			{
				$project: {
					_id: 0,
					sleep_goal_bedTime: 1,
					sleep_goal_wakeTime: 1,
					sleep_goal_sleepTime: 1,
				},
			},
		]);

		return finalResult;
	},

	// 4-2. sleep (record)
	listSleep: async (
		usrIdPrm: string,
		dtStrtPrm: string,
		dtEndPrm: string,
	) => {
		const finalResult: any = await SleepRecord.aggregate([
			{
				$match: {
					user_id: usrIdPrm,
					sleep_record_dateStart: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
					sleep_record_dateEnd: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
				},
			},
			{
				$project: {
					_id: 0,
					// return arrays so caller can handle multiple sections per record
					sleep_record_bedTime: `$sleep_section.sleep_record_bedTime`,
					sleep_record_wakeTime: `$sleep_section.sleep_record_wakeTime`,
					sleep_record_sleepTime: `$sleep_section.sleep_record_sleepTime`,
				},
			},
		]);

		return finalResult;
	},
};

// 2. scale (체중 조회) ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const scale = {
	// 2-1. 등록일 조회
	findRegDt: async (usrIdPrm: string) => {
		const finalResult: any = await User.aggregate([
			{
				$match: {
					user_id: usrIdPrm,
				},
			},
			{
				$project: {
					_id: 0,
					user_regDt: 1,
				},
			},
		]);

		return finalResult[0];
	},

	// 2-2. 최초 체중 조회
	findInitScale: async (usrIdPrm: string) => {
		const finalResult: any = await User.aggregate([
			{
				$match: {
					user_id: usrIdPrm,
				},
			},
			{
				$project: {
					_id: 0,
					user_initScale: 1,
					user_regDt: 1,
				},
			},
		]);

		return finalResult[0];
	},

	// 2-3. 최소 체중 조회
	findMinScale: async (
		usrIdPrm: string,
		dtStrtPrm: string,
		dtEndPrm: string,
	) => {
		const finalResult: any = await ExerRec2.aggregate([
			{
				$match: {
					user_id: usrIdPrm,
					exercise_record_dateStart: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
					exercise_record_dateEnd: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
				},
			},
			{
				$addFields: {
					exercise_record_total_scale: {
						$toDouble: `$exercise_record_total_scale`,
					},
				},
			},
			{
				$group: {
					_id: null,
					minScale: {
						$min: `$exercise_record_total_scale`,
					},
				},
			},
			{
				$project: {
					_id: 0,
					minScale: 1,
				},
			},
		]);

		return finalResult[0];
	},

	// 2-4. 최대 체중 조회
	findMaxScale: async (
		usrIdPrm: string,
		dtStrtPrm: string,
		dtEndPrm: string,
	) => {
		const finalResult: any = await ExerRec2.aggregate([
			{
				$match: {
					user_id: usrIdPrm,
					exercise_record_dateStart: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
					exercise_record_dateEnd: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
				},
			},
			{
				$addFields: {
					exercise_record_total_scale: {
						$toDouble: `$exercise_record_total_scale`,
					},
				},
			},
			{
				$group: {
					_id: null,
					maxScale: {
						$max: `$exercise_record_total_scale`,
					},
				},
			},
			{
				$project: {
					_id: 0,
					maxScale: 1,
				},
			},
		]);

		return finalResult[0];
	},

	// 2-5. 현재 체중 조회
	findCurScale: async (
		usrIdPrm: string,
		dtStrtPrm: string,
		dtEndPrm: string,
	) => {
		const finalResult: any = await ExerRec2.aggregate([
			{
				$match: {
					user_id: usrIdPrm,
					exercise_record_dateStart: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
					exercise_record_dateEnd: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
				},
			},
			{
				$sort: {
					exercise_record_dateEnd: -1,
				},
			},
			{
				$project: {
					_id: 0,
					exercise_record_total_scale: `$exercise_record_total_scale`,
				},
			},
		]);

		return finalResult[0];
	},

	// 2-5. 체중 업데이트
	updateScale: async (
		usrIdPrm: string,
		intSclPrm: string,
		mnSclPrm: string,
		mxSclPrm: string,
		crSclPrm: string,
	) => {
		const finalResult: any = await User.findOneAndUpdate(
			{
				user_id: usrIdPrm,
			},
			{
				$set: {
					user_initScale: intSclPrm,
					user_minScale: mnSclPrm,
					user_maxScale: mxSclPrm,
					user_curScale: crSclPrm,
					user_updateDt: new Date(),
				},
			},
			{
				upsert: true,
				new: true,
			},
		);

		return finalResult;
	},
};

// 3-1. nutrition ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const nutrition = {
	// 3-1. 등록일 조회
	findRegDt: async (usrIdPrm: string) => {
		const finalResult: any = await User.aggregate([
			{
				$match: {
					user_id: usrIdPrm,
				},
			},
			{
				$project: {
					_id: 0,
					user_regDt: 1,
				},
			},
		]);

		return finalResult[0];
	},

	// 3-2. 전체 정보 갯수 조회
	findTotalCnt: async (
		usrIdPrm: string,
		dtStrtPrm: string,
		dtEndPrm: string,
	) => {
		// 데이터중 값이 있는 것만 카운트
		const finalResult: any = await FoodRecord.countDocuments({
			user_id: usrIdPrm,
			food_record_dateStart: {
				$gte: dtStrtPrm,
				$lte: dtEndPrm,
			},
			food_record_dateEnd: {
				$gte: dtStrtPrm,
				$lte: dtEndPrm,
			},
			"food_section.food_record_kcal": {
				$ne: ``,
			},
		});

		return finalResult;
	},

	// 3-3. 최초 영양정보 조회
	findInitNutrition: async (usrIdPrm: string) => {
		const finalResult: any = await User.aggregate([
			{
				$match: {
					user_id: usrIdPrm,
				},
			},
			{
				$project: {
					_id: 0,
					user_initAvgKcalIntake: 1,
					user_regDt: 1,
				},
			},
		]);

		return finalResult[0];
	},

	// 3-4. 전체 영양정보 조회
	findAllInformation: async (
		usrIdPrm: string,
		dtStrtPrm: string,
		dtEndPrm: string,
	) => {
		const finalResult: any = await FoodRecord.aggregate([
			{
				$match: {
					user_id: usrIdPrm,
					food_record_dateStart: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
					food_record_dateEnd: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
				},
			},
			{
				$unwind: `$food_section`,
			},
			{
				$group: {
					_id: null,
					food_record_total_kcal: {
						$sum: {
							$toDouble: `$food_section.food_record_kcal`,
						},
					},
					food_record_total_carb: {
						$sum: {
							$toDouble: `$food_section.food_record_carb`,
						},
					},
					food_record_total_protein: {
						$sum: {
							$toDouble: `$food_section.food_record_protein`,
						},
					},
					food_record_total_fat: {
						$sum: {
							$toDouble: `$food_section.food_record_fat`,
						},
					},
				},
			},
			{
				$project: {
					_id: 0,
					food_record_total_kcal: 1,
					food_record_total_carb: 1,
					food_record_total_protein: 1,
					food_record_total_fat: 1,
				},
			},
		]);

		return finalResult[0];
	},

	// 3-5. 현재 영양정보 업데이트
	updateNutrition: async (
		usrIdPrm: string,
		intAvgKclPrm: string,
		ttlKclPrm: string,
		ttlCrbPrm: string,
		ttlPrtnPrm: string,
		ttlFtPrm: string,
		crAvgKclPrm: string,
		crAvgCrbPrm: string,
		crAvgPrtnPrm: string,
		crAvgFtPrm: string,
	) => {
		const finalResult: any = await User.findOneAndUpdate(
			{
				user_id: usrIdPrm,
			},
			{
				$set: {
					user_initAvgKcalIntake: intAvgKclPrm,
					user_totalKcalIntake: ttlKclPrm,
					user_totalCarbIntake: ttlCrbPrm,
					user_totalProteinIntake: ttlPrtnPrm,
					user_totalFatIntake: ttlFtPrm,
					user_curAvgKcalIntake: crAvgKclPrm,
					user_curAvgCarbIntake: crAvgCrbPrm,
					user_curAvgProteinIntake: crAvgPrtnPrm,
					user_curAvgFatIntake: crAvgFtPrm,
					user_updateDt: new Date(),
				},
			},
			{
				upsert: true,
				new: true,
			},
		);

		return finalResult;
	},
};

// 3-2. favorite (즐겨찾기 조회) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const favorite = {
	// 3-1. 등록일 조회
	findRegDt: async (usrIdPrm: string) => {
		const finalResult: any = await User.aggregate([
			{
				$match: {
					user_id: usrIdPrm,
				},
			},
			{
				$project: {
					_id: 0,
					user_regDt: 1,
				},
			},
		]);

		return finalResult[0];
	},

	// 3-2. 즐겨찾기 조회
	findFavorite: async (usrIdPrm: string) => {
		const finalResult: any = await User.aggregate([
			{
				$match: {
					user_id: usrIdPrm,
				},
			},
			{
				$project: {
					_id: 0,
					"user_favorite._id": 0,
				},
			},
		]);

		return finalResult[0].user_favorite;
	},
};

// 4. property (자산 조회) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const property = {
	// 4-1. 등록일 조회
	findRegDt: async (usrIdPrm: string) => {
		const finalResult: any = await User.aggregate([
			{
				$match: {
					user_id: usrIdPrm,
				},
			},
			{
				$project: {
					_id: 0,
					user_regDt: 1,
				},
			},
		]);

		return finalResult[0];
	},

	// 4-2. 최초 자산 조회
	findInitProperty: async (usrIdPrm: string) => {
		const finalResult: any = await User.aggregate([
			{
				$match: {
					user_id: usrIdPrm,
				},
			},
			{
				$project: {
					_id: 0,
					user_initProperty: 1,
					user_regDt: 1,
				},
			},
		]);

		return finalResult[0];
	},

	// 4-3. 전체 자산 정보 조회
	findAllInformation: async (
		usrIdPrm: string,
		dtStrtPrm: string,
		dtEndPrm: string,
	) => {
		const allResult: any = await MoneyRecord.aggregate([
			{
				$match: {
					user_id: usrIdPrm,
					money_record_dateStart: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
					money_record_dateEnd: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
				},
			},
			{
				$unwind: `$money_section`,
			},
			{
				// money_record_include 상관없이 모두 필터링
				$match: {
					"money_section.money_record_include": {
						$ne: null,
					},
				},
			},
			{
				$group: {
					_id: null,
					// money_record_part이 "income"인 경우의 수입 합산
					money_record_total_income: {
						$sum: {
							$cond: [
								{
									$eq: [`$money_section.money_record_part`, `income`],
								},
								{
									$toDouble: `$money_section.money_record_amount`,
								},
								0,
							],
						},
					},
					// money_record_part이 "expense"인 경우의 지출 합산
					money_record_total_expense: {
						$sum: {
							$cond: [
								{
									$eq: [`$money_section.money_record_part`, `expense`],
								},
								{
									$toDouble: `$money_section.money_record_amount`,
								},
								0,
							],
						},
					},
				},
			},
			{
				$project: {
					_id: 0,
					money_record_total_income: 1,
					money_record_total_expense: 1,
				},
			},
		]);

		const exclRes: any = await MoneyRecord.aggregate([
			{
				$match: {
					user_id: usrIdPrm,
					money_record_dateStart: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
					money_record_dateEnd: {
						$gte: dtStrtPrm,
						$lte: dtEndPrm,
					},
				},
			},
			{
				$unwind: `$money_section`,
			},
			{
				// money_record_include가 "Y"인 경우만 필터링
				$match: {
					"money_section.money_record_include": {
						$eq: `Y`,
					},
				},
			},
			{
				$group: {
					_id: null,
					// money_record_part이 "income"인 경우의 수입 합산
					money_record_total_income: {
						$sum: {
							$cond: [
								{
									$eq: [`$money_section.money_record_part`, `income`],
								},
								{
									$toDouble: `$money_section.money_record_amount`,
								},
								0,
							],
						},
					},
					// money_record_part이 "expense"인 경우의 지출 합산
					money_record_total_expense: {
						$sum: {
							$cond: [
								{
									$eq: [`$money_section.money_record_part`, `expense`],
								},
								{
									$toDouble: `$money_section.money_record_amount`,
								},
								0,
							],
						},
					},
				},
			},
			{
				$project: {
					_id: 0,
					money_record_total_income: 1,
					money_record_total_expense: 1,
				},
			},
		]);

		return {
			allResult: allResult[0],
			exclusionResult: exclRes[0],
		};
	},

	// 4-4. 현재 자산 업데이트
	updateProperty: async (
		usrIdPrm: string,
		intPrprPrm: string,
		ttlInAlPr: string,
		ttlInExPr: string,
		ttlExAlPr: string,
		ttlExExPr: string,
		crPrprAllPrm: string,
		crPrExPr: string,
	) => {
		const finalResult: any = await User.findOneAndUpdate(
			{
				user_id: usrIdPrm,
			},
			{
				$set: {
					user_initProperty: intPrprPrm,
					user_totalIncomeAll: ttlInAlPr,
					user_totalIncomeExclusion: ttlInExPr,
					user_totalExpenseAll: ttlExAlPr,
					user_totalExpenseExclusion: ttlExExPr,
					user_curPropertyAll: crPrprAllPrm,
					user_curPropertyExclusion: crPrExPr,
					user_updateDt: new Date(),
				},
			},
			{
				upsert: true,
				new: true,
			},
		);

		return finalResult;
	},
};

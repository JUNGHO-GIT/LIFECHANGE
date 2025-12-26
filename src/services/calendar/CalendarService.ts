/**
 * @file CalendarService.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import * as repository from "@repositories/calendar/CalendarRepository";
import moment from "moment-timezone";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
	user_id_param: string,
	DATE_param: any,
) => {

	// result 변수 선언
	let findResult: any = null;
	let finalResult: any = null;
	let statusResult: string = ``;

	// date 변수 선언
	const dateType: string = DATE_param?.dateType;
	const dateStart: string = DATE_param?.dateStart;
	const dateEnd: string = DATE_param?.dateEnd;

	findResult = await repository.exist(
		user_id_param, dateType, dateStart, dateEnd
	);

	if (!findResult || findResult?.length <= 0) {
		finalResult = null;
		statusResult = `fail`;
	}
	else {
		statusResult = `success`;
		finalResult = findResult.reduce((acc: any, curr: any) => {
			const curDateType: any = curr.calendar_dateType;
			const curDateStart: any = curr.calendar_dateStart;
			const curDateEnd: any = curr.calendar_dateEnd;

			acc[curDateType].push(`${curDateStart} - ${curDateEnd}`);

			return acc;
		}, {
			day: [],
			week: [],
			month: [],
			year: [],
			select: [],
		});
	}

	return {
		status: statusResult,
		result: finalResult
	};
};

// 1. list -----------------------------------------------------------------------------------------
export const list = async (
	user_id_param: string,
	DATE_param: any,
	PAGING_param: any,
) => {

	// result 변수 선언
	let findResult: any = null;
	let finalResult: any = null;
	let statusResult: string = ``;
	let totalCntResult: number = 0;

	// 플러스 마이너스 1개월
	const dateType: string = DATE_param?.dateType;
	const dateStart: string = moment(DATE_param?.dateStart).subtract(1, `months`).format(`YYYY-MM-DD`);
	const dateEnd: string = moment(DATE_param?.dateEnd).add(1, `months`).format(`YYYY-MM-DD`);

	// sort, page 변수 선언
	const sort: 1 | -1 = PAGING_param?.sort === `asc` ? 1 : -1;
	const page: number = PAGING_param?.page ?? 1;

	findResult = await repository.list(
		user_id_param, dateType, dateStart, dateEnd, sort, page
	);

	if (!findResult || findResult?.length <= 0) {
		finalResult = [];
		statusResult = `fail`;
	}
	else {
		finalResult = findResult;
		statusResult = `success`;
		totalCntResult = findResult.filter((item: any) => (
			item.calendar_exercise_section?.length > 0 ||
			item.calendar_food_section?.length > 0 ||
			item.calendar_money_section?.length > 0 ||
			item.calendar_sleep_section?.length > 0
		)).length;
	}

	return {
		status: statusResult,
		totalCnt: totalCntResult,
		result: finalResult,
	};
};

// 2. detail ---------------------------------------------------------------------------------------
export const detail = async (
	user_id_param: string,
	DATE_param: any,
) => {

	// result 변수 선언
	let findResult: any = null;
	let finalResult: any = null;
	let statusResult: string = ``;
	let sectionCntResult: number = 0;
	let exerciseSectionCntResult: number = 0;
	let foodSectionCntResult: number = 0;
	let moneySectionCntResult: number = 0;
	let sleepSectionCntResult: number = 0;

	// date 변수 선언
	const dateType: string = DATE_param?.dateType;
	const dateStart: string = DATE_param?.dateStart;
	const dateEnd: string = DATE_param?.dateEnd;

	findResult = await repository.detail(
		user_id_param, dateType, dateStart, dateEnd
	);

	if (!findResult) {
		finalResult = null;
		statusResult = `fail`;
	}
	else {
		finalResult = findResult?.[0] ?? {};
		statusResult = `success`;
	}

	// 섹션 카운트
	exerciseSectionCntResult = findResult?.[0]?.calendar_exercise_section?.length ?? 0;
	foodSectionCntResult = findResult?.[0]?.calendar_food_section?.length ?? 0;
	moneySectionCntResult = findResult?.[0]?.calendar_money_section?.length ?? 0;
	sleepSectionCntResult = findResult?.[0]?.calendar_sleep_section?.length ?? 0;
	sectionCntResult = (
		exerciseSectionCntResult +
		foodSectionCntResult +
		moneySectionCntResult +
		sleepSectionCntResult
	);

	return {
		status: statusResult,
		exerciseSectionCnt: exerciseSectionCntResult,
		foodSectionCnt: foodSectionCntResult,
		moneySectionCnt: moneySectionCntResult,
		sleepSectionCnt: sleepSectionCntResult,
		sectionCnt: sectionCntResult,
		result: finalResult,
	};
};

// 4. update --------------------------------------------------------------------------------------
export const update = async (
	user_id_param: string,
	OBJECT_param: any,
	DATE_param: any,
	type_param: string,
) => {

	// result 변수 선언
	let exerciseResult: any = null;
	let foodResult: any = null;
	let moneyResult: any = null;
	let sleepResult: any = null;
	let finalResult: any = {};
	let statusResult: string = `success`;

	// date 변수 선언
	const dateType: string = DATE_param?.dateType;
	const dateStart: string = DATE_param?.dateStart;
	const dateEnd: string = DATE_param?.dateEnd;

	// create인 경우 create 함수 사용, 아니면 update 함수 사용
	const isCreate: boolean = type_param === `create`;

	// 유효한 데이터만 필터링
	const validExerciseSection: any = OBJECT_param?.calendar_exercise_section?.filter((item: any) => (
		item.exercise_record_part && item.exercise_record_title
	)) ?? [];
	const validFoodSection: any = OBJECT_param?.calendar_food_section?.filter((item: any) => (
		item.food_record_name && item.food_record_name.trim() !== ``
	)) ?? [];
	const validMoneySection: any = OBJECT_param?.calendar_money_section?.filter((item: any) => (
		item.money_record_amount && Number(item.money_record_amount) > 0
	)) ?? [];
	const validSleepSection: any = OBJECT_param?.calendar_sleep_section?.filter((item: any) => (
		item.sleep_record_sleepTime && item.sleep_record_sleepTime !== `00:00`
	)) ?? [];

	// exercise 처리
	const ExerciseRecordService: any = require(`@services/exercise/ExerciseRecordService`);
	if (validExerciseSection.length > 0) {
		const exerciseObject = {
			exercise_record_dateType: dateType,
			exercise_record_dateStart: dateStart,
			exercise_record_dateEnd: dateEnd,
			exercise_record_total_volume: OBJECT_param.calendar_exercise_record_total_volume ?? `0`,
			exercise_record_total_cardio: OBJECT_param.calendar_exercise_record_total_cardio ?? `00:00`,
			exercise_record_total_scale: `0`,
			exercise_section: validExerciseSection,
		};
		exerciseResult = isCreate ? (
			await ExerciseRecordService.create(user_id_param, exerciseObject, DATE_param)
		) : (
			await ExerciseRecordService.update(user_id_param, exerciseObject, DATE_param, type_param)
		);
		if (exerciseResult.status === `fail`) {
			statusResult = `fail`;
		}
		finalResult.exercise = exerciseResult;
	}
	else if (!isCreate && OBJECT_param?.calendar_exercise_dateStart !== `0000-00-00`) {
		exerciseResult = await ExerciseRecordService.deletes(user_id_param, DATE_param);
		finalResult.exercise = exerciseResult;
	}

	// food 처리
	const FoodRecordService: any = require(`@services/food/FoodRecordService`);
	if (validFoodSection.length > 0) {
		const foodObject = {
			food_record_dateType: dateType,
			food_record_dateStart: dateStart,
			food_record_dateEnd: dateEnd,
			food_record_total_calorie: OBJECT_param.calendar_food_record_total_calorie ?? `0`,
			food_record_total_carb: OBJECT_param.calendar_food_record_total_carb ?? `0`,
			food_record_total_protein: OBJECT_param.calendar_food_record_total_protein ?? `0`,
			food_record_total_fat: OBJECT_param.calendar_food_record_total_fat ?? `0`,
			food_record_total_scale: `0`,
			food_section: validFoodSection,
		};
		foodResult = isCreate ? (
			await FoodRecordService.create(user_id_param, foodObject, DATE_param)
		) : (
			await FoodRecordService.update(user_id_param, foodObject, DATE_param, type_param)
		);
		if (foodResult.status === `fail`) {
			statusResult = `fail`;
		}
		finalResult.food = foodResult;
	}
	else if (!isCreate && OBJECT_param?.calendar_food_dateStart !== `0000-00-00`) {
		foodResult = await FoodRecordService.deletes(user_id_param, DATE_param);
		finalResult.food = foodResult;
	}

	// money 처리
	const MoneyRecordService: any = require(`@services/money/MoneyRecordService`);
	if (validMoneySection.length > 0) {
		const moneyObject = {
			money_record_dateType: dateType,
			money_record_dateStart: dateStart,
			money_record_dateEnd: dateEnd,
			money_record_total_income: OBJECT_param.calendar_money_record_total_income ?? `0`,
			money_record_total_expense: OBJECT_param.calendar_money_record_total_expense ?? `0`,
			money_record_total_scale: `0`,
			money_section: validMoneySection,
		};
		moneyResult = isCreate ? (
			await MoneyRecordService.create(user_id_param, moneyObject, DATE_param)
		) : (
			await MoneyRecordService.update(user_id_param, moneyObject, DATE_param, type_param)
		);
		if (moneyResult.status === `fail`) {
			statusResult = `fail`;
		}
		finalResult.money = moneyResult;
	}
	else if (!isCreate && OBJECT_param?.calendar_money_dateStart !== `0000-00-00`) {
		moneyResult = await MoneyRecordService.deletes(user_id_param, DATE_param);
		finalResult.money = moneyResult;
	}

	// sleep 처리
	const SleepRecordService: any = require(`@services/sleep/SleepRecordService`);
	if (validSleepSection.length > 0) {
		const sleepObject = {
			sleep_record_dateType: dateType,
			sleep_record_dateStart: dateStart,
			sleep_record_dateEnd: dateEnd,
			sleep_record_total_time: OBJECT_param.calendar_sleep_record_total_time ?? `00:00`,
			sleep_record_total_scale: `0`,
			sleep_section: validSleepSection,
		};
		sleepResult = isCreate ? (
			await SleepRecordService.create(user_id_param, sleepObject, DATE_param)
		) : (
			await SleepRecordService.update(user_id_param, sleepObject, DATE_param, type_param)
		);
		if (sleepResult.status === `fail`) {
			statusResult = `fail`;
		}
		finalResult.sleep = sleepResult;
	}
	else if (!isCreate && OBJECT_param?.calendar_sleep_dateStart !== `0000-00-00`) {
		sleepResult = await SleepRecordService.deletes(user_id_param, DATE_param);
		finalResult.sleep = sleepResult;
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 5. delete --------------------------------------------------------------------------------------
export const deletes = async (
	user_id_param: string,
	DATE_param: any,
) => {

	// result 변수 선언
	let exerciseResult: any = null;
	let foodResult: any = null;
	let moneyResult: any = null;
	let sleepResult: any = null;
	let finalResult: any = {};
	let statusResult: string = `success`;

	// date 변수 선언
	const dateType: string = DATE_param?.dateType;
	const dateStart: string = DATE_param?.dateStart;
	const dateEnd: string = DATE_param?.dateEnd;

	// exercise 데이터 삭제
	const ExerciseRecordService: any = require(`@services/exercise/ExerciseRecordService`);
	exerciseResult = await ExerciseRecordService.deletes(
		user_id_param, DATE_param
	);
	if (exerciseResult.status === `fail`) {
		statusResult = `fail`;
	}
	finalResult.exercise = exerciseResult;

	// food 데이터 삭제
	const FoodRecordService: any = require(`@services/food/FoodRecordService`);
	foodResult = await FoodRecordService.deletes(
		user_id_param, DATE_param
	);
	if (foodResult.status === `fail`) {
		statusResult = `fail`;
	}
	finalResult.food = foodResult;

	// money 데이터 삭제
	const MoneyRecordService: any = require(`@services/money/MoneyRecordService`);
	moneyResult = await MoneyRecordService.deletes(
		user_id_param, DATE_param
	);
	if (moneyResult.status === `fail`) {
		statusResult = `fail`;
	}
	finalResult.money = moneyResult;

	// sleep 데이터 삭제
	const SleepRecordService: any = require(`@services/sleep/SleepRecordService`);
	sleepResult = await SleepRecordService.deletes(
		user_id_param, DATE_param
	);
	if (sleepResult.status === `fail`) {
		statusResult = `fail`;
	}
	finalResult.sleep = sleepResult;

	return {
		status: statusResult,
		result: finalResult,
	};
};

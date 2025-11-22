// CalendarService.ts

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
	let statusResult: string = "";

	// date 변수 선언
	const dateType = DATE_param?.dateType;
	const dateStart = DATE_param?.dateStart;
	const dateEnd = DATE_param?.dateEnd;

	findResult = await repository.exist(
		user_id_param, dateType, dateStart, dateEnd
	);

	if (!findResult || findResult?.length <= 0) {
		finalResult = null;
		statusResult = "fail";
	}
	else {
		statusResult = "success";
		finalResult = findResult.reduce((acc: any, curr: any) => {
			const curDateType = curr.today_record_dateType;
			const curDateStart = curr.today_record_dateStart;
			const curDateEnd = curr.today_record_dateEnd;

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
	let finalResult: any = null
	let statusResult: string = "";
	let totalCntResult: any = null;

	// 플러스 마이너스 1개월
	const dateType = DATE_param?.dateType;
	const dateStart = moment(DATE_param?.dateStart).subtract(1, "months").format("YYYY-MM-DD");
	const dateEnd = moment(DATE_param?.dateEnd).add(1, "months").format("YYYY-MM-DD");

	// sort, page 변수 선언
	const sort = PAGING_param?.sort === "asc" ? 1 : -1;
	const page = PAGING_param?.page ? PAGING_param.page : 1;

	totalCntResult = await repository.cnt(
		user_id_param, dateType, dateStart, dateEnd
	);

	findResult = await repository.list(
		user_id_param, dateType, dateStart, dateEnd, sort, page
	);

	if (!findResult || findResult?.length <= 0) {
		finalResult = [];
		statusResult = "fail";
	}
	else {
		finalResult = findResult;
		statusResult = "success";
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
	let statusResult: string = "";
	let sectionCntResult: number = 0;
	let exerciseSectionCntResult: number = 0;
	let foodSectionCntResult: number = 0;
	let moneySectionCntResult: number = 0;
	let sleepSectionCntResult: number = 0;

	// date 변수 선언
	const dateType = DATE_param?.dateType;
	const dateStart = DATE_param?.dateStart;
	const dateEnd = DATE_param?.dateEnd;

	findResult = await repository.detail(
		user_id_param, dateType, dateStart, dateEnd
	);

	if (!findResult) {
		finalResult = null;
		statusResult = "fail";
	}
	else {
		finalResult = findResult?.[0] || {};
		statusResult = "success";
	}

	// 섹션 카운트
	exerciseSectionCntResult = findResult?.[0]?.today_exercise_section?.length || 0;
	foodSectionCntResult = findResult?.[0]?.today_food_section?.length || 0;
	moneySectionCntResult = findResult?.[0]?.today_money_section?.length || 0;
	sleepSectionCntResult = findResult?.[0]?.today_sleep_section?.length || 0;
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
	let statusResult: string = "success";

	// date 변수 선언
	const dateType = DATE_param?.dateType;
	const dateStart = DATE_param?.dateStart;
	const dateEnd = DATE_param?.dateEnd;

	// exercise 데이터가 있으면 exercise update 호출
	if (OBJECT_param?.today_exercise_section?.length > 0) {
		const ExerciseRecordService = require("@services/exercise/ExerciseRecordService");
		const exerciseObject = {
			exercise_record_dateType: dateType,
			exercise_record_dateStart: dateStart,
			exercise_record_dateEnd: dateEnd,
			exercise_record_total_volume: OBJECT_param.today_exercise_record_total_volume || "0",
			exercise_record_total_cardio: OBJECT_param.today_exercise_record_total_cardio || "00:00",
			exercise_record_total_scale: "0",
			exercise_section: OBJECT_param.today_exercise_section,
		};
		exerciseResult = await ExerciseRecordService.update(
			user_id_param, exerciseObject, DATE_param, type_param
		);
		if (exerciseResult.status === "fail") {
			statusResult = "fail";
		}
		finalResult.exercise = exerciseResult;
	}

	// food 데이터가 있으면 food update 호출
	if (OBJECT_param?.today_food_section?.length > 0) {
		const FoodRecordService = require("@services/food/FoodRecordService");
		const foodObject = {
			food_record_dateType: dateType,
			food_record_dateStart: dateStart,
			food_record_dateEnd: dateEnd,
			food_record_total_calorie: OBJECT_param.today_food_record_total_calorie || "0",
			food_record_total_carb: OBJECT_param.today_food_record_total_carb || "0",
			food_record_total_protein: OBJECT_param.today_food_record_total_protein || "0",
			food_record_total_fat: OBJECT_param.today_food_record_total_fat || "0",
			food_record_total_scale: "0",
			food_section: OBJECT_param.today_food_section,
		};
		foodResult = await FoodRecordService.update(
			user_id_param, foodObject, DATE_param, type_param
		);
		if (foodResult.status === "fail") {
			statusResult = "fail";
		}
		finalResult.food = foodResult;
	}

	// money 데이터가 있으면 money update 호출
	if (OBJECT_param?.today_money_section?.length > 0) {
		const MoneyRecordService = require("@services/money/MoneyRecordService");
		const moneyObject = {
			money_record_dateType: dateType,
			money_record_dateStart: dateStart,
			money_record_dateEnd: dateEnd,
			money_record_total_income: OBJECT_param.today_money_record_total_income || "0",
			money_record_total_expense: OBJECT_param.today_money_record_total_expense || "0",
			money_record_total_scale: "0",
			money_section: OBJECT_param.today_money_section,
		};
		moneyResult = await MoneyRecordService.update(
			user_id_param, moneyObject, DATE_param, type_param
		);
		if (moneyResult.status === "fail") {
			statusResult = "fail";
		}
		finalResult.money = moneyResult;
	}

	// sleep 데이터가 있으면 sleep update 호출
	if (OBJECT_param?.today_sleep_section?.length > 0) {
		const SleepRecordService = require("@services/sleep/SleepRecordService");
		const sleepObject = {
			sleep_record_dateType: dateType,
			sleep_record_dateStart: dateStart,
			sleep_record_dateEnd: dateEnd,
			sleep_record_total_time: OBJECT_param.today_sleep_record_total_time || "00:00",
			sleep_record_total_scale: "0",
			sleep_section: OBJECT_param.today_sleep_section,
		};
		sleepResult = await SleepRecordService.update(
			user_id_param, sleepObject, DATE_param, type_param
		);
		if (sleepResult.status === "fail") {
			statusResult = "fail";
		}
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
	let statusResult: string = "success";

	// date 변수 선언
	const dateType = DATE_param?.dateType;
	const dateStart = DATE_param?.dateStart;
	const dateEnd = DATE_param?.dateEnd;

	// exercise 데이터 삭제
	const ExerciseRecordService = require("@services/exercise/ExerciseRecordService");
	exerciseResult = await ExerciseRecordService.deletes(
		user_id_param, DATE_param
	);
	if (exerciseResult.status === "fail") {
		statusResult = "fail";
	}
	finalResult.exercise = exerciseResult;

	// food 데이터 삭제
	const FoodRecordService = require("@services/food/FoodRecordService");
	foodResult = await FoodRecordService.deletes(
		user_id_param, DATE_param
	);
	if (foodResult.status === "fail") {
		statusResult = "fail";
	}
	finalResult.food = foodResult;

	// money 데이터 삭제
	const MoneyRecordService = require("@services/money/MoneyRecordService");
	moneyResult = await MoneyRecordService.deletes(
		user_id_param, DATE_param
	);
	if (moneyResult.status === "fail") {
		statusResult = "fail";
	}
	finalResult.money = moneyResult;

	// sleep 데이터 삭제
	const SleepRecordService = require("@services/sleep/SleepRecordService");
	sleepResult = await SleepRecordService.deletes(
		user_id_param, DATE_param
	);
	if (sleepResult.status === "fail") {
		statusResult = "fail";
	}
	finalResult.sleep = sleepResult;

	return {
		status: statusResult,
		result: finalResult,
	};
};
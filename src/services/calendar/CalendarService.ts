/**
 * @file CalendarService.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import * as repository from "@repositories/calendar/CalendarRepository";
import * as ExerRecSvc from "@services/exercise/ExerciseRecordService";
import * as FdRecSvc from "@services/food/FoodRecordService";
import * as MnyRecSvc from "@services/money/MoneyRecordService";
import * as SlpRecSvc from "@services/sleep/SleepRecordService";
import moment from "moment-timezone";

// 0. exist ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const exist = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let findResult: any = null;
	let finalResult: any = null;
	let statusResult: string = ``;

	// date 변수 선언
	const dateType: string = DATE_param?.dateType;
	const dateStart: string = DATE_param?.dateStart;
	const dateEnd: string = DATE_param?.dateEnd;

	findResult = await repository.exist(
		usrIdPrm,
		dateType,
		dateStart,
		dateEnd,
	);

	if (!findResult || findResult?.length <= 0) {
		finalResult = null;
		statusResult = `fail`;
	} else {
		statusResult = `success`;
		finalResult = findResult.reduce(
			(acc: any, curr: any) => {
				const curDateType: any = curr.calendar_dateType;
				const curDateStart: any = curr.calendar_dateStart;
				const curDateEnd: any = curr.calendar_dateEnd;

				acc[curDateType].push(`${curDateStart} - ${curDateEnd}`);

				return acc;
			},
			{
				day: [],
				week: [],
				month: [],
				year: [],
				select: [],
			},
		);
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 1. list ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const list = async (
	usrIdPrm: string,
	DATE_param: any,
	PAGING_param: any,
) => {
	// result 변수 선언
	let findResult: any = null;
	let finalResult: any = null;
	let statusResult: string = ``;
	let ttlCntRes: number = 0;

	// 플러스 마이너스 1개월
	const dateType: string = DATE_param?.dateType;
	const dateStart: string = moment(DATE_param?.dateStart)
		.subtract(1, `months`)
		.format(`YYYY-MM-DD`);
	const dateEnd: string = moment(DATE_param?.dateEnd)
		.add(1, `months`)
		.format(`YYYY-MM-DD`);

	// sort, page 변수 선언
	const sort: 1 | -1 = PAGING_param?.sort === `asc` ? 1 : -1;
	const page: number = PAGING_param?.page ?? 1;

	findResult = await repository.list(
		usrIdPrm,
		dateType,
		dateStart,
		dateEnd,
		sort,
		page,
	);

	if (!findResult || findResult?.length <= 0) {
		finalResult = [];
		statusResult = `fail`;
	} else {
		finalResult = findResult;
		statusResult = `success`;
		ttlCntRes = findResult.filter(
			(item: any) =>
				item.calendar_exercise_section?.length > 0 ||
				item.calendar_food_section?.length > 0 ||
				item.calendar_money_section?.length > 0 ||
				item.calendar_sleep_section?.length > 0,
		).length;
	}

	return {
		status: statusResult,
		totalCnt: ttlCntRes,
		result: finalResult,
	};
};

// 2. detail ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const detail = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let findResult: any = null;
	let finalResult: any = null;
	let statusResult: string = ``;
	let secCntRes: number = 0;
	let exeSeCnRe: number = 0;
	let fdSecCntRes: number = 0;
	let mnySecCntRes: number = 0;
	let slpSecCntRes: number = 0;

	// date 변수 선언
	const dateType: string = DATE_param?.dateType;
	const dateStart: string = DATE_param?.dateStart;
	const dateEnd: string = DATE_param?.dateEnd;

	findResult = await repository.detail(
		usrIdPrm,
		dateType,
		dateStart,
		dateEnd,
	);

	if (!findResult) {
		finalResult = null;
		statusResult = `fail`;
	} else {
		finalResult = findResult?.[0] ?? {};
		statusResult = `success`;
	}

	// 섹션 카운트
	exeSeCnRe =
		findResult?.[0]?.calendar_exercise_section?.length ?? 0;
	fdSecCntRes = findResult?.[0]?.calendar_food_section?.length ?? 0;
	mnySecCntRes = findResult?.[0]?.calendar_money_section?.length ?? 0;
	slpSecCntRes = findResult?.[0]?.calendar_sleep_section?.length ?? 0;
	secCntRes =
		exeSeCnRe +
		fdSecCntRes +
		mnySecCntRes +
		slpSecCntRes;

	return {
		status: statusResult,
		exerciseSectionCnt: exeSeCnRe,
		foodSectionCnt: fdSecCntRes,
		moneySectionCnt: mnySecCntRes,
		sleepSectionCnt: slpSecCntRes,
		sectionCnt: secCntRes,
		result: finalResult,
	};
};

// 4. update ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const update = async (
	usrIdPrm: string,
	OBJECT_param: any,
	DATE_param: any,
	type_param: string,
) => {
	// result 변수 선언
	let exerRes: any = null;
	let foodResult: any = null;
	let moneyResult: any = null;
	let sleepResult: any = null;
	const finalResult: any = {};
	let statusResult: string = `success`;

	// date 변수 선언
	const dateType: string = DATE_param?.dateType;
	const dateStart: string = DATE_param?.dateStart;
	const dateEnd: string = DATE_param?.dateEnd;

	// create인 경우 create 함수 사용, 아니면 update 함수 사용
	const isCreate: boolean = type_param === `create`;

	// 유효한 데이터만 필터링
	const vldExerSec: any =
		OBJECT_param?.calendar_exercise_section?.filter((item: any) => {
			return (
				item.exercise_record_part && item.exercise_record_part.trim() !== ``
			);
		}) ?? [];
	const vldFdSec: any =
		OBJECT_param?.calendar_food_section?.filter((item: any) => {
			return item.food_record_name && item.food_record_name.trim() !== ``;
		}) ?? [];
	const vldMnySec: any =
		OBJECT_param?.calendar_money_section?.filter((item: any) => {
			return item.money_record_amount && Number(item.money_record_amount) > 0;
		}) ?? [];
	const vldSlpSec: any =
		OBJECT_param?.calendar_sleep_section?.filter((item: any) => {
			return (
				item.sleep_record_sleepTime && item.sleep_record_sleepTime !== `00:00`
			);
		}) ?? [];

	// exercise 처리
	if (vldExerSec.length > 0) {
		const exerObjc = {
			exercise_record_dateType: dateType,
			exercise_record_dateStart: dateStart,
			exercise_record_dateEnd: dateEnd,
			exercise_record_total_volume:
				OBJECT_param.calendar_exercise_record_total_volume ?? `0`,
			exercise_record_total_cardio:
				OBJECT_param.calendar_exercise_record_total_cardio ?? `00:00`,
			exercise_record_total_scale: `0`,
			exercise_section: vldExerSec,
		};
		exerRes = isCreate
			? await ExerRecSvc.create(
					usrIdPrm,
					exerObjc,
					DATE_param,
				)
			: await ExerRecSvc.update(
					usrIdPrm,
					exerObjc,
					DATE_param,
					type_param,
				);
		if (exerRes.status === `fail`) {
			statusResult = `fail`;
		}
		finalResult.exercise = exerRes;
	} else if (
		!isCreate &&
		OBJECT_param?.calendar_exercise_dateStart !== `0000-00-00`
	) {
		exerRes = await ExerRecSvc.deletes(
			usrIdPrm,
			DATE_param,
		);
		finalResult.exercise = exerRes;
	}

	// food 처리
	if (vldFdSec.length > 0) {
		const foodObject = {
			food_record_dateType: dateType,
			food_record_dateStart: dateStart,
			food_record_dateEnd: dateEnd,
			food_record_total_calorie:
				OBJECT_param.calendar_food_record_total_calorie ?? `0`,
			food_record_total_carb:
				OBJECT_param.calendar_food_record_total_carb ?? `0`,
			food_record_total_protein:
				OBJECT_param.calendar_food_record_total_protein ?? `0`,
			food_record_total_fat: OBJECT_param.calendar_food_record_total_fat ?? `0`,
			food_record_total_scale: `0`,
			food_section: vldFdSec,
		};
		foodResult = isCreate
			? await FdRecSvc.create(usrIdPrm, foodObject, DATE_param)
			: await FdRecSvc.update(
					usrIdPrm,
					foodObject,
					DATE_param,
					type_param,
				);
		if (foodResult.status === `fail`) {
			statusResult = `fail`;
		}
		finalResult.food = foodResult;
	} else if (
		!isCreate &&
		OBJECT_param?.calendar_food_dateStart !== `0000-00-00`
	) {
		foodResult = await FdRecSvc.deletes(usrIdPrm, DATE_param);
		finalResult.food = foodResult;
	}

	// money 처리
	if (vldMnySec.length > 0) {
		const moneyObject = {
			money_record_dateType: dateType,
			money_record_dateStart: dateStart,
			money_record_dateEnd: dateEnd,
			money_record_total_income:
				OBJECT_param.calendar_money_record_total_income ?? `0`,
			money_record_total_expense:
				OBJECT_param.calendar_money_record_total_expense ?? `0`,
			money_record_total_scale: `0`,
			money_section: vldMnySec,
		};
		moneyResult = isCreate
			? await MnyRecSvc.create(usrIdPrm, moneyObject, DATE_param)
			: await MnyRecSvc.update(
					usrIdPrm,
					moneyObject,
					DATE_param,
					type_param,
				);
		if (moneyResult.status === `fail`) {
			statusResult = `fail`;
		}
		finalResult.money = moneyResult;
	} else if (
		!isCreate &&
		OBJECT_param?.calendar_money_dateStart !== `0000-00-00`
	) {
		moneyResult = await MnyRecSvc.deletes(usrIdPrm, DATE_param);
		finalResult.money = moneyResult;
	}

	// sleep 처리
	if (vldSlpSec.length > 0) {
		const sleepObject = {
			sleep_record_dateType: dateType,
			sleep_record_dateStart: dateStart,
			sleep_record_dateEnd: dateEnd,
			sleep_record_total_time:
				OBJECT_param.calendar_sleep_record_total_time ?? `00:00`,
			sleep_record_total_scale: `0`,
			sleep_section: vldSlpSec,
		};
		sleepResult = isCreate
			? await SlpRecSvc.create(usrIdPrm, sleepObject, DATE_param)
			: await SlpRecSvc.update(
					usrIdPrm,
					sleepObject,
					DATE_param,
					type_param,
				);
		if (sleepResult.status === `fail`) {
			statusResult = `fail`;
		}
		finalResult.sleep = sleepResult;
	} else if (
		!isCreate &&
		OBJECT_param?.calendar_sleep_dateStart !== `0000-00-00`
	) {
		sleepResult = await SlpRecSvc.deletes(usrIdPrm, DATE_param);
		finalResult.sleep = sleepResult;
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 5. delete ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const deletes = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let exerRes: any = null;
	let foodResult: any = null;
	let moneyResult: any = null;
	let sleepResult: any = null;
	const finalResult: any = {};
	let statusResult: string = `success`;

	// date 변수 선언
	const dateType: string = DATE_param?.dateType;
	const dateStart: string = DATE_param?.dateStart;
	const dateEnd: string = DATE_param?.dateEnd;

	// exercise 데이터 삭제
	exerRes = await ExerRecSvc.deletes(
		usrIdPrm,
		DATE_param,
	);
	if (exerRes.status === `fail`) {
		statusResult = `fail`;
	}
	finalResult.exercise = exerRes;

	// food 데이터 삭제
	foodResult = await FdRecSvc.deletes(usrIdPrm, DATE_param);
	if (foodResult.status === `fail`) {
		statusResult = `fail`;
	}
	finalResult.food = foodResult;

	// money 데이터 삭제
	moneyResult = await MnyRecSvc.deletes(usrIdPrm, DATE_param);
	if (moneyResult.status === `fail`) {
		statusResult = `fail`;
	}
	finalResult.money = moneyResult;

	// sleep 데이터 삭제
	sleepResult = await SlpRecSvc.deletes(usrIdPrm, DATE_param);
	if (sleepResult.status === `fail`) {
		statusResult = `fail`;
	}
	finalResult.sleep = sleepResult;

	return {
		status: statusResult,
		result: finalResult,
	};
};

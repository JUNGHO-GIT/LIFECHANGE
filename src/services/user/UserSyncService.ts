/**
 * @file UserSyncService.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import * as repository from "@repositories/user/UserSyncRepository";
import { timeToDecimal as tmTDcml, decimalToTime as dcmlTTm } from "@assets/scripts/utils";

// 0. category (카테고리 조회) ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const category = async (usrIdPrm: string) => {
	// result 변수 선언
	let findCategory: any = null;
	let finalResult: any = null;
	let statusResult: string = ``;

	findCategory = await repository.listCategory(usrIdPrm);

	if (!findCategory) {
		finalResult = null;
		statusResult = `fail`;
	} else {
		finalResult = findCategory;
		statusResult = `success`;
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 1. percent (퍼센트 조회) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const percent = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let fndExerGl: any = null;
	let findExercise: any = null;
	let findFoodGoal: any = null;
	let findFood: any = null;
	let fndMnyGl: any = null;
	let findMoney: any = null;
	let fndSlpGl: any = null;
	let findSleep: any = null;

	let findResult: any = null;
	let finalResult: any = null;
	let statusResult: string = ``;

	// date 변수 선언 (이번달 기간 계산)
	const dateStart: string = DATE_param.monthStart;
	const dateEnd: string = DATE_param.monthEnd;

	// 1-1. exerciseGoal
	fndExerGl = await repository.percent.listExerciseGoal(
		usrIdPrm,
		dateStart,
		dateEnd,
	);

	// 1-2. exercise
	findExercise = await repository.percent.listExercise(
		usrIdPrm,
		dateStart,
		dateEnd,
	);

	findExercise =
		findExercise?.length > 0 &&
		findExercise?.reduce((acc: any, curr: any) => {
			const exerTtlCnt =
				Number.parseFloat(acc?.exercise_record_total_count) +
				Number.parseFloat(curr?.exercise_record_total_count);
			const exerTtlVol =
				Number.parseFloat(acc?.exercise_record_total_volume) +
				Number.parseFloat(curr?.exercise_record_total_volume);
			const exerTtlCrd =
				tmTDcml(acc?.exercise_record_total_cardio) +
				tmTDcml(curr?.exercise_record_total_cardio);
			const exerTtlScl =
				curr?.exercise_record_total_scale !== `0`
					? curr?.exercise_record_total_scale
					: acc?.exercise_record_total_scale;
			return {
				exercise_record_total_count: String(exerTtlCnt),
				exercise_record_total_volume: String(exerTtlVol),
				exercise_record_total_cardio: String(
					dcmlTTm(exerTtlCrd),
				),
				exercise_record_total_scale: String(exerTtlScl),
			};
		});

	// 2-1. foodGoal
	findFoodGoal = await repository.percent.listFoodGoal(
		usrIdPrm,
		dateStart,
		dateEnd,
	);

	// 2-2. food
	findFood = await repository.percent.listFood(
		usrIdPrm,
		dateStart,
		dateEnd,
	);
	findFood =
		findFood?.length > 0 &&
		findFood?.reduce((acc: any, curr: any) => {
			const fdTtlKcl =
				Number.parseFloat(acc?.food_record_total_kcal) +
				Number.parseFloat(curr?.food_record_total_kcal);
			const fdTtlCrb =
				Number.parseFloat(acc?.food_record_total_carb) +
				Number.parseFloat(curr?.food_record_total_carb);
			const fdTtlPrtn =
				Number.parseFloat(acc?.food_record_total_protein) +
				Number.parseFloat(curr?.food_record_total_protein);
			const foodTotalFat =
				Number.parseFloat(acc?.food_record_total_fat) +
				Number.parseFloat(curr?.food_record_total_fat);
			return {
				food_record_total_kcal: String(fdTtlKcl),
				food_record_total_carb: String(fdTtlCrb),
				food_record_total_protein: String(fdTtlPrtn),
				food_record_total_fat: String(foodTotalFat),
			};
		});

	// 3-1. moneyGoal
	fndMnyGl = await repository.percent.listMoneyGoal(
		usrIdPrm,
		dateStart,
		dateEnd,
	);

	// 3-2. money
	findMoney = await repository.percent.listMoney(
		usrIdPrm,
		dateStart,
		dateEnd,
	);
	findMoney =
		findMoney?.length > 0 &&
		findMoney?.reduce((acc: any, curr: any) => {
			const mnyTtlIncm =
				Number.parseFloat(acc?.money_record_total_income) +
				Number.parseFloat(curr?.money_record_total_income);
			const mnyTtlExpn =
				Number.parseFloat(acc?.money_record_total_expense) +
				Number.parseFloat(curr?.money_record_total_expense);
			return {
				money_record_total_income: String(mnyTtlIncm),
				money_record_total_expense: String(mnyTtlExpn),
			};
		});

	// 4-1. sleepGoal
	fndSlpGl = await repository.percent.listSleepGoal(
		usrIdPrm,
		dateStart,
		dateEnd,
	);

	// 4-2. sleep
	findSleep = await repository.percent.listSleep(
		usrIdPrm,
		dateStart,
		dateEnd,
	);

	// aggregate across all sections (support multi-section records)
	let ttlBdDcml: number = 0;
	let ttlWkDcml: number = 0;
	let ttlSlpDcml: number = 0;
	let ttlBdCnt: number = 0;
	let ttlWkCnt: number = 0;
	let ttlSlpCnt: number = 0;

	(findSleep ?? []).forEach((doc: any) => {
		const bedArr = Array.isArray(doc?.sleep_record_bedTime)
			? doc.sleep_record_bedTime
			: doc?.sleep_record_bedTime
				? [doc.sleep_record_bedTime]
				: [];
		const wakeArr = Array.isArray(doc?.sleep_record_wakeTime)
			? doc.sleep_record_wakeTime
			: doc?.sleep_record_wakeTime
				? [doc.sleep_record_wakeTime]
				: [];
		const sleepArr = Array.isArray(doc?.sleep_record_sleepTime)
			? doc.sleep_record_sleepTime
			: doc?.sleep_record_sleepTime
				? [doc.sleep_record_sleepTime]
				: [];

		bedArr.forEach((val: any) => {
			ttlBdDcml += tmTDcml(val ?? `00:00`);
			ttlBdCnt++;
		});
		wakeArr.forEach((val: any) => {
			ttlWkDcml += tmTDcml(val ?? `00:00`);
			ttlWkCnt++;
		});
		sleepArr.forEach((val: any) => {
			ttlSlpDcml += tmTDcml(val ?? `00:00`);
			ttlSlpCnt++;
		});
	});

	findResult = {
		exerciseGoal: fndExerGl[0],
		exercise: findExercise,
		foodGoal: findFoodGoal[0],
		food: findFood,
		moneyGoal: fndMnyGl[0],
		money: findMoney,
		sleepGoal: fndSlpGl[0],
		sleep: {
			sleep_record_bedTime: dcmlTTm(
				ttlBdDcml / (ttlBdCnt || 1),
			),
			sleep_record_wakeTime: dcmlTTm(
				ttlWkDcml / (ttlWkCnt || 1),
			),
			sleep_record_sleepTime: dcmlTTm(
				ttlSlpDcml / (ttlSlpCnt || 1),
			),
		},
	};

	if (!findResult) {
		finalResult = null;
		statusResult = `fail`;
	} else {
		finalResult = findResult;
		statusResult = `success`;
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 2. scale (체중 조회) ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const scale = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let findRegDt: any = null;
	let fndIntScl: any = null;

	let initScale: any = null;
	let minScale: any = null;
	let maxScale: any = null;
	let curScale: any = null;

	let finalResult: any = null;
	let statusResult: string = ``;

	// 가입날짜 - 현재날짜
	findRegDt = await repository.scale.findRegDt(usrIdPrm);

	// 2024-08-04T15:30:20.805Z -> 2024-08-04
	const regDt: string = findRegDt?.user_regDt?.toISOString().slice(0, 10);
	const todayDt: string = DATE_param?.dateEnd;

	// 최초 체중 조회
	fndIntScl = await repository.scale.findInitScale(usrIdPrm);
	// 최소 체중 조회
	minScale = await repository.scale.findMinScale(usrIdPrm, regDt, todayDt);
	// 최대 체중 조회
	maxScale = await repository.scale.findMaxScale(usrIdPrm, regDt, todayDt);
	// 현재 체중 조회
	curScale = await repository.scale.findCurScale(usrIdPrm, regDt, todayDt);

	// 형식 포맷
	initScale = String(Number.parseFloat(fndIntScl?.user_initScale ?? `0`));
	minScale = String(Number.parseFloat(minScale?.minScale ?? `0`));
	maxScale = String(Number.parseFloat(maxScale?.maxScale ?? `0`));
	curScale = String(
		Number.parseFloat(curScale?.exercise_record_total_scale ?? `0`),
	);

	if (!fndIntScl && !minScale && !maxScale && !curScale) {
		finalResult = null;
		statusResult = `fail`;
	} else {
		finalResult = {
			initScale: initScale,
			minScale: minScale,
			maxScale: maxScale,
			curScale: curScale,
			dateStart: regDt,
			dateEnd: todayDt,
		};
		statusResult = `success`;
	}

	// 체중 업데이트
	await repository.scale.updateScale(
		usrIdPrm,
		initScale,
		minScale,
		maxScale,
		curScale,
	);

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 3-1. nutrition (영양소 조회) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const nutrition = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let findRegDt: any = null;
	let findTotalCnt: any = null;
	let fndIntNtrt: any = null;
	let fndAllInfo: any = null;

	let intAvKcIn: any = null;
	let ttlKclIntk: any = null;
	let ttlCrbIntk: any = null;
	let ttlPrtnIntk: any = null;
	let ttlFtIntk: any = null;

	let crAvgKclIntk: any = null;
	let crAvgCrbIntk: any = null;
	let crAvPrIn: any = null;
	let crAvgFtIntk: any = null;

	let finalResult: any = null;
	let statusResult: string = ``;

	// 가입날짜 - 현재날짜
	findRegDt = await repository.nutrition.findRegDt(usrIdPrm);

	// 2024-08-04T15:30:20.805Z -> 2024-08-04
	const regDt: string = findRegDt?.user_regDt?.toISOString().slice(0, 10);
	const todayDt: string = DATE_param?.dateEnd;

	// 데이터 총 개수 조회
	findTotalCnt = await repository.nutrition.findTotalCnt(
		usrIdPrm,
		regDt,
		todayDt,
	);
	// 최초 칼로리 목표 조회
	fndIntNtrt =
		await repository.nutrition.findInitNutrition(usrIdPrm);
	// 전체 영양 정보 조회
	fndAllInfo = await repository.nutrition.findAllInformation(
		usrIdPrm,
		regDt,
		todayDt,
	);

	// 형식 포맷
	intAvKcIn = String(
		Number.parseFloat(fndIntNtrt?.user_initAvgKcalIntake ?? `0`).toFixed(
			0,
		),
	);
	ttlKclIntk = String(
		Number.parseFloat(
			fndAllInfo?.food_record_total_kcal ?? `0`,
		).toFixed(0),
	);
	ttlCrbIntk = String(
		Number.parseFloat(
			fndAllInfo?.food_record_total_carb ?? `0`,
		).toFixed(0),
	);
	ttlPrtnIntk = String(
		Number.parseFloat(
			fndAllInfo?.food_record_total_protein ?? `0`,
		).toFixed(0),
	);
	ttlFtIntk = String(
		Number.parseFloat(fndAllInfo?.food_record_total_fat ?? `0`).toFixed(
			0,
		),
	);
	crAvgKclIntk = String(
		(Number.parseFloat(ttlKclIntk ?? `0`) / (findTotalCnt ?? 1)).toFixed(
			0,
		),
	);
	crAvgCrbIntk = String(
		(Number.parseFloat(ttlCrbIntk ?? `0`) / (findTotalCnt ?? 1)).toFixed(
			0,
		),
	);
	crAvPrIn = String(
		(
			Number.parseFloat(ttlPrtnIntk ?? `0`) / (findTotalCnt ?? 1)
		).toFixed(0),
	);
	crAvgFtIntk = String(
		(Number.parseFloat(ttlFtIntk ?? `0`) / (findTotalCnt ?? 1)).toFixed(0),
	);

	if (!fndIntNtrt && !fndAllInfo) {
		finalResult = null;
		statusResult = `fail`;
	} else {
		finalResult = {
			initAvgKcalIntake: intAvKcIn,
			totalKcalIntake: ttlKclIntk,
			totalCarbIntake: ttlCrbIntk,
			totalProteinIntake: ttlPrtnIntk,
			totalFatIntake: ttlFtIntk,
			curAvgKcalIntake: crAvgKclIntk,
			curAvgCarbIntake: crAvgCrbIntk,
			curAvgProteinIntake: crAvPrIn,
			curAvgFatIntake: crAvgFtIntk,
			dateStart: regDt,
			dateEnd: todayDt,
		};
		statusResult = `success`;
	}

	// 영양소 업데이트
	await repository.nutrition.updateNutrition(
		usrIdPrm,
		intAvKcIn,
		ttlKclIntk,
		ttlCrbIntk,
		ttlPrtnIntk,
		ttlFtIntk,
		crAvgKclIntk,
		crAvgCrbIntk,
		crAvPrIn,
		crAvgFtIntk,
	);

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 3-2. favorite (저장 음식 조회) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const favorite = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let findRegDt: any = null;
	let findFavorite: any = null;

	let finalResult: any = null;
	let statusResult: string = ``;

	// 가입날짜 - 현재날짜
	findRegDt = await repository.favorite.findRegDt(usrIdPrm);

	// 2024-08-04T15:30:20.805Z -> 2024-08-04
	const regDt: string = findRegDt?.user_regDt?.toISOString().slice(0, 10);
	const todayDt: string = DATE_param?.dateEnd;

	// 저장 음식 조회
	findFavorite = await repository.favorite.findFavorite(usrIdPrm);

	if (!findFavorite) {
		finalResult = null;
		statusResult = `fail`;
	} else {
		finalResult = {
			foodFavorite: findFavorite,
			dateStart: regDt,
			dateEnd: todayDt,
		};
		statusResult = `success`;
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 4. property (자산 조회) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const property = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let findRegDt: any = null;
	let fndIntPrpr: any = null;
	let fndAllInfo: any = null;

	let initProperty: any = null;
	let ttlIncmAll: any = null;
	let ttlExpnAll: any = null;
	let ttlIncmExcl: any = null;
	let ttlExpnExcl: any = null;
	let crPrprAll: any = null;
	let crPrprExcl: any = null;

	let finalResult: any = null;
	let statusResult: string = ``;

	// 가입날짜 - 현재날짜
	findRegDt = await repository.property.findRegDt(usrIdPrm);

	// 2024-08-04T15:30:20.805Z -> 2024-08-04
	const regDt: string = findRegDt?.user_regDt?.toISOString().slice(0, 10);
	const todayDt: string = DATE_param?.dateEnd;

	// 최초 자산 조회
	fndIntPrpr = await repository.property.findInitProperty(usrIdPrm);

	// 전체 자산 정보 조회
	fndAllInfo = await repository.property.findAllInformation(
		usrIdPrm,
		regDt,
		todayDt,
	);

	// 형식 포맷
	initProperty = String(
		Number.parseFloat(fndIntPrpr?.user_initProperty ?? `0`),
	);
	ttlIncmAll = String(
		Number.parseFloat(
			fndAllInfo?.allResult?.money_record_total_income ?? `0`,
		),
	);
	ttlExpnAll = String(
		Number.parseFloat(
			fndAllInfo?.allResult?.money_record_total_expense ?? `0`,
		),
	);
	ttlIncmExcl = String(
		Number.parseFloat(
			fndAllInfo?.exclusionResult?.money_record_total_income ?? `0`,
		),
	);
	ttlExpnExcl = String(
		Number.parseFloat(
			fndAllInfo?.exclusionResult?.money_record_total_expense ?? `0`,
		),
	);
	crPrprAll = String(
		Number.parseFloat(fndIntPrpr?.user_initProperty ?? `0`) +
			Number.parseFloat(ttlIncmAll) -
			Number.parseFloat(ttlExpnAll),
	);
	crPrprExcl = String(
		Number.parseFloat(fndIntPrpr?.user_initProperty ?? `0`) +
			Number.parseFloat(ttlIncmExcl) -
			Number.parseFloat(ttlExpnExcl),
	);

	if (!fndIntPrpr && !fndAllInfo) {
		finalResult = null;
		statusResult = `fail`;
	} else {
		statusResult = `success`;
		finalResult = {
			initProperty: initProperty,
			totalIncomeAll: ttlIncmAll,
			totalIncomeExclusion: ttlIncmExcl,
			totalExpenseAll: ttlExpnAll,
			totalExpenseExclusion: ttlExpnExcl,
			curPropertyAll: crPrprAll,
			curPropertyExclusion: crPrprExcl,
			dateStart: regDt,
			dateEnd: todayDt,
		};
	}

	// 자산 업데이트
	await repository.property.updateProperty(
		usrIdPrm,
		initProperty,
		ttlIncmAll,
		ttlIncmExcl,
		ttlExpnAll,
		ttlExpnExcl,
		crPrprAll,
		crPrprExcl,
	);

	return {
		status: statusResult,
		result: finalResult,
	};
};

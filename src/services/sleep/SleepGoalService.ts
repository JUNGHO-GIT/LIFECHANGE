/**
 * @file SleepGoalService.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { strToDecimal, decimalToStr } from "@assets/scripts/utils";
import * as repository from "@repositories/sleep/SleepGoalRepository";

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
				const curDateType: any = curr.sleep_goal_dateType;
				const curDateStart: any = curr.sleep_goal_dateStart;
				const curDateEnd: any = curr.sleep_goal_dateEnd;

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
	let ttlCntRes: number = 0;
	let statusResult: string = ``;

	// date 변수 선언
	const dtTypOrdr: string[] = [`day`, `week`, `month`, `year`];
	const dateType: string = DATE_param?.dateType;
	const dateStart: string = DATE_param?.dateStart;
	const dateEnd: string = DATE_param?.dateEnd;

	// sort, page 변수 선언
	const sort: 1 | -1 = PAGING_param?.sort === `asc` ? 1 : -1;
	const page: number = PAGING_param?.page ?? 1;

	findResult = await repository.listGoal(
		usrIdPrm,
		dateType,
		dateStart,
		dateEnd,
		sort,
		page,
	);
	findResult?.sort((a: any, b: any) => {
		const dateTypeA: any = a.sleep_goal_dateType;
		const dateTypeB: any = b.sleep_goal_dateType;
		const dateStartA: Date = new Date(a.sleep_goal_dateStart);
		const dateStartB: Date = new Date(b.sleep_goal_dateStart);
		const sortOrder: 1 | -1 = sort;

		const dateTypeDiff: number =
			dtTypOrdr.indexOf(dateTypeA) - dtTypOrdr.indexOf(dateTypeB);
		const dateDiff: number = dateStartA.getTime() - dateStartB.getTime();

		if (dateTypeDiff !== 0) {
			return dateTypeDiff;
		}
		return sortOrder === 1 ? dateDiff : -dateDiff;
	});

	if (!findResult || findResult?.length <= 0) {
		finalResult = [];
		statusResult = `fail`;
	} else {
		finalResult = await Promise.all(
			findResult.map(async (goal: any) => {
				const dateStart: string = goal?.sleep_goal_dateStart;
				const dateEnd: string = goal?.sleep_goal_dateEnd;

				const listRecord: any[] = await repository.listRecord(
					usrIdPrm,
					dateType,
					dateStart,
					dateEnd,
				);

				// 각 평균값 구하기
				const bedTime: number =
					listRecord.reduce(
						(acc: any, curr: any) =>
							acc + strToDecimal(curr?.sleep_record_bedTime),
						0,
					) / listRecord?.length;
				const wakeTime: number =
					listRecord.reduce(
						(acc: any, curr: any) =>
							acc + strToDecimal(curr?.sleep_record_wakeTime),
						0,
					) / listRecord?.length;
				const sleepTime: number =
					listRecord.reduce(
						(acc: any, curr: any) =>
							acc + strToDecimal(curr?.sleep_record_sleepTime),
						0,
					) / listRecord?.length;

				return {
					...goal,
					sleep_record_bedTime: decimalToStr(bedTime),
					sleep_record_wakeTime: decimalToStr(wakeTime),
					sleep_record_sleepTime: decimalToStr(sleepTime),
				};
			}),
		);
		statusResult = `success`;
		ttlCntRes = finalResult.length;
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

	// record = section?.length
	// goal = 0 or 1
	if (!findResult) {
		finalResult = null;
		statusResult = `fail`;
		secCntRes = 0;
	} else {
		finalResult = findResult;
		statusResult = `success`;
		secCntRes = 1;
	}

	return {
		status: statusResult,
		sectionCnt: secCntRes,
		result: finalResult,
	};
};

// 3. create ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const create = async (
	usrIdPrm: string,
	OBJECT_param: any,
	DATE_param: any,
) => {
	// result 변수 선언
	let findResult: any = null;
	let deleteResult: any = null;
	let createResult: any = null;
	let finalResult: any = null;
	let statusResult: string = ``;

	// date 변수 선언
	const exstDtTyp: string = OBJECT_param.sleep_goal_dateType;
	const exstDtStrt: string = OBJECT_param.sleep_goal_dateStart;
	const exstDtEnd: string = OBJECT_param.sleep_goal_dateEnd;
	const dateType: string = DATE_param?.dateType;
	const dateStart: string = DATE_param?.dateStart;
	const dateEnd: string = DATE_param?.dateEnd;

	findResult = await repository.detail(
		usrIdPrm,
		exstDtTyp,
		exstDtStrt,
		exstDtEnd,
	);

	if (!findResult) {
		createResult = await repository.create(
			usrIdPrm,
			OBJECT_param,
			dateType,
			dateStart,
			dateEnd,
		);
	} else {
		deleteResult = await repository.deletes(
			usrIdPrm,
			exstDtTyp,
			exstDtStrt,
			exstDtEnd,
		);
		if (!deleteResult) {
			finalResult = null;
			statusResult = `fail`;
		} else {
			createResult = await repository.create(
				usrIdPrm,
				OBJECT_param,
				dateType,
				dateStart,
				dateEnd,
			);
		}
	}

	if (!createResult) {
		finalResult = null;
		statusResult = `fail`;
	} else {
		finalResult = createResult;
		statusResult = `success`;
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 4. update ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const update = async (
	usrIdPrm: string,
	OBJECT_param: any,
	DATE_param: any,
	type_param: string,
) => {
	// result 변수 선언
	let findResult: any = null;
	let deleteResult: any = null;
	let updateResult: any = null;
	let finalResult: any = null;
	let statusResult: string = ``;

	// date 변수 선언
	const exstDtTyp: string = OBJECT_param.sleep_goal_dateType;
	const exstDtStrt: string = OBJECT_param.sleep_goal_dateStart;
	const exstDtEnd: string = OBJECT_param.sleep_goal_dateEnd;
	const dateType: string = DATE_param?.dateType;
	const dateStart: string = DATE_param?.dateStart;
	const dateEnd: string = DATE_param?.dateEnd;

	findResult = await repository.detail(
		usrIdPrm,
		exstDtTyp,
		exstDtStrt,
		exstDtEnd,
	);

	if (!findResult) {
		finalResult = null;
		statusResult = `fail`;
	} else {
		// update (기존항목 유지 + 타겟항목으로 수정)
		if (type_param === `update`) {
			updateResult = await repository.update.update(
				usrIdPrm,
				OBJECT_param,
				dateType,
				dateStart,
				dateEnd,
			);
			if (!updateResult) {
				finalResult = null;
				statusResult = `fail`;
			} else {
				finalResult = updateResult;
				statusResult = `success`;
			}
		}
		// replace (기존항목 제거 + 타겟항목을 교체)
		else if (type_param === `replace`) {
			deleteResult = await repository.deletes(
				usrIdPrm,
				exstDtTyp,
				exstDtStrt,
				exstDtEnd,
			);
			if (!deleteResult) {
				finalResult = null;
				statusResult = `fail`;
			} else {
				updateResult = await repository.update.replace(
					usrIdPrm,
					OBJECT_param,
					dateType,
					dateStart,
					dateEnd,
				);
			}
			if (!updateResult) {
				finalResult = null;
				statusResult = `fail`;
			} else {
				finalResult = updateResult;
				statusResult = `success`;
			}
		}
	}

	if (!updateResult) {
		finalResult = null;
		statusResult = `fail`;
	} else {
		finalResult = updateResult;
		statusResult = `success`;
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 5. delete ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const deletes = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let deleteResult: any = null;
	let finalResult: any = null;
	let statusResult: string = ``;

	// date 변수 선언
	const dateType: string = DATE_param?.dateType;
	const dateStart: string = DATE_param?.dateStart;
	const dateEnd: string = DATE_param?.dateEnd;

	deleteResult = await repository.deletes(
		usrIdPrm,
		dateType,
		dateStart,
		dateEnd,
	);

	if (!deleteResult) {
		finalResult = null;
		statusResult = `fail`;
	} else {
		finalResult = deleteResult;
		statusResult = `success`;
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

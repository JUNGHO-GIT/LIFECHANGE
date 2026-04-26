/**
 * @file ExerciseGoalService.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { decimalToStr, strToDecimal } from "@assets/scripts/utils";
import * as repository from "@repositories/exercise/ExerciseGoalRepository";

// 0. exist ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const exist = async (user_id_param: string, DATE_param: any) => {
	// result 변수 선언
	let findResult: any = null;
	let finalResult: any = null;
	let statusResult: string = ``;

	// date 변수 선언
	const dateType: string = DATE_param?.dateType;
	const dateStart: string = DATE_param?.dateStart;
	const dateEnd: string = DATE_param?.dateEnd;

	findResult = await repository.exist(
		user_id_param,
		dateType,
		dateStart,
		dateEnd,
	);

	if (!findResult ?? findResult?.length <= 0) {
		finalResult = null;
		statusResult = `fail`;
	} else {
		statusResult = `success`;
		finalResult = findResult.reduce(
			(acc: any, curr: any) => {
				const curDateType: any = curr.exercise_goal_dateType;
				const curDateStart: any = curr.exercise_goal_dateStart;
				const curDateEnd: any = curr.exercise_goal_dateEnd;

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
	user_id_param: string,
	DATE_param: any,
	PAGING_param: any,
) => {
	// result 변수 선언
	let findResult: any = null;
	let finalResult: any = null;
	let totalCntResult: number = 0;
	let statusResult: string = ``;

	// date 변수 선언
	const dateTypeOrder: string[] = [`day`, `week`, `month`, `year`];
	const dateType: string = DATE_param?.dateType;
	const dateStart: string = DATE_param?.dateStart;
	const dateEnd: string = DATE_param?.dateEnd;

	// sort, page 변수 선언
	const sort: 1 | -1 = PAGING_param?.sort === `asc` ? 1 : -1;
	const page: number = PAGING_param?.page ?? 1;

	findResult = await repository.listGoal(
		user_id_param,
		dateType,
		dateStart,
		dateEnd,
		sort,
		page,
	);
	findResult?.sort((a: any, b: any) => {
		const dateTypeA: string = a.exercise_goal_dateType;
		const dateTypeB: string = b.exercise_goal_dateType;
		const dateStartA: Date = new Date(a.exercise_goal_dateStart);
		const dateStartB: Date = new Date(b.exercise_goal_dateStart);
		const sortOrder: number = sort;

		const dateTypeDiff: number =
			dateTypeOrder.indexOf(dateTypeA) - dateTypeOrder.indexOf(dateTypeB);
		const dateDiff: number = dateStartA.getTime() - dateStartB.getTime();

		if (dateTypeDiff !== 0) {
			return dateTypeDiff;
		}
		return sortOrder === 1 ? dateDiff : -dateDiff;
	});

	if (!findResult ?? findResult?.length <= 0) {
		finalResult = [];
		statusResult = `fail`;
	} else {
		finalResult = await Promise.all(
			findResult.map(async (goal: any) => {
				const dateStart: string = goal?.exercise_goal_dateStart;
				const dateEnd: string = goal?.exercise_goal_dateEnd;

				const listRecord: any[] = await repository.listRecord(
					user_id_param,
					dateType,
					dateStart,
					dateEnd,
				);

				// totalVolume 이 0이 아닌 경우의 수를 계산해서 total count를 구함
				const exerciseTotalCount: number = listRecord.reduce(
					(acc: any, curr: any) =>
						acc + (curr?.exercise_record_total_volume !== `0` ? 1 : 0),
					0,
				);
				const exerciseTotalVolume: number = listRecord.reduce(
					(acc: any, curr: any) =>
						acc + Number.parseFloat(curr?.exercise_record_total_volume ?? `0`),
					0,
				);
				const exerciseTotalCardio: number = listRecord.reduce(
					(acc: any, curr: any) =>
						acc + strToDecimal(curr?.exercise_record_total_cardio ?? `00:00`),
					0,
				);
				const exerciseCurScale: string = listRecord.reduce(
					(latest: any, curr: any) => {
						if (curr?.exercise_record_total_scale) {
							return curr.exercise_record_total_scale;
						}
						return latest;
					},
					`0`,
				);

				return {
					...goal,
					exercise_record_total_count: String(exerciseTotalCount),
					exercise_record_total_volume: String(exerciseTotalVolume.toFixed(0)),
					exercise_record_total_cardio: decimalToStr(exerciseTotalCardio),
					exercise_record_total_scale: String(exerciseCurScale),
				};
			}),
		);
		statusResult = `success`;
		totalCntResult = finalResult.length;
	}

	return {
		status: statusResult,
		totalCnt: totalCntResult,
		result: finalResult,
	};
};

// 2. detail ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const detail = async (user_id_param: string, DATE_param: any) => {
	// result 변수 선언
	let findResult: any = null;
	let finalResult: any = null;
	let statusResult: string = ``;
	let sectionCntResult: number = 0;

	// date 변수 선언
	const dateType: string = DATE_param?.dateType;
	const dateStart: string = DATE_param?.dateStart;
	const dateEnd: string = DATE_param?.dateEnd;

	findResult = await repository.detail(
		user_id_param,
		dateType,
		dateStart,
		dateEnd,
	);

	// record = section?.length
	// goal = 0 or 1
	if (!findResult) {
		finalResult = null;
		statusResult = `fail`;
		sectionCntResult = 0;
	} else {
		finalResult = findResult;
		statusResult = `success`;
		sectionCntResult = 1;
	}

	return {
		status: statusResult,
		sectionCnt: sectionCntResult,
		result: finalResult,
	};
};

// 3. create ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const create = async (
	user_id_param: string,
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
	const existingDateType: string = OBJECT_param.exercise_goal_dateType;
	const existingDateStart: string = OBJECT_param.exercise_goal_dateStart;
	const existingDateEnd: string = OBJECT_param.exercise_goal_dateEnd;
	const dateType: string = DATE_param?.dateType;
	const dateStart: string = DATE_param?.dateStart;
	const dateEnd: string = DATE_param?.dateEnd;

	findResult = await repository.detail(
		user_id_param,
		existingDateType,
		existingDateStart,
		existingDateEnd,
	);

	if (!findResult) {
		createResult = await repository.create(
			user_id_param,
			OBJECT_param,
			dateType,
			dateStart,
			dateEnd,
		);
	} else {
		deleteResult = await repository.deletes(
			user_id_param,
			existingDateType,
			existingDateStart,
			existingDateEnd,
		);
		if (!deleteResult) {
			finalResult = null;
			statusResult = `fail`;
		} else {
			createResult = await repository.create(
				user_id_param,
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
	user_id_param: string,
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
	const existingDateType: string = OBJECT_param.exercise_goal_dateType;
	const existingDateStart: string = OBJECT_param.exercise_goal_dateStart;
	const existingDateEnd: string = OBJECT_param.exercise_goal_dateEnd;
	const dateType: string = DATE_param?.dateType;
	const dateStart: string = DATE_param?.dateStart;
	const dateEnd: string = DATE_param?.dateEnd;

	findResult = await repository.detail(
		user_id_param,
		existingDateType,
		existingDateStart,
		existingDateEnd,
	);

	if (!findResult) {
		finalResult = null;
		statusResult = `fail`;
	} else {
		// update (기존항목 유지 + 타겟항목으로 수정)
		if (type_param === `update`) {
			updateResult = await repository.update.update(
				user_id_param,
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
				user_id_param,
				existingDateType,
				existingDateStart,
				existingDateEnd,
			);
			if (!deleteResult) {
				finalResult = null;
				statusResult = `fail`;
			} else {
				updateResult = await repository.update.replace(
					user_id_param,
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
export const deletes = async (user_id_param: string, DATE_param: any) => {
	// result 변수 선언
	let deleteResult: any = null;
	let finalResult: any = null;
	let statusResult: string = ``;

	// date 변수 선언
	const dateType: string = DATE_param?.dateType;
	const dateStart: string = DATE_param?.dateStart;
	const dateEnd: string = DATE_param?.dateEnd;

	deleteResult = await repository.deletes(
		user_id_param,
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

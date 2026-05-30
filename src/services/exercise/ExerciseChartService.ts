/**
 * @file ExerciseChartService.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { timeToDecimal as tmTDcml } from "@assets/scripts/utils";
import * as repository from "@repositories/exercise/ExerciseChartRepository";
import moment from "moment-timezone";

// 1-1. chart (bar - today) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const bar = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let fndResGl: any[] = [];
	let fndResRec: any[] = [];
	let finalResult: any = [];
	let statusResult: string = ``;

	// date 변수 정의
	const dateStart: string = DATE_param?.dateStart;
	const dateEnd: string = DATE_param?.dateEnd;

	try {
		// promise 사용하여 병렬 처리
		[fndResGl, fndResRec] = await Promise.all([
			repository.barGoal(usrIdPrm, dateStart, dateEnd),
			repository.barRecord(usrIdPrm, dateStart, dateEnd),
		]);

		// findResult 배열을 순회하며 결과 저장
		finalResult = fndResGl?.map((item: any) => ({
			name: String(`scale`),
			date: String(dateStart),
			goal: String(item.exercise_goal_scale ?? `0`),
			record: String(fndResRec[0]?.exercise_record_total_scale ?? `0`),
		}));
		statusResult = `success`;
	} catch {
		finalResult = [];
		statusResult = `fail`;
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 1-2. chart (bar - week) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const barWeek = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let fndResGl: any[] = [];
	let fndResRec: any[] = [];
	let finalResult: any = [];
	let statusResult: string = ``;

	// date 변수 정의
	const dateStart: string = DATE_param.weekStartFmt;
	const dateEnd: string = DATE_param.weekEndFmt;
	const weekStartFmt: string = DATE_param.weekStartFmt;

	// ex. mon, tue
	const name: string[] = [`mon`, `tue`, `wed`, `thu`, `fri`, `sat`, `sun`];

	// ex. 00-00
	const date: string[] = Array.from({ length: 7 }, (_, i) => {
		return moment(weekStartFmt).clone().add(i, `days`).format(`MM-DD`);
	});

	try {
		// promise 사용하여 병렬 처리
		[fndResGl, fndResRec] = await Promise.all([
			repository.barGoal(usrIdPrm, dateStart, dateEnd),
			repository.barRecord(usrIdPrm, dateStart, dateEnd),
		]);

		// name 배열 순회하며 결과 저장
		name.forEach((data: any, index: number) => {
			const targetDay: string = moment(weekStartFmt)
				.clone()
				.add(index, `days`)
				.format(`YYYY-MM-DD`);

			const fndIdxGl: number = fndResGl?.findIndex(
				(item: any) => item.exercise_goal_dateStart === targetDay,
			);

			const fndIdxRec: number = fndResRec?.findIndex(
				(item: any) => item.exercise_record_dateStart === targetDay,
			);

			finalResult.push({
				name: String(data),
				date: String(date[index]),
				goal:
					fndIdxGl !== -1
						? String(fndResGl[fndIdxGl]?.exercise_goal_scale)
						: `0`,
				record:
					fndIdxRec !== -1
						? String(
								fndResRec[fndIdxRec]?.exercise_record_total_scale,
							)
						: `0`,
			});
		});
		statusResult = `success`;
	} catch {
		finalResult = [];
		statusResult = `fail`;
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 1-3. chart (bar - month) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const barMonth = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let fndResGl: any[] = [];
	let fndResRec: any[] = [];
	let finalResult: any = [];
	let statusResult: string = ``;

	// date 변수 정의
	const dateStart: string = DATE_param.monthStartFmt;
	const dateEnd: string = DATE_param.monthEndFmt;
	const mnthStrtFmt: string = DATE_param.monthStartFmt;
	const monthEndFmt: string = DATE_param.monthEndFmt;

	// ex. 00일
	const name: string[] = Array.from(
		{ length: moment(monthEndFmt).date() },
		(_, i) => `${i + 1}`,
	);

	// ex. 00-00
	const date: string[] = Array.from(
		{ length: moment(monthEndFmt).date() },
		(_, i) => moment(mnthStrtFmt).clone().add(i, `days`).format(`MM-DD`),
	);

	try {
		// promise 사용하여 병렬 처리
		[fndResGl, fndResRec] = await Promise.all([
			repository.barGoal(usrIdPrm, dateStart, dateEnd),
			repository.barRecord(usrIdPrm, dateStart, dateEnd),
		]);

		// name 배열 순회하며 결과 저장
		name.forEach((data: any, index: number) => {
			const targetDay: string = moment(mnthStrtFmt)
				.clone()
				.add(index, `days`)
				.format(`YYYY-MM-DD`);

			const fndIdxGl: number = fndResGl?.findIndex(
				(item: any) => item.exercise_goal_dateStart === targetDay,
			);

			const fndIdxRec: number = fndResRec?.findIndex(
				(item: any) => item.exercise_record_dateStart === targetDay,
			);

			finalResult.push({
				name: String(data),
				date: String(date[index]),
				goal:
					fndIdxGl !== -1
						? String(fndResGl[fndIdxGl]?.exercise_goal_scale)
						: `0`,
				record:
					fndIdxRec !== -1
						? String(
								fndResRec[fndIdxRec]?.exercise_record_total_scale,
							)
						: `0`,
			});
		});
		statusResult = `success`;
	} catch {
		finalResult = [];
		statusResult = `fail`;
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 2-1. chart (pie - week) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
// pie 차트는 무조건 int 리턴
export const pieWeek = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let fndResPrt: any[] = [];
	let fndResTtl: any[] = [];
	let fnlResPrt: any[] = [];
	let fnlResTtl: any[] = [];
	let finalResult: any = [];
	let statusResult: string = ``;

	// date 변수 정의
	const dateStart: string = DATE_param.weekStartFmt;
	const dateEnd: string = DATE_param.weekEndFmt;

	try {
		// promise 사용하여 병렬 처리
		[fndResPrt, fndResTtl] = await Promise.all([
			repository.piePart(usrIdPrm, dateStart, dateEnd),
			repository.pieTitle(usrIdPrm, dateStart, dateEnd),
		]);

		// findResultPart 배열을 순회하며 결과 저장
		fnlResPrt = fndResPrt?.map((item: any) => ({
			name: String(item._id),
			value: Number(item.value) ?? 0,
		}));

		// findResultTitle 배열을 순회하며 결과 저장
		fnlResTtl = fndResTtl?.map((item: any) => ({
			name: String(item._id),
			value: Number(item.value) ?? 0,
		}));

		// 데이터가 없을 때 기본값 설정
		if (!fnlResPrt || fnlResPrt.length === 0) {
			fnlResPrt = [{ name: `Empty`, value: 100 }];
		}
		if (!fnlResTtl || fnlResTtl.length === 0) {
			fnlResTtl = [{ name: `Empty`, value: 100 }];
		}

		finalResult = {
			part: fnlResPrt,
			title: fnlResTtl,
		};
		statusResult = `success`;
	} catch {
		finalResult = [];
		statusResult = `fail`;
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 2-2. chart (pie - month) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
// pie 차트는 무조건 int 리턴
export const pieMonth = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let fndResPrt: any[] = [];
	let fndResTtl: any[] = [];
	let fnlResPrt: any[] = [];
	let fnlResTtl: any[] = [];
	let finalResult: any = [];
	let statusResult: string = ``;

	// date 변수 정의
	const dateStart: string = DATE_param.monthStartFmt;
	const dateEnd: string = DATE_param.monthEndFmt;

	try {
		// promise 사용하여 병렬 처리
		[fndResPrt, fndResTtl] = await Promise.all([
			repository.piePart(usrIdPrm, dateStart, dateEnd),
			repository.pieTitle(usrIdPrm, dateStart, dateEnd),
		]);

		// findResultPart 배열을 순회하며 결과 저장
		fnlResPrt = fndResPrt?.map((item: any) => ({
			name: String(item._id),
			value: Number(item.value) ?? 0,
		}));

		// findResultTitle 배열을 순회하며 결과 저장
		fnlResTtl = fndResTtl?.map((item: any) => ({
			name: String(item._id),
			value: Number(item.value) ?? 0,
		}));

		// 데이터가 없을 때 기본값 설정
		if (!fnlResPrt || fnlResPrt.length === 0) {
			fnlResPrt = [{ name: `Empty`, value: 100 }];
		}
		if (!fnlResTtl || fnlResTtl.length === 0) {
			fnlResTtl = [{ name: `Empty`, value: 100 }];
		}

		finalResult = {
			part: fnlResPrt,
			title: fnlResTtl,
		};
		statusResult = `success`;
	} catch {
		finalResult = [];
		statusResult = `fail`;
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 2-4. chart (pie - year) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
// pie 차트는 무조건 int 리턴
export const pieYear = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let fndResPrt: any[] = [];
	let fndResTtl: any[] = [];
	let fnlResPrt: any[] = [];
	let fnlResTtl: any[] = [];
	let finalResult: any = [];
	let statusResult: string = ``;

	// date 변수 정의
	const dateStart: string = DATE_param.yearStartFmt;
	const dateEnd: string = DATE_param.yearEndFmt;

	try {
		// promise 사용하여 병렬 처리
		[fndResPrt, fndResTtl] = await Promise.all([
			repository.piePart(usrIdPrm, dateStart, dateEnd),
			repository.pieTitle(usrIdPrm, dateStart, dateEnd),
		]);

		// findResultPart 배열을 순회하며 결과 저장
		fnlResPrt = fndResPrt?.map((item: any) => ({
			name: String(item._id),
			value: Number(item.value) ?? 0,
		}));

		// findResultTitle 배열을 순회하며 결과 저장
		fnlResTtl = fndResTtl?.map((item: any) => ({
			name: String(item._id),
			value: Number(item.value) ?? 0,
		}));

		// 데이터가 없을 때 기본값 설정
		if (!fnlResPrt || fnlResPrt.length === 0) {
			fnlResPrt = [{ name: `Empty`, value: 100 }];
		}
		if (!fnlResTtl || fnlResTtl.length === 0) {
			fnlResTtl = [{ name: `Empty`, value: 100 }];
		}

		finalResult = {
			part: fnlResPrt,
			title: fnlResTtl,
		};
		statusResult = `success`;
	} catch {
		finalResult = {
			part: [{ name: `Empty`, value: 100 }],
			title: [{ name: `Empty`, value: 100 }],
		};
		statusResult = `success`;
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 3-1. chart (line - week) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const lineWeek = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let fndResScl: any[] = [];
	let fndResVol: any[] = [];
	let fndResCrd: any[] = [];
	const fnlResScl: any[] = [];
	const fnlResVol: any[] = [];
	const fnlResCrd: any[] = [];
	let finalResult: any = [];
	let statusResult: string = ``;

	// date 변수 정의 (현재 월의 전체 범위)
	const mnthStrtFmt: string = moment(DATE_param.weekStartFmt)
		.startOf(`month`)
		.format(`YYYY-MM-DD`);
	const monthEndFmt: string = moment(DATE_param.weekStartFmt)
		.endOf(`month`)
		.format(`YYYY-MM-DD`);
	const dateStart: string = mnthStrtFmt;
	const dateEnd: string = monthEndFmt;

	// ex. 1주, 2주, 3주, 4주, 5주
	const name: string[] = [`1주`, `2주`, `3주`, `4주`, `5주`];

	// 해당 월의 1일이 포함된 주의 시작일 (월요일 기준)
	const frstWkStrt: moment.Moment =
		moment(mnthStrtFmt).startOf(`isoWeek`);

	// 주차별 날짜 범위 계산 (해당 월의 날짜가 포함된 주만)
	const weekRanges: { start: string; end: string; label: string }[] = [];
	const curWkStrt: moment.Moment = moment(frstWkStrt);
	let weekIndex: number = 0;

	while (weekIndex < 6) {
		const weekEnd: moment.Moment = moment(curWkStrt).add(6, `days`);
		const weekEndDate: string = weekEnd.format(`YYYY-MM-DD`);
		const wkStrtDt: string = curWkStrt.format(`YYYY-MM-DD`);

		// 해당 주에 현재 월의 날짜가 하나라도 포함되어 있는지 확인
		const hasMonthDate: boolean =
			wkStrtDt <= monthEndFmt && weekEndDate >= mnthStrtFmt;

		hasMonthDate &&
			weekRanges.push({
				start: wkStrtDt,
				end: weekEndDate,
				label: curWkStrt.format(`MM-DD`),
			});

		curWkStrt.add(7, `days`);
		weekIndex++;

		// 주의 시작일이 다음 달로 넘어가면 중단
		curWkStrt.isAfter(moment(monthEndFmt).add(7, `days`)) &&
			(weekIndex = 6);
	}

	try {
		// promise 사용하여 병렬 처리
		[fndResScl, fndResVol, fndResCrd] = await Promise.all([
			repository.lineScale(usrIdPrm, dateStart, dateEnd),
			repository.lineVolume(usrIdPrm, dateStart, dateEnd),
			repository.lineCardio(usrIdPrm, dateStart, dateEnd),
		]);

		// 주차별 총합 계산
		weekRanges.forEach((range: any, index: number) => {
			let weekScaleSum: number = 0;
			let wkVolSm: number = 0;
			let wkCrdSm: number = 0;

			fndResScl?.forEach((item: any) => {
				const itemDate: string = item.exercise_record_dateStart;
				itemDate >= range.start &&
					itemDate <= range.end &&
					(weekScaleSum += Number(item.exercise_record_total_scale ?? 0));
			});

			fndResVol?.forEach((item: any) => {
				const itemDate: string = item.exercise_record_dateStart;
				itemDate >= range.start &&
					itemDate <= range.end &&
					(wkVolSm += Number(item.exercise_record_total_volume ?? 0));
			});

			fndResCrd?.forEach((item: any) => {
				const itemDate: string = item.exercise_record_dateStart;
				itemDate >= range.start &&
					itemDate <= range.end &&
					(wkCrdSm += tmTDcml(
						item.exercise_record_total_cardio ?? `00:00`,
					));
			});

			fnlResScl.push({
				name: String(name[index]),
				date: String(`${range.start} - ${range.end}`),
				scale: String(weekScaleSum),
			});
			fnlResVol.push({
				name: String(name[index]),
				date: String(`${range.start} - ${range.end}`),
				volume: String(wkVolSm),
			});
			fnlResCrd.push({
				name: String(name[index]),
				date: String(`${range.start} - ${range.end}`),
				cardio: String(wkCrdSm),
			});
		});

		finalResult = {
			scale: fnlResScl,
			volume: fnlResVol,
			cardio: fnlResCrd,
		};
		statusResult = `success`;
	} catch {
		finalResult = [];
		statusResult = `fail`;
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 3-2. chart (line - month) ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const lineMonth = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let fndResScl: any[] = [];
	let fndResVol: any[] = [];
	let fndResCrd: any[] = [];
	const fnlResScl: any[] = [];
	const fnlResVol: any[] = [];
	const fnlResCrd: any[] = [];
	let finalResult: any = [];
	let statusResult: string = ``;

	// date 변수 정의 (현재 연도 전체 범위)
	const yearStartFmt: string = moment(DATE_param.monthStartFmt)
		.startOf(`year`)
		.format(`YYYY-MM-DD`);
	const yearEndFmt: string = moment(DATE_param.monthStartFmt)
		.endOf(`year`)
		.format(`YYYY-MM-DD`);
	const dateStart: string = yearStartFmt;
	const dateEnd: string = yearEndFmt;

	// ex. 1월, 2월, ..., 12월
	const name: string[] = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);

	// 월별 날짜 범위 계산
	const monthRanges: { start: string; end: string; label: string }[] =
		Array.from({ length: 12 }, (_v, i: number) => {
			const monthStart: moment.Moment = moment(yearStartFmt)
				.add(i, `months`)
				.startOf(`month`);
			const monthEnd: moment.Moment = moment(monthStart).endOf(`month`);
			return {
				start: monthStart.format(`YYYY-MM-DD`),
				end: monthEnd.format(`YYYY-MM-DD`),
				label: monthStart.format(`MM`),
			};
		});

	try {
		// promise 사용하여 병렬 처리
		[fndResScl, fndResVol, fndResCrd] = await Promise.all([
			repository.lineScale(usrIdPrm, dateStart, dateEnd),
			repository.lineVolume(usrIdPrm, dateStart, dateEnd),
			repository.lineCardio(usrIdPrm, dateStart, dateEnd),
		]);

		// 월별 총합 계산
		monthRanges.forEach((range: any, index: number) => {
			let mnthSclSm: number = 0;
			let mnthVolSm: number = 0;
			let mnthCrdSm: number = 0;

			fndResScl?.forEach((item: any) => {
				const itemDate: string = item.exercise_record_dateStart;
				itemDate >= range.start &&
					itemDate <= range.end &&
					(mnthSclSm += Number(item.exercise_record_total_scale ?? 0));
			});

			fndResVol?.forEach((item: any) => {
				const itemDate: string = item.exercise_record_dateStart;
				itemDate >= range.start &&
					itemDate <= range.end &&
					(mnthVolSm += Number(item.exercise_record_total_volume ?? 0));
			});

			fndResCrd?.forEach((item: any) => {
				const itemDate: string = item.exercise_record_dateStart;
				itemDate >= range.start &&
					itemDate <= range.end &&
					(mnthCrdSm += tmTDcml(
						item.exercise_record_total_cardio ?? `00:00`,
					));
			});

			fnlResScl.push({
				name: String(name[index]),
				date: String(`${range.start} - ${range.end}`),
				scale: String(mnthSclSm),
			});
			fnlResVol.push({
				name: String(name[index]),
				date: String(`${range.start} - ${range.end}`),
				volume: String(mnthVolSm),
			});
			fnlResCrd.push({
				name: String(name[index]),
				date: String(`${range.start} - ${range.end}`),
				cardio: String(mnthCrdSm),
			});
		});

		finalResult = {
			scale: fnlResScl,
			volume: fnlResVol,
			cardio: fnlResCrd,
		};
		statusResult = `success`;
	} catch {
		finalResult = [];
		statusResult = `fail`;
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 4-1. chart (avg - week) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const avgWeek = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let fndResVol: any[] = [];
	let fndResCrd: any[] = [];
	const fnlResVol: any[] = [];
	const fnlResCrd: any[] = [];
	let finalResult: any = [];
	let statusResult: string = ``;

	// sum, count 변수 선언
	const sumVolume: number[] = Array.from({ length: 5 }).fill(0);
	const sumCardio: number[] = Array.from({ length: 5 }).fill(0);
	const cntRecsVol: number[] = Array.from({ length: 5 }).fill(0);
	const cntRecsCrd: number[] = Array.from({ length: 5 }).fill(0);

	// date 변수 정의
	const mnthStrtFmt: string = DATE_param.monthStartFmt;

	// weekStartDate 정의
	const wkStrtDt: moment.Moment[] = Array.from({ length: 5 }, (_, i) =>
		moment(mnthStrtFmt).startOf(`month`).add(i, `weeks`),
	);

	// ex. 00주차
	const name: string[] = Array.from({ length: 5 }, (_, i) => `week${i + 1}`);

	// ex. 00-00 - 00-00
	const date: string[] = Array.from({ length: 5 }, (_, i) => {
		const startOfWeek: string = wkStrtDt[i]
			.clone()
			.startOf(`isoWeek`)
			.format(`MM-DD`);
		const endOfWeek: string = wkStrtDt[i]
			.clone()
			.endOf(`isoWeek`)
			.format(`MM-DD`);
		return `${startOfWeek} - ${endOfWeek}`;
	});

	try {
		// promise 사용하여 병렬 처리
		const prllRes: {
			findResultVolume: any[];
			findResultCardio: any[];
			index: number;
		}[] = await Promise.all(
			wkStrtDt.map(async (startDate: moment.Moment, i: number) => {
				const dateStart: string = startDate
					.clone()
					.startOf(`isoWeek`)
					.format(`YYYY-MM-DD`);
				const dateEnd: string = startDate
					.clone()
					.endOf(`isoWeek`)
					.format(`YYYY-MM-DD`);

				[fndResVol, fndResCrd] = await Promise.all([
					repository.avgVolume(usrIdPrm, dateStart, dateEnd),
					repository.avgCardio(usrIdPrm, dateStart, dateEnd),
				]);

				return {
					findResultVolume: fndResVol,
					findResultCardio: fndResCrd,
					index: i,
				};
			}),
		);

		// sum, count 설정
		prllRes.forEach(
			({
				findResultVolume: fndResVol,
				findResultCardio: fndResCrd,
				index,
			}: {
				findResultVolume: any[];
				findResultCardio: any[];
				index: number;
			}) => {
				fndResVol.forEach((item: any) => {
					sumVolume[index] += Number(item.exercise_record_total_volume ?? `0`);
					cntRecsVol[index]++;
				});
				fndResCrd.forEach((item: any) => {
					sumCardio[index] += Number(
						tmTDcml(item.exercise_record_total_cardio) ?? `0`,
					);
					cntRecsCrd[index]++;
				});
			},
		);

		// name 배열을 순회하며 결과 저장
		name.forEach((data: any, index: number) => {
			fnlResVol.push({
				name: String(data),
				date: String(date[index]),
				volume:
					cntRecsVol[index] > 0
						? String((sumVolume[index] / cntRecsVol[index]).toFixed(1))
						: `0`,
			});
			fnlResCrd.push({
				name: String(data),
				date: String(date[index]),
				cardio:
					cntRecsCrd[index] > 0
						? String(sumCardio[index] / cntRecsCrd[index])
						: `0`,
			});
		});

		finalResult = {
			volume: fnlResVol,
			cardio: fnlResCrd,
		};
		statusResult = `success`;
	} catch {
		finalResult = [];
		statusResult = `fail`;
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 4-2. chart (avg - month) ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const avgMonth = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let fndResVol: any[] = [];
	let fndResCrd: any[] = [];
	const fnlResVol: any[] = [];
	const fnlResCrd: any[] = [];
	let finalResult: any = [];
	let statusResult: string = ``;

	// sum, count 변수 선언
	const sumVolume: number[] = Array.from({ length: 12 }).fill(0);
	const sumCardio: number[] = Array.from({ length: 12 }).fill(0);
	const cntRecsVol: number[] = Array.from({ length: 12 }).fill(0);
	const cntRecsCrd: number[] = Array.from({ length: 12 }).fill(0);

	// date 변수 정의
	const yearStartFmt: string = DATE_param.yearStartFmt;

	// monthStartDate 정의
	const mnthStrtDt: moment.Moment[] = Array.from({ length: 12 }, (_, i) =>
		moment(yearStartFmt).startOf(`year`).add(i, `months`),
	);

	// ex. 00 월
	const name: string[] = Array.from({ length: 12 }, (_, i) => `month${i + 1}`);

	// ex. 00-00 - 00-00
	const date: string[] = Array.from({ length: 12 }, (_, i) => {
		const startOfMonth: string = moment(yearStartFmt)
			.add(i, `months`)
			.startOf(`month`)
			.format(`MM-DD`);
		const endOfMonth: string = moment(yearStartFmt)
			.add(i, `months`)
			.endOf(`month`)
			.format(`MM-DD`);
		return `${startOfMonth} - ${endOfMonth}`;
	});

	try {
		// promise 사용하여 병렬 처리
		const prllRes: {
			findResultVolume: any[];
			findResultCardio: any[];
			index: number;
		}[] = await Promise.all(
			mnthStrtDt.map(async (startDate: moment.Moment, i: number) => {
				const dateStart: string = startDate
					.clone()
					.startOf(`month`)
					.format(`YYYY-MM-DD`);
				const dateEnd: string = startDate
					.clone()
					.endOf(`month`)
					.format(`YYYY-MM-DD`);

				[fndResVol, fndResCrd] = await Promise.all([
					repository.avgVolume(usrIdPrm, dateStart, dateEnd),
					repository.avgCardio(usrIdPrm, dateStart, dateEnd),
				]);

				return {
					findResultVolume: fndResVol,
					findResultCardio: fndResCrd,
					index: i,
				};
			}),
		);

		// sum, count 설정
		prllRes.forEach(
			({
				findResultVolume: fndResVol,
				findResultCardio: fndResCrd,
				index,
			}: {
				findResultVolume: any[];
				findResultCardio: any[];
				index: number;
			}) => {
				fndResVol.forEach((item: any) => {
					sumVolume[index] += Number(item.exercise_record_total_volume ?? `0`);
					cntRecsVol[index]++;
				});
				fndResCrd.forEach((item: any) => {
					sumCardio[index] += Number(
						tmTDcml(item.exercise_record_total_cardio) ?? `0`,
					);
					cntRecsCrd[index]++;
				});
			},
		);

		// name 배열을 순회하며 결과 저장
		name.forEach((data: any, index: number) => {
			fnlResVol.push({
				name: String(data),
				date: String(date[index]),
				volume:
					cntRecsVol[index] > 0
						? String((sumVolume[index] / cntRecsVol[index]).toFixed(1))
						: `0`,
			});
			fnlResCrd.push({
				name: String(data),
				date: String(date[index]),
				cardio:
					cntRecsCrd[index] > 0
						? String(sumCardio[index] / cntRecsCrd[index])
						: `0`,
			});
		});

		finalResult = {
			volume: fnlResVol,
			cardio: fnlResCrd,
		};
		statusResult = `success`;
	} catch {
		finalResult = [];
		statusResult = `fail`;
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

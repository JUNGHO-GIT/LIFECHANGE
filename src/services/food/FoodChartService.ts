/**
 * @file FoodChartService.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import * as repository from "@repositories/food/FoodChartRepository";
import moment from "moment-timezone";

// 1-1. chart (bar - today) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const bar = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let fndResGl: any[] = [];
	let fndResRec: any[] = [];
	let fnlResKcl: any[] = [];
	let fnlResNt: any[] = [];
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
		fnlResKcl = fndResGl?.map((item: any) => ({
			name: String(`kcal`),
			date: String(dateStart),
			goal: String(item.food_goal_kcal ?? `0`),
			record: String(fndResRec[0]?.food_record_total_kcal ?? `0`),
		}));

		fnlResNt = fndResGl?.flatMap((item: any) => [
			{
				name: String(`carb`),
				date: String(dateStart),
				goal: String(item.food_goal_carb ?? `0`),
				record: String(fndResRec[0]?.food_record_total_carb ?? `0`),
			},
			{
				name: String(`protein`),
				date: String(dateStart),
				goal: String(item.food_goal_protein ?? `0`),
				record: String(fndResRec[0]?.food_record_total_protein ?? `0`),
			},
			{
				name: String(`fat`),
				date: String(dateStart),
				goal: String(item.food_goal_fat ?? `0`),
				record: String(fndResRec[0]?.food_record_total_fat ?? `0`),
			},
		]);

		finalResult = {
			kcal: fnlResKcl,
			nut: fnlResNt,
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

// 2-2. chart (pie - week) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
// pie 차트는 무조건 int 리턴
export const pieWeek = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let fndResKcl: any[] = [];
	let fndResNt: any[] = [];
	let fnlResKcl: any[] = [];
	let fnlResNt: any[] = [];
	let finalResult: any = [];
	let statusResult: string = ``;

	// date 변수 정의
	const dateStart: string = DATE_param.weekStartFmt;
	const dateEnd: string = DATE_param.weekEndFmt;

	try {
		// promise 사용하여 병렬 처리
		[fndResKcl, fndResNt] = await Promise.all([
			repository.pieKcal(usrIdPrm, dateStart, dateEnd),
			repository.pieNut(usrIdPrm, dateStart, dateEnd),
		]);

		// findResultKcal 배열을 순회하며 결과 저장
		fnlResKcl = fndResKcl?.map((item: any) => ({
			name: String(item._id),
			value: Number(item.value) ?? 0,
		}));

		// findResultNut 배열을 순회하며 결과 저장
		fnlResNt = fndResNt.flatMap((item: any) => [
			{
				name: String(`carb`),
				value: Number(item.food_record_total_carb) ?? 0,
			},
			{
				name: String(`protein`),
				value: Number(item.food_record_total_protein) ?? 0,
			},
			{
				name: String(`fat`),
				value: Number(item.food_record_total_fat) ?? 0,
			},
		]);

		// 데이터가 없을 때 기본값 설정
		if (!fnlResKcl || fnlResKcl.length === 0) {
			fnlResKcl = [{ name: `Empty`, value: 100 }];
		}
		if (!fnlResNt || fnlResNt.length === 0) {
			fnlResNt = [{ name: `Empty`, value: 100 }];
		}

		finalResult = {
			kcal: fnlResKcl,
			nut: fnlResNt,
		};
		statusResult = `success`;
	} catch {
		finalResult = {
			kcal: [{ name: `Empty`, value: 100 }],
			nut: [{ name: `Empty`, value: 100 }],
		};
		statusResult = `success`;
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 2-3. chart (pie - month) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
// pie 차트는 무조건 int 리턴
export const pieMonth = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let fndResKcl: any[] = [];
	let fndResNt: any[] = [];
	let fnlResKcl: any[] = [];
	let fnlResNt: any[] = [];
	let finalResult: any = [];
	let statusResult: string = ``;

	// date 변수 정의
	const dateStart: string = DATE_param.monthStartFmt;
	const dateEnd: string = DATE_param.monthEndFmt;

	try {
		// promise 사용하여 병렬 처리
		[fndResKcl, fndResNt] = await Promise.all([
			repository.pieKcal(usrIdPrm, dateStart, dateEnd),
			repository.pieNut(usrIdPrm, dateStart, dateEnd),
		]);

		// findResultKcal 배열을 순회하며 결과 저장
		fnlResKcl = fndResKcl?.map((item: any) => ({
			name: String(item._id),
			value: Number(item.value) ?? 0,
		}));

		// findResultNut 배열을 순회하며 결과 저장
		fnlResNt = fndResNt.flatMap((item: any) => [
			{
				name: String(`carb`),
				value: Number(item.food_record_total_carb) ?? 0,
			},
			{
				name: String(`protein`),
				value: Number(item.food_record_total_protein) ?? 0,
			},
			{
				name: String(`fat`),
				value: Number(item.food_record_total_fat) ?? 0,
			},
		]);

		// 데이터가 없을 때 기본값 설정
		if (!fnlResKcl || fnlResKcl.length === 0) {
			fnlResKcl = [{ name: `Empty`, value: 100 }];
		}
		if (!fnlResNt || fnlResNt.length === 0) {
			fnlResNt = [{ name: `Empty`, value: 100 }];
		}

		finalResult = {
			kcal: fnlResKcl,
			nut: fnlResNt,
		};
		statusResult = `success`;
	} catch {
		finalResult = {
			kcal: [{ name: `Empty`, value: 100 }],
			nut: [{ name: `Empty`, value: 100 }],
		};
		statusResult = `success`;
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
	let fndResKcl: any[] = [];
	let fndResNt: any[] = [];
	let fnlResKcl: any[] = [];
	let fnlResNt: any[] = [];
	let finalResult: any = [];
	let statusResult: string = ``;

	// date 변수 정의
	const dateStart: string = DATE_param.yearStartFmt;
	const dateEnd: string = DATE_param.yearEndFmt;

	try {
		// promise 사용하여 병렬 처리
		[fndResKcl, fndResNt] = await Promise.all([
			repository.pieKcal(usrIdPrm, dateStart, dateEnd),
			repository.pieNut(usrIdPrm, dateStart, dateEnd),
		]);

		// findResultKcal 배열을 순회하며 결과 저장
		fnlResKcl = fndResKcl?.map((item: any) => ({
			name: String(item._id),
			value: Number(item.value) ?? 0,
		}));

		// findResultNut 배열을 순회하며 결과 저장
		fnlResNt = fndResNt.flatMap((item: any) => [
			{
				name: String(`carb`),
				value: Number(item.food_record_total_carb) ?? 0,
			},
			{
				name: String(`protein`),
				value: Number(item.food_record_total_protein) ?? 0,
			},
			{
				name: String(`fat`),
				value: Number(item.food_record_total_fat) ?? 0,
			},
		]);

		// 데이터가 없을 때 기본값 설정
		if (!fnlResKcl || fnlResKcl.length === 0) {
			fnlResKcl = [{ name: `Empty`, value: 100 }];
		}
		if (!fnlResNt || fnlResNt.length === 0) {
			fnlResNt = [{ name: `Empty`, value: 100 }];
		}

		finalResult = {
			kcal: fnlResKcl,
			nut: fnlResNt,
		};
		statusResult = `success`;
	} catch {
		finalResult = {
			kcal: [{ name: `Empty`, value: 100 }],
			nut: [{ name: `Empty`, value: 100 }],
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
	let fndResKcl: any[] = [];
	let fndResNt: any[] = [];
	const fnlResKcl: any[] = [];
	const fnlResNt: any[] = [];
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
	const weekRanges: any[] = [];
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
		[fndResKcl, fndResNt] = await Promise.all([
			repository.lineKcal(usrIdPrm, dateStart, dateEnd),
			repository.lineNut(usrIdPrm, dateStart, dateEnd),
		]);

		// 주차별 총합 계산
		weekRanges.forEach((range: any, index: number) => {
			let weekKcalSum = 0;
			let weekCarbSum = 0;
			let wkPrtnSm = 0;
			let weekFatSum = 0;

			fndResKcl.forEach((item: any) => {
				const itemDate = item.food_record_dateStart;
				itemDate >= range.start &&
					itemDate <= range.end &&
					(weekKcalSum += Number(item.food_record_total_kcal ?? 0));
			});

			fndResNt.forEach((item: any) => {
				const itemDate = item.food_record_dateStart;
				itemDate >= range.start &&
					itemDate <= range.end &&
					((weekCarbSum += Number(item.food_record_total_carb ?? 0)),
					(wkPrtnSm += Number(item.food_record_total_protein ?? 0)),
					(weekFatSum += Number(item.food_record_total_fat ?? 0)));
			});

			fnlResKcl.push({
				name: String(name[index]),
				date: String(`${range.start} - ${range.end}`),
				kcal: String(weekKcalSum),
			});
			fnlResNt.push({
				name: String(name[index]),
				date: String(`${range.start} - ${range.end}`),
				carb: String(weekCarbSum),
				protein: String(wkPrtnSm),
				fat: String(weekFatSum),
			});
		});

		finalResult = {
			kcal: fnlResKcl,
			nut: fnlResNt,
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
	let fndResKcl: any[] = [];
	let fndResNt: any[] = [];
	const fnlResKcl: any[] = [];
	const fnlResNt: any[] = [];
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
		[fndResKcl, fndResNt] = await Promise.all([
			repository.lineKcal(usrIdPrm, dateStart, dateEnd),
			repository.lineNut(usrIdPrm, dateStart, dateEnd),
		]);

		// 월별 총합 계산
		monthRanges.forEach((range: any, index: number) => {
			let monthKcalSum = 0;
			let monthCarbSum = 0;
			let mnthPrtnSm = 0;
			let monthFatSum = 0;

			fndResKcl.forEach((item: any) => {
				const itemDate = item.food_record_dateStart;
				itemDate >= range.start &&
					itemDate <= range.end &&
					(monthKcalSum += Number(item.food_record_total_kcal ?? 0));
			});

			fndResNt.forEach((item: any) => {
				const itemDate = item.food_record_dateStart;
				itemDate >= range.start &&
					itemDate <= range.end &&
					((monthCarbSum += Number(item.food_record_total_carb ?? 0)),
					(mnthPrtnSm += Number(item.food_record_total_protein ?? 0)),
					(monthFatSum += Number(item.food_record_total_fat ?? 0)));
			});

			fnlResKcl.push({
				name: String(name[index]),
				date: String(`${range.start} - ${range.end}`),
				kcal: String(monthKcalSum),
			});
			fnlResNt.push({
				name: String(name[index]),
				date: String(`${range.start} - ${range.end}`),
				carb: String(monthCarbSum),
				protein: String(mnthPrtnSm),
				fat: String(monthFatSum),
			});
		});

		finalResult = {
			kcal: fnlResKcl,
			nut: fnlResNt,
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
	let fndResKcl: any[] = [];
	let fndResNt: any[] = [];
	const fnlResKcl: any[] = [];
	const fnlResNt: any[] = [];
	let finalResult: any = [];
	let statusResult: string = ``;

	// sum, count 변수 선언
	const sumKcal: number[] = Array.from({ length: 5 }).fill(0);
	const sumCarb: number[] = Array.from({ length: 5 }).fill(0);
	const sumProtein: number[] = Array.from({ length: 5 }).fill(0);
	const sumFat: number[] = Array.from({ length: 5 }).fill(0);
	const cntRecsKcl: number[] = Array.from({ length: 5 }).fill(0);
	const cntRecsNt: number[] = Array.from({ length: 5 }).fill(0);

	// date 변수 정의
	const mnthStrtFmt: string = DATE_param.monthStartFmt;

	// weekStartDates 정의
	const wkStrtDt: moment.Moment[] = Array.from(
		{ length: 5 },
		(_v, i: number) => moment(mnthStrtFmt).startOf(`month`).add(i, `weeks`),
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
			findResultKcal: any[];
			findResultNut: any[];
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

				[fndResKcl, fndResNt] = await Promise.all([
					repository.avgKcal(usrIdPrm, dateStart, dateEnd),
					repository.avgNut(usrIdPrm, dateStart, dateEnd),
				]);

				return {
					findResultKcal: fndResKcl,
					findResultNut: fndResNt,
					index: i,
				};
			}),
		);

		// sum, count 설정
		prllRes.forEach(
			({
				findResultKcal: fndResKcl,
				findResultNut: fndResNt,
				index,
			}: {
				findResultKcal: any[];
				findResultNut: any[];
				index: number;
			}) => {
				fndResKcl.forEach((item: any) => {
					sumKcal[index] += Number(item.food_record_total_kcal ?? `0`);
					cntRecsKcl[index]++;
				});
				fndResNt.forEach((item: any) => {
					sumCarb[index] += Number(item.food_record_total_carb ?? `0`);
					sumProtein[index] += Number(item.food_record_total_protein ?? `0`);
					sumFat[index] += Number(item.food_record_total_fat ?? `0`);
					cntRecsNt[index]++;
				});
			},
		);

		// name 배열을 순회하며 결과 저장
		name.forEach((data: any, index: number) => {
			fnlResKcl.push({
				name: String(data),
				date: String(date[index]),
				kcal:
					cntRecsKcl[index] > 0
						? String((sumKcal[index] / cntRecsKcl[index]).toFixed(0))
						: `0`,
			});
			fnlResNt.push({
				name: String(data),
				date: String(date[index]),
				carb:
					cntRecsNt[index] > 0
						? String((sumCarb[index] / cntRecsNt[index]).toFixed(2))
						: `0`,
				protein:
					cntRecsNt[index] > 0
						? String((sumProtein[index] / cntRecsNt[index]).toFixed(2))
						: `0`,
				fat:
					cntRecsNt[index] > 0
						? String((sumFat[index] / cntRecsNt[index]).toFixed(2))
						: `0`,
			});
		});

		finalResult = {
			kcal: fnlResKcl,
			nut: fnlResNt,
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

// 4-2. chart (avg - month) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const avgMonth = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let fndResKcl: any[] = [];
	let fndResNt: any[] = [];
	const fnlResKcl: any[] = [];
	const fnlResNt: any[] = [];
	let finalResult: any = [];
	let statusResult: string = ``;

	// sum, count 변수 선언
	const sumKcal: number[] = Array.from({ length: 12 }).fill(0);
	const sumCarb: number[] = Array.from({ length: 12 }).fill(0);
	const sumProtein: number[] = Array.from({ length: 12 }).fill(0);
	const sumFat: number[] = Array.from({ length: 12 }).fill(0);
	const cntRecsKcl: number[] = Array.from({ length: 12 }).fill(0);
	const cntRecsNt: number[] = Array.from({ length: 12 }).fill(0);

	// date 변수 정의
	const yearStartFmt: string = DATE_param.yearStartFmt;

	// monthStartDate 정의
	const mnthStrtDt: moment.Moment[] = Array.from(
		{ length: 12 },
		(_v, i: number) => moment(yearStartFmt).startOf(`year`).add(i, `months`),
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
			findResultKcal: any[];
			findResultNut: any[];
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

				[fndResKcl, fndResNt] = await Promise.all([
					repository.avgKcal(usrIdPrm, dateStart, dateEnd),
					repository.avgNut(usrIdPrm, dateStart, dateEnd),
				]);

				return {
					findResultKcal: fndResKcl,
					findResultNut: fndResNt,
					index: i,
				};
			}),
		);

		// sum, count 설정
		prllRes.forEach(
			({
				findResultKcal: fndResKcl,
				findResultNut: fndResNt,
				index,
			}: {
				findResultKcal: any[];
				findResultNut: any[];
				index: number;
			}) => {
				fndResKcl.forEach((item: any) => {
					sumKcal[index] += Number(item.food_record_total_kcal ?? `0`);
					cntRecsKcl[index]++;
				});
				fndResNt.forEach((item: any) => {
					sumCarb[index] += Number(item.food_record_total_carb ?? `0`);
					sumProtein[index] += Number(item.food_record_total_protein ?? `0`);
					sumFat[index] += Number(item.food_record_total_fat ?? `0`);
					cntRecsNt[index]++;
				});
			},
		);

		// name 배열을 순회하며 결과 저장
		name.forEach((data: any, index: number) => {
			fnlResKcl.push({
				name: String(data),
				date: String(date[index]),
				kcal:
					cntRecsKcl[index] > 0
						? String((sumKcal[index] / cntRecsKcl[index]).toFixed(0))
						: `0`,
			});
			fnlResNt.push({
				name: String(data),
				date: String(date[index]),
				carb:
					cntRecsNt[index] > 0
						? String((sumCarb[index] / cntRecsNt[index]).toFixed(2))
						: `0`,
				protein:
					cntRecsNt[index] > 0
						? String((sumProtein[index] / cntRecsNt[index]).toFixed(2))
						: `0`,
				fat:
					cntRecsNt[index] > 0
						? String((sumFat[index] / cntRecsNt[index]).toFixed(2))
						: `0`,
			});
		});

		finalResult = {
			kcal: fnlResKcl,
			nut: fnlResNt,
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

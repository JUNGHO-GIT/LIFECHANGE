/**
 * @file MoneyChartService.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import * as repository from "@repositories/money/MoneyChartRepository";
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
		finalResult = fndResGl.flatMap((_item: any) => [
			{
				name: String(`income`),
				date: String(dateStart),
				goal: String(fndResGl?.[0]?.money_goal_income ?? `0`),
				record: String(fndResRec?.[0]?.money_record_total_income ?? `0`),
			},
			{
				name: String(`expense`),
				date: String(dateStart),
				goal: String(fndResGl?.[0]?.money_goal_expense ?? `0`),
				record: String(
					fndResRec?.[0]?.money_record_total_expense ?? `0`,
				),
			},
		]);

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
	let fndResInCm: any[] = [];
	let fndResExpn: any[] = [];
	let fnlResInCm: any[] = [];
	let fnlResExpn: any[] = [];
	let finalResult: any = [];
	let statusResult: string = ``;

	// date 변수 정의
	const dateStart: string = DATE_param.weekStartFmt;
	const dateEnd: string = DATE_param.weekEndFmt;

	try {
		// promise 사용하여 병렬 처리
		[fndResInCm, fndResExpn] = await Promise.all([
			repository.pieIncome(usrIdPrm, dateStart, dateEnd),
			repository.pieExpense(usrIdPrm, dateStart, dateEnd),
		]);

		// findResultInCome 배열을 순회하며 결과 저장
		fnlResInCm = fndResInCm?.map((item: any) => ({
			name: String(item._id),
			value: Number(item.value) ?? 0,
		}));

		// findResultExpense 배열을 순회하며 결과 저장
		fnlResExpn = fndResExpn?.map((item: any) => ({
			name: String(item._id),
			value: Number(item.value) ?? 0,
		}));

		// 데이터가 없을 때 기본값 설정
		if (!fnlResInCm || fnlResInCm.length === 0) {
			fnlResInCm = [{ name: `Empty`, value: 100 }];
		}
		if (!fnlResExpn || fnlResExpn.length === 0) {
			fnlResExpn = [{ name: `Empty`, value: 100 }];
		}

		finalResult = {
			income: fnlResInCm,
			expense: fnlResExpn,
		};
		statusResult = `success`;
	} catch {
		finalResult = {
			income: [{ name: `Empty`, value: 100 }],
			expense: [{ name: `Empty`, value: 100 }],
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
	let fndResInCm: any[] = [];
	let fndResExpn: any[] = [];
	let fnlResInCm: any[] = [];
	let fnlResExpn: any[] = [];
	let finalResult: any = [];
	let statusResult: string = ``;

	// date 변수 정의
	const dateStart: string = DATE_param.monthStartFmt;
	const dateEnd: string = DATE_param.monthEndFmt;

	try {
		// promise 사용하여 병렬 처리
		[fndResInCm, fndResExpn] = await Promise.all([
			repository.pieIncome(usrIdPrm, dateStart, dateEnd),
			repository.pieExpense(usrIdPrm, dateStart, dateEnd),
		]);

		// findResultInCome 배열을 순회하며 결과 저장
		fnlResInCm = fnlResInCm?.map((item: any) => ({
			name: String(item._id),
			value: Number(item.value) ?? 0,
		}));

		// findResultExpense 배열을 순회하며 결과 저장
		fnlResExpn = fndResExpn?.map((item: any) => ({
			name: String(item._id),
			value: Number(item.value) ?? 0,
		}));

		// 데이터가 없을 때 기본값 설정
		if (!fnlResInCm || fnlResInCm.length === 0) {
			fnlResInCm = [{ name: `Empty`, value: 100 }];
		}
		if (!fnlResExpn || fnlResExpn.length === 0) {
			fnlResExpn = [{ name: `Empty`, value: 100 }];
		}

		finalResult = {
			income: fnlResInCm,
			expense: fnlResExpn,
		};
		statusResult = `success`;
	} catch {
		finalResult = {
			income: [{ name: `Empty`, value: 100 }],
			expense: [{ name: `Empty`, value: 100 }],
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
	let fndResInCm: any[] = [];
	let fndResExpn: any[] = [];
	let fnlResInCm: any[] = [];
	let fnlResExpn: any[] = [];
	let finalResult: any = [];
	let statusResult: string = ``;

	// date 변수 정의
	const dateStart: string = DATE_param.yearStartFmt;
	const dateEnd: string = DATE_param.yearEndFmt;

	try {
		// promise 사용하여 병렬 처리
		[fndResInCm, fndResExpn] = await Promise.all([
			repository.pieIncome(usrIdPrm, dateStart, dateEnd),
			repository.pieExpense(usrIdPrm, dateStart, dateEnd),
		]);

		// findResultInCome 배열을 순회하며 결과 저장
		fnlResInCm = fndResInCm?.map((item: any) => ({
			name: String(item._id),
			value: Number(item.value) ?? 0,
		}));

		// findResultExpense 배열을 순회하며 결과 저장
		fnlResExpn = fndResExpn?.map((item: any) => ({
			name: String(item._id),
			value: Number(item.value) ?? 0,
		}));

		// 데이터가 없을 때 기본값 설정
		if (!fnlResInCm || fnlResInCm.length === 0) {
			fnlResInCm = [{ name: `Empty`, value: 100 }];
		}
		if (!fnlResExpn || fnlResExpn.length === 0) {
			fnlResExpn = [{ name: `Empty`, value: 100 }];
		}

		finalResult = {
			income: fnlResInCm,
			expense: fnlResExpn,
		};
		statusResult = `success`;
	} catch {
		finalResult = {
			income: [{ name: `Empty`, value: 100 }],
			expense: [{ name: `Empty`, value: 100 }],
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
	let findResult: any[] = [];
	let finalResult: any[] = [];
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
		[findResult] = await Promise.all([
			repository.lineAll(usrIdPrm, dateStart, dateEnd),
		]);

		// 주차별 총합 계산
		weekRanges.forEach((range: any, index: number) => {
			let wkIncmSm: number = 0;
			let wkExpnSm: number = 0;

			findResult.forEach((item: any) => {
				const itemDate: string = item.money_record_dateStart;
				itemDate >= range.start &&
					itemDate <= range.end &&
					((wkIncmSm += Number(item.money_record_total_income ?? 0)),
					(wkExpnSm += Number(item.money_record_total_expense ?? 0)));
			});

			finalResult.push({
				name: String(name[index]),
				date: String(`${range.start} - ${range.end}`),
				income: String(wkIncmSm),
				expense: String(wkExpnSm),
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

// 3-2. chart (line - month) ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const lineMonth = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let findResult: any[] = [];
	let finalResult: any[] = [];
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
		[findResult] = await Promise.all([
			repository.lineAll(usrIdPrm, dateStart, dateEnd),
		]);

		// 월별 총합 계산
		monthRanges.forEach((range: any, index: number) => {
			let mnthIncmSm: number = 0;
			let mnthExpnSm: number = 0;

			findResult.forEach((item: any) => {
				const itemDate: string = item.money_record_dateStart;
				itemDate >= range.start &&
					itemDate <= range.end &&
					((mnthIncmSm += Number(item.money_record_total_income ?? 0)),
					(mnthExpnSm += Number(item.money_record_total_expense ?? 0)));
			});

			finalResult.push({
				name: String(name[index]),
				date: String(`${range.start} - ${range.end}`),
				income: String(mnthIncmSm),
				expense: String(mnthExpnSm),
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

// 4-1. chart (avg - week) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const avgWeek = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let findResult: any[] = [];
	let finalResult: any[] = [];
	let statusResult: string = ``;

	// sum, count 변수 선언
	const sumIncome: number[] = Array.from({ length: 5 }).fill(0);
	const sumExpense: number[] = Array.from({ length: 5 }).fill(0);
	const countRecords: number[] = Array.from({ length: 5 }).fill(0);

	// date 변수 정의
	const mnthStrtFmt: string = DATE_param.monthStartFmt;

	// weekStartDate 정의
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
		const prllRes: { findResult: any[]; index: number }[] =
			await Promise.all(
				wkStrtDt.map(async (startDate: moment.Moment, i: number) => {
					const dateStart: string = startDate
						.clone()
						.startOf(`isoWeek`)
						.format(`YYYY-MM-DD`);
					const dateEnd: string = startDate
						.clone()
						.endOf(`isoWeek`)
						.format(`YYYY-MM-DD`);

					[findResult] = await Promise.all([
						repository.avgAll(usrIdPrm, dateStart, dateEnd),
					]);

					return {
						findResult,
						index: i,
					};
				}),
			);

		// sum, count 설정
		prllRes.forEach(
			({ findResult, index }: { findResult: any[]; index: number }) => {
				findResult.forEach((item: any) => {
					sumIncome[index] += Number(item.money_record_total_income ?? `0`);
					sumExpense[index] += Number(item.money_record_total_expense ?? `0`);
					countRecords[index]++;
				});
			},
		);

		// name 배열을 순회하며 결과 저장
		name.forEach((data: any, index: number) => {
			finalResult.push({
				name: String(data),
				date: String(date[index]),
				income:
					countRecords[index] > 0
						? String((sumIncome[index] / countRecords[index]).toFixed(0))
						: `0`,
				expense:
					countRecords[index] > 0
						? String((sumExpense[index] / countRecords[index]).toFixed(0))
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

// 4-2. chart (avg - month) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const avgMonth = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let findResult: any[] = [];
	let finalResult: any[] = [];
	let statusResult: string = ``;

	// sum, count 변수 선언
	const sumIncome: number[] = Array.from({ length: 12 }).fill(0);
	const sumExpense: number[] = Array.from({ length: 12 }).fill(0);
	const countRecords: number[] = Array.from({ length: 12 }).fill(0);

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
		const prllRes: { findResult: any[]; index: number }[] =
			await Promise.all(
				mnthStrtDt.map(async (startDate: moment.Moment, i: number) => {
					const dateStart: string = startDate
						.clone()
						.startOf(`month`)
						.format(`YYYY-MM-DD`);
					const dateEnd: string = startDate
						.clone()
						.endOf(`month`)
						.format(`YYYY-MM-DD`);

					[findResult] = await Promise.all([
						repository.avgAll(usrIdPrm, dateStart, dateEnd),
					]);

					return {
						findResult,
						index: i,
					};
				}),
			);

		// sum, count 설정
		prllRes.forEach(
			({ findResult, index }: { findResult: any[]; index: number }) => {
				findResult.forEach((item: any) => {
					sumIncome[index] += Number(item.money_record_total_income ?? `0`);
					sumExpense[index] += Number(item.money_record_total_expense ?? `0`);
					countRecords[index]++;
				});
			},
		);

		// name 배열을 순회하며 결과 저장
		name.forEach((data: any, index: number) => {
			finalResult.push({
				name: String(data),
				date: String(date[index]),
				income:
					countRecords[index] > 0
						? String((sumIncome[index] / countRecords[index]).toFixed(0))
						: `0`,
				expense:
					countRecords[index] > 0
						? String((sumExpense[index] / countRecords[index]).toFixed(0))
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

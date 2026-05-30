/**
 * @file SleepChartService.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import moment from "moment-timezone";
import { timeToDecimal as tmTDcml } from "@assets/scripts/utils";
import * as repository from "@repositories/sleep/SleepChartRepository";

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

		// helper to sum values across sections for a given key
		const sumSections = (sections: any[], key: string) =>
			(sections ?? []).reduce(
				(acc: number, sec: any) =>
					acc + Number(tmTDcml(sec?.[key] ?? `00:00`)),
				0,
			);

		// findResult 배열을 순회하며 결과 저장
		finalResult = fndResGl?.flatMap((item: any) => {
			// try to find matching record for the goal's date
			const mtchRec: any =
				(fndResRec ?? []).find(
					(r: any) => r?.sleep_record_dateStart === item?.sleep_goal_dateStart,
				) ?? null;
			const sections: any[] = mtchRec?.sleep_section ?? [];
			return [
				{
					name: String(`bedTime`),
					date: String(item?.sleep_goal_dateStart ?? dateStart),
					goal: String(tmTDcml(item?.sleep_goal_bedTime) ?? `0`),
					record: String(sumSections(sections, `sleep_record_bedTime`) ?? `0`),
				},
				{
					name: String(`wakeTime`),
					date: String(item?.sleep_goal_dateStart ?? dateStart),
					goal: String(tmTDcml(item?.sleep_goal_wakeTime) ?? `0`),
					record: String(sumSections(sections, `sleep_record_wakeTime`) ?? `0`),
				},
				{
					name: String(`sleepTime`),
					date: String(item?.sleep_goal_dateStart ?? dateStart),
					goal: String(tmTDcml(item?.sleep_goal_sleepTime) ?? `0`),
					record: String(
						sumSections(sections, `sleep_record_sleepTime`) ?? `0`,
					),
				},
			];
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

// 2-2. chart (pie - week) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
// pie 차트는 무조건 int 리턴
export const pieWeek = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let findResult: any[] = [];
	let finalResult: any[] = [];
	let statusResult: string = ``;

	// sum, count 변수 선언
	let sumBedTime: number = 0;
	let sumWakeTime: number = 0;
	let sumSleepTime: number = 0;
	let countRecords: number = 0;
	let totalSleep: number = 0;

	// date 변수 정의
	const dateStart: string = DATE_param.weekStartFmt;
	const dateEnd: string = DATE_param.weekEndFmt;

	try {
		// promise 사용하여 병렬 처리
		[findResult] = await Promise.all([
			repository.pieAll(usrIdPrm, dateStart, dateEnd),
		]);

		// sum, count 설정 — 모든 섹션을 합산
		findResult.forEach((data: any, index: number) => {
			const sections: any[] = data?.sleep_section ?? [];
			sections.forEach((sec: any) => {
				sumBedTime += Number(
					tmTDcml(sec?.sleep_record_bedTime ?? `00:00`),
				);
				sumWakeTime += Number(
					tmTDcml(sec?.sleep_record_wakeTime ?? `00:00`),
				);
				sumSleepTime += Number(
					tmTDcml(sec?.sleep_record_sleepTime ?? `00:00`),
				);
				countRecords++;
			});
		});

		// totalSleep 계산
		totalSleep = sumBedTime + sumWakeTime + sumSleepTime;

		// finalResult 배열에 결과 저장
		finalResult = [
			{
				name: String(`bedTime`),
				value: Number(Math.round((sumBedTime / totalSleep) * 100) ?? 0),
			},
			{
				name: String(`wakeTime`),
				value: Number(Math.round((sumWakeTime / totalSleep) * 100) ?? 0),
			},
			{
				name: String(`sleepTime`),
				value: Number(Math.round((sumSleepTime / totalSleep) * 100) ?? 0),
			},
		];

		// 데이터가 없을 때 기본값 설정
		const hasData = finalResult.some((item: any) => item.value > 0);
		if (!hasData || !finalResult || finalResult.length === 0) {
			finalResult = [{ name: `Empty`, value: 100 }];
		}

		statusResult = `success`;
	} catch {
		finalResult = [{ name: `Empty`, value: 100 }];
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
	let findResult: any[] = [];
	let finalResult: any[] = [];
	let statusResult: string = ``;

	// sum, count 변수 선언
	let sumBedTime: number = 0;
	let sumWakeTime: number = 0;
	let sumSleepTime: number = 0;
	let countRecords: number = 0;
	let totalSleep: number = 0;

	// date 변수 정의
	const dateStart: string = DATE_param.monthStartFmt;
	const dateEnd: string = DATE_param.monthEndFmt;

	try {
		// promise 사용하여 병렬 처리
		[findResult] = await Promise.all([
			repository.pieAll(usrIdPrm, dateStart, dateEnd),
		]);

		// sum, count 설정 — 모든 섹션을 합산
		findResult.forEach((data: any, _index: number) => {
			const sections: any[] = data?.sleep_section ?? [];
			sections.forEach((sec: any) => {
				sumBedTime += Number(
					tmTDcml(sec?.sleep_record_bedTime ?? `00:00`),
				);
				sumWakeTime += Number(
					tmTDcml(sec?.sleep_record_wakeTime ?? `00:00`),
				);
				sumSleepTime += Number(
					tmTDcml(sec?.sleep_record_sleepTime ?? `00:00`),
				);
				countRecords++;
			});
		});

		// totalSleep 계산
		totalSleep = sumBedTime + sumWakeTime + sumSleepTime;

		// finalResult 배열에 결과 저장
		finalResult = [
			{
				name: String(`bedTime`),
				value: Number(Math.round((sumBedTime / totalSleep) * 100) ?? 0),
			},
			{
				name: String(`wakeTime`),
				value: Number(Math.round((sumWakeTime / totalSleep) * 100) ?? 0),
			},
			{
				name: String(`sleepTime`),
				value: Number(Math.round((sumSleepTime / totalSleep) * 100) ?? 0),
			},
		];

		// 데이터가 없을 때 기본값 설정
		const hasData = finalResult.some((item: any) => item.value > 0);
		if (!hasData || !finalResult || finalResult.length === 0) {
			finalResult = [{ name: `Empty`, value: 100 }];
		}

		statusResult = `success`;
	} catch {
		finalResult = [{ name: `Empty`, value: 100 }];
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
	let findResult: any[] = [];
	let finalResult: any[] = [];
	let statusResult: string = ``;

	// sum, count 변수 선언
	let sumBedTime: number = 0;
	let sumWakeTime: number = 0;
	let sumSleepTime: number = 0;
	let countRecords: number = 0;
	let totalSleep: number = 0;

	// date 변수 정의
	const dateStart: string = DATE_param.yearStartFmt;
	const dateEnd: string = DATE_param.yearEndFmt;

	try {
		// promise 사용하여 병렬 처리
		[findResult] = await Promise.all([
			repository.pieAll(usrIdPrm, dateStart, dateEnd),
		]);

		// sum, count 설정 — 모든 섹션을 합산
		findResult.forEach((data: any, _index: number) => {
			const sections: any[] = data?.sleep_section ?? [];
			sections.forEach((sec: any) => {
				sumBedTime += Number(
					tmTDcml(sec?.sleep_record_bedTime ?? `00:00`),
				);
				sumWakeTime += Number(
					tmTDcml(sec?.sleep_record_wakeTime ?? `00:00`),
				);
				sumSleepTime += Number(
					tmTDcml(sec?.sleep_record_sleepTime ?? `00:00`),
				);
				countRecords++;
			});
		});

		// totalSleep 계산
		totalSleep = sumBedTime + sumWakeTime + sumSleepTime;

		// finalResult 배열에 결과 저장
		finalResult = [
			{
				name: String(`bedTime`),
				value: Number(Math.round((sumBedTime / totalSleep) * 100) ?? 0),
			},
			{
				name: String(`wakeTime`),
				value: Number(Math.round((sumWakeTime / totalSleep) * 100) ?? 0),
			},
			{
				name: String(`sleepTime`),
				value: Number(Math.round((sumSleepTime / totalSleep) * 100) ?? 0),
			},
		];

		// 데이터가 없을 때 기본값 설정
		const hasData = finalResult.some((item: any) => item.value > 0);
		if (!hasData || !finalResult || finalResult.length === 0) {
			finalResult = [{ name: `Empty`, value: 100 }];
		}

		statusResult = `success`;
	} catch {
		finalResult = [{ name: `Empty`, value: 100 }];
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
	const weekRanges: { start: string; end: string; label: string }[] = [];
	let curWkStrt: moment.Moment = moment(frstWkStrt);
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
			let wkBdTmSm: number = 0;
			let wkWkTmSm: number = 0;
			let wkSlpTmSm: number = 0;

			findResult?.forEach((item: any) => {
				const itemDate: string = item.sleep_record_dateStart;
				if (itemDate >= range.start && itemDate <= range.end) {
					const sections: any[] = item?.sleep_section ?? [];
					sections.forEach((sec: any) => {
						wkBdTmSm += tmTDcml(
							sec?.sleep_record_bedTime ?? `00:00`,
						);
						wkWkTmSm += tmTDcml(
							sec?.sleep_record_wakeTime ?? `00:00`,
						);
						wkSlpTmSm += tmTDcml(
							sec?.sleep_record_sleepTime ?? `00:00`,
						);
					});
				}
			});

			finalResult.push({
				name: String(name[index]),
				date: String(`${range.start} - ${range.end}`),
				bedTime: String(wkBdTmSm.toFixed(1)),
				wakeTime: String(wkWkTmSm.toFixed(1)),
				sleepTime: String(wkSlpTmSm.toFixed(1)),
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
			let mnthBdTmSm: number = 0;
			let mnthWkTmSm: number = 0;
			let mnthSlpTmSm: number = 0;

			findResult?.forEach((item: any) => {
				const itemDate: string = item.sleep_record_dateStart;
				if (itemDate >= range.start && itemDate <= range.end) {
					const sections: any[] = item?.sleep_section ?? [];
					sections.forEach((sec: any) => {
						mnthBdTmSm += tmTDcml(
							sec?.sleep_record_bedTime ?? `00:00`,
						);
						mnthWkTmSm += tmTDcml(
							sec?.sleep_record_wakeTime ?? `00:00`,
						);
						mnthSlpTmSm += tmTDcml(
							sec?.sleep_record_sleepTime ?? `00:00`,
						);
					});
				}
			});

			finalResult.push({
				name: String(name[index]),
				date: String(`${range.start} - ${range.end}`),
				bedTime: String(mnthBdTmSm.toFixed(1)),
				wakeTime: String(mnthWkTmSm.toFixed(1)),
				sleepTime: String(mnthSlpTmSm.toFixed(1)),
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

// 4-1. chart (avg - week) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const avgWeek = async (usrIdPrm: string, DATE_param: any) => {
	// result 변수 선언
	let findResult: any[] = [];
	let finalResult: any[] = [];
	let statusResult: string = ``;

	// sum, count 변수 선언
	let sumBedTime: number[] = Array.from({ length: 5 }).fill(0);
	let sumWakeTime: number[] = Array.from({ length: 5 }).fill(0);
	let sumSleepTime: number[] = Array.from({ length: 5 }).fill(0);
	let countRecords: number[] = Array.from({ length: 5 }).fill(0);

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
					const sections: any[] = item?.sleep_section ?? [];
					sections.forEach((sec: any) => {
						sumBedTime[index] += Number(
							tmTDcml(sec?.sleep_record_bedTime ?? `00:00`) ?? `0`,
						);
						sumWakeTime[index] += Number(
							tmTDcml(sec?.sleep_record_wakeTime ?? `00:00`) ?? `0`,
						);
						sumSleepTime[index] += Number(
							tmTDcml(sec?.sleep_record_sleepTime ?? `00:00`) ?? `0`,
						);
						countRecords[index]++;
					});
				});
			},
		);

		// name 배열을 순회하며 결과 저장
		name.forEach((data: any, index: number) => {
			finalResult.push({
				name: String(data),
				date: String(date[index]),
				bedTime:
					countRecords[index] > 0
						? String((sumBedTime[index] / countRecords[index]).toFixed(1))
						: `0`,
				wakeTime:
					countRecords[index] > 0
						? String((sumWakeTime[index] / countRecords[index]).toFixed(1))
						: `0`,
				sleepTime:
					countRecords[index] > 0
						? String((sumSleepTime[index] / countRecords[index]).toFixed(1))
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
	let sumBedTime: number[] = Array.from({ length: 12 }).fill(0);
	let sumWakeTime: number[] = Array.from({ length: 12 }).fill(0);
	let sumSleepTime: number[] = Array.from({ length: 12 }).fill(0);
	let countRecords: number[] = Array.from({ length: 12 }).fill(0);

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
					const sections: any[] = item?.sleep_section ?? [];
					sections.forEach((sec: any) => {
						sumBedTime[index] += Number(
							tmTDcml(sec?.sleep_record_bedTime ?? `00:00`) ?? `0`,
						);
						sumWakeTime[index] += Number(
							tmTDcml(sec?.sleep_record_wakeTime ?? `00:00`) ?? `0`,
						);
						sumSleepTime[index] += Number(
							tmTDcml(sec?.sleep_record_sleepTime ?? `00:00`) ?? `0`,
						);
						countRecords[index]++;
					});
				});
			},
		);

		// name 배열을 순회하며 결과 저장
		name.forEach((data: any, index: number) => {
			finalResult.push({
				name: String(data),
				date: String(date[index]),
				bedTime:
					countRecords[index] > 0
						? String((sumBedTime[index] / countRecords[index]).toFixed(1))
						: `0`,
				wakeTime:
					countRecords[index] > 0
						? String((sumWakeTime[index] / countRecords[index]).toFixed(1))
						: `0`,
				sleepTime:
					countRecords[index] > 0
						? String((sumSleepTime[index] / countRecords[index]).toFixed(1))
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

/**
 * @file PickerDay.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { Btn, Div, Grid, Icons, Img } from "@exportComponents";
import { Input, PopUp, Select } from "@exportContainers";
import { useCommonDate as usCmmnDt, useCommonValue as usCmmnVal, useStorageLocal as usStrgLcl } from "@exportHooks";
import {
	AdapterMoment as AdptMmnt,
	Badge,
	DateCalendar,
	LocalizationProvider as LclzProv,
	MenuItem,
	PickersDay,
} from "@exportMuis";
import { memo, type React, useEffect, useState } from "@exportReacts";
import { setSession } from "@exportScripts";
import { useStoreLanguage as usStrLang } from "@exportStores";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
declare interface PickerDayProps {
	DATE: {
		dateType: string;
		dateStart: string;
		dateEnd: string;
	};
	setDATE: React.Dispatch<
		React.SetStateAction<{
			dateType: string;
			dateStart: string;
			dateEnd: string;
		}>
	>;
	EXIST: {
		day: string[];
		week: string[];
		month: string[];
		year: string[];
		select: string[];
	};
}

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const PickerDay = memo(({ DATE, setDATE, EXIST }: PickerDayProps) => {
	// 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const { PATH, localLang, localTimeZone: lclTmZn } = usCmmnVal();
	const { isGoalList, isGoalDetail } = usCmmnVal();
	const { isRecordList, isRecordDetail: isRecDtl } = usCmmnVal();
	const { isCalendarDetail: isClndDtl } = usCmmnVal();
	const { isList, isDetail } = usCmmnVal();
	const { getDayFmt, getDayNotFmt, getDayStartFmt: gtDyStrtFmt, getDayEndFmt } =
		usCmmnDt();
	const { getPrevDayStartFmt: gtPrDyStFm, getPrevDayEndFmt: gtPrDyEnFm } = usCmmnDt();
	const { getNextDayStartFmt: gtNxDyStFm, getNextDayEndFmt: gtNxDyEnFm } = usCmmnDt();
	const { getWeekStartFmt: gtWkStrtFmt, getWeekEndFmt: gtWkEndFmt } = usCmmnDt();
	const { getPrevWeekStartFmt: gtPrWkStFm, getPrevWeekEndFmt: gtPrWkEnFm } = usCmmnDt();
	const { getNextWeekStartFmt: gtNxWkStFm, getNextWeekEndFmt: gtNxWkEnFm } = usCmmnDt();
	const { getMonthStartFmt: gtMnStFm, getMonthEndFmt: gtMnthEndFmt } = usCmmnDt();
	const { getPrevMonthStartFmt: gtPrMnStFm, getPrevMonthEndFmt: gtPrMnEnFm } = usCmmnDt();
	const { getNextMonthStartFmt: gtNxMnStFm, getNextMonthEndFmt: gtNxMnEnFm } = usCmmnDt();
	const { getYearStartFmt: gtYrStrtFmt, getYearEndFmt: gtYrEndFmt } = usCmmnDt();
	const { getPrevYearStartFmt: gtPrYrStFm, getPrevYearEndFmt: gtPrYrEnFm } = usCmmnDt();
	const { getNextYearStartFmt: gtNxYrStFm, getNextYearEndFmt: gtNxYrEnFm } = usCmmnDt();
	const { translate } = usStrLang();

	// 2-2. useState ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	const [dtStrInSv, stDtStrInSv] = useState<string>(``);
	const [dtStrInLst, stDtStrInLst] = useState<string>(``);
	const [dtClssInSv, stDtClssInSv] = useState<string>(``);
	const [dtClssInLst, stDtClInLs] = useState<string>(``);

	// 2-1. useStorageLocal ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	const [dtTypInSv, stDtTypInSv] = useState<string>(``);
	const [dtTypInLst, stDtTypInLst] = usStrgLcl(
		`type`,
		`list`,
		PATH,
		`month`,
	);

	// 2-2. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	/* useEffect(() => {
    console.log(`
      DATE: ${JSON.stringify(DATE, null, 2)}
      dateStrInSave: ${dateStrInSave}
      dateStrInList: ${dateStrInList}
      dateTypeInSave: ${dateTypeInSave}
      dateTypeInList: ${dateTypeInList}
    `);
  }, [ dateStrInSave, dateStrInList, dateTypeInSave, dateTypeInList ]); */

	// 2-2. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	// - 화면 로딩시 초기값 설정 1
	// - 클래스 설정
	useEffect(() => {
		if (isList) {
			stDtClssInSv(`h-min-0px h-5vh fs-0-8rem pointer`);
			stDtClInLs(`h-min-0px h-5vh fs-0-8rem pointer`);
		} else {
			stDtClssInSv(`h-min-40px fs-0-8rem pointer`);
			stDtClInLs(`h-min-40px fs-0-8rem pointer`);
		}
	}, []);

	// 2-2. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	// - 화면 로딩시 초기값 설정 2
	// - 리스트 설정
	useEffect(() => {
		// 1. Goal
		if (isGoalList) {
			if (dtTypInLst === `day`) {
				setDATE({
					dateType: `day`,
					dateStart: DATE?.dateStart ?? getDayFmt(),
					dateEnd: DATE?.dateEnd ?? getDayFmt(),
				});
			} else if (dtTypInLst === `week`) {
				setDATE({
					dateType: `week`,
					dateStart: DATE?.dateStart ?? gtWkStrtFmt(),
					dateEnd: DATE?.dateEnd ?? gtWkEndFmt(),
				});
			} else if (dtTypInLst === `month`) {
				setDATE({
					dateType: `month`,
					dateStart: DATE?.dateStart ?? gtMnStFm(),
					dateEnd: DATE?.dateEnd ?? gtMnthEndFmt(),
				});
			} else if (dtTypInLst === `year`) {
				setDATE({
					dateType: `year`,
					dateStart: DATE?.dateStart ?? gtYrStrtFmt(),
					dateEnd: DATE?.dateEnd ?? gtYrEndFmt(),
				});
			}
		}

		// 4. Record
		else if (isRecordList) {
			if (dtTypInLst === `day`) {
				setDATE({
					dateType: `day`,
					dateStart: DATE?.dateStart ?? getDayFmt(),
					dateEnd: DATE?.dateEnd ?? getDayFmt(),
				});
			} else if (dtTypInLst === `week`) {
				setDATE({
					dateType: `week`,
					dateStart: DATE?.dateStart ?? gtWkStrtFmt(),
					dateEnd: DATE?.dateEnd ?? gtWkEndFmt(),
				});
			} else if (dtTypInLst === `month`) {
				setDATE({
					dateType: `month`,
					dateStart: DATE?.dateStart ?? gtMnStFm(),
					dateEnd: DATE?.dateEnd ?? gtMnthEndFmt(),
				});
			} else if (dtTypInLst === `year`) {
				setDATE({
					dateType: `year`,
					dateStart: DATE?.dateStart ?? gtYrStrtFmt(),
					dateEnd: DATE?.dateEnd ?? gtYrEndFmt(),
				});
			}
		}
	}, []);

	// 2-2. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	// - 화면 로딩시 초기값 설정 3
	// - 상세 설정
	// - 리스트에서 디테일로 들어가기 때문에 dateTypeInList 사용
	// - 목표 = 주, 월, 년만 가능
	// - 기록 = 일 만 가능
	useEffect(() => {
		// 1. Goal
		if (isGoalDetail) {
			if (dtTypInLst === `week`) {
				setDATE((prev) => ({
					...prev,
					dateType: `week`,
					dateStart: gtWkStrtFmt(prev.dateStart),
					dateEnd: gtWkEndFmt(prev.dateStart),
				}));
			} else if (dtTypInLst === `month`) {
				setDATE({
					dateType: `month`,
					dateStart: gtMnStFm(),
					dateEnd: gtMnthEndFmt(),
				});
			} else if (dtTypInLst === `year`) {
				setDATE({
					dateType: `year`,
					dateStart: gtYrStrtFmt(),
					dateEnd: gtYrEndFmt(),
				});
			}
		}

		// 2. Record
		else if (isRecDtl) {
			setDATE((prev) => ({
				...prev,
				dateType: `day`,
				dateStart: getDayFmt(prev.dateStart),
				dateEnd: getDayFmt(prev.dateStart),
			}));
		}
	}, []);

	// 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	// - 리스트에서 타입 변경시 처리 (일, 주, 월, 년)
	useEffect(() => {
		// 1. Goal - List
		if (isGoalList) {
			if (dtTypInLst === `day`) {
				setDATE((prev) => ({
					...prev,
					dateType: `day`,
					dateStart: getDayFmt(prev.dateStart),
					dateEnd: getDayFmt(prev.dateStart),
				}));
			} else if (dtTypInLst === `week`) {
				setDATE((prev) => ({
					...prev,
					dateType: `week`,
					dateStart: gtWkStrtFmt(prev.dateStart),
					dateEnd: gtWkEndFmt(prev.dateStart),
				}));
			} else if (dtTypInLst === `month`) {
				setDATE((prev) => ({
					...prev,
					dateType: `month`,
					dateStart: gtMnStFm(prev.dateStart),
					dateEnd: gtMnthEndFmt(prev.dateStart),
				}));
			} else if (dtTypInLst === `year`) {
				setDATE((prev) => ({
					...prev,
					dateType: `year`,
					dateStart: gtYrStrtFmt(prev.dateStart),
					dateEnd: gtYrEndFmt(prev.dateStart),
				}));
			}
		}

		// 4. Record - List
		else if (isRecordList) {
			if (dtTypInLst === `day`) {
				setDATE((prev) => ({
					...prev,
					dateType: `day`,
					dateStart: getDayFmt(prev.dateStart),
					dateEnd: getDayFmt(prev.dateStart),
				}));
			} else if (dtTypInLst === `week`) {
				setDATE((prev) => ({
					...prev,
					dateType: `week`,
					dateStart: gtWkStrtFmt(prev.dateStart),
					dateEnd: gtWkEndFmt(prev.dateStart),
				}));
			} else if (dtTypInLst === `month`) {
				setDATE((prev) => ({
					...prev,
					dateType: `month`,
					dateStart: gtMnStFm(prev.dateStart),
					dateEnd: gtMnthEndFmt(prev.dateStart),
				}));
			} else if (dtTypInLst === `year`) {
				setDATE((prev) => ({
					...prev,
					dateType: `year`,
					dateStart: gtYrStrtFmt(prev.dateStart),
					dateEnd: gtYrEndFmt(prev.dateStart),
				}));
			}
		}
	}, [dtTypInLst]);

	// 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	// - 상세에서 타입 변경시 처리 (일, 주, 월, 년)
	useEffect(() => {
		// 1. Goal - Detail
		if (isGoalDetail) {
			if (dtTypInSv === `day`) {
				setDATE((prev) => ({
					...prev,
					dateType: `day`,
					dateStart: getDayFmt(prev.dateStart),
					dateEnd: getDayFmt(prev.dateStart),
				}));
			} else if (dtTypInSv === `week`) {
				setDATE((prev) => ({
					...prev,
					dateType: `week`,
					dateStart: gtWkStrtFmt(prev.dateStart),
					dateEnd: gtWkEndFmt(prev.dateStart),
				}));
			} else if (dtTypInSv === `month`) {
				setDATE((prev) => ({
					...prev,
					dateType: `month`,
					dateStart: gtMnStFm(prev.dateStart),
					dateEnd: gtMnthEndFmt(prev.dateStart),
				}));
			} else if (dtTypInSv === `year`) {
				setDATE((prev) => ({
					...prev,
					dateType: `year`,
					dateStart: gtYrStrtFmt(prev.dateStart),
					dateEnd: gtYrEndFmt(prev.dateStart),
				}));
			}
		}

		// 2. Record - Detail
		else if (isRecDtl) {
			if (dtTypInSv === `day`) {
				setDATE((prev) => ({
					...prev,
					dateType: `day`,
					dateStart: getDayFmt(prev.dateStart),
					dateEnd: getDayFmt(prev.dateStart),
				}));
			} else if (dtTypInSv === `week`) {
				setDATE((prev) => ({
					...prev,
					dateType: `week`,
					dateStart: gtWkStrtFmt(prev.dateStart),
					dateEnd: gtWkEndFmt(prev.dateStart),
				}));
			} else if (dtTypInSv === `month`) {
				setDATE((prev) => ({
					...prev,
					dateType: `month`,
					dateStart: gtMnStFm(prev.dateStart),
					dateEnd: gtMnthEndFmt(prev.dateStart),
				}));
			} else if (dtTypInSv === `year`) {
				setDATE((prev) => ({
					...prev,
					dateType: `year`,
					dateStart: gtYrStrtFmt(prev.dateStart),
					dateEnd: gtYrEndFmt(prev.dateStart),
				}));
			}
		}
	}, [dtTypInSv]);

	// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	// 2-3. useEffect
	// - 타입 및 날짜 변경시 표시 날짜 텍스트 변경
	// - handle 사용해서 월, 일만 표시
	useEffect(() => {
		// 1. List
		if (isList) {
			// ex. 2026-01-15
			if (DATE?.dateType === `day`) {
				stDtStrInLst(
					hndlDtFrmt(getDayFmt(DATE?.dateStart), `yyyy-mm-dd`),
				);
			}
			// ex. 01-15 - 01-21
			else if (DATE?.dateType === `week`) {
				stDtStrInLst(
					`${hndlDtFrmt(gtWkStrtFmt(DATE?.dateStart), `mm-dd`)} - ${hndlDtFrmt(gtWkEndFmt(DATE?.dateStart), `mm-dd`)}`,
				);
			}
			// ex. 01-01 - 01-31
			else if (DATE?.dateType === `month`) {
				stDtStrInLst(
					`${hndlDtFrmt(gtMnStFm(DATE?.dateStart), `mm-dd`)} - ${hndlDtFrmt(gtMnthEndFmt(DATE?.dateStart), `mm-dd`)}`,
				);
			}
			// ex. 2026
			else if (DATE?.dateType === `year`) {
				stDtStrInLst(
					hndlDtFrmt(gtYrStrtFmt(DATE?.dateStart), `yyyy`),
				);
			} else {
				stDtStrInLst(
					hndlDtFrmt(getDayFmt(DATE?.dateStart), `yyyy-mm-dd`),
				);
			}
		}

		// 2. Detail
		else if (isDetail) {
			// ex. 2026-01-15
			if (DATE?.dateType === `day`) {
				stDtStrInSv(
					hndlDtFrmt(getDayFmt(DATE?.dateStart), `yyyy-mm-dd`),
				);
			}
			// ex. 01-15 - 01-21
			else if (DATE?.dateType === `week`) {
				stDtStrInSv(
					`${hndlDtFrmt(gtWkStrtFmt(DATE?.dateStart), `mm-dd`)} - ${hndlDtFrmt(gtWkEndFmt(DATE?.dateStart), `mm-dd`)}`,
				);
			}
			// ex. 01-01 - 01-31
			else if (DATE?.dateType === `month`) {
				stDtStrInSv(
					`${hndlDtFrmt(gtMnStFm(DATE?.dateStart), `mm-dd`)} - ${hndlDtFrmt(gtMnthEndFmt(DATE?.dateStart), `mm-dd`)}`,
				);
			}
			// ex. 2026
			else if (DATE?.dateType === `year`) {
				stDtStrInSv(
					hndlDtFrmt(gtYrStrtFmt(DATE?.dateStart), `yyyy`),
				);
			} else {
				stDtStrInSv(
					hndlDtFrmt(getDayFmt(DATE?.dateStart), `yyyy-mm-dd`),
				);
			}
		}
	}, [isList, isDetail, DATE?.dateType, DATE?.dateStart, DATE?.dateEnd]);

	// 4. handle ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const hndlDtFrmt = (str: string, format?: string): string => {
		// 1. yyyy
		if (format === `yyyy`) {
			if (str?.split(`-`).length >= 1) {
				return str.split(`-`)[0];
			}
			return ``;
		}
		// 2. mm-dd
		else if (format === `mm-dd`) {
			if (str?.split(`-`).length === 3) {
				return `${str.split(`-`)[1]}-${str.split(`-`)[2]}`;
			}
			return ``;
		}
		// 3. yyyy-mm-dd
		else if (format === `yyyy-mm-dd`) {
			return str;
		}
		return str;
	};

	// 7. pickerNode  ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const pickerNode = () => {
		// 1. dateTypeInList ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
		const dtTyInLsSe = () => (
			<Select
				label={translate(`dateType`)}
				value={DATE?.dateType ?? dtTypInLst}
				inputclass={`pointer ${dtClssInLst}`}
				onChange={(e: any) => {
					stDtTypInLst(e.target.value);
				}}
			>
				{[`day`, `week`, `month`, `year`]?.map((item: any) => (
					<MenuItem key={item} value={item} selected={item === dtTypInLst}>
						<Div className={`fs-0-8rem`}>{translate(item as string)}</Div>
					</MenuItem>
				))}
			</Select>
		);

		// 2. dateTypeInSave ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
		const dtTypInSvSec = () => (
			<Select
				label={translate(`dateType`)}
				value={DATE?.dateType ?? dtTypInSv}
				inputclass={`pointer ${dtClssInSv}`}
				disabled={!isGoalDetail}
				onChange={(e: any) => {
					if (e.target.value === `day`) {
						stDtTypInSv(`day`);
					} else if (e.target.value === `week`) {
						stDtTypInSv(`week`);
					} else if (e.target.value === `month`) {
						stDtTypInSv(`month`);
					} else if (e.target.value === `year`) {
						stDtTypInSv(`year`);
					}
				}}
			>
				{isGoalDetail
					? [`week`, `month`, `year`]?.map((item: any) => (
							<MenuItem
								key={item}
								value={item}
								selected={item === dtTypInSv}
							>
								<Div className={`fs-0-8rem`}>{translate(item as string)}</Div>
							</MenuItem>
						))
					: [`day`]?.map((item: any) => (
							<MenuItem
								key={item}
								value={item}
								selected={item === dtTypInSv}
							>
								<Div className={`fs-0-8rem`}>{translate(item as string)}</Div>
							</MenuItem>
						))}
			</Select>
		);

		// 3. day ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
		const daySection = () => (
			<PopUp
				type={`innerCenter`}
				position={`center`}
				direction={`center`}
				contents={
					<Grid container={true} spacing={2} className={`w-min-70vw`}>
						<Grid size={12} className={`d-row-center`}>
							<Div className={`fs-1-2rem fw-600 mr-10px`}>
								{translate(`viewDay`)}
							</Div>
							<Div className={`fs-0-8rem fw-500 dark`}>
								{`[${hndlDtFrmt(getDayFmt(DATE?.dateStart), `yyyy-mm-dd`)}]`}
							</Div>
						</Grid>
						<Grid size={12} className={`d-center`}>
							<LclzProv
								dateAdapter={AdptMmnt}
								adapterLocale={localLang}
							>
								<DateCalendar
									timezone={lclTmZn}
									views={[`day`]}
									readOnly={false}
									value={getDayNotFmt(DATE?.dateStart ?? DATE?.dateEnd)}
									className={`border-1 radius-2`}
									showDaysOutsideCurrentMonth={true}
									slotProps={{
										calendarHeader: {
											format: `YYYY/MM`,
										},
									}}
									slots={{
										day: (props) => {
											const { outsideCurrentMonth: otsdCurMnth, day, ...other } = props;

											let isSelected: boolean = false;
											let isBadged: boolean = false;
											let color: string = ``;
											let borderRadius: string = ``;
											let bckgClr: string = ``;
											let boxShadow: string = ``;
											let zIndex: number = 0;
											// badge 표시는 일 단위로 표시
											if (EXIST?.day) {
												EXIST?.day.forEach((item: any) => {
													if (
														item.split(` - `) &&
														item.split(` - `)?.length === 2 &&
														getDayFmt(day) >= item.split(` - `)[0] &&
														getDayFmt(day) <= item.split(` - `)[1]
													) {
														isBadged = true;
													}
												});
											}

											if (DATE?.dateStart && DATE?.dateEnd) {
												isSelected = DATE?.dateStart === getDayFmt(day);
											}

											if (isSelected) {
												color = `#ffffff`;
												bckgClr = `#1976d2`;
												boxShadow = `0 0 0 0 #1976d2`;
												borderRadius = `50%`;
												zIndex = 10;
											}
											return (
												<Badge
													key={day as unknown as string}
													badgeContent={``}
													slotProps={{
														badge: {
															style: {
																width: 3,
																height: 3,
																padding: 0,
																top: 8,
																left: 30,
																backgroundColor: isBadged
																	? `#1976d2`
																	: undefined,
															},
														},
													}}
												>
													<PickersDay
														{...other}
														day={day}
														selected={isSelected}
														outsideCurrentMonth={otsdCurMnth}
														style={{
															color: color,
															borderRadius: borderRadius,
															backgroundColor: bckgClr,
															boxShadow: boxShadow,
															zIndex: zIndex,
														}}
														onDaySelect={(day) => {
															setDATE((prev) => ({
																...prev,
																dateStart: getDayFmt(day),
																dateEnd: getDayFmt(day),
															}));
															setSession(`section`, `food`, ``, []);
														}}
													/>
												</Badge>
											);
										},
										previousIconButton: (props) => (
											<Btn
												{...props}
												className={`fs-1-4rem`}
												onClick={() => {
													setDATE((prev) => ({
														...prev,
														dateStart: gtPrMnStFm(prev.dateStart),
														dateEnd: gtPrMnStFm(prev.dateStart),
													}));
												}}
											>
												{props.children}
											</Btn>
										),
										nextIconButton: (props) => (
											<Btn
												{...props}
												className={`fs-1-4rem`}
												onClick={() => {
													setDATE((prev) => ({
														...prev,
														dateStart: gtNxMnStFm(prev.dateStart),
														dateEnd: gtNxMnStFm(prev.dateStart),
													}));
												}}
											>
												{props.children}
											</Btn>
										),
									}}
								/>
							</LclzProv>
						</Grid>
					</Grid>
				}
				children={(popTrigger: any) => (
					<Input
						label={translate(`date`)}
						value={isList ? dtStrInLst : isDetail ? dtStrInSv : ``}
						inputclass={`pointer ${dtClssInLst}`}
						readOnly={true}
						startadornment={
							<Img
								max={25}
								hover={true}
								shadow={false}
								radius={false}
								src={`common1.webp`}
							/>
						}
						endadornment={
							<Div className={`d-row-center`}>
								<Div className={`mr-n10px`}>
									<Icons
										key={`ChevronLeft`}
										name={`ChevronLeft`}
										className={`w-20px h-20px`}
										onClick={(e: any) => {
											e.stopPropagation();
											setDATE((prev) => ({
												...prev,
												dateStart: gtPrDyStFm(prev.dateStart),
												dateEnd: gtPrDyEnFm(prev.dateStart),
											}));
											setSession(`section`, `food`, ``, []);
										}}
									/>
								</Div>
								<Div className={`mr-n15px`}>
									<Icons
										key={`ChevronRight`}
										name={`ChevronRight`}
										className={`w-20px h-20px`}
										onClick={(e: any) => {
											e.stopPropagation();
											setDATE((prev) => ({
												...prev,
												dateStart: gtNxDyStFm(prev.dateStart),
												dateEnd: gtNxDyEnFm(prev.dateStart),
											}));
											setSession(`section`, `food`, ``, []);
										}}
									/>
								</Div>
							</Div>
						}
						onClick={(e: any) => {
							popTrigger.openPopup(e.currentTarget);
						}}
					/>
				)}
			/>
		);

		// 4. week ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
		const weekSection = () => (
			<PopUp
				type={`innerCenter`}
				position={`center`}
				direction={`center`}
				contents={
					<Grid container={true} spacing={2} className={`w-min-70vw`}>
						<Grid size={12} className={`d-row-center`}>
							<Div className={`fs-1-2rem fw-600 mr-10px`}>
								{translate(`viewWeek`)}
							</Div>
							<Div className={`fs-0-8rem fw-500 dark`}>
								{`[${hndlDtFrmt(gtWkStrtFmt(DATE?.dateStart), `mm-dd`)} - ${hndlDtFrmt(gtWkEndFmt(DATE?.dateEnd), `mm-dd`)}]`}
							</Div>
						</Grid>
						<Grid size={12} className={`d-center`}>
							<LclzProv
								dateAdapter={AdptMmnt}
								adapterLocale={localLang}
							>
								<DateCalendar
									timezone={lclTmZn}
									views={[`day`]}
									readOnly={false}
									value={getDayNotFmt(DATE?.dateStart ?? DATE?.dateEnd)}
									className={`border-1 radius-2`}
									showDaysOutsideCurrentMonth={true}
									slotProps={{
										calendarHeader: {
											format: `YYYY/MM`,
										},
									}}
									slots={{
										day: (props) => {
											const { outsideCurrentMonth: otsdCurMnth, day, ...other } = props;

											let isSelected: boolean = false;
											let isBadged: boolean = false;
											let isFirst: boolean = false;
											let isLast: boolean = false;

											let color: string = ``;
											let borderRadius: string = ``;
											let bckgClr: string = ``;
											let boxShadow: string = ``;
											let zIndex: number = 0;

											// badge 표시는 일 단위로 표시
											if (EXIST?.day) {
												EXIST?.day.forEach((item: any) => {
													if (
														item.split(` - `) &&
														item.split(` - `)?.length === 2 &&
														getDayFmt(day) >= item.split(` - `)[0] &&
														getDayFmt(day) <= item.split(` - `)[1]
													) {
														isBadged = true;
													}
												});
											}

											if (DATE?.dateStart && DATE?.dateEnd) {
												isSelected =
													DATE?.dateStart <= getDayFmt(day) &&
													DATE?.dateEnd >= getDayFmt(day);
												isFirst = DATE?.dateStart === gtDyStrtFmt(day);
												isLast = DATE?.dateEnd === getDayEndFmt(day);
											}

											if (isSelected) {
												if (isFirst && isLast) {
													boxShadow = `0 0 0 0 #1976d2`;
													borderRadius = `50%`;
												} else if (isFirst) {
													boxShadow = `5px 0 0 0 #1976d2`;
													borderRadius = `50% 0 0 50%`;
												} else if (isLast) {
													boxShadow = `-5px 0 0 0 #1976d2`;
													borderRadius = `0 50% 50% 0`;
												} else {
													boxShadow = `5px 0 0 0 #1976d2`;
													borderRadius = `0%`;
												}
												color = `#ffffff`;
												bckgClr = `#1976d2`;
												zIndex = 10;
											}
											return (
												<Badge
													key={day as unknown as string}
													badgeContent={``}
													slotProps={{
														badge: {
															style: {
																width: 3,
																height: 3,
																padding: 0,
																top: 8,
																left: 30,
																backgroundColor: isBadged
																	? `#1976d2`
																	: undefined,
															},
														},
													}}
												>
													<PickersDay
														{...other}
														day={day}
														selected={isSelected}
														outsideCurrentMonth={otsdCurMnth}
														style={{
															color: color,
															borderRadius: borderRadius,
															backgroundColor: bckgClr,
															boxShadow: boxShadow,
															zIndex: zIndex,
														}}
														onDaySelect={(day) => {
															setDATE((prev) => ({
																...prev,
																dateStart: gtWkStrtFmt(day),
																dateEnd: gtWkEndFmt(day),
															}));
														}}
													/>
												</Badge>
											);
										},
										previousIconButton: (props) => (
											<Btn
												{...props}
												className={`fs-1-4rem`}
												onClick={() => {
													setDATE((prev) => ({
														...prev,
														dateStart: gtPrWkStFm(prev.dateStart),
														dateEnd: gtPrWkEnFm(prev.dateStart),
													}));
												}}
											>
												{props.children}
											</Btn>
										),
										nextIconButton: (props) => (
											<Btn
												{...props}
												className={`fs-1-4rem`}
												onClick={() => {
													setDATE((prev) => ({
														...prev,
														dateStart: gtNxWkStFm(prev.dateStart),
														dateEnd: gtNxWkEnFm(prev.dateStart),
													}));
												}}
											>
												{props.children}
											</Btn>
										),
									}}
								/>
							</LclzProv>
						</Grid>
					</Grid>
				}
				children={(popTrigger: any) => (
					<Input
						label={translate(`duration`)}
						value={isList ? dtStrInLst : isDetail ? dtStrInSv : ``}
						inputclass={`pointer ${dtClssInLst}`}
						readOnly={true}
						startadornment={
							<Img
								max={25}
								hover={true}
								shadow={false}
								radius={false}
								src={`common1.webp`}
							/>
						}
						endadornment={
							<Div className={`d-row-center`}>
								<Div className={`mr-n10px`}>
									<Icons
										key={`ChevronLeft`}
										name={`ChevronLeft`}
										className={`w-20px h-20px`}
										onClick={(e: any) => {
											e.stopPropagation();
											setDATE((prev) => ({
												...prev,
												dateStart: gtPrWkStFm(prev.dateStart),
												dateEnd: gtPrWkEnFm(prev.dateStart),
											}));
										}}
									/>
								</Div>
								<Div className={`mr-n15px`}>
									<Icons
										key={`ChevronRight`}
										name={`ChevronRight`}
										className={`w-20px h-20px`}
										onClick={(e: any) => {
											e.stopPropagation();
											setDATE((prev) => ({
												...prev,
												dateStart: gtNxWkStFm(prev.dateStart),
												dateEnd: gtNxWkEnFm(prev.dateStart),
											}));
										}}
									/>
								</Div>
							</Div>
						}
						onClick={(e: any) => {
							popTrigger.openPopup(e.currentTarget);
						}}
					/>
				)}
			/>
		);

		// 5. month ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
		const monthSection = () => (
			<PopUp
				type={`innerCenter`}
				position={`center`}
				direction={`center`}
				contents={
					<Grid container={true} spacing={2} className={`w-min-70vw`}>
						<Grid size={12} className={`d-row-center`}>
							<Div className={`fs-1-2rem fw-600 mr-10px`}>
								{translate(`viewMonth`)}
							</Div>
							<Div className={`fs-0-8rem fw-500 dark`}>
								{`[${hndlDtFrmt(gtMnStFm(DATE?.dateStart), `mm-dd`)} - ${hndlDtFrmt(gtMnthEndFmt(DATE?.dateEnd), `mm-dd`)}]`}
							</Div>
						</Grid>
						<Grid size={12} className={`d-center`}>
							<LclzProv
								dateAdapter={AdptMmnt}
								adapterLocale={localLang}
							>
								<DateCalendar
									timezone={lclTmZn}
									views={[`day`]}
									readOnly={false}
									value={getDayNotFmt(DATE?.dateStart ?? DATE?.dateEnd)}
									className={`border-1 radius-2`}
									showDaysOutsideCurrentMonth={true}
									slotProps={{
										calendarHeader: {
											format: `YYYY/MM`,
										},
									}}
									slots={{
										day: (props) => {
											const { outsideCurrentMonth: otsdCurMnth, day, ...other } = props;

											let isSelected: boolean = false;
											let isBadged: boolean = false;

											let color: string = ``;
											let borderRadius: string = ``;
											let bckgClr: string = ``;
											let boxShadow: string = ``;
											let zIndex: number = 0;

											// badge 표시는 일 단위로 표시
											if (EXIST?.day) {
												EXIST?.day.forEach((item: any) => {
													if (
														item.split(` - `) &&
														item.split(` - `)?.length === 2 &&
														getDayFmt(day) >= item.split(` - `)[0] &&
														getDayFmt(day) <= item.split(` - `)[1]
													) {
														isBadged = true;
													}
												});
											}

											if (DATE?.dateStart && DATE?.dateEnd) {
												isSelected =
													DATE?.dateStart === getDayFmt(day) &&
													getDayNotFmt(day).date() === 1;
											}

											if (isSelected) {
												color = `#ffffff`;
												bckgClr = `#1976d2`;
												boxShadow = `0 0 0 0 #1976d2`;
												borderRadius = `50%`;
												zIndex = 10;
											}

											return (
												<Badge
													key={day as unknown as string}
													badgeContent={``}
													slotProps={{
														badge: {
															style: {
																width: 3,
																height: 3,
																padding: 0,
																top: 8,
																left: 30,
																backgroundColor: isBadged
																	? `#1976d2`
																	: undefined,
															},
														},
													}}
												>
													<PickersDay
														{...other}
														day={day}
														selected={isSelected}
														outsideCurrentMonth={otsdCurMnth}
														style={{
															color: color,
															borderRadius: borderRadius,
															backgroundColor: bckgClr,
															boxShadow: boxShadow,
															zIndex: zIndex,
														}}
														onDaySelect={(day) => {
															setDATE((prev) => ({
																...prev,
																dateStart: gtMnStFm(day),
																dateEnd: gtMnthEndFmt(day),
															}));
														}}
													/>
												</Badge>
											);
										},
										previousIconButton: (props) => (
											<Btn
												{...props}
												className={`fs-1-4rem`}
												onClick={() => {
													setDATE((prev) => ({
														...prev,
														dateStart: gtPrMnStFm(prev.dateStart),
														dateEnd: gtPrMnEnFm(prev.dateStart),
													}));
												}}
											>
												{props.children}
											</Btn>
										),
										nextIconButton: (props) => (
											<Btn
												{...props}
												className={`fs-1-4rem`}
												onClick={() => {
													setDATE((prev) => ({
														...prev,
														dateStart: gtNxMnStFm(prev.dateStart),
														dateEnd: gtNxMnEnFm(prev.dateStart),
													}));
												}}
											>
												{props.children}
											</Btn>
										),
									}}
								/>
							</LclzProv>
						</Grid>
					</Grid>
				}
				children={(popTrigger: any) => (
					<Input
						label={translate(`duration`)}
						value={isList ? dtStrInLst : isDetail ? dtStrInSv : ``}
						inputclass={`pointer ${dtClssInLst}`}
						readOnly={true}
						startadornment={
							<Img
								max={25}
								hover={true}
								shadow={false}
								radius={false}
								src={`common1.webp`}
							/>
						}
						endadornment={
							<Div className={`d-row-center`}>
								<Div className={`mr-n10px`}>
									<Icons
										key={`ChevronLeft`}
										name={`ChevronLeft`}
										className={`w-20px h-20px`}
										onClick={(e: any) => {
											e.stopPropagation();
											setDATE((prev) => ({
												...prev,
												dateStart: gtPrMnStFm(prev.dateStart),
												dateEnd: gtPrMnEnFm(prev.dateStart),
											}));
										}}
									/>
								</Div>
								<Div className={`mr-n15px`}>
									<Icons
										key={`ChevronRight`}
										name={`ChevronRight`}
										className={`w-20px h-20px`}
										onClick={(e: any) => {
											e.stopPropagation();
											setDATE((prev) => ({
												...prev,
												dateStart: gtNxMnStFm(prev.dateStart),
												dateEnd: gtNxMnEnFm(prev.dateStart),
											}));
										}}
									/>
								</Div>
							</Div>
						}
						onClick={(e: any) => {
							popTrigger.openPopup(e.currentTarget);
						}}
					/>
				)}
			/>
		);

		// 6. year ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
		const yearSection = () => (
			<PopUp
				type={`innerCenter`}
				position={`center`}
				direction={`center`}
				contents={
					<Grid container={true} spacing={2} className={`w-min-70vw`}>
						<Grid size={12} className={`d-row-center`}>
							<Div className={`fs-1-2rem fw-600 mr-10px`}>
								{translate(`viewYear`)}
							</Div>
							<Div className={`fs-0-8rem fw-500 dark`}>
								{`[${hndlDtFrmt(gtYrStrtFmt(DATE?.dateStart), `yyyy`)}]`}
							</Div>
						</Grid>
						<Grid size={12} className={`d-center`}>
							<LclzProv
								dateAdapter={AdptMmnt}
								adapterLocale={localLang}
							>
								<DateCalendar
									timezone={lclTmZn}
									views={[`day`]}
									readOnly={false}
									value={getDayNotFmt(DATE?.dateStart ?? DATE?.dateEnd)}
									className={`border-1 radius-2`}
									showDaysOutsideCurrentMonth={true}
									slotProps={{
										calendarHeader: {
											format: `YYYY/MM`,
										},
									}}
									slots={{
										day: (props) => {
											const { outsideCurrentMonth: otsdCurMnth, day, ...other } = props;

											let isSelected: boolean = false;
											let isBadged: boolean = false;

											let color: string = ``;
											let borderRadius: string = ``;
											let bckgClr: string = ``;
											let boxShadow: string = ``;
											let zIndex: number = 0;

											if (DATE?.dateStart && DATE?.dateEnd) {
												isSelected =
													getDayNotFmt(day).month() === 0 &&
													getDayNotFmt(day).date() === 1;
											}

											// badge 표시는 일 단위로 표시
											if (EXIST?.day) {
												EXIST?.day.forEach((item: any) => {
													const startYear: string = item
														.split(` - `)[0]
														.split(`-`)[0];
													const currentYear: string =
														getDayFmt(day).split(`-`)[0];
													const isJanuary: boolean = day.month() === 0;

													if (startYear === currentYear && isJanuary) {
														isBadged = true;
													}
												});
											}

											if (isSelected) {
												color = `#ffffff`;
												bckgClr = `#1976d2`;
												boxShadow = `0 0 0 0 #1976d2`;
												borderRadius = `50%`;
												zIndex = 10;
											}

											return (
												<Badge
													key={day as unknown as string}
													badgeContent={``}
													slotProps={{
														badge: {
															style: {
																width: 3,
																height: 3,
																padding: 0,
																top: 8,
																left: 30,
																backgroundColor: isBadged
																	? `#1976d2`
																	: undefined,
															},
														},
													}}
												>
													<PickersDay
														{...other}
														day={day}
														selected={isSelected}
														outsideCurrentMonth={otsdCurMnth}
														style={{
															color: color,
															borderRadius: borderRadius,
															backgroundColor: bckgClr,
															boxShadow: boxShadow,
															zIndex: zIndex,
														}}
														onDaySelect={(day) => {
															setDATE((prev) => ({
																...prev,
																dateStart: gtYrStrtFmt(day),
																dateEnd: gtYrEndFmt(day),
															}));
														}}
													/>
												</Badge>
											);
										},
										previousIconButton: (props) => (
											<Btn
												{...props}
												className={`fs-1-4rem`}
												onClick={() => {
													setDATE((prev) => ({
														...prev,
														dateStart: gtPrYrStFm(prev.dateStart),
														dateEnd: gtPrYrEnFm(prev.dateStart),
													}));
												}}
											>
												{props.children}
											</Btn>
										),
										nextIconButton: (props) => (
											<Btn
												{...props}
												className={`fs-1-4rem`}
												onClick={() => {
													setDATE((prev) => ({
														...prev,
														dateStart: gtNxYrStFm(prev.dateStart),
														dateEnd: gtNxYrEnFm(prev.dateStart),
													}));
												}}
											>
												{props.children}
											</Btn>
										),
									}}
								/>
							</LclzProv>
						</Grid>
					</Grid>
				}
				children={(popTrigger: any) => (
					<Input
						label={translate(`duration`)}
						value={isList ? dtStrInLst : isDetail ? dtStrInSv : ``}
						inputclass={`pointer ${dtClssInLst}`}
						readOnly={true}
						startadornment={
							<Img
								max={25}
								hover={true}
								shadow={false}
								radius={false}
								src={`common1.webp`}
							/>
						}
						endadornment={
							<Div className={`d-row-center`}>
								<Div className={`mr-n10px`}>
									<Icons
										key={`ChevronLeft`}
										name={`ChevronLeft`}
										className={`w-20px h-20px`}
										onClick={(e: any) => {
											e.stopPropagation();
											setDATE((prev) => ({
												...prev,
												dateStart: gtPrYrStFm(prev.dateStart),
												dateEnd: gtPrYrEnFm(prev.dateStart),
											}));
										}}
									/>
								</Div>
								<Div className={`mr-n15px`}>
									<Icons
										key={`ChevronRight`}
										name={`ChevronRight`}
										className={`w-20px h-20px`}
										onClick={(e: any) => {
											e.stopPropagation();
											setDATE((prev) => ({
												...prev,
												dateStart: gtNxYrStFm(prev.dateStart),
												dateEnd: gtNxYrEnFm(prev.dateStart),
											}));
										}}
									/>
								</Div>
							</Div>
						}
						onClick={(e: any) => {
							popTrigger.openPopup(e.currentTarget);
						}}
					/>
				)}
			/>
		);

		// 10. return ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
		return (
			// 1-1. 리스트 (Goal)
			isGoalList ? (
				<Grid container={true} spacing={1}>
					<Grid size={3} className={`d-center`}>
						{dtTyInLsSe()}
					</Grid>
					<Grid size={9} className={`d-center`}>
						{dtTypInLst === `day` && daySection()}
						{dtTypInLst === `week` && weekSection()}
						{dtTypInLst === `month` && monthSection()}
						{dtTypInLst === `year` && yearSection()}
					</Grid>
				</Grid>
			) : // 1-2. 리스트 (Record)
			isRecordList ? (
				<Grid container={true} spacing={1}>
					<Grid size={3} className={`d-center`}>
						{dtTyInLsSe()}
					</Grid>
					<Grid size={9} className={`d-center`}>
						{dtTypInLst === `day` && daySection()}
						{dtTypInLst === `week` && weekSection()}
						{dtTypInLst === `month` && monthSection()}
						{dtTypInLst === `year` && yearSection()}
					</Grid>
				</Grid>
			) : // 2-1. 세이브 (Calendar)
			isClndDtl ? (
				<Grid container={true} spacing={1}>
					<Grid size={{ xs: 4, sm: 3 }} className={`d-center`}>
						{dtTypInSvSec()}
					</Grid>
					<Grid size={{ xs: 8, sm: 9 }} className={`d-center`}>
						{DATE?.dateType === `day` && daySection()}
						{DATE?.dateType === `week` && weekSection()}
						{DATE?.dateType === `month` && monthSection()}
						{DATE?.dateType === `year` && yearSection()}
					</Grid>
				</Grid>
			) : // 2-2. 세이브 (Goal)
			isGoalDetail ? (
				<Grid container={true} spacing={1}>
					<Grid size={{ xs: 4, sm: 3 }} className={`d-center`}>
						{dtTypInSvSec()}
					</Grid>
					<Grid size={{ xs: 8, sm: 9 }} className={`d-center`}>
						{DATE?.dateType === `week` && weekSection()}
						{DATE?.dateType === `month` && monthSection()}
						{DATE?.dateType === `year` && yearSection()}
					</Grid>
				</Grid>
			) : // 2-3. 세이브 (Record)
			isRecDtl ? (
				<Grid container={true} spacing={1}>
					<Grid size={{ xs: 4, sm: 3 }} className={`d-center`}>
						{dtTypInSvSec()}
					</Grid>
					<Grid size={{ xs: 8, sm: 9 }} className={`d-center`}>
						{DATE?.dateType === `day` && daySection()}
					</Grid>
				</Grid>
			) : null
		);
	};

	// 10. return ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	return <>{pickerNode()}</>;
});

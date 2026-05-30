/**
 * @file CalendarList.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { Br, Div, Grid, Icons, Paper } from "@exportComponents";
import { useCommonDate as usCmmnDt, useCommonValue as usCmmnVal, useStorageLocal as usStrgLcl } from "@exportHooks";
import { Footer } from "@exportLayouts";
import { axios, ReactCalendar as RctClnd } from "@exportLibs";
import { memo, useEffect, useState } from "@exportReacts";
import { Calendar, type CalendarType } from "@exportSchemas";
import {
	useStoreAlert as usStrAlrt,
	useStoreLanguage as usStrLang,
	useStoreLoading as usStrLoad,
} from "@exportStores";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const CalendarList = memo(() => {
	// 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const { URL_OBJECT, PATH } = usCmmnVal();
	const { sessionId, navigate, localLang } = usCmmnVal();
	const { getMoment, getDayFmt, getDayStartFmt: gtDyStrtFmt, getDayEndFmt, getDayNotFmt } =
		usCmmnDt();
	const { getPrevMonthStartFmt: gtPrMnStFm, getPrevMonthEndFmt: gtPrMnEnFm } = usCmmnDt();
	const { getNextMonthStartFmt: gtNxMnStFm, getNextMonthEndFmt: gtNxMnEnFm } = usCmmnDt();
	const { getMonthStartFmt: gtMnStFm, getMonthEndFmt: gtMnthEndFmt } = usCmmnDt();
	const { translate } = usStrLang();
	const { setALERT } = usStrAlrt();
	const { setLOADING } = usStrLoad();

	// 2-1. useStorageLocal ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	const [DATE, setDATE] = usStrgLcl(`date`, PATH, ``, {
		dateType: ``,
		dateStart: gtMnStFm(),
		dateEnd: gtMnthEndFmt(),
	});
	const [PAGING, _setPAGING] = usStrgLcl(`paging`, PATH, ``, {
		sort: `asc`,
		page: 1,
	});

	// 2-2. useState ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const [OBJECT, setOBJECT] = useState([Calendar]);
	const [EXIST, setEXIST] = useState({
		day: [``],
		week: [``],
		month: [``],
		year: [``],
		select: [``],
	});
	const [SEND, setSEND] = useState({
		category: ``,
		refresh: 0,
		dateType: `day`,
		dateStart: `0000-00-00`,
		dateEnd: `0000-00-00`,
	});

	// 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	useEffect(() => {
		setLOADING(true);
		axios
			.get(`${URL_OBJECT}/list`, {
				params: {
					user_id: sessionId,
					PAGING: PAGING,
					DATE: {
						dateType: ``,
						dateStart: DATE?.dateStart,
						dateEnd: DATE?.dateEnd,
					},
				},
			})
			.then((res: any) => {
				setLOADING(false);
				setOBJECT(res.data.result?.length > 0 ? res.data.result : [Calendar]);
			})
			.catch((error: any) => {
				setLOADING(false);
				setALERT({
					open: true,
					msg: translate(error.response.data.msg as string),
					severity: `error`,
				});
			})
			.finally(() => {
				setLOADING(false);
			});
	}, [URL_OBJECT, sessionId, DATE?.dateStart, DATE?.dateEnd]);

	// 7. list ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	const listNode = () => {
		// 7-1. dateInRange
		const dateInRange = (date: any, dateStart: any, dateEnd: any) => {
			const isValid = (d: any) => !!d && d !== `0000-00-00`;
			if (!isValid(dateStart) || !isValid(dateEnd)) {
				return false;
			}
			const dayFmt: string = getDayFmt(date as string | Date);
			const dayStart: string = gtDyStrtFmt(dateStart as string | Date);
			const dayEnd: string = getDayEndFmt(dateEnd as string | Date);
			return dayFmt >= dayStart && dayFmt <= dayEnd;
		};

		// 7-2. title
		const titleSection = () => (
			<Grid container={true} spacing={1}>
				<Grid size={3} className={`d-row-left`}>
					<Icons
						key={`ArrowLeft`}
						name={`ArrowLeft`}
						color={`dark`}
						fill={`dark`}
						className={`w-24px h-24px`}
						onClick={() => {
							setDATE((prev) => ({
								...prev,
								dateStart: gtPrMnStFm(prev.dateStart),
								dateEnd: gtPrMnEnFm(prev.dateStart),
							}));
						}}
					/>
				</Grid>
				<Grid size={6} className={`d-row-center`}>
					<Div
						className={`fs-1-4rem fw-500`}
						onClick={() => {
							setDATE((prev) => ({
								...prev,
								dateStart: gtMnStFm(),
								dateEnd: gtMnthEndFmt(),
							}));
						}}
					>
						{getDayNotFmt(DATE?.dateStart).format(`YYYY-MM`)}
					</Div>
				</Grid>
				<Grid size={3} className={`d-row-right`}>
					<Icons
						key={`ArrowRight`}
						name={`ArrowRight`}
						color={`dark`}
						fill={`dark`}
						className={`w-24px h-24px`}
						onClick={() => {
							setDATE((prev) => ({
								...prev,
								dateStart: gtNxMnStFm(prev.dateStart),
								dateEnd: gtNxMnEnFm(prev.dateStart),
							}));
						}}
					/>
				</Grid>
			</Grid>
		);

		// 7-2. reactCalendar
		const rctClndSec = () => (
			<RctClnd
				view={`month`}
				locale={localLang}
				calendarType={`gregory`}
				value={getMoment(DATE?.dateStart).toDate()}
				showNavigation={false}
				showDoubleView={false}
				showNeighboringMonth={true}
				prev2Label={null}
				next2Label={null}
				formatDay={(_locale, date) => getDayNotFmt(date).format(`D`)}
				formatWeekday={(_locale, date) => getDayNotFmt(date).format(`d`)}
				formatMonth={(_locale, date) => getDayNotFmt(date).format(`MM`)}
				formatYear={(_locale, date) => getDayNotFmt(date).format(`YYYY`)}
				formatLongDate={(_locale, date) =>
					getDayNotFmt(date).format(`YYYY-MM-DD`)
				}
				formatMonthYear={(_locale, date) =>
					getDayNotFmt(date).format(`YYYY-MM`)
				}
				className={`border-1 shadow-2 radius-2 over-hidden`}
				onActiveStartDateChange={({ activeStartDate: actvStrtDt }) => {
					setDATE((prev) => ({
						...prev,
						dateStart: gtMnStFm(actvStrtDt ?? new Date()),
						dateEnd: gtMnthEndFmt(actvStrtDt ?? new Date()),
					}));
				}}
				onClickDay={(value: Date) => {
					void navigate(`/calendar/detail`, {
						state: {
							dateType: `day`,
							dateStart: getDayFmt(value),
							dateEnd: getDayFmt(value),
						},
					});
				}}
				tileClassName={({ date }) => {
					// 토요일
					const isSat: boolean = getMoment(date).day() === 6;

					// 일요일
					const isSun: boolean = getMoment(date).day() === 0;

					// 오늘
					const isToday: boolean = getMoment(date).isSame(new Date(), `day`);

					// 이번달
					const isCurMnth: boolean = getMoment(date).isSame(
						getMoment(DATE?.dateStart),
						`month`,
					);

					// 섹션이 3개 이상인 경우 스크롤
					let className: string = `calendar-tile`;

					const itmMtchDt = (item: any) =>
						dateInRange(
							date,
							item.calendar_exercise_dateStart,
							item.calendar_exercise_dateEnd,
						) ||
						dateInRange(
							date,
							item.calendar_food_dateStart,
							item.calendar_food_dateEnd,
						) ||
						dateInRange(
							date,
							item.calendar_money_dateStart,
							item.calendar_money_dateEnd,
						) ||
						dateInRange(
							date,
							item.calendar_sleep_dateStart,
							item.calendar_sleep_dateEnd,
						);
					const clndFrDts: any[] = OBJECT?.filter((element) => {
						return itmMtchDt(element);
					});

					if (clndFrDts?.length > 0) {
						const sctnCntFr = (item: any) =>
							Number(
								dateInRange(
									date,
									item.calendar_exercise_dateStart,
									item.calendar_exercise_dateEnd,
								)
									? (item.calendar_exercise_section?.length ?? 0)
									: 0,
							) +
							Number(
								dateInRange(
									date,
									item.calendar_food_dateStart,
									item.calendar_food_dateEnd,
								)
									? (item.calendar_food_section?.length ?? 0)
									: 0,
							) +
							Number(
								dateInRange(
									date,
									item.calendar_money_dateStart,
									item.calendar_money_dateEnd,
								)
									? (item.calendar_money_section?.length ?? 0)
									: 0,
							) +
							Number(
								dateInRange(
									date,
									item.calendar_sleep_dateStart,
									item.calendar_sleep_dateEnd,
								)
									? (item.calendar_sleep_section?.length ?? 0)
									: 0,
							);

						const hsMnySctn: boolean = clndFrDts.some(
							(item: any) => sctnCntFr(item) > 2,
						);
						hsMnySctn && (className += ` over-y-auto`);
					}

					// 토요일 색상 변경
					if (isSat) {
						className += ` calendar-sat`;
					}

					// 일요일 색상 변경
					if (isSun) {
						className += ` calendar-sun`;
					}

					// 오늘 날짜
					if (isToday) {
						className += ` calendar-today`;
					}

					// 이전달 or 다음달
					if (!isCurMnth) {
						className += ` calendar-outside`;
					}
					return className;
				}}
				tileContent={({ date }) => {
					const exerFrDts: CalendarType[] = OBJECT?.filter((item: any) =>
						dateInRange(
							date,
							item.calendar_exercise_dateStart,
							item.calendar_exercise_dateEnd,
						),
					);
					const foodForDates: CalendarType[] = OBJECT?.filter((item: any) =>
						dateInRange(
							date,
							item.calendar_food_dateStart,
							item.calendar_food_dateEnd,
						),
					);
					const mnyFrDts: CalendarType[] = OBJECT?.filter((item: any) =>
						dateInRange(
							date,
							item.calendar_money_dateStart,
							item.calendar_money_dateEnd,
						),
					);
					const slpFrDts: CalendarType[] = OBJECT?.filter((item: any) =>
						dateInRange(
							date,
							item.calendar_sleep_dateStart,
							item.calendar_sleep_dateEnd,
						),
					);
					return (
						<>
							{exerFrDts?.length > 0 &&
								exerFrDts.map((item: any) => (
									<Div
										key={`exercise-${item._id}`}
										className={`calendar-filled`}
										style={{ backgroundColor: `#1976d2` }}
									>
										<span className={`calendar-category`}>
											{translate(`exercise`)}
										</span>
									</Div>
								))}
							{foodForDates?.length > 0 &&
								foodForDates.map((item: any) => (
									<Div
										key={`food-${item._id}`}
										className={`calendar-filled`}
										style={{ backgroundColor: `#FF5722` }}
									>
										<span className={`calendar-category`}>
											{translate(`food`)}
										</span>
									</Div>
								))}
							{mnyFrDts?.length > 0 &&
								mnyFrDts.map((item: any) => (
									<Div
										key={`money-${item._id}`}
										className={`calendar-filled`}
										style={{ backgroundColor: `#4CAF50` }}
									>
										<span className={`calendar-category`}>
											{translate(`money`)}
										</span>
									</Div>
								))}
							{slpFrDts?.length > 0 &&
								slpFrDts.map((item: any) => (
									<Div
										key={`sleep-${item._id}`}
										className={`calendar-filled`}
										style={{ backgroundColor: `#673AB7` }}
									>
										<span className={`calendar-category`}>
											{translate(`sleep`)}
										</span>
									</Div>
								))}
						</>
					);
				}}
			/>
		);

		// 7-10. return
		return (
			<Paper
				className={`content-wrapper radius-2 border-1 shadow-1 h-min-75vh`}
			>
				{titleSection()}
				<Br m={10} />
				{rctClndSec()}
			</Paper>
		);
	};

	// 9. footer ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const footerNode = () => (
		<Footer
			state={{
				DATE: DATE,
				SEND: SEND,
				EXIST: EXIST,
			}}
			setState={{
				setDATE: setDATE,
				setSEND: setSEND,
				setEXIST: setEXIST,
			}}
		/>
	);

	// 10. return ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	return (
		<>
			{listNode()}
			{footerNode()}
		</>
	);
});

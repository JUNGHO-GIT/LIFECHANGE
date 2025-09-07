// Picker.tsx

import {useEffect, useState} from "@importReacts";
import {useCommonValue, useCommonDate, useStorageLocal} from "@importHooks";
import {useStoreLanguage} from "@importStores";
import {setSession} from "@importScripts";
import {PopUp, Input, Select} from "@importContainers";
import {Btn, Img, Div, Icons, Grid} from "@importComponents";
import {MenuItem, PickersDay, Badge} from "@importMuis";
import {DateCalendar, AdapterMoment, LocalizationProvider} from "@importMuis";

// -------------------------------------------------------------------------------------------------
declare type PickerDayProps = {
	DATE: {
		dateType: string;
		dateStart: string;
		dateEnd: string;
	};
	setDATE: React.Dispatch<React.SetStateAction<{
		dateType: string;
		dateStart: string;
		dateEnd: string;
	}>>;
	EXIST: {
		day: string[];
		week: string[];
		month: string[];
		year: string[];
		select: string[];
	};
};

// -------------------------------------------------------------------------------------------------
export const PickerDay = (
	{DATE, setDATE, EXIST}: PickerDayProps
) => {

	// 1. common ----------------------------------------------------------------------------------
	const {PATH, localLang, localTimeZone} = useCommonValue();
	const {isTodayList, isTodayGoalList, isGoalList, isGoalDetail} = useCommonValue();
	const {isRealList, isRealDetail, isCalendarDetail} = useCommonValue();
	const {isList, isDetail} = useCommonValue();
	const {getDayFmt, getDayNotFmt, getDayStartFmt, getDayEndFmt} = useCommonDate();
	const {getPrevDayStartFmt, getPrevDayEndFmt} = useCommonDate();
	const {getNextDayStartFmt, getNextDayEndFmt} = useCommonDate();
	const {getWeekStartFmt, getWeekEndFmt} = useCommonDate();
	const {getPrevWeekStartFmt, getPrevWeekEndFmt} = useCommonDate();
	const {getNextWeekStartFmt, getNextWeekEndFmt} = useCommonDate();
	const {getMonthStartFmt, getMonthEndFmt} = useCommonDate();
	const {getPrevMonthStartFmt, getPrevMonthEndFmt} = useCommonDate();
	const {getNextMonthStartFmt, getNextMonthEndFmt} = useCommonDate();
	const {getYearStartFmt, getYearEndFmt} = useCommonDate();
	const {getPrevYearStartFmt, getPrevYearEndFmt} = useCommonDate();
	const {getNextYearStartFmt, getNextYearEndFmt} = useCommonDate();
	const {translate} = useStoreLanguage();

	// 2-2. useState ---------------------------------------------------------------------------------
	const [dateStrInSave, setDateStrInSave] = useState<string>("");
	const [dateStrInList, setDateStrInList] = useState<string>("");
	const [dateClassInSave, setDateClassInSave] = useState<string>("");
	const [dateClassInList, setDateClassInList] = useState<string>("");

	// 2-1. useStorageLocal -----------------------------------------------------------------------
	const [dateTypeInSave, setDateTypeInSave] = useState<string>("");
	const [dateTypeInList, setDateTypeInList] = useStorageLocal(
		"type", "list", PATH, (
			"month"
		)
	);

	// ---------------------------------------------------------------------------------------------
	useEffect(() => {
		console.group("Date Debug Log");
		console.log("dateTypeInList:", dateTypeInList);
		console.log("dateStrInList:", dateStrInList);
		console.log("dateTypeInSave:", dateTypeInSave);
		console.log("dateStrInSave:", dateStrInSave);
		console.log("DATE:",JSON.stringify(DATE, null, 2));
		console.groupEnd();
	}, [DATE, dateTypeInList, dateTypeInSave, dateStrInList, dateStrInSave]);

	// 2-2. useEffect -----------------------------------------------------------------------------
	// - 화면 로딩시 초기값 설정 1
	// - 클래스 설정
	useEffect(() => {
		if (isList) {
			setDateClassInSave("h-min-0px h-5vh fs-0-8rem pointer");
			setDateClassInList("h-min-0px h-5vh fs-0-8rem pointer");
		}
		else {
			setDateClassInSave("h-min-40px fs-0-8rem pointer");
			setDateClassInList("h-min-40px fs-0-8rem pointer");
		}
	}, []);

	// 2-2. useEffect -----------------------------------------------------------------------------
	// - 화면 로딩시 초기값 설정 2
	// - 리스트 설정
	useEffect(() => {
		// 1. Today - Goal
		if (isTodayGoalList) {
			setDATE({
				dateType: "",
				dateStart: DATE.dateStart || getDayFmt(),
				dateEnd: DATE.dateEnd || getDayFmt(),
			});
			setDateTypeInList("day");
			setDateStrInList(
				`${getDayFmt(DATE.dateStart)}`
			);
		}

		// 2. Today - Real
		else if (isTodayList) {
			setDATE({
				dateType: "day",
				dateStart: DATE.dateStart || getDayFmt(),
				dateEnd: DATE.dateEnd || getDayFmt(),
			});
			setDateTypeInList("day");
			setDateStrInList(
				`${getDayFmt(DATE.dateStart)}`
			);
		}

		// 3. Goal
		else if (isGoalList) {
			if (dateTypeInList === "day") {
				setDATE({
					dateType: "",
					dateStart: DATE.dateStart || getDayFmt(),
					dateEnd: DATE.dateEnd || getDayFmt(),
				});
				setDateStrInList(
					`${getDayFmt(DATE.dateStart)}`
				);
			}
			else if (dateTypeInList === "week") {
				setDATE({
					dateType: "week",
					dateStart: DATE.dateStart || getWeekStartFmt(),
					dateEnd: DATE.dateEnd || getWeekEndFmt(),
				});
				setDateStrInList(
					`${getWeekStartFmt(DATE.dateStart)} - ${getWeekEndFmt(DATE.dateStart)}`
				);
			}
			else if (dateTypeInList === "month") {
				setDATE({
					dateType: "month",
					dateStart: DATE.dateStart || getMonthStartFmt(),
					dateEnd: DATE.dateEnd || getMonthEndFmt(),
				});
				setDateStrInList(
					`${getMonthStartFmt(DATE.dateStart)} - ${getMonthEndFmt(DATE.dateStart)}`
				);
			}
			else if (dateTypeInList === "year") {
				setDATE({
					dateType: "year",
					dateStart: DATE.dateStart || getYearStartFmt(),
					dateEnd: DATE.dateEnd || getYearEndFmt(),
				});
				setDateStrInList(
					`${getYearStartFmt(DATE.dateStart)} - ${getYearEndFmt(DATE.dateStart)}`
				);
			}
		}

		// 4. Real
		else if (isRealList) {
			if (dateTypeInList === "day") {
				setDATE({
					dateType: "day",
					dateStart: DATE.dateStart || getDayFmt(),
					dateEnd: DATE.dateEnd || getDayFmt(),
				});
				setDateStrInList(
					`${getDayFmt(DATE.dateStart)}`
				);
			}
			else if (dateTypeInList === "week") {
				setDATE({
					dateType: "week",
					dateStart: DATE.dateStart || getWeekStartFmt(),
					dateEnd: DATE.dateEnd || getWeekEndFmt(),
				});
				setDateStrInList(
					`${getWeekStartFmt(DATE.dateStart)} - ${getWeekEndFmt(DATE.dateStart)}`
				);
			}
			else if (dateTypeInList === "month") {
				setDATE({
					dateType: "month",
					dateStart: DATE.dateStart || getMonthStartFmt(),
					dateEnd: DATE.dateEnd || getMonthEndFmt(),
				});
				setDateStrInList(
					`${getMonthStartFmt(DATE.dateStart)} - ${getMonthEndFmt(DATE.dateStart)}`
				);
			}
			else if (dateTypeInList === "year") {
				setDATE({
					dateType: "year",
					dateStart: DATE.dateStart || getYearStartFmt(),
					dateEnd: DATE.dateEnd || getYearEndFmt(),
				});
				setDateStrInList(
					`${getYearStartFmt(DATE.dateStart)} - ${getYearEndFmt(DATE.dateStart)}`
				);
			}
		}
	}, []);

	// 2-2. useEffect -----------------------------------------------------------------------------
	// - 화면 로딩시 초기값 설정 3
	// - 상세 설정
	// - 리스트에서 디테일로 들어가기 때문에 dateTypeInList 사용
	// - 목표는 주, 월, 년만 가능
	// - 실제는 일 만 가능
	useEffect(() => {
		// 1. Goal
		if (isGoalDetail) {
			if (dateTypeInList === "week") {
				setDATE((prev) => ({
					...prev,
					dateType: "week",
					dateStart: getWeekStartFmt(prev.dateStart),
					dateEnd: getWeekEndFmt(prev.dateStart),
				}));
				setDateStrInSave(
					`${getWeekStartFmt(DATE.dateStart)} - ${getWeekEndFmt(DATE.dateStart)}`
				);
			}
			else if (dateTypeInList === "month") {
				setDATE({
					dateType: "month",
					dateStart: getMonthStartFmt(),
					dateEnd: getMonthEndFmt(),
				});
				setDateStrInSave(
					`${getMonthStartFmt(DATE.dateStart)} - ${getMonthEndFmt(DATE.dateStart)}`
				);
			}
			else if (dateTypeInList === "year") {
				setDATE({
					dateType: "year",
					dateStart: getYearStartFmt(),
					dateEnd: getYearEndFmt(),
				});
				setDateStrInSave(
					`${getYearStartFmt(DATE.dateStart)} - ${getYearEndFmt(DATE.dateStart)}`
				);
			}
		}

		// 2. Real
		else if (isRealDetail) {
			setDATE((prev) => ({
				...prev,
				dateType: "day",
				dateStart: getDayFmt(prev.dateStart),
				dateEnd: getDayFmt(prev.dateStart),
			}));
			setDateStrInSave(
				`${getDayFmt(DATE.dateStart)}`
			);
		}
	}, []);

	// 2-3. useEffect -----------------------------------------------------------------------------
	// - 리스트에서 타입 변경시 처리 (일, 주, 월, 년)
	useEffect(() => {
		// 1. Today - Goal - List
		if (isTodayGoalList) {
			setDATE({
				dateType: "",
				dateStart: getDayFmt(),
				dateEnd: getDayFmt(),
			});
			setDateTypeInList("day");
			setDateStrInList(
				`${getDayFmt()}`
			);
		}

		// 2. Today - Real - List
		else if (isTodayList) {
			setDATE({
				dateType: "day",
				dateStart: getDayFmt(),
				dateEnd: getDayFmt(),
			});
			setDateTypeInList("day");
			setDateStrInList(
				`${getDayFmt()}`
			);
		}

		// 3. Goal - List
		else if (isGoalList) {
			if (dateTypeInList === "day") {
				setDATE({
					dateType: "",
					dateStart: getDayFmt(),
					dateEnd: getDayFmt(),
				});
				setDateStrInList(
					`${getDayFmt()}`
				);
			}
			else if (dateTypeInList === "week") {
				setDATE({
					dateType: "week",
					dateStart: getWeekStartFmt(),
					dateEnd: getWeekEndFmt(),
				});
				setDateStrInList(
					`${getWeekStartFmt()} - ${getWeekEndFmt()}`
				);
			}
			else if (dateTypeInList === "month") {
				setDATE({
					dateType: "month",
					dateStart: getMonthStartFmt(),
					dateEnd: getMonthEndFmt(),
				});
				setDateStrInList(
					`${getMonthStartFmt()} - ${getMonthEndFmt()}`
				);
			}
			else if (dateTypeInList === "year") {
				setDATE({
					dateType: "year",
					dateStart: getYearStartFmt(),
					dateEnd: getYearEndFmt(),
				});
				setDateStrInList(
					`${getYearStartFmt()} - ${getYearEndFmt()}`
				);
			}
		}

		// 4. Real - List
		else if (isRealList) {
			if (dateTypeInList === "day") {
				setDATE({
					dateType: "day",
					dateStart: getDayFmt(),
					dateEnd: getDayFmt(),
				});
				setDateStrInList(
					`${getDayFmt()}`
				);
			}
			else if (dateTypeInList === "week") {
				setDATE({
					dateType: "week",
					dateStart: getWeekStartFmt(),
					dateEnd: getWeekEndFmt(),
				});
				setDateStrInList(
					`${getWeekStartFmt()} - ${getWeekEndFmt()}`
				);
			}
			else if (dateTypeInList === "month") {
				setDATE({
					dateType: "month",
					dateStart: getMonthStartFmt(),
					dateEnd: getMonthEndFmt(),
				});
				setDateStrInList(
					`${getMonthStartFmt()} - ${getMonthEndFmt()}`
				);
			}
			else if (dateTypeInList === "year") {
				setDATE({
					dateType: "year",
					dateStart: getYearStartFmt(),
					dateEnd: getYearEndFmt(),
				});
				setDateStrInList(
					`${getYearStartFmt()} - ${getYearEndFmt()}`
				);
			}
		}
	}, [dateTypeInList]);

	// 2-3. useEffect -----------------------------------------------------------------------------
	// - 상세에서 타입 변경시 처리 (일, 주, 월, 년)
	useEffect(() => {
		// 1. Goal - Detail
		if (isGoalDetail) {
			if (dateTypeInSave === "day") {
				setDATE({
					dateType: "",
					dateStart: getDayFmt(),
					dateEnd: getDayFmt(),
				});
				setDateStrInSave(
					`${getDayFmt()}`
				);
			}
			else if (dateTypeInSave === "week") {
				setDATE({
					dateType: "week",
					dateStart: getWeekStartFmt(),
					dateEnd: getWeekEndFmt(),
				});
				setDateStrInSave(
					`${getWeekStartFmt()} - ${getWeekEndFmt()}`
				);
			}
			else if (dateTypeInSave === "month") {
				setDATE({
					dateType: "month",
					dateStart: getMonthStartFmt(),
					dateEnd: getMonthEndFmt(),
				});
				setDateStrInSave(
					`${getMonthStartFmt()} - ${getMonthEndFmt()}`
				);
			}
			else if (dateTypeInSave === "year") {
				setDATE({
					dateType: "year",
					dateStart: getYearStartFmt(),
					dateEnd: getYearEndFmt(),
				});
				setDateStrInSave(
					`${getYearStartFmt()} - ${getYearEndFmt()}`
				);
			}
		}

		// 2. Real - Detail
		else if (isRealDetail) {
			if (dateTypeInSave === "day") {
				setDATE({
					dateType: "",
					dateStart: getDayFmt(),
					dateEnd: getDayFmt(),
				});
				setDateStrInSave(
					`${getDayFmt()}`
				);
			}
			else if (dateTypeInSave === "week") {
				setDATE({
					dateType: "week",
					dateStart: getWeekStartFmt(),
					dateEnd: getWeekEndFmt(),
				});
				setDateStrInSave(
					`${getWeekStartFmt()} - ${getWeekEndFmt()}`
				);
			}
			else if (dateTypeInSave === "month") {
				setDATE({
					dateType: "month",
					dateStart: getMonthStartFmt(),
					dateEnd: getMonthEndFmt(),
				});
				setDateStrInSave(
					`${getMonthStartFmt()} - ${getMonthEndFmt()}`
				);
			}
			else if (dateTypeInSave === "year") {
				setDATE({
					dateType: "year",
					dateStart: getYearStartFmt(),
					dateEnd: getYearEndFmt(),
				});
				setDateStrInSave(
					`${getYearStartFmt()} - ${getYearEndFmt()}`
				);
			}
		}
	}, [dateTypeInSave]);

	// --------------------------------------------------------------------------------------------
	// 2-3. useEffect
	// - 타입 및 날짜 변경시 표시 날짜 텍스트 변경
	// - handler 사용해서 월, 일만 표시
	useEffect(() => {

		// 1. List
		if (isList) {
			if (DATE.dateType === `day`) {
				setDateStrInList(
					`${handlerToMnDd(getDayFmt(DATE.dateStart))}`
				);
			}
			else if (DATE.dateType === `week`) {
				setDateStrInList(
					`${handlerToMnDd(getWeekStartFmt(DATE.dateStart))} - ${handlerToMnDd(getWeekEndFmt(DATE.dateStart))}`
				);
			}
			else if (DATE.dateType === `month`) {
				setDateStrInList(
					`${handlerToMnDd(getMonthStartFmt(DATE.dateStart))} - ${handlerToMnDd(getMonthEndFmt(DATE.dateStart))}`
				);
			}
			else if (DATE.dateType === `year`) {
				setDateStrInList(
					`${handlerToMnDd(getYearStartFmt(DATE.dateStart))} - ${handlerToMnDd(getYearEndFmt(DATE.dateStart))}`
				);
			}
			else {
				setDateStrInList(
					`${handlerToMnDd(getDayFmt(DATE.dateStart))}`
				);
			}
		}

		// 2. Detail
		else if (isDetail) {
			if (DATE.dateType === `day`) {
				setDateStrInSave(
					`${handlerToMnDd(getDayFmt(DATE.dateStart))}`
				);
			}
			else if (DATE.dateType === `week`) {
				setDateStrInSave(
					`${handlerToMnDd(getWeekStartFmt(DATE.dateStart))} - ${handlerToMnDd(getWeekEndFmt(DATE.dateStart))}`
				);
			}
			else if (DATE.dateType === `month`) {
				setDateStrInSave(
					`${handlerToMnDd(getMonthStartFmt(DATE.dateStart))} - ${handlerToMnDd(getMonthEndFmt(DATE.dateStart))}`
				);
			}
			else if (DATE.dateType === `year`) {
				setDateStrInSave(
					`${handlerToMnDd(getYearStartFmt(DATE.dateStart))} - ${handlerToMnDd(getYearEndFmt(DATE.dateStart))}`
				);
			}
			else {
				setDateStrInSave(
					`${handlerToMnDd(getDayFmt(DATE.dateStart))}`
				);
			}
		}
	}, [DATE.dateType, DATE.dateStart]);

	// 4. handler ----------------------------------------------------------------------------
	// - "2024-01-15" => "01-15"
	const handlerToMnDd = (str: string) => {
		if (str && str.split("-").length === 3) {
			return `${str.split("-")[1]}-${str.split("-")[2]}`;
		}
		return "";
	}

	// 7. pickerNode  ----------------------------------------------------------------------------
	const pickerNode = () => {

		// 1. dateTypeInList ---------------------------------------------------------------------------------
		const dateTypeInListSection = () => (
			<Select
				label={translate("dateType")}
				value={DATE.dateType || dateTypeInList}
				inputclass={`pointer ${dateClassInList}`}
				disabled={isTodayGoalList || isTodayList}
				onChange={(e: any) => {
					setDateTypeInList(e.target.value);
				}}
			>
				{["day", "week", "month", "year"]?.map((item: any) => (
					<MenuItem
						key={item}
						value={item}
						selected={item === dateTypeInList}
					>
						<Div className={"fs-0-8rem"}>
							{translate(item)}
						</Div>
					</MenuItem>
				))}
			</Select>
		);

		// 2. dateTypeInSave ---------------------------------------------------------------------------------
		const dateTypeInSaveSection = () => (
			<Select
				label={translate("dateType")}
				value={DATE.dateType || dateTypeInSave}
				inputclass={`pointer ${dateClassInSave}`}
				disabled={isRealDetail || isCalendarDetail}
				onChange={(e: any) => {
					if (e.target.value === "day") {
						setDateTypeInSave("day");
					}
					else if (e.target.value === "week") {
						setDateTypeInSave("week");
					}
					else if (e.target.value === "month") {
						setDateTypeInSave("month");
					}
					else if (e.target.value === "year") {
						setDateTypeInSave("year");
					}
				}}
			>
				{isCalendarDetail ? (
					["day"]?.map((item: any) => (
						<MenuItem
							key={item}
							value={item}
							selected={item === dateTypeInSave}
						>
							<Div className={"fs-0-8rem"}>
								{translate(item)}
							</Div>
						</MenuItem>
					))
				) : isGoalDetail ? (
					["week", "month", "year"]?.map((item: any) => (
						<MenuItem
							key={item}
							value={item}
							selected={item === dateTypeInSave}
						>
							<Div className={"fs-0-8rem"}>
								{translate(item)}
							</Div>
						</MenuItem>
					))
				) : (
					["day"]?.map((item: any) => (
						<MenuItem
							key={item}
							value={item}
							selected={item === dateTypeInSave}
						>
							<Div className={"fs-0-8rem"}>
								{translate(item)}
							</Div>
						</MenuItem>
					))
				)}
			</Select>
		);

		// 3. day --------------------------------------------------------------------------------------
		const daySection = () => (
			<PopUp
				type={"innerCenter"}
				position={"center"}
				direction={"center"}
				contents={
					<Grid container={true} spacing={2} className={"w-min-70vw"}>
						<Grid size={12} className={"d-row-center"}>
							<Div className={"fs-1-2rem fw-600 mr-10px"}>
								{translate("viewDay")}
							</Div>
							<Div className={"fs-0-8rem fw-500 dark"}>
								{`[${handlerToMnDd(getDayFmt(DATE.dateStart))}]`}
							</Div>
						</Grid>
						<Grid size={12} className={"d-center"}>
							<LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLang}>
								<DateCalendar
									timezone={localTimeZone}
									views={["day"]}
									readOnly={false}
									value={getDayNotFmt(DATE.dateStart || DATE.dateEnd)}
									className={"border-1 radius-2"}
									showDaysOutsideCurrentMonth={true}
									slots={{
										day: (props) => {
											const {outsideCurrentMonth, day, ...other} = props;

											let isSelected = false;
											let isBadged = false;

											let color = "";
											let borderRadius = "";
											let backgroundColor = "";
											let boxShadow = "";
											let zIndex = 0;

											// badge 표시는 일 단위로 표시
											if (EXIST?.day) {
												EXIST?.day.forEach((item: any) => {
													if (
														item.split(" - ") &&
														item.split(" - ")?.length === 2 &&
														getDayFmt(day) >= item.split(" - ")[0] &&
														getDayFmt(day) <= item.split(" - ")[1]
													) {
														isBadged = true;
													}
												});
											}

											if (DATE.dateStart && DATE.dateEnd) {
												isSelected = DATE.dateStart === getDayFmt(day);
											}

											if (isSelected) {
												color = "#ffffff";
												backgroundColor = "#1976d2";
												boxShadow = "0 0 0 0 #1976d2";
												borderRadius = "50%";
												zIndex = 10;
											}
											return (
												<Badge
													key={props.day.toString()}
													badgeContent={""}
													slotProps={{
														badge: {
															style: {
																width: 3, height: 3, padding: 0, top: 8, left: 30,
																backgroundColor: isBadged ? "#1976d2" : undefined,
															}
														}
													}}
												>
													<PickersDay
														{...other}
														day={day}
														selected={isSelected}
														outsideCurrentMonth={outsideCurrentMonth}
														style={{
															color: color,
															borderRadius: borderRadius,
															backgroundColor: backgroundColor,
															boxShadow: boxShadow,
															zIndex: zIndex,
														}}
														onDaySelect={(day) => {
															setDATE((prev) => ({
																...prev,
																dateStart: getDayFmt(day),
																dateEnd: getDayFmt(day),
															}));
															setSession("section", "food", "", []);
														}}
													/>
												</Badge>
											);
										},
										previousIconButton: (props) => (
											<Btn
												{...props}
												className={"fs-1-4rem"}
												onClick={() => {
													setDATE((prev) => ({
														...prev,
														dateStart: getPrevMonthStartFmt(prev.dateStart),
														dateEnd: getPrevMonthStartFmt(prev.dateStart),
													}));
												}}
											>
												{props.children}
											</Btn>
										),
										nextIconButton: (props) => (
											<Btn
												{...props}
												className={"fs-1-4rem"}
												onClick={() => {
													setDATE((prev) => ({
														...prev,
														dateStart: getNextMonthStartFmt(prev.dateStart),
														dateEnd: getNextMonthStartFmt(prev.dateStart),
													}));
												}}
											>
												{props.children}
											</Btn>
										)
									}}
								/>
							</LocalizationProvider>
						</Grid>
					</Grid>
				}
				children={(popTrigger: any) => (
					<Input
						label={translate("date")}
						value={isList ? dateStrInList : isDetail ? dateStrInSave : ""}
						inputclass={`pointer ${dateClassInList}`}
						readOnly={true}
						startadornment={
							<Img
								max={25}
								hover={true}
								shadow={false}
								radius={false}
								src={"common1.webp"}
							/>
						}
						endadornment={
							<Div className={"d-row-center"}>
								<Div className={"mr-n10px"}>
									<Icons
										key={"ChevronLeft"}
										name={"ChevronLeft"}
										className={"w-20px h-20px"}
										onClick={(e: any) => {
											e.stopPropagation();
											setDATE((prev) => ({
												...prev,
												dateStart: getPrevDayStartFmt(prev.dateStart),
												dateEnd: getPrevDayEndFmt(prev.dateStart),
											}));
											setSession("section", "food", "", []);
										}}
									/>
								</Div>
								<Div className={"mr-n15px"}>
									<Icons
										key={"ChevronRight"}
										name={"ChevronRight"}
										className={"w-20px h-20px"}
										onClick={(e: any) => {
											e.stopPropagation();
											setDATE((prev) => ({
												...prev,
												dateStart: getNextDayStartFmt(prev.dateStart),
												dateEnd: getNextDayEndFmt(prev.dateStart),
											}));
											setSession("section", "food", "", []);
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

		// 4. week -------------------------------------------------------------------------------------
		const weekSection = () => (
			<PopUp
				type={"innerCenter"}
				position={"center"}
				direction={"center"}
				contents={
					<Grid container={true} spacing={2} className={"w-min-70vw"}>
						<Grid size={12} className={"d-row-center"}>
							<Div className={"fs-1-2rem fw-600 mr-10px"}>
								{translate("viewWeek")}
							</Div>
							<Div className={"fs-0-8rem fw-500 dark"}>
								{`[${handlerToMnDd(getWeekStartFmt(DATE.dateStart))} - ${handlerToMnDd(getWeekEndFmt(DATE.dateEnd))}]`}
							</Div>
						</Grid>
						<Grid size={12} className={"d-center"}>
							<LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLang}>
								<DateCalendar
									timezone={localTimeZone}
									views={["day"]}
									readOnly={false}
									value={getDayNotFmt(DATE.dateStart || DATE.dateEnd)}
									className={"border-1 radius-2"}
									showDaysOutsideCurrentMonth={true}
									slots={{
										day: (props) => {
											const {outsideCurrentMonth, day, ...other} = props;

											let isSelected = false;
											let isBadged = false;
											let isFirst = false;
											let isLast = false;

											let color = "";
											let borderRadius = "";
											let backgroundColor = "";
											let boxShadow = "";
											let zIndex = 0;

											// badge 표시는 일 단위로 표시
											if (EXIST?.day) {
												EXIST?.day.forEach((item: any) => {
													if (
														item.split(" - ") &&
														item.split(" - ")?.length === 2 &&
														getDayFmt(day) >= item.split(" - ")[0] &&
														getDayFmt(day) <= item.split(" - ")[1]
													) {
														isBadged = true;
													}
												});
											}

											if (DATE.dateStart && DATE.dateEnd) {
												isSelected = DATE.dateStart <= getDayFmt(day) && DATE.dateEnd >= getDayFmt(day);
												isFirst = DATE.dateStart === getDayStartFmt(day);
												isLast = DATE.dateEnd === getDayEndFmt(day);
											}

											if (isSelected) {
												if (isFirst && isLast) {
													boxShadow = "0 0 0 0 #1976d2";
													borderRadius = "50%";
												}
												else if (isFirst) {
													boxShadow = "5px 0 0 0 #1976d2";
													borderRadius = "50% 0 0 50%";
												}
												else if (isLast) {
													boxShadow = "-5px 0 0 0 #1976d2";
													borderRadius = "0 50% 50% 0";
												}
												else {
													boxShadow = "5px 0 0 0 #1976d2";
													borderRadius = "0%";
												}
												color = "#ffffff";
												backgroundColor = "#1976d2";
												zIndex = 10;
											}
											return (
												<Badge
													key={props.day.toString()}
													badgeContent={""}
													slotProps={{
														badge: {
															style: {
																width: 3, height: 3, padding: 0, top: 8, left: 30,
																backgroundColor: isBadged ? "#1976d2" : undefined,
															}
														}
													}}
												>
													<PickersDay
														{...other}
														day={day}
														selected={isSelected}
														outsideCurrentMonth={outsideCurrentMonth}
														style={{
															color: color,
															borderRadius: borderRadius,
															backgroundColor: backgroundColor,
															boxShadow: boxShadow,
															zIndex: zIndex,
														}}
														onDaySelect={(day) => {
															setDATE((prev) => ({
																...prev,
																dateStart: getWeekStartFmt(day),
																dateEnd: getWeekEndFmt(day),
															}));
														}}
													/>
												</Badge>
											);
										},
										previousIconButton: (props) => (
											<Btn
												{...props}
												className={"fs-1-4rem"}
												onClick={() => {
													setDATE((prev) => ({
														...prev,
														dateStart: getPrevWeekStartFmt(prev.dateStart),
														dateEnd: getPrevWeekEndFmt(prev.dateStart),
													}));
												}}
											>
												{props.children}
											</Btn>
										),
										nextIconButton: (props) => (
											<Btn
												{...props}
												className={"fs-1-4rem"}
												onClick={() => {
													setDATE((prev) => ({
														...prev,
														dateStart: getNextWeekStartFmt(prev.dateStart),
														dateEnd: getNextWeekEndFmt(prev.dateStart),
													}));
												}}
											>
												{props.children}
											</Btn>
										),
									}}
								/>
							</LocalizationProvider>
						</Grid>
					</Grid>
				}
				children={(popTrigger: any) => (
					<Input
						label={translate("duration")}
						value={isList ? dateStrInList : isDetail ? dateStrInSave : ""}
						inputclass={`pointer ${dateClassInList}`}
						readOnly={true}
						startadornment={
							<Img
								max={25}
								hover={true}
								shadow={false}
								radius={false}
								src={"common1.webp"}
							/>
						}
						endadornment={
							<Div className={"d-row-center"}>
								<Div className={"mr-n10px"}>
									<Icons
										key={"ChevronLeft"}
										name={"ChevronLeft"}
										className={"w-20px h-20px"}
										onClick={(e: any) => {
											e.stopPropagation();
											setDATE((prev) => ({
												...prev,
												dateStart: getPrevWeekStartFmt(prev.dateStart),
												dateEnd: getPrevWeekEndFmt(prev.dateStart),
											}));
										}}
									/>
								</Div>
								<Div className={"mr-n15px"}>
									<Icons
										key={"ChevronRight"}
										name={"ChevronRight"}
										className={"w-20px h-20px"}
										onClick={(e: any) => {
											e.stopPropagation();
											setDATE((prev) => ({
												...prev,
												dateStart: getNextWeekStartFmt(prev.dateStart),
												dateEnd: getNextWeekEndFmt(prev.dateStart),
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

		// 5. month ------------------------------------------------------------------------------------
		const monthSection = () => (
			<PopUp
				type={"innerCenter"}
				position={"center"}
				direction={"center"}
				contents={
					<Grid container={true} spacing={2} className={"w-min-70vw"}>
						<Grid size={12} className={"d-row-center"}>
							<Div className={"fs-1-2rem fw-600 mr-10px"}>
								{translate("viewMonth")}
							</Div>
							<Div className={"fs-0-8rem fw-500 dark"}>
								{`[${handlerToMnDd(getMonthStartFmt(DATE.dateStart))} - ${handlerToMnDd(getMonthEndFmt(DATE.dateEnd))}]`}
							</Div>
						</Grid>
						<Grid size={12} className={"d-center"}>
							<LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLang}>
								<DateCalendar
									timezone={localTimeZone}
									views={["day"]}
									readOnly={false}
									value={getDayNotFmt(DATE.dateStart || DATE.dateEnd)}
									className={"border-1 radius-2"}
									showDaysOutsideCurrentMonth={true}
									slots={{
										day: (props) => {
											const {outsideCurrentMonth, day, ...other} = props;

											let isSelected = false;
											let isBadged = false;

											let color = "";
											let borderRadius = "";
											let backgroundColor = "";
											let boxShadow = "";
											let zIndex = 0;

											// badge 표시는 일 단위로 표시
											if (EXIST?.day) {
												EXIST?.day.forEach((item: any) => {
													if (
														item.split(" - ") &&
														item.split(" - ")?.length === 2 &&
														getDayFmt(day) >= item.split(" - ")[0] &&
														getDayFmt(day) <= item.split(" - ")[1]
													) {
														isBadged = true;
													}
												});
											}

											if (DATE.dateStart && DATE.dateEnd) {
												isSelected = DATE.dateStart === getDayFmt(day) && getDayNotFmt(day).date() === 1;
											}

											if (isSelected) {
												color = "#ffffff";
												backgroundColor = "#1976d2";
												boxShadow = "0 0 0 0 #1976d2";
												borderRadius = "50%";
												zIndex = 10;
											}

											return (
												<Badge
													key={props.day.toString()}
													badgeContent={""}
													slotProps={{
														badge: {
															style: {
																width: 3, height: 3, padding: 0, top: 8, left: 30,
																backgroundColor: isBadged ? "#1976d2" : undefined,
															}
														}
													}}
												>
													<PickersDay
														{...other}
														day={day}
														selected={isSelected}
														outsideCurrentMonth={outsideCurrentMonth}
														style={{
															color: color,
															borderRadius: borderRadius,
															backgroundColor: backgroundColor,
															boxShadow: boxShadow,
															zIndex: zIndex,
														}}
														onDaySelect={(day) => {
															setDATE((prev) => ({
																...prev,
																dateStart: getMonthStartFmt(day),
																dateEnd: getMonthEndFmt(day),
															}));
														}}
													/>
												</Badge>
											);
										},
										previousIconButton: (props) => (
											<Btn
												{...props}
												className={"fs-1-4rem"}
												onClick={() => {
													setDATE((prev) => ({
														...prev,
														dateStart: getPrevMonthStartFmt(prev.dateStart),
														dateEnd: getPrevMonthEndFmt(prev.dateStart),
													}));
												}}
											>
												{props.children}
											</Btn>
										),
										nextIconButton: (props) => (
											<Btn
												{...props}
												className={"fs-1-4rem"}
												onClick={() => {
													setDATE((prev) => ({
														...prev,
														dateStart: getNextMonthStartFmt(prev.dateStart),
														dateEnd: getNextMonthEndFmt(prev.dateStart),
													}));
												}}
											>
												{props.children}
											</Btn>
										)
									}}
								/>
							</LocalizationProvider>
						</Grid>
					</Grid>
				}
				children={(popTrigger: any) => (
					<Input
						label={translate("duration")}
						value={isList ? dateStrInList : isDetail ? dateStrInSave : ""}
						inputclass={`pointer ${dateClassInList}`}
						readOnly={true}
						startadornment={
							<Img
								max={25}
								hover={true}
								shadow={false}
								radius={false}
								src={"common1.webp"}
							/>
						}
						endadornment={
							<Div className={"d-row-center"}>
								<Div className={"mr-n10px"}>
									<Icons
										key={"ChevronLeft"}
										name={"ChevronLeft"}
										className={"w-20px h-20px"}
										onClick={(e: any) => {
											e.stopPropagation();
											setDATE((prev) => ({
												...prev,
												dateStart: getPrevMonthStartFmt(prev.dateStart),
												dateEnd: getPrevMonthEndFmt(prev.dateStart),
											}));
										}}
									/>
								</Div>
								<Div className={"mr-n15px"}>
									<Icons
										key={"ChevronRight"}
										name={"ChevronRight"}
										className={"w-20px h-20px"}
										onClick={(e: any) => {
											e.stopPropagation();
											setDATE((prev) => ({
												...prev,
												dateStart: getNextMonthStartFmt(prev.dateStart),
												dateEnd: getNextMonthEndFmt(prev.dateStart),
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

		// 6. year -------------------------------------------------------------------------------------
		const yearSection = () => (
			<PopUp
				type={"innerCenter"}
				position={"center"}
				direction={"center"}
				contents={
					<Grid container={true} spacing={2} className={"w-min-70vw"}>
						<Grid size={12} className={"d-row-center"}>
							<Div className={"fs-1-2rem fw-600 mr-10px"}>
								{translate("viewYear")}
							</Div>
							<Div className={"fs-0-8rem fw-500 dark"}>
								{`[${handlerToMnDd(getYearStartFmt(DATE.dateStart))} - ${handlerToMnDd(getYearEndFmt(DATE.dateEnd))}]`}
							</Div>
						</Grid>
						<Grid size={12} className={"d-center"}>
							<LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLang}>
								<DateCalendar
									timezone={localTimeZone}
									views={["day"]}
									readOnly={false}
									value={getDayNotFmt(DATE.dateStart || DATE.dateEnd)}
									className={"border-1 radius-2"}
									showDaysOutsideCurrentMonth={true}
									slots={{
										day: (props) => {

											const {outsideCurrentMonth, day, ...other} = props;

											let isSelected = false;
											let isBadged = false;

											let color = "";
											let borderRadius = "";
											let backgroundColor = "";
											let boxShadow = "";
											let zIndex = 0;

											if (DATE.dateStart && DATE.dateEnd) {
												isSelected = getDayNotFmt(day).month() === 0 && getDayNotFmt(day).date() === 1;
											}

											// badge 표시는 일 단위로 표시
											if (EXIST?.day) {
												EXIST?.day.forEach((item: any) => {

													const startYear = item.split(" - ")[0].split("-")[0];
													const currentYear = getDayFmt(day).split("-")[0];
													const isJanuary = day.month() === 0;

													if (startYear === currentYear && isJanuary) {
														isBadged = true;
													}
												});
											}

											if (isSelected) {
												color = "#ffffff";
												backgroundColor = "#1976d2";
												boxShadow = "0 0 0 0 #1976d2";
												borderRadius = "50%";
												zIndex = 10;
											}

											return (
												<Badge
													key={props.day.toString()}
													badgeContent={""}
													slotProps={{
														badge: {
															style: {
																width: 3, height: 3, padding: 0, top: 8, left: 30,
																backgroundColor: isBadged ? "#1976d2" : undefined,
															}
														}
													}}
												>
													<PickersDay
														{...other}
														day={day}
														selected={isSelected}
														outsideCurrentMonth={outsideCurrentMonth}
														style={{
															color: color,
															borderRadius: borderRadius,
															backgroundColor: backgroundColor,
															boxShadow: boxShadow,
															zIndex: zIndex,
														}}
														onDaySelect={(day) => {
															setDATE((prev) => ({
																...prev,
																dateStart: getYearStartFmt(day),
																dateEnd: getYearEndFmt(day),
															}));
														}}
													/>
												</Badge>
											);
										},
										previousIconButton: (props) => (
											<Btn
												{...props}
												className={"fs-1-4rem"}
												onClick={() => {
													setDATE((prev) => ({
														...prev,
														dateStart: getPrevYearStartFmt(prev.dateStart),
														dateEnd: getPrevYearEndFmt(prev.dateStart),
													}));
												}}
											>
												{props.children}
											</Btn>
										),
										nextIconButton: (props) => (
											<Btn
												{...props}
												className={"fs-1-4rem"}
												onClick={() => {
													setDATE((prev) => ({
														...prev,
														dateStart: getNextYearStartFmt(prev.dateStart),
														dateEnd: getNextYearEndFmt(prev.dateStart),
													}));
												}}
											>
												{props.children}
											</Btn>
										)
									}}
								/>
							</LocalizationProvider>
						</Grid>
					</Grid>
				}
				children={(popTrigger: any) => (
					<Input
						label={translate("duration")}
						value={isList ? dateStrInList : isDetail ? dateStrInSave : ""}
						inputclass={`pointer ${dateClassInList}`}
						readOnly={true}
						startadornment={
							<Img
								max={25}
								hover={true}
								shadow={false}
								radius={false}
								src={"common1.webp"}
							/>
						}
						endadornment={
							<Div className={"d-row-center"}>
								<Div className={"mr-n10px"}>
									<Icons
										key={"ChevronLeft"}
										name={"ChevronLeft"}
										className={"w-20px h-20px"}
										onClick={(e: any) => {
											e.stopPropagation();
											setDATE((prev) => ({
												...prev,
												dateStart: getPrevYearStartFmt(prev.dateStart),
												dateEnd: getPrevYearEndFmt(prev.dateStart),
											}));
										}}
									/>
								</Div>
								<Div className={"mr-n15px"}>
									<Icons
										key={"ChevronRight"}
										name={"ChevronRight"}
										className={"w-20px h-20px"}
										onClick={(e: any) => {
											e.stopPropagation();
											setDATE((prev) => ({
												...prev,
												dateStart: getNextYearStartFmt(prev.dateStart),
												dateEnd: getNextYearEndFmt(prev.dateStart),
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

		// 10. return ----------------------------------------------------------------------------------
		return (

			// 1-1. 리스트 (목표 - 오늘)
			isTodayGoalList ? (
				<Grid container={true} spacing={1}>
					<Grid size={3} className={"d-center"}>
						{dateTypeInListSection()}
					</Grid>
					<Grid size={9} className={"d-center"}>
						{dateTypeInList === "day" && daySection()}
					</Grid>
				</Grid>
			)

			// 1-2. 리스트 (목표)
			: isGoalList ? (
				<Grid container={true} spacing={1}>
					<Grid size={3} className={"d-center"}>
						{dateTypeInListSection()}
					</Grid>
					<Grid size={9} className={"d-center"}>
						{dateTypeInList === "day" && daySection()}
						{dateTypeInList === "week" && weekSection()}
						{dateTypeInList === "month" && monthSection()}
						{dateTypeInList === "year" && yearSection()}
					</Grid>
				</Grid>
			)

			// 1-3. 리스트 (실제 - 오늘)
			: isTodayList ? (
				<Grid container={true} spacing={1}>
					<Grid size={3} className={"d-center"}>
						{dateTypeInListSection()}
					</Grid>
					<Grid size={9} className={"d-center"}>
						{dateTypeInList === "day" && daySection()}
					</Grid>
				</Grid>
			)

			// 1-4. 리스트 (실제)
			: isRealList ? (
				<Grid container={true} spacing={1}>
					<Grid size={3} className={"d-center"}>
						{dateTypeInListSection()}
					</Grid>
					<Grid size={9} className={"d-center"}>
						{dateTypeInList === "day" && daySection()}
						{dateTypeInList === "week" && weekSection()}
						{dateTypeInList === "month" && monthSection()}
						{dateTypeInList === "year" && yearSection()}
					</Grid>
				</Grid>
			)

			// 2-1. 세이브 (일정)
			: isCalendarDetail ? (
				<Grid container={true} spacing={1}>
					<Grid size={{xs: 4, sm: 3}} className={"d-center"}>
						{dateTypeInSaveSection()}
					</Grid>
					<Grid size={{xs: 8, sm: 9}} className={"d-center"}>
						{DATE.dateType === "day" && daySection()}
						{DATE.dateType === "week" && weekSection()}
						{DATE.dateType === "month" && monthSection()}
						{DATE.dateType === "year" && yearSection()}
					</Grid>
				</Grid>
			)

			// 2-2. 세이브 (목표)
			: isGoalDetail ? (
				<Grid container={true} spacing={1}>
					<Grid size={{xs: 4, sm: 3}} className={"d-center"}>
						{dateTypeInSaveSection()}
					</Grid>
					<Grid size={{xs: 8, sm: 9}} className={"d-center"}>
						{DATE.dateType === "week" && weekSection()}
						{DATE.dateType === "month" && monthSection()}
						{DATE.dateType === "year" && yearSection()}
					</Grid>
				</Grid>
			)

			// 2-3. 세이브 (실제)
			: isRealDetail ? (
				<Grid container={true} spacing={1}>
					<Grid size={{xs: 4, sm: 3}} className={"d-center"}>
						{dateTypeInSaveSection()}
					</Grid>
					<Grid size={{xs: 8, sm: 9}} className={"d-center"}>
						{DATE.dateType === "day" && daySection()}
					</Grid>
				</Grid>
			)
			: null
		);
	};

	// 10. return ----------------------------------------------------------------------------------
	return (
		<>
			{pickerNode()}
		</>
	);
};

// SchedulePlannerDetail.tsx

import { useState, useEffect, useCallback, memo } from "@importReacts";
import { useCommonValue, useCommonDate, useValidateSchedule } from "@importHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@importStores";
import { ScheduleRecord, ScheduleRecordType } from "@importSchemas";
import { axios } from "@importLibs";
import { fnInsertComma } from "@importScripts";
import { Footer, Dialog } from "@importLayouts";
import { PickerDay, PickerTime, Count, Delete, Input, Select, Memo } from "@importContainers";
import { Img, Bg, Paper, Grid, Div, Br } from "@importComponents";
import { Checkbox, MenuItem } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const SchedulePlannerDetail = memo(() => {

	// 1. common -------------------------------------------------------------------------------------
	const { URL_OBJECT, sessionId, localCurrency } = useCommonValue();
	const { bgColors, localUnit } = useCommonValue();
	const { exerciseArray, foodArray, moneyArray } = useCommonValue();
	const { location_dateType } = useCommonValue();
	const { location_dateStart, location_dateEnd } = useCommonValue();
	const { getDayFmt, getMonthStartFmt, getMonthEndFmt } = useCommonDate();
	const { translate } = useStoreLanguage();
	const { setALERT } = useStoreAlert();
	const { setLOADING } = useStoreLoading();
	const { ERRORS, REFS, validate } = useValidateSchedule();

	// 2-2. useState ---------------------------------------------------------------------------------
	const [LOCKED, setLOCKED] = useState<string>(`unlocked`);
	const [OBJECT, setOBJECT] = useState<ScheduleRecordType>(ScheduleRecord);
	const [EXIST, setEXIST] = useState({
		day: [``],
		week: [``],
		month: [``],
		year: [``],
		select: [``],
	});
	const [FLOW, setFLOW] = useState({
		exist: false,
		itsMe: false,
		itsNew: false,
	});
	const [SEND, setSEND] = useState({
		id: ``,
		dateType: ``,
		dateStart: `0000-00-00`,
		dateEnd: `0000-00-00`,
	});
	const [COUNT, setCOUNT] = useState({
		totalCnt: 0,
		sectionCnt: 0,
		newSectionCnt: 0
	});
	const [DATE, setDATE] = useState({
		dateType: location_dateType || `select`,
		dateStart: location_dateStart || getDayFmt(),
		dateEnd: location_dateEnd || getDayFmt(),
	});

	// 2-3. useEffect -----------------------------------------------------------------------------
	useEffect(() => {
		if (EXIST?.[DATE.dateType as keyof typeof EXIST]?.length > 0) {

			const dateRange = `${DATE.dateStart.trim()} - ${DATE.dateEnd.trim()}`;
			const objectRange = `${OBJECT.schedule_record_dateStart.trim()} - ${OBJECT.schedule_record_dateEnd.trim()}`;

			const isExist = (
				EXIST?.[DATE.dateType as keyof typeof EXIST]?.includes(dateRange)
			);
			const itsMe = (
				dateRange === objectRange
			);
			const itsNew = (
				OBJECT.schedule_record_dateStart === `0000-00-00` &&
				OBJECT.schedule_record_dateEnd === `0000-00-00`
			);

			setFLOW((prev) => ({
				...prev,
				exist: isExist,
				itsMe: itsMe,
				itsNew: itsNew
			}));
		}
	}, [EXIST, DATE.dateEnd, OBJECT.schedule_record_dateEnd]);

	// 2-3. useEffect -----------------------------------------------------------------------------
	useEffect(() => {
		axios.get(`${URL_OBJECT}/planner/exist`, {
			params: {
				user_id: sessionId,
				DATE: {
					dateType: ``,
					dateStart: getMonthStartFmt(DATE.dateStart),
					dateEnd: getMonthEndFmt(DATE.dateEnd),
				},
			},
		})
		.then((res: any) => {
			setEXIST(
				!res.data.result || res.data.result?.length === 0 ? [``] : res.data.result
			);
		})
		.catch((err: any) => {
			setALERT({
				open: true,
				msg: translate(err.response.data.msg),
				severity: `error`,
			});
		});
	}, [URL_OBJECT, sessionId, DATE.dateStart, DATE.dateEnd]);

	// 2-3. useEffect -----------------------------------------------------------------------------
	useEffect(() => {
		setLOADING(true);
		if (LOCKED === `locked`) {
			setLOADING(false);
			return;
		}
		axios.get(`${URL_OBJECT}/planner/detail`, {
			params: {
				user_id: sessionId,
				DATE: DATE,
			},
		})
		.then((res: any) => {
			setLOADING(false);
			setOBJECT(res.data.result || ScheduleRecord);

			// sectionCnt가 0이면 section 초기화
			if (res.data.sectionCnt <= 0) {
				setOBJECT((prev: ScheduleRecordType) => ({
					...prev,
					schedule_exercise_section: [],
					schedule_food_section: [],
					schedule_money_section: [],
					schedule_sleep_section: [],
				}));
			}
			// sectionCnt가 0이 아니면 section 설정
			else {
				setOBJECT((prev: ScheduleRecordType) => ({
					...prev,
					schedule_exercise_section: res.data.result?.schedule_exercise_section || [],
					schedule_food_section: res.data.result?.schedule_food_section || [],
					schedule_money_section: res.data.result?.schedule_money_section || [],
					schedule_sleep_section: res.data.result?.schedule_sleep_section || [],
				}));
			}
			// count 설정
			setCOUNT((prev) => ({
				...prev,
				totalCnt: res.data.totalCnt || 0,
				sectionCnt: res.data.sectionCnt || 0,
				newSectionCnt: res.data.sectionCnt || 0
			}));
		})
		.catch((err: any) => {
			setLOADING(false);
			setALERT({
				open: true,
				msg: translate(err.response.data.msg),
				severity: `error`,
			});
		})
		.finally(() => {
			setLOADING(false);
		});
	}, [URL_OBJECT, sessionId, DATE.dateStart, DATE.dateEnd]);

	// 4-3. handle ----------------------------------------------------------------------------------
	const handleDelete = useCallback((index: number, section: keyof ScheduleRecordType) => {
		setOBJECT((prev) => {
			const target = prev[section];
			if (!Array.isArray(target)) {
				return prev;
			}
			return {
				...prev,
				[section]: target.filter((_, idx) => idx !== index)
			};
		});
		setCOUNT((prev) => ({
			...prev,
			newSectionCnt: prev.newSectionCnt - 1,
		}));
	}, []);

	// 4-4. handle ----------------------------------------------------------------------------------
	const handleNumberInput = useCallback((val: string, max: number, allowDecimal: boolean = false) => {
		let processedValue = val === `` ? `0` : val.replace(/,/g, ``);
		const regex = allowDecimal ? /^\d*\.?\d{0,1}$/ : /^\d+$/;
		if (Number(processedValue) > max || !regex.test(processedValue)) {
			return null;
		}
		if (/^0(?!\.)/.test(processedValue)) {
			processedValue = processedValue.replace(/^0+/, ``);
		}
		return processedValue;
	}, []);

	// 7. detail -------------------------------------------------------------------------------------
	const detailNode = () => {
		// 7-1. date + count
		const dateCountSection = () => (
			<Grid container={true} spacing={2} className={`radius-2 border-1 shadow-0 p-20px`}>
				<Grid size={12}>
					<PickerDay
						DATE={DATE}
						setDATE={setDATE}
						EXIST={EXIST}
					/>
				</Grid>
				<Grid size={12}>
					<Count
						COUNT={COUNT}
						setCOUNT={setCOUNT}
						LOCKED={LOCKED}
						setLOCKED={setLOCKED}
						limit={10}
						disabled={true}
					/>
				</Grid>
			</Grid>
		);

		// 7-2. excersice
		const exerciseSection = () => (
			<Grid container={true} spacing={0} className={`border-0 radius-2 shadow-0`}>
				{OBJECT?.schedule_exercise_section?.map((item, i) => (
					<Grid container spacing={2} key={`exercise-detail-${i}`}
					className={`${LOCKED === `locked` ? `locked` : ``} border-1 radius-2 p-20px`}>
						{/** row 0 **/}
						{i === 0 && (
							<Grid container={true} spacing={0} className={`mt-n5px pb-10px border-bottom-1`}>
								<Grid size={12} className={`d-row`}>
									<Div className={`d-row-left`}>
										<Img
											max={14}
											hover={true}
											shadow={false}
											radius={false}
											src={"exercise1.webp"}
											className={`ml-5px mr-10px`}
										/>
										<Div className={`fs-0-9rem fw-600`}>
											{translate(`exercise`)}
										</Div>
									</Div>
								</Grid>
							</Grid>
						)}
						{/** row 1 **/}
						<Grid container={true} spacing={1}>
							<Grid size={6} className={`d-row-left`}>
								<Bg
									badgeContent={i + 1}
									bgcolor={bgColors?.[exerciseArray.findIndex((f: any) => f.exercise_record_part === item?.exercise_record_part)]}
								/>
							</Grid>
							<Grid size={6} className={"d-row-right"}>
								<Delete
									index={i}
									section={`schedule_exercise_section`}
									handleDelete={handleDelete as any}
									LOCKED={LOCKED}
									disabled={true}
								/>
							</Grid>
						</Grid>
						{/** /.row 1 **/}

						{/** row 2 **/}
						<Grid container={true} spacing={1}>
							<Grid size={6}>
								<Select
									locked={LOCKED}
									label={translate(`part`)}
									value={item?.exercise_record_part || ``}
									inputRef={REFS?.[i]?.exercise_record_part || null}
									error={ERRORS?.[i]?.exercise_record_part || null}
									onChange={(e: any) => {
										let value = String(e.target.value || ``);
										setOBJECT((prev: ScheduleRecordType) => ({
											...prev,
											schedule_exercise_section: prev.schedule_exercise_section?.map((section: any, idx: number) => (
												idx === i ? {
													...section,
													exercise_record_part: value,
													exercise_record_title: exerciseArray[exerciseArray.findIndex((f: any) => f.exercise_record_part === value)]?.exercise_record_title[0],
												} : section
											))
										}));
									}}
								>
									{exerciseArray.map((part: any, idx: number) => (
										<MenuItem
											key={idx}
											value={part.exercise_record_part}
											className={`fs-0-8rem`}
										>
											{translate(part.exercise_record_part)}
										</MenuItem>
									))}
								</Select>
							</Grid>
							<Grid size={6}>
								<Select
									locked={LOCKED}
									label={translate(`title`)}
									value={item?.exercise_record_title || ``}
									inputRef={REFS?.[i]?.exercise_record_title}
									error={ERRORS?.[i]?.exercise_record_title}
									onChange={(e: any) => {
										let value = String(e.target.value || ``);
										setOBJECT((prev: ScheduleRecordType) => ({
											...prev,
											schedule_exercise_section: prev.schedule_exercise_section?.map((section: any, idx: number) => (
												idx === i ? {
													...section,
													exercise_record_title: value,
												} : section
											))
										}));
									}}
								>
									{exerciseArray[exerciseArray.findIndex((f: any) => f.exercise_record_part === item?.exercise_record_part)]?.exercise_record_title.map((title: any, idx: number) => (
										<MenuItem
											key={idx}
											value={title}
											className={`fs-0-8rem`}
										>
											{translate(title)}
										</MenuItem>
									))}
								</Select>
							</Grid>
						</Grid>
						{/** /.row 2 **/}

						{/** row 3 **/}
						<Grid container={true} spacing={1}>
							<Grid size={6}>
								<Input
									locked={LOCKED}
									label={translate(`set`)}
									value={fnInsertComma(item?.exercise_record_set || `0`)}
									inputRef={REFS?.[i]?.exercise_record_set}
									error={ERRORS?.[i]?.exercise_record_set}
									startadornment={
										<Img
											max={14}
											hover={true}
											shadow={false}
											radius={false}
											src={`exercise3_1.webp`}
										/>
									}
									endadornment={
										translate(`s`)
									}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
										const processedValue = handleNumberInput(e.target.value, 999);
										if (processedValue !== null) {
											setOBJECT((prev: ScheduleRecordType) => ({
												...prev,
												schedule_exercise_section: prev.schedule_exercise_section?.map((section: any, idx: number) => (
													idx === i ? {
														...section,
														exercise_record_set: processedValue
													} : section
												))
											}));
										}
									}}
								/>
							</Grid>
							<Grid size={6}>
								<Input
									locked={LOCKED}
									label={translate(`rep`)}
									value={fnInsertComma(item?.exercise_record_rep || `0`)}
									inputRef={REFS?.[i]?.exercise_record_rep}
									error={ERRORS?.[i]?.exercise_record_rep}
									startadornment={
										<Img
											max={14}
											hover={true}
											shadow={false}
											radius={false}
											src={`exercise3_2.webp`}
										/>
									}
									endadornment={
										translate(`r`)
									}
									onChange={(e: any) => {
										const processedValue = handleNumberInput(e.target.value, 999);
										if (processedValue !== null) {
											setOBJECT((prev: ScheduleRecordType) => ({
												...prev,
												schedule_exercise_section: prev.schedule_exercise_section?.map((section: any, idx: number) => (
													idx === i ? {
														...section,
														exercise_record_rep: processedValue
													} : section
												))
											}));
										}
									}}
								/>
							</Grid>
						</Grid>
						{/** /.row 3 **/}

						{/** row 4 **/}
						<Grid container={true} spacing={1}>
							<Grid size={6}>
								<Input
									locked={LOCKED}
									label={translate(`weight`)}
									value={fnInsertComma(item?.exercise_record_weight || `0`)}
									inputRef={REFS?.[i]?.exercise_record_weight}
									error={ERRORS?.[i]?.exercise_record_weight}
									startadornment={
										<Img
											max={14}
											hover={true}
											shadow={false}
											radius={false}
											src={`exercise3_3.webp`}
										/>
									}
									endadornment={
										localUnit
									}
									onChange={(e: any) => {
										const processedValue = handleNumberInput(e.target.value, 999);
										if (processedValue !== null) {
											setOBJECT((prev: ScheduleRecordType) => ({
												...prev,
												schedule_exercise_section: prev.schedule_exercise_section?.map((section: any, idx: number) => (
													idx === i ? {
														...section,
														exercise_record_weight: processedValue
													} : section
												))
											}));
										}
									}}
								/>
							</Grid>
							<Grid size={6}>
								<PickerTime
									OBJECT={OBJECT}
									setOBJECT={setOBJECT}
									REFS={REFS}
									ERRORS={ERRORS}
									DATE={DATE}
									LOCKED={LOCKED}
									extra={`exercise_record_cardio`}
									i={i}
								/>
							</Grid>
						</Grid>
						{/** /.row 4 **/}
					</Grid>
				))}
			</Grid>
		);

		// 7-3. food
		const foodSection = () => (
			<Grid container={true} spacing={0} className={`border-0 radius-2 shadow-0`}>
				{OBJECT?.schedule_food_section?.map((item, i) => (
					<Grid container spacing={2} key={`food-detail-${i}`}
					className={`${LOCKED === `locked` ? `locked` : ``} border-1 radius-2 p-20px`}>
						{/** row 0 **/}
						{i === 0 && (
							<Grid container={true} spacing={0} className={`mt-n5px pb-10px border-bottom-1`}>
								<Grid size={12} className={`d-row`}>
									<Div className={`d-row-left`}>
										<Img
											max={14}
											hover={true}
											shadow={false}
											radius={false}
											src={"food1.webp"}
											className={`ml-5px mr-10px`}
										/>
										<Div className={`fs-0-9rem fw-600`}>
											{translate(`food`)}
										</Div>
									</Div>
								</Grid>
							</Grid>
						)}
						{/** row 1 **/}
						<Grid container={true} spacing={1}>
							<Grid size={6} className={`d-row-left`}>
								<Bg
									badgeContent={i + 1}
									bgcolor={bgColors?.[foodArray.findIndex((f: any) => f.food_record_part === item?.food_record_part)]}
								/>
							</Grid>
							<Grid size={6} className={"d-row-right"}>
								<Delete
									index={i}
									section={`schedule_food_section`}
									handleDelete={handleDelete as any}
									LOCKED={LOCKED}
									disabled={true}
								/>
							</Grid>
						</Grid>
						{/** /.row 1 **/}

						{/** row 2 **/}
						<Grid container={true} spacing={1}>
							<Grid size={6}>
								<Select
									locked={LOCKED}
									label={translate(`part`)}
									value={item?.food_record_part || ``}
									inputRef={REFS?.[i]?.food_record_part}
									error={ERRORS?.[i]?.food_record_part}
									onChange={(e: any) => {
										let value = String(e.target.value || ``);
										setOBJECT((prev: ScheduleRecordType) => ({
											...prev,
											schedule_food_section: prev.schedule_food_section?.map((section: any, idx: number) => (
												idx === i ? {
													...section,
													food_record_part: value
												} : section
											))
										}));
									}}
								>
									{foodArray.map((part: any, idx: number) => (
										<MenuItem
											key={idx}
											value={part.food_record_part}
											className={`fs-0-8rem`}
										>
											{translate(part.food_record_part)}
										</MenuItem>
									))}
								</Select>
							</Grid>
							<Grid size={3}>
								<Input
									locked={LOCKED}
									label={translate(`foodCount`)}
									value={fnInsertComma(item?.food_record_count || `0`)}
									inputRef={REFS?.[i]?.food_record_count}
									error={ERRORS?.[i]?.food_record_count}
									onChange={(e: any) => {
										const processedValue = handleNumberInput(e.target.value, 99, true);
										if (processedValue !== null) {
											const numericValue = Number(processedValue) || 1;
											const foodCount = Number(item?.food_record_count) || 1;

											const setNutrient = (nut: string | number, extra: string) => {
												if (!isNaN(numericValue) && !isNaN(foodCount)) {
													return extra === `kcal`
														? (numericValue * Number(nut) / foodCount).toFixed(0)
														: (numericValue * Number(nut) / foodCount).toFixed(1);
												}
												return nut;
											};

											setOBJECT((prev: ScheduleRecordType) => ({
												...prev,
												schedule_food_section: prev.schedule_food_section?.map((section: any, idx: number) => (
													idx === i ? {
														...section,
														food_record_count: processedValue,
														food_record_kcal: setNutrient(item?.food_record_kcal, `kcal`),
														food_record_fat: setNutrient(item?.food_record_fat, `fat`),
														food_record_carb: setNutrient(item?.food_record_carb, `carb`),
														food_record_protein: setNutrient(item?.food_record_protein, `protein`),
													} : section
												))
											}));
										}
									}}
								/>
							</Grid>
							<Grid size={3}>
								<Input
									locked={LOCKED}
									label={translate(`gram`)}
									value={fnInsertComma(item?.food_record_gram || `0`)}
									inputRef={REFS?.[i]?.food_record_gram}
									error={ERRORS?.[i]?.food_record_gram}
									onChange={(e: any) => {
										const processedValue = handleNumberInput(e.target.value, 999);
										if (processedValue !== null) {
											setOBJECT((prev: ScheduleRecordType) => ({
												...prev,
												schedule_food_section: prev.schedule_food_section?.map((section: any, idx: number) => (
													idx === i ? {
														...section,
														food_record_gram: processedValue,
													} : section
												))
											}));
										}
									}}
								/>
							</Grid>
						</Grid>
						{/** /.row 2 **/}

						{/** row 3 **/}
						<Grid container={true} spacing={1}>
							<Grid size={6}>
								<Input
									locked={LOCKED}
									shrink={`shrink`}
									label={translate(`foodName`)}
									value={item?.food_record_name || ``}
									inputRef={REFS?.[i]?.food_record_name}
									error={ERRORS?.[i]?.food_record_name}
									onChange={(e: any) => {
										let value = e.target.value || ``;
										if (value?.length <= 30) {
											setOBJECT((prev: ScheduleRecordType) => ({
												...prev,
												schedule_food_section: prev.schedule_food_section?.map((section: any, idx: number) => (
													idx === i ? {
														...section,
														food_record_name: value,
													} : section
												))
											}));
										}
									}}
								/>
							</Grid>
							<Grid size={6}>
								<Input
									locked={LOCKED}
									shrink={`shrink`}
									label={translate(`brand`)}
									value={item?.food_record_brand || ``}
									inputRef={REFS?.[i]?.food_record_brand}
									error={ERRORS?.[i]?.food_record_brand}
									onChange={(e: any) => {
										let value = e.target.value || ``;
										if (value?.length <= 30) {
											setOBJECT((prev: ScheduleRecordType) => ({
												...prev,
												schedule_food_section: prev.schedule_food_section?.map((section: any, idx: number) => (
													idx === i ? {
														...section,
														food_record_brand: value,
													} : section
												))
											}));
										}
									}}
								/>
							</Grid>
						</Grid>
						{/** /.row 3 **/}

						{/** row 4 **/}
						<Grid container={true} spacing={1}>
							<Grid size={6}>
								<Input
									locked={LOCKED}
									label={translate(`kcal`)}
									value={fnInsertComma(item?.food_record_kcal || `0`)}
									inputRef={REFS?.[i]?.food_record_kcal}
									error={ERRORS?.[i]?.food_record_kcal}
									startadornment={
										<Img
											max={14}
											hover={true}
											shadow={false}
											radius={false}
											src={`food2.webp`}
										/>
									}
									endadornment={
										translate(`kc`)
									}
									onChange={(e: any) => {
										const processedValue = handleNumberInput(e.target.value, 9999);
										if (processedValue !== null) {
											setOBJECT((prev: ScheduleRecordType) => ({
												...prev,
												schedule_food_section: prev.schedule_food_section?.map((section: any, idx: number) => (
													idx === i ? {
														...section,
														food_record_kcal: processedValue,
													} : section
												))
											}));
										}
									}}
								/>
							</Grid>
							<Grid size={6}>
								<Input
									locked={LOCKED}
									label={translate(`carb`)}
									value={fnInsertComma(item?.food_record_carb || `0`)}
									inputRef={REFS?.[i]?.food_record_carb}
									error={ERRORS?.[i]?.food_record_carb}
									startadornment={
										<Img
											max={14}
											hover={true}
											shadow={false}
											radius={false}
											src={`food3.webp`}
										/>
									}
									endadornment={
										translate(`g`)
									}
									onChange={(e: any) => {
										const processedValue = handleNumberInput(e.target.value, 999, true);
										if (processedValue !== null) {
											setOBJECT((prev: ScheduleRecordType) => ({
												...prev,
												schedule_food_section: prev.schedule_food_section?.map((section: any, idx: number) => (
													idx === i ? {
														...section,
														food_record_carb: processedValue,
													} : section
												))
											}));
										}
									}}
								/>
							</Grid>
						</Grid>
						{/** /.row 4 **/}

						{/** row 5 **/}
						<Grid container={true} spacing={1}>
							<Grid size={6}>
								<Input
									locked={LOCKED}
									label={translate(`protein`)}
									value={fnInsertComma(item?.food_record_protein || `0`)}
									inputRef={REFS?.[i]?.food_record_protein}
									error={ERRORS?.[i]?.food_record_protein}
									startadornment={
										<Img
											max={14}
											hover={true}
											shadow={false}
											radius={false}
											src={`food4.webp`}
										/>
									}
									endadornment={
										translate(`g`)
									}
									onChange={(e: any) => {
										const processedValue = handleNumberInput(e.target.value, 999, true);
										if (processedValue !== null) {
											setOBJECT((prev: ScheduleRecordType) => ({
												...prev,
												schedule_food_section: prev.schedule_food_section?.map((section: any, idx: number) => (
													idx === i ? {
														...section,
														food_record_protein: processedValue,
													} : section
												))
											}));
										}
									}}
								/>
							</Grid>
							<Grid size={6}>
								<Input
									locked={LOCKED}
									label={translate(`fat`)}
									value={fnInsertComma(item?.food_record_fat || `0`)}
									inputRef={REFS?.[i]?.food_record_fat}
									error={ERRORS?.[i]?.food_record_fat}
									startadornment={
										<Img
											max={14}
											hover={true}
											shadow={false}
											radius={false}
											src={`food5.webp`}
										/>
									}
									endadornment={
										translate(`g`)
									}
									onChange={(e: any) => {
										const processedValue = handleNumberInput(e.target.value, 999, true);
										if (processedValue !== null) {
											setOBJECT((prev: ScheduleRecordType) => ({
												...prev,
												schedule_food_section: prev.schedule_food_section?.map((section: any, idx: number) => (
													idx === i ? {
														...section,
														food_record_fat: processedValue,
													} : section
												))
											}));
										}
									}}
								/>
							</Grid>
						</Grid>
						{/** /.row 5 **/}
					</Grid>
				))}
			</Grid>
		);

		// 7-4. money
		const moneySection = () => (
			<Grid container={true} spacing={0} className={`border-0 radius-2 shadow-0`}>
				{OBJECT?.schedule_money_section?.map((item, i) => (
					<Grid container spacing={2} key={`money-detail-${i}`}
					className={`${LOCKED === `locked` ? `locked` : ``} border-1 radius-2 p-20px`}>
						{/** row 0 **/}
						{i === 0 && (
							<Grid container={true} spacing={0} className={`mt-n5px pb-10px border-bottom-1`}>
								<Grid size={12} className={`d-row`}>
									<Div className={`d-row-left`}>
										<Img
											max={14}
											hover={true}
											shadow={false}
											radius={false}
											src={"money1.webp"}
											className={`ml-5px mr-10px`}
										/>
										<Div className={`fs-0-9rem fw-600`}>
											{translate(`money`)}
										</Div>
									</Div>
								</Grid>
							</Grid>
						)}
						{/** row 1 **/}
						<Grid container={true} spacing={1}>
							<Grid size={6} className={`d-row-left`}>
								<Bg
									badgeContent={i + 1}
									bgcolor={bgColors?.[moneyArray.findIndex((f: any) => f.money_record_part === item?.money_record_part)]}
								/>
							</Grid>
							<Grid size={6} className={"d-row-right"}>
								<Delete
									index={i}
									section={`schedule_money_section`}
									handleDelete={handleDelete as any}
									LOCKED={LOCKED}
									disabled={true}
								/>
							</Grid>
						</Grid>
						{/** /.row 1 **/}

						{/** row 2 **/}
						<Grid container={true} spacing={1}>
							<Grid size={6}>
								<Select
									locked={LOCKED}
									label={translate(`part`)}
									value={item?.money_record_part || ``}
									inputRef={REFS?.[i]?.money_record_part}
									error={ERRORS?.[i]?.money_record_part}
									onChange={(e: any) => {
										let value = String(e.target.value || ``);
										setOBJECT((prev: ScheduleRecordType) => ({
											...prev,
											schedule_money_section: prev.schedule_money_section?.map((section: any, idx: number) => (
												idx === i ? {
													...section,
													money_record_part: value,
													money_record_title: moneyArray[moneyArray.findIndex((f: any) => f.money_record_part === value)]?.money_record_title[0],
												} : section
											))
										}));
									}}
								>
									{moneyArray.map((part: any, idx: number) => (
										<MenuItem
											key={idx}
											value={part.money_record_part}
											className={`fs-0-8rem`}
										>
											{translate(part.money_record_part)}
										</MenuItem>
									))}
								</Select>
							</Grid>
							<Grid size={6}>
								<Select
									locked={LOCKED}
									label={translate(`title`)}
									value={item?.money_record_title || ``}
									inputRef={REFS?.[i]?.money_record_title}
									error={ERRORS?.[i]?.money_record_title}
									onChange={(e: any) => {
										let value = String(e.target.value || ``);
										setOBJECT((prev: ScheduleRecordType) => ({
											...prev,
											schedule_money_section: prev.schedule_money_section?.map((section: any, idx: number) => (
												idx === i ? {
													...section,
													money_record_title: value,
												} : section
											))
										}));
									}}
								>
									{moneyArray[moneyArray.findIndex((f: any) => f.money_record_part === item?.money_record_part)]?.money_record_title.map((title: any, idx: number) => (
										<MenuItem
											key={idx}
											value={title}
											className={`fs-0-8rem`}
										>
											{translate(title)}
										</MenuItem>
									))}
								</Select>
							</Grid>
						</Grid>
						{/** /.row 2 **/}

						{/** row 3 **/}
						<Grid container={true} spacing={1}>
							<Grid size={12}>
								<Input
									locked={LOCKED}
									label={translate(`amount`)}
									value={fnInsertComma(item?.money_record_amount || `0`)}
									inputRef={REFS?.[i]?.money_record_amount}
									error={ERRORS?.[i]?.money_record_amount}
									startadornment={
										<Img
											max={14}
											hover={true}
											shadow={false}
											radius={false}
											src={`money2.webp`}
										/>
									}
									endadornment={
										localCurrency
									}
									onChange={(e: any) => {
										const processedValue = handleNumberInput(e.target.value, 999999999);
										if (processedValue !== null) {
											setOBJECT((prev: ScheduleRecordType) => ({
												...prev,
												schedule_money_section: prev.schedule_money_section?.map((section: any, idx: number) => (
													idx === i ? {
														...section,
														money_record_amount: processedValue,
													} : section
												))
											}));
										}
									}}
								/>
							</Grid>
						</Grid>
						{/** /.row 3 **/}

						{/** row 4 **/}
						<Grid container={true} spacing={1}>
							<Grid size={{xs: 7, sm: 8}} className={`d-center`}>
								<Memo
									OBJECT={OBJECT}
									setOBJECT={setOBJECT}
									LOCKED={LOCKED}
									extra={`money_record_content`}
									i={i}
								/>
							</Grid>
							<Grid size={{xs: 5, sm: 4}} className={`d-center`}>
								<Div className={`fs-0-7rem fw-500 dark ml-10px`}>
									{translate(`includeProperty`)}
								</Div>
								<Checkbox
									size={`small`}
									className={`p-0px ml-5px`}
									checked={item?.money_record_include === `Y`}
									disabled={LOCKED === `locked`}
									onChange={(e: any) => {
										setOBJECT((prev: ScheduleRecordType) => ({
											...prev,
											schedule_money_section: prev.schedule_money_section?.map((section: any, idx: number) => (
												idx === i ? {
													...section,
													money_record_include: e.target.checked ? `Y` : `N`,
												} : section
											)),
										}));
									}}
								/>
							</Grid>
						</Grid>
						{/** /.row 4 **/}
					</Grid>
				))}
			</Grid>
		);

		// 7-5. sleep
		const sleepSection = () => (
			<Grid container={true} spacing={0} className={`border-0 radius-2 shadow-0`}>
				{OBJECT?.schedule_sleep_section?.map((item, i) => (
					<Grid container spacing={2} key={`sleep-detail-${i}`}
					className={`${LOCKED === `locked` ? `locked` : ``} border-1 radius-2 p-20px`}>
						{/** row 0 **/}
						{i === 0 && (
							<Grid container={true} spacing={0} className={`mt-n5px pb-10px border-bottom-1`}>
								<Grid size={12} className={`d-row`}>
									<Div className={`d-row-left`}>
										<Img
											max={14}
											hover={true}
											shadow={false}
											radius={false}
											src={"sleep1.webp"}
											className={`ml-5px mr-10px`}
										/>
										<Div className={`fs-0-9rem fw-600`}>
											{translate(`sleep`)}
										</Div>
									</Div>
								</Grid>
							</Grid>
						)}
						{/** row 1 **/}
						<Grid container={true} spacing={1}>
							<Grid size={6} className={`d-row-left`}>
								<Bg
									badgeContent={i + 1}
									bgcolor={"#1976d2"}
								/>
							</Grid>
							<Grid size={6} className={"d-row-right"}>
								<Delete
									index={i}
									section={`schedule_sleep_section`}
									handleDelete={handleDelete as any}
									LOCKED={LOCKED}
									disabled={true}
								/>
							</Grid>
						</Grid>
						{/** /.row 1 **/}

						{/** row 2 **/}
						<Grid container={true} spacing={1}>
							<Grid size={12}>
								<PickerTime
									OBJECT={OBJECT}
									setOBJECT={setOBJECT}
									REFS={REFS}
									ERRORS={ERRORS}
									DATE={DATE}
									LOCKED={LOCKED}
									extra={`sleep_record_bedTime`}
									i={i}
								/>
							</Grid>
						</Grid>
						{/** /.row 2 **/}

						{/** row 3 **/}
						<Grid container={true} spacing={1}>
							<Grid size={12}>
								<PickerTime
									OBJECT={OBJECT}
									setOBJECT={setOBJECT}
									REFS={REFS}
									ERRORS={ERRORS}
									DATE={DATE}
									LOCKED={LOCKED}
									extra={`sleep_record_wakeTime`}
									i={i}
								/>
							</Grid>
						</Grid>
						{/** /.row 3 **/}

						{/** row 4 **/}
						<Grid container={true} spacing={1}>
							<Grid size={12}>
								<PickerTime
									OBJECT={OBJECT}
									setOBJECT={setOBJECT}
									REFS={REFS}
									ERRORS={ERRORS}
									DATE={DATE}
									LOCKED={LOCKED}
									extra={`sleep_record_sleepTime`}
									i={i}
								/>
							</Grid>
						</Grid>
						{/** /.row 4 **/}
					</Grid>
				))}
			</Grid>
		);

		// 7-10. return
		return (
			<Paper className={`content-wrapper radius-2 border-1 shadow-1 h-min-75vh`}>
				{dateCountSection()}
				<Br m={20} />
				{exerciseSection()}
				<Br m={20} />
				{foodSection()}
				<Br m={20} />
				{moneySection()}
				<Br m={20} />
				{sleepSection()}
			</Paper>
		);
	};

	// 8. dialog -------------------------------------------------------------------------------------
	const dialogNode = () => (
		<Dialog
			COUNT={COUNT}
			setCOUNT={setCOUNT}
			LOCKED={LOCKED}
			setLOCKED={setLOCKED}
		/>
	);

	// 9. footer -------------------------------------------------------------------------------------
	const footerNode = () => (
		<Footer
			state={{
				DATE, SEND, COUNT, EXIST, FLOW,
			}}
			setState={{
				setDATE, setSEND, setCOUNT, setEXIST, setFLOW,
			}}
		/>
	);

	// 10. return ------------------------------------------------------------------------------------
	return (
		<>
			{detailNode()}
			{dialogNode()}
			{footerNode()}
		</>
	);
});

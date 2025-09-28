// ScheduleGoalList.tsx

import { useState, useEffect, memo } from "@importReacts";
import { useCommonValue, useCommonDate, useStorageLocal, useStorageSession } from "@importHooks";
import { useStoreLanguage, useStoreLoading, useStoreAlert } from "@importStores";
import { axios } from "@importLibs";
import { fnInsertComma } from "@importScripts";
import { ExerciseGoal, FoodGoal, MoneyGoal, SleepGoal } from "@importSchemas";
import { Footer, Empty, Dialog } from "@importLayouts";
import { Div, Hr, Img, Icons, Paper, Grid } from "@importComponents";
import { Accordion, AccordionSummary, AccordionDetails } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const ScheduleGoalList = memo(() => {

	// 1. common ----------------------------------------------------------------------------------
	const { URL_EXERCISE, URL_FOOD, URL_MONEY, URL_SLEEP } = useCommonValue();
	const { PATH, navigate, sessionId, localCurrency, localUnit } = useCommonValue();
	const { getDayFmt, getDayNotFmt } = useCommonDate();
	const { translate } = useStoreLanguage();
	const { setALERT } = useStoreAlert();
	const { setLOADING } = useStoreLoading();

	// 2-1. useStorageSession ---------------------------------------------------------------------
	const [DATE, setDATE] = useStorageSession(
		"date", PATH, "", {
			dateType: "",
			dateStart: getDayFmt(),
			dateEnd: getDayFmt(),
		}
	);

	// 2-2. useStorageLocal -----------------------------------------------------------------------
	const [PAGING, _setPAGING] = useStorageLocal(
		"paging", PATH, "", {
			sort: "asc",
			page: 1,
		}
	);
	const [isExpanded, setIsExpanded] = useStorageLocal(
		"isExpanded", PATH, "", {
			exercise: [{
				expanded: true,
			}],
			food: [{
				expanded: true,
			}],
			money: [{
				expanded: true,
			}],
			sleep: [{
				expanded: true,
			}],
		}
	);

	// 2-2. useState -------------------------------------------------------------------------------
	const [SEND, setSEND] = useState({
		id: "",
		from: "schedule",
		dateType: "",
		dateStart: "0000-00-00",
		dateEnd: "0000-00-00",
		toExerciseGoal: "/exercise/goal/detail",
		toExerciseRecord: "/exercise/goal/detail",
		toFoodGoal: "/food/goal/detail",
		toFoodRecord: "/food/goal/detail",
		toMoneyGoal: "/money/goal/detail",
		toMoneyRecord: "/money/goal/detail",
		toSleepGoal: "/sleep/goal/detail",
		toSleepRecord: "/sleep/goal/detail",
	});
	const [COUNT, setCOUNT] = useState({
		exercise: 0,
		food: 0,
		money: 0,
		sleep: 0,
		totalCnt: 0,
	});

	// 2-2. useState -------------------------------------------------------------------------------
	const [OBJECT_EXERCISE, setOBJECT_EXERCISE] = useState([ExerciseGoal]);
	const [OBJECT_FOOD, setOBJECT_FOOD] = useState([FoodGoal]);
	const [OBJECT_MONEY, setOBJECT_MONEY] = useState([MoneyGoal]);
	const [OBJECT_SLEEP, setOBJECT_SLEEP] = useState([SleepGoal]);

	// 2-3. useEffect -----------------------------------------------------------------------------
	useEffect(() => {(async () => {
		try {
			setLOADING(true);
			const params = {
				user_id: sessionId,
				PAGING: PAGING,
				DATE: DATE,
			};
			const [resExerciseGoal, resFoodGoal, resMoneyGoal, resSleepGoal] = await Promise.all([
				axios.get(`${URL_EXERCISE}/goal/list`, { params }),
				axios.get(`${URL_FOOD}/goal/list`, { params }),
				axios.get(`${URL_MONEY}/goal/list`, { params }),
				axios.get(`${URL_SLEEP}/goal/list`, { params })
			]);
			setOBJECT_EXERCISE(
				resExerciseGoal.data.result?.length > 0 ? resExerciseGoal.data.result : [ExerciseGoal]
			);
			setOBJECT_FOOD(
				resFoodGoal.data.result?.length > 0 ? resFoodGoal.data.result : [FoodGoal]
			);
			setOBJECT_MONEY(
				resMoneyGoal.data.result?.length > 0 ? resMoneyGoal.data.result : [MoneyGoal]
			);
			setOBJECT_SLEEP(
				resSleepGoal.data.result?.length > 0 ? resSleepGoal.data.result : [SleepGoal]
			);
			setCOUNT({
				exercise: resExerciseGoal.data.totalCnt,
				food: resFoodGoal.data.totalCnt,
				money: resMoneyGoal.data.totalCnt,
				sleep: resSleepGoal.data.totalCnt,
				totalCnt: (
					resExerciseGoal.data.totalCnt +
					resFoodGoal.data.totalCnt +
					resMoneyGoal.data.totalCnt +
					resSleepGoal.data.totalCnt
				),
			});
			// 현재 isExpanded의 길이와 응답 길이가 다를 경우, 응답 길이에 맞춰 초기화
			setIsExpanded((prev) => {
				let updated = { ...prev };
				let changed = false;
				if (resExerciseGoal.data.result?.length !== prev.exercise.length) {
					updated.exercise = Array(resExerciseGoal.data.result?.length).fill({ expanded: true });
					changed = true;
				}
				if (resFoodGoal.data.result?.length !== prev.food.length) {
					updated.food = Array(resFoodGoal.data.result?.length).fill({ expanded: true });
					changed = true;
				}
				if (resMoneyGoal.data.result?.length !== prev.money.length) {
					updated.money = Array(resMoneyGoal.data.result?.length).fill({ expanded: true });
					changed = true;
				}
				if (resSleepGoal.data.result?.length !== prev.sleep.length) {
					updated.sleep = Array(resSleepGoal.data.result?.length).fill({ expanded: true });
					changed = true;
				}
				return changed ? updated : prev;
			});
		}
		catch (err: any) {
			setLOADING(false);
			setALERT({
				open: true,
				msg: translate(err.response.data.msg),
				severity: "error",
			});
			console.error(err);
		}
		finally {
			setLOADING(false);
		}
	})()}, [
		URL_EXERCISE, URL_FOOD, URL_MONEY, URL_SLEEP,
		sessionId, PAGING?.sort, PAGING.page, DATE.dateEnd
	]);

	// 7. list -----------------------------------------------------------------------------------
	const listNode = () => {
		// 7-1. exercise
		const exerciseSection = () => (
			<Grid container={true} spacing={0}>
				{OBJECT_EXERCISE?.map((item, i) => (
				<Grid container={true} spacing={0} className={"radius-2 border-1 shadow-0 mb-10px"} key={`list-${i}`}>
						<Grid size={12} className={"p-2px"}>
							<Accordion
								className={"border-0 shadow-0 radius-2"}
								expanded={isExpanded?.exercise[i]?.expanded}
							>
								<AccordionSummary
									expandIcon={
										<Icons
											key={"ChevronDown"}
											name={"ChevronDown"}
											className={"w-16px h-16px"}
											onClick={(e: any) => {
												e.preventDefault();
												e.stopPropagation();
												setIsExpanded((prev: any) => ({
													...prev,
													exercise: prev.exercise.map((el: any, index: number) => (
														i === index ? {
															...el,
															expanded: !el.expanded
														} : el
													)),
												}));
											}}
										/>
									}
									onClick={() => {
										navigate(SEND.toExerciseGoal, {
											state: {
												id: item._id,
												from: "schedule",
												dateType: item.exercise_goal_dateType,
												dateStart: item.exercise_goal_dateStart,
												dateEnd: item.exercise_goal_dateEnd,
											}
										});
									}}
								>
									<Grid container={true} spacing={1}>
										<Grid size={2} className={"d-row-center"}>
											<Icons
												key={"Search"}
												name={"Search"}
												className={"w-16px h-16px"}
											/>
										</Grid>
										<Grid size={10} className={"d-row-left"}>
											<Div className={"fs-0-8rem fw-600 black"}>
												{item.exercise_goal_dateStart?.substring(5, 10)}
											</Div>
											<Div className={"fs-0-9rem fw-500 dark ml-5px"}>
												{translate(getDayNotFmt(item.exercise_goal_dateStart).format("ddd"))}
											</Div>
											<Div className={"fs-0-8rem fw-500 dark ml-5px mr-5px"}>
												-
											</Div>
											<Div className={"fs-0-8rem fw-600 black"}>
												{item.exercise_goal_dateEnd?.substring(5, 10)}
											</Div>
											<Div className={"fs-0-9rem fw-500 dark ml-5px"}>
												{translate(getDayNotFmt(item.exercise_goal_dateEnd).format("ddd"))}
											</Div>
										</Grid>
									</Grid>
								</AccordionSummary>
								<AccordionDetails>
									<Grid container={true} spacing={1}>
										{/** row 1 **/}
										<Grid container={true} spacing={1}>
											<Grid size={2} className={"d-row-center"}>
												<Img
													max={14}
													hover={true}
													shadow={false}
													radius={false}
													src={"exercise2.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-0-8rem fw-600 dark ml-n15px"}>
													{translate("exerciseCount")}
												</Div>
											</Grid>
											<Grid size={7}>
												<Grid container={true} spacing={1}>
													{/** goal **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("goal")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.exercise_goal_count_color}`}>
															{fnInsertComma(item.exercise_goal_count || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("c")}
														</Div>
													</Grid>
													{/** record **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("record")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.exercise_record_total_count_color}`}>
															{fnInsertComma(item.exercise_record_total_count || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("c")}
														</Div>
													</Grid>
													{/** diff **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("diff")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.exercise_record_diff_count_color}`}>
															{fnInsertComma(item.exercise_record_diff_count || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("c")}
														</Div>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
										{/** /.row 1 **/}

										<Hr m={1} className={"bg-light"} />

										{/** row 2 **/}
										<Grid container={true} spacing={1}>
											<Grid size={2} className={"d-row-center"}>
												<Img
													max={14}
													hover={true}
													shadow={false}
													radius={false}
													src={"exercise3_1.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-0-8rem fw-600 dark ml-n15px"}>
													{translate("volume")}
												</Div>
											</Grid>
											<Grid size={7}>
												<Grid container={true} spacing={1}>
													{/** goal **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("goal")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.exercise_goal_volume_color}`}>
															{fnInsertComma(item.exercise_goal_volume || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("vol")}
														</Div>
													</Grid>
													{/** record **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("record")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.exercise_record_total_volume_color}`}>
															{fnInsertComma(item.exercise_record_total_volume || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("vol")}
														</Div>
													</Grid>
													{/** diff **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("diff")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.exercise_record_diff_volume_color}`}>
															{fnInsertComma(item.exercise_record_diff_volume || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("vol")}
														</Div>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
										{/** /.row 2 **/}

										<Hr m={1} className={"bg-light"} />

										{/** row 3 **/}
										<Grid container={true} spacing={1}>
											<Grid size={2} className={"d-center"}>
												<Img
													max={14}
													hover={true}
													shadow={false}
													radius={false}
													src={"exercise4.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-0-8rem fw-600 dark ml-n15px"}>
													{translate("cardio")}
												</Div>
											</Grid>
											<Grid size={7}>
												<Grid container={true} spacing={1}>
													{/** goal **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("goal")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.exercise_goal_cardio_color}`}>
															{item.exercise_goal_cardio}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("min")}
														</Div>
													</Grid>
													{/** record **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("record")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.exercise_record_total_cardio_color}`}>
															{item.exercise_record_total_cardio}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("min")}
														</Div>
													</Grid>
													{/** diff **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("diff")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.exercise_record_diff_cardio_color}`}>
															{item.exercise_record_diff_cardio}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("min")}
														</Div>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
										{/** /.row 3 **/}

										<Hr m={1} className={"bg-light"} />

										{/** row 4 **/}
										<Grid container={true} spacing={1}>
											<Grid size={2} className={"d-center"}>
												<Img
													max={14}
													hover={true}
													shadow={false}
													radius={false}
													src={"exercise5.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-0-8rem fw-600 dark ml-n15px"}>
													{translate("scale")}
												</Div>
											</Grid>
											<Grid size={7}>
												<Grid container={true} spacing={1}>
													{/** goal **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("goal")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.exercise_goal_scale_color}`}>
															{fnInsertComma(item.exercise_goal_scale || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-right"}>
														<Div className={"fs-0-6rem"}>
															{localUnit}
														</Div>
													</Grid>
													{/** record **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("record")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.exercise_record_total_scale_color}`}>
															{fnInsertComma(item.exercise_record_total_scale || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-right"}>
														<Div className={"fs-0-6rem"}>
															{localUnit}
														</Div>
													</Grid>
													{/** diff **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("diff")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.exercise_record_diff_scale_color}`}>
															{fnInsertComma(item.exercise_record_diff_scale || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-right"}>
														<Div className={"fs-0-6rem"}>
															{localUnit}
														</Div>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
										{/** /.row 4 **/}
									</Grid>
								</AccordionDetails>
							</Accordion>
						</Grid>
					</Grid>
				))}
			</Grid>
		);
		// 7-2. food
		const foodSection = () => (
			<Grid container={true} spacing={0}>
				{OBJECT_FOOD?.map((item, i) => (
				<Grid container={true} spacing={0} className={"radius-2 border-1 shadow-0 mb-10px"} key={`list-${i}`}>
						<Grid size={12} className={"p-2px"}>
							<Accordion
								className={"border-0 shadow-0 radius-2"}
								expanded={isExpanded?.food[i]?.expanded}
							>
								<AccordionSummary
									expandIcon={
										<Icons
											key={"ChevronDown"}
											name={"ChevronDown"}
											className={"w-16px h-16px"}
											onClick={(e: any) => {
												e.preventDefault();
												e.stopPropagation();
												setIsExpanded((prev: any) => ({
													...prev,
													food: prev.food.map((el: any, index: number) => (
														i === index ? {
															...el,
															expanded: !el.expanded
														} : el
													)),
												}));
											}}
										/>
									}
									onClick={() => {
										navigate(SEND.toFoodGoal, {
											state: {
												id: item._id,
												from: "schedule",
												dateType: item.food_goal_dateType,
												dateStart: item.food_goal_dateStart,
												dateEnd: item.food_goal_dateEnd,
											}
										});
									}}
								>
									<Grid container={true} spacing={1}>
										<Grid size={2} className={"d-row-center"}>
											<Icons
												key={"Search"}
												name={"Search"}
												className={"w-16px h-16px"}
											/>
										</Grid>
										<Grid size={10} className={"d-row-left"}>
											<Div className={"fs-0-8rem fw-600 black"}>
												{item.food_goal_dateStart?.substring(5, 10)}
											</Div>
											<Div className={"fs-0-9rem fw-500 dark ml-5px"}>
												{translate(getDayNotFmt(item.food_goal_dateStart).format("ddd"))}
											</Div>
											<Div className={"fs-0-8rem fw-500 dark ml-5px mr-5px"}>
												-
											</Div>
											<Div className={"fs-0-8rem fw-600 black"}>
												{item.food_goal_dateEnd?.substring(5, 10)}
											</Div>
											<Div className={"fs-0-9rem fw-500 dark ml-5px"}>
												{translate(getDayNotFmt(item.food_goal_dateEnd).format("ddd"))}
											</Div>
										</Grid>
									</Grid>
								</AccordionSummary>
								<AccordionDetails>
									<Grid container={true} spacing={1}>
										{/** row 1 **/}
										<Grid container={true} spacing={1}>
											<Grid size={2} className={"d-row-center"}>
												<Img
													max={14}
													hover={true}
													shadow={false}
													radius={false}
													src={"food2.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-0-8rem fw-600 dark ml-n15px"}>
													{translate("kcal")}
												</Div>
											</Grid>
											<Grid size={7}>
												<Grid container={true} spacing={1}>
													{/** goal **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("goal")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.food_goal_kcal_color}`}>
															{fnInsertComma(item.food_goal_kcal || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("kc")}
														</Div>
													</Grid>
													{/** record **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("record")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.food_record_total_kcal_color}`}>
															{fnInsertComma(item.food_record_total_kcal || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("kc")}
														</Div>
													</Grid>
													{/** diff **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("diff")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.food_record_diff_kcal_color}`}>
															{fnInsertComma(item.food_record_diff_kcal || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("kc")}
														</Div>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
										{/** /.row 1 **/}

										<Hr m={1} className={"bg-light"} />

										{/** row 2 **/}
										<Grid container={true} spacing={1}>
											<Grid size={2} className={"d-row-center"}>
												<Img
													max={14}
													hover={true}
													shadow={false}
													radius={false}
													src={"food3.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-0-8rem fw-600 dark ml-n15px"}>
													{translate("carb")}
												</Div>
											</Grid>
											<Grid size={7}>
												<Grid container={true} spacing={1}>
													{/** goal **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("goal")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.food_goal_carb_color}`}>
															{fnInsertComma(item.food_goal_carb || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("g")}
														</Div>
													</Grid>
													{/** record **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("record")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.food_record_total_carb_color}`}>
															{fnInsertComma(item.food_record_total_carb || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("g")}
														</Div>
													</Grid>
													{/** diff **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("diff")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.food_record_diff_carb_color}`}>
															{fnInsertComma(item.food_record_diff_carb || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("g")}
														</Div>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
										{/** /.row 2 **/}

										<Hr m={1} className={"bg-light"} />

										{/** row 3 **/}
										<Grid container={true} spacing={1}>
											<Grid size={2} className={"d-center"}>
												<Img
													max={14}
													hover={true}
													shadow={false}
													radius={false}
													src={"food4.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-0-8rem fw-600 dark ml-n15px"}>
													{translate("protein")}
												</Div>
											</Grid>
											<Grid size={7}>
												<Grid container={true} spacing={1}>
													{/** goal **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("goal")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.food_goal_protein_color}`}>
															{fnInsertComma(item.food_goal_protein || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("g")}
														</Div>
													</Grid>
													{/** record **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("record")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.food_record_total_protein_color}`}>
															{fnInsertComma(item.food_record_total_protein || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("g")}
														</Div>
													</Grid>
													{/** diff **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("diff")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.food_record_diff_protein_color}`}>
															{fnInsertComma(item.food_record_diff_protein || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("g")}
														</Div>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
										{/** /.row 3 **/}

										<Hr m={1} className={"bg-light"} />

										{/** row 4 **/}
										<Grid container={true} spacing={1}>
											<Grid size={2} className={"d-center"}>
												<Img
													max={14}
													hover={true}
													shadow={false}
													radius={false}
													src={"food5.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-0-8rem fw-600 dark ml-n15px"}>
													{translate("fat")}
												</Div>
											</Grid>
											<Grid size={7}>
												<Grid container={true} spacing={1}>
													{/** goal **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("goal")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.food_goal_fat_color}`}>
															{fnInsertComma(item.food_goal_fat || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("g")}
														</Div>
													</Grid>
													{/** record **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("record")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.food_record_total_fat_color}`}>
															{fnInsertComma(item.food_record_total_fat || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("g")}
														</Div>
													</Grid>
													{/** diff **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("diff")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.food_record_diff_fat_color}`}>
															{fnInsertComma(item.food_record_diff_fat || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("g")}
														</Div>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
										{/** /.row 4 **/}
									</Grid>
								</AccordionDetails>
							</Accordion>
						</Grid>
					</Grid>
				))}
			</Grid>
		);
		// 7-3. money
		const moneySection = () => (
			<Grid container={true} spacing={0}>
				{OBJECT_MONEY?.map((item, i) => (
				<Grid container={true} spacing={0} className={"radius-2 border-1 shadow-0 mb-10px"} key={`list-${i}`}>
						<Grid size={12} className={"p-2px"}>
							<Accordion
								className={"border-0 shadow-0 radius-2"}
								expanded={isExpanded?.money[i]?.expanded}
							>
								<AccordionSummary
									expandIcon={
										<Icons
											key={"ChevronDown"}
											name={"ChevronDown"}
											className={"w-16px h-16px"}
											onClick={(e: any) => {
												e.preventDefault();
												e.stopPropagation();
												setIsExpanded((prev: any) => ({
													...prev,
													money: prev.money.map((el: any, index: number) => (
														i === index ? {
															...el,
															expanded: !el.expanded
														} : el
													)),
												}));
											}}
										/>
									}
									onClick={() => {
										navigate(SEND.toMoneyGoal, {
											state: {
												id: item._id,
												from: "schedule",
												dateType: item.money_goal_dateType,
												dateStart: item.money_goal_dateStart,
												dateEnd: item.money_goal_dateEnd,
											}
										});
									}}
								>
									<Grid container={true} spacing={1}>
										<Grid size={2} className={"d-row-center"}>
											<Icons
												key={"Search"}
												name={"Search"}
												className={"w-16px h-16px"}
											/>
										</Grid>
										<Grid size={10} className={"d-row-left"}>
											<Div className={"fs-0-8rem fw-600 black"}>
												{item.money_goal_dateStart?.substring(5, 10)}
											</Div>
											<Div className={"fs-0-9rem fw-500 dark ml-5px"}>
												{translate(getDayNotFmt(item.money_goal_dateStart).format("ddd"))}
											</Div>
											<Div className={"fs-0-8rem fw-500 dark ml-5px mr-5px"}>
												-
											</Div>
											<Div className={"fs-0-8rem fw-600 black"}>
												{item.money_goal_dateEnd?.substring(5, 10)}
											</Div>
											<Div className={"fs-0-9rem fw-500 dark ml-5px"}>
												{translate(getDayNotFmt(item.money_goal_dateEnd).format("ddd"))}
											</Div>
										</Grid>
									</Grid>
								</AccordionSummary>
								<AccordionDetails>
									<Grid container={true} spacing={1}>
										{/** row 1 **/}
										<Grid container={true} spacing={1}>
											<Grid size={2} className={"d-row-center"}>
												<Img
													max={14}
													hover={true}
													shadow={false}
													radius={false}
													src={"money2.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-0-8rem fw-600 dark ml-n15px"}>
													{translate("income")}
												</Div>
											</Grid>
											<Grid size={7}>
												<Grid container={true} spacing={1}>
													{/** goal **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("goal")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.money_goal_income_color}`}>
															{fnInsertComma(item.money_goal_income || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate(localCurrency)}
														</Div>
													</Grid>
													{/** record **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("record")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.money_record_total_income_color}`}>
															{fnInsertComma(item.money_record_total_income || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate(localCurrency)}
														</Div>
													</Grid>
													{/** diff **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("diff")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.money_record_diff_income_color}`}>
															{fnInsertComma(item.money_record_diff_income || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate(localCurrency)}
														</Div>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
										{/** /.row 1 **/}

										<Hr m={1} className={"bg-light"} />

										{/** row 2 **/}
										<Grid container={true} spacing={1}>
											<Grid size={2} className={"d-row-center"}>
												<Img
													max={14}
													hover={true}
													shadow={false}
													radius={false}
													src={"money2.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-0-8rem fw-600 dark ml-n15px"}>
													{translate("expense")}
												</Div>
											</Grid>
											<Grid size={7}>
												<Grid container={true} spacing={1}>
													{/** goal **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("goal")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.money_goal_expense_color}`}>
															{fnInsertComma(item.money_goal_expense || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate(localCurrency)}
														</Div>
													</Grid>
													{/** record **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("record")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.money_record_total_expense_color}`}>
															{fnInsertComma(item.money_record_total_expense || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate(localCurrency)}
														</Div>
													</Grid>
													{/** diff **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("diff")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.money_record_diff_expense_color}`}>
															{fnInsertComma(item.money_record_diff_expense || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate(localCurrency)}
														</Div>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
										{/** /.row 2 **/}
									</Grid>
								</AccordionDetails>
							</Accordion>
						</Grid>
					</Grid>
				))}
			</Grid>
		);
		// 7-4. sleep
		const sleepSection = () => (
			<Grid container={true} spacing={0}>
				{OBJECT_SLEEP?.map((item, i) => (
				<Grid container={true} spacing={0} className={"radius-2 border-1 shadow-0 mb-10px"} key={`list-${i}`}>
						<Grid size={12} className={"p-2px"}>
							<Accordion
								className={"border-0 shadow-0 radius-2"}
								expanded={isExpanded?.sleep[i]?.expanded}
							>
								<AccordionSummary
									expandIcon={
										<Icons
											key={"ChevronDown"}
											name={"ChevronDown"}
											className={"w-16px h-16px"}
											onClick={(e: any) => {
												e.preventDefault();
												e.stopPropagation();
												setIsExpanded((prev: any) => ({
													...prev,
													sleep: prev.sleep.map((el: any, index: number) => (
														i === index ? {
															...el,
															expanded: !el.expanded
														} : el
													)),
												}));
											}}
										/>
									}
									onClick={() => {
										navigate(SEND.toSleepGoal, {
											state: {
												id: item._id,
												from: "schedule",
												dateType: item.sleep_goal_dateType,
												dateStart: item.sleep_goal_dateStart,
												dateEnd: item.sleep_goal_dateEnd,
											}
										});
									}}
								>
									<Grid container={true} spacing={1}>
										<Grid size={2} className={"d-row-center"}>
											<Icons
												key={"Search"}
												name={"Search"}
												className={"w-16px h-16px"}
											/>
										</Grid>
										<Grid size={10} className={"d-row-left"}>
											<Div className={"fs-0-8rem fw-600 black"}>
												{item.sleep_goal_dateStart?.substring(5, 10)}
											</Div>
											<Div className={"fs-0-9rem fw-500 dark ml-5px"}>
												{translate(getDayNotFmt(item.sleep_goal_dateStart).format("ddd"))}
											</Div>
											<Div className={"fs-0-8rem fw-500 dark ml-5px mr-5px"}>
												-
											</Div>
											<Div className={"fs-0-8rem fw-600 black"}>
												{item.sleep_goal_dateEnd?.substring(5, 10)}
											</Div>
											<Div className={"fs-0-9rem fw-500 dark ml-5px"}>
												{translate(getDayNotFmt(item.sleep_goal_dateEnd).format("ddd"))}
											</Div>
										</Grid>
									</Grid>
								</AccordionSummary>
								<AccordionDetails>
									<Grid container={true} spacing={1}>
										{/** row 1 **/}
										<Grid container={true} spacing={1}>
											<Grid size={2} className={"d-row-center"}>
												<Img
													max={14}
													hover={true}
													shadow={false}
													radius={false}
													src={"sleep2.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-0-8rem fw-600 dark ml-n15px"}>
													{translate("bedTime")}
												</Div>
											</Grid>
											<Grid size={7}>
												<Grid container={true} spacing={1}>
													{/** goal **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("goal")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.sleep_goal_bedTime_color}`}>
															{item.sleep_goal_bedTime}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("hm")}
														</Div>
													</Grid>
													{/** record **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("record")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.sleep_record_bedTime_color}`}>
															{item.sleep_record_bedTime}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("hm")}
														</Div>
													</Grid>
													{/** diff **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("diff")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.sleep_record_diff_bedTime_color}`}>
															{item.sleep_record_diff_bedTime}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("hm")}
														</Div>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
										{/** /.row 1 **/}

										<Hr m={1} className={"bg-light"} />

										{/** row 2 **/}
										<Grid container={true} spacing={1}>
											<Grid size={2} className={"d-center"}>
												<Img
													max={14}
													hover={true}
													shadow={false}
													radius={false}
													src={"sleep3.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-0-8rem fw-600 dark ml-n15px"}>
													{translate("wakeTime")}
												</Div>
											</Grid>
											<Grid size={7}>
												<Grid container={true} spacing={1}>
													{/** goal **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("goal")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.sleep_goal_wakeTime_color}`}>
															{item.sleep_goal_wakeTime}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("hm")}
														</Div>
													</Grid>
													{/** record **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("record")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.sleep_record_wakeTime_color}`}>
															{item.sleep_record_wakeTime}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("hm")}
														</Div>
													</Grid>
													{/** diff **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("diff")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.sleep_record_diff_wakeTime_color}`}>
															{item.sleep_record_diff_wakeTime}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("hm")}
														</Div>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
										{/** /.row 2 **/}

										<Hr m={1} className={"bg-light"} />

										{/** row 3 **/}
										<Grid container={true} spacing={1}>
											<Grid size={2} className={"d-center"}>
												<Img
													max={14}
													hover={true}
													shadow={false}
													radius={false}
													src={"sleep4.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-0-8rem fw-600 dark ml-n15px"}>
													{translate("sleepTime")}
												</Div>
											</Grid>
											<Grid size={7}>
												<Grid container={true} spacing={1}>
													{/** goal **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("goal")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.sleep_goal_sleepTime_color}`}>
															{item.sleep_goal_sleepTime}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("hm")}
														</Div>
													</Grid>
													{/** record **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("record")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.sleep_record_sleepTime_color}`}>
															{item.sleep_record_sleepTime}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("hm")}
														</Div>
													</Grid>
													{/** diff **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("diff")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.sleep_record_diff_sleepTime_color}`}>
															{item.sleep_record_diff_sleepTime}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("hm")}
														</Div>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
										{/** /.row 3 **/}
									</Grid>
								</AccordionDetails>
							</Accordion>
						</Grid>
					</Grid>
				))}
			</Grid>
		);
		// 7-10. return
		return (
			<Paper className={"content-wrapper radius-2 border-1 shadow-1 h-min-75vh"}>
				{COUNT.exercise === 0 ? <Empty DATE={DATE} extra={"exercise"} /> : exerciseSection()}
				{COUNT.food === 0 ? <Empty DATE={DATE} extra={"food"} /> : foodSection()}
				{COUNT.money === 0 ? <Empty DATE={DATE} extra={"money"} /> : moneySection()}
				{COUNT.sleep === 0 ? <Empty DATE={DATE} extra={"sleep"} /> : sleepSection()}
			</Paper>
		);
	};

	// 8. dialog ----------------------------------------------------------------------------------
	const dialogNode = () => (
		<Dialog
			COUNT={COUNT}
			setCOUNT={setCOUNT}
			setIsExpanded={setIsExpanded}
		/>
	);

	// 9. footer ----------------------------------------------------------------------------------
	const footerNode = () => (
		<Footer
			state={{
				DATE, SEND,
			}}
			setState={{
				setDATE, setSEND,
			}}
		/>
	);

	// 10. return ----------------------------------------------------------------------------------
	return (
		<>
			{listNode()}
			{dialogNode()}
			{footerNode()}
		</>
	);
});
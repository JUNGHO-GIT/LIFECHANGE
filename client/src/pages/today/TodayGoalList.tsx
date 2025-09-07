// TodayGoalList.tsx

import { useState, useEffect } from "@importReacts";
import { useCommonValue, useCommonDate, useStorageLocal, useStorageSession } from "@importHooks";
import { useStoreLanguage, useStoreLoading, useStoreAlert } from "@importStores";
import { axios } from "@importLibs";
import { insertComma } from "@importScripts";
import { ExerciseGoal, FoodGoal, MoneyGoal, SleepGoal } from "@importSchemas";
import { Footer, Empty, Dialog } from "@importLayouts";
import { Div, Hr, Img, Icons, Paper, Grid } from "@importComponents";
import { Accordion, AccordionSummary, AccordionDetails } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const TodayGoalList = () => {

	// 1. common ----------------------------------------------------------------------------------
  const { URL_EXERCISE, URL_FOOD, URL_MONEY, URL_SLEEP } = useCommonValue();
  const { PATH, navigate, sessionId, localCurrency, localUnit } = useCommonValue();
  const { getDayFmt, getDayNotFmt } = useCommonDate();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();

	// --------------------------------------------------------------------------------------------
	// 2-1. useStorageSession
	// --------------------------------------------------------------------------------------------
  const [DATE, setDATE] = useStorageSession(
    "date", PATH, "", {
      dateType: "",
      dateStart: getDayFmt(),
      dateEnd: getDayFmt(),
    }
  );

	// --------------------------------------------------------------------------------------------
	// 2-2. useStorageLocal
	// --------------------------------------------------------------------------------------------
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
    from: "today",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toExerciseGoal: "/exercise/goal/detail",
    toExercise: "/exercise/detail",
    toFoodGoal: "/food/goal/detail",
    toFood: "/food/detail",
    toMoneyGoal: "/money/goal/detail",
    toMoney: "/money/detail",
    toSleepGoal: "/sleep/goal/detail",
    toSleep: "/sleep/detail",
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
      const [resExercise, resFood, resMoney, resSleep] = await Promise.all([
        axios.get(`${URL_EXERCISE}/goal/list`, { params }),
        axios.get(`${URL_FOOD}/goal/list`, { params }),
        axios.get(`${URL_MONEY}/goal/list`, { params }),
        axios.get(`${URL_SLEEP}/goal/list`, { params })
      ]);
      setOBJECT_EXERCISE(
        resExercise.data.result?.length > 0 ? resExercise.data.result : [ExerciseGoal]
      );
      setOBJECT_FOOD(
        resFood.data.result?.length > 0 ? resFood.data.result : [FoodGoal]
      );
      setOBJECT_MONEY(
        resMoney.data.result?.length > 0 ? resMoney.data.result : [MoneyGoal]
      );
      setOBJECT_SLEEP(
        resSleep.data.result?.length > 0 ? resSleep.data.result : [SleepGoal]
      );
      setCOUNT({
        exercise: resExercise.data.totalCnt,
        food: resFood.data.totalCnt,
        money: resMoney.data.totalCnt,
        sleep: resSleep.data.totalCnt,
        totalCnt: (
          resExercise.data.totalCnt +
          resFood.data.totalCnt +
          resMoney.data.totalCnt +
          resSleep.data.totalCnt
        ),
      });
			// 현재 isExpanded의 길이와 응답 길이가 다를 경우, 응답 길이에 맞춰 초기화
	  	setIsExpanded((prev) => {
				let updated = { ...prev };
				let changed = false;
				if (resExercise.data.result?.length !== prev.exercise.length) {
					updated.exercise = Array(resExercise.data.result?.length).fill({ expanded: true });
					changed = true;
				}
				if (resFood.data.result?.length !== prev.food.length) {
					updated.food = Array(resFood.data.result?.length).fill({ expanded: true });
					changed = true;
				}
				if (resMoney.data.result?.length !== prev.money.length) {
					updated.money = Array(resMoney.data.result?.length).fill({ expanded: true });
					changed = true;
				}
				if (resSleep.data.result?.length !== prev.sleep.length) {
					updated.sleep = Array(resSleep.data.result?.length).fill({ expanded: true });
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

	// --------------------------------------------------------------------------------------------
	// 7. list
	// ----------------------------------------------------------------------------------------------
  const listNode = () => {
    // 7-1. exercise
    const exerciseSection = () => (
			<Grid container={true} spacing={0}>
				{OBJECT_EXERCISE?.map((item, i) => (
				<Grid container={true} spacing={0} className={"border-1 radius-2 shadow-1 mb-10px"} key={`list-${i}`}>
						<Grid size={12} className={"p-2px"}>
							<Accordion
								className={"border-0 shadow-0 radius-0"}
								expanded={isExpanded?.exercise[i]?.expanded}
							>
								<AccordionSummary
									expandIcon={
										<Icons
											key={"ChevronDown"}
											name={"ChevronDown"}
											className={"w-18px h-18px"}
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
												from: "today",
												dateType: item.exercise_goal_dateType,
												dateStart: item.exercise_goal_dateStart,
												dateEnd: item.exercise_goal_dateEnd,
											}
										});
									}}
								>
									<Grid container={true} spacing={2}>
										<Grid size={2} className={"d-row-center"}>
											<Icons
												key={"Search"}
												name={"Search"}
												className={"w-18px h-18px"}
											/>
										</Grid>
										<Grid size={10} className={"d-row-left"}>
											<Div className={"fs-1-0rem fw-600 black"}>
												{item.exercise_goal_dateStart?.substring(5, 10)}
											</Div>
											<Div className={"fs-0-9rem fw-500 dark ml-5px"}>
												{translate(getDayNotFmt(item.exercise_goal_dateStart).format("ddd"))}
											</Div>
											<Div className={"fs-0-8rem fw-500 dark ml-5px mr-5px"}>
												-
											</Div>
											<Div className={"fs-1-0rem fw-600 black"}>
												{item.exercise_goal_dateEnd?.substring(5, 10)}
											</Div>
											<Div className={"fs-0-9rem fw-500 dark ml-5px"}>
												{translate(getDayNotFmt(item.exercise_goal_dateEnd).format("ddd"))}
											</Div>
										</Grid>
									</Grid>
								</AccordionSummary>
								<AccordionDetails>
									<Grid container={true} spacing={2}>
										{/** row 1 **/}
										<Grid container={true} spacing={2}>
											<Grid size={2} className={"d-row-center"}>
												<Img
													max={20}
													hover={true}
													shadow={false}
													radius={false}
													src={"exercise2.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-1-0rem fw-600 dark ml-n15px"}>
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
														<Div className={`fs-1-0rem fw-600 ${item.exercise_goal_count_color}`}>
															{insertComma(item.exercise_goal_count || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("c")}
														</Div>
													</Grid>
													{/** real **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("real")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-1-0rem fw-600 ${item.exercise_total_count_color}`}>
															{insertComma(item.exercise_total_count || "0")}
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
														<Div className={`fs-1-0rem fw-600 ${item.exercise_diff_count_color}`}>
															{insertComma(item.exercise_diff_count || "0")}
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
										<Grid container={true} spacing={2}>
											<Grid size={2} className={"d-row-center"}>
												<Img
													max={20}
													hover={true}
													shadow={false}
													radius={false}
													src={"exercise3_1.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-1-0rem fw-600 dark ml-n15px"}>
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
														<Div className={`fs-1-0rem fw-600 ${item.exercise_goal_volume_color}`}>
															{insertComma(item.exercise_goal_volume || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("vol")}
														</Div>
													</Grid>
													{/** real **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("real")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-1-0rem fw-600 ${item.exercise_total_volume_color}`}>
															{insertComma(item.exercise_total_volume || "0")}
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
														<Div className={`fs-1-0rem fw-600 ${item.exercise_diff_volume_color}`}>
															{insertComma(item.exercise_diff_volume || "0")}
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
										<Grid container={true} spacing={2}>
											<Grid size={2} className={"d-center"}>
												<Img
													max={20}
													hover={true}
													shadow={false}
													radius={false}
													src={"exercise4.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-1-0rem fw-600 dark ml-n15px"}>
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
														<Div className={`fs-1-0rem fw-600 ${item.exercise_goal_cardio_color}`}>
															{item.exercise_goal_cardio}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("min")}
														</Div>
													</Grid>
													{/** real **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("real")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-1-0rem fw-600 ${item.exercise_total_cardio_color}`}>
															{item.exercise_total_cardio}
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
														<Div className={`fs-1-0rem fw-600 ${item.exercise_diff_cardio_color}`}>
															{item.exercise_diff_cardio}
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
										<Grid container={true} spacing={2}>
											<Grid size={2} className={"d-center"}>
												<Img
													max={20}
													hover={true}
													shadow={false}
													radius={false}
													src={"exercise5.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-1-0rem fw-600 dark ml-n15px"}>
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
														<Div className={`fs-1-0rem fw-600 ${item.exercise_goal_scale_color}`}>
															{insertComma(item.exercise_goal_scale || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-right"}>
														<Div className={"fs-0-6rem"}>
															{localUnit}
														</Div>
													</Grid>
													{/** real **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("real")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-1-0rem fw-600 ${item.exercise_total_scale_color}`}>
															{insertComma(item.exercise_total_scale || "0")}
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
														<Div className={`fs-1-0rem fw-600 ${item.exercise_diff_scale_color}`}>
															{insertComma(item.exercise_diff_scale || "0")}
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
				<Grid container={true} spacing={0} className={"border-1 radius-2 shadow-1 mb-10px"} key={`list-${i}`}>
						<Grid size={12} className={"p-2px"}>
							<Accordion
								className={"border-0 shadow-0 radius-0"}
								expanded={isExpanded?.food[i]?.expanded}
							>
								<AccordionSummary
									expandIcon={
										<Icons
											key={"ChevronDown"}
											name={"ChevronDown"}
											className={"w-18px h-18px"}
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
												from: "today",
												dateType: item.food_goal_dateType,
												dateStart: item.food_goal_dateStart,
												dateEnd: item.food_goal_dateEnd,
											}
										});
									}}
								>
									<Grid container={true} spacing={2}>
										<Grid size={2} className={"d-row-center"}>
											<Icons
												key={"Search"}
												name={"Search"}
												className={"w-18px h-18px"}
											/>
										</Grid>
										<Grid size={10} className={"d-row-left"}>
											<Div className={"fs-1-0rem fw-600 black"}>
												{item.food_goal_dateStart?.substring(5, 10)}
											</Div>
											<Div className={"fs-0-9rem fw-500 dark ml-5px"}>
												{translate(getDayNotFmt(item.food_goal_dateStart).format("ddd"))}
											</Div>
											<Div className={"fs-0-8rem fw-500 dark ml-5px mr-5px"}>
												-
											</Div>
											<Div className={"fs-1-0rem fw-600 black"}>
												{item.food_goal_dateEnd?.substring(5, 10)}
											</Div>
											<Div className={"fs-0-9rem fw-500 dark ml-5px"}>
												{translate(getDayNotFmt(item.food_goal_dateEnd).format("ddd"))}
											</Div>
										</Grid>
									</Grid>
								</AccordionSummary>
								<AccordionDetails>
									<Grid container={true} spacing={2}>
										{/** row 1 **/}
										<Grid container={true} spacing={2}>
											<Grid size={2} className={"d-row-center"}>
												<Img
													max={20}
													hover={true}
													shadow={false}
													radius={false}
													src={"food2.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-1-0rem fw-600 dark ml-n15px"}>
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
														<Div className={`fs-1-0rem fw-600 ${item.food_goal_kcal_color}`}>
															{insertComma(item.food_goal_kcal || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("kc")}
														</Div>
													</Grid>
													{/** real **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("real")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-1-0rem fw-600 ${item.food_total_kcal_color}`}>
															{insertComma(item.food_total_kcal || "0")}
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
														<Div className={`fs-1-0rem fw-600 ${item.food_diff_kcal_color}`}>
															{insertComma(item.food_diff_kcal || "0")}
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
										<Grid container={true} spacing={2}>
											<Grid size={2} className={"d-row-center"}>
												<Img
													max={20}
													hover={true}
													shadow={false}
													radius={false}
													src={"food3.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-1-0rem fw-600 dark ml-n15px"}>
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
														<Div className={`fs-1-0rem fw-600 ${item.food_goal_carb_color}`}>
															{insertComma(item.food_goal_carb || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("g")}
														</Div>
													</Grid>
													{/** real **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("real")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-1-0rem fw-600 ${item.food_total_carb_color}`}>
															{insertComma(item.food_total_carb || "0")}
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
														<Div className={`fs-1-0rem fw-600 ${item.food_diff_carb_color}`}>
															{insertComma(item.food_diff_carb || "0")}
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
										<Grid container={true} spacing={2}>
											<Grid size={2} className={"d-center"}>
												<Img
													max={20}
													hover={true}
													shadow={false}
													radius={false}
													src={"food4.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-1-0rem fw-600 dark ml-n15px"}>
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
														<Div className={`fs-1-0rem fw-600 ${item.food_goal_protein_color}`}>
															{insertComma(item.food_goal_protein || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("g")}
														</Div>
													</Grid>
													{/** real **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("real")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-1-0rem fw-600 ${item.food_total_protein_color}`}>
															{insertComma(item.food_total_protein || "0")}
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
														<Div className={`fs-1-0rem fw-600 ${item.food_diff_protein_color}`}>
															{insertComma(item.food_diff_protein || "0")}
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
										<Grid container={true} spacing={2}>
											<Grid size={2} className={"d-center"}>
												<Img
													max={20}
													hover={true}
													shadow={false}
													radius={false}
													src={"food5.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-1-0rem fw-600 dark ml-n15px"}>
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
														<Div className={`fs-1-0rem fw-600 ${item.food_goal_fat_color}`}>
															{insertComma(item.food_goal_fat || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("g")}
														</Div>
													</Grid>
													{/** real **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("real")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-1-0rem fw-600 ${item.food_total_fat_color}`}>
															{insertComma(item.food_total_fat || "0")}
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
														<Div className={`fs-1-0rem fw-600 ${item.food_diff_fat_color}`}>
															{insertComma(item.food_diff_fat || "0")}
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
				<Grid container={true} spacing={0} className={"border-1 radius-2 shadow-1 mb-10px"} key={`list-${i}`}>
						<Grid size={12} className={"p-2px"}>
							<Accordion
								className={"border-0 shadow-0 radius-0"}
								expanded={isExpanded?.money[i]?.expanded}
							>
								<AccordionSummary
									expandIcon={
										<Icons
											key={"ChevronDown"}
											name={"ChevronDown"}
											className={"w-18px h-18px"}
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
												from: "today",
												dateType: item.money_goal_dateType,
												dateStart: item.money_goal_dateStart,
												dateEnd: item.money_goal_dateEnd,
											}
										});
									}}
								>
									<Grid container={true} spacing={2}>
										<Grid size={2} className={"d-row-center"}>
											<Icons
												key={"Search"}
												name={"Search"}
												className={"w-18px h-18px"}
											/>
										</Grid>
										<Grid size={10} className={"d-row-left"}>
											<Div className={"fs-1-0rem fw-600 black"}>
												{item.money_goal_dateStart?.substring(5, 10)}
											</Div>
											<Div className={"fs-0-9rem fw-500 dark ml-5px"}>
												{translate(getDayNotFmt(item.money_goal_dateStart).format("ddd"))}
											</Div>
											<Div className={"fs-0-8rem fw-500 dark ml-5px mr-5px"}>
												-
											</Div>
											<Div className={"fs-1-0rem fw-600 black"}>
												{item.money_goal_dateEnd?.substring(5, 10)}
											</Div>
											<Div className={"fs-0-9rem fw-500 dark ml-5px"}>
												{translate(getDayNotFmt(item.money_goal_dateEnd).format("ddd"))}
											</Div>
										</Grid>
									</Grid>
								</AccordionSummary>
								<AccordionDetails>
									<Grid container={true} spacing={2}>
										{/** row 1 **/}
										<Grid container={true} spacing={2}>
											<Grid size={2} className={"d-row-center"}>
												<Img
													max={20}
													hover={true}
													shadow={false}
													radius={false}
													src={"money2.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-1-0rem fw-600 dark ml-n15px"}>
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
														<Div className={`fs-1-0rem fw-600 ${item.money_goal_income_color}`}>
															{insertComma(item.money_goal_income || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate(localCurrency)}
														</Div>
													</Grid>
													{/** real **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("real")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-1-0rem fw-600 ${item.money_total_income_color}`}>
															{insertComma(item.money_total_income || "0")}
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
														<Div className={`fs-1-0rem fw-600 ${item.money_diff_income_color}`}>
															{insertComma(item.money_diff_income || "0")}
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
										<Grid container={true} spacing={2}>
											<Grid size={2} className={"d-row-center"}>
												<Img
													max={20}
													hover={true}
													shadow={false}
													radius={false}
													src={"money2.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-1-0rem fw-600 dark ml-n15px"}>
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
														<Div className={`fs-1-0rem fw-600 ${item.money_goal_expense_color}`}>
															{insertComma(item.money_goal_expense || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate(localCurrency)}
														</Div>
													</Grid>
													{/** real **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("real")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-1-0rem fw-600 ${item.money_total_expense_color}`}>
															{insertComma(item.money_total_expense || "0")}
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
														<Div className={`fs-1-0rem fw-600 ${item.money_diff_expense_color}`}>
															{insertComma(item.money_diff_expense || "0")}
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
				<Grid container={true} spacing={0} className={"border-1 radius-2 shadow-1 mb-10px"} key={`list-${i}`}>
						<Grid size={12} className={"p-2px"}>
							<Accordion
								className={"border-0 shadow-0 radius-0"}
								expanded={isExpanded?.sleep[i]?.expanded}
							>
								<AccordionSummary
									expandIcon={
										<Icons
											key={"ChevronDown"}
											name={"ChevronDown"}
											className={"w-18px h-18px"}
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
												from: "today",
												dateType: item.sleep_goal_dateType,
												dateStart: item.sleep_goal_dateStart,
												dateEnd: item.sleep_goal_dateEnd,
											}
										});
									}}
								>
									<Grid container={true} spacing={2}>
										<Grid size={2} className={"d-row-center"}>
											<Icons
												key={"Search"}
												name={"Search"}
												className={"w-18px h-18px"}
											/>
										</Grid>
										<Grid size={10} className={"d-row-left"}>
											<Div className={"fs-1-0rem fw-600 black"}>
												{item.sleep_goal_dateStart?.substring(5, 10)}
											</Div>
											<Div className={"fs-0-9rem fw-500 dark ml-5px"}>
												{translate(getDayNotFmt(item.sleep_goal_dateStart).format("ddd"))}
											</Div>
											<Div className={"fs-0-8rem fw-500 dark ml-5px mr-5px"}>
												-
											</Div>
											<Div className={"fs-1-0rem fw-600 black"}>
												{item.sleep_goal_dateEnd?.substring(5, 10)}
											</Div>
											<Div className={"fs-0-9rem fw-500 dark ml-5px"}>
												{translate(getDayNotFmt(item.sleep_goal_dateEnd).format("ddd"))}
											</Div>
										</Grid>
									</Grid>
								</AccordionSummary>
								<AccordionDetails>
									<Grid container={true} spacing={2}>
										{/** row 1 **/}
										<Grid container={true} spacing={2}>
											<Grid size={2} className={"d-row-center"}>
												<Img
													max={20}
													hover={true}
													shadow={false}
													radius={false}
													src={"sleep2.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-1-0rem fw-600 dark ml-n15px"}>
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
														<Div className={`fs-1-0rem fw-600 ${item.sleep_goal_bedTime_color}`}>
															{item.sleep_goal_bedTime}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("hm")}
														</Div>
													</Grid>
													{/** real **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("real")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-1-0rem fw-600 ${item.sleep_bedTime_color}`}>
															{item.sleep_bedTime}
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
														<Div className={`fs-1-0rem fw-600 ${item.sleep_diff_bedTime_color}`}>
															{item.sleep_diff_bedTime}
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
										<Grid container={true} spacing={2}>
											<Grid size={2} className={"d-center"}>
												<Img
													max={20}
													hover={true}
													shadow={false}
													radius={false}
													src={"sleep3.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-1-0rem fw-600 dark ml-n15px"}>
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
														<Div className={`fs-1-0rem fw-600 ${item.sleep_goal_wakeTime_color}`}>
															{item.sleep_goal_wakeTime}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("hm")}
														</Div>
													</Grid>
													{/** real **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("real")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-1-0rem fw-600 ${item.sleep_wakeTime_color}`}>
															{item.sleep_wakeTime}
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
														<Div className={`fs-1-0rem fw-600 ${item.sleep_diff_wakeTime_color}`}>
															{item.sleep_diff_wakeTime}
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
										<Grid container={true} spacing={2}>
											<Grid size={2} className={"d-center"}>
												<Img
													max={20}
													hover={true}
													shadow={false}
													radius={false}
													src={"sleep4.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-1-0rem fw-600 dark ml-n15px"}>
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
														<Div className={`fs-1-0rem fw-600 ${item.sleep_goal_sleepTime_color}`}>
															{item.sleep_goal_sleepTime}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("hm")}
														</Div>
													</Grid>
													{/** real **/}
													<Grid size={4} className={"d-row-center"}>
														<Div className={"fs-0-7rem fw-500 dark"}>
															{translate("real")}
														</Div>
													</Grid>
													<Grid size={6} className={"d-row-right"}>
														<Div className={`fs-1-0rem fw-600 ${item.sleep_sleepTime_color}`}>
															{item.sleep_sleepTime}
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
														<Div className={`fs-1-0rem fw-600 ${item.sleep_diff_sleepTime_color}`}>
															{item.sleep_diff_sleepTime}
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
      <Paper className={"content-wrapper border-1 radius-2 shadow-1 h-min-75vh"}>
				{COUNT.exercise === 0 ? <Empty DATE={DATE} extra={"exercise"} /> : exerciseSection()}
				{COUNT.food === 0 ? <Empty DATE={DATE} extra={"food"} /> : foodSection()}
        {COUNT.money === 0 ? <Empty DATE={DATE} extra={"money"} /> : moneySection()}
				{COUNT.sleep === 0 ? <Empty DATE={DATE} extra={"sleep"} /> : sleepSection()}
      </Paper>
    );
  };

	// --------------------------------------------------------------------------------------------
	// 8. dialog
	// --------------------------------------------------------------------------------------------
  const dialogNode = () => (
    <Dialog
      COUNT={COUNT}
      setCOUNT={setCOUNT}
      setIsExpanded={setIsExpanded}
    />
  );

	// --------------------------------------------------------------------------------------------
	// 9. footer
	// --------------------------------------------------------------------------------------------
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
};
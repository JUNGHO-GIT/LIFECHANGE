// TodayList.tsx

import { useState, useEffect } from "@importReacts";
import { useCommonValue, useCommonDate, useStorageLocal, useStorageSession } from "@importHooks";
import { useStoreLanguage, useStoreLoading, useStoreAlert } from "@importStores";
import { axios } from "@importLibs";
import { insertComma } from "@importScripts";
import { Exercise, Food, Money, Sleep } from "@importSchemas";
import { Footer, Empty, Dialog } from "@importLayouts";
import { Div, Hr, Img, Icons, Paper, Grid } from "@importComponents";
import { Accordion, AccordionSummary, AccordionDetails } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const TodayList = () => {

	// --------------------------------------------------------------------------------------------
	// 1. common
	// --------------------------------------------------------------------------------------------
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
      dateType: "day",
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

	// --------------------------------------------------------------------------------------------
	// 2-2. useState
	// --------------------------------------------------------------------------------------------
  const [SEND, setSEND] = useState({
    id: "",
    from: "today",
    dateType: "day",
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

	// --------------------------------------------------------------------------------------------
	// 2-2. useState
	// --------------------------------------------------------------------------------------------
  const [OBJECT_EXERCISE, setOBJECT_EXERCISE] = useState([Exercise]);
  const [OBJECT_FOOD, setOBJECT_FOOD] = useState([Food]);
  const [OBJECT_MONEY, setOBJECT_MONEY] = useState([Money]);
  const [OBJECT_SLEEP, setOBJECT_SLEEP] = useState([Sleep]);

	// --------------------------------------------------------------------------------------------
	// 2-3. useEffect
	// --------------------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    try {
    	setLOADING(true);
      const params = {
        user_id: sessionId,
        PAGING: PAGING,
        DATE: DATE,
      };
      const [resExercise, resFood, resMoney, resSleep] = await Promise.all([
        axios.get(`${URL_EXERCISE}/list`, { params }),
        axios.get(`${URL_FOOD}/list`, { params }),
        axios.get(`${URL_MONEY}/list`, { params }),
        axios.get(`${URL_SLEEP}/list`, { params })
      ]);
      setOBJECT_EXERCISE(
        resExercise.data.result?.length > 0 ? resExercise.data.result : [Exercise]
      );
      setOBJECT_FOOD(
        resFood.data.result?.length > 0 ? resFood.data.result : [Food]
      );
      setOBJECT_MONEY(
        resMoney.data.result?.length > 0 ? resMoney.data.result : [Money]
      );
      setOBJECT_SLEEP(
        resSleep.data.result?.length > 0 ? resSleep.data.result : [Sleep]
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
										navigate(SEND.toExercise, {
											state: {
												id: item._id,
												from: "today",
												dateType: item.exercise_dateType,
												dateStart: item.exercise_dateStart,
												dateEnd: item.exercise_dateEnd,
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
											<Div className={"fs-1-0rem fw-600 black mr-5px"}>
												{item.exercise_dateStart?.substring(5, 10)}
											</Div>
											<Div className={"fs-0-9rem fw-500 dark ml-5px"}>
												{translate(getDayNotFmt(item.exercise_dateStart).format("ddd"))}
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
													<Grid size={10} className={"d-row-right"}>
														<Div className={`fs-1-0rem fw-600 ${item.exercise_total_volume_color}`}>
															{insertComma(item.exercise_total_volume)}
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
													<Grid size={10} className={"d-row-right"}>
														<Div className={`fs-1-0rem fw-600 ${item.exercise_total_cardio_color}`}>
															{item.exercise_total_cardio}
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
													<Grid size={10} className={"d-row-right"}>
														<Div className={`fs-1-0rem fw-600 ${item.exercise_total_scale_color}`}>
															{insertComma(item.exercise_total_scale)}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{localUnit}
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
										navigate(SEND.toFood, {
											state: {
												id: item._id,
												from: "today",
												dateType: item.food_dateType,
												dateStart: item.food_dateStart,
												dateEnd: item.food_dateEnd,
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
											<Div className={"fs-1-0rem fw-600 black mr-5px"}>
												{item.food_dateStart?.substring(5, 10)}
											</Div>
											<Div className={"fs-0-9rem fw-500 dark ml-5px"}>
												{translate(getDayNotFmt(item.food_dateStart).format("ddd"))}
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
													<Grid size={10} className={"d-row-right"}>
														<Div className={`fs-1-0rem fw-600 ${item.food_total_kcal_color}`}>
															{insertComma(item.food_total_kcal || "0")}
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
											<Grid size={2} className={"d-center"}>
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
													<Grid size={10} className={"d-row-right"}>
														<Div className={`fs-1-0rem fw-600 ${item.food_total_carb_color}`}>
															{insertComma(item.food_total_carb || "0")}
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
													<Grid size={10} className={"d-row-right"}>
														<Div className={`fs-1-0rem fw-600 ${item.food_total_protein_color}`}>
															{insertComma(item.food_total_protein || "0")}
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
													<Grid size={10} className={"d-row-right"}>
														<Div className={`fs-1-0rem fw-600 ${item.food_total_fat_color}`}>
															{insertComma(item.food_total_fat || "0")}
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
										navigate(SEND.toMoney, {
											state: {
												id: item._id,
												from: "today",
												dateType: item.money_dateType,
												dateStart: item.money_dateStart,
												dateEnd: item.money_dateEnd,
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
											<Div className={"fs-1-0rem fw-600 black mr-5px"}>
												{item.money_dateStart?.substring(5, 10)}
											</Div>
											<Div className={"fs-0-9rem fw-500 dark ml-5px"}>
												{translate(getDayNotFmt(item.money_dateStart).format("ddd"))}
											</Div>
										</Grid>
									</Grid>
								</AccordionSummary>
								<AccordionDetails>
									<Grid container={true} spacing={2}>
										{/** row 1 **/}
										<Grid container={true} spacing={2}>
											<Grid size={2} className={"d-center"}>
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
													<Grid size={10} className={"d-row-right"}>
														<Div className={`fs-1-0rem fw-600 ${item.money_total_income_color}`}>
															{insertComma(item.money_total_income || "0")}
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
											<Grid size={2} className={"d-center"}>
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
													<Grid size={10} className={"d-row-right"}>
														<Div className={`fs-1-0rem fw-600 ${item.money_total_expense_color}`}>
															{insertComma(item.money_total_expense || "0")}
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
										navigate(SEND.toSleep, {
											state: {
												id: item._id,
												from: "today",
												dateType: item.sleep_dateType,
												dateStart: item.sleep_dateStart,
												dateEnd: item.sleep_dateEnd,
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
											<Div className={"fs-1-0rem fw-600 black mr-5px"}>
												{item.sleep_dateStart?.substring(5, 10)}
											</Div>
											<Div className={"fs-0-9rem fw-500 dark ml-5px"}>
												{translate(getDayNotFmt(item.sleep_dateStart).format("ddd"))}
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
													<Grid size={10} className={"d-row-right"}>
														<Div className={`fs-1-0rem fw-600 ${item.sleep_section[0]?.sleep_bedTime_color}`}>
															{item.sleep_section[0]?.sleep_bedTime}
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
													<Grid size={10} className={"d-row-right"}>
														<Div className={`fs-1-0rem fw-600 ${item.sleep_section[0]?.sleep_wakeTime_color}`}>
															{item.sleep_section[0]?.sleep_wakeTime}
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
													<Grid size={10} className={"d-row-right"}>
														<Div className={`fs-1-0rem fw-600 ${item.sleep_section[0]?.sleep_sleepTime_color}`}>
															{item.sleep_section[0]?.sleep_sleepTime}
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

	// --------------------------------------------------------------------------------------------
	// 10. return
	// --------------------------------------------------------------------------------------------
  return (
    <>
      {listNode()}
      {dialogNode()}
      {footerNode()}
    </>
  );
};
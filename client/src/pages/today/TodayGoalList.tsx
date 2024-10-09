// TodayGoalList.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useStorage } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { ExerciseGoal, FoodGoal, MoneyGoal, SleepGoal } from "@imports/ImportSchemas";
import { axios, numeral } from "@imports/ImportUtils";
import { Loading, Footer, Empty, Dialog } from "@imports/ImportLayouts";
import { Div, Hr, Br, Img, Icons } from "@imports/ImportComponents";
import { Paper, Card, Grid } from "@imports/ImportMuis";
import { Accordion, AccordionSummary, AccordionDetails } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const TodayGoalList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_EXERCISE, URL_FOOD, URL_MONEY, URL_SLEEP } = useCommonValue();
  const { PATH, TITLE, navigate, sessionId, localCurrency } = useCommonValue();
  const { getDayFmt, getDayNotFmt } = useCommonDate();
  const { translate } = useLanguageStore();

  // 2-2. useStorage -------------------------------------------------------------------------------
  // 리스트에서만 사용
  const [DATE, setDATE] = useStorage(
    `${TITLE}_date_(${PATH})`, {
      dateType: "",
      dateStart: getDayFmt(),
      dateEnd: getDayFmt(),
    }
  );
  const [PAGING, setPAGING] = useStorage(
    `${TITLE}_paging_(${PATH})`, {
      sort: "asc",
      page: 1,
    }
  );

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [SEND, setSEND] = useState<any>({
    id: "",
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
  const [isExpanded, setIsExpanded] = useState<any>({
    exercise: [],
    food: [],
    money: [],
    sleep: [],
  });
  const [COUNT, setCOUNT] = useState<any>({
    exercise: 0,
    food: 0,
    money: 0,
    sleep: 0,
    all: 0,
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const [OBJECT_EXERCISE, setOBJECT_EXERCISE] = useState<any>([ExerciseGoal]);
  const [OBJECT_FOOD, setOBJECT_FOOD] = useState<any>([FoodGoal]);
  const [OBJECT_MONEY, setOBJECT_MONEY] = useState<any>([MoneyGoal]);
  const [OBJECT_SLEEP, setOBJECT_SLEEP] = useState<any>([SleepGoal]);

  // 2-3. useEffect --------------------------------------------------------------------------------
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
        resExercise.data.result.length > 0 ? resExercise.data.result : [ExerciseGoal]
      );
      setOBJECT_FOOD(
        resFood.data.result.length > 0 ? resFood.data.result : [FoodGoal]
      );
      setOBJECT_MONEY(
        resMoney.data.result.length > 0 ? resMoney.data.result : [MoneyGoal]
      );
      setOBJECT_SLEEP(
        resSleep.data.result.length > 0 ? resSleep.data.result : [SleepGoal]
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
      setIsExpanded({
        exercise: resExercise.data.result.map((_item: any, index: number) => index),
        food: resFood.data.result.map((_item: any, index: number) => index),
        money: resMoney.data.result.map((_item: any, index: number) => index),
        sleep: resSleep.data.result.map((_item: any, index: number) => index),
      });
    }
    catch (err) {
      console.error(err);
    }
    finally {
      setLOADING(false);
    }
  })()}, [
    URL_EXERCISE, URL_FOOD, URL_MONEY, URL_SLEEP,
    sessionId, PAGING.sort, PAGING.page, DATE.dateEnd
  ]);

  // 7. list ---------------------------------------------------------------------------------------
  const listNode = () => {
    // 7-1. exercise
    const exerciseSection = () => {
      const listFragment = (i: number) => (
        OBJECT_EXERCISE?.map((item: any, index: number) => (
          <Card className={"border-1 radius-1"} key={`${index}-${i}`}>
            <Accordion className={"shadow-0"} expanded={isExpanded.exercise.includes(index)}>
              <AccordionSummary className={"me-n10"} expandIcon={
                <Icons
                  key={"ChevronDown"}
                  name={"ChevronDown"}
                  className={"w-18 h-18"}
                  onClick={() => {
                    setIsExpanded((prev: any) => ({
                      ...prev,
                      exercise: prev.exercise.includes(index)
                      ? prev.exercise.filter((el: number) => el !== index)
                      : [...prev.exercise, index]
                    }))
                  }}
                />
              }>
                <Grid container spacing={1} columns={12} onClick={(e: any) => {
                  e.stopPropagation();
                  navigate(SEND.toExerciseGoal, {
                    state: {
                      id: item._id,
                      dateType: item.exercise_goal_dateType,
                      dateStart: item.exercise_goal_dateStart,
                      dateEnd: item.exercise_goal_dateEnd,
                    }
                  });
                }}>
                  <Grid size={2} className={"d-row-center"}>
                    <Icons
                      key={"Search"}
                      name={"Search"}
                      className={"w-18 h-18"}
                    />
                  </Grid>
                  <Grid size={10} className={"d-row-left"}>
                    <Div className={"fs-1-1rem fw-600 black me-5"}>
                      {item.exercise_goal_dateStart?.substring(5, 10)}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                      {translate(getDayNotFmt(item.exercise_goal_dateStart).format("ddd"))}
                    </Div>
                    <Div className={"fs-1-0rem fw-500 dark ms-10 me-10"}>
                      ~
                    </Div>
                    <Div className={"fs-1-1rem fw-600 black me-5"}>
                      {item.exercise_goal_dateEnd?.substring(5, 10)}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                      {translate(getDayNotFmt(item.exercise_goal_dateEnd).format("ddd"))}
                    </Div>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={1} columns={12}>
                  {/** row 1 **/}
                  <Grid size={2} className={"d-row-center"}>
                    <Img
                    	key={"exercise2"}
                    	src={"exercise2"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-0-9rem fw-600 dark"}>
                      {translate("exerciseCount")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      {/** goal **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.exercise_goal_count_color}`}>
                          {numeral(item.exercise_goal_count).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("c")}
                        </Div>
                      </Grid>
                      <Br px={1} />
                      {/** real **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.exercise_total_count_color}`}>
                          {numeral(item.exercise_total_count).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("c")}
                        </Div>
                      </Grid>
                      <Br px={1} />
                      {/** diff **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.exercise_diff_count_color}`}>
                          {numeral(item.exercise_diff_count).format("+0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("c")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Hr px={10} />
                  {/** row 2 **/}
                  <Grid size={2} className={"d-row-center"}>
                    <Img
                    	key={"exercise3_1"}
                    	src={"exercise3_1"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-0-9rem fw-600 dark"}>
                      {translate("volume")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      {/** goal **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.exercise_goal_volume_color}`}>
                          {numeral(item.exercise_goal_volume).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("vol")}
                        </Div>
                      </Grid>
                      <Br px={1} />
                      {/** real **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.exercise_total_volume_color}`}>
                          {numeral(item.exercise_total_volume).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("vol")}
                        </Div>
                      </Grid>
                      <Br px={1} />
                      {/** diff **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.exercise_diff_volume_color}`}>
                          {numeral(item.exercise_diff_volume).format("+0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("vol")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Hr px={20} />
                {/** row 3 **/}
                <Grid container spacing={1} columns={12}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"exercise4"}
                    	src={"exercise4"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-0-9rem fw-600 dark"}>
                      {translate("cardio")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      {/** goal **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.exercise_goal_cardio_color}`}>
                          {item.exercise_goal_cardio}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("min")}
                        </Div>
                      </Grid>
                      <Br px={1} />
                      {/** real **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.exercise_total_cardio_color}`}>
                          {item.exercise_total_cardio}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("min")}
                        </Div>
                      </Grid>
                      <Br px={1} />
                      {/** diff **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.exercise_diff_cardio_color}`}>
                          {item.exercise_diff_cardio}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("min")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Hr px={20} />
                {/** row 4 **/}
                <Grid container spacing={1} columns={12}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"exercise5"}
                    	src={"exercise5"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-0-9rem fw-600 dark"}>
                      {translate("weight")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      {/** goal **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.exercise_goal_weight_color}`}>
                          {item.exercise_goal_weight}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("k")}
                        </Div>
                      </Grid>
                      <Br px={1} />
                      {/** real **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.exercise_total_weight_color}`}>
                          {item.exercise_total_weight}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("k")}
                        </Div>
                      </Grid>
                      <Br px={1} />
                      {/** diff **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.exercise_diff_weight_color}`}>
                          {item.exercise_diff_weight}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("k")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Card>
        ))
      );
      const emptyFragment = () => (
        <Empty
          SEND={SEND}
          extra={"exercise"}
        />
      );
      return (
        <Card className={"p-0"}>
          <Grid container spacing={1} columns={12}>
            <Grid size={12}>
              {COUNT.exercise === 0 ? emptyFragment() : listFragment(0)}
            </Grid>
          </Grid>
        </Card>
      );
    };
    // 7-2. food
    const foodSection = () => {
      const listFragment = (i: number) => (
        OBJECT_FOOD?.map((item: any, index: number) => (
          <Card className={"border-1 radius-1"} key={`${index}-${i}`}>
            <Accordion className={"shadow-0"} expanded={isExpanded.food.includes(index)}>
              <AccordionSummary className={"me-n10"} expandIcon={
                <Icons
                  key={"ChevronDown"}
                  name={"ChevronDown"}
                  className={"w-18 h-18"}
                  onClick={() => {
                    setIsExpanded((prev: any) => ({
                      ...prev,
                      food: prev.food.includes(index)
                      ? prev.food.filter((el: number) => el !== index)
                      : [...prev.food, index]
                    }))
                  }}
                />
              }>
                <Grid container spacing={1} columns={12} onClick={(e: any) => {
                  e.stopPropagation();
                  navigate(SEND.toFoodGoal, {
                    state: {
                      id: item._id,
                      dateType: item.food_goal_dateType,
                      dateStart: item.food_goal_dateStart,
                      dateEnd: item.food_goal_dateEnd,
                    }
                  });
                }}>
                  <Grid size={2} className={"d-row-center"}>
                    <Icons
                      key={"Search"}
                      name={"Search"}
                      className={"w-18 h-18"}
                    />
                  </Grid>
                  <Grid size={10} className={"d-row-left"}>
                    <Div className={"fs-1-1rem fw-600 black me-5"}>
                      {item.food_goal_dateStart?.substring(5, 10)}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                      {translate(getDayNotFmt(item.food_goal_dateStart).format("ddd"))}
                    </Div>
                    <Div className={"fs-1-0rem fw-500 dark ms-10 me-10"}>
                      ~
                    </Div>
                    <Div className={"fs-1-1rem fw-600 black me-5"}>
                      {item.food_goal_dateEnd?.substring(5, 10)}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                      {translate(getDayNotFmt(item.food_goal_dateEnd).format("ddd"))}
                    </Div>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={1} columns={12}>
                  {/** row 1 **/}
                  <Grid size={2} className={"d-row-center"}>
                    <Img
                    	key={"food2"}
                    	src={"food2"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-0-9rem fw-600 dark"}>
                      {translate("kcal")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      {/** goal **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.food_goal_kcal_color}`}>
                          {numeral(item.food_goal_kcal).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("kc")}
                        </Div>
                      </Grid>
                      <Br px={1} />
                      {/** real **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.food_total_kcal_color}`}>
                          {numeral(item.food_total_kcal).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("kc")}
                        </Div>
                      </Grid>
                      <Br px={1} />
                      {/** diff **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.food_diff_kcal_color}`}>
                          {numeral(item.food_diff_kcal).format("+0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("kc")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Hr px={10} />
                  {/** row 2 **/}
                  <Grid size={2} className={"d-row-center"}>
                    <Img
                    	key={"food3"}
                    	src={"food3"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-0-9rem fw-600 dark"}>
                      {translate("carb")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      {/** goal **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.food_goal_carb_color}`}>
                          {numeral(item.food_goal_carb).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                      <Br px={1} />
                      {/** real **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.food_total_carb_color}`}>
                          {numeral(item.food_total_carb).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                      <Br px={1} />
                      {/** diff **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.food_diff_carb_color}`}>
                          {numeral(item.food_diff_carb).format("+0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Hr px={10} />
                  {/** row 3 **/}
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"food4"}
                    	src={"food4"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-0-9rem fw-600 dark"}>
                      {translate("protein")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      {/** goal **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.food_goal_protein_color}`}>
                          {numeral(item.food_goal_protein).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                      <Br px={1} />
                      {/** real **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.food_total_protein_color}`}>
                          {numeral(item.food_total_protein).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                      <Br px={1} />
                      {/** diff **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.food_diff_protein_color}`}>
                          {numeral(item.food_diff_protein).format("+0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Hr px={10} />
                  {/** row 4 **/}
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"food5"}
                    	src={"food5"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-0-9rem fw-600 dark"}>
                      {translate("fat")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      {/** goal **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.food_goal_fat_color}`}>
                          {numeral(item.food_goal_fat).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                      <Br px={1} />
                      {/** real **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.food_total_fat_color}`}>
                          {numeral(item.food_total_fat).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                      <Br px={1} />
                      {/** diff **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.food_diff_fat_color}`}>
                          {numeral(item.food_diff_fat).format("+0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Card>
        ))
      );
      const emptyFragment = () => (
        <Empty
          SEND={SEND}
          extra={"food"}
        />
      );
      return (
        <Card className={"p-0"}>
          <Grid container spacing={1} columns={12}>
            <Grid size={12}>
              {COUNT.food === 0 ? emptyFragment() : listFragment(0)}
            </Grid>
          </Grid>
        </Card>
      );
    };
    // 7-3. money
    const moneySection = () => {
      const listFragment = (i: number) => (
        OBJECT_MONEY?.map((item: any, index: number) => (
          <Card className={"border-1 radius-1"} key={`${index}-${i}`}>
            <Accordion className={"shadow-0"} expanded={isExpanded.money.includes(index)}>
              <AccordionSummary className={"me-n10"} expandIcon={
                <Icons
                  key={"ChevronDown"}
                  name={"ChevronDown"}
                  className={"w-18 h-18"}
                  onClick={() => {
                    setIsExpanded((prev: any) => ({
                      ...prev,
                      money: prev.money.includes(index)
                      ? prev.money.filter((el: number) => el !== index)
                      : [...prev.money, index]
                    }))
                  }}
                />
              }>
                <Grid container spacing={1} columns={12} onClick={(e: any) => {
                  e.stopPropagation();
                  navigate(SEND.toMoneyGoal, {
                    state: {
                      id: item._id,
                      dateType: item.money_goal_dateType,
                      dateStart: item.money_goal_dateStart,
                      dateEnd: item.money_goal_dateEnd,
                    }
                  });
                }}>
                  <Grid size={2} className={"d-row-center"}>
                    <Icons
                      key={"Search"}
                      name={"Search"}
                      className={"w-18 h-18"}
                    />
                  </Grid>
                  <Grid size={10} className={"d-row-left"}>
                    <Div className={"fs-1-1rem fw-600 black me-5"}>
                      {item.money_goal_dateStart?.substring(5, 10)}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                      {translate(getDayNotFmt(item.money_goal_dateStart).format("ddd"))}
                    </Div>
                    <Div className={"fs-1-0rem fw-500 dark ms-10 me-10"}>
                      ~
                    </Div>
                    <Div className={"fs-1-1rem fw-600 black me-5"}>
                      {item.money_goal_dateEnd?.substring(5, 10)}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                      {translate(getDayNotFmt(item.money_goal_dateEnd).format("ddd"))}
                    </Div>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={1} columns={12}>
                  {/** row 1 **/}
                  <Grid size={2} className={"d-row-center"}>
                    <Img
                    	key={"money2"}
                    	src={"money2"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-0-9rem fw-600 dark"}>
                      {translate("income")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      {/** goal **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.money_goal_income_color}`}>
                          {numeral(item.money_goal_income).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate(localCurrency)}
                        </Div>
                      </Grid>
                      <Br px={1} />
                      {/** real **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.money_total_income_color}`}>
                          {numeral(item.money_total_income).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate(localCurrency)}
                        </Div>
                      </Grid>
                      <Br px={1} />
                      {/** diff **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.money_diff_income_color}`}>
                          {numeral(item.money_diff_income).format("+0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate(localCurrency)}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Hr px={10} />
                  {/** row 2 **/}
                  <Grid size={2} className={"d-row-center"}>
                    <Img
                      key={"money2"}
                      src={"money2"}
                      className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-0-9rem fw-600 dark"}>
                      {translate("expense")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      {/** goal **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.money_goal_expense_color}`}>
                          {numeral(item.money_goal_expense).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate(localCurrency)}
                        </Div>
                      </Grid>
                      <Br px={1} />
                      {/** real **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.money_total_expense_color}`}>
                          {numeral(item.money_total_expense).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate(localCurrency)}
                        </Div>
                      </Grid>
                      <Br px={1} />
                      {/** diff **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.money_diff_expense_color}`}>
                          {numeral(item.money_diff_expense).format("+0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate(localCurrency)}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Card>
        ))
      );
      const emptyFragment = () => (
        <Empty
          SEND={SEND}
          extra={"money"}
        />
      );
      return (
        <Card className={"p-0"}>
          <Grid container spacing={1} columns={12}>
            <Grid size={12}>
              {COUNT.money === 0 ? emptyFragment() : listFragment(0)}
            </Grid>
          </Grid>
        </Card>
      );
    };
    // 7-4. sleep
    const sleepSection = () => {
      const listFragment = (i: number) => (
        OBJECT_SLEEP?.map((item: any, index: number) => (
          <Card className={"border-1 radius-1"} key={`${index}-${i}`}>
            <Accordion className={"shadow-0"} expanded={isExpanded.sleep.includes(index)}>
              <AccordionSummary className={"me-n10"} expandIcon={
                <Icons
                  key={"ChevronDown"}
                  name={"ChevronDown"}
                  className={"w-18 h-18"}
                  onClick={() => {
                    setIsExpanded((prev: any) => ({
                      ...prev,
                      sleep: prev.sleep.includes(index)
                      ? prev.sleep.filter((el: number) => el !== index)
                      : [...prev.sleep, index]
                    }))
                  }}
                />
              }>
                <Grid container spacing={1} columns={12} onClick={(e: any) => {
                  e.stopPropagation();
                  navigate(SEND.toSleepGoal, {
                    state: {
                      id: item._id,
                      dateType: item.sleep_goal_dateType,
                      dateStart: item.sleep_goal_dateStart,
                      dateEnd: item.sleep_goal_dateEnd,
                    }
                  });
                }}>
                  <Grid size={2} className={"d-row-center"}>
                    <Icons
                      key={"Search"}
                      name={"Search"}
                      className={"w-18 h-18"}
                    />
                  </Grid>
                  <Grid size={10} className={"d-row-left"}>
                    <Div className={"fs-1-1rem fw-600 black me-5"}>
                      {item.sleep_goal_dateStart?.substring(5, 10)}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                      {translate(getDayNotFmt(item.sleep_goal_dateStart).format("ddd"))}
                    </Div>
                    <Div className={"fs-1-0rem fw-500 dark ms-10 me-10"}>
                      ~
                    </Div>
                    <Div className={"fs-1-1rem fw-600 black me-5"}>
                      {item.sleep_goal_dateEnd?.substring(5, 10)}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                      {translate(getDayNotFmt(item.sleep_goal_dateEnd).format("ddd"))}
                    </Div>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={1} columns={12}>
                  {/** row 1 **/}
                  <Grid size={2} className={"d-row-center"}>
                    <Img
                    	key={"sleep2"}
                    	src={"sleep2"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-0-9rem fw-600 dark"}>
                      {translate("bedTime")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      {/** goal **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.sleep_goal_bedTime_color}`}>
                          {item.sleep_goal_bedTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                      <Br px={1} />
                      {/** real **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.sleep_bedTime_color}`}>
                          {item.sleep_bedTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                      <Br px={1} />
                      {/** diff **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.sleep_diff_bedTime_color}`}>
                          {item.sleep_diff_bedTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Hr px={10} />
                  {/** row 2 **/}
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"sleep3"}
                    	src={"sleep3"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-0-9rem fw-600 dark"}>
                      {translate("wakeTime")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      {/** goal **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.sleep_goal_wakeTime_color}`}>
                          {item.sleep_goal_wakeTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                      <Br px={1} />
                      {/** real **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.sleep_wakeTime_color}`}>
                          {item.sleep_wakeTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                      <Br px={1} />
                      {/** diff **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.sleep_diff_wakeTime_color}`}>
                          {item.sleep_diff_wakeTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Hr px={10} />
                  {/** row 3 **/}
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"sleep4"}
                    	src={"sleep4"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-0-9rem fw-600 dark"}>
                      {translate("sleepTime")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      {/** goal **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.sleep_goal_sleepTime_color}`}>
                          {item.sleep_goal_sleepTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                      <Br px={1} />
                      {/** real **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.sleep_sleepTime_color}`}>
                          {item.sleep_sleepTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                      <Br px={1} />
                      {/** diff **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.sleep_diff_sleepTime_color}`}>
                          {item.sleep_diff_sleepTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Card>
        ))
      );
      const emptyFragment = () => (
        <Empty
          SEND={SEND}
          extra={"sleep"}
        />
      );
      return (
        <Card className={"p-0"}>
          <Grid container spacing={1} columns={12}>
            <Grid size={12}>
              {COUNT.sleep === 0 ? emptyFragment() : listFragment(0)}
            </Grid>
          </Grid>
        </Card>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min75vh"}>
        <Grid container spacing={1} columns={12}>
          <Grid size={12}>
            {LOADING ? <Loading /> : (
              <>
                {exerciseSection()}
                <Br px={10} />
                {foodSection()}
                <Br px={10} />
                {moneySection()}
                <Br px={10} />
                {sleepSection()}
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 8. dialog -------------------------------------------------------------------------------------
  const dialogNode = () => (
    <Dialog
      COUNT={COUNT}
      setCOUNT={setCOUNT}
      setIsExpanded={setIsExpanded}
    />
  );

  // 9. footer -------------------------------------------------------------------------------------
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

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {listNode()}
      {dialogNode()}
      {footerNode()}
    </>
  );
};
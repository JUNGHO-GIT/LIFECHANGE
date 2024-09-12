// TodayGoalList.tsx
// Node -> Section -> Fragment

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useTranslate, useStorage } from "@imports/ImportHooks";
import { ExerciseGoal, FoodGoal, MoneyGoal, SleepGoal } from "@imports/ImportSchemas";
import { axios, numeral } from "@imports/ImportLibs";
import { Loading, Footer } from "@imports/ImportLayouts";
import { Div, Hr, Img, Icons } from "@imports/ImportComponents";
import { Empty } from "@imports/ImportContainers";
import { Paper, Card, Grid } from "@imports/ImportMuis";
import { Accordion, AccordionSummary, AccordionDetails } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const TodayGoalList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate,
  } = useTranslate();
  const {
    dayFmt, getDayNotFmt,
  } = useCommonDate();
  const {
    navigate, location_dateType, location_dateStart, location_dateEnd, PATH, URL_EXERCISE, URL_FOOD, URL_MONEY, URL_SLEEP, sessionId, TITLE, sessionCurrency,
  } = useCommonValue();

  // 2-2. useStorage -------------------------------------------------------------------------------
  // 리스트에서만 사용
  const [DATE, setDATE] = useStorage(
    `${TITLE}_date_(${PATH})`, {
      dateType: location_dateType || "day",
      dateStart: location_dateStart || dayFmt,
      dateEnd: location_dateEnd || dayFmt,
    }
  );
  const [PAGING, setPAGING] = useStorage(
    `${TITLE}_paging_(${PATH})`, {
      sort: "asc",
      page: 1,
    }
  );

  // 2-2. useState ---------------------------------------------------------------------------------
  const [isExpandedExercise, setIsExpandedExercise] = useState<number[]>([0]);
  const [isExpandedFood, setIsExpandedFood] = useState<number[]>([0]);
  const [isExpandedMoney, setIsExpandedMoney] = useState<number[]>([0]);
  const [isExpandedSleep, setIsExpandedSleep] = useState<number[]>([0]);
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [SEND, setSEND] = useState<any>({
    id: "",
    dateType: "day",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toExerciseGoal: "/exercise/goal/save",
    toExercise: "/exercise/save",
    toFoodGoal: "/food/goal/save",
    toFood: "/food/save",
    toMoneyGoal: "/money/goal/save",
    toMoney: "/money/save",
    toSleepGoal: "/sleep/goal/save",
    toSleep: "/sleep/save",
  });
  const [COUNT_EXERCISE, setCOUNT_EXERCISE] = useState<any>({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });
  const [COUNT_FOOD, setCOUNT_FOOD] = useState<any>({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });
  const [COUNT_MONEY, setCOUNT_MONEY] = useState<any>({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });
  const [COUNT_SLEEP, setCOUNT_SLEEP] = useState<any>({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const [OBJECT_EXERCISE, setOBJECT_EXERCISE] = useState<any>([ExerciseGoal]);
  const [OBJECT_FOOD, setOBJECT_FOOD] = useState<any>([FoodGoal]);
  const [OBJECT_MONEY, setOBJECT_MONEY] = useState<any>([MoneyGoal]);
  const [OBJECT_SLEEP, setOBJECT_SLEEP] = useState<any>([SleepGoal]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    const fetchData = async (
      url: string,
      setObject: any,
      setCount: any,
      objectDef: any,
      setIsExpanded: any
    ) => {
      try {
        const res = await axios.get(url, {
          params: {
            user_id: sessionId,
            PAGING: PAGING,
            DATE: DATE,
          },
        });
        setObject(res.data.result.length > 0 ? res.data.result : [objectDef]);
        setCount((prev: any) => ({
          ...prev,
          totalCnt: res.data.totalCnt || 0,
          sectionCnt: res.data.sectionCnt || 0,
          newSectionCnt: res.data.sectionCnt || 0,
        }));
        // Accordion 초기값 설정
        //setIsExpanded([]);
        setIsExpanded(res.data.result.map((_item: any, index: number) => (index)));
      }
      catch (err: any) {
        console.error(err);
      }
    };
    const fetchAllData = async () => {
      await Promise.all([
        fetchData(
          `${URL_EXERCISE}/goal/list`,
          setOBJECT_EXERCISE,
          setCOUNT_EXERCISE,
          ExerciseGoal,
          setIsExpandedExercise
        ),
        fetchData(
          `${URL_FOOD}/goal/list`,
          setOBJECT_FOOD,
          setCOUNT_FOOD,
          FoodGoal,
          setIsExpandedFood
        ),
        fetchData(
          `${URL_MONEY}/goal/list`,
          setOBJECT_MONEY,
          setCOUNT_MONEY,
          MoneyGoal,
          setIsExpandedMoney
        ),
        fetchData(
          `${URL_SLEEP}/goal/list`,
          setOBJECT_SLEEP,
          setCOUNT_SLEEP,
          SleepGoal,
          setIsExpandedSleep
        ),
      ]);
      setLOADING(false);
    };
    fetchAllData();
  }, [sessionId, PAGING.sort, PAGING.page, DATE.dateEnd]);

  // 7. list ---------------------------------------------------------------------------------------
  const listNode = () => {
    // 7-1. exercise
    const exerciseSection = () => {
      const emptyFragment = () => (
        <Empty
          DATE={DATE}
          SEND={SEND}
          navigate={navigate}
          type={"goal"}
          extra={"exercise"}
        />
      );
      const cardFragment = (i: number) => (
        OBJECT_EXERCISE?.map((item: any, index: number) => (
          <Card className={"border radius"} key={`${index}-${i}`}>
            <Accordion className={"shadow-none"} expanded={isExpandedExercise.includes(index)}>
              <AccordionSummary expandIcon={
                <Icons
                  name={"ChevronDown"}
                  className={"w-18 h-18 black"}
                  onClick={(e: any) => {
                    setIsExpandedMoney(isExpandedMoney.includes(index)
                    ? isExpandedMoney.filter((el) => el !== index)
                    : [...isExpandedMoney, index]
                  )}}
                />
              }>
                <Grid container spacing={2}
                  onClick={(e: any) => {
                    e.stopPropagation();
                    Object.assign(SEND, {
                      id: item._id,
                      dateType: item.exercise_goal_dateType,
                      dateStart: item.exercise_goal_dateStart,
                      dateEnd: item.exercise_goal_dateEnd,
                    });
                    navigate(SEND.toExerciseGoal, {
                      state: SEND
                    });
                  }}
                >
                  <Grid size={2} className={"d-center"}>
                    <Icons
                      key={"Search"}
                      name={"Search"}
                      className={"w-18 h-18 black"}
                    />
                  </Grid>
                  <Grid size={10} className={"d-left"}>
                    {item.exercise_goal_dateStart === item.exercise_goal_dateEnd ? (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.exercise_goal_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(getDayNotFmt(item.exercise_goal_dateStart).format("ddd"))}
                        </Div>
                      </>
                    ) : (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.exercise_goal_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(getDayNotFmt(item.exercise_goal_dateStart).format("ddd"))}
                        </Div>
                        <Div className={"fs-1-0rem ms-3vw me-3vw"}>
                          ~
                        </Div>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.exercise_goal_dateEnd?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(getDayNotFmt(item.exercise_goal_dateEnd).format("ddd"))}
                        </Div>
                      </>
                    )}
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                {/** row 1 **/}
                <Grid container spacing={1}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"exercise2"}
                    	src={"exercise2"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("exerciseCount")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container columns={12} spacing={1}>
                      {/** goal **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.exercise_goal_count_color}`}>
                          {numeral(item.exercise_goal_count).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("c")}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.exercise_total_count_color}`}>
                          {numeral(item.exercise_total_count).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("c")}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.exercise_diff_count_color}`}>
                          {numeral(item.exercise_diff_count).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("c")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Hr px={20} />
                {/** row 2 **/}
                <Grid container spacing={1}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"exercise3_1"}
                    	src={"exercise3_1"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("volume")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container columns={12} spacing={1}>
                      {/** goal **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.exercise_goal_volume_color}`}>
                          {numeral(item.exercise_goal_volume).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("vol")}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.exercise_total_volume_color}`}>
                          {numeral(item.exercise_total_volume).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("vol")}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.exercise_diff_volume_color}`}>
                          {numeral(item.exercise_diff_volume).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("vol")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Hr px={20} />
                {/** row 3 **/}
                <Grid container spacing={1}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"exercise5"}
                    	src={"exercise5"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("cardio")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container columns={12} spacing={1}>
                      {/** goal **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.exercise_goal_cardio_color}`}>
                          {item.exercise_goal_cardio}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("min")}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.exercise_total_cardio_color}`}>
                          {item.exercise_total_cardio}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("min")}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.exercise_diff_cardio_color}`}>
                          {item.exercise_diff_cardio}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("min")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Hr px={20} />
                {/** row 4 **/}
                <Grid container spacing={1}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"exercise4"}
                    	src={"exercise4"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("weight")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container columns={12} spacing={1}>
                      {/** goal **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.exercise_goal_weight_color}`}>
                          {item.exercise_goal_weight}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("k")}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.exercise_total_weight_color}`}>
                          {item.exercise_total_weight}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("k")}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.exercise_diff_weight_color}`}>
                          {item.exercise_diff_weight}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
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
      return (
        LOADING ? <Loading /> : (
          COUNT_EXERCISE.totalCnt === 0 ? emptyFragment() : cardFragment(0)
        )
      );
    };
    // 7-2. food
    const foodSection = () => {
      const emptyFragment = () => (
        <Empty
          DATE={DATE}
          SEND={SEND}
          navigate={navigate}
          type={"goal"}
          extra={"food"}
        />
      );
      const cardFragment = (i: number) => (
        OBJECT_FOOD?.map((item: any, index: number) => (
          <Card className={"border radius"} key={`${index}-${i}`}>
            <Accordion className={"shadow-none"} expanded={isExpandedFood.includes(index)}>
              <AccordionSummary expandIcon={
                  <Icons
                    name={"ChevronDown"}
                    className={"w-18 h-18 black"}
                    onClick={(e: any) => {
                      setIsExpandedFood(isExpandedFood.includes(index)
                      ? isExpandedFood.filter((el) => el !== index)
                      : [...isExpandedFood, index]
                    )}}
                  />
                }
              >
                <Grid container spacing={2}
                  onClick={(e: any) => {
                    e.stopPropagation();
                    Object.assign(SEND, {
                      id: item._id,
                      dateType: item.food_goal_dateType,
                      dateStart: item.food_goal_dateStart,
                      dateEnd: item.food_goal_dateEnd,
                    });
                    navigate(SEND.toFoodGoal, {
                      state: SEND
                    });
                  }}
                >
                  <Grid size={2} className={"d-center"}>
                    <Icons
                      key={"Search"}
                      name={"Search"}
                      className={"w-18 h-18 black"}
                    />
                  </Grid>
                  <Grid size={10} className={"d-left"}>
                    {item.food_goal_dateStart === item.food_goal_dateEnd ? (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.food_goal_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(getDayNotFmt(item.food_goal_dateStart).format("ddd"))}
                        </Div>
                      </>
                    ) : (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.food_goal_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(getDayNotFmt(item.food_goal_dateStart).format("ddd"))}
                        </Div>
                        <Div className={"fs-1-0rem ms-3vw me-3vw"}>
                          ~
                        </Div>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.food_goal_dateEnd?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(getDayNotFmt(item.food_goal_dateEnd).format("ddd"))}
                        </Div>
                      </>
                    )}
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                {/** row 1 **/}
                <Grid container spacing={1}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"food2"}
                    	src={"food2"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("kcal")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container columns={12} spacing={1}>
                      {/** goal **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.food_goal_kcal_color}`}>
                          {numeral(item.food_goal_kcal).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("kc")}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.food_total_kcal_color}`}>
                          {numeral(item.food_total_kcal).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("kc")}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.food_diff_kcal_color}`}>
                          {numeral(item.food_diff_kcal).format("+0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("kc")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Hr px={20} />
                {/** row 2 **/}
                <Grid container spacing={1}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"food3"}
                    	src={"food3"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("carb")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container columns={12} spacing={1}>
                      {/** goal **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.food_goal_carb_color}`}>
                          {numeral(item.food_goal_carb).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.food_total_carb_color}`}>
                          {numeral(item.food_total_carb).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.food_diff_carb_color}`}>
                          {numeral(item.food_diff_carb).format("+0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Hr px={20} />
                {/** row 3 **/}
                <Grid container spacing={1}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"food4"}
                    	src={"food4"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("protein")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container columns={12} spacing={1}>
                      {/** goal **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.food_goal_protein_color}`}>
                          {item.food_goal_protein}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.food_total_protein_color}`}>
                          {numeral(item.food_total_protein).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.food_diff_protein_color}`}>
                          {numeral(item.food_diff_protein).format("+0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Hr px={20} />
                {/** row 4 **/}
                <Grid container spacing={1}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"food5"}
                    	src={"food5"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("fat")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container columns={12} spacing={1}>
                      {/** goal **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.food_goal_fat_color}`}>
                          {item.food_goal_weight}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.food_total_fat_color}`}>
                          {numeral(item.food_total_fat).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.food_diff_fat_color}`}>
                          {numeral(item.food_diff_fat).format("+0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
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
      return (
        LOADING ? <Loading /> : (
          COUNT_FOOD.totalCnt === 0 ? emptyFragment() : cardFragment(0)
        )
      );
    };
    // 7-3. money
    const moneySection = () => {
      const emptyFragment = () => (
        <Empty
          DATE={DATE}
          SEND={SEND}
          navigate={navigate}
          type={"goal"}
          extra={"money"}
        />
      );
      const cardFragment = (i: number) => (
        OBJECT_MONEY?.map((item: any, index: number) => (
          <Card className={"border radius"} key={`${index}-${i}`}>
            <Accordion className={"shadow-none"} expanded={isExpandedMoney.includes(index)}>
              <AccordionSummary expandIcon={
                <Icons
                  name={"ChevronDown"}
                  className={"w-18 h-18 black"}
                  onClick={(e: any) => {
                    setIsExpandedMoney(isExpandedMoney.includes(index)
                    ? isExpandedMoney.filter((el) => el !== index)
                    : [...isExpandedMoney, index]
                  )}}
                />
              }>
                <Grid container spacing={2}
                  onClick={(e: any) => {
                    e.stopPropagation();
                    Object.assign(SEND, {
                      id: item._id,
                      dateType: item.money_goal_dateType,
                      dateStart: item.money_goal_dateStart,
                      dateEnd: item.money_goal_dateEnd,
                    });
                    navigate(SEND.toMoneyGoal, {
                      state: SEND
                    });
                  }}
                >
                  <Grid size={2} className={"d-center"}>
                    <Icons
                      key={"Search"}
                      name={"Search"}
                      className={"w-18 h-18 black"}
                    />
                  </Grid>
                  <Grid size={10} className={"d-left"}>
                    {item.money_goal_dateStart === item.money_goal_dateEnd ? (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.money_goal_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(getDayNotFmt(item.money_goal_dateStart).format("ddd"))}
                        </Div>
                      </>
                    ) : (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.money_goal_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(getDayNotFmt(item.money_goal_dateStart).format("ddd"))}
                        </Div>
                        <Div className={"fs-1-0rem ms-3vw me-3vw"}>
                          ~
                        </Div>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.money_goal_dateEnd?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(getDayNotFmt(item.money_goal_dateEnd).format("ddd"))}
                        </Div>
                      </>
                    )}
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                {/** row 1 **/}
                <Grid container spacing={1}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"money2"}
                    	src={"money2"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("income")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container columns={12} spacing={1}>
                      {/** goal **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.money_goal_income_color}`}>
                          {numeral(item.money_diff_income).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {sessionCurrency}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.money_total_income_color}`}>
                          {numeral(item.money_total_income).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {sessionCurrency}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.money_diff_income_color}`}>
                          {numeral(item.money_diff_income).format("+0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {sessionCurrency}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Hr px={20} />
                {/** row 2 **/}
                <Grid container spacing={1}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"money2"}
                    	src={"money2"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("expense")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container columns={12} spacing={1}>
                      {/** goal **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.money_goal_expense_color}`}>
                          {numeral(item.money_diff_expense).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {sessionCurrency}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.money_total_expense_color}`}>
                          {numeral(item.money_total_expense).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {sessionCurrency}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.money_diff_expense_color}`}>
                          {numeral(item.money_diff_expense).format("+0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {sessionCurrency}
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
      return (
        LOADING ? <Loading /> : (
          COUNT_MONEY.totalCnt === 0 ? emptyFragment() : cardFragment(0)
        )
      );
    };
    // 7-4. sleep
    const sleepSection = () => {
      const emptyFragment = () => (
        <Empty
          DATE={DATE}
          SEND={SEND}
          navigate={navigate}
          type={"goal"}
          extra={"sleep"}
        />
      );
      const cardFragment = (i: number) => (
        OBJECT_SLEEP?.map((item: any, index: number) => (
          <Card className={"border radius"} key={`${index}-${i}`}>
            <Accordion className={"shadow-none"} expanded={isExpandedSleep.includes(index)}>
              <AccordionSummary expandIcon={
                  <Icons
                    name={"ChevronDown"}
                    className={"w-18 h-18 black"}
                    onClick={(e: any) => {
                      setIsExpandedSleep(isExpandedSleep.includes(index)
                      ? isExpandedSleep.filter((el) => el !== index)
                      : [...isExpandedSleep, index]
                    )}}
                  />
                }
              >
                <Grid container spacing={2}
                  onClick={(e: any) => {
                    e.stopPropagation();
                    Object.assign(SEND, {
                      id: item._id,
                      dateType: item.sleep_goal_dateType,
                      dateStart: item.sleep_goal_dateStart,
                      dateEnd: item.sleep_goal_dateEnd,
                    });
                    navigate(SEND.toSleepGoal, {
                      state: SEND
                    });
                  }}
                >
                  <Grid size={2} className={"d-center"}>
                    <Icons
                      key={"Search"}
                      name={"Search"}
                      className={"w-18 h-18 black"}
                    />
                  </Grid>
                  <Grid size={10} className={"d-left"}>
                    {item.sleep_goal_dateStart === item.sleep_goal_dateEnd ? (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.sleep_goal_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(getDayNotFmt(item.sleep_goal_dateStart).format("ddd"))}
                        </Div>
                      </>
                    ) : (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.sleep_goal_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(getDayNotFmt(item.sleep_goal_dateStart).format("ddd"))}
                        </Div>
                        <Div className={"fs-1-0rem ms-3vw me-3vw"}>
                          ~
                        </Div>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.sleep_goal_dateEnd?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(getDayNotFmt(item.sleep_goal_dateEnd).format("ddd"))}
                        </Div>
                      </>
                    )}
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                {/** row 1 **/}
                <Grid container spacing={1}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"sleep2"}
                    	src={"sleep2"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("bedTime")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container columns={12} spacing={1}>
                      {/** goal **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.sleep_goal_bedTime_color}`}>
                          {item.sleep_goal_bedTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.sleep_bedTime_color}`}>
                          {item.sleep_bedTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.sleep_diff_bedTime_color}`}>
                          {item.sleep_diff_bedTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Hr px={20} />
                {/** row 2 **/}
                <Grid container spacing={1}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"sleep3"}
                    	src={"sleep3"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("wakeTime")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container columns={12} spacing={1}>
                      {/** goal **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.sleep_goal_wakeTime_color}`}>
                          {item.sleep_goal_wakeTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.sleep_wakeTime_color}`}>
                          {item.sleep_wakeTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.sleep_diff_wakeTime_color}`}>
                          {item.sleep_diff_wakeTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Hr px={20} />
                {/** row 3 **/}
                <Grid container spacing={1}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"sleep4"}
                    	src={"sleep4"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("sleepTime")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container columns={12} spacing={1}>
                      {/** goal **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.sleep_goal_sleepTime_color}`}>
                          {item.sleep_goal_sleepTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.sleep_sleepTime_color}`}>
                          {item.sleep_sleepTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={5} className={"d-right"}>
                        <Div className={"fs-0-8rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={5} className={"d-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.sleep_diff_sleepTime_color}`}>
                          {item.sleep_diff_sleepTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-right"}>
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
      return (
        LOADING ? <Loading /> : (
          COUNT_SLEEP.totalCnt === 0 ? emptyFragment() : cardFragment(0)
        )
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border h-min75vh"}>
        <Grid container spacing={2}>
          <Grid size={12}>
            {exerciseSection()}
          </Grid>
          <Grid size={12}>
            {foodSection()}
          </Grid>
          <Grid size={12}>
            {moneySection()}
          </Grid>
          <Grid size={12}>
            {sleepSection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 9. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      state={{
        DATE, SEND
      }}
      setState={{
        setDATE, setSEND
      }}
      flow={{
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {listNode()}
      {footerNode()}
    </>
  );
};
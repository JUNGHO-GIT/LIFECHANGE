// TodayGoalList.tsx

import { useState, useEffect } from "@importReacts";
import { useCommonValue, useCommonDate } from "@importHooks";
import { useStorageSession, useStorageLocal } from "@importHooks";
import { useStoreLanguage } from "@importHooks";
import { axios } from "@importLibs";
import { insertComma } from "@importScripts";
import { ExerciseGoal, FoodGoal, MoneyGoal, SleepGoal } from "@importSchemas";
import { Loader, Footer, Empty, Dialog } from "@importLayouts";
import { Div, Hr, Br, Img, Icons } from "@importComponents";
import { Paper, Grid, Card } from "@importMuis";
import { Accordion, AccordionSummary, AccordionDetails } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const TodayGoalList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_EXERCISE, URL_FOOD, URL_MONEY, URL_SLEEP } = useCommonValue();
  const { PATH, navigate, sessionId, localCurrency, localUnit } = useCommonValue();
  const { getDayFmt, getDayNotFmt } = useCommonDate();
  const { translate } = useStoreLanguage();

  // 2-1. useStorageSession ------------------------------------------------------------------------
  const [DATE, setDATE] = useStorageSession(
    "date", PATH, "", {
      dateType: "",
      dateStart: getDayFmt(),
      dateEnd: getDayFmt(),
    }
  );

  // 2-2. useStorageLocal --------------------------------------------------------------------------
  const [PAGING, _setPAGING] = useStorageLocal(
    "paging", PATH, "", {
      sort: "asc",
      page: 1,
    }
  );
  const [isExpanded, setIsExpanded] = useStorageLocal(
    "isExpanded", PATH, "", {
      exercise: [{
        expended: true,
      }],
      food: [{
        expended: true,
      }],
      money: [{
        expended: true,
      }],
      sleep: [{
        expended: true,
      }],
    }
  );

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [SEND, setSEND] = useState<any>({
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

      // Accordion 초기값 설정
      // 이전 값이 있으면 유지하고 없으면 true로 설정
      setIsExpanded((prev: any) => ({
        exercise: Array(resExercise.data.result.length).fill(null).map((_, i) => ({
          expanded: prev?.exercise?.[i]?.expanded || true
        })),
        food: Array(resFood.data.result.length).fill(null).map((_, i) => ({
          expanded: prev?.food?.[i]?.expanded || true
        })),
        money: Array(resMoney.data.result.length).fill(null).map((_, i) => ({
          expanded: prev?.money?.[i]?.expanded || true
        })),
        sleep: Array(resSleep.data.result.length).fill(null).map((_, i) => ({
          expanded: prev?.sleep?.[i]?.expanded || true
        }))
      }));
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
      const listFragment = () => (
        <Grid container={true} spacing={0}>
          {OBJECT_EXERCISE.filter((f: any) => f._id).map((item: any, i: number) => (
            <Grid size={12} key={`list-${i}`}>
              <Grid container={true} spacing={0} className={"border-1 radius-1"}>
                <Grid size={12} className={"p-2"}>
                  <Accordion
                    expanded={isExpanded?.exercise[i]?.expanded}
                    TransitionProps={{
                      mountOnEnter: true,
                      unmountOnExit: true,
                    }}
                  >
                    <AccordionSummary
                      className={"me-n10"}
                      expandIcon={
                        <Icons
                          key={"ChevronDown"}
                          name={"ChevronDown"}
                          className={"w-18 h-18"}
                          onClick={(e: any) => {
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
                            className={"w-18 h-18"}
                          />
                        </Grid>
                        <Grid size={10} className={"d-row-left"}>
                          <Div className={"fs-1-0rem fw-600 black"}>
                            {item.exercise_goal_dateStart?.substring(5, 10)}
                          </Div>
                          <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                            {translate(getDayNotFmt(item.exercise_goal_dateStart).format("ddd"))}
                          </Div>
                          <Div className={"fs-0-8rem fw-500 dark ms-5 me-5"}>
                            -
                          </Div>
                          <Div className={"fs-1-0rem fw-600 black"}>
                            {item.exercise_goal_dateEnd?.substring(5, 10)}
                          </Div>
                          <Div className={"fs-0-9rem fw-500 dark ms-5"}>
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
                              max={15}
                              hover={true}
                              shadow={false}
                              radius={false}
                              src={"exercise2"}
                            />
                          </Grid>
                          <Grid size={3} className={"d-row-left"}>
                            <Div className={"fs-1-0rem fw-600 dark ms-n15"}>
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

                        <Hr px={1} />

                        {/** row 2 **/}
                        <Grid container={true} spacing={2}>
                          <Grid size={2} className={"d-row-center"}>
                            <Img
                              max={15}
                              hover={true}
                              shadow={false}
                              radius={false}
                              src={"exercise3_1"}
                            />
                          </Grid>
                          <Grid size={3} className={"d-row-left"}>
                            <Div className={"fs-1-0rem fw-600 dark ms-n15"}>
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

                        <Hr px={1} />

                        {/** row 3 **/}
                        <Grid container={true} spacing={2}>
                          <Grid size={2} className={"d-center"}>
                            <Img
                              max={15}
                              hover={true}
                              shadow={false}
                              radius={false}
                              src={"exercise4"}
                            />
                          </Grid>
                          <Grid size={3} className={"d-row-left"}>
                            <Div className={"fs-1-0rem fw-600 dark ms-n15"}>
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

                        <Hr px={1} />

                        {/** row 4 **/}
                        <Grid container={true} spacing={2}>
                          <Grid size={2} className={"d-center"}>
                            <Img
                              max={15}
                              hover={true}
                              shadow={false}
                              radius={false}
                              src={"exercise5"}
                            />
                          </Grid>
                          <Grid size={3} className={"d-row-left"}>
                            <Div className={"fs-1-0rem fw-600 dark ms-n15"}>
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
            </Grid>
          ))}
        </Grid>
      );
      return (
        <Card className={"d-col-center"}>
          {COUNT.exercise === 0 ? <Empty DATE={DATE} extra={"exercise"} /> : listFragment()}
        </Card>
      );
    };
    // 7-2. food
    const foodSection = () => {
      const listFragment = () => (
        <Grid container={true} spacing={0}>
          {OBJECT_FOOD.filter((f: any) => f._id).map((item: any, i: number) => (
            <Grid size={12} key={`list-${i}`}>
              <Grid container={true} spacing={0} className={"border-1 radius-1"}>
                <Grid size={12} className={"p-2"}>
                  <Accordion
                    expanded={isExpanded?.food[i]?.expanded}
                    TransitionProps={{
                      mountOnEnter: true,
                      unmountOnExit: true,
                    }}
                  >
                    <AccordionSummary
                      className={"me-n10"}
                      expandIcon={
                        <Icons
                          key={"ChevronDown"}
                          name={"ChevronDown"}
                          className={"w-18 h-18"}
                          onClick={(e: any) => {
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
                            className={"w-18 h-18"}
                          />
                        </Grid>
                        <Grid size={10} className={"d-row-left"}>
                          <Div className={"fs-1-0rem fw-600 black"}>
                            {item.food_goal_dateStart?.substring(5, 10)}
                          </Div>
                          <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                            {translate(getDayNotFmt(item.food_goal_dateStart).format("ddd"))}
                          </Div>
                          <Div className={"fs-0-8rem fw-500 dark ms-5 me-5"}>
                            -
                          </Div>
                          <Div className={"fs-1-0rem fw-600 black"}>
                            {item.food_goal_dateEnd?.substring(5, 10)}
                          </Div>
                          <Div className={"fs-0-9rem fw-500 dark ms-5"}>
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
                              max={15}
                              hover={true}
                              shadow={false}
                              radius={false}
                              src={"food2"}
                            />
                          </Grid>
                          <Grid size={3} className={"d-row-left"}>
                            <Div className={"fs-1-0rem fw-600 dark ms-n15"}>
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

                        <Hr px={1} />

                        {/** row 2 **/}
                        <Grid container={true} spacing={2}>
                          <Grid size={2} className={"d-row-center"}>
                            <Img
                              max={15}
                              hover={true}
                              shadow={false}
                              radius={false}
                              src={"food3"}
                            />
                          </Grid>
                          <Grid size={3} className={"d-row-left"}>
                            <Div className={"fs-1-0rem fw-600 dark ms-n15"}>
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

                        <Hr px={1} />

                        {/** row 3 **/}
                        <Grid container={true} spacing={2}>
                          <Grid size={2} className={"d-center"}>
                            <Img
                              max={15}
                              hover={true}
                              shadow={false}
                              radius={false}
                              src={"food4"}
                            />
                          </Grid>
                          <Grid size={3} className={"d-row-left"}>
                            <Div className={"fs-1-0rem fw-600 dark ms-n15"}>
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

                        <Hr px={1} />

                        {/** row 4 **/}
                        <Grid container={true} spacing={2}>
                          <Grid size={2} className={"d-center"}>
                            <Img
                              max={15}
                              hover={true}
                              shadow={false}
                              radius={false}
                              src={"food5"}
                            />
                          </Grid>
                          <Grid size={3} className={"d-row-left"}>
                            <Div className={"fs-1-0rem fw-600 dark ms-n15"}>
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
            </Grid>
          ))}
        </Grid>
      );
      return (
        <Card className={"d-col-center"}>
          {COUNT.food === 0 ? <Empty DATE={DATE} extra={"food"} /> : listFragment()}
        </Card>
      );
    };
    // 7-3. money
    const moneySection = () => {
      const listFragment = () => (
        <Grid container={true} spacing={0}>
          {OBJECT_MONEY.filter((f: any) => f._id).map((item: any, i: number) => (
            <Grid size={12} key={`list-${i}`}>
              <Grid container={true} spacing={0} className={"border-1 radius-1"}>
                <Grid size={12} className={"p-2"}>
                  <Accordion
                    expanded={isExpanded?.money[i]?.expanded}
                    TransitionProps={{
                      mountOnEnter: true,
                      unmountOnExit: true,
                    }}
                  >
                    <AccordionSummary
                      className={"me-n10"}
                      expandIcon={
                        <Icons
                          key={"ChevronDown"}
                          name={"ChevronDown"}
                          className={"w-18 h-18"}
                          onClick={(e: any) => {
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
                            className={"w-18 h-18"}
                          />
                        </Grid>
                        <Grid size={10} className={"d-row-left"}>
                          <Div className={"fs-1-0rem fw-600 black"}>
                            {item.money_goal_dateStart?.substring(5, 10)}
                          </Div>
                          <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                            {translate(getDayNotFmt(item.money_goal_dateStart).format("ddd"))}
                          </Div>
                          <Div className={"fs-0-8rem fw-500 dark ms-5 me-5"}>
                            -
                          </Div>
                          <Div className={"fs-1-0rem fw-600 black"}>
                            {item.money_goal_dateEnd?.substring(5, 10)}
                          </Div>
                          <Div className={"fs-0-9rem fw-500 dark ms-5"}>
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
                              max={15}
                              hover={true}
                              shadow={false}
                              radius={false}
                              src={"money2"}
                            />
                          </Grid>
                          <Grid size={3} className={"d-row-left"}>
                            <Div className={"fs-1-0rem fw-600 dark ms-n15"}>
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

                        <Hr px={1} />

                        {/** row 2 **/}
                        <Grid container={true} spacing={2}>
                          <Grid size={2} className={"d-row-center"}>
                            <Img
                              max={15}
                              hover={true}
                              shadow={false}
                              radius={false}
                              src={"money2"}
                            />
                          </Grid>
                          <Grid size={3} className={"d-row-left"}>
                            <Div className={"fs-1-0rem fw-600 dark ms-n15"}>
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
            </Grid>
          ))}
        </Grid>
      );
      return (
        <Card className={"d-col-center"}>
          {COUNT.money=== 0 ? <Empty DATE={DATE} extra={"money"} /> : listFragment()}
        </Card>
      );
    };
    // 7-4. sleep
    const sleepSection = () => {
      const listFragment = () => (
        <Grid container={true} spacing={0}>
          {OBJECT_SLEEP.filter((f: any) => f._id).map((item: any, i: number) => (
            <Grid size={12} key={`list-${i}`}>
              <Grid container={true} spacing={0} className={"border-1 radius-1"}>
                <Grid size={12} className={"p-2"}>
                  <Accordion
                    expanded={isExpanded?.sleep[i]?.expanded}
                    TransitionProps={{
                      mountOnEnter: true,
                      unmountOnExit: true,
                    }}
                  >
                    <AccordionSummary
                      className={"me-n10"}
                      expandIcon={
                        <Icons
                          key={"ChevronDown"}
                          name={"ChevronDown"}
                          className={"w-18 h-18"}
                          onClick={(e: any) => {
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
                            className={"w-18 h-18"}
                          />
                        </Grid>
                        <Grid size={10} className={"d-row-left"}>
                          <Div className={"fs-1-0rem fw-600 black"}>
                            {item.sleep_goal_dateStart?.substring(5, 10)}
                          </Div>
                          <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                            {translate(getDayNotFmt(item.sleep_goal_dateStart).format("ddd"))}
                          </Div>
                          <Div className={"fs-0-8rem fw-500 dark ms-5 me-5"}>
                            -
                          </Div>
                          <Div className={"fs-1-0rem fw-600 black"}>
                            {item.sleep_goal_dateEnd?.substring(5, 10)}
                          </Div>
                          <Div className={"fs-0-9rem fw-500 dark ms-5"}>
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
                              max={15}
                              hover={true}
                              shadow={false}
                              radius={false}
                              src={"sleep2"}
                            />
                          </Grid>
                          <Grid size={3} className={"d-row-left"}>
                            <Div className={"fs-1-0rem fw-600 dark ms-n15"}>
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

                        <Hr px={1} />

                        {/** row 2 **/}
                        <Grid container={true} spacing={2}>
                          <Grid size={2} className={"d-center"}>
                            <Img
                              max={15}
                              hover={true}
                              shadow={false}
                              radius={false}
                              src={"sleep3"}
                            />
                          </Grid>
                          <Grid size={3} className={"d-row-left"}>
                            <Div className={"fs-1-0rem fw-600 dark ms-n15"}>
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

                        <Hr px={1} />

                        {/** row 3 **/}
                        <Grid container={true} spacing={2}>
                          <Grid size={2} className={"d-center"}>
                            <Img
                              max={15}
                              hover={true}
                              shadow={false}
                              radius={false}
                              src={"sleep4"}
                            />
                          </Grid>
                          <Grid size={3} className={"d-row-left"}>
                            <Div className={"fs-1-0rem fw-600 dark ms-n15"}>
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
            </Grid>
          ))}
        </Grid>
      );
      return (
        <Card className={"d-col-center"}>
          {COUNT.sleep === 0 ? <Empty DATE={DATE} extra={"sleep"} /> : listFragment()}
        </Card>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min75vh"}>
        {LOADING ? <Loader /> : (
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
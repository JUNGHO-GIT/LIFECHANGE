// TodayGoalList.jsx
// Node -> Section -> Fragment

import { useState, useEffect } from "../../imports/ImportReacts.jsx";
import { useCommon, useStorage } from "../../imports/ImportHooks.jsx";
import { axios, numeral, moment } from "../../imports/ImportLibs.jsx";
import { Loading, Footer } from "../../imports/ImportLayouts.jsx";
import { Div, Hr, Img, Icons } from "../../imports/ImportComponents.jsx";
import { Empty } from "../../imports/ImportContainers.jsx";
import { Paper, Card, Grid } from "../../imports/ImportMuis.jsx";
import { Accordion, AccordionSummary, AccordionDetails } from "../../imports/ImportMuis.jsx";
import { exercise2, exercise3_1, exercise4, exercise5 } from "../../imports/ImportImages.jsx";
import { food2, food3, food4, food5 } from "../../imports/ImportImages.jsx";
import { money2 } from "../../imports/ImportImages.jsx";
import { sleep2, sleep3, sleep4 } from "../../imports/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const TodayGoalList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { navigate, location_dateStart, location_dateEnd, PATH, URL_EXERCISE, URL_FOOD, URL_MONEY, URL_SLEEP, translate, sessionId, koreanDate } = useCommon();

  // 2-2. useStorage -------------------------------------------------------------------------------
  // 리스트에서만 사용
  const [DATE, setDATE] = useStorage(
    `DATE(${PATH})`, {
      dateType: "day",
      dateStart: location_dateStart || koreanDate,
      dateEnd: location_dateEnd || koreanDate,
    }
  );
  const [PAGING, setPAGING] = useStorage(
    `PAGING(${PATH})`, {
      sort: "asc",
      page: 1,
    }
  );

  // 2-2. useState ---------------------------------------------------------------------------------
  const [isExpandedExercise, setIsExpandedExercise] = useState([0]);
  const [isExpandedFood, setIsExpandedFood] = useState([0]);
  const [isExpandedMoney, setIsExpandedMoney] = useState([0]);
  const [isExpandedSleep, setIsExpandedSleep] = useState([0]);
  const [LOADING, setLOADING] = useState(false);
  const [SEND, setSEND] = useState({
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
  const [COUNT_EXERCISE, setCOUNT_EXERCISE] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });
  const [COUNT_FOOD, setCOUNT_FOOD] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });
  const [COUNT_MONEY, setCOUNT_MONEY] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });
  const [COUNT_SLEEP, setCOUNT_SLEEP] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_EXERCISE_DEF = [{
    _id: "",
    exercise_goal_number: 0,
    exercise_goal_dummy: "N",
    exercise_goal_dateType: "day",
    exercise_goal_dateStart: "0000-00-00",
    exercise_goal_dateEnd: "0000-00-00",
    exercise_goal_count: "0",
    exercise_goal_count_color: "",
    exercise_goal_volume: "0",
    exercise_goal_volume_color: "",
    exercise_goal_weight: "0",
    exercise_goal_weight_color: "",
    exercise_goal_cardio: "00:00",
    exercise_goal_cardio_color: "",
    exercise_dateType: "day",
    exercise_dateStart: "0000-00-00",
    exercise_dateEnd: "0000-00-00",
    exercise_total_count: "0",
    exercise_total_count_color: "",
    exercise_total_volume: "0",
    exercise_total_volume_color: "",
    exercise_total_weight: "0",
    exercise_total_weight_color: "",
    exercise_total_cardio: "00:00",
    exercise_total_cardio_color: "",
    exercise_diff_count: "0",
    exercise_diff_count_color: "",
    exercise_diff_cardio: "00:00",
    exercise_diff_cardio_color: "",
    exercise_diff_volume: "0",
    exercise_diff_volume_color: "",
    exercise_diff_weight: "0",
    exercise_diff_weight_color: "",
  }];
  const OBJECT_FOOD_DEF = [{
    _id: "",
    food_goal_number: 0,
    food_goal_dummy: "N",
    food_goal_dateType: "day",
    food_goal_dateStart: "0000-00-00",
    food_goal_dateEnd: "0000-00-00",
    food_goal_kcal: "0",
    food_goal_kcal_color: "",
    food_goal_carb: "0",
    food_goal_carb_color: "",
    food_goal_protein: "0",
    food_goal_protein_color: "",
    food_goal_fat: "0",
    food_goal_fat_color: "",
    food_dateType: "day",
    food_dateStart: "0000-00-00",
    food_dateEnd: "0000-00-00",
    food_total_kcal: "0",
    food_total_kcal_color: "",
    food_total_carb: "0",
    food_total_carb_color: "",
    food_total_protein: "0",
    food_total_protein_color: "",
    food_total_fat: "0",
    food_diff_kcal: "0",
    food_diff_kcal_color: "",
    food_diff_carb: "0",
    food_diff_carb_color: "",
    food_diff_protein: "0",
    food_diff_protein_color: "",
    food_diff_fat: "0",
    food_diff_fat_color: "",
  }];
  const OBJECT_MONEY_DEF = [{
    _id: "",
    money_goal_number: 0,
    money_goal_dummy: "N",
    money_goal_dateType: "",
    money_goal_dateStart: "0000-00-00",
    money_goal_dateEnd: "0000-00-00",
    money_goal_income: "0",
    money_goal_income_color: "",
    money_goal_expense: "0",
    money_goal_expense_color: "",
    money_dateType: "",
    money_dateStart: "0000-00-00",
    money_dateEnd: "0000-00-00",
    money_total_income: "0",
    money_total_income_color: "",
    money_total_expense: "0",
    money_total_expense_color: "",
    money_diff_income: "0",
    money_diff_income_color: "",
    money_diff_expense: "0",
    money_diff_expense_color: "",
  }];
  const OBJECT_SLEEP_DEF = [{
    _id: "",
    sleep_goal_number: 0,
    sleep_goal_dummy: "N",
    sleep_goal_dateType: "",
    sleep_goal_dateStart: "0000-00-00",
    sleep_goal_dateEnd: "0000-00-00",
    sleep_goal_bedTime: "00:00",
    sleep_goal_bedTime_color: "",
    sleep_goal_wakeTime: "00:00",
    sleep_goal_wakeTime_color: "",
    sleep_goal_sleepTime: "00:00",
    sleep_goal_sleepTime_color: "",
    sleep_dateType: "",
    sleep_dateStart: "0000-00-00",
    sleep_dateEnd: "0000-00-00",
    sleep_bedTime: "00:00",
    sleep_bedTime_color: "",
    sleep_wakeTime: "00:00",
    sleep_wakeTime_color: "",
    sleep_sleepTime: "00:00",
    sleep_sleepTime_color: "",
    sleep_diff_bedTime: "00:00",
    sleep_diff_bedTime_color: "",
    sleep_diff_wakeTime: "00:00",
    sleep_diff_wakeTime_color: "",
    sleep_diff_sleepTime: "00:00",
    sleep_diff_sleepTime_color: ""
  }];
  const [OBJECT_EXERCISE, setOBJECT_EXERCISE] = useState(OBJECT_EXERCISE_DEF);
  const [OBJECT_FOOD, setOBJECT_FOOD] = useState(OBJECT_FOOD_DEF);
  const [OBJECT_MONEY, setOBJECT_MONEY] = useState(OBJECT_MONEY_DEF);
  const [OBJECT_SLEEP, setOBJECT_SLEEP] = useState(OBJECT_SLEEP_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    const fetchData = async (url, setObject, setCount, objectDef, setIsExpanded) => {
      try {
        const res = await axios.get(url, {
          params: {
            user_id: sessionId,
            PAGING: PAGING,
            DATE: DATE,
          },
        });
        setObject(res.data.result && res.data.result.length > 0 ? res.data.result : objectDef);
        setCount((prev) => ({
          ...prev,
          totalCnt: res.data.totalCnt || 0,
          sectionCnt: res.data.sectionCnt || 0,
          newSectionCnt: res.data.sectionCnt || 0,
        }));
        // Accordion 초기값 설정
        //setIsExpanded([]);
        setIsExpanded(res.data.result.map((_, index) => (index)));
      }
      catch (err) {
        console.error(err);
      }
    };
    const fetchAllData = async () => {
      await Promise.all([
        fetchData(
          `${URL_EXERCISE}/goal/list`,
          setOBJECT_EXERCISE,
          setCOUNT_EXERCISE,
          OBJECT_EXERCISE_DEF,
          setIsExpandedExercise
        ),
        fetchData(
          `${URL_FOOD}/goal/list`,
          setOBJECT_FOOD,
          setCOUNT_FOOD,
          OBJECT_FOOD_DEF,
          setIsExpandedFood
        ),
        fetchData(
          `${URL_MONEY}/goal/list`,
          setOBJECT_MONEY,
          setCOUNT_MONEY,
          OBJECT_MONEY_DEF,
          setIsExpandedMoney
        ),
        fetchData(
          `${URL_SLEEP}/goal/list`,
          setOBJECT_SLEEP,
          setCOUNT_SLEEP,
          OBJECT_SLEEP_DEF,
          setIsExpandedSleep
        ),
      ]);
      setLOADING(false);
    };
    fetchAllData();
  }, [sessionId, PAGING.sort, PAGING.page, DATE.dateStart, DATE.dateEnd]);

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
      const cardFragment = (i) => (
        OBJECT_EXERCISE?.map((item, index) => (
          <Card className={"border radius"} key={`${index}-${i}`}>
            <Accordion className={"shadow-none"} expanded={isExpandedExercise.includes(index)}>
              <AccordionSummary
                className={"pb-10"}
                expandIcon={
                  <Icons
                    name={"TbChevronDown"}
                    className={"w-18 h-18 black"}
                    onClick={(e) => {
                      setIsExpandedExercise(isExpandedExercise.includes(index)
                      ? isExpandedExercise.filter((el) => el !== index)
                      : [...isExpandedExercise, index]
                    )}}
                  />
                }
              >
                <Grid container spacing={2}
                  onClick={(e) => {
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
                      name={"TbSearch"}
                      className={"w-18 h-18 black"}
                      onClick={() => {}}
                    />
                  </Grid>
                  <Grid size={10} className={"d-left"}>
                    {item.exercise_goal_dateStart === item.exercise_goal_dateEnd ? (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.exercise_goal_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.exercise_goal_dateStart).format("ddd"))}
                        </Div>
                      </>
                    ) : (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.exercise_goal_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.exercise_goal_dateStart).format("ddd"))}
                        </Div>
                        <Div className={"fs-1-0rem ms-3vw me-3vw"}>
                          ~
                        </Div>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.exercise_goal_dateEnd?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.exercise_goal_dateEnd).format("ddd"))}
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
                    <Img src={exercise2} className={"w-15 h-15"} />
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
                    <Img src={exercise3_1} className={"w-15 h-15"} />
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
                    <Img src={exercise5} className={"w-15 h-15"} />
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
                    <Img src={exercise4} className={"w-15 h-15"} />
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
                          {numeral(item.exercise_goal_weight).format("0,0")}
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
                          {numeral(item.exercise_total_weight).format("0,0")}
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
                          {numeral(item.exercise_diff_weight).format("0,0")}
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
      const cardFragment = (i) => (
        OBJECT_FOOD?.map((item, index) => (
          <Card className={"border radius"} key={`${index}-${i}`}>
            <Accordion className={"shadow-none"} expanded={isExpandedFood.includes(index)}>
              <AccordionSummary
                className={"pb-10"}
                expandIcon={
                  <Icons
                    name={"TbChevronDown"}
                    className={"w-18 h-18 black"}
                    onClick={(e) => {
                      setIsExpandedFood(isExpandedFood.includes(index)
                      ? isExpandedFood.filter((el) => el !== index)
                      : [...isExpandedFood, index]
                    )}}
                  />
                }
              >
                <Grid container spacing={2}
                  onClick={(e) => {
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
                      name={"TbSearch"}
                      className={"w-18 h-18 black"}
                      onClick={() => {}}
                    />
                  </Grid>
                  <Grid size={10} className={"d-left"}>
                    {item.food_goal_dateStart === item.food_goal_dateEnd ? (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.food_goal_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.food_goal_dateStart).format("ddd"))}
                        </Div>
                      </>
                    ) : (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.food_goal_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.food_goal_dateStart).format("ddd"))}
                        </Div>
                        <Div className={"fs-1-0rem ms-3vw me-3vw"}>
                          ~
                        </Div>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.food_goal_dateEnd?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.food_goal_dateEnd).format("ddd"))}
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
                    <Img src={food2} className={"w-15 h-15"} />
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
                    <Img src={food3} className={"w-15 h-15"} />
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
                    <Img src={food4} className={"w-15 h-15"} />
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
                    <Img src={food5} className={"w-15 h-15"} />
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
                          {numeral(item.food_goal_weight).format("0,0")}
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
      const cardFragment = (i) => (
        OBJECT_MONEY?.map((item, index) => (
          <Card className={"border radius"} key={`${index}-${i}`}>
            <Accordion className={"shadow-none"} expanded={isExpandedMoney.includes(index)}>
              <AccordionSummary
                className={"pb-10"}
                expandIcon={
                  <Icons
                    name={"TbChevronDown"}
                    className={"w-18 h-18 black"}
                    onClick={(e) => {
                      setIsExpandedMoney(isExpandedMoney.includes(index)
                      ? isExpandedMoney.filter((el) => el !== index)
                      : [...isExpandedMoney, index]
                    )}}
                  />
                }
              >
                <Grid container spacing={2}
                  onClick={(e) => {
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
                      name={"TbSearch"}
                      className={"w-18 h-18 black"}
                      onClick={() => {}}
                    />
                  </Grid>
                  <Grid size={10} className={"d-left"}>
                    {item.money_goal_dateStart === item.money_goal_dateEnd ? (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.money_goal_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.money_goal_dateStart).format("ddd"))}
                        </Div>
                      </>
                    ) : (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.money_goal_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.money_goal_dateStart).format("ddd"))}
                        </Div>
                        <Div className={"fs-1-0rem ms-3vw me-3vw"}>
                          ~
                        </Div>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.money_goal_dateEnd?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.money_goal_dateEnd).format("ddd"))}
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
                    <Img src={money2} className={"w-15 h-15"} />
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
                          {translate("currency")}
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
                          {translate("currency")}
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
                          {translate("currency")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Hr px={20} />
                {/** row 2 **/}
                <Grid container spacing={1}>
                  <Grid size={2} className={"d-center"}>
                    <Img src={money2} className={"w-15 h-15"} />
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
                          {translate("currency")}
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
                          {translate("currency")}
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
                          {translate("currency")}
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
      const cardFragment = (i) => (
        OBJECT_SLEEP?.map((item, index) => (
          <Card className={"border radius"} key={`${index}-${i}`}>
            <Accordion className={"shadow-none"} expanded={isExpandedSleep.includes(index)}>
              <AccordionSummary
                className={"pb-10"}
                expandIcon={
                  <Icons
                    name={"TbChevronDown"}
                    className={"w-18 h-18 black"}
                    onClick={(e) => {
                      setIsExpandedSleep(isExpandedSleep.includes(index)
                      ? isExpandedSleep.filter((el) => el !== index)
                      : [...isExpandedSleep, index]
                    )}}
                  />
                }
              >
                <Grid container spacing={2}
                  onClick={(e) => {
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
                      name={"TbSearch"}
                      className={"w-18 h-18 black"}
                      onClick={() => {}}
                    />
                  </Grid>
                  <Grid size={10} className={"d-left"}>
                    {item.sleep_goal_dateStart === item.sleep_goal_dateEnd ? (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.sleep_goal_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.sleep_goal_dateStart).format("ddd"))}
                        </Div>
                      </>
                    ) : (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.sleep_goal_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.sleep_goal_dateStart).format("ddd"))}
                        </Div>
                        <Div className={"fs-1-0rem ms-3vw me-3vw"}>
                          ~
                        </Div>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.sleep_goal_dateEnd?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.sleep_goal_dateEnd).format("ddd"))}
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
                    <Img src={sleep2} className={"w-15 h-15"} />
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
                    <Img src={sleep3} className={"w-15 h-15"} />
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
                    <Img src={sleep4} className={"w-15 h-15"} />
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
        navigate
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
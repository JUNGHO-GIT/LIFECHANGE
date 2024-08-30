// TodayList.jsx
// Node -> Section -> Fragment

import { useState, useEffect } from "../../imports/ImportReacts.jsx";
import { useCommon, useStorage } from "../../imports/ImportHooks.jsx";
import { axios, numeral, moment } from "../../imports/ImportLibs.jsx";
import { Loading, Footer } from "../../imports/ImportLayouts.jsx";
import { Div, Hr, Img, Icons } from "../../imports/ImportComponents.jsx";
import { Empty } from "../../imports/ImportContainers.jsx";
import { Paper, Card, Grid } from "../../imports/ImportMuis.jsx";
import { Accordion, AccordionSummary, AccordionDetails } from "../../imports/ImportMuis.jsx";
import { exercise3_1, exercise4, exercise5 } from "../../imports/ImportImages.jsx";
import { food2, food3, food4, food5 } from "../../imports/ImportImages.jsx";
import { money2 } from "../../imports/ImportImages.jsx";
import { sleep2, sleep3, sleep4 } from "../../imports/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const TodayList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { navigate, location_dateStart, location_dateEnd, PATH, URL_EXERCISE, URL_FOOD, URL_MONEY, URL_SLEEP, translate, sessionId, koreanDate } = useCommon();

  // 2-2. useStorage -------------------------------------------------------------------------------
  // 리스트에서만 사용
  const [DATE, setDATE] = useStorage(
    `DATE(${PATH})`, {
      dateType: "day",
      dateStart:location_dateStart || koreanDate,
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
    exercise_number: 0,
    exercise_dummy: "N",
    exercise_dateType: "day",
    exercise_dateStart: "0000-00-00",
    exercise_dateEnd: "0000-00-00",
    exercise_total_volume: "0",
    exercise_total_volume_color: "",
    exercise_total_cardio: "00:00",
    exercise_total_cardio_color: "",
    exercise_total_weight: "0",
    exercise_total_weight_color: "",
    exercise_section: [{
      exercise_part_idx: 0,
      exercise_part_val: "all",
      exercise_title_idx: 0,
      exercise_title_val: "all",
      exercise_set: "0",
      exercise_rep: "0",
      exercise_kg: "0",
      exercise_volume: "0",
      exercise_cardio: "00:00",
    }],
  }];
  const OBJECT_FOOD_DEF = [{
    _id: "",
    food_number: 0,
    food_dummy: "N",
    food_dateType: "day",
    food_dateStart: "0000-00-00",
    food_dateEnd: "0000-00-00",
    food_total_kcal: "0",
    food_total_kcal_color: "",
    food_total_fat: "0",
    food_total_fat_color: "",
    food_total_carb: "0",
    food_total_carb_color: "",
    food_total_protein: "0",
    food_total_protein_color: "",
    food_section: [{
      food_part_idx: 1,
      food_part_val: "breakfast",
      food_name: "",
      food_brand: "",
      food_count: "0",
      food_serv: "회",
      food_gram: "0",
      food_kcal: "0",
      food_fat: "0",
      food_carb: "0",
      food_protein: "0",
    }],
  }];
  const OBJECT_MONEY_DEF = [{
    _id: "",
    money_number: 0,
    money_dummy: "N",
    money_dateType: "day",
    money_dateStart: "0000-00-00",
    money_dateEnd: "0000-00-00",
    money_total_income: "0",
    money_total_income_color: "",
    money_total_expense: "0",
    money_total_expense_color: "",
    money_section: [{
      money_part_idx: 0,
      money_part_val: "all",
      money_title_idx: 0,
      money_title_val: "all",
      money_amount: "0",
      money_content: "",
    }],
  }];
  const OBJECT_SLEEP_DEF = [{
    _id: "",
    sleep_number: 0,
    sleep_dummy: "N",
    sleep_dateType: "day",
    sleep_dateStart: "0000-00-00",
    sleep_dateEnd: "0000-00-00",
    sleep_section: [{
      sleep_bedTime: "00:00",
      sleep_bedTime_color: "",
      sleep_wakeTime: "00:00",
      sleep_wakeTime_color: "",
      sleep_sleepTime: "00:00",
      sleep_sleepTime_color: "",
    }],
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
        setObject(res.data.result || objectDef);
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
          `${URL_EXERCISE}/list`,
          setOBJECT_EXERCISE,
          setCOUNT_EXERCISE,
          OBJECT_EXERCISE_DEF,
          setIsExpandedExercise
        ),
        fetchData(
          `${URL_FOOD}/list`,
          setOBJECT_FOOD,
          setCOUNT_FOOD,
          OBJECT_FOOD_DEF,
          setIsExpandedFood
        ),
        fetchData(
          `${URL_MONEY}/list`,
          setOBJECT_MONEY,
          setCOUNT_MONEY,
          OBJECT_MONEY_DEF,
          setIsExpandedMoney
        ),
        fetchData(
          `${URL_SLEEP}/list`,
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
          type={"real"}
          extra={"exercise"}
        />
      );
      const cardFragment = (i) => (
        OBJECT_EXERCISE?.map((item, index) => (
          <Card className={"border radius p-10"} key={`${index}-${i}`}>
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
                      dateType: item.exercise_dateType,
                      dateStart: item.exercise_dateStart,
                      dateEnd: item.exercise_dateEnd,
                    });
                    navigate(SEND.toExercise, {
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
                    {item.exercise_dateStart === item.exercise_dateEnd ? (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.exercise_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.exercise_dateStart).format("ddd"))}
                        </Div>
                      </>
                    ) : (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.exercise_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.exercise_dateStart).format("ddd"))}
                        </Div>
                        <Div className={"fs-1-0rem ms-3vw me-3vw"}>
                          ~
                        </Div>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.exercise_dateEnd?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.exercise_dateEnd).format("ddd"))}
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
                    <Img src={exercise3_1} className={"w-15 h-15"} />
                  </Grid>
                  <Grid size={2} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("volume")}
                    </Div>
                  </Grid>
                  <Grid size={7} className={"d-right"}>
                    <Div className={`fs-1-0rem fw-600 ${item.exercise_total_volume_color}`}>
                      {numeral(item.exercise_total_volume).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid size={1} className={"d-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("vol")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr px={30} />
                {/** row 2 **/}
                <Grid container spacing={1}>
                  <Grid size={2} className={"d-center"}>
                    <Img src={exercise4} className={"w-15 h-15"} />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("cardio")}
                    </Div>
                  </Grid>
                  <Grid size={6} className={"d-right"}>
                    <Div className={`fs-1-0rem fw-600 ${item.exercise_total_cardio_color}`}>
                      {item.exercise_total_cardio}
                    </Div>
                  </Grid>
                  <Grid size={1} className={"d-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("hm")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr px={30} />
                {/** row 3 **/}
                <Grid container spacing={1}>
                  <Grid size={2} className={"d-center"}>
                    <Img src={exercise5} className={"w-15 h-15"} />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("weight")}
                    </Div>
                  </Grid>
                  <Grid size={6} className={"d-right"}>
                    <Div className={`fs-1-0rem fw-600 ${item.exercise_total_weight_color}`}>
                      {item.exercise_total_weight}
                    </Div>
                  </Grid>
                  <Grid size={1} className={"d-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("k")}
                    </Div>
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
          type={"real"}
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
                      dateType: item.food_dateType,
                      dateStart: item.food_dateStart,
                      dateEnd: item.food_dateEnd,
                    });
                    navigate(SEND.toFood, {
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
                    {item.food_dateStart === item.food_dateEnd ? (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.food_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.food_dateStart).format("ddd"))}
                        </Div>
                      </>
                    ) : (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.food_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.food_dateStart).format("ddd"))}
                        </Div>
                        <Div className={"fs-1-0rem ms-3vw me-3vw"}>
                          ~
                        </Div>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.food_dateEnd?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.food_dateEnd).format("ddd"))}
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
                  <Grid size={6} className={"d-right"}>
                    <Div className={`fs-1-0rem fw-600 ${item.food_total_kcal_color}`}>
                      {numeral(item.food_total_kcal).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid size={1} className={"d-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("kc")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr px={30} />
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
                  <Grid size={6} className={"d-right"}>
                    <Div className={`fs-1-0rem fw-600 ${item.food_total_carb_color}`}>
                      {numeral(item.food_total_carb).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid size={1} className={"d-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("g")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr px={30} />
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
                  <Grid size={6} className={"d-right"}>
                    <Div className={`fs-1-0rem fw-600 ${item.food_total_protein_color}`}>
                      {numeral(item.food_total_protein).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid size={1} className={"d-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("g")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr px={30} />
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
                  <Grid size={6} className={"d-right"}>
                    <Div className={`fs-1-0rem fw-600 ${item.food_total_fat_color}`}>
                      {numeral(item.food_total_fat).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid size={1} className={"d-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("g")}
                    </Div>
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
          type={"real"}
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
                      dateType: item.money_dateType,
                      dateStart: item.money_dateStart,
                      dateEnd: item.money_dateEnd,
                    });
                    navigate(SEND.toMoney, {
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
                    {item.money_dateStart === item.money_dateEnd ? (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.money_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.money_dateStart).format("ddd"))}
                        </Div>
                      </>
                    ) : (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.money_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.money_dateStart).format("ddd"))}
                        </Div>
                        <Div className={"fs-1-0rem ms-3vw me-3vw"}>
                          ~
                        </Div>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.money_dateEnd?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.money_dateEnd).format("ddd"))}
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
                  <Grid size={6} className={"d-right"}>
                    <Div className={`fs-1-0rem fw-600 ${item.money_total_income_color}`}>
                      {numeral(item.money_total_income).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid size={1} className={"d-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("currency")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr px={30} />
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
                  <Grid size={6} className={"d-right"}>
                    <Div className={`fs-1-0rem fw-600 ${item.money_total_expense_color}`}>
                      {numeral(item.money_total_expense).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid size={1} className={"d-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("currency")}
                    </Div>
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
          type={"real"}
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
                      dateType: item.sleep_dateType,
                      dateStart: item.sleep_dateStart,
                      dateEnd: item.sleep_dateEnd,
                    });
                    navigate(SEND.toSleep, {
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
                    {item.sleep_dateStart === item.sleep_dateEnd ? (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.sleep_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.sleep_dateStart).format("ddd"))}
                        </Div>
                      </>
                    ) : (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.sleep_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.sleep_dateStart).format("ddd"))}
                        </Div>
                        <Div className={"fs-1-0rem ms-3vw me-3vw"}>
                          ~
                        </Div>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.sleep_dateEnd?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.sleep_dateEnd).format("ddd"))}
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
                  <Grid size={6} className={"d-right"}>
                    <Div className={`fs-1-0rem fw-600 ${item.sleep_section[0]?.sleep_bedTime_color}`}>
                      {item.sleep_section[0]?.sleep_bedTime}
                    </Div>
                  </Grid>
                  <Grid size={1} className={"d-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("hm")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr px={30} />
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
                  <Grid size={6} className={"d-right"}>
                    <Div className={`fs-1-0rem fw-600 ${item.sleep_section[0]?.sleep_wakeTime_color}`}>
                      {item.sleep_section[0]?.sleep_wakeTime}
                    </Div>
                  </Grid>
                  <Grid size={1} className={"d-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("hm")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr px={30} />
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
                  <Grid size={6} className={"d-right"}>
                    <Div className={`fs-1-0rem fw-600 ${item.sleep_section[0]?.sleep_sleepTime_color}`}>
                      {item.sleep_section[0]?.sleep_sleepTime}
                    </Div>
                  </Grid>
                  <Grid size={1} className={"d-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("hm")}
                    </Div>
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
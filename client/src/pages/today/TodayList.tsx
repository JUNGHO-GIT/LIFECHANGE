// TodayList.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useStorage } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { Exercise, Food, Money, Sleep } from "@imports/ImportSchemas";
import { axios, numeral } from "@imports/ImportUtils";
import { Loading, Footer, Empty, Dialog } from "@imports/ImportLayouts";
import { Div, Hr, Br, Img, Icons } from "@imports/ImportComponents";
import { Paper, Card, Grid } from "@imports/ImportMuis";
import { Accordion, AccordionSummary, AccordionDetails } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const TodayList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_EXERCISE, URL_FOOD, URL_MONEY, URL_SLEEP } = useCommonValue();
  const { PATH, TITLE, navigate, sessionId, localCurrency } = useCommonValue();
  const { getDayFmt, getDayNotFmt } = useCommonDate();
  const { translate } = useLanguageStore();

  // 2-2. useStorage -------------------------------------------------------------------------------
  // 리스트에서만 사용
  const [DATE, setDATE] = useStorage(
    `${TITLE}_date_(${PATH})`, {
      dateType: "day",
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
  const [OBJECT_EXERCISE, setOBJECT_EXERCISE] = useState<any>([Exercise]);
  const [OBJECT_FOOD, setOBJECT_FOOD] = useState<any>([Food]);
  const [OBJECT_MONEY, setOBJECT_MONEY] = useState<any>([Money]);
  const [OBJECT_SLEEP, setOBJECT_SLEEP] = useState<any>([Sleep]);

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
        axios.get(`${URL_EXERCISE}/list`, { params }),
        axios.get(`${URL_FOOD}/list`, { params }),
        axios.get(`${URL_MONEY}/list`, { params }),
        axios.get(`${URL_SLEEP}/list`, { params })
      ]);
      setOBJECT_EXERCISE(
        resExercise.data.result.length > 0 ? resExercise.data.result : [Exercise]
      );
      setOBJECT_FOOD(
        resFood.data.result.length > 0 ? resFood.data.result : [Food]
      );
      setOBJECT_MONEY(
        resMoney.data.result.length > 0 ? resMoney.data.result : [Money]
      );
      setOBJECT_SLEEP(
        resSleep.data.result.length > 0 ? resSleep.data.result : [Sleep]
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
    catch (err: any) {
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
                  navigate(SEND.toExercise, {
                    state: {
                      id: item._id,
                      dateType: item.exercise_dateType,
                      dateStart: item.exercise_dateStart,
                      dateEnd: item.exercise_dateEnd,
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
                      {item.exercise_dateStart?.substring(5, 10)}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                      {translate(getDayNotFmt(item.exercise_dateStart).format("ddd"))}
                    </Div>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={1} columns={12}>
                  {/** row 1 **/}
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
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`${item.exercise_total_volume_color}`}>
                          {numeral(item.exercise_total_volume).format("0,0")}
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
                <Hr px={30} />
                {/** row 2 **/}
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
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`${item.exercise_total_cardio_color}`}>
                          {item.exercise_total_cardio}
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
                <Hr px={30} />
                {/** row 3 **/}
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
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`${item.exercise_total_weight_color}`}>
                          {item.exercise_total_weight}
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
                  navigate(SEND.toFood, {
                    state: {
                      id: item._id,
                      dateType: item.food_dateType,
                      dateStart: item.food_dateStart,
                      dateEnd: item.food_dateEnd,
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
                      {item.food_dateStart?.substring(5, 10)}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                      {translate(getDayNotFmt(item.food_dateStart).format("ddd"))}
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
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`${item.food_total_kcal_color}`}>
                          {numeral(item.food_total_kcal).format("0,0")}
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
                  <Grid size={2} className={"d-center"}>
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
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`${item.food_total_carb_color}`}>
                          {numeral(item.food_total_carb).format("0,0")}
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
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`${item.food_total_protein_color}`}>
                          {numeral(item.food_total_protein).format("0,0")}
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
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`${item.food_total_fat_color}`}>
                          {numeral(item.food_total_fat).format("0,0")}
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
                  navigate(SEND.toMoney, {
                    state: {
                      id: item._id,
                      dateType: item.money_dateType,
                      dateStart: item.money_dateStart,
                      dateEnd: item.money_dateEnd,
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
                      {item.money_dateStart?.substring(5, 10)}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                      {translate(getDayNotFmt(item.money_dateStart).format("ddd"))}
                    </Div>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={1} columns={12}>
                  {/** row 1 **/}
                  <Grid size={2} className={"d-center"}>
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
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`${item.money_total_income_color}`}>
                          {numeral(item.money_total_income).format("0,0")}
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
                  <Grid size={2} className={"d-center"}>
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
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`${item.money_total_expense_color}`}>
                          {numeral(item.money_total_expense).format("0,0")}
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
                  navigate(SEND.toSleep, {
                    state: {
                      id: item._id,
                      dateType: item.sleep_dateType,
                      dateStart: item.sleep_dateStart,
                      dateEnd: item.sleep_dateEnd,
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
                      {item.sleep_dateStart?.substring(5, 10)}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                      {translate(getDayNotFmt(item.sleep_dateStart).format("ddd"))}
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
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`${item.sleep_section[0]?.sleep_bedTime_color}`}>
                          {item.sleep_section[0]?.sleep_bedTime}
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
                  <Grid size={7} className={"d-row-right"}>
                    <Grid container spacing={1} columns={12}>
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`${item.sleep_section[0]?.sleep_wakeTime_color}`}>
                          {item.sleep_section[0]?.sleep_wakeTime}
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
                  <Grid size={7} className={"d-row-right"}>
                    <Grid container spacing={1} columns={12}>
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`${item.sleep_section[0]?.sleep_sleepTime_color}`}>
                          {item.sleep_section[0]?.sleep_sleepTime}
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
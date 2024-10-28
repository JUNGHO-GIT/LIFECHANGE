// TodayList.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate } from "@imports/ImportHooks";
import { useStorageSession, useStorageLocal } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { Exercise, Food, Money, Sleep } from "@imports/ImportSchemas";
import { axios, insertComma } from "@imports/ImportUtils";
import { Loading, Footer, Empty, Dialog } from "@imports/ImportLayouts";
import { Div, Hr, Br, Img, Icons } from "@imports/ImportComponents";
import { Paper, Grid, Card } from "@imports/ImportMuis";
import { Accordion, AccordionSummary, AccordionDetails } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const TodayList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_EXERCISE, URL_FOOD, URL_MONEY, URL_SLEEP } = useCommonValue();
  const { PATH, navigate, sessionId, localCurrency, localUnit } = useCommonValue();
  const { getDayFmt, getDayNotFmt } = useCommonDate();
  const { translate } = useLanguageStore();

  // 2-1. useStorageSession ------------------------------------------------------------------------
  const [DATE, setDATE] = useStorageSession(
    "date", PATH, "", {
      dateType: "day",
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

      // Accordion 초기값 설정
      // 이전 값이 있으면 유지하고 없으면 true로 설정
      setIsExpanded((prev: any) => ({
        exercise: Array(resExercise.data.result.length).fill(null).map((_, i) => ({
          expanded: prev?.exercise?.[i]?.expanded ?? true
        })),
        food: Array(resFood.data.result.length).fill(null).map((_, i) => ({
          expanded: prev?.food?.[i]?.expanded ?? true
        })),
        money: Array(resMoney.data.result.length).fill(null).map((_, i) => ({
          expanded: prev?.money?.[i]?.expanded ?? true
        })),
        sleep: Array(resSleep.data.result.length).fill(null).map((_, i) => ({
          expanded: prev?.sleep?.[i]?.expanded ?? true
        }))
      }));
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
      const listFragment = (item: any, i: number) => (
        <Grid container spacing={0} columns={12} className={"border-1 radius-1"} key={`list-${i}`}>
          <Grid size={12} className={"p-2"}>
            <Accordion expanded={isExpanded.exercise[i].expanded}>
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
                <Grid container spacing={2} columns={12}>
                  <Grid size={2} className={"d-row-center"}>
                    <Icons
                      key={"Search"}
                      name={"Search"}
                      className={"w-18 h-18"}
                    />
                  </Grid>
                  <Grid size={10} className={"d-row-left"}>
                    <Div className={"fs-1-0rem fw-600 black me-5"}>
                      {item.exercise_dateStart?.substring(5, 10)}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                      {translate(getDayNotFmt(item.exercise_dateStart).format("ddd"))}
                    </Div>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2} columns={12}>

                  {/** row 1 **/}
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
                    <Div className={"fs-0-9rem fw-600 dark ms-n15"}>
                      {translate("volume")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`${item.exercise_total_volume_color}`}>
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
                  {/** /.row 1 **/}

                  <Hr px={1} />

                  {/** row 2 **/}
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
                    <Div className={"fs-0-9rem fw-600 dark ms-n15"}>
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
                      <Grid size={2} className={"d-row-center"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/** /.row 2 **/}

                  <Hr px={1} />

                  {/** row 3 **/}
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
                    <Div className={"fs-0-9rem fw-600 dark ms-n15"}>
                      {translate("scale")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`${item.exercise_total_scale_color}`}>
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
                  {/** /.row 3 **/}

                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      );
      return (
        <Grid container spacing={0} columns={12}>
          {OBJECT_EXERCISE?.map((item: any, i: number) => (
            <Grid size={12} key={`list-${i}`}>
              {COUNT.exercise === 0 ? (
                <Empty DATE={DATE} extra={"exercise"} />
              ) : (
                listFragment(item, i)
              )}
            </Grid>
          ))}
        </Grid>
      );
    };
    // 7-2. food
    const foodSection = () => {
      const listFragment = (item: any, i: number) => (
        <Grid container spacing={0} columns={12} className={"border-1 radius-1"} key={`list-${i}`}>
          <Grid size={12} className={"p-2"}>
            <Accordion expanded={isExpanded.food[i].expanded}>
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
                <Grid container spacing={2} columns={12}>
                  <Grid size={2} className={"d-row-center"}>
                    <Icons
                      key={"Search"}
                      name={"Search"}
                      className={"w-18 h-18"}
                    />
                  </Grid>
                  <Grid size={10} className={"d-row-left"}>
                    <Div className={"fs-1-0rem fw-600 black me-5"}>
                      {item.food_dateStart?.substring(5, 10)}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                      {translate(getDayNotFmt(item.food_dateStart).format("ddd"))}
                    </Div>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2} columns={12}>

                  {/** row 1 **/}
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
                    <Div className={"fs-0-9rem fw-600 dark ms-n15"}>
                      {translate("kcal")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`${item.food_total_kcal_color}`}>
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
                  {/** /.row 1 **/}

                  <Hr px={1} />

                  {/** row 2 **/}
                  <Grid size={2} className={"d-center"}>
                    <Img
                      max={15}
                      hover={true}
                      shadow={false}
                      radius={false}
                      src={"food3"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-0-9rem fw-600 dark ms-n15"}>
                      {translate("carb")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`${item.food_total_carb_color}`}>
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
                  {/** /.row 2 **/}

                  <Hr px={1} />

                  {/** row 3 **/}
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
                    <Div className={"fs-0-9rem fw-600 dark ms-n15"}>
                      {translate("protein")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`${item.food_total_protein_color}`}>
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
                  {/** /.row 3 **/}

                  <Hr px={1} />

                  {/** row 4 **/}
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
                    <Div className={"fs-0-9rem fw-600 dark ms-n15"}>
                      {translate("fat")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`${item.food_total_fat_color}`}>
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
                  {/** /.row 3 **/}

                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      );
      return (
        <Grid container spacing={0} columns={12}>
          {OBJECT_FOOD?.map((item: any, i: number) => (
            <Grid size={12} key={`list-${i}`}>
              {COUNT.food === 0 ? (
                <Empty DATE={DATE} extra={"food"} />
              ) : (
                listFragment(item, i)
              )}
            </Grid>
          ))}
        </Grid>
      );
    };
    // 7-3. money
    const moneySection = () => {
      const listFragment = (item: any, i: number) => (
        <Grid container spacing={0} columns={12} className={"border-1 radius-1"} key={`list-${i}`}>
          <Grid size={12} className={"p-2"}>
            <Accordion expanded={isExpanded.money[i].expanded}>
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
                <Grid container spacing={2} columns={12}>
                  <Grid size={2} className={"d-row-center"}>
                    <Icons
                      key={"Search"}
                      name={"Search"}
                      className={"w-18 h-18"}
                    />
                  </Grid>
                  <Grid size={10} className={"d-row-left"}>
                    <Div className={"fs-1-0rem fw-600 black me-5"}>
                      {item.money_dateStart?.substring(5, 10)}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                      {translate(getDayNotFmt(item.money_dateStart).format("ddd"))}
                    </Div>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2} columns={12}>

                  {/** row 1 **/}
                  <Grid size={2} className={"d-center"}>
                    <Img
                      max={15}
                      hover={true}
                      shadow={false}
                      radius={false}
                      src={"money2"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-0-9rem fw-600 dark ms-n15"}>
                      {translate("income")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`${item.money_total_income_color}`}>
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
                  {/** /.row 1 **/}

                  <Hr px={1} />

                  {/** row 2 **/}
                  <Grid size={2} className={"d-center"}>
                    <Img
                      max={15}
                      hover={true}
                      shadow={false}
                      radius={false}
                      src={"money2"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-0-9rem fw-600 dark ms-n15"}>
                      {translate("expense")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`${item.money_total_expense_color}`}>
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
                  {/** /.row 3 **/}

                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      );
      return (
        <Grid container spacing={0} columns={12}>
          {OBJECT_MONEY?.map((item: any, i: number) => (
            <Grid size={12} key={`list-${i}`}>
              {COUNT.money === 0 ? (
                <Empty DATE={DATE} extra={"money"} />
              ) : (
                listFragment(item, i)
              )}
            </Grid>
          ))}
        </Grid>
      );
    };
    // 7-4. sleep
    const sleepSection = () => {
      const listFragment = (item: any, i: number) => (
        <Grid container spacing={0} columns={12} className={"border-1 radius-1"} key={`list-${i}`}>
          <Grid size={12} className={"p-2"}>
            <Accordion expanded={isExpanded.sleep[i].expanded}>
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
                <Grid container spacing={2} columns={12}>
                  <Grid size={2} className={"d-row-center"}>
                    <Icons
                      key={"Search"}
                      name={"Search"}
                      className={"w-18 h-18"}
                    />
                  </Grid>
                  <Grid size={10} className={"d-row-left"}>
                    <Div className={"fs-1-0rem fw-600 black me-5"}>
                      {item.sleep_dateStart?.substring(5, 10)}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                      {translate(getDayNotFmt(item.sleep_dateStart).format("ddd"))}
                    </Div>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2} columns={12}>

                  {/** row 1 **/}
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
                    <Div className={"fs-0-9rem fw-600 dark ms-n15"}>
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
                      <Grid size={2} className={"d-row-center"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/** /.row 1 **/}

                  <Hr px={1} />

                  {/** row 2 **/}
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
                    <Div className={"fs-0-9rem fw-600 dark ms-n15"}>
                      {translate("wakeTime")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`${item.sleep_section[0]?.sleep_wakeTime_color}`}>
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
                  {/** /.row 2 **/}

                  <Hr px={1} />

                  {/** row 3 **/}
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
                    <Div className={"fs-0-9rem fw-600 dark ms-n15"}>
                      {translate("sleepTime")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`${item.sleep_section[0]?.sleep_sleepTime_color}`}>
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
                  {/** /.row 3 **/}

                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      );
      return (
        <Grid container spacing={0} columns={12}>
          {OBJECT_SLEEP?.map((item: any, i: number) => (
            <Grid size={12} key={`list-${i}`}>
              {COUNT.sleep === 0 ? (
                <Empty DATE={DATE} extra={"sleep"} />
              ) : (
                listFragment(item, i)
              )}
            </Grid>
          ))}
        </Grid>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min75vh"}>
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-col-center"}>
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
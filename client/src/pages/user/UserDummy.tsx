// UserDummy.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useStorageLocal } from "@imports/ImportHooks";
import { useLanguageStore, useAlertStore } from "@imports/ImportStores";
import { ExerciseGoal, Exercise } from "@imports/ImportSchemas";
import { FoodGoal, Food } from "@imports/ImportSchemas";
import { MoneyGoal, Money } from "@imports/ImportSchemas";
import { SleepGoal, Sleep } from "@imports/ImportSchemas";
import { axios, numeral } from "@imports/ImportUtils";
import { Loading, Footer } from "@imports/ImportLayouts";
import { Div } from "@imports/ImportComponents";
import { Paper, TableContainer, Table, Grid } from "@imports/ImportMuis";
import { TableHead, TableBody, TableRow, TableCell } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const UserDummy = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, TITLE, navigate, sessionId } = useCommonValue();
  const { ALERT, setALERT } = useAlertStore();
  const { translate } = useLanguageStore();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [PART, setPART] = useState<string>("exerciseGoal");
  const [OBJECT_EXERCISE_GOAL, setOBJECT_EXERCISE_GOAL] = useState<any>([ExerciseGoal]);
  const [OBJECT_EXERCISE, setOBJECT_EXERCISE] = useState<any>([Exercise]);
  const [OBJECT_FOOD_GOAL, setOBJECT_FOOD_GOAL] = useState<any>([FoodGoal]);
  const [OBJECT_FOOD, setOBJECT_FOOD] = useState<any>([Food]);
  const [OBJECT_MONEY_GOAL, setOBJECT_MONEY_GOAL] = useState<any>([MoneyGoal]);
  const [OBJECT_MONEY, setOBJECT_MONEY] = useState<any>([Money]);
  const [OBJECT_SLEEP_GOAL, setOBJECT_SLEEP_GOAL] = useState<any>([SleepGoal]);
  const [OBJECT_SLEEP, setOBJECT_SLEEP] = useState<any>([Sleep]);
  const [PAGING, setPAGING] = useStorageLocal(
    `${TITLE}_paging_(${PATH})`, {
      sort: "asc",
      page: 1,
    }
  );
  const [COUNT, setCOUNT] = useState<any>({
    inputCnt: 0,
    totalCnt: 0,
    sectionCnt: 0
  });

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/dummyList`, {
      params: {
        user_id: sessionId,
        PAGING: PAGING,
        PART: PART,
      },
    })
    .then((res: any) => {
      if (PART === "exerciseGoal") {
        setOBJECT_EXERCISE_GOAL(res.data.result.length > 0 ? res.data.result : [ExerciseGoal]);
      }
      else if (PART === "exercise") {
        setOBJECT_EXERCISE(res.data.result.length > 0 ? res.data.result : [Exercise]);
      }
      else if (PART === "foodGoal") {
        setOBJECT_FOOD_GOAL(res.data.result.length > 0 ? res.data.result : [FoodGoal]);
      }
      else if (PART === "food") {
        setOBJECT_FOOD(res.data.result.length > 0 ? res.data.result : [Food]);
      }
      else if (PART === "moneyGoal") {
        setOBJECT_MONEY_GOAL(res.data.result.length > 0 ? res.data.result : [MoneyGoal]);
      }
      else if (PART === "money") {
        setOBJECT_MONEY(res.data.result.length > 0 ? res.data.result : [Money]);
      }
      else if (PART === "sleepGoal") {
        setOBJECT_SLEEP_GOAL(res.data.result.length > 0 ? res.data.result : [SleepGoal]);
      }
      else if (PART === "sleep") {
        setOBJECT_SLEEP(res.data.result.length > 0 ? res.data.result : [Sleep]);
      }
      setCOUNT((prev: any) => ({
        ...prev,
        totalCnt: res.data.totalCnt || 0,
        sectionCnt: res.data.sectionCnt || 0,
        newSectionCnt: res.data.sectionCnt || 0
      }));
    })
    .catch((err: any) => {
      setALERT({
        open: !ALERT.open,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [URL_OBJECT, sessionId, PAGING, PART]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowDummyDetail = async () => {
    setLOADING(true);
    const previousPART = PART;
    axios.post(`${URL_OBJECT}/dummyDetail`, {
      user_id: sessionId,
      PART: PART,
      count: COUNT?.inputCnt
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "success",
        });
        setCOUNT((prev: any) => ({
          ...prev,
          inputCnt: 0,
        }));
        setPAGING((prev: any) => ({
          ...prev,
          page: 1
        }));
        navigate("/user/dummy");
        // 저장 이후 PART 값을 복원
        setPART(previousPART);
      }
      else {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "error",
        });
      }
    })
    .catch((err: any) => {
      setALERT({
        open: !ALERT.open,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowDummyDelete = async () => {
    setLOADING(true);
    const previousPART = PART;
    axios.delete(`${URL_OBJECT}/dummyDelete`, {
      data: {
        user_id: sessionId,
        PART: PART,
      }
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "success",
        });
        setCOUNT((prev: any) => ({
          ...prev,
          inputCnt: 0,
        }));
        setPAGING((prev: any) => ({
          ...prev,
          page: 1
        }));
        navigate("/user/dummy");
        // 저장 이후 PART 값을 복원
        setPART(previousPART);
      }
      else {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "error",
        });
      }
    })
    .catch((err: any) => {
      setALERT({
        open: !ALERT.open,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  };

  // 6. userDummy ----------------------------------------------------------------------------------
  const userDummyNode = () => {
    // 7-0. empty
    const emptySection = () => (
      <Grid container spacing={2} columns={12} className={"border-1 radius-1 p-10"}>
        <Grid size={12}>
          {translate("empty")}
        </Grid>
      </Grid>
    );
    // 7-1. exerciseGoal
    const exerciseGoalSection = () => {
      const dummyFragment = () => (
        <Grid container spacing={2} columns={12}>
          <Grid size={12}>
            <TableContainer className={"border-1 radius-1"}>
              <Table>
                <TableHead className={"table-thead"}>
                  <TableRow className={"table-thead-tr"}>
                    <TableCell>{translate("date")}</TableCell>
                    <TableCell>{translate("exerciseCount")}</TableCell>
                    <TableCell>{translate("volume")}</TableCell>
                    <TableCell>{translate("cardio")}</TableCell>
                    <TableCell>{translate("weight")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={"table-tbody"}>
                  {OBJECT_EXERCISE_GOAL?.map((item: any, index: number) => (
                    <TableRow className={"table-tbody-tr border-top-1"} key={index}>
                      <TableCell>
                        {item.exercise_goal_dateStart === item.exercise_goal_dateEnd ? (
                          <>
                            <Div>{item.exercise_goal_dateStart?.substring(5, 10)}</Div>
                          </>
                        ) : (
                          <>
                            <Div>{item.exercise_goal_dateStart?.substring(5, 10)}</Div>
                            <Div className={"ms-3vw me-3vw"}> ~ </Div>
                            <Div>{item.exercise_goal_dateEnd?.substring(5, 10)}</Div>
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        {numeral(item.exercise_goal_count).format("0,0")}
                      </TableCell>
                      <TableCell>
                        {numeral(item.exercise_goal_volume).format("0,0")}
                      </TableCell>
                      <TableCell>
                        {item.exercise_goal_cardio}
                      </TableCell>
                      <TableCell>
                        {item.exercise_goal_weight}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      );
      return (
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-col-center"}>
            {COUNT.totalCnt === 0 ? emptySection() : dummyFragment()}
          </Grid>
        </Grid>
      );
    };
    // 7-2. exercise
    const exerciseSection = () => {
      const dummyFragment = () => (
        <Grid container spacing={2} columns={12}>
          <Grid size={12}>
            <TableContainer className={"border-1 radius-1"}>
              <Table>
                <TableHead className={"table-thead"}>
                  <TableRow className={"table-thead-tr"}>
                    <TableCell>{translate("date")}</TableCell>
                    <TableCell>{translate("volume")}</TableCell>
                    <TableCell>{translate("cardio")}</TableCell>
                    <TableCell>{translate("weight")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={"table-tbody"}>
                  {OBJECT_EXERCISE?.map((item: any, index: number) => (
                    <TableRow className={"table-tbody-tr border-top-1"} key={index}>
                      <TableCell>
                        {item.exercise_dateStart === item.exercise_dateEnd ? (
                          <>
                            <Div>{item.exercise_dateStart?.substring(5, 10)}</Div>
                          </>
                        ) : (
                          <>
                            <Div>{item.exercise_dateStart?.substring(5, 10)}</Div>
                            <Div className={"ms-3vw me-3vw"}> ~ </Div>
                            <Div>{item.exercise_dateEnd?.substring(5, 10)}</Div>
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        {numeral(item.exercise_total_volume).format("0,0")}
                      </TableCell>
                      <TableCell>
                        {item.exercise_total_cardio}
                      </TableCell>
                      <TableCell>
                        {item.exercise_total_weight}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      );
      return (
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-col-center"}>
            {COUNT.totalCnt === 0 ? emptySection() : dummyFragment()}
          </Grid>
        </Grid>
      );
    };
    // 7-3. foodGoal
    const foodGoalSection = () => {
      const dummyFragment = () => (
        <Grid container spacing={2} columns={12}>
          <Grid size={12}>
            <TableContainer className={"border-1 radius-1"}>
              <Table>
                <TableHead className={"table-thead"}>
                  <TableRow className={"table-thead-tr"}>
                    <TableCell>{translate("date")}</TableCell>
                    <TableCell>{translate("kcal")}</TableCell>
                    <TableCell>{translate("carb")}</TableCell>
                    <TableCell>{translate("protein")}</TableCell>
                    <TableCell>{translate("fat")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={"table-tbody"}>
                  {OBJECT_FOOD_GOAL?.map((item: any, index: number) => (
                    <TableRow className={"table-tbody-tr border-top-1"} key={index}>
                      <TableCell>
                        {item.food_goal_dateStart === item.food_goal_dateEnd ? (
                          <>
                            <Div>{item.food_goal_dateStart?.substring(5, 10)}</Div>
                          </>
                        ) : (
                          <>
                            <Div>{item.food_goal_dateStart?.substring(5, 10)}</Div>
                            <Div className={"ms-3vw me-3vw"}> ~ </Div>
                            <Div>{item.food_goal_dateEnd?.substring(5, 10)}</Div>
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        {numeral(item.food_goal_kcal).format("0,0")}
                      </TableCell>
                      <TableCell>
                        {numeral(item.food_goal_carb).format("0,0")}
                      </TableCell>
                      <TableCell>
                        {numeral(item.food_goal_protein).format("0,0")}
                      </TableCell>
                      <TableCell>
                        {numeral(item.food_goal_fat).format("0,0")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      );
      return (
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-col-center"}>
            {COUNT.totalCnt === 0 ? emptySection() : dummyFragment()}
          </Grid>
        </Grid>
      );
    };
    // 7-4. food
    const foodSection = () => {
      const dummyFragment = () => (
        <Grid container spacing={2} columns={12}>
          <Grid size={12}>
            <TableContainer className={"border-1 radius-1"}>
              <Table>
                <TableHead className={"table-thead"}>
                  <TableRow className={"table-thead-tr"}>
                    <TableCell>{translate("date")}</TableCell>
                    <TableCell>{translate("kcal")}</TableCell>
                    <TableCell>{translate("carb")}</TableCell>
                    <TableCell>{translate("protein")}</TableCell>
                    <TableCell>{translate("fat")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={"table-tbody"}>
                  {OBJECT_FOOD?.map((item: any, index: number) => (
                    <TableRow className={"table-tbody-tr border-top-1"} key={index}>
                      <TableCell>
                        {item.food_dateStart === item.food_dateEnd ? (
                          <>
                            <Div>{item.food_dateStart?.substring(5, 10)}</Div>
                          </>
                        ) : (
                          <>
                            <Div>{item.food_dateStart?.substring(5, 10)}</Div>
                            <Div className={"ms-3vw me-3vw"}> ~ </Div>
                            <Div>{item.food_dateEnd?.substring(5, 10)}</Div>
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        {numeral(item.food_total_kcal).format("0,0")}
                      </TableCell>
                      <TableCell>
                        {numeral(item.food_total_carb).format("0,0")}
                      </TableCell>
                      <TableCell>
                        {numeral(item.food_total_protein).format("0,0")}
                      </TableCell>
                      <TableCell>
                        {numeral(item.food_total_fat).format("0,0")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      );
      return (
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-col-center"}>
            {COUNT.totalCnt === 0 ? emptySection() : dummyFragment()}
          </Grid>
        </Grid>
      );
    };
    // 7-5. moneyGoal
    const moneyGoalSection = () => {
      const dummyFragment = () => (
        <Grid container spacing={2} columns={12}>
          <Grid size={12}>
            <TableContainer className={"border-1 radius-1"}>
              <Table>
                <TableHead className={"table-thead"}>
                  <TableRow className="table-thead-tr">
                    <TableCell>{translate("date")}</TableCell>
                    <TableCell>{translate("income")}</TableCell>
                    <TableCell>{translate("expense")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={"table-tbody"}>
                  {OBJECT_MONEY_GOAL?.map((item: any, index: number) => (
                    <TableRow className={"table-tbody-tr border-top-1"} key={index}>
                      <TableCell>
                        {item.money_goal_dateStart === item.money_goal_dateEnd ? (
                          <>
                            <Div>{item.money_goal_dateStart?.substring(5, 10)}</Div>
                          </>
                        ) : (
                          <>
                            <Div>{item.money_goal_dateStart?.substring(5, 10)}</Div>
                            <Div className={"ms-3vw me-3vw"}> ~ </Div>
                            <Div>{item.money_goal_dateEnd?.substring(5, 10)}</Div>
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        {numeral(item.money_goal_income).format("0,0")}
                      </TableCell>
                      <TableCell>
                        {numeral(item.money_goal_expense).format("0,0")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      );
      return (
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-col-center"}>
            {COUNT.totalCnt === 0 ? emptySection() : dummyFragment()}
          </Grid>
        </Grid>
      );
    };
    // 7-6. money
    const moneySection = () => {
      const dummyFragment = () => (
        <Grid container spacing={2} columns={12}>
          <Grid size={12}>
            <TableContainer className={"border-1 radius-1"}>
              <Table>
                <TableHead className={"table-thead"}>
                  <TableRow className={"table-thead-tr"}>
                    <TableCell>{translate("date")}</TableCell>
                    <TableCell>{translate("income")}</TableCell>
                    <TableCell>{translate("expense")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={"table-tbody"}>
                  {OBJECT_MONEY?.map((item: any, index: number) => (
                    <TableRow className={"table-tbody-tr border-top-1"} key={index}>
                      <TableCell>
                        {item.money_dateStart === item.money_dateEnd ? (
                          <>
                            <Div>{item.money_dateStart?.substring(5, 10)}</Div>
                          </>
                        ) : (
                          <>
                            <Div>{item.money_dateStart?.substring(5, 10)}</Div>
                            <Div className={"ms-3vw me-3vw"}> ~ </Div>
                            <Div>{item.money_dateEnd?.substring(5, 10)}</Div>
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        {numeral(item.money_total_income).format("0,0")}
                      </TableCell>
                      <TableCell>
                        {numeral(item.money_total_expense).format("0,0")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      );
      return (
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-col-center"}>
            {COUNT.totalCnt === 0 ? emptySection() : dummyFragment()}
          </Grid>
        </Grid>
      );
    };
    // 7-7. sleepGoal
    const sleepGoalSection = () => {
      const dummyFragment = () => (
        <Grid container spacing={2} columns={12}>
          <Grid size={12}>
            <TableContainer className={"border-1 radius-1"}>
              <Table>
                <TableHead className={"table-thead"}>
                  <TableRow className={"table-thead-tr"}>
                    <TableCell>{translate("date")}</TableCell>
                    <TableCell>{translate("bedTime")}</TableCell>
                    <TableCell>{translate("wakeTime")}</TableCell>
                    <TableCell>{translate("sleepTime")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={"table-tbody"}>
                  {OBJECT_SLEEP_GOAL?.map((item: any, index: number) => (
                    <TableRow className={"table-tbody-tr border-top-1"} key={index}>
                      <TableCell>
                        {item.sleep_goal_dateStart === item.sleep_goal_dateEnd ? (
                          <>
                            <Div>{item.sleep_goal_dateStart?.substring(5, 10)}</Div>
                          </>
                        ) : (
                          <>
                            <Div>{item.sleep_goal_dateStart?.substring(5, 10)}</Div>
                            <Div className={"ms-3vw me-3vw"}> ~ </Div>
                            <Div>{item.sleep_goal_dateEnd?.substring(5, 10)}</Div>
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.sleep_goal_bedTime}
                      </TableCell>
                      <TableCell>
                        {item.sleep_goal_wakeTime}
                      </TableCell>
                      <TableCell>
                        {item.sleep_goal_sleepTime}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      );
      return (
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-col-center"}>
            {COUNT.totalCnt === 0 ? emptySection() : dummyFragment()}
          </Grid>
        </Grid>
      );
    };
    // 7-8. sleep
    const sleepSection = () => {
      const dummyFragment = () => (
        <Grid container spacing={2} columns={12}>
          <Grid size={12}>
            <TableContainer className={"border-1 radius-1"}>
              <Table>
                <TableHead className={"table-thead"}>
                  <TableRow className={"table-thead-tr"}>
                    <TableCell>{translate("date")}</TableCell>
                    <TableCell>{translate("bedTime")}</TableCell>
                    <TableCell>{translate("wakeTime")}</TableCell>
                    <TableCell>{translate("sleepTime")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={"table-tbody"}>
                  {OBJECT_SLEEP?.map((item: any, index: number) => (
                    <TableRow className={"table-tbody-tr border-top-1"} key={index}>
                      <TableCell>
                        {item.sleep_dateStart === item.sleep_dateEnd ? (
                          <>
                            <Div>{item.sleep_dateStart?.substring(5, 10)}</Div>
                          </>
                        ) : (
                          <>
                            <Div>{item.sleep_dateStart?.substring(5, 10)}</Div>
                            <Div className={"ms-3vw me-3vw"}> ~ </Div>
                            <Div>{item.sleep_dateEnd?.substring(5, 10)}</Div>
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.sleep_section[0]?.sleep_bedTime}
                      </TableCell>
                      <TableCell>
                        {item.sleep_section[0]?.sleep_wakeTime}
                      </TableCell>
                      <TableCell>
                        {item.sleep_section[0]?.sleep_sleepTime}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      );
      return (
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-col-center"}>
            {COUNT.totalCnt === 0 ? emptySection() : dummyFragment()}
          </Grid>
        </Grid>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 shadow-1 h-min84vh"}>
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-col-center"}>
            {LOADING ? <Loading /> : (
              <>
                {PART === "exerciseGoal" && exerciseGoalSection()}
                {PART === "exercise" && exerciseSection()}
                {PART === "foodGoal" && foodGoalSection()}
                {PART === "food" && foodSection()}
                {PART === "moneyGoal" && moneyGoalSection()}
                {PART === "money" && moneySection()}
                {PART === "sleepGoal" && sleepGoalSection()}
                {PART === "sleep" && sleepSection()}
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 9. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      state={{
        PAGING, COUNT, PART
      }}
      setState={{
        setPAGING, setCOUNT, setPART
      }}
      flow={{
        flowDummyDetail, flowDummyDelete
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {userDummyNode()}
      {footerNode()}
    </>
  );
};
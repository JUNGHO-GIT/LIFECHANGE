// UserDummy.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {useTranslate, useStorage} from "../../import/ImportHooks.jsx";
import {Loading, Footer, Empty} from "../../import/ImportLayouts.jsx";
import {axios, numeral, moment} from "../../import/ImportLibs.jsx";
import {Div} from "../../import/ImportComponents.jsx";
import {Paper, TableContainer, Table, Card} from "../../import/ImportMuis.jsx";
import {TableHead, TableBody, TableRow, TableCell} from "../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const UserDummy = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL + SUBFIX;
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";
  const sessionId = sessionStorage.getItem("sessionId");

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState(false);
  const [PART, setPART] = useState("exerciseGoal");
  const [PAGING, setPAGING] = useStorage(
    `PAGING(${PATH})`, {
      sort: "asc",
      page: 1,
    }
  );
  const [COUNT, setCOUNT] = useState({
    inputCnt: 0,
    totalCnt: 0,
    sectionCnt: 0
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_EXERCISE_GOAL_DEF = [{
    _id: "",
    exercise_goal_number: 0,
    exercise_goal_dummy: "N",
    exercise_goal_dateStart: "0000-00-00",
    exercise_goal_dateEnd: "0000-00-00",
    exercise_goal_count: "",
    exercise_goal_cardio: "00:00",
    exercise_goal_volume: "",
    exercise_goal_weight: "",
  }];
  const OBJECT_EXERCISE_DEF = [{
    _id: "",
    exercise_number: 0,
    exercise_dummy: "N",
    exercise_dateType: "day",
    exercise_dateStart: "0000-00-00",
    exercise_dateEnd: "0000-00-00",
    exercise_total_volume: "",
    exercise_total_cardio: "00:00",
    exercise_body_weight: "",
    exercise_section: [{
      exercise_part_idx: 0,
      exercise_part_val: "all",
      exercise_title_idx: 0,
      exercise_title_val: "all",
      exercise_set: "",
      exercise_rep: "",
      exercise_kg: "",
      exercise_volume: "",
      exercise_cardio: "00:00",
    }],
  }];
  const OBJECT_FOOD_GOAL_DEF = [{
    _id: "",
    food_goal_number: 0,
    food_goal_dummy: "N",
    food_goal_dateType: "day",
    food_goal_dateStart: "0000-00-00",
    food_goal_dateEnd: "0000-00-00",
    food_goal_kcal: "",
    food_goal_carb: "",
    food_goal_protein: "",
    food_goal_fat: "",
  }];
  const OBJECT_FOOD_DEF = [{
    _id: "",
    food_number: 0,
    food_dummy: "N",
    food_dateType: "day",
    food_dateStart: "0000-00-00",
    food_dateEnd: "0000-00-00",
    food_total_kcal: "",
    food_total_fat: "",
    food_total_carb: "",
    food_total_protein: "",
    food_section: [{
      food_part_idx: 1,
      food_part_val: "breakfast",
      food_name: "",
      food_brand: "",
      food_count: "",
      food_serv: "회",
      food_gram: "",
      food_kcal: "",
      food_fat: "",
      food_carb: "",
      food_protein: "",
    }],
  }];
  const OBJECT_MONEY_GOAL_DEF = [{
    _id: "",
    money_goal_number: 0,
    money_goal_dummy: "N",
    money_goal_dateType: "day",
    money_goal_dateStart: "0000-00-00",
    money_goal_dateEnd: "0000-00-00",
    money_goal_income: "",
    money_goal_expense: "",
  }];
  const OBJECT_MONEY_DEF = [{
    _id: "",
    money_number: 0,
    money_dummy: "N",
    money_dateType: "day",
    money_dateStart: "0000-00-00",
    money_dateEnd: "0000-00-00",
    money_total_income: "",
    money_total_expense: "",
    money_section: [{
      money_part_idx: 0,
      money_part_val: "all",
      money_title_idx: 0,
      money_title_val: "all",
      money_amount: "",
      money_content: "",
    }],
  }];
  const OBJECT_SLEEP_GOAL_DEF = [{
    _id: "",
    sleep_goal_number: 0,
    sleep_goal_dummy: "N",
    sleep_goal_dateType: "day",
    sleep_goal_dateStart: "0000-00-00",
    sleep_goal_dateEnd: "0000-00-00",
    sleep_goal_bedTime: "00:00",
    sleep_goal_wakeTime: "00:00",
    sleep_goal_sleepTime: "00:00",
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
      sleep_wakeTime: "00:00",
      sleep_sleepTime: "00:00",
    }],
  }];
  const [OBJECT_EXERCISE_GOAL, setOBJECT_EXERCISE_GOAL] = useState(OBJECT_EXERCISE_GOAL_DEF);
  const [OBJECT_FOOD_GOAL, setOBJECT_FOOD_GOAL] = useState(OBJECT_FOOD_GOAL_DEF);
  const [OBJECT_MONEY_GOAL, setOBJECT_MONEY_GOAL] = useState(OBJECT_MONEY_GOAL_DEF);
  const [OBJECT_SLEEP_GOAL, setOBJECT_SLEEP_GOAL] = useState(OBJECT_SLEEP_GOAL_DEF);
  const [OBJECT_EXERCISE, setOBJECT_EXERCISE] = useState(OBJECT_EXERCISE_DEF);
  const [OBJECT_FOOD, setOBJECT_FOOD] = useState(OBJECT_FOOD_DEF);
  const [OBJECT_MONEY, setOBJECT_MONEY] = useState(OBJECT_MONEY_DEF);
  const [OBJECT_SLEEP, setOBJECT_SLEEP] = useState(OBJECT_SLEEP_DEF);

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
    .then((res) => {
      if (PART === "exerciseGoal") {
        setOBJECT_EXERCISE_GOAL(res.data.result || OBJECT_EXERCISE_GOAL_DEF);
      }
      else if (PART === "exercise") {
        setOBJECT_EXERCISE(res.data.result || OBJECT_EXERCISE_DEF);
      }
      else if (PART === "foodGoal") {
        setOBJECT_FOOD_GOAL(res.data.result || OBJECT_FOOD_GOAL_DEF);
      }
      else if (PART === "food") {
        setOBJECT_FOOD(res.data.result || OBJECT_FOOD_DEF);
      }
      else if (PART === "moneyGoal") {
        setOBJECT_MONEY_GOAL(res.data.result || OBJECT_MONEY_GOAL_DEF);
      }
      else if (PART === "money") {
        setOBJECT_MONEY(res.data.result || OBJECT_MONEY_DEF);
      }
      else if (PART === "sleepGoal") {
        setOBJECT_SLEEP_GOAL(res.data.result || OBJECT_SLEEP_GOAL_DEF);
      }
      else if (PART === "sleep") {
        setOBJECT_SLEEP(res.data.result || OBJECT_SLEEP_DEF);
      }
      setCOUNT((prev) => ({
        ...prev,
        totalCnt: res.data.totalCnt || 0,
        sectionCnt: res.data.sectionCnt || 0,
        newSectionCnt: res.data.sectionCnt || 0
      }));
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId, PAGING.sort, PAGING.page, PART]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowDummySave = async () => {
    const previousPART = PART;
    await axios.post(`${URL_OBJECT}/dummySave`, {
      user_id: sessionId,
      PART: PART,
      count: COUNT?.inputCnt
    })
    .then((res) => {
      if (res.data.status === "success") {
        alert(res.data.msg);
        setCOUNT((prev) => ({
          ...prev,
          inputCnt: 0,
        }));
        setPAGING((prev) => ({
          ...prev,
          page: 1
        }));
        navigate(0);
        // 저장 이후 PART 값을 복원
        setPART(previousPART);
      }
      else {
        alert(res.data.msg);
      }
    })
    .catch((err) => {
      console.error(err);
    })
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowDummyDeletes = async () => {
    const previousPART = PART;
    await axios.delete(`${URL_OBJECT}/dummyDeletes`, {
      data: {
        user_id: sessionId,
        PART: PART,
      }
    })
    .then((res) => {
      if (res.data.status === "success") {
        alert(res.data.msg);
        setCOUNT((prev) => ({
          ...prev,
          inputCnt: 0,
        }));
        setPAGING((prev) => ({
          ...prev,
          page: 1
        }));
        navigate(0);
        // 저장 이후 PART 값을 복원
        setPART(previousPART);
      }
      else {
        alert(res.data.msg);
      }
    })
    .catch((err) => {
      console.error(err);
    })
  };

  // 6. table --------------------------------------------------------------------------------------
  const tableNode = () => {
    // 7-1. table
    const tableSection = () => {
      const emptyFragment = () => (
        <Card className={"border radius shadow-none p-10"} key={"empty"}>
          <Div className={"d-center"}>
            {translate("empty")}
          </Div>
        </Card>
      );
      const tableFragment1 = (i) => (
        <Card className={"border radius shadow-none p-0"} key={i}>
          <TableContainer>
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
                {OBJECT_EXERCISE_GOAL?.map((item, index) => (
                  <TableRow className={"table-tbody-tr border-top"} key={index}>
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
                      {numeral(item.exercise_goal_weight).format("0,0")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      );
      const tableFragment2 = (i) => (
        <Card className={"border radius shadow-none p-0"} key={i}>
          <TableContainer>
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
                {OBJECT_EXERCISE?.map((item, index) => (
                  <TableRow className={"table-tbody-tr border-top"} key={index}>
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
                      {numeral(item.exercise_body_weight).format("0,0")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      );
      const tableFragment3 = (i) => (
        <Card className={"border radius shadow-none p-0"} key={i}>
          <TableContainer>
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
                {OBJECT_FOOD_GOAL?.map((item, index) => (
                  <TableRow className={"table-tbody-tr border-top"} key={index}>
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
        </Card>
      );
      const tableFragment4 = (i) => (
        <Card className={"border radius shadow-none p-0"} key={i}>
          <TableContainer>
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
                {OBJECT_FOOD?.map((item, index) => (
                  <TableRow className={"table-tbody-tr border-top"} key={index}>
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
        </Card>
      );
      const tableFragment5 = (i) => (
        <Card className={"border radius shadow-none p-0"} key={i}>
          <TableContainer>
            <Table>
              <TableHead className={"table-thead"}>
                <TableRow className="table-thead-tr">
                  <TableCell>{translate("date")}</TableCell>
                  <TableCell>{translate("income")}</TableCell>
                  <TableCell>{translate("expense")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={"table-tbody"}>
                {OBJECT_MONEY_GOAL?.map((item, index) => (
                  <TableRow className={"table-tbody-tr border-top"} key={index}>
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
        </Card>
      );
      const tableFragment6 = (i) => (
        <Card className={"border radius shadow-none p-0"} key={i}>
          <TableContainer>
            <Table>
              <TableHead className={"table-thead"}>
                <TableRow className={"table-thead-tr"}>
                  <TableCell>{translate("date")}</TableCell>
                  <TableCell>{translate("income")}</TableCell>
                  <TableCell>{translate("expense")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={"table-tbody"}>
                {OBJECT_MONEY?.map((item, index) => (
                  <TableRow className={"table-tbody-tr border-top"} key={index}>
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
        </Card>
      );
      const tableFragment7 = (i) => (
        <Card className={"border radius shadow-none p-0"} key={i}>
          <TableContainer>
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
                {OBJECT_SLEEP_GOAL?.map((item, index) => (
                  <TableRow className={"table-tbody-tr border-top"} key={index}>
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
        </Card>
      );
      const tableFragment8 = (i) => (
        <Card className={"border radius shadow-none p-0"} key={i}>
          <TableContainer>
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
                {OBJECT_SLEEP?.map((item, index) => (
                  <TableRow className={"table-tbody-tr border-top"} key={index}>
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
        </Card>
      );
      if (PART === "exerciseGoal") {
        return LOADING ? <Loading /> : (
          COUNT.totalCnt === 0 ? emptyFragment() : tableFragment1(0)
        );
      }
      else if (PART === "exercise") {
        return LOADING ? <Loading /> : (
          COUNT.totalCnt === 0 ? emptyFragment() : tableFragment2(0)
        );
      }
      else if (PART === "foodGoal") {
        return LOADING ? <Loading /> : (
          COUNT.totalCnt === 0 ? emptyFragment() : tableFragment3(0)
        );
      }
      else if (PART === "food") {
        return LOADING ? <Loading /> : (
          COUNT.totalCnt === 0 ? emptyFragment() : tableFragment4(0)
        );
      }
      else if (PART === "moneyGoal") {
        return LOADING ? <Loading /> : (
          COUNT.totalCnt === 0 ? emptyFragment() : tableFragment5(0)
        );
      }
      else if (PART === "money") {
        return LOADING ? <Loading /> : (
          COUNT.totalCnt === 0 ? emptyFragment() : tableFragment6(0)
        );
      }
      else if (PART === "sleepGoal") {
        return LOADING ? <Loading /> : (
          COUNT.totalCnt === 0 ? emptyFragment() : tableFragment7(0)
        );
      }
      else if (PART === "sleep") {
        return LOADING ? <Loading /> : (
          COUNT.totalCnt === 0 ? emptyFragment() : tableFragment8(0)
        );
      }
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border shadow-none pb-50"}>
        <Div className={"block-wrapper h-min75vh"}>
          {tableSection()}
        </Div>
      </Paper>
    );
  };

  // 9. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      strings={{
        first: firstStr,
        second: secondStr,
        third: thirdStr,
      }}
      objects={{
        PAGING, COUNT, PART
      }}
      functions={{
        setPAGING, setCOUNT, setPART
      }}
      handlers={{
        navigate, flowDummySave, flowDummyDeletes
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {tableNode()}
      {footerNode()}
    </>
  );
};
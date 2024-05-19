// UserDataList.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {useStorage, useTranslate} from "../../../import/ImportHooks.jsx";
import {axios, numeral} from "../../../import/ImportLibs.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {Div} from "../../../import/ImportComponents.jsx";
import {Paper} from "../../../import/ImportMuis.jsx";
import {TableContainer, Table, Link} from "../../../import/ImportMuis.jsx";
import {TableHead, TableBody, TableRow, TableCell} from "../../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const UserDataList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const navigate = useNavigate();
  const location = useLocation();
  const PATH = location?.pathname.trim().toString();
  const firstStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const secondStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
  const thirdStr = PATH?.split("/")[3] ? PATH?.split("/")[3] : "";

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:FILTER, set:setFILTER} = useStorage(
    `FILTER(${PATH})`, {
      order: "asc",
      type: "day"
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [sessionId, setSessionId] = useState(sessionStorage.getItem("sessionId") || "{}");
  const [LOADING, setLOADING] = useState(true);
  const [PART, setPART] = useState("exercisePlan");
  const [PAGING, setPAGING] = useState({
    page: 1,
    limit: 10
  });
  const [COUNT, setCOUNT] = useState({
    inputCnt: 0,
    totalCnt: 0,
    sectionCnt: 0
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_EXERCISE_PLAN_DEF = [{
    exercise_plan_startDt: "0000-00-00",
    exercise_plan_endDt: "0000-00-00",
    exercise_plan_count: 0,
    exercise_plan_cardio: "00:00",
    exercise_plan_volume: 0,
    exercise_plan_weight: 0,
  }];
  const OBJECT_EXERCISE_DEF = [{
    _id: "",
    exercise_number: 0,
    exercise_startDt: "0000-00-00",
    exercise_endDt: "0000-00-00",
    exercise_total_volume: 0,
    exercise_total_cardio: "00:00",
    exercise_body_weight: 0,
    exercise_section: [{
      exercise_part_idx: 0,
      exercise_part_val: "전체",
      exercise_title_idx: 0,
      exercise_title_val: "전체",
      exercise_set: 0,
      exercise_rep: 0,
      exercise_kg: 0,
      exercise_volume: 0,
      exercise_cardio: "00:00",
    }],
  }];
  const OBJECT_FOOD_PLAN_DEF = [{
    food_plan_startDt: "0000-00-00",
    food_plan_endDt: "0000-00-00",
    food_plan_kcal: 0,
    food_plan_carb: 0,
    food_plan_protein: 0,
    food_plan_fat: 0,
  }];
  const OBJECT_FOOD_DEF = [{
    _id: "",
    food_number: 0,
    food_startDt: "0000-00-00",
    food_endDt: "0000-00-00",
    food_total_kcal: 0,
    food_total_fat: 0,
    food_total_carb: 0,
    food_total_protein: 0,
    food_section: [{
      food_part_idx: 1,
      food_part_val: "아침",
      food_title: "",
      food_count: 0,
      food_serv: "회",
      food_gram:  0,
      food_kcal: 0,
      food_fat: 0,
      food_carb: 0,
      food_protein: 0,
    }],
  }];
  const OBJECT_MONEY_PLAN_DEF = [{
    money_plan_startDt: "0000-00-00",
    money_plan_endDt: "0000-00-00",
    money_plan_in: 0,
    money_plan_out: 0,
  }];
  const OBJECT_MONEY_DEF = [{
    _id: "",
    money_number: 0,
    money_startDt: "0000-00-00",
    money_endDt: "0000-00-00",
    money_total_in: 0,
    money_total_out: 0,
    money_section: [{
      money_part_idx: 0,
      money_part_val: "전체",
      money_title_idx: 0,
      money_title_val: "전체",
      money_amount: 0,
      money_content: "",
    }],
  }];
  const OBJECT_SLEEP_PLAN_DEF = [{
    sleep_plan_startDt: "0000-00-00",
    sleep_plan_endDt: "0000-00-00",
    sleep_plan_night: "00:00",
    sleep_plan_morning: "00:00",
    sleep_plan_time: "00:00",
  }];
  const OBJECT_SLEEP_DEF = [{
    _id: "",
    sleep_number: 0,
    sleep_startDt: "0000-00-00",
    sleep_endDt: "0000-00-00",
    sleep_section: [{
      sleep_night: "00:00",
      sleep_morning: "00:00",
      sleep_time: "00:00",
    }],
  }];
  const [OBJECT_EXERCISE_PLAN, setOBJECT_EXERCISE_PLAN] = useState(OBJECT_EXERCISE_PLAN_DEF);
  const [OBJECT_FOOD_PLAN, setOBJECT_FOOD_PLAN] = useState(OBJECT_FOOD_PLAN_DEF);
  const [OBJECT_MONEY_PLAN, setOBJECT_MONEY_PLAN] = useState(OBJECT_MONEY_PLAN_DEF);
  const [OBJECT_SLEEP_PLAN, setOBJECT_SLEEP_PLAN] = useState(OBJECT_SLEEP_PLAN_DEF);
  const [OBJECT_EXERCISE, setOBJECT_EXERCISE] = useState(OBJECT_EXERCISE_DEF);
  const [OBJECT_FOOD, setOBJECT_FOOD] = useState(OBJECT_FOOD_DEF);
  const [OBJECT_MONEY, setOBJECT_MONEY] = useState(OBJECT_MONEY_DEF);
  const [OBJECT_SLEEP, setOBJECT_SLEEP] = useState(OBJECT_SLEEP_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/data/list`, {
      params: {
        user_id: sessionId,
        FILTER: FILTER,
        PAGING: PAGING,
        PART: PART
      }
    });
    if (PART === "exercisePlan") {
      setOBJECT_EXERCISE_PLAN(res.data.result || OBJECT_EXERCISE_PLAN_DEF);
    }
    else if (PART === "exercise") {
      setOBJECT_EXERCISE(res.data.result || OBJECT_EXERCISE_DEF);
    }
    else if (PART === "foodPlan") {
      setOBJECT_FOOD_PLAN(res.data.result || OBJECT_FOOD_PLAN_DEF);
    }
    else if (PART === "food") {
      setOBJECT_FOOD(res.data.result || OBJECT_FOOD_DEF);
    }
    else if (PART === "moneyPlan") {
      setOBJECT_MONEY_PLAN(res.data.result || OBJECT_MONEY_PLAN_DEF);
    }
    else if (PART === "money") {
      setOBJECT_MONEY(res.data.result || OBJECT_MONEY_DEF);
    }
    else if (PART === "sleepPlan") {
      setOBJECT_SLEEP_PLAN(res.data.result || OBJECT_SLEEP_PLAN_DEF);
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
    setLOADING(false);
  })()}, [
    sessionId,
    FILTER.order, FILTER.partIdx, FILTER.titleIdx,
    PAGING.page, PAGING.limit,
    PART
  ]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async (type_param) => {
    const res = await axios.post(`${URL_OBJECT}/data/save`, {
      user_id: sessionId,
      PART: type_param,
      count: COUNT?.inputCnt
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      setCOUNT((prev) => ({
        ...prev,
        [`${type_param}Cnt`]: prev[`${type_param}Cnt`] + 1
      }));
      setPAGING((prev) => ({
        ...prev,
        page: 1
      }));
      navigate("/user/data/list");
    }
  };

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (type_param) => {
    const res = await axios.delete(`${URL_OBJECT}/data/deletes`, {
      params: {
        user_id: sessionId,
        PART: type_param
      }
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      setCOUNT((prev) => ({
        ...prev,
        [`${type_param}Cnt`]: 0
      }));
      setPAGING((prev) => ({
        ...prev,
        page: 1
      }));
      navigate("/user/list");
    }
  };

  // 6. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-6-1-1. table
    const tableFragment1Empty = () => (
      <TableContainer key={"empty"} className={"border radius"}>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>날짜</TableCell>
              <TableCell>횟수</TableCell>
              <TableCell>볼륨</TableCell>
              <TableCell>유산소</TableCell>
              <TableCell>체중</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            <TableRow className={"table-tbody-tr"}>
              <TableCell colSpan={5}>
                데이터가 없습니다.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-6-1-2. table
    const tableFragment1 = (i) => (
      <TableContainer key={i} className={"border radius"}>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>날짜</TableCell>
              <TableCell>횟수</TableCell>
              <TableCell>볼륨</TableCell>
              <TableCell>유산소</TableCell>
              <TableCell>체중</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            {OBJECT_EXERCISE_PLAN?.map((item, index) => (
              <>
              <TableRow className={"table-tbody-tr"} key={`date-${index}`}>
                <TableCell rowSpan={2}>
                  <Div>{item.exercise_plan_startDt?.substring(5, 10)}</Div>
                  <Div>~</Div>
                  <Div>{item.exercise_plan_endDt?.substring(5, 10)}</Div>
                </TableCell>
              </TableRow>
              <TableRow className={"table-tbody-tr"} key={`plan-${index}`}>
                <TableCell>
                  {`${numeral(item.exercise_plan_count).format("0,0")} 회`}
                </TableCell>
                <TableCell>
                  {`${numeral(item.exercise_plan_volume).format("0,0")} vol`}
                </TableCell>
                <TableCell>
                  {item.exercise_plan_cardio}
                </TableCell>
                <TableCell>
                  {`${numeral(item.exercise_plan_weight).format("0,0")} kg`}
                </TableCell>
              </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-6-2-1. table
    const tableFragment2Empty = () => (
      <TableContainer key={"empty"} className={"border radius"}>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>날짜</TableCell>
              <TableCell>볼륨</TableCell>
              <TableCell>유산소</TableCell>
              <TableCell>체중</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            <TableRow className={"table-tbody-tr"}>
              <TableCell colSpan={4}>
                데이터가 없습니다.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-6-2-2. table
    const tableFragment2 = (i) => (
      <TableContainer key={i} className={"border radius"}>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>날짜</TableCell>
              <TableCell>볼륨</TableCell>
              <TableCell>유산소</TableCell>
              <TableCell>체중</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            {OBJECT_EXERCISE?.map((item, index) => (
              <>
              <TableRow className={"table-tbody-tr"} key={`date-${index}`}>
                <TableCell rowSpan={2}>
                  {item.exercise_startDt?.substring(5, 10)}
                </TableCell>
              </TableRow>
              <TableRow className={"table-tbody-tr"} key={`real-${index}`}>
                <TableCell>
                  {`${numeral(item.exercise_total_volume).format("0,0")} vol`}
                </TableCell>
                <TableCell>
                  {item.exercise_total_cardio}
                </TableCell>
                <TableCell>
                  {`${numeral(item.exercise_body_weight).format("0,0")} kg`}
                </TableCell>
              </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-6-3-1. table
    const tableFragment3Empty = () => (
      <TableContainer key={"empty"} className={"border radius"}>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>날짜</TableCell>
              <TableCell>Kcal</TableCell>
              <TableCell>Carb</TableCell>
              <TableCell>Protein</TableCell>
              <TableCell>Fat</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            <TableRow className={"table-tbody-tr"}>
              <TableCell colSpan={5}>
                데이터가 없습니다.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-6-3-2. table
    const tableFragment3 = (i) => (
      <TableContainer key={i} className={"border radius"}>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>날짜</TableCell>
              <TableCell>Kcal</TableCell>
              <TableCell>Carb</TableCell>
              <TableCell>Protein</TableCell>
              <TableCell>Fat</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            {OBJECT_FOOD_PLAN?.map((item, index) => (
              <>
              <TableRow className={"table-tbody-tr"} key={`date-${index}`}>
                <TableCell rowSpan={2}>
                  <Div>{item.food_plan_startDt?.substring(5, 10)}</Div>
                  <Div>~</Div>
                  <Div>{item.food_plan_endDt?.substring(5, 10)}</Div>
                </TableCell>
              </TableRow>
              <TableRow className={"table-tbody-tr"} key={`plan-${index}`}>
                <TableCell>
                  {`${numeral(item.food_plan_kcal).format('0,0')} kcal`}
                </TableCell>
                <TableCell>
                  {`${numeral(item.food_plan_carb).format('0,0')} g`}
                </TableCell>
                <TableCell>
                  {`${numeral(item.food_plan_protein).format('0,0')} g`}
                </TableCell>
                <TableCell>
                  {`${numeral(item.food_plan_fat).format('0,0')} g`}
                </TableCell>
              </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-6-4-1. table
    const tableFragment4Empty = () => (
      <TableContainer key={"empty"} className={"border radius"}>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>날짜</TableCell>
              <TableCell>Kcal</TableCell>
              <TableCell>Carb</TableCell>
              <TableCell>Protein</TableCell>
              <TableCell>Fat</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            <TableRow className={"table-tbody-tr"}>
              <TableCell colSpan={5}>
                데이터가 없습니다.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-6-4-2. table
    const tableFragment4 = (i) => (
      <TableContainer key={i} className={"border radius"}>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>날짜</TableCell>
              <TableCell>Kcal</TableCell>
              <TableCell>Carb</TableCell>
              <TableCell>Protein</TableCell>
              <TableCell>Fat</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            {OBJECT_FOOD?.map((item, index) => (
              <>
              <TableRow className={"table-tbody-tr"} key={`date-${index}`}>
                <TableCell rowSpan={2}>
                  {item.food_startDt?.substring(5, 10)}
                </TableCell>
              </TableRow>
              <TableRow className={"table-tbody-tr"} key={`real-${index}`}>
                <TableCell>
                  {`${numeral(item.food_total_kcal).format("0,0")} kcal`}
                </TableCell>
                <TableCell>
                  {`${numeral(item.food_total_carb).format("0,0")} g`}
                </TableCell>
                <TableCell>
                  {`${numeral(item.food_total_protein).format("0,0")} g`}
                </TableCell>
                <TableCell>
                  {`${numeral(item.food_total_fat).format("0,0")} g`}
                </TableCell>
              </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-6-5-1. table
    const tableFragment5Empty = () => (
      <TableContainer key={"empty"} className={"border radius"}>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>날짜</TableCell>
              <TableCell>수입</TableCell>
              <TableCell>지출</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            <TableRow className={"table-tbody-tr"}>
              <TableCell colSpan={3}>
                데이터가 없습니다.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-6-5-2. table
    const tableFragment5 = (i) => (
      <TableContainer key={i} className={"border radius"}>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className="table-thead-tr">
              <TableCell>날짜</TableCell>
              <TableCell>수입</TableCell>
              <TableCell>지출</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            {OBJECT_MONEY_PLAN?.map((item, index) => (
              <>
              <TableRow className={"table-tbody-tr"} key={`date-${index}`}>
                <TableCell rowSpan={2}>
                  <Div>{item.money_plan_startDt?.substring(5, 10)}</Div>
                  <Div>~</Div>
                  <Div>{item.money_plan_endDt?.substring(5, 10)}</Div>
                </TableCell>
              </TableRow>
              <TableRow className={"table-tbody-tr"} key={`plan-${index}`}>
                <TableCell>
                  {`₩ ${numeral(item.money_plan_in).format("0,0")}`}
                </TableCell>
                <TableCell>
                  {`₩ ${numeral(item.money_plan_out).format("0,0")}`}
                </TableCell>
              </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-6-6-1. table
    const tableFragment6Empty = () => (
      <TableContainer key={"empty"} className={"border radius"}>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>날짜</TableCell>
              <TableCell>수입</TableCell>
              <TableCell>지출</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            <TableRow className={"table-tbody-tr"}>
              <TableCell colSpan={3}>
                데이터가 없습니다.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-6-6-2. table
    const tableFragment6 = (i) => (
      <TableContainer key={i} className={"border radius"}>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>날짜</TableCell>
              <TableCell>수입</TableCell>
              <TableCell>지출</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            {OBJECT_MONEY?.map((item, index) => (
              <>
              <TableRow className={"table-tbody-tr"} key={`date-${index}`}>
                <TableCell rowSpan={2}>
                  {item.money_startDt?.substring(5, 10)}
                </TableCell>
              </TableRow>
              <TableRow className={"table-tbody-tr"} key={`real-${index}`}>
                <TableCell>
                  {`₩ ${numeral(item.money_total_in).format('0,0')}`}
                </TableCell>
                <TableCell>
                  {`₩ ${numeral(item.money_total_out).format('0,0')}`}
                </TableCell>
              </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-6-7-1. table
    const tableFragment7Empty = () => (
      <TableContainer key={"empty"} className={"border radius"}>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>날짜</TableCell>
              <TableCell>취침</TableCell>
              <TableCell>기상</TableCell>
              <TableCell>수면</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            <TableRow className={"table-tbody-tr"}>
              <TableCell colSpan={4}>
                데이터가 없습니다.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-6-7-2. table
    const tableFragment7 = (i) => (
      <TableContainer key={i} className={"border radius"}>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>날짜</TableCell>
              <TableCell>취침</TableCell>
              <TableCell>기상</TableCell>
              <TableCell>수면</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody-tr"}>
            {OBJECT_SLEEP_PLAN?.map((item, index) => (
              <>
              <TableRow className={"table-tbody-tr"} key={`date-${index}`}>
                <TableCell rowSpan={2}>
                  <Div>{item.sleep_plan_startDt?.substring(5, 10)}</Div>
                  <Div>~</Div>
                  <Div>{item.sleep_plan_endDt?.substring(5, 10)}</Div>
                </TableCell>
              </TableRow>
              <TableRow className={"table-tbody-tr"} key={`plan-${index}`}>
                <TableCell>
                  {item.sleep_plan_night}
                </TableCell>
                <TableCell>
                  {item.sleep_plan_morning}
                </TableCell>
                <TableCell>
                  {item.sleep_plan_time}
                </TableCell>
              </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-6-8-1. table
    const tableFragment8Empty = () => (
      <TableContainer key={"empty"} className={"border radius"}>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>날짜</TableCell>
              <TableCell>취침</TableCell>
              <TableCell>기상</TableCell>
              <TableCell>수면</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            <TableRow className={"table-tbody-tr"}>
              <TableCell colSpan={4}>
                데이터가 없습니다.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-6-8-2. table
    const tableFragment8 = (i) => (
      <TableContainer key={i} className={"border radius"}>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>날짜</TableCell>
              <TableCell>취침</TableCell>
              <TableCell>기상</TableCell>
              <TableCell>수면</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            {OBJECT_SLEEP?.map((item, index) => (
              <>
              <TableRow className={"table-tbody-tr"} key={`date-${index}`}>
                <TableCell rowSpan={2}>
                  {item.sleep_startDt?.substring(5, 10)}
                </TableCell>
              </TableRow>
              <TableRow className={"table-tbody-tr"} key={`real-${index}`}>
                <TableCell>
                  {item.sleep_section[0]?.sleep_night}
                </TableCell>
                <TableCell>
                  {item.sleep_section[0]?.sleep_morning}
                </TableCell>
                <TableCell>
                  {item.sleep_section[0]?.sleep_time}
                </TableCell>
              </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-6-3. table
    const tableSection = () => (
      <Div className={"block-wrapper w-min90vw h-min67vh"}>
        <Div className={"d-column"}>
          {PART === "exercisePlan" && (
            COUNT.totalCnt === 0 ? tableFragment1Empty() : tableFragment1(0)
          )}
          {PART === "exercise" && (
            COUNT.totalCnt === 0 ? tableFragment2Empty() : tableFragment2(0)
          )}
          {PART === "foodPlan" && (
            COUNT.totalCnt === 0 ? tableFragment3Empty() : tableFragment3(0)
          )}
          {PART === "food" && (
            COUNT.totalCnt === 0 ? tableFragment4Empty() : tableFragment4(0)
          )}
          {PART === "moneyPlan" && (
            COUNT.totalCnt === 0 ? tableFragment5Empty() : tableFragment5(0)
          )}
          {PART === "money" && (
            COUNT.totalCnt === 0 ? tableFragment6Empty() : tableFragment6(0)
          )}
          {PART === "sleepPlan" && (
            COUNT.totalCnt === 0 ? tableFragment7Empty() : tableFragment7(0)
          )}
          {PART === "sleep" && (
            COUNT.totalCnt === 0 ? tableFragment8Empty() : tableFragment8(0)
          )}
        </Div>
      </Div>
    );
    // 7-7. return
    return (
      <Paper className={"content-wrapper"}>
        {tableSection()}
      </Paper>
    );
  };

  // 8. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading
      LOADING={LOADING}
      setLOADING={setLOADING}
    />
  );

  // 9. footer ------------------------------------------------------------------------------------>
  const footerNode = () => (
    <Footer
      strings={{
        first: firstStr,
        second: secondStr,
        third: thirdStr,
      }}
      objects={{
        FILTER, PAGING, COUNT, PART
      }}
      functions={{
        setFILTER, setPAGING, setCOUNT, setPART
      }}
      handlers={{
        navigate, flowSave, flowDelete
      }}
    />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {LOADING ? loadingNode() : tableNode()}
      {footerNode()}
    </>
  );
};
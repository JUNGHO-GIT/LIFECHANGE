// UserDataList.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {useCallback, useRef} from "../../../import/ImportReacts.jsx";
import {useStorage, useTranslate} from "../../../import/ImportHooks.jsx";
import {axios, numeral} from "../../../import/ImportLibs.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {Div} from "../../../import/ImportComponents.jsx";
import {Paper, TableContainer, Table, Card, Skeleton} from "../../../import/ImportMuis.jsx";
import {TableHead, TableBody, TableRow, TableCell} from "../../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const UserDataList = () => {

  // 1. common ------------------------------------------------------------------------------------>
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

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:FILTER, set:setFILTER} = useStorage(
    `FILTER(${PATH})`, {
      order: "asc",
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
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
  /** @type {React.MutableRefObject<IntersectionObserver|null>} **/
  const observer = useRef(null);
  const [LOADING, setLOADING] = useState(false);
  const [MORE, setMORE] = useState(true);
  const sessionId = sessionStorage.getItem("sessionId");

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_EXERCISE_PLAN_DEF = [{
    _id: "",
    exercise_plan_number: 0,
    exercise_plan_demo: false,
    exercise_plan_dateType: "",
    exercise_plan_dateStart: "0000-00-00",
    exercise_plan_dateEnd: "0000-00-00",
    exercise_plan_count: 0,
    exercise_plan_cardio: "00:00",
    exercise_plan_volume: 0,
    exercise_plan_weight: 0,
  }];
  const OBJECT_EXERCISE_DEF = [{
    _id: "",
    exercise_number: 0,
    exercise_demo: false,
    exercise_dateType: "",
    exercise_dateStart: "0000-00-00",
    exercise_dateEnd: "0000-00-00",
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
    _id: "",
    food_plan_number: 0,
    food_plan_demo: false,
    food_plan_dateType: "",
    food_plan_dateStart: "0000-00-00",
    food_plan_dateEnd: "0000-00-00",
    food_plan_kcal: 0,
    food_plan_carb: 0,
    food_plan_protein: 0,
    food_plan_fat: 0,
  }];
  const OBJECT_FOOD_DEF = [{
    _id: "",
    food_number: 0,
    food_demo: false,
    food_dateType: "",
    food_dateStart: "0000-00-00",
    food_dateEnd: "0000-00-00",
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
    _id: "",
    money_plan_number: 0,
    money_plan_demo: false,
    money_plan_dateType: "",
    money_plan_dateStart: "0000-00-00",
    money_plan_dateEnd: "0000-00-00",
    money_plan_in: 0,
    money_plan_out: 0,
  }];
  const OBJECT_MONEY_DEF = [{
    _id: "",
    money_number: 0,
    money_demo: false,
    money_dateType: "",
    money_dateStart: "0000-00-00",
    money_dateEnd: "0000-00-00",
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
    _id: "",
    sleep_plan_number: 0,
    sleep_plan_demo: false,
    sleep_plan_dateType: "",
    sleep_plan_dateStart: "0000-00-00",
    sleep_plan_dateEnd: "0000-00-00",
    sleep_plan_night: "00:00",
    sleep_plan_morning: "00:00",
    sleep_plan_time: "00:00",
  }];
  const OBJECT_SLEEP_DEF = [{
    _id: "",
    sleep_number: 0,
    sleep_demo: false,
    sleep_dateType: "",
    sleep_dateStart: "0000-00-00",
    sleep_dateEnd: "0000-00-00",
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
  useEffect(() => {
    loadMoreData();
  }, []);

  // 2-4. useCallback ----------------------------------------------------------------------------->
  const loadMoreData = useCallback(async () => {
    if (LOADING || !MORE) {
      return;
    }
    setLOADING(true);
    const res = await axios.get(`${URL_OBJECT}/data/list`, {
      params: {
        user_id: sessionId,
        FILTER: FILTER,
        PAGING: PAGING,
        PART: PART
      },
    });
    if (PART === "exercisePlan") {
      // 첫번째 객체를 제외하고 데이터 추가
      setOBJECT_EXERCISE_PLAN((prev) => {
        if (prev.length === 1 && prev[0]._id === "") {
          return [...res.data.result];
        }
        else {
          return [...prev, ...res.data.result];
        }
      });
    }
    else if (PART === "exercise") {
      setOBJECT_EXERCISE((prev) => {
        if (prev.length === 1 && prev[0]._id === "") {
          return [...res.data.result];
        }
        else {
          return [...prev, ...res.data.result];
        }
      });
    }
    else if (PART === "foodPlan") {
      setOBJECT_FOOD_PLAN((prev) => {
        if (prev.length === 1 && prev[0]._id === "") {
          return [...res.data.result];
        }
        else {
          return [...prev, ...res.data.result];
        }
      });
    }
    else if (PART === "food") {
      setOBJECT_FOOD((prev) => {
        if (prev.length === 1 && prev[0]._id === "") {
          return [...res.data.result];
        }
        else {
          return [...prev, ...res.data.result];
        }
      });
    }
    else if (PART === "moneyPlan") {
      setOBJECT_MONEY_PLAN((prev) => {
        if (prev.length === 1 && prev[0]._id === "") {
          return [...res.data.result];
        }
        else {
          return [...prev, ...res.data.result];
        }
      });
    }
    else if (PART === "money") {
      setOBJECT_MONEY((prev) => {
        if (prev.length === 1 && prev[0]._id === "") {
          return [...res.data.result];
        }
        else {
          return [...prev, ...res.data.result];
        }
      });
    }
    else if (PART === "sleepPlan") {
      setOBJECT_SLEEP_PLAN((prev) => {
        if (prev.length === 1 && prev[0]._id === "") {
          return [...res.data.result];
        }
        else {
          return [...prev, ...res.data.result];
        }
      });
    }
    else if (PART === "sleep") {
      setOBJECT_SLEEP((prev) => {
        if (prev.length === 1 && prev[0]._id === "") {
          return [...res.data.result];
        }
        else {
          return [...prev, ...res.data.result];
        }
      });
    }
    setCOUNT((prev={}) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0,
      newSectionCnt: res.data.sectionCnt || 0
    }));
    if (res.data.result.length < PAGING.limit) {
      setMORE(false);
    }
    setPAGING((prev={}) => ({
      ...prev,
      page: prev.page + 1
    }));
    setLOADING(false);
  }, [
    sessionId, MORE, PART,
    FILTER.order, FILTER.partIdx, FILTER.titleIdx,
    PAGING.page, PAGING.limit
  ]);

  // 2-4. useCallback ----------------------------------------------------------------------------->
  const lastRowRef = useCallback((node) => {
    if (LOADING || !MORE) {
      return;
    }
    if (observer.current) {
      observer.current.disconnect();
    }
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && MORE) {
        loadMoreData();
      }
    });
    if (node) {
      observer.current.observe(node);
    }
  }, [LOADING, MORE]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async (type_param) => {
    const res = await axios.post(`${URL_OBJECT}/data/save`, {
      user_id: sessionId,
      PART: type_param,
      count: COUNT?.inputCnt
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      setCOUNT((prev={}) => ({
        ...prev,
        [`${type_param}Cnt`]: prev[`${type_param}Cnt`] + 1
      }));
      setPAGING((prev={}) => ({
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
      setCOUNT((prev={}) => ({
        ...prev,
        [`${type_param}Cnt`]: 0
      }));
      setPAGING((prev={}) => ({
        ...prev,
        page: 1
      }));
      navigate("/user/list");
    }
  };

  // 6. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-6. empty
    const tableEmpty1 = () => (
      <Card variant={"outlined"} className={"border radius p-0"} key={"empty"}>
        <TableContainer>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
              <TableCell>{translate("common-dateType")}</TableCell>
              <TableCell>{translate("exercise-count")}</TableCell>
              <TableCell>{translate("exercise-volume")}</TableCell>
              <TableCell>{translate("exercise-cardio")}</TableCell>
              <TableCell>{translate("exercise-weight")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            <TableRow className={"table-tbody-tr"}>
              <TableCell colSpan={Object.keys(OBJECT_EXERCISE_PLAN_DEF[0]).length}>
                {translate("common-empty")}
              </TableCell>
            </TableRow>
          </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-7. fragment
    const tableFragment1 = (i=0) => (
      <Card variant={"outlined"} className={"border radius p-0"} key={i}>
        <TableContainer>
          <Table>
            <TableHead className={"table-thead"}>
              <TableRow className={"table-thead-tr"}>
                <TableCell>{translate("common-date")}</TableCell>
                <TableCell>{translate("common-dateType")}</TableCell>
                <TableCell>{translate("exercise-count")}</TableCell>
                <TableCell>{translate("exercise-volume")}</TableCell>
                <TableCell>{translate("exercise-cardio")}</TableCell>
                <TableCell>{translate("exercise-weight")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={"table-tbody"}>
              {OBJECT_EXERCISE_PLAN?.map((item, index) => (
                <TableRow
                  key={`data-${index}`}
                  className={"table-tbody-tr"}
                  ref={index === OBJECT_EXERCISE_PLAN.length - 1 ? lastRowRef : null}
                >
                  <TableCell>
                    <Div>{item.exercise_plan_dateStart?.substring(5, 10)}</Div>
                    <Div>~</Div>
                    <Div>{item.exercise_plan_dateEnd?.substring(5, 10)}</Div>
                  </TableCell>
                  <TableCell>
                    {item.exercise_plan_dateType}
                  </TableCell>
                  <TableCell>
                    {numeral(item.exercise_plan_count).format("0,0")}
                  </TableCell>
                  <TableCell>
                    {numeral(item.exercise_plan_volume).format("0,0")}
                  </TableCell>
                  <TableCell>
                    {item.exercise_plan_cardio}
                  </TableCell>
                  <TableCell>
                    {numeral(item.exercise_plan_weight).format("0,0")}
                  </TableCell>
                </TableRow>
              ))}
              {LOADING && Array.from({length: Object.keys(OBJECT_EXERCISE_PLAN_DEF[0]).length}, (_, index) => (
                <TableRow key={`skeleton-${index}`} className={"table-tbody-tr"}>
                  <TableCell colSpan={Object.keys(OBJECT_EXERCISE_PLAN_DEF[0]).length}>
                    <Skeleton className={"animation"}/>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-6. empty
    const tableEmpty2 = () => (
      <Card variant={"outlined"} className={"border radius p-0"} key={"empty"}>
        <TableContainer>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
              <TableCell>{translate("common-dateType")}</TableCell>
              <TableCell>{translate("exercise-volume")}</TableCell>
              <TableCell>{translate("exercise-cardio")}</TableCell>
              <TableCell>{translate("exercise-weight")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            <TableRow className={"table-tbody-tr"}>
              <TableCell colSpan={Object.keys(OBJECT_EXERCISE_DEF[0]).length}>
                {translate("common-empty")}
              </TableCell>
            </TableRow>
          </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-7. fragment
    const tableFragment2 = (i=0) => (
      <Card variant={"outlined"} className={"border radius p-0"} key={i}>
        <TableContainer>
          <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
              <TableCell>{translate("common-dateType")}</TableCell>
              <TableCell>{translate("exercise-volume")}</TableCell>
              <TableCell>{translate("exercise-cardio")}</TableCell>
              <TableCell>{translate("exercise-weight")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            {OBJECT_EXERCISE?.map((item, index) => (
              <TableRow
                key={`data-${index}`}
                className={"table-tbody-tr"}
                ref={index === OBJECT_EXERCISE.length - 1 ? lastRowRef : null}
              >
                <TableCell>
                  {item.exercise_dateStart?.substring(5, 10)}
                </TableCell>
                <TableCell>
                  {item.exercise_dateType}
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
            {LOADING && Array.from({length: Object.keys(OBJECT_EXERCISE_DEF[0]).length}, (_, index) => (
              <TableRow key={`skeleton-${index}`} className={"table-tbody-tr"}>
                <TableCell colSpan={Object.keys(OBJECT_EXERCISE_DEF[0]).length}>
                  <Skeleton className={"animation"}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-6. empty
    const tableEmpty3 = () => (
      <Card variant={"outlined"} className={"border radius p-0"} key={"empty"}>
        <TableContainer>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
              <TableCell>{translate("common-dateType")}</TableCell>
              <TableCell>{translate("food-kcal")}</TableCell>
              <TableCell>{translate("food-carb")}</TableCell>
              <TableCell>{translate("food-protein")}</TableCell>
              <TableCell>{translate("food-fat")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            <TableRow className={"table-tbody-tr"}>
              <TableCell colSpan={Object.keys(OBJECT_FOOD_PLAN_DEF[0]).length}>
                {translate("common-empty")}
              </TableCell>
            </TableRow>
          </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-7. fragment
    const tableFragment3 = (i=0) => (
      <Card variant={"outlined"} className={"border radius p-0"} key={i}>
        <TableContainer>
          <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
              <TableCell>{translate("common-dateType")}</TableCell>
              <TableCell>{translate("food-kcal")}</TableCell>
              <TableCell>{translate("food-carb")}</TableCell>
              <TableCell>{translate("food-protein")}</TableCell>
              <TableCell>{translate("food-fat")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            {OBJECT_FOOD_PLAN?.map((item, index) => (
              <TableRow
                key={`data-${index}`}
                className={"table-tbody-tr"}
                ref={index === OBJECT_FOOD_PLAN.length - 1 ? lastRowRef : null}
              >
                <TableCell>
                  <Div>{item.food_plan_dateStart?.substring(5, 10)}</Div>
                  <Div>~</Div>
                  <Div>{item.food_plan_dateEnd?.substring(5, 10)}</Div>
                </TableCell>
                <TableCell>
                  {item.food_plan_dateType}
                </TableCell>
                <TableCell>
                  {numeral(item.food_plan_kcal).format('0,0')}
                </TableCell>
                <TableCell>
                  {numeral(item.food_plan_carb).format('0,0')}
                </TableCell>
                <TableCell>
                  {numeral(item.food_plan_protein).format('0,0')}
                </TableCell>
                <TableCell>
                  {numeral(item.food_plan_fat).format('0,0')}
                </TableCell>
              </TableRow>
            ))}
            {LOADING && Array.from({length: Object.keys(OBJECT_FOOD_PLAN_DEF[0]).length}, (_, index) => (
              <TableRow key={`skeleton-${index}`} className={"table-tbody-tr"}>
                <TableCell colSpan={Object.keys(OBJECT_FOOD_PLAN_DEF[0]).length}>
                  <Skeleton className={"animation"}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-6. empty
    const tableEmpty4 = () => (
      <Card variant={"outlined"} className={"border radius p-0"} key={"empty"}>
        <TableContainer>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
              <TableCell>{translate("common-dateType")}</TableCell>
              <TableCell>{translate("food-kcal")}</TableCell>
              <TableCell>{translate("food-carb")}</TableCell>
              <TableCell>{translate("food-protein")}</TableCell>
              <TableCell>{translate("food-fat")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            <TableRow className={"table-tbody-tr"}>
              <TableCell colSpan={Object.keys(OBJECT_FOOD_DEF[0]).length}>
                {translate("common-empty")}
              </TableCell>
            </TableRow>
          </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-7. fragment
    const tableFragment4 = (i=0) => (
      <Card variant={"outlined"} className={"border radius p-0"} key={i}>
        <TableContainer>
          <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
              <TableCell>{translate("common-dateType")}</TableCell>
              <TableCell>{translate("food-kcal")}</TableCell>
              <TableCell>{translate("food-carb")}</TableCell>
              <TableCell>{translate("food-protein")}</TableCell>
              <TableCell>{translate("food-fat")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            {OBJECT_FOOD?.map((item, index) => (
              <TableRow ref={index === OBJECT_FOOD.length - 1 ? lastRowRef : null}
              key={`data-${index}`}
              className={"table-tbody-tr"}>
                <TableCell>
                  {item.food_dateStart?.substring(5, 10)}
                </TableCell>
                <TableCell>
                  {item.food_dateType}
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
            {LOADING && Array.from({length: Object.keys(OBJECT_FOOD_DEF[0]).length}, (_, index) => (
              <TableRow key={`skeleton-${index}`} className={"table-tbody-tr"}>
                <TableCell colSpan={Object.keys(OBJECT_FOOD_DEF[0]).length}>
                  <Skeleton className={"animation"}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-6. empty
    const tableEmpty5 = () => (
      <Card variant={"outlined"} className={"border radius p-0"} key={"empty"}>
        <TableContainer>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
              <TableCell>{translate("common-dateType")}</TableCell>
              <TableCell>{translate("money-in")}</TableCell>
              <TableCell>{translate("money-out")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            <TableRow className={"table-tbody-tr"}>
              <TableCell colSpan={Object.keys(OBJECT_MONEY_PLAN_DEF[0]).length}>
                {translate("common-empty")}
              </TableCell>
            </TableRow>
          </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-7. fragment
    const tableFragment5 = (i=0) => (
      <Card variant={"outlined"} className={"border radius p-0"} key={i}>
        <TableContainer>
          <Table>
          <TableHead className={"table-thead"}>
            <TableRow className="table-thead-tr">
              <TableCell>{translate("common-date")}</TableCell>
              <TableCell>{translate("common-dateType")}</TableCell>
              <TableCell>{translate("money-in")}</TableCell>
              <TableCell>{translate("money-out")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            {OBJECT_MONEY_PLAN?.map((item, index) => (
              <TableRow
                key={`data-${index}`}
                className={"table-tbody-tr"}
                ref={index === OBJECT_MONEY_PLAN.length - 1 ? lastRowRef : null}
              >
                <TableCell>
                  <Div>{item.money_plan_dateStart?.substring(5, 10)}</Div>
                  <Div>~</Div>
                  <Div>{item.money_plan_dateEnd?.substring(5, 10)}</Div>
                </TableCell>
                <TableCell>
                  {item.money_plan_dateType}
                </TableCell>
                <TableCell>
                  {numeral(item.money_plan_in).format("0,0")}
                </TableCell>
                <TableCell>
                  {numeral(item.money_plan_out).format("0,0")}
                </TableCell>
              </TableRow>
            ))}
            {LOADING && Array.from({length: Object.keys(OBJECT_MONEY_PLAN_DEF[0]).length}, (_, index) => (
              <TableRow key={`skeleton-${index}`} className={"table-tbody-tr"}>
                <TableCell colSpan={Object.keys(OBJECT_MONEY_PLAN_DEF[0]).length}>
                  <Skeleton className={"animation"}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-6. empty
    const tableEmpty6 = () => (
      <Card variant={"outlined"} className={"border radius p-0"} key={"empty"}>
        <TableContainer>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
              <TableCell>{translate("common-dateType")}</TableCell>
              <TableCell>{translate("money-in")}</TableCell>
              <TableCell>{translate("money-out")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            <TableRow className={"table-tbody-tr"}>
              <TableCell colSpan={Object.keys(OBJECT_MONEY_DEF[0]).length}>
                {translate("common-empty")}
              </TableCell>
            </TableRow>
          </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-7. fragment
    const tableFragment6 = (i=0) => (
      <Card variant={"outlined"} className={"border radius p-0"} key={i}>
        <TableContainer>
          <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
              <TableCell>{translate("common-dateType")}</TableCell>
              <TableCell>{translate("money-in")}</TableCell>
              <TableCell>{translate("money-out")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            {OBJECT_MONEY?.map((item, index) => (
              <TableRow
                key={`data-${index}`}
                className={"table-tbody-tr"}
                ref={index === OBJECT_MONEY.length - 1 ? lastRowRef : null}
              >
                <TableCell>
                  {item.money_dateStart?.substring(5, 10)}
                </TableCell>
                <TableCell>
                  {item.money_dateType}
                </TableCell>
                <TableCell>
                  {numeral(item.money_total_in).format('0,0')}
                </TableCell>
                <TableCell>
                  {numeral(item.money_total_out).format('0,0')}
                </TableCell>
              </TableRow>
            ))}
            {LOADING && Array.from({length: Object.keys(OBJECT_MONEY_DEF[0]).length}, (_, index) => (
              <TableRow key={`skeleton-${index}`} className={"table-tbody-tr"}>
                <TableCell colSpan={Object.keys(OBJECT_MONEY_DEF[0]).length}>
                  <Skeleton className={"animation"}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-6. empty
    const tableEmpty7 = () => (
      <Card variant={"outlined"} className={"border radius p-0"} key={"empty"}>
        <TableContainer>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
              <TableCell>{translate("common-dateType")}</TableCell>
              <TableCell>{translate("sleep-night")}</TableCell>
              <TableCell>{translate("sleep-morning")}</TableCell>
              <TableCell>{translate("sleep-time")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            <TableRow className={"table-tbody-tr"}>
              <TableCell colSpan={Object.keys(OBJECT_SLEEP_PLAN_DEF[0]).length}>
                {translate("common-empty")}
              </TableCell>
            </TableRow>
          </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-7. fragment
    const tableFragment7 = (i=0) => (
      <Card variant={"outlined"} className={"border radius p-0"} key={i}>
        <TableContainer>
          <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
              <TableCell>{translate("common-dateType")}</TableCell>
              <TableCell>{translate("sleep-night")}</TableCell>
              <TableCell>{translate("sleep-morning")}</TableCell>
              <TableCell>{translate("sleep-time")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            {OBJECT_SLEEP_PLAN?.map((item, index) => (
              <TableRow
                key={`data-${index}`}
                className={"table-tbody-tr"}
                ref={index === OBJECT_SLEEP_PLAN.length - 1 ? lastRowRef : null}
              >
                <TableCell>
                  <Div>{item.sleep_plan_dateStart?.substring(5, 10)}</Div>
                  <Div>~</Div>
                  <Div>{item.sleep_plan_dateEnd?.substring(5, 10)}</Div>
                </TableCell>
                <TableCell>
                  {item.sleep_plan_dateType}
                </TableCell>
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
            ))}
            {LOADING && Array.from({length: Object.keys(OBJECT_SLEEP_PLAN_DEF[0]).length}, (_, index) => (
              <TableRow key={`skeleton-${index}`} className={"table-tbody-tr"}>
                <TableCell colSpan={Object.keys(OBJECT_SLEEP_PLAN_DEF[0]).length}>
                  <Skeleton className={"animation"}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-6. empty
    const tableEmpty8 = () => (
      <Card variant={"outlined"} className={"border radius p-0"} key={"empty"}>
        <TableContainer>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
              <TableCell>{translate("common-dateType")}</TableCell>
              <TableCell>{translate("sleep-night")}</TableCell>
              <TableCell>{translate("sleep-morning")}</TableCell>
              <TableCell>{translate("sleep-time")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            <TableRow className={"table-tbody-tr"}>
              <TableCell colSpan={Object.keys(OBJECT_SLEEP_DEF[0]).length}>
                {translate("common-empty")}
              </TableCell>
            </TableRow>
          </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-7. fragment
    const tableFragment8 = (i=0) => (
      <Card variant={"outlined"} className={"border radius p-0"} key={i}>
        <TableContainer>
          <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
              <TableCell>{translate("common-dateType")}</TableCell>
              <TableCell>{translate("sleep-night")}</TableCell>
              <TableCell>{translate("sleep-morning")}</TableCell>
              <TableCell>{translate("sleep-time")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            {OBJECT_SLEEP?.map((item, index) => (
              <TableRow
                key={`data-${index}`}
                className={"table-tbody-tr"}
                ref={index === OBJECT_SLEEP.length - 1 ? lastRowRef : null}
              >
                <TableCell>
                  {item.sleep_dateStart?.substring(5, 10)}
                </TableCell>
                <TableCell>
                  {item.sleep_dateType}
                </TableCell>
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
            ))}
            {LOADING && Array.from({length: Object.keys(OBJECT_SLEEP_DEF[0]).length}, (_, index) => (
              <TableRow key={`skeleton-${index}`} className={"table-tbody-tr"}>
                <TableCell colSpan={Object.keys(OBJECT_SLEEP_DEF[0]).length}>
                  <Skeleton className={"animation"}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-8. table
    const tableSection = () => {
      if (PART === "exercisePlan") {
        return COUNT.totalCnt === 0 ? tableEmpty1() : tableFragment1(0);
      }
      else if (PART === "exercise") {
        return COUNT.totalCnt === 0 ? tableEmpty2() : tableFragment2(0);
      }
      else if (PART === "foodPlan") {
        return COUNT.totalCnt === 0 ? tableEmpty3() : tableFragment3(0);
      }
      else if (PART === "food") {
        return COUNT.totalCnt === 0 ? tableEmpty4() : tableFragment4(0);
      }
      else if (PART === "moneyPlan") {
        return COUNT.totalCnt === 0 ? tableEmpty5() : tableFragment5(0);
      }
      else if (PART === "money") {
        return COUNT.totalCnt === 0 ? tableEmpty6() : tableFragment6(0);
      }
      else if (PART === "sleepPlan") {
        return COUNT.totalCnt === 0 ? tableEmpty7() : tableFragment7(0);
      }
      else if (PART === "sleep") {
        return COUNT.totalCnt === 0 ? tableEmpty8() : tableFragment8(0);
      }
    };
    // 7-11. third
    const thirdSection = () => (
      tableSection()
    );
    // 7-12. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper h-min65vh"}>
          {thirdSection()}
        </Div>
      </Paper>
    );
  };

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
      {tableNode()}
      {footerNode()}
    </>
  );
};
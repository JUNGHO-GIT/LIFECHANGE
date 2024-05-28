// UserDataList.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {useStorage, useTranslate} from "../../../import/ImportHooks.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {axios, numeral, moment} from "../../../import/ImportLibs.jsx";
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
  const sessionId = sessionStorage.getItem("sessionId");

  // 2-1. useStorage (리스트에서만 사용) ---------------------------------------------------------->
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      dateType: "day",
      dateStart: moment().tz("Asia/Seoul").startOf("year").format("YYYY-MM-DD"),
      dateEnd: moment().tz("Asia/Seoul").endOf("year").format("YYYY-MM-DD")
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(false);
  const [PART, setPART] = useState("exercisePlan");
  const [PAGING, setPAGING] = useState({
    sort: "asc",
    page: 1,
  });
  const [COUNT, setCOUNT] = useState({
    inputCnt: 0,
    totalCnt: 0,
    sectionCnt: 0
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_EXERCISE_PLAN_DEF = [{
    _id: "",
    exercise_plan_number: 0,
    exercise_plan_demo: false,
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
    money_plan_dateStart: "0000-00-00",
    money_plan_dateEnd: "0000-00-00",
    money_plan_in: 0,
    money_plan_out: 0,
  }];
  const OBJECT_MONEY_DEF = [{
    _id: "",
    money_number: 0,
    money_demo: false,
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
    setLOADING(true);
    axios.get(`${URL_OBJECT}/list`, {
      params: {
        user_id: sessionId,
        PAGING: PAGING,
        DATE: DATE,
      },
    })
    .then((res) => {
      setOBJECT_EXERCISE_PLAN(res.data.exercisePlan || OBJECT_EXERCISE_PLAN_DEF);
      setOBJECT_EXERCISE(res.data.exercise || OBJECT_EXERCISE_DEF);
      setOBJECT_FOOD_PLAN(res.data.foodPlan || OBJECT_FOOD_PLAN_DEF);
      setOBJECT_FOOD(res.data.food || OBJECT_FOOD_DEF);
      setOBJECT_MONEY_PLAN(res.data.moneyPlan || OBJECT_MONEY_PLAN_DEF);
      setOBJECT_MONEY(res.data.money || OBJECT_MONEY_DEF);
      setOBJECT_SLEEP_PLAN(res.data.sleepPlan || OBJECT_SLEEP_PLAN_DEF);
      setOBJECT_SLEEP(res.data.sleep || OBJECT_SLEEP_DEF);
      setCOUNT((prev) => ({
        ...prev,
        totalCnt: res.data.totalCnt || 0,
        sectionCnt: res.data.sectionCnt || 0,
        newSectionCnt: res.data.sectionCnt || 0
      }));
      setLOADING(false);
    })
    .catch((err) => {
      console.log("err", err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId, PAGING.sort, PAGING.page, DATE.dateEnd]);

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
        inputCnt: 0,
      }));
      setPAGING((prev) => ({
        ...prev,
        page: 1
      }));
      navigate("/user/data/list");
    }
  };

  // 6. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-6. empty
    const tableEmpty1 = () => (
      <Card className={"border radius p-0"} key={"empty"}>
        <TableContainer>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
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
      <Card className={"border radius p-0"} key={i}>
        <TableContainer>
          <Table>
            <TableHead className={"table-thead"}>
              <TableRow className={"table-thead-tr"}>
                <TableCell>{translate("common-date")}</TableCell>
                <TableCell>{translate("exercise-count")}</TableCell>
                <TableCell>{translate("exercise-volume")}</TableCell>
                <TableCell>{translate("exercise-cardio")}</TableCell>
                <TableCell>{translate("exercise-weight")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={"table-tbody"}>
              {OBJECT_EXERCISE_PLAN?.map((item, index) => (
                <TableRow key={`data-${index}`} className={"table-tbody-tr"}>
                  <TableCell>
                    <Div>{item.exercise_plan_dateStart?.substring(5, 10)}</Div>
                    <Div>~</Div>
                    <Div>{item.exercise_plan_dateEnd?.substring(5, 10)}</Div>
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
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-6. empty
    const tableEmpty2 = () => (
      <Card className={"border radius p-0"} key={"empty"}>
        <TableContainer>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
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
      <Card className={"border radius p-0"} key={i}>
        <TableContainer>
          <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
              <TableCell>{translate("exercise-volume")}</TableCell>
              <TableCell>{translate("exercise-cardio")}</TableCell>
              <TableCell>{translate("exercise-weight")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            {OBJECT_EXERCISE?.map((item, index) => (
              <TableRow key={`data-${index}`} className={"table-tbody-tr"}>
                <TableCell>
                  {item.exercise_dateStart?.substring(5, 10)}
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
    // 7-6. empty
    const tableEmpty3 = () => (
      <Card className={"border radius p-0"} key={"empty"}>
        <TableContainer>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
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
      <Card className={"border radius p-0"} key={i}>
        <TableContainer>
          <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
              <TableCell>{translate("food-kcal")}</TableCell>
              <TableCell>{translate("food-carb")}</TableCell>
              <TableCell>{translate("food-protein")}</TableCell>
              <TableCell>{translate("food-fat")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            {OBJECT_FOOD_PLAN?.map((item, index) => (
              <TableRow key={`data-${index}`} className={"table-tbody-tr"}>
                <TableCell>
                  <Div>{item.food_plan_dateStart?.substring(5, 10)}</Div>
                  <Div>~</Div>
                  <Div>{item.food_plan_dateEnd?.substring(5, 10)}</Div>
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
          </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-6. empty
    const tableEmpty4 = () => (
      <Card className={"border radius p-0"} key={"empty"}>
        <TableContainer>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
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
      <Card className={"border radius p-0"} key={i}>
        <TableContainer>
          <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
              <TableCell>{translate("food-kcal")}</TableCell>
              <TableCell>{translate("food-carb")}</TableCell>
              <TableCell>{translate("food-protein")}</TableCell>
              <TableCell>{translate("food-fat")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            {OBJECT_FOOD?.map((item, index) => (
              <TableRow key={`data-${index}`} className={"table-tbody-tr"}>
                <TableCell>
                  {item.food_dateStart?.substring(5, 10)}
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
    // 7-6. empty
    const tableEmpty5 = () => (
      <Card className={"border radius p-0"} key={"empty"}>
        <TableContainer>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
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
      <Card className={"border radius p-0"} key={i}>
        <TableContainer>
          <Table>
          <TableHead className={"table-thead"}>
            <TableRow className="table-thead-tr">
              <TableCell>{translate("common-date")}</TableCell>
              <TableCell>{translate("money-in")}</TableCell>
              <TableCell>{translate("money-out")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            {OBJECT_MONEY_PLAN?.map((item, index) => (
              <TableRow key={`data-${index}`} className={"table-tbody-tr"}>
                <TableCell>
                  <Div>{item.money_plan_dateStart?.substring(5, 10)}</Div>
                  <Div>~</Div>
                  <Div>{item.money_plan_dateEnd?.substring(5, 10)}</Div>
                </TableCell>
                <TableCell>
                  {numeral(item.money_plan_in).format("0,0")}
                </TableCell>
                <TableCell>
                  {numeral(item.money_plan_out).format("0,0")}
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
      <Card className={"border radius p-0"} key={"empty"}>
        <TableContainer>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
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
      <Card className={"border radius p-0"} key={i}>
        <TableContainer>
          <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
              <TableCell>{translate("money-in")}</TableCell>
              <TableCell>{translate("money-out")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            {OBJECT_MONEY?.map((item, index) => (
              <TableRow key={`data-${index}`} className={"table-tbody-tr"}>
                <TableCell>
                  {item.money_dateStart?.substring(5, 10)}
                </TableCell>
                <TableCell>
                  {numeral(item.money_total_in).format('0,0')}
                </TableCell>
                <TableCell>
                  {numeral(item.money_total_out).format('0,0')}
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
      <Card className={"border radius p-0"} key={"empty"}>
        <TableContainer>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
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
      <Card className={"border radius p-0"} key={i}>
        <TableContainer>
          <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
              <TableCell>{translate("sleep-night")}</TableCell>
              <TableCell>{translate("sleep-morning")}</TableCell>
              <TableCell>{translate("sleep-time")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            {OBJECT_SLEEP_PLAN?.map((item, index) => (
              <TableRow key={`data-${index}`} className={"table-tbody-tr"}>
                <TableCell>
                  <Div>{item.sleep_plan_dateStart?.substring(5, 10)}</Div>
                  <Div>~</Div>
                  <Div>{item.sleep_plan_dateEnd?.substring(5, 10)}</Div>
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
          </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-6. empty
    const tableEmpty8 = () => (
      <Card className={"border radius p-0"} key={"empty"}>
        <TableContainer>
          <Table>
            <TableHead className={"table-thead"}>
              <TableRow className={"table-thead-tr"}>
                <TableCell>{translate("common-date")}</TableCell>
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
      <Card className={"border radius p-0"} key={i}>
        <TableContainer>
          <Table>
            <TableHead className={"table-thead"}>
              <TableRow className={"table-thead-tr"}>
                <TableCell>{translate("common-date")}</TableCell>
                <TableCell>{translate("sleep-night")}</TableCell>
                <TableCell>{translate("sleep-morning")}</TableCell>
                <TableCell>{translate("sleep-time")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={"table-tbody"}>
              {OBJECT_SLEEP?.map((item, index) => (
                <TableRow key={`data-${index}`} className={"table-tbody-tr"}>
                  <TableCell>
                    {item.sleep_dateStart?.substring(5, 10)}
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
    // 7-9. third
    const thirdSection = () => (
      tableSection()
    );
    // 7-10. return
    return (
      <Paper className={"content-wrapper"}>
        <Div className={"block-wrapper h-min67vh"}>
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
        PAGING, COUNT, PART
      }}
      functions={{
        setPAGING, setCOUNT, setPART
      }}
      handlers={{
        navigate, flowSave
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
// TweakList.jsx

import {React, useState, useEffect, useNavigate} from "../../import/ImportReacts";
import {axios, numeral} from "../../import/ImportLibs";
import {Header, NavBar} from "../../import/ImportLayouts";
import {Paging, Loading, Filter} from "../../import/ImportComponents";
import {Grid2, Container, Card, Paper} from "../../import/ImportMuis";
import {Box} from "../../import/ImportMuis";
import {TableContainer, Table} from "../../import/ImportMuis";
import {TableHead, TableBody, TableRow, TableCell} from "../../import/ImportMuis";
import {Typography, Button, Divider, TextField} from "../../import/ImportMuis";

// ------------------------------------------------------------------------------------------------>
export const TweakList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_TWEAK || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const navParam = useNavigate();

  // 2-2. useState -------------------------------------------------------------------------------->
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
      exercise_rest: 0,
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
    money_property: 0,
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
    const res = await axios.get(`${URL_OBJECT}/list`, {
      params: {
        user_id: user_id,
        PAGING: PAGING,
        PART: PART
      }
    });
    if (PART === "exercisePlan") {
      setOBJECT_EXERCISE_PLAN(res.data.result || OBJECT_EXERCISE_PLAN_DEF);
    }
    if (PART === "exercise") {
      setOBJECT_EXERCISE(res.data.result || OBJECT_EXERCISE_DEF);
    }
    if (PART === "foodPlan") {
      setOBJECT_FOOD_PLAN(res.data.result || OBJECT_FOOD_PLAN_DEF);
    }
    if (PART === "food") {
      setOBJECT_FOOD(res.data.result || OBJECT_FOOD_DEF);
    }
    if (PART === "moneyPlan") {
      setOBJECT_MONEY_PLAN(res.data.result || OBJECT_MONEY_PLAN_DEF);
    }
    if (PART === "money") {
      setOBJECT_MONEY(res.data.result || OBJECT_MONEY_DEF);
    }
    if (PART === "sleepPlan") {
      setOBJECT_SLEEP_PLAN(res.data.result || OBJECT_SLEEP_PLAN_DEF);
    }
    if (PART === "sleep") {
      setOBJECT_SLEEP(res.data.result || OBJECT_SLEEP_DEF);
    }
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0
    }));
    setLOADING(false);
  })()}, [user_id, PAGING, PART]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async (type_param) => {
    const res = await axios.post(`${URL_OBJECT}/save`, {
      user_id: user_id,
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
      navParam("/tweak/demo");
    }
  };

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (type_param) => {
    const res = await axios.delete(`${URL_OBJECT}/delete`, {
      params: {
        user_id: user_id,
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
      navParam("/tweak/demo");
    }
  };

  // 6. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-1. title
    const titleSection = () => (
      <Typography variant={"h5"} fontWeight={500}>
        데모 데이터
      </Typography>
    );
    // 7-6-1. table
    const tableFragment1 = (i) => (
      <TableContainer key={i}>
        <Table className={"border"}>
          <TableHead>
            <TableRow className={"table-thead-tr"}>
              <TableCell>날짜</TableCell>
              <TableCell>운동횟수</TableCell>
              <TableCell>운동시간</TableCell>
              <TableCell>운동볼륨</TableCell>
              <TableCell>체중</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {OBJECT_EXERCISE_PLAN?.map((item, index) => (
              <TableRow key={index} className={"table-tbody-tr"}>
                <TableCell>{item.exercise_plan_startDt?.substring(5, 10)}</TableCell>
                <TableCell>{item.exercise_plan_count}</TableCell>
                <TableCell>{item.exercise_plan_cardio}</TableCell>
                <TableCell>{item.exercise_plan_volume}</TableCell>
                <TableCell>{item.exercise_plan_weight}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-6-2. table
    const tableFragment2 = (i) => (
      <TableContainer key={i}>
        <Table className={"border"}>
          <TableHead>
            <TableRow className={"table-thead-tr"}>
              <TableCell>날짜</TableCell>
              <TableCell>부위</TableCell>
              <TableCell>종목</TableCell>
              <TableCell>세트</TableCell>
              <TableCell>횟수</TableCell>
              <TableCell>중량</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {OBJECT_EXERCISE?.map((item, index) => (
              item.exercise_section.slice(0, 3)?.map((section, sectionIndex) => (
                <TableRow key={sectionIndex} className={"table-tbody-tr"}>
                  {sectionIndex === 0 && (
                    <TableCell rowSpan={Math.min(item.exercise_section.length, 3)}>
                      {item.exercise_startDt?.substring(5, 10)}
                      {item.exercise_section.length > 3 && (<Box>더보기</Box>)}
                    </TableCell>
                  )}
                  <TableCell>{section.exercise_part_val.substring(0, 6)}</TableCell>
                  <TableCell>{section.exercise_title_val.substring(0, 6)}</TableCell>
                  {section.exercise_part_val !== "유산소" ? (
                    <>
                    <TableCell>
                      {`${numeral(section.exercise_set).format('0,0')}`}
                    </TableCell>
                    <TableCell>
                      {`${numeral(section.exercise_rep).format('0,0')}`}
                    </TableCell>
                    <TableCell>
                      {`${numeral(section.exercise_kg).format('0,0')}`}
                    </TableCell>
                    </>
                  ) : (
                    <>
                    <TableCell colSpan={3}>
                      {section.exercise_cardio}
                    </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-6-3. table
    const tableFragment3 = (i) => (
      <TableContainer key={i}>
        <Table className={"border"}>
          <TableHead>
            <TableRow className={"table-thead-tr"}>
              <TableCell>날짜</TableCell>
              <TableCell>칼로리</TableCell>
              <TableCell>탄수화물</TableCell>
              <TableCell>단백질</TableCell>
              <TableCell>지방</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {OBJECT_FOOD_PLAN?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.food_plan_startDt?.substring(5, 10)}</TableCell>
                <TableCell>{item.food_plan_kcal}</TableCell>
                <TableCell>{item.food_plan_carb}</TableCell>
                <TableCell>{item.food_plan_protein}</TableCell>
                <TableCell>{item.food_plan_fat}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-6-4. table
    const tableFragment4 = (i) => (
      <TableContainer key={i}>
        <Table className={"border"}>
          <TableHead>
            <TableRow className={"table-thead-tr"}>
              <TableCell>날짜</TableCell>
              <TableCell>분류</TableCell>
              <TableCell>식품명</TableCell>
              <TableCell>칼로리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {OBJECT_FOOD?.map((item, index) => (
              item.food_section.slice(0, 3)?.map((section, sectionIndex) => (
                <TableRow key={sectionIndex} className={"table-tbody-tr"}>
                  {sectionIndex === 0 && (
                    <TableCell rowSpan={Math.min(item.food_section.length, 3)}>
                      {item.food_startDt?.substring(5, 10)}
                      {item.food_section.length > 3 && (<Box>더보기</Box>)}
                    </TableCell>
                  )}
                  <TableCell>{section.food_part_val.substring(0, 6)}</TableCell>
                  <TableCell>{section.food_title.substring(0, 6)}</TableCell>
                  <TableCell>{`${numeral(section.food_kcal).format('0,0')} kcal`}</TableCell>
                </TableRow>
              ))
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-6-5. table
    const tableFragment5 = (i) => (
      <TableContainer key={i}>
        <Table className={"border"}>
          <TableHead>
            <TableRow className={"table-thead-tr"}>
              <TableCell>날짜</TableCell>
              <TableCell>수입</TableCell>
              <TableCell>지출</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {OBJECT_MONEY_PLAN?.map((item, index) => (
              <TableRow key={index} className={"table-tbody-tr"}>
                <TableCell>{item.money_plan_startDt?.substring(5, 10)}</TableCell>
                <TableCell>{item.money_plan_in}</TableCell>
                <TableCell>{item.money_plan_out}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-6-6. table
    const tableFragment6 = (i) => (
      <TableContainer key={i}>
        <Table className={"border"}>
          <TableHead>
            <TableRow className={"table-thead-tr"}>
              <TableCell>날짜</TableCell>
              <TableCell>분류</TableCell>
              <TableCell>항목</TableCell>
              <TableCell>금액</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {OBJECT_MONEY?.map((item, index) => (
              item.money_section.slice(0, 3)?.map((section, sectionIndex) => (
                <TableRow key={sectionIndex} className={"table-tbody-tr"}>
                  {sectionIndex === 0 && (
                    <TableCell rowSpan={Math.min(item.money_section.length, 3)}>
                      {item.money_startDt?.substring(5, 10)}
                      {item.money_section.length > 3 && (<Box>더보기</Box>)}
                    </TableCell>
                  )}
                  <TableCell>{section.money_part_val}</TableCell>
                  <TableCell>{section.money_title_val}</TableCell>
                  <TableCell>{`₩ ${numeral(section.money_amount).format('0,0')}`}</TableCell>
                </TableRow>
              ))
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-6-7. table
    const tableFragment7 = (i) => (
      <TableContainer key={i}>
        <Table className={"border"}>
          <TableHead>
            <TableRow className={"table-thead-tr"}>
              <TableCell>날짜</TableCell>
              <TableCell>취침</TableCell>
              <TableCell>기상</TableCell>
              <TableCell>수면</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {OBJECT_SLEEP_PLAN?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.sleep_plan_startDt?.substring(5, 10)}</TableCell>
                <TableCell>{item.sleep_plan_night}</TableCell>
                <TableCell>{item.sleep_plan_morning}</TableCell>
                <TableCell>{item.sleep_plan_time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-6-8. table
    const tableFragment8 = (i) => (
      <TableContainer key={i}>
        <Table className={"border"}>
          <TableHead>
            <TableRow className={"table-thead-tr"}>
              <TableCell>날짜</TableCell>
              <TableCell>취침</TableCell>
              <TableCell>기상</TableCell>
              <TableCell>수면</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {OBJECT_SLEEP?.map((item, index) => (
              item.sleep_section?.slice(0, 3)?.map((section, sectionIndex) => (
                <TableRow key={sectionIndex} className={"table-tbody-tr"}>
                  {sectionIndex === 0 && (
                    <TableCell rowSpan={Math.min(item.sleep_section.length, 3)}>
                      {item.sleep_startDt?.substring(5, 10)}
                      {item.sleep_section.length > 3 && (<Box>더보기</Box>)}
                    </TableCell>
                  )}
                  <TableCell>{section.sleep_night}</TableCell>
                  <TableCell>{section.sleep_morning}</TableCell>
                  <TableCell>{section.sleep_time}</TableCell>
                </TableRow>
              ))
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-7. table
    // list 는 높이 지정
    const tableSection = () => (
      <Box className={"block-wrapper h-min75vh"}>
        <Box className={"d-column"}>
          {PART === "exercisePlan" && tableFragment1(0)}
          {PART === "exercise" && tableFragment2(0)}
          {PART === "foodPlan" && tableFragment3(0)}
          {PART === "food" && tableFragment4(0)}
          {PART === "moneyPlan" && tableFragment5(0)}
          {PART === "money" && tableFragment6(0)}
          {PART === "sleepPlan" && tableFragment7(0)}
          {PART === "sleep" && tableFragment8(0)}
        </Box>
      </Box>
    );
    // 7-8. return
    return (
      <Paper className={"content-wrapper"} variant={"outlined"}>
        {tableSection()}
      </Paper>
    );
  };

  // 11. paging ----------------------------------------------------------------------------------->
  const pagingNode = () => (
    <Paging PAGING={PAGING} setPAGING={setPAGING} COUNT={COUNT} setCOUNT={setCOUNT}
      part={"tweak"} plan={""} type={"list"}
    />
  );

  // 12. filter ----------------------------------------------------------------------------------->
  const filterNode = () => (
    <Filter FILTER={""} setFILTER={""} PAGING={PAGING} setPAGING={setPAGING}
      PART={PART} setPART={setPART} part={"tweak"} plan={""} type={"list"}
    />
  );

  // 13. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Paper className={"flex-wrapper h-8vh p-sticky bottom-0"} variant={"outlined"}>
      <Box className={"d-center"}>
        <TextField
          select={false}
          label={"추가"}
          type={"text"}
          variant={"outlined"}
          id={"inputCount"}
          name={"inputCount"}
          className={"w-100 me-10"}
          size={"small"}
          value={COUNT?.inputCnt}
          InputProps={{
            readOnly: false
          }}
          onChange={(e) => (
            setCOUNT((prev) => ({
              ...prev,
              inputCnt: Number(e.target.value)
            }))
          )}
        />
        <Button size={"small"} className={"secondary-btn"} color={"secondary"} variant={"contained"}
        onClick={() => (flowSave(PART))}>
          추가
        </Button>
        <Button size={"small"} className={"secondary-btn"} color={"secondary"} variant={"contained"}
        onClick={() => (flowDelete(PART))}>
          삭제
        </Button>
      </Box>
    </Paper>
  );

  // 14. loading ---------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING}
    />
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {Header()}
      {NavBar()}
      {LOADING ? loadingNode() : tableNode()}
      {pagingNode()}
      {filterNode()}
      {btnNode()}
    </React.Fragment>
  );
};
// TweakDemo.jsx

import axios from "axios";
import numeral from 'numeral';
import {NumericFormat} from "react-number-format";
import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Header} from "../../layout/Header.jsx";
import {NavBar} from "../../layout/NavBar.jsx";
import {Paging} from "../../fragments/Paging.jsx";
import {Loading} from "../../fragments/Loading.jsx";
import {Container, Card, Paper, Table, TableHead, TableBody, TableCell, TableContainer, TableRow, Box, Button} from "@mui/material";
import Grid2 from '@mui/material/Unstable_Grid2';

// ------------------------------------------------------------------------------------------------>
export const TweakDemo = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_TWEAK || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const navParam = useNavigate();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [TYPE, setTYPE] = useState("exercisePlan");
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
        TYPE: TYPE
      }
    });
    if (TYPE === "exercisePlan") {
      setOBJECT_EXERCISE_PLAN(res.data.result || OBJECT_EXERCISE_PLAN_DEF);
    }
    if (TYPE === "exercise") {
      setOBJECT_EXERCISE(res.data.result || OBJECT_EXERCISE_DEF);
    }
    if (TYPE === "foodPlan") {
      setOBJECT_FOOD_PLAN(res.data.result || OBJECT_FOOD_PLAN_DEF);
    }
    if (TYPE === "food") {
      setOBJECT_FOOD(res.data.result || OBJECT_FOOD_DEF);
    }
    if (TYPE === "moneyPlan") {
      setOBJECT_MONEY_PLAN(res.data.result || OBJECT_MONEY_PLAN_DEF);
    }
    if (TYPE === "money") {
      setOBJECT_MONEY(res.data.result || OBJECT_MONEY_DEF);
    }
    if (TYPE === "sleepPlan") {
      setOBJECT_SLEEP_PLAN(res.data.result || OBJECT_SLEEP_PLAN_DEF);
    }
    if (TYPE === "sleep") {
      setOBJECT_SLEEP(res.data.result || OBJECT_SLEEP_DEF);
    }
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0
    }));
    setLOADING(false);
  })()}, [user_id, PAGING, TYPE]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowAdd = async (type_param) => {
    const res = await axios.post(`${URL_OBJECT}/add`, {
      user_id: user_id,
      TYPE: type_param,
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
        TYPE: type_param
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

    const tableExercisePlan = () => (
      <React.Fragment>
        <Box className={"block-wrapper h-75vh"}>
          <TableContainer>
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
              <TableRow key={index}>
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
        </Box>
      </React.Fragment>
    );
    const tableExercise = () => (
      <React.Fragment>
        <Box className={"block-wrapper h-75vh"}>
          <TableContainer>
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
              <React.Fragment key={item._id}>
                {item.exercise_section.slice(0, 3)?.map((section, sectionIndex) => (
                  <TableRow key={sectionIndex}>
                    {sectionIndex === 0 && (
                      <TableCell rowSpan={Math.min(item.exercise_section.length, 3)}>
                        {item.exercise_startDt?.substring(5, 10)}
                        {item.exercise_section.length > 3 && (<Box>더보기</Box>)}
                      </TableCell>
                    )}
                    <TableCell>{section.exercise_part_val.substring(0, 6)}</TableCell>
                    <TableCell>{section.exercise_title_val.substring(0, 6)}</TableCell>
                    {section.exercise_part_val !== "유산소" ? (
                      <React.Fragment>
                        <TableCell>{`${numeral(section.exercise_set).format('0,0')}`}</TableCell>
                        <TableCell>{`${numeral(section.exercise_rep).format('0,0')}`}</TableCell>
                        <TableCell>{`${numeral(section.exercise_kg).format('0,0')}`}</TableCell>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <TableCell colSpan={3}>{section.exercise_cardio}</TableCell>
                      </React.Fragment>
                    )}
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </React.Fragment>
    );
    const tableFoodPlan = () => (
      <React.Fragment>
        <Box className={"block-wrapper h-75vh"}>
          <TableContainer>
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
        </Box>
      </React.Fragment>
    );
    const tableFood = () => (
      <React.Fragment>
        <Box className={"block-wrapper h-75vh"}>
          <TableContainer>
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
              <React.Fragment key={item._id}>
                {item.food_section.slice(0, 3)?.map((section, sectionIndex) => (
                  <React.Fragment key={sectionIndex}>
                    <TableRow className={"table-tbody-tr"}>
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
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </React.Fragment>
    );
    const tableMoneyPlan = () => (
      <React.Fragment>
        <Box className={"block-wrapper h-75vh"}>
          <TableContainer>
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
              <TableRow key={index}>
                <TableCell>{item.money_plan_startDt?.substring(5, 10)}</TableCell>
                <TableCell>{item.money_plan_in}</TableCell>
                <TableCell>{item.money_plan_out}</TableCell>
              </TableRow>
            ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </React.Fragment>
    );
    const tableMoney = () => (
      <React.Fragment>
        <Box className={"block-wrapper h-75vh"}>
          <TableContainer>
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
                <React.Fragment key={sectionIndex}>
                  <TableRow className={"table-tbody-tr"}>
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
                </React.Fragment>
              ))
            ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </React.Fragment>
    );
    const tableSleepPlan = () => (
      <React.Fragment>
        <Box className={"block-wrapper h-75vh"}>
          <TableContainer>
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
        </Box>
      </React.Fragment>
    );
    const tableSleep = () => (
      <React.Fragment>
        <Box className={"block-wrapper h-75vh"}>
          <TableContainer>
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
              <React.Fragment key={item._id}>
                {item.sleep_section?.slice(0, 3)?.map((section, sectionIndex) => (
                  <React.Fragment key={sectionIndex}>
                    <TableRow className={"table-tbody-tr"}>
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
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <Card className={"content-wrapper"}>
          <Container className={"p-0"}>
            <Grid2 container spacing={3}>
              <Grid2 xl={12} lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                {TYPE === "exercisePlan" && tableExercisePlan()}
                {TYPE === "exercise" && tableExercise()}
                {TYPE === "foodPlan" && tableFoodPlan()}
                {TYPE === "food" && tableFood()}
                {TYPE === "moneyPlan" && tableMoneyPlan()}
                {TYPE === "money" && tableMoney()}
                {TYPE === "sleepPlan" && tableSleepPlan()}
                {TYPE === "sleep" && tableSleep()}
              </Grid2>
            </Grid2>
          </Container>
        </Card>
      </React.Fragment>
    );
  };

  // 8. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING}
    />
  );

  // 9. header ------------------------------------------------------------------------------------>
  const headerNode = () => (
    <Header />
  );

  // 10. navBar ----------------------------------------------------------------------------------->
  const navBarNode = () => (
    <NavBar />
  );

  // 12. paging ----------------------------------------------------------------------------------->
  const pagingNode = () => (
    <Paging PAGING={PAGING} setPAGING={setPAGING} COUNT={COUNT} setCOUNT={setCOUNT}
      part={"tweak"} plan={""} type={"list"}
    />
  );

  // 13. filter ----------------------------------------------------------------------------------->
  const filterNode = () => (
    <React.Fragment>
      <Card className={"flex-wrapper h-8vh p-sticky bottom-35"}>
        <Container className={"p-0"}>
          <Grid2 container spacing={3}>
            <Grid2 xl={12} lg={12} md={12} sm={12} xs={12} className={"d-center"}>
              <select className={"form-select form-select-sm"}
                onChange={(e) => (setTYPE(e.target.value))}
                value={TYPE}
              >
                <option value={"exercisePlan"}>운동(계획)</option>
                <option value={"exercise"}>운동</option>
                <option value={"foodPlan"}>식사(계획)</option>
                <option value={"food"}>식사</option>
                <option value={"moneyPlan"}>지출(계획)</option>
                <option value={"money"}>지출</option>
                <option value={"sleepPlan"}>수면(계획)</option>
                <option value={"sleep"}>수면</option>
              </select>
            </Grid2>
          </Grid2>
        </Container>
      </Card>
    </React.Fragment>
  );

  // 14. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <React.Fragment>
      <Card className={"flex-wrapper h-6vh p-sticky bottom-0"}>
        <Container className={"p-0"}>
          <Grid2 container spacing={3}>
            <Grid2 xl={12} lg={12} md={12} sm={12} xs={12} className={"d-center"}>
              <NumericFormat
                min={0}
                max={20}
                minLength={1}
                maxLength={2}
                datatype={"number"}
                displayType={"input"}
                className={"form-control"}
                id={"inputCount"}
                name={"inputCount"}
                disabled={false}
                thousandSeparator={false}
                fixedDecimalScale={true}
                value={Math.min(20, COUNT?.inputCnt)}
                onValueChange={(values) => (
                  setCOUNT((prev) => ({
                    ...prev,
                    inputCnt: Number(values.value)
                  }))
                )}
              ></NumericFormat>
              <Button size={"small"} className={"secondary-btn"} color={"secondary"} variant={"contained"}
              onClick={() => (flowAdd(TYPE))}>
                추가
              </Button>
              <Button size={"small"} className={"secondary-btn"} color={"secondary"} variant={"contained"}
              onClick={() => (flowDelete(TYPE))}>
                삭제
              </Button>
            </Grid2>
          </Grid2>
        </Container>
      </Card>
    </React.Fragment>
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {headerNode()}
      {navBarNode()}
      {LOADING ? loadingNode() : tableNode()}
      {pagingNode()}
      {filterNode()}
      {btnNode()}
    </React.Fragment>
  );
};
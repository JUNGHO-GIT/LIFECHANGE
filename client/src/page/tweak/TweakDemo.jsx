// TweakDemo.jsx

import axios from "axios";
import numeral from 'numeral';
import {NumericFormat} from "react-number-format";
import React, {useState, useEffect} from "react";
import {useLocation} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {PagingNode} from "../../fragments/PagingNode.jsx";
import {useStorage} from "../../hooks/useStorage.jsx";
import {Container, Table, Row, Col, Card, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const TweakDemo = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_TWEAK || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [TYPE, setTYPE] = useState("exercisePlan");
  const [PAGING, setPAGING] = useState({
    page: 1,
    limit: 10
  });
  const [COUNT, setCOUNT] = useState({
    inputCnt: 0,
    exercisePlanCnt: 0,
    exerciseCnt: 0,
    foodPlanCnt: 0,
    foodCnt: 0,
    moneyPlanCnt: 0,
    moneyCnt: 0,
    sleepPlanCnt: 0,
    sleepCnt: 0,
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_EXERCISE_PLAN_DEFAULT = [{
    exercise_plan_startDt: "0000-00-00",
    exercise_plan_endDt: "0000-00-00",
    exercise_plan_count: 0,
    exercise_plan_cardio: "00:00",
    exercise_plan_volume: 0,
    exercise_plan_weight: 0,
  }];
  const OBJECT_EXERCISE_DEFAULT = [{
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
  const OBJECT_FOOD_PLAN_DEFAULT = [{
    food_plan_startDt: "0000-00-00",
    food_plan_endDt: "0000-00-00",
    food_plan_kcal: 0,
    food_plan_carb: 0,
    food_plan_protein: 0,
    food_plan_fat: 0,
  }];
  const OBJECT_FOOD_DEFAULT = [{
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
  const OBJECT_MONEY_PLAN_DEFAULT = [{
    money_plan_startDt: "0000-00-00",
    money_plan_endDt: "0000-00-00",
    money_plan_in: 0,
    money_plan_out: 0,
  }];
  const OBJECT_MONEY_DEFAULT = [{
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
  const OBJECT_SLEEP_PLAN_DEFAULT = [{
    sleep_plan_startDt: "0000-00-00",
    sleep_plan_endDt: "0000-00-00",
    sleep_plan_night: "00:00",
    sleep_plan_morning: "00:00",
    sleep_plan_time: "00:00",
  }];
  const OBJECT_SLEEP_DEFAULT = [{
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
  const [OBJECT_EXERCISE_PLAN, setOBJECT_EXERCISE_PLAN] = useState(OBJECT_EXERCISE_PLAN_DEFAULT);
  const [OBJECT_FOOD_PLAN, setOBJECT_FOOD_PLAN] = useState(OBJECT_FOOD_PLAN_DEFAULT);
  const [OBJECT_MONEY_PLAN, setOBJECT_MONEY_PLAN] = useState(OBJECT_MONEY_PLAN_DEFAULT);
  const [OBJECT_SLEEP_PLAN, setOBJECT_SLEEP_PLAN] = useState(OBJECT_SLEEP_PLAN_DEFAULT);
  const [OBJECT_EXERCISE, setOBJECT_EXERCISE] = useState(OBJECT_EXERCISE_DEFAULT);
  const [OBJECT_FOOD, setOBJECT_FOOD] = useState(OBJECT_FOOD_DEFAULT);
  const [OBJECT_MONEY, setOBJECT_MONEY] = useState(OBJECT_MONEY_DEFAULT);
  const [OBJECT_SLEEP, setOBJECT_SLEEP] = useState(OBJECT_SLEEP_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_OBJECT}/list`, {
      params: {
        user_id: user_id,
        PAGING: PAGING,
        TYPE: TYPE
      }
    });
    setOBJECT_EXERCISE_PLAN(response.data.result.exercisePlan || OBJECT_EXERCISE_PLAN_DEFAULT);
    setOBJECT_EXERCISE(response.data.result.exercise || OBJECT_EXERCISE_DEFAULT);
    setOBJECT_FOOD_PLAN(response.data.result.foodPlan || OBJECT_FOOD_PLAN_DEFAULT);
    setOBJECT_FOOD(response.data.result.food || OBJECT_FOOD_DEFAULT);
    setOBJECT_MONEY_PLAN(response.data.result.moneyPlan || OBJECT_MONEY_PLAN_DEFAULT);
    setOBJECT_MONEY(response.data.result.money || OBJECT_MONEY_DEFAULT);
    setOBJECT_SLEEP_PLAN(response.data.result.sleepPlan || OBJECT_SLEEP_PLAN_DEFAULT);
    setOBJECT_SLEEP(response.data.result.sleep || OBJECT_SLEEP_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      exercisePlanCnt: response.data.result.exercisePlanCnt,
      exerciseCnt: response.data.result.exerciseCnt,
      foodPlanCnt: response.data.result.foodPlanCnt,
      foodCnt: response.data.result.foodCnt,
      moneyPlanCnt: response.data.result.moneyPlanCnt,
      moneyCnt: response.data.result.moneyCnt,
      sleepPlanCnt: response.data.result.sleepPlanCnt,
      sleepCnt: response.data.result.sleepCnt,
    }));
  })()}, [user_id, PAGING, TYPE, COUNT?.inputCnt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowAdd = async (type) => {
    const response = await axios.post(`${URL_OBJECT}/add`, {
      user_id: user_id,
      TYPE: type,
      count: COUNT?.inputCnt
    });
    if (response.data.status === "success") {
      alert(response.data.msg);
      setCOUNT((prev) => ({
        ...prev,
        [`${type}Cnt`]: prev[`${type}Cnt`] + 1
      }));
      setPAGING((prev) => ({
        ...prev,
        page: 1
      }));
      navParam("/tweak/demo");
    }
  };

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (type) => {
    const response = await axios.delete(`${URL_OBJECT}/delete`, {
      params: {
        user_id: user_id,
        TYPE: type
      }
    });
    if (response.data.status === "success") {
      alert(response.data.msg);
      setCOUNT((prev) => ({
        ...prev,
        [`${type}Cnt`]: 0
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
    const selectType = () => (
      <React.Fragment>
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
      </React.Fragment>
    );
    const tableExercisePlan = () => (
      <React.Fragment>
        <Table hover responsive className={"border-1"}>
          <thead>
            <tr>
              <th className={"table-thead"}>날짜</th>
              <th className={"table-thead"}>운동횟수</th>
              <th className={"table-thead"}>운동시간</th>
              <th className={"table-thead"}>운동볼륨</th>
              <th className={"table-thead"}>체중</th>
            </tr>
          </thead>
          <tbody>
            {OBJECT_EXERCISE_PLAN?.map((item, index) => (
              <tr key={index}>
                <td>{item.exercise_plan_startDt?.substring(5, 10)}</td>
                <td>{item.exercise_plan_count}</td>
                <td>{item.exercise_plan_cardio}</td>
                <td>{item.exercise_plan_volume}</td>
                <td>{item.exercise_plan_weight}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </React.Fragment>
    );
    const tableExercise = () => (
      <React.Fragment>
        <Table hover responsive className={"border-1"}>
          <thead>
            <tr>
              <th className={"table-thead"}>날짜</th>
              <th className={"table-thead"}>부위</th>
              <th className={"table-thead"}>종목</th>
              <th className={"table-thead"}>세트</th>
              <th className={"table-thead"}>횟수</th>
              <th className={"table-thead"}>중량</th>
            </tr>
          </thead>
          <tbody>
            {OBJECT_EXERCISE?.map((item, index) => (
              <React.Fragment key={item._id}>
                {item.exercise_section.slice(0, 3)?.map((section, sectionIndex) => (
                  <tr key={sectionIndex}>
                    {sectionIndex === 0 && (
                      <td rowSpan={Math.min(item.exercise_section.length, 3)}>
                        {item.exercise_startDt?.substring(5, 10)}
                        {item.exercise_section.length > 3 && (<div>더보기</div>)}
                      </td>
                    )}
                    <td>{section.exercise_part_val.substring(0, 6)}</td>
                    <td>{section.exercise_title_val.substring(0, 6)}</td>
                    {section.exercise_part_val !== "유산소" ? (
                      <React.Fragment>
                        <td>{`${numeral(section.exercise_set).format('0,0')}`}</td>
                        <td>{`${numeral(section.exercise_rep).format('0,0')}`}</td>
                        <td>{`${numeral(section.exercise_kg).format('0,0')}`}</td>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <td colSpan={3}>{section.exercise_cardio}</td>
                      </React.Fragment>
                    )}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </React.Fragment>
    );
    const tableFoodPlan = () => (
      <React.Fragment>
        <Table hover responsive className={"border-1"}>
          <thead>
            <tr>
              <th className={"table-thead"}>날짜</th>
              <th className={"table-thead"}>칼로리</th>
              <th className={"table-thead"}>탄수화물</th>
              <th className={"table-thead"}>단백질</th>
              <th className={"table-thead"}>지방</th>
            </tr>
          </thead>
          <tbody>
            {OBJECT_FOOD_PLAN?.map((item, index) => (
              <tr key={index}>
                <td>{item.food_plan_startDt?.substring(5, 10)}</td>
                <td>{item.food_plan_kcal}</td>
                <td>{item.food_plan_carb}</td>
                <td>{item.food_plan_protein}</td>
                <td>{item.food_plan_fat}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </React.Fragment>
    );
    const tableFood = () => (
      <React.Fragment>
        <Table hover responsive className={"border-1"}>
          <thead>
            <tr>
              <th className={"table-thead"}>날짜</th>
              <th className={"table-thead"}>분류</th>
              <th className={"table-thead"}>식품명</th>
              <th className={"table-thead"}>칼로리</th>
            </tr>
          </thead>
          <tbody>
            {OBJECT_FOOD?.map((item, index) => (
              <React.Fragment key={item._id}>
                {item.food_section.slice(0, 3)?.map((section, sectionIndex) => (
                  <React.Fragment key={sectionIndex}>
                    <tr>
                      {sectionIndex === 0 && (
                        <td rowSpan={Math.min(item.food_section.length, 3)}>
                          {item.food_startDt?.substring(5, 10)}
                          {item.food_section.length > 3 && (<div>더보기</div>)}
                        </td>
                      )}
                      <td>{section.food_part_val.substring(0, 6)}</td>
                      <td>{section.food_title.substring(0, 6)}</td>
                      <td>{`${numeral(section.food_kcal).format('0,0')} kcal`}</td>
                    </tr>
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </React.Fragment>
    );
    const tableMoneyPlan = () => (
      <React.Fragment>
        <Table hover responsive className={"border-1"}>
          <thead>
            <tr>
              <th className={"table-thead"}>날짜</th>
              <th className={"table-thead"}>수입</th>
              <th className={"table-thead"}>지출</th>
            </tr>
          </thead>
          <tbody>
            {OBJECT_MONEY_PLAN?.map((item, index) => (
              <tr key={index}>
                <td>{item.money_plan_startDt?.substring(5, 10)}</td>
                <td>{item.money_plan_in}</td>
                <td>{item.money_plan_out}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </React.Fragment>
    );
    const tableMoney = () => (
      <React.Fragment>
        <Table hover responsive className={"border-1"}>
          <thead>
            <tr>
              <th className={"table-thead"}>날짜</th>
              <th className={"table-thead"}>분류</th>
              <th className={"table-thead"}>항목</th>
              <th className={"table-thead"}>금액</th>
            </tr>
          </thead>
          <tbody>
            {OBJECT_MONEY?.map((item, index) => (
              item.money_section.slice(0, 3)?.map((section, sectionIndex) => (
                <React.Fragment key={sectionIndex}>
                  <tr>
                    {sectionIndex === 0 && (
                      <td rowSpan={Math.min(item.money_section.length, 3)}>
                        {item.money_startDt?.substring(5, 10)}
                        {item.money_section.length > 3 && (<div>더보기</div>)}
                      </td>
                    )}
                    <td>{section.money_part_val}</td>
                    <td>{section.money_title_val}</td>
                    <td>{`₩ ${numeral(section.money_amount).format('0,0')}`}</td>
                  </tr>
                </React.Fragment>
              ))
            ))}
          </tbody>
        </Table>
      </React.Fragment>
    );
    const tableSleepPlan = () => (
      <React.Fragment>
        <Table hover responsive className={"border-1"}>
          <thead>
            <tr>
              <th className={"table-thead"}>날짜</th>
              <th className={"table-thead"}>취침</th>
              <th className={"table-thead"}>기상</th>
              <th className={"table-thead"}>수면</th>
            </tr>
          </thead>
          <tbody>
            {OBJECT_SLEEP_PLAN?.map((item, index) => (
              <tr key={index}>
                <td>{item.sleep_plan_startDt?.substring(5, 10)}</td>
                <td>{item.sleep_plan_night}</td>
                <td>{item.sleep_plan_morning}</td>
                <td>{item.sleep_plan_time}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </React.Fragment>
    );
    const tableSleep = () => (
      <React.Fragment>
        <Table hover responsive className={"border-1"}>
          <thead>
            <tr>
              <th className={"table-thead"}>날짜</th>
              <th className={"table-thead"}>취침</th>
              <th className={"table-thead"}>기상</th>
              <th className={"table-thead"}>수면</th>
            </tr>
          </thead>
          <tbody>
            {OBJECT_SLEEP?.map((item, index) => (
              <React.Fragment key={item._id}>
                {item.sleep_section?.slice(0, 3)?.map((section, sectionIndex) => (
                  <React.Fragment key={sectionIndex}>
                    <tr>
                      {sectionIndex === 0 && (
                        <td rowSpan={Math.min(item.sleep_section.length, 3)}>
                          {item.sleep_startDt?.substring(5, 10)}
                          {item.sleep_section.length > 3 && (<div>더보기</div>)}
                        </td>
                      )}
                      <td>{section.sleep_night}</td>
                      <td>{section.sleep_morning}</td>
                      <td>{section.sleep_time}</td>
                    </tr>
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </React.Fragment>
    );
    const inputCount = () => (
      <React.Fragment>
        <NumericFormat
          min={0}
          max={10}
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
          value={Math.min(10, COUNT?.inputCnt)}
          onValueChange={(values) => (
            setCOUNT((prev) => ({
              ...prev,
              inputCnt: Number(values.value)
            }))
          )}
        ></NumericFormat>
      </React.Fragment>
    );
    const btnAdd = () => (
      <React.Fragment>
        <Button variant={"outline-secondary"} size={"sm"} onClick={() => (
          flowAdd(TYPE)
        )}>
          추가
        </Button>
      </React.Fragment>
    );
    const btnDelete = () => (
      <React.Fragment>
        <Button variant={"outline-secondary"} size={"sm"} onClick={() => (
          flowDelete(TYPE)
        )}>
          삭제
        </Button>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <div className={"date-wrapper"}>
          {selectType()}
        </div>
        <div className={"table-wrapper"}>
          {TYPE === "exercisePlan" && tableExercisePlan()}
          {TYPE === "exercise" && tableExercise()}
          {TYPE === "foodPlan" && tableFoodPlan()}
          {TYPE === "food" && tableFood()}
          {TYPE === "moneyPlan" && tableMoneyPlan()}
          {TYPE === "money" && tableMoney()}
          {TYPE === "sleepPlan" && tableSleepPlan()}
          {TYPE === "sleep" && tableSleep()}
        </div>
        <div className={"input-wrapper"}>
          {inputCount()}
        </div>
        <div className={"btn-wrapper"}>
          {btnAdd()}
          {btnDelete()}
        </div>
      </React.Fragment>
    );
  };

  // 7. paging ------------------------------------------------------------------------------------>
  const pagingNode = () => (
    <PagingNode PAGING={PAGING} setPAGING={setPAGING} COUNT={COUNT} setCOUNT={setCOUNT}
      part={""} plan={""} type={"list"}
    />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Card className={"card-wrapper"}>
        <Container fluid={true}>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
              {tableNode()}
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
              {pagingNode()}
            </Col>
          </Row>
        </Container>
      </Card>
    </React.Fragment>
  );
};
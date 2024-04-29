// FoodPlanSave.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {NumericFormat} from "react-number-format";
import {percent} from "../../assets/js/percent.js";
import {useDate} from "../../assets/hooks/useDate.jsx";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {DateNode} from "../../fragments/DateNode.jsx";
import {ButtonNode} from "../../fragments/ButtonNode.jsx";
import {Container, Row, Col, Card} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const FoodPlanSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const customer_id = sessionStorage.getItem("customer_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      refresh: 0,
      startDt: "0000-00-00",
      endDt: "0000-00-00",
      toList:"/food/plan/list"
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );
  const {val:COUNT, set:setCOUNT} = useStorage(
    `COUNT(${PATH})`, {
      totalCnt: 0,
      sectionCnt: 0
    }
  );
  const {val:CALENDAR, set:setCALENDAR} = useStorage(
    `CALENDAR(${PATH})`, {
      calStartOpen: false,
      calEndOpen: false,
      calOpen: false,
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEFAULT = {
    _id: "",
    food_plan_number: 0,
    food_plan_startDt: "0000-00-00",
    food_plan_endDt: "0000-00-00",
    food_plan_kcal: 0,
    food_plan_carb: 0,
    food_plan_protein: 0,
    food_plan_fat: 0,
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_OBJECT}/plan/detail`, {
      params: {
        customer_id: customer_id,
        _id: "",
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setOBJECT(response.data.result || OBJECT_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0,
    }));
  })()}, [customer_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_OBJECT}/plan/save`, {
      customer_id: customer_id,
      OBJECT: OBJECT,
      duration: `${DATE.startDt} ~ ${DATE.endDt}`,
    });
    if (response.data.status === "success") {
      alert(response.data.msg);
      percent();
      SEND.startDt = DATE.startDt;
      SEND.endDt = DATE.endDt;
      navParam(SEND.toList, {
        state: SEND
      });
    }
    else {
      alert(response.data.msg);
    }
  };

  // 4. date -------------------------------------------------------------------------------------->
  const dateNode = () => {
    return (
      <DateNode DATE={DATE} setDATE={setDATE} part={"food"} plan={"plan"} type={"save"} />
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <Row className={"d-center"}>
        <Col lg={6} md={6} sm={6} xs={6} className={"mb-20"}>
          <div className={"input-group"}>
            <span className={"input-group-text"}>칼로리</span>
            <NumericFormat
              min={1}
              max={9999}
              minLength={1}
              maxLength={9}
              suffix={" kcal"}
              id={"food_plan_kcal"}
              name={"food_plan_kcal"}
              datatype={"number"}
              displayType={"input"}
              className={"form-control"}
              disabled={false}
              allowNegative={false}
              fixedDecimalScale={true}
              thousandSeparator={true}
              value={Math.min(9999, OBJECT?.food_plan_kcal)}
              onValueChange={(values) => {
                const limitedValue = Math.min(9999, parseInt(values.value));
                setOBJECT((prev) => ({
                  ...prev,
                  food_plan_kcal: limitedValue
                }));
              }}
            ></NumericFormat>
          </div>
        </Col>
        <Col lg={6} md={6} sm={6} xs={6}>
          <div className={"input-group"}>
            <span className={"input-group-text"}>탄수화물</span>
            <NumericFormat
              min={0}
              max={9999}
              minLength={1}
              maxLength={6}
              suffix={" g"}
              id={"food_plan_carb"}
              name={"food_plan_carb"}
              datatype={"number"}
              displayType={"input"}
              className={"form-control"}
              disabled={false}
              allowNegative={false}
              fixedDecimalScale={true}
              thousandSeparator={true}
              value={Math.min(999, OBJECT?.food_plan_carb)}
              onValueChange={(values) => {
                const limitedValue = Math.min(999, parseInt(values.value));
                setOBJECT((prev) => ({
                  ...prev,
                  food_plan_carb: limitedValue
                }));
              }}
            ></NumericFormat>
          </div>
        </Col>
        <Col lg={6} md={6} sm={6} xs={6}>
          <div className={"input-group"}>
            <span className={"input-group-text"}>단백질</span>
            <NumericFormat
              min={0}
              max={9999}
              minLength={1}
              maxLength={6}
              suffix={" g"}
              id={"food_plan_protein"}
              name={"food_plan_protein"}
              datatype={"number"}
              displayType={"input"}
              className={"form-control"}
              disabled={false}
              allowNegative={false}
              fixedDecimalScale={true}
              thousandSeparator={true}
              value={Math.min(999, OBJECT?.food_plan_protein)}
              onValueChange={(values) => {
                const limitedValue = Math.min(999, parseInt(values.value));
                setOBJECT((prev) => ({
                  ...prev,
                  food_plan_protein: limitedValue
                }));
              }}
            ></NumericFormat>
          </div>
        </Col>
        <Col lg={6} md={6} sm={6} xs={6}>
          <div className={"input-group"}>
            <span className={"input-group-text"}>지방</span>
            <NumericFormat
              min={0}
              max={9999}
              minLength={1}
              maxLength={6}
              suffix={" g"}
              id={"food_plan_fat"}
              name={"food_plan_fat"}
              datatype={"number"}
              displayType={"input"}
              className={"form-control"}
              disabled={false}
              allowNegative={false}
              fixedDecimalScale={true}
              thousandSeparator={true}
              value={Math.min(999, OBJECT?.food_plan_fat)}
              onValueChange={(values) => {
                const limitedValue = Math.min(999, parseInt(values.value));
                setOBJECT((prev) => ({
                  ...prev,
                  food_plan_fat: limitedValue
                }));
              }}
            ></NumericFormat>
          </div>
        </Col>
      </Row>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
  return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
        flowSave={flowSave} navParam={navParam} part={"food"} plan={"plan"} type={"save"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"root-wrapper"}>
        <Card className={"container-wrapper"} border={"light"}>
          <Container>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12} className={"d-center mb-20"}>
                {dateNode()}
              </Col>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center mb-20"}>
                {tableNode()}
              </Col>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center mb-20"}>
                {buttonNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};

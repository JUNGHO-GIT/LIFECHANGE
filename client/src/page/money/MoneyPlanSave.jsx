// MoneyPlanSave.jsx

import axios from "axios";
import InputMask from "react-input-mask";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {NumericFormat} from "react-number-format";
import {percent} from "../../assets/js/percent.js";
import {useDate} from "../../hooks/useDate.jsx";
import {useStorage} from "../../hooks/useStorage.jsx";
import {DateNode} from "../../fragments/DateNode.jsx";
import {ButtonNode} from "../../fragments/ButtonNode.jsx";
import {Container, Row, Col, Card} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const MoneyPlanSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
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
      toList:"/money/plan/list"
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
    money_plan_number: 0,
    money_plan_startDt: "0000-00-00",
    money_plan_endDt: "0000-00-00",
    money_plan_in: 0,
    money_plan_out: 0
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

  // 4. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const dateSection = () => (
      <React.Fragment>
        <Row className={"d-center"}>
          <Col lg={6} md={6} sm={6} xs={6}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>시작일</span>
              <InputMask
                mask={"9999-99-99"}
                id={"diary_startDt"}
                name={"diary_startDt"}
                className={"form-control"}
                maskChar={null}
                value={DATE?.startDt}
                readOnly={true}
                onClick={() => {
                  setCALENDAR((prev) => ({
                    ...prev,
                    calStartOpen: !prev.calStartOpen
                  }));
                }}
              ></InputMask>
            </div>
          </Col>
          <Col lg={6} md={6} sm={6} xs={6}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>종료일</span>
              <InputMask
                mask={"9999-99-99"}
                id={"diary_endDt"}
                name={"diary_endDt"}
                className={"form-control"}
                maskChar={null}
                value={DATE?.endDt}
                readOnly={true}
                onClick={() => {
                  setCALENDAR((prev) => ({
                    ...prev,
                    calEndOpen: !prev.calEndOpen
                  }));
                }}
              ></InputMask>
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
    const tableSection = () => (
      <React.Fragment>
        <Row>
          <Col lg={6} md={6} sm={6} xs={6}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>목표 수입</span>
              <NumericFormat
                min={0}
                max={99999999999999}
                minLength={1}
                maxLength={17}
                prefix={"₩  "}
                datatype={"number"}
                displayType={"input"}
                id={"money_plan_in"}
                name={"money_plan_in"}
                className={"form-control"}
                readOnly={false}
                disabled={false}
                allowNegative={false}
                thousandSeparator={true}
                fixedDecimalScale={true}
                value={Math.min(99999999999999, OBJECT?.money_plan_in)}
                onValueChange={(values) => {
                  const limitedValue = Math.min(99999999999999, parseInt(values?.value));
                  setOBJECT((prev) => ({
                    ...prev,
                    money_plan_in: limitedValue
                  }));
                }}
              ></NumericFormat>
            </div>
          </Col>
          <Col lg={6} md={6} sm={6} xs={6}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>목표 지출</span>
              <NumericFormat
                min={0}
                max={99999999999999}
                minLength={1}
                maxLength={17}
                prefix={"₩  "}
                datatype={"number"}
                displayType={"input"}
                id={"money_plan_out"}
                name={"money_plan_out"}
                className={"form-control"}
                readOnly={false}
                disabled={false}
                allowNegative={false}
                thousandSeparator={true}
                fixedDecimalScale={true}
                value={Math.min(99999999999999, OBJECT?.money_plan_out)}
                onValueChange={(values) => {
                  const limitedValue = Math.min(99999999999999, parseInt(values?.value));
                  setOBJECT((prev) => ({
                    ...prev,
                    money_plan_out: limitedValue
                  }));
                }}
              ></NumericFormat>
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <div className={"date-wrapper"}>
          {dateSection()}
        </div>
        <div className={"save-wrapper"}>
          {tableSection()}
        </div>
      </React.Fragment>
    );
  };

  // 5. date -------------------------------------------------------------------------------------->
  const dateNode = () => (
    <DateNode DATE={DATE} setDATE={setDATE} CALENDAR={CALENDAR} setCALENDAR={setCALENDAR}
      part={"money"} plan={"plan"} type={"save"}
    />
  );

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => (
    <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
      SEND={SEND}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={flowSave} navParam={navParam} part={"money"} plan={"plan"} type={"save"}
    />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Card className={"card-wrapper"}>
        <Container fluid={true}>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12} className={"d-center"}>
              {dateNode()}
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
              {tableNode()}
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
              {buttonNode()}
            </Col>
          </Row>
        </Container>
      </Card>
    </React.Fragment>
  );
};

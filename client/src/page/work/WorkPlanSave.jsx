// WorkPlanSave.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {TimePicker} from "react-time-picker";
import {NumericFormat} from "react-number-format";
import {useDate} from "../../assets/hooks/useDate.jsx";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {DateNode} from "../../assets/fragments/DateNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";
import {Container, Table, FormGroup, FormLabel, FormCheck, Form, ButtonGroup, Button, CardGroup, Card, Row, Col} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const WorkPlanSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_WORK_PLAN = process.env.REACT_APP_URL_WORK_PLAN;
  const user_id = window.sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      startDt: "",
      endDt: "",
      refresh:0,
      toList:"/work/plan/list"
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
  const WORK_PLAN_DEFAULT = {
    _id: "",
    work_plan_number: 0,
    work_plan_startDt: "",
    work_plan_endDt: "",
    work_plan_total_count: 0,
    work_plan_total_cardio: "",
    work_plan_total_volume: 0,
    work_plan_body_weight: 0,
  };
  const [WORK_PLAN, setWORK_PLAN] = useState(WORK_PLAN_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_WORK_PLAN}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        work_plan_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setWORK_PLAN(response.data.result || WORK_PLAN_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0,
    }));
  })()}, [user_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_WORK_PLAN}/save`, {
      user_id: user_id,
      WORK_PLAN: WORK_PLAN,
      work_plan_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
    });
    if (response.data.status === "success") {
      alert(response.data.msg);
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
      <DateNode DATE={DATE} setDATE={setDATE} part={"work"} plan={"plan"} type={"save"} />
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <Row className={"d-center"}>
        <Col xs={6} className={"mb-20"}>
          <FormGroup className={"input-group"}>
            <Form.Label className={"input-group-text"}>목표 운동 횟수</Form.Label>
            <NumericFormat
              min={0}
              max={999}
              minLength={1}
              maxLength={5}
              id={"work_count"}
              name={"work_count"}
              suffix={" 회"}
              datatype={"number"}
              displayType={"input"}
              className={"form-control"}
              disabled={false}
              allowNegative={false}
              thousandSeparator={true}
              fixedDecimalScale={true}
              value={Math.min(999, WORK_PLAN?.work_plan_total_count)}
              onValueChange={(values) => {
                const limitedValue = Math.min(999, parseInt(values?.value));
                setWORK_PLAN((prev) => ({
                  ...prev,
                  work_plan_total_count: limitedValue
                }));
              }}
            ></NumericFormat>
          </FormGroup>
        </Col>
        <Col xs={6}>
          <FormGroup className={"input-group"}>
            <Form.Label className={"input-group-text"}>목표 유산소 시간</Form.Label>
            <TimePicker
              locale={"ko"}
              format={"HH:mm"}
              id={"work_cardio"}
              name={"work_cardio"}
              className={"form-control"}
              disabled={false}
              clockIcon={null}
              disableClock={false}
              value={WORK_PLAN?.work_plan_total_cardio}
              onChange={(e) => {
                setWORK_PLAN((prev) => ({
                  ...prev,
                  work_plan_total_cardio: e ? e.toString() : ""
                }));
              }}
            ></TimePicker>
          </FormGroup>
        </Col>
        <Col xs={6}>
          <FormGroup className={"input-group"}>
            <Form.Label className={"input-group-text"}>목표 총 볼륨</Form.Label>
            <NumericFormat
              min={0}
              max={999999}
              minLength={1}
              maxLength={12}
              suffix={" vol"}
              datatype={"number"}
              displayType={"input"}
              id={"work_volume"}
              name={"work_volume"}
              className={"form-control"}
              allowNegative={false}
              fixedDecimalScale={true}
              thousandSeparator={true}
              allowLeadingZeros={false}
              value={Math.min(999999, WORK_PLAN?.work_plan_total_volume)}
              onValueChange={(values) => {
                const limitedValue = Math.min(999999, parseInt(values?.value));
                setWORK_PLAN((prev) => ({
                  ...prev,
                  work_plan_total_volume: limitedValue
                }));
              }}
            ></NumericFormat>
          </FormGroup>
        </Col>
        <Col xs={6}>
          <FormGroup className={"input-group"}>
            <Form.Label className={"input-group-text"}>목표 체중</Form.Label>
            <NumericFormat
              min={0}
              max={999}
              minLength={1}
              maxLength={6}
              suffix={" kg"}
              datatype={"number"}
              displayType={"input"}
              id={"work_weight"}
              name={"work_weight"}
              className={"form-control"}
              allowNegative={false}
              thousandSeparator={true}
              fixedDecimalScale={true}
              allowLeadingZeros={false}
              value={Math.min(999, WORK_PLAN?.work_plan_body_weight)}
              onValueChange={(values) => {
                const limitedValue = Math.min(999, parseInt(values?.value));
                setWORK_PLAN((prev) => ({
                  ...prev,
                  work_plan_body_weight: limitedValue
                }));
              }}
            ></NumericFormat>
          </FormGroup>
        </Col>
      </Row>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
        <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} flowSave={flowSave} navParam={navParam}
        part={"work"} plan={"plan"} type={"save"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <CardGroup className={"root-wrapper"}>
        <Container fluid className={"container-wrapper"}>
          <Row className={"d-center"}>
            <Col xs={12} className={"mb-20"}>
              <h1>Save</h1>
            </Col>
            <Col xs={12} className={"mb-20"}>
              {dateNode()}
            </Col>
            <Col xs={12} className={"mb-20"}>
              {tableNode()}
            </Col>
            <Col xs={12} className={"mb-20"}>
              {buttonNode()}
            </Col>
          </Row>
        </Container>
      </CardGroup>
    </React.Fragment>
  );
};

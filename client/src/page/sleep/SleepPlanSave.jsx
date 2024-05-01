// SleepPlanSave.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {TimePicker} from "react-time-picker";
import {percent} from "../../assets/js/percent.js";
import {useDate} from "../../hooks/useDate.jsx";
import {useStorage} from "../../hooks/useStorage.jsx";
import {useTime} from "../../hooks/useTime.jsx";
import {DateNode} from "../../fragments/DateNode.jsx";
import {ButtonNode} from "../../fragments/ButtonNode.jsx";
import {Container, Row, Col, Card} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const SleepPlanSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_SLEEP || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const customer_id = sessionStorage.getItem("customer_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      refresh: 0,
      startDt: "0000-00-00",
      endDt: "0000-00-00",
      toList:"/sleep/plan/list"
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
    sleep_plan_number: 0,
    sleep_plan_startDt: "0000-00-00",
    sleep_plan_endDt: "0000-00-00",
    sleep_plan_night: "00:00",
    sleep_plan_morning: "00:00",
    sleep_plan_time: "00:00",
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);
  useTime(OBJECT, setOBJECT, PATH, "plan");

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
      sectionCnt: response.data.sectionCnt || 0
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
    const tableSection = () => (
      <React.Fragment>
        <Row className={"d-center"}>
          <Col lg={12} md={12} sm={12} xs={12}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>취침</span>
              <TimePicker
                locale={"ko"}
                format={"HH:mm"}
                id={"sleep_plan_night"}
                name={"sleep_plan_night"}
                className={"form-control"}
                clockIcon={null}
                disabled={false}
                disableClock={false}
                value={OBJECT?.sleep_plan_night}
                onChange={(e) => {
                  setOBJECT((prev) => ({
                    ...prev,
                    sleep_plan_night: e ? e.toString() : "",
                  }));
                }}
              ></TimePicker>
            </div>
          </Col>
          <Col lg={12} md={12} sm={12} xs={12}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>기상</span>
              <TimePicker
                locale={"ko"}
                format={"HH:mm"}
                id={"sleep_plan_morning"}
                name={"sleep_plan_morning"}
                className={"form-control"}
                clockIcon={null}
                disabled={false}
                disableClock={false}
                value={OBJECT?.sleep_plan_morning}
                onChange={(e) => {
                  setOBJECT((prev) => ({
                    ...prev,
                    sleep_plan_morning: e ? e.toString() : "",
                  }));
                }}
              ></TimePicker>
            </div>
          </Col>
          <Col lg={12} md={12} sm={12} xs={12}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>수면</span>
              <TimePicker
                locale={"ko"}
                format={"HH:mm"}
                id={"sleep_plan_time"}
                name={"sleep_plan_time"}
                className={"form-control"}
                disabled={true}
                clockIcon={null}
                disableClock={false}
                value={OBJECT?.sleep_plan_time}
              ></TimePicker>
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <div className={"save-wrapper"}>
          {tableSection()}
        </div>
      </React.Fragment>
    );
  };

  // 5. date -------------------------------------------------------------------------------------->
  const dateNode = () => (
    <DateNode DATE={DATE} setDATE={setDATE} part={"sleep"} plan={"plan"} type={"save"} />
  );

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => (
    <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
      SEND={SEND}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={flowSave} navParam={navParam} part={"sleep"} plan={"plan"} type={"save"}
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

// SleepPlanSave.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {TimePicker} from "react-time-picker";
import {useDate} from "../../assets/hooks/useDate.jsx";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {useTime} from "../../assets/hooks/useTime.jsx";
import {DateNode} from "../../assets/fragments/DateNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";
import {Container, Row, Col, Card} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const SleepPlanSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_OBJECT = process.env.REACT_APP_URL_SLEEP;
  const customer_id = window.sessionStorage.getItem("customer_id");
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
        _id: "",
        customer_id: customer_id,
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
      <DateNode DATE={DATE} setDATE={setDATE} part={"sleep"} plan={"plan"} type={"save"} />
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <Row className={"d-center"}>
        <Col xs={12}>
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
        <Col xs={12}>
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
        <Col xs={12}>
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
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND}  FILTER={""} setFILTER={""} flowSave={flowSave} navParam={navParam}
        part={"sleep"} plan={"plan"} type={"save"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"root-wrapper"}>
        <Card className={"container-wrapper"} border={"light"}>
          <Container>
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
        </Card>
      </div>
    </React.Fragment>
  );
};
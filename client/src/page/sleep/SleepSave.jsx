// SleepSave.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {TimePicker} from "react-time-picker";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {useTime} from "../../assets/hooks/useTime.jsx";
import {useDate} from "../../assets/hooks/useDate.jsx";
import {DateNode} from "../../assets/fragments/DateNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";
import {Container, Table, FormGroup, FormLabel, Form, ButtonGroup, Button, CardGroup, Card, Row, Col} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const SleepSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const user_id = window.sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      startDt: "",
      endDt: "",
      refresh: 0,
      toList:"/sleep/list"
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
  const SLEEP_DEFAULT = {
    _id: "",
    sleep_number: 0,
    sleep_startDt: "",
    sleep_endDt: "",
    sleep_section: [{
      sleep_night: "",
      sleep_morning: "",
      sleep_time: "",
    }],
  };
  const [SLEEP, setSLEEP] = useState(SLEEP_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);
  useTime(SLEEP, setSLEEP, PATH, "real");

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_SLEEP}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        sleep_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setSLEEP(response.data.result || SLEEP_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0
    }));
  })()}, [user_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_SLEEP}/save`, {
      user_id: user_id,
      SLEEP: SLEEP,
      sleep_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
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
      <DateNode DATE={DATE} setDATE={setDATE} part={"sleep"} plan={""} type={"save"} />
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    function sleepNode () {
      return (
        <Row className={"d-center"}>
          <Col xs={12}>
            <FormGroup className={"input-group"}>
              <Form.Label className={"input-group-text"}>취침</Form.Label>
              <TimePicker
                locale={"ko"}
                format={"HH:mm"}
                id={"sleep_night"}
                name={"sleep_night"}
                className={"form-control"}
                clockIcon={null}
                disabled={false}
                disableClock={false}
                value={SLEEP?.sleep_section[0]?.sleep_night}
                onChange={(e) => {
                  setSLEEP((prev) => ({
                    ...prev,
                    sleep_section: [{
                      ...prev?.sleep_section[0],
                      sleep_night: e ? e.toString() : "",
                    }],
                  }));
                }}
              ></TimePicker>
            </FormGroup>
          </Col>
          <Col xs={12}>
            <FormGroup className={"input-group"}>
              <Form.Label className={"input-group-text"}>기상</Form.Label>
              <TimePicker
                locale={"ko"}
                format={"HH:mm"}
                id={"sleep_morning"}
                name={"sleep_morning"}
                className={"form-control"}
                clockIcon={null}
                disabled={false}
                disableClock={false}
                value={SLEEP?.sleep_section[0]?.sleep_morning}
                onChange={(e) => {
                  setSLEEP((prev) => ({
                    ...prev,
                    sleep_section: [{
                      ...prev?.sleep_section[0],
                      sleep_morning: e ? e.toString() : "",
                    }],
                  }));
                }}
              ></TimePicker>
            </FormGroup>
          </Col>
          <Col xs={12}>
            <FormGroup className={"input-group"}>
              <Form.Label className={"input-group-text"}>수면</Form.Label>
              <TimePicker
                locale={"ko"}
                format={"HH:mm"}
                id={"sleep_time"}
                name={"sleep_time"}
                className={"form-control"}
                disabled={true}
                clockIcon={null}
                disableClock={false}
                value={SLEEP?.sleep_section[0]?.sleep_time}
              ></TimePicker>
            </FormGroup>
          </Col>
        </Row>
      );
    };
    return (
      <Row className={"d-center"}>
        <Col xs={8} className={"mb-20"}>
          {sleepNode()}
        </Col>
      </Row>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
        <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} flowSave={flowSave} navParam={navParam}
        part={"sleep"} plan={""} type={"save"}
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

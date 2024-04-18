// WorkSave.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {TimePicker} from "react-time-picker";
import {NumericFormat} from "react-number-format";
import {useTime} from "../../assets/hooks/useTime.jsx";
import {useDate} from "../../assets/hooks/useDate.jsx";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {DateNode} from "../../assets/fragments/DateNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";
import {Container, Table, FormGroup, FormLabel, Form, ButtonGroup, Button, CardGroup, Card, Row, Col} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const WorkSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  const user_id = window.sessionStorage.getItem("user_id");
  const session = window.sessionStorage.getItem("dataset") || "";
  const workArray = JSON.parse(session)?.work || [];
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
      toList:"/work/list"
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
  const WORK_DEFAULT = {
    _id: "",
    work_number: 0,
    work_startDt: "",
    work_endDt: "",
    work_start: "",
    work_end: "",
    work_time: "",
    work_total_volume: 0,
    work_total_cardio: "",
    work_body_weight: 0,
    work_section: [{
      work_part_idx: 0,
      work_part_val: "전체",
      work_title_idx: 0,
      work_title_val: "전체",
      work_set: 1,
      work_rep: 1,
      work_kg: 1,
      work_rest: 1,
      work_volume: 0,
      work_cardio: "",
    }],
  };
  const [WORK, setWORK] = useState(WORK_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);
  useTime(WORK, setWORK, PATH, "real");

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_WORK}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        work_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setWORK(response.data.result || WORK_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0,
    }));
  })()}, [user_id, DATE.startDt, DATE.endDt]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    let sectionVolume = 0;
    let totalVolume = 0;
    let totalMinutes = 0;

    const timeFormat = (data) => {
      if (!data) {
        return 0;
      }
      else if (typeof data === "string") {
        const time = data.split(":");
        if (time.length === 2) {
          const hours = parseInt(time[0], 10) * 60;
          const minutes = parseInt(time[1], 10);
          return hours + minutes;
        }
        else {
          return 0;
        }
      }
      else {
        return 0;
      }
    };

    const updatedSections = WORK.work_section.map((item) => {
      sectionVolume = item.work_set * item.work_rep * item.work_kg;
      totalVolume += sectionVolume;
      totalMinutes += timeFormat(item.work_cardio);
      return {
        ...item,
        work_volume: sectionVolume
      };
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const cardioTime = `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;

    // 이전 상태와 비교
    if (WORK.work_total_volume !== totalVolume || WORK.work_total_cardio !== cardioTime) {
      setWORK({
        ...WORK,
        work_total_volume: totalVolume,
        work_total_cardio: cardioTime,
        work_section: updatedSections,
      });
    }
  }, [WORK?.work_section]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_WORK}/save`, {
      user_id: user_id,
      WORK: WORK,
      work_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
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
      <DateNode DATE={DATE} setDATE={setDATE} part={"work"} plan={""} type={"save"} />
    );
  };

  // 5. handler ----------------------------------------------------------------------------------->
  const handlerSectionCount = () => {
    function handlerCount (e) {
      let newCount = parseInt(e, 10);
      let defaultSection = {
        work_part_idx: 0,
        work_part_val: "전체",
        work_title_idx: 0,
        work_title_val: "전체",
        work_set: 1,
        work_rep: 1,
        work_kg: 1,
        work_rest: 1,
        work_volume: 0,
        work_cardio: "",
      };

      setCOUNT((prev) => ({
        ...prev,
        sectionCnt: newCount
      }));

      if (newCount > 0) {
        let updatedSections = Array(newCount).fill(null).map((_, idx) =>
          idx < WORK.work_section.length ? WORK.work_section[idx] : defaultSection
        );
        setWORK((prev) => ({
          ...prev,
          work_section: updatedSections
        }));
      }
      else {
        setWORK((prev) => ({
          ...prev,
          work_section: []
        }));
      }
    }
    function inputFragment () {
      return (
        <Row className={"d-center"}>
          <Col xs={4}>
            <NumericFormat
              min={0}
              max={10}
              minLength={1}
              maxLength={2}
              datatype={"number"}
              displayType={"input"}
              className={"form-control mb-30"}
              id={"sectionCnt"}
              name={"sectionCnt"}
              disabled={false}
              thousandSeparator={false}
              fixedDecimalScale={true}
              value={Math.min(10, COUNT?.sectionCnt)}
              onValueChange={(values) => {
                const limitedValue = Math.min(10, parseInt(values?.value));
                handlerCount(limitedValue.toString());
              }}
            ></NumericFormat>
          </Col>
        </Row>
      );
    };
    return (
      <React.Fragment>
        {inputFragment()}
      </React.Fragment>
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    function tableSection (i) {
      return (
        <React.Fragment key={i}>
          <Row className={"d-center"}>
            <Col xs={6}>
              <FormGroup className={"input-group"}>
                <Form.Label className={"input-group-text"}>부위</Form.Label>
                <select
                  id={`work_part_idx-${i}`}
                  name={`work_part_idx-${i}`}
                  className={"form-control"}
                  value={WORK?.work_section[i]?.work_part_idx}
                  onChange={(e) => {
                    const newIndex = parseInt(e.target.value);
                    setWORK((prev) => {
                      let updated = {...prev};
                      let updatedSection = [...updated.work_section];
                      updatedSection[i] = {
                        ...updatedSection[i],
                        work_part_idx: newIndex,
                        work_part_val: workArray[newIndex].work_part,
                        work_title_idx: 0,
                        work_title_val: workArray[newIndex].work_title[0],
                      };
                      updated.work_section = updatedSection;
                      return updated;
                    });
                  }}
                >
                  {workArray?.map((item, idx) => (
                    <option key={idx} value={idx}>
                      {item.work_part}
                    </option>
                  ))}
                </select>
              </FormGroup>
            </Col>
            <Col xs={6}>
              <FormGroup className={"input-group"}>
                <Form.Label className={"input-group-text"}>타이틀</Form.Label>
                <select
                  id={`work_title_idx-${i}`}
                  name={`work_title_idx-${i}`}
                  className={"form-control"}
                  value={WORK?.work_section[i]?.work_title_idx}
                  onChange={(e) => {
                    const newTitleIdx = parseInt(e.target.value);
                    const newTitleVal = workArray[WORK?.work_section[i]?.work_part_idx]?.work_title[newTitleIdx];
                    if (newTitleIdx >= 0 && newTitleVal) {
                      setWORK((prev) => {
                        let updated = {...prev};
                        let updatedSection = [...updated.work_section];
                        updatedSection[i] = {
                          ...updatedSection[i],
                          work_title_idx: newTitleIdx,
                          work_title_val: newTitleVal,
                        };
                        updated.work_section = updatedSection;
                        return updated;
                      });
                    }
                  }}
                >
                  {workArray[WORK?.work_section[i]?.work_part_idx]?.work_title?.map((title, idx) => (
                    <option key={idx} value={idx}>
                      {title}
                    </option>
                  ))}
                </select>
              </FormGroup>
            </Col>
          </Row>
          <Row className={"d-center"}>
            <Col xs={3}>
              <FormGroup className={"input-group"}>
                <Form.Label className={"input-group-text"}>세트</Form.Label>
                <NumericFormat
                  min={1}
                  max={99}
                  minLength={1}
                  maxLength={6}
                  suffix={" set"}
                  datatype={"number"}
                  displayType={"input"}
                  className={"form-control"}
                  id={`work_set-${i}`}
                  name={`work_set-${i}`}
                  allowNegative={false}
                  thousandSeparator={true}
                  fixedDecimalScale={false}
                  disabled={WORK?.work_section[i]?.work_part_val === "유산소"}
                  value={Math.min(99, WORK?.work_section[i]?.work_set)}
                  onValueChange={(values) => {
                    const limitedValue = Math.min(99, parseInt(values?.value));
                    setWORK((prev) => {
                      let updated = {...prev};
                      let updatedSection = [...updated.work_section];
                      updatedSection[i].work_set = limitedValue;
                      updated.work_section = updatedSection;
                      return updated;
                    });
                  }}
                ></NumericFormat>
              </FormGroup>
            </Col>
            <Col xs={3}>
              <FormGroup className={"input-group"}>
                <Form.Label className={"input-group-text"}>횟수</Form.Label>
                <NumericFormat
                  min={1}
                  max={99}
                  minLength={1}
                  maxLength={4}
                  suffix={" 회"}
                  datatype={"number"}
                  displayType={"input"}
                  className={"form-control"}
                  id={`work_rep-${i}`}
                  name={`work_rep-${i}`}
                  allowNegative={false}
                  thousandSeparator={true}
                  fixedDecimalScale={false}
                  disabled={WORK?.work_section[i]?.work_part_val === "유산소"}
                  value={Math.min(99, WORK?.work_section[i]?.work_rep)}
                  onValueChange={(values) => {
                    const limitedValue = Math.min(99, parseInt(values?.value));
                    setWORK((prev) => {
                      let updated = {...prev};
                      let updatedSection = [...updated.work_section];
                      updatedSection[i].work_rep = limitedValue;
                      updated.work_section = updatedSection;
                      return updated;
                    });
                  }}
                ></NumericFormat>
              </FormGroup>
            </Col>
            <Col xs={3}>
              <FormGroup className={"input-group"}>
                <Form.Label className={"input-group-text"}>무게</Form.Label>
                <NumericFormat
                  min={1}
                  max={999}
                  minLength={1}
                  maxLength={6}
                  suffix={" kg"}
                  datatype={"number"}
                  displayType={"input"}
                  className={"form-control"}
                  id={`work_kg-${i}`}
                  name={`work_kg-${i}`}
                  allowNegative={false}
                  thousandSeparator={true}
                  fixedDecimalScale={true}
                  disabled={WORK?.work_section[i]?.work_part_val === "유산소"}
                  value={Math.min(999, WORK?.work_section[i]?.work_kg)}
                  onValueChange={(values) => {
                    const limitedValue = Math.min(999, parseInt(values?.value));
                    setWORK((prev) => {
                      let updated = {...prev};
                      let updatedSection = [...updated.work_section];
                      updatedSection[i].work_kg = limitedValue;
                      updated.work_section = updatedSection;
                      return updated;
                    });
                  }}
                ></NumericFormat>
              </FormGroup>
            </Col>
            <Col xs={3}>
              <FormGroup className={"input-group"}>
                <Form.Label className={"input-group-text"}>휴식</Form.Label>
                <NumericFormat
                  min={1}
                  max={999}
                  minLength={1}
                  maxLength={7}
                  suffix={" min"}
                  datatype={"number"}
                  displayType={"input"}
                  className={"form-control"}
                  id={`work_rest-${i}`}
                  name={`work_rest-${i}`}
                  allowNegative={false}
                  thousandSeparator={true}
                  disabled={WORK?.work_section[i]?.work_part_val === "유산소"}
                  value={Math.min(999, WORK?.work_section[i]?.work_rest)}
                  onValueChange={(values) => {
                    const limitedValue = Math.min(999, parseInt(values?.value));
                    setWORK((prev) => {
                      let updated = {...prev};
                      let updatedSection = [...updated.work_section];
                      updatedSection[i].work_rest = limitedValue;
                      updated.work_section = updatedSection;
                      return updated;
                    });
                  }}
                ></NumericFormat>
              </FormGroup>
            </Col>
            <Col xs={12}>
              <FormGroup className={"input-group"}>
                <Form.Label className={"input-group-text"}>볼륨</Form.Label>
                <NumericFormat
                  min={1}
                  max={999999999}
                  minLength={1}
                  maxLength={13}
                  suffix={" vol"}
                  datatype={"number"}
                  displayType={"input"}
                  className={"form-control"}
                  id={`work_volume-${i}`}
                  name={`work_volume-${i}`}
                  disabled={true}
                  allowNegative={false}
                  fixedDecimalScale={true}
                  thousandSeparator={true}
                  value={Math.min(999999999, WORK?.work_section[i]?.work_volume)}
                ></NumericFormat>
              </FormGroup>
            </Col>
          </Row>
          <Row className={"d-center"}>
            <Col xs={12}>
              <FormGroup className={"input-group"}>
                <Form.Label className={"input-group-text"}>유산소</Form.Label>
                <TimePicker
                  locale={"ko"}
                  format={"HH:mm"}
                  className={"form-control"}
                  id={"work_cardio"}
                  name={"work_cardio"}
                  clockIcon={null}
                  disableClock={false}
                  disabled={WORK?.work_section[i]?.work_part_val !== "유산소"}
                  value={WORK?.work_section[i]?.work_cardio}
                  onChange={(e) => {
                    setWORK((prev) => {
                      let updated = {...prev};
                      let updatedSection = [...updated.work_section];
                      updatedSection[i].work_cardio  = e ? e.toString() : "";
                      updated.work_section = updatedSection;
                      return updated;
                    });
                  }}
                ></TimePicker>
              </FormGroup>
            </Col>
          </Row>
        </React.Fragment>
      );
    };
    function tableFragment () {
      return (
        <Row className={"d-center"}>
          <Col xs={12}>
            {Array.from({length: COUNT.sectionCnt}, (_, i) => tableSection(i))}
          </Col>
        </Row>
      );
    };
    function tableTime () {
      return (
        <React.Fragment>
          <Row className={"d-center"}>
            <Col xs={6}>
              <FormGroup className={"input-group"}>
                <Form.Label className={"input-group-text"}>시작시간</Form.Label>
                <TimePicker
                  locale={"ko"}
                  format={"HH:mm"}
                  id={"work_start"}
                  name={"work_start"}
                  className={"form-control"}
                  disabled={false}
                  clockIcon={null}
                  disableClock={false}
                  value={WORK?.work_start}
                  onChange={(e) => {
                    setWORK((prev) => ({
                      ...prev,
                      work_start: e ? e.toString() : "",
                    }));
                  }}
                ></TimePicker>
              </FormGroup>
            </Col>
          </Row>
          <Row className={"row d-center mt-3"}>
            <Col xs={6}>
              <FormGroup className={"input-group"}>
                <Form.Label className={"input-group-text"}>종료시간</Form.Label>
                <TimePicker
                  locale={"ko"}
                  format={"HH:mm"}
                  id={"work_end"}
                  name={"work_end"}
                  className={"form-control"}
                  disabled={false}
                  clockIcon={null}
                  disableClock={false}
                  value={WORK?.work_end}
                  onChange={(e) => {
                    setWORK((prev) => ({
                      ...prev,
                      work_end: e ? e.toString() : "",
                    }));
                  }}
                ></TimePicker>
              </FormGroup>
            </Col>
          </Row>
          <Row className={"row d-center mt-3"}>
            <Col xs={6}>
              <FormGroup className={"input-group"}>
                <Form.Label className={"input-group-text"}>운동시간</Form.Label>
                <TimePicker
                  locale={"ko"}
                  format={"HH:mm"}
                  id={"work_time"}
                  name={"work_time"}
                  className={"form-control"}
                  disabled={true}
                  clockIcon={null}
                  disableClock={false}
                  value={WORK?.work_time}
                ></TimePicker>
              </FormGroup>
            </Col>
          </Row>
        </React.Fragment>
      );
    };

    function tableRemain () {
      return (
        <React.Fragment>
          <Row className={"d-center"}>
            <Col xs={6}>
              <FormGroup className={"input-group"}>
                <Form.Label className={"input-group-text"}>총 볼륨</Form.Label>
                  <NumericFormat
                    min={1}
                    max={99999999999999}
                    minLength={1}
                    maxLength={18}
                    suffix={" vol"}
                    datatype={"number"}
                    displayType={"input"}
                    id={"work_total_volume"}
                    name={"work_total_volume"}
                    className={"form-control"}
                    disabled={true}
                    allowNegative={false}
                    thousandSeparator={true}
                    fixedDecimalScale={true}
                    value={Math.min(99999999999999, WORK?.work_total_volume)}
                  ></NumericFormat>
              </FormGroup>
            </Col>
          </Row>
          <Row className={"d-center mt-3"}>
            <Col xs={6}>
              <FormGroup className={"input-group"}>
                <Form.Label className={"input-group-text"}>총 유산소 시간</Form.Label>
                <TimePicker
                  locale={"ko"}
                  format={"HH:mm"}
                  id={"work_total_cardio"}
                  name={"work_total_cardio"}
                  className={"form-control"}
                  disabled={true}
                  clockIcon={null}
                  disableClock={false}
                  value={WORK?.work_total_cardio}
                ></TimePicker>
              </FormGroup>
            </Col>
          </Row>
          <Row className={"d-center mt-3"}>
            <Col xs={6}>
              <FormGroup className={"input-group"}>
                <Form.Label className={"input-group-text"}>체중</Form.Label>
                <NumericFormat
                  min={1}
                  max={9999}
                  minLength={1}
                  maxLength={7}
                  suffix={" kg"}
                  datatype={"number"}
                  displayType={"input"}
                  id={"work_body_weight"}
                  name={"work_body_weight"}
                  className={"form-control"}
                  disabled={false}
                  allowNegative={false}
                  thousandSeparator={true}
                  value={WORK?.work_body_weight}
                  onValueChange={(values) => {
                    const limitedValue = Math.min(9999, parseInt(values?.value));
                    setWORK((prev) => ({
                      ...prev,
                      work_body_weight: limitedValue
                    }));
                  }}
                ></NumericFormat>
              </FormGroup>
            </Col>
          </Row>
        </React.Fragment>
      );
    };
    return (
      <React.Fragment>
        {tableFragment()}
        <br />
        {tableTime()}
        <br />
        {tableRemain()}
      </React.Fragment>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
        <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} flowSave={flowSave} navParam={navParam}
        part={"work"} plan={""} type={"save"}
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
              {handlerSectionCount()}
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

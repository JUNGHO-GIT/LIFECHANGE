// ExerciseSave.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {TimePicker} from "react-time-picker";
import {NumericFormat} from "react-number-format";
import {strToDecimal, decimalToStr} from "../../assets/common/date.js";
import {useTime} from "../../assets/hooks/useTime.jsx";
import {useDate} from "../../assets/hooks/useDate.jsx";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {DateNode} from "../../assets/fragments/DateNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";
import {Container, Row, Col, Card} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const ExerciseSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const customer_id = window.sessionStorage.getItem("customer_id");
  const session = window.sessionStorage.getItem("dataset") || "";
  const exerciseArray = JSON.parse(session)?.exercise || [];
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
      toList:"/exercise/list"
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
    exercise_number: 0,
    exercise_startDt: "0000-00-00",
    exercise_endDt: "0000-00-00",
    exercise_start: "00:00",
    exercise_end: "00:00",
    exercise_time: "00:00",
    exercise_total_volume: 0,
    exercise_total_cardio: "00:00",
    exercise_body_weight: 0,
    exercise_section: [{
      exercise_part_idx: 0,
      exercise_part_val: "전체",
      exercise_title_idx: 0,
      exercise_title_val: "전체",
      exercise_set: 1,
      exercise_rep: 1,
      exercise_kg: 1,
      exercise_rest: 1,
      exercise_volume: 0,
      exercise_cardio: "00:00",
    }],
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);
  useTime(OBJECT, setOBJECT, PATH, "real");

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_OBJECT}/detail`, {
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
      sectionCnt: response.data.sectionCnt || 0,
    }));
  })()}, [customer_id, DATE.startDt, DATE.endDt]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    let sectionVolume = 0;
    let totalVolume = 0;
    let totalTime = 0.0;

    const updatedSection = OBJECT?.exercise_section?.map((item) => {
      sectionVolume = item.exercise_set * item.exercise_rep * item.exercise_kg;
      totalVolume += sectionVolume;
      totalTime += strToDecimal(item.exercise_cardio);
      return {
        ...item,
        exercise_volume: sectionVolume
      };
    });

    // 이전 상태와 비교
    if (JSON.stringify(updatedSection) !== JSON.stringify(OBJECT?.exercise_section)) {
      setOBJECT((prev) => ({
        ...prev,
        exercise_total_volume: 0,
        exercise_total_cardio: "00:00",
        exercise_section: updatedSection,
      }));
    }
  }, [OBJECT?.exercise_section]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_OBJECT}/save`, {
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
      <DateNode DATE={DATE} setDATE={setDATE} part={"exercise"} plan={""} type={"save"} />
    );
  };

  // 5. handler ----------------------------------------------------------------------------------->
  const handlerSectionCount = () => {
    function handlerCount (e) {
      let newCount = parseInt(e, 10);
      let defaultSection = {
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
      };

      setCOUNT((prev) => ({
        ...prev,
        sectionCnt: newCount
      }));

      if (newCount > 0) {
        let updatedSection = Array(newCount).fill(null).map((_, idx) =>
          idx < OBJECT.exercise_section.length ? OBJECT.exercise_section[idx] : defaultSection
        );
        setOBJECT((prev) => ({
          ...prev,
          exercise_section: updatedSection
        }));
      }
      else {
        setOBJECT((prev) => ({
          ...prev,
          exercise_section: []
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
          <Row>
            <Col xs={6}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>부위</span>
                <select
                  id={`exercise_part_idx-${i}`}
                  name={`exercise_part_idx-${i}`}
                  className={"form-control"}
                  value={OBJECT?.exercise_section[i]?.exercise_part_idx}
                  onChange={(e) => {
                    const newIndex = parseInt(e.target.value);
                    setOBJECT((prev) => {
                      let updated = {...prev};
                      let updatedSection = [...updated.exercise_section];
                      updatedSection[i] = {
                        ...updatedSection[i],
                        exercise_part_idx: newIndex,
                        exercise_part_val: exerciseArray[newIndex].exercise_part,
                        exercise_title_idx: 0,
                        exercise_title_val: exerciseArray[newIndex].exercise_title[0],
                      };
                      updated.exercise_section = updatedSection;
                      return updated;
                    });
                  }}
                >
                  {exerciseArray?.map((item, idx) => (
                    <option key={idx} value={idx}>
                      {item.exercise_part}
                    </option>
                  ))}
                </select>
              </div>
            </Col>
            <Col xs={6}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>타이틀</span>
                <select
                  id={`exercise_title_idx-${i}`}
                  name={`exercise_title_idx-${i}`}
                  className={"form-control"}
                  value={OBJECT?.exercise_section[i]?.exercise_title_idx}
                  onChange={(e) => {
                    const newTitleIdx = parseInt(e.target.value);
                    const newTitleVal = exerciseArray[OBJECT?.exercise_section[i]?.exercise_part_idx]?.exercise_title[newTitleIdx];
                    if (newTitleIdx >= 0 && newTitleVal) {
                      setOBJECT((prev) => {
                        let updated = {...prev};
                        let updatedSection = [...updated.exercise_section];
                        updatedSection[i] = {
                          ...updatedSection[i],
                          exercise_title_idx: newTitleIdx,
                          exercise_title_val: newTitleVal,
                        };
                        updated.exercise_section = updatedSection;
                        return updated;
                      });
                    }
                  }}
                >
                  {exerciseArray[OBJECT?.exercise_section[i]?.exercise_part_idx]?.exercise_title?.map((title, idx) => (
                    <option key={idx} value={idx}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>세트</span>
                <NumericFormat
                  min={1}
                  max={99}
                  minLength={1}
                  maxLength={6}
                  suffix={" set"}
                  datatype={"number"}
                  displayType={"input"}
                  className={"form-control"}
                  id={`exercise_set-${i}`}
                  name={`exercise_set-${i}`}
                  allowNegative={false}
                  thousandSeparator={true}
                  fixedDecimalScale={false}
                  disabled={OBJECT?.exercise_section[i]?.exercise_part_val === "유산소"}
                  value={Math.min(99, OBJECT?.exercise_section[i]?.exercise_set)}
                  onValueChange={(values) => {
                    const limitedValue = Math.min(99, parseInt(values?.value));
                    setOBJECT((prev) => {
                      let updated = {...prev};
                      let updatedSection = [...updated.exercise_section];
                      updatedSection[i].exercise_set = limitedValue;
                      updated.exercise_section = updatedSection;
                      return updated;
                    });
                  }}
                ></NumericFormat>
              </div>
            </Col>
            <Col xs={6}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>횟수</span>
                <NumericFormat
                  min={1}
                  max={99}
                  minLength={1}
                  maxLength={4}
                  suffix={" 회"}
                  datatype={"number"}
                  displayType={"input"}
                  className={"form-control"}
                  id={`exercise_rep-${i}`}
                  name={`exercise_rep-${i}`}
                  allowNegative={false}
                  thousandSeparator={true}
                  fixedDecimalScale={false}
                  disabled={OBJECT?.exercise_section[i]?.exercise_part_val === "유산소"}
                  value={Math.min(99, OBJECT?.exercise_section[i]?.exercise_rep)}
                  onValueChange={(values) => {
                    const limitedValue = Math.min(99, parseInt(values?.value));
                    setOBJECT((prev) => {
                      let updated = {...prev};
                      let updatedSection = [...updated.exercise_section];
                      updatedSection[i].exercise_rep = limitedValue;
                      updated.exercise_section = updatedSection;
                      return updated;
                    });
                  }}
                ></NumericFormat>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>무게</span>
                <NumericFormat
                  min={1}
                  max={999}
                  minLength={1}
                  maxLength={6}
                  suffix={" kg"}
                  datatype={"number"}
                  displayType={"input"}
                  className={"form-control"}
                  id={`exercise_kg-${i}`}
                  name={`exercise_kg-${i}`}
                  allowNegative={false}
                  thousandSeparator={true}
                  fixedDecimalScale={true}
                  disabled={OBJECT?.exercise_section[i]?.exercise_part_val === "유산소"}
                  value={Math.min(999, OBJECT?.exercise_section[i]?.exercise_kg)}
                  onValueChange={(values) => {
                    const limitedValue = Math.min(999, parseInt(values?.value));
                    setOBJECT((prev) => {
                      let updated = {...prev};
                      let updatedSection = [...updated.exercise_section];
                      updatedSection[i].exercise_kg = limitedValue;
                      updated.exercise_section = updatedSection;
                      return updated;
                    });
                  }}
                ></NumericFormat>
              </div>
            </Col>
            <Col xs={6}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>휴식</span>
                <NumericFormat
                  min={1}
                  max={999}
                  minLength={1}
                  maxLength={7}
                  suffix={" min"}
                  datatype={"number"}
                  displayType={"input"}
                  className={"form-control"}
                  id={`exercise_rest-${i}`}
                  name={`exercise_rest-${i}`}
                  allowNegative={false}
                  thousandSeparator={true}
                  disabled={OBJECT?.exercise_section[i]?.exercise_part_val === "유산소"}
                  value={Math.min(999, OBJECT?.exercise_section[i]?.exercise_rest)}
                  onValueChange={(values) => {
                    const limitedValue = Math.min(999, parseInt(values?.value));
                    setOBJECT((prev) => {
                      let updated = {...prev};
                      let updatedSection = [...updated.exercise_section];
                      updatedSection[i].exercise_rest = limitedValue;
                      updated.exercise_section = updatedSection;
                      return updated;
                    });
                  }}
                ></NumericFormat>
              </div>
            </Col>
            <Col xs={6}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>볼륨</span>
                <NumericFormat
                  min={1}
                  max={999999999}
                  minLength={1}
                  maxLength={13}
                  suffix={" vol"}
                  datatype={"number"}
                  displayType={"input"}
                  className={"form-control"}
                  id={`exercise_volume-${i}`}
                  name={`exercise_volume-${i}`}
                  disabled={true}
                  allowNegative={false}
                  fixedDecimalScale={true}
                  thousandSeparator={true}
                  value={Math.min(999999999, OBJECT?.exercise_section[i]?.exercise_volume)}
                ></NumericFormat>
              </div>
            </Col>
            <Col xs={6}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>유산소</span>
                <TimePicker
                  locale={"ko"}
                  format={"HH:mm"}
                  className={"form-control"}
                  id={"exercise_cardio"}
                  name={"exercise_cardio"}
                  clockIcon={null}
                  disableClock={false}
                  disabled={OBJECT?.exercise_section[i]?.exercise_part_val !== "유산소"}
                  value={OBJECT?.exercise_section[i]?.exercise_cardio}
                  onChange={(e) => {
                    setOBJECT((prev) => {
                      let updated = {...prev};
                      let updatedSection = [...updated.exercise_section];
                      updatedSection[i].exercise_cardio  = e ? e.toString() : "";
                      updated.exercise_section = updatedSection;
                      return updated;
                    });
                  }}
                ></TimePicker>
              </div>
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
          <Row>
            <Col xs={6}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>시작시간</span>
                <TimePicker
                  locale={"ko"}
                  format={"HH:mm"}
                  id={"exercise_start"}
                  name={"exercise_start"}
                  className={"form-control"}
                  disabled={false}
                  clockIcon={null}
                  disableClock={false}
                  value={OBJECT?.exercise_start}
                  onChange={(e) => {
                    setOBJECT((prev) => ({
                      ...prev,
                      exercise_start: e ? e.toString() : "",
                    }));
                  }}
                ></TimePicker>
              </div>
            </Col>
          </Row>
          <Row className={"row d-center mt-3"}>
            <Col xs={6}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>종료시간</span>
                <TimePicker
                  locale={"ko"}
                  format={"HH:mm"}
                  id={"exercise_end"}
                  name={"exercise_end"}
                  className={"form-control"}
                  disabled={false}
                  clockIcon={null}
                  disableClock={false}
                  value={OBJECT?.exercise_end}
                  onChange={(e) => {
                    setOBJECT((prev) => ({
                      ...prev,
                      exercise_end: e ? e.toString() : "",
                    }));
                  }}
                ></TimePicker>
              </div>
            </Col>
          </Row>
          <Row className={"row d-center mt-3"}>
            <Col xs={6}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>운동시간</span>
                <TimePicker
                  locale={"ko"}
                  format={"HH:mm"}
                  id={"exercise_time"}
                  name={"exercise_time"}
                  className={"form-control"}
                  disabled={true}
                  clockIcon={null}
                  disableClock={false}
                  value={OBJECT?.exercise_time}
                ></TimePicker>
              </div>
            </Col>
          </Row>
        </React.Fragment>
      );
    };

    function tableRemain () {
      return (
        <React.Fragment>
          <Row>
            <Col xs={6}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>총 볼륨</span>
                  <NumericFormat
                    min={1}
                    max={999999999}
                    minLength={1}
                    maxLength={13}
                    suffix={" vol"}
                    datatype={"number"}
                    displayType={"input"}
                    id={"exercise_total_volume"}
                    name={"exercise_total_volume"}
                    className={"form-control"}
                    disabled={true}
                    allowNegative={false}
                    thousandSeparator={true}
                    fixedDecimalScale={true}
                    value={Math.min(9999999999, OBJECT?.exercise_total_volume)}
                  ></NumericFormat>
              </div>
            </Col>
          </Row>
          <Row className={"d-center mt-3"}>
            <Col xs={6}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>총 유산소 시간</span>
                <TimePicker
                  locale={"ko"}
                  format={"HH:mm"}
                  id={"exercise_total_cardio"}
                  name={"exercise_total_cardio"}
                  className={"form-control"}
                  disabled={true}
                  clockIcon={null}
                  disableClock={false}
                  value={OBJECT?.exercise_total_cardio}
                ></TimePicker>
              </div>
            </Col>
          </Row>
          <Row className={"d-center mt-3"}>
            <Col xs={6}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>체중</span>
                <NumericFormat
                  min={1}
                  max={9999}
                  minLength={1}
                  maxLength={7}
                  suffix={" kg"}
                  datatype={"number"}
                  displayType={"input"}
                  id={"exercise_body_weight"}
                  name={"exercise_body_weight"}
                  className={"form-control"}
                  disabled={false}
                  allowNegative={false}
                  thousandSeparator={true}
                  value={OBJECT?.exercise_body_weight}
                  onValueChange={(values) => {
                    const limitedValue = Math.min(9999, parseInt(values?.value));
                    setOBJECT((prev) => ({
                      ...prev,
                      exercise_body_weight: limitedValue
                    }));
                  }}
                ></NumericFormat>
              </div>
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
        SEND={SEND}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
        flowSave={flowSave} navParam={navParam} part={"exercise"} plan={""} type={"save"}
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
              <Col xs={12} className={"mb-20 text-center"}>
                <h1>Save</h1>
              </Col>
              <Col xs={12} className={"mb-20 text-center"}>
                {dateNode()}
              </Col>
              <Col xs={12} className={"mb-20 text-center"}>
                {handlerSectionCount()}
              </Col>
              <Col xs={12} className={"mb-20 text-center"}>
                {tableNode()}
              </Col>
              <Col xs={12} className={"mb-20 text-center"}>
                {buttonNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};

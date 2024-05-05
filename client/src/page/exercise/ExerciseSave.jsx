// ExerciseSave.jsx

import axios from "axios";
import InputMask from "react-input-mask";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {TimePicker} from "react-time-picker";
import {NumericFormat} from "react-number-format";
import {percent} from "../../assets/js/percent.js";
import {useTime} from "../../hooks/useTime.jsx";
import {useDate} from "../../hooks/useDate.jsx";
import {useStorage} from "../../hooks/useStorage.jsx";
import {DateNode} from "../../fragments/DateNode.jsx";
import {ButtonNode} from "../../fragments/ButtonNode.jsx";
import {LoadingNode} from "../../fragments/LoadingNode.jsx";
import {Container, Row, Col, Card} from "react-bootstrap";
import _ from 'lodash';

// ------------------------------------------------------------------------------------------------>
export const ExerciseSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const session = sessionStorage.getItem("dataset") || "";
  const exerciseArray = JSON.parse(session)?.exercise || [];
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    refresh: 0,
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toList:"/exercise/list"
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0
  });
  const [CALENDAR, setCALENDAR] = useState({
    calStartOpen: false,
    calEndOpen: false,
    calOpen: false,
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );

  // 2-3. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = {
    _id: "",
    exercise_number: 0,
    exercise_demo: false,
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
      exercise_set: 1,
      exercise_rep: 1,
      exercise_kg: 1,
      exercise_rest: 1,
      exercise_volume: 0,
      exercise_cardio: "00:00",
    }],
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);
  useTime(OBJECT, setOBJECT, PATH, "real");

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: user_id,
        _id: "",
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0
    }));
    setLOADING(false);
  })()}, [user_id, DATE.startDt, DATE.endDt]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    if (!OBJECT?.exercise_section) {
      return;
    }

    let totalVolume = 0;
    let totalTime = 0;

    const updatedSections = OBJECT.exercise_section.map((section) => {
      const {exercise_set, exercise_rep, exercise_kg} = section;
      const sectionVolume = exercise_set * exercise_rep * exercise_kg;

      totalVolume += sectionVolume;

      const {exercise_cardio} = section;
      if (exercise_cardio) {
        const [hours, minutes] = exercise_cardio.split(':').map(Number);
        totalTime += hours * 60 + minutes;
      }

      return {
        ...section,
        exercise_volume: sectionVolume
      };
    });

    setOBJECT((prev) => ({
      ...prev,
      exercise_section: updatedSections,
      exercise_total_volume: totalVolume,
      exercise_total_cardio: `${Math.floor(totalTime / 60).toString().padStart(2, '0')}:${(totalTime % 60).toString().padStart(2, '0')}`
    }));

  }, [JSON.stringify(OBJECT.exercise_section)]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post(`${URL_OBJECT}/save`, {
      user_id: user_id,
      OBJECT: OBJECT,
      duration: `${DATE.startDt} ~ ${DATE.endDt}`,
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      percent();
      SEND.startDt = DATE.startDt;
      SEND.endDt = DATE.endDt;
      navParam(SEND.toList, {
        state: SEND
      });
    }
    else {
      alert(res.data.msg);
    }
  };

  // 4. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const handlerCount = (e) => {
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
    };
    const countNode = () => (
      <React.Fragment>
        <div className={"input-group"}>
          <span className={"input-group-text"}>섹션 갯수</span>
          <NumericFormat
            min={0}
            max={10}
            minLength={1}
            maxLength={2}
            datatype={"number"}
            displayType={"input"}
            className={"form-control"}
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
        </div>
      </React.Fragment>
    );
    const tableFragment = (i) => (
      <React.Fragment key={i}>
        <Row>
          <Col lg={6} md={6} sm={6} xs={6}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>부위</span>
              <select
                id={`exercise_part_idx-${i}`}
                name={`exercise_part_idx-${i}`}
                className={"form-select"}
                value={OBJECT?.exercise_section[i]?.exercise_part_idx}
                onChange={(e) => {
                  const newIndex = parseInt(e.target.value);
                  setOBJECT((prev) => ({
                    ...prev,
                    exercise_section: prev.exercise_section.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        exercise_part_idx: newIndex,
                        exercise_part_val: exerciseArray[newIndex]?.exercise_part,
                        exercise_title_idx: 0,
                        exercise_title_val: exerciseArray[newIndex]?.exercise_title[0],
                      } : item
                    ))
                  }));
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
          <Col lg={6} md={6} sm={6} xs={6}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>제목</span>
              <select
                id={`exercise_title_idx-${i}`}
                name={`exercise_title_idx-${i}`}
                className={"form-select"}
                value={OBJECT?.exercise_section[i]?.exercise_title_idx}
                onChange={(e) => {
                  const newTitleIdx = parseInt(e.target.value);
                  const newTitleVal = exerciseArray[OBJECT?.exercise_section[i]?.exercise_part_idx]?.exercise_title[newTitleIdx];
                  if (newTitleIdx >= 0 && newTitleVal) {
                    setOBJECT((prev) => ({
                      ...prev,
                      exercise_section: prev.exercise_section.map((item, idx) => (
                        idx === i ? {
                          ...item,
                          exercise_title_idx: newTitleIdx,
                          exercise_title_val: newTitleVal
                        } : item
                      ))
                    }));
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
          <Col xs={3}>
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
                disabled={
                  OBJECT?.exercise_section[i]?.exercise_part_val === "유산소"
                }
                value={
                  OBJECT?.exercise_section[i]?.exercise_part_val !== "유산소"
                  ? Math.min(99, OBJECT?.exercise_section[i]?.exercise_set)
                  : 0
                }
                onValueChange={(values) => {
                  const limitedValue = Math.min(99, parseInt(values?.value));
                  setOBJECT((prev) => ({
                    ...prev,
                    exercise_section: prev.exercise_section.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        exercise_set: limitedValue
                      } : item
                    ))
                  }));
                }}
              ></NumericFormat>
            </div>
          </Col>
          <Col xs={3}>
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
                disabled={
                  OBJECT?.exercise_section[i]?.exercise_part_val === "유산소"
                }
                value={
                  OBJECT?.exercise_section[i]?.exercise_part_val !== "유산소"
                  ? Math.min(99, OBJECT?.exercise_section[i]?.exercise_rep)
                  : 0
                }
                onValueChange={(values) => {
                  const limitedValue = Math.min(99, parseInt(values?.value));
                  setOBJECT((prev) => ({
                    ...prev,
                    exercise_section: prev.exercise_section.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        exercise_rep: limitedValue
                      } : item
                    ))
                  }));
                }}
              ></NumericFormat>
            </div>
          </Col>
          <Col xs={3}>
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
                id={`exercise_kg-${i}`}
                name={`exercise_kg-${i}`}
                className={"form-control"}
                allowNegative={false}
                thousandSeparator={true}
                fixedDecimalScale={true}
                disabled={
                  OBJECT?.exercise_section[i]?.exercise_part_val === "유산소"
                }
                value={
                  OBJECT?.exercise_section[i]?.exercise_part_val !== "유산소"
                  ? Math.min(999, OBJECT?.exercise_section[i]?.exercise_kg)
                  : 0
                }
                onValueChange={(values) => {
                  const limitedValue = Math.min(999, parseInt(values?.value));
                  setOBJECT((prev) => ({
                    ...prev,
                    exercise_section: prev.exercise_section.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        exercise_kg: limitedValue
                      } : item
                    ))
                  }));
                }}
              ></NumericFormat>
            </div>
          </Col>
          <Col xs={3}>
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
                disabled={
                  OBJECT?.exercise_section[i]?.exercise_part_val === "유산소"
                }
                value={
                  OBJECT?.exercise_section[i]?.exercise_part_val !== "유산소"
                  ? Math.min(999, OBJECT?.exercise_section[i]?.exercise_rest)
                  : 0
                }
                onValueChange={(values) => {
                  const limitedValue = Math.min(999, parseInt(values?.value));
                  setOBJECT((prev) => ({
                    ...prev,
                    exercise_section: prev.exercise_section.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        exercise_rest: limitedValue
                      } : item
                    ))
                  }));
                }}
              ></NumericFormat>
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={6} md={6} sm={6} xs={6}>
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
          <Col lg={6} md={6} sm={6} xs={6}>
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
                value={OBJECT?.exercise_section[i]?.exercise_part_val === "유산소" ? OBJECT?.exercise_section[i]?.exercise_cardio : "00:00"}
                onChange={(e) => {
                  const timeValue = e ? e.toString() : "00:00";
                  setOBJECT((prev) => ({
                    ...prev,
                    exercise_section: prev.exercise_section.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        exercise_cardio: timeValue
                      } : item
                    ))
                  }));
                }}
              ></TimePicker>
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
    const tableSection = () => (
      <React.Fragment>
        {Array.from({length: COUNT.sectionCnt}, (_, i) => tableFragment(i))}
      </React.Fragment>
    );
    const tableRemain = () => (
      <React.Fragment>
        <Row>
          <Col lg={12} md={12} sm={12} xs={12}>
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
          <Col lg={12} md={12} sm={12} xs={12}>
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
          <Col lg={12} md={12} sm={12} xs={12}>
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
    return (
      <React.Fragment>
        <div className={"save-wrapper"}>
          {countNode()}
          {tableSection()}
          {tableRemain()}
        </div>
      </React.Fragment>
    );
  };

  // 6. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <LoadingNode LOADING={LOADING} setLOADING={setLOADING}
    />
  );

  // 7. date -------------------------------------------------------------------------------------->
  const dateNode = () => (
    <DateNode DATE={DATE} setDATE={setDATE} CALENDAR={CALENDAR} setCALENDAR={setCALENDAR}
      part={"exercise"} plan={""} type={"save"}
    />
  );

  // 11. button ----------------------------------------------------------------------------------->
  const buttonNode = () => (
    <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
      SEND={SEND}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={flowSave} navParam={navParam} part={"exercise"} plan={""} type={"save"}
    />
  );

  // 12. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"content-wrapper"}>
        <Card className={"card-wrapper"}>
          <Container fluid={true}>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12} className={"d-center"}>
                {LOADING ? "" : dateNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
      <div className={"content-wrapper"}>
        <Card className={"card-wrapper"}>
          <Container fluid={true}>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                {LOADING ? loadingNode() : tableNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
      <div className={"content-wrapper"}>
        <Card className={"card-wrapper"}>
          <Container fluid={true}>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12} className={"d-center"}>
                {LOADING ? "" : buttonNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};

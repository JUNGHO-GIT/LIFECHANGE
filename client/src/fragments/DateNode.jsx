// DateNode.jsx

import React, { useEffect } from "react";
import {DayPicker} from "react-day-picker";
import moment from "moment-timezone";
import {ko} from "date-fns/locale";
import {Col, Row} from "react-bootstrap";
import InputMask from "react-input-mask";

// 4. date ---------------------------------------------------------------------------------------->
export const DateNode = ({
  DATE, setDATE, DAYPICKER, setDAYPICKER, part, plan, type
}) => {

  // 1. useEffect (startDt) ----------------------------------------------------------------------->
  // startDt가 endDt보다 클 경우 endDt를 startDt로 설정
  useEffect(() => {
    if (moment(DATE.startDt).isAfter(DATE.endDt)) {
      setDATE((prev) => ({
        ...prev,
        endDt: DATE.startDt
      }));
    }
  }, [DATE.startDt]);

  // 중복 방지
   useEffect(() => {
    if (DAYPICKER.dayStartOpen) {
      setDAYPICKER((prev) => ({
        ...prev,
        dayEndOpen: false,
      }));
    }
  }, [DAYPICKER.dayStartOpen]);

  // 2. useEffect (endDt) ------------------------------------------------------------------------->
  // endDt가 startDt보다 작을 경우 startDt를 endDt로 설정
  useEffect(() => {
    if (moment(DATE.endDt).isBefore(DATE.startDt)) {
      setDATE((prev) => ({
        ...prev,
        startDt: DATE.endDt
      }));
    }
  }, [DATE.endDt]);

  // 중복 방지
  useEffect(() => {
    if (DAYPICKER.dayEndOpen) {
      setDAYPICKER((prev) => ({
        ...prev,
        dayStartOpen: false,
      }));
    }
  }, [DAYPICKER.dayEndOpen]);

  // 닫기 버튼 ------------------------------------------------------------------------------------>
  const closeBtn = (type) => (
    <span className={"d-right fw-700 dayPicker-x-btn"} onClick={() => {
      setDAYPICKER((prev) => ({
        ...prev,
        [`day${type}Open`]: false,
      }));
    }}>
      X
    </span>
  );

  // 달력 본체 ------------------------------------------------------------------------------------>
  const dayPicker = (type) => (
    <React.Fragment>
      <h5 className={"text-center drag"}>{type === "Start" ? "시작일" : "종료일"}</h5>
      <DayPicker
        weekStartsOn={1}
        showOutsideDays={true}
        locale={ko}
        modifiersClassNames={{
          selected: "selected", disabled: "disabled", outside: "outside", inside: "inside",
        }}
        mode={"single"}
        selected={new Date(DATE[`${type.toLowerCase()}Dt`])}
        month={new Date(DATE[`${type.toLowerCase()}Dt`])}
        onDayClick={(day) => {
          setDATE((prev) => ({
            ...prev,
            [`${type.toLowerCase()}Dt`]: moment(day).format("YYYY-MM-DD")
          }));
        }}
        onMonthChange={(month) => {
          setDATE((prev) => ({
            ...prev,
            [`${type.toLowerCase()}Dt`]: moment(month).format("YYYY-MM-DD")
          }));
        }}
      ></DayPicker>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <div className={`dayPicker-container ${DAYPICKER.dayStartOpen ? "" : "d-none"}`}>
        {closeBtn("Start")}
        <div className="h-2vh"></div>
        {dayPicker("Start")}
      </div>
      <div className={`dayPicker-container ${DAYPICKER.dayEndOpen ? "" : "d-none"}`}>
        {closeBtn("End")}
        <div className="h-2vh"></div>
        {dayPicker("End")}
      </div>
      <div className={"date-wrapper"}>
        <Row className={"d-center"}>
          <Col lg={6} md={6} sm={6} xs={6}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>시작일</span>
              <InputMask
                mask={"9999-99-99"}
                id={"dayPicker_startDt"}
                name={"dayPicker_startDt"}
                className={"form-control pointer"}
                maskChar={null}
                value={DATE?.startDt}
                readOnly={true}
                onClick={() => {
                  setDAYPICKER((prev) => ({
                    ...prev,
                    dayStartOpen: !prev.dayStartOpen
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
                id={"dayPicker_endDt"}
                name={"dayPicker_endDt"}
                className={"form-control pointer"}
                maskChar={null}
                value={DATE?.endDt}
                readOnly={true}
                onClick={() => {
                  setDAYPICKER((prev) => ({
                    ...prev,
                    dayEndOpen: !prev.dayEndOpen
                  }));
                }}
              ></InputMask>
            </div>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

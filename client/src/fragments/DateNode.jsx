// DateNode.jsx

import React, { useEffect } from "react";
import {DayPicker} from "react-day-picker";
import moment from "moment-timezone";
import {ko} from "date-fns/locale";
import {Col, Row} from "react-bootstrap";
import InputMask from "react-input-mask";

// 4. date ---------------------------------------------------------------------------------------->
export const DateNode = ({
  DATE, setDATE, CALENDAR, setCALENDAR, part, plan, type
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
    if (CALENDAR.calStartOpen) {
      setCALENDAR((prev) => ({
        ...prev,
        calEndOpen: false,
      }));
    }
  }, [CALENDAR.calStartOpen]);

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
    if (CALENDAR.calEndOpen) {
      setCALENDAR((prev) => ({
        ...prev,
        calStartOpen: false,
      }));
    }
  }, [CALENDAR.calEndOpen]);

  // 닫기 버튼 ------------------------------------------------------------------------------------>
  const closeBtn = (type) => (
    <span className={"d-right fw-700 dayPicker-x-btn"} onClick={() => {
      setCALENDAR((prev) => ({
        ...prev,
        [`cal${type}Open`]: false,
      }));
    }}>
      X
    </span>
  );

  // 달력 본체 ------------------------------------------------------------------------------------>
  const calendar = (type) => (
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
      <div className={`dayPicker-container ${CALENDAR.calStartOpen ? "" : "d-none"}`}>
        {closeBtn("Start")}
        <div className="h-2vh"></div>
        {calendar("Start")}
      </div>
      <div className={`dayPicker-container ${CALENDAR.calEndOpen ? "" : "d-none"}`}>
        {closeBtn("End")}
        <div className="h-2vh"></div>
        {calendar("End")}
      </div>
      <div className={"date-wrapper"}>
        <Row className={"d-center"}>
          <Col lg={6} md={6} sm={6} xs={6}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>시작일</span>
              <InputMask
                mask={"9999-99-99"}
                id={"calendar_startDt"}
                name={"calendar_startDt"}
                className={"form-control pointer"}
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
                id={"calendar_endDt"}
                name={"calendar_endDt"}
                className={"form-control pointer"}
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
      </div>
    </React.Fragment>
  );
};

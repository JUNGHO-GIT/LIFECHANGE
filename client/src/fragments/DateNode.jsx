import React, { useEffect } from "react";
import { DayPicker } from "react-day-picker";
import {ko} from "date-fns/locale";
import moment from "moment";

// 달력 날짜 상태 및 로직을 관리하는 DateNode 컴포넌트
export const DateNode = ({
  DATE, setDATE, CALENDAR, setCALENDAR, part, plan, type
}) => {

  const mode = "single";
  const selected = DATE.startDt && new Date(DATE.startDt);
  const month = new Date(DATE.startDt || new Date());

  // 1. useEffect --------------------------------------------------------------------------------->
  // endDt가 startDt보다 작을 경우 endDt를 startDt로 설정
  useEffect(() => {
    if (moment(DATE.endDt).isBefore(DATE.startDt)) {
      setDATE((prev) => ({
        ...prev,
        endDt: DATE.startDt
      }));
    }
  }, [DATE.startDt, DATE.endDt]);

  // 1. useEffect --------------------------------------------------------------------------------->
  useEffect(() => {
    if (CALENDAR.calStartOpen) {
      setCALENDAR((prev) => ({
        ...prev,
        calEndOpen: false,
      }));
    }
  }, [CALENDAR.calStartOpen]);

  // 1. useEffect --------------------------------------------------------------------------------->
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
    <span className="d-right fw-700 dayPicker-x-btn" onClick={() => {
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
      <h5 className="text-center">{type === "Start" ? "시작일" : "종료일"}</h5>
      <DayPicker
        weekStartsOn={1}
        showOutsideDays={true}
        locale={ko}
        modifiersClassNames={{
          selected: "selected", disabled: "disabled", outside: "outside", inside: "inside",
        }}
        mode={mode}
        selected={selected}
        month={month}
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
    </React.Fragment>
  );
};

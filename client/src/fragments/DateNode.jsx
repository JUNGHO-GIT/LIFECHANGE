// DateNode.jsx

import React, { useEffect } from "react";
import {DayPicker} from "react-day-picker";
import moment from "moment-timezone";
import {ko} from "date-fns/locale";

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

  // 외부 클릭시 창 닫힘
  useEffect(() => {
    const closeSidebar = (event) => {
      if (CALENDAR.calStartOpen && !event.target.closest(".dayPicker-container")) {
        setCALENDAR((prev) => ({
          ...prev,
          calStartOpen: false
        }));
      }
    };
    document.addEventListener("click", closeSidebar);
    return () => {
      document.removeEventListener("click", closeSidebar);
    };
  }, [CALENDAR.calStartOpen]);

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

  // 외부 클릭시 창 닫힘
  useEffect(() => {
    const closeSidebar = (event) => {
      if (CALENDAR.calEndOpen && !event.target.closest(".dayPicker-container")) {
        setCALENDAR((prev) => ({
          ...prev,
          calEndOpen: false
        }));
      }
    };
    document.addEventListener("click", closeSidebar);
    return () => {
      document.removeEventListener("click", closeSidebar);
    };
  }, [CALENDAR.calEndOpen]);

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
    </React.Fragment>
  );
};

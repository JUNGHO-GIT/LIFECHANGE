// CalendarNode.jsx

import React, {useEffect} from "react";
import {DayPicker} from "react-day-picker";
import moment from "moment-timezone";
import {ko} from "date-fns/locale";
import {differenceInDays} from "date-fns";

// 4. calendar ------------------------------------------------------------------------------------>
export const CalendarNode = ({
  FILTER, setFILTER, DATE, setDATE, CALENDAR, setCALENDAR
}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (FILTER.type === "day") {
      setDATE((prev) => ({
        startDt: moment(koreanDate).format("YYYY-MM-DD"),
        endDt: moment(koreanDate).format("YYYY-MM-DD"),
      }));
    }
    else if (FILTER.type === "week") {
      setDATE((prev) => ({
        startDt: moment(koreanDate).startOf("isoWeek").format("YYYY-MM-DD"),
        endDt: moment(koreanDate).endOf("isoWeek").format("YYYY-MM-DD")
      }));
    }
    else if (FILTER.type === "month") {
      setDATE((prev) => ({
        ...prev,
        startDt: moment(koreanDate).startOf("month").format("YYYY-MM-DD"),
        endDt: moment(koreanDate).endOf("month").format("YYYY-MM-DD")
      }));
    }
    else if (FILTER.type === "year") {
      setDATE((prev) => ({
        startDt: moment(koreanDate).startOf("year").format("YYYY-MM-DD"),
        endDt: moment(koreanDate).endOf("year").format("YYYY-MM-DD")
      }));
    }
    else if (FILTER.type === "select") {
      setDATE((prev) => ({
        startDt: moment(koreanDate).format("YYYY-MM-DD"),
        endDt: moment(koreanDate).format("YYYY-MM-DD"),
      }));
    }
  }, [FILTER.type]);

  // 4. calendarType ------------------------------------------------------------------------------>
  function calendarType() {

    let mode;
    let selected;
    let month;
    let onDayClick;
    let onMonthChange;

    // 1. day
    if (FILTER.type === "day") {
      mode = "single";
      selected = DATE.startDt && new Date(DATE.startDt);
      month = new Date(DATE.startDt);
      onDayClick = (day) => {
        setDATE((prev) => ({
          ...prev,
          startDt: moment(day).format("YYYY-MM-DD"),
          endDt: moment(day).format("YYYY-MM-DD")
        }));
      }
      onMonthChange = (month) => {
        setDATE((prev) => ({
          ...prev,
          startDt: moment(month).format("YYYY-MM-DD"),
          endDt: moment(month).format("YYYY-MM-DD")
        }));
      }
    }

    // 2. week
    if (FILTER.type === "week") {
      mode = "range";
      selected = DATE.startDt && DATE.endDt && {from: new Date(DATE.startDt), to: new Date(DATE.endDt)}
      month = new Date(DATE.startDt);
      onDayClick= (day) => {
        setDATE((prev) => ({
          ...prev,
          startDt: moment(day).startOf("isoWeek").format("YYYY-MM-DD"),
          endDt: moment(day).endOf("isoWeek").format("YYYY-MM-DD")
        }));
      }
      onMonthChange= (month) => {
        setDATE((prev) => ({
          ...prev,
          startDt: moment(month).format("YYYY-MM-DD"),
          endDt: undefined
        }));
      }
    }

    // 3. month
    if (FILTER.type === "month") {
      mode = "default";
      selected = undefined;
      month = new Date(DATE.startDt);
      onDayClick = undefined;
      onMonthChange = (month) => {
        setDATE((prev) => ({
          ...prev,
          startDt: moment(month).startOf("month").format("YYYY-MM-DD"),
          endDt: moment(month).endOf("month").format("YYYY-MM-DD")
        }));
      }
    }

    // 4. year
    if (FILTER.type === "year") {
      mode = "default";
      selected = undefined;
      month = new Date(DATE.startDt);
      onDayClick = undefined;
      onMonthChange = (year) => {
        const yearDate = new Date(year.getFullYear(), 0, 1);
        const monthDate = new Date(year.getFullYear(), year.getMonth(), 1);
        const nextMonth = differenceInDays(new Date(year.getFullYear() + 1, 0, 1), monthDate) / 30;
        const prevMonth = differenceInDays(monthDate, yearDate) / 30;
        if (nextMonth > prevMonth) {
          setDATE((prev) => ({
            ...prev,
            startDt: moment(year).add(1, "years").startOf("year").format("YYYY-MM-DD"),
            endDt: moment(year).add(1, "years").endOf("year").format("YYYY-MM-DD")
          }));
        }
        else {
          setDATE((prev) => ({
            ...prev,
            startDt: moment(year).startOf("year").format("YYYY-MM-DD"),
            endDt: moment(year).endOf("year").format("YYYY-MM-DD")
          }));
        }
      }
    }

    // 5. select
    if (FILTER.type === "select") {
      mode = "range";
      selected = DATE.startDt && DATE.endDt && {from: new Date(DATE.startDt), to: new Date(DATE.endDt)}
      month = new Date(DATE.startDt);
      onDayClick = (day) => {
        const selectedDay = new Date(day);
        const fmtDate = moment(selectedDay).format("YYYY-MM-DD");
        if (DATE.startDt && DATE.endDt) {
          if (selectedDay < new Date(DATE.startDt)) {
            setDATE((prev) => ({
              ...prev,
              startDt: fmtDate,
              endDt: fmtDate
            }));
          }
          else if (selectedDay > new Date(DATE.startDt)) {
            setDATE((prev) => ({
              ...prev,
              endDt: fmtDate
            }));
          }
          else {
            setDATE((prev) => ({
              ...prev,
              startDt: undefined,
              endDt: undefined
            }));
          }
        }
        else if (DATE.startDt) {
          if (selectedDay < new Date(DATE.startDt)) {
            setDATE((prev) => ({
              ...prev,
              startDt: fmtDate,
              endDt: fmtDate,
            }));
          }
          else if (selectedDay > new Date(DATE.startDt)) {
            setDATE((prev) => ({
              ...prev,
              endDt: fmtDate,
            }));
          }
          else {
            setDATE((prev) => ({
              ...prev,
              startDt: undefined,
              endDt: undefined
            }));
          }
        }
        else {
          setDATE((prev) => ({
            ...prev,
            startDt: fmtDate
          }));
        }
      }
      onMonthChange = (month) => {
        setDATE((prev) => ({
          ...prev,
          startDt: moment(month).format("YYYY-MM-DD"),
          endDt: undefined
        }));
      }
    };

    return (
      <DayPicker

        weekStartsOn={1}
        showOutsideDays={true}
        locale={ko}
        modifiersClassNames={{
          selected: "selected", disabled: "disabled", outside: "outside", inside: "inside",
        }}
        // @ts-ignore
        mode={mode}
        selected={selected}
        month={month}
        onDayClick={onDayClick}
        onMonthChange={onMonthChange}
      ></DayPicker>
    );
  };

  return (
    <React.Fragment>
      <div className={`dayPicker-container ${CALENDAR.calOpen ? "" : "d-none"}`}>
        <span className={"d-right fw-700 dayPicker-x-btn"} onClick={() => (
          setCALENDAR((prev) => ({
            ...prev,
            calOpen: false
          }))
        )}>
          X
        </span>
        <div className={"h-2"}></div>
        <div>{calendarType()}</div>
      </div>
    </React.Fragment>
  );
};
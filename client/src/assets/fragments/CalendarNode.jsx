// CalendarNode.jsx

import React, {useEffect} from "react";
import {DayPicker} from "react-day-picker";
import moment from "moment-timezone";
import Draggable from "react-draggable";
import {ko} from "date-fns/locale";
import {differenceInDays} from "date-fns";

// 4. calendar ------------------------------------------------------------------------------------>
export const CalendarNode = ({
  FILTER, setFILTER, DATE, setDATE, CALENDAR, setCALENDAR,
}) => {

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (FILTER.type === "day") {
      setDATE((prev) => ({
        ...prev,
        strStartDt: DATE.strDt,
        strEndDt: DATE.strDt,
      }));
    }
    else if (FILTER.type === "week") {
      setDATE((prev) => ({
        ...prev,
        strStartDt: moment(DATE.strDt).startOf("isoWeek").format("YYYY-MM-DD"),
        strEndDt: moment(DATE.strDt).endOf("isoWeek").format("YYYY-MM-DD"),
      }));
    }
    else if (FILTER.type === "month") {
      setDATE((prev) => ({
        ...prev,
        strStartDt: moment(DATE.strDt).startOf("month").format("YYYY-MM-DD"),
        strEndDt: moment(DATE.strDt).endOf("month").format("YYYY-MM-DD"),
      }));
    }
    else if (FILTER.type === "year") {
      setDATE((prev) => ({
        ...prev,
        strStartDt: moment(DATE.strDt).startOf("year").format("YYYY-MM-DD"),
        strEndDt: moment(DATE.strDt).endOf("year").format("YYYY-MM-DD"),
      }));
    }
    else if (FILTER.type === "select") {
      setDATE((prev) => ({
        ...prev,
        strStartDt: DATE.strStartDt,
        strEndDt: DATE.strEndDt,
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
      selected = new Date(DATE.strDt);
      month = new Date(DATE.strDt);
      onDayClick = (day) => {
        setDATE((prev) => ({
          ...prev,
          strDt: moment(day).format("YYYY-MM-DD"),
        }));
      };
      onMonthChange = (month) => {
        setDATE((prev) => ({
          ...prev,
          strDt: moment(month).format("YYYY-MM-DD"),
        }));
      };
    }

    // 2. week
    if (FILTER.type === "week") {
      mode = "range";
      selected = DATE.strStartDt && DATE.strEndDt && {from: new Date(DATE.strStartDt), to: new Date(DATE.strEndDt)};
      month = new Date(DATE.strStartDt)
      onDayClick= (day) => {
        const startOfWeek = moment(day).startOf("isoWeek").format("YYYY-MM-DD");
        const endOfWeek = moment(day).endOf("isoWeek").format("YYYY-MM-DD");
        setDATE((prev) => ({
          ...prev,
          strStartDt: startOfWeek,
          strEndDt: endOfWeek,
        }));
      }
      onMonthChange= (month) => {
        setDATE((prev) => ({
          ...prev,
          strStartDt: moment(month).format("YYYY-MM-DD"),
          strEndDt: undefined,
        }));
      }
    }

    // 3. month
    if (FILTER.type === "month") {
      mode = "default";
      selected = undefined;
      month = new Date(DATE.strStartDt);
      onDayClick = undefined;
      onMonthChange = (month) => {
        const startOfMonth = moment(month).startOf("month").format("YYYY-MM-DD");
        const endOfMonth = moment(month).endOf("month").format("YYYY-MM-DD");
        setDATE((prev) => ({
          ...prev,
          strStartDt: startOfMonth,
          strEndDt: endOfMonth,
        }));
      }
    }

    // 4. year
    if (FILTER.type === "year") {
      mode = "default";
      selected = undefined;
      month = new Date(DATE.strStartDt);
      onDayClick = undefined;
      onMonthChange = (year) => {
        const yearDate = new Date(year.getFullYear(), 0, 1);
        const monthDate = new Date(year.getFullYear(), year.getMonth(), 1);
        const nextMonth = differenceInDays(new Date(year.getFullYear() + 1, 0, 1), monthDate) / 30;
        const prevMonth = differenceInDays(monthDate, yearDate) / 30;
        if (nextMonth > prevMonth) {
          setDATE((prev) => ({
            ...prev,
            strStartDt: `${year.getFullYear() + 1}-01-01`,
            strEndDt: `${year.getFullYear() + 1}-12-31`,
          }));
        }
        else {
          setDATE((prev) => ({
            ...prev,
            strStartDt: `${year.getFullYear()}-01-01`,
            strEndDt: `${year.getFullYear()}-12-31`,
          }));
        }
      }
    }

    // 5. select
    if (FILTER.type === "select") {
      mode = "range";
      selected = DATE.strStartDt && DATE.strEndDt && {from: new Date(DATE.strStartDt), to: new Date(DATE.strEndDt)}
      month = new Date(DATE.strStartDt)
      onDayClick = (day) => {
        const selectedDay = new Date(day);
        const fmtDate = moment(selectedDay).format("YYYY-MM-DD");
        if (DATE.strStartDt && DATE.strEndDt) {
          if (selectedDay < new Date(DATE.strStartDt)) {
            setDATE((prev) => ({
              ...prev,
              strStartDt: fmtDate,
              strEndDt: fmtDate,
            }));
          }
          else if (selectedDay > new Date(DATE.strEndDt)) {
            setDATE((prev) => ({
              ...prev,
              strEndDt: fmtDate,
            }));
          }
          else {
            setDATE((prev) => ({
              ...prev,
              strStartDt: fmtDate,
              strEndDt: fmtDate,
            }));
          }
        }
        else if (DATE.strStartDt) {
          if (selectedDay < new Date(DATE.strStartDt)) {
            setDATE((prev) => ({
              ...prev,
              strEndDt: DATE.strStartDt,
              strStartDt: fmtDate,
            }));
          }
          else if (selectedDay > new Date(DATE.strStartDt)) {
            setDATE((prev) => ({
              ...prev,
              strEndDt: fmtDate,
            }));
          }
          else {
            setDATE((prev) => ({
              ...prev,
              strStartDt: undefined,
              strEndDt: undefined,
            }));
          }
        }
        else {
          setDATE((prev) => ({
            ...prev,
            strStartDt: fmtDate,
          }));
        }
      }
      onMonthChange = (month) => {
        setDATE((prev) => ({
          ...prev,
          strStartDt: new Date(month.getFullYear(), month.getMonth(), 1),
          strEndDt: undefined,
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
        mode={mode}
        selected={selected}
        month={month}
        onDayClick={onDayClick}
        onMonthChange={onMonthChange}
      ></DayPicker>
    );
  };

  return (
    <Draggable>
      <div className={`dayPicker-container ${CALENDAR.calOpen ? "" : "d-none"}`}>
        <span className="d-right fw-700 pointer"
          style={{position: "absolute", right: "15px", top: "10px"}}
          onClick={() => (
            setCALENDAR((prev) => ({
              ...prev,
              calOpen: false
            }))
          )}
        >
          X
        </span>
        <div className="h-2"></div>
        <div>{calendarType()}</div>
      </div>
    </Draggable>
  );
};
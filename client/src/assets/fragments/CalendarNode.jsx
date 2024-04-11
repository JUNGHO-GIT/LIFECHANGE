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
        strDur: `${DATE.strDt} ~ ${DATE.strDt}`,
      }));
    }
    else if (FILTER.type === "week") {
      setDATE((prev) => ({
        ...prev,
        strDur: `${DATE.strStartDt} ~ ${DATE.strEndDt}`,
      }));
    }
    else if (FILTER.type === "month") {
      setDATE((prev) => ({
        ...prev,
        strDur: `${moment(DATE.strDt).startOf("month").format("YYYY-MM-DD")} ~ ${moment(DATE.strDt).endOf("month").format("YYYY-MM-DD")}`,
      }));
    }
    else if (FILTER.type === "year") {
      setDATE((prev) => ({
        ...prev,
        strDur: `${moment(DATE.strDt).startOf("year").format("YYYY-MM-DD")} ~ ${moment(DATE.strDt).endOf("year").format("YYYY-MM-DD")}`,
      }));
    }
    else if (FILTER.type === "select") {
      setDATE((prev) => ({
        ...prev,
        strDur: `${DATE.strStartDt} ~ ${DATE.strEndDt}`,
      }));
    }
  }, [FILTER.type, DATE.strDt, DATE.strStartDt, DATE.strEndDt]);

  // 4. calendarType ------------------------------------------------------------------------------>
  function calendarType () {

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
      onDayClick= (day) => {
        const selectedDate = moment(day);
        const startOfWeek = selectedDate.clone().startOf("week").add(1, "days");
        const endOfWeek = startOfWeek.clone().add(6, "days");
        setDATE((prev) => ({
          ...prev,
          strStartDt: startOfWeek.format("YYYY-MM-DD"),
          strEndDt: endOfWeek.format("YYYY-MM-DD"),
        }));
      }
      onMonthChange= (month) => {
        setDATE((prev) => ({
          ...prev,
          strStartDt: month,
          strEndDt: undefined,
        }));
      }
    }

    // 3. month
    if (FILTER.type === "month") {
      mode = "default";
      month = new Date(DATE?.strDur?.split(" ~ ")[0])
      onMonthChange = (month) => {
        const startOfMonth = moment(month).startOf("month").format("YYYY-MM-DD");
        const endOfMonth = moment(month).endOf("month").format("YYYY-MM-DD");
        setDATE((prev) => ({
          ...prev,
          strDur: `${startOfMonth} ~ ${endOfMonth}`,
        }));
      }
    }

    // 4. year
    if (FILTER.type === "year") {
      mode="default"
      month= new Date(DATE?.strDur?.split(" ~ ")[0])
      onMonthChange = (year) => {
        const yearDate = new Date(year.getFullYear(), 0, 1);
        const monthDate = new Date(year.getFullYear(), year.getMonth(), 1);
        const nextMonth = differenceInDays(new Date(year.getFullYear() + 1, 0, 1), monthDate) / 30;
        const prevMonth = differenceInDays(monthDate, yearDate) / 30;
        if (nextMonth > prevMonth) {
          setDATE((prev) => ({
            ...prev,
            strDur: `${year.getFullYear() + 1}-01-01 ~ ${year.getFullYear() + 1}-12-31`,
          }));
        }
        else {
          setDATE((prev) => ({
            ...prev,
            strDur: `${year.getFullYear()}-01-01 ~ ${year.getFullYear()}-12-31`,
          }));
        }
      }
    }

    // 5. select
    if (FILTER.type === "select") {
      mode = "range"
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
      />
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
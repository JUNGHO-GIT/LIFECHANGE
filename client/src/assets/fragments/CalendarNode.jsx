// CalendarNode.jsx

import React, {useEffect} from "react";
import {DayPicker} from "react-day-picker";
import moment from "moment-timezone";
import Draggable from "react-draggable";
import {ko} from "date-fns/locale";
import {differenceInDays} from "date-fns";

// 4. calendar ------------------------------------------------------------------------------------>
export const CalendarNode = ({
  filter, setFilter, strDate, setStrDate, strStartDate, setStrStartDate, strEndDate, setStrEndDate, strDur, setStrDur, calendarOpen, setCalendarOpen
}) => {

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (filter.type === "day") {
      setStrDur(`${strDate} ~ ${strDate}`);
    }
    else if (filter.type === "week") {
      setStrDur(`${strStartDate} ~ ${strEndDate}`);
    }
    else if (filter.type === "month") {
      setStrDur(`${moment(strDate).startOf("month").format("YYYY-MM-DD")} ~ ${moment(strDate).endOf("month").format("YYYY-MM-DD")}`);
    }
    else if (filter.type === "year") {
      setStrDur(`${moment(strDate).startOf("year").format("YYYY-MM-DD")} ~ ${moment(strDate).endOf("year").format("YYYY-MM-DD")}`);
    }
    else if (filter.type === "select") {
      setStrDur(`${strStartDate} ~ ${strEndDate}`);
    }
  }, [filter.type, strDate, strStartDate, strEndDate]);

  // 4. calendarType ------------------------------------------------------------------------------>
  function calendarType () {

    let mode;
    let selected;
    let month;
    let onDayClick;
    let onMonthChange;

    // 1. day
    if (filter.type === "day") {
      mode = "single";
      selected = new Date(strDate);
      month = new Date(strDate);
      onDayClick = (day) => {
        setStrDate(moment(day).format("YYYY-MM-DD"));
      };
      onMonthChange = (month) => {
        setStrDate(moment(month).format("YYYY-MM-DD"));
      };
    }

    // 2. week
    if (filter.type === "week") {
      mode = "range";
      selected = strStartDate && strEndDate && {from: new Date(strStartDate), to: new Date(strEndDate)};
      month = strStartDate && strEndDate && new Date(strStartDate)
      onDayClick= (day) => {
        const selectedDate = moment(day);
        const startOfWeek = selectedDate.clone().startOf("week").add(1, "days");
        const endOfWeek = startOfWeek.clone().add(6, "days");
        setStrStartDate(moment(startOfWeek).format("YYYY-MM-DD"));
        setStrEndDate(moment(endOfWeek).format("YYYY-MM-DD"));
      }
      onMonthChange= (month) => {
        setStrStartDate(month);
        setStrEndDate(undefined);
      }
    }

    // 3. month
    if (filter.type === "month") {
      mode = "default";
      month = new Date(strDur.split(" ~ ")[0])
      onMonthChange = (month) => {
        const startOfMonth = moment(month).startOf("month").format("YYYY-MM-DD");
        const endOfMonth = moment(month).endOf("month").format("YYYY-MM-DD");
        setStrDur(`${startOfMonth} ~ ${endOfMonth}`);
      }
    }

    // 4. year
    if (filter.type === "year") {
      mode="default"
      month= new Date(strDur.split(" ~ ")[0])
      onMonthChange= (year) => {
        const yearDate = new Date(year.getFullYear(), 0, 1);
        const monthDate = new Date(year.getFullYear(), year.getMonth(), 1);
        const nextMonth = differenceInDays(new Date(year.getFullYear() + 1, 0, 1), monthDate) / 30;
        const prevMonth = differenceInDays(monthDate, yearDate) / 30;
        if (nextMonth > prevMonth) {
          setStrDur(`${year.getFullYear() + 1}-01-01 ~ ${year.getFullYear() + 1}-12-31`);
        }
        else {
          setStrDur(`${year.getFullYear()}-01-01 ~ ${year.getFullYear()}-12-31`);
        }
      }
    }

    // 5. select
    if (filter.type === "select") {
      mode = "range"
      selected = strStartDate && strEndDate && {from: strStartDate, to: strEndDate}
      month = strStartDate
      onDayClick =  (day) => {
        const selectedDay = new Date(day);
        const fmtDate = moment(selectedDay).format("YYYY-MM-DD");
        if (strStartDate && strEndDate) {
          if (selectedDay < new Date(strStartDate)) {
            setStrStartDate(fmtDate);
            setStrEndDate(fmtDate);
          }
          else if (selectedDay > new Date(strEndDate)) {
            setStrEndDate(fmtDate);
          }
          else {
            setStrStartDate(fmtDate);
            setStrEndDate(fmtDate);
          }
        }
        else if (strStartDate) {
          if (selectedDay < new Date(strStartDate)) {
            setStrEndDate(strStartDate);
            setStrStartDate(fmtDate);
          }
          else if (selectedDay > new Date(strStartDate)) {
            setStrEndDate(fmtDate);
          }
          else {
            setStrStartDate(undefined);
            setStrEndDate(undefined);
          }
        }
        else {
          setStrStartDate(fmtDate);
        }
      }
      onMonthChange = (month) => {
        setStrStartDate(new Date(month.getFullYear(), month.getMonth(), 1));
        setStrEndDate(undefined);
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
      <div className={`dayPicker-container ${calendarOpen ? "" : "d-none"}`}>
        <span className="d-right fw-700 pointer" style={{position: "absolute", right: "15px", top: "10px"}} onClick={() => (
          setCalendarOpen(false)
        )}>
          X
        </span>
        <div className="h-2"></div>
        <div>{calendarType()}</div>
      </div>
    </Draggable>
  );
};
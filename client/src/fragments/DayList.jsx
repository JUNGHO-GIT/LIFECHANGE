// DayList.jsx

import React, {useEffect} from "react";
import {DayPicker} from "react-day-picker";
import "moment/locale/ko";
import moment from "moment-timezone";
import {ko} from "date-fns/locale";
import {differenceInDays} from "date-fns";

// 8. dayPicker ----------------------------------------------------------------------------------->
export const DayList = ({
  FILTER, setFILTER, DATE, setDATE, DAYPICKER, setDAYPICKER
}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (FILTER?.type === "day") {
      setDATE((prev) => ({
        ...prev,
        startDt: moment(koreanDate).format("YYYY-MM-DD"),
        endDt: moment(koreanDate).format("YYYY-MM-DD"),
      }));
    }
    else if (FILTER?.type === "week") {
      setDATE((prev) => ({
        ...prev,
        startDt: moment(koreanDate).startOf("isoWeek").format("YYYY-MM-DD"),
        endDt: moment(koreanDate).endOf("isoWeek").format("YYYY-MM-DD")
      }));
    }
    else if (FILTER?.type === "month") {
      setDATE((prev) => ({
        ...prev,
        startDt: moment(koreanDate).startOf("month").format("YYYY-MM-DD"),
        endDt: moment(koreanDate).endOf("month").format("YYYY-MM-DD")
      }));
    }
    else if (FILTER?.type === "year") {
      setDATE((prev) => ({
        ...prev,
        startDt: moment(koreanDate).startOf("year").format("YYYY-MM-DD"),
        endDt: moment(koreanDate).endOf("year").format("YYYY-MM-DD")
      }));
    }
    else if (FILTER?.type === "select") {
      setDATE((prev) => ({
        ...prev,
        startDt: moment(koreanDate).format("YYYY-MM-DD"),
        endDt: moment(koreanDate).format("YYYY-MM-DD"),
      }));
    }
  }, [FILTER?.type]);


  // 3. closeBtn ---------------------------------------------------------------------------------->
  const closeBtn = () => (
    <span className={"d-right fw-700 dayPicker-x-btn"} onClick={() => (
      setDAYPICKER((prev) => ({
        ...prev,
        dayOpen: false
      })
    ))}>
      X
    </span>
  );

  // 4. calendar ---------------------------------------------------------------------------------->
  const calendar = () => {

    let mode = "";
    let selected = undefined;
    let month = new Date(DATE.startDt);
    let onDayClick = undefined;
    let onMonthChange = undefined;

    // 1. day
    if (FILTER?.type === "day") {
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
    if (FILTER?.type === "week") {
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
    if (FILTER?.type === "month") {
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
    if (FILTER?.type === "year") {
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
    if (FILTER?.type === "select") {
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
        //@ts-ignore
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
      <div className={`dayPicker-container ${DAYPICKER.dayOpen ? "" : "d-none"}`}>
        {closeBtn()}
        <div className={"h-2vh"}></div>
        {calendar()}
      </div>
    </React.Fragment>
  );
};
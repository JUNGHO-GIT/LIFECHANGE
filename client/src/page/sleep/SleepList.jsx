// SleepList.jsx

import React, {useEffect, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/js/useStorage.jsx";
import {DayPicker} from "react-day-picker";
import Draggable from "react-draggable";
import {ko} from "date-fns/locale";
import moment from "moment-timezone";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const SleepList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  const navParam = useNavigate();
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:calendarOpen, set:setCalendarOpen} = useStorage(
    `calendarOpen(${PATH})`, false
  );
  const {val:totalCount, set:setTotalCount} = useStorage(
    `totalCount(${PATH})`, 0
  );
  const {val:type, set:setType} = useStorage(
    `type(${PATH})`, "day"
  );
  const {val:filter, set:setFilter} = useStorage(
    `filter(${PATH})`, {order: "asc", page: 1, limit: 5}
  );

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:strStart, set:setStrStart} = useStorage(
    `strStart(${PATH})`, koreanDate
  );
  const {val:strEnd, set:setStrEnd} = useStorage(
    `strEnd(${PATH})`, koreanDate
  );
  const {val:strDate, set:setStrDate} = useStorage(
    `strDate(${PATH})`, koreanDate
  );
  const {val:strDur, set:setStrDur} = useStorage(
    `strDur(${PATH})`, `${koreanDate} ~ ${koreanDate}`
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [SLEEP_DEFAULT, setSLEEP_DEFAULT] = useState([{
    _id: "",
    sleep_day: "",
    sleep_real : {
      sleep_section: [{
        sleep_start: "",
        sleep_end: "",
        sleep_time: "",
      }]
    },
    sleep_plan : {
      sleep_section: [{
        sleep_start: "",
        sleep_end: "",
        sleep_time: "",
      }]
    }
  }]);
  const [SLEEP, setSLEEP] = useState([{
    _id: "",
    sleep_day: "",
    sleep_real : {
      sleep_section: [{
        sleep_start: "",
        sleep_end: "",
        sleep_time: "",
      }]
    },
    sleep_plan : {
      sleep_section: [{
        sleep_start: "",
        sleep_end: "",
        sleep_time: "",
      }]
    }
  }]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {

    const response = await axios.get(`${URL_SLEEP}/list`, {
      params: {
        user_id: user_id,
        sleep_dur: strDur,
        filter: filter
      },
    });

    setTotalCount(response.data.totalCount ? response.data.totalCount : 0);
    setSLEEP(response.data.result ? response.data.result : SLEEP_DEFAULT);

  })()}, [strDur, filter]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (type === "day") {
      setStrDur(`${strDate} ~ ${strDate}`);
    }
    else if (type === "week") {
      setStrDur(`${strStart} ~ ${strEnd}`);
    }
    else if (type === "month") {
      setStrDur(`${moment(strDate).startOf("month").format("YYYY-MM-DD")} ~ ${moment(strDate).endOf("month").format("YYYY-MM-DD")}`);
    }
    else if (type === "year") {
      setStrDur(`${moment(strDate).startOf("year").format("YYYY-MM-DD")} ~ ${moment(strDate).endOf("year").format("YYYY-MM-DD")}`);
    }
    else if (type === "select") {
      setStrDur(`${strStart} ~ ${strEnd}`);
    }
  }, [type, strDate, strStart, strEnd]);

  // 4-1. view ----------------------------------------------------------------------------------->
  const viewSleepList = () => {
    let dayPicker;
    if (type === "day") {
      dayPicker = (
        <DayPicker
          weekStartsOn={1}
          showOutsideDays={true}
          locale={ko}
          modifiersClassNames={{
            selected: "selected", disabled: "disabled", outside: "outside", inside: "inside",
          }}
          mode="single"
          selected={new Date(strDate)}
          onDayClick={(day) => {
            setStrDate(moment(day).format("YYYY-MM-DD"));
          }}
          onMonthChange={(month) => {
            setStrDate(moment(month).format("YYYY-MM-DD"));
          }}
        />
      );
    };
    if (type === "week") {
      dayPicker = (
        <DayPicker
          weekStartsOn={1}
          showOutsideDays={true}
          locale={ko}
          modifiersClassNames={{
            selected: "selected", disabled: "disabled", outside: "outside", inside: "inside",
          }}
          mode="range"
          selected={strStart && strEnd && {from: new Date(strStart), to: new Date(strEnd)}}
          month={strStart && strEnd && new Date(strStart)}
          onDayClick={(day) => {
            const selectedDate = moment(day);
            const startOfWeek = selectedDate.clone().startOf("week").add(1, "days");
            const endOfWeek = startOfWeek.clone().add(6, "days");
            setStrStart(moment(startOfWeek).format("YYYY-MM-DD"));
            setStrEnd(moment(endOfWeek).format("YYYY-MM-DD"));
          }}
          onMonthChange={(month) => {
            setStrStart(month);
            setStrEnd(undefined);
          }}
        />
      );
    }
    if (type === "month") {
      dayPicker = (
        <DayPicker
          weekStartsOn={1}
          showOutsideDays={true}
          locale={ko}
          modifiersClassNames={{
            selected: "selected", disabled: "disabled", outside: "outside", inside: "inside",
          }}
          mode="default"
          month={new Date(strDur.split(" ~ "))}
          onMonthChange={(month) => {
            const startOfMonth = moment(month).startOf("month").format("YYYY-MM-DD");
            const endOfMonth = moment(month).endOf("month").format("YYYY-MM-DD");
            setStrDur(`${startOfMonth} ~ ${endOfMonth}`);
          }}
        />
      );
    }
    if (type === "year") {
      dayPicker = (
        <DayPicker
          weekStartsOn={1}
          showOutsideDays={true}
          locale={ko}
          modifiersClassNames={{
            selected: "selected", disabled: "disabled", outside: "outside", inside: "inside",
          }}
          mode="default"
          onMonthChange={(month) => {
            const startOfYear = moment(month).startOf("year").format("YYYY-MM-DD");
            const endOfYear = moment(month).endOf("year").format("YYYY-MM-DD");
            setStrDur(`${startOfYear} ~ ${endOfYear}`);
          }}
        />
      );
    };
    if (type === "select") {
      dayPicker = (
        <DayPicker
          weekStartsOn={1}
          showOutsideDays={true}
          locale={ko}
          modifiersClassNames={{
            selected: "selected", disabled: "disabled", outside: "outside", inside: "inside",
          }}
          mode="range"
          selected={strStart && strEnd && {from:new Date(strStart), to:new Date(strEnd)}}
          month={strStart && strEnd && new Date(strStart)}
          onDayClick= {(day) => {
            const selectedDay = new Date(day);
            const startDay = strStart ? new Date(strStart) : null;
            const endDay = strEnd ? new Date(strEnd) : null;

            if (startDay && endDay) {
              setStrStart(moment(day).format("YYYY-MM-DD"));
              setStrEnd(undefined);
            }
            else if (startDay) {
              if (selectedDay < startDay) {
                setStrEnd(moment(startDay).format("YYYY-MM-DD"));
                setStrStart(moment(day).format("YYYY-MM-DD"));
              }
              else if (selectedDay > startDay) {
                setStrEnd(moment(day).format("YYYY-MM-DD"));
              }
              else {
                setStrStart(undefined);
                setStrEnd(undefined);
              }
            }
            else {
              setStrStart(moment(day).format("YYYY-MM-DD"));
            }
          }}
          onMonthChange={(month) => {
            setStrStart(new Date(month.getFullYear(), month.getMonth(), 1));
            setStrEnd(undefined);
          }}
        />
      );
    };
    return (
      <Draggable>
        <div className={`dayPicker-container ${calendarOpen ? "" : "d-none"}`}>
          <span
            className="d-right fw-700 pointer"
            onClick={() => setCalendarOpen(false)}
            style={{position: "absolute", right: "15px", top: "10px"}}
          >
            X
          </span>
          <div className="h-2"></div>
          {dayPicker}
        </div>
      </Draggable>
    );
  };

  // 5-1. table ----------------------------------------------------------------------------------->
  const tableSleepList = () => {
    const successOrNot = (plan, real) => {
      const planDate = new Date(`1970-01-01T${plan}:00.000Z`);
      const realDate = new Date(`1970-01-01T${real}:00.000Z`);

      if (realDate < planDate) {
        realDate.setHours(realDate.getHours() + 24);
      }
      const diff = Math.abs(realDate.getTime() - planDate.getTime());
      const diffMinutes = Math.floor(diff / 60000);

      let textColor = "text-muted";
      if (0 <= diffMinutes && diffMinutes <= 10) {
        textColor = "text-primary";
      }
      if (10 < diffMinutes && diffMinutes <= 20) {
        textColor = "text-success";
      }
      if (20 < diffMinutes && diffMinutes <= 30) {
        textColor = "text-warning";
      }
      if (30 < diffMinutes) {
        textColor = "text-danger";
      }
      return textColor;
    };
    return (
      <table className="table bg-white table-hover">
        <thead className="table-primary">
          <tr>
            <th>날짜</th>
            <th>분류</th>
            <th>목표</th>
            <th>실제</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {SLEEP.map((item) => (
            <React.Fragment key={item._id}>
              <tr>
                <td rowSpan={3} className="pointer" onClick={() => {
                  navParam("/sleep/detail", {
                    state: {
                      _id: item._id,
                      sleep_day: item.sleep_day,
                    },
                  });
                }}>
                  {item.sleep_day}
                </td>
                <td>취침</td>
                <td>
                  {item.sleep_plan?.sleep_section?.map((item) => item.sleep_start)}
                </td>
                <td>
                  {item.sleep_real?.sleep_section?.map((item) => item.sleep_start)}
                </td>
                <td>
                  <span className={successOrNot(
                    item.sleep_plan?.sleep_section?.map((item) => item.sleep_start),
                    item.sleep_real?.sleep_section?.map((item) => item.sleep_start)
                  )}>
                    ●
                  </span>
                </td>
              </tr>
              <tr>
                <td>기상</td>
                <td>
                  {item.sleep_plan?.sleep_section?.map((item) => item.sleep_end)}
                </td>
                <td>
                  {item.sleep_real?.sleep_section?.map((item) => item.sleep_end)}
                </td>
                <td>
                  <span className={successOrNot(
                    item.sleep_plan?.sleep_section?.map((item) => item.sleep_end),
                    item.sleep_real?.sleep_section?.map((item) => item.sleep_end)
                  )}>
                    ●
                  </span>
                </td>
              </tr>
              <tr>
                <td>수면</td>
                <td>
                  {item.sleep_plan?.sleep_section?.map((item) => item.sleep_time)}
                </td>
                <td>
                  {item.sleep_real?.sleep_section?.map((item) => item.sleep_time)}
                </td>
                <td>
                  <span className={successOrNot(
                    item.sleep_plan?.sleep_section?.map((item) => item.sleep_time),
                    item.sleep_real?.sleep_section?.map((item) => item.sleep_time)
                  )}>
                    ●
                  </span>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    );
  };

  // 5-2. filter ---------------------------------------------------------------------------------->
  const filterBox = () => {
    const pageNumber = () => {
      const pages = [];
      const totalPages = Math.ceil(totalCount / filter.limit);
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            className={`btn btn-sm ${filter.page === i ? "btn-secondary" : "btn-primary"} me-2`}
            onClick={() => setFilter({
              ...filter, page: i
            })}
          >
            {i}
          </button>
        );
      }
      return pages;
    };
    const prevNumber = () => {
      return (
        <button
          className="btn btn-sm btn-primary ms-10 me-10"
          onClick={() => setFilter({
            ...filter, page: Math.max(1, filter.page - 1) }
          )}
        >
          이전
        </button>
      );
    }
    const nextNumber = () => {
      return (
        <button
          className="btn btn-sm btn-primary ms-10 me-10"
          onClick={() => setFilter({
            ...filter, page: Math.min(Math.ceil(totalCount / filter.limit), filter.page + 1) }
          )}
        >
          다음
        </button>
      );
    }
    return (
      <div className="d-inline-flex">
        {prevNumber()}
        {pageNumber()}
        {nextNumber()}
      </div>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonCalendar = () => {
    return (
      <button
        type="button"
        className={`btn btn-sm ${calendarOpen ? "btn-danger" : "btn-primary"} m-5`}
        onClick={() => setCalendarOpen(!calendarOpen)}
      >
        {calendarOpen ? "x" : "o"}
      </button>
    );
  };
  const buttonSleepToday = () => {
    return (
      <button type="button" className="btn btn-sm btn-success me-2" onClick={() => {
        setStrDate(koreanDate);
        localStorage.removeItem(`sleepList(${type})`);
        localStorage.removeItem(`strStart(${type})`);
        localStorage.removeItem(`strEnd(${type})`);
      }}>
        Today
      </button>
    );
  };
  const buttonSleepReset = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => {
        setStrDate(koreanDate);
        localStorage.removeItem(`sleepList(${type})`);
        localStorage.removeItem(`strStart(${type})`);
        localStorage.removeItem(`strEnd(${type})`);
      }}>
        Reset
      </button>
    );
  };

  // 6-2. select ---------------------------------------------------------------------------------->
  const selectSleepType = () => {
    return (
      <div className="mb-3">
        <select className="form-select" id="typePre" onChange={(e) => {
          if (e.target.value === "day") {
            setType("day");
          }
          else if (e.target.value === "week") {
            setType("week");
          }
          else if (e.target.value === "month") {
            setType("month");
          }
          else if (e.target.value === "year") {
            setType("year");
          }
          else if (e.target.value === "select") {
            setType("select");
          }
        }}>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
          <option value="select">Select</option>
        </select>
      </div>
    );
  };

  // 6-3. select ---------------------------------------------------------------------------------->
  const selectFilterSub = () => {
    return (
      <div className="mb-3">
        <select className="form-select" id="sleepListSortOrder" onChange={(e) => {
          setFilter({...filter, order: e.target.value});
        }}>
          <option value="asc" selected>오름차순</option>
          <option value="desc">내림차순</option>
        </select>
      </div>
    );
  };
  const selectFilterPage = () => {
    return (
      <div className="mb-3">
        <select className="form-select" id="sleepListLimit" onChange={(e) => {
          setFilter({...filter, limit: Number(e.target.value)});
        }}>
          <option value="5" selected>5</option>
          <option value="10">10</option>
        </select>
      </div>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row mb-20">
          <div className="col-1">
            {viewSleepList()}
          </div>
          <div className="col-2">
            {selectSleepType()}
          </div>
          <div className="col-2">
            {selectFilterSub()}
          </div>
          <div className="col-2">
            {selectFilterPage()}
          </div>
        </div>
        <div className="row mb-20">
          <div className="col-12 d-center">
            {tableSleepList()}
          </div>
        </div>
        <div className="row mb-20">
          <div className="col-12 d-center">
            {filterBox()}
          </div>
        </div>
        <div className="row mb-20">
          <div className="col-12 d-center">
            {buttonCalendar()}
            {buttonSleepToday()}
            {buttonSleepReset()}
          </div>
        </div>
      </div>
    </div>
  );
};
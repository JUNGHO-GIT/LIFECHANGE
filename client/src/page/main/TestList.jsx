// TestList.jsx

import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {DayPicker} from "react-day-picker";
import Draggable from "react-draggable";
import {differenceInDays} from "date-fns";
import {ko} from "date-fns/locale";
import moment from "moment-timezone";
import axios from "axios";
import {workPartArray, workTitleArray} from "./WorkArray.jsx";
import {useDeveloperMode} from "../../assets/js/useDeveloperMode.jsx";

// ------------------------------------------------------------------------------------------------>
export const TestList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  const navParam = useNavigate();
  const user_id = window.sessionStorage.getItem("user_id");

  // 2-1. useState -------------------------------------------------------------------------------->
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [type, setType] = useState("day");
  const [filter, setFilter] = useState({
    order: "asc",
    page: 1,
    limit: 5,
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const [strDate, setStrDate] = useState(koreanDate);
  const [strDur, setStrDur] = useState(`${koreanDate} ~ ${koreanDate}`);
  const [strStart, setStrStart] = useState(koreanDate);
  const [strEnd, setStrEnd] = useState(koreanDate);

  // 2-2. useState -------------------------------------------------------------------------------->
  const [WORK_DEFAULT, setWORK_DEFAULT] = useState([{
    work_number: 0,
    work_day: "",
    work_real : {
      work_start: "",
      work_end: "",
      work_time: "",
      work_section: [{
        work_part_idx: 0,
        work_part_val: "전체",
        work_title_idx: 0,
        work_title_val: "전체",
        work_set: 0,
        work_count: 0,
        work_kg: 0,
        work_rest: 0,
      }],
    },
    work_plan : {
      work_start: "",
      work_end: "",
      work_time: "",
      work_section: [{
        work_part_idx: 0,
        work_part_val: "전체",
        work_title_idx: 0,
        work_title_val: "전체",
        work_set: 0,
        work_count: 0,
        work_kg: 0,
        work_rest: 0,
      }],
    }
  }]);
  const [WORK, setWORK] = useState([{
    work_number: 0,
    work_day: "",
    work_real : {
      work_start: "",
      work_end: "",
      work_time: "",
      work_section: [{
        work_part_idx: 0,
        work_part_val: "전체",
        work_title_idx: 0,
        work_title_val: "전체",
        work_set: 0,
        work_count: 0,
        work_kg: 0,
        work_rest: 0,
      }],
    },
    work_plan : {
      work_start: "",
      work_end: "",
      work_time: "",
      work_section: [{
        work_part_idx: 0,
        work_part_val: "전체",
        work_title_idx: 0,
        work_title_val: "전체",
        work_set: 0,
        work_count: 0,
        work_kg: 0,
        work_rest: 0,
      }],
    }
  }]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {

    const response = await axios.get(`${URL_WORK}/list`, {
      params: {
        user_id: user_id,
        work_dur: strDur,
        filter: filter
      },
    });

    setTotalCount(response.data.totalCount);
    setWORK(response.data.result || WORK_DEFAULT);

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
  const viewWorkList = () => {
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
  const tableWorkList = () => {
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
          {WORK.map((item) => (
            <React.Fragment key={item.work_day}>
              <tr>
                <td rowSpan={6} className="pointer" onClick={() => {
                  navParam("/work/detail", {
                    state: {_id: item._id}
                  });
                }}>
                  {item.work_day}
                </td>
                <td>시작</td>
                <td>{item.work_plan.work_start}</td>
                <td>{item.work_real.work_start}</td>
                <td></td>
              </tr>
              <tr>
                <td>끝</td>
                <td>{item.work_plan.work_end}</td>
                <td>{item.work_real.work_end}</td>
                <td></td>
              </tr>
              <tr>
                <td>시간</td>
                <td>{item.work_plan.work_time}</td>
                <td>{item.work_real.work_time}</td>
                <td></td>
              </tr>
              {item.work_plan.work_section?.map((section2, index2) => (
                <tr key={index2}>
                  <td></td>
                  <td>
                    {section2.work_part_val || ""} {section2.work_title_val || ""} {section2.work_kg || ""} x {section2.work_set || ""} x {section2.work_count || ""}
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              ))}
              {item.work_real.work_section?.map((section1, index1) => (
                <tr key={index1}>
                  <td></td>
                  <td></td>
                  <td>
                    {section1.work_part_val || ""} {section1.work_title_val || ""} {section1.work_kg || ""} x {section1.work_set || ""} x {section1.work_count || ""}
                  </td>
                  <td></td>
                </tr>
              ))}
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
  const buttonWorkToday = () => {
    return (
      <button type="button" className="btn btn-sm btn-success me-2" onClick={() => {
        setStrDate(koreanDate);
        localStorage.removeItem(`workList(${type})`);
        localStorage.removeItem(`strStart(${type})`);
        localStorage.removeItem(`strEnd(${type})`);
      }}>
        Today
      </button>
    );
  };
  const buttonWorkReset = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => {
        setStrDate(koreanDate);
        localStorage.removeItem(`workList(${type})`);
        localStorage.removeItem(`strStart(${type})`);
        localStorage.removeItem(`strEnd(${type})`);
      }}>
        Reset
      </button>
    );
  };

  // 6-2. select ---------------------------------------------------------------------------------->
  const selectWorkType = () => {
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
        <select className="form-select" id="workListSortOrder" onChange={(e) => {
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
        <select className="form-select" id="workListLimit" onChange={(e) => {
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
            {viewWorkList()}
          </div>
          <div className="col-2">
            {selectWorkType()}
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
            {tableWorkList()}
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
            {buttonWorkToday()}
            {buttonWorkReset()}
          </div>
        </div>
      </div>
    </div>
  );
};

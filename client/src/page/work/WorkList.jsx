// WorkList.jsx

import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {DayPicker} from "react-day-picker";
import Draggable from "react-draggable";
import {differenceInDays} from "date-fns";
import {ko} from "date-fns/locale";
import moment from "moment-timezone";
import axios from "axios";
import {workPartArray, workTitleArray} from "./WorkArray.jsx";
import {useStorage} from "../../assets/js/useStorage.jsx";
import {useDeveloperMode} from "../../assets/js/useDeveloperMode.jsx";

// ------------------------------------------------------------------------------------------------>
export const WorkList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  const navParam = useNavigate();
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [workNumber, setWorkNumber] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [type, setType] = useState("day");
  const [filter, setFilter] = useState({
    order: "asc",
    part: "전체",
    title: "전체",
    page: 1,
    limit: 5,
  });

  // 2-2. useStorage ------------------------------------------------------------------------------>
  const {val:workResDur, setVal:setWorkResDur} = useStorage(
    `workResDur(${type})`, "0000-00-00 ~ 0000-00-00"
  );
  const {val:workStartDay, setVal:setWorkStartDay} = useStorage(
    `workStartDay(${type})`, undefined
  );
  const {val:workEndDay, setVal:setWorkEndDay} = useStorage(
    `workEndDay(${type})`, undefined
  );
  const {val:workDay, setVal:setWorkDay} = useStorage(
    `workDay(${type})`, koreanDate
  );
  const {val:WORK_LIST, setVal:setWORK_LIST} = useStorage(
    `workList(${type})`, []
  );

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    // 1. list
    const responseList = await axios.get(`${URL_WORK}/list`, {
      params: {
        user_id: user_id,
        work_dur: workResDur,
        planYn: "N",
        filter: filter,
      },
    });

    // 2. plan
    const responsePlan = await axios.get(`${URL_WORK}/list`, {
      params: {
        user_id: user_id,
        work_dur: workResDur,
        planYn: "Y",
        filter: filter,
      },
    });

    // 3. merged
    let mergedData;
    const workList = responseList.data.workList || [];
    const planList = responsePlan.data.workList || [];

    if (workList.length > 0 || planList.length > 0) {
      const allWorkDays = [...workList, ...planList]
        .map(item => item.work_day)
        .filter((value, index, self) => self.indexOf(value) === index);

      mergedData = allWorkDays.map(day => {
        const listItem = workList.find((item) => item.work_day === day) || {};
        const planItem = planList.find((item) => item.work_day === day) || {};

        return {
          val: {
            _id: listItem._id || "",
            work_dur: workResDur,
            work_day: day,
            work_start: listItem.work_start || "",
            work_end: listItem.work_end || "",
            work_time: listItem.work_time || 0,
          },
          real: listItem.work_section?.map((section) => ({
            work_part_idx: section.work_part_idx,
            work_part_val: section.work_part_val,
            work_title_idx: section.work_title_idx,
            work_title_val: section.work_title_val,
            work_kg: section.work_kg,
            work_set: section.work_set,
            work_count: section.work_count,
            work_rest: section.work_rest,
          })) || [],
          plan: planItem.work_section?.map((section) => ({
            work_part_idx: section.work_part_idx,
            work_part_val: section.work_part_val,
            work_title_idx: section.work_title_idx,
            work_title_val: section.work_title_val,
            work_kg: section.work_kg,
            work_set: section.work_set,
            work_count: section.work_count,
            work_rest: section.work_rest,
          })) || [],
        };
      });
    };

    setTotalCount(responseList.data.totalCount);
    setWORK_LIST(mergedData);
    log("WORK_LIST : " + JSON.stringify(mergedData));

  })()}, [user_id, workResDur, filter]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (workDay) {
      let result = "";
      const year = workDay?.getFullYear();
      const month = formatVal(workDay.getMonth() + 1);
      switch (type) {
        case "day":
          const date = formatVal(workDay.getDate());
          result = `${year}-${month}-${date} ~ ${year}-${month}-${date}`;
          break;
        case "week":
          result = getStartAndEndDate(workStartDay, workEndDay);
          break;
        case "select":
          result = getStartAndEndDate(workStartDay, workEndDay);
          break;
        case "month":
          result = `${year}-${month}-01 ~ ${year}-${month}-31`;
          break;
        case "year":
          result = `${year}-01-01 ~ ${year}-12-31`;
          break;
      }
      setWorkResDur(result);
    }
  }, [type, workStartDay, workEndDay, workDay]);

  // 3-1. logic ----------------------------------------------------------------------------------->
  const formatVal = (value) => {
    return value < 10 ? `0${value}` : `${value}`;
  };
  const getFormattedDate = (date) => {
    return `${date.getFullYear()}-${formatVal(date.getMonth() + 1)}-${formatVal(date.getDate())}`;
  };
  const getStartAndEndDate = (startDay, endDay) => {
    return `${getFormattedDate(new Date(startDay))} ~ ${getFormattedDate(new Date(endDay))}`;
  };

  // 3-2. logic ----------------------------------------------------------------------------------->
  const filterBox = () => {
    const pageNumber = () => {
      const pages = [];
      const totalPages = Math.ceil(totalCount / filter.limit);
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            className={`btn btn-sm ${filter.page === i ? "btn-secondary" : "btn-primary"} me-2`}
            onClick={() => setFilter({ ...filter, page: i })}
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
          onClick={() => setFilter({ ...filter, page: Math.max(1, filter.page - 1) })}
        >
          이전
        </button>
      );
    }
    const nextNumber = () => {
      return (
        <button
          className="btn btn-sm btn-primary ms-10 me-10"
          onClick={() => setFilter({ ...filter, page: Math.min(Math.ceil(totalCount / filter.limit), filter.page + 1) })}
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

  // 4-1. view ------------------------------------------------------------------------------------>
  const viewWorkList = () => {
    switch (type) {
      case "day":
        const handleDay = (day) => {
          const newDay = new Date(day);
          setWorkDay(newDay);
        };
        return (
          <Draggable>
            <div className={`dayPicker-container ${calendarOpen ? "" : "d-none"}`}>
              <span
                className="d-right fw-700 pointer"
                onClick={() => setCalendarOpen(false)}
                style={{
                position: "absolute",
                right: "15px",
                top: "10px",
              }}
              >
                X
              </span>
              <div className="h-2"></div>
              <DayPicker
                showOutsideDays={true}
                locale={ko}
                weekStartsOn={1}
                mode="single"
                selected={workDay}
                month={workDay}
                onDayClick={handleDay}
                onMonthChange={(month) => setWorkDay(month)}
                styles={{
                  head_cell: {
                    width: "60px",
                  },
                  table: {
                    maxWidth: "none",
                  },
                  day: {
                    margin: "auto",
                  },
                }}
                modifiersClassNames={{
                  selected: "selected",
                  disabled: "disabled",
                  outside: "outside",
                  inside: "inside",
                }}
              />
            </div>
          </Draggable>
        );
      case "week":
        const handleWeek = (day) => {
          const selectedDay = new Date(day);
          const startOfWeek = new Date(selectedDay.setDate(selectedDay.getDate() - selectedDay.getDay() + 1));
          const endOfWeek = new Date(selectedDay.setDate(selectedDay.getDate() + (7 - selectedDay.getDay())));
          setWorkStartDay(startOfWeek);
          setWorkEndDay(endOfWeek);
        };
        return (
          <Draggable>
            <div className={`dayPicker-container ${calendarOpen ? "" : "d-none"}`}>
              <DayPicker
                showOutsideDays={true}
                locale={ko}
                weekStartsOn={1}
                mode="range"
                selected={workStartDay && workEndDay && {from: workStartDay, to: workEndDay}}
                month={workStartDay}
                onDayClick={handleWeek}
                onMonthChange={(month) => {
                  setWorkStartDay(month);
                  setWorkEndDay(undefined);
                }}
                modifiersClassNames={{
                  selected: "selected",
                  disabled: "disabled",
                  outside: "outside",
                  inside: "inside",
                }}
              />
            </div>
          </Draggable>
        );
      case "month":
        const handleMonth = (month) => {
          setWorkResDur(`${month.getFullYear()}-${formatVal(month.getMonth() + 1)}-01 ~ ${month.getFullYear()}-${formatVal(month.getMonth() + 1)}-31`);
        };
        return (
          <Draggable>
            <div className={`dayPicker-container ${calendarOpen ? "" : "d-none"}`}>
              <DayPicker
                showOutsideDays={true}
                locale={ko}
                weekStartsOn={1}
                mode="default"
                month={new Date(workResDur.split(" ~ ")[0])}
                onMonthChange={handleMonth}
                modifiersClassNames={{
                  selected: "selected",
                  disabled: "disabled",
                  outside: "outside",
                  inside: "inside",
                }}
              />
            </div>
          </Draggable>
        );
      case "year":
        const handleYear = (year) => {
          const yearDate = new Date(year.getFullYear(), 0, 1);
          const monthDate = new Date(year.getFullYear(), year.getMonth(), 1);
          const nextMonth = differenceInDays(new Date(year.getFullYear() + 1, 0, 1), monthDate) / 30;
          const prevMonth = differenceInDays(monthDate, yearDate) / 30;
          if (nextMonth > prevMonth) {
            setWorkResDur(`${year.getFullYear() + 1}-01-01 ~ ${year.getFullYear() + 1}-12-31`);
          }
          else {
            setWorkResDur(`${year.getFullYear()}-01-01 ~ ${year.getFullYear()}-12-31`);
          }
        };
        return (
          <Draggable>
            <div className={`dayPicker-container ${calendarOpen ? "" : "d-none"}`}>
              <DayPicker
                showOutsideDays={true}
                locale={ko}
                weekStartsOn={1}
                mode="default"
                month={new Date(workResDur.split(" ~ ")[0])}
                onMonthChange={handleYear}
                modifiersClassNames={{
                  selected: "selected",
                  disabled: "disabled",
                  outside: "outside",
                  inside: "inside",
                }}
              />
            </div>
          </Draggable>
        );
      case "select":
        const handleSelect = (day) => {
          const selectedDay = new Date(day);
          if (workStartDay && workEndDay) {
            if (selectedDay < workStartDay) {
              setWorkStartDay(selectedDay);
            }
            else if (selectedDay > workEndDay) {
              setWorkEndDay(selectedDay);
            }
            else {
              setWorkStartDay(selectedDay);
              setWorkEndDay(undefined);
            }
          }
          else if (workStartDay) {
            if (selectedDay < workStartDay) {
              setWorkEndDay(workStartDay);
              setWorkStartDay(selectedDay);
            }
            else if (selectedDay > workStartDay) {
              setWorkEndDay(selectedDay);
            }
            else {
              setWorkStartDay(undefined);
              setWorkEndDay(undefined);
            }
          }
          else {
            setWorkStartDay(selectedDay);
          }
        }
        return (
          <Draggable>
            <div className={`dayPicker-container ${calendarOpen ? "" : "d-none"}`}>
              <DayPicker
                showOutsideDays={true}
                locale={ko}
                weekStartsOn={1}
                mode="range"
                selected={workStartDay && workEndDay && {from: workStartDay, to: workEndDay}}
                month={workStartDay}
                onDayClick={handleSelect}
                onMonthChange={(month) => {
                  setWorkStartDay(month);
                  setWorkEndDay(undefined);
                }}
                modifiersClassNames={{
                  selected: "selected",
                  disabled: "disabled",
                  outside: "outside",
                  inside: "inside",
                }}
              />
            </div>
          </Draggable>
        );
      default:
        return null;
    };
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
          {WORK_LIST.map((item) => (
            <React.Fragment key={item.val.work_day}>
              <tr>
                <td rowSpan={10} className="pointer" onClick={() => {
                  navParam("/work/detail", {
                    state: {_id: item.val._id}
                  });
                }}>
                  {item.val.work_day}
                </td>
                <td>시작</td>
                <td>{item.val.work_start}</td>
                <td>{item.val.work_start}</td>
                <td></td>
              </tr>
              <tr>
                <td>끝</td>
                <td>{item.val.work_end}</td>
                <td>{item.val.work_end}</td>
                <td></td>
              </tr>
              <tr>
                <td>시간</td>
                <td>{item.val.work_time}</td>
                <td>{item.val.work_time}</td>
                <td></td>
              </tr>
              {item.real?.map((section1, index1) => (
                <tr key={index1}>
                  <td></td>
                  <td>
                    {section1.work_part_val || ""} {section1.work_title_val || ""} {section1.work_kg || ""} x {section1.work_set || ""} x {section1.work_count || ""}
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              ))}
              {item.plan?.map((section2, index2) => (
                <tr key={index2}>
                  <td></td>
                  <td>
                    {section2.work_part_val || ""} {section2.work_title_val || ""} {section2.work_kg || ""} x {section2.work_set || ""} x {section2.work_count || ""}
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    );
  };

  // 6-1. select ---------------------------------------------------------------------------------->
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
  const selectWorkPart = () => {
    return (
      <div className="mb-3">
        <select
          className="form-control"
          id={`work_part_val`}
          value={filter.part}
          onChange={(e) => {
            setFilter({...filter, part: e.target.value});
            const index = workPartArray.findIndex(
              (item) => item.work_part[0] === e.target.value
            );
            setFilter({...filter, part: e.target.value});
            setWorkNumber(index);
          }}>
          {workPartArray.map((value, key) => (
            <option key={key} value={value.work_part[0]}>
              {value.work_part[0]}
            </option>
          ))}
        </select>
      </div>
    );
  };
  const selectWorkTitle = () => {
    return (
      <div className="mb-3">
        <select
          className="form-control"
          id={`work_title_val`}
          value={filter.title}
          onChange={(e) => {
            setFilter({...filter, title: e.target.value});
          }}>
          {workTitleArray[workNumber].work_title.map((value, key) => (
            <option key={key} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // 6-2. select ---------------------------------------------------------------------------------->
  const selectFilterOrder = () => {
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
  }
  const buttonWorkToday = () => {
    return (
      <button type="button" className="btn btn-sm btn-success m-5" onClick={() => {
        setWorkDay(koreanDate);
        localStorage.removeItem(`workList(${type})`);
        localStorage.removeItem(`workStartDay(${type})`);
        localStorage.removeItem(`workEndDay(${type})`);
        localStorage.removeItem(`workDay(${type})`);
      }}>
        Today
      </button>
    );
  };
  const buttonWorkReset = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary m-5" onClick={() => {
        setWorkDay(koreanDate);
        localStorage.removeItem(`workList(${type})`);
        localStorage.removeItem(`workStartDay(${type})`);
        localStorage.removeItem(`workEndDay(${type})`);
        localStorage.removeItem(`workDay(${type})`);
      }}>
        Reset
      </button>
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
            {selectWorkPart()}
          </div>
          <div className="col-2">
            {selectWorkTitle()}
          </div>
          <div className="col-2">
            {selectFilterOrder()}
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

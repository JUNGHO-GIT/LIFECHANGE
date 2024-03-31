// WorkListSelect.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {DayPicker} from "react-day-picker";
import {ko} from "date-fns/locale";
import {parseISO} from "date-fns";
import moment from "moment-timezone";
import axios from "axios";
import {useStorage} from "../../assets/js/useStorage.jsx";
import {useDeveloperMode} from "../../assets/js/useDeveloperMode.jsx";
import {workPartArray, workTitleArray} from "./WorkArray";

// ------------------------------------------------------------------------------------------------>
export const WorkListSelect = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const TITLE = "Work List Select";
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  const navParam = useNavigate();
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:WORK_LIST, setVal:setWORK_LIST} = useStorage(
    "workList(SELECT)", []
  );
  const {val:WORK_AVERAGE, setVal:setWORK_AVERAGE} = useStorage(
    "workAvg(SELECT)", []
  );
  const {val:workStartDay, setVal:setWorkStartDay} = useStorage(
    "workStartDay(SELECT)", undefined
  );
  const {val:workEndDay, setVal:setWorkEndDay} = useStorage(
    "workEndDay(SELECT)", undefined
  );
  const {val:workResVal, setVal:setWorkResVal} = useStorage(
    "workResVal(SELECT)", undefined
  );
  const {val:workResDur, setVal:setWorkResDur} = useStorage(
    "workResDur(SELECT)", "0000-00-00 ~ 0000-00-00"
  );
  const {val:workPart, setVal:setWorkPart} = useStorage(
    "workPart(SELECT)", "전체"
  );
  const {val:workTitle, setVal:setWorkTitle} = useStorage(
    "workTitle(SELECT)", "전체"
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [workType, setWorkType] = useState("list");
  const [workNumber, setWorkNumber] = useState(0);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    // 1. list
    const fetchWorkList = async () => {
      try {
        const response = await axios.get(`${URL_WORK}/list`, {
          params: {
            user_id : user_id,
            work_dur : workResDur,
          },
        });
        setWORK_LIST(response.data);
        log("WORK_LIST " + JSON.stringify(response.data));
      }
      catch (e) {
        setWORK_LIST([]);
        alert(`Error fetching work data: ${e.message}`);
      }
    };
    fetchWorkList();

    // 2. average
    const fetchWorkAvg = async () => {
      try {
        const response = await axios.get(`${URL_WORK}/workAvg`, {
          params: {
            user_id: user_id,
            work_dur: workResDur,
            work_part_val: workPart,
            work_title_val: workTitle,
          },
        });
        setWORK_AVERAGE(response.data);
        log("WORK_AVERAGE " + JSON.stringify(response.data));
      }
      catch (e) {
        setWORK_AVERAGE([]);
        alert(`Error fetching work data: ${e.message}`);
      }
    };
    fetchWorkAvg();
  }, [user_id, workResDur, workPart, workTitle]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const formatVal = (value) => {
      return value < 10 ? `0${value}` : `${value}`;
    };
    if (workStartDay && workEndDay) {
      const fromDate = new Date(workStartDay);
      const toDate = new Date(workEndDay);

      setWorkResVal (
        parseISO (
          `${fromDate.getFullYear()}-${formatVal(fromDate.getMonth() + 1)}-${formatVal(fromDate.getDate())} ~ ${toDate.getFullYear()}-${formatVal(toDate.getMonth() + 1)}-${formatVal(toDate.getDate())}`
        )
      );
      setWorkResDur (
        `${fromDate.getFullYear()}-${formatVal(fromDate.getMonth() + 1)}-${formatVal(fromDate.getDate())} ~ ${toDate.getFullYear()}-${formatVal(toDate.getMonth() + 1)}-${formatVal(toDate.getDate())}`
      );
    }
    else {
      setWorkResVal(undefined);
      setWorkResDur("0000-00-00 ~ 0000-00-00");
    }
  }, [workStartDay, workEndDay]);

  // 3-1. flow ------------------------------------------------------------------------------------>
  const flowDayClick = (day) => {
    if (day) {
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
  };

  // 4-1. view ----------------------------------------------------------------------------------->
  const viewWorkSelect = () => {
    return (
      <DayPicker
        mode="range"
        locale={ko}
        weekStartsOn={1}
        showOutsideDays
        selected={workStartDay && workEndDay && {
          from: workStartDay,
          to: workEndDay,
        }}
        month={workStartDay}
        onDayClick={flowDayClick}
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
    );
  };

  // 5-1. table ----------------------------------------------------------------------------------->
  const tableWorkList = () => {
    return (
      <div>
        <div className="row d-center">
          <div className="col-12">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Part</th>
                  <th>Title</th>
                  <th>Kg</th>
                  <th>Set</th>
                  <th>Count</th>
                  <th>Rest</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {WORK_LIST.map((workItem ) => {
                  return workItem.work_section.map((work_section) => (
                    <tr key={work_section._id}>
                      <td
                        className="pointer"
                        onClick={() => {
                          navParam("/work/detail", {
                            state: {
                              _id : workItem._id,
                              work_section_id : work_section._id
                            },
                          });
                        }}>
                        {work_section.work_part_val}
                      </td>
                      <td>{work_section.work_title_val}</td>
                      <td>{work_section.work_kg}</td>
                      <td>{work_section.work_set}</td>
                      <td>{work_section.work_count}</td>
                      <td>{work_section.work_rest}</td>
                      <td>{workItem.work_time}</td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // 5-2. table ----------------------------------------------------------------------------------->
  const tableWorkAvg = () => {
    return (
      <div>
        <div className="row d-center">
          <div className="col-6">
            <div className="input-group">
              <span className="input-group-text">파트</span>
              <select
                className="form-control"
                id={`work_part_val`}
                value={workPart}
                onChange={(e) => {
                  setWorkPart(e.target.value);
                  const index = workPartArray.findIndex(
                    (item) => item.work_part[0] === e.target.value
                  );
                  setWorkTitle("전체");
                  setWorkNumber(index);
                }}>
                {workPartArray.map((value, key) => (
                  <option key={key} value={value.work_part[0]}>
                    {value.work_part[0]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-6">
            <div className="input-group">
              <span className="input-group-text">종목</span>
              <select
                className="form-control"
                id={`work_title_val`}
                value={workTitle}
                onChange={(e) => {
                  setWorkTitle(e.target.value);
                }}>
                {workTitleArray[workNumber].work_title.map((value, key) => (
                  <option key={key} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-12">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Part</th>
                  <th>Title</th>
                  <th>Count</th>
                  <th>Kg Ave</th>
                  <th>Set Ave</th>
                  <th>Count Ave</th>
                  <th>Rest Ave</th>
                </tr>
              </thead>
              <tbody>
                {WORK_AVERAGE?.map((workItem , index) => (
                  <tr key={index}>
                    <td>{workItem.work_part_val}</td>
                    <td>{workItem.work_title_val}</td>
                    <td>{workItem.count}</td>
                    <td>{workItem.work_kg_avg}</td>
                    <td>{workItem.work_set_avg}</td>
                    <td>{workItem.work_count_avg}</td>
                    <td>{workItem.work_rest_avg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // 6-1. button ---------------------------------------------------------------------------------->
  const buttonWorkToday = () => {
    return (
      <button type="button" className="btn btn-sm btn-success me-2" onClick={() => {
        setWorkStartDay(koreanDate);
        setWorkEndDay(koreanDate);
        setWorkPart("전체");
        setWorkTitle("전체");
        localStorage.removeItem("workList(SELECT)");
        localStorage.removeItem("workAvg(SELECT)");
        localStorage.removeItem("workStartDay(SELECT)");
        localStorage.removeItem("workEndDay(SELECT)");
        localStorage.removeItem("workPart(SELECT)");
        localStorage.removeItem("workTitle(SELECT)");
      }}>
        Today
      </button>
    );
  };
  const buttonWorkReset = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => {
        setWorkStartDay(undefined);
        setWorkEndDay(undefined);
        setWorkPart("전체");
        setWorkTitle("전체");
        localStorage.removeItem("workList(SELECT)");
        localStorage.removeItem("workAvg(SELECT)");
        localStorage.removeItem("workStartDay(SELECT)");
        localStorage.removeItem("workEndDay(SELECT)");
        localStorage.removeItem("workPart(SELECT)");
        localStorage.removeItem("workTitle(SELECT)");
      }}>
        Reset
      </button>
    );
  };

  // 6-2. select  --------------------------------------------------------------------------------->
  const selectWorkList = () => {
    const currentPath = location.pathname || "";
    return (
      <div className="mb-3">
        <select className="form-select" id="workListSelect" value={currentPath} onChange={(e) => {
          navParam(e.target.value);
        }}>
          <option value="/workListDay">Day</option>
          <option value="/workListWeek">Week</option>
          <option value="/workListMonth">Month</option>
          <option value="/workListYear">Year</option>
          <option value="/workListSelect">Select</option>
        </select>
      </div>
    );
  };
  const selectWorkType = () => {
    return (
      <div className="mb-3">
        <select className="form-select" id="workType" onChange={(e) => {
          if (e.target.value === "list") {
            setWorkType("list");
          }
          else if (e.target.value === "avg") {
            setWorkType("avg");
          }
        }}>
          <option value="list">List</option>
          <option value="avg">Avg</option>
        </select>
      </div>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-7">{TITLE}</h1>
          <h2 className="mb-3 fw-7">선택별 조회</h2>
        </div>
      </div>
      <div className="row d-center mt-3">
        <div className="col-3">{selectWorkList()}</div>
        <div className="col-3">{selectWorkType()}</div>
      </div>
      <div className="row d-center mt-3">
        <div className="col-md-6 col-12 d-center">
          {viewWorkSelect()}
        </div>
        <div className="col-md-6 col-12">
          {workType === "list" && tableWorkList()}
          {workType === "avg" && tableWorkAvg()}
        </div>
      </div>
      <div className="row mb-20">
        <div className="col-12 d-center">
          {buttonWorkToday()}
          {buttonWorkReset()}
        </div>
        </div>
      </div>
    </div>
  );
};

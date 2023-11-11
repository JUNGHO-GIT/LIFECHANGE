// WorkListSelect.tsx
import React, { useState, useEffect } from "react";
import {useStorage} from "../../assets/ts/useStorage";
import {useNavigate, useLocation} from "react-router-dom";
import { DayPicker } from "react-day-picker";
import {parseISO} from "date-fns";
import { ko } from "date-fns/locale";
import moment from "moment-timezone";
import axios from "axios";
import { workPartArray, workTitleArray } from "../work/WorkArray";

// 1. main ---------------------------------------------------------------------------------------->
export const WorkListSelect = () => {

  // title
  const TITLE = "Work List Select";
  // url
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  // date
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");

  // 2-1. useState -------------------------------------------------------------------------------->
  const [workType, setWorkType] = useState<string>("list");
  const [number, setNumber] = useState<number>(0);

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:WORK_LIST, setVal:setWORK_LIST} = useStorage<any>(
    "workList(SELECT)", []
  );
  const {val:WORK_AVERAGE, setVal:setWORK_AVERAGE} = useStorage<any>(
    "workAvg(SELECT)", []
  );
  const {val:workPart, setVal:setWorkPart} = useStorage<string>("workPart(SELECT)", "전체");
  const {val:workTitle, setVal:setWorkTitle} = useStorage<string>("workTitle(SELECT)", "전체");
  const {val:resVal, setVal:setResVal} = useStorage<Date | undefined>(
    "resVal(SELECT)", undefined
  );
  const {val:resDur, setVal:setResDur} = useStorage<string>(
      "resDur(SELECT)",
      "0000-00-00 ~ 0000-00-00"
    );
  const {val:avgWorkNight, setVal:setAvgWorkNight} = useStorage<string>(
    "avgWorkStart(SELECT)", "00:00"
  );
  const {val:avgWorkMorning, setVal:setAvgWorkMorning} = useStorage<string>(
    "avgWorkEnd(SELECT)", "00:00"
  );
  const {val:workStartDay, setVal:setWorkStartDay} = useStorage<Date | undefined>(
    "workStartDay(SELECT)", undefined
  );
  const {val:workEndDay, setVal:setWorkEndDay} = useStorage<Date | undefined>(
    "workEndDay(SELECT)", undefined
  );

  // 2-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchWorkList = async () => {
      try {
        const response = await axios.get(`${URL_WORK}/workList`, {
          params: {
            user_id : user_id,
            work_dur : resDur,
          },
        });
        setWORK_LIST(response.data);
      }
      catch (error:any) {
        alert(`Error fetching work data: ${error.message}`);
        setWORK_LIST([]);
      }
    };
    fetchWorkList();
  }, [user_id, resDur]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchWorkAvg = async () => {
      try {
        const response = await axios.get(`${URL_WORK}/workAvg`, {
          params: {
            user_id: user_id,
            work_dur: resDur,
            work_part_val: workPart,
            work_title_val: workTitle,
          },
        });
        setWORK_AVERAGE(response.data);
        console.log("WORK_AVERAGE : " + response.data);
      }
      catch (error: any) {
        alert(`Error fetching work data: ${error.message}`);
        setWORK_AVERAGE([]);
      }
    };
    fetchWorkAvg();
  }, [user_id, resDur, workPart, workTitle]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const formatVal = (value: number): string => {
      return value < 10 ? `0${value}` : `${value}`;
    };
    if (workStartDay && workEndDay) {

      const fromDate = new Date(workStartDay);
      const toDate = new Date(workEndDay);

      setResVal (
        parseISO (
          `${fromDate.getFullYear()}-${formatVal(fromDate.getMonth() + 1)}-${formatVal(fromDate.getDate())} ~ ${toDate.getFullYear()}-${formatVal(toDate.getMonth() + 1)}-${formatVal(toDate.getDate())}`
        )
      );
      setResDur (
        `${fromDate.getFullYear()}-${formatVal(fromDate.getMonth() + 1)}-${formatVal(fromDate.getDate())} ~ ${toDate.getFullYear()}-${formatVal(toDate.getMonth() + 1)}-${formatVal(toDate.getDate())}`
      );
    }
    else {
      setResVal(undefined);
      setResDur("0000-00-00 ~ 0000-00-00");
    }
  }, [workStartDay, workEndDay]);

  // 3-1. flow ------------------------------------------------------------------------------------>
  const flowDayClick = (day:any) => {
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

  // 4-1. logic ----------------------------------------------------------------------------------->
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
        onMonthChange={(month) => setWorkStartDay(month)}
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
                {WORK_LIST.map((workItem : any) => {
                  return workItem.workSection.map((workSection: any) => (
                    <tr key={workSection._id}>
                      <td
                        className="pointer"
                        onClick={() => {
                          navParam("/workDetail", {
                            state: {
                              _id : workItem._id,
                              workSection_id : workSection._id
                            },
                          });
                        }}>
                        {workSection.work_part_val}
                      </td>
                      <td>{workSection.work_title_val}</td>
                      <td>{workSection.work_kg}</td>
                      <td>{workSection.work_set}</td>
                      <td>{workSection.work_count}</td>
                      <td>{workSection.work_rest}</td>
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
            <div className="input-group mb-3">
              <span className="input-group-text">파트</span>
              <select
                className="form-control"
                id={`work_part_val`}
                value={workPart}
                onChange={(e:any) => {
                  setWorkPart(e.target.value);
                  const index = workPartArray.findIndex(
                    (item) => item.workPart[0] === e.target.value
                  );
                  setWorkTitle("전체");
                  setNumber(index);
                }}>
                {workPartArray.map((value, key) => (
                  <option key={key} value={value.workPart[0]}>
                    {value.workPart[0]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-6">
            <div className="input-group mb-3">
              <span className="input-group-text">종목</span>
              <select
                className="form-control"
                id={`work_title_val`}
                value={workTitle}
                onChange={(e:any) => {
                  setWorkTitle(e.target.value);
                }}>
                {workTitleArray[number].workTitle.map((value, key) => (
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
                {WORK_AVERAGE?.map((workItem:any, index:number) => (
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
      <button className="btn btn-sm btn-success me-2" onClick={() => {
        setWorkStartDay(koreanDate);
        setWorkEndDay(koreanDate);
        localStorage.removeItem("workList(SELECT)");
        localStorage.removeItem("workStartDay(SELECT)");
        localStorage.removeItem("workEndDay(SELECT)");
      }}>
        Today
      </button>
    );
  };
  const buttonWorkReset = () => {
    return (
      <button className="btn btn-sm btn-primary me-2" onClick={() => {
        setWorkStartDay(undefined);
        setWorkEndDay(undefined);
        localStorage.removeItem("workList(SELECT)");
        localStorage.removeItem("workStartDay(SELECT)");
        localStorage.removeItem("workEndDay(SELECT)");
      }}>
        Reset
      </button>
    );
  };

  // 6-2. button ---------------------------------------------------------------------------------->
  const selectWorkList = () => {
    const currentPath = location.pathname || "";
    return (
      <div className="mb-3">
        <select className="form-select" id="workList" value={currentPath} onChange={(e:any) => {navParam(e.target.value);}}>
          <option value="/workList">Day</option>
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
        <select className="form-select" id="workType" onChange={(e:any) => {
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

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="container">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-8">{TITLE}</h1>
          <h2 className="mb-3 fw-8">선택별 조회</h2>
        </div>
      </div>
      <div className="row d-center mt-3">
        <div className="col-3">{selectWorkList()}</div>
        <div className="col-3">{selectWorkType()}</div>
      </div>
      <div className="row d-center mt-5">
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
  );
};
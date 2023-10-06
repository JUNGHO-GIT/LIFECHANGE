// WorkListWeek.tsx
import React, { useState, useEffect } from "react";
import {useStorage} from "../../assets/ts/useStorage";
import {useNavigate, useLocation} from "react-router-dom";
import { DayPicker } from "react-day-picker";
import { parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import moment from "moment-timezone";
import axios from "axios";
import { workPartArray, workTitleArray } from "../work/WorkArray";

// 1. main ---------------------------------------------------------------------------------------->
export const WorkListWeek = () => {

  // title
  const TITLE = "Work List Week";
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
  const [selectedWorkType, setSelectedWorkType] = useState<string>("list");
  const [selectedNumber, setSelectedNumber] = useState<number>(0);

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {value:WORK_LIST, setValue:setWORK_LIST} = useStorage<any> (
    "workList(WEEK)", []
  );
  const {value: WORK_AVERAGE, setValue: setWORK_AVERAGE} = useStorage<any>(
    "workAverage(WEEK)", []
  );
  const {value: selectedWorkPart, setValue: setSelectedWorkPart} = useStorage<string>(
    "selectedWorkPart(WEEK)", "전체"
  );
  const {value: selectedWorkTitle, setValue: setSelectedWorkTitle} = useStorage<string>(
    "selectedWorkTitle(WEEK)", "전체"
  );
  const {value:resultValue, setValue:setResultValue} = useStorage<Date | undefined> (
    "resultValue(WEEK)", undefined
  );
  const {value: resultDuration, setValue: setResultDuration} = useStorage<string>(
    "resultDuration(WEEK)", "0000-00-00 ~ 0000-00-00"
  );
  const {value:selectedWorkStartDay, setValue:setSelectedWorkStartDay} = useStorage<Date | undefined> (
    "selectedWorkStartDay(WEEK)", undefined
  );
  const {value:selectedWorkEndDay, setValue:setSelectedWorkEndDay} = useStorage<Date | undefined> (
    "selectedWorkEndDay(WEEK)", undefined
  );

  // 2-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchWorkList = async () => {
      try {
        const response = await axios.get(`${URL_WORK}/workList`, {
          params: {
            user_id : user_id,
            work_duration : resultDuration,
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
  }, [user_id, resultDuration]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchWorkAverage = async () => {
      try {
        const response = await axios.get(`${URL_WORK}/workAverage`, {
          params: {
            user_id: user_id,
            work_duration: resultDuration,
            work_part_val: selectedWorkPart,
            work_title_val: selectedWorkTitle,
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
    fetchWorkAverage();
  }, [user_id, resultDuration, selectedWorkPart, selectedWorkTitle]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const formatValue = (value: number): string => {
      return value < 10 ? `0${value}` : `${value}`;
    };

    if (selectedWorkStartDay && selectedWorkEndDay) {
      const fromDate = new Date(selectedWorkStartDay);
      const toDate = new Date(selectedWorkEndDay);

      setResultValue (
        parseISO (
          `${fromDate.getFullYear()}-${formatValue(fromDate.getMonth() + 1)}-${formatValue(fromDate.getDate())} ~ ${toDate.getFullYear()}-${formatValue(toDate.getMonth() + 1)}-${formatValue(toDate.getDate())}`
        )
      );
      setResultDuration (
        `${fromDate.getFullYear()}-${formatValue(fromDate.getMonth() + 1)}-${formatValue(fromDate.getDate())} ~ ${toDate.getFullYear()}-${formatValue(toDate.getMonth() + 1)}-${formatValue(toDate.getDate())}`
      );
    }
    else {
      setResultValue(undefined);
      setResultDuration("0000-00-00 ~ 0000-00-00");
    }
  }, [selectedWorkStartDay, selectedWorkEndDay]);

  // 3-1. flow ------------------------------------------------------------------------------------>
  const flowDayClick = (day:any) => {
    if (day) {
      const selectedDay = new Date(day);

      const startOfWeek = new Date(selectedDay);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);

      const endOfWeek = new Date(selectedDay);
      endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));

      setSelectedWorkStartDay(startOfWeek);
      setSelectedWorkEndDay(endOfWeek);
    }
  };

  // 4-1. logic ----------------------------------------------------------------------------------->
  const viewWorkDay = () => {
    return (
      <DayPicker
        mode="range"
        locale={ko}
        weekStartsOn={1}
        showOutsideDays
        selected={selectedWorkStartDay && selectedWorkEndDay && {
          from: selectedWorkStartDay,
          to: selectedWorkEndDay,
        }}
        month={selectedWorkStartDay}
        onDayClick={flowDayClick}
        onMonthChange={(month) => {
          setSelectedWorkStartDay(month);
          setSelectedWorkEndDay(month);
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
      <>
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
      </>
    );
  };

  // 5-2. table ----------------------------------------------------------------------------------->
  const tableWorkAverage = () => {
    return (
      <>
        <div className="row d-center">
          <div className="col-6">
            <div className="input-group mb-3">
              <span className="input-group-text">파트</span>
              <select
                className="form-control"
                id={`work_part_val`}
                value={selectedWorkPart}
                onChange={(e) => {
                  setSelectedWorkPart(e.target.value);
                  const index = workPartArray.findIndex(
                    (item) => item.workPart[0] === e.target.value
                  );
                  setSelectedWorkTitle("전체");
                  setSelectedNumber(index);
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
                value={selectedWorkTitle}
                onChange={(e) => {
                  setSelectedWorkTitle(e.target.value);
                }}>
                {workTitleArray[selectedNumber].workTitle.map((value, key) => (
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
                {WORK_AVERAGE?.map((workItem: any, index: number) => (
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
      </>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonWorkToday = () => {
    return (
      <button
        className="btn btn-success me-2"
        onClick={() => {
          setSelectedWorkStartDay(koreanDate);
          setSelectedWorkEndDay(koreanDate);
          setSelectedWorkPart("전체");
          setSelectedWorkTitle("전체");
          localStorage.removeItem("workList(WEEK)");
          localStorage.removeItem("workAverage(WEEK)");
          localStorage.removeItem("selectedWorkStartDay(WEEK)");
          localStorage.removeItem("selectedWorkEndDay(WEEK)");
          localStorage.removeItem("selectedWorkPart(WEEK)");
          localStorage.removeItem("selectedWorkTitle(WEEK)");
      }}>
        Today
      </button>
    );
  };
  const buttonWorkReset = () => {
    return (
      <button
        className="btn btn-primary me-2"
        onClick={() => {
          setSelectedWorkStartDay(undefined);
          setSelectedWorkEndDay(undefined);
          setSelectedWorkPart("전체");
          setSelectedWorkTitle("전체");
          localStorage.removeItem("workList(WEEK)");
          localStorage.removeItem("workAverage(WEEK)");
          localStorage.removeItem("selectedWorkStartDay(WEEK)");
          localStorage.removeItem("selectedWorkEndDay(WEEK)");
          localStorage.removeItem("selectedWorkPart(WEEK)");
          localStorage.removeItem("selectedWorkTitle(WEEK)");
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
        <select className="form-select" id="workList" value={currentPath} onChange={(e) => {
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
            setSelectedWorkType("list");
          }
          else if (e.target.value === "average") {
            setSelectedWorkType("average");
          }
        }}>
          <option value="list">List</option>
          <option value="average">Average</option>
        </select>
      </div>
    );
  };

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="container">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-9">{TITLE}</h1>
          <h2 className="mb-3 fw-9">주별로 조회</h2>
        </div>
      </div>
      <div className="row d-center mt-3">
        <div className="col-3">{selectWorkList()}</div>
        <div className="col-3">{selectWorkType()}</div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-md-6 col-12 d-center">
          {viewWorkDay()}
        </div>
        <div className="col-md-6 col-12">
          {selectedWorkType === "list" && tableWorkList()}
          {selectedWorkType === "average" && tableWorkAverage()}
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

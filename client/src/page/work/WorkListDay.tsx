// WorkListDay.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DayClickEventHandler, DayPicker } from "react-day-picker";
import { useStorage } from "../../assets/ts/useStorage";
import { ko } from "date-fns/locale";
import { parseISO } from "date-fns";
import moment from "moment-timezone";
import axios from "axios";
import { workPartArray, workTitleArray } from "../work/WorkArray";

// 1. main ---------------------------------------------------------------------------------------->
export const WorkListDay = () => {
  // title
  const TITLE = "Work List Day";
  // url
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  // date
  const koreanDate = new Date(
    moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString()
  );
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");

  // 2-1. useState -------------------------------------------------------------------------------->
  const [selectedWorkType, setSelectedWorkType] = useState<string>("list");
  const [selectedNumber, setSelectedNumber] = useState<number>(0);

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {value: WORK_LIST, setValue: setWORK_LIST} = useStorage<any> (
    "workList(DAY)", []
  );
  const {value: WORK_AVERAGE, setValue: setWORK_AVERAGE} = useStorage<any> (
    "workAverage(DAY)", []
  );
  const {value: selectedWorkDay, setValue: setSelectedWorkDay} = useStorage<Date | undefined> (
    "selectedWorkDay(DAY)", undefined
  );
  const {value: selectedWorkPart, setValue: setSelectedWorkPart} = useStorage<string>(
    "selectedWorkPart(DAY)", "전체"
  );
  const {value: selectedWorkTitle, setValue: setSelectedWorkTitle} = useStorage<string>(
    "selectedWorkTitle(DAY)", "전체"
  );
  const {value: resultValue, setValue: setResultValue} = useStorage<Date | undefined>(
    "resultValue(DAY)", undefined
  );
  const {value: resultDuration, setValue: setResultDuration} = useStorage<string>(
    "resultDuration(DAY)", "0000-00-00 ~ 0000-00-00"
  );
  const {value: averageWorkStart, setValue: setAverageWorkStart} = useStorage<string>(
    "averageWorkStart(DAY)", "00:00"
  );
  const {value: averageWorkEnd, setValue: setAverageWorkEnd} = useStorage<string>(
    "averageWorkEnd(DAY)", "00:00"
  );
  const {value: averageWorkTime, setValue: setAverageWorkTime} = useStorage<string>(
    "averageWorkTime(DAY)", "00:00"
  );

  // 2-2. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchWorkList = async () => {
      try {
        const response = await axios.get(`${URL_WORK}/workList`, {
          params: {
            user_id: user_id,
            work_duration: resultDuration,
          },
        });
        setWORK_LIST(response.data);
        console.log("WORK_LIST : ", response.data);
      }
      catch (error: any) {
        alert(`Error fetching work data: ${error.message}`);
        setWORK_LIST([]);
      }
    };
    fetchWorkList();
  }, [user_id, resultDuration]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
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

  // 2-4. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const formatValue = (value: number): string => {
      return value < 10 ? `0${value}` : `${value}`;
    };
    if (selectedWorkDay) {
      const year = selectedWorkDay.getFullYear();
      const month = formatValue(selectedWorkDay.getMonth() + 1);
      const date = formatValue(selectedWorkDay.getDate());
      setResultValue(parseISO(`${year}-${month}-${date}`));
      setResultDuration(`${year}-${month}-${date} ~ ${year}-${month}-${date}`);
    }
  }, [selectedWorkDay]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDayClick: DayClickEventHandler = (day: any) => {
    setSelectedWorkDay(day);
  };

  // 4-1. logic ----------------------------------------------------------------------------------->
  const viewWorkDay = () => {
    return (
      <DayPicker
        mode="single"
        showOutsideDays
        selected={selectedWorkDay}
        month={selectedWorkDay}
        locale={ko}
        weekStartsOn={1}
        onDayClick={flowDayClick}
        onMonthChange={(month) => setSelectedWorkDay(month)}
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
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
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
          {WORK_LIST.map((workList: any) => {
            return workList.workSection.map((workSection: any) => (
              <tr key={workSection._id}>
                <td>{workList.user_id}</td>
                <td>{workSection.work_part_val}</td>
                <td>{workSection.work_title_val}</td>
                <td>{workSection.work_kg}</td>
                <td>{workSection.work_set}</td>
                <td>{workSection.work_count}</td>
                <td>{workSection.work_rest}</td>
                <td>{workList.work_time}</td>
              </tr>
            ));
          })}
        </tbody>
      </table>
    );
  };

  // 5-2. table ----------------------------------------------------------------------------------->
  const tableWorkAverage = () => {
    return (
      <div>
        <div className="row d-center">
          <div className="col-4">
            <div className="input-group mb-3">
              <span className="input-group-text">운동파트</span>
              <select className="form-control" id={`work_part_val`}
                onChange={(e) => {
                  setSelectedWorkPart(e.target.value);
                  const index = workPartArray.findIndex (
                    (item) => item.workPart[0] === e.target.value
                  );
                  setSelectedWorkTitle("전체");
                  setSelectedNumber(index);
                }}>
                {workPartArray?.map((value, key) => (
                  <option key={key} value={value.workPart[0]}>
                    {value.workPart[0]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-4">
            <div className="input-group mb-3">
              <span className="input-group-text">운동종목</span>
              <select className="form-control" id={`work_title_val`}
                onChange={(e) => {
                  setSelectedWorkTitle(e.target.value);
                }}>
                {workTitleArray[selectedNumber]?.workTitle.map((value, key) => (
                  <option key={key} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-3">
            <button type="button" className="btn btn-primary" onClick={() => {fetchWorkAverage()}}>
              조회
            </button>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-12">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Part</th>
                  <th>Title</th>
                  <th>Kg Average</th>
                  <th>Set Average</th>
                  <th>Count Average</th>
                  <th>Rest Average</th>
                </tr>
              </thead>
              <tbody>
                {WORK_AVERAGE?.map((workItem, index) => (
                  <tr key={index}>
                    <td>{workItem.work_part_val}</td>
                    <td>{workItem.work_title_val}</td>
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
      <button className="btn btn-success me-2" onClick={() => {
        setSelectedWorkDay(koreanDate);
        localStorage.removeItem("workList(DAY)");
        localStorage.removeItem("selectedWorkDay(DAY)");
        localStorage.removeItem("selectedWorkPart(DAY)");
        localStorage.removeItem("selectedWorkTitle(DAY)");
      }}>
        Today
      </button>
    );
  };
  const buttonWorkReset = () => {
    return (
      <button className="btn btn-primary me-2" onClick={() => {
        setSelectedWorkDay(undefined);
        localStorage.removeItem("workList(DAY)");
        localStorage.removeItem("selectedWorkDay(DAY)");
        localStorage.removeItem("selectedWorkPart(DAY)");
        localStorage.removeItem("selectedWorkTitle(DAY)");
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
        <select
          className="form-select"
          id="workList"
          value={currentPath}
          onChange={(e) => {
            navParam(e.target.value);
          }}
        >
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
            if (e.target.value === "average") {
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
        <div className="col-12 d-center mt-5">
          <h1 className="mb-3 fw-9">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-3">{selectWorkList()}</div>
        <div className="col-3">{selectWorkType()}</div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12 d-center mt-5">
          <h2 className="mb-3 fw-9">일별로 조회</h2>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-6 d-center mt-5">{viewWorkDay()}</div>
        <div className="col-6 d-center mt-5">
          <form className="form-inline">
            {selectedWorkType === "list" && tableWorkList()}
            {selectedWorkType === "average" && tableWorkAverage()}
          </form>
        </div>
      </div>
      <div className="row d-center mb-20">
        <div className="col-12 d-center mt-5">
          {buttonWorkToday()}
          {buttonWorkReset()}
        </div>
      </div>
    </div>
  );
};

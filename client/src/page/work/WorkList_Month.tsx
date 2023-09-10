// WorkListMonth.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import { DayPicker, MonthChangeEventHandler } from "react-day-picker";
import { ko } from "date-fns/locale";
import moment from "moment-timezone";
import axios from "axios";
import { parseISO } from "date-fns";
import {useStorage} from "../../assets/ts/useStorage";

// 1. main ---------------------------------------------------------------------------------------->
export const WorkListMonth = () => {

  // title
  const TITLE = "Work List Month";
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
  const [selectedWorkType, setSelectedWorkType] = useState<string> ("list");

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {value:WORK_LIST, setValue:setWORK_LIST} = useStorage<any> (
    "workList_MONTH", []
  );
  const {value:resultValue, setValue:setResultValue} = useStorage<Date | undefined> (
    "resultValue_MONTH", undefined
  );
  const {value:resultDuration, setValue:setResultDuration} = useStorage<string> (
    "resultDuration_MONTH", "0000-00-00 ~ 0000-00-00"
  );
  const {value:averageWorkTime, setValue:setAverageWorkTime} = useStorage<string> (
    "averageWorkTime_MONTH", "00:00"
  );
  const {value:averageWorkNight, setValue:setAverageWorkNight} = useStorage<string> (
    "averageWorkNight_MONTH", "00:00"
  );
  const {value:averageWorkMorning, setValue:setAverageWorkMorning} = useStorage<string> (
    "averageWorkMorning_MONTH", "00:00"
  );
  const {value:selectedWorkMonth, setValue:setSelectedWorkMonth} = useStorage<Date | undefined> (
    "selectedWorkMonth_MONTH", koreanDate
  );

  // 2-1. useEffect ------------------------------------------------------------------------------->
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
      }
      catch (error: any) {
        alert(`Error fetching work data: ${error.message}`);
        setWORK_LIST([]);
      }
    };
    fetchWorkList();
  }, [user_id, resultDuration]);

  // 2-2. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchWorkAverage = async () => {
      try {
        const response = await axios.get(`${URL_WORK}/workAverage`, {
          params: {
            user_id: user_id,
            work_duration: resultDuration,
          },
        });

        const isValidTime = (str: string) => {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(str);
        };
        setAverageWorkTime (
          isValidTime(response.data.averageWorkTime)
          ? response.data.averageWorkTime
          : "00:00"
        );
        setAverageWorkNight (
          isValidTime(response.data.averageWorkNight)
          ? response.data.averageWorkNight
          : "00:00"
        );
        setAverageWorkMorning (
          isValidTime(response.data.averageWorkMorning)
          ? response.data.averageWorkMorning
          : "00:00"
        );
      }
      catch (error: any) {
        alert(`Error fetching work data: ${error.message}`);
        setAverageWorkTime("00:00");
        setAverageWorkNight("00:00");
        setAverageWorkMorning("00:00");
      }
    };
    fetchWorkAverage();
  }, [user_id, resultDuration]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const formatValue = (value: number): string => {
      return value < 10 ? `0${value}` : `${value}`;
    };
    if (selectedWorkMonth) {
      setResultValue (
        parseISO (
          `${selectedWorkMonth.getFullYear()}-${formatValue(selectedWorkMonth.getMonth() + 1)}`
        )
      );
      setResultDuration (
        `${selectedWorkMonth.getFullYear()}-${formatValue(selectedWorkMonth.getMonth() + 1)}-01 ~ ${selectedWorkMonth.getFullYear()}-${formatValue(selectedWorkMonth.getMonth() + 1)}-31`
      );
    }
    else {
      setResultValue (undefined);
    }
  }, [selectedWorkMonth]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowMonthChange: MonthChangeEventHandler = (day) => {
    const monthDate = new Date(day.getFullYear(), day.getMonth(), 1);
    setSelectedWorkMonth(monthDate);
  };

  // 4-1. logic ----------------------------------------------------------------------------------->
  const viewWorkDay = () => {
    return (
      <DayPicker
        mode="default"
        showOutsideDays
        locale={ko}
        weekStartsOn={1}
        month={selectedWorkMonth}
        onMonthChange={flowMonthChange}
        modifiersClassNames={{
          koreanDate: "koreanDate",
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
            <th>날짜</th>
            <th>기간</th>
            <th>취침</th>
            <th>기상</th>
            <th>수면</th>
          </tr>
        </thead>
        <tbody>
          {WORK_LIST.map((index: any) => (
            <tr key={index._id}>
              <td className="pointer" onClick={() => {
                navParam("/workDetail", {
                  state: {_id: index._id}
                }
              )}}>
                {index.work_day}
              </td>
              <td>{resultDuration}</td>
              <td>{index.work_start}</td>
              <td>{index.work_end}</td>
              <td>{index.work_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 5-2. table ----------------------------------------------------------------------------------->
  const tableWorkAverage = () => {
    return (
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>취침 평균</th>
            <th>기상 평균</th>
            <th>수면 평균</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{averageWorkNight}</td>
            <td>{averageWorkMorning}</td>
            <td>{averageWorkTime}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonWorkToday = () => {
    return (
      <button className="btn btn-success me-2" onClick={() => {
        setSelectedWorkMonth(koreanDate);
        localStorage.removeItem("workList_MONTH");
        localStorage.removeItem("selectedWorkMonth_MONTH");
      }}>
        Today
      </button>
    );
  };
  const buttonWorkReset = () => {
    return (
      <button className="btn btn-primary me-2" onClick={() => {
        setSelectedWorkMonth(undefined);
        localStorage.removeItem("workList_MONTH");
        localStorage.removeItem("selectedWorkMonth_MONTH");
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
        <select className="form-select" id="workList" value={currentPath} onChange={(e) => {navParam(e.target.value);}}>
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
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-6">
          {selectWorkList()}
        </div>
        <div className="col-6">
          {selectWorkType()}
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-4">
          <h2 className="mb-3 fw-9">월별로 조회</h2>
          {viewWorkDay()}
        </div>
        <div className="col-8">
          {selectedWorkType === "list" && tableWorkList()}
          {selectedWorkType === "average" && tableWorkAverage()}
        </div>
      </div>
      <div className="row d-center mb-20">
        <div className="col-6">
          {buttonWorkToday()}
          {buttonWorkReset()}
        </div>
      </div>
    </div>
  );
};

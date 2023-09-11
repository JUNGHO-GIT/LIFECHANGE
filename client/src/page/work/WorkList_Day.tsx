/* // WorkListDay.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import { DayClickEventHandler, DayPicker } from "react-day-picker";
import {useStorage} from "../../assets/ts/useStorage";
import {WorkSelect} from "./WorkSelect";
import { ko } from "date-fns/locale";
import { parseISO } from "date-fns";
import moment from "moment-timezone";
import axios from "axios";

// 1. main ---------------------------------------------------------------------------------------->
export const WorkListDay = () => {

  // title
  const TITLE = "Work List Day";
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
  const [selectedWorkPart, setSelectedWorkPart] = useState<string> ("전체");
  const [selectedWorkTitle, setSelectedWorkTitle] = useState<string> ("전체");

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {value:WORK_LIST, setValue:setWORK_LIST} = useStorage<any> (
    "workList_DAY", []
  );
  const {value:resultValue, setValue:setResultValue} = useStorage<Date | undefined> (
    "resultValue_DAY", undefined
  );
  const {value:resultDuration, setValue:setResultDuration} = useStorage<string> (
    "resultDuration_DAY", "0000-00-00 ~ 0000-00-00"
  );
  const {value:averageWorkStart, setValue:setAverageWorkStart} = useStorage<string> (
    "averageWorkStart_DAY", "00:00"
  );
  const {value:averageWorkEnd, setValue:setAverageWorkEnd} = useStorage<string> (
    "averageWorkEnd_DAY", "00:00"
  );
  const {value:averageWorkTime, setValue:setAverageWorkTime} = useStorage<string> (
    "averageWorkTime_DAY", "00:00"
  );
  const {value:selectedWorkDay, setValue:setSelectedWorkDay} = useStorage<Date | undefined> (
    "selectedWorkDay_DAY", undefined
  );

  // 2-2. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchWorkList = async () => {
      try {
        const response = await axios.get (`${URL_WORK}/workList`, {
          params: {
            user_id : user_id,
            work_duration : resultDuration,
            work_part : selectedWorkPart,
            work_title : selectedWorkTitle,
          }
        });
        setWORK_LIST(response.data);
      }
      catch (error: any) {
        alert(`Error fetching work data: ${error.message}`);
        setWORK_LIST([]);
      }
    };
    const fetchWorkAverage = async () => {
      try {
        const response = await axios.get (`${URL_WORK}/workAverage`, {
          params: {
            user_id : user_id,
            work_duration : resultDuration,
            work_part : selectedWorkPart,
            work_title : selectedWorkTitle,
          },
        });
        const isValidTime = (str: string) => {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(str);
        };
        setAverageWorkStart (
          isValidTime(response.data.averageWorkStart)
          ? response.data.averageWorkStart
          : "00:00"
        );
        setAverageWorkEnd (
          isValidTime(response.data.averageWorkEnd)
          ? response.data.averageWorkEnd
          : "00:00"
        );
        setAverageWorkTime (
          isValidTime(response.data.averageWorkTime)
          ? response.data.averageWorkTime
          : "00:00"
        );
      }
      catch (error: any) {
        alert(`Error fetching work data: ${error.message}`);
        setAverageWorkStart("00:00");
        setAverageWorkEnd("00:00");
        setAverageWorkTime("00:00");
      }
    };
    fetchWorkList();
    fetchWorkAverage();
  }, [user_id, resultDuration, selectedWorkPart, selectedWorkTitle]);

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
  const flowDayClick: DayClickEventHandler = (day:any) => {
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
          selected : "selected",
          disabled : "disabled",
          outside : "outside",
          inside : "inside",
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
          {WORK_LIST.map((index: any) => (
            <tr key={index._id}>
              <td className="pointer" onClick={() => {
                navParam("/workDetail", {
                  state: {_id: index._id}
                }
              )}}>
                {index.user_id}
              </td>
              <td>{index.work_part}</td>
              <td>{index.work_title}</td>
              <td>{index.work_kg}</td>
              <td>{index.work_set}</td>
              <td>{index.work_count}</td>
              <td>{index.work_rest}</td>
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
            <th>타이틀</th>
            <th>파트</th>
            <th>횟수</th>
            <th>무게</th>
            <th>휴식</th>
            <th>시간</th>
          </tr>
        </thead>
        <tbody>
          {WORK_LIST.map((index: any) => (
            <tr key={index._id}>
              <td>{index.work_title}</td>
              <td>{index.work_part}</td>
              <td>{index.work_count}</td>
              <td>{index.work_kg}</td>
              <td>{index.work_rest}</td>
              <td>{index.work_time}</td>
            </tr>
          ))}
          <tr>
            <td>합계</td>
            <td></td>
            <td></td>
            <td></td>
            <td>{averageWorkTime}</td>
            <td></td>
          </tr>
          <tr>
            <td>평균</td>
            <td></td>
            <td></td>
            <td></td>
            <td>{averageWorkTime}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    );
  };

  // 6-1. button ---------------------------------------------------------------------------------->
  const buttonWorkToday = () => {
    return (
      <button className="btn btn-success me-2" onClick={() => {
        setSelectedWorkDay(koreanDate);
        localStorage.removeItem("workList_DAY");
        localStorage.removeItem("selectedWorkDay_DAY");
      }}>
        Today
      </button>
    );
  };
  const buttonWorkReset = () => {
    return (
      <button className="btn btn-primary me-2" onClick={() => {
        setSelectedWorkDay(undefined);
        localStorage.removeItem("workList_DAY");
        localStorage.removeItem("selectedWorkDay_DAY");
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
  const selectWork = () => {
    return (
      <WorkSelect
        work_part={selectedWorkPart}
        work_title={selectedWorkTitle}
        setWorkPart={setSelectedWorkPart}
        setWorkTitle={setSelectedWorkTitle}
      />
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
        <div className="col-3">
          {selectWorkList()}
        </div>
        <div className="col-3">
          {selectWorkType()}
        </div>
        <div className="col-3">
          {selectWork()}
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-4">
          <h2 className="mb-3 fw-9">일별로 조회</h2>
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
 */
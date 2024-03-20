// SleepListDay.tsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {DayPicker, DayClickEventHandler} from "react-day-picker";
import {ko} from "date-fns/locale";
import {parseISO} from "date-fns";
import moment from "moment-timezone";
import axios from "axios";
import {useStorage} from "../../assets/ts/useStorage";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";

// ------------------------------------------------------------------------------------------------>
export const SleepListDay = () => {

  // 1-1. title
  const TITLE = "Sleep List Day";
  // 1-2. url
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  // 1-3. date
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  // 1-4. hook
  const navParam = useNavigate();
  const location = useLocation();
  // 1-5. val
  const user_id = window.sessionStorage.getItem("user_id");
  // 1-6. log
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:SLEEP_LIST, setVal:setSLEEP_LIST} = useStorage<any>(
    "sleepList(DAY)", []
  );
  const {val:SLEEP_AVERAGE, setVal:setSLEEP_AVERAGE} = useStorage<any>(
    "sleepAvg(DAY)", []
  );
  const {val:sleepDay, setVal:setSleepDay} = useStorage<Date | undefined>(
    "sleepDay(DAY)", koreanDate
  );
  const {val:sleepResVal, setVal:setSleepResVal} = useStorage<Date | undefined>(
    "sleepResVal(DAY)", undefined
  );
  const {val:sleepResDur, setVal:setSleepResDur} = useStorage<string>(
    "sleepResDur(DAY)", "0000-00-00 ~ 0000-00-00"
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [sleepType, setSleepType] = useState<string>("list");

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    // 1. list
    const fetchSleepList = async () => {
      try {
        const response = await axios.get (`${URL_SLEEP}/sleepList`, {
          params: {
            user_id : user_id,
            sleep_dur : sleepResDur,
          },
        });
        setSLEEP_LIST(response.data);
        log("SLEEP_LIST : " + JSON.stringify(response.data));
      }
      catch (error:any) {
        setSLEEP_LIST([]);
        alert(`Error fetching sleep data: ${error.message}`);
      }
    };
    fetchSleepList();

    // 2. average
    const fetchSleepAvg = async () => {
      try {
        const response = await axios.get (`${URL_SLEEP}/sleepAvg`, {
          params: {
            user_id : user_id,
            sleep_dur : sleepResDur,
          },
        });
        setSLEEP_AVERAGE(response.data);
        log("SLEEP_AVERAGE : " + JSON.stringify(response.data));
      }
      catch (error:any) {
        setSLEEP_AVERAGE([]);
        alert(`Error fetching sleep data: ${error.message}`);
      }
    };
    fetchSleepAvg();
  }, [user_id, sleepResDur]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const formatVal = (value:number):string => {
      return value < 10 ? `0${value}` : `${value}`;
    };
    if (sleepDay) {
      const year = sleepDay.getFullYear();
      const month = formatVal(sleepDay.getMonth() + 1);
      const date = formatVal(sleepDay.getDate());
      setSleepResVal(parseISO(`${year}-${month}-${date}`));
      setSleepResDur(`${year}-${month}-${date} ~ ${year}-${month}-${date}`);
    }
  }, [sleepDay]);

  // 4-1. logic ----------------------------------------------------------------------------------->
  const viewSleepDay = () => {
    const flowDayClick: DayClickEventHandler = (day:any) => {
      setSleepDay(day);
    };
    return (
      <DayPicker
        mode="single"
        showOutsideDays
        selected={sleepDay}
        month={sleepDay}
        locale={ko}
        weekStartsOn={1}
        onDayClick={flowDayClick}
        onMonthChange={(month) => {
          setSleepDay(month);
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
  const tableSleepList = () => {
    return (
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>기간</th>
            <th>취침 시간</th>
            <th>기상 시간</th>
            <th>수면 시간</th>
          </tr>
        </thead>
        <tbody>
          {SLEEP_LIST.map((index:any) => (
            <tr key={index._id}>
              <td className="pointer" onClick={() => {
                navParam("/sleepDetail", {
                  state: {_id: index._id}
                }
              )}}>
                {sleepResDur}
              </td>
              <td>{index.sleep_night}</td>
              <td>{index.sleep_morning}</td>
              <td>{index.sleep_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 5-2. table ----------------------------------------------------------------------------------->
  const tableSleepAvg = () => {
    return (
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>기간</th>
            <th>취침 평균</th>
            <th>기상 평균</th>
            <th>수면 평균</th>
          </tr>
        </thead>
        <tbody>
          {SLEEP_AVERAGE.map((index:any) => (
            <tr key={index._id}>
              <td>{sleepResDur}</td>
              <td>{index.avgSleepNight}</td>
              <td>{index.avgSleepMorning}</td>
              <td>{index.avgSleepTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 6-1. button ---------------------------------------------------------------------------------->
  const buttonSleepToday = () => {
    return (
      <button type="button" className="btn btn-sm btn-success me-2" onClick={() => {
        setSleepDay(koreanDate);
        localStorage.removeItem("sleepList(DAY)");
        localStorage.removeItem("sleepAvg(DAY)");
        localStorage.removeItem("sleepDay(DAY)");
      }}>
        Today
      </button>
    );
  };
  const buttonSleepReset = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => {
        setSleepDay(undefined);
        localStorage.removeItem("sleepList(DAY)");
        localStorage.removeItem("sleepAvg(DAY)");
        localStorage.removeItem("sleepDay(DAY)");
      }}>
        Reset
      </button>
    );
  };

  // 6-2. button ---------------------------------------------------------------------------------->
  const selectSleepList = () => {
    const currentPath = location.pathname || "";
    return (
      <div className="mb-3">
        <select className="form-select" id="sleepListDay" value={currentPath}
        onChange={(e:any) => {
          navParam(e.target.value);
        }}>
          <option value="/sleepListDay">Day</option>
          <option value="/sleepListWeek">Week</option>
          <option value="/sleepListMonth">Month</option>
          <option value="/sleepListYear">Year</option>
          <option value="/sleepListSelect">Select</option>
        </select>
      </div>
    );
  };
  const selectSleepType = () => {
    return (
      <div className="mb-3">
        <select className="form-select" id="sleepType" onChange={(e:any) => {
          if (e.target.value === "list") {
            setSleepType("list");
          }
          else if (e.target.value === "avg") {
            setSleepType("avg");
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
          <h1 className="mb-3 fw-7">{TITLE}</h1>
          <h2 className="mb-3 fw-7">일별로 조회</h2>
        </div>
      </div>
      <div className="row d-center mt-3">
        <div className="col-3">
          {selectSleepList()}
        </div>
        <div className="col-3">
          {selectSleepType()}
        </div>
      </div>
      <div className="row d-center mt-3">
        <div className="col-md-6 col-12 d-center">
          {viewSleepDay()}
        </div>
        <div className="col-md-6 col-12">
          {sleepType === "list" && tableSleepList()}
          {sleepType === "avg" && tableSleepAvg()}
        </div>
      </div>
      <div className="row mb-20">
        <div className="col-12 d-center">
          {buttonSleepToday()}
          {buttonSleepReset()}
        </div>
      </div>
    </div>
  );
};

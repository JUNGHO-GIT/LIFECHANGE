// SleepListSelect.tsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {DayPicker} from "react-day-picker";
import {ko} from "date-fns/locale";
import {parseISO} from "date-fns";
import moment from "moment-timezone";
import axios from "axios";
import {useStorage} from "../../assets/ts/useStorage";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";

// ------------------------------------------------------------------------------------------------>
export const SleepListSelect = () => {

  // 1. components -------------------------------------------------------------------------------->
  const TITLE = "Sleep List Select";
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  const navParam = useNavigate();
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:SLEEP_LIST, setVal:setSLEEP_LIST} = useStorage<any>(
    "sleepList(SELECT)", []
  );
  const {val:SLEEP_AVERAGE, setVal:setSLEEP_AVERAGE} = useStorage<any>(
    "sleepAvg(SELECT)", []
  );
  const {val:sleepStartDay, setVal:setSleepStartDay} = useStorage<Date | undefined>(
    "sleepStartDay(SELECT)", undefined
  );
  const {val:sleepEndDay, setVal:setSleepEndDay} = useStorage<Date | undefined>(
    "sleepEndDay(SELECT)", undefined
  );
  const {val:sleepResVal, setVal:setSleepResVal} = useStorage<Date | undefined>(
    "sleepResVal(SELECT)", undefined
  );
  const {val:sleepResDur, setVal:setSleepResDur} = useStorage<string>(
    "sleepResDur(SELECT)", "0000-00-00 ~ 0000-00-00"
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
    if (sleepStartDay && sleepEndDay) {
      const fromDate = new Date(sleepStartDay);
      const toDate = new Date(sleepEndDay);

      setSleepResVal (
        parseISO (
          `${fromDate.getFullYear()}-${formatVal(fromDate.getMonth() + 1)}-${formatVal(fromDate.getDate())} ~ ${toDate.getFullYear()}-${formatVal(toDate.getMonth() + 1)}-${formatVal(toDate.getDate())}`
        )
      );
      setSleepResDur (
        `${fromDate.getFullYear()}-${formatVal(fromDate.getMonth() + 1)}-${formatVal(fromDate.getDate())} ~ ${toDate.getFullYear()}-${formatVal(toDate.getMonth() + 1)}-${formatVal(toDate.getDate())}`
      );
    }
    else {
      setSleepResVal(undefined);
      setSleepResDur("0000-00-00 ~ 0000-00-00");
    }
  }, [sleepStartDay, sleepEndDay]);

  // 3-1. flow ------------------------------------------------------------------------------------>
  const flowDayClick = (day:any) => {
    if (day) {
      const selectedDay = new Date(day);

      if (sleepStartDay && sleepEndDay) {
        if (selectedDay < sleepStartDay) {
          setSleepStartDay(selectedDay);
        }
        else if (selectedDay > sleepEndDay) {
          setSleepEndDay(selectedDay);
        }
        else {
          setSleepStartDay(selectedDay);
          setSleepEndDay(undefined);
        }
      }
      else if (sleepStartDay) {
        if (selectedDay < sleepStartDay) {
          setSleepEndDay(sleepStartDay);
          setSleepStartDay(selectedDay);
        }
        else if (selectedDay > sleepStartDay) {
          setSleepEndDay(selectedDay);
        }
        else {
          setSleepStartDay(undefined);
          setSleepEndDay(undefined);
        }
      }
      else {
        setSleepStartDay(selectedDay);
      }
    }
  };

  // 4-1. logic ----------------------------------------------------------------------------------->
  const viewSleepSelect = () => {
    return (
      <DayPicker
        mode="range"
        locale={ko}
        weekStartsOn={1}
        showOutsideDays
        selected={sleepStartDay && sleepEndDay && {
          from: sleepStartDay,
          to: sleepEndDay,
        }}
        month={sleepStartDay}
        onDayClick={flowDayClick}
        onMonthChange={(month) => {
          setSleepStartDay(month);
          setSleepEndDay(undefined);
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
        setSleepStartDay(koreanDate);
        setSleepEndDay(koreanDate);
        localStorage.removeItem("sleepList(SELECT)");
        localStorage.removeItem("sleepAvg(SELECT)");
        localStorage.removeItem("sleepStartDay(SELECT)");
        localStorage.removeItem("sleepEndDay(SELECT)");
      }}>
        Today
      </button>
    );
  };
  const buttonSleepReset = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => {
        setSleepStartDay(undefined);
        setSleepEndDay(undefined);
        localStorage.removeItem("sleepList(SELECT)");
        localStorage.removeItem("sleepAvg(SELECT)");
        localStorage.removeItem("sleepStartDay(SELECT)");
        localStorage.removeItem("sleepEndDay(SELECT)");
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
        <select className="form-select" id="sleepListSelect" value={currentPath}
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
    <div className="root-wrapper">
      <div className="container-wrapper">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-7">{TITLE}</h1>
          <h2 className="mb-3 fw-7">선택별 조회</h2>
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
          {viewSleepSelect()}
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
    </div>
  );
};

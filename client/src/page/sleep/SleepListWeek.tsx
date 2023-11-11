// SleepListWeek.tsx
import React, { useState, useEffect } from "react";
import {useStorage} from "../../assets/ts/useStorage";
import {useNavigate, useLocation} from "react-router-dom";
import { DayPicker } from "react-day-picker";
import {parseISO} from "date-fns";
import { ko } from "date-fns/locale";
import moment from "moment-timezone";
import axios from "axios";

// 1. main ---------------------------------------------------------------------------------------->
export const SleepListWeek = () => {

  // title
  const TITLE = "Sleep List Week";
  // url
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  // date
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");

  // 2-1. useState -------------------------------------------------------------------------------->
  const [sleepType, setSleepType] = useState<string> ("list");

  // 2-2. useStorage ------------------------------------------------------------------------------>
  const {val:SLEEP_LIST, setVal:setSLEEP_LIST} = useStorage<any>(
    "sleepListWeek", []
  );
  const {val:resVal, setVal:setResVal} = useStorage<Date | undefined>(
    "resValWeek", undefined
  );
  const {val:resDur, setVal:setResDur} = useStorage<string>(
    "resDurWeek", "0000-00-00 ~ 0000-00-00"
  );
  const {val:avgSleepTime, setVal:setAvgSleepTime} = useStorage<string>(
    "avgSleepTimeWeek", "00:00"
  );
  const {val:avgSleepNight, setVal:setAvgSleepNight} = useStorage<string>(
    "avgSleepNightWeek", "00:00"
  );
  const {val:avgSleepMorning, setVal:setAvgSleepMorning} = useStorage<string>(
    "avgSleepMorningWeek", "00:00"
  );
  const {val:sleepStartDay, setVal:setSleepStartDay} = useStorage<Date | undefined>(
    "sleepStartDayWeek", undefined
  );
  const {val:sleepEndDay, setVal:setSleepEndDay} = useStorage<Date | undefined>(
    "sleepEndDayWeek", undefined
  );

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchSleepList = async () => {
      try {
        const response = await axios.get(`${URL_SLEEP}/sleepList`, {
          params: {
            user_id : user_id,
            sleep_dur : resDur,
          },
        });
        setSLEEP_LIST(response.data);
      }
      catch (error:any) {
        alert(`Error fetching sleep data: ${error.message}`);
        setSLEEP_LIST([]);
      }
    };
    fetchSleepList();
  }, [user_id, resDur]);

  // 2-4. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchSleepAvg = async () => {
      try {
        const response = await axios.get(`${URL_SLEEP}/sleepAvg`, {
          params: {
            user_id : user_id,
            sleep_dur : resDur,
          },
        });

        const isValidTime = (str: string) => {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(str);
        };
        setAvgSleepTime (
          isValidTime(response.data.avgSleepTime)
          ? response.data.avgSleepTime
          : "00:00"
        );
        setAvgSleepNight (
          isValidTime(response.data.avgSleepNight)
          ? response.data.avgSleepNight
          : "00:00"
        );
        setAvgSleepMorning (
          isValidTime(response.data.avgSleepMorning)
          ? response.data.avgSleepMorning
          : "00:00"
        );
      }
      catch (error:any) {
        alert(`Error fetching sleep data: ${error.message}`);
        setAvgSleepTime("00:00");
        setAvgSleepNight("00:00");
        setAvgSleepMorning("00:00");
      }
    };
    fetchSleepAvg();
  }, [user_id, resDur]);

  // 2-5. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const formatVal = (value: number): string => {
      return value < 10 ? `0${value}` : `${value}`;
    };

    if (sleepStartDay && sleepEndDay) {
      const fromDate = new Date(sleepStartDay);
      const toDate = new Date(sleepEndDay);

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
  }, [sleepStartDay, sleepEndDay]);

  // 3-1. flow ------------------------------------------------------------------------------------>
  const flowDayClick = (day:any) => {
    if (day) {
      const selectedDay = new Date(day);

      const startOfWeek = new Date(selectedDay);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);

      const endOfWeek = new Date(selectedDay);
      endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));

      setSleepStartDay(startOfWeek);
      setSleepEndDay(endOfWeek);
    }
  };

  // 4-1. logic ----------------------------------------------------------------------------------->
  const viewSleepWeek = () => {
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
          setSleepEndDay(month);
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
            <th>날짜</th>
            <th>기간</th>
            <th>취침</th>
            <th>기상</th>
            <th>수면</th>
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
                {index.sleepDay}
              </td>
              <td>{resDur}</td>
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
            <th>취침 평균</th>
            <th>기상 평균</th>
            <th>수면 평균</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{avgSleepNight}</td>
            <td>{avgSleepMorning}</td>
            <td>{avgSleepTime}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonSleepToday = () => {
    return (
      <button className="btn btn-sm btn-success me-2" onClick={() => {
        setSleepStartDay(koreanDate);
        setSleepEndDay(koreanDate);
        localStorage.removeItem("sleepList");
        localStorage.removeItem("sleepStartDay");
        localStorage.removeItem("sleepEndDay");
      }}>
        Today
      </button>
    );
  };
  const buttonSleepReset = () => {
    return (
      <button className="btn btn-sm btn-primary me-2" onClick={() => {
        setSleepStartDay(undefined);
        setSleepEndDay(undefined);
        localStorage.removeItem("sleepList");
        localStorage.removeItem("sleepStartDay");
        localStorage.removeItem("sleepEndDay");
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
        <select className="form-select" id="sleepList" value={currentPath} onChange={(e:any) => {
          navParam(e.target.value);
        }}>
          <option value="/sleepList">Day</option>
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
        <div className="col-3">{selectSleepList()}</div>
        <div className="col-3">{selectSleepType()}</div>
      </div>
      <div className="row d-center mt-3">
        <div className="col-md-6 col-12 d-center">
          {viewSleepWeek()}
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

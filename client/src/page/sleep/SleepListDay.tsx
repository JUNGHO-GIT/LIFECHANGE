// SleepListDay.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import { DayClickEventHandler, DayPicker } from "react-day-picker";
import {useStorage} from "../../assets/ts/useStorage";
import { ko } from "date-fns/locale";
import { parseISO } from "date-fns";
import moment from "moment-timezone";
import axios from "axios";

// 1. main ---------------------------------------------------------------------------------------->
export const SleepListDay = () => {

  // title
  const TITLE = "Sleep List Day";
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
  const [selectedSleepType, setSelectedSleepType] = useState<string> ("list");

  // 2-2. useStorage ------------------------------------------------------------------------------>
  const {value:SLEEP_LIST, setValue:setSLEEP_LIST} = useStorage<any> (
    "sleepList_DAY", []
  );
  const {value:resultValue, setValue:setResultValue} = useStorage<Date | undefined> (
    "resultValue_DAY", undefined
  );
  const {value:resultDuration, setValue:setResultDuration} = useStorage<string> (
    "resultDuration_DAY", "0000-00-00 ~ 0000-00-00"
  );
  const {value:averageSleepTime, setValue:setAverageSleepTime} = useStorage<string> (
    "averageSleepTime_DAY", "00:00"
  );
  const {value:averageSleepNight, setValue:setAverageSleepNight} = useStorage<string> (
    "averageSleepNight_DAY", "00:00"
  );
  const {value:averageSleepMorning, setValue:setAverageSleepMorning} = useStorage<string> (
    "averageSleepMorning_DAY", "00:00"
  );
  const {value:selectedSleepDay, setValue:setSelectedSleepDay} = useStorage<Date | undefined> (
    "selectedSleepDay_DAY", undefined
  );

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchSleepList = async () => {
      try {
        const response = await axios.get (`${URL_SLEEP}/sleepList`, {
          params: {
            user_id : user_id,
            sleep_duration : resultDuration,
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
  }, [user_id, resultDuration]);

  // 2-4. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchSleepAverage = async () => {
      try {
        const response = await axios.get (`${URL_SLEEP}/sleepAverage`, {
          params: {
            user_id : user_id,
            sleep_duration : resultDuration,
          },
        });

        const isValidTime = (str: string) => {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(str);
        };
        setAverageSleepTime (
          isValidTime(response.data.averageSleepTime)
          ? response.data.averageSleepTime
          : "00:00"
        );
        setAverageSleepNight (
          isValidTime(response.data.averageSleepNight)
          ? response.data.averageSleepNight
          : "00:00"
        );
        setAverageSleepMorning (
          isValidTime(response.data.averageSleepMorning)
          ? response.data.averageSleepMorning
          : "00:00"
        );
      }
      catch (error:any) {
        alert(`Error fetching sleep data: ${error.message}`);
        setAverageSleepTime("00:00");
        setAverageSleepNight("00:00");
        setAverageSleepMorning("00:00");
      }
    };
    fetchSleepAverage();
  }, [user_id, resultDuration]);

  // 2-5. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const formatValue = (value: number): string => {
      return value < 10 ? `0${value}` : `${value}`;
    };
    if (selectedSleepDay) {
      const year = selectedSleepDay.getFullYear();
      const month = formatValue(selectedSleepDay.getMonth() + 1);
      const date = formatValue(selectedSleepDay.getDate());
      setResultValue(parseISO(`${year}-${month}-${date}`));
      setResultDuration(`${year}-${month}-${date} ~ ${year}-${month}-${date}`);
    }
  }, [selectedSleepDay]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDayClick: DayClickEventHandler = (day:any) => {
    setSelectedSleepDay(day);
  };

  // 4-1. logic ----------------------------------------------------------------------------------->
  const viewSleepDay = () => {
    return (
      <DayPicker
        mode="single"
        showOutsideDays
        selected={selectedSleepDay}
        month={selectedSleepDay}
        locale={ko}
        weekStartsOn={1}
        onDayClick={flowDayClick}
        onMonthChange={(month) => setSelectedSleepDay(month)}
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
                {index.sleep_day}
              </td>
              <td>{resultDuration}</td>
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
  const tableSleepAverage = () => {
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
            <td>{averageSleepNight}</td>
            <td>{averageSleepMorning}</td>
            <td>{averageSleepTime}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonSleepToday = () => {
    return (
      <button className="btn btn-success me-2" onClick={() => {
        setSelectedSleepDay(koreanDate);
        localStorage.removeItem("sleepList_DAY");
        localStorage.removeItem("selectedSleepDay_DAY");
      }}>
        Today
      </button>
    );
  };
  const buttonSleepReset = () => {
    return (
      <button className="btn btn-primary me-2" onClick={() => {
        setSelectedSleepDay(undefined);
        localStorage.removeItem("sleepList_DAY");
        localStorage.removeItem("selectedSleepDay_DAY");
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
        <select className="form-select" id="sleepList" value={currentPath} onChange={(e) => {navParam(e.target.value);}}>
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
        <select className="form-select" id="sleepType" onChange={(e) => {
          if (e.target.value === "list") {
            setSelectedSleepType("list");
          }
          else if (e.target.value === "average") {
            setSelectedSleepType("average");
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
          {selectSleepList()}
        </div>
        <div className="col-6">
          {selectSleepType()}
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-4">
          <h2 className="mb-3 fw-9">일별로 조회</h2>
          {viewSleepDay()}
        </div>
        <div className="col-8">
          {selectedSleepType === "list" && tableSleepList()}
          {selectedSleepType === "average" && tableSleepAverage()}
        </div>
      </div>
      <div className="row d-center mb-20">
        <div className="col-6">
          {buttonSleepToday()}
          {buttonSleepReset()}
        </div>
      </div>
    </div>
  );
};

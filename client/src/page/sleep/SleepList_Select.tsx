// SleepListSelect.tsx
import React, { useState, useEffect } from "react";
import {useStorage} from "../../assets/ts/useStorage";
import {useNavigate, useLocation} from "react-router-dom";
import { DayPicker } from "react-day-picker";
import { parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import moment from "moment-timezone";
import axios from "axios";

// 1. main ---------------------------------------------------------------------------------------->
export const SleepListSelect = () => {

  // title
  const TITLE = "Sleep List Select";
  // url
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  // date
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");
  // state 1
  const [selectedSleepType, setSelectedSleepType] = useState<string> ("list");
  // state 2
  const {value:SLEEP_LIST, setValue:setSLEEP_LIST} = useStorage<any> (
    "sleepList_SELECT", []
  );
  const {value:resultValue, setValue:setResultValue} = useStorage<Date | undefined> (
    "resultValue_SELECT", undefined
  );
  const {value:resultDuration, setValue:setResultDuration} = useStorage<string> (
    "resultDuration_SELECT", "0000-00-00 ~ 0000-00-00"
  );
  const {value:averageSleepTime, setValue:setAverageSleepTime} = useStorage<string> (
    "averageSleepTime_SELECT", "00:00"
  );
  const {value:averageSleepNight, setValue:setAverageSleepNight} = useStorage<string> (
    "averageSleepNight_SELECT", "00:00"
  );
  const {value:averageSleepMorning, setValue:setAverageSleepMorning} = useStorage<string> (
    "averageSleepMorning_SELECT", "00:00"
  );
  const {value:selectedSleepStartDay, setValue:setSelectedSleepStartDay} = useStorage<Date | undefined> (
    "selectedSleepStartDay_SELECT", undefined
  );
  const {value:selectedSleepEndDay, setValue:setSelectedSleepEndDay} = useStorage<Date | undefined> (
    "selectedSleepEndDay_SELECT", undefined
  );

  // 2-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchSleepList = async () => {
      try {
        const response = await axios.get(`${URL_SLEEP}/sleepList`, {
          params: {
            user_id : user_id,
            sleep_duration : resultDuration,
          },
        });
        setSLEEP_LIST(response.data);
      }
      catch (error: any) {
        alert(`Error fetching sleep data: ${error.message}`);
        setSLEEP_LIST([]);
      }
    };
    fetchSleepList();
  }, [user_id, resultDuration]);

  // 2-2. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchSleepAverage = async () => {
      try {
        const response = await axios.get(`${URL_SLEEP}/sleepAverage`, {
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
      catch (error: any) {
        alert(`Error fetching sleep data: ${error.message}`);
        setAverageSleepTime("00:00");
        setAverageSleepNight("00:00");
        setAverageSleepMorning("00:00");
      }
    };
    fetchSleepAverage();
  }, [user_id, resultDuration]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const formatValue = (value: number): string => {
      return value < 10 ? `0${value}` : `${value}`;
    };
    if (selectedSleepStartDay && selectedSleepEndDay) {

      const fromDate = new Date(selectedSleepStartDay);
      const toDate = new Date(selectedSleepEndDay);

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
  }, [selectedSleepStartDay, selectedSleepEndDay]);

  // 3-1. flow ------------------------------------------------------------------------------------>
  const flowDayClick = (day: any) => {
    if (day) {
      const selectedDay = new Date(day);

      if (selectedSleepStartDay && selectedSleepEndDay) {
        if (selectedDay < selectedSleepStartDay) {
          setSelectedSleepStartDay(selectedDay);
        }
        else if (selectedDay > selectedSleepEndDay) {
          setSelectedSleepEndDay(selectedDay);
        }
        else {
          setSelectedSleepStartDay(selectedDay);
          setSelectedSleepEndDay(undefined);
        }
      }
      else if (selectedSleepStartDay) {
        if (selectedDay < selectedSleepStartDay) {
          setSelectedSleepEndDay(selectedSleepStartDay);
          setSelectedSleepStartDay(selectedDay);
        }
        else if (selectedDay > selectedSleepStartDay) {
          setSelectedSleepEndDay(selectedDay);
        }
        else {
          setSelectedSleepStartDay(undefined);
          setSelectedSleepEndDay(undefined);
        }
      }
      else {
        setSelectedSleepStartDay(selectedDay);
      }
    }
  };

  // 4-1. logic ----------------------------------------------------------------------------------->
  const viewSleepDay = () => {
    return (
      <DayPicker
        mode="range"
        locale={ko}
        weekStartsOn={1}
        showOutsideDays
        selected={selectedSleepStartDay && selectedSleepEndDay && {
          from: selectedSleepStartDay,
          to: selectedSleepEndDay,
        }}
        month={selectedSleepStartDay}
        onDayClick={flowDayClick}
        onMonthChange={(month) => setSelectedSleepStartDay(month)}
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
          {SLEEP_LIST.map((index: any) => (
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

  // 6-1. button ---------------------------------------------------------------------------------->
  const buttonSleepToday = () => {
    return (
      <button className="btn btn-success me-2" onClick={() => {
        setSelectedSleepStartDay(koreanDate);
        setSelectedSleepEndDay(koreanDate);
        localStorage.removeItem("sleepList_SELECT");
        localStorage.removeItem("selectedSleepStartDay_SELECT");
        localStorage.removeItem("selectedSleepEndDay_SELECT");
      }}>
        Today
      </button>
    );
  };
  const buttonSleepReset = () => {
    return (
      <button className="btn btn-primary me-2" onClick={() => {
        setSelectedSleepStartDay(undefined);
        setSelectedSleepEndDay(undefined);
        localStorage.removeItem("sleepList_SELECT");
        localStorage.removeItem("selectedSleepStartDay_SELECT");
        localStorage.removeItem("selectedSleepEndDay_SELECT");
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
          <h2 className="mb-3 fw-9">선택으로 조회</h2>
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

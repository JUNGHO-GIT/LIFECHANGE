// SleepListYear.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import { DayPicker, MonthChangeEventHandler} from "react-day-picker";
import { differenceInDays } from "date-fns";
import { parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import moment from "moment-timezone";
import axios from "axios";
import {useLocalStorage} from "../../assets/ts/useLocalStorage";

// 1. main ---------------------------------------------------------------------------------------->
export const SleepListYear = () => {

  // title
  const TITLE = "Sleep List Year";
  // url
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  // date
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");
  // state
  const { value : SLEEP_LIST, setValue : setSLEEP_LIST }
    = useLocalStorage<any> ("sleepList_YEAR", []);
  const { value : resultValue, setValue : setResultValue }
    = useLocalStorage<Date | undefined> ("resultValue_YEAR", undefined);
  const { value : resultDuration, setValue : setResultDuration }
    = useLocalStorage<string> ("resultDuration_YEAR", "0000-00-00 ~ 0000-00-00");
  const { value : averageSleepTime, setValue : setAverageSleepTime }
    = useLocalStorage<string> ("averageSleepTime_YEAR", "00:00");
  const { value : averageSleepNight, setValue : setAverageSleepNight }
    = useLocalStorage<string> ("averageSleepNight_YEAR", "00:00");
  const { value : averageSleepMorning, setValue : setAverageSleepMorning }
    = useLocalStorage<string> ("averageSleepMorning_YEAR", "00:00");
  const { value : selectedYear, setValue : setSelectedYear }
    = useLocalStorage<Date | undefined> ("selectedYear_YEAR", koreanDate);

  // 2-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchSleepList = async () => {
      try {
        const response = await axios.get(`${URL_SLEEP}/sleepList`, {
          params: {
            user_id: user_id,
            sleep_duration: resultDuration,
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
            user_id: user_id,
            sleep_duration: resultDuration,
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
    if (selectedYear) {
      setResultValue (
        parseISO (
          `${selectedYear.getFullYear()}`
        )
      );
      setResultDuration (
        `${selectedYear.getFullYear()}-01-01 ~ ${selectedYear.getFullYear()}-12-31`
      );
    }
    else {
      setResultValue (undefined);
    }
  }, [selectedYear]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowYearChange: MonthChangeEventHandler = (day) => {
    const yearDate = new Date(day.getFullYear(), 0, 1);
    const monthDate = new Date(day.getFullYear(), day.getMonth(), 1);
    const nextMonth = differenceInDays(new Date(day.getFullYear() + 1, 0, 1), monthDate) / 30;
    const prevMonth = differenceInDays(monthDate, yearDate) / 30;

    if (nextMonth > prevMonth) {
      setSelectedYear(new Date(day.getFullYear() + 1, 0, 1));
    }
    else {
      setSelectedYear(new Date(day.getFullYear(), 0, 1));
    }
  };

  // 4-1. logic ----------------------------------------------------------------------------------->
  const viewSleepDay = () => {
    return (
      <DayPicker
        mode="default"
        showOutsideDays
        locale={ko}
        weekStartsOn={1}
        month={selectedYear}
        onMonthChange={flowYearChange}
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
            <th>취침 시간</th>
            <th>기상 시간</th>
            <th>수면 시간</th>
          </tr>
        </thead>
        <tbody>
          {SLEEP_LIST.map((index: any) => (
            <tr>
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
        setSelectedYear(koreanDate);
        localStorage.removeItem("selectedYear_YEAR");
      }}>
        Today
      </button>
    );
  };
  const buttonSleepReset = () => {
    return (
      <button className="btn btn-primary me-2" onClick={() => {
        setSelectedYear(undefined);
        localStorage.removeItem("selectedYear_YEAR");
      }}>
        Reset
      </button>
    );
  };
  const buttonSleepList = () => {
    return (
      <button className="btn btn-primary me-2" onClick={() => {
        navParam("/sleepListDay");
      }}>
        Day
      </button>
    );
  };
  const buttonSleepListWeek = () => {
    return (
      <button className="btn btn-primary me-2" onClick={() => {
        navParam("/sleepListWeek");
      }}>
        Week
      </button>
    );
  };
  const buttonSleepListMonth = () => {
    return (
      <button className="btn btn-primary me-2" onClick={() => {
        navParam("/sleepListMonth");
      }}>
        Month
      </button>
    );
  };
  const buttonSleepListYear = () => {
    return (
      <button className="btn btn-primary me-2" onClick={() => {
        navParam("/sleepListYear");
      }}>
        Year
      </button>
    );
  };
  const buttonSleepListSelect = () => {
    return (
      <button className="btn btn-primary me-2" onClick={() => {
        navParam("/sleepListSelect");
      }}>
        Select
      </button>
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
          {buttonSleepList()}
          {buttonSleepListWeek()}
          {buttonSleepListMonth()}
          {buttonSleepListYear()}
          {buttonSleepListSelect()}
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-4">
          <h2 className="mb-3 fw-9">년별로 조회</h2>
          {viewSleepDay()}
        </div>
        <div className="col-4">
          <h2 className="mb-3 fw-9">수면 기록</h2>
          {tableSleepList()}
        </div>
        <div className="col-4">
          <h2 className="mb-3 fw-9">수면 평균</h2>
          {tableSleepAverage()}
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

// SleepListMonth.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import { DayPicker, MonthChangeEventHandler } from "react-day-picker";
import { ko } from "date-fns/locale";
import moment from "moment-timezone";
import axios from "axios";

// 1. main ---------------------------------------------------------------------------------------->
export const SleepListMonth = () => {

  // title
  const TITLE = "Sleep List Month";
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
  const [SLEEP_LIST, setSLEEP_LIST] = useState<any>([]);
  // state 2
  const [resultValue, setResultValue] = useState<string>();
  const [resultDuration, setResultDuration] = useState<string>("0000-00-00 ~ 0000-00-00");
  // state 3
  const [averageSleepTime, setAverageSleepTime] = useState<string>();
  const [averageSleepNight, setAverageSleepNight] = useState<string>();
  const [averageSleepMorning, setAverageSleepMorning] = useState<string>();
  // state 4
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(koreanDate);

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
    const formatValue = (value: number): string => {
      return value < 10 ? `0${value}` : `${value}`;
    };
    if (selectedMonth) {
      setResultValue (
        `${selectedMonth.getFullYear()}-${formatValue(selectedMonth.getMonth() + 1)}`
      );
      setResultDuration (
        `${selectedMonth.getFullYear()}-${formatValue(selectedMonth.getMonth() + 1)}-01 ~ ${selectedMonth.getFullYear()}-${formatValue(selectedMonth.getMonth() + 1)}-31`
      );
    }
    else {
      setResultValue ("선택된 날짜가 없습니다.");
    }
  }, [selectedMonth]);

  // 2-4. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const savedDate = localStorage.getItem("selectedMonth");
    if (savedDate) {
      setSelectedMonth(new Date(savedDate));
    }
  }, []);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowMonthChange: MonthChangeEventHandler = (day) => {
    const monthDate = new Date(day.getFullYear(), day.getMonth(), 1);
    setSelectedMonth(monthDate);
    localStorage.setItem("selectedMonth", monthDate.toISOString());
  };

  // 4-1. logic ----------------------------------------------------------------------------------->
  const viewSleepDay = () => {
    return (
      <DayPicker
        mode="default"
        showOutsideDays
        locale={ko}
        weekStartsOn={1}
        month={selectedMonth}
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
            <th>날짜</th>
            <th>기간</th>
            <th>취침 시간</th>
            <th>기상 시간</th>
            <th>수면 시간</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{resultValue}</td>
            <td>{resultDuration}</td>
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
        setSelectedMonth(koreanDate);
      }}>
        Today
      </button>
    );
  };
  const buttonSleepReset = () => {
    return (
      <button className="btn btn-primary me-2" onClick={() => {
        setSelectedMonth(undefined);
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
          {viewSleepDay()}
        </div>
        <div className="col-4">
          {tableSleepList()}
        </div>
        <div className="col-4">
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

// SleepListYear.tsx
import React, { useState, useEffect } from "react";
import { DayPicker, MonthChangeEventHandler} from "react-day-picker";
import { differenceInDays } from "date-fns";
import { ko } from "date-fns/locale";
import moment from "moment-timezone";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const SleepListYear = () => {

  // title
  const TITLE = "Sleep List Year";
  // url
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;

  const user_id = window.sessionStorage.getItem("user_id");
  const today = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());

  const [resultValue, setResultValue] = useState<string>("");
  const [resultDuration, setResultDuration] = useState<string>("0000-00-00 ~ 0000-00-00");
  const [averageSleepTime, setAverageSleepTime] = useState();
  const [averageSleepNight, setAverageSleepNight] = useState();
  const [averageSleepMorning, setAverageSleepMorning] = useState();

  const [selectedYear, setSelectedYear] = useState<Date | undefined>(today);

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchSleepList = async () => {
      try {
        const response = await axios.get(`${URL_SLEEP}/sleepList`, {
          params: {
            user_id: user_id,
            sleep_duration: resultDuration,
          },
        });
        setAverageSleepTime(response.data.averageSleepTime);
        setAverageSleepNight(response.data.averageSleepNight);
        setAverageSleepMorning(response.data.averageSleepMorning);
      }
      catch (error: any) {
        alert(`Error fetching sleep data: ${error.message}`);
      }
    };
    fetchSleepList();
  }, [user_id, resultDuration]);

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const formatValue = (value: number): string => {
      return value < 10 ? `0${value}` : `${value}`;
    };
    if (selectedYear) {
      setResultValue(`${selectedYear.getFullYear()}`);

      setResultDuration(`${selectedYear.getFullYear()}-01-01 ~ ${selectedYear.getFullYear()}-12-31`);
    }
    else {
      setResultValue("선택된 날짜가 없습니다.");
    }
  }, [selectedYear]);

  // ---------------------------------------------------------------------------------------------->
  const handleYearChange: MonthChangeEventHandler = (day) => {
    if (day) {
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
    }
    else {
      setSelectedYear(undefined);
    }
  };

  // ---------------------------------------------------------------------------------------------->
  const buttonSleepToday = () => {
    return (
      <button className="btn btn-success me-2" onClick={() => {
        setSelectedYear(today);
      }}>
        Today
      </button>
    );
  };
  const buttonSleepReset = () => {
    return (
      <button className="btn btn-primary me-2" onClick={() => {
        setSelectedYear(undefined);
      }}>
        Reset
      </button>
    );
  };
  const footer = () => {
    return (
      <div>
        <hr />
        <p>{resultValue}</p>
        <p>{resultDuration}</p>
        <p>평균 취침 시간: {averageSleepNight}</p>
        <p>평균 기상 시간: {averageSleepMorning}</p>
        <p>평균 수면 시간: {averageSleepTime}</p>
        <hr />
        {buttonSleepToday()}
        {buttonSleepReset()}
      </div>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-9">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5 mb-20">
        <div className="col-12">
          <DayPicker
            mode="default"
            selected={selectedYear}
            showOutsideDays
            locale={ko}
            weekStartsOn={1}
            month={selectedYear}
            onMonthChange={handleYearChange}
            modifiersClassNames={{
              today: "today",
              selected: "selected",
              disabled: "disabled",
              outside: "outside",
              inside: "inside",
            }}
            footer={footer()}
          />
        </div>
      </div>
    </div>
  );
};

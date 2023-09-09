// SleepListMonth.tsx
import React, { useState, useEffect } from "react";
import { DayPicker, MonthChangeEventHandler } from "react-day-picker";
import { ko } from "date-fns/locale";
import moment from "moment-timezone";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const SleepListMonth = () => {
  // title
  const TITLE = "Sleep List Month";
  // url
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;

  const user_id = window.sessionStorage.getItem("user_id");
  const today = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());

  const [resultValue, setResultValue] = useState<string>("");
  const [resultDuration, setResultDuration] = useState<string>("0000-00-00 ~ 0000-00-00");
  const [averageSleepTime, setAverageSleepTime] = useState();
  const [averageSleepNight, setAverageSleepNight] = useState();
  const [averageSleepMorning, setAverageSleepMorning] = useState();

  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(today);

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

  // ---------------------------------------------------------------------------------------------->
  const handleMonthChange: MonthChangeEventHandler = (day) => {
    if (day) {
      const monthDate = new Date(day.getFullYear(), day.getMonth(), 1);
      setSelectedMonth(monthDate);
    }
    else {
      setSelectedMonth(undefined);
    }
  };

  // ---------------------------------------------------------------------------------------------->
  const buttonSleepToday = () => {
    return (
      <button className="btn btn-success me-2" onClick={() => {
        setSelectedMonth(today);
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
            selected={selectedMonth}
            showOutsideDays
            locale={ko}
            weekStartsOn={1}
            month={selectedMonth}
            onMonthChange={handleMonthChange}
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

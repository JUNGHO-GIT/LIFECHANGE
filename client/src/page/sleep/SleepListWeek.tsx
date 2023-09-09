// SleepListWeek.tsx
import React, { useState, useEffect } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";
import moment from "moment-timezone";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const SleepListWeek = () => {

  // title
  const TITLE = "Sleep List Week";
  // url
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;

  const user_id = window.sessionStorage.getItem("user_id");
  const today = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());

  const [resultValue, setResultValue] = useState<string>("");
  const [resultDuration, setResultDuration] = useState<string>("0000-00-00 ~ 0000-00-00");
  const [averageSleepTime, setAverageSleepTime] = useState();
  const [averageSleepNight, setAverageSleepNight] = useState();
  const [averageSleepMorning, setAverageSleepMorning] = useState();

  const [range, setRange] = useState<DateRange | undefined>();
  const [currentMonth, setCurrentMonth] = useState<Date>(today);

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
    if (range?.from && range?.to) {
      setResultValue (
        `${range.from.getFullYear()}-${formatValue(range.from.getMonth() + 1)}-${formatValue(range.from.getDate())} ~ ${range.to.getFullYear()}-${formatValue(range.to.getMonth() + 1)}-${formatValue(range.to.getDate())}`
      );

      setResultDuration (
        `${range.from.getFullYear()}-${formatValue(range.from.getMonth() + 1)}-${formatValue(range.from.getDate())} ~ ${range.to.getFullYear()}-${formatValue(range.to.getMonth() + 1)}-${formatValue(range.to.getDate())}`
      );
    }
    else {
      setResultValue ("선택된 날짜가 없습니다.");
    }
  }, [range]);

  //---------------------------------------------------------------------------------------------->
  const handleDayClick = (selectedDate: Date) => {
    const startOfWeek = moment(selectedDate).startOf("isoWeek").toDate();
    const endOfWeek = moment(selectedDate).endOf("isoWeek").toDate();
    setRange({ from: startOfWeek, to: endOfWeek });
  };

  // ---------------------------------------------------------------------------------------------->
  const buttonSleepToday = () => {
    return (
      <button className="btn btn-success me-2" onClick={() => {
        setCurrentMonth(today);
        setRange(undefined);
      }}>
        Today
      </button>
    );
  };
  const buttonSleepReset = () => {
    return (
      <button className="btn btn-primary me-2" onClick={() => {
        setRange(undefined);
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
            mode="range"
            showOutsideDays
            selected={range}
            month={currentMonth}
            onDayClick={handleDayClick}
            locale={ko}
            weekStartsOn={1}
            onMonthChange={(date) => {
              setCurrentMonth(date);
            }}
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

// SleepListSelect.tsx
import React, { useEffect} from "react";
import {useLocalStorage} from "../../assets/ts/useLocalStorage";
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
  // state
  const { value: SLEEP_LIST, setValue: setSLEEP_LIST }
    = useLocalStorage<any> ("sleepList_SELECT", []);
  const { value: resultValue, setValue: setResultValue }
    = useLocalStorage<Date | undefined> ("resultValue_SELECT", undefined);
  const { value: resultDuration, setValue: setResultDuration }
    = useLocalStorage<string> ("resultDuration_SELECT", "0000-00-00 ~ 0000-00-00");
  const { value: averageSleepTime, setValue: setAverageSleepTime }
    = useLocalStorage<string> ("averageSleepTime_SELECT", "00:00");
  const { value: averageSleepNight, setValue: setAverageSleepNight }
    = useLocalStorage<string> ("averageSleepNight_SELECT", "00:00");
  const { value: averageSleepMorning, setValue: setAverageSleepMorning }
    = useLocalStorage<string> ("averageSleepMorning_SELECT", "00:00");
  const { value: selectedStartDay, setValue: setSelectedStartDay }
    = useLocalStorage<Date | undefined> ("selectedStartDay_SELECT", undefined);
  const { value: selectedEndDay, setValue: setSelectedEndDay }
    = useLocalStorage<Date | undefined> ("selectedEndDay_SELECT", undefined);

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
    if (selectedStartDay && selectedEndDay) {

      const fromDate = new Date(selectedStartDay);
      const toDate = new Date(selectedEndDay);

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
  }, [selectedStartDay, selectedEndDay]);

  // 3-1. flow ------------------------------------------------------------------------------------>
  const flowDayClick = (day: any) => {
    if (day) {
      const selectedDay = new Date(day);

      if (selectedStartDay && selectedEndDay) {
        if (selectedDay < selectedStartDay) {
          setSelectedStartDay(selectedDay);
        }
        else if (selectedDay > selectedEndDay) {
          setSelectedEndDay(selectedDay);
        }
        else {
          setSelectedStartDay(selectedDay);
          setSelectedEndDay(undefined);
        }
      }
      else if (selectedStartDay) {
        if (selectedDay < selectedStartDay) {
          setSelectedEndDay(selectedStartDay);
          setSelectedStartDay(selectedDay);
        }
        else if (selectedDay > selectedStartDay) {
          setSelectedEndDay(selectedDay);
        }
        else {
          setSelectedStartDay(undefined);
          setSelectedEndDay(undefined);
        }
      }
      else {
        setSelectedStartDay(selectedDay);
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
        selected={selectedStartDay && selectedEndDay && {
          from: selectedStartDay,
          to: selectedEndDay,
        }}
        month={selectedStartDay}
        onDayClick={flowDayClick}
        onMonthChange={(month) => setSelectedStartDay(month)}
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
        setSelectedStartDay(koreanDate);
        setSelectedEndDay(koreanDate);
        localStorage.removeItem("sleepList_SELECT");
        localStorage.removeItem("selectedStartDay_SELECT");
        localStorage.removeItem("selectedEndDay_SELECT");
      }}>
        Today
      </button>
    );
  };
  const buttonSleepReset = () => {
    return (
      <button className="btn btn-primary me-2" onClick={() => {
        setSelectedStartDay(undefined);
        setSelectedEndDay(undefined);
        localStorage.removeItem("sleepList_SELECT");
        localStorage.removeItem("selectedStartDay_SELECT");
        localStorage.removeItem("selectedEndDay_SELECT");
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
          <h2 className="mb-3 fw-9">선택한 날짜별로 조회</h2>
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

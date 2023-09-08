// SleepList.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import { DayClickEventHandler, DateRange, DayPicker } from "react-day-picker";
import { createGlobalStyle } from "styled-components";
import { addMonths, isSameDay, differenceInDays } from "date-fns";
import { ko } from "date-fns/locale";
import moment from "moment-timezone";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
const TestStyle = createGlobalStyle`
  .today, .rdp-caption_label, .rdp-head_cell {
    font-weight: bolder;
  }
  .today, .rdp-caption_label {
    font-size: 150%;
  }
  .rdp-head_cell {
    font-size: 120%;
  }
  .today {
    color: #ff0000;
  }
  .selected {
    background-color: #0d6efd !important;
    color: #fff !important;
  }
  .selected:not([disabled]) {
    background-color: #0d6efd !important;
    color: #fff !important;
  }
  .selected:hover {
    background-color: #0d6efd !important;
    color: #fff !important;
  }
  .selected:hover:not([disabled]) {
   background-color: #0d6efd !important;
    color: #fff !important;
  }
  .rdp-day:focus {
    background-color: #0d6efd !important;
    color: #fff !important;
  }
  .rdp-day:active {
    background-color: #0d6efd !important;
    color: #fff !important;
  }
  .disabled, .outside {
    color: #999;
  }
  .inside {
    color: #000;
  }
`;

// 1. main ---------------------------------------------------------------------------------------->
export const SleepList = () => {

  // title
  const TITLE = "Sleep List";
  // url
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  // date
  const koreanDate = moment.tz('Asia/Seoul').format('YYYY-MM-DD').toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");
  // state
  const [sleep_day, setSleep_day] = useState(koreanDate);
  const [SLEEP_LIST, setSLEEP_LIST] = useState({
    getDayResult: [],
    getWeekResult: [],
    getMonthResult: [],
    getYearResult: []
  });

  const today = new Date (moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | undefined>(today.getDate());

  // 2. useEffect --------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchSleepList = async () => {
      try {
        const response = await axios.get (`${URL_SLEEP}/sleepList`, {
          params: {
            user_id : user_id,
            sleep_day : sleep_day
          }
        });
        setSLEEP_LIST(response.data);
      }
      catch (error: any) {
        alert(`Error fetching sleep data: ${error.message}`);
      }
    };
    fetchSleepList();
  }, [user_id, sleep_day]);

  // 3. flow -------------------------------------------------------------------------------------->

  // 4. logic ------------------------------------------------------------------------------------->

  // 5. table ------------------------------------------------------------------------------------->
  const tableSleepDayList = () => {

    const handleDayClick: DayClickEventHandler = (day, modifiers) => {
      if (day) {
        setSelectedDay(day.getDate());
        setSelectedMonth(day.getMonth());
        setSelectedYear(day.getFullYear());
      }
      else {
        setSelectedDay(undefined);
      }
    };

    const handleResetClick = () => {
      setSelectedDay(undefined);
    };

    const selectedInfo = () => {
      if (selectedDay !== undefined) {
        return (
          <div>
            <hr />
            <span>{`${selectedYear}`}년</span>
            <span>{`${selectedMonth + 1}`}월</span>
            <span>{`${selectedDay}`}일</span>
            <hr />
          </div>
        );
      }
    };

    const footer = () => {
      return (
        <div>
          <p>{selectedInfo()}</p>
          <button
            className="btn btn-success me-2"
            onClick={() => {
              setSelectedMonth(today.getMonth());
              setSelectedYear(today.getFullYear());
              setSelectedDay(today.getDate());
            }}
          >
            Today
          </button>
          <button className="btn btn-primary me-2" onClick={handleResetClick}>
            Reset
          </button>
        </div>
      );
    };

    return (
      <div className="container"><TestStyle />
        <div className="row">
          <div className="col-12">
            <DayPicker
              mode="single"
              showOutsideDays
              selected={new Date(selectedYear, selectedMonth, selectedDay)}
              month={new Date(selectedYear, selectedMonth)}
              onMonthChange={(date) => {
                setSelectedMonth(date.getMonth());
                setSelectedYear(date.getFullYear());
              }}
              onSelect={handleDayClick}
              locale={ko}
              weekStartsOn={0}
              footer={footer()}
              modifiersClassNames={{
                today: "today",
                selected: "selected",
                disabled: "disabled",
                outside: "outside",
                inside: "inside",
              }}
              onChange={(date:any) => {
                setSleep_day(moment(date).format("YYYY-MM-DD").toString());
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Night</th>
                  <th>Morning</th>
                  <th>Time</th>
                  <th>day</th>
                  <th>week</th>
                  <th>month</th>
                  <th>year</th>
                  <th>regdate</th>
                </tr>
              </thead>
              <tbody>
                {SLEEP_LIST.getDayResult.map((index: any) => (
                  <tr key={index._id}>
                    <td>
                      <a onClick={() => {buttonSleepDetail(index._id);}}>{index.sleep_title}</a>
                    </td>
                    <td>{index.sleep_night}</td>
                    <td>{index.sleep_morning}</td>
                    <td>{index.sleep_time}</td>
                    <td>{index.sleep_day}</td>
                    <td>{index.sleep_week}</td>
                    <td>{index.sleep_month}</td>
                    <td>{index.sleep_year}</td>
                    <td>{index.sleep_regdate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonSleepDetail = (_id: string) => {
    navParam(`/sleepDetail`, {
      state: {
        _id
      }
    });
  };
  const buttonRefreshPage = () => {
    return (
      <Link to="/sleepList">
        <button type="button" className="btn btn-success ms-2">Refresh</button>
      </Link>
    );
  };
  const buttonSleepInsert = () => {
    return (
      <Link to="/sleepInsert">
        <button type="button" className="btn btn-primary ms-2">Insert</button>
      </Link>
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
        <div className="col-12 d-center">
          {tableSleepDayList()}
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-10">
          <form className="form-inline">
            {buttonRefreshPage()}
            {buttonSleepInsert()}
          </form>
        </div>
      </div>
    </div>
  );
};
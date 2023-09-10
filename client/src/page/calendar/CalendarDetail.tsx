// CalendarDetail.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// 1. main ---------------------------------------------------------------------------------------->
export const CalendarDetail = () => {

  // title
  const TITLE = "Calendar Detail";
  // url
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  // date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id"
  );
  const calendar_year = location.state.calendar_year;
  const calendar_month = location.state.calendar_month;
  const calendar_day = location.state.calendar_day;
  // state 1
  const [FOOD_LIST, setFOOD_LIST] = useState<any> ([]);
  const [WORK_LIST, setWORK_LIST] = useState<any> ([]);
  const [SLEEP_LIST, setSLEEP_LIST] = useState<any> ([]);
  // state 2
  const [calendar_regdate, setCalendar_regdate]
  = useState(`${calendar_year}-${calendar_month}-${calendar_day}`);
  const [work_regdate, setWork_regdate] = useState(koreanDate);
  const [sleep_regdate, setSleep_regdate] = useState(koreanDate);
  const [food_regdate, setFood_regdate] = useState(koreanDate);

  // 2-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchFoodList = async () => {
      try {
        const response = await axios.get(`${URL_FOOD}/foodList`, {
          params: {
            user_id: user_id,
            food_regdate: food_regdate,
          },
        });
        setFOOD_LIST(response.data);
      }
      catch (error: any) {
        alert(`Error fetching food data: ${error.message}`);
        setFOOD_LIST([]);
      }
    };
    fetchFoodList();
  }, [user_id, food_regdate]);

  // 2-2. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchWorkList = async () => {
      try {
        const response = await axios.get(`${URL_WORK}/workList`, {
          params: {
            user_id: user_id,
            work_regdate: work_regdate,
          },
        });
        setWORK_LIST(response.data);
      }
      catch (error: any) {
        alert(`Error fetching work data: ${error.message}`);
        setWORK_LIST([]);
      }
    };
    fetchWorkList();
  }, [user_id, work_regdate]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchSleepList = async () => {
      try {
        const response = await axios.get(`${URL_SLEEP}/sleepList`, {
          params: {
            user_id: user_id,
            sleep_regdate: sleep_regdate,
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
  }, [user_id, work_regdate]);

  // 4. logic ------------------------------------------------------------------------------------->
  const logicViewDate = () => {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        popperPlacement="bottom"
        selected={new Date(calendar_regdate)}
        onChange={(date: any) => {
          const selectedDate = date.toISOString().split("T")[0];
          setFood_regdate(selectedDate);
          setWork_regdate(selectedDate);
          setSleep_regdate(selectedDate);
        }}
      />
    );
  };

  // 5-1. table ----------------------------------------------------------------------------------->
  const tableFoodList = () => {
    return (
      <table className="table table-bordered border-dark">
        <thead className="table-dark">
          <tr>
            <th>칼로리</th>
            <th>탄수화물</th>
            <th>단백질</th>
            <th>지방</th>
          </tr>
        </thead>
        <tbody>
          {FOOD_LIST.map((index: any) => (
            <tr>
              <td>{index.food_calories}</td>
              <td>{index.food_carb}</td>
              <td>{index.food_protein}</td>
              <td>{index.food_fat}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 5-2. table ----------------------------------------------------------------------------------->
  const tableWorkList = () => {
    return (
      <table className="table table-bordered border-dark">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Part</th>
            <th>Title</th>
            <th>Kg</th>
            <th>Set</th>
            <th>Count</th>
            <th>Rest</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {WORK_LIST.map((index: any) => (
            <tr>
              <td>{index.user_id}</td>
              <td>{index.work_part}</td>
              <td>{index.work_title}</td>
              <td>{index.work_kg}</td>
              <td>{index.work_set}</td>
              <td>{index.work_count}</td>
              <td>{index.work_rest}</td>
              <td>{index.work_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 5-3. table ----------------------------------------------------------------------------------->
  const tableSleepList = () => {
    return (
      <table className="table table-bordered border-dark">
        <thead className="table-dark">
          <tr>
            <th>day</th>
            <th>night</th>
            <th>morning</th>
            <th>time</th>
          </tr>
        </thead>
        <tbody>
          {SLEEP_LIST.map((index: any) => (
            <tr>
              <td>{index.sleep_day}</td>
              <td>{index.sleep_night}</td>
              <td>{index.sleep_morning}</td>
              <td>{index.sleep_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="container main">
      <div className="row d-center">
        <div className="col-12">
          <h1 className="mb-3 fw-9">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-5">
            <span className="ms-4">{logicViewDate()}</span>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">{tableFoodList()}</div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">{tableWorkList()}</div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">{tableSleepList()}</div>
      </div>
    </div>
  );
};

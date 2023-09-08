// CalendarDetail.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const CalendarDetail = () => {

  // title
  const TITLE = "Calendar Detail";
  // url
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const URL_WORKOUT = process.env.REACT_APP_URL_WORKOUT;
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  // date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");
  const calendar_year = location.state.calendar_year;
  const calendar_month = location.state.calendar_month;
  const calendar_day = location.state.calendar_day;
  // state
  const [FOOD_LIST, setFOOD_LIST] = useState<any>([]);
  const [WORKOUT_LIST, setWORKOUT_LIST] = useState<any>([]);
  const [SLEEP_LIST, setSLEEP_LIST] = useState<any>([]);
  const [calendar_regdate, setCalendar_regdate]
  = useState(`${calendar_year}-${calendar_month}-${calendar_day}`);
  const [workout_regdate, setWorkout_regdate] = useState(koreanDate);
  const [sleep_regdate, setSleep_regdate] = useState(koreanDate);
  const [food_regdate, setFood_regdate] = useState(koreanDate);

  // ---------------------------------------------------------------------------------------------->
  const viewDate = () => {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        popperPlacement="bottom"
        selected={new Date(calendar_regdate)}
        onChange={(date: any) => {
          const selectedDate = date.toISOString().split("T")[0];
          setFood_regdate(selectedDate);
          setWorkout_regdate(selectedDate);
          setSleep_regdate(selectedDate);
        }}
      />
    );
  };

  // 2. useEffect --------------------------------------------------------------------------------->
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

  // 2. useEffect --------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchWorkoutList = async () => {
      try {
        const response = await axios.get(`${URL_WORKOUT}/workoutList`, {
          params: {
            user_id: user_id,
            workout_regdate: workout_regdate,
          },
        });
        setWORKOUT_LIST(response.data);
      }
      catch (error: any) {
        alert(`Error fetching workout data: ${error.message}`);
        setWORKOUT_LIST([]);
      }
    };
    fetchWorkoutList();
  }, [user_id, workout_regdate]);

  // 2. useEffect --------------------------------------------------------------------------------->
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
  }, [user_id, workout_regdate]);

  // ---------------------------------------------------------------------------------------------->
  const foodListTable = () => {
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

  // ---------------------------------------------------------------------------------------------->
  const workoutListTable = () => {
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
          {WORKOUT_LIST.map((index: any) => (
            <tr>
              <td>{index.user_id}</td>
              <td>{index.workout_part}</td>
              <td>{index.workout_title}</td>
              <td>{index.workout_kg}</td>
              <td>{index.workout_set}</td>
              <td>{index.workout_count}</td>
              <td>{index.workout_rest}</td>
              <td>{index.workout_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const sleepListTable = () => {
    return (
      <table className="table table-bordered border-dark">
        <thead className="table-dark">
          <tr>
            <th>title</th>
            <th>night</th>
            <th>morning</th>
            <th>time</th>
          </tr>
        </thead>
        <tbody>
          {SLEEP_LIST.map((index: any) => (
            <tr>
              <td>{index.sleep_title}</td>
              <td>{index.sleep_night}</td>
              <td>{index.sleep_morning}</td>
              <td>{index.sleep_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

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
            <span className="ms-4">{viewDate()}</span>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">{foodListTable()}</div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">{workoutListTable()}</div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">{sleepListTable()}</div>
      </div>
    </div>
  );
};

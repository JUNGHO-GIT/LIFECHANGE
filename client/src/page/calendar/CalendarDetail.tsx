// CalendarDetail.tsx
import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const CalendarDetail = () => {
  const location = useLocation();
  const user_id = location.state.user_id;

  const calendar_year = location.state.calendar_year;
  const calendar_month = location.state.calendar_month;
  const calendar_day = location.state.calendar_day;

  const koreanDate = new Date(
    `${calendar_year}-${calendar_month}-${calendar_day}`
  );
  koreanDate.setHours(koreanDate.getHours() + 9);

  const [food_regdate, setFood_regdate] = useState(
    koreanDate.toISOString().split("T")[0]
  );
  const [workout_regdate, setWorkout_regdate] = useState(
    koreanDate.toISOString().split("T")[0]
  );
  const [sleep_regdate, setSleep_regdate] = useState(
    koreanDate.toISOString().split("T")[0]
  );

  const [FOOD_TOTAL, setFOOD_TOTAL] = useState([]);
  const [WORKOUT_LIST, setWORKOUT_LIST] = useState([]);
  const [SLEEP_LIST, setSLEEP_LIST] = useState([]);

  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const URL_WORKOUT = process.env.REACT_APP_URL_WORKOUT;
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;

  const TITLE = "Calendar Detail";

  // ---------------------------------------------------------------------------------------------->
  const datePicker = () => {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        popperPlacement="bottom"
        selected={new Date(food_regdate)}
        onChange={(date: any) => {
          const selectedDate = date.toISOString().split("T")[0];
          setFood_regdate(selectedDate);
          setWorkout_regdate(selectedDate);
          setSleep_regdate(selectedDate);
        }}
      />
    );
  };

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchFoodList = async () => {
      try {
        const response = await axios.get(`${URL_FOOD}/foodTotal`, {
          params: {
            user_id: user_id,
            food_regdate: food_regdate,
          },
        });
        setFOOD_TOTAL(response.data);
      } catch (error: any) {
        alert(`Error fetching food data: ${error.message}`);
        setFOOD_TOTAL([]);
      }
    };
    fetchFoodList();
  }, [user_id, food_regdate]);

  // ---------------------------------------------------------------------------------------------->
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
      } catch (error: any) {
        alert(`Error fetching workout data: ${error.message}`);
        setWORKOUT_LIST([]);
      }
    };
    fetchWorkoutList();
  }, [user_id, workout_regdate]);

  // ---------------------------------------------------------------------------------------------->
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
      } catch (error: any) {
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
          {FOOD_TOTAL.map((index: any) => (
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

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-9">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-5">
            <span className="ms-4">{datePicker()}</span>
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

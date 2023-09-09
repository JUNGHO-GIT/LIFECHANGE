// WorkoutList.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// 1. main ---------------------------------------------------------------------------------------->
export const WorkoutList = () => {

  // title
  const TITLE = "Workout List";
  // url
  const URL_WORKOUT = process.env.REACT_APP_URL_WORKOUT;
  // date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");
  // state
  const [WORKOUT_LIST, setWORKOUT_LIST] = useState<any>([]);
  const [workout_regdate, setWorkout_regdate] = useState(koreanDate);

  // 2-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchWorkoutList = async () => {
      try {
        const response = await axios.get (`${URL_WORKOUT}/workoutList`, {
          params: {
            user_id: user_id,
            workout_regdate : workout_regdate,
          }
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

  // 3. flow -------------------------------------------------------------------------------------->

  // 4. logic ------------------------------------------------------------------------------------->
  const logicViewDate = () => {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        selected={new Date (workout_regdate)}
        popperPlacement="bottom"
        onChange={(date: any) => {
          const selectedDate = date.toISOString().split("T")[0];
          setWorkout_regdate(selectedDate);
        }}
      />
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableWorkoutList = () => {
    return (
      <table className="table table-striped table-bordered">
        <thead>
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
          {WORKOUT_LIST.map((index : any) => (
            <tr key={index}>
              <td>{buttonWorkoutDetail(index._id, index.user_id)}</td>
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

  // 6. button ------------------------------------------------------------------------------------>
  const buttonWorkoutDetail = (_id:string, user_id:string) => {
    return (
      <p onClick={(e) => {
        e.preventDefault();
        navParam(`/workoutDetail`, {state: {_id: _id}})
      }}>
        {user_id}
      </p>
    );
  };
  const buttonWorkoutInsert = () => {
    return (
      <button type="button" className="btn btn-primary ms-2" onClick={() => {
        navParam(`/workoutInsert`);
      }}>
        Insert
      </button>
    );
  };
  const buttonRefreshPage = () => {
    return (
      <button type="button" className="btn btn-success ms-2" onClick={() => {
        window.location.reload();
      }}>
        Refresh
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
        <div className="col-12">
          <h1 className="mb-3 fw-5">
            <span className="ms-4">{logicViewDate()}</span>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-10">
          <form className="form-inline">
            {tableWorkoutList()}
            <br/>
            {buttonRefreshPage()}
            {buttonWorkoutInsert()}
          </form>
        </div>
      </div>
    </div>
  );
};
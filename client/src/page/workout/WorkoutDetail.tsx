// WorkoutDetail.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const WorkoutDetail = () => {

  // title
  const TITLE = "Workout Detail";
  // url
  const URL_WORKOUT = process.env.REACT_APP_URL_WORKOUT;
  // date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const _id = location.state._id;
  const user_id = window.sessionStorage.getItem("user_id");
  // state
  const [WORKOUT, setWORKOUT] = useState<any>({});

  // 2. useEffect --------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchWorkoutDetail = async () => {
      try {
        const response = await axios.get(`${URL_WORKOUT}/workoutDetail`, {
          params: {
            _id: _id,
          },
        });
        setWORKOUT(response.data);
      }
      catch (error: any) {
        alert(`Error fetching workout data: ${error.message}`);
        setWORKOUT([]);
      }
    };
    fetchWorkoutDetail();
  }, [_id]);

  // ---------------------------------------------------------------------------------------------->
  const workoutDeleteFlow = async () => {
    try {
      const confirm = window.confirm("Are you sure you want to delete?");
      if (!confirm) {
        return;
      }
      else {
        const response = await axios.delete(`${URL_WORKOUT}/workoutDelete`, {
          data: {
            _id : WORKOUT._id,
          },
        });
        if (response.data === "success") {
          alert("Delete Success");
          navParam(`/workoutList`);
        }
        else {
          alert("Delete failed");
        }
      }
    }
    catch (error: any) {
      alert(`Error fetching workout data: ${error.message}`);
    }
  };

  // ---------------------------------------------------------------------------------------------->
  const workoutDetailTable = () => {
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
          <tr>
            <td>{WORKOUT.user_id}</td>
            <td>{WORKOUT.workout_part}</td>
            <td>{WORKOUT.workout_title}</td>
            <td>{WORKOUT.workout_kg}</td>
            <td>{WORKOUT.workout_set}</td>
            <td>{WORKOUT.workout_count}</td>
            <td>{WORKOUT.workout_rest}</td>
            <td>{WORKOUT.workout_time}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonWorkoutDelete = () => {
    return (
      <button
        type="button"
        className="btn btn-danger ms-2"
        onClick={workoutDeleteFlow}
      >
        Delete
      </button>
    );
  };
  const buttonWorkoutUpdate = (_id: string) => {
    const navButton = () =>
      navParam(`/workoutUpdate`, {
        state: {
          _id,
        },
      });
    return (
      <button
        type="button"
        className="btn btn-primary ms-2"
        onClick={navButton}
      >
        Update
      </button>
    );
  };
  const buttonRefreshPage = () => {
    return (
      <Link to="/workoutDetail">
        <button type="button" className="btn btn-success ms-2">
          Refresh
        </button>
      </Link>
    );
  };
  const buttonWorkoutList = () => {
    return (
      <Link to="/workoutList">
        <button type="button" className="btn btn-secondary ms-2">
          List
        </button>
      </Link>
    );
  };

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="container">
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-9">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-10">
          <form className="form-inline">
            {workoutDetailTable()}
            <br />
            {buttonRefreshPage()}
            {buttonWorkoutUpdate(WORKOUT._id)}
            {buttonWorkoutDelete()}
            {buttonWorkoutList()}
          </form>
        </div>
      </div>
    </div>
  );
};

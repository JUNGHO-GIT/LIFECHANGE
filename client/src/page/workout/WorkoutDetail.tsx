// WorkoutDetail.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// 1. main ---------------------------------------------------------------------------------------->
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

  // 2-1. useEffect ------------------------------------------------------------------------------->
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

  // 3. flow -------------------------------------------------------------------------------------->
  const flowWorkoutDelete = async () => {
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

  // 4. logic ------------------------------------------------------------------------------------->

  // 5. table ------------------------------------------------------------------------------------->
  const tableWorkoutDetail = () => {
    return (
      <table className="table table-bordered table-hover">
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
      <button type="button" className="btn btn-danger ms-2" onClick={flowWorkoutDelete}>
        Delete
      </button>
    );
  };
  const buttonWorkoutUpdate = (_id: string) => {
    return (
      <button type="button" className="btn btn-primary ms-2" onClick={() => {
        navParam(`/workoutUpdate`, {
          state: {_id},
        });
      }}>
        Update
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
  const buttonWorkoutList = () => {
    return (
      <button type="button" className="btn btn-secondary ms-2" onClick={() => {
        navParam(`/workoutList`);
      }}>
        List
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
        <div className="col-10">
          <form className="form-inline">
            {tableWorkoutDetail()}
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

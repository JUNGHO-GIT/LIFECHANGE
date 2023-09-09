// WorkoutUpdate.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// 1. main ---------------------------------------------------------------------------------------->
export const WorkoutUpdate = () => {

  // title
  const TITLE = "Workout Update";
  // url
  const URL_WORKOUT = process.env.REACT_APP_URL_WORKOUT;
  // date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const _id = useLocation().state._id;
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

  // ---------------------------------------------------------------------------------------------->
  const workoutUpdateFlow = async () => {
    try {
      const response = await axios.put(`${URL_WORKOUT}/workoutUpdate`, {
        data: {
          _id: WORKOUT._id,
          workout_title: WORKOUT.workout_title,
          workout_content: WORKOUT.workout_content,
        },
      });
      if (response.data === "success") {
        alert("Update success");
        window.location.href = "/workoutList";
      }
      else {
        alert("Update failed");
      }
    }
    catch (error: any) {
      alert(`Error fetching workout data: ${error.message}`);
    }
  };

  // ---------------------------------------------------------------------------------------------->
  const workoutUpdateTable = () => {
    return (
      <div>
        <div className="form-floating">
          <input type="text" className="form-control"  placeholder="User ID"
          value={WORKOUT.user_id} readOnly />
          <label htmlFor="user_id">User ID</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Title" value={WORKOUT.workout_title} onChange={(e) => setWORKOUT({...WORKOUT, workout_title: e.target.value})} />
          <label htmlFor="floatingTitle">Title</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Content"
          value={WORKOUT.workout_content}
          onChange={(e) => setWORKOUT({...WORKOUT, workout_content: e.target.value})} />
          <label htmlFor="floatingContent">Content</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Workout Date"
          value={WORKOUT.workout_regdate} readOnly />
          <label htmlFor="workout_regdate">Workout Date</label>
        </div>
      </div>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonWorkoutUpdate = () => {
    return (
      <button className="btn btn-primary ms-2" type="button" onClick={workoutUpdateFlow}>
        Update
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
            {workoutUpdateTable()}
            <br/>
            {buttonWorkoutUpdate()}
          </form>
        </div>
      </div>
    </div>
  );
};
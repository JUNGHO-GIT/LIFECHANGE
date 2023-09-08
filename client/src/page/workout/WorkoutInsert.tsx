// WorkoutInsert.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";
import {WorkoutSelect} from "./WorkoutSelect";

// ------------------------------------------------------------------------------------------------>
export const WorkoutInsert = () => {

  // title
  const TITLE = "Workout Insert";
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
  const [WORKOUT, setWORKOUT] = useState({
    user_id: sessionStorage.getItem("user_id"),
    workout_part: "",
    workout_title: "",
    workout_set: "",
    workout_count: "",
    workout_kg: "",
    workout_rest: "",
    workout_time: "",
  });

  // ---------------------------------------------------------------------------------------------->
  const workoutInsertFlow = async () => {
    try {
      if (WORKOUT.workout_part === "") {
        alert("Please enter part.");
        return;
      }
      if (WORKOUT.workout_title === "") {
        alert("Please enter title.");
        return;
      }
      if (WORKOUT.workout_set === "") {
        alert("Please enter set.");
        return;
      }
      if (WORKOUT.workout_count === "") {
        alert("Please enter count.");
        return;
      }
      if (WORKOUT.workout_kg === "") {
        alert("Please enter kg.");
        return;
      }
      if (WORKOUT.workout_rest === "") {
        alert("Please enter rest.");
        return;
      }
      if (WORKOUT.workout_time === "") {
        alert("Please enter time.");
        return;
      }
      const response = await axios.post (`${URL_WORKOUT}/workoutInsert`, WORKOUT);
      if (response.data === "success") {
        alert("Insert a workout successfully");
        window.location.href = "/workoutList";
      }
      else if (response.data === "fail") {
        alert("Insert a workout failure");
      }
      else {
        throw new Error("Server responded with an error");
      }
    }
    catch (error: any) {
      alert(`Error inserting workout data: ${error.message}`);
    }
  };

  // ---------------------------------------------------------------------------------------------->
  const workoutInsertTable = () => {
    return (
      <div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="user_id"
            placeholder="User ID"
            value={WORKOUT.user_id ? WORKOUT.user_id : ""}
            onChange={(e) => {
              setWORKOUT({
                ...WORKOUT,
                user_id: e.target.value,
              });
            }}
          />
          <label htmlFor="user_id">User ID</label>
        </div>
        <div>
          <WorkoutSelect
            workoutPart={WORKOUT.workout_part}
            setWorkoutPart={(value : any) =>
              setWORKOUT({ ...WORKOUT, workout_part: value })
            }
            workoutTitle={WORKOUT.workout_title}
            setWorkoutTitle={(value: string) =>
              setWORKOUT({ ...WORKOUT, workout_title: value })
            }
          />
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="workout_set"
            placeholder="Set"
            onChange={(e) => {
              setWORKOUT({
                ...WORKOUT,
                workout_set: e.target.value,
              });
            }}
          />
          <label htmlFor="workout_set">Set</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="workout_count"
            placeholder="Count"
            onChange={(e) => {
              setWORKOUT({
                ...WORKOUT,
                workout_count: e.target.value,
              });
            }}
          />
          <label htmlFor="workout_count">Count</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="workout_kg"
            placeholder="Kg"
            onChange={(e) => {
              setWORKOUT({
                ...WORKOUT,
                workout_kg: e.target.value,
              });
            }}
          />
          <label htmlFor="workout_kg">Kg</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="workout_rest"
            placeholder="Rest"
            onChange={(e) => {
              setWORKOUT({
                ...WORKOUT,
                workout_rest: e.target.value,
              });
            }}
          />
          <label htmlFor="workout_rest">Rest</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="workout_time"
            placeholder="Time"
            onChange={(e) => {
              setWORKOUT({
                ...WORKOUT,
                workout_time: e.target.value,
              });
            }}
          />
          <label htmlFor="workout_time">Time</label>
        </div>
      </div>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonWorkoutInsert = () => {
    return (
      <button
        className="btn btn-primary"
        type="button"
        onClick={workoutInsertFlow}
      >
        Insert
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
            {workoutInsertTable()}
            <br />
            {buttonWorkoutInsert()}
          </form>
        </div>
      </div>
    </div>
  );
};

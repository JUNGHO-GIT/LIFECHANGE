// WorkoutInsert.tsx
import React, {useEffect, useState} from "react";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const WorkoutInsert = () => {

  const [WORKOUT, setWORKOUT] = useState({
    user_id : sessionStorage.getItem("user_id"),
    workout_title: "",
    workout_part: "",
    workout_set: "",
    workout_count: "",
    workout_kg: "",
    workout_rest: "",
    workout_time: "",
  });

  const koreanDate = new Date();
  koreanDate.setHours(koreanDate.getHours() + 9);
  const workout_regdate = koreanDate.toISOString().split("T")[0];

  const URL = "http://127.0.0.1:4000/workout";
  const TITLE = "Workout Insert";

  // ---------------------------------------------------------------------------------------------->
  const workoutInsertFlow = async () => {
    try {

      // 유효성 검사
      if (WORKOUT.workout_title === "") {
        alert("Please enter title.");
        return;
      }
      if (WORKOUT.workout_part === "") {
        alert("Please enter part.");
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

      const response = await axios.post(`${URL}/workoutInsert`, WORKOUT);
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
            <input type="text"
              className="form-control"
              id="user_id"
              placeholder="User ID"
              value = {WORKOUT.user_id ? WORKOUT.user_id : ""}
              onChange={(e) => {
                setWORKOUT({
                  ...WORKOUT,
                  user_id: e.target.value,
                });
              }}
            />
            <label htmlFor="user_id">User ID</label>
          </div>
          <div className="form-floating">
            <input type="text"
              className="form-control"
              id="workout_title"
              placeholder="Title"
              onChange={(e) => {
                setWORKOUT({
                  ...WORKOUT,
                  workout_title: e.target.value,
                });
              }}
          />
          <label htmlFor="workout_title">Title</label>
        </div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            id="workout_part"
            placeholder="Part"
            onChange={(e) => {
              setWORKOUT({
                ...WORKOUT,
                workout_part: e.target.value,
              });
            }}
          />
          <label htmlFor="workout_part">Part</label>
        </div>
        <div className="form-floating">
          <input type="text"
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
          <input type="text"
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
          <input type="text"
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
          <input type="text"
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
          <input type="text"
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

  // ---------------------------------------------------------------------------------------------->
  const buttonWorkoutInsert = () => {
    return (
      <button className="btn btn-primary" type="button" onClick={workoutInsertFlow}>
        Insert
      </button>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container">
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-9">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-10">
          <form  className="form-inline">
            {workoutInsertTable()}
            <br/>
            {buttonWorkoutInsert()}
          </form>
        </div>
      </div>
    </div>
  );
};
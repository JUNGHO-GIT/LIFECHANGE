// WorkoutInsert.tsx
import React, {useEffect, useState} from "react";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const WorkoutInsert = () => {

  const user_id = window.sessionStorage.getItem("user_id");
  const [workout_name, setWorkout_name] = useState("");
  const [workout_part, setWorkout_part] = useState("");
  const [workout_set, setWorkout_set] = useState("");
  const [workout_count, setWorkout_count] = useState("");
  const [workout_kg, setWorkout_kg] = useState("");
  const [workout_rest, setWorkout_rest] = useState("");
  const [workout_time, setWorkout_time] = useState("");
  const [workout_image, setWorkout_image] = useState("");
  const koreanDate = new Date();
  koreanDate.setHours(koreanDate.getHours() + 9);
  const workout_regdate = koreanDate.toISOString().split("T")[0];
  const URL = "http://127.0.0.1:4000/workout";
  const URL_USER = "http://127.0.0.1:4000/user";
  const TITLE = "Workout Insert";

  // ---------------------------------------------------------------------------------------------->
  const workoutInsertFlow = async () => {
    try {
      if (workout_name === "") {
        alert("Please enter a title");
        return;
      }
      else if (workout_content === "") {
        alert("Please enter a content");
        return;
      }
      else {
        const response = await axios.post (`${URL}/workoutInsert`, {
          user_id: user_id,
          workout_title: workout_title,
          workout_content: workout_content,
          workout_regdate: workout_regdate,
        });
        if (response.data === "success") {
          alert("Insert a workout successfully");
          window.location.href = "/workoutList";
        }
        else if (response.data === "fail") {
          alert("Insert a workout failed");
        }
        else {
          alert(`${response.data}error`);
        }
      }
    }
    catch (error: any) {
      alert(`Error fetching workout data: ${error.message}`);
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
            value={user_id}
            onChange={(e) => {
              setUserId(e.target.value);
            }}
            readOnly
          />
          <label htmlFor="user_id">User ID</label>
        </div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            placeholder="Title"
            value={workout_title}
            id="floatingTitle"
            onChange={(e) => {
              setWorkoutTitle(e.target.value);
            }}
          />
          <label htmlFor="floatingTitle">Title</label>
        </div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            placeholder="Content"
            value={workout_content}
            id="floatingContent"
            onChange={(e) => {
              setWorkoutContent(e.target.value);
            }}
          />
          <label htmlFor="floatingContent">Content</label>
        </div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            id="workout_regdate"
            placeholder="Workout Date"
            value={workout_regdate}
            readOnly
            onChange={(e) => {
              setWorkoutDate(e.target.value);
            }}
          />
          <label htmlFor="workout_regdate">Workout Date</label>
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
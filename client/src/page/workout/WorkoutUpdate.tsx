// WorkoutUpdate.tsx
import React, {useEffect, useState} from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

// ------------------------------------------------------------------------------------------------>
export const WorkoutUpdate = () => {
  const [BOARD, setBOARD] = useState<any>({});
  const _id = useLocation().state._id;
  const URL = "http://127.0.0.1:4000/workout";
  const TITLE = "Workout Update";

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchWorkoutDetail = async () => {
      try {
        const response = await axios.get(`${URL}/workoutDetail/${_id}`);
        setBOARD(response.data);
      }
      catch (error: any) {
        alert(`Error fetching workout data: ${error.message}`);
        setBOARD([]);
      }
    };
    fetchWorkoutDetail();
  }, [_id]);

  // ---------------------------------------------------------------------------------------------->
  const workoutUpdateFlow = async () => {
    try {
      const response = await axios.put(`${URL}/workoutUpdate/${_id}`, BOARD);
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
          value={BOARD.user_id} readOnly />
          <label htmlFor="user_id">User ID</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Title" value={BOARD.workout_title} onChange={(e) => setBOARD({...BOARD, workout_title: e.target.value})} />
          <label htmlFor="floatingTitle">Title</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Content"
          value={BOARD.workout_content}
          onChange={(e) => setBOARD({...BOARD, workout_content: e.target.value})} />
          <label htmlFor="floatingContent">Content</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Workout Date"
          value={BOARD.workout_regdate} readOnly />
          <label htmlFor="workout_regdate">Workout Date</label>
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const buttonWorkoutUpdate = () => {
    return (
      <button className="btn btn-primary ms-2" type="button" onClick={workoutUpdateFlow}>
        Update
      </button>
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
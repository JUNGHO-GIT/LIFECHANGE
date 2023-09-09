// WorkoutUpdate.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";
import {WorkoutSelect} from "./WorkoutSelect";

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

  // 4. logic ------------------------------------------------------------------------------------->
  const flowWorkoutUpdate = async () => {
    try {
      const response = await axios.put(`${URL_WORKOUT}/workoutUpdate`, {
        data: {
          _id : _id,
          WORKOUT : WORKOUT,
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

  // 5. table ------------------------------------------------------------------------------------->
  const tableWorkoutUpdate = () => {
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
            value={WORKOUT.workout_set ? WORKOUT.workout_set : ""}
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
            value={WORKOUT.workout_count ? WORKOUT.workout_count : ""}
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
            value={WORKOUT.workout_kg ? WORKOUT.workout_kg : ""}
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
            value={WORKOUT.workout_rest ? WORKOUT.workout_rest : ""}
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
            value={WORKOUT.workout_time ? WORKOUT.workout_time : ""}
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
  const buttonWorkoutUpdate = () => {
    return (
      <button className="btn btn-primary ms-2" type="button" onClick={flowWorkoutUpdate}>
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
            {tableWorkoutUpdate()}
            <br/>
            {buttonWorkoutUpdate()}
            {buttonRefreshPage()}
          </form>
        </div>
      </div>
    </div>
  );
};
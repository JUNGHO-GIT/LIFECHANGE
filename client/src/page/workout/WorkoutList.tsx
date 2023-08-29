// WorkoutList.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const WorkoutList = () => {

  const [WORKOUT_LIST, setWORKOUT_LIST] = useState<[]>([]);
  const navParam = useNavigate();
  const koreanDate = new Date();
  koreanDate.setHours(koreanDate.getHours() + 9);
  const [workout_regdate, setWorkout_regdate] = useState(koreanDate.toISOString().split("T")[0]);
  const user_id = sessionStorage.getItem("user_id");
  const URL = "http://127.0.0.1:4000/workout";
  const TITLE = "Workout List";

  // ---------------------------------------------------------------------------------------------->
  const datePicker = () => {
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

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchWorkoutList = async () => {
      try {
        const response = await axios.get (`${URL}/workoutList`, {
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

  // ---------------------------------------------------------------------------------------------->
  const workoutListTable = () => {

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
              <td><a onClick={() => buttonWorkoutDetail(index._id)} className="text-hover">
                {index.user_id}
              </a></td>
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
  const buttonWorkoutDetail = (_id: string) => {
    navParam(`/workoutDetail`, {
      state: {
        _id
      }
    });
  };
  const buttonRefreshPage = () => {
    return (
      <Link to="/workoutList">
        <button type="button" className="btn btn-success ms-2">Refresh</button>
      </Link>
    );
  };
  const buttonWorkoutInsert = () => {
    return (
      <Link to="/workoutInsert">
        <button type="button" className="btn btn-primary ms-2">Insert</button>
      </Link>
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
        <div className="col-10">
          <form className="form-inline">
            {workoutListTable()}
            <br/>
            {buttonRefreshPage()}
            {buttonWorkoutInsert()}
          </form>
        </div>
      </div>
    </div>
  );
};
// WorkoutList.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const WorkoutList = () => {
  const [BOARD_LIST, setBOARD_LIST] = useState<[]>([]);
  const navParam = useNavigate();
  const URL = "http://127.0.0.1:4000/workout";
  const TITLE = "Workout List";

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchWorkoutList = async () => {
      try {
        const response = await axios.get (`${URL}/workoutList`);
        setBOARD_LIST(response.data);
      }
      catch (error: any) {
        alert(`Error fetching workout data: ${error.message}`);
        setBOARD_LIST([]);
      }
    };
    fetchWorkoutList();
  }, []);

  // ---------------------------------------------------------------------------------------------->
  const workoutListTable = () => {
    return (
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {BOARD_LIST.map((index : any) => (
            <tr key={index}>
              <td>
                <a onClick={() => buttonWorkoutDetail(index._id)} className="text-hover">
                  {index.user_id}
                </a>
              </td>
              <td>{index.workout_title}</td>
              <td>{index.workout_regdate}</td>
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
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-9">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-10">
          <form className="form-inline">
            {workoutListTable()}
            {buttonRefreshPage()}
            {buttonWorkoutInsert()}
          </form>
        </div>
      </div>
    </div>
  );
};
// SleepList.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const SleepList = () => {

  const [SLEEP_LIST, setSLEEP_LIST] = useState<[]>([]);
  const navParam = useNavigate();
  const URL = "http://127.0.0.1:4000/sleep";
  const TITLE = "Sleep List";

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchSleepList = async () => {
      try {
        const response = await axios.get (`${URL}/sleepList`);
        setSLEEP_LIST(response.data);
      }
      catch (error: any) {
        alert(`Error fetching sleep data: ${error.message}`);
        setSLEEP_LIST([]);
      }
    };
    fetchSleepList();
  }, []);

  // ---------------------------------------------------------------------------------------------->
  const sleepListTable = () => {
    return (
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Night</th>
            <th>Morning</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {SLEEP_LIST.map((index : any) => (
            <tr key={index}>
              <td>
                <a onClick={() => {
                  buttonSleepDetail(index.sleep_title);
                }}>
                {index.sleep_title}
                </a>
              </td>
              <td>{index.sleep_night}</td>
              <td>{index.sleep_morning}</td>
              <td>{index.sleep_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const buttonSleepDetail = (_id: string) => {
    navParam(`/sleepDetail`, {
      state: {
        _id
      }
    });
  };
  const buttonRefreshPage = () => {
    return (
      <Link to="/sleepList">
        <button type="button" className="btn btn-success ms-2">Refresh</button>
      </Link>
    );
  };
  const buttonSleepInsert = () => {
    return (
      <Link to="/sleepInsert">
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
        <div className="col-10">
          <form className="form-inline">
            {sleepListTable()}
            {buttonRefreshPage()}
            {buttonSleepInsert()}
          </form>
        </div>
      </div>
    </div>
  );
};
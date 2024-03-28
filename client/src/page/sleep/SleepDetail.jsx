// SleepDetail.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment-timezone";
import {useDeveloperMode} from "../../assets/js/useDeveloperMode.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const TITLE = "Sleep Detail";
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const navParam = useNavigate();
  const location = useLocation();
  const _id = location.state._id;
  const {log} = useDeveloperMode();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [SLEEP, setSLEEP] = useState ({});

  // 2-2. useStorage ------------------------------------------------------------------------------>

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchSleepDetail = async () => {
      try {
        const response = await axios.get(`${URL_SLEEP}/sleep/detail`, {
          params: {
            _id: _id,
          },
        });
        setSLEEP(response.data);
        log("SLEEP : " + JSON.stringify(response.data));
      }
      catch (e) {
        alert(`Error fetching sleep data: ${e.message}`);
        setSLEEP([]);
      }
    };
    fetchSleepDetail();
  }, [_id]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSleepDelete = async () => {
    try {
      const confirm = window.confirm("Are you sure you want to delete?");
      if (!confirm) {
        return;
      }
      else {
        const response = await axios.delete(`${URL_SLEEP}/sleepDelete`, {
          params: {
            _id : _id,
          },
        });
        if (response.data === "success") {
          alert("Delete success");
          navParam(`/sleep/ist`);
        }
        else {
          alert("Delete failed");
        }
      }
    }
    catch (e) {
      alert(`Error fetching sleep data: ${e.message}`);
    }
  };

  // 4. view -------------------------------------------------------------------------------------->

  // 5. table ------------------------------------------------------------------------------------->
  const tableSleepInsert = () => {
    return (
      <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
            <th>Day</th>
            <th>Night</th>
            <th>Morning</th>
            <th>Time</th>
            <th>regdate</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{SLEEP.sleep_day}</td>
            <td>{SLEEP.sleep_start}</td>
            <td>{SLEEP.sleep_end}</td>
            <td>{SLEEP.sleep_time}</td>
            <td>{SLEEP.sleep_regdate}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonSleepDelete = () => {
    return (
      <button type="button" className="btn btn-sm btn-danger ms-2" onClick={flowSleepDelete}>
        Delete
      </button>
    );
  };
  const buttonSleepUpdate = (_id) => {
    return (
      <button type="button" className="btn btn-sm btn-primary ms-2" onClick={() => {
        navParam(`/sleep/update`, {
          state: {_id},
        });
      }}>
        Update
      </button>
    );
  };
  const buttonRefreshPage = () => {
    return (
      <button type="button" className="btn btn-sm btn-success ms-2" onClick={() => {
        navParam(0);
      }}>
        Refresh
      </button>
    );
  };
  const buttonSleepList = () => {
    return (
      <button type="button" className="btn btn-sm btn-secondary ms-2" onClick={() => {
        navParam(`/sleep/list`);
      }}>
        List
      </button>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-7">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">
          {tableSleepInsert()}
          <br />
          {buttonSleepDelete()}
          {buttonSleepUpdate(SLEEP._id)}
          {buttonRefreshPage()}
          {buttonSleepList()}
        </div>
        </div>
      </div>
    </div>
  );
};
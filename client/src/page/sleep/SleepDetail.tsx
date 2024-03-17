// SleepDetail.tsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment-timezone";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";

// ------------------------------------------------------------------------------------------------>
export const SleepDetail = () => {

  // 1-1. title
  const TITLE = "Sleep Detail";
  // 1-2. url
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  // 1-3. date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // 1-4. hook
  const navParam = useNavigate();
  const location = useLocation();
  // 1-5. val
  const _id = location.state._id;
  const user_id = window.sessionStorage.getItem("user_id");
  // 1-6. log
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>

  // 2-2. useState -------------------------------------------------------------------------------->
  const [sleepDay, setSleepDay] = useState(koreanDate);
  const [SLEEP, setSLEEP] = useState<any> ({});

  // 2-3. useEffect -------------------------------------------------------------------------------
  useEffect(() => {
    const fetchSleepDetail = async () => {
      try {
        const response = await axios.get(`${URL_SLEEP}/sleepDetail`, {
          params: {
            _id: _id,
          },
        });
        setSLEEP(response.data);
        log("SLEEP : " + JSON.stringify(response.data));
      }
      catch (error:any) {
        alert(`Error fetching sleep data: ${error.message}`);
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
          navParam(`/sleepListDay`);
        }
        else {
          alert("Delete failed");
        }
      }
    }
    catch (error:any) {
      alert(`Error fetching sleep data: ${error.message}`);
    }
  };

  // 4. view -------------------------------------------------------------------------------------->
  const viewSleepDay = () => {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        popperPlacement="bottom"
        selected={new Date(sleepDay)}
        onChange={(date:any) => {
          setSleepDay(moment(date).format("YYYY-MM-DD"));
        }}
      />
    );
  };

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
            <td>{SLEEP.sleepDay}</td>
            <td>{SLEEP.sleep_night}</td>
            <td>{SLEEP.sleep_morning}</td>
            <td>{SLEEP.sleep_time}</td>
            <td>{SLEEP.sleep_regdate}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonSleepDelete = () => {
    return (
      <button type="button" className="btn btn-sm btn-danger ms-2" onClick={flowSleepDelete}>
        Delete
      </button>
    );
  };
  const buttonSleepUpdate = (_id: string) => {
    return (
      <button type="button" className="btn btn-sm btn-primary ms-2" onClick={() => {
        navParam(`/sleepUpdate`, {
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
        navParam(`/sleepListDay`);
      }}>
        List
      </button>
    );
  };

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="container">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-7">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-10">
          <h1 className="mb-3 fw-5">
            <span className="ms-4">{viewSleepDay()}</span>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-10">
          {tableSleepInsert()}
          <br />
          {buttonSleepDelete()}
          {buttonSleepUpdate(SLEEP._id)}
          {buttonRefreshPage()}
          {buttonSleepList()}
        </div>
      </div>
    </div>
  );
};
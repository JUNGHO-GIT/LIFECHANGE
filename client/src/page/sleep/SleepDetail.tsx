// SleepDetail.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// 1. main ---------------------------------------------------------------------------------------->
export const SleepDetail = () => {

  // title
  const TITLE = "Sleep Detail";
  // url
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  // date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const _id = location.state._id;
  const user_id = window.sessionStorage.getItem("user_id");
  // state
  const [sleep_day, setSleep_day] = useState(koreanDate);
  const [SLEEP, setSLEEP] = useState<any> ({
    _id : "",
    user_id : user_id,
    sleep_title : "",
    sleep_night : "",
    sleep_morning : "",
    sleep_time : "",
    sleep_day : sleep_day,
    sleep_duration: "",
    sleep_regdate : koreanDate
  });

  // 2-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchSleepDetail = async () => {
      try {
        const response = await axios.get(`${URL_SLEEP}/sleepDetail`, {
          params: {
            _id: _id,
          },
        });
        setSLEEP(response.data);
      }
      catch (error: any) {
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
            _id: _id,
          },
        });
        if (response.data === "success") {
          window.location.href = "/";
        }
        else {
          alert("Delete failed");
        }
      }
    }
    catch (error: any) {
      alert(`Error fetching sleep data: ${error.message}`);
    }
  };

  // 4. logic ------------------------------------------------------------------------------------->
  const viewSleepDay = () => {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        popperPlacement="bottom"
        selected={new Date(sleep_day)}
        onChange={(date: any) => {
          setSleep_day(moment(date).format("YYYY-MM-DD"));
        }}
      />
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableSleepInsert = () => {
    return (
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Day</th>
            <th>Night</th>
            <th>Morning</th>
            <th>Time</th>
            <th>regdate</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{SLEEP.sleep_title}</td>
            <td>{SLEEP.sleep_day}</td>
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
      <button type="button" className="btn btn-danger ms-2" onClick={flowSleepDelete}>
        Delete
      </button>
    );
  };
  const buttonSleepUpdate = (_id: string) => {
    return (
      <button type="button" className="btn btn-primary ms-2" onClick={() => {
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
      <button type="button" className="btn btn-success ms-2" onClick={() => {
        window.location.reload();
      }}>
        Refresh
      </button>
    );
  };
  const buttonSleepList = () => {
    return (
      <button type="button" className="btn btn-secondary ms-2" onClick={() => {
        navParam(`/sleepList`);
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
          <h1 className="mb-3 fw-9">{TITLE}</h1>
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
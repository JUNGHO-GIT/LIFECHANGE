// SleepDetail.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const SleepDetail = () => {

  // 1. title
  const TITLE = "Sleep Detail";
  // 2. url
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  // 3. date
  const koreanDate = moment.tz('Asia/Seoul').format('YYYY-MM-DD').toString();
  // 4. hook
  const navParam = useNavigate();
  const location = useLocation();
  // 5. val
  const user_id = window.sessionStorage.getItem("user_id");
  const _id = location.state._id;
  // 6. state
  const [sleep_regdate, setSleep_regdate] = useState(koreanDate);
  const [SLEEP, setSLEEP] = useState<any>({});

  // ---------------------------------------------------------------------------------------------->
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

  // ---------------------------------------------------------------------------------------------->
  const viewDate = () => {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        popperPlacement="bottom"
        selected={new Date(sleep_regdate)}
        onChange={(date: any) => {
          setSleep_regdate(moment(date).format("YYYY-MM-DD").toString());
        }}
      />
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const sleepDetailTable = () => {
    return (
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Night</th>
            <th>Morning</th>
            <th>Time</th>
            <th>regdate</th>
            <th>week</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{SLEEP.sleep_title}</td>
            <td>{SLEEP.sleep_night}</td>
            <td>{SLEEP.sleep_morning}</td>
            <td>{SLEEP.sleep_time}</td>
            <td>{SLEEP.sleep_regdate}</td>
            <td>{SLEEP.sleep_week}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const sleepDeleteFlow = async () => {
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
        } else {
          alert("Delete failed");
        }
      }
    }
      catch (error: any) {
      alert(`Error fetching sleep data: ${error.message}`);
    }
  };

  // ---------------------------------------------------------------------------------------------->
  const buttonSleepDelete = () => {
    return (
      <button
        type="button"
        className="btn btn-danger ms-2"
        onClick={sleepDeleteFlow}
      >
        Delete
      </button>
    );
  };
  const buttonSleepUpdate = (_id: string) => {
    const navButton = () => {
      navParam(`/sleepUpdate`, {
        state: {
          _id,
        },
      });
    };
    return (
      <button
        type="button"
        className="btn btn-primary ms-2"
        onClick={navButton}
      >
        Update
      </button>
    );
  };
  const buttonRefreshPage = () => {
    return (
      <Link to="/sleepDetail">
        <button type="button" className="btn btn-success ms-2">
          Refresh
        </button>
      </Link>
    );
  };
  const buttonSleepList = () => {
    return (
      <Link to="/sleepList">
        <button type="button" className="btn btn-secondary ms-2">
          List
        </button>
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
          <h1 className="mb-3 fw-5">
            <span className="ms-4">{viewDate()}</span>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-10">
          {sleepDetailTable()}
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
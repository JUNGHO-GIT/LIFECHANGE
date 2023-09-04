// SleepDetail.tsx
import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const SleepDetail = () => {

  const [SLEEP, setSLEEP] = useState<any>({});
  const location = useLocation();
  const navParam = useNavigate();
  const user_id = window.sessionStorage.getItem("user_id");
  const _id = useLocation().state._id;
  const koreanDate = new Date();
  koreanDate.setHours(koreanDate.getHours() + 9);
  const sleep_regdate = koreanDate.toISOString().split("T")[0];
  const sleep_title = location.state.sleep_title;
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const TITLE = "Sleep Detail";

  // ---------------------------------------------------------------------------------------------->
  const datePicker = () => {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        selected={new Date(sleep_regdate)}
        popperPlacement="bottom"
        onChange={(date: any) => {
          const selectedDate = date.toISOString().split("T")[0];
        }}
      />
    );
  };

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
  const sleepDetailTable = () => {
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
          <tr>
            <td>{SLEEP.sleep_title}</td>
            <td>{SLEEP.sleep_night}</td>
            <td>{SLEEP.sleep_morning}</td>
            <td>{SLEEP.sleep_time}</td>
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
    } catch (error: any) {
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

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-9">{TITLE}</h1>
          <h1 className="mb-3 fw-9">
            {TITLE}
            <span className="ms-4">({sleep_title})</span>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-10">
          <h1 className="mb-3 fw-5">
            <span className="ms-4">{datePicker()}</span>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-10">
          {sleepDetailTable()}
          <br />
          {buttonSleepDelete()}
        </div>
      </div>
    </div>
  );
};
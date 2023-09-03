// SleepInsert.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import TimePicker from 'react-time-picker';

// ------------------------------------------------------------------------------------------------>
export const SleepInsert = () => {

  const koreanDate = new Date();
  koreanDate.setHours(koreanDate.getHours() + 9);
  const sleep_regdate = koreanDate.toISOString().split("T")[0];

  const [SLEEP, setSLEEP] = useState({
    user_id : window.sessionStorage.getItem("user_id"),
    sleep_title : sleep_regdate,
    sleep_night : "",
    sleep_morning : "",
    sleep_time : "",
  });

  const URL_SLEEP = "http://127.0.0.1:4000/sleep";
  const URL_USER = "http://127.0.0.1:4000/user";
  const TITLE = "Sleep Insert";

  // ---------------------------------------------------------------------------------------------->
  const sleepInsertFlow = async () => {
    try {
      if (SLEEP.sleep_night === "") {
        alert("Please enter a night");
        return;
      }
      else if (SLEEP.sleep_morning === "") {
        alert("Please enter a morning");
        return;
      }
      else {
        const response = await axios.post (`${URL_SLEEP}/sleepInsert`, SLEEP);
        if (response.data === "success") {
          alert("Insert a sleep successfully");
          window.location.href = "/sleepList";
        }
        else {
          throw new Error("Server responded with an error");
        }
      }
    }
    catch (error: any) {
      alert(`Error fetching user data: ${error.message}`);
    }
  };

  // ---------------------------------------------------------------------------------------------->
  const sleepInsertTable = () => {
    return (
      <div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            id="user_id"
            placeholder="User ID"
            value={SLEEP.user_id ? SLEEP.user_id : ""}
            onChange={(e) => setSLEEP({...SLEEP, user_id: e.target.value})}
            disabled
          />
          <label htmlFor="user_id">User ID</label>
        </div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            id="sleep_title"
            placeholder="Sleep Title"
            value={SLEEP.sleep_title ? SLEEP.sleep_title : ""}
            onChange={(e) => setSLEEP({...SLEEP, sleep_title: e.target.value})}
            disabled
          />
          <label htmlFor="sleep_title">Sleep Title</label>
        </div>
        <div className="form-floating">
          <TimePicker
            onChange={(time:any) => setSLEEP({...SLEEP, sleep_night: time})}
            value={SLEEP.sleep_night}
          />
        </div>
        <div>
          <TimePicker
            onChange={(time:any) => setSLEEP({...SLEEP, sleep_morning: time})}
            value={SLEEP.sleep_morning}
          />
        </div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            id="sleep_time"
            placeholder="Sleep Time"
            value={SLEEP.sleep_time ? SLEEP.sleep_time : ""}
            onChange={(e) => setSLEEP({...SLEEP, sleep_time: e.target.value})}
            disabled
          />
          <label htmlFor="sleep_time">Sleep Time</label>
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const buttonSleepInsert = () => {
    return (
      <button className="btn btn-primary" type="button" onClick={sleepInsertFlow}>
        Insert
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
          <form  className="form-inline">
            {sleepInsertTable()}
            <br/>
            {buttonSleepInsert()}
          </form>
        </div>
      </div>
    </div>
  );
};
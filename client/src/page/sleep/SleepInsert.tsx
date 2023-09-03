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
    sleep_night : "00:00",
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
        <TimePicker
          onChange={(e) => setSLEEP({...SLEEP, sleep_morning : e || ""})}
          value={SLEEP.sleep_night || ""}
          disableClock={true}
        />
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
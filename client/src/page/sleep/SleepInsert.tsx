// SleepInsert.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const SleepInsert = () => {

  // 1. title
  const TITLE = "Sleep Insert";
  // 2. url
  const URL_SLEEP = "http://127.0.0.1:4000/sleep";
  const URL_USER = "http://127.0.0.1:4000/user";
  // 3. date
  const koreanDate = moment.tz('Asia/Seoul').format('YYYY-MM-DD').toString();
  // 4. hook
  const navParam = useNavigate();
  const location = useLocation();
  // 5. val
  const user_id = window.sessionStorage.getItem("user_id");
  // 6. state
  const [SLEEP, setSLEEP] = useState ({
    user_id: window.sessionStorage.getItem("user_id"),
    sleep_regdate : koreanDate,
    sleep_night: "00:00",
    sleep_morning: "00:00",
    sleep_time: "00:00",
    sleep_title : koreanDate,
  });

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const calcSleepTime = () => {
      const nightDate = new Date(`${SLEEP.sleep_regdate}T${SLEEP.sleep_night}:00Z`);
      const morningDate = new Date(`${SLEEP.sleep_regdate}T${SLEEP.sleep_morning}:00Z`);

      // 다음 날까지의 수면 시간을 고려
      if (morningDate < nightDate) {
        morningDate.setDate(morningDate.getDate() + 1);
      }

      const diff = morningDate.getTime() - nightDate.getTime();
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);

      setSLEEP ({
        ...SLEEP,
        sleep_time: `${String(hours).padStart(2, "0")}:${String(
          minutes
        ).padStart(2, "0")}`,
      });
    };
    calcSleepTime();
  }, [SLEEP.sleep_night, SLEEP.sleep_morning, SLEEP.sleep_regdate]);

  // ---------------------------------------------------------------------------------------------->
  const datePicker = () => {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        selected={new Date(SLEEP.sleep_regdate)}
        popperPlacement="bottom"
        onChange={(date: any) => {
          const selectedDate = moment(date).format("YYYY-MM-DD");
          setSLEEP ({
            ...SLEEP,
            sleep_title: selectedDate,
            sleep_regdate: selectedDate
          });
        }}
      />
    );
  };

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
        {/** user_id **/}
        <div className="d-center">
          <span className="form-label me-4">User ID</span>
          <input
            type="text"
            className="form-control"
            id="user_id"
            name="user_id"
            value={SLEEP.user_id || ""}
            onChange={(event: any) => {
              setSLEEP({ ...SLEEP, user_id: event.target.value });
            }}
            readOnly
          />
        </div>
        <br />
        {/** title **/}
        <div className="d-center">
          <span className="form-label me-4">Title</span>
          <input
            type="text"
            className="form-control"
            id="sleep_title"
            name="sleep_title"
            value={SLEEP.sleep_title}
            onChange={(event: any) => {
              setSLEEP({ ...SLEEP, sleep_title: event.target.value });
            }}
            readOnly
          />
        </div>
        <br />
        {/** night **/}
        <div className="d-center">
          <span className="form-label me-4">Night</span>
          <TimePicker
            id="sleep_night"
            name="sleep_night"
            onChange={(event: any) => {
              setSLEEP({ ...SLEEP, sleep_night: event });
            }}
            value={SLEEP.sleep_night}
            disableClock={false}
            clockIcon={null}
            format="HH:mm:ss"
            locale="ko"
          />
        </div>
        <br />
        {/** morning **/}
        <div className="d-center">
          <span className="form-label me-4">Morning</span>
          <TimePicker
            id="sleep_morning"
            name="sleep_morning"
            onChange={(event: any) => {
              setSLEEP({ ...SLEEP, sleep_morning: event });
            }}
            value={SLEEP.sleep_morning}
            disableClock={false}
            clockIcon={null}
            format="HH:mm:ss"
            locale="ko"
          />
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const buttonSleepInsert = () => {
    return (
      <button
        className="btn btn-primary"
        type="button"
        onClick={sleepInsertFlow}
      >
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
        <div className="col-12">
          <h1 className="mb-3 fw-5">
            <span className="ms-4">{datePicker()}</span>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-10">
          <form className="form-inline">
            {sleepInsertTable()}
            <br />
            {buttonSleepInsert()}
          </form>
        </div>
      </div>
    </div>
  );
};

// SleepInsert.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// 1. main ---------------------------------------------------------------------------------------->
export const SleepInsert = () => {

  // title
  const TITLE = "Sleep Insert";
  // url
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  // date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");
  // useState
  const [SLEEP, setSLEEP] = useState<any>({});
  const [sleepDay, setSleepDay] = useState<string>(koreanDate);

  // 2-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setSLEEP({
      ...SLEEP,
      sleepDay : sleepDay
    });
  }, [sleepDay]);

  // 2-2. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const setSleepTime = () => {
      if (SLEEP.sleep_night && SLEEP.sleep_morning) {
        const nightDate = new Date(`${SLEEP.sleepDay}T${SLEEP.sleep_night}:00Z`);
        const morningDate = new Date(`${SLEEP.sleepDay}T${SLEEP.sleep_morning}:00Z`);

        if (morningDate < nightDate) {
          morningDate.setDate(morningDate.getDate() + 1);
        }

        const diff = morningDate.getTime() - nightDate.getTime();
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);

        setSLEEP((prevSleep:any) => ({
          ...prevSleep,
          sleep_time: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
        }));
      }
    };
    setSleepTime();
  }, [SLEEP.sleep_night, SLEEP.sleep_morning, SLEEP.sleepDay]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSleepInsert = async () => {
    if (SLEEP.sleep_night === "") {
      alert("Please enter a night");
      return;
    }
    else if (SLEEP.sleep_morning === "") {
      alert("Please enter a morning");
      return;
    }
    const response = await axios.post (`${URL_SLEEP}/sleepInsert`, {
      user_id : user_id,
      SLEEP : SLEEP
    });
    if (response.data === "success") {
      alert("Insert a sleep successfully");
      navParam("/sleepListDay");
    }
    else if (response.data === "fail") {
      alert("Insert a sleep failure");
    }
    else {
      throw new Error("Server responded with an error");
    }
  };

  // 4. logic ------------------------------------------------------------------------------------->
  const viewSleepDay = () => {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        popperPlacement="bottom"
        selected={new Date(sleepDay)}
        onChange={(date:any) => {
          setSleepDay(moment(date).format("YYYY-MM-DD").toString());
        }}
      />
    );
  };

  // 5-1. table ----------------------------------------------------------------------------------->
  const tableSleepInsert = () => {
    return (
      <div>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">ID</span>
              <input
                type="text"
                className="form-control"
                id="user_id"
                name="user_id"
                placeholder="ID"
                value={user_id ? user_id : ""}
                readOnly
                onChange={(e:any) => {
                  setSLEEP({ ...SLEEP, user_id: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">Day</span>
              <input
                readOnly
                type="text"
                className="form-control"
                id="sleepDay"
                name="sleepDay"
                placeholder="Day"
                value={SLEEP?.sleepDay}
                onChange={(e:any) => {
                  setSleepDay(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">Night</span>
              <TimePicker
                id="sleep_night"
                name="sleep_night"
                className="form-control"
                value={SLEEP.sleep_night}
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                onChange={(e:any) => {
                  setSLEEP({ ...SLEEP, sleep_night: e });
                }}
              />
            </div>
          </div>
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">Morning</span>
              <TimePicker
                id="sleep_morning"
                name="sleep_morning"
                className="form-control"
                value={SLEEP.sleep_morning}
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                onChange={(e:any) => {
                  setSLEEP({ ...SLEEP, sleep_morning: e });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonSleepInsert = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary" onClick={flowSleepInsert}>
        Insert
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

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="container">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-7">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-5">
            <span>{viewSleepDay()}</span>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5 mb-20">
        <div className="col-12">
          {tableSleepInsert()}
          <br />
          {buttonSleepInsert()}
          {buttonRefreshPage()}
        </div>
      </div>
    </div>
  );
};

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
  const URL_USER = process.env.REACT_APP_URL_USER;
  // date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");
  // state
  const [sleep_day, setSleep_day] = useState(koreanDate);
  const [SLEEP, setSLEEP] = useState<any>({});

  // 2-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const setSleepDay = () => {
      setSLEEP({ ...SLEEP, sleep_day: sleep_day });
    };
    setSleepDay();
  }, [sleep_day]);

  useEffect(() => {
    const setSleepTime = () => {
      if (SLEEP.sleep_night && SLEEP.sleep_morning) {
        const nightDate = new Date(`${SLEEP.sleep_day}T${SLEEP.sleep_night}:00Z`);
        const morningDate = new Date(`${SLEEP.sleep_day}T${SLEEP.sleep_morning}:00Z`);

        if (morningDate < nightDate) {
          morningDate.setDate(morningDate.getDate() + 1);
        }

        const diff = morningDate.getTime() - nightDate.getTime();
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);

        setSLEEP((prevSleep: any) => ({
          ...prevSleep,
          sleep_time: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
        }));
      }
    };
    setSleepTime();
  }, [SLEEP.sleep_night, SLEEP.sleep_morning, SLEEP.sleep_day]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSleepInsert = async () => {
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
        const response = await axios.post (`${URL_SLEEP}/sleepInsert`, {
          user_id : user_id,
          SLEEP : SLEEP
        });
        if (response.data === "success") {
          alert("Insert a sleep successfully");
          navParam("/sleepListSelect");
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

  // 4. logic ------------------------------------------------------------------------------------->
  const viewSleepDay = () => {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        popperPlacement="bottom"
        selected={new Date(sleep_day)}
        onChange={(date:any) => {
          setSleep_day(moment(date).format("YYYY-MM-DD").toString());
        }}
      />
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableSleepInsert = () => {
    return (
      <div>
        <div className="d-center">
          <span className="form-label me-4">User ID</span>
          <input
            type="text"
            className="form-control"
            id="user_id"
            name="user_id"
            value={user_id ? user_id : ""}
            onChange={(event: any) => {
              setSLEEP({ ...SLEEP, user_id: event.target.value });
            }}
            readOnly
          />
        </div>
        <br />
        <div className="d-center">
          <span className="form-label me-4">Title</span>
          <input
            type="text"
            className="form-control"
            id="sleep_title"
            name="sleep_title"
            value={SLEEP.sleep_title || ""}
            onChange={(event: any) => {
              setSLEEP({ ...SLEEP, sleep_title: event.target.value });
            }}
            placeholder="Title"
          />
        </div>
        <br />
        <div className="d-center">
          <span className="form-label me-4">Day</span>
          <input
            type="text"
            className="form-control"
            id="sleep_day"
            name="sleep_day"
            value={SLEEP.sleep_day || ""}
            onChange={(event: any) => {
              setSLEEP({ ...SLEEP, sleep_day: event.target.value });
            }}
            placeholder="Day"
            readOnly
          />
        </div>
        <br />
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
            format="HH:mm"
            locale="ko"
          />
        </div>
        <br />
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
            format="HH:mm"
            locale="ko"
          />
        </div>
      </div>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonSleepInsert = () => {
    return (
      <button className="btn btn-primary" type="button" onClick={flowSleepInsert}>
        Insert
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

  // 7. return ------------------------------------------------------------------------------------>
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
            <span className="ms-4">{viewSleepDay()}</span>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-8">
          <form className="form-inline">
            {tableSleepInsert()}
            <br />
            {buttonSleepInsert()}
            {buttonRefreshPage()}
          </form>
        </div>
      </div>
    </div>
  );
};

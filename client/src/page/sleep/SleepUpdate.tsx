// SleepUpdate.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// 1. main ---------------------------------------------------------------------------------------->
export const SleepUpdate = () => {

  // title
  const TITLE = "Sleep Update";
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
  const [SLEEP, setSLEEP] = useState<any>({
    _id : "",
    user_id : user_id,
    sleep_title : "",
    sleep_night : "",
    sleep_morning : "",
    sleep_time : "",
    sleep_day : "",
    sleep_duration: "",
    sleep_regdate : koreanDate,
    sleep_update : "",
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

  useEffect(() => {
    const setSleepTime = () => {
      const nightDate = new Date(`${SLEEP.sleep_day}T${SLEEP.sleep_night}:00Z`);
      const morningDate = new Date(`${SLEEP.sleep_day}T${SLEEP.sleep_morning}:00Z`);

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
    setSleepTime();
  }, [SLEEP.sleep_night, SLEEP.sleep_morning, SLEEP.sleep_day]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSleepUpdate = async () => {
    try {
      const response = await axios.put(`${URL_SLEEP}/sleepUpdate`, {
        _id : _id,
        sleep_morning : SLEEP.sleep_morning,
        sleep_night : SLEEP.sleep_night,
        sleep_time : SLEEP.sleep_time,
      });
      if (response.data === "success") {
        alert("Update success");
        window.location.href = "/sleepList";
      }
      else {
        alert("Update failed");
      }
    }
    catch (error: any) {
      alert(`Error updating sleep data: ${error.message}`);
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

  // 5. table ------------------------------------------------------------------------------------>
  const tableSleepList = () => {
    return (
      <div>
        {/** user_id **/}
        <div className="d-center">
          <span className="form-label me-4">User ID</span>
          <input type="text" className="form-control"  placeholder="User ID"
          value={SLEEP.user_id} readOnly />
        </div>
        {/** sleep_title **/}
        <div className="d-center">
          <span className="form-label me-4">Sleep Title</span>
          <input type="text" className="form-control"  placeholder="Sleep Title"
          value={SLEEP.sleep_title} readOnly />
        </div>
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

  // 6. button ------------------------------------------------------------------------------------>
  const buttonSleepUpdate = () => {
    return (
      <button className="btn btn-primary ms-2" type="button" onClick={flowSleepUpdate}>
        Update
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
        <div className="col-10">
          <form className="form-inline">
            {tableSleepList()}
            <br/>
            {buttonSleepUpdate()}
          </form>
        </div>
      </div>
    </div>
  );
};
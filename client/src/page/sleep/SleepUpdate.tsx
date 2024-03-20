// SleepUpdate.tsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";

// ------------------------------------------------------------------------------------------------>
export const SleepUpdate = () => {

  // 1. components -------------------------------------------------------------------------------->
  const TITLE = "Sleep Update";
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  const navParam = useNavigate();
  const location = useLocation();
  const _id = location.state._id;
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>

  // 2-2. useState -------------------------------------------------------------------------------->
  const [sleepDay, setSleepDay] = useState(koreanDate);
  const [SLEEP, setSLEEP] = useState<any> ({});

  // 2-3. useEffect ------------------------------------------------------------------------------->
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

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const setSleepTime = () => {
      const nightDate = new Date(`${SLEEP.sleepDay}T${SLEEP.sleep_night}:00Z`);
      const morningDate = new Date(`${SLEEP.sleepDay}T${SLEEP.sleep_morning}:00Z`);

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
  }, [SLEEP.sleep_night, SLEEP.sleep_morning, SLEEP.sleepDay]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSleepUpdate = async () => {
    try {
      const response = await axios.put(`${URL_SLEEP}/sleepUpdate`, {
        _id : _id,
        SLEEP : SLEEP,
      });
      if (response.data === "success") {
        alert("Update success");
        navParam(`/sleepListDay`);
      }
      else {
        alert("Update failed");
      }
    }
    catch (error:any) {
      alert(`Error updating sleep data: ${error.message}`);
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

  // 5. table ------------------------------------------------------------------------------------>
  const tableSleepList = () => {
    return (
      <div>
        <div className="d-center">
          <span className="me-4">ID</span>
          <input
            type="text"
            className="form-control"
            id="user_id"
            name="user_id"
            value={SLEEP.user_id}
            readOnly
          />
        </div>
        <br />
        <div className="d-center">
          <span className="me-4">Day</span>
          <input
            type="text"
            className="form-control"
            id="sleepDay"
            name="sleepDay"
            value={SLEEP.sleepDay}
            placeholder="Day"
            readOnly
          />
        </div>
        <br />
        <div className="d-center input-group-prepend">
          <span className="me-4">Night</span>
          <TimePicker
            id="sleep_night"
            name="sleep_night"
            onChange={(e:any) => {
              setSLEEP({ ...SLEEP, sleep_night: e });
            }}
            value={SLEEP.sleep_night}
            disableClock={false}
            clockIcon={null}
            format="HH:mm"
            locale="ko"
          />
          &nbsp;&nbsp;
          <span className="me-4">Morning</span>
          <TimePicker
            id="sleep_morning"
            name="sleep_morning"
            onChange={(e:any) => {
              setSLEEP({ ...SLEEP, sleep_morning: e });
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
  const buttonSleepUpdate = () => {
    return (
      <button className="btn btn-sm btn-primary ms-2" type="button" onClick={flowSleepUpdate}>
        Update
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
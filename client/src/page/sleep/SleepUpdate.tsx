// SleepUpdate.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const SleepUpdate = () => {

  // 1. title
  const TITLE = "Sleep Update";
  // 2. url
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  // 3. date
  const koreanDate = moment.tz('Asia/Seoul').format('YYYY-MM-DD').toString();
  // 4. hook
  const navParam = useNavigate();
  const location = useLocation();
  // 5. val
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
  useEffect(() => {
    const calcSleepTime = () => {
      const nightDate = new Date(`${sleep_regdate}T${SLEEP.sleep_night}:00Z`);
      const morningDate = new Date(`${sleep_regdate}T${SLEEP.sleep_morning}:00Z`);

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
  }, [SLEEP.sleep_night, SLEEP.sleep_morning, sleep_regdate]);

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
  const sleepUpdateFlow = async () => {
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


  // ---------------------------------------------------------------------------------------------->
  const sleepUpdateTable = () => {
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

  // ---------------------------------------------------------------------------------------------->
  const buttonSleepUpdate = () => {
    return (
      <button className="btn btn-primary ms-2" type="button" onClick={sleepUpdateFlow}>
        Update
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
            <span className="ms-4">{viewDate()}</span>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-10">
          <form className="form-inline">
            {sleepUpdateTable()}
            <br/>
            {buttonSleepUpdate()}
          </form>
        </div>
      </div>
    </div>
  );
};
// SleepUpdate.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";
import {useStorage} from "../../assets/js/useStorage.jsx";
import {useDeveloperMode} from "../../assets/js/useDeveloperMode.jsx";
import {BiCaretLeft, BiCaretRight} from "react-icons/bi";

// ------------------------------------------------------------------------------------------------>
export const SleepUpdate = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  const navParam = useNavigate();
  const location = useLocation();
  const _id = location.state._id;
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:sleepDay, setVal:setSleepDay} = useStorage (
    "sleepDay", new Date(koreanDate)
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [SLEEP, setSLEEP] = useState({
    _id: _id,
    user_id: user_id,
    sleep_day: koreanDate,
    sleep_planYn: "N",
    sleep_start: "00:00",
    sleep_end: "00:00",
    sleep_time: "00:00",
  });

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchSleepDetail = async () => {
      try {
        const response = await axios.get(`${URL_SLEEP}/sleep/detail`, {
          params: {
            _id: _id,
          },
        });
        setSLEEP(response.data);
        log("SLEEP : " + JSON.stringify(response.data));
      }
      catch (e) {
        setSLEEP(SLEEP);
        alert(`Error fetching sleep data: ${e.message}`);
      }
    };
    fetchSleepDetail();
  }, [_id]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setSLEEP({
      ...SLEEP,
      sleep_day: moment(sleepDay).format("YYYY-MM-DD"),
    });
  }, [sleepDay]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const setSleepTime = () => {
      if (!SLEEP.sleep_start || !SLEEP.sleep_end) {
        setSLEEP((prevSleep) => ({
          ...prevSleep,
          sleep_time: "00:00",
        }));
      }
      else if (SLEEP.sleep_start === "00:00" && SLEEP.sleep_end === "00:00") {
        setSLEEP((prevSleep) => ({
          ...prevSleep,
          sleep_time: "00:00",
        }));
      }
      else {
        const nightDate = new Date(`${SLEEP.sleep_day}T${SLEEP.sleep_start}:00Z`);
        const morningDate = new Date(`${SLEEP.sleep_day}T${SLEEP.sleep_end}:00Z`);

        if (morningDate < nightDate) {
          morningDate.setDate(morningDate.getDate() + 1);
        }

        const diff = morningDate.getTime() - nightDate.getTime();
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);

        setSLEEP((prevSleep) => ({
          ...prevSleep,
          sleep_time: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
        }));
      }
    };
    setSleepTime();
  }, [SLEEP.sleep_start, SLEEP.sleep_end, SLEEP.sleep_day]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSleepUpdate = async () => {
    try {
      const response = await axios.put (`${URL_SLEEP}/sleepUpdate`, {
        _id : _id,
        SLEEP : SLEEP
      });
      log("SLEEP : " + JSON.stringify(SLEEP));

      if (response.data === "success") {
        alert("Update a sleep successfully");
        navParam("/sleep/list");
      }
      else if (response.data === "fail") {
        alert("Update a sleep failed");
        return;
      }
      else {
        alert(`${response.data}error`);
      }
    }
    catch (e) {
      alert(`Error fetching sleep data: ${e.message}`);
    }
  };

  // 4. view -------------------------------------------------------------------------------------->
  const viewSleepDay = () => {
    const calcDate = (days) => {
      setSleepDay((prevDate) => {
        const newDate = prevDate ? new Date(prevDate) : new Date();
        newDate.setDate(newDate.getDate() + days);
        return newDate;
      });
    };
    return (
      <div className="d-inline-flex">
        <div onClick={() => calcDate(-1)}>
          <BiCaretLeft className="me-10 mt-10 fs-20 pointer" />
        </div>
        <DatePicker
          dateFormat="yyyy-MM-dd"
          popperPlacement="bottom"
          selected={sleepDay}
          onChange={(date) => {
            setSleepDay(date);
          }}
        />
        <div onClick={() => calcDate(1)}>
          <BiCaretRight className="ms-10 mt-10 fs-20 pointer" />
        </div>
      </div>
    );
  };

  // 5-1. table ----------------------------------------------------------------------------------->
  const tableSleepUpdate = () => {
    return (
      <div>
        <div className="row d-center">
          <div className="col-6">
            <div className="input-group">
              <span className="input-group-text">계획여부</span>
              <select
                id="sleep_planYn"
                name="sleep_planYn"
                className="form-select"
                value={SLEEP.sleep_planYn}
                onChange={(e) => {
                  setSLEEP({ ...SLEEP, sleep_planYn: e.target.value });
                }}
              >
                <option value="Y">계획</option>
                <option value="N" selected>미계획</option>
              </select>
            </div>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-6">
            <div className="input-group">
              <span className="input-group-text">취침시간</span>
              <TimePicker
                id="sleep_start"
                name="sleep_start"
                className="form-control"
                value={SLEEP.sleep_start}
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                onChange={(e) => {
                  setSLEEP({ ...SLEEP, sleep_start: e });
                }}
              />
            </div>
          </div>
        </div>
        <div className="row d-center mt-3">
          <div className="col-6">
            <div className="input-group">
              <span className="input-group-text">기상시간</span>
              <TimePicker
                id="sleep_end"
                name="sleep_end"
                className="form-control"
                value={SLEEP.sleep_end}
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                onChange={(e) => {
                  setSLEEP({ ...SLEEP, sleep_end: e });
                }}
              />
            </div>
          </div>
        </div>
        <div className="row d-center mt-3">
          <div className="col-6">
            <div className="input-group">
              <span className="input-group-text">수면시간</span>
              <TimePicker
                id="sleep_time"
                name="sleep_time"
                className="form-control"
                value={SLEEP.sleep_time}
                disableClock={true}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonSleepUpdate = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary" onClick={flowSleepUpdate}>
        Update
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

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row d-center mb-20">
          <div className="col-12">
            <h1 className="mb-3 fw-5">
              <span>{viewSleepDay()}</span>
            </h1>
          </div>
        </div>
        <div className="row d-center mt-5 mb-20">
          <div className="col-12">
            {tableSleepUpdate()}
            <br />
            {buttonSleepUpdate()}
            {buttonRefreshPage()}
          </div>
        </div>
      </div>
    </div>
  );
};

// SleepSave.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";
import {useDeveloperMode} from "../../assets/js/useDeveloperMode.jsx";
import {BiCaretLeft, BiCaretRight} from "react-icons/bi";

// ------------------------------------------------------------------------------------------------>
export const SleepSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  const navParam = useNavigate();
  const location = useLocation();
  const location_day = location?.state?.sleep_day;
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-2. useState -------------------------------------------------------------------------------->
  const [planYn, setPlanYn] = useState("N");
  const [sleepStart, setSleepStart] = useState("");
  const [sleepEnd, setSleepEnd] = useState("");
  const [sleepTime, setSleepTime] = useState("");

  // 2-2. useState -------------------------------------------------------------------------------->
  const [strDate, setStrDate] = useState(location_day ? location_day : koreanDate);
  const [strDur, setStrDur] = useState(`${strDate} ~ ${strDate}`);

  // 2-2. useState -------------------------------------------------------------------------------->
  const [SLEEP_DEFAULT, setSLEEP_DEFAULT] = useState({
    user_id : user_id,
    sleep_day: "",
    sleep_real : [{
      sleep_start: "",
      sleep_end: "",
      sleep_time: "",
    }],
    sleep_plan : [{
      sleep_start: "",
      sleep_end: "",
      sleep_time: "",
    }]
  });
  const [SLEEP, setSLEEP] = useState({
    user_id : user_id,
    sleep_day: "",
    sleep_real : [{
      sleep_start: "",
      sleep_end: "",
      sleep_time: "",
    }],
    sleep_plan : [{
      sleep_start: "",
      sleep_end: "",
      sleep_time: "",
    }]
  });

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_SLEEP}/detail`, {
      params: {
        user_id: user_id,
        sleep_dur: strDur,
      },
    });

    if (response.data.result) {
      setSLEEP(response.data.result);
    }
    else {
      setSLEEP(SLEEP_DEFAULT);
    }
    log("SLEEP : " + JSON.stringify(SLEEP));

  })()}, [strDur, planYn]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setStrDur(`${strDate} ~ ${strDate}`);
    setSLEEP((prev) => ({
      ...prev,
      sleep_day: strDur
    }));
  }, [strDate]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    const sleepType = planYn === "N" ? "sleep_real" : "sleep_plan";

    if (sleepStart && sleepEnd) {
      const startDate = new Date(`${koreanDate}T${sleepStart}:00Z`);
      const endDate = new Date(`${koreanDate}T${sleepEnd}:00Z`);

      // 종료 시간이 시작 시간보다 이전이면, 다음 날로 설정
      if (endDate < startDate) {
        endDate.setDate(endDate.getDate() + 1);
      }

      // 차이 계산
      const diff = endDate.getTime() - startDate.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

      setSleepTime(time);
      setSLEEP((prev) => ({
        ...prev,
        [sleepType]: [{
          ...prev[sleepType][0],
          sleep_time: time
        }]
      }));
    }
  }, [sleepStart, sleepEnd]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSleepSave = async () => {

    const response = await axios.post(`${URL_SLEEP}/save`, {
      user_id: user_id,
      SLEEP: SLEEP,
      sleep_dur: strDur,
      planYn: planYn
    });
    if (response.data === "duplicated") {
      alert("Duplicated a sleep");
      return;
    }
    else if (response.data === "success") {
      alert("Save a sleep successfully");
      navParam("/sleep/list");
    }
    else if (response.data === "fail") {
      alert("Save a sleep failed");
      return;
    }
    else {
      alert(`${response.data}error`);
    }
    log("SLEEP : " + JSON.stringify(SLEEP));
  };

  // 4. view -------------------------------------------------------------------------------------->
  const viewSleepDay = () => {

    const calcDate = (days) => {
      const date = new Date(strDate);
      date.setDate(date.getDate() + days);
      setStrDate(moment(date).format("YYYY-MM-DD").toString());
    };

    return (
      <div className="d-inline-flex">
        <div onClick={() => calcDate(-1)}>
          <BiCaretLeft className="me-10 mt-10 fs-20 pointer" />
        </div>
        <DatePicker
          dateFormat="yyyy-MM-dd"
          popperPlacement="bottom"
          selected={new Date(strDate)}
          onChange={(date) => {
            setStrDate(moment(date).format("YYYY-MM-DD").toString());
          }}
        />
        <div onClick={() => calcDate(1)}>
          <BiCaretRight className="ms-10 mt-10 fs-20 pointer" />
        </div>
      </div>
    );
  };

  // 5-1. table ----------------------------------------------------------------------------------->
  const tableSleepSave = () => {

    const sleepType = planYn === "N" ? "sleep_real" : "sleep_plan";

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
                value={planYn}
                onChange={(e) => {
                  setPlanYn(e.target.value);
                }}
              >
                <option value="Y">목표</option>
                <option value="N" selected>실제</option>
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
                value={SLEEP[sleepType][0].sleep_start}
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                onChange={(e) => {
                  setSleepStart(e);
                  setSLEEP((prev) => ({
                    ...prev,
                    [sleepType]: [{
                      ...prev[sleepType][0],
                      sleep_start: e
                    }]
                  }));
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
                value={SLEEP[sleepType][0].sleep_end}
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                onChange={(e) => {
                  setSleepEnd(e);
                  setSLEEP((prev) => ({
                    ...prev,
                    [sleepType]: [{
                      ...prev[sleepType][0],
                      sleep_end: e
                    }]
                  }));
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
                value={SLEEP[sleepType][0].sleep_time}
                disableClock={false}
                disabled={true}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonSleepSave = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary" onClick={flowSleepSave}>
        Save
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
            {tableSleepSave()}
          </div>
        </div>
        <div className="row d-center">
          <div className="col-12">
            {buttonSleepSave()}
            {buttonRefreshPage()}
          </div>
        </div>
      </div>
    </div>
  );
};

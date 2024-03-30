// SleepInsert.jsx

import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";
import {useDeveloperMode} from "../../assets/js/useDeveloperMode.jsx";
import {BiCaretLeft, BiCaretRight} from "react-icons/bi";

// ------------------------------------------------------------------------------------------------>
export const SleepInsert = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  const navParam = useNavigate();
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-2. useState -------------------------------------------------------------------------------->
  const [planYn, setPlanYn] = useState("N");
  const [dateDate, setDateDate] = useState(new Date(koreanDate));
  const [strDate, setStrDate] = useState(koreanDate);
  const [strDur, setStrDur] = useState("0000-00-00 ~ 0000-00-00");
  const [strStart, strStrStart] = useState("0000-00-00");
  const [strEnd, strStrEnd] = useState("0000-00-00");

  // 2-2. useState -------------------------------------------------------------------------------->
  const initState = (YN) => ({
    _id: "",
    user_id: user_id,
    sleep_day: koreanDate,
    sleep_planYn: YN,
    sleep_start: "",
    sleep_end: "",
    sleep_time: "",
  });
  const [SLEEP_DEF, setSLEEP_DEF] = useState(initState(""));
  const [SLEEP_PLAN, setSLEEP_PLAN] = useState(initState("Y"));
  const [SLEEP_REAL, setSLEEP_REAL] = useState(initState("N"));

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {

    const SLEEP = planYn === "N" ? SLEEP_REAL : SLEEP_PLAN;
    const setSLEEP = planYn === "N" ? setSLEEP_REAL : setSLEEP_PLAN;

    const response = await axios.get(`${URL_SLEEP}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        sleep_day: strDate,
        planYn: planYn,
      },
    });

    response.data.result !== null ? setSLEEP(response.data.result) : setSLEEP(SLEEP_DEF);
    log("SLEEP : " + JSON.stringify(SLEEP));

  })()}, [strDate, planYn]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    const sleep = planYn === "N" ? SLEEP_REAL : SLEEP_PLAN;
    const setSLEEP = planYn === "N" ? setSLEEP_REAL : setSLEEP_PLAN;

    if (sleep.sleep_start && sleep.sleep_end) {
      const startDate = new Date(`${koreanDate}T${sleep.sleep_start}:00Z`);
      const endDate = new Date(`${koreanDate}T${sleep.sleep_end}:00Z`);

      if (endDate < startDate) {
        endDate.setDate(endDate.getDate() + 1);
      }

      const diff = endDate.getTime() - startDate.getTime();
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const time = `${hours.toString().padStart(2,"0")}:${minutes.toString().padStart(2, "0")}`;

      setSLEEP(prev => ({
        ...prev,
        sleep_time: time
      }));
    }
  }, [SLEEP_REAL.sleep_start, SLEEP_REAL.sleep_end, SLEEP_PLAN.sleep_start, SLEEP_PLAN.sleep_end]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSleepInsert = async () => {

    const SLEEP = planYn === "N" ? SLEEP_REAL : SLEEP_PLAN;

    const response = await axios.post(`${URL_SLEEP}/insert`, {
      user_id : user_id,
      SLEEP: SLEEP,
    });
    if (response.data === "success") {
      alert("Insert a sleep successfully");
      navParam("/sleep/list");
    }
    else if (response.data === "fail") {
      alert("Insert a sleep failed");
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
      setDateDate((prevDate) => {
        const newDate = prevDate ? new Date(prevDate) : new Date();
        newDate.setDate(newDate.getDate() + days);
        setDateDate(newDate);
        setStrDate(moment(newDate).format("YYYY-MM-DD"));
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
          selected={dateDate}
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
  const tableSleepInsert = () => {

    const SLEEP = planYn === "N" ? SLEEP_REAL : SLEEP_PLAN;
    const setSLEEP = planYn === "N" ? setSLEEP_REAL : setSLEEP_PLAN;

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
                value={SLEEP.sleep_start}
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                onChange={(e) => {
                  setSLEEP(prev => ({
                    ...prev,
                    sleep_start: e ? e : moment(new Date()).format("HH:mm")
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
                value={SLEEP.sleep_end}
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                onChange={(e) => {
                  setSLEEP(prev => ({
                    ...prev,
                    sleep_end: e ? e : moment(new Date()).format("HH:mm")
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
            {tableSleepInsert()}
            <br />
            {buttonSleepInsert()}
            {buttonRefreshPage()}
          </div>
        </div>
      </div>
    </div>
  );
};

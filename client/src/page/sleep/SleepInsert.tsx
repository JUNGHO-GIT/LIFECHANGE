// SleepInsert.tsx

import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";
import {useStorage} from "../../assets/ts/useStorage";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";
import {BiCaretLeft, BiCaretRight} from "react-icons/bi";

// ------------------------------------------------------------------------------------------------>
export const SleepInsert = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  const navParam = useNavigate();
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:sleepDay, setVal:setSleepDay} = useStorage (
    "sleepDay", new Date(koreanDate)
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [planYn, setPlanYn] = useState("N");
  const [SLEEP_REAL, setSLEEP_REAL] = useState({
    _id: "",
    user_id: user_id,
    sleep_day: koreanDate,
    sleep_planYn: "N",
    sleep_start: "00:00",
    sleep_end: "00:00",
    sleep_time: "00:00",
  });
  const [SLEEP_PLAN, setSLEEP_PLAN] = useState({
    _id: "",
    user_id: user_id,
    sleep_day: koreanDate,
    sleep_planYn: "Y",
    sleep_start: "00:00",
    sleep_end: "00:00",
    sleep_time: "00:00",
  });

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    // 1. real
    const responseReal = await axios.get(`${URL_SLEEP}/sleepDetail`, {
      params: {
        _id: "",
        user_id: user_id,
        sleep_day: koreanDate,
        planYn: "N",
      },
    });

    // 2. plan
    const responsePlan = await axios.get(`${URL_SLEEP}/sleepDetail`, {
      params: {
        _id: "",
        user_id: user_id,
        sleep_day: koreanDate,
        planYn: "Y",
      },
    });

    // 3. set
    if (responseReal.data.result) {
      setSLEEP_REAL(responseReal.data.result);
    }
    if (responsePlan.data.result) {
      setSLEEP_PLAN(responsePlan.data.result);
    }

    log("SLEEP_REAL : " + JSON.stringify(SLEEP_REAL));
    log("SLEEP_PLAN : " + JSON.stringify(SLEEP_PLAN));

  })()}, [planYn]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (planYn === "N") {
      setSLEEP_REAL({
        ...SLEEP_REAL,
        sleep_day: moment(sleepDay).format("YYYY-MM-DD").toString(),
      });
    }
    if (planYn === "Y") {
      setSLEEP_PLAN({
        ...SLEEP_PLAN,
        sleep_day: moment(sleepDay).format("YYYY-MM-DD").toString(),
      });
    }
  }, [sleepDay]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    let sleep = planYn === "N" ? SLEEP_REAL : SLEEP_PLAN;
    if (sleep.sleep_start && sleep.sleep_end) {
      const startDate = new Date(`${koreanDate}T${sleep.sleep_start}:00Z`);
      const endDate = new Date(`${koreanDate}T${sleep.sleep_end}:00Z`);

      if (endDate < startDate) {
        endDate.setDate(endDate.getDate() + 1);
      }

      const diff = endDate.getTime() - startDate.getTime();
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);

      const sleepTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

      if (planYn === "N") {
        setSLEEP_REAL({ ...SLEEP_REAL, sleep_time: sleepTime });
      }
      if (planYn === "Y") {
        setSLEEP_PLAN({ ...SLEEP_PLAN, sleep_time: sleepTime });
      }
    }
  }, [SLEEP_REAL.sleep_start, SLEEP_REAL.sleep_end, SLEEP_PLAN.sleep_start, SLEEP_PLAN.sleep_end]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSleepInsert = async () => {
    try {
      const sleep = planYn === "N" ? SLEEP_REAL : SLEEP_PLAN;
      const response = await axios.post (`${URL_SLEEP}/sleepInsert`, {
        user_id : user_id,
        SLEEP: sleep,
        planYn : planYn,
      });
      if (response.data === "success") {
        alert("Insert a sleep successfully");
        navParam("/sleepList");
      }
      else if (response.data === "fail") {
        alert("Insert a sleep failed");
        return;
      }
      else {
        alert(`${response.data}error`);
      }
      log("SLEEP : " + JSON.stringify(sleep));
    }
    catch (error:any) {
      alert(`Error fetching sleep data: ${error.message}`);
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
  const tableSleepInsert = () => {
    const sleep = planYn === "N" ? SLEEP_REAL : SLEEP_PLAN;
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
                value={sleep.sleep_planYn}
                onChange={(e) => {
                  setPlanYn(e.target.value);
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
                value={planYn === "Y" ? SLEEP_PLAN.sleep_start : SLEEP_REAL.sleep_start}
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                onChange={(e:any) => {
                  if (planYn === "Y") {
                    setSLEEP_PLAN({ ...SLEEP_PLAN, sleep_start: e });
                  }
                  if (planYn === "N") {
                    setSLEEP_REAL({ ...SLEEP_REAL, sleep_start: e });
                  }
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
                value={planYn === "Y" ? SLEEP_PLAN.sleep_end : SLEEP_REAL.sleep_end}
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                onChange={(e:any) => {
                  if (planYn === "Y") {
                    setSLEEP_PLAN({ ...SLEEP_PLAN, sleep_end: e });
                  }
                  if (planYn === "N") {
                    setSLEEP_REAL({ ...SLEEP_REAL, sleep_end: e });
                  }
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
                value={planYn === "Y" ? SLEEP_PLAN.sleep_time : SLEEP_REAL.sleep_time}
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

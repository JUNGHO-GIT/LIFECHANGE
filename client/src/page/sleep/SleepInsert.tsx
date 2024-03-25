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

  // 2-1. useState -------------------------------------------------------------------------------->
  const [SLEEP, setSLEEP] = useState<any>({
    user_id: user_id,
    sleep_day: koreanDate,
    sleep_planYn: "N",
    sleep_night: "00:00",
    sleep_morning: "00:00",
    sleep_time: "00:00",
  });

  // 2-2. useStorage ------------------------------------------------------------------------------>
  const {val:sleepDay, setVal:setSleepDay} = useStorage<Date | undefined> (
    "sleepDay", new Date(koreanDate)
  );

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setSLEEP({
      ...SLEEP,
      sleepDay: moment(sleepDay).format("YYYY-MM-DD"),
    });
  }, [sleepDay]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const setSleepTime = () => {
      if (!SLEEP.sleep_night || !SLEEP.sleep_morning) {
        setSLEEP((prevSleep:any) => ({
          ...prevSleep,
          sleep_time: "00:00",
        }));
      }
      else if (SLEEP.sleep_night === "00:00" && SLEEP.sleep_morning === "00:00") {
        setSLEEP((prevSleep:any) => ({
          ...prevSleep,
          sleep_time: "00:00",
        }));
      }
      else {
        const nightDate = new Date(`${SLEEP.sleep_day}T${SLEEP.sleep_night}:00Z`);
        const morningDate = new Date(`${SLEEP.sleep_day}T${SLEEP.sleep_morning}:00Z`);

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
  }, [SLEEP.sleep_night, SLEEP.sleep_morning, SLEEP.sleep_day]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSleepInsert = async () => {
    try {
      const response = await axios.post (`${URL_SLEEP}/sleepInsert`, {
        user_id : user_id,
        SLEEP : SLEEP
      });
      log("SLEEP : " + JSON.stringify(SLEEP));

      if (response.data === "success") {
        alert("Insert a sleep successfully");
        navParam("/sleepList");
      }
      else if (response.data === "duplicate") {
        alert("해당 날짜의 수면 데이터가 이미 존재합니다.");
        return;
      }
      else if (response.data === "fail") {
        alert("Insert a sleep failed");
        return;
      }
      else {
        alert(`${response.data}error`);
      }
    }
    catch (error:any) {
      alert(`Error fetching sleep data: ${error.message}`);
    }
  };

  // 4. view -------------------------------------------------------------------------------------->
  const viewSleepDay = () => {
    const calcDate = (days: number) => {
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
          onChange={(date: Date) => {
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
        </div>
        <div className="row d-center mt-3">
          <div className="col-6">
            <div className="input-group">
              <span className="input-group-text">기상시간</span>
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

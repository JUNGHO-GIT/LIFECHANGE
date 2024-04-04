// SleepSave.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/js/useStorage.jsx";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";
import {BiCaretLeft, BiCaretRight} from "react-icons/bi";

// ------------------------------------------------------------------------------------------------>
export const SleepSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const location_date = location?.state?.date?.toString();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;
  const STATE = {
    refresh:0,
    intoList:"/sleep/list",
    id: "",
    date: ""
  };

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:planYn, set:setPlanYn} = useStorage(
    `planYn(${PATH})`, "N"
  );
  const {val:planCount, set:setPlanCount} = useStorage(
    `planCount(${PATH})`, 0
  );
  const {val:realCount, set:setRealCount} = useStorage(
    `realCount(${PATH})`, 0
  );

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:strStartDate, set:setStrStartDate} = useStorage(
    `strStartDate(${PATH})`, koreanDate
  );
  const {val:strEndDate, set:setStrEndDate} = useStorage(
    `strEndDate(${PATH})`, koreanDate
  );
  const {val:strDate, set:setStrDate} = useStorage(
    `strDate(${PATH})`, location_date
  );
  const {val:strDur, set:setStrDur} = useStorage(
    `strDur(${PATH})`, `${location_date} ~ ${location_date}`
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [SLEEP_DEFAULT, setSLEEP_DEFAULT] = useState({
    _id: "",
    sleep_number: 0,
    sleep_date: "",
    sleep_real : {
      sleep_section: [{
        sleep_start: "",
        sleep_end: "",
        sleep_time: "",
      }],
    },
    sleep_plan : {
      sleep_section: [{
        sleep_start: "",
        sleep_end: "",
        sleep_time: "",
      }],
    },
  });
  const [SLEEP, setSLEEP] = useState({
    _id: "",
    sleep_number: 0,
    sleep_date: "",
    sleep_real : {
      sleep_section: [{
        sleep_start: "",
        sleep_end: "",
        sleep_time: "",
      }],
    },
    sleep_plan : {
      sleep_section: [{
        sleep_start: "",
        sleep_end: "",
        sleep_time: "",
      }],
    },
  });

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setStrDate(location_date);
    setStrDur(`${location_date} ~ ${location_date}`);
  }, [location_date]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setSLEEP((prev) => ({
      ...prev,
      sleep_date: strDur
    }));
  }, [strDur]);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_SLEEP}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        sleep_dur: strDur,
        planYn: planYn,
      },
    });

    setPlanCount(response.data.planCount ? response.data.planCount : 0);
    setRealCount(response.data.realCount ? response.data.realCount : 0);
    setSLEEP(response.data.result ? response.data.result : SLEEP_DEFAULT);

  })()}, [strDur, planYn]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    const sleepType = planYn === "Y" ? "sleep_plan" : "sleep_real";

    const startTime = SLEEP[sleepType]?.sleep_section.map((item) => item?.sleep_start)?.toString();
    const endTime = SLEEP[sleepType]?.sleep_section.map((item) => item?.sleep_end)?.toString();

    if (startTime && endTime) {
      const startDate = new Date(`${strDate}T${startTime}`);
      const endDate = new Date(`${strDate}T${endTime}`);

      // 종료 시간이 시작 시간보다 이전이면, 다음 날로 설정
      if (endDate < startDate) {
        endDate.setDate(endDate.getDate() + 1);
      }

      // 차이 계산
      const diff = endDate.getTime() - startDate.getTime();
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

      setSLEEP((prev) => ({
        ...prev,
        [sleepType]: {
          ...prev[sleepType],
          sleep_section: [{
            ...prev[sleepType].sleep_section[0],
            sleep_time: time,
          }],
        },
      }));
    }
  }, [strStartDate, strEndDate]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSleepSave = async () => {

    const response = await axios.post(`${URL_SLEEP}/save`, {
      user_id: user_id,
      SLEEP: SLEEP,
      sleep_dur: strDur,
      planYn: planYn
    });
    if (response.data === "success") {
      alert("Save a sleep successfully");
      navParam(STATE.intoList);
    }
    else if (response.data === "fail") {
      alert("Save a sleep failed");
      return;
    }
    else {
      alert(`${response.data}error`);
    }
  };

  // 4. view -------------------------------------------------------------------------------------->
  const viewSleepDay = () => {

    const calcDate = (days) => {
      const date = new Date(strDate);
      date.setDate(date.getDate() + days);
      setStrDate(moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"));
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
            setStrDate(moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"));
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

    const sleepType = planYn === "Y" ? "sleep_plan" : "sleep_real";

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
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                value={(SLEEP[sleepType].sleep_section)?.map((item) => item.sleep_start)}
                onChange={(e) => {
                  setStrStartDate(e);
                  setSLEEP((prev) => ({
                    ...prev,
                    [sleepType]: {
                      sleep_section: [{
                        ...prev[sleepType].sleep_section[0],
                        sleep_start: e,
                      }]
                    },
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
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                value={(SLEEP[sleepType].sleep_section)?.map((item) => item.sleep_end)}
                onChange={(e) => {
                  setStrEndDate(e);
                  setSLEEP((prev) => ({
                    ...prev,
                    [sleepType]: {
                      sleep_section: [{
                        ...prev[sleepType].sleep_section[0],
                        sleep_end: e,
                      }]
                    },
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
                disableClock={false}
                disabled={true}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                value={(SLEEP[sleepType].sleep_section)?.map((item) => item.sleep_time)}
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
        navParam(STATE.refresh);
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

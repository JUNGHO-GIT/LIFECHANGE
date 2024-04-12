// SleepSave.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {useDate} from "../../../assets/hooks/useDate.jsx";
import {useTime} from "../../../assets/hooks/useTime.jsx";
import {TimePicker} from "react-time-picker";
import axios from "axios";
import {DateNode} from "../../../assets/fragments/DateNode.jsx";
import {ButtonNode} from "../../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const navParam = useNavigate();
  const location = useLocation();
  const location_date = location?.state?.date;
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:STATE, set:setSTATE} = useStorage(
    `STATE(${PATH})`, {
      id: "",
      date: "",
      refresh: 0,
      toList:"/sleep/list"
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      strDur: `${location_date} ~ ${location_date}`,
      strStartDt: location_date,
      strEndDt: location_date,
      strDt: location_date
    }
  );
  const {val:CALENDAR, set:setCALENDAR} = useStorage(
    `CALENDAR(${PATH})`, {
      calStartOpen: false,
      calEndOpen: false,
      calOpen: false,
    }
  );
  const {val:COUNT, set:setCOUNT} = useStorage(
    `COUNT(${PATH})`, {
      totalCnt: 0,
      sectionCnt: 0
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const SLEEP_DEFAULT = {
    _id: "",
    sleep_number: 0,
    sleep_date: "",
    sleep_section: [{
      sleep_night: "",
      sleep_morning: "",
      sleep_time: "",
    }],
  };
  const [SLEEP, setSLEEP] = useState(SLEEP_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(DATE, setDATE, location_date);
  useTime(SLEEP, setSLEEP, DATE, setDATE, PATH, "real");

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_SLEEP}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        sleep_dur: DATE.strDur
      },
    });
    setSLEEP(response.data.result);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0
    }));
  })()}, [user_id, DATE.strDur]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_SLEEP}/save`, {
      user_id: user_id,
      SLEEP: SLEEP,
      sleep_dur: DATE.strDur,
    });
    if (response.data === "success") {
      alert("Save successfully");
      STATE.date = DATE.strDt;
      navParam(STATE.toList, {
        state: STATE
      });
    }
    else {
      alert(`${response.data}error`);
    }
  };

  // 4. date -------------------------------------------------------------------------------------->
  const dateNode = () => {
    return (
      <DateNode DATE={DATE} setDATE={setDATE} type={"save"} />
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    function sleepNode () {
      return (
        <div className="row d-center">
          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text">취침</span>
              <TimePicker
                id="sleep_night"
                name="sleep_night"
                className="form-control"
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                value={SLEEP?.sleep_section[0]?.sleep_night}
                onChange={(e) => {
                  setSLEEP((prev) => ({
                    ...prev,
                    sleep_section: [{
                      ...prev?.sleep_section[0],
                      sleep_night: e ? e.toString() : "",
                    }],
                  }));
                }}
              ></TimePicker>
            </div>
          </div>
          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text">기상</span>
              <TimePicker
                id="sleep_morning"
                name="sleep_morning"
                className="form-control"
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                value={SLEEP?.sleep_section[0]?.sleep_morning}
                onChange={(e) => {
                  setSLEEP((prev) => ({
                    ...prev,
                    sleep_section: [{
                      ...prev?.sleep_section[0],
                      sleep_morning: e ? e.toString() : "",
                    }],
                  }));
                }}
              ></TimePicker>
            </div>
          </div>
          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text">수면</span>
              <TimePicker
                id="sleep_time"
                name="sleep_time"
                className="form-control"
                disableClock={false}
                disabled={true}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                value={SLEEP?.sleep_section[0]?.sleep_time}
              ></TimePicker>
            </div>
          </div>
        </div>
      );
    };
    return (
      <div className="row d-center">
        <div className="col-8 mb-20">
          {sleepNode()}
        </div>
      </div>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        STATE={STATE} setSTATE={setSTATE} flowSave={flowSave} navParam={navParam}
        type={"save"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row d-center">
          <div className="col-12 mb-20">
            <h1>Save</h1>
          </div>
          <div className="col-12 mb-20">
            {dateNode()}
          </div>
          <div className="col-12 mb-20">
            {tableNode()}
          </div>
          <div className="col-12 mb-20">
            {buttonNode()}
          </div>
        </div>
      </div>
    </div>
  );
};

// SleepPlanSave.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {useDate} from "../../assets/hooks/useDate.jsx";
import {useTime} from "../../assets/hooks/useTime.jsx";
import axios from "axios";
import {TimePicker} from "react-time-picker";
import {DateNode} from "../../assets/fragments/DateNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepPlanSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP_PLAN = process.env.REACT_APP_URL_SLEEP_PLAN;
  const user_id = window.sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      startDt: "",
      endDt: "",
      refresh: 0,
      toList:"/sleep/plan/list"
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );
  const {val:COUNT, set:setCOUNT} = useStorage(
    `COUNT(${PATH})`, {
      totalCnt: 0,
      sectionCnt: 0
    }
  );
  const {val:CALENDAR, set:setCALENDAR} = useStorage(
    `CALENDAR(${PATH})`, {
      calStartOpen: false,
      calEndOpen: false,
      calOpen: false,
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const SLEEP_PLAN_DEFAULT = {
    _id: "",
    sleep_plan_number: 0,
    sleep_plan_startDt: "",
    sleep_plan_endDt: "",
    sleep_plan_night: "",
    sleep_plan_morning: "",
    sleep_plan_time: "",
  };
  const [SLEEP_PLAN, setSLEEP_PLAN] = useState(SLEEP_PLAN_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);
  useTime(SLEEP_PLAN, setSLEEP_PLAN, PATH, "plan");

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_SLEEP_PLAN}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        sleep_plan_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setSLEEP_PLAN(response.data.result || SLEEP_PLAN_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0
    }));
  })()}, [user_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_SLEEP_PLAN}/save`, {
      user_id: user_id,
      SLEEP_PLAN: SLEEP_PLAN,
      sleep_plan_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
    });
    if (response.data.status === "success") {
      alert(response.data.msg);
      SEND.startDt = DATE.startDt;
      SEND.endDt = DATE.endDt;
      navParam(SEND.toList, {
        state: SEND
      });
    }
    else {
      alert(response.data.msg);
    }
  };

  // 4. date -------------------------------------------------------------------------------------->
  const dateNode = () => {
    return (
      <DateNode DATE={DATE} setDATE={setDATE} part={"sleep"} plan={"plan"} type={"save"} />
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <div className={"row d-center"}>
        <div className={"col-12"}>
          <div className={"input-group"}>
            <span className={"input-group-text"}>취침</span>
            <TimePicker
              id={"sleep_plan_night"}
              name={"sleep_plan_night"}
              className={"form-control"}
              disableClock={false}
              clockIcon={null}
              format={"HH:mm"}
              locale={"ko"}
              value={SLEEP_PLAN?.sleep_plan_night}
              onChange={(e) => {
                setSLEEP_PLAN((prev) => ({
                  ...prev,
                  sleep_plan_night: e || ""
                }));
              }}
            ></TimePicker>
          </div>
        </div>
        <div className={"col-12"}>
          <div className={"input-group"}>
            <span className={"input-group-text"}>기상</span>
            <TimePicker
              id={"sleep_plan_morning"}
              name={"sleep_plan_morning"}
              className={"form-control"}
              disableClock={false}
              clockIcon={null}
              format={"HH:mm"}
              locale={"ko"}
              value={SLEEP_PLAN?.sleep_plan_morning}
              onChange={(e) => {
                setSLEEP_PLAN((prev) => ({
                  ...prev,
                  sleep_plan_morning: e || ""
                }));
              }}
            ></TimePicker>
          </div>
        </div>
        <div className={"col-12"}>
          <div className={"input-group"}>
            <span className={"input-group-text"}>수면</span>
            <TimePicker
              id={"sleep_plan_time"}
              name={"sleep_plan_time"}
              className={"form-control"}
              disableClock={false}
              disabled={true}
              clockIcon={null}
              format={"HH:mm"}
              locale={"ko"}
              value={SLEEP_PLAN?.sleep_plan_time}
            ></TimePicker>
          </div>
        </div>
      </div>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} flowSave={flowSave} navParam={navParam}
        part={"sleep"} plan={"plan"} type={"save"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className={"root-wrapper"}>
      <div className={"container-wrapper"}>
        <div className={"row d-center"}>
          <div className={"col-12 mb-20"}>
            <h1>Save</h1>
          </div>
          <div className={"col-12 mb-20"}>
            {dateNode()}
          </div>
          <div className={"col-12 mb-20"}>
            {tableNode()}
          </div>
          <div className={"col-12 mb-20"}>
            {buttonNode()}
          </div>
        </div>
      </div>
    </div>
  );
};

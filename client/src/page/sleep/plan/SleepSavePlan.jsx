// SleepSavePlan.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {useDate} from "../../../assets/hooks/useDate.jsx";
import {useTime} from "../../../assets/hooks/useTime.jsx";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import {ko} from "date-fns/locale";
import moment from "moment-timezone";
import {DateNode} from "../../../assets/fragments/DateNode.jsx";
import {CalendarNode} from "../../../assets/fragments/CalendarNode.jsx";
import {PagingNode} from "../../../assets/fragments/PagingNode.jsx";
import {FilterNode} from "../../../assets/fragments/FilterNode.jsx";
import {ButtonNode} from "../../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepSavePlan = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_PLAN = process.env.REACT_APP_URL_PLAN;
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
      toList:"/sleep/list/plan"
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
  const {val:FILTER, set:setFILTER} = useStorage(
    `FILTER(${PATH})`, {
      order: "asc",
      limit: 5,
      part: "전체",
      schema: "sleep",
    }
  );
  const {val:COUNT, set:setCOUNT} = useStorage(
    `COUNT(${PATH})`, {
      totalCnt: 0,
      sectionCnt: 0
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [PLAN_DEFAULT, setPLAN_DEFAULT] = useState({
    _id: "",
    plan_number: 0,
    plan_schema: "sleep",
    plan_start: "",
    plan_end: "",
    plan_sleep: {
      plan_night: "",
      plan_morning: "",
      plan_time: "",
    },
  });
  const [PLAN, setPLAN] = useState({
    _id: "",
    plan_number: 0,
    plan_schema: "sleep",
    plan_start: "",
    plan_end: "",
    plan_sleep: {
      plan_night: "",
      plan_morning: "",
      plan_time: "",
    },
  });

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(DATE, setDATE, location_date);
  useTime(PLAN, setPLAN, DATE, setDATE, PATH, "plan");

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_PLAN}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        plan_dur: DATE.strDur,
        FILTER: FILTER,
      },
    });
    setPLAN(response.data.result ? response.data.result : PLAN_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt
    }));
  })()}, [user_id, DATE.strDur, FILTER]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_PLAN}/save`, {
      user_id: user_id,
      PLAN: PLAN,
      plan_dur: DATE.strDur,
      FILTER: FILTER,
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

    // 1. startNode
    function startNode () {
      return (
        <div className="input-group">
          <span className="input-group-text">시작일</span>
          <DatePicker
            dateFormat="yyyy-MM-dd"
            popperPlacement="bottom"
            selected={new Date(DATE.strStartDt)}
            disabled={false}
            onChange={(date) => {
              setDATE((prev) => ({
                ...prev,
                strStartDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD")
              }));
            }}
          >
          </DatePicker>
        </div>
      );
    };

    // 2. endNode
    function endNode () {
      return (
        <div className="input-group">
          <span className="input-group-text">종료일</span>
          <DatePicker
            dateFormat="yyyy-MM-dd"
            popperPlacement="bottom"
            selected={new Date(DATE.strEndDt)}
            disabled={false}
            onChange={(date) => {
              setDATE((prev) => ({
                ...prev,
                strEndDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD")
              }));
            }}
          >
          </DatePicker>
        </div>
      );
    };

    // 3. nowNode
    function nowNode () {
      return (
        <div className="input-group d-center">
          <span className="input-group-text">날짜</span>
          <DatePicker
            dateFormat="yyyy-MM-dd"
            popperPlacement="bottom"
            className="form-control"
            selected={new Date(DATE.strDt)}
            disabled={false}
            onChange={(date) => {
              setDATE((prev) => ({
                ...prev,
                strDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD")
              }));
            }}
          >
          </DatePicker>
        </div>
      );
    };

    // 4. sleepNode
    function sleepNode () {
      return (
        <div className="row d-center">
          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text">취침</span>
              <TimePicker
                id="plan_night"
                name="plan_night"
                className="form-control"
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                value={PLAN.plan_sleep?.plan_night}
                onChange={(e) => {
                  setPLAN((prev) => ({
                    ...prev,
                    plan_sleep: {
                      ...prev.plan_sleep,
                      plan_night: e ? e.toString() : "",
                    }
                  }));
                }}
              ></TimePicker>
            </div>
          </div>
          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text">기상</span>
              <TimePicker
                id="plan_morning"
                name="plan_morning"
                className="form-control"
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                value={PLAN.plan_sleep?.plan_morning}
                onChange={(e) => {
                  setPLAN((prev) => ({
                    ...prev,
                    plan_sleep: {
                      ...prev.plan_sleep,
                      plan_morning: e ? e.toString() : "",
                    }
                  }));
                }}
              ></TimePicker>
            </div>
          </div>
          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text">수면</span>
              <TimePicker
                id="plan_time"
                name="plan_time"
                className="form-control"
                disableClock={false}
                disabled={true}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                value={PLAN.plan_sleep.plan_time}
              ></TimePicker>
            </div>
          </div>
        </div>
      );
    };

    // 5. return
    return (
      <div className="row d-center">
        <div className="col-8 mb-20">
          {nowNode()}
        </div>
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
            {buttonNode()}
          </div>
          <div className="col-12 mb-20">
            {tableNode()}
          </div>
        </div>
      </div>
    </div>
  );
};

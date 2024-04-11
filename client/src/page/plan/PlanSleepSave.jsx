// PlanSleepSave.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {useDatePlan} from "../../assets/hooks/useDatePlan.jsx";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import {ko} from "date-fns/locale";
import moment from "moment-timezone";
import {DateNode} from "../../assets/fragments/DateNode.jsx";
import {CalendarNode} from "../../assets/fragments/CalendarNode.jsx";
import {PagingNode} from "../../assets/fragments/PagingNode.jsx";
import {FilterNode} from "../../assets/fragments/FilterNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const PlanSleepSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_PLAN = process.env.REACT_APP_URL_PLAN;
  const navParam = useNavigate();
  const location = useLocation();
  const location_date = location?.state?.date;
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;
  const STATE = {
    id: "",
    date: "",
    refresh: 0,
    toList:"/plan/sleep/list"
  };

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:strDate, set:setStrDate} = useStorage(
    `strDate(${PATH})`, location_date
  );
  const {val:strDur, set:setStrDur} = useStorage(
    `strDur(${PATH})`, `${location_date} ~ ${location_date}`
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [PLAN_DEFAULT, setPLAN_DEFAULT] = useState({
    _id: "",
    plan_number: 0,
    plan_dur: "",
    plan_schema: "sleep",
    plan_sleep: {
      plan_night: "",
      plan_morning: "",
      plan_time: "",
    },
  });
  const [PLAN, setPLAN] = useState({
    _id: "",
    plan_number: 0,
    plan_dur: "",
    plan_schema: "sleep",
    plan_sleep: {
      plan_night: "",
      plan_morning: "",
      plan_time: "",
    },
  });

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDatePlan(PLAN, setPLAN, PATH, location_date, strDate, setStrDate, strDur, setStrDur);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_PLAN}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        plan_dur: strDur,
        plan_schema: "sleep",
      },
    });

    setPLAN(response.data.result ? response.data.result : PLAN_DEFAULT);

  })()}, [strDur]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_PLAN}/save`, {
      user_id: user_id,
      PLAN: PLAN,
      plan_dur: strDur,
    });
    if (response.data === "success") {
      alert("Save successfully");
      STATE.date = strDate;
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
      <DateNode strDate={strDate} setStrDate={setStrDate} type="save" />
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    function datePicker () {
      return (
        <div className="d-inline-flex">
          <DatePicker
            dateFormat="yyyy-MM-dd"
            popperPlacement="bottom"
            selected={new Date(strDate)}
            disabled={false}
            onChange={(date) => {
              setStrDate(moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"));
            }}
          />
        </div>
      );
    };
    function sleepNode () {
      return (
        <div>
          <div className="row d-center mb-20">
            <div className="col-12">
              <div className="input-group">
                <p className="input-group-text">날짜</p>
                {datePicker()}
              </div>
            </div>
          </div>
          <div className="row d-center mb-20">
            <div className="col-12">
              <div className="input-group">
                <p className="input-group-text">취침시간</p>
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
                />
              </div>
            </div>
            <div className="col-12">
              <div className="input-group">
                <p className="input-group-text">기상시간</p>
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
                />
              </div>
            </div>
            <div className="col-12">
              <div className="input-group">
                <p className="input-group-text">수면시간</p>
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
                />
              </div>
            </div>
          </div>
        </div>
      );
    };
    return (
      <div>
        <div className="row d-center">
          <div className="col-12">
            {sleepNode()}
          </div>
        </div>
      </div>
    );
  };


  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode calendarOpen={""} setCalendarOpen={""}
        strDate={strDate} setStrDate={setStrDate}
        STATE={STATE} flowSave={flowSave} navParam={navParam}
        type="save"
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
          <div className="col-12 mb-20 h-80">
            {tableNode()}
          </div>
        </div>
      </div>
    </div>
  );
};

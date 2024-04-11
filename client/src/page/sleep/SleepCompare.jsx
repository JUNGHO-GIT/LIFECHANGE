// SleepCompare.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import axios from "axios";
import {DateNode} from "../../assets/fragments/DateNode.jsx";
import {CalendarNode} from "../../assets/fragments/CalendarNode.jsx";
import {PagingNode} from "../../assets/fragments/PagingNode.jsx";
import {FilterNode} from "../../assets/fragments/FilterNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepCompare = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_PLAN = process.env.REACT_APP_URL_PLAN;
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
      toDetail:"/sleep/detail"
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
      type: "day",
      limit: 5,
      schema: "sleep",
    }
  );
  const {val:PAGING, set:setPAGING} = useStorage(
    `PAGING(${PATH})`, {
      page: 1,
      limit: 5
    }
  );
  const {val:COUNT, set:setCOUNT} = useStorage(
    `COUNT(${PATH})`, {
      totalCnt: 0,
      sectionCnt: 0
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [SLEEP_PLAN, setSLEEP_PLAN] = useState([{
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
  }]);
  const [SLEEP_REAL, setSLEEP_REAL] = useState([{
    _id: "",
    sleep_number: 0,
    sleep_date: "",
    sleep_section: [{
      sleep_night: "",
      sleep_morning: "",
      sleep_time: "",
    }],
  }]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {

    const responsePlan = await axios.get(`${URL_PLAN}/list`, {
      params: {
        user_id: user_id,
        plan_dur: DATE.strDur,
        FILTER: FILTER,
        PAGING: PAGING
      },
    });
    setSLEEP_PLAN(responsePlan.data.result);

    const responseReal = await axios.get(`${URL_SLEEP}/list`, {
      params: {
        user_id: user_id,
        sleep_dur: DATE.strDur,
        FILTER: FILTER,
        PAGING: PAGING
      },
    });
    setSLEEP_REAL(responseReal.data.result);

  })()}, [user_id, DATE.strDur, FILTER, PAGING]);

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    function successOrNot (plan, real) {
      const planDate = new Date(`1970-01-01T${plan}:00.000Z`);
      const realDate = new Date(`1970-01-01T${real}:00.000Z`);
      if (realDate < planDate) {
        realDate.setHours(realDate.getHours() + 24);
      }
      const diff = Math.abs(realDate.getTime() - planDate.getTime());
      const diffMinutes = Math.floor(diff / 60000);

      let textColor = "text-muted";
      if (0 <= diffMinutes && diffMinutes <= 10) {
        textColor = "text-primary";
      }
      if (10 < diffMinutes && diffMinutes <= 20) {
        textColor = "text-success";
      }
      if (20 < diffMinutes && diffMinutes <= 30) {
        textColor = "text-warning";
      }
      if (30 < diffMinutes) {
        textColor = "text-danger";
      }
      return textColor;
    };
    function tableFragment () {
      return (
        <table className="table bg-white table-hover table-responsive">
          <thead className="table-primary">
            <tr>
              <th>날짜</th>
              <th>분류</th>
              <th>목표</th>
              <th>실제</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {SLEEP_REAL.map((real) => (
              SLEEP_PLAN.map((plan) => (
                <React.Fragment key={real._id}>
                  <tr>
                    <td rowSpan={3}>
                      {real.sleep_date}
                    </td>
                    <td>취침</td>
                    <td>
                      {plan.plan_sleep.plan_night}
                    </td>
                    <td>
                      {real.sleep_section.map((item) => item.sleep_night)}
                    </td>
                    <td>
                      <span className={successOrNot(
                        plan.plan_sleep.plan_night,
                        real.sleep_section.map((item) => item.sleep_night)
                      )}>
                        ●
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>기상</td>
                    <td>
                      {plan.plan_sleep.plan_morning}
                    </td>
                    <td>
                      {real.sleep_section.map((item) => item.sleep_morning)}
                    </td>
                    <td>
                      <span className={successOrNot(
                        plan.plan_sleep.plan_morning,
                        real.sleep_section.map((item) => item.sleep_morning)
                      )}>
                        ●
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>수면</td>
                    <td>
                      {plan.plan_sleep.plan_time}
                    </td>
                    <td>
                      {real.sleep_section.map((item) => item.sleep_time)}
                    </td>
                    <td>
                      <span className={successOrNot(
                        plan.plan_sleep.plan_time,
                        real.sleep_section.map((item) => item.sleep_time)
                      )}>
                        ●
                      </span>
                    </td>
                  </tr>
                </React.Fragment>
              ))
            ))}
          </tbody>
        </table>
      );
    };
    return (
      <div className="d-flex">
        {tableFragment()}
      </div>
    );
  };

  // 6. calendar ---------------------------------------------------------------------------------->
  const calendarNode = () => {
    return (
      <CalendarNode FILTER={FILTER} setFILTER={setFILTER} DATE={DATE} setDATE={setDATE}
        CALENDAR={CALENDAR} setCALENDAR={setCALENDAR}
      />
    );
  };

  // 7. paging ------------------------------------------------------------------------------------>
  const pagingNode = () => {
    return (
      <PagingNode PAGING={PAGING} setPAGING={setPAGING} COUNT={COUNT} setCOUNT={setCOUNT}
      />
    );
  };

  // 8. filter ------------------------------------------------------------------------------------>
  const filterNode = () => {
    return (
      <FilterNode FILTER={FILTER} setFILTER={setFILTER} PAGING={PAGING} setPAGING={setPAGING}
        type={"sleep"} compare={"true"}
      />
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        STATE={STATE} setSTATE={setSTATE} flowSave={""} navParam={navParam}
        type={"list"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row mb-20 d-center">
          <div className="col-12">
            <h1>Compare</h1>
          </div>
        </div>
        <div className="row mb-20 d-center">
          <div className="col-12">
            {calendarNode()}
            {tableNode()}
          </div>
        </div>
        <div className="row mb-20 d-center">
          <div className="col-12">
            {filterNode()}
          </div>
        </div>
        <div className="row mb-20 d-center">
          <div className="col-12">
            {pagingNode()}
          </div>
        </div>
        <div className="row mb-20 d-center">
          <div className="col-12">
            {buttonNode()}
          </div>
        </div>
      </div>
    </div>
  );
};
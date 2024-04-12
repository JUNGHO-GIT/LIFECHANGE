// MoneyPlanSave.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {useDate} from "../../../assets/hooks/useDate.jsx";
import {useTime} from "../../../assets/hooks/useTime.jsx";
import DatePicker from "react-datepicker";
import {TimePicker} from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";
import {DateNode} from "../../../assets/fragments/DateNode.jsx";
import {ButtonNode} from "../../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const MoneyPlanSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_MONEY_PLAN = process.env.REACT_APP_URL_MONEY_PLAN;
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
      toList:"/money/plan/list"
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      strDur: "",
      strStartDt: "",
      strEndDt: "",
      strDt: "",
    }
  );
  const {val:FILTER, set:setFILTER} = useStorage(
    `FILTER(${PATH})`, {
      order: "asc",
      type: "day",
      limit: 5,
      partIdx: 0,
      part: "전체",
      titleIdx: 0,
      title: "전체"
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
  const {val:CALENDAR, set:setCALENDAR} = useStorage(
    `CALENDAR(${PATH})`, {
      calStartOpen: false,
      calEndOpen: false,
      calOpen: false,
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const MONEY_PLAN_DEFAULT = {
    _id: "",
    money_plan_number: 0,
    money_plan_start: "",
    money_plan_end: "",
    money_plan_in: "",
    money_plan_out: ""
  };
  const [MONEY_PLAN, setMONEY_PLAN] = useState(MONEY_PLAN_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(DATE, setDATE, location_date);
  useTime(MONEY_PLAN, setMONEY_PLAN, DATE, setDATE, PATH, "plan");

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_MONEY_PLAN}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        money_plan_dur: DATE.strDur
      },
    });
    setMONEY_PLAN(response.data.result);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0,
    }));
  })()}, [user_id, DATE.strDur]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_MONEY_PLAN}/save`, {
      user_id: user_id,
      MONEY_PLAN: MONEY_PLAN,
      money_plan_dur: DATE.strDur
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
        <div className="row d-center">
          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text">시작일</span>
              <DatePicker
                dateFormat="yyyy-MM-dd"
                popperPlacement="bottom"
                className="form-control"
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
          </div>
        </div>
      );
    };

    // 2. endNode
    function endNode () {
      return (
        <div className="row d-center">
          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text">종료일</span>
              <DatePicker
                dateFormat="yyyy-MM-dd"
                popperPlacement="bottom"
                className="form-control"
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
          </div>
        </div>
      );
    };

    // 3. moneyNode
    function moneyNode () {
      return (
        <div className="row d-center mb-20">
          <div className="col-6">
            <div className="input-group">
              <span className="input-group-text">목표 수입</span>
              <input type="text" className="form-control"
                value={MONEY_PLAN?.money_plan_in}
                onChange={(e) => {
                  setMONEY_PLAN((prev) => ({
                    ...prev,
                    money_plan_in: e.target.value
                  }));
                }}
              />
            </div>
          </div>
          <div className="col-6">
            <div className="input-group">
              <span className="input-group-text">목표 지출</span>
              <input type="text" className="form-control"
                value={MONEY_PLAN?.money_plan_out}
                onChange={(e) => {
                  setMONEY_PLAN((prev) => ({
                    ...prev,
                    money_plan_out: e.target.value
                  }));
                }}
              />
            </div>
          </div>
        </div>
      );
    };

    // 5. return
    return (
      <div className="row d-center">
        <div className="col-4 mb-20">
          {startNode()}
        </div>
        <div className="col-4 mb-20">
          {endNode()}
        </div>
        <div className="col-8 mb-20">
          {moneyNode()}
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

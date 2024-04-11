// PlanMoneySave.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {DayPicker} from "react-day-picker";
import axios from "axios";
import {ko} from "date-fns/locale";
import moment from "moment-timezone";
import {DateNode} from "../../assets/fragments/DateNode.jsx";
import {CalendarNode} from "../../assets/fragments/CalendarNode.jsx";
import {PagingNode} from "../../assets/fragments/PagingNode.jsx";
import {FilterNode} from "../../assets/fragments/FilterNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const PlanMoneySave = () => {

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
      toList:"/plan/money/list"
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
  const {val:COUNT, set: setCOUNT} = useStorage(
    `COUNT(${PATH})`, {
      totalCnt: 0,
      sectionCnt: 0
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [PLAN_DEFAULT, setPLAN_DEFAULT] = useState({
    _id: "",
    plan_number: 0,
    plan_dur: "",
    plan_schema: "money",
    plan_money: {
      plan_in: "",
      plan_out: ""
    }
  });
  const [PLAN, setPLAN] = useState({
    _id: "",
    plan_number: 0,
    plan_dur: "",
    plan_schema: "money",
    plan_money: {
      plan_in: "",
      plan_out: ""
    }
  });

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_PLAN}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        plan_dur: DATE.strDur,
        plan_schema: "money",
      },
    });
    setPLAN(response.data.result ? response.data.result : PLAN_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt,
    }));
  })()}, [user_id, DATE.strDur]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_PLAN}/save`, {
      user_id: user_id,
      PLAN: PLAN,
      plan_dur: DATE.strDur,
      plan_schema: "money",
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
    function dayPicker (isOpen, setOpen, selectedDate, setSelectedDate) {
      return (
        <div className={`dayPicker-container ${isOpen ? "" : "d-none"}`}>
          <span className="d-right fw-700 pointer" style={{position: "absolute", right: "15px", top: "10px"}} onClick={() => setOpen(false)}>
            X
          </span>
          <div className="h-2"></div>
          <DayPicker
            weekStartsOn={1}
            showOutsideDays={true}
            locale={ko}
            modifiersClassNames={{
              selected:"selected", disabled:"disabled", outside:"outside", inside:"inside",
            }}
            mode="single"
            selected={selectedDate}
            month={selectedDate}
            onDayClick={(day) => {
              const selectedDay = new Date(day);
              const fmtDate = moment(selectedDay).format("YYYY-MM-DD");
              setSelectedDate(fmtDate);
              setOpen(false);
            }}
            onMonthChange={(month) => {
              setSelectedDate(new Date(month.getFullYear(), month.getMonth(), 1));
            }}
          />
        </div>
      );
    };
    function moneyNode () {
      return (
        <div>
          {/* <div className="row d-center mb-20">
            <div className="col-3">
              {dayPicker(calStartOpen, setCalendarStartOpen, DATE.strStartDt, DATE.setStrStartDt)}
              <div className="input-group">
                <p className={`btn btn-sm ${calStartOpen ? "btn-primary-outline" : "btn-primary"} m-5 input-group-text`} onClick={() => setCalendarStartOpen(!calStartOpen)}>
                  시작일
                </p>
                <input type="text" className="form-control" value={DATE.strStartDt} readOnly />
              </div>
            </div>
            <div className="col-3">
              {dayPicker(calEndOpen, setCalendarEndOpen, DATE.strEndDt, DATE.setEndDate)}
              <div className="input-group">
                <p className={`btn btn-sm ${calEndOpen ? "btn-primary-outline" : "btn-primary"} m-5 input-group-text`} onClick={() => setCalendarEndOpen(!calEndOpen)}>
                  종료일
                </p>
                <input type="text" className="form-control" value={DATE.strEndDt} readOnly />
              </div>
            </div>
          </div> */}
          <div className="row d-center mb-20">
            <div className="col-6">
              <div className="input-group">
                <span className="input-group-text">목표 수입</span>
                <input type="text" className="form-control" value={PLAN.plan_money.plan_in}
                  onChange={(e) => setPLAN({...PLAN, plan_money: {...PLAN.plan_money, plan_in: e.target.value}})}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="input-group">
                <span className="input-group-text">목표 지출</span>
                <input type="text" className="form-control" value={PLAN.plan_money.plan_out}
                  onChange={(e) => setPLAN({...PLAN, plan_money: {...PLAN.plan_money, plan_out: e.target.value}})}
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
            {moneyNode()}
          </div>
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
          <div className="col-12 mb-20 h-80">
            {tableNode()}
          </div>
        </div>
      </div>
    </div>
  );
};

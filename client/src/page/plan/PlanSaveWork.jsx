// PlanSaveWork.jsx

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
export const PlanSaveWork = () => {

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
    toList:"/plan/list/work"
  };

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:strStartDate, set:setStrStartDate} = useStorage(
    `strStartDate(${PATH})`, location_date
  );
  const {val:strEndDate, set:setStrEndDate} = useStorage(
    `strEndDate(${PATH})`, location_date
  );
  const {val:strDate, set:setStrDate} = useStorage(
    `strDate(${PATH})`, location_date
  );
  const {val:strDur, set:setStrDur} = useStorage(
    `strDur(${PATH})`, `${location_date} ~ ${location_date}`
  );
  const {val:calendarStartOpen, set:setCalendarStartOpen} = useStorage(
    `calendarStartOpen(${PATH})`, false
  );
  const {val:calendarEndOpen, set:setCalendarEndOpen} = useStorage(
    `calendarEndOpen(${PATH})`, false
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [PLAN_DEFAULT, setPLAN_DEFAULT] = useState({
    _id: "",
    plan_number: 0,
    plan_dur: "",
    plan_schema: "work",
    plan_work: {
      plan_count_total: "",
      plan_cardio_time: "",
      plan_score_name: "",
      plan_score_kg: "",
      plan_score_rep: "",
    },
  });
  const [PLAN, setPLAN] = useState({
    _id: "",
    plan_number: 0,
    plan_dur: "",
    plan_schema: "work",
    plan_work: {
      plan_count_total: "",
      plan_cardio_time: "",
      plan_score_name: "",
      plan_score_kg: "",
      plan_score_rep: "",
    },
  });

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_PLAN}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        plan_dur: strDur,
      },
    });

    setPLAN(response.data.result ? response.data.result : PLAN_DEFAULT);

  })()}, [strDur]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_PLAN}/save`, {
      user_id: user_id,
      PLAN: PLAN,
      plan_dur: `${strStartDate} ~ ${strEndDate}`,
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

    function workNode () {
      return (
        <div>
          <div className="row d-center mb-20">
            <div className="col-3">
              {dayPicker(calendarStartOpen, setCalendarStartOpen, strStartDate, setStrStartDate)}
              <div className="input-group">
                <p className={`btn btn-sm ${calendarStartOpen ? "btn-primary-outline" : "btn-primary"} m-5 input-group-text`} onClick={() => setCalendarStartOpen(!calendarStartOpen)}>
                  시작일
                </p>
                <input type="text" className="form-control" value={strStartDate} readOnly />
              </div>
            </div>
            <div className="col-3">
              {dayPicker(calendarEndOpen, setCalendarEndOpen, strEndDate, setStrEndDate)}
              <div className="input-group">
                <p className={`btn btn-sm ${calendarEndOpen ? "btn-primary-outline" : "btn-primary"} m-5 input-group-text`} onClick={() => setCalendarEndOpen(!calendarEndOpen)}>
                  종료일
                </p>
                <input type="text" className="form-control" value={strEndDate} readOnly />
              </div>
            </div>
          </div>
          <div className="row d-center mb-20">
            <div className="col-6">
              <div className="input-group">
                <span className="input-group-text">목표 운동 횟수</span>
                <input type="text" className="form-control" value={PLAN.plan_work.plan_count_total}
                  onChange={(e) => setPLAN({...PLAN, plan_work: {...PLAN.plan_work, plan_count_total: e.target.value}})}
                />
              </div>
            </div>
          </div>
          <div className="row d-center mb-20">
            <div className="col-6">
              <div className="input-group">
                <span className="input-group-text">목표 유산소 시간</span>
                <input type="text" className="form-control" value={PLAN.plan_work.plan_cardio_time}
                  onChange={(e) => setPLAN({...PLAN, plan_work: {...PLAN.plan_work, plan_cardio_time: e.target.value}})}
                />
              </div>
            </div>
          </div>
          <div className="row d-center mb-20">
            <div className="col-6">
              <div className="input-group">
                <span className="input-group-text">운동명</span>
                <input type="text" className="form-control" value={PLAN.plan_work.plan_score_name}
                  onChange={(e) => setPLAN({...PLAN, plan_work: {...PLAN.plan_work, plan_score_name: e.target.value}})}
                />
              </div>
            </div>
          </div>
          <div className="row d-center mb-20">
            <div className="col-6">
              <div className="input-group">
                <span className="input-group-text">중량</span>
                <input type="text" className="form-control" value={PLAN.plan_work.plan_score_kg}
                  onChange={(e) => setPLAN({...PLAN, plan_work: {...PLAN.plan_work, plan_score_kg: e.target.value}})}
                />
              </div>
            </div>
          </div>
          <div className="row d-center mb-20">
            <div className="col-6">
              <div className="input-group">
                <span className="input-group-text">횟수</span>
                <input type="text" className="form-control" value={PLAN.plan_work.plan_score_rep}
                  onChange={(e) => setPLAN({...PLAN, plan_work: {...PLAN.plan_work, plan_score_rep: e.target.value}})}
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
            {workNode()}
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

// FoodPlanSave.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {DayPicker} from "react-day-picker";
import axios from "axios";
import {ko} from "date-fns/locale";
import moment from "moment-timezone";
import {DateNode} from "../../../assets/fragments/DateNode.jsx";
import {CalendarNode} from "../../../assets/fragments/CalendarNode.jsx";
import {PagingNode} from "../../../assets/fragments/PagingNode.jsx";
import {FilterNode} from "../../../assets/fragments/FilterNode.jsx";
import {ButtonNode} from "../../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodPlanSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD_PLAN = process.env.REACT_APP_URL_FOOD_PLAN;
  const user_id = window.sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      startDt: "",
      endDt: "",
      refresh: 0,
      toList:"/food/plan/list"
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
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
  const [PLAN_DEFAULT, setPLAN_DEFAULT] = useState({
    _id: "",
    plan_number: 0,
    plan_schema: "food",
    plan_startDt: "",
    plan_endDt: "",
    plan_food: {
      plan_kcal: ""
    },
  });
  const [PLAN, setPLAN] = useState({
    _id: "",
    plan_number: 0,
    plan_schema: "food",
    plan_startDt: "",
    plan_endDt: "",
    plan_food: {
      plan_kcal: ""
    },
  });

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_FOOD_PLAN}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        food_plan_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setPLAN(response.data.result || PLAN_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0,
    }));
  })()}, [user_id, DATE.startDt, DATE.endDt]);;

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_FOOD_PLAN}/save`, {
      user_id: user_id,
      PLAN: PLAN,
      food_plan_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
    });
    if (response.data === "success") {
      alert("Save successfully");
      SEND.startDt = DATE.startDt;
      SEND.endDt = DATE.endDt;
      navParam(SEND.toList, {
        state: SEND
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
    function foodNode () {
      return (
        <div>
          {/* <div className="row d-center mb-20">
            <div className="col-3">
              {dayPicker(calStartOpen, setCalendarStartOpen, STARTDT, DATE.setStrStartDt)}
              <div className="input-group">
                <p className={`btn btn-sm ${calStartOpen ? "btn-primary-outline" : "btn-primary"} m-5 input-group-text`} onClick={() => setCalendarStartOpen(!calStartOpen)}>
                  시작일
                </p>
                <input type="text" className="form-control" value={STARTDT} readOnly />
              </div>
            </div>
            <div className="col-3">
              {dayPicker(calEndOpen, setCalendarEndOpen, ENDDT, DATE.setEndDate)}
              <div className="input-group">
                <p className={`btn btn-sm ${calEndOpen ? "btn-primary-outline" : "btn-primary"} m-5 input-group-text`} onClick={() => setCalendarEndOpen(!calEndOpen)}>
                  종료일
                </p>
                <input type="text" className="form-control" value={ENDDT} readOnly />
              </div>
            </div>
          </div> */}
          <div className="row d-center mb-20">
            <div className="col-6">
              <div className="input-group">
                <span className="input-group-text">칼로리</span>
                <input type="text" className="form-control" value={PLAN.plan_food.plan_kcal}
                  onChange={(e) => setPLAN({...PLAN, plan_food: {...PLAN.plan_food, plan_kcal: e.target.value}})}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="input-group">
                <span className="input-group-text">탄수화물</span>
                <input type="text" className="form-control" value={PLAN.plan_food.plan_carb}
                  onChange={(e) => setPLAN({...PLAN, plan_food: {...PLAN.plan_food, plan_carb: e.target.value}})}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="input-group">
                <span className="input-group-text">단백질</span>
                <input type="text" className="form-control" value={PLAN.plan_food.plan_protein}
                  onChange={(e) => setPLAN({...PLAN, plan_food: {...PLAN.plan_food, plan_protein: e.target.value}})}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="input-group">
                <span className="input-group-text">지방</span>
                <input type="text" className="form-control" value={PLAN.plan_food.plan_fat}
                  onChange={(e) => setPLAN({...PLAN, plan_food: {...PLAN.plan_food, plan_fat: e.target.value}})}
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
            {foodNode()}
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

// PlanSave.jsx

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
export const PlanSave = () => {

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
    toList:"/plan/list/real"
  };

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:sectionCount, set:setSectionCount} = useStorage(
    `sectionCount(${PATH})`, 0
  );

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
    plan_date: "",
    plan_real : {
      plan_section: [{
        plan_part_idx: 0,
        plan_part_val: "",
        plan_title_idx: 0,
        plan_title_val: "",
        plan_amount: 0,
        plan_content: "",
      }],
    }
  });
  const [PLAN, setPLAN] = useState({
    _id: "",
    plan_number: 0,
    plan_date: "",
    plan_real : {
      plan_section: [{
        plan_part_idx: 0,
        plan_part_val: "",
        plan_title_idx: 0,
        plan_title_val: "",
        plan_amount: 0,
        plan_content: "",
      }],
    }
  });

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_PLAN}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        plan_dur: strDur,
        planYn: "N",
      },
    });

    setSectionCount(response.data.sectionCount ? response.data.sectionCount : 0);
    setPLAN(response.data.result ? response.data.result : PLAN_DEFAULT);

  })()}, [strDur]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_PLAN}/save`, {
      user_id: user_id,
      PLAN: PLAN,
      plan_dur: strDur,
      planYn: "N"
    });
    if (response.data === "success") {
      alert("Save a plan successfully");
      STATE.date = strDate;
      navParam(STATE.toList);
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

  // 5. handler ----------------------------------------------------------------------------------->
  const handlerSectionCount = () => {
    function handlerCount (e) {
      let newCount = parseInt(e, 10);
      let defaultSection = {
        plan_part_idx: 0,
        plan_part_val: "전체",
        plan_title_idx: 0,
        plan_title_val: "전체",
        plan_amount: 0,
        plan_content: ""
      };

      if (newCount > sectionCount) {
        let additionalSections = Array(newCount - sectionCount).fill(defaultSection);
        let updatedSection = [...PLAN.plan_real.plan_section, ...additionalSections];
        setPLAN((prev) => ({
          ...prev,
          plan_real: {
            ...prev.plan_real,
            plan_section: updatedSection,
          },
        }));
      }
      else if (newCount < sectionCount) {
        let updatedSection = [...PLAN.plan_real.plan_section];
        updatedSection = updatedSection.slice(0, newCount);
        setPLAN((prev) => ({
          ...prev,
          plan_real: {
            ...prev.plan_real,
            plan_section: updatedSection,
          },
        }));
      }
      setSectionCount(newCount);
    };
    function inputFragment () {
      return (
        <div className="row d-center">
          <div className="col-4">
            <input
              type="number"
              value={sectionCount}
              min="0"
              className="form-control mb-30"
              onChange={(e) => (
                handlerCount(e.target.value)
              )}
            />
          </div>
        </div>
      );
    };
    return (
      <React.Fragment>
        {inputFragment()}
      </React.Fragment>
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    function tableSection (i) {
      return (
        <div key={i} className="mb-20">
        </div>
      );
    };
    function tableFragment () {
      return (
        <div className="row d-center">
          <div className="col-12">
            {Array.from({ length: sectionCount }, (_, i) => tableSection(i))}
          </div>
        </div>
      );
    };
    return (
      <React.Fragment>
        {tableFragment()}
      </React.Fragment>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode calendarOpen={""} setCalendarOpen={""}
        strDate={""} setStrDate={""}
        STATE={STATE} flowSave={flowSave} navParam={navParam}
        type="save"
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row mb-20 d-center">
          <div className="col-12">
            <h1>Save (Real)</h1>
          </div>
        </div>
        <div className="row d-center mb-20">
          <div className="col-12">
            {dateNode()}
          </div>
        </div>
        <div className="row d-center">
          <div className="col-12">
            {buttonNode()}
          </div>
        </div>
        <div className="row d-center mt-5">
          <div className="col-12">
            {handlerSectionCount()}
          </div>
        </div>
        <div className="row d-center mt-5">
          <div className="col-12">
            {tableNode()}
          </div>
        </div>
      </div>
    </div>
  );
};

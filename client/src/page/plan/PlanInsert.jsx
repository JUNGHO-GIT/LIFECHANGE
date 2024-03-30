// PlanInsert.jsx

import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment-timezone";
import {planPartArray, planTitleArray} from "../plan/PlanArray";
import {useStorage} from "../../assets/js/useStorage.jsx";
import {useDeveloperMode} from "../../assets/js/useDeveloperMode.jsx";

// ------------------------------------------------------------------------------------------------>
export const PlanInsert = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const TITLE = "Plan Insert";
  const URL_PLAN = process.env.REACT_APP_URL_PLAN;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  const navParam = useNavigate();
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [PLAN, setPLAN] = useState({});
  const [planCount, setPlanCount] = useState(1);
  const [planSection, setPlanSection] = useState([{
    plan_part_idx: 0,
    plan_part_val: "전체",
    plan_title_idx: 0,
    plan_title_val: "전체",
  }]);

  // 2-2. useStorage ------------------------------------------------------------------------------>
  const {val:planDay, setVal:setPlanDay} = useStorage (
    "planDay", new Date(koreanDate)
  );

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setPLAN ({
      ...PLAN,
      planDay: moment(planDay).format("YYYY-MM-DD"),
      planSection : planSection,
    });
  }, [planDay, planSection]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowPlanInsert = async () => {
    try {
      if (!user_id) {
        alert("Input a ID");
        return;
      }
      if (!planDay) {
        alert("Input a Day");
        return;
      }

      const response = await axios.post (`${URL_PLAN}/insert`, {
        user_id : user_id,
        PLAN : PLAN,
      });
      log("PLAN : " + JSON.stringify(PLAN));

      if (response.data === "success") {
        alert("Insert a plan successfully");
        navParam("/plan/list");
      }
      else {
        alert("Insert a plan failure");
      }
    }
    catch (e) {
      alert(`Error inserting plan data: ${e.message}`);
    }
  };

  // 4-1. handler --------------------------------------------------------------------------------->
  const handlePlanPartChange = (i, e) => {
    const newIndex = parseInt(e.target.value);
    setPlanSection((prev) => {
      const updatedSection = [...prev];
      updatedSection[i] = {
        ...updatedSection[i],
        plan_part_idx: newIndex,
        plan_part_val: planPartArray[newIndex].plan_part[0],
        plan_title_idx: 0,
        plan_title_val: planTitleArray[newIndex].plan_title[0],
      };
      return updatedSection;
    });
  };

  // 4-2. handler --------------------------------------------------------------------------------->
  const handlePlanTitleChange = (i, e) => {
    let newTitle = e.target.value;
    setPlanSection((prev) => {
      let updatedSection = [...prev];
      updatedSection[i].plan_title_val = newTitle;
      return updatedSection;
    });
  };

  // 4-3. handler --------------------------------------------------------------------------------->
  const handlePlanCountChange = () => {
    return (
      <div>
        <div className="row d-center">
          <div className="col-4">
            <input type="number" value={planCount} min="1" className="form-control mb-30"
            onChange={(e) => {
              let defaultSection = {
                plan_part_idx: 0,
                plan_part_val: "전체",
                plan_title_idx: 0,
                plan_title_val: "전체",
              };
              let newCount = parseInt(e.target.value);

              // amount 값이 증가했을 때 새로운 섹션들만 추가
              if (newCount > planCount) {
                let additionalSections = Array(newCount - planCount).fill(defaultSection);
                setPlanSection(prev => [...prev, ...additionalSections]);
              }
              // amount 값이 감소했을 때 마지막 섹션부터 제거
              else if (newCount < planCount) {
                setPlanSection(prev => prev.slice(0, newCount));
              }
              // planCount 값 업데이트
              setPlanCount(newCount);
            }}/>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-12">
            {Array.from({ length: planCount }, (_, i) => tablePlanSection(i))}
          </div>
        </div>
      </div>
    );
  };

  // 4. view -------------------------------------------------------------------------------------->
  const viewPlanDay = () => {
    const calcDate = (days) => {
      setPlanDay((prevDate) => {
        const newDate = prevDate ? new Date(prevDate) : new Date();
        newDate.setDate(newDate.getDate() + days);
        return newDate;
      });
    };
    return (
      <div className="d-inline-flex">
        <div className="black mt-4 me-5 pointer" onClick={() => calcDate(-1)}>
          &#8592;
        </div>
        <DatePicker
          dateFormat="yyyy-MM-dd"
          popperPlacement="bottom"
          selected={planDay}
          onChange={(date) => {
            setPlanDay(date);
          }}
        />
        <div className="black mt-4 ms-5 pointer" onClick={() => calcDate(1)}>
          &#8594;
        </div>
      </div>
    );
  };

  // 5-1. table ----------------------------------------------------------------------------------->
  const tablePlanInsert = () => {
    return (
      <div className="row d-center">
        <div className="col-5">
          <div className="input-group">
            <span className="input-group-text">ID</span>
            <input
              type="text"
              className="form-control"
              id="user_id"
              name="user_id"
              placeholder="ID"
              value={user_id ? user_id : ""}
              readOnly
              onChange={(e) => {
                setPLAN({ ...PLAN, user_id: e.target.value });
              }}
            />
          </div>
        </div>
        <div className="col-5">
          <div className="input-group">
            <span className="input-group-text">Day</span>
            <input
              readOnly
              type="text"
              className="form-control"
              id="planDay"
              name="planDay"
              placeholder="Day"
              value={PLAN?.planDay}
              onChange={(e) => {
                setPlanDay(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  // 5-2. table ----------------------------------------------------------------------------------->
  const tablePlanSection = (i) => {

    const updatePlanArray
    = planSection[i] && planTitleArray[planSection[i].plan_part_idx]
    ? planTitleArray[planSection[i].plan_part_idx]?.plan_title
   : [];

    return (
      <div key={i} className="mb-20">
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">대분류</span>
              <select
                className="form-control"
                id={`plan_part_idx-${i}`}
                onChange={(e) => handlePlanPartChange(i, e)}>
                {planPartArray.flatMap((key, index) => (
                  <option key={index} value={index}>
                    {key.plan_part[0]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">소분류</span>
              <select
                className="form-control"
                id={`plan_title_val-${i}`}
                onChange={(e) => handlePlanTitleChange(i, e)}>
                {updatePlanArray.flatMap((title, index) => (
                  <option key={index} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text">Content</span>
              <input
                type="text"
                className="form-control"
                id={`plan_content-${i}`}
                placeholder="content"
                value={planSection[i]?.plan_content}
                onChange={(e) => {
                  setPlanSection((prev) => {
                    const updatedSection = [...prev];
                    updatedSection[i].plan_content = e.target.value;
                    return updatedSection;
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonPlanInsert = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary" onClick={flowPlanInsert}>
        Insert
      </button>
    );
  };
  const buttonRefreshPage = () => {
    return (
      <button type="button" className="btn btn-sm btn-success ms-2" onClick={() => {
        navParam(0);
      }}>
        Refresh
      </button>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-7">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5 mb-5">
        <div className="col-12">
          <h1 className="mb-3 fw-5">
            <span>{viewPlanDay()}</span>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">
          {handlePlanCountChange()}
        </div>
      </div>
      <div className="row d-center mt-5 mb-20">
        <div className="col-12">
          {tablePlanInsert()}
          <br />
          {buttonPlanInsert()}
          {buttonRefreshPage()}
        </div>
        </div>
      </div>
    </div>
  );
};

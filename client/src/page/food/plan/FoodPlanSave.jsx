// FoodPlanSave.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {useDate} from "../../../assets/hooks/useDate.jsx";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment-timezone";
import {DateNode} from "../../../assets/fragments/DateNode.jsx";
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
  const FOOD_PLAN_DEFAULT = {
    _id: "",
    food_plan_number: 0,
    food_plan_startDt: "",
    food_plan_endDt: "",
    food_plan_kcal: 0,
    food_plan_carb: 0,
    food_plan_protein: 0,
    food_plan_fat: 0,
  };
  const [FOOD_PLAN, setFOOD_PLAN] = useState(FOOD_PLAN_DEFAULT);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_FOOD_PLAN}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        food_plan_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setFOOD_PLAN(response.data.result || FOOD_PLAN_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0,
    }));
  })()}, [user_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_FOOD_PLAN}/save`, {
      user_id: user_id,
      FOOD_PLAN: FOOD_PLAN,
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
      <DateNode DATE={DATE} setDATE={setDATE} part={"food"} plan={"plan"} type={"save"} />
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {

    // 1. startNode
    function startNode () {
      return (
        <div className={"row d-center"}>
          <div className={"col-12"}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>시작일</span>
              <DatePicker
                dateFormat="yyyy-MM-dd"
                popperPlacement="bottom"
                className={"form-control"}
                selected={new Date(DATE.startDt)}
                disabled={false}
                onChange={(date) => {
                  setDATE((prev) => ({
                    ...prev,
                    startDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD")
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
        <div className={"row d-center"}>
          <div className={"col-12"}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>종료일</span>
              <DatePicker
                dateFormat="yyyy-MM-dd"
                popperPlacement="bottom"
                className={"form-control"}
                selected={new Date(DATE.endDt)}
                disabled={false}
                onChange={(date) => {
                  setDATE((prev) => ({
                    ...prev,
                    endDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD")
                  }));
                }}
              ></DatePicker>
            </div>
          </div>
        </div>
      );
    };

    // 3. foodNode
    function foodNode () {
      return (
        <div className="row d-center mb-20">
          <div className={"col-6"}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>칼로리(하루섭취량)</span>
              <input
                type={"number"}
                className={"form-control"}
                value={FOOD_PLAN?.food_plan_kcal}
                onChange={(e) => {
                  setFOOD_PLAN((prev) => ({
                    ...prev,
                    food_plan_kcal: Number(e.target.value)
                  }));
                }}
              />
            </div>
          </div>
          <div className={"col-6"}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>탄수화물(하루섭취량)</span>
              <input
                type={"number"}
                className={"form-control"}
                value={FOOD_PLAN?.food_plan_carb}
                onChange={(e) => {
                  setFOOD_PLAN((prev) => ({
                    ...prev,
                    food_plan_carb: Number(e.target.value)
                  }));
                }}
              />
            </div>
          </div>
          <div className={"col-6"}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>단백질(하루섭취량)</span>
              <input
                type={"number"}
                className={"form-control"}
                value={FOOD_PLAN?.food_plan_protein}
                onChange={(e) => {
                  setFOOD_PLAN((prev) => ({
                    ...prev,
                    food_plan_protein: Number(e.target.value)
                  }));
                }}
              />
            </div>
          </div>
          <div className={"col-6"}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>지방(하루섭취량)</span>
              <input
                type={"number"}
                className={"form-control"}
                value={FOOD_PLAN?.food_plan_fat}
                onChange={(e) => {
                  setFOOD_PLAN((prev) => ({
                    ...prev,
                    food_plan_fat: Number(e.target.value)
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
      <div className={"row d-center"}>
        <div className="col-4 mb-20">
          {startNode()}
        </div>
        <div className="col-4 mb-20">
          {endNode()}
        </div>
        <div className="col-8 mb-20">
          {foodNode()}
        </div>
      </div>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} flowSave={flowSave} navParam={navParam}
        part={"food"} plan={"plan"} type={"save"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className={"root-wrapper"}>
      <div className={"container-wrapper"}>
        <div className={"row d-center"}>
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

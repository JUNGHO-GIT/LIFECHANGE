// FoodSavePlan.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/js/useStorage.jsx";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment-timezone";
import {BiCaretLeft, BiCaretRight} from "react-icons/bi";

// ------------------------------------------------------------------------------------------------>
export const FoodSavePlan = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const location_date = location?.state?.date;
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;
  const STATE = {
    id: "",
    date: "",
    refresh:0,
    toList:"/food/list/plan",
    toSave:"/food/save/plan",
    toSearch:"/food/search",
  };

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:strStartDate, set:setStrStartDate} = useStorage(
    `strStartDate(${PATH})`, koreanDate
  );
  const {val:strEndDate, set:setStrEndDate} = useStorage(
    `strEndDate(${PATH})`, koreanDate
  );
  const {val:strDate, set:setStrDate} = useStorage(
    `strDate(${PATH})`, location_date
  );
  const {val:strDur, set:setStrDur} = useStorage(
    `strDur(${PATH})`, `${location_date} ~ ${location_date}`
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const {val:FOOD_DEFAULT, set:setFOOD_DEFAULT} = useStorage(
    `FOOD_DEFAULT(${PATH})`, {
      _id: "",
      food_number: 0,
      food_date: "",
      food_plan : {
        food_total_kcal: "",
        food_total_fat: "",
        food_total_carb: "",
        food_total_protein: ""
      },
    }
  );
  const {val:FOOD, set:setFOOD} = useStorage(
    `FOOD(${PATH})`, {
      _id: "",
      food_number: 0,
      food_date: "",
      food_plan : {
        food_total_kcal: "",
        food_total_fat: "",
        food_total_carb: "",
        food_total_protein: ""
      },
    }
  );

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setStrDate(location_date);
    setStrDur(`${location_date} ~ ${location_date}`);
  }, [location_date]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setFOOD((prev) => ({
      ...prev,
      food_date: strDur
    }));
  }, [strDur]);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_FOOD}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        food_dur: strDur,
        planYn: "Y",
      },
    });

    setFOOD(response.data.result ? response.data.result : FOOD_DEFAULT);

  })()}, [strDur]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_FOOD}/save`, {
      user_id: user_id,
      FOOD: FOOD,
      food_dur: strDur,
      planYn: "Y"
    });
    if (response.data === "success") {
      alert("Save a food successfully");
      navParam(STATE.toList);
    }
    else {
      alert(`${response.data}error`);
    }
  };

  // 6. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <table className="table bg-white table-hover">
        <thead className="table-primary">
          <tr>
            <th>kcal</th>
            <th>fat</th>
            <th>carb</th>
            <th>protein</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                type="text"
                className="form-control"
                value={FOOD.food_plan.food_total_kcal}
                onChange={(e) => {
                  setFOOD((prev) => ({
                    ...prev,
                    food_plan: {
                      ...prev.food_plan,
                      food_total_kcal: e.target.value
                    }
                  }));
                }}
              />
            </td>
            <td>
              <input
                type="text"
                className="form-control"
                value={FOOD.food_plan.food_total_fat}
                onChange={(e) => {
                  setFOOD((prev) => ({
                    ...prev,
                    food_plan: {
                      ...prev.food_plan,
                      food_total_fat: e.target.value
                    }
                  }));
                }}
              />
            </td>
            <td>
              <input
                type="text"
                className="form-control"
                value={FOOD.food_plan.food_total_carb}
                onChange={(e) => {
                  setFOOD((prev) => ({
                    ...prev,
                    food_plan: {
                      ...prev.food_plan,
                      food_total_carb: e.target.value
                    }
                  }));
                }}
              />
            </td>
            <td>
              <input
                type="text"
                className="form-control"
                value={FOOD.food_plan.food_total_protein}
                onChange={(e) => {
                  setFOOD((prev) => ({
                    ...prev,
                    food_plan: {
                      ...prev.food_plan,
                      food_total_protein: e.target.value
                    }
                  }));
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    function buttonSave () {
      return (
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={() => {
            localStorage.removeItem(`FOOD(${PATH})`);
            flowSave()
          }}
        >
          Save
        </button>
      );
    };
    function buttonRefresh () {
      return (
        <button
          type="button"
          className="btn btn-sm btn-success ms-2"
          onClick={() => {
            localStorage.removeItem(`FOOD(${PATH})`);
            navParam(STATE.refresh);
          }}
        >
          Refresh
        </button>
      );
    };
    return (
      <div className="d-inline-flex">
        {buttonSave()}
        {buttonRefresh()}
      </div>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row mb-20 d-center">
          <div className="col-12">
            <h1>Plan</h1>
          </div>
        </div>
        <div className="row mb-20 d-center">
          <div className="col-12">
            {tableNode()}
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
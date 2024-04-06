// FoodSearchDetail.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/js/useStorage.jsx";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const FoodSearchDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const location_food = location?.state?.food;
  const PATH = location.pathname;
  const STATE = {
    id: "",
    date: koreanDate,
    refresh: 0,
    intoSave:"/food/save",
    food: {
      planYn: "",
      category: "",
      food_title: "",
      food_brand: "",
      food_preServ: "",
      food_subServ: "",
      food_gram: "",
      food_kcal: "",
      food_fat: "",
      food_carb: "",
      food_protein: ""
    }
  };

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:strStartDate, set:setStrStartDate} = useStorage(
    `strStartDate(${PATH})`, koreanDate
  );
  const {val:strEndDate, set:setStrEndDate} = useStorage(
    `strEndDate(${PATH})`, koreanDate
  );
  const {val:strDate, set:setStrDate} = useStorage(
    `strDate(${PATH})`, koreanDate
  );
  const {val:strDur, set:setStrDur} = useStorage(
    `strDur(${PATH})`, `${koreanDate} ~ ${koreanDate}`
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const {val:FOOD, set:setFOOD} = useStorage(
    `FOOD(${PATH})`, {
      title: "",
      brand: "",
      preServ: "",
      subServ: "",
      gram: "",
      kcal: "",
      fat: "",
      carb: "",
      protein: ""
    }
  );

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setFOOD(location_food);
  }, [location_food]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (!location_food) {
      return;
    }
    else {
      setFOOD((prev) => ({
        ...prev,
        gram: (prev.preServ / location_food.preServ) * location_food.gram,
        kcal: (prev.preServ / location_food.preServ) * location_food.kcal,
        fat: ((prev.preServ / location_food.preServ) * location_food.fat).toFixed(2),
        carb: ((prev.preServ / location_food.preServ) * location_food.carb).toFixed(2),
        protein: ((prev.preServ / location_food.preServ) * location_food.protein).toFixed(2)
      }));
    }
  }, [FOOD.preServ]);

  // 5. table ------------------------------------------------------------------------------------->
  const tableFoodDetail = () => {
    return (
      <table className="table bg-white table-hover">
        <thead className="table-primary">
          <tr>
            <th>title</th>
            <th>brand</th>
            <th>serving</th>
            <th>gram</th>
            <th>kcal</th>
            <th>fat</th>
            <th>carb</th>
            <th>protein</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{FOOD.title}</td>
            <td>{FOOD.brand}</td>
            <td>
              <input
                type="number"
                className="form-control"
                value={FOOD.preServ}
                min="1"
                max="100"
                onChange={(e) => {
                  setFOOD({
                    ...FOOD,
                    preServ: e.target.value
                  });
                }}
              />
              {FOOD.subServ}
            </td>
            <td>{FOOD.gram}</td>
            <td>{FOOD.kcal}</td>
            <td>{FOOD.fat}</td>
            <td>{FOOD.carb}</td>
            <td>{FOOD.protein}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonSaveFood = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary ms-2" onClick={() => {
        navParam(STATE.intoSave, {
          state: STATE
        });
      }}>
        Save
      </button>
    );
  };
  const buttonRefreshPage = () => {
    return (
      <button type="button" className="btn btn-sm btn-success ms-2" onClick={() => {
        navParam(STATE.refresh);
      }}>
        Refresh
      </button>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row mb-20">
          <div className="col-12 d-center">
            <h1>{location_food.category} ({location_food.planYn === "Y" ? "Plan" : "Real"})</h1>
          </div>
        </div>
        <div className="row d-center mt-5 mb-20">
          <div className="col-12">
            {tableFoodDetail()}
          </div>
        </div>
        <div className="row d-center mt-5">
          <div className="col-12">
            {buttonSaveFood()}
            {buttonRefreshPage()}
          </div>
        </div>
      </div>
    </div>
  );
};
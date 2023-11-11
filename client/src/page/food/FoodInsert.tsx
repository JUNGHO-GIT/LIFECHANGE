// FoodInsert.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import axios from "axios";
import moment from "moment-timezone";

// 1. main ---------------------------------------------------------------------------------------->
export const FoodInsert = () => {

  // title
  const TITLE = "Food Insert";
  // url
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  // date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");
  const {title, brand, serving, calories, fat, carb, protein} = location.state;
  // state
  const [showGram, setShowGram] = useState(1);
  const [category, setCategory] = useState("morning");

  // 2. useEffect --------------------------------------------------------------------------------->

  // 3. flow -------------------------------------------------------------------------------------->
  const flowFoodInsert = async (params:any) => {

    const FOOD = {
      user_id : user_id,
      food_title: title,
      food_brand: brand,
      food_category: category,
      food_serving: params,
      food_calories: logicPerServing(params, calories),
      food_carb: logicPerServing(params, carb),
      food_protein: logicPerServing(params, protein),
      food_fat: logicPerServing(params, fat),
    };

    const response = await axios.post(`${URL_FOOD}/foodInsert`, {
      user_id : user_id,
      FOOD : FOOD
    });
    if (response.data === "success") {
      alert("Insert food successfully");
      navParam(`/foodSearch`);
    }
    else {
      alert(`${response.data}error`);
    }
  };

  // 4-1. logic ----------------------------------------------------------------------------------->
  const logicPerServing = (param: number, nutrientVal: number) => {
    return ((nutrientVal / logicOneServing()) * param).toFixed(1);
  };

  // 4-2. logic ----------------------------------------------------------------------------------->
  const logicOneServing = () => {

    const units = [
      {regex: /(g|ml)/gm, replace: ["g", "ml"], factor: 1},
      {regex: /(컵)/gm, replace: ["컵"], factor: 200},
      {regex: /(큰술|테이블스푼)/gm, replace: ["큰술", "테이블스푼"], factor: 15},
      {regex: /(작은술|스푼|티스푼)/gm, replace: ["작은술", "스푼", "티스푼"], factor: 5},
    ];

    for (const unit of units) {
      const match = serving.match(new RegExp(`(\\d+)(\\s*)(${unit.regex.source})`, "gm"));
      if (match) {
        let regexVal = match[0];
        unit.replace.forEach((index) => (regexVal = regexVal.replace(index, "")));
        return Number(regexVal) * unit.factor;
      }
    }
    return 1;
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableFoodInsert = (
    servingAmount: number, title: string, nutrientVal: number
  ) => (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">{title}</h4>
        <p className="card-text">
          <span>칼로리 : </span>
          {servingAmount ? logicPerServing(servingAmount, nutrientVal) : 0}
        </p>
        <p className="card-text">
          <span>지방 : </span>
          {fat ? fat : 0}
        </p>
        <p className="card-text">
          <span>탄수화물 : </span>
          {carb ? carb : 0}
        </p>
        <p className="card-text">
          <span>단백질 : </span>
          {protein ? protein : 0}
        </p>
      </div>
    </div>
  );

  // 6. button ------------------------------------------------------------------------------------>
  const buttonFoodCategory = () => {
    return (
      <select className="form-select"onChange={e => {setCategory(e.target.value);}}>
        <option value="morning">아침</option>
        <option value="lunch">점심</option>
        <option value="dinner">저녁</option>
        <option value="snack">간식</option>
      </select>
    );
  };
  const buttonFoodAmount = () => {
    return (
      <input type="number" className="form-control" defaultVal={1} min="1"
        onChange={e => {
          const value = Math.max(1, Number(e.target.value));
          setShowGram(value);
        }}
      />
    );
  };
  const buttonFoodInsert = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary" onClick={() => {
        flowFoodInsert(showGram);
      }}>
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

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="container">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-7">{TITLE}</h1>
        </div>
        <div className="col-10">
          <h1 className="mb-3">
            <p>{title}</p>
            <p>{brand}</p>
          </h1>
        </div>
        <div className="col-6">{tableFoodInsert(0, serving ? serving : "0", calories)}</div>
        <div className="col-6">{tableFoodInsert(showGram, showGram.toString(), calories)}</div>
        <div className="col-6">
          <div className="input-group">
            {buttonFoodCategory()}
            {buttonFoodAmount()}
          </div>
        </div>
      </div>
      <div className="row d-center mb-20">
        <div className="col-12">
          {buttonFoodInsert()}
          {buttonRefreshPage()}
        </div>
      </div>
    </div>
  );
};
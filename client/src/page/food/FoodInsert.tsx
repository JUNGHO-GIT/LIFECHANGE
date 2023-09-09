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
  // val 1
  const user_id = window.sessionStorage.getItem("user_id");
  // val 2
  const title = location.state.title;
  const brand = location.state.brand;
  const serving = location.state.serving;
  const calories = location.state.calories ;
  const fat = location.state.fat;
  const carb = location.state.carb;
  const protein = location.state.protein;
  // state
  const [showGram, setShowGram] = useState(1);
  const [category, setCategory] = useState("morning");

  // 2. useEffect --------------------------------------------------------------------------------->

  // 3. flow -------------------------------------------------------------------------------------->
  const flowFoodInsert = async (params: any) => {

    const caloriesPer:any = ((calories/logicOneServing())*(Number(params))).toFixed(1);
    const carbPer:any = ((carb/logicOneServing())*(Number(params))).toFixed(1);
    const proteinPer:any = ((protein/logicOneServing())*(Number(params))).toFixed(1);
    const fatPer:any = ((fat/logicOneServing())*(Number(params))).toFixed(1);

    try {
      const response  = await axios.post(`${URL_FOOD}/foodInsert`, {
        user_id : user_id,
        food_title : title,
        food_brand : brand,
        food_category: category,
        food_serving : params,
        food_calories : caloriesPer,
        food_carb : carbPer,
        food_protein : proteinPer,
        food_fat : fatPer
      });
      if (response.data === "success") {
        alert("Insert food successfully");
        window.location.href = "/foodSearch";
      }
      else if (response.data === "fail") {
        alert("Insert food failed");
      }
      else {
        alert(`${response.data}error`);
      }
    }
    catch (err) {
      console.error(err);
      alert("Insert food failed");
    }
  };

  // 4. logic ------------------------------------------------------------------------------------->
  const logicOneServing = () => {
    const servingValue = serving.toString();
    const units = [
      { regex: /(g|ml)/gm, replace: ["g", "ml"], factor: 1 },
      { regex: /(컵)/gm, replace: ["컵"], factor: 200 },
      { regex: /(큰술|테이블스푼)/gm, replace: ["큰술", "테이블스푼"], factor: 15 },
      { regex: /(작은술|스푼|티스푼)/gm, replace: ["작은술", "스푼", "티스푼"], factor: 5 }
    ];

    for (const unit of units) {
      const match = servingValue.match(new RegExp(`(\\d+)(\\s*)(${unit.regex.source})`, "gm"));
      if (match) {
        let regexValue = match[0];
        unit.replace.forEach(index => regexValue = regexValue.replace(index, ""));
        return Number(regexValue) * unit.factor;
      }
    }
    return 1;
  };

  // 5-1. table ----------------------------------------------------------------------------------->
  const tableTotalServing = () => {
    return (
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">
            {serving ? serving : 0}
          </h4>
          <p className="card-text">
            <span>칼로리 : </span>
            {calories ? calories : 0}
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
  };

  // 5-2. table ----------------------------------------------------------------------------------->
  const tablePerServing = (params: any) => {

    const caloriesPer:any = ((calories/logicOneServing())*(Number(params))).toFixed(1);
    const carbPer:any = ((carb/logicOneServing())*(Number(params))).toFixed(1);
    const proteinPer:any = ((protein/logicOneServing())*(Number(params))).toFixed(1);
    const fatPer:any = ((fat/logicOneServing())*(Number(params))).toFixed(1);

    return (
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">
            {params}
          </h4>
          <p className="card-text">
            <span>칼로리 : </span>
            {caloriesPer ? caloriesPer : 0}
          </p>
          <p className="card-text">
            <span>지방 : </span>
            {fatPer ? fatPer : 0}
          </p>
          <p className="card-text">
            <span>탄수화물 : </span>
            {carbPer ? carbPer : 0}
          </p>
          <p className="card-text">
            <span>단백질 : </span>
            {proteinPer ? proteinPer : 0}
          </p>
        </div>
      </div>
    );
  };

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
  const buttonFoodSelect = () => {
    return (
      <input type="number" className="form-control" defaultValue={1} min="1"
        onChange={e => {
          const value = Math.max(1, Number(e.target.value));
          setShowGram(value);
        }}
      />
    );
  };
  const buttonFoodInsert = () => {
    return (
      <button type="button" className="btn btn-primary" onClick={() => {
        flowFoodInsert(showGram);
      }}>
        Insert
      </button>
    );
  };
  const buttonRefreshPage = () => {
    return (
      <button type="button" className="btn btn-success ms-2" onClick={() => {
        window.location.reload();
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
          <h1 className="mb-3 fw-9">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-10">
          <h1 className="mb-3"><span>{title}</span><span>{brand}</span></h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-6">
          {tableTotalServing()}
        </div>
        <div className="col-6">
          {buttonFoodCategory()}
          {tablePerServing(showGram)}
          {buttonFoodSelect()}
          {buttonFoodInsert()}
          {buttonRefreshPage()}
        </div>
      </div>
    </div>
  );
};
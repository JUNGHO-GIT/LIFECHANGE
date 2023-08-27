// FoodInsert.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from 'react-router-dom';

// ------------------------------------------------------------------------------------------------>
export const FoodInsert = () => {

  // ---------------------------------------------------------------------------------------------->
  const [showGram, setShowGram] = useState(0);
  const [category, setCategory] = useState("");
  const URL = "http://localhost:4000/food";
  const TITLE = "Food Insert";
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const user_id = window.sessionStorage.getItem("user_id");

  // ---------------------------------------------------------------------------------------------->
  const title:any = params.get("title") ? params.get("title") : "x";
  const brand:any = params.get("brand") ? params.get("brand") : "x";
  const serving:any = params.get("serving");
  const calories:any = Number(params.get("calories"));
  const fat:any = Number(params.get("fat"));
  const carb:any = Number(params.get("carb"));
  const protein:any = Number(params.get("protein"));

  // ---------------------------------------------------------------------------------------------->
  const totalServTable = () => {
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

  // ---------------------------------------------------------------------------------------------->
  const oneServCalc = () => {
    const servingValue = serving.toString();
    const units = [
      { regex: /(g|ml)/gm, replace: ["g", "ml"], factor: 1 },
      { regex: /(컵)/gm, replace: ["컵"], factor: 200 },
      { regex: /(큰술|테이블스푼)/gm, replace: ["큰술", "테이블스푼"], factor: 15 },
      { regex: /(작은술|스푼|티스푼)/gm, replace: ["작은술", "스푼", "티스푼"], factor: 5 }
    ];

    for (const unit of units) {
      const match = servingValue.match(new RegExp(`(\\d+)(\\s*)(${unit.regex.source})`, 'gm'));
      if (match) {
        let regexValue = match[0];
        unit.replace.forEach(index => regexValue = regexValue.replace(index, ""));
        return Number(regexValue) * unit.factor;
      }
    }
    return 1;
  };

  // ---------------------------------------------------------------------------------------------->
  const perServTable = (params: any) => {

    const caloriesPer:any = ((calories/oneServCalc())*(Number(params))).toFixed(1);
    const carbPer:any = ((carb/oneServCalc())*(Number(params))).toFixed(1);
    const proteinPer:any = ((protein/oneServCalc())*(Number(params))).toFixed(1);
    const fatPer:any = ((fat/oneServCalc())*(Number(params))).toFixed(1);

    const foodInsertFlow = async () => {
      try {
        const res  = await axios.post(`${URL}/foodInsert`, {
          user_id : user_id,
          food_name : title,
          food_brand : brand,
          food_category: category,
          food_serving : params,
          food_calories : caloriesPer,
          food_carb : carbPer,
          food_protein : proteinPer,
          food_fat : fatPer
        });
        if (res.data === "success") {
          alert("Insert food successfully");
          window.location.href = "/foodList";
        }
        else if (res.data === "fail") {
          alert("Insert food failed");
        }
        else {
          alert(`${res.data}error`);
        }
      }
      catch (err) {
        console.error(err);
        alert("Insert food failed");
      }
    };

    const foodInsertTable = () => {
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

    const buttonFoodInsert = () => {
      return (
        <button className="btn btn-primary" onClick={foodInsertFlow}>Insert</button>
      );
    };

    const categoryFoodInsert = () => {
      return (
        <select className="form-select"onChange={e => {setCategory(e.target.value);}}>
          <option value="morning" selected>아침</option>
          <option value="lunch">점심</option>
          <option value="dinner">저녁</option>
          <option value="snack">간식</option>
        </select>
      );
    };

    const inputFoodInsert = () => {
      return (
        <input type="number" className="form-control" defaultValue={1} min="1"
          onChange={e => {
            const value = Math.max(1, Number(e.target.value));
            setShowGram(value);
          }}
        />
      );
    };

    return (
      <div className="row d-flex justify-content-center">
        <div className="col-6">
          {foodInsertTable()}
        </div>
        <div className="col-6">
          {categoryFoodInsert()}
          <br/><br/>
          {inputFoodInsert()}
          <br/><br/>
          {buttonFoodInsert()}
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container">
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-9">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-10">
          <h1 className="mb-3"><span>{title}</span><span>{brand}</span></h1>
        </div>
      </div>
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-6">
          {totalServTable()}
        </div>
        <div className="col-6">
          {perServTable(showGram)}
        </div>
      </div>
    </div>
  );
};
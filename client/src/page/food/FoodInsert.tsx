// FoodInsert.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from 'react-router-dom';

// ------------------------------------------------------------------------------------------------>
const FoodInsert = () => {
  const [showGram, setShowGram] = useState(0);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const user_id = window.sessionStorage.getItem("user_id");
  const title:any = params.get("title") ? params.get("title") : "x";
  const brand:any = params.get("brand") ? params.get("brand") : "x";
  const calories:any = Number(params.get("calories"));
  const fat:any = Number(params.get("fat"));
  const carb:any = Number(params.get("carb"));
  const protein:any = Number(params.get("protein"));
  const serving:any = params.get("serving");

  // ---------------------------------------------------------------------------------------------->
  const [category, setCategory] = useState("");
  const handleCategoryChange = (e: any) => {
    setCategory(e.target.value);
  };

  // ---------------------------------------------------------------------------------------------->
  const totalServing = () => {

    return (
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">{serving ? serving : 0}</h4>
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
  const oneServing = () => {
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
  const perServing = (params: any) => {

    const paramsValue = Number(params);
    const oneServingValue:any = oneServing();
    const caloriesPer:any = ((calories/oneServingValue)*(paramsValue)).toFixed(1);
    const carbPer:any = ((carb/oneServingValue)*(paramsValue)).toFixed(1);
    const proteinPer:any = ((protein/oneServingValue)*(paramsValue)).toFixed(1);
    const fatPer:any = ((fat/oneServingValue)*(paramsValue)).toFixed(1);

    // 음식 상세정보를 보낸다.
    const FoodInsertFlow = async () => {
      try {
        const res  = await axios.post("http://localhost:4000/food/foodInsert", {
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

    return (
      <>
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">{params}</h4>
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
      <button type="button" className="btn btn-primary" onClick={FoodInsertFlow}>
        음식 추가하기
      </button>
      </>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container">
      <div className="empty-h50"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-12">
          <h1 className="mb-3 fw-9">Food Insert</h1>
        </div>
      </div>
      <div className="empty-h50"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-10">
          <h1 className="mb-3">{title}</h1>
          <h2 className="mb-3">{brand}</h2>
        </div>
      </div>
      <div className="empty-h50"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-6">{totalServing()}</div>
        <div className="col-6">{perServing(showGram)}</div>
      </div>
      <div className="empty-h50"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-4">
          <select className="form-select" onChange={handleCategoryChange}>
            <option selected>카테고리</option>
            <option value="morning">아침</option>
            <option value="lunch">점심</option>
            <option value="dinner">저녁</option>
            <option value="snack">간식</option>
          </select>
        </div>
        <div className="col-4">
          <input type="number" className="form-control" onChange={e => setShowGram(Number(e.target.value))} />
        </div>
      </div>
      <div className="empty-h200"></div>
    </div>
  );
};

export default FoodInsert;

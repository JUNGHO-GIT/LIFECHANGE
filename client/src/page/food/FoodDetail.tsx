// FoodDetail.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { createGlobalStyle } from "styled-components";

// ------------------------------------------------------------------------------------------------>
const FoodDetailStyle = createGlobalStyle`
  .foodDetail {
    display: flex;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
  }

  .form-foodDetail {
    max-width: 330px;
    padding: 15px;
  }

  .form-foodDetail .form-floating:focus-within {
    z-index: 2;
  }
`;

// ------------------------------------------------------------------------------------------------>
const FoodDetail = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const user_id = window.sessionStorage.getItem("user_id");
  const [showGram, setShowGram] = useState(0);
  const title:any = params.get("title") ? params.get("title") : "x";
  const brand:any = params.get("brand") ? params.get("brand") : "x";
  const calories:any = Number(params.get("calories"));
  const fat:any = Number(params.get("fat"));
  const carb:any = Number(params.get("carb"));
  const protein:any = Number(params.get("protein"));
  const serving:any = params.get("serving");

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

    // 용량 파악 가능한것
    const regexRules1 = servingValue.match(/(\d+)(\s*)g/gm);
    const regexRules2 = servingValue.match(/(\d+)(\s*)ml/gm);
    const regexRules3 = servingValue.match(/(\d+)(\s*)컵/gm);
    const regexRules4 = servingValue.match(/(\d+)(\s*)큰술/gm);
    const regexRules5 = servingValue.match(/(\d+)(\s*)작은술/gm);
    const regexRules6 = servingValue.match(/(\d+)(\s*)스푼/gm);
    const regexRules7 = servingValue.match(/(\d+)(\s*)테이블스푼/gm);
    const regexRules8 = servingValue.match(/(\d+)(\s*)티스푼/gm);

    // 단순 숫자만 리턴하기 위함
    if (regexRules1) {
      const regexValue = (regexRules1[0].replace("g", "")) * 1;
      return Number(regexValue);
    }
    else if (regexRules2) {
      const regexValue = (regexRules2[0].replace("ml", "")) * 1;
      return Number(regexValue);
    }
    else if (regexRules3) {
      const regexValue = (regexRules3[0].replace("컵", "")) * 200;
      return Number(regexValue);
    }
    else if (regexRules4) {
      const regexValue = (regexRules4[0].replace("큰술", "")) * 15;
      return Number(regexValue);
    }
    else if (regexRules5) {
      const regexValue = (regexRules5[0].replace("작은술", "")) * 5;
      return Number(regexValue);
    }
    else if (regexRules6) {
      const regexValue = (regexRules6[0].replace("스푼", "")) * 5;
      return Number(regexValue);
    }
    else if (regexRules7) {
      const regexValue = (regexRules7[0].replace("테이블스푼", "")) * 15;
      return Number(regexValue);
    }
    else if (regexRules8) {
      const regexValue = (regexRules8[0].replace("티스푼", "")) * 5;
      return Number(regexValue);
    }
    else {
      return 1;
    }
  }
  // ---------------------------------------------------------------------------------------------->
  const perServing = (params: any) => {

    const paramsValue = Number(params);
    const oneServingValue:any = oneServing();

    const caloriesPer:any = ((calories/oneServingValue)*(paramsValue)).toFixed(1);
    const carbPer:any = ((carb/oneServingValue)*(paramsValue)).toFixed(1);
    const proteinPer:any = ((protein/oneServingValue)*(paramsValue)).toFixed(1);
    const fatPer:any = ((fat/oneServingValue)*(paramsValue)).toFixed(1);

    // 음식 상세정보를 보낸다.
    const buttonFoodFlow = async () => {
      try {
        const res  = await axios.post("http://localhost:4000/food/foodInsert", {
          user_id : user_id,
          food_name : title,
          food_brand : brand,
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
      <br/>
      <button type="button" className="btn btn-primary" onClick={buttonFoodFlow}>
        음식 추가하기
      </button>
      </>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container"><FoodDetailStyle />
      <div className="empty-h100"></div>
        <div className="row">
          <div className="col-12">
            <h1 className="mb-3">{title}</h1>
            <h2 className="mb-3">{brand}</h2>
            <div className="empty-h20"></div>
          </div>
          <div className="col-6">
            {totalServing()}
          </div>
          <div className="col-6">
            {perServing(showGram)}
          </div>
        </div>
        <br/>
        <div className="row">
          <div className="col-12">
            <input type="number" className="form-control" onChange={e => setShowGram(Number(e.target.value))} />
          </div>
        </div>
      <div className="empty-h100"></div>
    </div>
  );
};

export default FoodDetail;

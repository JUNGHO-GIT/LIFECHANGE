import React, { useState, useEffect } from "react";
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
  const [showPerGram, setShowPerGram] = useState(0);

  const title:any = params.get("title");
  const brand:any = params.get("brand");

  const calories:any = Number(params.get("calories"));
  const fat:any = Number(params.get("fat"));
  const carb:any = Number(params.get("carb"));
  const protein:any = Number(params.get("protein"));
  const serving:any = params.get("serving");

  // ---------------------------------------------------------------------------------------------->
  const totalGram = () => {
    return (
      <>
      <h5 className="card-title">
        {title ? title : "x"}
      </h5>
      <p className="card-text">
        <span>브랜드 : </span>
        {brand ? brand : "x"}
      </p>
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
      <p className="card-text">
        <span>용량 : </span>
        {serving ? serving : 0}
      </p>
      </>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const oneGram = () => {
    const servingValue = serving.toString();
    const regexRules = /(\d+)g/gm;
    const match = servingValue.match(regexRules);

    if (match) {
      const regexValue = match[0].replace("g", "");
      return Number(regexValue);
    }
  };

  // ---------------------------------------------------------------------------------------------->
  const perGram = (params: any) => {

    const oneGramValue:any = oneGram();
    const paramsValue = Number(params);

    const caloriesPer:any = ((calories/oneGramValue)*(paramsValue)).toFixed(1);
    const fatPer:any = ((fat/oneGramValue)*(paramsValue)).toFixed(1);
    const carbPer:any = ((carb/oneGramValue)*(paramsValue)).toFixed(1);
    const proteinPer:any = ((protein/oneGramValue)*(paramsValue)).toFixed(1);

    return (
      <>
      <p className="card-text">
        <span>칼로리 : </span>
        {caloriesPer ? caloriesPer : "x"}
      </p>
      <p className="card-text">
        <span>지방 : </span>
        {fatPer ? fatPer : "x"}
      </p>
      <p className="card-text">
        <span>탄수화물 : </span>
        {carbPer ? carbPer : "x"}
      </p>
      <p className="card-text">
        <span>단백질 : </span>
        {proteinPer ? proteinPer : "x"}
      </p>
      </>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <>
      <FoodDetailStyle />
      <div className="empty-h100"></div>
      <div className="container">
        <div className="card">
          <div className="card-body">
            {totalGram()}
          </div>
        </div>
        <div className="empty-h20"></div>
        <div className="input-group">
          <input type="number" className="form-control" placeholder="그램 수 입력" onChange={e => setShowPerGram(Number(e.target.value))} />
        </div>
        <div className="empty-h20"></div>
        <div className="card">
          <div className="card-body">
            {showPerGram > 0 && perGram(showPerGram)}
          </div>
        </div>
      </div>
      <div className="empty-h100"></div>
    </>
  );
};

export default FoodDetail;

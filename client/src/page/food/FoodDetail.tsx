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
  const totalServing = () => {
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

  // 1 중간크기

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

    // 용량 파악 불가능한것
    const regexRules9 = servingValue.match(/(\d+)(\s*)(조각|장|개|쪽|통|팩|회.*크기)/gm);

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
  };

  // ---------------------------------------------------------------------------------------------->
  const perGram = (params: any) => {

    const oneServingValue:any = oneServing();
    const paramsValue = Number(params);

    const caloriesPer:any = ((calories/oneServingValue)*(paramsValue)).toFixed(1);
    const fatPer:any = ((fat/oneServingValue)*(paramsValue)).toFixed(1);
    const carbPer:any = ((carb/oneServingValue)*(paramsValue)).toFixed(1);
    const proteinPer:any = ((protein/oneServingValue)*(paramsValue)).toFixed(1);

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
        <div className="row">
          <div className="col-6">
            <div className="card">
              <div className="card-body">
                {totalServing()}
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="empty-h20"></div>
            <div className="input-group">
              <input type="number" className="form-control" placeholder="그램 수 입력"
              onChange={e => setShowPerGram(Number(e.target.value))} />
            </div>
            <div className="empty-h20"></div>
            <div className="card">
              <div className="card-body">
                {showPerGram > 0 && perGram(showPerGram)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="empty-h100"></div>
    </>
  );
};

export default FoodDetail;

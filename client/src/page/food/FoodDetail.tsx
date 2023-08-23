import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import { useParams } from "react-router-dom";
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
  return (
    <div className="container">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{params.get("title")}</h5>
          <p className="card-text">{params.get("brand")}</p>
          <p className="card-text">{params.get("calories")} 칼로리</p>
          <p className="card-text">{params.get("food")} 지방</p>
          <p className="card-text">{params.get("carb")} 탄수화물</p>
          <p className="card-text">{params.get("protein")} 단백질</p>
          <p className="card-text">{params.get("serving")}</p>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;

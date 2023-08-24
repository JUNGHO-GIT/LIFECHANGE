import React, { useState, useEffect } from "react";
import axios from "axios";
import FoodInterface from "./FoodInterface";
import { createGlobalStyle } from "styled-components";

// ------------------------------------------------------------------------------------------------>
const FoodTotalStyle = createGlobalStyle`
  .foodTotal {
    display: flex;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
  }

  .form-foodTotal {
    max-width: 330px;
    padding: 15px;
  }

  .form-foodTotal .form-floating:focus-within {
    z-index: 2;
  }
`;

// ------------------------------------------------------------------------------------------------>
const FoodTotal = () => {
  const [foods, setFoods] = useState<FoodInterface[]>([]);

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchFoodDetail = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:4000/food/foodTotal`);
        setFoods(response.data);
      }
      catch (err) {
        console.error(err);
        setFoods([]);
      }
    };

    fetchFoodDetail();
  }, []);
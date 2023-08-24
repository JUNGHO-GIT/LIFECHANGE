import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { createGlobalStyle } from "styled-components";

const FoodTotal = () => {
  const { user_id, food_regdate }
  = useParams<{ user_id: string; food_regdate: string }>();
  
  const [total, setTotal] = useState({
    totalCalories: 0,
    totalProtein: 0,
    totalCarb: 0,
    totalFat: 0
  });

  useEffect(() => {
    const fetchFoodTotal = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:4000/food/foodTotal/${user_id}/${food_regdate}`
        );
        setTotal(response.data);
      }
      catch (err) {
        alert('데이터를 불러오는 데 실패했습니다.');
      }
    };
    fetchFoodTotal();
  }, [user_id, food_regdate]);

  return(
    <div className="foodTotal">
      <div className="empty-h30"></div>
      <div className="form-foodTotal">
        <h1>{food_regdate}</h1>
        <h2>{user_id}</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>총 칼로리</th>
              <th>총 단백질</th>
              <th>총 탄수화물</th>
              <th>총 지방</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{total.totalCalories}</td>
              <td>{total.totalProtein}</td>
              <td>{total.totalCarb}</td>
              <td>{total.totalFat}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FoodTotal;

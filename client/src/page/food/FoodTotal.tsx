import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
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
interface FoodTotal {
  totalDate : string;
  totalCalories : number;
  totalProtein : number;
  totalCarb : number;
  totalFat : number;
}

// ------------------------------------------------------------------------------------------------>
const FoodTotal = () => {
  const [foods, setFoods] = useState<FoodTotal[]>([]);
  const { user_id } = useParams<{ user_id: string }>();
  const { food_date } = useParams<{ food_date: string }>();

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchFoodDetail = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:4000/food/foodTotal/${user_id}/${food_date}`);
        console.log(response.data);
        setFoods(response.data);
      }
      catch (err) {
        console.error(err);
        setFoods([]);
      }
    };
    fetchFoodDetail();
  }, [user_id, food_date]);

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="foodTotal">
      <FoodTotalStyle />
      <div className="form-foodTotal">
        <h1>총 칼로리</h1>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>날짜</th>
              <th>총 칼로리</th>
              <th>총 단백질</th>
              <th>총 탄수화물</th>
              <th>총 지방</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food) => (
              <tr key={food.totalDate.toString()}>
                <td>{food.totalDate}</td>
                <td>{food.totalCalories}</td>
                <td>{food.totalProtein}</td>
                <td>{food.totalCarb}</td>
                <td>{food.totalFat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FoodTotal;
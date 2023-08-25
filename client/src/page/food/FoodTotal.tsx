// FoodTotal.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { createGlobalStyle } from "styled-components";

// ------------------------------------------------------------------------------------------------>
const FoodTotalStyle = createGlobalStyle`
`;

// ------------------------------------------------------------------------------------------------>
const FoodTotal = () => {
  const [foodResultAll, setFoodResultAll] = useState([]);
  const [foodResultMorning, setFoodResultMorning] = useState([]);
  const [foodResultLunch, setFoodResultLunch] = useState([]);
  const [foodResultDinner, setFoodResultDinner] = useState([]);
  const [foodResultSnack, setFoodResultSnack] = useState([]);

  const user_id = useLocation().state.user_id;
  const food_regdate = useLocation().state.food_regdate;

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchFoodTotal = async () => {
      try {
        const response = await axios.post (
          `http://127.0.0.1:4000/food/foodTotal/`, {
            user_id: user_id,
            food_regdate: food_regdate,
          }
        );
        setFoodResultAll(response.data.foodResultAll);
        setFoodResultMorning(response.data.foodResultMorning);
        setFoodResultLunch(response.data.foodResultLunch);
        setFoodResultDinner(response.data.foodResultDinner);
        setFoodResultSnack(response.data.foodResultSnack);
      }
      catch (err) {
        alert("fail to load values");
      }
    };
    fetchFoodTotal();
  }, [user_id, food_regdate]);

  // ---------------------------------------------------------------------------------------------->
  const foodArrayTable = () => {

    const titleArray = [
      "전부", "아침", "점심", "저녁", "간식",
    ];
    const tableArray = [
      foodResultAll, foodResultMorning, foodResultLunch, foodResultDinner, foodResultSnack
    ];

    return (
      <div>
        {titleArray.map((title, index) => (
          <div key={index}>
            <h1>{title}</h1>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>음식 이름</th>
                  <th>칼로리</th>
                  <th>단백질</th>
                  <th>탄수화물</th>
                  <th>지방</th>
                </tr>
              </thead>
              <tbody>
                {tableArray[index].map((foodItem: any) => (
                  <tr key={foodItem.food_id}>
                    <td>{foodItem.food_name ? foodItem.food_name : "x"}</td>
                    <td>{foodItem.food_calories ? foodItem.food_calories : 0}</td>
                    <td>{foodItem.food_protein ? foodItem.food_protein : 0}</td>
                    <td>{foodItem.food_carb ? foodItem.food_carb : 0}</td>
                    <td>{foodItem.food_fat ? foodItem.food_fat : 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return(
    <div className="container"><FoodTotalStyle />
      <div className="empty-h30"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-12">
          <h1>총 섭취 영양소</h1>
          <div className="empty-h30"></div>
        </div>
      </div>
      <div className="row d-flex justify-content-center">
        <div className="col-8">
          <h1>{food_regdate}</h1>
          <h2>{user_id}</h2>
          <div className="empty-h30"></div>
            {foodArrayTable()}
          <div className="empty-h100"></div>
        </div>
      </div>
    </div>
  );
};

export default FoodTotal;
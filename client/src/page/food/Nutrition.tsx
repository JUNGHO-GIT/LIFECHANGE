import React, { useState } from "react";
import axios from "axios";
/**
"brand_name": "IHOP",
"food_description": "Per 1 serving - Calories: 1200kcal | Fat: 67.00g | Carbs: 113.00g | Protein: 36.00g",
"food_id": "68959496",
"food_name": "(1) Classic Crispy Chicken Sandwich with Fries For Burger Family Feast",
"food_type": "Brand",
"food_url": "https://www.fatsecret.com/calories-nutrition/ihop/(1)-classic-crispy-chicken-sandwich-with-fries-for-burge
**/

const Nutrition = () => {
  const [foodList, setFoodList] = useState<any[]>([]);
  const [foodName, setFoodName] = useState("");

  const searchCalories = async () => {
    try {
      const searchResponse = await axios.post("http://127.0.0.1:4000/nutrition/nutritionList", {
        foodName: foodName
      });
      console.log(searchResponse.data);
      setFoodList(searchResponse.data);
    }
    catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h1>영양소</h1>
      <input type="text" onChange={(e) => setFoodName(e.target.value)} />
      <button onClick={searchCalories}>검색</button>
      <table>
        <thead>
          <tr>
            <th>이름</th>
            <th>칼로리</th>
            <th>탄수화물</th>
            <th>단백질</th>
            <th>지방</th>
          </tr>
        </thead>
        <tbody>
          {foodList.map((food, index) => (
            <tr key={index}>
              <td>{food.food_name}</td>
              <td>{food.food_description.split("|")[0].split(":")[1]}</td>
              <td>{food.food_description.split("|")[1].split(":")[1]}</td>
              <td>{food.food_description.split("|")[2].split(":")[1]}</td>
              <td>{food.food_description.split("|")[3].split(":")[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Nutrition;

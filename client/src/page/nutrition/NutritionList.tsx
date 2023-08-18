import React, { useState } from "react";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
const NutritionList = () => {
  const [foodList, setFoodList] = useState<any[]>([]);
  const [foodName, setFoodName] = useState("");
  const [food_id, setFood_id] = useState("");

  const searchCalories = async () => {
    try {
      const searchResponse = await axios.post("http://127.0.0.1:4000/nutrition/nutritionList", {
        foodName: foodName
      });
      console.log(searchResponse.data);
      setFoodList(searchResponse.data.foods.food);
    }
    catch (err) {
      console.log(err);
    }
  };

  // ---------------------------------------------------------------------------------------------->
  const refreshNutritionList = () => {
    window.location.reload();
  };

  const buttonNutritionDetail = (food_id: string) => {
    window.location.href = "/nutritionDetail/" + food_id;
  };

  function getVolume(description: string) {
    const volumeMatch = description.match(/Per (.+?) -/);
    return volumeMatch ? volumeMatch[1] : '';
  }

  // ---------------------------------------------------------------------------------------------->
  return (
    <>
      <h1>영양소</h1>
      <input type="text" onChange={(e) => setFoodName(e.target.value)} />
      <button onClick={searchCalories}>검색</button>
      <table className="table-bordered">
        <thead>
          <tr>
            <th>식품코드</th>
            <th>이름</th>
            <th>용량</th>
            <th>칼로리</th>
            <th>탄수화물</th>
            <th>단백질</th>
            <th>지방</th>
          </tr>
        </thead>
        <tbody>
          {foodList.map((food, index) => (
            <tr key={index}>
              <td>
                <a onClick={() => buttonNutritionDetail(food.food_id)}
                  className="text-hover"
                >
                  {food.food_id}
                </a>
              </td>
              <td>{food.food_name}</td>
              <td>{getVolume(food.food_description)}</td>
              <td>{food.food_description.split("|")[0].split(":")[1]}</td>
              <td>{food.food_description.split("|")[2].split(":")[1]}</td>
              <td>{food.food_description.split("|")[3].split(":")[1]}</td>
              <td>{food.food_description.split("|")[1].split(":")[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default NutritionList;

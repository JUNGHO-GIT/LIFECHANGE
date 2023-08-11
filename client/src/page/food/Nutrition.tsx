import React, { useState } from "react";
import axios from "axios";
/**
"foods": {
  "food": [
    {
      "brand_name": "Athletic Brewing Co.",
      "food_description": "Per 1 can - Calories: 65kcal | Fat: 0.00g | Carbs: 14.00g | Protein: 0.00g",
      "food_id": "37714057",
      "food_name": "Run Wild NA IPA",
      "food_type": "Brand",
      "food_url": "https://www.fatsecret.com/calories-nutrition/athletic-brewing-co/run-wild-na-ipa"
    },
    {
      "brand_name": "Lucky Me",
      "food_description": "Per 1 pack - Calories: 240kcal | Fat: 9.00g | Carbs: 33.00g | Protein: 5.00g",
      "food_id": "4384632",
      "food_name": "Beef Na Beef Instant Mami Noodles",
      "food_type": "Brand",
      "food_url": "https://www.fatsecret.com/calories-nutrition/lucky-me/beef-na-beef-instant-mami-noodles"
    },
  ]
}
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

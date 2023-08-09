import React, { useState } from 'react';
import axios from 'axios';

interface IFoodData {
  food_name: string;
  calories: number;
  nutrient: any;
}

const NutritionList = () => {
  const [foodName, setFoodName] = useState<string>('');
  const [foodData, setFoodData] = useState<IFoodData | null>(null);

  // fatscret
  const handleSearch = async () => {
    try {
      const res = await axios({

        method: 'GET',
        url: 'http://www.fatsecret.com/calories-nutrition/generic',
        params: {
          method: 'foods.search.v2',
          food_name: foodName,
        },
      });
      console.log(res.data);
      setFoodData(res.data);
    }
    catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <input value={foodName} onChange={(e) => setFoodName(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
      {foodData && (
        <div>
          <h3>{foodData.food_name}</h3>
          <p>Calories: {foodData.calories}</p>
          <p>Nutrients: {JSON.stringify(foodData.nutrient)}</p>
        </div>
      )}
    </div>
  );
}
export default NutritionList;

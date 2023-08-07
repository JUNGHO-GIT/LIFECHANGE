import React, { useState } from 'react';
import axios, { AxiosResponse } from 'axios';

interface Food {
  food_name: string;
  food_description: string;
}

interface FatSecretResponse {
  foods: {
    food: Food[];
  };
}

const NutritionList = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Food[]>([]);

  const search = async () => {
    try {
      const response = await axios.post<FatSecretResponse>('http://localhost:5000/nutrition/search', { query });
      setResults(response.data.foods.food);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="NutritionList">
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={search}>Search</button>
      {results && results.map((food, index) => (
        <div key={index}>
          <p>{food.food_name}: {food.food_description}</p>
        </div>
      ))}
    </div>
  );
}

export default NutritionList;

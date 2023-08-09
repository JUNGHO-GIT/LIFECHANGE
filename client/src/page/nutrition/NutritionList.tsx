import React, { useState } from 'react';
import axios from 'axios';

type Food = {
  food_name: string;
  food_description: string;
};

const NutritionList = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [results, setResults] = useState<Food[]>([]);

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:4000/nutrition/search', { searchTerm });
      setResults(response.data.foods.food);
    } catch (err) {
      console.error(err);
      alert('검색 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <h1>음식 검색</h1>
      <div>
        <input
          type="text"
          placeholder="음식을 입력하세요"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>검색</button>
      </div>
      <div>
        {results && results.length > 0 ? (
          <ul>
            {results.map((food, index) => (
              <li key={index}>{food.food_name} - {food.food_description}</li>
            ))}
          </ul>
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default NutritionList;

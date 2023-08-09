import React, { useState } from 'react';
import axios from 'axios';


const NutritionList = () => {

  const [search, setSearch] = useState('');
  const [foodList, setFoodList] = useState<any[]>([]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  const searchFood = () => {
    axios.get(`http://openapi.foodsafetykorea.go.kr/api/715fe7af70994e9fa08e/I2790/json/1/5/DESC_KOR=${search}`)
    .then((res) => {
      console.log(res);
      setFoodList(res.data.I2790.row);
    })
    .catch((err) => {
      console.log(err);
    })
  }

  return (
    <div>
      <input type="text" value={search} onChange={onChange} />
      <button onClick={searchFood}>검색</button>
      <ul>
        {foodList.map((food) => (
          <li key={food.PRDLST_REPORT_NO}>{food.PRDLST_NM}</li>
        ))}
      </ul>
    </div>
  )
};

export default NutritionList;
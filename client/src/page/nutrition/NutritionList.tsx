import React, { useState } from 'react';
import axios from 'axios';

const NutritionList = () => {

  const [foodSearch, setFoodSearch] = useState('');
  const [foodList, setFoodList] = useState<any[]>([]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFoodSearch(e.target.value);
  }

  const searchFood = () => {
    axios.get(`http://openapi.foodsafetykorea.go.kr/api/715fe7af70994e9fa08e/I2790/json/1/5/DESC_KOR=${foodSearch}`)
    .then((res) => {
      console.log(res.data);
      setFoodList(res.data.I2790.row);
    })
    .catch((err) => {
      console.log(err);
    })
  }

  // ---------------------------------------------------------------------------------------------->
  const resultFoodList = () => {
    return (
      <>
        {foodList.map((food) => {
          return (
            <tr key={food.FOOD_CD}>
              <td>{food.DESC_KOR}</td>
              <td>{food.MAKER_NAME}</td>
              <td>{food.SERVING_SIZE}</td>
              <td>{food.NUTR_CONT1}</td>
              <td>{food.NUTR_CONT2}</td>
              <td>{food.NUTR_CONT3}</td>
              <td>{food.NUTR_CONT4}</td>
              <td>{food.NUTR_CONT5}</td>
            </tr>
          )
        })}
      </>
    )
  }

  // ---------------------------------------------------------------------------------------------->
  return (
    <div>
      {/* <BoardListStyle /> */}
      <section className="boardList custom-flex-center">
        <form>
          <div className="empty-h50"></div>
          <h1 className="mb-3">Board List</h1>
          <div className="empty-h20"></div>
          <table className="border border-1 border-dark">
            <thead>
              <tr className="border-end border-1 border-dark">
                <th>식품이름</th>
                <th>제조사명</th>
                <th>총내용량</th>
                <th>열량(kcal)</th>
                <th>탄수화물(g)</th>
                <th>단백질(g)</th>
                <th>지방(g)</th>
                <th>당류(g)</th>
                <th>나트륨(mg)</th>
              </tr>
            </thead>
            <tbody>
              {resultFoodList()}
            </tbody>
          </table>
          <div className="empty-h100"></div>
          <div className="d-flex justify-content-center">
            <input type="text" value={foodSearch} onChange={onChange} className="form-control" placeholder="식품이름" />
            <button type="button" className="btn btn-primary" onClick={searchFood}>
              Search
            </button>
          </div>
          <div className="empty-h50"></div>
        </form>
      </section>
    </div>
  );
};

export default NutritionList;
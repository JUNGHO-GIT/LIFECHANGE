import React, { useState } from "react";
import axios from "axios";
import {createGlobalStyle} from "styled-components";

// ------------------------------------------------------------------------------------------------>
const FoodListStyle = createGlobalStyle`
  .foodList {
    display: flex;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
  }

  .form-foodList {
    max-width: 330px;
    padding: 15px;
  }

  .form-foodList .form-floating:focus-within {
    z-index: 2;
  }
`;

// ------------------------------------------------------------------------------------------------>
const FoodList = () => {

  const [foodName, setFoodName] = useState("");
  const [foodList, setFoodList] = useState<any[]>([]);
  const URL = `http://openapi.foodsafetykorea.go.kr/api/715fe7af70994e9fa08e/I2790/json`;

  // ---------------------------------------------------------------------------------------------->
  const searchFood = async () => {
    await axios.get(`${URL}/1/10/DESC_KOR=${foodName}`)
    .then((res) => {
      setFoodList(res.data.I2790.row);
    })
    .catch((err) => {
      console.log(err);
    })
  };

  // ---------------------------------------------------------------------------------------------->
  const refreshFoodList = () => {
    window.location.reload();
  };

  const buttonFoodDetail = (foodCD: string) => {
    window.location.href = "/foodDetail/" + foodCD;
  };

  // ---------------------------------------------------------------------------------------------->
  const resultFoodList = () => {
    return (
      <>
        <thead>
          <tr className="border border-1 border-dark">
            <th className="border-end border-1 border-dark">년도</th>
            <th className="border-end border-1 border-dark">식품이름</th>
            <th className="border-end border-1 border-dark">제조사명</th>
            <th className="border-end border-1 border-dark">총내용량</th>
            <th className="border-end border-1 border-dark">열량(kcal)</th>
            <th className="border-end border-1 border-dark">탄수화물(g)</th>
            <th className="border-end border-1 border-dark">단백질(g)</th>
            <th className="border-end border-1 border-dark">지방(g)</th>
            <th className="border-end border-1 border-dark">당(g)</th>
          </tr>
        </thead>
        <tbody>
          {foodList.map((food) => {
            return (
              <tr key={food.FOOD_CD} className="border border-1 border-dark">
                <td className="border-end border-1 border-dark">
                 {food.RESEARCH_YEAR === "" || undefined ? "0" : food.RESEARCH_YEAR}
                </td>
                <td className="border-end border-1 border-dark">
                  <a href="#" onClick={() => buttonFoodDetail(food.FOOD_CD)} className="text-hover">
                    {food.DESC_KOR === "" || undefined ? "0" : food.DESC_KOR}
                  </a>
                </td>
                <td className="border-end border-1 border-dark">
                  {food.MAKER_NAME === "" || undefined ? "0" : food.MAKER_NAME}
                </td>
                <td className="border-end border-1 border-dark">
                  {food.SERVING_SIZE === "" || undefined ? "0" : food.SERVING_SIZE}
                </td>
                <td className="border-end border-1 border-dark">
                  {food.NUTR_CONT1 === "" || undefined ? "0" : food.NUTR_CONT1}
                </td>
                <td className="border-end border-1 border-dark">
                  {food.NUTR_CONT2 === "" || undefined ? "0" : food.NUTR_CONT2}
                </td>
                <td className="border-end border-1 border-dark">
                  {food.NUTR_CONT3 === "" || undefined ? "0" : food.NUTR_CONT3}
                </td>
                <td className="border-end border-1 border-dark">
                  {food.NUTR_CONT4 === "" || undefined ? "0" : food.NUTR_CONT4}
                </td>
                <td className="border-end border-1 border-dark">
                  {food.NUTR_CONT5 === "" || undefined ? "0" : food.NUTR_CONT5}
                </td>
              </tr>
            )
          })}
        </tbody>
      </>
    )
  }


  // ---------------------------------------------------------------------------------------------->
  return (
    <>
      <FoodListStyle />
      <section className="foodList custom-flex-center">
        <form>
          <div className="empty-h50"></div>
          <h1 className="mb-3">Food List</h1>
          <div className="empty-h20"></div>
          <table className="border border-3 border-dark">
            {resultFoodList()}
          </table>
          <div className="empty-h100"></div>
          <div className="d-flex justify-content-center">
            <input type="text" className="form-control" placeholder="Search" aria-label="Search" onChange={(e) => setFoodName(e.target.value)} />
            <button type="button" className="btn btn-primary" onClick={searchFood}>
              Search
            </button>
          </div>
          <br/>
          <button type="button" className="btn btn-success" onClick={refreshFoodList}>
            Refresh
          </button>
          <div className="empty-h50"></div>
        </form>
      </section>
    </>
  );
};

export default FoodList;
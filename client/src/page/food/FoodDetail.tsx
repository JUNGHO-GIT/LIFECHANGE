import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { createGlobalStyle } from "styled-components";

// ------------------------------------------------------------------------------------------------>
const FoodDetailStyle = createGlobalStyle`
  .foodDetail {
    display: flex;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
  }

  .form-foodDetail {
    max-width: 330px;
    padding: 15px;
  }

  .form-foodDetail .form-floating:focus-within {
    z-index: 2;
  }
`;

// ------------------------------------------------------------------------------------------------>
interface Food {
  FOOD_CD: string,
  DESC_KOR: string,
  RESEARCH_YEAR: string,
  MAKER_NAME: string,
  SERVING_SIZE: string,
  NUTR_CONT1: string,
  NUTR_CONT2: string,
  NUTR_CONT3: string,
  NUTR_CONT4: string,
  NUTR_CONT5: string
}

// ------------------------------------------------------------------------------------------------>
const FoodDetail = () => {
  const {FOOD_CD} = useParams<{ FOOD_CD: string }>();
  const [food, setFood] = useState<Food | null>(null);
  const URL = `http://openapi.foodsafetykorea.go.kr/api/715fe7af70994e9fa08e/I2790/json`;

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchFoodDetail = async () => {
      await axios.get(`${URL}/1/1/FOOD_CD=${FOOD_CD}`)
      .then((res) => {
        setFood(res.data.I2790.row[0]);
      })
      .catch((err) => {
        console.log(err);
      })
    };
    fetchFoodDetail();
  }, [FOOD_CD]);

  // ---------------------------------------------------------------------------------------------->
  const refreshFoodDetail = () => {
    window.location.reload();
  };

  const buttonFoodList = () => {
    window.location.href = "/foodList";
  };

  // ---------------------------------------------------------------------------------------------->
  const resultFoodDetail = () => {
    return (
      <>
        <tbody>
          <tr>
            <th>식품코드</th>
            <td>{food?.FOOD_CD}</td>
          </tr>
          <tr>
            <th>식품이름</th>
            <td>{food?.DESC_KOR}</td>
          </tr>
          <tr>
            <th>년도</th>
            <td>{food?.RESEARCH_YEAR}</td>
          </tr>
          <tr>
            <th>제조사</th>
            <td>{food?.MAKER_NAME}</td>
          </tr>
          <tr>
            <th>1회제공량</th>
            <td>{food?.SERVING_SIZE}</td>
          </tr>
          <tr>
            <th>에너지</th>
            <td>{food?.NUTR_CONT1}</td>
          </tr>
          <tr>
            <th>탄수화물</th>
            <td>{food?.NUTR_CONT2}</td>
          </tr>
          <tr>
            <th>단백질</th>
            <td>{food?.NUTR_CONT3}</td>
          </tr>
          <tr>
            <th>지방</th>
            <td>{food?.NUTR_CONT4}</td>
          </tr>
          <tr>
            <th>당류</th>
            <td>{food?.NUTR_CONT5}</td>
          </tr>
        </tbody>
      </>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div>
      <FoodDetailStyle />
      <section className="foodDetail custom-flex-center">
        <form>
          <div className="empty-h50"></div>
          <h1 className="mb-3">Food Detail</h1>
          <div className="empty-h20"></div>
          <table className="table table-striped table-bordered">
            {resultFoodDetail()}
          </table>
          <div className="empty-h20"></div>
          <button className="btn btn-success" type="button" onClick={refreshFoodDetail}>
            Refresh
          </button>
          &nbsp;
          <button className="btn btn-primary" type="button" onClick={() => buttonFoodList()}>
            List
          </button>
        </form>
      </section>
    </div>
  );
};

export default FoodDetail;
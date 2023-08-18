import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { createGlobalStyle } from "styled-components";

// ------------------------------------------------------------------------------------------------>
const NutritionDetailStyle = createGlobalStyle`
  .nutritionDetail {
    display: flex;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
  }

  .form-nutritionDetail {
    max-width: 330px;
    padding: 15px;
  }

  .form-nutritionDetail .form-floating:focus-within {
    z-index: 2;
  }
`;

// ------------------------------------------------------------------------------------------------>
type FoodData = {
  food: {
    food_name: string;
    servings: {
      serving: {
        calories: string;
        carbohydrate: string;
        protein: string;
        fat: string;
        metric_serving_amount: string;
        metric_serving_unit: string;
      }[] | {
        calories: string;
        carbohydrate: string;
        protein: string;
        fat: string;
        metric_serving_amount: string;
        metric_serving_unit: string;
      };
    };
  };
};

// ------------------------------------------------------------------------------------------------>
const NutritionDetail = () => {
  const {food_id} = useParams<{ food_id: string }>();
  const [food, setFood] = useState<FoodData | null>(null);

  useEffect(() => {
    const fetchNutritionDetail = async () => {
      await axios.get<FoodData>(`http://127.0.0.1:4000/nutrition/nutritionDetail/${food_id}`)
      .then((res) => {
        setFood(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
    };
    fetchNutritionDetail();
  }, [food_id]);

  // ---------------------------------------------------------------------------------------------->
  const renderServing = () => {
    const serving = Array.isArray(food?.food.servings.serving)
      ? food?.food.servings.serving[0]
      : food?.food.servings.serving;
    return (
      <>
        <thead>
          <tr>
            <th>이름</th>
            <th>용량</th>
            <th>단위</th>
            <th>칼로리</th>
            <th>탄수화물</th>
            <th>단백질</th>
            <th>지방</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{food?.food.food_name}</td>
            <td>{serving?.metric_serving_amount}</td>
            <td>{serving?.metric_serving_unit}</td>
            <td>{serving?.calories}</td>
            <td>{serving?.carbohydrate}</td>
            <td>{serving?.protein}</td>
            <td>{serving?.fat}</td>
          </tr>
        </tbody>
      </>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const refreshNutritionDetail = () => {
    window.location.reload();
  };

  const buttonNutritionList = () => {
    window.location.href = "/nutritionList";
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <>
    <NutritionDetailStyle />
    <section className="nutritionDetail custom-flex-center">
      <form>
        <div className="empty-h50"></div>
        <h1 className="mb-3">Nutrition Detail</h1>
        <div className="empty-h20"></div>
        <table className="table-bordered">
          {renderServing()}
        </table>
        <div className="empty-h20"></div>
        <button className="btn btn-success" type="button" onClick={refreshNutritionDetail}>
          Refresh
        </button>
        &nbsp;
        <button className="btn btn-primary" type="button" onClick={() => buttonNutritionList()}>
          List
        </button>
        <div className="empty-h50"></div>
      </form>
    </section>
    </>
  );
};

export default NutritionDetail;
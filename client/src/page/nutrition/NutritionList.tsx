import React, { useState } from "react";
import axios from "axios";

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
const NutritionList = () => {
  const [foodList, setFoodList] = useState<any[]>([]);
  const [foodName, setFoodName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pagesToShow = 5;
  const itemsPerPage = 10;

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
    return (volumeMatch ? volumeMatch[1] : '');
  }

  // ---------------------------------------------------------------------------------------------->
  // 현재 페이지의 항목만 표시
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = foodList.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 번호 생성
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(foodList.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = () => {
    let pages = [];
    let startPage = Math.max(currentPage - Math.floor(pagesToShow / 2), 1);
    let endPage = Math.min(
      startPage + pagesToShow - 1,
      Math.ceil(foodList.length / itemsPerPage)
    );

    if (endPage - startPage < pagesToShow - 1) {
      startPage = Math.max(endPage - pagesToShow + 1, 1);
    }

    if (startPage > 1) {
      pages.push(
        <button type="button" onClick={() => setCurrentPage(currentPage - 5)}> « </button>
      );
    }
    if (startPage > 2) {
      pages.push(
        <button type="button" onClick={() => setCurrentPage(1)}>1</button>, "..."
      );
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push (
        <button type="button" key={i} onClick={() => setCurrentPage(i)}> {i} </button>
      );
    }

    if (endPage < Math.ceil(foodList.length / itemsPerPage) - 1)
      pages.push (
        "...",
        <button
          type="button"
          onClick={() =>
            setCurrentPage(Math.ceil(foodList.length / itemsPerPage))
          }
        >
          {Math.ceil(foodList.length / itemsPerPage)}
        </button>
      );
    if (endPage < Math.ceil(foodList.length / itemsPerPage))
      pages.push(
        <button type="button" onClick={() => setCurrentPage(currentPage + 5)}>
          »
        </button>
      );
    return pages;
  };

  // ---------------------------------------------------------------------------------------------->
  const renderService = () => {
    return (
      <>
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
          {currentItems.map((food) => {
            return (
              <tr key={food.food_id}>
                <td>
                  <a onClick={() => buttonNutritionDetail(food.food_id)}
                  className="text-hover">
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
            );
          })}
        </tbody>
      </>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <>
      <h1>영양소</h1>
      <input type="text" onChange={(e) => setFoodName(e.target.value)} />
      <button onClick={searchCalories}>검색</button>
      <table className="table-bordered">
        {renderService()}
      </table>
      <div className="d-flex justify-content-center">
        {renderPageNumbers()}
      </div>
    </>
  );
};

export default NutritionList;

// FoodDetail.tsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const FoodDetail = () => {

  const [foodDetail, setFoodDetail] = useState([]);
  const [food_category, setFood_category] = useState("");
  const user_id = sessionStorage.getItem("user_id");
  const food_regdate = new Date().toISOString().split("T")[0];
  const location = useLocation();
  const category = location.state.food_category;
  const URL = "http://127.0.0.1:4000/food";
  const TITLE = "Food Detail";

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    if (category) {
      setFood_category(category);
    }
  }, [location]);

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchFoodDetail = async () => {
      try {
        const res = await axios.get (`${URL}/foodDetail`, {
          params: {
            user_id : user_id,
            food_regdate : food_regdate,
            food_category : food_category
          }
        });
        setFoodDetail(res.data);
      }
      catch (error: any) {
        alert(`Error fetching food data: ${error.message}`);
        setFoodDetail([]);
      }
    };
    fetchFoodDetail();
  }, [food_category, user_id]);

  // ---------------------------------------------------------------------------------------------->
  const foodDetailTable = () => {
    return (
      <div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>음식명</th>
              <th>칼로리</th>
              <th>탄수화물</th>
              <th>단백질</th>
              <th>지방</th>
            </tr>
          </thead>
          <tbody>
            {foodDetail.map((index: any) => (
              <tr>
                <td>{index.food_name}</td>
                <td>{index.food_calories}</td>
                <td>{index.food_carb}</td>
                <td>{index.food_protein}</td>
                <td>{index.food_fat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container">
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-9">{TITLE}<span className="ms-4">({food_category})</span></h1>
        </div>
      </div>
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-10">
          <h1 className="mb-3 fw-5">
            <span className="ms-4">{food_regdate}</span>
            <span className="ms-4">{user_id}</span>
          </h1>
        </div>
      </div>
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-10">
          {foodDetailTable()}
        </div>
      </div>
    </div>
  );
};

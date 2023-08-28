// FoodDetail.tsx
import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const FoodDetail = () => {
  const [foodDetail, setFoodDetail] = useState([]);
  const [food_regdate, setFood_regdate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const user_id = sessionStorage.getItem("user_id");
  const location = useLocation();
  const navParam = useNavigate();
  const food_category = location.state.food_category;
  const URL = "http://127.0.0.1:4000/food";
  const TITLE = "Food Detail";

  // ---------------------------------------------------------------------------------------------->
  const datePicker = () => {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        selected={new Date(food_regdate)}
        popperPlacement="bottom"
        onChange={(date: any) => {
          const selectedDate = date.toISOString().split("T")[0];
          setFood_regdate(selectedDate);
        }}
      />
    );
  };

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchFoodDetail = async () => {
      try {
        const res = await axios.get(`${URL}/foodDetail`, {
          params: {
            user_id: user_id,
            food_category: food_category,
            food_regdate: food_regdate,
          },
        });
        setFoodDetail(res.data);
      }
      catch (error: any) {
        alert(`Error fetching food data: ${error.message}`);
        setFoodDetail([]);
      }
    };
    fetchFoodDetail();
  }, [user_id, food_category, food_regdate]);

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
            {foodDetail.map((index: any, i: number) => (
              <tr key={i}>
                <td
                  onClick={() =>
                    navParam(`/foodInfo`, {
                      state: {
                        _id : index._id,
                        user_id : index.user_id,
                        food_category : index.food_category
                      },
                    })
                  }
                >
                  {index.food_name}
                </td>
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
          <h1 className="mb-3 fw-9">
            {TITLE}
            <span className="ms-4">({food_category})</span>
          </h1>
        </div>
      </div>
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-10">
          <h1 className="mb-3 fw-5">
            <span className="ms-4">{datePicker()}</span>
          </h1>
        </div>
      </div>
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-10">{foodDetailTable()}</div>
      </div>
    </div>
  );
};
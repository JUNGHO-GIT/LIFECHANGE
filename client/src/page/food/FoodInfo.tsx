// FoodInfo.tsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DatePicker from "react-datepicker"
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const FoodInfo = () => {
  const [foodInfo, setFoodInfo] = useState<any>({});
  const location = useLocation();
  const _id = location.state._id;
  const user_id = location.state.user_id;
  const food_regdate = location.state.food_regdate;
  const food_category = location.state.food_category;
  const URL = "http://127.0.0.1:4000/food";
  const TITLE = "Food Info";

  // ---------------------------------------------------------------------------------------------->
  const datePicker = () => {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        selected={new Date(food_regdate)}
        popperPlacement="bottom"
        onChange={(date: any) => {
          const selectedDate = date.toISOString().split("T")[0];
        }}
        readOnly
      />
    );
  };

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchFoodInfo = async () => {
      try {
        const res = await axios.get(`${URL}/foodInfo`, {
          params: {
            _id : _id,
            user_id : user_id,
            food_regdate : food_regdate,
          },
        });
        setFoodInfo(res.data);
      }
      catch (error: any) {
        alert(`Error fetching food data: ${error.message}`);
        setFoodInfo([]);
      }
    };
    fetchFoodInfo();
  }, [_id]);

  // ---------------------------------------------------------------------------------------------->
  const foodInfoTable = () => {
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
            <tr>
              <td>{foodInfo.food_name}</td>
              <td>{foodInfo.food_calories}</td>
              <td>{foodInfo.food_carb}</td>
              <td>{foodInfo.food_protein}</td>
              <td>{foodInfo.food_fat}</td>
            </tr>
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
        <div className="col-10">{foodInfoTable()}</div>
      </div>
    </div>
  );
};

// FoodList.tsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const FoodList = () => {

  const [FOOD_LIST, setFOOD_LIST] = useState([]);

  const koreanDate = new Date();
  koreanDate.setHours(koreanDate.getHours() + 9);
  const [food_regdate, setFood_regdate] = useState(
    koreanDate.toISOString().split("T")[0]
  );

  const user_id = useLocation().state.user_id;
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const TITLE = "Food List";

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
    const fetchFoodList = async () => {
      try {
        const response = await axios.get(`${URL_FOOD}/foodList`, {
          params: {
            user_id: user_id,
            food_regdate: food_regdate,
          },
        });
        setFOOD_LIST(response.data);
      } catch (error: any) {
        alert(`Error fetching food data: ${error.message}`);
        setFOOD_LIST([]);
      }
    };
    fetchFoodList();
  }, [user_id, food_regdate]);

  // ---------------------------------------------------------------------------------------------->
  const foodListTable = () => {
    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>칼로리</th>
            <th>탄수화물</th>
            <th>단백질</th>
            <th>지방</th>
          </tr>
        </thead>
        <tbody>
          {FOOD_LIST.map((index: any) => (
            <tr>
              <td>{index.food_calories}</td>
              <td>{index.food_carb}</td>
              <td>{index.food_protein}</td>
              <td>{index.food_fat}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-9">
            {TITLE}
            <span className="ms-4">(List)</span>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-5">
            <span className="ms-4">{datePicker()}</span>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-8">
          {foodListTable()}
        </div>
      </div>
    </div>
  );
};

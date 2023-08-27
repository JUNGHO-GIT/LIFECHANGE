// FoodTotal.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";

// ------------------------------------------------------------------------------------------------>
export const FoodTotal = () => {

  const [foodTotal, setFoodTotal] = useState([]);
  const [food_regdate, setFood_regdate] = useState(new Date().toISOString().split("T")[0]);
  const user_id = useLocation().state.user_id;
  const URL = "http://127.0.0.1:4000/food";
  const TITLE = "Food Total";

  // ---------------------------------------------------------------------------------------------->
  const datePicker = () => {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        selected={new Date(food_regdate)}
        onChange={(date: any) => {
          const selectedDate = date.toISOString().split("T")[0];
          setFood_regdate(selectedDate);
        }}
      />
    );
  };

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchFoodTotal = async () => {
      try {
        const response = await axios.post (`${URL}/foodTotal/`, {
          user_id: user_id,
          food_regdate : food_regdate,
        });
        setFoodTotal(response.data);
      }
      catch (error: any) {
        alert(`Error fetching food data: ${error.message}`);
        setFoodTotal([]);
      }
    };
    fetchFoodTotal();
  }, [user_id, food_regdate]);

  // ---------------------------------------------------------------------------------------------->
  const foodArrayTable = () => {
    return (
      <div>
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
            {foodTotal.map((index : any) => (
              <tr>
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
  return(
    <div className="container">
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-9">{TITLE}<span className="ms-4">(Total)</span></h1>
        </div>
      </div>
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-8">
          <h1 className="mb-3 fw-5">
            <span className="ms-4">{datePicker()}</span>
            <span className="ms-4">{user_id}</span>
          </h1>
        </div>
      </div>
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-8">
          {foodArrayTable()}
          <br/><br/><br/>
          <br/><br/><br/>
        </div>
      </div>
    </div>
  );
};
// CalendarDetail.tsx
import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const CalendarDetail = () => {

  const location = useLocation();
  const user_id = location.state.user_id;
  const calendar_year = location.state.calendar_year;
  const calendar_month = location.state.calendar_month;
  const calendar_day = location.state.calendar_day;

  const koreanDate = new Date(`${calendar_year}-${calendar_month}-${calendar_day}`);
  koreanDate.setHours(koreanDate.getHours() + 9);
  const [food_regdate, setFood_regdate] = useState(koreanDate.toISOString().split("T")[0]);
  const [FOOD_TOTAL, setFOOD_TOTAL] = useState([]);

  const URL = "http://127.0.0.1:4000/food";
  const TITLE = "Calendar Detail";

  // ---------------------------------------------------------------------------------------------->
  const datePicker = () => {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        popperPlacement="bottom"
        selected={new Date(food_regdate)}
        onChange={(date : any) => {
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
        const response = await axios.post (`${URL}/foodTotal`, {
          user_id: user_id,
          food_regdate : food_regdate,
        });
        setFOOD_TOTAL(response.data);
      }
      catch (error: any) {
        alert(`Error fetching food data: ${error.message}`);
        setFOOD_TOTAL([]);
      }
    };
    fetchFoodTotal();
  }, [user_id, food_regdate]);

  // ---------------------------------------------------------------------------------------------->
  const calendarDetailTable = () => {
    return (
      <div className="card">
        <div className="card-body">
          <p className="fw-5">
            Year :<b>{calendar_year}년</b>
          </p>
          <p className="fw-5">
            Month :<b>{calendar_month}월</b>
          </p>
          <p className="fw-5">
            Day :<b>{calendar_day}일</b>
          </p>
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const foodTotalTable = () => {
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
          {FOOD_TOTAL.map((index : any) => (
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
          <h1 className="mb-3 fw-9">{TITLE}</h1>
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
        <div className="col-12">
          {calendarDetailTable()}
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">
          {foodTotalTable()}
        </div>
      </div>
    </div>
  );
};
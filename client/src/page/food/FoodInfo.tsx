// FoodInfo.tsx
import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker"
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const FoodInfo = () => {

  const [FOOD, setFOOD] = useState<any>({});
  const location = useLocation();
  const navParam = useNavigate();
  const _id = location.state._id;
  const user_id = location.state.user_id;

  const koreanDate = new Date();
  koreanDate.setHours(koreanDate.getHours() + 9);
  const [food_regdate, setFood_regdate] = useState(koreanDate.toISOString().split("T")[0]);

  const food_category = location.state.food_category;
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
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
        const response = await axios.get(`${URL_FOOD}/foodInfo`, {
          params: {
            _id : _id,
            user_id : user_id,
            food_regdate : food_regdate,
          },
        });
        setFOOD(response.data);
      }
      catch (error: any) {
        alert(`Error fetching food data: ${error.message}`);
        setFOOD([]);
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
              <th>브랜드</th>
              <th>서빙</th>
              <th>칼로리</th>
              <th>탄수화물</th>
              <th>단백질</th>
              <th>지방</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{FOOD.food_name}</td>
              <td>{FOOD.food_brand}</td>
              <td>{FOOD.food_serving}</td>
              <td>{FOOD.food_calories}</td>
              <td>{FOOD.food_carb}</td>
              <td>{FOOD.food_protein}</td>
              <td>{FOOD.food_fat}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const buttonFoodDelete = async () => {
    try {
      const response = await axios.delete(`${URL}/foodDelete`, {
        params: {
          _id : _id,
          user_id : user_id,
          food_regdate : food_regdate,
        },
      });
      if (response.data === "success") {
        alert("삭제되었습니다.");
        navParam(`/foodDetail`, {
          state: {
            user_id : user_id,
            food_regdate : food_regdate,
            food_category : food_category,
          },
        });
      }
      else if (response.data === "fail") {
        alert("삭제에 실패하였습니다.");
      }
      else {
        throw new Error(`Invalid response: ${response.data}`);
      }
    }
    catch (error: any) {
      alert(`Error fetching food data: ${error.message}`);
    }
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-9">
            {TITLE}
            <span className="ms-4">({food_category})</span>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-10">
          <h1 className="mb-3 fw-5">
            <span className="ms-4">{datePicker()}</span>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-10">
          {foodInfoTable()}
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-10">
          <button type="button" className="btn btn-danger" onClick={buttonFoodDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

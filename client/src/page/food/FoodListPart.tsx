// FoodListPart.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const FoodListPart = () => {

  // title
  const TITLE = "Food ListPart";
  // url
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  // date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const _id = location.state._id;
  const user_id = window.sessionStorage.getItem("user_id");
  const food_category = location.state.food_category;
  // state
  const [food_regdate, setFood_regdate] = useState(koreanDate);
  const [FOOD, setFOOD] = useState<any>({});

  // ---------------------------------------------------------------------------------------------->
  const viewDate = () => {
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

  // 2. useEffect --------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchFoodListPart = async () => {
      try {
        const response = await axios.get(`${URL_FOOD}/foodListPart`, {
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
    fetchFoodListPart();
  }, [_id]);

  // ---------------------------------------------------------------------------------------------->
  const foodListPartTable = () => {
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

  // 6. button ------------------------------------------------------------------------------------>
  const buttonFoodDelete = async () => {
    try {
      const response = await axios.delete(`${URL_FOOD}/foodDelete`, {
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

  // 7. return ------------------------------------------------------------------------------------>
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
            <span className="ms-4">{viewDate()}</span>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-10">
          {foodListPartTable()}
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
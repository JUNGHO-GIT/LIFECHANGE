// FoodDetail.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const FoodDetail = () => {

  // title
  const TITLE = "Food Detail";
  // url
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  // date
  const koreanDate = moment.tz('Asia/Seoul').format('YYYY-MM-DD').toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");
  const food_category = location.state.food_category;
  // state
  const [food_regdate, setFood_regdate] = useState(koreanDate);
  const [FOOD, setFOOD] = useState<any>([]);

  // ---------------------------------------------------------------------------------------------->
  const viewDate = () => {
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

  // 2. useEffect --------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchFoodDetail = async () => {
      try {
        const response = await axios.get(`${URL_FOOD}/foodDetail`, {
          params: {
            user_id: user_id,
            food_category: food_category,
            food_regdate: food_regdate,
          },
        });
        setFOOD(response.data);
      }
      catch (error: any) {
        alert(`Error fetching food data: ${error.message}`);
        setFOOD([]);
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
              <th>브랜드</th>
              <th>서빙</th>
              <th>칼로리</th>
              <th>탄수화물</th>
              <th>단백질</th>
              <th>지방</th>
            </tr>
          </thead>
          <tbody>
            {FOOD.map((index: any, i: number) => (
              <tr key={i}>
                <td onClick={() =>
                  navParam(`/foodInfo`, {
                    state: {
                      _id : index._id,
                      user_id : index.user_id,
                      food_category : index.food_category
                    },
                  })
                }>
                  {index.food_name}
                </td>
                <td>{index.food_brand}</td>
                <td>{index.food_serving}</td>
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
          {foodDetailTable()
        }</div>
      </div>
    </div>
  );
};
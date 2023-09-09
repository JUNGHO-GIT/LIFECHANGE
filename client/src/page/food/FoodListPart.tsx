// FoodListPart.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// 1. main ---------------------------------------------------------------------------------------->
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
  const user_id = window.sessionStorage.getItem("user_id"
  );
  const food_category = location.state.food_category;
  // state
  const [food_regdate, setFood_regdate] = useState(koreanDate);
  const [FOOD, setFOOD] = useState<any>([]);

  // 2. useEffect --------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchFoodListPart = async () => {
      try {
        const response = await axios.get(`${URL_FOOD}/foodListPart`, {
          params: {
            user_id : user_id,
            food_category : food_category,
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
  }, [user_id, food_category, food_regdate]);

  // 3. flow -------------------------------------------------------------------------------------->

  // 4. logic ------------------------------------------------------------------------------------->
  const logicViewDate = () => {
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

  // 5. table ------------------------------------------------------------------------------------->
  const tableFoodListPart = () => {
    return (
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
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
              <td>
                {buttonFoodDetail (
                  index._id, index.food_title, index.food_regdate, index.food_category
                )}
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
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonFoodDetail = (_id:any, food_title:any, food_regdate:any, food_category:any) => {
    return (
      <p onClick={(e:any) => {
        e.preventDefault();
        navParam(`/foodDetail`, {
          state: {
            _id : _id,
            food_regdate : food_regdate,
            food_category : food_category,
          },
        });
      }}>
        {food_title}
      </p>
    );
  };
  const buttonRefreshPage = () => {
    return (
      <button type="button" className="btn btn-success ms-2" onClick={() => {
        window.location.reload();
      }}>
        Refresh
      </button>
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
            <span className="ms-4">{logicViewDate()}</span>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-10">
          {tableFoodListPart()}
          <br/>
          {buttonRefreshPage()}
        </div>
      </div>
    </div>
  );
};
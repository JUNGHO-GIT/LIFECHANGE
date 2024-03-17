// FoodSearchResult.tsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment-timezone";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";

// ------------------------------------------------------------------------------------------------>
export const FoodSearchResult = () => {

  // 1-1. title
  const TITLE = "Food SearchResult";
  // 1-2. url
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  // 1-3. date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // 1-4. hook
  const navParam = useNavigate();
  const location = useLocation();
  // 1-5. val
  const user_id = window.sessionStorage.getItem("user_id");
  const food_category = location.state.food_category;
  // 1-6. log
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>

  // 2-2. useState -------------------------------------------------------------------------------->
  const [foodDay, setFoodDay] = useState(koreanDate);
  const [FOOD, setFOOD] = useState<any> ([]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchFoodSearchResult = async () => {
      try {
        const response = await axios.get(`${URL_FOOD}/foodSearchResult`, {
          params: {
            user_id : user_id,
            food_category : food_category,
            foodDur : foodDay,
          },
        });
        setFOOD(response.data);
        log("FOOD : " + JSON.stringify(response.data));
      }
      catch (error:any) {
        alert(`Error fetching food data: ${error.message}`);
        setFOOD([]);
      }
    };
    fetchFoodSearchResult();
  }, [user_id, food_category, foodDay]);

  // 4. logic ------------------------------------------------------------------------------------->
  const logicViewDate = () => {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        selected={new Date(foodDay)}
        popperPlacement="bottom"
        onChange={(date:any) => {
          const formatDate = date.toISOString().split("T")[0];
          setFoodDay(formatDate);
        }}
      />
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableFoodSearchResult = () => {
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
          {FOOD.map((index:any, i: number) => (
            <tr key={i}>
              <td>
                {buttonFoodDetail (
                  index._id, index.food_title, index.foodDay, index.food_category
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
  const buttonFoodDetail = (_id:any, food_title:any, foodDay:any, food_category:any) => {
    return (
      <p onClick={(e:any) => {
        e.preventDefault();
        navParam(`/foodDetail`, {
          state: {
            _id : _id,
            foodDur : foodDay,
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
      <button type="button" className="btn btn-sm btn-success ms-2" onClick={() => {
        navParam(0);
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
          <h1 className="mb-3 fw-7">
            {TITLE}
            <span className="ms-4"> ({food_category})</span>
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
          {tableFoodSearchResult()}
          <br/>
          {buttonRefreshPage()}
        </div>
      </div>
    </div>
  );
};
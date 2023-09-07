// FoodSearch.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const FoodSearch = () => {

  // 1. title
  const TITLE = "Food Search";
  // 2. url
  const URL_FOOD_API = process.env.REACT_APP_URL_FOOD_API;
  // 3. date
  const koreanDate = moment.tz('Asia/Seoul').format('YYYY-MM-DD').toString();
  // 4. hook
  const navParam = useNavigate();
  const location = useLocation();
  // 5. val
  const lang = "ko";
  const user_id = window.sessionStorage.getItem("user_id");
  // 6. state
  const [FOOD_SEARCH, setFOOD_SEARCH] = useState<any>([]);
  const [food_regdate, setFood_regdate] = useState(koreanDate);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  // ---------------------------------------------------------------------------------------------->
  const datePicker = () => {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        selected={new Date(food_regdate)}
        popperPlacement="bottom"
        onChange={(date: any) => {}}
        readOnly
      />
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const fetchFoodSearch = () => {
    const url = `${URL_FOOD_API}/${lang}/search?query=${query}&page=${page}`;

    axios.get(url)
    .then((response) => {
      setFOOD_SEARCH(response.data.items);
    })
    .catch((error: any) => {
      alert(`Error fetching food data: ${error.message}`);
      setFOOD_SEARCH([]);
    });
  };

  // ---------------------------------------------------------------------------------------------->
  const foodSearchTable = () => {
    return (
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>이름</th>
            <th>브랜드</th>
            <th>칼로리</th>
            <th>지방</th>
            <th>탄수화물</th>
            <th>단백질</th>
            <th>용량</th>
          </tr>
        </thead>
        <tbody>
          {FOOD_SEARCH.map((index : any) => (
            <tr>
              <td>
                <Link to={`/foodInsert?title=${index.title}&brand=${index.brand}&calories=${index.calories}&fat=${index.fat}&carb=${index.carb}&protein=${index.protein}&serving=${index.serving}`}>{index.title}</Link>
              </td>
              <td>{index.brand ? index.brand : "x"}</td>
              <td>{index.calories ? index.calories : 0}</td>
              <td>{index.fat ? index.fat : 0}</td>
              <td>{index.carb ? index.carb : 0}</td>
              <td>{index.protein ? index.protein : 0}</td>
              <td>{index.serving ? index.serving : 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const handleSearchChange = (e: any) => {
    e.preventDefault();
    setQuery(e.target.value);
  };
  const handleSearchButton = (e: any) => {
    e.preventDefault();
    if (!query) {
      alert("검색어를 입력하세요");
      return false;
    }
    else {
      fetchFoodSearch();
    }
  };
  const handleNextPage = (e: any) => {
    e.preventDefault();
    if (!query) {
      alert("검색어를 입력하세요");
      return false;
    }
    else {
      setPage((prevPage) => prevPage + 1);
      fetchFoodSearch();
    }
  };
  const handlePrevPage = (e: any) => {
    e.preventDefault();
    if (!query) {
      alert("검색어를 입력하세요");
      return false;
    }
    else {
      setPage((prevPage) => Math.max(prevPage - 1, 1));
      fetchFoodSearch();
    }
  };
  const buttonFoodList = () => {
    navParam(`/foodList`, {
      state: {
        user_id : user_id,
        food_regdate : food_regdate
      }
    });
  };
  const buttonFoodMorning = () => {
    navParam(`/foodDetail`, {
      state: {
        user_id : user_id,
        food_regdate : food_regdate,
        food_category : "morning"
      }
    });
  };
  const buttonFoodLunch = () => {
    navParam(`/foodDetail`, {
      state: {
        user_id : user_id,
        food_regdate : food_regdate,
        food_category : "lunch"
      }
    });
  };
  const buttonFoodDinner = () => {
    navParam(`/foodDetail`, {
      state: {
        user_id : user_id,
        food_regdate : food_regdate,
        food_category : "dinner"
      }
    });
  };
  const buttonFoodSnack = () => {
    navParam(`/foodDetail`, {
      state: {
        user_id : user_id,
        food_regdate : food_regdate,
        food_category : "snack"
      }
    });
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
        <div className="col-10">
          <h1 className="mb-3 fw-5">
            <span className="ms-4">{datePicker()}</span>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">
          {foodSearchTable()}
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-4">
          <div className="btn-group mb-3">
            <button className="btn btn-primary ms-2" onClick={handlePrevPage}>이전</button>
            <button className="btn btn-primary ms-2" onClick={handleNextPage}>다음</button>
          </div>
        </div>
        <div className="col-4">
          <div className="input-group mb-3">
            <input type="text" className="form-control" value={query}
            onChange={handleSearchChange}/>
            <button className="btn btn-primary" onClick={handleSearchButton}>검색</button>
          </div>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-10">
          <div className="btn-group">
            <button className="btn btn-primary ms-2" onClick={buttonFoodList}>총합</button>
            <button className="btn btn-primary ms-2" onClick={buttonFoodMorning}>아침</button>
            <button className="btn btn-primary ms-2" onClick={buttonFoodLunch}>점심</button>
            <button className="btn btn-primary ms-2" onClick={buttonFoodDinner}>저녁</button>
            <button className="btn btn-primary ms-2" onClick={buttonFoodSnack}>간식</button>
          </div>
        </div>
      </div>
    </div>
  );
};

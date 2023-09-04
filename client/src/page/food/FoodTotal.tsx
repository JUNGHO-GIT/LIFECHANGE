// FoodSearch.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const FoodSearch = () => {

  const [FOOD_SEARCH, setFOOD_SEARCH] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const lang = "ko";
  const user_id = sessionStorage.getItem("user_id");
  const koreanDate = new Date();
  koreanDate.setHours(koreanDate.getHours() + 9);
  const food_regdate = koreanDate.toISOString().split("T")[0];
  const navParam = useNavigate();
  const URL_FOOD_API = process.env.REACT_APP_URL_FOOD_API;
  const TITLE = "Food Search";

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
  const buttonFoodTotal = () => {
    navParam(`/foodTotal`, {
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
            <button className="btn btn-primary ms-2" onClick={buttonFoodTotal}>총합</button>
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
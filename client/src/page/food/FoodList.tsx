// FoodList.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
const FoodList = () => {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const lang = "ko";

  const fetchData = () => {
    const url = `https://fat-git-main-jungho-git.vercel.app/api/${lang}/search?query=${query}&page=${page}`;
    axios.get(url)
    .then((response) => {
      setItems(response.data.items);
    })
    .catch((error) => {
      console.error(error);
    });
  };

  // ---------------------------------------------------------------------------------------------->
  const handleSearchChange = (e: any) => {
    setQuery(e.target.value);
  };

  const handleSearchButton = (e: any) => {
    e.preventDefault();
    if (!query) {
      alert("검색어를 입력하세요");
      return false;
    }
    else {
      fetchData();
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
      fetchData();
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
      fetchData();
    }
  };

  const buttonFoodTotal = () => {
    const user_id = sessionStorage.getItem("user_id");
    const food_regdate = new Date().toISOString().split("T")[0];
    window.location.href = "/foodTotal/" + user_id + "/" + food_regdate;
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <>
    <br />
    <br />
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              value={query}
              onChange={handleSearchChange}
            />
            <div className="input-group-append">
              <button className="btn btn-primary" onClick={handleSearchButton}>검색</button>
            </div>
          </div>
          <div className="btn-group mt-3">
            <button className="btn btn-primary ms-2" onClick={handlePrevPage}>이전</button>
            <button className="btn btn-primary ms-2" onClick={handleNextPage}>다음</button>
            <button type="button" className="btn btn-primary ms-2" onClick={buttonFoodTotal}>
              총 섭취 영양소
            </button>
          </div>
          <br/>
          <div className="row">
            {items.map((item: any, index) => (
              <div key={index} className="col-md-4">
                <div className="card mb-4">
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link to={`/foodDetail?title=${item.title}&brand=${item.brand}&calories=${item.calories}&fat=${item.fat}&carb=${item.carb}&protein=${item.protein}&serving=${item.serving}`}>
                        {item.title}
                      </Link>
                    </h5>
                    <p className="card-text">
                      <span>브랜드 : </span>
                      {item.brand ? item.brand : "x"}
                    </p>
                    <p className="card-text">
                      <span>칼로리 : </span>
                      {item.calories ? item.calories : 0}
                    </p>
                    <p className="card-text">
                      <span>지방 : </span>
                      {item.fat ? item.fat : 0}
                    </p>
                    <p className="card-text">
                      <span>탄수화물 : </span>
                      {item.carb ? item.carb : 0}
                    </p>
                    <p className="card-text">
                      <span>단백질 : </span>
                      {item.protein ? item.protein : 0}
                    </p>
                    <p className="card-text">
                      <span>용량 : </span>
                      {item.serving ? item.serving : 0}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default FoodList;

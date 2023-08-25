// FoodList.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
const FoodList = () => {
  const [foodList, setFoodList] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const lang = "ko";

  const fetchFoodList = () => {
    const url
    = `https://fat-git-main-jungho-git.vercel.app/api/${lang}/search?query=${query}&page=${page}`;

    axios.get(url)
    .then((response) => {
      setFoodList(response.data.items);
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
      fetchFoodList();
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
      fetchFoodList();
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
      fetchFoodList();
    }
  };

  // ---------------------------------------------------------------------------------------------->
  const ButtonFoodTotal = () => {
    const user_id = sessionStorage.getItem("user_id");
    const food_regdate = new Date().toISOString().split("T")[0];
    const navParam = useNavigate();
    const navButton = () => navParam(`/foodTotal`, {
      state: {
        user_id,
        food_regdate
      }
    });

    return (
      <>
        <button className="btn btn-primary ms-2" onClick={navButton}>총 영양소 섭취량</button>
      </>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container"><br /><br />
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
            {ButtonFoodTotal()}
          </div>
          <br/>
          <div className="row">
            {foodList.map((index : any) => (
              <div key={index} className="col-md-4">
                <div className="card mb-4">
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link to={`/foodDetail?title=${index.title}&brand=${index.brand}&calories=${index.calories}&fat=${index.fat}&carb=${index.carb}&protein=${index.protein}&serving=${index.serving}`}>
                        {index.title}
                      </Link>
                    </h5>
                    <p className="card-text">
                      <span>브랜드 : </span>
                      {index.brand ? index.brand : "x"}
                    </p>
                    <p className="card-text">
                      <span>칼로리 : </span>
                      {index.calories ? index.calories : 0}
                    </p>
                    <p className="card-text">
                      <span>지방 : </span>
                      {index.fat ? index.fat : 0}
                    </p>
                    <p className="card-text">
                      <span>탄수화물 : </span>
                      {index.carb ? index.carb : 0}
                    </p>
                    <p className="card-text">
                      <span>단백질 : </span>
                      {index.protein ? index.protein : 0}
                    </p>
                    <p className="card-text">
                      <span>용량 : </span>
                      {index.serving ? index.serving : 0}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodList;

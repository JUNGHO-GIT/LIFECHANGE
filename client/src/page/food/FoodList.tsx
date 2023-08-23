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
    const url
    = `https://fat-git-main-jungho-git.vercel.app/api/${lang}/search?query=${query}&page=${page}`;
    axios
    .get(url)
    .then((response) => {
      setItems(response.data.items);
      console.log(response.data.items);
    })
    .catch((error) => {
      console.error(error);
    });
  };

  const handleSearchChange = (e:any) => {
    setQuery(e.target.value);
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
    fetchData();
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
    fetchData();
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container">
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          value={query}
          onChange={handleSearchChange}
          placeholder="검색"
        />
        <div className="input-group-append">
          <button className="btn btn-primary" onClick={fetchData}>
            검색
          </button>
        </div>
      </div>
      <div className="row">
        {items.map((item:any, index) => (
          <div key={index} className="col-md-4">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">
                  <Link to={`/foodDetail?title=${item.title}&brand=${item.brand}&calories=${item.calories}&food=${item.food}&carb=${item.carb}&protein=${item.protein}&serving=${item.serving}`}>
                    {item.title}
                  </Link>
                </h5>
                <p className="card-text">{item.brand}</p>
                <p className="card-text">{item.calories} 칼로리</p>
                <p className="card-text">{item.food} 지방</p>
                <p className="card-text">{item.carb} 탄수화물</p>
                <p className="card-text">{item.protein} 단백질</p>
                <p className="card-text">{item.serving}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="btn-group mt-3">
        <button className="btn btn-primary" onClick={handlePrevPage}>
          이전
        </button>
        <button className="btn btn-primary" onClick={handleNextPage}>
          다음
        </button>
      </div>
    </div>
  );
};

export default FoodList;

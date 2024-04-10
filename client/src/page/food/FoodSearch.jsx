// FoodSearch.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import axios from "axios";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const FoodSearch = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;
  const STATE = {
    id: "",
    date: koreanDate,
    refresh: 0,
    toSave:"/food/save",
  };

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:totalCount, set:setTotalCount} = useStorage(
    `totalCount(${PATH})`, 0
  );
  const {val:filter, set:setFilter} = useStorage(
    `filter(${PATH})`, {
      query: "",
      page: 0,
      limit: 10,
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const {val:FOOD, set:setFOOD} = useStorage(
    `FOOD(${PATH})`, {
      food_total_kcal: "",
      food_total_fat: "",
      food_total_carb: "",
      food_total_protein: "",
      food_section: [{
        food_part: "",
        food_title: "",
        food_count: "",
        food_serv: "",
        food_gram: "",
        food_kcal: "",
        food_fat: "",
        food_carb: "",
        food_protein: "",
      }],
    },
  );

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (filter.query === "") {
      return;
    }
    else {
      flowSearch();
    }
  }, [filter.page]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSearch = async () => {
    const response = await axios.get(`${URL_FOOD}/search`, {
      params: {
        user_id: user_id,
        filter: filter
      }
    });
    setFOOD((prev) => ({
      ...prev,
      food_section: response.data.result
    }));
    setTotalCount(response.data.totalCount);
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {

    function handleStorage (param) {
      localStorage.setItem("food_section", JSON.stringify(param));
      STATE.date = koreanDate;
      navParam(STATE.toSave, {
        state: STATE
      });
    };
    return (
      <table className="table bg-white table-hover">
        <thead className="table-primary">
          <tr>
            <th>Title</th>
            <th>Brand</th>
            <th>Serving</th>
            <th>Gram</th>
            <th>Kcal</th>
            <th>Fat</th>
            <th>Carbohydrate</th>
            <th>Protein</th>
          </tr>
        </thead>
        <tbody>
          {FOOD?.food_section?.map((item, index) => (
            <tr key={index}>
              <td className="pointer" onClick={() => {
                handleStorage(item);
              }}>
                {item.food_title}
              </td>
              <td>{item.food_brand}</td>
              <td>{item.food_count} {item.food_serv}</td>
              <td>{item.food_gram}</td>
              <td>{item.food_kcal}</td>
              <td>{item.food_fat}</td>
              <td>{item.food_carb}</td>
              <td>{item.food_protein}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 5-2. search ---------------------------------------------------------------------------------->
  const searchFood = () => {
    return (
      <div className="d-flex">
        <input
          type="text"
          className="form-control"
          value={filter.query}
          onChange={(e) => {
            setFilter({
              ...filter,
              query: e.target.value
            });
          }}
        />
        <button
          type="button"
          className="btn btn-sm btn-secondary ms-2"
          onClick={() => {
            setFilter({
              ...filter,
              page: 0
            });
            flowSearch();
          }}
        >
          Search
        </button>
      </div>
    );
  };

  // 7. paging ------------------------------------------------------------------------------------>
  const pagingNode = () => {
    function prevButton() {
      return (
        <button
          className={`btn btn-sm btn-primary ms-10 me-10`}
          disabled={filter.page <= 1}
          onClick={() => setFilter({
            ...filter, page: Math.max(1, filter.page - 1)
          })}
        >
          이전
        </button>
      );
    };
    function pageNumber() {
      const pages = [];
      const totalPages = Math.ceil(totalCount / filter.limit);
      let startPage = Math.max(1, filter.page - 2);
      let endPage = Math.min(startPage + 4, totalPages);
      startPage = Math.max(endPage - 4, 1);
      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button
            key={i}
            className={`btn btn-sm btn-primary me-2`}
            disabled={filter.page === i}
            onClick={() => (
              setFilter((prev) => ({
                ...prev,
                page: i
              }))
            )}
          >
            {i}
          </button>
        );
      }
      return pages;
    };
    function nextButton() {
      return (
        <button
          className={`btn btn-sm btn-primary ms-10 me-10`}
          disabled={filter.page >= Math.ceil(totalCount / filter.limit)}
          onClick={() => setFilter({
            ...filter, page: Math.min(Math.ceil(totalCount / filter.limit), filter.page + 1)
          })}
        >
          다음
        </button>
      );
    };
    return (
      <div className="d-inline-flex">
        {prevButton()}
        {pageNumber()}
        {nextButton()}
      </div>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row mb-20 d-center">
          <div className="col-12">
            <h1>Search</h1>
          </div>
        </div>
        <div className="row mb-20 d-center">
          <div className="col-12">
            {tableNode()}
          </div>
        </div>
        <div className="row mb-20 d-center">
          <div className="col-12">
            {searchFood()}
          </div>
        </div>
        <div className="row mb-20 d-center">
          <div className="col-12">
            {pagingNode()}
          </div>
        </div>
      </div>
    </div>
  );
};

// FoodSearchList.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/js/useStorage.jsx";
import axios from "axios";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const FoodSearchList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const storagePart = localStorage.getItem("food_part");
  const storagePlanYn = localStorage.getItem("food_planYn");

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
    intoDetail:"/food/search/detail",
  };

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:planYn, set:setPlanYn} = useStorage(
    `planYn(${PATH})`, storagePlanYn
  );
  const {val:pageCount, set:setPageCount} = useStorage(
    `pageCount(${PATH})`, 0
  );
  const {val:filter, set:setFilter} = useStorage(
    `filter(${PATH})`, {
      query: "",
      page: 0,
      limit: 10,
      part: storagePart,
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const {val:FOOD, set:setFOOD} = useStorage(
    `FOOD(${PATH})`, {
      food_plan : {
        food_total_kcal: "",
        food_total_fat: "",
        food_total_carb: "",
        food_total_protein: "",
        food_section: [{
          food_part_idx: 0,
          food_part_val: "",
          food_title_idx: 0,
          food_title_val: "",
          food_count: "",
          food_serv: "",
          food_gram: "",
          food_kcal: "",
          food_fat: "",
          food_carb: "",
          food_protein: "",
        }],
      },
      food_real : {
        food_total_kcal: "",
        food_total_fat: "",
        food_total_carb: "",
        food_total_protein: "",
        food_section: [{
          food_part_idx: 0,
          food_part_val: "",
          food_title_idx: 0,
          food_title_val: "",
          food_count: "",
          food_serv: "",
          food_gram: "",
          food_kcal: "",
          food_fat: "",
          food_carb: "",
          food_protein: "",
        }],
      },
    }
  );

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (filter.query === "") {
      return;
    }
    else {
      flowFoodSearch();
    }
  }, [filter.page]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowFoodSearch = async () => {

    const foodType = planYn === "Y" ? "food_plan" : "food_real";

    const response = await axios.get(`${URL_FOOD}/search`, {
      params: {
        user_id: user_id,
        filter: filter
      }
    });
    setFOOD((prev) => ({
      ...prev,
      [foodType]: {
        ...prev[foodType],
        food_section: response.data.result
      }
    }));
    setPageCount(response.data.pageCount);
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableFoodSearch = () => {

    const foodType = planYn === "Y" ? "food_plan" : "food_real";

    function handleStorage (param) {
      localStorage.setItem("food_section", JSON.stringify(param));
      navParam(STATE.intoDetail);
    }

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
          {FOOD[foodType].food_section?.map((item, index) => (
            <tr key={index}>
              <td className="pointer" onClick={() => {
                handleStorage(item);
              }}>
                {item.food_title_val}
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
            flowFoodSearch();
          }}
        >
          Search
        </button>
      </div>
    );
  }

  // 5-2. filter ---------------------------------------------------------------------------------->
  const filterBox = () => {
    const pageNumber = () => {
      const pages = [];
      let startPage = Math.max(filter.page - 2, 1);
      let endPage = Math.min(startPage + 4, pageCount);
      startPage = Math.max(Math.min(startPage, pageCount - 4), 1);
      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button
            key={i}
            className={`btn btn-sm ${filter.page === i ? "btn-secondary" : "btn-primary"} me-2`}
            onClick={() => setFilter({
              ...filter, page: i
            })}
          >
            {i}
          </button>
        );
      }
      return pages;
    };
    const prevNumber = () => (
      <button
        className="btn btn-sm btn-primary ms-10 me-10"
        onClick={() => setFilter({
          ...filter, page: filter.page > 0 ? filter.page - 1 : 0
        })}
      >
        Prev
      </button>
    );
    const nextNumber = () => (
      <button
        className="btn btn-sm btn-primary ms-10 me-10"
        onClick={() => setFilter({
          ...filter, page: filter.page < pageCount - 1 ? filter.page + 1 : filter.page
        })}
      >
        Next
      </button>
    );
    return (
      <div className="d-inline-flex">
        {prevNumber()}
        {pageNumber()}
        {nextNumber()}
      </div>
    );
  };

  // 6-3. select ---------------------------------------------------------------------------------->
  const selectFilterPart = () => {
    return (
      <div>
        <select className="form-select" id="foodPart" onChange={(e) => {
          setFilter((prev) => ({
            ...prev,
            part: e.target.value
          }));
        }}>
          <option value="아침">아침</option>
          <option value="점심">점심</option>
          <option value="저녁">저녁</option>
          <option value="간식">간식</option>
        </select>
      </div>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row mb-20">
          <div className="col-12 d-center">
            {tableFoodSearch()}
          </div>
        </div>
        <div className="row mb-20">
          <div className="col-12 d-center">
            {selectFilterPart()}
            &nbsp;
            {searchFood()}
          </div>
        </div>
        <div className="row mb-20">
          <div className="col-12 d-center">
            {filterBox()}
          </div>
        </div>
      </div>
    </div>
  );
};

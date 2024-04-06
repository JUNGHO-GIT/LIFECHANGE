// FoodSearchList.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/js/useStorage.jsx";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const FoodSearchList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const location_date = location?.state?.date?.toString();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;
  const STATE = {
    refresh:0,
    intoSearchDetail:"/food/search/detail",
    id: "",
    date: "",
    food: {
      title: "",
      brand: "",
      serv: "",
      gram: "",
      kcal: "",
      fat: "",
      carb: "",
      protein: ""
    }
  };

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:pageCount, set:setPageCount} = useStorage(
    `pageCount(${PATH})`, 0
  );
  const {val:filter, set:setFilter} = useStorage(
    `filter(${PATH})`, {
      query: "",
      page: 0,
      limit: 10
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const {val:FOOD_DEFAULT, set:setFOOD_DEFAULT} = useStorage(
    `FOOD_DEFAULT(${PATH})`, [{
      title: "",
      brand: "",
      serv: "",
      gram: "",
      kcal: "",
      fat: "",
      carb: "",
      protein: ""
    }]
  );
  const {val:FOOD, set:setFOOD} = useStorage(
    `FOOD(${PATH})`, [{
      title: "",
      brand: "",
      serv: "",
      gram: "",
      kcal: "",
      fat: "",
      carb: "",
      protein: ""
    }]
  );

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (filter.query === "") {
      return;
    }
    else {
      flowTestSearch();
    }
  }, [filter.page]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowTestSearch = async () => {
    const response = await axios.get(`${URL_FOOD}/search`, {
      params: {
        user_id: user_id,
        filter: filter
      }
    });
    setPageCount(response.data.pageCount);
    setFOOD(response.data.result || FOOD_DEFAULT);
  };

  // 5-2. filter ---------------------------------------------------------------------------------->
  const filterBox = () => {
    const pageNumber = () => (
      <span className="ms-2 me-2">
        {filter.page + 1} / {pageCount}
      </span>
    );
    const prevNumber = () => (
      <button
        className="btn btn-sm"
        onClick={() => setFilter({
          ...filter, page: filter.page > 0 ? filter.page - 1 : 0
        })}
      >
        Prev
      </button>
    );
    const nextNumber = () => (
      <button
        className="btn btn-sm"
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

  // 5. table ------------------------------------------------------------------------------------->
  const tableTestSearch = () => {
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
          {FOOD.map((item, index) => {
            return (
              <tr key={index}>
                <td onClick={() => {
                  STATE.food = item;
                  navParam(STATE.intoSearchDetail, {
                    state: STATE
                  }
                )}}>
                  {item.title}
                </td>
                <td>{item.brand}</td>
                <td>{item.serv}</td>
                <td>{item.gram}</td>
                <td>{item.kcal}</td>
                <td>{item.fat}</td>
                <td>{item.carb}</td>
                <td>{item.protein}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row mb-20">
          <div className="col-12 d-center">
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                placeholder="Search Food"
                id="search"
                name="search"
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
                className="btn btn-sm btn-primary ms-2"
                onClick={() => {
                  setFilter({
                    ...filter,
                    page: 0
                  });
                  flowTestSearch();
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="row mb-20">
          <div className="col-12 d-center">
            {filterBox()}
          </div>
        </div>
        <div className="row d-center mt-5 mb-20">
          <div className="col-12">
            {tableTestSearch()}
          </div>
        </div>
      </div>
    </div>
  );
};

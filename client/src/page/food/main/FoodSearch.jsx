// FoodSearch.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
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

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:STATE, set:setSTATE} = useStorage(
    `STATE(${PATH})`, {
      id: "",
      date: koreanDate,
      refresh: 0,
      toSave:"/food/save",
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      strStartDt: location_date,
      strEndDt: location_date,
      strDt: location_date,
    }
  );
  const {val:FILTER, set:setFILTER} = useStorage(
    `FILTER(${PATH})`, {
      query: "",
      page: 0,
      limit: 10,
    }
  );
  const {val:PAGING, set:setPAGING} = useStorage(
    `PAGING(${PATH})`, {
      page: 1,
      limit: 5
    }
  );
  const {val:COUNT, set:setCOUNT} = useStorage(
    `COUNT(${PATH})`, {
      totalCnt: 0,
      sectionCnt: 0
    }
  );
  const {val:CALENDAR, set:setCALENDAR} = useStorage(
    `CALENDAR(${PATH})`, {
      calStartOpen: false,
      calEndOpen: false,
      calOpen: false,
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
    if (FILTER.query === "") {
      return;
    }
    else {
      flowSearch();
    }
  }, [FILTER.page]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSearch = async () => {
    const response = await axios.get(`${URL_FOOD}/search`, {
      params: {
        user_id: user_id,
        FILTER: FILTER
      }
    });
    setFOOD((prev) => ({
      ...prev,
      food_section: response.data.result
    }));
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt ? response.data.totalCnt : 0,
    }));
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
      <table className="table bg-white table-hover table-responsive">
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
        <input type="text" className="form-control" value={FILTER.query} onChange={(e) => {
          setFILTER((prev) => ({
            ...prev,
            query: e.target.value
          }));
        }}/>
        <button type="button" className="btn btn-sm btn-secondary ms-2" onClick={() => {
          setFILTER((prev) => ({
            ...prev,
            page: 0
          }));
          flowSearch();
        }}>
          Search
        </button>
      </div>
    );
  };

  // 7. paging ------------------------------------------------------------------------------------>
  const pagingNode = () => {
    function prevButton() {
      return (
        <button className={`btn btn-sm btn-primary ms-10 me-10`} disabled={FILTER.page <= 1}
        onClick={() => (
          setFILTER((prev) => ({
            ...prev,
            page: Math.max(1, FILTER.page - 1)
          }))
        )}>
          이전
        </button>
      );
    };
    function pageNumber() {
      const pages = [];
      const totalPages = Math.ceil(COUNT.totalCnt / FILTER.limit);
      let startPage = Math.max(1, FILTER.page - 2);
      let endPage = Math.min(startPage + 4, totalPages);
      startPage = Math.max(endPage - 4, 1);
      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button key={i} className={`btn btn-sm btn-primary me-2`} disabled={FILTER.page === i}
          onClick={() => (
            setFILTER((prev) => ({
              ...prev,
              page: i
            }))
          )}>
            {i}
          </button>
        );
      }
      return pages;
    };
    function nextButton() {
      return (
        <button className={`btn btn-sm btn-primary ms-10 me-10`}
        disabled={FILTER.page >= Math.ceil(COUNT.totalCnt / FILTER.limit)}
        onClick={() => (
          setFILTER((prev) => ({
            ...prev,
            page: Math.min(Math.ceil(COUNT.totalCnt / FILTER.limit), FILTER.page + 1)
          }))
        )}>
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

// FoodDetailReal.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/js/useStorage.jsx";
import axios from "axios";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const FoodDetailReal = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id;
  const location_date = location?.state?.date;
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;
  const STATE = {
    id: "",
    date: "",
    refresh:0,
    toList:"/food/list/real",
    toSave:"/food/save/real"
  };

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:strStartDate, set:setStrStartDate} = useStorage(
    `strStartDate(${PATH})`, koreanDate
  );
  const {val:strEndDate, set:setStrEndDate} = useStorage(
    `strEndDate(${PATH})`, koreanDate
  );
  const {val:strDate, set:setStrDate} = useStorage(
    `strDate(${PATH})`, location_date
  );
  const {val:strDur, set:setStrDur} = useStorage(
    `strDur(${PATH})`, `${location_date} ~ ${location_date}`
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [FOOD_DEFAULT, setFOOD_DEFAULT] = useState({
    _id: "",
    food_number: 0,
    food_date: "",
    food_real : {
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
  });
  const [FOOD, setFOOD] = useState({
    _id: "",
    food_number: 0,
    food_date: "",
    food_real : {
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
  });

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setStrDate(location_date);
    setStrDur(`${location_date} ~ ${location_date}`);
  }, [location_date]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setFOOD((prev) => ({
      ...prev,
      food_date: strDur
    }));
  }, [strDur]);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_FOOD}/detail`, {
      params: {
        _id: location_id,
        user_id: user_id,
        food_dur: `${location_date} ~ ${location_date}`,
        planYn: "N",
      },
    });

    setFOOD(response.data.result ? response.data.result : FOOD_DEFAULT);

  })()}, []);

  // 6. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <table className="table bg-white table-hover">
        <thead className="table-primary">
          <tr>
            <th>음식명</th>
            <th>브랜드</th>
            <th>횟수</th>
            <th>서빙</th>
            <th>칼로리</th>
            <th>탄수화물</th>
            <th>단백질</th>
            <th>지방</th>
          </tr>
        </thead>
        <tbody>
          {FOOD.food_real.food_section.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.food_title}</td>
                <td>{item.food_part}</td>
                <td>{item.food_count}</td>
                <td>{item.food_serv}</td>
                <td>{item.food_kcal}</td>
                <td>{item.food_carb}</td>
                <td>{item.food_protein}</td>
                <td>{item.food_fat}</td>
              </tr>
            );
          })}
          <tr>
            <td colSpan={4} className="text-end">합계</td>
            <td>{FOOD.food_real.food_total_kcal}</td>
            <td>{FOOD.food_real.food_total_carb}</td>
            <td>{FOOD.food_real.food_total_protein}</td>
            <td>{FOOD.food_real.food_total_fat}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    function buttonUpdate () {
      return (
        <button
          type="button"
          className="btn btn-sm btn-primary ms-2"
          onClick={() => {
            STATE.date = strDate;
            navParam(STATE.toSave, {
              state: STATE,
            });
          }}
        >
          Update
        </button>
      );
    };
    function buttonRefresh () {
      return (
        <button
          type="button"
          className="btn btn-sm btn-success ms-2"
          onClick={() => {
            navParam(STATE.refresh);
          }}
        >
          Refresh
        </button>
      );
    };
    function buttonList () {
      return (
        <button
          type="button"
          className="btn btn-sm btn-secondary ms-2"
          onClick={() => {
            navParam(STATE.toList);
          }}
        >
          List
        </button>
      );
    };
    return (
      <div className="d-inline-flex">
        {buttonUpdate()}
        {buttonRefresh()}
        {buttonList()}
      </div>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row mb-20 d-center">
          <div className="col-12">
            <h1>Detail</h1>
          </div>
        </div>
        <div className="row d-center mb-20">
          <div className="col-12">
            {tableNode()}
          </div>
        </div>
        <div className="row d-center">
          <div className="col-12">
            {buttonNode()}
          </div>
        </div>
      </div>
    </div>
  );
};

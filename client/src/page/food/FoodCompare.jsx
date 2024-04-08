// FoodCompare.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/js/useStorage.jsx";
import {DayPicker} from "react-day-picker";
import Draggable from "react-draggable";
import {ko} from "date-fns/locale";
import moment from "moment-timezone";
import axios from "axios";
import { differenceInDays } from "date-fns";

// ------------------------------------------------------------------------------------------------>
export const FoodCompare = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;
  const STATE = {
    id: "",
    date: "",
    refresh: 0,
    toList: "/food/list",
  };

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:calendarOpen, set:setCalendarOpen} = useStorage(
    `calendarOpen(${PATH})`, false
  );
  const {val:totalCount, set:setTotalCount} = useStorage(
    `totalCount(${PATH})`, 0
  );
  const {val:type, set:setType} = useStorage(
    `type(${PATH})`, "day"
  );
  const {val:filter, set:setFilter} = useStorage(
    `filter(${PATH})`, {
      order: "asc",
      page: 1,
      limit: 5,
      part: "전체",
    }
  );

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:strStartDate, set:setStrStartDate} = useStorage(
    `strStartDate(${PATH})`, koreanDate
  );
  const {val:strEndDate, set:setStrEndDate} = useStorage(
    `strEndDate(${PATH})`, koreanDate
  );
  const {val:strDate, set:setStrDate} = useStorage(
    `strDate(${PATH})`, koreanDate
  );
  const {val:strDur, set:setStrDur} = useStorage(
    `strDur(${PATH})`, `${koreanDate} ~ ${koreanDate}`
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [FOOD, setFOOD] = useState([{
    _id: "",
    food_number: 0,
    food_date: "",
    food_plan : {
      food_total_kcal: "",
      food_total_fat: "",
      food_total_carb: "",
      food_total_protein: "",
      food_section: []
    },
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
  }]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {

    const response = await axios.get(`${URL_FOOD}/list`, {
      params: {
        user_id: user_id,
        food_dur: strDur,
        filter: filter
      },
    });
    setTotalCount(response.data.totalCount);
    setFOOD(response.data.result);

  })()}, [strDur, filter]);

  // 5-2. table ----------------------------------------------------------------------------------->
  const tableCompare = () => {
    return (
      <table className="table bg-white table-hover">
        <thead className="table-primary">
          <tr>
            <th>항목</th>
            <th>목표</th>
            <th>실제</th>
          </tr>
        </thead>
        <tbody>
          {FOOD.map((item) => (
            <React.Fragment key={item._id}>
              <tr>
                <td>칼로리</td>
                <td>
                  {item.food_plan?.food_total_kcal}
                </td>
                <td>
                  {item.food_real?.food_total_kcal}
                </td>
              </tr>
              <tr>
                <td>탄수화물</td>
                <td>
                  {item.food_plan?.food_total_carb}
                </td>
                <td>
                  {item.food_real?.food_total_carb}
                </td>
              </tr>
              <tr>
                <td>단백질</td>
                <td>
                  {item.food_plan?.food_total_protein}
                </td>
                <td>
                  {item.food_real?.food_total_protein}
                </td>
              </tr>
              <tr>
                <td>지방</td>
                <td>
                  {item.food_plan?.food_total_fat}
                </td>
                <td>
                  {item.food_real?.food_total_fat}
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    function buttonList () {
      return (
        <button
          type="button"
          className="btn btn-sm btn-secondary me-2"
          onClick={() => {
            navParam(STATE.toList);
          }}
        >
          List
        </button>
      );
    };
    function buttonReset () {
      return (
        <button
          type="button"
          className="btn btn-sm btn-primary me-2"
          onClick={() => {
            navParam(STATE.refresh);
          }}
        >
          Reset
        </button>
      );
    }
    return (
      <div className="d-inline-flex">
        {buttonList()}
        {buttonReset()}
      </div>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row mb-20 d-center">
          <div className="col-12">
            {tableCompare()}
          </div>
        </div>
        <div className="row mb-20 d-center">
          <div className="col-12">
            {buttonNode()}
          </div>
        </div>
      </div>
    </div>
  );
};

// FoodCompare.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
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
  const {val:filter, set:setFilter} = useStorage(
    `filter(${PATH})`, {
      order: "asc",
      limit: 5,
      part: "전체",
    }
  );
  const {val:paging, set:setPaging} = useStorage(
    `paging(${PATH})`, {
      page: 1,
      limit: 5
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

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row mb-20 d-center">
          <div className="col-12">
          </div>
        </div>
      </div>
    </div>
  );
};

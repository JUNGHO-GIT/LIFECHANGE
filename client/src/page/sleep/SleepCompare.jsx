// SleepCompare.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import axios from "axios";
import {DateNode} from "../../assets/fragments/DateNode.jsx";
import {CalendarNode} from "../../assets/fragments/CalendarNode.jsx";
import {PagingNode} from "../../assets/fragments/PagingNode.jsx";
import {FilterNode} from "../../assets/fragments/FilterNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepCompare = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const navParam = useNavigate();
  const location = useLocation();
  const location_date = location?.state?.date;
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;
  const STATE = {
    id: "",
    date: "",
    refresh: 0,
    toDetail:"/sleep/detail"
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
      type: "day",
      limit: 5
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
    `strStartDate(${PATH})`, location_date
  );
  const {val:strEndDate, set:setStrEndDate} = useStorage(
    `strEndDate(${PATH})`, location_date
  );
  const {val:strDate, set:setStrDate} = useStorage(
    `strDate(${PATH})`, location_date
  );
  const {val:strDur, set:setStrDur} = useStorage(
    `strDur(${PATH})`, `${location_date} ~ ${location_date}`
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row mb-20 d-center">
          <div className="col-12">
            <h1>Compare</h1>
          </div>
        </div>
        <div className="row mb-20 d-center">
          <div className="col-12">
          </div>
        </div>
      </div>
    </div>
  );
};

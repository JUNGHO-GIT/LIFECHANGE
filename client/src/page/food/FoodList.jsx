// FoodList.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import moment from "moment-timezone";
import axios from "axios";
import {DateNode} from "../../assets/fragments/DateNode.jsx";
import {CalendarNode} from "../../assets/fragments/CalendarNode.jsx";
import {PagingNode} from "../../assets/fragments/PagingNode.jsx";
import {FilterNode} from "../../assets/fragments/FilterNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const navParam = useNavigate();
  const location = useLocation();
  const location_date = location?.state?.date;
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;
  const STATE = {
    id: "",
    date: "",
    refresh: 0,
    toDetail:"/food/detail"
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

  // 2-2. useState -------------------------------------------------------------------------------->
  const [FOOD_DEFAULT, setFOOD_DEFAULT] = useState([{
    _id: "",
    food_number: 0,
    food_date: "",
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
  }]);
  const [FOOD, setFOOD] = useState([{
    _id: "",
    food_number: 0,
    food_date: "",
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
  }]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {

    const response = await axios.get(`${URL_FOOD}/list`, {
      params: {
        user_id: user_id,
        food_dur: strDur,
        filter: filter,
        paging: paging
      },
    });
    setTotalCount(response.data.totalCount ? response.data.totalCount : 0);
    setFOOD(response.data.result ? response.data.result : FOOD_DEFAULT);

  })()}, [strDur, filter, paging]);

  // 4. date -------------------------------------------------------------------------------------->
  const dateNode = () => {
    return (
      <DateNode strDate={strDate} setStrDate={setStrDate} type="list" />
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <table className="table bg-white table-hover">
        <thead className="table-primary">
          <tr>
            <th>날짜</th>
            <th>분류</th>
            <th>식품명</th>
            <th>브랜드</th>
            <th>수량</th>
            <th>서빙 사이즈</th>
            <th>그램(g)</th>
            <th>칼로리(kcal)</th>
            <th>탄수화물(g)</th>
            <th>단백질(g)</th>
            <th>지방(g)</th>
          </tr>
        </thead>
        <tbody>
          {FOOD.map((item) => (
            <React.Fragment key={item._id}>
              {item?.food_section.map((section, index) => (
                <tr key={section._id}>
                  <td className="pointer" onClick={() => {
                    STATE.id = item._id;
                    STATE.date = item.food_date;
                    navParam(STATE.toDetail, {
                      state: STATE
                    });
                  }}>
                    {item.food_date}
                  </td>
                  <td>{section.food_part}</td>
                  <td>{section.food_title}</td>
                  <td>{section.food_brand}</td>
                  <td>{section.food_count}</td>
                  <td>{section.food_serv}</td>
                  <td>{section.food_gram}</td>
                  <td>{section.food_kcal}</td>
                  <td>{section.food_carb}</td>
                  <td>{section.food_protein}</td>
                  <td>{section.food_fat}</td>
                </tr>
              ))}
              <tr className="table-secondary">
                <td colSpan={6}>합계</td>
                <td></td>
                <td>{item.food_total_kcal}kcal</td>
                <td>{item.food_total_carb}g</td>
                <td>{item.food_total_protein}g</td>
                <td>{item.food_total_fat}g</td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    );
  };

  // 6. calendar ---------------------------------------------------------------------------------->
  const calendarNode = () => {
    return (
      <CalendarNode filter={filter} setFilter={setFilter}
        strDate={strDate} setStrDate={setStrDate}
        strStartDate={strStartDate} setStrStartDate={setStrStartDate}
        strEndDate={strEndDate} setStrEndDate={setStrEndDate}
        strDur={strDur} setStrDur={setStrDur}
        calendarOpen={calendarOpen} setCalendarOpen={setCalendarOpen}
      />
    );
  };

  // 7. paging ------------------------------------------------------------------------------------>
  const pagingNode = () => {
    return (
      <PagingNode paging={paging} setPaging={setPaging} totalCount={totalCount}
      />
    );
  };

  // 8. filter ------------------------------------------------------------------------------------>
  const filterNode = () => {
    return (
      <FilterNode filter={filter} setFilter={setFilter} paging={paging} setPaging={setPaging}
        type={"food"}
      />
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode calendarOpen={calendarOpen} setCalendarOpen={setCalendarOpen}
        strDate={strDate} setStrDate={setStrDate}
        STATE={STATE} flowSave={""} navParam={navParam}
        type={"list"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row mb-20 d-center">
          <div className="col-12">
            <h1>List</h1>
          </div>
        </div>
        <div className="row d-center mb-20">
          <div className="col-12">
            {dateNode()}
          </div>
        </div>
        <div className="row mb-20 d-center">
          <div className="col-12">
            {calendarNode()}
            {tableNode()}
          </div>
        </div>
        <div className="row mb-20 d-center">
          <div className="col-12">
            {filterNode()}
          </div>
        </div>
        <div className="row mb-20 d-center">
          <div className="col-12">
            {pagingNode()}
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

// FoodPlanList.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import axios from "axios";
import {CalendarNode} from "../../../assets/fragments/CalendarNode.jsx";
import {PagingNode} from "../../../assets/fragments/PagingNode.jsx";
import {FilterNode} from "../../../assets/fragments/FilterNode.jsx";
import {ButtonNode} from "../../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodPlanList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD_PLAN = process.env.REACT_APP_URL_FOOD_PLAN;
  const user_id = window.sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location.pathname;

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      startDt: "",
      endDt: "",
      refresh: 0,
      toDetail:"/food/plan/detail"
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );
  const {val:FILTER, set:setFILTER} = useStorage(
    `FILTER(${PATH})`, {
      order: "asc",
      type: "day",
      limit: 5,
      partIdx: 0,
      part: "전체",
      titleIdx: 0,
      title: "전체"
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
  const [PLAN_DEFAULT, setPLAN_DEFAULT] = useState([{
    _id: "",
    plan_number: 0,
    plan_schema: "food",
    plan_startDt: "",
    plan_endDt: "",
    plan_food: {
      plan_kcal: "",
    }
  }]);
  const [PLAN, setPLAN] = useState([{
    _id: "",
    plan_number: 0,
    plan_schema: "food",
    plan_startDt: "",
    plan_endDt: "",
    plan_food: {
      plan_kcal: "",
    }
  }]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_FOOD_PLAN}/list`, {
      params: {
        user_id: user_id,
        food_plan_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
        FILTER: FILTER,
        PAGING: PAGING
      },
    });
    setPLAN(response.data.result || PLAN_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0
    }));
  })()}, [user_id, FILTER, PAGING]);

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <table className="table bg-white table-hover">
        <thead className="table-primary">
          <tr>
            <th>시작일</th>
            <th>종료일</th>
            <th>칼로리</th>
          </tr>
        </thead>
        <tbody>
          {PLAN.map((item) => (
            <React.Fragment key={item._id}>
              <tr>
                <td onClick={() => {
                  SEND.id = item._id;
                  navParam(SEND.toDetail, {
                    state: SEND
                  });
                }}>
                  {item.food_plan_startDt}
                </td>
                <td>{item.food_plan_endDt}</td>
                <td>{item.food_plan_food.plan_kcal}</td>
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
      <CalendarNode FILTER={FILTER} setFILTER={setFILTER} DATE={DATE} setDATE={setDATE}
        CALENDAR={CALENDAR} setCALENDAR={setCALENDAR}
      />
    );
  };

  // 7. paging ------------------------------------------------------------------------------------>
  const pagingNode = () => {
    return (
      <PagingNode PAGING={PAGING} setPAGING={setPAGING} COUNT={COUNT} setCOUNT={setCOUNT}
      />
    );
  };

  // 8. filter ------------------------------------------------------------------------------------>
  const filterNode = () => {
    return (
      <FilterNode FILTER={FILTER} setFILTER={setFILTER} PAGING={PAGING} setPAGING={setPAGING}
        type={"food"} plan={"plan"}
      />
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} flowSave={""} navParam={navParam}
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

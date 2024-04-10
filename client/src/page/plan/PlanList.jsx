// PlanList.jsx

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
export const PlanList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_PLAN = process.env.REACT_APP_URL_PLAN;
  const navParam = useNavigate();
  const location = useLocation();
  const location_date = location?.state?.date;
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;
  const STATE = {
    id: "",
    date: "",
    refresh:0,
    toDetail:"/plan/detail/real"
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
      limit: 5,
      partIdx: 0,
      part: "전체",
      titleIdx: 0,
      title: "전체"
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
  const [PLAN_DEFAULT, setPLAN_DEFAULT] = useState([{
    _id: "",
    plan_number: 0,
    plan_date: "",
    plan_real : {
      plan_section: [{
        plan_part_idx: 0,
        plan_part_val: "전체",
        plan_title_idx: 0,
        plan_title_val: "전체",
        plan_amount: 0,
        plan_content: "",
      }],
    }
  }]);
  const [PLAN, setPLAN] = useState([{
    _id: "",
    plan_number: 0,
    plan_date: "",
    plan_real : {
      plan_section: [{
        plan_part_idx: 0,
        plan_part_val: "전체",
        plan_title_idx: 0,
        plan_title_val: "전체",
        plan_amount: 0,
        plan_content: "",
      }],
    }
  }]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {

    const response = await axios.get(`${URL_PLAN}/list`, {
      params: {
        user_id: user_id,
        plan_dur: strDur,
        filter: filter,
        paging: paging,
        planYn: "N",
      },
    });

    setTotalCount(response.data.totalCount === 0 ? 1 : response.data.totalCount);
    setPLAN(response.data.result ? response.data.result : PLAN_DEFAULT);

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
            <th>항목</th>
            <th>금액</th>
            <th>내용</th>
          </tr>
        </thead>
        <tbody>
          {PLAN.map((item) => (
            <React.Fragment key={item.plan_date}>
              <tr>
                <td rowSpan={6} className="pointer" onClick={() => {
                  STATE.id = item._id;
                  STATE.date = item.plan_date;
                  navParam(STATE.toDetail, {
                    state: STATE
                  });
                }}>
                  {item.plan_date}
                </td>
              </tr>
              {item.plan_real.plan_section.map((item, index) => (
                <tr key={index}>
                  <td>{item.plan_part_val}</td>
                  <td>{item.plan_title_val}</td>
                  <td>{item.plan_amount}</td>
                  <td>{item.plan_content}</td>
                </tr>
              ))}
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
        type={"plan"}
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
            <h1>List (Real)</h1>
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

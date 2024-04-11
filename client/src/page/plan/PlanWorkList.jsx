// PlanWorkList.jsx

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
export const PlanWorkList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_PLAN = process.env.REACT_APP_URL_PLAN;
  const navParam = useNavigate();
  const location = useLocation();
  const location_date = location?.state?.date;
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:STATE, set:setSTATE} = useStorage(
    `STATE(${PATH})`, {
      id: "",
      date: "",
      refresh:0,
      toDetail:"/plan/work/detail"
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      strDur: `${location_date} ~ ${location_date}`,
      strStartDt: location_date,
      strEndDt: location_date,
      strDt: location_date
    }
  );
  const {val:CALENDAR, set:setCALENDAR} = useStorage(
    `CALENDAR(${PATH})`, {
      calStartOpen: false,
      calEndOpen: false,
      calOpen: false,
    }
  );
  const {val:FILTER, set:setFILTER} = useStorage(
    `FILTER(${PATH})`, {
      order: "asc",
      limit: 5,
      schema: "work",
    }
  );
  const {val:PAGING, set:setPAGING} = useStorage(
    `paging(${PATH})`, {
      page: 1,
      limit: 5
    }
  );
  const {val:COUNT, set: setCOUNT} = useStorage(
    `COUNT(${PATH})`, {
      totalCnt: 0,
      sectionCnt: 0
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [PLAN_DEFAULT, setPLAN_DEFAULT] = useState([{
    _id: "",
    plan_number: 0,
    plan_dur: "",
    plan_schema: "work",
    plan_work: {
      plan_count_total: "",
      plan_cardio_time: "",
      plan_score_name: "",
      plan_score_kg: "",
      plan_score_rep: "",
    },
  }]);
  const [PLAN, setPLAN] = useState([{
    _id: "",
    plan_number: 0,
    plan_dur: "",
    plan_schema: "work",
    plan_work: {
      plan_count_total: "",
      plan_cardio_time: "",
      plan_score_name: "",
      plan_score_kg: "",
      plan_score_rep: "",
    },
  }]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {

    const response = await axios.get(`${URL_PLAN}/list`, {
      params: {
        user_id: user_id,
        FILTER: FILTER,
        PAGING: PAGING
      },
    });

    setPLAN(response.data.result ? response.data.result : PLAN_DEFAULT);

  })()}, [DATE.strDur, FILTER, PAGING]);

  // 4. date -------------------------------------------------------------------------------------->
  const dateNode = () => {
    return (
      <DateNode DATE={DATE} setDATE={setDATE} type="list" />
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <table className="table bg-white table-hover">
        <thead className="table-primary">
          <tr>
            <th>기간</th>
            <th>목표 운동 횟수</th>
            <th>목표 유산소 시간</th>
            <th>목표 운동 이름</th>
            <th>목표 중량</th>
            <th>목표 반복 횟수</th>
          </tr>
        </thead>
        <tbody>
          {PLAN.map((item) => (
            <React.Fragment key={item._id}>
              <tr>
                <td>{item.plan_dur}</td>
                <td>{item.plan_work.plan_count_total}</td>
                <td>{item.plan_work.plan_cardio_time}</td>
                <td>{item.plan_work.plan_score_name}</td>
                <td>{item.plan_work.plan_score_kg}</td>
                <td>{item.plan_work.plan_score_rep}</td>
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
      <CalendarNode filter={filter} setFILTER={setFILTER}
        DATE.strDt={DATE.strDt} setDATE.DATE.strDt={setDATE.DATE.strDt}
        DATE.strStartDt={DATE.strStartDt} DATE.setStrStartDt={DATE.setStrStartDt}
        DATE.strEndDt={DATE.strEndDt} DATE.setEndDate={DATE.setEndDate}
        DATE.strDur={DATE.strDur} setDATE.strDur={setDATE.strDur}
        calOpen={calOpen} setCalendarOpen={setCalendarOpen}
      />
    );
  };

  // 7. paging ------------------------------------------------------------------------------------>
  const pagingNode = () => {
    return (
      <PagingNode PAGING={PAGING} setPAGING={setPAGING} COUNT={COUNT}
      />
    );
  };

  // 8. filter ------------------------------------------------------------------------------------>
  const filterNode = () => {
    return (
      <FilterNode filter={filter} setFILTER={setFILTER} paging={paging} setPaging={setPaging}
        type={"plan"}
      />
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode calOpen={calOpen} setCalendarOpen={setCalendarOpen}
        DATE.strDt={DATE.strDt} setDATE.DATE.strDt={setDATE.DATE.strDt}
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

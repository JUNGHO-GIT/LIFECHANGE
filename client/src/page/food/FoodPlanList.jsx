// FoodPlanList.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {CalendarNode} from "../../assets/fragments/CalendarNode.jsx";
import {PagingNode} from "../../assets/fragments/PagingNode.jsx";
import {FilterNode} from "../../assets/fragments/FilterNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";
import {Button, ButtonGroup, Table, Form} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const FoodPlanList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD_PLAN = process.env.REACT_APP_URL_FOOD_PLAN;
  const user_id = window.sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location.pathname?.trim()?.toString();

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
  const FOOD_PLAN_DEFAULT = [{
    food_startDt: "",
    food_endDt: "",
    food_plan_startDt: "",
    food_plan_endDt: "",
    food_total_kcal: 0,
    food_total_carb: 0,
    food_total_protein: 0,
    food_total_fat: 0,
    food_plan_kcal: 0,
    food_plan_carb: 0,
    food_plan_protein: 0,
    food_plan_fat: 0,
    food_diff_kcal: 0,
    food_diff_carb: 0,
    food_diff_protein: 0,
    food_diff_fat: 0,
  }];
  const [FOOD_PLAN, setFOOD_PLAN] = useState(FOOD_PLAN_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_FOOD_PLAN}/list`, {
      params: {
        user_id: user_id,
        food_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
        food_plan_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
        FILTER: FILTER,
        PAGING: PAGING
      },
    });
    setFOOD_PLAN(response.data.result || FOOD_PLAN_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0,
    }));
  })()}, [user_id, DATE.startDt, DATE.endDt, FILTER, PAGING]);

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    function tableFragment () {
      return (
        <Table hover responsive variant={"light"}>
          <thead className={"table-primary"}>
            <tr>
              <th>기간</th>
              <th>분류</th>
              <th>목표</th>
              <th>실제</th>
              <th>비교</th>
            </tr>
          </thead>
          <tbody>
            {FOOD_PLAN?.map((item, index) => (
              <React.Fragment key={item._id}>
                <tr>
                  <td rowSpan={5} className={"pointer"} onClick={() => {
                    SEND.id = item._id;
                    SEND.startDt = item.food_plan_startDt;
                    SEND.endDt = item.food_plan_endDt;
                    navParam(SEND.toDetail, {
                      state: SEND
                    });
                  }}>
                    {item.food_plan_startDt} ~ {item.food_plan_endDt}
                  </td>
                </tr>
                <tr>
                  <td>칼로리</td>
                  <td>{item.food_plan_kcal}</td>
                  <td>{item.food_total_kcal}</td>
                  <td>{item.food_diff_kcal}</td>
                </tr>
                <tr>
                  <td>탄수화물</td>
                  <td>{item.food_plan_carb}</td>
                  <td>{item.food_total_carb}</td>
                  <td>{item.food_diff_carb}</td>
                </tr>
                <tr>
                  <td>단백질</td>
                  <td>{item.food_plan_protein}</td>
                  <td>{item.food_total_protein}</td>
                  <td>{item.food_diff_protein}</td>
                </tr>
                <tr>
                  <td>지방</td>
                  <td>{item.food_plan_fat}</td>
                  <td>{item.food_total_fat}</td>
                  <td>{item.food_diff_fat}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      );
    };
    return (
      <div className={"d-flex"}>
        {tableFragment()}
      </div>
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
        part={"food"} plan={"plan"} type={"list"}
      />
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} flowSave={""} navParam={navParam}
        part={"food"} plan={"plan"} type={"list"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className={"root-wrapper"}>
      <div className={"container-wrapper"}>
        <div className={"row d-center"}>
          <div className={"col-12 mb-20"}>
            <h1>List</h1>
          </div>
          <div className={"col-12 mb-20"}>
            {calendarNode()}
            {tableNode()}
          </div>
          <div className={"col-12 mb-20"}>
            {filterNode()}
          </div>
          <div className={"col-12 mb-20"}>
            {pagingNode()}
          </div>
          <div className={"col-12 mb-20"}>
            {buttonNode()}
          </div>
        </div>
      </div>
    </div>
  );
};
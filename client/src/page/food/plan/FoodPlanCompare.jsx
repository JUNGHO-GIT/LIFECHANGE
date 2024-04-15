// FoodPlanCompare.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import axios from "axios";
import {CalendarNode} from "../../../assets/fragments/CalendarNode.jsx";
import {PagingNode} from "../../../assets/fragments/PagingNode.jsx";
import {FilterNode} from "../../../assets/fragments/FilterNode.jsx";
import {ButtonNode} from "../../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodPlanCompare = () => {

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
      toDetail: "/food/detail",
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
  const FOOD_COMPARE_DEFAULT = [{
    food_startDt: "",
    food_endDt: "",
    food_plan_startDt: "",
    food_plan_endDt: "",
    food_kcal: 0,
    food_carb: 0,
    food_protein: 0,
    food_fat: 0,
    food_plan_kcal: 0,
    food_plan_carb: 0,
    food_plan_protein: 0,
    food_plan_fat: 0,
  }];
  const [FOOD_COMPARE, setFOOD_COMPARE] = useState(FOOD_COMPARE_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_FOOD_PLAN}/compare`, {
      params: {
        user_id: user_id,
        food_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
        food_plan_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
        FILTER: FILTER,
        PAGING: PAGING
      },
    });
    setFOOD_COMPARE(response.data.result || FOOD_COMPARE_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0,
    }));
  })()}, [user_id, DATE.startDt, DATE.endDt, FILTER, PAGING]);

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    function successOrNot (plan, real) {
      // 절댓값 구하기
      const abs = Math.abs(plan - real);
      if (real < plan) {
        return (
          <span className={"text-success"}>{abs}</span>
        );
      }
      else if (real === plan) {
        return (
          <span className={"text-primary"}>{abs}</span>
        );
      }
      else if (real > plan) {
        return (
          <span className={"text-danger"}>{abs}</span>
        );
      }
    };
    function tableFragment () {
      return (
        <table className={"table bg-white table-hover"}>
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
            {FOOD_COMPARE?.map((item, index) => (
              <React.Fragment key={item._id}>
                <tr>
                  <td rowSpan={5}>
                    {item.food_plan_startDt} ~ {item.food_plan_endDt}
                  </td>
                </tr>
                <tr>
                  <td>칼로리</td>
                  <td>{item.food_plan_kcal}</td>
                  <td>{item.food_kcal}</td>
                  <td>{successOrNot(item.food_plan_kcal, item.food_kcal)}</td>
                </tr>
                <tr>
                  <td>탄수화물</td>
                  <td>{item.food_plan_carb}</td>
                  <td>{item.food_carb}</td>
                  <td>{successOrNot(item.food_plan_carb, item.food_carb)}</td>
                </tr>
                <tr>
                  <td>단백질</td>
                  <td>{item.food_plan_protein}</td>
                  <td>{item.food_protein}</td>
                  <td>{successOrNot(item.food_plan_protein, item.food_protein)}</td>
                </tr>
                <tr>
                  <td>지방</td>
                  <td>{item.food_plan_fat}</td>
                  <td>{item.food_fat}</td>
                  <td>{successOrNot(item.food_plan_fat, item.food_fat)}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
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
        part={"food"} plan={"plan"} type={"compare"}
      />
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} flowSave={""} navParam={navParam}
        part={"food"} plan={"plan"} type={"compare"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className={"root-wrapper"}>
      <div className={"container-wrapper"}>
        <div className={"row d-center"}>
          <div className={"col-12 mb-20"}>
            <h1>Compare</h1>
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
// FoodList.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import axios from "axios";
import {CalendarNode} from "../../../assets/fragments/CalendarNode.jsx";
import {PagingNode} from "../../../assets/fragments/PagingNode.jsx";
import {FilterNode} from "../../../assets/fragments/FilterNode.jsx";
import {ButtonNode} from "../../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
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
      toDetail:"/food/detail"
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
  const [FOOD_DEFAULT, setFOOD_DEFAULT] = useState([{
    _id: "",
    food_number: 0,
    food_startDt: "",
    food_endDt: "",
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
    food_startDt: "",
    food_endDt: "",
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
        food_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
        FILTER: FILTER,
        PAGING: PAGING
      },
    });
    setFOOD(response.data.result || FOOD_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0,
    }));
  })()}, [user_id, DATE, FILTER, PAGING]);

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
                    SEND.id = item._id;
                    SEND.startDt = item.food_startDt;
                    SEND.endDt = item.food_endDt;
                    navParam(SEND.toDetail, {
                      state: SEND
                    });
                  }}>
                    {item.food_startDt}
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
        type={"food"} plan={""}
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

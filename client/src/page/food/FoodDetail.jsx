// FoodDetail.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import axios from "axios";
import {DateNode} from "../../assets/fragments/DateNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id;
  const location_date = location?.state?.date;
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:STATE, set:setSTATE} = useStorage(
    `STATE(${PATH})`, {
      id: "",
      date: "",
      refresh:0,
      toList:"/food/list",
      toSave:"/food/save"
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
  const {val:COUNT, set:setCOUNT} = useStorage(
    `COUNT(${PATH})`, {
      totalCnt: 0,
      sectionCnt: 0
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [FOOD_DEFAULT, setFOOD_DEFAULT] = useState({
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
  });
  const [FOOD, setFOOD] = useState({
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
  });

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_FOOD}/detail`, {
      params: {
        _id: location_id,
        user_id: user_id,
        food_dur: DATE.strDur
      },
    });
    setFOOD(response.data.result ? response.data.result : FOOD_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt ? response.data.totalCnt : 0,
    }));
  })()}, [location_id, user_id, DATE.strDur]);

  // 4. date -------------------------------------------------------------------------------------->
  const dateNode = () => {
    return (
      <DateNode DATE={DATE} setDATE={setDATE} type={"detail"} />
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <table className="table bg-white table-hover table-responsive">
        <thead className="table-primary">
          <tr>
            <th>음식명</th>
            <th>브랜드</th>
            <th>횟수</th>
            <th>서빙</th>
            <th>칼로리</th>
            <th>탄수화물</th>
            <th>단백질</th>
            <th>지방</th>
          </tr>
        </thead>
        <tbody>
          {FOOD?.food_section.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.food_title}</td>
                <td>{item.food_part}</td>
                <td>{item.food_count}</td>
                <td>{item.food_serv}</td>
                <td>{item.food_kcal}</td>
                <td>{item.food_carb}</td>
                <td>{item.food_protein}</td>
                <td>{item.food_fat}</td>
              </tr>
            );
          })}
          <tr>
            <td colSpan={4} className="text-end">합계</td>
            <td>{FOOD.food_total_kcal}</td>
            <td>{FOOD.food_total_carb}</td>
            <td>{FOOD.food_total_protein}</td>
            <td>{FOOD.food_total_fat}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        STATE={STATE} setSTATE={setSTATE} flowSave={""} navParam={navParam}
        type={"detail"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row mb-20 d-center">
          <div className="col-12">
            <h1>Detail</h1>
          </div>
        </div>
        <div className="row d-center mb-20">
          <div className="col-12">
            {dateNode()}
          </div>
        </div>
        <div className="row d-center mb-20">
          <div className="col-12">
            {tableNode()}
          </div>
        </div>
        <div className="row d-center">
          <div className="col-12">
            {buttonNode()}
          </div>
        </div>
      </div>
    </div>
  );
};

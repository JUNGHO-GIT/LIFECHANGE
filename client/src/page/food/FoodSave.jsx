// FoodSave.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/js/useStorage.jsx";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment-timezone";
import {BiCaretLeft, BiCaretRight} from "react-icons/bi";

// ------------------------------------------------------------------------------------------------>
export const FoodSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const location_date = location?.state?.date;
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;
  const STATE = {
    id: "",
    date: "",
    refresh:0,
    intoSave:"/food/save",
    intoList:"/food/list",
  };

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:planYn, set:setPlanYn} = useStorage(
    `planYn(${PATH})`, "N"
  );

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:strStartDate, set:setStrStartDate} = useStorage(
    `strStartDate(${PATH})`, koreanDate
  );
  const {val:strEndDate, set:setStrEndDate} = useStorage(
    `strEndDate(${PATH})`, koreanDate
  );
  const {val:strDate, set:setStrDate} = useStorage(
    `strDate(${PATH})`, location_date
  );
  const {val:strDur, set:setStrDur} = useStorage(
    `strDur(${PATH})`, `${location_date} ~ ${location_date}`
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [FOOD, setFOOD] = useState({
    _id: "",
    food_number: 0,
    food_date: "",
    food_plan : {
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
    },
    food_real : {
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
    },
  });

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setStrDate(location_date);
    setStrDur(`${location_date} ~ ${location_date}`);
  }, [location_date]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setFOOD((prev) => ({
      ...prev,
      food_date: strDur
    }));
  }, [strDur]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    const foodType = planYn === "Y" ? "food_plan" : "food_real";
    const getItem = localStorage.getItem("FOOD(/food/search/detail)");
    let storageSection = [];

    if (getItem) {
      const storedData = JSON.parse(getItem);
      storageSection = storedData[foodType].food_section;
    }

    setFOOD((prev) => {
      let newFoodSection = [...prev[foodType].food_section];

      // 첫 번째 항목이 빈 값 객체인지 확인하고, 조건에 맞으면 제거
      if (
        newFoodSection.length > 0 &&
        Object.values(newFoodSection[0]).every((value) => (value === ""))
      ) {
        newFoodSection.shift();
      }

      // 새로운 데이터가 배열인 경우 배열, 단일 객체인 경우 단일 객체를 추가
      Array.isArray(storageSection)
      ? newFoodSection.push(...storageSection)
      : newFoodSection.push(storageSection);

      return {
        ...prev,
        [foodType]: {
          ...prev[foodType],
          food_section: newFoodSection,
        },
      };
    });
  }, []);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowFoodSave = async () => {

    const response = await axios.post(`${URL_FOOD}/save`, {
      user_id: user_id,
      FOOD: FOOD,
      food_dur: strDur,
      planYn: planYn
    });
    if (response.data === "success") {
      alert("Save a food successfully");
      navParam(STATE.intoList);
    }
    else if (response.data === "fail") {
      alert("Save a food failed");
      return;
    }
    else {
      alert(`${response.data}error`);
    }
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableFoodSave = () => {

    const foodType = planYn === "Y" ? "food_plan" : "food_real";

    function handlerFoodDelete(index) {
      setFOOD((prev) => {
        const newFoodSection = [...prev[foodType].food_section];
        newFoodSection.splice(index, 1);
        return {
          ...prev,
          [foodType]: {
            ...prev[foodType],
            food_section: newFoodSection,
          },
        };
      });
    };

    return (
      <table className="table bg-white table-hover">
        <thead className="table-primary">
          <tr>
            <th>계획여부</th>
            <th>파트</th>
            <th>타이틀</th>
            <th>횟수</th>
            <th>그램</th>
            <th>칼로리</th>
            <th>지방</th>
            <th>탄수화물</th>
            <th>단백질</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <select
                id="food_planYn"
                name="food_planYn"
                className="form-select"
                value={planYn}
                onChange={(e) => {
                  setPlanYn(e.target.value);
                }}
              >
                <option value="Y">목표</option>
                <option value="N" selected>실제</option>
              </select>
            </td>
            <td colSpan={9}>
              {FOOD[foodType].food_section.map((item, index) => (
                <div key={index} className="d-flex justify-content-between">
                  <span>{item?.food_part}</span>
                  <span>{item?.food_title}</span>
                  <span>{item?.food_count} {item?.food_serv}</span>
                  <span>{item?.food_gram}</span>
                  <span>{item?.food_kcal}</span>
                  <span>{item?.food_fat}</span>
                  <span>{item?.food_carb}</span>
                  <span>{item?.food_protein}</span>
                  <span className="btn btn-sm btn-danger" onClick={() => (handlerFoodDelete(index))}>
                    x
                  </span>
                </div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonFoodSave = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary ms-2" onClick={flowFoodSave}>
        Save
      </button>
    );
  };
  const buttonRefreshPage = () => {
    return (
      <button type="button" className="btn btn-sm btn-success ms-2" onClick={() => {
        navParam(STATE.refresh);
      }}>
        Refresh
      </button>
    );
  };
  const buttonFoodList = () => {
    return (
      <button type="button" className="btn btn-sm btn-secondary ms-2" onClick={() => {
        navParam(STATE.intoList);
      }}>
        List
      </button>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row d-center mb-20">
          <div className="col-12">
            {tableFoodSave()}
          </div>
        </div>
        <div className="row d-center">
          <div className="col-12">
            {buttonFoodSave()}
            {buttonRefreshPage()}
            {buttonFoodList()}
          </div>
        </div>
      </div>
    </div>
  );
};
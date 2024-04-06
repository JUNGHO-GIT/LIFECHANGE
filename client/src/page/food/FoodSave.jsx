// FoodSave.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/js/useStorage.jsx";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";
import {BiCaretLeft, BiCaretRight} from "react-icons/bi";

// ------------------------------------------------------------------------------------------------>
export const FoodSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const user_id = window.sessionStorage.getItem("user_id");
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const location_date = location?.state?.date;
  const location_food = location?.state?.food;
  const PATH = location.pathname;
  const STATE = {
    id: "",
    date: "",
    refresh:0,
    intoList:"/food/list",
    intoSearchList:"/food/search/list",
    food: {
      planYn: "",
      category: "",
      food_title: "",
      food_brand: "",
      food_preServ: "",
      food_subServ: "",
      food_gram: "",
      food_kcal: "",
      food_fat: "",
      food_carb: "",
      food_protein: ""
    }
  };

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:planYn, set:setPlanYn} = useStorage(
    `planYn(${PATH})`, "N"
  );
  const {val:planCount, set:setPlanCount} = useStorage(
    `planCount(${PATH})`, 0
  );
  const {val:realCount, set:setRealCount} = useStorage(
    `realCount(${PATH})`, 0
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
  const [FOOD_DEFAULT, setFOOD_DEFAULT] = useState({
    _id: "",
    food_number: 0,
    food_date: "",
    food_real : {
      food_select: "",
      food_section: [{
        food_title: "",
        food_brand: "",
        food_category: "",
        food_serv: "",
        food_calories: 0,
        food_carb: 0,
        food_protein: 0,
        food_fat: 0,
      }],
    },
    food_plan : {
      food_select: "",
      food_section: [{
        food_title: "",
        food_brand: "",
        food_category: "",
        food_serv: "",
        food_calories: 0,
        food_carb: 0,
        food_protein: 0,
        food_fat: 0,
      }],
    },
  });
  const [FOOD, setFOOD] = useState({
    _id: "",
    food_number: 0,
    food_date: "",
    food_real : {
      food_select: "",
      food_section: [{
        food_title: "",
        food_brand: "",
        food_category: "",
        food_serv: "",
        food_calories: 0,
        food_carb: 0,
        food_protein: 0,
        food_fat: 0,
      }],
    },
    food_plan : {
      food_select: "",
      food_section: [{
        food_title: "",
        food_brand: "",
        food_category: "",
        food_serv: "",
        food_calories: 0,
        food_carb: 0,
        food_protein: 0,
        food_fat: 0,
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

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_FOOD}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        food_dur: strDur,
        planYn: planYn,
      },
    });

    setPlanCount(response.data.planCount ? response.data.planCount : 0);
    setRealCount(response.data.realCount ? response.data.realCount : 0);
    setFOOD(response.data.result ? response.data.result : FOOD_DEFAULT);

  })()}, [strDur]);

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

  // 4. view -------------------------------------------------------------------------------------->
  const viewFoodDay = () => {

    const calcDate = (days) => {
      const date = new Date(strDate);
      date.setDate(date.getDate() + days);
      setStrDate(moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"));
    };

    return (
      <div className="d-inline-flex">
        <div onClick={() => calcDate(-1)}>
          <BiCaretLeft className="me-10 mt-10 fs-20 pointer" />
        </div>
        <DatePicker
          dateFormat="yyyy-MM-dd"
          popperPlacement="bottom"
          selected={new Date(strDate)}
          onChange={(date) => {
            setStrDate(moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"));
          }}
        />
        <div onClick={() => calcDate(1)}>
          <BiCaretRight className="ms-10 mt-10 fs-20 pointer" />
        </div>
      </div>
    );
  };

  // 5-1. table ----------------------------------------------------------------------------------->
  const tableFoodSave = () => {
    return (
      <div>
        <div className="row d-center">
          <div className="col-6">
            <div className="input-group">
              <span className="input-group-text">계획여부</span>
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
            </div>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">아침</span>
            </div>
          </div>
          <div className="col-1">
            <button type="button" className="btn btn-sm btn-primary" onClick={() => {
              STATE.food.category = "아침";
              STATE.food.planYn = planYn;
              navParam(STATE.intoSearchList, {
                state: STATE
              });
            }}>
              Add
            </button>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">점심</span>
            </div>
          </div>
          <div className="col-1">
            <button type="button" className="btn btn-sm btn-primary" onClick={() => {
              STATE.food.category = "점심";
              STATE.food.planYn = planYn;
              navParam(STATE.intoSearchList, {
                state: STATE
              });
            }}>
              Add
            </button>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">저녁</span>
            </div>
          </div>
          <div className="col-1">
            <button type="button" className="btn btn-sm btn-primary" onClick={() => {
              STATE.food.category = "저녁";
              STATE.food.planYn = planYn;
              navParam(STATE.intoSearchList, {
                state: STATE
              });
            }}>
              Add
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonFoodSave = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary" onClick={flowFoodSave}>
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

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row d-center mb-20">
          <div className="col-12">
            <h1 className="mb-3 fw-5">
              <span>{viewFoodDay()}</span>
            </h1>
          </div>
        </div>
        <div className="row d-center mt-5 mb-20">
          <div className="col-12">
            {tableFoodSave()}
          </div>
        </div>
        <div className="row d-center">
          <div className="col-12">
            {buttonFoodSave()}
            {buttonRefreshPage()}
          </div>
        </div>
      </div>
    </div>
  );
};

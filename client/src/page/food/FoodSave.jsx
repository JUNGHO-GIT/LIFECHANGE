// FoodSave.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment-timezone";
import {useStorage} from "../../assets/js/useStorage.jsx";
import {useDeveloperMode} from "../../assets/js/useDeveloperMode.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const TITLE = "Food Save";
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  const navParam = useNavigate();
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const {title, brand, serving, calories, fat, carb, protein} = location.state;
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:foodDay, set:setFoodDay} = useStorage (
    "foodDay", new Date(koreanDate)
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [showGram, setShowGram] = useState(1);
  const [category, setCategory] = useState("morning");
  const [FOOD, setFOOD] = useState({});

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setFOOD ({
      ...FOOD,
      foodDay: moment(foodDay).format("YYYY-MM-DD"),
    });
  }, [foodDay]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowFoodSave = async (params) => {
    try {
      const FOOD = {
        food_title: title,
        food_brand: brand,
        food_category: category,
        food_serving: params,
        food_calories: logicPerServing(params, calories),
        food_carb: logicPerServing(params, carb),
        food_protein: logicPerServing(params, protein),
        food_fat: logicPerServing(params, fat),
        foodDay: moment(foodDay).format("YYYY-MM-DD"),
      };

      const response = await axios.post(`${URL_FOOD}/save`, {
        user_id : user_id,
        FOOD : FOOD,
      });
      log("FOOD : " + JSON.stringify(FOOD));

      if (response.data === "success") {
        alert("Save food successfully");
        navParam("/food/list");
      }
      else {
        alert(`${response.data}error`);
      }
    }
    catch (e) {
      alert(`Error inserting food data: ${e.message}`);
    }
  };

  // 4. view -------------------------------------------------------------------------------------->
  const viewFoodDay = () => {
    const calcDate = (days) => {
      setFoodDay((prevDate) => {
        const newDate = prevDate ? new Date(prevDate) : new Date();
        newDate.setDate(newDate.getDate() + days);
        return newDate;
      });
    };
    return (
      <div className="d-inline-flex">
        <div className="black mt-4 me-5 pointer" onClick={() => calcDate(-1)}>
          &#8592;
        </div>
        <DatePicker
          dateFormat="yyyy-MM-dd"
          popperPlacement="bottom"
          selected={foodDay}
          onChange={(date) => {
            setFoodDay(date);
          }}
        />
        <div className="black mt-4 ms-5 pointer" onClick={() => calcDate(1)}>
          &#8594;
        </div>
      </div>
    );
  };

  // 4-1. view ----------------------------------------------------------------------------------->
  const logicPerServing = (param, nutrientVal) => {
    return ((nutrientVal / logicOneServing()) * param).toFixed(1);
  };

  // 4-2. logic ----------------------------------------------------------------------------------->
  const logicOneServing = () => {

    const units = [
      {regex: /(g|ml)/gm, replace: ["g", "ml"], factor: 1},
      {regex: /(컵)/gm, replace: ["컵"], factor: 200},
      {regex: /(큰술|테이블스푼)/gm, replace: ["큰술", "테이블스푼"], factor: 15},
      {regex: /(작은술|스푼|티스푼)/gm, replace: ["작은술", "스푼", "티스푼"], factor: 5},
    ];

    for (const unit of units) {
      const match = serving.match(new RegExp(`(\\d+)(\\s*)(${unit.regex.source})`, "gm"));
      if (match) {
        let regexVal = match[0];
        unit.replace.forEach((index) => (regexVal = regexVal.replace(index, "")));
        return Number(regexVal) * unit.factor;
      }
    }
    return 1;
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableFoodSave = (
    servingAmount, title, nutrientVal
  ) => (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">{title}</h4>
        <p className="card-text">
          <span>칼로리 : </span>
          {servingAmount ? logicPerServing(servingAmount, nutrientVal) : 0}
        </p>
        <p className="card-text">
          <span>지방 : </span>
          {fat ? fat : 0}
        </p>
        <p className="card-text">
          <span>탄수화물 : </span>
          {carb ? carb : 0}
        </p>
        <p className="card-text">
          <span>단백질 : </span>
          {protein ? protein : 0}
        </p>
      </div>
    </div>
  );

  // 9. button ------------------------------------------------------------------------------------>
  const buttonFoodCategory = () => {
    return (
      <select className="form-select"onChange={e => {setCategory(e.target.value);}}>
        <option value="morning">아침</option>
        <option value="lunch">점심</option>
        <option value="dinner">저녁</option>
        <option value="snack">간식</option>
      </select>
    );
  };
  const buttonFoodAmount = () => {
    return (
      <input type="number" className="form-control" defaultValue={1} min="1" onChange={e => {
          const value = Math.max(1, Number(e.target.value));
          setShowGram(value);
        }}
      />
    );
  };
  const buttonFoodSave = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary" onClick={() => {
        flowFoodSave(showGram);
      }}>
        Save
      </button>
    );
  };
  const buttonRefreshPage = () => {
    return (
      <button type="button" className="btn btn-sm btn-success ms-2" onClick={() => {
        navParam(0);
      }}>
        Refresh
      </button>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-7">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3">
            <p>{title}</p>
            <p>{brand}</p>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-5">
            <span>{viewFoodDay()}</span>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-6">
          {tableFoodSave(0, serving ? serving : "0", calories)}
        </div>
        <div className="col-6">
          {tableFoodSave(showGram, showGram.toString(), calories)}
        </div>
        <div className="col-6">
          <div className="input-group">
            {buttonFoodCategory()}
            {buttonFoodAmount()}
          </div>
        </div>
      </div>
      <div className="row d-center mb-20">
        <div className="col-12">
          {buttonFoodSave()}
          {buttonRefreshPage()}
        </div>
        </div>
      </div>
    </div>
  );
};
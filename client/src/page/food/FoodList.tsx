// FoodList.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {DayClickEventHandler, DayPicker} from "react-day-picker";
import {useStorage} from "../../assets/ts/useStorage";
import {ko} from "date-fns/locale";
import {parseISO} from "date-fns";
import axios from "axios";
import moment from "moment-timezone";

// 1. main ---------------------------------------------------------------------------------------->
export const FoodList = () => {

  // title
  const TITLE = "Food List";
  // url
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  // date
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");
  // state
  const {val:FOOD_LIST, setVal:setFOOD_LIST} = useStorage<any>(
    "foodList(DAY)", []
  );
  const {val:resVal, setVal:setResVal} = useStorage<Date | undefined>(
    "resVal(DAY)", undefined
  );
  const {val:resDur, setVal:setResDur} = useStorage<string>(
    "resDur(DAY)", "0000-00-00 ~ 0000-00-00"
  );
  const {val:foodDay, setVal:setFoodDay} = useStorage<Date | undefined>(
    "foodDay(DAY)", koreanDate
  );

  // 2. useEffect --------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchFoodList = async () => {
      try {
        const response = await axios.get(`${URL_FOOD}/foodList`, {
          params: {
            user_id : user_id,
            food_dur : resDur,
          },
        });
        setFOOD_LIST(response.data);
      }
      catch (error:any) {
        alert(`Error fetching food data: ${error.message}`);
        setFOOD_LIST([]);
      }
    };
    fetchFoodList();
  }, [user_id, resDur]);

  // 2-5. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const formatVal = (value:number):string => {
      return value < 10 ? `0${value}` : `${value}`;
    };
    if (foodDay) {
      const year = foodDay.getFullYear();
      const month = formatVal(foodDay.getMonth() + 1);
      const date = formatVal(foodDay.getDate());
      setResVal(parseISO(`${year}-${month}-${date}`));
      setResDur(`${year}-${month}-${date} ~ ${year}-${month}-${date}`);
    }
  }, [foodDay]);

  // 3. flow -------------------------------------------------------------------------------------->

  // 4-1. logic ----------------------------------------------------------------------------------->
  const viewFoodDay = () => {
    const flowDayClick: DayClickEventHandler = (day:any) => {
      setFoodDay(day);
    };
    return (
      <DayPicker
        mode="single"
        showOutsideDays
        selected={foodDay}
        month={foodDay}
        locale={ko}
        weekStartsOn={1}
        onDayClick={flowDayClick}
        onMonthChange={(month) => setFoodDay(month)}
        modifiersClassNames={{
          selected: "selected",
          disabled: "disabled",
          outside: "outside",
          inside: "inside",
        }}
      />
    );
  };

  // 5-1. table ----------------------------------------------------------------------------------->
  const tableFoodList = () => {
    return (
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>칼로리</th>
            <th>탄수화물</th>
            <th>단백질</th>
            <th>지방</th>
          </tr>
        </thead>
        <tbody>
          {FOOD_LIST.map((index:any) => (
            <tr>
              <td>{index.food_calories}</td>
              <td>{index.food_carb}</td>
              <td>{index.food_protein}</td>
              <td>{index.food_fat}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonFoodToday = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary" onClick={() => {
        setFoodDay(koreanDate);
      }}>
        Today
      </button>
    );
  };
  const buttonFoodReset = () => {
    return (
      <button type="button" className="btn btn-sm btn-success ms-2" onClick={() => {
        setFoodDay(koreanDate);
      }}>
        Reset
      </button>
    );
  };

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="container">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-7">{TITLE}</h1>
          <h2 className="mb-3 fw-7">일별로 조회</h2>
        </div>
      </div>
      <div className="row d-center mt-3">
        <div className="col-md-6 col-12 d-center">
          {viewFoodDay()}
        </div>
        <div className="col-md-6 col-12">
          {tableFoodList()}
        </div>
      </div>
      <div className="row mb-20">
        <div className="col-12 d-center">
          {buttonFoodToday()}
          {buttonFoodReset()}
        </div>
      </div>
    </div>
  );
};

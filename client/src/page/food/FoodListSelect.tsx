// FoodListSelect.tsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {DayPicker} from "react-day-picker";
import {ko} from "date-fns/locale";
import {parseISO} from "date-fns";
import moment from "moment-timezone";
import axios from "axios";
import {useStorage} from "../../assets/ts/useStorage";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";

// ------------------------------------------------------------------------------------------------>
export const FoodListSelect = () => {

  // 1. components -------------------------------------------------------------------------------->
  const TITLE = "Food List Select";
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  const navParam = useNavigate();
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:FOOD_LIST, setVal:setFOOD_LIST} = useStorage<any>(
    "foodList(SELECT)", []
  );
  const {val:FOOD_TOTAL, setVal:setFOOD_TOTAL} = useStorage<any>(
    "foodTotal(SELECT)", []
  );
  const {val:FOOD_AVERAGE, setVal:setFOOD_AVERAGE} = useStorage<any>(
    "foodAvg(SELECT)", []
  );
  const {val:foodStartDay, setVal:setFoodStartDay} = useStorage<Date | undefined>(
    "foodStartDay(SELECT)", undefined
  );
  const {val:foodEndDay, setVal:setFoodEndDay} = useStorage<Date | undefined>(
    "foodEndDay(SELECT)", undefined
  );
  const {val:foodResVal, setVal:setFoodResVal} = useStorage<Date | undefined>(
    "foodResVal(SELECT)", undefined
  );
  const {val:foodResDur, setVal:setFoodResDur} = useStorage<string>(
    "foodResDur(SELECT)", "0000-00-00 ~ 0000-00-00"
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [foodType, setFoodType] = useState<string>("list");
  const [foodCategory, setFoodCategory] = useState<string>("all");

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    // 1. list
    const fetchFoodList = async () => {
      try {
        const response = await axios.get (`${URL_FOOD}/foodList`, {
          params: {
            user_id : user_id,
            food_dur : foodResDur,
            food_category : foodCategory
          },
        });
        setFOOD_LIST(response.data);
        log("FOOD_LIST : " + JSON.stringify(response.data));
      }
      catch (error:any) {
        setFOOD_LIST([]);
        alert(`Error fetching food data: ${error.message}`);
      }
    };
    fetchFoodList();

    // 2. total
    const fetchFoodTotal = async () => {
      try {
        const response = await axios.get (`${URL_FOOD}/foodTotal`, {
          params: {
            user_id : user_id,
            food_dur : foodResDur,
            food_category : foodCategory
          },
        });
        setFOOD_TOTAL(response.data);
        log("FOOD_TOTAL : " + JSON.stringify(response.data));
      }
      catch (error:any) {
        setFOOD_TOTAL([]);
        alert(`Error fetching food data: ${error.message}`);
      }
    };
    fetchFoodTotal();

    // 3. average
    const fetchFoodAvg = async () => {
      try {
        const response = await axios.get (`${URL_FOOD}/foodAvg`, {
          params: {
            user_id : user_id,
            food_dur : foodResDur,
            food_category : foodCategory
          },
        });
        setFOOD_AVERAGE(response.data);
        log("FOOD_AVERAGE : " + JSON.stringify(response.data));
      }
      catch (error:any) {
        setFOOD_AVERAGE([]);
        alert(`Error fetching food data: ${error.message}`);
      }
    };
    fetchFoodAvg();
  }, [user_id, foodResDur, foodCategory]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const formatVal = (value:number):string => {
      return value < 10 ? `0${value}` : `${value}`;
    };
    if (foodStartDay && foodEndDay) {
      const fromDate = new Date(foodStartDay);
      const toDate = new Date(foodEndDay);

      setFoodResVal (
        parseISO (
          `${fromDate.getFullYear()}-${formatVal(fromDate.getMonth() + 1)}-${formatVal(fromDate.getDate())} ~ ${toDate.getFullYear()}-${formatVal(toDate.getMonth() + 1)}-${formatVal(toDate.getDate())}`
        )
      );
      setFoodResDur (
        `${fromDate.getFullYear()}-${formatVal(fromDate.getMonth() + 1)}-${formatVal(fromDate.getDate())} ~ ${toDate.getFullYear()}-${formatVal(toDate.getMonth() + 1)}-${formatVal(toDate.getDate())}`
      );
    }
    else {
      setFoodResVal(undefined);
      setFoodResDur("0000-00-00 ~ 0000-00-00");
    }
  }, [foodStartDay, foodEndDay]);

  // 3-1. flow ------------------------------------------------------------------------------------>
  const flowDayClick = (day:any) => {
    if (day) {
      const selectedDay = new Date(day);

      if (foodStartDay && foodEndDay) {
        if (selectedDay < foodStartDay) {
          setFoodStartDay(selectedDay);
        }
        else if (selectedDay > foodEndDay) {
          setFoodEndDay(selectedDay);
        }
        else {
          setFoodStartDay(selectedDay);
          setFoodEndDay(undefined);
        }
      }
      else if (foodStartDay) {
        if (selectedDay < foodStartDay) {
          setFoodEndDay(foodStartDay);
          setFoodStartDay(selectedDay);
        }
        else if (selectedDay > foodStartDay) {
          setFoodEndDay(selectedDay);
        }
        else {
          setFoodStartDay(undefined);
          setFoodEndDay(undefined);
        }
      }
      else {
        setFoodStartDay(selectedDay);
      }
    }
  };

  // 4-1. logic ----------------------------------------------------------------------------------->
  const viewFoodSelect = () => {
    return (
      <DayPicker
        mode="range"
        locale={ko}
        weekStartsOn={1}
        showOutsideDays
        selected={foodStartDay && foodEndDay && {
          from: foodStartDay,
          to: foodEndDay,
        }}
        month={foodStartDay}
        onDayClick={flowDayClick}
        onMonthChange={(month) => {
          setFoodStartDay(month);
          setFoodEndDay(undefined);
        }}
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
            <th>분류</th>
            <th>음식명</th>
            <th>브랜드</th>
            <th>서빙</th>
            <th>칼로리</th>
            <th>탄수화물</th>
            <th>단백질</th>
            <th>지방</th>
          </tr>
        </thead>
        <tbody>
          {FOOD_LIST.map((index:any, i: number) => (
            <tr key={i}>
              <td>{index.food_category}</td>
              <td>{index.food_title}</td>
              <td>{index.food_brand}</td>
              <td>{index.food_serving}</td>
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

  // 5-2. table ----------------------------------------------------------------------------------->
  const tableFoodTotal = () => {
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
          {FOOD_TOTAL.map((index:any, i: number) => (
            <tr key={i}>
              <td>{index.totalCalories}</td>
              <td>{index.totalCarb}</td>
              <td>{index.totalProtein}</td>
              <td>{index.totalFat}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 5-3. table ----------------------------------------------------------------------------------->
  const tableFoodAvg = () => {
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
          {FOOD_AVERAGE.map((index:any, i: number) => (
            <tr key={i}>
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

  // 6-1. button ---------------------------------------------------------------------------------->
  const buttonFoodToday = () => {
    return (
      <button type="button" className="btn btn-sm btn-success me-2" onClick={() => {
        setFoodStartDay(koreanDate);
        setFoodEndDay(koreanDate);
        localStorage.removeItem("foodList(SELECT)");
        localStorage.removeItem("foodTotal(SELECT)");
        localStorage.removeItem("foodAvg(SELECT)");
        localStorage.removeItem("foodStartDay(SELECT)");
        localStorage.removeItem("foodEndDay(SELECT)");
      }}>
        Today
      </button>
    );
  };
  const buttonFoodReset = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => {
        setFoodStartDay(undefined);
        setFoodEndDay(undefined);
        localStorage.removeItem("foodList(SELECT)");
        localStorage.removeItem("foodTotal(SELECT)");
        localStorage.removeItem("foodAvg(SELECT)");
        localStorage.removeItem("foodStartDay(SELECT)");
        localStorage.removeItem("foodEndDay(SELECT)");
      }}>
        Reset
      </button>
    );
  };

  // 6-2. button ---------------------------------------------------------------------------------->
  const selectFoodList = () => {
    const currentPath = location.pathname || "";
    return (
      <div className="mb-3">
        <select className="form-select" id="foodListSelect" value={currentPath}
          onChange={(e:any) => {
            navParam(e.target.value);
        }}>
          <option value="/foodListDay">Day</option>
          <option value="/foodListWeek">Week</option>
          <option value="/foodListMonth">Month</option>
          <option value="/foodListYear">Year</option>
          <option value="/foodListSelect">Select</option>
        </select>
      </div>
    );
  };
  const selectFoodType = () => {
    return (
      <div className="mb-3">
        <select className="form-select" id="foodType" onChange={(e:any) => {
          if (e.target.value === "list") {
            setFoodType("list");
          }
          else if (e.target.value === "total") {
            setFoodType("total");
          }
          else if (e.target.value === "avg") {
            setFoodType("avg");
          }
        }}>
          <option value="list">List</option>
          <option value="total">Total</option>
          <option value="avg">Avg</option>
        </select>
      </div>
    );
  };
  const selectFoodCategory = () => {
    return (
      <div className="mb-3">
        <select className="form-select" id="foodCategory" onChange={(e:any) => {
          if (e.target.value === "all") {
            setFoodCategory("all");
          }
          else if (e.target.value === "morning") {
            setFoodCategory("morning");
          }
          else if (e.target.value === "lunch") {
            setFoodCategory("lunch");
          }
          else if (e.target.value === "dinner") {
            setFoodCategory("dinner");
          }
          else if (e.target.value === "snack") {
            setFoodCategory("snack");
          }
        }}>
          <option value="all">All</option>
          <option value="morning">Morning</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
      </div>
    );
  };

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="container">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-7">{TITLE}</h1>
          <h2 className="mb-3 fw-7">선택별 조회</h2>
        </div>
      </div>
      <div className="row d-center mt-3">
        <div className="col-3">
          {selectFoodList()}
        </div>
        <div className="col-3">
          {selectFoodType()}
        </div>
        <div className="col-3">
          {selectFoodCategory()}
        </div>
      </div>
      <div className="row d-center mt-3">
        <div className="col-md-6 col-12 d-center">
          {viewFoodSelect()}
        </div>
        <div className="col-md-6 col-12">
          {foodType === "list" && tableFoodList()}
          {foodType === "total" && tableFoodTotal()}
          {foodType === "avg" && tableFoodAvg()}
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

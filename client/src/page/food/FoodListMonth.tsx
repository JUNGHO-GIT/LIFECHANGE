// FoodListMonth.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {DayPicker, MonthChangeEventHandler} from "react-day-picker";
import {ko} from "date-fns/locale";
import {parseISO} from "date-fns";
import moment from "moment-timezone";
import axios from "axios";
import {useStorage} from "../../assets/ts/useStorage";

// 1. main ---------------------------------------------------------------------------------------->
export const FoodListMonth = () => {
  // title
  const TITLE = "Food List Month";
  // url
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  // date
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");

  // 2-1. useState -------------------------------------------------------------------------------->
  const [foodType, setFoodType] = useState<string>("list");

  // 2-2. useStorage ------------------------------------------------------------------------------>
  const {val:FOOD_LIST, setVal:setFOOD_LIST} = useStorage<any>(
    "foodList(MONTH)", []
  );
  const {val:FOOD_AVERAGE, setVal:setFOOD_AVERAGE} = useStorage<any>(
    "foodAvg(MONTH)", []
  );

  // 2-3. useStorage ------------------------------------------------------------------------------>
  const {val:foodMonth, setVal:setFoodMonth} = useStorage<Date | undefined>(
    "foodMonth(MONTH)", koreanDate
  );
  const {val:foodResVal, setVal:setFoodResVal} = useStorage<Date | undefined>(
    "foodResVal(MONTH)", undefined
  );
  const {val:foodResDur, setVal:setFoodResDur} = useStorage<string>(
    "foodResDur(MONTH)", "0000-00-00 ~ 0000-00-00"
  );

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    // 1. list
    const fetchFoodList = async () => {
      try {
        const response = await axios.get (`${URL_FOOD}/foodList`, {
          params: {
            user_id : user_id,
            food_dur : foodResDur,
          },
        });
        setFOOD_LIST(response.data);
        console.log("FOOD_LIST : " + JSON.stringify(response.data));
      }
      catch (error:any) {
        setFOOD_LIST([]);
        alert(`Error fetching food data: ${error.message}`);
      }
    };
    // 2. average
    const fetchFoodAvg = async () => {
      try {
        const response = await axios.get (`${URL_FOOD}/foodAvg`, {
          params: {
            user_id : user_id,
            food_dur : foodResDur,
          },
        });
        setFOOD_AVERAGE(response.data);
        console.log("FOOD_AVERAGE : " + JSON.stringify(response.data));
      }
      catch (error:any) {
        setFOOD_AVERAGE([]);
        alert(`Error fetching food data: ${error.message}`);
      }
    };
    fetchFoodList();
    fetchFoodAvg();
  }, [user_id, foodResDur]);

  // 2-5. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const formatVal = (value:number):string => {
      return value < 10 ? `0${value}` : `${value}`;
    };
    if (foodMonth) {
      setFoodResVal (
        parseISO (
          `${foodMonth.getFullYear()}-${formatVal(foodMonth.getMonth() + 1)}`
        )
      );
      setFoodResDur (
        `${foodMonth.getFullYear()}-${formatVal(foodMonth.getMonth() + 1)}-01 ~ ${foodMonth.getFullYear()}-${formatVal(foodMonth.getMonth() + 1)}-31`
      );
    }
    else {
      setFoodResVal (undefined);
    }
  }, [foodMonth]);

  // 4-1. logic ----------------------------------------------------------------------------------->
  const viewFoodMonth = () => {
    const flowMonthChange: MonthChangeEventHandler = (day) => {
      const monthDate = new Date(day.getFullYear(), day.getMonth(), 1);
      setFoodMonth(monthDate);
    };
    return (
      <DayPicker
        mode="default"
        showOutsideDays
        locale={ko}
        weekStartsOn={1}
        month={foodMonth}
        onMonthChange={flowMonthChange}
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
            <th>기간</th>
            <th>취침 시간</th>
            <th>기상 시간</th>
            <th>수면 시간</th>
          </tr>
        </thead>
        <tbody>
          {FOOD_LIST.map((index:any) => (
            <tr key={index._id}>
              <td className="pointer" onClick={() => {
                navParam("/foodDetail", {
                  state: {_id: index._id}
                }
              )}}>
                {foodResDur}
              </td>
              <td>{index.food_night}</td>
              <td>{index.food_morning}</td>
              <td>{index.food_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 5-2. table ----------------------------------------------------------------------------------->
  const tableFoodAvg = () => {
    return (
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>기간</th>
            <th>취침 평균</th>
            <th>기상 평균</th>
            <th>수면 평균</th>
          </tr>
        </thead>
        <tbody>
          {FOOD_AVERAGE.map((index:any) => (
            <tr key={index._id}>
              <td>{foodResDur}</td>
              <td>{index.avgFoodNight}</td>
              <td>{index.avgFoodMorning}</td>
              <td>{index.avgFoodTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonFoodToday = () => {
    return (
      <button type="button" className="btn btn-sm btn-success me-2" onClick={() => {
        setFoodMonth(koreanDate);
        localStorage.removeItem("foodList(MONTH)");
        localStorage.removeItem("foodAvg(MONTH)");
        localStorage.removeItem("foodMonth(MONTH)");
      }}>
        Today
      </button>
    );
  };
  const buttonFoodReset = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => {
        setFoodMonth(undefined);
        localStorage.removeItem("foodList(MONTH)");
        localStorage.removeItem("foodAvg(MONTH)");
        localStorage.removeItem("foodMonth(MONTH)");
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
        <select className="form-select" id="foodListDay" value={currentPath}
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
          else if (e.target.value === "avg") {
            setFoodType("avg");
          }
        }}>
          <option value="list">List</option>
          <option value="avg">Avg</option>
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
          <h2 className="mb-3 fw-7">월별로 조회</h2>
        </div>
      </div>
      <div className="row d-center mt-3">
        <div className="col-3">
          {selectFoodList()}
        </div>
        <div className="col-3">
          {selectFoodType()}
        </div>
      </div>
      <div className="row d-center mt-3">
        <div className="col-md-6 col-12 d-center">
          {viewFoodMonth()}
        </div>
        <div className="col-md-6 col-12">
          {foodType === "list" && tableFoodList()}
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

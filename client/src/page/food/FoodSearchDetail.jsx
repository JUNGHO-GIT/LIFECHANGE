// FoodSearchDetail.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/js/useStorage.jsx";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const FoodSearchDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id.toString();
  const location_date = location?.state?.date?.toString();
  const location_food = location?.state?.food;
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;
  const STATE = {
    refresh:0,
    intoList:"/food/list",
    intoSave:"/food/save",
    id: "",
    date: ""
  };

  // 2-2. useState -------------------------------------------------------------------------------->
  const [FOOD, setFOOD] = useState({
    title: "",
    brand: "",
    def: {
      serv: "",
      gram: "",
      kcal: "",
      fat: "",
      carb: "",
      protein: ""
    },
    gram: {
      serv: "",
      gram: "",
      kcal: "",
      fat: "",
      carb: "",
      protein: ""
    }
  });

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setFOOD(location_food);
  }, [location_food]);

  // 5. table ------------------------------------------------------------------------------------->
  const tableFoodDetail = () => {
    return (
      {/* <table className="table bg-white table-hover">
        <thead className="table-primary">
          <tr>
            <th>title</th>
            <th>brand</th>
            <th>serv</th>
            <th>kcal</th>
            <th>fat</th>
            <th>carb</th>
            <th>protein</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{FOOD.title}</td>
            <td>{FOOD.brand}</td>
            <td>{FOOD.serv}</td>
            <td>{FOOD.kcal}</td>
            <td>{FOOD.fat}</td>
            <td>{FOOD.carb}</td>
            <td>{FOOD.protein}</td>
          </tr>
        </tbody>
      </table> */}
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row d-center mt-5 mb-20">
          <div className="col-12">
            {/* {tableFoodDetail()} */}
          </div>
        </div>
      </div>
    </div>
  );
};
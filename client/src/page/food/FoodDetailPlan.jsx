// FoodDetailPlan.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment-timezone";
import {useDeveloperMode} from "../../assets/hooks/useDeveloperMode.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodDetailPlan = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const TITLE = "Food Detail";
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const _id = location.state._id;
  const user_id = window.sessionStorage.getItem("user_id");
  const food_part = location.state.food_part;
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>

  // 2-2. useState -------------------------------------------------------------------------------->
  const [food_regdate, setFood_regdate] = useState(koreanDate);
  const [FOOD, setFOOD] = useState ({});

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchFoodDetail = async () => {
      try {
        const response = await axios.get(`${URL_FOOD}/detail`, {
          params: {
            _id : _id,
          },
        });
        setFOOD(response.data);
        log("FOOD : " + JSON.stringify(response.data));
      }
      catch (e) {
        setFOOD([]);
        alert(`Error fetching food data: ${e.message}`);
      }
    };
    fetchFoodDetail();
  }, [_id]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowFoodDelete = async () => {
    try {
      const response = await axios.delete(`${URL_FOOD}/foodDelete`, {
        params: {
          _id : _id,
          user_id : user_id,
          food_regdate : food_regdate,
        },
      });
      if (response.data === "success") {
        alert("삭제되었습니다.");
        navParam(`/food/search/result`, {
          state: {
            user_id : user_id,
            food_part : food_part,
            food_regdate : food_regdate,
          },
        });
      }
      else if (response.data === "fail") {
        alert("삭제에 실패하였습니다.");
      }
      else {
        throw new Error(`Invalid response: ${response.data}`);
      }
    }
    catch (e) {
      alert(`Error fetching food data: ${e.message}`);
    }
  };

  // 4. date -------------------------------------------------------------------------------------->
  const logicViewDate = () => {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        selected={new Date(food_regdate)}
        popperPlacement="bottom"
        onChange={(date) => {
          const formatDate = moment(date).format("YYYY-MM-DD");
          setFood_regdate(formatDate);
        }}
        readOnly
      />
    );
  };

  // 6. table ------------------------------------------------------------------------------------->
  const tableFoodDetail = () => {
    return (
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
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
            <tr>
              <td>{FOOD.food_title}</td>
              <td>{FOOD.food_brand}</td>
              <td>{FOOD.food_serv}</td>
              <td>{FOOD.food_kcal}</td>
              <td>{FOOD.food_carb}</td>
              <td>{FOOD.food_protein}</td>
              <td>{FOOD.food_fat}</td>
            </tr>
          </tbody>
        </table>

    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonFoodUpdate = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary ms-2" onClick={() => {
        navParam(`/food/update`, {
          state: {_id},
        });
      }}>
        Update
      </button>
    );
  };
  const buttonFoodDelete = () => {
    return (
      <button type="button" className="btn btn-sm btn-danger ms-2" onClick={flowFoodDelete}>
        Delete
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
            <span className="ms-4"> ({food_part})</span>
          </div>
        </div>
        <div className="row d-center mt-5">
          <div className="col-12">
            <h1 className="mb-3 fw-5">
              <span className="ms-4">{logicViewDate()}</span>
            </h1>
          </div>
        </div>
        <div className="row d-center mt-5">
          <div className="col-12">
            {tableFoodDetail()}
          </div>
        </div>
        <div className="row d-center mt-5">
          <div className="col-12">
            {buttonFoodDelete()}
            {buttonFoodUpdate()}
            {buttonRefreshPage()}
          </div>
        </div>
      </div>
    </div>
  );
};

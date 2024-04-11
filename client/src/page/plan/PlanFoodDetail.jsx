// PlanFoodDetail.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import axios from "axios";
import moment from "moment-timezone";
import {DateNode} from "../../assets/fragments/DateNode.jsx";
import {CalendarNode} from "../../assets/fragments/CalendarNode.jsx";
import {PagingNode} from "../../assets/fragments/PagingNode.jsx";
import {FilterNode} from "../../assets/fragments/FilterNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const PlanFoodDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_PLAN = process.env.REACT_APP_URL_PLAN;
  const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id;
  const location_dur = location?.state?.dur;
  const location_date = location?.state?.date;
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;
  const STATE = {
    id: "",
    date: "",
    refresh:0,
    toList:"/plan/food/list",
    toSave:"/plan/food/save"
  };

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:strDate, set:setStrDate} = useStorage(
    `strDate(${PATH})`, location_date || koreanDate
  );
  const {val:strDur, set:setStrDur} = useStorage(
    `strDur(${PATH})`, location_dur
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [PLAN_DEFAULT, setPLAN_DEFAULT] = useState({
    _id: "",
    plan_number: 0,
    plan_dur: "",
    plan_schema: "food",
    plan_food: {
      plan_kcal: "",
    }
  });
  const [PLAN, setPLAN] = useState({
    _id: "",
    plan_number: 0,
    plan_dur: "",
    plan_schema: "food",
    plan_food: {
      plan_kcal: "",
    }
  });

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {
    alert(JSON.stringify(location));
  }, []);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_PLAN}/detail`, {
      params: {
        _id: location_id,
        user_id: user_id
      },
    });

    setPLAN(response.data.result ? response.data.result : PLAN_DEFAULT);

  })()}, []);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id) => {
    const response = await axios.delete(`${URL_PLAN}/delete`, {
      params: {
        _id: id,
        user_id: user_id
      },
    });
    if (response.data === "success") {
      alert("delete success");
      STATE.date = strDate;
      navParam(STATE.toList, {
        state: STATE
      });
    }
    else {
      alert(`${response.data}`);
    }
  };

  // 4. date -------------------------------------------------------------------------------------->
  const dateNode = () => {
    return (
      <DateNode strDate={strDate} setStrDate={setStrDate} type="detail" />
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <table className="table bg-white table-hover">
        <thead className="table-primary">
          <tr>
            <th>기간</th>
            <th>칼로리</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{PLAN.plan_dur}</td>
            <td>{PLAN.plan_food.plan_kcal}</td>
            <td>
              <button className="btn btn-sm btn-danger"
                onClick={() => flowDelete(PLAN._id)}
              >삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode calendarOpen={""} setCalendarOpen={""}
        strDate={strDate} setStrDate={setStrDate}
        STATE={STATE} flowSave={""} navParam={navParam}
        type="detail"
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

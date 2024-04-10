// MoneyDetailPlan.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import axios from "axios";
import {DateNode} from "../../assets/fragments/DateNode.jsx";
import {CalendarNode} from "../../assets/fragments/CalendarNode.jsx";
import {PagingNode} from "../../assets/fragments/PagingNode.jsx";
import {FilterNode} from "../../assets/fragments/FilterNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const MoneyDetailPlan = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_MONEY = process.env.REACT_APP_URL_MONEY;
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id.toString();
  const location_date = location?.state?.date;
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;
  const STATE = {
    refresh:0,
    toList:"/money/list/plan",
    toSave:"/money/save/plan",
    id: "",
    date: ""
  };

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:strDate, set:setStrDate} = useStorage(
    `strDate(${PATH})`, location_date
  );
  const {val:strDur, set:setStrDur} = useStorage(
    `strDur(${PATH})`, `${location_date} ~ ${location_date}`
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [MONEY_DEFAULT, setMONEY_DEFAULT] = useState({
    _id: "",
    money_number: 0,
    money_date: "",
    money_plan : {
      money_section: [{
        money_part_idx: 0,
        money_part_val: "전체",
        money_title_idx: 0,
        money_title_val: "전체",
        money_amount: 0,
        money_content: "",
      }],
    }
  });
  const [MONEY, setMONEY] = useState({
    _id: "",
    money_number: 0,
    money_date: "",
    money_plan : {
      money_section: [{
        money_part_idx: 0,
        money_part_val: "전체",
        money_title_idx: 0,
        money_title_val: "전체",
        money_amount: 0,
        money_content: "",
      }],
    }
  });

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_MONEY}/detail`, {
      params: {
        _id: location_id,
        user_id: user_id,
        money_dur: `${location_date} ~ ${location_date}`,
        planYn: "N",
      },
    });

    setMONEY(response.data.result ? response.data.result : MONEY_DEFAULT);

  })()}, []);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id) => {
    const response = await axios.delete(`${URL_MONEY}/delete`, {
      params: {
        _id: id,
        user_id: user_id,
        money_dur: strDur,
        planYn: "N",
      },
    });
    if (response.data === "success") {
      alert("delete success");
      STATE.date = strDate;
      navParam(STATE.toList);
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
            <th>날짜</th>
            <th>분류</th>
            <th>항목</th>
            <th>금액</th>
            <th>내용</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
        {MONEY.money_plan.money_section.map((item, index) => (
          <tr key={index}>
            {index === 0 && (
              <React.Fragment>
                <td className="fs-20 pt-20" rowSpan={MONEY.money_plan.money_section?.length}>{MONEY.money_date}</td>
              </React.Fragment>
            )}
            <td className="fs-20 pt-20">{item.money_part_val}</td>
            <td className="fs-20 pt-20">{item.money_title_val}</td>
            <td className="fs-20 pt-20">{item.money_amount}</td>
            <td className="fs-20 pt-20">{item.money_content}</td>
            <td className="fs-20 pt-20">
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => flowDelete(item._id)}
              >
                X
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode calendarOpen={""} setCalendarOpen={""}
        strDate={""} setStrDate={""}
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
            <h1>Detail (Plan)</h1>
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
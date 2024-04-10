// SleepDetailPlan.jsx

import React, {useEffect, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import axios from "axios";
import {DateNode} from "../../assets/fragments/DateNode.jsx";
import {CalendarNode} from "../../assets/fragments/CalendarNode.jsx";
import {PagingNode} from "../../assets/fragments/PagingNode.jsx";
import {FilterNode} from "../../assets/fragments/FilterNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepDetailPlan = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id.toString();
  const location_date = location?.state?.date;
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;
  const STATE = {
    id: "",
    date: "",
    refresh: 0,
    toList:"/sleep/list/plan",
    toSave:"/sleep/save/plan"
  };

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:strDate, set:setStrDate} = useStorage(
    `strDate(${PATH})`, location_date
  );
  const {val:strDur, set:setStrDur} = useStorage(
    `strDur(${PATH})`, `${location_date} ~ ${location_date}`
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [SLEEP_DEFAULT, setSLEEP_DEFAULT] = useState({
    _id: "",
    sleep_date: "",
    sleep_plan : {
      sleep_section: [{
        sleep_night: "",
        sleep_morning: "",
        sleep_time: "",
      }],
    },
  });
  const [SLEEP, setSLEEP] = useState({
    _id: "",
    sleep_date: "",
    sleep_plan : {
      sleep_section: [{
        sleep_night: "",
        sleep_morning: "",
        sleep_time: "",
      }],
    },
  });

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_SLEEP}/detail`, {
      params: {
        _id: location_id,
        user_id: user_id,
        sleep_dur: `${location_date} ~ ${location_date}`,
        planYn: "N",
      },
    });

    setSLEEP(response.data.result ? response.data.result : SLEEP_DEFAULT);

  })()}, []);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id) => {
    const response = await axios.delete(`${URL_SLEEP}/delete`, {
      params: {
        _id: id,
        user_id: user_id,
        sleep_dur: strDur,
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
            <th>취침시간</th>
            <th>기상시간</th>
            <th>수면시간</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="fs-20 pt-20">
              {SLEEP.sleep_date}
            </td>
            {SLEEP.sleep_plan.sleep_section.map((item, index) => (
              <React.Fragment key={index}>
                <td className="fs-20 pt-20">
                  {item.sleep_night}
                </td>
                <td className="fs-20 pt-20">
                  {item.sleep_morning}
                </td>
                <td className="fs-20 pt-20">
                  {item.sleep_time}
                </td>
                <td className="fs-20 pt-20">
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => (
                    flowDelete(item._id)
                  )}>
                    X
                  </button>
                </td>
              </React.Fragment>
            ))}
          </tr>
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
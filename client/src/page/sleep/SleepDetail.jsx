// SleepDetail.jsx

import React, {useEffect, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/js/useStorage.jsx";
import axios from "axios";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const SleepDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id.toString();
  const location_date = location?.state?.date?.toString();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;
  const STATE = {
    refresh:0,
    intoList:"/sleep/list",
    intoSave:"/sleep/save",
    id: "",
    date: ""
  };

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:planYn, set:setPlanYn} = useStorage(
    `planYn(${PATH})`, "N"
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
  const [SLEEP_DEFAULT, setSLEEP_DEFAULT] = useState({
    _id: "",
    sleep_date: "",
    sleep_real : {
      sleep_section: [{
        sleep_start: "",
        sleep_end: "",
        sleep_time: "",
      }],
    },
    sleep_plan : {
      sleep_section: [{
        sleep_start: "",
        sleep_end: "",
        sleep_time: "",
      }],
    },
  });
  const [SLEEP, setSLEEP] = useState({
    _id: "",
    sleep_date: "",
    sleep_real : {
      sleep_section: [{
        sleep_start: "",
        sleep_end: "",
        sleep_time: "",
      }],
    },
    sleep_plan : {
      sleep_section: [{
        sleep_start: "",
        sleep_end: "",
        sleep_time: "",
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
    setSLEEP((prev) => ({
      ...prev,
      sleep_date: strDur
    }));
  }, [strDur]);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_SLEEP}/detail`, {
      params: {
        _id: location_id,
        user_id: user_id,
        sleep_dur: `${location_date} ~ ${location_date}`,
        planYn: planYn,
      },
    });

    setSLEEP(response.data.result ? response.data.result : SLEEP_DEFAULT);

  })()}, []);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSleepDelete = async (id) => {
    const response = await axios.delete(`${URL_SLEEP}/delete`, {
      params: {
        _id: id,
        user_id: user_id,
        sleep_dur: strDur,
        planYn: planYn,
      },
    });
    if (response.data === "success") {
      alert("delete success");
      navParam(STATE.intoList);
    }
    else {
      alert("Delete failed");
    }
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableSleepDetail = () => {

    const sleepType = planYn === "Y" ? "sleep_plan" : "sleep_real";

    return (
      <table className="table bg-white table-hover">
        <thead className="table-primary">
          <tr>
            <th>날짜</th>
            <th>계획여부</th>
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
            <td>
              <select
                id="sleep_planYn"
                name="sleep_planYn"
                className="form-select"
                value={planYn}
                onChange={(e) => {
                  setPlanYn(e.target.value);
                }}
              >
                <option value="Y">목표</option>
                <option value="N" selected>실제</option>
              </select>
            </td>
            {SLEEP[sleepType].sleep_section.map((item, index) => (
              <React.Fragment key={index}>
                <td className="fs-20 pt-20">
                  {item.sleep_start}
                </td>
                <td className="fs-20 pt-20">
                  {item.sleep_end}
                </td>
                <td className="fs-20 pt-20">
                  {item.sleep_time}
                </td>
                <td className="fs-20 pt-20">
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => flowSleepDelete(item._id)}>
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
  const buttonSleepUpdate = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary ms-2" onClick={() => {
        STATE.date = strDate;
        navParam(STATE.intoSave, {
          state: STATE,
        });
      }}>
        Update
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
  const buttonSleepList = () => {
    return (
      <button type="button" className="btn btn-sm btn-secondary ms-2" onClick={() => {
        navParam(STATE.intoList);
      }}>
        List
      </button>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row d-center mb-20">
          <div className="col-12">
            {tableSleepDetail()}
          </div>
        </div>
        <div className="row d-center">
          <div className="col-12">
            {buttonSleepUpdate()}
            {buttonRefreshPage()}
            {buttonSleepList()}
          </div>
        </div>
      </div>
    </div>
  );
};
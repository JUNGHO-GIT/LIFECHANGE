// SleepDetail.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import axios from "axios";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const SleepDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  const navParam = useNavigate();
  const location = useLocation();
  const location_day = location?.state?.sleep_day;
  const location_id = location?.state?._id;
  const user_id = window.sessionStorage.getItem("user_id");

  // 2-2. useState -------------------------------------------------------------------------------->
  const [planYn, setPlanYn] = useState("N");

  // 2-2. useState -------------------------------------------------------------------------------->
  const [strDate, setStrDate] = useState(location_day ? location_day : koreanDate);
  const [strDur, setStrDur] = useState(`${strDate} ~ ${strDate}`);

  // 2-2. useState -------------------------------------------------------------------------------->
  const [SLEEP_DEFAULT, setSLEEP_DEFAULT] = useState({
    _id: "",
    sleep_day: "",
    sleep_real : {
      sleep_section: [{
        sleep_start: "",
        sleep_end: "",
        sleep_time: "",
      }]
    },
    sleep_plan : {
      sleep_section: [{
        sleep_start: "",
        sleep_end: "",
        sleep_time: "",
      }]
    }
  });
  const [SLEEP, setSLEEP] = useState({
    _id: location_id,
    sleep_day: "",
    sleep_real : {
      sleep_section: [{
        sleep_start: "",
        sleep_end: "",
        sleep_time: "",
      }]
    },
    sleep_plan : {
      sleep_section: [{
        sleep_start: "",
        sleep_end: "",
        sleep_time: "",
      }]
    }
  });

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_SLEEP}/detail`, {
      params: {
        _id: location_id,
        user_id: user_id,
        sleep_dur: strDur,
        planYn: planYn,
      },
    });

    setSLEEP(response.data.result ? response.data.result : SLEEP_DEFAULT);

  })()}, []);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setSLEEP((prev) => ({
      ...prev,
      sleep_day: strDur
    }));
  }, [strDate]);

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
      navParam(`/sleep/list`);
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
              {SLEEP.sleep_day}
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
            <td colSpan={4}>
              {SLEEP[sleepType].sleep_section.map((item, index) => (
                <div key={index} className="d-flex justify-content-between">
                  <span>{item.sleep_start}</span>
                  <span>{item.sleep_end}</span>
                  <span>{item.sleep_time}</span>
                  <button type="button" className="btn btn-sm btn-danger ms-2" onClick={() => flowSleepDelete(item._id)}>
                    X
                  </button>
                </div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonSleepUpdate = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary ms-2" onClick={() => {
        navParam(`/sleep/save`, {
          state: {
            sleep_day: strDate,
          }
        });
      }}>
        Update
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
  const buttonSleepList = () => {
    return (
      <button type="button" className="btn btn-sm btn-secondary ms-2" onClick={() => {
        navParam(`/sleep/list`);
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
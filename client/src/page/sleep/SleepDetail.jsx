// SleepDetail.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment-timezone";
import {useDeveloperMode} from "../../assets/js/useDeveloperMode.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  const navParam = useNavigate();
  const location = useLocation();
  const _id = location.state._id;
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-2. useState -------------------------------------------------------------------------------->
  const [planYn, setPlanYn] = useState("N");
  const [dateDate, setDateDate] = useState(new Date(koreanDate));
  const [strDate, setStrDate] = useState(koreanDate);

  // 2-2. useState -------------------------------------------------------------------------------->
  const initState = (YN) => ({
    _id: "",
    user_id: user_id,
    sleep_day: koreanDate,
    sleep_planYn: YN,
    sleep_start: "",
    sleep_end: "",
    sleep_time: "",
  });
  const [SLEEP_PLAN, setSLEEP_PLAN] = useState(initState("Y"));
  const [SLEEP_REAL, setSLEEP_REAL] = useState(initState("N"));

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {

    const SLEEP = planYn === "N" ? SLEEP_REAL : SLEEP_PLAN;
    const setSLEEP = planYn === "N" ? setSLEEP_REAL : setSLEEP_PLAN;

    const response = await axios.get(`${URL_SLEEP}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        sleep_day: strDate,
        planYn: planYn,
      },
    });

    response.data.result !== null
    ? setSLEEP(response.data.result)
    : setSLEEP(initState(planYn));

    log("SLEEP : " + JSON.stringify(SLEEP));

  })()}, [strDate, planYn]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSleepDelete = async () => {
    try {
      const confirm = window.confirm("Are you sure you want to delete?");
      if (!confirm) {
        return;
      }
      else {
        const response = await axios.delete(`${URL_SLEEP}/sleepDelete`, {
          params: {
            _id : _id,
          },
        });
        if (response.data === "success") {
          alert("Delete success");
          navParam(`/sleep/ist`);
        }
        else {
          alert("Delete failed");
        }
      }
    }
    catch (e) {
      alert(`Error fetching sleep data: ${e.message}`);
    }
  };

  // 4. view -------------------------------------------------------------------------------------->

  // 5. table ------------------------------------------------------------------------------------->
  const tableSleepInsert = () => {

    const SLEEP = planYn === "N" ? SLEEP_REAL : SLEEP_PLAN;
    const setSLEEP = planYn === "N" ? setSLEEP_REAL : setSLEEP_PLAN;

    return (
      <table className="table bg-white table-hover">

        <thead className="table-primary">
          <tr>
            <th>날짜</th>
            <th>계획여부</th>
            <th>취침시간</th>
            <th>기상시간</th>
            <th>수면시간</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{SLEEP.sleep_day}</td>
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
            <td>{SLEEP.sleep_start}</td>
            <td>{SLEEP.sleep_end}</td>
            <td>{SLEEP.sleep_time}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonSleepDelete = () => {
    return (
      <button type="button" className="btn btn-sm btn-danger ms-2" onClick={flowSleepDelete}>
        Delete
      </button>
    );
  };
  const buttonSleepUpdate = (_id) => {
    return (
      <button type="button" className="btn btn-sm btn-primary ms-2" onClick={() => {
        navParam(`/sleep/update`, {
          state: {_id},
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
        <div className="row d-center mt-5">
          <div className="col-12">
            {tableSleepInsert()}
            <br />
            {buttonSleepDelete()}
            {/* {buttonSleepUpdate(SLEEP._id)} */}
            {buttonRefreshPage()}
            {buttonSleepList()}
          </div>
        </div>
      </div>
    </div>
  );
};
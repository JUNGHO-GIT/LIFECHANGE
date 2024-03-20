// WorkUpdate.tsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import axios from "axios";
import moment from "moment-timezone";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";

// ------------------------------------------------------------------------------------------------>
export const WorkUpdate = () => {

  // 1. components -------------------------------------------------------------------------------->
  const TITLE = "Work Update";
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  const navParam = useNavigate();
  const location = useLocation();
  const _id = location.state._id;
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>

  // 2-2. useState -------------------------------------------------------------------------------->
  const [WORK, setWORK] = useState<any>({});

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchWorkDetail = async () => {
      try {
        const response = await axios.get(`${URL_WORK}/workDetail`, {
          params: {
            _id : _id,
          },
        });
        setWORK(response.data);
        log("WORK : " + JSON.stringify(response.data));
      }
      catch (error:any) {
        alert(`Error fetching work data: ${error.message}`);
        setWORK([]);
      }
    };
    fetchWorkDetail();
  }, [_id]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowWorkUpdate = async () => {
    try {
      const response = await axios.put (`${URL_WORK}/workUpdate`, {
        _id : WORK._id,
        WORK : WORK
      });
      if (response.data === "success") {
        alert("Update success");
        navParam("/workListDay");
      }
      else {
        alert("Update failed");
      }
    }
    catch (error:any) {
      alert(`Error fetching work data: ${error.message}`);
    }
  };

  // 4. view -------------------------------------------------------------------------------------->

  // 5. table ------------------------------------------------------------------------------------->
  const tableWorkUpdate = () => {
    return (
      <div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="user_id"
            placeholder="User ID"
            value={WORK.user_id ? WORK.user_id : ""}
            readOnly
          />
          <label htmlFor="user_id">User ID</label>
        </div>

        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="work_set"
            value={WORK.work_set ? WORK.work_set : ""}
            placeholder="Set"
            onChange={(e:any) => {
              setWORK({
                ...WORK,
                work_set: e.target.value,
              });
            }}
          />
          <label htmlFor="work_set">Set</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="work_count"
            value={WORK.work_count ? WORK.work_count : ""}
            placeholder="Count"
            onChange={(e:any) => {
              setWORK({
                ...WORK,
                work_count: e.target.value,
              });
            }}
          />
          <label htmlFor="work_count">Count</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="work_kg"
            value={WORK.work_kg ? WORK.work_kg : ""}
            placeholder="Kg"
            onChange={(e:any) => {
              setWORK({
                ...WORK,
                work_kg: e.target.value,
              });
            }}
          />
          <label htmlFor="work_kg">Kg</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="work_rest"
            value={WORK.work_rest ? WORK.work_rest : ""}
            placeholder="Rest"
            onChange={(e:any) => {
              setWORK({
                ...WORK,
                work_rest: e.target.value,
              });
            }}
          />
          <label htmlFor="work_rest">Rest</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="work_time"
            value={WORK.work_time ? WORK.work_time : ""}
            placeholder="Time"
            onChange={(e:any) => {
              setWORK({
                ...WORK,
                work_time: e.target.value,
              });
            }}
          />
          <label htmlFor="work_time">Time</label>
        </div>
      </div>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonWorkUpdate = () => {
    return (
      <button className="btn btn-sm btn-primary ms-2" type="button" onClick={flowWorkUpdate}>
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

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="container-wrapper">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-7">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">
          <form className="form-inline">
            {tableWorkUpdate()}
            <br/>
            {buttonWorkUpdate()}
            {buttonRefreshPage()}
          </form>
        </div>
      </div>
    </div>
  );
};
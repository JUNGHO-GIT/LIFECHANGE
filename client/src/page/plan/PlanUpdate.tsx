// PlanUpdate.tsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import axios from "axios";
import moment from "moment-timezone";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";

// ------------------------------------------------------------------------------------------------>
export const PlanUpdate = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const TITLE = "Plan Update";
  const URL_PLAN = process.env.REACT_APP_URL_PLAN;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  const navParam = useNavigate();
  const location = useLocation();
  const _id = location.state._id;
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>

  // 2-2. useState -------------------------------------------------------------------------------->
  const [PLAN, setPLAN] = useState<any> ({});

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchPlanDetail = async () => {
      try {
        const response = await axios.get(`${URL_PLAN}/planDetail`, {
          params: {
            _id : _id,
          },
        });
        setPLAN(response.data);
        log("PLAN : " + JSON.stringify(response.data));
      }
      catch (error:any) {
        alert(`Error fetching plan data: ${error.message}`);
        setPLAN([]);
      }
    };
    fetchPlanDetail();
  }, [_id]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowPlanUpdate = async () => {
    try {
      const response = await axios.put (`${URL_PLAN}/planUpdate`, {
        _id : PLAN._id,
        PLAN : PLAN
      });
      if (response.data === "success") {
        alert("Update success");
        navParam("/planListDay");
      }
      else {
        alert("Update failed");
      }
    }
    catch (error:any) {
      alert(`Error fetching plan data: ${error.message}`);
    }
  };

  // 4. view -------------------------------------------------------------------------------------->

  // 5. table ------------------------------------------------------------------------------------->
  const tablePlanUpdate = () => {
    return (
      <div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="user_id"
            placeholder="User ID"
            value={PLAN.user_id ? PLAN.user_id : ""}
            readOnly
          />
          <label htmlFor="user_id">User ID</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="plan_content"
            value={PLAN.plan_content ? PLAN.plan_content : ""}
            placeholder="Content"
            onChange={(e:any) => {
              setPLAN({
                ...PLAN,
                plan_content: e.target.value,
              });
            }}
          />
          <label htmlFor="plan_content">Content</label>
        </div>
      </div>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonPlanUpdate = () => {
    return (
      <button className="btn btn-sm btn-primary ms-2" type="button" onClick={flowPlanUpdate}>
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
    <div className="root-wrapper">
      <div className="container-wrapper">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-7">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">
          <form className="form-inline">
            {tablePlanUpdate()}
            <br/>
            {buttonPlanUpdate()}
            {buttonRefreshPage()}
          </form>
        </div>
        </div>
      </div>
    </div>
  );
};
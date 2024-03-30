// PlanDetail.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import axios from "axios";
import moment from "moment-timezone";
import {useDeveloperMode} from "../../assets/js/useDeveloperMode.jsx";

// ------------------------------------------------------------------------------------------------>
export const PlanDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const TITLE = "Plan Detail";
  const URL_PLAN = process.env.REACT_APP_URL_PLAN;
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  const navParam = useNavigate();
  const location = useLocation();
  const _id = location.state._id;
  const planSection_id = location.state.planSection_id;
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>

  // 2-2. useState -------------------------------------------------------------------------------->
  const [PLAN, setPLAN] = useState ({});

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchPlanDetail = async () => {
      try {
        const response = await axios.get(`${URL_PLAN}/detail`, {
          params: {
            _id : _id,
            planSection_id : planSection_id
          },
        });
        setPLAN(response.data);
        log("PLAN : " + JSON.stringify(response.data));
      }
      catch (e) {
        alert(`Error fetching plan data: ${e.message}`);
        setPLAN({});
      }
    };
    fetchPlanDetail();
  }, [_id]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowPlanDelete = async () => {
    try {
      const confirm = window.confirm("Are you sure you want to delete?");
      if (!confirm) {
        return;
      }
      else {
        const response = await axios.delete(`${URL_PLAN}/planDelete`, {
          params: {
            _id : _id,
            planSection_id : planSection_id
          },
        });
        if (response.data === "success") {
          alert("Delete Success");
          navParam(`/plan/list`);
        }
        else {
          alert("Delete failed");
        }
      }
    }
    catch (e) {
      alert(`Error fetching plan data: ${e.message}`);
    }
  };

  // 4. view -------------------------------------------------------------------------------------->

  // 5. table ------------------------------------------------------------------------------------->
  const tablePlanDetail = () => {
    return (
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Part</th>
            <th>Title</th>
            <th>Content</th>
          </tr>
        </thead>
        <tbody>
          {PLAN?.planSection?.flatMap((planItem) => (
            <tr key={planItem._id}>
              <td>{planItem.plan_part_val}</td>
              <td>{planItem.plan_title_val}</td>
              <td>{planItem.plan_content}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonPlanDelete = () => {
    return (
      <button type="button" className="btn btn-sm btn-danger ms-2" onClick={flowPlanDelete}>
        Delete
      </button>
    );
  };
  const buttonPlanUpdate = (_id) => {
    return (
      <button
        type="button"
        className="btn btn-sm btn-primary ms-2"
        onClick={() => {
          navParam(`/plan/update`, {
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
  const buttonPlanList = () => {
    return (
      <button type="button" className="btn btn-sm btn-secondary ms-2" onClick={() => {
        navParam(`/plan/list`);
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
          <h1 className="mb-3 fw-7">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12 d-center">
          {tablePlanDetail()}
        </div>
      </div>
      <div className="row mb-20">
        <div className="col-12 d-center">
          {buttonRefreshPage()}
          {buttonPlanUpdate(PLAN._id)}
          {buttonPlanDelete()}
          {buttonPlanList()}
        </div>
        </div>
      </div>
    </div>
  );
};

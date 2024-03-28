// WorkDetail.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import axios from "axios";
import moment from "moment-timezone";
import {useDeveloperMode} from "../../assets/js/useDeveloperMode.jsx";

// ------------------------------------------------------------------------------------------------>
export const WorkDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const TITLE = "Work Detail";
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  const navParam = useNavigate();
  const location = useLocation();
  const _id = location.state._id;
  const work_section_id = location.state.work_section_id;
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>

  // 2-2. useState -------------------------------------------------------------------------------->
  const [WORK, setWORK] = useState ({});

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchWorkDetail = async () => {
      try {
        const response = await axios.get(`${URL_WORK}/work/detail`, {
          params: {
            _id : _id,
            work_section_id : work_section_id
          },
        });
        setWORK(response.data);
        log("WORK : " + JSON.stringify(response.data));
      }
      catch (e) {
        alert(`Error fetching work data: ${e.message}`);
        setWORK({});
      }
    };
    fetchWorkDetail();
  }, [_id]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowWorkDelete = async () => {
    try {
      const confirm = window.confirm("Are you sure you want to delete?");
      if (!confirm) {
        return;
      }
      else {
        const response = await axios.delete(`${URL_WORK}/workDelete`, {
          params: {
            _id : _id,
            work_section_id : work_section_id
          },
        });
        if (response.data === "success") {
          alert("Delete Success");
          navParam(`/work/list`);
        }
        else {
          alert("Delete failed");
        }
      }
    }
    catch (e) {
      alert(`Error fetching work data: ${e.message}`);
    }
  };

  // 4. view -------------------------------------------------------------------------------------->

  // 5. table ------------------------------------------------------------------------------------->
  const tableWorkDetail = () => {
    return (
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Part</th>
            <th>Title</th>
            <th>Kg</th>
            <th>Set</th>
            <th>Count</th>
            <th>Rest</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {WORK?.work_section?.flatMap((workItem) => (
            <tr key={workItem._id}>
              <td>{workItem.work_part_val}</td>
              <td>{workItem.work_title_val}</td>
              <td>{workItem.work_kg}</td>
              <td>{workItem.work_set}</td>
              <td>{workItem.work_count}</td>
              <td>{workItem.work_rest}</td>
              <td>{WORK.work_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonWorkDelete = () => {
    return (
      <button type="button" className="btn btn-sm btn-danger ms-2" onClick={flowWorkDelete}>
        Delete
      </button>
    );
  };
  const buttonWorkUpdate = (_id) => {
    return (
      <button
        type="button"
        className="btn btn-sm btn-primary ms-2"
        onClick={() => {
          navParam(`/work/update`, {
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
  const buttonWorkList = () => {
    return (
      <button type="button" className="btn btn-sm btn-secondary ms-2" onClick={() => {
        navParam(`/work/list`);
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
          {tableWorkDetail()}
        </div>
      </div>
      <div className="row mb-20">
        <div className="col-12 d-center">
          {buttonRefreshPage()}
          {buttonWorkUpdate(WORK._id)}
          {buttonWorkDelete()}
          {buttonWorkList()}
        </div>
        </div>
      </div>
    </div>
  );
};

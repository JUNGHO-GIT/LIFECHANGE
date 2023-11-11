// WorkDetail.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// 1. main ---------------------------------------------------------------------------------------->
export const WorkDetail = () => {

  // title
  const TITLE = "Work Detail";
  // url
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  // date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const _id = location.state._id;
  const workSection_id = location.state.workSection_id;
  const user_id = window.sessionStorage.getItem("user_id");
  // state
  const [WORK, setWORK] = useState<any> ({});

  // 2-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchWorkDetail = async () => {
      try {
        const response = await axios.get(`${URL_WORK}/workDetail`, {
          params: {
            _id : _id,
            workSection_id : workSection_id
          },
        });
        setWORK(response.data);
      }
      catch (error:any) {
        alert(`Error fetching work data: ${error.message}`);
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
            workSection_id : workSection_id
          },
        });
        if (response.data === "success") {
          alert("Delete Success");
          navParam(`/workListDay`);
        }
        else {
          alert("Delete failed");
        }
      }
    }
    catch (error:any) {
      alert(`Error fetching work data: ${error.message}`);
    }
  };

  // 4. logic ------------------------------------------------------------------------------------->

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
          {WORK?.workSection?.flatMap((workItem) => (
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

  // 6. button ------------------------------------------------------------------------------------>
  const buttonWorkDelete = () => {
    return (
      <button type="button" className="btn btn-sm btn-danger ms-2" onClick={flowWorkDelete}>
        Delete
      </button>
    );
  };
  const buttonWorkUpdate = (_id: string) => {
    return (
      <button
        type="button"
        className="btn btn-sm btn-primary ms-2"
        onClick={() => {
          navParam(`/workUpdate`, {
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
        navParam(`/workListDay`);
      }}>
        List
      </button>
    );
  };

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="container">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-8">{TITLE}</h1>
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
  );
};

// WorkList.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// 1. main ---------------------------------------------------------------------------------------->
export const WorkList = () => {

  // title
  const TITLE = "Work List";
  // url
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  // date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");
  // state
  const [WORK_LIST, setWORK_LIST] = useState<any> ([]);
  const [work_regdate, setWork_regdate] = useState(koreanDate);

  // 2-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchWorkList = async () => {
      try {
        const response = await axios.get (`${URL_WORK}/workList`, {
          params: {
            user_id: user_id,
            work_regdate : work_regdate,
          }
        });
        setWORK_LIST(response.data);
      }
      catch (error: any) {
        alert(`Error fetching work data: ${error.message}`);
        setWORK_LIST([]);
      }
    };
    fetchWorkList();
  }, [user_id, work_regdate]);

  // 3. flow -------------------------------------------------------------------------------------->

  // 4. logic ------------------------------------------------------------------------------------->
  const logicViewDate = () => {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        selected={new Date (work_regdate)}
        popperPlacement="bottom"
        onChange={(date: any) => {
          const selectedDate = date.toISOString().split("T")[0];
          setWork_regdate(selectedDate);
        }}
      />
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableWorkList = () => {
    return (
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
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
          {WORK_LIST.map((index : any) => (
            <tr key={index}>
              <td>{buttonWorkDetail(index._id, index.user_id)}</td>
              <td>{index.work_part}</td>
              <td>{index.work_title}</td>
              <td>{index.work_kg}</td>
              <td>{index.work_set}</td>
              <td>{index.work_count}</td>
              <td>{index.work_rest}</td>
              <td>{index.work_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonWorkDetail = (_id:string, user_id:string) => {
    return (
      <p onClick={(e) => {
        e.preventDefault();
        navParam(`/workDetail`, {state: {_id: _id}})
      }}>
        {user_id}
      </p>
    );
  };
  const buttonWorkInsert = () => {
    return (
      <button type="button" className="btn btn-primary ms-2" onClick={() => {
        navParam(`/workInsert`);
      }}>
        Insert
      </button>
    );
  };
  const buttonRefreshPage = () => {
    return (
      <button type="button" className="btn btn-success ms-2" onClick={() => {
        window.location.reload();
      }}>
        Refresh
      </button>
    );
  };

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="container">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-9">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-5">
            <span className="ms-4">{logicViewDate()}</span>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-10">
          <form className="form-inline">
            {tableWorkList()}
            <br/>
            {buttonRefreshPage()}
            {buttonWorkInsert()}
          </form>
        </div>
      </div>
    </div>
  );
};
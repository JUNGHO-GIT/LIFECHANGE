// BoardList.tsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";

// ------------------------------------------------------------------------------------------------>
export const BoardList = () => {

  // 1-1. title
  const TITLE = "Board List";
  // 1-2. url
  const URL_BOARD = process.env.REACT_APP_URL_BOARD;
  // 1-3. date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // 1-4. hook
  const navParam = useNavigate();
  const location = useLocation();
  // 1-5. val
  const user_id = window.sessionStorage.getItem("user_id");
  // 1-6. log
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>

  // 2-2. useState -------------------------------------------------------------------------------->
  const [BOARD_LIST, setBOARD_LIST] = useState<any> ([]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchBoardList = async () => {
      try {
        const response = await axios.get (`${URL_BOARD}/boardList`);
        setBOARD_LIST(response.data);
      }
      catch (error:any) {
        alert(`Error fetching board data: ${error.message}`);
        setBOARD_LIST([]);
      }
    };
    fetchBoardList();
  }, []);

  // 3. flow -------------------------------------------------------------------------------------->

  // 4. logic ------------------------------------------------------------------------------------->

  // 5. table ------------------------------------------------------------------------------------->
  const tableBoardList = () => {
    return (
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {BOARD_LIST.map((index: any) => (
            <tr key={index._id}>
              <td>{buttonBoardDetail(index._id, index.user_id)}</td>
              <td>{index.board_title}</td>
              <td>{index.board_regdate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonBoardDetail = (_id: string, user_id: string) => {
    return (
      <p onClick={(e) => {
        e.preventDefault();
        navParam(`/boardDetail`, {state: {_id: _id}})
      }}>
        {user_id}
      </p>
    );
  };
  const buttonBoardInsert = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary ms-2" onClick={() => {
        navParam(`/boardInsert`);
      }}>
        Insert
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
  const buttonBoardList = () => {
    return (
      <button type="button" className="btn btn-sm btn-secondary ms-2" onClick={() => {
        navParam(`/boardList`);
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
          <h1 className="mb-3 fw-7">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-10">
          <form className="form-inline">
            {tableBoardList()}
            <br/>
            {buttonRefreshPage()}
            {buttonBoardInsert()}
            {buttonBoardList()}
          </form>
        </div>
      </div>
    </div>
  );
};
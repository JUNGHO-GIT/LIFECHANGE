// BoardList.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const BoardList = () => {

  // title
  const TITLE = "Board List";
  // url
  const URL_BOARD = process.env.REACT_APP_URL_BOARD;
  // date
  const koreanDate = moment.tz('Asia/Seoul').format('YYYY-MM-DD').toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");
  // state
  const [BOARD_LIST, setBOARD_LIST] = useState<any>([]);

  // 2. useEffect --------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchBoardList = async () => {
      try {
        const response = await axios.get (`${URL_BOARD}/boardList`);
        setBOARD_LIST(response.data);
      }
      catch (error: any) {
        alert(`Error fetching board data: ${error.message}`);
        setBOARD_LIST([]);
      }
    };
    fetchBoardList();
  }, []);

  // ---------------------------------------------------------------------------------------------->
  const boardListTable = () => {
    return (
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {BOARD_LIST.map((index : any) => (
            <tr key={index._id}>
              <td>
                <a onClick={() => buttonBoardDetail(index._id)} className="text-hover">
                  {index.user_id}
                </a>
              </td>
              <td>{index.board_title}</td>
              <td>{index.board_regdate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonBoardDetail = (_id: string) => {
    navParam(`/boardDetail`, {
      state: {
        _id
      }
    });
  };
  const buttonRefreshPage = () => {
    return (
      <Link to="/boardList">
        <button type="button" className="btn btn-success ms-2">Refresh</button>
      </Link>
    );
  };
  const buttonBoardInsert = () => {
    return (
      <Link to="/boardInsert">
        <button type="button" className="btn btn-primary ms-2">Insert</button>
      </Link>
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
        <div className="col-10">
          <form className="form-inline">
            {boardListTable()}
            {buttonRefreshPage()}
            {buttonBoardInsert()}
          </form>
        </div>
      </div>
    </div>
  );
};
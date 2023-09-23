// BoardUpdate.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// 1. main ---------------------------------------------------------------------------------------->
export const BoardUpdate = () => {

  // title
  const TITLE = "Board Update";
  // url
  const URL_BOARD = process.env.REACT_APP_URL_BOARD;
  // date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const _id = location.state._id;
  const user_id = window.sessionStorage.getItem("user_id");
  // state
  const [BOARD, setBOARD] = useState<any> ({});

  // 2. useEffect --------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchBoardDetail = async () => {
      try {
        const response = await axios.get(`${URL_BOARD}/boardDetail`, {
          params: {
            _id : _id,
          },
        });
        setBOARD(response.data);
      }
      catch (error:any) {
        alert(`Error fetching board data: ${error.message}`);
        setBOARD([]);
      }
    };
    fetchBoardDetail();
  }, [_id]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowBoardUpdate = async () => {
    try {
      const response = await axios.put(`${URL_BOARD}/boardUpdate`, {
        _id : BOARD._id,
        BOARD : BOARD,
      });
      if (response.data === "success") {
        alert("Update success");
        navParam(`/boardList`);
      }
      else {
        alert("Update failed");
      }
    }
    catch (error:any) {
      alert(`Error updating board data: ${error.message}`);
    }
  };

  // 4. logic ------------------------------------------------------------------------------------->

  // 5. table ------------------------------------------------------------------------------------->
  const tableBoardUpdate = () => {
    return (
      <div>
        <div className="form-floating">
          <input type="text" className="form-control"  placeholder="User ID"
          value={BOARD.user_id} readOnly />
          <label htmlFor="user_id">User ID</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Title" value={BOARD.board_title} onChange={(e) => setBOARD({...BOARD, board_title: e.target.value})} />
          <label htmlFor="floatingTitle">Title</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Content"
          value={BOARD.board_content}
          onChange={(e) => setBOARD({...BOARD, board_content: e.target.value})} />
          <label htmlFor="floatingContent">Content</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Board Date"
          value={BOARD.board_regdate} readOnly />
          <label htmlFor="board_regdate">Board Date</label>
        </div>
      </div>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonBoardUpdate = () => {
    return (
      <button className="btn btn-primary ms-2" type="button" onClick={() => {
        flowBoardUpdate();
      }}>
        Update
      </button>
    );
  };
  const buttonBoardList = () => {
    return (
      <button type="button" className="btn btn-secondary ms-2" onClick={() => {
        navParam(`/boardList`);
      }}>
        List
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
        <div className="col-10">
          <form className="form-inline">
            {tableBoardUpdate()}
            <br/>
            {buttonBoardUpdate()}
            {buttonBoardList()}
            {buttonRefreshPage()}
          </form>
        </div>
      </div>
    </div>
  );
};
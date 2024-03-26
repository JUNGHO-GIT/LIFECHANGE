// BoardInsert.tsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import axios from "axios";
import moment from "moment-timezone";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";

// ------------------------------------------------------------------------------------------------>
export const BoardInsert = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const TITLE = "Board Insert";
  const URL_BOARD = process.env.REACT_APP_URL_BOARD;
  const URL_USER = process.env.REACT_APP_URL_USER;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  const navParam = useNavigate();
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>

  // 2-2. useState -------------------------------------------------------------------------------->
  const [BOARD, setBOARD] = useState<any> ({});

  // 2-3. useEffect ------------------------------------------------------------------------------->

  // 3. flow -------------------------------------------------------------------------------------->
  const flowBoardInsert = async () => {

    if (BOARD.board_title === "") {
      alert("Please enter a title");
      return;
    }
    else if (BOARD.board_content === "") {
      alert("Please enter a content");
      return;
    }
    else {
      const response = await axios.post (`${URL_BOARD}/boardInsert`, {
        user_id : user_id,
        BOARD : BOARD,
      });
      if (response.data === "success") {
        alert("Insert a board successfully");
        navParam(`/boardList`);
      }
      else {
        alert(`${response.data}error`);
      }
    }

  };

  // 4. view -------------------------------------------------------------------------------------->

  // 5. table ------------------------------------------------------------------------------------->
  const tableBoardInsert = () => {
    return (
      <div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            id="user_id"
            placeholder="User ID"
            value={user_id ? user_id : ""}
            onChange={(e:any) => {
              setBOARD({...BOARD, user_id: e.target.value});
            }}
            readOnly
          />
          <label htmlFor="user_id">User ID</label>
        </div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            placeholder="Title"
            value={BOARD.board_title}
            id="floatingTitle"
            onChange={(e:any) => {
              setBOARD({...BOARD, board_title: e.target.value});
            }}
          />
          <label htmlFor="floatingTitle">Title</label>
        </div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            placeholder="Content"
            value={BOARD.board_content}
            id="floatingContent"
            onChange={(e:any) => {
              setBOARD({...BOARD, board_content: e.target.value});
            }}
          />
          <label htmlFor="floatingContent">Content</label>
        </div>
      </div>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonBoardInsert = () => {
    return (
      <button className="btn btn-sm btn-primary" type="button" onClick={flowBoardInsert}>
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
        <div className="col-12">
          <form  className="form-inline">
            {tableBoardInsert()}
            <br/>
            {buttonBoardInsert()}
            {buttonRefreshPage()}
            {buttonBoardList()}
          </form>
        </div>
        </div>
      </div>
    </div>
  );
};
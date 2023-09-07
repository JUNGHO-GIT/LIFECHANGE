// BoardInsert.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const BoardInsert = () => {

  // title
  const TITLE = "Board Insert";
  // url
  const URL_BOARD = process.env.REACT_APP_URL_BOARD;
  const URL_USER = process.env.REACT_APP_URL_USER;
  // date
  const koreanDate = moment.tz('Asia/Seoul').format('YYYY-MM-DD').toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");
  // state
  const [board_title, setBoard_title] = useState("");
  const [board_content, setBoard_content] = useState("");
  const [board_regdate, setBoard_regdate] = useState(koreanDate);

  // ---------------------------------------------------------------------------------------------->
  const boardInsertFlow = async () => {
    try {
      if (board_title === "") {
        alert("Please enter a title");
        return;
      }
      else if (board_content === "") {
        alert("Please enter a content");
        return;
      }
      else {
        const response = await axios.post (`${URL_BOARD}/boardInsert`, {
          user_id: user_id,
          board_title: board_title,
          board_content: board_content,
          board_regdate: board_regdate,
        });
        if (response.data === "success") {
          alert("Insert a board successfully");
          window.location.href = "/boardList";
        }
        else if (response.data === "fail") {
          alert("Insert a board failed");
        }
        else {
          alert(`${response.data}error`);
        }
      }
    }
    catch (error: any) {
      alert(`Error fetching board data: ${error.message}`);
    }
  };

  // ---------------------------------------------------------------------------------------------->
  const boardInsertTable = () => {
    return (
      <div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            id="user_id"
            placeholder="User ID"
            value={user_id || ""}
            readOnly
          />
          <label htmlFor="user_id">User ID</label>
        </div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            placeholder="Title"
            value={board_title}
            id="floatingTitle"
            onChange={(e) => {
              setBoard_title(e.target.value);
            }}
          />
          <label htmlFor="floatingTitle">Title</label>
        </div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            placeholder="Content"
            value={board_content}
            id="floatingContent"
            onChange={(e) => {
              setBoard_content(e.target.value);
            }}
          />
          <label htmlFor="floatingContent">Content</label>
        </div>
      </div>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonBoardInsert = () => {
    return (
      <button className="btn btn-primary" type="button" onClick={boardInsertFlow}>
        Insert
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
          <form  className="form-inline">
            {boardInsertTable()}
            <br/>
            {buttonBoardInsert()}
          </form>
        </div>
      </div>
    </div>
  );
};
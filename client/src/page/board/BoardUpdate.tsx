// BoardUpdate.tsx
import React, {useEffect, useState} from "react";
import axios from "axios";
import {createGlobalStyle} from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";

// ------------------------------------------------------------------------------------------------>
const BoardUpdateStyle = createGlobalStyle`
  .boardUpdate {
    display: flex;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
  }

  .form-BoardUpdate {
    max-width: 330px;
    padding: 15px;
  }

  .form-BoardUpdate .form-floating:focus-within {
    z-index: 2;
  }

  .form-BoardUpdate input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  .form-BoardUpdate input[type="boardPw"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`;

// ------------------------------------------------------------------------------------------------>
const BoardUpdate = () => {
  const navParam = useNavigate();
  const _id = useLocation().state._id;
  const [board_title, setBoard_title] = useState<string>("");
  const [board_content, setBoard_content] = useState<string>("");
  const [board, setBoard] = useState<any>();

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchBoardDetail = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:4000/board/boardDetail/${_id}`);
        setBoard(response.data);
      }
      catch (err) {
        console.error(err);
        setBoard(null);
      }
    };
    fetchBoardDetail();
  }, [_id]);

  // ---------------------------------------------------------------------------------------------->
  const BoardUpdateFlow = async () => {
    try {
      const response = await axios.put(`http://127.0.0.1:4000/board/boardUpdate/${_id}`, board);
      if (response.data === "success") {
        alert("Update success");
      }
      else {
        alert("Update failed");
      }
    }
    catch (err) {
      console.error(err);
    }
  };
  if (!board) {
    return (
      <div>Loading...</div>
    );
  }

  // ---------------------------------------------------------------------------------------------->
  return (
    <section className="boardUpdate custom-flex-center"><BoardUpdateStyle />
      <form>
        <div className="empty-h50"></div>
        <h1 className="mb-3">Board Update</h1>
        <div className="empty-h20"></div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            id="user_id"
            placeholder="User ID"
            value={board.user_id}
            readOnly
          />
          <label htmlFor="user_id">User ID</label>
        </div>
        <div className="empty-h20"></div>
        <div className="form-floating">
          <input
            className="form-control"
            type="text"
            placeholder="Title"
            value={board.board_title}
            id="floatingTitle"
            onChange={(e) => setBoard({...board, board_title: e.target.value})}
          />
          <label htmlFor="floatingTitle">Title</label>
        </div>
        <div className="empty-h20"></div>
        <div className="form-floating">
          <input
            className="form-control"
            type="text"
            placeholder="Content"
            value={board.board_content}
            id="floatingContent"
            onChange={(e) => setBoard({...board, board_content: e.target.value})}
          />
          <label htmlFor="floatingContent">Content</label>
        </div>
        <div className="empty-h20"></div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            id="board_regdate"
            placeholder="Board Date"
            value={board.board_regdate}
            readOnly
          />
          <label htmlFor="board_regdate">Board Date</label>
        </div>
        <div className="empty-h100"></div>
        <button className="btn btn-primary" type="button" onClick={BoardUpdateFlow}>
          Update
        </button>
        <div className="empty-h50"></div>
      </form>
    </section>
  );
};

export default BoardUpdate;

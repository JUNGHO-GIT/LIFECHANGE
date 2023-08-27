// BoardUpdate.tsx
import React, {useEffect, useState} from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

// ------------------------------------------------------------------------------------------------>
const BoardUpdate = () => {
  const [board, setBoard] = useState<any>(null);
  const _id = useLocation().state._id;
  const URL = "http://127.0.0.1:4000/board";
  const TITLE = "Board Update";

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchBoardDetail = async () => {
      try {
        const response = await axios.get(`${URL}/boardDetail/${_id}`);
        setBoard(response.data);
      }
      catch (error: any) {
        alert(`Error fetching board data: ${error.message}`);
        setBoard([]);
      }
    };
    fetchBoardDetail();
  }, [_id]);

  // ---------------------------------------------------------------------------------------------->
  const BoardUpdateFlow = async () => {
    try {
      const response = await axios.put(`${URL}/boardUpdate/${_id}`, board);
      if (response.data === "success") {
        alert("Update success");
        window.location.href = "/boardList";
      }
      else {
        alert("Update failed");
      }
    }
    catch (error: any) {
      alert(`Error fetching board data: ${error.message}`);
    }
  };

  // ---------------------------------------------------------------------------------------------->
  const boardUpdateTable = () => {
    return (
      <>
        <div className="form-floating">
          <input type="text" className="form-control"  placeholder="User ID"
          value={board.user_id} readOnly />
          <label htmlFor="user_id">User ID</label>
        </div>
        <div className="empty-h20"></div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Title" value={board.board_title} onChange={(e) => setBoard({...board, board_title: e.target.value})} />
          <label htmlFor="floatingTitle">Title</label>
        </div>
        <div className="empty-h20"></div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Content"
          value={board.board_content}
          onChange={(e) => setBoard({...board, board_content: e.target.value})} />
          <label htmlFor="floatingContent">Content</label>
        </div>
        <div className="empty-h20"></div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Board Date"
          value={board.board_regdate} readOnly />
          <label htmlFor="board_regdate">Board Date</label>
        </div>
      </>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const buttonBoardUpdate = () => {
    return (
      <button className="btn btn-primary" type="button" onClick={BoardUpdateFlow}>
        Update
      </button>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container">
      <div className="empty-h50"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-12">
          <h1 className="mb-3 fw-9">{TITLE}</h1>
        </div>
      </div>
      <div className="empty-h50"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-10">
          <form className="form-inline">
            {boardUpdateTable()}
            <div className="empty-h50"></div>
            {buttonBoardUpdate()}
          </form>
        </div>
      </div>
      <div className="empty-h200"></div>
    </div>
  );
};

export default BoardUpdate;

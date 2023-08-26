// BoardDetail.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
const BoardDetail = () => {
  const navParam = useNavigate();
  const _id = useLocation().state._id;
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
        setBoard([]);
      }
    };
    fetchBoardDetail();
  }, [_id]);

  if (!board) {
    return (
      <div>Loading...</div>
    );
  }

  // button --------------------------------------------------------------------------------------->
  const boardDeleteFlow = async () => {
    const confirm = window.confirm("Are you sure you want to delete?");
    if (!confirm) {
      return;
    }
    else {
      try {
        const response = await axios.delete(`http://127.0.0.1:4000/board/boardDelete/${_id}`);
        if (response.data === "success") {
          window.location.href = "/";
        }
        else {
          alert("Delete failed");
        }
      }
      catch (err) {
        console.error(err);
      }
    }
  };

  const buttonBoardDelete = (): React.ReactNode => {
    return (
      <button onClick={boardDeleteFlow} className="btn btn-danger">Delete</button>
    );
  };

  const buttonBoardUpdate = (_id: string): React.ReactNode => {
    const navButton = () => navParam(`/boardUpdate`, {
      state: {
        _id
      }
    });
    return (
      <button onClick={navButton} className="btn btn-primary">Update</button>
    );
  };

  const buttonRefreshPage = () => {
    return (
      <Link to="/boardDetail">
        <button type="button" className="btn btn-success">Refresh</button>
      </Link>
    );
  };

  const buttonBoardList = () => {
    return (
      <Link to="/boardList">
        <button type="button" className="btn btn-secondary">List</button>
      </Link>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const BoardDetailTable = () => {
    return (
      <table className="table table-striped table-bordered">
        <tbody>
          <tr>
            <th scope="row">ID</th>
            <td>{board.user_id}</td>
          </tr>
          <tr>
            <th scope="row">Board Title</th>
            <td>{board.board_title}</td>
          </tr>
          <tr>
            <th scope="row">Board Content</th>
            <td>{board.board_content}</td>
          </tr>
          <tr>
            <th scope="row">Board Date</th>
            <td>{board.board_regdate}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container">
      <div className="empty-h50"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-12">
          <h1 className="mb-3 fw-9">Board Detail</h1>
        </div>
      </div>
      <div className="empty-h50"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-10">
          <form className="form-inline">
            {BoardDetailTable()}
            <div className="empty-h50"></div>
            {buttonRefreshPage()}
            &nbsp;
            {buttonBoardUpdate(board._id)}
            &nbsp;
            {buttonBoardDelete()}
            &nbsp;
            {buttonBoardList()}
            <div className="empty-h50"></div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BoardDetail;
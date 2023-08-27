// BoardDetail.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const BoardDetail = () => {

  const [BOARD, setBOARD] = useState<any>({});
  const navParam = useNavigate();
  const _id = useLocation().state._id;
  const URL = "http://127.0.0.1:4000/board";
  const TITLE = "Board Detail";

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchBoardDetail = async () => {
      try {
        const response = await axios.get (`${URL}/boardDetail/${_id}`);
        setBOARD(response.data);
      }
      catch (error: any) {
        alert(`Error fetching board data: ${error.message}`);
        setBOARD([]);
      }
    };
    fetchBoardDetail();
  }, [_id]);

  // ---------------------------------------------------------------------------------------------->
  const boardDeleteFlow = async () => {
    try {
      const confirm = window.confirm("Are you sure you want to delete?");
      if (!confirm) {
        return;
      }
      else {
        const response = await axios.delete (`${URL}/boardDelete/${_id}`);
        if (response.data === "success") {
          window.location.href = "/";
        }
        else {
          alert("Delete failed");
        }
      }
    }
    catch (error: any) {
      alert(`Error fetching board data: ${error.message}`);
    }
  };

  // ---------------------------------------------------------------------------------------------->
  const boardDetailTable = () => {
    return (
      <table className="table table-striped table-bordered">
        <tbody>
          <tr>
            <th>ID</th>
            <td>{BOARD.user_id}</td>
          </tr>
          <tr>
            <th>Board Title</th>
            <td>{BOARD.board_title}</td>
          </tr>
          <tr>
            <th>Board Content</th>
            <td>{BOARD.board_content}</td>
          </tr>
          <tr>
            <th>Board Date</th>
            <td>{BOARD.board_regdate}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const buttonBoardDelete = () => {
    return (
      <button type="button" className="btn btn-danger ms-2" onClick={boardDeleteFlow}>Delete
      </button>
    );
  };
  const buttonBoardUpdate = (_id: string) => {
    const navButton = () => navParam(`/boardUpdate`, {
      state: {
        _id
      }
    });
    return (
      <button type="button" className="btn btn-primary ms-2" onClick={navButton}>Update</button>
    );
  };
  const buttonRefreshPage = () => {
    return (
      <Link to="/boardDetail">
        <button type="button" className="btn btn-success ms-2">Refresh</button>
      </Link>
    );
  };
  const buttonBoardList = () => {
    return (
      <Link to="/boardList">
        <button type="button" className="btn btn-secondary ms-2">List</button>
      </Link>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container">
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-9">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-10">
          <form className="form-inline">
            {boardDetailTable()}
            <br/>
            {buttonRefreshPage()}
            {buttonBoardUpdate(BOARD._id)}
            {buttonBoardDelete()}
            {buttonBoardList()}
          </form>
        </div>
      </div>
    </div>
  );
};
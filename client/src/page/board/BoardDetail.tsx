// BoardDetail.tsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
const BoardDetailStyle = createGlobalStyle`
  .boardDetail {
    display: flex;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
  }

  .form-boardDetail {
    max-width: 330px;
    padding: 15px;
  }

  .form-boardDetail .form-floating:focus-within {
    z-index: 2;
  }
`;

// ------------------------------------------------------------------------------------------------>
const BoardDetail = () => {
  const location = useLocation();
  const _id = location.state._id;
  const [board, setBoard] = useState<any>(null);

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

  if (!board) {
    return (
      <div>Loading...</div>
    );
  }

  // ---------------------------------------------------------------------------------------------->
  const navParam = useNavigate();
  const ButtonBoardUpdate = (_id: string) => {
    const navButton = () => navParam(`/boardUpdate`, {
      state: {
        _id
      }
    });
    navButton();
  };
  };

  // ---------------------------------------------------------------------------------------------->
  const buttonBoardDelete = async () => {
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

  // ---------------------------------------------------------------------------------------------->
  const refreshBoardDetail = () => {
    window.location.reload();
  };

  const buttonBoardList = () => {
    window.location.href = "/boardList";
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <section className="boardDetail custom-flex-center"><BoardDetailStyle />
      <form>
        <div className="empty-h50"></div>
        <h1 className="mb-3">Board Detail</h1>
        <div className="empty-h20"></div>
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
        <div className="empty-h20"></div>
        <button className="btn btn-success" type="button" onClick={refreshBoardDetail}>
          Refresh
        </button>
        &nbsp;
        <button className="btn btn-primary" type="button" onClick={() => ButtonBoardUpdate(board._id)}>
          Update
        </button>
        &nbsp;
        <button className="btn btn-danger" type="button" onClick={buttonBoardDelete}>
          Delete
        </button>
        &nbsp;
        <button className="btn btn-secondary" type="button" onClick={buttonBoardList}>
          List
        </button>
      </form>
    </section>
  );
};

export default BoardDetail;

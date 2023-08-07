import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { createGlobalStyle } from "styled-components";

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
interface Board {
  _id: string,
  boardId: string,
  boardTitle: string,
  boardContent: string,
  boardDate: String
}

// ------------------------------------------------------------------------------------------------>
const BoardDetail = () => {
  const { _id } = useParams<{ _id: string }>();
  const [board, setBoard] = useState<Board | null>(null);

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

  if (!board) return <div>Loading...</div>;

  // ---------------------------------------------------------------------------------------------->
  const buttonBoardUpdate = (_id: string) => {
    window.location.href = "/boardUpdate/" + _id;
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
    <div>
      <BoardDetailStyle />
      <section className="boardDetail custom-flex-center">
        <form>
          <div className="empty-h50"></div>
          <h1 className="mb-3">Board Detail</h1>
          <div className="empty-h20"></div>
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th scope="row">Board ID</th>
                <td>{board.boardId}</td>
              </tr>
              <tr>
                <th scope="row">Board Title</th>
                <td>{board.boardTitle}</td>
              </tr>
              <tr>
                <th scope="row">Board Content</th>
                <td>{board.boardContent}</td>
              </tr>
              <tr>
                <th scope="row">Board Date</th>
                <td>{board.boardDate}</td>
              </tr>
            </tbody>
          </table>
          <div className="empty-h20"></div>
          <button className="btn btn-success" type="button" onClick={refreshBoardDetail}>
            Refresh
          </button>
          &nbsp;
          <button className="btn btn-primary" type="button" onClick={() => buttonBoardUpdate(board._id)}>
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
    </div>
  );
};

export default BoardDetail;

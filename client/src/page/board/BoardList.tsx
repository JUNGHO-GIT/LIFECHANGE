// BoardList.tsx
import React, {useState, useEffect} from "react";
import axios from "axios";
import {createGlobalStyle} from "styled-components";

// ------------------------------------------------------------------------------------------------>
const BoardListStyle = createGlobalStyle`
  .boardList {
    display: flex;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
  }

  .form-boardList {
    max-width: 330px;
    padding: 15px;
  }

  .form-boardList .form-floating:focus-within {
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
const BoardList = () => {
  const [BoardList, setBoardList] = useState<Board[]>([]);

  const fetchBoardList = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:4000/board/boardList");
      setBoardList(response.data);
    }
    catch (err) {
      console.error(err);
      setBoardList([]);
    }
  };

  const buttonBoardDetail = (_id: string) => {
    window.location.href = "/boardDetail/" + _id;
  };

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    fetchBoardList();
  }, []);

  // ---------------------------------------------------------------------------------------------->
  const refreshBoardList = () => {
    window.location.reload();
  };

  const buttonBoardWrite = () => {
    window.location.href = "/boardWrite";
  };

  const buttonBoardList = () => {
    window.location.href = "/boardList";
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div>
      <BoardListStyle />
      <section className="boardList custom-flex-center">
        <form>
          <div className="empty-h50"></div>
          <h1 className="mb-3">Board List</h1>
          <div className="empty-h20"></div>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Title</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {BoardList.map((board) => (
                <tr key={board._id}>
                  <td>
                    <a onClick={() => buttonBoardDetail(board._id)} className="text-hover">
                      {board.boardId}
                    </a>
                  </td>
                  <td>{board.boardTitle}</td>
                  <td>{board.boardDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="empty-h100"></div>
          <button type="button" className="btn btn-success" onClick={refreshBoardList}>
            Refresh
          </button>
          &nbsp;
          <button type="button" className="btn btn-primary" onClick={buttonBoardWrite}>
            Write
          </button>
          &nbsp;
          <button type="button" className="btn btn-secondary" onClick={buttonBoardList}>
            List
          </button>
          <div className="empty-h50"></div>
        </form>
      </section>
    </div>
  );
};

export default BoardList;

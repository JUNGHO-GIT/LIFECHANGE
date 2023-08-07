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

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    fetchBoardList();
  }, []);

  // ---------------------------------------------------------------------------------------------->
  const refreshBoardList = () => {
    window.location.reload();
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
                <th scope="col">Board ID</th>
                <th scope="col">Board Title</th>
                <th scope="col">Board Content</th>
                <th scope="col">Board Date</th>
              </tr>
            </thead>
            <tbody>
              {BoardList.map((board) => (
                <tr key={board._id}>
                  <td>{board.boardId}</td>
                  <td>{board.boardTitle}</td>
                  <td>{board.boardContent}</td>
                  <td>{board.boardDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="empty-h100"></div>
          <button type="button" className="btn btn-primary" onClick={refreshBoardList}>
            Refresh Board List
          </button>
          <div className="empty-h50"></div>
        </form>
      </section>
    </div>
  );
};

export default BoardList;

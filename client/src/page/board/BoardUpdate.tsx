import React, {useEffect, useState} from "react";
import axios from "axios";
import {createGlobalStyle} from "styled-components";
import {useParams} from "react-router-dom";

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
interface Board {
  _id: string,
  boardId: string,
  boardTitle: string,
  boardContent: string,
  boardDate: string,
}

// ------------------------------------------------------------------------------------------------>
const BoardUpdate = () => {
  const { _id } = useParams<{ _id: string }>();
  const [board, setBoard] = useState<Board | null>(null);

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
      if (response.data === 'success') {
        window.location.href = `/boardDetail/${_id}`;
      }
      else {
        alert('Update failed');
      }
    }
    catch (err) {
      console.error(err);
    }
  };

  if (!board) return <div>Loading...</div>;

  // ---------------------------------------------------------------------------------------------->
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setBoard({ ...board, [id]: value });
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div>
      <BoardUpdateStyle />
      <section className="boardUpdate custom-flex-center">
        <form>
          <div className="empty-h50"></div>
          <h1 className="mb-3">Board Update</h1>
          <div className="empty-h20"></div>
          <div className="form-floating">
            <input type="text"
              className="form-control"
              id="boardId"
              placeholder="User ID"
              value={board.boardId}
              readOnly
            />
            <label htmlFor="boardId">User ID</label>
          </div>
          <div className="empty-h20"></div>
          <div className="form-floating">
            <input
              className="form-control"
              type="text"
              placeholder="Title"
              value={board.boardTitle}
              id="floatingTitle"
              onChange={(e) => setBoard({...board, boardTitle: e.target.value})}
            />
            <label htmlFor="floatingTitle">Title</label>
          </div>
          <div className="empty-h20"></div>
          <div className="form-floating">
            <input
              className="form-control"
              type="text"
              placeholder="Content"
              value={board.boardContent}
              id="floatingContent"
              onChange={(e) => setBoard({...board, boardContent: e.target.value})}
            />
            <label htmlFor="floatingContent">Content</label>
          </div>
          <div className="empty-h20"></div>
          <div className="form-floating">
            <input type="text"
              className="form-control"
              id="boardDate"
              placeholder="Board Date"
              value={board.boardDate}
              readOnly
            />
            <label htmlFor="boardDate">Board Date</label>
          </div>
          <div className="empty-h100"></div>
          <button className="btn btn-primary" type="button" onClick={BoardUpdateFlow}>
            Update
          </button>
          <div className="empty-h50"></div>
        </form>
      </section>
    </div>
  );
};

export default BoardUpdate;

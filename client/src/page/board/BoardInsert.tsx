// BoardInsert.tsx
import React, {useEffect, useState} from "react";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const BoardInsert = () => {

  const [user_id, setUserId] = useState("");
  const [board_title, setBoardTitle] = useState("");
  const [board_content, setBoardContent] = useState("");
  const [board_regdate, setBoardDate] = useState(new Date().toISOString());
  const URL_BOARD = process.env.REACT_APP_URL_BOARD;
  const URL_USER = process.env.REACT_APP_URL_USER;
  const TITLE = "Board Insert";

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchBoardInsert = async () => {
      const user_id = window.sessionStorage.getItem("user_id");
      try {
        const response = await axios.post(`${URL_USER}/userDetail`, {
          user_id : user_id,
        });

        if (response.status === 200) {
          const user_id = response.data.user_id;
          setUserId(user_id);
        }
        else {
          throw new Error("Server responded with an error");
        }
      }
      catch (error: any) {
        alert(`Error fetching user data: ${error.message}`);
      }
    };
    fetchBoardInsert();
  }, []);

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
        setBoardDate(new Date().toISOString().split('T')[0]);
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
            value={user_id}
            onChange={(e) => {
              setUserId(e.target.value);
            }}
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
              setBoardTitle(e.target.value);
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
              setBoardContent(e.target.value);
            }}
          />
          <label htmlFor="floatingContent">Content</label>
        </div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            id="board_regdate"
            placeholder="Board Date"
            value={board_regdate}
            readOnly
            onChange={(e) => {
              setBoardDate(e.target.value);
            }}
          />
          <label htmlFor="board_regdate">Board Date</label>
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const buttonBoardInsert = () => {
    return (
      <button className="btn btn-primary" type="button" onClick={boardInsertFlow}>
        Insert
      </button>
    );
  };

  // ---------------------------------------------------------------------------------------------->
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
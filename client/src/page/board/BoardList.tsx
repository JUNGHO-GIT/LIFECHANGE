// BoardList.tsx
import React, {useState, useEffect} from "react";
import {createGlobalStyle} from "styled-components";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

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
const BoardList = () => {
  const [boardList, setBoardList] = useState<[]>([]);

  // ---------------------------------------------------------------------------------------------->
  const navParam = useNavigate();
  const ButtonBoardDetail = (_id: string) => {
    const navButton = () => navParam(`/boardDetail`, {
      state: {
        _id
      }
    });
    navButton();
  };

  const refreshBoardList = () => {
    return (
      <Link to="/boardList" className="btn btn-success">
        Refresh
      </Link>
    );
  };

  const buttonBoardInsert = () => {
    return (
      <Link to="/boardInsert" className="btn btn-primary">
        Insert
      </Link>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchBoardList = async () => {
      try {
        const response = await axios.get ("http://127.0.0.1:4000/board/boardList");
        setBoardList(response.data);
      }
      catch (err) {
        console.error(err);
        setBoardList([]);
      }
    };

    fetchBoardList();
  }, []);

  // ---------------------------------------------------------------------------------------------->
  return (
    <section className="boardList custom-flex-center"><BoardListStyle />
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
            {boardList.map((index : any) => (
              <tr key={index}>
                <td>
                  <a onClick={() => ButtonBoardDetail(index._id)} className="text-hover">
                    {index.user_id}
                  </a>
                </td>
                <td>{index.board_title}</td>
                <td>{index.board_regdate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="empty-h100"></div>
        {refreshBoardList()}
        &nbsp;
        {buttonBoardInsert()}
        <div className="empty-h50"></div>
      </form>
    </section>
  );
};

export default BoardList;

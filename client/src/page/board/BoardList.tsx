// BoardList.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
const BoardList = () => {
  const [boardList, setBoardList] = useState<[]>([]);
  const navParam = useNavigate();

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
  const buttonBoardDetail = (_id: string) => {
    const navButton = () => navParam(`/boardDetail`, {
      state: {
        _id
      }
    });
    navButton();
  };

  const buttonRefreshPage = () => {
    return (
      <Link to="/boardList">
        <button type="button" className="btn btn-success">Refresh</button>
      </Link>
    );
  };

  const buttonBoardInsert = () => {
    return (
      <Link to="/boardInsert">
        <button type="button" className="btn btn-primary">Insert</button>
      </Link>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const BoardListTable = () => {
    return (
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
                <a onClick={() => buttonBoardDetail(index._id)} className="text-hover">
                  {index.user_id}
                </a>
              </td>
              <td>{index.board_title}</td>
              <td>{index.board_regdate}</td>
            </tr>
          ))}
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
          <h1 className="mb-3 fw-9">Board List</h1>
        </div>
      </div>
      <div className="empty-h50"></div>
      <div className="row d-flex justify-content-center">
        <div className="col-10">
          <form className="form-inline">
            {BoardListTable()}
            <div className="empty-h50"></div>
            {buttonRefreshPage()}
            &nbsp;
            {buttonBoardInsert()}
            <div className="empty-h50"></div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BoardList;

// BoardList.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const BoardList = () => {

  const [BOARD_LIST, setBOARD_LIST] = useState<any>([]);
  const navParam = useNavigate();
  const URL_BOARD = process.env.REACT_APP_URL_BOARD;
  const TITLE = "Board List";

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchBoardList = async () => {
      try {
        const response = await axios.get (`${URL_BOARD}/boardList`);
        setBOARD_LIST(response.data);
      }
      catch (error: any) {
        alert(`Error fetching board data: ${error.message}`);
        setBOARD_LIST([]);
      }
    };
    fetchBoardList();
  }, []);

  // ---------------------------------------------------------------------------------------------->
  const boardListTable = () => {
    return (
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {BOARD_LIST.map((index : any) => (
            <tr key={index._id}>
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
  const buttonBoardDetail = (_id: string) => {
    navParam(`/boardDetail`, {
      state: {
        _id
      }
    });
  };
  const buttonRefreshPage = () => {
    return (
      <Link to="/boardList">
        <button type="button" className="btn btn-success ms-2">Refresh</button>
      </Link>
    );
  };
  const buttonBoardInsert = () => {
    return (
      <Link to="/boardInsert">
        <button type="button" className="btn btn-primary ms-2">Insert</button>
      </Link>
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
          <form className="form-inline">
            {boardListTable()}
            {buttonRefreshPage()}
            {buttonBoardInsert()}
          </form>
        </div>
      </div>
    </div>
  );
};
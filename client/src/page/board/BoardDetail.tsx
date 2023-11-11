// BoardDetail.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const BoardDetail = () => {

  // title
  const TITLE = "Board Detail";
  // url
  const URL_BOARD = process.env.REACT_APP_URL_BOARD;
  // date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const _id = location.state._id;
  // state
  const [BOARD, setBOARD] = useState<any> ({});

  // 2. useEffect --------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchBoardDetail = async () => {
      try {
        const response = await axios.get(`${URL_BOARD}/boardDetail`, {
          params: {
            _id: _id,
          },
        });
        setBOARD(response.data);
      }
      catch (error:any) {
        alert(`Error fetching board data: ${error.message}`);
        setBOARD([]);
      }
    };
    fetchBoardDetail();
  }, [_id]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowBoardDelete = async () => {
    try {
      const confirm = window.confirm("Are you sure you want to delete?");
      if (!confirm) {
        return;
      }
      else {
        const response = await axios.delete(`${URL_BOARD}/boardDelete`, {
          params: {
            _id: _id,
          },
        });
        if (response.data === "success") {
          alert("Delete success");
          navParam(`/boardList`);
        }
        else {
          alert("Delete failed");
        }
      }
    }
    catch (error:any) {
      alert(`Error fetching board data: ${error.message}`);
    }
  };

  // 4. logic ------------------------------------------------------------------------------------->

  // 5. table ------------------------------------------------------------------------------------->
  const tableBoardDetail = () => {
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

  // 6. button ------------------------------------------------------------------------------------>
  const buttonBoardDelete = () => {
    return (
      <button type="button" className="btn btn-sm btn-danger ms-2" onClick={flowBoardDelete}>
        Delete
      </button>
    );
  };
  const buttonBoardUpdate = (_id: string) => {
    return (
      <button type="button" className="btn btn-sm btn-primary ms-2" onClick={(() => {
        navParam(`/boardUpdate`, {
          state: {_id},
        });
      })}>
        Update
      </button>
    );
  };
  const buttonRefreshPage = () => {
    return (
      <button type="button" className="btn btn-sm btn-success ms-2" onClick={() => {
        navParam(0);
      }}>
        Refresh
      </button>
    );
  };
  const buttonBoardList = () => {
    return (
      <button type="button" className="btn btn-sm btn-secondary ms-2" onClick={() => {
        navParam(`/boardList`);
      }}>
        List
      </button>
    );
  };

  // 7. return ------------------------------------------------------------------------------------>
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
            {tableBoardDetail()}
            <br />
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

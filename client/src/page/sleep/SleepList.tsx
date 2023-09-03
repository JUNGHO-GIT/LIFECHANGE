// SleepList.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const SleepList = () => {

  const [BOARD_LIST, setBOARD_LIST] = useState<[]>([]);
  const navParam = useNavigate();
  const URL = "http://127.0.0.1:4000/sleep";
  const TITLE = "Sleep List";

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchSleepList = async () => {
      try {
        const response = await axios.get (`${URL}/sleepList`);
        setBOARD_LIST(response.data);
      }
      catch (error: any) {
        alert(`Error fetching sleep data: ${error.message}`);
        setBOARD_LIST([]);
      }
    };
    fetchSleepList();
  }, []);

  // ---------------------------------------------------------------------------------------------->
  const sleepListTable = () => {
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
            <tr key={index}>
              <td>
                <a onClick={() => buttonSleepDetail(index._id)} className="text-hover">
                  {index.user_id}
                </a>
              </td>
              <td>{index.sleep_title}</td>
              <td>{index.sleep_regdate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const buttonSleepDetail = (_id: string) => {
    navParam(`/sleepDetail`, {
      state: {
        _id
      }
    });
  };
  const buttonRefreshPage = () => {
    return (
      <Link to="/sleepList">
        <button type="button" className="btn btn-success ms-2">Refresh</button>
      </Link>
    );
  };
  const buttonSleepInsert = () => {
    return (
      <Link to="/sleepInsert">
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
            {sleepListTable()}
            {buttonRefreshPage()}
            {buttonSleepInsert()}
          </form>
        </div>
      </div>
    </div>
  );
};
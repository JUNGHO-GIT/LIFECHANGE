// SleepList.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const SleepList = () => {

  // 1. title
  const TITLE = "Sleep List";
  // 2. url
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  // 3. date
  const koreanDate = moment.tz('Asia/Seoul').format('YYYY-MM-DD').toString();
  // 4. hook
  const navParam = useNavigate();
  const location = useLocation();
  // 5. val
  const user_id = window.sessionStorage.getItem("user_id");
  // 6. state
  const [SLEEP_LIST, setSLEEP_LIST] = useState<any>([{
    _id: "",
    user_id : user_id,
    sleep_title: "",
    sleep_night: "",
    sleep_morning: "",
    sleep_time: "",
    sleep_regdate : koreanDate,
    sleep_week: "",
    sleep_month: "",
    sleep_year: "",
    sleep_update: "",
  }]);

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchSleepList = async () => {
      try {
        const response = await axios.get (`${URL_SLEEP}/sleepList`, {
          params: {
            user_id : SLEEP_LIST.user_id,
            sleep_regdate : SLEEP_LIST.sleep_regdate,
          }
        });
        setSLEEP_LIST(response.data);
      }
      catch (error: any) {
        alert(`Error fetching sleep data: ${error.message}`);
        setSLEEP_LIST([]);
      }
    };
    fetchSleepList();
  }, [SLEEP_LIST.user_id, SLEEP_LIST.sleep_regdate]);

  // ---------------------------------------------------------------------------------------------->
  const viewDate = () => {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        selected={new Date(SLEEP_LIST.sleep_regdate)}
        popperPlacement="bottom"
        onChange={(date: any) => {
          setSLEEP_LIST ({
            ...SLEEP_LIST,
            sleep_regdate: date.toISOString().split("T")[0],
          });
        }}
      />
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const viewWeek = () => {
    return (
      <select
        className="form-select"
        aria-label="Default select example"
        onChange={(e) => {
          setSLEEP_LIST ({
            ...SLEEP_LIST,
            sleep_week: e.target.value,
          });
        }}
      >
        <option value="Mon">Mon</option>
        <option value="Tue">Tue</option>
        <option value="Wed">Wed</option>
        <option value="Thu">Thu</option>
        <option value="Fri">Fri</option>
        <option value="Sat">Sat</option>
        <option value="Sun">Sun</option>
      </select>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const viewMonth = () => {
    return (
      <select
        className="form-select"
        aria-label="Default select example"
        onChange={(e) => {
          setSLEEP_LIST ({
            ...SLEEP_LIST,
            sleep_month: e.target.value,
          });
        }}
      >
        <option value="Jan">Jan</option>
        <option value="Feb">Feb</option>
        <option value="Mar">Mar</option>
        <option value="Apr">Apr</option>
        <option value="May">May</option>
        <option value="Jun">Jun</option>
        <option value="Jul">Jul</option>
        <option value="Aug">Aug</option>
        <option value="Sep">Sep</option>
        <option value="Oct">Oct</option>
        <option value="Nov">Nov</option>
        <option value="Dec">Dec</option>
      </select>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const viewYear = () => {
    return (
      <select
        className="form-select"
        aria-label="Default select example"
        onChange={(e) => {
          setSLEEP_LIST ({
            ...SLEEP_LIST,
            sleep_year: e.target.value,
          });
        }}
      >
        <option value="2021">2021</option>
        <option value="2022">2022</option>
      </select>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const viewSelect = () => {
  };

  // ---------------------------------------------------------------------------------------------->
  const sleepListTable = () => {
    return (
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Night</th>
            <th>Morning</th>
            <th>Time</th>
            <th>regdate</th>
            <th>week</th>
          </tr>
        </thead>
        <tbody>
          {SLEEP_LIST.map((index : any) => (
            <tr key={index._id}>
              <td>
                <a onClick={() => {buttonSleepDetail(index._id);}}>
                  {index.sleep_title}
                </a>
              </td>
              <td>{index.sleep_night}</td>
              <td>{index.sleep_morning}</td>
              <td>{index.sleep_time}</td>
              <td>{index.sleep_regdate}</td>
              <td>{index.sleep_week}</td>
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
          <h1 className="mb-3 fw-5">
            <span className="ms-4">{viewDate()}</span>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-10">
          <form className="form-inline">
            {sleepListTable()}
            <br/>
            {buttonRefreshPage()}
            {buttonSleepInsert()}
          </form>
        </div>
      </div>
    </div>
  );
};
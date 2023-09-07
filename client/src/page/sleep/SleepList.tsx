// SleepList.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// 1. main ---------------------------------------------------------------------------------------->
export const SleepList = () => {

  // title
  const TITLE = "Sleep List";
  // url
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  // date
  const koreanDate = moment.tz('Asia/Seoul').format('YYYY-MM-DD').toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");
  // state
  const [sleep_day, setSleep_day] = useState(koreanDate);
  const [SLEEP_LIST, setSLEEP_LIST] = useState<any> ([{
    _id : "",
    user_id : user_id,
    sleep_title : "",
    sleep_night : "",
    sleep_morning : "",
    sleep_time : "",
    sleep_day : sleep_day,
    sleep_week : "",
    sleep_month : "",
    sleep_year : "",
    sleep_regdate : koreanDate
  }]);

  // 2. useEffect --------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchSleepList = async () => {
      try {
        const response = await axios.get (`${URL_SLEEP}/sleepList`, {
          params: {
            user_id : user_id,
            sleep_day : sleep_day,
          }
        });
        setSLEEP_LIST(response.data);
      }
      catch (error: any) {
        alert(`Error fetching sleep data: ${error.message}`);
      }
    };
    fetchSleepList();
  }, [user_id, sleep_day]);

  // 3. flow -------------------------------------------------------------------------------------->

  // 4. logic ------------------------------------------------------------------------------------->
  const viewSleepDay = () => {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        popperPlacement="bottom"
        selected={new Date(sleep_day)}
        onChange={(date: any) => {
          setSleep_day(moment(date).format("YYYY-MM-DD").toString());
        }}
      />
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableSleepList = () => {
    return (
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Night</th>
            <th>Morning</th>
            <th>Time</th>
            <th>day</th>
            <th>week</th>
            <th>month</th>
            <th>year</th>
            <th>regdate</th>
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
              <td>{index.sleep_day}</td>
              <td>{index.sleep_week}</td>
              <td>{index.sleep_month}</td>
              <td>{index.sleep_year}</td>
              <td>{index.sleep_regdate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
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
          <h1 className="mb-3 fw-5">
            <span className="ms-4">{viewSleepDay()}</span>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-10">
          <form className="form-inline">
            {tableSleepList()}
            <br/>
            {buttonRefreshPage()}
            {buttonSleepInsert()}
          </form>
        </div>
      </div>
    </div>
  );
};
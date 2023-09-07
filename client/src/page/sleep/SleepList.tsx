// SleepList.tsx
import React, {useState, useEffect, useContext} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import { addDays, format, isSameDay } from 'date-fns';
import { DayClickEventHandler, DateRange, DayPicker } from 'react-day-picker';
import DatePicker from "react-datepicker";
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
  const [view_mode, setView_mode] = useState<'DAY' | 'WEEK' | 'YEAR'>('DAY');
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
      let params:any = {
        user_id : user_id
      };
      switch (view_mode) {
        case 'DAY':
          params['sleep_day'] = sleep_day;
          break;
        case 'WEEK':
          params['sleep_week'] = sleep_day; // 서버에서 주의 시작과 끝 날짜를 계산
          break;
        case 'YEAR':
          params['sleep_year'] = sleep_day.split("-")[0]; // YYYY 형식으로 년만 전달
          break;
        default:
          break;
      }
      try {
        const response = await axios.get(`${URL_SLEEP}/sleepList`, { params });
        setSLEEP_LIST(response.data);
      }
      catch (error: any) {
        alert(`Error fetching sleep data: ${error.message}`);
      }
    };
    fetchSleepList();
  }, [user_id, sleep_day, view_mode]);

  // 3. flow -------------------------------------------------------------------------------------->
  const handleViewChange = (mode: 'DAY' | 'WEEK' | 'YEAR', date: any) => {
    setView_mode(mode);
    setSleep_day(moment(date).format("YYYY-MM-DD").toString());
  };

  // 4. logic ------------------------------------------------------------------------------------->


  const viewSleepWeek = () => {
    return (
      <div>
        <h5><b>주 단위로 보기</b></h5>
        <DatePicker
          dateFormat="ww"
          popperPlacement="bottom"
          selected={new Date(sleep_day)}
          onChange={(date: any) => {
            handleViewChange('WEEK', date);
          }}
        />
      </div>
    );
  };

  const viewSleepYear = () => {
    return (
      <div>
        <h5><b>년 단위로 보기</b></h5>
        <DatePicker
          dateFormat="yyyy"
          showYearPicker
          popperPlacement="bottom"
          selected={new Date(sleep_day)}
          onChange={(date: any) => {
            handleViewChange('YEAR', date);
          }}
        />
      </div>
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
        <div className="col-3 d-center ms-2">
          {/* {viewSleepDay()} */}
        </div>
        <div className="col-3 d-center ms-2">
          {viewSleepWeek()}
        </div>
        <div className="col-3 d-center ms-2">
          {viewSleepYear()}
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
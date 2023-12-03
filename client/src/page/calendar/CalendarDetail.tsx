// CalendarDetail.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import { DayClickEventHandler, DayPicker } from "react-day-picker";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import {useStorage} from "../../assets/ts/useStorage";
import { ko } from "date-fns/locale";
import {parseISO} from "date-fns";
import moment from "moment-timezone";
import axios from "axios";

// 1. main ---------------------------------------------------------------------------------------->
export const CalendarDetail = () => {

  // title
  const TITLE = "Calendar Detail";
  // url
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  // date
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");
  // state 1
  const {val:FOOD_LIST, setVal:setFOOD_LIST} = useStorage<any> (
    "foodListDay", []
  );
  const {val:SLEEP_LIST, setVal:setSLEEP_LIST} = useStorage<any> (
    "sleepListDay", []
  );
  const {val:WORK_LIST, setVal:setWORK_LIST} = useStorage<any> (
    "workListDay", []
  );
  // state 2
  const {val:calendarDay, setVal:setCalendarDay}=useStorage<Date | undefined> (
    "calendarDay", undefined
  );
  // state 3
  const {val:resVal, setVal:setResVal} = useStorage<string> (
    "resValDay", "0000-00-00"
  );
  const {val:resDur, setVal:setResDur} = useStorage<string> (
    "resDurDay", "0000-00-00 ~ 0000-00-00"
  );

  // 2-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (calendarDay) {
      const viewDate = moment(calendarDay).format("YYYY-MM-DD").toString();
      setResVal(`${viewDate}`);
      setResDur(`${viewDate} ~ ${viewDate}`);
    }
  }, [calendarDay]);

  // 2-2. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setCalendarDay(parseISO(location.state.calendar_date));
  }, [location.state.calendar_date]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    // 1) food
    const fetchFoodList = async () => {
      try {
        const response = await axios.get(`${URL_FOOD}/foodList`, {
          params: {
            user_id : user_id,
            food_dur : resVal,
          },
        });
        setFOOD_LIST(response.data);
      }
      catch (error:any) {
        alert(`Error fetching food data: ${error.message}`);
        setFOOD_LIST([]);
      }
    };
    fetchFoodList();
    // 2) sleep
    const fetchSleepList = async () => {
      try {
        const response = await axios.get(`${URL_SLEEP}/sleepList`, {
          params: {
            user_id : user_id,
            sleep_dur : resDur,
          },
        });
        setSLEEP_LIST(response.data);
      }
      catch (error:any) {
        alert(`Error fetching food data: ${error.message}`);
        setSLEEP_LIST([]);
      }
    };
    fetchSleepList();
    // 3) work
    const fetchWorkList = async () => {
      try {
        const response = await axios.get(`${URL_WORK}/workList`, {
          params: {
            user_id : user_id,
            work_dur : resDur,
          },
        });
        setWORK_LIST(response.data);
      }
      catch (error:any) {
        alert(`Error fetching food data: ${error.message}`);
        setWORK_LIST([]);
      }
    };
    fetchWorkList();
  }, [user_id, resDur]);

  // 4. logic ------------------------------------------------------------------------------------->
  const logicViewDate = () => {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        popperPlacement="bottom"
        selected={calendarDay}
        onChange={(date:any) => {
          setCalendarDay(date);
        }}
      />
    );
  };

  // 5-1. table ----------------------------------------------------------------------------------->
  const tableFoodList = () => {
    return (
      <table className="table table-bordered border-dark table-hover">
        <thead className="table-dark">
          <tr>
            <th>칼로리</th>
            <th>탄수화물</th>
            <th>단백질</th>
            <th>지방</th>
          </tr>
        </thead>
        <tbody>
          {FOOD_LIST.map((index:any) => (
            <tr key={index._id}>
              <td>{index.food_calories}</td>
              <td>{index.food_carb}</td>
              <td>{index.food_protein}</td>
              <td>{index.food_fat}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 5-2. table ----------------------------------------------------------------------------------->
  const tableSleepList = () => {
    return (
      <table className="table table-bordered border-dark table-hover">
        <thead className="table-dark">
          <tr>
            <th>기간</th>
            <th>취침</th>
            <th>기상</th>
            <th>수면</th>
          </tr>
        </thead>
        <tbody>
          {SLEEP_LIST.map((index:any) => (
            <tr key={index._id}>
              <td className="pointer" onClick={() => {
                navParam("/sleepDetail", {
                  state: {_id: index._id}
                }
              )}}>
                {resDur}
              </td>
              <td>{index.sleep_night}</td>
              <td>{index.sleep_morning}</td>
              <td>{index.sleep_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 5-3. table ----------------------------------------------------------------------------------->
  const tableWorkList = () => {
    return (
      <table className="table table-bordered border-dark table-hover">
        <thead className="table-dark">
          <tr>
            <th>Part</th>
            <th>Title</th>
            <th>Kg</th>
            <th>Set</th>
            <th>Count</th>
            <th>Rest</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {WORK_LIST.map((workItem : any) => {
            return workItem.workSection.map((workSection: any) => (
              <tr key={workSection._id}>
                <td className="pointer" onClick={() => {
                    navParam("/workDetail", {
                      state: {
                        _id : workItem._id,
                        workSection_id : workSection._id
                      },
                    });
                  }}>
                  {workSection.work_part_val}
                </td>
                <td>{workSection.work_title_val}</td>
                <td>{workSection.work_kg}</td>
                <td>{workSection.work_set}</td>
                <td>{workSection.work_count}</td>
                <td>{workSection.work_rest}</td>
                <td>{workItem.work_time}</td>
              </tr>
            ));
          })}
        </tbody>
      </table>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonCalendarToday = () => {
    return (
      <button type="button" className="btn btn-sm btn-success me-2" onClick={() => {
        setCalendarDay(koreanDate);
        localStorage.removeItem("calendarDay(DAY)");
      }}>
        Today
      </button>
    );
  };
  const buttonCalendarReset = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => {
        setCalendarDay(koreanDate);
        localStorage.removeItem("calendarDay(DAY)");
      }}>
        Reset
      </button>
    );
  };

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="container main">
      <div className="row d-center">
        <div className="col-12">
          <h1 className="mb-3 fw-7">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-5">
            <span>
              {logicViewDate()}
            </span>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">
          {tableFoodList()}
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">
          {tableSleepList()}
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">
          {tableWorkList()}
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">
          {buttonCalendarToday()}
          {buttonCalendarReset()}
        </div>
      </div>
    </div>
  );
};

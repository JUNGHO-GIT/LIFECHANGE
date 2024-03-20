// CalendarDetail.tsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import {parseISO} from "date-fns";
import moment from "moment-timezone";
import axios from "axios";
import {useStorage} from "../../assets/ts/useStorage";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";

// ------------------------------------------------------------------------------------------------>
export const CalendarDetail = () => {

  // 1. components -------------------------------------------------------------------------------->
  const TITLE = "Calendar Detail";
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  const URL_MONEY = process.env.REACT_APP_URL_MONEY;
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  const navParam = useNavigate();
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:FOOD_LIST, setVal:setFOOD_LIST} = useStorage<any> (
    "foodListDay", []
  );
  const {val:SLEEP_LIST, setVal:setSLEEP_LIST} = useStorage<any> (
    "sleepListDay", []
  );
  const {val:WORK_LIST, setVal:setWORK_LIST} = useStorage<any> (
    "workListDay", []
  );
  const {val:MONEY_LIST, setVal:setMONEY_LIST} = useStorage<any> (
    "moneyListDay", []
  );
  const {val:calendarDay, setVal:setCalendarDay} = useStorage<Date | undefined> (
    "calendarDay", undefined
  );
  const {val:resVal, setVal:setResVal} = useStorage<string> (
    "resValDay", "0000-00-00"
  );
  const {val:resDur, setVal:setResDur} = useStorage<string> (
    "resDurDay", "0000-00-00 ~ 0000-00-00"
  );

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (calendarDay) {
      const viewDate = moment(calendarDay).format("YYYY-MM-DD").toString();
      setResVal(`${viewDate}`);
      setResDur(`${viewDate} ~ ${viewDate}`);
    }
  }, [calendarDay]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
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
            user_id: user_id,
            food_dur: resDur,
            food_category: "all",
          },
        });
        setFOOD_LIST(response.data);
        log("FOOD_LIST : " + JSON.stringify(response.data));
      }
      catch (error:any) {
        alert(JSON.stringify(error));
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
        log("SLEEP_LIST : " + JSON.stringify(response.data));
      }
      catch (error:any) {
        alert(JSON.stringify(error));
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
        log("WORK_LIST : " + JSON.stringify(response.data));
      }
      catch (error:any) {
        alert(JSON.stringify(error));
        setWORK_LIST([]);
      }
    };
    fetchWorkList();

    // 4) money
    const fetchMoneyList = async () => {
      try {
        const response = await axios.get(`${URL_MONEY}/moneyList`, {
          params: {
            user_id : user_id,
            money_dur : resDur,
          },
        });
        setMONEY_LIST(response.data);
        log("MONEY_LIST : " + JSON.stringify(response.data));
      }
      catch (error:any) {
        alert(JSON.stringify(error));
        setMONEY_LIST([]);
      }
    };
    fetchMoneyList();

  }, [user_id, resDur]);

  // 4. view -------------------------------------------------------------------------------------->
  const viewCalendarDay = () => {
    const calcDate = (days: number) => {
      setCalendarDay((prevDate) => {
        const newDate = prevDate ? new Date(prevDate) : new Date();
        newDate.setDate(newDate.getDate() + days);
        return newDate;
      });
    };
    return (
      <div className="d-inline-flex">
        <div className="black mt-4 me-5 pointer" onClick={() => calcDate(-1)}>
          &#8592;
        </div>
        <DatePicker
          dateFormat="yyyy-MM-dd"
          popperPlacement="bottom"
          selected={calendarDay}
          onChange={(date: Date) => {
            setCalendarDay(date);
          }}
        />
        <div className="black mt-4 ms-5 pointer" onClick={() => calcDate(1)}>
          &#8594;
        </div>
      </div>
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
            <th>취침 시간</th>
            <th>기상 시간</th>
            <th>수면 시간</th>
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

  // 5-4. table ----------------------------------------------------------------------------------->
  const tableMoneyList = () => {
    return (
      <table className="table table-bordered border-dark table-hover">
        <thead className="table-dark">
          <tr>
            <th>Part</th>
            <th>Title</th>
            <th>Amount</th>
            <th>Content</th>
          </tr>
        </thead>
        <tbody>
          {MONEY_LIST.map((moneyItem: any) => {
            return moneyItem.moneySection.map((moneySection: any) => (
              <tr key={moneySection._id}>
                <td className="pointer" onClick={() => {
                    navParam("/moneyDetail", {
                      state: {
                        _id: moneyItem._id,
                        moneySection_id: moneySection._id
                      },
                    });
                  }}>
                  {moneySection.money_part_val}
                </td>
                <td>{moneySection.money_title_val}</td>
                <td>{moneySection.money_amount}</td>
                <td>{moneySection.money_content}</td>
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
    <div className="container-wrapper">
      <div className="row d-center">
        <div className="col-12">
          <h1 className="mb-3 fw-7">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-5">
            <span>
              {viewCalendarDay()}
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
          {tableMoneyList()}
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

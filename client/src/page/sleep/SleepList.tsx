// SleepList.tsx

import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {DayPicker} from "react-day-picker";
import {differenceInDays} from "date-fns";
import {ko} from "date-fns/locale";
import moment from "moment-timezone";
import axios from "axios";
import {useStorage} from "../../assets/ts/useStorage";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";

// ------------------------------------------------------------------------------------------------>
export const SleepList = () => {
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  const navParam = useNavigate();
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-2. useState -------------------------------------------------------------------------------->
  const [totalCount, setTotalCount] = useState<number>(0);
  const [type, setType] = useState("day");
  const [filter, setFilter] = useState({
    filterSub: "asc",
    page: 1,
    limit: 5,
  });

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:SLEEP_LIST, setVal:setSLEEP_LIST} = useStorage<any>(
    `sleepList(${type})`, []
  );
  const {val:SLEEP_PLAN, setVal:setSLEEP_PLAN} = useStorage<any>(
    `sleepPlan(${type})`, []
  );
  const {val:sleepResDur, setVal:setSleepResDur} = useStorage<string>(
    `sleepResDur(${type})`, "0000-00-00 ~ 0000-00-00"
  );
  const {val:sleepStartDay, setVal:setSleepStartDay} = useStorage<Date | undefined>(
    "sleepStartDay(${type})", undefined
  );
  const {val:sleepEndDay, setVal:setSleepEndDay} = useStorage<Date | undefined>(
    "sleepEndDay(${type})", undefined
  );
  const {val:sleepDay, setVal:setSleepDay} = useStorage<Date | undefined>(
    `sleepDay(${type})`, koreanDate
  );

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    // 1. list
    const fetchSleepList = async () => {
      try {
        const response = await axios.get (`${URL_SLEEP}/sleepList`, {
          params: {
            user_id: user_id,
            sleep_dur: sleepResDur,
            planYn: "N",
            filter: filter,
          },
        });
        setSLEEP_LIST(response.data.sleepList);
        setTotalCount(response.data.totalCount);
        log("SLEEP_LIST : " + JSON.stringify(response.data));
      }
      catch (error:any) {
        setSLEEP_LIST([]);
        alert(`Error fetching sleep data: ${error.message}`);
      }
    };
    fetchSleepList();

    // 2. plan
    const fetchSleepPlan = async () => {
      try {
        const response = await axios.get (`${URL_SLEEP}/sleepList`, {
          params: {
            user_id: user_id,
            sleep_dur: sleepResDur,
            planYn: "Y",
            filter: filter,
          },
        });
        setSLEEP_PLAN(response.data.sleepList);
        setTotalCount(response.data.totalCount);
        log("SLEEP_PLAN : " + JSON.stringify(response.data));
      }
      catch (error:any) {
        setSLEEP_LIST([]);
        alert(`Error fetching sleep data: ${error.message}`);
      }
    };
    fetchSleepPlan();

  }, [user_id, sleepResDur, type, filter]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  const formatVal = (value:any) => {
    return value < 10 ? `0${value}` : `${value}`;
  };

  const getFormattedDate = (date:any) => {
    return `${date.getFullYear()}-${formatVal(date.getMonth() + 1)}-${formatVal(date.getDate())}`;
  };

  const getStartAndEndDate = (startDay:any, endDay:any) => {
    return `${getFormattedDate(new Date(startDay))} ~ ${getFormattedDate(new Date(endDay))}`;
  };

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (sleepDay) {
      let result = "";
      const year = sleepDay?.getFullYear();
      const month = formatVal(sleepDay.getMonth() + 1);
      switch (type) {
        case "day":
          const date = formatVal(sleepDay.getDate());
          result = `${year}-${month}-${date} ~ ${year}-${month}-${date}`;
          break;
        case "week":
          result = getStartAndEndDate(sleepStartDay, sleepEndDay);
          break;
        case "select":
          result = getStartAndEndDate(sleepStartDay, sleepEndDay);
          break;
        case "month":
          result = `${year}-${month}-01 ~ ${year}-${month}-31`;
          break;
        case "year":
          result = `${year}-01-01 ~ ${year}-12-31`;
          break;
      }
      setSleepResDur(result);
    }
  }, [type, sleepStartDay, sleepEndDay, sleepDay]);

  // 4-1. logic ----------------------------------------------------------------------------------->
  const viewSleepList = () => {

    const formatVal = (value:number):string => {
      return value < 10 ? `0${value}` : `${value}`;
    };
    switch (type) {
      case "day":
        const handleDay = (day:any) => {
          const newDay = new Date(day);
          setSleepDay(newDay);
        };
        return (
          <DayPicker
            showOutsideDays={true}
            locale={ko}
            weekStartsOn={1}
            modifiersClassNames={{
              selected: "selected",
              disabled: "disabled",
              outside: "outside",
              inside: "inside",
            }}
            mode="single"
            selected={sleepDay}
            month={sleepDay}
            onDayClick={handleDay}
            onMonthChange={(month) => setSleepDay(month)}
          />
        );
      case "week":
        const handleWeek = (day:any) => {
          const selectedDay = new Date(day);
          const startOfWeek = new Date(selectedDay.setDate(selectedDay.getDate() - selectedDay.getDay() + 1));
          const endOfWeek = new Date(selectedDay.setDate(selectedDay.getDate() + (7 - selectedDay.getDay())));
          setSleepStartDay(startOfWeek);
          setSleepEndDay(endOfWeek);
        };
        return (
          <DayPicker
          showOutsideDays={true}
          locale={ko}
          weekStartsOn={1}
          modifiersClassNames={{
            selected: "selected",
            disabled: "disabled",
            outside: "outside",
            inside: "inside",
          }}
          mode="range"
          selected={sleepStartDay && sleepEndDay && {from: sleepStartDay, to: sleepEndDay}}
          month={sleepStartDay}
          onDayClick={handleWeek}
          onMonthChange={(month) => { setSleepStartDay(month); setSleepEndDay(undefined); }} />
        );
      case "month":
        const handleMonth = (month:any) => {
          setSleepResDur(`${month.getFullYear()}-${formatVal(month.getMonth() + 1)}-01 ~ ${month.getFullYear()}-${formatVal(month.getMonth() + 1)}-31`);
        };
        return (
          <DayPicker
            showOutsideDays={true}
            locale={ko}
            weekStartsOn={1}
            modifiersClassNames={{
              selected: "selected",
              disabled: "disabled",
              outside: "outside",
              inside: "inside",
            }}
            mode="default"
            month={new Date(sleepResDur.split(" ~ ")[0])}
            onMonthChange={handleMonth}
          />
        );
      case "year":
        const handleYear = (year:any) => {
          const yearDate = new Date(year.getFullYear(), 0, 1);
          const monthDate = new Date(year.getFullYear(), year.getMonth(), 1);
          const nextMonth = differenceInDays(new Date(year.getFullYear() + 1, 0, 1), monthDate) / 30;
          const prevMonth = differenceInDays(monthDate, yearDate) / 30;
          if (nextMonth > prevMonth) {
            setSleepResDur(`${year.getFullYear() + 1}-01-01 ~ ${year.getFullYear() + 1}-12-31`);
          }
          else {
            setSleepResDur(`${year.getFullYear()}-01-01 ~ ${year.getFullYear()}-12-31`);
          }
        };
        return (
          <DayPicker
            showOutsideDays={true}
            locale={ko}
            weekStartsOn={1}
            modifiersClassNames={{
              selected: "selected",
              disabled: "disabled",
              outside: "outside",
              inside: "inside",
            }}
            mode="default"
            month={new Date(sleepResDur.split(" ~ ")[0])}
            onMonthChange={handleYear}
          />
        );
      case "select":
        const handleSelect = (day:any) => {
          const selectedDay = new Date(day);
          if (sleepStartDay && sleepEndDay) {
            if (selectedDay < sleepStartDay) {
              setSleepStartDay(selectedDay);
            }
            else if (selectedDay > sleepEndDay) {
              setSleepEndDay(selectedDay);
            }
            else {
              setSleepStartDay(selectedDay);
              setSleepEndDay(undefined);
            }
          }
          else if (sleepStartDay) {
            if (selectedDay < sleepStartDay) {
              setSleepEndDay(sleepStartDay);
              setSleepStartDay(selectedDay);
            }
            else if (selectedDay > sleepStartDay) {
              setSleepEndDay(selectedDay);
            }
            else {
              setSleepStartDay(undefined);
              setSleepEndDay(undefined);
            }
          }
          else {
            setSleepStartDay(selectedDay);
          }
        }
        return (
          <DayPicker
            showOutsideDays={true}
            locale={ko}
            weekStartsOn={1}
            modifiersClassNames={{
              selected: "selected",
              disabled: "disabled",
              outside: "outside",
              inside: "inside",
            }}
            mode="range"
            selected={sleepStartDay && sleepEndDay && {from: sleepStartDay, to: sleepEndDay}}
            month={sleepStartDay}
            onDayClick={handleSelect}
            onMonthChange={(month) => {
              setSleepStartDay(month);
              setSleepEndDay(undefined);
            }}
          />
        );
      default:
        return null;
    };
  };

  // 5-1. table ----------------------------------------------------------------------------------->
  const filterBox = () => {
    const pageNumber = () => {
      const pages = [];
      const totalPages = Math.ceil(totalCount / filter.limit);
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            className={`btn btn-sm ${filter.page === i ? "btn-secondary" : "btn-primary"} me-2`}
            onClick={() => setFilter({ ...filter, page: i })}
          >
            {i}
          </button>
        );
      }
      return pages;
    };
    const prevNumber = () => {
      return (
        <button
          className="btn btn-sm btn-primary ms-10 me-10"
          onClick={() => setFilter({ ...filter, page: Math.max(1, filter.page - 1) })}
        >
          이전
        </button>
      );
    }
    const nextNumber = () => {
      return (
        <button
          className="btn btn-sm btn-primary ms-10 me-10"
          onClick={() => setFilter({ ...filter, page: Math.min(Math.ceil(totalCount / filter.limit), filter.page + 1) })}
        >
          다음
        </button>
      );
    }
    return (
      <div className="d-inline-flex">
        {prevNumber()}
        {pageNumber()}
        {nextNumber()}
      </div>
    );
  };

  // 5-1. table ----------------------------------------------------------------------------------->
  const tableSleepList = () => {

    const successOrNot = (plan: string, real: string) => {
      const planDate = new Date(`1970-01-01T${plan}:00.000Z`);
      const realDate = new Date(`1970-01-01T${real}:00.000Z`);

      // 실제 시간이 계획된 시간보다 이전인 경우 다음 날로 처리
      if (realDate < planDate) {
        realDate.setHours(realDate.getHours() + 24);
      }
      const diff = Math.abs(realDate.getTime() - planDate.getTime());
      const diffMinutes = Math.floor(diff / 60000);

      let textColor = "text-muted";
      if (0 <= diffMinutes && diffMinutes <= 10) {
        textColor = "text-primary";
      }
      if (10 < diffMinutes && diffMinutes <= 20) {
        textColor = "text-success";
      }
      if (20 < diffMinutes && diffMinutes <= 30) {
        textColor = "text-warning";
      }
      if (30 < diffMinutes) {
        textColor = "text-danger";
      }
      return textColor;
    };

    return (
      <table className="table bg-white table-hover">
        <thead className="table-primary">
          <tr>
            <th>날짜</th>
            <th>분류</th>
            <th>목표</th>
            <th>실제</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {SLEEP_LIST.map((item:any) => (
            <React.Fragment key={item._id}>
              {SLEEP_PLAN.length > 0
                ? (
                  SLEEP_PLAN.map((plan:any) => (
                    <React.Fragment key={plan._id}>
                      <tr>
                        <td rowSpan={4} className="pointer" onClick={() => {
                          navParam("/sleepDetail", {
                            state: {_id: item._id}
                          });
                        }}>
                          {item.sleep_day}
                        </td>
                        <td>수면시간</td>
                        <td>{plan.sleep_time || "x"}</td>
                        <td>{item.sleep_time || "x"}</td>
                        <td>
                          <span className={successOrNot(plan.sleep_time, item.sleep_time)}>
                            ●
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>취침시간</td>
                        <td>{plan.sleep_night || "x"}</td>
                        <td>{item.sleep_night || "x"}</td>
                        <td>
                          <span className={successOrNot(plan.sleep_night, item.sleep_night)}>
                            ●
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>기상시간</td>
                        <td>{plan.sleep_morning || "x"}</td>
                        <td>{item.sleep_morning || "x"}</td>
                        <td>
                          <span className={successOrNot(plan.sleep_morning, item.sleep_morning)}>
                            ●
                          </span>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))
                )
                : (
                  <React.Fragment>
                    <tr>
                      <td rowSpan={3} className="pointer" onClick={() => {
                        navParam("/sleepDetail", {
                          state: {_id: item._id}
                        });
                      }}>
                        {item.sleep_day}
                      </td>
                      <td>수면시간</td>
                      <td>x</td>
                      <td>{item.sleep_time || "x"}</td>
                      <td>●</td>
                    </tr>
                    <tr>
                      <td>취침시간</td>
                      <td>x</td>
                      <td>{item.sleep_night || "x"}</td>
                      <td>●</td>
                    </tr>
                    <tr>
                      <td>기상시간</td>
                      <td>x</td>
                      <td>{item.sleep_morning || "x"}</td>
                      <td>●</td>
                    </tr>
                  </React.Fragment>
                )
              }
            </React.Fragment>
          ))}
        </tbody>
      </table>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonSleepToday = () => {
    return (
      <button type="button" className="btn btn-sm btn-success me-2" onClick={() => {
        setSleepDay(koreanDate);
        localStorage.removeItem(`sleepList(${type})`);
        localStorage.removeItem(`sleepStartDay(${type})`);
        localStorage.removeItem(`sleepEndDay(${type})`);
        localStorage.removeItem(`sleepDay(${type})`);
      }}>
        Today
      </button>
    );
  };
  const buttonSleepReset = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => {
        setSleepDay(koreanDate);
        localStorage.removeItem(`sleepList(${type})`);
        localStorage.removeItem(`sleepStartDay(${type})`);
        localStorage.removeItem(`sleepEndDay(${type})`);
        localStorage.removeItem(`sleepDay(${type})`);
      }}>
        Reset
      </button>
    );
  };

  // 6-2. select ---------------------------------------------------------------------------------->
  const selectSleepType = () => {
    return (
      <div className="mb-3">
        <select className="form-select" id="typePre" onChange={(e:any) => {
          if (e.target.value === "day") {
            setType("day");
          }
          else if (e.target.value === "week") {
            setType("week");
          }
          else if (e.target.value === "month") {
            setType("month");
          }
          else if (e.target.value === "year") {
            setType("year");
          }
          else if (e.target.value === "select") {
            setType("select");
          }
        }}>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
          <option value="select">Select</option>
        </select>
      </div>
    );
  };

  // 6-4. select ---------------------------------------------------------------------------------->
  const selectFilterSub = () => {
    return (
      <div className="mb-3">
        <select className="form-select" id="sleepListSortOrder" onChange={(e) => {
          setFilter({...filter, filterSub: e.target.value});
        }}>
          <option value="asc" selected>오름차순</option>
          <option value="desc">내림차순</option>
        </select>
      </div>
    );
  };

  const selectFilterPage = () => {
    return (
      <div className="mb-3">
        <select className="form-select" id="sleepListLimit" onChange={(e) => {
          setFilter({...filter, limit: Number(e.target.value)});
        }}>
          <option value="5" selected>5</option>
          <option value="10">10</option>
        </select>
      </div>
    );
  };

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row d-center mt-3">
          <div className="col-4">
            {viewSleepList()}
          </div>
          <div className="col-8">
            <div className="row d-center mb-20">
              <div className="col-3">
                {selectSleepType()}
              </div>
              <div className="col-3">
                {selectFilterSub()}
              </div>
              <div className="col-3">
                {selectFilterPage()}
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                {tableSleepList()}
                {filterBox()}
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-20 mb-20">
          <div className="col-12 d-center">
            {buttonSleepToday()}
            {buttonSleepReset()}
          </div>
        </div>
      </div>
    </div>
  );
};

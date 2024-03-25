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

import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {BarChart, Bar} from "recharts";
import {LineChart, Line} from "recharts";

// ------------------------------------------------------------------------------------------------>
export const SleepList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  const navParam = useNavigate();
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [totalCount, setTotalCount] = useState<number>(0);
  const [type, setType] = useState("day");
  const [filter, setFilter] = useState({
    filterSub: "asc",
    page: 1,
    limit: 5,
  });

  // 2-2. useStorage ------------------------------------------------------------------------------>
  const {val:SLEEP_LIST, setVal:setSLEEP_LIST} = useStorage<any>(
    `sleepList(${type})`, [{
      _id: "",
      sleep_dur: "0000-00-00 ~ 0000-00-00",
      sleep_day: "0000-00-00",
      sleep_night_real: "00:00",
      sleep_time_real: "00:00",
      sleep_morning_real: "00:00",
      sleep_night_plan: "00:00",
      sleep_time_plan: "00:00",
      sleep_morning_plan: "00:00",
    }]
  );
  const {val:sleepResDur, setVal:setSleepResDur} = useStorage<string>(
    `sleepResDur(${type})`, "0000-00-00 ~ 0000-00-00"
  );
  const {val:sleepStartDay, setVal:setSleepStartDay} = useStorage<Date | undefined>(
    `sleepStartDay(${type})`, undefined
  );
  const {val:sleepEndDay, setVal:setSleepEndDay} = useStorage<Date | undefined>(
    `sleepEndDay(${type})`, undefined
  );
  const {val:sleepDay, setVal:setSleepDay} = useStorage<Date | undefined>(
    `sleepDay(${type})`, koreanDate
  );

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    // 1. list
    const responseList = await axios.get(`${URL_SLEEP}/sleepList`, {
      params: {
        user_id: user_id,
        sleep_dur: sleepResDur,
        planYn: "N",
        filter: filter,
      },
    });

    // 2. plan
    const responsePlan = await axios.get(`${URL_SLEEP}/sleepList`, {
      params: {
        user_id: user_id,
        sleep_dur: sleepResDur,
        planYn: "Y",
        filter: filter,
      },
    });

    // 3. merged
    let mergedData = [];
    if (responseList.data.sleepList.length > 0 || responsePlan.data.sleepList.length > 0) {
      const allSleepDays
        = [...responseList.data.sleepList, ...responsePlan.data.sleepList]
        .map(item => item.sleep_day)
        .filter((value, index, self) => self.indexOf(value) === index);

      mergedData = allSleepDays.map(sleep_day => {
        const listItem
          = responseList.data.sleepList.find((item:any) => item.sleep_day === sleep_day) || {};
        const planItem
          = responsePlan.data.sleepList.find((item:any) => item.sleep_day === sleep_day) || {};
        return {
          _id: listItem._id || "",
          sleep_dur: sleepResDur,
          sleep_day: sleep_day,
          sleep_night_real: listItem.sleep_night || "00:00",
          sleep_time_real: listItem.sleep_time || "00:00",
          sleep_morning_real: listItem.sleep_morning || "00:00",
          sleep_night_plan: planItem.sleep_night || "00:00",
          sleep_time_plan: planItem.sleep_time || "00:00",
          sleep_morning_plan: planItem.sleep_morning || "00:00",
        };
      });
    }
    else {
      mergedData = [{
        _id: "",
        sleep_dur: "0000-00-00 ~ 0000-00-00",
        sleep_day: "0000-00-00",
        sleep_night_real: "00:00",
        sleep_time_real: "00:00",
        sleep_morning_real: "00:00",
        sleep_night_plan: "00:00",
        sleep_time_plan: "00:00",
        sleep_morning_plan: "00:00",
      }];
    }

    setTotalCount(responseList.data.totalCount);
    setSLEEP_LIST(mergedData);
    log("SLEEP_LIST : " + JSON.stringify(mergedData));

  })()}, [user_id, sleepResDur, type, filter]);

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

  // 3-1. logic ----------------------------------------------------------------------------------->
  const formatVal = (value:any) => {
    return value < 10 ? `0${value}` : `${value}`;
  };
  const getFormattedDate = (date:any) => {
    return `${date.getFullYear()}-${formatVal(date.getMonth() + 1)}-${formatVal(date.getDate())}`;
  };
  const getStartAndEndDate = (startDay:any, endDay:any) => {
    return `${getFormattedDate(new Date(startDay))} ~ ${getFormattedDate(new Date(endDay))}`;
  };
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

  // 3-2. logic ----------------------------------------------------------------------------------->
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

  // 4-1. view ----------------------------------------------------------------------------------->
  const viewSleepList = () => {
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
            onMonthChange={(month) => {
              setSleepStartDay(month);
              setSleepEndDay(undefined);
            }}
          />
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
  const tableSleepList = () => {
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
            <React.Fragment key={item.sleep_day}>
              <tr>
                <td rowSpan={3} className="pointer" onClick={() => {
                  navParam("/sleepDetail", {
                    state: {_id: item._id}
                  });
                }}>
                  {item.sleep_day}
                </td>
                <td>취침</td>
                <td>{item.sleep_night_plan}</td>
                <td>{item.sleep_night_real}</td>
                <td>
                  <span className={successOrNot(item.sleep_night_plan, item.sleep_night_real)}>
                    ●
                  </span>
                </td>
              </tr>
              <tr>
                <td>수면</td>
                <td>{item.sleep_time_plan}</td>
                <td>{item.sleep_time_real}</td>
                <td>
                  <span className={successOrNot(item.sleep_time_plan, item.sleep_time_real)}>
                    ●
                  </span>
                </td>
              </tr>
              <tr>
                <td>기상</td>
                <td>{item.sleep_morning_plan}</td>
                <td>{item.sleep_morning_real}</td>
                <td>
                  <span className={successOrNot(item.sleep_morning_plan, item.sleep_morning_real)}>
                    ●
                  </span>
                </td>
              </tr>
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

  // 6-3. select ---------------------------------------------------------------------------------->
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
            <div className="row d-center mb-20">
              <div className="col-12">
                {viewSleepList()}
              </div>
            </div>
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

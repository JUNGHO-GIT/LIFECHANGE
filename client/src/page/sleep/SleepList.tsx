// SleepList.tsx

import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {DayPicker, MonthChangeEventHandler, DayClickEventHandler} from "react-day-picker";
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
  const [type, setType] = useState({
    typePre: "day",
    typeSub: "list",
  });
  const [filter, setFilter] = useState({
    filterPre: "number",
    filterSub: "asc",
    page: 1,
    limit: 5,
  });

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:SLEEP_LIST, setVal:setSLEEP_LIST} = useStorage<any>(
    `sleepList(${type.typePre})`, []
  );
  const {val:SLEEP_AVERAGE, setVal:setSLEEP_AVERAGE} = useStorage<any>(
    `sleepAvg(${type.typePre})`, []
  );
  const {val:sleepResDur, setVal:setSleepResDur} = useStorage<string>(
    `sleepResDur(${type.typePre})`, "0000-00-00 ~ 0000-00-00"
  );
  const {val:sleepStartDay, setVal:setSleepStartDay} = useStorage<Date | undefined>(
    "sleepStartDay(${type.typePre})", undefined
  );
  const {val:sleepEndDay, setVal:setSleepEndDay} = useStorage<Date | undefined>(
    "sleepEndDay(${type.typePre})", undefined
  );
  const {val:sleepDay, setVal:setSleepDay} = useStorage<Date | undefined>(
    `sleepDay(${type.typePre})`, koreanDate
  );

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    // 1. list
    const fetchSleepList = async () => {
      try {
        const response = await axios.get (`${URL_SLEEP}/sleepList`, {
          params: {
            user_id : user_id,
            sleep_dur : sleepResDur,
            type : type,
            filter : filter,
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

    // 2. average
    const fetchSleepAvg = async () => {
      try {
        const response = await axios.get (`${URL_SLEEP}/sleepAvg`, {
          params: {
            user_id : user_id,
            sleep_dur : sleepResDur,
            filter : filter,
          },
        });
        setSLEEP_AVERAGE(response.data);
        log("SLEEP_AVERAGE : " + JSON.stringify(response.data));
      }
      catch (error:any) {
        setSLEEP_AVERAGE([]);
        alert(`Error fetching sleep data: ${error.message}`);
      }
    };
    fetchSleepAvg();

  }, [user_id, sleepResDur, type, filter]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    const formatVal = (value:number):string => {
      return value < 10 ? `0${value}` : `${value}`;
    };

    {/** day **/}
    if (sleepDay && type.typePre === "day") {
      const year = sleepDay.getFullYear();
      const month = formatVal(sleepDay.getMonth() + 1);
      const date = formatVal(sleepDay.getDate());
      setSleepResDur(`${year}-${month}-${date} ~ ${year}-${month}-${date}`);
    }

    {/** week **/}
    if (sleepDay && sleepStartDay && sleepEndDay && type.typePre === "week") {
      const fromDate = new Date(sleepStartDay);
      const toDate = new Date(sleepEndDay);
      setSleepResDur (
        `${fromDate.getFullYear()}-${formatVal(fromDate.getMonth() + 1)}-${formatVal(fromDate.getDate())} ~ ${toDate.getFullYear()}-${formatVal(toDate.getMonth() + 1)}-${formatVal(toDate.getDate())}`
      );
    }

    {/** month **/}
    if (sleepDay && type.typePre === "month") {
      setSleepResDur (
        `${sleepDay.getFullYear()}-${formatVal(sleepDay.getMonth() + 1)}-01 ~ ${sleepDay.getFullYear()}-${formatVal(sleepDay.getMonth() + 1)}-31`
      );
    }

    {/** year **/}
    if (sleepDay && type.typePre === "year") {
      setSleepResDur(`${sleepDay.getFullYear()}-01-01 ~ ${sleepDay.getFullYear()}-12-31`);
    }

    {/** select **/}
    if (sleepDay && sleepStartDay && sleepEndDay && type.typePre === "select") {
      const fromDate = new Date(sleepStartDay);
      const toDate = new Date(sleepEndDay);
      setSleepResDur (
        `${fromDate.getFullYear()}-${formatVal(fromDate.getMonth() + 1)}-${formatVal(fromDate.getDate())} ~ ${toDate.getFullYear()}-${formatVal(toDate.getMonth() + 1)}-${formatVal(toDate.getDate())}`
      );
    }

  }, [type, sleepStartDay, sleepEndDay, sleepDay]);

  // 4-1. logic ----------------------------------------------------------------------------------->
  const viewSleepList = () => {

    const formatVal = (value:number):string => {
      return value < 10 ? `0${value}` : `${value}`;
    };

    {/** day **/}
    const handleDay = (day:any) => {
      const newDay = new Date(day);
      setSleepDay(newDay);
    };

    {/** week **/}
    const handleWeek = (day:any) => {
      const selectedDay = new Date(day);
      const startOfWeek = new Date(selectedDay.setDate(selectedDay.getDate() - selectedDay.getDay() + 1));
      const endOfWeek = new Date(selectedDay.setDate(selectedDay.getDate() + (7 - selectedDay.getDay())));
      setSleepStartDay(startOfWeek);
      setSleepEndDay(endOfWeek);
    };

    {/** month **/}
    const handleMonth = (month:any) => {
      setSleepResDur(`${month.getFullYear()}-${formatVal(month.getMonth() + 1)}-01 ~ ${month.getFullYear()}-${formatVal(month.getMonth() + 1)}-31`);
    };

    {/** year **/}
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

    {/** select **/}
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

    switch (type.typePre) {
      case "day":
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
          onMonthChange={(month) => setSleepDay(month)} />
        );
      case "week":
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
          onMonthChange={handleMonth} />
        );
      case "year":
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
          onMonthChange={handleYear} />
        );
      case "select":
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
          onMonthChange={(month) => { setSleepStartDay(month); setSleepEndDay(undefined); }} />
        );
      default:
        return null;
    }
  }

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
        <select className="form-select" id="sleepListSortField" onChange={(e) => {
          setFilter({...filter, filterPre: e.target.value});
        }}>
          <option value="number" selected>번호순</option>
          <option value="day">날짜순</option>
        </select>
        <select className="form-select" id="sleepListSortOrder" onChange={(e) => {
          setFilter({...filter, filterSub: e.target.value});
        }}>
          <option value="ASC" selected>오름차순</option>
          <option value="DESC">내림차순</option>
        </select>
        <select className="form-select" id="sleepListLimit" onChange={(e) => {
          setFilter({...filter, limit: Number(e.target.value)});
        }}>
          <option value="5" selected>5개씩</option>
          <option value="10">10개씩</option>
          <option value="20">20개씩</option>
        </select>
        {prevNumber()}
        {pageNumber()}
        {nextNumber()}
      </div>
    );
  };

  // 5-1. table ----------------------------------------------------------------------------------->
  const tableSleepList = () => {
    return (
      <table className="table bg-white table-hover">
        <thead className="table-primary">
          <tr>
            <th>번호</th>
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
                {index.sleep_number}
              </td>
              <td>{index.sleep_day}</td>
              <td>{index.sleep_night}</td>
              <td>{index.sleep_morning}</td>
              <td>{index.sleep_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 5-2. table ----------------------------------------------------------------------------------->
  const tableSleepAvg = () => {
    return (
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>기간</th>
            <th>취침 평균</th>
            <th>기상 평균</th>
            <th>수면 평균</th>
          </tr>
        </thead>
        <tbody>
          {SLEEP_AVERAGE.map((index:any) => (
            <tr key={index._id}>
              <td>{sleepResDur}</td>
              <td>{index.avgSleepNight}</td>
              <td>{index.avgSleepMorning}</td>
              <td>{index.avgSleepTime}</td>
            </tr>
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
        localStorage.removeItem(`sleepList(${type.typePre})`);
        localStorage.removeItem(`sleepAvg(${type.typePre})`);
        localStorage.removeItem(`sleepDay(${type.typePre})`);
      }}>
        Today
      </button>
    );
  };
  const buttonSleepReset = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => {
        setSleepDay(koreanDate);
        localStorage.removeItem(`sleepList(${type.typePre})`);
        localStorage.removeItem(`sleepAvg(${type.typePre})`);
        localStorage.removeItem(`sleepStartDay(${type.typePre})`);
        localStorage.removeItem(`sleepEndDay(${type.typePre})`);
        localStorage.removeItem(`sleepDay(${type.typePre})`);
      }}>
        Reset
      </button>
    );
  };

  // 6-2. button ---------------------------------------------------------------------------------->
  const selectSleepList = () => {
    return (
      <div className="mb-3">
        <select className="form-select" id="typePre" onChange={(e:any) => {
          if (e.target.value === "day") {
            setType({...type, typePre: "day"});
          }
          else if (e.target.value === "week") {
            setType({...type, typePre: "week"});
          }
          else if (e.target.value === "month") {
            setType({...type, typePre: "month"});
          }
          else if (e.target.value === "year") {
            setType({...type, typePre: "year"});
          }
          else if (e.target.value === "select") {
            setType({...type, typePre: "select"});
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
  const selectType = () => {
    return (
      <div className="mb-3">
        <select className="form-select" id="typeSub" onChange={(e:any) => {
          if (e.target.value === "list") {
            setType({...type, typeSub: "list"});
          }
          else if (e.target.value === "avg") {
            setType({...type, typeSub: "avg"});
          }
        }}>
          <option value="list">List</option>
          <option value="avg">Avg</option>
        </select>
      </div>
    );
  };

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row d-center mt-5">
          <div className="col-12">
            <h1 className="mb-3 fw-7">{type.typePre}</h1>
          </div>
        </div>
        <div className="row d-center mt-3">
          <div className="col-3">
            {selectSleepList()}
          </div>
          <div className="col-3">
            {selectType()}
          </div>
        </div>
        <div className="row d-center mt-3">
          <div className="col-12 d-center">
            {viewSleepList()}
          </div>
        </div>
        <div className="row d-center mt-3">
          <div className="col-12">
            {type.typeSub === "list" ? tableSleepList() : tableSleepAvg()}
          </div>
          <div className="col-12">
            {filterBox()}
          </div>
        </div>
        <div className="row mb-20">
          <div className="col-12 d-center">
            {buttonSleepToday()}
            {buttonSleepReset()}
          </div>
        </div>
      </div>
    </div>
  );
};

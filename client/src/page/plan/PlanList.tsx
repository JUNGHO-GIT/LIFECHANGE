// PlanList.tsx

import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {DayClickEventHandler, DayPicker} from "react-day-picker";
import {useStorage} from "../../assets/ts/useStorage";
import {ko} from "date-fns/locale";
import {differenceInDays} from "date-fns";
import moment from "moment-timezone";
import axios from "axios";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";
import {planPartArray, planTitleArray} from "./PlanArray";

// ------------------------------------------------------------------------------------------------>
export const PlanList = () => {
  const URL_PLAN = process.env.REACT_APP_URL_PLAN;
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  const navParam = useNavigate();
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [planNumber, setPlanNumber] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [type, setType] = useState({
    typePre: "day",
    typeSub: "list",
  });
  const [filter, setFilter] = useState({
    filterPre: "day",
    filterSub: "asc",
    page: 1,
    limit: 5,
  });

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:PLAN_LIST, setVal:setPLAN_LIST} = useStorage<any>(
    `planList(${type.typePre})`, []
  );
  const {val:planResDur, setVal:setPlanResDur} = useStorage<string>(
    `planResDur(${type.typePre})`, "0000-00-00 ~ 0000-00-00"
  );
  const {val:planStartDay, setVal:setPlanStartDay} = useStorage<Date | undefined>(
    "planStartDay(${type.typePre})", undefined
  );
  const {val:planEndDay, setVal:setPlanEndDay} = useStorage<Date | undefined>(
    "planEndDay(${type.typePre})", undefined
  );
  const {val:planDay, setVal:setPlanDay} = useStorage<Date | undefined>(
    `planDay(${type.typePre})`, koreanDate
  );
  const {val:planPart, setVal:setPlanPart} = useStorage<string>(
    "planPart(DAY)", "전체"
  );
  const {val:planTitle, setVal:setPlanTitle} = useStorage<string>(
    "planTitle(DAY)", "전체"
  );

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    // 1. list
    const fetchPlanList = async () => {
      try {
        const response = await axios.get(`${URL_PLAN}/planList`, {
          params: {
            user_id : user_id,
            plan_dur : planResDur,
            filter : filter,
            plan_part_val : planPart,
            plan_title_val : planTitle,
          },
        });
        setPLAN_LIST(response.data.planList);
        setTotalCount(response.data.totalCount);
        log("PLAN_LIST " + JSON.stringify(response.data));
      }
      catch (error:any) {
        setPLAN_LIST([]);
        alert(`Error fetching plan data: ${error.message}`);
      }
    };
    fetchPlanList();
  }, [user_id, planResDur, planPart, planTitle, type, filter]);

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
    if (planDay) {
      let result = "";
      const year = planDay?.getFullYear();
      const month = formatVal(planDay.getMonth() + 1);
      switch (type.typePre) {
        case "day":
          const date = formatVal(planDay.getDate());
          result = `${year}-${month}-${date} ~ ${year}-${month}-${date}`;
          break;
        case "week":
          result = getStartAndEndDate(planStartDay, planEndDay);
          break;
        case "select":
          result = getStartAndEndDate(planStartDay, planEndDay);
          break;
        case "month":
          result = `${year}-${month}-01 ~ ${year}-${month}-31`;
          break;
        case "year":
          result = `${year}-01-01 ~ ${year}-12-31`;
          break;
      }
      setPlanResDur(result);
    }
  }, [type, planStartDay, planEndDay, planDay]);

  // 4-1. logic ----------------------------------------------------------------------------------->
  const viewPlanList = () => {

    const formatVal = (value:number):string => {
      return value < 10 ? `0${value}` : `${value}`;
    };
    switch (type.typePre) {
      case "day":
        const handleDay = (day:any) => {
          const newDay = new Date(day);
          setPlanDay(newDay);
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
          selected={planDay}
          month={planDay}
          onDayClick={handleDay}
          onMonthChange={(month) => setPlanDay(month)} />
        );
      case "week":
        const handleWeek = (day:any) => {
          const selectedDay = new Date(day);
          const startOfWeek = new Date(selectedDay.setDate(selectedDay.getDate() - selectedDay.getDay() + 1));
          const endOfWeek = new Date(selectedDay.setDate(selectedDay.getDate() + (7 - selectedDay.getDay())));
          setPlanStartDay(startOfWeek);
          setPlanEndDay(endOfWeek);
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
          selected={planStartDay && planEndDay && {from: planStartDay, to: planEndDay}}
          month={planStartDay}
          onDayClick={handleWeek}
          onMonthChange={(month) => { setPlanStartDay(month); setPlanEndDay(undefined); }} />
        );
      case "month":
        const handleMonth = (month:any) => {
          setPlanResDur(`${month.getFullYear()}-${formatVal(month.getMonth() + 1)}-01 ~ ${month.getFullYear()}-${formatVal(month.getMonth() + 1)}-31`);
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
          month={new Date(planResDur.split(" ~ ")[0])}
          onMonthChange={handleMonth} />
        );
      case "year":
        const handleYear = (year:any) => {
          const yearDate = new Date(year.getFullYear(), 0, 1);
          const monthDate = new Date(year.getFullYear(), year.getMonth(), 1);
          const nextMonth = differenceInDays(new Date(year.getFullYear() + 1, 0, 1), monthDate) / 30;
          const prevMonth = differenceInDays(monthDate, yearDate) / 30;
          if (nextMonth > prevMonth) {
            setPlanResDur(`${year.getFullYear() + 1}-01-01 ~ ${year.getFullYear() + 1}-12-31`);
          }
          else {
            setPlanResDur(`${year.getFullYear()}-01-01 ~ ${year.getFullYear()}-12-31`);
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
          month={new Date(planResDur.split(" ~ ")[0])}
          onMonthChange={handleYear} />
        );
      case "select":
        const handleSelect = (day:any) => {
          const selectedDay = new Date(day);

          if (planStartDay && planEndDay) {
            if (selectedDay < planStartDay) {
              setPlanStartDay(selectedDay);
            }
            else if (selectedDay > planEndDay) {
              setPlanEndDay(selectedDay);
            }
            else {
              setPlanStartDay(selectedDay);
              setPlanEndDay(undefined);
            }
          }
          else if (planStartDay) {
            if (selectedDay < planStartDay) {
              setPlanEndDay(planStartDay);
              setPlanStartDay(selectedDay);
            }
            else if (selectedDay > planStartDay) {
              setPlanEndDay(selectedDay);
            }
            else {
              setPlanStartDay(undefined);
              setPlanEndDay(undefined);
            }
          }
          else {
            setPlanStartDay(selectedDay);
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
          selected={planStartDay && planEndDay && {from: planStartDay, to: planEndDay}}
          month={planStartDay}
          onDayClick={handleSelect}
          onMonthChange={(month) => { setPlanStartDay(month); setPlanEndDay(undefined); }} />
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
  const tablePlanList = () => {
    return (
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Part</th>
            <th>Title</th>
            <th>Content</th>
          </tr>
        </thead>
        <tbody>
          {PLAN_LIST?.map((planItem : any) => {
            return planItem.planSection?.map((planSection: any) => (
              <tr key={planSection._id}>
                <td
                  className="pointer"
                  onClick={() => {
                    navParam("/planDetail", {
                      state: {
                        _id : planItem._id,
                        planSection_id : planSection._id
                      },
                    });
                  }}>
                  {planSection.plan_part_val}
                </td>
                <td>{planSection.plan_title_val}</td>
                <td>{planSection.plan_content}</td>
              </tr>
            ));
          })}
        </tbody>
      </table>
    );
  };

  // 6-1. button ---------------------------------------------------------------------------------->
  const buttonPlanToday = () => {
    return (
      <button type="button" className="btn btn-sm btn-success me-2" onClick={() => {
        setPlanDay(koreanDate);
        setPlanPart("전체");
        setPlanTitle("전체");
        localStorage.removeItem(`planList(${type.typePre})`);
        localStorage.removeItem(`planStartDay(${type.typePre})`);
        localStorage.removeItem(`planEndDay(${type.typePre})`);
        localStorage.removeItem(`planDay(${type.typePre})`);
        localStorage.removeItem(`planPart(${type.typePre})`);
        localStorage.removeItem(`planTitle(${type.typePre})`);
      }}>
        Today
      </button>
    );
  };
  const buttonPlanReset = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => {
        setPlanDay(koreanDate);
        setPlanPart("전체");
        setPlanTitle("전체");
        localStorage.removeItem(`planList(${type.typePre})`);
        localStorage.removeItem(`planStartDay(${type.typePre})`);
        localStorage.removeItem(`planEndDay(${type.typePre})`);
        localStorage.removeItem(`planDay(${type.typePre})`);
        localStorage.removeItem(`planPart(${type.typePre})`);
        localStorage.removeItem(`planTitle(${type.typePre})`);
      }}>
        Reset
      </button>
    );
  };

  // 6-2. select  --------------------------------------------------------------------------------->
  const selectPlanList = () => {
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
  const selectPlanPart = () => {
    return (
      <div className="mb-3">
        <div className="input-group">
          <span className="input-group-text">파트</span>
          <select
            className="form-control"
            id={`plan_part_val`}
            value={planPart}
            onChange={(e:any) => {
              setPlanPart(e.target.value);
              const index = planPartArray.findIndex(
                (item) => item.plan_part[0] === e.target.value
              );
              setPlanTitle("전체");
              setPlanNumber(index);
            }}>
            {planPartArray.map((value, key) => (
              <option key={key} value={value.plan_part[0]}>
                {value.plan_part[0]}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
  const selectPlanTitle = () => {
    return (
      <div className="mb-3">
        <div className="input-group">
          <span className="input-group-text">종목</span>
          <select
            className="form-control"
            id={`plan_title_val`}
            value={planTitle}
            onChange={(e:any) => {
              setPlanTitle(e.target.value);
            }}>
            {planTitleArray[planNumber].plan_title.map((value, key) => (
              <option key={key} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };
  const selectFilterSub = () => {
    return (
      <div className="mb-3">
        <div className="input-group">
          <select className="form-select" id="planListSortOrder" onChange={(e) => {
            setFilter({...filter, filterSub: e.target.value});
          }}>
            <option value="asc" selected>오름차순</option>
            <option value="desc">내림차순</option>
          </select>
        </div>
      </div>
    );
  };
  const selectFilterPage = () => {
    return (
      <div className="mb-3">
        <div className="input-group">
          <select className="form-select" id="planListLimit" onChange={(e) => {
            setFilter({...filter, limit: Number(e.target.value)});
          }}>
            <option value="5" selected>5</option>
            <option value="10">10</option>
          </select>
        </div>
      </div>
    );
  };

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row d-center mt-3">
          <div className="col-4">
            {viewPlanList()}
          </div>
          <div className="col-8">
            <div className="row d-center mb-20">
              <div className="col-2">
                {selectPlanList()}
              </div>
              <div className="col-2">
                {selectPlanPart()}
              </div>
              <div className="col-2">
                {selectPlanTitle()}
              </div>
              <div className="col-2">
                {selectFilterSub()}
              </div>
              <div className="col-2">
                {selectFilterPage()}
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                {tablePlanList()}
                {filterBox()}
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-20 mb-20">
          <div className="col-12 d-center">
            {buttonPlanToday()}
            {buttonPlanReset()}
          </div>
        </div>
      </div>
    </div>
  );
};

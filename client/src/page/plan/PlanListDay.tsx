// PlanListDay.tsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {DayClickEventHandler, DayPicker} from "react-day-picker";
import {useStorage} from "../../assets/ts/useStorage";
import {ko} from "date-fns/locale";
import {parseISO} from "date-fns";
import moment from "moment-timezone";
import axios from "axios";
import {planPartArray, planTitleArray} from "./PlanArray";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";

// ------------------------------------------------------------------------------------------------>
export const PlanListDay = () => {

  // 1-1. title
  const TITLE = "Plan List Day";
  // 1-2. url
  const URL_PLAN = process.env.REACT_APP_URL_PLAN;
  // 1-3. date
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  // 1-4. hook
  const navParam = useNavigate();
  const location = useLocation();
  // 1-5. val
  const user_id = window.sessionStorage.getItem("user_id");
  // 1-6. log
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:PLAN_LIST, setVal:setPLAN_LIST} = useStorage<any>(
    "planList(DAY)", []
  );
  const {val:PLAN_AVERAGE, setVal:setPLAN_AVERAGE} = useStorage<any>(
    "planAvg(DAY)", []
  );
  const {val:planDay, setVal:setPlanDay} = useStorage<Date | undefined>(
    "planDay(DAY)", undefined
  );
  const {val:planResVal, setVal:setPlanResVal} = useStorage<Date | undefined>(
    "planResVal(DAY)", undefined
  );
  const {val:planResDur, setVal:setPlanResDur} = useStorage<string>(
    "planResDur(DAY)", "0000-00-00 ~ 0000-00-00"
  );
  const {val:planPart, setVal:setPlanPart} = useStorage<string>(
    "planPart(DAY)", "전체"
  );
  const {val:planTitle, setVal:setPlanTitle} = useStorage<string>(
    "planTitle(DAY)", "전체"
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [planType, setPlanType] = useState<string>("list");
  const [planNumber, setPlanNumber] = useState<number>(0);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    // 1. list
    const fetchPlanList = async () => {
      try {
        const response = await axios.get(`${URL_PLAN}/planList`, {
          params: {
            user_id : user_id,
            plan_dur : planResDur,
          },
        });
        setPLAN_LIST(response.data);
        log("PLAN_LIST " + JSON.stringify(response.data));
      }
      catch (error:any) {
        setPLAN_LIST([]);
        alert(`Error fetching plan data: ${error.message}`);
      }
    };
    fetchPlanList();

    // 2. average
    const fetchPlanAvg = async () => {
      try {
        const response = await axios.get (`${URL_PLAN}/planAvg`, {
          params: {
            user_id: user_id,
            plan_dur: planResDur,
            plan_part_val: planPart,
            plan_title_val: planTitle,
          },
        });
        setPLAN_AVERAGE(response.data);
        log("PLAN_AVERAGE " + JSON.stringify(response.data));
      }
      catch (error:any) {
        setPLAN_AVERAGE([]);
        alert(`Error fetching plan data: ${error.message}`);
      }
    };
    fetchPlanAvg();
  }, [user_id, planResDur, planPart, planTitle]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const formatVal = (value: number): string => {
      return value < 10 ? `0${value}` : `${value}`;
    };
    if (planDay) {
      const year = formatVal(planDay.getFullYear());
      const month = formatVal(planDay.getMonth() + 1);
      const date = formatVal(planDay.getDate());
      setPlanResVal(parseISO(`${year}-${month}-${date}`));
      setPlanResDur(`${year}-${month}-${date} ~ ${year}-${month}-${date}`);
    }
  }, [planDay]);

  // 4-1. logic ----------------------------------------------------------------------------------->
  const viewPlanDay = () => {
    const flowDayClick: DayClickEventHandler = (day: any) => {
      setPlanDay(day);
    };
    return (
      <DayPicker
        mode="single"
        showOutsideDays
        selected={planDay}
        month={planDay}
        locale={ko}
        weekStartsOn={1}
        onDayClick={flowDayClick}
        onMonthChange={(month) => {
          setPlanDay(month);
        }}
        modifiersClassNames={{
          selected: "selected",
          disabled: "disabled",
          outside: "outside",
          inside: "inside",
        }}
      />
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
            <th>Amount</th>
            <th>Content</th>
          </tr>
        </thead>
        <tbody>
          {PLAN_LIST.map((planItem : any) => {
            return planItem.planSection.map((planSection: any) => (
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
                <td>{planSection.plan_amount}</td>
                <td>{planSection.plan_content}</td>
              </tr>
            ));
          })}
        </tbody>
      </table>
    );
  };

  // 5-2. table ----------------------------------------------------------------------------------->
  const tablePlanAvg = () => {
    return (
      <div>
        <div className="row d-center">
          <div className="col-6">
            <div className="input-group">
              <span className="input-group-text">대분류</span>
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
          <div className="col-6">
            <div className="input-group">
              <span className="input-group-text">소분류</span>
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
        </div>
        <div className="row d-center">
          <div className="col-12">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Part</th>
                  <th>Title</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {PLAN_AVERAGE?.map((planItem:any, index:number) => (
                  <tr key={index}>
                    <td>{planItem.plan_part_val}</td>
                    <td>{planItem.plan_title_val}</td>
                    <td>{planItem.plan_amount_avg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // 6-1. button ---------------------------------------------------------------------------------->
  const buttonPlanToday = () => {
    return (
      <button type="button" className="btn btn-sm btn-success me-2" onClick={() => {
        setPlanDay(koreanDate);
        setPlanPart("전체");
        setPlanTitle("전체");
        localStorage.removeItem("planList(DAY)");
        localStorage.removeItem("planAvg(DAY)");
        localStorage.removeItem("planDay(DAY)");
        localStorage.removeItem("planPart(DAY)");
        localStorage.removeItem("planTitle(DAY)");
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
        localStorage.removeItem("planList(DAY)");
        localStorage.removeItem("planAvg(DAY)");
        localStorage.removeItem("planDay(DAY)");
        localStorage.removeItem("planPart(DAY)");
        localStorage.removeItem("planTitle(DAY)");
      }}>
        Reset
      </button>
    );
  };

  // 6-2. button ---------------------------------------------------------------------------------->
  const selectPlanList = () => {
    const currentPath = location.pathname || "";
    return (
      <div className="mb-3">
        <select className="form-select" id="planListDay" value={currentPath} onChange={(e:any) => {
          navParam(e.target.value);
        }}>
          <option value="/planListDay">Day</option>
          <option value="/planListWeek">Week</option>
          <option value="/planListMonth">Month</option>
          <option value="/planListYear">Year</option>
          <option value="/planListSelect">Select</option>
        </select>
      </div>
    );
  };
  const selectPlanType = () => {
    return (
      <div className="mb-3">
        <select className="form-select" id="planType" onChange={(e:any) => {
          if (e.target.value === "list") {
            setPlanType("list");
          }
          else if (e.target.value === "avg") {
            setPlanType("avg");
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
    <div className="container">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-7">{TITLE}</h1>
          <h2 className="mb-3 fw-7">일별로 조회</h2>
        </div>
      </div>
      <div className="row d-center mt-3">
        <div className="col-3">
          {selectPlanList()}
        </div>
        <div className="col-3">
          {selectPlanType()}
        </div>
      </div>
      <div className="row d-center mt-3">
        <div className="col-md-6 col-12 d-center">
          {viewPlanDay()}
        </div>
        <div className="col-md-6 col-12">
          {planType === "list" && tablePlanList()}
          {planType === "avg" && tablePlanAvg()}
        </div>
      </div>
      <div className="row mb-20">
        <div className="col-12 d-center">
          {buttonPlanToday()}
          {buttonPlanReset()}
        </div>
      </div>
    </div>
  );
};

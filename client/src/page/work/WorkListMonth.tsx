// WorkListMonth.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {DayPicker, MonthChangeEventHandler} from "react-day-picker";
import {ko} from "date-fns/locale";
import {parseISO} from "date-fns";
import moment from "moment-timezone";
import axios from "axios";
import {useStorage} from "../../assets/ts/useStorage";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";
import {workPartArray, workTitleArray} from "./WorkArray";

// 1. main ---------------------------------------------------------------------------------------->
export const WorkListMonth = () => {
  // title
  const TITLE = "Work List Month";
  // url
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  // date
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");
  // log
  const {log} = useDeveloperMode();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [workType, setWorkType] = useState<string>("list");
  const [workNumber, setWorkNumber] = useState<number>(0);

  // 2-2. useStorage ------------------------------------------------------------------------------>
  const {val:WORK_LIST, setVal:setWORK_LIST} = useStorage<any>(
    "workList(MONTH)", []
  );
  const {val:WORK_AVERAGE, setVal:setWORK_AVERAGE} = useStorage<any>(
    "workAvg(MONTH)", []
  );

  // 2-3. useStorage ------------------------------------------------------------------------------>
  const {val:workMonth, setVal:setWorkMonth} = useStorage<Date | undefined>(
    "workMonth(MONTH)", koreanDate
  );
  const {val:workResVal, setVal:setWorkResVal} = useStorage<Date | undefined>(
    "workResVal(MONTH)", undefined
  );
  const {val:workResDur, setVal:setWorkResDur} = useStorage<string>(
    "workResDur(MONTH)", "0000-00-00 ~ 0000-00-00"
  );

  // 2-4. useStorage ------------------------------------------------------------------------------>
  const {val:workPart, setVal:setWorkPart} = useStorage<string>(
    "workPart(MONTH)", "전체"
  );
  const {val:workTitle, setVal:setWorkTitle} = useStorage<string>(
    "workTitle(MONTH)", "전체"
  );

  // 2-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    // 1. list
    const fetchWorkList = async () => {
      try {
        const response = await axios.get (`${URL_WORK}/workList`, {
          params: {
            user_id : user_id,
            work_dur : workResDur,
          },
        });
        setWORK_LIST(response.data);
        log("WORK_LIST : " + JSON.stringify(response.data));
      }
      catch (error:any) {
        setWORK_LIST([]);
        alert(`Error fetching work data: ${error.message}`);
      }
    };
    // 2. average
    const fetchWorkAvg = async () => {
      try {
        const response = await axios.get (`${URL_WORK}/workAvg`, {
          params: {
            user_id : user_id,
            work_dur : workResDur,
            work_part_val : workPart,
            work_title_val : workTitle,
          },
        });
        setWORK_AVERAGE(response.data);
        log("WORK_AVERAGE : " + JSON.stringify(response.data));
      }
      catch (error:any) {
        setWORK_AVERAGE([]);
        alert(`Error fetching work data: ${error.message}`);
      }
    };
    fetchWorkList();
    fetchWorkAvg();
  }, [user_id, workResDur, workPart, workTitle]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const formatVal = (value:number):string => {
      return value < 10 ? `0${value}` : `${value}`;
    };
    if (workMonth) {
      setWorkResVal (
        parseISO (
          `${workMonth.getFullYear()}-${formatVal(workMonth.getMonth() + 1)}`
        )
      );
      setWorkResDur (
        `${workMonth.getFullYear()}-${formatVal(workMonth.getMonth() + 1)}-01 ~ ${workMonth.getFullYear()}-${formatVal(workMonth.getMonth() + 1)}-31`
      );
    }
    else {
      setWorkResVal (undefined);
    }
  }, [workMonth]);

  // 4-1. logic ----------------------------------------------------------------------------------->
  const viewWorkMonth = () => {
    const flowMonthChange: MonthChangeEventHandler = (day) => {
      const monthDate = new Date(day.getFullYear(), day.getMonth(), 1);
      setWorkMonth(monthDate);
    };
    return (
      <DayPicker
        mode="default"
        showOutsideDays
        locale={ko}
        weekStartsOn={1}
        month={workMonth}
        onMonthChange={flowMonthChange}
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
  const tableWorkList = () => {
    return (
      <table className="table table-bordered table-hover">
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
                <td
                  className="pointer"
                  onClick={() => {
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

  // 5-2. table ----------------------------------------------------------------------------------->
  const tableWorkAvg = () => {
    return (
      <div>
        <div className="row d-center">
          <div className="col-6">
            <div className="input-group">
              <span className="input-group-text">파트</span>
              <select
                className="form-control"
                id={`work_part_val`}
                value={workPart}
                onChange={(e:any) => {
                  setWorkPart(e.target.value);
                  const index = workPartArray.findIndex(
                    (item) => item.workPart[0] === e.target.value
                  );
                  setWorkTitle("전체");
                  setWorkNumber(index);
                }}>
                {workPartArray.map((value, key) => (
                  <option key={key} value={value.workPart[0]}>
                    {value.workPart[0]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-6">
            <div className="input-group">
              <span className="input-group-text">종목</span>
              <select
                className="form-control"
                id={`work_title_val`}
                value={workTitle}
                onChange={(e:any) => {
                  setWorkTitle(e.target.value);
                }}>
                {workTitleArray[workNumber].workTitle.map((value, key) => (
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
                  <th>Count</th>
                  <th>Kg Ave</th>
                  <th>Set Ave</th>
                  <th>Count Ave</th>
                  <th>Rest Ave</th>
                </tr>
              </thead>
              <tbody>
                {WORK_AVERAGE?.map((workItem : any, index:number) => (
                  <tr key={index}>
                    <td>{workItem.work_part_val}</td>
                    <td>{workItem.work_title_val}</td>
                    <td>{workItem.count}</td>
                    <td>{workItem.work_kg_avg}</td>
                    <td>{workItem.work_set_avg}</td>
                    <td>{workItem.work_count_avg}</td>
                    <td>{workItem.work_rest_avg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonWorkToday = () => {
    return (
      <button type="button" className="btn btn-sm btn-success me-2" onClick={() => {
        setWorkMonth(koreanDate);
        setWorkPart("전체");
        setWorkTitle("전체");
        localStorage.removeItem("workList(MONTH)");
        localStorage.removeItem("workAvg(MONTH)");
        localStorage.removeItem("workMonth(MONTH)");
        localStorage.removeItem("workPart(MONTH)");
        localStorage.removeItem("workTitle(MONTH)");
      }}>
        Today
      </button>
    );
  };
  const buttonWorkReset = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => {
        setWorkMonth(koreanDate);
        setWorkPart("전체");
        setWorkTitle("전체");
        localStorage.removeItem("workList(MONTH)");
        localStorage.removeItem("workAvg(MONTH)");
        localStorage.removeItem("workMonth(MONTH)");
        localStorage.removeItem("workPart(MONTH)");
        localStorage.removeItem("workTitle(MONTH)");
      }}>
        Reset
      </button>
    );
  };

  // 6-2. button ---------------------------------------------------------------------------------->
  const selectWorkList = () => {
    const currentPath = location.pathname || "";
    return (
      <div className="mb-3">
        <select className="form-select" id="workListMonth" value={currentPath}
        onChange={(e:any) => {
          navParam(e.target.value);
        }}>
          <option value="/workListDay">Day</option>
          <option value="/workListWeek">Week</option>
          <option value="/workListMonth">Month</option>
          <option value="/workListYear">Year</option>
          <option value="/workListSelect">Select</option>
        </select>
      </div>
    );
  };
  const selectWorkType = () => {
    return (
      <div className="mb-3">
        <select className="form-select" id="workType" onChange={(e:any) => {
          if (e.target.value === "list") {
            setWorkType("list");
          }
          else if (e.target.value === "avg") {
            setWorkType("avg");
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
          <h2 className="mb-3 fw-7">월별로 조회</h2>
        </div>
      </div>
      <div className="row d-center mt-3">
        <div className="col-3">
          {selectWorkList()}
        </div>
        <div className="col-3">
          {selectWorkType()}
        </div>
      </div>
      <div className="row d-center mt-3">
        <div className="col-md-6 col-12 d-center">
          {viewWorkMonth()}
        </div>
        <div className="col-md-6 col-12">
          {workType === "list" && tableWorkList()}
          {workType === "avg" && tableWorkAvg()}
        </div>
      </div>
      <div className="row mb-20">
        <div className="col-12 d-center">
          {buttonWorkToday()}
          {buttonWorkReset()}
        </div>
      </div>
    </div>
  );
};

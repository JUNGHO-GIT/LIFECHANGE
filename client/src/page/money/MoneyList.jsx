// MoneyList.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {DayClickEventHandler, DayPicker} from "react-day-picker";
import {useStorage} from "../../assets/js/useStorage.jsx";
import {ko} from "date-fns/locale";
import {parseISO} from "date-fns";
import moment from "moment-timezone";
import axios from "axios";
import {moneyPartArray, moneyTitleArray} from "./MoneyArray.jsx";
import {useDeveloperMode} from "../../assets/js/useDeveloperMode.jsx";

// ------------------------------------------------------------------------------------------------>
export const MoneyList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const TITLE = "Money List Day";
  const URL_MONEY = process.env.REACT_APP_URL_MONEY;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  const navParam = useNavigate();
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:MONEY_LIST, set:setMONEY_LIST} = useStorage(
    "moneyList(DAY)", []
  );
  const {val:MONEY_AVERAGE, set:setMONEY_AVERAGE} = useStorage(
    "moneyAvg(DAY)", []
  );
  const {val:moneyDay, set:setMoneyDay} = useStorage(
    "moneyDay(DAY)", undefined
  );
  const {val:moneyResVal, set:setMoneyResVal} = useStorage(
    "moneyResVal(DAY)", undefined
  );
  const {val:moneyResDur, set:setMoneyResDur} = useStorage(
    "moneyResDur(DAY)", "0000-00-00 ~ 0000-00-00"
  );
  const {val:moneyPart, set:setMoneyPart} = useStorage(
    "moneyPart(DAY)", "전체"
  );
  const {val:moneyTitle, set:setMoneyTitle} = useStorage(
    "moneyTitle(DAY)", "전체"
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [moneyType, setMoneyType] = useState("list");
  const [moneyNumber, setMoneyNumber] = useState(0);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    // 1. list
    const fetchMoneyList = async () => {
      try {
        const response = await axios.get(`${URL_MONEY}/list`, {
          params: {
            user_id : user_id,
            money_dur : moneyResDur,
          },
        });
        setMONEY_LIST(response.data);
        log("MONEY_LIST " + JSON.stringify(response.data));
      }
      catch (e) {
        setMONEY_LIST([]);
        alert(`Error fetching money data: ${e.message}`);
      }
    };
    fetchMoneyList();

    // 2. average
    const fetchMoneyAvg = async () => {
      try {
        const response = await axios.get (`${URL_MONEY}/moneyAvg`, {
          params: {
            user_id: user_id,
            money_dur: moneyResDur,
            money_part_val: moneyPart,
            money_title_val: moneyTitle,
          },
        });
        setMONEY_AVERAGE(response.data);
        log("MONEY_AVERAGE " + JSON.stringify(response.data));
      }
      catch (e) {
        setMONEY_AVERAGE([]);
        alert(`Error fetching money data: ${e.message}`);
      }
    };
    fetchMoneyAvg();
  }, [user_id, moneyResDur, moneyPart, moneyTitle]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const formatVal = (value) => {
      return value < 10 ? `0${value}` : `${value}`;
    };
    if (moneyDay) {
      const year = formatVal(moneyDay.getFullYear());
      const month = formatVal(moneyDay.getMonth() + 1);
      const date = formatVal(moneyDay.getDate());
      setMoneyResVal(parseISO(`${year}-${month}-${date}`));
      setMoneyResDur(`${year}-${month}-${date} ~ ${year}-${month}-${date}`);
    }
  }, [moneyDay]);

  // 4-1. view ----------------------------------------------------------------------------------->
  const viewMoneyDay = () => {
    const flowDayClick: DayClickEventHandler = (day) => {
      setMoneyDay(day);
    };
    return (
      <DayPicker
        mode="single"
        showOutsideDays
        selected={moneyDay}
        month={moneyDay}
        locale={ko}
        weekStartsOn={1}
        onDayClick={flowDayClick}
        onMonthChange={(month) => {
          setMoneyDay(month);
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
  const tableMoneyList = () => {
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
          {MONEY_LIST.map((moneyItem ) => {
            return moneyItem.money_section.map((money_section) => (
              <tr key={money_section._id}>
                <td
                  className="pointer"
                  onClick={() => {
                    navParam("/money/detail", {
                      state: {
                        _id : moneyItem._id,
                        money_section_id : money_section._id
                      },
                    });
                  }}>
                  {money_section.money_part_val}
                </td>
                <td>{money_section.money_title_val}</td>
                <td>{money_section.money_amount}</td>
                <td>{money_section.money_content}</td>
              </tr>
            ));
          })}
        </tbody>
      </table>
    );
  };

  // 5-2. table ----------------------------------------------------------------------------------->
  const tableMoneyAvg = () => {
    return (
      <div>
        <div className="row d-center">
          <div className="col-6">
            <div className="input-group">
              <span className="input-group-text">대분류</span>
              <select
                className="form-control"
                id={`money_part_val`}
                value={moneyPart}
                onChange={(e) => {
                  setMoneyPart(e.target.value);
                  const index = moneyPartArray.findIndex(
                    (item) => item.money_part[0] === e.target.value
                  );
                  setMoneyTitle("전체");
                  setMoneyNumber(index);
                }}>
                {moneyPartArray.map((value, key) => (
                  <option key={key} value={value.money_part[0]}>
                    {value.money_part[0]}
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
                id={`money_title_val`}
                value={moneyTitle}
                onChange={(e) => {
                  setMoneyTitle(e.target.value);
                }}>
                {moneyTitleArray[moneyNumber].money_title.map((value, key) => (
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
                {MONEY_AVERAGE?.map((moneyItem, index) => (
                  <tr key={index}>
                    <td>{moneyItem.money_part_val}</td>
                    <td>{moneyItem.money_title_val}</td>
                    <td>{moneyItem.money_amount_avg}</td>
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
  const buttonMoneyToday = () => {
    return (
      <button type="button" className="btn btn-sm btn-success me-2" onClick={() => {
        setMoneyDay(koreanDate);
        setMoneyPart("전체");
        setMoneyTitle("전체");
        localStorage.removeItem("moneyList(DAY)");
        localStorage.removeItem("moneyAvg(DAY)");
        localStorage.removeItem("moneyDay(DAY)");
        localStorage.removeItem("moneyPart(DAY)");
        localStorage.removeItem("moneyTitle(DAY)");
      }}>
        Today
      </button>
    );
  };
  const buttonMoneyReset = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => {
        setMoneyDay(koreanDate);
        setMoneyPart("전체");
        setMoneyTitle("전체");
        localStorage.removeItem("moneyList(DAY)");
        localStorage.removeItem("moneyAvg(DAY)");
        localStorage.removeItem("moneyDay(DAY)");
        localStorage.removeItem("moneyPart(DAY)");
        localStorage.removeItem("moneyTitle(DAY)");
      }}>
        Reset
      </button>
    );
  };

  // 6-2. select  --------------------------------------------------------------------------------->
  const selectMoneyList = () => {
    const currentPath = location.pathname || "";
    return (
      <div className="mb-3">
        <select className="form-select" id="moneyList" value={currentPath} onChange={(e) => {
          navParam(e.target.value);
        }}>
          <option value="/moneyList">Day</option>
          <option value="/moneyListWeek">Week</option>
          <option value="/moneyListMonth">Month</option>
          <option value="/moneyListYear">Year</option>
          <option value="/moneyListSelect">Select</option>
        </select>
      </div>
    );
  };
  const selectMoneyType = () => {
    return (
      <div className="mb-3">
        <select className="form-select" id="moneyType" onChange={(e) => {
          if (e.target.value === "list") {
            setMoneyType("list");
          }
          else if (e.target.value === "avg") {
            setMoneyType("avg");
          }
        }}>
          <option value="list">List</option>
          <option value="avg">Avg</option>
        </select>
      </div>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row d-center mt-5">
          <div className="col-12">
            <h1 className="mb-3 fw-7">{TITLE}</h1>
            <h2 className="mb-3 fw-7">일별로 조회</h2>
          </div>
        </div>
        <div className="row d-center mt-3">
          <div className="col-3">
            {selectMoneyList()}
          </div>
          <div className="col-3">
            {selectMoneyType()}
          </div>
        </div>
        <div className="row d-center mt-3">
          <div className="col-md-6 col-12 d-center">
            {viewMoneyDay()}
          </div>
          <div className="col-md-6 col-12">
            {moneyType === "list" && tableMoneyList()}
            {moneyType === "avg" && tableMoneyAvg()}
          </div>
        </div>
        <div className="row mb-20">
          <div className="col-12 d-center">
            {buttonMoneyToday()}
            {buttonMoneyReset()}
          </div>
        </div>
      </div>
    </div>
  );
};

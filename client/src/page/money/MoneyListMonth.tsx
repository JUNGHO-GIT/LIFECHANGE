// MoneyListMonth.tsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {DayPicker, MonthChangeEventHandler} from "react-day-picker";
import {ko} from "date-fns/locale";
import {parseISO} from "date-fns";
import moment from "moment-timezone";
import axios from "axios";
import {useStorage} from "../../assets/ts/useStorage";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";
import {moneyPartArray, moneyTitleArray} from "./MoneyArray";

// ------------------------------------------------------------------------------------------------>
export const MoneyListMonth = () => {

  // 1-1. title
  const TITLE = "Money List Month";
  // 1-2. url
  const URL_MONEY = process.env.REACT_APP_URL_MONEY;
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
  const {val:MONEY_LIST, setVal:setMONEY_LIST} = useStorage<any>(
    "moneyList(MONTH)", []
  );
  const {val:MONEY_AVERAGE, setVal:setMONEY_AVERAGE} = useStorage<any>(
    "moneyAvg(MONTH)", []
  );
  const {val:moneyMonth, setVal:setMoneyMonth} = useStorage<Date | undefined>(
    "moneyMonth(MONTH)", koreanDate
  );
  const {val:moneyResVal, setVal:setMoneyResVal} = useStorage<Date | undefined>(
    "moneyResVal(MONTH)", undefined
  );
  const {val:moneyResDur, setVal:setMoneyResDur} = useStorage<string>(
    "moneyResDur(MONTH)", "0000-00-00 ~ 0000-00-00"
  );
  const {val:moneyPart, setVal:setMoneyPart} = useStorage<string>(
    "moneyPart(MONTH)", "전체"
  );
  const {val:moneyTitle, setVal:setMoneyTitle} = useStorage<string>(
    "moneyTitle(MONTH)", "전체"
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [moneyType, setMoneyType] = useState<string>("list");
  const [moneyNumber, setMoneyNumber] = useState<number>(0);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    // 1. list
    const fetchMoneyList = async () => {
      try {
        const response = await axios.get (`${URL_MONEY}/moneyList`, {
          params: {
            user_id : user_id,
            money_dur : moneyResDur,
          },
        });
        setMONEY_LIST(response.data);
        log("MONEY_LIST : " + JSON.stringify(response.data));
      }
      catch (error:any) {
        setMONEY_LIST([]);
        alert(`Error fetching money data: ${error.message}`);
      }
    };
    fetchMoneyList();

    // 2. average
    const fetchMoneyAvg = async () => {
      try {
        const response = await axios.get (`${URL_MONEY}/moneyAvg`, {
          params: {
            user_id : user_id,
            money_dur : moneyResDur,
            money_part_val : moneyPart,
            money_title_val : moneyTitle,
          },
        });
        setMONEY_AVERAGE(response.data);
        log("MONEY_AVERAGE : " + JSON.stringify(response.data));
      }
      catch (error:any) {
        setMONEY_AVERAGE([]);
        alert(`Error fetching money data: ${error.message}`);
      }
    };

    fetchMoneyAvg();
  }, [user_id, moneyResDur, moneyPart, moneyTitle]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const formatVal = (value:number):string => {
      return value < 10 ? `0${value}` : `${value}`;
    };
    if (moneyMonth) {
      setMoneyResVal (
        parseISO (
          `${moneyMonth.getFullYear()}-${formatVal(moneyMonth.getMonth() + 1)}`
        )
      );
      setMoneyResDur (
        `${moneyMonth.getFullYear()}-${formatVal(moneyMonth.getMonth() + 1)}-01 ~ ${moneyMonth.getFullYear()}-${formatVal(moneyMonth.getMonth() + 1)}-31`
      );
    }
    else {
      setMoneyResVal (undefined);
    }
  }, [moneyMonth]);

  // 4-1. logic ----------------------------------------------------------------------------------->
  const viewMoneyMonth = () => {
    const flowMonthChange: MonthChangeEventHandler = (day) => {
      const monthDate = new Date(day.getFullYear(), day.getMonth(), 1);
      setMoneyMonth(monthDate);
    };
    return (
      <DayPicker
        mode="default"
        showOutsideDays
        locale={ko}
        weekStartsOn={1}
        month={moneyMonth}
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
          {MONEY_LIST.map((moneyItem : any) => {
            return moneyItem.moneySection.map((moneySection: any) => (
              <tr key={moneySection._id}>
                <td
                  className="pointer"
                  onClick={() => {
                    navParam("/moneyDetail", {
                      state: {
                        _id : moneyItem._id,
                        moneySection_id : moneySection._id
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

  // 5-2. table ----------------------------------------------------------------------------------->
  const tableMoneyAvg = () => {
    return (
      <div>
        <div className="row d-center">
          <div className="col-6">
            <div className="input-group">
              <span className="input-group-text">파트</span>
              <select
                className="form-control"
                id={`money_part_val`}
                value={moneyPart}
                onChange={(e:any) => {
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
              <span className="input-group-text">종목</span>
              <select
                className="form-control"
                id={`money_title_val`}
                value={moneyTitle}
                onChange={(e:any) => {
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
                {MONEY_AVERAGE?.map((moneyItem:any, index:number) => (
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

  // 6. button ------------------------------------------------------------------------------------>
  const buttonMoneyToday = () => {
    return (
      <button type="button" className="btn btn-sm btn-success me-2" onClick={() => {
        setMoneyMonth(koreanDate);
        setMoneyPart("전체");
        setMoneyTitle("전체");
        localStorage.removeItem("moneyList(MONTH)");
        localStorage.removeItem("moneyAvg(MONTH)");
        localStorage.removeItem("moneyMonth(MONTH)");
        localStorage.removeItem("moneyPart(MONTH)");
        localStorage.removeItem("moneyTitle(MONTH)");
      }}>
        Today
      </button>
    );
  };
  const buttonMoneyReset = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => {
        setMoneyMonth(koreanDate);
        setMoneyPart("전체");
        setMoneyTitle("전체");
        localStorage.removeItem("moneyList(MONTH)");
        localStorage.removeItem("moneyAvg(MONTH)");
        localStorage.removeItem("moneyMonth(MONTH)");
        localStorage.removeItem("moneyPart(MONTH)");
        localStorage.removeItem("moneyTitle(MONTH)");
      }}>
        Reset
      </button>
    );
  };

  // 6-2. button ---------------------------------------------------------------------------------->
  const selectMoneyList = () => {
    const currentPath = location.pathname || "";
    return (
      <div className="mb-3">
        <select className="form-select" id="moneyListMonth" value={currentPath}
        onChange={(e:any) => {
          navParam(e.target.value);
        }}>
          <option value="/moneyListDay">Day</option>
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
        <select className="form-select" id="moneyType" onChange={(e:any) => {
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
          {selectMoneyList()}
        </div>
        <div className="col-3">
          {selectMoneyType()}
        </div>
      </div>
      <div className="row d-center mt-3">
        <div className="col-md-6 col-12 d-center">
          {viewMoneyMonth()}
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
  );
};
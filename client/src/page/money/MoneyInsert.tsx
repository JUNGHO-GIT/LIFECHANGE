// MoneyInsert.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";
import {moneyPartArray, moneyTitleArray} from "../money/MoneyArray";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";

// 1. main ---------------------------------------------------------------------------------------->
export const MoneyInsert = () => {
  // title
  const TITLE = "Money Insert";
  // url
  const URL_MONEY = process.env.REACT_APP_URL_MONEY;
  // date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");
  // log
  const {log} = useDeveloperMode();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [MONEY, setMONEY] = useState<any>({});
  const [moneyDay, setMoneyDay] = useState<string>(koreanDate);
  const [moneyAmount, setMoneyAmount] = useState<number>(1);
  const [moneySection, setMoneySection] = useState<any[]>([{
    money_part_idx: 0,
    money_part_val: "전체",
    money_title_idx: 0,
    money_title_val: "전체",
  }]);

  // 2-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setMONEY ({
      ...MONEY,
      moneyDay : moneyDay,
      moneySection : moneySection,
    });
  }, [moneyDay, moneySection]);

  // 2-2. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (MONEY.money_start && MONEY.money_end) {
      const money_start = moment(MONEY.money_start, "HH:mm");
      const money_end = moment(MONEY.money_end, "HH:mm");
      let money_time_minutes = money_end.diff(money_start, "minutes");

      if (money_time_minutes < 0) {
        money_time_minutes = Math.abs(money_time_minutes);
      }

      const hours = Math.floor(money_time_minutes / 60);
      const minutes = money_time_minutes % 60;

      const money_time_formatted = `${String(hours).padStart(2, "0")} : ${String (
        minutes
      ).padStart(2, "0")}`;

      setMONEY({ ...MONEY, money_time: money_time_formatted });
    }
  }, [MONEY.money_start, MONEY.money_end]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowMoneyInsert = async () => {
    if (!user_id) {
      alert("Input a ID");
      return;
    }
    if (!moneyDay) {
      alert("Input a Day");
      return;
    }
    if (!MONEY.money_start) {
      alert("Input a Start");
      return;
    }
    if (!MONEY.money_end) {
      alert("Input a End");
      return;
    }
    if (!MONEY.money_time) {
      alert("Input a Time");
      return;
    }
    const response = await axios.post (`${URL_MONEY}/moneyInsert`, {
      user_id : user_id,
      MONEY : MONEY,
    });
    if (response.data === "success") {
      alert("Insert a money successfully");
      navParam("/moneyListDay");
    }
    else if (response.data === "fail") {
      alert("Insert a money failure");
    }
    else {
      throw new Error("Server responded with an error");
    }
  };

  // 4-1. handler --------------------------------------------------------------------------------->
  const handleMoneyPartChange = (i: number, e: any) => {
    const newIndex = parseInt(e.target.value);
    setMoneySection((prev: any[]) => {
      const updatedSection = [...prev];
      updatedSection[i] = {
        ...updatedSection[i],
        money_part_idx: newIndex,
        money_part_val: moneyPartArray[newIndex].money_part[0],
        money_title_idx: 0,
        money_title_val: moneyTitleArray[newIndex].money_title[0],
      };
      return updatedSection;
    });
  };

  // 4-2. handler --------------------------------------------------------------------------------->
  const handleMoneyTitleChange = (i: number, e: any) => {
    let newTitle = e.target.value;
    setMoneySection((prev: any[]) => {
      let updatedSection = [...prev];
      updatedSection[i].money_title_val = newTitle;
      return updatedSection;
    });
  };

  // 4-3. handler --------------------------------------------------------------------------------->
  const handleMoneyAmountChange = () => {
    return (
      <div>
        <div className="row d-center">
          <div className="col-4">
            <input type="number" value={moneyAmount} min="1" className="form-control mb-30"
            onChange={(e:any) => {
              let defaultSection = {
                money_part_idx: 0,
                money_part_val: "전체",
                money_title_idx: 0,
                money_title_val: "전체",
              };
              let newAmount: number = parseInt(e.target.value);

              // amount 값이 증가했을 때 새로운 섹션들만 추가
              if (newAmount > moneyAmount) {
                let additionalSections = Array(newAmount - moneyAmount).fill(defaultSection);
                setMoneySection(prev => [...prev, ...additionalSections]);
              }
              // amount 값이 감소했을 때 마지막 섹션부터 제거
              else if (newAmount < moneyAmount) {
                setMoneySection(prev => prev.slice(0, newAmount));
              }
              // moneyAmount 값 업데이트
              setMoneyAmount(newAmount);
            }}/>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-12">
            {Array.from({ length: moneyAmount }, (_, i) => tableMoneySection(i))}
          </div>
        </div>
      </div>
    );
  };

  // 4. logic ------------------------------------------------------------------------------------->
  const viewMoneyDay = () => {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        popperPlacement="bottom"
        selected={new Date(moneyDay)}
        onChange={(date:any) => {
          setMoneyDay(moment(date).format("YYYY-MM-DD").toString());
        }}
      />
    );
  };

  // 5-1. table ----------------------------------------------------------------------------------->
  const tableMoneySection = (i: number) => {

    const updateMoneyArray
    = moneySection[i] && moneyTitleArray[moneySection[i].money_part_idx]
    ? moneyTitleArray[moneySection[i].money_part_idx]?.money_title
    : [];

    return (
      <div key={i} className="mb-20">
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">파트</span>
              <select
                className="form-control"
                id={`money_part_idx-${i}`}
                onChange={(e:any) => handleMoneyPartChange(i, e)}>
                {moneyPartArray.flatMap((key, index) => (
                  <option key={index} value={index}>
                    {key.money_part[0]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">종목</span>
              <select
                className="form-control"
                id={`money_title_val-${i}`}
                onChange={(e:any) => handleMoneyTitleChange(i, e)}>
                {updateMoneyArray.flatMap((title, index) => (
                  <option key={index} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">Set</span>
              <input
                type="number"
                min="0"
                className="form-control"
                id={`money_set-${i}`}
                placeholder="Set"
                value={moneySection[i]?.money_set}
                onChange={(e:any) => {
                  setMoneySection((prev: any[]) => {
                    const updatedSection = [...prev];
                    updatedSection[i].money_set = parseInt(e.target.value);
                    return updatedSection;
                  });
                }}
              />
            </div>
          </div>
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">Count</span>
              <input
                type="number"
                min="0"
                className="form-control"
                id={`money_count-${i}`}
                placeholder="Count"
                value={moneySection[i]?.money_count}
                onChange={(e:any) => {
                  setMoneySection((prev: any[]) => {
                    const updatedSection = [...prev];
                    updatedSection[i].money_count = parseInt(e.target.value);
                    return updatedSection;
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">Kg</span>
              <input
                type="number"
                min="0"
                className="form-control"
                id={`money_kg-${i}`}
                placeholder="Kg"
                value={moneySection[i]?.money_kg}
                onChange={(e:any) => {
                  setMoneySection((prev: any[]) => {
                    const updatedSection = [...prev];
                    updatedSection[i].money_kg = parseInt(e.target.value);
                    return updatedSection;
                  });
                }}
              />
            </div>
          </div>
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">Rest</span>
              <input
                type="number"
                min="0"
                className="form-control"
                id={`money_rest-${i}`}
                placeholder="Rest"
                value={moneySection[i]?.money_rest}
                onChange={(e:any) => {
                  setMoneySection((prev: any[]) => {
                    const updatedSection = [...prev];
                    updatedSection[i].money_rest = parseInt(e.target.value);
                    return updatedSection;
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 5-2. table ----------------------------------------------------------------------------------->
  const tableMoneyInsert = () => {
    return (
      <div>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">ID</span>
              <input
                type="text"
                className="form-control"
                id="user_id"
                name="user_id"
                placeholder="ID"
                value={user_id ? user_id : ""}
                readOnly
                onChange={(e:any) => {
                  setMONEY({ ...MONEY, user_id: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">Day</span>
              <input
                readOnly
                type="text"
                className="form-control"
                id="moneyDay"
                name="moneyDay"
                placeholder="Day"
                value={MONEY?.moneyDay}
                onChange={(e:any) => {
                  setMoneyDay(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">Start</span>
              <TimePicker
                id="money_start"
                name="money_start"
                className="form-control"
                value={MONEY?.money_start}
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                onChange={(e:any) => {
                  setMONEY({ ...MONEY, money_start: e });
                }}
              />
            </div>
          </div>
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">End</span>
              <TimePicker
                id="money_end"
                name="money_end"
                className="form-control"
                value={MONEY?.money_end}
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                onChange={(e:any) => {
                  setMONEY({ ...MONEY, money_end : e });
                }}
              />
            </div>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-10">
            <div className="input-group">
              <span className="input-group-text">Time</span>
              <input
                readOnly
                type="text"
                className="form-control"
                id="money_time"
                name="money_time"
                placeholder="Time"
                value={MONEY.money_time ? MONEY.money_time : ""}
                onChange={(e:any) => {
                  setMONEY({ ...MONEY, money_time : e.target.value });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonMoneyInsert = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary" onClick={flowMoneyInsert}>
        Insert
      </button>
    );
  };
  const buttonRefreshPage = () => {
    return (
      <button type="button" className="btn btn-sm btn-success ms-2" onClick={() => {
        navParam(0);
      }}>
        Refresh
      </button>
    );
  };

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="container">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-7">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5 mb-5">
        <div className="col-12">
          <h1 className="mb-3 fw-5">
            <span>{viewMoneyDay()}</span>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">
          {handleMoneyAmountChange()}
        </div>
      </div>
      <div className="row d-center mt-5 mb-20">
        <div className="col-12">
          {tableMoneyInsert()}
          <br />
          {buttonMoneyInsert()}
          {buttonRefreshPage()}
        </div>
      </div>
    </div>
  );
};

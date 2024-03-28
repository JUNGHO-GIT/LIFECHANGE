// MoneyInsert.tsx

import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment-timezone";
import {moneyPartArray, moneyTitleArray} from "../money/MoneyArray";
import {useStorage} from "../../assets/ts/useStorage";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";

// ------------------------------------------------------------------------------------------------>
export const MoneyInsert = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const TITLE = "Money Insert";
  const URL_MONEY = process.env.REACT_APP_URL_MONEY;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  const navParam = useNavigate();
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:moneyDay, setVal:setMoneyDay} = useStorage (
    "moneyDay", new Date(koreanDate)
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [MONEY, setMONEY] = useState({});
  const [moneyCount, setMoneyCount] = useState(1);
  const [money_section, setMoneySection] = useState<any[]>([{
    money_part_idx: 0,
    money_part_val: "전체",
    money_title_idx: 0,
    money_title_val: "전체",
  }]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setMONEY ({
      ...MONEY,
      moneyDay: moment(moneyDay).format("YYYY-MM-DD"),
      money_section : money_section,
    });
  }, [moneyDay, money_section]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowMoneyInsert = async () => {
    try {
      if (!user_id) {
        alert("Input a ID");
        return;
      }
      if (!moneyDay) {
        alert("Input a Day");
        return;
      }

      const response = await axios.post (`${URL_MONEY}/moneyInsert`, {
        user_id : user_id,
        MONEY : MONEY,
      });
      log("MONEY : " + JSON.stringify(MONEY));

      if (response.data === "success") {
        alert("Insert a money successfully");
        navParam("/moneyListDay");
      }
      else {
        alert("Insert a money failure");
      }
    }
    catch (error:any) {
      alert(`Error inserting money data: ${error.message}`);
    }
  };

  // 4-1. handler --------------------------------------------------------------------------------->
  const handleMoneyPartChange = (i, e) => {
    const newIndex = parseInt(e.target.value);
    setMoneySection((prev[]) => {
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
  const handleMoneyTitleChange = (i, e) => {
    let newTitle = e.target.value;
    setMoneySection((prev[]) => {
      let updatedSection = [...prev];
      updatedSection[i].money_title_val = newTitle;
      return updatedSection;
    });
  };

  // 4-3. handler --------------------------------------------------------------------------------->
  const handleMoneyCountChange = () => {
    return (
      <div>
        <div className="row d-center">
          <div className="col-4">
            <input type="number" value={moneyCount} min="1" className="form-control mb-30"
            onChange={(e:any) => {
              let defaultSection = {
                money_part_idx: 0,
                money_part_val: "전체",
                money_title_idx: 0,
                money_title_val: "전체",
              };
              let newCount = parseInt(e.target.value);

              // amount 값이 증가했을 때 새로운 섹션들만 추가
              if (newCount > moneyCount) {
                let additionalSections = Array(newCount - moneyCount).fill(defaultSection);
                setMoneySection(prev => [...prev, ...additionalSections]);
              }
              // amount 값이 감소했을 때 마지막 섹션부터 제거
              else if (newCount < moneyCount) {
                setMoneySection(prev => prev.slice(0, newCount));
              }
              // moneyCount 값 업데이트
              setMoneyCount(newCount);
            }}/>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-12">
            {Array.from({ length: moneyCount }, (_, i) => tableMoneySection(i))}
          </div>
        </div>
      </div>
    );
  };

  // 4. view -------------------------------------------------------------------------------------->
  const viewMoneyDay = () => {
    const calcDate = (days) => {
      setMoneyDay((prevDate) => {
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
          selected={moneyDay}
          onChange={(date) => {
            setMoneyDay(date);
          }}
        />
        <div className="black mt-4 ms-5 pointer" onClick={() => calcDate(1)}>
          &#8594;
        </div>
      </div>
    );
  };

  // 5-1. table ----------------------------------------------------------------------------------->
  const tableMoneyInsert = () => {
    return (
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
    );
  };

  // 5-2. table ----------------------------------------------------------------------------------->
  const tableMoneySection = (i) => {

    const updateMoneyArray
    = money_section[i] && moneyTitleArray[money_section[i].money_part_idx]
    ? moneyTitleArray[money_section[i].money_part_idx]?.money_title
   : [];

    return (
      <div key={i} className="mb-20">
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">대분류</span>
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
              <span className="input-group-text">소분류</span>
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
              <span className="input-group-text">Amount</span>
              <input
                type="number"
                min="0"
                className="form-control"
                id={`money_amount-${i}`}
                placeholder="amount"
                value={money_section[i]?.money_amount}
                onChange={(e:any) => {
                  setMoneySection((prev[]) => {
                    const updatedSection = [...prev];
                    updatedSection[i].money_amount = e.target.value;
                    return updatedSection;
                  });
                }}
              />
            </div>
          </div>
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">Content</span>
              <input
                type="text"
                className="form-control"
                id={`money_content-${i}`}
                placeholder="content"
                value={money_section[i]?.money_content}
                onChange={(e:any) => {
                  setMoneySection((prev[]) => {
                    const updatedSection = [...prev];
                    updatedSection[i].money_content = e.target.value;
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

  // 9. button ------------------------------------------------------------------------------------>
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

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
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
          {handleMoneyCountChange()}
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
    </div>
  );
};

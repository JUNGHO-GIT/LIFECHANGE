// MoneySave.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/js/useStorage.jsx";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";
import {moneyPartArray, moneyTitleArray} from "./MoneyArray";
import {BiCaretLeft, BiCaretRight} from "react-icons/bi";

// ------------------------------------------------------------------------------------------------>
export const MoneySave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_MONEY = process.env.REACT_APP_URL_MONEY;
  const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const location_date = location?.state?.date?.toString();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:planYn, set:setPlanYn} = useStorage(
    `planYn(${PATH})`, "N"
  );
  const {val:planCount, set:setPlanCount} = useStorage(
    `planCount(${PATH})`, 0
  );
  const {val:realCount, set:setRealCount} = useStorage(
    `realCount(${PATH})`, 0
  );

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:strStartDate, set:setStrStartDate} = useStorage(
    `strStartDate(${PATH})`, koreanDate
  );
  const {val:strEndDate, set:setStrEndDate} = useStorage(
    `strEndDate(${PATH})`, koreanDate
  );
  const {val:strDate, set:setStrDate} = useStorage(
    `strDate(${PATH})`, location_date
  );
  const {val:strDur, set:setStrDur} = useStorage(
    `strDur(${PATH})`, `${location_date} ~ ${location_date}`
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [MONEY_DEFAULT, setMONEY_DEFAULT] = useState({
    _id: "",
    money_number: 0,
    money_date: "",
    money_real : {
      money_section: [{
        money_part_idx: 0,
        money_part_val: "전체",
        money_title_idx: 0,
        money_title_val: "전체",
        money_amount: 0,
        money_content: "",
      }],
    },
    money_plan : {
      money_section: [{
        money_part_idx: 0,
        money_part_val: "전체",
        money_title_idx: 0,
        money_title_val: "전체",
        money_amount: 0,
        money_content: "",
      }],
    }
  });
  const [MONEY, setMONEY] = useState({
    _id: "",
    money_number: 0,
    money_date: "",
    money_real : {
      money_section: [{
        money_part_idx: 0,
        money_part_val: "전체",
        money_title_idx: 0,
        money_title_val: "전체",
        money_amount: 0,
        money_content: "",
      }],
    },
    money_plan : {
      money_section: [{
        money_part_idx: 0,
        money_part_val: "전체",
        money_title_idx: 0,
        money_title_val: "전체",
        money_amount: 0,
        money_content: "",
      }],
    }
  });

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setStrDate(location_date);
    setStrDur(`${location_date} ~ ${location_date}`);
  }, [location_date]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setMONEY((prev) => ({
      ...prev,
      money_date: strDur
    }));
  }, [strDur]);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_MONEY}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        money_dur: strDur,
        planYn: planYn,
      },
    });

    setPlanCount(response.data.planCount ? response.data.planCount : 0);
    setRealCount(response.data.realCount ? response.data.realCount : 0);
    setMONEY(response.data.result ? response.data.result : MONEY_DEFAULT);

  })()}, [strDur, planYn]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    const moneyType = planYn === "Y" ? "money_plan" : "money_real";

    const startTime = MONEY[moneyType]?.money_start?.toString();
    const endTime = MONEY[moneyType]?.money_end?.toString();

    if (startTime && endTime) {
      const startDate = new Date(`${strDate}T${startTime}`);
      const endDate = new Date(`${strDate}T${endTime}`);

      // 종료 시간이 시작 시간보다 이전이면, 다음 날로 설정
      if (endDate < startDate) {
        endDate.setDate(endDate.getDate() + 1);
      }

      // 차이 계산
      const diff = endDate.getTime() - startDate.getTime();
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

      setMONEY((prev) => ({
        ...prev,
        [moneyType]: {
          ...prev[moneyType],
          money_time: time,
        },
      }));
    }
  }, [strStartDate, strEndDate]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowMoneySave = async () => {

    const response = await axios.post(`${URL_MONEY}/save`, {
      user_id: user_id,
      MONEY: MONEY,
      money_dur: strDur,
      planYn: planYn
    });
    if (response.data === "success") {
      alert("Save a money successfully");
      navParam("/money/list");
    }
    else if (response.data === "fail") {
      alert("Save a money failed");
      return;
    }
    else {
      alert(`${response.data}error`);
    }
  };

  // 4-1. handler --------------------------------------------------------------------------------->
  const handleTotalCountChange = () => {

    const moneyType = planYn === "Y" ? "money_plan" : "money_real";
    const countType = planYn === "Y" ? planCount : realCount;
    const setCount = planYn === "Y" ? setPlanCount : setRealCount;

    return (
      <div>
        <div className="row d-center">
          <div className="col-4">
            <input
              type="number"
              value={countType}
              min="1"
              className="form-control mb-30"
              onChange={(e) => {
                let defaultSection = {
                  money_part_idx: 0,
                  money_part_val: "전체",
                  money_title_idx: 0,
                  money_title_val: "전체",
                };
                let newCount = parseInt(e.target.value);

                // count 값이 증가했을 때 새로운 섹션들만 추가
                if (newCount > countType) {
                  let additionalSections = Array(newCount - countType).fill(defaultSection);
                  let updatedSection = [...MONEY[moneyType].money_section, ...additionalSections];
                  setMONEY((prev) => ({
                    ...prev,
                    [moneyType]: {
                      ...prev[moneyType],
                      money_section: updatedSection,
                    },
                  }));
                }
                // count 값이 감소했을 때 마지막 섹션부터 제거
                else if (newCount < countType) {
                  let updatedSection = [...MONEY[moneyType].money_section];
                  updatedSection = updatedSection.slice(0, newCount);
                  setMONEY((prev) => ({
                    ...prev,
                    [moneyType]: {
                      ...prev[moneyType],
                      money_section: updatedSection,
                    },
                  }));
                }
                setCount(newCount);
              }}
            />
          </div>
        </div>
        <div className="row d-center">
          <div className="col-12">
            {Array.from({ length: countType }, (_, i) => tableMoneySection(i))}
          </div>
        </div>
      </div>
    );
  };

  // 4. view -------------------------------------------------------------------------------------->
  const viewMoneyDay = () => {

    const calcDate = (days) => {
      const date = new Date(strDate);
      date.setDate(date.getDate() + days);
      setStrDate(moment(date).format("YYYY-MM-DD"));
    };

    return (
      <div className="d-inline-flex">
        <div onClick={() => calcDate(-1)}>
          <BiCaretLeft className="me-10 mt-10 fs-20 pointer" />
        </div>
        <DatePicker
          dateFormat="yyyy-MM-dd"
          popperPlacement="bottom"
          selected={new Date(strDate)}
          onChange={(date) => {
            setStrDate(moment(date).format("YYYY-MM-DD"));
          }}
        />
        <div onClick={() => calcDate(1)}>
          <BiCaretRight className="ms-10 mt-10 fs-20 pointer" />
        </div>
      </div>
    );
  };

  // 5-1. table ----------------------------------------------------------------------------------->
  const tableMoneySection = (i) => {

    const moneyType = planYn === "Y" ? "money_plan" : "money_real";

    return (
      <React.Fragment>
        <div key={i} className="mb-20">
          <div className="row d-center">
            <div className="col-6">
              <div className="input-group">
                <span className="input-group-text">파트</span>
                <select
                  className="form-control"
                  id={`money_part_idx-${i}`}
                  value={MONEY[moneyType].money_section[i]?.money_part_idx}
                  onChange={(e) => {
                    const newIndex = parseInt(e.target.value);
                    setMONEY((prevMONEY) => {
                      let updatedMONEY = { ...prevMONEY };
                      let updatedSection = [...updatedMONEY[moneyType].money_section];
                      updatedSection[i] = {
                        ...updatedSection[i],
                        money_part_idx: newIndex,
                        money_part_val: moneyPartArray[newIndex].money_part[0],
                        money_title_idx: 0,
                        money_title_val: moneyTitleArray[newIndex].money_title[0],
                      };
                      updatedMONEY[moneyType].money_section = updatedSection;
                      return updatedMONEY;
                    });
                  }}
                >
                  {moneyPartArray.map((part, idx) => (
                    <option key={idx} value={idx}>
                      {part.money_part[0]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-6">
              <div className="input-group">
                <span className="input-group-text">타이틀</span>
                <select
                  className="form-control"
                  id={`money_title_idx-${i}`}
                  value={MONEY[moneyType].money_section[i]?.money_title_val}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setMONEY((prevMONEY) => {
                      let updatedMONEY = { ...prevMONEY };
                      let updatedSection = [...updatedMONEY[moneyType].money_section];
                      updatedSection[i].money_title_val = newTitle;
                      updatedMONEY[moneyType].money_section = updatedSection;
                      return updatedMONEY;
                    });
                  }}
                >
                  {moneyTitleArray[MONEY[moneyType].money_section[i]?.money_part_idx]?.money_title.map((title, idx) => (
                    <option key={idx} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="row d-center">
            <div className="col-6">
              <div className="input-group">
                <span className="input-group-text">금액</span>
                <input
                  type="number"
                  className="form-control"
                  value={MONEY[moneyType]?.money_section[i]?.money_amount}
                  onChange={(e) => {
                    const newAmount = parseInt(e.target.value);
                    setMONEY((prev) => {
                      const updatedMONEY = { ...prev };
                      const updatedSection = [...updatedMONEY[moneyType].money_section];
                      updatedSection[i].money_amount = isNaN(newAmount) ? 0 : newAmount;
                      updatedMONEY[moneyType].money_section = updatedSection;
                      return updatedMONEY;
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="input-group">
                <span className="input-group-text">메모</span>
                <input
                  type="text"
                  className="form-control"
                  value={MONEY[moneyType]?.money_section[i]?.money_content}
                  onChange={(e) => {
                    const newContent = e.target.value;
                    setMONEY((prev) => {
                      const updatedMONEY = { ...prev };
                      const updatedSection = [...updatedMONEY[moneyType].money_section];
                      updatedSection[i].money_content = newContent;
                      return updatedMONEY;
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  };

  // 5-2. table ----------------------------------------------------------------------------------->
  const tableMoneySave = () => {

    const moneyType = planYn === "Y" ? "money_plan" : "money_real";

    return (
      <div>
        <div className="row d-center">
          <div className="col-6">
            <div className="input-group">
              <span className="input-group-text">계획여부</span>
              <select
                id="money_planYn"
                name="money_planYn"
                className="form-select"
                value={planYn}
                onChange={(e) => {
                  setPlanYn(e.target.value);
                }}
              >
                <option value="Y">목표</option>
                <option value="N" selected>실제</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonMoneySave = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary" onClick={flowMoneySave}>
        Save
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
        <div className="row d-center mb-20">
          <div className="col-12">
            <h1 className="mb-3 fw-5">
              <span>{viewMoneyDay()}</span>
            </h1>
          </div>
        </div>
        <div className="row d-center mt-5">
          <div className="col-12">
            {handleTotalCountChange()}
          </div>
        </div>
        <div className="row d-center mt-5 mb-20">
          <div className="col-12">
            {tableMoneySave()}
          </div>
        </div>
        <div className="row d-center">
          <div className="col-12">
            {buttonMoneySave()}
            {buttonRefreshPage()}
          </div>
        </div>
      </div>
    </div>
  );
};

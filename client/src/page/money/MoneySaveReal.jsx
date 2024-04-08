// MoneySaveReal.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/js/useStorage.jsx";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";
import {moneyPartArray, moneyTitleArray} from "./MoneyArray.jsx";
import {BiCaretLeft, BiCaretRight} from "react-icons/bi";

// ------------------------------------------------------------------------------------------------>
export const MoneySaveReal = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_MONEY = process.env.REACT_APP_URL_MONEY;
  const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const location_date = location?.state?.date;
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;
  const STATE = {
    refresh:0,
    toList:"/money/list/real",
    id: "",
    date: ""
  };

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:sectionCount, set:setSectionCount} = useStorage(
    `sectionCount(${PATH})`, 0
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
        money_part_val: "",
        money_title_idx: 0,
        money_title_val: "",
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
        money_part_val: "",
        money_title_idx: 0,
        money_title_val: "",
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
    setStrDur(`${strDate} ~ ${strDate}`);
    setMONEY((prev) => ({
      ...prev,
      work_date: strDur
    }));
  }, [strDate]);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_MONEY}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        money_dur: strDur,
        planYn: "N",
      },
    });

    setSectionCount(response.data.sectionCount ? response.data.sectionCount : 0);
    setMONEY(response.data.result ? response.data.result : MONEY_DEFAULT);

  })()}, [strDur]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_MONEY}/save`, {
      user_id: user_id,
      MONEY: MONEY,
      money_dur: strDur,
      planYn: "N"
    });
    if (response.data === "success") {
      alert("Save a money successfully");
      navParam(STATE.toList);
    }
    else {
      alert(`${response.data}error`);
    }
  };

  // 4. view -------------------------------------------------------------------------------------->
  const viewNode = () => {

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

  // 5. handler ----------------------------------------------------------------------------------->
  const handlerSectionCount = () => {
    return (
      <React.Fragment>
        <div className="row d-center">
          <div className="col-4">
            <input
              type="number"
              value={sectionCount}
              min="0"
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
                if (newCount > sectionCount) {
                  let additionalSections = Array(newCount - sectionCount).fill(defaultSection);
                  let updatedSection = [...MONEY.money_real.money_section, ...additionalSections];
                  setMONEY((prev) => ({
                    ...prev,
                    money_real: {
                      ...prev.money_real,
                      money_section: updatedSection,
                    },
                  }));
                }
                // count 값이 감소했을 때 마지막 섹션부터 제거
                else if (newCount < sectionCount) {
                  let updatedSection = [...MONEY.money_real.money_section];
                  updatedSection = updatedSection.slice(0, newCount);
                  setMONEY((prev) => ({
                    ...prev,
                    money_real: {
                      ...prev.money_real,
                      money_section: updatedSection,
                    },
                  }));
                }
                setSectionCount(newCount);
              }}
            />
          </div>
        </div>
        <div className="row d-center">
          <div className="col-12">
            {Array.from({ length: sectionCount }, (_, i) => tableSection(i))}
          </div>
        </div>
      </React.Fragment>
    );
  };

  // 6. table ------------------------------------------------------------------------------------->
  const tableSection = (i) => {
    return (
      <div key={i} className="mb-20">
        <div className="row d-center">
          <div className="col-6">
            <div className="input-group">
              <span className="input-group-text">파트</span>
              <select
                className="form-control"
                id={`money_part_idx-${i}`}
                value={MONEY.money_real.money_section[i]?.money_part_idx}
                onChange={(e) => {
                  const newIndex = parseInt(e.target.value);
                  setMONEY((prevMONEY) => {
                    let updatedMONEY = { ...prevMONEY };
                    let updatedSection = [...updatedMONEY.money_real.money_section];
                    updatedSection[i] = {
                      ...updatedSection[i],
                      money_part_idx: newIndex,
                      money_part_val: moneyPartArray[newIndex].money_part[0],
                      money_title_idx: 0,
                      money_title_val: moneyTitleArray[newIndex].money_title[0],
                    };
                    updatedMONEY.money_real.money_section = updatedSection;
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
                value={MONEY.money_real.money_section[i]?.money_title_val}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setMONEY((prevMONEY) => {
                    let updatedMONEY = { ...prevMONEY };
                    let updatedSection = [...updatedMONEY.money_real.money_section];
                    updatedSection[i].money_title_val = newTitle;
                    updatedMONEY.money_real.money_section = updatedSection;
                    return updatedMONEY;
                  });
                }}
              >
                {moneyTitleArray[MONEY.money_real.money_section[i]?.money_part_idx]?.money_title.map((title, idx) => (
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
                value={MONEY.money_real?.money_section[i]?.money_amount}
                onChange={(e) => {
                  const newAmount = parseInt(e.target.value);
                  setMONEY((prev) => {
                    let updatedMONEY = { ...prev };
                    let updatedSection = [...updatedMONEY.money_real.money_section];
                    updatedSection[i].money_amount = isNaN(newAmount) ? 0 : newAmount;
                    updatedMONEY.money_real.money_section = updatedSection;
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
                value={MONEY.money_real?.money_section[i]?.money_content}
                onChange={(e) => {
                  const newContent = e.target.value;
                  setMONEY((prev) => {
                    let updatedMONEY = { ...prev };
                    let updatedSection = [...updatedMONEY.money_real.money_section];
                    updatedSection[i].money_content = newContent;
                    return updatedMONEY;
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
  const buttonNode = () => {
    function buttonSave () {
      return (
        <button
          type="button"
          className="btn btn-sm btn-primary me-2"
          onClick={() => {
            flowSave();
          }}
        >
          Save
        </button>
      );
    };
    function buttonReset () {
      return (
        <button
          type="button"
          className="btn btn-sm btn-success me-2"
          onClick={() => {
            navParam(STATE.refresh);
          }}
        >
          Refresh
        </button>
      );
    };
    function buttonList () {
      return (
        <button
          type="button"
          className="btn btn-sm btn-secondary me-2"
          onClick={() => {
            navParam(STATE.toList);
          }}
        >
          List
        </button>
      );
    };
    return (
      <div className="d-inline-flex">
        {buttonSave()}
        {buttonReset()}
        {buttonList()}
      </div>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row mb-20 d-center">
          <div className="col-12">
            <h1>Save (Real)</h1>
          </div>
        </div>
        <div className="row d-center mb-20">
          <div className="col-12">
            {viewNode()}
          </div>
        </div>
        <div className="row d-center mt-5">
          <div className="col-12">
            {handlerSectionCount()}
          </div>
        </div>
        <div className="row d-center">
          <div className="col-12">
            {buttonNode()}
          </div>
        </div>
      </div>
    </div>
  );
};

// MoneySave.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {useDate} from "../../assets/hooks/useDate.jsx";
import axios from "axios";
import moment from "moment-timezone";
import {moneyArray} from "../../assets/data/MoneyArray.jsx";
import {DateNode} from "../../assets/fragments/DateNode.jsx";
import {CalendarNode} from "../../assets/fragments/CalendarNode.jsx";
import {PagingNode} from "../../assets/fragments/PagingNode.jsx";
import {FilterNode} from "../../assets/fragments/FilterNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const MoneySave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_MONEY = process.env.REACT_APP_URL_MONEY;
  const navParam = useNavigate();
  const location = useLocation();
  const location_date = location?.state?.date;
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;
  const STATE = {
    id: "",
    date: "",
    refresh: 0,
    toList:"/money/list"
  };

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:sectionCount, set:setSectionCount} = useStorage(
    `sectionCount(${PATH})`, 0
  );

  // 2-1. useState -------------------------------------------------------------------------------->
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
    money_section: [{
      money_part_idx: 0,
      money_part_val: "",
      money_title_idx: 0,
      money_title_val: "",
      money_amount: 0,
      money_content: "",
    }]
  });
  const [MONEY, setMONEY] = useState({
    _id: "",
    money_number: 0,
    money_date: "",
    money_section: [{
      money_part_idx: 0,
      money_part_val: "",
      money_title_idx: 0,
      money_title_val: "",
      money_amount: 0,
      money_content: "",
    }],
  });

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(MONEY, setMONEY, PATH, location_date, strDate, setStrDate, strDur, setStrDur);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_MONEY}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        money_dur: strDur
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
      money_dur: strDur
    });
    if (response.data === "success") {
      alert("Save successfully");
      STATE.date = strDate;
      navParam(STATE.toList, {
        state: STATE
      });
    }
    else {
      alert(`${response.data}error`);
    }
  };

  // 4. date -------------------------------------------------------------------------------------->
  const dateNode = () => {
    return (
      <DateNode strDate={strDate} setStrDate={setStrDate} type="save" />
    );
  };

  // 5. handler ----------------------------------------------------------------------------------->
  const handlerSectionCount = () => {
    function handlerCount (e) {
      let newCount = parseInt(e, 10);
      let defaultSection = {
        money_part_idx: 0,
        money_part_val: "전체",
        money_title_idx: 0,
        money_title_val: "전체",
        money_amount: 0,
        money_content: ""
      };

      if (newCount > sectionCount) {
        let additionalSections = Array(newCount - sectionCount).fill(defaultSection);
        let updatedSection = [...MONEY.money_section, ...additionalSections];
        setMONEY((prev) => ({
          ...prev,
          money_section: updatedSection,
        }));
      }
      else if (newCount < sectionCount) {
        let updatedSection = [...MONEY.money_section];
        updatedSection = updatedSection.slice(0, newCount);
        setMONEY((prev) => ({
          ...prev,
          money_section: updatedSection,
        }));
      }
      setSectionCount(newCount);
    };
    function inputFragment () {
      return (
        <div className="row d-center">
          <div className="col-4">
            <input
              type="number"
              value={sectionCount}
              min="0"
              className="form-control mb-30"
              onChange={(e) => (
                handlerCount(e.target.value)
              )}
            />
          </div>
        </div>
      );
    };
    return (
      <React.Fragment>
        {inputFragment()}
      </React.Fragment>
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    function tableSection (i) {
      return (
        <div key={i} className="mb-20">
          <div className="row d-center">
            <div className="col-6">
              <div className="input-group">
                <span className="input-group-text">파트</span>
                <select
                  className="form-control"
                  id={`money_part_idx-${i}`}
                  value={MONEY?.money_section[i]?.money_part_idx}
                  onChange={(e) => {
                    const newIndex = parseInt(e.target.value);
                    setMONEY((prev) => {
                      let updatedObject = {...prev};
                      let updatedSection = [...updatedObject.money_section];
                      updatedSection[i] = {
                        ...updatedSection[i],
                        money_part_idx: newIndex,
                        money_part_val: moneyArray[newIndex].money_part,
                        money_title_idx: 0,
                        money_title_val: moneyArray[newIndex].money_title[0],
                      };
                      updatedObject.money_section = updatedSection;
                      return updatedObject;
                    });
                  }}
                >
                  {moneyArray.map((item, idx) => (
                    <option
                      key={idx}
                      value={idx}
                    >
                      {item.money_part}
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
                  value={MONEY?.money_section[i]?.money_title_idx}
              onChange={(e) => {
                const newTitleIdx = parseInt(e.target.value);
                const newTitleVal = moneyArray[MONEY?.money_section[i]?.money_part_idx]?.money_title[newTitleIdx];
                if (newTitleIdx >= 0 && newTitleVal) {
                  setMONEY((prev) => {
                    let updatedObject = { ...prev };
                    let updatedSection = [...updatedObject.money_section];
                    updatedSection[i] = {
                      ...updatedSection[i],
                      money_title_idx: newTitleIdx,
                      money_title_val: newTitleVal,
                    };
                    updatedObject.money_section = updatedSection;
                    return updatedObject;
                  });
                }
              }}
            >
              {moneyArray[MONEY?.money_section[i]?.money_part_idx]?.money_title.map((title, idx) => (
                <option key={idx} value={idx}>
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
                  value={MONEY?.money_section[i]?.money_amount}
                  onChange={(e) => {
                    const newAmount = parseInt(e.target.value, 10);
                    setMONEY((prev) => {
                      let updatedObject = {...prev};
                      let updatedSection = [...updatedObject.money_section];
                      updatedSection[i].money_amount = isNaN(newAmount) ? 0 : newAmount;
                      updatedObject.money_section = updatedSection;
                      return updatedObject;
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
                  value={MONEY?.money_section[i]?.money_content}
                  onChange={(e) => {
                    const newContent = e.target.value;
                    setMONEY((prev) => {
                      let updatedObject = {...prev};
                      let updatedSection = [...updatedObject.money_section];
                      updatedSection[i].money_content = newContent;
                      return updatedObject;
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    };
    function tableFragment () {
      return (
        <div className="row d-center">
          <div className="col-12">
            {Array.from({ length: sectionCount }, (_, i) => tableSection(i))}
          </div>
        </div>
      );
    };
    return (
      <React.Fragment>
        {tableFragment()}
      </React.Fragment>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode calendarOpen={""} setCalendarOpen={""}
        strDate={strDate} setStrDate={setStrDate}
        STATE={STATE} flowSave={flowSave} navParam={navParam}
        type="save"
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row mb-20 d-center">
          <div className="col-12">
            <h1>Save</h1>
          </div>
        </div>
        <div className="row d-center mb-20">
          <div className="col-12">
            {dateNode()}
          </div>
        </div>
        <div className="row d-center">
          <div className="col-12">
            {buttonNode()}
          </div>
        </div>
        <div className="row d-center mt-5">
          <div className="col-12">
            {handlerSectionCount()}
          </div>
        </div>
        <div className="row d-center mt-5">
          <div className="col-12">
            {tableNode()}
          </div>
        </div>
      </div>
    </div>
  );
};

// MoneySave.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {useDate} from "../../../assets/hooks/useDate.jsx";
import {useTime} from "../../../assets/hooks/useTime.jsx";
import axios from "axios";
import {moneyArray} from "../../../assets/data/MoneyArray.jsx";
import {DateNode} from "../../../assets/fragments/DateNode.jsx";
import {ButtonNode} from "../../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const MoneySave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_MONEY = process.env.REACT_APP_URL_MONEY;
  const navParam = useNavigate();
  const location = useLocation();
  const location_date = location?.state?.date;
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:STATE, set:setSTATE} = useStorage(
    `STATE(${PATH})`, {
      id: "",
      date: "",
      refresh: 0,
      toList:"/money/list"
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      strDur: `${location_date} ~ ${location_date}`,
      strStartDt: location_date,
      strEndDt: location_date,
      strDt: location_date,
    }
  );
  const {val:FILTER, set:setFILTER} = useStorage(
    `FILTER(${PATH})`, {
      order: "asc",
      type: "day",
      limit: 5,
      partIdx: 0,
      part: "전체",
      titleIdx: 0,
      title: "전체"
    }
  );
  const {val:PAGING, set:setPAGING} = useStorage(
    `PAGING(${PATH})`, {
      page: 1,
      limit: 5
    }
  );
  const {val:COUNT, set:setCOUNT} = useStorage(
    `COUNT(${PATH})`, {
      totalCnt: 0,
      sectionCnt: 0
    }
  );
  const {val:CALENDAR, set:setCALENDAR} = useStorage(
    `CALENDAR(${PATH})`, {
      calStartOpen: false,
      calEndOpen: false,
      calOpen: false,
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const MONEY_DEFAULT = {
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
  };
  const [MONEY, setMONEY] = useState(MONEY_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(DATE, setDATE, location_date);
  useTime(MONEY, setMONEY, DATE, setDATE, PATH, "real");

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_MONEY}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        money_dur: DATE.strDur
      },
    });
    setMONEY(response.data.result || MONEY_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0
    }));
  })()}, [user_id, DATE.strDur]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_MONEY}/save`, {
      user_id: user_id,
      MONEY: MONEY,
      money_dur: DATE.strDur
    });
    if (response.data === "success") {
      alert("Save successfully");
      STATE.date = DATE.strDt;
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
      <DateNode DATE={DATE} setDATE={setDATE} type={"save"} />
    );
  };

  // 5. handler ----------------------------------------------------------------------------------->
  const handlerSectionCount = () => {
    function handlerCount(e) {
      const newCount = parseInt(e, 10);
      const sectionCount = COUNT.sectionCnt;
      let updatedSections = [...MONEY.money_section];

      if (newCount > sectionCount) {
        // 부족한 섹션 수만큼 기본값 섹션 추가
        let defaultSection = {
          money_part_idx: 0,
          money_part_val: "전체",
          money_title_idx: 0,
          money_title_val: "전체",
          money_amount: 0,
          money_content: ""
        };
        let additionalSections = Array(newCount - sectionCount).fill(defaultSection);
        updatedSections = [...updatedSections, ...additionalSections];
      }
      else if (newCount < sectionCount) {
        // 초과된 섹션 제거
        updatedSections = updatedSections.slice(0, newCount);
      }

      // 불필요한 업데이트 방지
      if (newCount !== sectionCount) {
        setMONEY(prev => ({
          ...prev,
          money_section: updatedSections
        }));
        setCOUNT(prev => ({
          ...prev,
          sectionCnt: newCount
        }));
      }
    };
    function inputFragment () {
      return (
        <div className="row d-center">
          <div className="col-4">
            <input
              type="number"
              value={COUNT.sectionCnt}
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
                      let updated = {...prev};
                      let updatedSection = [...updated.money_section];
                      updatedSection[i] = {
                        ...updatedSection[i],
                        money_part_idx: newIndex,
                        money_part_val: moneyArray[newIndex].money_part,
                        money_title_idx: 0,
                        money_title_val: moneyArray[newIndex].money_title[0],
                      };
                      updated.money_section = updatedSection;
                      return updated;
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
                    let updated = {...prev};
                    let updatedSection = [...updated.money_section];
                    updatedSection[i] = {
                      ...updatedSection[i],
                      money_title_idx: newTitleIdx,
                      money_title_val: newTitleVal,
                    };
                    updated.money_section = updatedSection;
                    return updated;
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
                      let updated = {...prev};
                      let updatedSection = [...updated.money_section];
                      updatedSection[i].money_amount = isNaN(newAmount) ? 0 : newAmount;
                      updated.money_section = updatedSection;
                      return updated;
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
                      let updated = {...prev};
                      let updatedSection = [...updated.money_section];
                      updatedSection[i].money_content = newContent;
                      return updated;
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
            {Array.from({ length: COUNT.sectionCnt }, (_, i) => tableSection(i))}
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
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        STATE={STATE} setSTATE={setSTATE} flowSave={flowSave} navParam={navParam}
        type={"save"}
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

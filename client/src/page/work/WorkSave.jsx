// WorkSave.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {useDateReal} from "../../assets/hooks/useDateReal.jsx";
import TimePicker from "react-time-picker";
import axios from "axios";
import {workPartArray, workTitleArray} from "../../assets/data/WorkArray.jsx";
import {DateNode} from "../../assets/fragments/DateNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const WorkSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_WORK = process.env.REACT_APP_URL_WORK;
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
      toList:"/work/list"
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      strDur: `${location_date} ~ ${location_date}`,
      strStartDt: location_date,
      strEndDt: location_date,
      strDt: location_date
    }
  );
  const {val:CALENDAR, set:setCALENDAR} = useStorage(
    `CALENDAR(${PATH})`, {
      calStartOpen: false,
      calEndOpen: false,
      calOpen: false,
    }
  );
  const {val:COUNT, set:setCOUNT} = useStorage(
    `COUNT(${PATH})`, {
      totalCnt: 0,
      sectionCnt: 0
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [WORK_DEFAULT, setWORK_DEFAULT] = useState({
    _id: "",
    work_number: 0,
    work_date: "",
    work_start: "",
    work_end: "",
    work_time: "",
    work_section: [{
      work_part_idx: 0,
      work_part_val: "",
      work_title_idx: 0,
      work_title_val: "",
      work_set: 0,
      work_rep: 0,
      work_kg: 0,
      work_rest: 0,
    }],
  });
  const [WORK, setWORK] = useState({
    _id: "",
    work_number: 0,
    work_date: "",
    work_start: "",
    work_end: "",
    work_time: "",
    work_section: [{
      work_part_idx: 0,
      work_part_val: "",
      work_title_idx: 0,
      work_title_val: "",
      work_set: 0,
      work_rep: 0,
      work_kg: 0,
      work_rest: 0,
    }],
  });

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDateReal(WORK, setWORK, DATE, setDATE, PATH, location_date);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_WORK}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        work_dur: DATE.strDur
      },
    });

    setWORK(response.data.result ? response.data.result : WORK_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt ? response.data.totalCnt : 0,
    }));

  })()}, [user_id, DATE.strDur]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_WORK}/save`, {
      user_id: user_id,
      WORK: WORK,
      work_dur: DATE.strDur
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
    function handlerCount (e) {
      let newCount = parseInt(e, 10);
      let sectionCount = COUNT.sectionCnt;
      let defaultSection = {
        work_part_idx: 0,
        work_part_val: "전체",
        work_title_idx: 0,
        work_title_val: "전체",
      };

      if (newCount > sectionCount) {
        let additionalSections = Array(newCount - sectionCount).fill(defaultSection);
        let updatedSection = [...WORK.work_section, ...additionalSections];
        setWORK((prev) => ({
          ...prev,
          work_section: updatedSection,
        }));
      }
      else if (newCount < sectionCount) {
        let updatedSection = [...WORK.work_section];
        updatedSection = updatedSection.slice(0, newCount);
        setWORK((prev) => ({
          ...prev,
          work_section: updatedSection,
        }));
      }
      setCOUNT((prev) => ({
        ...prev,
        sectionCnt: newCount,
      }));
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
                  id={`work_part_idx-${i}`}
                  value={WORK.work_section[i]?.work_part_idx}
                  onChange={(e) => {
                    const newIndex = parseInt(e.target.value);
                    setWORK((prev) => {
                      let updated = { ...prev };
                      let updatedSection = [...updated.work_section];
                      updatedSection[i] = {
                        ...updatedSection[i],
                        work_part_idx: newIndex,
                        work_part_val: workPartArray[newIndex].work_part,
                        work_title_idx: 0,
                        work_title_val: workTitleArray[newIndex].work_title[0],
                      };
                      updated.work_section = updatedSection;
                      return updated;
                    });
                  }}
                >
                  {workPartArray.map((part, idx) => (
                    <option key={idx} value={idx}>
                      {part.work_part}
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
                  id={`work_title_idx-${i}`}
                  value={WORK.work_section[i]?.work_title_val}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setWORK((prev) => {
                      let updated = { ...prev };
                      let updatedSection = [...updated.work_section];
                      updatedSection[i].work_title_val = newTitle;
                      updated.work_section = updatedSection;
                      return updated;
                    });
                  }}
                >
                  {workTitleArray[WORK.work_section[i]?.work_part_idx]?.work_title.map((title, idx) => (
                    <option key={idx} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="row d-center">
            <div className="col-3">
              <div className="input-group">
                <span className="input-group-text">세트</span>
                <input
                  type="number"
                  className="form-control"
                  value={WORK?.work_section[i]?.work_set}
                  onChange={(e) => {
                    const newSet = parseInt(e.target.value);
                    setWORK((prev) => {
                      let updated = { ...prev };
                      let updatedSection = [...updated.work_section];
                      updatedSection[i].work_set = isNaN(newSet) ? 0 : newSet;
                      updated.work_section = updatedSection;
                      return updated;
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-3">
              <div className="input-group">
                <span className="input-group-text">횟수</span>
                <input
                  type="number"
                  className="form-control"
                  value={WORK?.work_section[i]?.work_rep}
                  onChange={(e) => {
                    const newCount = parseInt(e.target.value);
                    setWORK((prev) => {
                      let updated = { ...prev };
                      let updatedSection = [...updated.work_section];
                      updatedSection[i].work_rep = isNaN(newCount) ? 0 : newCount;
                      updated.work_section = updatedSection;
                      return updated;
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-3">
              <div className="input-group">
                <span className="input-group-text">무게</span>
                <input
                  type="number"
                  className="form-control"
                  value={WORK?.work_section[i]?.work_kg}
                  onChange={(e) => {
                    const newKg = parseInt(e.target.value);
                    setWORK((prev) => {
                      const updated = { ...prev };
                      const updatedSection = [...updated.work_section];
                      updatedSection[i].work_kg = isNaN(newKg) ? 0 : newKg;
                      updated.work_section = updatedSection;
                      return updated;
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-3">
              <div className="input-group">
                <span className="input-group-text">휴식</span>
                <input
                  type="number"
                  className="form-control"
                  value={WORK?.work_section[i]?.work_rest}
                  onChange={(e) => {
                    const newRest = parseInt(e.target.value);
                    setWORK((prev) => {
                      const updated = { ...prev };
                      const updatedSection = [...updated.work_section];
                      updatedSection[i].work_rest = isNaN(newRest) ? 0 : newRest;
                      updated.work_section = updatedSection;
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
    function tableRemain () {
      return (
        <div>
          <div className="row d-center">
            <div className="col-6">
              <div className="input-group">
                <span className="input-group-text">시작시간</span>
                <TimePicker
                  id="work_start"
                  name="work_start"
                  className="form-control"
                  disableClock={false}
                  clockIcon={null}
                  format="HH:mm"
                  locale="ko"
                  value={WORK?.work_start}
                  onChange={(e) => {
                    setWORK((prev) => ({
                      ...prev,
                      work_start: e ? e.toString() : "",
                    }));
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row d-center mt-3">
            <div className="col-6">
              <div className="input-group">
                <span className="input-group-text">종료시간</span>
                <TimePicker
                  id="work_end"
                  name="work_end"
                  className="form-control"
                  disableClock={false}
                  clockIcon={null}
                  format="HH:mm"
                  locale="ko"
                  value={WORK?.work_end}
                  onChange={(e) => {
                    setWORK((prev) => ({
                      ...prev,
                      work_end: e ? e.toString() : "",
                    }));
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row d-center mt-3">
            <div className="col-6">
              <div className="input-group">
                <span className="input-group-text">운동시간</span>
                <TimePicker
                  id="work_time"
                  name="work_time"
                  className="form-control"
                  disableClock={false}
                  disabled={true}
                  clockIcon={null}
                  format="HH:mm"
                  locale="ko"
                  value={WORK?.work_time}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <React.Fragment>
        {tableFragment()}
        {tableRemain()}
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
        <div className="row d-center mt-5">
          <div className="col-12">
            {handlerSectionCount()}
          </div>
        </div>
        <div className="row d-center mt-5 mb-20">
          <div className="col-12">
            {tableNode()}
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

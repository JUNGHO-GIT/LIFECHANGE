// WorkSave.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/js/useStorage.jsx";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";
import {workPartArray, workTitleArray} from "./WorkArray";
import {BiCaretLeft, BiCaretRight} from "react-icons/bi";

// ------------------------------------------------------------------------------------------------>
export const WorkSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const location_date = location?.state?.date?.toString();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;
  const STATE = {
    refresh:0,
    intoList:"/work/list",
    id: "",
    date: ""
  };

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
  const [WORK_DEFAULT, setWORK_DEFAULT] = useState({
    _id: "",
    work_number: 0,
    work_date: "",
    work_real : {
      work_start: "",
      work_end: "",
      work_time: "",
      work_section: [{
        work_part_idx: 0,
        work_part_val: "",
        work_title_idx: 0,
        work_title_val: "",
        work_set: 0,
        work_count: 0,
        work_kg: 0,
        work_rest: 0,
      }],
    },
    work_plan : {
      work_start: "",
      work_end: "",
      work_time: "",
      work_section: [{
        work_part_idx: 0,
        work_part_val: "",
        work_title_idx: 0,
        work_title_val: "",
        work_set: 0,
        work_count: 0,
        work_kg: 0,
        work_rest: 0,
      }],
    }
  });
  const [WORK, setWORK] = useState({
    _id: "",
    work_number: 0,
    work_date: "",
    work_real : {
      work_start: "",
      work_end: "",
      work_time: "",
      work_section: [{
        work_part_idx: 0,
        work_part_val: "",
        work_title_idx: 0,
        work_title_val: "",
        work_set: 0,
        work_count: 0,
        work_kg: 0,
        work_rest: 0,
      }],
    },
    work_plan : {
      work_start: "",
      work_end: "",
      work_time: "",
      work_section: [{
        work_part_idx: 0,
        work_part_val: "",
        work_title_idx: 0,
        work_title_val: "",
        work_set: 0,
        work_count: 0,
        work_kg: 0,
        work_rest: 0,
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
    setWORK((prev) => ({
      ...prev,
      work_date: strDur
    }));
  }, [strDur]);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_WORK}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        work_dur: strDur,
        planYn: planYn,
      },
    });

    setPlanCount(response.data.planCount ? response.data.planCount : 0);
    setRealCount(response.data.realCount ? response.data.realCount : 0);
    setWORK(response.data.result ? response.data.result : WORK_DEFAULT);

  })()}, [strDur, planYn]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    const workType = planYn === "Y" ? "work_plan" : "work_real";

    const startTime = WORK[workType]?.work_start?.toString();
    const endTime = WORK[workType]?.work_end?.toString();

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

      setWORK((prev) => ({
        ...prev,
        [workType]: {
          ...prev[workType],
          work_time: time,
        },
      }));
    }
  }, [strStartDate, strEndDate]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowWorkSave = async () => {

    const response = await axios.post(`${URL_WORK}/save`, {
      user_id: user_id,
      WORK: WORK,
      work_dur: strDur,
      planYn: planYn
    });
    if (response.data === "success") {
      alert("Save a work successfully");
      navParam(STATE.intoList);
    }
    else if (response.data === "fail") {
      alert("Save a work failed");
      return;
    }
    else {
      alert(`${response.data}error`);
    }
  };

  // 4-1. handler --------------------------------------------------------------------------------->
  const handleTotalCountChange = () => {

    const workType = planYn === "Y" ? "work_plan" : "work_real";
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
                  work_part_idx: 0,
                  work_part_val: "전체",
                  work_title_idx: 0,
                  work_title_val: "전체",
                };
                let newCount = parseInt(e.target.value);

                // count 값이 증가했을 때 새로운 섹션들만 추가
                if (newCount > countType) {
                  let additionalSections = Array(newCount - countType).fill(defaultSection);
                  let updatedSection = [...WORK[workType].work_section, ...additionalSections];
                  setWORK((prev) => ({
                    ...prev,
                    [workType]: {
                      ...prev[workType],
                      work_section: updatedSection,
                    },
                  }));
                }
                // count 값이 감소했을 때 마지막 섹션부터 제거
                else if (newCount < countType) {
                  let updatedSection = [...WORK[workType].work_section];
                  updatedSection = updatedSection.slice(0, newCount);
                  setWORK((prev) => ({
                    ...prev,
                    [workType]: {
                      ...prev[workType],
                      work_section: updatedSection,
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
            {Array.from({ length: countType }, (_, i) => tableWorkSection(i))}
          </div>
        </div>
      </div>
    );
  };

  // 4. view -------------------------------------------------------------------------------------->
  const viewWorkDay = () => {

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
  const tableWorkSection = (i) => {

    const workType = planYn === "Y" ? "work_plan" : "work_real";

    return (
      <React.Fragment>
        <div key={i} className="mb-20">
          <div className="row d-center">
            <div className="col-6">
              <div className="input-group">
                <span className="input-group-text">파트</span>
                <select
                  className="form-control"
                  id={`work_part_idx-${i}`}
                  value={WORK[workType].work_section[i]?.work_part_idx}
                  onChange={(e) => {
                    const newIndex = parseInt(e.target.value);
                    setWORK((prevWORK) => {
                      let updatedWORK = { ...prevWORK };
                      let updatedSection = [...updatedWORK[workType].work_section];
                      updatedSection[i] = {
                        ...updatedSection[i],
                        work_part_idx: newIndex,
                        work_part_val: workPartArray[newIndex].work_part[0],
                        work_title_idx: 0,
                        work_title_val: workTitleArray[newIndex].work_title[0],
                      };
                      updatedWORK[workType].work_section = updatedSection;
                      return updatedWORK;
                    });
                  }}
                >
                  {workPartArray.map((part, idx) => (
                    <option key={idx} value={idx}>
                      {part.work_part[0]}
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
                  value={WORK[workType].work_section[i]?.work_title_val}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setWORK((prevWORK) => {
                      let updatedWORK = { ...prevWORK };
                      let updatedSection = [...updatedWORK[workType].work_section];
                      updatedSection[i].work_title_val = newTitle;
                      updatedWORK[workType].work_section = updatedSection;
                      return updatedWORK;
                    });
                  }}
                >
                  {workTitleArray[WORK[workType].work_section[i]?.work_part_idx]?.work_title.map((title, idx) => (
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
                  value={WORK[workType]?.work_section[i]?.work_set}
                  onChange={(e) => {
                    const newSet = parseInt(e.target.value);
                    setWORK((prev) => {
                      const updatedWORK = { ...prev };
                      const updatedSection = [...updatedWORK[workType].work_section];
                      updatedSection[i].work_set = isNaN(newSet) ? 0 : newSet;
                      updatedWORK[workType].work_section = updatedSection;
                      return updatedWORK;
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
                  value={WORK[workType]?.work_section[i]?.work_count}
                  onChange={(e) => {
                    const newCount = parseInt(e.target.value);
                    setWORK((prev) => {
                      const updatedWORK = { ...prev };
                      const updatedSection = [...updatedWORK[workType].work_section];
                      updatedSection[i].work_count = isNaN(newCount) ? 0 : newCount;
                      updatedWORK[workType].work_section = updatedSection;
                      return updatedWORK;
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
                  value={WORK[workType]?.work_section[i]?.work_kg}
                  onChange={(e) => {
                    const newKg = parseInt(e.target.value);
                    setWORK((prev) => {
                      const updatedWORK = { ...prev };
                      const updatedSection = [...updatedWORK[workType].work_section];
                      updatedSection[i].work_kg = isNaN(newKg) ? 0 : newKg;
                      updatedWORK[workType].work_section = updatedSection;
                      return updatedWORK;
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
                  value={WORK[workType]?.work_section[i]?.work_rest}
                  onChange={(e) => {
                    const newRest = parseInt(e.target.value);
                    setWORK((prev) => {
                      const updatedWORK = { ...prev };
                      const updatedSection = [...updatedWORK[workType].work_section];
                      updatedSection[i].work_rest = isNaN(newRest) ? 0 : newRest;
                      updatedWORK[workType].work_section = updatedSection;
                      return updatedWORK;
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
  const tableWorkSave = () => {

    const workType = planYn === "Y" ? "work_plan" : "work_real";

    return (
      <div>
        <div className="row d-center">
          <div className="col-6">
            <div className="input-group">
              <span className="input-group-text">계획여부</span>
              <select
                id="work_planYn"
                name="work_planYn"
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
                value={WORK[workType]?.work_start}
                onChange={(e) => {
                  setStrStartDate(e);
                  setWORK((prev) => ({
                    ...prev,
                    [workType]: {
                      ...prev[workType],
                      work_start: e,
                    },
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
                value={WORK[workType]?.work_end}
                onChange={(e) => {
                  setStrEndDate(e);
                  setWORK((prev) => ({
                    ...prev,
                    [workType]: {
                      ...prev[workType],
                      work_end: e,
                    },
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
                value={WORK[workType]?.work_time}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonWorkSave = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary" onClick={flowWorkSave}>
        Save
      </button>
    );
  };
  const buttonRefreshPage = () => {
    return (
      <button type="button" className="btn btn-sm btn-success ms-2" onClick={() => {
        navParam(STATE.refresh);
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
              <span>{viewWorkDay()}</span>
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
            {tableWorkSave()}
          </div>
        </div>
        <div className="row d-center">
          <div className="col-12">
            {buttonWorkSave()}
            {buttonRefreshPage()}
          </div>
        </div>
      </div>
    </div>
  );
};

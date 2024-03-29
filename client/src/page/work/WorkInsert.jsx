// WorkInsert.jsx

import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";
import {workPartArray, workTitleArray} from "./WorkArray";
import {useStorage} from "../../assets/js/useStorage.jsx";
import {useDeveloperMode} from "../../assets/js/useDeveloperMode.jsx";
import {BiCaretLeft, BiCaretRight} from "react-icons/bi";

// ------------------------------------------------------------------------------------------------>
export const WorkInsert = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  const navParam = useNavigate();
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:workDay, setVal:setWorkDay} = useStorage (
    "workDay", new Date(koreanDate)
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [workCount, setWorkCount] = useState(1);
  const [planYn, setPlanYn] = useState("N");
  const [WORK_DEFAULT] = useState({
    user_id: user_id,
    work_day: "",
    work_planYn: "N",
    work_start: "00:00",
    work_end: "00:00",
    work_time: "00:00",
    work_section: [{
      work_part_idx: 0,
      work_part_val: "전체",
      work_title_idx: 0,
      work_title_val: "전체",
      work_set: 0,
      work_count: 0,
      work_kg: 0,
      work_rest: 0,
    }],
  });
  const [section, setSection] = useState({
    work_part_idx: 0,
    work_part_val: "전체",
    work_title_idx: 0,
    work_title_val: "전체",
    work_set: 0,
    work_count: 0,
    work_kg: 0,
    work_rest: 0,
  });
  const [WORK_REAL, setWORK_REAL] = useState(WORK_DEFAULT);
  const [WORK_PLAN, setWORK_PLAN] = useState(WORK_DEFAULT);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    // 1. real
    const responseReal = await axios.get(`${URL_WORK}/work/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        work_day: koreanDate,
        planYn: "N",
      },
    });

    // 2. plan
    const responsePlan = await axios.get(`${URL_WORK}/work/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        work_day: koreanDate,
        planYn: "Y",
      },
    });

    // 3. set
    responsePlan.data.result.length > 0
      ? setWORK_PLAN(responsePlan.data.result)
      : setWORK_PLAN(WORK_DEFAULT);
    log("WORK_PLAN : " + JSON.stringify(WORK_PLAN));

    responseReal.data.result.length > 0
      ? setWORK_REAL(responseReal.data.result)
      : setWORK_REAL(WORK_DEFAULT);
    log("WORK_REAL : " + JSON.stringify(WORK_REAL));

  })()}, [planYn]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    const work = planYn === "N" ? WORK_REAL : WORK_PLAN;
    const setWork = planYn === "N" ? setWORK_REAL : setWORK_PLAN;

    setWork({
      ...work,
      work_day: moment(workDay).format("YYYY-MM-DD").toString(),
    });
  }, [workDay]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    const work = planYn === "N" ? WORK_REAL : WORK_PLAN;
    const setWork = planYn === "N" ? setWORK_REAL : setWORK_PLAN;

    if (work.work_start && work.work_end) {
      const startDate = new Date(`${koreanDate}T${work.work_start}:00Z`);
      const endDate = new Date(`${koreanDate}T${work.work_end}:00Z`);

      if (endDate < startDate) {
        endDate.setDate(endDate.getDate() + 1);
      }

      const diff = endDate.getTime() - startDate.getTime();
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const time = `${hours.toString().padStart(2,"0")}:${minutes.toString().padStart(2, "0")}`;

      setWork({
        ...work,
        work_time: time
      });
    }
  }, [WORK_REAL.work_start, WORK_REAL.work_end, WORK_PLAN.work_start, WORK_PLAN.work_end]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowWorkInsert = async () => {
    const work = planYn === "N" ? WORK_REAL : WORK_PLAN;
    const response = await axios.post (`${URL_WORK}/workInsert`, {
      user_id : user_id,
      WORK: work,
      planYn : planYn,
    });
    if (response.data === "success") {
      alert("Insert a work successfully");
      navParam("/work/list");
    }
    else if (response.data === "fail") {
      alert("Insert a work failed");
      return;
    }
    else {
      alert(`${response.data}error`);
    }
    log("WORK : " + JSON.stringify(work));
  };

  // 4-1. handler --------------------------------------------------------------------------------->
  const handleWorkCountChange = () => {

    const work = planYn === "N" ? WORK_REAL : WORK_PLAN;
    const setWork = planYn === "N" ? setWORK_REAL : setWORK_PLAN;

    return (
      <div>
        <div className="row d-center">
          <div className="col-4">
            <input
              type="number"
              value={workCount}
              min="1"
              className="form-control mb-30"
              onChange={(e) => {
                const newCount = parseInt(e.target.value, 10);
                setWorkCount(newCount);
                setWork((prev) => {
                  let sections = [...prev.work_section];
                  // count 값이 증가했을 때 새로운 섹션들만 추가
                  if (newCount > prev.work_section.length) {
                    (prev.work_section).forEach((_, i) => {
                      sections.push(section);
                    });
                  }
                  // count 값이 감소했을 때 마지막 섹션부터 제거
                  else if (newCount < prev.work_section.length) {
                    sections = sections.slice(0, newCount);
                  }
                  return {
                    ...prev, work_section: sections
                  };
                });
              }}
            />
          </div>
        </div>
        <div className="row d-center">
          <div className="col-12">
            {Array.from({ length: workCount }, (_, i) => tableWorkSection(i))}
          </div>
        </div>
      </div>
    );
  };

  // 4. view -------------------------------------------------------------------------------------->
  const viewWorkDay = () => {
    const calcDate = (days) => {
      setWorkDay((prevDate) => {
        const newDate = prevDate ? new Date(prevDate) : new Date();
        newDate.setDate(newDate.getDate() + days);
        return newDate;
      });
    };
    return (
      <div className="d-inline-flex">
        <div onClick={() => calcDate(-1)}>
          <BiCaretLeft className="me-10 mt-10 fs-20 pointer" />
        </div>
        <DatePicker
          dateFormat="yyyy-MM-dd"
          popperPlacement="bottom"
          selected={workDay}
          onChange={(date) => {
            setWorkDay(date);
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

    const work = planYn === "N" ? WORK_REAL : WORK_PLAN;
    const setWork = planYn === "N" ? setWORK_REAL : setWORK_PLAN;

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
                  onChange={(e) => {
                    const newIndex = parseInt(e.target.value);
                    setSection((prev) => {
                      let updatedSection = [...prev];
                      updatedSection[i] = {
                        ...updatedSection[i],
                        work_part_idx: newIndex,
                        work_part_val: workPartArray[newIndex].work_part[0],
                        work_title_idx: 0,
                        work_title_val: workTitleArray[newIndex].work_title[0],
                      };
                      return updatedSection;
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
                  onChange={(e) => {
                    let newTitle = e.target.value;
                    setSection((prev) => {
                      let updatedSection = [...prev];
                      updatedSection[i].work_title_val = newTitle;
                      return updatedSection;
                    });
                  }}
                >
                  {workTitleArray[work.work_section[i]?.work_part_idx]?.work_title.map((title, idx) => (
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
                  value={
                    planYn === "Y"
                    ? WORK_PLAN.work_section[i].work_set
                    : WORK_REAL.work_section[i].work_set
                  }
                  onChange={(e) => {
                    setWork((prev) => {
                      const updatedSection = [...prev.work_section];
                      updatedSection[i].work_set = parseInt(e.target.value);
                      return { ...prev, work_section: updatedSection };
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
                  value={
                    planYn === "Y"
                    ? WORK_PLAN.work_section[i].work_count
                    : WORK_REAL.work_section[i].work_count
                  }
                  onChange={(e) => {
                    setWork((prev) => {
                      const updatedSection = [...prev.work_section];
                      updatedSection[i].work_count = parseInt(e.target.value);
                      return { ...prev, work_section: updatedSection };
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
                  value={
                    planYn === "Y"
                    ? WORK_PLAN.work_section[i].work_kg
                    : WORK_REAL.work_section[i].work_kg
                  }
                  onChange={(e) => {
                    setWork((prev) => {
                      const updatedSection = [...prev.work_section];
                      updatedSection[i].work_kg = parseInt(e.target.value);
                      return { ...prev, work_section: updatedSection };
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
                  value={
                    planYn === "Y"
                    ? WORK_PLAN.work_section[i].work_rest
                    : WORK_REAL.work_section[i].work_rest
                  }
                  onChange={(e) => {
                    setWork((prev) => {
                      const updatedSection = [...prev.work_section];
                      updatedSection[i].work_rest = parseInt(e.target.value);
                      return { ...prev, work_section: updatedSection };
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
  const tableWorkInsert = () => {

    const work = planYn === "N" ? WORK_REAL : WORK_PLAN;
    const setWork = planYn === "N" ? setWORK_REAL : setWORK_PLAN;

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
                value={work.work_planYn}
                onChange={(e) => {
                  setPlanYn(e.target.value);
                }}
              >
                <option value="Y">계획</option>
                <option value="N" selected>미계획</option>
              </select>
            </div>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-6">
            <div className="input-group">
              <span className="input-group-text">Start</span>
              <TimePicker
                id="work_start"
                name="work_start"
                className="form-control"
                value={planYn === "Y" ? WORK_PLAN.work_start : WORK_REAL.work_start}
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                onChange={(e) => {
                  setWork({
                    ...work,
                    work_start: String(e)
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-6">
            <div className="input-group">
              <span className="input-group-text">End</span>
              <TimePicker
                id="work_end"
                name="work_end"
                className="form-control"
                value={planYn === "Y" ? WORK_PLAN.work_end : WORK_REAL.work_end}
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                onChange={(e) => {
                  setWork({
                    ...work,
                    work_end: String(e)
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-6">
            <div className="input-group">
              <span className="input-group-text">Time</span>
              <TimePicker
                id="work_time"
                name="work_time"
                className="form-control"
                value={planYn === "Y" ? WORK_PLAN.work_time : WORK_REAL.work_time}
                disableClock={true}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonWorkInsert = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary" onClick={flowWorkInsert}>
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
        <div className="row d-center mt-5 mb-5">
          <div className="col-12">
            <h1 className="mb-3 fw-5">
              <span>{viewWorkDay()}</span>
            </h1>
          </div>
        </div>
        <div className="row d-center mt-5">
          <div className="col-12">
            {handleWorkCountChange()}
          </div>
        </div>
        <div className="row d-center mt-5 mb-20">
          <div className="col-12">
            {tableWorkInsert()}
            <br />
            {buttonWorkInsert()}
            {buttonRefreshPage()}
          </div>
        </div>
      </div>
    </div>
  );
};

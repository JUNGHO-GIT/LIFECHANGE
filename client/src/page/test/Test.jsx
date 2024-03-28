// Test.jsx

import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";
import {workPartArray, workTitleArray} from "../work/WorkArray";
import {useStorage} from "../../assets/js/useStorage.jsx";
import {useDeveloperMode} from "../../assets/js/useDeveloperMode.jsx";

// ------------------------------------------------------------------------------------------------>
export const Test = () => {

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
  const [WORK, setWORK] = useState({
    user_id: user_id,
    work_day: koreanDate,
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

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const responseDetail = await axios.get(`${URL_WORK}/work/detail`, {
      params: {
        user_id: user_id,
        work_day: koreanDate,
        _id: "",
      },
    });
    if (responseDetail.data.workDetail) {
      setWorkCount(
        responseDetail.data.workDetail.work_section.length > workCount
        ? responseDetail.data.workDetail.work_section.length
        : workCount
      );
      setWORK(
        responseDetail.data.workDetail
        ? responseDetail.data.workDetail
        : WORK
      );
    };
    log("WORK : " + JSON.stringify(responseDetail.data.workDetail));
  })()}, []);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setWORK ({
      ...WORK,
      workDay: moment(workDay).format("YYYY-MM-DD")
    });
  }, [workDay]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (!WORK.work_start || !WORK.work_end) {
      setWORK((prevWork) => ({
        ...prevWork,
        work_time: "00:00",
      }));
    }
    else if (WORK.work_start === "00:00" && WORK.work_end === "00:00") {
      setWORK((prevWork) => ({
        ...prevWork,
        work_time: "00:00",
      }));
    }
    else {
      const startDate = new Date(`${WORK.work_day}T${WORK.work_start}:00Z`);
      const endDate = new Date(`${WORK.work_day}T${WORK.work_end}:00Z`);

      if (endDate < startDate) {
        endDate.setDate(endDate.getDate() + 1);
      }

      const diff = endDate.getTime() - startDate.getTime();
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);

      setWORK((prevWork) => ({
        ...prevWork,
        work_time: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
      }));
    }
  }, [WORK.work_start, WORK.work_end, WORK.work_day]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowTest = async () => {
    try {
      const response = await axios.post (`${URL_WORK}/work/insert`, {
        user_id : user_id,
        WORK : WORK,
      });
      log("WORK : " + JSON.stringify(response.data));

      if (response.data === "success") {
        alert("Insert a work successfully");
        navParam("/work/list");
      }
      else {
        alert("Insert a work failure");
      }
    }
    catch (e) {
      alert(`Error inserting a work data: ${e.message}`);
    }
  };

  // 4-1. handler --------------------------------------------------------------------------------->
  const handleWorkCountChange = () => {
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
                const newCount = parseInt(e.target.value);
                setWorkCount(newCount);
                setWORK((prev) => {
                  let sections = [...prev.work_section];
                  // count 값이 증가했을 때 새로운 섹션들만 추가
                  if (newCount > prev.work_section.length) {
                    for (let i = prev.work_section.length; i < newCount; i++) {
                      sections.push({
                        work_part_idx: 0,
                        work_part_val: "전체",
                        work_title_idx: 0,
                        work_title_val: "전체",
                        work_set: 0,
                        work_count: 0,
                        work_kg: 0,
                        work_rest: 0,
                      });
                    }
                  }
                  // count 값이 감소했을 때 마지막 섹션부터 제거
                  else if (newCount < prev.work_section.length) {
                    sections = sections.slice(0, newCount);
                  }
                  else {
                    return prev;
                  }
                  return { ...prev, work_section: sections };
                });
              }}
            />
          </div>
        </div>
        <div className="row d-center">
          <div className="col-12">
            {Array.from({length: workCount}, (_, i) => tableWorkSection(i))}
          </div>
        </div>
      </div>
    );
  };

  // 4-2. handler --------------------------------------------------------------------------------->
  const handleWorkPartChange = (i, e) => {
    setWORK((prev) => {
      const updatedSection = [...prev.work_section];
      updatedSection[i].work_part_idx = parseInt(e.target.value);
      updatedSection[i].work_part_val = workPartArray[parseInt(e.target.value)].work_part[0];
      return { ...prev, work_section: updatedSection };
    });
  }

  // 4-3. handler --------------------------------------------------------------------------------->
  const handleWorkTitleChange = (i, e) => {
    setWORK((prev) => {
      const updatedSection = [...prev.work_section];
      updatedSection[i].work_title_val = e.target.value;
      return { ...prev, work_section: updatedSection };
    });
  }

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
        <div className="black mt-4 me-5 pointer" onClick={() => calcDate(-1)}>
          &#8592;
        </div>
        <DatePicker
          dateFormat="yyyy-MM-dd"
          popperPlacement="bottom"
          selected={workDay}
          onChange={(date) => {
            setWorkDay(date);
          }}
        />
        <div className="black mt-4 ms-5 pointer" onClick={() => calcDate(1)}>
          &#8594;
        </div>
      </div>
    );
  };

  // 5-1. table ----------------------------------------------------------------------------------->
  const tableTest = () => {
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
                value={WORK.work_planYn}
                onChange={(e) => {
                  setWORK({ ...WORK, work_planYn: e.target.value });
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
                value={WORK?.work_start}
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                onChange={(e) => {
                  setWORK({ ...WORK, work_start: e });
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
                value={WORK?.work_end}
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                onChange={(e) => {
                  setWORK({ ...WORK, work_end : e });
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
                value={WORK?.work_time}
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

  // 5-2. table ----------------------------------------------------------------------------------->
  const tableWorkSection = (i) => {
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
                onChange={(e) => handleWorkPartChange(i, e)}
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
                value={WORK.work_section[i]?.work_title_val}
                onChange={(e) => handleWorkTitleChange(i, e)}
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
                value={WORK.work_section[i]?.work_set}
                onChange={(e) => {
                  setWORK((prev) => {
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
                value={WORK.work_section[i]?.work_count}
                onChange={(e) => {
                  setWORK((prev) => {
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
                value={WORK.work_section[i]?.work_kg}
                onChange={(e) => {
                  setWORK((prev) => {
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
                value={WORK.work_section[i]?.work_rest}
                onChange={(e) => {
                  setWORK((prev) => {
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
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonTest = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary" onClick={flowTest}>
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
            {tableTest()}
            <br />
            {buttonTest()}
            {buttonRefreshPage()}
          </div>
        </div>
      </div>
    </div>
  );
};

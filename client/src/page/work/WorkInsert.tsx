// WorkInsert.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";
import { workPartArray, workTitleArray } from "../work/WorkArray";

// 1. main ---------------------------------------------------------------------------------------->
export const WorkInsert = () => {
  // title
  const TITLE = "Work Insert";
  // url
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  // date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");
  // useState
  const [WORK, setWORK] = useState<any>({});
  const [work_day, setWork_day] = useState<string>(koreanDate);
  const [workAmount, setWorkAmount] = useState<number>(1);
  const [workSection, setWorkSection] = useState<any[]>([{
    work_part_idx: 0,
    work_part_val: "전체",
    work_title_idx: 0,
    work_title_val: "전체",
    work_set: 0,
    work_count: 0,
    work_kg: 0,
    work_rest: 0,
  }]);

  // 2. useEffect --------------------------------------------------------------------------------->
  useEffect(() => {

    // 전체 WORK 콘솔
    console.log(WORK);
  }, [WORK]);

  // 2-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setWORK ({
      ...WORK,
      work_day : work_day,
      workSection : workSection,
    });
  }, [work_day, workSection]);

  // 2-2. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (WORK.work_start && WORK.work_end) {
      const work_start = moment(WORK.work_start, "HH:mm");
      const work_end = moment(WORK.work_end, "HH:mm");
      let work_time_minutes = work_end.diff(work_start, "minutes");

      if (work_time_minutes < 0) {
        work_time_minutes = Math.abs(work_time_minutes);
      }

      const hours = Math.floor(work_time_minutes / 60);
      const minutes = work_time_minutes % 60;

      const work_time_formatted = `${String(hours).padStart(2, "0")} : ${String (
        minutes
      ).padStart(2, "0")}`;

      setWORK({ ...WORK, work_time: work_time_formatted });
    }
  }, [WORK.work_start, WORK.work_end]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowWorkInsert = async () => {
    for (let i = 0; i < workAmount; i++) {
      if (user_id === undefined || user_id === "") {
        alert("Input a ID");
        return;
      }
      if (work_day === undefined || work_day === "") {
        alert("Input a Day");
        return;
      }
      if (WORK.work_start === undefined || WORK.work_start === "") {
        alert("Input a Start");
        return;
      }
      if (WORK.work_end === undefined || WORK.work_end === "") {
        alert("Input a End");
        return;
      }
      if (WORK.work_time === undefined || WORK.work_time === "") {
        alert("Input a Time");
        return;
      }
      if (workSection[i].work_set === 0) {
        alert("Input a Set");
        return;
      }
      if (workSection[i].work_count === 0) {
        alert("Input a Count");
        return;
      }
      if (workSection[i].work_kg === 0) {
        alert("Input a Kg");
        return;
      }
      if (workSection[i].work_rest === 0) {
        alert("Input a Rest");
        return;
      }
    }
    const response = await axios.post(`${URL_WORK}/workInsert`, {
      user_id : user_id,
      WORK : WORK,
    });
    if (response.data === "success") {
      alert("Insert a work successfully");
      navParam("/workListDay");
    }
    else if (response.data === "fail") {
      alert("Insert a work failure");
    }
    else {
      throw new Error("Server responded with an error");
    }
  };

  // 4-1. handler --------------------------------------------------------------------------------->
  const handleWorkPartChange = (i: number, e: any) => {
    const newIndex = parseInt(e.target.value);

    setWorkSection((prev: any[]) => {
      const updatedSection = [...prev];
      updatedSection[i] = {
        ...updatedSection[i],
        work_part_idx: newIndex,
        work_part_val: workPartArray[newIndex].workPart[0],
        work_title_idx: 0,
        work_title_val: workTitleArray[newIndex].workTitle[0],
      };
      return updatedSection;
    });
  };

  // 4-2. handler --------------------------------------------------------------------------------->
  const handleWorkTitleChange = (i: number, e: any) => {
    const newTitle = e.target.value;

    setWorkSection((prev: any[]) => {
      const updatedSection = [...prev];
      updatedSection[i].work_title_val = newTitle;
      return updatedSection;
    });
  };

  // 4-3. handler --------------------------------------------------------------------------------->
  const handleWorkAmountChange = () => {
    return (
      <div>
        <input type="number" value={workAmount} onChange={(e) => {
          const defaultSection = {
            work_part_idx: 0,
            work_part_val: "전체",
            work_title_idx: 0,
            work_title_val: "전체",
            work_set: 0,
            work_count: 0,
            work_kg: 0,
            work_rest: 0,
          };
          const newAmount = parseInt(e.target.value);

          // amount 값이 증가했을 때 새로운 섹션들만 추가
          if (newAmount > workAmount) {
            const additionalSections = Array(newAmount - workAmount).fill(defaultSection);
            setWorkSection(prev => [...prev, ...additionalSections]);
          }
          // amount 값이 감소했을 때 마지막 섹션부터 제거
          else if (newAmount < workAmount) {
            setWorkSection(prev => prev.slice(0, newAmount));
          }
          // workAmount 값 업데이트
          setWorkAmount(newAmount);
        }}/>
        {Array.from({ length: workAmount }, (_, i) => tableWorkSection(i))}
      </div>
    );
  };

  // 4. logic ------------------------------------------------------------------------------------->
  const viewWorkDay = () => {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        popperPlacement="bottom"
        selected={new Date(work_day)}
        onChange={(date:any) => {
          setWork_day(moment(date).format("YYYY-MM-DD").toString());
        }}
      />
    );
  };

  // 5-1. table ----------------------------------------------------------------------------------->
  const tableWorkSection = (i: number) => {

    const updateWorkArray
    = workSection[i] && workTitleArray[workSection[i].work_part_idx]
    ? workTitleArray[workSection[i].work_part_idx]?.workTitle
    : [];

    // -------------------------------------------------------------------------------------------->
    return (
      <div key={i}>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">운동파트</span>
              <select
                className="form-control"
                id={`work_part_idx-${i}`}
                onChange={(e) => handleWorkPartChange(i, e)}>
                {workPartArray.flatMap((key, index) => (
                  <option key={index} value={index}>
                    {key.workPart[0]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">운동종목</span>
              <select
                className="form-control"
                id={`work_title_val-${i}`}
                onChange={(e) => handleWorkTitleChange(i, e)}>
                {updateWorkArray.flatMap((title, index) => (
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
            <div className="input-group mb-3">
              <span className="input-group-text">Set</span>
              <input
                type="number"
                min="0"
                className="form-control"
                id={`work_set-${i}`}
                placeholder="Set"
                value={workSection[i]?.work_set}
                onChange={(e) => {
                  setWorkSection((prev: any[]) => {
                    const updatedSection = [...prev];
                    updatedSection[i].work_set = parseInt(e.target.value);
                    return updatedSection;
                  });
                }}
              />
            </div>
          </div>
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">Count</span>
              <input
                type="number"
                min="0"
                className="form-control"
                id={`work_count-${i}`}
                placeholder="Count"
                value={workSection[i]?.work_count}
                onChange={(e) => {
                  setWorkSection((prev: any[]) => {
                    const updatedSection = [...prev];
                    updatedSection[i].work_count = parseInt(e.target.value);
                    return updatedSection;
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">Kg</span>
              <input
                type="number"
                min="0"
                className="form-control"
                id={`work_kg-${i}`}
                placeholder="Kg"
                value={workSection[i]?.work_kg}
                onChange={(e) => {
                  setWorkSection((prev: any[]) => {
                    const updatedSection = [...prev];
                    updatedSection[i].work_kg = parseInt(e.target.value);
                    return updatedSection;
                  });
                }}
              />
            </div>
          </div>
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">Rest</span>
              <input
                type="number"
                min="0"
                className="form-control"
                id={`work_rest-${i}`}
                placeholder="Rest"
                value={workSection[i]?.work_rest}
                onChange={(e) => {
                  setWorkSection((prev: any[]) => {
                    const updatedSection = [...prev];
                    updatedSection[i].work_rest = parseInt(e.target.value);
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
  const tableWorkInsert = () => {
    return (
      <div>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">ID</span>
              <input
                type="text"
                className="form-control"
                id="user_id"
                name="user_id"
                placeholder="ID"
                value={user_id ? user_id : ""}
                onChange={(e) => {
                  setWORK({ ...WORK, user_id: e.target.value });
                }}
                readOnly
              />
            </div>
          </div>
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">Day</span>
              <input
                readOnly
                type="text"
                className="form-control"
                id="work_day"
                name="work_day"
                placeholder="Day"
                value={WORK?.work_day}
                onChange={(e) => {
                  setWork_day(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        {handleWorkAmountChange()}
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">Start</span>
              <TimePicker
                id="work_start"
                name="work_start"
                value={WORK?.work_start}
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                onChange={(e) => {
                  setWORK({ ...WORK, work_start : e });
                }}
              />
            </div>
          </div>
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">End</span>
              <TimePicker
                id="work_end"
                name="work_end"
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
          <div className="col-10">
            <div className="input-group mb-3">
              <span className="input-group-text">Time</span>
              <input
                readOnly
                type="text"
                className="form-control"
                id="work_time"
                name="work_time"
                placeholder="Time"
                value={WORK.work_time ? WORK.work_time : ""}
                onChange={(e) => {
                  setWORK({ ...WORK, work_time : e.target.value });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonWorkInsert = () => {
    return (
      <button type="button" className="btn btn-primary" onClick={flowWorkInsert}>
        Insert
      </button>
    );
  };
  const buttonRefreshPage = () => {
    return (
      <button type="button" className="btn btn-success ms-2" onClick={() => {
        window.location.reload();
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
          <h1 className="mb-3 fw-9">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-5">
            <span className="ms-4">{viewWorkDay()}</span>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-10">
          <form className="form-inline">
            {tableWorkInsert()}
            <br />
            {buttonWorkInsert()}
            {buttonRefreshPage()}
          </form>
        </div>
      </div>
    </div>
  );
};

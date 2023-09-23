// WorkInsert.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";
import { workArray2 } from "./WorkArray";

// 1. main ---------------------------------------------------------------------------------------->
export const WorkInsert = () => {
  // title
  const TITLE = "Work InsertTT";
  // url
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  // date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  const workArray = workArray2;
  // val
  const user_id = window.sessionStorage.getItem("user_id");
  // useState
  const [workAmount, setWorkAmount] = useState<number>(1);
  const [workSection, setWorkSection] = useState<any>({});
  const [work_day, setWork_day] = useState(koreanDate);
  const [work_part, setWork_part] = useState("전체");
  const [work_title, setWork_title] = useState("전체");
  const [selectNumber, setSelectNumber] = useState(0);
  const [WORK, setWORK] = useState<any>({});

  // 2-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setWORK({
      ...WORK,
      work_day : work_day,
      workSection : {
        ...workSection,
        work_part : work_part,
        work_title : work_title
      }
    });
  }, [work_day, work_part, work_title, workSection]);

  // 2-2. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    let workPartAll = [];
    let resultPart;

    let workTitleAll = [];
    let resultTitle;

    Object.values(workArray).flatMap((value, index) => {
      if (work_part == "전체 ") {
        if (
          work_part == "전체" &&
          work_title == "전체"
        ) {
          workPartAll.push(value.workPart[0]);
          resultPart = workPartAll.join(",").slice(3);
          setWork_part(resultPart);

          workTitleAll.push(value.workTitle);
          resultTitle = workTitleAll.join(",").slice(3);
          setWork_title(resultTitle);
        }
      }
      else if (work_part != "전체") {
        if (
          work_part == workArray[index].workPart &&
          work_title == "전체"
        ) {
          workTitleAll.push(workArray[index].workTitle);
          resultTitle = workTitleAll.join(",").slice(3);
          setWork_title(resultTitle);
        }
        if (
          work_part == workArray[index].workPart &&
          work_title != "전체"
        ) {
          setSelectNumber(index);
        }
      }
    })
  }, [work_part, work_title]);

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

      const work_time_formatted = `${String(hours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}`;

      setWORK({ ...WORK, work_time: work_time_formatted });
    }
  }, [WORK.work_start, WORK.work_end]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowWorkInsert = async () => {
    const response = await axios.post(`${URL_WORK}/workInsert`, {
      user_id: user_id,
      WORK: WORK,
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

  // 4. logic ------------------------------------------------------------------------------------->
  const viewWorkDay = () => {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        popperPlacement="bottom"
        selected={new Date(work_day)}
        onChange={(date: any) => {
          setWork_day(moment(date).format("YYYY-MM-DD").toString());
        }}
      />
    );
  };

  // 5-1. table ----------------------------------------------------------------------------------->
  const tableWorkSection = (i) => {
    return (
      <div key={i}>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">운동파트</span>
              <select
                className="form-control"
                onChange={(e) => {
                  setWork_part(e.target.value);
                }}>
                {Object.keys(workArray).flatMap((key) =>
                  Object.values(workArray[key].workPart).flatMap((value, index) => {
                    return (
                      <option value={value} key={index}>
                        {value}
                      </option>
                    );
                  })
                )}
              </select>
            </div>
          </div>
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">운동종목</span>
              <select
                className="form-control"
                onChange={(e) => {
                  setWork_title(e.target.value);
                }}>
                {Object.values(workArray[selectNumber].workTitle).flatMap((value, index) => {
                    return (
                      <option value={value} key={index}>
                        {value}
                      </option>
                    );
                  }
                )}
              </select>
            </div>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">Set</span>
              <input
                type="text"
                className="form-control"
                id="work_set"
                placeholder="Set"
                value={workSection.work_set}
                onChange={(e) => {
                  setWorkSection({ ...workSection, work_set: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">Count</span>
              <input
                type="text"
                className="form-control"
                id="work_count"
                placeholder="Count"
                value={workSection.work_count}
                onChange={(e) => {
                  setWorkSection({ ...workSection, work_count: e.target.value });
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
                type="text"
                className="form-control"
                id="work_kg"
                placeholder="Kg"
                value={workSection.work_kg}
                onChange={(e) => {
                  setWorkSection({ ...workSection, work_kg: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">Rest</span>
              <input
                type="text"
                className="form-control"
                id="work_rest"
                placeholder="Rest"
                value={workSection.work_rest}
                onChange={(e) => {
                  setWorkSection({ ...workSection, work_rest: e.target.value });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 5-2. table ------------------------------------------------------------------------------->
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
                onChange={(e: any) => {
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
                type="text"
                className="form-control"
                id="work_day"
                name="work_day"
                placeholder="Day"
                value={WORK.work_day}
                onChange={(e: any) => {
                  setWork_day(e.target.value);
                }}
                readOnly
              />
            </div>
          </div>
        </div>
        <div>
          <input
            type="number"
            value={workAmount}
            onChange={(e) => {
              setWorkAmount(parseInt(e.target.value));
            }}
          />
        </div>
        {Array.from({length : workAmount}, (_, i) => {
          return tableWorkSection(i)
        })}
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">Start</span>
              <TimePicker
                id="work_start"
                name="work_start"
                value={WORK.work_start}
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                onChange={(e: any) => {
                  setWORK({ ...WORK, work_start: e });
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
                value={WORK.work_end}
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                onChange={(e: any) => {
                  setWORK({ ...WORK, work_end: e });
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
                type="text"
                className="form-control"
                id="work_time"
                name="work_time"
                placeholder="Time"
                value={WORK.work_time || ""}
                onChange={(e: any) => {
                  setWORK({ ...WORK, work_time: e.target.value });
                }}
                readOnly
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
      <button
        className="btn btn-primary"
        type="button"
        onClick={flowWorkInsert}
      >
        Insert
      </button>
    );
  };
  const buttonRefreshPage = () => {
    return (
      <button
        type="button"
        className="btn btn-success ms-2"
        onClick={() => {
          window.location.reload();
        }}
      >
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

// TestInsert.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// 0. etc ----------------------------------------------------------------------------------------->
const workArray = [
  {
    workPart: ["전체"],
    workTitle: ["전체"],
  },
  {
    workPart: ["등"],
    workTitle: [
      "전체",
      "데드리프트",
      "바벨로우",
      "덤벨로우",
      "시티드로우",
      "랫풀다운",
      "풀업",
    ],
  },
  {
    workPart: ["하체"],
    workTitle: [
      "전체",
      "백스쿼트",
      "프론트스쿼트",
      "핵스쿼트",
      "바벨런지",
      "덤벨런지",
      "레그프레스",
      "레그익스텐션",
      "레그컬",
    ],
  },
  {
    workPart: ["가슴"],
    workTitle: [
      "전체",
      "바벨벤치프레스",
      "덤벨벤치프레스",
      "머신벤치프레스",
      "인클라인벤치프레스",
      "디클라인벤치프레스",
      "덤벨플라이",
      "케이블플라이",
      "케이블크로스오버",
      "딥스",
      "푸쉬업",
    ],
  },
  {
    workPart: ["어깨"],
    workTitle: [
      "전체",
      "밀리터리프레스",
      "바벨프레스",
      "덤벨프레스",
      "머신프레스",
      "비하인드넥프레스",
      "프론트레터럴레이즈",
      "사이드레터럴레이즈",
      "벤트오버레터럴레이즈",
      "페이스풀",
    ],
  },
  {
    workPart: ["삼두"],
    workTitle: [
      "전체",
      "라잉트라이셉스익스텐션",
      "덤벨트라이셉스익스텐션",
      "오버헤드트라이셉스익스텐션",
      "클로즈그립벤치프레스",
      "케이블트라이셉스푸쉬다운",
      "케이블트라이셉스로프다운",
      "킥백",
    ],
  },
  {
    workPart: ["이두"],
    workTitle: [
      "전체",
      "바벨컬",
      "덤벨컬",
      "해머컬",
      "머신컬",
      "케이블컬",
      "바벨프리처컬",
      "덤벨프리처컬",
    ],
  },
  {
    workPart: ["유산소"],
    workTitle: [
      "전체",
      "걷기",
      "달리기",
      "스텝퍼",
      "자전거",
      "수영",
      "플랭크"
    ],
  },
  {
    workPart: ["휴식"],
    workTitle: ["휴식"],
  },
];

// 1. main ---------------------------------------------------------------------------------------->
export const TestInsert = () => {
  // title
  const TITLE = "Work Insert";
  // url
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  // date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // hook
  const navParam = useNavigate();
  const user_id = window.sessionStorage.getItem("user_id");
  // useState
  const [work_day, setWork_day] = useState(koreanDate);
  const [WORK, setWORK] = useState<any>({});
  const [workAmount, setWorkAmount] = useState<number>(1);
  const [work_part, setWork_part] = useState("전체");
  const [work_title, setWork_title] = useState("전체");
  const [selectNumber, setSelectNumber] = useState(0);
  const [testSection, setTestSection] = useState<any>([{workArray}]);

  // 2-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setWORK ({
      ...WORK,
      work_day : work_day,
      workSection : [{
        ...testSection,
        work_part : work_part,
        work_title : work_title
      }]
    });
  }, [work_day, work_part, work_title]);

  // 2-2. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    let workPartAll:any = [];
    let resultPart;

    let workTitleAll:any = [];
    let resultTitle;

    Object.values(workArray).forEach((value, index) => {
      if (work_part == "전체") {
        if (work_part == "전체" && work_title == "전체") {
          workPartAll.push(value.workPart[0]);
          resultPart = workPartAll.join(",").slice(3);
          setWork_part(resultPart);

          workTitleAll.push(value.workTitle);
          resultTitle = workTitleAll.join(",").slice(3);
          setWork_title(resultTitle);
        }
      }
      else if (work_part != "전체") {
        if (work_part == workArray[index].workPart[0] && work_title == "전체") {
          workTitleAll.push(workArray[index].workTitle);
          resultTitle = workTitleAll.join(",").slice(3);
          setWork_title(resultTitle);
        }
        else if (work_part == workArray[index].workPart[0] && work_title != "전체") {
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
  const flowTestInsert = async () => {
    const response = await axios.post(`${URL_WORK}/workInsert`, {
      user_id: user_id,
      workSection: testSection,
      work_start: WORK.work_start,
      work_end: WORK.work_end,
      work_time: WORK.work_time,
      work_day: WORK.work_day,
      work_regdate: WORK.work_regdate,
      work_update: WORK.work_update,
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
  const tableTestSection = (i:number) => {
    return (
      <div key={i}>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">운동파트</span>
              <select
                className="form-control"
                id={`work_part-${i}`}
                onChange={(e) => {
                  setWork_part(e.target.value);
                  setTestSection([{ ...testSection[i], work_part: e.target.value }]);
                }}>
                {Object.keys(workArray).flatMap((key) =>
                  Object.values(workArray[key].workPart).flatMap((value, index) => (
                    <option value={value} key={`${key}-${index}`}>
                      {value}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">운동종목</span>
              <select
                className="form-control"
                id={`work_title-${i}`}
                onChange={(e) => {
                  setWork_title(e.target.value);
                  setTestSection([{ ...testSection[i], work_title: e.target.value }]);
                }}>
                {Object.values(workArray[selectNumber].workTitle).flatMap((value, index) => (
                  <option value={value} key={`${selectNumber}-${index}`}>
                    {value}
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
                type="text"
                className="form-control"
                placeholder="Set"
                id={`work_set-${i}`}
                value={testSection[i]?.work_set}
                onChange={(e) => {
                  setTestSection([{ ...testSection[i], work_set: e.target.value }]);
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
                placeholder="Count"
                id={`work_count-${i}`}
                value={testSection[i]?.work_count}
                onChange={(e) => {
                  setTestSection([{ ...testSection[i], work_count: e.target.value }]);
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
                placeholder="Kg"
                id={`work_kg-${i}`}
                value={testSection[i]?.work_kg}
                onChange={(e) => {
                  setTestSection([{ ...testSection[i], work_kg: e.target.value }]);
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
                placeholder="Rest"
                id={`work_rest-${i}`}
                value={testSection[i]?.work_rest}
                onChange={(e) => {
                  setTestSection([{ ...testSection[i], work_rest: e.target.value }]);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 5-2. table ----------------------------------------------------------------------------------->
  const tableTestInsert = () => {
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
          <input type="number" value={workAmount} onChange={(e) => {
            setWorkAmount(parseInt(e.target.value));
          }}/>
          {Array.from({length: workAmount}, (v, i) => i).map((i) => tableTestSection(i))}
        </div>
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
  const buttonTestInsert = () => {
    return (
      <button className="btn btn-primary ms-2" type="button" onClick={flowTestInsert}>
        Insert
      </button>
    );
  };
  const buttonRefreshPage = () => {
    return (
      <button className="btn btn-success ms-2" type="button" onClick={() => {
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
            {tableTestInsert()}
            <br />
            {buttonTestInsert()}
            {buttonRefreshPage()}
          </form>
        </div>
      </div>
    </div>
  );
};

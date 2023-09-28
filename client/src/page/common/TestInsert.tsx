// WorkInsert.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment-timezone";

// workPartArray ---------------------------------------------------------------------------------->
const workPartArray = [
  {
    // 0
    workPart: ["전체"],
  },
  {
    // 1
    workPart: ["등"],
  },
  {
    // 2
    workPart: ["하체"],
  },
  {
    // 3
    workPart: ["가슴"],
  },
  {
    // 4
    workPart: ["어깨"],
  },
  {
    // 5
    workPart: ["삼두"],
  },
  {
    // 6
    workPart: ["이두"],
  },
  {
    // 7
    workPart: ["유산소"],
  },
  {
    // 8
    workPart: ["휴식"],
  },
];

// workTitleArray --------------------------------------------------------------------------------->
const workTitleArray = [
  {
    // 0
    workTitle : ["전체"],
  },
  {
    // 1
    workTitle : ["데드리프트", "바벨로우", "덤벨로우", "시티드로우", "랫풀다운", "풀업"],
  },
  {
    // 2
    workTitle : ["백스쿼트", "프론트스쿼트", "핵스쿼트", "바벨런지", "덤벨런지", "레그프레스", "레그익스텐션", "레그컬"],
  },
  {
    // 3
    workTitle : ["바벨벤치프레스", "덤벨벤치프레스", "머신벤치프레스", "인클라인벤치프레스", "디클라인벤치프레스", "덤벨플라이", "케이블플라이", "케이블크로스오버", "딥스", "푸쉬업"],
  },
  {
    // 4
    workTitle : ["밀리터리프레스", "바벨프레스", "덤벨프레스", "머신프레스", "비하인드넥프레스", "프론트레터럴레이즈", "사이드레터럴레이즈", "벤트오버레터럴레이즈", "페이스풀"],
  },
  {
    // 5
    workTitle : ["라잉트라이셉스익스텐션", "덤벨트라이셉스익스텐션", "오버헤드트라이셉스익스텐션", "클로즈그립벤치프레스", "케이블트라이셉스푸쉬다운", "케이블트라이셉스로프다운", "킥백"],
  },
  {
    // 6
    workTitle : ["바벨컬", "덤벨컬", "해머컬", "머신컬", "케이블컬", "바벨프리처컬", "덤벨프리처컬"],
  },
  {
    // 7
    workTitle : ["걷기", "달리기", "스텝퍼", "자전거", "수영", "플랭크"],
  },
  {
    // 8
    workTitle : ["휴식"],
  },
];

// 1. main ---------------------------------------------------------------------------------------->
export const TestInsert = () => {
  // title
  const TITLE = "Test Insert";
  // url
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  // date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // hook
  const navParam = useNavigate();
  // val
  const user_id = window.sessionStorage.getItem("user_id");
  // useState
  const [workAmount, setWorkAmount] = useState<number>(1);
  const [workSection, setWorkSection] = useState<any>([{}]);
  const [work_day, setWork_day] = useState(koreanDate);
  const [work_part, setWork_part] = useState<any>("전체");
  const [work_title, setWork_title] = useState<any>("전체");
  const [selectNumber, setSelectNumber] = useState(0);
  const [WORK, setWORK] = useState<any>({});

  // 2-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setWORK ({
      ...WORK,
      work_day: work_day,
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

      const work_time_formatted = `${String(hours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}`;

      setWORK({ ...WORK, work_time: work_time_formatted });
    }
  }, [WORK.work_start, WORK.work_end]);

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
  const tableWorkSection = (i:number) => {

    return (
      <div key={i}>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">운동파트</span>
              <select
                className="form-control"
                id={`work_part-${i}`}
                value={workSection[i]?.work_part}
                onChange={(e) => {
                  setWork_part(e.target.value);
                  setWorkSection((prevWorkSection:any[]) => [{
                    ...prevWorkSection[0],
                    work_part : e.target.value,
                  }]);
                  console.log(workSection);
                }}>
                {Object.keys(workArray).flatMap((key:any) =>
                  Object.values(workArray[key].workPart).flatMap((value, index) => (
                    <option value={value} key={`${key}-${index}`}>
                      {value}
                    </option>
                )))}
              </select>
            </div>
          </div>
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">운동종목</span>
              <select
                className="form-control"
                id={`work_title-${i}`}
                value={workSection[i-0]?.work_title}
                onChange={(e) => {
                  setWork_title(e.target.value);
                  setWorkSection((prevWorkSection:any[]) => [{
                    ...prevWorkSection[0],
                    work_title : e.target.value,
                  }]);
                  console.log(workSection);
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
      </div>
    );
  };

  // 5-2. table ----------------------------------------------------------------------------------->
  const tableWorkInsert = () => {
    return (
      <div>
        <input type="number" value={workAmount} onChange={(e) => {
          setWorkAmount(parseInt(e.target.value));
        }}/>
        {Array.from({ length: workAmount }, (_, i) => tableWorkSection(i))}
      </div>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
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
            {tableWorkInsert()}
            <br />
            {buttonRefreshPage()}
          </form>
        </div>
      </div>
    </div>
  );
};
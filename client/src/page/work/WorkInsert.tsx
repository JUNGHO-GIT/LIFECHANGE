// WorkInsert.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
const workArray = {
  선택: [
    "선택"
  ],
  전체: [
    "전체"
  ],
  등: [
    "전체", "데드리프트", "바벨로우", "덤벨로우", "시티드로우", "랫풀다운", "풀업"
  ],
  하체: [
    "전체", "백스쿼트", "프론트스쿼트", "핵스쿼트", "바벨런지", "덤벨런지", "레그프레스", "레그익스텐션", "레그컬"
  ],
  가슴: [
    "전체", "바벨벤치프레스", "덤벨벤치프레스", "머신벤치프레스", "인클라인벤치프레스", "디클라인벤치프레스", "덤벨플라이", "케이블플라이", "케이블크로스오버", "딥스", "푸쉬업"
  ],
  어깨: [
    "전체", "밀리터리프레스", "바벨프레스", "덤벨프레스", "머신프레스", "비하인드넥프레스", "프론트레터럴레이즈", "사이드레터럴레이즈", "벤트오버레터럴레이즈", "페이스풀"
  ],
  삼두: [
    "전체", "라잉트라이셉스익스텐션", "덤벨트라이셉스익스텐션", "오버헤드트라이셉스익스텐션", "클로즈그립벤치프레스", "케이블트라이셉스푸쉬다운", "케이블트라이셉스로프다운", "킥백"
  ],
  이두: [
    "전체", "바벨컬", "덤벨컬", "해머컬", "머신컬", "케이블컬", "바벨프리처컬", "덤벨프리처컬"
  ],
  유산소: [
    "전체", "걷기", "달리기", "스텝퍼", "자전거", "수영", "플랭크"
  ],
  회복: [
    "전체", "휴식"
  ],
};

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
  let [work_day, setWork_day] = useState(koreanDate);
  let [WORK, setWORK] = useState<any>({
    user_id: user_id,
    work_day: work_day,
    work_part: "선택",
    work_title: "전체",
    work_set: "",
    work_count: "",
    work_kg: "",
    work_rest: "",
    work_start: "00:00",
    work_end: "00:00",
    work_time: "00:00",
  });

  // 2-0. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    if (WORK.work_part === "전체" && WORK.work_title === "전체") {

      // 맨뒤에 `,` 제거
      const allParts = Object.keys(workArray)
      .join(", ").toString().replace("전체, ", "")

      const allExercises = ([] as string[])
      .concat(...Object.values(workArray))
      .join(", ").toString().replace("전체, ", "");

      setWORK({
        ...WORK,
        work_part : allParts,
        work_title : allExercises
      });
    }
    else if (WORK.work_part !== "전체" && WORK.work_title === "전체") {
      const allExercisesForPart = workArray[WORK.work_part]
      .join(", ").toString().replace("전체, ", "");

      setWORK({
        ...WORK,
        work_title: allExercisesForPart
      });
    }
  }, [WORK.work_part, WORK.work_title]);

  // 2-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setWORK({
      ...WORK,
      work_day : work_day
    });
  }, [work_day]);

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

      const work_time_formatted = `${String(hours).padStart(2, "0")}:${String (
        minutes
      ).padStart(2, "0")}`;

      setWORK({ ...WORK, work_time : work_time_formatted });
    }
  }, [WORK.work_start, WORK.work_end]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowWorkInsert = async () => {
    if (WORK.work_part === "선택" || WORK.work_title === "선택") {
      alert("운동파트를 선택해주세요.");
      return;
    }
    const response = await axios.post(`${URL_WORK}/workInsert`, {
      user_id : user_id,
      WORK : WORK,
    });
    if (response.data === "success") {
      alert("Insert a work successfully");
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

  // 5. table ------------------------------------------------------------------------------------->
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
                onChange={(e : any) => {
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
                value={WORK.work_day || ""}
                onChange={(e : any) => {
                  setWORK({ ...WORK, work_day: e.target.value });
                }}
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">운동파트</span>
              <select id="work_part" name="work_part" className="form-control"
                onChange={(e : any) => {
                  setWORK({ ...WORK, work_part : e.target.value });
                }}>
                {Object.keys(workArray).map((index:any) => (
                  <option key={index} value={index}>
                    {index}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">운동종목</span>
              <select id="work_title" name="work_title" className="form-control"
                onChange={(e: any) => {
                  setWORK({ ...WORK, work_title: e.target.value });
                }}>
                {WORK.work_part && workArray.hasOwnProperty(WORK.work_part) ? (
                  workArray[WORK.work_part].map((index:any) => (
                    <option key={index} value={index}>
                      {index}
                    </option>
                  ))
                ) : (
                  <option value="전체">전체</option>
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
                name="work_set"
                placeholder="Set"
                onChange={(e : any) => {
                  setWORK({ ...WORK, work_set: e.target.value });
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
                name="work_count"
                placeholder="Count"
                onChange={(e : any) => {
                  setWORK({ ...WORK, work_count: e.target.value });
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
                name="work_kg"
                placeholder="Kg"
                onChange={(e : any) => {
                  setWORK({ ...WORK, work_kg: e.target.value });
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
                name="work_rest"
                placeholder="Rest"
                onChange={(e : any) => {
                  setWORK({ ...WORK, work_rest: e.target.value });
                }}
              />
            </div>
          </div>
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
                onChange={(e : any) => {
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
                onChange={(e : any) => {
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
                onChange={(e : any) => {
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
      <button className="btn btn-primary" type="button" onClick={flowWorkInsert}>
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

// WorkInsert.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";
import { WorkPartSelect, WorkTitleSelect } from "./WorkSelect";

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
  const [work_day, setWork_day] = useState(koreanDate);
  const [WORK, setWORK] = useState<any> ({});

  // 2-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setWORK({ ...WORK, work_day : work_day });
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

      const work_time_formatted
      = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

      setWORK({ ...WORK, work_time: work_time_formatted });
    };
  }, [WORK.work_start, WORK.work_end]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowWorkInsert = async () => {
    const response = await axios.post (`${URL_WORK}/workInsert`, {
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

  // 5. table ------------------------------------------------------------------------------------->
  const tableWorkInsert = () => {
    return (
      <div>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">ID</span>
              <input type="text" className="form-control" id="user_id" name="user_id"
                placeholder="ID" value={user_id ? user_id : ""} onChange={(e:any) => {
                  setWORK({ ...WORK, user_id: e.target.value });
                }}
                readOnly
              />
            </div>
          </div>
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">Day</span>
              <input type="text" className="form-control" id="work_day" name="work_day"
                placeholder="Day" value={WORK.work_day || ""} onChange={(e:any) => {
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
              <span className="input-group-text">Part</span>
              <WorkPartSelect
                work_part={WORK.work_part}
                setWorkPart={(work_part: any) => {
                  setWORK({ ...WORK, work_part : work_part });
                }}
              />
            </div>
          </div>
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">Title</span>
              <WorkTitleSelect
                work_part={WORK.work_part}
                work_title={WORK.work_title}
                setWorkTitle={(work_title: any) => {
                  setWORK({ ...WORK, work_title : work_title });
                }}
              />
            </div>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">Set</span>
              <input type="text" className="form-control" id="work_set"
                placeholder="Set" onChange={(e) => {
                  setWORK({ ...WORK, work_set : e.target.value });
                }}
              />
            </div>
          </div>
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">Count</span>
              <input type="text" className="form-control" id="work_count"
                placeholder="Count" onChange={(e) => {
                  setWORK({ ...WORK, work_count : e.target.value });
                }}
              />
            </div>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">Kg</span>
              <input type="text" className="form-control" id="work_kg"
                placeholder="Kg" onChange={(e) => {
                  setWORK({ ...WORK, work_kg : e.target.value });
                }}
              />
            </div>
          </div>
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">Rest</span>
              <input type="text" className="form-control" id="work_rest"
                placeholder="Rest" onChange={(e) => {
                  setWORK({ ...WORK, work_rest : e.target.value });
                }}
              />
            </div>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">Start</span>
              <TimePicker id="work_start" name="work_start" value={WORK.work_start}
                disableClock={false} clockIcon={null} format="HH:mm" locale="ko"
                onChange={(e:any) => { setWORK({ ...WORK, work_start:e }); }}
              />
            </div>
          </div>
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">End</span>
              <TimePicker id="work_end" name="work_end" value={WORK.work_end}
                disableClock={false} clockIcon={null} format="HH:mm" locale="ko"
                onChange={(e:any) => { setWORK({ ...WORK, work_end:e }); }}
              />
            </div>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-10">
            <div className="input-group mb-3">
              <span className="input-group-text">Time</span>
              <input type="text" className="form-control" id="work_time" name="work_time"
                placeholder="Time" value={WORK.work_time || ""}
                onChange={(e:any) => { setWORK({ ...WORK, work_time: e.target.value }); }}
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

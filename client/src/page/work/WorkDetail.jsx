// WorkDetail.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/js/useStorage.jsx";
import axios from "axios";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const WorkDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  const navParam = useNavigate();
  const location = useLocation();
  const location_day = location?.state?.work_day;
  const location_id = location?.state?._id;
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:planYn, set:setPlanYn} = useStorage(
    `planYn(${PATH})`, "N"
  );

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:strDate, set:setStrDate} = useStorage(
    `strDate(${PATH})`, location_day ? location_day : koreanDate
  );
  const {val:strDur, set:setStrDur} = useStorage(
    `strDur(${PATH})`, `${strDate} ~ ${strDate}`
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [WORK_DEFAULT, setWORK_DEFAULT] = useState({
    _id: "",
    work_number: 0,
    work_day: "",
    work_real : {
      work_start: "",
      work_end: "",
      work_time: "",
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
    },
    work_plan : {
      work_start: "",
      work_end: "",
      work_time: "",
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
    }
  });
  const [WORK, setWORK] = useState({
    _id: location_id,
    work_number: 0,
    work_day: "",
    work_real : {
      work_start: "",
      work_end: "",
      work_time: "",
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
    },
    work_plan : {
      work_start: "",
      work_end: "",
      work_time: "",
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
    }
  });

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_WORK}/detail`, {
      params: {
        _id: location_id,
        user_id: user_id,
        work_dur: strDur,
        planYn: planYn,
      },
    });

    setWORK(response.data.result ? response.data.result : WORK_DEFAULT);

  })()}, []);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setWORK((prev) => ({
      ...prev,
      work_day: strDur
    }));
  }, [strDate]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowWorkDelete = async (id) => {
    const response = await axios.delete(`${URL_WORK}/delete`, {
      params: {
        _id: id,
        user_id: user_id,
        work_dur: strDur,
        planYn: planYn,
      },
    });
    if (response.data === "success") {
      alert("delete success");
      navParam(`/work/list`);
    }
    else {
      alert("Delete failed");
    }
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableWorkDetail = () => {

    const workType = planYn === "Y" ? "work_plan" : "work_real";

    return (
      <table className="table bg-white table-hover">
        <thead className="table-primary">
          <tr>
            <th>날짜</th>
            <th>계획여부</th>
            <th>시작</th>
            <th>종료</th>
            <th>시간</th>
            <th>부위</th>
            <th>종목</th>
            <th>세트 x 횟수 x 무게</th>
            <th>휴식</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="fs-20 pt-20">
              {WORK.work_day}
            </td>
            <td>
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
            </td>
            <td className="fs-20 pt-20">
              {WORK[workType].work_start}
            </td>
            <td className="fs-20 pt-20">
              {WORK[workType].work_end}
            </td>
            <td className="fs-20 pt-20">
              {WORK[workType].work_time}
            </td>
            <td colSpan={4}>
              {WORK[workType].work_section.map((item, index) => (
                <div key={index} className="d-flex justify-content-between">
                  <span>{item.work_part_val}</span>
                  <span>{item.work_title_val}</span>
                  <span>{item.work_set} x {item.work_count} x {item.work_kg}</span>
                  <span>{item.work_rest}</span>
                  <button type="button" className="btn btn-sm btn-danger ms-2" onClick={() => flowWorkDelete(item._id)}>
                    X
                  </button>
                </div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonWorkUpdate = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary ms-2" onClick={() => {
        navParam(`/work/save`, {
          state: {
            work_day: strDate,
          }
        });
      }}>
        Update
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
  const buttonWorkList = () => {
    return (
      <button type="button" className="btn btn-sm btn-secondary ms-2" onClick={() => {
        navParam(`/work/list`);
      }}>
        List
      </button>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row d-center mb-20">
          <div className="col-12">
            {tableWorkDetail()}
          </div>
        </div>
        <div className="row d-center">
          <div className="col-12">
            {buttonWorkUpdate()}
            {buttonRefreshPage()}
            {buttonWorkList()}
          </div>
        </div>
      </div>
    </div>
  );
};
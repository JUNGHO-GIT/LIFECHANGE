// WorkDetail.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {useDate} from "../../../assets/hooks/useDate.jsx";
import axios from "axios";
import {DateNode} from "../../../assets/fragments/DateNode.jsx";
import {ButtonNode} from "../../../assets/fragments/ButtonNode.jsx";
// ------------------------------------------------------------------------------------------------>
export const WorkDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  const user_id = window.sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      startDt: "",
      endDt: "",
      refresh:0,
      toList:"/work/list",
      toSave:"/work/save",
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );
  const {val:FILTER, set:setFILTER} = useStorage(
    `FILTER(${PATH})`, {
      order: "asc",
      type: "day",
      limit: 5,
      partIdx: 0,
      part: "전체",
      titleIdx: 0,
      title: "전체"
    }
  );
  const {val:PAGING, set:setPAGING} = useStorage(
    `PAGING(${PATH})`, {
      page: 1,
      limit: 5
    }
  );
  const {val:COUNT, set:setCOUNT} = useStorage(
    `COUNT(${PATH})`, {
      totalCnt: 0,
      sectionCnt: 0
    }
  );
  const {val:CALENDAR, set:setCALENDAR} = useStorage(
    `CALENDAR(${PATH})`, {
      calStartOpen: false,
      calEndOpen: false,
      calOpen: false,
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const WORK_DEFAULT = {
    _id: "",
    work_number: 0,
    work_startDt: "",
    work_endDt: "",
    work_start: "",
    work_end: "",
    work_time: "",
    work_total_volume: 0,
    work_total_cardio: "",
    work_body_weight: "",
    work_section: [{
      work_part_idx: 0,
      work_part_val: "전체",
      work_title_idx: 0,
      work_title_val: "전체",
      work_set: 1,
      work_rep: 1,
      work_kg: 1,
      work_rest: 1,
      work_cardio: "",
    }],
  };
  const [WORK, setWORK] = useState(WORK_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    let sectionVolume = 0;
    let totalVolume = 0;
    let totalMinutes = 0;

    const timeFormat = (data) => {
      if (!data) {
        return 0;
      }
      else if (typeof data === "string") {
        const time = data.split(":");
        if (time.length === 2) {
          const hours = parseInt(time[0], 10) * 60;
          const minutes = parseInt(time[1], 10);
          return hours + minutes;
        }
        else {
          return 0;
        }
      }
      else {
        return 0;
      }
    };

    const updatedSections = WORK.work_section.map((item) => {
      sectionVolume = item.work_set * item.work_rep * item.work_kg;
      totalVolume += sectionVolume;
      totalMinutes += timeFormat(item.work_cardio);
      return {
        ...item,
        work_volume: sectionVolume
      };
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const cardioTime = `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;

    // 이전 상태와 비교
    if (WORK.work_total_volume !== totalVolume || WORK.work_total_cardio !== cardioTime) {
      setWORK((prev) => ({
        ...prev,
        work_total_volume: totalVolume,
        work_total_cardio: cardioTime,
        work_section: updatedSections,
      }));
    }
  }, [WORK.work_section]);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_WORK}/detail`, {
      params: {
        _id: location_id,
        user_id: user_id,
        work_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });

    setWORK(response.data.result || WORK_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0
    }));

  })()}, [location_id, user_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id) => {
    const response = await axios.delete(`${URL_WORK}/delete`, {
      params: {
        _id: id,
        user_id: user_id,
        work_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    if (response.data === "success") {
      const updatedData = await axios.get(`${URL_WORK}/detail`, {
        params: {
          _id: location_id,
          user_id: user_id,
          work_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
        },
      });
      alert("삭제되었습니다.");
      setWORK(updatedData.data.result || WORK_DEFAULT);
      updatedData.data.result === null && navParam(SEND.toList);
    }
    else {
      alert(`${response.data}`);
    }
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <table className={"table bg-white table-hover"}>
        <thead className={"table-primary"}>
          <tr>
            <th>날짜</th>
            <th>시작</th>
            <th>종료</th>
            <th>시간</th>
            <th>부위</th>
            <th>종목</th>
            <th>세트</th>
            <th>횟수</th>
            <th>중량</th>
            <th>휴식</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {WORK?.work_section?.map((item, index) => (
            <tr key={index} className={"fs-20 pt-20"}>
              {index === 0 && (
                <React.Fragment>
                  <td rowSpan={WORK?.work_section?.length}>
                    {WORK?.work_startDt}
                  </td>
                  <td rowSpan={WORK?.work_section?.length}>
                    {WORK?.work_start}
                  </td>
                  <td rowSpan={WORK?.work_section?.length}>
                    {WORK?.work_end}
                  </td>
                  <td rowSpan={WORK?.work_section?.length}>
                    {WORK?.work_time}
                  </td>
                </React.Fragment>
              )}
              <React.Fragment>
                <td>{item.work_part_val}</td>
                <td>{item.work_title_val}</td>
              </React.Fragment>
              {(item.work_part_val !== "유산소") ? (
                <React.Fragment>
                  <td>{item.work_set}</td>
                  <td>{item.work_rep}</td>
                  <td>{item.work_kg}</td>
                  <td>{item.work_rest}</td>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <td colSpan={4}>{item.work_cardio}</td>
                </React.Fragment>
              )}
              <td>
                <button type={"button"} className={"btn btn-sm btn-danger"} onClick={() => (
                  flowDelete(item._id)
                )}>
                  X
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={4}>총 볼륨</td>
            <td colSpan={2}></td>
            <td colSpan={4}>{WORK?.work_total_volume}</td>
            <td></td>
          </tr>
          <tr>
            <td colSpan={4}>총 유산소 시간</td>
            <td colSpan={2}></td>
            <td colSpan={4}>{WORK?.work_total_cardio}</td>
            <td></td>
          </tr>
          <tr>
            <td colSpan={4}>체중</td>
            <td colSpan={2}></td>
            <td colSpan={4}>{WORK?.work_body_weight}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} flowSave={""} navParam={navParam}
        part={"work"} plan={""} type={"detail"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className={"root-wrapper"}>
      <div className={"container-wrapper"}>
        <div className={"row d-center"}>
          <div className={"col-12 mb-20"}>
            <h1>Detail</h1>
          </div>
          <div className={"col-12 mb-20"}>
            {tableNode()}
          </div>
          <div className={"col-12 mb-20"}>
            {buttonNode()}
          </div>
        </div>
      </div>
    </div>
  );
};
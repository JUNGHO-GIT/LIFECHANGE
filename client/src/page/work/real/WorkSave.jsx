// WorkSave.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {useTime} from "../../../assets/hooks/useTime.jsx";
import {useDate} from "../../../assets/hooks/useDate.jsx";
import {TimePicker} from "react-time-picker";
import axios from "axios";
import {workArray} from "../../../assets/data/DataArray.jsx";
import {DateNode} from "../../../assets/fragments/DateNode.jsx";
import {ButtonNode} from "../../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const WorkSave = () => {

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
      toList:"/work/list"
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
      work_volume: 0,
      work_cardio: "",
    }],
  };
  const [WORK, setWORK] = useState(WORK_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);
  useTime(WORK, setWORK, PATH, "real");

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_WORK}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        work_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setWORK(response.data.result || WORK_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0,
    }));
  })()}, [user_id, DATE.startDt, DATE.endDt]);

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
      setWORK({
        ...WORK,
        work_total_volume: totalVolume,
        work_total_cardio: cardioTime,
        work_section: updatedSections,
      });
    }
  }, [WORK?.work_section]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_WORK}/save`, {
      user_id: user_id,
      WORK: WORK,
      work_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
    });
    if (response.data === "success") {
      alert("Save successfully");
      SEND.startDt = DATE.startDt;
      SEND.endDt = DATE.endDt;
      navParam(SEND.toList, {
        state: SEND
      });
    }
    else {
      alert(`${response.data}error`);
    }
  };

  // 4. date -------------------------------------------------------------------------------------->
  const dateNode = () => {
    return (
      <DateNode DATE={DATE} setDATE={setDATE} part={"work"} plan={""} type={"save"} />
    );
  };

  // 5. handler ----------------------------------------------------------------------------------->
  const handlerSectionCount = () => {
    function handlerCount (e) {
      let newCount = parseInt(e, 10);
      let defaultSection = {
        work_part_idx: 0,
        work_part_val: "전체",
        work_title_idx: 0,
        work_title_val: "전체",
        work_set: 1,
        work_rep: 1,
        work_kg: 1,
        work_rest: 1,
        work_volume: 0,
        work_cardio: "",
      };

      setCOUNT((prev) => ({
        ...prev,
        sectionCnt: newCount
      }));

      if (newCount > 0) {
        let updatedSections = Array(newCount).fill(null).map((_, idx) =>
          idx < WORK.work_section.length ? WORK.work_section[idx] : defaultSection
        );
        setWORK((prev) => ({
          ...prev,
          work_section: updatedSections
        }));
      }
      else {
        setWORK((prev) => ({
          ...prev,
          work_section: []
        }));
      }
    }

    function inputFragment () {
      return (
        <div className={"row d-center"}>
          <div className={"col-4"}>
            <input
              type={"number"}
              className={"form-control mb-30"}
              value={COUNT?.sectionCnt}
              min={0}
              onChange={(e) => (
                handlerCount(e.target.value)
              )}
            />
          </div>
        </div>
      );
    };
    return (
      <React.Fragment>
        {inputFragment()}
      </React.Fragment>
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    function tableSection (i) {
      return (
        <div key={i} className={"mb-20"}>
          <div className={"row d-center"}>
            <div className={"col-6"}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>파트</span>
                <select
                  className={"form-control"}
                  id={`work_part_idx-${i}`}
                  value={WORK?.work_section[i]?.work_part_idx}
                  onChange={(e) => {
                    const newIndex = parseInt(e.target.value);
                    setWORK((prev) => {
                      let updated = {...prev};
                      let updatedSection = [...updated.work_section];
                      updatedSection[i] = {
                        ...updatedSection[i],
                        work_part_idx: newIndex,
                        work_part_val: workArray[newIndex].work_part,
                        work_title_idx: 0,
                        work_title_val: workArray[newIndex].work_title[0],
                      };
                      updated.work_section = updatedSection;
                      return updated;
                    });
                  }}
                >
                  {workArray?.map((item, idx) => (
                    <option key={idx} value={idx}>
                      {item.work_part}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={"col-6"}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>타이틀</span>
                <select
                  className={"form-control"}
                  id={`work_title_idx-${i}`}
                  value={WORK?.work_section[i]?.work_title_idx}
                  onChange={(e) => {
                    const newTitleIdx = parseInt(e.target.value);
                    const newTitleVal = workArray[WORK?.work_section[i]?.work_part_idx]?.work_title[newTitleIdx];
                    if (newTitleIdx >= 0 && newTitleVal) {
                      setWORK((prev) => {
                        let updated = {...prev};
                        let updatedSection = [...updated.work_section];
                        updatedSection[i] = {
                          ...updatedSection[i],
                          work_title_idx: newTitleIdx,
                          work_title_val: newTitleVal,
                        };
                        updated.work_section = updatedSection;
                        return updated;
                      });
                    }
                  }}
                >
                  {workArray[WORK?.work_section[i]?.work_part_idx]?.work_title?.map((title, idx) => (
                    <option key={idx} value={idx}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className={"row d-center"}>
            <div className={"col-3"}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>세트</span>
                <input
                  type={"number"}
                  min={1}
                  className={"form-control"}
                  disabled={WORK?.work_section[i]?.work_part_val === "유산소"}
                  value={WORK?.work_section[i]?.work_set}
                  onChange={(e) => {
                    const newVal = parseInt(e.target.value, 10);
                    setWORK((prev) => {
                      let updated = {...prev};
                      let updatedSection = [...updated.work_section];
                      updatedSection[i].work_set = isNaN(newVal) ? 0 : newVal;
                      updated.work_section = updatedSection;
                      return updated;
                    });
                  }}
                />
              </div>
            </div>
            <div className={"col-3"}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>횟수</span>
                <input
                  type={"number"}
                  min={1}
                  className={"form-control"}
                  disabled={WORK?.work_section[i]?.work_part_val === "유산소"}
                  value={WORK?.work_section[i]?.work_rep}
                  onChange={(e) => {
                    const newVal = parseInt(e.target.value, 10);
                    setWORK((prev) => {
                      let updated = {...prev};
                      let updatedSection = [...updated.work_section];
                      updatedSection[i].work_rep = isNaN(newVal) ? 0 : newVal;
                      updated.work_section = updatedSection;
                      return updated;
                    });
                  }}
                />
              </div>
            </div>
            <div className={"col-3"}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>무게</span>
                <input
                  type={"number"}
                  min={1}
                  className={"form-control"}
                  disabled={WORK?.work_section[i]?.work_part_val === "유산소"}
                  value={WORK?.work_section[i]?.work_kg}
                  onChange={(e) => {
                    const newVal = parseInt(e.target.value, 10);
                    setWORK((prev) => {
                      let updated = {...prev};
                      let updatedSection = [...updated.work_section];
                      updatedSection[i].work_kg = isNaN(newVal) ? 0 : newVal;
                      updated.work_section = updatedSection;
                      return updated;
                    });
                  }}
                />
              </div>
            </div>
            <div className={"col-3"}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>휴식</span>
                <input
                  type={"number"}
                  min={1}
                  className={"form-control"}
                  disabled={WORK?.work_section[i]?.work_part_val === "유산소"}
                  value={WORK?.work_section[i]?.work_rest}
                  onChange={(e) => {
                    const newVal = parseInt(e.target.value, 10);
                    setWORK((prev) => {
                      let updated = {...prev};
                      let updatedSection = [...updated.work_section];
                      updatedSection[i].work_rest = isNaN(newVal) ? 0 : newVal;
                      updated.work_section = updatedSection;
                      return updated;
                    });
                  }}
                />
              </div>
            </div>
            <div className={"col-12"}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>볼륨</span>
                <input
                  type={"number"}
                  disabled={true}
                  className={"form-control"}
                  value={WORK?.work_section[i]?.work_volume}
                  onChange={(e) => {
                    setWORK((prev) => {
                      let updated = {...prev};
                      let updatedSection = [...updated.work_section];
                      updatedSection[i].work_volume = Number(e.target.value);
                      updated.work_section = updatedSection;
                      return updated;
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className={"row d-center"}>
            <div className={"col-12"}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>유산소</span>
                <TimePicker
                  id={"work_cardio"}
                  name={"work_cardio"}
                  className={"form-control"}
                  disableClock={false}
                  clockIcon={null}
                  format="HH:mm"
                  locale="ko"
                  disabled={WORK?.work_section[i]?.work_part_val !== "유산소"}
                  value={WORK?.work_section[i]?.work_cardio}
                  onChange={(e) => {
                    setWORK((prev) => {
                      let updated = {...prev};
                      let updatedSection = [...updated.work_section];
                      updatedSection[i].work_cardio  = e ? e.toString() : "";
                      updated.work_section = updatedSection;
                      return updated;
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    };
    function tableFragment () {
      return (
        <div className={"row d-center"}>
          <div className={"col-12"}>
            {Array.from({length: COUNT.sectionCnt}, (_, i) => tableSection(i))}
          </div>
        </div>
      );
    };
    function tableTime () {
      return (
        <React.Fragment>
          <div className={"row d-center mt-3"}>
            <div className={"col-6"}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>시작시간</span>
                <TimePicker
                  id={"work_start"}
                  name={"work_start"}
                  className={"form-control"}
                  disableClock={false}
                  clockIcon={null}
                  format="HH:mm"
                  locale="ko"
                  value={WORK?.work_start}
                  onChange={(e) => {
                    setWORK((prev) => ({
                      ...prev,
                      work_start: e ? e.toString() : "",
                    }));
                  }}
                />
              </div>
            </div>
          </div>
          <div className={"row d-center mt-3"}>
            <div className={"col-6"}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>종료시간</span>
                <TimePicker
                  id={"work_end"}
                  name={"work_end"}
                  className={"form-control"}
                  disableClock={false}
                  clockIcon={null}
                  format="HH:mm"
                  locale="ko"
                  value={WORK?.work_end}
                  onChange={(e) => {
                    setWORK((prev) => ({
                      ...prev,
                      work_end: e ? e.toString() : "",
                    }));
                  }}
                />
              </div>
            </div>
          </div>
          <div className={"row d-center mt-3"}>
            <div className={"col-6"}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>운동시간</span>
                <TimePicker
                  id={"work_time"}
                  name={"work_time"}
                  className={"form-control"}
                  disableClock={false}
                  disabled={true}
                  clockIcon={null}
                  format="HH:mm"
                  locale="ko"
                  value={WORK?.work_time}
                />
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    };

    function tableRemain () {
      return (
        <React.Fragment>
          <div className={"row d-center mt-3"}>
            <div className={"col-6"}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>총 볼륨</span>
                <input
                  type={"number"}
                  disabled={true}
                  className={"form-control"}
                  min={0}
                  value={WORK?.work_total_volume}
                  onChange={(e) => {
                    setWORK((prev) => ({
                      ...prev,
                      work_total_volume: Number(e.target.value),
                    }));
                  }}
                />
              </div>
            </div>
          </div>
          <div className={"row d-center mt-3"}>
            <div className={"col-6"}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>총 유산소 시간</span>
                <input
                  type={"text"}
                  disabled={true}
                  className={"form-control"}
                  value={WORK?.work_total_cardio}
                  onChange={(e) => {
                    setWORK((prev) => ({
                      ...prev,
                      work_total_cardio: e.target.value,
                    }));
                  }}
                />
              </div>
            </div>
          </div>
          <div className={"row d-center mt-3"}>
            <div className={"col-6"}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>체중</span>
                <input
                  type={"text"}
                  className={"form-control"}
                  value={WORK?.work_body_weight}
                  onChange={(e) => {
                    setWORK((prev) => ({
                      ...prev,
                      work_body_weight: e.target.value,
                    }));
                  }}
                />
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    };
    return (
      <React.Fragment>
        {tableFragment()}
        <br />
        {tableTime()}
        <br />
        {tableRemain()}
      </React.Fragment>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} flowSave={flowSave} navParam={navParam}
        part={"work"} plan={""} type={"save"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className={"root-wrapper"}>
      <div className={"container-wrapper"}>
        <div className={"row d-center"}>
          <div className={"col-12 mb-20"}>
            <h1>Save</h1>
          </div>
          <div className={"col-12 mb-20"}>
            {dateNode()}
          </div>
          <div className={"col-12 mb-20"}>
            {handlerSectionCount()}
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

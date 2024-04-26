// ExerciseDetail.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useDate} from "../../assets/hooks/useDate.jsx";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";
import {Container, Table, Button, Row, Col, Card} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const ExerciseDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const customer_id = window.sessionStorage.getItem("customer_id");
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
      refresh: 0,
      startDt: "0000-00-00",
      endDt: "0000-00-00",
      toList:"/exercise/list",
      toDetail:"/exercise/detail",
      toUpdate:"/exercise/save",
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
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
  const OBJECT_DEFAULT = {
    _id: "",
    exercise_number: 0,
    exercise_startDt: "0000-00-00",
    exercise_endDt: "0000-00-00",
    exercise_start: "00:00",
    exercise_end: "00:00",
    exercise_time: "00:00",
    exercise_total_volume: 0,
    exercise_total_cardio: "00:00",
    exercise_body_weight: 0,
    exercise_section: [{
      exercise_part_idx: 0,
      exercise_part_val: "전체",
      exercise_title_idx: 0,
      exercise_title_val: "전체",
      exercise_set: 0,
      exercise_rep: 0,
      exercise_kg: 0,
      exercise_rest: 0,
      exercise_cardio: "00:00",
    }],
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

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

    const updatedSection = OBJECT.exercise_section?.map((section) => {
      sectionVolume = section.exercise_set * section.exercise_rep * section.exercise_kg;
      totalVolume += sectionVolume;
      totalMinutes += timeFormat(section.exercise_cardio);
      return {
        ...section,
        exercise_volume: sectionVolume
      };
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const cardioTime = `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;

    // 이전 상태와 비교
    if (OBJECT.exercise_total_volume !== totalVolume || OBJECT.exercise_total_cardio !== cardioTime) {
      setOBJECT((prev) => ({
        ...prev,
        exercise_total_volume: totalVolume,
        exercise_total_cardio: cardioTime,
        exercise_section: updatedSection,
      }));
    }
  }, [OBJECT.exercise_section]);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_OBJECT}/detail`, {
      params: {
        _id: location_id,
        customer_id: customer_id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setOBJECT(response.data.result || OBJECT_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0
    }));
  })()}, [location_id, customer_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id, section_id) => {
    const response = await axios.delete(`${URL_OBJECT}/delete`, {
      params: {
        _id: id,
        customer_id: customer_id,
        section_id: section_id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    if (response.data.status === "success") {
      alert(response.data.msg);
      if (Object.keys(response.data.result).length > 0) {
        setOBJECT(response.data.result);
      }
      else {
        navParam(SEND.toList);
      }
    }
    else {
      alert(response.data.msg);
    }
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <React.Fragment>
        <Table hover responsive variant={"light"} border={1}>
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
              <th>볼륨</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {OBJECT?.exercise_section?.map((section, index) => (
              <tr key={index} className={"fs-20 pt-20"}>
                {index === 0 && (
                  <React.Fragment>
                    <td rowSpan={OBJECT?.exercise_section?.length}>
                      {OBJECT?.exercise_startDt}
                    </td>
                    <td rowSpan={OBJECT?.exercise_section?.length}>
                      {OBJECT?.exercise_start}
                    </td>
                    <td rowSpan={OBJECT?.exercise_section?.length}>
                      {OBJECT?.exercise_end}
                    </td>
                    <td rowSpan={OBJECT?.exercise_section?.length}>
                      {OBJECT?.exercise_time}
                    </td>
                  </React.Fragment>
                )}
                <React.Fragment>
                  <td>{section.exercise_part_val}</td>
                  <td>
                    {section.exercise_title_val}
                  </td>
                </React.Fragment>
                {(section.exercise_part_val !== "유산소") ? (
                  <React.Fragment>
                    <td>{section.exercise_set}</td>
                    <td>{section.exercise_rep}</td>
                    <td>{section.exercise_kg}</td>
                    <td>{section.exercise_rest}</td>
                    <td>{section.exercise_volume}</td>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <td></td>
                    <td></td>
                    <td>{section.exercise_cardio}</td>
                    <td></td>
                    <td></td>
                  </React.Fragment>
                )}
                <td>
                  <p className={"pointer d-center text-danger fs-30 fw-bolder"} onClick={() => (
                    flowDelete(OBJECT._id, section._id)
                  )}>x</p>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={4}>총 볼륨</td>
              <td colSpan={3}></td>
              <td colSpan={4}>{OBJECT?.exercise_total_volume}</td>
              <td></td>
            </tr>
            <tr>
              <td colSpan={4}>총 유산소 시간</td>
              <td colSpan={3}></td>
              <td colSpan={4}>{OBJECT?.exercise_total_cardio}</td>
              <td></td>
            </tr>
            <tr>
              <td colSpan={4}>체중</td>
              <td colSpan={3}></td>
              <td colSpan={4}>{OBJECT?.exercise_body_weight}</td>
              <td></td>
            </tr>
          </tbody>
        </Table>
      </React.Fragment>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
        flowSave={""} navParam={navParam} part={"exercise"} plan={""} type={"detail"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"root-wrapper"}>
        <Card className={"container-wrapper"} border={"light"}>
          <Container>
            <Row>
            <Col xs={12} className={"mb-20 text-center"}>
              <h1>Detail</h1>
            </Col>
            <Col xs={12} className={"mb-20 text-center"}>
              {tableNode()}
            </Col>
            <Col xs={12} className={"mb-20 text-center"}>
              {buttonNode()}
            </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};
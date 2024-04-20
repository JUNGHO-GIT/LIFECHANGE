// ExerciseList.jsx

import axios from "axios";
import numeral from 'numeral';
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {CalendarNode} from "../../assets/fragments/CalendarNode.jsx";
import {PagingNode} from "../../assets/fragments/PagingNode.jsx";
import {FilterNode} from "../../assets/fragments/FilterNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";
import {Container, Table, Row, Col, Card} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const ExerciseList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_OBJECT = process.env.REACT_APP_URL_WORK;
  const customer_id = window.sessionStorage.getItem("customer_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname;

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      refresh: 0,
      startDt: "0000-00-00",
      endDt: "0000-00-00",
      toDetail: "/exercise/detail",
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
  const OBJECT_DEFAULT = [{
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
      exercise_volume: 0,
      exercise_cardio: "00:00",
    }],
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_OBJECT}/list`, {
      params: {
        customer_id: customer_id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
        FILTER: FILTER,
        PAGING: PAGING
      },
    });
    setOBJECT(response.data.result || OBJECT_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0,
    }));
  })()}, [customer_id, DATE.startDt, DATE.endDt, FILTER, PAGING]);

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
            </tr>
          </thead>
          <tbody className={"text-start"}>
            {OBJECT?.map((item, index) => (
              <React.Fragment key={item._id}>
                {item.exercise_section.slice(0, 3)?.map((section, sectionIndex) => (
                  <React.Fragment key={sectionIndex}>
                    <tr>
                      {sectionIndex === 0 && (
                        <React.Fragment>
                          <td rowSpan={Math.min(item.exercise_section.length, 3)}
                          className={"pointer"} onClick={() => {
                            SEND.id = item._id;
                            SEND.startDt = item.exercise_startDt;
                            SEND.endDt = item.exercise_endDt;
                            navParam(SEND.toDetail, {
                              state: SEND
                            });
                          }}>
                            {item.exercise_startDt}
                            {item.exercise_section.length > 3 && <div>더보기</div>}
                          </td>
                          <td rowSpan={Math.min(item.exercise_section.length, 3)}>
                            {item.exercise_start}
                          </td>
                          <td rowSpan={Math.min(item.exercise_section.length, 3)}>
                            {item.exercise_end}
                          </td>
                          <td rowSpan={Math.min(item.exercise_section.length, 3)}>
                            {item.exercise_time}
                          </td>
                        </React.Fragment>
                      )}
                      <React.Fragment>
                        <td>{section.exercise_part_val}</td>
                        <td>{section.exercise_title_val}</td>
                      </React.Fragment>
                      {(section.exercise_part_val !== "유산소") ? (
                        <React.Fragment>
                          <td>{`${numeral(section.exercise_set).format('0,0')}`}</td>
                          <td>{`${numeral(section.exercise_rep).format('0,0')}`}</td>
                          <td>{`${numeral(section.exercise_kg).format('0,0')}`}</td>
                          <td>{`${numeral(section.exercise_rest).format('0,0')}`}</td>
                          <td>{`${numeral(section.exercise_volume).format('0,0')}`}</td>
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
                    </tr>
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </React.Fragment>
    );
  };

  // 6. calendar ---------------------------------------------------------------------------------->
  const calendarNode = () => {
    return (
      <CalendarNode FILTER={FILTER} setFILTER={setFILTER} DATE={DATE} setDATE={setDATE}
        CALENDAR={CALENDAR} setCALENDAR={setCALENDAR}
      />
    );
  };

  // 7. paging ------------------------------------------------------------------------------------>
  const pagingNode = () => {
    return (
      <PagingNode PAGING={PAGING} setPAGING={setPAGING} COUNT={COUNT} setCOUNT={setCOUNT}
      />
    );
  };

  // 8. filter ------------------------------------------------------------------------------------>
  const filterNode = () => {
    return (
      <FilterNode FILTER={FILTER} setFILTER={setFILTER} PAGING={PAGING} setPAGING={setPAGING}
        part={"exercise"} plan={""} type={"list"}
      />
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} FILTER={FILTER} setFILTER={setFILTER} PAGING={PAGING} setPAGING={setPAGING}
        flowSave={""} navParam={navParam} part={"sleep"} plan={"plan"} type={"list"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"root-wrapper"}>
        <Card className={"container-wrapper"} border={"light"}>
          <Container>
            <Row className={"d-center"}>
            <Col xs={12} className={"mb-20"}>
              <h1>List</h1>
            </Col>
            <Col xs={12} className={"mb-20"}>
              {calendarNode()}
              {tableNode()}
            </Col>
            <Col xs={12} className={"mb-20"}>
              {filterNode()}
            </Col>
            <Col xs={12} className={"mb-20"}>
              {pagingNode()}
            </Col>
            <Col xs={12} className={"mb-20"}>
              {buttonNode()}
            </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};

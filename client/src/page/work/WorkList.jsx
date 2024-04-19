// WorkList.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {CalendarNode} from "../../assets/fragments/CalendarNode.jsx";
import {PagingNode} from "../../assets/fragments/PagingNode.jsx";
import {FilterNode} from "../../assets/fragments/FilterNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";
import {Container, Table, Row, Col, Card} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const WorkList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_OBJECT = process.env.REACT_APP_URL_WORK;
  const user_id = window.sessionStorage.getItem("user_id");
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
      toDetail: "/work/detail",
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
    work_number: 0,
    work_startDt: "0000-00-00",
    work_endDt: "0000-00-00",
    work_start: "00:00",
    work_end: "00:00",
    work_time: "00:00",
    work_total_volume: 0,
    work_total_cardio: "0000-00-00",
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
      work_cardio: "0000-00-00",
    }],
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_OBJECT}/list`, {
      params: {
        user_id: user_id,
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
  })()}, [user_id, DATE.startDt, DATE.endDt, FILTER, PAGING]);

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
          <tbody>
            {OBJECT?.map((item, index) => (
              <React.Fragment key={item._id}>
                {item.work_section.slice(0, 3)?.map((section, sectionIndex) => (
                  <React.Fragment key={sectionIndex}>
                    <tr>
                      {sectionIndex === 0 && (
                        <React.Fragment>
                          <td rowSpan={Math.min(item.work_section.length, 3)}
                          className={"pointer"} onClick={() => {
                            SEND.id = item._id;
                            SEND.startDt = item.work_startDt;
                            SEND.endDt = item.work_endDt;
                            navParam(SEND.toDetail, {
                              state: SEND
                            });
                          }}>
                            {item.work_startDt}
                            {item.work_section.length > 3 && <div>더보기</div>}
                          </td>
                          <td rowSpan={Math.min(item.work_section.length, 3)}>
                            {item.work_start}
                          </td>
                          <td rowSpan={Math.min(item.work_section.length, 3)}>
                            {item.work_end}
                          </td>
                          <td rowSpan={Math.min(item.work_section.length, 3)}>
                            {item.work_time}
                          </td>
                        </React.Fragment>
                      )}
                      <React.Fragment>
                        <td>{section.work_part_val}</td>
                        <td>{section.work_title_val}</td>
                      </React.Fragment>
                      {(section.work_part_val !== "유산소") ? (
                        <React.Fragment>
                          <td>{section.work_set}</td>
                          <td>{section.work_rep}</td>
                          <td>{section.work_kg}</td>
                          <td>{section.work_rest}</td>
                          <td>{section.work_volume}</td>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <td colSpan={5}>{section.work_cardio}</td>
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
        part={"work"} plan={""} type={"list"}
      />
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
        <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} flowSave={""} navParam={navParam}
        part={"work"} plan={""} type={"list"}
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

// SleepList.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../hooks/useStorage.jsx";
import {CalendarNode} from "../../fragments/CalendarNode.jsx";
import {PagingNode} from "../../fragments/PagingNode.jsx";
import {FilterNode} from "../../fragments/FilterNode.jsx";
import {ButtonNode} from "../../fragments/ButtonNode.jsx";
import {Container, Row, Col, Card, Table} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const SleepList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_SLEEP || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const customer_id = sessionStorage.getItem("customer_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [SEND, setSEND] = useState({
    id: "",
    refresh: 0,
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toDetail:"/sleep/detail"
  });
  const [DATE, setDATE] = useState({
    startDt: location_startDt,
    endDt: location_endDt
  });
  const [FILTER, setFILTER] = useState({
    order: "asc",
    type: "day",
    limit: 5,
    partIdx: 0,
    part: "전체",
    titleIdx: 0,
    title: "전체"
  });
  const [PAGING, setPAGING] = useState({
    page: 1,
    limit: 5
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0
  });
  const [CALENDAR, setCALENDAR] = useState({
    calStartOpen: false,
    calEndOpen: false,
    calOpen: false,
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEFAULT = [{
    _id: "",
    sleep_number: 0,
    sleep_startDt: "0000-00-00",
    sleep_endDt: "0000-00-00",
    sleep_section: [{
      sleep_night: "00:00",
      sleep_morning: "00:00",
      sleep_time: "00:00",
    }],
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_OBJECT}/list`, {
      params: {
        customer_id: customer_id,
        FILTER: FILTER,
        PAGING: PAGING,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`
      },
    });
    setOBJECT(response.data.result || OBJECT_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0
    }));
  })()}, [customer_id, FILTER, PAGING, DATE.startDt, DATE.endDt]);

  // 4. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const tableSection = () => (
      <React.Fragment>
        <Table hover responsive className={"border-1"}>
          <thead>
            <tr>
              <th className={"table-thead"}>날짜</th>
              <th className={"table-thead"}>취침</th>
              <th className={"table-thead"}>기상</th>
              <th className={"table-thead"}>수면</th>
            </tr>
          </thead>
          <tbody>
            {OBJECT?.map((item, index) => (
              <React.Fragment key={item._id}>
                {item.sleep_section?.slice(0, 3)?.map((section, sectionIndex) => (
                  <React.Fragment key={sectionIndex}>
                    <tr>
                      {sectionIndex === 0 && (
                        <td rowSpan={Math.min(item.sleep_section.length, 3)}
                        className={"pointer"} onClick={() => {
                          SEND.id = item._id;
                          SEND.startDt = item.sleep_startDt;
                          SEND.endDt = item.sleep_endDt;
                          navParam(SEND.toDetail, {
                            state: SEND
                          });
                        }}>
                          {item.sleep_startDt?.substring(5, 10)}
                          {item.sleep_section.length > 3 && (<div>더보기</div>)}
                        </td>
                      )}
                      <td>{section.sleep_night}</td>
                      <td>{section.sleep_morning}</td>
                      <td>{section.sleep_time}</td>
                    </tr>
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <div className={"table-wrapper"}>
          {tableSection()}
        </div>
      </React.Fragment>
    );
  };

  // 6. calendar ---------------------------------------------------------------------------------->
  const calendarNode = () => (
    <CalendarNode FILTER={FILTER} setFILTER={setFILTER} DATE={DATE} setDATE={setDATE}
      CALENDAR={CALENDAR} setCALENDAR={setCALENDAR}
    />
  );

  // 7. paging ------------------------------------------------------------------------------------>
  const pagingNode = () => (
    <PagingNode PAGING={PAGING} setPAGING={setPAGING} COUNT={COUNT} setCOUNT={setCOUNT}
      part={"sleep"} plan={""} type={"list"}
    />
  );

  // 8. filter ------------------------------------------------------------------------------------>
  const filterNode = () => (
    <FilterNode FILTER={FILTER} setFILTER={setFILTER} PAGING={PAGING} setPAGING={setPAGING}
      part={"sleep"} plan={""} type={"list"}
    />
  );

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => (
    <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
      SEND={SEND} FILTER={FILTER} setFILTER={setFILTER} PAGING={PAGING} setPAGING={setPAGING}
      flowSave={""} navParam={navParam} part={"sleep"} plan={"plan"} type={"list"}
    />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Card className={"card-wrapper"}>
        <Container fluid={true}>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
              {calendarNode()}
              {tableNode()}
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
              {filterNode()}
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
              {pagingNode()}
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
              {buttonNode()}
            </Col>
          </Row>
        </Container>
      </Card>
    </React.Fragment>
  );
};
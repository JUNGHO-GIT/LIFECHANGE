// MoneyList.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {CalendarNode} from "../../assets/fragments/CalendarNode.jsx";
import {PagingNode} from "../../assets/fragments/PagingNode.jsx";
import {FilterNode} from "../../assets/fragments/FilterNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";
import {Container, Table, FormGroup, FormLabel, Form, ButtonGroup, Button, CardGroup, Card, Row, Col} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const MoneyList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_MONEY = process.env.REACT_APP_URL_MONEY;
  const user_id = window.sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      startDt: "",
      endDt: "",
      refresh: 0,
      toDetail: "/money/detail",
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
  const MONEY_DEFAULT = [{
    _id: "",
    money_number: 0,
    money_startDt: "",
    money_endDt: "",
    money_section: [{
      money_part_idx: 0,
      money_part_val: "전체",
      money_title_idx: 0,
      money_title_val: "전체",
      money_amount: 0,
      money_content: "",
    }],
  }];
  const [MONEY, setMONEY] = useState(MONEY_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_MONEY}/list`, {
      params: {
        user_id: user_id,
        money_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
        FILTER: FILTER,
        PAGING: PAGING
      },
    });
    setMONEY(response.data.result || MONEY_DEFAULT);
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
        <Table hover responsive variant={"light"}>
          <thead className={"table-primary"}>
          <tr>
            <th>날짜</th>
            <th>분류</th>
            <th>항목</th>
            <th>금액</th>
            <th>내용</th>
          </tr>
        </thead>
        <tbody>
          {MONEY?.map((item, index) => (
            <React.Fragment key={item._id}>
              {item.money_section.slice(0, 3)?.map((section, sectionIndex) => (
                <React.Fragment key={section.money_part_idx}>
                  <tr>
                    {sectionIndex === 0 && (
                      <td rowSpan={item.money_section.length > 3 ? 4 : item.money_section.length}
                      className={"pointer"} onClick={() => {
                        SEND.id = item._id;
                        SEND.startDt = item.money_startDt;
                        SEND.endDt = item.money_endDt;
                        navParam(SEND.toDetail, { state: SEND });
                      }}>
                        {item.money_startDt}
                      </td>
                    )}
                    <td>{section.money_part_val}</td>
                    <td>{section.money_title_val}</td>
                    <td>{section.money_amount}</td>
                    <td>{section.money_content}</td>
                  </tr>
                </React.Fragment>
              ))}
              {item.money_section.length > 3 && (
                <tr>
                  <td colSpan={5}>...</td>
                </tr>
              )}
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
        part={"money"} plan={""} type={"list"}
      />
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
        <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} flowSave={""} navParam={navParam}
        part={"money"} plan={""} type={"list"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <CardGroup className={"root-wrapper"}>
        <Container fluid className={"container-wrapper"}>
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
      </CardGroup>
    </React.Fragment>
  );
};
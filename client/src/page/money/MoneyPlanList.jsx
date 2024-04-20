// MoneyPlanList.jsx

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
export const MoneyPlanList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_OBJECT = process.env.REACT_APP_URL_MONEY;
  const customer_id = window.sessionStorage.getItem("customer_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      refresh: 0,
      startDt: "0000-00-00",
      endDt: "0000-00-00",
      toDetail: "/money/plan/detail",
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
    money_startDt: "0000-00-00",
    money_endDt: "0000-00-00",
    money_plan_startDt: "0000-00-00",
    money_plan_endDt: "0000-00-00",
    money_total_in: 0,
    money_total_out: 0,
    money_plan_in: 0,
    money_plan_out: 0,
    money_diff_in: 0,
    money_diff_out: 0,
    money_diff_in_color: "",
    money_diff_out_color: "",
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_OBJECT}/plan/list`, {
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
    function tableFragment () {
      return (
        <Table hover responsive variant={"light"} border={1}>
          <thead className={"table-primary"}>
            <tr>
              <th>기간</th>
              <th>분류</th>
              <th>목표</th>
              <th>실제</th>
              <th>비교</th>
            </tr>
          </thead>
          <tbody className={"text-start"}>
            {OBJECT?.map((item, index) => (
              <React.Fragment key={item._id}>
                <tr>
                  <td rowSpan={3} className={"pointer"} onClick={() => {
                    SEND.id = item._id;
                    SEND.startDt = item.money_plan_startDt;
                    SEND.endDt = item.money_plan_endDt;
                    navParam(SEND.toDetail, {
                      state: SEND
                    });
                  }}>
                    {item.money_plan_startDt} ~ {item.money_plan_endDt}
                  </td>
                </tr>
                <tr>
                  <td>수입</td>
                  <td>{`₩  ${numeral(item.money_plan_in).format('0,0')}`}</td>
                  <td>{`₩  ${numeral(item.money_total_in).format('0,0')}`}</td>
                  <td className={item.money_diff_in_color}>{`₩  ${numeral(item.money_diff_in).format('0,0')}`}</td>
                </tr>
                <tr>
                  <td>지출</td>
                  <td>{`₩  ${numeral(item.money_plan_out).format('0,0')}`}</td>
                  <td>{`₩  ${numeral(item.money_total_out).format('0,0')}`}</td>
                  <td className={item.money_diff_out_color}>{`₩  ${numeral(item.money_diff_out).format('0,0')}`}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      );
    };
    return (
      <React.Fragment>
        {tableFragment()}
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
        part={"money"} plan={"plan"} type={"list"}
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
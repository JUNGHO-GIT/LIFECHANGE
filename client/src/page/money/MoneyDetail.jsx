// MoneyDetail.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useDate} from "../../assets/hooks/useDate.jsx";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";
import {Container, Table, FormGroup, FormLabel, Form, ButtonGroup, Button, CardGroup, Card, Row, Col} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const MoneyDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_MONEY = process.env.REACT_APP_URL_MONEY;
  const user_id = window.sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
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
      toList: "/money/list",
      toSave: "/money/save"
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
  const MONEY_DEFAULT = {
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
  };
  const [MONEY, setMONEY] = useState(MONEY_DEFAULT);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_MONEY}/detail`, {
      params: {
        _id: location_id,
        user_id: user_id,
        money_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setMONEY(response.data.result || MONEY_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0,
    }));
  })()}, [location_id, user_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id) => {
    const response = await axios.delete(`${URL_MONEY}/delete`, {
      params: {
        _id: id,
        user_id: user_id,
        money_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    if (response.data.status === "success") {
      const updatedData = await axios.get(`${URL_MONEY}/detail`, {
        params: {
          _id: location_id,
          user_id: user_id,
          money_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
        },
      });
      alert(response.data.msg);
      setMONEY(updatedData.data.result || MONEY_DEFAULT);
      updatedData.data.result === null && navParam(SEND.toList);
    }
    else {
      alert(response.data.msg);
    }
  };

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
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {MONEY?.money_section?.map((section, index) => (
            <tr key={index} className={"fs-20 pt-20"}>
              {index === 0 && (
                <React.Fragment>
                  <td rowSpan={MONEY?.money_section?.length}>
                    {MONEY?.money_startDt}
                  </td>
                </React.Fragment>
              )}
              <td>{section.money_part_val}</td>
              <td>{section.money_title_val}</td>
              <td>{section.money_amount}</td>
              <td>{section.money_content}</td>
              <td><Button variant={"danger"} size={"sm"} onClick={() => (
                flowDelete(section._id)
              )}>X</Button></td>
            </tr>
          ))}
        </tbody>
        </Table>
      </React.Fragment>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
        <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} flowSave={""} navParam={navParam}
        part={"money"} plan={""} type={"detail"}
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
              <h1>Detail</h1>
            </Col>
            <Col xs={12} className={"mb-20"}>
              {tableNode()}
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
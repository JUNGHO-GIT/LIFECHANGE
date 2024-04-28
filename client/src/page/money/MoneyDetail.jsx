// MoneyDetail.jsx

import axios from "axios";
import numeral from 'numeral';
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {percent} from "../../assets/js/percent.js";
import {useDate} from "../../assets/hooks/useDate.jsx";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {ButtonNode} from "../../fragments/ButtonNode.jsx";
import {Container, Row, Col, Card, Table, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const MoneyDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const customer_id = sessionStorage.getItem("customer_id");
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
      refresh: 0,
      startDt: "0000-00-00",
      endDt: "0000-00-00",
      toDetail: "/money/detail",
      toList: "/money/list",
      toUpdate: "/money/save",
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
    money_number: 0,
    money_startDt: "0000-00-00",
    money_endDt: "0000-00-00",
    money_total_in: 0,
    money_total_out: 0,
    money_section: [{
      money_part_idx: 0,
      money_part_val: "전체",
      money_title_idx: 0,
      money_title_val: "전체",
      money_amount: 0,
      money_content: "",
    }],
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_OBJECT}/detail`, {
      params: {
        customer_id: customer_id,
        _id: location_id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setOBJECT(response.data.result || OBJECT_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0,
    }));
  })()}, [location_id, customer_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id, section_id) => {
    const response = await axios.delete(`${URL_OBJECT}/delete`, {
      params: {
        customer_id: customer_id,
        _id: id,
        section_id: section_id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    if (response.data.status === "success") {
      alert(response.data.msg);
      percent();
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
              <th className={"w-10"}>날짜</th>
              <th>분류</th>
              <th>항목</th>
              <th>금액</th>
              <th>내용</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {OBJECT?.money_section?.map((section, index) => (
              <tr key={index}>
                {index === 0 && (
                  <React.Fragment>
                    <td rowSpan={OBJECT?.money_section?.length}>
                      {OBJECT?.money_startDt?.substring(5, 10)}
                    </td>
                  </React.Fragment>
                )}
                <td>{section.money_part_val}</td>
                <td>{section.money_title_val}</td>
                <td>{`₩ ${numeral(section.money_amount).format('0,0')}`}</td>
                <td>{section.money_content}</td>
                <td>
                  <p className={"del-btn"} onClick={() => (
                    flowDelete(OBJECT._id, section._id)
                  )}>x</p>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={3}>수입 합계</td>
              <td>{`₩ ${numeral(OBJECT?.money_total_in).format('0,0')}`}</td>
              <td colSpan={3}></td>
            </tr>
            <tr>
              <td colSpan={3}>지출 합계</td>
              <td>{`₩ ${numeral(OBJECT?.money_total_out).format('0,0')}`}</td>
              <td colSpan={3}></td>
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
        flowSave={""} navParam={navParam} part={"money"} plan={""} type={"detail"}
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
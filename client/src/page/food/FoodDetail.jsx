// FoodDetail.jsx

import axios from "axios";
import numeral from 'numeral';
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {percent} from "../../assets/js/percent.js";
import {useDate} from "../../hooks/useDate.jsx";
import {useStorage} from "../../hooks/useStorage.jsx";
import {ButtonNode} from "../../fragments/ButtonNode.jsx";
import {Container, Row, Col, Card, Table} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const FoodDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const customer_id = sessionStorage.getItem("customer_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [SEND, setSEND] = useState({
      id: "",
      refresh: 0,
      startDt: "0000-00-00",
      endDt: "0000-00-00",
      toList:"/food/list",
      toDetail:"/food/detail",
      toUpdate:"/food/save",
   });
  const [DATE, setDATE] = useState({
    startDt: location_startDt,
    endDt: location_endDt
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
  const OBJECT_DEFAULT = {
    _id: "",
    food_number: 0,
    food_startDt: "0000-00-00",
    food_endDt: "0000-00-00",
    food_total_kcal: 0,
    food_total_fat: 0,
    food_total_carb: 0,
    food_total_protein: 0,
    food_section: [{
      food_part_idx: 1,
      food_part_val: "아침",
      food_title: "",
      food_count: 0,
      food_serv: "회",
      food_gram:  0,
      food_kcal: 0,
      food_fat: 0,
      food_carb: 0,
      food_protein: 0,
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

  // 4. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const tableSection = () => (
      <React.Fragment>
          <Table hover responsive className={"border-1"}>
            <thead>
              <tr>
                <th className={"table-thead"}>날짜</th>
                <th className={"table-thead"}>분류</th>
                <th className={"table-thead"}>식품</th>
                <th className={"table-thead"}>kcal</th>
                <th className={"table-thead"}>carb</th>
                <th className={"table-thead"}>protein</th>
                <th className={"table-thead"}>fat</th>
                <th className={"table-thead"}>x</th>
              </tr>
            </thead>
            <tbody>
              {OBJECT?.food_section?.map((section, index) => (
                <tr key={index}>
                  {index === 0 && (
                    <td rowSpan={OBJECT?.food_section?.length}>
                      {OBJECT?.food_startDt?.substring(5, 10)}
                    </td>
                  )}
                  <td>{section.food_part_val}</td>
                  <td>
                    <p>{`${section.food_title} (${section.food_brand || ""})`}</p>
                    <p>{`${numeral(section.food_gram * section.food_count).format('0,0')} g`}</p>
                  </td>
                  <td>{`${numeral(section.food_kcal).format('0,0')}`}</td>
                  <td>{`${numeral(section.food_carb).format('0,0')}`}</td>
                  <td>{`${numeral(section.food_protein).format('0,0')}`}</td>
                  <td>{`${numeral(section.food_fat).format('0,0')}`}</td>
                  <td><p className={"del-btn"} onClick={() => (
                    flowDelete(OBJECT._id, section._id)
                  )}>x</p></td>
                </tr>
              ))}
              <tr>
                <td colSpan={3}>합계</td>
                <td>{`${numeral(OBJECT?.food_total_kcal).format('0,0')} kcal`}</td>
                <td>{`${numeral(OBJECT?.food_total_carb).format('0,0')} g`}</td>
                <td>{`${numeral(OBJECT?.food_total_protein).format('0,0')} g`}</td>
                <td>{`${numeral(OBJECT?.food_total_fat).format('0,0')} g`}</td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </React.Fragment>
      );
    return (
      <React.Fragment>
        <div className={"detail-wrapper over-x-auto"}>
          {tableSection()}
        </div>
      </React.Fragment>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => (
    <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
      SEND={SEND} FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={""} navParam={navParam} part={"food"} plan={""} type={"detail"}
    />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Card className={"card-wrapper"}>
        <Container fluid={true}>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
              {tableNode()}
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

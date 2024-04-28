// FoodDetail.jsx

import axios from "axios";
import numeral from 'numeral';
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useDate} from "../../assets/hooks/useDate.jsx";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {ButtonNode} from "../../fragments/ButtonNode.jsx";
import {Container, Row, Col, Card, Table, Button} from "react-bootstrap";

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
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      refresh: 0,
      startDt: "0000-00-00",
      endDt: "0000-00-00",
      toList:"/food/list",
      toDetail:"/food/detail",
      toUpdate:"/food/save",
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
              <th>식품</th>
              <th>수량</th>
              <th>중량</th>
              <th>칼로리</th>
              <th>탄수화물</th>
              <th>단백질</th>
              <th>지방</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {OBJECT?.food_section?.map((section, index) => (
              <tr key={index}>
                {index === 0 && (
                  <td rowSpan={OBJECT?.food_section?.length}>
                    {OBJECT?.food_startDt.substring(5, 10)}
                  </td>
                )}
                <td>{section.food_part_val}</td>
                <td>{`${section.food_title} (${section.food_brand || ""})`}</td>
                <td>{section.food_count} {section.food_serv}</td>
                <td>{section.food_gram}</td>
                <td>{`${numeral(section.food_kcal).format('0,0')}`}</td>
                <td>{`${numeral(section.food_carb).format('0,0')}`}</td>
                <td>{`${numeral(section.food_protein).format('0,0')}`}</td>
                <td>{`${numeral(section.food_fat).format('0,0')}`}</td>
                <td>
                  <p className={"del-btn"} onClick={() => (
                    flowDelete(OBJECT._id, section._id)
                  )}>x</p>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={4}>합계</td>
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
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
        flowSave={""} navParam={navParam} part={"food"} plan={""} type={"detail"}
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
                {OBJECT?.food_startDt}
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

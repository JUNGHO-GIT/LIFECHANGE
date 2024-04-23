// DiaryList.jsx

import moment from "moment";
import axios from "axios";
import React, {useState, useEffect} from "react";
import Calendar from "react-calendar";
import {DiaryDetail} from "./DiaryDetail.jsx";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {Container, Row, Col, Card, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const DiaryList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_DIARY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const customer_id = window.sessionStorage.getItem("customer_id");
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: moment().startOf("month").format("YYYY-MM-DD"),
      endDt: moment().endOf("month").format("YYYY-MM-DD"),
    }
  );
  const {val:isOpen, set:setIsOpen} = useStorage(
    `isOpen(${PATH})`, false
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEFAULT = [{
    customer_id: customer_id,
    diary_number: 0,
    diary_startDt: "0000-00-00",
    diary_endDt: "0000-00-00",
    diary_category: "",
    diary_title: "",
    diary_detail: ""
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_OBJECT}/list`, {
      params: {
        customer_id: customer_id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setOBJECT(response.data.result || OBJECT_DEFAULT);
  })()}, [location_id, customer_id, DATE.startDt, DATE.endDt]);

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <React.Fragment>
        <Calendar
          locale={"ko-KR"}
          value={new Date()}
          showNavigation={true}
          showNeighboringMonth={true}
          view={"month"}
          onChange={(date) => {
            setDATE((prev) => ({
              ...prev,
              startDt: moment(date?.toString()).format("YYYY-MM-DD"),
              endDt: moment(date?.toString()).format("YYYY-MM-DD"),
            }));
          }}
          tileClassName={}
        />
        <DiaryDetail
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          startDt={DATE.startDt}
          endDt={DATE.endDt}
        />
      </React.Fragment>
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
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
}
// DateNode.jsx

import React, {useEffect} from "react";
import DatePicker from "react-datepicker";
import moment from "moment-timezone";
import {ko} from "date-fns/locale";
import {Container, Row, Col} from "react-bootstrap";

// 4. date ---------------------------------------------------------------------------------------->
export const DateNode = ({
  DATE, setDATE, part, plan, type
}) => {

  // 0. useEffect --------------------------------------------------------------------------------->
  useEffect(() => {
    // endDt가 startDt보다 작을 경우 endDt를 startDt로 설정
    if (moment(DATE.endDt).isBefore(DATE.startDt)) {
      setDATE((prev) => ({
        ...prev,
        endDt: DATE.startDt
      }));
    }
  }, [DATE.startDt, DATE.endDt]);

  // 1. planDate
  const planDate = () => (
    <React.Fragment>
      <Row className={"d-center"}>
        <Col lg={6} md={6} sm={6} xs={6}>
          <div className={"input-group"}>
            <span className={"input-group-text"}>시작</span>
            <DatePicker
              className={"form-control pointer"}
              locale={ko}
              dateFormat={"yyyy-MM-dd"}
              selected={new Date(DATE.startDt)}
              onChangeRaw={(e) => e.preventDefault()}
              onChange={(date) => {
                setDATE((prev) => ({
                  ...prev,
                  startDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD")
                }));
              }}
              popperPlacement={"bottom-start"}
            ></DatePicker>
          </div>
        </Col>
        <Col lg={6} md={6} sm={6} xs={6}>
          <div className={"input-group"}>
            <span className={"input-group-text"}>종료</span>
            <DatePicker
              className={"form-control pointer"}
              locale={ko}
              dateFormat={"yyyy-MM-dd"}
              selected={new Date(DATE.endDt)}
              onChangeRaw={(e) => e.preventDefault()}
              onChange={(date) => {
                setDATE((prev) => ({
                  ...prev,
                  endDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD")
                }));
              }}
              popperPlacement={"bottom-start"}
            ></DatePicker>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );

  // 2. realDate
  const realDate = () => (
    <React.Fragment>
      <Row className={"d-center"}>
        <Col lg={12} md={12} sm={12} xs={12}>
          <div className={"input-group"}>
            <span className={"input-group-text"}>날짜</span>
            <DatePicker
              className={"form-control pointer"}
              locale={ko}
              dateFormat={"yyyy-MM-dd"}
              selected={new Date(DATE.startDt)}
              onChangeRaw={(e) => e.preventDefault()}
              onChange={(date) => {
                setDATE((prev) => ({
                  ...prev,
                  startDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"),
                  endDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD")
                }));
              }}
              popperPlacement={"bottom-start"}
            ></DatePicker>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );

  // 3. return
  return (
    <React.Fragment>
      {part === "diary" && plan === "" ? (
        planDate()
      ) : part !== "diary" && plan === "" ? (
        realDate()
      ) : part !== "diary" && plan === "plan" ? (
        planDate()
      ) : null}
    </React.Fragment>
  );
};
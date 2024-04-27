// DateNode.jsx

import React, {forwardRef, useEffect} from "react";
import DatePicker from "react-datepicker";
import moment from "moment-timezone";
import {ko} from "date-fns/locale";
import {Button, Col, Row, Container} from "react-bootstrap";

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

  // @ts-ignore
  const CustomInput = forwardRef(({value, onClick}, ref) => (
    <Button className={"form-control"} onClick={onClick} ref={ref} variant={"outline-secondary"} type={"button"}>
      {value}
    </Button>
  ));

  // 0. datePicker
  const datePickerNode = (onChange, label, value) => (
    <React.Fragment>
      <div className={"input-group d-block"}>
        <div className={"d-inline-flex"}>
          <span className={"input-group-text"}>{label}</span>
          <DatePicker
            locale={ko}
            dateFormat={"yyyy-MM-dd"}
            selected={new Date(value)}
            customInput={<CustomInput />}
            onChange={(date) => (onChange(date))}
            popperPlacement={"bottom-start"}
            popperProps={{
              strategy: "fixed"
            }}
          />
        </div>
      </div>
    </React.Fragment>
  );

  // 1. realDate
  const realDate = () => (
    <React.Fragment>
      <Container className={"d-inline-flex d-center"}>
        <Row>
          <Col lg={12} md={12} sm={12} xs={12}>
            {datePickerNode((date) => {
              setDATE((prev) => ({
                ...prev,
                startDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"),
                endDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"),
              }));
            }, "날짜", DATE.startDt)}
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );

  // 2. planDate
  const planDate = () => (
    <React.Fragment>
      <Container className={"d-inline-flex d-center"}>
        <Row>
          <Col lg={6} md={6} sm={6} xs={12}>
            {datePickerNode((date) => {
              setDATE((prev) => ({
                ...prev,
                startDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD")
              }));
            }, "시작", DATE.startDt)}
          </Col>
          <Col lg={6} md={6} sm={6} xs={12}>
            {datePickerNode((date) => {
              setDATE((prev) => ({
                ...prev,
                endDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD")
              }));
            }, "종료", DATE.endDt)}
          </Col>
        </Row>
      </Container>
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
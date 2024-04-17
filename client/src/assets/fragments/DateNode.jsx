// DateNode.jsx

import React, {forwardRef} from "react";
import DatePicker from "react-datepicker";
import moment from "moment-timezone";
import {ko} from "date-fns/locale";
import {BiCaretLeft, BiCaretRight} from "react-icons/bi";
import {Container, Table, FormGroup, Form, ButtonGroup, Button, Row, Col} from "react-bootstrap";

// 4. date ---------------------------------------------------------------------------------------->
export const DateNode = ({
  DATE, setDATE, part, plan, type
}) => {

  // @ts-ignore
  const CustomInput = forwardRef(({value, onClick}, ref) => (
    <Button className={"form-control pointer fw-bold"} onClick={onClick} ref={ref}>
      {value}
    </Button>
  ));

  function calcDate (days) {
    const date = new Date(DATE.startDt);
    date.setDate(date.getDate() + days);
    setDATE((prev) => ({
      ...prev,
      startDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"),
      endDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"),
    }));
  };

  const datePickerNode = (label, value, onChange, placement) => (
    <FormGroup className="date-picker-container">
      <Form.Label className="me-2">{label}</Form.Label>
      <DatePicker
        locale={ko}
        dateFormat="yyyy-MM-dd"
        popperPlacement={placement}
        className="form-control"
        selected={new Date(value)}
        customInput={<CustomInput />}
        onChange={(date) => onChange(date)}
      />
    </FormGroup>
  );

  const realDate = () => (
    <FormGroup className="d-inline-flex flex-wrap">
      {type === "save" && (
        <FormGroup onClick={() => calcDate(-1)}>
          <BiCaretLeft className="me-2 mt-10 fs-15 pointer" />
        </FormGroup>
      )}
      {datePickerNode("날짜", DATE.startDt, (date) => {
        setDATE((prev) => ({
          ...prev,
          startDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"),
          endDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"),
        }));
      }, "bottom")}
      {type === "save" && (
        <FormGroup onClick={() => calcDate(1)}>
          <BiCaretRight className="ms-2 mt-10 fs-15 pointer" />
        </FormGroup>
      )}
    </FormGroup>
  );

  const planDate = () => (
    <FormGroup className="date-picker-container">
      {datePickerNode("시작일", DATE.startDt, (date) => {
        setDATE((prev) => ({
          ...prev,
          startDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD")
        }));
      }, "bottom")}
      <FormGroup className={"w-10"}></FormGroup>
      {datePickerNode("종료일", DATE.endDt, (date) => {
        setDATE((prev) => ({
          ...prev,
          endDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD")
        }));
      }, "top")}
    </FormGroup>
  );

  return (
    <FormGroup className="d-inline-flex flex-wrap">
      {plan === "plan" ? planDate() : realDate()}
    </FormGroup>
  );
};
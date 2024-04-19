// DateNode.jsx

import React, {forwardRef} from "react";
import DatePicker from "react-datepicker";
import moment from "moment-timezone";
import {ko} from "date-fns/locale";
import {BiCaretLeft, BiCaretRight} from "react-icons/bi";
import {Container, Table, FormGroup, FormCheck, Form, ButtonGroup, Button, CardGroup, Card, Row, Col} from "react-bootstrap";

// 4. date ---------------------------------------------------------------------------------------->
export const DateNode = ({
  DATE, setDATE, part, plan, type
}) => {

  // @ts-ignore
  const CustomInput = forwardRef(({value, onClick}, ref) => (
    <Button className={"form-control pointer fw-bold"} onClick={onClick} ref={ref} variant={"outline-primary"} size={"lg"} type={"button"}>
      {value}
    </Button>
  ));

  const datePickerNode = (label, value, onChange, placement) => (
    <React.Fragment>
      <FormGroup className={"input-group"}>
        <span className="input-group-text">{label}</span>
        <DatePicker
          locale={ko}
          dateFormat={"yyyy-MM-dd"}
          popperPlacement={placement}
          className={"form-control"}
          selected={new Date(value)}
          customInput={<CustomInput />}
          onChange={(date) => onChange(date)}
        />
      </FormGroup>
    </React.Fragment>
  );

  const realDate = () => (
    <React.Fragment>
      {datePickerNode("날짜", DATE.startDt, (date) => {
        setDATE((prev) => ({
          ...prev,
          startDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"),
          endDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"),
        }));
      }, "bottom")}
    </React.Fragment>
  );

  const planDate = () => (
    <React.Fragment>
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
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <FormGroup className="d-inline-flex">
        {plan === "plan" ? planDate() : realDate()}
      </FormGroup>
    </React.Fragment>
  );
};
// DateNode.jsx

import React, {forwardRef} from "react";
import DatePicker from "react-datepicker";
import moment from "moment-timezone";
import {ko} from "date-fns/locale";
import {BiCaretLeft, BiCaretRight} from "react-icons/bi";

// 4. date ---------------------------------------------------------------------------------------->
export const DateNode = ({
  DATE, setDATE, part, plan, type
}) => {

  // @ts-ignore
  const CustomInput = forwardRef(({value, onClick}, ref) => (
    <button className={"form-control pointer fw-bold"} onClick={onClick} ref={ref}>
      {value}
    </button>
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
    <div className="date-picker-container">
      <span className="input-group-text">{label}</span>
      <DatePicker
        locale={ko}
        dateFormat="yyyy-MM-dd"
        popperPlacement={placement}
        className="form-control"
        selected={new Date(value)}
        customInput={<CustomInput />}
        onChange={(date) => onChange(date)}
      />
    </div>
  );

  const realDate = () => (
    <div className="d-inline-flex flex-wrap">
      {type === "save" && (
        <div onClick={() => calcDate(-1)}>
          <BiCaretLeft className="me-2 mt-1 fs-5 pointer" />
        </div>
      )}
      {datePickerNode("날짜", DATE.startDt, (date) => {
        setDATE((prev) => ({
          ...prev,
          startDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"),
          endDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"),
        }));
      }, "bottom")}
      {type === "save" && (
        <div onClick={() => calcDate(1)}>
          <BiCaretRight className="ms-2 mt-1 fs-5 pointer" />
        </div>
      )}
    </div>
  );

  const planDate = () => (
    <div className="date-picker-container">
      {datePickerNode("시작일", DATE.startDt, (date) => {
        setDATE((prev) => ({
          ...prev,
          startDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD")
        }));
      }, "bottom")}
      <div className={"w-10"}></div>
      {datePickerNode("종료일", DATE.endDt, (date) => {
        setDATE((prev) => ({
          ...prev,
          endDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD")
        }));
      }, "top")}
    </div>
  );

  return (
    <div className="d-inline-flex flex-wrap">
      {plan === "plan" ? planDate() : realDate()}
    </div>
  );
};
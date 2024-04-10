// DateNode.jsx

import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment-timezone";
import {BiCaretLeft, BiCaretRight} from "react-icons/bi";

// 4. date ---------------------------------------------------------------------------------------->
export const DateNode = ({
  strDate, setStrDate
}) => {

  function calcDate (days) {
    const date = new Date(strDate);
    date.setDate(date.getDate() + days);
    setStrDate(moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"));
  };

  return (
    <div className="d-inline-flex">
      <div onClick={() => calcDate(-1)}>
        <BiCaretLeft className="me-10 mt-10 fs-20 pointer" />
      </div>
      <DatePicker
        dateFormat="yyyy-MM-dd"
        popperPlacement="bottom"
        selected={new Date(strDate)}
        onChange={(date) => {
          setStrDate(moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"));
        }}
      />
      <div onClick={() => calcDate(1)}>
        <BiCaretRight className="ms-10 mt-10 fs-20 pointer" />
      </div>
    </div>
  );
};
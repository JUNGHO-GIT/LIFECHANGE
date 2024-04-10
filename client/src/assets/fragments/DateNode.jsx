// DateNode.jsx

import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment-timezone";
import {BiCaretLeft, BiCaretRight} from "react-icons/bi";

// 4. date ---------------------------------------------------------------------------------------->
export const DateNode = ({
  strDate, setStrDate, type
}) => {

  function calcDate (days) {
    const date = new Date(strDate);
    date.setDate(date.getDate() + days);
    setStrDate(moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"));
  };

  function picker () {
    return (
      <div className="d-inline-flex">
        {type === "save" ? (
          <div onClick={() => (calcDate(-1))}>
            <BiCaretLeft className="me-10 mt-10 fs-20 pointer" />
          </div>
        ) : null}
        <DatePicker dateFormat="yyyy-MM-dd" popperPlacement="bottom" selected={new Date(strDate)}
        disabled={type === "save" ? false : true} onChange={(date) => {
          setStrDate(moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"));
        }}/>
        {type === "save" ? (
          <div onClick={() => (calcDate(1))}>
            <BiCaretRight className="ms-10 mt-10 fs-20 pointer" />
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <React.Fragment>
      {picker()}
    </React.Fragment>
  );
};
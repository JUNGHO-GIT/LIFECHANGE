// DateNode.jsx

import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment-timezone";
import {BiCaretLeft, BiCaretRight} from "react-icons/bi";

// 4. date ---------------------------------------------------------------------------------------->
export const DateNode = ({
  DATE, setDATE, part, plan, type
}) => {

  function calcDate (days) {
    const date = new Date(DATE.startDt);
    date.setDate(date.getDate() + days);
    setDATE((prev) => ({
      ...prev,
      startDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"),
      endDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"),
    }));
  };

  function picker () {
    return (
      <div className={"d-inline-flex"}>

        {type === "save" ? (
          <div onClick={() => (calcDate(-1))}>
            <BiCaretLeft className={"me-10 mt-10 fs-20 pointer"} />
          </div>
        ) : null}

        <DatePicker dateFormat="yyyy-MM-dd"
          popperPlacement="bottom"
          selected={new Date(DATE.startDt)}
          disabled={type === "save" ? false : true}
          value={DATE.startDt}
          onChange={(date) => {
            setDATE((prev) => ({
              ...prev,
              startDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"),
              endDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"),
            }));
          }}
        />

        {type === "save" ? (
          <div onClick={() => (calcDate(1))}>
            <BiCaretRight className={"ms-10 mt-10 fs-20 pointer"} />
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
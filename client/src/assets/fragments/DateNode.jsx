// DateNode.jsx

import React, {forwardRef} from "react";
import DatePicker from "react-datepicker";
import moment from "moment-timezone";
import {ko} from "date-fns/locale";
import {Button} from "react-bootstrap";

// 4. date ---------------------------------------------------------------------------------------->
export const DateNode = ({
  DATE, setDATE, part, plan, type
}) => {

  // @ts-ignore
  const CustomInput = forwardRef(({value, onClick}, ref) => (
    <Button className={"pointer fw-bold"} onClick={onClick} ref={ref} variant={"outline-secondary"} size={"lg"} type={"button"}>
      {value}
    </Button>
  ));

  // 0. datePicker
  const datePickerNode = (onChange, label, value) => (
    <React.Fragment>
      <div className={"d-inline-flex"}>
        <div className={"input-group"}>
          <span className="input-group-text">{label}</span>
          <DatePicker
            locale={ko}
            dateFormat={"yyyy-MM-dd"}
            className={"form-control"}
            popperPlacement={"bottom-start"}
            popperProps={{
              strategy: "fixed"  // 팝업의 위치를 고정
            }}
            popperModifiers={[
              {
                name: "preventOverflow",
                options: {
                  altBoundary: true,
                  tether: false,
                  rootBoundary: "viewport",
                  padding: 8
                }
              },
              {
                name: "flip",
                options: {
                  behavior: ["bottom", "top"],  // 위 또는 아래로 펼칠 수 있도록 설정
                  boundary: "viewport"
                }
              }
            ]}
            selected={new Date(value)}
            customInput={<CustomInput />}
            onChange={(date) => (onChange(date))}
          />
        </div>
      </div>
    </React.Fragment>
  );

  // 1. realDate
  const realDate = () => (
    <React.Fragment>
      {datePickerNode((date) => {
        setDATE((prev) => ({
          ...prev,
          startDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"),
          endDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"),
        }));
      }, "날짜", DATE.startDt)}
    </React.Fragment>
  );

  // 2. planDate
  const planDate = () => (
    <React.Fragment>
      {datePickerNode((date) => {
        setDATE((prev) => ({
          ...prev,
          startDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD")
        }));
      }, "시작일", DATE.startDt)}
      <div className={"w-10"}></div>
      {datePickerNode((date) => {
        setDATE((prev) => ({
          ...prev,
          endDt: moment(date).tz("Asia/Seoul").format("YYYY-MM-DD")
        }));
      }, "종료일", DATE.endDt)}
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
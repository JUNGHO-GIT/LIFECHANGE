// FilterNode.jsx

import React from "react";
import {Container, Table, FormGroup, Form, ButtonGroup, Button, Row, Col, Collapse} from "react-bootstrap";

// 8. filter  ------------------------------------------------------------------------------------->
export const FilterNode = ({
  FILTER, setFILTER, PAGING, setPAGING, part, plan, type
}) => {

  // 1. default
  const defaultNode = () => {
    function selectType() {
      return (
        <FormGroup className={"mb-3"}>
          <select className={"form-select"} id={"type"} onChange={(e) => (
            setFILTER((prev) => ({
              ...prev,
              type: e.target.value
            }))
          )}>
            {["day", "week", "month", "year", "select"]?.map((item) => (
              <option key={item} value={item} selected={FILTER.type === item}>
                {item}
              </option>
            ))}
          </select>
        </FormGroup>
      );
    };
    function selectOrder() {
      return (
        <FormGroup className={"mb-3"}>
          <select className={"form-select"} id={"order"} onChange={(e) => (
            setFILTER((prev) => ({
              ...prev,
              order: e.target.value
            }))
          )}>
            <option value="asc" selected>오름차순</option>
            <option value="desc">내림차순</option>
          </select>
        </FormGroup>
      );
    };
    function selectLimit() {
      return (
        <FormGroup className={"mb-3"}>
          <select className={"form-select"} id={"limit"} onChange={(e) => (
            setPAGING((prev) => ({
              ...prev,
              limit: parseInt(e.target.value)
            })),
            setFILTER((prev) => ({
              ...prev,
              limit: parseInt(e.target.value)
            }))
          )}>
            <option value="5" selected>5</option>
            <option value="10">10</option>
          </select>
        </FormGroup>
      );
    };
    return (
      <React.Fragment>
        {selectType()}
        {selectOrder()}
        {selectLimit()}
      </React.Fragment>
    );
  };

  // 2. food
  const foodNode = () => {
    const session = window.sessionStorage.getItem("dataset") || "";
    const foodArray = JSON.parse(session).food;
    function selectPartFood () {
      return (
        <FormGroup className={"mb-3"}>
          <select className={"form-control"} id={"part"} value={foodArray[FILTER.partIdx].money_part} onChange={(e) => {
            const selectedOption = e.target.options[e.target.selectedIndex];
            const idxValue = selectedOption.getAttribute("data-idx");
            const newPartIndex = Number(idxValue);
            const newPartVal = String(e.target.value);
            const newTitleVal = foodArray[newPartIndex].food_title[0];
            setFILTER((prev) => ({
              ...prev,
              partIdx: newPartIndex,
              part: newPartVal,
              title: newTitleVal
            }));
          }}>
            {foodArray?.map((item, idx) => (
              <option key={idx} data-idx={idx}>
                {item.food_part}
              </option>
            ))}
          </select>
        </FormGroup>
      );
    };
    return (
      <React.Fragment>
        {selectPartFood()}
      </React.Fragment>
    );
  };

  // 3. money
  const moneyNode = () => {
    const session = window.sessionStorage.getItem("dataset") || "";
    const moneyArray = JSON.parse(session).money;
    function selectPartMoney () {
      return (
        <FormGroup className={"mb-3"}>
          <select className={"form-control"} id={"part"} value={moneyArray[FILTER.partIdx].money_part} onChange={(e) => {
            const selectedOption = e.target.options[e.target.selectedIndex];
            const idxValue = selectedOption.getAttribute("data-idx");
            const newPartIndex = Number(idxValue);
            const newPartVal = String(e.target.value);
            const newTitleVal = moneyArray[newPartIndex].money_title[0];
            setFILTER((prev) => ({
              ...prev,
              partIdx: newPartIndex,
              part: newPartVal,
              title: newTitleVal
            }));
          }}>
            {moneyArray?.map((item, idx) => (
              <option key={idx} data-idx={idx}>
                {item.money_part}
              </option>
            ))}
          </select>
        </FormGroup>
      );
    };
    function selectTitleMoney () {
      return (
        <FormGroup className={"mb-3"}>
          <select className={"form-control"} id={"title"} value={FILTER.title} onChange={(e) => {
            setFILTER((prev) => ({
              ...prev,
              title: e.target.value
            }));
          }}>
            {moneyArray[FILTER.partIdx].money_title?.map((item, idx) => (
              <option key={idx}>
                {item}
              </option>
            ))}
          </select>
        </FormGroup>
      );
    };
    return (
      <React.Fragment>
        {selectPartMoney()}
        {selectTitleMoney()}
      </React.Fragment>
    );
  };

  // 4. work
  const workNode = () => {
    const session = window.sessionStorage.getItem("dataset") || "";
    const workArray = JSON.parse(session).work;
    function selectPartWork () {
      return (
        <FormGroup className={"mb-3"}>
          <select className={"form-control"} id={"part"} value={workArray[FILTER.partIdx].work_part} onChange={(e) => {
            const selectedOption = e.target.options[e.target.selectedIndex];
            const idxValue = selectedOption.getAttribute("data-idx");
            const newPartIndex = Number(idxValue);
            const newPartVal = String(e.target.value);
            const newTitleVal = workArray[newPartIndex].work_title[0];
            setFILTER((prev) => ({
              ...prev,
              partIdx: newPartIndex,
              part: newPartVal,
              title: newTitleVal
            }));
          }}>
            {workArray?.map((item, idx) => (
              <option key={idx} data-idx={idx}>
                {item.work_part}
              </option>
            ))}
          </select>
        </FormGroup>
      );
    };
    function selectTitleWork () {
      return (
        <FormGroup className={"mb-3"}>
          <select className={"form-control"} id={"title"} value={FILTER.title} onChange={(e) => {
            setFILTER((prev) => ({
              ...prev,
              title: e.target.value
            }));
          }}>
            {workArray[FILTER.partIdx].work_title?.map((item, idx) => (
              <option key={idx}>
                {item}
              </option>
            ))}
          </select>
        </FormGroup>
      );
    };
    return (
      <React.Fragment>
        {selectPartWork()}
        {selectTitleWork()}
      </React.Fragment>
    );
  };

  // 5. return
  return (
    part === "food" && plan === "" ? (
      <FormGroup className={"d-inline-flex"}>
        {defaultNode()}
        {foodNode()}
      </FormGroup>
    ) : part === "food" && plan === "plan" ? (
      <FormGroup className={"d-inline-flex"}>
        {defaultNode()}
      </FormGroup>
    ) : part === "money" && plan === "" ? (
      <FormGroup className={"d-inline-flex"}>
        {defaultNode()}
        {moneyNode()}
      </FormGroup>
    ) : part === "money" && plan === "plan" ? (
      <FormGroup className={"d-inline-flex"}>
        {defaultNode()}
      </FormGroup>
    ) : part === "sleep" && plan === "" ? (
      <FormGroup className={"d-inline-flex"}>
        {defaultNode()}
      </FormGroup>
    ) : part === "sleep" && plan === "plan" ? (
      <FormGroup className={"d-inline-flex"}>
        {defaultNode()}
      </FormGroup>
    ) : part === "work" && plan === "" ? (
      <FormGroup className={"d-inline-flex"}>
        {defaultNode()}
        {workNode()}
      </FormGroup>
    ) : part === "work" && plan === "plan" ? (
      <FormGroup className={"d-inline-flex"}>
        {defaultNode()}
      </FormGroup>
    ) : null
  );
};
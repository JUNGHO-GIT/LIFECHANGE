// FilterNode.jsx

import React from "react";
import {moneyArray} from "../data/MoneyArray.jsx";
import {workArray} from "../data/WorkArray.jsx";

// 8. filter  ------------------------------------------------------------------------------------->
export const FilterNode = ({
  FILTER, setFILTER, PAGING, setPAGING, part, plan, type
}) => {
  function selectType() {
    return (
      <div className="mb-3">
        <select className="form-select" id="type" onChange={(e) => (
          setFILTER((prev) => ({
            ...prev,
            type: e.target.value
          }))
        )}>
          {["day", "week", "month", "year", "select"].map((item) => (
            <option key={item} value={item} selected={FILTER.type === item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    );
  };
  function selectOrder() {
    return (
      <div className="mb-3">
        <select className="form-select" id="order" onChange={(e) => (
          setFILTER((prev) => ({
            ...prev,
            order: e.target.value
          }))
        )}>
          <option value="asc" selected>오름차순</option>
          <option value="desc">내림차순</option>
        </select>
      </div>
    );
  };
  function selectLimit() {
    return (
      <div className="mb-3">
        <select className="form-select" id="limit" onChange={(e) => (
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
      </div>
    );
  };
  function selectPartFood () {
    return (
      <div className="mb-3">
        <select className="form-select" id="foodPart" onChange={(e) => {
          setFILTER((prev) => ({
            ...prev,
            part: e.target.value
          }));
        }}>
          <option value="전체" selected>전체</option>
          <option value="아침">아침</option>
          <option value="점심">점심</option>
          <option value="저녁">저녁</option>
          <option value="간식">간식</option>
        </select>
      </div>
    );
  };
  function selectPartMoney () {
    return (
      <div className="mb-3">
        <select className="form-control" id="part" value={moneyArray[FILTER.partIdx].money_part} onChange={(e) => {
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
          {moneyArray.map((item, idx) => (
            <option key={idx} data-idx={idx}>
              {item.money_part}
            </option>
          ))}
        </select>
      </div>
    );
  };
  function selectTitleMoney () {
    return (
      <div className="mb-3">
        <select className="form-control" id="title" value={FILTER.title} onChange={(e) => {
          setFILTER((prev) => ({
            ...prev,
            title: e.target.value
          }));
        }}>
          {moneyArray[FILTER.partIdx].money_title.map((item, idx) => (
            <option key={idx}>
              {item}
            </option>
          ))}
        </select>
      </div>
    );
  };
  function selectPartWork () {
    return (
      <div className="mb-3">
        <select className="form-control" id="part" value={workArray[FILTER.partIdx].work_part} onChange={(e) => {
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
          {workArray.map((item, idx) => (
            <option key={idx} data-idx={idx}>
              {item.work_part}
            </option>
          ))}
        </select>
      </div>
    );
  };
  function selectTitleWork () {
    return (
      <div className="mb-3">
        <select className="form-control" id="title" value={FILTER.title} onChange={(e) => {
          setFILTER((prev) => ({
            ...prev,
            title: e.target.value
          }));
        }}>
          {workArray[FILTER.partIdx].work_title.map((item, idx) => (
            <option key={idx}>
              {item}
            </option>
          ))}
        </select>
      </div>
    );
  };
  return (
    part === "food" && plan === "" ? (
      <div className="d-inline-flex">
        {selectType()}
        {selectOrder()}
        {selectLimit()}
        {selectPartFood()}
      </div>
    ) : part === "food" && plan === "plan" ? (
      <div className="d-inline-flex">
        {selectType()}
        {selectOrder()}
        {selectLimit()}
        {selectPartFood()}
      </div>
    ) : part === "money" && plan === "" ? (
      <div className="d-inline-flex">
        {selectType()}
        {selectOrder()}
        {selectLimit()}
        {selectPartMoney()}
        {selectTitleMoney()}
      </div>
    ) : part === "money" && plan === "plan" ? (
      <div className="d-inline-flex">
        {selectType()}
        {selectOrder()}
        {selectLimit()}
      </div>
    ) : part === "sleep" && plan === "" ? (
      <div className="d-inline-flex">
        {selectType()}
        {selectOrder()}
        {selectLimit()}
      </div>
    ) : part === "sleep" && plan === "plan" ? (
      <div className="d-inline-flex">
        {selectType()}
        {selectOrder()}
        {selectLimit()}
      </div>
    ) : part === "work" && plan === "" ? (
      <div className="d-inline-flex">
        {selectType()}
        {selectOrder()}
        {selectLimit()}
        {selectPartWork()}
        {selectTitleWork()}
      </div>
    ) : part === "work" && plan === "plan" ? (
      <div className="d-inline-flex">
        {selectType()}
        {selectOrder()}
        {selectLimit()}
      </div>
    ) : null
  );
};
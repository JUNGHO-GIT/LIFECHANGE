// PagingNode.jsx

import React, {useEffect} from "react";
import {Button} from "react-bootstrap";

// 7. paging -------------------------------------------------------------------------------------->
export const PagingNode = ({
  PAGING, setPAGING, COUNT, setCOUNT, part, plan, type
}) => {

  let pages = [];
  let totalPages = 0;
  let startPage = 0;
  let endPage = 0;

  if (type !== "search") {
    totalPages = Math.ceil(COUNT.totalCnt / PAGING.limit);
    startPage = Math.max(1, PAGING.page - 2);
    endPage = Math.min(startPage + 4, totalPages);
    startPage = Math.max(endPage - 4, 1);
  }
  else {
    totalPages = Math.ceil(COUNT.totalCnt / PAGING.limit);
    startPage = Math.max(0, PAGING.page - 2);
    endPage = Math.min(startPage + 4, totalPages);
    startPage = Math.max(endPage - 4, 0);
  }

  // prevMax
  const btnPrevMax = () => (
    <React.Fragment>
      <div disabled={PAGING.page <= 1} onClick={() => (
        setPAGING((prev) => ({
          ...prev,
          page: 1
        }))
      )}>
        <i className={"bx bx-chevrons-left"}></i>
      </div>
    </React.Fragment>
  );

  // prevOne
  const btnPrevOne = () => (
    <React.Fragment>
      <div disabled={PAGING.page <= 1} onClick={() => (
        setPAGING((prev) => ({
          ...prev,
          page: Math.max(1, PAGING.page - 1)
        }))
      )}>
        <i className={"bx bx-chevron-left"}></i>
      </div>
    </React.Fragment>
  );

  // number
  const btnNumber = () => {
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button key={i} size={"sm"} className={"page-btn"} disabled={PAGING.page === i}
        onClick={() => (
          setPAGING((prev) => ({
            ...prev,
            page: i
          })
        ))}>
          {i}
        </Button>
      );
    }
    return pages;
  };

  // nextOne
  const btnNextOne = () => (
    <React.Fragment>
      <div disabled={PAGING.page >= totalPages} onClick={() => (
        setPAGING((prev) => ({
          ...prev,
          page: Math.min(totalPages, PAGING.page + 1)
        }))
      )}>
        <i className={"bx bx-chevron-right"}></i>
      </div>
    </React.Fragment>
  );

  // nextMax
  const btnNextMax = () => (
    <React.Fragment>
      <div disabled={PAGING.page >= totalPages} onClick={() => (
        setPAGING((prev) => ({
          ...prev,
          page: totalPages
        }))
      )}>
        <i className={"bx bx-chevrons-right"}></i>
      </div>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <div className={"paging-wrapper d-inline-flex"}>
        {btnPrevMax()}
        {btnPrevOne()}
        {btnNumber()}
        {btnNextOne()}
        {btnNextMax()}
      </div>
    </React.Fragment>
  );
};
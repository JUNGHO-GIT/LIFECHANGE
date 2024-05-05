// PagingNode.jsx

import React, {useEffect} from "react";
import {Button} from "react-bootstrap";

// 9. paging -------------------------------------------------------------------------------------->
export const PagingNode = ({
  PAGING, setPAGING, COUNT, setCOUNT, part, plan, type
}) => {
  let totalPages = 0;
  let startPage = 0;
  let endPage = 0;

  if (type === "search") {
    totalPages = Math.ceil(COUNT.totalCnt / PAGING.limit);
    startPage = Math.max(0, PAGING.page - 2);
    endPage = Math.min(startPage + 4, totalPages);
    startPage = Math.max(endPage - 4, 0);
  }
  else {
    totalPages = Math.ceil(COUNT.totalCnt / PAGING.limit);
    startPage = Math.max(1, PAGING.page - 2);
    endPage = Math.min(startPage + 4, totalPages);
    startPage = Math.max(endPage - 4, 1);
  }

  // prevMax
  const btnPrevMax = () => (
    <React.Fragment>
      {PAGING.page > 1 ? (
        <i className={"bx bx-chevrons-left d-center"} onClick={() => (
          setPAGING((prev) => ({
            ...prev,
            page: 1
          }))
        )}></i>
      ) : (
        <i className={"bx bx-chevrons-left d-center"}></i>
      )}
    </React.Fragment>
  );

  // prevOne
  const btnPrevOne = () => (
    <React.Fragment>
      {PAGING.page <= 1 ? (
        <i className={"bx bx-chevron-left d-center"}></i>
      ) : (
        <i className={"bx bx-chevron-left d-center "} onClick={() => (
          setPAGING((prev) => ({
            ...prev,
            page: Math.max(1, PAGING.page - 1)
          }))
        )}></i>
      )}
    </React.Fragment>
  );

  // number
  const btnNumber = () => (
    <React.Fragment>
      {Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i).map((i) => (
        <Button key={i} size={"sm"} className={"page-btn"} disabled={PAGING.page === i}
        onClick={() => (
          setPAGING((prev) => ({
            ...prev,
            page: i
          }))
        )}>
          {i}
        </Button>
      ))}
    </React.Fragment>
  );

  // nextOne
  const btnNextOne = () => (
    <React.Fragment>
      {PAGING.page >= totalPages ? (
        <i className={"bx bx-chevron-right d-center"}></i>
      ) : (
        <i className={"bx bx-chevron-right d-center"}onClick={() => (
          setPAGING((prev) => ({
            ...prev,
            page: Math.min(totalPages, PAGING.page + 1)
          }))
        )}></i>
      )}
    </React.Fragment>
  );

  // nextMax
  const btnNextMax = () => (
    <React.Fragment>
      {PAGING.page >= totalPages ? (
        <i className={"bx bx-chevrons-right d-center"}></i>
      ) : (
        <i className={"bx bx-chevrons-right  d-center"} onClick={() => (
          setPAGING((prev) => ({
            ...prev,
            page: totalPages
          }))
        )}></i>
      )}
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
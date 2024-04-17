// PagingNode.jsx

import React from "react";
import Button from "react-bootstrap/Button";

// 7. paging -------------------------------------------------------------------------------------->
export const PagingNode = ({
  PAGING, setPAGING, COUNT, setCOUNT
}) => {

  const pages = [];
  const totalPages = Math.ceil(COUNT.totalCnt / PAGING.limit);
  let startPage = Math.max(1, PAGING.page - 2);
  let endPage = Math.min(startPage + 4, totalPages);
  startPage = Math.max(endPage - 4, 1);

  // prev
  function btnPrev() {
    return (
      <Button size={"sm"} variant={"primary"} className={"me-5"} disabled={PAGING.page <= 1}
        onClick={() => (
          setPAGING((prev) => ({
            ...prev,
            page: Math.max(1, PAGING.page - 1)
          })
        ))}>
          <i className={"bi bi-chevron-left"}></i>
      </Button>
    );
  };

  // number
  function btnNumber() {
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button key={i} size={"sm"} variant={"primary"} className={"me-2"}
          disabled={PAGING.page === i} onClick={() => (
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

  // next
  function btnNext() {
    return (
      <Button size={"sm"} variant={"primary"} className={"ms-5"} disabled={PAGING.page >= totalPages}
        onClick={() => (
          setPAGING((prev) => ({
            ...prev,
            page: Math.min(totalPages, PAGING.page + 1)
          })
        ))}>
          <i className={"bi bi-chevron-right"}></i>
      </Button>
    );
  };

  return (
    <div className={"d-inline-flex"}>
      {btnPrev()}
      {btnNumber()}
      {btnNext()}
    </div>
  );
};
// PagingNode.jsx

import React from "react";

// 7. PAGING -------------------------------------------------------------------------------------->
export const PagingNode = ({
  PAGING, setPAGING, COUNT, setCOUNT
}) => {

  const pages = [];
  const totalPages = Math.ceil(COUNT.totalCnt / PAGING.limit);
  let startPage = Math.max(1, PAGING.page - 2);
  let endPage = Math.min(startPage + 4, totalPages);
  startPage = Math.max(endPage - 4, 1);

  function prevButton() {
    return (
      <button className={`btn btn-sm btn-primary ms-10 me-10`} disabled={PAGING.page <= 1}
      onClick={() => (
        setPAGING((prev) => ({
          ...prev,
          page: Math.max(1, PAGING.page - 1)
        })
      ))}>
        이전
      </button>
    );
  };
  function pageNumber() {
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button key={i} className={`btn btn-sm btn-primary me-2`} disabled={PAGING.page === i}
        onClick={() => (
          setPAGING((prev) => ({
            ...prev,
            page: i
          }))
        )}>
          {i}
        </button>
      );
    }
    return pages;
  };
  function nextButton() {
    return (
      <button className={`btn btn-sm btn-primary ms-10 me-10`}
      disabled={PAGING.page >= Math.ceil(COUNT.totalCnt / PAGING.limit)}
      onClick={() => (
        setPAGING((prev) => ({
          ...prev,
          page: Math.min(Math.ceil(COUNT.totalCnt / PAGING.limit), PAGING.page + 1)
        }))
      )}>
        다음
      </button>
    );
  };
  return (
    <div className="d-inline-flex">
      {prevButton()}
      {pageNumber()}
      {nextButton()}
    </div>
  );
};
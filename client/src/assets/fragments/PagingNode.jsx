// PagingNode.jsx

import React from "react";

// 7. paging -------------------------------------------------------------------------------------->
export const PagingNode = ({
  paging, setPaging, totalCount,
}) => {

  const pages = [];
  const totalPages = Math.ceil(totalCount / paging.limit);
  let startPage = Math.max(1, paging.page - 2);
  let endPage = Math.min(startPage + 4, totalPages);
  startPage = Math.max(endPage - 4, 1);

  function prevButton() {
    return (
      <button className={`btn btn-sm btn-primary ms-10 me-10`} disabled={paging.page <= 1}
      onClick={() => (
        setPaging((prev) => ({
          ...prev,
          page: Math.max(1, paging.page - 1)
        })
      ))}>
        이전
      </button>
    );
  };
  function pageNumber() {
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button key={i} className={`btn btn-sm btn-primary me-2`} disabled={paging.page === i}
        onClick={() => (
          setPaging((prev) => ({
            ...prev,
            page: i
          })
        ))}>
          {i}
        </button>
      );
    }
    return pages;
  };
  function nextButton() {
    return (
      <button className={`btn btn-sm btn-primary ms-10 me-10`}
      disabled={paging.page >= Math.ceil(totalCount / paging.limit)}
      onClick={() => (
        setPaging((prev) => ({
          ...prev,
          page: Math.min(Math.ceil(totalCount / paging.limit), paging.page + 1)
        })
      ))}>
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
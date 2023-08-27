// CalendarList.tsx
import React, { useEffect, useState } from "react";
import $ from "jquery";

// ------------------------------------------------------------------------------------------------>
export const CalendarList = () => {
  const [params, setParams] = useState({
    year: 0,
    month: 0,
    day: 0
  });
  let date = new Date();

  // 함수 선언
  function renderCalendar () {

    $("#calendar").empty();
    $("#year").text(date.getFullYear() + "년 ");
    $("#month").text(date.getMonth() + 1 + "월");

    let monthDays = new Date (
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();

    let startDay = new Date (
      date.getFullYear(),
      date.getMonth(),
      1
    ).getDay();

    let weekRow = $(`<div class="row d-flex justify-content-center"></div>`);
    let dayRow = $(`<div class="row d-flex justify-content-center"></div>`);
    let blank = `&nbsp;`;

    // 요일 표시
    let weekParam = ["일", "월", "화", "수", "목", "금", "토"];
    for (let dayParam = 0; dayParam < 7; dayParam++) {
      if (dayParam === 0) {
        weekRow.append (
          `<div class="col-1 tt-c tc-r fw-7 bd-t-1 bd-s-1 bd-b-1 p-2 week">`
            + weekParam[dayParam] +
          `</div>`
        );
      }
      else if (dayParam === 6) {
        weekRow.append (
          `<div class="col-1 tt-c tc-l fw-7 bd-s-1 bd-t-1 bd-e-1 bd-b-1 p-2 week">`
            + weekParam[dayParam] +
          `</div>`
        );
      }
      else {
        weekRow.append (
          `<div class="col-1 tt-c tc-b fw-7 bd-t-1 bd-s-1 bd-b-1 p-2 week">`
            + weekParam[dayParam] +
          `</div>`
        );
      }
    }
    $("#calendar").append (weekRow);

    for (let dayParam = 0; dayParam < startDay; dayParam++) {
      dayRow.append (
        `<div class="col-1 tt-c tc-b fw-7 bd-s-1 bd-b-1 p-2 blank">`
          + blank +
        `</div>`
      );
    };

    for (let dayParam = 1; dayParam <= monthDays; dayParam++) {
      if ((startDay + dayParam - 1) % 7 === 0) {
        $("#calendar").append(dayRow);
        dayRow = $(`<div class="row d-flex justify-content-center"></div>`);
      }

      let dayElement;
      // 첫번째 열일 경우
      if ((startDay + dayParam - 1) % 7 === 0) {
        dayElement = $(
          `<div class="col-1 tt-c tc-r fw-7 bd-s-1 bd-b-1 p-2 day">`
            + dayParam +
          `</div>`
        );
      }
      // 일곱번째 열일 경우
      else if ((startDay + dayParam - 1) % 7 === 6) {
        dayElement = $(
          `<div class="col-1 tt-c tc-l fw-7 bd-s-1 bd-b-1 bd-e-1 p-2 day">`
            + dayParam +
          `</div>`
        );
      }
      else {
        dayElement = $(
          `<div class="col-1 tt-c tc-b fw-7 bd-s-1 bd-b-1 p-2 day">`
            + dayParam +
          `</div>`
        );
      }

      dayElement.click(function () {
        window.location.href = `/calendarDetail/${date.getFullYear()}-${date.getMonth() + 1}-${dayParam}`;
      });
      dayRow.append(dayElement);
    };

    for (let dayParam = (startDay + monthDays) % 7; dayParam < 7 && dayParam !== 0; dayParam++) {
      // 일곱번째 열일 경우
      if (dayParam === 6) {
        dayRow.append (
          `<div class="col-1 tt-c tc-b fw-7 bd-s-1 bd-b-1 bd-e-1 p-2 blank">`
            + blank +
          `</div>`
        );
      }
      else {
        dayRow.append (
          `<div class="col-1 tt-c tc-b fw-7 bd-s-1 bd-b-1 p-2 blank">`
            + blank +
          `</div>`
        );
      }
    };
    $("#calendar").append (dayRow);
  }

  // 이전 달, 다음 달 버튼
  $(document).ready(function () {
    $("#prev").click(function () {
      date.setMonth(date.getMonth() - 1);
      renderCalendar();
    });
    $("#next").click(function () {
      date.setMonth(date.getMonth() + 1);
      renderCalendar();
    });
    renderCalendar();
  });

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container">
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-9">Calendar List</h1>
        </div>
      </div>
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-10">
          <div className="custom-flex-center">
            <h3 className="fw-9"><span id="year"></span><span id="month"></span></h3>
            <button id="prev" className="btn btn-primary btn-sm ms-2">이전</button>
            <button id="next" className="btn btn-primary btn-sm ms-2">다음</button>
          </div>
        </div>
      </div>
      <div className="row d-flex justify-content-center">
        <div className="col-10">
          <div id="calendar"></div>
        </div>
      </div>
    </div>
  );
};
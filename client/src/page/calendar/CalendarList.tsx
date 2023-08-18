import React, { useEffect, useState } from "react";
import $ from "jquery";

const CalendarList = () => {
  const date = new Date();
  const [year, setYear] = useState(date.getFullYear());
  const [month, setMonth] = useState(date.getMonth());
  const loadCalendar = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const en_month = date.toLocaleString("en", { month: "long" });
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const blank = "\u00A0";
    let dayCounter = 1;

    $("#yearParam").text(year);
    $("#monthParam").text(month + 1 + "월");
    $("#en_monthParam").text(en_month.substring(0, 3));

    for (let i = 1; i <= 6; i++) {
      let row = $("#dayRow" + i);

      for (let j = 0; j < 7; j++) {
        let col = row.find(".col:nth-child(" + (j + 1) + ")");

        if (j === 0) {
          col.addClass("text-danger");
        }
        if (j === 6) {
          col.addClass("text-primary");
        }

        if (i === 1 && j < firstDay) {
          col.text(blank);
        } else {
          if (dayCounter > lastDate) {
            col.text(blank);
          } else {
            col.text(dayCounter);
            dayCounter++;
          }
        }
      }
    }

    let isRow6Empty = true;
    $("#dayRow6 .col").each(function () {
      if ($(this).text().trim() !== "") {
        isRow6Empty = false;
        return false;
      }
    });
    if (isRow6Empty) {
      $("#dayRow6").hide();
    } else {
      $("#dayRow6").show();
    }
  };

  const handleBeforeMonth = () => {
    setMonth((prevMonth) => prevMonth - 1);
    loadCalendar();
  };

  const handleNextMonth = () => {
    setMonth((prevMonth) => prevMonth + 1);
    loadCalendar();
  };

  useEffect(() => {
    loadCalendar();
  }, [year, month]);

  return (
    <section className="vh-100 d-flex align-items-center justify-content-center">
    <br />
    <div className="container-fluid">
      <div className="row d-flex justify-content-center text-center">
        <div className="col-md-8 col-sm-10 col-12 border border-4 border-dark shadow-lg">
          <div className="row bg-primary text-white fw-bolder fs-1 border-bottom border-4 border-dark align-items-center">
            <div className="col-3">
              <button id="beforeMonth" onClick={handleBeforeMonth}>이전</button>
            </div>
            <div className="col-6 pt-4 pb-4 d-inline-flex justify-content-center">
              <div className="col-4 d-sm-block d-none text-center" id="yearParam"></div>
              <div className="col-4 text-center" id="monthParam"></div>
              <div className="col-4 d-md-block d-none border-2 border-dark text-center"
              id="en_monthParam"></div>
            </div>
            <div className="col-3">
              <button id="nextMonth" onClick={handleNextMonth}>다음</button>
            </div>
          </div>
          <div className="row bg-white text-black fw-bolder fs-6 align-items-center" id="weekRow">
            <div className="col border-end border-2 border-secondary pt-4 pb-4 text-danger">일</div>
            <div className="col border-end border-2 border-secondary pt-4 pb-4">월</div>
            <div className="col border-end border-2 border-secondary pt-4 pb-4">화</div>
            <div className="col border-end border-2 border-secondary pt-4 pb-4">수</div>
            <div className="col border-end border-2 border-secondary pt-4 pb-4">목</div>
            <div className="col border-end border-2 border-secondary pt-4 pb-4">금</div>
            <div className="col border-2 border-secondary pt-4 pb-4 text-primary">토</div>
          </div>
          <div className="row bg-body fw-bold fs-6 align-items-center text-end" id="dayRow1">
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-2 border-secondary pb-5"></div>
          </div>
          <div className="row bg-body fw-bold fs-6 align-items-center text-end" id="dayRow2">
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-2 border-secondary pb-5"></div>
          </div>
          <div className="row bg-body fw-bold fs-6 align-items-center text-end" id="dayRow3">
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-2 border-secondary pb-5"></div>
          </div>
          <div className="row bg-body fw-bold fs-6 align-items-center text-end" id="dayRow4">
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-2 border-secondary pb-5"></div>
          </div>
          <div className="row bg-body fw-bold fs-6 align-items-center text-end" id="dayRow5">
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-2 border-secondary pb-5"></div>
          </div>

          <div className="row bg-body fw-bold fs-6 align-items-center text-end" id="dayRow6">
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-end border-2 border-secondary pb-5"></div>
            <div className="col border-top border-2 border-secondary pb-5"></div>
          </div>

        </div>
      </div>
    </div>
  </section>
  )
}

export default CalendarList;
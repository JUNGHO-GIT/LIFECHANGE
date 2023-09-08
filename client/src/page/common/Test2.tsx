import React, { useState } from "react";
import {
  DayClickEventHandler,
  DateRange,
  DayPicker,
  MonthChangeEventHandler,
  WeekNumberClickEventHandler,
} from "react-day-picker";
import { addMonths, isSameDay, differenceInDays } from "date-fns";
import { ko } from "date-fns/locale";
import moment from "moment-timezone";

// 1. 일별로 보기 --------------------------------------------------------------------------------->
const DayComponent = () => {
  const today = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());

  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | undefined>(
    today.getDate()
  );

  const handleDayClick: DayClickEventHandler = (day, modifiers) => {
    if (day) {
      setSelectedDay(day.getDate());
      setSelectedMonth(day.getMonth());
      setSelectedYear(day.getFullYear());
    }
    else {
      setSelectedDay(undefined);
    }
  };

  const handleResetClick = () => {
    setSelectedDay(undefined);
  };

  const selectedInfo = () => {
    if (selectedDay !== undefined) {
      return (
        <div>
          <hr />
          <span>{`${selectedYear}`}-</span>
          <span>{`${selectedMonth + 1}`}-</span>
          <span>{`${selectedDay}`}</span>
          <hr />
        </div>
      );
    }
    else {
      return (
        <div>
          <hr />
          <span>선택된 날짜가 없습니다.</span>
          <hr />
        </div>
      );
    }
  };

  const footer = () => {
    return (
      <div>
        <p>{selectedInfo()}</p>
        <button
          className="btn btn-success me-2"
          onClick={() => {
            setSelectedMonth(today.getMonth());
            setSelectedYear(today.getFullYear());
            setSelectedDay(today.getDate());
          }}
        >
          Today
        </button>
        <button className="btn btn-primary me-2" onClick={handleResetClick}>
          Reset
        </button>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <DayPicker
            mode="single"
            showOutsideDays
            selected={new Date(selectedYear, selectedMonth, selectedDay)}
            month={new Date(selectedYear, selectedMonth)}
            locale={ko}
            weekStartsOn={1}
            onDayClick={handleDayClick}
            onMonthChange={(date) => {
              setSelectedMonth(date.getMonth());
              setSelectedYear(date.getFullYear());
            }}
            modifiersClassNames={{
              today: "today",
              selected: "selected",
              disabled: "disabled",
              outside: "outside",
              inside: "inside",
            }}
            footer={footer()}
          />
        </div>
      </div>
    </div>
  );
};

// 2. 주별로 보기 --------------------------------------------------------------------------------->
const WeekComponent = () => {
  const today = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  const [range, setRange] = useState<DateRange | undefined>();
  const [currentMonth, setCurrentMonth] = useState<Date>(today);

  const handleDayClick = (selectedDate: Date) => {
    const startOfWeek = moment(selectedDate).startOf("isoWeek").toDate();
    const endOfWeek = moment(selectedDate).endOf("isoWeek").toDate();
    setRange({ from: startOfWeek, to: endOfWeek });
  };

  const selectedInfo = () => {
    if (range?.from && range?.to) {
      return (
        <div>
          <hr />
          <span>{`${range.from.getFullYear()}`}-</span>
          <span>{`${range.from.getMonth() + 1}`}-</span>
          <span>{`${range.from.getDate()}`}</span>
          <span> ~ </span>
          <span>{`${range.to.getFullYear()}`}-</span>
          <span>{`${range.to.getMonth() + 1}`}-</span>
          <span>{`${range.to.getDate()}`}</span>
          <hr />
        </div>
      );
    }
    else {
      return (
        <div>
          <hr />
          <span>선택된 날짜가 없습니다.</span>
          <hr />
        </div>
      );
    }
  };

  const footer = () => {
    return (
      <div>
        <p>{selectedInfo()}</p>
        <button
          className="btn btn-success me-2"
          onClick={() => {
            setCurrentMonth(today);
            setRange(undefined);
          }}
        >
          Today
        </button>
        <button className="btn btn-success me-2" onClick={() => {
          setCurrentMonth(today);
          setRange(undefined);
        }}>
          Today
        </button>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <DayPicker
            mode="range"
            showOutsideDays
            selected={range}
            month={currentMonth}
            onDayClick={handleDayClick}
            locale={ko}
            weekStartsOn={1}
            onMonthChange={(date) => {
              setCurrentMonth(date);
            }}
            modifiersClassNames={{
              today: "today",
              selected: "selected",
              disabled: "disabled",
              outside: "outside",
              inside: "inside",
            }}
            footer={footer()}
          />
        </div>
      </div>
    </div>
  );
};


// 3. 월별로 보기 --------------------------------------------------------------------------------->
const MonthComponent = () => {
  const today = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(today);

  const handleMonthChange: MonthChangeEventHandler = (day) => {
    if (day) {
      const monthDate = new Date(day.getFullYear(), day.getMonth(), 1);
      setSelectedMonth(monthDate);
    }
    else {
      setSelectedMonth(undefined);
    }
  };

  const selectedInfo = () => {
    if (selectedMonth) {
      return (
        <div>
          <hr />
          <span>{`${selectedMonth.getFullYear()}`}-</span>
          <span>{`${selectedMonth.getMonth() + 1}`}</span>
          <hr />
        </div>
      );
    }
    else {
      return (
        <div>
          <hr />
          <span>선택된 날짜가 없습니다.</span>
          <hr />
        </div>
      );
    }
  };

  const footer = () => {
    return (
      <div>
        <p>{selectedInfo()}</p>
        <button
          className="btn btn-success me-2"
          onClick={() => {
            setSelectedMonth(today);
          }}
        >
          Today
        </button>
        <button className="btn btn-primary me-2" onClick={() => setSelectedMonth(undefined)}>
          Reset
        </button>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <DayPicker
            mode="default"
            selected={selectedMonth}
            showOutsideDays
            locale={ko}
            weekStartsOn={1}
            month={selectedMonth}
            onMonthChange={handleMonthChange}
            modifiersClassNames={{
              today: "today",
              selected: "selected",
              disabled: "disabled",
              outside: "outside",
              inside: "inside",
            }}
            footer={footer()}
          />
        </div>
      </div>
    </div>
  );
};

// 4. 년별로 보기 --------------------------------------------------------------------------------->
const YearComponent = () => {

  const today = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  const [selectedYear, setSelectedYear] = useState<Date | undefined>(today);

  const handleYearChange: MonthChangeEventHandler = (day) => {
    if (day) {
      const yearDate = new Date(day.getFullYear(), 0, 1);
      const monthDate = new Date(day.getFullYear(), day.getMonth(), 1);
      const nextMonth = differenceInDays(new Date(day.getFullYear() + 1, 0, 1), monthDate) / 30;
      const prevMonth = differenceInDays(monthDate, yearDate) / 30;

      if (nextMonth > prevMonth) {
        setSelectedYear(new Date(day.getFullYear() + 1, 0, 1));
      }
      else {
        setSelectedYear(new Date(day.getFullYear(), 0, 1));
      }
    }
    else {
      setSelectedYear(undefined);
    }
  };
  const selectedInfo = () => {
    if (selectedYear) {
      return (
        <div>
          <hr />
          <span>{`${selectedYear.getFullYear()}`}</span>
          <hr />
        </div>
      );
    }
    else {
      return (
        <div>
          <hr />
          <span>선택된 날짜가 없습니다.</span>
          <hr />
        </div>
      );
    }
  };
  const footer = () => {
    return (
      <div>
        <p>{selectedInfo()}</p>
        <button className="btn btn-success me-2" onClick={() => {
          setSelectedYear(today);
        }}>
          Today
        </button>
        <button className="btn btn-primary me-2" onClick={() => {
          setSelectedYear(today);
        }}>
          Reset
        </button>
      </div>
    );
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <DayPicker
            mode="default"
            selected={selectedYear}
            showOutsideDays
            locale={ko}
            weekStartsOn={1}
            month={selectedYear}
            onMonthChange={handleYearChange}
            modifiersClassNames={{
              today: "today",
              selected: "selected",
              disabled: "disabled",
              outside: "outside",
              inside: "inside",
            }}
            footer={footer()}
          />
        </div>
      </div>
    </div>
  );
};

// 5. 선택한 날짜 범위로 보기 --------------------------------------------------------------------->
const RangeComponent = () => {

  const today = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  const [returnValue, setReturnValue] = useState<any>();

  const [selectedStartYear, setSelectedStartYear] = useState<number>();
  const [selectedStartMonth, setSelectedStartMonth] = useState<number>();
  const [selectedStartDay, setSelectedStartDay] = useState<number>();
  const [selectedEndYear, setSelectedEndYear] = useState<number>();
  const [selectedEndMonth, setSelectedEndMonth] = useState<number>();
  const [selectedEndDay, setSelectedEndDay] = useState<number>();

  const [range, setRange] = useState<DateRange | undefined>();
  const [currentMonth, setCurrentMonth] = useState<Date>(today);

  const handleDayRangeClick = (selectedRange: DateRange) => {
    setRange(selectedRange);
    if (selectedRange?.from) {
      setSelectedStartYear(selectedRange.from.getFullYear());
      setSelectedStartMonth(selectedRange.from.getMonth() + 1);
      setSelectedStartDay(selectedRange.from.getDate());
    }
    if (selectedRange?.to) {
      setSelectedEndYear(selectedRange.to.getFullYear());
      setSelectedEndMonth(selectedRange.to.getMonth() + 1);
      setSelectedEndDay(selectedRange.to.getDate());
    }
  };

  const handleResetClick = () => {
    setSelectedStartYear(undefined);
    setSelectedStartMonth(undefined);
    setSelectedStartDay(undefined);
    setSelectedEndYear(undefined);
    setSelectedEndMonth(undefined);
    setSelectedEndDay(undefined);
    setRange(undefined);
  };

  const handleDayClick = (day: Date) => {
    if (!range || !range.from) {
      setRange({ from: day, to: undefined });
    }
    else if (!range.to) {
      const newRange =
      day > range.from
      ? { from: range.from, to: day }
      : { from: day, to: range.from };
      handleDayRangeClick(newRange);
    }
    else {
      setRange({ from: day, to: undefined });
    }
  };
  const selectedInfo = () => {
    if ( selectedStartYear &&
      selectedStartMonth &&
      selectedStartDay &&
      selectedEndYear &&
      selectedEndMonth &&
      selectedEndDay
    ) {
      setReturnValue(
        `${selectedStartYear}-${selectedStartMonth}-${selectedStartDay}~${selectedEndYear}-${selectedEndMonth}-${selectedEndDay}`
      );
      return (
        <div>
          <hr />
          {`${selectedStartYear}-${selectedStartMonth}-${selectedStartDay}~${selectedEndYear}-${selectedEndMonth}-${selectedEndDay}`}
          <hr />
        </div>
      );
    }
    else {
      return (
        <div>
          <hr />
          <span>선택된 날짜가 없습니다.</span>
          <hr />
        </div>
      );
    }
  };
  const footer = () => {
    return (
      <div>
        <p>{selectedInfo()}</p>
        <button
          className="btn btn-success me-2"
          onClick={() => {
            setCurrentMonth(today);
          }}
        >
          Today
        </button>
        <button className="btn btn-primary me-2" onClick={handleResetClick}>
          Reset
        </button>
      </div>
    );
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <DayPicker
            mode="range"
            showOutsideDays
            selected={range}
            month={currentMonth}
            onDayClick={handleDayClick}
            locale={ko}
            weekStartsOn={1}
            onMonthChange={(date) => {
              setCurrentMonth(date);
            }}
            modifiersClassNames={{
              today: "today",
              selected: "selected",
              disabled: "disabled",
              outside: "outside",
              inside: "inside",
            }}
            footer={footer()}
          />
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------------------------------------>
export const Test2 = () => {
  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-10">
          <h5 className="fw-7">1. 일별로 보기</h5>
          <DayComponent />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-10">
          <h5 className="fw-7">2. 주별로 보기</h5>
          <WeekComponent />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-10">
          <h5 className="fw-7">3. 월별로 보기</h5>
          <MonthComponent />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-10">
          <h5 className="fw-7">4. 년별로 보기</h5>
          <YearComponent />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-10">
          <h5 className="fw-7">5. 선택한 범위로 보기</h5>
          <RangeComponent />
        </div>
      </div>
    </div>
  );
};

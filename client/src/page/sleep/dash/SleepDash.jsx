// SleepDash.jsx

import React from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {DashBarToday} from "./DashBarToday.jsx";
import {DashLineWeek} from "./DashLineWeek.jsx";
import {DashLineMonth} from "./DashLineMonth.jsx";
import {DashAvgWeek} from "./DashAvgWeek.jsx";
import {DashAvgMonth} from "./DashAvgMonth.jsx";
import {Container, Table, FormGroup, Form, ButtonGroup, Button, Row, Col} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const SleepDash = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const location = useLocation();
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:activeDash, set:setActiveDash} = useStorage(
    `activeDash(${PATH})`, "bar-today"
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <FormGroup className={"root-wrapper"}>
      <Container className={"container-wrapper"}>
        <Form className={"btn-group"}>
          <p className={`btn ${activeDash === "bar-today" ? "btn-primary" : "btn-secondary"} me-20`} onClick={() => setActiveDash("bar-today")}>
            오늘 수면 데이터 목표 / 실제
          </p>
        </Form>
        <br />
        <Form className={"btn-group"}>
          <p className={`btn ${activeDash === "line-week" ? "btn-primary" : "btn-secondary"} me-20`} onClick={() => setActiveDash("line-week")}>
            주간 수면 데이터
          </p>
          <p className={`btn ${activeDash === "line-month" ? "btn-primary" : "btn-secondary"} me-20`} onClick={() => setActiveDash("line-month")}>
            월간 수면 데이터
          </p>
        </Form>
        <br />
        <Form className={"btn-group"}>
          <p className={`btn ${activeDash === "avg-week" ? "btn-primary" : "btn-secondary"} me-20`} onClick={() => setActiveDash("avg-week")}>
            주간 수면 데이터 평균
          </p>
          <p className={`btn ${activeDash === "avg-month" ? "btn-primary" : "btn-secondary"} me-20`} onClick={() => setActiveDash("avg-month")}>
            월간 수면 데이터 평균
          </p>
        </Form>
      </Container>
      <Container className={"container-wrapper"}>
        <Form className={`${activeDash === "bar-today" ? "" : "d-none"}`}>
          <h5>오늘 수면 데이터 목표 / 실제</h5>
          {DashBarToday()}
        </Form>
        <Form className={`${activeDash === "line-week" ? "" : "d-none"}`}>
          <h5>주간 수면 데이터</h5>
          {DashLineWeek()}
        </Form>
        <Form className={`${activeDash === "line-month" ? "" : "d-none"}`}>
          <h5>월간 수면 데이터</h5>
          {DashLineMonth()}
        </Form>
        <Form className={`${activeDash === "avg-week" ? "" : "d-none"}`}>
          <h5>주간 수면 데이터 평균</h5>
          {DashAvgWeek()}
        </Form>
        <Form className={`${activeDash === "avg-month" ? "" : "d-none"}`}>
          <h5>월간 수면 데이터 평균</h5>
          {DashAvgMonth()}
        </Form>
      </Container>
    </FormGroup>
  );
};

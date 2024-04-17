// FoodDash.jsx

import React from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {DashBarToday} from "./DashBarToday.jsx";
import {DashPieToday} from "./DashPieToday.jsx";
import {DashPieWeek} from "./DashPieWeek.jsx";
import {DashPieMonth} from "./DashPieMonth.jsx";
import {DashLineWeek} from "./DashLineWeek.jsx";
import {DashLineMonth} from "./DashLineMonth.jsx";
import {DashAvgWeek} from "./DashAvgWeek.jsx";
import {DashAvgMonth} from "./DashAvgMonth.jsx";
import {Container, Table, FormGroup, Form, ButtonGroup, Button, Row, Col} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const FoodDash = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const location = useLocation();
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:activeDash, set:setActiveDash} = useStorage(
    `activeDash (${PATH})`, "bar-today"
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <FormGroup className={"root-wrapper"}>
      <Container className={"container-wrapper"}>
        <Form className={"btn-group"}>
          <p className={`btn ${activeDash === "bar-today" ? "btn-primary" : "btn-secondary"} me-20`} onClick={() => setActiveDash("bar-today")}>
            오늘 칼로리 / 영양소 목표 / 실제
          </p>
        </Form>
        <br />
        <Form className={"btn-group"}>
          <p className={`btn ${activeDash === "pie-today" ? "btn-primary" : "btn-secondary"} me-20`} onClick={() => setActiveDash("pie-today")}>
            오늘 칼로리 / 영양소 대분류
          </p>
          <p className={`btn ${activeDash === "pie-week" ? "btn-primary" : "btn-secondary"} me-20`} onClick={() => setActiveDash("pie-week")}>
            주간 칼로리 / 영양소 대분류
          </p>
          <p className={`btn ${activeDash === "pie-month" ? "btn-primary" : "btn-secondary"} me-20`} onClick={() => setActiveDash("pie-month")}>
            월간 칼로리 / 영양소 대분류
          </p>
        </Form>
        <br />
        <Form className={"btn-group"}>
          <p className={`btn ${activeDash === "line-week" ? "btn-primary" : "btn-secondary"} me-20`} onClick={() => setActiveDash("line-week")}>
            주간 칼로리 / 영양소
          </p>
          <p className={`btn ${activeDash === "line-month" ? "btn-primary" : "btn-secondary"} me-20`} onClick={() => setActiveDash("line-month")}>
            월간 칼로리 / 영양소
          </p>
        </Form>
        <br />
        <Form className={"btn-group"}>
          <p className={`btn ${activeDash === "avg-week" ? "btn-primary" : "btn-secondary"} me-20`} onClick={() => setActiveDash("avg-week")}>
            주간 칼로리 / 영양소 평균
          </p>
          <p className={`btn ${activeDash === "avg-month" ? "btn-primary" : "btn-secondary"} me-20`} onClick={() => setActiveDash("avg-month")}>
            월간 칼로리 / 영양소 평균
          </p>
        </Form>
      </Container>
      <Container className={"container-wrapper"}>
        <Form className={`${activeDash === "bar-today" ? "" : "d-none"}`}>
          <h5>오늘 칼로리 / 영양소 목표 / 실제</h5>
          {DashBarToday()}
        </Form>
        <Form className={`${activeDash === "pie-today" ? "" : "d-none"}`}>
          <h5>오늘 칼로리 / 영양소 대분류</h5>
          {DashPieToday()}
        </Form>
        <Form className={`${activeDash === "pie-week" ? "" : "d-none"}`}>
          <h5>주간 칼로리 / 영양소 대분류</h5>
          {DashPieWeek()}
        </Form>
        <Form className={`${activeDash === "pie-month" ? "" : "d-none"}`}>
          <h5>월간 칼로리 / 영양소 대분류</h5>
          {DashPieMonth()}
        </Form>
        <Form className={`${activeDash === "line-week" ? "" : "d-none"}`}>
          <h5>주간 칼로리 / 영양소</h5>
          {DashLineWeek()}
        </Form>
        <Form className={`${activeDash === "line-month" ? "" : "d-none"}`}>
          <h5>월간 칼로리 / 영양소</h5>
          {DashLineMonth()}
        </Form>
        <Form className={`${activeDash === "avg-week" ? "" : "d-none"}`}>
          <h5>주간 칼로리 / 영양소 평균</h5>
          {DashAvgWeek()}
        </Form>
        <Form className={`${activeDash === "avg-month" ? "" : "d-none"}`}>
          <h5>월간 수입 / 지출 평균</h5>
          {DashAvgMonth()}
        </Form>
      </Container>
    </FormGroup>
  );
};

// WorkDash.jsx

import React from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {DashScatterWeek} from "./DashScatterWeek.jsx";
import {DashScatterMonth} from "./DashScatterMonth.jsx";
import {DashPieWeek} from "./DashPieWeek.jsx";
import {DashPieMonth} from "./DashPieMonth.jsx";
import {DashLineWeek} from "./DashLineWeek.jsx";
import {DashLineMonth} from "./DashLineMonth.jsx";
import {DashAvgWeek} from "./DashAvgWeek.jsx";
import {DashAvgMonth} from "./DashAvgMonth.jsx";
import {Container, Table, FormGroup, Form, ButtonGroup, Button, Row, Col} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const WorkDash = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const location = useLocation();
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:activeDash, set:setActiveDash} = useStorage(
    `activeDash (${PATH})`, "scatter-month"
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <FormGroup className={"root-wrapper"}>
      <Container className={"container-wrapper"}>
        <Form className={"btn-group"}>
          <p className={`btn ${activeDash === "scatter-week" ? "btn-primary" : "btn-secondary"} me-20`} onClick={() => setActiveDash("scatter-week")}>
            주간 몸무게 목표 / 실제
          </p>
          <p className={`btn ${activeDash === "scatter-month" ? "btn-primary" : "btn-secondary"} me-20`} onClick={() => setActiveDash("scatter-month")}>
            월간 몸무게 목표 / 실제
          </p>
        </Form>
        <br />
        <Form className={"btn-group"}>
          <p className={`btn ${activeDash === "pie-week" ? "btn-primary" : "btn-secondary"} me-20`} onClick={() => setActiveDash("pie-week")}>
            주간 상위 5개 부위 / 운동
          </p>
          <p className={`btn ${activeDash === "pie-month" ? "btn-primary" : "btn-secondary"} me-20`} onClick={() => setActiveDash("pie-month")}>
            월간 상위 5개 부위 / 운동
          </p>
        </Form>
        <br />
        <Form className={"btn-group"}>
          <p className={`btn ${activeDash === "line-week" ? "btn-primary" : "btn-secondary"} me-20`} onClick={() => setActiveDash("line-week")}>
            주간 총볼륨 / 유산소시간
          </p>
          <p className={`btn ${activeDash === "line-month" ? "btn-primary" : "btn-secondary"} me-20`} onClick={() => setActiveDash("line-month")}>
            월간 총볼륨 / 유산소시간
          </p>
        </Form>
        <br />
        <Form className={"btn-group"}>
          <p className={`btn ${activeDash === "avg-week" ? "btn-primary" : "btn-secondary"} me-20`}
            onClick={() => setActiveDash("avg-week")}>
            주간 총볼륨 / 유산소시간 평균
          </p>
          <p className={`btn ${activeDash === "avg-month" ? "btn-primary" : "btn-secondary"} me-20`}
            onClick={() => setActiveDash("avg-month")}>
            월간 총볼륨 / 유산소시간 평균
          </p>
        </Form>
      </Container>
      <Container className={"container-wrapper"}>
        <Form className={`${activeDash === "scatter-week" ? "" : "d-none"}`}>
          <h5>주간 몸무게 목표 / 실제</h5>
          {DashScatterWeek()}
        </Form>
        <Form className={`${activeDash === "scatter-month" ? "" : "d-none"}`}>
          <h5>월간 몸무게 목표 / 실제</h5>
          {DashScatterMonth()}
        </Form>
        <Form className={`${activeDash === "pie-week" ? "" : "d-none"}`}>
          <h5>주간 상위 5개 부위 / 운동</h5>
          {DashPieWeek()}
        </Form>
        <Form className={`${activeDash === "pie-month" ? "" : "d-none"}`}>
          <h5>월간 상위 5개 부위 / 운동</h5>
          {DashPieMonth()}
        </Form>
        <Form className={`${activeDash === "line-week" ? "" : "d-none"}`}>
          <h5>주간 총볼륨 / 유산소시간</h5>
          {DashLineWeek()}
        </Form>
        <Form className={`${activeDash === "line-month" ? "" : "d-none"}`}>
          <h5>월간 총볼륨 / 유산소시간</h5>
          {DashLineMonth()}
        </Form>
        <Form className={`${activeDash === "avg-week" ? "" : "d-none"}`}>
          <h5>주간 총볼륨 / 유산소시간 평균</h5>
          {DashAvgWeek()}
        </Form>
        <Form className={`${activeDash === "avg-month" ? "" : "d-none"}`}>
          <h5>월간 총볼륨 / 유산소시간 평균</h5>
          {DashAvgMonth()}
        </Form>
      </Container>
    </FormGroup>
  );
};

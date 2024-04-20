// CustomerDash.jsx

import React from "react";
import {FoodDashBarToday} from "./FoodDashBarToday.jsx";
import {MoneyDashBarToday} from "./MoneyDashBarToday.jsx";
import {SleepDashBarToday} from "./SleepDashBarToday.jsx";
import {ExerciseDashBarToday} from "./ExerciseDashBarToday.jsx";
import {Container, Row, Col, Card, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const CustomerDash = () => {

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Container>
        <Row>
          <Col xs={6}>
            {FoodDashBarToday()}
          </Col>
          <Col xs={6}>
            {MoneyDashBarToday()}
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            {SleepDashBarToday()}
          </Col>
          <Col xs={6}>
            {ExerciseDashBarToday()}
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};
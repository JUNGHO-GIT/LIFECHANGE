// Footer.jsx

import React from "react";
import {Container, Row, Col} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const Footer = () => {
  return (
    <React.Fragment>
      <Container fluid className={"footer box-top"}>
        <Row className={"d-center bg-white"}>
          <Col className={"text-center"}>
            <p className={"text-dark fw-700 pt-20"}>&copy; JUNGHO's Domain</p>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};
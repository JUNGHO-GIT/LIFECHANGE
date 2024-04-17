// Footer.jsx

import React from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// ------------------------------------------------------------------------------------------------>
export const Footer = () => {
  return (
    <footer className={"container-fluid footer box-top"}>
      <Container>
        <Row className={"d-center bg-white"}>
          <Col className={"text-center"}>
            <p className={"text-dark fw-700 pt-20"}>&copy; JUNGHO's Domain</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
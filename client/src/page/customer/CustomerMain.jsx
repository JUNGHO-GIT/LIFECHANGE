// CustomerMain.jsx

import axios from "axios";
import React, {useState} from "react";
import InputMask from "react-input-mask";
import {useNavigate} from "react-router-dom";
import {Container, Row, Col, Card, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const CustomerMain = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_OBJECT = process.env.REACT_APP_URL_USER;
  const navParam = useNavigate();

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"root-wrapper"}>
        <Card className={"container-wrapper"}>
          <Container>
            <Row className={"row d-center mt-5"}>
              <Col xs={12}>
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};
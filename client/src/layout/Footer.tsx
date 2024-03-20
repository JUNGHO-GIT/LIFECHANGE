// Footer.tsx

import React from "react";
import {createGlobalStyle} from "styled-components";

// ------------------------------------------------------------------------------------------------>
const FooterStyle = createGlobalStyle`
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    color: white;
    text-align: center;
  }
`;

// ------------------------------------------------------------------------------------------------>
export const Footer = () => {
  return (
    <footer className="container-fluid footer box-top">
      <FooterStyle />
      <div className="row d-center bg-white">
        <div className="col-12">
          <p className="text-dark fw-700 pt-20">&copy; JUNGHO's Domain</p>
        </div>
      </div>
    </footer>
  );
};
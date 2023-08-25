// Footer.tsx
import React from "react";
import {createGlobalStyle} from "styled-components";
import "../assets/css/Custom.css";

// ------------------------------------------------------------------------------------------------>
const FooterStyle = createGlobalStyle`
  .footer {
    width: 100%;
    background-color: #343a40;
    color: white;
    text-align: center;
    font-weight: bolder;
    bottom: 0;
    position: fixed;
    z-index: 9999;
  }
`;

// ------------------------------------------------------------------------------------------------>
const Footer = () => {

  // ---------------------------------------------------------------------------------------------->
  return (
    <footer className="footer"><FooterStyle />
      <div className="row pb-6 pt-6">
        <div className="col-12 custom-flex-center">
          <span className="">&copy; JUNGHO's Domain</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from "react";
import "../assets/css/Custom.css";
import {createGlobalStyle} from "styled-components";

const FooterStyle = createGlobalStyle`
  .footer {
    width: 100%;
    background-color: #343a40;
    color: white;
    text-align: center;
    font-weight: bolder;
    bottom: 0;
    position: relative;
    z-index: 9999;
  }
`;

// ------------------------------------------------------------------------------------------------>
const Footer = () => {

  // ---------------------------------------------------------------------------------------------->
  return (
    <>
      <FooterStyle />
      <footer className="footer">
        <div className="row pb-6 pt-6">
          <div className="col-12 custom-flex-center">
            <span className="">&copy; JUNGHO's Domain</span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

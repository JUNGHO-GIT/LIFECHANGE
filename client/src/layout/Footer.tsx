import React from "react";
import "../assets/css/Custom.css";
import {createGlobalStyle} from "styled-components";

// ------------------------------------------------------------------------------------------------>
const FooterStyle = createGlobalStyle`
  .footer {
    position: sticky;
    bottom: 0;
    width: 100%;
    background-color: #343a40;
    color: white;
    text-align: center;
    font-weight: bolder;
  }
`;

// ------------------------------------------------------------------------------------------------>
const Footer = () => {

  return (
    <div><FooterStyle />
      <footer className="footer">
        <div className="row pb-6 pt-6">
          <div className="col-12 custom-flex-center">
            <span className="">&copy; JUNGHO's Domain</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;

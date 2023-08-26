// Header.tsx
 import React from "react";
 import { Link } from "react-router-dom";
 import {createGlobalStyle} from "styled-components";
 import Sidebar from "./Sidebar";
 import "../assets/css/Custom.css";

 // ------------------------------------------------------------------------------------------------>
 const HeaderStyle = createGlobalStyle`
   .header {
     width: 100%;
     background-color: #343a40;
     color: #fff;
   }

   .nav {
     display: flex;
     flex-wrap: nowrap;
     overflow-x: auto;
     text-align: center;
     white-space: nowrap;
     -webkit-overflow-scrolling: touch;
     padding: 0px 0px 30px 0px;
   }

   .form-control-dark {
     border-color: var(--bs-gray);
   }

   .form-control-dark:focus {
     border-color: #fff;
     box-shadow: 0 0 0 .25rem rgba(255, 255, 255, .25);
   }

   .dropdown-toggle {
     outline: 0;
   }
 `;

 // ------------------------------------------------------------------------------------------------>
 const Header = () => {
   const user_id = sessionStorage.getItem("user_id");

   // ---------------------------------------------------------------------------------------------->
   const navList = () => {
     return (
       <ul className="nav">
         <li>
           <Link to="/" className="nav-link text-hover ms-2 text-white">
             Home
           </Link>
         </li>
         <li>
           <Link to="/userDetail" className="nav-link text-hover ms-2 text-white">
             User
           </Link>
         </li>
         <li>
           <Link to="/boardList" className="nav-link text-hover ms-2 text-white">
             Board
           </Link>
         </li>
         <li>
           <Link to="/calendarList" className="nav-link text-hover ms-2 text-white">
             Calendar
           </Link>
         </li>
         <li>
           <Link to="/foodList" className="nav-link text-hover ms-2 text-white">
             Food
           </Link>
         </li>
       </ul>
     );
   };

   // ---------------------------------------------------------------------------------------------->
   const formList = () => {
     return (
       <form className="form-group custom-flex-center">
         {user_id !== "false" ? (
           <button
             type="button"
             className="btn btn-outline-light ms-2"
             onClick={() => {
               sessionStorage.setItem("user_id", "false");
               window.location.reload();
             }}>
             Logout
           </button>
         ) : (
           <>
             <button type="button" className="btn btn-outline-light ms-2" onClick={() => (window.location.href = "/userLogin")}>
               Login
             </button>
             <button type="button" className="btn btn-outline-light ms-2" onClick={() => (window.location.href = "/userInsert")}>
               Signup
             </button>
           </>
         )}
       </form>
     );
   };

  // ---------------------------------------------------------------------------------------------->
  return (
     <>
     <HeaderStyle />
     <header className="header">
       <div className="row custom-flex-center">
         <div className="d-lg-block col-12 custom-flex-center mt-6 ps-10">
           {navList()}
         </div>
         <div className="col-lg-6 col-7 custom-flex-right pe-10">
           {formList()}
         </div>
       </div>
     </header>
     </>
   );
 };

 export default Header;
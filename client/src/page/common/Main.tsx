// Main.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import { DayClickEventHandler, DayPicker } from "react-day-picker";
import { useStorage } from "../../assets/ts/useStorage";
import { ko } from "date-fns/locale";
import {parseISO} from "date-fns";
import moment from "moment-timezone";
import axios from "axios";
import {createGlobalStyle} from "styled-components";

// ------------------------------------------------------------------------------------------------>
const MainStyle = createGlobalStyle`

  .main-container {
    object-fit: cover;
  }

  .carousel-caption {
    color: var(--bs-black);
    bottom: 6rem;
    z-index: 10;
  }

  .carousel-control-prev-icon,
  .carousel-control-next-icon {
    filter: invert(1) grayscale(1) brightness(10);
  }

  .carousel-indicators .active {
    filter: invert(1) grayscale(1) brightness(10);
  }

  .carousel-item {
    height: 32rem;
    transition: -webkit-transform 0.3s ease;
    overflow: hidden;
    opacity: 0.5;
    text-align: center;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
  }

  .carousel-item.active {
    opacity: 1;
  }

  .bd-placeholder-img {
    font-size: 1.125rem;
    text-anchor: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }
`;

// ------------------------------------------------------------------------------------------------>
export const Main = () => {

  // date
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");

  // ---------------------------------------------------------------------------------------------->
  const CarouselFirst = () => {
    const enterIn = (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      window.location.href = "http://www.junghomun.com:8888";
    };
    return (
      <div className="carousel-item active">
        <div style={{ width: "100%", height: "100%", backgroundColor: "#eeeeee" }}></div>
        <div className="carousel-caption tt-s">
          <h1 className="mb-10">Managing Server</h1>
          <p className="mb-10">Modification and management of servers running on Tomcat</p>
          <a className="btn btn-sm btn-lg btn-primary" href="#" onClick={enterIn}>ENTER</a>
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const CarouselSecond = () => {
    return (
      <div className="carousel-item">
        <div style={{ width: "100%", height: "100%", backgroundColor: "#eeeeee" }}></div>
        <div className="carousel-caption tt-c">
          <h1 className="mb-10">Calendar List</h1>
          <p className="mb-10">Enter the date to view the calendar</p>
          <button className="btn btn-sm btn-lg btn-primary" onClick={() => {
            navParam(`/calendarList`);
          }}>
            ENTER
          </button>
        </div>
      </div>
    );
  };

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="main-container"><MainStyle />
      <div id="myCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1"
          aria-label="Slide 2"></button>
        </div>
        <div className="carousel-inner">
          <CarouselFirst />
          <CarouselSecond />
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};
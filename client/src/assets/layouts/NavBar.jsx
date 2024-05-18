// NavBar.jsx

import {React, useState, useLocation, useEffect} from "../../import/ImportReacts.jsx";
import {moment} from "../../import/ImportLibs.jsx";
import {PopUp, Div} from "../../import/ImportComponents.jsx";
import {Paper} from "../../import/ImportMuis.jsx";
import {smile1, smile2, smile3, smile4, smile5} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const NavBar = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const location = useLocation();
  const PATH = location.pathname?.trim()?.toString();
  const percent = JSON.parse(sessionStorage.getItem("percent") || "{}");
  const firstStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const secondStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
  const thirdStr = PATH?.split("/")[3] ? PATH?.split("/")[3] : "";
  const part = firstStr.charAt(0).toUpperCase() + firstStr.slice(1);
  const type = secondStr.charAt(0).toUpperCase() + secondStr.slice(1);
  const plan = thirdStr.charAt(0).toUpperCase() + thirdStr.slice(1);

  // 3. logic ------------------------------------------------------------------------------------->
  const makeIcon = (part, className) => {
    if (
      parseFloat(percent?.[`${part}`]?.average?.score) > 0 &&
      parseFloat(percent?.[`${part}`]?.average?.score) <= 1
    ) {
      return (
        <Div className={"d-center"}>
          <img src={smile1} className={className} alt={"smile1"} />
          <Div className={"fs-0-7rem"}>{percent?.[`${part}`]?.average?.score}</Div>
        </Div>
      );
    }
    else if (
      parseFloat(percent?.[`${part}`]?.average?.score) > 1 &&
      parseFloat(percent?.[`${part}`]?.average?.score) <= 2
    ) {
      return (
        <Div className={"d-center"}>
          <img src={smile2} className={className} alt={"smile2"} />
          <Div className={"fs-0-7rem"}>{percent?.[`${part}`]?.average?.score}</Div>
        </Div>
      );
    }
    else if (
      parseFloat(percent?.[`${part}`]?.average?.score) > 2 &&
      parseFloat(percent?.[`${part}`]?.average?.score) <= 3
    ) {
      return (
        <Div className={"d-center"}>
          <img src={smile3} className={className} alt={"smile3"} />
          <Div className={"fs-0-7rem"}>{percent?.[`${part}`]?.average?.score}</Div>
        </Div>
      );
    }
    else if (
      parseFloat(percent?.[`${part}`]?.average?.score) > 3 &&
      parseFloat(percent?.[`${part}`]?.average?.score) <= 4
    ) {
      return (
        <Div className={"d-center"}>
          <img src={smile4} className={className} alt={"smile4"} />
          <Div className={"fs-0-7rem"}>{percent?.[`${part}`]?.average?.score}</Div>
        </Div>
      );
    }
    else if (
      parseFloat(percent?.[`${part}`]?.average?.score) > 4 &&
      parseFloat(percent?.[`${part}`]?.average?.score) <= 5
    ) {
      return (
        <Div className={"d-center"}>
          <img src={smile5} className={className} alt={"smile5"} />
          <Div className={"fs-0-7rem"}>{percent?.[`${part}`]?.average?.score}</Div>
        </Div>
      );
    }
  };

  // 6. default ----------------------------------------------------------------------------------->
  const defaultNode = () => (
    <Div className={"block-wrapper d-row h-7vh w-100vw"}>
      <Div className={"d-center"}>
        <Div className={"fs-1-0rem fw-bold navy"}>
          {part} {type ? ` / ${type}` : ""} {plan ? ` / ${plan}` : ""}
        </Div>
      </Div>
      <Div className={"d-center ms-auto"}>
        <Div className={"d-center"}>
          <PopUp
            type={"dropdown"}
            position={"bottom"}
            direction={"center"}
            contents={({closePopup}) => (
              <Div className={"d-column p-10"}>
                <Div className={"fs-0-8rem fw-bold mb-10"}>
                  {moment().format("YYYY-MM-DD (ddd)")}
                </Div>
                <Div className={"d-center mb-10"}>
                  <Div className={"fs-0-8rem fw-bold me-5"}>총합</Div>
                  {makeIcon("total", "w-max3vw h-max3vh")}
                </Div>
                <Div className={"d-center mb-10"}>
                  <Div className={"fs-0-8rem fw-bold me-5"}>운동</Div>
                  {makeIcon("exercise", "w-max3vw h-max3vh")}
                </Div>
                <Div className={"d-center mb-10"}>
                  <Div className={"fs-0-8rem fw-bold me-5"}>식단</Div>
                  {makeIcon("food", "w-max3vw h-max3vh")}
                </Div>
                <Div className={"d-center mb-10"}>
                  <Div className={"fs-0-8rem fw-bold me-5"}>재무</Div>
                  {makeIcon("money", "w-max3vw h-max3vh")}
                </Div>
                <Div className={"d-center"}>
                  <Div className={"fs-0-8rem fw-bold me-5"}>수면</Div>
                  {makeIcon("sleep", "w-max3vw h-max3vh")}
                </Div>
              </Div>
            )}>
            {(popTrigger={}) => (
              <Div className={"d-center pointer"} onClick={(e) => {
                popTrigger.openPopup(e.currentTarget)
              }}>
                {!part || part === "Calendar" ? (
                  makeIcon("total", "w-max5vw h-max5vh")
                ) : (
                  makeIcon(part.toLowerCase(), "w-max5vw h-max5vh")
                )}
              </Div>
            )}
          </PopUp>
        </Div>
      </Div>
    </Div>
  );

  // 7. navbar ------------------------------------------------------------------------------------>
  const navbarNode = () => (
    <Paper className={"flex-wrapper p-sticky top-7vh"}>
      {defaultNode()}
    </Paper>
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
    {navbarNode()}
    </>
  );
};
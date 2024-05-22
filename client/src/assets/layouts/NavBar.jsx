// NavBar.jsx

import {React, useLocation, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useLanguage} from "../../import/ImportHooks.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {moment} from "../../import/ImportLibs.jsx";
import {PopUp, Div, Img, Br10} from "../../import/ImportComponents.jsx";
import {Paper} from "../../import/ImportMuis.jsx";
import {smile1, smile2, smile3, smile4, smile5, flag1, flag2} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const NavBar = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const location = useLocation();
  const {lang, setLang} = useLanguage();
  const {translate} = useTranslate();
  const sessionId = sessionStorage.getItem("sessionId");
  const percent = JSON.parse(sessionStorage.getItem("percent") || "{}");
  const PATH = location.pathname?.trim()?.toString();
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";
  const part = firstStr.charAt(0).toUpperCase() + firstStr.slice(1);
  const type = secondStr.charAt(0).toUpperCase() + secondStr.slice(1);
  const plan = thirdStr.charAt(0).toUpperCase() + thirdStr.slice(1);

  // 3. logic ------------------------------------------------------------------------------------->
  const makeIcon = (part, className, text) => {

    const classType = text === "N" ? "d-none" : "fs-0-7rem ms-5";

    if (
      parseFloat(percent?.[`${part}`]?.average?.score) > 0 &&
      parseFloat(percent?.[`${part}`]?.average?.score) <= 1
    ) {
      return (
        <Div className={"d-center"}>
          <Img src={smile1} className={className} />
          <Div className={classType}>
            {percent?.[`${part}`]?.average?.score}
          </Div>
        </Div>
      );
    }
    else if (
      parseFloat(percent?.[`${part}`]?.average?.score) > 1 &&
      parseFloat(percent?.[`${part}`]?.average?.score) <= 2
    ) {
      return (
        <Div className={"d-center"}>
          <Img src={smile2} className={className} />
          <Div className={classType}>
          {percent?.[`${part}`]?.average?.score}</Div>
        </Div>
      );
    }
    else if (
      parseFloat(percent?.[`${part}`]?.average?.score) > 2 &&
      parseFloat(percent?.[`${part}`]?.average?.score) <= 3
    ) {
      return (
        <Div className={"d-center"}>
          <Img src={smile3} className={className} />
          <Div className={classType}>
          {percent?.[`${part}`]?.average?.score}</Div>
        </Div>
      );
    }
    else if (
      parseFloat(percent?.[`${part}`]?.average?.score) > 3 &&
      parseFloat(percent?.[`${part}`]?.average?.score) <= 4
    ) {
      return (
        <Div className={"d-center"}>
          <Img src={smile4} className={className} />
          <Div className={classType}>
          {percent?.[`${part}`]?.average?.score}</Div>
        </Div>
      );
    }
    else if (
      parseFloat(percent?.[`${part}`]?.average?.score) > 4 &&
      parseFloat(percent?.[`${part}`]?.average?.score) <= 5
    ) {
      return (
        <Div className={"d-center"}>
          <Img src={smile5} className={className} />
          <Div className={classType}>
          {percent?.[`${part}`]?.average?.score}</Div>
        </Div>
      );
    }
  };

  // 6. default ----------------------------------------------------------------------------------->
  const defaultNode = () => (
    <Div className={"block-wrapper d-row h-max7vh w-100vw"}>
      <Div className={"d-center ms-10"}>
        <Div className={"fs-1-0rem navy"}>
          {part ? part : "Home"} {type ? ` / ${type}` : ` / `} {plan ? ` / ${plan}` : ``}
        </Div>
      </Div>
      <Div className={"d-center ms-auto"}>
        <PopUp
          type={"dropdown"}
          position={"bottom"}
          direction={"center"}
          contents={({closePopup}) => (
            <Div className={"d-column align-left p-5"}>
              <Div className={`d-center pointer ${lang === "ko" ? "bg-light" : ""}`}
              onClick={() => {
                setLang("ko");
                closePopup();
              }}>
                <Img src={flag1} className={"w-max5vw h-max5vh me-5"} />
                <Div className={"fs-0-8rem"}>한국어</Div>
              </Div>
              <Br10 />
              <Div className={`d-center pointer ${lang === "en" ? "bg-light" : ""}`}
              onClick={() => {
                setLang("en");
                closePopup();
              }}>
                <Img src={flag2} className={"w-max5vw h-max5vh me-5"} />
                <Div className={"fs-0-8rem"}>English</Div>
              </Div>
            </Div>
          )}>
          {(popTrigger={}) => (
            <Div className={"d-center pointer"} onClick={(e) => {
              popTrigger.openPopup(e.currentTarget)
            }}>
              lang
            </Div>
          )}
        </PopUp>
      </Div>
      <Div className={"d-center ms-auto me-10"}>
        <PopUp
          type={"dropdown"}
          position={"bottom"}
          direction={"center"}
          contents={({closePopup}) => (
            <Div className={"d-column p-10"}>
              <Div className={"d-center mb-20"}>
                <Div className={"fs-0-8rem"}>{moment().format("YYYY-MM-DD (ddd)")}</Div>
              </Div>
              <Div className={"d-center mb-10"}>
                <Div className={"fs-0-8rem me-5"}>
                  {translate("navBar-total")}
                </Div>
                {makeIcon("total", "w-max5vw h-max5vh")}
              </Div>
              <Div className={"d-center mb-10"}>
                <Div className={"fs-0-8rem me-5"}>
                  {translate("navBar-exercise")}
                </Div>
                {makeIcon("exercise", "w-max5vw h-max5vh")}
              </Div>
              <Div className={"d-center mb-10"}>
                <Div className={"fs-0-8rem me-5"}>
                  {translate("navBar-food")}
                </Div>
                {makeIcon("food", "w-max5vw h-max5vh")}
              </Div>
              <Div className={"d-center mb-10"}>
                <Div className={"fs-0-8rem me-5"}>
                  {translate("navBar-money")}
                </Div>
                {makeIcon("money", "w-max5vw h-max5vh")}
              </Div>
              <Div className={"d-center mb-20"}>
                <Div className={"fs-0-8rem me-5"}>
                  {translate("navBar-sleep")}
                </Div>
                {makeIcon("sleep", "w-max5vw h-max5vh")}
              </Div>
              <Div className={"d-center"}>
                <Div className={"fs-0-6rem fw-normal"}>
                  {translate("navBar-score")}
                </Div>
              </Div>
            </Div>
          )}>
          {(popTrigger={}) => (
            <Div className={"d-center pointer"} onClick={(e) => {
              popTrigger.openPopup(e.currentTarget)
            }}>
              {firstStr === "" || firstStr === "calendar" || firstStr === "user" ? (
                makeIcon("total", "w-max8vw h-max8vh", "N")
              ) : (
                makeIcon(part.toLowerCase(), "w-max8vw h-max8vh", "N")
              )}
            </Div>
          )}
        </PopUp>
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
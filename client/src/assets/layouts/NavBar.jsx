// NavBar.jsx

import {React, useLocation, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useLanguage} from "../../import/ImportHooks.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {moment} from "../../import/ImportLibs.jsx";
import {PopUp, Div, Br10} from "../../import/ImportComponents.jsx";
import {Paper} from "../../import/ImportMuis.jsx";
import {smile1, smile2, smile3, smile4, smile5, flag1, flag2} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const NavBar = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const location = useLocation();
  const {lang, setLang} = useLanguage();
  const {translate} = useTranslate();
  const PATH = location.pathname?.trim()?.toString();
  const firstStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const secondStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
  const thirdStr = PATH?.split("/")[3] ? PATH?.split("/")[3] : "";
  const part = firstStr.charAt(0).toUpperCase() + firstStr.slice(1);
  const type = secondStr.charAt(0).toUpperCase() + secondStr.slice(1);
  const plan = thirdStr.charAt(0).toUpperCase() + thirdStr.slice(1);

  // 2-2. useState -------------------------------------------------------------------------------->
  const [percent, setPercent] = useState(JSON.parse(sessionStorage.getItem("percent") || "{}"));

  // 3. logic ------------------------------------------------------------------------------------->
  const makeIcon = (part, className, text) => {

    const classType = text === "N" ? "d-none" : "fs-0-7rem ms-5";

    if (
      parseFloat(percent?.[`${part}`]?.average?.score) > 0 &&
      parseFloat(percent?.[`${part}`]?.average?.score) <= 1
    ) {
      return (
        <Div className={"d-center"}>
          <img src={smile1} className={className} alt={"smile1"} />
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
          <img src={smile2} className={className} alt={"smile2"} />
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
          <img src={smile3} className={className} alt={"smile3"} />
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
          <img src={smile4} className={className} alt={"smile4"} />
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
          <img src={smile5} className={className} alt={"smile5"} />
          <Div className={classType}>
          {percent?.[`${part}`]?.average?.score}</Div>
        </Div>
      );
    }
  };

  // 6. default ----------------------------------------------------------------------------------->
  const defaultNode = () => (
    <Div className={"block-wrapper d-row h-7vh w-100vw"}>
      <Div className={"d-center ms-10"}>
        <Div className={"fs-1-0rem fw-bold navy"}>
          {part} {type ? ` / ${type}` : ""} {plan ? ` / ${plan}` : ""}
        </Div>
      </Div>
      <Div className={"d-center ms-auto"}>
        <PopUp
          type={"dropdown"}
          position={"bottom"}
          direction={"center"}
          contents={({closePopup}) => (
            <Div className={"d-column p-5"}>
              <Div className={`d-center pointer ${lang === "ko" ? "bg-light" : ""}`}
              onClick={() => {
                setLang("ko");
                closePopup();
              }}>
                <img src={flag1} className={"w-max5vw h-max5vh me-5"} alt={"flag1"} />
                <Div className={"fs-0-8rem"}>한국어</Div>
              </Div>
              <Br10 />
              <Div className={`d-center pointer ${lang === "en" ? "bg-light" : ""}`}
              onClick={() => {
                setLang("en");
                closePopup();
              }}>
                <img src={flag2} className={"w-max5vw h-max5vh me-5"} alt={"flag2"} />
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
                <Div className={"fs-0-8rem fw-bold"}>{moment().format("YYYY-MM-DD (ddd)")}</Div>
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
                  * 평균점수 : 1.00 ~ 5.00
                </Div>
              </Div>
            </Div>
          )}>
          {(popTrigger={}) => (
            <Div className={"d-center pointer"} onClick={(e) => {
              popTrigger.openPopup(e.currentTarget)
            }}>
              {!part || part === "Calendar" ? (
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
// UserAppSetting.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {PopUp, Div, Icons, Br20, Img} from "../../import/ImportComponents.jsx";
import {Card, Paper} from "../../import/ImportMuis.jsx";
import {TableContainer, Table} from "../../import/ImportMuis.jsx";
import {TableBody, TableRow, TableCell} from "../../import/ImportMuis.jsx";
import {flag1, flag2} from "../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const UserAppSetting = () => {

  // 1. common -------------------------------------------------------------------------------------
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();

  // 2-1. useState ---------------------------------------------------------------------------------
  const [lang, setLang] = useState(sessionStorage.getItem("lang"));
  const [isAdmin, setIsAdmin] = useState(sessionStorage.getItem("isAdmin"));

  // 6. table --------------------------------------------------------------------------------------
  const tableNode = () => {
    // 7-1. table
    const tableSection = () => {
      const tableFragment = (i) => (
        <Card className={"border radius shadow-none p-0"} key={i}>
          <TableContainer>
            <Table>
              <TableBody className={"table-tbody"}>
                {/** detail **/}
                <TableRow>
                  <TableCell className={"w-90vw p-15"}>
                    {translate("dataDetail")}
                  </TableCell>
                  <TableCell className={"w-10vw p-15"}>
                    <Icons name={"TbChevronRight"} className={"w-16 h-16 black"} onClick={() => {
                      navigate("/user/detail")
                    }} />
                  </TableCell>
                </TableRow>
                {/** category **/}
                <TableRow>
                  <TableCell className={"w-90vw p-15"}>
                    {translate("dataCategory")}
                  </TableCell>
                  <TableCell className={"w-10vw p-15"}>
                    <Icons name={"TbChevronRight"} className={"w-16 h-16 black"} onClick={() => {
                      navigate("/user/category")
                    }} />
                  </TableCell>
                </TableRow>
                {/** list **/}
                <TableRow className={`${isAdmin !== "true" ? "d-none" : ""}`}>
                  <TableCell className={"w-90vw p-15"}>
                    {translate("dataList")}
                  </TableCell>
                  <TableCell className={"w-10vw p-15"}>
                    <Icons name={"TbChevronRight"} className={"w-16 h-16 black"} onClick={() => {
                      navigate("/user/dummy")
                    }} />
                  </TableCell>
                </TableRow>
                {/** language **/}
                <TableRow>
                  <TableCell className={"w-90vw p-15"}>
                    {translate("language")}
                  </TableCell>
                  <TableCell className={"w-10vw p-15"}>
                    <PopUp
                      type={"innerCenter"}
                      position={"bottom"}
                      direction={"center"}
                      contents={({closePopup}) => (
                      <Div className={"d-left"}>
                        <Div className={"d-center"} onClick={() => {
                          setLang("ko")
                          sessionStorage.setItem("lang", "ko")
                          navigate(0)
                        }}>
                          <Img src={flag1} className={"w-24 h-24"} />한국어
                          <Icons name={"TbCheck"} className={`w-16 h-16 black ${lang !== "ko" ? "d-none" : ""}`} onClick={() => {}} />
                        </Div>
                        <Br20 />
                        <Div className={"d-center"} onClick={() => {
                          setLang("en")
                          sessionStorage.setItem("lang", "en")
                          navigate(0)
                        }}>
                          <Img src={flag2} className={"w-24 h-24"} />English
                          <Icons name={"TbCheck"} className={`w-16 h-16 black ${lang !== "en" ? "d-none" : ""}`} onClick={() => {}} />
                        </Div>
                      </Div>
                      )}>
                      {(popTrigger={}) => (
                        <Icons name={"TbChevronRight"} className={"w-16 h-16 black"} onClick={(e) => {
                          popTrigger.openPopup(e.currentTarget)
                        }} />
                      )}
                    </PopUp>
                  </TableCell>
                </TableRow>
                {/** info **/}
                <TableRow>
                  <TableCell className={"w-90vw p-15"}>
                    {translate("info")}
                  </TableCell>
                  <TableCell className={"w-10vw p-15"}>
                    <Icons name={"TbChevronRight"} className={"w-16 h-16 black"} onClick={() => {
                      navigate("/user/app/info")
                    }} />
                  </TableCell>
                </TableRow>
                {/** logout **/}
                <TableRow>
                  <TableCell className={"w-90vw p-15"}>
                    {translate("logout")}
                  </TableCell>
                  <TableCell className={"w-10vw p-15"}>
                    <Icons name={"TbChevronRight"} className={"w-16 h-16 black"} onClick={() => {
                      localStorage.setItem("autoLogin", "false")
                      localStorage.setItem("autoLoginId", "")
                      localStorage.setItem("autoLoginPw", "")
                      sessionStorage.clear()
                      navigate("/")
                    }} />
                  </TableCell>
                </TableRow>
                {/** deletes **/}
                <TableRow>
                  <TableCell className={"w-90vw p-15 red"}>
                    {translate("userDeletes")}
                  </TableCell>
                  <TableCell className={"w-10vw p-15"}>
                    <Icons name={"TbChevronRight"} className={"w-16 h-16 black"} onClick={() => {
                      navigate("/user/deletes")
                    }} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      );
      return (
        tableFragment(0)
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border shadow-none"}>
        <Div className={"block-wrapper d-row h-min80vh"}>
          {tableSection()}
        </Div>
      </Paper>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {tableNode()}
    </>
  );
};
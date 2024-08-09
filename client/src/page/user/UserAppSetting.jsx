// UserAppSetting.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {useTranslate, useStorage} from "../../import/ImportHooks.jsx";
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
                <TableRow
                  className={"pointer"}
                  onClick={() => {
                    navigate("/user/detail")
                  }}
                >
                  <TableCell className={"w-90vw p-15"}>
                    {translate("dataDetail")}
                  </TableCell>
                  <TableCell className={"w-10vw p-15"}>
                    <Icons
                      name={"TbChevronRight"}
                      className={"w-16 h-16 black"}
                      onClick={() => {}}
                    />
                  </TableCell>
                </TableRow>
                {/** category **/}
                <TableRow
                  className={"pointer"}
                  onClick={() => {
                    navigate("/user/category")
                  }}
                >
                  <TableCell className={"w-90vw p-15"}>
                    {translate("dataCategory")}
                  </TableCell>
                  <TableCell className={"w-10vw p-15"}>
                    <Icons
                      name={"TbChevronRight"}
                      className={"w-16 h-16 black"}
                      onClick={() => {}}
                    />
                  </TableCell>
                </TableRow>
                {/** list **/}
                <TableRow
                  className={`${isAdmin !== "true" ? "d-none" : ""} pointer`}
                  onClick={() => {
                    navigate("/user/dummy")
                  }}
                >
                  <TableCell className={"w-90vw p-15"}>
                    {translate("dataList")}
                  </TableCell>
                  <TableCell className={"w-10vw p-15"}>
                    <Icons
                      name={"TbChevronRight"}
                      className={"w-16 h-16 black"}
                      onClick={() => {}}
                    />
                  </TableCell>
                </TableRow>
                {/** language **/}
                <PopUp
                  type={"innerCenter"}
                  position={"bottom"}
                  direction={"center"}
                  contents={({closePopup}) => (
                  <Div className={"d-column"}>
                    <Div
                      className={"d-center"}
                      onClick={() => {
                        setLang("ko")
                        sessionStorage.setItem("lang", "ko")
                        navigate(0)
                      }}
                    >
                      <Img className={"w-24 h-24"} src={flag1} />
                      <Div className={`${lang === "ko" ? "fw-700" : ""}`}>
                        한국어
                      </Div>
                      <Icons
                        name={"TbCheck"}
                        className={`w-16 h-16 black ${lang === "ko" ? "" : "d-none"}`}
                        onClick={() => {}}
                      />
                    </Div>
                    <Br20 />
                    <Div
                      className={"d-center"}
                      onClick={() => {
                        setLang("en")
                        sessionStorage.setItem("lang", "en")
                        navigate(0)
                      }}
                    >
                      <Img src={flag2} className={"w-24 h-24"} />
                      <Div className={`${lang === "en" ? "fw-700" : ""}`}>
                        English
                      </Div>
                      <Icons
                        name={"TbCheck"}
                        className={`w-16 h-16 black ${lang === "en" ? "" : "d-none"}`}
                        onClick={() => {}}
                      />
                    </Div>
                  </Div>
                  )}>
                  {(popTrigger={}) => (
                    <TableRow
                      className={"pointer"}
                      onClick={(e) => {
                        popTrigger.openPopup(e.currentTarget)
                      }}
                    >
                      <TableCell className={"w-90vw p-15"}>
                        {translate("language")}
                      </TableCell>
                      <TableCell className={"w-10vw p-15"}>
                        <Icons
                          name={"TbChevronRight"}
                          className={"w-16 h-16 black"}
                          onClick={() => {}}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </PopUp>
                {/** app info **/}
                <TableRow
                  className={"pointer"}
                  onClick={() => {
                    navigate("/user/app/info")
                  }}
                >
                  <TableCell className={"w-90vw p-15"}>
                    {translate("appInfo")}
                  </TableCell>
                  <TableCell className={"w-10vw p-15"}>
                    <Icons
                      name={"TbChevronRight"}
                      className={"w-16 h-16 black"}
                      onClick={() => {}}
                    />
                  </TableCell>
                </TableRow>
                {/** logout **/}
                <TableRow
                  className={"pointer"}
                  onClick={() => {
                    localStorage.setItem("autoLogin", "false")
                    localStorage.setItem("autoLoginId", "")
                    localStorage.setItem("autoLoginPw", "")
                    sessionStorage.clear()
                    navigate("/")
                  }}
                >
                  <TableCell className={"w-90vw p-15"}>
                    {translate("logout")}
                  </TableCell>
                  <TableCell className={"w-10vw p-15"}>
                    <Icons
                      name={"TbChevronRight"}
                      className={"w-16 h-16 black"}
                      onClick={() => {}}
                    />
                  </TableCell>
                </TableRow>
                {/** deletes **/}
                <TableRow
                  className={"pointer"}
                  onClick={() => {
                    navigate("/user/deletes")
                  }}
                >
                  <TableCell className={"w-90vw p-15 red"}>
                    {translate("userDeletes")}
                  </TableCell>
                  <TableCell className={"w-10vw p-15"}>
                    <Icons
                      name={"TbChevronRight"}
                      className={"w-16 h-16 black"}
                      onClick={() => {}}
                    />
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
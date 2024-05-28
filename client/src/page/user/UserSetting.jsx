// UserSetting.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {PopUp, Div, Icons, Br20, Img} from "../../import/ImportComponents.jsx";
import {Card, Paper} from "../../import/ImportMuis.jsx";
import {TableContainer, Table} from "../../import/ImportMuis.jsx";
import {TableBody, TableRow, TableCell} from "../../import/ImportMuis.jsx";
import {flag1, flag2} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const UserSetting = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [lang, setLang] = useState(sessionStorage.getItem('lang'));

  // 6. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-7. fragment
    const tableFragment = (i=0) => (
      <Card className={"border radius p-0"} key={i}>
        <TableContainer>
          <Table>
            <TableBody className={"table-tbody"}>
              <TableRow>
                <TableCell className={"w-90vw"}>
                  {translate("user-dataDetail")}
                </TableCell>
                <TableCell className={"w-10vw"}>
                  <Icons name={"TbChevronRight"} className={"w-16 h-16 black"} onClick={() => {
                    navigate("/user/data/detail")
                  }} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={"w-90vw"}>
                  {translate("user-dataCustom")}
                </TableCell>
                <TableCell className={"w-10vw"}>
                  <Icons name={"TbChevronRight"} className={"w-16 h-16 black"} onClick={() => {
                    navigate("/user/data/custom")
                  }} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={"w-90vw"}>
                  {translate("user-dataList")}
                </TableCell>
                <TableCell className={"w-10vw"}>
                  <Icons name={"TbChevronRight"} className={"w-16 h-16 black"} onClick={() => {
                    navigate("/user/data/list")
                  }} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={"w-90vw"}>
                  {translate("user-language")}
                </TableCell>
                <TableCell className={"w-10vw"}>
                  <PopUp
                    type={"innerCenter"}
                    position={"bottom"}
                    direction={"center"}
                    contents={({closePopup}) => (
                    <Div className={"d-column align-left"}>
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
              <TableRow>
                <TableCell className={"w-90vw"}>
                  {translate("user-logout")}
                </TableCell>
                <TableCell className={"w-10vw"}>
                  <Icons name={"TbChevronRight"} className={"w-16 h-16 black"} onClick={() => {
                    sessionStorage.clear()
                    navigate("/")
                  }} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={"w-90vw"}>
                  {translate("user-info")}
                </TableCell>
                <TableCell className={"w-10vw"}>
                  <Icons name={"TbChevronRight"} className={"w-16 h-16 black"} onClick={() => {
                    navigate("/user/data/info")
                  }} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-8. table
    const tableSection = () => (
      tableFragment(0)
    );
    // 7-9. third
    const thirdSection = () => (
      tableSection()
    );
    // 7-10. return
    return (
      <Paper className={"content-wrapper"}>
        <Div className={"block-wrapper d-row h-min87vh"}>
          {thirdSection()}
        </Div>
      </Paper>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {tableNode()}
    </>
  );
};
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
                  회원정보 수정
                </TableCell>
                <TableCell className={"w-10vw"}>
                  <Icons name={"TbChevronRight"} className={"w-16 h-16 black"} onClick={() => {
                    alert("회원정보 수정")
                  }} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={"w-90vw"}>
                  카테고리 설정
                </TableCell>
                <TableCell className={"w-10vw"}>
                  <Icons name={"TbChevronRight"} className={"w-16 h-16 black"} onClick={() => {
                    navigate("/user/data/custom")
                  }} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={"w-90vw"}>
                  데이터 관리
                </TableCell>
                <TableCell className={"w-10vw"}>
                  <Icons name={"TbChevronRight"} className={"w-16 h-16 black"} onClick={() => {
                    navigate("/user/data/list")
                  }} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={"w-90vw"}>
                  언어 설정
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
                      }}>
                        <Img src={flag1} className={"w-24 h-24"} />한국어
                        <Icons name={"TbCheck"} className={`w-16 h-16 black ${lang !== "ko" ? "d-none" : ""}`} onClick={() => {}} />
                      </Div>
                      <Br20 />
                      <Div className={"d-center"} onClick={() => {
                        setLang("en")
                        sessionStorage.setItem("lang", "en")
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
                  로그아웃
                </TableCell>
                <TableCell className={"w-10vw"}>
                  <Icons name={"TbChevronRight"} className={"w-16 h-16 black"} onClick={() => {
                    sessionStorage.clear()
                    localStorage.clear()
                    navigate("/")
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
    // 7-11. third
    const thirdSection = () => (
      tableSection()
    );
    // 7-12. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper d-row h-min85vh"}>
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
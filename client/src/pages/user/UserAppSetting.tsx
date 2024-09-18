// UserAppSetting.tsx
// Node -> Section -> Fragment

import { useState } from "@imports/ImportReacts";
import { useCommonValue, useTranslate } from "@imports/ImportHooks";
import { Loading } from "@imports/ImportLayouts";
import { Icons, Img, Div } from "@imports/ImportComponents";
import { PopUp } from "@imports/ImportContainers";
import { Card, Paper, Grid } from "@imports/ImportMuis";
import { TableContainer, Table, TableBody, TableRow, TableCell } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const UserAppSetting = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate,
  } = useTranslate();
  const {
    navigate, isAdmin, TITLE, localLang
  } = useCommonValue();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [lang, setLang] = useState<string>(localLang);

  // 7. userAppSetting ----------------------------------------------------------------------------
  const userAppSettingNode = () => {
    // 7-1. card
    const detailSection = () => {
      const detailFragment = (i: number) => (
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
                      name={"ChevronRight"}
                      className={"w-16 h-16 black"}
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
                    {translate("category")}
                  </TableCell>
                  <TableCell className={"w-10vw p-15"}>
                    <Icons
                      name={"ChevronRight"}
                      className={"w-16 h-16 black"}
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
                      name={"ChevronRight"}
                      className={"w-16 h-16 black"}
                    />
                  </TableCell>
                </TableRow>
                {/** language **/}
                <PopUp
                  type={"innerCenter"}
                  position={"bottom"}
                  direction={"center"}
                  contents={
                    <Div className={"d-column"}>
                      <Div
                        className={"d-center mb-20"}
                        onClick={() => {
                          setLang("ko")
                          localStorage.setItem(`${TITLE}_lang`, "ko")
                          navigate(0)
                        }}
                      >
                        <Img
                          key={"flag1"}
                          src={"flag1"}
                          className={"w-24 h-24 me-15"}
                        />
                        <Div className={`me-15 ${lang === "ko" ? "fw-700" : ""}`}>
                          한국어
                        </Div>
                        <Icons
                          name={"Check"}
                          className={`w-16 h-16 black ${lang === "ko" ? "" : "d-none"}`}
                        />
                      </Div>
                      <Div
                        className={"d-center"}
                        onClick={() => {
                          setLang("en")
                          localStorage.setItem(`${TITLE}_lang`, "en")
                          navigate(0)
                        }}
                      >
                        <Img
                          key={"flag2"}
                          src={"flag2"}
                          className={"w-24 h-24 me-15"}
                        />
                        <Div className={`me-15 ${lang === "en" ? "fw-700" : ""}`}>
                          English
                        </Div>
                        <Icons
                          name={"Check"}
                          className={`w-16 h-16 black ${lang === "en" ? "" : "d-none"}`}
                        />
                      </Div>
                    </Div>
                  }
                >
                  {(popTrigger: any) => (
                    <TableRow
                      className={"pointer"}
                      onClick={(e: any) => {
                        popTrigger.openPopup(e.currentTarget)
                      }}
                    >
                      <TableCell className={"w-90vw p-15"}>
                        {translate("language")}
                      </TableCell>
                      <TableCell className={"w-10vw p-15"}>
                        <Icons
                          name={"ChevronRight"}
                          className={"w-16 h-16 black"}
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
                      name={"ChevronRight"}
                      className={"w-16 h-16 black"}
                    />
                  </TableCell>
                </TableRow>
                {/** logout **/}
                <TableRow
                  className={"pointer"}
                  onClick={() => {
                    localStorage.setItem(`${TITLE}_autoLogin`, "false")
                    localStorage.setItem(`${TITLE}_autoLoginId`, "")
                    localStorage.setItem(`${TITLE}_autoLoginPw`, "")
                    sessionStorage.clear()
                    navigate("/")
                  }}
                >
                  <TableCell className={"w-90vw p-15"}>
                    {translate("logout")}
                  </TableCell>
                  <TableCell className={"w-10vw p-15"}>
                    <Icons
                      name={"ChevronRight"}
                      className={"w-16 h-16 black"}
                    />
                  </TableCell>
                </TableRow>
                {/** delete **/}
                <TableRow
                  className={"pointer"}
                  onClick={() => {
                    navigate("/user/delete")
                  }}
                >
                  <TableCell className={"w-90vw p-15 red"}>
                    {translate("userDelete")}
                  </TableCell>
                  <TableCell className={"w-10vw p-15"}>
                    <Icons
                      name={"ChevronRight"}
                      className={"w-16 h-16 black"}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      );
      return (
        LOADING ? <Loading /> : detailFragment(0)
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper d-center radius border h-min90vh"}>
        <Grid container spacing={2}>
          <Grid size={12}>
            {detailSection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {userAppSettingNode()}
    </>
  );
};
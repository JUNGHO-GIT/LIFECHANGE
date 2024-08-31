// UserAppSetting.tsx
// Node -> Section -> Fragment

import { useState } from "@imports/ImportReacts";
import { useCommon } from "@imports/ImportHooks";
import { Loading } from "@imports/ImportLayouts";
import { Icons, Img, Div } from "@imports/ImportComponents";
import { PopUp } from "@imports/ImportContainers";
import { Card, Paper, Grid } from "@imports/ImportMuis";
import { TableContainer, Table, TableFooter } from "@imports/ImportMuis";
import { TableHead, TableBody, TableRow, TableCell } from "@imports/ImportMuis";
import { flag1, flag2 } from "@imports/ImportImages";

// -------------------------------------------------------------------------------------------------
export const UserAppSetting = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    navigate, translate
  } = useCommon();

  // 2-1. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [admin, setIsAdmin] = useState<string | null>(sessionStorage.getItem("admin"));
  const [lang, setLang] = useState<string>(sessionStorage.getItem("LANG") || "ko");

  // 7. userAppSetting ----------------------------------------------------------------------------
  const userAppSettingNode = () => {
    // 7-1. card
    const cardSection = () => {
      const cardFragment = (i: number) => (
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
                      name={"TbChevronRight"}
                      className={"w-16 h-16 black"}
                    />
                  </TableCell>
                </TableRow>
                {/** list **/}
                <TableRow
                  className={`${admin !== "true" ? "d-none" : ""} pointer`}
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
                    />
                  </TableCell>
                </TableRow>
                {/** language **/}
                <PopUp
                  type={"innerCenter"}
                  position={"bottom"}
                  direction={"center"}
                  contents={({closePopup}: any) => (
                    <Div className={"d-column"}>
                      <Div
                        className={"d-center mb-20"}
                        onClick={() => {
                          setLang("ko")
                          sessionStorage.setItem("LANG", "ko")
                          navigate(0)
                        }}
                      >
                        <Img
                          className={"w-24 h-24 me-15"}
                          src={flag1}
                          alt={"flag1"}
                        />
                        <Div className={`me-15 ${lang === "ko" ? "fw-700" : ""}`}>
                          한국어
                        </Div>
                        <Icons
                          name={"TbCheck"}
                          className={`w-16 h-16 black ${lang === "ko" ? "" : "d-none"}`}
                        />
                      </Div>
                      <Div
                        className={"d-center"}
                        onClick={() => {
                          setLang("en")
                          sessionStorage.setItem("LANG", "en")
                          navigate(0)
                        }}
                      >
                        <Img
                          className={"w-24 h-24 me-15"}
                          src={flag2}
                          alt={"flag2"}
                        />
                        <Div className={`me-15 ${lang === "en" ? "fw-700" : ""}`}>
                          English
                        </Div>
                        <Icons
                          name={"TbCheck"}
                          className={`w-16 h-16 black ${lang === "en" ? "" : "d-none"}`}
                        />
                      </Div>
                    </Div>
                  )}>
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
                          name={"TbChevronRight"}
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
                      name={"TbChevronRight"}
                      className={"w-16 h-16 black"}
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
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      );
      return (
        LOADING ? <Loading /> : cardFragment(0)
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper d-center radius border h-min98vh"}>
        <Grid container spacing={2}>
          <Grid size={12}>
            {cardSection()}
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
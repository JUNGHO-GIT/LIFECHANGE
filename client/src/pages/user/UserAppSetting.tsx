// UserAppSetting.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { setLocal } from "@imports/ImportUtils";
import { Loading } from "@imports/ImportLayouts";
import { PopUp } from "@imports/ImportContainers";
import { Icons, Img, Div, Br } from "@imports/ImportComponents";
import { Paper, Grid, Card } from "@imports/ImportMuis";
import { TableContainer, Table, TableBody, TableRow, TableCell } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const UserAppSetting = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { navigate, isAdmin, localLang } = useCommonValue();
  const { translate } = useLanguageStore();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [lang, setLang] = useState<string>(localLang);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    setTimeout(() => {
      setLOADING(false);
    }, 500);
  }, []);

  // 4. handle -------------------------------------------------------------------------------------
  const handleLogout = () => {
    setLocal("setting", "id", "", {
      autoLogin: "false",
      autoLoginId: "",
      autoLoginPw: "",
    });
    sessionStorage.clear();
    navigate("/user/login");
  };

  // 4. handle -------------------------------------------------------------------------------------
  const handleChangeLanguage = (lang: string) => {
    setLang(lang);
    setLocal("setting", "locale", "lang", lang);
    navigate(0);
  };

  // 7. userAppSetting ----------------------------------------------------------------------------
  const userAppSettingNode = () => {
    // 7-1. detail
    const detailSection = () => {
      const detailFragment = () => (
        <Grid container={true} spacing={0} className={"border-1 radius-1 shadow-0"}>
          <Grid size={12}>
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
                      {translate("userInformation")}
                    </TableCell>
                    <TableCell className={"w-10vw p-15"}>
                      <Icons
                        name={"ChevronRight"}
                        className={"w-16 h-16"}
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
                        className={"w-16 h-16"}
                      />
                    </TableCell>
                  </TableRow>
                  {/** dashboard **/}
                  <TableRow
                    className={`${isAdmin !== "true" ? "d-none" : ""} pointer`}
                    onClick={() => {
                      navigate("/admin/dashboard")
                    }}
                  >
                    <TableCell className={"w-90vw p-15"}>
                      {translate("dashboard")}
                    </TableCell>
                    <TableCell className={"w-10vw p-15"}>
                      <Icons
                        name={"ChevronRight"}
                        className={"w-16 h-16"}
                      />
                    </TableCell>
                  </TableRow>
                  {/** language **/}
                  <PopUp
                    type={"innerCenter"}
                    position={"center"}
                    direction={"center"}
                    contents={
                      <Div className={"d-col-center p-5"}>
                        <Div
                          className={"d-center"}
                          onClick={() => {
                            handleChangeLanguage("en")
                          }}
                        >
                          <Img
                            max={24}
                            hover={true}
                            shadow={false}
                            radius={false}
                            src={"flag2"}
                            className={"me-15"}
                          />
                          <Div className={`${lang === "en" ? "fw-700" : ""}`}>
                            English
                          </Div>
                          <Icons
                            key={"Check"}
                            name={"Check"}
                            className={`w-16 h-16 black ${lang === "en" ? "" : "d-none"}`}
                          />
                        </Div>
                        <Br px={20} />
                        <Div
                          className={"d-center"}
                          onClick={() => {
                            handleChangeLanguage("ko")
                          }}
                        >
                          <Img
                            max={24}
                            hover={true}
                            shadow={false}
                            radius={false}
                            src={"flag1"}
                            className={"me-15"}
                          />
                          <Div className={`${lang === "ko" ? "fw-700" : ""}`}>
                            한국어
                          </Div>
                          <Icons
                            key={"Check"}
                            name={"Check"}
                            className={`w-16 h-16 black ${lang === "ko" ? "" : "d-none"}`}
                          />
                        </Div>
                      </Div>
                    }
                    children={(popTrigger: any) => (
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
                            key={"ChevronRight"}
                            name={"ChevronRight"}
                            className={"w-16 h-16"}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  />
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
                        className={"w-16 h-16"}
                      />
                    </TableCell>
                  </TableRow>
                  {/** logout **/}
                  <TableRow
                    className={"pointer"}
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    <TableCell className={"w-90vw p-15"}>
                      {translate("logout")}
                    </TableCell>
                    <TableCell className={"w-10vw p-15"}>
                      <Icons
                        name={"ChevronRight"}
                        className={"w-16 h-16"}
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
                        className={"w-16 h-16"}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      );
      return (
        <Card className={"d-col-center"}>
          {detailFragment()}
        </Card>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper d-center border-1 radius-1 h-min90vh"}>
        {LOADING ? <Loading /> : detailSection()}
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
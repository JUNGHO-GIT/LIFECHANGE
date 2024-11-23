// UserAppSetting.tsx

import { useState, useEffect } from "@importReacts";
import { useCommonValue } from "@importHooks";
import { useStoreLanguage, useStoreConfirm, useStoreLoading } from "@importHooks";
import { setLocal } from "@importScripts";
import { PopUp } from "@importContainers";
import { Icons, Img, Div, Br } from "@importComponents";
import { Paper, Grid, Card } from "@importMuis";
import { TableContainer, Table, TableBody, TableRow, TableCell } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const UserAppSetting = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { navigate, isAdmin, localLang } = useCommonValue();
  const { translate } = useStoreLanguage();
  const { setCONFIRM } = useStoreConfirm();
  const { setLOADING } = useStoreLoading();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [lang, setLang] = useState<string>(localLang);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
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

  // 4. handle -------------------------------------------------------------------------------------
  const handleClearStorage = async () => {
    const confirmResult = new Promise((resolve) => {
      setCONFIRM({
        open: true,
        msg: "clearStorage",
      }, (confirmed: boolean) => {
        resolve(confirmed);
      });
    });
    if (await confirmResult) {
      localStorage.clear();
    }
  };

  // 7. userAppSetting ----------------------------------------------------------------------------
  const userAppSettingNode = () => {
    // 7-1. detail
    const detailSection = () => {
      const detailFragment = () => (
        <Grid container={true} spacing={0} className={"border-1 radius-2 shadow-0"}>
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
                            src={"flag2.webp"}
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
                        <Br m={20} />
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
                            src={"flag1.webp"}
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
                      navigate("/user/appInfo")
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
                  {/** clear **/}
                  <TableRow
                    className={`${isAdmin !== "true" ? "d-none" : ""} pointer`}
                    onClick={() => {
                      handleClearStorage();
                    }}
                  >
                    <TableCell className={"w-90vw p-15"}>
                      {translate("clearStorage")}
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
        <Card className={"d-col-center border-0 shadow-0 radius-0"}>
          {detailFragment()}
        </Card>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper d-center border-1 radius-2 h-min90vh"}>
        {detailSection()}
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
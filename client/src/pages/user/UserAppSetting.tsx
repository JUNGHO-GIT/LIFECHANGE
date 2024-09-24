// UserAppSetting.tsx

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
    navigate, isAdmin, TITLE, localLocale
  } = useCommonValue();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [lang, setLang] = useState<string>(localLocale);

  // 7. userAppSetting ----------------------------------------------------------------------------
  const userAppSettingNode = () => {
    // 7-1. card
    const detailSection = () => {
      const detailFragment = (i: number) => (
        <Card className={"border-1 radius shadow-none p-0"} key={i}>
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
      <Paper className={"content-wrapper d-center border-1 radius h-min90vh"}>
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
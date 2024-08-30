// UserAppSetting.jsx
// Node -> Section -> Fragment

import { useState } from "../../imports/ImportReacts.jsx";
import { useCommon } from "../../imports/ImportHooks.jsx";
import { Loading } from "../../imports/ImportLayouts.jsx";
import { Icons } from "../../imports/ImportComponents.jsx";
import { Card, Paper, Grid } from "../../imports/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const UserAppSetting = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { navigate, translate } = useCommon();

  // 2-1. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState(false);
  const [admin, setIsAdmin] = useState(sessionStorage.getItem("ADMIN"));

  // 7. userAppSetting ----------------------------------------------------------------------------
  const userAppSettingNode = () => {
    // 7-1. card
    const cardSection = () => {
      const cardFragment = (i) => (
        <Card className={"border radius p-0"} key={i}>
          <Grid container spacing={2} className={"fs-0-8rem"}>
            <Grid
              size={12}
              className={"d-between pointer mt-5 p-10"}
              onClick={() => {
                navigate("/user/detail")
              }}
              borderBottom={
                "1px solid #ddd"
              }
            >
              <Grid size={6} className={"d-left ms-2vw"}>
                {translate("dataDetail")}
              </Grid>
              <Grid size={5} className={"d-right me-2vw"}>
                <Icons
                  name={"TbChevronRight"}
                  className={"w-16 h-16 black"}
                  onClick={() => {}}
                />
              </Grid>
            </Grid>
            <Grid
              size={12}
              className={"d-between pointer p-10"}
              onClick={() => {
                navigate("/user/category")
              }}
              borderBottom={
                "1px solid #ddd"
              }
            >
              <Grid size={6} className={"d-left ms-2vw"}>
                {translate("category")}
              </Grid>
              <Grid size={5} className={"d-right me-2vw"}>
                <Icons
                  name={"TbChevronRight"}
                  className={"w-16 h-16 black"}
                  onClick={() => {}}
                />
              </Grid>
            </Grid>
            <Grid
              size={12}
              className={`${admin !== "true" ? "d-none" : ""} d-between pointer p-10`}
              onClick={() => {
                navigate("/user/dummy")
              }}
              borderBottom={
                "1px solid #ddd"
              }
            >
              <Grid size={6} className={"d-left ms-2vw"}>
                {translate("dataList")}
              </Grid>
              <Grid size={5} className={"d-right me-2vw"}>
                <Icons
                  name={"TbChevronRight"}
                  className={"w-16 h-16 black"}
                  onClick={() => {}}
                />
              </Grid>
            </Grid>
            <Grid
              size={12}
              className={"d-between pointer p-10"}
              onClick={() => {
                navigate("/user/app/info")
              }}
              borderBottom={
                "1px solid #ddd"
              }
            >
              <Grid size={6} className={"d-left ms-2vw"}>
                {translate("appInfo")}
              </Grid>
              <Grid size={5} className={"d-right me-2vw"}>
                <Icons
                  name={"TbChevronRight"}
                  className={"w-16 h-16 black"}
                  onClick={() => {}}
                />
              </Grid>
            </Grid>
            <Grid
              size={12}
              className={"d-between pointer p-10"}
              onClick={() => {
                localStorage.setItem("autoLogin", "false")
                localStorage.setItem("autoLoginId", "")
                localStorage.setItem("autoLoginPw", "")
                sessionStorage.clear()
                navigate("/")
              }}
              borderBottom={
                "1px solid #ddd"
              }
            >
              <Grid size={6} className={"d-left ms-2vw"}>
                {translate("logout")}
              </Grid>
              <Grid size={5} className={"d-right me-2vw"}>
                <Icons
                  name={"TbChevronRight"}
                  className={"w-16 h-16 black"}
                  onClick={() => {}}
                />
              </Grid>
            </Grid>
            <Grid
              size={12}
              className={"d-between pointer mb-5 p-10"}
              onClick={() => {
                navigate("/user/deletes")
              }}
            >
              <Grid size={6} className={"d-left ms-2vw red"}>
                {translate("userDeletes")}
              </Grid>
              <Grid size={5} className={"d-right me-2vw"}>
                <Icons
                  name={"TbChevronRight"}
                  className={"w-16 h-16 black"}
                  onClick={() => {}}
                />
              </Grid>
            </Grid>
          </Grid>
        </Card>
      );
      return (
        LOADING ? <Loading /> : cardFragment(0)
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper d-center radius border h-min80vh"}>
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
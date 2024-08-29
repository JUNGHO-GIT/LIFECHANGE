// UserAppSetting.jsx
// Node -> Section -> Fragment

import { useState } from "../../imports/ImportReacts.jsx";
import { useCommon } from "../../imports/ImportHooks.jsx";
import { Loading } from "../../imports/ImportLayouts.jsx";
import { Icons, Hr, Br } from "../../imports/ImportComponents.jsx";
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
        <Card className={"d-column border radius p-0"} key={i}>
          <Grid container columnSpacing={2} className={"fs-0-8rem"}>
            <Br px={10} />
            <Grid
              size={12}
              className={"d-between pointer p-5"}
              onClick={() => {
                navigate("/user/detail")
              }}
            >
              <Grid size={6} className={"d-left ms-20"}>
                {translate("dataDetail")}
              </Grid>
              <Grid size={5} className={"d-right"}>
                <Icons
                  name={"TbChevronRight"}
                  className={"w-16 h-16 black"}
                  onClick={() => {}}
                />
              </Grid>
            </Grid>
            <Hr px={20} />
            <Grid
              size={12}
              className={"d-between pointer p-5"}
              onClick={() => {
                navigate("/user/category")
              }}
            >
              <Grid size={6} className={"d-left ms-20"}>
                {translate("category")}
              </Grid>
              <Grid size={5} className={"d-right"}>
                <Icons
                  name={"TbChevronRight"}
                  className={"w-16 h-16 black"}
                  onClick={() => {}}
                />
              </Grid>
            </Grid>
            <Hr px={20} />
            <Grid
              size={12}
              className={`${admin !== "true" ? "d-none" : ""} d-between pointer p-5`}
              onClick={() => {
                navigate("/user/dummy")
              }}
            >
              <Grid size={6} className={"d-left ms-20"}>
                {translate("dataList")}
              </Grid>
              <Grid size={5} className={"d-right"}>
                <Icons
                  name={"TbChevronRight"}
                  className={"w-16 h-16 black"}
                  onClick={() => {}}
                />
              </Grid>
            </Grid>
            <Hr px={20} />
            <Grid
              size={12}
              className={"d-between pointer p-5"}
              onClick={() => {
                navigate("/user/app/info")
              }}
            >
              <Grid size={6} className={"d-left ms-20"}>
                {translate("appInfo")}
              </Grid>
              <Grid size={5} className={"d-right"}>
                <Icons
                  name={"TbChevronRight"}
                  className={"w-16 h-16 black"}
                  onClick={() => {}}
                />
              </Grid>
            </Grid>
            <Hr px={20} />
            <Grid
              size={12}
              className={"d-between pointer p-5"}
              onClick={() => {
                localStorage.setItem("autoLogin", "false")
                localStorage.setItem("autoLoginId", "")
                localStorage.setItem("autoLoginPw", "")
                sessionStorage.clear()
                navigate("/")
              }}
            >
              <Grid size={6} className={"d-left ms-20"}>
                {translate("logout")}
              </Grid>
              <Grid size={5} className={"d-right"}>
                <Icons
                  name={"TbChevronRight"}
                  className={"w-16 h-16 black"}
                  onClick={() => {}}
                />
              </Grid>
            </Grid>
            <Hr px={20} />
            <Grid
              size={12}
              className={"d-between pointer p-5"}
              onClick={() => {
                navigate("/user/deletes")
              }}
            >
              <Grid size={6} className={"d-left red ms-20"}>
                {translate("userDeletes")}
              </Grid>
              <Grid size={5} className={"d-right"}>
                <Icons
                  name={"TbChevronRight"}
                  className={"w-16 h-16 black"}
                  onClick={() => {}}
                />
              </Grid>
            </Grid>
            <Br px={10} />
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
        <Grid container columnSpacing={1}>
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
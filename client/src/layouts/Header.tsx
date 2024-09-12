// Header.tsx
// Node -> Section -> Fragment

import { useCommonValue, useCommonDate } from "@imports/ImportHooks";
import { Div, Img, Icons } from "@imports/ImportComponents";
import { Paper, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const Header = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    navigate, firstStr,
  } = useCommonValue();
  const {
    dayFmt,
  } = useCommonDate();

  // 7. header -------------------------------------------------------------------------------------
  const headerNode = () => {
    const iconSection = () => (
      <Div
        className={"d-center pointer"}
        onClick={() => {
          navigate("/today/list", {
            state: {
              dateType: "day",
              dateStart: dayFmt,
              dateEnd: dayFmt,
            }
          });
        }}
      >
        <Img
          key={"logo2"}
          src={"logo2"}
          className={"h-max30 me-2vw"}
        />
        <Img
          key={"logo3"}
          src={"logo3"}
          className={"h-max30"}
        />
      </Div>
    );
    const btnSection = () => (
      <Div className={"d-center"}>
        {firstStr !== "user" ? (
          <Icons
            key={"TbSettings"}
            name={"Settings"}
            className={"w-24 h-24"}
            onClick={() => {
              navigate("/user/app/setting");
            }}
          />
        ) : (
          <Icons
            key={"TbArrowRight"}
            name={"ArrowRight"}
            className={"w-24 h-24"}
            onClick={() => {
              navigate(-1);
            }}
          />
        )}
      </Div>
    );
    return (
      <Paper className={"layout-wrapper p-sticky top-0vh h-8vh radius border"}>
        <Grid container spacing={2}>
          <Grid size={10} className={"d-left"}>
            {iconSection()}
          </Grid>
          <Grid size={2} className={"d-right"}>
            {btnSection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {headerNode()}
    </>
  );
};
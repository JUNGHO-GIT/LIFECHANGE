// Header.tsx

import { useCommonValue, useCommonDate } from "@imports/ImportHooks";
import { Div, Img, Icons } from "@imports/ImportComponents";
import { Paper, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const Header = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { navigate, firstStr } = useCommonValue();
  const { getDayFmt } = useCommonDate();

  // 7. header -------------------------------------------------------------------------------------
  const headerNode = () => {
    const iconSection = () => (
      <Div
        className={"d-center pointer ms-5"}
        onClick={() => {
          navigate("/today/list", {
            state: {
              dateType: "day",
              dateStart: getDayFmt(),
              dateEnd: getDayFmt(),
            }
          });
        }}
      >
        <Img
          hover={true}
          shadow={false}
          radius={false}
          src={"logo2"}
          className={"h-max30 me-2vw"}
        />
        <Img
          hover={true}
          shadow={false}
          radius={false}
          src={"logo3"}
          className={"h-max30"}
        />
      </Div>
    );
    const btnSection = () => (
      firstStr !== "user" ? (
        <Icons
          key={"Settings"}
          name={"Settings"}
          className={"w-24 h-24"}
          onClick={() => {
            navigate("/user/app/setting");
          }}
        />
      ) : (
        <Icons
          key={"ArrowRight"}
          name={"ArrowRight"}
          className={"w-24 h-24"}
          onClick={() => {
            navigate(-1);
          }}
        />
      )
    );
    return (
      <Paper className={"layout-wrapper p-sticky top-0vh h-8vh border-1 radius-1 shadow-top-1"}>
        <Grid container spacing={2} columns={12}>
          <Grid size={10} className={"d-row-left"}>
            {iconSection()}
          </Grid>
          <Grid size={2} className={"d-row-right"}>
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
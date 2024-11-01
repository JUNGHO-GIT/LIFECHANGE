// Header.tsx

import { useCommonValue, useCommonDate } from "@importHooks";
import { Div, Img, Icons } from "@importComponents";
import { Paper, Card } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const Header = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { navigate, firstStr } = useCommonValue();
  const { getDayFmt } = useCommonDate();

  // 7. header -------------------------------------------------------------------------------------
  const headerNode = () => {
    const headerSection = () => {
      const iconFragment = () => (
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
            loading={"eager"}
            className={"h-max30 me-2vw"}
          />
          <Img
            hover={true}
            shadow={false}
            radius={false}
            src={"logo3"}
            loading={"eager"}
            className={"h-max30"}
          />
        </Div>
      );
      const btnFragment = () => (
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
        <Card className={"d-row-between"}>
          {iconFragment()}
          {btnFragment()}
        </Card>
      );
    };
    return (
      <Paper className={"layout-wrapper p-sticky top-0vh h-8vh border-1 radius-1 shadow-top-1"}>
        {headerSection()}
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
// Header.tsx

import { useCommonValue, useCommonDate } from "@importHooks";
import { Div, Img, Icons, Paper, Card } from "@importComponents";

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
          className={"d-center pointer ml-5px"}
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
            src={"logo2.webp"}
            loading={"eager"}
            className={"h-max-30px mr-2vw"}
          />
          <Img
            hover={true}
            shadow={false}
            radius={false}
            src={"logo3.webp"}
            loading={"eager"}
            className={"h-max-30px"}
          />
        </Div>
      );
      const btnFragment = () => (
        firstStr !== "user" ? (
          <Icons
            key={"Settings"}
            name={"Settings"}
            className={"w-30px h-30px"}
            onClick={() => {
              navigate("/user/appSetting");
            }}
          />
        ) : (
          <Icons
            key={"ArrowRight"}
            name={"ArrowRight"}
            className={"w-30px h-30px"}
            onClick={() => {
              navigate(-1);
            }}
          />
        )
      );
      return (
        <Card className={"d-row-between border-0 shadow-0 radius-0"}>
          {iconFragment()}
          {btnFragment()}
        </Card>
      );
    };
    return (
      <Paper className={"layout-wrapper p-sticky top-0vh h-8vh border-1 radius-2 shadow-top-1"}>
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
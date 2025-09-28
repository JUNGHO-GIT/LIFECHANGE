// Header.tsx

import { Div, Icons, Img, Paper } from "@importComponents";
import { useCommonDate, useCommonValue } from "@importHooks";
import { memo } from "@importReacts";

// -------------------------------------------------------------------------------------------------
export const Header = memo(() => {

	// 1. common ----------------------------------------------------------------------------------
  const { navigate, firstStr } = useCommonValue();
  const { getDayFmt } = useCommonDate();

  // 7. header -------------------------------------------------------------------------------------
  const headerNode = () => {
		const iconSection = () => (
			<Div
				className={"d-center pointer ml-5px"}
				onClick={() => {
					navigate("/schedule/record/list", {
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
		const btnSection = () => (
			firstStr !== "user" ? (
				<Icons
					key={"Settings"}
					name={"Settings"}
					className={"w-25px h-25px"}
					onClick={() => {
						navigate("/user/appSetting");
					}}
				/>
			) : (
				<Icons
					key={"ArrowRight"}
					name={"ArrowRight"}
					className={"w-25px h-25px"}
					onClick={() => {
						navigate(-1);
					}}
				/>
			)
		);
    return (
      <Paper className={"layout-wrapper d-row-between p-sticky top-0vh h-8vh radius-2 border-1 shadow-1"}>
				{iconSection()}
				{btnSection()}
      </Paper>
    );
  };

	// 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {headerNode()}
    </>
  );
});
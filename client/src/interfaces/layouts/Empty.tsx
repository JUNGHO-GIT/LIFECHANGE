// Empty.tsx

import { useCommonValue, useCommonDate } from "@importHooks";
import { useStoreLanguage } from "@importStores";
import { Div, Icons, Grid } from "@importComponents";
import { Accordion, AccordionSummary } from "@importMuis";

// -------------------------------------------------------------------------------------------------
declare type EmptyProps = {
  DATE: any;
  extra: string;
}

// -------------------------------------------------------------------------------------------------
export const Empty = (
  { DATE, extra }: EmptyProps
) => {

	// 1. common ----------------------------------------------------------------------------------
  const { PATH, navigate } = useCommonValue();
	const { getDayStartFmt, getDayEndFmt } = useCommonDate();
	const { getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useStoreLanguage();
  const isFindList = PATH.includes("food/find/list");
  const isGoalList = !isFindList && PATH.includes("goal/list");
  const toDetail = isGoalList ? `/${extra}/goal/detail` : `/${extra}/detail`;

  // 7. emptyNode ----------------------------------------------------------------------------------
  const emptyNode = () => {
    // 1. isFindSection
    const isFindSection = () => (
			<Grid container={true} spacing={0} className={"border-1 radius-2 shadow-1 mb-10px"}>
				<Grid size={12} className={"p-2px"}>
					<Accordion
						className={"border-0 shadow-0 radius-0"}
						expanded={false}
					>
						<AccordionSummary>
							<Grid container={true} spacing={1}>
								<Grid size={4} className={"d-row-left"}>
									<Div className={"fs-0-8rem fw-600 dark"}>
										{translate("search")}
									</Div>
								</Grid>
								<Grid size={8} className={"d-row-left"}>
									<Div className={"fs-0-8rem fw-500"}>
										{translate("notFound")}
									</Div>
								</Grid>
							</Grid>
						</AccordionSummary>
					</Accordion>
				</Grid>
			</Grid>
    );
    // 2. isGoalSection
    const isGoalSection = () => (
			<Grid container={true} spacing={0} className={"border-1 radius-2 shadow-1 mb-10px"}>
				<Grid size={12} className={"p-2px"}>
					<Accordion
						className={"border-0 shadow-0 radius-0"}
						expanded={false}
					>
						<AccordionSummary
							onClick={() => {
								navigate(toDetail, {
									state: {
										from: PATH.includes("today") ? "today" : "list",
										dateType: DATE?.dateType || "month",
										dateStart: DATE?.dateStart || getMonthStartFmt(),
										dateEnd: DATE?.dateEnd || getMonthEndFmt()
									}
								});
							}}
						>
							<Grid container={true} spacing={1}>
								<Grid size={2} className={"d-row-center"}>
									<Icons
										key={"Search"}
										name={"Search"}
										className={"w-16px h-16px"}
									/>
								</Grid>
								<Grid size={4} className={"d-row-left"}>
									<Div className={"fs-0-8rem fw-600 dark"}>
										{translate(`${extra}`)}
									</Div>
								</Grid>
								<Grid size={6} className={"d-row-left"}>
									<Div className={"fs-0-8rem fw-500"}>
										{translate("empty")}
									</Div>
								</Grid>
							</Grid>
						</AccordionSummary>
					</Accordion>
				</Grid>
      </Grid>
    );
    // 2. isRealSection
    const isRealSection = () => (
			<Grid container={true} spacing={0} className={"border-1 radius-2 shadow-1 mb-10px"}>
				<Grid size={12} className={"p-2px"}>
					<Accordion
						className={"border-0 shadow-0 radius-0"}
						expanded={false}
					>
						<AccordionSummary
							onClick={() => {
								navigate(toDetail, {
									state: {
										from: PATH.includes("today") ? "today" : "list",
										dateType: DATE?.dateType || "day",
										dateStart: DATE?.dateStart || getDayStartFmt(),
										dateEnd: DATE?.dateEnd || getDayEndFmt(),
									}
								});
							}}
						>
							<Grid container={true} spacing={1}>
								<Grid size={2} className={"d-row-center"}>
									<Icons
										key={"Search"}
										name={"Search"}
										className={"w-16px h-16px"}
									/>
								</Grid>
								<Grid size={4} className={"d-row-left"}>
									<Div className={"fs-0-8rem fw-600 dark"}>
										{translate(`${extra}`)}
									</Div>
								</Grid>
								<Grid size={6} className={"d-row-left"}>
									<Div className={"fs-0-8rem fw-500"}>
										{translate("empty")}
									</Div>
								</Grid>
							</Grid>
						</AccordionSummary>
					</Accordion>
				</Grid>
			</Grid>
    );
    // 3. return
    return (
      isFindList ? (
        isFindSection()
      )
      : isGoalList ? (
        isGoalSection()
      )
      : (
        isRealSection()
      )
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {emptyNode()}
    </>
  );
};
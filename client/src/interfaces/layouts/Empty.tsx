// Empty.tsx

import { Div, Grid, Icons } from "@importComponents";
import { useCommonDate, useCommonValue } from "@importHooks";
import { Accordion, AccordionSummary } from "@importMuis";
import { memo } from "@importReacts";
import { useStoreLanguage } from "@importStores";

// -------------------------------------------------------------------------------------------------
declare type EmptyProps = {
  DATE: any;
  extra: string;
}

// -------------------------------------------------------------------------------------------------
export const Empty = memo((
  { DATE, extra }: EmptyProps
) => {

	// 1. common ----------------------------------------------------------------------------------
  const { PATH, navigate } = useCommonValue();
	const { isGoalList, isFindList, toDetail } = useCommonValue();
	const { getDayStartFmt, getDayEndFmt, getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useStoreLanguage();

  // 7. emptyNode ----------------------------------------------------------------------------------
  const emptyNode = () => {
    // 1. isFindSection
    const isFindSection = () => (
			<Grid container={true} spacing={0} className={"radius-2 border-1 shadow-0 mb-10px"}>
				<Grid size={12} className={"p-2px"}>
					<Accordion
						className={"border-0 shadow-0 radius-2"}
						expanded={false}
					>
						<AccordionSummary>
							<Grid container={true} spacing={1}>
								<Grid size={4} className={"d-row-left"}>
									<Div className={"fs-0-9rem fw-600 dark"}>
										{translate("search")}
									</Div>
								</Grid>
								<Grid size={8} className={"d-row-left"}>
									<Div className={"fs-0-9rem fw-500"}>
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
			<Grid container={true} spacing={0} className={"radius-2 border-1 shadow-0 mb-10px"}>
				<Grid size={12} className={"p-2px"}>
					<Accordion
						className={"border-0 shadow-0 radius-2"}
						expanded={false}
					>
						<AccordionSummary
							onClick={() => {
								navigate(toDetail, {
									state: {
										from: PATH.includes("schedule") ? "schedule" : "list",
										dateType: DATE?.dateType || "month",
										dateStart: DATE?.dateStart || getMonthStartFmt(),
										dateEnd: DATE?.dateEnd || getMonthEndFmt()
									}
								});
							}}
						>
							<Grid container={true} spacing={1}>
								<Grid size={2} className={"d-row-left"}>
									<Icons
										key={"Search"}
										name={"Search"}
										className={"w-16px h-16px"}
									/>
								</Grid>
								<Grid size={4} className={"d-row-left"}>
									<Div className={"fs-0-9rem fw-600 dark"}>
										{translate(`${extra}`)}
									</Div>
								</Grid>
								<Grid size={6} className={"d-row-center"}>
									<Div className={"fs-0-9rem fw-500"}>
										{translate("empty")}
									</Div>
								</Grid>
							</Grid>
						</AccordionSummary>
					</Accordion>
				</Grid>
      </Grid>
    );
    // 2. isRecordSection
    const isRecordSection = () => (
			<Grid container={true} spacing={0} className={"radius-2 border-1 shadow-0 mb-10px"}>
				<Grid size={12} className={"p-2px"}>
					<Accordion
						className={"border-0 shadow-0 radius-2"}
						expanded={false}
					>
						<AccordionSummary
							onClick={() => {
								navigate(toDetail, {
									state: {
										from: PATH.includes("schedule") ? "schedule" : "list",
										dateType: DATE?.dateType || "day",
										dateStart: DATE?.dateStart || getDayStartFmt(),
										dateEnd: DATE?.dateEnd || getDayEndFmt(),
									}
								});
							}}
						>
							<Grid container={true} spacing={1}>
								<Grid size={2} className={"d-row-left"}>
									<Icons
										key={"Search"}
										name={"Search"}
										className={"w-16px h-16px"}
									/>
								</Grid>
								<Grid size={4} className={"d-row-left"}>
									<Div className={"fs-0-9rem fw-600 dark"}>
										{translate(`${extra}`)}
									</Div>
								</Grid>
								<Grid size={6} className={"d-row-center"}>
									<Div className={"fs-0-9rem fw-500"}>
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
        isRecordSection()
      )
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {emptyNode()}
    </>
  );
});
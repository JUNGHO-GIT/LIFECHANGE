// Count.tsx

import { useCommonValue } from "@importHooks";
import { useStoreLanguage, useStoreAlert } from "@importStores";
import { Input } from "@importContainers";
import { Img, Div, Icons, Grid } from "@importComponents";

// -------------------------------------------------------------------------------------------------
declare type CountProps = {
  COUNT: {
		totalCnt: number;
		sectionCnt: number;
		newSectionCnt: number;
	};
  setCOUNT: React.Dispatch<React.SetStateAction<{
		totalCnt: number;
		sectionCnt: number;
		newSectionCnt: number;
	}>>;
  LOCKED: string;
  setLOCKED: React.Dispatch<React.SetStateAction<
	  string
  >>;
  limit: number;
	disabled?: boolean;
}

// -------------------------------------------------------------------------------------------------
export const Count = (
  { COUNT, setCOUNT, LOCKED, setLOCKED, limit, disabled }: CountProps
) => {

  // 1. common -------------------------------------------------------------------------------------
  const { PATH, localLang } = useCommonValue();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();

  // 7. countNode ----------------------------------------------------------------------------------
  const countNode = () => {
    // 7-1. lock
    const lockSection = () => (
      <Input
        label={translate("itemLock")}
        value={translate(LOCKED) || ""}
        inputclass={`fs-0-8rem pointer`}
        adornmentclass={"ml-n10px"}
				disabled={disabled}
        onClick={() => {
					if (disabled) {
						return;
					}
          if (LOCKED === "locked") {
            setLOCKED("unlocked");
          }
          else {
            setLOCKED("locked");
          }
        }}
        startadornment={
          LOCKED === "locked" ? (
            <Icons
              key={"Lock"}
              name={"Lock"}
              className={"w-20px h-20px"}
            />
          ) : (
            <Icons
              key={"UnLock"}
              name={"UnLock"}
              className={"w-20px h-20px"}
            />
          )
        }
      />
    );
    // 7-2. count
    const countSection = () => (
      <Input
        label={translate("item")}
        value={COUNT.newSectionCnt}
        error={COUNT.newSectionCnt <= 0}
        locked={LOCKED}
        inputclass={`pointer`}
				disabled={disabled}
				sx={{
					"& .MuiOutlinedInput-notchedOutline": {
						borderColor: COUNT.newSectionCnt <= 0 ? "#f44336" : "rgba(0, 0, 0, 0.23)"
					}
				}}
        startadornment={
          <Img
            max={25}
            hover={true}
            shadow={false}
            radius={false}
            src={"common2.webp"}
          />
        }
        endadornment={
					!disabled || LOCKED === "unlocked" ? (
						<Div className={"d-row-center"}>
							<Div className={"mr-n5px"}>
								<Icons
									key={"Minus"}
									name={"Minus"}
									className={"w-20px h-20px"}
									locked={LOCKED}
									onClick={() => {
										if (disabled) {
											return;
										}
										if (LOCKED === "locked" || PATH.includes("/food/find/list")) {
											return;
										}
										else {
											COUNT.newSectionCnt > COUNT.sectionCnt ? (
												setCOUNT((prev) => ({
													...prev,
													newSectionCnt: prev.newSectionCnt - 1
												}))
											) : (
												setALERT({
													open: true,
													severity: "error",
													msg: (
														localLang === "ko"
														? `${COUNT.sectionCnt}개 이상 ${limit}개 이하로 입력해주세요.`
														: `Please enter ${COUNT.sectionCnt} or more and ${limit} or less.`
													),
												})
											)
										}
									}}
								/>
							</Div>
							<Div className={"mr-n10px"}>
								<Icons
									key={"Plus"}
									name={"Plus"}
									className={"w-20px h-20px"}
									locked={LOCKED}
									onClick={() => {
										if (disabled) {
											return;
										}
										if (LOCKED === "locked" || PATH.includes("/food/find/list")) {
											return;
										}
										else {
											COUNT.newSectionCnt < limit ? (
												setCOUNT((prev) => ({
													...prev,
													newSectionCnt: prev.newSectionCnt + 1
												}))
											) : (
												setALERT({
													open: true,
													severity: "error",
													msg: (
														localLang === "ko"
														? `${COUNT.sectionCnt}개 이상 ${limit}개 이하로 입력해주세요.`
														: `Please enter ${COUNT.sectionCnt} or more and ${limit} or less.`
													),
												})
											)
										}
									}}
								/>
							</Div>
						</Div>
					)
					: null
        }
      />
    );
    // 7-3. return
    return (
      <Grid container={true} spacing={1}>
        <Grid size={{ xs: 4, sm: 3 }} className={"d-center"}>
          {lockSection()}
        </Grid>
        <Grid size={{ xs: 8, sm: 9 }} className={"d-center"}>
          {countSection()}
        </Grid>
      </Grid>
    );
  };

  // 15. return ------------------------------------------------------------------------------------
  return (
    <>
      {countNode()}
    </>
  );
};
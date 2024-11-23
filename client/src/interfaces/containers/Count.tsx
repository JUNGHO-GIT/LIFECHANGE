// Count.tsx

import { useCommonValue } from "@importHooks";
import { useStoreLanguage, useStoreAlert } from "@importHooks";
import { Input } from "@importContainers";
import { Img, Div, Icons } from "@importComponents";
import { Grid } from "@importMuis";

// -------------------------------------------------------------------------------------------------
declare type CountProps = {
  COUNT: any;
  setCOUNT: any;
  LOCKED: string;
  setLOCKED: any
  limit: number;
}

// -------------------------------------------------------------------------------------------------
export const Count = (
  { COUNT, setCOUNT, LOCKED, setLOCKED, limit }: CountProps
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
        inputclass={"fs-0-8rem pointer"}
        adornmentclass={"ms-n10"}
        onClick={() => {
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
              className={"w-20 h-20"}
            />
          ) : (
            <Icons
              key={"UnLock"}
              name={"UnLock"}
              className={"w-20 h-20"}
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
        inputclass={"pointer"}
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
          <Div className={"d-row-center"}>
            <Div className={"me-n5"}>
              <Icons
                key={"Minus"}
                name={"Minus"}
                className={"w-20 h-20"}
                locked={LOCKED}
                onClick={() => {
                  if (LOCKED === "locked" || PATH.includes("/food/find/list")) {
                    return;
                  }
                  else {
                    COUNT.newSectionCnt > COUNT.sectionCnt ? (
                      setCOUNT((prev: any) => ({
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
            <Div className={"me-n10"}>
              <Icons
                key={"Plus"}
                name={"Plus"}
                className={"w-20 h-20"}
                locked={LOCKED}
                onClick={() => {
                  if (LOCKED === "locked" || PATH.includes("/food/find/list")) {
                    return;
                  }
                  else {
                    COUNT.newSectionCnt < limit ? (
                      setCOUNT((prev: any) => ({
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
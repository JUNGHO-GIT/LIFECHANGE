// Count.tsx

import { useCommonValue } from "@imports/ImportHooks";
import { useLanguageStore, useAlertStore } from "@imports/ImportStores";
import { Input } from "@imports/ImportContainers";
import { Img, Div, Icons } from "@imports/ImportComponents";
import { Grid } from "@imports/ImportMuis";

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
  const { PATH, localLocale } = useCommonValue();
  const { translate } = useLanguageStore();
  const { ALERT, setALERT } = useAlertStore();

  // 7. countNode ----------------------------------------------------------------------------------
  const countNode = () => {
    const lockSection = () => (
      <Input
        label={translate("itemLock")}
        readOnly={true}
        value={translate(LOCKED) || ""}
        className={"w-100p pointer"}
        inputclass={"fs-0-8rem pointer"}
        adornmentclass={"ms-n10 p-0"}
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
    const countSection = () => (
      <Input
        label={translate("item")}
        value={COUNT.newSectionCnt}
        readOnly={true}
        error={COUNT.newSectionCnt <= 0}
        locked={LOCKED}
        startadornment={
          <Img
            key={"common2"}
            src={"common2"}
            className={"w-16 h-16"}
          />
        }
        endadornment={
          <Div className={"d-row-center"}>
            <Div className={"me-n5"}>
              <Icons
                key={"Minus"}
                name={"Minus"}
                className={"w-16 h-16"}
                locked={LOCKED}
                onClick={() => {
                  if (LOCKED === "locked") {
                    return;
                  }
                  if (PATH.includes("/food/find/list")) {
                    return;
                  }
                  COUNT.newSectionCnt > COUNT.sectionCnt ? (
                    setCOUNT((prev: any) => ({
                      ...prev,
                      newSectionCnt: prev.newSectionCnt - 1
                    }))
                  ) : (
                    setALERT({
                      open: !ALERT.open,
                      severity: "error",
                      msg: (
                        localLocale === "ko"
                        ? `${COUNT.sectionCnt}개 이상 ${limit}개 이하로 입력해주세요.`
                        : `Please enter ${COUNT.sectionCnt} or more and ${limit} or less.`
                      ),
                    })
                  )
                }}
              />
            </Div>
            <Div className={"me-n10"}>
              <Icons
                key={"Plus"}
                name={"Plus"}
                className={"w-16 h-16"}
                locked={LOCKED}
                onClick={() => {
                  if (LOCKED === "locked") {
                    return;
                  }
                  if (PATH.includes("/food/find/list")) {
                    return;
                  }
                  COUNT.newSectionCnt < limit ? (
                    setCOUNT((prev: any) => ({
                      ...prev,
                      newSectionCnt: prev.newSectionCnt + 1
                    }))
                  ) : (
                    setALERT({
                      open: !ALERT.open,
                      severity: "error",
                      msg: (
                        localLocale === "ko"
                        ? `${COUNT.sectionCnt}개 이상 ${limit}개 이하로 입력해주세요.`
                        : `Please enter ${COUNT.sectionCnt} or more and ${limit} or less.`
                      ),
                    })
                  )
                }}
              />
            </Div>
          </Div>
        }
      />
    );

    return (
      <Grid container spacing={2} columns={12}>
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
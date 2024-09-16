// Count.tsx

import { useCommonValue, useTranslate } from "@imports/ImportHooks";
import { Img, Div, Icons, Input } from "@imports/ImportComponents";
import { PopUp } from "@imports/ImportContainers";
import { Card, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
declare interface CountProps {
  COUNT: any;
  setCOUNT: any;
  LOCKED: string;
  setLOCKED: any;
  limit: number;
}

// -------------------------------------------------------------------------------------------------
export const Count = (
  { COUNT, setCOUNT, LOCKED, setLOCKED, limit }: CountProps
) => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate,
  } = useTranslate();
  const {
    PATH
  } = useCommonValue();

  // 7. countNode ----------------------------------------------------------------------------------
  const countNode = () => {
    const lockSection = () => (
      <Input
        label={translate("itemLock")}
        readOnly={true}
        value={translate(LOCKED) || ""}
        className={"w-100p d-center"}
        inputclass={"fs-0-8rem"}
        adornmentclass={"ms-n10 p-0"}
        onClick={() => {
          LOCKED !== "locked" ? (
            setLOCKED("locked")
          ) : (
            setLOCKED("unlocked")
          )
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
      <PopUp
        type={"alert"}
        position={"bottom"}
        direction={"center"}
        contents={({closePopup}: any) => (
          <Card className={"d-center"}>
            {`${COUNT.sectionCnt}개 이상 ${limit}개 이하로 입력해주세요.`}
          </Card>
        )}
      >
        {(popTrigger: any) => (
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
              <Div className={"d-center me-n10"}>
                <Icons
                  name={"Minus"}
                  className={"w-20 h-20 black"}
                  onClick={(e: any) => {
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
                      popTrigger.openPopup(e.currentTarget.closest('.MuiInputBase-root'))
                    )
                  }}
                />
                <Icons
                  name={"Plus"}
                  className={"w-20 h-20 black"}
                  onClick={(e: any) => {
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
                      popTrigger.openPopup(e.currentTarget.closest('.MuiInputBase-root'))
                    )
                  }}
                />
              </Div>
            }
          />
        )}
      </PopUp>
    );

    return (
      <Grid container spacing={2}>
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
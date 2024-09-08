// Memo.tsx

import { useState } from "@imports/ImportReacts";
import { useCommonValue, useTranslate } from "@imports/ImportHooks";
import { Img, Input, Btn } from "@imports/ImportComponents";
import { PopUp } from "@imports/ImportContainers";
import { TextArea, Grid, Card } from "@imports/ImportMuis";
import { calendar3 } from "@imports/ImportImages";

// -------------------------------------------------------------------------------------------------
declare interface MemoProps {
  OBJECT: any;
  setOBJECT: any;
  extra: string;
  i: number;
}

// -------------------------------------------------------------------------------------------------
export const Memo = (
  { OBJECT, setOBJECT, extra, i } : MemoProps
) => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate,
  } = useTranslate();
  const {
    firstStr,
  } = useCommonValue();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [prevContent, setPrevContent] = useState<string>("");

  // 3. memoNode -----------------------------------------------------------------------------------
  const memoNode = () => (
    <PopUp
      key={i}
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={({closePopup}: any) => (
        <Card className={"w-max70vw p-0"}>
          <Grid container spacing={3}>
            <Grid size={12} className={"d-center"}>
              <TextArea
                className={"w-86vw h-55vh border p-10"}
                value={OBJECT?.[`${firstStr}_section`][i]?.[`${extra}`]}
                onChange={(e: any) => {
                  const newContent = e.target.value;
                  setOBJECT((prev: any) => ({
                    ...prev,
                    [`${firstStr}_section`]: prev[`${firstStr}_section`]?.map((item: any, idx: number) => (
                      idx === i ? {
                        ...item,
                        [`${extra}`]: newContent
                      } : item
                    ))
                  }));
                }}
              />
            </Grid>
            <Grid size={6} className={"d-right"}>
              <Btn
                color={"primary"}
                onClick={() => {
                  closePopup();
                }}
              >
                {translate("confirm")}
              </Btn>
            </Grid>
            <Grid size={6} className={"d-left"}>
              <Btn
                color={"error"}
                onClick={() => {
                  // 이전 상태로 복원
                  setOBJECT((prev: any) => ({
                    ...prev,
                    [`${firstStr}_section`]: prev[`${firstStr}_section`]?.map((item: any, idx: number) => (
                      idx === i ? {
                        ...item,
                        [`${extra}`]: prevContent
                      } : item
                    ))
                  }));
                  closePopup();
                }}
              >
                {translate("close")}
              </Btn>
            </Grid>
          </Grid>
        </Card>
      )}
    >
      {(popTrigger: any) => (
        <Input
          label={translate("memo")}
          className={"pointer"}
          value={OBJECT?.[`${firstStr}_section`][i]?.[`${extra}`]}
          readOnly={true}
          startadornment={
            <Img src={calendar3} className={"w-16 h-16"} />
          }
          onClick={(e: any) => {
            // 팝업 열릴 때 현재 상태를 저장
            setPrevContent(OBJECT?.[`${firstStr}_section`][i]?.[`${extra}`]);
            popTrigger.openPopup(e.currentTarget);
          }}
        />
      )}
    </PopUp>
  );

  // 15. return ------------------------------------------------------------------------------------
  return (
    <>
      {memoNode()}
    </>
  );
};

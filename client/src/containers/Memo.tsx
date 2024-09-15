// Memo.tsx

import { useCommonValue, useTranslate } from "@imports/ImportHooks";
import { Img, Input } from "@imports/ImportComponents";
import { PopUp } from "@imports/ImportContainers";
import { TextArea, Grid, Card } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
declare interface MemoProps {
  OBJECT: any;
  setOBJECT: any;
  LOCKED: string;
  extra: string;
  i: number;
}

// -------------------------------------------------------------------------------------------------
export const Memo = (
  { OBJECT, setOBJECT, LOCKED, extra, i }: MemoProps
) => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate,
  } = useTranslate();
  const {
    firstStr,
  } = useCommonValue();

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
                style={{
                  fontFamily: "inherit",
                  fontSize: "inherit",
                  fontWeight: "inherit"
                }}
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
          locked={LOCKED}
          startadornment={
            <Img
            	key={"calendar3"}
            	src={"calendar3"}
            	className={"w-16 h-16"}
            />
          }
          onClick={(e: any) => {
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

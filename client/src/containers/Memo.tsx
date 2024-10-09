// Memo.tsx

import { useCommonValue } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { PopUp, Input } from "@imports/ImportContainers";
import { Img } from "@imports/ImportComponents";
import { TextArea, Grid, Card } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
declare type MemoProps = {
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
  const { firstStr } = useCommonValue();
  const { translate } = useLanguageStore();

  // 3. memoNode -----------------------------------------------------------------------------------
  const memoNode = () => (
    <PopUp
      key={`memo-${i}`}
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={
        <Card className={"w-max70vw p-0"}>
          <Grid container spacing={3}>
            <Grid size={12} className={"d-center"}>
              <TextArea
                style={{
                  fontFamily: "inherit",
                  fontSize: "inherit",
                  fontWeight: "inherit"
                }}
                className={"w-86vw h-55vh border-1 p-10"}
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
      }
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

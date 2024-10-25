// Memo.tsx

import { useCommonValue } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { PopUp, Input } from "@imports/ImportContainers";
import { Img } from "@imports/ImportComponents";
import { TextArea, Grid } from "@imports/ImportMuis";

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
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={
        <Grid container spacing={3} columns={12} className={"w-max70vw"}>
          <Grid size={12} className={"d-center"}>
            <TextArea
              className={"w-86vw h-55vh border-1 p-10"}
              value={OBJECT?.[`${firstStr}_section`][i]?.[`${extra}`]}
              style={{
                fontFamily: "inherit",
                fontSize: "inherit",
                fontWeight: "inherit"
              }}
              onChange={(e: any) => {
                // 빈값 처리
                let value = e.target.value === "" ? "" : e.target.value;
                setOBJECT((prev: any) => ({
                  ...prev,
                  [`${firstStr}_section`]: prev[`${firstStr}_section`]?.map((section: any, idx: number) => (
                    idx === i ? {
                      ...section,
                      [`${extra}`]: value
                    } : section
                  ))
                }));
              }}
            />
          </Grid>
        </Grid>
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

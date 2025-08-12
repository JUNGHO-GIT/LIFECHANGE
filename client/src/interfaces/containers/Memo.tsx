// Memo.tsx

import { useCommonValue } from "@importHooks";
import { useStoreLanguage } from "@importStores";
import { PopUp, Input } from "@importContainers";
import { Img, Grid } from "@importComponents";
import { TextArea } from "@importMuis";

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
  const { translate } = useStoreLanguage();

  // 3. memoNode -----------------------------------------------------------------------------------
  const memoNode = () => (
    <PopUp
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={
        <Grid container spacing={3} columns={12} className={"w-max-70vw"}>
          <Grid size={12} className={"d-center"}>
            <TextArea
              className={"w-86vw h-55vh border-1 p-10px"}
              value={OBJECT?.[`${firstStr}_section`]?.[i]?.[`${extra}`]}
              style={{
                fontFamily: "inherit",
                fontSize: "inherit",
                fontWeight: "inherit"
              }}
              onChange={(e: any) => {
                // 빈값 처리
                let value = e.target.value || "";
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
      children={(popTrigger: any) => (
        <Input
          label={translate("memo")}
          className={"pointer"}
          value={OBJECT?.[`${firstStr}_section`]?.[i]?.[`${extra}`]}
          readOnly={true}
          locked={LOCKED}
          startadornment={
            <Img
              max={20}
              hover={true}
              shadow={false}
              radius={false}
            	src={"calendar3.webp"}
            />
          }
          onClick={(e: any) => {
            popTrigger.openPopup(e.currentTarget);
          }}
        />
      )}
    />
  );

  // 15. return ------------------------------------------------------------------------------------
  return (
    <>
      {memoNode()}
    </>
  );
};

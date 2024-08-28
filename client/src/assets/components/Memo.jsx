// Memo.jsx

import { React, useState } from "../../import/ImportReacts.jsx";
import { useCommon } from "../../import/ImportHooks.jsx";
import { PopUp, Img, Div, Br20, Input, Btn } from "../../import/ImportComponents.jsx";
import { TextArea, Grid, Card } from "../../import/ImportMuis.jsx";
import { calendar3 } from "../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const Memo = ({
  OBJECT, setOBJECT, extra, i
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const {firstStr, translate} = useCommon();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [prevContent, setPrevContent] = useState("");

  // 3. memoNode -----------------------------------------------------------------------------------
  const memoNode = () => (
    <PopUp
      key={i}
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={({closePopup}) => (
        <Card className={"w-max60vw h-max65vh p-0"}>
          <Grid container columnSpacing={1}>
            <Grid size={12} className={"d-center"}>
              <TextArea
                className={"w-86vw h-55vh border p-10"}
                value={OBJECT?.[`${firstStr}_section`][i]?.[`${extra}`]}
                onChange={(e) => {
                  const newContent = e.target.value;
                  setOBJECT((prev) => ({
                    ...prev,
                    [`${firstStr}_section`]: prev[`${firstStr}_section`]?.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        [`${extra}`]: newContent
                      } : item
                    ))
                  }));
                }}
              />
            </Grid>
            <Br20 />
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
                  setOBJECT((prev) => ({
                    ...prev,
                    [`${firstStr}_section`]: prev[`${firstStr}_section`]?.map((item, idx) => (
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
      )}>
      {(popTrigger={}) => (
        <Input
          label={translate("memo")}
          className={"pointer"}
          value={OBJECT?.[`${firstStr}_section`][i]?.[`${extra}`]}
          readOnly={true}
          startAdornment={
            <Img src={calendar3} className={"w-16 h-16"} />
          }
          onClick={(e) => {
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

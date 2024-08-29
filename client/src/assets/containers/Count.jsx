// Count.jsx

import { useCommon } from "../../imports/ImportHooks.jsx";
import { PopUp } from "../../imports/ImportContainers.jsx";
import { Img, Div, Icons, Input } from "../../imports/ImportComponents.jsx";
import { Card } from "../../imports/ImportMuis.jsx";
import { common2 } from "../../imports/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const Count = ({
  COUNT, setCOUNT, limit
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const {translate, secondStr} = useCommon();
  const isFind = secondStr === "find";

  // 2. countNode ----------------------------------------------------------------------------------
  const countNode = () => (
    <PopUp
      type={"alert"}
      position={"bottom"}
      direction={"center"}
      contents={({closePopup}) => (
        <Card className={"d-center"}>
          {`${COUNT.sectionCnt}개 이상 ${limit}개 이하로 입력해주세요.`}
        </Card>
      )}>
      {(popTrigger={}) => (
        <Input
          label={translate("item")}
          value={COUNT.newSectionCnt}
          readOnly={true}
          startadornment={
            <Img src={common2} className={"w-16 h-16"} />
          }
          endadornment={
            <Div className={"d-center me-n10"}>
              <Icons name={"TbMinus"} className={"w-20 h-20 black"} onClick={(e) => {
                if (isFind) {
                  return
                }
                COUNT.newSectionCnt > COUNT.sectionCnt ? (
                  setCOUNT((prev) => ({
                    ...prev,
                    newSectionCnt: prev.newSectionCnt - 1
                  }))
                ) : (
                  popTrigger.openPopup(e.currentTarget.closest('.MuiInputBase-root'))
                )
              }}/>
              <Icons name={"TbPlus"} className={"w-20 h-20 black"} onClick={(e) => {
                if (isFind) {
                  return
                }
                COUNT.newSectionCnt < limit ? (
                  setCOUNT((prev) => ({
                    ...prev,
                    newSectionCnt: prev.newSectionCnt + 1
                  }))
                ) : (
                  popTrigger.openPopup(e.currentTarget.closest('.MuiInputBase-root'))
                )
              }}/>
            </Div>
          }
        />
      )}
    </PopUp>
  );

  // 15. return ------------------------------------------------------------------------------------
  return (
    <>
      {countNode()}
    </>
  );
};
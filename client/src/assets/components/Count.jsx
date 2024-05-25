// Count.jsx

import {React, useLocation} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {PopUp, Img, Div, Icons} from "../../import/ImportComponents.jsx";
import {TextField} from "../../import/ImportMuis.jsx";
import {common2} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const Count = ({
  COUNT, setCOUNT, limit
}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const location = useLocation();
  const {translate} = useTranslate();
  const PATH = location?.pathname;

  // 2. countNode --------------------------------------------------------------------------------->
  const countNode = () => (
    <Div className={"d-center"}>
      <PopUp
        type={"alert"}
        position={"bottom"}
        direction={"center"}
        contents={({closePopup}) => (
          <Div className={"d-center"}>
            {`${COUNT.sectionCnt}개 이상 ${limit}개 이하로 입력해주세요.`}
          </Div>
        )}>
        {(popTrigger={}) => (
          <TextField
            type={"text"}
            label={translate("common-count")}
            variant={"outlined"}
            size={"small"}
            className={"w-86vw"}
            value={COUNT.newSectionCnt}
            InputProps={{
              readOnly: true,
              startAdornment: (
              <Img src={common2} className={"w-16 h-16"} />
              ),
              endAdornment: (
              <Div className={"d-center me-n10"}>
                <Icons name={"TbMinus"} className={"w-20 h-20 black"} onClick={(e) => {
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
              )
            }}
          />
        )}
      </PopUp>
    </Div>
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <>
      {countNode()}
    </>
  );
};
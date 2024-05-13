// useDayPicker.jsx

import {React, useEffect} from "../../import/ImportReacts.jsx";
import {PopUp, PopDown, Div, Icons} from "../../import/ImportComponents.jsx";

// ------------------------------------------------------------------------------------------------>
export const useDayPicker = (
  DAYPICKER, setDAYPICKER
) => {

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    alert (JSON.stringify(DAYPICKER?.dayOpen));
    if (DAYPICKER?.dayOpen === true) {
      <PopUp elementId={`popup`} contents={
        <>
        <Div className={"d-row align-center"}>
          <Icons name={"MdOutlineDelete"} className={"w-24 h-24 dark pointer"} />
          <p className={"fs-14"}>삭제</p>
        </Div>
        <Div className={"d-row align-center"}>
          <Icons name={"MdOutlineEdit"} className={"w-24 h-24 dark pointer"} />
          <p className={"fs-14"}>수정</p>
        </Div>
        </>
      }>
        {(popTrigger) => (
          <Icons name={"BiDotsHorizontalRounded"} className={"w-24 h-24 dark me-n10"}
            onClick={(e) => {
              popTrigger.openPopup(e.currentTarget)
            }}
          />
        )}
      </PopUp>
    }
  }, [DAYPICKER]);
};
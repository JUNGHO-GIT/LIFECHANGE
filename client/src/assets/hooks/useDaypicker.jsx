// usePicker.jsx

import {React, useEffect} from "../../import/ImportReacts.jsx";
import {PopUp, Div, Icons} from "../../import/ImportComponents.jsx";

// ------------------------------------------------------------------------------------------------>
export const usePicker = (
  DAYPICKER, setDAYPICKER
) => {

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (DAYPICKER?.dayOpen) {
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
        {popProps => (
          <Icons name={"BiDotsHorizontalRounded"} className={"w-24 h-24 dark me-n10"}
            onClick={(e) => {
              popProps.openPopup(e.currentTarget)
            }}
          />
        )}
      </PopUp>
    }
  }, [DAYPICKER.dayOpen]);

};
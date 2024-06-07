// DropDown.jsx

import {React, useLocation} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {PopUp, Div, Icons} from "../../import/ImportComponents.jsx";

// ------------------------------------------------------------------------------------------------>
export const DropDown = ({
  id, sectionId, index, handlerDelete
}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const location = useLocation();
  const {translate} = useTranslate();
  const PATH = location?.pathname;

  // 2. dropDownNode ------------------------------------------------------------------------------>
  const dropDownNode = () => (
    <Div className={"d-center mt-n20 me-n15"}>
      <PopUp
        key={index}
        type={"dropdown"}
        position={"bottom"}
        direction={"center"}
        contents={({closePopup}) => (
        <Div className={"d-center"}>
          <Icons name={"TbTrash"} className={"w-24 h-24 black"} onClick={() => {
            handlerDelete(index);
            closePopup();
          }}/>
          {translate("common-delete")}
        </Div>
        )}>
        {(popTrigger={}) => (
          <Icons name={"TbDots"} className={"w-24 h-24 black"} onClick={(e) => {
            popTrigger.openPopup(e.currentTarget)
          }}/>
        )}
      </PopUp>
    </Div>
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <>
      {dropDownNode()}
    </>
  );
};
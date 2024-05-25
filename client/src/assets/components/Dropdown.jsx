// DropDown.jsx

import {React, useLocation} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {PopUp, Img, Div} from "../../import/ImportComponents.jsx";
import {common3_1, common5} from "../../import/ImportImages.jsx";

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
    <Div className={"d-center"}>
      <PopUp
        key={index}
        type={"dropdown"}
        position={"bottom"}
        direction={"center"}
        contents={({closePopup}) => (
        <Div className={"d-center"}>
          <Img src={common5} className={"w-16 h-16 pointer"} onClick={() => {
            handlerDelete(index);
            closePopup();
          }}/>
          {translate("common-delete")}
        </Div>
        )}>
        {(popTrigger={}) => (
          <Img src={common3_1} className={"w-24 h-24 mt-n10 me-n10 pointer"} onClick={(e) => {
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
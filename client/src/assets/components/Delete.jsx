// Delete.jsx

import {React} from "../../import/ImportReacts.jsx";
import {Div, Icons} from "../../import/ImportComponents.jsx";

// -------------------------------------------------------------------------------------------------
export const Delete = ({
  id, sectionId, index, handlerDelete
}) => {

  // 2. dropDownNode -------------------------------------------------------------------------------
  const dropDownNode = () => (
    <Div className={"d-center mt-n15 me-n15"}>
      <Icons
        name={"TbX"}
        onClick={() => handlerDelete(index)}
        className={"w-20 h-20 black"}
      />
    </Div>
  );

  // 15. return ------------------------------------------------------------------------------------
  return (
    <>
      {dropDownNode()}
    </>
  );
};
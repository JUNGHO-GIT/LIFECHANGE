// Delete.jsx

import { Icons } from "../../imports/ImportComponents.jsx";

// -------------------------------------------------------------------------------------------------
export const Delete = ({
  index, handlerDelete
}) => {

  // 2. deleteNode --------------------------------------------------------------------------------
  const deleteNode = () => (
    <Icons
      name={"TbX"}
      onClick={() => handlerDelete(index)}
      className={"w-20 h-20 mt-n10 me-n20 black"}
    />
  );

  // 15. return ------------------------------------------------------------------------------------
  return (
    <>
      {deleteNode()}
    </>
  );
};
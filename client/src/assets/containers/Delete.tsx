// Delete.tsx

import { Icons } from "@imports/ImportComponents";

// -------------------------------------------------------------------------------------------------
interface DeleteProps {
  index: number;
  handlerDelete: any;
}

// -------------------------------------------------------------------------------------------------
export const Delete = (
  { index, handlerDelete }: DeleteProps
) => {

  // 1. deleteNode --------------------------------------------------------------------------------
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
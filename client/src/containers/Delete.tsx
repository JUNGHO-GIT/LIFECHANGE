// Delete.tsx

import { Icons, Div } from "@imports/ImportComponents";

// -------------------------------------------------------------------------------------------------
declare interface DeleteProps {
  index: number;
  handlerDelete: any;
}

// -------------------------------------------------------------------------------------------------
export const Delete = (
  { index, handlerDelete }: DeleteProps
) => {

  // 1. deleteNode --------------------------------------------------------------------------------
  const deleteNode = () => (
    <Div className={"mt-n10 me-n10"}>
      <Icons
        name={"X"}
        onClick={() => handlerDelete(index)}
        className={"w-20 h-20 black"}
      />
    </Div>
  );

  // 15. return ------------------------------------------------------------------------------------
  return (
    <>
      {deleteNode()}
    </>
  );
};
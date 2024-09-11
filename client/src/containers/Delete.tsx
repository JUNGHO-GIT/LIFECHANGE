// Delete.tsx

import { Icons, Div } from "@imports/ImportComponents";

// -------------------------------------------------------------------------------------------------
declare interface DeleteProps {
  index: number;
  handlerDelete?: any;
  readonly?: boolean;
}

// -------------------------------------------------------------------------------------------------
export const Delete = (
  { index, handlerDelete, readonly }: DeleteProps
) => {

  // 1. deleteNode --------------------------------------------------------------------------------
  const deleteNode = () => (
    <Div className={"mt-n10 me-n10"}>
      <Icons
        name={"X"}
        onClick={() => {
          if (!readonly || readonly === undefined) {
            handlerDelete(index);
          }
        }}
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
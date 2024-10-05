// Delete.tsx

import { Icons, Div } from "@imports/ImportComponents";

// -------------------------------------------------------------------------------------------------
declare type DeleteProps = {
  index: number;
  handlerDelete: any;
  LOCKED: string;
}

// -------------------------------------------------------------------------------------------------
export const Delete = (
  { index, handlerDelete, LOCKED }: DeleteProps
) => {

  // 1. deleteNode --------------------------------------------------------------------------------
  const deleteNode = () => (
    <Div className={"mt-n10 me-n10"}>
      <Icons
        key={"X"}
        name={"X"}
        locked={LOCKED}
        className={"w-20 h-20"}
        onClick={() => {
          handlerDelete(index);
        }}
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
// Delete.tsx

import { Icons, Div } from "@imports/ImportComponents";

// -------------------------------------------------------------------------------------------------
declare type DeleteProps = {
  index: number;
  handleDelete: any;
  LOCKED: string;
}

// -------------------------------------------------------------------------------------------------
export const Delete = (
  { index, handleDelete, LOCKED }: DeleteProps
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
          handleDelete(index);
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
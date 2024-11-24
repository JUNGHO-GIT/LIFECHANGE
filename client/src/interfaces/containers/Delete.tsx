// Delete.tsx

import { Icons, Div } from "@importComponents";

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
    <Div className={"mt-n10px mr-n10px"}>
      <Icons
        key={"X"}
        name={"X"}
        locked={LOCKED}
        className={"w-20px h-20px"}
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
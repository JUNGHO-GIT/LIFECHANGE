// Delete.tsx

import { Icons, Div } from "@importComponents";

// -------------------------------------------------------------------------------------------------
declare type DeleteProps = {
  index: number;
	section?: string;
  handleDelete: (index: number, section?: string) => void;
	LOCKED?: string;
	readOnly?: boolean;
}

// -------------------------------------------------------------------------------------------------
export const Delete = (
  { index, section, handleDelete, LOCKED, readOnly }: DeleteProps
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
					if (readOnly) {
						return;
					}
          handleDelete(index, section);
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
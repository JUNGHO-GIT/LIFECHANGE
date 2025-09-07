// Delete.tsx

import { Icons, Div } from "@importComponents";

// -------------------------------------------------------------------------------------------------
declare type DeleteProps = {
  index: number;
	section?: string;
  handleDelete: (index: number, section?: string) => void;
	LOCKED?: string;
	disabled?: boolean;
}

// -------------------------------------------------------------------------------------------------
export const Delete = (
  { index, section, handleDelete, LOCKED, disabled }: DeleteProps
) => {

  // 1. deleteNode --------------------------------------------------------------------------------
  const deleteNode = () => (
    <Div className={"mt-n10px mr-n10px"}>
      <Icons
        key={"X"}
        name={"X"}
        locked={LOCKED}
        className={"w-20px h-20px"}
				sx={{
					color: "var(--color-text-2)",
					"&:hover": {
						color: "var(--color-text-1)",
					},
				}}
        onClick={() => {
					if (disabled) {
						return;
					}
          handleDelete(index, section);
        }}
      />
    </Div>
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {deleteNode()}
    </>
  );
};
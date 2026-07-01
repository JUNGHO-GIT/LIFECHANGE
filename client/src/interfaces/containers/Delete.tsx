/**
 * @file Delete.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { Div, Icons } from "@exportComponents";
import { memo, useCallback, useMemo } from "@exportReacts";

// -------------------------------------------------------------------------------------------------
declare interface DeleteProps {
  index: number;
  section?: string;
  handleDelete: (_index: number, _section?: string) => void;
  LOCKED?: string;
  disabled?: boolean;
}

// -------------------------------------------------------------------------------------------------
export const Delete = memo((
  {
    index, section, handleDelete, LOCKED, disabled,
  }: DeleteProps,
) => {

  // 1. callbacks ----------------------------------------------------------------------------------
  const handleClick = useCallback(() => {
    if (disabled) {
      return;
    }
    handleDelete(index, section);
  }, [ disabled, handleDelete, index, section ]);

  // 2. deleteNode --------------------------------------------------------------------------------
  const deleteNode = useMemo(() => (
    <Div className={`mt-n10px mr-n10px`}>
      <Icons
        key={`X`}
        name={`X`}
        locked={LOCKED}
        className={`w-20px h-20px`}
        sx={{
          color: `var(--color-text-2)`,
          "&:hover": {
            color: `var(--color-text-1)`,
          },
        }}
        onClick={handleClick}
      />
    </Div>
  ), [ LOCKED, handleClick ]);

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {deleteNode}
    </>
  );
});

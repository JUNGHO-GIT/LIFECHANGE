/**
 * @file Memo.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { Icons, Grid, Img } from "@exportComponents";
import { Input, PopUp } from "@exportContainers";
import { useCommonValue } from "@exportHooks";
import { TextArea } from "@exportMuis";
import { memo, useCallback, useMemo } from "@exportReacts";
import { useStoreLanguage } from "@exportStores";

// -------------------------------------------------------------------------------------------------
declare interface MemoProps {
  OBJECT: any;
  setOBJECT: any;
  LOCKED: string;
  extra: string;
  i: number;
  section?: string;
}

// -------------------------------------------------------------------------------------------------
export const Memo = memo((
  {
    OBJECT, setOBJECT, LOCKED, extra, i, section,
  }: MemoProps,
) => {

  // 1. common ----------------------------------------------------------------------------------
  const { firstStr } = useCommonValue();
  const { translate } = useStoreLanguage();
  const targetSection: string = section ?? `${firstStr}_section`;

  // 2. callbacks ----------------------------------------------------------------------------------
  const handleTextChange = useCallback((e: any) => {
    setOBJECT((prev: any) => ({
      ...prev,
      [targetSection]: prev[targetSection]?.map((section: any, idx: number) => (
        idx === i ? {
          ...section,
          [extra]: e.target.value ?? ``,
        } : section
      )),
    }));
  }, [ setOBJECT, targetSection, i, extra ]);

  // 3. memoized values ---------------------------------------------------------------------------
  const memoValue = useMemo(() => (
    OBJECT?.[targetSection]?.[i]?.[extra] ?? ``
  ), [ OBJECT, targetSection, i, extra ]);

  // 4. memoNode -----------------------------------------------------------------------------------
  const memoNode = useMemo(() => (
    <PopUp
      type={`innerCenter`}
      position={`center`}
      direction={`center`}
      contents={(
        <Grid container={true} spacing={3} columns={12} className={`w-max-70vw`}>
          <Grid size={12} className={`d-center`}>
            <TextArea
              className={`w-86vw h-55vh border-light-1 p-10px`}
              value={memoValue}
              style={{
                fontFamily: `inherit`,
                fontSize: `inherit`,
                fontWeight: `inherit`,
              }}
              onChange={handleTextChange}
            />
          </Grid>
        </Grid>
      )}
      children={(popTrigger: any) => (
        <Input
          label={translate(`memo`)}
          className={`pointer`}
          value={memoValue}
          readOnly={true}
          locked={LOCKED}
          startadornment={(
            <Icons
              key={`calendar3`}
              name={`calendar3`}
              isIconButton={false}
              className={`w-18px h-18px hover`}
            />
          )}
          onClick={(e: any) => {
            popTrigger.openPopup(e.currentTarget);
          }}
        />
      )}
    />
  ), [ memoValue, handleTextChange, translate, LOCKED ]);

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {memoNode}
    </>
  );
});

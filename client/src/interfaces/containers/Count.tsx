/**
 * @file Count.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { React, memo, useCallback, useMemo } from "@exportReacts";
import { Div, Grid, Icons, Img } from "@exportComponents";
import { Input } from "@exportContainers";
import { useCommonValue } from "@exportHooks";
import { useStoreAlert, useStoreLanguage } from "@exportStores";

// -------------------------------------------------------------------------------------------------
declare interface CountProps {
  COUNT: {
    totalCnt: number;
    sectionCnt: number;
    newSectionCnt: number;
  };
  setCOUNT: React.Dispatch<React.SetStateAction<{
    totalCnt: number;
    sectionCnt: number;
    newSectionCnt: number;
  }>>;
  LOCKED: string;
  setLOCKED: React.Dispatch<React.SetStateAction<string>>;
  limit: number;
  disabled?: boolean;
  allowZero?: boolean;
  onCountChange?: (_newSectionCnt: number) => void;
}

// ---------------------------------------------------------------------------------------------
export const Count = memo((
  {
    COUNT, setCOUNT, LOCKED, setLOCKED, limit, disabled, allowZero, onCountChange,
  }: CountProps,
) => {

  // 1. common ----------------------------------------------------------------------------------
  const { PATH, localLang, isCalendarDetail } = useCommonValue();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();

  // 4. handle ----------------------------------------------------------------------------------
  // ?? 는 disabled === false 를 토글 불가로 만들어 동작을 놓치므로 명시 부정으로 바꿈
  const handleLockToggle = useCallback(() => {
    if (disabled) {
      return;
    }
    setLOCKED(LOCKED === `locked` ? `unlocked` : `locked`);
  }, [ disabled, LOCKED, setLOCKED ]);

  // 4. handle ----------------------------------------------------------------------------------
  const handleMinus = useCallback(() => {
    !disabled && LOCKED !== `locked` && !PATH.includes(`/food/find/list`) &&
      setCOUNT((prev) => {
        const minSectionCnt: number = allowZero ? 0 : prev.sectionCnt;

        return prev.newSectionCnt > minSectionCnt ? (
          onCountChange?.(prev.newSectionCnt - 1),
          { ...prev, newSectionCnt: prev.newSectionCnt - 1 }
        ) : (
          setALERT({
            open: true,
            severity: `error`,
            msg: localLang === `ko`
              ? `${minSectionCnt}개 이상 ${limit}개 이하로 입력해주세요.`
              : `Please enter ${minSectionCnt} or more and ${limit} or less.`,
          }),
          prev
        );
      });
  }, [
    disabled, LOCKED, PATH, setCOUNT, onCountChange, setALERT, localLang, limit, allowZero,
  ]);

  // 4. handle ----------------------------------------------------------------------------------
  const handlePlus = useCallback(() => {
    !disabled && LOCKED !== `locked` && !PATH.includes(`/food/find/list`) &&
    setCOUNT((prev) => (prev.newSectionCnt < limit ? (
      onCountChange?.(prev.newSectionCnt + 1),
      { ...prev, newSectionCnt: prev.newSectionCnt + 1 }
    ) : (
      setALERT({
        open: true,
        severity: `error`,
        msg: localLang === `ko`
          ? `${prev.sectionCnt}개 이상 ${limit}개 이하로 입력해주세요.`
          : `Please enter ${prev.sectionCnt} or more and ${limit} or less.`,
      }),
      prev
    )),
    );
  }, [
    disabled, LOCKED, PATH, setCOUNT, onCountChange, setALERT, localLang, limit,
  ]);

  // 3. useMEMO ----------------------------------------------------------------------------------
  const lockIcon = useMemo(() => (
    LOCKED === `locked` ? (
      <Icons
        key={`Lock`}
        name={`Lock`}
        isIconButton={false}
        className={`w-20px h-20px`}
      />
    ) : (
      <Icons
        key={`UnLock`}
        name={`UnLock`}
        isIconButton={false}
        className={`w-20px h-20px`}
      />
    )
  ), [LOCKED]);

  // 3. useMEMO ----------------------------------------------------------------------------------
  const countEndAdornment = useMemo(() => (
    !disabled || LOCKED === `unlocked` ? (
      <Div className={`d-row-center`}>
        <Icons
          key={`Minus`}
          name={`Minus`}
          isIconButton={true}
          className={`w-20px h-20px`}
          locked={LOCKED}
          onClick={handleMinus}
        />
        <Icons
          key={`Plus`}
          name={`Plus`}
          isIconButton={true}
          className={`w-20px h-20px`}
          locked={LOCKED}
          onClick={handlePlus}
        />
      </Div>
    ) : null
  ), [ disabled, LOCKED, handleMinus, handlePlus ]);

  // 7. countNode ----------------------------------------------------------------------------------
  const countNode = useMemo(() => {
    // 7-1. lock
    const lockSection = () => (
      <Input
        label={translate(`itemLock`)}
        value={translate(LOCKED) ?? ``}
        inputclass={`fs-0-8rem pointer`}
        disabled={disabled}
        onClick={handleLockToggle}
        startadornment={lockIcon}
      />
    );
    // 7-2. count
    const countSection = () => (
      <Input
        label={translate(`item`)}
        value={COUNT.newSectionCnt}
        error={allowZero ? COUNT.newSectionCnt < 0 : COUNT.newSectionCnt <= 0}
        locked={LOCKED}
        inputclass={`pointer`}
        disabled={disabled}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: (allowZero ? COUNT.newSectionCnt < 0 : COUNT.newSectionCnt <= 0)
              ? `#f44336`
              : `rgba(0, 0, 0, 0.23)`,
          },
        }}
        startadornment={(
          <Icons
            key={`common2`}
            name={`common2`}
            isIconButton={false}
            className={`w-25px h-25px hover`}
          />
        )}
        endadornment={!isCalendarDetail ? countEndAdornment : null}
      />
    );
    // 7-3. return
    return (
      <Grid container={true} spacing={1}>
        <Grid size={{ xs: 4, sm: 3 }} className={`d-center`}>
          {lockSection()}
        </Grid>
        <Grid size={{ xs: 8, sm: 9 }} className={`d-center`}>
          {countSection()}
        </Grid>
      </Grid>
    );
  }, [
    translate, LOCKED, disabled, allowZero, handleLockToggle, lockIcon, COUNT.newSectionCnt, countEndAdornment,
  ]);

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {countNode}
    </>
  );
});

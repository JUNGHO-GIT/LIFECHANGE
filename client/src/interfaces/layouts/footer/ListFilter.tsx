/**
 * @file ListFilter.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { memo, useMemo } from "@exportReacts";
import { useStoreLanguage } from "@exportStores";
import { Div } from "@exportComponents";
import { PickerDay, Select } from "@exportContainers";
import { useCommonValue } from "@exportHooks";
import { MenuItem } from "@exportMuis";

// ---------------------------------------------------------------------------------------------
declare interface ListFilterProps {
  state: any;
  setState: any;
}

// ---------------------------------------------------------------------------------------------
export const ListFilter = memo((
  { state, setState }: ListFilterProps,
) => {

  // 1. common ----------------------------------------------------------------------------------
  const { sessionCategory } = useCommonValue();
  const { isExerciseGoalList, isExerciseRecordList } = useCommonValue();
  const { isFoodGoalList, isFoodRecordList } = useCommonValue();
  const { isMoneyGoalList, isMoneyRecordList } = useCommonValue();
  const { isSleepGoalList, isSleepRecordList } = useCommonValue();
  const { translate } = useStoreLanguage();

  // 2. array -----------------------------------------------------------------------------------
  const dataArray = useMemo(() => {
    let result: any[] = [];

    (isExerciseGoalList || isExerciseRecordList) && (
      result = sessionCategory?.exercise ?? []
    );
    (isFoodGoalList || isFoodRecordList) && (
      result = sessionCategory?.food ?? []
    );
    (isMoneyGoalList || isMoneyRecordList) && (
      result = sessionCategory?.money ?? []
    );
    (isSleepGoalList || isSleepRecordList) && (
      result = sessionCategory?.sleep ?? []
    );

    return result;
  }, [
    isExerciseGoalList,
    isExerciseRecordList,
    isFoodGoalList,
    isFoodRecordList,
    isMoneyGoalList,
    isMoneyRecordList,
    isSleepGoalList,
    isSleepRecordList,
    sessionCategory,
  ]);

  // 3. partArray -------------------------------------------------------------------------------
  const partArray = useMemo(() => {
    let partKey: string = ``;

    (isExerciseGoalList || isExerciseRecordList) && (
      partKey = `exercise_record_part`
    );
    (isFoodGoalList || isFoodRecordList) && (
      partKey = `food_record_part`
    );
    (isMoneyGoalList || isMoneyRecordList) && (
      partKey = `money_record_part`
    );

    if (!partKey) {
      return [];
    }

    const parts: any[] = dataArray?.map((item: any) => item[partKey]) || [];
    const uniqueParts: any[] = [...new Set(parts)].filter((p: string) => p !== `all`);

    return [
      `all`,
      ...uniqueParts,
    ];

  }, [
    isExerciseGoalList,
    isExerciseRecordList,
    isFoodGoalList,
    isFoodRecordList,
    isMoneyGoalList,
    isMoneyRecordList,
    dataArray,
  ]);

  // 4. titleArray ------------------------------------------------------------------------------
  const titleArray = useMemo(() => {
    let partKey: string = ``;
    let titleKey: string = ``;

    (isExerciseGoalList || isExerciseRecordList) && (
      partKey = `exercise_record_part`,
      titleKey = `exercise_record_title`
    );
    (isMoneyGoalList || isMoneyRecordList) && (
      partKey = `money_record_part`,
      titleKey = `money_record_title`
    );

    if (!partKey || !titleKey) {
      return [];
    }

    const selectedPart: any = state?.PAGING?.part ?? `all`;
    const targetItem: any = dataArray?.find((item: any) => item[partKey] === selectedPart);
    const titles: any[] = targetItem?.[titleKey] ?? [];
    const uniqueTitles: any[] = [...new Set(titles)].filter((t: string) => t !== `all`);

    return [
      `all`,
      ...uniqueTitles,
    ];

  }, [
    isExerciseGoalList,
    isExerciseRecordList,
    isMoneyGoalList,
    isMoneyRecordList,
    dataArray,
    state?.PAGING?.part,
  ]);

  // 7. filter ----------------------------------------------------------------------------------
  const listFilterNode = useMemo(() => {

    // 7-1. sort --------------------------------------------------------------------------------
    const sortSection = (
      <Select
        label={translate(`sort`)}
        value={state?.PAGING?.sort ?? `asc`}
        inputclass={`h-min-0px h-5vh`}
        onChange={(e: any) => {
          setState?.setPAGING((prev: any) => ({
            ...prev,
            sort: e.target.value,
          }));
        }}
      >
        {[ `asc`, `desc` ]?.map((item: string) => (
          <MenuItem
            key={item}
            value={item}
            selected={state?.PAGING?.sort === item}
          >
            <Div className={`fs-0-8rem`}>
              {translate(item)}
            </Div>
          </MenuItem>
        ))}
      </Select>
    );

    // 7-2. date --------------------------------------------------------------------------------
    const dateSection = (
      <PickerDay
        DATE={state?.DATE}
        setDATE={setState?.setDATE}
        EXIST={state?.EXIST}
      />
    );

    // 7-3. part --------------------------------------------------------------------------------
    const partSection = (
      <Select
        label={translate(`part`)}
        value={state?.PAGING?.part ?? `all`}
        inputclass={`h-min-0px h-5vh`}
        onChange={(e: any) => {
          setState?.setPAGING((prev: any) => ({
            ...prev,
            part: e.target.value,
            title: `all`,
          }));
        }}
      >
        {partArray?.map((item: string) => (
          <MenuItem
            key={item}
            value={item}
            selected={state?.PAGING?.part === item}
          >
            <Div className={`fs-0-8rem`}>
              {translate(item)}
            </Div>
          </MenuItem>
        ))}
      </Select>
    );

    // 7-4. title -------------------------------------------------------------------------------
    const titleSection = (
      <Select
        label={translate(`title`)}
        value={state?.PAGING?.title ?? `all`}
        inputclass={`h-min-0px h-5vh`}
        onChange={(e: any) => {
          setState?.setPAGING((prev: any) => ({
            ...prev,
            title: e.target.value,
          }));
        }}
      >
        {titleArray?.map((item: string) => (
          <MenuItem
            key={item}
            value={item}
            selected={state?.PAGING?.title === item}
          >
            <Div className={`fs-0-8rem`}>
              {translate(item)}
            </Div>
          </MenuItem>
        ))}
      </Select>
    );

    // 7-9. return ------------------------------------------------------------------------------
    return (
      <Div className={`d-row w-100p h-100p over-x-auto`} style={{ alignItems: `baseline` }}>
        <Div className={`d-center my-1vh mx-5px`} style={{ flexShrink: 0 }}>
          {sortSection}
        </Div>
        <Div className={`d-center my-1vh mx-5px w-max-60vw`} style={{ flexShrink: 0 }}>
          {dateSection}
        </Div>
        {(isExerciseGoalList || isExerciseRecordList) ? (
<>
  <Div className={`d-center my-1vh mx-5px`} style={{ flexShrink: 0 }}>
    {partSection}
  </Div>
  <Div className={`d-center my-1vh mx-5px`} style={{ flexShrink: 0 }}>
    {titleSection}
  </Div>
</>
) : null}
        {(isFoodGoalList || isFoodRecordList) ? (
<Div className={`d-center my-1vh mx-5px`} style={{ flexShrink: 0 }}>
  {partSection}
</Div>
) : null}
        {(isMoneyGoalList || isMoneyRecordList) ? (
<>
  <Div className={`d-center my-1vh mx-5px`} style={{ flexShrink: 0 }}>
    {partSection}
  </Div>
  <Div className={`d-center my-1vh mx-5px`} style={{ flexShrink: 0 }}>
    {titleSection}
  </Div>
</>
) : null}
      </Div>
    );
  }, [
    translate,
    state,
    setState,
    partArray,
    titleArray,
    isExerciseGoalList,
    isExerciseRecordList,
    isFoodGoalList,
    isFoodRecordList,
    isMoneyGoalList,
    isMoneyRecordList,
  ]);

  // 10. return ---------------------------------------------------------------------------------
  return (
    <>
      {listFilterNode}
    </>
  );
});

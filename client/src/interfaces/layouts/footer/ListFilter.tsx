// ListFilter.tsx

import { Div, Grid } from "@importComponents";
import { PickerDay, Select } from "@importContainers";
import { useCommonValue } from "@importHooks";
import { MenuItem } from "@importMuis";
import { memo, useMemo } from "@importReacts";
import { useStoreLanguage } from "@importStores";

// -------------------------------------------------------------------------------------------------
declare type ListFilterProps = {
  state: any;
  setState: any;
}

// -------------------------------------------------------------------------------------------------
export const ListFilter = memo((
  { state, setState }: ListFilterProps
) => {

	// 1. common ----------------------------------------------------------------------------------
  const { PATH } = useCommonValue();
  const { translate } = useStoreLanguage();

  // 7. filter -------------------------------------------------------------------------------------
  const sortSection = useMemo(() => (
    <Select
      label={translate("sort")}
      value={state?.PAGING?.sort || "asc"}
      inputclass={"h-min-0px h-5vh"}
      onChange={(e: any) => {
        setState?.setPAGING((prev: any) => ({
          ...prev,
          sort: e.target.value
        }));
      }}
    >
      {["asc", "desc"]?.map((item: string) => (
        <MenuItem
          key={item}
          value={item}
          selected={state?.PAGING?.sort === item}
        >
          <Div className={"fs-0-8rem"}>
            {translate(item)}
          </Div>
        </MenuItem>
      ))}
    </Select>
  ), [translate, state?.PAGING?.sort, setState?.setPAGING]);

  const pickerSection = useMemo(() => (
    <PickerDay
      DATE={state?.DATE}
      setDATE={setState?.setDATE}
      EXIST={state?.EXIST}
    />
  ), [state?.DATE, setState?.setDATE, state?.EXIST]);

  const listFilterNode = useMemo(() => (
    PATH.includes("/today") ? (
      <Grid container={true} spacing={1}>
        <Grid size={12}>
          {pickerSection}
        </Grid>
      </Grid>
    )
    : (
      <Grid container={true} spacing={1}>
        <Grid size={3}>
          {sortSection}
        </Grid>
        <Grid size={9}>
          {pickerSection}
        </Grid>
      </Grid>
    )
  ), [PATH, sortSection, pickerSection]);

	// 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {listFilterNode}
    </>
  );
});

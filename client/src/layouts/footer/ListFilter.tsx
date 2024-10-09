// ListFilter.tsx

import { useCommonValue } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { PickerDay, Select } from "@imports/ImportContainers";
import { Div } from "@imports/ImportComponents";
import { MenuItem, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
declare type ListFilterProps = {
  state: any;
  setState: any;
}

// -------------------------------------------------------------------------------------------------
export const ListFilter = (
  { state, setState }: ListFilterProps
) => {

  // 1. common -------------------------------------------------------------------------------------
  const { PATH } = useCommonValue();
  const { translate } = useLanguageStore();

  // 7. filter -------------------------------------------------------------------------------------
  const listFilterNode = () => {
    // 1. sort
    const sortSection = () => (
      <Select
        label={translate("sort")}
        value={state?.PAGING?.sort || "asc"}
        inputclass={"h-min0 h-4vh"}
        onChange={(e: any) => {
          setState?.setPAGING((prev: any) => ({
            ...prev,
            sort: e.target.value
          }))
        }}
      >
        {["asc", "desc"]?.map((item: string) => (
          <MenuItem
            key={item}
            value={item}
            selected={state?.PAGING?.sort === item}
          >
            <Div className={"fs-0-6rem"}>
              {translate(item)}
            </Div>
          </MenuItem>
        ))}
      </Select>
    );
    // 2. picker
    const pickerSection = () => (
      <PickerDay
        DATE={state?.DATE}
        setDATE={setState?.setDATE}
        EXIST={state?.EXIST}
      />
    );

    // 10. return
    return (
      PATH.includes("/today") ? (
        <Grid container spacing={1} columns={12}>
          <Grid size={12}>
            {pickerSection()}
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={1} columns={12}>
          <Grid size={3}>
            {sortSection()}
          </Grid>
          <Grid size={9}>
            {pickerSection()}
          </Grid>
        </Grid>
      )
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {listFilterNode()}
    </>
  );
};
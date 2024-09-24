// ListFilter.tsx

import { useTranslate, useCommonValue } from "@imports/ImportHooks";
import { Select, Div } from "@imports/ImportComponents";
import { Picker } from "@imports/ImportContainers";
import { MenuItem, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
declare interface ListFilterProps {
  state: any;
  setState: any;
  flow: any;
}

// -------------------------------------------------------------------------------------------------
export const ListFilter = (
  { state, setState, flow }: ListFilterProps
) => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    PATH,
  } = useCommonValue();
  const {
    translate
  } = useTranslate();

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
      <Picker
        DATE={state?.DATE}
        setDATE={setState?.setDATE}
        EXIST={state?.EXIST}
        setEXIST={setState?.setEXIST}
      />
    );

    // 10. return
    return (
      PATH.includes("/today") ? (
        <Grid container spacing={1}>
          <Grid size={12}>
            {pickerSection()}
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={1}>
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
// ListFilter.jsx
// Node -> Section -> Fragment

import { useCommon } from "../../../imports/ImportHooks.jsx";
import { Select, Div } from "../../../imports/ImportComponents.jsx";
import { Picker } from "../../../imports/ImportContainers.jsx";
import { MenuItem, Card, Grid } from "../../../imports/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const ListFilter = ({
  state, setState, flow,
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const {translate} = useCommon();

  // 7. filter -------------------------------------------------------------------------------------
  const listFilterNode = () => {
    // 1. sort
    const sortSection = () => (
      <Select
        label={translate("sort")}
        value={state?.PAGING?.sort || "asc"}
        inputclass={"h-min0 h-4vh"}
        onChange={(e) => (
          setState?.setPAGING((prev) => ({
            ...prev,
            sort: e.target.value
          }))
        )}
      >
        {["asc", "desc"]?.map((item) => (
          <MenuItem key={item} value={item} selected={state?.PAGING?.sort === item}>
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
    // 3. return
    return (
      <Grid container columnSpacing={1}>
        <Grid size={3}>
          {sortSection()}
        </Grid>
        <Grid size={9}>
          {pickerSection()}
        </Grid>
      </Grid>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {listFilterNode()}
    </>
  );
};
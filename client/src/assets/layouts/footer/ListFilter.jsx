// ListFilter.jsx
// Node -> Section -> Fragment

import { React } from "../../../import/ImportReacts.jsx";
import { useCommon } from "../../../import/ImportHooks.jsx";
import { Picker, Div } from "../../../import/ImportComponents.jsx";
import { TextField, MenuItem, Card, Grid } from "../../../import/ImportMuis.jsx";

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
      <TextField
        select={true}
        type={"text"}
        size={"small"}
        label={translate("sort")}
        variant={"outlined"}
        value={state?.PAGING?.sort || "asc"}
        className={"w-23vw me-3vw"}
        InputProps={{
          className: "h-min0 h-4vh"
        }}
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
      </TextField>
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
      <>
        {sortSection()}
        {pickerSection()}
      </>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {listFilterNode()}
    </>
  );
};
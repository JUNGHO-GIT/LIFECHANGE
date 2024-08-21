// ListFilter.jsx

import { React } from "../../../import/ImportReacts.jsx";
import { useCommon } from "../../../import/ImportHooks.jsx";
import { Picker, Div } from "../../../import/ImportComponents.jsx";
import { TextField, MenuItem, Card } from "../../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const ListFilter = ({
  strings, objects, functions, handlers
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const {translate} = useCommon();

  // 2. sort ---------------------------------------------------------------------------------------
  const sortNode = () => (
    <TextField
      select={true}
      type={"text"}
      size={"small"}
      label={translate("sort")}
      variant={"outlined"}
      value={objects?.PAGING?.sort || "asc"}
      className={"w-23vw me-3vw"}
      InputProps={{
        className: "h-min0 h-4vh"
      }}
      onChange={(e) => (
        functions?.setPAGING((prev) => ({
          ...prev,
          sort: e.target.value
        }))
      )}
    >
      {["asc", "desc"]?.map((item) => (
        <MenuItem key={item} value={item} selected={objects?.PAGING?.sort === item}>
          <Div className={"fs-0-6rem"}>
            {translate(item)}
          </Div>
        </MenuItem>
      ))}
    </TextField>
  );

  // 3. picker -------------------------------------------------------------------------------------
  const pickerNode = () => (
    <Picker
      DATE={objects?.DATE}
      setDATE={functions?.setDATE}
      EXIST={objects?.EXIST}
      setEXIST={functions?.setEXIST}
    />
  );

  // 7. filter -------------------------------------------------------------------------------------
  const filterNode = () => (
    <Card className={"block-wrapper d-row h-8vh shadow-none"}>
      {sortNode()}
      {pickerNode()}
    </Card>
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {filterNode()}
    </>
  );
};
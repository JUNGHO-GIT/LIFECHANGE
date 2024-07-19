// ListFilter.jsx

import {React} from "../../../import/ImportReacts.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {moment} from "../../../import/ImportLibs.jsx";
import {Picker, Div, Br10, PopUp} from "../../../import/ImportComponents.jsx";
import {TextField, MenuItem, Card, Button} from "../../../import/ImportMuis.jsx";


// -------------------------------------------------------------------------------------------------
export const ListFilter = ({
  strings, objects, functions, handlers
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const {translate} = useTranslate();

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
        functions?.setPAGING((prev={}) => ({
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

  // 4. today --------------------------------------------------------------------------------------
  const todayNode = () => (
    <Button
      size={"small"}
      color={"primary"}
      variant={"contained"}
      className={"ms-3vw"}
      style={{
        lineHeight: "1.4",
        padding: "3px 9px",
        textTransform: "none",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontSize: "0.7rem"
      }}
      onClick={() => {
        functions?.setDATE((prev) => ({
          ...prev,
          dateType: "",
          dateStart: moment.tz("Asia/Seoul").format("YYYY-MM-DD"),
          dateEnd: moment.tz("Asia/Seoul").format("YYYY-MM-DD"),
        }));
      }}
    >
      {translate("today")}
    </Button>
  );

  // 7. filter -------------------------------------------------------------------------------------
  const filterNode = () => (
    <Card className={"block-wrapper d-row h-8vh shadow-none"}>
      {sortNode()}
      {pickerNode()}
      {todayNode()}
    </Card>
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {filterNode()}
    </>
  );
};
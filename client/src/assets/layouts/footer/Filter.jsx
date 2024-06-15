// Filter.jsx

import {React, useLocation} from "../../../import/ImportReacts.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {Picker, PopUp, Div, Img} from "../../../import/ImportComponents.jsx";
import {TextField, MenuItem, Card} from "../../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const Filter = ({
  strings, objects, functions, handlers
}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const {translate} = useTranslate();

  // 1. default ----------------------------------------------------------------------------------->
  const defaultNode = () => (
    <Div className={"d-center"}>
      <TextField
        select={true}
        type={"text"}
        size={"small"}
        label={translate("sort")}
        variant={"outlined"}
        value={objects?.PAGING?.sort || "asc"}
        className={"w-20vw me-3"}
        InputProps={{
          className: "h-min0 h-4vh"
        }}
        onChange={(e) => (
          functions?.setPAGING((prev={}) => ({
            ...prev,
            sort: e.target.value
          }))
        )}>
        {["asc", "desc"].map((item) => (
          <MenuItem key={item} value={item} selected={objects?.PAGING?.sort === item}>
            <Div className={"fs-0-6rem"}>
              {translate(item)}
            </Div>
          </MenuItem>
        ))}
      </TextField>
      <Picker
        DATE={objects?.DATE}
        setDATE={functions?.setDATE}
        EXIST={objects?.EXIST}
        setEXIST={functions?.setEXIST}
      />
    </Div>
  );

  // 7. filter ------------------------------------------------------------------------------------>
  const filterNode = () => {

    // 1. calendar
    if (strings?.first === "calendar") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return null
      }
      else if (strings?.second === "goal" && strings?.third === "list") {
        return null
      }
      else if (strings?.second === "goal" && strings?.third === "save") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return null
      }
    }

    // 2. exercise
    else if (strings?.first === "exercise") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return (
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {defaultNode()}
          </Card>
        );
      }
      else if (strings?.second === "goal" && strings?.third === "list") {
        return (
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {defaultNode()}
          </Card>
        );
      }
      else if (strings?.second === "goal" && strings?.third === "save") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {defaultNode()}
          </Card>
        );
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return null
      }
    }

    // 3. food
    else if (strings?.first === "food") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return (
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {defaultNode()}
            {/* {foodNode()} */}
          </Card>
        );
      }
      else if (strings?.second === "find" && strings?.third === "list") {
        return null
      }
      else if (strings?.second === "find" && strings?.third === "save") {
        return null
      }
      else if (strings?.second === "goal" && strings?.third === "list") {
        return (
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {defaultNode()}
          </Card>
        );
      }
      else if (strings?.second === "goal" && strings?.third === "save") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {defaultNode()}
          </Card>
        );
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return null
      }
    }

    // 4. money
    else if (strings?.first === "money") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return (
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {defaultNode()}
          </Card>
        );
      }
      else if (strings?.second === "goal" && strings?.third === "list") {
        return (
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {defaultNode()}
          </Card>
        );
      }
      else if (strings?.second === "goal" && strings?.third === "save") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {defaultNode()}
          </Card>
        );
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return null
      }
    }

    // 5. sleep
    else if (strings?.first === "sleep") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return (
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {defaultNode()}
          </Card>
        );
      }
      else if (strings?.second === "goal" && strings?.third === "list") {
        return (
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {defaultNode()}
          </Card>
        );
      }
      else if (strings?.second === "goal" && strings?.third === "save") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {defaultNode()}
          </Card>
        );
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return null
      }
    }

    // 6. user
    else if (strings?.first === "user") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return (
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {defaultNode()}
          </Card>
        );
      }
      else if (strings?.second === "data" && strings?.third === "list") {
        return null
      }
      else if (strings?.second === "data" && strings?.third === "category") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {defaultNode()}
          </Card>
        );
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "login") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "signup") {
        return null
      }
    }
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
    {filterNode()}
    </>
  );
};
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
  const session = sessionStorage.getItem("dataCustom") || "{}";
  const exerciseArray = JSON.parse(session).exercise || [];
  const foodArray = JSON.parse(session).food || [];
  const moneyArray = JSON.parse(session).money || [];
  const location = useLocation();
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";

  // 1. default ----------------------------------------------------------------------------------->
  const defaultNode = () => (
    <Div className={"d-center"}>
      <TextField
        select={true}
        type={"text"}
        size={"small"}
        label={"정렬"}
        variant={"outlined"}
        value={objects?.FILTER?.order || "asc"}
        className={"w-20vw me-3"}
        InputProps={{
          className: "h-min0 h-4vh fs-0-7rem"
        }}
        onChange={(e) => (
          functions?.setFILTER((prev={}) => ({
            ...prev,
            order: e.target.value
          }))
        )}>
        {["asc", "desc"].map((item) => (
          <MenuItem key={item} value={item} selected={objects?.FILTER?.order === item}>
            {item}
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

  // 2. exercise ---------------------------------------------------------------------------------->
  const exerciseNode = () => (
    <Div className={"d-center"}>
      <TextField
        select={true}
        type={"text"}
        size={"small"}
        className={"ms-2 me-2"}
        variant={"outlined"}
        value={objects?.FILTER?.part}
        InputProps={{
          className: "h-min0 h-4vh fs-0-7rem"
        }}
        onChange={(e) => {
          const newPartVal = e.target.value;
          const newPartIndex = exerciseArray.findIndex((item) => (
            item.exercise_part === newPartVal
          ));
          const newTitleIndex = 0;
          const newTitleVal = exerciseArray[newPartIndex]?.exercise_title[0];
          functions?.setFILTER(prev => ({
            ...prev,
            partIdx: newPartIndex,
            part: newPartVal,
            titleIdx: newTitleIndex,
            title: newTitleVal
          }));
        }}>
        {exerciseArray?.map((item, idx) => (
          <MenuItem key={idx} value={item.exercise_part}>
            {item.exercise_part}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select={true}
        type={"text"}
        size={"small"}
        className={"ms-2 me-2"}
        variant={"outlined"}
        value={objects?.FILTER?.title}
        InputProps={{
          className: "h-min0 h-4vh fs-0-7rem"
        }}
        onChange={(e) => {
          const newTitleVal = e.target.value;
          const newTitleIndex = exerciseArray[objects?.FILTER?.partIdx]?.exercise_title.findIndex(item => item === newTitleVal);
          functions?.setFILTER(prev => ({
            ...prev,
            titleIdx: newTitleIndex,
            title: newTitleVal
          }));
        }}>
        {exerciseArray[objects?.FILTER?.partIdx]?.exercise_title?.map((item, idx) => (
          <MenuItem key={idx} value={item}>
            {item}
          </MenuItem>
        ))}
      </TextField>
    </Div>
  );

  // 3. food -------------------------------------------------------------------------------------->
  const foodNode = () => (
    <Div className={"d-center"}>
      <TextField
        select={true}
        type={"text"}
        size={"small"}
        className={"ms-2 me-2"}
        variant={"outlined"}
        value={objects?.FILTER?.part}
        InputProps={{
          className: "h-min0 h-4vh fs-0-7rem"
        }}
        onChange={(e) => {
          const newPartVal = e.target.value;
          const newPartIndex = foodArray.findIndex((item) => (
            item.food_part === newPartVal
          ));
          functions?.setFILTER(prev => ({
            ...prev,
            partIdx: newPartIndex,
            part: newPartVal
          }));
        }}>
        {foodArray?.map((item, idx) => (
          <MenuItem key={idx} value={item.food_part}>
            {item.food_part}
          </MenuItem>
        ))}
      </TextField>
    </Div>
  );

  // 4. money ------------------------------------------------------------------------------------->
  const moneyNode = () => (
    <Div className={"d-center"}>
      <TextField
        select={true}
        type={"text"}
        size={"small"}
        className={"ms-2 me-2"}
        variant={"outlined"}
        value={objects?.FILTER?.part}
        InputProps={{
          className: "h-min0 h-4vh fs-0-7rem"
        }}
        onChange={(e) => {
          const newPartVal = e.target.value;
          const newPartIndex = moneyArray.findIndex((item) => (
            item.money_part === newPartVal
          ));
          const newTitleIndex = 0;
          const newTitleVal = moneyArray[newPartIndex]?.money_title[0];
          functions?.setFILTER(prev => ({
            ...prev,
            partIdx: newPartIndex,
            part: newPartVal,
            titleIdx: newTitleIndex,
            title: newTitleVal
          }));
        }}>
        {moneyArray?.map((item, idx) => (
          <MenuItem key={idx} value={item.money_part}>
            {item.money_part}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select={true}
        type={"text"}
        size={"small"}
        className={"ms-2 me-2"}
        variant={"outlined"}
        value={objects?.FILTER?.title}
        InputProps={{
          className: "h-min0 h-4vh fs-0-7rem"
        }}
        onChange={(e) => {
          const newTitleVal = e.target.value;
          const newTitleIndex = moneyArray[objects?.FILTER?.partIdx]?.money_title.findIndex(item => item === newTitleVal);
          functions?.setFILTER(prev => ({
            ...prev,
            titleIdx: newTitleIndex,
            title: newTitleVal
          }));
        }}>
        {moneyArray[objects?.FILTER?.partIdx]?.money_title?.map((item, idx) => (
          <MenuItem key={idx} value={item}>
            {item}
          </MenuItem>
        ))}
      </TextField>
    </Div>
  );

  // 7. filter ------------------------------------------------------------------------------------>
  const filterNode = () => {

    // 1. calendar
    if (strings?.first === "calendar") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return null
      }
      else if (strings?.second === "plan" && strings?.third === "list") {
        return null
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
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
          <Card className={"block-wrapper border-none d-row h-7vh"}>
            {defaultNode()}
          </Card>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "list") {
        return (
          <Card className={"block-wrapper border-none d-row h-7vh"}>
            {defaultNode()}
          </Card>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Card className={"block-wrapper border-none d-row h-7vh"}>
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
          <Card className={"block-wrapper border-none d-row h-7vh"}>
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
      else if (strings?.second === "plan" && strings?.third === "list") {
        return (
          <Card className={"block-wrapper border-none d-row h-7vh"}>
            {defaultNode()}
          </Card>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Card className={"block-wrapper border-none d-row h-7vh"}>
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
          <Card className={"block-wrapper border-none d-row h-7vh"}>
            {defaultNode()}
          </Card>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "list") {
        return (
          <Card className={"block-wrapper border-none d-row h-7vh"}>
            {defaultNode()}
          </Card>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Card className={"block-wrapper border-none d-row h-7vh"}>
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
          <Card className={"block-wrapper border-none d-row h-7vh"}>
            {defaultNode()}
          </Card>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "list") {
        return (
          <Card className={"block-wrapper border-none d-row h-7vh"}>
            {defaultNode()}
          </Card>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Card className={"block-wrapper border-none d-row h-7vh"}>
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
          <Card className={"block-wrapper border-none d-row h-7vh"}>
            {defaultNode()}
          </Card>
        );
      }
      else if (strings?.second === "data" && strings?.third === "list") {
        return null
      }
      else if (strings?.second === "data" && strings?.third === "custom") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Card className={"block-wrapper border-none d-row h-7vh"}>
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
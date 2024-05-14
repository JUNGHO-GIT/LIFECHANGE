// Filter.jsx

import {React} from "../../import/ImportReacts.jsx";
import {Div} from "../../import/ImportComponents.jsx";
import {Paper, MenuItem, TextField} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const Filter = ({
  strings, objects, functions, handlers
}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const session = sessionStorage.getItem("dataset") || "{}";
  const exerciseArray = JSON.parse(session).exercise || [];
  const foodArray = JSON.parse(session).food || [];
  const moneyArray = JSON.parse(session).money || [];
  const sleepArray = JSON.parse(session).sleep || [];

  // 1. default ----------------------------------------------------------------------------------->
  const defaultNode = () => (
    <Div className={"d-center"}>
      <TextField
        select={true}
        type={"text"}
        size={"small"}
        className={"ms-2 me-2"}
        variant={"outlined"}
        value={objects?.FILTER?.type}
        onChange={(e) => (
          functions?.setFILTER((prev) => ({
            ...prev,
            type: e.target.value
          })),
          functions?.setPAGING((prev) => ({
            ...prev,
            page: 1
          }))
        )}>
        {["day", "week", "month", "year", "select"]?.map((item) => (
          <MenuItem key={item} value={item} selected={objects?.FILTER?.type === item}>
            {item}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select={true}
        type={"text"}
        size={"small"}
        className={"ms-2 me-2"}
        variant={"outlined"}
        value={objects?.FILTER?.order}
        onChange={(e) => (
          functions?.setFILTER((prev) => ({
            ...prev,
            order: e.target.value
          }))
        )}>
        {["asc", "desc"]?.map((item) => (
          <MenuItem key={item} value={item} selected={objects?.FILTER?.order === item}>
            {item}
          </MenuItem>
        ))}
      </TextField>
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

  // 6. demo -------------------------------------------------------------------------------------->
  const demoNode = () => (
    <TextField
      select={true}
      type={"text"}
      size={"small"}
      className={"ms-2 me-2"}
      variant={"outlined"}
      value={objects?.PART}
      onChange={(e) => {
        const newPartVal = e.target.value;
        functions?.setPART(newPartVal);
      }}>
      <MenuItem value={"exercisePlan"}>운동(계획)</MenuItem>
      <MenuItem value={"exercise"}>운동</MenuItem>
      <MenuItem value={"foodPlan"}>식사(계획)</MenuItem>
      <MenuItem value={"food"}>식사</MenuItem>
      <MenuItem value={"moneyPlan"}>지출(계획)</MenuItem>
      <MenuItem value={"money"}>지출</MenuItem>
      <MenuItem value={"sleepPlan"}>수면(계획)</MenuItem>
      <MenuItem value={"sleep"}>수면</MenuItem>
    </TextField>
  );

  // 7. filter ------------------------------------------------------------------------------------>
  const filterNode = () => {

    // 1. calendar
    if (strings?.part === "calendar") {
      if (strings?.type === "list" || strings?.type === "diff") {
        return (
          null
        );
      }
      else if (strings?.type === "detail") {
        return (
          null
        );
      }
      else if (strings?.type === "save") {
        return (
          null
        );
      }
    }

    // 2. exercise
    else if (strings?.part === "exercise") {
      if (strings?.type === "list" || strings?.type === "diff") {
        return (
          <Div className={"block-wrapper d-row h-40"}>
            {defaultNode()}
            {exerciseNode()}
          </Div>
        );
      }
      else if (strings?.type === "detail") {
        return (
          null
        );
      }
      else if (strings?.type === "save") {
        return (
          null
        );
      }
    }

    // 3. food
    else if (strings?.part === "food") {
      if (strings?.type === "list" || strings?.type === "diff") {
        return (
          <Div className={"block-wrapper d-row h-40"}>
            {defaultNode()}
            {foodNode()}
          </Div>
        );
      }
      else if (strings?.type === "find") {
        return (
          null
        );
      }
      else if (strings?.type === "detail") {
        return (
          null
        );
      }
      else if (strings?.type === "save") {
        return (
          null
        );
      }
    }

    // 4. money
    else if (strings?.part === "money") {
      if (strings?.type === "list" || strings?.type === "diff") {
        return (
          <Div className={"block-wrapper d-row h-40"}>
            {defaultNode()}
            {moneyNode()}
          </Div>
        );
      }
      else if (strings?.type === "detail") {
        return (
          null
        );
      }
      else if (strings?.type === "save") {
        return (
          null
        );
      }
    }

    // 5. sleep
    else if (strings?.part === "sleep") {
      if (strings?.type === "list" || strings?.type === "diff") {
        return (
          <Div className={"block-wrapper d-row h-40"}>
            {defaultNode()}
          </Div>
        );
      }
      else if (strings?.type === "detail") {
        return (
          null
        );
      }
      else if (strings?.type === "save") {
        return (
          null
        );
      }
    }

    // 6. user
    else if (strings?.part === "user") {
      if (strings?.type === "list" || strings?.type === "diff") {
        return (
          <Div className={"block-wrapper d-row h-40"}>
            {demoNode()}
          </Div>
        );
      }
      else if (strings?.type === "dataset") {
        return (
          null
        );
      }
      else if (strings?.type === "login") {
        return (
          null
        );
      }
      else if (strings?.type === "signup") {
        return (
          null
        );
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
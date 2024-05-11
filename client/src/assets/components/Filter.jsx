// Filter.jsx

import {React} from "../../import/ImportReacts.jsx";
import {Paper, MenuItem, TextField, Box} from "../../import/ImportMuis.jsx";

// 12. filter ------------------------------------------------------------------------------------->
export const Filter = ({
  FILTER, setFILTER, PAGING, setPAGING, PART, setPART, part, plan, type
}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const session = sessionStorage.getItem("dataset") || "{}";
  const exerciseArray = JSON.parse(session).exercise || [];
  const foodArray = JSON.parse(session).food || [];
  const moneyArray = JSON.parse(session).money || [];
  const sleepArray = JSON.parse(session).sleep || [];

  // 1. default ----------------------------------------------------------------------------------->
  const defaultNode = () => (
    <Box className={"d-center"}>
      <TextField
        select={true}
        type={"text"}
        size={"small"}
        id={"type"}
        name={"type"}
        className={"ms-2 me-2"}
        variant={"outlined"}
        value={FILTER?.type}
        onChange={(e) => (
          setFILTER((prev) => ({
            ...prev,
            type: e.target.value
          })),
          setPAGING((prev) => ({
            ...prev,
            page: 1
          }))
        )}>
        {["day", "week", "month", "year", "select"]?.map((item) => (
          <MenuItem key={item} value={item} selected={FILTER?.type === item}>
            {item}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select={true}
        type={"text"}
        size={"small"}
        id={"order"}
        name={"order"}
        className={"ms-2 me-2"}
        variant={"outlined"}
        value={FILTER?.order}
        onChange={(e) => (
          setFILTER((prev) => ({
            ...prev,
            order: e.target.value
          }))
        )}>
        {["asc", "desc"]?.map((item) => (
          <MenuItem key={item} value={item} selected={FILTER?.order === item}>
            {item}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );

  // 2. exercise ---------------------------------------------------------------------------------->
  const exerciseNode = () => (
    <Box className={"d-center"}>
      <TextField
        select={true}
        type={"text"}
        size={"small"}
        id={"part"}
        name={"part"}
        className={"ms-2 me-2"}
        variant={"outlined"}
        value={FILTER?.part}
        onChange={(e) => {
          const newPartVal = e.target.value;
          const newPartIndex = exerciseArray.findIndex((item) => (
            item.exercise_part === newPartVal
          ));
          const newTitleIndex = 0;
          const newTitleVal = exerciseArray[newPartIndex]?.exercise_title[0];
          setFILTER(prev => ({
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
        id={"title"}
        name={"title"}
        className={"ms-2 me-2"}
        variant={"outlined"}
        value={FILTER?.title}
        onChange={(e) => {
          const newTitleVal = e.target.value;
          const newTitleIndex = exerciseArray[FILTER?.partIdx]?.exercise_title.findIndex(item => item === newTitleVal);
          setFILTER(prev => ({
            ...prev,
            titleIdx: newTitleIndex,
            title: newTitleVal
          }));
        }}>
        {exerciseArray[FILTER?.partIdx]?.exercise_title?.map((item, idx) => (
          <MenuItem key={idx} value={item}>
            {item}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );

  // 3. food -------------------------------------------------------------------------------------->
  const foodNode = () => (
    <Box className={"d-center"}>
      <TextField
        select={true}
        type={"text"}
        size={"small"}
        id={"part"}
        name={"part"}
        className={"ms-2 me-2"}
        variant={"outlined"}
        value={FILTER?.part}
        onChange={(e) => {
          const newPartVal = e.target.value;
          const newPartIndex = foodArray.findIndex((item) => (
            item.food_part === newPartVal
          ));
          setFILTER(prev => ({
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
    </Box>
  );

  // 4. money ------------------------------------------------------------------------------------->
  const moneyNode = () => (
    <Box className={"d-center"}>
      <TextField
        select={true}
        type={"text"}
        size={"small"}
        id={"part"}
        name={"part"}
        className={"ms-2 me-2"}
        variant={"outlined"}
        value={FILTER?.part}
        onChange={(e) => {
          const newPartVal = e.target.value;
          const newPartIndex = moneyArray.findIndex((item) => (
            item.money_part === newPartVal
          ));
          const newTitleIndex = 0;
          const newTitleVal = moneyArray[newPartIndex]?.money_title[0];
          setFILTER(prev => ({
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
        id={"title"}
        name={"title"}
        className={"ms-2 me-2"}
        variant={"outlined"}
        value={FILTER?.title}
        onChange={(e) => {
          const newTitleVal = e.target.value;
          const newTitleIndex = moneyArray[FILTER?.partIdx]?.money_title.findIndex(item => item === newTitleVal);
          setFILTER(prev => ({
            ...prev,
            titleIdx: newTitleIndex,
            title: newTitleVal
          }));
        }}>
        {moneyArray[FILTER?.partIdx]?.money_title?.map((item, idx) => (
          <MenuItem key={idx} value={item}>
            {item}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );

  // 6. tweak ------------------------------------------------------------------------------------->
  const tweakNode = () => (
    <TextField
      select={true}
      type={"text"}
      size={"small"}
      id={"part"}
      name={"part"}
      className={"ms-2 me-2"}
      variant={"outlined"}
      value={PART}
      onChange={(e) => {
        const newPartVal = e.target.value;
        setPART(newPartVal);
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

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => (
    <Paper className={"flex-wrapper h-8vh p-sticky bottom-48 d-row"} variant={"outlined"}>
      {part === "exercise" && plan === "" ? (
        <>
          {defaultNode()}
          {exerciseNode()}
        </>
      ) : part === "food" && plan === "" ? (
        <>
          {defaultNode()}
          {foodNode()}
        </>
      ) : part === "money" && plan === "" ? (
        <>
          {defaultNode()}
          {moneyNode()}
        </>
      ) : part === "sleep" && plan === "" ? (
        <>
          {defaultNode()}
        </>
      ) : part === "tweak" ? (
        <>
          {tweakNode()}
        </>
      ) : (
        <>
          {defaultNode()}
        </>
      )}
    </Paper>
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {tableNode()}
    </React.Fragment>
  );
};
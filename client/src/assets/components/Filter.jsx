// Filter.jsx

import {React} from "../../import/ImportReacts";
import {Grid2, Container, Paper, MenuItem, TextField} from "../../import/ImportMuis";

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
    <React.Fragment>
      <TextField
        select={true}
        type={"text"}
        size={"small"}
        id={"type"}
        name={"type"}
        className={"w-90"}
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
        className={"w-90"}
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
    </React.Fragment>
  );

  // 2. exercise ---------------------------------------------------------------------------------->
  const exerciseNode = () => (
    <React.Fragment>
      <TextField
        select={true}
        type={"text"}
        size={"small"}
        id={"part"}
        name={"part"}
        className={"w-90"}
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
        className={"w-90"}
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
    </React.Fragment>
  );

  // 3. food -------------------------------------------------------------------------------------->
  const foodNode = () => (
    <React.Fragment>
      <TextField
        select={true}
        type={"text"}
        size={"small"}
        id={"part"}
        name={"part"}
        className={"w-90"}
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
    </React.Fragment>
  );

  // 4. money ------------------------------------------------------------------------------------->
  const moneyNode = () => (
    <React.Fragment>
      <TextField
        select={true}
        type={"text"}
        size={"small"}
        id={"part"}
        name={"part"}
        className={"w-90"}
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
        className={"w-90"}
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
    </React.Fragment>
  );

  // 5. sleep ------------------------------------------------------------------------------------->

  // 6. tweak ------------------------------------------------------------------------------------->
  const tweakNode = () => (
    <React.Fragment>
      <TextField
        select={true}
        type={"text"}
        size={"small"}
        id={"part"}
        name={"part"}
        className={"w-90"}
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
    </React.Fragment>
  );

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => (
    <React.Fragment>
      <Paper className={"flex-wrapper h-8vh p-sticky bottom-35"} variant={"outlined"}>
        <Container className={"p-0"}>
          <Grid2 container spacing={3}>
            <Grid2 xl={12} lg={12} md={12} sm={12} xs={12} className={"d-center"}>
              {part === "exercise" && plan === "" ? (
                <React.Fragment>
                  {defaultNode()}
                  {exerciseNode()}
                </React.Fragment>
              ) : part === "food" && plan === "" ? (
                <React.Fragment>
                  {defaultNode()}
                  {foodNode()}
                </React.Fragment>
              ) : part === "money" && plan === "" ? (
                <React.Fragment>
                  {defaultNode()}
                  {moneyNode()}
                </React.Fragment>
              ) : part === "sleep" && plan === "" ? (
                <React.Fragment>
                  {defaultNode()}
                </React.Fragment>
              ) : part === "tweak" ? (
                <React.Fragment>
                  {tweakNode()}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {defaultNode()}
                </React.Fragment>
              )}
            </Grid2>
          </Grid2>
        </Container>
      </Paper>
    </React.Fragment>
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {tableNode()}
    </React.Fragment>
  );
};
// Filter.jsx

import {React, useLocation} from "../../../import/ImportReacts.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {moment} from "../../../import/ImportLibs.jsx";
import {PopUp, Div, Img} from "../../../import/ImportComponents.jsx";
import {TextField, DateCalendar, MenuItem} from "../../../import/ImportMuis.jsx";
import {LocalizationProvider, AdapterMoment} from "../../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const Filter = ({
  strings, objects, functions, handlers
}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const session = sessionStorage.getItem("dataSet") || "{}";
  const exerciseArray = JSON.parse(session).exercise || [];
  const foodArray = JSON.parse(session).food || [];
  const moneyArray = JSON.parse(session).money || [];
  const sleepArray = JSON.parse(session).sleep || [];
  const location = useLocation();
  const PATH = location?.pathname.trim().toString();
  const secondStr = PATH?.split("/")[2] || "";

  // 1. default ----------------------------------------------------------------------------------->
  const defaultNode = () => (
    <Div className={"d-center"}>
      <TextField
        select={true}
        type={"text"}
        size={"small"}
        label={"유형"}
        variant={"outlined"}
        value={objects?.DATE?.dateType || "전체"}
        className={"ms-2 me-2"}
        InputProps={{className: "h-4vh fs-0-7rem"}}
        onChange={(e) => (
          functions?.setDATE((prev) => ({
            ...prev,
            dateType: e.target.value
          })),
          functions?.setPAGING((prev) => ({
            ...prev,
            page: 1
          }))
        )}>
        {secondStr === "plan" ? (
          ["전체", "day", "week", "month", "year"].map((item) => (
            <MenuItem key={item} value={item} selected={objects?.DATE?.dateType === item}>
              {item}
            </MenuItem>
          ))
        ) : (
          ["전체", "day"].map((item) => (
            <MenuItem key={item} value={item} selected={objects?.DATE?.dateType === item}>
              {item}
            </MenuItem>
          ))
        )}
      </TextField>
      <TextField
        select={true}
        type={"text"}
        size={"small"}
        label={"정렬"}
        variant={"outlined"}
        value={objects?.FILTER?.order || "asc"}
        className={"ms-2 me-2"}
        InputProps={{className: "h-4vh fs-0-7rem"}}
        onChange={(e) => (
          functions?.setFILTER((prev) => ({
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
      <PopUp
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={({closePopup}) => (
          <Div className={"d-center"}>
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
              <DateCalendar
                timezone={"Asia/Seoul"}
                views={["year", "day"]}
                readOnly={false}
                defaultValue={moment(objects?.DATE.dateStart)}
                className={"radius border w-max42vw h-max30vh me-2"}
                onChange={(date) => {
                  (objects?.DATE) && (
                    functions?.setDATE((prev) => ({
                      ...prev,
                      dateStart: moment(date).format("YYYY-MM-DD")
                    }))
                  );
                  (objects?.PAGING) && (
                    functions?.setPAGING((prev) => ({
                      ...prev,
                      page: 1,
                    }))
                  );
                }}
                sx={{
                  "& .MuiDateCalendar-root": {
                    width: "100%",
                    height: "100%",
                  },
                  "& .MuiYearCalendar-root": {
                    width: "100%",
                    height: "100%",
                  },
                  "& .MuiDayCalendar-slideTransition": {
                    minHeight: "0px",
                  },
                  "& .MuiDayCalendar-weekDayLabel": {
                    fontSize: "0.65rem",
                    height: "3.0vh",
                  },
                  '& .MuiPickersDay-root': {
                    fontSize: "0.65rem",
                    height: "3.0vh",
                  },
                }}
              />
              <DateCalendar
                timezone={"Asia/Seoul"}
                views={["year", "day"]}
                readOnly={false}
                defaultValue={moment(objects?.DATE.dateEnd)}
                className={"radius border w-max42vw h-max30vh ms-2"}
                onChange={(date) => {
                  (objects?.DATE) && (
                    functions?.setDATE((prev) => ({
                      ...prev,
                      dateEnd: moment(date).format("YYYY-MM-DD")
                    }))
                  );
                  (objects?.PAGING) && (
                    functions?.setPAGING((prev) => ({
                      ...prev,
                      page: 1,
                    }))
                  );
                }}
                sx={{
                  "& .MuiDateCalendar-root": {
                    width: "100%",
                    height: "100%",
                  },
                  "& .MuiYearCalendar-root": {
                    width: "100%",
                    height: "100%",
                  },
                  "& .MuiDayCalendar-slideTransition": {
                    minHeight: "0px",
                  },
                  "& .MuiDayCalendar-weekDayLabel": {
                    fontSize: "0.65rem",
                    height: "3.0vh",
                  },
                  '& .MuiPickersDay-root': {
                    fontSize: "0.65rem",
                    height: "3.0vh",
                  },
                }}
              />
            </LocalizationProvider>
          </Div>
        )}>
        {(popTrigger={}) => (
          <TextField
            type={"text"}
            size={"small"}
            label={"기간"}
            variant={"outlined"}
            value={`${objects?.DATE?.dateStart} ~ ${objects?.DATE?.dateEnd}`}
            className={"ms-2 me-2"}
            InputProps={{
              readOnly: true,
              className: "w-40vw h-4vh fs-0-7rem"
            }}
            onClick={(e) => {
              popTrigger.openPopup(e.currentTarget);
            }}
          />
        )}
      </PopUp>
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
        InputProps={{className: "h-4vh fs-0-7rem"}}
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
        InputProps={{className: "h-4vh fs-0-7rem"}}
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
        InputProps={{className: "h-4vh fs-0-7rem"}}
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
        InputProps={{className: "h-4vh fs-0-7rem"}}
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
        InputProps={{className: "h-4vh fs-0-7rem"}}
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

  // 5. user -------------------------------------------------------------------------------------->
  const userNode = () => (
    <TextField
      select={true}
      type={"text"}
      size={"small"}
      className={"ms-2 me-2"}
      variant={"outlined"}
      value={objects?.PART}
      InputProps={{className: "h-4vh fs-0-7rem"}}
      onChange={(e) => {
        const newPartVal = e.target.value;
        functions?.setPART(newPartVal);
        functions?.setPAGING((prev) => ({
          ...prev,
          page: 1,
          limit: 10
        }));
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
          <Div className={"block-wrapper d-row h-max7vh"}>
            {defaultNode()}
            {/* {exerciseNode()} */}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-max7vh"}>
            {defaultNode()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Div className={"block-wrapper d-row h-max7vh"}>
            {defaultNode()}
            {/* {exerciseNode()} */}
          </Div>
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
          <Div className={"block-wrapper d-row h-max7vh"}>
            {defaultNode()}
            {/* {foodNode()} */}
          </Div>
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
          <Div className={"block-wrapper d-row h-max7vh"}>
            {defaultNode()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Div className={"block-wrapper d-row h-max7vh"}>
            {defaultNode()}
            {/* {foodNode()} */}
          </Div>
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
          <Div className={"block-wrapper d-row h-max7vh"}>
            {defaultNode()}
            {/* {moneyNode()} */}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-max7vh"}>
            {defaultNode()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Div className={"block-wrapper d-row h-max7vh"}>
            {defaultNode()}
            {/* {moneyNode()} */}
          </Div>
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
          <Div className={"block-wrapper d-row h-max7vh"}>
            {defaultNode()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-max7vh"}>
            {defaultNode()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Div className={"block-wrapper d-row h-max7vh"}>
            {defaultNode()}
          </Div>
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
          <Div className={"block-wrapper d-row h-max7vh"}>
            {defaultNode()}
          </Div>
        );
      }
      else if (strings?.second === "data" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-max7vh"}>
            {userNode()}
          </Div>
        );
      }
      else if (strings?.second === "data" && strings?.third === "set") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Div className={"block-wrapper d-row h-max7vh"}>
            {defaultNode()}
          </Div>
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
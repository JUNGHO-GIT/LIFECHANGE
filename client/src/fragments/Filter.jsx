// Filter.jsx

import React from "react";
import {InputLabel, MenuItem, FormControl, Select, Box, FormHelperText} from "@mui/material";
import {Card, Container, Grid} from "@mui/material";
import Grid2 from '@mui/material/Unstable_Grid2';

// 10. filter ------------------------------------------------------------------------------------->
export const Filter = ({
  FILTER, setFILTER, PAGING, setPAGING, part, plan, type
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
      <FormControl size={"small"} variant={"outlined"} className={"ms-2 me-2"}>
        <Select labelId={"type"} id={"type"} value={FILTER?.type} className={"form-select"}
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
        </Select>
      </FormControl>
      <FormControl size={"small"} variant={"outlined"} className={"ms-2 me-2"}>
        <Select labelId={"order"} id={"order"} value={FILTER?.order} className={"form-select"}
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
        </Select>
      </FormControl>
      <FormControl size={"small"} variant={"outlined"} className={"ms-2 me-2"}>
        <Select labelId={"limit"} id={"limit"} value={FILTER?.limit} className={"form-select"}
        onChange={(e) => (
          setFILTER((prev) => ({
            ...prev,
            limit: Number(e.target.value)
          })),
          setPAGING((prev) => ({
            ...prev,
            limit: Number(e.target.value)
          }))
        )}>
          {["5", "10"]?.map((item) => (
            <MenuItem key={item} value={item} selected={FILTER?.limit === parseInt(item)}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </React.Fragment>
  );

  // 2. exercise ---------------------------------------------------------------------------------->
  const exerciseNode = () => (
    <React.Fragment>
      <FormControl size={"small"} variant={"outlined"} className={"ms-2 me-2"}>
        <Select labelId={"part"} id={"part"} value={FILTER?.part} className={"form-select"}
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
        </Select>
      </FormControl>
      <FormControl size={"small"} variant={"outlined"} className={"ms-2 me-2"}>
        <Select labelId={"title"} id={"title"} value={FILTER?.title} className={"form-select"}
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
        </Select>
      </FormControl>
    </React.Fragment>
  );

  // 3. food -------------------------------------------------------------------------------------->
  const foodNode = () => (
    <React.Fragment>
      <FormControl size={"small"} variant={"outlined"} className={"ms-2 me-2"}>
        <Select labelId={"part"} id={"part"} value={FILTER?.part} className={"form-select"}
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
        </Select>
      </FormControl>
    </React.Fragment>
  );

  // 4. money ------------------------------------------------------------------------------------->
  const moneyNode = () => (
    <React.Fragment>
      <FormControl size={"small"} variant={"outlined"} className={"ms-2 me-2"}>
        <Select labelId={"part"} id={"part"} value={FILTER?.part} className={"form-select"}
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
        </Select>
      </FormControl>
      <FormControl size={"small"} variant={"outlined"} className={"ms-2 me-2"}>
        <Select labelId={"title"} id={"title"} value={FILTER?.title} className={"form-select"}
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
        </Select>
      </FormControl>
    </React.Fragment>
  );

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => (
    <React.Fragment>
      <Card className={"flex-wrapper h-8vh p-sticky bottom-35"}>
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
              ) : (
                <React.Fragment>
                  {defaultNode()}
                </React.Fragment>
              )}
            </Grid2>
          </Grid2>
        </Container>
      </Card>
    </React.Fragment>
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {tableNode()}
    </React.Fragment>
  );
};
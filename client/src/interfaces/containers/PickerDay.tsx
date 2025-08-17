// Picker.tsx
// 계획은 week, month, year
// 실제는 day

import { useEffect, useState } from "@importReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@importHooks";
import { useStoreLanguage } from "@importStores";
import { setSession } from "@importScripts";
import { PopUp, Input, Select } from "@importContainers";
import { Btn, Img, Div, Icons, Grid } from "@importComponents";
import { MenuItem, PickersDay, Badge } from "@importMuis";
import { DateCalendar, AdapterMoment, LocalizationProvider } from "@importMuis";

// -------------------------------------------------------------------------------------------------
declare type PickerDayProps = {
  DATE: {
    dateType: string;
    dateStart: string;
    dateEnd: string;
  };
  setDATE: React.Dispatch<React.SetStateAction<{
    dateType: string;
    dateStart: string;
    dateEnd: string;
  }>>;
  EXIST: {
    day: string[];
    week: string[];
    month: string[];
    year: string[];
    select: string[];
  };
	disabled?: boolean;
}

// -------------------------------------------------------------------------------------------------
export const PickerDay = (
  { DATE, setDATE, EXIST, disabled }: PickerDayProps
) => {

  // 1. common -------------------------------------------------------------------------------------
  const { PATH, localLang, localTimeZone } = useCommonValue();
  const { isTodayList, isTodayGoalList, isGoalList, isGoalDetail } = useCommonValue();
  const { isRealList, isRealDetail, isCalendarDetail } = useCommonValue();
  const { getDayFmt, getDayNotFmt, getDayStartFmt, getDayEndFmt } = useCommonDate();
  const { getPrevDayStartFmt, getPrevDayEndFmt } = useCommonDate();
  const { getNextDayStartFmt, getNextDayEndFmt } = useCommonDate();
  const { getWeekStartFmt, getWeekEndFmt } = useCommonDate();
  const { getPrevWeekStartFmt, getPrevWeekEndFmt } = useCommonDate();
  const { getNextWeekStartFmt, getNextWeekEndFmt } = useCommonDate();
  const { getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { getPrevMonthStartFmt, getPrevMonthEndFmt } = useCommonDate();
  const { getNextMonthStartFmt, getNextMonthEndFmt } = useCommonDate();
  const { getYearStartFmt, getYearEndFmt } = useCommonDate();
  const { getPrevYearStartFmt, getPrevYearEndFmt } = useCommonDate();
  const { getNextYearStartFmt, getNextYearEndFmt } = useCommonDate();
  const { translate } = useStoreLanguage();

  // ex. 2024-11-12 - 12-15
  const durStr = (
    `${DATE.dateStart.split("-")[1] || "" }-${DATE.dateStart.split("-")[2] || "" } - ` +
    `${DATE.dateEnd.split("-")[1] || "" }-${DATE.dateEnd.split("-")[2] || "" }`
  );

  // 2-1. useState ---------------------------------------------------------------------------------
  const [selectTypeInListStr, setSelectTypeInListStr] = useState<string>("");
  const [selectTypeInSaveStr, setSelectTypeInSaveStr] = useState<string>("");

  // 2-1. useStorageLocal --------------------------------------------------------------------------
  const [selectTypeInSave, setSelectTypeInSave] = useState<string>("");
  const [selectTypeInList, setSelectTypeInList] = useStorageLocal(
    "type", "list", PATH, (
      "month"
    )
  );

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (isTodayGoalList || isGoalList || isTodayList || isRealList) {
      setSelectTypeInSaveStr("h-min-0px h-5vh fs-0-7rem pointer");
      setSelectTypeInListStr("h-min-0px h-5vh fs-0-7rem pointer");
    }
    else {
      setSelectTypeInSaveStr("h-min-40px fs-0-8rem pointer");
      setSelectTypeInListStr("h-min-40px fs-0-8rem pointer");
    }
  }, [PATH]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (isTodayGoalList || isTodayList) {
      setSelectTypeInList("day");
      setDATE({
        dateType: "",
        dateStart: DATE.dateStart || getDayFmt(),
        dateEnd: DATE.dateEnd || getDayFmt(),
      });
    }
    else if (isGoalList || isRealList) {
      if (selectTypeInList === "day") {
        setDATE({
          dateType: "day",
          dateStart: DATE.dateStart || getDayFmt(),
          dateEnd: DATE.dateEnd || getDayFmt(),
        });
      }
      else if (selectTypeInList === "week") {
        setDATE({
          dateType: "week",
          dateStart: getWeekStartFmt(),
          dateEnd: getWeekEndFmt(),
        });
      }
      else if (selectTypeInList === "month") {
        setDATE({
          dateType: "month",
          dateStart: getMonthStartFmt(),
          dateEnd: getMonthEndFmt(),
        });
      }
      else if (selectTypeInList === "year") {
        setDATE({
          dateType: "year",
          dateStart: getYearStartFmt(),
          dateEnd: getYearEndFmt(),
        });
      }
      else if (selectTypeInList === "select") {
        setDATE({
          dateType: "select",
          dateStart: DATE.dateStart,
          dateEnd: DATE.dateEnd,
        });
      }
    }
  }, [selectTypeInList]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (isCalendarDetail || isGoalDetail || isRealDetail) {
      if (selectTypeInSave === "day") {
        setDATE({
          dateType: "day",
          dateStart: getDayFmt(),
          dateEnd: getDayFmt(),
        });
      }
      else if (selectTypeInSave === "week") {
        setDATE({
          dateType: "week",
          dateStart: getWeekStartFmt(),
          dateEnd: getWeekEndFmt(),
        });
      }
      else if (selectTypeInSave === "month") {
        setDATE({
          dateType: "month",
          dateStart: getMonthStartFmt(),
          dateEnd: getMonthEndFmt(),
        });
      }
      else if (selectTypeInSave === "year") {
        setDATE({
          dateType: "year",
          dateStart: getYearStartFmt(),
          dateEnd: getYearEndFmt(),
        });
      }
      else if (selectTypeInSave === "select") {
        setDATE({
          dateType: "select",
          dateStart: DATE.dateStart,
          dateEnd: DATE.dateEnd,
        });
      }
    }
  }, [selectTypeInSave]);

  // 7. pickerNode ---------------------------------------------------------------------------------
  const pickerNode = () => {

    // 1. selectTypeInList ---------------------------------------------------------------------------------
    const selectTypeInListSection = () => (
      <Select
        label={translate("dateType")}
        value={selectTypeInList}
				inputclass={`pointer ${selectTypeInListStr}`}
        disabled={isTodayGoalList || isTodayList}
        onChange={(e: any) => {
          setSelectTypeInList(e.target.value);
        }}
      >
        {["day", "week", "month", "year", "select"]?.map((item: any) => (
          <MenuItem
            key={item}
            value={item}
            selected={item === selectTypeInList}
          >
            <Div className={"fs-0-6rem"}>
              {translate(item)}
            </Div>
          </MenuItem>
        ))}
      </Select>
    );

    // 2. selectTypeInSave ---------------------------------------------------------------------------------
    const selectTypeInSaveSection = () => (
      <Select
        label={translate("dateType")}
        value={DATE.dateType}
				inputclass={`pointer ${selectTypeInListStr}`}
        disabled={isRealDetail || isCalendarDetail}
        onChange={(e: any) => {
          if (e.target.value === "day") {
            setSelectTypeInSave("day");
          }
          else if (e.target.value === "week") {
            setSelectTypeInSave("week");
          }
          else if (e.target.value === "month") {
            setSelectTypeInSave("month");
          }
          else if (e.target.value === "year") {
            setSelectTypeInSave("year");
          }
          else if (e.target.value === "select") {
            setSelectTypeInSave("select");
          }
        }}
      >
        {isCalendarDetail ? (
          ["day"]?.map((item: any) => (
            <MenuItem
              key={item}
              value={item}
              selected={item === selectTypeInSave}
            >
              {translate(item)}
            </MenuItem>
          ))
        )
        : isGoalDetail ? (
          ["week", "month", "year"]?.map((item: any) => (
            <MenuItem
              key={item}
              value={item}
              selected={item === selectTypeInSave}
            >
              {translate(item)}
            </MenuItem>
          ))
        )
        : (
          ["day"]?.map((item: any) => (
            <MenuItem
              key={item}
              value={item}
              selected={item === selectTypeInSave}
            >
              {translate(item)}
            </MenuItem>
          ))
        )}
      </Select>
    );

    // 3. day --------------------------------------------------------------------------------------
    const daySection = () => (
      <PopUp
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={
          <Grid container={true} spacing={2} className={"w-min-70vw"}>
            <Grid size={12} className={"d-row-center"}>
              <Div className={"fs-1-2rem fw-600 mr-10px"}>
                {translate("viewDay")}
              </Div>
              <Div className={"fs-0-8rem fw-500 dark"}>
                {`[${getDayFmt(DATE.dateStart)}]`}
              </Div>
            </Grid>
            <Grid size={12} className={"d-center"}>
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLang}>
                <DateCalendar
                  timezone={localTimeZone}
                  views={["day"]}
                  readOnly={false}
                  value={getDayNotFmt(DATE.dateStart || DATE.dateEnd)}
                  className={"border-1 radius-2"}
                  showDaysOutsideCurrentMonth={true}
                  slots={{
                    day: (props) => {
                      const { outsideCurrentMonth, day, ...other } = props;

                      let isSelected = false;
                      let isBadged = false;

                      let color = "";
                      let borderRadius = "";
                      let backgroundColor = "";
                      let boxShadow = "";
                      let zIndex = 0;

                      // badge 표시는 일 단위로 표시
                      if (EXIST?.day) {
                        EXIST?.day.forEach((item: any) => {
                          if (
                            item.split(" - ") &&
                            item.split(" - ")?.length === 2 &&
                            getDayFmt(day) >= item.split(" - ")[0] &&
                            getDayFmt(day) <= item.split(" - ")[1]
                          ) {
                            isBadged = true;
                          }
                        });
                      }

                      if (DATE.dateStart && DATE.dateEnd) {
                        isSelected = DATE.dateStart === getDayFmt(day);
                      }

                      if (isSelected) {
                        color = "#ffffff";
                        backgroundColor = "#1976d2";
                        boxShadow = "0 0 0 0 #1976d2";
                        borderRadius = "50%";
                        zIndex = 10;
                      }
                      return (
                        <Badge
                          key={props.day.toString()}
                          badgeContent={""}
                          slotProps={{
                            badge: {
                              style: {
                                width: 3, height: 3, padding: 0, top: 8, left: 30,
                                backgroundColor: isBadged ? "#1976d2" : undefined,
                              }
                            }
                          }}
                        >
                          <PickersDay
                            {...other}
                            day={day}
                            selected={isSelected}
                            outsideCurrentMonth={outsideCurrentMonth}
                            style={{
                              color: color,
                              borderRadius: borderRadius,
                              backgroundColor: backgroundColor,
                              boxShadow: boxShadow,
                              zIndex: zIndex,
                            }}
                            onDaySelect={(day) => {
                              setDATE((prev) => ({
                                ...prev,
                                dateStart: getDayFmt(day),
                                dateEnd: getDayFmt(day),
                              }));
                              setSession("section", "food", "", []);
                            }}
                          />
                        </Badge>
                      )
                    },
                    previousIconButton: (props) => (
                      <Btn
                        {...props}
                        className={"fs-1-4rem"}
                        onClick={() => {
                          setDATE((prev) => ({
                            ...prev,
                            dateStart: getPrevMonthStartFmt(prev.dateStart),
                            dateEnd: getPrevMonthStartFmt(prev.dateStart),
                          }));
                        }}
                      >
                        {props.children}
                      </Btn>
                    ),
                    nextIconButton: (props) => (
                      <Btn
                        {...props}
                        className={"fs-1-4rem"}
                        onClick={() => {
                          setDATE((prev) => ({
                            ...prev,
                            dateStart: getNextMonthStartFmt(prev.dateStart),
                            dateEnd: getNextMonthStartFmt(prev.dateStart),
                          }));
                        }}
                      >
                        {props.children}
                      </Btn>
                    )
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        }
        children={(popTrigger: any) => (
          <Input
            label={translate("date")}
            value={`${DATE.dateStart}`}
            inputclass={`pointer ${selectTypeInListStr}`}
            readOnly={true}
            startadornment={
              <Img
                max={25}
                hover={true}
                shadow={false}
                radius={false}
              	src={"common1.webp"}
              />
            }
            endadornment={
              <Div className={"d-row-center"}>
                <Div className={"mr-n10px"}>
                  <Icons
                    key={"ChevronLeft"}
                    name={"ChevronLeft"}
                    className={"w-20px h-20px"}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setDATE((prev) => ({
                        ...prev,
                        dateStart: getPrevDayStartFmt(prev.dateStart),
                        dateEnd: getPrevDayEndFmt(prev.dateStart),
                      }));
                      setSession("section", "food", "", []);
                    }}
                  />
                </Div>
                <Div className={"mr-n15px"}>
                  <Icons
                    key={"ChevronRight"}
                    name={"ChevronRight"}
                    className={"w-20px h-20px"}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setDATE((prev) => ({
                        ...prev,
                        dateStart: getNextDayStartFmt(prev.dateStart),
                        dateEnd: getNextDayEndFmt(prev.dateStart),
                      }));
                      setSession("section", "food", "", []);
                    }}
                  />
                </Div>
              </Div>
            }
            onClick={(e: any) => {
              popTrigger.openPopup(e.currentTarget);
            }}
          />
        )}
      />
    );

    // 4. week -------------------------------------------------------------------------------------
    const weekSection = () => (
      <PopUp
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={
          <Grid container={true} spacing={2} className={"w-min-70vw"}>
            <Grid size={12} className={"d-row-center"}>
              <Div className={"fs-1-2rem fw-600 mr-10px"}>
                {translate("viewWeek")}
              </Div>
              <Div className={"fs-0-8rem fw-500 dark"}>
                {`[${getWeekStartFmt(DATE.dateStart)} - ${getWeekEndFmt(DATE.dateEnd)}]`}
              </Div>
            </Grid>
            <Grid size={12} className={"d-center"}>
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLang}>
                <DateCalendar
                  timezone={localTimeZone}
                  views={["day"]}
                  readOnly={false}
                  value={getDayNotFmt(DATE.dateStart || DATE.dateEnd)}
                  className={"border-1 radius-2"}
                  showDaysOutsideCurrentMonth={true}
                  slots={{
                    day: (props) => {
                      const { outsideCurrentMonth, day, ...other } = props;

                      let isSelected = false;
                      let isBadged = false;
                      let isFirst = false;
                      let isLast = false;

                      let color = "";
                      let borderRadius = "";
                      let backgroundColor = "";
                      let boxShadow = "";
                      let zIndex = 0;

                      // badge 표시는 일 단위로 표시
                      if (EXIST?.day) {
                        EXIST?.day.forEach((item: any) => {
                          if (
                            item.split(" - ") &&
                            item.split(" - ")?.length === 2 &&
                            getDayFmt(day) >= item.split(" - ")[0] &&
                            getDayFmt(day) <= item.split(" - ")[1]
                          ) {
                            isBadged = true;
                          }
                        });
                      }

                      if (DATE.dateStart && DATE.dateEnd) {
                        isSelected = DATE.dateStart <= getDayFmt(day) && DATE.dateEnd >= getDayFmt(day);
                        isFirst = DATE.dateStart === getDayStartFmt(day);
                        isLast = DATE.dateEnd === getDayEndFmt(day);
                      }

                      if (isSelected) {
                        if (isFirst && isLast) {
                          boxShadow = "0 0 0 0 #1976d2";
                          borderRadius = "50%";
                        }
                        else if (isFirst) {
                          boxShadow = "5px 0 0 0 #1976d2";
                          borderRadius = "50% 0 0 50%";
                        }
                        else if (isLast) {
                          boxShadow = "-5px 0 0 0 #1976d2";
                          borderRadius = "0 50% 50% 0";
                        }
                        else {
                          boxShadow = "5px 0 0 0 #1976d2";
                          borderRadius = "0%";
                        }
                        color = "#ffffff";
                        backgroundColor = "#1976d2";
                        zIndex = 10;
                      }
                      return (
                        <Badge
                          key={props.day.toString()}
                          badgeContent={""}
                          slotProps={{
                            badge: {
                              style: {
                                width: 3, height: 3, padding: 0, top: 8, left: 30,
                                backgroundColor: isBadged ? "#1976d2" : undefined,
                              }
                            }
                          }}
                        >
                          <PickersDay
                            {...other}
                            day={day}
                            selected={isSelected}
                            outsideCurrentMonth={outsideCurrentMonth}
                            style={{
                              color: color,
                              borderRadius: borderRadius,
                              backgroundColor: backgroundColor,
                              boxShadow: boxShadow,
                              zIndex: zIndex,
                            }}
                            onDaySelect={(day) => {
                              setDATE((prev) => ({
                                ...prev,
                                dateStart: getWeekStartFmt(day),
                                dateEnd: getWeekEndFmt(day),
                              }));
                            }}
                          />
                        </Badge>
                      )
                    },
                    previousIconButton: (props) => (
                      <Btn
                        {...props}
                        className={"fs-1-4rem"}
                        onClick={() => {
                          setDATE((prev) => ({
                            ...prev,
                            dateStart: getPrevWeekStartFmt(prev.dateStart),
                            dateEnd: getPrevWeekEndFmt(prev.dateStart),
                          }));
                        }}
                      >
                        {props.children}
                      </Btn>
                    ),
                    nextIconButton: (props) => (
                      <Btn
                        {...props}
                        className={"fs-1-4rem"}
                        onClick={() => {
                          setDATE((prev) => ({
                            ...prev,
                            dateStart: getNextWeekStartFmt(prev.dateStart),
                            dateEnd: getNextWeekEndFmt(prev.dateStart),
                          }));
                        }}
                      >
                        {props.children}
                      </Btn>
                    ),
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        }
        children={(popTrigger: any) => (
          <Input
            label={translate("duration")}
            value={durStr}
            inputclass={`pointer ${selectTypeInListStr}`}
            readOnly={true}
            startadornment={
              <Img
                max={25}
                hover={true}
                shadow={false}
                radius={false}
              	src={"common1.webp"}
              />
            }
            endadornment={
              <Div className={"d-row-center"}>
                <Div className={"mr-n10px"}>
                  <Icons
                    key={"ChevronLeft"}
                    name={"ChevronLeft"}
                    className={"w-20px h-20px"}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setDATE((prev) => ({
                        ...prev,
                        dateStart: getPrevWeekStartFmt(prev.dateStart),
                        dateEnd: getPrevWeekEndFmt(prev.dateStart),
                      }));
                    }}
                  />
                </Div>
                <Div className={"mr-n15px"}>
                  <Icons
                    key={"ChevronRight"}
                    name={"ChevronRight"}
                    className={"w-20px h-20px"}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setDATE((prev) => ({
                        ...prev,
                        dateStart: getNextWeekStartFmt(prev.dateStart),
                        dateEnd: getNextWeekEndFmt(prev.dateStart),
                      }));
                    }}
                  />
                </Div>
              </Div>
            }
            onClick={(e: any) => {
              popTrigger.openPopup(e.currentTarget);
            }}
          />
        )}
      />
    );

    // 5. month ------------------------------------------------------------------------------------
    const monthSection = () => (
      <PopUp
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={
          <Grid container={true} spacing={2} className={"w-min-70vw"}>
            <Grid size={12} className={"d-row-center"}>
              <Div className={"fs-1-2rem fw-600 mr-10px"}>
                {translate("viewMonth")}
              </Div>
              <Div className={"fs-0-8rem fw-500 dark"}>
                {`[${getMonthStartFmt(DATE.dateStart)} - ${getMonthEndFmt(DATE.dateEnd)}]`}
              </Div>
            </Grid>
            <Grid size={12} className={"d-center"}>
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLang}>
                <DateCalendar
                  timezone={localTimeZone}
                  views={["day"]}
                  readOnly={false}
                  value={getDayNotFmt(DATE.dateStart || DATE.dateEnd)}
                  className={"border-1 radius-2"}
                  showDaysOutsideCurrentMonth={true}
                  slots={{
                    day: (props) => {
                      const { outsideCurrentMonth, day, ...other } = props;

                      let isSelected = false;
                      let isBadged = false;

                      let color = "";
                      let borderRadius = "";
                      let backgroundColor = "";
                      let boxShadow = "";
                      let zIndex = 0;

                      // badge 표시는 일 단위로 표시
                      if (EXIST?.day) {
                        EXIST?.day.forEach((item: any) => {
                          if (
                            item.split(" - ") &&
                            item.split(" - ")?.length === 2 &&
                            getDayFmt(day) >= item.split(" - ")[0] &&
                            getDayFmt(day) <= item.split(" - ")[1]
                          ) {
                            isBadged = true;
                          }
                        });
                      }

                      if (DATE.dateStart && DATE.dateEnd) {
                        isSelected = DATE.dateStart === getDayFmt(day) && getDayNotFmt(day).date() === 1
                      }

                      if (isSelected) {
                        color = "#ffffff";
                        backgroundColor = "#1976d2";
                        boxShadow = "0 0 0 0 #1976d2";
                        borderRadius = "50%";
                        zIndex = 10;
                      }

                      return (
                        <Badge
                          key={props.day.toString()}
                          badgeContent={""}
                          slotProps={{
                            badge: {
                              style: {
                                width: 3, height: 3, padding: 0, top: 8, left: 30,
                                backgroundColor: isBadged ? "#1976d2" : undefined,
                              }
                            }
                          }}
                        >
                          <PickersDay
                            {...other}
                            day={day}
                            selected={isSelected}
                            outsideCurrentMonth={outsideCurrentMonth}
                            style={{
                              color: color,
                              borderRadius: borderRadius,
                              backgroundColor: backgroundColor,
                              boxShadow: boxShadow,
                              zIndex: zIndex,
                            }}
                            onDaySelect={(day) => {
                              setDATE((prev) => ({
                                ...prev,
                                dateStart: getMonthStartFmt(day),
                                dateEnd: getMonthEndFmt(day),
                              }));
                            }}
                          />
                        </Badge>
                      )
                    },
                    previousIconButton: (props) => (
                      <Btn
                        {...props}
                        className={"fs-1-4rem"}
                        onClick={() => {
                          setDATE((prev) => ({
                            ...prev,
                            dateStart: getPrevMonthStartFmt(prev.dateStart),
                            dateEnd: getPrevMonthEndFmt(prev.dateStart),
                          }));
                        }}
                      >
                        {props.children}
                      </Btn>
                    ),
                    nextIconButton: (props) => (
                      <Btn
                        {...props}
                        className={"fs-1-4rem"}
                        onClick={() => {
                          setDATE((prev) => ({
                            ...prev,
                            dateStart: getNextMonthStartFmt(prev.dateStart),
                            dateEnd: getNextMonthEndFmt(prev.dateStart),
                          }));
                        }}
                      >
                        {props.children}
                      </Btn>
                    )
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        }
        children={(popTrigger: any) => (
          <Input
            label={translate("duration")}
            value={durStr}
            inputclass={`pointer ${selectTypeInListStr}`}
            readOnly={true}
            startadornment={
              <Img
                max={25}
                hover={true}
                shadow={false}
                radius={false}
              	src={"common1.webp"}
              />
            }
            endadornment={
              <Div className={"d-row-center"}>
                <Div className={"mr-n10px"}>
                  <Icons
                    key={"ChevronLeft"}
                    name={"ChevronLeft"}
                    className={"w-20px h-20px"}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setDATE((prev) => ({
                        ...prev,
                        dateStart: getPrevMonthStartFmt(prev.dateStart),
                        dateEnd: getPrevMonthEndFmt(prev.dateStart),
                      }));
                    }}
                  />
                </Div>
                <Div className={"mr-n15px"}>
                  <Icons
                    key={"ChevronRight"}
                    name={"ChevronRight"}
                    className={"w-20px h-20px"}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setDATE((prev) => ({
                        ...prev,
                        dateStart: getNextMonthStartFmt(prev.dateStart),
                        dateEnd: getNextMonthEndFmt(prev.dateStart),
                      }));
                    }}
                  />
                </Div>
              </Div>
            }
            onClick={(e: any) => {
              popTrigger.openPopup(e.currentTarget);
            }}
          />
        )}
      />
    );

    // 6. year -------------------------------------------------------------------------------------
    const yearSection = () => (
      <PopUp
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={
          <Grid container={true} spacing={2} className={"w-min-70vw"}>
            <Grid size={12} className={"d-row-center"}>
              <Div className={"fs-1-2rem fw-600 mr-10px"}>
                {translate("viewYear")}
              </Div>
              <Div className={"fs-0-8rem fw-500 dark"}>
                {`[${getYearStartFmt(DATE.dateStart)} - ${getYearEndFmt(DATE.dateEnd)}]`}
              </Div>
            </Grid>
            <Grid size={12} className={"d-center"}>
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLang}>
                <DateCalendar
                  timezone={localTimeZone}
                  views={["day"]}
                  readOnly={false}
                  value={getDayNotFmt(DATE.dateStart || DATE.dateEnd)}
                  className={"border-1 radius-2"}
                  showDaysOutsideCurrentMonth={true}
                  slots={{
                    day: (props) => {

                      const { outsideCurrentMonth, day, ...other } = props;

                      let isSelected = false;
                      let isBadged = false;

                      let color = "";
                      let borderRadius = "";
                      let backgroundColor = "";
                      let boxShadow = "";
                      let zIndex = 0;

                      if (DATE.dateStart && DATE.dateEnd) {
                        isSelected = getDayNotFmt(day).month() === 0 && getDayNotFmt(day).date() === 1
                      }

                      // badge 표시는 일 단위로 표시
                      if (EXIST?.day) {
                        EXIST?.day.forEach((item: any) => {

                          const startYear = item.split(" - ")[0].split("-")[0];
                          const currentYear = getDayFmt(day).split("-")[0];
                          const isJanuary = day.month() === 0;

                          if (startYear === currentYear && isJanuary) {
                            isBadged = true;
                          }
                        });
                      }

                      if (isSelected) {
                        color = "#ffffff";
                        backgroundColor = "#1976d2";
                        boxShadow = "0 0 0 0 #1976d2";
                        borderRadius = "50%";
                        zIndex = 10;
                      }

                      return (
                        <Badge
                          key={props.day.toString()}
                          badgeContent={""}
                          slotProps={{
                            badge: {
                              style: {
                                width: 3, height: 3, padding: 0, top: 8, left: 30,
                                backgroundColor: isBadged ? "#1976d2" : undefined,
                              }
                            }
                          }}
                        >
                          <PickersDay
                            {...other}
                            day={day}
                            selected={isSelected}
                            outsideCurrentMonth={outsideCurrentMonth}
                            style={{
                              color: color,
                              borderRadius: borderRadius,
                              backgroundColor: backgroundColor,
                              boxShadow: boxShadow,
                              zIndex: zIndex,
                            }}
                            onDaySelect={(day) => {
                              setDATE((prev) => ({
                                ...prev,
                                dateStart: getYearStartFmt(day),
                                dateEnd: getYearEndFmt(day),
                              }));
                            }}
                          />
                        </Badge>
                      )
                    },
                    previousIconButton: (props) => (
                      <Btn
                        {...props}
                        className={"fs-1-4rem"}
                        onClick={() => {
                          setDATE((prev) => ({
                            ...prev,
                            dateStart: getPrevYearStartFmt(prev.dateStart),
                            dateEnd: getPrevYearEndFmt(prev.dateStart),
                          }));
                        }}
                      >
                        {props.children}
                      </Btn>
                    ),
                    nextIconButton: (props) => (
                      <Btn
                        {...props}
                        className={"fs-1-4rem"}
                        onClick={() => {
                          setDATE((prev) => ({
                            ...prev,
                            dateStart: getNextYearStartFmt(prev.dateStart),
                            dateEnd: getNextYearEndFmt(prev.dateStart),
                          }));
                        }}
                      >
                        {props.children}
                      </Btn>
                    )
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        }
        children={(popTrigger: any) => (
          <Input
            label={translate("duration")}
            value={durStr}
            inputclass={`pointer ${selectTypeInListStr}`}
            readOnly={true}
            startadornment={
              <Img
                max={25}
                hover={true}
                shadow={false}
                radius={false}
              	src={"common1.webp"}
              />
            }
            endadornment={
              <Div className={"d-row-center"}>
                <Div className={"mr-n10px"}>
                  <Icons
                    key={"ChevronLeft"}
                    name={"ChevronLeft"}
                    className={"w-20px h-20px"}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setDATE((prev) => ({
                        ...prev,
                        dateStart: getPrevYearStartFmt(prev.dateStart),
                        dateEnd: getPrevYearEndFmt(prev.dateStart),
                      }));
                    }}
                  />
                </Div>
                <Div className={"mr-n15px"}>
                  <Icons
                    key={"ChevronRight"}
                    name={"ChevronRight"}
                    className={"w-20px h-20px"}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setDATE((prev) => ({
                        ...prev,
                        dateStart: getNextYearStartFmt(prev.dateStart),
                        dateEnd: getNextYearEndFmt(prev.dateStart),
                      }));
                    }}
                  />
                </Div>
              </Div>
            }
            onClick={(e: any) => {
              popTrigger.openPopup(e.currentTarget);
            }}
          />
        )}
      />
    );

    // 7. select -----------------------------------------------------------------------------------
    const selectSection = () => (
      <PopUp
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={
          <Grid container={true} spacing={2} className={"w-min-70vw"}>
            <Grid size={12} className={"d-row-center"}>
              <Div className={"fs-1-2rem fw-600 mr-10px"}>
                {translate("viewSelect")}
              </Div>
              <Div className={"fs-0-8rem fw-500 dark"}>
                {`[${DATE?.dateStart} - ${DATE?.dateEnd}]`}
              </Div>
            </Grid>
            <Grid size={12} className={"d-center"}>
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLang}>
                <DateCalendar
                  timezone={localTimeZone}
                  views={["day"]}
                  readOnly={false}
                  value={getDayNotFmt(DATE.dateStart || DATE.dateEnd)}
                  className={"border-1 radius-2"}
                  showDaysOutsideCurrentMonth={true}
                  slots={{
                    day: (props) => {
                      const { outsideCurrentMonth, day, ...other } = props;

                      let isSelected = false;
                      let isBadged = false;
                      let isFirst = false;
                      let isLast = false;

                      let color = "";
                      let borderRadius = "";
                      let backgroundColor = "";
                      let boxShadow = "";
                      let zIndex = 0;

                      // badge 표시는 일 단위로 표시
                      if (EXIST?.day) {
                        EXIST?.day.forEach((item: any) => {
                          if (
                            item.split(" - ") &&
                            item.split(" - ")?.length === 2 &&
                            getDayFmt(day) >= item.split(" - ")[0] &&
                            getDayFmt(day) <= item.split(" - ")[1]
                          ) {
                            isBadged = true;
                          }
                        });
                      }

                      if (DATE.dateStart && DATE.dateEnd) {
                        isSelected = DATE.dateStart <= getDayFmt(day) && DATE.dateEnd >= getDayFmt(day);
                        isFirst = DATE.dateStart === getDayStartFmt(day);
                        isLast = DATE.dateEnd === getDayEndFmt(day);
                      }

                      if (isSelected) {
                        if (isFirst && isLast) {
                          boxShadow = "0 0 0 0 #1976d2";
                          borderRadius = "50%";
                        }
                        else if (isFirst) {
                          boxShadow = "5px 0 0 0 #1976d2";
                          borderRadius = "50% 0 0 50%";
                        }
                        else if (isLast) {
                          boxShadow = "-5px 0 0 0 #1976d2";
                          borderRadius = "0 50% 50% 0";
                        }
                        else {
                          boxShadow = "5px 0 0 0 #1976d2";
                          borderRadius = "0%";
                        }
                        color = "#ffffff";
                        backgroundColor = "#1976d2";
                        zIndex = 10;
                      }
                      return (
                        <Badge
                          key={props.day.toString()}
                          badgeContent={""}
                          slotProps={{
                            badge: {
                              style: {
                                width: 3, height: 3, padding: 0, top: 8, left: 30,
                                backgroundColor: isBadged ? "#1976d2" : undefined,
                              }
                            }
                          }}
                        >
                          <PickersDay
                            {...other}
                            day={day}
                            selected={isSelected}
                            outsideCurrentMonth={outsideCurrentMonth}
                            style={{
                              color: color,
                              borderRadius: borderRadius,
                              backgroundColor: backgroundColor,
                              boxShadow: boxShadow,
                              zIndex: zIndex,
                            }}
                            onDaySelect={(day) => {
                              if (
                                !DATE.dateStart ||
                                DATE.dateEnd ||
                                getDayNotFmt(day).isBefore(DATE.dateStart)
                              ) {
                                setDATE((prev) => ({
                                  ...prev,
                                  dateStart: getDayFmt(day),
                                  dateEnd: "",
                                }));
                              }
                              else {
                                setDATE((prev) => ({
                                  ...prev,
                                  dateStart: getDayFmt(prev.dateStart),
                                  dateEnd: getDayFmt(day),
                                }));
                              }
                            }}
                          />
                        </Badge>
                      )
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        }
        children={(popTrigger: any) => (
          <Input
            label={translate("duration")}
            value={durStr}
            inputclass={`pointer ${selectTypeInListStr}`}
            readOnly={true}
            startadornment={
              <Img
                max={25}
                hover={true}
                shadow={false}
                radius={false}
              	src={"common1.webp"}
              />
            }
            onClick={(e: any) => {
              popTrigger.openPopup(e.currentTarget);
            }}
          />
        )}
      />
    );

    // 10. return ----------------------------------------------------------------------------------
    return (

      // 1-1. 리스트 (목표 - 오늘)
      isTodayGoalList ? (
        <Grid container={true} spacing={1}>
          <Grid size={3} className={"d-center"}>
            {selectTypeInListSection()}
          </Grid>
          <Grid size={9} className={"d-center"}>
            {selectTypeInList === "day" && daySection()}
          </Grid>
        </Grid>
      )

      // 1-2. 리스트 (목표)
      : isGoalList ? (
        <Grid container={true} spacing={1}>
          <Grid size={3} className={"d-center"}>
            {selectTypeInListSection()}
          </Grid>
          <Grid size={9} className={"d-center"}>
            {selectTypeInList === "day" && daySection()}
            {selectTypeInList === "week" && weekSection()}
            {selectTypeInList === "month" && monthSection()}
            {selectTypeInList === "year" && yearSection()}
            {selectTypeInList === "select" && selectSection()}
          </Grid>
        </Grid>
      )

      // 1-3. 리스트 (실제 - 오늘)
      : isTodayList ? (
        <Grid container={true} spacing={1}>
          <Grid size={3} className={"d-center"}>
            {selectTypeInListSection()}
          </Grid>
          <Grid size={9} className={"d-center"}>
            {selectTypeInList === "day" && daySection()}
          </Grid>
        </Grid>
      )

      // 1-4. 리스트 (실제)
      : isRealList ? (
        <Grid container={true} spacing={1}>
          <Grid size={3} className={"d-center"}>
            {selectTypeInListSection()}
          </Grid>
          <Grid size={9} className={"d-center"}>
            {selectTypeInList === "day" && daySection()}
            {selectTypeInList === "week" && weekSection()}
            {selectTypeInList === "month" && monthSection()}
            {selectTypeInList === "year" && yearSection()}
            {selectTypeInList === "select" && selectSection()}
          </Grid>
        </Grid>
      )

      // 2-1. 세이브 (일정)
      : isCalendarDetail ? (
        <Grid container={true} spacing={1}>
          <Grid size={{ xs: 4, sm: 3 }} className={"d-center"}>
            {selectTypeInSaveSection()}
          </Grid>
          <Grid size={{ xs: 8, sm: 9 }} className={"d-center"}>
            {DATE.dateType === "day" && daySection()}
            {DATE.dateType === "week" && weekSection()}
            {DATE.dateType === "month" && monthSection()}
            {DATE.dateType === "year" && yearSection()}
            {DATE.dateType === "select" && selectSection()}
          </Grid>
        </Grid>
      )

      // 2-2. 세이브 (목표)
      : isGoalDetail ? (
        <Grid container={true} spacing={1}>
          <Grid size={{ xs: 4, sm: 3 }} className={"d-center"}>
            {selectTypeInSaveSection()}
          </Grid>
          <Grid size={{ xs: 8, sm: 9 }} className={"d-center"}>
            {DATE.dateType === "week" && weekSection()}
            {DATE.dateType === "month" && monthSection()}
            {DATE.dateType === "year" && yearSection()}
          </Grid>
        </Grid>
      )

      // 2-3. 세이브 (실제)
      : isRealDetail ? (
        <Grid container={true} spacing={1}>
          <Grid size={{ xs: 4, sm: 3 }} className={"d-center"}>
            {selectTypeInSaveSection()}
          </Grid>
          <Grid size={{ xs: 8, sm: 9 }} className={"d-center"}>
            {DATE.dateType === "day" && daySection()}
          </Grid>
        </Grid>
      )
      : null
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {pickerNode()}
    </>
  );
};

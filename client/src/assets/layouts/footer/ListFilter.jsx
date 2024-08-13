// ListFilter.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {useTranslate, useStorage} from "../../../import/ImportHooks.jsx";
import {moment} from "../../../import/ImportLibs.jsx";
import {Picker, Div, Br10, PopUp} from "../../../import/ImportComponents.jsx";
import {TextField, MenuItem, Card, Button} from "../../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const ListFilter = ({
  strings, objects, functions, handlers
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const location = useLocation();
  const {translate} = useTranslate();
  const PATH = location?.pathname;
  const isToday = strings?.first === "today";

  let sessionDate = sessionStorage?.getItem(`DATE(${PATH})`) || "{}";
  let parseDate = JSON?.parse(sessionDate);
  let dateStart = parseDate?.dateStart;
  let dateEnd = parseDate?.dateEnd;

  // 2-2. useStorage -------------------------------------------------------------------------------
  const [clickedType, setClickedType] = useStorage(
    `CLICKED(${PATH})`, "thisToday"
  );
  const [clickedDate, setClickedDate] = useState({
    todayDate: {
      dateType: "",
      dateStart: moment().tz("Asia/Seoul").format("YYYY-MM-DD"),
      dateEnd: moment().tz("Asia/Seoul").format("YYYY-MM-DD"),
    },
    weekDate: {
      dateType: "",
      dateStart: moment().tz("Asia/Seoul").startOf("isoWeek").format("YYYY-MM-DD"),
      dateEnd: moment().tz("Asia/Seoul").endOf("isoWeek").format("YYYY-MM-DD"),
    },
    monthDate: {
      dateType: "",
      dateStart: moment().tz("Asia/Seoul").startOf("month").format("YYYY-MM-DD"),
      dateEnd: moment().tz("Asia/Seoul").endOf("month").format("YYYY-MM-DD"),
    },
    yearDate: {
      dateType: "",
      dateStart: moment().tz("Asia/Seoul").startOf("year").format("YYYY-MM-DD"),
      dateEnd: moment().tz("Asia/Seoul").endOf("year").format("YYYY-MM-DD"),
    },
    selectDate: {
      dateType: "",
      dateStart: dateStart,
      dateEnd: dateEnd,
    }
  });

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (dateStart === "") {
      dateStart = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
    }
    if (dateEnd === "") {
      dateEnd = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
    }
  }, [dateStart, dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (clickedType === "thisToday") {
      functions?.setDATE(clickedDate?.todayDate);
    }
    else if (clickedType === "thisWeek") {
      functions?.setDATE(clickedDate?.weekDate);
    }
    else if (clickedType === "thisMonth") {
      functions?.setDATE(clickedDate?.monthDate);
    }
    else if (clickedType === "thisYear") {
      functions?.setDATE(clickedDate?.yearDate);
    }
    else if (clickedType === "selectDate") {
      functions?.setDATE(clickedDate?.selectDate);
    }
  }, [clickedType]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (
      (objects?.DATE?.dateStart === clickedDate?.todayDate?.dateStart) &&
      (objects?.DATE?.dateEnd === clickedDate?.todayDate?.dateEnd)
    ) {
      setClickedType("thisToday");
    }
    else if (
      (objects?.DATE?.dateStart === clickedDate?.weekDate?.dateStart) &&
      (objects?.DATE?.dateEnd === clickedDate?.weekDate?.dateEnd)
    ) {
      setClickedType("thisWeek");
    }
    else if (
      (objects?.DATE?.dateStart === clickedDate?.monthDate?.dateStart) &&
      (objects?.DATE?.dateEnd === clickedDate?.monthDate?.dateEnd)
    ) {
      setClickedType("thisMonth");
    }
    else if (
      (objects?.DATE?.dateStart === clickedDate?.yearDate?.dateStart) &&
      (objects?.DATE?.dateEnd === clickedDate?.yearDate?.dateEnd)
    ) {
      setClickedType("thisYear");
    }
    else {
      setClickedType("selectDate");
    }
  }, [objects?.DATE]);

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

  // 4. clickNode ----------------------------------------------------------------------------------
  const clickNode = () => (
    <PopUp
      type={"dropdown"}
      position={"top"}
      direction={"center"}
      contents={({closePopup}) => (
        <Div className={"d-column p-10"}>
          <Button
            size={"small"}
            variant={"contained"}
            style={{
              lineHeight: "1.4",
              padding: "3px 9px",
              textTransform: "none",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "0.7rem",
              backgroundColor: clickedType === "thisToday" ? "#1976d2" : "#F9FAFB",
              color: clickedType === "thisToday" ? "#ffffff" : "#1976d2",
            }}
            onClick={() => {
              setClickedType("thisToday");
            }}
          >
            {translate("thisToday")}
          </Button>
          <Br10/>
          <Button
            size={"small"}
            variant={"contained"}
            style={{
              lineHeight: "1.4",
              padding: "3px 9px",
              textTransform: "none",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "0.7rem",
              backgroundColor: clickedType === "thisWeek" ? "#1976d2" :"#F9FAFB",
              color: clickedType === "thisWeek" ? "#ffffff" : "#1976d2",
            }}
            onClick={() => {
              setClickedType("thisWeek");
            }}
          >
            {translate("thisWeek")}
          </Button>
          <Br10/>
          <Button
            size={"small"}
            variant={"contained"}
            style={{
              lineHeight: "1.4",
              padding: "3px 9px",
              textTransform: "none",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "0.7rem",
              backgroundColor: clickedType === "thisMonth" ? "#1976d2" :"#F9FAFB",
              color: clickedType === "thisMonth" ? "#ffffff" : "#1976d2",
            }}
            onClick={() => {
              setClickedType("thisMonth");
            }}
          >
            {translate("thisMonth")}
          </Button>
          <Br10/>
          <Button
            size={"small"}
            variant={"contained"}
            style={{
              lineHeight: "1.4",
              padding: "3px 9px",
              textTransform: "none",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "0.7rem",
              backgroundColor: clickedType === "thisYear" ? "#1976d2" :"#F9FAFB",
              color: clickedType === "thisYear" ? "#ffffff" : "#1976d2",
            }}
            onClick={() => {
              setClickedType("thisYear");
            }}
          >
            {translate("thisYear")}
          </Button>
          <Br10/>
          <Button
            size={"small"}
            variant={"contained"}
            style={{
              lineHeight: "1.4",
              padding: "3px 9px",
              textTransform: "none",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "0.7rem",
              backgroundColor: clickedType === "selectDate" ? "#1976d2" :"#F9FAFB",
              color: clickedType === "selectDate" ? "#ffffff" : "#1976d2",
            }}
            onClick={() => {
              setClickedType("selectDate");
            }}
          >
            {translate("selectDate")}
          </Button>
        </Div>
      )}
    >
      {(popTrigger={}) => (
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
          onClick={(e) => {
            popTrigger.openPopup(e.currentTarget)
          }}
        >
          {translate(clickedType)}
        </Button>
      )}
    </PopUp>
  );

  // 7. filter -------------------------------------------------------------------------------------
  const filterNode = () => (
    <Card className={"block-wrapper d-row h-8vh shadow-none"}>
      {sortNode()}
      {pickerNode()}
      {isToday ? null : clickNode()}
    </Card>
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {filterNode()}
    </>
  );
};
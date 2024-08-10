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
  const isToday = strings?.first === "thisToday";

  // 2-2. useStorage -------------------------------------------------------------------------------
  const [clickedType, setClickedType] = useStorage(
    `CLICKED(${PATH})`, "thisToday"
  );
  const [clickedDate, setClickedDate] = useState({
    todayDate: {
      dateType: "",
      dateStart: moment.tz("Asia/Seoul").format("YYYY-MM-DD"),
      dateEnd: moment.tz("Asia/Seoul").format("YYYY-MM-DD"),
    },
    weekDate: {
      dateType: "",
      dateStart: moment.tz("Asia/Seoul").startOf("isoWeek").format("YYYY-MM-DD"),
      dateEnd: moment.tz("Asia/Seoul").endOf("isoWeek").format("YYYY-MM-DD"),
    },
    monthDate: {
      dateStart: moment.tz("Asia/Seoul").startOf("month").format("YYYY-MM-DD"),
      dateEnd: moment.tz("Asia/Seoul").endOf("month").format("YYYY-MM-DD"),
    },
    yearDate: {
      dateStart: moment.tz("Asia/Seoul").startOf("year").format("YYYY-MM-DD"),
      dateEnd: moment.tz("Asia/Seoul").endOf("year").format("YYYY-MM-DD"),
    },
    selectDate: {
      dateType: "",
      dateStart: "",
      dateEnd: "",
    }
  });
  
 const shallowEqual = (obj1, obj2) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};
  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
  switch (clickedType) {
    case "thisToday":
      functions?.setDATE(clickedDate.todayDate);
      break;
    case "thisWeek":
      functions?.setDATE(clickedDate.weekDate);
      break;
    case "thisMonth":
      functions?.setDATE(clickedDate.monthDate);
      break;
    case "thisYear":
      functions?.setDATE(clickedDate.yearDate);
      break;
    case "selectDate":
      functions?.setDATE(clickedDate.selectDate);
      break;
    default:
      break;
  }
}, [clickedType]);

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

  // 4. clickNode -----------------------------------------------------------------------------------
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
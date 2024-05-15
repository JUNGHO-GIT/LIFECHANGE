// TabBar.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {Div} from "../../import/ImportComponents.jsx";
import {Tabs, Tab, tabsClasses} from "../../import/ImportMuis.jsx";
import {Paper} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const TabBar = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const navigate = useNavigate();
  const location = useLocation();
  const PATH = location?.pathname.trim().toString();
  const partStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const typeStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";

  // 2-2. useState -------------------------------------------------------------------------------->
  const [valueDefault, setValueDefault] = useState("dash");
  const [valueCalendar, setValueCalendar] = useState("list");

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (partStr === "calendar") {
      setValueCalendar(typeStr);
    }
    else {
      setValueDefault(typeStr);
    }
  }, [partStr]);

  // 6. default ----------------------------------------------------------------------------------->
  const defaultNode = () => (
    <Div className={"block-wrapper d-row w-100vw h-7vh"}>
      <Tabs value={valueDefault}
        variant={"scrollable"}
        scrollButtons={"auto"}
        allowScrollButtonsMobile={true}
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            '&.Mui-disabled': { opacity: 0.3 },
          },
        }}
        onChange={(event, newValue) => {
          setValueDefault(newValue);
        }}>
        <Tab
          label={"통계"}
          value={"dash"}
          onClick={() => {
            setValueDefault("dash");
            navigate(`${partStr}/dash`);
          }}
        />
        <Tab
          label={"비교"}
          value={"diff"}
          onClick={() => {
            setValueDefault("diff");
            navigate(`${partStr}/diff`);
          }}
        />
        <Tab
          label={"리스트"}
          value={"list"}
          onClick={() => {
            setValueDefault("list");
            navigate(`${partStr}/list`);
          }}
        />
        <Tab
          label={"저장"}
          value={"save"}
          onClick={() => {
            setValueDefault("save");
            navigate(`${partStr}/save`);
          }}
        />
        <Tab
          label={"리스트(계획)"}
          value={"list/plan"}
          onClick={() => {
            setValueDefault("list/plan");
            navigate(`${partStr}/list/plan`);
          }}
        />
        <Tab
          label={"저장(계획)"}
          value={"save/plan"}
          onClick={() => {
            setValueDefault("save/plan");
            navigate(`${partStr}/save/plan`);
          }}
        />
      </Tabs>
    </Div>
  );

  // 6. calendar ---------------------------------------------------------------------------------->
  const calendarNode = () => (
    <Div className={"block-wrapper d-row w-100vw h-7vh"}>
      <Tabs value={valueCalendar}
        variant={"scrollable"}
        scrollButtons={"auto"}
        allowScrollButtonsMobile={true}
        onChange={(event, newValue) => {
          setValueCalendar(newValue);
        }}>
        <Tab
          label={"달력"}
          value={"list"}
          onClick={() => {
            setValueCalendar("list");
            navigate(`${partStr}/list`);
          }}
        />
      </Tabs>
    </Div>
  );

  // 7. navigation -------------------------------------------------------------------------------->
  const navigationNode = () => (
    <Paper className={"flex-wrapper p-sticky top-14vh border-bottom"}>
      {partStr === "calendar" ? calendarNode() : defaultNode()}
    </Paper>
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {navigationNode()}
    </>
  );
};
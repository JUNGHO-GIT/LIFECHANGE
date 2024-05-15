// Navigation.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {Div, Icons} from "../../import/ImportComponents.jsx";
import {BottomNavigation, BottomNavigationAction} from "../../import/ImportMuis.jsx";
import {Paper} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const Navigation = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const navigate = useNavigate();
  const location = useLocation();
  const PATH = location?.pathname.trim().toString();
  const partStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const typeStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
  const planStr = PATH?.split("/")[3] ? "plan" : "";

  // 2-2. useState -------------------------------------------------------------------------------->
  const [value, setValue] = useState("calendar");

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (partStr === "exercise") {
      setValue("exercise");
    }
    else if (partStr === "food") {
      setValue("food");
    }
    else if (partStr === "calendar") {
      setValue("calendar");
    }
    else if (partStr === "money") {
      setValue("money");
    }
    else if (partStr === "sleep") {
      setValue("sleep");
    }
  }, [partStr]);

  // 6. default ----------------------------------------------------------------------------------->
  const defaultNode = () => (
    <Div className={"block-wrapper d-row w-100vw h-7vh"}>
      <BottomNavigation showLabels={true} value={value} onChange={(event, newValue) => {
        setValue(newValue);
      }}>
        <BottomNavigationAction
          label={"운동"}
          value={"exercise"}
          className={"w-min20p"}
          icon={<Icons name={"LuDumbbell"} className={"w-16 h-16 dark"}/>}
          onClick={() => {
            setValue("exercise");
            navigate("exercise/dash");
          }}
        />
        <BottomNavigationAction
          label={"식단"}
          value={"food"}
          icon={<Icons name={"BiBowlHot"} className={"w-16 h-16 dark"}/>}
          onClick={() => {
            setValue("food");
            navigate("food/dash");
          }}
        />
        <BottomNavigationAction
          label={"달력"}
          value={"calendar"}
          icon={<Icons name={"LuCalendarCheck"} className={"w-16 h-16 dark"}/>}
          onClick={() => {
            setValue("calendar");
            navigate("calendar/list");
          }}
        />
        <BottomNavigationAction
          label={"재무"}
          value={"money"}
          icon={<Icons name={"TbPigMoney"} className={"w-16 h-16 dark"}/>}
          onClick={() => {
            setValue("money");
            navigate("money/dash");
          }}
        />
        <BottomNavigationAction
          label={"수면"}
          value={"sleep"}
          icon={<Icons name={"TbMoon"} className={"w-16 h-16 dark"}/>}
          onClick={() => {
            setValue("sleep");
            navigate("sleep/dash");
          }}
        />
      </BottomNavigation>
    </Div>
  );

  // 7. navigation -------------------------------------------------------------------------------->
  const navigationNode = () => (
    <Paper className={"flex-wrapper p-sticky bottom-0vh border-top"}>
      {defaultNode()}
    </Paper>
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {navigationNode()}
    </>
  );
};
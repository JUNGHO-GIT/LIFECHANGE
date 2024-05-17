// Navigation.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {Div} from "../../import/ImportComponents.jsx";
import {BottomNavigation, BottomNavigationAction} from "../../import/ImportMuis.jsx";
import {Paper} from "../../import/ImportMuis.jsx";
import {exercise1, food2, money2, sleep8, calendar1} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const Navigation = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const navigate = useNavigate();
  const location = useLocation();
  const PATH = location?.pathname.trim().toString();
  const firstStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";

  // 2-2. useState -------------------------------------------------------------------------------->
  const [value, setValue] = useState("calendar");

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (firstStr === "calendar") {
      setValue("calendar");
    }
    else if (firstStr === "exercise") {
      setValue("exercise");
    }
    else if (firstStr === "food") {
      setValue("food");
    }
    else if (firstStr === "money") {
      setValue("money");
    }
    else if (firstStr === "sleep") {
      setValue("sleep");
    }
  }, [firstStr]);

  // 6. default ----------------------------------------------------------------------------------->
  const defaultNode = () => (
    <Div className={"block-wrapper d-row w-100vw h-7vh"}>
      <BottomNavigation
        showLabels={true}
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}>
        <BottomNavigationAction
          label={"운동"}
          value={"exercise"}
          className={"w-min20p"}
          icon={<img src={exercise1} className={"w-16 h-16 icon"} alt={"exercise1"}/>}
          onClick={() => {
            setValue("exercise");
            navigate("exercise/dash/list");
          }}
        />
        <BottomNavigationAction
          label={"식단"}
          value={"food"}
          icon={<img src={food2} className={"w-16 h-16 icon"} alt={"food2"}/>}
          onClick={() => {
            setValue("food");
            navigate("food/dash/list");
          }}
        />
        <BottomNavigationAction
          label={"일정"}
          value={"calendar"}
          icon={<img src={calendar1} className={"w-16 h-16 icon"} alt={"calendar1"}/>}
          onClick={() => {
            setValue("calendar");
            navigate("calendar/list");
          }}
        />
        <BottomNavigationAction
          label={"재무"}
          value={"money"}
          icon={<img src={money2} className={"w-16 h-16 icon"} alt={"money2"}/>}
          onClick={() => {
            setValue("money");
            navigate("money/dash/list");
          }}
        />
        <BottomNavigationAction
          label={"수면"}
          value={"sleep"}
          icon={<img src={sleep8} className={"w-16 h-16 icon"} alt={"sleep8"}/>}
          onClick={() => {
            setValue("sleep");
            navigate("sleep/dash/list");
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
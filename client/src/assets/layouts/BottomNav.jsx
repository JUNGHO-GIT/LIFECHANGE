// BottomNav.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {Div} from "../../import/ImportComponents.jsx";
import {BottomNavigation, BottomNavigationAction, Paper} from "../../import/ImportMuis.jsx";
import {calendar1, exercise1, food1, money1, sleep1} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const BottomNav = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
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
          label={translate("bottomNav-exercise")}
          value={"exercise"}
          className={"w-min20p"}
          icon={<img src={exercise1} className={"w-16 h-16 icon"} alt={"exercise1"}/>}
          onClick={() => {
            setValue("exercise");
            navigate("exercise/diff/list");
          }}
        />
        <BottomNavigationAction
          label={translate("bottomNav-food")}
          value={"food"}
          icon={<img src={food1} className={"w-16 h-16 icon"} alt={"food1"}/>}
          onClick={() => {
            setValue("food");
            navigate("food/diff/list");
          }}
        />
        <BottomNavigationAction
          label={translate("bottomNav-calendar")}
          value={"calendar"}
          icon={<img src={calendar1} className={"w-16 h-16 icon"} alt={"calendar1"}/>}
          onClick={() => {
            setValue("calendar");
            navigate("calendar/list");
          }}
        />
        <BottomNavigationAction
          label={translate("bottomNav-money")}
          value={"money"}
          icon={<img src={money1} className={"w-16 h-16 icon"} alt={"money1"}/>}
          onClick={() => {
            setValue("money");
            navigate("money/diff/list");
          }}
        />
        <BottomNavigationAction
          label={translate("bottomNav-sleep")}
          value={"sleep"}
          icon={<img src={sleep1} className={"w-16 h-16 icon"} alt={"sleep1"}/>}
          onClick={() => {
            setValue("sleep");
            navigate("sleep/diff/list");
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
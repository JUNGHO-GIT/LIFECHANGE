// BottomNav.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment} from "../../import/ImportLibs.jsx";
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
    <Div className={"block-wrapper d-row h-7vh"}>
      <BottomNavigation
        showLabels={true}
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}>
        <BottomNavigationAction
          label={translate("bottomNav-exercise")}
          value={"exercise"}
          icon={<img src={exercise1} className={"w-16 h-16 icon"} alt={"exercise1"}/>}
          sx={{
            fontSize: "1rem"
          }}
          onClick={() => {
            setValue("exercise");
            navigate("exercise/diff/list", {
              state: {
                dateType: "",
                dateStart: moment().format("YYYY-MM-DD"),
                dateEnd: moment().format("YYYY-MM-DD")
              }
            });
          }}
        />
        <BottomNavigationAction
          label={translate("bottomNav-food")}
          value={"food"}
          icon={<img src={food1} className={"w-16 h-16 icon"} alt={"food1"}/>}
          sx={{
            fontSize: "1rem"
          }}
          onClick={() => {
            setValue("food");
            navigate("food/diff/list", {
              state: {
                dateType: "",
                dateStart: moment().format("YYYY-MM-DD"),
                dateEnd: moment().format("YYYY-MM-DD")
              }
            });
          }}
        />
        <BottomNavigationAction
          label={translate("bottomNav-calendar")}
          value={"calendar"}
          icon={<img src={calendar1} className={"w-16 h-16 icon"} alt={"calendar1"}/>}
          sx={{
            fontSize: "1rem"
          }}
          onClick={() => {
            setValue("calendar");
            navigate("calendar/list", {
              state: {
                dateType: "",
                dateStart: moment().format("YYYY-MM-DD"),
                dateEnd: moment().format("YYYY-MM-DD")
              }
            });
          }}
        />
        <BottomNavigationAction
          label={translate("bottomNav-money")}
          value={"money"}
          icon={<img src={money1} className={"w-16 h-16 icon"} alt={"money1"}/>}
          sx={{
            fontSize: "1rem"
          }}
          onClick={() => {
            setValue("money");
            navigate("money/diff/list", {
              state: {
                dateType: "",
                dateStart: moment().format("YYYY-MM-DD"),
                dateEnd: moment().format("YYYY-MM-DD")
              }
            });
          }}
        />
        <BottomNavigationAction
          label={translate("bottomNav-sleep")}
          value={"sleep"}
          icon={<img src={sleep1} className={"w-16 h-16 icon"} alt={"sleep1"}/>}
          sx={{
            fontSize: "1rem"
          }}
          onClick={() => {
            setValue("sleep");
            navigate("sleep/diff/list", {
              state: {
                dateType: "",
                dateStart: moment().format("YYYY-MM-DD"),
                dateEnd: moment().format("YYYY-MM-DD")
              }
            });
          }}
        />
      </BottomNavigation>
    </Div>
  );

  // 7. navigation -------------------------------------------------------------------------------->
  const navigationNode = () => (
    <Paper className={"flex-wrapper p-sticky bottom-0vh border radius"}>
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
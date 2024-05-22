// BottomNav.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {useCallback, useRef} from "../../import/ImportReacts.jsx";
import {moment} from "../../import/ImportLibs.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {Div, Img} from "../../import/ImportComponents.jsx";
import {BottomNavigation, BottomNavigationAction, Paper} from "../../import/ImportMuis.jsx";
import {calendar1, exercise1, food1, money1, sleep1} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const BottomNav = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";

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
    <Div className={"block-wrapper d-row h-max7vh"}>
      <BottomNavigation
        showLabels={true}
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}>
        <BottomNavigationAction
          label={translate("bottomNav-exercise")}
          value={"exercise"}
          icon={<Img src={exercise1} className={"w-16 h-16 m-0"} />}
          onClick={() => {
            setValue("exercise");
            navigate("exercise/dash/list", {
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
          icon={<Img src={food1} className={"w-16 h-16 m-0"} />}
          onClick={() => {
            setValue("food");
            navigate("food/dash/list", {
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
          icon={<Img src={calendar1} className={"w-16 h-16 m-0"} />}
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
          icon={<Img src={money1} className={"w-16 h-16 m-0"} />}
          onClick={() => {
            setValue("money");
            navigate("money/dash/list", {
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
          icon={<Img src={sleep1} className={"w-16 h-16 m-0"} />}
          onClick={() => {
            setValue("sleep");
            navigate("sleep/dash/list", {
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
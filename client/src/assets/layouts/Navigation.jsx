// Navigation.jsx

import {React, useState, useNavigate} from "../../import/ImportReacts.jsx";
import {Div, Icons} from "../../import/ImportComponents.jsx";
import {BottomNavigation, BottomNavigationAction} from "../../import/ImportMuis.jsx";
import {Paper} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const Navigation = () => {

  const [value, setValue] = useState("exercise");
  const navigate = useNavigate();

  // 6. default ----------------------------------------------------------------------------------->
  const defaultNode = () => (
    <Div className={"block-wrapper d-row h-7vh"}>
      <BottomNavigation showLabels={true} value={value} className={"w-100p"}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}>
        <BottomNavigationAction
          label={"운동"}
          value={"exercise"}
          icon={<Icons name={"LuDumbbell"} className={"w-16 h-16 dark"}/>}
          onClick={() => {
            setValue("exercise");
            navigate("/exercise/list");
          }}
        />
        <BottomNavigationAction
          label={"식단"}
          value={"food"}
          icon={<Icons name={"BiBowlHot"} className={"w-16 h-16 dark"}/>}
          onClick={() => {
            setValue("food");
            navigate("/food/list");
          }}
        />
        <BottomNavigationAction
          label={"메인"}
          value={"calendar"}
          icon={<Icons name={"LuCalendarCheck"} className={"w-16 h-16 dark"}/>}
          onClick={() => {
            setValue("calendar");
            navigate("/calendar/list");
          }}
        />
        <BottomNavigationAction
          label={"재무"}
          value={"money"}
          icon={<Icons name={"TbPigMoney"} className={"w-16 h-16 dark"}/>}
          onClick={() => {
            setValue("money");
            navigate("/money/list");
          }}
        />
        <BottomNavigationAction
          label={"수면"}
          value={"sleep"}
          icon={<Icons name={"TbMoon"} className={"w-16 h-16 dark"}/>}
          onClick={() => {
            setValue("sleep");
            navigate("/sleep/list");
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
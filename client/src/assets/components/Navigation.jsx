// Footer.jsx

import {React, useState, useNavigate} from "../../import/ImportReacts.jsx";
import {Div, Icons} from "../../import/ImportComponents.jsx";
import {BottomNavigation, BottomNavigationAction} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const Navigation = () => {

  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const defaultNode = () => (
    <BottomNavigation
      showLabels={true}
      value={value}
      className={"w-100p"}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
    >
      <BottomNavigationAction
        label={"운동"}
        value={0}
        icon={<Icons name={"LuDumbbell"} className={"w-16 h-16 dark"}/>}
        onClick={() => {
          setValue(0);
          navigate("/exercise/list");
        }}
      />
      <BottomNavigationAction
        label={"식단"}
        value={1}
        icon={<Icons name={"BiBowlHot"} className={"w-16 h-16 dark"}/>}
        onClick={() => {
          setValue(1);
          navigate("/food/list");
        }}
      />
      <BottomNavigationAction
        label={"메인"}
        value={2}
        icon={<Icons name={"LuCalendarCheck"} className={"w-16 h-16 dark"}/>}
        onClick={() => {
          setValue(2);
          navigate("/calendar/list");
        }}
      />
      <BottomNavigationAction
        label={"재무"}
        value={3}
        icon={<Icons name={"TbPigMoney"} className={"w-16 h-16 dark"}/>}
        onClick={() => {
          setValue(3);
          navigate("/money/list");
        }}
      />
      <BottomNavigationAction
        label={"수면"}
        value={4}
        icon={<Icons name={"TbMoon"} className={"w-16 h-16 dark"}/>}
        onClick={() => {
          setValue(4);
          navigate("/sleep/list");
        }}
      />
    </BottomNavigation>
  );

  // 7. navigation -------------------------------------------------------------------------------->
  const navigationNode = () => (
    <Div className={"block-wrapper d-row border-top h-7vh"}>
      {defaultNode()}
    </Div>
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
    {navigationNode()}
    </>
  );
};